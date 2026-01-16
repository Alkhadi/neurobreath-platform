#!/usr/bin/env node

/**
 * Quick SEO Scan Test
 * Scans just 5 key routes to verify the system works
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3100';
const TEST_ROUTES = ['/', '/adhd', '/anxiety', '/autism', '/coach'];

async function quickTest() {
  console.log('🧪 Quick SEO Scan Test\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  for (const route of TEST_ROUTES) {
    const url = `${BASE_URL}${route}`;
    console.log(`Testing: ${url}`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      
      const title = await page.title();
      const h1Count = await page.locator('h1').count();
      
      console.log(`  ✅ Title: ${title.substring(0, 50)}`);
      console.log(`  ✅ H1 count: ${h1Count}`);
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
  
  await browser.close();
  console.log('\n✅ Quick test complete!');
}

quickTest().catch(console.error);
