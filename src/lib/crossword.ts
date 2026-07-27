import type { CrosswordContent, CrosswordWord, CrosswordDir } from "@/types";

/**
 * Krossvord to'rini avtomatik quruvchi.
 *
 * O'qituvchidan faqat so'z va ta'rif so'raladi — katak koordinatalarini
 * qo'lda kiritish real ishda deyarli imkonsiz. Joylashuv shu yerda hisoblanadi
 * va natija `content` ichida saqlanadi, shuning uchun o'yin har ochilganda
 * bir xil ko'rinadi (qayta generatsiya qilinmaydi).
 *
 * Algoritm: ochko'z (greedy) kesishma qidiruvi. So'zlar uzunligi bo'yicha
 * saralanadi, birinchisi markazga gorizontal qo'yiladi, qolganlari allaqachon
 * qo'yilganlar bilan umumiy harf orqali kesishtiriladi.
 */

/** Krossvord uchun normalizatsiya: bosh harf, apostrof va bo'shliqsiz */
export function normalizeAnswer(s: string): string {
  return s
    .toUpperCase()
    .replace(/[''`ʻʼ’]/g, "")
    .replace(/[^A-ZА-ЯЎҚҒҲ0-9]/gi, "");
}

type Cell = { ch: string };
type Placed = { answer: string; clue: string; row: number; col: number; dir: CrosswordDir };

const key = (r: number, c: number) => `${r},${c}`;

function canPlace(
  grid: Map<string, Cell>,
  word: string,
  row: number,
  col: number,
  dir: CrosswordDir
): boolean {
  const dr = dir === "down" ? 1 : 0;
  const dc = dir === "across" ? 1 : 0;

  // So'z boshidan oldingi va oxiridan keyingi katak bo'sh bo'lishi shart,
  // aks holda ikki so'z qo'shilib bitta uzun so'zga aylanadi
  if (grid.has(key(row - dr, col - dc))) return false;
  if (grid.has(key(row + dr * word.length, col + dc * word.length))) return false;

  let intersections = 0;

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const existing = grid.get(key(r, c));

    if (existing) {
      if (existing.ch !== word[i]) return false;
      intersections++;
      continue;
    }

    // Bo'sh katakka qo'yayotgan bo'lsak, yon tomonlari ham bo'sh bo'lishi kerak —
    // aks holda yonma-yon parallel so'zlar hosil bo'lib, o'qib bo'lmaydigan
    // harflar ketma-ketligi paydo bo'ladi
    const sideA = dir === "across" ? key(r - 1, c) : key(r, c - 1);
    const sideB = dir === "across" ? key(r + 1, c) : key(r, c + 1);
    if (grid.has(sideA) || grid.has(sideB)) return false;
  }

  return intersections > 0;
}

function place(grid: Map<string, Cell>, word: string, row: number, col: number, dir: CrosswordDir) {
  const dr = dir === "down" ? 1 : 0;
  const dc = dir === "across" ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    grid.set(key(row + dr * i, col + dc * i), { ch: word[i] });
  }
}

export type BuildResult = {
  content: CrosswordContent;
  /** To'rga sig'dirib bo'lmagan so'zlar (boshqa so'zlar bilan umumiy harfi yo'q) */
  skipped: string[];
};

export function buildCrossword(entries: { answer: string; clue: string }[]): BuildResult {
  const words = entries
    .map(e => ({ answer: normalizeAnswer(e.answer), clue: e.clue.trim(), raw: e.answer }))
    .filter(e => e.answer.length >= 2 && e.clue)
    .sort((a, b) => b.answer.length - a.answer.length);

  const grid = new Map<string, Cell>();
  const placed: Placed[] = [];
  const skipped: string[] = [];

  if (!words.length) {
    return { content: { rows: 0, cols: 0, words: [] }, skipped: [] };
  }

  // Birinchi so'z — tayanch
  place(grid, words[0].answer, 0, 0, "across");
  placed.push({ answer: words[0].answer, clue: words[0].clue, row: 0, col: 0, dir: "across" });

  for (let w = 1; w < words.length; w++) {
    const { answer, clue, raw } = words[w];
    let done = false;

    // Har bir harfni allaqachon qo'yilgan so'zlarning mos harfi bilan kesishtiramiz
    for (let i = 0; i < answer.length && !done; i++) {
      for (const p of placed) {
        for (let j = 0; j < p.answer.length; j++) {
          if (p.answer[j] !== answer[i]) continue;

          // Kesishuvchi so'z perpendikulyar yo'nalishda yotadi
          const dir: CrosswordDir = p.dir === "across" ? "down" : "across";
          const anchorRow = p.dir === "across" ? p.row : p.row + j;
          const anchorCol = p.dir === "across" ? p.col + j : p.col;
          const row = dir === "down" ? anchorRow - i : anchorRow;
          const col = dir === "across" ? anchorCol - i : anchorCol;

          if (canPlace(grid, answer, row, col, dir)) {
            place(grid, answer, row, col, dir);
            placed.push({ answer, clue, row, col, dir });
            done = true;
            break;
          }
        }
        if (done) break;
      }
    }

    if (!done) skipped.push(raw);
  }

  // Koordinatalarni 0 dan boshlanadigan qilib siljitamiz
  let minRow = Infinity, minCol = Infinity, maxRow = -Infinity, maxCol = -Infinity;
  grid.forEach((_, k) => {
    const [r, c] = k.split(",").map(Number);
    minRow = Math.min(minRow, r); maxRow = Math.max(maxRow, r);
    minCol = Math.min(minCol, c); maxCol = Math.max(maxCol, c);
  });

  const shifted: CrosswordWord[] = placed.map(p => ({
    answer: p.answer,
    clue: p.clue,
    row: p.row - minRow,
    col: p.col - minCol,
    dir: p.dir,
  }));

  return {
    content: numberWords({
      rows: maxRow - minRow + 1,
      cols: maxCol - minCol + 1,
      words: shifted,
    }),
    skipped,
  };
}

/**
 * Standart krossvord raqamlash: kataklar yuqoridan pastga, chapdan o'ngga
 * ko'rib chiqiladi; so'z boshlanadigan katak raqam oladi. Bir katakda ham
 * gorizontal, ham vertikal so'z boshlansa — raqam bitta.
 */
export function numberWords(content: CrosswordContent): CrosswordContent {
  const starts = new Map<string, number>();
  const sorted = [...content.words].sort((a, b) => a.row - b.row || a.col - b.col);

  let n = 0;
  const withNums = sorted.map(w => {
    const k = key(w.row, w.col);
    if (!starts.has(k)) {
      n += 1;
      starts.set(k, n);
    }
    return { ...w, num: starts.get(k)! };
  });

  return { ...content, words: withNums };
}

/** Har bir katak uchun qaysi so'zlarga tegishli ekanini hisoblaydi */
export function buildGrid(content: CrosswordContent) {
  const cells = new Map<string, { ch: string; num?: number }>();

  content.words.forEach(w => {
    const dr = w.dir === "down" ? 1 : 0;
    const dc = w.dir === "across" ? 1 : 0;
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.row + dr * i;
      const c = w.col + dc * i;
      const k = key(r, c);
      const prev = cells.get(k);
      cells.set(k, {
        ch: w.answer[i],
        num: i === 0 ? (prev?.num ?? w.num) : prev?.num,
      });
    }
  });

  return cells;
}

export const cellKey = key;
