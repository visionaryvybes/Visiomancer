'use client';

import React, { useState, useEffect } from 'react';
import { CartItem } from '@/types';
import { X, ShoppingCart, Lock, CreditCard, ChevronRight, Package, Info } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useConversions } from '@/context/ConversionsContext';
import { buildGumroadCheckoutUrl } from '@/lib/gumroad-utils';

interface CheckoutModalProps {
  cartItems: CartItem[];
  onClose: () => void;
  userEmail?: string;
}

export default function CheckoutModal({ cartItems, onClose, userEmail }: CheckoutModalProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'options'>('summary');
  const [email, setEmail] = useState(userEmail || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const { setUserEmail } = useConversions();

  const totalValue = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle email submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setUserEmail(email);
      toast.success('Email saved for order tracking');
    }
  };

  // Quick checkout - opens all items in tabs
  const handleQuickCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Save email if provided
      if (email && email.includes('@')) {
        setUserEmail(email);
      }

      // Create checkout URLs
      const checkoutUrls = cartItems.map(item => {
        const baseUrl = item.product.gumroadUrl;
        if (!baseUrl) return null;
        
        return {
          url: buildGumroadCheckoutUrl(baseUrl, item.quantity),
          name: item.product.name
        };
      }).filter(Boolean);

      // Debug: Log all URLs being opened
      console.log('[CheckoutModal] Opening URLs:', checkoutUrls.map(item => ({ name: item.name, url: item.url })));

      // Open first URL immediately
      if (checkoutUrls[0]) {
        console.log(`[CheckoutModal] Opening first URL for ${checkoutUrls[0].name}:`, checkoutUrls[0].url);
        window.open(checkoutUrls[0].url, '_blank');
      }

      // Open remaining URLs with delay
      checkoutUrls.slice(1).forEach((item, index) => {
        setTimeout(() => {
          console.log(`[CheckoutModal] Opening delayed URL for ${item.name}:`, item.url);
          window.open(item.url, '_blank');
        }, (index + 1) * 800);
      });

      toast.success(`Opening ${checkoutUrls.length} checkout page${checkoutUrls.length > 1 ? 's' : ''}...`);
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to open checkout pages');
    } finally {
      setIsProcessing(false);
    }
  };

  // Create bundle (future implementation)
  const handleCreateBundle = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/checkout/create-bundle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItems)
      });

      const data = await response.json();
      
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
        toast.success('Opening bundle checkout...');
        setTimeout(() => onClose(), 2000);
      } else {
        toast.error(data.warning || 'Bundle creation not available');
      }
    } catch (error) {
      console.error('Bundle creation error:', error);
      toast.error('Failed to create bundle');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Secure Checkout</h2>
              <p className="text-purple-100">
                {cartItems.length} product{cartItems.length > 1 ? 's' : ''} • 
                {totalItems} item{totalItems > 1 ? 's' : ''} • 
                ${totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 px-6 font-medium transition-colors ${
              activeTab === 'summary' 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Order Summary
          </button>
          <button
            onClick={() => setActiveTab('options')}
            className={`flex-1 py-3 px-6 font-medium transition-colors ${
              activeTab === 'options' 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Checkout Options
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeTab === 'summary' ? (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div 
                  key={`${item.product.id}-${index}`}
                  className="flex gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                >
                  {item.product.images?.[0] && (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.product.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-purple-400">
                    ${totalValue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Email Collection */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-300 mb-1 block">
                    Email for order updates (optional)
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </label>
              </form>

              {/* Checkout Options */}
              <div className="space-y-3">
                <button
                  onClick={handleQuickCheckout}
                  disabled={isProcessing}
                  className="w-full p-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <CreditCard size={20} />
                  {isProcessing ? 'Processing...' : 'Quick Checkout (Recommended)'}
                  <ChevronRight size={20} />
                </button>

                {cartItems.length > 1 && (
                  <button
                    onClick={handleCreateBundle}
                    disabled={isProcessing}
                    className="w-full p-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-gray-700"
                  >
                    <Package size={20} />
                    Create Bundle (Beta)
                    <Info size={16} className="text-gray-400" />
                  </button>
                )}
              </div>

              {/* Security Info */}
              <div className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-3">
                <Lock size={20} className="text-green-400" />
                <div className="text-sm">
                  <p className="text-gray-300">Secure checkout powered by Gumroad</p>
                  <p className="text-gray-500">Your payment information is encrypted and secure</p>
                </div>
              </div>

              {cartItems.length > 1 && (
                <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    <strong>Note:</strong> Due to Gumroad's checkout system, multiple products will open in separate tabs. 
                    Complete each checkout to purchase all items.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 