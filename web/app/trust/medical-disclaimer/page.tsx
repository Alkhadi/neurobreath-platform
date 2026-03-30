import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Medical Disclaimer | Trust Centre | NeuroBreath',
  description: 'Important information about the limitations of NeuroBreath content and when to seek professional healthcare advice.',
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Medical Disclaimer</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Last reviewed: 19 January 2026</p>
        </div>
      </div>

      {/* Key warning */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-5">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">Important — Please Read</p>
        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
          NeuroBreath provides <strong>educational and informational content only</strong>. Nothing on this platform
          constitutes medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional
          for decisions about your health or the health of a child in your care.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. Nature of Content</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          All content on NeuroBreath — including articles, tools, exercises, assessments, routines, and resources —
          is produced for general informational and educational purposes. It is informed by published research and
          guidance from reputable organisations including the NHS, NICE, BDA, IDA, and Cochrane.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          This content does not constitute and must not be relied upon as medical, clinical, psychological, or
          therapeutic advice. It is not a substitute for the professional judgement of a qualified clinician.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Screening Tools Are Not Diagnostic</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Assessment and screening tools on NeuroBreath (including dyslexia screeners, ADHD indicators, and autism
          checklists) are provided for <strong>informational purposes only</strong>. They do not constitute formal
          assessment or diagnosis. Only a qualified professional — such as an Educational Psychologist, Clinical
          Psychologist, Paediatrician, or Specialist Teacher Assessor — can provide a formal diagnosis.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Results from our tools should be used to inform conversations with professionals, not to reach conclusions
          independently.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. Exercises, Strategies and Routines</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Breathing exercises, daily routines, study strategies, and other tools described on this platform are
          evidence-informed wellness activities. They are not medical treatments. Individuals with health conditions,
          recent surgery, respiratory conditions, or complex needs should consult their GP or specialist before
          undertaking any exercise programme.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">4. No Clinician–Patient Relationship</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Use of NeuroBreath does not create a clinician–patient or therapist–client relationship of any kind.
          NeuroBreath is not a regulated healthcare provider and does not provide clinical services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">5. Content Currency</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          We review our content on a regular schedule (see our{' '}
          <Link href="/trust/editorial-policy" className="text-blue-600 dark:text-blue-400 underline">
            Editorial Policy
          </Link>
          ), but medical guidance changes. Always verify important health decisions against current NHS or NICE
          guidance, and with a qualified professional.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">6. When You Must Seek Professional Help</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Do not use this platform as a substitute for professional care when:</p>
        <ul className="space-y-2">
          {[
            'You or someone in your care is experiencing a mental health crisis',
            'You are concerned about the safety of yourself or others',
            'A child is displaying significant developmental difficulties requiring assessment',
            'Symptoms are severe, worsening, or significantly impacting daily life',
            'You need an official diagnosis for educational, legal, or employment purposes',
          ].map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* UK Crisis contacts */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm font-bold text-red-900 dark:text-red-100">In a crisis, seek immediate help:</p>
        </div>
        <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
          <li><strong>Emergency:</strong> 999</li>
          <li><strong>NHS 111:</strong> 111 (non-emergency medical)</li>
          <li><strong>Samaritans:</strong> 116 123 (free, 24/7)</li>
          <li><strong>Crisis text line:</strong> Text SHOUT to 85258</li>
          <li><strong>PAPYRUS (under 35):</strong> 0800 068 41 41</li>
        </ul>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">7. Liability</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          To the fullest extent permitted by law, NeuroBreath excludes all liability for any loss, injury, or
          damage arising from reliance on content published on this platform. This exclusion does not apply where
          liability cannot be lawfully excluded under UK consumer law.
        </p>
      </section>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Questions about this disclaimer? Contact us at{' '}
          <Link href="/trust/contact" className="text-blue-600 dark:text-blue-400 underline">
            our contact page
          </Link>
          . See also our{' '}
          <Link href="/trust/terms" className="text-blue-600 dark:text-blue-400 underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/trust/privacy" className="text-blue-600 dark:text-blue-400 underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
