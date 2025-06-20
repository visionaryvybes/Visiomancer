"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useConversions } from '@/context/ConversionsContext'
import Button from '@/components/ui/Button'
import { Trash2, Plus, Minus } from 'lucide-react'
import { CartItem } from '@/types'
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
    getGumroadItems,
    isCartLoaded,
    getItemCount
  } = useCart();

  const { trackCheckout, getUserEmail } = useConversions();

  const handleCheckout = async () => {
    const gumroadItems = getGumroadItems();
    const userEmail = getUserEmail();
    
    console.log('[DEBUG] Cart checkout - gumroadItems:', gumroadItems);
    console.log('[DEBUG] Cart checkout - gumroadItems.length:', gumroadItems.length);
    console.log('[DEBUG] Cart checkout - cartItems.length:', cartItems.length);
    console.log('[DEBUG] Cart checkout - userEmail:', userEmail ? 'provided' : 'not provided');
    
    if (gumroadItems.length === 0) {
      toast.error('No items in cart to checkout.');
      return;
    }

    // Track Pinterest conversion event with email if available
    const productIds = gumroadItems.map(item => item.product.id);
    const totalValue = gumroadItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const totalItemsCount = gumroadItems.reduce((sum, item) => sum + item.quantity, 0);
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    trackCheckout(productIds, totalValue, 'USD', totalItemsCount, userEmail || undefined, orderId);

    // If only one item in cart, use direct Gumroad link
    if (gumroadItems.length === 1) {
      console.log('[DEBUG] Single item checkout path');
      const item = gumroadItems[0];
      const purchaseUrl = item.product.gumroadUrl;
      
      if (purchaseUrl) {
        const hasParams = purchaseUrl.includes('?');
        const connector = hasParams ? '&' : '?';
        const finalUrl = `${purchaseUrl}${connector}quantity=${item.quantity}`;
        
        console.log('[DEBUG] Opening single item URL:', finalUrl);
        toast.success('Redirecting to Gumroad checkout...', { duration: 3000 });
        
        // Use dynamic anchor method instead of window.open
        const anchor = document.createElement('a');
        anchor.href = finalUrl;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        return;
      }
    }

    // For multiple items, show better options
    console.log('[DEBUG] Multiple items checkout path');
    const totalItems = gumroadItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = gumroadItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    console.log('[DEBUG] Multiple items details:', {
      totalItems,
      totalPrice,
      itemCount: gumroadItems.length
    });

    // Create a beautiful professional checkout modal
    const checkoutModal = document.createElement('div');
    checkoutModal.id = 'checkout-modal';
    checkoutModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 0;
      max-width: 500px;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
      color: white;
      position: relative;
    `;

    const checkoutUrls = gumroadItems.map(item => {
      const hasParams = item.product.gumroadUrl?.includes('?');
      const connector = hasParams ? '&' : '?';
      return {
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: (item.product.price * item.quantity).toFixed(2),
        url: `${item.product.gumroadUrl}${connector}quantity=${item.quantity}`
      };
    });

    modalContent.innerHTML = `
      <!-- Header -->
      <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 24px; text-align: center; position: relative;">
        <button id="close-modal" style="
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.2s;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
          ×
        </button>
        
        <div style="margin-bottom: 8px;">
          <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 24px;">
            🛒
          </div>
        </div>
        <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 600;">Secure Checkout</h2>
        <p style="margin: 0; opacity: 0.9; font-size: 16px;">
          ${gumroadItems.length} product${gumroadItems.length > 1 ? 's' : ''} • ${totalItems} item${totalItems > 1 ? 's' : ''} • $${totalPrice.toFixed(2)} total
        </p>
      </div>

      <!-- Content -->
      <div style="padding: 24px; max-height: 400px; overflow-y: auto;">
        <!-- Order Summary -->
        <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 16px; font-size: 18px; opacity: 0.9;">📋 Order Summary</h3>
          ${checkoutUrls.map((item, i) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; ${i < checkoutUrls.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.1);' : ''}">
              <div>
                <div style="font-weight: 500; margin-bottom: 4px;">${item.name}</div>
                <div style="opacity: 0.7; font-size: 14px;">${item.quantity} × $${item.price.toFixed(2)}</div>
              </div>
              <div style="font-weight: 600; font-size: 16px;">$${item.total}</div>
            </div>
          `).join('')}
        </div>

        <!-- Checkout Options -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 16px; font-size: 18px; opacity: 0.9;">🚀 Choose Your Checkout Method</h3>
          
          <button id="quick-checkout" style="
            width: 100%;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 12px;
            padding: 16px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 12px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          " onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='translateY(0)'">
            ⚡ Quick Checkout (Recommended)
          </button>

          <button id="manual-links" style="
            width: 100%;
            background: transparent;
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 12px;
            padding: 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          " onmouseover="this.style.borderColor='rgba(255,255,255,0.6)'; this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.background='transparent'">
            📋 View Individual Links
          </button>
        </div>

        <!-- Manual Links Section (Hidden by default) -->
        <div id="manual-links-section" style="display: none; margin-bottom: 20px;">
          <h4 style="margin: 0 0 16px; font-size: 16px; opacity: 0.9;">Complete your purchases:</h4>
          ${checkoutUrls.map((item, i) => `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="
              display: block;
              background: rgba(255,255,255,0.1);
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 10px;
              padding: 16px;
              margin-bottom: 8px;
              text-decoration: none;
              color: white;
              transition: all 0.2s;
            " onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateX(0)'">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; margin-bottom: 4px;">${i + 1}. ${item.name}</div>
                  <div style="opacity: 0.7; font-size: 14px;">${item.quantity} item${item.quantity > 1 ? 's' : ''} • $${item.total}</div>
                </div>
                <div style="opacity: 0.7; font-size: 20px;">→</div>
              </div>
            </a>
          `).join('')}
        </div>

        <!-- Security Badge -->
        <div style="text-align: center; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-top: 20px;">
          <div style="opacity: 0.7; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            🔒 Secure checkout powered by Gumroad
          </div>
        </div>
      </div>
    `;

    checkoutModal.appendChild(modalContent);
    document.body.appendChild(checkoutModal);

    // Add event listeners
    const quickCheckoutBtn = modalContent.querySelector('#quick-checkout');
    const manualLinksBtn = modalContent.querySelector('#manual-links');
    const manualLinksSection = modalContent.querySelector('#manual-links-section');
    const closeBtn = modalContent.querySelector('#close-modal');

    quickCheckoutBtn?.addEventListener('click', () => {
      console.log('[DEBUG] User chose quick checkout');
      
      // Helper function to open URL reliably
      const openUrlReliably = (url: string, index: number) => {
        console.log(`[DEBUG] Attempting to open tab ${index + 1}:`, url);
        
        // Method 1: Try window.open first
        const newWindow = window.open(url, `_blank_${index}`, 'noopener,noreferrer');
        
        // Check if window.open was blocked
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          console.log(`[DEBUG] window.open blocked for tab ${index + 1}, using anchor method`);
          
          // Method 2: Fallback to dynamic anchor (more reliable)
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
          anchor.style.display = 'none'; // Hide anchor
          document.body.appendChild(anchor);
          
          // Simulate click event with ctrl key to help bypass blockers
          const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            ctrlKey: true // Ctrl+click helps bypass popup blockers
          });
          
          anchor.dispatchEvent(clickEvent);
          document.body.removeChild(anchor);
          
          console.log(`[DEBUG] Anchor method used for tab ${index + 1}`);
          return false; // Indicates fallback was used
        } else {
          console.log(`[DEBUG] window.open succeeded for tab ${index + 1}`);
          return true; // Indicates window.open worked
        }
      };
      
      // Open first tab immediately (best chance to succeed)
      if (checkoutUrls.length > 0) {
        openUrlReliably(checkoutUrls[0].url, 0);
      }
      
      // Open remaining tabs with staggered timing
      checkoutUrls.slice(1).forEach((item, index) => {
        const actualIndex = index + 1; // Adjust for slice
        console.log(`[DEBUG] Scheduling tab ${actualIndex + 1} for ${actualIndex * 800}ms delay`);
        
        setTimeout(() => {
          openUrlReliably(item.url, actualIndex);
        }, actualIndex * 800); // 800ms delay between subsequent tabs
      });

      toast.success(`Opening checkout pages for your ${gumroadItems.length} product${gumroadItems.length > 1 ? 's' : ''}!`, { duration: 6000 });
      document.body.removeChild(checkoutModal);
    });

    manualLinksBtn?.addEventListener('click', () => {
      console.log('[DEBUG] User chose manual links');
      if (manualLinksSection) {
        (manualLinksSection as HTMLElement).style.display = 'block';
        (manualLinksBtn as HTMLElement).style.display = 'none';
      }
    });

    closeBtn?.addEventListener('click', () => {
      document.body.removeChild(checkoutModal);
    });

    // Close modal when clicking outside
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) {
        document.body.removeChild(checkoutModal);
      }
    });

    toast.success('Ready to checkout!', { duration: 2000 });
  };

  if (!isCartLoaded) {
    return (
      <StoreLayout>
        <div className="text-center py-20">Loading your cart...</div>
      </StoreLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <StoreLayout>
        <main className="flex-1">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        </main>
      </StoreLayout>
    );
  }

  const total = getCartTotal();

  const renderCartItems = () => {
    return cartItems.map((item) => {
      if (!item || !item.product) return null;
      const itemPrice = item.product.price;

      return (
        <div 
          key={`${item.product.id}-${item.selectedVariantId || 'base'}`} 
          className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-700 last:border-b-0 gap-4"
        >
          <div className="flex items-center gap-4 flex-grow">
            <Image 
              src={item.product.images?.[0]?.url || '/placeholder.png'} 
              alt={item.product.name} 
              width={64} height={64} 
              className="rounded-lg object-cover"
            />
            <div>
              <Link href={`/products/${encodeURIComponent(item.product.id)}`} className="font-semibold hover:text-purple-400">
                {item.product.name}
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-end md:justify-normal gap-4 flex-shrink-0">
            <div className="flex items-center gap-2 border border-gray-600 rounded-md p-1">
              <button onClick={() => updateQuantity(item.product.id, item.selectedVariantId, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1 disabled:opacity-50 hover:bg-gray-700 rounded">
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.selectedVariantId, item.quantity + 1)} className="p-1 hover:bg-gray-700 rounded">
                <Plus size={16} />
              </button>
            </div>
            <span className="font-medium w-20 text-right">
              ${(itemPrice * item.quantity).toFixed(2)}
            </span>
            <button onClick={() => removeItem(item.product.id, item.selectedVariantId)} className="text-red-500 hover:text-red-400">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <StoreLayout>
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-16">
          <div className="text-center">
            <div className="mb-8">
              <NextImage src="/logo visiomancer.png" alt="Visiomancer Logo" width={120} height={120} className="mx-auto" priority />
            </div>
            <h1 className="text-4xl font-bold dark:text-white mb-4">Shopping Cart</h1>
            <p className="text-lg text-gray-300 mb-8">
              You have {getItemCount()} item(s) in your cart.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              {renderCartItems()}
            </div>
            <div className="pt-4 mt-4 border-t border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
                <Button onClick={clearCart} variant="outline" className="border-red-600 text-red-600 hover:bg-red-900/20">
                  Clear Cart
                </Button>
              </div>
              <Button onClick={handleCheckout} size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                Checkout on Gumroad
              </Button>
              <div className="text-xs text-gray-400 mt-2 text-center">
                <p>🔒 Secure checkout powered by Gumroad</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
}