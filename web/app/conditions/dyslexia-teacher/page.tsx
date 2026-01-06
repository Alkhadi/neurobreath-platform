import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, Brain, GraduationCap, Users, Target,
  FileText, Download, CheckCircle2, AlertCircle, 
  Lightbulb, ClipboardCheck, Award, BookMarked
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dyslexia Teacher Support Hub | NeuroBreath',
  description: 'Professional resources and evidence-based strategies for teachers supporting students with dyslexia.',
};

export default function DyslexiaTeacherPage() {
  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-8 sm:space-y-10 md:space-y-12" style={{ width: '86vw', maxWidth: '86vw' }}>
      
      {/* Hero Section */}
      <section className="space-y-6">
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardContent className="p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="space-y-4">
              <Badge className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                <GraduationCap className="w-4 h-4" />
                <span>Dyslexia Teacher Support Hub • NeuroBreath</span>
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Teaching Students with Dyslexia
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Evidence-based classroom strategies, assessment tools, and professional development resources to help every student with dyslexia reach their potential.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                <BookOpen className="w-5 h-5" />
                Classroom Strategies
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Assessment Tools
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Award className="w-5 h-5" />
                CPD Resources
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-5 h-5" />
                Printables
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-purple-200 dark:border-purple-800">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">Research-Backed</h3>
                  <p className="text-xs text-muted-foreground">Based on EEF, IDA & UK frameworks</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-purple-200 dark:border-purple-800">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">Practical & Actionable</h3>
                  <p className="text-xs text-muted-foreground">Ready-to-use classroom tools</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-purple-200 dark:border-purple-800">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">Inclusive Teaching</h3>
                  <p className="text-xs text-muted-foreground">Strategies benefit all learners</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Teacher Overview */}
      <section className="space-y-4">
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Understanding Dyslexia in the Classroom</CardTitle>
                <CardDescription>What every teacher should know</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Key Insight:</strong> Dyslexia affects 10-15% of students and is not related to intelligence or effort. With appropriate teaching and accommodations, students with dyslexia can excel academically.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-white dark:bg-gray-900/50 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Common Classroom Challenges
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Slow, effortful reading despite good oral skills</li>
                  <li>• Poor spelling and inconsistent errors</li>
                  <li>• Difficulty copying from board</li>
                  <li>• Slow written output</li>
                  <li>• Trouble with phonics and decoding</li>
                  <li>• Difficulty following written instructions</li>
                  <li>• Avoidance of reading/writing tasks</li>
                  <li>• Low self-esteem around literacy</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-gray-900/50 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  What Teachers Can Do
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use structured, systematic phonics instruction</li>
                  <li>• Provide multi-sensory learning experiences</li>
                  <li>• Allow extra time for reading/writing</li>
                  <li>• Use assistive technology</li>
                  <li>• Break tasks into manageable steps</li>
                  <li>• Offer alternative ways to demonstrate knowledge</li>
                  <li>• Focus on content understanding, not just spelling</li>
                  <li>• Build confidence and celebrate progress</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Classroom Strategies */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Evidence-Based Classroom Strategies</CardTitle>
                <CardDescription>Practical techniques for daily teaching</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="reading" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="reading">Reading</TabsTrigger>
                <TabsTrigger value="writing">Writing</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="tech">Technology</TabsTrigger>
                <TabsTrigger value="environment">Environment</TabsTrigger>
              </TabsList>

              <TabsContent value="reading" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Reading Instruction & Support</h4>
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <h5 className="font-medium mb-2">📚 Structured Literacy Approach</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use systematic, explicit phonics instruction. Teach letter-sound relationships sequentially with plenty of practice and revision.
                      </p>
                      <Badge variant="outline">Evidence Level: Strong (EEF)</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🎧 Pre-Reading Support</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Preview texts before reading, pre-teach key vocabulary, provide audio versions, and offer visual aids/summaries.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🔄 Repeated Reading</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Have students re-read the same text multiple times to build fluency and confidence. Use paired reading with peers or adults.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">📖 Dyslexia-Friendly Texts</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use larger fonts (12-14pt), sans-serif fonts, cream/pastel backgrounds, wider spacing, shorter lines, and clear formatting.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="writing" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Writing Support Strategies</h4>
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                      <h5 className="font-medium mb-2">✍️ Reduce Writing Barriers</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Allow typing, use of scribe, speech-to-text, shorter written answers, or oral presentations as alternatives.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🗺️ Graphic Organizers</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Provide mind maps, story planners, writing frames, and visual templates to structure thoughts before writing.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">📝 Focus on Content First</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Separate content generation from editing. Don't penalize spelling/grammar in drafts. Assess ideas and understanding.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🎯 Break It Down</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Chunk writing tasks into smaller steps with clear deadlines. Provide exemplars and model the writing process.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="assessment" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Assessment Accommodations</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">⏱️ Extra Time</h5>
                      <p className="text-sm text-muted-foreground">
                        25-50% extra time for reading and writing tasks. Essential for students with dyslexia.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">🎧 Reader/Read Aloud</h5>
                      <p className="text-sm text-muted-foreground">
                        Read questions aloud, provide audio versions, or allow text-to-speech for assessments.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">💻 Use of Technology</h5>
                      <p className="text-sm text-muted-foreground">
                        Allow laptop/computer use, spell-check, word prediction, and speech-to-text.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">📋 Alternative Formats</h5>
                      <p className="text-sm text-muted-foreground">
                        Oral exams, presentations, practical demonstrations, or reduced written requirements.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">✏️ Scribe/Transcript</h5>
                      <p className="text-sm text-muted-foreground">
                        Provide a scribe for longer written exams or allow dictation of answers.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <h5 className="font-medium mb-2">📄 Modified Papers</h5>
                      <p className="text-sm text-muted-foreground">
                        Larger font, cream paper, simplified wording, fewer questions per page.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tech" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Assistive Technology Tools</h4>
                  <div className="grid gap-3">
                    <div className="p-4 border rounded-lg bg-cyan-50 dark:bg-cyan-950/20">
                      <h5 className="font-medium mb-2">🎤 Text-to-Speech (TTS)</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Software reads text aloud. Helpful for reading assignments, instructions, and assessments.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Examples: Immersive Reader (Office 365), Read&Write, Natural Reader, Voice Dream Reader
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-cyan-50 dark:bg-cyan-950/20">
                      <h5 className="font-medium mb-2">🗣️ Speech-to-Text (STT)</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Converts spoken words to written text. Great for writing assignments and note-taking.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Examples: Dragon NaturallySpeaking, Google Voice Typing, Apple Dictation, Windows Speech Recognition
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🔤 Word Prediction</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Software suggests words as student types. Reduces spelling errors and speeds up writing.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Examples: Read&Write, Co:Writer, Grammarly
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">📚 Digital Textbooks & Audiobooks</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        E-books with adjustable fonts, colors, and TTS. Audiobooks for literature and content learning.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Examples: Learning Ally, Bookshare, Audible, RNIB Bookshare
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🗂️ Organization Tools</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Mind mapping, note-taking, and planning apps help structure thoughts and assignments.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Examples: Inspiration, MindMeister, OneNote, Notion
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="environment" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Creating a Dyslexia-Friendly Classroom</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">🪑 Seating & Environment</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Seat near the front for clear board view</li>
                        <li>• Minimize distractions</li>
                        <li>• Good lighting (avoid glare)</li>
                        <li>• Quiet workspace available for tests</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">📊 Visual Supports</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Visual timetables and schedules</li>
                        <li>• Color-coding for organization</li>
                        <li>• Wall displays with key info</li>
                        <li>• Clear, large labels</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">📝 Instructions & Delivery</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Give verbal AND written instructions</li>
                        <li>• Break down into small steps</li>
                        <li>• Check understanding individually</li>
                        <li>• Repeat and rephrase as needed</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">💪 Building Confidence</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Celebrate effort and progress</li>
                        <li>• Avoid reading aloud in class</li>
                        <li>• Provide advance notice for tasks</li>
                        <li>• Highlight strengths & talents</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* SEND Support & IEP */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                <ClipboardCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">SEND Support & Documentation (UK)</CardTitle>
                <CardDescription>Working within the SEND framework</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">📋 SEN Support</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Most students with dyslexia receive support through SEN Support (previously School Action/School Action Plus).
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Assess – Plan – Do – Review cycle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Individual Education Plan (IEP) or support plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Regular reviews with parents & SENCO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Targeted interventions and accommodations</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">📄 Education, Health and Care Plan (EHCP)</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  For students with more complex or severe needs requiring specialist support.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Statutory assessment process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Detailed support plan with specific provision</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Annual reviews and monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Access to additional funding/resources</span>
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Key Resource:</strong> The SEND Code of Practice provides statutory guidance on duties, policies and procedures. All teachers should be familiar with their school's SEND policy and the graduated approach.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>

      {/* Professional Development */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Professional Development</CardTitle>
                <CardDescription>CPD opportunities and recommended training</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">🎓 Recommended UK Training</h4>
                <ul className="space-y-2 text-sm">
                  <li className="border-b pb-2">
                    <strong>British Dyslexia Association (BDA)</strong>
                    <p className="text-muted-foreground text-xs">Accredited training for teachers and SENCOs</p>
                  </li>
                  <li className="border-b pb-2">
                    <strong>Dyslexia Action</strong>
                    <p className="text-muted-foreground text-xs">OCR accredited courses and specialist training</p>
                  </li>
                  <li className="border-b pb-2">
                    <strong>Education Endowment Foundation (EEF)</strong>
                    <p className="text-muted-foreground text-xs">Evidence-based guidance on literacy & SEND</p>
                  </li>
                  <li>
                    <strong>Specialist Teacher Training</strong>
                    <p className="text-muted-foreground text-xs">AMBDA, OCR Level 5/7 qualifications</p>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">📚 Essential Reading</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <em>Overcoming Dyslexia</em> by Sally Shaywitz</li>
                  <li>• <em>The Dyslexia Debate</em> by Elliott & Grigorenko</li>
                  <li>• <em>Phonics from A to Z</em> by Wiley Blevins</li>
                  <li>• EEF Special Educational Needs in Mainstream Schools guidance</li>
                  <li>• Rose Review (2009) – UK dyslexia identification</li>
                  <li>• SEND Code of Practice 0-25 years</li>
                </ul>
              </div>
            </div>
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
                <CardTitle className="text-2xl">Teacher Resources</CardTitle>
                <CardDescription>Downloadable guides and templates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Classroom Accommodations Checklist</div>
                  <div className="text-xs text-muted-foreground">Quick reference for daily support</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">IEP Goals & Objectives Bank</div>
                  <div className="text-xs text-muted-foreground">Sample goals for literacy support</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Parent Communication Templates</div>
                  <div className="text-xs text-muted-foreground">Letters and meeting forms</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start gap-3 h-auto p-4">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Reading Progress Tracker</div>
                  <div className="text-xs text-muted-foreground">Monitor fluency and comprehension</div>
                </div>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Useful UK Organizations</h4>
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <a href="https://www.bdadyslexia.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  • British Dyslexia Association (BDA)
                </a>
                <a href="https://www.patossdyslexia.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  • PATOSS (Professional Association)
                </a>
                <a href="https://educationendowmentfoundation.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  • Education Endowment Foundation
                </a>
                <a href="https://www.nasen.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  • NASEN (Special Educational Needs)
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

    </main>
  );
}


