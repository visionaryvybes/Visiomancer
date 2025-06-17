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
    
    if (gumroadItems.length === 0) {
      toast.error('No items in cart to checkout.');
      return;
    }

    // If only one item in cart, use direct Gumroad link
    if (gumroadItems.length === 1) {
      const item = gumroadItems[0];
      const purchaseUrl = item.product.gumroadUrl;
      
      if (purchaseUrl) {
        const hasParams = purchaseUrl.includes('?');
        const connector = hasParams ? '&' : '?';
        const finalUrl = `${purchaseUrl}${connector}quantity=${item.quantity}`;
        
        toast.success('Redirecting to Gumroad checkout...', { duration: 3000 });
        window.open(finalUrl, '_blank');
        return;
      }
    }

    // For multiple items, show limitation and proceed with multiple tabs
    const totalItems = gumroadItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = gumroadItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const proceed = window.confirm(
      `Due to Gumroad's limitations, your ${gumroadItems.length} different products (${totalItems} items, $${totalPrice.toFixed(2)} total) will open in separate checkout pages.\n\nThis ensures each product quantity is correctly processed.\n\nProceed with checkout?`
    );
    
    if (!proceed) return;

    try {
      toast.loading('Opening checkout pages...', { id: 'checkout' });
      
      // Open each product in a separate tab with correct quantity
      gumroadItems.forEach((item, index) => {
        const purchaseUrl = item.product.gumroadUrl;
        
        if (purchaseUrl) {
          const hasParams = purchaseUrl.includes('?');
          const connector = hasParams ? '&' : '?';
          const finalUrl = `${purchaseUrl}${connector}quantity=${item.quantity}`;
          
          // Stagger tab opening to avoid popup blockers
          setTimeout(() => {
            window.open(finalUrl, '_blank');
          }, index * 800); // Increased delay for better UX
        }
      });
      
      toast.success(
        `Opened ${gumroadItems.length} checkout pages. Complete each purchase to get all your items.`, 
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