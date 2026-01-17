'use client'

import { GraduationCap, BookOpen, Download, Users, Brain, Heart, Wind, Sparkles, ChevronDown, AlertCircle, FileText, Video, Lightbulb, Target } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export default function SchoolsPage() {
  return (
    <main className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-6">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              School Tools & Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Evidence-based resources to support neurodivergent students and promote mental wellbeing in your classroom. 
              Quick packs, teaching strategies, and practical tools for educators.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#quick-pack">
                <Button size="lg" className="px-8">
                  <Download className="mr-2 h-5 w-5" />
                  Teacher Quick Pack
                </Button>
              </a>
              <a href="#resources">
                <Button size="lg" variant="outline" className="px-8">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Resources
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <Card className="p-8 bg-white/80 backdrop-blur">
            <h2 className="text-2xl font-bold text-center mb-8">Supporting Every Student</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1 in 7</div>
                <div className="text-sm text-muted-foreground">Children have a mental health condition</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15-20%</div>
                <div className="text-sm text-muted-foreground">Students are neurodivergent</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">80%</div>
                <div className="text-sm text-muted-foreground">Improvement with early intervention</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">You</div>
                <div className="text-sm text-muted-foreground">Make a difference every day</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Teacher Quick Pack Section */}
      <section id="quick-pack" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Download className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Teacher Quick Pack</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready-to-use resources for immediate classroom application. Print, share, and implement today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ADHD Quick Guide */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">ADHD Classroom Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Quick reference for supporting students with ADHD. Includes seating strategies, attention breaks, and behavior management tips.
              </p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ Attention & focus strategies</li>
                <li>✓ Classroom accommodations checklist</li>
                <li>✓ Movement breaks guide</li>
                <li>✓ Positive reinforcement tools</li>
              </ul>
              <Link href="/conditions/adhd">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Resource
                </Button>
              </Link>
            </Card>

            {/* Autism Quick Guide */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Autism Support Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Essential strategies for creating an autism-friendly classroom. Sensory considerations, communication tips, and transition supports.
              </p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ Visual schedules & supports</li>
                <li>✓ Sensory regulation strategies</li>
                <li>✓ Communication alternatives</li>
                <li>✓ Meltdown prevention & response</li>
              </ul>
              <Link href="/conditions/autism">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Resource
                </Button>
              </Link>
            </Card>

            {/* Anxiety Quick Guide */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-4">
                <Wind className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Anxiety Toolkit</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Practical tools for helping anxious students. Breathing exercises, worry management, and classroom accommodations.
              </p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ Quick breathing techniques</li>
                <li>✓ Grounding exercises (5-4-3-2-1)</li>
                <li>✓ Test anxiety strategies</li>
                <li>✓ Safe space guidelines</li>
              </ul>
              <Link href="/anxiety">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Resource
                </Button>
              </Link>
            </Card>

            {/* Dyslexia Quick Guide */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 p-3 rounded-lg inline-block mb-4">
                <BookOpen className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dyslexia Interventions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Reading support strategies and assistive technology recommendations. Multi-sensory approaches and assessment tools.
              </p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ Reading intervention strategies</li>
                <li>✓ Font & formatting guidelines</li>
                <li>✓ Assistive technology tools</li>
                <li>✓ Assessment accommodations</li>
              </ul>
              <Link href="/conditions/dyslexia">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Resource
                </Button>
              </Link>
            </Card>

            {/* Depression & Mood Quick Guide */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 p-3 rounded-lg inline-block mb-4">
                <Heart className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mental Health Awareness</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Recognizing depression, low mood, and emotional struggles. When and how to refer for additional support.
              </p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ Warning signs to watch for</li>
                <li>✓ Supportive conversations</li>
                <li>✓ Referral pathways</li>
                <li>✓ Crisis response protocols</li>
              </ul>
              <Link href="/tools/depression-tools">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Resource
                </Button>
              </Link>
            </Card>

            {/* Stress Management Quick Guide */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 p-3 rounded-lg inline-block mb-4">
                <Target className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Stress & Self-Regulation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Teaching students stress management and emotional regulation. Mindfulness, breathing, and coping strategies.
              </p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ Classroom breathing exercises</li>
                <li>✓ Sensory regulation breaks</li>
                <li>✓ Emotion identification tools</li>
                <li>✓ Coping skills curriculum</li>
              </ul>
              <Link href="/tools/stress-tools">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Resource
                </Button>
              </Link>
            </Card>
          </div>

          {/* Printable Classroom Posters */}
          <div className="mt-12">
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
              <h3 className="text-2xl font-bold mb-4 text-center">Printable Classroom Posters</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Breathing Techniques Poster</h4>
                  <p className="text-sm text-muted-foreground mb-3">Visual guide to 4-4-4 Box Breathing and 4-7-8 Technique</p>
                  <Link href="/breathing">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Access Tool
                    </Button>
                  </Link>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Emotion Zones Chart</h4>
                  <p className="text-sm text-muted-foreground mb-3">Help students identify and regulate emotions</p>
                  <Link href="/tools/mood-tools">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Access Tool
                    </Button>
                  </Link>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Grounding Exercise (5-4-3-2-1)</h4>
                  <p className="text-sm text-muted-foreground mb-3">Quick anxiety relief technique for classroom use</p>
                  <Link href="/anxiety">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Access Tool
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Comprehensive Resources Section */}
      <section id="resources" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Comprehensive Teacher Resources</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              In-depth guides, strategies, and professional development materials organized by condition and topic.
            </p>
          </div>

          <Tabs defaultValue="understanding" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-3xl mx-auto">
              <TabsTrigger value="understanding">Understanding</TabsTrigger>
              <TabsTrigger value="strategies">Classroom Strategies</TabsTrigger>
              <TabsTrigger value="professional">Professional Development</TabsTrigger>
            </TabsList>

            <TabsContent value="understanding" className="mt-8">
              <div className="space-y-4">
                {/* ADHD */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Brain className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-left">ADHD (Attention-Deficit/Hyperactivity Disorder)</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">What Teachers Need to Know</h4>
                          <p className="text-sm text-muted-foreground">
                            ADHD affects 5-7% of school-aged children. It's a neurodevelopmental condition impacting executive functions: 
                            attention, impulse control, working memory, and emotional regulation. <strong>Not</strong> caused by poor parenting or lack of discipline.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Classroom Manifestations</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong>Inattentive type:</strong> Difficulty sustaining attention, appears not listening, loses materials, forgetful</li>
                            <li>• <strong>Hyperactive-Impulsive type:</strong> Fidgeting, difficulty staying seated, interrupts, blurts out answers</li>
                            <li>• <strong>Combined type:</strong> Mix of both (most common)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Key Strategies</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong>Environmental modifications:</strong> Preferential seating (near teacher, away from distractions), minimize visual clutter</li>
                            <li>• <strong>Task breakdown:</strong> Chunk assignments, provide checklists, use visual timers</li>
                            <li>• <strong>Movement breaks:</strong> Allow fidget tools, standing desk options, scheduled "brain breaks"</li>
                            <li>• <strong>Positive reinforcement:</strong> Immediate, specific praise; token economy systems</li>
                            <li>• <strong>Executive function support:</strong> Teach organization, provide planners, use color-coding</li>
                          </ul>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Link href="/conditions/adhd">
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Full Guide
                            </Button>
                          </Link>
                          <Link href="/conditions/adhd-parent">
                            <Button variant="outline" size="sm">
                              <Users className="mr-2 h-4 w-4" />
                              Parent Resources
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Autism */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Sparkles className="h-6 w-6 text-purple-600" />
                        <h3 className="text-xl font-semibold text-left">Autism Spectrum Disorder (ASD)</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">What Teachers Need to Know</h4>
                          <p className="text-sm text-muted-foreground">
                            Autism affects 1-2% of children. It's a spectrum condition affecting social communication and featuring restricted/repetitive 
                            behaviors and interests. Every autistic student is unique—avoid assuming abilities or challenges based on diagnosis alone.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Common Characteristics (vary widely)</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Differences in social communication (eye contact, understanding social cues, literal language interpretation)</li>
                            <li>• Sensory sensitivities (lights, sounds, textures, smells)</li>
                            <li>• Need for routine and predictability; difficulty with transitions</li>
                            <li>• Intense interests or passions (can be leveraged for learning)</li>
                            <li>• Different processing speed (may need extra time)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Key Strategies</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong>Predictability:</strong> Visual schedules, advance notice of changes, consistent routines</li>
                            <li>• <strong>Sensory considerations:</strong> Quiet spaces available, allow headphones, fidget tools, movement breaks</li>
                            <li>• <strong>Communication supports:</strong> Visual instructions, extra processing time, alternative communication methods if needed</li>
                            <li>• <strong>Social skills:</strong> Explicitly teach social rules, provide social stories, structured peer interactions</li>
                            <li>• <strong>Strength-based approach:</strong> Leverage special interests, recognize different learning styles</li>
                          </ul>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Link href="/conditions/autism">
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Full Guide
                            </Button>
                          </Link>
                          <Link href="/conditions/autism-parent">
                            <Button variant="outline" size="sm">
                              <Users className="mr-2 h-4 w-4" />
                              Parent Resources
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Anxiety */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Wind className="h-6 w-6 text-green-600" />
                        <h3 className="text-xl font-semibold text-left">Anxiety Disorders</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">What Teachers Need to Know</h4>
                          <p className="text-sm text-muted-foreground">
                            Anxiety disorders affect 10-20% of school-aged children. Goes beyond normal worry—persistent, excessive fear 
                            interfering with learning and relationships. Types include generalized anxiety, social anxiety, panic disorder, and specific phobias.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Signs in the Classroom</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Frequent absences, school refusal, visits to nurse</li>
                            <li>• Perfectionism, excessive self-criticism, fear of mistakes</li>
                            <li>• Avoidance of presentations, group work, or performance situations</li>
                            <li>• Physical complaints (headaches, stomach aches) without medical cause</li>
                            <li>• Difficulty concentrating, appearing preoccupied</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Key Strategies</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong>Create predictability:</strong> Post daily schedule, give advance warning of changes/transitions</li>
                            <li>• <strong>Teach coping skills:</strong> Breathing exercises (4-4-4 Box Breathing), grounding techniques (5-4-3-2-1)</li>
                            <li>• <strong>Accommodate without enabling:</strong> Allow breaks, offer alternatives (present to teacher vs. class), but gently encourage facing fears</li>
                            <li>• <strong>Normalize mistakes:</strong> Model self-compassion, share your own mistakes, emphasize growth mindset</li>
                            <li>• <strong>Test accommodations:</strong> Extended time, quiet room, breaks as needed</li>
                          </ul>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Link href="/anxiety">
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Full Guide & Tools
                            </Button>
                          </Link>
                          <Link href="/breathing">
                            <Button variant="outline" size="sm">
                              <Wind className="mr-2 h-4 w-4" />
                              Breathing Exercises
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Dyslexia */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <BookOpen className="h-6 w-6 text-amber-600" />
                        <h3 className="text-xl font-semibold text-left">Dyslexia</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">What Teachers Need to Know</h4>
                          <p className="text-sm text-muted-foreground">
                            Dyslexia affects 5-10% of the population. It's a specific learning difficulty affecting reading accuracy, fluency, 
                            and spelling—despite adequate intelligence and instruction. Neurological in origin, often runs in families.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Classroom Indicators</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Slow, effortful reading; frequent errors (substitutions, omissions)</li>
                            <li>• Poor spelling, especially phonetic attempts</li>
                            <li>• Difficulty with phonemic awareness (rhyming, blending, segmenting sounds)</li>
                            <li>• Avoiding reading aloud, resistance to reading tasks</li>
                            <li>• Strong oral comprehension but weak reading comprehension (due to decoding difficulties)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Key Strategies</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong>Multi-sensory instruction:</strong> Orton-Gillingham approach, incorporate visual, auditory, kinesthetic learning</li>
                            <li>• <strong>Assistive technology:</strong> Text-to-speech (Immersive Reader, Read&Write), audiobooks, speech-to-text</li>
                            <li>• <strong>Font & formatting:</strong> Sans-serif fonts (Arial, Verdana), 12-14pt size, 1.5 line spacing, cream/off-white backgrounds</li>
                            <li>• <strong>Assessment accommodations:</strong> Extended time, read-aloud for non-reading assessments, oral responses</li>
                            <li>• <strong>Emphasize strengths:</strong> Many dyslexic students excel in creativity, problem-solving, big-picture thinking</li>
                          </ul>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Link href="/conditions/dyslexia">
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Full Guide
                            </Button>
                          </Link>
                          <Link href="/dyslexia-reading-training">
                            <Button variant="outline" size="sm">
                              <BookOpen className="mr-2 h-4 w-4" />
                              Reading Training
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Depression & Low Mood */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Heart className="h-6 w-6 text-indigo-600" />
                        <h3 className="text-xl font-semibold text-left">Depression & Low Mood</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">What Teachers Need to Know</h4>
                          <p className="text-sm text-muted-foreground">
                            Depression in children/teens often presents differently than in adults. About 2-3% of children and 6-8% of teens 
                            experience clinical depression. Can significantly impact academic performance and social relationships.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Warning Signs</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Persistent sad, irritable, or empty mood (in youth, often irritability)</li>
                            <li>• Loss of interest in activities previously enjoyed</li>
                            <li>• Decline in academic performance, difficulty concentrating</li>
                            <li>• Social withdrawal, isolation from peers</li>
                            <li>• Changes in energy, fatigue, or psychomotor agitation</li>
                            <li>• <strong className="text-red-600">Red flags:</strong> Mentions of self-harm, suicide, hopelessness, giving away possessions</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">How to Help</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong>Notice & reach out:</strong> Private conversation expressing concern, not judgment</li>
                            <li>• <strong>Listen & validate:</strong> Don't minimize feelings; avoid "just cheer up"</li>
                            <li>• <strong>Refer appropriately:</strong> School counselor, parent contact, crisis resources if needed</li>
                            <li>• <strong>Classroom supports:</strong> Flexibility with deadlines (when possible), check-ins, maintain connection</li>
                            <li>• <strong>Crisis protocol:</strong> If student mentions suicide/self-harm, DO NOT leave them alone; immediately contact school mental health professional</li>
                          </ul>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Link href="/tools/depression-tools">
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Full Guide & Tools
                            </Button>
                          </Link>
                          <Link href="/tools/mood-tools">
                            <Button variant="outline" size="sm">
                              <Heart className="mr-2 h-4 w-4" />
                              Mood Tools
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Sleep Issues */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-6 w-6 text-blue-600 text-xl">😴</div>
                        <h3 className="text-xl font-semibold text-left">Sleep Issues & Impact on Learning</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Why Sleep Matters for Learning</h4>
                          <p className="text-sm text-muted-foreground">
                            Sleep is critical for memory consolidation, attention, emotional regulation, and academic performance. 
                            School-aged children need 9-11 hours; teens need 8-10 hours. 50-70% of teens are chronically sleep-deprived.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Signs of Sleep Deprivation</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Difficulty waking, falling asleep in class</li>
                            <li>• Irritability, mood swings, emotional outbursts</li>
                            <li>• Poor concentration, memory difficulties</li>
                            <li>• Hyperactivity (especially in younger children—paradoxical response)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Teacher Strategies</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong>Educate students:</strong> Brief lessons on sleep's role in learning</li>
                            <li>• <strong>Later start times:</strong> Advocate for adolescent-appropriate school start times (not before 8:30am per AAP)</li>
                            <li>• <strong>Homework policies:</strong> Advocate for reasonable homework loads that don't interfere with sleep</li>
                            <li>• <strong>Classroom environment:</strong> Natural light when possible, movement breaks to combat drowsiness</li>
                          </ul>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Link href="/sleep">
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Sleep Resources
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Stress & Emotional Regulation */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Target className="h-6 w-6 text-teal-600" />
                        <h3 className="text-xl font-semibold text-left">Stress & Emotional Regulation</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Stress in Students</h4>
                          <p className="text-sm text-muted-foreground">
                            Academic pressure, social challenges, family issues, and developmental changes contribute to student stress. 
                            Teaching emotional regulation skills is as important as academic content.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Classroom Strategies for Emotional Regulation</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong>Calm corner/safe space:</strong> Designated area with sensory tools, breathing guides, calming activities</li>
                            <li>• <strong>Regular movement breaks:</strong> "Brain breaks" every 20-30 minutes; incorporate movement into lessons</li>
                            <li>• <strong>Breathing exercises:</strong> Start class with 2-minute breathing routine; teach techniques for test anxiety</li>
                            <li>• <strong>Emotion vocabulary:</strong> Teach "feelings words" beyond "good/bad"; use emotion charts/zones</li>
                            <li>• <strong>Mindfulness moments:</strong> Brief grounding exercises (5-4-3-2-1), gratitude practices</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Quick Classroom Breathing Exercise</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>4-4-4 Box Breathing</strong> (1-2 minutes):
                          </p>
                          <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
                            <li>Breathe in through nose for 4 counts</li>
                            <li>Hold for 4 counts</li>
                            <li>Breathe out through mouth for 4 counts</li>
                            <li>Hold for 4 counts</li>
                            <li>Repeat 3-5 times</li>
                          </ol>
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            Use before tests, after recess/PE, during transitions, or anytime students need to reset.
                          </p>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Link href="/tools/stress-tools">
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Full Stress Guide
                            </Button>
                          </Link>
                          <Link href="/breathing">
                            <Button variant="outline" size="sm">
                              <Wind className="mr-2 h-4 w-4" />
                              Breathing Exercises
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </div>
            </TabsContent>

            <TabsContent value="strategies" className="mt-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Universal Classroom Strategies</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                      Universal Design for Learning (UDL)
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      UDL principles benefit ALL students, including those with diagnosed conditions and those who struggle without formal identification.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">Multiple Means of Representation</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Present information visually AND verbally</li>
                          <li>• Provide text alternatives (captions, transcripts)</li>
                          <li>• Offer materials in multiple formats</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">Multiple Means of Action & Expression</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Allow choice in how students demonstrate learning</li>
                          <li>• Provide alternatives to written responses</li>
                          <li>• Use varied assessment methods</li>
                        </ul>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">Multiple Means of Engagement</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Offer choice in activities/topics</li>
                          <li>• Vary social groupings (individual, pair, group)</li>
                          <li>• Connect to student interests</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-teal-600" />
                      Behavior Management & Positive Discipline
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="text-sm"><strong>Proactive strategies:</strong> Clear expectations posted, visual schedules, predictable routines</p>
                      <p className="text-sm"><strong>Positive reinforcement:</strong> Catch students "being good," specific praise, reward systems</p>
                      <p className="text-sm"><strong>Restorative practices:</strong> Focus on relationship repair, understand behavior as communication</p>
                      <p className="text-sm"><strong>Trauma-informed approach:</strong> Recognize behavior may signal unmet needs or past trauma</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-indigo-600" />
                      Building Inclusive Classroom Culture
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                      <li>• <strong>Normalize differences:</strong> "Everyone learns differently; everyone's brain works uniquely"</li>
                      <li>• <strong>Accommodate openly:</strong> Normalizes accommodations so students don't feel singled out</li>
                      <li>• <strong>Teach empathy:</strong> Perspective-taking activities, literature featuring diverse characters</li>
                      <li>• <strong>Celebrate strengths:</strong> Find and highlight each student's talents</li>
                      <li>• <strong>Anti-bullying:</strong> Zero tolerance for mockery related to learning differences</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Sample Daily Schedule with Built-in Supports</h4>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                      <ol className="space-y-2 text-sm">
                        <li><strong>Morning:</strong> 2-minute breathing exercise to start day, visual schedule review</li>
                        <li><strong>Focused learning blocks:</strong> Chunk into 20-minute segments with brief brain breaks</li>
                        <li><strong>Mid-morning/afternoon:</strong> Structured movement break (GoNoodle, yoga, outdoor walk)</li>
                        <li><strong>Transition times:</strong> Use visual/auditory cues (timer, song), allow movement (stretching)</li>
                        <li><strong>End of day:</strong> Reflection/gratitude share, preview tomorrow's schedule</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="mt-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Professional Development & Support</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Professional Learning</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">Mental Health First Aid for Educators</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          Training to recognize and respond to mental health crises in students. Evidence-based program offered in many regions.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong>UK:</strong> Mental Health First Aid England | <strong>US:</strong> MHFA USA
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">Trauma-Informed Teaching Practices</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          Understanding how trauma affects learning and behavior; strategies for creating safe, supportive classrooms.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Resources: SAMHSA, Trauma and Learning Policy Initiative (TLPI)
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">Understanding Neurodiversity</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          Deep dive into autism, ADHD, dyslexia, and other neurodevelopmental differences from a strength-based perspective.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Resources: Neurodiversity Hub, Understood.org
                        </p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">Social-Emotional Learning (SEL) Implementation</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          Integrating SEL into academic instruction; explicit teaching of self-awareness, self-management, social awareness, relationship skills.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Resources: CASEL (Collaborative for Academic, Social, and Emotional Learning)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">External Resources & Organizations</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-600 pl-4">
                        <h5 className="font-semibold">Child Mind Institute</h5>
                        <p className="text-sm text-muted-foreground">Comprehensive teacher guides for ADHD, anxiety, autism, OCD, and more. Free downloadable resources.</p>
                        <p className="text-xs text-blue-600">childmind.org/topics/resources-for-teachers</p>
                      </div>
                      <div className="border-l-4 border-green-600 pl-4">
                        <h5 className="font-semibold">Understood.org</h5>
                        <p className="text-sm text-muted-foreground">US-based resource for learning and thinking differences. Teacher toolkit, IEP/504 guidance, classroom strategies.</p>
                        <p className="text-xs text-green-600">understood.org/en/for-educators</p>
                      </div>
                      <div className="border-l-4 border-purple-600 pl-4">
                        <h5 className="font-semibold">Autism Education Trust (UK)</h5>
                        <p className="text-sm text-muted-foreground">UK-specific autism training for educators, free online modules, classroom resources.</p>
                        <p className="text-xs text-purple-600">autismeducationtrust.org.uk</p>
                      </div>
                      <div className="border-l-4 border-amber-600 pl-4">
                        <h5 className="font-semibold">British Dyslexia Association (UK) / IDA (US)</h5>
                        <p className="text-sm text-muted-foreground">Dyslexia-specific teacher training, assessment guidance, classroom strategies.</p>
                        <p className="text-xs text-amber-600">bdadyslexia.org.uk | dyslexiaida.org</p>
                      </div>
                      <div className="border-l-4 border-red-600 pl-4">
                        <h5 className="font-semibold">MindEd (UK) / NAMI (US)</h5>
                        <p className="text-sm text-muted-foreground">Mental health education for educators. Free e-learning modules on recognizing and supporting student mental health.</p>
                        <p className="text-xs text-red-600">minded.org.uk | nami.org/Support-Education</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Teacher Self-Care</h4>
                    <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-6 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        <strong>You can't pour from an empty cup.</strong> Supporting students with diverse needs is rewarding but demanding. 
                        Burnout and compassion fatigue are real risks in education.
                      </p>
                      <h5 className="font-semibold mb-2">Self-Care Strategies:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Set boundaries: Establish work hours, limit email checking</li>
                        <li>• Peer support: Connect with colleagues, share strategies</li>
                        <li>• Professional supervision: Regular check-ins with leadership or counselor</li>
                        <li>• Breathing & mindfulness: Model what you teach—use the tools yourself</li>
                        <li>• Seek help when needed: Employee assistance programs, therapy</li>
                      </ul>
                      <div className="mt-4 flex gap-3">
                        <Link href="/tools/stress-tools">
                          <Button variant="outline" size="sm">
                            <Wind className="mr-2 h-4 w-4" />
                            Stress Management Tools
                          </Button>
                        </Link>
                        <Link href="/breathing">
                          <Button variant="outline" size="sm">
                            <Wind className="mr-2 h-4 w-4" />
                            Breathing Exercises
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Breathing Exercises for Classroom Use */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Wind className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Breathing Exercises for Classroom Use</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple, evidence-based breathing techniques to help students regulate emotions, reduce anxiety, and improve focus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">Box Breathing (4-4-4-4)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Best for:</strong> Focus, test anxiety, transitions
              </p>
              <ol className="text-sm space-y-2 mb-4 list-decimal list-inside">
                <li>Breathe in for 4 counts</li>
                <li>Hold for 4 counts</li>
                <li>Breathe out for 4 counts</li>
                <li>Hold for 4 counts</li>
                <li>Repeat 3-5 times</li>
              </ol>
              <Link href="/breathing">
                <Button variant="outline" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Try Interactive Version
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">4-7-8 Breathing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Best for:</strong> Anxiety, calming before rest time
              </p>
              <ol className="text-sm space-y-2 mb-4 list-decimal list-inside">
                <li>Breathe in through nose for 4</li>
                <li>Hold for 7 counts</li>
                <li>Breathe out slowly through mouth for 8</li>
                <li>Repeat 4 times</li>
              </ol>
              <Link href="/breathing">
                <Button variant="outline" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Try Interactive Version
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">Belly Breathing (Younger Students)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Best for:</strong> Elementary, simple calming
              </p>
              <ol className="text-sm space-y-2 mb-4 list-decimal list-inside">
                <li>Place hand on belly</li>
                <li>Breathe in through nose (belly expands)</li>
                <li>Breathe out through mouth (belly deflates)</li>
                <li>Imagine belly is a balloon</li>
                <li>Repeat 5 times</li>
              </ol>
              <Link href="/breathing">
                <Button variant="outline" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Try Interactive Version
                </Button>
              </Link>
            </Card>
          </div>

          <div className="mt-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50">
              <h3 className="text-xl font-bold mb-3 text-center">Implementation Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">When to Use:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Start of day/class to set calm tone</li>
                    <li>• Before tests or stressful activities</li>
                    <li>• After high-energy activities (recess, PE)</li>
                    <li>• During transitions</li>
                    <li>• When class energy is dysregulated</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Best Practices:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Model the breathing yourself</li>
                    <li>• Use visual cues (hand gestures, timers)</li>
                    <li>• Keep it brief (1-3 minutes)</li>
                    <li>• Make it routine (same time daily)</li>
                    <li>• Optional participation (never force)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Crisis Resources for Educators */}
      <section className="py-16 px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Crisis Response for Educators</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              What to do when a student is in crisis. Know your school's protocols and these general guidelines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-red-600">If Student Mentions Suicide or Self-Harm:</h3>
              <ol className="text-sm space-y-3 mb-4 list-decimal list-inside">
                <li><strong>DO NOT leave student alone</strong></li>
                <li><strong>Take it seriously—always</strong> (even if you think it's "attention-seeking")</li>
                <li><strong>Stay calm, listen without judgment</strong></li>
                <li><strong>Immediately notify:</strong> School counselor, psychologist, administrator, or designated mental health staff</li>
                <li><strong>Contact parent/guardian</strong> (typically done by counselor/admin)</li>
                <li><strong>Follow school safety protocol</strong></li>
              </ol>
              <div className="bg-red-100 border border-red-300 p-4 rounded-lg">
                <p className="text-sm font-semibold text-red-800">
                  ⚠️ You are not expected to be a therapist. Your role is to <em>notice, listen, and refer</em>.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-orange-600">Other Mental Health Concerns:</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Panic Attack:</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Move to quiet space if possible</li>
                    <li>• Reassure it will pass (usually 5-20 min)</li>
                    <li>• Guide through breathing (4-4-4)</li>
                    <li>• Don't leave student alone</li>
                    <li>• Contact school nurse/counselor</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Suspected Abuse/Neglect:</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• All educators are mandated reporters</li>
                    <li>• Report suspicions to designated person (principal, safeguarding lead)</li>
                    <li>• Document observations factually</li>
                    <li>• DO NOT investigate yourself</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Autism Meltdown:</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Reduce sensory input (lights, noise)</li>
                    <li>• Give space, remove audience</li>
                    <li>• Use calm, minimal language</li>
                    <li>• Safety first—prevent injury</li>
                    <li>• Debrief after student is calm (not during)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Crisis Hotlines (Share with Students/Parents)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">United Kingdom 🇬🇧</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Samaritans</strong><br />
                      📞 <a href="tel:116123" className="text-blue-600">116 123</a> (24/7, free)<br />
                      ✉️ <a href="mailto:jo@samaritans.org" className="text-blue-600">jo@samaritans.org</a>
                    </div>
                    <div>
                      <strong>Childline (under 19)</strong><br />
                      📞 <a href="tel:08001111" className="text-blue-600">0800 1111</a> (24/7, free)<br />
                      💬 Online chat available
                    </div>
                    <div>
                      <strong>SHOUT Crisis Text Line</strong><br />
                      📱 Text <strong>SHOUT</strong> to <strong>85258</strong> (24/7, free)
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">United States 🇺🇸</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>988 Suicide & Crisis Lifeline</strong><br />
                      📞 <a href="tel:988" className="text-blue-600">988</a> (24/7, free)<br />
                      💬 Chat at 988lifeline.org
                    </div>
                    <div>
                      <strong>Crisis Text Line</strong><br />
                      📱 Text <strong>HELLO</strong> to <strong>741741</strong> (24/7, free)
                    </div>
                    <div>
                      <strong>Trevor Project (LGBTQ+ youth)</strong><br />
                      📞 <a href="tel:1-866-488-7386" className="text-blue-600">1-866-488-7386</a><br />
                      📱 Text <strong>START</strong> to <strong>678-678</strong>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">Thank You, Educators</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your dedication to supporting every student—regardless of their challenges—makes a profound difference. 
              These resources are here to support you in that mission.
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Disclaimer:</strong> This platform provides educational information and tools for classroom use. 
              It is not a substitute for professional mental health services or special education assessment. 
              Always follow your school's referral protocols and consult with specialists when needed.
            </p>
            <p>
              Content based on evidence from NHS, NICE, Child Mind Institute, CHADD, Autism Education Trust, 
              British Dyslexia Association, IDA, Mental Health Foundation, and peer-reviewed research (2025).
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/contact">
              <Button variant="outline" size="sm">
                Contact Us
              </Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline" size="sm">
                More Resources
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
