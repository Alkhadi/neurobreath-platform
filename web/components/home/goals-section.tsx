'use client'

import Link from 'next/link'
import { Clock, Target, Brain, ArrowRight, Sparkles } from 'lucide-react'

// Hoisted outside component to satisfy react/require-constant
const goals = [
  {
    id: 'calm',
    title: 'Calm',
    description: 'Reduce stress and anxiety',
    icon: '😌',
    href: '/stress',
    gradient: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50'
  },
  {
    id: 'sleep',
    title: 'Sleep',
    description: 'Improve rest and relaxation',
    icon: '🌙',
    href: '/sleep',
    gradient: 'from-indigo-500 to-purple-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    hoverBg: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/50'
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Enhance concentration',
    icon: '🎯',
    href: '/breathing/training/focus-garden',
    gradient: 'from-green-500 to-emerald-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    hoverBg: 'hover:bg-green-100 dark:hover:bg-green-900/40',
    iconBg: 'bg-green-100 dark:bg-green-900/50'
  },
  {
    id: 'school',
    title: 'School',
    description: 'Classroom-ready techniques',
    icon: '📚',
    href: '/teacher-quick-pack',
    gradient: 'from-purple-500 to-pink-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-900/40',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50'
  }
]

const durations = [
  {
    time: '1 min',
    technique: 'SOS Breathing',
    href: '/techniques/sos',
    description: 'Quick emergency reset when you need it most',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    icon: '⚡'
  },
  {
    time: '3 min',
    technique: 'Box Breathing',
    href: '/techniques/box-breathing',
    description: 'Steady focus and calm for everyday moments',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    borderColor: 'border-teal-200 dark:border-teal-800',
    iconBg: 'bg-teal-100 dark:bg-teal-900/50',
    icon: '🔲'
  }
]

const neuroChips = [
  { label: 'Visual cues', dot: true },
  { label: 'Sensory-friendly', dot: true },
  { label: 'Keyboard accessible', dot: true },
  { label: 'Evidence-based', dot: true },
]

export default function GoalsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#4ECDC4]/10 text-[#4ECDC4] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Personalized for you
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Select a goal for tailored cues, pacing, and guides suited to your needs.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-16">
          {/* Goals */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Target className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pick your goal</h3>
            </div>
            <div className="space-y-4">
              {goals.map((goal) => (
                <Link
                  key={goal.id}
                  href={goal.href}
                  className={`
                    group relative block p-6 md:p-8 rounded-3xl border-2 transition-all duration-300
                    ${goal.bgColor} ${goal.borderColor} ${goal.hoverBg}
                    hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.015] hover:border-transparent
                    active:scale-[0.99]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60
                  `}
                >
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${goal.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative flex items-center gap-6">
                    <div className={`flex-shrink-0 w-16 h-16 ${goal.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{goal.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xl mb-1">
                        {goal.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">How long do you have?</h3>
            </div>
            <div className="space-y-4">
              {durations.map((duration) => {
                const isFullWidth = duration.technique === 'SOS Breathing'

                return (
                  <Link
                    key={duration.time}
                    href={duration.href}
                    className={`
                      group block p-5 md:p-6 rounded-3xl border-2 transition-all duration-300
                      ${duration.bgColor} ${duration.borderColor}
                      hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.015] hover:border-transparent
                      active:scale-[0.99]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60
                      ${isFullWidth ? '' : 'md:inline-block md:w-[calc(50%-0.5rem)]'}
                    `}
                    style={isFullWidth ? {} : { marginRight: '1rem' }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${duration.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl">{duration.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold ${duration.color} bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-full`}>
                            {duration.time}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                          {duration.technique}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {duration.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors pl-16">
                      <span>Start now</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Neurodiversity Features Banner */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#0B1220] rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Built for Neurodiversity</h3>
              <p className="text-slate-300 text-sm">
                Designed with inclusive, accessible principles to support all learners
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {neuroChips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 px-3 py-1.5 rounded-full text-xs font-medium"
                >
                  <span className="w-1.5 h-1.5 bg-[#4ECDC4] rounded-full" />
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
