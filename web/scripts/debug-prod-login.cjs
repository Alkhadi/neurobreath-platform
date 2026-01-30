/* eslint-disable no-console */

const { chromium, webkit, devices } = require('@playwright/test');

async function main() {
  const runs = [
    {
      name: 'chromium-desktop',
      launch: () => chromium.launch(),
      contextOptions: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'webkit-iphone',
      launch: () => webkit.launch(),
      contextOptions: devices['iPhone 14'],
    },
  ];

  for (const run of runs) {
    const browser = await run.launch();
    const context = await browser.newContext(run.contextOptions);
    const page = await context.newPage();

    page.on('console', (msg) => console.log(`[${run.name}] console:`, msg.type(), msg.text()));
    page.on('pageerror', (err) => console.log(`[${run.name}] pageerror:`, err.message));

    await page.goto('https://neurobreath.co.uk/uk/login?registered=1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const state = await page.evaluate(() => {
      const computed = window.getComputedStyle(document.body).pointerEvents;
      const inline = document.body.style.pointerEvents || null;
      return { inline, computed, url: location.href, readyState: document.readyState };
    });

    console.log(`[${run.name}] body pointer-events:`, state);

    await page.click('#email', { timeout: 10_000 });
    const activeId = await page.evaluate(() => document.activeElement && document.activeElement.id);
    console.log(`[${run.name}] activeElement.id after click:`, activeId);

    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
