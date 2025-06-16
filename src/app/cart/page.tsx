"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useConversions } from '@/context/ConversionsContext'
import Button from '@/components/ui/Button'
import { Trash2, Plus, Minus } from 'lucide-react' // Icons for controls
import { CartItem, ProductVariant, ProductVariantDetail, ProductSource } from '@/types' // Updated import path
import { toast } from 'react-hot-toast'
import StoreLayout from "@/components/layout/StoreLayout"
import NextImage from 'next/image'

export default function CartPage() {
  const { 
    cartItems, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getGumroadItems, // Provided by context
    isCartLoaded,
    getItemCount
  } = useCart()
  
  const { trackCheckout } = useConversions()

  console.log('[CartPage] Render. isCartLoaded:', isCartLoaded, 'cartItems:', cartItems);

  // Check if there are Gumroad items using product.source safely
  const hasGumroadItems = cartItems.some(item => item && item.product && item.product.source === 'gumroad');

  const gumroadItems = getGumroadItems();
  const cartTotal = getCartTotal(); // Use the main total

  // Removed gumroadTotal constant (rely on cartTotal)

  // Function to get display details for a cart item - Corrected & Simplified
  const getItemDisplayDetails = (item: CartItem) => {
    let variantName = "";
    // Ensure item and product exist before accessing price
    let displayPrice = (item && item.product) ? item.product.price : 0;

    // Simplified variant name logic (assuming simple Gumroad variants)
    if (item && item.selectedOptions) {
      variantName = Object.entries(item.selectedOptions)
        .map(([, value]) => value)
        .join(' / ');
    } else if (item && item.selectedVariantId) {
      // Fallback if only ID is stored
      variantName = `Variant ID: ${item.selectedVariantId}`;
    }
    // Removed Printful-specific variant name and price logic
    return { variantName, displayPrice };
  }

  // --- Add Loading State --- 
  if (!isCartLoaded) {
    console.log('[CartPage] Rendering loading state.');
    return (
      <StoreLayout>
        <main className="flex-1 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl py-16">
            <div className="text-center">
              <div className="mb-8">
                <NextImage 
                  src="/images/logo.png" 
                  alt="Visiomancer Logo" 
                  width={120} 
                  height={120} 
                  className="mx-auto object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                Shopping Cart
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
                {getItemCount() > 0 ? `You have ${getItemCount()} item(s) in your cart` : 'Your cart is empty'}
              </p>
            </div>
          </div>
        </main>
      </StoreLayout>
    )
  }
  // --- End Loading State ---

  // Check for empty cart only AFTER loading is complete
  if (isCartLoaded && cartItems.length === 0) {
    console.log('[CartPage] Rendering empty cart state.');
    return (
      <StoreLayout>
        <main className="flex-1 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl py-16">
            <div className="text-center">
              <div className="mb-8">
                <NextImage 
                  src="/images/logo.png" 
                  alt="Visiomancer Logo" 
                  width={120} 
                  height={120} 
                  className="mx-auto object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                Shopping Cart
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
                Your cart is empty. Start shopping to add items to your cart!
              </p>
            </div>
          </div>
        </main>
      </StoreLayout>
    )
  }

  const total = getCartTotal();

  console.log('[CartPage] Rendering cart items.');

  const handleCheckout = async () => {
    const gumroadItems = getGumroadItems();
    if (gumroadItems.length === 0) {
      toast.error('No items in cart to checkout.');
      return;
    }

    try {
      toast.loading('Preparing checkout...', { id: 'checkout' });
      
      // Track conversion event
      const productIds = gumroadItems.map(item => item.product.id);
      const totalValue = getCartTotal();
      trackCheckout(productIds, totalValue, 'USD', gumroadItems.length);
      
      // For Gumroad, we'll open each product in Gumroad's purchase page
      // If there's only one product, open it directly
      if (gumroadItems.length === 1) {
        const item = gumroadItems[0];
        const purchaseUrl = item.product.gumroadUrl;
        if (purchaseUrl) {
          toast.success('Redirecting to Gumroad...', { id: 'checkout' });
          window.open(purchaseUrl, '_blank');
        } else {
          toast.error('Product purchase link not available.', { id: 'checkout' });
        }
      } else {
        // Multiple products - inform user and open each product page
        toast.success(`Opening ${gumroadItems.length} product pages...`, { id: 'checkout' });
        gumroadItems.forEach((item, index) => {
          const purchaseUrl = item.product.gumroadUrl;
          if (purchaseUrl) {
            // Small delay between opening windows to prevent popup blocker issues
            setTimeout(() => {
              window.open(purchaseUrl, '_blank');
            }, index * 500);
          }
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate checkout. Please try again.', { id: 'checkout' });
    }
  };

  // Function to get the specific price for a selected variant if available - Corrected
  const getVariantPrice = (item: CartItem): number => {
    // Ensure item and product exist
    if (!item || !item.product) {
      return 0; // Or handle error appropriately
    }
    
    // Use product's base price as Gumroad variant pricing isn't handled here yet
    let price = item.product.price;

    // Add logic here if Gumroad variants affect price and details are available in item.product.variantDetails
    // Example structure (needs actual data mapping):
    /*
    if (item.selectedOptions && item.product.variantDetails) {
      const optionKey = Object.entries(item.selectedOptions)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([, value]) => value)
        .join('_');
      const variantDetail = item.product.variantDetails.find(
        (detail) => detail.optionKey === optionKey,
      );
      if (variantDetail) {
        price = variantDetail.price;
      }
    }
    */

    return price;
  };

  const renderCartItems = (items: CartItem[]) => {
    if (items.length === 0) {
      // If filtering by source, might return specific message
      // return <p className="text-gray-400 italic">No items from this source.</p>;
      return null; // Or let the main empty cart logic handle it
    }
    return items.map((item) => {
      // Safety Check 
      if (!item || !item.product) {
        console.error("Skipping rendering cart item due to missing data:", item);
        return null; 
      }

      const itemPrice = getVariantPrice(item); // Use base price for now
      const { variantName } = getItemDisplayDetails(item); 

      return (
        // Use flex-col on small screens, md:flex-row on medium+ 
        // Adjust alignment and gaps for different screen sizes
        <div 
          key={`${item.product.id}-${item.selectedVariantId || 'base'}`} 
          className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-700 last:border-b-0 gap-4 md:gap-0"
        >
          {/* Item Details (Image, Name, Variant) */}
          <div className="flex items-center gap-4 flex-grow">
            <Image 
              src={item.product.images?.[0]?.url || '/placeholder.png'} 
              alt={item.product.name} 
              width={64} // Slightly larger image
              height={64} 
              className="rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-grow">
              <Link href={`/products/${item.product.id}`} className="font-semibold hover:text-purple-400">
                {item.product.name}
              </Link>
              {variantName && (
                <p className="text-sm text-gray-400">{variantName}</p>
              )}
              {/* Removed Source display as it's always gumroad now */}
              {/* <p className="text-sm text-gray-500">Source: {item.product.source}</p> */}
            </div>
          </div>
          {/* Controls (Quantity, Price, Remove) */}
          <div className="flex items-center justify-end md:justify-normal gap-4 flex-shrink-0">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2 border border-gray-600 rounded-md p-1">
              <button 
                onClick={() => updateQuantity(item.product.id, item.selectedVariantId, item.quantity - 1)} 
                disabled={item.quantity <= 1}
                className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 rounded"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center" aria-live="polite">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.product.id, item.selectedVariantId, item.quantity + 1)} 
                className="p-1 hover:bg-gray-700 rounded"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            {/* Price */}
            <span className="font-medium w-20 text-right">
              ${(itemPrice * item.quantity).toFixed(2)}
            </span>
            {/* Remove Button */}
            <button 
              onClick={() => removeItem(item.product.id, item.selectedVariantId)} 
              className="text-red-500 hover:text-red-400" 
              aria-label={`Remove ${item.product.name} from cart`}
             >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      );
    });
  };

  // Restore main page structure
  return (
    <StoreLayout>
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-16">
          <div className="text-center">
            <div className="mb-8">
              <NextImage 
                src="/images/logo.png" 
                alt="Visiomancer Logo" 
                width={120} 
                height={120} 
                className="mx-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
              Shopping Cart
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
              {getItemCount() > 0 ? `You have ${getItemCount()} item(s) in your cart` : 'Your cart is empty'}
            </p>
            
            {cartItems.length > 0 ? (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
                <div className="space-y-4">
                  {renderCartItems(cartItems)}
                  <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        Total: ${total.toFixed(2)}
                      </p>
                      <Button 
                        onClick={clearCart}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Clear Cart
                      </Button>
                    </div>
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
                      size="lg"
                    >
                      Checkout on Gumroad
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      You'll be redirected to Gumroad to complete your purchase
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                <p className="text-gray-600 dark:text-gray-300 font-base">
                  Your cart is empty. Start shopping to add items to your cart!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </StoreLayout>
  )
}