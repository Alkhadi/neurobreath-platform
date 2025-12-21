import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Shield, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About NeuroBreath</h1>
          <p className="text-lg text-gray-600 mb-6">
            NeuroBreath provides clinically referenced, neuro-inclusive breathing tools for calm, focus, and emotional regulation.
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              We believe that effective breathing techniques should be accessible to everyone, especially neurodivergent individuals 
              who may struggle with traditional mindfulness approaches. Our tools are designed with clear patterns, predictable timing, 
              and sensory-friendly interfaces.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Neuro-Inclusive</h3>
                <p className="text-sm text-gray-600">Designed for autistic, ADHD, and neurodivergent individuals</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Evidence-Based</h3>
                <p className="text-sm text-gray-600">Informed by clinical research and public health guidance</p>
              </div>

              <div className="bg-pink-50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Free & Private</h3>
                <p className="text-sm text-gray-600">All progress tracked locally on your device</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Clinical References</h2>
            <p className="text-gray-700 mb-4">
              Our techniques are informed by research from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Dr. Herbert Benson (Harvard Medical School) - Relaxation Response</li>
              <li>Dr. Andrew Weil (University of Arizona) - 4-7-8 Breathing</li>
              <li>NHS (UK) - Breathing exercises for stress and anxiety</li>
              <li>U.S. Department of Veterans Affairs - Breathing techniques</li>
              <li>Navy SEAL training programs - Box breathing protocols</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Privacy & Data</h2>
            <p className="text-gray-700 mb-4">
              All your progress, sessions, and preferences are stored locally on your device. We don't track, sell, or share your data. 
              You're in complete control.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
              <p className="text-sm text-gray-700">
                <strong>⚠️ Educational information only:</strong> NeuroBreath provides educational breathing exercises. 
                This is not medical advice. If you have respiratory conditions, anxiety disorders, or other health concerns, 
                consult a healthcare professional before starting any breathing practice.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/">Start Practice</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
