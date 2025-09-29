# 004: YouTube Data API連携

## 概要
YouTube Data API v3との連携実装とAPIルートの構築

## 要件
- YouTube Data API v3の使用
- API制限: 1日10,000ユニット
- サーバーサイドでのAPIキー管理

## Todo
- [x] YouTube APIクライアントの作成 (lib/youtube.ts)
  - [x] API初期化処理
  - [x] エラーハンドリング
  - [x] レート制限対策
- [x] チャンネル検索APIルート (/api/youtube/search/route.ts)
  - [x] チャンネル検索エンドポイント
  - [x] レスポンス形式の定義
  - [x] エラーハンドリング
- [x] チャンネル詳細APIルート (/api/youtube/channel/[id]/route.ts)
  - [x] チャンネル情報取得
  - [x] 動画リスト取得（最新50本）
  - [x] 動画統計情報取得
- [x] APIレスポンスの型定義
  - [x] Channel型
  - [x] Video型
  - [x] Statistics型
- [x] API使用量の監視
  - [x] ユニット消費量の計算
  - [x] 制限到達時の処理

## 備考
- Phase: 1 (MVP)
- 優先度: 高
- 依存関係: 001-project-setup.md