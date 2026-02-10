'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Zap, Target, Heart, Shield, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StressManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500/10 to-red-500/10 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <Zap className="h-8 w-8 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Stress Management</h1>
              <p className="text-lg text-slate-700 mb-4">
                Practical tools and techniques to manage daily stress and prevent overwhelm
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Neurodivergent Impact</div>
                  <div className="text-lg font-bold text-orange-600">2-3x Higher</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Recovery Time</div>
                  <div className="text-lg font-bold text-orange-600">5-10 min</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Daily Practice</div>
                  <div className="text-lg font-bold text-orange-600">3-5 min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="text-xs sm:text-base">
                Overview
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs sm:text-base">
                Tools
              </TabsTrigger>
              <TabsTrigger value="tracking" className="text-xs sm:text-base">
                Tracking
              </TabsTrigger>
              <TabsTrigger value="evidence" className="text-xs sm:text-base">
                Evidence
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What is Stress?</CardTitle>
                    <CardDescription>Understanding your stress response</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">
                      Stress is your body's response to demands. While short-term stress can be helpful, chronic stress can impact your:
                    </p>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex gap-3">
                        <Heart className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <span>Physical health (sleep, digestion, immune system)</span>
                      </li>
                      <li className="flex gap-3">
                        <Target className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <span>Focus and concentration</span>
                      </li>
                      <li className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <span>Emotional regulation</span>
                      </li>
                      <li className="flex gap-3">
                        <Shield className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <span>Sensory sensitivity (neurodivergent individuals)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Why Neurodivergent People Experience More Stress</CardTitle>
                    <CardDescription>The neurodivergent stress cycle</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-slate-900 mb-3">Common Stress Triggers:</h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Sensory overload (noise, lights, crowds)</li>
                        <li>• Switching between tasks (context switching)</li>
                        <li>• Social expectations and masking</li>
                        <li>• Executive function demands</li>
                        <li>• Unpredictability and change</li>
                        <li>• Time pressure and deadlines</li>
                        <li>• Perfectionism and high standards</li>
                      </ul>
                    </div>
                    <p className="text-slate-600 text-sm">
                      <strong>The difference:</strong> Neurodivergent individuals often process information differently, making regular tasks more resource-intensive. This creates an invisible but real stress load.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Early Warning Signs</CardTitle>
                    <CardDescription>Recognize stress before it builds up</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">Physical Signs</h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          <li>• Tension (jaw, shoulders)</li>
                          <li>• Faster breathing</li>
                          <li>• Difficulty sleeping</li>
                          <li>• Stomach issues</li>
                        </ul>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">Behavioral Signs</h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          <li>• Increased stimming</li>
                          <li>• Irritability</li>
                          <li>• Withdrawal</li>
                          <li>• Difficulty starting tasks</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Immediate Stress Relief (0-5 minutes)</CardTitle>
                    <CardDescription>Quick resets you can do right now</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-orange-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Box Breathing</h4>
                        <p className="text-sm text-slate-600 mt-1">Breathe in for 4, hold for 4, breathe out for 4, hold for 4. Repeat 5 times.</p>
                        <Link href="/techniques/box-breathing">
                          <Button variant="link" className="mt-2 p-0 h-auto">
                            Try box breathing →
                          </Button>
                        </Link>
                      </div>

                      <div className="border-l-4 border-orange-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">5-4-3-2-1 Grounding</h4>
                        <p className="text-sm text-slate-600 mt-1">Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.</p>
                        <Link href="/tools/stress-tools">
                          <Button variant="link" className="mt-2 p-0 h-auto">
                            Learn grounding techniques →
                          </Button>
                        </Link>
                      </div>

                      <div className="border-l-4 border-orange-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Cold Water Shock</h4>
                        <p className="text-sm text-slate-600 mt-1">Splash cold water on your face or hold ice cubes. Triggers vagal response to calm nervous system.</p>
                      </div>

                      <div className="border-l-4 border-orange-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Movement Reset</h4>
                        <p className="text-sm text-slate-600 mt-1">Jump, shake out limbs, dance for 30-60 seconds. Releases tension and redirects stress energy.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Short-term Stress Management (5-30 minutes)</CardTitle>
                    <CardDescription>Building resilience throughout the day</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Strategic Breaks</h4>
                        <p className="text-sm text-slate-600 mt-1">Take a 5-10 minute break every 30-50 minutes of focused work. Use Pomodoro or similar techniques.</p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Sensory Management</h4>
                        <p className="text-sm text-slate-600 mt-1">Use headphones, dim lights, or go to a quiet space. Reduce sensory input = reduce stress.</p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Physical Activity</h4>
                        <p className="text-sm text-slate-600 mt-1">Walk, stretch, or do light exercise. Physical activity processes stress hormones.</p>
                        <Link href="/breathing">
                          <Button variant="link" className="mt-2 p-0 h-auto">
                            Explore breathing and movement tools →
                          </Button>
                        </Link>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Social Connection</h4>
                        <p className="text-sm text-slate-600 mt-1">Talk to someone, join a community, or reach out. Connection reduces stress perception.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Long-term Stress Prevention</CardTitle>
                    <CardDescription>Building a resilient lifestyle</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex gap-3">
                        <Clock className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <span>Maintain regular sleep schedule (most effective)</span>
                      </li>
                      <li className="flex gap-3">
                        <Heart className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <span>Eat regular, nourishing meals</span>
                      </li>
                      <li className="flex gap-3">
                        <Target className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <span>Exercise regularly (20-30 min, 3-5x per week)</span>
                      </li>
                      <li className="flex gap-3">
                        <Shield className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <span>Identify and reduce triggers where possible</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <span>Practice saying "no" to protect energy</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tracking Tab */}
            <TabsContent value="tracking">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Track Your Stress Levels</CardTitle>
                    <CardDescription>Understanding your personal stress patterns</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-3">Daily Stress Tracker</h4>
                      <div className="space-y-2 text-sm text-slate-700">
                        <p><strong>Rate your stress level:</strong> 1-10 scale</p>
                        <p><strong>Triggers identified:</strong> What caused the stress?</p>
                        <p><strong>Tools used:</strong> What helped?</p>
                        <p><strong>Effectiveness:</strong> Did it help?</p>
                      </div>
                      <Link href="/progress">
                        <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                          Track stress in NeuroBreath
                        </Button>
                      </Link>
                    </div>

                    <Card className="border-orange-200 bg-orange-50">
                      <CardHeader>
                        <CardTitle className="text-base">Weekly Review</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-slate-700">
                        <p>Look for patterns:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Most stressful times of day/week</li>
                          <li>Common triggers</li>
                          <li>Most effective tools</li>
                          <li>Recovery time needed</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Stress Recovery Goals</CardTitle>
                    <CardDescription>Setting realistic targets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <p className="font-semibold text-slate-900">Week 1-2</p>
                        <p className="text-sm text-slate-600">Identify 2-3 triggers and 1 tool that works for you</p>
                      </div>
                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <p className="font-semibold text-slate-900">Week 3-4</p>
                        <p className="text-sm text-slate-600">Use your chosen tool daily, even when not stressed</p>
                      </div>
                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <p className="font-semibold text-slate-900">Month 2+</p>
                        <p className="text-sm text-slate-600">Build a toolkit with 3-5 different techniques</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Evidence Tab */}
            <TabsContent value="evidence">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Evidence-Based Approaches</CardTitle>
                    <CardDescription>What research shows about stress management</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-slate-900">Breathing Techniques</h4>
                        <p className="text-sm text-slate-600 mt-1">Research shows breathing exercises activate the vagus nerve, reducing cortisol and promoting the parasympathetic response.</p>
                        <p className="text-xs text-slate-500 mt-2">Source: Multiple studies on vagal tone and stress reduction</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-slate-900">Grounding Techniques</h4>
                        <p className="text-sm text-slate-600 mt-1">The 5-4-3-2-1 technique, also known as sensory grounding, helps redirect attention away from anxiety to the present moment.</p>
                        <p className="text-xs text-slate-500 mt-2">Source: Cognitive behavioral therapy research</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-slate-900">Physical Activity</h4>
                        <p className="text-sm text-slate-600 mt-1">Exercise reduces stress hormones like cortisol and adrenaline while releasing endorphins.</p>
                        <p className="text-xs text-slate-500 mt-2">Source: American Heart Association, CDC guidelines</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-slate-900">Sleep & Stress Recovery</h4>
                        <p className="text-sm text-slate-600 mt-1">Quality sleep is the most effective stress management tool. Sleep deprivation increases stress sensitivity.</p>
                        <p className="text-xs text-slate-500 mt-2">Source: Sleep Foundation, NIH research</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-slate-900">Neurodivergent Considerations</h4>
                        <p className="text-sm text-slate-600 mt-1">Autistic and ADHD individuals show different stress response patterns and may need modified approaches to stress management.</p>
                        <p className="text-xs text-slate-500 mt-2">Source: Autism research, ADHD clinical guidelines</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resources & Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/contact">
                      <Button variant="outline" className="w-full justify-start">
                        Contact our team for professional support
                      </Button>
                    </Link>
                    <Link href="/conditions">
                      <Button variant="outline" className="w-full justify-start">
                        Explore other mental health topics
                      </Button>
                    </Link>
                    <Link href="/tools/stress-tools">
                      <Button variant="outline" className="w-full justify-start">
                        Browse all stress management tools
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
