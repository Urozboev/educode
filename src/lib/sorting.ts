/**
 * Saralash algoritmlari — vizualizatsiya uchun kadrlar generatori.
 *
 * Algoritm real vaqtda emas, oldindan to'liq "kadrlarga" yoyiladi. Shu tufayli
 * o'quvchi orqaga ham qadam tashlay oladi va tezlikni o'zgartirish hisobni
 * buzmaydi — animatsiya shunchaki tayyor ro'yxat bo'ylab yuradi.
 */

export type SortAlgo = "bubble" | "selection" | "insertion";

export type Frame = {
  array: number[];
  /** Hozir solishtirilayotgan indekslar */
  comparing: [number, number] | null;
  /** Hozir joyi almashtirilayotgan indekslar */
  swapping: [number, number] | null;
  /** O'z o'rnini topgan (endi tegilmaydigan) indekslar */
  sorted: number[];
  /** Psevdokodda yoritiladigan qator (0 dan) */
  line: number;
  /** Shu qadamda nima bo'layotgani — o'quvchi uchun izoh */
  note: string;
  comparisons: number;
  swaps: number;
};

export const ALGOS: {
  value: SortAlgo;
  label: string;
  complexity: string;
  idea: string;
  pseudocode: string[];
}[] = [
  {
    value: "bubble",
    label: "Bubble (pufakcha)",
    complexity: "O(n²)",
    idea:
      "Qo'shni ikki elementni solishtiradi va noto'g'ri tartibda bo'lsa almashtiradi. Har o'tishda eng katta element oxiriga «suzib» chiqadi.",
    pseudocode: [
      "for i = 0 to n-1:",
      "  for j = 0 to n-i-2:",
      "    if a[j] > a[j+1]:",
      "      a[j] bilan a[j+1] joyini almashtir",
    ],
  },
  {
    value: "selection",
    label: "Selection (tanlash)",
    complexity: "O(n²)",
    idea:
      "Qolgan qismdan eng kichik elementni topadi va uni joyiga qo'yadi. Almashtirishlar soni kam — har o'tishda ko'pi bilan bitta.",
    pseudocode: [
      "for i = 0 to n-1:",
      "  min = i",
      "  for j = i+1 to n-1:",
      "    if a[j] < a[min]: min = j",
      "  a[i] bilan a[min] joyini almashtir",
    ],
  },
  {
    value: "insertion",
    label: "Insertion (qo'yish)",
    complexity: "O(n²), deyarli saralanganda O(n)",
    idea:
      "Har bir elementni chap tomondagi saralangan qismga to'g'ri joyiga qo'yadi — qo'lda kartalarni tartiblashga o'xshaydi.",
    /**
     * Klassik variantda kalit alohida o'zgaruvchida saqlanib, elementlar
     * o'ngga suriladi. Ekranda bu vaqtincha takrorlangan ustun bo'lib
     * ko'rinadi va o'quvchini chalg'itadi. Shuning uchun bu yerda ekvivalent
     * — qo'shni almashtirishli — variant ishlatiladi: solishtirishlar soni
     * bir xil, lekin har qadamda massiv to'g'ri holatda turadi.
     */
    pseudocode: [
      "for i = 1 to n-1:",
      "  j = i",
      "  while j > 0 and a[j-1] > a[j]:",
      "    a[j-1] bilan a[j] joyini almashtir; j = j-1",
    ],
  },
];

export const algoMeta = (a: SortAlgo) => ALGOS.find(x => x.value === a)!;

type Ctx = { frames: Frame[]; comparisons: number; swaps: number };

function push(
  ctx: Ctx,
  array: number[],
  partial: Partial<Omit<Frame, "array" | "comparisons" | "swaps">>
) {
  ctx.frames.push({
    array: [...array],
    comparing: partial.comparing ?? null,
    swapping: partial.swapping ?? null,
    sorted: partial.sorted ?? [],
    line: partial.line ?? 0,
    note: partial.note ?? "",
    comparisons: ctx.comparisons,
    swaps: ctx.swaps,
  });
}

