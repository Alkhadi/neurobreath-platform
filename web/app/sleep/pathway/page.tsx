import { Metadata } from 'next';
import { Moon, AlertCircle, BookOpen } from 'lucide-react';
import { TrustBadge } from '@/components/trust/trust-badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sleep Care Pathway | NeuroBreath',
  description: 'Evidence-based sleep pathway for children, teens, and adults. CBT-I, sleep hygiene, and UK-specific support resources.',
  keywords: ['Sleep', 'Sleep pathway', 'Insomnia', 'CBT-I', 'Sleep hygiene', 'UK sleep support'],
};

export default function SleepPathwayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100">Home</Link>
          {' '}/{' '}
          <Link href="/sleep" className="hover:text-slate-900 dark:hover:text-slate-100">Sleep</Link>
          {' '}/{' '}
          <span className="text-slate-900 dark:text-slate-100">Care Pathway</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Moon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              Sleep Care Pathway
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Evidence-based guidance for healthy sleep and managing sleep difficulties across the lifespan
          </p>
        </div>

        {/* Trust Badge */}
        <div className="mb-8">
          <TrustBadge variant="block" showDetails />
        </div>

        {/* Main Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Understanding Sleep</h2>
          <p>
            <strong>Sleep</strong> is a vital biological process essential for physical health, mental wellbeing, learning, and memory. 
            During sleep, our bodies repair tissues, consolidate memories, and regulate hormones that affect mood, growth, and immune function.
          </p>
          
          <p>
            Sleep difficulties are <strong>not</strong> a sign of laziness or poor discipline. They often result from complex interactions 
            between biological rhythms, stress, lifestyle factors, and underlying conditions. With evidence-based strategies, most sleep 
            problems can be significantly improved.
          </p>

          <div className="not-prose bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 my-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Evidence Base
            </h3>
            <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
              <li>• NICE Guideline NG25 (2021): Children's attachment: recognition and management</li>
              <li>• NHS: Sleep and tiredness guidance</li>
              <li>• American Academy of Sleep Medicine: Clinical Practice Guidelines</li>
              <li>• Cochrane Reviews: CBT-I for insomnia</li>
              <li>• National Sleep Foundation: Sleep duration recommendations</li>
            </ul>
          </div>

          <h3>How Much Sleep Do We Need?</h3>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Children (5-11 years)</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• <strong>Recommended:</strong> 9-11 hours per night</li>
                <li>• Regular bedtime routine crucial</li>
                <li>• Naps less common after age 5</li>
                <li>• Screen-free hour before bed</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Teens (12-17 years)</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• <strong>Recommended:</strong> 8-10 hours per night</li>
                <li>• Circadian shift (later sleep/wake)</li>
                <li>• School start times often misaligned</li>
                <li>• High screen use impact</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Adults (18-64 years)</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• <strong>Recommended:</strong> 7-9 hours per night</li>
                <li>• Quality matters as much as quantity</li>
                <li>• Consistent schedule important</li>
                <li>• Individual variation normal</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Older Adults (65+)</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• <strong>Recommended:</strong> 7-8 hours per night</li>
                <li>• More fragmented sleep common</li>
                <li>• Earlier sleep/wake times typical</li>
                <li>• Napping may help but limit duration</li>
              </ul>
            </div>
          </div>

          <h2>Common Sleep Difficulties by Age</h2>

          <h3>Children (5-11 years)</h3>
          <ul>
            <li><strong>Bedtime resistance:</strong> Difficulty settling, repeated requests for "one more" story/drink</li>
            <li><strong>Nighttime fears:</strong> Fear of dark, monsters, separation anxiety</li>
            <li><strong>Night wakings:</strong> Difficulty returning to sleep independently</li>
            <li><strong>Early morning waking:</strong> Waking before 6am consistently</li>
          </ul>

          <h3>Teens (12-17 years)</h3>
          <ul>
            <li><strong>Delayed sleep phase:</strong> Difficulty falling asleep before midnight, hard to wake for school</li>
            <li><strong>Insufficient sleep:</strong> School + activities + social media = chronic sleep debt</li>
            <li><strong>Irregular schedule:</strong> Weekday vs weekend sleep times differ by 2+ hours</li>
            <li><strong>Screen interference:</strong> Late-night phone/gaming delays sleep onset</li>
          </ul>

          <h3>Adults (18+ years)</h3>
          <ul>
            <li><strong>Insomnia:</strong> Difficulty falling or staying asleep, early waking (affecting 30% of adults)</li>
            <li><strong>Work stress:</strong> Racing thoughts, worry preventing sleep</li>
            <li><strong>Shift work:</strong> Irregular schedules disrupting circadian rhythm</li>
            <li><strong>Sleep maintenance:</strong> Waking frequently during night, difficulty returning to sleep</li>
          </ul>

          <h2>What Helps (Evidence-Linked)</h2>

          <h3>1. Cognitive Behavioral Therapy for Insomnia (CBT-I) (Evidence Tier A)</h3>
          <ul>
            <li><strong>Sleep restriction:</strong> Limiting time in bed to actual sleep time, then gradually increasing</li>
            <li><strong>Stimulus control:</strong> Using bed only for sleep, leaving if awake &gt;20 minutes</li>
            <li><strong>Cognitive restructuring:</strong> Challenging unhelpful beliefs about sleep</li>
            <li><strong>Sleep hygiene education:</strong> Optimizing sleep environment and behaviors</li>
            <li><strong>Effectiveness:</strong> 70-80% improvement rate, effects maintained long-term (AASM guideline)</li>
          </ul>

          <h3>2. Sleep Hygiene (Evidence Tier B)</h3>
          <ul>
            <li><strong>Consistent schedule:</strong> Same bedtime/wake time daily (even weekends) within 30 minutes</li>
            <li><strong>Sleep environment:</strong> Cool (16-18°C), dark, quiet bedroom</li>
            <li><strong>Light exposure:</strong> Bright light in morning, dim lights 2 hours before bed</li>
            <li><strong>Physical activity:</strong> Regular exercise, but not within 3 hours of bedtime</li>
            <li><strong>Avoid stimulants:</strong> No caffeine after 2pm, limit alcohol (disrupts sleep quality)</li>
          </ul>

          <h3>3. Relaxation Techniques (Evidence Tier B)</h3>
          <ul>
            <li><strong>Progressive muscle relaxation:</strong> Tensing and releasing muscle groups to reduce physical tension</li>
            <li><strong>Breathing exercises:</strong> 4-7-8 breathing or diaphragmatic breathing to activate relaxation response</li>
            <li><strong>Guided imagery:</strong> Visualizing calming scenes to quiet racing thoughts</li>
            <li><strong>Mindfulness meditation:</strong> Observing thoughts without judgment, reducing sleep anxiety</li>
          </ul>

          <h3>4. Screen and Blue Light Management (Evidence Tier B)</h3>
          <ul>
            <li><strong>1-hour screen-free buffer:</strong> No phones, tablets, computers before bed</li>
            <li><strong>Blue light filters:</strong> Enable night mode on devices (though total avoidance better)</li>
            <li><strong>Bedroom phone ban:</strong> Charge phones outside bedroom to prevent checking</li>
            <li><strong>Alternative wind-down:</strong> Reading physical books, gentle stretching, listening to calm music</li>
          </ul>

          <h3>5. Age-Specific Strategies</h3>
          
          <h4>For Children (5-11)</h4>
          <ul>
            <li><strong>Bedtime routine:</strong> Consistent 30-45 minute routine (bath, story, lights out)</li>
            <li><strong>Security objects:</strong> Favorite stuffed animal or blanket for comfort</li>
            <li><strong>Gradual independence:</strong> Slowly reducing parental presence at bedtime</li>
            <li><strong>Reward charts:</strong> Positive reinforcement for successful sleep nights</li>
          </ul>

          <h4>For Teens (12-17)</h4>
          <ul>
            <li><strong>Consistent wake time:</strong> Even on weekends (max 1 hour difference)</li>
            <li><strong>Nap rules:</strong> If needed, limit to 20-30 minutes before 3pm</li>
            <li><strong>Weekend catch-up caution:</strong> Sleeping 12+ hours Saturday disrupts rhythm for week</li>
            <li><strong>School advocacy:</strong> Later school start times improve teen sleep (evidence-based)</li>
          </ul>

          <h3>6. When Medication May Be Considered (Evidence Tier A)</h3>
          <ul>
            <li><strong>Short-term use only:</strong> Typically 2-4 weeks maximum</li>
            <li><strong>Melatonin:</strong> May help with circadian rhythm disorders, delayed sleep phase (especially in neurodivergent individuals)</li>
            <li><strong>Prescription medications:</strong> Only when CBT-I and other strategies insufficient</li>
            <li><strong>Note:</strong> Always discuss with GP; medication alone less effective than CBT-I long-term</li>
          </ul>

          <h2>Common Myths vs Facts</h2>

          <div className="not-prose bg-slate-100 dark:bg-slate-800 rounded-lg p-6 my-6">
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">❌ MYTH: "You can catch up on sleep debt by sleeping in on weekends"</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  ✅ FACT: While weekend catch-up sleep provides some recovery, it disrupts your circadian rhythm and makes it harder 
                  to sleep Sunday night. Consistent sleep schedule is more effective.
                </p>
              </div>
              
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">❌ MYTH: "Alcohol helps you sleep better"</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  ✅ FACT: While alcohol may help you fall asleep faster, it significantly disrupts sleep quality, causing frequent 
                  wakings and reducing REM sleep. You wake feeling unrefreshed.
                </p>
              </div>
              
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">❌ MYTH: "Staying in bed longer will help you sleep more"</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  ✅ FACT: Staying in bed while awake weakens the bed-sleep association. CBT-I actually restricts time in bed initially 
                  to strengthen sleep drive and improve sleep efficiency.
                </p>
              </div>

              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">❌ MYTH: "Everyone needs 8 hours of sleep"</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  ✅ FACT: Sleep needs vary individually. Some people function well on 7 hours, others need 9. Quality and consistency 
                  matter more than hitting an exact number. How you feel during the day is the best indicator.
                </p>
              </div>
            </div>
          </div>

          <h2>When to Seek Professional Help</h2>
          <ul>
            <li>Sleep problems persist for more than 3 months despite self-help strategies</li>
            <li>Daytime functioning significantly impaired (safety concerns, work/school impact)</li>
            <li>Suspected sleep disorder (sleep apnea, restless legs, narcolepsy)</li>
            <li>Sleep problems linked to mental health condition (depression, anxiety, PTSD)</li>
            <li>Child's sleep difficulties affecting family functioning</li>
          </ul>

          <h2>UK-Specific Support Pathways</h2>

          <h3>NHS Pathways</h3>
          <ul>
            <li><strong>GP:</strong> First point of contact for assessment and referral</li>
            <li><strong>CBT-I programs:</strong> Many IAPT services offer CBT-I (self-referral available)</li>
            <li><strong>Sleep clinics:</strong> For suspected sleep disorders (GP referral required)</li>
            <li><strong>Children's sleep services:</strong> Specialized support via CAMHS or community pediatrics</li>
          </ul>

          <h3>Online Resources (NHS-approved)</h3>
          <ul>
            <li><strong>Sleepio:</strong> Digital CBT-I program (available free via some NHS areas)</li>
            <li><strong>NHS Every Mind Matters:</strong> Sleep self-help resources</li>
            <li><strong>The Sleep Charity:</strong> UK-based charity with evidence-based guidance</li>
          </ul>

          <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 my-6">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Educational Information Only
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              This pathway provides educational information based on evidence-based sleep research and clinical guidelines. 
              It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult 
              a qualified healthcare provider for personal health concerns, especially for suspected sleep disorders.
            </p>
          </div>

          <h2>Learn More</h2>
          <ul>
            <li><Link href="/sleep" className="text-indigo-600 hover:underline">Sleep Hub</Link> - Sleep tracker and tools</li>
            <li><Link href="/breathing" className="text-indigo-600 hover:underline">Breathing Exercises</Link> - Relaxation techniques for better sleep</li>
            <li><Link href="/stress" className="text-indigo-600 hover:underline">Stress Management</Link> - Reduce stress impacting sleep</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
