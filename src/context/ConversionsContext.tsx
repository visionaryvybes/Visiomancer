'use client';

import React, { createContext, useContext, useCallback, ReactNode, useState } from 'react';

interface ConversionEvent {
  event_name: 'page_visit' | 'add_to_cart' | 'checkout';
  action_source: 'website';
  event_time: number;
  event_id: string;
  email?: string; // Add email to the event data
  user_data: {
    em?: string[]; // hashed emails
    external_id?: string;
    click_id?: string;
    client_ip_address?: string;
    client_user_agent?: string;
    source_url?: string; // Add source URL for Pinterest requirements
  };
  custom_data: {
    product_ids?: string[];
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    product_category?: string; // 2025 EQS requirement
    num_items?: number;
    order_id?: string; // Add order ID for Pinterest requirements
    // 2025 EQS Medium Priority Parameters
    product_price?: number;
    product_quantity?: number;
    search_query?: string;
    product_title?: string;
    line_items?: Array<{
      product_id: string;
      product_name: string;
      product_price: number;
      product_quantity: number;
      product_category?: string;
    }>;
  };
}

interface ConversionsContextType {
  trackPageVisit: (productId?: string, productName?: string, category?: string, email?: string) => void;
  trackAddToCart: (productId: string, productName: string, value: number, currency?: string, email?: string) => void;
  trackCheckout: (productIds: string[], value: number, currency?: string, numItems?: number, email?: string, orderId?: string) => void;
  getConversions: () => ConversionEvent[];
  clearConversions: () => void;
  setUserEmail: (email: string) => void;
  getUserEmail: () => string | null;
}

const ConversionsContext = createContext<ConversionsContextType | undefined>(undefined);

export const ConversionsProvider = ({ children }: { children: ReactNode }) => {
  // Store conversions in memory for this session
  const conversions: ConversionEvent[] = [];
  const [userEmail, setUserEmailState] = useState<string | null>(null);

  const generateEventId = useCallback(() => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getUserData = useCallback(() => {
    // Extract Pinterest click ID from URL if available
    let clickId = undefined;
    let sourceUrl = undefined;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      clickId = urlParams.get('epik') || urlParams.get('pinterest_click_id') || undefined;
      // HIGH PRIORITY for EQS 2025: Page URL is required
      sourceUrl = window.location.href;
    }

    // Generate external ID from browser data
    let externalId = undefined;
    if (typeof window !== 'undefined') {
      const fingerprint = `${window.navigator.userAgent}-${window.navigator.language}-${window.screen.width}x${window.screen.height}`;
      // Simple hash function for client-side fingerprinting
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      externalId = Math.abs(hash).toString();
    }

    return {
      client_ip_address: undefined, // Will be set server-side
      client_user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      external_id: externalId,
      click_id: clickId,
      source_url: sourceUrl, // HIGH PRIORITY for 2025 EQS
    };
  }, []);

  const setUserEmail = useCallback((email: string) => {
    setUserEmailState(email);
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('visiomancer_user_email', email);
    }
  }, []);

  const getUserEmail = useCallback(() => {
    if (userEmail) return userEmail;
    // Try to get from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('visiomancer_user_email');
      if (stored) {
        setUserEmailState(stored);
        return stored;
      }
    }
    return null;
  }, [userEmail]);

  const trackPageVisit = useCallback((productId?: string, productName?: string, category?: string, email?: string) => {
    const currentEmail = email || getUserEmail();
    
    const event: ConversionEvent = {
      event_name: 'page_visit',
      action_source: 'website',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      ...(currentEmail && { email: currentEmail }),
      user_data: getUserData(),
      custom_data: {
        ...(productId && { product_ids: [productId] }),
        ...(productName && { content_name: productName }),
        ...(category && { 
          content_category: category,
          product_category: category // 2025 EQS requirement
        }),
      }
    };

    conversions.push(event);
    
    // Send to Pinterest API
    sendConversionEvent(event);
    
    console.log('[Conversions] Page Visit tracked:', event);
  }, [generateEventId, getUserData, getUserEmail]);

  const trackAddToCart = useCallback((productId: string, productName: string, value: number, currency: string = 'USD', email?: string) => {
    const currentEmail = email || getUserEmail();
    
    const event: ConversionEvent = {
      event_name: 'add_to_cart',
      action_source: 'website',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      ...(currentEmail && { email: currentEmail }),
      user_data: getUserData(),
      custom_data: {
        product_ids: [productId],
        content_name: productName,
        value: value,
        currency: currency,
        num_items: 1,
        // 2025 EQS Medium Priority Parameters
        product_price: value,
        product_quantity: 1,
        line_items: [{
          product_id: productId,
          product_name: productName,
          product_price: value,
          product_quantity: 1
        }]
      }
    };

    conversions.push(event);
    
    // Send to Pinterest API
    sendConversionEvent(event);
    
    console.log('[Conversions] Add to Cart tracked:', event);
  }, [generateEventId, getUserData, getUserEmail]);

  const trackCheckout = useCallback((productIds: string[], value: number, currency: string = 'USD', numItems?: number, email?: string, orderId?: string) => {
    const currentEmail = email || getUserEmail();
    
    const event: ConversionEvent = {
      event_name: 'checkout',
      action_source: 'website',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      ...(currentEmail && { email: currentEmail }),
      user_data: {
        ...getUserData(),
        // Add source URL for Pinterest requirements
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      },
      custom_data: {
        product_ids: productIds,
        value: value,
        currency: currency,
        num_items: numItems || productIds.length,
        // Add order ID for Pinterest requirements
        ...(orderId && { order_id: orderId })
      }
    };

    conversions.push(event);
    
    // Send to Pinterest API
    sendConversionEvent(event);
    
    console.log('[Conversions] Checkout tracked:', event);
  }, [generateEventId, getUserData, getUserEmail]);

  const sendConversionEvent = useCallback(async (event: ConversionEvent) => {
    try {
      const response = await fetch('/api/conversions/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        console.error('[Conversions] Failed to send event:', response.statusText);
      } else {
        const result = await response.json();
        console.log('[Conversions] Event sent successfully:', result);
      }
    } catch (error) {
      console.error('[Conversions] Error sending event:', error);
    }
  }, []);

  const getConversions = useCallback(() => {
    return [...conversions];
  }, []);

  const clearConversions = useCallback(() => {
    conversions.length = 0;
  }, []);

  return (
    <ConversionsContext.Provider value={{
      trackPageVisit,
      trackAddToCart,
      trackCheckout,
      getConversions,
      clearConversions,
      setUserEmail,
      getUserEmail
    }}>
      {children}
    </ConversionsContext.Provider>
  );
};

export const useConversions = () => {
  const context = useContext(ConversionsContext);
  if (context === undefined) {
    throw new Error('useConversions must be used within a ConversionsProvider');
  }
  return context;
}; 