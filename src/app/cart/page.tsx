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
        window.open(finalUrl, '_blank');
        return;
      }
    }

    // For multiple items, show limitation and proceed with multiple tabs
    console.log('[DEBUG] Multiple items checkout path');
    const totalItems = gumroadItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = gumroadItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    console.log('[DEBUG] Multiple items details:', {
      totalItems,
      totalPrice,
      itemCount: gumroadItems.length
    });
    
    const proceed = window.confirm(
      `Due to Gumroad's limitations, your ${gumroadItems.length} different products (${totalItems} items, $${totalPrice.toFixed(2)} total) will open in separate checkout pages.\n\nThis ensures each product quantity is correctly processed.\n\nProceed with checkout?`
    );
    
    if (!proceed) {
      console.log('[DEBUG] User cancelled checkout');
      return;
    }

    try {
      toast.loading('Opening checkout pages...', { id: 'checkout' });
      
      console.log('[DEBUG] About to open', gumroadItems.length, 'tabs');
      
      // Try to open the first tab immediately (better chance to bypass popup blockers)
      const firstItem = gumroadItems[0];
      if (firstItem?.product.gumroadUrl) {
        const hasParams = firstItem.product.gumroadUrl.includes('?');
        const connector = hasParams ? '&' : '?';
        const firstUrl = `${firstItem.product.gumroadUrl}${connector}quantity=${firstItem.quantity}`;
        
        console.log('[DEBUG] Opening first tab immediately:', firstUrl);
        const firstTab = window.open(firstUrl, '_blank');
        
        if (!firstTab) {
          console.log('[DEBUG] First tab was blocked - showing manual links');
          // If popup blocked, show manual links
          const urls = gumroadItems.map(item => {
            const hasParams = item.product.gumroadUrl?.includes('?');
            const connector = hasParams ? '&' : '?';
            return {
              name: item.product.name,
              quantity: item.quantity,
              url: `${item.product.gumroadUrl}${connector}quantity=${item.quantity}`
            };
          });
          
          toast.error('Popup blocked! Please manually open these links:', { id: 'checkout', duration: 10000 });
          
          // Create a temporary div with clickable links
          const linkDiv = document.createElement('div');
          linkDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;color:black;padding:20px;border:2px solid black;z-index:9999;max-width:500px;';
          linkDiv.innerHTML = `
            <h3>Complete Your Checkout</h3>
            <p>Click each link to complete your purchase:</p>
            ${urls.map((item, i) => `
              <p><a href="${item.url}" target="_blank" style="color:blue;text-decoration:underline;">
                ${i + 1}. ${item.name} (${item.quantity} items)
              </a></p>
            `).join('')}
            <button onclick="this.parentElement.remove()" style="margin-top:10px;padding:5px 10px;">Close</button>
          `;
          document.body.appendChild(linkDiv);
          return;
        }
      }
      
      // Open remaining tabs with delays
      for (let i = 1; i < gumroadItems.length; i++) {
        const item = gumroadItems[i];
        const purchaseUrl = item.product.gumroadUrl;
        
        console.log(`[DEBUG] Processing item ${i + 1}/${gumroadItems.length}:`, {
          name: item.product.name,
          quantity: item.quantity,
          url: purchaseUrl
        });
        
        if (purchaseUrl) {
          const hasParams = purchaseUrl.includes('?');
          const connector = hasParams ? '&' : '?';
          const finalUrl = `${purchaseUrl}${connector}quantity=${item.quantity}`;
          
          console.log(`[DEBUG] Will open tab ${i + 1} after ${i * 1000}ms delay:`, finalUrl);
          
          // Stagger remaining tabs with longer delays
          setTimeout(() => {
            console.log(`[DEBUG] Opening tab ${i + 1}:`, finalUrl);
            const tab = window.open(finalUrl, '_blank');
            if (!tab) {
              console.log(`[DEBUG] Tab ${i + 1} was blocked`);
              toast.error(`Tab ${i + 1} blocked. Please manually open: ${item.product.name}`, { duration: 5000 });
            }
          }, i * 1000); // 1 second delay between tabs
        } else {
          console.log(`[DEBUG] No URL for item ${i + 1}:`, item.product.name);
        }
      }
      
      toast.success(
        `Opening ${gumroadItems.length} checkout pages. Complete each purchase to get all your items.`, 
        { 
          id: 'checkout', 
          duration: 8000 
        }
      );
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to open checkout pages.', { id: 'checkout' });
    }
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