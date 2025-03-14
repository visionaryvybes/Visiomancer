'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '../../context/CartContext'
import { WarpBackground } from '../../components/ui/warp-background'
import { toast } from 'sonner'

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

const initialShippingInfo: ShippingInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US'
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()
  const total = getCartTotal()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(initialShippingInfo)

  if (items.length === 0) {
    router.push('/products')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically:
      // 1. Validate the cart items are still in stock
      // 2. Create an order in your backend
      // 3. Process payment
      // 4. Send confirmation email
      // For now, we'll simulate a successful order

      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call

      toast.success('Order placed successfully!')
      clearCart()
      router.push('/thank-you')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <h1 className="mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold">Checkout</h1>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            {/* Order Summary - Show first on mobile, second on desktop */}
            <div className="lg:order-2 rounded-lg border border-white/10 bg-black/20 p-4 sm:p-6 backdrop-blur-sm">
              <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold">Order Summary</h2>
              <div className="space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variantId}`}
                    className="flex items-center gap-3 sm:gap-4 border-b border-white/10 pb-3 sm:pb-4 last:border-0"
                  >
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 640px) 64px, 80px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-medium line-clamp-2">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-white/60">
                        Quantity: {item.quantity || 1}
                      </p>
                      <p className="mt-1 text-sm sm:text-base font-medium">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="space-y-2 border-t border-white/10 pt-3 sm:pt-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information Form - Show second on mobile, first on desktop */}
            <div className="lg:order-1 rounded-lg border border-white/10 bg-black/20 p-4 sm:p-6 backdrop-blur-sm">
              <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-white/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-white/40"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-medium">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-white/40"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-xs sm:text-sm font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-white/40"
                  />
                </div>

                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="block text-xs sm:text-sm font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-white/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-xs sm:text-sm font-medium">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-white/40"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="zipCode" className="block text-xs sm:text-sm font-medium">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-white/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-xs sm:text-sm font-medium">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 sm:mt-6 w-full rounded-lg bg-blue-500 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-blue-600 disabled:bg-blue-500/50"
                >
                  {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 