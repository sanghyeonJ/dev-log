# Tech Blog - Multilingual Technical Blog

---

## 🇯🇵 日本語

Next.js App Routerを基盤とした静的生成(SSG)多言語技術ブログです。

### 🚀 技術スタック

- **Next.js 16.1.4** (App Router)
- **React 19.2.3**
- **TypeScript 5**
- **Tailwind CSS 4**
- **MDX** (ブログコンテンツ)
- **next-mdx-remote 5.0.0** (MDXレンダリング)
- **gray-matter 4.0.3** (Frontmatter解析)

### 📁 プロジェクト構造

```
blogtest/
├── content/posts/          # MDXブログポスト
│   └── {category}/{lang}/{slug}.mdx
├── src/
│   ├── app/[lang]/        # 多言語ルーティング
│   │   ├── layout.tsx     # 言語別レイアウト
│   │   ├── page.tsx       # ホームページ
│   │   └── blog/
│   │       ├── page.tsx   # ブログ一覧
│   │       └── [slug]/page.tsx  # ブログ詳細
│   └── lib/
│       ├── posts.ts       # ポストユーティリティ
│       └── types.ts       # TypeScript型定義
└── package.json
```

### 🎯 主な機能

- ✅ 多言語対応 (日本語、韓国語、英語)
- ✅ 静的サイト生成 (SSG)
- ✅ MDXベースのブログポスト
- ✅ カテゴリーおよびタグサポート
- ✅ **カテゴリーフィルタリング** (ブログ一覧ページでカテゴリー別フィルタリング)
- ✅ SEO最適化 (メタデータ)
- ✅ レスポンシブデザイン (Tailwind CSS)
- ✅ ホームページに最新ポスト3件表示

### 📝 ブログポスト作成

ファイル構造: `content/posts/{category}/{lang}/{slug}.mdx`

```markdown
---
title: "ポストタイトル"
date: "2024-01-15"
category: "react-basics"
tags: ["React", "Hooks"]
description: "ポスト説明"
---

# ポスト内容
```

### 🛠️ 始め方

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build
```

### 🌐 ルーティング

- `/{lang}` - ホームページ
- `/{lang}/blog` - ブログ一覧
- `/{lang}/blog?category={category}` - カテゴリー別フィルタリング
- `/{lang}/blog/{slug}` - ポスト詳細

### 🔑 コア機能

- **多言語対応**: 日本語、韓国語、英語の自動ルーティング
- **静的生成 (SSG)**: ビルド時にすべてのページを生成
- **カテゴリーフィルタリング**: URLクエリパラメータでカテゴリー別フィルタリング
- **MDXサポート**: マークダウンとReactコンポーネントの混合使用が可能
- **SEO最適化**: 言語別メタデータの自動生成

### 🎨 技術的特徴

- **ファイルシステムベース**: DBなしでMDXファイルでコンテンツ管理
- **型安全性**: TypeScriptでプロジェクト全体の型定義
- **レスポンシブデザイン**: Tailwind CSSでモバイル最適化
- **サーバーコンポーネント**: Next.js App Routerのサーバーコンポーネント活用

### 📦 デプロイ

静的サイト生成(SSG)を使用するため、Vercel、Netlifyなどの静的ホスティングプラットフォームにデプロイ可能です。

---

## 🇰🇷 한국어

Next.js App Router를 기반으로 한 정적 생성(SSG) 다국어 기술 블로그입니다.

### 🚀 기술 스택

- **Next.js 16.1.4** (App Router)
- **React 19.2.3**
- **TypeScript 5**
- **Tailwind CSS 4**
- **MDX** (블로그 콘텐츠)
- **next-mdx-remote 5.0.0** (MDX 렌더링)
- **gray-matter 4.0.3** (Frontmatter 파싱)

### 📁 프로젝트 구조

```
blogtest/
├── content/posts/          # MDX 블로그 포스트
│   └── {category}/{lang}/{slug}.mdx
├── src/
│   ├── app/[lang]/        # 다국어 라우팅
│   │   ├── layout.tsx     # 언어별 레이아웃
│   │   ├── page.tsx       # 홈 페이지
│   │   └── blog/
│   │       ├── page.tsx   # 블로그 목록
│   │       └── [slug]/page.tsx  # 블로그 상세
│   └── lib/
│       ├── posts.ts       # 포스트 유틸리티
│       └── types.ts       # TypeScript 타입
└── package.json
```

### 🎯 주요 기능

- ✅ 다국어 지원 (한국어, 일본어, 영어)
- ✅ 정적 사이트 생성 (SSG)
- ✅ MDX 기반 블로그 포스트
- ✅ 카테고리 및 태그 지원
- ✅ **카테고리 필터링** (블로그 목록 페이지에서 카테고리별 필터링)
- ✅ SEO 최적화 (메타데이터)
- ✅ 반응형 디자인 (Tailwind CSS)
- ✅ 홈 페이지에 최신 포스트 3개 표시

### 📝 블로그 포스트 작성

파일 구조: `content/posts/{category}/{lang}/{slug}.mdx`

```markdown
---
title: "포스트 제목"
date: "2024-01-15"
category: "react-basics"
tags: ["React", "Hooks"]
description: "포스트 설명"
---

