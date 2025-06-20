import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const PINTEREST_ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN;
    const PINTEREST_AD_ACCOUNT_ID = process.env.PINTEREST_AD_ACCOUNT_ID;
    const PINTEREST_TAG_ID = process.env.PINTEREST_TAG_ID;
    
    const status = {
      pinterest: {
        configured: !!PINTEREST_ACCESS_TOKEN && !!PINTEREST_AD_ACCOUNT_ID,
        hasToken: !!PINTEREST_ACCESS_TOKEN,
        hasAdAccount: !!PINTEREST_AD_ACCOUNT_ID,
        hasTagId: !!PINTEREST_TAG_ID,
        adAccountId: PINTEREST_AD_ACCOUNT_ID || 'Not configured'
      },
      features: {
        emailTracking: true,
        externalIdGeneration: true,
        clickIdExtraction: true,
        enhancedUserData: true,
        productContentIds: true
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('[Conversions Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get conversion status' },
      { status: 500 }
    );
  }
} 