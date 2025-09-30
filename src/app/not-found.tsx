import { FileQuestion, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="card text-center">
          {/* 404アイコン */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800">
              <FileQuestion className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          {/* 404タイトル */}
          <div className="mb-3">
            <div className="text-6xl font-bold text-[#FF0000] mb-2">404</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ページが見つかりません
            </h1>
          </div>

          {/* 説明 */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            お探しのページは存在しないか、移動または削除された可能性があります。
          </p>

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              ホームに戻る
            </Link>
            <Link href="/" className="btn-secondary flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              チャンネルを検索
            </Link>
          </div>

          {/* ヒント */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              URLが正しいか確認するか、ホームページから再度検索してください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}