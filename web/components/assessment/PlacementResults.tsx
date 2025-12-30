'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  AlertTriangle,
  Target,
  Calendar,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Trophy,
  BarChart3,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlacementResult } from '@/lib/placement-rubric'
import type { PlacementPlan, DailyPractice, WeeklyGoal } from '@/lib/placement-plan'
import { NB_LEVELS, LEARNER_GROUPS, SHORT_PLACEMENT_DISCLAIMER } from '@/lib/placement-levels'

interface PlacementResultsProps {
  placement: PlacementResult
  plan: PlacementPlan
  onStartPlan?: () => void
  onRetakeAssessment?: () => void
}

export function PlacementResults({
  placement,
  plan,
  onStartPlan,
  onRetakeAssessment,
}: PlacementResultsProps) {
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  const levelConfig = NB_LEVELS[placement.level]
  const groupConfig = LEARNER_GROUPS[placement.learnerGroup]
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Main Placement Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Your Reading Placement</CardTitle>
          <CardDescription>
            Based on your assessment results
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Level Badge */}
          <div className="text-center space-y-2">
            <div className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold',
              levelConfig.bgColor,
              levelConfig.color
            )}>
              <GraduationCap className="w-6 h-6" />
              {placement.level}: {levelConfig.label}
            </div>
            <p className="text-muted-foreground">{levelConfig.description}</p>
          </div>
          
          {/* Skill Levels Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(placement.skillLevels).map(([skill, level]) => {
              const skillConfig = NB_LEVELS[level]
              return (
                <div key={skill} className="p-3 rounded-lg bg-muted/50 text-center">
                  <div className="text-xs text-muted-foreground capitalize mb-1">
                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className={cn('font-semibold text-sm', skillConfig.color)}>
                    {level}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Learner Group & Confidence */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              <Users className="w-3 h-3 mr-1" />
              {groupConfig.label} ({groupConfig.ageRange})
            </Badge>
            <Badge variant="outline" className={cn(
              'px-3 py-1',
              placement.confidence === 'high' && 'border-green-500 text-green-600',
              placement.confidence === 'medium' && 'border-amber-500 text-amber-600',
              placement.confidence === 'low' && 'border-red-500 text-red-600'
            )}>
              {placement.confidence === 'high' && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {placement.confidence} confidence
            </Badge>
          </div>
          
          {/* Limiting Skills Alert */}
          {placement.limitingSkills.length > 0 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Focus Area{placement.limitingSkills.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {placement.limitingSkills.join(' and ')} skills will be a priority in your plan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <Button size="lg" className="w-full md:w-auto" onClick={onStartPlan}>
            <Play className="w-4 h-4 mr-2" />
            Start My Training Plan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          {/* Disclaimer */}
          <button
            onClick={() => setShowFullDisclaimer(!showFullDisclaimer)}
            className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <AlertTriangle className="w-3 h-3" />
            {SHORT_PLACEMENT_DISCLAIMER}
            {showFullDisclaimer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          
          {showFullDisclaimer && (
            <p className="text-xs text-muted-foreground max-w-lg text-center">
              {placement.disclaimer}
            </p>
          )}
        </CardFooter>
      </Card>
      
      {/* Plan Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Daily Plan
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            4-Week Goals
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Your Training Plan at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Plan Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{plan.recommendedMinutesPerDay}</div>
                  <div className="text-xs text-muted-foreground">minutes/day</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{plan.recommendedDaysPerWeek}</div>
                  <div className="text-xs text-muted-foreground">days/week</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{plan.lessonPath.length}</div>
                  <div className="text-xs text-muted-foreground">lessons</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{plan.totalWeeks}</div>
                  <div className="text-xs text-muted-foreground">weeks</div>
                </div>
              </div>
              
              {/* Primary Focus */}
              <div>
                <h4 className="font-medium mb-2">Primary Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.primaryFocus.map((focus, i) => (
                    <Badge key={i} variant="secondary">{focus}</Badge>
                  ))}
                </div>
              </div>
              
              {/* Skill Focus */}
              <div>
                <h4 className="font-medium mb-2">Skills You&apos;ll Develop</h4>
                <div className="flex flex-wrap gap-2">
                  {levelConfig.skillFocus.map((skill, i) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              {/* Starting Lesson */}
              {plan.startingLesson && (
                <div className="p-4 border rounded-lg bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Start Here</div>
                      <div className="font-medium">{plan.startingLesson.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {plan.startingLesson.durationMinutes} minutes • {plan.startingLesson.lessonType}
                      </div>
                    </div>
                    <Button size="sm" onClick={onStartPlan}>
                      Begin
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Daily Plan Tab */}
        <TabsContent value="daily" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Week 1 Daily Practice
              </CardTitle>
              <CardDescription>
                Recommended daily activities to build consistent practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.dailyPractice.map((day: DailyPractice) => (
                <div key={day.dayNumber} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">{day.dayLabel}</div>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {day.totalMinutes} min
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {day.activities.map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {activity.order}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{activity.lesson.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {activity.estimatedMinutes} min • {activity.lesson.skillFocus.join(', ')}
                          </div>
                        </div>
                        {activity.isRequired && (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Weekly Goals Tab */}
        <TabsContent value="weekly" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                4-Week Training Goals
              </CardTitle>
              <CardDescription>
                Progressive milestones to track your reading journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.weeklyGoals.map((week: WeeklyGoal) => (
                <div key={week.weekNumber} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {week.weekNumber}
                    </div>
                    <div>
                      <div className="font-medium">Week {week.weekNumber}</div>
                      <div className="text-sm text-muted-foreground">{week.goalDescription}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 ml-13">
                    <div className="text-sm font-medium">Milestones:</div>
                    <ul className="space-y-1">
                      {week.milestones.map((milestone, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-muted-foreground/50" />
                          {milestone}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {week.targetSkills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Reassessment Info */}
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Ready to Reassess After {plan.reassessAfterWeeks} Weeks</p>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {plan.reassessmentCriteria.map((criterion, i) => (
                        <li key={i}>• {criterion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" onClick={onStartPlan}>
          <Play className="w-4 h-4 mr-2" />
          Start My Training Plan
        </Button>
        <Button variant="outline" onClick={onRetakeAssessment}>
          Retake Assessment
        </Button>
      </div>
    </div>
  )
}
