'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをコンソールに記録
    console.error('Application error:', error);
  }, [error]);

  // エラーメッセージを解析
  const getErrorMessage = (error: Error) => {
    const message = error.message.toLowerCase();

    if (message.includes('quota') || message.includes('exceeded')) {
      return {
        title: 'API制限に到達しました',
        description: '現在アクセスが集中しています。5分後に再度お試しください。',
        canRetry: false,
      };
    }

    if (message.includes('network') || message.includes('fetch')) {
      return {
        title: '通信エラー',
        description: 'ネットワーク接続を確認して、再度お試しください。',
        canRetry: true,
      };
    }

    if (message.includes('not found') || message.includes('404')) {
      return {
        title: 'ページが見つかりません',
        description: 'お探しのページは存在しないか、削除された可能性があります。',
        canRetry: false,
      };
    }

    return {
      title: 'エラーが発生しました',
      description: '予期しないエラーが発生しました。しばらくしてから再度お試しください。',
      canRetry: true,
    };
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="card text-center">
          {/* エラーアイコン */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* エラータイトル */}
          <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {errorInfo.title}
          </h1>

          {/* エラー説明 */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {errorInfo.description}
          </p>

          {/* エラー詳細（開発環境のみ） */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                エラー詳細を表示
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {errorInfo.canRetry && (
              <button
                onClick={reset}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                再試行
              </button>
            )}
            <Link href="/" className="btn-secondary flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}