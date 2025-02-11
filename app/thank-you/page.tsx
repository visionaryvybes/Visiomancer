'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { WarpBackground } from '../../components/ui/warp-background'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
          <div className="max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <CheckCircle className="h-24 w-24 text-green-400" />
            </div>
            <h1 className="mb-4 text-4xl font-bold">Thank You for Your Order!</h1>
            <p className="mb-8 text-lg text-white/70">
              We've received your order and will begin processing it right away.
              You'll receive a confirmation email shortly with your order details.
            </p>
            <div className="space-y-4">
              <Link
                href="/products"
                className="inline-block rounded-lg bg-blue-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
              >
                Continue Shopping
              </Link>
              <div className="text-sm text-white/60">
                <p>Need help? Contact our support team at</p>
                <a
                  href="mailto:support@visiomancer.com"
                  className="text-blue-400 hover:text-blue-300"
                >
                  support@visiomancer.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 