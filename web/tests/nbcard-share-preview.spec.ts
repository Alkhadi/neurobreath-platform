import { expect, test } from '@playwright/test';

function shareCardModelFixture() {
  return {
    category: 'business',
    profile: {
      fullName: 'Preview Test User',
      jobTitle: 'QA Engineer',
      email: 'preview-test@example.com',
      phone: '+44 7700 900123',
    },
    style: {
      fontFamily: 'Inter, sans-serif',
    },
    canvas: {
      elements: [],
    },
  };
}

test.describe('NB-Card share preview API', () => {
  test('POST /api/nb-card/share generates a preview server-side when no preview blob is supplied', async ({ page }) => {
    await page.goto('/uk', { waitUntil: 'domcontentloaded' });

    const createResponse = await page.request.post('/api/nb-card/share', {
      data: {
        cardModel: shareCardModelFixture(),
        deviceId: 'playwright-preview-device',
      },
    });

    expect(createResponse.ok()).toBeTruthy();

    const createJson = (await createResponse.json()) as {
      token: string;
      shareUrl: string;
    };

    expect(createJson.token).toBeTruthy();
    expect(createJson.shareUrl).toContain(`/nb-card/s/${createJson.token}`);

    const shareResponse = await page.request.get(
      `/api/nb-card/share?token=${encodeURIComponent(createJson.token)}`
    );
    expect(shareResponse.ok()).toBeTruthy();

    const shareJson = (await shareResponse.json()) as {
      hasPreview: boolean;
      previewStatus: string | null;
    };

    expect(shareJson.hasPreview).toBeTruthy();
    expect(shareJson.previewStatus).toBe('ready');

    const previewResponse = await page.request.get(
      `/api/nb-card/share/preview?token=${encodeURIComponent(createJson.token)}`,
      { maxRedirects: 0 }
    );

    expect([200, 302]).toContain(previewResponse.status());

    if (previewResponse.status() === 200) {
      expect(previewResponse.headers()['content-type']).toContain('image/png');
      const previewBody = await previewResponse.body();
      expect(previewBody.byteLength).toBeGreaterThan(0);
    } else {
      const location = previewResponse.headers().location;
      expect(location).toBeTruthy();
      expect(location).not.toContain('/api/og/nb-card');
    }
  });
});