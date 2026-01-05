"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Award, Sparkles, Medal, Zap, Target, TrendingUp } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  category: "streak" | "learning" | "practice" | "milestone"
}

const allAchievements: Omit<Achievement, "unlockedAt">[] = [
  // Streak achievements
  {
    id: "streak-3",
    title: "Getting Started",
    description: "Complete 3 days in a row",
    icon: "🔥",
    category: "streak"
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Complete 7 days in a row",
    icon: "⭐",
    category: "streak"
  },
  {
    id: "streak-14",
    title: "Two Week Champion",
    description: "Complete 14 days in a row",
    icon: "🏅",
    category: "streak"
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "Complete 30 days in a row",
    icon: "👑",
    category: "streak"
  },
  {
    id: "streak-100",
    title: "Century Legend",
    description: "Complete 100 days in a row",
    icon: "💎",
    category: "streak"
  },
  
  // Learning achievements
  {
    id: "quiz-first",
    title: "Knowledge Seeker",
    description: "Complete your first quiz",
    icon: "🧠",
    category: "learning"
  },
  {
    id: "quiz-perfect",
    title: "Perfect Score",
    description: "Get 100% on a quiz",
    icon: "💯",
    category: "learning"
  },
  {
    id: "quiz-5",
    title: "Quiz Master",
    description: "Complete 5 quizzes",
    icon: "📚",
    category: "learning"
  },
  {
    id: "quiz-80-avg",
    title: "Consistent Excellence",
    description: "Maintain 80%+ average over 3 quizzes",
    icon: "✨",
    category: "learning"
  },
  
  // Practice achievements
  {
    id: "challenge-first",
    title: "First Steps",
    description: "Complete your first daily challenge",
    icon: "🎯",
    category: "practice"
  },
  {
    id: "challenge-all-day",
    title: "Daily Dominator",
    description: "Complete all challenges in one day",
    icon: "🚀",
    category: "practice"
  },
  {
    id: "challenge-50",
    title: "Dedicated Supporter",
    description: "Complete 50 total challenges",
    icon: "💪",
    category: "practice"
  },
  {
    id: "challenge-variety",
    title: "Well-Rounded",
    description: "Complete challenges from all 4 categories",
    icon: "🌈",
    category: "practice"
  },
  
  // Milestone achievements
  {
    id: "points-100",
    title: "100 Points",
    description: "Earn 100 total points",
    icon: "⚡",
    category: "milestone"
  },
  {
    id: "points-500",
    title: "500 Points",
    description: "Earn 500 total points",
    icon: "💫",
    category: "milestone"
  },
  {
    id: "points-1000",
    title: "1000 Points",
    description: "Earn 1000 total points",
    icon: "🌟",
    category: "milestone"
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Check in before 8 AM",
    icon: "🌅",
    category: "milestone"
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Check in after 10 PM",
    icon: "🦉",
    category: "milestone"
  },
  {
    id: "week-complete",
    title: "Week Complete",
    description: "Check in every day for a full week",
    icon: "📅",
    category: "milestone"
  },
]

export function AchievementBoard() {
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<Achievement[]>("anxiety-support-achievements", [])
  
  // Check and unlock achievements based on other stored data
  const [streak] = useLocalStorage<{ currentStreak: number; totalCheckIns: number }>("anxiety-support-streak", { currentStreak: 0, totalCheckIns: 0 })
  const [quizResults] = useLocalStorage<Array<{ score: number; totalQuestions: number }>>("anxiety-support-quiz-results", [])
  const [totalPoints] = useLocalStorage<number>("anxiety-support-points", 0)
  const [completed] = useLocalStorage<Array<{ challengeId: string; completedDate: string }>>("anxiety-support-challenges", [])
  
  // Auto-unlock achievements (simplified logic)
  const shouldUnlock = (achievementId: string): boolean => {
    if (unlockedAchievements.some(a => a.id === achievementId)) return false
    
    switch(achievementId) {
      case "streak-3": return streak.currentStreak >= 3
      case "streak-7": return streak.currentStreak >= 7
      case "streak-14": return streak.currentStreak >= 14
      case "streak-30": return streak.currentStreak >= 30
      case "streak-100": return streak.currentStreak >= 100
      case "quiz-first": return quizResults.length >= 1
      case "quiz-5": return quizResults.length >= 5
      case "quiz-perfect": return quizResults.some((r) => r.score === r.totalQuestions)
      case "challenge-first": return completed.length >= 1
      case "challenge-50": return completed.length >= 50
      case "points-100": return totalPoints >= 100
      case "points-500": return totalPoints >= 500
      case "points-1000": return totalPoints >= 1000
      default: return false
    }
  }
  
  // Unlock eligible achievements
  const toUnlock = allAchievements.filter(a => shouldUnlock(a.id))
  if (toUnlock.length > 0) {
    const newUnlocked = toUnlock.map(a => ({ ...a, unlockedAt: new Date().toISOString() }))
    setUnlockedAchievements([...unlockedAchievements, ...newUnlocked])
  }
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "streak": return <Zap className="h-4 w-4" />
      case "learning": return <Star className="h-4 w-4" />
      case "practice": return <Target className="h-4 w-4" />
      case "milestone": return <TrendingUp className="h-4 w-4" />
      default: return <Award className="h-4 w-4" />
    }
  }
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case "streak": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
      case "learning": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "practice": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "milestone": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }
  
  const unlockedIds = new Set(unlockedAchievements.map(a => a.id))
  const locked = allAchievements.filter(a => !unlockedIds.has(a.id))
  
  const totalAchievements = allAchievements.length
  const unlockedCount = unlockedAchievements.length
  const progressPercent = (unlockedCount / totalAchievements * 100).toFixed(0)

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <Trophy className="h-5 w-5 text-amber-500" />
            Achievements
          </CardTitle>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-sm px-3 py-1">
            {unlockedCount} / {totalAchievements}
          </Badge>
        </div>
        <div className="mt-2">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
              data-progress={progressPercent}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{progressPercent}% Complete</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-amber-900 dark:text-amber-100">
              <Sparkles className="h-4 w-4" />
              Unlocked
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {unlockedAchievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-amber-950/20 p-3 rounded-lg border-2 border-amber-300 dark:border-amber-700 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-sm truncate">{achievement.title}</h5>
                        <Badge variant="secondary" className={`text-xs ${getCategoryColor(achievement.category)}`}>
                          {getCategoryIcon(achievement.category)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Locked Achievements */}
        {locked.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Locked</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {locked.slice(0, 6).map((achievement) => (
                <div 
                  key={achievement.id}
                  className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg border border-gray-300 dark:border-gray-700 opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0 grayscale">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-sm truncate">???</h5>
                        <Badge variant="secondary" className={`text-xs ${getCategoryColor(achievement.category)}`}>
                          {getCategoryIcon(achievement.category)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {locked.length > 6 && (
              <p className="text-xs text-center text-muted-foreground">
                +{locked.length - 6} more achievements to unlock
              </p>
            )}
          </div>
        )}
        
        {unlockedAchievements.length === 0 && (
          <div className="text-center py-8">
            <Medal className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-muted-foreground">
              Complete challenges and maintain streaks to unlock achievements!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
