import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import conditionsData from '../../lib/coverage/conditions.json' assert { type: 'json' };
import routeTags from '../../lib/coverage/route-tags.json' assert { type: 'json' };
import { buildRouteRegistry } from '../content/route-registry.js';
import { evidenceByRoute } from '../../lib/evidence/page-evidence.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const reportDir = path.join(rootDir, 'reports', 'coverage');

const ensureDir = async () => {
  await fs.mkdir(reportDir, { recursive: true });
};

const normalizeUrl = url => (url.length > 1 ? url.replace(/\/$/, '') : url);

const registry = buildRouteRegistry();
const routeSet = new Set(registry.map(entry => normalizeUrl(entry.url)));
const tagsConfig = routeTags.routes;

const tagLookup = route => {
  const direct = tagsConfig.find(tag => tag.match && tag.match === route);
  if (direct) return direct;
  const prefix = tagsConfig.find(tag => tag.matchPrefix && route.startsWith(tag.matchPrefix));
  return prefix || null;
};

const conditionIndex = new Map();
conditionsData.conditions.forEach(condition => {
  conditionIndex.set(condition.conditionId, {
    ...condition,
    pillarExists: false,
    clusterCount: 0,
    tools: new Set(),
    routes: [],
    citationsPresent: false,
    lastReviewedPresent: false,
    trustLinksPresent: true,
    missing: {
      pillar: false,
      clusters: [],
      tools: [],
    },
  });
});

const trustRoutes = registry.filter(entry => entry.type === 'trust');
const trustLinksPresent = trustRoutes.length > 0;

const supportsEvidence = route => Boolean(evidenceByRoute[route]?.citations || evidenceByRoute[route]?.citationsByRegion);
const supportsLastReviewed = route => Boolean(evidenceByRoute[route]?.reviewedAt);

registry.forEach(route => {
  const normalized = normalizeUrl(route.url);
  const tag = tagLookup(normalized);
  if (!tag || !tag.conditions?.length) return;

  tag.conditions.forEach(conditionId => {
    const entry = conditionIndex.get(conditionId);
    if (!entry) return;

    entry.routes.push({
      url: normalized,
      type: tag.type || route.type,
      locale: route.locale,
      title: route.title,
      description: route.description,
    });

    if ((tag.type || route.type) === 'pillar') {
      entry.pillarExists = true;
    }

    if ((tag.type || route.type) === 'cluster') {
      entry.clusterCount += 1;
    }

    if ((tag.type || route.type) === 'tool') {
      tag.conditions?.length;
      entry.tools.add(normalized);
    }

    if (supportsEvidence(normalized)) {
      entry.citationsPresent = true;
    }

    if (supportsLastReviewed(normalized)) {
      entry.lastReviewedPresent = true;
    }
  });
});

const coverageMatrix = [];
const gaps = [];
const backlogItems = [];
const missingLinks = [];
const missingLocaleRoutes = [];
const missingLocaleAlternates = [];

const hasLocaleVariant = url =>
  routeSet.has(normalizeUrl(url)) ||
  routeSet.has(normalizeUrl(`/uk${url}`)) ||
  routeSet.has(normalizeUrl(`/us${url}`));

const hasAllLocales = url =>
  routeSet.has(normalizeUrl(`/uk${url}`)) && routeSet.has(normalizeUrl(`/us${url}`));

conditionsData.conditions.forEach(condition => {
  const entry = conditionIndex.get(condition.conditionId);
  if (!entry) return;

  entry.trustLinksPresent = trustLinksPresent;

  const toolsArray = Array.from(entry.tools);
  const clusterMinimum = conditionsData.minClusterCount || 5;
  const coverageScore = [
    entry.pillarExists ? 1 : 0,
    entry.clusterCount >= clusterMinimum ? 1 : 0,
    toolsArray.length >= 2 ? 1 : 0,
    entry.citationsPresent ? 1 : 0,
    entry.lastReviewedPresent ? 1 : 0,
    trustLinksPresent ? 1 : 0,
  ].reduce((sum, val) => sum + val, 0);

  if (condition.requiredPillar && !entry.pillarExists) {
    entry.missing.pillar = true;
  }

  if (condition.requiredPillar && !condition.pillarPath) {
    missingLinks.push({
      conditionId: condition.conditionId,
      type: 'pillar',
      path: 'missing pillarPath',
    });
  }

  if (condition.pillarPath && !hasLocaleVariant(condition.pillarPath)) {
    missingLinks.push({
      conditionId: condition.conditionId,
      type: 'pillar',
      path: condition.pillarPath,
    });
  }

  condition.starterGuides.forEach(guide => {
    if (!hasLocaleVariant(guide)) {
      missingLinks.push({
        conditionId: condition.conditionId,
        type: 'guide',
        path: guide,
      });
    }
    if (guide.startsWith('/guides/') && !hasAllLocales(guide)) {
      missingLocaleAlternates.push({
        conditionId: condition.conditionId,
        type: 'guide',
        path: guide,
      });
    }
  });

  condition.tools.forEach(tool => {
    if (!hasLocaleVariant(tool)) {
      missingLinks.push({
        conditionId: condition.conditionId,
        type: 'tool',
        path: tool,
      });
    }
  });

  const missingClusters = entry.clusterCount < clusterMinimum ? condition.recommendedClusters : [];
  entry.missing.clusters = missingClusters;

  const missingTools = condition.tools.filter(tool => !toolsArray.includes(tool));
  entry.missing.tools = missingTools;

  if (entry.missing.pillar || missingClusters.length || missingTools.length) {
    gaps.push({
      conditionId: condition.conditionId,
      missingPillar: entry.missing.pillar,
      missingClusters,
      missingTools,
    });
  }

  const prioritisationScore = condition.aliases.length + condition.supportNeeds.length + (entry.missing.pillar ? 5 : 0);
  backlogItems.push({
    conditionId: condition.conditionId,
    canonicalName: condition.canonicalName,
    priorityScore: prioritisationScore,
    missingPillar: entry.missing.pillar,
    recommendedClusters: condition.recommendedClusters,
    recommendedTools: condition.tools,
    recommendedFaqs: condition.recommendedFaqs,
  });

  coverageMatrix.push({
    conditionId: condition.conditionId,
    canonicalName: condition.canonicalName,
    scope: condition.scope,
    category: condition.category,
    pillarExists: entry.pillarExists,
    clusters: entry.clusterCount,
    tools: toolsArray,
    trustLinksPresent,
    citationsPresent: entry.citationsPresent,
    lastReviewedPresent: entry.lastReviewedPresent,
    coverageScore,
  });
});

