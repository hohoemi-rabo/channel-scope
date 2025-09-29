# 004: YouTube Data API連携

## 概要
YouTube Data API v3との連携実装とAPIルートの構築

## 要件
- YouTube Data API v3の使用
- API制限: 1日10,000ユニット
- サーバーサイドでのAPIキー管理

## Todo
- [ ] YouTube APIクライアントの作成 (lib/youtube.ts)
  - [ ] API初期化処理
  - [ ] エラーハンドリング
  - [ ] レート制限対策
- [ ] チャンネル検索APIルート (/api/youtube/search/route.ts)
  - [ ] チャンネル検索エンドポイント
  - [ ] レスポンス形式の定義
  - [ ] エラーハンドリング
- [ ] チャンネル詳細APIルート (/api/youtube/channel/[id]/route.ts)
  - [ ] チャンネル情報取得
  - [ ] 動画リスト取得（最新50本）
  - [ ] 動画統計情報取得
- [ ] APIレスポンスの型定義
  - [ ] Channel型
  - [ ] Video型
  - [ ] Statistics型
- [ ] API使用量の監視
  - [ ] ユニット消費量の計算
  - [ ] 制限到達時の処理

## 備考
- Phase: 1 (MVP)
- 優先度: 高
- 依存関係: 001-project-setup.md