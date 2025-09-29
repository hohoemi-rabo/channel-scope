/**
 * シンプルなインメモリレート制限
 * 本番環境ではRedisやVercel KVを使用することを推奨
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMinutes: number = 1) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMinutes * 60 * 1000;

    // 定期的に古いエントリをクリーンアップ
    setInterval(() => this.cleanup(), 60000); // 1分ごと
  }

  /**
   * レート制限のチェック
   * @param identifier IPアドレスやユーザーIDなどの識別子
   * @returns true: リクエスト許可, false: レート制限中
   */
  checkLimit(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // エントリがない場合は新規作成
    if (!entry) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    // リセット時間を過ぎている場合
    if (now > entry.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    // リクエスト数をチェック
    if (entry.count >= this.maxRequests) {
      return false;
    }

    // カウントを増やして許可
    entry.count++;
    return true;
  }

  /**
   * 残りのリクエスト数を取得
   */
  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * リセットまでの時間を取得（秒）
   */
  getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return 0;
    }
    return Math.ceil((entry.resetTime - Date.now()) / 1000);
  }

  /**
   * 古いエントリをクリーンアップ
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// シングルトンインスタンス
export const apiRateLimiter = new RateLimiter(10, 1); // 1分間に10リクエストまで

/**
 * IPアドレスを取得するヘルパー関数
 */
export function getClientIp(request: Request): string {
  // Vercelの場合
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // CloudflareのCDNを使用している場合
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp;
  }

  // 一般的なプロキシヘッダー
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // デフォルト（開発環境など）
  return 'unknown';
}