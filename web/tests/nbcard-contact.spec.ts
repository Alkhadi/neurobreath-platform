import { test, expect, type Page } from '@playwright/test';

function nbcardBackupFixture() {
  const now = new Date().toISOString();

  return {
    schemaVersion: 1 as const,
    updatedAt: now,
    profiles: [
      {
        id: 'default',
        fullName: 'Alkhadi Koroma',
        jobTitle: 'Flutter Developer',
        phone: '+44-77-1315-0495',
        email: 'koromadjmoe@gmail.com',
        profileDescription: '',
        businessDescription: '',
        gradient: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
        socialMedia: {},
      },
      {
        id: 'fixture-profile-2',
        fullName: 'Test Profile',
        jobTitle: 'QA',
        phone: '+1-555-0100',
        email: 'qa@example.com',
        profileDescription: '',
        businessDescription: '',
        gradient: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
        socialMedia: {},
      },
    ],
    contacts: [
      {
        id: 'fixture-contact-1',
        createdAt: now,
        name: 'Test Contact',
        jobTitle: 'Manager',
        phone: '+1-555-0101',
        email: 'contact@example.com',
        company: 'Example Co',
        category: 'Business' as const,
        notes: 'Imported from JSON',
        socialMedia: {},
      },
    ],
  };
}

function vcardFixture() {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:VCard Import Test',
    'ORG:Example Co',
    'TITLE:Tester',
    'TEL;TYPE=CELL:+15550123',
    'EMAIL;TYPE=INTERNET:vcard@example.com',
    'NOTE:Imported from Playwright',
    'END:VCARD',
    '',
  ].join('\n');
}

async function expectToast(page: Page, text: string | RegExp) {
  // Sonner toasts are transient; wait for appearance.
  await expect(page.getByText(text).first()).toBeVisible();
}

test.describe('/resources/nb-card NBCard buttons', () => {
  test.beforeEach(async ({ page }) => {
    // Best-effort: start clean for this origin.
    await page.addInitScript(() => {
      try {
        localStorage.removeItem('nbcard_profiles');
        localStorage.removeItem('nbcard_contacts');
        localStorage.removeItem('nbcard_updated_at');
      } catch {
        // ignore
      }

      try {
        // Async, but it will run before the app opens the DB.
        indexedDB.deleteDatabase('nbcard');
      } catch {
        // ignore
      }
    });
  });

  test('Share + export + privacy/import/reset flows', async ({ page }) => {
    await page.goto('/resources/nb-card');

    const shareSection = page.locator('#share-your-profile');
    await expect(shareSection).toBeVisible();
    await expect(shareSection.getByRole('heading', { name: 'Share Your Profile' })).toBeVisible();

    await shareSection.getByRole('button', { name: 'Copy Link' }).click();
    await expectToast(page, 'Profile link copied');

    // Share can either succeed silently (some viewports) or fall back to a toast.
    await shareSection.getByRole('button', { name: 'Share' }).click();
    const fallbackToast = page.getByText('Share not available');
    if (await fallbackToast.count()) {
      await expect(fallbackToast.first()).toBeVisible();
    }

    // Export → QR Code → Download QR
    await shareSection.getByRole('button', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'QR Code' }).click();

    const qrDialog = page.getByRole('dialog');
    await expect(qrDialog).toBeVisible();
    await expect(qrDialog.getByRole('heading', { name: 'QR Code' })).toBeVisible();

    await page.getByRole('button', { name: 'Download QR' }).click();
    await expectToast(page, 'QR downloaded');
    await page.keyboard.press('Escape');

    // Export → Download PDF
    await shareSection.getByRole('button', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'Download PDF' }).click();
    await expectToast(page, 'PDF downloaded');

    // Export → Download PNG
    await shareSection.getByRole('button', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'Download PNG' }).click();
    await expectToast(page, 'PNG downloaded');

    // Export → Download vCard
    await shareSection.getByRole('button', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'Download vCard' }).click();
    await expectToast(page, 'vCard downloaded');

    // Export → Export contacts CSV (safe even if empty)
    await shareSection.getByRole('button', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'Export contacts CSV' }).click();
    await expectToast(page, 'Contacts CSV exported');

    // Export → Privacy & Storage
    await shareSection.getByRole('button', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'Privacy & Storage' }).click();

    await expect(page.getByText('Privacy & Data Controls')).toBeVisible();

    // Backup export
    await page.getByRole('button', { name: 'Export JSON' }).click();
    await expectToast(page, 'Backup exported');

    // Backup import
    const backupJson = JSON.stringify(nbcardBackupFixture(), null, 2);
    const jsonInput = page.locator('input[type="file"][accept="application/json"]');
    await expect(jsonInput).toHaveCount(1);
    await jsonInput.setInputFiles({
      name: 'nbcard_backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(backupJson, 'utf-8'),
    });
    await expectToast(page, 'Backup imported');

    // Reset buttons (no confirms)
    await page.getByRole('button', { name: 'Reset Profiles' }).click();
    await expectToast(page, 'Profiles reset');

    await page.getByRole('button', { name: 'Clear Contacts' }).click();
    await expectToast(page, 'Contacts cleared');

    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.getByText('Privacy & Data Controls')).toBeHidden();
  });

  test('Captured contacts: add + export + vCard import', async ({ page }) => {
    await page.goto('/resources/nb-card');

    await expect(page.getByRole('heading', { name: 'Captured Contacts' })).toBeVisible();

    await page.getByRole('button', { name: 'Add Contact' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const dialog = page.getByRole('dialog');

    // The form labels are not associated via htmlFor, so select via proximity.
    await dialog.getByText('Name *').locator('..').locator('input').fill('Playwright Person');
    await dialog.getByText('Company').locator('..').locator('input').fill('NeuroBreath');

    await dialog.getByRole('button', { name: 'Save' }).click();
    await expectToast(page, 'Contact added');

    await page.getByRole('button', { name: 'Export CSV' }).click();
    await expectToast(page, 'Contacts CSV downloaded');

    const vcfInput = page.locator('input[type="file"][accept=".vcf,text/vcard"]');
    await expect(vcfInput).toHaveCount(1);
    await vcfInput.setInputFiles({
      name: 'import.vcf',
      mimeType: 'text/vcard',
      buffer: Buffer.from(vcardFixture(), 'utf-8'),
    });

    await expectToast(page, /vCard imported/);
    await expect(dialog).toBeVisible();
  });
});
