'use client'

import { useState } from 'react'
import { Check, X, Eye, Hand, Ear, Utensils, Wind, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useAchievements } from '@/hooks/use-achievements'
import { GroundingSession } from '@/lib/types'
import { toast } from 'sonner'

interface GroundingItem {
  category: 'see' | 'touch' | 'hear' | 'smell' | 'taste'
  label: string
  icon: LucideIcon
  count: number
  color: string
}

const GROUNDING_ITEMS: GroundingItem[] = [
  { category: 'see', label: 'things you can see', icon: Eye, count: 5, color: 'text-blue-500' },
  { category: 'touch', label: 'things you can touch/feel', icon: Hand, count: 4, color: 'text-purple-500' },
  { category: 'hear', label: 'things you can hear', icon: Ear, count: 3, color: 'text-green-500' },
  { category: 'smell', label: 'things you can smell', icon: Wind, count: 2, color: 'text-yellow-500' },
  { category: 'taste', label: 'thing you can taste', icon: Utensils, count: 1, color: 'text-red-500' }
]

export function GroundingExercise() {
  const [items, setItems] = useState<Record<string, string[]>>({
    see: ['', '', '', '', ''],
    touch: ['', '', '', ''],
    hear: ['', '', ''],
    smell: ['', ''],
    taste: ['']
  })
  const [startTime] = useState(Date.now())
  const [sessions, setSessions] = useLocalStorage<GroundingSession[]>('neurobreath_grounding', [])
  const { progress, setProgress } = useAchievements()

  const handleItemChange = (category: string, index: number, value: string) => {
    setItems(prev => ({
      ...prev,
      [category]: prev?.[category]?.map?.((item, i) => i === index ? value : item) ?? []
    }))
  }

  const handleComplete = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    const newSession: GroundingSession = {
      id: Date.now().toString(),
      completedAt: new Date().toISOString(),
      duration,
      items: {
        see: items?.see ?? [],
        touch: items?.touch ?? [],
        hear: items?.hear ?? [],
        smell: items?.smell ?? [],
        taste: items?.taste ?? []
      }
    }

    setSessions([...(sessions ?? []), newSession])

    // Update progress
    const today = new Date().toISOString().split('T')[0]
    const wasToday = progress?.lastActivityDate === today
    const newStreak = wasToday ? progress?.currentStreak ?? 0 : (progress?.currentStreak ?? 0) + 1

    setProgress({
      ...progress,
      totalSessions: (progress?.totalSessions ?? 0) + 1,
      totalMinutes: (progress?.totalMinutes ?? 0) + Math.floor(duration / 60),
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress?.longestStreak ?? 0),
      lastActivityDate: today,
      stats: {
        ...(progress?.stats ?? {}),
        groundingSessions: (progress?.stats?.groundingSessions ?? 0) + 1
      }
    })

    toast.success('Grounding session completed!', {
      description: 'Great job bringing yourself to the present moment'
    })

    // Reset form
    setItems({
      see: ['', '', '', '', ''],
      touch: ['', '', '', ''],
      hear: ['', '', ''],
      smell: ['', ''],
      taste: ['']
    })
  }

  const handleReset = () => {
    setItems({
      see: ['', '', '', '', ''],
      touch: ['', '', '', ''],
      hear: ['', '', ''],
      smell: ['', ''],
      taste: ['']
    })
  }

  const completedCount = Object.values(items)?.flat()?.filter?.(Boolean)?.length ?? 0
  const totalCount = 15
  const progress_percent = Math.floor((completedCount / totalCount) * 100)
  const progressRounded = Math.max(0, Math.min(100, Math.round(progress_percent / 5) * 5))
  const progressWidthClass: Record<number, string> = {
    0: 'w-0',
    5: 'w-[5%]',
    10: 'w-[10%]',
    15: 'w-[15%]',
    20: 'w-1/5',
    25: 'w-1/4',
    30: 'w-[30%]',
    35: 'w-[35%]',
    40: 'w-2/5',
    45: 'w-[45%]',
    50: 'w-1/2',
    55: 'w-[55%]',
    60: 'w-3/5',
    65: 'w-[65%]',
    70: 'w-[70%]',
    75: 'w-3/4',
    80: 'w-4/5',
    85: 'w-[85%]',
    90: 'w-[90%]',
    95: 'w-[95%]',
    100: 'w-full'
  }
  const progressClassName = progressWidthClass[progressRounded] || 'w-0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50">
        <h2 className="text-2xl font-bold mb-2">5-4-3-2-1 Grounding Exercise</h2>
        <p className="text-muted-foreground mb-4">
          This mindfulness technique helps anchor you to the present moment when feeling anxious or overwhelmed.
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${progressClassName}`}
            />
          </div>
          <span className="text-sm font-medium">{completedCount}/{totalCount}</span>
        </div>
      </Card>

      {/* Grounding Items */}
      <div className="space-y-6">
        {GROUNDING_ITEMS.map(({ category, label, icon: Icon, count, color }) => (
          <Card key={category} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`h-6 w-6 ${color}`} />
              <h3 className="font-semibold capitalize">
                {count} {label}
              </h3>
            </div>
            <div className="space-y-3">
              {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  {items?.[category]?.[index] ? (
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted flex-shrink-0" />
                  )}
                  <Input
                    placeholder={`Enter ${label.split(' ')[0]} #${index + 1}...`}
                    value={items?.[category]?.[index] ?? ''}
                    onChange={(e) => handleItemChange(category, index, e.target.value)}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button
          size="lg"
          onClick={handleComplete}
          disabled={completedCount < totalCount}
          className="px-8"
        >
          <Check className="mr-2 h-5 w-5" />
          Complete Exercise
        </Button>
        <Button size="lg" variant="outline" onClick={handleReset} className="px-8">
          <X className="mr-2 h-5 w-5" />
          Reset
        </Button>
      </div>

      {/* Stats */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Your Grounding Practice</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{sessions?.length ?? 0}</div>
            <div className="text-sm text-muted-foreground">Sessions Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {Math.floor((sessions?.reduce?.((sum, s) => sum + (s?.duration ?? 0), 0) ?? 0) / 60)}
            </div>
            <div className="text-sm text-muted-foreground">Total Minutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{progress?.currentStreak ?? 0}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
