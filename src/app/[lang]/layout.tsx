/**
 * 언어별 레이아웃 컴포넌트
 * 각 언어 경로(/ko, /jp, /en)에 공통 레이아웃을 제공합니다
 */

import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// 언어별 네비게이션 텍스트
const navTexts: Record<string, { home: string; blog: string }> = {
    ko: { home: "홈", blog: "블로그" },
    jp: { home: "ホーム", blog: "ブログ" },
    en: { home: "Home", blog: "Blog" },
};

/**
 * 레이아웃 메타데이터 생성
 */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const langNames: Record<string, string> = {
        ko: "한국어",
        jp: "日本語",
        en: "English",
    };

    return {
        title: {
            default: "Sanghyeon's Devlog",
            template: "%s | Sanghyeon's Devlog",
        },
        description: `${langNames[lang]} 스터디 일지`,
        metadataBase: new URL("https://your-domain.com"), // 실제 도메인으로 변경 필요
    };
}

/**
 * 언어별 레이아웃 컴포넌트
 */
export default async function LangLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const nav = navTexts[lang] || navTexts.en;

    return (
        <html lang={lang}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-6">
                                {/* 로고/홈 링크 */}
                                <Link
                                    href={`/${lang}`}
                                    className="text-lg md:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                    S Devlog
                                </Link>

                                {/* 메인 네비게이션 */}
                                <div className="hidden md:flex items-center gap-4">
                                    <Link
                                        href={`/${lang}`}
                                        className="text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        {nav.home}
                                    </Link>
                                    <Link
                                        href={`/${lang}/blog`}
                                        className="text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        {nav.blog}
                                    </Link>
                                </div>
                            </div>

                            {/* 언어 전환 및 깃허브 */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/ko"
                                        className={`px-2 py-1 rounded text-sm transition-colors ${lang === "ko"
                                            ? "bg-blue-100 text-blue-800 font-medium"
                                            : "text-gray-600 hover:text-blue-600"
                                            }`}
                                    >
                                        KO
                                    </Link>
                                    <Link
                                        href="/jp"
                                        className={`px-2 py-1 rounded text-sm transition-colors ${lang === "jp"
                                            ? "bg-blue-100 text-blue-800 font-medium"
                                            : "text-gray-600 hover:text-blue-600"
                                            }`}
                                    >
                                        JP
                                    </Link>
                                    <Link
                                        href="/en"
                                        className={`px-2 py-1 rounded text-sm transition-colors ${lang === "en"
                                            ? "bg-blue-100 text-blue-800 font-medium"
                                            : "text-gray-600 hover:text-blue-600"
                                            }`}
                                    >
                                        EN
                                    </Link>
                                </div>
                                
                                {/* 깃허브 아이콘 */}
                                <a
                                    href="https://github.com/sanghyeonJ/dev-log"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                    aria-label="GitHub"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </nav>
                </header>

                <main className="min-h-screen bg-gray-50">{children}</main>

                {/* 푸터 */}
                <footer className="bg-white border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <p className="text-center text-gray-500 text-sm">
                            © {new Date().getFullYear()} Tech Blog. All rights reserved.
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}