/**
 * Parent View Page
 * 
 * Read-only progress view for parents/guardians
 * Mobile-optimized layout
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Lock, TrendingUp, Award, Calendar, Clock } from 'lucide-react'

export const metadata = {
  title: 'Parent View | NeuroBreath',
  description: 'View learner progress',
}

interface ParentViewPageProps {
  params: Promise<{
    parentCode: string
  }>
}

export default async function ParentViewPage({ params }: ParentViewPageProps) {
  const { parentCode } = await params
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header with Read-Only Badge */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              Learner Progress
            </h1>
            <Badge variant="secondary" className="gap-1.5">
              <Lock className="w-3 h-3" />
              View Only
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            You have read-only access to view progress. Code: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{parentCode}</code>
          </p>
        </div>
        
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Practice sessions completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Time practicing</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Days in a row</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto opacity-20 mb-3" />
              <p className="text-sm">No activity yet</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Badges Earned
            </CardTitle>
            <CardDescription>Achievements unlocked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto opacity-20 mb-3" />
              <p className="text-sm">No badges yet</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy Notice */}
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                  Privacy & Access
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  This is a <strong>read-only view</strong>. You can see progress but cannot make changes. 
                  The learner or their teacher can revoke access at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

