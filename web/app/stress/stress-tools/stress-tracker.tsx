'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Activity, Save, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

const triggers = [
  'Work', 'Relationships', 'Finances', 'Health', 'Family', 'Time Pressure',
  'Change', 'Uncertainty', 'Social', 'Sleep', 'News', 'Other'
]

const symptoms = [
  'Tension', 'Headache', 'Fatigue', 'Irritability', 'Worry', 'Racing Thoughts',
  'Poor Focus', 'Sleep Issues', 'Appetite Change', 'Physical Pain'
]

export function StressTracker() {
  const { data: session } = useSession() || {}
  const [level, setLevel] = useState(5)
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleItem = (item: string, list: string[], setList: (items: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const handleSave = async () => {
    if (!session?.user) {
      alert('Please sign in to save your stress log')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/stress/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          triggers: selectedTriggers,
          symptoms: selectedSymptoms,
          notes,
        }),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => {
          setSaved(false)
          setLevel(5)
          setSelectedTriggers([])
          setSelectedSymptoms([])
          setNotes('')
        }, 2000)
      }
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  const getLevelColor = (l: number) => {
    if (l <= 3) return 'text-green-600'
    if (l <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getLevelLabel = (l: number) => {
    if (l <= 2) return 'Very Low'
    if (l <= 4) return 'Low'
    if (l <= 6) return 'Moderate'
    if (l <= 8) return 'High'
    return 'Very High'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-6 w-6 text-teal-600" />
        <h3 className="text-xl font-semibold">Stress Level Tracker</h3>
      </div>

      <div className="space-y-6">
        {/* Stress Level */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Current Stress Level</span>
            <span className={`font-bold ${getLevelColor(level)}`}>
              {level}/10 - {getLevelLabel(level)}
            </span>
          </div>
          <Slider
            value={[level]}
            onValueChange={(v) => setLevel(v[0] ?? 5)}
            min={1}
            max={10}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Calm</span>
            <span>Stressed</span>
          </div>
        </div>

        {/* Triggers */}
        <div>
          <div className="font-medium mb-2">What's causing stress? (optional)</div>
          <div className="flex flex-wrap gap-2">
            {triggers.map((t) => (
              <button
                key={t}
                onClick={() => toggleItem(t, selectedTriggers, setSelectedTriggers)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedTriggers.includes(t)
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <div className="font-medium mb-2">Symptoms you're experiencing (optional)</div>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((s) => (
              <button
                key={s}
                onClick={() => toggleItem(s, selectedSymptoms, setSelectedSymptoms)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedSymptoms.includes(s)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <div className="font-medium mb-2">Notes (optional)</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling? Any context..."
            className="w-full p-3 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || !session?.user}
          className="w-full bg-teal-600 hover:bg-teal-700"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
          ) : saved ? (
            'Saved!'
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Log Stress Level</>
          )}
        </Button>

        {!session?.user && (
          <p className="text-sm text-center text-muted-foreground">
            Sign in to save and track your stress levels over time
          </p>
        )}
      </div>
    </Card>
  )
}
