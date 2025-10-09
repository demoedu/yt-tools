import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube 썸네일 다운로더 - 모든 해상도 썸네일 한 번에 다운로드",
  description: "YouTube 영상의 모든 썸네일을 다양한 해상도로 한 번에 다운로드하세요. 기본, HD, 최고 해상도까지 9가지 썸네일 옵션을 제공합니다.",
  keywords: ["YouTube", "썸네일", "다운로드", "thumbnail", "downloader", "유튜브"],
  openGraph: {
    title: "YouTube 썸네일 다운로더",
    description: "YouTube 영상의 모든 썸네일을 한 번에 다운로드하세요",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
