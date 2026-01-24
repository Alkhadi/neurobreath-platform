import { Heart } from 'lucide-react'

export function SupportHero() {
  return (
    <section
      id="main-content"
      className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_50%,rgba(168,85,247,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.05)_0%,transparent_50%)] before:pointer-events-none"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-8 shadow-lg">
            <Heart className="h-14 w-14 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Support NeuroBreath
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Help us keep evidence-informed wellbeing resources free and accessible for everyone. 
            Your support helps us develop new tools, create more content, and reach those who need it most.
          </p>
        </div>

        {/* Quick Impact Strip */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-purple-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">Free Access</div>
            <p className="text-sm text-muted-foreground">No paywalls, ever</p>
          </div>
          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">Evidence-Informed</div>
            <p className="text-sm text-muted-foreground">Research-backed resources</p>
          </div>
          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-pink-100">
            <div className="text-3xl font-bold text-pink-600 mb-2">Privacy-First</div>
            <p className="text-sm text-muted-foreground">Your data stays yours</p>
          </div>
        </div>
      </div>
    </section>
  )
}