['/uk/conditions', '/us/conditions'].forEach(route => {
  if (!routeSet.has(normalizeUrl(route))) {
    missingLocaleRoutes.push(route);
  }
});

backlogItems.sort((a, b) => b.priorityScore - a.priorityScore);

const matrixReport = {
  generatedAt: new Date().toISOString(),
  minClusterCount: conditionsData.minClusterCount,
  totalConditions: conditionsData.conditions.length,
  matrix: coverageMatrix,
  gaps,
  missingLinks,
  missingLocaleRoutes,
  missingLocaleAlternates,
};

const matrixMdLines = [
  '# Conditions Coverage Matrix',
  '',
  `Generated at: ${matrixReport.generatedAt}`,
  '',
  '| Condition | Scope | Pillar | Clusters | Tools | Trust | Citations | Last reviewed | Score |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
];

coverageMatrix.forEach(row => {
  matrixMdLines.push(
    `| ${row.canonicalName} | ${row.scope} | ${row.pillarExists ? 'Yes' : 'No'} | ${row.clusters} | ${row.tools.length} | ${row.trustLinksPresent ? 'Yes' : 'No'} | ${row.citationsPresent ? 'Yes' : 'No'} | ${row.lastReviewedPresent ? 'Yes' : 'No'} | ${row.coverageScore}/6 |`,
  );
});

matrixMdLines.push('', '## Gap list');

gaps.forEach(gap => {
  matrixMdLines.push(`- ${gap.conditionId}: pillar missing=${gap.missingPillar}, clusters missing=${gap.missingClusters.length}, tools missing=${gap.missingTools.length}`);
});

matrixMdLines.push('', '## Missing links');
if (missingLinks.length) {
  missingLinks.forEach(link => {
    matrixMdLines.push(`- ${link.conditionId}: ${link.type} -> ${link.path}`);
  });
} else {
  matrixMdLines.push('- None');
}

matrixMdLines.push('', '## Locale routes');
if (missingLocaleRoutes.length) {
  missingLocaleRoutes.forEach(route => {
    matrixMdLines.push(`- Missing ${route}`);
  });
} else {
  matrixMdLines.push('- /uk/conditions and /us/conditions present');
}

matrixMdLines.push('', '## Missing locale alternates');
if (missingLocaleAlternates.length) {
  missingLocaleAlternates.forEach(entry => {
    matrixMdLines.push(`- ${entry.conditionId}: ${entry.type} -> ${entry.path}`);
  });
} else {
  matrixMdLines.push('- All guide links have UK/US alternates');
}

const backlogMdLines = [
  '# Conditions coverage backlog',
  '',
  `Generated at: ${matrixReport.generatedAt}`,
  '',
  '## Top 10 priorities',
];

backlogItems.slice(0, 10).forEach(item => {
  backlogMdLines.push(`- ${item.canonicalName} (score ${item.priorityScore})`);
  backlogMdLines.push(`  - Missing pillar: ${item.missingPillar ? 'Yes' : 'No'}`);
  backlogMdLines.push(`  - Recommended clusters: ${item.recommendedClusters.slice(0, 5).join(', ')}`);
  backlogMdLines.push(`  - Recommended tools: ${item.recommendedTools.join(', ')}`);
  backlogMdLines.push(`  - Suggested FAQs: ${item.recommendedFaqs.slice(0, 3).join(' | ')}`);
});

await ensureDir();
await fs.writeFile(path.join(reportDir, 'conditions-coverage-matrix.json'), JSON.stringify(matrixReport, null, 2));
await fs.writeFile(path.join(reportDir, 'conditions-coverage-matrix.md'), matrixMdLines.join('\n'));
await fs.writeFile(path.join(reportDir, 'coverage-backlog.md'), backlogMdLines.join('\n'));

const missingRequiredPillars = conditionsData.conditions.filter(condition => {
  if (!condition.requiredPillar) return false;
  const entry = conditionIndex.get(condition.conditionId);
  return entry ? !entry.pillarExists : true;
});
if (missingRequiredPillars.length) {
  console.error('Coverage validation failed: missing required pillars.');
  process.exit(1);
}

if (!trustLinksPresent) {
  console.error('Coverage validation failed: trust links missing.');
  process.exit(1);
}

if (missingLinks.length) {
  console.error('Coverage validation failed: broken internal links detected.');
  process.exit(1);
}

if (missingLocaleRoutes.length) {
  console.error('Coverage validation failed: missing locale conditions routes.');
  process.exit(1);
}

if (missingLocaleAlternates.length) {
  console.error('Coverage validation failed: missing locale alternates.');
  process.exit(1);
}

console.log('Coverage matrix generated.');
