"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Sig'magan jadvallarga "surish mumkin" belgisi.
 *
 * 1) `wrapTables(html, label)` — HTML MATNIDA har bir jadvalni o'ramga oladi:
 *      .table-scroll > button.table-scroll__hint + .table-scroll__box > table
 *    O'ram matnning o'zida bo'lgani uchun React innerHTML'ni qayta qo'ysa ham
 *    yo'qolmaydi (DOM'ni keyin o'zgartirish ishonchsiz chiqdi).
 * 2) `useScrollableTables(ref)` — har chizishdan keyin hali ulanmagan
 *    o'ramlarga holat klasslarini va tinglovchilarni ulaydi:
 *      is-scrollable — jadval sig'madi (yorliq ko'rinadi)
 *      can-left / can-right — qaysi tomonda davomi bor (chet xiralashadi)
 *      was-scrolled — foydalanuvchi bir marta surdi (yorliq yashirinadi)
 *    Yorliq bosilsa jadval o'ngga suriladi.
 */
export function wrapTables(html: string, label: string): string {
  if (!/<table[\s>]/i.test(html)) return html;
  const safe = label.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
  return html.replace(/<table[\s\S]*?<\/table>/gi, (t) =>
    `<div class="table-scroll"><button type="button" class="table-scroll__hint"><span aria-hidden="true">↔</span> ${safe}</button><div class="table-scroll__box">${t}</div></div>`);
}

export function useScrollableTables(rootRef: RefObject<HTMLElement>) {
  const observers = useRef<ResizeObserver[]>([]);

  // Har chizishdan keyin: yangi (ulanmagan) o'ramlarni topib ulaydi
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(".table-scroll:not([data-ready])").forEach((wrap) => {
      const table = wrap.querySelector<HTMLElement>(".table-scroll__box > table");
      const hint = wrap.querySelector<HTMLButtonElement>(".table-scroll__hint");
      if (!table || !hint) return;
      wrap.dataset.ready = "1";

      const update = () => {
        const max = table.scrollWidth - table.clientWidth;
        const scrollable = max > 4;
        wrap.classList.toggle("is-scrollable", scrollable);
        wrap.classList.toggle("can-left", scrollable && table.scrollLeft > 4);
        wrap.classList.toggle("can-right", scrollable && table.scrollLeft < max - 4);
      };
      table.addEventListener("scroll", () => {
        if (table.scrollLeft > 8) wrap.classList.add("was-scrolled");
        update();
      }, { passive: true });
      hint.addEventListener("click", () => table.scrollBy({ left: table.clientWidth * 0.7, behavior: "smooth" }));
      const ro = new ResizeObserver(update);
      ro.observe(table);
      observers.current.push(ro);
      update();
    });
  });

  // Sahifadan chiqilganda kuzatuvchilar to'xtatiladi
  useEffect(() => () => { observers.current.forEach((o) => o.disconnect()); observers.current = []; }, []);
}
