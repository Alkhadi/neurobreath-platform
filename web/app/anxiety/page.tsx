import { Brain, Wind, Heart, TrendingUp, BookOpen, AlertCircle, Users, Stethoscope, ChevronDown } from 'lucide-react'
import { BreathingSuite } from '@/components/anxiety-tools/breathing-suite'
import { GroundingExercise } from '@/components/anxiety-tools/grounding-exercise'
import { CBTThoughtRecord } from '@/components/anxiety-tools/cbt-thought-record'
import { WorryScheduler } from '@/components/anxiety-tools/worry-scheduler'
import { MoodTracker } from '@/components/anxiety-tools/mood-tracker'
import { GratitudeJournal } from '@/components/anxiety-tools/gratitude-journal'
import { ExposureLadder } from '@/components/anxiety-tools/exposure-ladder'
import { PMRBodyScan } from '@/components/anxiety-tools/pmr-body-scan'
import { ProgressDashboard } from '@/components/anxiety-tools/progress-dashboard'
import { CrisisResources } from '@/components/anxiety-tools/crisis-resources'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export const dynamic = 'force-static'

export default function AnxietyPage() {
  return (
    <main className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="relative py-16 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-6">
              <Brain className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Anxiety — Calm the Body, Train the Mind
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Evidence-based tools and resources to understand and manage anxiety. Track your progress, build resilience, and find calm.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#interactive-tools">
                <Button size="lg" className="px-8">
                  <Wind className="mr-2 h-5 w-5" />
                  Start Practicing
                </Button>
              </a>
              <a href="#crisis-help">
                <Button size="lg" variant="outline" className="px-8">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Crisis Resources
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-green-50">
            <h2 className="text-2xl font-bold text-center mb-8">You're Not Alone</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1 in 5</div>
                <div className="text-sm text-muted-foreground">UK adults report anxiety symptoms weekly</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">19.1%</div>
                <div className="text-sm text-muted-foreground">US adults experience anxiety disorders annually</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">31.9%</div>
                <div className="text-sm text-muted-foreground">Adolescents experience lifetime anxiety</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Treatable</div>
                <div className="text-sm text-muted-foreground">With evidence-based interventions</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* What is Anxiety */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">What is Anxiety?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">Normal Anxiety vs. Anxiety Disorder</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Normal anxiety</strong> is a natural response to stress or danger—it helps us stay alert and motivated. 
                <strong className="block mt-2">Anxiety disorders</strong> involve excessive, persistent worry that interferes with daily life, relationships, work, or school.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">Common Signs & Symptoms</h3>
              <ul className="text-sm space-y-2">
                <li>• Excessive worry that's hard to control</li>
                <li>• Restlessness, feeling on edge</li>
                <li>• Muscle tension, fatigue</li>
                <li>• Difficulty concentrating</li>
                <li>• Sleep disturbances</li>
                <li>• Physical symptoms: rapid heartbeat, sweating, trembling</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Tools Hub */}
      <section id="interactive-tools" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Interactive Wellness Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nine evidence-based tools to help you manage anxiety, track your progress, and build lasting skills.
            </p>
          </div>

          <Tabs defaultValue="breathing" className="w-full">
            <div className="overflow-x-auto pb-4">
              <TabsList className="inline-flex w-auto min-w-full justify-start">
                <TabsTrigger value="breathing" className="flex-shrink-0">
                  <Wind className="h-4 w-4 mr-2" />
                  Breathing
                </TabsTrigger>
                <TabsTrigger value="grounding" className="flex-shrink-0">
                  5-4-3-2-1
                </TabsTrigger>
                <TabsTrigger value="cbt" className="flex-shrink-0">
                  <Brain className="h-4 w-4 mr-2" />
                  Thought Record
                </TabsTrigger>
                <TabsTrigger value="worry" className="flex-shrink-0">
                  Worry Time
                </TabsTrigger>
                <TabsTrigger value="exposure" className="flex-shrink-0">
                  Exposure Ladder
                </TabsTrigger>
                <TabsTrigger value="mood" className="flex-shrink-0">
                  Mood Tracker
                </TabsTrigger>
                <TabsTrigger value="gratitude" className="flex-shrink-0">
                  <Heart className="h-4 w-4 mr-2" />
                  Gratitude
                </TabsTrigger>
                <TabsTrigger value="pmr" className="flex-shrink-0">
                  PMR
                </TabsTrigger>
                <TabsTrigger value="bodyscan" className="flex-shrink-0">
                  Body Scan
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex-shrink-0">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Progress
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="breathing" className="mt-8">
              <BreathingSuite />
            </TabsContent>

            <TabsContent value="grounding" className="mt-8">
              <GroundingExercise />
            </TabsContent>

            <TabsContent value="cbt" className="mt-8">
              <CBTThoughtRecord />
            </TabsContent>

            <TabsContent value="worry" className="mt-8">
              <WorryScheduler />
            </TabsContent>

            <TabsContent value="exposure" className="mt-8">
              <ExposureLadder />
            </TabsContent>

            <TabsContent value="mood" className="mt-8">
              <MoodTracker />
            </TabsContent>

            <TabsContent value="gratitude" className="mt-8">
              <GratitudeJournal />
            </TabsContent>

            <TabsContent value="pmr" className="mt-8">
              <PMRBodyScan mode="pmr" />
            </TabsContent>

            <TabsContent value="bodyscan" className="mt-8">
              <PMRBodyScan mode="bodyscan" />
            </TabsContent>

            <TabsContent value="progress" className="mt-8">
              <ProgressDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Understanding Anxiety - Educational Content */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Understanding Anxiety</h2>
            <p className="text-xl text-muted-foreground">Learn about anxiety disorders, causes, and evidence-based treatments</p>
          </div>

          <div className="space-y-4">
            {/* Types of Anxiety Disorders */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left">Types of Anxiety Disorders</h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Generalized Anxiety Disorder (GAD)</h4>
                      <p className="text-sm text-muted-foreground">
                        Persistent, excessive worry about various life areas (work, health, family) for at least 6 months. 
                        UK prevalence: 5.6%; US: 3.1% of adults.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Panic Disorder</h4>
                      <p className="text-sm text-muted-foreground">
                        Recurrent unexpected panic attacks—sudden surges of intense fear with physical symptoms (racing heart, sweating, chest pain).
                        US prevalence: 2.7% of adults.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Social Anxiety Disorder (SAD)</h4>
                      <p className="text-sm text-muted-foreground">
                        Intense fear of social situations where scrutiny is possible. Fear of embarrassment or negative evaluation.
                        US prevalence: 7.1% (12-month). Often begins around age 13.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Specific Phobias</h4>
                      <p className="text-sm text-muted-foreground">
                        Intense, irrational fear of specific objects or situations (heights, animals, flying, blood).
                        US prevalence: 9.1% of adults.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Health Anxiety (Illness Anxiety Disorder)</h4>
                      <p className="text-sm text-muted-foreground">
                        Preoccupation with having or acquiring a serious illness despite minimal or no symptoms. 
                        High health anxiety and excessive checking or avoidance of medical care.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Evidence-Based Techniques */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left">Evidence-Based Techniques</h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">🫁 Breathing Techniques</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Meta-analysis shows medium effect size (d=-0.42) for reducing anxiety. Optimal at 5-6 breaths/min.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• <strong>Box Breathing (4-4-4-4):</strong> Stabilizes nervous system</li>
                        <li>• <strong>4-7-8 Breathing:</strong> Extended exhale activates parasympathetic response</li>
                        <li>• <strong>Coherent Breathing (5-5):</strong> Maximizes heart rate variability</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🧠 Cognitive Behavioral Therapy (CBT)</h4>
                      <p className="text-sm text-muted-foreground">
                        Gold standard treatment with moderate effect sizes (g=0.56 vs placebo). Includes psychoeducation, cognitive restructuring, 
                        exposure, and behavioral activation. Typically 12-20 sessions.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🧘 Mindfulness-Based Cognitive Therapy (MBCT)</h4>
                      <p className="text-sm text-muted-foreground">
                        Non-inferior to CBT for GAD. 8-week program with daily practice. Reduces rumination and increases present-moment awareness.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🪜 Exposure Therapy</h4>
                      <p className="text-sm text-muted-foreground">
                        Gold standard for phobias, OCD, and PTSD. Gradual, systematic confrontation of fears in a safe environment. 
                        Creates new safety learning that competes with fear associations.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🏃 Exercise</h4>
                      <p className="text-sm text-muted-foreground">
                        Medium anxiolytic effect (d=-0.42). Higher intensity = greater benefits. Recommendation: 20-30 min, 3-5×/week, moderate-vigorous aerobic activity.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">😴 Sleep Hygiene</h4>
                      <p className="text-sm text-muted-foreground">
                        Bidirectional relationship with anxiety. Key practices: consistent schedule, cool dark room (60-67°F), no screens 1-2hr before bed, 
                        avoid caffeine after 2pm, wind-down routine.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🥗 Nutrition & Gut-Brain Axis</h4>
                      <p className="text-sm text-muted-foreground">
                        95% of serotonin produced in gut. Mediterranean diet associated with lower anxiety. Include: fiber, probiotics, omega-3s, 
                        polyphenols. Limit: processed foods, excess caffeine, alcohol.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Professional Help */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    When to Seek Professional Help
                  </h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-red-600">Red Flags - See a GP/Doctor if:</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Anxiety interferes with work, school, relationships, or daily activities</li>
                        <li>• Physical symptoms (chest pain, dizziness) causing distress</li>
                        <li>• Panic attacks occurring regularly</li>
                        <li>• Avoidance behavior limiting your life</li>
                        <li>• Self-medicating with alcohol or drugs</li>
                        <li>• Thoughts of self-harm or suicide</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Therapy Options</h4>
                      <ul className="text-sm space-y-2">
                        <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Gold standard, 12-20 sessions</li>
                        <li><strong>Acceptance and Commitment Therapy (ACT):</strong> Focus on psychological flexibility and values</li>
                        <li><strong>MBCT:</strong> Mindfulness-based, 8-week program</li>
                        <li><strong>Exposure Therapy:</strong> For phobias, OCD, PTSD</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Finding a Therapist</h4>
                      <p className="text-sm text-muted-foreground mb-2"><strong>UK:</strong></p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• NHS Talking Therapies (IAPT): Self-referral, free, evidence-based</li>
                        <li>• BACP (British Association for Counselling & Psychotherapy): bacp.co.uk</li>
                        <li>• Private: Typical £50-150/session</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mb-2 mt-3"><strong>US:</strong></p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Psychology Today therapist finder: psychologytoday.com</li>
                        <li>• ADAA therapist directory: adaa.org</li>
                        <li>• Insurance coverage varies; check your plan</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Medication Overview</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        First-line: SSRIs (sertraline, escitalopram). Takes 4-8 weeks for full effect. Continue 6-12 months after remission.
                        Second-line: SNRIs, pregabalin. Benzodiazepines only for short-term crisis (2-4 weeks max due to dependence risk).
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        Note: Medication decisions should be made with a healthcare provider considering your individual situation.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Age-Specific Guidance */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left">Age-Specific Considerations</h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Children & Adolescents</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        20.3% of 8-16 year-olds in UK have probable mental disorder (2023). Screen ages 8-18.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Treatment:</strong> CBT most effective (ages 7-17). SSRIs if moderate-severe. Combined CBT + SSRI best for severe cases.
                        School accommodations: IEPs/504 plans, extra time, quiet spaces.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Adults</h4>
                      <p className="text-sm text-muted-foreground">
                        Peak onset 18-44 years. Common triggers: work stress, relationships, life transitions, financial pressures.
                        Treatment: CBT, medication, lifestyle interventions. Address comorbidities (depression, ADHD).
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Older Adults (65+)</h4>
                      <p className="text-sm text-muted-foreground">
                        Often underrecognized. Contributing factors: bereavement, medical conditions, fear of falling, social isolation.
                        <strong className="block mt-2">Treatment adaptations:</strong> CBT effective with slower pace, written materials. 
                        Medications: start low, go slow. Avoid benzodiazepines (fall risk). Exercise: walking, Tai Chi (reduces falls).
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* For Parents, Teachers, Carers */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Guidance for Parents, Teachers & Carers
                  </h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">For Parents</h4>
                      <p className="text-sm text-muted-foreground mb-2"><strong>Recognizing anxiety in children:</strong></p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Frequent stomachaches/headaches without medical cause</li>
                        <li>• School avoidance, clinginess, excessive reassurance-seeking</li>
                        <li>• Irritability, meltdowns, perfectionism</li>
                        <li>• Sleep difficulties, nightmares</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-3 mb-2"><strong>How to help:</strong></p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Validate feelings: "I can see you're worried" vs "Don't worry"</li>
                        <li>• Encourage gradual exposure (don't enable avoidance)</li>
                        <li>• Model calm coping, maintain routines</li>
                        <li>• Limit reassurance (teaches self-reliance)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">For Teachers</h4>
                      <p className="text-sm text-muted-foreground mb-2"><strong>Classroom strategies:</strong></p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Create predictable environment (visual schedules, advance notice of changes)</li>
                        <li>• Offer breaks, quiet corner for self-regulation</li>
                        <li>• Break large tasks into smaller steps</li>
                        <li>• Normalize mistakes, emphasize effort over perfection</li>
                        <li>• Never force participation without support</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">For Carers</h4>
                      <p className="text-sm text-muted-foreground mb-2"><strong>Supporting someone with anxiety:</strong></p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Educate yourself about their specific disorder</li>
                        <li>• Be patient—recovery is gradual with setbacks</li>
                        <li>• Encourage treatment, support medication adherence</li>
                        <li>• Balance support with encouragement to face fears</li>
                        <li>• Practice active listening without judgment</li>
                        <li>• Take care of yourself—caregiver burnout is real</li>
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </div>
      </section>

      {/* Crisis Resources Section */}
      <section id="crisis-help" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Crisis Resources</h2>
            <p className="text-xl text-muted-foreground">Free, confidential support available 24/7</p>
          </div>
          <CrisisResources />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4">
            This platform provides educational information and self-help tools. It is not a substitute for professional medical advice, 
            diagnosis, or treatment. Always seek the advice of your physician or qualified mental health provider with any questions 
            regarding a medical condition.
          </p>
          <p className="text-sm text-muted-foreground">
            Content based on evidence from NHS, NICE, Mental Health Foundation, APA, NAMI, NIMH, and peer-reviewed research (2025).
          </p>
        </div>
      </footer>
    </main>
  )
}
