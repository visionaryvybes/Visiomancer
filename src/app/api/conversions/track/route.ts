import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface ConversionEvent {
  event_name: 'page_visit' | 'add_to_cart' | 'checkout';
  action_source: 'website';
  event_time: number;
  event_id: string;
  user_data: {
    em?: string[];
    external_id?: string;
    click_id?: string;
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
    
    // Add client IP address from request
    const clientIP = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0] ||
                    request.headers.get('x-real-ip') ||
                    '127.0.0.1';
    
    event.user_data.client_ip_address = clientIP;

    // Generate external ID from browser fingerprint
    if (!event.user_data.external_id) {
      event.user_data.external_id = generateExternalId(request);
    }

    // Extract Pinterest click ID if available
    if (!event.user_data.click_id) {
      event.user_data.click_id = extractClickId(request);
    }

    // If email is provided in the request body, hash it
    const requestBody = await request.clone().json();
    if (requestBody.email && typeof requestBody.email === 'string') {
      event.user_data.em = [hashEmail(requestBody.email)];
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

    // Build Pinterest event with all available user data
    const pinterestEvent = {
      event_name: event.event_name,
      action_source: event.action_source,
      event_time: event.event_time,
      event_id: event.event_id,
      user_data: {
        ...(event.user_data.em && { em: event.user_data.em }),
        ...(event.user_data.external_id && { external_id: event.user_data.external_id }),
        ...(event.user_data.click_id && { click_id: event.user_data.click_id }),
        ...(event.user_data.client_ip_address && { client_ip_address: event.user_data.client_ip_address }),
        ...(event.user_data.client_user_agent && { client_user_agent: event.user_data.client_user_agent })
      },
      custom_data: customData
    };

    const pinterestPayload = {
      data: [pinterestEvent]
    };

    console.log('[Conversions] Sending to Pinterest API:', {
      url: `https://api.pinterest.com/v5/ad_accounts/${PINTEREST_AD_ACCOUNT_ID}/events`,
      event_name: event.event_name,
      has_email: !!event.user_data.em,
      has_external_id: !!event.user_data.external_id,
      has_click_id: !!event.user_data.click_id,
      has_value: !!event.custom_data.value,
      has_currency: !!event.custom_data.currency
    });

    // Send to Pinterest Conversions API
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
        email: !!event.user_data.em,
        external_id: !!event.user_data.external_id,
        click_id: !!event.user_data.click_id
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