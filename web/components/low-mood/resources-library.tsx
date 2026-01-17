'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Globe, FileText, Book, Heart, Users, AlertCircle, ExternalLink, type LucideIcon } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  organization: string;
  description: string;
  type: 'helpline' | 'website' | 'guide' | 'app' | 'support-group';
  icon: LucideIcon;
  contact?: string;
  url?: string;
  availability?: string;
  country: string;
  tags: string[];
}

const resources: Resource[] = [
  {
    id: 'samaritans',
    title: 'Samaritans',
    organization: 'Samaritans',
    description: 'Confidential emotional support 24/7 for anyone struggling to cope',
    type: 'helpline',
    icon: Phone,
    contact: '116 123 (Free)',
    availability: '24/7',
    country: 'UK & Ireland',
    tags: ['crisis', 'emotional support', 'confidential']
  },
  {
    id: 'nhs-111',
    title: 'NHS 111',
    organization: 'NHS',
    description: 'Mental health support and advice. Select option 2 for mental health crisis',
    type: 'helpline',
    icon: Phone,
    contact: '111',
    availability: '24/7',
    country: 'UK',
    tags: ['urgent', 'professional', 'NHS']
  },
  {
    id: 'mind',
    title: 'Mind Infoline',
    organization: 'Mind',
    description: 'Information and support for mental health problems',
    type: 'helpline',
    icon: Phone,
    contact: '0300 123 3393',
    url: 'https://www.mind.org.uk',
    availability: '9am-6pm, Mon-Fri',
    country: 'UK',
    tags: ['information', 'support', 'mental health']
  },
  {
    id: 'nhs-talking-therapies',
    title: 'NHS Talking Therapies',
    organization: 'NHS',
    description: 'Free psychological therapies for anxiety and depression. Self-referral available',
    type: 'website',
    icon: Globe,
    url: 'https://www.nhs.uk/service-search/mental-health/find-a-psychological-therapies-service/',
    country: 'UK',
    tags: ['therapy', 'CBT', 'counselling', 'free']
  },
  {
    id: 'nice-depression-guide',
    title: 'Depression in Adults',
    organization: 'NICE',
    description: 'Evidence-based treatment guide for depression',
    type: 'guide',
    icon: FileText,
    url: 'https://www.nice.org.uk/guidance/cg90',
    country: 'UK',
    tags: ['evidence-based', 'clinical', 'treatment']
  },
  {
    id: 'every-mind-matters',
    title: 'Every Mind Matters',
    organization: 'NHS',
    description: 'Expert advice and practical tips to support your mental wellbeing',
    type: 'website',
    icon: Globe,
    url: 'https://www.nhs.uk/every-mind-matters/',
    country: 'UK',
    tags: ['self-help', 'wellbeing', 'resources']
  },
  {
    id: 'breathing-techniques',
    title: 'NHS Breathing Exercises',
    organization: 'NHS',
    description: 'Evidence-based breathing techniques for stress and anxiety',
    type: 'guide',
    icon: FileText,
    url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/',
    country: 'UK',
    tags: ['breathing', 'exercises', 'self-help']
  },
  {
    id: 'silvercloud',
    title: 'SilverCloud',
    organization: 'NHS',
    description: 'Free online CBT programmes for depression, anxiety, and stress',
    type: 'app',
    icon: Globe,
    url: 'https://www.silvercloudhealth.com/uk',
    country: 'UK',
    tags: ['CBT', 'online', 'free', 'structured']
  },
  {
    id: 'calm-harm',
    title: 'Calm Harm',
    organization: 'Stem4',
    description: 'App to help manage urges to self-harm',
    type: 'app',
    icon: Heart,
    url: 'https://calmharm.co.uk/',
    country: 'UK',
    tags: ['self-harm', 'crisis', 'mobile app']
  },
  {
    id: 'local-support-groups',
    title: 'Local Support Groups',
    organization: 'Mind',
    description: 'Find local peer support groups in your area',
    type: 'support-group',
    icon: Users,
    url: 'https://www.mind.org.uk/information-support/local-minds/',
    country: 'UK',
    tags: ['peer support', 'community', 'local']
  },
  {
    id: 'samaritans-self-help',
    title: 'Self-Help Resources',
    organization: 'Samaritans',
    description: 'Practical tips and strategies for coping with difficult feelings',
    type: 'guide',
    icon: Book,
    url: 'https://www.samaritans.org/how-we-can-help/if-youre-having-difficult-time/if-youre-worried-about-your-mental-health/',
    country: 'UK',
    tags: ['self-help', 'coping', 'practical']
  },
  {
    id: 'student-space',
    title: 'Student Space',
    organization: 'Student Space',
    description: 'Mental health support specifically for students',
    type: 'helpline',
    icon: Phone,
    contact: '0808 189 5111',
    url: 'https://studentspace.org.uk/',
    availability: '4pm-midnight',
    country: 'UK',
    tags: ['students', 'young adults', 'education']
  }
];

export const ResourcesLibrary = () => {
  const types = [
    { id: 'all', label: 'All Resources' },
    { id: 'helpline', label: 'Helplines' },
    { id: 'website', label: 'Websites' },
    { id: 'guide', label: 'Guides' },
    { id: 'app', label: 'Apps' },
    { id: 'support-group', label: 'Support Groups' }
  ];

  const [filter, setFilter] = useState('all');

  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter(r => r.type === filter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'helpline': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'website': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'guide': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'app': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'support-group': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Resources Library</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Professional support services, evidence-based guides, and trusted resources for mental health support
        </p>
      </div>

      {/* Crisis Alert */}
      <Card className="p-6 mb-8 border-red-500 bg-red-50 dark:bg-red-950">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2">Need urgent help?</h3>
            <p className="text-sm mb-3">
              If you're in crisis or danger of harming yourself, please call 999 (UK) or go to your nearest A&E.
            </p>
            <div className="space-y-2 text-sm">
              <div><strong>Samaritans:</strong> 116 123 (free, 24/7)</div>
              <div><strong>NHS Mental Health Crisis:</strong> Call 111, select option 2</div>
              <div><strong>Shout Crisis Text Line:</strong> Text SHOUT to 85258</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {types.map(type => (
          <Button
            key={type.id}
            variant={filter === type.id ? 'default' : 'outline'}
            onClick={() => setFilter(type.id)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => {
          const Icon = resource.icon;
          
          return (
            <Card key={resource.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold mb-1">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.organization}</p>
                </div>
              </div>

              <p className="text-sm mb-4">{resource.description}</p>

              {resource.contact && (
                <div className="mb-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 font-semibold text-lg">
                    <Phone className="h-4 w-4" />
                    {resource.contact}
                  </div>
                  {resource.availability && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {resource.availability}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getTypeColor(resource.type)}>
                  {resource.type.replace('-', ' ')}
                </Badge>
                <Badge variant="outline">{resource.country}</Badge>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {resource.url && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(resource.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Resource
                </Button>
              )}

              {resource.contact && !resource.url && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = `tel:${resource.contact?.replace(/\s/g, '') ?? ''}`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Information Footer */}
      <Card className="mt-8 p-6 bg-blue-50 dark:bg-blue-950">
        <h3 className="font-bold mb-2">Important Information</h3>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li>• All resources listed are from recognized UK mental health organizations</li>
          <li>• Helpline numbers are free unless otherwise stated</li>
          <li>• This page provides information only, not medical advice</li>
          <li>• For persistent low mood lasting 2+ weeks, please see your GP</li>
          <li>• NHS Talking Therapies can be self-referred without GP involvement</li>
        </ul>
      </Card>
    </div>
  );
};

