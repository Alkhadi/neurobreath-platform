/**
 * Teacher Dashboard Page
 * 
 * SSR-safe analytics dashboard for teachers
 * Shows aggregated learner progress and activity
 */

import { Suspense } from 'react'
import { AnalyticsCharts } from '@/components/teacher/AnalyticsCharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, Clock, Award } from 'lucide-react'

export const metadata = {
  title: 'Teacher Dashboard | NeuroBreath',
  description: 'View learner analytics and progress',
}

export default function TeacherDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor learner progress and engagement across your classroom
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Add learners to get started
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Learners with activity
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Practice time this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Achievements unlocked
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <Suspense fallback={<DashboardSkeleton />}>
          <AnalyticsCharts />
        </Suspense>
        
        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Set up your classroom to start tracking learner progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">1. Add Learners</h3>
              <p className="text-sm text-muted-foreground">
                Create learner profiles or generate access codes for your students
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">2. Share Access Codes</h3>
              <p className="text-sm text-muted-foreground">
                Students can join your classroom using their unique code
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">3. Monitor Progress</h3>
              <p className="text-sm text-muted-foreground">
                View real-time analytics and generate progress reports
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-64 bg-muted animate-pulse rounded-lg" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
      </div>
    </div>
  )
}

