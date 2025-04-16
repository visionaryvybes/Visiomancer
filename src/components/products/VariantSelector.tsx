"use client"

import { ProductVariant } from "@/types"
import React from "react"
import { cn } from "@/lib/utils" // Import cn utility for conditional classes

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedOptions: Record<string, string> // e.g., { Color: 'Black', Size: 'M' }
  onOptionChange: (variantName: string, optionValue: string) => void
}

export default function VariantSelector({
  variants,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <div key={variant.id}>
          <label 
            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            {variant.name}:
          </label>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => {
              const isSelected = selectedOptions[variant.name] === option;
              const isColor = variant.name.toLowerCase() === 'color';

              // Map descriptive color names to CSS values (add more as needed!)
              // Uses lowercase keys for case-insensitive matching
              const colorNameToHex: Record<string, string> = {
                // Standard
                "black": "#000000",
                "white": "#FFFFFF",
                "navy": "#000080",
                "red": "#FF0000",
                "royal blue": "#4169E1", // Lowercase key
                // Heathers/Blends (Examples - adjust hex codes for accuracy)
                "heather grey": "#B2BEB5", // Lowercase key
                "dark heather": "#555555", // Lowercase key
                "charcoal heather": "#36454F", // Lowercase key
                "navy heather": "#2C3E50", // Lowercase key
                "heather blue": "#A2A2D0", // Lowercase key
                // Added from logs (adjust hex if needed)
                "dark heather grey": "#555555", // Lowercase key, using Dark Heather value as approximation
                "fraiche peche": "#FFDAB9", // Lowercase key, Peach Puff as approximation
                "cotton pink": "#FFB6C1", // Lowercase key, LightPink as approximation
                "lavender": "#E6E6FA", // Lowercase key
                // Add other specific colors from your Printful data here (use lowercase keys)
              };

              // Determine the background color: mapped value OR original option value as fallback
              // Lookup uses lowercase option name for case-insensitivity
              const lookupKey = isColor ? option.toLowerCase() : option;
              const backgroundColor = isColor ? (colorNameToHex[lookupKey] || option) : undefined;
              
              // Log for debugging (can be removed later)
              if (isColor) {
                console.log(`[VariantSelector] Color Option: "${option}" (lookup: "${lookupKey}"), Mapped BG: "${backgroundColor}"`);
              }

              return (
                <button
                  key={option}
                  onClick={() => onOptionChange(variant.name, option)}
                  className={cn(
                    "rounded-md border text-sm font-medium transition-all duration-150", // Base styles for all buttons
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900", // Focus styles
                    
                    // Conditional styles based on whether it's a color swatch or text button
                    isColor 
                      ? "h-8 w-8 p-0 flex items-center justify-center" // Color swatch specific size/layout
                      : "px-4 py-2", // Text button specific padding
                    
                    // Conditional styles based on selection state
                    isSelected
                      ? "border-purple-500 ring-2 ring-purple-500 ring-offset-1 dark:ring-offset-gray-900" // Selected: Purple ring/border
                      : [ // Unselected:
                          "border-gray-300 dark:border-gray-600", // Base border
                          isColor 
                            ? "bg-gray-100 dark:bg-gray-800 hover:ring-1 hover:ring-gray-400 dark:hover:ring-gray-500" // Color swatch default bg + hover ring
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" // Text button default bg/text + hover bg
                        ],
                  )}
                  style={isColor ? { backgroundColor: backgroundColor } : {}} // Use the mapped color
                  aria-pressed={isSelected}
                  title={option}
                >
                  {isColor ? (
                     // Checkmark for selected color
                    isSelected ? <span className="text-white mix-blend-difference">&#10003;</span> : '' 
                  ) : (
                    option // Display text for non-color options (e.g., Size)
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  )
} 