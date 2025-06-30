import { CartItem, Product } from '@/types';
import { buildGumroadCheckoutUrl } from '@/lib/gumroad-utils';

interface Bundle {
  id: string;
  name: string;
  items: CartItem[];
  totalPrice: number;
  discountPercent?: number;
  createdAt: Date;
  expiresAt?: Date;
}

// Create a unique bundle ID
export function generateBundleId(): string {
  return `bundle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Calculate bundle price with optional discount
export function calculateBundlePrice(items: CartItem[], discountPercent: number = 0): number {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = subtotal * (discountPercent / 100);
  return subtotal - discount;
}

// Create a bundle from cart items
export function createBundle(items: CartItem[], name?: string, discountPercent?: number): Bundle {
  const bundleId = generateBundleId();
  const bundleName = name || `Bundle of ${items.length} products`;
  
  return {
    id: bundleId,
    name: bundleName,
    items: items,
    totalPrice: calculateBundlePrice(items, discountPercent),
    discountPercent,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  };
}

// Generate a shareable bundle URL
export function generateBundleUrl(bundle: Bundle): string {
  // In a real implementation, this would save to a database
  // For now, we'll encode the bundle data in the URL
  const bundleData = {
    id: bundle.id,
    items: bundle.items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    })),
    discount: bundle.discountPercent
  };
  
  const encoded = btoa(JSON.stringify(bundleData));
  return `${process.env.NEXT_PUBLIC_SITE_URL || ''}/bundle/${encoded}`;
}

// Decode bundle from URL
export function decodeBundleUrl(encoded: string): { productId: string; quantity: number }[] | null {
  try {
    const decoded = atob(encoded);
    const bundleData = JSON.parse(decoded);
    return bundleData.items;
  } catch (error) {
    console.error('Failed to decode bundle:', error);
    return null;
  }
}

// Format bundle for Gumroad checkout
export function formatBundleForGumroad(bundle: Bundle): {
  name: string;
  description: string;
  urls: string[];
} {
  const urls = bundle.items.map(item => {
    if (!item.product.gumroadUrl) return '';
    return buildGumroadCheckoutUrl(item.product.gumroadUrl, item.quantity);
  });

  const description = bundle.items
    .map(item => `${item.quantity}x ${item.product.name}`)
    .join(', ');

  return {
    name: bundle.name,
    description,
    urls
  };
}

// Validate bundle items
export function validateBundleItems(items: CartItem[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (items.length === 0) {
    errors.push('Bundle must contain at least one item');
  }

  items.forEach(item => {
    if (!item.product.gumroadUrl) {
      errors.push(`Product "${item.product.name}" is not available for purchase`);
    }
    if (item.quantity < 1) {
      errors.push(`Invalid quantity for "${item.product.name}"`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
} 