'use client'

import { Zap, TrendingUp, BookOpen, AlertCircle, Users, Stethoscope, ChevronDown, Activity } from 'lucide-react'
import { PageHeader } from '@/components/page/PageHeader'
import { BreathingExercise } from './stress-tools/breathing-exercise'
import { GroundingExercise } from './stress-tools/grounding-exercise'
import { StressTracker } from './stress-tools/stress-tracker'
import { MuscleRelaxation } from './stress-tools/muscle-relaxation'
import { RelaxationGame } from './stress-tools/relaxation-game'
import { ProgressTracker } from './stress-tools/progress-tracker'
import { CrisisResources } from './stress-tools/crisis-resources'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import './styles/globals.css'
import { CredibilityFooter } from '@/components/trust/CredibilityFooter'
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog'
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial'
import type { Region } from '@/lib/region/region'

export const dynamic = 'force-static'

export default function StressPage() {
  const region: Region = 'UK'
  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and stress-support framing.',
    createdAt: '2026-01-16',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 120,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Credibility footer and review details added.', 'safety'),
    ]),
    citationsSummary: createCitationsSummary(0, ['C']),
  })
  return (
    <main className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="relative py-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <PageHeader 
              title="Stress Hub" 
              description="Evidence-based tools and resources to understand and manage stress. Track your progress, build resilience, and find calm."
              showMetadata
            />
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <a href="#interactive-tools">
                <Button size="lg" className="px-8 bg-teal-600 hover:bg-teal-700">
                  <Activity className="mr-2 h-5 w-5" />
                  Start Managing Stress
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
          <Card className="p-8 bg-gradient-to-r from-teal-50 to-purple-50">
            <h2 className="text-2xl font-bold text-center mb-8">You're Not Alone</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">74%</div>
                <div className="text-sm text-muted-foreground">UK adults felt overwhelmed by stress in the past year</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">77%</div>
                <div className="text-sm text-muted-foreground">US adults report stress affecting physical health</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">12.8M</div>
                <div className="text-sm text-muted-foreground">Working days lost to stress in UK (2023)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Manageable</div>
                <div className="text-sm text-muted-foreground">With evidence-based strategies</div>
              </div>
            </div>
          </Card>
        </div>
      </section>


      {/* What is Stress */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">What is Stress?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">Normal Stress vs. Chronic Stress</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Normal stress</strong> is the body's natural reaction to challenges—it enhances alertness and can boost performance. 
                <strong className="block mt-2">Chronic stress</strong> occurs when stressors persist without relief, leading to physical and mental health problems over time.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">The Fight-or-Flight Response</h3>
              <p className="text-sm text-muted-foreground">
                When facing a threat, your body releases adrenaline and cortisol, increasing heart rate, blood pressure, and energy supplies. 
                This survival mechanism is helpful short-term but harmful when constantly activated.
              </p>
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
              Six evidence-based tools to help you manage stress, track your progress, and build lasting skills.
            </p>
          </div>

          <Tabs defaultValue="breathing" className="w-full">
            <div className="overflow-x-auto pb-4">
              <TabsList className="inline-flex w-auto min-w-full justify-start gap-2 flex-wrap">
                <TabsTrigger value="breathing" className="flex-shrink-0">
                  <Zap className="h-4 w-4 mr-2" />
                  Breathing
                </TabsTrigger>
                <TabsTrigger value="grounding" className="flex-shrink-0">
                  5-4-3-2-1
                </TabsTrigger>
                <TabsTrigger value="tracker" className="flex-shrink-0">
                  <Activity className="h-4 w-4 mr-2" />
                  Stress Tracker
                </TabsTrigger>
                <TabsTrigger value="pmr" className="flex-shrink-0">
                  Muscle Relaxation
                </TabsTrigger>
                <TabsTrigger value="games" className="flex-shrink-0">
                  Mindful Games
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex-shrink-0">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Progress
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="breathing" className="mt-8">
              <BreathingExercise />
            </TabsContent>

            <TabsContent value="grounding" className="mt-8">
              <GroundingExercise />
            </TabsContent>

            <TabsContent value="tracker" className="mt-8">
              <StressTracker />
            </TabsContent>

            <TabsContent value="pmr" className="mt-8">
              <MuscleRelaxation />
            </TabsContent>

            <TabsContent value="games" className="mt-8">
              <RelaxationGame />
            </TabsContent>

            <TabsContent value="progress" className="mt-8">
              <ProgressTracker />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Understanding Stress - Educational Content */}
      <section className="py-16 px-4 bg-gradient-to-br from-teal-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Understanding Stress</h2>
            <p className="text-xl text-muted-foreground">Learn about stress types, causes, and evidence-based management strategies</p>
          </div>

          <div className="space-y-4">
            {/* Types of Stress */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left">Types of Stress</h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Acute Stress</h4>
                      <p className="text-sm text-muted-foreground">
                        Short-term stress from immediate pressures and demands. Examples include work deadlines, an argument, or exciting events.
                        It passes quickly and in small doses can be beneficial.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Episodic Acute Stress</h4>
                      <p className="text-sm text-muted-foreground">
                        Frequent episodes of acute stress. People with this pattern often live in a state of chaos and crisis, 
                        constantly taking on too much without recovery time.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Chronic Stress</h4>
                      <p className="text-sm text-muted-foreground">
                        Prolonged, constant stress lasting weeks, months, or years. Arises from persistent situations like financial hardship, 
                        difficult relationships, or chronic illness. This type poses the greatest health risks.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Stress vs. Anxiety</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>Stress</strong> is a response to an external trigger and typically subsides when the stressor is removed.
                        <strong className="block mt-2">Anxiety</strong> is persistent internal worry that can continue without a clear external cause 
                        and may indicate an anxiety disorder if severe and prolonged.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Signs and Symptoms */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left">Signs & Symptoms of Stress</h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Physical Symptoms</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Headaches and muscle tension</li>
                        <li>• Fatigue and sleep problems</li>
                        <li>• Digestive issues (nausea, stomach upset)</li>
                        <li>• Rapid heartbeat, chest tightness</li>
                        <li>• Weakened immune system</li>
                        <li>• Changes in appetite</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Emotional Symptoms</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Irritability and mood swings</li>
                        <li>• Feeling overwhelmed or out of control</li>
                        <li>• Anxiety and constant worrying</li>
                        <li>• Low mood and depression</li>
                        <li>• Feeling isolated or lonely</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Cognitive Symptoms</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Difficulty concentrating</li>
                        <li>• Memory problems</li>
                        <li>• Racing thoughts</li>
                        <li>• Poor decision-making</li>
                        <li>• Negative thinking patterns</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Behavioural Symptoms</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Social withdrawal</li>
                        <li>• Procrastination and neglecting responsibilities</li>
                        <li>• Increased use of alcohol or substances</li>
                        <li>• Changes in eating or sleeping habits</li>
                        <li>• Nervous habits (nail-biting, fidgeting)</li>
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Evidence-Based Techniques */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left">Evidence-Based Management Strategies</h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">🫨 Breathing Techniques</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Deep, diaphragmatic breathing activates the parasympathetic nervous system, reducing stress hormones.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• <strong>Box Breathing (4-4-4-4):</strong> Stabilises the nervous system</li>
                        <li>• <strong>4-7-8 Breathing:</strong> Extended exhale for deep relaxation</li>
                        <li>• <strong>Coherent Breathing (5-5):</strong> Maximises heart rate variability</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🧍 Progressive Muscle Relaxation</h4>
                      <p className="text-sm text-muted-foreground">
                        Systematically tensing and relaxing muscle groups releases physical tension and promotes body awareness.
                        Particularly effective for stress-related muscle pain and insomnia.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🧘 Mindfulness & Meditation</h4>
                      <p className="text-sm text-muted-foreground">
                        Trains the mind to focus on the present moment, breaking cycles of worry and rumination.
                        Even 10 minutes daily shows measurable benefits for stress reduction.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🏃 Physical Activity</h4>
                      <p className="text-sm text-muted-foreground">
                        Regular exercise reduces stress hormones and increases endorphins.
                        Recommendation: 20-30 minutes of moderate aerobic activity, 3-5 times weekly.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">😴 Sleep Hygiene</h4>
                      <p className="text-sm text-muted-foreground">
                        Bidirectional relationship with stress. Key practices: consistent sleep schedule, 
                        cool dark room (16-18°C), no screens 1-2 hours before bed, avoid caffeine after 2pm.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🥗 Nutrition</h4>
                      <p className="text-sm text-muted-foreground">
                        Mediterranean diet associated with lower stress. Include: fibre, probiotics, omega-3s.
                        Limit: processed foods, excess caffeine, alcohol.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">📊 Time Management</h4>
                      <p className="text-sm text-muted-foreground">
                        Organising tasks and setting realistic goals provides a sense of control.
                        Break large tasks into smaller, manageable steps. Learn to set boundaries and say "no".
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
                      <h4 className="font-semibold mb-2 text-red-600">Seek Help If:</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Stress is chronic, severe, and overwhelming</li>
                        <li>• Self-help strategies aren't providing relief</li>
                        <li>• Stress significantly impacts work, relationships, or daily functioning</li>
                        <li>• You're using alcohol or drugs to cope</li>
                        <li>• You're experiencing physical symptoms like chest pain or chronic digestive issues</li>
                        <li>• You're having thoughts of self-harm</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Treatment Options</h4>
                      <ul className="text-sm space-y-2">
                        <li><strong>Cognitive Behavioural Therapy (CBT):</strong> Identifies and changes negative thought patterns</li>
                        <li><strong>Counselling:</strong> Provides space to explore stressors and develop coping strategies</li>
                        <li><strong>Stress Management Programmes:</strong> Structured courses teaching practical skills</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Finding Support</h4>
                      <p className="text-sm text-muted-foreground mb-2"><strong>UK:</strong></p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• NHS Talking Therapies (IAPT): Free self-referral service</li>
                        <li>• BACP (British Association for Counselling & Psychotherapy): bacp.co.uk</li>
                        <li>• Employee Assistance Programmes (EAP) through work</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mb-2 mt-3"><strong>US:</strong></p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Psychology Today therapist finder: psychologytoday.com</li>
                        <li>• SAMHSA National Helpline: 1-800-662-4357</li>
                        <li>• Check insurance coverage for mental health services</li>
                      </ul>
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
                      <p className="text-sm text-muted-foreground mb-2"><strong>Recognising stress in children:</strong></p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Behavioural changes: irritability, withdrawal, clinginess</li>
                        <li>• Physical complaints: stomach aches, headaches without medical cause</li>
                        <li>• Academic changes: declining grades, school avoidance</li>
                        <li>• Sleep disturbances: nightmares, difficulty sleeping</li>
                        <li>• Regression to younger behaviours</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-3 mb-2"><strong>How to help:</strong></p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Model healthy coping behaviours</li>
                        <li>• Create a stable, supportive home environment</li>
                        <li>• Listen without judgement and validate feelings</li>
                        <li>• Teach age-appropriate relaxation techniques</li>
                        <li>• Maintain routines whilst allowing flexibility</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">For Teachers</h4>
                      <p className="text-sm text-muted-foreground mb-2"><strong>Classroom strategies:</strong></p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Create a predictable environment with clear expectations</li>
                        <li>• Build in movement breaks and calming activities</li>
                        <li>• Notice behavioural changes that may indicate stress</li>
                        <li>• Normalise discussions about mental health</li>
                        <li>• Break large assignments into manageable chunks</li>
                        <li>• Offer quiet spaces for self-regulation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">For Carers</h4>
                      <p className="text-sm text-muted-foreground mb-2"><strong>Supporting someone with stress:</strong></p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Listen empathetically without trying to "fix" immediately</li>
                        <li>• Validate their feelings—don't minimise or dismiss</li>
                        <li>• Encourage healthy coping strategies gently</li>
                        <li>• Help with practical tasks if appropriate</li>
                        <li>• Encourage professional help when needed</li>
                        <li>• Look after your own wellbeing—carer burnout is real</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Intervention Skills</h4>
                      <p className="text-sm text-muted-foreground mb-2"><strong>Quick intervention tactics:</strong></p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• <strong>In-the-moment:</strong> Guide through 5-4-3-2-1 grounding or deep breathing</li>
                        <li>• <strong>Short-term:</strong> Help identify stressors and schedule relaxation activities</li>
                        <li>• <strong>Long-term:</strong> Support development of healthy coping habits and lifestyle changes</li>
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Assessment Tools */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left">Assessment & Diagnosis</h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Perceived Stress Scale (PSS)</h4>
                      <p className="text-sm text-muted-foreground">
                        The most widely used psychological instrument for measuring stress perception.
                        A 10-question self-report measuring how unpredictable, uncontrollable, and overwhelming
                        life feels. Higher scores indicate higher perceived stress.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">HSE Stress Indicator Tool (UK)</h4>
                      <p className="text-sm text-muted-foreground">
                        A 35-question workplace stress assessment measuring six key areas: demands, control,
                        support, relationships, role, and change. Used by organisations to identify and
                        address work-related stress factors.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">When Stress Becomes Clinical</h4>
                      <p className="text-sm text-muted-foreground">
                        Chronic stress may develop into clinical conditions requiring professional diagnosis:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4 mt-2">
                        <li>• <strong>Adjustment Disorder:</strong> Disproportionate stress response to identifiable stressor</li>
                        <li>• <strong>Anxiety Disorders:</strong> Persistent worry beyond normal stress response</li>
                        <li>• <strong>Depression:</strong> Prolonged low mood often linked to chronic stress</li>
                        <li>• <strong>Burnout:</strong> Chronic workplace stress with exhaustion, cynicism, reduced efficacy</li>
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
            Content based on evidence from NHS, NICE, Mental Health Foundation, WHO, CDC, APA, and peer-reviewed research (2026).
          </p>
        </div>
      </footer>

      <section className="py-10 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <CredibilityFooter editorial={editorial} region={region} />
        </div>
      </section>
    </main>
  )
}
