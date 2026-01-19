import { Metadata } from 'next';
import { Heart, AlertCircle, BookOpen, Users } from 'lucide-react';
import { TrustBadge } from '@/components/trust/trust-badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Autism Care Pathway | NeuroBreath',
  description: 'Evidence-based autism pathway aligned with NICE CG170 guidance. UK-specific support for autistic children, teens, and adults.',
  keywords: ['Autism', 'NICE CG170', 'Autism pathway', 'UK autism support', 'SEND', 'EHC Plan', 'Autistic'],
};

export default function AutismPathwayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100">Home</Link>
          {' '}/{' '}
          <Link href="/autism" className="hover:text-slate-900 dark:hover:text-slate-100">Autism</Link>
          {' '}/{' '}
          <span className="text-slate-900 dark:text-slate-100">Care Pathway</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="h-10 w-10 text-teal-600 dark:text-teal-400" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              Autism Care Pathway
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Evidence-based guidance for understanding and supporting autistic people across the lifespan
          </p>
        </div>

        {/* Trust Badge */}
        <div className="mb-8">
          <TrustBadge route="/autism" variant="block" showDetails />
        </div>

        {/* Main Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>What is Autism?</h2>
          <p>
            <strong>Autism</strong> (or <strong>Autism Spectrum Disorder, ASD</strong>) is a lifelong neurodevelopmental condition 
            that affects how a person communicates, interacts with others, and experiences the world around them.
          </p>
          
          <p>
            Autism is <strong>not</strong> a disease, illness, or result of poor parenting. It is a natural variation in how 
            the brain develops and processes information. The autistic community increasingly prefers identity-first language 
            ("autistic person") over person-first language ("person with autism"), recognizing autism as an integral part of identity.
          </p>

          <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Evidence Base
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• NICE Guideline CG170 (2021): Autism spectrum disorder in adults: diagnosis and management</li>
              <li>• NICE Guideline CG128 (2011, updated 2021): Autism spectrum disorder in under 19s: recognition, referral and diagnosis</li>
              <li>• DSM-5 / ICD-11 diagnostic criteria</li>
              <li>• NHS: Autism overview and support guidance</li>
              <li>• National Autistic Society (NAS): Evidence-informed support strategies</li>
            </ul>
          </div>

          <h3>Core Features</h3>
          <p>
            Autism is characterized by differences in two main areas:
          </p>

          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Social Communication</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Difficulty reading social cues</li>
                <li>• Literal interpretation of language</li>
                <li>• Challenges with reciprocal conversation</li>
                <li>• Difficulty understanding others' perspectives</li>
                <li>• Atypical use of eye contact, gestures, facial expressions</li>
                <li>• Preference for direct, explicit communication</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Restricted, Repetitive Patterns</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Deep, focused interests (special interests)</li>
                <li>• Preference for routines and sameness</li>
                <li>• Repetitive behaviors (stimming)</li>
                <li>• Sensory sensitivities (hyper- or hypo-sensitivity)</li>
                <li>• Difficulty with change or transitions</li>
                <li>• Strong need for predictability</li>
              </ul>
            </div>
          </div>

          <h3>Sensory Differences</h3>
          <p>
            Many autistic people experience sensory input differently:
          </p>
          <ul>
            <li><strong>Hypersensitivity:</strong> Overwhelmed by sounds, lights, textures, smells (e.g., fluorescent lights, clothing tags, loud environments)</li>
            <li><strong>Hyposensitivity:</strong> Under-responsive to sensory input, seeking intense sensory experiences (e.g., rocking, spinning, pressure)</li>
            <li><strong>Sensory seeking:</strong> Actively seeking certain sensory experiences for regulation</li>
            <li><strong>Sensory avoidance:</strong> Avoiding uncomfortable sensory experiences</li>
          </ul>

          <h2>Common Experiences by Age</h2>

          <h3>Children (0-11 years)</h3>
          <ul>
            <li><strong>Communication:</strong> Delayed speech or atypical language development, echolalia (repeating words), difficulty with conversations</li>
            <li><strong>Social:</strong> Preference for solo play, difficulty making friends, not responding to name, limited eye contact</li>
            <li><strong>Behavior:</strong> Strong routines, distress with change, repetitive movements (e.g., hand-flapping), intense interests</li>
            <li><strong>Sensory:</strong> Distress with loud noises, dislike of certain textures (food, clothing), seeking sensory input</li>
          </ul>

          <h3>Teens (12-17 years)</h3>
          <ul>
            <li><strong>Social:</strong> Difficulty navigating peer relationships, understanding social hierarchies, managing conflict</li>
            <li><strong>School:</strong> Challenges with unstructured time (lunch, breaks), sensory overwhelm in busy environments</li>
            <li><strong>Identity:</strong> Increased awareness of differences, masking (hiding autistic traits), mental health challenges</li>
            <li><strong>Independence:</strong> Executive function challenges (planning, organization), anxiety about transitions</li>
          </ul>

          <h3>Adults (18+ years)</h3>
          <ul>
            <li><strong>Work:</strong> Difficulty with open-plan offices, sensory overwhelm, interpreting workplace social dynamics</li>
            <li><strong>Relationships:</strong> Challenges understanding unspoken social rules, explicit communication needs, sensory needs in relationships</li>
            <li><strong>Daily life:</strong> Executive function challenges, burnout from masking, sensory overwhelm in public spaces</li>
            <li><strong>Mental health:</strong> Higher rates of anxiety, depression, PTSD; many undiagnosed until adulthood</li>
          </ul>

          <h2>What Helps (Evidence-Linked)</h2>

          <h3>1. Environmental Supports (Evidence Tier A)</h3>
          <ul>
            <li><strong>Predictable routines:</strong> Visual schedules, advance warning of changes, consistent daily structure (NICE CG170)</li>
            <li><strong>Sensory accommodations:</strong> Quiet spaces, reduced fluorescent lighting, noise-cancelling headphones, weighted blankets</li>
            <li><strong>Clear communication:</strong> Direct, literal language; written instructions; visual supports</li>
            <li><strong>Reduced sensory load:</strong> Minimize background noise, avoid strong smells, allow sensory breaks</li>
          </ul>

          <h3>2. Communication Strategies (Evidence Tier A)</h3>
          <ul>
            <li><strong>Visual supports:</strong> Social stories, visual schedules, PECS (Picture Exchange Communication System) for non-speaking children (NAS guidance)</li>
            <li><strong>AAC (Augmentative and Alternative Communication):</strong> For non-speaking or minimally speaking individuals</li>
            <li><strong>Explicit teaching:</strong> Directly teach social rules, rather than assuming understanding</li>
            <li><strong>Allow processing time:</strong> Pause after speaking, allow time to respond</li>
          </ul>

          <h3>3. Social Support (Evidence Tier B)</h3>
          <ul>
            <li><strong>Social skills groups:</strong> Autism-specific groups where autistic peers learn together (mixed evidence; some find non-autistic social skills training distressing)</li>
            <li><strong>Peer support:</strong> Connection with other autistic people (highly valued by autistic community)</li>
            <li><strong>Acceptance-focused approaches:</strong> Celebrating differences rather than forcing conformity</li>
          </ul>

          <h3>4. Therapeutic Interventions (Evidence Tier A)</h3>
          <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-4">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Important:</strong> The autistic community has raised concerns about some traditional autism interventions, 
              particularly ABA (Applied Behavior Analysis), which has been criticized for focusing on compliance and masking rather 
              than acceptance and support. Many autistic adults report trauma from intensive ABA programs. NICE CG170 does NOT 
              recommend ABA. We prioritize acceptance-based, autistic-led approaches.
            </p>
          </div>
          <ul>
            <li><strong>Occupational Therapy (OT):</strong> Sensory integration, daily living skills, motor skills (NICE CG170)</li>
            <li><strong>Speech and Language Therapy (SLT):</strong> Communication support, AAC, social communication (NICE CG128)</li>
            <li><strong>CBT (adapted for autism):</strong> For anxiety, depression; requires autism-aware therapist (NICE CG170)</li>
            <li><strong>Parent/Carer training:</strong> Understanding autism, communication strategies, managing behavior (NICE CG128)</li>
          </ul>

          <h3>5. Self-Regulation & Wellbeing (Evidence Tier B)</h3>
          <ul>
            <li><strong>Stimming:</strong> Allowing repetitive movements (hand-flapping, rocking) as self-regulation (NAS guidance)</li>
            <li><strong>Special interests:</strong> Supporting and celebrating deep interests as source of joy and expertise</li>
            <li><strong>Sensory tools:</strong> Fidget toys, weighted items, sensory breaks</li>
            <li><strong>Rest and recovery:</strong> Recognizing and preventing autistic burnout (exhaustion from masking and sensory overload)</li>
          </ul>

          <h2>What to Avoid / Myths</h2>

          <div className="not-prose bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 my-6">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Common Myths About Autism
            </h3>
            <ul className="text-sm text-red-800 dark:text-red-200 space-y-2">
              <li>
                <strong>Myth:</strong> "Vaccines cause autism"<br />
                <strong>Fact:</strong> This has been thoroughly debunked. Hundreds of studies show no link between vaccines and autism. The original study was fraudulent and retracted.
              </li>
              <li>
                <strong>Myth:</strong> "Autistic people lack empathy"<br />
                <strong>Fact:</strong> Autistic people experience empathy deeply. They may express or recognize emotions differently, but lack of empathy is a harmful stereotype.
              </li>
              <li>
                <strong>Myth:</strong> "Autism can be cured"<br />
                <strong>Fact:</strong> Autism is a lifelong neurodevelopmental condition, not a disease. There is no "cure," and many autistic people do not want one. The goal is support, acceptance, and quality of life.
              </li>
              <li>
                <strong>Myth:</strong> "Everyone is a little bit autistic"<br />
                <strong>Fact:</strong> Autism is a specific neurological difference with persistent, pervasive traits that significantly impact daily life. Occasional social awkwardness is not autism.
              </li>
              <li>
                <strong>Myth:</strong> "Autistic people don't want friends or relationships"<br />
                <strong>Fact:</strong> Many autistic people desire connection, though they may form relationships differently. Some prefer smaller social circles or autistic peers.
              </li>
              <li>
                <strong>Myth:</strong> "Low-functioning vs. high-functioning are helpful labels"<br />
                <strong>Fact:</strong> These labels are considered harmful by the autistic community. Support needs fluctuate and don't reflect a person's full capabilities or potential.
              </li>
            </ul>
          </div>

          <h2>When to Seek Help</h2>

          <h3>GP Referral Criteria</h3>
          <p>
            Consider speaking to your GP if you notice:
          </p>
          <ul>
            <li>Persistent difficulties with social communication and interaction</li>
            <li>Restricted interests or repetitive behaviors</li>
            <li>Sensory sensitivities impacting daily life</li>
            <li>Difficulties present from early childhood (though late diagnosis is increasingly common)</li>
            <li>Significant impact on functioning at home, school, or work</li>
          </ul>

          <p>
            <strong>NHS Autism Assessment:</strong> Your GP can refer you or your child to a specialist autism assessment team. 
            Waiting times vary by area (often 1-3 years). Private assessment is available but costly (£1000-£3000).
          </p>

          <h3>NHS Urgent Help</h3>
          <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-4">
            <p className="text-sm text-amber-900 dark:text-amber-100 space-y-2">
              <strong>Urgent (Non-Emergency):</strong><br />
              Call <strong>NHS 111</strong> if you or someone you care for is in crisis but not in immediate danger.<br /><br />
              
              <strong>Emergency:</strong><br />
              Call <strong>999</strong> or go to A&E if there is immediate danger of serious harm or suicide risk. 
              Inform responders that the person is autistic (may affect communication needs).
            </p>
          </div>

          <h2>School & Workplace Supports (UK)</h2>

          <h3>School Support (SEND Code of Practice)</h3>
          <div className="not-prose space-y-4 my-6">
            <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                SEN Support (Tier 1)
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                Most autistic children access support at this level:
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Individual Education Plan (IEP) or Support Plan</li>
                <li>• Reasonable adjustments (e.g., sensory breaks, quiet space, visual timetable)</li>
                <li>• Regular parent-teacher communication</li>
                <li>• Review termly</li>
              </ul>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                EHC Plan (Tier 2)
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                For children with complex needs requiring statutory support:
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Request EHC Needs Assessment via school or Local Authority</li>
                <li>• Legally binding support plan</li>
                <li>• Annual review process</li>
                <li>• Can specify school placement (including specialist autism schools)</li>
              </ul>
            </div>
          </div>

          <h3>Workplace Adjustments (Equality Act 2010)</h3>
          <p>
            Employers must make <strong>reasonable adjustments</strong> for autistic employees:
          </p>
          <ul>
            <li><strong>Communication:</strong> Written instructions, clear expectations, direct feedback (no hints or sarcasm)</li>
            <li><strong>Sensory environment:</strong> Quiet workspace, reduced lighting, noise-cancelling headphones, ability to work from home</li>
            <li><strong>Structure:</strong> Clear routines, advance notice of changes, written agendas for meetings</li>
            <li><strong>Social demands:</strong> Reduced small talk expectations, opt-out from social events, clear work vs. social boundaries</li>
            <li><strong>Support:</strong> Access to Work scheme (government funding for workplace adaptations)</li>
          </ul>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
            <strong>Access to Work:</strong> UK government scheme providing funding for workplace adjustments. 
            Apply via gov.uk - covers assistive technology, travel costs, support workers, autism awareness training for colleagues.
          </p>

          <h2>Further Resources</h2>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <a 
              href="https://www.nice.org.uk/guidance/cg170"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">NICE Guideline CG170</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Official UK clinical guidance (adults)</p>
            </a>

            <a 
              href="https://www.nice.org.uk/guidance/cg128"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">NICE Guideline CG128</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Official UK clinical guidance (under 19s)</p>
            </a>

            <a 
              href="https://www.nhs.uk/conditions/autism/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">NHS Autism Overview</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Patient-friendly NHS information</p>
            </a>

            <a 
              href="https://www.autism.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">National Autistic Society</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">UK autism charity (Tier B)</p>
            </a>

            <Link 
              href="/trust/evidence-policy"
              className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Our Evidence Standards</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">How we select and cite sources</p>
            </Link>

            <a 
              href="https://autisticadvocacy.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Autistic Self Advocacy Network (ASAN)</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Autistic-led advocacy (US-based, globally relevant)</p>
            </a>
          </div>

          <div className="not-prose bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-6 my-8">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Disclaimer
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              This pathway is for <strong>educational purposes only</strong> and does not constitute medical advice, 
              diagnosis, or treatment. Always consult your GP or qualified healthcare professional for personalized guidance. 
              If you suspect you or your child may be autistic, speak to your GP about referral to appropriate diagnostic services. 
              This content has been informed by both clinical guidelines (NICE CG170, CG128) and autistic community perspectives, 
              prioritizing acceptance, support, and quality of life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
