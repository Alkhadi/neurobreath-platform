'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Trophy, Target, CheckCircle, Calendar, TrendingUp, Award, Flame, Sparkles, Heart, Brain, Users, BookOpen, Lightbulb, Shield } from 'lucide-react'
import { EvidenceFooter, SLEEP_EVIDENCE_SOURCES } from '@/components/evidence-footer'

// Types
interface SleepEntry {
  date: string
  bedtime: string
  wakeTime: string
  quality: number
  notes: string
  hoursSlept: number
}

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  requirement: string
  unlocked: boolean
  unlockedDate?: string
}

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  category: string
}

// Helper functions
const calculateHoursSlept = (bedtime: string, wakeTime: string): number => {
  const [bedH, bedM] = bedtime.split(':').map(Number)
  const [wakeH, wakeM] = wakeTime.split(':').map(Number)
  let hours = wakeH - bedH + (wakeM - bedM) / 60
  if (hours < 0) hours += 24
  return Math.round(hours * 10) / 10
}

const calculateStreak = (entries: SleepEntry[]): number => {
  if (entries.length === 0) return 0
  const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < sorted.length; i++) {
    const entryDate = new Date(sorted[i].date)
    entryDate.setHours(0, 0, 0, 0)
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++
    } else break
  }
  return streak
}

const calculateSleepScore = (entries: SleepEntry[]): number => {
  if (entries.length === 0) return 0
  const recent = entries.slice(-7)
  const avgQuality = recent.reduce((acc, e) => acc + e.quality, 0) / recent.length
  const avgHours = recent.reduce((acc, e) => acc + e.hoursSlept, 0) / recent.length
  const hoursScore = Math.min(avgHours / 8 * 50, 50)
  const qualityScore = avgQuality / 5 * 50
  return Math.round(hoursScore + qualityScore)
}

const PERCENT_BUCKETS = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
  50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
]

const HEIGHT_CLASS_BY_PERCENT: Record<number, string> = {
  0: 'h-0',
  5: 'h-[5%]',
  10: 'h-[10%]',
  15: 'h-[15%]',
  20: 'h-[20%]',
  25: 'h-[25%]',
  30: 'h-[30%]',
  35: 'h-[35%]',
  40: 'h-[40%]',
  45: 'h-[45%]',
  50: 'h-[50%]',
  55: 'h-[55%]',
  60: 'h-[60%]',
  65: 'h-[65%]',
  70: 'h-[70%]',
  75: 'h-[75%]',
  80: 'h-[80%]',
  85: 'h-[85%]',
  90: 'h-[90%]',
  95: 'h-[95%]',
  100: 'h-[100%]',
}

const WIDTH_CLASS_BY_PERCENT: Record<number, string> = {
  0: 'w-0',
  5: 'w-[5%]',
  10: 'w-[10%]',
  15: 'w-[15%]',
  20: 'w-[20%]',
  25: 'w-[25%]',
  30: 'w-[30%]',
  35: 'w-[35%]',
  40: 'w-[40%]',
  45: 'w-[45%]',
  50: 'w-[50%]',
  55: 'w-[55%]',
  60: 'w-[60%]',
  65: 'w-[65%]',
  70: 'w-[70%]',
  75: 'w-[75%]',
  80: 'w-[80%]',
  85: 'w-[85%]',
  90: 'w-[90%]',
  95: 'w-[95%]',
  100: 'w-[100%]',
}

const toPercentBucket = (value: number): number => {
  if (!Number.isFinite(value)) return 0
  const rounded = Math.round(value / 5) * 5
  const clamped = Math.min(100, Math.max(0, rounded))
  return PERCENT_BUCKETS.includes(clamped) ? clamped : 0
}

