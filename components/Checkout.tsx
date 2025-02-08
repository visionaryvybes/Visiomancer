'use client'

import React, { useState } from "react"
import { useCart } from "../context/CartContext"
import { useRouter } from "next/navigation"

interface ShippingAddress {
  first_name: string
  last_name: string
  email: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
}

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "US"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/printify/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingAddress
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Clear cart and redirect to order confirmation
      clearCart()
      router.push(`/orders/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/10 bg-red-500/5 p-4 text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              required
              value={shippingAddress.first_name}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border bg-background px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              required
              value={shippingAddress.last_name}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border bg-background px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={shippingAddress.email}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-lg border bg-background px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            required
            value={shippingAddress.phone}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-lg border bg-background px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address Line 1</label>
          <input
            type="text"
            name="address1"
            required
            value={shippingAddress.address1}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-lg border bg-background px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address Line 2</label>
          <input
            type="text"
            name="address2"
            value={shippingAddress.address2}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-lg border bg-background px-4 py-2"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              required
              value={shippingAddress.city}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border bg-background px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <input
              type="text"
              name="state"
              required
              value={shippingAddress.state}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border bg-background px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ZIP Code</label>
            <input
              type="text"
              name="zip"
              required
              value={shippingAddress.zip}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border bg-background px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Country</label>
          <select
            name="country"
            value={shippingAddress.country}
            onChange={(e) => handleInputChange(e as any)}
            className="mt-1 w-full rounded-lg border bg-background px-4 py-2"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        <div className="border-t pt-6">
          <div className="mb-4 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  )
} 