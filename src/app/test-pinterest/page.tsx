'use client';

import React, { useState, useEffect } from 'react';
import { useConversions } from '@/context/ConversionsContext';
import Button from '@/components/ui/Button';
import StoreLayout from '@/components/layout/StoreLayout';

export default function TestPinterestPage() {
  const { trackPageVisit, trackAddToCart, trackCheckout, setUserEmail, getUserEmail } = useConversions();
  const [email, setEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [externalId, setExternalId] = useState<string | null>(null);
  const [clickId, setClickId] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);

  useEffect(() => {
    // Get current tracking data
    const storedEmail = getUserEmail();
    setCurrentEmail(storedEmail);
    
    if (typeof window !== 'undefined') {
      const storedExternalId = localStorage.getItem('visiomancer_external_id');
      setExternalId(storedExternalId);
      
      const urlParams = new URLSearchParams(window.location.search);
      const urlClickId = urlParams.get('epik') || 
                        urlParams.get('pinterest_click_id') || 
                        urlParams.get('_epik') ||
                        urlParams.get('click_id');
      setClickId(urlClickId);
    }
  }, [getUserEmail]);

  const handleSetEmail = () => {
    if (email) {
      setUserEmail(email);
      setCurrentEmail(email);
      alert('Email set successfully!');
    }
  };

  const testPageVisit = async () => {
    console.log('Testing Page Visit...');
    trackPageVisit('test-product-123', 'Test Product', 'Test Category');
    
    // Check API response
    setTimeout(async () => {
      try {
        const response = await fetch('/api/conversions/status');
        const data = await response.json();
        setLastResponse(data);
        console.log('API Status:', data);
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }, 1000);
  };

  const testAddToCart = () => {
    console.log('Testing Add to Cart...');
    trackAddToCart('test-product-123', 'Test Product', 99.99, 'USD');
  };

  const testCheckout = () => {
    console.log('Testing Checkout...');
    const orderId = `test_order_${Date.now()}`;
    trackCheckout(['test-product-123', 'test-product-456'], 199.98, 'USD', 2, undefined, orderId);
  };

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Pinterest Tracking Test Page</h1>
        
        {/* Current Status */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Tracking Parameters</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex">
              <span className="font-semibold w-32">Email:</span>
              <span className={currentEmail ? 'text-green-600' : 'text-red-600'}>
                {currentEmail || 'Not set'}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">External ID:</span>
              <span className={externalId ? 'text-green-600' : 'text-red-600'}>
                {externalId || 'Not generated'}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Click ID:</span>
              <span className={clickId ? 'text-green-600' : 'text-red-600'}>
                {clickId || 'Not found in URL'}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Source URL:</span>
              <span className="text-green-600">{typeof window !== 'undefined' ? window.location.href : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Set Email */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Set User Email</h2>
          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
            />
            <Button onClick={handleSetEmail} variant="default">
              Set Email
            </Button>
          </div>
        </div>

        {/* Test Events */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Test Conversion Events</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Page Visit Event</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tests tracking a product page view</p>
              </div>
              <Button onClick={testPageVisit} variant="outline">
                Test Page Visit
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Add to Cart Event</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tests tracking adding a product to cart</p>
              </div>
              <Button onClick={testAddToCart} variant="outline">
                Test Add to Cart
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Checkout Event</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tests tracking a checkout with multiple products</p>
              </div>
              <Button onClick={testCheckout} variant="outline">
                Test Checkout
              </Button>
            </div>
          </div>
        </div>

        {/* API Response */}
        {lastResponse && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Last API Response</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(lastResponse, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>First, set your email address using the form above</li>
            <li>Test each event type and check the browser console for logs</li>
            <li>Check the Pinterest Events Manager to see if events are received</li>
            <li>To test Click ID, add ?epik=test123 to the URL and refresh</li>
            <li>Open browser DevTools to see console logs for each event</li>
          </ol>
        </div>
      </div>
    </StoreLayout>
  );
} 