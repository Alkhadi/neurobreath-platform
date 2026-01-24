import Link from "next/link";

import { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LEGAL_CONFIG } from '@/lib/legal/legalConfig';

export const metadata: Metadata = {
  title: 'Privacy Policy | NeuroBreath US',
  description: 'Learn how NeuroBreath collects, uses, and protects your personal information. CCPA/CPRA compliant privacy policy.',
  robots: 'index, follow',
};

export default function USPrivacyPage() {
  return (
    <LegalLayout
      region="us"
      currentPage="privacy"
      lastUpdated={LEGAL_CONFIG.lastUpdated.privacy}
      title="Privacy Policy (US)"
      description="How we collect, use, and protect your personal information"
    >
      {/* Introduction */}
      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to {LEGAL_CONFIG.organizationName}. This Privacy Policy explains how we collect, use, and protect your personal 
          information when you use our website at <a href={LEGAL_CONFIG.siteUrl}>{LEGAL_CONFIG.siteUrl}</a>.
        </p>
        <p>
          <strong>About us:</strong> {LEGAL_CONFIG.organizationStatus} We are based in the UK but welcome users from the United States.
        </p>
        <p>
          <strong>Your privacy matters:</strong> We are committed to transparency and giving you control over your personal data.
        </p>
        <p>
          <strong>Contact us:</strong> <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a>
        </p>
      </section>

      {/* Key Points Summary */}
      <section>
        <h2>2. Key Points</h2>
        <ul>
          <li><strong>No health data:</strong> {LEGAL_CONFIG.statements.noHealthData}</li>
          <li><strong>No email marketing:</strong> {LEGAL_CONFIG.statements.noEmailMarketing}</li>
          <li><strong>Educational purpose:</strong> {LEGAL_CONFIG.statements.educationalOnly}</li>
          <li><strong>We do not sell your personal information</strong></li>
          <li><strong>We do not share your data for cross-context behavioral advertising</strong></li>
          <li><strong>No external tracking:</strong> We do not use Google Analytics, Facebook Pixel, or third-party trackers</li>
          <li><strong>Local-first privacy:</strong> Progress tracking uses local storage on your device</li>
          <li><strong>Your rights:</strong> You have rights under US state privacy laws (CCPA/CPRA, etc.)</li>
        </ul>
      </section>

      {/* What We Collect */}
      <section>
        <h2>3. Information We Collect</h2>
        
        <h3>3.1 Information You Provide</h3>
        <p><strong>User Accounts (Optional — UK users only):</strong></p>
        <p>
          Currently, user accounts are only available for UK users. US users can use all core features without creating an account.
        </p>
        
        <p><strong>Contact Form:</strong></p>
        <ul>
          <li>Name, email, message (sent via email; not stored in our database)</li>
        </ul>

        <h3>3.2 Information Collected Automatically</h3>
        <p><strong>Progress Tracking (Local Storage):</strong></p>
        <ul>
          <li>Device identifier (randomly generated)</li>
          <li>Breathing session history (technique, duration, breaths)</li>
          <li>Progress stats (sessions, streaks, badges)</li>
          <li>Voice and preference settings</li>
        </ul>
        <p>
          <strong>Stored where?</strong> By default, on your device's browser localStorage. No server upload unless you create an 
          account and opt in to sync.
        </p>

        <p><strong>Technical Data:</strong></p>
        <ul>
          <li>IP address (for security, rate limiting)</li>
          <li>Browser type, operating system</li>
          <li>Pages visited, referral source</li>
        </ul>
        <p><strong>Retention:</strong> Technical logs retained for up to 90 days, then deleted.</p>

        <h3>3.3 Cookies and Local Storage</h3>
        <ul>
          <li><strong>Essential cookies:</strong> Session, region preference (required for functionality)</li>
          <li><strong>Functional storage:</strong> Progress tracking (optional; can be disabled via cookie settings)</li>
        </ul>
        <p>
          See our <Link href="/us/legal/cookies">Cookie Policy</Link> for details.
        </p>

        <h3>3.4 What We Do NOT Collect</h3>
        <ul>
          <li>Health data or biometric data</li>
          <li>Sensitive personal information (race, religion, political views, etc.)</li>
          <li>Cross-site tracking data</li>
          <li>Social Security Numbers or financial information</li>
        </ul>
      </section>

      {/* How We Use Data */}
      <section>
        <h2>4. How We Use Your Information</h2>
        <ul>
          <li><strong>Provide our service:</strong> Enable breathing techniques, save progress, remember preferences</li>
          <li><strong>Communication:</strong> Respond to contact form inquiries</li>
          <li><strong>Security:</strong> Protect against spam, abuse, fraud</li>
          <li><strong>Analytics (future):</strong> If we add analytics, we will request consent</li>
        </ul>
      </section>

      {/* Data Sharing */}
      <section>
        <h2>5. Do We Sell or Share Your Personal Information?</h2>
        <p className="text-lg font-semibold text-green-800 dark:text-green-300">
          <strong>NO.</strong> We do not sell your personal information. We do not share your information for cross-context 
          behavioral advertising.
        </p>
        
        <h3>5.1 Service Providers</h3>
        <p>We share limited data with trusted service providers:</p>
        <ul>
          <li><strong>Hosting:</strong> Servers in the European Economic Area (EEA)</li>
          <li><strong>Email service:</strong> Resend (for contact form responses, password resets)</li>
          <li><strong>Anti-spam:</strong> Cloudflare Turnstile (contact form protection)</li>
        </ul>
        <p>Service providers are contractually obligated to protect your data.</p>

        <h3>5.2 Legal Requirements</h3>
        <p>We may disclose data if required by law (court orders, subpoenas) or to protect safety and security.</p>
      </section>

      {/* Data Retention */}
      <section>
        <h2>6. Data Retention</h2>
        <ul>
          <li><strong>Progress data:</strong> Until deletion requested or 3 years of inactivity</li>
          <li><strong>Contact form:</strong> Email only, not stored in database</li>
          <li><strong>Technical logs:</strong> 90 days</li>
        </ul>
      </section>

      {/* Your Rights */}
      <section>
        <h2>7. Your Privacy Rights (US State Laws)</h2>
        <p>
          Under laws like the California Consumer Privacy Act (CCPA/CPRA), Virginia CDPA, Colorado CPA, and others, you may have 
          the following rights:
        </p>
        <ul>
          <li><strong>Right to know:</strong> Request details about what personal information we collect, use, and share</li>
          <li><strong>Right to delete:</strong> Request deletion of your personal information</li>
          <li><strong>Right to correct:</strong> Request correction of inaccurate data</li>
          <li><strong>Right to opt out of sale:</strong> We do not sell data, so this does not apply</li>
          <li><strong>Right to opt out of targeted advertising:</strong> We do not serve targeted ads</li>
          <li><strong>Right to limit use of sensitive data:</strong> We do not collect sensitive personal information</li>
          <li><strong>Right to non-discrimination:</strong> We will not discriminate against you for exercising your rights</li>
        </ul>
        <p>
          <strong>How to exercise your rights:</strong> See our <Link href="/us/legal/privacy-rights">Privacy Rights</Link> page or email{' '}
          <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a>.
        </p>
      </section>

      {/* Children's Privacy */}
      <section>
        <h2>8. Children's Privacy (COPPA)</h2>
        <p>
          Our service is <strong>not intended for children under 13</strong>. We do not knowingly collect personal information from 
          children under 13.
        </p>
        <p>
          If you believe a child has provided us with personal information, contact us at{' '}
          <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a> and we will delete it promptly.
        </p>
      </section>

      {/* Security */}
      <section>
        <h2>9. Security</h2>
        <p>We implement industry-standard security measures:</p>
        <ul>
          <li>HTTPS/TLS encryption for data in transit</li>
          <li>Secure password hashing (bcrypt)</li>
          <li>Access controls and monitoring</li>
          <li>Regular security updates</li>
        </ul>
        <p>No system is 100% secure. We will notify you of data breaches as required by applicable law.</p>
      </section>

      {/* International Transfers */}
      <section>
        <h2>10. International Data Transfers</h2>
        <p>
          {LEGAL_CONFIG.organizationName} is based in the UK. Data may be stored on servers in the European Economic Area (EEA). 
          By using our service from the US, you consent to the transfer of your data to the UK/EEA.
        </p>
        <p>
          We implement appropriate safeguards to protect your data during international transfers.
        </p>
      </section>

      {/* Changes to Policy */}
      <section>
        <h2>11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we make significant changes:
        </p>
        <ul>
          <li>We will update the "Last Updated" date</li>
          <li>We will display a prominent notice on our website</li>
        </ul>
        <p>
          Continued use of our service after changes constitutes acceptance.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2>12. Contact Us</h2>
        <p>
          For privacy questions or to exercise your rights:
        </p>
        <p>
          <strong>Email:</strong> <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a><br />
          <strong>Location:</strong> {LEGAL_CONFIG.location}
        </p>
        <p>
          We aim to respond within 5 business days.
        </p>
      </section>

      {/* Legal Disclaimer */}
      <section className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h2>Legal Disclaimer</h2>
        <p className="mb-0">
          <strong>This Privacy Policy is a best-practice draft and not legal advice.</strong> {LEGAL_CONFIG.organizationName} recommends 
          seeking review by a qualified attorney to ensure compliance with all applicable US state and federal privacy laws.
        </p>
      </section>
    </LegalLayout>
  );
}
