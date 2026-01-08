'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Dumbbell, Apple, Moon, Users2, TreePine, Wind } from 'lucide-react';

export function LifestyleInterventions() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const interventions = [
    {
      title: 'Physical Activity',
      icon: Dumbbell,
      color: 'from-red-50 to-orange-50',
      iconColor: 'text-red-600',
      description: 'Regular exercise is one of the most effective lifestyle interventions for depression.',
      benefits: [
        'Boosts endorphins and mood-regulating neurotransmitters',
        'Promotes neurogenesis in the hippocampus',
        'Effects comparable to antidepressants for mild-moderate depression',
        'Even low-intensity activity (walking) provides benefits',
      ],
      recommendation: 'Aim for 30 minutes of moderate aerobic activity most days. Start small—even 10 minutes helps.',
    },
    {
      title: 'Nutrition & Diet',
      icon: Apple,
      color: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600',
      description: 'What you eat influences mood and brain function through the gut-brain axis.',
      benefits: [
        'Whole foods diet (fruits, vegetables, whole grains) linked to lower depression risk',
        'Omega-3 fatty acids have anti-inflammatory properties',
        'B vitamins, magnesium, zinc support neurotransmitter synthesis',
        'High processed food/sugar intake associated with higher depression rates',
      ],
      recommendation: 'Focus on whole foods, fatty fish, nuts, leafy greens. Reduce processed foods and added sugars.',
    },
    {
      title: 'Sleep Hygiene',
      icon: Moon,
      color: 'from-indigo-50 to-purple-50',
      iconColor: 'text-indigo-600',
      description: 'Sleep disturbances both trigger and worsen depression. Quality sleep is essential for recovery.',
      benefits: [
        'Regulates mood-regulating neurotransmitters',
        'Allows brain to process emotions and consolidate memories',
        'Reduces cortisol and inflammatory markers',
        'Consistent sleep-wake schedule strengthens circadian rhythm',
      ],
      recommendation: 'Maintain consistent sleep/wake times. Create a dark, cool bedroom. Limit screens 1 hour before bed.',
    },
    {
      title: 'Social Connection',
      icon: Users2,
      color: 'from-pink-50 to-rose-50',
      iconColor: 'text-pink-600',
      description: 'Strong social support is one of the most powerful protective factors against depression.',
      benefits: [
        'Provides emotional validation and practical support',
        'Reduces feelings of isolation and loneliness',
        'Encourages behavioral activation',
        'Support groups offer shared understanding and coping strategies',
      ],
      recommendation: 'Schedule regular contact with friends/family. Join support groups. Engage in community activities.',
    },
    {
      title: 'Nature Exposure',
      icon: TreePine,
      color: 'from-teal-50 to-cyan-50',
      iconColor: 'text-teal-600',
      description: 'Time in nature has documented mental health benefits.',
      benefits: [
        'Reduces rumination and negative thinking',
        'Lowers cortisol and blood pressure',
        'Enhances attention and cognitive function',
        'Combines benefits of physical activity and stress reduction',
      ],
      recommendation: 'Spend 20-30 minutes in green spaces daily if possible. Even views of nature help.',
    },
    {
      title: 'Stress Management',
      icon: Wind,
      color: 'from-blue-50 to-sky-50',
      iconColor: 'text-blue-600',
      description: 'Learning to manage stress prevents HPA axis dysregulation and neuroinflammation.',
      benefits: [
        'Mindfulness breaks rumination cycles',
        'Deep breathing activates parasympathetic nervous system',
        'Yoga combines movement, breathing, and mindfulness',
        'Regular practice increases stress resilience',
      ],
      recommendation: 'Practice daily breathing exercises (see above). Try meditation or yoga. Set boundaries and prioritize rest.',
    },
  ];

  return (
    <motion.section
      id="lifestyle"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Lifestyle Interventions</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          These evidence-based lifestyle changes support recovery and can enhance the effectiveness of professional treatment
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <p className="text-gray-700 leading-relaxed">
          While professional treatment is often essential, lifestyle factors play a crucial supportive role in managing depression. These interventions address the holistic nature of well-being, recognizing the deep connection between mind and body. They can help prevent relapse, reduce symptoms, and improve overall quality of life.
        </p>
      </div>

      {/* Interventions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {interventions?.map?.((intervention, index) => {
          const Icon = intervention?.icon ?? Dumbbell;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${intervention?.color} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300`}
            >
              <Icon className={`w-12 h-12 ${intervention?.iconColor} mb-4`} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{intervention?.title}</h3>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{intervention?.description}</p>
              
              <div className="bg-white/80 rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-gray-900 mb-2">Key Benefits:</p>
                <ul className="space-y-1">
                  {intervention?.benefits?.map?.((benefit, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-gray-700">
                      <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
                      <span>{benefit}</span>
                    </li>
                  )) ?? null}
                </ul>
              </div>

              <div className="bg-primary/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-primary mb-1">Recommendation:</p>
                <p className="text-xs text-gray-700">{intervention?.recommendation}</p>
              </div>
            </motion.div>
          );
        }) ?? null}
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-yellow-900 mb-2">Important Note</h3>
        <p className="text-sm text-yellow-800 leading-relaxed">
          Lifestyle interventions are <span className="font-semibold">supportive measures</span>, not replacements for professional treatment. If you are experiencing moderate to severe depression, please consult a healthcare provider. These strategies work best when combined with appropriate medical care and therapy.
        </p>
      </div>
    </motion.section>
  );
}
