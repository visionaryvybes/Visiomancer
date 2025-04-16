"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Button from '@/components/ui/Button'
import { Trash2, Plus, Minus } from 'lucide-react' // Icons for controls
import { CartItem, ProductVariant, ProductVariantDetail, ProductSource } from '@/types' // Updated import path
import { toast } from 'react-hot-toast'

export default function CartPage() {
  const { 
    cartItems, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getGumroadItems, // Provided by context
    isCartLoaded 
  } = useCart()

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
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Your Shopping Cart</h1>
          <p className="text-center text-gray-500">Loading cart...</p>
        </div>
      </main>
    )
  }
  // --- End Loading State ---

  // Check for empty cart only AFTER loading is complete
  if (isCartLoaded && cartItems.length === 0) {
    console.log('[CartPage] Rendering empty cart state.');
    return (
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Your Shopping Cart</h1>
          <p className="text-center text-gray-500">Your cart is currently empty.</p>
        </div>
      </main>
    )
  }

  const total = getCartTotal();

  console.log('[CartPage] Rendering cart items.');

  const handleCheckout = async (source: ProductSource) => {
    // Simplified: Only handle Gumroad
    if (source === 'gumroad') {
      const gumroadItems = getGumroadItems(); // Get Gumroad items from context
      if (gumroadItems.length > 0) {
        toast('Redirecting to Gumroad for checkout...');
        window.open('https://gumroad.com/checkout', '_blank'); // Open generic checkout URL
      } else {
        toast.error('No Gumroad items in the cart to checkout.');
      }
      // Removed the forEach loop that opened individual product URLs
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-400 mb-4">Your cart is empty.</p>
          <Link href="/products" passHref>
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6">
          {/* Render all items (assuming only Gumroad now) */}
          <div className="mb-8">
            {/* Removed Gumroad specific title */}
            {/* <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 pb-2">Digital Products</h2> */} 
            {renderCartItems(cartItems)} 
          </div>

          {/* Cart Summary and Checkout */}
          <div className="border-t border-gray-700 pt-6 mt-8">
            <div className="flex justify-end items-center mb-4">
                <h2 className="text-2xl font-bold">Total: ${cartTotal.toFixed(2)}</h2>
            </div>
            
            {/* Delivery Note */} 
            <p className="text-xs text-gray-400 text-right mb-3">
              Delivery: Your files will be available to download via Gumroad once payment is confirmed. Check your email for the download link.
            </p>
            
            <div className="flex justify-end items-center gap-4">
              {/* Clear Cart Button */}
              <Button onClick={clearCart} variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-500/10 hover:text-red-400">
                Clear Cart
              </Button>
              {/* Checkout Button - Updated Text */}
              <Button onClick={() => handleCheckout('gumroad')} className="bg-pink-600 hover:bg-pink-700">
                 Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}