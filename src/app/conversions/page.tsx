"use client";

import React, { useState, useEffect } from 'react';
import { useConversions } from '@/context/ConversionsContext';
import StoreLayout from "@/components/layout/StoreLayout";
import NextImage from 'next/image';

interface ConversionEvent {
  event_name: 'page_visit' | 'add_to_cart' | 'checkout';
  action_source: 'website';
  event_time: number;
  event_id: string;
  user_data: {
    em?: string[];
    client_ip_address?: string;
    client_user_agent?: string;
  };
  custom_data: {
    product_ids?: string[];
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    num_items?: number;
  };
}

const ConversionRequirement = ({ 
  eventName, 
  notes, 
  hasWarning = false, 
  children 
}: { 
  eventName: string; 
  notes: string; 
  hasWarning?: boolean;
  children?: React.ReactNode;
}) => (
  <div className="border-l-4 border-orange-400 bg-white dark:bg-gray-800 p-6 mb-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        {hasWarning && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
            <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">!</span>
          </div>
        )}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {eventName}
          </h3>
          <div className="flex space-x-2">
            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
              0
            </span>
            {hasWarning && (
              <span className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:text-orange-200">
                8
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-200">
              0
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {notes}
        </p>
        {children && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  </div>
);

const ConversionDetail = ({ title, description, hasWarning = false }: { 
  title: string; 
  description: string; 
  hasWarning?: boolean;
}) => (
  <div className="flex items-start py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    <div className="flex-shrink-0 mr-3">
      {hasWarning && (
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
          <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">!</span>
        </div>
      )}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
    </div>
  </div>
);

export default function ConversionsPage() {
  const { getConversions, clearConversions } = useConversions();
  const [events, setEvents] = useState<ConversionEvent[]>([]);
  const [stats, setStats] = useState({
    pageVisits: 0,
    addToCarts: 0,
    checkouts: 0,
    totalValue: 0
  });
  const [testingAPI, setTestingAPI] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<any>(null);

  useEffect(() => {
    const conversions = getConversions();
    setEvents(conversions);
    
    // Calculate stats
    const pageVisits = conversions.filter(e => e.event_name === 'page_visit').length;
    const addToCarts = conversions.filter(e => e.event_name === 'add_to_cart').length;
    const checkouts = conversions.filter(e => e.event_name === 'checkout').length;
    const totalValue = conversions
      .filter(e => e.custom_data.value)
      .reduce((sum, e) => sum + (e.custom_data.value || 0), 0);
    
    setStats({ pageVisits, addToCarts, checkouts, totalValue });
  }, [getConversions]);

  const testPinterestAPI = async () => {
    setTestingAPI(true);
    setApiTestResult(null);
    
    try {
      const testEvent = {
        event_name: 'page_visit',
        action_source: 'website',
        event_time: Math.floor(Date.now() / 1000),
        event_id: `test_${Date.now()}`,
        email: 'test@example.com',
        user_data: {
          client_user_agent: navigator.userAgent,
        },
        custom_data: {
          product_ids: ['test_product_id'],
          content_name: 'Pinterest API Test - Enhanced Tracking',
          content_category: 'test'
        }
      };

      const response = await fetch('/api/conversions/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEvent),
      });

      const result = await response.json();
      setApiTestResult(result);
    } catch (error) {
      setApiTestResult({
        success: false,
        error: 'Failed to test API',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTestingAPI(false);
    }
  };

  return (
    <StoreLayout>
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl py-16">
          <div className="text-center mb-12">
            <div className="mb-8">
              <NextImage 
                src="/logo visiomancer.png" 
                alt="Visiomancer Logo" 
                width={120} 
                height={120} 
                className="mx-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
              Conversion Tracking
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-base">
              Manage your conversion tracking with the conversions API
            </p>
          </div>

          {/* Pinterest Configuration Status */}
          <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-4">
              Pinterest Configuration - Enhanced Tracking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300">Ad Account</h3>
                <p className="text-blue-700 dark:text-blue-400">visionaryvybes (549765875609)</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300">Pinterest Tag</h3>
                <p className="text-blue-700 dark:text-blue-400">2614113117297</p>
              </div>
            </div>
            
            {/* Customer Information Status */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">✅ Enhanced Customer Information</h3>
              <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                <li>• Email addresses (hashed for privacy)</li>
                <li>• External ID (browser fingerprint-based)</li>
                <li>• Click ID (Pinterest click tracking)</li>
                <li>• IP address and user agent</li>
                <li>• Product content IDs for better matching</li>
              </ul>
            </div>
            <div className="flex gap-4">
              <button
                onClick={testPinterestAPI}
                disabled={testingAPI}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {testingAPI ? 'Testing...' : 'Test Pinterest API'}
              </button>
              {apiTestResult && (
                <div className={`flex-1 p-3 rounded-md text-sm ${
                  apiTestResult.success 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}>
                  <strong>{apiTestResult.success ? 'Success:' : 'Error:'}</strong> {apiTestResult.message}
                  {apiTestResult.pinterest_error && (
                    <div className="mt-1 text-xs">
                      Status: {apiTestResult.pinterest_error.status}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Page Visits</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pageVisits}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Add to Cart</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.addToCarts}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Checkouts</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.checkouts}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Value</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalValue.toFixed(2)}</p>
            </div>
          </div>

          {/* Event Requirements - Similar to Pinterest Interface */}
          <div className="space-y-4">
            <ConversionRequirement
              eventName="Page Visit"
              notes="Add a Page Visit event that fires when someone loads a page on your site."
              hasWarning={true}
            >
              <ConversionDetail
                title="Product ID"
                description="Make sure you are including Product IDs in your Page Visit events. A Product ID can be any format that you choose as long as it matches the format used by your Catalog."
                hasWarning={true}
              />
            </ConversionRequirement>

            <ConversionRequirement
              eventName="Add To Cart"
              notes="Add an Add to Cart event that fires when someone adds a product to your cart."
              hasWarning={true}
            >
              <ConversionDetail
                title="Product ID"
                description="Make sure you are including Product IDs in your Add to Cart events. A Product ID can be any format that you choose as long as it matches the format used by your Catalog."
                hasWarning={true}
              />
            </ConversionRequirement>

            <ConversionRequirement
              eventName="Checkout"
              notes="Add a Checkout event that fires when someone successfully buys something on your site."
              hasWarning={true}
            >
              <ConversionDetail
                title="Product ID"
                description="Make sure you are including Product IDs in your Checkout events. A Product ID can be any format that you choose as long as it matches the format used by your Catalog."
                hasWarning={true}
              />
              <ConversionDetail
                title="Value"
                description="This should be the total value of the completed order, without commas, currency symbols. Tax or shipping should not be included. For example, if a user completes checkout for a 10 USD item and a 12 USD item, Value would be 22. Example values: 1000, 100.50, 10000.00."
                hasWarning={true}
              />
              <ConversionDetail
                title="Currency"
                description="If you choose to include Currency with your Checkout events, make sure you follow the ISO 4217 format. If left blank, this will default to your Pinterest billing currency. Example Values: USD, GBP, CAD, EUR"
                hasWarning={true}
              />
            </ConversionRequirement>
          </div>

          {/* Recent Events */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Events</h2>
              <button
                onClick={clearConversions}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear All Events
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {events.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No conversion events tracked yet. Start browsing the site to see events appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Product ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {events.slice(-10).reverse().map((event) => (
                        <tr key={event.event_id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {event.event_name.replace('_', ' ').toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {event.custom_data.product_ids?.join(', ') || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {event.custom_data.value ? `$${event.custom_data.value}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(event.event_time * 1000).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
} 