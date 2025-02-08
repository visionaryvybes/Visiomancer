'use client'

import React from "react"
import { motion } from "framer-motion"

interface WarpBackgroundProps {
  children: React.ReactNode
  className?: string
}

export const WarpBackground: React.FC<WarpBackgroundProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#1a237e] via-[#283593] to-[#303f9f] ${className}`}>
      {/* Base grid with perspective */}
      <div 
        className="absolute inset-0"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'rotateX(60deg) translateZ(0)',
            transformOrigin: '50% 50%',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          }}
        />
      </div>

      {/* Layered rectangles for depth effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-1/4 h-px bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />
        <div className="absolute inset-x-0 top-2/4 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute inset-x-0 top-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      {/* Ambient light effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10" />

      {/* Content container with perspective effect */}
      <div className="relative z-10">
        <div 
          className="absolute inset-0"
          style={{
            perspective: '1000px',
            perspectiveOrigin: '50% 50%'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex min-h-screen items-center justify-center p-4"
          >
            <div className="relative w-full max-w-screen-xl">
              <div className="relative">
                {/* Decorative borders */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 