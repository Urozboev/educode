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
  description:
    "Raqamli intellektual ta'lim platformasi. Dasturlash tillarini interaktiv kurslar, AI yordamchi va gamifikatsiya orqali o'rganing.",
  keywords: ["dasturlash", "programming", "o'rganish", "python", "javascript", "kurs"],
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
