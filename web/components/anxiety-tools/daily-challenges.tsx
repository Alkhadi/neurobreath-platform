"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, RefreshCw, Trophy, Sparkles } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Challenge {
  id: string
  title: string
  description: string
  points: number
  category: "learn" | "practice" | "connect" | "reflect"
}

interface CompletedChallenge {
  challengeId: string
  completedDate: string
}

const dailyChallenges: Challenge[] = [
  // Learn challenges
  {
    id: "learn-1",
    title: "Understand Physical Symptoms",
    description: "Read about how anxiety manifests physically (stomachaches, headaches, fatigue)",
    points: 10,
    category: "learn"
  },
  {
    id: "learn-2",
    title: "Recognize Behavioral Signs",
    description: "Learn 5 behavioral signs of anxiety in children/adults you support",
    points: 10,
    category: "learn"
  },
  {
    id: "learn-3",
    title: "Study Validation Techniques",
    description: "Review how to validate feelings without dismissing concerns",
    points: 15,
    category: "learn"
  },
  {
    id: "learn-4",
    title: "Exposure Therapy Basics",
    description: "Learn about gradual exposure and why avoidance maintains anxiety",
    points: 15,
    category: "learn"
  },
  
  // Practice challenges
  {
    id: "practice-1",
    title: "Practice Active Listening",
    description: "Spend 10 minutes listening to worries without immediately problem-solving",
    points: 20,
    category: "practice"
  },
  {
    id: "practice-2",
    title: "Model Calm Coping",
    description: "Verbalize your coping strategy when stressed: 'I'm worried, so I'll take deep breaths'",
    points: 15,
    category: "practice"
  },
  {
    id: "practice-3",
    title: "Limit Reassurance",
    description: "Instead of reassuring, ask: 'What do you think?' or 'How have you handled this before?'",
    points: 20,
    category: "practice"
  },
  {
    id: "practice-4",
    title: "Encourage One Small Exposure",
    description: "Support one small step toward facing a fear today",
    points: 25,
    category: "practice"
  },
  
  // Connect challenges
  {
    id: "connect-1",
    title: "Communicate with School/Work",
    description: "Share anxiety triggers or accommodations with relevant people",
    points: 20,
    category: "connect"
  },
  {
    id: "connect-2",
    title: "Reach Out to Support Network",
    description: "Connect with another carer/parent or support group",
    points: 15,
    category: "connect"
  },
  {
    id: "connect-3",
    title: "Quality Time Activity",
    description: "Spend 20 minutes doing a relaxing activity together",
    points: 15,
    category: "connect"
  },
  
  // Reflect challenges
  {
    id: "reflect-1",
    title: "Journal About Progress",
    description: "Write 3 positive changes you've noticed, no matter how small",
    points: 15,
    category: "reflect"
  },
  {
    id: "reflect-2",
    title: "Self-Care Check-In",
    description: "Assess your own stress level and do one thing for yourself today",
    points: 10,
    category: "reflect"
  },
  {
    id: "reflect-3",
    title: "Celebrate Small Wins",
    description: "Acknowledge and praise brave behavior (not just outcomes)",
    points: 10,
    category: "reflect"
  },
]

export function DailyChallenges() {
  const [completed, setCompleted] = useLocalStorage<CompletedChallenge[]>("anxiety-support-challenges", [])
  const [totalPoints, setTotalPoints] = useLocalStorage<number>("anxiety-support-points", 0)
  
  const today = new Date().toDateString()
  const todayCompleted = completed.filter(c => new Date(c.completedDate).toDateString() === today)
  const todayPoints = todayCompleted.reduce((sum, c) => {
    const challenge = dailyChallenges.find(ch => ch.id === c.challengeId)
    return sum + (challenge?.points || 0)
  }, 0)
  
  // Get 3 random challenges, ensuring variety
  const [todaysChallenges] = useState(() => {
    const byCategory = {
      learn: dailyChallenges.filter(c => c.category === "learn"),
      practice: dailyChallenges.filter(c => c.category === "practice"),
      connect: dailyChallenges.filter(c => c.category === "connect"),
      reflect: dailyChallenges.filter(c => c.category === "reflect"),
    }
    
    // Pick one from each category randomly, then one more
    const selected: Challenge[] = []
    const categories = Object.keys(byCategory) as Array<keyof typeof byCategory>
    
    // Shuffle categories
    const shuffled = categories.sort(() => Math.random() - 0.5)
    
    // Pick one from first 3 categories
    for (let i = 0; i < 3; i++) {
      const category = shuffled[i]
      const options = byCategory[category]
      if (options.length > 0) {
        const random = options[Math.floor(Math.random() * options.length)]
        selected.push(random)
      }
    }
    
    return selected
  })
  
  const handleComplete = (challenge: Challenge) => {
    const now = new Date().toISOString()
    setCompleted([...completed, { challengeId: challenge.id, completedDate: now }])
    setTotalPoints(totalPoints + challenge.points)
  }
  
  const isCompleted = (challengeId: string) => {
    return todayCompleted.some(c => c.challengeId === challengeId)
  }
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case "learn": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "practice": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "connect": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
      case "reflect": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }
  
  const maxDailyPoints = todaysChallenges.reduce((sum, c) => sum + c.points, 0)
  const progressPercent = (todayPoints / maxDailyPoints) * 100

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Today's Challenges
          </CardTitle>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{totalPoints}</span>
            <span className="text-sm text-muted-foreground">points</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="font-medium">{todayPoints} / {maxDailyPoints} points</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        <div className="space-y-3">
          {todaysChallenges.map((challenge) => {
            const completed = isCompleted(challenge.id)
            return (
              <div 
                key={challenge.id} 
                className={`p-4 rounded-lg border-2 transition-all ${
                  completed 
                    ? "bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700" 
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm">{challenge.title}</h4>
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(challenge.category)}`}>
                        {challenge.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                        +{challenge.points} points
                      </span>
                      
                      {!completed && (
                        <Button 
                          size="sm" 
                          onClick={() => handleComplete(challenge)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {todayPoints === maxDailyPoints && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-lg border-2 border-green-300 dark:border-green-700 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              <span className="font-bold text-green-900 dark:text-green-100 text-lg">All Challenges Complete!</span>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200">
              You've earned {maxDailyPoints} points today. Amazing dedication!
            </p>
          </div>
        )}
        
        <Button variant="outline" className="w-full" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          New Challenges Tomorrow
        </Button>
      </CardContent>
    </Card>
  )
}
