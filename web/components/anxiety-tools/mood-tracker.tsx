'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useAchievements } from '@/hooks/use-achievements'
import { MoodEntry } from '@/lib/types'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const MOODS = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-200' },
  { emoji: '😌', label: 'Calm', color: 'bg-green-200' },
  { emoji: '😐', label: 'Neutral', color: 'bg-gray-200' },
  { emoji: '😟', label: 'Worried', color: 'bg-orange-200' },
  { emoji: '😢', label: 'Sad', color: 'bg-blue-200' },
  { emoji: '😠', label: 'Angry', color: 'bg-red-200' }
]

const COMMON_TAGS = [
  'Work', 'School', 'Social', 'Family', 'Health', 'Sleep', 'Exercise', 'Money', 'Relationship', 'Other'
]

export function MoodTracker() {
  const [entries, setEntries] = useLocalStorage<MoodEntry[]>('neurobreath_mood', [])
  const { progress, setProgress } = useAchievements()
  
  const today = new Date().toISOString().split('T')[0]
  const todayEntry = entries?.find(e => e?.date === today)
  
  const [selectedDate, setSelectedDate] = useState(today)
  const [anxietyLevel, setAnxietyLevel] = useState([todayEntry?.anxietyLevel ?? 5])
  const [selectedMood, setSelectedMood] = useState(todayEntry?.mood ?? '')
  const [selectedTags, setSelectedTags] = useState<string[]>(todayEntry?.tags ?? [])
  const [notes, setNotes] = useState(todayEntry?.notes ?? '')

  const handleSave = () => {
    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      anxietyLevel: anxietyLevel?.[0] ?? 5,
      mood: selectedMood,
      tags: selectedTags,
      notes
    }

    // Remove existing entry for this date if any
    const filtered = (entries ?? []).filter(e => e?.date !== selectedDate)
    setEntries([...filtered, entry])

    // Update progress
    const wasToday = progress?.lastActivityDate === selectedDate
    const newStreak = wasToday ? progress?.currentStreak ?? 0 : (progress?.currentStreak ?? 0) + 1

    setProgress({
      ...progress,
      totalSessions: (progress?.totalSessions ?? 0) + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress?.longestStreak ?? 0),
      lastActivityDate: selectedDate,
      stats: {
        ...(progress?.stats ?? {}),
        moodEntries: (progress?.stats?.moodEntries ?? 0) + 1
      }
    })

    toast.success('Mood entry saved!', {
      description: 'Keep tracking to see your progress'
    })
  }

  const toggleTag = (tag: string) => {
    if (selectedTags?.includes(tag)) {
      setSelectedTags(selectedTags?.filter(t => t !== tag) ?? [])
    } else {
      setSelectedTags([...(selectedTags ?? []), tag])
    }
  }

  // Prepare chart data
  const sortedEntries = [...(entries ?? [])].sort((a, b) => 
    new Date(a?.date ?? '').getTime() - new Date(b?.date ?? '').getTime()
  )
  
  const last30Days = sortedEntries?.slice(-30)
  const chartData = last30Days?.map(entry => ({
    date: new Date(entry?.date ?? '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    anxiety: entry?.anxietyLevel ?? 0
  }))

  const avgAnxiety = entries?.length ? 
    Math.round((entries?.reduce((sum, e) => sum + (e?.anxietyLevel ?? 0), 0) ?? 0) / (entries?.length ?? 1) * 10) / 10 : 0

  const getAnxietyColor = (level: number) => {
    if (level <= 3) return 'text-green-500'
    if (level <= 6) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-3 mb-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Mood & Anxiety Tracker</h2>
        </div>
        <p className="text-muted-foreground">
          Track your daily anxiety levels and moods to identify patterns and triggers.
        </p>
      </Card>

      {/* Daily Check-in */}
      <Card className="p-6 space-y-6">
        <h3 className="font-semibold text-lg">Daily Check-In</h3>
        
        {/* Date */}
        <div>
          <Label id="mood-tracker-date-label" htmlFor="date" className="mb-2 block">Date</Label>
          <input
            id="date"
            name="date"
            aria-labelledby="mood-tracker-date-label"
            aria-label="Date"
            title="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Anxiety Level */}
        <div>
          <Label id="anxiety-level-label" className="mb-2 block">
            Anxiety Level: <span className={`font-bold text-xl ${getAnxietyColor(anxietyLevel?.[0] ?? 5)}`}>
              {anxietyLevel?.[0] ?? 5}/10
            </span>
          </Label>
          <Slider
            aria-labelledby="anxiety-level-label"
            value={anxietyLevel}
            onValueChange={setAnxietyLevel}
            min={0}
            max={10}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>No anxiety</span>
            <span>Extreme anxiety</span>
          </div>
        </div>

        {/* Mood Selection */}
        <div>
          <Label className="mb-3 block">How are you feeling?</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {MOODS.map(mood => (
              <button
                key={mood?.label}
                onClick={() => setSelectedMood(mood?.label ?? '')}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedMood === mood?.label ? 'border-primary ' + (mood?.color ?? '') : 'border-transparent bg-secondary'
                }`}
              >
                <div className="text-3xl mb-1">{mood?.emoji}</div>
                <div className="text-xs font-medium">{mood?.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label className="mb-3 block">What's affecting you? (select all that apply)</Label>
          <div className="flex flex-wrap gap-2">
            {COMMON_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedTags?.includes(tag ?? '') 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="mb-2 block">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any additional thoughts or observations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Save Button */}
        <Button size="lg" onClick={handleSave} className="w-full">
          Save Entry
        </Button>
      </Card>

      {/* Trend Chart */}
      {chartData && chartData?.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Anxiety Trends (Last 30 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }} 
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  domain={[0, 10]} 
                  tick={{ fontSize: 10 }} 
                  tickLine={false}
                  label={{ value: 'Anxiety', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip 
                  contentStyle={{ fontSize: 11 }}
                />
                <Legend 
                  verticalAlign="top"
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="anxiety" 
                  stroke="#60B5FF" 
                  strokeWidth={2}
                  dot={{ fill: '#60B5FF', r: 4 }}
                  name="Anxiety Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Statistics */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{entries?.length ?? 0}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${getAnxietyColor(avgAnxiety)}`}>
              {avgAnxiety.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg. Anxiety</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{progress?.currentStreak ?? 0}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-muted-foreground">
              {(() => {
                const tagCounts = entries?.reduce((acc, e) => {
                  e?.tags?.forEach(tag => {
                    acc[tag ?? ''] = (acc?.[tag ?? ''] ?? 0) + 1
                  })
                  return acc
                }, {} as Record<string, number>)
                if (!tagCounts || Object.keys(tagCounts).length === 0) return 'N/A'
                const sortedTags = Object.entries(tagCounts).sort((a, b) => (b?.[1] ?? 0) - (a?.[1] ?? 0))
                return sortedTags?.[0]?.[0] ?? 'N/A'
              })()}
            </div>
            <div className="text-sm text-muted-foreground">Top Trigger</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
