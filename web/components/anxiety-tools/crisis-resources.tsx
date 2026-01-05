'use client'

import { Phone, MessageSquare, Heart, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CrisisResources() {
  return (
    <div className="space-y-6">
      {/* Emergency Warning */}
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg text-red-900 mb-2">If you're in crisis or having thoughts of self-harm</h3>
            <p className="text-red-800 mb-4">
              Please reach out for immediate support. You don't have to face this alone. These services are free, confidential, and available 24/7.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => window.open('tel:988', '_self')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call 988 (US)
              </Button>
              <Button 
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => window.open('sms:741741?body=HOME', '_self')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Text HOME to 741741 (US)
              </Button>
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => window.open('tel:999', '_self')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call 999 (UK)
              </Button>
              <Button 
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => window.open('sms:85258?body=SHOUT', '_self')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Text SHOUT to 85258 (UK)
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* UK Resources */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-3xl">🇬🇧</div>
          <h3 className="text-xl font-bold">United Kingdom Resources</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
            <Phone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">Emergency Services</div>
              <div className="text-2xl font-bold text-blue-600 my-1">999</div>
              <div className="text-sm text-muted-foreground">For immediate life-threatening emergencies</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
            <Phone className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">NHS 111</div>
              <div className="text-2xl font-bold text-green-600 my-1">111</div>
              <div className="text-sm text-muted-foreground">Press option 2 for mental health support. Available 24/7.</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
            <Phone className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">Samaritans</div>
              <div className="text-2xl font-bold text-purple-600 my-1">116 123</div>
              <div className="text-sm text-muted-foreground">24/7 confidential emotional support. Email: jo@samaritans.org</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
            <MessageSquare className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">Shout Crisis Text Line</div>
              <div className="text-2xl font-bold text-yellow-600 my-1">Text SHOUT to 85258</div>
              <div className="text-sm text-muted-foreground">Free, confidential, 24/7 text support</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-lg">
            <Phone className="h-6 w-6 text-pink-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">Childline (Under 19)</div>
              <div className="text-2xl font-bold text-pink-600 my-1">0800 1111</div>
              <div className="text-sm text-muted-foreground">Free, confidential support for children and young people</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
            <Phone className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">Anxiety UK</div>
              <div className="text-2xl font-bold text-orange-600 my-1">03444 775 774</div>
              <div className="text-sm text-muted-foreground">Mon-Fri 9:30am-5:30pm. Text: 07537 416 905</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg">
            <Phone className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">Mind Infoline</div>
              <div className="text-2xl font-bold text-teal-600 my-1">0300 123 3393</div>
              <div className="text-sm text-muted-foreground">Mon-Fri 9am-6pm. Email: info@mind.org.uk. Text: 86463</div>
            </div>
          </div>
        </div>
      </Card>

      {/* US Resources */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-3xl">🇺🇸</div>
          <h3 className="text-xl font-bold">United States Resources</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
            <Phone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">988 Suicide & Crisis Lifeline</div>
              <div className="text-2xl font-bold text-blue-600 my-1">Call or Text 988</div>
              <div className="text-sm text-muted-foreground">24/7 free and confidential support. También disponible en español.</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
            <MessageSquare className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">Crisis Text Line</div>
              <div className="text-2xl font-bold text-green-600 my-1">Text HOME to 741741</div>
              <div className="text-sm text-muted-foreground">Free, 24/7 crisis support via text message</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
            <Phone className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">NAMI HelpLine</div>
              <div className="text-2xl font-bold text-purple-600 my-1">1-800-950-6264</div>
              <div className="text-sm text-muted-foreground">Mon-Fri 10am-10pm ET. Email: info@nami.org. Text "HelpLine" to 62640</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
            <Phone className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">SAMHSA National Helpline</div>
              <div className="text-2xl font-bold text-yellow-600 my-1">1-800-662-4357</div>
              <div className="text-sm text-muted-foreground">24/7 treatment referral and information service. También en español.</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-lg">
            <Phone className="h-6 w-6 text-pink-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-lg">Anxiety and Depression Association of America (ADAA)</div>
              <div className="text-sm text-muted-foreground mt-2">Visit adaa.org for therapist finder, support groups, and educational resources</div>
            </div>
          </div>
        </div>
      </Card>

      {/* When to Seek Emergency Help */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-4">
          <Heart className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2">When to Seek Emergency Help</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>You're having thoughts of harming yourself or suicide</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>You have a plan to end your life</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>You're feeling unable to cope or keep yourself safe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Your anxiety is so severe you can't function</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>You're experiencing chest pain, difficulty breathing, or other severe physical symptoms</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
