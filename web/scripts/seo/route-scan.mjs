#!/usr/bin/env node

/**
 * SEO Route Scan Script
 * 
 * Uses Playwright to visit each route and extract SEO data:
 * - Title, meta description, canonical
 * - Robots meta tags
 * - H1 count and content
 * - Open Graph tags
 * - Twitter Card tags
 * - JSON-LD structured data
 * - Image SEO issues
 * 
 * Generates:
 * - SEO_ROUTE_TABLE.md (Markdown table)
 * - SEO_ROUTE_TABLE.csv (CSV export)
 * - .seo/route-scan.json (Raw scan data)
 * - SEO_AUDIT_SUMMARY.md (Actionable issues)
 */

import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const WEB_ROOT = join(__dirname, '../..');
const ROUTES_FILE = join(WEB_ROOT, '.seo/routes.json');
const FIXTURES_FILE = join(WEB_ROOT, 'lib/seo/route-fixtures.ts');
const OUTPUT_DIR = join(WEB_ROOT, '.seo');
const SCREENSHOT_DIR = join(OUTPUT_DIR, 'screenshots');

const BASE_URL = process.env.SEO_SCAN_URL || 'http://localhost:3100';
const SERVER_WAIT_MS = 5000;
const PAGE_TIMEOUT = 30000;

// Import fixtures dynamically
let routeFixtures = {};

/**
 * Load route fixtures
 */
async function loadFixtures() {
  try {
    // For .mjs, we can't directly import .ts, so we'll parse it
    const fixturesContent = await readFile(FIXTURES_FILE, 'utf-8');
    const fixturesMatch = fixturesContent.match(/routeFixtures:\s*Record<string,\s*string\[\]>\s*=\s*({[\s\S]*?});/);
    
    if (fixturesMatch) {
      // Extract the object literal and evaluate it safely
      const fixturesObj = fixturesMatch[1];
      // Simple parsing for our specific format
      const lines = fixturesObj.split('\n');
      const fixtures = {};
      
      let currentKey = null;
      for (const line of lines) {
        const keyMatch = line.match(/"([^"]+)":\s*\[/);
        if (keyMatch) {
          currentKey = keyMatch[1];
          fixtures[currentKey] = [];
        }
        
        const urlMatch = line.match(/"(\/[^"]+)"/);
        if (urlMatch && currentKey && line.includes('"/' )) {
          fixtures[currentKey].push(urlMatch[1]);
        }
      }
      
      return fixtures;
    }
  } catch (error) {
    console.warn('⚠️  Could not load fixtures:', error.message);
  }
  
  return {};
}

/**
 * Start Next.js dev server
 */
