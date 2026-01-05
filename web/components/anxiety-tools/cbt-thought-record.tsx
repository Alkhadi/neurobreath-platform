'use client'

import { useState } from 'react'
import { Brain, Plus, Search, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useAchievements } from '@/hooks/use-achievements'
import { ThoughtRecord } from '@/lib/types'
import { toast } from 'sonner'

const EMOTIONS = [
  'Anxious', 'Worried', 'Scared', 'Panicked', 'Nervous', 'Tense',
  'Sad', 'Depressed', 'Hopeless', 'Guilty', 'Ashamed',
  'Angry', 'Frustrated', 'Irritated', 'Overwhelmed'
]

const COGNITIVE_DISTORTIONS = [
  { value: 'catastrophizing', label: 'Catastrophizing' },
  { value: 'black-white', label: 'Black-and-White Thinking' },
  { value: 'mind-reading', label: 'Mind Reading' },
  { value: 'fortune-telling', label: 'Fortune Telling' },
  { value: 'overgeneralization', label: 'Overgeneralization' },
  { value: 'should-statements', label: 'Should Statements' },
  { value: 'emotional-reasoning', label: 'Emotional Reasoning' },
  { value: 'labeling', label: 'Labeling' },
  { value: 'personalization', label: 'Personalization' },
  { value: 'disqualifying-positive', label: 'Disqualifying the Positive' }
]

