import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { ReadingLevelContent } from '@/components/reading-level/ReadingLevelBlock';
import { AddToMyPlanButton } from '@/components/my-plan/AddToMyPlanButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Phase 3 Integration Demo | NeuroBreath',
  description: 'Demonstration of Phase 3 features: reading levels, save to My Plan, journey progress.',
  robots: { index: false, follow: false },
};

export default function Phase3DemoPage() {
  return (
    <main className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">Phase 3 Integration Demo</h1>
              <p className="text-muted-foreground">User preferences in action</p>
            </div>
          </div>
          <AddToMyPlanButton
            type="guide"
            id="demo-phase-3"
            title="Phase 3 Demo Guide"
            href="/demo/phase-3"
            tags={['demo', 'phase-3', 'features']}
            region="uk"
            showText={true}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>Reading Level Adaptive</Badge>
          <Badge>TTS Integrated</Badge>
          <Badge>Save to My Plan</Badge>
          <Badge>Privacy-First</Badge>
        </div>
      </div>

      <div className="space-y-8">
        {/* Reading Level Example */}
        <Card>
          <CardHeader>
            <CardTitle>Reading Level Content Demo</CardTitle>
            <CardDescription>
              This content adapts based on your reading level preference (Settings → Guest Profile → Reading Level)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">What is anxiety?</h3>
              
              <ReadingLevelContent
                simple={
                  <div className="space-y-2">
                    <p>
                      Anxiety is when you feel worried or scared. Everyone feels anxious sometimes.
                    </p>
                    <p>
                      Your body might feel tense. Your heart might beat faster. You might find it hard to sleep.
                    </p>
                    <p>
                      Breathing exercises can help you feel calmer. Taking slow, deep breaths tells your body it's safe.
                    </p>
                  </div>
                }
                standard={
                  <div className="space-y-2">
                    <p>
                      Anxiety is a natural response to stress or perceived danger. While everyone experiences anxiety, 
                      excessive or persistent worry can interfere with daily activities.
                    </p>
                    <p>
                      Common symptoms include muscle tension, rapid heartbeat, restlessness, and difficulty concentrating. 
                      You might also experience sleep problems or feel constantly on edge.
                    </p>
                    <p>
                      Evidence-based techniques like controlled breathing, mindfulness, and cognitive behavioral therapy (CBT) 
                      can effectively reduce anxiety symptoms by regulating your nervous system and changing thought patterns.
                    </p>
                  </div>
                }
                detailed={
                  <div className="space-y-2">
                    <p>
                      Anxiety disorders represent a spectrum of conditions characterized by excessive, persistent worry 
                      that significantly impairs functioning across multiple life domains. The neurobiological basis involves 
                      dysregulation of the amygdala-prefrontal cortex circuitry and altered neurotransmitter systems 
                      (particularly GABA, serotonin, and norepinephrine).
                    </p>
                    <p>
                      Clinical presentations vary widely—from generalized anxiety disorder (GAD) with diffuse, chronic worry 
                      to specific phobias with circumscribed fear responses. Somatic manifestations include autonomic 
                      hyperarousal (tachycardia, diaphoresis, tremor), muscle tension, and hypothalamic-pituitary-adrenal 
                      (HPA) axis dysregulation affecting sleep architecture.
                    </p>
                    <p>
                      First-line evidence-based interventions include cognitive-behavioral therapy (CBT) with exposure 
                      hierarchies, acceptance and commitment therapy (ACT), and pharmacotherapy (SSRIs, SNRIs). 
                      Parasympathetic activation through diaphragmatic breathing, heart rate variability biofeedback, 
                      and interoceptive exposure can modulate the stress response via vagal tone enhancement.
                    </p>
                  </div>
                }
              />
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Current setting:</strong> The content above adapts to your reading level preference. 
                Change it in <Link href="/settings" className="text-primary hover:underline">Settings</Link>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* My Plan Integration Example */}
        <Card>
          <CardHeader>
            <CardTitle>My Plan Integration</CardTitle>
            <CardDescription>
              Save guides, tools, and resources to your personalized plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The "Save to My Plan" button at the top of this page lets you bookmark important content. 
              All your saved items are stored locally on your device—no account required.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base">Your Saved Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access all your saved guides, tools, and resources in one place.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/my-plan">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      View My Plan
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base">Journey Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track your progress through multi-step journeys and routines.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/my-plan?tab=journeys">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      View Journeys
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* TTS Integration Example */}
        <Card>
          <CardHeader>
            <CardTitle>Text-to-Speech Integration</CardTitle>
            <CardDescription>
              NeuroBreath Buddy now uses your TTS preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The NeuroBreath Buddy (AI assistant) is now integrated with your text-to-speech settings. 
              When enabled, responses are read aloud using your preferred voice and speed.
            </p>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span><strong>Respects your settings:</strong> Enable/disable TTS, adjust speed (0.8-1.2x), choose UK/US voice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span><strong>Clean speech:</strong> Automatically removes emojis and symbols for better listening</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span><strong>Auto-speak:</strong> Optionally read new messages automatically</span>
              </li>
            </ul>

            <Button asChild variant="outline">
              <Link href="/settings?tab=tts">
                Configure TTS Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Accessibility Features */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Features</CardTitle>
            <CardDescription>
              All Phase 2 preferences are active on this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Visual Preferences</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Dyslexia-friendly font</li>
                  <li>• Text size adjustment</li>
                  <li>• High contrast mode</li>
                  <li>• Reduced motion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Content Preferences</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Reading level adaptation</li>
                  <li>• Region preference (UK/US)</li>
                  <li>• TTS customization</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button asChild>
                <Link href="/settings">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Customize All Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="border-muted-foreground/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Privacy:</strong> All your preferences, saved items, and progress are stored locally on your device only. 
              We do not transmit or store any of your personal data on our servers. 
              You can export, import, or reset your data at any time from the Settings page.
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" asChild>
            <Link href="/">← Back to Home</Link>
          </Button>
          <Button asChild>
            <Link href="/settings">Go to Settings →</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
