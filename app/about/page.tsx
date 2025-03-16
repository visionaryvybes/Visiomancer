'use client'

import React from 'react'
import Image from 'next/image'
import { Mail, Instagram, Twitter } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-blue-950">
      {/* Header Section */}
      <div className="px-4 pt-24 pb-8">
        <h1 className="text-3xl font-bold text-white">About Us</h1>
        <p className="mt-2 text-white/70">
          Discover the story behind VISIOMANCER
        </p>
      </div>

      {/* Content Sections */}
      <div className="px-4 pb-24 space-y-8">
        {/* Story Section */}
        <section className="rounded-lg bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Our Story</h2>
          <p className="text-white/70 leading-relaxed">
            VISIOMANCER was born from a passion for creating unique, high-quality art that speaks to the soul. 
            We believe in the power of visual storytelling and its ability to transform spaces and inspire minds.
          </p>
        </section>

        {/* Mission Section */}
        <section className="rounded-lg bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Our Mission</h2>
          <p className="text-white/70 leading-relaxed">
            We strive to bring exceptional artistic visions to life through premium quality prints and merchandise. 
            Each piece is carefully crafted to ensure the highest standards of quality and artistic integrity.
          </p>
        </section>

        {/* Quality Section */}
        <section className="rounded-lg bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quality Promise</h2>
          <ul className="space-y-3 text-white/70">
            <li>• Premium materials and inks</li>
            <li>• Carefully curated designs</li>
            <li>• Sustainable production practices</li>
            <li>• Satisfaction guaranteed</li>
          </ul>
        </section>

        {/* Contact Section */}
        <section className="rounded-lg bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <a 
              href="mailto:contact@visiomancer.com"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>contact@visiomancer.com</span>
            </a>
            <a 
              href="https://instagram.com/visiomancer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span>@visiomancer</span>
            </a>
            <a 
              href="https://twitter.com/visiomancer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span>@visiomancer</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
} 