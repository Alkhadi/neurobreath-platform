'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Zap, Smartphone, Cpu } from 'lucide-react';

export function EmergingTherapies() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const therapies = [
    {
      category: 'Psychedelic-Assisted Therapy',
      icon: Sparkles,
      treatments: [
        {
          name: 'Ketamine & Esketamine',
          description: 'NMDA receptor antagonist producing rapid antidepressant effects, often within hours. Esketamine (Spravato) FDA-approved for treatment-resistant depression and acute suicidality.',
          status: 'FDA Approved (Esketamine)',
          mechanism: 'Enhances neuroplasticity via glutamate modulation',
        },
        {
          name: 'Psilocybin',
          description: 'Psychoactive compound from mushrooms. Clinical trials show rapid, significant, and sustained reductions in depressive symptoms with 1-2 doses in supportive therapy context.',
          status: 'Phase 3 Trials (Expected FDA approval ~2026)',
          mechanism: 'Serotonin 5-HT2A receptor agonist; promotes neural connectivity',
        },
      ],
    },
    {
      category: 'Neuromodulation',
      icon: Zap,
      treatments: [
        {
          name: 'Transcranial Magnetic Stimulation (TMS)',
          description: 'Non-invasive technique using magnetic pulses to stimulate the dorsolateral prefrontal cortex. New protocols like theta burst stimulation (iTBS) and Stanford Neuromodulation Therapy show faster results.',
          status: 'FDA Approved; Advanced protocols in development',
          mechanism: 'Modulates cortical activity in underactive brain regions',
        },
        {
          name: 'Vagus Nerve Stimulation (VNS)',
          description: 'Implantable device sending electrical pulses to the brain via vagus nerve. Benefits accumulate over time, with increasing remission rates after 1+ years.',
          status: 'FDA Approved for chronic TRD',
          mechanism: 'Modulates mood-regulating brain circuits',
        },
      ],
    },
    {
      category: 'Digital Therapeutics',
      icon: Smartphone,
      treatments: [
        {
          name: 'Rejoyn',
          description: 'First FDA-cleared prescription digital therapeutic for adjunctive treatment of MDD. 6-week program combining cognitive-emotional training and therapeutic lessons.',
          status: 'FDA Cleared (April 2024)',
          mechanism: 'Targets neural networks through neuroplasticity',
        },
        {
          name: 'MamaLift Plus',
          description: 'Digital therapeutic specifically designed for postpartum depression, providing accessible, evidence-based support.',
          status: 'FDA Cleared',
          mechanism: 'Cognitive training and psychoeducation',
        },
      ],
    },
    {
      category: 'Novel Pharmacology',
      icon: Cpu,
      treatments: [
        {
          name: 'Anti-Inflammatory Agents',
          description: 'Given the neuroinflammation link, agents like minocycline, NSAIDs, and omega-3 fatty acids show promise in reducing depressive symptoms.',
          status: 'Clinical Research Phase',
          mechanism: 'Reduces inflammatory cytokines',
        },
        {
          name: 'GABA Modulators (Brexanolone)',
          description: 'Neurosteroid specifically FDA-approved for postpartum depression. Targets GABA system for rapid symptom reduction.',
          status: 'FDA Approved (PPD)',
          mechanism: 'Modulates GABA-A receptors',
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    if (status?.includes('FDA Approved') || status?.includes('FDA Cleared')) return 'bg-green-100 text-green-800';
    if (status?.includes('Phase 3')) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Emerging & Novel Therapies</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Breakthrough treatments offering new hope for treatment-resistant depression and faster symptom relief
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg p-6 sm:p-8">
        <p className="text-gray-700 leading-relaxed">
          The period leading into <span className="font-semibold">2026</span> is marked by groundbreaking advancements in depression treatment. These innovations move beyond traditional monoamine-targeting medications, offering new mechanisms of action, faster onset, and options for those who haven't responded to conventional treatments.
        </p>
      </div>

      {/* Therapies by Category */}
      <div className="space-y-8">
        {therapies?.map?.((category, catIndex) => {
          const Icon = category?.icon ?? Sparkles;
          return (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: catIndex * 0.15 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-gray-900">{category?.category}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {category?.treatments?.map?.((treatment, treatIndex) => (
                  <div
                    key={treatIndex}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-bold text-gray-900">{treatment?.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(treatment?.status ?? '')}`}>
                        {treatment?.status?.split('(')?.[0]?.trim()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{treatment?.description}</p>
                    <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                      <p className="text-xs font-semibold text-blue-900">Mechanism:</p>
                      <p className="text-xs text-blue-800">{treatment?.mechanism}</p>
                    </div>
                  </div>
                )) ?? null}
              </div>
            </motion.div>
          );
        }) ?? null}
      </div>

      {/* Key Takeaway */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl shadow-lg p-6 sm:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-3">What This Means for Treatment</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Rapid relief:</span> Ketamine and psychedelics can work in hours to days, not weeks</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Treatment-resistant options:</span> New pathways when traditional treatments fail</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Personalized approaches:</span> Biomarkers may soon guide treatment selection</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Increased accessibility:</span> Digital therapeutics bring evidence-based care to more people</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
