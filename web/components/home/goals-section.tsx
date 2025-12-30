'use client'

import Link from 'next/link'
import { Clock, Target, BookOpen, Smile, Brain } from 'lucide-react'

export default function GoalsSection() {
  const goals = [
    {
      id: 'calm',
      title: 'Calm',
      description: 'Reduce stress and anxiety',
      icon: <div className="text-blue-500 text-2xl">😌</div>,
      href: '/stress',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      id: 'sleep', 
      title: 'Sleep',
      description: 'Improve rest and relaxation',
      icon: <div className="text-indigo-500 text-2xl">🌙</div>,
      href: '/sleep',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    },
    {
      id: 'focus',
      title: 'Focus',
      description: 'Enhance concentration',
      icon: <div className="text-green-500 text-2xl">🎯</div>,
      href: '/breathing/focus',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      id: 'school',
      title: 'School',
      description: 'Classroom-ready techniques',
      icon: <BookOpen className="w-6 h-6 text-purple-500" />,
      href: '/teacher-quick-pack',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      id: 'mood',
      title: 'Mood',
      description: 'Emotional regulation support',
      icon: <Smile className="w-6 h-6 text-pink-500" />,
      href: '/conditions/mood',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
    }
  ]

  const durations = [
    {
      time: '1 minute',
      technique: 'SOS Breathing',
      href: '/techniques/sos',
      description: 'Quick emergency reset',
      icon: <Clock className="w-5 h-5" />
    },
    {
      time: '3 minutes',
      technique: 'Box Breathing',
      href: '/techniques/box-breathing', 
      description: 'Steady focus and calm',
      icon: <Target className="w-5 h-5" />
    },
    {
      time: '5 minutes',
      technique: 'Coherent Breathing',
      href: '/techniques/coherent',
      description: 'Deep relaxation',
      icon: <Brain className="w-5 h-5" />
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select a goal to receive tailored cues, pacing, and downloadable guides suited to your needs.
          </p>
        </div>

        {/* Goals Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">Pick your goal</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {goals.map((goal) => (
              <Link
                key={goal.id}
                href={goal.href}
                className={`
                  p-6 rounded-lg border-2 transition-all duration-200 text-center group
                  ${goal.color}
                  hover:scale-105 hover:shadow-md
                `}
              >
                <div className="mb-3 flex justify-center">
                  {goal.icon}
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{goal.title}</h4>
                <p className="text-sm text-slate-600">{goal.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Duration Picker */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">How long do you have?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {durations.map((duration) => (
              <Link
                key={duration.time}
                href={duration.href}
                className="p-6 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white rounded-md shadow-sm group-hover:shadow-md transition-shadow">
                    {duration.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{duration.time}</h4>
                    <p className="text-sm text-slate-600">{duration.technique}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{duration.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Neurodiversity Features */}
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-slate-600" />
            Built for Neurodiversity
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Clear language and optional visual cues
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Alternative cues for sensory-sensitive learners
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Accessible contrast and keyboard-first controls
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Evidence citations for every technique
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
