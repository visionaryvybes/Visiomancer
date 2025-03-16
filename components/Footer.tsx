'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter } from "lucide-react"
import { TrustBadges } from "./ui/trust-badges"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl relative z-10 mt-auto">
      <div className="container mx-auto px-4 py-6 md:py-8 mb-16 md:mb-0">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {/* About Section */}
          <div>
            <h3 className="mb-2 md:mb-4 text-base md:text-lg font-semibold text-white">About Us</h3>
            <p className="text-xs md:text-sm text-white/70">
              VISIOMANCER is your premier destination for unique and stylish products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-2 md:mb-4 text-base md:text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link href="/products" className="text-xs md:text-sm text-white/70 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-xs md:text-sm text-white/70 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs md:text-sm text-white/70 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-2 md:mb-4 text-base md:text-lg font-semibold text-white">Customer Service</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link href="/shipping" className="text-xs md:text-sm text-white/70 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-xs md:text-sm text-white/70 hover:text-white transition-colors">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-xs md:text-sm text-white/70 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-2 md:mb-4 text-base md:text-lg font-semibold text-white">Contact</h3>
            <p className="text-xs md:text-sm text-white/70">
              Email: support@visiomancer.com
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 md:mt-8 border-t border-white/10 pt-4 md:pt-8 text-center">
          <p className="text-xs md:text-sm text-white/50">
            © {new Date().getFullYear()} VISIOMANCER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 