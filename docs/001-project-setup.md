# 001: プロジェクト初期セットアップ

## 概要
Next.js 15 App Routerを使用したプロジェクトの初期設定と基本構造の構築

## 要件
- Next.js 15.x (App Router)
- TypeScript 5.x
- Tailwind CSS 3.4.17
- 必要なパッケージのインストール

## Todo
- [x] 必要なパッケージをインストール
  - [x] Framer Motion (アニメーション)
  - [x] Zustand (状態管理)
  - [x] Lucide React (アイコン)
  - [x] Recharts (グラフ)
- [x] ディレクトリ構造の作成
  - [x] app/channel/[id]
  - [x] app/api/youtube
  - [x] app/api/og
  - [x] components
  - [x] lib
  - [x] types
- [x] 環境変数の設定
  - [x] YOUTUBE_API_KEY (.env.local.exampleファイル作成済み)
- [x] TypeScript型定義ファイルの作成 (types/index.ts)
- [x] 基本的なレイアウト設定 (app/layout.tsx)

## 備考
- Phase: 1 (MVP)
- 優先度: 高
- 依存関係: なし