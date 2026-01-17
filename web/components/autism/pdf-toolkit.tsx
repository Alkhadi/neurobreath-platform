'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

export function PDFToolkit() {
  const toolkits = [
    {
      id: 'one-page-profile',
      title: 'One-Page Profile Template',
      description: 'Key information about the individual in one place'
    },
    {
      id: 'visual-schedule',
      title: 'Visual Schedule Templates',
      description: 'Now/Next boards and daily timetables'
    },
    {
      id: 'calm-plan',
      title: 'Calm Plan Card',
      description: 'What helps / what to avoid / early signs / recovery'
    },
    {
      id: 'home-school',
      title: 'Home-School Communication Sheet',
      description: 'Daily handover template'
    },
    {
      id: 'workplace-adjustments',
      title: 'Workplace Adjustments Checklist',
      description: 'For employers and employees'
    }
  ]

  const handleDownload = async (_toolkitId: string) => {
    toast.message('PDF export coming soon', {
      description: 'For now, use the existing templates in Resources. We can wire up full exports next.'
    })
    // Future: Call API route to generate PDF
    // const res = await fetch(`/api/autism/pdf?toolkit=${toolkitId}`)
    // const blob = await res.blob()
    // const url = window.URL.createObjectURL(blob)
    // const a = document.createElement('a')
    // a.href = url
    // a.download = `${toolkitId}.pdf`
    // a.click()
  }

  return (
    <section id="downloads" className="scroll-mt-24 py-16 md:py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-medium text-blue-700">Downloads</p>
          <h2 className="text-3xl font-bold text-gray-900">Downloadable toolkits</h2>
          <p className="text-gray-600">Print-ready resources you can customize and share.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolkits.map(toolkit => (
            <Card key={toolkit.id} className="p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{toolkit.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{toolkit.description}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(toolkit.id)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

