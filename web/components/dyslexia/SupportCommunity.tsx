'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Heart, HelpCircle, Users, Star, ExternalLink } from 'lucide-react';

const faqs = [
  {
    question: 'Can dyslexia be cured?',
    answer: 'Dyslexia is a lifelong condition, not an illness to be "cured." However, with appropriate intervention and support, individuals with dyslexia can become successful readers and learners. Early intervention and evidence-based strategies make a significant difference.'
  },
  {
    question: 'At what age can dyslexia be diagnosed?',
    answer: 'While early signs can be observed in preschool, formal diagnosis typically occurs around age 7-8 when reading instruction has begun. However, screening can identify at-risk children earlier, allowing for intervention to start sooner.'
  },
  {
    question: 'Will my child need special education?',
    answer: 'Not necessarily. Many children with dyslexia succeed in mainstream education with appropriate accommodations and support. However, some may benefit from specialized instruction, such as one-on-one tutoring with a trained dyslexia specialist.'
  },
  {
    question: 'Is dyslexia genetic?',
    answer: 'Yes, dyslexia tends to run in families. If a parent has dyslexia, there is a 40-60% chance their child will also have it. Multiple genes are thought to be involved.'
  },
  {
    question: 'Can adults be diagnosed with dyslexia?',
    answer: 'Absolutely. Many adults discover they have dyslexia later in life. Assessment is available for adults through educational psychologists and specialized centers. It\'s never too late to seek support and strategies.'
  },
  {
    question: 'Are there benefits to having dyslexia?',
    answer: 'Research shows that people with dyslexia often have strengths in creative thinking, problem-solving, big-picture thinking, and visual-spatial reasoning. Many successful entrepreneurs, artists, and innovators have dyslexia.'
  },
];

const successStories = [
  {
    name: 'Jamie, Age 14',
    quote: 'Using audiobooks and structured phonics practice, I went from hating reading to finishing 3 books a month. My confidence has completely changed.',
    achievement: 'Improved reading level by 2 years in 18 months'
  },
  {
    name: 'Sarah, Parent',
    quote: 'Understanding dyslexia and finding the right strategies transformed our family. My son now sees his dyslexia as a different way of learning, not a limitation.',
    achievement: 'Successfully advocated for school accommodations'
  },
  {
    name: 'Michael, Adult Learner',
    quote: 'I was diagnosed with dyslexia at age 32. Finally understanding why I struggled was life-changing. With assistive technology, I completed my degree.',
    achievement: 'Earned university degree at age 35'
  },
];

const supportOrganizations = [
  {
    name: 'British Dyslexia Association',
    description: 'Helpline, resources, and local support groups across the UK',
    contact: 'Helpline: 0333 405 4567',
    website: 'https://www.bdadyslexia.org.uk/'
  },
  {
    name: 'Dyslexia Action',
    description: 'Assessment, teaching, and training services',
    contact: 'Tel: 01784 222 300',
    website: 'https://www.dyslexiaaction.org.uk/'
  },
  {
    name: 'IPSEA (Independent Provider of Special Education Advice)',
    description: 'Free legal advice on SEND rights',
    contact: 'Helpline: 0800 018 4016',
    website: 'https://www.ipsea.org.uk/'
  },
];

export function SupportCommunity() {
  return (
    <section id="support" className="space-y-4">
      {/* Section Header */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
              <Heart className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Support & Community</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You're not alone. Connect with others, find answers, and access professional support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <h4 className="font-semibold text-foreground mb-2">{faq.question}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
              <Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Success Stories</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {successStories.map((story, index) => (
              <div key={index} className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center">
                      <span className="text-lg">🌟</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{story.name}</h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">{story.achievement}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{story.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Support */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Professional Support Organizations</h3>
          </div>

          <div className="grid gap-4">
            {supportOrganizations.map((org, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-foreground">{org.name}</h4>
                    <p className="text-sm text-muted-foreground">{org.description}</p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Contact:</strong> {org.contact}
                    </p>
                  </div>
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    aria-label={`Visit ${org.name} website`}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* When to Seek Professional Help */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">⚠️ When to Seek Professional Help</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Contact a professional if you notice:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Reading skills significantly below age/grade level despite intervention</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Persistent anxiety or emotional distress related to reading/school</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Complete avoidance of reading or writing activities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Declining self-esteem or behavioral changes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Need for formal diagnosis for school accommodations</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Community Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <MessageCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />
            <h3 className="text-xl font-bold text-foreground">You're Part of a Global Community</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Remember: 1 in 10 people have dyslexia. You're part of a vibrant community that includes entrepreneurs, 
              artists, scientists, and leaders. Your dyslexia doesn't define you—it's just one aspect of your unique 
              profile. With the right support and strategies, you can achieve anything you set your mind to.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
