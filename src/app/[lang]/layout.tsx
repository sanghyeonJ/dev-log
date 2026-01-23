/**
 * 언어별 레이아웃 컴포넌트
 * 각 언어 경로(/ko, /ja, /en)에 공통 레이아웃을 제공합니다
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
    ja: { home: "ホーム", blog: "ブログ" },
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
        ja: "日本語",
        en: "English",
    };

    return {
        title: {
            default: "Tech Blog",
            template: "%s | Tech Blog",
        },
        description: `${langNames[lang]} 기술 블로그`,
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
                                    className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                    Tech Blog
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

                            {/* 언어 전환 */}
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
                                    href="/ja"
                                    className={`px-2 py-1 rounded text-sm transition-colors ${lang === "ja"
                                        ? "bg-blue-100 text-blue-800 font-medium"
                                        : "text-gray-600 hover:text-blue-600"
                                        }`}
                                >
                                    JA
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
                        </div>
                    </nav>
                </header>

                <main className="min-h-screen bg-gray-50">{children}</main>

                {/* 푸터 */}
                <footer className="bg-white border-t border-gray-200 mt-12">
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