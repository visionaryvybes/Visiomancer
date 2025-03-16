/**
 * Formats a price value to a consistent display format
 * @param price - The price value to format
 * @param options - Formatting options
 * @returns Formatted price string
 */
export function formatPrice(
  price: number | null | undefined,
  options: {
    showCurrency?: boolean;
    currency?: string;
    fallback?: string;
  } = {}
): string {
  const {
    showCurrency = true,
    currency = '$',
    fallback = 'Contact for Price'
  } = options;

  // Handle invalid prices
  if (price === null || price === undefined || price <= 0) {
    return fallback;
  }

  // Format the price with 2 decimal places
  const formattedPrice = price.toFixed(2);
  
  // Return with or without currency symbol
  return showCurrency ? `${currency}${formattedPrice}` : formattedPrice;
}

/**
 * Determines if a product has any valid prices
 * @param variants - Array of product variants
 * @returns Boolean indicating if the product has any valid prices
 */
export function hasValidPrice(variants: Array<{ price: number; is_enabled?: boolean }>): boolean {
  return variants.some(v => v.price > 0);
}

/**
 * Gets the best price to display for a product
 * @param variants - Array of product variants
 * @param preferEnabled - Whether to prefer enabled variants
 * @returns The best price to display or null if no valid price
 */
export function getBestPrice(
  variants: Array<{ price: number; is_enabled?: boolean }>,
  preferEnabled: boolean = true
): number | null {
  if (!variants || variants.length === 0) {
    return null;
  }

  // First try to find enabled variants with valid prices
  if (preferEnabled) {
    const enabledVariants = variants.filter(v => v.is_enabled && v.price > 0);
    if (enabledVariants.length > 0) {
      return Math.min(...enabledVariants.map(v => v.price));
    }
  }

  // Fall back to any variant with a valid price
  const validVariants = variants.filter(v => v.price > 0);
  if (validVariants.length > 0) {
    return Math.min(...validVariants.map(v => v.price));
  }

  return null;
} 