import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MusicDock } from "@/components/music-dock";
import { BackToTop } from "@/components/back-to-top";
import { asset } from "@/data/posts";

export const metadata: Metadata = {
  title: {
    default: "张洪Heo - 分享设计与科技生活",
    template: "%s | 张洪Heo",
  },
  description:
    "张洪Heo的个人博客，分享设计与科技生活，专注前端开发、设计灵感与效率工具。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f9fe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href={asset("/favicon.webp")} />
        <link rel="apple-touch-icon" href={asset("/apple-touch-icon.webp")} />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col" id="body-wrap">
            <Header />
            <main className="mx-auto w-full max-w-[1400px] flex-1 px-3">
              {children}
            </main>
            <Footer />
            <MusicDock />
            <BackToTop />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
