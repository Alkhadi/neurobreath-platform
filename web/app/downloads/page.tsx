'use client'

import { Download, FileText, Brain, Sparkles, BookOpen, Wind, Package, FolderArchive, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type DownloadItem = {
  name: string
  file: string
  path: string
  isZip?: boolean
  isTxt?: boolean
  isVcf?: boolean
}

type Downloads = {
  adhd: Record<string, DownloadItem[]>
  autism: DownloadItem[]
  dyslexia: DownloadItem[]
  breathing: DownloadItem[]
  general: DownloadItem[]
  packs: DownloadItem[]
}

type FilteredDownloads = Omit<Partial<Downloads>, 'adhd'> & {
  adhd: Partial<Record<string, DownloadItem[]>>
}

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleDownload = (path: string, filename: string) => {
    const link = document.createElement('a')
    link.href = path
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // All downloads organized by category
  const downloads: Downloads = {
    adhd: {
      assessment: [
        { name: 'Parent Checklist', file: 'adhd_assess_parent_checklist.pdf', path: '/legacy-assets/assets/downloads/adhd_assess_parent_checklist.pdf' },
        { name: 'School Summary', file: 'adhd_assess_school_summary.pdf', path: '/legacy-assets/assets/downloads/adhd_assess_school_summary.pdf' },
        { name: 'Teen Prep Guide', file: 'adhd_assess_teen_prep.pdf', path: '/legacy-assets/assets/downloads/adhd_assess_teen_prep.pdf' },
        { name: 'Appointment Notes', file: 'adhd_appointment_notes.pdf', path: '/legacy-assets/assets/downloads/adhd_appointment_notes.pdf' },
        { name: 'Clinician Brief', file: 'adhd_diag_clinician_brief.pdf', path: '/legacy-assets/assets/downloads/adhd_diag_clinician_brief.pdf' },
        { name: 'Family Questions', file: 'adhd_diag_family_questions.pdf', path: '/legacy-assets/assets/downloads/adhd_diag_family_questions.pdf' },
        { name: 'Diagnosis Pros & Cons', file: 'adhd_diag_pros_cons.pdf', path: '/legacy-assets/assets/downloads/adhd_diag_pros_cons.pdf' },
      ],
      home: [
        { name: 'Morning Routine', file: 'adhd_home_morning_routine.pdf', path: '/legacy-assets/assets/downloads/adhd_home_morning_routine.pdf' },
        { name: 'Bedtime Routine', file: 'adhd_home_bedtime_routine.pdf', path: '/legacy-assets/assets/downloads/adhd_home_bedtime_routine.pdf' },
        { name: 'Meltdown Plan', file: 'adhd_home_meltdown_plan.pdf', path: '/legacy-assets/assets/downloads/adhd_home_meltdown_plan.pdf' },
        { name: 'Star Chart', file: 'adhd_home_star_chart.pdf', path: '/legacy-assets/assets/downloads/adhd_home_star_chart.pdf' },
        { name: 'Token Jar', file: 'adhd_home_token_jar.pdf', path: '/legacy-assets/assets/downloads/adhd_home_token_jar.pdf' },
        { name: 'Crisis Plan', file: 'adhd_crisis_plan.pdf', path: '/legacy-assets/assets/downloads/adhd_crisis_plan.pdf' },
      ],
      school: [
        { name: 'Adjustments Checklist', file: 'adhd_school_adjustments_checklist.pdf', path: '/legacy-assets/assets/downloads/adhd_school_adjustments_checklist.pdf' },
        { name: 'Meeting Planner', file: 'adhd_school_meeting_planner.pdf', path: '/legacy-assets/assets/downloads/adhd_school_meeting_planner.pdf' },
        { name: 'Student Voice', file: 'adhd_school_student_voice.pdf', path: '/legacy-assets/assets/downloads/adhd_school_student_voice.pdf' },
      ],
      teens: [
        { name: 'Feelings Cards', file: 'adhd_teens_feelings_cards.pdf', path: '/legacy-assets/assets/downloads/adhd_teens_feelings_cards.pdf' },
        { name: 'Study Planner', file: 'adhd_teens_study_planner.pdf', path: '/legacy-assets/assets/downloads/adhd_teens_study_planner.pdf' },
        { name: 'Support Plan', file: 'adhd_teens_support_plan.pdf', path: '/legacy-assets/assets/downloads/adhd_teens_support_plan.pdf' },
        { name: 'Workplace Adjustments', file: 'adhd_young_adult_adjustments.pdf', path: '/legacy-assets/assets/downloads/adhd_young_adult_adjustments.pdf' },
        { name: 'Admin Menu', file: 'adhd_young_adult_admin_menu.pdf', path: '/legacy-assets/assets/downloads/adhd_young_adult_admin_menu.pdf' },
        { name: 'Disclosure Script', file: 'adhd_young_adult_disclosure_script.pdf', path: '/legacy-assets/assets/downloads/adhd_young_adult_disclosure_script.pdf' },
      ],
      selfcare: [
        { name: 'Breathing Cards', file: 'adhd_selfcare_breathing_cards.pdf', path: '/legacy-assets/assets/downloads/adhd_selfcare_breathing_cards.pdf' },
        { name: 'Self-Care Planner', file: 'adhd_selfcare_planner.pdf', path: '/legacy-assets/assets/downloads/adhd_selfcare_planner.pdf' },
        { name: 'Support Circle', file: 'adhd_selfcare_support_circle.pdf', path: '/legacy-assets/assets/downloads/adhd_selfcare_support_circle.pdf' },
        { name: 'Focus Quick Guide', file: 'adhd-focus-quick-guide.pdf', path: '/legacy-assets/assets/downloads/adhd-focus-quick-guide.pdf' },
        { name: 'Focus Workflows', file: 'adhd-focus-workflows-resources.pdf', path: '/legacy-assets/assets/downloads/adhd-focus-workflows-resources.pdf' },
      ],
      toolkits: [
        { name: 'Tools & Resources', file: 'adhd-tools-resources.pdf', path: '/legacy-assets/assets/downloads/adhd-tools-resources.pdf' },
        { name: 'Support Contacts', file: 'adhd_support_contacts.pdf', path: '/legacy-assets/assets/downloads/adhd_support_contacts.pdf' },
      ],
    },
    autism: [
      { name: 'Parent Quick Guide', file: 'autism-parent-quick-guide-uk.pdf', path: '/legacy-assets/assets/downloads/autism-parent-quick-guide-uk.pdf' },
      { name: 'Later Life Carer Guide', file: 'autism-later-life-carer-guide-uk.pdf', path: '/legacy-assets/assets/downloads/autism-later-life-carer-guide-uk.pdf' },
      { name: 'Adult Support Guide', file: 'autism-adult-support-guide-uk.pdf', path: '/legacy-assets/assets/downloads/autism-adult-support-guide-uk.pdf' },
      { name: 'Clinic Guide & Checklists', file: 'autism-clinic-guide-checklists-uk.pdf', path: '/legacy-assets/assets/downloads/autism-clinic-guide-checklists-uk.pdf' },
    ],
    dyslexia: [
      { name: 'Parent Support Guide', file: 'dyslexia-parent-support-guide.pdf', path: '/legacy-assets/assets/downloads/dyslexia-parent-support-guide.pdf' },
      { name: 'Adult Resources', file: 'dyslexia-adult-resources-uk.pdf', path: '/legacy-assets/assets/downloads/dyslexia-adult-resources-uk.pdf' },
      { name: 'Practice Pack Templates', file: 'dyslexia-practice-pack-templates.pdf', path: '/legacy-assets/assets/downloads/dyslexia-practice-pack-templates.pdf' },
      { name: 'Reading Checklist', file: 'dyslexia-reading-checklist.pdf', path: '/legacy-assets/assets/downloads/dyslexia-reading-checklist.pdf' },
      { name: 'Routine Planner', file: 'dyslexia-routine-planner.pdf', path: '/legacy-assets/assets/downloads/dyslexia-routine-planner.pdf' },
    ],
    breathing: [
      { name: 'Breathing Cheat Sheet', file: 'breathing-cheat-sheet.pdf', path: '/legacy-assets/assets/downloads/breathing-cheat-sheet.pdf' },
      { name: 'Calm Body, Train Mind', file: 'anxiety-calm-body-train-mind-resources.pdf', path: '/legacy-assets/assets/downloads/anxiety-calm-body-train-mind-resources.pdf' },
    ],
    general: [
      { name: 'One-Page Profile Template', file: 'one-page-profile-template.pdf', path: '/legacy-assets/assets/downloads/one-page-profile-template.pdf' },
      { name: 'Teacher Quick Pack', file: 'teacher-quick-pack.pdf', path: '/legacy-assets/assets/downloads/teacher-quick-pack.pdf' },
      { name: 'NeuroBreath Letterhead', file: 'neurobreath-letterhead.pdf', path: '/legacy-assets/assets/downloads/neurobreath-letterhead.pdf' },
    ],
    packs: [
      { name: 'Parent Quick Pack (ZIP)', file: 'parent-quick-pack.zip', path: '/legacy-assets/assets/downloads/parent-quick-pack.zip', isZip: true },
      { name: 'Parent Quick Pack README', file: 'parent-quick-pack-README.txt', path: '/legacy-assets/assets/downloads/parent-quick-pack-README.txt', isTxt: true },
      { name: 'MSHARE PDFs (ZIP)', file: 'mshare_pdfs_2025-10-01.zip', path: '/legacy-assets/assets/downloads/mshare_pdfs_2025-10-01.zip', isZip: true },
      { name: 'MSHARE Contact (VCF)', file: 'mshare-contact.vcf', path: '/legacy-assets/assets/downloads/mshare-contact.vcf', isVcf: true },
    ],
  }

  // Filter downloads based on search query
  const filterDownloads = (): FilteredDownloads => {
    if (!searchQuery) return downloads

    const query = searchQuery.toLowerCase()
    const filtered: FilteredDownloads = { adhd: {} }

    // Filter ADHD
    Object.keys(downloads.adhd).forEach(category => {
      const items = downloads.adhd[category as keyof typeof downloads.adhd].filter(item =>
        item.name.toLowerCase().includes(query)
      )
      if (items.length > 0) {
        filtered.adhd[category] = items
      }
    })

    // Filter other categories
    ;(['autism', 'dyslexia', 'breathing', 'general', 'packs'] as const).forEach(cat => {
      const items = downloads[cat].filter(item =>
        item.name.toLowerCase().includes(query)
      )
      if (items.length > 0) {
        filtered[cat] = items
      }
    })

    return filtered
  }

  const filteredDownloads = filterDownloads()

  return (
    <main className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-6">
              <Download className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Resources & Downloads
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Practical guides, checklists, planners, and tools to support neurodivergent individuals, 
              families, and educators. All resources are free to download, print, and share.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="p-6 max-w-2xl mx-auto bg-white/80 backdrop-blur">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search resources (e.g., 'morning routine', 'autism', 'breathing')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-6 text-lg"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Showing results for "{searchQuery}"
              </p>
            )}
          </Card>
        </div>
      </section>

      {/* Quick Packs Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Quick Packs & Bundles</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Download complete collections in one convenient package
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDownloads.packs?.map((item) => (
              <Card key={item.name} className="p-6 hover:shadow-lg transition-shadow">
                <div className={`p-3 rounded-lg inline-block mb-4 ${
                  item.isZip ? 'bg-purple-100' : item.isVcf ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {item.isZip ? (
                    <FolderArchive className={`h-6 w-6 ${item.isZip ? 'text-purple-600' : 'text-blue-600'}`} />
                  ) : (
                    <FileText className={`h-6 w-6 ${item.isTxt ? 'text-green-600' : 'text-blue-600'}`} />
                  )}
                </div>
                <h3 className="font-bold mb-2 text-sm">{item.name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDownload(item.path, item.file)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ADHD Resources */}
      {(filteredDownloads.adhd && Object.keys(filteredDownloads.adhd).length > 0) && (
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">ADHD Resources</h2>
              <p className="text-xl text-muted-foreground">
                Assessment tools, home strategies, school support, and self-care resources
              </p>
            </div>

            <div className="space-y-8">
              {filteredDownloads.adhd.assessment && (
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    Assessment & Diagnosis
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredDownloads.adhd.assessment.map((item) => (
                      <Button
                        key={item.name}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto py-3"
                        onClick={() => handleDownload(item.path, item.file)}
                      >
                        <Download className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-left text-xs">{item.name}</span>
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              {filteredDownloads.adhd.home && (
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-purple-600" />
                    Home & Family
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredDownloads.adhd.home.map((item) => (
                      <Button
                        key={item.name}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto py-3"
                        onClick={() => handleDownload(item.path, item.file)}
                      >
                        <Download className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-left text-xs">{item.name}</span>
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              {filteredDownloads.adhd.school && (
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-green-600" />
                    School Support
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredDownloads.adhd.school.map((item) => (
                      <Button
                        key={item.name}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto py-3"
                        onClick={() => handleDownload(item.path, item.file)}
                      >
                        <Download className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-left text-xs">{item.name}</span>
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              {filteredDownloads.adhd.teens && (
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-amber-600" />
                    Teens & Young Adults
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredDownloads.adhd.teens.map((item) => (
                      <Button
                        key={item.name}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto py-3"
                        onClick={() => handleDownload(item.path, item.file)}
                      >
                        <Download className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-left text-xs">{item.name}</span>
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              {filteredDownloads.adhd.selfcare && (
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-pink-600" />
                    Self-Care & Focus
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredDownloads.adhd.selfcare.map((item) => (
                      <Button
                        key={item.name}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto py-3"
                        onClick={() => handleDownload(item.path, item.file)}
                      >
                        <Download className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-left text-xs">{item.name}</span>
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              {filteredDownloads.adhd.toolkits && (
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Package className="h-6 w-6 text-indigo-600" />
                    ADHD Toolkits
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredDownloads.adhd.toolkits.map((item) => (
                      <Button
                        key={item.name}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto py-3"
                        onClick={() => handleDownload(item.path, item.file)}
                      >
                        <Download className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-left text-xs">{item.name}</span>
                      </Button>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Other Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Autism */}
            {filteredDownloads.autism && filteredDownloads.autism.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="text-2xl font-bold">Autism Resources</h3>
                    <p className="text-sm text-muted-foreground">UK-focused guides</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {filteredDownloads.autism.map((item) => (
                    <Button
                      key={item.name}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleDownload(item.path, item.file)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* Dyslexia */}
            {filteredDownloads.dyslexia && filteredDownloads.dyslexia.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-8 w-8 text-amber-600" />
                  <div>
                    <h3 className="text-2xl font-bold">Dyslexia Resources</h3>
                    <p className="text-sm text-muted-foreground">Support guides & practice</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {filteredDownloads.dyslexia.map((item) => (
                    <Button
                      key={item.name}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleDownload(item.path, item.file)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* Breathing */}
            {filteredDownloads.breathing && filteredDownloads.breathing.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Wind className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-2xl font-bold">Breathing & Anxiety</h3>
                    <p className="text-sm text-muted-foreground">Techniques & support</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {filteredDownloads.breathing.map((item) => (
                    <Button
                      key={item.name}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleDownload(item.path, item.file)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* General */}
            {filteredDownloads.general && filteredDownloads.general.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-8 w-8 text-indigo-600" />
                  <div>
                    <h3 className="text-2xl font-bold">General Templates</h3>
                    <p className="text-sm text-muted-foreground">Universal tools</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {filteredDownloads.general.map((item) => (
                    <Button
                      key={item.name}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleDownload(item.path, item.file)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* No Results */}
      {searchQuery && Object.keys(filteredDownloads).length === 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-2xl mx-auto text-center">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try searching with different keywords like 'ADHD', 'autism', 'routine', or 'breathing'
            </p>
            <Button onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </div>
        </section>
      )}

      {/* Browse More */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Explore More Resources</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Interactive tools, guides, and support across the platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/schools">
              <Button size="lg">
                <BookOpen className="mr-2 h-5 w-5" />
                School Resources
              </Button>
            </Link>
            <Link href="/teacher-quick-pack">
              <Button size="lg" variant="outline">
                Teacher Tools
              </Button>
            </Link>
            <Link href="/breathing">
              <Button size="lg" variant="outline">
                <Wind className="mr-2 h-5 w-5" />
                Breathing Exercises
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            All resources are free to download, print, and share. No registration required.
          </p>
          <p className="text-sm text-muted-foreground">
            Having trouble downloading? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for support.
          </p>
        </div>
      </footer>
    </main>
  )
}
