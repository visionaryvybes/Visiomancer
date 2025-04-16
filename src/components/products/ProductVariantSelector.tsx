import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface VariantOption {
  id: string;
  name: string;
  inStock: boolean;
  image?: string;
  colorCode?: string;
}

export interface VariantType {
  id: string;
  name: string;
  options: VariantOption[];
}

interface ProductVariantSelectorProps {
  variants: VariantType[];
  selectedVariants?: Record<string, string>;
  onChange?: (variantTypeId: string, optionId: string) => void;
  onSelectionComplete?: (isComplete: boolean) => void;
  className?: string;
}

export default function ProductVariantSelector({
  variants,
  selectedVariants = {},
  onChange,
  onSelectionComplete,
  className = '',
}: ProductVariantSelectorProps) {
  const [selection, setSelection] = useState<Record<string, string>>(selectedVariants);
  const [isAnimating, setIsAnimating] = useState<Record<string, boolean>>({});

  // Check if all required variants have been selected
  const isSelectionComplete = () => {
    return variants.every(variant => selection[variant.id]);
  };

  // Update selection and call onChange handler
  const handleSelect = (variantTypeId: string, optionId: string) => {
    const option = variants
      .find(v => v.id === variantTypeId)
      ?.options.find(o => o.id === optionId);
    
    if (option && option.inStock) {
      const newSelection = { ...selection, [variantTypeId]: optionId };
      setSelection(newSelection);
      
      // Trigger animation for this variant type
      setIsAnimating(prev => ({ ...prev, [variantTypeId]: true }));
      setTimeout(() => {
        setIsAnimating(prev => ({ ...prev, [variantTypeId]: false }));
      }, 300);
      
      // Call external onChange handler
      if (onChange) {
        onChange(variantTypeId, optionId);
      }
    }
  };

  // Notify parent component when selection state changes
  useEffect(() => {
    if (onSelectionComplete) {
      onSelectionComplete(isSelectionComplete());
    }
  }, [selection]);

  return (
    <div className={`space-y-6 ${className}`}>
      {variants.map((variant) => (
        <div key={variant.id} className="space-y-2">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {variant.name}
            </h3>
            
            {!selection[variant.id] && (
              <span className="text-xs text-red-500 dark:text-red-400">
                Please select {variant.name.toLowerCase()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {variant.options.map((option) => {
              const isSelected = selection[variant.id] === option.id;
              
              // Determine if this is a color variant
              const isColorVariant = !!option.colorCode;
              
              return (
                <motion.div
                  key={option.id}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: isAnimating[variant.id] && isSelected ? [1, 1.05, 1] : 1,
                  }}
                  className={`relative flex cursor-pointer flex-col items-center justify-center rounded-md border p-2 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700'
                  } ${
                    !option.inStock
                      ? 'cursor-not-allowed opacity-60'
                      : 'hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleSelect(variant.id, option.id)}
                >
                  {isColorVariant ? (
                    // Color swatch
                    <div 
                      className={`relative h-8 w-8 rounded-full border ${
                        isSelected 
                          ? 'border-gray-400 dark:border-gray-200' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div 
                        className="absolute inset-0.5 rounded-full"
                        style={{ backgroundColor: option.colorCode }}
                      ></div>
                      
                      {isSelected && (
                        <div className="absolute -inset-1 rounded-full border-2 border-primary-500 dark:border-primary-400"></div>
                      )}
                    </div>
                  ) : option.image ? (
                    // Image variant (like pattern or texture)
                    <div className={`relative h-10 w-10 overflow-hidden rounded ${
                      isSelected ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''
                    }`}>
                      <img 
                        src={option.image} 
                        alt={option.name}
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  ) : (
                    // Text option (like size)
                    <span className={`text-sm ${
                      isSelected 
                        ? 'font-medium text-primary-700 dark:text-primary-300' 
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {option.name}
                    </span>
                  )}
                  
                  {!isColorVariant && option.name && (
                    <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {option.name}
                    </span>
                  )}
                  
                  {!option.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-80">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Out of stock
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      {!isSelectionComplete() && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-yellow-400 dark:text-yellow-600" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Please select all options
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  You must select {variants.map(v => v.name.toLowerCase()).join(' and ')} before adding to cart.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 