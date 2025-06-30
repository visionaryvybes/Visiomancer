import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Create test scenarios for each event type
  const testScenarios = {
    page_visit: {
      event_name: 'page_visit',
      user_data: {
        em: ['test@example.com'], // Would be hashed
        external_id: '123456789',
        click_id: 'test_click_123',
        client_ip_address: '127.0.0.1',
        client_user_agent: 'Mozilla/5.0 Test',
        source_url: 'https://example.com/products/test'
      },
      custom_data: {
        product_ids: ['test-product-123'],
        content_name: 'Test Product',
        content_category: 'Testing'
      }
    },
    add_to_cart: {
      event_name: 'add_to_cart',
      user_data: {
        em: ['test@example.com'], // Would be hashed
        external_id: '123456789',
        click_id: 'test_click_123',
        client_ip_address: '127.0.0.1',
        client_user_agent: 'Mozilla/5.0 Test',
        source_url: 'https://example.com/products/test'
      },
      custom_data: {
        product_ids: ['test-product-123'],
        content_name: 'Test Product',
        value: 99.99,
        currency: 'USD',
        num_items: 1
      }
    },
    checkout: {
      event_name: 'checkout',
      user_data: {
        em: ['test@example.com'], // Would be hashed
        external_id: '123456789',
        click_id: 'test_click_123',
        client_ip_address: '127.0.0.1',
        client_user_agent: 'Mozilla/5.0 Test',
        source_url: 'https://example.com/checkout'
      },
      custom_data: {
        product_ids: ['test-product-123', 'test-product-456'],
        value: 199.98,
        currency: 'USD',
        num_items: 2,
        order_id: 'order_123456789'
      }
    }
  };

  // Check required parameters for each event
  const requiredParams = {
    customer_information: {
      user_agent: ['page_visit', 'add_to_cart', 'checkout'],
      email: ['page_visit', 'add_to_cart', 'checkout'],
      external_id: ['page_visit', 'add_to_cart', 'checkout'],
      click_id: ['page_visit', 'add_to_cart', 'checkout']
    },
    event_insights: {
      source_url: ['page_visit', 'add_to_cart', 'checkout'],
      order_id: ['checkout']
    }
  };

  // Check Pinterest configuration
  const hasCredentials = {
    access_token: !!process.env.PINTEREST_ACCESS_TOKEN,
    ad_account_id: !!process.env.PINTEREST_AD_ACCOUNT_ID,
    tag_id: !!process.env.PINTEREST_TAG_ID
  };

  // Analyze what's missing
  const analysis = {
    credentials: hasCredentials,
    events: {} as any
  };

  Object.entries(testScenarios).forEach(([eventName, scenario]) => {
    analysis.events[eventName] = {
      customer_information: {
        user_agent: !!scenario.user_data.client_user_agent ? '✅' : '❌',
        email: !!scenario.user_data.em ? '✅' : '❌',
        external_id: !!scenario.user_data.external_id ? '✅' : '❌',
        click_id: !!scenario.user_data.click_id ? '✅' : '❌'
      },
      event_insights: {
        source_url: !!scenario.user_data.source_url ? '✅' : '❌',
        order_id: eventName === 'checkout' ? ('order_id' in scenario.custom_data && !!scenario.custom_data.order_id ? '✅' : '❌') : 'N/A'
      }
    };
  });

  return NextResponse.json({
    message: 'Pinterest Conversion Tracking Status',
    configuration: hasCredentials,
    expected_data_per_event: analysis.events,
    test_scenarios: testScenarios,
    instructions: {
      fix_user_agent: "Ensure window.navigator.userAgent is being captured and sent",
      fix_email: "Call setUserEmail() before tracking events or pass email parameter",
      fix_external_id: "Should be automatically generated from browser fingerprint",
      fix_click_id: "Add ?epik=YOUR_CLICK_ID to URLs for Pinterest ads",
      fix_source_url: "window.location.href should be automatically captured",
      fix_order_id: "Generated automatically for checkout events"
    }
  });
} 