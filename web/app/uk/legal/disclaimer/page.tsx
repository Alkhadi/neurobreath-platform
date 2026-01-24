import Link from "next/link";

import { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LEGAL_CONFIG } from '@/lib/legal/legalConfig';

export const metadata: Metadata = {
  title: 'Disclaimer | NeuroBreath UK',
  description: 'Important disclaimer: NeuroBreath provides educational information only. Not medical advice. No diagnosis. No medical claims.',
  robots: 'index, follow',
};

export default function UKDisclaimerPage() {
  return (
    <LegalLayout
      region="uk"
      currentPage="disclaimer"
      lastUpdated={LEGAL_CONFIG.lastUpdated.disclaimer}
      title="Disclaimer"
      description="Educational information only — not medical advice"
    >
      {/* Primary Disclaimer */}
      <section className="bg-amber-50 dark:bg-amber-950 p-8 rounded-lg border-2 border-amber-500 dark:border-amber-600">
        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">
          ⚠️ Read This First
        </h2>
        <p className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-4">
          {LEGAL_CONFIG.statements.educationalOnly}
        </p>
        <ul className="space-y-2 text-amber-900 dark:text-amber-100">
          <li><strong>✗ Not medical advice</strong> — This website does not provide medical advice, diagnosis, or treatment.</li>
          <li><strong>✗ Not a substitute for professional care</strong> — Always consult a qualified healthcare professional (GP, psychiatrist, psychologist, therapist) for medical concerns.</li>
          <li><strong>✗ No medical claims</strong> — We do not claim to cure, treat, prevent, or diagnose any medical or mental health condition.</li>
          <li><strong>✗ No doctor-patient relationship</strong> — Using this website does not create a doctor-patient or therapist-client relationship.</li>
        </ul>
      </section>

      {/* Emergency Situations */}
      <section className="bg-red-50 dark:bg-red-950 p-6 rounded-lg border-2 border-red-500 dark:border-red-600">
        <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-3">
          🚨 In an Emergency
        </h2>
        <p className="text-red-900 dark:text-red-100 mb-3">
          <strong>If you are in immediate danger, experiencing a medical emergency, or having suicidal thoughts:</strong>
        </p>
        <ul className="text-red-900 dark:text-red-100 space-y-2">
          <li><strong>UK:</strong> Call <strong>999</strong> or go to your nearest A&E</li>
          <li><strong>Mental health crisis:</strong> Contact Samaritans at <strong>116 123</strong> (free, 24/7)</li>
          <li><strong>US:</strong> Call <strong>911</strong> or <strong>988</strong> (Suicide & Crisis Lifeline)</li>
        </ul>
        <p className="text-red-900 dark:text-red-100 mt-3">
          <strong>Do NOT rely on NeuroBreath for urgent medical situations.</strong>
        </p>
      </section>

      {/* General Educational Purpose */}
      <section>
        <h2>1. Educational Purpose Only</h2>
        <p>
          NeuroBreath is a free educational resource designed to provide general information about:
        </p>
        <ul>
          <li>Breathing techniques and mindfulness practices</li>
          <li>Neurodevelopmental conditions (autism, ADHD, dyslexia)</li>
          <li>Mental health topics (anxiety, stress, low mood)</li>
          <li>Self-help strategies and coping skills</li>
        </ul>
        <p>
          <strong>This information is for educational purposes only.</strong> It is based on publicly available research and best 
          practices, but it is not tailored to your individual circumstances.
        </p>
      </section>

      {/* No Medical Advice */}
      <section>
        <h2>2. No Medical Advice or Diagnosis</h2>
        <p>
          The content on NeuroBreath does <strong>not</strong> constitute medical, psychiatric, psychological, or therapeutic advice.
        </p>
        <p>
          <strong>We cannot and do not:</strong>
        </p>
        <ul>
          <li>Diagnose medical or mental health conditions</li>
          <li>Prescribe medications or treatments</li>
          <li>Provide personalized medical guidance</li>
          <li>Replace consultations with qualified healthcare professionals</li>
          <li>Offer crisis intervention or emergency support</li>
        </ul>
        <p>
          <strong>If you have health concerns, always consult a qualified healthcare professional</strong> such as:
        </p>
        <ul>
          <li>General Practitioner (GP)</li>
          <li>Psychiatrist or psychologist</li>
          <li>Licensed therapist or counselor</li>
          <li>Clinical specialist (neurologist, pediatrician, etc.)</li>
        </ul>
      </section>

      {/* Individual Responsibility */}
      <section>
        <h2>3. Your Responsibility</h2>
        <p>
          <strong>You are solely responsible for any decisions you make regarding your health and wellbeing.</strong>
        </p>
        <p>
          By using NeuroBreath, you acknowledge and agree that:
        </p>
        <ul>
          <li>You use the information at your own risk</li>
          <li>You will seek professional medical advice for health concerns</li>
          <li>You will not delay or disregard professional medical advice based on information from NeuroBreath</li>
          <li>You understand that breathing techniques may not be suitable for everyone (see contraindications below)</li>
        </ul>
      </section>

      {/* Breathing Techniques Cautions */}
      <section>
        <h2>4. Breathing Techniques: Cautions and Contraindications</h2>
        <p>
          While breathing techniques are generally safe for most people, they may not be appropriate for everyone.
        </p>
        <p>
          <strong>Consult a healthcare professional before using breathing techniques if you have:</strong>
        </p>
        <ul>
          <li>Severe respiratory conditions (asthma, COPD, emphysema)</li>
          <li>Cardiovascular disease or heart conditions</li>
          <li>Uncontrolled high or low blood pressure</li>
          <li>Epilepsy or seizure disorders</li>
          <li>Pregnancy (some techniques may not be recommended)</li>
          <li>Recent surgery or physical trauma</li>
          <li>Panic disorder or severe anxiety (controlled breathing may initially increase discomfort in some individuals)</li>
        </ul>
        <p>
          <strong>If you feel dizzy, lightheaded, or experience discomfort during any breathing exercise, stop immediately 
          and return to normal breathing.</strong>
        </p>
        <p>
          Never force your breath or hold it beyond comfortable limits.
        </p>
      </section>

      {/* No Guarantee of Results */}
      <section>
        <h2>5. No Guarantee of Results</h2>
        <p>
          We make <strong>no guarantees</strong> about the effectiveness, outcomes, or results of using NeuroBreath.
        </p>
        <p>
          While many people find breathing techniques and educational content helpful:
        </p>
        <ul>
          <li>Individual results vary widely</li>
          <li>What works for one person may not work for another</li>
          <li>Self-help techniques are not a substitute for professional treatment when needed</li>
        </ul>
        <p>
          <strong>{LEGAL_CONFIG.organizationName} is not liable for any health outcomes, mental health changes, or personal 
          decisions resulting from your use of our content or breathing techniques.</strong>
        </p>
      </section>

      {/* Evidence and Research */}
      <section>
        <h2>6. Evidence and Research</h2>
        <p>
          We aim to base our content on reputable research and evidence-based practices. However:
        </p>
        <ul>
          <li>Research is constantly evolving; information may become outdated</li>
          <li>We may reference studies for educational purposes without implying endorsement or medical efficacy</li>
          <li>Citations and references are provided for transparency, not as medical recommendations</li>
        </ul>
        <p>
          See our <Link href="/uk/trust/evidence-policy">Evidence Policy</Link> for more details on how we source and review content.
        </p>
      </section>

      {/* Third-Party Links */}
      <section>
        <h2>7. Third-Party Links and Resources</h2>
        <p>
          NeuroBreath may contain links to external websites (e.g., research articles, charities, support organizations).
        </p>
        <p>
          <strong>We do not control or endorse third-party websites.</strong> Links are provided for convenience and information only. 
          When you leave NeuroBreath, you do so at your own risk.
        </p>
        <p>
          We are not responsible for the content, accuracy, privacy practices, or terms of third-party websites.
        </p>
      </section>

      {/* Limitation of Liability */}
      <section>
        <h2>8. Limitation of Liability</h2>
        <p>
          <strong>To the fullest extent permitted by law:</strong>
        </p>
        <ul>
          <li>
            {LEGAL_CONFIG.organizationName} shall not be liable for any health outcomes, injuries, losses, damages, or 
            adverse effects arising from your use of this website or its content
          </li>
          <li>
            We are not liable for any decisions you make based on information found on NeuroBreath
          </li>
          <li>
            We are not liable for errors, omissions, or outdated information
          </li>
        </ul>
        <p>
          See our <Link href="/uk/legal/terms">Terms of Service</Link> for full legal disclaimers and limitations of liability.
        </p>
      </section>

      {/* Accuracy and Updates */}
      <section>
        <h2>9. Accuracy and Updates</h2>
        <p>
          We strive to keep our content accurate, current, and helpful. However:
        </p>
        <ul>
          <li>We cannot guarantee the accuracy or completeness of all information</li>
          <li>Content may contain errors or become outdated</li>
          <li>We reserve the right to update, modify, or remove content at any time without notice</li>
        </ul>
        <p>
          <strong>Always cross-check important health information with a qualified healthcare professional.</strong>
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2>10. Questions or Concerns?</h2>
        <p>
          If you have questions about this disclaimer or concerns about content accuracy, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href={`mailto:${LEGAL_CONFIG.contactEmail}`}>{LEGAL_CONFIG.contactEmail}</a><br />
          <strong>Report a concern:</strong> <Link href="/uk/trust/contact">Report a concern form</Link>
        </p>
      </section>

      {/* Summary */}
      <section className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
        <h2>Summary: Key Takeaways</h2>
        <ul className="space-y-2 mb-0">
          <li>✓ <strong>Educational only</strong> — Not medical advice, diagnosis, or treatment</li>
          <li>✓ <strong>Consult professionals</strong> — Always seek qualified medical care for health concerns</li>
          <li>✓ <strong>Use at your own risk</strong> — You are responsible for your health decisions</li>
          <li>✓ <strong>Emergencies: call 999 (UK) or 911 (US)</strong> — Do not rely on NeuroBreath in urgent situations</li>
          <li>✓ <strong>Cautions apply</strong> — Breathing techniques may not be suitable for everyone; stop if uncomfortable</li>
        </ul>
      </section>
    </LegalLayout>
  );
}
