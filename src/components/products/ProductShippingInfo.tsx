import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
  isAvailable: boolean;
}

interface ProductShippingInfoProps {
  options: ShippingOption[];
  selectedOptionId?: string;
  onOptionChange?: (optionId: string) => void;
  showPrice?: boolean;
  className?: string;
}

export default function ProductShippingInfo({
  options,
  selectedOptionId,
  onOptionChange,
  showPrice = true,
  className = '',
}: ProductShippingInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selected, setSelected] = useState<string>(
    selectedOptionId || (options.find(opt => opt.isAvailable)?.id || '')
  );

  const handleOptionSelect = (optionId: string) => {
    if (options.find(opt => opt.id === optionId)?.isAvailable) {
      setSelected(optionId);
      onOptionChange?.(optionId);
    }
  };

  const selectedOption = options.find(opt => opt.id === selected);

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header with shipping icon */}
      <div 
        className="flex cursor-pointer items-center justify-between" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Shipping Information</h3>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* Selected option summary (always visible) */}
      {selectedOption && (
        <div className="mt-2 flex justify-between text-sm">
          <div className="font-medium text-gray-700 dark:text-gray-300">{selectedOption.name}</div>
          <div className="text-right">
            <span className="text-green-600 dark:text-green-400">{selectedOption.estimatedDelivery}</span>
            {showPrice && selectedOption.price > 0 && (
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                ${selectedOption.price.toFixed(2)}
              </span>
            )}
            {showPrice && selectedOption.price === 0 && (
              <span className="ml-2 text-green-600 dark:text-green-400">Free</span>
            )}
          </div>
        </div>
      )}

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 pt-2">
              {options.map((option) => (
                <div
                  key={option.id}
                  className={`relative cursor-pointer rounded-md border p-3 transition-all ${
                    selected === option.id
                      ? 'border-primary-500 bg-primary-50 dark:border-primary-600 dark:bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                  } ${!option.isAvailable ? 'cursor-not-allowed opacity-60' : ''}`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <div
                          className={`mr-2 h-4 w-4 rounded-full border ${
                            selected === option.id
                              ? 'border-primary-500 bg-primary-500 dark:border-primary-600 dark:bg-primary-600'
                              : 'border-gray-300 dark:border-gray-500'
                          } flex items-center justify-center`}
                        >
                          {selected === option.id && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{option.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {option.estimatedDelivery}
                      </div>
                      {showPrice && (
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!option.isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-gray-200 bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-60">
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 