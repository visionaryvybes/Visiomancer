import React from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative">
      {/* Perspective lines decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'rotateX(60deg) translateZ(0)',
            transformOrigin: '50% 100%',
            maskImage: 'linear-gradient(to top, transparent, black 10%, black 90%, transparent)',
          }}
        />
      </div>

      {/* Glowing top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative border-t border-white/10 bg-[#0B1120]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">About Us</h3>
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-25 blur" />
                <p className="relative rounded-lg bg-black/20 p-4 text-sm text-gray-400">
                  VISIONMANCER is your premier destination for unique and stylish products.
                </p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="group relative text-sm text-gray-400 transition-colors hover:text-white">
                    <span className="relative z-10">Products</span>
                    <span className="absolute -bottom-px left-0 h-px w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full" />
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="group relative text-sm text-gray-400 transition-colors hover:text-white">
                    <span className="relative z-10">Categories</span>
                    <span className="absolute -bottom-px left-0 h-px w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full" />
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="group relative text-sm text-gray-400 transition-colors hover:text-white">
                    <span className="relative z-10">About</span>
                    <span className="absolute -bottom-px left-0 h-px w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full" />
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Customer Service */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="group relative text-sm text-gray-400 transition-colors hover:text-white">
                    <span className="relative z-10">Contact Us</span>
                    <span className="absolute -bottom-px left-0 h-px w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full" />
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="group relative text-sm text-gray-400 transition-colors hover:text-white">
                    <span className="relative z-10">Shipping Info</span>
                    <span className="absolute -bottom-px left-0 h-px w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full" />
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="group relative text-sm text-gray-400 transition-colors hover:text-white">
                    <span className="relative z-10">Returns</span>
                    <span className="absolute -bottom-px left-0 h-px w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full" />
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Follow Us */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="group relative text-gray-400 transition-colors hover:text-white">
                  <div className="absolute -inset-2 rounded-full bg-blue-500/20 opacity-0 blur transition-opacity group-hover:opacity-100" />
                  <Facebook className="relative h-5 w-5" />
                </Link>
                <Link href="#" className="group relative text-gray-400 transition-colors hover:text-white">
                  <div className="absolute -inset-2 rounded-full bg-blue-500/20 opacity-0 blur transition-opacity group-hover:opacity-100" />
                  <Instagram className="relative h-5 w-5" />
                </Link>
                <Link href="#" className="group relative text-gray-400 transition-colors hover:text-white">
                  <div className="absolute -inset-2 rounded-full bg-blue-500/20 opacity-0 blur transition-opacity group-hover:opacity-100" />
                  <Twitter className="relative h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-center text-sm text-gray-400">
              © {new Date().getFullYear()} VISIONMANCER Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 