/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function APITestPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelId, setChannelId] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [channelResults, setChannelResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // チャンネル検索のテスト
  const testSearchAPI = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'APIエラー');
      }

      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // チャンネル詳細の取得テスト
  const testChannelAPI = async () => {
    if (!channelId.trim()) return;

    setLoading(true);
    setError(null);
    setChannelResults(null);

    try {
      const response = await fetch(`/api/youtube/channel/${channelId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'APIエラー');
      }

      setChannelResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">YouTube API テストページ</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          エラー: {error}
        </div>
      )}

      {/* チャンネル検索テスト */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">1. チャンネル検索API</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          エンドポイント: GET /api/youtube/search?q=チャンネル名
        </p>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="例: HIKAKIN"
            className="input-field flex-1"
            onKeyDown={(e) => e.key === 'Enter' && testSearchAPI()}
          />
          <button
            onClick={testSearchAPI}
            disabled={loading || !searchQuery.trim()}
            className="btn-primary flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            検索テスト
          </button>
        </div>

        {searchResults && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="font-semibold mb-2">検索結果: {searchResults.channels?.length || 0}件</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.channels?.map((channel: any) => (
                <div key={channel.id} className="p-2 bg-white dark:bg-gray-700 rounded">
                  <p className="font-medium">{channel.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ID: {channel.id} | 登録者: {channel.subscriberCount?.toLocaleString()}人
                  </p>
                  <button
                    onClick={() => setChannelId(channel.id)}
                    className="text-xs text-blue-500 hover:underline mt-1"
                  >
                    このIDをチャンネル詳細テストに使用
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* チャンネル詳細テスト */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">2. チャンネル詳細API</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          エンドポイント: GET /api/youtube/channel/[channelId]
        </p>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="チャンネルID (例: UCZf__ehlCEBPop-_sldpBUQ)"
            className="input-field flex-1"
            onKeyDown={(e) => e.key === 'Enter' && testChannelAPI()}
          />
          <button
            onClick={testChannelAPI}
            disabled={loading || !channelId.trim()}
            className="btn-primary"
          >
            詳細取得テスト
          </button>
        </div>

        {channelResults && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <div className="mb-4">
              <p className="font-semibold">チャンネル情報:</p>
              <p>{channelResults.channel?.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                登録者: {channelResults.channel?.subscriberCount?.toLocaleString()}人 |
                動画数: {channelResults.channel?.videoCount}本
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">最新動画: {channelResults.videos?.length || 0}本</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {channelResults.videos?.slice(0, 5).map((video: any) => (
                  <div key={video.id} className="p-2 bg-white dark:bg-gray-700 rounded text-xs">
                    <p className="font-medium truncate">{video.title}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      再生数: {video.viewCount?.toLocaleString()} |
                      いいね率: {video.likeRate}% |
                      コメント率: {video.commentRate}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <p>APIを呼び出し中...</p>
          </div>
        </div>
      )}
    </div>
  );
}