export function CBTThoughtRecord() {
  const [records, setRecords] = useLocalStorage<ThoughtRecord[]>('neurobreath_thought_records', [])
  const { progress, setProgress } = useAchievements()
  const [activeTab, setActiveTab] = useState('new')
  const [searchTerm, setSearchTerm] = useState('')

  // Form state
  const [situation, setSituation] = useState('')
  const [automaticThought, setAutomaticThought] = useState('')
  const [emotion, setEmotion] = useState('')
  const [emotionIntensity, setEmotionIntensity] = useState([5])
  const [cognitiveDistortion, setCognitiveDistortion] = useState('')
  const [evidenceFor, setEvidenceFor] = useState('')
  const [evidenceAgainst, setEvidenceAgainst] = useState('')
  const [balancedThought, setBalancedThought] = useState('')
  const [newEmotionIntensity, setNewEmotionIntensity] = useState([5])

  const handleSave = () => {
    if (!situation || !automaticThought || !emotion || !balancedThought) {
      toast.error('Please fill in all required fields')
      return
    }

    const newRecord: ThoughtRecord = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      situation,
      automaticThought,
      emotion,
      emotionIntensity: emotionIntensity?.[0] ?? 5,
      cognitiveDistortion,
      evidenceFor,
      evidenceAgainst,
      balancedThought,
      newEmotionIntensity: newEmotionIntensity?.[0] ?? 5
    }

    setRecords([...(records ?? []), newRecord])

    // Update progress
    const today = new Date().toISOString().split('T')[0]
    const wasToday = progress?.lastActivityDate === today
    const newStreak = wasToday ? progress?.currentStreak ?? 0 : (progress?.currentStreak ?? 0) + 1

    setProgress({
      ...progress,
      totalSessions: (progress?.totalSessions ?? 0) + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress?.longestStreak ?? 0),
      lastActivityDate: today,
      stats: {
        ...(progress?.stats ?? {}),
        thoughtRecords: (progress?.stats?.thoughtRecords ?? 0) + 1
      }
    })

    toast.success('Thought record saved!', {
      description: 'Great work challenging your thoughts'
    })

    // Reset form
    setSituation('')
    setAutomaticThought('')
    setEmotion('')
    setEmotionIntensity([5])
    setCognitiveDistortion('')
    setEvidenceFor('')
    setEvidenceAgainst('')
    setBalancedThought('')
    setNewEmotionIntensity([5])
  }

  const handleDelete = (id: string) => {
    setRecords((records ?? []).filter(r => r?.id !== id))
    toast.success('Thought record deleted')
  }

  const filteredRecords = (records ?? []).filter(r => 
    r?.situation?.toLowerCase?.()?.includes?.(searchTerm?.toLowerCase?.() ?? '') ||
    r?.automaticThought?.toLowerCase?.()?.includes?.(searchTerm?.toLowerCase?.() ?? '')
  )

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'text-green-500'
    if (intensity <= 6) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">New Record</TabsTrigger>
          <TabsTrigger value="history">History ({records?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6 mt-6">
          {/* Header */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">CBT Thought Record</h2>
            </div>
            <p className="text-muted-foreground">
              Challenge negative automatic thoughts and develop more balanced perspectives.
            </p>
          </Card>

          {/* Form */}
          <div className="space-y-6">
            {/* Situation */}
            <Card className="p-6">
              <Label htmlFor="situation" className="text-base font-semibold mb-2 block">
                1. What happened? Describe the situation
              </Label>
              <Textarea
                id="situation"
                placeholder="Describe the event, where you were, who was there..."
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                rows={3}
              />
            </Card>

            {/* Automatic Thought */}
            <Card className="p-6">
              <Label htmlFor="thought" className="text-base font-semibold mb-2 block">
                2. What went through your mind? Automatic thought
              </Label>
              <Textarea
                id="thought"
                placeholder="What thought or image popped into your head?"
                value={automaticThought}
                onChange={(e) => setAutomaticThought(e.target.value)}
                rows={3}
              />
            </Card>

            {/* Emotion & Intensity */}
            <Card className="p-6 space-y-4">
              <Label className="text-base font-semibold">3. What did you feel? Emotion & intensity</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emotion" className="text-sm mb-2 block">Emotion</Label>
                  <Select value={emotion} onValueChange={setEmotion}>
                    <SelectTrigger id="emotion">
                      <SelectValue placeholder="Select emotion" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMOTIONS.map(e => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm mb-2 block">
                    Intensity: <span className={`font-bold ${getIntensityColor(emotionIntensity?.[0] ?? 5)}`}>
                      {emotionIntensity?.[0] ?? 5}/10
                    </span>
                  </Label>
                  <Slider
                    value={emotionIntensity}
                    onValueChange={setEmotionIntensity}
                    min={0}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Cognitive Distortion */}
            <Card className="p-6">
              <Label htmlFor="distortion" className="text-base font-semibold mb-2 block">
                4. Cognitive distortion (thinking error)
              </Label>
              <Select value={cognitiveDistortion} onValueChange={setCognitiveDistortion}>
                <SelectTrigger id="distortion">
                  <SelectValue placeholder="Select a thinking pattern" />
                </SelectTrigger>
                <SelectContent>
                  {COGNITIVE_DISTORTIONS.map(d => (
                    <SelectItem key={d?.value} value={d?.value ?? ''}>{d?.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {/* Evidence For/Against */}
            <Card className="p-6 space-y-4">
              <Label className="text-base font-semibold">5. Examine the evidence</Label>
              <div>
                <Label htmlFor="evidence-for" className="text-sm mb-2 block">Evidence FOR this thought</Label>
                <Textarea
                  id="evidence-for"
                  placeholder="What facts support this thought?"
                  value={evidenceFor}
                  onChange={(e) => setEvidenceFor(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="evidence-against" className="text-sm mb-2 block">Evidence AGAINST this thought</Label>
                <Textarea
                  id="evidence-against"
                  placeholder="What facts contradict this thought?"
                  value={evidenceAgainst}
                  onChange={(e) => setEvidenceAgainst(e.target.value)}
                  rows={2}
                />
              </div>
            </Card>

            {/* Balanced Thought */}
            <Card className="p-6 space-y-4">
              <Label htmlFor="balanced" className="text-base font-semibold mb-2 block">
                6. Balanced alternative thought
              </Label>
              <Textarea
                id="balanced"
                placeholder="Based on the evidence, what's a more realistic, balanced way to think about this?"
                value={balancedThought}
                onChange={(e) => setBalancedThought(e.target.value)}
                rows={3}
              />
              <div>
                <Label className="text-sm mb-2 block">
                  New emotion intensity: <span className={`font-bold ${getIntensityColor(newEmotionIntensity?.[0] ?? 5)}`}>
                    {newEmotionIntensity?.[0] ?? 5}/10
                  </span>
                </Label>
                <Slider
                  value={newEmotionIntensity}
                  onValueChange={setNewEmotionIntensity}
                  min={0}
                  max={10}
                  step={1}
                />
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-center">
              <Button size="lg" onClick={handleSave} className="px-8">
                <Plus className="mr-2 h-5 w-5" />
                Save Thought Record
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your thought records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Records List */}
          {filteredRecords?.length === 0 ? (
            <Card className="p-12 text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No records found' : 'No thought records yet. Start by creating your first one!'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRecords?.map(record => (
                <Card key={record?.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {new Date(record?.createdAt ?? '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{record?.emotion}</span>
                        <span className={`text-sm font-bold ${getIntensityColor(record?.emotionIntensity ?? 5)}`}>
                          {record?.emotionIntensity}/10
                        </span>
                        {record?.newEmotionIntensity !== undefined && (
                          <>
                            <span className="text-muted-foreground">→</span>
                            <span className={`text-sm font-bold ${getIntensityColor(record?.newEmotionIntensity ?? 5)}`}>
                              {record?.newEmotionIntensity}/10
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(record?.id ?? '')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold">Situation: </span>
                      <span className="text-muted-foreground">{record?.situation}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Automatic thought: </span>
                      <span className="text-muted-foreground">{record?.automaticThought}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Balanced thought: </span>
                      <span className="text-green-700">{record?.balancedThought}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Stats */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Your CBT Practice</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{records?.length ?? 0}</div>
            <div className="text-sm text-muted-foreground">Thought Records</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {records?.length ? Math.round(
                ((records?.reduce?.((sum, r) => sum + (r?.emotionIntensity ?? 0) - (r?.newEmotionIntensity ?? 0), 0) ?? 0) / (records?.length ?? 1)) * 10
              ) / 10 : 0}
            </div>
            <div className="text-sm text-muted-foreground">Avg. Intensity Reduction</div>
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
