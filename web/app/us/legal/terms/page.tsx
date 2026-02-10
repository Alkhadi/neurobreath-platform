import Link from "next/link";

import { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LEGAL_CONFIG } from '@/lib/legal/legalConfig';

export const metadata: Metadata = {
  title: 'Terms of Service | NeuroBreath US',
  description: 'Read the Terms of Service for using NeuroBreath. Educational use only. Not medical advice.',
  robots: 'index, follow',
};

export default function UKTermsPage() {
  return (
    <LegalLayout
      region="us"
      currentPage="terms"
      lastUpdated={LEGAL_CONFIG.lastUpdated.terms}
      title="Terms of Service"
      description="Terms and conditions for using NeuroBreath"
    >
      {/* Introduction */}
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          Welcome to {LEGAL_CONFIG.organizationName}. By accessing or using our website at{' '}
          <a href={LEGAL_CONFIG.siteUrl}>{LEGAL_CONFIG.siteUrl}</a> and our services, you agree to be bound by these 
          Terms of Service ("Terms").
        </p>
        <p>
          <strong>If you do not agree to these Terms, you must not use our service.</strong>
        </p>
        <p>
          These Terms apply to all visitors, users, and others who access or use the service, whether you create an account or not.
        </p>
      </section>

      {/* Educational Purpose & Medical Disclaimer */}
      <section className="bg-amber-50 dark:bg-amber-950 p-6 rounded-lg border-2 border-amber-400 dark:border-amber-600">
        <h2>2. Educational Purpose & Medical Disclaimer</h2>
        <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">
          ⚠️ {LEGAL_CONFIG.statements.educationalOnly}
        </p>
        <p>
          <strong>This is the most important section. Please read carefully.</strong>
        </p>
        <ul>
          <li>
            <strong>Not medical advice:</strong> NeuroBreath provides educational information and self-help tools. Nothing on this 
            website constitutes medical advice, diagnosis, treatment, or professional healthcare guidance.
          </li>
          <li>
            <strong>Not a substitute for professional care:</strong> Our content is not a substitute for consultation with a qualified 
            healthcare professional (GP, psychiatrist, psychologist, therapist, etc.).
          </li>
          <li>
            <strong>No medical claims:</strong> We do not claim to cure, treat, or prevent any medical or mental health condition.
          </li>
          <li>
            <strong>Consult a professional:</strong> If you have health concerns, are experiencing a mental health crisis, or need 
            medical advice, please consult a qualified clinician or contact emergency services immediately.
          </li>
          <li>
            <strong>Emergency situations:</strong> If you are in immediate danger or experiencing a medical emergency, call 999 (UK) 
            or your local emergency number. Do not rely on NeuroBreath for urgent medical situations.
          </li>
        </ul>
        <p>
          <strong>Use at your own risk.</strong> You are solely responsible for any decisions you make regarding your health and wellbeing.
        </p>
      </section>

      {/* Eligibility */}
      <section>
        <h2>3. Eligibility</h2>
        <p>
          You must be at least <strong>13 years old</strong> to use NeuroBreath. If you are under 18, you should have permission from 
          a parent or guardian.
        </p>
        <p>
          By using our service, you represent and warrant that:
        </p>
        <ul>
          <li>You meet the age requirement</li>
          <li>You have the legal capacity to enter into these Terms</li>
          <li>You will use the service in compliance with these Terms and all applicable laws</li>
        </ul>
      </section>

      {/* User Accounts */}
      <section>
        <h2>4. User Accounts (Optional)</h2>
        <p>
          You can use most of NeuroBreath's features without creating an account. Accounts are <strong>optional</strong> and available 
          only in the UK region for users who want to sync their progress across devices.
        </p>

        <h3>4.1 Account Creation</h3>
        <p>If you choose to create an account:</p>
        <ul>
          <li>You must provide accurate and complete information (email address)</li>
          <li>You are responsible for maintaining the security of your password</li>
          <li>You are responsible for all activity that occurs under your account</li>
          <li>You must notify us immediately of any unauthorized access or security breach</li>
        </ul>

        <h3>4.2 Account Termination</h3>
        <p>
          You may delete your account at any time via your account settings or by emailing{' '}
          <a href={`mailto:${LEGAL_CONFIG.supportEmail}`}>{LEGAL_CONFIG.supportEmail}</a>.
        </p>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms or engage in abusive, fraudulent, or 
          illegal activity.
        </p>
      </section>

      {/* Acceptable Use */}
      <section>
        <h2>5. Acceptable Use</h2>
        <p>You agree <strong>not</strong> to:</p>
        <ul>
          <li>Use the service for any unlawful purpose or in violation of any laws</li>
          <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation</li>
          <li>Interfere with or disrupt the service or servers/networks connected to the service</li>
          <li>Attempt to gain unauthorized access to any part of the service, other accounts, or computer systems</li>
          <li>Use automated tools (bots, scrapers, crawlers) to access the service without our permission</li>
          <li>Upload or transmit viruses, malware, or other harmful code</li>
          <li>Collect or harvest personal data of other users</li>
          <li>Use the service to send spam, phishing attempts, or unsolicited communications</li>
          <li>Reverse engineer, decompile, or disassemble any part of the service</li>
          <li>Remove, obscure, or alter any proprietary notices (copyright, trademark, etc.)</li>
        </ul>
        <p>
          Violation of these rules may result in immediate termination of your access to NeuroBreath.
        </p>
      </section>

      {/* Intellectual Property */}
      <section>
        <h2>6. Intellectual Property Rights</h2>
        
        <h3>6.1 Our Content</h3>
        <p>
          All content on NeuroBreath — including text, graphics, logos, images, audio clips, video, data compilations, software, and 
          the compilation thereof — is the property of {LEGAL_CONFIG.organizationName} or its content suppliers and is protected by 
          UK and international copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You may view, download, and print content from NeuroBreath for your <strong>personal, non-commercial use</strong> only. 
          You may not:
        </p>
        <ul>
          <li>Modify, copy, distribute, transmit, display, reproduce, or create derivative works</li>
          <li>Use content for commercial purposes without our written permission</li>
          <li>Republish content on other websites or platforms</li>
        </ul>

        <h3>6.2 Trademarks</h3>
        <p>
          "NeuroBreath" and our logo are trademarks of {LEGAL_CONFIG.organizationName}. You may not use our trademarks without 
          our prior written consent.
        </p>

        <h3>6.3 Third-Party Content</h3>
        <p>
          We may reference or link to third-party research, articles, or resources for educational purposes. All third-party content 
          remains the property of its respective owners. See our <Link href="/uk/trust/evidence-policy">Evidence Policy</Link> for more information.
        </p>
      </section>

      {/* User-Generated Content */}
      <section>
        <h2>7. User-Generated Content</h2>
        <p>
          Currently, NeuroBreath does not allow users to post public comments, reviews, or other user-generated content. 
          If you submit content via our contact form, you grant us a non-exclusive license to use, reproduce, and respond to your inquiry.
        </p>
      </section>

      {/* Links to Third-Party Websites */}
      <section>
        <h2>8. Links to Third-Party Websites</h2>
        <p>
          Our website may contain links to third-party websites (e.g., research sources, support organizations). These links are 
          provided for your convenience and information only.
        </p>
        <p>
          <strong>We do not control, endorse, or take responsibility for the content, privacy practices, or terms of third-party websites.</strong> 
          When you leave NeuroBreath, you do so at your own risk. We encourage you to read the privacy policies and terms of any 
          third-party sites you visit.
        </p>
      </section>

      {/* Disclaimers & Limitations */}
      <section>
        <h2>9. Disclaimers and Limitations of Liability</h2>
        
        <h3>9.1 "As Is" Service</h3>
        <p>
          NeuroBreath is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind, either 
          express or implied, including but not limited to:
        </p>
        <ul>
          <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
          <li>Warranties that the service will be uninterrupted, error-free, or secure</li>
          <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
        </ul>

        <h3>9.2 Limitation of Liability</h3>
        <p>
          <strong>To the fullest extent permitted by law:</strong>
        </p>
        <ul>
          <li>
            {LEGAL_CONFIG.organizationName} shall not be liable for any indirect, incidental, special, consequential, or punitive 
            damages arising from your use of or inability to use the service
          </li>
          <li>
            We are not liable for any loss of profits, revenue, data, goodwill, or other intangible losses
          </li>
          <li>
            Our total liability for any claim arising from these Terms or your use of the service shall not exceed £100 (one hundred 
            pounds sterling)
          </li>
        </ul>
        <p>
          Some jurisdictions do not allow exclusion of certain warranties or limitation of liability, so the above limitations may not 
          apply to you. In such cases, our liability will be limited to the maximum extent permitted by law.
        </p>

        <h3>9.3 No Liability for Health Outcomes</h3>
        <p>
          <strong>
            {LEGAL_CONFIG.organizationName} is not liable for any health outcomes, medical consequences, or personal decisions 
            resulting from your use of our educational content or breathing techniques.
          </strong> You use NeuroBreath at your own risk.
        </p>
      </section>

      {/* Indemnification */}
      <section>
        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless {LEGAL_CONFIG.organizationName}, its officers, directors, employees, 
          agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable 
          legal fees) arising from:
        </p>
        <ul>
          <li>Your use or misuse of the service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any rights of another person or entity</li>
          <li>Your violation of any applicable laws or regulations</li>
        </ul>
      </section>

      {/* Termination */}
      <section>
        <h2>11. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to NeuroBreath at any time, with or without notice, for any reason, 
          including violation of these Terms.
        </p>
        <p>
          Upon termination:
        </p>
        <ul>
          <li>Your right to use the service will immediately cease</li>
          <li>We may delete your account and data (subject to our <Link href="/us/legal/privacy">Privacy Policy</Link>)</li>
          <li>All provisions of these Terms that should survive termination will remain in effect (disclaimers, limitations of liability, indemnification)</li>
        </ul>
      </section>

      {/* Governing Law */}
      <section>
        <h2>12. Governing Law and Jurisdiction</h2>
        <p>
          These Terms are governed by and construed in accordance with the <strong>laws of England and Wales</strong>, without regard 
          to conflict of law principles.
        </p>
        <p>
          Any disputes arising from these Terms or your use of NeuroBreath shall be subject to the <strong>exclusive jurisdiction of 
          the courts of England and Wales</strong>.
        </p>
        <p>
          <strong>Note for US users:</strong> While we welcome users from the United States, {LEGAL_CONFIG.organizationName} is based 
          in the UK, and these Terms are governed by UK law. By using our service from the US, you agree to UK jurisdiction.
        </p>
      </section>

      {/* Dispute Resolution */}
      <section>
        <h2>13. Dispute Resolution</h2>
        <p>
          If you have a complaint or dispute, please contact us first at{' '}
          <a href={`mailto:${LEGAL_CONFIG.contactEmail}`}>{LEGAL_CONFIG.contactEmail}</a>. We will make reasonable efforts to 
          resolve the issue amicably.
        </p>
        <p>
          If we cannot resolve a dispute informally, you may pursue legal action in accordance with the governing law and jurisdiction 
          stated above.
        </p>
      </section>

      {/* Changes to Terms */}
      <section>
        <h2>14. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. When we make changes, we will:
        </p>
        <ul>
          <li>Update the "Last Updated" date at the top of this page</li>
          <li>Notify registered users via email (if applicable)</li>
          <li>Display a prominent notice on our website for significant changes</li>
        </ul>
        <p>
          <strong>Continued use of NeuroBreath after changes take effect constitutes your acceptance of the revised Terms.</strong> 
          If you do not agree to the new Terms, you must stop using the service.
        </p>
      </section>

      {/* Severability */}
      <section>
        <h2>15. Severability</h2>
        <p>
          If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions will continue in 
          full force and effect.
        </p>
      </section>

      {/* Entire Agreement */}
      <section>
        <h2>16. Entire Agreement</h2>
        <p>
          These Terms, together with our <Link href="/us/legal/privacy">Privacy Policy</Link> and{' '}
          <Link href="/us/legal/cookies">Cookie Policy</Link>, constitute the entire agreement between you and {LEGAL_CONFIG.organizationName} 
          regarding your use of the service.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2>17. Contact Us</h2>
        <p>
          For questions about these Terms, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href={`mailto:${LEGAL_CONFIG.contactEmail}`}>{LEGAL_CONFIG.contactEmail}</a><br />
          <strong>Location:</strong> {LEGAL_CONFIG.location}
        </p>
      </section>

      {/* Legal Disclaimer */}
      <section className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h2>Legal Disclaimer</h2>
        <p className="mb-0">
          <strong>These Terms of Service are a best-practice draft and not legal advice.</strong> {LEGAL_CONFIG.organizationName} 
          recommends seeking review by a qualified solicitor before relying on these Terms for legal compliance purposes.
        </p>
      </section>
    </LegalLayout>
  );
}
