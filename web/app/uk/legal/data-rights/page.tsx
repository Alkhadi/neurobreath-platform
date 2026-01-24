import Link from "next/link";

import { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LEGAL_CONFIG } from '@/lib/legal/legalConfig';

export const metadata: Metadata = {
  title: 'Your Data Rights | NeuroBreath UK',
  description: 'How to exercise your UK GDPR data rights: access, deletion, correction, portability, and objection.',
  robots: 'index, follow',
};

export default function UKDataRightsPage() {
  return (
    <LegalLayout
      region="uk"
      currentPage="data-rights"
      lastUpdated={LEGAL_CONFIG.lastUpdated.privacy}
      title="Your Data Rights (UK GDPR)"
      description="How to access, delete, or manage your personal data"
    >
      <section>
        <h2>1. Introduction</h2>
        <p>
          Under the <strong>UK General Data Protection Regulation (UK GDPR)</strong>, you have several rights regarding your 
          personal data. This page explains your rights and how to exercise them.
        </p>
        <p>
          For full details on how we process your data, see our <Link href="/uk/legal/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>2. Your Rights Summary</h2>
        <ul>
          <li><strong>Right of access:</strong> Request a copy of your personal data</li>
          <li><strong>Right to rectification:</strong> Correct inaccurate or incomplete data</li>
          <li><strong>Right to erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
          <li><strong>Right to restrict processing:</strong> Limit how we use your data</li>
          <li><strong>Right to data portability:</strong> Receive your data in a machine-readable format</li>
          <li><strong>Right to object:</strong> Object to processing based on legitimate interests</li>
          <li><strong>Rights related to automated decision-making:</strong> We do not use automated decision-making</li>
        </ul>
      </section>

      <section>
        <h2>3. How to Exercise Your Rights</h2>
        
        <h3>3.1 Via Email</h3>
        <p>
          Send a request to <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a> with:
        </p>
        <ul>
          <li>Subject line: "Data Rights Request"</li>
          <li>Your full name and email address (as registered on your account, if applicable)</li>
          <li>Which right you wish to exercise (e.g., "Request data access" or "Request data deletion")</li>
          <li>Any additional details to help us locate your data (device ID, approximate account creation date, etc.)</li>
        </ul>

        <h3>3.2 Via Account Settings (If Logged In)</h3>
        <p>
          If you have a NeuroBreath account, you can manage some data directly:
        </p>
        <ul>
          <li><strong>Delete account:</strong> Go to Account Settings → Delete Account</li>
          <li><strong>Update email:</strong> Go to Account Settings → Email</li>
          <li><strong>Export data:</strong> Request a data export via email (we will provide JSON or CSV)</li>
        </ul>

        <h3>3.3 Verification</h3>
        <p>
          To protect your privacy, we may ask you to verify your identity before fulfilling your request. This may include:
        </p>
        <ul>
          <li>Confirming your email address (we'll send a verification link)</li>
          <li>Providing additional information to match our records</li>
        </ul>
      </section>

      <section>
        <h2>4. Right of Access (Subject Access Request)</h2>
        <p>
          You have the right to request a copy of all personal data we hold about you.
        </p>
        <p>
          <strong>What we will provide:</strong>
        </p>
        <ul>
          <li>All personal data we hold (account details, progress data, session history, etc.)</li>
          <li>The purposes of processing</li>
          <li>Categories of data</li>
          <li>Recipients (who we share data with, if applicable)</li>
          <li>Retention period</li>
          <li>Your rights (including right to complain to the ICO)</li>
        </ul>
        <p>
          <strong>Format:</strong> We will provide data in JSON or CSV format (machine-readable).
        </p>
        <p>
          <strong>Timeline:</strong> We will respond within <strong>one month</strong>. If your request is complex, we may extend 
          this by two additional months and notify you.
        </p>
        <p>
          <strong>Cost:</strong> Free. We may charge a reasonable fee for excessive or repetitive requests.
        </p>
      </section>

      <section>
        <h2>5. Right to Rectification</h2>
        <p>
          You can ask us to correct inaccurate or incomplete personal data.
        </p>
        <p>
          <strong>How to request:</strong> Email us at <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a> 
          with details of the data you want corrected.
        </p>
        <p>
          <strong>Timeline:</strong> We will make corrections within one month.
        </p>
      </section>

      <section>
        <h2>6. Right to Erasure ("Right to be Forgotten")</h2>
        <p>
          You can request deletion of your personal data. We will comply unless we have a legal obligation to retain it.
        </p>
        <p>
          <strong>What will be deleted:</strong>
        </p>
        <ul>
          <li>Your account (email, password hash)</li>
          <li>Your progress data (sessions, badges, challenges)</li>
          <li>Your preferences and device profiles</li>
        </ul>
        <p>
          <strong>What may be retained:</strong>
        </p>
        <ul>
          <li>Anonymized aggregated data for statistical purposes</li>
          <li>Data required for legal compliance or ongoing legal claims</li>
        </ul>
        <p>
          <strong>Timeline:</strong> Deletion will occur within <strong>30 days</strong> of verification.
        </p>
        <p>
          <strong>Note:</strong> If your data is stored locally in your browser's localStorage (guest progress), you can delete it 
          yourself by clearing browser data or using our in-app "Clear data" option (if available).
        </p>
      </section>

      <section>
        <h2>7. Right to Restrict Processing</h2>
        <p>
          You can ask us to limit how we use your data in the following situations:
        </p>
        <ul>
          <li>You contest the accuracy of the data (while we verify accuracy)</li>
          <li>Processing is unlawful, but you don't want deletion</li>
          <li>We no longer need the data, but you need it for legal claims</li>
          <li>You have objected to processing (pending verification of our legitimate grounds)</li>
        </ul>
        <p>
          <strong>How to request:</strong> Email <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a> 
          with your reason for restriction.
        </p>
      </section>

      <section>
        <h2>8. Right to Data Portability</h2>
        <p>
          You can request your data in a structured, machine-readable format (e.g., JSON) and transfer it to another service.
        </p>
        <p>
          <strong>What you'll receive:</strong> A downloadable file containing all your personal data.
        </p>
        <p>
          <strong>How to request:</strong> Email <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a> 
          with "Data Portability Request" in the subject line.
        </p>
        <p>
          <strong>Timeline:</strong> We will provide the file within one month.
        </p>
      </section>

      <section>
        <h2>9. Right to Object</h2>
        <p>
          You can object to processing based on legitimate interests. If you object, we will stop processing unless we have 
          compelling legitimate grounds that override your rights.
        </p>
        <p>
          <strong>Direct marketing:</strong> We do not send marketing emails, so this right is less applicable. However, you can 
          object to any future marketing if we introduce it.
        </p>
        <p>
          <strong>How to object:</strong> Email <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a>.
        </p>
      </section>

      <section>
        <h2>10. Automated Decision-Making and Profiling</h2>
        <p>
          NeuroBreath <strong>does not use automated decision-making or profiling</strong> that produces legal or similarly 
          significant effects.
        </p>
        <p>
          All personalization (e.g., suggesting breathing techniques) is based on your explicit choices, not automated profiling.
        </p>
      </section>

      <section>
        <h2>11. Right to Complain</h2>
        <p>
          If you are unhappy with how we handle your data or your rights request, you have the right to lodge a complaint with the 
          UK's supervisory authority:
        </p>
        <p>
          <strong>Information Commissioner's Office (ICO)</strong><br />
          Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">https://ico.org.uk</a><br />
          Helpline: 0303 123 1113<br />
          Address: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF
        </p>
        <p>
          <strong>We encourage you to contact us first</strong> so we can resolve your concern.
        </p>
      </section>

      <section>
        <h2>12. Response Timeline</h2>
        <ul>
          <li><strong>Standard requests:</strong> One month from receipt of your request</li>
          <li><strong>Complex requests:</strong> Up to three months total (we will notify you if an extension is needed)</li>
          <li><strong>Urgent requests:</strong> If you believe your data is at risk, contact us immediately and we will prioritize your request</li>
        </ul>
      </section>

      <section>
        <h2>13. Contact Us</h2>
        <p>
          To exercise any of your data rights, contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a><br />
          <strong>Subject line:</strong> "Data Rights Request"<br />
          <strong>Location:</strong> {LEGAL_CONFIG.location}
        </p>
        <p>
          We aim to respond to all privacy inquiries within 5 business days.
        </p>
      </section>
    </LegalLayout>
  );
}
