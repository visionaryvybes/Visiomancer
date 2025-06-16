import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon } from '@heroicons/react/24/solid';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductsContext';
import { useConversions } from '@/context/ConversionsContext';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import { getProductById } from '@/lib/api/products';

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  imageAlt: string;
  price: {
    min: number;
    max?: number;
  };
  salePrice?: {
    min: number;
    max?: number;
  };
  vendor: {
    name: string;
    type: 'GUMROAD' | 'PRINTFUL' | string;
  };
  rating?: {
    value: number;
    count: number;
  };
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  isDigital?: boolean;
  colors?: string[];
  sizes?: string[];
}

export default function ProductCard({
  id,
  title,
  slug,
  imageUrl,
  imageAlt,
  price,
  salePrice,
  vendor,
  rating,
  isNew = false,
  isBestSeller = false,
  isSale = false,
  isDigital = false,
  colors = [],
  sizes = []
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const { getProductById: getProductFromContext } = useProducts();
  const { trackAddToCart } = useConversions();
  const [isAdding, setIsAdding] = useState(false);

  // Check if product is in wishlist using context
  const isWishlisted = isInWishlist(id);

  // Handle adding to cart - REMOVE async/fetch
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    console.log('[ProductCard] Quick Add initiated for:', id);

    // Get product from context instead of fetching
    const productFromContext = getProductFromContext(id);

    if (productFromContext) {
      console.log('[ProductCard] Found product in context:', productFromContext);
      addItem(productFromContext, 1);
      
      // Track conversion event
      trackAddToCart(
        productFromContext.id,
        productFromContext.title,
        productFromContext.price.min
      );
      
      // CartContext shows its own toast
    } else {
      // This case should ideally not happen if products are loaded correctly
      console.error('[ProductCard] Product not found in context for ID:', id);
      toast.error('Could not add item. Product details missing.');
    }
    
    // No need for try/catch/finally if not async
    setIsAdding(false); 
  };

  // Format price display helper
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Generate the price display text
  const getPriceDisplay = () => {
    if (!price) {
        return formatPrice(0);
    }
    if (salePrice) {
      return formatPrice(salePrice.min) + (salePrice.max ? ` - ${formatPrice(salePrice.max)}` : '');
    } else {
      return formatPrice(price.min) + (price.max ? ` - ${formatPrice(price.max)}` : '');
    }
  };

  // Get badge text
  const getBadgeText = () => {
    if (isNew) return 'New';
    if (isSale) return 'Sale';
    if (isBestSeller) return 'Best Seller';
    return null;
  };

  // Get badge class based on type
  const getBadgeClass = () => {
    if (isNew) return 'bg-blue-500';
    if (isSale) return 'bg-red-500';
    if (isBestSeller) return 'bg-amber-500';
    return 'bg-gray-700';
  };

  // Card hover animation variants
  const cardVariants = {
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  // Button hover animation variants
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-sm transition-shadow hover:shadow-md"
    >
      <Link href={`/products/${slug || id}`} className="flex flex-col h-full">
        <div className="aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
          <Image
            src={imageUrl || '/placeholder.svg'}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
          />
          {/* Badge */}
          {getBadgeText() && (
            <div
              className={`absolute left-3 top-3 z-10 px-2 py-1 text-xs font-medium text-white ${getBadgeClass()} rounded-md`}
            >
              {getBadgeText()}
            </div>
          )}

          {/* Digital Badge */}
          {isDigital && (
            <div className="absolute right-3 top-3 z-10 rounded-md bg-purple-500 px-2 py-1 text-xs font-medium text-white">
              Digital
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
            <div className="flex space-x-2">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label="Add to wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(id);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                {isWishlisted ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIconOutline className="h-5 w-5" />
                )}
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover={!isAdding ? "hover" : {}}
                whileTap={!isAdding ? "tap" : {}}
                aria-label="Quick add to cart"
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md ${isAdding ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'}`}
              >
                {isAdding ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <ShoppingCartIcon className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col space-y-2 p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{vendor?.name || 'Store'}</p>
          {/* Rating */}
          {rating && rating.value && rating.count && (
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((r) => (
                  <StarIcon
                    key={r}
                    className={`h-4 w-4 flex-shrink-0 ${
                      (rating.value || 0) > r ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                    aria-hidden="true"
                  />
                ))}
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({rating.count})</span>
              </div>
          )}
          <div className="flex flex-1 flex-col justify-end">
            <p className="text-base font-semibold text-gray-900 dark:text-white">{getPriceDisplay()}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}