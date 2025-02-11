'use client';

import { useState, useEffect } from 'react';

interface ProductVariant {
  id: string;
  title: string;
  price: number;
  is_enabled: boolean;
  options: Record<string, string>;
}

interface ProductOption {
  name: string;
  values: string[];
}

interface Product {
  id: string;
  title: string;
  description: string;
  images: Array<{ src: string }>;
  variants: ProductVariant[];
  options: ProductOption[];
}

export function useProductData(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchProduct() {
      if (!productId) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        if (!mounted) return;

        if (!data || !data.id) {
          throw new Error('Invalid product data received');
        }

        setProduct(data);
      } catch (err) {
        console.error('Product fetch error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch product');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  return { product, loading, error };
} 