import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MainLayout from "../components/layout/MainLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Market Precap',
  description: 'Your market analysis platform',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://marketprecap.com',
    siteName: 'Market Precap',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getInitialTheme() {
                  try {
                    const persistedTheme = localStorage.getItem('theme');
                    const hasPersistedPreference = typeof persistedTheme === 'string';
                    if (hasPersistedPreference) {
                      return persistedTheme;
                    }
                    const mql = window.matchMedia('(prefers-color-scheme: dark)');
                    const hasMediaQueryPreference = typeof mql.matches === 'boolean';
                    if (hasMediaQueryPreference) {
                      return mql.matches ? 'dark' : 'light';
                    }
                  } catch (err) {}
                  return 'light';
                }
                const theme = getInitialTheme();
                document.documentElement.classList.add(theme);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-900`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
