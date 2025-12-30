'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle2,
  Printer,
  TrendingUp,
  AlertTriangle,
  Brain,
  Activity,
  FileText,
  MessageSquare,
  Sparkles,
  Info,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ReadingProfile,
  ORFMetrics,
  ErrorMark,
  getBandDisplay,
  getConfidenceDisplay,
  TRAINING_DISCLAIMER,
  SkillScore,
} from '@/lib/reading-profile'

interface AssessmentData {
  orf?: {
    passageId: string
    metrics: ORFMetrics
    errors: ErrorMark[]
    durationSeconds: number
  }
  wordList?: {
    wordListId: string
    responses: { itemText: string; isCorrect: boolean; responseTimeMs?: number }[]
    totalItems: number
    correctItems: number
    durationSeconds: number
  }
  pseudowords?: {
    wordListId: string
    responses: { itemText: string; isCorrect: boolean; responseTimeMs?: number }[]
    totalItems: number
    correctItems: number
    durationSeconds: number
  }
  comprehension?: {
    passageId: string
    responses: { questionId: string; selectedIndex: number; isCorrect: boolean; questionType: string }[]
    totalQuestions: number
    correctAnswers: number
    byType: Record<string, { correct: number; total: number }>
  }
}

// Import placement types
import type { PlacementResult } from '@/lib/placement-rubric'
import type { PlacementPlan } from '@/lib/placement-plan'
import { PlacementResults } from './PlacementResults'

interface AssessmentResultProps {
  profile: ReadingProfile
  data: AssessmentData
  attemptId?: string | null
  isSaving?: boolean
  placement?: PlacementResult
  plan?: PlacementPlan
  onFinish?: () => void
  onStartPlan?: () => void
}

function SkillBar({ skill, label, icon: Icon }: { skill: SkillScore; label: string; icon: React.ElementType }) {
  const bandDisplay = getBandDisplay(skill.band)
  const hasEnoughData = skill.itemsAssessed >= skill.minItemsRequired
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn(bandDisplay.bgColor, bandDisplay.color, 'border-0')}>
            {bandDisplay.label}
          </Badge>
          {!hasEnoughData && (
            <span className="text-xs text-muted-foreground">(limited data)</span>
          )}
        </div>
      </div>
      <Progress value={skill.score} className="h-3" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{skill.itemsAssessed} items assessed</span>
        <span>{skill.score}%</span>
      </div>
    </div>
  )
}

