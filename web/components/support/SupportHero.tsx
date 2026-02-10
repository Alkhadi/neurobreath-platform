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
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Support NeuroBreath ❤️
          </h1>
          <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-slate-700">
            <p>
              If NeuroBreath has helped you—or someone you care about—please consider supporting our mission. Every contribution helps us keep the platform running while we continue building, improving, and expanding free, evidence-informed resources.
            </p>
            <p>
              NeuroBreath is an independent educational wellbeing platform and the website is currently in an active development phase. We have secured our domain and we are investing in extensive research, careful content review, and responsible development to ensure we provide credible, plausible, and high-value guidance—covering practical training, routine cultivation, and evidence-informed techniques that support wellbeing and everyday coping.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
