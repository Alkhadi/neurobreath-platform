'use client'

import { useState } from 'react'
import { Heart, Calendar as CalendarIcon, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useAchievements } from '@/hooks/use-achievements'
import { GratitudeEntry } from '@/lib/types'
import { toast } from 'sonner'

const MOODS = ['😊', '🥰', '😌', '😇', '🙂', '😐']

const PROMPTS = [
  "Think about a person who made you smile today",
  "What's something beautiful you noticed?",
  "What made your day a little easier?",
  "What's a small win you had today?",
  "What comfort brought you peace?",
  "What made you feel cared for?",
  "What are you looking forward to?"
]

export function GratitudeJournal() {
  const [entries, setEntries] = useLocalStorage<GratitudeEntry[]>('neurobreath_gratitude', [])
  const { progress, setProgress } = useAchievements()
  
  const today = new Date().toISOString().split('T')[0]
  const todayEntry = entries?.find(e => e?.date === today)
  
  const [selectedDate, setSelectedDate] = useState(today)
  const [gratitude1, setGratitude1] = useState(todayEntry?.gratitudes?.[0]?.item ?? '')
  const [reason1, setReason1] = useState(todayEntry?.gratitudes?.[0]?.reason ?? '')
  const [gratitude2, setGratitude2] = useState(todayEntry?.gratitudes?.[1]?.item ?? '')
  const [reason2, setReason2] = useState(todayEntry?.gratitudes?.[1]?.reason ?? '')
  const [gratitude3, setGratitude3] = useState(todayEntry?.gratitudes?.[2]?.item ?? '')
  const [reason3, setReason3] = useState(todayEntry?.gratitudes?.[2]?.reason ?? '')
  const [selectedMood, setSelectedMood] = useState(todayEntry?.mood ?? '')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPrompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])

  const handleSave = () => {
    if (!gratitude1 && !gratitude2 && !gratitude3) {
      toast.error('Please add at least one gratitude')
      return
    }

    const gratitudes = [
      { item: gratitude1, reason: reason1 },
      { item: gratitude2, reason: reason2 },
      { item: gratitude3, reason: reason3 }
    ].filter(g => g?.item)

    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      gratitudes,
      mood: selectedMood
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
        gratitudeEntries: (progress?.stats?.gratitudeEntries ?? 0) + 1
      }
    })

    toast.success('Gratitude entry saved!', {
      description: 'Keep cultivating positivity'
    })

    // Reset if not editing today
    if (selectedDate !== today) {
      setSelectedDate(today)
      setGratitude1('')
      setReason1('')
      setGratitude2('')
      setReason2('')
      setGratitude3('')
      setReason3('')
      setSelectedMood('')
    }
  }

  const filteredEntries = (entries ?? []).filter(e => {
    const matchesSearch = e?.gratitudes?.some(g => 
      g?.item?.toLowerCase?.()?.includes?.(searchTerm?.toLowerCase?.() ?? '') ||
      g?.reason?.toLowerCase?.()?.includes?.(searchTerm?.toLowerCase?.() ?? '')
    )
    return matchesSearch
  }).sort((a, b) => new Date(b?.date ?? '').getTime() - new Date(a?.date ?? '').getTime())

  return (
    <div className="space-y-6">
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">Today's Entry</TabsTrigger>
          <TabsTrigger value="history">Past Entries ({entries?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6 mt-6">
          {/* Header */}
          <Card className="p-6 bg-gradient-to-r from-pink-50 to-yellow-50">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-6 w-6 text-pink-500" />
              <h2 className="text-2xl font-bold">Gratitude Journal</h2>
            </div>
            <p className="text-muted-foreground mb-3">
              Daily gratitude practice helps shift focus from anxiety to appreciation.
            </p>
            <div className="flex items-center gap-2 text-sm bg-white/50 p-3 rounded-lg">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="italic">{currentPrompt}</span>
            </div>
          </Card>

          {/* Entry Form */}
          <Card className="p-6 space-y-6">
            {/* Date */}
            <div>
              <Label htmlFor="date" className="mb-2 block">Date</Label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Three Gratitudes */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Three things I'm grateful for today:</Label>
              
              {/* Gratitude 1 */}
              <div className="space-y-2">
                <Input
                  placeholder="1. I'm grateful for..."
                  value={gratitude1}
                  onChange={(e) => setGratitude1(e.target.value)}
                />
                <Textarea
                  placeholder="Why? (optional)"
                  value={reason1}
                  onChange={(e) => setReason1(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </div>

              {/* Gratitude 2 */}
              <div className="space-y-2">
                <Input
                  placeholder="2. I'm grateful for..."
                  value={gratitude2}
                  onChange={(e) => setGratitude2(e.target.value)}
                />
                <Textarea
                  placeholder="Why? (optional)"
                  value={reason2}
                  onChange={(e) => setReason2(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </div>

              {/* Gratitude 3 */}
              <div className="space-y-2">
                <Input
                  placeholder="3. I'm grateful for..."
                  value={gratitude3}
                  onChange={(e) => setGratitude3(e.target.value)}
                />
                <Textarea
                  placeholder="Why? (optional)"
                  value={reason3}
                  onChange={(e) => setReason3(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Mood */}
            <div>
              <Label className="mb-3 block">How do you feel right now?</Label>
              <div className="flex gap-3">
                {MOODS.map(mood => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`text-4xl p-2 rounded-lg transition-all hover:scale-110 ${
                      selectedMood === mood ? 'bg-primary/10 scale-110' : ''
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button size="lg" onClick={handleSave} className="w-full">
              <Heart className="mr-2 h-5 w-5" />
              Save Entry
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your gratitude entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Calendar View */}
          {filteredEntries?.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No entries found' : 'No gratitude entries yet. Start your first entry today!'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredEntries?.map(entry => (
                <Card key={entry?.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(entry?.date ?? '').toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {entry?.mood && <span className="text-3xl">{entry?.mood}</span>}
                  </div>
                  <div className="space-y-3">
                    {entry?.gratitudes?.map((g, index) => (
                      <div key={index} className="bg-gradient-to-r from-pink-50 to-yellow-50 p-4 rounded-lg">
                        <div className="font-medium text-sm mb-1">
                          {index + 1}. {g?.item}
                        </div>
                        {g?.reason && (
                          <div className="text-sm text-muted-foreground italic">
                            {g?.reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Stats */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Your Gratitude Practice</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-pink-500">{entries?.length ?? 0}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-500">{progress?.currentStreak ?? 0}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-500">
              {entries?.reduce((sum, e) => sum + (e?.gratitudes?.length ?? 0), 0) ?? 0}
            </div>
            <div className="text-sm text-muted-foreground">Total Gratitudes</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