# 포스트 내용
```

### 🛠️ 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

### 🌐 라우팅

- `/{lang}` - 홈 페이지
- `/{lang}/blog` - 블로그 목록
- `/{lang}/blog?category={category}` - 카테고리별 필터링
- `/{lang}/blog/{slug}` - 포스트 상세

### 🔑 핵심 기능

- **다국어 지원**: 한국어, 일본어, 영어 자동 라우팅
- **정적 생성 (SSG)**: 빌드 시점에 모든 페이지 생성
- **카테고리 필터링**: URL 쿼리 파라미터로 카테고리별 필터링
- **MDX 지원**: 마크다운과 React 컴포넌트 혼합 사용 가능
- **SEO 최적화**: 언어별 메타데이터 자동 생성

### 🎨 기술적 특징

- **파일 시스템 기반**: DB 없이 MDX 파일로 콘텐츠 관리
- **타입 안전성**: TypeScript로 전체 프로젝트 타입 정의
- **반응형 디자인**: Tailwind CSS로 모바일 최적화
- **서버 컴포넌트**: Next.js App Router의 서버 컴포넌트 활용

### 📦 배포

정적 사이트 생성(SSG)을 사용하므로 Vercel, Netlify 등 정적 호스팅 플랫폼에 배포 가능합니다.

---

## 🇺🇸 English

A multilingual technical blog built with Next.js App Router using Static Site Generation (SSG).

### 🚀 Tech Stack

- **Next.js 16.1.4** (App Router)
- **React 19.2.3**
- **TypeScript 5**
- **Tailwind CSS 4**
- **MDX** (Blog content)
- **next-mdx-remote 5.0.0** (MDX rendering)
- **gray-matter 4.0.3** (Frontmatter parsing)

### 📁 Project Structure

```
blogtest/
├── content/posts/          # MDX blog posts
│   └── {category}/{lang}/{slug}.mdx
├── src/
│   ├── app/[lang]/        # Multilingual routing
│   │   ├── layout.tsx     # Language-specific layout
│   │   ├── page.tsx       # Home page
│   │   └── blog/
│   │       ├── page.tsx   # Blog list
│   │       └── [slug]/page.tsx  # Blog detail
│   └── lib/
│       ├── posts.ts       # Post utilities
│       └── types.ts       # TypeScript types
└── package.json
```

### 🎯 Key Features

- ✅ Multilingual support (Japanese, Korean, English)
- ✅ Static Site Generation (SSG)
- ✅ MDX-based blog posts
- ✅ Category and tag support
- ✅ **Category filtering** (Filter posts by category on blog list page)
- ✅ SEO optimization (Metadata)
- ✅ Responsive design (Tailwind CSS)
- ✅ Latest 3 posts displayed on home page

### 📝 Writing Blog Posts

File structure: `content/posts/{category}/{lang}/{slug}.mdx`

```markdown
---
title: "Post Title"
date: "2024-01-15"
category: "react-basics"
tags: ["React", "Hooks"]
description: "Post description"
---

# Post content
```

### 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### 🌐 Routing

- `/{lang}` - Home page
- `/{lang}/blog` - Blog list
- `/{lang}/blog?category={category}` - Category filtering
- `/{lang}/blog/{slug}` - Post detail

### 🔑 Core Features

- **Multilingual Support**: Automatic routing for Japanese, Korean, and English
- **Static Generation (SSG)**: All pages generated at build time
- **Category Filtering**: Filter by category using URL query parameters
- **MDX Support**: Mix markdown with React components
- **SEO Optimization**: Automatic language-specific metadata generation

### 🎨 Technical Highlights

- **File System Based**: Content management with MDX files without database
- **Type Safety**: Full TypeScript type definitions across the project
- **Responsive Design**: Mobile-optimized with Tailwind CSS
- **Server Components**: Leveraging Next.js App Router's server components

### 📦 Deployment

Since this project uses Static Site Generation (SSG), it can be deployed on static hosting platforms like Vercel, Netlify, etc.
