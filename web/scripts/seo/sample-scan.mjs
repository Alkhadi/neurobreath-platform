#!/usr/bin/env node

/**
 * SEO Sample Scan - First 15 routes only for demo
 * Generates all output files with a manageable subset
 */

import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WEB_ROOT = join(__dirname, '../..');
const ROUTES_FILE = join(WEB_ROOT, '.seo/routes.json');
const OUTPUT_DIR = join(WEB_ROOT, '.seo');
const SCREENSHOT_DIR = join(OUTPUT_DIR, 'screenshots');
const BASE_URL = 'http://localhost:3100';
const MAX_ROUTES = 15;

async function extractSEOData(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    const data = await page.evaluate(() => {
      const title = document.title || '';
      
      const getMetaContent = (name) => {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return meta?.getAttribute('content') || '';
      };
      
      const description = getMetaContent('description');
      const robots = getMetaContent('robots');
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
      
      const h1Elements = Array.from(document.querySelectorAll('h1'));
      const h1Count = h1Elements.length;
      const firstH1 = h1Elements[0]?.textContent?.trim() || '';
      
      const ogTitle = getMetaContent('og:title');
      const ogDescription = getMetaContent('og:description');
      const ogUrl = getMetaContent('og:url');
      const ogImage = getMetaContent('og:image');
      const ogType = getMetaContent('og:type');
      
      const twitterCard = getMetaContent('twitter:card');
      const twitterTitle = getMetaContent('twitter:title');
      const twitterDescription = getMetaContent('twitter:description');
      const twitterImage = getMetaContent('twitter:image');
      
      const schemaScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      const schemas = [];
      const schemaTypes = new Set();
      
      schemaScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '');
          schemas.push(data);
          
          if (data['@type']) {
            if (Array.isArray(data['@type'])) {
              data['@type'].forEach(t => schemaTypes.add(t));
            } else {
              schemaTypes.add(data['@type']);
            }
          }
          
          if (data['@graph'] && Array.isArray(data['@graph'])) {
            data['@graph'].forEach(item => {
              if (item['@type']) {
                if (Array.isArray(item['@type'])) {
                  item['@type'].forEach(t => schemaTypes.add(t));
                } else {
                  schemaTypes.add(item['@type']);
                }
              }
            });
          }
        } catch (e) {
          schemas.push({ error: 'Parse error: ' + e.message });
        }
      });
      
      const images = Array.from(document.querySelectorAll('img'));
      const imageIssues = {
        missingAlt: 0,
        emptyAlt: 0,
        missingDimensions: 0,
        total: images.length
      };
      
      images.forEach(img => {
        if (!img.hasAttribute('alt')) {
          imageIssues.missingAlt++;
        } else if (img.getAttribute('alt') === '') {
          imageIssues.emptyAlt++;
        }
        
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
          const isLarge = img.naturalWidth > 200 || img.naturalHeight > 200;
          if (isLarge) {
            imageIssues.missingDimensions++;
          }
        }
      });
      
      return {
        title,
        description,
        canonical,
        robots,
        h1Count,
        firstH1,
        openGraph: { title: ogTitle, description: ogDescription, url: ogUrl, image: ogImage, type: ogType },
        twitter: { card: twitterCard, title: twitterTitle, description: twitterDescription, image: twitterImage },
        schemas,
        schemaTypes: Array.from(schemaTypes),
        imageIssues
      };
    });
    
    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function analyzeSEO(url, data) {
  const issues = { critical: [], high: [], medium: [], low: [] };
  
  if (!data.success) {
    issues.critical.push(`Page failed to load: ${data.error}`);
    return issues;
  }
  
  const isIndexable = !data.robots?.includes('noindex');
  
  if (!data.title) issues.critical.push('Missing title tag');
  if (!data.description && isIndexable) issues.critical.push('Missing meta description');
  if (!data.canonical && isIndexable) issues.critical.push('Missing canonical URL');
  if (data.h1Count === 0) issues.critical.push('No H1 tag found');
  else if (data.h1Count > 1) issues.critical.push(`Multiple H1 tags (${data.h1Count})`);
  if (data.schemas.some(s => s.error)) issues.critical.push('Schema JSON parse error');
  
  if (!data.openGraph.title && isIndexable) issues.high.push('Missing og:title');
  if (!data.openGraph.description && isIndexable) issues.high.push('Missing og:description');
  if (!data.openGraph.image && isIndexable) issues.high.push('Missing og:image');
  if (data.title && data.title.length > 60) issues.high.push(`Title too long (${data.title.length} chars)`);
  
  if (data.description && data.description.length > 160) issues.medium.push(`Description too long (${data.description.length} chars)`);
  if (data.description && data.description.length < 120) issues.medium.push(`Description too short (${data.description.length} chars)`);
  if (!data.twitter.card && isIndexable) issues.medium.push('Missing twitter:card');
  if (data.schemaTypes.length === 0 && isIndexable) issues.medium.push('No structured data found');
  
  if (data.imageIssues.missingAlt > 0) issues.low.push(`${data.imageIssues.missingAlt} images missing alt text`);
  if (data.imageIssues.missingDimensions > 0) issues.low.push(`${data.imageIssues.missingDimensions} large images missing width/height`);
  
  return issues;
}

