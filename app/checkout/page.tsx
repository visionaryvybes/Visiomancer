'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const { items, total, clearCart } = useCart()
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
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Shipping Information Form */}
            <div className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-semibold">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>
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
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-white/40"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-white/40"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-white/40"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white"
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
                  className="mt-6 w-full rounded-lg bg-blue-500 px-8 py-4 font-semibold text-white transition-colors hover:bg-blue-600 disabled:bg-blue-500/50"
                >
                  {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variantId}`}
                    className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-white/60">
                        Quantity: {item.quantity}
                      </p>
                      <p className="mt-1 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="space-y-2 border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 