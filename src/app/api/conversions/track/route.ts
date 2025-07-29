import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface ConversionEvent {
  event_name: 'page_visit' | 'add_to_cart' | 'checkout';
  action_source: 'website';
  event_time: number;
  event_id: string;
  email?: string; // Raw email from client
  user_data: {
    em?: string[];
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

// Hash email for Pinterest compliance
function hashEmail(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalizedEmail).digest('hex');
}

// Generate a consistent external ID based on browser fingerprint
function generateExternalId(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const fingerprint = `${userAgent}-${acceptLanguage}`;
  return crypto.createHash('sha256').update(fingerprint).digest('hex').substring(0, 16);
}

// Extract Pinterest click ID from request
function extractClickId(request: NextRequest): string | undefined {
  // Check for Pinterest click ID in URL parameters or headers
  const url = new URL(request.url);
  const clickId = url.searchParams.get('epik') || 
                  url.searchParams.get('pinterest_click_id') ||
                  request.headers.get('x-pinterest-click-id');
  return clickId || undefined;
}

export async function POST(request: NextRequest) {
  try {
    const event: ConversionEvent = await request.json();
    
    // Log incoming event data for debugging
    console.log('[Conversions] Incoming event:', {
      event_name: event.event_name,
      has_email: !!event.email,
      has_external_id: !!event.user_data?.external_id,
      has_click_id: !!event.user_data?.click_id,
      external_id: event.user_data?.external_id,
      click_id: event.user_data?.click_id
    });
    
    // Add client IP address from request (NextRequest doesn't have .ip in Next.js 15)
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                    request.headers.get('x-real-ip') ||
                    request.headers.get('cf-connecting-ip') ||
                    '127.0.0.1';
    
    event.user_data.client_ip_address = clientIP;

    // Only use external ID if provided by client (Pinterest is picky about format)
    if (!event.user_data.external_id) {
      console.log('[Conversions] No external ID provided by client - proceeding without server-side generation');
      // Pinterest validation is strict, so only use client-provided external_id
    }

    // Click ID should be extracted on client side from URL params
    // Server can't access the original page URL params
    if (!event.user_data.click_id) {
      console.log('[Conversions] Click ID not provided by client');
      // Don't try to extract from API request - it won't have the original page params
    }

    // Hash email if provided
    if (event.email && typeof event.email === 'string') {
      event.user_data.em = [hashEmail(event.email)];
      console.log('[Conversions] Email hashed successfully');
    } else {
      console.log('[Conversions] No email provided in event');
    }

    // Pinterest API configuration
    const PINTEREST_ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN;
    const PINTEREST_AD_ACCOUNT_ID = process.env.PINTEREST_AD_ACCOUNT_ID;
    const PINTEREST_TAG_ID = process.env.PINTEREST_TAG_ID;
    
    console.log('[Conversions] Pinterest credentials check:', {
      hasToken: !!PINTEREST_ACCESS_TOKEN,
      hasAdAccount: !!PINTEREST_AD_ACCOUNT_ID,
      hasTagId: !!PINTEREST_TAG_ID,
      adAccountId: PINTEREST_AD_ACCOUNT_ID
    });
    
    if (!PINTEREST_ACCESS_TOKEN || !PINTEREST_AD_ACCOUNT_ID) {
      console.warn('[Conversions] Pinterest credentials not configured, storing event locally');
      
      // Store locally for now - you could save to database here
      console.log('[Conversions] Event stored locally:', event);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Event stored locally (Pinterest not configured)',
        event: event,
        debug: {
          hasToken: !!PINTEREST_ACCESS_TOKEN,
          hasAdAccount: !!PINTEREST_AD_ACCOUNT_ID
        }
      });
    }

    // Pinterest Conversions API format with enhanced user data
    const customData: any = {};
    
    // Only add value and currency if provided
    if (event.custom_data.value) {
      customData.value = event.custom_data.value.toString();
    }
    
    if (event.custom_data.currency) {
      customData.currency = event.custom_data.currency;
    }
    
    // Use num_items (Pinterest API expects this field name)
    if (event.custom_data.num_items) {
      customData.num_items = event.custom_data.num_items;
    }

    // Add content_ids for better product matching
    if (event.custom_data.product_ids && event.custom_data.product_ids.length > 0) {
      customData.content_ids = event.custom_data.product_ids;
    }

    // Add order_id if provided
    if (event.custom_data.order_id) {
      customData.order_id = event.custom_data.order_id;
    }

    // Build Pinterest event with correct user_data structure
    // Pinterest has very specific field names - following their exact API specification
    const userData: any = {};
    
    // Pinterest expects 'em' as an array of hashed emails
    if (event.user_data.em && event.user_data.em.length > 0) {
      userData.em = event.user_data.em;
    }
    
    // External ID for Pinterest
    // Pinterest requires external_id to be an array of hashed values for privacy
    if (event.user_data.external_id) {
      // Pinterest expects external_id as an array of hashed strings
      userData.external_id = [event.user_data.external_id];
      console.log('[Conversions] Including external_id for Pinterest (as array):', [event.user_data.external_id]);
    }
    
    // Pinterest expects 'click_id' for attribution
    if (event.user_data.click_id) {
      userData.click_id = event.user_data.click_id;
    }
    
    // Client IP is supported
    if (event.user_data.client_ip_address) {
      userData.client_ip_address = event.user_data.client_ip_address;
    }
    
    // Client User Agent is supported
    if (event.user_data.client_user_agent) {
      userData.client_user_agent = event.user_data.client_user_agent;
    }

    // Pinterest requires source URL in event_source_url field (not in user_data)
    const eventSourceUrl = event.user_data.source_url;

    const pinterestEvent = {
      event_name: event.event_name,
      action_source: event.action_source,
      event_time: event.event_time,
      event_id: event.event_id,
      event_source_url: eventSourceUrl, // Pinterest expects this at the top level
      user_data: userData,
      custom_data: customData
    };

    const pinterestPayload = {
      data: [pinterestEvent]
    };

    console.log('[Conversions] Sending to Pinterest API:', {
      url: `https://api.pinterest.com/v5/ad_accounts/${PINTEREST_AD_ACCOUNT_ID}/events`,
      event_name: event.event_name,
      has_email: !!userData.em,
      has_external_id: !!userData.external_id,
      has_click_id: !!userData.click_id,
      has_value: !!customData.value,
      has_currency: !!customData.currency,
      user_data_sent: userData,
      custom_data_sent: customData,
      full_payload: pinterestPayload
    });

    // Send to Pinterest Conversions API
    // Updated endpoint: https://api.pinterest.com/v5/ad_accounts/549765875609/events
    // For ad account: visionaryvybes (549765875609)
    const pinterestResponse = await fetch(
      `https://api.pinterest.com/v5/ad_accounts/${PINTEREST_AD_ACCOUNT_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINTEREST_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pinterestPayload),
      }
    );

    const responseText = await pinterestResponse.text();
    
    if (!pinterestResponse.ok) {
      console.error('[Conversions] Pinterest API error:', {
        status: pinterestResponse.status,
        statusText: pinterestResponse.statusText,
        response: responseText
      });
      
      // Still return success to client, but log the error
      return NextResponse.json({ 
        success: true, 
        message: 'Event processed (Pinterest API error logged)',
        pinterest_error: {
          status: pinterestResponse.status,
          response: responseText
        }
      });
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { raw_response: responseText };
    }
    
    console.log('[Conversions] Pinterest API success:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Event sent to Pinterest successfully',
      pinterestResponse: result,
      adAccount: 'visionaryvybes (549765875609)',
      userDataIncluded: {
        email: !!userData.em,
        external_id: !!userData.external_id,
        click_id: !!userData.click_id,

      }
    });

  } catch (error) {
    console.error('[Conversions] Error processing event:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process conversion event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 