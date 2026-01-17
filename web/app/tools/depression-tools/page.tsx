'use client'

import { Heart, TrendingUp, BookOpen, AlertCircle, Users, Stethoscope, ChevronDown, Activity, Brain, Target, Wind, Moon, Apple, Dumbbell, Pill, MessageSquare, Phone } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { BehavioralActivation } from '@/app/conditions/depression/components/behavioral-activation'
import { useState } from 'react'
import { EvidenceFooter } from '@/components/evidence-footer'
import { evidenceByRoute } from '@/lib/evidence/page-evidence'

// Mood Tracker Component
function MoodTracker() {
  const [entries, setEntries] = useState<Array<{ date: string; mood: number; note: string }>>([])
  const [currentMood, setCurrentMood] = useState(5)
  const [note, setNote] = useState('')

  const saveMood = () => {
    if (typeof window !== 'undefined') {
      const entry = {
        date: new Date().toLocaleDateString(),
        mood: currentMood,
        note: note
      }
      const updated = [entry, ...entries].slice(0, 30)
      localStorage?.setItem('moodEntries', JSON.stringify(updated))
      setEntries(updated)
      setNote('')
      setCurrentMood(5)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-4">Daily Mood Tracker</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Track your mood daily to identify patterns and triggers. Research shows that mood monitoring improves treatment outcomes.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">How are you feeling today? (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={currentMood}
            onChange={(e) => setCurrentMood(parseInt(e.target.value))}
            className="w-full"
            aria-label="Mood rating from 1 to 10"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Very Low</span>
            <span className="text-lg font-bold text-primary">{currentMood}</span>
            <span>Very Good</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2">Notes (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What influenced your mood today?"
            className="w-full p-3 border rounded-lg"
            rows={3}
          />
        </div>
        
        <Button onClick={saveMood} className="w-full">Save Entry</Button>
      </div>

      {entries.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Recent Entries</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries.map((entry, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                  <span className="text-sm font-bold text-primary">Mood: {entry.mood}/10</span>
                </div>
                {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

// Breathing Exercise Component
function BreathingExercise() {
  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-4">Breathing for Depression</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Deep breathing activates the vagus nerve, reducing stress hormones and improving mood regulation. Practice daily for best results.
      </p>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">🫨 4-7-8 Breathing (Calming)</h4>
          <ol className="text-sm space-y-1 ml-4">
            <li>1. Breathe in through nose for 4 seconds</li>
            <li>2. Hold breath for 7 seconds</li>
            <li>3. Exhale slowly through mouth for 8 seconds</li>
            <li>4. Repeat 4-6 times</li>
          </ol>
          <p className="text-xs text-muted-foreground mt-2"><strong>Best for:</strong> Anxiety, insomnia, emotional regulation</p>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">💨 Box Breathing (Grounding)</h4>
          <ol className="text-sm space-y-1 ml-4">
            <li>1. Inhale for 4 seconds</li>
            <li>2. Hold for 4 seconds</li>
            <li>3. Exhale for 4 seconds</li>
            <li>4. Hold for 4 seconds</li>
          </ol>
          <p className="text-xs text-muted-foreground mt-2"><strong>Best for:</strong> Stress, concentration, emotional stability</p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">☀️ Coherent Breathing (Balance)</h4>
          <ol className="text-sm space-y-1 ml-4">
            <li>1. Inhale for 5 seconds</li>
            <li>2. Exhale for 5 seconds</li>
            <li>3. Continue for 5-10 minutes</li>
          </ol>
          <p className="text-xs text-muted-foreground mt-2"><strong>Best for:</strong> Heart rate variability, autonomic balance</p>
        </div>
      </div>
    </Card>
  )
}

// Cognitive Reframing Tool
function CognitiveReframing() {
  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-4">Cognitive Reframing</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Challenge negative automatic thoughts and develop more balanced thinking patterns. Core technique from Cognitive Behavioral Therapy.
      </p>
      
      <div className="space-y-4">
        <div className="bg-white border-2 border-primary/20 rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-primary">Common Cognitive Distortions</h4>
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-semibold">All-or-Nothing Thinking</p>
              <p className="text-xs text-muted-foreground">"If I'm not perfect, I'm a total failure"</p>
            </div>
            <div>
              <p className="font-semibold">Overgeneralization</p>
              <p className="text-xs text-muted-foreground">"Nothing ever works out for me"</p>
            </div>
            <div>
              <p className="font-semibold">Mind Reading</p>
              <p className="text-xs text-muted-foreground">"They think I'm incompetent"</p>
            </div>
            <div>
              <p className="font-semibold">Catastrophizing</p>
              <p className="text-xs text-muted-foreground">"This will be a disaster"</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Reframing Steps</h4>
          <ol className="text-sm space-y-2 ml-4">
            <li><strong>1. Identify:</strong> What negative thought am I having?</li>
            <li><strong>2. Evidence:</strong> What facts support or contradict this?</li>
            <li><strong>3. Alternative:</strong> What's a more balanced perspective?</li>
            <li><strong>4. Action:</strong> What can I do right now?</li>
          </ol>
        </div>
      </div>
    </Card>
  )
}

// Gratitude Practice
function GratitudePractice() {
  const [gratitudes, setGratitudes] = useState<string[]>([])
  const [input, setInput] = useState('')

  const addGratitude = () => {
    if (input.trim()) {
      setGratitudes([input, ...gratitudes].slice(0, 10))
      setInput('')
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-4">Gratitude Practice</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Regular gratitude practice increases positive emotions and life satisfaction. Write 3 things you're grateful for daily.
      </p>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGratitude()}
            placeholder="I'm grateful for..."
            className="flex-1 p-3 border rounded-lg"
          />
          <Button onClick={addGratitude}>Add</Button>
        </div>

        {gratitudes.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Your Gratitudes:</h4>
            {gratitudes.map((item, i) => (
              <div key={i} className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-3">
                <p className="text-sm">✨ {item}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground">
            <strong>Research shows:</strong> Daily gratitude practice for 3 weeks significantly improves mood and reduces depressive symptoms.
          </p>
        </div>
      </div>
    </Card>
  )
}

// Crisis Resources Component
function CrisisResources() {
  const resources = {
    uk: [
      { name: 'Samaritans', contact: '116 123 (24/7)', icon: Phone },
      { name: 'Crisis Text (Shout)', contact: 'Text SHOUT to 85258', icon: MessageSquare },
      { name: 'NHS 111', contact: 'Dial 111 or 111.nhs.uk', icon: Phone },
    ],
    us: [
      { name: '988 Suicide & Crisis Lifeline', contact: 'Dial 988 (24/7)', icon: Phone },
      { name: 'Crisis Text Line', contact: 'Text HELLO to 741741', icon: MessageSquare },
      { name: 'NAMI Helpline', contact: '1-800-950-6264', icon: Phone },
    ]
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-red-50 border-2 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Emergency</h3>
            <p className="text-sm text-red-800 mb-3">If you're in immediate danger, call emergency services:</p>
            <div className="flex gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="font-bold">🇬🇧 UK: 999</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="font-bold">🇺🇸 US: 911</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🇬🇧</span> UK Crisis Support
          </h4>
          <div className="space-y-3">
            {resources.uk.map((r, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3">
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-primary">{r.contact}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🇺🇸</span> US Crisis Support
          </h4>
          <div className="space-y-3">
            {resources.us.map((r, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3">
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-primary">{r.contact}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

const evidence = evidenceByRoute['/tools/depression-tools']

export default function DepressionToolsPage() {
  return (
    <main className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="relative py-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-6">
              <Heart className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Depression — Tools, Management & Recovery
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive, evidence-based tools and resources for managing depression. Track your progress, access treatment information, and find support.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#interactive-tools">
                <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
                  <Target className="mr-2 h-5 w-5" />
                  Start Using Tools
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
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-2xl font-bold text-center mb-8">Understanding Depression</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">280M+</div>
                <div className="text-sm text-muted-foreground">People globally affected by depression</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">16%</div>
                <div className="text-sm text-muted-foreground">UK adults with moderate-severe symptoms (2023)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">13.1%</div>
                <div className="text-sm text-muted-foreground">US population aged 12+ with depression</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Treatable</div>
                <div className="text-sm text-muted-foreground">With evidence-based interventions</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* What is Depression */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">What is Depression?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">Clinical Depression (MDD)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Major Depressive Disorder</strong> is more than sadness—it's a persistent condition lasting at least two weeks with five or more symptoms including depressed mood, loss of interest, changes in sleep/appetite, fatigue, difficulty concentrating, and feelings of worthlessness.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">The Neurobiology</h3>
              <p className="text-sm text-muted-foreground">
                Depression involves complex interactions between neurotransmitters (serotonin, dopamine, norepinephrine), HPA axis dysregulation leading to elevated cortisol, and chronic neuroinflammation affecting brain regions like the hippocampus and prefrontal cortex.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">Types of Depression</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Major Depression (MDD):</strong> Severe episode lasting 2+ weeks</li>
                <li>• <strong>Persistent Depression (PDD):</strong> Chronic, lasting 2+ years</li>
                <li>• <strong>Seasonal (SAD):</strong> Pattern linked to seasons</li>
                <li>• <strong>Postpartum:</strong> During/after pregnancy</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">Depression vs. Sadness</h3>
              <p className="text-sm text-muted-foreground">
                Normal sadness is temporary and situational. Depression is persistent, pervasive, significantly impairs functioning, and involves physical symptoms. It's a medical condition requiring professional treatment—not a character flaw or weakness.
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
              Evidence-based tools to help manage symptoms, track progress, and build recovery skills.
            </p>
          </div>

          <Tabs defaultValue="activation" className="w-full">
            <div className="overflow-x-auto pb-4">
              <TabsList className="inline-flex w-auto min-w-full justify-start">
                <TabsTrigger value="activation" className="flex-shrink-0">
                  <Target className="h-4 w-4 mr-2" />
                  Behavioral Activation
                </TabsTrigger>
                <TabsTrigger value="mood" className="flex-shrink-0">
                  <Activity className="h-4 w-4 mr-2" />
                  Mood Tracker
                </TabsTrigger>
                <TabsTrigger value="breathing" className="flex-shrink-0">
                  <Wind className="h-4 w-4 mr-2" />
                  Breathing
                </TabsTrigger>
                <TabsTrigger value="cognitive" className="flex-shrink-0">
                  <Brain className="h-4 w-4 mr-2" />
                  Cognitive Reframing
                </TabsTrigger>
                <TabsTrigger value="gratitude" className="flex-shrink-0">
                  <Heart className="h-4 w-4 mr-2" />
                  Gratitude
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="activation" className="mt-8">
              <BehavioralActivation />
            </TabsContent>

            <TabsContent value="mood" className="mt-8">
              <MoodTracker />
            </TabsContent>

            <TabsContent value="breathing" className="mt-8">
              <BreathingExercise />
            </TabsContent>

            <TabsContent value="cognitive" className="mt-8">
              <CognitiveReframing />
            </TabsContent>

            <TabsContent value="gratitude" className="mt-8">
              <GratitudePractice />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Treatment & Management - Educational Content */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Evidence-Based Treatment & Management</h2>
            <p className="text-xl text-muted-foreground">Comprehensive information on treatment options, lifestyle interventions, and recovery strategies</p>
          </div>

          <div className="space-y-4">
            {/* Pharmacotherapy */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    Pharmacotherapy (Medication)
                  </h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Antidepressants modulate neurotransmitter activity. First-line treatment for moderate to severe depression.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                        <h4 className="font-bold text-blue-900 mb-2">SSRIs</h4>
                        <p className="text-xs text-blue-800 mb-2"><strong>Examples:</strong> Fluoxetine, Sertraline, Citalopram, Escitalopram</p>
                        <p className="text-xs text-blue-700">Increase serotonin. Gold standard first-line treatment with favorable side-effect profile.</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                        <h4 className="font-bold text-purple-900 mb-2">SNRIs</h4>
                        <p className="text-xs text-purple-800 mb-2"><strong>Examples:</strong> Venlafaxine, Duloxetine</p>
                        <p className="text-xs text-purple-700">Increase serotonin and norepinephrine. Comparable efficacy to SSRIs.</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                        <h4 className="font-bold text-green-900 mb-2">Atypical</h4>
                        <p className="text-xs text-green-800 mb-2"><strong>Examples:</strong> Bupropion, Mirtazapine</p>
                        <p className="text-xs text-green-700">Unique mechanisms. Bupropion more activating; Mirtazapine sedating.</p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                        <h4 className="font-bold text-amber-900 mb-2">TCAs</h4>
                        <p className="text-xs text-amber-800 mb-2"><strong>Examples:</strong> Amitriptyline, Nortriptyline</p>
                        <p className="text-xs text-amber-700">Highly effective for severe depression but more side effects.</p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-900">
                        <strong>Important:</strong> Medications take 4-6 weeks for full effect. Never stop suddenly—work with your doctor to adjust dosing.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Psychotherapy */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Psychotherapy (Talk Therapy)
                  </h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Psychotherapy helps identify and change unhealthy thought patterns, behaviors, and relationships. Can be used alone for mild-moderate depression or combined with medication for severe cases.
                    </p>
                    <div className="space-y-3">
                      <div className="bg-white border-2 border-primary/20 rounded-lg p-4">
                        <h4 className="font-bold mb-2">Cognitive Behavioral Therapy (CBT)</h4>
                        <p className="text-sm text-muted-foreground mb-2">Identifies and changes negative thought patterns and behaviors. Structured, short-term, skill-building approach.</p>
                        <p className="text-xs text-green-700 font-semibold">Most researched; highly effective for mild-moderate depression</p>
                      </div>
                      <div className="bg-white border-2 border-primary/20 rounded-lg p-4">
                        <h4 className="font-bold mb-2">Behavioral Activation (BA)</h4>
                        <p className="text-sm text-muted-foreground mb-2">Focuses on scheduling meaningful activities. Based on principle that action precedes motivation.</p>
                        <p className="text-xs text-green-700 font-semibold">Comparable to CBT; often easier to implement</p>
                      </div>
                      <div className="bg-white border-2 border-primary/20 rounded-lg p-4">
                        <h4 className="font-bold mb-2">Interpersonal Therapy (IPT)</h4>
                        <p className="text-sm text-muted-foreground mb-2">Focuses on improving relationships and social functioning. Addresses grief, role disputes, transitions.</p>
                        <p className="text-xs text-green-700 font-semibold">Highly effective; time-limited (12-16 weeks)</p>
                      </div>
                      <div className="bg-white border-2 border-primary/20 rounded-lg p-4">
                        <h4 className="font-bold mb-2">Mindfulness-Based Cognitive Therapy (MBCT)</h4>
                        <p className="text-sm text-muted-foreground mb-2">Combines CBT with mindfulness meditation. Designed to prevent relapse in recurrent depression.</p>
                        <p className="text-xs text-green-700 font-semibold">Reduces relapse risk by 40-50%</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-900">
                        <strong>Combination Therapy:</strong> For moderate to severe depression, combining medication and psychotherapy produces higher remission rates and lower relapse rates than either alone.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Lifestyle Interventions */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left">Lifestyle Interventions</h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      These evidence-based lifestyle changes support recovery and enhance treatment effectiveness:
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4">
                        <Dumbbell className="h-8 w-8 text-red-600 mb-2" />
                        <h4 className="font-bold mb-2">Physical Activity</h4>
                        <p className="text-sm text-muted-foreground mb-2">Boosts neurotransmitters and promotes neurogenesis. Effects comparable to antidepressants for mild-moderate depression.</p>
                        <p className="text-xs font-semibold text-red-700">Aim: 30 min moderate activity most days</p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                        <Apple className="h-8 w-8 text-green-600 mb-2" />
                        <h4 className="font-bold mb-2">Nutrition & Diet</h4>
                        <p className="text-sm text-muted-foreground mb-2">Whole foods diet linked to lower depression risk. Omega-3s have anti-inflammatory properties.</p>
                        <p className="text-xs font-semibold text-green-700">Focus: Whole foods, fatty fish, leafy greens</p>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
                        <Moon className="h-8 w-8 text-indigo-600 mb-2" />
                        <h4 className="font-bold mb-2">Sleep Hygiene</h4>
                        <p className="text-sm text-muted-foreground mb-2">Quality sleep regulates mood neurotransmitters and reduces inflammatory markers.</p>
                        <p className="text-xs font-semibold text-indigo-700">Maintain consistent sleep/wake schedule</p>
                      </div>

                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-4">
                        <Users className="h-8 w-8 text-pink-600 mb-2" />
                        <h4 className="font-bold mb-2">Social Connection</h4>
                        <p className="text-sm text-muted-foreground mb-2">Strong social support is one of the most powerful protective factors against depression.</p>
                        <p className="text-xs font-semibold text-pink-700">Schedule regular contact with loved ones</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-900">
                        <strong>Important:</strong> Lifestyle interventions are supportive measures, not replacements for professional treatment. Combine with appropriate medical care for best results.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* When to Seek Help */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    When to Seek Professional Help
                  </h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-red-600">Seek Help Immediately If:</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Thoughts of self-harm or suicide</li>
                        <li>• Unable to care for yourself or meet basic needs</li>
                        <li>• Severe symptoms impacting safety</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Seek Help Soon If:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Symptoms persist for more than two weeks</li>
                        <li>• Symptoms significantly interfere with work, relationships, or daily activities</li>
                        <li>• You feel unable to cope with daily demands</li>
                        <li>• Previous treatments are no longer effective</li>
                        <li>• Loved ones express concern about your wellbeing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Finding Support</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold mb-2">🇬🇧 UK:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• NHS Talking Therapies (free, self-referral)</li>
                            <li>• GP referral for specialist services</li>
                            <li>• BACP therapist directory: bacp.co.uk</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-2">🇺🇸 US:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Psychology Today therapist finder</li>
                            <li>• SAMHSA Helpline: 1-800-662-4357</li>
                            <li>• Check insurance coverage for mental health</li>
                          </ul>
                        </div>
                      </div>
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
                    <Users className="h-5 w-5 text-primary" />
                    Guidance for Parents, Teachers & Carers
                  </h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Recognising Depression in Young People</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Persistent sadness, irritability, or hopelessness</li>
                        <li>• Withdrawal from friends and activities</li>
                        <li>• Changes in eating or sleeping patterns</li>
                        <li>• Declining academic performance or school avoidance</li>
                        <li>• Physical complaints without medical cause</li>
                        <li>• Talk of death, self-harm, or giving away possessions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How to Support Someone</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Listen without judgment and validate their feelings</li>
                        <li>• Don't minimize or dismiss their experience ("just cheer up")</li>
                        <li>• Encourage professional help and offer to assist with access</li>
                        <li>• Help with practical tasks when they're struggling</li>
                        <li>• Be patient—recovery takes time</li>
                        <li>• Look after your own wellbeing—carer burnout is real</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">For Teachers</h4>
                      <ul className="text-sm text-blue-900 space-y-1 ml-4">
                        <li>• Create a supportive, non-judgmental environment</li>
                        <li>• Notice behavioral changes and reach out privately</li>
                        <li>• Connect students with school counselors/nurses</li>
                        <li>• Allow flexibility with assignments when appropriate</li>
                        <li>• Educate yourself on mental health resources</li>
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Research & Statistics */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <h3 className="text-xl font-semibold text-left flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Research & Statistics
                  </h3>
                  <ChevronDown className="h-5 w-5 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                        <h4 className="font-bold text-blue-900 mb-2">Global Impact</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• 280M+ people globally affected</li>
                          <li>• Leading cause of disability worldwide</li>
                          <li>• $1 trillion annual economic cost</li>
                          <li>• Women 1.5-1.6x more likely than men</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                        <h4 className="font-bold text-purple-900 mb-2">UK Statistics (2023)</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• 16% of adults with moderate-severe symptoms</li>
                          <li>• 26% of young adults (16-29) affected</li>
                          <li>• Rates 60% higher than pre-pandemic</li>
                          <li>• 1 in 4 new disability benefits for depression/anxiety</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                        <h4 className="font-bold text-green-900 mb-2">US Statistics (2021-2023)</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• 13.1% of population aged 12+ with depression</li>
                          <li>• 19.2% of adolescents (12-19) affected</li>
                          <li>• 3x higher rate in lowest income bracket</li>
                          <li>• Only 39% with depression received therapy</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                        <h4 className="font-bold text-amber-900 mb-2">Treatment Efficacy</h4>
                        <ul className="text-sm text-amber-800 space-y-1">
                          <li>• 60-70% response rate to first antidepressant</li>
                          <li>• CBT/BA: 50-60% remission for mild-moderate</li>
                          <li>• Combination therapy: highest success rate</li>
                          <li>• Exercise: effects comparable to medication</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4">
                      <h4 className="font-bold mb-2">Key Research Findings</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• <strong>HPA Axis:</strong> Chronic stress dysregulates cortisol, damaging hippocampus and impairing mood regulation</li>
                        <li>• <strong>Neuroinflammation:</strong> Elevated IL-6 and TNF-α disrupt serotonin production, contributing to fatigue and cognitive symptoms</li>
                        <li>• <strong>Neuroplasticity:</strong> Exercise, therapy, and antidepressants promote BDNF production and neurogenesis</li>
                        <li>• <strong>Gut-Brain Axis:</strong> Diet quality influences inflammation and neurotransmitter synthesis via microbiome</li>
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
            Content based on evidence from NHS, NICE, WHO, DSM-5-TR, APA, NIMH, and peer-reviewed research (2026).
          </p>
        </div>
      </footer>

      {/* Evidence Sources */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <EvidenceFooter evidence={evidence} />
        </div>
      </section>
    </main>
  )
}
