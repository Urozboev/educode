import Link from "next/link";
import { serverHref } from "@/lib/i18n/server";
import { Code2 } from "lucide-react";

/**
 * Portfolio ataylab sodda layout'da: bu sahifa tashqariga ulashiladi
 * (ish beruvchi, o'qituvchi, ota-ona ko'radi), shuning uchun platforma
 * menyusi emas, portfolio egasi markazda turishi kerak.
 */
export default async function PublicProfileLayout({ children }: { children: React.ReactNode }) {
  const href = await serverHref();
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link href={href("/")} className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </span>
            <span className="font-display font-bold">
              Edu<span className="gradient-text">Code</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="px-4 py-10 sm:py-14">{children}</main>
    </div>
  );
}
