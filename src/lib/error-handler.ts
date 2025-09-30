/**
 * エラーハンドリングユーティリティ
 */

export enum ErrorType {
  CHANNEL_NOT_FOUND = 'CHANNEL_NOT_FOUND',
  API_QUOTA_EXCEEDED = 'API_QUOTA_EXCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  userMessage: string;
  canRetry: boolean;
  retryAfter?: number; // 秒
}

/**
 * エラータイプを判定
 */
export function classifyError(error: unknown): AppError {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // チャンネル未検出
  if (
    lowerMessage.includes('not found') ||
    lowerMessage.includes('channel not found') ||
    lowerMessage.includes('該当する') ||
    lowerMessage.includes('見つかりません')
  ) {
    return {
      type: ErrorType.CHANNEL_NOT_FOUND,
      message: errorMessage,
      userMessage: '該当するチャンネルが見つかりません。チャンネル名を確認して再度お試しください。',
      canRetry: false,
    };
  }

  // API制限到達
  if (
    lowerMessage.includes('quota') ||
    lowerMessage.includes('exceeded') ||
    lowerMessage.includes('quotaexceeded')
  ) {
    return {
      type: ErrorType.API_QUOTA_EXCEEDED,
      message: errorMessage,
      userMessage: '現在アクセスが集中しています。5分後に再度お試しください。',
      canRetry: false,
      retryAfter: 300, // 5分
    };
  }

  // レート制限
  if (
    lowerMessage.includes('rate limit') ||
    lowerMessage.includes('too many requests') ||
    lowerMessage.includes('リクエスト制限')
  ) {
    return {
      type: ErrorType.RATE_LIMIT_EXCEEDED,
      message: errorMessage,
      userMessage: 'リクエスト制限に達しました。しばらく待ってから再度お試しください。',
      canRetry: true,
      retryAfter: 60, // 1分
    };
  }

  // ネットワークエラー
  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('timeout')
  ) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: errorMessage,
      userMessage: '通信エラーが発生しました。ネットワーク接続を確認して再度お試しください。',
      canRetry: true,
    };
  }

  // 不正なリクエスト
  if (
    lowerMessage.includes('invalid') ||
    lowerMessage.includes('bad request') ||
    lowerMessage.includes('無効')
  ) {
    return {
      type: ErrorType.INVALID_REQUEST,
      message: errorMessage,
      userMessage: '入力内容に誤りがあります。内容を確認して再度お試しください。',
      canRetry: false,
    };
  }

  // その他のエラー
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: errorMessage,
    userMessage: '予期しないエラーが発生しました。しばらくしてから再度お試しください。',
    canRetry: true,
  };
}

/**
 * エラーをログに記録
 */
export function logError(error: AppError, context?: Record<string, unknown>): void {
  console.error('[App Error]', {
    type: error.type,
    message: error.message,
    userMessage: error.userMessage,
    canRetry: error.canRetry,
    retryAfter: error.retryAfter,
    context,
    timestamp: new Date().toISOString(),
  });

  // 本番環境では外部サービス（Sentry等）にエラーを送信することも可能
  if (process.env.NODE_ENV === 'production') {
    // TODO: Sentry等への送信
  }
}

/**
 * リトライ可能かチェック
 */
export function canRetry(error: AppError): boolean {
  return error.canRetry;
}

/**
 * リトライまでの待機時間を取得（ミリ秒）
 */
export function getRetryDelay(error: AppError, attempt: number = 1): number {
  // 指定された待機時間があればそれを使用
  if (error.retryAfter) {
    return error.retryAfter * 1000;
  }

  // エクスポネンシャルバックオフ: 1秒, 2秒, 4秒, 8秒...
  const baseDelay = 1000;
  const maxDelay = 30000; // 最大30秒
  const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);

  return delay;
}