import React from 'react';
import { motion } from 'framer-motion';

export interface ColorOption {
  id: string;
  name: string;
  value: string;
  image?: string;
  inStock: boolean;
}

interface ProductColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string;
  onSelectColor: (colorId: string) => void;
  className?: string;
}

export default function ProductColorSelector({
  colors,
  selectedColor,
  onSelectColor,
  className = ''
}: ProductColorSelectorProps) {
  if (!colors || colors.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Color</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {colors.find(c => c.id === selectedColor)?.name || 'Select a color'}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = color.id === selectedColor;
          const hasColorValue = color.value.startsWith('#');
          
          return (
            <motion.button
              key={color.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => color.inStock && onSelectColor(color.id)}
              disabled={!color.inStock}
              className={`group relative h-10 w-10 overflow-hidden rounded-full border-2 transition-all
                ${isSelected 
                  ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800' 
                  : 'border-gray-200 dark:border-gray-700'}
                ${!color.inStock ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              aria-label={`${color.name}${!color.inStock ? ' (Out of Stock)' : ''}`}
              title={`${color.name}${!color.inStock ? ' (Out of Stock)' : ''}`}
            >
              {hasColorValue ? (
                <span
                  className="absolute inset-0"
                  style={{ backgroundColor: color.value }}
                />
              ) : color.image ? (
                <img
                  src={color.image}
                  alt={color.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
              )}
              
              {/* Checkmark for selected option */}
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    className={`h-5 w-5 ${hasColorValue && isColorDark(color.value) ? 'text-white' : 'text-gray-900'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              
              {/* Strikethrough for out of stock */}
              {!color.inStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    className="h-8 w-8 text-gray-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </span>
              )}
              
              {/* Focus ring for screen reader users */}
              <span className="absolute inset-0 rounded-full ring-offset-2 ring-offset-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:ring-offset-gray-900" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to determine if a color is dark
function isColorDark(hexColor: string): boolean {
  // Remove the # if present
  hexColor = hexColor.replace('#', '');
  
  // Parse the hex color to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  
  // Calculate the perceived brightness (YIQ formula)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Return true if the color is dark
  return yiq < 128;
} 