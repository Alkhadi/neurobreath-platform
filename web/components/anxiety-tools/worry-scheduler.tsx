'use client'

import { useState } from 'react'
import { Clock, Plus, Check, X, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useAchievements } from '@/hooks/use-achievements'
import { WorryEntry, WorrySchedule } from '@/lib/types'
import { toast } from 'sonner'

export function WorryScheduler() {
  const [worries, setWorries] = useLocalStorage<WorryEntry[]>('neurobreath_worries', [])
  const [schedule, setSchedule] = useLocalStorage<WorrySchedule>('neurobreath_worry_schedule', {
    enabled: true,
    startTime: '19:00',
    duration: 15
  })
  const [newWorryText, setNewWorryText] = useState('')
  const [actionPlan, setActionPlan] = useState<Record<string, string>>({})
  const { progress, setProgress } = useAchievements()

  const activeWorries = (worries ?? []).filter(w => !w?.archivedAt)
  const archivedWorries = (worries ?? []).filter(w => w?.archivedAt)
  const pendingWorries = activeWorries?.filter(w => w?.category === 'pending')
  const actionableWorries = activeWorries?.filter(w => w?.category === 'actionable')
  const notInControlWorries = activeWorries?.filter(w => w?.category === 'not-in-control')

  const handleAddWorry = () => {
    if (!newWorryText?.trim()) return

    const newWorry: WorryEntry = {
      id: Date.now().toString(),
      content: newWorryText,
      createdAt: new Date().toISOString(),
      category: 'pending',
      resolved: false
    }

    setWorries([...(worries ?? []), newWorry])
    setNewWorryText('')
    toast.success('Worry captured', {
      description: "You'll review it during your worry time"
    })
  }

  const handleCategorize = (id: string, category: 'actionable' | 'not-in-control') => {
    setWorries((worries ?? []).map(w => 
      w?.id === id ? { ...w, category } : w
    ))
  }

  const handleSaveAction = (id: string) => {
    const action = actionPlan?.[id]
    if (!action) return

    setWorries((worries ?? []).map(w =>
      w?.id === id ? { ...w, action } : w
    ))
    setActionPlan(prev => {
      const newPlan = { ...prev }
      delete newPlan?.[id]
      return newPlan
    })
    toast.success('Action plan saved!')
  }

  const handleResolve = (id: string) => {
    setWorries((worries ?? []).map(w =>
      w?.id === id ? { ...w, resolved: true } : w
    ))
    toast.success('Worry marked as resolved!')
  }

  const handleArchive = (id: string) => {
    setWorries((worries ?? []).map(w =>
      w?.id === id ? { ...w, archivedAt: new Date().toISOString() } : w
    ))
    toast.success('Worry archived')
  }

  const handleDelete = (id: string) => {
    setWorries((worries ?? []).filter(w => w?.id !== id))
    toast.success('Worry deleted')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Worry Time Scheduler</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Postpone worries throughout the day, then address them during a scheduled 15-minute window.
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Worry time:</span>
            <Input
              type="time"
              value={schedule?.startTime ?? '19:00'}
              onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
              className="w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Duration:</span>
            <Input
              type="number"
              value={schedule?.duration ?? 15}
              onChange={(e) => setSchedule({ ...schedule, duration: parseInt(e.target.value) || 15 })}
              min={5}
              max={30}
              className="w-20"
            />
            <span className="text-sm">minutes</span>
          </div>
        </div>
      </Card>

      {/* Quick Capture */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">Quick Capture Worry</h3>
        <div className="flex gap-2">
          <Input
            placeholder="What's worrying you right now?"
            value={newWorryText}
            onChange={(e) => setNewWorryText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddWorry()}
            className="flex-1"
          />
          <Button onClick={handleAddWorry}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({pendingWorries?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="actionable">
            Actionable ({actionableWorries?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="not-in-control">
            Let Go ({notInControlWorries?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archive ({archivedWorries?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingWorries?.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No pending worries. Great!</p>
            </Card>
          ) : (
            pendingWorries?.map(worry => (
              <Card key={worry?.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="flex-1 text-sm">{worry?.content}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(worry?.id ?? '')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCategorize(worry?.id ?? '', 'actionable')}
                    className="flex-1"
                  >
                    I can take action
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCategorize(worry?.id ?? '', 'not-in-control')}
                    className="flex-1"
                  >
                    Not in my control
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="actionable" className="space-y-4 mt-6">
          {actionableWorries?.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No actionable worries categorized yet.</p>
            </Card>
          ) : (
            actionableWorries?.map(worry => (
              <Card key={worry?.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="flex-1 text-sm font-medium">{worry?.content}</p>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResolve(worry?.id ?? '')}
                      disabled={worry?.resolved}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchive(worry?.id ?? '')}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {worry?.action ? (
                  <div className="bg-green-50 p-3 rounded-md text-sm">
                    <span className="font-semibold">Action plan: </span>
                    {worry?.action}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="What action can you take?"
                      value={actionPlan?.[worry?.id ?? ''] ?? ''}
                      onChange={(e) => setActionPlan({ ...actionPlan, [worry?.id ?? '']: e.target.value })}
                      rows={2}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveAction(worry?.id ?? '')}
                    >
                      Save Action Plan
                    </Button>
                  </div>
                )}
                {worry?.resolved && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    ✓ Resolved
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="not-in-control" className="space-y-4 mt-6">
          {notInControlWorries?.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No worries in this category yet.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="p-4 bg-blue-50">
                <p className="text-sm text-blue-900">
                  These worries are outside your control. Acknowledge them, then practice letting them go.
                </p>
              </Card>
              {notInControlWorries?.map(worry => (
                <Card key={worry?.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <p className="flex-1 text-sm">{worry?.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchive(worry?.id ?? '')}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4 mt-6">
          {archivedWorries?.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No archived worries yet.</p>
            </Card>
          ) : (
            archivedWorries?.map(worry => (
              <Card key={worry?.id} className="p-4 opacity-60">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm">{worry?.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Archived {new Date(worry?.archivedAt ?? '').toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(worry?.id ?? '')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Stats */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Worry Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{activeWorries?.length ?? 0}</div>
            <div className="text-sm text-muted-foreground">Active Worries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {actionableWorries?.filter(w => w?.resolved)?.length ?? 0}
            </div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{notInControlWorries?.length ?? 0}</div>
            <div className="text-sm text-muted-foreground">Let Go</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-muted-foreground">{archivedWorries?.length ?? 0}</div>
            <div className="text-sm text-muted-foreground">Archived</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
