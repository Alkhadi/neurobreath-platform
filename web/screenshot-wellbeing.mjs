import { chromium } from 'playwright';

async function captureWellbeingPage() {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/wellbeing...');
  await page.goto('http://localhost:3000/wellbeing', { waitUntil: 'networkidle' });
  
  // Wait a bit for any animations to complete
  await page.waitForTimeout(2000);

  // Get the full page height
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = 1080;
  
  console.log(`Page height: ${bodyHeight}px`);
  console.log('Capturing screenshots...\n');

  let screenshotNum = 1;
  let currentScroll = 0;

  // Capture the initial viewport
  await page.screenshot({ path: `wellbeing-screenshot-${screenshotNum}.png`, fullPage: false });
  console.log(`Screenshot ${screenshotNum}: Top of page (0px)`);
  screenshotNum++;

  // Scroll through the page and capture screenshots
  while (currentScroll < bodyHeight - viewportHeight) {
    currentScroll += viewportHeight * 0.8; // 80% overlap for context
    await page.evaluate((y) => window.scrollTo(0, y), currentScroll);
    await page.waitForTimeout(500); // Wait for scroll to complete
    
    await page.screenshot({ path: `wellbeing-screenshot-${screenshotNum}.png`, fullPage: false });
    console.log(`Screenshot ${screenshotNum}: Scrolled to ${currentScroll}px`);
    screenshotNum++;
  }

  // Also capture a full-page screenshot
  await page.screenshot({ path: 'wellbeing-screenshot-full.png', fullPage: true });
  console.log(`\nFull page screenshot saved as wellbeing-screenshot-full.png`);

  await browser.close();
  console.log('\nAll screenshots saved successfully!');
}

captureWellbeingPage().catch(console.error);
