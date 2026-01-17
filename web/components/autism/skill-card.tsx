'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Skill } from '@/types/autism'
import { useAutismProgress } from '@/hooks/useAutismProgress'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function SkillCard({ skill }: { skill: Skill }) {
  const [expanded, setExpanded] = useState(false)
  const { logSession } = useAutismProgress()

  const handleLogPractice = () => {
    logSession(5, skill.id)
    toast.success('Practice logged', {
      description: `${skill.title} (+5 XP)`
    })
  }

  return (
    <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{skill.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{skill.category}</p>
          <p className="text-sm text-gray-700 mb-3"><strong>Why it helps:</strong> {skill.whyItHelps}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {skill.tags.map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-sm"
      >
        <span>{expanded ? 'Hide details' : 'Show how-to steps'}</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {expanded && (
        <div className="mt-4 space-y-4 pt-4 border-t">
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-2">How to do it:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              {skill.howToSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Common pitfalls:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {skill.pitfalls.map((pitfall, i) => (
                <li key={i}>{pitfall}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Age adaptations:</h4>
            <div className="space-y-1 text-xs text-gray-700">
              {Object.entries(skill.adaptations).map(([age, adaptation]) => (
                <p key={age}>
                  <strong className="capitalize">{age.replace('-', ' ')}:</strong> {adaptation}
                </p>
              ))}
            </div>
          </div>

          {skill.evidenceLinks.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Evidence:</h4>
              <div className="space-y-1">
                {skill.evidenceLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleLogPractice}
            size="sm"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Log practice +5 XP
          </Button>
        </div>
      )}
    </Card>
  )
}

