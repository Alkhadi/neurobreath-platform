'use client'

import { Download, FileText, Users, Brain, Heart, Wind, BookOpen, Sparkles, Package, FolderArchive, Phone, Mail, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export default function ResourcesPage() {
  const handleDownload = (path: string, filename: string) => {
    const link = document.createElement('a')
    link.href = path
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
              Downloadable Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive toolkits, checklists, guides, and templates for ADHD, Autism, Dyslexia, and mental wellbeing. 
              Free to download, print, and share.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#quick-packs">
                <Button size="lg" className="px-8">
                  <Package className="mr-2 h-5 w-5" />
                  Quick Packs
                </Button>
              </a>
              <a href="#adhd-resources">
                <Button size="lg" variant="outline" className="px-8">
                  <FileText className="mr-2 h-5 w-5" />
                  Browse All Resources
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <Card className="p-8 bg-white/80 backdrop-blur">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">60+</div>
                <div className="text-sm text-muted-foreground">Downloadable PDFs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Free Resources</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Printable</div>
                <div className="text-sm text-muted-foreground">Ready to use</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Evidence</div>
                <div className="text-sm text-muted-foreground">Research-based</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Packs Section */}
      <section id="quick-packs" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Quick Packs & Bundles</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Curated collections of essential resources. Download everything you need in one convenient package.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Parent Quick Pack</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete collection of parent-focused resources for ADHD, autism, dyslexia, and anxiety support.
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-muted-foreground">Includes:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>✓ Assessment checklists</li>
                  <li>✓ Home routine planners</li>
                  <li>✓ School support guides</li>
                  <li>✓ Crisis response plans</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleDownload('/legacy-assets/assets/downloads/parent-quick-pack.zip', 'parent-quick-pack.zip')}
                  className="flex-1"
                >
                  <FolderArchive className="mr-2 h-4 w-4" />
                  Download ZIP
                </Button>
                <Button 
                  onClick={() => handleDownload('/legacy-assets/assets/downloads/parent-quick-pack-README.txt', 'README.txt')}
                  variant="outline"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Teacher Quick Pack</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Essential classroom resources for supporting neurodivergent students and promoting mental wellbeing.
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-muted-foreground">Includes:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>✓ Classroom adjustments</li>
                  <li>✓ Student support plans</li>
                  <li>✓ Behavior strategies</li>
                  <li>✓ Meeting planners</li>
                </ul>
              </div>
              <Button 
                onClick={() => handleDownload('/legacy-assets/assets/downloads/teacher-quick-pack.pdf', 'teacher-quick-pack.pdf')}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-4">
                <FolderArchive className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">MSHARE PDFs Collection</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive archive of mental health and special education resources for professionals.
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-muted-foreground">Archive Date:</p>
                <p className="text-xs font-mono">2025-10-01</p>
              </div>
              <Button 
                onClick={() => handleDownload('/legacy-assets/assets/downloads/mshare_pdfs_2025-10-01.zip', 'mshare_pdfs_2025-10-01.zip')}
                className="w-full"
              >
                <FolderArchive className="mr-2 h-4 w-4" />
                Download ZIP
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Resources Section */}
      <section id="adhd-resources" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Individual Resources</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse our complete library of downloadable resources organized by condition and topic.
            </p>
          </div>

          <Tabs defaultValue="adhd" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 max-w-4xl mx-auto">
              <TabsTrigger value="adhd">ADHD</TabsTrigger>
              <TabsTrigger value="autism">Autism</TabsTrigger>
              <TabsTrigger value="dyslexia">Dyslexia</TabsTrigger>
              <TabsTrigger value="breathing">Breathing</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>

            {/* ADHD Resources */}
            <TabsContent value="adhd" className="mt-8">
              <div className="space-y-4">
                {/* Assessment & Diagnosis */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-left">Assessment & Diagnosis</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6">
                        <p className="text-sm text-muted-foreground mb-4">
                          Tools to prepare for ADHD assessment and support diagnosis process
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_assess_parent_checklist.pdf', 'adhd_parent_checklist.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Parent Checklist
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_assess_school_summary.pdf', 'adhd_school_summary.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            School Summary
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_assess_teen_prep.pdf', 'adhd_teen_prep.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Teen Prep Guide
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_appointment_notes.pdf', 'adhd_appointment_notes.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Appointment Notes
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_diag_clinician_brief.pdf', 'adhd_clinician_brief.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Clinician Brief
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_diag_family_questions.pdf', 'adhd_family_questions.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Family Questions
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start col-span-2"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_diag_pros_cons.pdf', 'adhd_diagnosis_pros_cons.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Diagnosis Pros & Cons
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Home & Family */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Users className="h-6 w-6 text-purple-600" />
                        <h3 className="text-xl font-semibold text-left">Home & Family</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6">
                        <p className="text-sm text-muted-foreground mb-4">
                          Practical tools for managing daily routines and family life with ADHD
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_home_morning_routine.pdf', 'adhd_morning_routine.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Morning Routine
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_home_bedtime_routine.pdf', 'adhd_bedtime_routine.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Bedtime Routine
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_home_meltdown_plan.pdf', 'adhd_meltdown_plan.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Meltdown Plan
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_home_star_chart.pdf', 'adhd_star_chart.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Star Chart
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_home_token_jar.pdf', 'adhd_token_jar.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Token Jar
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_crisis_plan.pdf', 'adhd_crisis_plan.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Crisis Plan
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* School Support */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <BookOpen className="h-6 w-6 text-green-600" />
                        <h3 className="text-xl font-semibold text-left">School Support</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6">
                        <p className="text-sm text-muted-foreground mb-4">
                          Resources for advocating and implementing school accommodations
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_school_adjustments_checklist.pdf', 'adhd_adjustments_checklist.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Adjustments Checklist
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_school_meeting_planner.pdf', 'adhd_meeting_planner.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Meeting Planner
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start col-span-2"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_school_student_voice.pdf', 'adhd_student_voice.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Student Voice
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Teens & Young Adults */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Brain className="h-6 w-6 text-amber-600" />
                        <h3 className="text-xl font-semibold text-left">Teens & Young Adults</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6">
                        <p className="text-sm text-muted-foreground mb-4">
                          Resources for older students transitioning to independence and work
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_teens_feelings_cards.pdf', 'adhd_feelings_cards.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Feelings Cards
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_teens_study_planner.pdf', 'adhd_study_planner.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Study Planner
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_teens_support_plan.pdf', 'adhd_support_plan.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Support Plan
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_young_adult_adjustments.pdf', 'adhd_workplace_adjustments.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Workplace Adjustments
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_young_adult_admin_menu.pdf', 'adhd_admin_menu.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Admin Menu
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_young_adult_disclosure_script.pdf', 'adhd_disclosure_script.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Disclosure Script
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Self-Care & Focus */}
                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Heart className="h-6 w-6 text-pink-600" />
                        <h3 className="text-xl font-semibold text-left">Self-Care & Focus</h3>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6">
                        <p className="text-sm text-muted-foreground mb-4">
                          Mindfulness, focus strategies, and wellbeing tools for ADHD
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_selfcare_breathing_cards.pdf', 'adhd_breathing_cards.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Breathing Cards
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_selfcare_planner.pdf', 'adhd_selfcare_planner.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Self-Care Planner
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_selfcare_support_circle.pdf', 'adhd_support_circle.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Support Circle
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd-focus-quick-guide.pdf', 'adhd_focus_quick_guide.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Focus Quick Guide
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => window.open('/legacy-assets/assets/downloads/adhd-focus-toolkit.html', '_blank')}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Focus Toolkit (HTML)
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd-focus-workflows-resources.pdf', 'adhd_focus_workflows.pdf')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Focus Workflows
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* ADHD Toolkits */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="h-6 w-6 text-blue-600" />
                    ADHD Toolkits
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive resource collections
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Button 
                      variant="outline"
                      className="justify-start bg-white"
                      onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd-tools-resources.pdf', 'adhd_tools_resources.pdf')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Tools & Resources
                    </Button>
                    <Button 
                      variant="outline"
                      className="justify-start bg-white"
                      onClick={() => handleDownload('/legacy-assets/assets/downloads/adhd_support_contacts.pdf', 'adhd_support_contacts.pdf')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Support Contacts
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Autism Resources */}
            <TabsContent value="autism" className="mt-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                  Autism Resources
                </h3>
                <p className="text-muted-foreground mb-6">
                  UK-focused guides for adults, parents, carers, and clinicians
                </p>

                <div className="space-y-6">
                  {/* Parent & Family Guides */}
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Parent & Family Guides</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/autism-parent-quick-guide-uk.pdf', 'autism_parent_quick_guide.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Parent Quick Guide
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/autism-later-life-carer-guide-uk.pdf', 'autism_later_life_carer_guide.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Later Life Carer Guide
                      </Button>
                    </div>
                  </div>

                  {/* Adult Support */}
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Adult Support</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/autism-adult-support-guide-uk.pdf', 'autism_adult_support_guide.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Adult Support Guide
                      </Button>
                    </div>
                  </div>

                  {/* Clinical Resources */}
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Clinical Resources</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/autism-clinic-guide-checklists-uk.pdf', 'autism_clinic_guide_checklists.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Clinic Guide & Checklists
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> For comprehensive autism support tools and information, visit our{' '}
                      <Link href="/conditions/autism" className="text-purple-600 hover:underline">
                        Autism Hub
                      </Link>
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Dyslexia Resources */}
            <TabsContent value="dyslexia" className="mt-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="h-8 w-8 text-amber-600" />
                  Dyslexia Resources
                </h3>
                <p className="text-muted-foreground mb-6">
                  Support guides and practice materials for dyslexia
                </p>

                <div className="space-y-6">
                  {/* Dyslexia Guides */}
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Dyslexia Guides</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/dyslexia-parent-support-guide.pdf', 'dyslexia_parent_support_guide.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Parent Support Guide
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/dyslexia-adult-resources-uk.pdf', 'dyslexia_adult_resources.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Adult Resources
                      </Button>
                    </div>
                  </div>

                  {/* Practice Pack Templates */}
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Practice Materials</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/dyslexia-practice-pack-templates.pdf', 'dyslexia_practice_pack_templates.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Practice Pack Templates
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/dyslexia-reading-checklist.pdf', 'dyslexia_reading_checklist.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Reading Checklist
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/dyslexia-routine-planner.pdf', 'dyslexia_routine_planner.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Routine Planner
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Try our interactive{' '}
                      <Link href="/dyslexia-reading-training" className="text-amber-600 hover:underline">
                        Dyslexia Reading Training
                      </Link>
                      {' '}tool with phonics practice.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Breathing & Anxiety Resources */}
            <TabsContent value="breathing" className="mt-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Wind className="h-8 w-8 text-green-600" />
                  Breathing & Anxiety Support
                </h3>
                <p className="text-muted-foreground mb-6">
                  Breathing techniques, anxiety support, and calming strategies
                </p>

                <div className="space-y-6">
                  {/* Breathing Guides */}
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Breathing Guides</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/breathing-cheat-sheet.pdf', 'breathing_cheat_sheet.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Breathing Cheat Sheet
                      </Button>
                    </div>
                  </div>

                  {/* Anxiety Support */}
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Anxiety Support</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/anxiety-calm-body-train-mind-resources.pdf', 'anxiety_calm_body_train_mind.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Calm Body, Train Mind
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg space-y-3">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Try our interactive breathing tools:</strong>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/breathing">
                        <Button variant="outline" size="sm">
                          <Wind className="mr-2 h-4 w-4" />
                          Breathing Exercises
                        </Button>
                      </Link>
                      <Link href="/anxiety">
                        <Button variant="outline" size="sm">
                          <Heart className="mr-2 h-4 w-4" />
                          Anxiety Tools
                        </Button>
                      </Link>
                      <Link href="/tools/stress-tools">
                        <Button variant="outline" size="sm">
                          <Brain className="mr-2 h-4 w-4" />
                          Stress Management
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* General Resources */}
            <TabsContent value="general" className="mt-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-8 w-8 text-indigo-600" />
                  General Templates & Tools
                </h3>
                <p className="text-muted-foreground mb-6">
                  Universal templates and organizational resources
                </p>

                <div className="space-y-6">
                  {/* Templates & Tools */}
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Templates & Tools</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/one-page-profile-template.pdf', 'one_page_profile_template.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        One-Page Profile Template
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/neurobreath-letterhead.pdf', 'neurobreath_letterhead.pdf')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        NeuroBreath Letterhead
                      </Button>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Contact Information</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleDownload('/legacy-assets/assets/downloads/mshare-contact.vcf', 'mshare_contact.vcf')}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        MSHARE Contact (VCF)
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>One-Page Profile:</strong> A simple, powerful tool to share key information about needs, 
                      preferences, and support strategies. Perfect for school, work, or healthcare settings.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How to Use These Resources */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use These Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">1. Download</h3>
              <p className="text-sm text-muted-foreground">
                Click any resource to download as a PDF. All resources are free and can be saved to your device.
              </p>
            </Card>
            <Card className="p-6">
              <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">2. Print or Fill Digitally</h3>
              <p className="text-sm text-muted-foreground">
                Print resources for physical use, or fill them out digitally using PDF editing software.
              </p>
            </Card>
            <Card className="p-6">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">3. Share & Implement</h3>
              <p className="text-sm text-muted-foreground">
                Share with teachers, doctors, family members, or use them as part of your support plan.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-2">Free Resources, Forever</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            All NeuroBreath resources are free to download, print, and share. We believe everyone should have 
            access to quality mental health and neurodiversity support tools.
          </p>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>License:</strong> These resources are provided for personal, educational, and professional use. 
              Feel free to print, share, and distribute them.
            </p>
            <p>
              Have suggestions for new resources? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/schools">
              <Button variant="outline" size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                School Tools
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
