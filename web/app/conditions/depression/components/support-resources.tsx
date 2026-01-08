'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, MessageSquare, Globe, Building, AlertTriangle } from 'lucide-react';

export function SupportResources() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const ukResources = [
    {
      name: 'Samaritans',
      type: 'Crisis Line',
      contact: '116 123 (free, 24/7)',
      description: 'Confidential emotional support for anyone in distress',
      icon: Phone,
    },
    {
      name: 'Crisis Text Line (Shout)',
      type: 'Text Support',
      contact: 'Text SHOUT to 85258 (24/7)',
      description: 'Free, confidential text support for mental health crises',
      icon: MessageSquare,
    },
    {
      name: 'NHS 111',
      type: 'Medical Advice',
      contact: 'Dial 111 or visit 111.nhs.uk',
      description: 'Medical advice and mental health support referrals',
      icon: Building,
    },
    {
      name: 'Mind',
      type: 'Information & Support',
      contact: 'mind.org.uk | Infoline: 0300 123 3393',
      description: 'Mental health information, local services directory, peer support',
      icon: Globe,
    },
    {
      name: 'NHS Talking Therapies',
      type: 'Treatment Access',
      contact: 'Self-referral via GP or nhs.uk',
      description: 'Free IAPT services for anxiety and depression',
      icon: Building,
    },
  ];

  const usResources = [
    {
      name: '988 Suicide & Crisis Lifeline',
      type: 'Crisis Line',
      contact: 'Dial 988 (call or text, 24/7)',
      description: 'Immediate support for suicidal thoughts or mental health crisis',
      icon: Phone,
    },
    {
      name: 'Crisis Text Line',
      type: 'Text Support',
      contact: 'Text HELLO to 741741 (24/7)',
      description: 'Free crisis counseling via text message',
      icon: MessageSquare,
    },
    {
      name: 'NAMI Helpline',
      type: 'Information & Support',
      contact: '1-800-950-NAMI (6264) or text NAMI to 741741',
      description: 'National Alliance on Mental Illness support and resources',
      icon: Phone,
    },
    {
      name: 'SAMHSA National Helpline',
      type: 'Treatment Referral',
      contact: '1-800-662-HELP (4357) (24/7)',
      description: 'Free, confidential treatment referral and information',
      icon: Building,
    },
    {
      name: 'Psychology Today',
      type: 'Therapist Directory',
      contact: 'psychologytoday.com/us/therapists',
      description: 'Find therapists by location, specialty, and insurance',
      icon: Globe,
    },
  ];

  return (
    <motion.section
      id="support"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Support & Resources</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive crisis support, treatment access, and information resources for UK and US
        </p>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-red-900">If You Are in Immediate Danger</h3>
            <p className="text-red-800 leading-relaxed">
              If you or someone you know is in immediate danger of self-harm or suicide, please call emergency services immediately:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <p className="font-bold text-red-900 text-lg">🇬🇧 UK: 999 or 112</p>
                <p className="text-sm text-gray-700 mt-1">Emergency services</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <p className="font-bold text-red-900 text-lg">🇺🇸 US: 911</p>
                <p className="text-sm text-gray-700 mt-1">Emergency services</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UK Resources */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🇬🇧</span>
          <h3 className="text-2xl font-bold text-gray-900">United Kingdom Resources</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ukResources?.map?.((resource, index) => {
            const Icon = resource?.icon ?? Phone;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300"
              >
                <Icon className="w-8 h-8 text-primary mb-3" />
                <h4 className="text-lg font-bold text-gray-900 mb-1">{resource?.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{resource?.type}</p>
                <p className="text-sm font-semibold text-primary mb-2">{resource?.contact}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{resource?.description}</p>
              </motion.div>
            );
          }) ?? null}
        </div>
      </div>

      {/* US Resources */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🇺🇸</span>
          <h3 className="text-2xl font-bold text-gray-900">United States Resources</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {usResources?.map?.((resource, index) => {
            const Icon = resource?.icon ?? Phone;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300"
              >
                <Icon className="w-8 h-8 text-primary mb-3" />
                <h4 className="text-lg font-bold text-gray-900 mb-1">{resource?.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{resource?.type}</p>
                <p className="text-sm font-semibold text-primary mb-2">{resource?.contact}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{resource?.description}</p>
              </motion.div>
            );
          }) ?? null}
        </div>
      </div>

      {/* When to Seek Help */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">When to Seek Professional Help</h3>
        <p className="text-gray-700 mb-4 leading-relaxed">
          You should reach out to a healthcare provider if:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
            <p>Symptoms persist for <span className="font-semibold">more than two weeks</span></p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
            <p>Symptoms <span className="font-semibold">interfere with daily activities</span> (work, relationships, self-care)</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
            <p>You have <span className="font-semibold">thoughts of self-harm or suicide</span></p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
            <p>Previous treatments <span className="font-semibold">are no longer effective</span></p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
            <p>You feel <span className="font-semibold">unable to cope</span> with daily demands</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
            <p>Loved ones express <span className="font-semibold">concern about your wellbeing</span></p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
