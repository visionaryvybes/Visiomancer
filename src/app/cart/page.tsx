"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useConversions } from '@/context/ConversionsContext'
import Button from '@/components/ui/Button'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock, Mail } from 'lucide-react'
import { CartItem } from '@/types'
import { toast } from 'react-hot-toast'
import StoreLayout from "@/components/layout/StoreLayout"
import NextImage from 'next/image'

export default function CartPage() {
  const { 
    cartItems, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getCartTotal, 
    getGumroadItems,
    isCartLoaded,
    getItemCount
  } = useCart();

  const { trackCheckout, getUserEmail, setUserEmail } = useConversions();
  const [email, setEmail] = useState('');

  const handleEmailSave = () => {
    if (email && email.includes('@')) {
      setUserEmail(email);
      toast.success('Email saved for order tracking');
    }
  };

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

  const handleCheckout = async () => {
    const gumroadItems = getGumroadItems();
    const userEmail = getUserEmail();
    
    if (gumroadItems.length === 0) {
      toast.error('No items in cart to checkout.');
      return;
    }

    // Track Pinterest conversion event
    const productIds = gumroadItems.map(item => item.product.id);
    const totalValue = gumroadItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const totalItemsCount = gumroadItems.reduce((sum, item) => sum + item.quantity, 0);
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    trackCheckout(productIds, totalValue, 'USD', totalItemsCount, userEmail || undefined, orderId);

    // Create checkout URLs for all items
    const checkoutUrls = gumroadItems.map(item => {
      if (!item.product.gumroadUrl) return null;
      return {
        url: buildGumroadCheckoutUrl(item.product.gumroadUrl, item.quantity),
        name: item.product.name
      };
    }).filter(Boolean);

    if (checkoutUrls.length === 0) {
      toast.error('No checkout URLs available.');
      return;
    }

    console.log('[Checkout] Opening URLs:', checkoutUrls);

    // Open all checkout URLs
    if (checkoutUrls.length === 1) {
      // Single item
      toast.success('Redirecting to Gumroad checkout...', { duration: 3000 });
      window.open(checkoutUrls[0].url, '_blank');
    } else {
      // Multiple items - open with delays
      toast.success(`Opening ${checkoutUrls.length} checkout pages...`, { duration: 3000 });
      
      checkoutUrls.forEach((item, index) => {
        setTimeout(() => {
          console.log(`[Checkout] Opening ${item.name}:`, item.url);
          window.open(item.url, '_blank');
        }, index * 800);
      });
    }
  };

  if (!isCartLoaded) {
    return (
      <StoreLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your cart...</p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <StoreLayout>
        <main className="flex-1">
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-600" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">Looks like you haven't added anything yet</p>
            <Link href="/products">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Continue Shopping
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </main>
      </StoreLayout>
    );
  }

  const total = getCartTotal();

  return (
    <StoreLayout>
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
            <p className="text-gray-400">
              {getItemCount()} item{getItemCount() > 1 ? 's' : ''} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    if (!item || !item.product) return null;
                    const itemPrice = item.product.price;

                    return (
                      <div 
                        key={`${item.product.id}-${item.selectedVariantId || 'base'}`} 
                        className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <Link href={`/products/${encodeURIComponent(item.product.id)}`}>
                            <Image 
                              src={item.product.images?.[0]?.url || '/placeholder.png'} 
                              alt={item.product.name} 
                              width={120} 
                              height={0}
                              priority={index === 0}
                              style={{ width: '120px', height: 'auto' }}
                              className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            />
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1">
                            <Link 
                              href={`/products/${encodeURIComponent(item.product.id)}`} 
                              className="text-lg font-semibold text-white hover:text-purple-400 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            
                            <div className="mt-2 flex items-center gap-4">
                              <p className="text-2xl font-bold text-white">
                                ${itemPrice.toFixed(2)}
                              </p>
                              <span className="text-gray-500">×</span>
                              
                              {/* Quantity Selector */}
                              <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                                <button 
                                  onClick={() => updateQuantity(item.product.id, item.selectedVariantId, item.quantity - 1)} 
                                  disabled={item.quantity <= 1} 
                                  className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.product.id, item.selectedVariantId, item.quantity + 1)} 
                                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <p className="text-lg font-semibold text-purple-400">
                                Subtotal: ${(itemPrice * item.quantity).toFixed(2)}
                              </p>
                              
                              <button 
                                onClick={() => removeItem(item.product.id, item.selectedVariantId)} 
                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Clear Cart */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700 sticky top-4">
                <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                
                {/* Email Collection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail size={16} className="inline mr-1" />
                    Email for order tracking
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                    />
                    <button
                      onClick={handleEmailSave}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Processing</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="pt-3 border-t border-gray-700">
                    <div className="flex justify-between text-xl font-semibold text-white">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout} 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} className="ml-2" />
                </Button>

                {/* Security Info */}
                <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                  <Lock size={14} className="mr-1" />
                  Secure checkout powered by Gumroad
                </div>

                {/* Continue Shopping */}
                <Link href="/products">
                  <button className="mt-4 w-full text-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                    ← Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
}