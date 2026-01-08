'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Phone, MessageSquare, Globe, Clock, Heart, Shield } from 'lucide-react';

interface CrisisResource {
  id: string;
  name: string;
  type: 'call' | 'text' | 'online';
  contact: string;
  description: string;
  availability: string;
  icon: any;
  urgent?: boolean;
}

const crisisResources: CrisisResource[] = [
  {
    id: 'emergency',
    name: 'Emergency Services',
    type: 'call',
    contact: '999',
    description: 'Call immediately if you are in immediate danger or have seriously harmed yourself',
    availability: '24/7',
    icon: AlertTriangle,
    urgent: true
  },
  {
    id: 'samaritans',
    name: 'Samaritans',
    type: 'call',
    contact: '116 123',
    description: 'Confidential emotional support for anyone in distress or struggling to cope',
    availability: '24/7',
    icon: Phone
  },
  {
    id: 'nhs-mental-health',
    name: 'NHS Mental Health Crisis',
    type: 'call',
    contact: '111 (Select Option 2)',
    description: 'Urgent mental health support from NHS professionals',
    availability: '24/7',
    icon: Phone,
    urgent: true
  },
  {
    id: 'shout',
    name: 'Shout Crisis Text Line',
    type: 'text',
    contact: 'Text SHOUT to 85258',
    description: 'Free, confidential, 24/7 text support for anyone in crisis',
    availability: '24/7',
    icon: MessageSquare
  },
  {
    id: 'papyrus',
    name: 'PAPYRUS HOPELINEUK',
    type: 'call',
    contact: '0800 068 4141',
    description: 'Confidential support for young people under 35 experiencing suicidal thoughts',
    availability: '9am-midnight every day',
    icon: Phone
  },
  {
    id: 'campaign-against-living-miserably',
    name: 'CALM (Campaign Against Living Miserably)',
    type: 'call',
    contact: '0800 58 58 58',
    description: 'Leading movement against suicide, particularly for men',
    availability: '5pm-midnight daily',
    icon: Phone
  },
  {
    id: 'saneline',
    name: 'SANEline',
    type: 'call',
    contact: '0300 304 7000',
    description: 'Emotional support for people affected by mental illness',
    availability: '4pm-10pm daily',
    icon: Phone
  },
  {
    id: 'nhs-mental-health-teams',
    name: 'Local Crisis Resolution Team',
    type: 'online',
    contact: 'Find via NHS 111',
    description: 'Intensive support to help people in mental health crisis at home',
    availability: 'Varies by area',
    icon: Globe
  }
];

const safetyStrategies = [
  {
    title: 'Make Environment Safe',
    description: 'Remove or secure items that could be used for self-harm',
    icon: Shield
  },
  {
    title: 'Contact Someone',
    description: 'Call a crisis line, text a friend, or go to a public place',
    icon: Phone
  },
  {
    title: 'Use Distraction',
    description: 'Engage in intense physical activity, cold water on face, or hold ice',
    icon: Clock
  },
  {
    title: 'Wait Before Acting',
    description: 'Urges typically peak and subside. Wait 15 minutes before any action',
    icon: Clock
  }
];

const warningSigns = [
  'Thoughts of suicide or self-harm',
  'Feeling hopeless or that life isn\'t worth living',
  'Feeling trapped with no way out',
  'Overwhelming anxiety or panic that won\'t subside',
  'Severe insomnia or inability to function',
  'Increased substance use as coping',
  'Withdrawing from everyone',
  'Talking about being a burden to others',
  'Making preparations or saying goodbye',
  'Dramatic mood changes'
];

export const CrisisSupport = () => {
  return (
    <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-700 dark:text-red-400">
          Crisis Support
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          If you're in crisis, you're not alone. Help is available 24/7.
        </p>
      </div>

      {/* Immediate Danger Alert */}
      <Card className="p-8 mb-8 border-4 border-red-500 bg-red-50 dark:bg-red-950">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="flex-grow">
            <h3 className="text-2xl font-bold mb-3 text-red-800 dark:text-red-300">
              Immediate Danger?
            </h3>
            <p className="text-lg mb-4">
              If you are in immediate danger or have seriously harmed yourself:
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white text-xl"
                onClick={() => window.location.href = 'tel:999'}
              >
                <Phone className="h-6 w-6 mr-2" />
                Call 999
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-red-600 text-lg"
                onClick={() => window.location.href = 'tel:111'}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call NHS 111
              </Button>
            </div>
            <p className="text-sm mt-4 text-muted-foreground">
              Or go directly to your nearest A&E department
            </p>
          </div>
        </div>
      </Card>

      {/* Crisis Hotlines */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-6 text-center">24/7 Crisis Support</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {crisisResources.map(resource => {
            const Icon = resource.icon;
            
            return (
              <Card 
                key={resource.id}
                className={`p-6 ${resource.urgent ? 'border-2 border-red-500 bg-red-50 dark:bg-red-950' : ''}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    resource.urgent 
                      ? 'bg-red-500' 
                      : 'bg-blue-500'
                  }`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-lg mb-1">{resource.name}</h4>
                    {resource.urgent && (
                      <Badge className="bg-red-600 mb-2">URGENT</Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm mb-4">{resource.description}</p>

                <div className="p-4 bg-muted rounded-lg mb-4">
                  <div className="font-bold text-lg mb-1">{resource.contact}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {resource.availability}
                  </div>
                </div>

                {resource.type === 'call' && (
                  <Button 
                    className="w-full"
                    onClick={() => window.location.href = `tel:${resource.contact.replace(/\s/g, '')}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                )}

                {resource.type === 'text' && (
                  <Button 
                    className="w-full"
                    onClick={() => window.location.href = `sms:85258&body=SHOUT`}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Text
                  </Button>
                )}

                {resource.type === 'online' && (
                  <Button 
                    className="w-full"
                    variant="outline"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Find Service
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Warning Signs */}
      <Card className="p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          Warning Signs - When to Seek Help
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          If you or someone you know is experiencing any of these, please reach out for support:
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {warningSigns.map((sign, idx) => (
            <div key={idx} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-2" />
              <span className="text-sm">{sign}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Safety Strategies */}
      <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-950">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-500" />
          Immediate Safety Strategies
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          If you're having thoughts of self-harm right now:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {safetyStrategies.map((strategy, idx) => {
            const Icon = strategy.icon;
            return (
              <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg">
                <Icon className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">{strategy.title}</h4>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Support for Others */}
      <Card className="p-6 bg-purple-50 dark:bg-purple-950">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Heart className="h-6 w-6 text-purple-500" />
          Supporting Someone in Crisis
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <strong>Listen without judgment:</strong> Let them talk. Don't try to fix it immediately.
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <strong>Take it seriously:</strong> If someone mentions suicide, always take it seriously.
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <strong>Stay with them:</strong> Don't leave them alone if they're at immediate risk.
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <strong>Help them get help:</strong> Offer to call a crisis line together or accompany them to A&E.
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <strong>Remove means:</strong> Help remove access to items that could be used for self-harm.
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <strong>Follow up:</strong> Check in regularly, even after the immediate crisis passes.
          </div>
        </div>
      </Card>

      {/* Footer Note */}
      <Card className="mt-8 p-6 bg-muted">
        <p className="text-sm text-center text-muted-foreground">
          <strong>Remember:</strong> Crisis feelings are temporary, even when they feel overwhelming. 
          Help is available, and recovery is possible. You deserve support.
        </p>
      </Card>
    </div>
  );
};

