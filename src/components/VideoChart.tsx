'use client';

import { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { YouTubeVideo } from '@/types';
import { TrendingUp } from 'lucide-react';

interface VideoChartProps {
  videos: YouTubeVideo[];
  limit?: number;
}

export default function VideoChart({ videos, limit = 10 }: VideoChartProps) {
  // 最新の動画を取得してデータを整形
  const chartData = useMemo(() => {
    // 投稿日順にソート（新しい順）
    const sortedVideos = [...videos]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);

    // 古い順に並べ替えて、グラフで左から右に時系列表示
    return sortedVideos.reverse().map((video, index) => ({
      name: formatDate(video.publishedAt),
      fullTitle: video.title,
      views: video.viewCount,
      likes: video.likeCount,
      comments: video.commentCount,
      index: index + 1,
    }));
  }, [videos, limit]);

  // 数値のフォーマット
  const formatNumber = (num: number): string => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}億`;
    }
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(1)}千万`;
    }
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toLocaleString();
  };

  // 日付フォーマット（M/D形式）
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { fullTitle: string; name: string; views: number; likes: number; comments: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-sm mb-2 line-clamp-2">{data.fullTitle}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              投稿日: <span className="font-medium text-gray-900 dark:text-gray-100">{data.name}</span>
            </p>
            <p className="text-[#FF0000]">
              再生数: <span className="font-bold">{formatNumber(data.views)}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              いいね: <span className="font-medium">{formatNumber(data.likes)}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              コメント: <span className="font-medium">{formatNumber(data.comments)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          グラフ表示に十分なデータがありません
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-[#FF0000]" />
        <h2 className="text-xl font-bold">再生数推移</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          （最新{chartData.length}本）
        </span>
      </div>

      {/* グラフ */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              stroke="currentColor"
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              stroke="currentColor"
              tickFormatter={formatNumber}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorViews)"
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 凡例 */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-emerald-500"></div>
          <span>再生数</span>
        </div>
      </div>
    </div>
  );
}