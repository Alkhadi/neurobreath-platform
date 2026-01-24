import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white relative overflow-hidden before:absolute before:inset-0 before:opacity-10 before:bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.3)_0%,transparent_50%)] before:pointer-events-none">

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-full mb-8">
          <Heart className="h-12 w-12" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Thank You for Being Part of Our Community
        </h2>
        <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed">
          Whether you donate, share our resources, or simply use our tools, you're helping
          us make mental health support more accessible. Together, we're making a difference.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-10 py-7 h-auto shadow-2xl hover:shadow-xl transition-all hover:scale-105"
          asChild
        >
          <a href="#main-content" className="flex items-center gap-3">
            <Heart className="h-6 w-6" />
            Back to Donation Options
          </a>
        </Button>
      </div>
    </section>
  )
}