export function AssessmentResult({ 
  profile, 
  data, 
  attemptId, 
  isSaving, 
  placement,
  plan,
  onFinish,
  onStartPlan,
}: AssessmentResultProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showPlacement, setShowPlacement] = useState(true) // Default to showing placement
  const printRef = useRef<HTMLDivElement>(null)
  
  const overallBandDisplay = getBandDisplay(profile.overallBand)
  const confidenceDisplay = getConfidenceDisplay(profile.confidence)
  
  const handlePrint = () => {
    window.print()
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const totalDuration = (data.orf?.durationSeconds || 0) +
    (data.wordList?.durationSeconds || 0) +
    (data.pseudowords?.durationSeconds || 0)
  
  // If we have placement data and user wants to see it, show the PlacementResults view
  if (showPlacement && placement && plan) {
    return (
      <div className="space-y-4">
        <PlacementResults
          placement={placement}
          plan={plan}
          onStartPlan={onStartPlan}
          onRetakeAssessment={onFinish}
        />
        
        {/* Toggle to see detailed skills */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowPlacement(false)}
          >
            View Detailed Skills Breakdown
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6 print:space-y-4" ref={printRef}>
      {/* Toggle back to placement view if available */}
      {placement && plan && (
        <div className="text-center mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowPlacement(true)}
          >
            ← Back to Placement Results
          </Button>
        </div>
      )}
      
      {/* Header */}
      <Card className={cn('border-2', overallBandDisplay.bgColor)}>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center',
                overallBandDisplay.bgColor
              )}>
                <Sparkles className={cn('w-10 h-10', overallBandDisplay.color)} />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Suggested Reading Band
              </p>
              <h1 className={cn('text-4xl font-bold', overallBandDisplay.color)}>
                {overallBandDisplay.label}
              </h1>
              <p className="text-muted-foreground mt-2">{overallBandDisplay.description}</p>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <Badge variant="outline" className="gap-1">
                <Info className="w-3 h-3" />
                {confidenceDisplay.label}
              </Badge>
              <span className="text-muted-foreground">
                Assessment time: {formatTime(totalDuration)}
              </span>
            </div>
            
            {isSaving && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Saving results...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Disclaimer Banner */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 print:bg-amber-50">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Training & Monitoring Only.</strong> This is a NeuroBreath internal assessment (non-normed). 
            Results should not be compared to standardized assessments. For formal diagnosis, consult a qualified professional.
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="recommendations">Next Steps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Skills Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reading Profile</CardTitle>
              <CardDescription>Performance across key reading components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SkillBar skill={profile.decoding} label="Decoding" icon={Brain} />
              <SkillBar skill={profile.wordRecognition} label="Word Recognition" icon={FileText} />
              <SkillBar skill={profile.fluency} label="Fluency" icon={Activity} />
              <SkillBar skill={profile.comprehension} label="Comprehension" icon={MessageSquare} />
            </CardContent>
          </Card>
          
          {/* Strengths & Needs */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {profile.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Complete more assessment parts to identify strengths
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                  <TrendingUp className="w-5 h-5" />
                  Areas for Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.needs.length > 0 ? (
                  <ul className="space-y-2">
                    {profile.needs.map((n, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        {n}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Complete more assessment parts to identify growth areas
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-6">
          {/* Detailed skill breakdowns */}
          
          {/* ORF Details */}
          {data.orf && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Oral Reading Fluency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.orf.metrics.wcpm}</div>
                    <div className="text-xs text-muted-foreground">Words Correct/Min</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{data.orf.metrics.accuracyPct}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{data.orf.metrics.errorsTotal}</div>
                    <div className="text-xs text-muted-foreground">Errors</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{data.orf.metrics.selfCorrections}</div>
                    <div className="text-xs text-muted-foreground">Self-Corrections</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Word Recognition Details */}
          {data.wordList && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Word Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{data.wordList.correctItems}</div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{data.wordList.totalItems}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {Math.round((data.wordList.correctItems / data.wordList.totalItems) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Decoding Details */}
          {data.pseudowords && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Decoding (Pseudowords)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{data.pseudowords.correctItems}</div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{data.pseudowords.totalItems}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {Math.round((data.pseudowords.correctItems / data.pseudowords.totalItems) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Comprehension Details */}
          {data.comprehension && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Comprehension
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{data.comprehension.correctAnswers}</div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{data.comprehension.totalQuestions}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {Math.round((data.comprehension.correctAnswers / data.comprehension.totalQuestions) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                </div>
                
                {/* By Question Type */}
                {Object.keys(data.comprehension.byType).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">By Question Type</h4>
                    <div className="space-y-2">
                      {Object.entries(data.comprehension.byType).map(([type, stats]) => (
                        <div key={type} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{type.replace('-', ' ')}</span>
                          <span>
                            {stats.correct}/{stats.total} ({Math.round((stats.correct / stats.total) * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Assessment ID:</span>
                  <span className="ml-2 font-mono">{attemptId || 'Not saved'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Duration:</span>
                  <span className="ml-2">{formatTime(totalDuration)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="ml-2">{confidenceDisplay.label}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  {confidenceDisplay.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suggested Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="font-medium">{profile.suggestedFocus}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.decoding.band === 'beginner' || profile.decoding.band === 'elementary' ? (
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    Phonics Practice
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Focus on letter-sound correspondences, blending, and segmenting activities.
                    Try the Phonics Sounds Lab and Blending/Segmenting Lab.
                  </p>
                </div>
              ) : null}
              
              {profile.fluency.band === 'beginner' || profile.fluency.band === 'elementary' ? (
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Fluency Building
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Practice repeated reading with the Fluency Pacer.
                    Aim for smooth, expressive reading.
                  </p>
                </div>
              ) : null}
              
              {profile.comprehension.band === 'beginner' || profile.comprehension.band === 'elementary' ? (
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Comprehension Strategies
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Practice making predictions, asking questions, and summarizing.
                    Build vocabulary with the Vocabulary Builder.
                  </p>
                </div>
              ) : null}
              
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Regular Practice</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Consistent daily practice (10-15 minutes) is more effective than longer, less frequent sessions.
                  Take another Reading Check-In in 2-4 weeks to track progress.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Print-only content */}
      <div className="hidden print:block space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Reading Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SkillBar skill={profile.decoding} label="Decoding" icon={Brain} />
            <SkillBar skill={profile.wordRecognition} label="Word Recognition" icon={FileText} />
            <SkillBar skill={profile.fluency} label="Fluency" icon={Activity} />
            <SkillBar skill={profile.comprehension} label="Comprehension" icon={MessageSquare} />
          </CardContent>
        </Card>
        
        <div className="text-xs text-muted-foreground border-t pt-4">
          {TRAINING_DISCLAIMER}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-between print:hidden">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
        {onFinish && (
          <Button onClick={onFinish} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Done
          </Button>
        )}
      </div>
    </div>
  )
}
