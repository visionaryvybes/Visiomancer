'use client'

import React, { useState } from "react"
import { WarpBackground } from "../../components/ui/warp-background"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    // Here you would typically send the form data to your backend
    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h1 className="mb-8 text-center text-4xl font-bold">Contact Us</h1>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                <h2 className="mb-6 text-2xl font-semibold">Get in Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-300">support@visiomancer.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-300">
                        123 Vision Street<br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-xl font-semibold">Business Hours</h2>
                <div className="space-y-2 text-gray-300">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-2xl font-semibold">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600 disabled:bg-blue-500/50"
                >
                  {status === 'submitting' ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <p className="text-center text-green-400">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                )}

                {status === 'error' && (
                  <p className="text-center text-red-400">
                    Something went wrong. Please try again later.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 