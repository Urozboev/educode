"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Home } from "lucide-react";
import { ErrorTerminal } from "@/components/ui/ErrorTerminal";

export function NotFoundView() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ErrorTerminal
      code="404"
      token="ROUTE_NOT_FOUND"
      command={`educode open "${pathname || "/"}"`}
      steps={["manzil qidirilmoqda", "router jadvalida mos yozuv yo'q"]}
      tone="amber"
      title="Bu manzilda sahifa yo'q"
      description="Havola eskirgan yoki manzilda xatolik bor. Quyidagidan boshlang."
    >
      <Link href="/" className="btn-primary inline-flex items-center gap-2">
        <Home className="w-4 h-4" />
        Bosh sahifa
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
