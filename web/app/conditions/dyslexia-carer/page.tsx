import React from 'react';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, Heart, Users, Home,
  FileText, Download, CheckCircle2, AlertCircle, 
  Lightbulb, Phone, Shield
} from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Dyslexia Carer Support | NeuroBreath',
  description:
    'Dyslexia support for carers with daily routines, communication tips and wellbeing guidance for people of all ages, including adults.',
  path: '/conditions/dyslexia-carer',
});

export default function DyslexiaCarersPage() {
  return (
    <main className="mx-auto w-[86vw] max-w-[86vw] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-8 sm:space-y-10 md:space-y-12">
      
      {/* Hero Section */}
      <section className="space-y-6">
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
          <CardContent className="p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="space-y-4">
              <Badge className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300">
                <Heart className="w-4 h-4" />
                <span>Dyslexia Carers Support Hub • NeuroBreath</span>
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Supporting Someone with Dyslexia
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Comprehensive guidance for family carers, support workers, and care professionals supporting individuals with dyslexia. Practical strategies, self-care resources, and a supportive community.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button className="w-full gap-2 bg-orange-600 hover:bg-orange-700">
                <BookOpen className="w-5 h-5" />
                Daily Support
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Heart className="w-5 h-5" />
                Self-Care
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Phone className="w-5 h-5" />
                Crisis Support
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-5 h-5" />
                Resources
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-200 dark:border-orange-800">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">Carer-Focused</h3>
                  <p className="text-xs text-muted-foreground">Designed specifically for carers' needs</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-200 dark:border-orange-800">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">Community Support</h3>
                  <p className="text-xs text-muted-foreground">Connect with other carers</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-200 dark:border-orange-800">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">Evidence-Based</h3>
                  <p className="text-xs text-muted-foreground">Backed by research & expert guidance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Carer Overview */}
      <section className="space-y-4">
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Your Role as a Carer</CardTitle>
                <CardDescription>Understanding your important contribution</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>You are not alone.</strong> Caring for someone with dyslexia can be challenging, but with the right support and strategies, you can make a significant positive difference while maintaining your own wellbeing.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-white dark:bg-gray-900/50 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  What Carers Can Do
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Provide patient, understanding support</li>
                  <li>• Help with reading and writing tasks</li>
                  <li>• Assist with organization and planning</li>
                  <li>• Advocate for appropriate support</li>
                  <li>• Build confidence and self-esteem</li>
                  <li>• Use assistive technology together</li>
                  <li>• Encourage strengths and interests</li>
                  <li>• Maintain your own wellbeing</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-gray-900/50 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  Key Focus Areas
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Understanding dyslexia and its impact</li>
                  <li>• Daily living support strategies</li>
                  <li>• Communication and advocacy</li>
                  <li>• Accessing services and benefits</li>
                  <li>• Managing healthcare appointments</li>
                  <li>• Supporting independence</li>
                  <li>• Emotional support and resilience</li>
                  <li>• Respite and self-care</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Daily Support Strategies */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Daily Support Strategies</CardTitle>
                <CardDescription>Practical help for everyday situations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="reading" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="reading">Reading & Writing</TabsTrigger>
                <TabsTrigger value="organization">Organization</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
              </TabsList>

              <TabsContent value="reading" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Supporting Reading & Writing</h4>
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <h5 className="font-medium mb-2">📖 Reading Aloud</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Read important letters, forms, instructions, or texts aloud. Take your time and be patient. Ask if they'd like you to summarize or repeat information.
                      </p>
                      <Badge variant="outline">Essential Support</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">✍️ Writing Support</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Offer to be a scribe for important documents. Help break down writing tasks into smaller steps. Use templates and checklists where possible.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🎧 Audiobooks & Text-to-Speech</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Set up and encourage use of audiobooks, text-to-speech apps, and digital reading tools. Many are free or low-cost (e.g., RNIB Bookshare, Natural Reader).
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">📝 Simplify Written Materials</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use larger fonts, clear layouts, bullet points, and plain language. Highlight key information. Keep sentences short.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="organization" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Organization & Planning Help</h4>
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                      <h5 className="font-medium mb-2">📅 Visual Schedules</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use calendars, planners, and visual timetables. Color-code appointments and tasks. Set up phone reminders for important events.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🗂️ Filing & Storage</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Create clear, labeled filing systems with visual cues. Use color-coding. Keep frequently needed items in accessible, consistent places.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">📋 Checklists</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Break tasks into step-by-step checklists. Use tick boxes for satisfaction of completion. Visual progress is motivating.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">⏰ Time Management</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Allow extra time for reading/writing tasks. Use timers and alarms as helpful prompts. Build in breaks for longer activities.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="communication" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Effective Communication</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">🗣️ Clear Instructions</h5>
                      <p className="text-sm text-muted-foreground">
                        Give verbal instructions clearly and slowly. Break into small steps. Check understanding by asking them to repeat back.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">👂 Active Listening</h5>
                      <p className="text-sm text-muted-foreground">
                        Listen patiently without interrupting. Give extra time to process and respond. Rephrase if they seem confused.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">💬 Written Backup</h5>
                      <p className="text-sm text-muted-foreground">
                        Follow up verbal conversations with written notes, texts, or emails as reminders of key points.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">📞 Advocacy</h5>
                      <p className="text-sm text-muted-foreground">
                        Help communicate needs to services, healthcare, and agencies. Attend appointments as a supporter if requested.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="technology" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Assistive Technology Support</h4>
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-cyan-50 dark:bg-cyan-950/20">
                      <h5 className="font-medium mb-2">📱 Smartphone Tools</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Set up and teach use of: text-to-speech, voice assistants (Siri/Google Assistant), reminders, alarms, calendar apps, and voice recording for notes.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">💻 Computer Software</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Help install and learn: text-to-speech (Natural Reader, Read&Write), speech-to-text (Dragon, Google Voice Typing), spell-checkers, word prediction.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">📚 Digital Books & Audio</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Set up accounts for: Audible, RNIB Bookshare, Learning Ally, Kindle with adjustable fonts, library apps with audiobook access.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🔤 Reading Aids</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Consider: colored overlays, reading rulers, dyslexia-friendly fonts, screen filters, larger monitors or tablets.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Emotional Support */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/50">
                <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Emotional Support & Wellbeing</CardTitle>
                <CardDescription>Supporting mental health and resilience</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <Heart className="h-4 w-4" />
              <AlertDescription>
                <strong>Mental health matters.</strong> People with dyslexia may experience frustration, anxiety, or low self-esteem due to literacy challenges. Your understanding and encouragement are vital.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">🌟 Building Confidence</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Celebrate strengths, talents, and achievements</li>
                  <li>• Focus on what they can do, not what they can't</li>
                  <li>• Encourage hobbies and interests</li>
                  <li>• Share stories of successful people with dyslexia</li>
                  <li>• Acknowledge effort, not just outcomes</li>
                  <li>• Create opportunities for success</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">💚 Managing Frustration</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Remain patient and calm during difficulties</li>
                  <li>• Avoid criticism or showing frustration</li>
                  <li>• Recognize when a break is needed</li>
                  <li>• Use calming techniques (breathing, mindfulness)</li>
                  <li>• Validate feelings and experiences</li>
                  <li>• Seek professional support if mental health suffers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Accessing Support */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Accessing Support & Services (UK)</CardTitle>
                <CardDescription>Know your rights and available help</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">📋 Education Support</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span><strong>SEND Support:</strong> Schools must provide reasonable adjustments and support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span><strong>EHCP:</strong> For those with complex needs requiring statutory support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span><strong>SENDIASS:</strong> Free, impartial advice on SEN processes</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">💼 Work & Benefits</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span><strong>Access to Work:</strong> Funding for workplace adjustments & tech</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span><strong>Equality Act:</strong> Dyslexia is a protected disability; employers must make adjustments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span><strong>Benefits:</strong> May be eligible for PIP or other support depending on impact</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">🏥 Healthcare Support</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                    <span><strong>GP:</strong> Discuss assessment referrals and mental health support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                    <span><strong>Educational Psychologist:</strong> For formal dyslexia assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                    <span><strong>CAMHS/IAPT:</strong> Mental health services for anxiety/depression linked to dyslexia</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">👥 Carer Support</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                    <span><strong>Carers Assessment:</strong> Right to assessment of your needs by local authority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                    <span><strong>Respite Care:</strong> Short breaks and respite services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                    <span><strong>Carers UK:</strong> Advice, support, and community for carers</span>
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> You have rights as a carer. Don't hesitate to request assessments, advocate for the person you care for, and seek support for yourself.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>

      {/* Self-Care for Carers */}
      <section className="space-y-4">
        <Card className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50">
                <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Self-Care for Carers</CardTitle>
                <CardDescription>You can't pour from an empty cup</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Caring for yourself is not selfish.</strong> Looking after your own physical and mental health enables you to provide better support. You matter too.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg bg-white dark:bg-gray-900/50">
                <h4 className="font-semibold mb-3">💪 Physical Health</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Get enough sleep (7-9 hours)</li>
                  <li>• Eat regular, balanced meals</li>
                  <li>• Move your body daily</li>
                  <li>• Attend your own health appointments</li>
                  <li>• Manage your own health conditions</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-white dark:bg-gray-900/50">
                <h4 className="font-semibold mb-3">🧠 Mental Health</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Take regular breaks</li>
                  <li>• Connect with friends and family</li>
                  <li>• Pursue hobbies and interests</li>
                  <li>• Seek counseling if needed</li>
                  <li>• Practice mindfulness or breathing</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-white dark:bg-gray-900/50">
                <h4 className="font-semibold mb-3">🤝 Practical Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Request a Carers Assessment</li>
                  <li>• Access respite care</li>
                  <li>• Join carer support groups</li>
                  <li>• Share caring responsibilities</li>
                  <li>• Ask for help when needed</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">🌬️ Quick Breathing Exercise for Carers</h4>
              <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  When you feel stressed or overwhelmed, try this 60-second breathing technique:
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Sit comfortably and close your eyes</li>
                  <li>2. Breathe in slowly through your nose for 4 counts</li>
                  <li>3. Hold for 4 counts</li>
                  <li>4. Breathe out slowly for 6 counts</li>
                  <li>5. Repeat for 60 seconds or until you feel calmer</li>
                </ol>
                <Button size="sm" className="mt-3">Try Box Breathing Exercise</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Resources & Organizations */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Resources & Support Organizations</CardTitle>
                <CardDescription>Helpful links and downloadable guides</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Carer's Quick Guide (PDF)</div>
                  <div className="text-xs text-muted-foreground">Essential strategies for daily support</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Assistive Tech Setup Guide</div>
                  <div className="text-xs text-muted-foreground">How to set up helpful tools</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Advocacy Letter Templates</div>
                  <div className="text-xs text-muted-foreground">Request support & accommodations</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Self-Care Plan for Carers</div>
                  <div className="text-xs text-muted-foreground">Protect your own wellbeing</div>
                </div>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Recommended UK Organizations</h4>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Dyslexia Support</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><a href="https://www.bdadyslexia.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">• British Dyslexia Association</a></li>
                    <li><a href="https://www.dyslexiaaction.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">• Dyslexia Action</a></li>
                    <li><a href="https://www.nhs.uk/conditions/dyslexia/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">• NHS Dyslexia Information</a></li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Carer Support</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><a href="https://www.carersuk.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">• Carers UK</a></li>
                    <li><a href="https://www.nhs.uk/conditions/social-care-and-support-guide/support-and-benefits-for-carers/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">• NHS Carer Support</a></li>
                    <li><a href="https://www.gov.uk/carers-credit" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">• Carer's Allowance & Credits</a></li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Education & Work</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><a href="https://www.ipsea.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">• IPSEA (SEN Legal Advice)</a></li>
                    <li><a href="https://www.gov.uk/access-to-work" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">• Access to Work</a></li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Mental Health</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><a href="https://www.mind.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">• Mind (Mental Health Support)</a></li>
                    <li><a href="https://www.samaritans.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">• Samaritans (Crisis Support)</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <Alert>
              <Phone className="h-4 w-4" />
              <AlertDescription>
                <strong>Crisis Support:</strong> If you or the person you care for is in crisis, contact your GP, call 111 (NHS), or dial 999 in an emergency. Samaritans are available 24/7: 116 123.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>

    </main>
  );
}