async function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Starting Next.js dev server on port 3100...`);
    
    const server = spawn('npm', ['run', 'dev', '--', '--port', '3100'], {
      cwd: WEB_ROOT,
      stdio: 'pipe',
      shell: true
    });
    
    let started = false;
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Ready in') || output.includes('Local:') || output.includes('started server')) {
        if (!started) {
          started = true;
          console.log(`✅ Server started at ${BASE_URL}\n`);
          setTimeout(() => resolve(server), SERVER_WAIT_MS);
        }
      }
    });
    
    server.stderr.on('data', (data) => {
      // Ignore stderr unless it's an error
      const output = data.toString();
      if (output.includes('Error') && !started) {
        reject(new Error(`Server failed to start: ${output}`));
      }
    });
    
    server.on('error', (error) => {
      if (!started) {
        reject(error);
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!started) {
        server.kill();
        reject(new Error('Server start timeout'));
      }
    }, 30000);
  });
}

/**
 * Extract SEO data from a page
 */
async function extractSEOData(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: PAGE_TIMEOUT });
    
    // Extract all SEO elements
    const data = await page.evaluate(() => {
      // Title
      const title = document.title || '';
      
      // Meta tags
      const getMetaContent = (name) => {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return meta?.getAttribute('content') || '';
      };
      
      const description = getMetaContent('description');
      const robots = getMetaContent('robots');
      
      // Canonical
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
      
      // H1 tags
      const h1Elements = Array.from(document.querySelectorAll('h1'));
      const h1Count = h1Elements.length;
      const firstH1 = h1Elements[0]?.textContent?.trim() || '';
      
      // Open Graph
      const ogTitle = getMetaContent('og:title');
      const ogDescription = getMetaContent('og:description');
      const ogUrl = getMetaContent('og:url');
      const ogImage = getMetaContent('og:image');
      const ogType = getMetaContent('og:type');
      
      // Twitter Card
      const twitterCard = getMetaContent('twitter:card');
      const twitterTitle = getMetaContent('twitter:title');
      const twitterDescription = getMetaContent('twitter:description');
      const twitterImage = getMetaContent('twitter:image');
      
      // JSON-LD Schemas
      const schemaScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      const schemas = [];
      const schemaTypes = new Set();
      
      schemaScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '');
          schemas.push(data);
          
          // Extract @type
          if (data['@type']) {
            if (Array.isArray(data['@type'])) {
              data['@type'].forEach(t => schemaTypes.add(t));
            } else {
              schemaTypes.add(data['@type']);
            }
          }
          
          // Handle @graph
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
      
      // Image SEO checks
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
        openGraph: {
          title: ogTitle,
          description: ogDescription,
          url: ogUrl,
          image: ogImage,
          type: ogType
        },
        twitter: {
          card: twitterCard,
          title: twitterTitle,
          description: twitterDescription,
          image: twitterImage
        },
        schemas,
        schemaTypes: Array.from(schemaTypes),
        imageIssues
      };
    });
    
    return {
      success: true,
      ...data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Analyze SEO data for issues
 */
function analyzeSEO(url, data) {
  const issues = {
    critical: [],
    high: [],
    medium: [],
    low: []
  };
  
  if (!data.success) {
    issues.critical.push(`Page failed to load: ${data.error}`);
    return issues;
  }
  
  // Check robots
  const isIndexable = !data.robots?.includes('noindex');
  
  // Critical issues
  if (!data.title) {
    issues.critical.push('Missing title tag');
  }
  
  if (!data.description && isIndexable) {
    issues.critical.push('Missing meta description');
  }
  
  if (!data.canonical && isIndexable) {
    issues.critical.push('Missing canonical URL');
  }
  
  if (data.h1Count === 0) {
    issues.critical.push('No H1 tag found');
  } else if (data.h1Count > 1) {
    issues.critical.push(`Multiple H1 tags (${data.h1Count})`);
  }
  
  if (data.schemas.some(s => s.error)) {
    issues.critical.push('Schema JSON parse error');
  }
  
  // High issues
  if (!data.openGraph.title && isIndexable) {
    issues.high.push('Missing og:title');
  }
  
  if (!data.openGraph.description && isIndexable) {
    issues.high.push('Missing og:description');
  }
  
  if (!data.openGraph.image && isIndexable) {
    issues.high.push('Missing og:image');
  }
  
  if (data.title && data.title.length > 60) {
    issues.high.push(`Title too long (${data.title.length} chars)`);
  }
  
  // Medium issues
  if (data.description && data.description.length > 160) {
    issues.medium.push(`Description too long (${data.description.length} chars)`);
  }
  
  if (data.description && data.description.length < 120) {
    issues.medium.push(`Description too short (${data.description.length} chars)`);
  }
  
  if (!data.twitter.card && isIndexable) {
    issues.medium.push('Missing twitter:card');
  }
  
  if (data.schemaTypes.length === 0 && isIndexable) {
    issues.medium.push('No structured data found');
  }
  
  // Low issues
  if (data.imageIssues.missingAlt > 0) {
    issues.low.push(`${data.imageIssues.missingAlt} images missing alt text`);
  }
  
  if (data.imageIssues.missingDimensions > 0) {
    issues.low.push(`${data.imageIssues.missingDimensions} large images missing width/height`);
  }
  
  return issues;
}

/**
 * Generate Markdown table
 */
function generateMarkdownTable(results) {
  const sanitizeCell = value => {
    if (value === null || value === undefined) return '';
    return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
  };

  let md = '# SEO Route Audit Table\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `Total routes scanned: ${results.length}\n\n`;
  
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

/**
 * Generate CSV
 */
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

/**
 * Generate audit summary
 */
function generateAuditSummary(results) {
  let md = '# SEO Audit Summary\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  
  const critical = [];
  const high = [];
  const medium = [];
  const low = [];
  
  results.forEach(result => {
    if (result.issues.critical.length > 0) {
      critical.push({ url: result.url, issues: result.issues.critical });
    }
    if (result.issues.high.length > 0) {
      high.push({ url: result.url, issues: result.issues.high });
    }
    if (result.issues.medium.length > 0) {
      medium.push({ url: result.url, issues: result.issues.medium });
    }
    if (result.issues.low.length > 0) {
      low.push({ url: result.url, issues: result.issues.low });
    }
  });
  
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
      issues.forEach(issue => {
        md += `- ❌ ${issue}\n`;
      });
      md += '\n';
    });
  }
  
  if (high.length > 0) {
    md += '## ⚠️ High Priority Issues\n\n';
    high.forEach(({ url, issues }) => {
      md += `### ${url}\n\n`;
      issues.forEach(issue => {
        md += `- ⚠️ ${issue}\n`;
      });
      md += '\n';
    });
  }
  
  if (medium.length > 0) {
    md += '## 📋 Medium Priority Issues\n\n';
    medium.forEach(({ url, issues }) => {
      md += `### ${url}\n\n`;
      issues.forEach(issue => {
        md += `- 📋 ${issue}\n`;
      });
      md += '\n';
    });
  }
  
  return md;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 SEO Route Scan\n');
  
  // Load routes
  console.log(`📖 Loading routes from ${relative(WEB_ROOT, ROUTES_FILE)}...`);
  const routesData = JSON.parse(await readFile(ROUTES_FILE, 'utf-8'));
  
  // Load fixtures
  console.log(`📖 Loading fixtures from ${relative(WEB_ROOT, FIXTURES_FILE)}...`);
  routeFixtures = await loadFixtures();
  
  // Expand routes with fixtures
  const urlsToScan = [];
  const missingFixtures = [];
  
  for (const route of routesData.routes) {
    if (route.isDynamic) {
      const fixtures = routeFixtures[route.pattern] || [];
      if (fixtures.length === 0) {
        missingFixtures.push(route.pattern);
        urlsToScan.push({
          url: route.pattern,
          needsFixture: true,
          pattern: route.pattern
        });
      } else {
        fixtures.forEach(url => {
          urlsToScan.push({
            url,
            pattern: route.pattern,
            isDynamic: true
          });
        });
      }
    } else {
      urlsToScan.push({
        url: route.url,
        pattern: route.url,
        isDynamic: false
      });
    }
  }
  
  console.log(`\n📊 Routes to scan: ${urlsToScan.length}`);
  
  if (missingFixtures.length > 0) {
    console.error(`\n❌ Missing fixtures for dynamic routes:`);
    missingFixtures.forEach(pattern => {
      console.error(`   - ${pattern}`);
    });
    console.error(`\n💡 Add fixtures to: ${relative(WEB_ROOT, FIXTURES_FILE)}`);
    process.exit(1);
  }
  
  // Start server
  let server = null;
  try {
    server = await startDevServer();
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    console.log(`💡 Make sure no other process is using port 3100`);
    process.exit(1);
  }
  
  // Launch browser
  console.log('🌐 Launching browser...\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  // Ensure screenshot directory exists
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  
  // Scan routes
  const results = [];
  let scanned = 0;
  
  for (const routeInfo of urlsToScan) {
    const url = `${BASE_URL}${routeInfo.url}`;
    scanned++;
    
    console.log(`[${scanned}/${urlsToScan.length}] Scanning: ${routeInfo.url}`);
    
    const data = await extractSEOData(page, url);
    const issues = analyzeSEO(routeInfo.url, data);
    
    results.push({
      url: routeInfo.url,
      pattern: routeInfo.pattern,
      isDynamic: routeInfo.isDynamic,
      data,
      issues
    });
    
    // Take screenshots for homepage and buddy page
    if (routeInfo.url === '/' || routeInfo.url.includes('buddy') || routeInfo.url.includes('coach')) {
      const filename = routeInfo.url === '/' ? 'homepage.png' : `${routeInfo.url.replace(/\//g, '-').substring(1)}.png`;
      await page.screenshot({ path: join(SCREENSHOT_DIR, filename), fullPage: true });
      console.log(`  📸 Screenshot saved: ${filename}`);
    }
  }
  
  // Close browser and server
  await browser.close();
  if (server) {
    server.kill();
  }
  
  console.log(`\n✅ Scan complete!\n`);
  
  // Generate outputs
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
  
  // Check for critical issues
  const criticalCount = results.filter(r => r.issues.critical.length > 0).length;
  
  if (criticalCount > 0) {
    console.log(`\n❌ ${criticalCount} routes have critical issues`);
    console.log(`📋 Review: SEO_AUDIT_SUMMARY.md`);
    process.exit(1);
  } else {
    console.log(`\n✅ No critical issues detected!`);
    process.exit(0);
  }
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
