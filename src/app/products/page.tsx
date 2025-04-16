"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/products/ProductCard';

// --- Uncommented imports ---
import useProducts from '@/hooks/useProducts';
import { useWishlist } from '@/context/WishlistContext';
import { SortOption } from '@/components/products/types';
import ProductSort from '@/components/products/ProductSort';
import Pagination from '@/components/products/Pagination';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
};

const sortOptions: SortOption[] = [
  { id: 'newest', name: 'Newest' },
  { id: 'price-low-to-high', name: 'Price: Low to High' },
  { id: 'price-high-to-low', name: 'Price: High to Low' },
  { id: 'rating', name: 'Rating' },
];

export default function ProductsPage() {
  const [sortOption, setSortOption] = useState<SortOption>(sortOptions[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const categoryFilter = searchParams ? searchParams.get('category') : null;

  const itemsPerPage = 12;

  // --- Hook Calls ---
  const { products: allProducts = [], isLoading, error } = useProducts();
  useWishlist(); 

  // --- useMemo for filtering/sorting ---
  const filteredAndSortedProducts = useMemo(() => {
    let processedProducts = [...allProducts];

    // Apply CATEGORY filter from URL first (using tags)
    if (categoryFilter) {
      processedProducts = processedProducts.filter((product: Product) => {
        return product.tags?.some((tag: string) => tag.toLowerCase() === categoryFilter.toLowerCase());
      });
    }

    // Apply sorting
    const sorted = [...processedProducts];
    if (sortOption.id === 'price-low-to-high') {
      sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortOption.id === 'price-high-to-low') {
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sortOption.id === 'rating') {
      sorted.sort((a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0));
    }

    return sorted;
  }, [allProducts, sortOption, categoryFilter]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Please try again later.';
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading products: {errorMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      initial="hidden"
      animate="visible"
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl capitalize">
          {categoryFilter ? `${categoryFilter} Products` : 'Products'}
        </h1>
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
          {categoryFilter 
            ? `Browse our collection of ${categoryFilter} products.` 
            : "Check out our latest collection! We've got everything you need."
          }
        </p>
      </div>

      <div className="pt-12 pb-24 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:px-8">
        <aside className="hidden lg:block lg:col-span-1">
          <h2 className="sr-only">Filters</h2>
        </aside>

        <section aria-labelledby="product-heading" className="lg:col-span-3">
          <h2 id="product-heading" className="sr-only">
            Products
          </h2>
          
          <div className="flex justify-end border-b border-gray-200 dark:border-gray-700 pb-6 px-4 sm:px-6 lg:px-0">
            <ProductSort sortOptions={sortOptions} currentSort={sortOption} onChange={setSortOption} />
          </div>

          {currentProducts.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 px-4 sm:px-6 lg:px-0">
              {currentProducts.map((product, index) => (
                <motion.div key={product.id} custom={index} variants={fadeIn}>
                  <ProductCard
                    id={product.id}
                    title={product.name}
                    slug={product.slug || product.id}
                    imageUrl={product.images?.[0]?.url || '/placeholder.jpg'}
                    imageAlt={product.name || 'Product image'}
                    price={{ min: product.price ?? 0, max: product.maxPrice }}
                    salePrice={product.salePrice ? { min: product.salePrice } : undefined}
                    vendor={{ 
                      name: product.source || 'Unknown',
                      type: product.source ? product.source.toUpperCase() : 'UNKNOWN'
                    }}
                    rating={product.rating}
                    isNew={product.isNew}
                    isSale={product.isSale}
                    isBestSeller={product.isBestSeller}
                    isDigital={product.source?.toLowerCase() === 'gumroad'}
                    colors={product.colors}
                    sizes={product.sizes}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-center text-gray-500 dark:text-gray-400 px-4 sm:px-6 lg:px-0">
               <p>{isLoading ? 'Loading...' : 'No products found matching your criteria.'}</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 px-4 sm:px-6 lg:px-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
} 