function generateMarkdownTable(results) {
  const sanitizeCell = value => {
    if (value === null || value === undefined) return '';
    return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
  };

  let md = '# SEO Route Audit Table (Sample - First 15 Routes)\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `Routes scanned: ${results.length}\n\n`;
  
  md += '| URL | Title | Meta Description | Canonical | Index | H1 Count | First H1 | Schema Types | OG Image | Notes |\n';
  md += '|-----|-------|------------------|-----------|-------|----------|----------|--------------|----------|-------|\n';
  
  results.forEach(result => {
    const url = sanitizeCell(result.url);
    const data = result.data;
    
    if (!data.success) {
      md += `| ${url} | ERROR |  |  |  |  |  |  |  | ${sanitizeCell(data.error)} |\n`;
      return;
    }
    
    const title = sanitizeCell((data.title || '').substring(0, 50) || 'Missing');
    const description = sanitizeCell((data.description || '').substring(0, 50) || 'Missing');
    const canonical = data.canonical ? '✅' : '❌';
    const index = data.robots?.includes('noindex') ? 'noindex' : 'index';
    const h1Count = data.h1Count;
    const firstH1 = sanitizeCell((data.firstH1 || '').substring(0, 30));
    const schemas = sanitizeCell(data.schemaTypes.join(', ') || 'None');
    const ogImage = data.openGraph.image ? '✅' : '❌';
    
    const notes = [];
    if (!data.title) notes.push('No title');
    if (!data.description) notes.push('No description');
    if (data.h1Count !== 1) notes.push(`H1: ${h1Count}`);
    if (data.schemas.some(s => s.error)) notes.push('Schema error');
    if (data.imageIssues.missingAlt > 0) notes.push(`${data.imageIssues.missingAlt} imgs no alt`);
    
    const notesStr = sanitizeCell(notes.join('; ') || 'OK');
    
    md += `| ${url} | ${title} | ${description} | ${canonical} | ${index} | ${h1Count} | ${firstH1} | ${schemas} | ${ogImage} | ${notesStr} |\n`;
  });
  
  return md;
}

