import { NextRequest, NextResponse } from 'next/server';
import youtubeClient from '@/lib/youtube';
import { ChannelDetailsResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const channelId = params.id;

    // チャンネルIDのバリデーション
    if (!channelId || channelId.length < 10) {
      return NextResponse.json(
        { error: '無効なチャンネルIDです' },
        { status: 400 }
      );
    }

    // 並行してチャンネル情報と動画リストを取得
    const [channel, videos] = await Promise.all([
      youtubeClient.getChannelById(channelId),
      youtubeClient.getChannelVideos(channelId, 50),
    ]);

    // チャンネルが見つからない場合
    if (!channel) {
      return NextResponse.json(
        { error: '該当するチャンネルが見つかりません' },
        { status: 404 }
      );
    }

    const response: ChannelDetailsResponse = {
      channel,
      videos,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Channel API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'An error occurred';

    // API制限エラーの判定
    if (errorMessage.includes('quotaExceeded')) {
      return NextResponse.json(
        { error: '現在アクセスが集中しています。5分後に再度お試しください。' },
        { status: 429 }
      );
    }

    // チャンネルが見つからない場合
    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        { error: '該当するチャンネルが見つかりません' },
        { status: 404 }
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
      { error: 'チャンネル情報の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// OPTIONSメソッドのサポート（CORS対応）
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}