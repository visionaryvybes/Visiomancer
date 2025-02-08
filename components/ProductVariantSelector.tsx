'use client'

import React from "react"

interface Variant {
  id: string
  title: string
  price: number
  is_enabled: boolean
  options: Record<string, string>
}

interface ProductVariantSelectorProps {
  variants: Variant[]
  selectedVariantId: string
  onVariantChange: (variantId: string) => void
  optionNames: string[]
}

export default function ProductVariantSelector({
  variants,
  selectedVariantId,
  onVariantChange,
  optionNames
}: ProductVariantSelectorProps) {
  // Get currently selected variant
  const selectedVariant = variants.find(v => v.id === selectedVariantId)
  const selectedOptions = selectedVariant?.options || {}

  // Group variants by option values
  const optionValues: Record<string, Set<string>> = {}
  optionNames.forEach(name => {
    optionValues[name] = new Set(
      variants
        .filter(v => v.is_enabled)
        .map(variant => variant.options[name])
    )
  })

  // Handle option change
  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = {
      ...selectedOptions,
      [optionName]: value
    }

    // Find variant that matches all selected options
    const newVariant = variants.find(variant => 
      variant.is_enabled &&
      Object.entries(newOptions).every(
        ([key, value]) => variant.options[key] === value
      )
    )

    if (newVariant) {
      onVariantChange(newVariant.id)
    }
  }

  return (
    <div className="space-y-3">
      {optionNames.map(optionName => {
        const values = Array.from(optionValues[optionName])
        if (values.length <= 1) return null // Don't show selector if only one option

        return (
          <div key={optionName} className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              {optionName}
            </label>
            <div className="flex flex-wrap gap-2">
              {values.map(value => {
                const isSelected = selectedOptions[optionName] === value
                const isAvailable = variants.some(
                  v => v.is_enabled && 
                  v.options[optionName] === value &&
                  Object.entries(selectedOptions)
                    .filter(([key]) => key !== optionName)
                    .every(([key, val]) => v.options[key] === val)
                )

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(optionName, value)}
                    disabled={!isAvailable}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-500/20 text-blue-300'
                        : isAvailable
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                        : 'cursor-not-allowed bg-white/5 text-gray-500'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
} 