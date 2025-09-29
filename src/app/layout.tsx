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
  },
  twitter: {
    card: "summary_large_image",
    title: "チャンネルスコープ",
    description: "YouTubeチャンネルの成長を可視化する無料分析ツール",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
