'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Pill, MessageSquare, Users, Zap } from 'lucide-react';

export function TreatmentOptions() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const medications = [
    {
      class: 'SSRIs',
      fullName: 'Selective Serotonin Reuptake Inhibitors',
      examples: 'Fluoxetine, Sertraline, Citalopram, Escitalopram, Paroxetine',
      description: 'First-line treatment for depression. Work by increasing serotonin levels in the brain.',
      efficacy: 'Gold standard for acute treatment',
    },
    {
      class: 'SNRIs',
      fullName: 'Serotonin-Norepinephrine Reuptake Inhibitors',
      examples: 'Venlafaxine, Duloxetine',
      description: 'Increase both serotonin and norepinephrine. Often used as second-line treatment.',
      efficacy: 'Comparable efficacy to SSRIs',
    },
    {
      class: 'TCAs',
      fullName: 'Tricyclic Antidepressants',
      examples: 'Amitriptyline, Nortriptyline',
      description: 'Older class of antidepressants. Highly effective but more side effects.',
      efficacy: 'Very effective for severe depression',
    },
    {
      class: 'Atypical',
      fullName: 'Atypical Antidepressants',
      examples: 'Bupropion, Mirtazapine',
      description: 'Unique mechanisms. Bupropion is more activating; Mirtazapine is sedating.',
      efficacy: 'Lower sexual side effects (Bupropion)',
    },
  ];

  const therapies = [
    {
      name: 'Cognitive Behavioral Therapy (CBT)',
      icon: MessageSquare,
      description: 'Identifies and changes negative thought patterns and behaviors. Structured, short-term, skill-building approach.',
      efficacy: 'Most researched; highly effective for mild to moderate depression',
    },
    {
      name: 'Interpersonal Therapy (IPT)',
      icon: Users,
      description: 'Focuses on improving relationships and social functioning. Addresses grief, role disputes, transitions, and interpersonal deficits.',
      efficacy: 'Highly effective; time-limited (12-16 weeks)',
    },
    {
      name: 'Mindfulness-Based Cognitive Therapy (MBCT)',
      icon: Brain,
      description: 'Combines CBT with mindfulness meditation. Specifically designed to prevent relapse in recurrent depression.',
      efficacy: 'Reduces relapse risk by 40-50%',
    },
    {
      name: 'Behavioral Activation (BA)',
      icon: Zap,
      description: 'Focuses on scheduling and engaging in meaningful activities. Based on the principle that action precedes motivation.',
      efficacy: 'Comparable to CBT; often easier to implement',
    },
  ];

  function Brain({ className }: { className?: string }) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
      </svg>
    );
  }

  return (
    <motion.section
      id="treatments"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Evidence-Based Treatments</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Depression is highly treatable. Most people benefit from a combination of medication and psychotherapy.
        </p>
      </div>

      {/* Pharmacotherapy */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Pill className="w-8 h-8 text-primary" />
          <h3 className="text-2xl font-bold text-gray-900">Pharmacotherapy (Medication)</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Antidepressant medications modulate neurotransmitter activity in the brain. They are typically the first-line treatment for moderate to severe depression. While no single medication is universally best, SSRIs are often preferred due to their favorable side-effect profile.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {medications?.map?.((med, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <h4 className="text-lg font-bold text-primary mb-1">{med?.class}</h4>
              <p className="text-xs text-gray-500 mb-2">{med?.fullName}</p>
              <p className="text-sm text-gray-700 mb-2">{med?.description}</p>
              <p className="text-xs text-gray-600 mb-2"><span className="font-semibold">Examples:</span> {med?.examples}</p>
              <div className="bg-green-50 rounded-lg p-2 mt-2">
                <p className="text-xs text-green-800 font-semibold">{med?.efficacy}</p>
              </div>
            </motion.div>
          )) ?? null}
        </div>
      </div>

      {/* Psychotherapy */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          <h3 className="text-2xl font-bold text-gray-900">Psychotherapy (Talk Therapy)</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Psychotherapy helps identify and change unhealthy thought patterns, behaviors, and relationship dynamics. It can be used alone for mild to moderate depression or combined with medication for more severe cases.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {therapies?.map?.((therapy, index) => {
            const Icon = therapy?.icon ?? MessageSquare;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <Icon className="w-10 h-10 text-primary mb-3" />
                <h4 className="text-lg font-bold text-gray-900 mb-2">{therapy?.name}</h4>
                <p className="text-sm text-gray-700 mb-3">{therapy?.description}</p>
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-xs text-blue-800 font-semibold">{therapy?.efficacy}</p>
                </div>
              </motion.div>
            );
          }) ?? null}
        </div>
      </div>

      {/* Combination Therapy */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">The Power of Combination Therapy</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          For moderate to severe depression, <span className="font-semibold">combining medication and psychotherapy</span> is often the most effective approach. Research consistently shows that this dual strategy leads to:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0 mt-1.5"></div>
            <p className="text-gray-700"><span className="font-semibold">Higher remission rates</span> than either treatment alone</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0 mt-1.5"></div>
            <p className="text-gray-700"><span className="font-semibold">Lower relapse rates</span> over time</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0 mt-1.5"></div>
            <p className="text-gray-700"><span className="font-semibold">Faster symptom improvement</span> in many cases</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0 mt-1.5"></div>
            <p className="text-gray-700"><span className="font-semibold">Better functional outcomes</span> in daily life</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
