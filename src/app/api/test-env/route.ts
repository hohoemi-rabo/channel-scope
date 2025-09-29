import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  return NextResponse.json({
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    firstChars: apiKey ? apiKey.substring(0, 4) + '...' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
  });
}