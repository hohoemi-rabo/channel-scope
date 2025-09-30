# デプロイ手順書

チャンネルスコープをVercelにデプロイする手順です。

## 前提条件

- GitHubアカウント
- Vercelアカウント（GitHubアカウントでサインアップ推奨）
- YouTube Data API v3のAPIキー

## 1. YouTube Data API キーの取得

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 「APIとサービス」→「ライブラリ」から「YouTube Data API v3」を検索して有効化
4. 「APIとサービス」→「認証情報」から「認証情報を作成」→「APIキー」を選択
5. APIキーを作成後、以下の制限を設定（推奨）：
   - アプリケーションの制限: **IPアドレス**（サーバーサイドからの呼び出しのため）
   - 許可するIPアドレス: Vercel IPアドレス範囲を追加
     - `76.76.21.0/24` (Vercel Serverless Functions)
     - または「なし」（開発中は制限なし、本番で追加推奨）
   - API制限: YouTube Data API v3のみ許可

   ⚠️ 注意: VercelのIPアドレスは動的に変わるため、最も安全なのは以下の方法：
   - 開発中: 制限なし
   - 本番: Google Cloud Console → API → クォータでモニタリング
6. APIキーをコピーして保存

## 2. GitHubリポジトリへのプッシュ

```bash
# まだGitリポジトリを初期化していない場合
git init
git add .
git commit -m "Initial commit"

# GitHubリポジトリを作成後
git remote add origin https://github.com/yourusername/channel-scope.git
git branch -M main
git push -u origin main
```

## 3. Vercelへのデプロイ

### 方法1: Vercel CLI（推奨）

```bash
# Vercel CLIのインストール（初回のみ）
npm install -g vercel

# ログイン
vercel login

# デプロイ
vercel

# 本番環境へのデプロイ
vercel --prod
```

### 方法2: Vercel Dashboard

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. プロジェクト名を設定（例: `channel-scope`）
5. Framework Preset: `Next.js` （自動検出）
6. Root Directory: `./`
7. Build Command: `npm run build`
8. Output Directory: `.next` （自動設定）
9. Install Command: `npm install`

## 4. 環境変数の設定

Vercel Dashboardで以下の環境変数を設定：

### 必須の環境変数

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `YOUTUBE_API_KEY` | `your_api_key` | YouTube Data API v3のAPIキー |

### オプションの環境変数

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | OGP画像用のサイトURL |

### 環境変数の設定手順

1. Vercel Dashboard → プロジェクトを選択
2. 「Settings」→「Environment Variables」
3. 各環境変数を追加：
   - Name: `YOUTUBE_API_KEY`
   - Value: 取得したAPIキー
   - Environment: Production, Preview, Development（すべて選択）
4. 「Save」をクリック

## 5. Vercel KVの設定（キャッシュ用）

1. Vercel Dashboard → プロジェクトを選択
2. 「Storage」→「Create Database」
3. 「KV」を選択
4. Database名を入力（例: `channel-scope-cache`）
5. Region: `hnd1 - Tokyo, Japan`（推奨）
6. 「Create」をクリック
7. 「Connect」→ プロジェクトを選択
8. 環境変数が自動的に設定される（`KV_REST_API_URL`, `KV_REST_API_TOKEN`）

## 6. Vercel Analyticsの有効化

1. Vercel Dashboard → プロジェクトを選択
2. 「Analytics」タブをクリック
3. 「Enable Analytics」をクリック
4. プランを選択（Hobby: 無料、Pro: 有料）
5. カスタムイベントを確認可能になる

## 7. metadataBaseの設定

デプロイ後、実際のドメインが確定したら、`src/app/layout.tsx`を更新：

```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-actual-domain.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // ... 残りの設定
};
```

環境変数 `NEXT_PUBLIC_SITE_URL` を設定：
```
NEXT_PUBLIC_SITE_URL=https://your-actual-domain.vercel.app
```

変更をコミット＆プッシュして再デプロイ。

## 8. カスタムドメインの設定（オプション）

1. Vercel Dashboard → プロジェクトを選択
2. 「Settings」→「Domains」
3. 「Add」をクリック
4. ドメイン名を入力
5. DNSレコードを設定（Vercelが指示を表示）
6. SSL証明書は自動的に発行される

## 9. デプロイ後の確認

### 動作確認

1. デプロイされたURLにアクセス
2. チャンネル検索が正常に動作するか確認
3. チャンネル詳細ページが表示されるか確認
4. ソート機能が動作するか確認
5. シェア機能が動作するか確認

### エラー確認

1. Vercel Dashboard → 「Deployments」
2. 最新のデプロイをクリック
3. 「Functions」タブでエラーログを確認
4. 「Runtime Logs」でリアルタイムログを確認

### Analytics確認

1. Vercel Dashboard → 「Analytics」
2. ページビュー、カスタムイベントを確認
3. Core Web Vitalsを確認

## 10. 継続的デプロイの設定

- `main`ブランチへのプッシュ → 本番環境に自動デプロイ
- プルリクエスト → プレビューデプロイが自動作成
- ブランチごとにプレビューURL発行

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドテスト
npm run build

# エラーログを確認
vercel logs --prod
```

### API制限エラー

- YouTube APIの1日のクォータは10,000ユニット
- 制限に達した場合は翌日リセット
- Google Cloud Consoleでクォータ使用量を確認

### キャッシュが効かない

- Vercel KVが正しく接続されているか確認
- 環境変数 `KV_REST_API_URL`, `KV_REST_API_TOKEN` が設定されているか確認
- ログで `[Cache HIT]` / `[Cache MISS]` を確認

### 環境変数が反映されない

- 環境変数を変更した後は、再デプロイが必要
- Vercel Dashboard → 「Deployments」→「Redeploy」

## セキュリティチェックリスト

- [ ] APIキーに適切な制限を設定
- [ ] 環境変数がGitにコミットされていない（.gitignoreで除外）
- [ ] HTTPSが有効（Vercelは自動設定）
- [ ] CORS設定が適切
- [ ] レート制限が実装されている

## パフォーマンスチェックリスト

- [ ] 画像最適化（next/image使用）
- [ ] コード分割（dynamic import使用）
- [ ] キャッシュ設定（Vercel KV使用）
- [ ] Edge Functionsの利用（一部API）
- [ ] Core Web Vitalsスコア確認

## サポート

問題が発生した場合：
1. [Vercel Documentation](https://vercel.com/docs)
2. [Next.js Documentation](https://nextjs.org/docs)
3. [GitHub Issues](https://github.com/yourusername/channel-scope/issues)

---

**デプロイ完了後は、必ず動作確認とAnalyticsの設定を行ってください。**