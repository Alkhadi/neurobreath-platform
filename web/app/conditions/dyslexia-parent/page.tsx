import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, Brain, Heart, Home, School, Users, 
  FileText, Download, CheckCircle2, AlertCircle, 
  Lightbulb, Target, TrendingUp, Award
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dyslexia Parent Support Hub | NeuroBreath',
  description: 'Comprehensive support and resources for parents of children with dyslexia. Evidence-based strategies, tools, and guidance.',
};

export default function DyslexiaParentPage() {
  return (
    <main className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px]">
      
      {/* Hero Section */}
      <section className="space-y-6">
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardContent className="p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="space-y-4">
              <Badge className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                <Brain className="w-4 h-4" />
                <span>Dyslexia Parent Support Hub • NeuroBreath</span>
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Supporting Your Child with Dyslexia
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Everything parents need to help their child thrive with dyslexia. Evidence-based strategies, home activities, school communication tools, and a supportive community.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                <BookOpen className="w-5 h-5" />
                Quick Start Guide
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <School className="w-5 h-5" />
                School Support
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Heart className="w-5 h-5" />
                Emotional Support
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-5 h-5" />
                Resources
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-blue-200 dark:border-blue-800">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">Evidence-Based</h3>
                  <p className="text-xs text-muted-foreground">Backed by NHS & research institutions</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-blue-200 dark:border-blue-800">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">Parent Community</h3>
                  <p className="text-xs text-muted-foreground">Connect with other parents</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-blue-200 dark:border-blue-800">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">Practical Tools</h3>
                  <p className="text-xs text-muted-foreground">Ready-to-use activities & templates</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Parent Overview */}
      <section className="space-y-4">
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">You're Not Alone</CardTitle>
                <CardDescription>Understanding your journey as a parent</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Remember:</strong> Dyslexia is not related to intelligence. With the right support, children with dyslexia can excel academically and in life. Many successful people have dyslexia, including entrepreneurs, artists, and scientists.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-white dark:bg-gray-900/50 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  What Parents Can Do
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Create a supportive, stress-free learning environment</li>
                  <li>• Focus on strengths and celebrate small wins</li>
                  <li>• Communicate regularly with teachers</li>
                  <li>• Advocate for appropriate accommodations</li>
                  <li>• Use multi-sensory learning techniques</li>
                  <li>• Build confidence and resilience</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-gray-900/50 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Key Focus Areas
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Early identification and intervention</li>
                  <li>• Structured literacy instruction</li>
                  <li>• Homework support strategies</li>
                  <li>• Emotional well-being</li>
                  <li>• Technology tools & assistive tech</li>
                  <li>• Building independence</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Home Strategies */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Home Learning Strategies</CardTitle>
                <CardDescription>Evidence-based techniques for home practice</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="reading" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="reading">Reading</TabsTrigger>
                <TabsTrigger value="writing">Writing</TabsTrigger>
                <TabsTrigger value="homework">Homework</TabsTrigger>
                <TabsTrigger value="confidence">Confidence</TabsTrigger>
              </TabsList>

              <TabsContent value="reading" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Multi-Sensory Reading Techniques</h4>
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">📖 Shared Reading</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Read together daily for 15-20 minutes. Let your child choose books that interest them, even if they're "too easy."
                      </p>
                      <Badge variant="outline">Ages 4-12</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🎵 Phonics Games</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use rhyming games, sound matching, and letter-sound activities. Make it fun and multi-sensory.
                      </p>
                      <Badge variant="outline">Ages 4-8</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🎧 Audiobooks</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use audiobooks while following along with the text to build comprehension and vocabulary.
                      </p>
                      <Badge variant="outline">All Ages</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="writing" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Supporting Writing Development</h4>
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">✍️ Multisensory Writing</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Try writing in sand, shaving cream, or on textured surfaces. Use finger tracing before pencil writing.
                      </p>
                      <Badge variant="outline">Ages 4-10</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">💻 Assistive Technology</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use speech-to-text, word prediction software, and typing tools to reduce writing barriers.
                      </p>
                      <Badge variant="outline">Ages 7+</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">📝 Graphic Organizers</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use mind maps, story planners, and visual templates to organize thoughts before writing.
                      </p>
                      <Badge variant="outline">Ages 8+</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="homework" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Homework Support Tips</h4>
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <h5 className="font-medium mb-2">🕐 Break It Down</h5>
                      <p className="text-sm text-muted-foreground">
                        Divide homework into smaller chunks with breaks. Use timers for focused work periods (10-15 min).
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">🎯 Reduce Writing Load</h5>
                      <p className="text-sm text-muted-foreground">
                        Ask teachers if your child can give verbal answers, use a scribe, or type instead of handwrite.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                      <h5 className="font-medium mb-2">📚 Reading Aloud</h5>
                      <p className="text-sm text-muted-foreground">
                        Read instructions and questions aloud. Use text-to-speech for longer reading assignments.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
                      <h5 className="font-medium mb-2">💪 Build Stamina Gradually</h5>
                      <p className="text-sm text-muted-foreground">
                        Start with short sessions and gradually increase. Quality over quantity.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="confidence" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Building Confidence & Resilience</h4>
                  <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <Heart className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Emotional support is crucial.</strong> Children with dyslexia may feel frustrated, anxious, or have low self-esteem. Your encouragement matters.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">✨ Celebrate Strengths</h5>
                      <p className="text-sm text-muted-foreground">
                        Highlight what your child is good at: art, sports, creativity, problem-solving, empathy.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🎯 Set Achievable Goals</h5>
                      <p className="text-sm text-muted-foreground">
                        Break larger goals into small, achievable steps. Celebrate progress, not perfection.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">💬 Open Communication</h5>
                      <p className="text-sm text-muted-foreground">
                        Talk openly about dyslexia. Help your child understand it's not their fault and they can succeed.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">👥 Role Models</h5>
                      <p className="text-sm text-muted-foreground">
                        Share stories of successful people with dyslexia: Richard Branson, Steven Spielberg, etc.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* School Collaboration */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <School className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Working with School</CardTitle>
                <CardDescription>How to advocate and collaborate effectively</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">📋 Request These Accommodations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Extra time on tests and assignments</li>
                  <li>✓ Audio format for reading materials</li>
                  <li>✓ Use of assistive technology</li>
                  <li>✓ Reduced reading/writing load</li>
                  <li>✓ Alternative assessment formats</li>
                  <li>✓ Access to notes/materials in advance</li>
                  <li>✓ Preferential seating</li>
                  <li>✓ Break tasks into smaller steps</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">💬 Communication Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Schedule regular check-ins with teachers</li>
                  <li>• Share what works at home</li>
                  <li>• Ask for written summaries of meetings</li>
                  <li>• Keep records of all communications</li>
                  <li>• Be specific about your child's needs</li>
                  <li>• Approach collaboratively, not confrontationally</li>
                  <li>• Ask about school's dyslexia support</li>
                  <li>• Request formal assessment if needed</li>
                </ul>
              </div>
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>UK Parents:</strong> Your child may be entitled to SEN Support or an Education, Health and Care Plan (EHCP). Contact your school's SENCO (Special Educational Needs Coordinator) to discuss support.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>

      {/* Age-Specific Guidance */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Age-Specific Guidance</CardTitle>
            <CardDescription>Tailored support for different developmental stages</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="early" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="early">Early Years</TabsTrigger>
                <TabsTrigger value="primary">Primary</TabsTrigger>
                <TabsTrigger value="secondary">Secondary</TabsTrigger>
                <TabsTrigger value="teens">Teens</TabsTrigger>
              </TabsList>

              <TabsContent value="early" className="space-y-4 mt-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Ages 3-5: Early Signs & Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Early identification can lead to earlier intervention. Look for these potential signs:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Late talking or unclear speech</li>
                    <li>• Difficulty learning nursery rhymes</li>
                    <li>• Problems with rhyming</li>
                    <li>• Difficulty following multi-step instructions</li>
                    <li>• Struggles to recognize letters or write name</li>
                  </ul>
                  <p className="text-sm mt-3">
                    <strong>What helps:</strong> Read together daily, play rhyming games, practice letter sounds, use multi-sensory activities.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="primary" className="space-y-4 mt-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Ages 5-11: Primary School Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    This is when dyslexia often becomes more apparent. Key focus areas:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Structured literacy intervention (phonics-based)</li>
                    <li>• Build reading fluency with repeated reading</li>
                    <li>• Use audiobooks and text-to-speech</li>
                    <li>• Teach keyboarding skills early</li>
                    <li>• Focus on comprehension, not just decoding</li>
                  </ul>
                  <p className="text-sm mt-3">
                    <strong>School support:</strong> Request assessment for SEN Support, ask about phonics programs, explore dyslexia-friendly teaching.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="secondary" className="space-y-4 mt-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Ages 11-14: Secondary School Transition</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Secondary school brings new challenges: more reading, more subjects, more writing. Support strategies:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Maximize assistive technology use</li>
                    <li>• Teach study and organization skills</li>
                    <li>• Ensure exam access arrangements are in place</li>
                    <li>• Support note-taking (use of laptop, copies of notes)</li>
                    <li>• Advocate for appropriate accommodations</li>
                  </ul>
                  <p className="text-sm mt-3">
                    <strong>Focus on:</strong> Building independence, self-advocacy skills, and recognizing strengths beyond literacy.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="teens" className="space-y-4 mt-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Ages 14+: GCSEs, A-Levels & Beyond</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Exam years require careful planning. Essential support:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Apply for exam access arrangements (extra time, reader, scribe, computer)</li>
                    <li>• Use mind maps and visual study aids</li>
                    <li>• Leverage assistive tech fully</li>
                    <li>• Break revision into manageable chunks</li>
                    <li>• Explore vocational and apprenticeship routes if appropriate</li>
                  </ul>
                  <p className="text-sm mt-3">
                    <strong>Future planning:</strong> Discuss university/college support (DSA funding), career paths that suit strengths, self-advocacy.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Resources & Downloads */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Resources & Downloads</CardTitle>
                <CardDescription>Printable guides and useful links</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Parent Quick Guide (PDF)</div>
                  <div className="text-xs text-muted-foreground">Essential tips for supporting at home</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">School Meeting Template (PDF)</div>
                  <div className="text-xs text-muted-foreground">Prepare for parent-teacher meetings</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Accommodation Request Letter</div>
                  <div className="text-xs text-muted-foreground">Template for requesting support</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Homework Help Strategies</div>
                  <div className="text-xs text-muted-foreground">Practical tips for homework time</div>
                </div>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Recommended UK Organizations</h4>
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <a href="https://www.bdadyslexia.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  • British Dyslexia Association
                </a>
                <a href="https://www.nhs.uk/conditions/dyslexia/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  • NHS Dyslexia Information
                </a>
                <a href="https://www.dyslexiaaction.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  • Dyslexia Action
                </a>
                <a href="https://www.ipsea.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  • IPSEA (SEN Legal Advice)
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Breathing for Regulation */}
      <section className="space-y-4">
        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/50">
                <TrendingUp className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Breathing for Calm & Focus</CardTitle>
                <CardDescription>Help your child regulate stress and anxiety</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Children with dyslexia may experience stress, anxiety, or frustration around reading and school. Simple breathing exercises can help regulate emotions and improve focus.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg bg-white dark:bg-gray-900/50">
                <h4 className="font-semibold mb-2">🟦 Box Breathing</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Breathe in for 4, hold for 4, out for 4, hold for 4. Great for calming before homework or tests.
                </p>
                <Button size="sm" className="w-full">Try Now</Button>
              </div>

              <div className="p-4 border rounded-lg bg-white dark:bg-gray-900/50">
                <h4 className="font-semibold mb-2">🟪 4-7-8 Breathing</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Breathe in for 4, hold for 7, out for 8. Perfect for bedtime relaxation.
                </p>
                <Button size="sm" className="w-full">Try Now</Button>
              </div>

              <div className="p-4 border rounded-lg bg-white dark:bg-gray-900/50">
                <h4 className="font-semibold mb-2">🆘 SOS-60</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  60-second emergency calm technique for meltdowns or overwhelm.
                </p>
                <Button size="sm" className="w-full">Try Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

    </main>
  );
}


