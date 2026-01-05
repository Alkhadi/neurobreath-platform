'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Lightbulb, Heart, Phone } from 'lucide-react';

export function QuickStarter() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const cards = [
    {
      icon: Lightbulb,
      title: 'Recognize the Signs',
      items: [
        'Persistent sadness or empty mood',
        'Loss of interest in activities once enjoyed',
        'Changes in sleep or appetite',
        'Fatigue and loss of energy',
        'Difficulty concentrating',
      ],
    },
    {
      icon: Heart,
      title: 'Immediate Self-Care',
      items: [
        'Practice breathing exercises below',
        'Reach out to a trusted friend or family member',
        'Engage in gentle physical activity',
        'Maintain a regular sleep schedule',
        'Avoid alcohol and substance use',
      ],
    },
    {
      icon: Phone,
      title: 'When to Seek Help',
      items: [
        'Symptoms persist for more than two weeks',
        'Symptoms interfere with daily activities',
        'Thoughts of self-harm or suicide',
        'Unable to care for yourself or others',
        'Previous treatments are no longer working',
      ],
    },
  ];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Quick Starter Guide</h2>
        <p className="text-lg text-gray-600">Essential information to help you understand and respond to depression</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards?.map?.((card, index) => {
          const Icon = card?.icon ?? Lightbulb;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <Icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">{card?.title}</h3>
              <ul className="space-y-2">
                {card?.items?.map?.((item, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
                    <span>{item}</span>
                  </li>
                )) ?? null}
              </ul>
            </motion.div>
          );
        }) ?? null}
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Phone className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-red-900">Crisis Support Available Now</h3>
            <p className="text-red-800">
              If you are in crisis or experiencing thoughts of suicide, please reach out immediately:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="font-bold text-gray-900 mb-1">🇬🇧 UK Crisis Lines</p>
                <p className="text-sm text-gray-700">Samaritans: <a href="tel:116123" className="font-bold text-primary hover:underline">116 123</a> (24/7)</p>
                <p className="text-sm text-gray-700">Crisis Text Line: Text <span className="font-bold">SHOUT</span> to <span className="font-bold">85258</span></p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="font-bold text-gray-900 mb-1">🇺🇸 US Crisis Lines</p>
                <p className="text-sm text-gray-700">988 Suicide & Crisis Lifeline: <a href="tel:988" className="font-bold text-primary hover:underline">988</a> (24/7)</p>
                <p className="text-sm text-gray-700">Crisis Text Line: Text <span className="font-bold">HELLO</span> to <span className="font-bold">741741</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
