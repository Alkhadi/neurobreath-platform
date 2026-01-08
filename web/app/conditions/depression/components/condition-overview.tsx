'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AlertCircle, CheckCircle, Brain, Users, TrendingUp } from 'lucide-react';

export function ConditionOverview() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const symptoms = [
    'Persistent sad, anxious, or empty mood',
    'Loss of interest or pleasure in activities',
    'Significant weight or appetite changes',
    'Sleep disturbances (insomnia or oversleeping)',
    'Fatigue or loss of energy',
    'Feelings of worthlessness or excessive guilt',
    'Difficulty thinking, concentrating, or making decisions',
    'Recurrent thoughts of death or suicide',
  ];

  const types = [
    {
      name: 'Major Depressive Disorder (MDD)',
      description: 'Persistent feelings of sadness and loss of interest lasting at least two weeks, significantly impacting daily functioning.',
      icon: Brain,
    },
    {
      name: 'Persistent Depressive Disorder (PDD)',
      description: 'Chronic form of depression lasting two years or more, with symptoms that may be less severe but more enduring.',
      icon: TrendingUp,
    },
    {
      name: 'Seasonal Affective Disorder (SAD)',
      description: 'Depression that follows a seasonal pattern, typically occurring during fall and winter months when daylight decreases.',
      icon: Sun,
    },
    {
      name: 'Postpartum Depression',
      description: 'Depression occurring during pregnancy or within the first year after childbirth, affecting 10-20% of new mothers.',
      icon: Users,
    },
  ];

  function Sun({ className }: { className?: string }) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>
    );
  }

  return (
    <motion.section
      id="overview"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Clinical Overview</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Depression is a serious mood disorder affecting over 280 million people globally, characterized by persistent symptoms that interfere with daily life.
        </p>
      </div>

      {/* What is Depression */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">What is Major Depressive Disorder?</h3>
            <p className="text-gray-700 leading-relaxed">
              Major Depressive Disorder (MDD) is more than just a bout of the blues. It is a persistent problem lasting at least two weeks, significantly affecting thoughts, feelings, behavior, and physical well-being. According to the <span className="font-semibold">DSM-5-TR diagnostic criteria</span>, diagnosis requires five or more specific symptoms during the same two-week period, with at least one being either depressed mood or loss of interest/pleasure.
            </p>
          </div>
        </div>
      </div>

      {/* Core Symptoms */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 text-primary mr-2" />
          Core Diagnostic Symptoms
        </h3>
        <p className="text-gray-700 mb-6">
          The DSM-5-TR requires at least <span className="font-semibold text-primary">five of these nine symptoms</span> to be present most of the day, nearly every day, for at least two weeks:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {symptoms?.map?.((symptom, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                <p className="text-gray-700 text-sm">{symptom}</p>
              </div>
            </motion.div>
          )) ?? null}
        </div>
      </div>

      {/* Types of Depression */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 text-center">Types of Depression</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {types?.map?.((type, index) => {
            const Icon = type?.icon ?? Brain;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <Icon className="w-10 h-10 text-primary mb-3" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">{type?.name}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{type?.description}</p>
              </motion.div>
            );
          }) ?? null}
        </div>
      </div>

      {/* Neurobiology Brief */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl shadow-lg p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Brain className="w-6 h-6 text-primary mr-2" />
          Understanding the Biology
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Depression involves complex interactions between brain chemistry, stress systems, and inflammation. Two critical systems are often dysregulated:
        </p>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-2">HPA Axis Dysregulation</h4>
            <p className="text-sm text-gray-600">
              The hypothalamic-pituitary-adrenal (HPA) axis manages stress responses. In depression, this system becomes hyperactive, leading to chronically elevated cortisol levels that can damage brain regions like the hippocampus and impair memory and mood regulation.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-2">Neuroinflammation</h4>
            <p className="text-sm text-gray-600">
              Many people with depression show elevated levels of inflammatory markers (cytokines like IL-6 and TNF-α). This chronic inflammation disrupts neurotransmitter production, particularly serotonin, and contributes to symptoms like fatigue and cognitive difficulties.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
