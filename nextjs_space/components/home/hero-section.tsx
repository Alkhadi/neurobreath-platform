'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import BreathingOrbit from '@/components/breathing-orbit'
import { breathingTechniques } from '@/lib/breathing-data'
import { getDeviceId } from '@/lib/device-id'
import Link from 'next/link'

export default function HeroSection() {
  const [todayMinutes, setTodayMinutes] = useState(0)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const deviceId = getDeviceId()
        const response = await fetch(`/api/progress?deviceId=${deviceId}`)
        if (response?.ok) {
          const data = await response.json()
          setTodayMinutes(data?.totalMinutes ?? 0)
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error)
      }
    }

    fetchProgress()
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Measured Breathing & Relief
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Clinically referenced, neuro-inclusive breathing tools with clear guidance, timers and safety notes for calm, focus, and emotional regulation.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">Neuro-inclusive</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">Evidence-based</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">Share-ready</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="#daily-practice">Start Daily Player</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/techniques/box-breathing">Try Box Breathing</Link>
              </Button>
              <Button asChild size="lg" variant="destructive">
                <Link href="/techniques/sos">SOS 60s Reset</Link>
              </Button>
            </div>
          </div>

          {/* Breathing Orbit */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inhale Hold Exhale</h3>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Today's focused minutes:</span>{' '}
                <strong className="text-purple-600 text-lg">{todayMinutes}</strong> min
              </div>
            </div>
            <BreathingOrbit technique={breathingTechniques['box-4444']} />
            <p className="text-xs text-gray-500 mt-4 text-center">
              Breathing guidance: inhale for four counts, hold for two counts, and exhale for six counts.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
