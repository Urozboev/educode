import type { Metadata } from "next";
import Link from "next/link";
import { serverHref } from "@/lib/i18n/server";
import { Code2 } from "lucide-react";

export const metadata: Metadata = {
  // Auth sahifalari Google'da chiqishi shart emas
  robots: { index: false, follow: false, nocache: true },
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const href = await serverHref();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href={href("/")} className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl">
            Edu<span className="gradient-text">Code</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-12">
        {children}
      </main>
    </div>
  );
}
