'use client'

import React from 'react'
import { AnnouncementBar } from './ui/announcement-bar'
import { NewsletterPopup } from './ui/newsletter-popup'
import { BackToTop } from './ui/back-to-top'

const announcements = [
  '🚀 Free shipping on orders over $50',
  '🎉 New designs just dropped!',
  '💫 Join our rewards program and earn points',
  '🌟 Limited time offer: 20% off all hoodies',
]

export function GlobalUI() {
  return (
    <>
      {/* Top Elements */}
      <AnnouncementBar messages={announcements} />
      
      {/* Floating Elements */}
      <NewsletterPopup />
      <BackToTop />
    </>
  )
} 