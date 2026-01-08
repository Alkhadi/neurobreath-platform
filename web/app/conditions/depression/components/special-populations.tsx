'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Baby, Users, Heart, Rainbow } from 'lucide-react';

export function SpecialPopulations() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const populations = [
    {
      title: 'Children & Adolescents',
      icon: Baby,
      color: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600',
      prevalence: '19.2% of US adolescents (12-19)',
      uniqueFeatures: [
        'May present as irritability rather than sadness',
        'Behavioral problems and somatic complaints common',
        'Rising rates linked to social media and academic pressure',
        'Annual screening recommended for ages 12+',
      ],
      treatment: [
        'CBT and IPT are first-line psychotherapies',
        'Only fluoxetine (age 8+) and escitalopram (age 12+) FDA-approved',
        'Close monitoring for suicidal ideation when starting medication',
        'Family involvement crucial for successful treatment',
      ],
    },
    {
      title: 'Peripartum & Postpartum',
      icon: Heart,
      color: 'from-pink-50 to-rose-50',
      iconColor: 'text-pink-600',
      prevalence: '10-20% of new mothers globally',
      uniqueFeatures: [
        'Occurs during pregnancy or within first year postpartum',
        'More severe than "baby blues" (resolves in 2 weeks)',
        'Risk factors: history of depression, lack of support, difficult birth',
        'Can impair mother-infant bonding and child development',
      ],
      treatment: [
        'CBT and IPT highly effective',
        'SSRIs (sertraline, fluoxetine) often used during breastfeeding',
        'Brexanolone IV infusion FDA-approved for severe PPD',
        'MamaLift Plus digital therapeutic now available',
      ],
    },
    {
      title: 'Older Adults',
      icon: Users,
      color: 'from-purple-50 to-indigo-50',
      iconColor: 'text-purple-600',
      prevalence: '8.7% of US adults 60+ (often underdiagnosed)',
      uniqueFeatures: [
        'Often presents with somatic complaints (fatigue, pain)',
        'Cognitive symptoms may mimic dementia ("pseudodementia")',
        'Multiple medical conditions and medications complicate diagnosis',
        'Stigma and generational attitudes reduce help-seeking',
      ],
      treatment: [
        '"Start low, go slow" with medications due to sensitivity',
        'CBT, Problem-Solving Therapy, IPT all effective',
        'ECT safe and highly effective for severe cases',
        'Social engagement and physical activity important',
      ],
    },
    {
      title: 'LGBTQ+ Community',
      icon: Rainbow,
      color: 'from-yellow-50 to-amber-50',
      iconColor: 'text-yellow-600',
      prevalence: '2-3x higher rates than general population',
      uniqueFeatures: [
        'Minority stress model explains elevated rates',
        'External discrimination and violence',
        'Expectations of rejection and hypervigilance',
        'Internalized homophobia/transphobia',
      ],
      treatment: [
        'Affirming therapy that addresses unique stressors',
        'Strong LGBTQ+ community connection is protective',
        'Family acceptance crucial, especially for youth',
        'Culturally competent mental health providers essential',
      ],
    },
  ];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Depression in Special Populations</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Understanding unique presentations, risk factors, and treatment considerations across different groups
        </p>
      </div>

      {/* Populations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {populations?.map?.((pop, index) => {
          const Icon = pop?.icon ?? Baby;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.15 }}
              className={`bg-gradient-to-br ${pop?.color} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300`}
            >
              <Icon className={`w-12 h-12 ${pop?.iconColor} mb-4`} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pop?.title}</h3>
              <div className="bg-white/80 rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold text-gray-900">{pop?.prevalence}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Unique Features:</p>
                  <ul className="space-y-1">
                    {pop?.uniqueFeatures?.map?.((feature, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
                        <span>{feature}</span>
                      </li>
                    )) ?? null}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Treatment Considerations:</p>
                  <ul className="space-y-1">
                    {pop?.treatment?.map?.((item, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0 mt-1.5"></div>
                        <span>{item}</span>
                      </li>
                    )) ?? null}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        }) ?? null}
      </div>

      {/* Additional Context */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Common Thread: The Importance of Context</h3>
        <p className="text-gray-700 leading-relaxed text-sm">
          While the core biology of depression is similar across populations, the <span className="font-semibold">context matters immensely</span>. Age, life stage, cultural background, and social identity shape how depression presents, which risk factors are most relevant, and what treatments are most acceptable and effective. Culturally sensitive, individualized care that acknowledges these differences is essential for successful treatment outcomes.
        </p>
      </div>
    </motion.section>
  );
}
