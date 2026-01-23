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
    jp: 'ブログ',
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

// 페이지당 포스트 수
const POSTS_PER_PAGE = 10;

/**
 * 페이지네이션 컴포넌트
 */
function Pagination({
    currentPage,
    totalPages,
    lang,
    category,
}: {
    currentPage: number;
    totalPages: number;
    lang: string;
    category?: string;
}) {
    const pageNumbers: number[] = [];
    
    // 표시할 페이지 번호 계산 (현재 페이지 기준 앞뒤 2개씩)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const getPageUrl = (page: number) => {
        if (page === 1) {
            return category ? `/${lang}/blog?category=${category}` : `/${lang}/blog`;
        }
        return category
            ? `/${lang}/blog?category=${category}&page=${page}`
            : `/${lang}/blog?page=${page}`;
    };

    const texts = {
        prev: lang === 'ko' ? '이전' : lang === 'jp' ? '前へ' : 'Previous',
        next: lang === 'ko' ? '다음' : lang === 'jp' ? '次へ' : 'Next',
    };

    if (totalPages <= 1) return null;

    return (
        <nav className="flex items-center justify-center gap-2 mt-12">
            {/* 이전 버튼 */}
            {currentPage > 1 ? (
                <Link
                    href={getPageUrl(currentPage - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {texts.prev}
                </Link>
            ) : (
                <span className="px-4 py-2 border border-gray-300 rounded-md text-gray-400 cursor-not-allowed">
                    {texts.prev}
                </span>
            )}

            {/* 첫 페이지 */}
            {startPage > 1 && (
                <>
                    <Link
                        href={getPageUrl(1)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        1
                    </Link>
                    {startPage > 2 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}
                </>
            )}

            {/* 페이지 번호들 */}
            {pageNumbers.map((page) => (
                <Link
                    key={page}
                    href={getPageUrl(page)}
                    className={`px-4 py-2 border rounded-md transition-colors ${
                        page === currentPage
                            ? 'bg-blue-600 text-white border-blue-600 font-medium'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {page}
                </Link>
            ))}

            {/* 마지막 페이지 */}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}
                    <Link
                        href={getPageUrl(totalPages)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {totalPages}
                    </Link>
                </>
            )}

            {/* 다음 버튼 */}
            {currentPage < totalPages ? (
                <Link
                    href={getPageUrl(currentPage + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {texts.next}
                </Link>
            ) : (
                <span className="px-4 py-2 border border-gray-300 rounded-md text-gray-400 cursor-not-allowed">
                    {texts.next}
                </span>
            )}
        </nav>
    );
}

/**
 * 블로그 목록 페이지 컴포넌트
 */
export default async function BlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ category?: string; page?: string }>;
}) {
    const { lang } = await params;
    const { category: selectedCategory, page } = await searchParams;

    // 현재 페이지 번호 (기본값: 1)
    let currentPage = page ? parseInt(page, 10) : 1;
    if (isNaN(currentPage) || currentPage < 1) {
        currentPage = 1;
    }

    // 선택된 카테고리로 필터링
    const allPosts = await getPosts({
        lang,
        category: selectedCategory || undefined,
        sort: 'date-desc'
    });
    
    // 페이지네이션 계산
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE) || 1;
    
    // 잘못된 페이지 번호 처리
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const posts = allPosts.slice(startIndex, endIndex);
    
    const categories = getCategories();
    const title = pageTitles[lang] || 'Blog';

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">{title}</h1>

            {/* 카테고리 필터 */}
            {categories.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-gray-900">
                        {lang === 'ko' ? '카테고리' : lang === 'jp' ? 'カテゴリー' : 'Categories'}
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
                            {lang === 'ko' ? '전체' : lang === 'jp' ? 'すべて' : 'All'}
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
                        : lang === 'jp'
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
                                            : lang === 'jp'
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
                                    : lang === 'jp'
                                        ? '続きを読む →'
                                        : 'Read more →'}
                            </Link>
                        </article>
                    ))}
                </div>
            )}

            {/* 페이지네이션 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                lang={lang}
                category={selectedCategory}
            />
        </div>
    );
}
