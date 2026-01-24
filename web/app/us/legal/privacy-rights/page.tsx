import Link from "next/link";

import { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LEGAL_CONFIG } from '@/lib/legal/legalConfig';

export const metadata: Metadata = {
  title: 'Your Privacy Rights | NeuroBreath US',
  description: 'How to exercise your privacy rights under CCPA, CPRA, and other US state privacy laws.',
  robots: 'index, follow',
};

export default function USPrivacyRightsPage() {
  return (
    <LegalLayout
      region="us"
      currentPage="privacy-rights"
      lastUpdated={LEGAL_CONFIG.lastUpdated.privacy}
      title="Your Privacy Rights (US)"
      description="How to exercise your rights under US state privacy laws"
    >
      <section>
        <h2>1. Introduction</h2>
        <p>
          Under US state privacy laws — including the California Consumer Privacy Act (CCPA/CPRA), Virginia Consumer Data Protection 
          Act (CDPA), Colorado Privacy Act (CPA), Connecticut Data Privacy Act (CTDPA), and others — you have rights regarding your 
          personal information.
        </p>
        <p>
          This page explains your rights and how to exercise them. For full details on our data practices, see our{' '}
          <Link href="/us/legal/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>2. Your Rights Summary</h2>
        <ul>
          <li><strong>Right to know:</strong> Request details about what personal information we collect, use, disclose, and sell</li>
          <li><strong>Right to delete:</strong> Request deletion of your personal information</li>
          <li><strong>Right to correct:</strong> Request correction of inaccurate data</li>
          <li><strong>Right to opt out of sale:</strong> We do not sell your data</li>
          <li><strong>Right to opt out of targeted advertising:</strong> We do not serve targeted ads</li>
          <li><strong>Right to limit use of sensitive personal information:</strong> We do not collect sensitive PI</li>
          <li><strong>Right to non-discrimination:</strong> We will not discriminate against you for exercising your rights</li>
          <li><strong>Right to data portability:</strong> Receive your data in a portable format</li>
        </ul>
      </section>

      <section>
        <h2>3. We Do Not Sell Your Personal Information</h2>
        <p className="text-lg font-semibold text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-950 p-4 rounded">
          ✓ {LEGAL_CONFIG.organizationName} does <strong>NOT sell</strong> your personal information.<br />
          ✓ We do <strong>NOT share</strong> your information for cross-context behavioral advertising.<br />
          ✓ We do <strong>NOT use</strong> third-party advertising networks or tracking pixels.
        </p>
        <p>
          Because we do not engage in these practices, the "opt-out of sale" and "opt-out of targeted advertising" rights do not apply.
        </p>
      </section>

      <section>
        <h2>4. We Do Not Collect Sensitive Personal Information</h2>
        <p>
          Under California law, "sensitive personal information" includes Social Security numbers, financial account information, 
          precise geolocation, race, religion, health data, and more.
        </p>
        <p>
          <strong>{LEGAL_CONFIG.organizationName} does not collect sensitive personal information as defined by CCPA/CPRA.</strong>
        </p>
        <p>Specifically:</p>
        <ul>
          <li>We do not collect health data or biometric data</li>
          <li>We do not collect Social Security numbers or financial information</li>
          <li>We do not collect precise geolocation</li>
          <li>We do not collect information about race, religion, political views, sex life, or sexual orientation</li>
        </ul>
      </section>

      <section>
        <h2>5. How to Exercise Your Rights</h2>
        
        <h3>5.1 Submit a Request via Email</h3>
        <p>
          Email us at <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a> with:
        </p>
        <ul>
          <li>Subject line: "Privacy Rights Request"</li>
          <li>Your full name and email address</li>
          <li>Which right you wish to exercise (e.g., "Request to know" or "Request to delete")</li>
          <li>Any details to help us locate your data (approximate account creation date, device ID, etc.)</li>
        </ul>

        <h3>5.2 Verification</h3>
        <p>
          To protect your privacy, we will verify your identity before fulfilling your request. This may include:
        </p>
        <ul>
          <li>Confirming your email address (we'll send a verification link)</li>
          <li>Matching information you provide with our records</li>
        </ul>

        <h3>5.3 Authorized Agents</h3>
        <p>
          You may designate an authorized agent to submit a request on your behalf. The agent must provide:
        </p>
        <ul>
          <li>Proof of authorization (signed permission or power of attorney)</li>
          <li>Verification of your identity</li>
        </ul>
      </section>

      <section>
        <h2>6. Right to Know</h2>
        <p>You can request the following information about your personal data:</p>
        <ul>
          <li>Categories of personal information we collect</li>
          <li>Specific pieces of personal information we hold about you</li>
          <li>Categories of sources from which we collect data</li>
          <li>Business purposes for collecting or selling data</li>
          <li>Categories of third parties with whom we share data</li>
        </ul>
        <p>
          <strong>Response timeline:</strong> We will respond within <strong>45 days</strong>. Complex requests may extend to 90 days 
          (we will notify you).
        </p>
        <p>
          <strong>Format:</strong> We will provide data in a portable format (JSON or CSV).
        </p>
      </section>

      <section>
        <h2>7. Right to Delete</h2>
        <p>
          You can request deletion of your personal information. We will comply unless we have a legal reason to retain it (e.g., 
          completing a transaction, security, legal compliance).
        </p>
        <p>
          <strong>What will be deleted:</strong> Progress data, preferences, device profiles, any account data (if applicable).
        </p>
        <p>
          <strong>Timeline:</strong> Deletion within 30 days of verification.
        </p>
        <p>
          <strong>Local data:</strong> If your data is stored locally in your browser (guest progress), you can delete it yourself by 
          clearing browser data.
        </p>
      </section>

      <section>
        <h2>8. Right to Correct</h2>
        <p>
          You can request correction of inaccurate personal information. Email us with details of what needs correcting.
        </p>
        <p>
          <strong>Timeline:</strong> We will make corrections within 45 days.
        </p>
      </section>

      <section>
        <h2>9. Right to Data Portability</h2>
        <p>
          You can request your data in a structured, machine-readable format (JSON or CSV) to transfer to another service.
        </p>
        <p>
          <strong>How to request:</strong> Email <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a> 
          with "Data Portability Request".
        </p>
      </section>

      <section>
        <h2>10. Right to Non-Discrimination</h2>
        <p>
          We will <strong>not discriminate</strong> against you for exercising your privacy rights. Specifically, we will not:
        </p>
        <ul>
          <li>Deny you goods or services</li>
          <li>Charge different prices or rates</li>
          <li>Provide a different level or quality of service</li>
          <li>Suggest you will receive a different price or service</li>
        </ul>
        <p>
          You will receive the same access and quality of service whether or not you exercise your rights.
        </p>
      </section>

      <section>
        <h2>11. Response Timeline</h2>
        <ul>
          <li><strong>Initial response:</strong> Within 10 business days (confirmation of receipt)</li>
          <li><strong>Full response:</strong> Within 45 days (may extend to 90 days for complex requests)</li>
          <li><strong>Urgent requests:</strong> Contact us if you believe your data is at risk</li>
        </ul>
      </section>

      <section>
        <h2>12. Appeals (State-Specific)</h2>
        <p>
          If we deny your request, you have the right to appeal in certain states (California, Virginia, Colorado, Connecticut).
        </p>
        <p>
          To appeal, reply to our denial email with "Appeal" in the subject line. We will review your appeal within 45 days (or as 
          required by your state law).
        </p>
      </section>

      <section>
        <h2>13. Contact the Attorney General (If Applicable)</h2>
        <p>
          If you are not satisfied with our response, some state laws allow you to contact your state Attorney General:
        </p>
        <ul>
          <li><strong>California:</strong> <a href="https://oag.ca.gov" target="_blank" rel="noopener noreferrer">https://oag.ca.gov</a></li>
          <li><strong>Virginia:</strong> <a href="https://www.oag.state.va.us" target="_blank" rel="noopener noreferrer">https://www.oag.state.va.us</a></li>
          <li><strong>Colorado:</strong> <a href="https://coag.gov" target="_blank" rel="noopener noreferrer">https://coag.gov</a></li>
          <li><strong>Connecticut:</strong> <a href="https://portal.ct.gov/AG" target="_blank" rel="noopener noreferrer">https://portal.ct.gov/AG</a></li>
        </ul>
      </section>

      <section>
        <h2>14. Contact Us</h2>
        <p>
          To exercise your privacy rights, contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href={`mailto:${LEGAL_CONFIG.privacyEmail}`}>{LEGAL_CONFIG.privacyEmail}</a><br />
          <strong>Subject line:</strong> "Privacy Rights Request"<br />
          <strong>Location:</strong> {LEGAL_CONFIG.location}
        </p>
      </section>

      <section className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
        <h2>Summary: Your Rights at a Glance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-700">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">Right</th>
                <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">What It Means</th>
                <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">How to Exercise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2"><strong>Right to Know</strong></td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Request what data we collect about you</td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Email privacy@neurobreath.co.uk</td>
              </tr>
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2"><strong>Right to Delete</strong></td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Request deletion of your data</td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Email privacy@neurobreath.co.uk</td>
              </tr>
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2"><strong>Right to Correct</strong></td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Fix inaccurate data</td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Email privacy@neurobreath.co.uk</td>
              </tr>
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2"><strong>Opt-Out of Sale</strong></td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">We don't sell data (N/A)</td>
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Not applicable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </LegalLayout>
  );
}
