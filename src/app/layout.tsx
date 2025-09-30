import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "チャンネルスコープ - YouTubeチャンネル分析ツール",
  description: "YouTubeチャンネルの成長を可視化する無料分析ツール。配信者のための簡単で使いやすいチャンネル分析サービス。",
  keywords: ["YouTube", "分析", "チャンネル", "配信者", "動画", "統計"],
  authors: [{ name: "ChannelScope" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://channelscope.vercel.app",
    title: "チャンネルスコープ",
    description: "YouTubeチャンネルの成長を可視化する無料分析ツール",
    siteName: "チャンネルスコープ",
    images: [
      {
        url: "/api/og?channel=ChannelScope&subscribers=0&videos=0&views=0",
        width: 1200,
        height: 630,
        alt: "チャンネルスコープ - YouTubeチャンネル分析ツール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "チャンネルスコープ",
    description: "YouTubeチャンネルの成長を可視化する無料分析ツール",
    images: ["/api/og?channel=ChannelScope&subscribers=0&videos=0&views=0"],
  },
};

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
