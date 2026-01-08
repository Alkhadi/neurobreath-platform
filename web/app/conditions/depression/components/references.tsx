'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, ExternalLink } from 'lucide-react';

export function References() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const references = [
    {
      category: 'Clinical Guidelines & Diagnostic Criteria',
      citations: [
        'American Psychiatric Association. (2022). Diagnostic and Statistical Manual of Mental Disorders (5th ed., text rev.). https://www.psychiatry.org/psychiatrists/practice/dsm',
        'American Psychological Association. (2019). Clinical Practice Guideline for the Treatment of Depression Across Three Age Cohorts. https://www.apa.org/depression-guideline',
      ],
    },
    {
      category: 'Neurobiology & Pathophysiology',
      citations: [
        'The Neurobiology of Depression: Focus on the HPA Axis and Neuroinflammation. (2026). MDPI International Journal of Molecular Sciences, 26(7), 2940.',
        'The HPA Axis in Depression: Pathophysiology and Clinical Implications. PMC8533829.',
        'The Role of Neuroinflammation in Depression: A Review. (2026). MDPI, 26(4), 1645.',
      ],
    },
    {
      category: 'Treatment & Pharmacotherapy',
      citations: [
        'Major depressive disorder: Validated treatments and future challenges. PMC8610877.',
        'Nonpharmacologic and Pharmacologic Treatments of Adults in the Acute Phase of Major Depressive Disorder. Annals of Internal Medicine, 2024.',
      ],
    },
    {
      category: 'Emerging Therapies',
      citations: [
        'Emerging therapies for depression: ketamine- and psychedelic-based antidepressant treatments. Exploration Publishing, 2024.',
        'New and emerging treatments for major depressive disorder. The BMJ, 386.',
        'Novel Therapies Spur Incremental Growth in Depression Treatment to 2025. Pharmalive.',
      ],
    },
    {
      category: 'Special Populations',
      citations: [
        'Depression in Children and Adolescents: A review. PMC6345140.',
        'Clinical Practice Guideline for the Treatment of Depression in Adolescents. JAACAP, 2022.',
        'Risk Factors for Postpartum Depression: An Umbrella Review. PMC9711915.',
        'Depression in older adults. PMC6779084.',
      ],
    },
    {
      category: 'Statistics & Epidemiology',
      citations: [
        'Mental health statistics: depression. UK House of Commons Library Research Briefing SN06988.',
        'Depression prevalence data, August 2021-August 2023. Centers for Disease Control and Prevention (CDC).',
        'Mental Health Statistics 2023. Mind UK.',
        'Mental health pressures data analysis. British Medical Association (BMA).',
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
        <div className="flex items-center justify-center space-x-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">References & Sources</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          This comprehensive guide is based on peer-reviewed research and authoritative clinical guidelines
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
        {references?.map?.((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-bold text-primary flex items-center space-x-2">
              <ExternalLink size={18} />
              <span>{section?.category}</span>
            </h3>
            <ul className="space-y-2 pl-4">
              {section?.citations?.map?.((citation, citIndex) => (
                <li key={citIndex} className="text-sm text-gray-700 leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <span className="text-primary font-bold flex-shrink-0">[{index + 1}.{citIndex + 1}]</span>
                    <span>{citation}</span>
                  </div>
                </li>
              )) ?? null}
            </ul>
          </motion.div>
        )) ?? null}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-yellow-900 mb-2">Medical Disclaimer</h3>
        <p className="text-sm text-yellow-800 leading-relaxed">
          This resource is for educational and informational purposes only and is not intended as medical advice. It should not be used as a substitute for professional medical diagnosis, treatment, or care. If you are experiencing symptoms of depression or are in crisis, please consult a qualified healthcare provider or contact emergency services immediately. The information presented reflects current evidence as of January 2026 and is subject to ongoing research and updates.
        </p>
      </div>

      {/* Additional Resources */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Additional Authoritative Sources</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-900 mb-1">🇬🇧 UK Resources:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• NHS Mental Health Services</li>
              <li>• National Institute for Health and Care Excellence (NICE)</li>
              <li>• Royal College of Psychiatrists</li>
              <li>• Mind UK</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">🇺🇸 US Resources:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• National Institute of Mental Health (NIMH)</li>
              <li>• American Psychiatric Association (APA)</li>
              <li>• National Alliance on Mental Illness (NAMI)</li>
              <li>• Substance Abuse and Mental Health Services Administration (SAMHSA)</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
