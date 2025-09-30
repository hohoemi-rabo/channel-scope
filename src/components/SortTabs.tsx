'use client';

import { Eye, Calendar, TrendingUp, ArrowUpDown, MessageCircle, ThumbsUp } from 'lucide-react';
import { useSortStore } from '@/lib/store';
import { SortType } from '@/types';
import { trackSortChange } from '@/lib/tracking';

interface SortOption {
  type: SortType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const sortOptions: SortOption[] = [
  {
    type: 'date',
    label: '投稿日',
    icon: <Calendar className="w-4 h-4" />,
    description: '投稿が新しい順',
  },
  {
    type: 'views',
    label: '再生数',
    icon: <Eye className="w-4 h-4" />,
    description: '再生回数の多い順',
  },
  {
    type: 'growth',
    label: '伸び率',
    icon: <TrendingUp className="w-4 h-4" />,
    description: '1日あたりの平均再生数',
  },
  {
    type: 'comments',
    label: 'コメント率',
    icon: <MessageCircle className="w-4 h-4" />,
    description: 'コメント率の高い順',
  },
  {
    type: 'likes',
    label: 'いいね率',
    icon: <ThumbsUp className="w-4 h-4" />,
    description: 'いいね率の高い順',
  },
];

export default function SortTabs() {
  const { sortType, sortOrder, setSortType, toggleSortOrder } = useSortStore();

  const getSortOrderLabel = () => {
    if (sortType === 'date') {
      return sortOrder === 'desc' ? '新しい順' : '古い順';
    }
    return sortOrder === 'desc' ? '多い順' : '少ない順';
  };

  const getSortOrderIcon = () => {
    return sortOrder === 'desc' ? '↓' : '↑';
  };

  return (
    <div className="mb-8">
      {/* ソートタブ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 mb-4">
        {sortOptions.map((option) => {
          const isActive = sortType === option.type;
          return (
            <button
              key={option.type}
              onClick={() => {
                setSortType(option.type);
                trackSortChange(option.type);
              }}
              className={`
                flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-[#FF0000] text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              {option.icon}
              <span className="text-sm sm:text-base">{option.label}</span>
              {isActive && (
                <span className="text-xs opacity-90">
                  {getSortOrderIcon()}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ソート情報と順序切り替え */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {sortOptions.find((opt) => opt.type === sortType)?.label}
          </span>
          <span className="mx-2">•</span>
          <span>
            {sortOptions.find((opt) => opt.type === sortType)?.description}
          </span>
        </div>

        {/* ソート順序切り替えボタン */}
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors self-start sm:self-auto"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>{getSortOrderLabel()}</span>
        </button>
      </div>

      {/* 区切り線 */}
      <div className="mt-6 border-b border-gray-200 dark:border-gray-700"></div>
    </div>
  );
}