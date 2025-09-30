import { NextRequest, NextResponse } from 'next/server';
import youtubeClient from '@/lib/youtube';
import { ChannelSearchResponse } from '@/types';
import { apiRateLimiter, getClientIp } from '@/lib/rate-limiter';
import { getCachedData, generateCacheKey } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    // レート制限のチェック
    const clientIp = getClientIp(request);
    if (!apiRateLimiter.checkLimit(clientIp)) {
      const resetTime = apiRateLimiter.getResetTime(clientIp);
      return NextResponse.json(
        {
          error: `リクエスト制限に達しました。${resetTime}秒後に再度お試しください。`,
          retryAfter: resetTime
        },
        {
          status: 429,
          headers: {
            'Retry-After': resetTime.toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': apiRateLimiter.getRemainingRequests(clientIp).toString(),
            'X-RateLimit-Reset': new Date(Date.now() + resetTime * 1000).toISOString(),
          }
        }
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    // クエリパラメータのバリデーション
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: '検索クエリが必要です' },
        { status: 400 }
      );
    }

    // 検索クエリの長さ制限
    if (query.length > 100) {
      return NextResponse.json(
        { error: '検索クエリが長すぎます' },
        { status: 400 }
      );
    }

    // キャッシュキーを生成
    const cacheKey = generateCacheKey('search', query.toLowerCase().trim());

    // キャッシュ付きでYouTube APIを呼び出し
    const channels = await getCachedData(
      cacheKey,
      () => youtubeClient.searchChannels(query),
      30 * 60 // 30分
    );

    const response: ChannelSearchResponse = {
      channels,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Search API Error:', error);

    // エラーメッセージの判定
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';

    // API制限エラーの判定
    if (errorMessage.includes('quotaExceeded')) {
      return NextResponse.json(
        { error: '現在アクセスが集中しています。5分後に再度お試しください。' },
        { status: 429 }
      );
    }

    // API キー関連のエラー
    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'サーバー設定エラーが発生しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'チャンネルの検索中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// OPTIONSメソッドのサポート（CORS対応）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}