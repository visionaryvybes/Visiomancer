import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

export interface ProductVariant {
  id: string;
  title: string;
  price: string | null;
  compareAtPrice: string | null;
  available: boolean;
  options: Record<string, string>;
}

export interface ProductOption {
  name: string;
  values: string[];
}

interface ProductOptionsProps {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
}

export default function ProductOptions({
  options,
  variants,
  selectedVariant,
  onVariantChange,
}: ProductOptionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Initialize with the first variant or the provided selectedVariant
  useEffect(() => {
    if (!selectedVariant && variants.length > 0) {
      onVariantChange(variants[0]);
      setSelectedOptions(variants[0].options);
    } else if (selectedVariant) {
      setSelectedOptions(selectedVariant.options);
    }
  }, [variants, selectedVariant, onVariantChange]);

  // Find the variant that matches the selected options
  useEffect(() => {
    if (Object.keys(selectedOptions).length === 0) return;

    const matchedVariant = variants.find((variant) => {
      return Object.entries(selectedOptions).every(
        ([key, value]) => variant.options[key] === value
      );
    });

    if (matchedVariant && (!selectedVariant || selectedVariant.id !== matchedVariant.id)) {
      onVariantChange(matchedVariant);
    }
  }, [selectedOptions, variants, selectedVariant, onVariantChange]);

  // Handle option selection
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Check if an option value is available in any variant
  const isOptionAvailable = (optionName: string, optionValue: string): boolean => {
    // If no options are selected yet, all options are available
    if (Object.keys(selectedOptions).length === 0) return true;

    // Create a test selection with current selections plus the new one
    const testSelection = {
      ...selectedOptions,
      [optionName]: optionValue,
    };

    // Check if this combination exists in any variant
    return variants.some((variant) => {
      const matchesAllSelected = Object.entries(testSelection).every(
        ([key, value]) => variant.options[key] === value
      );
      return matchesAllSelected && variant.available;
    });
  };

  if (!options.length) return null;

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.name} className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {option.name}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isOptionAvailable(option.name, value);
              
              // Determine style based on option name
              let optionStyle = "color";
              if (option.name.toLowerCase().includes('size')) {
                optionStyle = "size";
              } else if (option.name.toLowerCase().includes('color')) {
                optionStyle = "color";
              } else {
                optionStyle = "text";
              }

              return (
                <motion.button
                  key={value}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  disabled={!isAvailable}
                  onClick={() => handleOptionChange(option.name, value)}
                  className={`${
                    optionStyle === "color"
                      ? "relative h-10 w-10 rounded-full p-1"
                      : optionStyle === "size"
                      ? "min-w-[3rem] rounded-md px-3 py-2 text-sm"
                      : "rounded-md px-3 py-2 text-sm"
                  } ${
                    isSelected
                      ? optionStyle === "color"
                        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                        : "bg-blue-600 text-white"
                      : optionStyle === "color"
                      ? "ring-1 ring-gray-300 dark:ring-gray-600"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  } ${
                    !isAvailable
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  aria-label={`Select ${option.name}: ${value}`}
                  style={
                    optionStyle === "color"
                      ? {
                          backgroundColor: value.toLowerCase(),
                        }
                      : undefined
                  }
                >
                  {optionStyle === "color" && isSelected && (
                    <CheckIcon
                      className={`absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white
                        ${['white', '#ffffff', '#fff'].includes(value.toLowerCase())
                          ? 'text-black'
                          : 'text-white'}`}
                    />
                  )}
                  {optionStyle !== "color" && value}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Display out of stock message if selected variant is not available */}
      {selectedVariant && !selectedVariant.available && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm font-medium text-red-600 dark:text-red-400"
        >
          This variant is currently out of stock
        </motion.p>
      )}
    </div>
  );
} 