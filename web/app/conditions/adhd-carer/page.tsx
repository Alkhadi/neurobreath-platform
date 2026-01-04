'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink, 
  Lightbulb,
  Clock,
  Users,
  Brain,
  Home,
  Shield,
  Phone,
  Sparkles,
  HeartHandshake,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ADHDCarerSupportPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-rose-950" />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-rose-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600 text-white">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <div className="text-center space-y-6 mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <HeartHandshake className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">ADHD Carers Support Hub</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Guidance for family members, guardians, and professional carers supporting individuals with ADHD: 
              coping strategies, self-care, respite resources, and long-term planning
            </p>
            <p className="text-sm opacity-75 max-w-2xl mx-auto">
              Supporting someone with ADHD can be challenging. You are not alone, and you deserve support too.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <a href="#carer-wellbeing" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Carer Wellbeing
            </a>
            <a href="#daily-support" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Daily Support
            </a>
            <a href="#crisis-planning" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Crisis Planning
            </a>
            <a href="#respite-resources" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Respite & Support
            </a>
          </div>

          {/* Hero Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Self-care</Badge>
                <CardTitle>Carer wellbeing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Strategies for managing stress, preventing burnout, and maintaining your own mental health.
                </p>
                <Button size="sm" className="w-full" asChild>
                  <a href="#carer-wellbeing">Wellbeing guide</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Practical support</Badge>
                <CardTitle>Daily living strategies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Practical approaches for managing routines, behaviors, and common challenges.
                </p>
                <Button size="sm" className="w-full" variant="outline" asChild>
                  <a href="#daily-support">Support strategies</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Emergency support</Badge>
                <CardTitle>Crisis resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Emergency contacts, crisis planning, and immediate support resources.
                </p>
                <Button size="sm" className="w-full" variant="outline" asChild>
                  <a href="#crisis-planning">Crisis info</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Core Principles */}
          <Card className="mt-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
            <CardHeader>
              <Badge className="w-fit mb-2" variant="secondary">Remember</Badge>
              <CardTitle>Key principles for carers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    You can't pour from an empty cup
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Taking care of yourself isn't selfish—it's essential for providing sustainable support.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4 text-rose-600" />
                    You are not alone
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with other carers, support groups, and professionals who understand your journey.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-rose-600" />
                    Ask for help
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Seeking support is a sign of strength. Respite care and assistance are available.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Carer Wellbeing Section */}
      <section id="carer-wellbeing" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Carer Wellbeing & Self-Care</h2>
          
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <strong>Carer burnout is real.</strong> Studies show that carers of individuals with ADHD experience 
              higher stress levels than other caregiving roles. Prioritizing your wellbeing isn't optional—it's necessary.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600" />
                  Recognizing burnout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Signs you may be burned out</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Feeling constantly exhausted, even after rest</li>
                      <li>Increased irritability or resentment</li>
                      <li>Withdrawing from social activities</li>
                      <li>Physical symptoms (headaches, stomach issues)</li>
                      <li>Feeling hopeless or overwhelmed</li>
                      <li>Neglecting your own health & needs</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">What to do</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Talk to your doctor about how you're feeling</li>
                      <li>Reach out to support groups or counseling</li>
                      <li>Arrange respite care immediately</li>
                      <li>Lower expectations temporarily</li>
                      <li>Ask family/friends for specific help</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Self-care strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="daily" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="daily" className="space-y-3">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>15 minutes for yourself:</strong> Coffee, bath, breathing exercises</li>
                      <li>• <strong>Move your body:</strong> Short walk, stretching, yoga</li>
                      <li>• <strong>Sleep priority:</strong> Protect your sleep schedule</li>
                      <li>• <strong>Healthy eating:</strong> Regular meals, limit caffeine/alcohol</li>
                      <li>• <strong>One positive moment:</strong> Notice something good each day</li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="weekly" className="space-y-3">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Time away:</strong> 2-3 hours doing something you enjoy</li>
                      <li>• <strong>Social connection:</strong> Call friend, support group, coffee date</li>
                      <li>• <strong>Fun activity:</strong> Hobby, class, entertainment</li>
                      <li>• <strong>Medical appointments:</strong> Don't skip your own health needs</li>
                      <li>• <strong>Planning time:</strong> Review week, adjust support needs</li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Daily Support Strategies */}
      <section id="daily-support" className="py-16 bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 dark:from-rose-950 dark:via-purple-950 dark:to-pink-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Daily Living Support</h2>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  Managing daily routines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">Strategies that help</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Consistent schedule:</strong> Same wake/sleep/meal times daily</li>
                      <li>• <strong>Visual supports:</strong> Checklists, timers, schedules</li>
                      <li>• <strong>Break tasks down:</strong> One step at a time</li>
                      <li>• <strong>Prepare in advance:</strong> Lay out clothes, pack bags</li>
                      <li>• <strong>Reminders:</strong> Alarms, apps, sticky notes</li>
                      <li>• <strong>Reduce decisions:</strong> Simplify choices, create routines</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Common challenges</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Transitions:</strong> Give 5-min warnings, use timers</li>
                      <li>• <strong>Losing things:</strong> Designated spots, duplicates</li>
                      <li>• <strong>Time blindness:</strong> Visual clocks, timers, prompts</li>
                      <li>• <strong>Forgetfulness:</strong> Written lists, apps, buddy system</li>
                      <li>• <strong>Procrastination:</strong> Body doubling, timers, rewards</li>
                      <li>• <strong>Overwhelm:</strong> Simplify, prioritize, ask for help</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Supporting executive function
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Organization</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Label containers/drawers</li>
                      <li>Color-code systems</li>
                      <li>One place for keys/wallet/phone</li>
                      <li>Weekly declutter time</li>
                      <li>Simplify possessions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Planning</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Use calendar/planner together</li>
                      <li>Weekly planning session</li>
                      <li>Break projects into steps</li>
                      <li>Set interim deadlines</li>
                      <li>Plan B for common issues</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Emotional regulation</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Notice escalation signs early</li>
                      <li>Teach calming strategies</li>
                      <li>Create calm-down space</li>
                      <li>Problem-solve after calm</li>
                      <li>Validate feelings</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Medication management support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">If managing medication for someone</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Use pill organizer (weekly or monthly)</li>
                      <li>Set phone alarms for dosing times</li>
                      <li>Keep medication log (dose, time, side effects)</li>
                      <li>Refill prescriptions before running out</li>
                      <li>Attend doctor appointments to discuss effectiveness</li>
                      <li>Watch for side effects (appetite, sleep, mood)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Supporting self-management (teens/adults)</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Help set up systems (alarms, apps, pill organizer)</li>
                      <li>Gentle reminders without nagging</li>
                      <li>Discuss importance of consistency</li>
                      <li>Problem-solve barriers together</li>
                      <li>Celebrate successes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Crisis Planning */}
      <section id="crisis-planning" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Crisis Planning & Emergency Resources</h2>
          
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
            <Phone className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>In a mental health crisis:</strong> Call 988 (US Suicide & Crisis Lifeline), 111 (UK NHS), 
              or your local emergency services. Don't wait if someone is in danger.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Crisis contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Emergency numbers</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>US Crisis Line:</strong> 988 (call or text)</li>
                      <li>• <strong>UK Crisis:</strong> 111 (NHS), 116 123 (Samaritans)</li>
                      <li>• <strong>Emergency:</strong> 911 (US), 999 (UK)</li>
                      <li>• <strong>CHADD Support:</strong> Information & referrals</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Your personal contacts</h4>
                    <p className="text-sm text-muted-foreground mb-2">Write these down and keep accessible:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Psychiatrist/prescriber phone</li>
                      <li>Therapist/counselor contact</li>
                      <li>Trusted family member/friend</li>
                      <li>Local crisis center</li>
                      <li>Primary care doctor</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crisis plan template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Warning signs</h4>
                    <p className="text-sm text-muted-foreground">
                      List early warning signs that indicate escalation:
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Increased irritability or agitation</li>
                      <li>Sleep changes (too much/too little)</li>
                      <li>Withdrawal from activities</li>
                      <li>Medication non-compliance</li>
                      <li>Risky behaviors</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">De-escalation strategies</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Stay calm, lower your voice</li>
                      <li>Give space if needed</li>
                      <li>Remove triggers/audience</li>
                      <li>Use previously agreed coping strategies</li>
                      <li>Know when to call for help</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Respite & Support Resources */}
      <section id="respite-resources" className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Respite Care & Support Services</h2>
          
          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Types of respite care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <strong className="text-sm">In-home respite:</strong>
                    <p className="text-sm text-muted-foreground">Trained worker comes to your home so you can leave</p>
                  </li>
                  <li>
                    <strong className="text-sm">Adult day programs:</strong>
                    <p className="text-sm text-muted-foreground">Day center with activities & supervision</p>
                  </li>
                  <li>
                    <strong className="text-sm">Short-term residential:</strong>
                    <p className="text-sm text-muted-foreground">Overnight or weekend stays at facility</p>
                  </li>
                  <li>
                    <strong className="text-sm">Family/friend relief:</strong>
                    <p className="text-sm text-muted-foreground">Trusted person provides care for set times</p>
                  </li>
                  <li>
                    <strong className="text-sm">Emergency respite:</strong>
                    <p className="text-sm text-muted-foreground">Available when you're ill or in crisis</p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Finding support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Carer support groups</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>CHADD local chapters (in-person & online)</li>
                      <li>Facebook groups for ADHD carers</li>
                      <li>Local support groups (hospitals, community centers)</li>
                      <li>Online forums (Reddit r/ADHD, ADDitude)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Professional support</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Individual counseling/therapy for you</li>
                      <li>Family therapy</li>
                      <li>ADHD coach (for your loved one or you)</li>
                      <li>Social worker (care coordination)</li>
                      <li>Local carer support services</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial & legal considerations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Financial assistance (US)</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                    <li>Medicaid waiver programs (respite coverage)</li>
                    <li>Supplemental Security Income (SSI)</li>
                    <li>Social Security Disability Insurance (SSDI)</li>
                    <li>State disability programs</li>
                    <li>ABLE accounts (savings for disability expenses)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">UK support</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                    <li>Carer's Allowance</li>
                    <li>Personal Independence Payment (PIP)</li>
                    <li>Direct Payments</li>
                    <li>Carer's Assessment (right to support)</li>
                    <li>Council tax reduction</li>
                  </ul>
                </div>
              </div>
              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Legal planning:</strong> Consider power of attorney, guardianship (if needed), 
                  advance directives, and will/trust planning. Consult with elder law or disability attorney.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Support Organizations */}
      <section id="organizations" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Support Organizations</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CHADD</CardTitle>
                <CardDescription>Children & Adults with ADHD</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Support groups, webinars, and resources for families and carers
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://chadd.org/" target="_blank" rel="noopener noreferrer">
                    Visit CHADD
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Carers UK</CardTitle>
                <CardDescription>Support for all carers (UK)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Advice, support groups, and rights information for carers
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.carersuk.org/" target="_blank" rel="noopener noreferrer">
                    Visit Carers UK
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ARCH National Respite</CardTitle>
                <CardDescription>Respite locator (US)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Find respite services in your area
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://archrespite.org/" target="_blank" rel="noopener noreferrer">
                    Find Respite
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Breathing & Carer Stress */}
      <section id="breathing" className="py-16 bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 dark:from-rose-950 dark:via-purple-950 dark:to-pink-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Breathing for Carer Stress Relief
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-600" />
                Quick stress-relief techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">When to use breathing</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Feeling overwhelmed or frustrated</li>
                    <li>• Before difficult conversations</li>
                    <li>• After stressful incidents</li>
                    <li>• At bedtime if can't sleep</li>
                    <li>• During brief breaks in caregiving</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Benefits for carers</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Lowers stress hormones quickly</li>
                    <li>• Helps regulate emotions</li>
                    <li>• Improves sleep quality</li>
                    <li>• Reduces physical tension</li>
                    <li>• Takes only 1-2 minutes</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-4">
                <Link href="/techniques/sos">
                  <Button variant="default" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🆘</div>
                      <div className="text-xs">SOS-60</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/techniques/4-7-8">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟦</div>
                      <div className="text-xs">4-7-8 Breathing</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/techniques/box-breathing">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟩</div>
                      <div className="text-xs">Box Breathing</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/techniques/coherent">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟪</div>
                      <div className="text-xs">Coherent 5-5</div>
                    </div>
                  </Button>
                </Link>
              </div>

              <Alert className="mt-6">
                <Heart className="h-4 w-4" />
                <AlertDescription>
                  <strong>Remember:</strong> Taking 2 minutes to breathe and center yourself isn't taking time 
                  away from caregiving—it's recharging so you can provide better care. You matter too.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

