# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using the App Router architecture with TypeScript, React 19, and Tailwind CSS.

## Essential Commands

```bash
# Development
npm run dev        # Start development server with Turbopack at http://localhost:3000

# Production
npm run build      # Build for production with Turbopack
npm run start      # Start production server

# Code Quality
npm run lint       # Run ESLint
```

## Architecture

### Directory Structure
- `/src/app/` - Next.js App Router pages and components
  - `layout.tsx` - Root layout with Geist fonts
  - `page.tsx` - Main page component
  - `globals.css` - Global styles with Tailwind directives
- `/public/` - Static assets (SVG icons)

### Key Technologies
- **Next.js 15.5.4** with App Router and Turbopack
- **React 19.1.0**
- **TypeScript 5** with strict mode
- **Tailwind CSS 3.4.17** for styling
- **Geist fonts** (Sans and Mono) from Vercel

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)

## Styling Approach

The project uses Tailwind CSS with CSS variables for theming:
- Dark/light mode support via CSS custom properties
- Theme colors defined in `globals.css` using `--background` and `--foreground` variables
- Tailwind config extends these as `background` and `foreground` utilities

## Next.js App Router Best Practices

### File Conventions
- `page.tsx` - Defines a route's UI
- `layout.tsx` - Shared UI for a segment and its children
- `loading.tsx` - Loading UI for a segment
- `error.tsx` - Error UI for a segment (must be Client Component with 'use client')
- `not-found.tsx` - 404 UI for a segment
- `route.ts` - API endpoint (cannot coexist with page.tsx)

### Component Patterns
- **Server Components by default** - Only add 'use client' when needed for:
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, etc.)
  - React hooks (useState, useEffect, etc.)
- **Async Components** - Server Components can be async for data fetching
- **Client Components** - Place 'use client' at the top of the file, as high in the tree as needed

### Data Fetching
- Fetch data directly in Server Components (no useEffect needed)
- Use `fetch()` with Next.js extensions for caching and revalidation
- Parallel data fetching with Promise.all() when possible
- Use Suspense boundaries for streaming and progressive rendering

### Routing
- Use `<Link>` from 'next/link' for client-side navigation
- Dynamic routes: `[slug]`, catch-all: `[...slug]`, optional catch-all: `[[...slug]]`
- Route Groups: `(folder-name)` for organization without affecting URL
- Parallel Routes: `@folder` for rendering multiple pages simultaneously
- Intercepting Routes: `(.)folder` for modal patterns

### Performance
- Automatic code splitting per route
- Prefetching: `<Link>` components automatically prefetch routes
- Image optimization: Use `next/image` for automatic optimization
- Font optimization: Use `next/font` for automatic optimization
- Metadata: Use `generateMetadata` for dynamic SEO

### Server Actions
- Use 'use server' directive for server-side mutations
- Can be used in Server and Client Components
- Progressive enhancement friendly
- Automatic revalidation with `revalidatePath()` or `revalidateTag()`

## プロジェクト要件概要（REQUIREMENTS.md より）

### サービス概要
**チャンネルスコープ（ChannelScope）** - YouTubeチャンネルの成長を可視化する無料分析ツール

### 主要機能
1. **チャンネル検索** - チャンネル名の部分一致検索、最大10件の候補表示
2. **動画分析** - 最新50本の動画データを取得・表示
3. **ソート機能** - 再生数、投稿日、伸び率、コメント率、いいね率でソート可能
4. **データ可視化** - 最新10本の再生数推移グラフ（Recharts使用）
5. **SNS共有** - X（Twitter）シェア機能、動的OGP画像生成

### 技術要件
- **API**: YouTube Data API v3（1日10,000ユニット制限）
- **キャッシュ**: Vercel KVで30分間保持
- **OGP生成**: @vercel/og使用
- **状態管理**: Zustand
- **グラフ**: Recharts
- **アニメーション**: Framer Motion

### API エンドポイント
- `/api/youtube/search` - チャンネル検索
- `/api/youtube/channel/[id]` - チャンネル詳細と動画リスト
- `/api/og` - OGP画像動的生成

### 実装フェーズ
1. **Phase 1 (MVP)**: 基本UI、YouTube API連携、検索・表示機能
2. **Phase 2**: 分析機能、グラフ表示、ソート機能
3. **Phase 3**: キャッシュ実装、OGP生成、SNS共有
4. **Phase 4**: 公開準備、Analytics設定、本番デプロイ

## チケット管理

### チケットファイル
プロジェクトの要件と機能は `/docs` ディレクトリ内のチケットファイルで管理されています。
各チケットには連番（001-019）が振られています。

### Todo管理
各チケット内のTodoは以下のように管理します：
- `- [ ]` : 未完了のタスク
- `- [x]` : 完了したタスク

タスクを完了したら、チェックボックスに `x` を入れて完了状態にしてください。

### 実装フェーズ
- **Phase 1 (MVP)**: 001-006 - 基本機能の実装
- **Phase 2 (分析)**: 007-010 - 分析機能の追加
- **Phase 3 (最適化)**: 011-015 - パフォーマンス最適化とキャッシュ
- **Phase 4 (公開)**: 016-019 - 本番環境準備

### 優先度
- **高**: 必須機能、ブロッカーとなる可能性がある
- **中**: 重要だが後回しにできる
- **低**: nice-to-have機能

## 開発メモ

開発中のメモや備忘録は `/MEMO.md` ファイルに記載してください。
このファイルは開発に影響しない場所として自由に使用できます。

## Current State

Fresh Next.js project with minimal customization. No API routes, components library, or testing infrastructure currently implemented.
19個のチケットファイルが `/docs` ディレクトリに作成済み。