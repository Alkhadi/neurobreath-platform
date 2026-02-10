'use client'

export function RoadmapAndAccountability() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Roadmap & Accountability</h2>

        <div className="space-y-12">
          {/* Milestone 1: Development */}
          <div className="bg-white rounded-lg border-2 border-slate-200 p-8 hover:border-purple-300 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Development milestone target — 31 March 2026</h3>
                <p className="text-muted-foreground mb-4">We are focused on building a solid foundation:</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold mt-0.5">•</span>
                    <span>Core platform stability and performance optimization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold mt-0.5">•</span>
                    <span>Extensive evidence-informed content coverage across conditions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold mt-0.5">•</span>
                    <span>Improved and expanded interactive tools and features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold mt-0.5">•</span>
                    <span>Quality gates and accessibility compliance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold mt-0.5">•</span>
                    <span>Privacy and compliance polish</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Milestone 2: Social & Apps */}
          <div className="bg-white rounded-lg border-2 border-slate-200 p-8 hover:border-purple-300 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Social presence & apps target — 31 October 2026</h3>
                <p className="text-muted-foreground mb-4">Once the core platform is solid, we will expand our reach:</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Launch and scale credible presence across major social media platforms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Release companion apps for iOS and Android (where applicable)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Consistent, evidence-informed branding across all touchpoints</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Improved onboarding and support resources for new users</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transparency note */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded">
            <p className="text-sm text-amber-900">
              <strong>Transparency note:</strong> These are target timelines for our development and growth. Dates may adjust based on research findings, user feedback, and priority shifts. We will publish regular updates as we progress towards these milestones.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
