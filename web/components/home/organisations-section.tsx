'use client'

import Link from 'next/link'
import { GraduationCap, Users, FileText, Download, BookOpen, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HomeCardGrid from './home-card-grid'
import { cardClass } from '@/lib/ui'

// Hoisted outside component to satisfy react/require-constant
const features = [
  'Evidence-based techniques with research citations',
  'Neurodiversity-informed approach and language',
  'Flexible timing options (1-5 minutes)',
  'Clear visual and audio cues for diverse learning styles',
  'Privacy-first design with local data storage',
  'Free to use, no hidden costs or subscriptions'
]

// resources contains JSX so remains inside the component render scope
export default function OrganisationsSection() {
  const resources = [
    {
      title: 'Teacher Quick Pack',
      description: 'Classroom-ready breathing exercises with clear instructions and timing guides',
      icon: <GraduationCap className="w-6 h-6" />,
      href: '/teacher-quick-pack',
      type: 'interactive'
    },
    {
      title: 'School Implementation Guide',
      description: 'Step-by-step guidance for introducing breathing practices in educational settings',
      icon: <BookOpen className="w-6 h-6" />,
      href: '/schools',
      type: 'guide'
    },
    {
      title: 'Printable Worksheets',
      description: 'Downloadable resources for offline use in classrooms and therapy sessions',
      icon: <FileText className="w-6 h-6" />,
      href: '/downloads',
      type: 'download'
    },
    {
      title: 'Professional Resources',
      description: 'Evidence-based materials for therapists, counsellors, and healthcare providers',
      icon: <Users className="w-6 h-6" />,
      href: '/resources',
      type: 'professional'
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-[#0B1220]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            For Organisations
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Schools, therapy practices, and healthcare organisations can integrate these evidence-based tools
            into their existing programmes. All resources respect privacy and neurodiversity.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 md:p-8 mb-12 border border-slate-200 dark:border-slate-700 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">
            Why Organisations Choose NeuroBreath
          </h3>
          <div className="flex flex-wrap gap-4 [&>*]:basis-full md:[&>*]:basis-[calc(50%-8px)] lg:[&>*]:basis-[calc(33.333%-11px)] [&>*]:min-w-0">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <span className="text-[#4ECDC4] mt-0.5 flex-shrink-0">✓</span>
                <span className="text-slate-700 dark:text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Cards */}
        <HomeCardGrid className="mb-12">
          {resources.map((resource) => (
            <div key={resource.title} className={`${cardClass} flex flex-col`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-2xl flex-shrink-0">
                  {resource.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{resource.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{resource.description}</p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full capitalize">
                  {resource.type}
                </span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-2xl border-slate-200 dark:border-slate-600 hover:border-[#4ECDC4] hover:text-[#4ECDC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 transition-all duration-300"
                >
                  <Link href={resource.href} className="flex items-center gap-2">
                    {resource.type === 'download' ? (
                      <Download className="w-4 h-4" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    Access
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </HomeCardGrid>

        {/* Implementation Support */}
        <div className="bg-blue-50 dark:bg-slate-800/50 border border-blue-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Implementation Support
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Need help integrating breathing practices into your organisation? We're here to support you.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-center [&>*]:basis-full md:[&>*]:basis-[calc(33.333%-16px)] [&>*]:min-w-0">
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Training Materials</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Comprehensive guides for staff training and programme implementation
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Consultation</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Guidance on adapting techniques for your specific population and setting
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Custom Resources</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Branded materials and organisation-specific implementation plans
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#959E0B] to-[#4ECDC4] text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
            >
              <Link href="/contact" className="flex items-center gap-2">
                Get in Touch
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Research Partnership */}
        <div className="mt-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Research Partnership Opportunities
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Interested in evaluating the effectiveness of breathing interventions in your setting?
            We welcome collaboration with researchers and institutions.
          </p>
          <Button
            asChild
            variant="outline"
            className="rounded-2xl border-slate-200 dark:border-slate-600 hover:border-[#4ECDC4] hover:text-[#4ECDC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 transition-all duration-300"
          >
            <Link href="/contact?subject=research">
              Explore Research Partnerships
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
