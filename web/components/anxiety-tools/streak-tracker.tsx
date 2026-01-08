"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy, Star, Calendar } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastCheckIn: string
  totalCheckIns: number
}

export function StreakTracker() {
  const [streak, setStreak] = useLocalStorage<StreakData>("anxiety-support-streak", {
    currentStreak: 0,
    longestStreak: 0,
    lastCheckIn: "",
    totalCheckIns: 0,
  })
  const [canCheckIn, setCanCheckIn] = useState(false)
  const [motivation, setMotivation] = useState("")

  useEffect(() => {
    const today = new Date().toDateString()
    const lastCheckIn = streak.lastCheckIn ? new Date(streak.lastCheckIn).toDateString() : ""
    
    // Check if user can check in today
    setCanCheckIn(today !== lastCheckIn)
    
    // Check if streak is broken (missed a day)
    if (lastCheckIn && lastCheckIn !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastCheckIn !== yesterdayStr) {
        // Streak broken, reset to 0
        setStreak(prev => ({ ...prev, currentStreak: 0 }))
      }
    }
    
    // Set motivational message
    if (streak.currentStreak === 0) {
      setMotivation("Start your journey today!")
    } else if (streak.currentStreak < 7) {
      setMotivation("Great start! Keep going!")
    } else if (streak.currentStreak < 30) {
      setMotivation("Amazing consistency! 🌟")
    } else if (streak.currentStreak < 100) {
      setMotivation("You're a champion! 🏆")
    } else {
      setMotivation("Legendary supporter! 👑")
    }
  }, [streak, setStreak])

  const handleCheckIn = () => {
    const today = new Date().toISOString()
    const newStreak = streak.currentStreak + 1
    
    setStreak({
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastCheckIn: today,
      totalCheckIns: streak.totalCheckIns + 1,
    })
    
    setCanCheckIn(false)
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
          <Flame className="h-5 w-5 text-orange-500" />
          Daily Practice Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
              <Flame className="h-8 w-8" />
              {streak.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Current Streak</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
              <Trophy className="h-8 w-8" />
              {streak.longestStreak}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Best Streak</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-1">
              <Calendar className="h-8 w-8" />
              {streak.totalCheckIns}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total Days</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-center">
            <Badge variant={canCheckIn ? "default" : "secondary"} className="text-sm px-3 py-1">
              {canCheckIn ? "✨ Ready to Check In!" : "✓ Checked in today"}
            </Badge>
          </div>
          
          <Button 
            onClick={handleCheckIn} 
            disabled={!canCheckIn}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            size="lg"
          >
            {canCheckIn ? "Check In Today" : "Come Back Tomorrow"}
          </Button>
          
          <p className="text-center text-sm font-medium text-orange-700 dark:text-orange-300 mt-2">
            {motivation}
          </p>
        </div>

        {streak.currentStreak >= 7 && (
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-semibold text-yellow-900 dark:text-yellow-100">Milestone Unlocked!</span>
            </div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {streak.currentStreak >= 100 ? "100+ days! You're making a profound difference!" :
               streak.currentStreak >= 30 ? "30+ days! Your consistency is transforming lives!" :
               streak.currentStreak >= 14 ? "2 weeks! You're building powerful habits!" :
               "1 week! You're establishing a strong foundation!"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
