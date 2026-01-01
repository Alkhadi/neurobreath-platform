'use client'

import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useUserContext } from '@/hooks/useAutismProgress'
import { Phone, AlertCircle } from 'lucide-react'

export function CrisisSupport() {
  const { context } = useUserContext()

  const crisisInfo = {
    uk: {
      lines: [
        { name: 'NHS 111 (option 2)', number: '111', desc: 'Mental health crisis support' },
        { name: 'Samaritans', number: '116 123', desc: '24/7 emotional support (free)' },
        { name: 'Shout Crisis Text Line', number: 'Text SHOUT to 85258', desc: '24/7 text support' }
      ],
      emergency: '999'
    },
    us: {
      lines: [
        { name: '988 Suicide & Crisis Lifeline', number: '988', desc: '24/7 crisis support' },
        { name: 'Crisis Text Line', number: 'Text HOME to 741741', desc: '24/7 text support' },
        { name: 'Autism Society Helpline', number: '1-800-328-8476', desc: 'Autism-specific support' }
      ],
      emergency: '911'
    },
    eu: {
      lines: [
        { name: 'EU-wide emergency', number: '112', desc: 'General emergency services' },
        { name: 'National crisis lines', number: 'varies', desc: 'Check local resources' }
      ],
      emergency: '112'
    }
  }

  const info = crisisInfo[context.country]

  return (
    <section id="crisis" className="scroll-mt-24 bg-red-50/70 border-y border-red-200 py-10">
      <div className="container max-w-5xl mx-auto px-4">
        <Alert className="bg-white/90 backdrop-blur border-red-300 shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold text-gray-900">Crisis support</h2>
              <p className="text-sm text-gray-600">
                If you or someone else is at risk of harm, use the options below. If in immediate danger, call{' '}
                <strong className="text-gray-900">{info.emergency}</strong>.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {info.lines.map((line, i) => (
                <div key={i} className="rounded-lg border bg-white p-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md bg-red-100 p-2">
                      <Phone className="h-4 w-4 text-red-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{line.name}</div>
                      <div className="text-sm text-gray-700">{line.number}</div>
                      <div className="text-xs text-gray-600 mt-1">{line.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-600">
              Educational site only — we can’t provide emergency response. If you can, stay with the person and
              remove immediate means of harm while you contact emergency services.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </section>
  )
}

