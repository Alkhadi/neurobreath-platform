import { Metadata } from 'next';
import { Brain, AlertCircle, BookOpen, Users } from 'lucide-react';
import { TrustBadge } from '@/components/trust/trust-badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ADHD Care Pathway | NeuroBreath',
  description: 'Evidence-based ADHD pathway aligned with NICE NG87 guidance. UK-specific support for children, teens, and adults with ADHD.',
  keywords: ['ADHD', 'NICE NG87', 'ADHD pathway', 'UK ADHD support', 'SEND', 'EHC Plan'],
};

export default function ADHDPathwayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100">Home</Link>
          {' '}/{' '}
          <Link href="/adhd" className="hover:text-slate-900 dark:hover:text-slate-100">ADHD</Link>
          {' '}/{' '}
          <span className="text-slate-900 dark:text-slate-100">Care Pathway</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              ADHD Care Pathway
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Evidence-based guidance for understanding and supporting ADHD across the lifespan
          </p>
        </div>

        {/* Trust Badge */}
        <div className="mb-8">
          <TrustBadge variant="block" showDetails />
        </div>

        {/* Main Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>What is ADHD?</h2>
          <p>
            <strong>Attention Deficit Hyperactivity Disorder (ADHD)</strong> is a neurodevelopmental condition that affects 
            how the brain develops and processes information, particularly in areas related to attention, impulse control, 
            and activity levels.
          </p>
          
          <p>
            ADHD is <strong>not</strong> caused by poor parenting, laziness, or lack of willpower. It is a recognized medical 
            condition with biological origins, involving differences in brain structure and neurotransmitter function.
          </p>

          <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Evidence Base
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• NICE Guideline NG87 (2018): Attention deficit hyperactivity disorder: diagnosis and management</li>
              <li>• DSM-5 / ICD-11 diagnostic criteria</li>
              <li>• Cochrane Reviews: ADHD interventions and treatments</li>
              <li>• NHS: ADHD overview and support guidance</li>
            </ul>
          </div>

          <h3>Core Features</h3>
          <p>
            ADHD presents with three main symptom groups:
          </p>

          <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Inattention</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Difficulty sustaining attention</li>
                <li>• Easily distracted</li>
                <li>• Forgetfulness</li>
                <li>• Losing things</li>
                <li>• Difficulty organizing</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Hyperactivity</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Fidgeting or squirming</li>
                <li>• Difficulty staying seated</li>
                <li>• Running/climbing (children)</li>
                <li>• Restlessness (adults)</li>
                <li>• Talks excessively</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Impulsivity</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Interrupting others</li>
                <li>• Difficulty waiting turn</li>
                <li>• Blurting out answers</li>
                <li>• Acting without thinking</li>
                <li>• Risk-taking behaviors</li>
              </ul>
            </div>
          </div>

          <h2>Common Difficulties by Age</h2>

          <h3>Children (5-11 years)</h3>
          <ul>
            <li><strong>School:</strong> Difficulty following instructions, completing work, staying in seat, organizing materials</li>
            <li><strong>Home:</strong> Forgetting chores, losing things, interrupting conversations, difficulty with bedtime routines</li>
            <li><strong>Social:</strong> Struggling to wait turn in games, interrupting friends, impulsive reactions</li>
            <li><strong>Emotional:</strong> Low frustration tolerance, emotional outbursts, sensitivity to rejection</li>
          </ul>

          <h3>Teens (12-17 years)</h3>
          <ul>
            <li><strong>Academic:</strong> Difficulty managing homework, missing deadlines, disorganization, exam stress</li>
            <li><strong>Independence:</strong> Forgetting commitments, poor time management, difficulty planning ahead</li>
            <li><strong>Social:</strong> Interrupting in conversations, impulsive social decisions, rejection sensitivity</li>
            <li><strong>Risk:</strong> Higher rates of risky behaviors (substance use, driving, online activity)</li>
          </ul>

          <h3>Adults (18+ years)</h3>
          <ul>
            <li><strong>Work:</strong> Difficulty prioritizing tasks, missing deadlines, disorganization, boredom with routine tasks</li>
            <li><strong>Relationships:</strong> Forgetting important dates, interrupting partner, impulsive decisions, emotional dysregulation</li>
            <li><strong>Daily life:</strong> Chronic lateness, financial disorganization, difficulty maintaining routines</li>
            <li><strong>Mental health:</strong> Higher rates of anxiety, depression, low self-esteem</li>
          </ul>

          <h2>What Helps (Evidence-Linked)</h2>

          <h3>1. Environmental Supports (Evidence Tier A)</h3>
          <ul>
            <li><strong>Structured routines:</strong> Visual schedules, consistent daily structure (NICE NG87)</li>
            <li><strong>Reduced distractions:</strong> Quiet workspace, minimal clutter, noise-cancelling headphones</li>
            <li><strong>Clear expectations:</strong> Written instructions, broken into steps, with visual reminders</li>
            <li><strong>Frequent breaks:</strong> Movement breaks every 20-30 minutes for children, hourly for adults</li>
          </ul>

          <h3>2. Behavioral Strategies (Evidence Tier A)</h3>
          <ul>
            <li><strong>Positive reinforcement:</strong> Specific praise, reward systems, immediate feedback (Cochrane Review 2020)</li>
            <li><strong>Parent training programs:</strong> Structured programs like "New Forest Parenting Programme" (NICE NG87)</li>
            <li><strong>Teacher strategies:</strong> Preferential seating, movement breaks, visual timers, chunked tasks</li>
            <li><strong>Executive function coaching:</strong> Planning, organization, time management skills</li>
          </ul>

          <h3>3. Psychological Interventions (Evidence Tier A)</h3>
          <ul>
            <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Effective for anxiety, low mood, organization skills (NICE NG87)</li>
            <li><strong>Mindfulness:</strong> Some evidence for reducing inattention and impulsivity</li>
            <li><strong>Social skills training:</strong> For children/teens with peer relationship difficulties</li>
          </ul>

          <h3>4. Medication (Evidence Tier A)</h3>
          <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-4">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Important:</strong> Medication decisions must be made with your GP or psychiatrist. 
              NICE NG87 recommends medication for moderate-to-severe ADHD when environmental modifications 
              and behavioral strategies are insufficient.
            </p>
          </div>
          <ul>
            <li><strong>Stimulants:</strong> Methylphenidate (Ritalin, Concerta) - first-line for children and adults (NICE NG87)</li>
            <li><strong>Non-stimulants:</strong> Atomoxetine, Lisdexamfetamine - alternatives if stimulants unsuitable</li>
            <li><strong>Monitoring:</strong> Regular review of effectiveness and side effects required</li>
          </ul>

          <h3>5. Physical Activity & Diet (Evidence Tier B)</h3>
          <ul>
            <li><strong>Regular exercise:</strong> 30-60 minutes daily reduces hyperactivity and improves focus</li>
            <li><strong>Sleep hygiene:</strong> Consistent bedtime, reduced screen time, sleep-friendly environment</li>
            <li><strong>Balanced diet:</strong> Regular meals, limit sugar spikes, adequate hydration</li>
          </ul>

          <h2>What to Avoid / Myths</h2>

          <div className="not-prose bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 my-6">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Common Myths About ADHD
            </h3>
            <ul className="text-sm text-red-800 dark:text-red-200 space-y-2">
              <li>
                <strong>Myth:</strong> "ADHD isn't real, it's just bad parenting"<br />
                <strong>Fact:</strong> ADHD is a neurodevelopmental condition with biological origins, recognized by WHO, NHS, and all major medical organizations.
              </li>
              <li>
                <strong>Myth:</strong> "Everyone has a bit of ADHD"<br />
                <strong>Fact:</strong> ADHD symptoms are persistent, pervasive (occur in multiple settings), and significantly impair functioning. Occasional forgetfulness or distraction is not ADHD.
              </li>
              <li>
                <strong>Myth:</strong> "Children outgrow ADHD"<br />
                <strong>Fact:</strong> 60-70% of children with ADHD continue to have symptoms into adulthood. Symptoms may change but rarely disappear completely.
              </li>
              <li>
                <strong>Myth:</strong> "Sugar causes ADHD" or "Food additives cause ADHD"<br />
                <strong>Fact:</strong> No robust evidence links diet to ADHD causation. Some children may have sensitivities, but diet does not cause ADHD.
              </li>
              <li>
                <strong>Myth:</strong> "Medication is dangerous and will change my child's personality"<br />
                <strong>Fact:</strong> NICE NG87-approved medications are safe when properly monitored. They do not change personality; they help the brain regulate attention and impulse control more effectively.
              </li>
            </ul>
          </div>

          <h2>When to Seek Help</h2>

          <h3>GP Referral Criteria</h3>
          <p>
            Consider speaking to your GP if:
          </p>
          <ul>
            <li>Symptoms are persistent (present for 6+ months)</li>
            <li>Symptoms occur in multiple settings (home, school, work)</li>
            <li>Symptoms significantly impact daily functioning</li>
            <li>Symptoms started before age 12 (for diagnosis, though late diagnosis is common)</li>
            <li>Environmental strategies and behavioral supports have been tried but are insufficient</li>
          </ul>

          <h3>NHS Urgent Help</h3>
          <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-4">
            <p className="text-sm text-amber-900 dark:text-amber-100 space-y-2">
              <strong>Urgent (Non-Emergency):</strong><br />
              Call <strong>NHS 111</strong> if you or someone you care for is in crisis but not in immediate danger.<br /><br />
              
              <strong>Emergency:</strong><br />
              Call <strong>999</strong> or go to A&E if there is immediate danger of serious harm or suicide risk.
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
                Most children with ADHD access support at this level:
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Individual Education Plan (IEP) or Support Plan</li>
                <li>• Reasonable adjustments (e.g., movement breaks, extra time)</li>
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
                <li>• Can specify school placement</li>
              </ul>
            </div>
          </div>

          <h3>Workplace Adjustments (Equality Act 2010)</h3>
          <p>
            Employers must make <strong>reasonable adjustments</strong> for employees with ADHD:
          </p>
          <ul>
            <li><strong>Flexible working:</strong> Flex hours, remote work, breaks as needed</li>
            <li><strong>Work environment:</strong> Quiet workspace, noise-cancelling headphones, minimal distractions</li>
            <li><strong>Task management:</strong> Written instructions, clear deadlines, regular check-ins</li>
            <li><strong>Support:</strong> Access to Work scheme (government funding for workplace adaptations)</li>
          </ul>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
            <strong>Access to Work:</strong> UK government scheme providing funding for workplace adjustments. 
            Apply via gov.uk - covers assistive technology, travel costs, support workers.
          </p>

          <h2>Further Resources</h2>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <a 
              href="https://www.nice.org.uk/guidance/ng87"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">NICE Guideline NG87</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Official UK clinical guidance</p>
            </a>

            <a 
              href="https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">NHS ADHD Overview</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Patient-friendly NHS information</p>
            </a>

            <a 
              href="https://adhdfoundation.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">ADHD Foundation</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">UK charity (Tier B)</p>
            </a>

            <Link 
              href="/trust/evidence-policy"
              className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Our Evidence Standards</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">How we select and cite sources</p>
            </Link>
          </div>

          <div className="not-prose bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-6 my-8">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Disclaimer
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              This pathway is for <strong>educational purposes only</strong> and does not constitute medical advice, 
              diagnosis, or treatment. Always consult your GP or qualified healthcare professional for personalized guidance. 
              If you suspect you or your child may have ADHD, speak to your GP about referral to appropriate services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
