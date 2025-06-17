"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
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

  const handleCheckout = async () => {
    const gumroadItems = getGumroadItems();
    
    console.log('[DEBUG] Cart checkout - gumroadItems:', gumroadItems);
    console.log('[DEBUG] Cart checkout - gumroadItems.length:', gumroadItems.length);
    console.log('[DEBUG] Cart checkout - cartItems.length:', cartItems.length);
    
    if (gumroadItems.length === 0) {
      toast.error('No items in cart to checkout.');
      return;
    }

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

    // Create a modal with checkout options
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
      background: white;
      border-radius: 12px;
      padding: 32px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      color: #333;
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
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px; color: #111; font-size: 24px; font-weight: 600;">Complete Your Purchase</h2>
        <p style="margin: 0; color: #666; font-size: 16px;">
          ${gumroadItems.length} products • ${totalItems} items • $${totalPrice.toFixed(2)} total
        </p>
      </div>

      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px; color: #333; font-size: 18px;">📝 Your Items:</h3>
        ${checkoutUrls.map((item, i) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: ${i < checkoutUrls.length - 1 ? '1px solid #e9ecef' : 'none'};">
            <div>
              <div style="font-weight: 500; color: #333;">${item.name}</div>
              <div style="color: #666; font-size: 14px;">${item.quantity} × $${item.price.toFixed(2)}</div>
            </div>
            <div style="font-weight: 600; color: #333;">$${item.total}</div>
          </div>
        `).join('')}
      </div>

      <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px; color: #856404; font-size: 16px;">⚠️ Gumroad Limitation</h4>
        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.4;">
          Gumroad doesn't support multi-product checkout via external sites. You'll need to complete separate purchases for each product.
        </p>
      </div>

      <div style="margin-bottom: 32px;">
        <h3 style="margin: 0 0 16px; color: #333; font-size: 18px;">Choose Your Checkout Method:</h3>
        
        <button id="open-all-tabs" style="
          width: 100%;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 12px;
          transition: background 0.2s;
        " onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='#6366f1'">
          🚀 Open All Checkout Pages (${gumroadItems.length} tabs)
        </button>

        <button id="manual-links" style="
          width: 100%;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 12px;
          transition: background 0.2s;
        " onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
          📋 Show Manual Links (Popup-Safe)
        </button>
      </div>

      <div id="manual-links-section" style="display: none; margin-bottom: 24px;">
        <h4 style="margin: 0 0 16px; color: #333; font-size: 16px;">Click each link to complete your purchases:</h4>
        ${checkoutUrls.map((item, i) => `
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="
            display: block;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            text-decoration: none;
            color: #333;
            transition: all 0.2s;
          " onmouseover="this.style.background='#e9ecef'; this.style.borderColor='#6366f1';" onmouseout="this.style.background='#f8f9fa'; this.style.borderColor='#e9ecef';">
            <div style="font-weight: 600; margin-bottom: 4px;">${i + 1}. ${item.name}</div>
            <div style="color: #666; font-size: 14px;">${item.quantity} items • $${item.total}</div>
          </a>
        `).join('')}
      </div>

      <button id="close-modal" style="
        width: 100%;
        background: #6b7280;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s;
      " onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
        Close
      </button>
    `;

    checkoutModal.appendChild(modalContent);
    document.body.appendChild(checkoutModal);

    // Add event listeners
    const openAllBtn = modalContent.querySelector('#open-all-tabs');
    const manualLinksBtn = modalContent.querySelector('#manual-links');
    const manualLinksSection = modalContent.querySelector('#manual-links-section');
    const closeBtn = modalContent.querySelector('#close-modal');

    openAllBtn?.addEventListener('click', () => {
      console.log('[DEBUG] User chose to open all tabs');
      
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

      toast.success(`Opening ${gumroadItems.length} checkout pages. Check for popup notifications!`, { duration: 8000 });
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

    toast.success('Checkout options ready!', { duration: 3000 });
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
              <div className="text-xs text-gray-400 mt-2 text-center space-y-1">
                {cartItems.length > 1 ? (
                  <>
                    <p>⚠️ Multiple products will open separate checkout pages due to Gumroad limitations.</p>
                    <p className="text-yellow-400 font-medium">Complete each purchase to receive all your items.</p>
                  </>
                ) : (
                  <p>This will redirect you to secure Gumroad checkout.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
}