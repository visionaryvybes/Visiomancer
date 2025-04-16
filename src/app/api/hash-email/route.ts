import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Normalize
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Hash using SHA-256
    const hashedEmail = crypto.createHash('sha256').update(normalizedEmail).digest('hex');

    return NextResponse.json({ hashedEmail });

  } catch (error) {
    console.error("Pinterest email hashing error:", error);
    // Avoid leaking error details to the client
    return NextResponse.json({ error: 'Failed to process email' }, { status: 500 });
  }
} 