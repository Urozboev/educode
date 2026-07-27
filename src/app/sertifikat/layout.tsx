import Link from "next/link";
import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import { absUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sertifikatni tekshirish",
  description:
    "EduCode sertifikatining haqiqiyligini raqami yoki QR kodi orqali tekshiring. Ro'yxatdan o'tish talab qilinmaydi.",
  alternates: { canonical: absUrl("/sertifikat") },
  robots: { index: false, follow: true },
};

/**
 * Tekshirish sahifasi tashqi odam uchun — platforma menyusi kerak emas,
 * faqat brend va javob.
 */
export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </span>
            <span className="font-display font-bold">
              Edu<span className="gradient-text">Code</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="px-4 py-10 sm:py-14">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-center mb-8">
          Sertifikatni tekshirish
        </h1>
        {children}
      </main>
    </div>
  );
}
