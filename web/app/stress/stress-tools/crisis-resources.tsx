'use client'

import { Card } from '@/components/ui/card'
import { Phone, MessageCircle, Globe, Heart } from 'lucide-react'

const ukResources = [
  { name: 'Samaritans', phone: '116 123', description: 'Free 24/7 support for anyone in distress', link: 'https://www.samaritans.org' },
  { name: 'NHS Mental Health', phone: '111', description: 'Press 2 for mental health crisis support', link: 'https://www.nhs.uk/mental-health' },
  { name: 'SHOUT', text: 'SHOUT to 85258', description: 'Free 24/7 text support', link: 'https://www.giveusashout.org' },
  { name: 'CALM', phone: '0800 58 58 58', description: 'For men, 5pm-midnight daily', link: 'https://www.thecalmzone.net' },
  { name: 'Papyrus (under 35)', phone: '0800 068 4141', description: 'Suicide prevention for young people', link: 'https://www.papyrus-uk.org' },
]

const usResources = [
  { name: '988 Suicide & Crisis Lifeline', phone: '988', description: 'Free 24/7 support (call or text)', link: 'https://988lifeline.org' },
  { name: 'Crisis Text Line', text: 'HOME to 741741', description: 'Free 24/7 text support', link: 'https://www.crisistextline.org' },
  { name: 'SAMHSA Helpline', phone: '1-800-662-4357', description: 'Treatment referrals, 24/7', link: 'https://www.samhsa.gov' },
  { name: 'NAMI Helpline', phone: '1-800-950-6264', description: 'M-F 10am-10pm ET', link: 'https://www.nami.org' },
]

const internationalResources = [
  { name: 'International Association for Suicide Prevention', link: 'https://www.iasp.info/resources/Crisis_Centres/' },
  { name: 'Befrienders Worldwide', link: 'https://befrienders.org' },
]

export function CrisisResources() {
  return (
    <div className="space-y-6">
      {/* Emergency Banner */}
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <Heart className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">
              If you're in immediate danger or medical emergency, call 999 (UK) or 911 (US)
            </p>
            <p className="text-sm text-red-700 mt-1">
              These resources are for mental health support, not medical emergencies.
            </p>
          </div>
        </div>
      </Card>

      {/* UK Resources */}
      <Card className="p-6">
        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="text-xl">🇬🇧</span> UK Crisis Support
        </h4>
        <div className="space-y-4">
          {ukResources.map((r) => (
            <div key={r.name} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-muted-foreground">{r.description}</div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {r.phone && (
                  <a
                    href={`tel:${r.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    <Phone className="h-4 w-4" /> {r.phone}
                  </a>
                )}
                {r.text && (
                  <span className="flex items-center gap-1 text-sm font-medium text-purple-600">
                    <MessageCircle className="h-4 w-4" /> {r.text}
                  </span>
                )}
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <Globe className="h-3 w-3" /> Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* US Resources */}
      <Card className="p-6">
        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="text-xl">🇺🇸</span> US Crisis Support
        </h4>
        <div className="space-y-4">
          {usResources.map((r) => (
            <div key={r.name} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-muted-foreground">{r.description}</div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {r.phone && (
                  <a
                    href={`tel:${r.phone.replace(/\s/g, '').replace(/-/g, '')}`}
                    className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    <Phone className="h-4 w-4" /> {r.phone}
                  </a>
                )}
                {r.text && (
                  <span className="flex items-center gap-1 text-sm font-medium text-purple-600">
                    <MessageCircle className="h-4 w-4" /> {r.text}
                  </span>
                )}
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <Globe className="h-3 w-3" /> Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* International */}
      <Card className="p-6">
        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="text-xl">🌍</span> International Resources
        </h4>
        <div className="space-y-3">
          {internationalResources.map((r) => (
            <a
              key={r.name}
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Globe className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-600 hover:underline">{r.name}</span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}
