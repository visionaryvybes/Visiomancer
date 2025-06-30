'use client';

import React, { createContext, useContext, useCallback, ReactNode, useState, useEffect } from 'react';

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
  
  // Initialize user data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize external ID if not exists
      let externalId = localStorage.getItem('visiomancer_external_id');
      if (!externalId) {
        const fingerprint = `${window.navigator.userAgent}-${window.navigator.language}-${window.screen.width}x${window.screen.height}-${window.navigator.hardwareConcurrency || ''}`;
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
          const char = fingerprint.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        externalId = Math.abs(hash).toString();
        localStorage.setItem('visiomancer_external_id', externalId);
        console.log('[Conversions] Generated and stored external_id:', externalId);
      }
      
      // Initialize email if exists
      const storedEmail = localStorage.getItem('visiomancer_user_email');
      if (storedEmail) {
        setUserEmailState(storedEmail);
        console.log('[Conversions] Loaded stored email');
      }
      
      // Store click ID if present in URL
      const urlParams = new URLSearchParams(window.location.search);
      const clickId = urlParams.get('epik') || 
                      urlParams.get('pinterest_click_id') || 
                      urlParams.get('_epik') ||
                      urlParams.get('click_id');
      if (clickId) {
        sessionStorage.setItem('visiomancer_click_id', clickId);
        console.log('[Conversions] Click ID found in URL and stored:', clickId);
      }
    }
  }, []);

  const generateEventId = useCallback(() => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getUserData = useCallback(() => {
    // Extract Pinterest click ID from URL if available
    let clickId = undefined;
    let sourceUrl = undefined;
    if (typeof window !== 'undefined') {
      // First check if we have a stored click ID from this session
      clickId = sessionStorage.getItem('visiomancer_click_id') || undefined;
      
      // If not, check URL parameters
      if (!clickId) {
        const urlParams = new URLSearchParams(window.location.search);
        // Check for various Pinterest click ID parameters
        clickId = urlParams.get('epik') || 
                  urlParams.get('pinterest_click_id') || 
                  urlParams.get('_epik') ||
                  urlParams.get('click_id') ||
                  undefined;
        
        // Store click ID for this session if found
        if (clickId) {
          sessionStorage.setItem('visiomancer_click_id', clickId);
          console.log('[Conversions] Stored click_id for session:', clickId);
        }
      }
      
      // HIGH PRIORITY for EQS 2025: Page URL is required for ALL events
      sourceUrl = window.location.href;
    }

    // Generate external ID from browser data - make it more consistent
    let externalId = undefined;
    if (typeof window !== 'undefined') {
      // Try to get from localStorage first for consistency
      let stored = localStorage.getItem('visiomancer_external_id');
      if (!stored) {
        // Generate a new one based on browser fingerprint
        const fingerprint = `${window.navigator.userAgent}-${window.navigator.language}-${window.screen.width}x${window.screen.height}-${window.navigator.hardwareConcurrency || ''}`;
        // Simple hash function for client-side fingerprinting
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
          const char = fingerprint.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        stored = Math.abs(hash).toString();
        // Store for consistency across events
        localStorage.setItem('visiomancer_external_id', stored);
      }
      externalId = stored;
    }

    return {
      em: undefined as string[] | undefined, // Add em field to return type
      client_ip_address: undefined, // Will be set server-side
      client_user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      external_id: externalId,
      click_id: clickId,
      source_url: sourceUrl, // HIGH PRIORITY for 2025 EQS - included for ALL events
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
    const userData = getUserData();
    
    // Always include email in user_data if available
    if (currentEmail) {
      userData.em = [currentEmail]; // Will be hashed server-side
    }
    
    const event: ConversionEvent = {
      event_name: 'page_visit',
      action_source: 'website',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      ...(currentEmail && { email: currentEmail }), // Include raw email for server-side hashing
      user_data: userData, // All user data including source_url
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
    const userData = getUserData();
    
    // Always include email in user_data if available
    if (currentEmail) {
      userData.em = [currentEmail]; // Will be hashed server-side
    }
    
    const event: ConversionEvent = {
      event_name: 'add_to_cart',
      action_source: 'website',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      ...(currentEmail && { email: currentEmail }), // Include raw email for server-side hashing
      user_data: userData, // All user data including source_url
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
    const userData = getUserData();
    
    // Always include email in user_data if available
    if (currentEmail) {
      userData.em = [currentEmail]; // Will be hashed server-side
    }
    
    // Generate order ID if not provided
    const finalOrderId = orderId || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const event: ConversionEvent = {
      event_name: 'checkout',
      action_source: 'website',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      ...(currentEmail && { email: currentEmail }), // Include raw email for server-side hashing
      user_data: userData, // All user data including source_url
      custom_data: {
        product_ids: productIds,
        value: value,
        currency: currency,
        num_items: numItems || productIds.length,
        order_id: finalOrderId // Always include order ID for checkout events
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