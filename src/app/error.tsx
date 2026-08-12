"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import Link from "@/components/i18n/Link";
import { usePathname } from "next/navigation";
import { Home, RotateCw } from "lucide-react";
import { ErrorTerminal } from "@/components/ui/ErrorTerminal";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorTerminal
      code="500"
      token="INTERNAL_ERROR"
      command={`educode render "${pathname || "/"}"`}
      steps={["sahifa tayyorlanmoqda", "bajarilish to'xtadi"]}
      detail={error.digest ? `digest: ${error.digest}` : undefined}
      tone="coral"
      title={t.errors.serverTitle}
      description={t.errors.serverText}
    >
      <button
        type="button"
        onClick={reset}
        className="btn-primary inline-flex items-center gap-2"
      >
        <RotateCw className="w-4 h-4" />
        {t.common.retry}
      </button>
      <Link href="/" className="btn-ghost inline-flex items-center gap-2">
        <Home className="w-4 h-4" />
        {t.errors.goHome}
      </Link>
    </ErrorTerminal>
  );
}
