/**
 * 数字を日本語形式（万、億）にフォーマット
 * @param num 数値
 * @param decimals 小数点以下の桁数（デフォルト: 1）
 * @returns フォーマットされた文字列
 */
export function formatJapaneseNumber(num: number, decimals: number = 1): string {
  if (num >= 100000000) {
    // 1億以上
    const value = num / 100000000;
    return value % 1 === 0
      ? `${Math.floor(value)}億`
      : `${value.toFixed(decimals)}億`;
  } else if (num >= 10000) {
    // 1万以上
    const value = num / 10000;
    return value % 1 === 0
      ? `${Math.floor(value)}万`
      : `${value.toFixed(decimals)}万`;
  } else {
    // 1万未満
    return num.toLocaleString();
  }
}

/**
 * 数字を日本語形式（万、億）にフォーマット（人を付ける）
 * @param num 数値
 * @returns フォーマットされた文字列
 */
export function formatJapaneseSubscribers(num: number): string {
  return `${formatJapaneseNumber(num)}人`;
}

/**
 * 数字を日本語形式（万、億）にフォーマット（回を付ける）
 * @param num 数値
 * @returns フォーマットされた文字列
 */
export function formatJapaneseViews(num: number): string {
  return `${formatJapaneseNumber(num)}回`;
}
