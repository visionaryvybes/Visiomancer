'use client';

import React, { useState, useEffect } from 'react';
import { useConversions } from '@/context/ConversionsContext';
import StoreLayout from '@/components/layout/StoreLayout';
import Button from '@/components/ui/Button';

export default function TestPinterestPage() {
  const { trackPageVisit, trackAddToCart, trackCheckout, setUserEmail, getUserEmail } = useConversions();
  const [testEmail, setTestEmail] = useState('');
  const [trackingData, setTrackingData] = useState<any>({});
  const [testResults, setTestResults] = useState<string[]>([]);
  const [lastEventData, setLastEventData] = useState<any>(null);

  useEffect(() => {
    // Load current tracking data
    const loadTrackingData = () => {
      const data = {
        email: getUserEmail() || 'Not set',
        storedEmail: localStorage.getItem('visiomancer_user_email') || 'Not set',
        externalId: localStorage.getItem('visiomancer_external_id') || 'Not set',
        clickId: sessionStorage.getItem('visiomancer_click_id') || 'Not set',
        userAgent: window.navigator.userAgent,
        currentUrl: window.location.href,
        urlParams: {} as any
      };

      // Check URL params
      const urlParams = new URLSearchParams(window.location.search);
      ['epik', 'pinterest_click_id', '_epik', 'click_id'].forEach(param => {
        const value = urlParams.get(param);
        if (value) {
          data.urlParams[param] = value;
        }
      });

      setTrackingData(data);
    };

    loadTrackingData();

    // Track page visit
    trackPageVisit('test-page', 'Pinterest Test Page', 'Testing');
    addTestResult('✅ Page visit tracked on load');
  }, []);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSetEmail = () => {
    if (testEmail) {
      setUserEmail(testEmail);
      addTestResult(`✅ Email set: ${testEmail}`);
      
      // Reload tracking data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const testAddToCart = () => {
    const userEmail = getUserEmail();
    const eventData = {
      productId: 'test-product-123',
      productName: 'Test Product',
      value: 99.99,
      currency: 'USD',
      email: userEmail || undefined
    };
    trackAddToCart(eventData.productId, eventData.productName, eventData.value, eventData.currency);
    setLastEventData({ event: 'add_to_cart', ...eventData });
    addTestResult(`✅ Add to Cart tracked (email: ${userEmail || 'none'})`);
  };

  const testCheckout = () => {
    const userEmail = getUserEmail();
    const orderId = `test_order_${Date.now()}`;
    const eventData = {
      productIds: ['test-product-123', 'test-product-456'],
      value: 199.98,
      currency: 'USD',
      numItems: 2,
      orderId: orderId,
      email: userEmail || undefined
    };
    trackCheckout(eventData.productIds, eventData.value, eventData.currency, eventData.numItems, undefined, orderId);
    setLastEventData({ event: 'checkout', ...eventData });
    addTestResult(`✅ Checkout tracked (email: ${userEmail || 'none'}, orderId: ${orderId})`);
  };

  const clearAllData = () => {
    localStorage.removeItem('visiomancer_user_email');
    localStorage.removeItem('visiomancer_external_id');
    sessionStorage.removeItem('visiomancer_click_id');
    addTestResult('✅ All tracking data cleared');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Pinterest Conversion Tracking Test</h1>
        
        {/* Current State */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Tracking State</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex">
              <span className="text-gray-400 w-40">Email (Context):</span>
              <span className={trackingData.email !== 'Not set' ? 'text-green-400' : 'text-red-400'}>
                {trackingData.email}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-40">Email (Storage):</span>
              <span className={trackingData.storedEmail !== 'Not set' ? 'text-green-400' : 'text-red-400'}>
                {trackingData.storedEmail}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-40">External ID:</span>
              <span className={trackingData.externalId !== 'Not set' ? 'text-green-400' : 'text-red-400'}>
                {trackingData.externalId}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-40">Click ID (Session):</span>
              <span className={trackingData.clickId !== 'Not set' ? 'text-green-400' : 'text-red-400'}>
                {trackingData.clickId}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-40">User Agent:</span>
              <span className="text-green-400 text-xs">
                {trackingData.userAgent?.substring(0, 60)}...
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-40">Current URL:</span>
              <span className="text-green-400 text-xs">
                {trackingData.currentUrl}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-40">URL Parameters:</span>
              <span className="text-blue-400">
                {Object.keys(trackingData.urlParams || {}).length > 0 
                  ? JSON.stringify(trackingData.urlParams)
                  : 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Email Setup */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Set User Email</h2>
          <div className="flex gap-4">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
            <Button onClick={handleSetEmail} disabled={!testEmail}>
              Set Email
            </Button>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Conversion Events</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={testAddToCart}>
              Test Add to Cart
            </Button>
            <Button onClick={testCheckout}>
              Test Checkout
            </Button>
            <Button onClick={clearAllData} variant="outline" className="border-red-600 text-red-600">
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Test with Click ID */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test with Click ID</h2>
          <p className="text-gray-400 mb-4">
            Click one of these links to reload the page with a Pinterest click ID:
          </p>
          <div className="space-y-2">
            <a 
              href="/test-pinterest?epik=test_click_123" 
              className="text-blue-400 hover:underline block"
            >
              Test with epik parameter
            </a>
            <a 
              href="/test-pinterest?pinterest_click_id=test_pinterest_456" 
              className="text-blue-400 hover:underline block"
            >
              Test with pinterest_click_id parameter
            </a>
          </div>
        </div>

        {/* Last Event Data */}
        {lastEventData && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Last Event Data Sent</h2>
            <pre className="text-xs text-gray-300 overflow-x-auto">
              {JSON.stringify(lastEventData, null, 2)}
            </pre>
          </div>
        )}

        {/* Test Results */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-1 font-mono text-sm max-h-60 overflow-y-auto">
            {testResults.length > 0 ? (
              testResults.map((result, index) => (
                <div key={index} className="text-green-400">
                  {result}
                </div>
              ))
            ) : (
              <div className="text-gray-400">No test results yet</div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-sm text-gray-400">
          <h3 className="font-semibold mb-2">How to test:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Check the current tracking state - all fields should be populated</li>
            <li>If email is not set, enter an email and click "Set Email"</li>
            <li>Test conversion events using the buttons</li>
            <li>Check Pinterest Events Manager to verify events are received</li>
            <li>To test click ID tracking, use the provided links</li>
          </ol>
        </div>
      </div>
    </StoreLayout>
  );
} 