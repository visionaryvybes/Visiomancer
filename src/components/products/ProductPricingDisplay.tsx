import React from 'react';

export interface PricingProps {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  locale?: string;
  showPercentOff?: boolean;
  showCurrency?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function ProductPricingDisplay({
  price,
  compareAtPrice,
  currency = 'USD',
  locale = 'en-US',
  showPercentOff = true,
  showCurrency = true,
  size = 'medium',
  className = '',
}: PricingProps) {
  // Don't show compare price if it's the same or lower than current price
  const hasDiscount = !!compareAtPrice && compareAtPrice > price;
  
  // Calculate percent off
  const percentOff = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;
  
  // Format the price based on locale and currency
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: showCurrency ? 'currency' : 'decimal',
      currency: showCurrency ? currency : undefined,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // Determine text sizes based on the size prop
  const priceTextSize = {
    small: 'text-base font-medium',
    medium: 'text-lg font-medium',
    large: 'text-2xl font-semibold',
  }[size];
  
  const compareTextSize = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[size];
  
  const discountTextSize = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  }[size];

  return (
    <div className={`flex flex-wrap items-end gap-x-2 ${className}`}>
      <span className={`${priceTextSize} text-gray-900 dark:text-gray-100`}>
        {formatPrice(price)}
      </span>
      
      {hasDiscount && (
        <>
          <span className={`${compareTextSize} text-gray-500 line-through dark:text-gray-400`}>
            {formatPrice(compareAtPrice)}
          </span>
          
          {showPercentOff && (
            <span className={`${discountTextSize} font-medium text-green-600 dark:text-green-400`}>
              {percentOff}% off
            </span>
          )}
        </>
      )}
    </div>
  );
} 