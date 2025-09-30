/**
 * 動画分析指標の計算ユーティリティ
 */

/**
 * 公開からの経過日数を計算
 * @param publishedAt 公開日時（ISO 8601形式）
 * @returns 経過日数
 */
export function calculateDaysSincePublished(publishedAt: string): number {
  const publishedDate = new Date(publishedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - publishedDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 伸び率スコアを計算
 * 伸び率スコア = 再生数 ÷ (公開からの日数 + 1)
 *
 * @param viewCount 再生数
 * @param publishedAt 公開日時
 * @returns 伸び率スコア
 */
export function calculateGrowthRate(viewCount: number, publishedAt: string): number {
  const daysSincePublished = calculateDaysSincePublished(publishedAt);
  // ゼロ除算を防ぐため、日数に+1する
  const growthRate = viewCount / (daysSincePublished + 1);
  return Math.round(growthRate);
}

/**
 * コメント率を計算
 * コメント率 = (コメント数 ÷ 再生数) × 100
 *
 * @param commentCount コメント数
 * @param viewCount 再生数
 * @returns コメント率（%）
 */
export function calculateCommentRate(commentCount: number, viewCount: number): number {
  if (viewCount === 0) return 0;
  const rate = (commentCount / viewCount) * 100;
  return Math.round(rate * 100) / 100; // 小数点2桁まで
}

/**
 * いいね率を計算
 * いいね率 = (いいね数 ÷ 再生数) × 100
 *
 * @param likeCount いいね数
 * @param viewCount 再生数
 * @returns いいね率（%）
 */
export function calculateLikeRate(likeCount: number, viewCount: number): number {
  if (viewCount === 0) return 0;
  const rate = (likeCount / viewCount) * 100;
  return Math.round(rate * 100) / 100; // 小数点2桁まで
}

/**
 * 急上昇判定
 * 以下の条件を満たす動画を急上昇とみなす：
 * - 公開から7日以内
 * - 伸び率スコアが10,000以上
 *
 * @param growthRate 伸び率スコア
 * @param publishedAt 公開日時
 * @returns 急上昇判定
 */
export function isTrending(growthRate: number, publishedAt: string): boolean {
  const daysSincePublished = calculateDaysSincePublished(publishedAt);
  return daysSincePublished <= 7 && growthRate >= 10000;
}

/**
 * 新着判定
 * 公開から3日以内の動画を新着とみなす
 *
 * @param publishedAt 公開日時
 * @returns 新着判定
 */
export function isNew(publishedAt: string): boolean {
  const daysSincePublished = calculateDaysSincePublished(publishedAt);
  return daysSincePublished <= 3;
}

/**
 * エンゲージメント率を計算
 * エンゲージメント率 = ((いいね数 + コメント数) ÷ 再生数) × 100
 *
 * @param likeCount いいね数
 * @param commentCount コメント数
 * @param viewCount 再生数
 * @returns エンゲージメント率（%）
 */
export function calculateEngagementRate(
  likeCount: number,
  commentCount: number,
  viewCount: number
): number {
  if (viewCount === 0) return 0;
  const rate = ((likeCount + commentCount) / viewCount) * 100;
  return Math.round(rate * 100) / 100; // 小数点2桁まで
}