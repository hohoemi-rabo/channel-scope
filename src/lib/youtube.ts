import { YouTubeChannel, YouTubeVideo, VideoStatistics, VideoContentDetails } from '@/types';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error('YouTube API key is not configured');
}

/**
 * YouTube API クライアント
 */
class YouTubeAPIClient {
  private apiKey: string;

  constructor() {
    if (!API_KEY) {
      console.error('YOUTUBE_API_KEY is not set. Current value:', API_KEY);
      throw new Error('YouTube API key is not configured. Please set YOUTUBE_API_KEY in your .env.local file');
    }
    this.apiKey = API_KEY;
    console.log('YouTube API Client initialized successfully');
  }

  /**
   * APIリクエストを送信
   */
  private async fetchAPI(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${YOUTUBE_API_BASE_URL}${endpoint}`);
    url.searchParams.append('key', this.apiKey);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    console.log('Fetching YouTube API:', url.toString().replace(this.apiKey, 'HIDDEN'));

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', response.status, errorText);

        try {
          const error = JSON.parse(errorText);
          throw new Error(error.error?.message || `API Error: ${response.status}`);
        } catch {
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('YouTube API Error:', error);
      throw error;
    }
  }

  /**
   * チャンネル名で検索
   */
  async searchChannels(query: string): Promise<YouTubeChannel[]> {
    try {
      const searchResponse = await this.fetchAPI('/search', {
        part: 'snippet',
        type: 'channel',
        q: query,
        maxResults: '10',
      });

      if (!searchResponse.items || searchResponse.items.length === 0) {
        return [];
      }

      // チャンネルIDのリストを取得
      const channelIds = searchResponse.items.map((item: any) => item.id.channelId).join(',');

      // チャンネルの詳細情報を取得
      const channelsResponse = await this.fetchAPI('/channels', {
        part: 'snippet,statistics',
        id: channelIds,
      });

      return channelsResponse.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        customUrl: item.snippet.customUrl,
        subscriberCount: parseInt(item.statistics.subscriberCount || '0'),
        videoCount: parseInt(item.statistics.videoCount || '0'),
        viewCount: parseInt(item.statistics.viewCount || '0'),
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      console.error('Error searching channels:', error);
      throw error;
    }
  }

  /**
   * チャンネルIDから詳細情報を取得
   */
  async getChannelById(channelId: string): Promise<YouTubeChannel | null> {
    try {
      const response = await this.fetchAPI('/channels', {
        part: 'snippet,statistics',
        id: channelId,
      });

      if (!response.items || response.items.length === 0) {
        return null;
      }

      const item = response.items[0];
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        customUrl: item.snippet.customUrl,
        subscriberCount: parseInt(item.statistics.subscriberCount || '0'),
        videoCount: parseInt(item.statistics.videoCount || '0'),
        viewCount: parseInt(item.statistics.viewCount || '0'),
        publishedAt: item.snippet.publishedAt,
      };
    } catch (error) {
      console.error('Error fetching channel:', error);
      throw error;
    }
  }

  /**
   * チャンネルの動画リストを取得
   */
  async getChannelVideos(channelId: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
    try {
      // 動画リストを取得
      const searchResponse = await this.fetchAPI('/search', {
        part: 'snippet',
        channelId: channelId,
        order: 'date',
        type: 'video',
        maxResults: maxResults.toString(),
      });

      if (!searchResponse.items || searchResponse.items.length === 0) {
        return [];
      }

      // 動画IDのリストを取得
      const videoIds = searchResponse.items.map((item: any) => item.id.videoId).join(',');

      // 動画の詳細情報（統計と時間）を取得
      const videosResponse = await this.fetchAPI('/videos', {
        part: 'statistics,contentDetails',
        id: videoIds,
      });

      // 動画情報をマップに変換
      const videoDetailsMap = new Map<string, { statistics: VideoStatistics; contentDetails: VideoContentDetails }>();
      videosResponse.items.forEach((item: any) => {
        videoDetailsMap.set(item.id, {
          statistics: item.statistics,
          contentDetails: item.contentDetails,
        });
      });

      // 結果を整形
      return searchResponse.items.map((item: any) => {
        const details = videoDetailsMap.get(item.id.videoId);
        const publishedAt = new Date(item.snippet.publishedAt);
        const now = new Date();
        const daysFromPublished = Math.floor((now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60 * 24));

        const viewCount = parseInt(details?.statistics?.viewCount || '0');
        const likeCount = parseInt(details?.statistics?.likeCount || '0');
        const commentCount = parseInt(details?.statistics?.commentCount || '0');

        return {
          id: item.id.videoId,
          channelId: channelId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          publishedAt: item.snippet.publishedAt,
          duration: this.parseDuration(details?.contentDetails?.duration || 'PT0S'),
          viewCount,
          likeCount,
          commentCount,
          daysFromPublished,
          growthRate: daysFromPublished > 0 ? Math.round(viewCount / daysFromPublished) : viewCount,
          commentRate: viewCount > 0 ? parseFloat(((commentCount / viewCount) * 100).toFixed(2)) : 0,
          likeRate: viewCount > 0 ? parseFloat(((likeCount / viewCount) * 100).toFixed(2)) : 0,
        };
      });
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      throw error;
    }
  }

  /**
   * ISO 8601形式の動画時間を読みやすい形式に変換
   */
  private parseDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * API使用量の計算（参考用）
   */
  calculateQuotaCost(operation: 'search' | 'channelDetails' | 'videoList'): number {
    const costs = {
      search: 100,
      channelDetails: 3,
      videoList: 100 + 3, // search + video details
    };
    return costs[operation];
  }
}

// シングルトンインスタンスをエクスポート
const youtubeClient = new YouTubeAPIClient();
export default youtubeClient;