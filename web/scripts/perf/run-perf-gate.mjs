#!/usr/bin/env node

/**
 * Performance Gate Runner
 * Runs Lighthouse audits on key routes and saves results
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import budgetsModule from '../../perf/budgets.config.ts';

const PERFORMANCE_BUDGET = budgetsModule?.default ?? budgetsModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDir = path.resolve(__dirname, '..', '..');
const reportsDir = path.join(webDir, 'reports', 'perf');
const baselineDir = path.join(webDir, 'perf', 'baseline');

const BASE_URL = process.env.PERF_BASE_URL || 'http://localhost:3000';
const PORT = Number(process.env.PORT || 3000);
const IS_BASELINE = process.argv.includes('--baseline');

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Run command
function runCommand(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: false });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} failed with code ${code}`));
    });
  });
}

// Check if server is running
async function checkServer() {
  try {
    const candidates = [`${BASE_URL}/api/healthz`, `${BASE_URL}/api/health`, `${BASE_URL}/`];

    for (const url of candidates) {
      try {
        const res = await fetch(url);
        if (res.ok) return true;
      } catch {
        // ignore and try next candidate
      }
    }

    return false;
  } catch {
    return false;
  }
}

// Start server if needed
async function ensureServer() {
  if (await checkServer()) {
    console.log('✓ Server already running');
    return null;
  }
  
  console.log('Starting production server...');
  
  // Ensure build exists
  const buildIdPath = path.join(webDir, '.next', 'BUILD_ID');
  if (!fs.existsSync(buildIdPath)) {
    console.log('Building Next.js...');
    await runCommand('npm', ['run', 'build'], webDir);
  }
  
  // Start server
  const serverProcess = spawn('npm', ['run', 'start', '--', '-p', String(PORT)], {
    cwd: webDir,
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'inherit',
    shell: false,
    detached: false,
  });
  
  // Wait for server
  for (let i = 0; i < 30; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (await checkServer()) {
      console.log('✓ Server started');
      return serverProcess;
    }
  }
  
  throw new Error('Failed to start server');
}

// Run Lighthouse audit
async function runLighthouseAudit(url, name) {
  console.log(`Running Lighthouse audit for ${name}...`);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });
  
  const options = {
    logLevel: 'error',
    output: ['json', 'html'],
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
    },
  };
  
  try {
    const runnerResult = await lighthouse(url, options);
    await chrome.kill();
    
    return {
      json: runnerResult.lhr,
      html: runnerResult.report[1],
    };
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

// Extract key metrics
function extractMetrics(lhr) {
  const { categories, audits } = lhr;
  
  return {
    scores: {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
    },
    vitals: {
      fcp: audits['first-contentful-paint']?.numericValue || 0,
      lcp: audits['largest-contentful-paint']?.numericValue || 0,
      tbt: audits['total-blocking-time']?.numericValue || 0,
      cls: audits['cumulative-layout-shift']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
    },
  };
}

// Main runner
async function main() {
  ensureDir(reportsDir);
  ensureDir(baselineDir);
  
  const serverProcess = await ensureServer();
  const results = [];
  
  try {
    for (const route of PERFORMANCE_BUDGET.routesToMeasure) {
      const url = `${BASE_URL}${route.url}`;
      const audit = await runLighthouseAudit(url, route.name);
      
      const metrics = extractMetrics(audit.json);
      
      // Save full reports
      const htmlPath = path.join(reportsDir, `${route.name}.html`);
      const jsonPath = path.join(reportsDir, `${route.name}.json`);
      fs.writeFileSync(htmlPath, audit.html);
      fs.writeFileSync(jsonPath, JSON.stringify(audit.json, null, 2));
      
      results.push({
        route: route.name,
        url: route.url,
        type: route.type,
        priority: route.priority,
        ...metrics,
      });
      
      console.log(`✓ ${route.name}: Performance ${metrics.scores.performance}`);
    }
    
    // Save results
    const summaryPath = IS_BASELINE
      ? path.join(baselineDir, 'baseline.lighthouse.json')
      : path.join(reportsDir, 'lighthouse.current.json');
    
    fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
    
    // Save metadata
    if (IS_BASELINE) {
      const meta = {
        date: new Date().toISOString(),
        commit: process.env.GITHUB_SHA || 'local',
        branch: process.env.GITHUB_REF_NAME || 'local',
      };
      fs.writeFileSync(
        path.join(baselineDir, 'baseline.meta.json'),
        JSON.stringify(meta, null, 2)
      );
    }
    
    console.log(`\n✓ Performance audits complete`);
    console.log(`  Results saved to: ${summaryPath}`);
    
  } finally {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
  }
}

main().catch((error) => {
  console.error('❌ Performance gate failed:', error);
  process.exit(1);
});
