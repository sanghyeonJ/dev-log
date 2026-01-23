/**
 * 블로그 목록 페이지
 * /[lang]/blog 경로에서 모든 블로그 포스트 목록을 표시합니다
 */

import Link from 'next/link';
import { getPosts, getCategories } from '@/lib/posts';
import type { Metadata } from 'next';

// 언어별 페이지 제목 매핑
const pageTitles: Record<string, string> = {
    ko: '블로그',
    ja: 'ブログ',
    en: 'Blog',
};

/**
 * 페이지 메타데이터 생성 (SEO 최적화)
 */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const title = pageTitles[lang] || 'Blog';

    return {
        title: `${title} | Tech Blog`,
        description: `${title} 포스트 목록`,
    };
}

/**
 * 블로그 목록 페이지 컴포넌트
 */
export default async function BlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ category?: string }>;
}) {
    const { lang } = await params;
    const { category: selectedCategory } = await searchParams;

    // 선택된 카테고리로 필터링
    const posts = await getPosts({
        lang,
        category: selectedCategory || undefined,
        sort: 'date-desc'
    });
    const categories = getCategories();
    const title = pageTitles[lang] || 'Blog';

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">{title}</h1>

            {/* 카테고리 필터 */}
            {categories.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-gray-900">
                        {lang === 'ko' ? '카테고리' : lang === 'ja' ? 'カテゴリー' : 'Categories'}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {/* 전체 보기 버튼 */}
                        <Link
                            href={`/${lang}/blog`}
                            className={`px-3 py-1 rounded-md transition-colors ${!selectedCategory
                                ? 'bg-blue-600 text-white font-medium'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {lang === 'ko' ? '전체' : lang === 'ja' ? 'すべて' : 'All'}
                        </Link>
                        {/* 카테고리 버튼들 */}
                        {categories.map((category) => (
                            <Link
                                key={category}
                                href={`/${lang}/blog?category=${category}`}
                                className={`px-3 py-1 rounded-md transition-colors ${selectedCategory === category
                                    ? 'bg-blue-600 text-white font-medium'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 포스트 목록 */}
            {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                    {lang === 'ko'
                        ? selectedCategory
                            ? '이 카테고리에 포스트가 없습니다.'
                            : '아직 작성된 포스트가 없습니다.'
                        : lang === 'ja'
                            ? selectedCategory
                                ? 'このカテゴリーに投稿がありません。'
                                : 'まだ投稿がありません。'
                            : selectedCategory
                                ? 'No posts in this category.'
                                : 'No posts yet.'}
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <article
                            key={`${post.category}-${post.slug}`}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <Link href={`/${lang}/blog/${post.slug}`}>
                                <h2 className="text-2xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h2>
                            </Link>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <time dateTime={post.date}>
                                    {new Date(post.date).toLocaleDateString(
                                        lang === 'ko'
                                            ? 'ko-KR'
                                            : lang === 'ja'
                                                ? 'ja-JP'
                                                : 'en-US',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        }
                                    )}
                                </time>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                    {post.category}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-3">{post.description}</p>

                            {/* 태그 */}
                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <Link
                                href={`/${lang}/blog/${post.slug}`}
                                className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {lang === 'ko'
                                    ? '더 읽기 →'
                                    : lang === 'ja'
                                        ? '続きを読む →'
                                        : 'Read more →'}
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
