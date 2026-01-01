'use client'

import Link from 'next/link'
import { Clock, Target, BookOpen, Smile, Brain, ArrowRight, Sparkles } from 'lucide-react'

export default function GoalsSection() {
  const goals = [
    {
      id: 'calm',
      title: 'Calm',
      description: 'Reduce stress and anxiety',
      icon: '😌',
      href: '/stress',
      gradient: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverBg: 'hover:bg-blue-100',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'sleep', 
      title: 'Sleep',
      description: 'Improve rest and relaxation',
      icon: '🌙',
      href: '/sleep',
      gradient: 'from-indigo-500 to-purple-400',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      hoverBg: 'hover:bg-indigo-100',
      iconBg: 'bg-indigo-100'
    },
    {
      id: 'focus',
      title: 'Focus',
      description: 'Enhance concentration',
      icon: '🎯',
      href: '/breathing/training/focus-garden',
      gradient: 'from-green-500 to-emerald-400',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverBg: 'hover:bg-green-100',
      iconBg: 'bg-green-100'
    },
    {
      id: 'school',
      title: 'School',
      description: 'Classroom-ready techniques',
      icon: '📚',
      href: '/teacher-quick-pack',
      gradient: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverBg: 'hover:bg-purple-100',
      iconBg: 'bg-purple-100'
    }
  ]

  const durations = [
    {
      time: '1 min',
      technique: 'SOS Breathing',
      href: '/techniques/sos',
      description: 'Quick emergency reset when you need it most',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      icon: '⚡'
    },
    {
      time: '3 min',
      technique: 'Box Breathing',
      href: '/techniques/box-breathing', 
      description: 'Steady focus and calm for everyday moments',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-100',
      icon: '🔲'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Personalized for you
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Select a goal for tailored cues, pacing, and guides suited to your needs.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-4xl mx-auto mb-16">
          {/* Goals Section - Full Width */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Target className="w-5 h-5 text-slate-700" />
              <h3 className="text-lg font-semibold text-slate-900">Pick your goal</h3>
            </div>
            <div className="space-y-4">
              {goals.map((goal) => (
                <Link
                  key={goal.id}
                  href={goal.href}
                  className={`
                    group relative block p-6 rounded-2xl border-2 transition-all duration-300
                    ${goal.bgColor} ${goal.borderColor} ${goal.hoverBg}
                    hover:scale-[1.01] hover:shadow-lg hover:border-transparent
                  `}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${goal.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative flex items-center gap-6">
                    <div className={`flex-shrink-0 w-16 h-16 ${goal.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{goal.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xl mb-1 group-hover:text-slate-800">
                        {goal.title}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Duration Section */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-slate-700" />
              <h3 className="text-lg font-semibold text-slate-900">How long do you have?</h3>
            </div>
            <div className="space-y-4">
              {durations.map((duration) => {
                const isFullWidth = duration.technique === 'SOS Breathing'
                
                return (
                  <Link
                    key={duration.time}
                    href={duration.href}
                    className={`
                      group block p-5 rounded-2xl border-2 transition-all duration-300
                      ${duration.bgColor} ${duration.borderColor}
                      hover:shadow-lg hover:scale-[1.02] hover:border-transparent
                      ${isFullWidth ? '' : 'md:inline-block md:w-[calc(50%-0.5rem)]'}
                    `}
                    style={isFullWidth ? {} : { marginRight: '1rem' }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${duration.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl">{duration.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold ${duration.color} bg-white/80 px-2 py-0.5 rounded-full`}>
                            {duration.time}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">
                          {duration.technique}
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {duration.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors pl-16">
                      <span>Start now</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Neurodiversity Features - Compact Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
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
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 px-3 py-1.5 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Visual cues
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 px-3 py-1.5 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Sensory-friendly
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 px-3 py-1.5 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Keyboard accessible
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 px-3 py-1.5 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Evidence-based
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
