'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { getDeviceId } from '@/lib/device-id'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // In a real application, you would send this to a backend API
      // For now, we'll just store it locally and show a success message
      const deviceId = getDeviceId()
      const submission = {
        ...formData,
        deviceId,
        submittedAt: new Date().toISOString()
      }

      // Store in localStorage (in production, send to backend)
      const existingSubmissions = JSON.parse(localStorage.getItem('nb_contact_submissions') || '[]')
      existingSubmissions.push(submission)
      localStorage.setItem('nb_contact_submissions', JSON.stringify(existingSubmissions))

      toast.success('Message submitted successfully! We\'ll get back to you soon.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Failed to submit form:', error)
      toast.error('Failed to submit message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Have questions, feedback, or suggestions? We'd love to hear from you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a subject</option>
                <option value="feedback">General Feedback</option>
                <option value="bug">Report a Bug</option>
                <option value="feature">Feature Request</option>
                <option value="help">Help & Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Tell us more..."
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Send Message'}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Your message will be stored locally and securely. We respect your privacy.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Other Ways to Reach Us</h2>
          </div>
          <p className="text-gray-600 mb-4">
            For urgent issues or detailed inquiries, you can also reach us directly at:
          </p>
          <p className="text-gray-900 font-medium">support@neurobreath.co.uk</p>
        </div>
      </div>
    </div>
  )
}
