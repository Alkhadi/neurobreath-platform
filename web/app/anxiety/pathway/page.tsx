import { Metadata } from 'next';
import { Wind, AlertCircle, BookOpen } from 'lucide-react';
import { TrustBadge } from '@/components/trust/trust-badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Anxiety Care Pathway | NeuroBreath',
  description: 'Evidence-based anxiety pathway aligned with NICE CG113 guidance. UK-specific support for children, teens, and adults with anxiety disorders.',
  keywords: ['Anxiety', 'NICE CG113', 'Anxiety pathway', 'UK anxiety support', 'GAD', 'Social anxiety', 'CBT'],
};

export default function AnxietyPathwayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100">Home</Link>
          {' '}/{' '}
          <Link href="/anxiety" className="hover:text-slate-900 dark:hover:text-slate-100">Anxiety</Link>
          {' '}/{' '}
          <span className="text-slate-900 dark:text-slate-100">Care Pathway</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Wind className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              Anxiety Care Pathway
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Evidence-based guidance for understanding and managing anxiety disorders across the lifespan
          </p>
        </div>

        {/* Trust Badge */}
        <div className="mb-8">
          <TrustBadge variant="block" showDetails />
        </div>

        {/* Main Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>What is Anxiety?</h2>
          <p>
            <strong>Anxiety</strong> is a natural human emotion that helps us respond to threats and challenges. However, when anxiety 
            becomes excessive, persistent, and interferes with daily life, it may indicate an <strong>anxiety disorder</strong>.
          </p>
          
          <p>
            Anxiety disorders are <strong>not</strong> a sign of weakness or personal failure. They are recognized medical conditions 
            involving changes in brain chemistry, thought patterns, and stress responses. With appropriate support, anxiety disorders 
            are highly treatable.
          </p>

          <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Evidence Base
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• NICE Guideline CG113 (2011, updated 2020): Generalised anxiety disorder and panic disorder in adults: management</li>
              <li>• NICE Guideline CG159 (2013): Social anxiety disorder: recognition, assessment and treatment</li>
              <li>• DSM-5 / ICD-11 diagnostic criteria</li>
              <li>• NHS: Anxiety disorders overview and support guidance</li>
              <li>• Cochrane Reviews: CBT and psychological interventions for anxiety</li>
            </ul>
          </div>

          <h3>Types of Anxiety Disorders</h3>
          <p>
            Anxiety disorders include several specific conditions:
          </p>

          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Generalised Anxiety Disorder (GAD)</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Excessive worry about multiple areas</li>
                <li>• Difficulty controlling worry</li>
                <li>• Restlessness, fatigue</li>
                <li>• Muscle tension</li>
                <li>• Sleep difficulties</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Social Anxiety Disorder</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Fear of social situations</li>
                <li>• Fear of judgment or embarrassment</li>
                <li>• Avoidance of social interactions</li>
                <li>• Physical symptoms in social settings</li>
                <li>• Significant impact on relationships/work</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Panic Disorder</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Recurrent panic attacks</li>
                <li>• Fear of having another attack</li>
                <li>• Avoidance of triggers</li>
                <li>• Physical symptoms (heart racing, shortness of breath)</li>
                <li>• Feeling of losing control</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Specific Phobias</h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Intense fear of specific objects/situations</li>
                <li>• Immediate anxiety response</li>
                <li>• Recognition fear is excessive</li>
                <li>• Avoidance behaviors</li>
                <li>• Significant distress or impairment</li>
              </ul>
            </div>
          </div>

          <h2>Common Difficulties by Age</h2>

          <h3>Children (5-11 years)</h3>
          <ul>
            <li><strong>Separation anxiety:</strong> Distress when away from parents, worry about harm to loved ones, reluctance to sleep alone</li>
            <li><strong>School:</strong> Worry about performance, fear of teachers, reluctance to participate, stomach aches before school</li>
            <li><strong>Social:</strong> Shyness, difficulty making friends, fear of judgment, clinging to parents in social settings</li>
            <li><strong>Physical:</strong> Headaches, stomach aches, difficulty sleeping, nightmares</li>
          </ul>

          <h3>Teens (12-17 years)</h3>
          <ul>
            <li><strong>Academic:</strong> Test anxiety, perfectionism, fear of failure, procrastination due to anxiety</li>
            <li><strong>Social:</strong> Fear of peer judgment, social media anxiety, body image concerns, difficulty with transitions</li>
            <li><strong>Independence:</strong> Anxiety about future, decision-making paralysis, avoidance of new experiences</li>
            <li><strong>Physical:</strong> Panic attacks, tension headaches, fatigue, changes in appetite</li>
          </ul>

          <h3>Adults (18+ years)</h3>
          <ul>
            <li><strong>Work:</strong> Performance anxiety, fear of public speaking, worry about job security, difficulty concentrating</li>
            <li><strong>Relationships:</strong> Fear of abandonment, excessive reassurance-seeking, conflict avoidance, intimacy anxiety</li>
            <li><strong>Daily life:</strong> Health anxiety, financial worries, difficulty making decisions, chronic worry</li>
            <li><strong>Physical:</strong> Chronic muscle tension, fatigue, sleep disturbances, panic attacks</li>
          </ul>

          <h2>What Helps (Evidence-Linked)</h2>

          <h3>1. Cognitive Behavioral Therapy (CBT) (Evidence Tier A)</h3>
          <ul>
            <li><strong>Thought challenging:</strong> Identifying and questioning anxious thoughts (NICE CG113 - first-line treatment)</li>
            <li><strong>Behavioral experiments:</strong> Testing predictions in safe ways</li>
            <li><strong>Worry time:</strong> Scheduling specific times for worry to reduce constant anxiety</li>
            <li><strong>Problem-solving:</strong> Breaking down overwhelming situations into manageable steps</li>
            <li><strong>Effectiveness:</strong> 60-80% response rate in controlled trials (Cochrane Review 2020)</li>
          </ul>

          <h3>2. Exposure Therapy (Evidence Tier A)</h3>
          <ul>
            <li><strong>Gradual exposure:</strong> Facing feared situations in a controlled, step-by-step way (NICE CG113)</li>
            <li><strong>Exposure hierarchy:</strong> Creating a ladder from least to most anxiety-provoking situations</li>
            <li><strong>Response prevention:</strong> Resisting urge to use safety behaviors or avoidance</li>
            <li><strong>Interoceptive exposure:</strong> Deliberately experiencing physical anxiety symptoms to reduce fear</li>
            <li><strong>Effectiveness:</strong> Gold standard for phobias and panic disorder</li>
          </ul>

          <h3>3. Breathing and Relaxation Techniques (Evidence Tier B)</h3>
          <ul>
            <li><strong>Diaphragmatic breathing:</strong> Slow, deep breathing to activate parasympathetic nervous system</li>
            <li><strong>Progressive muscle relaxation:</strong> Tensing and releasing muscle groups to reduce physical tension</li>
            <li><strong>4-7-8 breathing:</strong> Structured breathing pattern for acute anxiety</li>
            <li><strong>Grounding techniques:</strong> 5-4-3-2-1 sensory technique to manage panic</li>
          </ul>

          <h3>4. Lifestyle and Self-Management (Evidence Tier B)</h3>
          <ul>
            <li><strong>Regular exercise:</strong> 30 minutes moderate activity, 3-5 times per week reduces anxiety symptoms</li>
            <li><strong>Sleep hygiene:</strong> Consistent sleep schedule, limiting caffeine, dark quiet bedroom</li>
            <li><strong>Limit alcohol and caffeine:</strong> Both can increase anxiety and interfere with sleep</li>
            <li><strong>Social connection:</strong> Regular contact with supportive friends/family</li>
          </ul>

          <h3>5. Medication (when appropriate) (Evidence Tier A)</h3>
          <ul>
            <li><strong>SSRIs:</strong> First-line medication for most anxiety disorders (NICE CG113)</li>
            <li><strong>SNRIs:</strong> Alternative if SSRIs not effective or tolerated</li>
            <li><strong>Benzodiazepines:</strong> Short-term use only (2-4 weeks) due to dependence risk</li>
            <li><strong>Note:</strong> Medication typically combined with psychological therapy for best outcomes</li>
          </ul>

          <h2>Common Myths vs Facts</h2>

          <div className="not-prose bg-slate-100 dark:bg-slate-800 rounded-lg p-6 my-6">
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">❌ MYTH: "Anxiety is just stress—everyone has it"</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  ✅ FACT: While everyone experiences stress, anxiety disorders involve excessive, persistent anxiety that interferes 
                  with daily functioning. It's a recognized medical condition requiring proper support.
                </p>
              </div>
              
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">❌ MYTH: "Facing your fears will make anxiety worse"</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  ✅ FACT: Gradual, controlled exposure (exposure therapy) is one of the most effective treatments for anxiety disorders. 
                  Avoidance actually maintains and worsens anxiety over time.
                </p>
              </div>
              
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">❌ MYTH: "You should be able to control anxiety with willpower"</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  ✅ FACT: Anxiety disorders involve changes in brain chemistry and automatic thought patterns. They require 
                  evidence-based treatment, not just willpower.
                </p>
              </div>
            </div>
          </div>

          <h2>When to Seek Professional Help</h2>
          <ul>
            <li>Anxiety interferes with work, school, or relationships</li>
            <li>Physical symptoms (panic attacks, chronic tension) are present</li>
            <li>Avoidance behaviors are limiting your life</li>
            <li>Self-help strategies haven't helped after 6-8 weeks</li>
            <li>You're using alcohol or other substances to cope</li>
            <li>You're experiencing depression alongside anxiety</li>
          </ul>

          <h2>UK-Specific Support Pathways</h2>

          <h3>NHS Pathways</h3>
          <ul>
            <li><strong>GP:</strong> First point of contact for assessment and referral</li>
            <li><strong>IAPT (Improving Access to Psychological Therapies):</strong> Self-referral for CBT and other therapies</li>
            <li><strong>Mental health crisis teams:</strong> For urgent support (available 24/7 in most areas)</li>
            <li><strong>Children's mental health services (CAMHS):</strong> For under-18s</li>
          </ul>

          <h3>Crisis Support (UK)</h3>
          <ul>
            <li><strong>Samaritans:</strong> 116 123 (24/7, free to call)</li>
            <li><strong>Anxiety UK:</strong> 03444 775 774 (Mon-Fri 9:30am-5:30pm)</li>
            <li><strong>Mind Infoline:</strong> 0300 123 3393 (Mon-Fri 9am-6pm)</li>
            <li><strong>NHS 111:</strong> For urgent mental health support (press option 2)</li>
            <li><strong>999:</strong> In a life-threatening emergency</li>
          </ul>

          <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 my-6">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Educational Information Only
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              This pathway provides educational information based on NICE guidelines and evidence-based research. 
              It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult 
              a qualified healthcare provider for personal health concerns.
            </p>
          </div>

          <h2>Learn More</h2>
          <ul>
            <li><Link href="/anxiety" className="text-blue-600 hover:underline">Anxiety Hub</Link> - Interactive tools and resources</li>
            <li><Link href="/tools/anxiety-tools" className="text-blue-600 hover:underline">Anxiety Toolkit</Link> - Evidence-based exercises</li>
            <li><Link href="/breathing" className="text-blue-600 hover:underline">Breathing Exercises</Link> - Calming techniques</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
