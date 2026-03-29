'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  loadTrainingResult,
  loadSessionProgress,
  saveSessionProgress,
  type SavedTrainingResult,
  type SessionProgress,
} from '@/lib/dyslexia/reading-training-store'
import { NB_LEVELS, LEARNER_GROUPS } from '@/lib/placement-levels'
import type { LessonReference, DailyPractice, WeeklyGoal } from '@/lib/placement-plan'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  ChevronRight,
  Target,
  Calendar,
  Trophy,
  Play,
  RotateCcw,
  Lightbulb,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Age-group icons
// ─────────────────────────────────────────────────────────────────────────────
const GROUP_EMOJIS: Record<string, string> = {
  children: '🧒',
  youth: '👦',
  adolescence: '🧑',
  adult: '👨',
  senior: '👴',
}

// ─────────────────────────────────────────────────────────────────────────────
// Motivational tips by learner group
// ─────────────────────────────────────────────────────────────────────────────
const GROUP_TIPS: Record<string, string[]> = {
  children: [
    'Great job starting your reading adventure!',
    'Every word you read makes you stronger.',
    'Reading is like a superpower — keep practising!',
    'You\'re doing amazing. Keep it up!',
  ],
  youth: [
    'Consistency is the secret weapon of great readers.',
    'Short daily sessions beat occasional long ones — every time.',
    'Your brain gets stronger with every practice session.',
  ],
  adolescence: [
    'Every session moves you closer to your reading goals.',
    'The most successful learners practise little and often.',
    'Reading skills open every door — keep going.',
  ],
  adult: [
    'Research confirms: adults make significant gains with structured practice.',
    'Even 20 minutes daily produces measurable improvement within weeks.',
    'Your commitment to learning is something to be proud of.',
  ],
  senior: [
    'It\'s never too late to strengthen reading skills.',
    'Every practice session is an investment in your independence.',
    'Research shows reading practice benefits the brain at any age.',
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Lesson type labels
// ─────────────────────────────────────────────────────────────────────────────
const LESSON_TYPE_LABEL: Record<string, string> = {
  lesson: 'Lesson',
  practice: 'Practice',
  game: 'Activity',
  worksheet: 'Worksheet',
}

// ─────────────────────────────────────────────────────────────────────────────
// Skill focus display names
// ─────────────────────────────────────────────────────────────────────────────
const SKILL_LABELS: Record<string, string> = {
  decoding: 'Decoding',
  'word-recognition': 'Word Recognition',
  fluency: 'Fluency',
  comprehension: 'Comprehension',
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab definitions
// ─────────────────────────────────────────────────────────────────────────────
type Tab = 'today' | 'overview' | 'weekly' | 'progress'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'today', label: "Today's Session", icon: Play },
  { id: 'overview', label: 'Overview', icon: Target },
  { id: 'weekly', label: '4-Week Goals', icon: Calendar },
  { id: 'progress', label: 'Progress', icon: Trophy },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function TrainingPlanPage() {
  const [saved, setSaved] = useState<SavedTrainingResult | null>(null)
  const [sessionProgress, setSessionProgress] = useState<SessionProgress | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('today')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSaved(loadTrainingResult())
    setSessionProgress(loadSessionProgress())
  }, [])

  const toggleLesson = (slug: string) => {
    if (!sessionProgress) return
    const already = sessionProgress.completedSlugs.includes(slug)
    const completedSlugs = already
      ? sessionProgress.completedSlugs.filter(s => s !== slug)
      : [...sessionProgress.completedSlugs, slug]
    const updated: SessionProgress = {
      ...sessionProgress,
      completedSlugs,
      totalLessonsCompleted: already
        ? Math.max(0, sessionProgress.totalLessonsCompleted - 1)
        : sessionProgress.totalLessonsCompleted + 1,
    }
    setSessionProgress(updated)
    saveSessionProgress(updated)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Loading your plan…</p>
      </div>
    )
  }

  // ── No placement result — prompt to take assessment ─────────────────────
  if (!saved) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-blue-600 text-white px-4 py-10 text-center space-y-4">
          <BookOpen className="w-12 h-12 mx-auto opacity-80" />
          <h1 className="text-2xl font-bold">No Training Plan Yet</h1>
          <p className="text-white/80 max-w-sm mx-auto">
            Complete the Reading Check-In assessment first. It takes 6–12 minutes
            and creates a personalised training plan for you.
          </p>
          <Link href="/dyslexia-reading-training">
            <Button className="bg-white text-blue-700 hover:bg-white/90 font-semibold mt-2">
              Take the Reading Assessment
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const { placement, plan } = saved
  const levelConfig = NB_LEVELS[placement.level]
  const groupConfig = LEARNER_GROUPS[placement.learnerGroup]
  const tips = GROUP_TIPS[placement.learnerGroup] ?? GROUP_TIPS.adult
  const tipOfDay = tips[new Date().getDay() % tips.length]
  const emoji = GROUP_EMOJIS[placement.learnerGroup] ?? '📖'

  // Today's lessons (Day 1 of daily practice)
  const todayActivities: DailyPractice['activities'] = plan.dailyPractice[0]?.activities ?? []
  const todayDone = todayActivities.filter(a => sessionProgress?.completedSlugs.includes(a.lesson.slug)).length
  const todayPct = todayActivities.length > 0 ? Math.round((todayDone / todayActivities.length) * 100) : 0

  const containerCls = 'max-w-2xl mx-auto px-4'

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="bg-gradient-to-b from-blue-700 to-blue-600 text-white">
        <div className={`${containerCls} pt-4 pb-6 space-y-4`}>
          <Link
            href="/dyslexia-reading-training"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Training Hub
          </Link>

          {/* Level + group */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">My Reading Plan</p>
              <h1 className="text-xl font-bold leading-tight">
                {emoji} {groupConfig.label} · {levelConfig.label}
              </h1>
              <p className="text-white/80 text-sm">{levelConfig.description}</p>
            </div>
            <div
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${levelConfig.bgColor} ${levelConfig.color}`}
            >
              {placement.level}
            </div>
          </div>

          {/* Streak + tip */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 flex-shrink-0">
              <Flame className="w-5 h-5 text-orange-300" />
              <div className="text-center">
                <p className="text-lg font-bold leading-none">{sessionProgress?.streakDays ?? 0}</p>
                <p className="text-xs text-white/60">streak</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2 flex-1 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-300 flex-shrink-0" />
              <p className="text-xs text-white/80 leading-snug">{tipOfDay}</p>
            </div>
          </div>

          {/* Today's progress */}
          {todayActivities.length > 0 && (
            <div className="bg-white/10 rounded-xl px-4 py-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Today&apos;s progress</span>
                <span className="font-medium">{todayDone}/{todayActivities.length} activities</span>
              </div>
              <Progress value={todayPct} className="h-2 bg-white/20" />
            </div>
          )}
        </div>
      </header>

      {/* ── Tab navigation ────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 bg-background border-b border-border">
        <div className={`${containerCls} flex gap-0 overflow-x-auto`}>
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex-1 justify-center
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── TODAY'S SESSION tab ───────────────────────────────────────────── */}
      {activeTab === 'today' && (
        <main className={`${containerCls} py-6 space-y-6`}>

          {/* Session header */}
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">Today&apos;s Session</h2>
            <p className="text-sm text-muted-foreground">
              {plan.recommendedMinutesPerDay} min · {plan.recommendedDaysPerWeek} days/week · {groupConfig.ageRange}
            </p>
          </div>

          {/* Focus areas */}
          {placement.limitingSkills.length > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <TrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Focus Area</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  {placement.limitingSkills.join(' and ')} — these will be prioritised in each session.
                </p>
              </div>
            </div>
          )}

          {/* Activity list — flat, no nested cards */}
          {todayActivities.length > 0 ? (
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {todayActivities.map((activity, idx) => {
                const slug = activity.lesson.slug
                const done = sessionProgress?.completedSlugs.includes(slug) ?? false
                return (
                  <div
                    key={slug}
                    className={`flex items-center gap-4 px-4 py-4 transition-colors
                      ${done ? 'bg-emerald-50 dark:bg-emerald-950/10' : 'bg-background hover:bg-muted/30'}`}
                  >
                    {/* Step number / check */}
                    <button
                      onClick={() => toggleLesson(slug)}
                      aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                        ${done
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-muted-foreground/30 hover:border-emerald-400'
                        }`}
                    >
                      {done
                        ? <CheckCircle2 className="w-4 h-4" />
                        : <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                      }
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-tight ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {activity.lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.estimatedMinutes} min
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {LESSON_TYPE_LABEL[activity.lesson.lessonType] ?? activity.lesson.lessonType}
                        </span>
                        {activity.lesson.skillFocus.map(sf => (
                          <span key={sf} className="text-xs text-muted-foreground">
                            {SKILL_LABELS[sf] ?? sf}
                          </span>
                        ))}
                        {activity.isRequired && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">Required</Badge>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    {!done && (
                      <Link
                        href={`/dyslexia-reading-training/plan/lesson/${slug}`}
                        className="flex-shrink-0"
                      >
                        <Button size="sm" className="gap-1 text-xs">
                          Start
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground space-y-2">
              <BookOpen className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm">No activities scheduled. Retake the assessment to get a fresh plan.</p>
            </div>
          )}

          {/* Completed today banner */}
          {todayDone === todayActivities.length && todayActivities.length > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <Trophy className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Session complete!</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">Come back tomorrow to keep your streak going.</p>
              </div>
            </div>
          )}

          {/* Link to full toolkit */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Access all practice tools:</p>
            <Link href="/dyslexia-reading-training">
              <Button variant="outline" className="w-full gap-2">
                <BookOpen className="w-4 h-4" />
                Open Full Training Toolkit
              </Button>
            </Link>
          </div>
        </main>
      )}

      {/* ── OVERVIEW tab ──────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <main className={`${containerCls} py-6 space-y-6`}>
          <h2 className="text-lg font-bold text-foreground">Your Plan at a Glance</h2>

          {/* Stats — 2×2 grid, flat */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Min / day', value: plan.recommendedMinutesPerDay, Icon: Clock },
              { label: 'Days / week', value: plan.recommendedDaysPerWeek, Icon: Calendar },
              { label: 'Lessons', value: plan.lessonPath.length, Icon: BookOpen },
              { label: 'Weeks', value: plan.totalWeeks, Icon: Target },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-xl border border-border p-4 flex items-center gap-3">
                <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-xl font-bold text-foreground leading-none">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Learner group */}
          <div className="flex items-center gap-3 py-4 border-t border-border">
            <Users className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{groupConfig.label} · {groupConfig.ageRange}</p>
              <p className="text-xs text-muted-foreground">{groupConfig.description}</p>
            </div>
          </div>

          {/* Primary focus */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Primary Focus Areas</p>
            <div className="flex flex-wrap gap-2">
              {plan.primaryFocus.map((f, i) => (
                <Badge key={i} variant="secondary" className="text-sm">{f}</Badge>
              ))}
            </div>
          </div>

          {/* Skills you'll develop */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Skills You&apos;ll Develop</p>
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {levelConfig.skillFocus.map((skill, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <p className="text-sm text-foreground">{skill}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Starting lesson */}
          {plan.startingLesson && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Start Here</p>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                  <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{plan.startingLesson.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {plan.startingLesson.durationMinutes} min · {LESSON_TYPE_LABEL[plan.startingLesson.lessonType] ?? plan.startingLesson.lessonType}
                  </p>
                </div>
                <Link href={`/dyslexia-reading-training/plan/lesson/${plan.startingLesson.slug}`}>
                  <Button size="sm" className="gap-1">
                    Begin
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Full lesson path */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Full Lesson Path ({plan.lessonPath.length} lessons)</p>
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {plan.lessonPath.map((lesson: LessonReference, i: number) => {
                const done = sessionProgress?.completedSlugs.includes(lesson.slug) ?? false
                return (
                  <div key={lesson.slug} className={`flex items-center gap-3 px-4 py-3 ${done ? 'bg-muted/40' : ''}`}>
                    <span className={`text-xs font-bold w-5 text-center flex-shrink-0 ${done ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                      {done ? '✓' : i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.durationMinutes} min</p>
                    </div>
                    <Link href={`/dyslexia-reading-training/plan/lesson/${lesson.slug}`}>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        {done ? 'Review' : 'Start'}
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      )}

      {/* ── 4-WEEK GOALS tab ──────────────────────────────────────────────── */}
      {activeTab === 'weekly' && (
        <main className={`${containerCls} py-6 space-y-6`}>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">4-Week Training Goals</h2>
            <p className="text-sm text-muted-foreground">Progressive milestones to guide your reading journey.</p>
          </div>

          <div className="space-y-4">
            {plan.weeklyGoals.map((week: WeeklyGoal) => (
              <div key={week.weekNumber} className="rounded-xl border border-border overflow-hidden">
                {/* Week header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-b border-border">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {week.weekNumber}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Week {week.weekNumber}</p>
                    <p className="text-xs text-muted-foreground">{week.goalDescription}</p>
                  </div>
                </div>

                {/* Milestones */}
                <div className="divide-y divide-border">
                  {week.milestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3">
                      <Circle className="w-4 h-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{m}</p>
                    </div>
                  ))}
                </div>

                {/* Target skills */}
                <div className="px-4 py-3 border-t border-border flex flex-wrap gap-1.5">
                  {week.targetSkills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Reassessment */}
          <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/30">
            <RotateCcw className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Reassess after {plan.reassessAfterWeeks} weeks</p>
              <ul className="space-y-0.5">
                {plan.reassessmentCriteria.map((c, i) => (
                  <li key={i} className="text-xs text-muted-foreground">· {c}</li>
                ))}
              </ul>
              <Link href="/dyslexia-reading-training" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline">
                Retake Assessment <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </main>
      )}

      {/* ── PROGRESS tab ──────────────────────────────────────────────────── */}
      {activeTab === 'progress' && (
        <main className={`${containerCls} py-6 space-y-6`}>
          <h2 className="text-lg font-bold text-foreground">My Progress</h2>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Day Streak', value: sessionProgress?.streakDays ?? 0, Icon: Flame, color: 'text-orange-500' },
              { label: 'Lessons Done', value: sessionProgress?.totalLessonsCompleted ?? 0, Icon: CheckCircle2, color: 'text-emerald-500' },
              { label: 'Today', value: `${todayDone}/${todayActivities.length}`, Icon: Clock, color: 'text-blue-500' },
            ].map(({ label, value, Icon, color }) => (
              <div key={label} className="rounded-xl border border-border p-3 text-center space-y-1">
                <Icon className={`w-5 h-5 mx-auto ${color}`} />
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Today progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground font-medium">Today&apos;s Session</span>
              <span className="text-muted-foreground">{todayPct}%</span>
            </div>
            <Progress value={todayPct} className="h-2.5" />
            <p className="text-xs text-muted-foreground">{todayDone} of {todayActivities.length} activities complete</p>
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Milestones</p>
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {[
                { label: 'First day complete', achieved: (sessionProgress?.streakDays ?? 0) >= 1 },
                { label: '7-day streak', achieved: (sessionProgress?.streakDays ?? 0) >= 7 },
                { label: '21-day streak — habit forming!', achieved: (sessionProgress?.streakDays ?? 0) >= 21 },
                { label: '10 lessons completed', achieved: (sessionProgress?.totalLessonsCompleted ?? 0) >= 10 },
                { label: '25 lessons completed', achieved: (sessionProgress?.totalLessonsCompleted ?? 0) >= 25 },
                { label: 'Full lesson path complete', achieved: (sessionProgress?.totalLessonsCompleted ?? 0) >= plan.lessonPath.length },
              ].map((m, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${m.achieved ? 'bg-emerald-50 dark:bg-emerald-950/10' : ''}`}>
                  {m.achieved
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    : <Circle className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
                  }
                  <p className={`text-sm ${m.achieved ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{m.label}</p>
                  {m.achieved && <Trophy className="w-4 h-4 text-amber-400 ml-auto flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Encouraging quote */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs italic text-muted-foreground leading-relaxed">
              &ldquo;Dyslexia is not a problem with intelligence — it is a different way of thinking.
              With the right support and strategies, there are no limits.&rdquo;
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">— British Dyslexia Association</p>
          </div>

          {/* Retake */}
          <div className="pt-2 border-t border-border">
            <Link href="/dyslexia-reading-training">
              <Button variant="outline" className="w-full gap-2">
                <RotateCcw className="w-4 h-4" />
                Retake Reading Assessment
              </Button>
            </Link>
          </div>
        </main>
      )}

      {/* ── Footer disclaimer ─────────────────────────────────────────────── */}
      <footer className="border-t border-border py-6">
        <div className={`${containerCls}`}>
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            Training placement only. Not a diagnosis or grade-level equivalence.
            For formal assessment of reading difficulties, consult a qualified educational professional.
          </p>
        </div>
      </footer>

    </div>
  )
}
