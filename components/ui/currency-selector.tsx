'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
]

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: typeof currencies[0]) => void
}

export function CurrencySelector({ onCurrencyChange }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  useEffect(() => {
    const savedCurrency = localStorage.getItem('selected-currency')
    if (savedCurrency) {
      const currency = currencies.find(c => c.code === savedCurrency)
      if (currency) {
        setSelectedCurrency(currency)
      }
    }
  }, [])

  const handleCurrencySelect = (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency)
    localStorage.setItem('selected-currency', currency.code)
    setIsOpen(false)
    onCurrencyChange?.(currency)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm hover:text-primary"
      >
        <span>{selectedCurrency.code}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-background shadow-lg ring-1 ring-black/5 z-50">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-muted first:rounded-t-lg last:rounded-b-lg ${
                  currency.code === selectedCurrency.code
                    ? 'bg-primary/10 text-primary'
                    : ''
                }`}
              >
                <span className="font-medium">{currency.code}</span>
                <span className="ml-2 text-foreground/60">
                  {currency.symbol} - {currency.name}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 