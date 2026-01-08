'use client'

import { BookOpen, Download, BarChart3, Users, Brain, Heart, Wind, GraduationCap, FileText, Package, Sparkles, Target, ChevronRight, Play, Settings } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TeacherToolsPage() {
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
      <section id="main-content" className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-6">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Teacher Tools Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Your complete toolkit for supporting neurodivergent learners. Access resources, track progress, 
              and implement evidence-based strategies in your classroom.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/teacher/dashboard">
                <Button size="lg" className="px-8">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Teacher Dashboard
                </Button>
              </Link>
              <Link href="/schools">
                <Button size="lg" variant="outline" className="px-8">
                  <BookOpen className="mr-2 h-5 w-5" />
                  School Resources
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <Card className="p-8 bg-white/80 backdrop-blur">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">60+</div>
                <div className="text-sm text-muted-foreground">Teaching Resources</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Free to Download</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Evidence</div>
                <div className="text-sm text-muted-foreground">Research-Based</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Ready</div>
                <div className="text-sm text-muted-foreground">Use Today</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Access Tools */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Quick Access</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Teacher Dashboard */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Teacher Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Monitor learner progress, track engagement, and view analytics for your classroom. 
                Real-time insights into student activity.
              </p>
              <Link href="/teacher/dashboard">
                <Button className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Open Dashboard
                </Button>
              </Link>
            </Card>

            {/* School Resources */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">School Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive guides for supporting students with ADHD, autism, anxiety, dyslexia, and more. 
                Classroom strategies and intervention tools.
              </p>
              <Link href="/schools">
                <Button className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Resources
                </Button>
              </Link>
            </Card>

            {/* Downloadable Resources */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-4">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Downloadable PDFs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                60+ printable resources including checklists, planners, assessment tools, and classroom accommodations guides.
              </p>
              <Link href="/resources">
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resources
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Teacher Quick Pack Download */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Teacher Quick Pack</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Download our complete collection of essential teaching resources in one convenient package
            </p>
          </div>

          <Card className="p-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <div className="bg-purple-100 p-6 rounded-2xl">
                  <FileText className="h-16 w-16 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3">Complete Teaching Toolkit</h3>
                <p className="text-muted-foreground mb-4">
                  Everything you need to support neurodivergent learners in one comprehensive PDF:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Classroom adjustment checklists for ADHD, autism, anxiety, and dyslexia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Student support plan templates and meeting planners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Quick reference guides for classroom interventions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Behavior management strategies and visual supports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Breathing exercises and calming techniques for classroom use</span>
                  </li>
                </ul>
                <Button 
                  size="lg"
                  onClick={() => handleDownload('/legacy-assets/assets/downloads/teacher-quick-pack.pdf', 'teacher-quick-pack.pdf')}
                  className="w-full md:w-auto"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Teacher Quick Pack (PDF)
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Condition-Specific Resources */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Resources by Condition</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* ADHD */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">ADHD</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Attention strategies, focus tools, and classroom accommodations for ADHD students.
              </p>
              <div className="space-y-2">
                <Link href="/conditions/adhd">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    ADHD Guide
                  </Button>
                </Link>
                <Link href="/conditions/adhd-teacher">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Teacher Resources
                  </Button>
                </Link>
                <Link href="/tools/adhd-tools">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    ADHD Tools
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Autism */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Autism</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Visual supports, sensory strategies, and communication tools for autistic learners.
              </p>
              <div className="space-y-2">
                <Link href="/conditions/autism">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Autism Hub
                  </Button>
                </Link>
                <Link href="/conditions/autism-teacher">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Teacher Resources
                  </Button>
                </Link>
                <Link href="/tools/autism-tools">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Autism Tools
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Anxiety */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-4">
                <Wind className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Anxiety</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Breathing exercises, grounding techniques, and anxiety management tools for students.
              </p>
              <div className="space-y-2">
                <Link href="/anxiety">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Anxiety Guide
                  </Button>
                </Link>
                <Link href="/breathing">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Wind className="mr-2 h-4 w-4" />
                    Breathing Exercises
                  </Button>
                </Link>
                <Link href="/tools/anxiety-tools">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Anxiety Tools
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Dyslexia */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 p-3 rounded-lg inline-block mb-4">
                <BookOpen className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dyslexia</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Reading interventions, assistive technology, and multi-sensory teaching approaches.
              </p>
              <div className="space-y-2">
                <Link href="/conditions/dyslexia">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Dyslexia Guide
                  </Button>
                </Link>
                <Link href="/conditions/dyslexia-teacher">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Teacher Resources
                  </Button>
                </Link>
                <Link href="/dyslexia-reading-training">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Play className="mr-2 h-4 w-4" />
                    Reading Training
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Classroom Tools */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Interactive Classroom Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Digital tools you can use with students during lessons or support sessions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Wind className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Breathing Exercises</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Guided breathing techniques for classroom calming and focus. Box breathing, 4-7-8, and more.
              </p>
              <Link href="/breathing">
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Try Breathing Tools
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <Heart className="h-8 w-8 text-pink-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Mood & Emotion Tools</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Help students identify and regulate emotions with mood tracking and emotional awareness tools.
              </p>
              <Link href="/tools/mood-tools">
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Explore Mood Tools
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <Target className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Focus & Attention</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Interactive focus training games and activities to build attention skills and concentration.
              </p>
              <Link href="/tools/focus-training">
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Focus Tools
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <Sparkles className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Autism Tools</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Visual schedules, social stories, and sensory regulation activities for autistic students.
              </p>
              <Link href="/tools/autism-tools">
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Autism Resources
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <Target className="h-8 w-8 text-teal-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Stress Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Grounding exercises, relaxation techniques, and stress reduction strategies for students.
              </p>
              <Link href="/tools/stress-tools">
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Stress Tools
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <BookOpen className="h-8 w-8 text-amber-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Reading Practice</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Phonics training, letter sounds, and dyslexia-friendly reading exercises with audio support.
              </p>
              <Link href="/dyslexia-reading-training">
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Reading Training
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Support & Contact */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
              <p className="text-muted-foreground mb-6">
                Have questions about using NeuroBreath in your classroom? Need specific resources? 
                We're here to support educators.
              </p>
              <Link href="/contact">
                <Button>
                  Contact Support
                </Button>
              </Link>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
              <Settings className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Professional Development</h3>
              <p className="text-muted-foreground mb-6">
                Looking for training on neurodiversity and mental health in education? 
                Explore our comprehensive guides and external resources.
              </p>
              <Link href="/schools#resources">
                <Button variant="outline">
                  View Training Resources
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-2">Supporting Every Student</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            NeuroBreath provides free, evidence-based resources for educators supporting neurodivergent learners 
            and promoting mental wellbeing in schools.
          </p>
        </div>
      </footer>
    </main>
  )
}
