import { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LEGAL_CONFIG } from '@/lib/legal/legalConfig';

export const metadata: Metadata = {
  title: 'Accessibility Statement | NeuroBreath US',
  description: 'Our commitment to making NeuroBreath accessible to everyone. WCAG guidelines and known limitations.',
  robots: 'index, follow',
};

export default function UKAccessibilityPage() {
  return (
    <LegalLayout
      region="us"
      currentPage="accessibility"
      lastUpdated={LEGAL_CONFIG.lastUpdated.accessibility}
      title="Accessibility Statement"
      description="Our commitment to digital accessibility"
    >
      <section>
        <h2>1. Our Commitment</h2>
        <p>
          {LEGAL_CONFIG.organizationName} is committed to ensuring digital accessibility for people with disabilities. 
          We are continually improving the user experience for everyone and applying the relevant accessibility standards.
        </p>
      </section>

      <section>
        <h2>2. Conformance Status</h2>
        <p>
          We aim to conform with the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. 
          These guidelines explain how to make web content more accessible for people with disabilities.
        </p>
        <p>
          <strong>Current status:</strong> Partially conformant. We are actively working to address known accessibility issues.
        </p>
      </section>

      <section>
        <h2>3. Accessibility Features</h2>
        <p>NeuroBreath includes the following accessibility features:</p>
        <ul>
          <li><strong>Keyboard navigation:</strong> All interactive elements are accessible via keyboard</li>
          <li><strong>Screen reader compatibility:</strong> Semantic HTML and ARIA labels for assistive technologies</li>
          <li><strong>Contrast ratios:</strong> Text and interactive elements meet WCAG AA contrast requirements</li>
          <li><strong>Resizable text:</strong> Text can be resized up to 200% without loss of functionality</li>
          <li><strong>Focus indicators:</strong> Clear visual focus states for keyboard navigation</li>
          <li><strong>Alternative text:</strong> Images include descriptive alt text</li>
          <li><strong>Reduced motion:</strong> Respects prefers-reduced-motion user preferences</li>
        </ul>
      </section>

      <section>
        <h2>4. Known Limitations</h2>
        <p>Despite our efforts, some limitations may exist:</p>
        <ul>
          <li>Some complex interactive components may have minor accessibility issues</li>
          <li>Third-party embedded content may not meet our accessibility standards</li>
          <li>PDF documents (if present) may have varying levels of accessibility</li>
        </ul>
        <p>We are working to address these limitations in future updates.</p>
      </section>

      <section>
        <h2>5. Assistive Technologies</h2>
        <p>NeuroBreath is designed to be compatible with:</p>
        <ul>
          <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
          <li>Screen magnification software</li>
          <li>Speech recognition software</li>
          <li>Alternative input devices</li>
        </ul>
      </section>

      <section>
        <h2>6. Feedback and Contact</h2>
        <p>
          We welcome feedback on the accessibility of NeuroBreath. If you encounter accessibility barriers or have suggestions 
          for improvement, please contact us:
        </p>
        <p>
          <strong>Email:</strong> <a href={`mailto:${LEGAL_CONFIG.supportEmail}`}>{LEGAL_CONFIG.supportEmail}</a><br />
          <strong>Subject line:</strong> "Accessibility Feedback"
        </p>
        <p>
          We aim to respond within 5 business days.
        </p>
      </section>

      <section>
        <h2>7. Ongoing Improvements</h2>
        <p>
          Accessibility is an ongoing effort. We regularly:
        </p>
        <ul>
          <li>Conduct accessibility audits and testing</li>
          <li>Gather user feedback and implement improvements</li>
          <li>Train our team on accessibility best practices</li>
          <li>Update this statement to reflect current conformance status</li>
        </ul>
      </section>

      <section>
        <h2>8. Legal Standards</h2>
        <p>
          This website aims to comply with:
        </p>
        <ul>
          <li><strong>UK:</strong> Americans with Disabilities Act (ADA)</li>
          <li><strong>UK Public Sector:</strong> Public Sector Bodies (Websites and Mobile Applications) Accessibility Regulations 2018 (applicable where relevant)</li>
          <li><strong>International:</strong> WCAG 2.1 Level AA</li>
        </ul>
      </section>
    </LegalLayout>
  );
}
