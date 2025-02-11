import React from 'react'

interface Variant {
  id: string
  price: number
  title: string
  is_enabled: boolean
  options: Record<string, string>
}

interface SizeSelectorProps {
  variants: Variant[]
  selectedVariantId: string
  onVariantChange: (variantId: string) => void
}

export default function SizeSelector({ 
  variants, 
  selectedVariantId,
  onVariantChange 
}: SizeSelectorProps) {
  // Group variants by size
  const sizeOptions = variants.reduce((acc, variant) => {
    const size = variant.options['size'] || 'Default'
    if (!acc[size]) {
      acc[size] = []
    }
    acc[size].push(variant)
    return acc
  }, {} as Record<string, typeof variants>)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Size</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(sizeOptions).map(([size, sizeVariants]) => {
          const variant = sizeVariants[0]
          const isSelected = variant.id === selectedVariantId

          return (
            <button
              key={size}
              onClick={() => onVariantChange(variant.id)}
              className={`rounded-lg border p-4 text-left transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
              disabled={!variant.is_enabled}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{size}</div>
                  <div className="text-sm text-white/60">
                    ${variant.price.toFixed(2)} CAD
                  </div>
                </div>
                {!variant.is_enabled && (
                  <span className="text-xs text-red-400">Out of Stock</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
} 