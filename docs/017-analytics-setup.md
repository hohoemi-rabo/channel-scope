# 017: Vercel Analytics設定

## 概要
ユーザー行動分析のためのVercel Analytics設定と実装

## 要件
- Vercel Analyticsの設定
- ユーザーアクセス数の監視
- エラー発生率の監視
- パフォーマンス監視

## Todo
- [x] Vercel Analytics設定
  - [x] パッケージインストール (@vercel/analytics)
  - [x] 初期化コード追加（layout.tsxに<Analytics />追加）
  - [ ] Vercelダッシュボードで有効化（デプロイ後に設定）
- [x] カスタムイベントの実装
  - [x] 検索イベント（trackChannelSearch）
  - [x] チャンネル表示イベント（trackChannelView）
  - [x] ソート変更イベント（trackSortChange）
  - [x] シェアボタンクリック（trackShare）
  - [x] エラー発生イベント（trackError）
  - [x] API制限到達イベント（trackAPILimit）
- [x] トラッキングユーティリティ作成
  - [x] lib/tracking.ts作成
  - [x] SearchBarにトラッキング追加
  - [x] SortTabsにトラッキング追加
  - [x] ShareButtonにトラッキング追加
  - [x] チャンネルページにトラッキング追加
- [ ] パフォーマンス監視
  - [x] Core Web Vitals計測（Vercel Analytics自動計測）
  - [ ] カスタムパフォーマンス計測（今後実装）
- [ ] ダッシュボード設定
  - [ ] Vercelダッシュボードで確認（デプロイ後）
  - [ ] カスタムダッシュボード作成（デプロイ後）
  - [ ] アラート設定（デプロイ後）
- [x] プライバシー対応
  - [x] 個人情報は送信しない設計
  - [x] チャンネル名は50文字まで、エラーメッセージは100文字まで制限

## 備考
- Phase: 4 (公開準備)
- 優先度: 中
- 依存関係: 基本機能すべて