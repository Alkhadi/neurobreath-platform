'use client'

import { useState } from 'react'
import { TrendingUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useAchievements } from '@/hooks/use-achievements'
import { ExposureLadder as ExposureLadderType, ExposureStep, ExposureAttempt } from '@/lib/types'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export function ExposureLadder() {
  const [ladders, setLadders] = useLocalStorage<ExposureLadderType[]>('neurobreath_exposure', [])
  const { progress, setProgress } = useAchievements()
  const [selectedLadderId, setSelectedLadderId] = useState(ladders?.[0]?.id ?? '')
  const [newLadderName, setNewLadderName] = useState('')
  const [newStepDescription, setNewStepDescription] = useState('')
  const [newStepAnxiety, setNewStepAnxiety] = useState([5])
  
  // Attempt tracking
  const [selectedStepId, setSelectedStepId] = useState('')
  const [anxietyBefore, setAnxietyBefore] = useState([5])
  const [anxietyDuring, setAnxietyDuring] = useState([5])
  const [anxietyAfter, setAnxietyAfter] = useState([5])
  const [duration, setDuration] = useState(15)
  const [attemptNotes, setAttemptNotes] = useState('')

  const selectedLadder = ladders?.find(l => l?.id === selectedLadderId)
  const sortedSteps = [...(selectedLadder?.steps ?? [])].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))

  const handleCreateLadder = () => {
    if (!newLadderName) return
    
    const newLadder: ExposureLadderType = {
      id: Date.now().toString(),
      name: newLadderName,
      createdAt: new Date().toISOString(),
      steps: [],
      attempts: []
    }
    
    setLadders([...(ladders ?? []), newLadder])
    setSelectedLadderId(newLadder?.id ?? '')
    setNewLadderName('')
    toast.success('Exposure ladder created!')
  }

  const handleAddStep = () => {
    if (!newStepDescription || !selectedLadder) return
    
    const newStep: ExposureStep = {
      id: Date.now().toString(),
      description: newStepDescription,
      anxietyLevel: newStepAnxiety?.[0] ?? 5,
      order: (selectedLadder?.steps?.length ?? 0) + 1,
      completed: false
    }
    
    setLadders((ladders ?? []).map(l => 
      l?.id === selectedLadderId 
        ? { ...l, steps: [...(l?.steps ?? []), newStep] }
        : l
    ))
    
    setNewStepDescription('')
    setNewStepAnxiety([5])
    toast.success('Step added to ladder!')
  }

  const handleDeleteStep = (stepId: string) => {
    setLadders((ladders ?? []).map(l =>
      l?.id === selectedLadderId
        ? { ...l, steps: (l?.steps ?? []).filter(s => s?.id !== stepId) }
        : l
    ))
  }

  const handleLogAttempt = () => {
    if (!selectedStepId || !selectedLadder) return
    
    const attempt: ExposureAttempt = {
      id: Date.now().toString(),
      stepId: selectedStepId,
      date: new Date().toISOString(),
      anxietyBefore: anxietyBefore?.[0] ?? 5,
      anxietyDuring: anxietyDuring?.[0] ?? 5,
      anxietyAfter: anxietyAfter?.[0] ?? 5,
      duration,
      notes: attemptNotes
    }
    
    setLadders((ladders ?? []).map(l =>
      l?.id === selectedLadderId
        ? { ...l, attempts: [...(l?.attempts ?? []), attempt] }
        : l
    ))

    // Check if step should be marked complete
    const stepAttempts = [...(selectedLadder?.attempts ?? []), attempt].filter(a => a?.stepId === selectedStepId)
    if (stepAttempts?.length >= 2 && stepAttempts?.slice(-2).every(a => (a?.anxietyAfter ?? 10) < 4)) {
      setLadders((ladders ?? []).map(l =>
        l?.id === selectedLadderId
          ? {
              ...l,
              steps: (l?.steps ?? []).map(s =>
                s?.id === selectedStepId ? { ...s, completed: true } : s
              )
            }
          : l
      ))
      toast.success('Step completed!', { description: 'Great progress on your exposure ladder' })
    }

    // Update progress
    const today = new Date().toISOString().split('T')[0]
    const wasToday = progress?.lastActivityDate === today
    const newStreak = wasToday ? progress?.currentStreak ?? 0 : (progress?.currentStreak ?? 0) + 1

    setProgress({
      ...progress,
      totalSessions: (progress?.totalSessions ?? 0) + 1,
      totalMinutes: (progress?.totalMinutes ?? 0) + Math.floor(duration),
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress?.longestStreak ?? 0),
      lastActivityDate: today,
      stats: {
        ...(progress?.stats ?? {}),
        exposureAttempts: (progress?.stats?.exposureAttempts ?? 0) + 1
      }
    })

    // Reset form
    setSelectedStepId('')
    setAnxietyBefore([5])
    setAnxietyDuring([5])
    setAnxietyAfter([5])
    setDuration(15)
    setAttemptNotes('')
    toast.success('Exposure attempt logged!')
  }

  const getStepAttemptsData = (stepId: string) => {
    const attempts = selectedLadder?.attempts?.filter(a => a?.stepId === stepId) ?? []
    return attempts?.map((a, i) => ({
      attempt: i + 1,
      before: a?.anxietyBefore ?? 0,
      during: a?.anxietyDuring ?? 0,
      after: a?.anxietyAfter ?? 0
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Exposure Ladder Builder</h2>
        </div>
        <p className="text-muted-foreground">
          Create a step-by-step plan to face your fears gradually, starting with less anxiety-provoking situations.
        </p>
      </Card>

      {/* Create/Select Ladder */}
      <Card className="p-6 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Create new ladder (e.g., Social Anxiety Ladder)"
            value={newLadderName}
            onChange={(e) => setNewLadderName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleCreateLadder}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {ladders && ladders?.length > 0 && (
          <div>
            <Label>Select Ladder</Label>
            <Select value={selectedLadderId} onValueChange={setSelectedLadderId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a ladder" />
              </SelectTrigger>
              <SelectContent>
                {ladders?.map(ladder => (
                  <SelectItem key={ladder?.id} value={ladder?.id ?? ''}>
                    {ladder?.name} ({ladder?.steps?.length ?? 0} steps)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </Card>

      {selectedLadder && (
        <>
          {/* Add Step */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Add New Step</h3>
            <div>
              <Label>Step Description</Label>
              <Input
                placeholder="Describe the exposure situation..."
                value={newStepDescription}
                onChange={(e) => setNewStepDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>Expected Anxiety Level: {newStepAnxiety?.[0] ?? 5}/10</Label>
              <Slider
                value={newStepAnxiety}
                onValueChange={setNewStepAnxiety}
                min={0}
                max={10}
                step={1}
                className="mt-2"
              />
            </div>
            <Button onClick={handleAddStep}>
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          </Card>

          {/* Ladder Steps */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Your Exposure Ladder</h3>
            {sortedSteps?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No steps yet. Add your first step above.
              </p>
            ) : (
              <div className="space-y-3">
                {sortedSteps?.map((step, index) => (
                  <div
                    key={step?.id}
                    className={`p-4 rounded-lg border-2 ${
                      step?.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step?.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Expected anxiety: {step?.anxietyLevel}/10</span>
                          <span>
                            Attempts: {selectedLadder?.attempts?.filter(a => a?.stepId === step?.id)?.length ?? 0}
                          </span>
                          {step?.completed && <span className="text-green-600 font-medium">✓ Completed</span>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStep(step?.id ?? '')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Log Attempt */}
          {sortedSteps?.length > 0 && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Log Exposure Attempt</h3>
              <div>
                <Label>Select Step</Label>
                <Select value={selectedStepId} onValueChange={setSelectedStepId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a step to practice" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedSteps?.map((step, index) => (
                      <SelectItem key={step?.id} value={step?.id ?? ''}>
                        Step {index + 1}: {step?.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedStepId && (
                <>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Anxiety Before: {anxietyBefore?.[0] ?? 5}/10</Label>
                      <Slider value={anxietyBefore} onValueChange={setAnxietyBefore} min={0} max={10} step={1} />
                    </div>
                    <div>
                      <Label>Anxiety During Peak: {anxietyDuring?.[0] ?? 5}/10</Label>
                      <Slider value={anxietyDuring} onValueChange={setAnxietyDuring} min={0} max={10} step={1} />
                    </div>
                    <div>
                      <Label>Anxiety After: {anxietyAfter?.[0] ?? 5}/10</Label>
                      <Slider value={anxietyAfter} onValueChange={setAnxietyAfter} min={0} max={10} step={1} />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                      min={1}
                    />
                  </div>
                  
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="How did it go? What did you learn?"
                      value={attemptNotes}
                      onChange={(e) => setAttemptNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <Button onClick={handleLogAttempt} className="w-full">
                    Log Attempt
                  </Button>

                  {/* Habituation Chart */}
                  {getStepAttemptsData(selectedStepId)?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Habituation Progress</h4>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getStepAttemptsData(selectedStepId)} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <XAxis dataKey="attempt" tick={{ fontSize: 10 }} tickLine={false} />
                            <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} tickLine={false} />
                            <Tooltip contentStyle={{ fontSize: 11 }} />
                            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                            <Line type="monotone" dataKey="before" stroke="#60B5FF" strokeWidth={2} name="Before" />
                            <Line type="monotone" dataKey="during" stroke="#FF9149" strokeWidth={2} name="During" />
                            <Line type="monotone" dataKey="after" stroke="#72BF78" strokeWidth={2} name="After" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  )
}
