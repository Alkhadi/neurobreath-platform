/**
 * SEND Reports List Page
 * 
 * View and create SEND training recommendation reports
 */

import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus, AlertTriangle } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'SEND Reports | NeuroBreath',
  description:
    'Create and manage SEND training recommendation reports for learners, with summaries and evidence links. Not a diagnostic tool.',
  path: '/send-report',
  noindex: true,
})

export default function SENDReportsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                SEND Reports
              </h1>
              <p className="text-muted-foreground">
                Training recommendation reports for learners
              </p>
            </div>
            <Button asChild>
              <Link href="/send-report/new">
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Link>
            </Button>
          </div>
          
          {/* Disclaimer Banner */}
          <Card className="border-yellow-200 dark:border-yellow-900 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-yellow-900 dark:text-yellow-100">
                    Important: Not a Diagnostic Tool
                  </p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    These reports provide <strong>training recommendations only</strong> and are NOT diagnostic assessments. 
                    For formal educational or clinical assessment, please consult qualified professionals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Reports List */}
        <Suspense fallback={<ReportsListSkeleton />}>
          <ReportsList />
        </Suspense>
      </div>
    </div>
  )
}

function ReportsList() {
  // TODO: Fetch reports from API
  // For now, showing empty state
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Reports</CardTitle>
        <CardDescription>
          View and manage training recommendation reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 space-y-4">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground opacity-20" />
          <div className="space-y-2">
            <h3 className="font-semibold">No reports yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Create your first report to get training recommendations based on assessment data and practice sessions.
            </p>
          </div>
          <Button asChild>
            <Link href="/send-report/new">
              <Plus className="w-4 h-4 mr-2" />
              Create First Report
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ReportsListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

