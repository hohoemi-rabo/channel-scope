# 018: 本番環境デプロイ

## 概要
Vercelへの本番環境デプロイと設定

## 要件
- Vercelへのデプロイ
- 環境変数設定
- ドメイン設定
- SSL設定

## Todo
- [x] デプロイ準備
  - [x] vercel.json作成（リージョン: hnd1、キャッシュ設定）
  - [x] .env.example作成（環境変数テンプレート）
  - [x] DEPLOYMENT.md作成（詳細な手順書）
- [x] Vercelプロジェクト設定（ユーザー作業）
  - [x] GitHubリポジトリ連携
  - [x] ビルド設定確認
  - [x] Node.jsバージョン指定（自動検出）
- [x] 環境変数設定（ユーザー作業）
  - [x] YOUTUBE_API_KEY設定
  - [x] NEXT_PUBLIC_SITE_URL設定（layout.tsxに反映）
  - [x] metadataBase設定完了
- [ ] Vercel KV設定（ユーザー作業）
  - [ ] スキップ（インメモリキャッシュで動作）
  - [ ] 今後必要に応じて追加可能
- [x] Vercel Analytics有効化（ユーザー作業）
  - [x] コード実装済み（<Analytics />追加）
  - [x] デプロイ後に自動的にデータ収集開始
- [ ] ドメイン設定（オプション、ユーザー作業）
  - [x] デフォルトドメイン使用: https://channel-scope.vercel.app
  - [ ] カスタムドメイン設定（今後必要に応じて）
- [x] デプロイ設定（自動）
  - [x] プロダクションブランチ: main
  - [x] 自動デプロイ設定
  - [x] プレビューデプロイ設定
- [x] 最適化設定
  - [x] リージョン設定（hnd1 - Tokyo）
  - [x] キャッシュ設定（30分TTL）
  - [x] 画像最適化（next/image）
- [x] デプロイ後の確認（ユーザー作業）
  - [x] 動作確認（https://channel-scope.vercel.app）
  - [x] ソート機能確認・修正完了
  - [ ] エラーログ確認（今後モニタリング）
  - [ ] Analytics確認（データ蓄積後）
  - [ ] パフォーマンス確認（Core Web Vitals）

## 備考
- Phase: 4 (公開準備)
- 優先度: 高
- 依存関係: すべての機能実装