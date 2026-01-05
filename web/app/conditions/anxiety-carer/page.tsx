"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Shield, 
  Users, 
  Brain, 
  BookOpen, 
  Activity,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Phone,
  Stethoscope,
  UserCheck,
  Sparkles,
  Target,
  Headphones,
  Lightbulb
} from "lucide-react"
import { StreakTracker } from "@/components/anxiety-tools/streak-tracker"
import { DailyChallenges } from "@/components/anxiety-tools/daily-challenges"
import { SupportQuiz } from "@/components/anxiety-tools/support-quiz"
import { AchievementBoard } from "@/components/anxiety-tools/achievement-board"
import { CrisisResources } from "@/components/anxiety-tools/crisis-resources"

export default function AnxietyCarerSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Heart className="h-3 w-3 mr-1" />
              For Professional & Family Carers
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Supporting People Living with Anxiety
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8">
              Professional guidance, practical strategies, and interactive learning for carers supporting individuals with anxiety disorders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-emerald-50">
                <BookOpen className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="h-5 w-5 mr-2" />
                Crisis Resources
              </Button>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-white mb-1">19.1%</div>
                <p className="text-emerald-100 text-sm">Adults experience anxiety disorders annually (US)</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-white mb-1">1 in 5</div>
                <p className="text-emerald-100 text-sm">UK adults experience weekly anxiety symptoms</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-white mb-1">Effective</div>
                <p className="text-emerald-100 text-sm">Professional support significantly improves recovery outcomes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <StreakTracker />
          <SupportQuiz />
          <DailyChallenges />
          <AchievementBoard />
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Understanding Your Role */}
        <Card className="mb-8 border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-teal-600" />
              Understanding Your Role as a Carer
            </CardTitle>
            <CardDescription>
              Whether you're a professional carer, family member, or friend, your support is crucial for recovery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-teal-50 dark:bg-teal-950/20 p-6 rounded-lg border border-teal-200 dark:border-teal-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-teal-600" />
                    Professional Carers
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Healthcare workers, support workers, care home staff supporting individuals with anxiety as part of their professional duties.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-teal-600" />
                    Family/Friend Carers
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Family members, partners, or friends providing ongoing support to someone living with anxiety.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded border">
                <p className="text-sm font-medium flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Important:</strong> Self-care is not selfish. Caregiver burnout is real. You cannot pour from an empty cup—taking care of yourself enables you to provide better support.
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Support Strategies */}
        <Card className="mb-8 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-emerald-600" />
              Core Support Strategies
            </CardTitle>
            <CardDescription>
              Evidence-based approaches for supporting someone with anxiety
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-lg">1. Educate Yourself About Anxiety</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-emerald-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Understanding anxiety as a medical condition (not a choice or character flaw) is the foundation of effective support.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">Key Facts:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Anxiety disorders are the most common mental health conditions</li>
                        <li>Physical symptoms (panic attacks, stomachaches, headaches) are REAL—caused by the fight-or-flight response</li>
                        <li>Anxiety is highly treatable with CBT, medication (SSRIs), and lifestyle changes</li>
                        <li>Recovery is gradual; setbacks are normal and expected</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">Learn About Specific Disorders:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li><strong>Generalized Anxiety Disorder (GAD):</strong> Chronic worry about multiple topics</li>
                        <li><strong>Social Anxiety:</strong> Fear of social evaluation/embarrassment</li>
                        <li><strong>Panic Disorder:</strong> Recurrent panic attacks</li>
                        <li><strong>Specific Phobias:</strong> Intense fear of specific objects/situations</li>
                        <li><strong>OCD:</strong> Intrusive thoughts + compulsive behaviors</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-teal-50 dark:bg-teal-950/20 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Headphones className="h-5 w-5 text-teal-600" />
                  <span className="font-semibold text-lg">2. Practice Active Listening</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-teal-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Let them express worries without judgment. Your role is to listen, not immediately fix.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold text-sm mb-2 text-green-900 dark:text-green-100 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        DO:
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Maintain eye contact</li>
                        <li>Use open body language</li>
                        <li>Reflect feelings: "It sounds like you're feeling overwhelmed"</li>
                        <li>Ask open questions: "Tell me more about that"</li>
                        <li>Acknowledge their experience: "That must be really hard"</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                      <p className="font-semibold text-sm mb-2 text-red-900 dark:text-red-100 flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        DON'T:
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Interrupt or finish sentences</li>
                        <li>Immediately problem-solve (unless asked)</li>
                        <li>Say "Just relax" or "Calm down"</li>
                        <li>Minimize: "It's not that bad"</li>
                        <li>Compare: "Others have it worse"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-cyan-600" />
                  <span className="font-semibold text-lg">3. Encourage (Don't Force) Treatment</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-cyan-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Support them in accessing professional help without being pushy or controlling.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">Helpful Approaches:</p>
                      <ul className="text-sm space-y-2 list-disc list-inside">
                        <li><strong>Offer practical help:</strong> "Would you like me to help you find a therapist?" or "I can drive you to appointments"</li>
                        <li><strong>Share information:</strong> Provide resources about CBT, medication options</li>
                        <li><strong>Attend appointments if supportive:</strong> With their permission, accompany them for moral support</li>
                        <li><strong>Support medication adherence:</strong> Help track doses, manage side effects (without nagging)</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded border border-amber-300 dark:border-amber-700">
                      <p className="text-sm font-medium flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>
                          Balance: Encourage treatment without ultimatums. Respect autonomy while expressing concern: "I'm worried about you. I think talking to someone could really help."
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-lg">4. Balance Support with Not Enabling Avoidance</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-purple-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Avoidance temporarily reduces anxiety but maintains it long-term. Your role is to support them in facing fears gradually, not enable avoidance.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">Example: Social Anxiety</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-900 dark:text-red-100">Enabling Avoidance:</p>
                            <p className="text-muted-foreground">"It's okay, you don't have to go to the party. I'll make an excuse for you."</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-900 dark:text-green-100">Supportive Encouragement:</p>
                            <p className="text-muted-foreground">"I know it feels really hard. Let's work together to make a plan. Maybe we could go for just 30 minutes?"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded border border-green-300 dark:border-green-700">
                      <p className="text-sm font-medium">
                        <Sparkles className="inline h-4 w-4 mr-1" />
                        Key Phrase: "I know it's hard AND I believe you can do it."
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-rose-50 dark:bg-rose-950/20 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-rose-600" />
                  <span className="font-semibold text-lg">5. Limit Excessive Reassurance</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-rose-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Constant reassurance reinforces anxiety by preventing them from building confidence in their own judgment.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">The Reassurance Trap:</p>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Person asks: "Will I be okay?"</li>
                        <li>You reassure: "Yes, you'll be fine!"</li>
                        <li>Anxiety temporarily reduces</li>
                        <li>Soon returns → asks again</li>
                        <li>Cycle repeats, dependency grows</li>
                      </ol>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                        <p className="font-semibold text-sm mb-2 text-green-900 dark:text-green-100">✅ Better Response</p>
                        <p className="text-sm">
                          "We've talked about this already. What do you remember?"<br/>
                          OR<br/>
                          "What do you think? How have you handled this before?"
                        </p>
                      </div>
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                        <p className="font-semibold text-sm mb-2 text-amber-900 dark:text-amber-100">⚖️ Balance</p>
                        <p className="text-sm">
                          Provide reassurance 1-2 times, then gently redirect. You're teaching them to trust themselves.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold text-lg">6. Encourage Self-Care Activities</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-indigo-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Support them in maintaining healthy habits that reduce anxiety (exercise, sleep, nutrition, social connection).
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">Physical Health:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Exercise together (walk, yoga, gym)</li>
                        <li>Prepare healthy meals</li>
                        <li>Support consistent sleep schedule</li>
                        <li>Limit caffeine/alcohol</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">Mental/Social Health:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Do relaxing activities together</li>
                        <li>Encourage hobbies they enjoy</li>
                        <li>Facilitate social connections</li>
                        <li>Practice breathing exercises together</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Special Considerations */}
        <Card className="mb-8 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              Special Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="elderly" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="elderly">Elderly Individuals</TabsTrigger>
                <TabsTrigger value="comorbid">Comorbid Conditions</TabsTrigger>
                <TabsTrigger value="crisis">Crisis Situations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="elderly" className="space-y-4 mt-6">
                <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-lg mb-4 text-amber-900 dark:text-amber-100">Caring for Elderly with Anxiety</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                      <p className="font-semibold text-sm mb-2">Understand Age-Specific Factors:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Medical conditions may contribute (thyroid, heart conditions)</li>
                        <li>Grief and loss are common triggers</li>
                        <li>Fear of losing independence</li>
                        <li>Medication side effects or interactions</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                      <p className="font-semibold text-sm mb-2">Support Strategies:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Encourage social connection (combat isolation)</li>
                        <li>Senior centers, community groups, family visits</li>
                        <li>Safety modifications (fall prevention → reduces fear of falling)</li>
                        <li>Advocate in healthcare (anxiety often under-recognized in elderly)</li>
                        <li>Medication review for interactions</li>
                        <li>Provide transportation to appointments, social activities</li>
                        <li>Monitor for depression (high comorbidity)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="comorbid" className="space-y-4 mt-6">
                <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-lg mb-4 text-purple-900 dark:text-purple-100">Anxiety with Comorbid Conditions</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                      <p className="font-semibold text-sm mb-2">Anxiety & Depression (60% overlap):</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>SSRIs treat both conditions (sertraline, escitalopram)</li>
                        <li>CBT effective for comorbid anxiety-depression</li>
                        <li>Higher suicide risk → monitor closely</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                      <p className="font-semibold text-sm mb-2">Anxiety & ADHD (13-50% comorbidity):</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Stimulants (ADHD meds) may worsen anxiety in some</li>
                        <li>Atomoxetine (non-stimulant) may help both</li>
                        <li>CBT for both; address anxiety first if it's driving ADHD-like symptoms</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                      <p className="font-semibold text-sm mb-2">Anxiety & Autism (40% have ≥1 anxiety disorder):</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>CBT with adaptations (concrete language, visual supports, shorter sessions)</li>
                        <li>Reduce sensory overload, predictable routines, visual schedules</li>
                        <li>Social anxiety common (fear of evaluation + social communication difficulties)</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                      <p className="font-semibold text-sm mb-2">Anxiety & Chronic Pain:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Bidirectional: pain → anxiety, anxiety → ↑ pain perception</li>
                        <li>CBT for pain addresses catastrophizing, fear-avoidance</li>
                        <li>SNRIs (duloxetine) treat both pain and anxiety</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="crisis" className="space-y-4 mt-6">
                <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-lg mb-4 text-red-900 dark:text-red-100">Recognizing and Responding to Crisis</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border-2 border-red-300 dark:border-red-700">
                      <p className="font-semibold text-sm mb-2 text-red-900 dark:text-red-100">Suicidal Thoughts or Self-Harm:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li><strong>Seek immediate help:</strong> Call 999 (UK) / 911 (US) or take to A&E/ER</li>
                        <li>Crisis lines: Samaritans (116 123), 988 Suicide & Crisis Lifeline (US)</li>
                        <li>Do NOT leave them alone</li>
                        <li>Remove means of self-harm if safe to do so</li>
                        <li>Stay calm, listen without judgment, express care</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                      <p className="font-semibold text-sm mb-2">Panic Attacks:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Stay with them, remain calm</li>
                        <li>Reassure: "This is a panic attack. It will pass. You are safe."</li>
                        <li>Encourage slow breathing (e.g., 4-7-8: inhale 4, hold 7, exhale 8)</li>
                        <li>Don't say "Calm down" (increases pressure)</li>
                        <li>After: validate experience, encourage professional help if recurrent</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                      <p className="font-semibold text-sm mb-2">Severe Distress:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Contact crisis line (NHS 111 mental health option, Shout 85258)</li>
                        <li>Call their therapist/psychiatrist if applicable</li>
                        <li>Use safety plan if they have one</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Carer Self-Care */}
        <Card className="mb-8 border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-600" />
              Taking Care of Yourself: Preventing Caregiver Burnout
            </CardTitle>
            <CardDescription>
              You cannot pour from an empty cup. Your wellbeing matters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-pink-50 dark:bg-pink-950/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800 space-y-4">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                <p className="font-semibold mb-2 text-red-900 dark:text-red-100">Signs of Caregiver Burnout:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Chronic fatigue, exhaustion</li>
                    <li>Withdrawal from friends, activities</li>
                    <li>Irritability, anger</li>
                    <li>Sleep problems</li>
                  </ul>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Anxiety, depression</li>
                    <li>Physical health problems</li>
                    <li>Resentment toward person you're caring for</li>
                    <li>Feeling helpless, overwhelmed</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                  <p className="font-semibold text-sm mb-2">Self-Care Strategies:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li><strong>Set boundaries:</strong> It's okay to say no. You don't have to be available 24/7.</li>
                    <li><strong>Take breaks:</strong> Regular time away is essential, not selfish.</li>
                    <li><strong>Seek support:</strong> Carer support groups, therapy for yourself</li>
                    <li><strong>Maintain your own health:</strong> Exercise, sleep, nutrition, hobbies</li>
                    <li><strong>Ask for help:</strong> Share caregiving duties with others</li>
                    <li><strong>Accept imperfection:</strong> You're doing your best; that's enough</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded">
                  <p className="text-sm font-medium">
                    <Sparkles className="inline h-4 w-4 mr-1" />
                    Remember: Taking care of yourself is part of providing good care. When you're rested and supported, you can offer better support to them.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Resources */}
        <CrisisResources />
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This page provides educational information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers.
            </p>
            <p>
              Content based on evidence from NICE guidelines, NHS resources, Anxiety Canada, and peer-reviewed research.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
