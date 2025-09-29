// YouTube API Types
export interface YouTubeChannel {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  customUrl?: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  publishedAt: string;
}

export interface YouTubeVideo {
  id: string;
  channelId: string;
  title: string;
  description?: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  // 分析用の追加フィールド
  daysFromPublished?: number;
  growthRate?: number;
  commentRate?: number;
  likeRate?: number;
}

export interface VideoStatistics {
  viewCount: string;
  likeCount?: string;
  commentCount?: string;
}

export interface VideoContentDetails {
  duration: string;
  dimension?: string;
  definition?: string;
}

// API Response Types
export interface ChannelSearchResponse {
  channels: YouTubeChannel[];
  nextPageToken?: string;
}

export interface ChannelDetailsResponse {
  channel: YouTubeChannel;
  videos: YouTubeVideo[];
}

// UI State Types
export type SortType = 'views' | 'date' | 'growth' | 'comments' | 'likes';
export type SortOrder = 'asc' | 'desc';

export interface SortState {
  type: SortType;
  order: SortOrder;
}

// Error Types
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

// Badge Types
export type BadgeType = 'new' | 'trending' | 'popular';

export interface Badge {
  type: BadgeType;
  label: string;
  color: string;
}