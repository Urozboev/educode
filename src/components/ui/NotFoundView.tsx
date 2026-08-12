"use client";

import { useI18n } from "@/lib/i18n";

import Link from "@/components/i18n/Link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Home } from "lucide-react";
import { ErrorTerminal } from "@/components/ui/ErrorTerminal";

export function NotFoundView() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ErrorTerminal
      code="404"
      token="ROUTE_NOT_FOUND"
      command={`educode open "${pathname || "/"}"`}
      steps={["manzil qidirilmoqda", "router jadvalida mos yozuv yo'q"]}
      tone="amber"
      title={t.errors.notFoundTitle}
      description={t.errors.notFoundText}
    >
      <Link href="/" className="btn-primary inline-flex items-center gap-2">
        <Home className="w-4 h-4" />
        {t.errors.goHome}
      </Link>
      <Link
        href="/explore/courses"
        className="btn-ghost inline-flex items-center gap-2"
      >
        <BookOpen className="w-4 h-4" />
        Kurslarni ko'rish
      </Link>
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Orqaga
      </button>
    </ErrorTerminal>
  );
}
