import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import { Header } from '@/components/Header'
import { PostSearchProvider } from '@/components/PostSearchProvider'
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider'
import { ScrollToTopButton } from '@/components/ScrollToTopButton'
import { CODE_THEME_STYLE_TEXT, CODE_THEME_VALUES } from '@/lib/codeThemes'
import {
  DEFAULT_FONT_THEME,
  FONT_THEME_VALUES,
  getFontThemeStack,
} from '@/lib/fontThemes'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const codeThemeBootScript = `(() => {
  try {
    const supportedThemes = ${JSON.stringify(CODE_THEME_VALUES)};
    const theme = localStorage.getItem('code-theme');
    if (theme && supportedThemes.includes(theme)) {
      document.documentElement.setAttribute('data-code-theme', theme);
    }
  } catch {}
})();`

const fontThemeBootScript = `(() => {
  try {
    const supportedThemes = ${JSON.stringify(FONT_THEME_VALUES)};
    const defaultTheme = ${JSON.stringify(DEFAULT_FONT_THEME)};
    const fontStacks = ${JSON.stringify(
      Object.fromEntries(
        FONT_THEME_VALUES.map((theme) => [theme, getFontThemeStack(theme)])
      )
    )};
    const stored = localStorage.getItem('font-theme');
    const theme = stored && supportedThemes.includes(stored) ? stored : defaultTheme;
    const root = document.documentElement;
    const stack = fontStacks[theme] || fontStacks[defaultTheme];
    root.setAttribute('data-font-theme', theme);
    root.style.setProperty('--font-user', stack);
    document.body?.style.setProperty('font-family', stack);
  } catch {
    const root = document.documentElement;
    root.setAttribute('data-font-theme', ${JSON.stringify(DEFAULT_FONT_THEME)});
    const stack = ${JSON.stringify(getFontThemeStack(DEFAULT_FONT_THEME))};
    root.style.setProperty('--font-user', stack);
    document.body?.style.setProperty('font-family', stack);
  }
})();`

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'ryong.log',
    template: '%s | ryong.log',
  },
  description: '개발 블로그',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ryong.log',
    description: '개발 블로그',
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: 'ryong.log',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ryong.log',
    description: '개발 블로그',
  },
  icons: {
    icon: [{ url: '/brand/ryonglog-icon.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/brand/ryonglog-icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/brand/ryonglog-icon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <style id="code-theme-style-map">{CODE_THEME_STYLE_TEXT}</style>
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 min-h-screen`}
      >
        <Script id="code-theme-init" strategy="beforeInteractive">
          {codeThemeBootScript}
        </Script>
        <Script id="font-theme-init" strategy="beforeInteractive">
          {fontThemeBootScript}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PostSearchProvider>
            <SmoothScrollProvider />
            <Header />
            <main className="max-w-3xl mx-auto px-4 pt-8 pb-16">{children}</main>
            <ScrollToTopButton />
          </PostSearchProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
