import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EduCode — Dasturlashni o'ynab o'rgan",
    template: "%s | EduCode",
  },
  description: "Raqamli intellektual ta'lim platformasi. Dasturlash tillarini interaktiv kurslar, AI yordamchi va gamifikatsiya orqali o'rganing. Python, JavaScript va boshqa tillar.",
  keywords: ["dasturlash", "programming", "o'rganish", "python", "javascript", "kurs", "educode", "ta'lim", "IT", "kompyuter savodxonligi", "prompt engineering"],
  authors: [{ name: "EduCode" }],
  openGraph: {
    title: "EduCode — Dasturlashni o'ynab o'rgan",
    description: "Interaktiv kurslar, AI feedback, gamifikatsiya — barchasi bitta platformada",
    siteName: "EduCode",
    locale: "uz_UZ",
    type: "website",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://malla.uz"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="min-h-screen font-body antialiased noise-overlay">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              theme="dark"
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
