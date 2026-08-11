import type { Metadata, Viewport } from "next";
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { DEFAULT_LOCALE, LOCALE_META, isLocale, type Locale } from "@/lib/i18n/config";
import { Toaster } from "sonner";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  DEFAULT_KEYWORDS,
  ORG_SOCIAL,
  ogImageUrl,
} from "@/lib/seo";
import "./globals.css";

/**
 * Tipografika: Sora sarlavhalar va raqamlar uchun (qalin holatda raqamlari
 * ayniqsa xarakterli), Plus Jakarta Sans o'qish uchun, JetBrains Mono kod uchun.
 * next/font orqali — tashqi so'rov yo'q, FOUT yo'q.
 */
const fontDisplay = Sora({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "education",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "uz-UZ": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "uz_UZ",
    url: SITE_URL,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: ogImageUrl({ title: SITE_NAME, subtitle: SITE_TAGLINE, type: "default" }),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: ORG_SOCIAL.twitter,
    creator: ORG_SOCIAL.twitter,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [ogImageUrl({ title: SITE_NAME, subtitle: SITE_TAGLINE, type: "default" })],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    // Google Search Console / Yandex Webmaster verification kalitini qo'ying:
    google: "kJzWawsmQa4bEhrzKsRUODklqzr7ccSalSM5kgNalis",
    // yandex: "...",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1e2b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Tilni middleware `x-locale` sarlavhasida beradi. Prefiksli manzil
  // (/ru/explore) rewrite qilingani uchun uni faqat shu yerdan bilish
  // mumkin — `usePathname()` rewrite'dan keyingi manzilni ko'rsatadi.
  const h = await headers();
  const headerLocale = h.get("x-locale");
  const locale: Locale = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE;

  return (
    <html
      lang={LOCALE_META[locale].htmlLang}
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen font-body antialiased noise-overlay">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider initialLocale={locale}>
            <QueryProvider>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </QueryProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
