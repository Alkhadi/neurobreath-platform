import Link from "next/link";

import { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LEGAL_CONFIG } from '@/lib/legal/legalConfig';

export const metadata: Metadata = {
  title: 'Cookie Policy | NeuroBreath US',
  description: 'Learn about how NeuroBreath uses cookies and local storage. Manage your cookie preferences.',
  robots: 'index, follow',
};

export default function UKCookiesPage() {
  return (
    <LegalLayout
      region="us"
      currentPage="cookies"
      lastUpdated={LEGAL_CONFIG.lastUpdated.cookies}
      title="Cookie Policy"
      description="How we use cookies and local storage"
    >
      {/* Introduction */}
      <section>
        <h2>1. Introduction</h2>
        <p>
          This Cookie Policy explains how {LEGAL_CONFIG.organizationName} uses cookies, local storage, and similar technologies 
          on our website at <a href={LEGAL_CONFIG.siteUrl}>{LEGAL_CONFIG.siteUrl}</a>.
        </p>
        <p>
          By using our website, you consent to our use of essential cookies. For non-essential cookies and local storage, you can 
          manage your preferences via our cookie consent banner or the "Cookie settings" link in our footer.
        </p>
      </section>

      {/* What Are Cookies */}
      <section>
        <h2>2. What Are Cookies and Local Storage?</h2>
        
        <h3>2.1 Cookies</h3>
        <p>
          Cookies are small text files that websites place on your device (computer, smartphone, tablet) to store information about 
          your visit. Cookies help websites remember your preferences and provide a better user experience.
        </p>

        <h3>2.2 Local Storage</h3>
        <p>
          Local storage is a web browser feature that allows websites to store data directly on your device. Unlike cookies, local 
          storage data is not sent to the server with every request. We use local storage primarily to save your progress and preferences 
          locally on your device.
        </p>

        <h3>2.3 Session Storage</h3>
        <p>
          Session storage is similar to local storage but data is deleted when you close your browser tab. We use session storage 
          sparingly for temporary state management.
        </p>
      </section>

      {/* Categories */}
      <section>
        <h2>3. Categories of Cookies and Storage We Use</h2>
        <p>
          We classify our use of cookies and storage into three categories:
        </p>

        <h3>3.1 Essential (Always Active)</h3>
        <p>
          <strong>Purpose:</strong> {LEGAL_CONFIG.cookieCategories.essential.description}
        </p>
        <p>
          <strong>Cannot be disabled.</strong> These are necessary for the website to function properly and provide core features 
          such as security, region selection, and session management.
        </p>
        <p><strong>Examples:</strong></p>
        <ul>
          <li><strong>nb_region</strong> (Cookie) — Stores your region preference (UK or US) to show relevant content</li>
          <li><strong>nb_consent</strong> (Cookie) — Stores your cookie consent choices</li>
          <li><strong>Session cookies</strong> (if logged in) — Maintains your logged-in session securely</li>
        </ul>
        <p>
          <strong>Lawful basis:</strong> Legitimate interests (UK GDPR Article 6(1)(f)) — these cookies are strictly necessary 
          for the functionality and security of our service.
        </p>
        <p>
          <strong>Retention:</strong> Session cookies expire when you close your browser. Persistent cookies (nb_region, nb_consent) 
          expire after 1 year.
        </p>

        <h3>3.2 Functional (Optional)</h3>
        <p>
          <strong>Purpose:</strong> {LEGAL_CONFIG.cookieCategories.functional.description}
        </p>
        <p>
          <strong>You can disable these via cookie settings.</strong> Functional storage enhances your experience by remembering your 
          progress, preferences, and settings.
        </p>
        <p><strong>Examples:</strong></p>
        <ul>
          <li><strong>nb_progress_v1</strong> (localStorage) — Saves completed activities (e.g. techniques, lessons, quizzes) on this device</li>
          <li><strong>nb_progress_consent</strong> (Cookie, HttpOnly) — Records whether you have opted in to progress saving/backups</li>
          <li><strong>nb_device_id</strong> (Cookie, HttpOnly) — Random device identifier created only after you opt in (used for guest backups and later merge)</li>
          <li><strong>nb_guest_progress</strong> (localStorage) — Saves breathing session history, streaks, and badges locally (legacy)
          </li>
          <li><strong>nb_device_profiles</strong> (localStorage) — Stores onboarding profiles and device-specific preferences</li>
          <li><strong>nb_voice_prefs</strong> (localStorage) — Remembers your text-to-speech voice and speed preferences</li>
          <li><strong>nb_analytics_local</strong> (localStorage) — Privacy-focused local analytics (does NOT send data to servers)</li>
        </ul>
        <p>
          <strong>Lawful basis:</strong> Consent (UK GDPR Article 6(1)(a)) or Legitimate interests (Article 6(1)(f)) for enhancing 
          service functionality.
        </p>
        <p>
          <strong>Retention:</strong> localStorage data persists until you clear your browser data or use our reset controls. 
          If you opt in to server backup (via progress consent), we retain pseudonymous guest progress only as long as needed to provide the feature
          and may periodically purge stale guest device data.
        </p>

        <h3>3.3 Analytics (Optional — Currently Not Used)</h3>
        <p>
          <strong>Purpose:</strong> {LEGAL_CONFIG.cookieCategories.analytics.description}
        </p>
        <p>
          <strong>Current status:</strong> We do <strong>NOT</strong> currently use any external analytics services (no Google Analytics, 
          Facebook Pixel, or similar trackers).
        </p>
        <p>
          Our analytics are <strong>privacy-focused and local-only</strong> (stored in your browser's localStorage, no data sent to 
          our servers). If we introduce server-side analytics in the future, we will:
        </p>
        <ul>
          <li>Request your explicit consent via the cookie banner</li>
          <li>Update this Cookie Policy</li>
          <li>Notify existing users</li>
          <li>Use privacy-friendly tools with IP anonymization and no cross-site tracking</li>
        </ul>
        <p>
          <strong>Lawful basis (if implemented):</strong> Consent (UK GDPR Article 6(1)(a))
        </p>
      </section>

      {/* Third-Party Cookies */}
      <section>
        <h2>4. Third-Party Cookies</h2>
        <p>
          We <strong>do not use third-party tracking cookies</strong> from advertising networks, social media platforms, or analytics 
          companies.
        </p>
        <p>
          The only third-party service we use is:
        </p>
        <ul>
          <li>
            <strong>Cloudflare Turnstile</strong> — Anti-spam protection for our contact form. Turnstile may use cookies or browser 
            fingerprinting to detect bots. See{' '}
            <a href="https://www.cloudflare.com/en-gb/privacypolicy/" target="_blank" rel="noopener noreferrer">
              Cloudflare's Privacy Policy
            </a>.
          </li>
        </ul>
        <p>
          If you visit external links from our site (e.g., research sources), those third-party websites may set their own cookies. 
          We do not control those cookies.
        </p>
      </section>

      {/* Managing Cookies */}
      <section>
        <h2>5. Managing Your Cookie Preferences</h2>
        
        <h3>5.1 Via Our Cookie Banner</h3>
        <p>
          When you first visit NeuroBreath, you'll see a cookie consent banner with three options:
        </p>
        <ul>
          <li><strong>Accept all</strong> — Allow all cookies and storage (Essential + Functional)</li>
          <li><strong>Reject all</strong> — Allow only Essential cookies (Functional disabled)</li>
          <li><strong>Manage preferences</strong> — Choose exactly which categories you want to enable</li>
        </ul>

        <h3>5.2 Via Cookie Settings Link</h3>
        <p>
          You can change your cookie preferences at any time by clicking the <strong>"Cookie settings"</strong> link in our footer. 
          This opens the preferences modal where you can enable or disable Functional and Analytics categories.
        </p>

        <h3>5.3 Via Your Browser</h3>
        <p>
          You can also control cookies directly through your web browser settings. Most browsers allow you to:
        </p>
        <ul>
          <li>View and delete cookies</li>
          <li>Block all cookies (warning: this may break website functionality)</li>
          <li>Block third-party cookies only</li>
          <li>Set cookies to expire when you close the browser</li>
        </ul>
        <p>
          <strong>Browser-specific instructions:</strong>
        </p>
        <ul>
          <li>
            <strong>Chrome:</strong>{' '}
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
              Manage cookies in Chrome
            </a>
          </li>
          <li>
            <strong>Firefox:</strong>{' '}
            <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">
              Manage cookies in Firefox
            </a>
          </li>
          <li>
            <strong>Safari:</strong>{' '}
            <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
              Manage cookies in Safari
            </a>
          </li>
          <li>
            <strong>Edge:</strong>{' '}
            <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
              Manage cookies in Edge
            </a>
          </li>
        </ul>
        <p>
          <strong>Note:</strong> Blocking essential cookies will prevent NeuroBreath from functioning properly (e.g., you won't be able 
          to stay logged in or save region preferences).
        </p>

        <h3>5.4 Clearing Local Storage</h3>
        <p>
          To clear local storage data:
        </p>
        <ul>
          <li><strong>Chrome/Edge:</strong> Settings → Privacy → Clear browsing data → Cookies and other site data</li>
          <li><strong>Firefox:</strong> Settings → Privacy & Security → Clear Data → Cookies and Site Data</li>
          <li><strong>Safari:</strong> Settings → Privacy → Manage Website Data → Remove All</li>
        </ul>
        <p>
          <strong>Warning:</strong> Clearing local storage will delete your locally saved progress, badges, and preferences on 
          NeuroBreath (unless you have an account and synced your data to our servers).
        </p>
      </section>

      {/* Do Not Track */}
      <section>
        <h2>6. Do Not Track (DNT)</h2>
        <p>
          Some browsers offer a "Do Not Track" (DNT) setting. Because we do not use third-party tracking or behavioral advertising, 
          DNT signals have minimal impact on NeuroBreath.
        </p>
        <p>
          We respect your privacy by default: we do not track you across websites, we do not sell your data, and we do not serve 
          personalized ads.
        </p>
      </section>

      {/* Updates */}
      <section>
        <h2>7. Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. When we make significant changes, we will update the "Last Updated" date 
          and notify you via a notice on our website or email (if you have an account).
        </p>
        <p>
          Continued use of NeuroBreath after changes take effect constitutes acceptance of the updated Cookie Policy.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2>8. Contact Us</h2>
        <p>
          For questions about cookies or to exercise your privacy rights, contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a><br />
          <strong>Location:</strong> {LEGAL_CONFIG.location}
        </p>
        <p>
          See our <Link href="/us/legal/privacy">Privacy Policy</Link> for full details on how we process your personal data.
        </p>
      </section>

      {/* Summary Table */}
      <section>
        <h2>9. Summary Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-700">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">Category</th>
                <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">Purpose</th>
                <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">Can Disable?</th>
                <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">Retention</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2"><strong>Essential</strong></td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Security, session management, region preference</td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">❌ No</td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Session or 1 year</td>
              </tr>
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2"><strong>Functional</strong></td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Progress tracking, preferences, local analytics</td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">✅ Yes</td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Until cleared or deleted</td>
              </tr>
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2"><strong>Analytics</strong></td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Usage insights (not currently used)</td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">✅ Yes</td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">N/A (not active)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h2>Legal Disclaimer</h2>
        <p className="mb-0">
          <strong>This Cookie Policy is a best-practice draft and not legal advice.</strong> {LEGAL_CONFIG.organizationName} recommends 
          seeking review by a qualified solicitor to ensure full compliance with UK GDPR and ePrivacy regulations.
        </p>
      </section>
    </LegalLayout>
  );
}
