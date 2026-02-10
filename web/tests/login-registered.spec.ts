import { test, expect } from '@playwright/test';

test('UK login remains interactive after registration success banner', async ({ page }) => {
  await page.goto('/uk/login?registered=1');

  await expect(page.getByText('Account created. You can now sign in.')).toBeVisible();

  // If some modal/dismissable layer leaked, Radix may set body pointer-events to none.
  const bodyPointerEvents = await page.evaluate(() => {
    const style = window.getComputedStyle(document.body);
    return {
      inline: document.body.style.pointerEvents || null,
      computed: style.pointerEvents,
    };
  });

  expect(bodyPointerEvents.computed).not.toBe('none');

  const email = page.locator('#email');
  await email.click();
  await expect(email).toBeFocused();

  const password = page.locator('#password');
  await password.click();
  await expect(password).toBeFocused();
});
