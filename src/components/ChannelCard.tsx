import { ExternalLink, Calendar, Users } from 'lucide-react';
import { YouTubeChannel } from '@/types';

interface ChannelCardProps {
  channel: YouTubeChannel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewOnYouTube = () => {
    const url = channel.customUrl
      ? `https://youtube.com/${channel.customUrl}`
      : `https://youtube.com/channel/${channel.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row gap-6">
        {/* チャンネルアイコン */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#FF0000] to-[#CC0000] rounded-full flex items-center justify-center overflow-hidden">
            {channel.thumbnail ? (
              <img
                src={channel.thumbnail}
                alt={channel.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="w-12 h-12 md:w-16 md:h-16 text-white" />
            )}
          </div>
        </div>

        {/* チャンネル情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">
                {channel.title}
              </h1>

              {channel.customUrl && (
                <p className="text-[#FF0000] text-sm mb-2">
                  {channel.customUrl}
                </p>
              )}

              {channel.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                  {channel.description.length > 200
                    ? `${channel.description.substring(0, 200)}...`
                    : channel.description
                  }
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>開設日: {formatDate(channel.publishedAt)}</span>
                </div>
              </div>
            </div>

            {/* YouTubeで見るボタン */}
            <div className="flex-shrink-0">
              <button
                onClick={handleViewOnYouTube}
                className="btn-primary flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                YouTubeで見る
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 統計情報（モバイル用コンパクト表示） */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 md:hidden">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold">{channel.videoCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">動画</div>
          </div>
          <div>
            <div className="text-lg font-bold">{channel.subscriberCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">登録者</div>
          </div>
          <div>
            <div className="text-lg font-bold">{(channel.viewCount / 10000).toFixed(1)}万</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">総再生数</div>
          </div>
        </div>
      </div>
    </div>
  );
}