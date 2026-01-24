import Link from "next/link";

import { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LEGAL_CONFIG } from '@/lib/legal/legalConfig';

export const metadata: Metadata = {
  title: 'Privacy Policy | NeuroBreath UK',
  description: 'Learn how NeuroBreath collects, uses, and protects your personal information. UK GDPR compliant privacy policy.',
  robots: 'index, follow',
};

export default function UKPrivacyPage() {
  return (
    <LegalLayout
      region="uk"
      currentPage="privacy"
      lastUpdated={LEGAL_CONFIG.lastUpdated.privacy}
      title="Privacy Policy"
      description="How we collect, use, and protect your personal information"
    >
      {/* Introduction */}
      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to {LEGAL_CONFIG.organizationName}. We are committed to protecting your privacy and handling your personal information with care and transparency.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our website at{' '}
          <a href={LEGAL_CONFIG.siteUrl}>{LEGAL_CONFIG.siteUrl}</a> and our services.
        </p>
        <p>
          <strong>Who we are:</strong> {LEGAL_CONFIG.organizationStatus}
        </p>
        <p>
          <strong>Our location:</strong> {LEGAL_CONFIG.location}
        </p>
        <p>
          <strong>Contact us:</strong> For privacy-related questions, email{' '}
          <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a>
        </p>
      </section>

      {/* Key Points */}
      <section>
        <h2>2. Key Points Summary</h2>
        <ul>
          <li><strong>No health data:</strong> {LEGAL_CONFIG.statements.noHealthData}</li>
          <li><strong>No email marketing:</strong> {LEGAL_CONFIG.statements.noEmailMarketing}</li>
          <li><strong>Educational purpose:</strong> {LEGAL_CONFIG.statements.educationalOnly}</li>
          <li><strong>Optional accounts:</strong> User accounts are optional. You can use most features without creating an account.</li>
          <li><strong>Local-first privacy:</strong> Progress tracking uses local storage on your device. Optional account sync available.</li>
          <li><strong>No external tracking:</strong> We do not use Google Analytics, Facebook Pixel, or similar third-party tracking services.</li>
          <li><strong>Your rights:</strong> You have full control over your data under UK GDPR.</li>
        </ul>
      </section>

      {/* What Data We Collect */}
      <section>
        <h2>3. What Data We Collect</h2>
        
        <h3>3.1 Information You Provide Directly</h3>
        <h4>User Accounts (Optional — UK Region Only)</h4>
        <p>If you create an account, we collect:</p>
        <ul>
          <li>Email address (used for login and password reset)</li>
          <li>Password (stored as a secure hash; we cannot see your actual password)</li>
          <li>Email verification status</li>
          <li>Two-factor authentication settings (if enabled by you)</li>
        </ul>
        
        <h4>Contact Form</h4>
        <p>If you contact us via our contact form, we collect:</p>
        <ul>
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your message</li>
        </ul>
        <p>
          <strong>Note:</strong> Contact form data is sent to us via email and is <strong>not stored in our database</strong>. 
          We retain your email in our email inbox only as long as necessary to respond to your inquiry.
        </p>

        <h3>3.2 Information Collected Automatically</h3>
        <h4>Progress Tracking (Device-Based)</h4>
        <p>When you use breathing techniques or learning tools, we store progress data including:</p>
        <ul>
          <li>Device identifier (randomly generated; does not identify you personally)</li>
          <li>Breathing session details (technique used, duration, number of breaths)</li>
          <li>Progress statistics (total sessions, streaks, badges earned)</li>
          <li>Challenge and quest completion status</li>
          <li>Voice and accessibility preferences</li>
        </ul>
        <p>
          <strong>Where is this stored?</strong> By default, progress data is stored <strong>locally on your device</strong> using your browser's 
          localStorage. If you create an account, you can optionally sync this data to our secure database so it's available across devices.
        </p>

        <h4>Reading Assessment Data (Dyslexia Tools)</h4>
        <p>If you use our dyslexia reading training tools, we may store:</p>
        <ul>
          <li>Reading attempt results (accuracy, speed, errors)</li>
          <li>Learner placement level</li>
          <li>Progress through reading exercises</li>
        </ul>
        <p>This data is associated with your device ID or user account (if logged in).</p>

        <h4>Technical Data</h4>
        <p>Our web server automatically logs:</p>
        <ul>
          <li>IP address (for security, rate limiting, and region detection)</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Pages visited and time spent</li>
          <li>Referral source (how you found us)</li>
        </ul>
        <p>
          <strong>Retention:</strong> Technical logs are retained for up to 90 days for security monitoring and troubleshooting, 
          then automatically deleted.
        </p>

        <h4>Cookies and Local Storage</h4>
        <p>We use cookies and localStorage for:</p>
        <ul>
          <li><strong>Essential cookies:</strong> Session management, security, region preference (cannot be disabled)</li>
          <li><strong>Functional storage:</strong> Saving your progress locally, accessibility preferences</li>
          <li><strong>Consent management:</strong> Remembering your cookie choices</li>
        </ul>
        <p>
          See our <Link href="/uk/legal/cookies">Cookie Policy</Link> for full details.
        </p>

        <h3>3.3 What We Do NOT Collect</h3>
        <ul>
          <li>We <strong>do not collect health data or biometric data</strong></li>
          <li>We do not collect sensitive categories of personal data (race, religion, political opinions, etc.)</li>
          <li>We do not track you across other websites (no cross-site tracking)</li>
          <li>We do not use third-party advertising networks or tracking pixels</li>
          <li>We do not use Google Analytics, Facebook Pixel, or similar external trackers</li>
        </ul>
      </section>

      {/* How We Use Your Data */}
      <section>
        <h2>4. How We Use Your Data</h2>
        <p>We use your personal data only for the following purposes:</p>

        <h3>4.1 Providing Our Service</h3>
        <ul>
          <li>To enable you to create and access your account</li>
          <li>To save and sync your progress across devices</li>
          <li>To provide personalized learning and breathing tools</li>
          <li>To remember your preferences (voice, accessibility settings)</li>
        </ul>
        <p><strong>Lawful basis:</strong> {LEGAL_CONFIG.lawfulBases.accountCreation}</p>

        <h3>4.2 Communication</h3>
        <ul>
          <li>To respond to your inquiries via the contact form</li>
          <li>To send password reset emails (if you request one)</li>
          <li>To notify you of important account or security updates (rare)</li>
        </ul>
        <p>
          <strong>We do not send marketing emails, newsletters, or promotional content.</strong>
        </p>
        <p><strong>Lawful basis:</strong> {LEGAL_CONFIG.lawfulBases.contactForm}</p>

        <h3>4.3 Security and Fraud Prevention</h3>
        <ul>
          <li>To protect against spam, abuse, and fraudulent activity</li>
          <li>To detect and prevent security incidents</li>
          <li>To enforce our Terms of Service</li>
        </ul>
        <p><strong>Lawful basis:</strong> {LEGAL_CONFIG.lawfulBases.essentialCookies}</p>

        <h3>4.4 Improvement and Analytics (Future)</h3>
        <p>
          Currently, we <strong>do not use third-party analytics tools</strong>. Our analytics are privacy-focused and stored 
          locally on your device only (no data sent to our servers).
        </p>
        <p>
          If we introduce server-side analytics in the future, we will:
        </p>
        <ul>
          <li>Request your explicit consent via our cookie banner</li>
          <li>Use privacy-friendly analytics tools (no cross-site tracking)</li>
          <li>Anonymize or pseudonymize data wherever possible</li>
          <li>Update this Privacy Policy and notify existing users</li>
        </ul>
        <p><strong>Lawful basis (if implemented):</strong> {LEGAL_CONFIG.lawfulBases.analytics}</p>
      </section>

      {/* Data Sharing */}
      <section>
        <h2>5. Data Sharing and Disclosure</h2>
        <p>
          We <strong>do not sell, rent, or trade your personal information</strong> to third parties for marketing purposes.
        </p>

        <h3>5.1 Service Providers</h3>
        <p>We may share data with trusted service providers who help us operate our service:</p>
        <ul>
          <li><strong>Hosting provider:</strong> Your data is stored on secure servers in the European Economic Area (EEA)</li>
          <li><strong>Email service:</strong> For sending password reset emails and responding to contact form submissions (Resend)</li>
          <li><strong>Anti-spam service:</strong> For protecting our contact form from abuse (Cloudflare Turnstile)</li>
        </ul>
        <p>
          All service providers are contractually required to protect your data and use it only for the purposes we specify.
        </p>

        <h3>5.2 Legal Requirements</h3>
        <p>We may disclose your data if required by law, including:</p>
        <ul>
          <li>To comply with a court order, subpoena, or legal process</li>
          <li>To protect the rights, property, or safety of NeuroBreath, our users, or the public</li>
          <li>In connection with an investigation of fraud, abuse, or security incidents</li>
        </ul>

        <h3>5.3 Business Transfers</h3>
        <p>
          If NeuroBreath is involved in a merger, acquisition, or sale of assets, your data may be transferred. 
          We will notify you via email and/or a prominent notice on our website before your data is transferred and becomes 
          subject to a different Privacy Policy.
        </p>
      </section>

      {/* International Transfers */}
      <section>
        <h2>6. International Data Transfers</h2>
        <p>{LEGAL_CONFIG.statements.dataLocation}</p>
        <p>
          If we transfer data outside the UK or EEA in the future, we will ensure appropriate safeguards are in place, such as:
        </p>
        <ul>
          <li>European Commission-approved Standard Contractual Clauses</li>
          <li>Adequacy decisions recognizing equivalent data protection standards</li>
          <li>Other lawful transfer mechanisms under UK GDPR</li>
        </ul>
      </section>

      {/* Data Retention */}
      <section>
        <h2>7. Data Retention</h2>
        <p>We retain your data only for as long as necessary:</p>
        <ul>
          <li><strong>User accounts:</strong> {LEGAL_CONFIG.dataRetention.accounts}</li>
          <li><strong>Progress data:</strong> {LEGAL_CONFIG.dataRetention.progressData}</li>
          <li><strong>Password reset tokens:</strong> {LEGAL_CONFIG.dataRetention.passwordResetTokens}</li>
          <li><strong>Contact form emails:</strong> {LEGAL_CONFIG.dataRetention.contactFormData}</li>
          <li><strong>Technical logs:</strong> Up to 90 days</li>
        </ul>
        <p>
          When you delete your account or request data deletion, we will permanently delete your data within 30 days, 
          except where we are required to retain it for legal or regulatory purposes.
        </p>
      </section>

      {/* Your Rights */}
      <section>
        <h2>8. Your Rights Under UK GDPR</h2>
        <p>You have the following rights regarding your personal data:</p>

        <h3>8.1 Right of Access</h3>
        <p>
          You can request a copy of all personal data we hold about you. We will provide this free of charge within one month.
        </p>

        <h3>8.2 Right to Rectification</h3>
        <p>You can ask us to correct any inaccurate or incomplete personal data.</p>

        <h3>8.3 Right to Erasure ("Right to be Forgotten")</h3>
        <p>
          You can request deletion of your personal data. We will comply unless we have a legal obligation to retain it.
        </p>

        <h3>8.4 Right to Restrict Processing</h3>
        <p>You can ask us to limit how we use your data in certain circumstances.</p>

        <h3>8.5 Right to Data Portability</h3>
        <p>
          You can request your data in a structured, machine-readable format (e.g., JSON) and transfer it to another service.
        </p>

        <h3>8.6 Right to Object</h3>
        <p>
          You can object to processing based on legitimate interests. We will stop processing unless we have compelling legitimate 
          grounds that override your rights.
        </p>

        <h3>8.7 Rights Related to Automated Decision-Making</h3>
        <p>
          We <strong>do not use automated decision-making or profiling</strong> that produces legal or similarly significant effects.
        </p>

        <h3>8.8 How to Exercise Your Rights</h3>
        <p>To exercise any of these rights, please:</p>
        <ul>
          <li>Email us at <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a></li>
          <li>Visit our <Link href="/uk/legal/data-rights">Data Rights</Link> page for detailed instructions</li>
          <li>Include enough information to verify your identity (we may ask for confirmation to prevent fraud)</li>
        </ul>
        <p>We will respond within one month. If your request is complex, we may extend this by two additional months.</p>

        <h3>8.9 Right to Complain</h3>
        <p>
          If you are unhappy with how we handle your data, you have the right to lodge a complaint with the UK's supervisory authority:
        </p>
        <p>
          <strong>Information Commissioner's Office (ICO)</strong><br />
          Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">https://ico.org.uk</a><br />
          Helpline: 0303 123 1113
        </p>
      </section>

      {/* Children's Privacy */}
      <section>
        <h2>9. Children's Privacy</h2>
        <p>
          Our service is <strong>not intended for children under the age of 13</strong>. We do not knowingly collect personal information 
          from children under 13.
        </p>
        <p>
          If you are a parent or guardian and believe your child has provided us with personal information, please contact us at{' '}
          <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a>. We will delete the information promptly.
        </p>
        <p>
          <strong>Note for educators and parents:</strong> If you are using NeuroBreath in a school or family setting with children, 
          you are responsible for ensuring appropriate consent and supervision.
        </p>
      </section>

      {/* Security */}
      <section>
        <h2>10. Security Measures</h2>
        <p>We take security seriously and implement industry-standard measures to protect your data:</p>
        <ul>
          <li><strong>Encryption:</strong> All data in transit is encrypted using HTTPS/TLS</li>
          <li><strong>Password security:</strong> Passwords are hashed using bcrypt (we cannot see your plaintext password)</li>
          <li><strong>Access controls:</strong> Only authorized personnel can access databases and systems</li>
          <li><strong>Regular updates:</strong> We keep our software and dependencies up to date with security patches</li>
          <li><strong>Rate limiting:</strong> Protection against brute-force attacks and abuse</li>
          <li><strong>Monitoring:</strong> We monitor for suspicious activity and security incidents</li>
        </ul>
        <p>
          No system is 100% secure. If we become aware of a data breach that poses a risk to your rights, we will notify you 
          and the ICO within 72 hours as required by UK GDPR.
        </p>
      </section>

      {/* Changes to This Policy */}
      <section>
        <h2>11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or service features.
        </p>
        <p>When we make significant changes, we will:</p>
        <ul>
          <li>Update the "Last Updated" date at the top of this page</li>
          <li>Notify registered users via email (if we have your email address)</li>
          <li>Display a prominent notice on our website</li>
        </ul>
        <p>
          Continued use of our service after changes take effect constitutes acceptance of the updated Privacy Policy.
        </p>
      </section>

      {/* Contact Us */}
      <section>
        <h2>12. Contact Us</h2>
        <p>For questions, concerns, or to exercise your data rights, contact us at:</p>
        <p>
          <strong>Email:</strong> <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a><br />
          <strong>General inquiries:</strong> <a href={`mailto:${LEGAL_CONFIG.contactEmail}`}>{LEGAL_CONFIG.contactEmail}</a><br />
          <strong>Location:</strong> {LEGAL_CONFIG.location}
        </p>
        <p>
          We aim to respond to all privacy inquiries within 5 business days.
        </p>
      </section>

      {/* Legal Disclaimer */}
      <section className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h2>Legal Disclaimer</h2>
        <p className="mb-0">
          <strong>This Privacy Policy is a best-practice draft and is not legal advice.</strong> It has been prepared in good faith 
          based on UK GDPR requirements. {LEGAL_CONFIG.organizationName} recommends seeking review by a qualified solicitor before 
          relying on this policy for legal compliance purposes.
        </p>
      </section>
    </LegalLayout>
  );
}
