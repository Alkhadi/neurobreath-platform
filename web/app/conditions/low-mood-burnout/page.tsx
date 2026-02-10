"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BurnoutAssessment } from "@/components/low-mood/burnout-assessment";
import { EnergyAccountingTracker } from "@/components/low-mood/energy-accounting-tracker";
import { ValuesCompass } from "@/components/low-mood/values-compass";
import { WorkplaceBoundaryBuilder } from "@/components/low-mood/workplace-boundary-builder";
import { BurnoutProgressDashboard } from "@/components/low-mood/burnout-progress-dashboard";
import { Battery, Heart, Brain, AlertCircle, CheckCircle2, Clock, Shield, Sun, CloudRain, Flame, Users, Phone, Baby, School, GraduationCap, Briefcase, Stethoscope, Building, BookOpen, ArrowRight } from "lucide-react";

export default function LowMoodBurnoutPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <CloudRain className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Low Mood & Burnout</h1>
          </div>
          <p className="text-xl md:text-2xl text-amber-100 max-w-3xl">
            A comprehensive, evidence-based resource for managing workplace burnout, chronic stress, and persistent low mood.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge 
              variant="secondary" 
              className="bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer transition-all hover:scale-105"
              onClick={() => setActiveTab("all-ages")}
            >
              All Ages
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer transition-all hover:scale-105"
              onClick={() => setActiveTab("healthcare")}
            >
              Healthcare
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer transition-all hover:scale-105"
              onClick={() => setActiveTab("workplace")}
            >
              Workplace
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer transition-all hover:scale-105"
              onClick={() => setActiveTab("research")}
            >
              Research
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tools">Interactive Tools</TabsTrigger>
            <TabsTrigger value="learn">Learn More</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="all-ages">All Ages</TabsTrigger>
            <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
            <TabsTrigger value="workplace">Workplace</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Summary */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-6 w-6 text-amber-600" />
                  What You'll Find Here
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">
                  This page provides evidence-based tools and information to help you understand and recover from burnout, chronic stress, and persistent low mood. All content is sourced from NHS, WHO, PubMed, and leading mental health organisations.
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="flex items-start gap-3">
                    <Flame className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Burnout Assessment</h3>
                      <p className="text-sm text-muted-foreground">Scientific self-assessment based on Maslach Burnout Inventory</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Battery className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Energy Pacing</h3>
                      <p className="text-sm text-muted-foreground">Traffic light system to balance draining and restorative activities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Workplace Boundaries</h3>
                      <p className="text-sm text-muted-foreground">Build and communicate healthy work-life boundaries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Values Reconnection</h3>
                      <p className="text-sm text-muted-foreground">Rediscover meaning through values-aligned activities</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Understanding Burnout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-amber-600" />
                  Understanding Low Mood & Burnout
                </CardTitle>
                <CardDescription>
                  Evidence-based information from NHS, WHO, and peer-reviewed research
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-blue-300 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-900">WHO Classification</AlertTitle>
                  <AlertDescription className="text-blue-800">
                    In 2019, the World Health Organisation (WHO) recognised burnout as an "occupational phenomenon" in the ICD-11. It is defined as a syndrome resulting from chronic workplace stress that has not been successfully managed.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">The Three Dimensions of Burnout</h3>
                  <div className="grid gap-3">
                    <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
                      <h4 className="font-semibold text-red-900">1. Emotional Exhaustion</h4>
                      <p className="text-sm text-red-800 mt-1">
                        Feeling emotionally drained, depleted, and lacking energy to face the day. Physical fatigue, difficulty concentrating, and persistent tiredness even after rest.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-orange-200 bg-orange-50">
                      <h4 className="font-semibold text-orange-900">2. Depersonalisation / Cynicism</h4>
                      <p className="text-sm text-orange-800 mt-1">
                        Increased mental distance from work, feelings of negativity or cynicism about one's job, and emotional detachment from colleagues or clients.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-amber-200 bg-amber-50">
                      <h4 className="font-semibold text-amber-900">3. Reduced Professional Efficacy</h4>
                      <p className="text-sm text-amber-800 mt-1">
                        Feeling unproductive, ineffective, and doubting your accomplishments. Loss of confidence in your abilities and reduced sense of achievement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Common Signs & Symptoms</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Physical Symptoms</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Chronic fatigue and exhaustion</li>
                        <li>Sleep disturbances (insomnia or oversleeping)</li>
                        <li>Frequent headaches or muscle pain</li>
                        <li>Weakened immune system</li>
                        <li>Changes in appetite or weight</li>
                        <li>Gastrointestinal problems</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Emotional & Cognitive</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Persistent sadness or low mood</li>
                        <li>Irritability, anger, or hostility</li>
                        <li>Loss of motivation or interest</li>
                        <li>Difficulty concentrating or brain fog</li>
                        <li>Feelings of helplessness or hopelessness</li>
                        <li>Anxiety and worry</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* When to Seek Help */}
            <Alert className="border-amber-500 bg-amber-50">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertTitle>When to Seek Professional Help</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  If low mood persists for <strong>more than 2 weeks</strong>, significantly affects your daily life, or you're experiencing thoughts of self-harm, please contact your GP or a mental health professional.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <Badge variant="outline" className="border-amber-600 text-amber-700">
                    NHS: 111
                  </Badge>
                  <Badge variant="outline" className="border-amber-600 text-amber-700">
                    Samaritans: 116 123 (UK)
                  </Badge>
                  <Badge variant="outline" className="border-amber-600 text-amber-700">
                    988 Suicide & Crisis Lifeline (US)
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>

            {/* Quick Links to Tools */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("tools")}>
                <CardHeader>
                  <CardTitle className="text-lg">Start Using Interactive Tools</CardTitle>
                  <CardDescription>
                    Evidence-based exercises to manage energy, track mood, and plan recovery
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("learn")}>
                <CardHeader>
                  <CardTitle className="text-lg">Learn About Treatment</CardTitle>
                  <CardDescription>
                    Explore evidence-based approaches including CBT, mindfulness, and workplace interventions
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* INTERACTIVE TOOLS TAB */}
          <TabsContent value="tools" className="space-y-6">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>All Data Stays Private</AlertTitle>
              <AlertDescription>
                Everything you enter is stored locally on your device only. Your data never leaves your browser.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <BurnoutAssessment />
              <EnergyAccountingTracker />
              <WorkplaceBoundaryBuilder />
              <ValuesCompass />
            </div>
          </TabsContent>

          {/* LEARN MORE TAB */}
          <TabsContent value="learn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Causes of Burnout & Low Mood</CardTitle>
                <CardDescription>Understanding the factors that contribute to burnout</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="workplace">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Workplace Factors</Badge>
                        <span>Most Common Causes</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <div className="space-y-2">
                        <p className="font-semibold">• Excessive Workload</p>
                        <p className="ml-4 text-muted-foreground">Heavy workloads, long hours, unrealistic deadlines, and constant demands without adequate resources or time.</p>
                        
                        <p className="font-semibold">• Lack of Control</p>
                        <p className="ml-4 text-muted-foreground">Feeling powerless over decisions affecting your work, schedule, or resources. Limited autonomy in how you do your job.</p>
                        
                        <p className="font-semibold">• Unclear Expectations</p>
                        <p className="ml-4 text-muted-foreground">Frequently changing job expectations, unclear roles and responsibilities, or conflicting demands from different sources.</p>
                        
                        <p className="font-semibold">• Lack of Support</p>
                        <p className="ml-4 text-muted-foreground">Poor communication with supervisors, insufficient social support from colleagues, or inadequate recognition for achievements.</p>
                        
                        <p className="font-semibold">• Unfair Treatment</p>
                        <p className="ml-4 text-muted-foreground">Experiencing bias, discrimination, or unfair treatment at work. Toxic work culture with bullying or excessive competition.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="individual">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Individual Factors</Badge>
                        <span>Personal Contributors</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <p>• <strong>Perfectionism:</strong> Setting unrealistically high standards and fearing failure</p>
                      <p>• <strong>Difficulty saying no:</strong> Taking on too much to please others or avoid conflict</p>
                      <p>• <strong>Lack of boundaries:</strong> Inability to separate work from personal life</p>
                      <p>• <strong>High achiever traits:</strong> Ambitious, competitive personalities that push too hard</p>
                      <p>• <strong>Caregiver traits:</strong> Putting others' needs before your own consistently</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="lifestyle">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Lifestyle Factors</Badge>
                        <span>Daily Life Stressors</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <p>• <strong>Poor sleep:</strong> Insufficient or poor-quality sleep compounds stress</p>
                      <p>• <strong>Lack of exercise:</strong> Physical inactivity worsens mood and energy</p>
                      <p>• <strong>Poor nutrition:</strong> Inadequate diet affects energy and mental health</p>
                      <p>• <strong>Social isolation:</strong> Lack of supportive relationships and connections</p>
                      <p>• <strong>Neglecting self-care:</strong> Not taking time for activities that restore energy</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evidence-Based Treatment & Recovery</CardTitle>
                <CardDescription>Approaches supported by NHS, WHO, and peer-reviewed research</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="cbt">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Most Effective</Badge>
                        <span>Cognitive Behavioural Therapy (CBT)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <p>
                        CBT is the <strong>most consistently effective therapy</strong> for reducing burnout symptoms, particularly emotional exhaustion. It helps you identify and change negative thought patterns and behaviours that contribute to stress.
                      </p>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="font-semibold text-blue-900">What CBT involves:</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-blue-800">
                          <li>Identifying unhelpful thinking patterns (e.g., catastrophising, perfectionism)</li>
                          <li>Challenging negative automatic thoughts</li>
                          <li>Developing more balanced, realistic perspectives</li>
                          <li>Learning practical coping strategies</li>
                          <li>Typically 6-20 sessions with a trained therapist</li>
                        </ul>
                      </div>
                      <p>
                        <strong>NHS Access:</strong> You can self-refer to NHS talking therapies services or ask your GP for a referral. Search "NHS talking therapies near me" to find your local service.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="ba">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Highly Effective</Badge>
                        <span>Behavioural Activation</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <p>
                        Behavioural Activation focuses on <strong>increasing engagement in meaningful activities</strong> to break the cycle of inactivity and low mood. When we're burned out, we tend to withdraw - this approach helps you gradually re-engage.
                      </p>
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <p className="font-semibold text-purple-900">Key principles:</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-purple-800">
                          <li>Activity monitoring to understand mood-activity connections</li>
                          <li>Identifying personal values as a guide for activities</li>
                          <li>Scheduling activities that provide pleasure, mastery, or connection</li>
                          <li>Starting with small, achievable tasks</li>
                          <li>Gradually increasing activity despite low motivation</li>
                        </ul>
                      </div>
                      <p>
                        Our <strong>Values Compass</strong> tool uses principles from Behavioural Activation to help you plan meaningful activities aligned with what matters most to you.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="mindfulness">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Evidence-Based</Badge>
                        <span>Mindfulness & Stress Reduction</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <p>
                        Mindfulness-based interventions have shown <strong>significant benefits in reducing stress</strong>, particularly in healthcare workers and high-stress professions. These practices help you stay present and respond more effectively to stressors.
                      </p>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="font-semibold text-green-900">Effective techniques:</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-green-800">
                          <li><strong>Breathing exercises:</strong> Calm the nervous system (use our Breathing Suite)</li>
                          <li><strong>Body scan meditation:</strong> Release physical tension</li>
                          <li><strong>Mindful movement:</strong> Gentle yoga or walking</li>
                          <li><strong>Present-moment awareness:</strong> Grounding exercises like 5-4-3-2-1</li>
                        </ul>
                      </div>
                      <p>
                        <strong>NHS resources:</strong> The NHS Every Mind Matters website offers free guided mindfulness exercises and audio guides.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="pacing">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-800">Energy Management</Badge>
                        <span>Pacing & Energy Conservation</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <p>
                        Pacing systems are <strong>evidence-based strategies</strong> developed for chronic fatigue and burnout recovery. They help you balance activity with rest to prevent the "boom-and-bust" cycle where you overdo it and then crash.
                      </p>
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="font-semibold text-amber-900">Key pacing strategies:</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-amber-800">
                          <li><strong>Traffic Light System:</strong> Categorise activities by energy cost (red/yellow/green)</li>
                          <li><strong>Energy Accounting:</strong> Track energy like a budget throughout the day</li>
                          <li><strong>Scheduled rest breaks:</strong> Rest before energy drops to zero</li>
                          <li><strong>Activity prioritisation:</strong> Focus on essential and meaningful tasks first</li>
                          <li><strong>Gradual increases:</strong> Build up activity levels slowly over time</li>
                        </ul>
                      </div>
                      <p>
                        Our <strong>Energy Accounting Tracker</strong> implements these evidence-based pacing principles to help you manage your energy sustainably.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="workplace">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Organisational</Badge>
                        <span>Workplace Interventions</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <p>
                        Since burnout is an <strong>occupational phenomenon</strong>, addressing workplace factors is crucial. Research shows the most effective interventions combine individual support with organisational changes.
                      </p>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="font-semibold text-blue-900">Effective workplace interventions:</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-blue-800">
                          <li><strong>Workload management:</strong> Realistic deadlines and adequate staffing</li>
                          <li><strong>Autonomy and control:</strong> Involving employees in decision-making</li>
                          <li><strong>Clear communication:</strong> Defined roles, expectations, and feedback</li>
                          <li><strong>Recognition programmes:</strong> Acknowledging efforts and achievements</li>
                          <li><strong>Flexible working:</strong> Remote work options and flexible hours</li>
                          <li><strong>Mental health support:</strong> Access to counselling and EAPs</li>
                        </ul>
                      </div>
                      <p>
                        <strong>If you're an employer:</strong> Consider workplace well-being programmes. If you're an employee, speak to HR about available support or occupational health services.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="medication">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">When Appropriate</Badge>
                        <span>Medication & Professional Support</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <p>
                        While burnout itself is not a medical diagnosis, <strong>if it has led to depression or severe anxiety</strong>, medication may be appropriate alongside therapy. This decision should always be made with a healthcare professional.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="font-semibold">When to consider GP consultation:</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                          <li>Low mood lasting more than 2 weeks</li>
                          <li>Symptoms significantly affecting daily functioning</li>
                          <li>Sleep disturbances despite good sleep hygiene</li>
                          <li>Physical symptoms (headaches, pain, fatigue) without clear cause</li>
                          <li>Thoughts of self-harm or suicide</li>
                        </ul>
                      </div>
                      <p>
                        Your GP can assess whether you would benefit from antidepressants (typically SSRIs), refer you to talking therapies, or connect you with occupational health support.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Self-Help Strategies</CardTitle>
                <CardDescription>Practical steps you can take today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
                      <h3 className="font-semibold text-green-900 mb-2">Physical Recovery</h3>
                      <ul className="text-sm space-y-1 text-green-800">
                        <li>• Prioritise 7-9 hours of quality sleep</li>
                        <li>• Regular gentle exercise (walking, yoga)</li>
                        <li>• Balanced nutrition with regular meals</li>
                        <li>• Limit caffeine and alcohol</li>
                        <li>• Take micro-breaks (5-10 min every hour)</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                      <h3 className="font-semibold text-blue-900 mb-2">Boundary Setting</h3>
                      <ul className="text-sm space-y-1 text-blue-800">
                        <li>• Set specific "work off" times</li>
                        <li>• Turn off work emails after hours</li>
                        <li>• Learn to say "no" to non-essential tasks</li>
                        <li>• Protect time for rest and hobbies</li>
                        <li>• Communicate needs clearly to others</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
                      <h3 className="font-semibold text-purple-900 mb-2">Social Support</h3>
                      <ul className="text-sm space-y-1 text-purple-800">
                        <li>• Talk to trusted friends or family</li>
                        <li>• Join support groups (online or in-person)</li>
                        <li>• Maintain social connections</li>
                        <li>• Share your struggles - you're not alone</li>
                        <li>• Consider peer support programmes</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-amber-200 bg-amber-50">
                      <h3 className="font-semibold text-amber-900 mb-2">Mental Restoration</h3>
                      <ul className="text-sm space-y-1 text-amber-800">
                        <li>• Practice daily mindfulness or meditation</li>
                        <li>• Engage in hobbies you enjoy</li>
                        <li>• Spend time in nature</li>
                        <li>• Keep a gratitude or reflection journal</li>
                        <li>• Limit social media and news consumption</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support for Families, Carers & Colleagues</CardTitle>
                <CardDescription>How to support someone experiencing burnout or low mood</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <h3 className="font-semibold mb-2">Recognising the Signs</h3>
                    <p className="text-muted-foreground">
                      Someone experiencing burnout may seem withdrawn, exhausted, cynical, or unusually irritable. They might work longer hours but seem less productive, or avoid social interactions. Physical signs include looking tired, frequent illness, or changes in appearance.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">How to Help</h3>
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                      <li><strong>Listen without judgement:</strong> Create a safe space for them to share their feelings</li>
                      <li><strong>Validate their experience:</strong> Acknowledge that burnout is real and not a sign of weakness</li>
                      <li><strong>Encourage professional help:</strong> Suggest speaking to a GP or counsellor</li>
                      <li><strong>Offer practical support:</strong> Help with tasks, childcare, or household responsibilities</li>
                      <li><strong>Respect boundaries:</strong> Don't pressure them to "just relax" or "think positive"</li>
                      <li><strong>Check in regularly:</strong> Consistent, gentle support over time matters most</li>
                    </ul>
                  </div>

                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-900">
                      <strong>What NOT to say:</strong> Avoid phrases like "just take a holiday," "you're being too sensitive," or "everyone feels this way sometimes." These can feel dismissive and unhelpful.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h3 className="font-semibold mb-2">Supporting Recovery</h3>
                    <p className="text-muted-foreground">
                      Recovery from burnout takes time - often <strong>several months to a year</strong>. Be patient and celebrate small improvements. Encourage them to use this page's tools, maintain boundaries, and seek professional support when needed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crisis & Support Resources */}
            <Card className="border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <Phone className="h-6 w-6" />
                  Crisis & Support Resources
                </CardTitle>
                <CardDescription className="text-red-800">
                  If you're in crisis or need immediate support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-red-400 bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle className="text-red-900">Immediate Help</AlertTitle>
                  <AlertDescription className="text-red-800">
                    <p className="mb-2">If you're experiencing thoughts of self-harm or suicide, please contact emergency services or a crisis line immediately.</p>
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* UK Resources */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-red-900 flex items-center gap-2">
                      <Badge variant="outline" className="border-red-600 text-red-700">UK</Badge>
                      Emergency & Crisis Support
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-white rounded border-2 border-red-200">
                        <p className="font-semibold">Emergency Services</p>
                        <p className="text-2xl font-bold text-red-600">999</p>
                        <p className="text-xs text-muted-foreground">Life-threatening emergencies</p>
                      </div>
                      <div className="p-3 bg-white rounded border-2 border-red-200">
                        <p className="font-semibold">NHS 111</p>
                        <p className="text-2xl font-bold text-red-600">111</p>
                        <p className="text-xs text-muted-foreground">Urgent medical help and mental health support</p>
                      </div>
                      <div className="p-3 bg-white rounded border-2 border-red-200">
                        <p className="font-semibold">Samaritans (24/7)</p>
                        <p className="text-2xl font-bold text-red-600">116 123</p>
                        <p className="text-xs text-muted-foreground">Confidential emotional support</p>
                      </div>
                      <div className="p-3 bg-white rounded border-2 border-red-200">
                        <p className="font-semibold">Shout Crisis Text Line</p>
                        <p className="text-lg font-bold text-red-600">Text SHOUT to 85258</p>
                        <p className="text-xs text-muted-foreground">24/7 text support</p>
                      </div>
                    </div>
                  </div>

                  {/* US Resources */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-red-900 flex items-center gap-2">
                      <Badge variant="outline" className="border-red-600 text-red-700">US</Badge>
                      Emergency & Crisis Support
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-white rounded border-2 border-red-200">
                        <p className="font-semibold">Emergency Services</p>
                        <p className="text-2xl font-bold text-red-600">911</p>
                        <p className="text-xs text-muted-foreground">Life-threatening emergencies</p>
                      </div>
                      <div className="p-3 bg-white rounded border-2 border-red-200">
                        <p className="font-semibold">988 Suicide & Crisis Lifeline</p>
                        <p className="text-2xl font-bold text-red-600">988</p>
                        <p className="text-xs text-muted-foreground">24/7 suicide prevention and crisis support</p>
                      </div>
                      <div className="p-3 bg-white rounded border-2 border-red-200">
                        <p className="font-semibold">Crisis Text Line</p>
                        <p className="text-lg font-bold text-red-600">Text HELLO to 741741</p>
                        <p className="text-xs text-muted-foreground">24/7 text support</p>
                      </div>
                      <div className="p-3 bg-white rounded border-2 border-red-200">
                        <p className="font-semibold">SAMHSA National Helpline</p>
                        <p className="text-lg font-bold text-red-600">1-800-662-4357</p>
                        <p className="text-xs text-muted-foreground">Mental health and substance use support</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Workplace & Occupational Health Support</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• <strong>Your GP:</strong> First point of contact for burnout symptoms, can provide sick notes and referrals</p>
                    <p>• <strong>Occupational Health:</strong> If available through your employer, they can assess work-related health concerns</p>
                    <p>• <strong>Employee Assistance Programme (EAP):</strong> Many employers offer free confidential counselling</p>
                    <p>• <strong>NHS Talking Therapies:</strong> Self-refer for CBT and other evidence-based therapies (UK)</p>
                    <p>• <strong>ACAS (UK):</strong> 0300 123 1100 - Workplace rights advice and support</p>
                    <p>• <strong>Mind Infoline (UK):</strong> 0300 123 3393 - Mental health information and support</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROGRESS TAB */}
          <TabsContent value="progress" className="space-y-6">
            <BurnoutProgressDashboard />
            
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>Recovery Takes Time</AlertTitle>
              <AlertDescription>
                Burnout recovery is a gradual process, often taking several months. Focus on consistency rather than perfection. Small, sustainable changes add up over time. Be compassionate with yourself.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* ALL AGES TAB */}
          <TabsContent value="all-ages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Age-Specific Guidance for Low Mood & Burnout</CardTitle>
                <CardDescription>
                  Evidence-based information and support tailored to different life stages
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Children (Ages 5-12) */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-6 w-6 text-blue-600" />
                  Children (Ages 5-12)
                </CardTitle>
                <CardDescription>Supporting children experiencing stress and low mood</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold mb-2">Common Stressors</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>School pressure and academic expectations</li>
                    <li>Family changes (separation, new siblings, moving house)</li>
                    <li>Bullying or friendship difficulties</li>
                    <li>Overscheduled activities without downtime</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold mb-2">Warning Signs</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-medium mb-1">Emotional:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Increased tearfulness or irritability</li>
                        <li>Withdrawal from activities they enjoyed</li>
                        <li>Clinginess or separation anxiety</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Physical:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Frequent tummy aches or headaches</li>
                        <li>Sleep problems or nightmares</li>
                        <li>Changes in appetite</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="parents">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">For Parents & Carers</Badge>
                        <span>How to Support Your Child</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <div className="space-y-2">
                        <p className="font-semibold">1. Create a Safe Space for Expression</p>
                        <p className="ml-4 text-muted-foreground">Use age-appropriate language. Try: "I've noticed you seem a bit worried lately. Would you like to talk about it?"</p>
                        
                        <p className="font-semibold">2. Validate Their Feelings</p>
                        <p className="ml-4 text-muted-foreground">Avoid dismissing with "you'll be fine." Instead: "That sounds really hard. It makes sense you feel that way."</p>
                        
                        <p className="font-semibold">3. Build in Downtime</p>
                        <p className="ml-4 text-muted-foreground">Children need unstructured play time. Limit extracurriculars to 1-2 activities.</p>
                        
                        <p className="font-semibold">4. Seek Professional Help If...</p>
                        <p className="ml-4 text-muted-foreground">Symptoms persist beyond 2 weeks, school refusal, self-harm mentions. Contact your GP or school counsellor.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="teachers">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">For Teachers</Badge>
                        <span>Classroom Strategies</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <p>• <strong>Notice changes:</strong> Sudden drop in academic performance, social withdrawal, or increased absences</p>
                      <p>• <strong>Gentle check-ins:</strong> "You don't seem yourself today. Is everything okay?"</p>
                      <p>• <strong>Classroom adjustments:</strong> Quiet workspaces, movement breaks, flexible deadlines when needed</p>
                      <p>• <strong>Liaise with parents:</strong> Share concerns sensitively and collaboratively</p>
                      <p>• <strong>School referrals:</strong> Engage pastoral care, school counsellor, or SENCO if available</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Teenagers (Ages 13-19) */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-6 w-6 text-purple-600" />
                  Teenagers (Ages 13-19)
                </CardTitle>
                <CardDescription>Supporting adolescents through high-stress years</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-purple-300 bg-purple-100">
                  <AlertCircle className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-900">
                    <strong>45% of UK teenagers</strong> report feeling overwhelmed (NHS Digital 2023). You're not alone.
                  </AlertDescription>
                </Alert>

                <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                  <h3 className="font-semibold mb-2">UK-Specific Stressors</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>GCSEs and A-Level exam pressure</li>
                    <li>Social media comparison and cyberbullying</li>
                    <li>University application stress (UCAS, personal statements)</li>
                    <li>Body image and identity exploration</li>
                    <li>Part-time work alongside studies</li>
                  </ul>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="teens">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">For Teenagers</Badge>
                        <span>Self-Help Strategies</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <p className="font-semibold">You Can Get Through This</p>
                      <div className="space-y-2">
                        <p>• <strong>Talk to someone:</strong> Friend, parent, teacher, or Childline (0800 1111, 24/7)</p>
                        <p>• <strong>Take social media breaks:</strong> Even 1-2 hours before bed helps. Delete apps temporarily if needed.</p>
                        <p>• <strong>Movement:</strong> Walk, dance, sport - 30 minutes reduces stress hormones significantly</p>
                        <p>• <strong>Sleep matters:</strong> Aim for 8-10 hours. Turn off screens 1 hour before bed.</p>
                        <p>• <strong>You don't have to be perfect:</strong> B grades are still good. Failure is feedback, not identity.</p>
                      </div>
                      <Alert className="bg-blue-50 border-blue-200">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          <strong>Childline:</strong> 0800 1111 (free, confidential, 24/7)
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="parents-teens">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">For Parents</Badge>
                        <span>Supporting Your Teenager</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <p>• <strong>Stay connected without nagging:</strong> Show interest in their world, not just grades</p>
                      <p>• <strong>Listen more than advise:</strong> Sometimes they need to vent, not solve</p>
                      <p>• <strong>Monitor but don't spy:</strong> Be aware of their online life; check in openly</p>
                      <p>• <strong>Normalize seeking help:</strong> "Seeing a counsellor is like seeing a personal trainer for your mind"</p>
                      <p>• <strong>When to get urgent help:</strong> Self-harm, eating disorder signs, substance use, suicidal thoughts</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="teachers-teens">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">For Teachers</Badge>
                        <span>Supporting At-Risk Students</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <p>• <strong>Early warning signs:</strong> Disengagement, missed deadlines, perfectionism spiraling, social isolation</p>
                      <p>• <strong>Reduce exam pressure:</strong> Remind them: "One exam doesn't define you. Your wellbeing matters more."</p>
                      <p>• <strong>Offer extensions compassionately:</strong> Mental health is as valid as physical illness</p>
                      <p>• <strong>Peer support systems:</strong> Buddy systems, mental health ambassadors in school</p>
                      <p>• <strong>Safeguarding:</strong> If concerned about self-harm/suicide, follow school safeguarding procedures immediately</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Young Adults (Ages 20-30) */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                  Young Adults (Ages 20-30)
                </CardTitle>
                <CardDescription>Navigating early career and life transitions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                  <h3 className="font-semibold mb-2">Common Challenges</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>University stress and student debt</li>
                    <li>First job overwhelming expectations</li>
                    <li>Imposter syndrome in new roles</li>
                    <li>"Quarter-life crisis" - uncertain about life direction</li>
                    <li>Comparison culture (everyone else seems to have it together)</li>
                  </ul>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="young-adults">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">For Young Adults</Badge>
                        <span>Self-Management Strategies</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <p className="font-semibold">It's Okay Not to Have It All Figured Out</p>
                      <div className="space-y-2">
                        <p>• <strong>Set boundaries early:</strong> Your first job sets the precedent. Don't work unpaid overtime to "prove yourself."</p>
                        <p>• <strong>Values over status:</strong> Use our Values Compass tool to define what actually matters to you, not society's definition of success.</p>
                        <p>• <strong>Financial stress management:</strong> Seek free debt advice (StepChange, Citizens Advice) - don't suffer in silence.</p>
                        <p>• <strong>Social media reality check:</strong> Everyone curates their best bits. You're comparing your behind-the-scenes to everyone's highlight reel.</p>
                        <p>• <strong>Build your toolbox now:</strong> Use our interactive tools to develop lifelong coping skills.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="parents-young">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">For Parents & Mentors</Badge>
                        <span>How to Support Without Rescuing</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <p>• <strong>Resist fixing everything:</strong> Ask "What do you need from me?" rather than jumping in with solutions</p>
                      <p>• <strong>Normalize struggle:</strong> Share your own career/life challenges (appropriately) to reduce shame</p>
                      <p>• <strong>Financial support boundaries:</strong> Help without creating dependence; discuss expectations openly</p>
                      <p>• <strong>Encourage professional help:</strong> Therapy is an investment, not a weakness. Offer to help find resources.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Adults (Ages 30-65) */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-amber-600" />
                  Adults (Ages 30-65)
                </CardTitle>
                <CardDescription>Managing career, family, and personal wellbeing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-amber-300 bg-amber-100">
                  <Flame className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    <strong>Peak burnout years.</strong> The "sandwich generation" often cares for children AND ageing parents while managing demanding careers.
                  </AlertDescription>
                </Alert>

                <div className="bg-white p-4 rounded-lg border-2 border-amber-200">
                  <p className="text-sm mb-3">
                    This is the age group our main interactive tools were designed for. Explore the full toolkit:
                  </p>
                  <Button 
                    onClick={() => setActiveTab("tools")}
                    className="w-full"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Go to Interactive Tools
                  </Button>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="workplace-adults">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Workplace-Specific</Badge>
                        <span>Career Stage Strategies</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <p>• <strong>Mid-career plateau:</strong> Feeling stuck? Consider job crafting - reshape your current role to align with strengths and values.</p>
                      <p>• <strong>Promotion pressure:</strong> Not everyone needs to climb. Lateral moves or staying put can be valid, fulfilling choices.</p>
                      <p>• <strong>Workload negotiation:</strong> "I can take this on if we deprioritize X and Y. What's most important?" Document everything.</p>
                      <p>• <strong>Career change considerations:</strong> It's never too late. Many successful career changers pivot in their 40s-50s.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="caregivers">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">For Caregivers</Badge>
                        <span>Preventing Caregiver Burnout</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <p className="font-semibold">Caring for others while caring for yourself</p>
                      <div className="space-y-2">
                        <p>• <strong>Respite care:</strong> Not a luxury - it's essential. Local authority assessments can provide funded breaks.</p>
                        <p>• <strong>Carers' rights:</strong> Carers UK (0808 808 7777) - advice on benefits, employment rights, and support services.</p>
                        <p>• <strong>Employer support:</strong> Carers' leave, flexible working - you're legally entitled to request adjustments.</p>
                        <p>• <strong>Peer support:</strong> Carers' groups provide practical advice AND emotional validation from people who truly understand.</p>
                      </div>
                      <Alert className="bg-blue-50 border-blue-200">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          <strong>UK Resources:</strong><br/>
                          • Carers UK: 0808 808 7777<br/>
                          • Working Families: 0300 012 0312<br/>
                          • Employers for Carers (workplace support)
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Older Adults (Ages 65+) */}
            <Card className="border-indigo-200 bg-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-indigo-600" />
                  Older Adults (Ages 65+)
                </CardTitle>
                <CardDescription>Navigating retirement and life transitions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                  <h3 className="font-semibold mb-2">Common Challenges</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Loss of identity and purpose after retirement</li>
                    <li>Health challenges and reduced mobility</li>
                    <li>Bereavement and loss of peers/partners</li>
                    <li>Social isolation and loneliness</li>
                    <li>Financial worries in retirement</li>
                  </ul>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="older-adults">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">For Older Adults</Badge>
                        <span>Staying Connected & Purposeful</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm">
                      <div className="space-y-2">
                        <p>• <strong>U3A (University of the Third Age):</strong> Learn new skills, make friends, stay mentally active. 1,000+ groups across UK.</p>
                        <p>• <strong>Volunteering:</strong> Gives structure, purpose, and social connection. Check local volunteer centers.</p>
                        <p>• <strong>Age UK:</strong> 0800 678 1602 - advice on benefits, local services, befriending services.</p>
                        <p>• <strong>The Silver Line:</strong> 0800 4 70 80 90 - 24/7 helpline for older people, offering information, friendship, and advice.</p>
                        <p>• <strong>Tech for connection:</strong> Video calls with family, online communities - ask for help learning if needed.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="family-older">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">For Family Members</Badge>
                        <span>Supporting Older Adults</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <p>• <strong>Don't dismiss as "just old age":</strong> Depression and low mood are NOT normal parts of ageing and ARE treatable.</p>
                      <p>• <strong>Physical health check:</strong> Rule out thyroid issues, vitamin B12 deficiency, medication side effects.</p>
                      <p>• <strong>Regular contact:</strong> Even a weekly phone call reduces isolation significantly.</p>
                      <p>• <strong>Practical help:</strong> Transport to activities, help with technology, connecting them to local services.</p>
                      <p>• <strong>Respect independence:</strong> Offer choices rather than taking over. "Would you like me to help with X?"</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HEALTHCARE TAB */}
          <TabsContent value="healthcare" className="space-y-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                  Clinical Guidance for Healthcare Professionals
                </CardTitle>
                <CardDescription>
                  Evidence-based assessment and treatment protocols for burnout
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Clinical Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Clinical Assessment of Burnout</CardTitle>
                <CardDescription>Maslach Framework and validated assessment tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold mb-3">Three Core Dimensions (Maslach Burnout Inventory)</h3>
                  <div className="space-y-2 text-sm">
                    <p>• <strong>Emotional Exhaustion:</strong> Feeling depleted of emotional resources</p>
                    <p>• <strong>Depersonalisation/Cynicism:</strong> Negative, detached attitudes toward work</p>
                    <p>• <strong>Reduced Personal Accomplishment:</strong> Decreased feelings of competence and achievement</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Validated Assessment Tools</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li><strong>Maslach Burnout Inventory (MBI):</strong> 22-item gold standard</li>
                    <li><strong>Copenhagen Burnout Inventory (CBI):</strong> 19-item, public domain</li>
                    <li><strong>Oldenburg Burnout Inventory (OLBI):</strong> 16-item, includes disengagement dimension</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Differential Diagnosis */}
            <Card>
              <CardHeader>
                <CardTitle>Differential Diagnosis</CardTitle>
                <CardDescription>Distinguishing burnout from other conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Feature</th>
                        <th className="border p-2 text-left">Burnout</th>
                        <th className="border p-2 text-left">Depression</th>
                        <th className="border p-2 text-left">GAD</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2 font-medium">Onset</td>
                        <td className="border p-2">Gradual, work-related</td>
                        <td className="border p-2">Can be acute or gradual</td>
                        <td className="border p-2">Gradual, persistent</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Scope</td>
                        <td className="border p-2">Work-specific</td>
                        <td className="border p-2">Pervasive (all life areas)</td>
                        <td className="border p-2">Generalized worry</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Mood</td>
                        <td className="border p-2">Exhaustion, cynicism</td>
                        <td className="border p-2">Persistent sadness, anhedonia</td>
                        <td className="border p-2">Anxiety, restlessness</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Improvement</td>
                        <td className="border p-2">Often with time off work</td>
                        <td className="border p-2">Doesn't improve with rest alone</td>
                        <td className="border p-2">Varies, often persistent</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Alert className="border-amber-300 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    <strong>Rule out physical causes:</strong> Thyroid dysfunction, anaemia, sleep apnoea, vitamin deficiencies, medication side effects
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Treatment Pathways */}
            <Card>
              <CardHeader>
                <CardTitle>Evidence-Based Treatment Pathways</CardTitle>
                <CardDescription>6-step primary care management protocol</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold">1. Screen with validated tools</p>
                    <p className="text-sm text-muted-foreground mt-1">PHQ-9 for depression, GAD-7 for anxiety, single-item burnout question</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold">2. Physical health assessment</p>
                    <p className="text-sm text-muted-foreground mt-1">FBC, TFTs, B12/folate, exclude organic causes</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold">3. Risk assessment</p>
                    <p className="text-sm text-muted-foreground mt-1">Self-harm thoughts, substance use, functional impairment</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold">4. Psychoeducation about burnout</p>
                    <p className="text-sm text-muted-foreground mt-1">Normalize as occupational phenomenon, not personal failing</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold">5. Consider sick leave/phased return</p>
                    <p className="text-sm text-muted-foreground mt-1">Fit notes for work-related stress, occupational health referral</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold">6. Signpost to interventions</p>
                    <p className="text-sm text-muted-foreground mt-1">IAPT, workplace adjustments, self-help resources (like this page)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Therapeutic Interventions */}
            <Card>
              <CardHeader>
                <CardTitle>Therapeutic Interventions by Evidence Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <Badge className="bg-green-100 text-green-800 mb-2">Strong Evidence</Badge>
                  <p className="text-sm font-semibold">Cognitive Behavioural Therapy (CBT)</p>
                  <p className="text-sm text-muted-foreground">Effect size: Cohen's d = 0.5-0.8 (moderate to large). Most consistent evidence for reducing emotional exhaustion.</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <Badge className="bg-green-100 text-green-800 mb-2">Strong Evidence</Badge>
                  <p className="text-sm font-semibold">Workplace Organisational Interventions</p>
                  <p className="text-sm text-muted-foreground">Addressing workload, control, rewards (Maslach's 6 Areas). Effect size: d = 0.35-0.65</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <Badge className="bg-blue-100 text-blue-800 mb-2">Moderate Evidence</Badge>
                  <p className="text-sm font-semibold">Mindfulness-Based Stress Reduction (MBSR)</p>
                  <p className="text-sm text-muted-foreground">Emotional exhaustion: d = -0.46. Particularly effective for healthcare workers.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <Badge className="bg-blue-100 text-blue-800 mb-2">Moderate Evidence</Badge>
                  <p className="text-sm font-semibold">Acceptance and Commitment Therapy (ACT)</p>
                  <p className="text-sm text-muted-foreground">Values clarification, psychological flexibility. Helpful for meaning/purpose dimensions.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <Badge className="bg-blue-100 text-blue-800 mb-2">Moderate Evidence</Badge>
                  <p className="text-sm font-semibold">Behavioural Activation</p>
                  <p className="text-sm text-muted-foreground">Particularly if low mood/depression co-occurs. Focus on meaningful activities.</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                  <Badge className="bg-amber-100 text-amber-800 mb-2">Supporting Evidence</Badge>
                  <p className="text-sm font-semibold">Physical Activity & Pacing Systems</p>
                  <p className="text-sm text-muted-foreground">Exercise reduces stress hormones. Pacing prevents boom-bust cycles.</p>
                </div>
              </CardContent>
            </Card>

            {/* Pharmacological Management */}
            <Card>
              <CardHeader>
                <CardTitle>Pharmacological Management</CardTitle>
                <CardDescription>When medication may be appropriate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-amber-300 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    <strong>Not first-line treatment.</strong> Burnout itself is not a medical diagnosis requiring medication.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2 text-sm">
                  <p><strong>Consider SSRIs if:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                    <li>Comorbid Major Depressive Disorder (PHQ-9 ≥10)</li>
                    <li>Comorbid Generalised Anxiety Disorder (GAD-7 ≥10)</li>
                    <li>Significant functional impairment despite psychological interventions</li>
                  </ul>

                  <p className="mt-3"><strong>Follow NICE guidelines:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                    <li>Start low, go slow (especially in older adults)</li>
                    <li>Review at 2 weeks, then 4 weeks, then 6-8 weeks</li>
                    <li>Continue for 6-12 months after symptom resolution</li>
                    <li>Taper gradually to prevent discontinuation syndrome</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Referral Pathways */}
            <Card>
              <CardHeader>
                <CardTitle>Referral Pathways</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold mb-1">Secondary Mental Health Services</p>
                    <p className="text-muted-foreground">When: Active suicidal ideation with plan/intent, psychotic symptoms, severe functional impairment</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-1">Occupational Health</p>
                    <p className="text-muted-foreground">When: Work-related stress, fitness to work assessment needed, workplace adjustments required</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-1">IAPT (Improving Access to Psychological Therapies)</p>
                    <p className="text-muted-foreground">When: Mild-moderate depression/anxiety, patient wants psychological therapy, can self-refer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• <strong>NICE Guidelines:</strong> CG90 (Depression), CG113 (GAD), NG222 (Mental health at work)</p>
                <p>• <strong>Faculty of Occupational Medicine:</strong> Evidence-based occupational health guidance</p>
                <p>• <strong>Royal College of Psychiatrists:</strong> Burnout resources for clinicians</p>
                <p>• <strong>HSE (Health & Safety Executive):</strong> Work-related stress management standards</p>
              </CardContent>
            </Card>

            {/* Healthcare Professional Burnout */}
            <Card className="border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <Heart className="h-6 w-6" />
                  For Healthcare Professionals Experiencing Burnout
                </CardTitle>
                <CardDescription className="text-red-800">
                  You are not alone. 40-50% of healthcare workers experience burnout.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-red-400 bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-900">
                    Healthcare professionals often struggle to seek help due to stigma. Your wellbeing matters as much as your patients'.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2 text-sm">
                  <p><strong>Confidential Support Services:</strong></p>
                  <div className="space-y-1 ml-4">
                    <p>• <strong>NHS Practitioner Health Programme:</strong> Confidential mental health service for NHS staff (self-referral)</p>
                    <p>• <strong>BMA (British Medical Association):</strong> 0330 123 1245 - Wellbeing support for doctors</p>
                    <p>• <strong>RCN (Royal College of Nursing):</strong> 0345 772 6100 - Counselling helpline for nurses</p>
                    <p>• <strong>Your employer's Occupational Health:</strong> Confidential service separate from HR</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WORKPLACE TAB */}
          <TabsContent value="workplace" className="space-y-6">
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-purple-600" />
                  Workplace Strategies for Burnout Prevention & Recovery
                </CardTitle>
                <CardDescription>
                  Guidance for employees, managers, and organizations
                </CardDescription>
              </CardHeader>
            </Card>

            {/* For Employees */}
            <Card>
              <CardHeader>
                <CardTitle>For Employees: 5-Step Navigation Guide</CardTitle>
                <CardDescription>How to address burnout in your workplace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold mb-2">1. Recognize & Document</p>
                    <p className="text-sm text-muted-foreground">Keep a symptom diary noting when symptoms worsen (specific days, after certain meetings, during particular projects). This evidence is valuable for conversations with your manager or GP.</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold mb-2">2. Speak to Your Manager</p>
                    <p className="text-sm text-muted-foreground mb-2">Example script:</p>
                    <div className="bg-white p-3 rounded border text-sm italic">
                      "I'd like to discuss my workload. I've been feeling overwhelmed and it's affecting my wellbeing. Can we look at priorities together and see if anything can be adjusted or delegated?"
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold mb-2">3. Request Reasonable Adjustments</p>
                    <p className="text-sm text-muted-foreground">Consider asking for:</p>
                    <ul className="text-sm list-disc list-inside ml-4 mt-1 text-muted-foreground">
                      <li>Flexible working hours or remote work options</li>
                      <li>Workload review and redistribution</li>
                      <li>Protected time for breaks</li>
                      <li>Temporary reduction in responsibilities</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Note:</strong> If burnout meets the Equality Act 2010 definition of disability (substantial, long-term impact on daily activities), employers have a legal duty to make reasonable adjustments.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold mb-2">4. Your GP & Occupational Health</p>
                    <p className="text-sm text-muted-foreground">
                      • Your GP can provide a fit note (sick note) for work-related stress<br/>
                      • Request an Occupational Health referral through your employer<br/>
                      • OH can recommend workplace adjustments independently
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold mb-2">5. Know Your Rights</p>
                    <ul className="text-sm list-disc list-inside ml-4 text-muted-foreground">
                      <li><strong>Working Time Regulations:</strong> 48-hour maximum working week (you can opt out, but can opt back in)</li>
                      <li><strong>Rest breaks:</strong> 20 minutes if you work more than 6 hours</li>
                      <li><strong>Annual leave:</strong> Minimum 5.6 weeks (28 days for full-time)</li>
                      <li><strong>Employment Rights Act:</strong> Protection against unfair dismissal if off sick</li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-blue-300 bg-blue-50">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Key UK Resources:</strong><br/>
                    • ACAS Early Conciliation: 0300 123 1100<br/>
                    • Mind Workplace Resources: mind.org.uk/workplace<br/>
                    • Citizens Advice Bureau: Free employment rights advice
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* For Managers */}
            <Card>
              <CardHeader>
                <CardTitle>For Managers: Supporting a Burnt-Out Team Member</CardTitle>
                <CardDescription>5-step protocol for compassionate management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                    <p className="font-semibold mb-2">1. Notice Early Warning Signs</p>
                    <ul className="text-sm list-disc list-inside ml-4 text-muted-foreground">
                      <li>Performance changes (missed deadlines, reduced quality)</li>
                      <li>Increased absences or presenteeism (physically present, mentally absent)</li>
                      <li>Withdrawn behavior, reduced participation in meetings</li>
                      <li>Irritability or emotional responses that seem out of character</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                    <p className="font-semibold mb-2">2. Have a Compassionate Conversation</p>
                    <p className="text-sm text-muted-foreground mb-2">Approach with care:</p>
                    <div className="bg-white p-3 rounded border text-sm">
                      <p className="italic mb-2">"I've noticed you seem [specific observation]. I'm concerned about your wellbeing. Is everything okay? How can I support you?"</p>
                      <p className="mt-2 font-semibold not-italic">Don't:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground">
                        <li>Make assumptions about the cause</li>
                        <li>Pressure them to disclose personal information</li>
                        <li>Dismiss with "we're all stressed"</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                    <p className="font-semibold mb-2">3. Make Reasonable Adjustments</p>
                    <p className="text-sm text-muted-foreground">Consider:</p>
                    <ul className="text-sm list-disc list-inside ml-4 text-muted-foreground">
                      <li>Workload redistribution (temporary or permanent)</li>
                      <li>Deadline flexibility</li>
                      <li>Flexible working arrangements</li>
                      <li>Reduced meeting load</li>
                      <li>Protected focus time</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                    <p className="font-semibold mb-2">4. Refer to Support Services</p>
                    <ul className="text-sm list-disc list-inside ml-4 text-muted-foreground">
                      <li>Occupational Health referral</li>
                      <li>Employee Assistance Programme (EAP)</li>
                      <li>Mental Health First Aiders (if available)</li>
                      <li>HR support for formal adjustments</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                    <p className="font-semibold mb-2">5. Follow-Up Regularly</p>
                    <p className="text-sm text-muted-foreground">
                      • Schedule weekly check-ins (even 15 minutes)<br/>
                      • Review adjustments - are they working?<br/>
                      • Document conversations and agreed actions<br/>
                      • Maintain confidentiality (only share with HR/OH as needed)
                    </p>
                  </div>
                </div>

                <Alert className="border-amber-300 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    <strong>Your Obligations Under HSE:</strong> Employers have a legal duty to conduct risk assessments for work-related stress and implement the HSE Management Standards for preventing stress.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Organizational Prevention */}
            <Card>
              <CardHeader>
                <CardTitle>Organizational Prevention Strategies</CardTitle>
                <CardDescription>Maslach's 6 Areas of Worklife Model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Research shows burnout results from chronic mismatches in these six areas. Organizations should address all six:
                </p>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="font-semibold mb-1">1. Workload</p>
                    <p className="text-sm text-muted-foreground">Sustainable pace, adequate recovery time, realistic deadlines</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="font-semibold mb-1">2. Control</p>
                    <p className="text-sm text-muted-foreground">Employee autonomy over work methods, schedule flexibility</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="font-semibold mb-1">3. Reward</p>
                    <p className="text-sm text-muted-foreground">Recognition systems, fair compensation, career development</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="font-semibold mb-1">4. Community</p>
                    <p className="text-sm text-muted-foreground">Supportive relationships, conflict resolution, team cohesion</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="font-semibold mb-1">5. Fairness</p>
                    <p className="text-sm text-muted-foreground">Transparent decisions, equity in treatment, clear policies</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="font-semibold mb-1">6. Values</p>
                    <p className="text-sm text-muted-foreground">Alignment between personal and organizational values</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 mt-4">
                  <p className="font-semibold mb-2">Return on Investment Data</p>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li><strong>£45 billion</strong> annual cost to UK economy (HSE 2023)</li>
                    <li><strong>5:1 return</strong> on workplace mental health investments</li>
                    <li><strong>17.1 million working days</strong> lost annually to stress</li>
                    <li>Deloitte Mental Health ROI Calculator available online</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RESEARCH TAB */}
          <TabsContent value="research" className="space-y-6">
            <Card className="border-indigo-200 bg-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                  Research Foundation & Evidence Base
                </CardTitle>
                <CardDescription>
                  Peer-reviewed studies and statistics supporting this page
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Landmark Studies */}
            <Card>
              <CardHeader>
                <CardTitle>Landmark Studies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="font-semibold">Maslach & Leiter (2016) - Understanding the Burnout Experience</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <em>Annual Review of Organizational Psychology and Organizational Behavior</em>
                  </p>
                  <p className="text-sm mt-2">Defined the three-dimensional model of burnout (exhaustion, cynicism, reduced efficacy) and the six areas of worklife mismatch framework.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="font-semibold">WHO (2019) - ICD-11 Recognition of Burnout</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <em>International Classification of Diseases, 11th Revision</em>
                  </p>
                  <p className="text-sm mt-2">Officially recognized burnout as an "occupational phenomenon" (QD85), defining it as a syndrome resulting from chronic workplace stress that has not been successfully managed.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="font-semibold">Salvagioni et al. (2017) - Physical Health Consequences Meta-Analysis</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <em>PLOS ONE</em>
                  </p>
                  <p className="text-sm mt-2">Meta-analysis of 36 studies showing burnout associated with type 2 diabetes (OR=1.42), coronary heart disease (OR=1.79), hospitalization due to cardiovascular disorder (OR=1.20), and all-cause mortality under age 45 (OR=1.20).</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="font-semibold">Koutsimani et al. (2019) - Burnout vs. Depression Differential</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <em>Frontiers in Psychology</em>
                  </p>
                  <p className="text-sm mt-2">Systematic review demonstrating burnout and depression are distinct constructs. Burnout is work-context specific, while depression is pervasive across life domains.</p>
                </div>
              </CardContent>
            </Card>

            {/* Treatment Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Effectiveness Meta-Analyses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="font-semibold mb-2">CBT Interventions for Burnout</p>
                  <p className="text-sm text-muted-foreground">
                    Multiple meta-analyses show <strong>Cohen's d = 0.5-0.8</strong> (moderate to large effect) for CBT in reducing burnout symptoms, particularly emotional exhaustion.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <em>Key studies: Awa et al. (2010), Dreison et al. (2018)</em>
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="font-semibold mb-2">Mindfulness-Based Stress Reduction (MBSR)</p>
                  <p className="text-sm text-muted-foreground">
                    Meta-analysis of healthcare workers: <strong>d = -0.46</strong> for emotional exhaustion, <strong>d = -0.57</strong> for depersonalization.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <em>Lomas et al. (2019) - Frontiers in Psychology</em>
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="font-semibold mb-2">Workplace Organizational Interventions</p>
                  <p className="text-sm text-muted-foreground">
                    Interventions targeting workload, control, and organizational support show <strong>d = 0.35-0.65</strong> effect sizes. Most effective when combining individual and organizational approaches.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <em>Awa et al. (2010) - Work & Stress</em>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* UK Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>UK-Specific Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                    <p className="text-3xl font-bold text-red-600">875,000</p>
                    <p className="text-sm text-muted-foreground">Workers suffering from work-related stress, depression, or anxiety (HSE 2023)</p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                    <p className="text-3xl font-bold text-red-600">40%</p>
                    <p className="text-sm text-muted-foreground">NHS staff reporting burnout symptoms (NHS Staff Survey 2023)</p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                    <p className="text-3xl font-bold text-red-600">17.1M</p>
                    <p className="text-sm text-muted-foreground">Working days lost annually to stress, depression, or anxiety (HSE 2023)</p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                    <p className="text-3xl font-bold text-red-600">£45B</p>
                    <p className="text-sm text-muted-foreground">Annual economic cost to UK economy (HSE 2023)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Neuroscience Research */}
            <Card>
              <CardHeader>
                <CardTitle>Neuroscience & Biological Mechanisms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <p className="font-semibold mb-2">HPA Axis Dysregulation</p>
                  <p className="text-sm text-muted-foreground">
                    Chronic stress leads to dysregulation of the hypothalamic-pituitary-adrenal (HPA) axis, resulting in abnormal cortisol patterns (both hyper- and hypo-cortisolism observed).
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <p className="font-semibold mb-2">Brain Structural Changes</p>
                  <p className="text-sm text-muted-foreground">MRI studies show:</p>
                  <ul className="text-sm list-disc list-inside ml-4 text-muted-foreground mt-1">
                    <li>Reduced grey matter volume in prefrontal cortex</li>
                    <li>Enlarged amygdala (emotional processing center)</li>
                    <li>Hippocampal atrophy (memory and stress regulation)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    <em>Savic (2015) - Stress</em>
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <p className="font-semibold mb-2">Inflammation Markers</p>
                  <p className="text-sm text-muted-foreground">
                    Burnout associated with elevated inflammatory markers: Interleukin-6 (IL-6), C-reactive protein (CRP), and tumor necrosis factor-alpha (TNF-α).
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <em>Grossi et al. (2015) - Stress</em>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Emerging Research */}
            <Card>
              <CardHeader>
                <CardTitle>Emerging Research Areas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-blue-100 text-blue-800">1</Badge>
                    <div>
                      <p className="font-semibold">Digital Interventions</p>
                      <p className="text-muted-foreground">App-based CBT, VR therapy for stress management, wearable biofeedback devices</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge className="bg-blue-100 text-blue-800">2</Badge>
                    <div>
                      <p className="font-semibold">Biomarkers</p>
                      <p className="text-muted-foreground">Heart rate variability (HRV), cortisol awakening response, inflammatory markers as early warning signs</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge className="bg-blue-100 text-blue-800">3</Badge>
                    <div>
                      <p className="font-semibold">Precision Medicine</p>
                      <p className="text-muted-foreground">Genetic vulnerability factors (FKBP5, COMT genes), personalized interventions based on individual profiles</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge className="bg-blue-100 text-blue-800">4</Badge>
                    <div>
                      <p className="font-semibold">Social Prescribing</p>
                      <p className="text-sm text-muted-foreground">Nature therapy, arts on prescription, community-based interventions gaining evidence base</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge className="bg-blue-100 text-blue-800">5</Badge>
                    <div>
                      <p className="font-semibold">4-Day Work Week</p>
                      <p className="text-muted-foreground">Iceland and UK pilot studies showing reduced burnout, maintained productivity, improved wellbeing</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
