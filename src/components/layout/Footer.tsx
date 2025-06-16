"use client";

import Link from 'next/link'
import { FaPinterest, FaTiktok } from 'react-icons/fa'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Footer() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const currencies = ['USD', 'EUR', 'CAD', 'GBP', 'AUD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'JPY', 'MYR', 'SGD', 'MXN']

  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-16">
      <div className="container mx-auto px-4">
        {/* Top section with currency and links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Left side - Currency Selector */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <select 
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-gray-500"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>

          {/* Center - Navigation Links */}
          <div className="flex space-x-8 mb-4 md:mb-0">
            <Link href="/terms" className="text-gray-600 hover:text-black text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-black text-sm">
              Privacy Policy
            </Link>
            <Link href="/returns" className="text-gray-600 hover:text-black text-sm">
              Returns & FAQ
            </Link>
          </div>

          {/* Right side - Social Icons */}
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-600 hover:text-black">
              <FaPinterest size={20} />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-black">
              <FaTiktok size={20} />
            </Link>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
            <p>&copy; {new Date().getFullYear()} Visiomancer</p>
            <span className="hidden md:inline">•</span>
            <p>Powered by Fourthwall</p>
          </div>
        </div>
      </div>
    </footer>
  )
} 