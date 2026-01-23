/**
 * 블로그 상세 페이지
 * /[lang]/blog/[slug] 경로에서 개별 블로그 포스트를 표시합니다
 */

import { getPost, getPosts } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

/**
 * MDX 컴포넌트 커스터마이징
 * 필요시 코드 블록, 링크 등을 커스터마이징할 수 있습니다
 */
const mdxComponents = {
  // 예: 코드 블록 스타일링 등
  h1: (props: any) => (
    <h1 className="text-4xl font-bold mt-8 mb-6 text-gray-900" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-semibold mt-8 mb-3 text-gray-800" {...props} />
  ),

  /* 본문 */
  p: (props: any) => (
    <p className="text-base leading-7 text-gray-700 mb-4" {...props} />
  ),

  /* 리스트 */
  ul: (props: any) => (
    <ul className="list-disc pl-6 mb-4 text-gray-700" {...props} />
  ),
  li: (props: any) => (
    <li className="mb-1" {...props} />
  ),

  /* 링크 */
  a: (props: any) => (
    <a
      className="text-blue-600 underline hover:text-blue-800"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),

  /* 인라인 코드 */
  code: (props: any) => (
    <code
      className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-sm"
      {...props}
    />
  ),

  /* 코드 블록 */
  pre: (props: any) => (
    <pre
      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6"
      {...props}
    />
  ),

  /* 인용 */
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6"
      {...props}
    />
  ),
};

/**
 * 정적 경로 생성 (SSG를 위해)
 * 빌드 시점에 모든 포스트의 경로를 생성합니다
 */
export async function generateStaticParams() {
  const posts = await getPosts();

  // 중복 제거를 위해 Set 사용
  const params = new Set<string>();

  posts.forEach((post) => {
    // 각 포스트의 slug를 파라미터로 추가
    // 실제로는 category도 필요하지만, 현재 구조에서는 slug만으로 식별 가능
    params.add(post.slug);
  });

  return Array.from(params).map((slug) => ({
    slug,
  }));
}

/**
 * 페이지 메타데이터 생성 (SEO 최적화)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;

  // slug로 포스트 찾기 (카테고리 정보 필요)
  const posts = await getPosts({ lang });
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Tech Blog`,
    description: post.description,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

/**
 * 블로그 상세 페이지 컴포넌트
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  // slug로 포스트 찾기
  const posts = await getPosts({ lang });
  const postMeta = posts.find((p) => p.slug === slug);

  if (!postMeta) {
    notFound();
  }

  // 상세 포스트 데이터 가져오기
  const post = await getPost(postMeta.slug, postMeta.category, lang);

  if (!post || !post.content) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <Link
        href={`/${lang}/blog`}
        className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-medium"
      >
        ←{' '}
        {lang === 'ko'
          ? '블로그 목록으로'
          : lang === 'jp'
            ? 'ブログ一覧へ'
            : 'Back to Blog'}
      </Link>

      {/* 포스트 헤더 */}
      <header className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <time dateTime={post.date} className="text-gray-600">
            {new Date(post.date).toLocaleDateString(
              lang === 'ko' ? 'ko-KR' : lang === 'jp' ? 'jp-JP' : 'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )}
          </time>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-medium">
            {post.category}
          </span>
        </div>

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 포스트 내용 */}
      <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-900 prose-pre:bg-gray-100 prose-pre:text-gray-900">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>

      {/* 하단 네비게이션 */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href={`/${lang}/blog`}
          className="inline-block text-blue-600 hover:text-blue-800 font-medium"
        >
          ←{' '}
          {lang === 'ko'
            ? '모든 포스트 보기'
            : lang === 'jp'
              ? 'すべての投稿を見る'
              : 'View all posts'}
        </Link>
      </div>
    </article>
  );
}