// Initial badges
const initialBadges: Badge[] = [
  { id: 'first_log', name: 'First Steps', icon: '🌙', description: 'Log your first sleep entry', requirement: '1 entry', unlocked: false },
  { id: 'week_streak', name: 'Week Warrior', icon: '🔥', description: 'Maintain a 7-day logging streak', requirement: '7 day streak', unlocked: false },
  { id: 'month_streak', name: 'Sleep Champion', icon: '🏆', description: 'Maintain a 30-day logging streak', requirement: '30 day streak', unlocked: false },
  { id: 'quality_master', name: 'Quality Sleeper', icon: '⭐', description: 'Achieve 5-star sleep quality 5 times', requirement: '5x quality', unlocked: false },
  { id: 'early_bird', name: 'Early Bird', icon: '🐦', description: 'Wake before 7am for 7 days', requirement: '7 early wakes', unlocked: false },
  { id: 'night_owl', name: 'Consistent Owl', icon: '🦉', description: 'Same bedtime (±30min) for 7 days', requirement: 'Consistency', unlocked: false },
  { id: 'hygiene_hero', name: 'Hygiene Hero', icon: '✨', description: 'Complete sleep hygiene checklist', requirement: 'Full checklist', unlocked: false },
  { id: 'sleep_scholar', name: 'Sleep Scholar', icon: '📚', description: 'Read all educational sections', requirement: 'All sections', unlocked: false },
]

// Initial checklist
const initialChecklist: ChecklistItem[] = [
  { id: 'c1', text: 'Maintain consistent sleep and wake times', completed: false, category: 'routine' },
  { id: 'c2', text: 'Avoid screens 30+ minutes before bed', completed: false, category: 'routine' },
  { id: 'c3', text: 'Keep bedroom cool (16-19°C / 60-67°F)', completed: false, category: 'environment' },
  { id: 'c4', text: 'Ensure bedroom is dark and quiet', completed: false, category: 'environment' },
  { id: 'c5', text: 'No caffeine after 2pm', completed: false, category: 'lifestyle' },
  { id: 'c6', text: 'Exercise regularly (not close to bedtime)', completed: false, category: 'lifestyle' },
  { id: 'c7', text: 'Avoid heavy meals before bed', completed: false, category: 'lifestyle' },
  { id: 'c8', text: 'Practice relaxation before sleep', completed: false, category: 'routine' },
  { id: 'c9', text: 'Use bed only for sleep', completed: false, category: 'environment' },
  { id: 'c10', text: 'Write down worries before bed', completed: false, category: 'routine' },
]

