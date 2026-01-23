/**
 * 홈 페이지
 * /[lang] 경로에서 표시되는 메인 페이지
 */

import Link from "next/link";
import { getPosts } from "@/lib/posts";
import type { Metadata } from "next";

// 언어별 텍스트
const homeTexts: Record<string, { title: string; subtitle: string; viewBlog: string; latestPosts: string }> = {
    ko: {
        title: "S의 스터디 일지에 오신 것을 환영합니다",
        subtitle: "개발과 관련된 기술과 경험을 공유합니다",
        viewBlog: "블로그 보기",
        latestPosts: "최신 포스트",
    },
    jp: {
        title: "Sのスタディ日記へようこそ",
        subtitle: "開発に関する技術と経験を共有します",
        viewBlog: "ブログを見る",
        latestPosts: "最新の投稿",
    },
    en: {
        title: "Welcome to S's Study Diary",
        subtitle: "Sharing knowledge and experiences about development",
        viewBlog: "View Blog",
        latestPosts: "Latest Posts",
    },
};

/**
 * 페이지 메타데이터 생성
 */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const texts = homeTexts[lang] || homeTexts.en;

    return {
        title: texts.title,
        description: texts.subtitle,
    };
}

/**
 * 홈 페이지 컴포넌트
 */
export default async function HomePage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const texts = homeTexts[lang] || homeTexts.en;

    // 최신 포스트 3개 가져오기
    const latestPosts = (await getPosts({ lang, sort: "date-desc" })).slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* 히어로 섹션 */}
            <section className="text-center mb-16">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    {texts.title}
                </h1>
                <p className="text-xl text-gray-600 mb-8">{texts.subtitle}</p>
                <Link
                    href={`/${lang}/blog`}
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    {texts.viewBlog}
                </Link>
            </section>

            {/* 최신 포스트 섹션 */}
            {latestPosts.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        {texts.latestPosts}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {latestPosts.map((post) => (
                            <article
                                key={`${post.category}-${post.slug}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <Link href={`/${lang}/blog/${post.slug}`}>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                {post.category}
                                            </span>
                                            <time
                                                className="text-xs text-gray-500"
                                                dateTime={post.date}
                                            >
                                                {new Date(post.date).toLocaleDateString(
                                                    lang === "ko"
                                                        ? "ko-KR"
                                                        : lang === "jp"
                                                            ? "jp-JP"
                                                            : "en-US"
                                                )}
                                            </time>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {post.description}
                                        </p>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
