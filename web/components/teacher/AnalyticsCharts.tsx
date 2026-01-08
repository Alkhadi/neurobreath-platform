/**
 * AnalyticsCharts Component
 * 
 * Client-side charts for teacher dashboard
 * SSR-safe - no window access during render
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react'

// Note: Recharts would be imported here if installed
// For now, we'll create placeholder components

interface AnalyticsData {
  totalSessions: number
  totalMinutes: number
  minutesByActivity: Record<string, number>
  minutesByTechnique: Record<string, number>
  dailyActivity: { date: string; sessions: number }[]
  completionRate: number
  avgSessionMinutes: number
}

export function AnalyticsCharts() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (!mounted) return
    
    // TODO: Fetch analytics data
    // For now, using mock data
    const mockData: AnalyticsData = {
      totalSessions: 0,
      totalMinutes: 0,
      minutesByActivity: {},
      minutesByTechnique: {},
      dailyActivity: [],
      completionRate: 0,
      avgSessionMinutes: 0,
    }
    
    setData(mockData)
    setLoading(false)
  }, [mounted])
  
  if (!mounted || loading) {
    return <ChartsSkeleton />
  }
  
  if (!data) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No data available. Add learners to get started.
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-primary" />
            Weekly Activity
          </CardTitle>
          <CardDescription>
            Sessions completed per day over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            {/* Placeholder for Recharts LineChart */}
            <div className="text-center space-y-2">
              <LineChartIcon className="w-12 h-12 mx-auto opacity-20" />
              <p className="text-sm">Chart will appear here when data is available</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Activity Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Minutes by Activity
            </CardTitle>
            <CardDescription>
              Time spent on each activity type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              {/* Placeholder for Recharts BarChart */}
              <div className="text-center space-y-2">
                <BarChart3 className="w-12 h-12 mx-auto opacity-20" />
                <p className="text-sm">Chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Technique Distribution
            </CardTitle>
            <CardDescription>
              Most popular breathing techniques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              {/* Placeholder for Recharts PieChart */}
              <div className="text-center space-y-2">
                <PieChartIcon className="w-12 h-12 mx-auto opacity-20" />
                <p className="text-sm">Chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">{data.completionRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Sessions ≥5 minutes</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Session Length</p>
              <p className="text-2xl font-bold">{data.avgSessionMinutes.toFixed(1)} min</p>
              <p className="text-xs text-muted-foreground">Per session</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Practice Time</p>
              <p className="text-2xl font-bold">{data.totalMinutes} min</p>
              <p className="text-xs text-muted-foreground">This period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ChartsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-80 bg-muted animate-pulse rounded-lg" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    </div>
  )
}

