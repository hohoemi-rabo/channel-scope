import { useState, useMemo, useEffect } from 'react';
import { YouTubeVideo } from '@/types';
import { useSortStore } from '@/lib/store';
import { sortVideos } from '@/lib/sort-utils';
import VideoCard from './VideoCard';

interface VideoListProps {
  videos: YouTubeVideo[];
}

export default function VideoList({ videos }: VideoListProps) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { sortType, sortOrder } = useSortStore();

  // ソートされた動画リストをメモ化
  const sortedVideos = useMemo(() => {
    return sortVideos(videos, sortType, sortOrder);
  }, [videos, sortType, sortOrder]);

  // ソート条件が変わったときに表示数をリセットしてアニメーション
  useEffect(() => {
    setIsTransitioning(true);
    setVisibleCount(10);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [sortType, sortOrder]);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, sortedVideos.length));
  };

  const visibleVideos = useMemo(() => {
    return sortedVideos.slice(0, visibleCount);
  }, [sortedVideos, visibleCount]);

  if (videos.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v12h12V6H6zm3 3a1 1 0 112 0v6a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V9z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
          動画が見つかりません
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          このチャンネルには表示可能な動画がありません。
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 動画リスト */}
      <div
        className={`space-y-6 transition-opacity duration-150 ${
          isTransitioning ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {visibleVideos.map((video, index) => (
          <div
            key={`${sortType}-${sortOrder}-${video.id}`}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <VideoCard video={video} />
          </div>
        ))}
      </div>

      {/* もっと見るボタン */}
      {visibleCount < sortedVideos.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="btn-secondary"
          >
            さらに{Math.min(10, sortedVideos.length - visibleCount)}本の動画を表示
            <span className="text-sm ml-2">
              ({visibleCount}/{sortedVideos.length})
            </span>
          </button>
        </div>
      )}

      {/* 全件表示済みの場合 */}
      {visibleCount >= sortedVideos.length && sortedVideos.length > 10 && (
        <div className="text-center mt-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            全{sortedVideos.length}本の動画を表示しました
          </p>
        </div>
      )}
    </div>
  );
}