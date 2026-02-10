'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, School, Briefcase, Home, Users } from 'lucide-react'

const contexts = [
  {
    id: 'school',
    name: 'School',
    icon: School,
    color: 'from-blue-500 to-cyan-500',
    situations: [
      { situation: 'Before a test', technique: 'Box Breathing', link: '/techniques/box-breathing' },
      { situation: 'Between classes', technique: 'SOS Reset', link: '/techniques/sos' },
      { situation: 'Study break', technique: 'Coherent 5-5', link: '/techniques/coherent' },
      { situation: 'Before presentation', technique: 'Box Breathing', link: '/techniques/box-breathing' }
    ]
  },
  {
    id: 'work',
    name: 'Work',
    icon: Briefcase,
    color: 'from-purple-500 to-pink-500',
    situations: [
      { situation: 'Before meetings', technique: 'Box Breathing', link: '/techniques/box-breathing' },
      { situation: 'Task transitions', technique: 'Coherent 5-5', link: '/techniques/coherent' },
      { situation: 'Stressful deadline', technique: 'SOS Reset', link: '/techniques/sos' },
      { situation: 'End of day', technique: '4-7-8 Breathing', link: '/techniques/4-7-8' }
    ]
  },
  {
    id: 'home',
    name: 'Home',
    icon: Home,
    color: 'from-green-500 to-emerald-500',
    situations: [
      { situation: 'Morning routine', technique: 'Coherent 5-5', link: '/techniques/coherent' },
      { situation: 'After work', technique: '4-7-8 Breathing', link: '/techniques/4-7-8' },
      { situation: 'Before bed', technique: '4-7-8 Breathing', link: '/techniques/4-7-8' },
      { situation: 'Family stress', technique: 'Box Breathing', link: '/techniques/box-breathing' }
    ]
  },
  {
    id: 'social',
    name: 'Social',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    situations: [
      { situation: 'Before event', technique: 'Box Breathing', link: '/techniques/box-breathing' },
      { situation: 'Social anxiety', technique: '4-7-8 Breathing', link: '/techniques/4-7-8' },
      { situation: 'Overstimulation', technique: 'SOS Reset', link: '/techniques/sos' },
      { situation: 'After socializing', technique: 'Coherent 5-5', link: '/techniques/coherent' }
    ]
  }
]

export default function FocusTilesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/tools/breath-tools"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Breath Tools</Link>
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Focus Tiles</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Context-based breathing suggestions for different situations. Find the right technique for the right moment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contexts?.map((context) => {
            const Icon = context.icon
            return (
              <div key={context.id} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${context.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{context.name}</h2>
                </div>

                <div className="space-y-3">
                  {context?.situations?.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{item.situation}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">{item.technique}</p>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={item.link}>Try →</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to Use</h2>
          <p className="text-gray-700 mb-4">
            Choose the context that matches your current situation, then select a specific scenario for a tailored breathing technique recommendation.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Find your current context (school, work, home, or social)</li>
            <li>Identify the specific situation you're in</li>
            <li>Follow the recommended technique</li>
            <li>Practice for 1-5 minutes as needed</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
