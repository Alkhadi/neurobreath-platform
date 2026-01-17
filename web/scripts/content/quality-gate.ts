import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import { buildRouteRegistry, type RouteRegistryEntry } from './route-registry';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const reportDir = path.join(rootDir, 'reports');
const jsonReportPath = path.join(reportDir, 'content-quality-report.json');
const mdReportPath = path.join(reportDir, 'content-quality-report.md');

const BASE_URL = process.env.QUALITY_GATE_BASE_URL || 'http://localhost:3000';
const PORT = Number(process.env.PORT || 3000);
const SHOULD_START = process.argv.includes('--start');
const SKIP_BUILD = process.argv.includes('--skipBuild');
const USE_DEV_SERVER = process.argv.includes('--dev');

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fetchOk = async (url: string) => {
  try {
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
};

const runCommand = (cmd: string, args: string[], cwd: string) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: false });
    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} failed with code ${code}`));
    });
  });

const ensureServer = async () => {
  const ok = await fetchOk(`${BASE_URL}/robots.txt`);
  if (ok) return undefined;
  if (!SHOULD_START && !process.env.CI) {
    throw new Error(`Server not reachable at ${BASE_URL}. Run with --start or start the server first.`);
  }

  const buildIdPath = path.join(rootDir, '.next', 'BUILD_ID');
  if (!USE_DEV_SERVER && !SKIP_BUILD && !fs.existsSync(buildIdPath)) {
    await runCommand('yarn', ['build'], rootDir);
  }

  const child = spawn('yarn', [USE_DEV_SERVER ? 'dev' : 'start', '-p', String(PORT)], {
    cwd: rootDir,
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'inherit',
    shell: false,
  });

  for (let i = 0; i < 20; i += 1) {
    if (await fetchOk(`${BASE_URL}/robots.txt`)) return child;
    await sleep(1000);
  }

  throw new Error('Failed to start server for quality gate.');
};

const syllableCount = (word: string) => {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleaned) return 0;
  const matches = cleaned.match(/[aeiouy]+/g);
  const count = matches ? matches.length : 1;
  return Math.max(1, count);
};

const readabilityScore = (text: string) => {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = words.reduce((sum, word) => sum + syllableCount(word), 0);
  const sentenceCount = Math.max(sentences.length, 1);
  const wordCount = Math.max(words.length, 1);
  const asl = wordCount / sentenceCount;
  const asw = syllables / wordCount;
  const score = 206.835 - 1.015 * asl - 84.6 * asw;
  return {
    score: Number(score.toFixed(1)),
    avgSentenceLength: Number(asl.toFixed(1)),
  };
};

const headingLevel = (tag: string) => Number(tag.replace('h', ''));

const isKeyRoute = (entry: RouteRegistryEntry) => ['pillar', 'cluster', 'trust'].includes(entry.type);

const normaliseUrl = (url: string) => (url.length > 1 ? url.replace(/\/$/, '') : url);

const computeInboundLinks = (pageLinks: Record<string, Set<string>>) => {
  const inbound: Record<string, number> = {};
  Object.entries(pageLinks).forEach(([source, targets]) => {
    targets.forEach(target => {
      const key = normaliseUrl(target);
      inbound[key] = (inbound[key] || 0) + 1;
    });
  });
  return inbound;
};

const buildReport = async () => {
  const registry = buildRouteRegistry();
  const server = await ensureServer();
  const browser = await chromium.launch();
  const pageLinks: Record<string, Set<string>> = {};
  const pageData: Array<any> = [];

  for (const entry of registry) {
    const url = `${BASE_URL}${entry.url}`;
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('main', { timeout: 60000 }).catch(() => undefined);

    const title = await page.title();
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
    const robotsMetas = await page.$$eval('meta[name="robots"]', els =>
      els.map(el => el.getAttribute('content') || '').filter(Boolean),
    );
    const robots = robotsMetas[0] || null;

    const h1s = await page.$$eval('h1', els => els.map(el => el.textContent?.trim() || '').filter(Boolean));
    const headings = await page.$$eval('h1, h2, h3, h4', els =>
      els.map(el => ({ tag: el.tagName.toLowerCase(), text: el.textContent?.trim() || '' })),
    );

    const links = await page.$$eval('a[href^="/"]', els =>
      els.map(el => ({
        href: el.getAttribute('href') || '',
        text: (el.textContent || '').trim(),
      })),
    );

    const imageData = await page.$$eval('img', els =>
      els.map(el => ({
        src: el.getAttribute('src') || '',
        alt: el.getAttribute('alt'),
        ariaHidden: el.getAttribute('aria-hidden'),
        role: el.getAttribute('role'),
      })),
    );

    const jsonLdBlocks = await page.$$eval('script[type="application/ld+json"]', els =>
      els.map(el => el.textContent || ''),
    );

    let mainText = '';
    let paragraphs: string[] = [];
    let listCount = 0;
    try {
      mainText = await page.$eval('main', el => el.textContent || '');
      paragraphs = await page.$$eval('main p', els => els.map(el => (el.textContent || '').trim()));
      listCount = await page.$$eval('main ul, main ol', els => els.length);
    } catch {
      mainText = '';
      paragraphs = [];
      listCount = 0;
    }

    const issues: Array<{ severity: 'CRITICAL' | 'WARN'; code: string; message: string }> = [];

    if (robotsMetas.length !== 1) {
      issues.push({
        severity: 'CRITICAL',
        code: 'ROBOTS_META_COUNT',
        message: `Expected exactly 1 meta[name="robots"], found ${robotsMetas.length} (${robotsMetas.join(' | ')}) on ${entry.url}`,
      });
    }

    if (!title) issues.push({ severity: 'CRITICAL', code: 'SEO_TITLE_MISSING', message: 'Title is missing.' });
    if (title && (title.length < 30 || title.length > 60)) {
      issues.push({ severity: 'WARN', code: 'SEO_TITLE_LENGTH', message: `Title length ${title.length} outside 30-60.` });
    }
    if (!metaDescription) issues.push({ severity: 'CRITICAL', code: 'SEO_DESCRIPTION_MISSING', message: 'Meta description is missing.' });
    if (metaDescription && (metaDescription.length < 120 || metaDescription.length > 160)) {
      issues.push({ severity: 'WARN', code: 'SEO_DESCRIPTION_LENGTH', message: `Description length ${metaDescription.length} outside 120-160.` });
    }
    if (!canonical) issues.push({ severity: 'CRITICAL', code: 'SEO_CANONICAL_MISSING', message: 'Canonical is missing.' });

    if (h1s.length === 0) issues.push({ severity: 'CRITICAL', code: 'SEO_H1_MISSING', message: 'No H1 found.' });
    if (h1s.length > 1) issues.push({ severity: 'CRITICAL', code: 'SEO_H1_MULTIPLE', message: 'Multiple H1s found.' });

    let lastLevel = 0;
    headings.forEach(heading => {
      const level = headingLevel(heading.tag);
      if (lastLevel && level - lastLevel > 1) {
        issues.push({
          severity: 'WARN',
          code: 'HEADING_ORDER',
          message: `Heading level jumps from H${lastLevel} to H${level}.`,
        });
      }
      lastLevel = level;
    });

    if (!ogTitle || !ogDescription) {
      issues.push({
        severity: isKeyRoute(entry) ? 'CRITICAL' : 'WARN',
        code: 'OG_MISSING',
        message: 'OpenGraph metadata missing.',
      });
    }
    if (!twitterCard || !twitterTitle || !twitterDescription) {
      issues.push({
        severity: isKeyRoute(entry) ? 'CRITICAL' : 'WARN',
        code: 'TWITTER_MISSING',
        message: 'Twitter metadata missing.',
      });
    }

    if (robots && robots.includes('noindex') && isKeyRoute(entry)) {
      issues.push({ severity: 'CRITICAL', code: 'ROBOTS_NOINDEX', message: 'Key route is noindex.' });
    }

    if (entry.url.startsWith('/uk') || entry.url.startsWith('/us')) {
      const hreflangs = await page.$$eval('link[rel="alternate"]', els =>
        els.map(el => ({ href: el.getAttribute('href'), lang: el.getAttribute('hreflang') })),
      );
      const enGb = hreflangs.find(link => link.lang === 'en-GB');
      const enUs = hreflangs.find(link => link.lang === 'en-US');
      if (!enGb || !enUs) {
        issues.push({ severity: 'CRITICAL', code: 'HREFLANG_MISSING', message: 'Missing hreflang alternates.' });
      }
      if (canonical && entry.url.startsWith('/uk') && !canonical.includes('/uk/')) {
        issues.push({ severity: 'CRITICAL', code: 'CANONICAL_LOCALE_MISMATCH', message: 'Canonical points to non-UK URL.' });
      }
      if (canonical && entry.url.startsWith('/us') && !canonical.includes('/us/')) {
        issues.push({ severity: 'CRITICAL', code: 'CANONICAL_LOCALE_MISMATCH', message: 'Canonical points to non-US URL.' });
      }
    }

    const anchorIssues = links.filter(link => !link.text || /click here/i.test(link.text));
    if (anchorIssues.length) {
      issues.push({ severity: 'CRITICAL', code: 'ANCHOR_TEXT_INVALID', message: 'Empty or generic anchor text found.' });
    }

    const anchorCount: Record<string, number> = {};
    links.forEach(link => {
      if (!link.text) return;
      anchorCount[link.text.toLowerCase()] = (anchorCount[link.text.toLowerCase()] || 0) + 1;
    });
    Object.entries(anchorCount).forEach(([text, count]) => {
      if (count >= 6) {
        issues.push({ severity: 'WARN', code: 'ANCHOR_TEXT_REPETITION', message: `Anchor "${text}" repeated ${count} times.` });
      }
    });

    const imageMissingAlt = imageData.filter(img => !img.alt && img.ariaHidden !== 'true' && img.role !== 'presentation');
    if (imageMissingAlt.length) {
      issues.push({ severity: 'CRITICAL', code: 'IMG_ALT_MISSING', message: 'Images missing alt text.' });
    }
    const placeholderAlt = imageData.filter(img => img.alt && /^(image|photo|picture)$/i.test(img.alt.trim()));
    if (placeholderAlt.length) {
      issues.push({ severity: 'WARN', code: 'IMG_ALT_PLACEHOLDER', message: 'Placeholder alt text detected.' });
    }

    const faviconLinks = await page.$$eval('link[rel~="icon"], link[rel="apple-touch-icon"]', els =>
      els.map(el => el.getAttribute('href') || ''),
    );
    if (!faviconLinks.length) {
      issues.push({ severity: 'WARN', code: 'FAVICON_MISSING', message: 'No favicon links found.' });
    }

    const faqUiPresent = await page.$$eval('section[aria-labelledby="faq-heading"], details summary', els => els.length > 0);
    const schemaTypes = jsonLdBlocks
      .map(block => {
        try {
          return JSON.parse(block);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .flatMap((schema: any) => {
        if (Array.isArray(schema)) return schema;
        if (schema['@graph']) return schema['@graph'];
        return [schema];
      })
      .map((schema: any) => schema['@type']);

    const hasFaqSchema = schemaTypes.includes('FAQPage');
    if (faqUiPresent && !hasFaqSchema) {
      issues.push({ severity: 'CRITICAL', code: 'FAQ_SCHEMA_MISSING', message: 'FAQ UI present without FAQPage schema.' });
    }
    if (!faqUiPresent && hasFaqSchema) {
      issues.push({ severity: 'CRITICAL', code: 'FAQ_SCHEMA_ORPHAN', message: 'FAQPage schema present without FAQ UI.' });
    }

    const hasBreadcrumbs = schemaTypes.includes('BreadcrumbList');
    if (!hasBreadcrumbs && (entry.type === 'pillar' || entry.type === 'cluster' || entry.type === 'trust')) {
      issues.push({ severity: isKeyRoute(entry) ? 'CRITICAL' : 'WARN', code: 'BREADCRUMB_MISSING', message: 'Breadcrumb schema missing.' });
    }

    const hasOrgSchema = schemaTypes.includes('Organization') || schemaTypes.includes('WebSite');
    if (!hasOrgSchema) {
      issues.push({ severity: 'WARN', code: 'ORG_SCHEMA_MISSING', message: 'Organization/WebSite schema missing.' });
    }

    const readability = readabilityScore(mainText);
    if (readability.score < 30) {
      issues.push({ severity: 'CRITICAL', code: 'READABILITY_LOW', message: `Readability score too low (${readability.score}).` });
    } else if (readability.score < 50) {
      issues.push({ severity: 'WARN', code: 'READABILITY_WARN', message: `Readability score low (${readability.score}).` });
    }

    const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 200);
    if (longParagraphs.length) {
      issues.push({ severity: 'CRITICAL', code: 'PARAGRAPH_TOO_LONG', message: 'Paragraph exceeds 200 words.' });
    }

    const avgParagraphLength = paragraphs.length
      ? paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0) / paragraphs.length
      : 0;
    if (avgParagraphLength > 120) {
      issues.push({ severity: 'WARN', code: 'PARAGRAPH_LENGTH_WARN', message: 'Average paragraph length is high.' });
    }

    if (listCount === 0 && readability.avgSentenceLength > 25) {
      issues.push({ severity: 'WARN', code: 'NO_LISTS_LONG_SENTENCES', message: 'No lists and long sentences detected.' });
    }

    pageLinks[entry.url] = new Set(links.map(link => normaliseUrl(link.href)));

    pageData.push({
      url: entry.url,
      type: entry.type,
      locale: entry.locale,
      title,
      description: metaDescription || '',
      h1: h1s[0] || '',
      seo: {
        titleOk: Boolean(title),
        descriptionOk: Boolean(metaDescription),
        canonicalOk: Boolean(canonical),
        ogOk: Boolean(ogTitle && ogDescription),
        twitterOk: Boolean(twitterCard && twitterTitle && twitterDescription),
      },
      links: {
        outboundInternal: links.length,
        missingTargets: [] as string[],
      },
      readability,
      images: {
        missingAlt: imageMissingAlt.map(img => img.src),
        placeholderAlt: placeholderAlt.map(img => img.src),
      },
      schema: {
        faqOk: !faqUiPresent || hasFaqSchema,
        breadcrumbsOk: hasBreadcrumbs,
        orgOk: hasOrgSchema,
      },
      textBlocks: paragraphs,
      issues,
    });

    await page.close();
  }

  await browser.close();
  if (server) server.kill('SIGTERM');

  const inbound = computeInboundLinks(pageLinks);
  const registryMap = new Map(registry.map(entry => [entry.url, entry]));
  const clustersByPillar: Record<string, string[]> = {};

  registry.forEach(entry => {
    if (entry.type === 'cluster' && entry.primaryPillar) {
      clustersByPillar[entry.primaryPillar] = clustersByPillar[entry.primaryPillar] || [];
      clustersByPillar[entry.primaryPillar].push(entry.url);
    }
  });

  pageData.forEach(page => {
    const inboundCount = inbound[normaliseUrl(page.url)] || 0;
    page.links.inbound = inboundCount;
    if (page.type === 'cluster') {
      if (inboundCount < 1) {
        page.issues.push({ severity: 'CRITICAL', code: 'ORPHAN_PAGE', message: 'Cluster has no inbound links.' });
      } else if (inboundCount < 2) {
        page.issues.push({ severity: 'WARN', code: 'ORPHAN_PAGE_WARN', message: 'Cluster has low inbound links.' });
      }
    }

    const links = pageLinks[page.url] || new Set<string>();
    const entry = registryMap.get(page.url);
    if (!entry) return;

    if (entry.type === 'cluster') {
      if (entry.locale === 'GLOBAL') {
        const pillarUrl = entry.primaryPillar ? normaliseUrl(`/guides/${entry.primaryPillar}`) : null;
        if (pillarUrl && !links.has(pillarUrl)) {
          page.links.missingTargets.push(pillarUrl);
          page.issues.push({ severity: 'CRITICAL', code: 'CLUSTER_MISSING_PILLAR', message: 'Cluster missing pillar hub link.' });
        }

        const siblingUrls = entry.primaryPillar ? clustersByPillar[entry.primaryPillar] || [] : [];
        const siblingCount = siblingUrls.filter(url => normaliseUrl(url) !== normaliseUrl(entry.url) && links.has(normaliseUrl(url))).length;
        if (siblingCount < 2) {
          page.links.missingTargets.push('sibling-guides');
          page.issues.push({ severity: 'CRITICAL', code: 'CLUSTER_SIBLINGS_MISSING', message: 'Cluster missing sibling links.' });
        }
      }

      const toolLinks = [...links].filter(link => link.startsWith('/tools/')).length;
      if (toolLinks < 1) {
        page.links.missingTargets.push('/tools/*');
        page.issues.push({ severity: 'CRITICAL', code: 'CLUSTER_TOOL_CTA', message: 'Cluster missing tool CTA link.' });
      }
    }

    if (entry.type === 'pillar' && entry.locale === 'GLOBAL') {
      const pillarClusters = entry.primaryPillar ? clustersByPillar[entry.primaryPillar] || [] : [];
      const clusterCount = pillarClusters.filter(url => links.has(normaliseUrl(url))).length;
      if (clusterCount < 4) {
        page.links.missingTargets.push('pillar-cluster-links');
        page.issues.push({ severity: 'CRITICAL', code: 'PILLAR_CLUSTER_LINKS', message: 'Pillar missing cluster links.' });
      }

      const toolLinks = [...links].filter(link => link.startsWith('/tools/')).length;
      if (toolLinks < 1) {
        page.links.missingTargets.push('/tools/*');
        page.issues.push({ severity: 'CRITICAL', code: 'PILLAR_TOOL_CTA', message: 'Pillar missing tool CTA link.' });
      }

      const crossPillarLinks = [...links].filter(link => link.startsWith('/guides/') && !link.startsWith(`/guides/${entry.primaryPillar}`));
      if (crossPillarLinks.length < 2) {
        page.links.missingTargets.push('cross-pillar-links');
        page.issues.push({ severity: 'CRITICAL', code: 'PILLAR_CROSS_LINKS', message: 'Pillar missing cross-pillar links.' });
      }
    }
  });

  const titleMap: Record<string, string[]> = {};
  const descMap: Record<string, string[]> = {};
  const h1Map: Record<string, string[]> = {};

  pageData.forEach(page => {
    if (page.title) {
      titleMap[page.title] = titleMap[page.title] || [];
      titleMap[page.title].push(page.url);
    }
    if (page.description) {
      descMap[page.description] = descMap[page.description] || [];
      descMap[page.description].push(page.url);
    }
    if (page.h1) {
      h1Map[page.h1] = h1Map[page.h1] || [];
      h1Map[page.h1].push(page.url);
    }
  });

  const checkDuplicates = (index: Record<string, string[]>, code: string) => {
    Object.entries(index).forEach(([value, urls]) => {
      if (urls.length > 1) {
        urls.forEach(url => {
          const page = pageData.find(item => item.url === url);
          page?.issues.push({ severity: 'CRITICAL', code, message: `Duplicate value detected: ${value}` });
        });
      }
    });
  };

  checkDuplicates(titleMap, 'DUP_TITLE');
  checkDuplicates(descMap, 'DUP_DESCRIPTION');
  checkDuplicates(h1Map, 'DUP_H1');

  const similarity = (a: string[], b: string[]) => {
    const aText = a.join(' ').toLowerCase();
    const bText = b.join(' ').toLowerCase();
    const aTokens = new Set(aText.split(/\s+/).filter(Boolean));
    const bTokens = new Set(bText.split(/\s+/).filter(Boolean));
    const intersection = [...aTokens].filter(token => bTokens.has(token)).length;
    const union = new Set([...aTokens, ...bTokens]).size || 1;
    return intersection / union;
  };

  for (let i = 0; i < pageData.length; i += 1) {
    for (let j = i + 1; j < pageData.length; j += 1) {
      const a = pageData[i];
      const b = pageData[j];
      const sim = similarity(a.textBlocks, b.textBlocks);
      if (sim > 0.9) {
        const isLocalePair = (a.url.startsWith('/uk') && b.url.startsWith('/us')) || (a.url.startsWith('/us') && b.url.startsWith('/uk'));
        const blocksIdentical = a.textBlocks.join('|') === b.textBlocks.join('|');
        if (isLocalePair && sim <= 0.95) continue;
        if (isLocalePair && blocksIdentical) {
          a.issues.push({ severity: 'CRITICAL', code: 'LOCALE_VARIANT_IDENTICAL', message: `UK/US variants identical with ${b.url}` });
          b.issues.push({ severity: 'CRITICAL', code: 'LOCALE_VARIANT_IDENTICAL', message: `UK/US variants identical with ${a.url}` });
          continue;
        }
        const severity = sim > 0.95 ? 'CRITICAL' : 'WARN';
        a.issues.push({ severity, code: 'DUPLICATE_CONTENT', message: `Similarity ${sim.toFixed(2)} with ${b.url}` });
        b.issues.push({ severity, code: 'DUPLICATE_CONTENT', message: `Similarity ${sim.toFixed(2)} with ${a.url}` });
      }
    }
  }

  const critical = pageData.reduce((count, page) => count + page.issues.filter((issue: any) => issue.severity === 'CRITICAL').length, 0);
  const warning = pageData.reduce((count, page) => count + page.issues.filter((issue: any) => issue.severity === 'WARN').length, 0);

  return {
    runAt: new Date().toISOString(),
    summary: {
      critical,
      warning,
      pagesChecked: pageData.length,
    },
    pages: pageData,
  };
};

const writeReports = (report: Awaited<ReturnType<typeof buildReport>>) => {
  ensureDir(reportDir);
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));

  const grouped: Record<string, string[]> = {};
  report.pages.forEach(page => {
    page.issues.forEach((issue: any) => {
      const key = `${issue.severity}:${issue.code}`;
      grouped[key] = grouped[key] || [];
      grouped[key].push(`${page.url} — ${issue.message}`);
    });
  });

  const lines: string[] = [
    '# Content Quality Gate Report',
    '',
    `Run at: ${report.runAt}`,
    `Pages checked: ${report.summary.pagesChecked}`,
    `Critical issues: ${report.summary.critical}`,
    `Warnings: ${report.summary.warning}`,
    '',
    '## Critical issues',
  ];

  Object.entries(grouped)
    .filter(([key]) => key.startsWith('CRITICAL'))
    .forEach(([key, items]) => {
      lines.push(`### ${key.replace('CRITICAL:', '')}`);
      items.forEach(item => lines.push(`- ${item}`));
      lines.push('');
    });

  lines.push('## Warnings');
  Object.entries(grouped)
    .filter(([key]) => key.startsWith('WARN'))
    .forEach(([key, items]) => {
      lines.push(`### ${key.replace('WARN:', '')}`);
      items.forEach(item => lines.push(`- ${item}`));
      lines.push('');
    });

  lines.push('## Top 10 pages needing improvement');
  report.pages
    .slice()
    .sort((a: any, b: any) => b.issues.length - a.issues.length)
    .slice(0, 10)
    .forEach((page: any) => {
      lines.push(`- ${page.url} (${page.issues.length} issues)`);
    });

  lines.push('');
  lines.push('## Route coverage');
  report.pages.forEach((page: any) => {
    lines.push(`- ${page.url} (${page.type}, ${page.locale})`);
  });

  fs.writeFileSync(mdReportPath, lines.join('\n'));
};

const run = async () => {
  const report = await buildReport();
  writeReports(report);

  if (report.summary.critical > 0) {
    console.error('Content quality gate failed.');
    process.exit(1);
  }

  console.log('Content quality gate passed.');
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
