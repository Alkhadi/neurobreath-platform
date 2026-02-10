import { Metadata } from 'next';
import { BookOpen, CheckCircle, ExternalLink } from 'lucide-react';
import { EVIDENCE_SOURCES } from '@/lib/evidence/sourceRegistry';

export const metadata: Metadata = {
  title: 'Authoritative Sources | Trust Centre | NeuroBreath',
  description: 'The evidence sources we use, how we tier them, and our credibility criteria.',
};

export default function SourcesPage() {
  // Group sources by tier
  const tierASources = Object.values(EVIDENCE_SOURCES).filter(s => s.tier === 'A');
  const tierBSources = Object.values(EVIDENCE_SOURCES).filter(s => s.tier === 'B');

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-blue-600" />
        Authoritative Sources
      </h1>

      <p className="lead">
        NeuroBreath uses a tiered system to classify evidence sources by credibility and authority. 
        All health claims are backed by <strong>Tier A sources</strong> wherever possible.
      </p>

      <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-8">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Source Quality Standard
        </h2>
        <p className="text-blue-800 dark:text-blue-200">
          <strong>Tier A:</strong> Clinical and research authorities (NHS, NICE, Cochrane, PubMed)<br />
          <strong>Tier B:</strong> Reputable support organizations and charities with evidence-based content
        </p>
      </div>

      <h2>Tier A: Clinical & Research Authorities</h2>
      <p>
        Tier A sources are authoritative clinical or research organizations that produce evidence-based guidelines, 
        systematic reviews, or peer-reviewed research. <strong>All clinical claims must cite Tier A sources.</strong>
      </p>

      <div className="not-prose space-y-4 my-6">
        {tierASources.map((source) => (
          <div 
            key={source.id} 
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  {source.name}
                </h3>
                <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded mt-1">
                  Tier A
                </span>
              </div>
            </div>
            {source.notes && (
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                {source.notes}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="h-4 w-4 text-blue-600" />
              <a 
                href={`https://${source.baseUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {source.baseUrl}
              </a>
            </div>
            {source.topics && source.topics.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                  Topics:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {source.topics.map((topic) => (
                    <span 
                      key={topic}
                      className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>Tier B: Reputable Support Organizations</h2>
      <p>
        Tier B sources are reputable charities, support organizations, and professional bodies that produce 
        evidence-based content. We use these for support strategies, lived experience perspectives, and 
        practical guidance <strong>(clearly labeled as Tier B)</strong>.
      </p>

      <div className="not-prose space-y-4 my-6">
        {tierBSources.map((source) => (
          <div 
            key={source.id} 
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  {source.name}
                </h3>
                <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded mt-1">
                  Tier B
                </span>
              </div>
            </div>
            {source.notes && (
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                {source.notes}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="h-4 w-4 text-blue-600" />
              <a 
                href={`https://${source.baseUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {source.baseUrl}
              </a>
            </div>
            {source.topics && source.topics.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                  Topics:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {source.topics.map((topic) => (
                    <span 
                      key={topic}
                      className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>Source Usage Rules</h2>

      <table className="not-prose w-full text-sm my-6">
        <thead className="bg-slate-100 dark:bg-slate-700">
          <tr>
            <th className="text-left p-3 font-semibold">Content Type</th>
            <th className="text-left p-3 font-semibold">Required Tier</th>
            <th className="text-left p-3 font-semibold">Example</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          <tr>
            <td className="p-3">Clinical definition</td>
            <td className="p-3"><span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">Tier A only</span></td>
            <td className="p-3">"ADHD is a neurodevelopmental disorder" (NHS)</td>
          </tr>
          <tr>
            <td className="p-3">Diagnostic criteria</td>
            <td className="p-3"><span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">Tier A only</span></td>
            <td className="p-3">"DSM-5 criteria require..." (APA, peer-reviewed)</td>
          </tr>
          <tr>
            <td className="p-3">Treatment effectiveness</td>
            <td className="p-3"><span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">Tier A only</span></td>
            <td className="p-3">"CBT effective for anxiety" (Cochrane Review)</td>
          </tr>
          <tr>
            <td className="p-3">Support strategies</td>
            <td className="p-3"><span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">Tier A or B</span></td>
            <td className="p-3">"Visual schedules may help" (NAS, labeled Tier B)</td>
          </tr>
          <tr>
            <td className="p-3">Lived experience</td>
            <td className="p-3"><span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">Tier B</span></td>
            <td className="p-3">"Parents report that..." (Mind, clearly labeled)</td>
          </tr>
          <tr>
            <td className="p-3">UK-specific guidance</td>
            <td className="p-3"><span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">Tier A preferred</span></td>
            <td className="p-3">"SEND Code of Practice states..." (DfE)</td>
          </tr>
        </tbody>
      </table>

      <h2>Credibility Criteria</h2>
      <p>
        To be included in our source registry, organizations must meet these criteria:
      </p>

      <h3>Tier A Criteria</h3>
      <ul>
        <li>✓ Government health authority (NHS, CDC, WHO)</li>
        <li>✓ Evidence synthesis body (Cochrane, NICE)</li>
        <li>✓ Peer-reviewed research journal (indexed in PubMed)</li>
        <li>✓ Professional regulatory body (RCPsych, BPS, HCPC)</li>
        <li>✓ Systematic review or RCT methodology</li>
        <li>✓ No commercial conflicts of interest</li>
      </ul>

      <h3>Tier B Criteria</h3>
      <ul>
        <li>✓ Registered UK charity or equivalent</li>
        <li>✓ Evidence-based content (cites research)</li>
        <li>✓ Transparent governance and funding</li>
        <li>✓ Professional advisory board</li>
        <li>✓ Lived experience community input</li>
        <li>✓ Alignment with NICE/NHS guidance</li>
      </ul>

      <h2>What We Don't Use</h2>
      <p>
        We exclude sources that:
      </p>
      <ul>
        <li>❌ Promote unproven therapies or "cures"</li>
        <li>❌ Have undisclosed commercial interests</li>
        <li>❌ Contradict established evidence without peer review</li>
        <li>❌ Use stigmatizing or harmful language</li>
        <li>❌ Lack transparent governance</li>
        <li>❌ Make claims unsupported by research</li>
      </ul>

      <h2>Citation Format</h2>
      <p>
        All citations include:
      </p>
      <ul>
        <li><strong>Source name:</strong> NHS, NICE, Cochrane, etc.</li>
        <li><strong>URL:</strong> Direct link to the specific page or document</li>
        <li><strong>Tier label:</strong> (Tier A) or (Tier B) if not obvious</li>
        <li><strong>Access date:</strong> For dynamic web content</li>
      </ul>

      <h3>Example Citations</h3>
      <div className="not-prose bg-slate-100 dark:bg-slate-800 rounded p-4 my-4 font-mono text-xs space-y-2">
        <div>
          <strong>Tier A (Guideline):</strong><br />
          NICE (2018). Attention deficit hyperactivity disorder: diagnosis and management (NG87). 
          <span className="text-blue-600"> nhs.uk/nice-ng87</span>
        </div>
        <div>
          <strong>Tier A (Systematic Review):</strong><br />
          Cochrane Review (2019). Breathing exercises for anxiety in adults. 
          <span className="text-blue-600"> cochranelibrary.com/...</span>
        </div>
        <div>
          <strong>Tier B (Support Resource):</strong><br />
          National Autistic Society (2025). Sensory differences guide (Tier B). 
          <span className="text-blue-600"> autism.org.uk/sensory</span>
        </div>
      </div>

      <h2>Source Updates</h2>
      <p>
        We monitor sources for updates:
      </p>
      <ul>
        <li><strong>NICE guidelines:</strong> Checked monthly for updates</li>
        <li><strong>NHS content:</strong> Monitored for major changes</li>
        <li><strong>Cochrane reviews:</strong> Tracked via alerts</li>
        <li><strong>PubMed:</strong> Keyword alerts for new research</li>
        <li><strong>Tier B sources:</strong> Reviewed during content review cycle</li>
      </ul>

      <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 my-8">
        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
          Suggest a Source
        </h3>
        <p className="text-amber-800 dark:text-amber-200 text-sm mb-3">
          If you know of a reputable source that meets our criteria and isn't listed here, 
          please let us know. We review suggestions quarterly.
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          <strong>Last updated:</strong> 19 January 2026 | <strong>Next review:</strong> 19 April 2026
        </p>
      </div>
    </div>
  );
}