export default function SleepPage() {
  // State
  const [activeSection, setActiveSection] = useState<string>('understanding')
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [badges, setBadges] = useState<Badge[]>(initialBadges)
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist)
  const [newEntry, setNewEntry] = useState({ bedtime: '22:00', wakeTime: '06:30', quality: 3, notes: '' })
  const [showTracker, setShowTracker] = useState(false)
  const [sectionsRead, setSectionsRead] = useState<string[]>([])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sleepTracker')
    if (saved) {
      const data = JSON.parse(saved)
      setSleepEntries(data.entries || [])
      setBadges(data.badges || initialBadges)
      setChecklist(data.checklist || initialChecklist)
      setSectionsRead(data.sectionsRead || [])
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('sleepTracker', JSON.stringify({
      entries: sleepEntries,
      badges,
      checklist,
      sectionsRead
    }))
  }, [sleepEntries, badges, checklist, sectionsRead])

  // Badge checking
  useEffect(() => {
    const updated = [...badges]
    const streak = calculateStreak(sleepEntries)
    
    if (sleepEntries.length >= 1) updated[0].unlocked = true
    if (streak >= 7) updated[1].unlocked = true
    if (streak >= 30) updated[2].unlocked = true
    if (sleepEntries.filter(e => e.quality === 5).length >= 5) updated[3].unlocked = true
    if (sleepEntries.filter(e => parseInt(e.wakeTime.split(':')[0]) < 7).length >= 7) updated[4].unlocked = true
    if (checklist.every(c => c.completed)) updated[6].unlocked = true
    if (sectionsRead.length >= 8) updated[7].unlocked = true
    
    // Only update if badges actually changed
    const hasChanged = updated.some((badge, index) => badge.unlocked !== badges[index].unlocked)
    if (hasChanged) {
      setBadges(updated)
    }
  }, [sleepEntries, checklist, sectionsRead, badges])

  const addSleepEntry = () => {
    const today = new Date().toISOString().split('T')[0]
    const hoursSlept = calculateHoursSlept(newEntry.bedtime, newEntry.wakeTime)
    const entry: SleepEntry = {
      date: today,
      ...newEntry,
      hoursSlept
    }
    setSleepEntries(prev => [...prev.filter(e => e.date !== today), entry])
    setNewEntry({ bedtime: '22:00', wakeTime: '06:30', quality: 3, notes: '' })
  }

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const markSectionRead = (section: string) => {
    if (!sectionsRead.includes(section)) {
      setSectionsRead(prev => [...prev, section])
    }
  }

  const streak = calculateStreak(sleepEntries)
  const sleepScore = calculateSleepScore(sleepEntries)
  const unlockedBadges = badges.filter(b => b.unlocked).length
  const checklistProgress = Math.round(checklist.filter(c => c.completed).length / checklist.length * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-xl mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">💤</span>
            <h1 className="text-4xl font-bold">Sleep Issues</h1>
          </div>
          <p className="text-indigo-200 text-lg mb-4">Train the Mind</p>
          <p className="text-white/90 text-lg">
            Evidence-based tools and resources to understand and manage sleep issues. Track your progress, build resilience, and find rest.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-1" />
              <p className="text-2xl font-bold">{streak}</p>
              <p className="text-sm text-white/80">Day Streak</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-1" />
              <p className="text-2xl font-bold">{sleepScore}</p>
              <p className="text-sm text-white/80">Sleep Score</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-1" />
              <p className="text-2xl font-bold">{unlockedBadges}/{badges.length}</p>
              <p className="text-sm text-white/80">Badges</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-1" />
              <p className="text-2xl font-bold">{checklistProgress}%</p>
              <p className="text-sm text-white/80">Hygiene</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowTracker(!showTracker)} 
            className="mt-6 bg-white text-indigo-600 hover:bg-indigo-100"
          >
            <Moon className="w-4 h-4 mr-2" /> {showTracker ? 'Hide' : 'Open'} Sleep Tracker
          </Button>
        </div>


        {/* Sleep Tracker Panel */}
        {showTracker && (
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-600" /> Sleep Tracker & Diary
            </h2>
            
            {/* Log Entry Form */}
            <div className="bg-indigo-50 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Log Today's Sleep</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Bedtime</label>
                  <input 
                    type="time" 
                    value={newEntry.bedtime}
                    onChange={e => setNewEntry({...newEntry, bedtime: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    title="Enter your bedtime"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Wake Time</label>
                  <input 
                    type="time" 
                    value={newEntry.wakeTime}
                    onChange={e => setNewEntry({...newEntry, wakeTime: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    title="Enter your wake time"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Quality (1-5)</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button
                        key={n}
                        onClick={() => setNewEntry({...newEntry, quality: n})}
                        className={`w-8 h-8 rounded-full ${newEntry.quality >= n ? 'bg-yellow-400' : 'bg-gray-200'}`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={addSleepEntry} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Log Sleep
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm text-gray-600 mb-1">Notes (optional)</label>
                <input 
                  type="text" 
                  value={newEntry.notes}
                  onChange={e => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="How did you feel? Any disturbances?"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Progress Visualisation */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Last 7 Days</h3>
              <div className="flex gap-2 items-end h-32">
                {[...Array(7)].map((_, i) => {
                  const date = new Date()
                  date.setDate(date.getDate() - (6 - i))
                  const dateStr = date.toISOString().split('T')[0]
                  const entry = sleepEntries.find(e => e.date === dateStr)
                  const height = entry ? (entry.hoursSlept / 12) * 100 : 10
                  const heightClass = HEIGHT_CLASS_BY_PERCENT[toPercentBucket(height)] || 'h-[10%]'
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`w-full rounded-t-lg transition-all ${heightClass} ${entry ? 'bg-indigo-500' : 'bg-gray-200'}`}
                        title={entry ? `${entry.hoursSlept}h - ${entry.quality}⭐` : 'No data'}
                        role="img"
                        aria-label={entry ? `${entry.hoursSlept} hours of sleep` : 'No data'}
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Badges */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" /> Achievements
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {badges.map(badge => (
                  <div 
                    key={badge.id}
                    className={`p-3 rounded-xl text-center transition-all ${badge.unlocked ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100 opacity-50'}`}
                    title={`${badge.name}: ${badge.description}`}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <p className="text-xs mt-1 truncate">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sleep Hygiene Checklist */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" /> Sleep Hygiene Checklist
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {checklist.map(item => (
                  <label 
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${item.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}
                  >
                    <input 
                      type="checkbox" 
                      checked={item.completed}
                      onChange={() => toggleChecklist(item.id)}
                      className="w-5 h-5 rounded"
                    />
                    <span className={item.completed ? 'text-green-700 line-through' : 'text-gray-700'}>{item.text}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all bg-green-500 ${WIDTH_CLASS_BY_PERCENT[toPercentBucket(checklistProgress)] || 'w-0'}`}
                  role="progressbar"
                  aria-label={`Sleep hygiene checklist progress: ${Math.round(checklistProgress)}%`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl p-2 shadow mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {[
              { id: 'understanding', label: 'Understanding', icon: Brain },
              { id: 'symptoms', label: 'Signs & Symptoms', icon: Heart },
              { id: 'diagnosis', label: 'Diagnosis', icon: Target },
              { id: 'treatment', label: 'Treatment', icon: Shield },
              { id: 'management', label: 'Management', icon: TrendingUp },
              { id: 'support', label: 'Support', icon: Users },
              { id: 'interventions', label: 'Interventions', icon: Lightbulb },
              { id: 'resources', label: 'Resources', icon: BookOpen },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveSection(tab.id); markSectionRead(tab.id) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          
          {/* Understanding Sleep Issues */}
          {activeSection === 'understanding' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-indigo-600" /> Understanding Sleep Issues
              </h2>
              
              <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What Are Sleep Disorders?</h3>
                <p className="text-gray-700">
                  Sleep disorders encompass over 80 different conditions that affect the quality, timing, and duration of sleep. 
                  They can significantly impact physical health, mental wellbeing, and daily functioning.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Types of Sleep Disorders</h3>
              
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">🌙 Insomnia</h4>
                  <p className="text-gray-700 mb-2">The most common sleep disorder, characterised by difficulty falling asleep, staying asleep, or achieving good quality sleep.</p>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li><strong>Initial insomnia:</strong> Difficulty falling asleep</li>
                    <li><strong>Sleep maintenance insomnia:</strong> Waking during the night</li>
                    <li><strong>Early waking insomnia:</strong> Waking too early</li>
                    <li><strong>Chronic insomnia:</strong> Persists 3+ months, occurring 3+ nights/week</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">😮‍💨 Sleep-Related Breathing Disorders</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li><strong>Obstructive sleep apnoea (OSA):</strong> Airways collapse during sleep, causing breathing pauses</li>
                    <li><strong>Central sleep apnoea:</strong> Brain fails to signal respiratory muscles</li>
                    <li><strong>Chronic snoring:</strong> When severe, classified as a disorder</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">😴 Hypersomnias</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li><strong>Narcolepsy:</strong> Irresistible daytime sleepiness, sudden sleep attacks</li>
                    <li><strong>Idiopathic hypersomnia:</strong> Long sleep yet feeling unrefreshed</li>
                  </ul>
                </div>

                <div className="bg-pink-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">🚶 Parasomnias</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li><strong>Sleepwalking:</strong> Walking or activities while asleep</li>
                    <li><strong>Night terrors:</strong> Episodes of screaming and intense fear</li>
                    <li><strong>REM sleep behaviour disorder:</strong> Acting out dreams</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">🦵 Movement Disorders</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li><strong>Restless legs syndrome:</strong> Irresistible urge to move legs, worse at rest</li>
                    <li><strong>Periodic limb movement disorder:</strong> Repetitive leg jerking during sleep</li>
                    <li><strong>Sleep bruxism:</strong> Teeth grinding during sleep</li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">⏰ Circadian Rhythm Disorders</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li><strong>Delayed sleep phase:</strong> Cannot sleep until much later than normal</li>
                    <li><strong>Advanced sleep phase:</strong> Sleep early evening, wake early morning</li>
                    <li><strong>Shift work disorder:</strong> Disruption from irregular work shifts</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">💡 Recommended Sleep Duration</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-medium">Children (6-12)</p>
                    <p className="text-indigo-600 font-bold">9-12 hours</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-medium">Teens (13-17)</p>
                    <p className="text-indigo-600 font-bold">8-10 hours</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-medium">Adults (18-60)</p>
                    <p className="text-indigo-600 font-bold">7+ hours</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-medium">Older Adults (65+)</p>
                    <p className="text-indigo-600 font-bold">7-8 hours</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Signs & Symptoms */}
          {activeSection === 'symptoms' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" /> Signs & Symptoms
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">🌙 Sleep Difficulties</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
                    <li>Difficulty falling asleep</li>
                    <li>Difficulty staying asleep</li>
                    <li>Waking up too early</li>
                    <li>Frequent night waking</li>
                    <li>Not feeling well-rested</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">☀️ Daytime Symptoms</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
                    <li>Excessive sleepiness or fatigue</li>
                    <li>Irritability, anxiety, depression</li>
                    <li>Difficulty concentrating</li>
                    <li>Increased errors or accidents</li>
                    <li>Low mood or motivation</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Age-Specific Presentations</h3>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">👶 Children</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Bedtime resistance and settling difficulties</li>
                    <li>Night waking and nightmares</li>
                    <li>Sleepwalking and night terrors</li>
                    <li><strong>Important:</strong> May show hyperactivity rather than sleepiness (can be misdiagnosed as ADHD)</li>
                    <li>Poor concentration at school</li>
                    <li>Mood swings and irritability</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">🧑‍🎓 Adolescents</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Delayed Sleep Phase Syndrome (late bedtimes 1-4 AM)</li>
                    <li>Severe sleep deprivation</li>
                    <li>Excessive daytime sleepiness</li>
                    <li>Poor decision-making and risk-taking</li>
                    <li>Impact on educational performance</li>
                    <li>Increased risk of depression and anxiety</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">🧑 Adults</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Chronic insomnia most common</li>
                    <li>Obstructive sleep apnoea</li>
                    <li>Restless legs syndrome</li>
                    <li>Work-related sleep disorders</li>
                    <li>Impact on work performance and relationships</li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">👴 Elderly</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Sleep-maintenance insomnia</li>
                    <li>Early awakening</li>
                    <li>Decreased total sleep time</li>
                    <li>Less deep sleep (slow-wave sleep)</li>
                    <li>REM Sleep Behaviour Disorder (common in over 50s)</li>
                    <li>Higher prevalence of OSA (20-60% over 65)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-5 mt-6">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ Health Consequences</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Physical:</p>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Weakened immune system</li>
                      <li>Increased risk of obesity</li>
                      <li>Type 2 diabetes</li>
                      <li>Cardiovascular disease</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Mental Health:</p>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Anxiety</li>
                      <li>Depression</li>
                      <li>Cognitive impairment</li>
                      <li>Psychosis exacerbation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Diagnosis */}
          {activeSection === 'diagnosis' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-600" /> Diagnosis Methods
              </h2>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Initial Assessment (UK NHS)</h3>
                <p className="text-gray-700 mb-3">First step is consultation with your General Practitioner (GP), who will:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Review your symptoms and medical history</li>
                  <li>Review current medications</li>
                  <li>Recommend a sleep diary (1-2 weeks)</li>
                  <li>Assess lifestyle factors</li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">
                  <strong>Diagnostic criteria:</strong> Symptoms occurring at least 3 times per week for minimum 3 months
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Screening Tools</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Epworth Sleepiness Scale</h4>
                  <p className="text-sm text-gray-600">Assesses daytime sleepiness. Score &gt;10 indicates excessive sleepiness.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">STOP-BANG Questionnaire</h4>
                  <p className="text-sm text-gray-600">Identifies risk of obstructive sleep apnoea.</p>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Insomnia Severity Index</h4>
                  <p className="text-sm text-gray-600">Baseline symptom measurement for insomnia.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Pittsburgh Sleep Quality Index</h4>
                  <p className="text-sm text-gray-600">Assesses sleep quality over the past month.</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Diagnostic Tests</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">🏥 Polysomnography (Sleep Study)</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Overnight study monitoring brain waves, oxygen levels, heart rate, breathing, eye and leg movements.
                  </p>
                  <p className="text-gray-500 text-sm">Settings: Hospital sleep unit, sleep centre, or home (for some conditions)</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">⌚ Actigraphy</h4>
                  <p className="text-gray-700 text-sm">
                    Non-invasive wrist-worn device monitoring sleep-wake cycles over an extended period.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">🏠 Home Sleep Apnea Test</h4>
                  <p className="text-gray-700 text-sm">
                    Records breathing rate, airflow, oxygen levels, and heart rate at home.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">😴 Multiple Sleep Latency Test</h4>
                  <p className="text-gray-700 text-sm">
                    Measures daytime sleepiness by observing how quickly you fall asleep during scheduled naps.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">🩸 Blood Tests</h4>
                  <p className="text-gray-700 text-sm">
                    Rule out underlying conditions like anaemia or metabolic disorders.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Treatment Options */}
          {activeSection === 'treatment' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" /> Treatment Options
              </h2>

              <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">✅ First-Line Treatment: CBT-I</h3>
                <p className="text-gray-700 text-sm">
                  Cognitive Behavioural Therapy for Insomnia is recommended as first-line treatment by NICE, ESRS, and American College of Physicians. 
                  Improves symptoms in up to 80% of individuals.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Medical Treatments</h3>

              <div className="bg-blue-50 rounded-lg p-5 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">UK NICE Guidelines</h4>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>Principle:</strong> Non-pharmacological approaches first. Hypnotics only for short-term use (max 4 weeks) when insomnia is severe.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded p-3">
                    <p className="font-medium">Zopiclone (First-line if hypnotic needed)</p>
                    <p className="text-gray-600">3.75mg to 7.5mg at night, usually 2 weeks max</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="font-medium">Melatonin (Modified release)</p>
                    <p className="text-gray-600">For adults 55+, up to 13 weeks</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="font-medium">Daridorexant (QUVIVIQ)</p>
                    <p className="text-gray-600">For chronic insomnia when CBT-I ineffective. No dependency risk.</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-5 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">For Sleep Apnoea (US/UK)</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded p-3">
                    <p className="font-medium">CPAP Therapy</p>
                    <p className="text-gray-600">Continuous Positive Airway Pressure - standard treatment for OSA</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="font-medium">Oral Appliances</p>
                    <p className="text-gray-600">Custom mouthpieces to keep airway open</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="font-medium">Inspire System</p>
                    <p className="text-gray-600">Surgically implanted nerve stimulation for CPAP-intolerant patients</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Behavioural Treatments (CBT-I)</h3>
              <div className="space-y-3">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Sleep Restriction Therapy</h4>
                  <p className="text-sm text-gray-600">Limits time in bed to actual sleep duration to consolidate sleep.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Stimulus Control Therapy</h4>
                  <p className="text-sm text-gray-600">Re-associates bed with sleep. Go to bed only when sleepy; leave if unable to sleep within 15-20 mins.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Cognitive Therapy</h4>
                  <p className="text-sm text-gray-600">Identifies and modifies dysfunctional thoughts about sleep.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Relaxation Training</h4>
                  <p className="text-sm text-gray-600">Progressive muscle relaxation, deep breathing, biofeedback.</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Lifestyle Treatments</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">UK NHS Recommendations</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Consistent sleep/wake times</li>
                    <li>Avoid daytime naps</li>
                    <li>Exercise regularly (not near bedtime)</li>
                    <li>Reduce caffeine, alcohol, nicotine</li>
                    <li>Dark, quiet, cool bedroom</li>
                    <li>Avoid screens before bed</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">US CDC Recommendations</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Keep bedroom at 65-68°F (18-20°C)</li>
                    <li>Turn off devices 30+ mins before bed</li>
                    <li>Avoid large meals before bedtime</li>
                    <li>Get regular physical activity</li>
                    <li>Limit naps to 30 mins</li>
                    <li>Establish wind-down routine</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Management Strategies */}
          {activeSection === 'management' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" /> Management Strategies
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-4">By Age Group</h3>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">👶 Children</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Behavioural Strategies:</p>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>Consistent, calming bedtime routine</li>
                        <li>Regular bed and wake times</li>
                        <li>Graduated extinction (gradual separation)</li>
                        <li>Positive reinforcement and rewards</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Tools:</p>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>Sleep diaries</li>
                        <li>Reward charts</li>
                        <li>Visual schedules</li>
                        <li>Parent involvement essential</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">🧑‍🎓 Adolescents</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    <strong>Key challenge:</strong> Delayed Sleep Phase Syndrome, screen time, academic pressure
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Direct engagement with teen (not just parents)</li>
                    <li>Motivational interviewing for behaviour change</li>
                    <li>School-based interventions</li>
                    <li>CBT-I adapted for adolescents</li>
                    <li>Bright light therapy for delayed sleep phase</li>
                    <li>Later school start times recommended</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">🧑 Adults</h4>
                  <p className="font-medium text-gray-800 mb-2">Stepped Care Approach:</p>
                  <ol className="list-decimal pl-5 text-gray-600 text-sm space-y-1">
                    <li>Sleep hygiene education</li>
                    <li>CBT-I (first-line for chronic insomnia)</li>
                    <li>Digital CBT-I as accessible alternative</li>
                    <li>Pharmacotherapy if non-pharmacological insufficient</li>
                  </ol>
                  <p className="text-gray-600 text-sm mt-2">
                    <strong>Occupational considerations:</strong> Shift work management, work-life balance
                  </p>
                </div>

                <div className="bg-orange-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">👴 Elderly</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Considerations:</p>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>Age-related sleep architecture changes</li>
                        <li>Comorbid conditions</li>
                        <li>Medication review (polypharmacy)</li>
                        <li>Fall risk with hypnotics</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Recommended:</p>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>CBT-I and sleep hygiene (first-line)</li>
                        <li>Timed bright light therapy</li>
                        <li>Avoid long-term benzodiazepines</li>
                        <li>Lowest dose, shortest duration if needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Condition-Specific Management</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Sleep Apnoea</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>CPAP therapy (primary)</li>
                    <li>Weight management</li>
                    <li>Positional therapy</li>
                    <li>Avoid alcohol/sedatives</li>
                  </ul>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Restless Legs</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Regular exercise</li>
                    <li>Reduce caffeine</li>
                    <li>Iron replacement if deficient</li>
                    <li>Dopamine agonists</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Narcolepsy</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Stimulant medications</li>
                    <li>Scheduled naps</li>
                    <li>Good sleep hygiene</li>
                    <li>Support and counselling</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Support Sections */}
          {activeSection === 'support' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-orange-600" /> Support for Different Groups
              </h2>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">👪 For Parents</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">UK Resources:</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>NHS sleep advice pages</li>
                        <li>The Sleep Charity UK</li>
                        <li>NICE-recommended digital tools (Sleepio)</li>
                        <li>Local sleep clinics</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Practical Strategies:</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>Establish consistent bedtime routines</li>
                        <li>Create sleep-conducive environment</li>
                        <li>Model good sleep habits</li>
                        <li>Use positive reinforcement</li>
                        <li>Keep sleep diary to track patterns</li>
                        <li>Address bedtime fears and anxieties</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">👩‍🏫 For Teachers</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Role in Sleep Education:</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>Deliver classroom-based sleep education</li>
                        <li>Recognise signs of sleep deprivation</li>
                        <li>Provide feedback to parents</li>
                        <li>Support school-based programmes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Resources:</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>Sleep education worksheets</li>
                        <li>Interactive games about sleep</li>
                        <li>Age-appropriate curriculum</li>
                        <li>Head Start programmes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">🏥 For Carers</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Key Areas:</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>Understanding sleep needs of those in care</li>
                        <li>Managing sleep disturbances</li>
                        <li>Safe sleep practices</li>
                        <li>Recognising disorders requiring referral</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Special Populations:</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>Autism/intellectual disabilities: behavioural interventions with carer training</li>
                        <li>Elderly: medication management, fall risk, dementia-related disturbances</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">🙋 For Affected Persons</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">UK Resources:</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>NHS website sleep section</li>
                        <li>The Sleep Charity</li>
                        <li>Mind UK - sleep and mental health</li>
                      </ul>
                      <h4 className="font-medium text-gray-800 mt-3 mb-2">US Resources:</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>National Sleep Foundation</li>
                        <li>American Academy of Sleep Medicine</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Self-Management Tools:</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>Sleep diary apps</li>
                        <li>CBT-I mobile applications</li>
                        <li>Relaxation apps</li>
                        <li>Sleep tracking devices</li>
                        <li>Peer support groups</li>
                        <li>Online forums and communities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Intervention Tactics */}
          {activeSection === 'interventions' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" /> Intervention Tactics & Skills
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-4">Clinical Interventions</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Assessment Skills</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Taking comprehensive sleep history</li>
                    <li>Using validated screening tools</li>
                    <li>Interpreting sleep diaries</li>
                    <li>Recognising red flags for referral</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Therapeutic Skills</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>CBT-I delivery (all components)</li>
                    <li>Motivational interviewing</li>
                    <li>Psychoeducation using 3P Model</li>
                    <li>Relaxation training facilitation</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Behavioural Tactics by Age</h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">For Children</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li><strong>Bedtime fading:</strong> Gradually adjusting bedtime to match natural sleep onset</li>
                    <li><strong>Graduated extinction:</strong> Systematically reducing parental presence</li>
                    <li><strong>Positive reinforcement:</strong> Reward systems for meeting sleep goals</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">For Adolescents</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li><strong>Chronotherapy:</strong> Gradually shifting sleep schedule</li>
                    <li><strong>Bright light therapy:</strong> Morning light exposure to advance sleep phase</li>
                    <li><strong>Motivational enhancement:</strong> Addressing ambivalence about changing behaviours</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">For Adults & Elderly</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li><strong>Standard CBT-I:</strong> Full protocol with all components</li>
                    <li><strong>Brief interventions:</strong> Abbreviated CBT-I for primary care</li>
                    <li><strong>Mindfulness-based interventions:</strong> Complementary approaches</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Environmental Interventions</h3>
              <div className="bg-gray-50 rounded-lg p-5">
                <ul className="grid md:grid-cols-2 gap-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">✓ Bedroom environment optimisation</li>
                  <li className="flex items-center gap-2">✓ Light exposure management</li>
                  <li className="flex items-center gap-2">✓ Noise reduction strategies</li>
                  <li className="flex items-center gap-2">✓ Temperature regulation</li>
                </ul>
              </div>
            </div>
          )}

          {/* Evidence-Based Resources */}
          {activeSection === 'resources' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-teal-600" /> Evidence-Based Tools & Resources
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-4">Digital Therapeutics</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-5 border-2 border-green-300">
                  <h4 className="font-semibold text-gray-900 mb-2">🏆 Sleepio (NICE Recommended)</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Digital CBT-I programme recommended by NICE for primary care. Cost-saving compared to sleep hygiene or sleeping pills.
                  </p>
                  <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded">UK NHS Available</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">Other Digital CBT-I</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Bedtime Window</li>
                    <li>A Mindful Way</li>
                    <li>This Way Up: Managing Insomnia</li>
                    <li>RESTORE</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Gamified Sleep Apps</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">🏙️ SleepTown</h4>
                  <p className="text-gray-600 text-sm">Build virtual town by achieving sleep goals. Streaks, rewards, social features.</p>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">🐣 Sleepagotchi</h4>
                  <p className="text-gray-600 text-sm">Virtual pet grows with healthy sleep habits. Social play features.</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">🐦 Sleepy Bird</h4>
                  <p className="text-gray-600 text-sm">Gamified alarm using avoidance mechanics. Lose lives for snoozing.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">🧘 Calm</h4>
                  <p className="text-gray-600 text-sm">Meditation app with streaks, badges, daily tracking.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">⌚ Fitbit</h4>
                  <p className="text-gray-600 text-sm">Sleep tracking, challenges, badges, social leaderboards.</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">😴 Sleep Cycle</h4>
                  <p className="text-gray-600 text-sm">Smart alarm, points system, sleep analysis.</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Clinical Guidelines</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🇬🇧 UK</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>NICE insomnia guidance</li>
                    <li>NICE technology appraisals</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🇪🇺 Europe</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>ESRS Insomnia Guideline 2023</li>
                    <li>ESRS accreditation standards</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🇺🇸 US</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>AASM clinical practice guidelines</li>
                    <li>CDC sleep health recommendations</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Educational Resources</h3>
              <div className="bg-gray-50 rounded-lg p-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">For Patients:</h4>
                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                      <li>NHS sleep information pages</li>
                      <li>Sleep Foundation (US) educational content</li>
                      <li>The Sleep Charity UK resources</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">For Professionals:</h4>
                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                      <li>ESRS knowledge and skills catalogue</li>
                      <li>Sleep medicine certification programmes</li>
                      <li>Cochrane systematic reviews</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Warning Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-700">
            <strong>⚠️ Important:</strong> If sleep problems persist for more than 3 weeks or significantly interfere with daily functioning, 
            consult a healthcare professional. This information is educational and does not replace medical advice.
          </p>
        </div>

        {/* Footer CTA */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => setShowTracker(true)} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Moon className="w-4 h-4 mr-2" /> Track Your Sleep
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/techniques/4-7-8">Try Sleep Breathing</Link>
          </Button>
        </div>
      </div>

      {/* Evidence Sources */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EvidenceFooter sources={SLEEP_EVIDENCE_SOURCES} />
      </div>
    </div>
  )
}
