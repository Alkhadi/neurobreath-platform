import { Metadata } from 'next';
import { Users, CheckCircle, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editorial Policy | Trust Centre | NeuroBreath',
  description: 'Our editorial standards, review processes, and content quality guidelines.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="flex items-center gap-3">
        <Users className="h-8 w-8 text-blue-600" />
        Editorial Policy
      </h1>

      <p className="lead">
        NeuroBreath maintains rigorous editorial standards to ensure all health and neurodiversity content is accurate, up-to-date, and evidence-based.
      </p>

      <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-8">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Last Updated: 19 January 2026
        </h2>
        <p className="text-blue-800 dark:text-blue-200">
          Next Review: 19 April 2026 (quarterly review cycle)
        </p>
      </div>

      <h2>Editorial Process</h2>
      <p>
        All content follows a structured process from research to publication and ongoing maintenance:
      </p>

      <ol className="space-y-4">
        <li>
          <strong>Research</strong>: Identify Tier A sources (NHS, NICE, Cochrane, PubMed) for clinical claims
        </li>
        <li>
          <strong>Draft</strong>: Write content with plain language summaries and clear citations
        </li>
        <li>
          <strong>Review</strong>: Content reviewed by qualified professionals (see Reviewer Qualifications below)
        </li>
        <li>
          <strong>Publish</strong>: Content goes live with "Last Reviewed" date and evidence badges
        </li>
        <li>
          <strong>Maintain</strong>: Regular reviews based on condition type and evidence updates
        </li>
      </ol>

      <h2>Review Intervals</h2>
      <p>
        Content review frequency depends on the clinical stability of the condition and rate of new evidence:
      </p>

      <table className="not-prose w-full text-sm my-6">
        <thead className="bg-slate-100 dark:bg-slate-700">
          <tr>
            <th className="text-left p-3 font-semibold">Hub/Content Type</th>
            <th className="text-left p-3 font-semibold">Review Interval</th>
            <th className="text-left p-3 font-semibold">Rationale</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          <tr>
            <td className="p-3">ADHD</td>
            <td className="p-3">Quarterly (3 months)</td>
            <td className="p-3">Active research area, NICE updates</td>
          </tr>
          <tr>
            <td className="p-3">Autism</td>
            <td className="p-3">Quarterly (3 months)</td>
            <td className="p-3">Active research, policy changes</td>
          </tr>
          <tr>
            <td className="p-3">Anxiety</td>
            <td className="p-3">Biannually (6 months)</td>
            <td className="p-3">Established evidence base</td>
          </tr>
          <tr>
            <td className="p-3">Dyslexia</td>
            <td className="p-3">Biannually (6 months)</td>
            <td className="p-3">Stable guidelines</td>
          </tr>
          <tr>
            <td className="p-3">Sleep</td>
            <td className="p-3">Annually (12 months)</td>
            <td className="p-3">Well-established evidence</td>
          </tr>
          <tr>
            <td className="p-3">Breathing Exercises</td>
            <td className="p-3">Annually (12 months)</td>
            <td className="p-3">Stable techniques</td>
          </tr>
          <tr>
            <td className="p-3">Trust Centre</td>
            <td className="p-3">Quarterly (3 months)</td>
            <td className="p-3">Governance standard</td>
          </tr>
        </tbody>
      </table>

      <h2>Reviewer Qualifications</h2>
      <p>
        Content is reviewed by professionals with relevant qualifications and lived experience:
      </p>

      <div className="not-prose space-y-4 my-6">
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 border border-slate-200 dark:border-slate-600">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Clinical Reviewers
          </h3>
          <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <li>• Educational Psychologists (BPS chartered)</li>
            <li>• SEND Specialists (qualified teachers with SENCo credentials)</li>
            <li>• Clinical Psychologists (HCPC registered)</li>
            <li>• Occupational Therapists (HCPC registered)</li>
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 border border-slate-200 dark:border-slate-600">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Lived Experience Advisors
          </h3>
          <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <li>• Adults with neurodevelopmental conditions</li>
            <li>• Parents of neurodiverse children</li>
            <li>• Teachers and SENCos (school-based experience)</li>
            <li>• Workplace inclusion specialists</li>
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 border border-slate-200 dark:border-slate-600">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Evidence Specialists
          </h3>
          <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <li>• Researchers with systematic review experience</li>
            <li>• Librarians (health information specialists)</li>
            <li>• NICE guideline developers (consultant basis)</li>
          </ul>
        </div>
      </div>

      <h2>Content Changelog & Versioning</h2>
      <p>
        We maintain transparency about what changes and when:
      </p>

      <ul>
        <li><strong>Version numbering:</strong> Major.Minor (e.g., 1.0, 1.1, 2.0)</li>
        <li><strong>Major version:</strong> Significant content updates, guideline changes, new evidence</li>
        <li><strong>Minor version:</strong> Clarifications, typo fixes, formatting improvements</li>
        <li><strong>Changelog location:</strong> Bottom of each hub page, visible to all users</li>
        <li><strong>Archive policy:</strong> Previous versions archived for 2 years</li>
      </ul>

      <h3>Example Changelog Entry</h3>
      <div className="not-prose bg-slate-100 dark:bg-slate-800 rounded p-4 my-4 font-mono text-sm">
        <strong>Version 1.2</strong> (15 January 2026)<br />
        • Added NICE NG87 (2024 update) recommendations<br />
        • Updated school support section with DfE guidance<br />
        • Reviewed by: Dr. Jane Smith (Educational Psychologist)<br />
        • Next review: 15 April 2026
      </div>

      <h2>Content Standards</h2>

      <h3>Language & Tone</h3>
      <ul>
        <li><strong>Plain language:</strong> Aimed at UK reading age 12+ (except technical terms where necessary)</li>
        <li><strong>Person-first and identity-first:</strong> Respect both "person with autism" and "autistic person"</li>
        <li><strong>Strengths-based:</strong> Focus on support and strategies, not deficits</li>
        <li><strong>UK spelling:</strong> Colour, behaviour, centre (not color, behavior, center)</li>
      </ul>

      <h3>Evidence Requirements</h3>
      <ul>
        <li><strong>Clinical claims:</strong> Must have Tier A citation (NHS, NICE, Cochrane, peer-reviewed journal)</li>
        <li><strong>Support strategies:</strong> Can use Tier B sources (reputable charities like NAS, Mind) with clear labeling</li>
        <li><strong>Lived experience:</strong> Clearly labeled as anecdotal, not clinical evidence</li>
        <li><strong>Uncertainty language:</strong> "Research suggests" (not "proven to"), "may help" (not "will cure")</li>
      </ul>

      <h3>Prohibited Content</h3>
      <p>
        We do not publish content that:
      </p>
      <ul>
        <li>❌ Claims to diagnose conditions</li>
        <li>❌ Recommends specific medications (signpost to GP instead)</li>
        <li>❌ Uses "cure" or "treat" language without RCT evidence</li>
        <li>❌ Contradicts NHS/NICE guidance without explicit rationale</li>
        <li>❌ Promotes unproven therapies or products</li>
        <li>❌ Stigmatizes neurodevelopmental conditions</li>
      </ul>

      <h2>Correction Policy</h2>
      <p>
        If you identify an error or outdated information:
      </p>
      <ol>
        <li><strong>Report:</strong> Contact us with the specific page URL and error description</li>
        <li><strong>Review:</strong> Content team reviews within 48 hours</li>
        <li><strong>Urgent corrections:</strong> Safety-critical errors corrected within 24 hours</li>
        <li><strong>Non-urgent corrections:</strong> Incorporated into next scheduled review</li>
        <li><strong>Transparency:</strong> Significant corrections noted in changelog</li>
      </ol>

      <h2>Conflicts of Interest</h2>
      <p>
        NeuroBreath maintains editorial independence:
      </p>
      <ul>
        <li>✓ No pharmaceutical company funding</li>
        <li>✓ No paid product placements or endorsements</li>
        <li>✓ All external partnerships disclosed</li>
        <li>✓ Reviewers declare any conflicts before reviewing content</li>
      </ul>

      <h2>Accessibility Standards</h2>
      <p>
        All content meets <strong>WCAG 2.1 Level AA</strong> standards:
      </p>
      <ul>
        <li>✓ Dyslexia-friendly fonts available</li>
        <li>✓ Screen reader compatible</li>
        <li>✓ Keyboard navigation supported</li>
        <li>✓ High contrast mode available</li>
        <li>✓ Text-to-speech integration (NeuroBreath Buddy)</li>
      </ul>

      <div className="not-prose bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-6 my-8">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Questions About Our Editorial Process?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 text-sm mb-3">
          If you have questions about how we create, review, or maintain content, or if you'd like to report an error, 
          please contact us.
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          This editorial policy is reviewed quarterly and updated as standards evolve.
        </p>
      </div>
    </div>
  );
}
