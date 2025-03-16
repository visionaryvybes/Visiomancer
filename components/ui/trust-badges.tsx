'use client'

import React from 'react'
import { Shield, Truck, RefreshCw, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

const badges = [
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Your data is protected',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: '2-5 business days',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30 day return policy',
  },
  {
    icon: CreditCard,
    title: 'Payment Options',
    description: 'All major cards accepted',
  },
]

export function TrustBadges() {
  return (
    <div className="bg-background/50 backdrop-blur-sm border-t border-white/10 relative z-10 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-4 px-2 md:gap-4 md:py-6 md:px-4 mb-16 md:mb-0">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col items-center text-center p-2 md:p-4 rounded-lg transition-colors hover:bg-white/5"
            >
              <badge.icon className="w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2 text-primary transition-transform group-hover:scale-110" />
              <h3 className="font-medium mb-0.5 md:mb-1 text-sm md:text-base text-white/90 group-hover:text-white">
                {badge.title}
              </h3>
              <p className="text-xs md:text-sm text-white/60 group-hover:text-white/90">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 