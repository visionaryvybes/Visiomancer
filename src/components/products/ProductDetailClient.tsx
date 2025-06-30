"use client"

import Image from 'next/image'
import { Product, ProductImage, ProductVariant, ProductVariantDetail } from '@/types'
import { useCart } from '@/context/CartContext'
import { useProducts } from '@/context/ProductsContext'
import { useWishlist } from '@/context/WishlistContext'
import { useConversions } from '@/context/ConversionsContext'
import { usePageTracking } from '@/hooks/usePageTracking'
import { useState, useEffect, useRef } from 'react'
import VariantSelector from "@/components/products/VariantSelector"
import Button from '@/components/ui/Button'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2 as Share,
  ShieldCheck, 
  Zap,
  Package,
  ChevronRight,
  Download,
  CheckCircle2,
  Image as ImageIcon,
  ZoomIn,
  ThumbsUp,
  Clock,
  Award
} from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShare } from 'react-icons/fi' // Modern share icon
import ProductReviews from '@/components/products/ProductReviews'

// Use the SerializableError type for the prop
interface SerializableError {
  message: string;
  status?: number;
}

interface ProductDetailClientProps {
  product: Product | null; // Accept product data or null if not found/error
  fetcherError?: SerializableError; // Updated type for the error prop
}

// Add fade-in animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ProductDetailClient({ product: initialProduct, fetcherError }: ProductDetailClientProps) {
  // --- Log received props and context data --- 
  console.log("[ProductDetailClient] Received initialProduct:", initialProduct);
  console.log("[ProductDetailClient] Received fetcherError:", fetcherError);

  const { addItem } = useCart()
  const { products: allProducts, getProductById: getProductFromContext } = useProducts()
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist()
  const { trackCheckout, trackAddToCart, getUserEmail } = useConversions()
  
  console.log("[ProductDetailClient] allProducts from context:", allProducts);
  // --- End Logging ---

  // --- State ---
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isMagnified, setIsMagnified] = useState(false);
  const [magnifyPosition, setMagnifyPosition] = useState({ x: 0, y: 0 });
  const [selectedColorValue, setSelectedColorValue] = useState<string | undefined>(undefined);
  const [showZoom, setShowZoom] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const product = initialProduct; 
  const isProductWishlisted = product ? isInWishlist(product.id) : false;

  // Track page visit for conversions
  usePageTracking(
    product?.id,
    product?.name,
    'digital-art'
  );

  // --- Image URLs --- 
  const imageUrls: string[] = product?.images?.map((img: ProductImage) => img.url).filter(Boolean) as string[] || [];
  if (product && imageUrls.length === 0) {
    imageUrls.push('/next.svg');
  }

  // --- Effects ---
  // Add scroll listener for floating button (Moved up)
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setShowFloatingButton(position > 300); 
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Update current price (existing effect)
  useEffect(() => {
    if (product?.variantDetails && product.variants) {
      const keyParts = product.variants.map((v: ProductVariant) => selectedOptions[v.name]).filter(Boolean);
      if (keyParts.length === product.variants.length) { 
        const optionKey = keyParts.join('_');
        const detail = product.variantDetails.find((vd: ProductVariantDetail) => vd.optionKey === optionKey);
        setCurrentPrice(detail ? detail.price : product.price);
      } else {
        // If not all variants selected, might show base price or null/calculating
        setCurrentPrice(product.price); 
      }
    } else if (product) {
      setCurrentPrice(product.price);
    }
  }, [product, selectedOptions]);

  // Initialize selectedOptions (existing effect)
  useEffect(() => {
    if (product?.variants) {
      const initialOptions: Record<string, string> = {};
      let initialColorValue: string | undefined = undefined;
      product.variants.forEach((variant: ProductVariant) => {
        if (variant.options.length > 0) {
          const defaultOption = variant.options[0];
          initialOptions[variant.name] = defaultOption;
          // Set initial color preview if this is the color variant
          if (variant.name.toLowerCase() === 'color') {
             initialColorValue = defaultOption; // Simplified for now
          }
        }
      });
      setSelectedOptions(initialOptions);
      setSelectedColorValue(initialColorValue);
    }
  }, [product]);

  // --- Note: Pinterest tracking is now handled by usePageTracking hook ---
  // This avoids duplicate PageVisit events

  // Update Image on Variant Change (existing effect)
  useEffect(() => {
    if (!product || !product.variants || !product.variantImageMap) return;

    const allVariantsSelected = product.variants.every((v: ProductVariant) => selectedOptions[v.name]);
    if (!allVariantsSelected) {
      // setActiveImage(0); // Optional: reset to default if not all selected
      return;
    }

    // Construct the key based on current selections (e.g., "Black_S")
    const optionKey = product.variants
      .map((v: ProductVariant) => selectedOptions[v.name])
      .join('_');

    let targetImageIndex = -1;
    let variantImageUrl = product.variantImageMap[optionKey]; // Try exact key first

    // --- Fallback Logic --- 
    if (!variantImageUrl) {
      // If exact key (Color_Size) fails, try finding an image matching just the selected Color
      const selectedColor = selectedOptions['Color']; // Assuming variant name is 'Color'
      if (selectedColor) {
         // Find the first key in the map that starts with the selected color
         const fallbackKey = Object.keys(product.variantImageMap).find(key => key.startsWith(selectedColor + '_'));
         if (fallbackKey) {
            variantImageUrl = product.variantImageMap[fallbackKey];
             console.log(`Exact key "${optionKey}" not found, using fallback image for color "${selectedColor}": ${variantImageUrl}`);
         }
      }
    }
    // --- End Fallback Logic ---

    if (variantImageUrl) {
      // Find the index of this image (exact or fallback) in the main imageUrls array
      const imageIndex = imageUrls.findIndex(url => url === variantImageUrl);
      if (imageIndex !== -1) {
        targetImageIndex = imageIndex;
      }
    }

    // Update the active image state
    if (targetImageIndex !== -1) {
        setActiveImage(targetImageIndex);
    } else {
      // If no specific or fallback image found in map or main list, default to first image
      console.warn(`No image found for key "${optionKey}" or fallback color. Defaulting to image 0.`);
      setActiveImage(0);
    }

  }, [selectedOptions, product, imageUrls]);

  // --- Early Return Checks --- 
  if (fetcherError) {
    const status = fetcherError.status;
    const isNotFound = status === 404;
    
    return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-400">
        {isNotFound ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Product Not Found</h2>
            <p className="mb-6">Sorry, we couldn&apos;t find the product you were looking for.</p>
          </>
        ) : (
           // Simple error display using the serialized message and status
           <div className="my-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
             <h3 className="font-semibold">Error loading product details</h3>
             <p className="mt-1 text-sm">{fetcherError.message} (Status: {status || 'N/A'})</p>
           </div>
        )}
        <Button asChild className="mt-4">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  if (!product) { 
     // This state might occur if server fetch succeeded but returned null/empty data
     return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-400">
         <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Product Unavailable</h2>
         <p className="mb-6">This product data could not be loaded or is not available.</p>
        <Button asChild className="mt-4">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  // --- Constants derived after checks ---
  const currentActiveImageIndex = Math.max(0, Math.min(activeImage, imageUrls.length - 1));
  const displayPrice = currentPrice !== null ? `$${currentPrice.toFixed(2)}` : (product.price ? `$${product.price.toFixed(2)}` : 'N/A');
  const relatedProducts = Array.isArray(allProducts)
    ? allProducts.filter(p => p.id !== product.id).slice(0, 4)
    : [];
  const reviews = [
    { id: 1, author: 'Alex J.', rating: 5, text: 'Excellent quality and fast shipping. Will definitely buy again!' },
    { id: 2, author: 'Sarah W.', rating: 4, text: 'Great product, slightly different color than pictured but still love it.' },
    { id: 3, author: 'Michael C.', rating: 5, text: 'Exactly as described. Exceeded my expectations.' }
  ];
  const productId = product?.id;
  if (!productId) {
    return <div>Error: Product ID is missing.</div>; 
  }

  // --- Handlers ---
  const handleOptionChange = (variantName: string, optionValue: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [variantName]: optionValue
    }));
    
    // If the changed variant is 'Color', update the selectedColorValue state
    if (variantName.toLowerCase() === 'color') {
      const colorValue = optionValue; // Simplified for now
      setSelectedColorValue(colorValue);
      console.log(`[ProductDetailClient] Color changed to: "${optionValue}", CSS Value: "${colorValue}"`);
    }
    // Image change is handled by the separate useEffect
  };

  const handleAddToCart = () => {
    const userEmail = getUserEmail();
    
    // Track conversion event first
    trackAddToCart(product.id, product.name, product.price, 'USD', userEmail || undefined);
    
    // Then add to cart (CartContext will handle the notification)
    addItem(product, 1);
  };

  const handleBuyNow = () => {
    if (!product || !product.gumroadUrl) {
      toast.error('Product purchase link not available.');
      return;
    }
    
    // Build proper Gumroad checkout URL
    const buildGumroadCheckoutUrl = (gumroadUrl: string, quantity: number): string => {
      try {
        const url = new URL(gumroadUrl);
        
        // Ensure we have the wanted=true parameter for direct checkout
        url.searchParams.set('wanted', 'true');
        
        // Add quantity parameter
        url.searchParams.set('quantity', quantity.toString());
        
        return url.toString();
      } catch (error) {
        console.error('Error constructing Gumroad URL:', error);
        // Fallback to simple concatenation
        const hasParams = gumroadUrl.includes('?');
        const connector = hasParams ? '&' : '?';
        return `${gumroadUrl}${connector}wanted=true&quantity=${quantity}`;
      }
    };
    
    toast.loading('Redirecting to checkout...', { id: 'buy-now' });
    
    // Track conversion event for direct purchase with email if available
    const userEmail = getUserEmail();
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    trackCheckout([product.id], product.price, 'USD', 1, userEmail || undefined, orderId);
    
    // Build URL with proper parameters
    const finalUrl = buildGumroadCheckoutUrl(product.gumroadUrl, 1);
    
    console.log('[Buy Now] Opening URL:', finalUrl);
    
    // Open Gumroad checkout directly
    window.open(finalUrl, '_blank');
    toast.success('Redirecting to Gumroad checkout...', { id: 'buy-now' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'Check out this product',
        text: product?.description?.substring(0, 100) || 'Found an amazing product',
        url: window.location.href
      })
      .catch(err => {
        console.error("Share API error:", err); 
        toast.error('Could not share product');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowZoom(!showZoom);
  };

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMagnifyPosition({ x, y });
    setIsMagnified(true);
  };

  const handleImageLeave = () => {
    setIsMagnified(false);
  };

  // --- Main Render --- 
  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-6xl"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      {/* Breadcrumbs */}
      <motion.div variants={fadeIn} className="mb-6 text-sm breadcrumbs">
        <ol className="flex space-x-2 text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">Home</Link></li>
          <li>&#8250;</li>
          <li><Link href="/products" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">Products</Link></li>
          <li>&#8250;</li>
          <li className="text-gray-800 dark:text-gray-200 font-medium truncate w-60 sm:w-auto">{product.name}</li>
        </ol>
      </motion.div>

      {/* Floating Add to Cart button - appears on scroll */}
      <AnimatePresence>
        {showFloatingButton && (
          <motion.div 
            className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full" 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              onClick={handleAddToCart} 
              variant="default"
              size="lg" 
              className="rounded-full px-6 py-6 flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Enhanced Image Gallery */}
        <motion.div variants={fadeInUp}>
          <div 
            ref={imageRef}
            className="relative w-full aspect-square overflow-hidden rounded-lg shadow-lg cursor-zoom-in group border bg-gray-100"
            onMouseMove={handleImageHover}
            onMouseLeave={handleImageLeave}
            onClick={handleImageClick}
          >
            {/* Zoom icon overlay */}
            <div className="absolute top-3 right-3 z-10 bg-black/50 rounded-full p-2 text-white opacity-70 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={20} />
            </div>
            
            <Image
              priority
              src={imageUrls[currentActiveImageIndex]}
              alt={`${product.name} - Image ${currentActiveImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-contain transition-transform duration-300 ease-out ${isMagnified ? 'scale-[2]' : 'scale-100'}`}
              style={{ 
                transformOrigin: `${magnifyPosition.x}% ${magnifyPosition.y}%`
              }}
              unoptimized={imageUrls[currentActiveImageIndex] === '/next.svg'}
              onError={(e) => {
                console.warn(`Failed to load image: ${imageUrls[currentActiveImageIndex]}`);
                e.currentTarget.src = '/next.svg';
              }}
            />
            
            {/* Fullscreen image modal */}
            <AnimatePresence>
              {showZoom && (
                <motion.div 
                  className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowZoom(false)}
                >
                  <button 
                    className="absolute top-4 right-4 text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                    onClick={() => setShowZoom(false)}
                  >
                    &times;
                  </button>
                  <div className="w-[90vw] h-[90vh] relative">
                    <Image
                      src={imageUrls[currentActiveImageIndex]}
                      alt={`${product.name} - Full view`}
                      fill
                      className="object-contain"
                      unoptimized={imageUrls[currentActiveImageIndex] === '/next.svg'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
              {imageUrls.map((imgUrl, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${activeImage === index ? 'border-purple-500 scale-105' : 'border-gray-300 dark:border-gray-700 opacity-70 hover:opacity-100'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                    unoptimized={imgUrl === '/next.svg'}
                     onError={(e) => { e.currentTarget.src = '/next.svg'; }} // Fallback for thumbnails
                  />
                </motion.button>
              ))}
            </div>
          )}
          
          {/* File information indicators */}
          <motion.div 
            variants={fadeIn}
            className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500"
          >
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              <ImageIcon size={16} />
              <span>High Resolution</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              <Download size={16} />
              <span>Digital Download</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              <CheckCircle2 size={16} />
              <span>Print Ready</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Product Details */}
        <motion.div variants={fadeInUp} className="flex flex-col">
          <h1 className="text-3xl font-bold mb-3 text-gray-800 dark:text-gray-100">{product.name}</h1>
          
          {/* Price & Rating - with animation */}
          <motion.div 
            className="flex items-center mb-4 space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-2xl font-semibold text-purple-600 dark:text-purple-400">{displayPrice}</span>

          </motion.div>

          {/* Product badges */}
          <motion.div 
            className="flex flex-wrap gap-2 mb-4"
            variants={staggerChildren}
          >
            <motion.span 
              variants={fadeIn}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-300"
            >
              <Award size={14} />
              Premium Quality
            </motion.span>
            <motion.span 
              variants={fadeIn}
              className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded dark:bg-green-900 dark:text-green-300"
            >
              <Clock size={14} />
              Instant Download
            </motion.span>
            <motion.span 
              variants={fadeIn}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded dark:bg-purple-900 dark:text-purple-300"
            >
              <ThumbsUp size={14} />
              Satisfaction Guaranteed
            </motion.span>
          </motion.div>

          {/* Short Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
             {product.description ? product.description.replace(/<[^>]*>/g, '').split('.')[0] + '.' : 'No description available.'} 
          </p>
          
          {/* --- Button Group Container --- */}
          <motion.div 
            className="flex flex-col items-center gap-y-4 mb-8"
            variants={fadeInUp}
          >
            {/* Gumroad Add to Cart button */} 
            {product.source === 'gumroad' && (
              <motion.div 
                className="w-full space-y-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
             <Button 
                onClick={handleAddToCart} 
                variant="default"
                size="lg" 
                  className="w-full add-to-cart-btn flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 shadow-md dark:shadow-purple-900/20"
            >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span> 
            </Button>
            
            {/* Buy Now button for direct checkout */}
            <Button 
                onClick={handleBuyNow} 
                variant="outline"
                size="lg" 
                className="w-full flex items-center justify-center space-x-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-200"
            >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                  <span>Buy Now</span> 
            </Button>
              </motion.div>
            )} 

            {/* Action Buttons (Wishlist/Share) */} 
            <div className="flex items-center justify-center space-x-4"> 
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  onClick={() => toggleWishlist(productId)} 
                  className="flex items-center space-x-2 transition-all duration-200"
                >
                  <Heart 
                    size={18} 
                    className={isProductWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-500 dark:text-gray-400'} 
                  />
                  <span className="text-gray-700 dark:text-gray-300">{isProductWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  onClick={handleShare} 
                  className="flex items-center space-x-2 transition-all duration-200"
                >
                  <Share size={18} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Share</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Variant Selection Area */} 
          <div className="mb-6">
            {/* Display the selected color preview */}
            {selectedColorValue && (
              <div className="mb-3 flex items-center gap-2">
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Color:</span>
                 <div 
                   className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                   style={{ backgroundColor: selectedColorValue }}
                   title={`Selected color preview: ${Object.keys(selectedOptions).includes('Color') ? selectedOptions['Color'] : ''}`}
                 >
                 </div>
              </div>
            )}
            
            {/* Render Variant Selectors - Removed Printful check */}
            {/* Assuming variants only exist for Printful (now removed) */}
            {/* If Gumroad can have variants displayed here, logic needs review */}
            {/* 
            {product.variants && product.variants.length > 0 && (
              <VariantSelector
                variants={product.variants}
                selectedOptions={selectedOptions}
                onOptionChange={handleOptionChange}
              />
            )}
            */}
          </div>
          
          {/* Quantity & Add to Cart (Only for Printful) - Removed entirely */}

          {/* Enhanced Accordion/Tabs for Details */}
          <motion.div 
            className="border-t pt-6 dark:border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex border-b mb-4 dark:border-gray-700 overflow-x-auto">
              {['description', 'details', 'reviews'].map(tab => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 capitalize font-medium transition-colors ${activeTab === tab ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {tab}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="prose prose-sm sm:prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
              >
              {activeTab === 'description' && (
                  <div>
                  {/* Display existing product description using dangerouslySetInnerHTML */}
                  <div dangerouslySetInnerHTML={{ __html: product.description || 'No description provided.' }} />
                  
                  {/* Append the new digital product description block */}
                    <div 
                      className="mt-6 pt-6 border-t dark:border-gray-600 space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                          <ImageIcon className="mr-2 text-purple-500" size={20} />
                          Product Details
                        </h3>
                        <ul className="mt-3 space-y-3">
                          <li 
                            className="flex items-start"
                          >
                            <CheckCircle2 className="mr-2 text-green-500 mt-1 flex-shrink-0" size={18} />
                            <span>Digital Poster, Printable Download</span>
                          </li>
                          <li 
                            className="flex items-start"
                          >
                            <CheckCircle2 className="mr-2 text-green-500 mt-1 flex-shrink-0" size={18} />
                            <span>High-Resolution Digital File – Crisp and detailed design in 300 DPI</span>
                          </li>
                          <li 
                            className="flex items-start"
                          >
                            <CheckCircle2 className="mr-2 text-green-500 mt-1 flex-shrink-0" size={18} />
                            <span>Instant Download – Get your file immediately after purchase via Gumroad, no waiting!</span>
                          </li>
                    </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                          <Zap className="mr-2 text-yellow-500" size={20} />
                          How It Works
                        </h3>
                        <ol className="mt-3 space-y-3">
                          <li 
                            className="flex items-start"
                          >
                            <div className="bg-purple-100 dark:bg-purple-900 h-6 w-6 rounded-full flex items-center justify-center text-purple-700 dark:text-purple-300 mr-3 mt-0.5 flex-shrink-0 font-semibold text-sm">1</div>
                            <span>Click the "Add to Cart" button and proceed to checkout</span>
                          </li>
                          <li 
                            className="flex items-start"
                          >
                            <div className="bg-purple-100 dark:bg-purple-900 h-6 w-6 rounded-full flex items-center justify-center text-purple-700 dark:text-purple-300 mr-3 mt-0.5 flex-shrink-0 font-semibold text-sm">2</div>
                            <span>Instantly download the file after payment</span>
                          </li>
                          <li 
                            className="flex items-start"
                          >
                            <div className="bg-purple-100 dark:bg-purple-900 h-6 w-6 rounded-full flex items-center justify-center text-purple-700 dark:text-purple-300 mr-3 mt-0.5 flex-shrink-0 font-semibold text-sm">3</div>
                            <span>Print at home or use a professional service</span>
                          </li>
                          <li 
                            className="flex items-start"
                          >
                            <div className="bg-purple-100 dark:bg-purple-900 h-6 w-6 rounded-full flex items-center justify-center text-purple-700 dark:text-purple-300 mr-3 mt-0.5 flex-shrink-0 font-semibold text-sm">4</div>
                            <span>Frame and enjoy your new wall art!</span>
                          </li>
                    </ol>
                  </div>

                      <div 
                        className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-r-md"
                      >
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 flex items-start">
                          <span className="mr-2 text-yellow-500 flex-shrink-0">⚠️</span>
                          <span>Please Note: This is a digital download only. No physical item will be shipped.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {activeTab === 'details' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-gray-500 dark:text-gray-400">File Type</dt>
                          <dd className="font-semibold sm:mt-1">PNG</dd>
                        </div>
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-gray-500 dark:text-gray-400">Resolution</dt>
                          <dd className="font-semibold sm:mt-1">3072 x 6144 px</dd>
                        </div>
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-gray-500 dark:text-gray-400">File Size</dt>
                          <dd className="font-semibold sm:mt-1">10 MB</dd>
                        </div>
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-gray-500 dark:text-gray-400">DPI</dt>
                          <dd className="font-semibold sm:mt-1">300</dd>
                        </div>
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-gray-500 dark:text-gray-400">Source</dt>
                          <dd className="font-semibold sm:mt-1">{product.source}</dd>
                        </div>
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-gray-500 dark:text-gray-400">Product Type</dt>
                          <dd className="font-semibold sm:mt-1">Digital Product</dd>
                        </div>
                      </dl>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Usage Rights</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 text-green-500 mt-1 flex-shrink-0" size={18} />
                        <span>Personal use</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 text-green-500 mt-1 flex-shrink-0" size={18} />
                        <span>Print for your home, office, or as a gift</span>
                      </li>
                      <li className="flex items-start text-gray-500 line-through">
                        <span className="mr-2 text-red-500 mt-1 flex-shrink-0">✕</span>
                        <span>Commercial reselling or redistribution</span>
                      </li>
                </ul>
                  </div>
              )}

              {activeTab === 'reviews' && (
                  <div 
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold">Customer Reviews</h3>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-400" />
                        <span>Write a Review</span>
                      </Button>
                    </div>

                    {/* Review Summary */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-5xl font-bold text-gray-900 dark:text-white">4.5</div>
                          <div className="flex mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={18} fill="currentColor" className={i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">Based on 120 reviews</div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map(rating => (
                              <div key={rating} className="flex items-center gap-2">
                                <div className="text-sm font-medium w-6">{rating}★</div>
                                <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-yellow-400" 
                                    style={{ width: rating === 5 ? '70%' : rating === 4 ? '20%' : '3%' }}
                                  />
                                </div>
                                <div className="text-sm text-gray-500 w-8">
                                  {rating === 5 ? '70%' : rating === 4 ? '20%' : '3%'}
                                </div>
                              </div>
                            ))}
                            </div>
                        </div>
                      </div>
                    </div>

                    {/* Review Entries */}
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map(review => (
                          <div 
                            key={review.id} 
                            className="border-b pb-6 dark:border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-800 dark:text-purple-200 font-semibold">
                                  {review.author.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800 dark:text-gray-200">{review.author}</div>
                                  <div className="text-xs text-gray-500">Verified Purchase</div>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">2 weeks ago</div>
                </div>
                            
                            <div className="flex items-center mb-3">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={16} fill="currentColor" className={i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                                ))}
            </div>
          </div>
                            
                            <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
                            
                            <div className="flex items-center gap-4 mt-3">
                              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                <ThumbsUp size={14} />
                                <span>Helpful (12)</span>
                              </button>
                              <button className="text-sm text-gray-500 hover:text-gray-700">Report</button>
                            </div>
                          </div>
                        ))}
                        
                        <Button variant="outline" className="w-full">Load More Reviews</Button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No reviews yet. Be the first to review this product!</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-400"
            variants={staggerChildren}
          >
            <motion.div 
              className="flex items-center space-x-2"
              variants={fadeInUp}
              whileHover={{ y: -3 }}
            >
                  <ShieldCheck size={20} className="text-green-500"/>
                  <span>Secure Checkout</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              variants={fadeInUp}
              whileHover={{ y: -3 }}
            >
                  <Zap size={20} className="text-blue-500"/>
              <span>Instant Download</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              variants={fadeInUp}
              whileHover={{ y: -3 }}
            >
                  <Package size={20} className="text-orange-500"/>
              <span>Satisfaction Guaranteed</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* FAQs Section */}
      <motion.div 
        className="mt-16 border-t pt-10 dark:border-gray-700"
        variants={fadeInUp}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            { 
              question: "What file format will I receive?", 
              answer: "You will receive a high-resolution PNG file that is ready to print or use digitally." 
            },
            { 
              question: "Can I print this at any size?", 
              answer: "Yes, the file is high-resolution (300 DPI) and can be printed in various sizes while maintaining quality. For best results, we recommend printing up to 24x36 inches." 
            },
            { 
              question: "Where can I print this poster?", 
              answer: "You can print it at home on a quality printer, or use services like Staples, Office Depot, Vistaprint, or local print shops." 
            },
            { 
              question: "Can I use this for commercial purposes?", 
              answer: "No, this digital poster is for personal use only. Commercial redistribution or reselling is not permitted." 
            }
          ].map((faq, index) => (
            <motion.div 
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              variants={fadeInUp}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4">
                  <span>{faq.question}</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronRight size={20} />
                  </span>
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.div 
          className="mt-16 border-t pt-10 dark:border-gray-700"
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => {
              return (
                <motion.div
                  key={relatedProduct.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 * index }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Need to import colorNameToHex from VariantSelector or redefine it here
// Consider removing if VariantSelector and color logic is fully removed
/*
const colorNameToHex: Record<string, string> = {
  "black": "#000000",
  "white": "#FFFFFF",
  "navy": "#000080",
  "red": "#FF0000",
  "royal blue": "#4169E1",
  "heather grey": "#B2BEB5",
  "dark heather": "#555555",
  "charcoal heather": "#36454F",
  "navy heather": "#2C3E50",
  "heather blue": "#A2A2D0",
  "dark heather grey": "#555555",
  "fraiche peche": "#FFDAB9",
  "cotton pink": "#FFB6C1",
  "lavender": "#E6E6FA",
}; 
*/ 