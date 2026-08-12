"use client";

import NextLink from "next/link";
import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * Tilni saqlaydigan `Link`.
 *
 * `next/link` o'rniga ishlatiladi va ichki manzilga joriy til prefiksini
 * qo'shadi: ruscha sahifadan bosilgan havola `/ru/explore/...` bo'lib
 * qoladi. Ilgari prefiks tushib qolardi — til cookie orqali saqlanardi,
 * lekin havolani ulashganda u yo'qolardi va Google faqat prefikssiz
 * (o'zbekcha) manzilni ko'rardi.
 *
 * Prefiks FAQAT ommaviy bo'limlarga qo'yiladi (`LOCALIZED_PREFIXES`) —
 * kabinet manzillari o'zgarishsiz qoladi, buni `localizedHref` hal qiladi.
 *
 * Tashqi manzillar, `mailto:`, `tel:`, `#lang` va obyekt ko'rinishidagi
 * `href` tegilmaydi.
 */

type Props = ComponentProps<typeof NextLink>;

const EXTERNAL = /^([a-z][a-z0-9+.-]*:|\/\/|#)/i;

const Link = forwardRef<HTMLAnchorElement, Props>(function Link(
  { href, ...rest },
  ref
) {
  const { href: localize } = useI18n();

  // Obyekt ko'rinishidagi href (`{ pathname, query }`) va tashqi
  // manzillar o'zgarishsiz o'tadi
  const finalHref =
    typeof href === "string" && !EXTERNAL.test(href) ? localize(href) : href;

  return <NextLink ref={ref} href={finalHref} {...rest} />;
});

export default Link;
