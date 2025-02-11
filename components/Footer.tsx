import React from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { TrustBadges } from "./ui/trust-badges"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-black/50 to-black">
      {/* Trust Badges Section */}
      <div className="relative border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="py-12">
            <TrustBadges />
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative">
        <div className="container mx-auto px-4">
          <div className="py-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
              {/* About Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">About Us</h3>
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-75 blur" />
                  <p className="relative rounded-lg bg-black/40 p-4 text-sm text-white/70 backdrop-blur-sm">
                    VISIOMANCER is your premier destination for unique and stylish products.
                  </p>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/products" className="text-sm text-white/70 hover:text-white transition-colors">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="text-sm text-white/70 hover:text-white transition-colors">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Service */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Customer Service</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/shipping" className="text-sm text-white/70 hover:text-white transition-colors">
                      Shipping Info
                    </Link>
                  </li>
                  <li>
                    <Link href="/returns" className="text-sm text-white/70 hover:text-white transition-colors">
                      Returns Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-sm text-white/70 hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/size-guide" className="text-sm text-white/70 hover:text-white transition-colors">
                      Size Guide
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Connect</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/50">
                © {new Date().getFullYear()} VISIOMANCER. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-white/50 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 