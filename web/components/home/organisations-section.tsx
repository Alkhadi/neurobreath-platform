'use client'

import Link from 'next/link'
import { GraduationCap, Users, FileText, Download, BookOpen, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HomeCardGrid from './home-card-grid'

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

  const features = [
    'Evidence-based techniques with research citations',
    'Neurodiversity-informed approach and language',
    'Flexible timing options (1-5 minutes)',
    'Clear visual and audio cues for diverse learning styles',
    'Privacy-first design with local data storage',
    'Free to use, no hidden costs or subscriptions'
  ]

  return (
    <section className="py-16 bg-white">
      <div className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            For Organisations
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Schools, therapy practices, and healthcare organisations can integrate these evidence-based tools 
            into their existing programmes. All resources respect privacy and neurodiversity.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="bg-slate-50 rounded-lg p-6 mb-12 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
            Why Organisations Choose NeuroBreath
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Cards */}
        <HomeCardGrid className="mb-12">
          {resources.map((resource) => (
            <div key={resource.title} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg">
                  {resource.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{resource.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full capitalize">
                  {resource.type}
                </span>
                <Button asChild variant="outline" size="sm">
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Implementation Support
            </h3>
            <p className="text-slate-600">
              Need help integrating breathing practices into your organisation? We're here to support you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-slate-900 mb-2">Training Materials</h4>
              <p className="text-sm text-slate-600">
                Comprehensive guides for staff training and programme implementation
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-slate-900 mb-2">Consultation</h4>
              <p className="text-sm text-slate-600">
                Guidance on adapting techniques for your specific population and setting
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-slate-900 mb-2">Custom Resources</h4>
              <p className="text-sm text-slate-600">
                Branded materials and organisation-specific implementation plans
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link href="/contact" className="flex items-center gap-2">
                Get in Touch
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Research Partnership */}
        <div className="mt-12 text-center bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Research Partnership Opportunities
          </h3>
          <p className="text-slate-600 mb-4">
            Interested in evaluating the effectiveness of breathing interventions in your setting? 
            We welcome collaboration with researchers and institutions.
          </p>
          <Button asChild variant="outline">
            <Link href="/contact?subject=research">
              Explore Research Partnerships
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