export function generateFrames(input: number[], algo: SortAlgo): Frame[] {
  const a = [...input];
  const n = a.length;
  const ctx: Ctx = { frames: [], comparisons: 0, swaps: 0 };

  push(ctx, a, { note: "Boshlang'ich holat" });
  if (n <= 1) {
    push(ctx, a, { sorted: a.map((_, i) => i), note: "Saralandi" });
    return ctx.frames;
  }

  if (algo === "bubble") {
    const sorted: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      let swappedAny = false;
      for (let j = 0; j < n - i - 1; j++) {
        ctx.comparisons++;
        push(ctx, a, {
          comparing: [j, j + 1], sorted: [...sorted], line: 2,
          note: `${a[j]} va ${a[j + 1]} solishtirilmoqda`,
        });
        if (a[j] > a[j + 1]) {
          ctx.swaps++;
          push(ctx, a, {
            swapping: [j, j + 1], sorted: [...sorted], line: 3,
            note: `${a[j]} > ${a[j + 1]} — joylari almashadi`,
          });
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swappedAny = true;
          push(ctx, a, { sorted: [...sorted], line: 3, note: "Almashtirildi" });
        }
      }
      sorted.unshift(n - 1 - i);
      push(ctx, a, {
        sorted: [...sorted], line: 0,
        note: `${a[n - 1 - i]} o'z o'rnini topdi`,
      });
      // Bitta ham almashtirish bo'lmasa massiv allaqachon saralangan
      if (!swappedAny) break;
    }
  }

  if (algo === "selection") {
    const sorted: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      push(ctx, a, { comparing: [i, i], sorted: [...sorted], line: 1, note: `${a[i]} eng kichik deb olindi` });
      for (let j = i + 1; j < n; j++) {
        ctx.comparisons++;
        push(ctx, a, {
          comparing: [min, j], sorted: [...sorted], line: 3,
          note: `${a[j]} < ${a[min]} ekanini tekshiramiz`,
        });
        if (a[j] < a[min]) {
          min = j;
          push(ctx, a, {
            comparing: [min, min], sorted: [...sorted], line: 3,
            note: `Yangi eng kichik: ${a[min]}`,
          });
        }
      }
      if (min !== i) {
        ctx.swaps++;
        push(ctx, a, { swapping: [i, min], sorted: [...sorted], line: 4, note: `${a[i]} va ${a[min]} almashadi` });
        [a[i], a[min]] = [a[min], a[i]];
      }
      sorted.push(i);
      push(ctx, a, { sorted: [...sorted], line: 0, note: `${a[i]} o'z o'rnida` });
    }
    sorted.push(n - 1);
    push(ctx, a, { sorted: [...sorted], line: 0, note: "Oxirgi element o'z o'rnida" });
  }

  if (algo === "insertion") {
    const sortedPrefix = (k: number) => Array.from({ length: k }, (_, i) => i);
    push(ctx, a, { sorted: [0], line: 0, note: "Birinchi element saralangan hisoblanadi" });

    for (let i = 1; i < n; i++) {
      push(ctx, a, {
        comparing: [i, i], sorted: sortedPrefix(i), line: 1,
        note: `${a[i]} ni chapdagi saralangan qismga joylashtiramiz`,
      });

      let j = i;
      while (j > 0) {
        ctx.comparisons++;
        push(ctx, a, {
          comparing: [j - 1, j], sorted: sortedPrefix(i), line: 2,
          note: `${a[j - 1]} > ${a[j]} ?`,
        });
        if (a[j - 1] <= a[j]) break;

        ctx.swaps++;
        push(ctx, a, {
          swapping: [j - 1, j], sorted: sortedPrefix(i), line: 3,
          note: `${a[j - 1]} > ${a[j]} — joylari almashadi`,
        });
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        j--;
        push(ctx, a, { sorted: sortedPrefix(i), line: 3, note: "Almashtirildi" });
      }
      push(ctx, a, { sorted: sortedPrefix(i + 1), line: 0, note: `${a[j]} o'z joyiga qo'yildi` });
    }
  }

  push(ctx, a, {
    sorted: a.map((_, i) => i),
    line: -1,
    note: "Massiv to'liq saralandi",
  });

  return ctx.frames;
}

/** Tasodifiy massiv — takrorlanuvchi qiymatlarsiz emas, real holatga yaqin */
export function randomArray(size: number, max = 99): number[] {
  return Array.from({ length: size }, () => 1 + Math.floor(Math.random() * max));
}

/** Foydalanuvchi kiritgan matndan massiv: "5, 3 8" → [5,3,8] */
export function parseArray(text: string): number[] {
  return text
    .split(/[^0-9]+/)
    .map(x => parseInt(x, 10))
    .filter(x => Number.isFinite(x) && x > 0)
    .slice(0, 40);
}