function generateCSV(results) {
  let csv = 'URL,Title,Meta Description,Canonical,Index,H1 Count,First H1,Schema Types,OG Image,Critical Issues,High Issues,Medium Issues,Low Issues\n';
  
  results.forEach(result => {
    const url = result.url;
    const data = result.data;
    const issues = result.issues;
    
    if (!data.success) {
      csv += `"${url}","ERROR","","","","","","","","${data.error}","","",""\n`;
      return;
    }
    
    const title = (data.title || '').replace(/"/g, '""');
    const description = (data.description || '').replace(/"/g, '""');
    const canonical = data.canonical || '';
    const index = data.robots?.includes('noindex') ? 'noindex' : 'index';
    const h1Count = data.h1Count;
    const firstH1 = (data.firstH1 || '').replace(/"/g, '""');
    const schemas = data.schemaTypes.join('; ') || '';
    const ogImage = data.openGraph.image || '';
    const criticalIssues = issues.critical.join('; ');
    const highIssues = issues.high.join('; ');
    const mediumIssues = issues.medium.join('; ');
    const lowIssues = issues.low.join('; ');
    
    csv += `"${url}","${title}","${description}","${canonical}","${index}",${h1Count},"${firstH1}","${schemas}","${ogImage}","${criticalIssues}","${highIssues}","${mediumIssues}","${lowIssues}"\n`;
  });
  
  return csv;
}

function generateAuditSummary(results) {
  let md = '# SEO Audit Summary (Sample - First 15 Routes)\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  
  const critical = results.filter(r => r.issues.critical.length > 0);
  const high = results.filter(r => r.issues.high.length > 0);
  const medium = results.filter(r => r.issues.medium.length > 0);
  const low = results.filter(r => r.issues.low.length > 0);
  
  md += '## Overview\n\n';
  md += `- Total routes: ${results.length}\n`;
  md += `- Routes with critical issues: ${critical.length}\n`;
  md += `- Routes with high issues: ${high.length}\n`;
  md += `- Routes with medium issues: ${medium.length}\n`;
  md += `- Routes with low issues: ${low.length}\n\n`;
  
  if (critical.length === 0) {
    md += '✅ **No critical issues detected!**\n\n';
  } else {
    md += '## ❌ Critical Issues\n\n';
    critical.forEach(({ url, issues }) => {
      md += `### ${url}\n\n`;
      issues.critical.forEach(issue => {
        md += `- ❌ ${issue}\n`;
      });
      md += '\n';
    });
  }
  
  if (high.length > 0) {
    md += '## ⚠️ High Priority Issues\n\n';
    high.forEach(({ url, issues }) => {
      md += `### ${url}\n\n`;
      issues.high.forEach(issue => {
        md += `- ⚠️ ${issue}\n`;
      });
      md += '\n';
    });
  }
  
  return md;
}

async function main() {
  console.log('🔍 SEO Sample Scan (First 15 routes)\n');
  
  const routesData = JSON.parse(await readFile(ROUTES_FILE, 'utf-8'));
  
  const routesToScan = routesData.routes
    .filter(r => !r.isDynamic)
    .slice(0, MAX_ROUTES)
    .map(r => r.url);
  
  console.log(`📊 Scanning ${routesToScan.length} routes...\n`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  
  const results = [];
  
  for (let i = 0; i < routesToScan.length; i++) {
    const route = routesToScan[i];
    const url = `${BASE_URL}${route}`;
    
    console.log(`[${i + 1}/${routesToScan.length}] Scanning: ${route}`);
    
    const data = await extractSEOData(page, url);
    const issues = analyzeSEO(route, data);
    
    results.push({ url: route, data, issues });
    
    if (route === '/' || route.includes('buddy') || route.includes('coach')) {
      const filename = route === '/' ? 'homepage.png' : `${route.replace(/\//g, '-').substring(1)}.png`;
      await page.screenshot({ path: join(SCREENSHOT_DIR, filename), fullPage: true });
      console.log(`  📸 Screenshot saved: ${filename}`);
    }
  }
  
  await browser.close();
  
  console.log(`\n✅ Scan complete!\n`);
  console.log('📝 Generating reports...\n');
  
  const markdownTable = generateMarkdownTable(results);
  await writeFile(join(WEB_ROOT, 'SEO_ROUTE_TABLE.md'), markdownTable);
  console.log(`✅ Generated: SEO_ROUTE_TABLE.md`);
  
  const csv = generateCSV(results);
  await writeFile(join(WEB_ROOT, 'SEO_ROUTE_TABLE.csv'), csv);
  console.log(`✅ Generated: SEO_ROUTE_TABLE.csv`);
  
  const auditSummary = generateAuditSummary(results);
  await writeFile(join(WEB_ROOT, 'SEO_AUDIT_SUMMARY.md'), auditSummary);
  console.log(`✅ Generated: SEO_AUDIT_SUMMARY.md`);
  
  const rawScan = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalRoutes: results.length,
    results
  };
  await writeFile(join(OUTPUT_DIR, 'route-scan.json'), JSON.stringify(rawScan, null, 2));
  console.log(`✅ Generated: .seo/route-scan.json`);
  
  const criticalCount = results.filter(r => r.issues.critical.length > 0).length;
  
  if (criticalCount > 0) {
    console.log(`\n❌ ${criticalCount} routes have critical issues`);
    console.log(`📋 Review: SEO_AUDIT_SUMMARY.md`);
  } else {
    console.log(`\n✅ No critical issues detected!`);
  }
  
  console.log(`\n💡 Note: This is a sample scan of ${MAX_ROUTES} routes.`);
  console.log(`   For full scan of all ${routesData.totalRoutes} routes, run: npm run seo:scan`);
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
