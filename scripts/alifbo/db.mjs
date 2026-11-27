/**
 * Bazadagi o'zbekcha kontentni yangi alifboga o'girish.
 *
 *   node scripts/alifbo/db.mjs            # SINOV: hech narsa yozmaydi, hisobot va zaxira yaratadi
 *   node scripts/alifbo/db.mjs --apply    # yozadi (avval sinovni ko'rib chiqing)
 *
 * .env.local dan NEXT_PUBLIC_SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY o'qiladi.
 *
 * Har ishga tushirishda scripts/alifbo/out/ papkasiga yoziladi:
 *   · zaxira-<vaqt>.json  — o'zgaradigan har bir qatorning ESKI qiymati
 *                          (qaytarish uchun: --restore=<fayl>)
 *   · hisobot-<vaqt>.txt  — qaysi jadvalda nechta qator o'zgaradi va
 *                          o'girilgan barcha "ş/ç" li so'zlar ro'yxati
 *                          (inglizcha so'z adashib qolmaganini tekshirish uchun)
 *
 * Skript idempotent: qayta ishga tushirilsa, allaqachon o'girilgan
 * matn o'zgarmaydi.
 *
 * NIMAGA TEGILMAYDI (ataylab):
 *   · kod, testlar, kutilgan natijalar (starter_code, solution_code,
 *     test_cases, answer_spec) — talaba oddiy klaviaturada yozadi
 *   · "Kod nima chiqaradi?" testlarining javob variantlari — ular
 *     dasturning haqiqiy natijasiga teng bo'lishi kerak
 *   · topshiriq shartidagi qo'shtirnoq ichidagi matn — kutilgan natija
 *   · krossvordlar — to'r harflardan qurilgan ("sh" ikki katak, "ş" bitta)
 *   · sertifikatlar (berilgan hujjat), foydalanuvchi yozgan matnlar
 *     (izoh, qayd, profil), boshqa tillar (content_translations)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { convertPlain, convertHtml, PROTECTED } from "./converter.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "scripts", "alifbo", "out");
const APPLY = process.argv.includes("--apply");
const RESTORE = (process.argv.find((a) => a.startsWith("--restore=")) || "").replace("--restore=", "");

// ---------------------------------------------------------------- muhit
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; }),
);
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) { console.error(".env.local da NEXT_PUBLIC_SUPABASE_URL yoki SUPABASE_SERVICE_ROLE_KEY yo'q"); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

/** Tarmoq uzilishi ("fetch failed") vaqtinchalik bo'ladi — 4 martagacha qayta urinadi */
async function fetchRetry(url, opts, tries = 4) {
  for (let i = 1; ; i++) {
    try { return await fetch(url, opts); }
    catch (e) {
      if (i >= tries) throw e;
      await new Promise((r) => setTimeout(r, 800 * i));
    }
  }
}

async function fetchAll(table, select) {
  const rows = [];
  for (let from = 0; ; from += 500) {
    const r = await fetchRetry(`${URL_}/rest/v1/${table}?select=${select}&order=id`, { headers: { ...H, Range: `${from}-${from + 499}` } });
    if (!r.ok) throw new Error(`${table}: ${r.status} ${await r.text()}`);
    const page = await r.json();
    rows.push(...page);
    if (page.length < 500) break;
  }
  return rows;
}
/** `key` — qator qaysi ustun bo'yicha topiladi (about_page'da "key", qolganlarida "id") */
async function patch(table, key, id, values) {
  const r = await fetchRetry(`${URL_}/rest/v1/${table}?${key}=eq.${encodeURIComponent(id)}`, {
    method: "PATCH", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(values),
  });
  if (!r.ok) throw new Error(`${table} ${id}: ${r.status} ${await r.text()}`);
}

// ---------------------------------------------------------------- o'girish turlari

/** Kod qatoriga o'xshaydi: kalit so'z bilan boshlanadi, print(, " = ", >>>, chuqur chekinish */
const CODE_LINE = /^\s{4,}\S|^\s*(def|for|while|if|elif|else:|return|import|from|class|try:|except|print|input)\b|\bprint\(|\binput\(|\w\s=\s\S|>>>|^\s*#/;

/** Matnda kod qatorlari bo'lishi mumkin — faqat oddiy qatorlar o'giriladi */
function convertMixed(text) {
  if (!text || typeof text !== "string") return text;
  return text.split("\n").map((ln) => (CODE_LINE.test(ln) ? ln : convertPlain(ln))).join("\n");
}

/** Topshiriq sharti: qo'shtirnoq ichidagi matn — kutilgan natija, tegilmaydi */
function convertTaskText(text) {
  if (!text || typeof text !== "string") return text;
  return text.split(/("[^"\n]*")/g).map((seg) => (seg.startsWith('"') && seg.endsWith('"') ? seg : convertMixed(seg))).join("");
}

/** Test savoli kod o'z ichiga oladimi ("Kod nima chiqaradi?\n\nprint(...)") */
const isCodeQuestion = (q) => typeof q === "string" && (/\n/.test(q) && q.split("\n").some((l) => CODE_LINE.test(l)) || /nima chiqaradi|nima chiqadi/i.test(q));

/**
 * JSON ichidagi satrlar. `skip` — tegilmaydigan kalitlar. Obyektda kod
 * bo'lsa (code/src/starter), javob variantlari ham tegilmaydi.
 */
function convertJson(node, skip, strFn = convertMixed) {
  if (typeof node === "string") return strFn(node);
  if (Array.isArray(node)) return node.map((x) => convertJson(x, skip, strFn));
  if (node && typeof node === "object") {
    const hasCode = ["code", "src", "starter"].some((k) => typeof node[k] === "string" && node[k].trim()) || isCodeQuestion(node.question);
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (skip.has(k) || (hasCode && ["options", "answer", "answers", "correct"].includes(k))) out[k] = v;
      else if (k === "question" && hasCode) out[k] = convertMixed(v);
      else out[k] = convertJson(v, skip, strFn);
    }
    return out;
  }
  return node;
}

const SLIDE_SKIP = new Set(["t", "code", "output", "input", "starter", "answer", "e"]);
const GAME_SKIP = new Set(["code", "answer", "answers", "correct", "word", "words", "grid", "solution", "id", "type", "key"]);

const arr = (fn) => (v) => (Array.isArray(v) ? v.map((x) => (typeof x === "string" ? fn(x) : x)) : v);

/**
 * Jadval → { ustun: o'girish funksiyasi }. `filter` — qaysi qatorlar
 * (masalan, krossvordlar chiqarib tashlanadi).
 */
const PLAN = [
  { table: "courses", cols: { title: convertPlain, description: convertPlain, long_description: convertHtml, tags: arr(convertPlain) } },
  { table: "topics", cols: { title: convertPlain, content_html: convertHtml, slides: (v) => convertJson(v, SLIDE_SKIP) } },
  {
    table: "quizzes", extra: "question",
    cols: {
      question: convertMixed,
      explanation: convertMixed,
      // Kod savollarida variantlar dastur natijasi — tegilmaydi
      options: (v, row) => (isCodeQuestion(row.question) ? v : convertJson(v, new Set(["id", "is_correct"]), convertMixed)),
    },
  },
  { table: "topic_tasks", cols: { title: convertPlain, description: convertTaskText, instruction_html: convertHtml, hints: (v) => convertJson(v, new Set(["order"]), convertTaskText) } },
  { table: "challenges", cols: { title: convertPlain, description: convertTaskText, instruction_html: convertHtml, tags: arr(convertPlain) } },
  { table: "contests", cols: { title: convertPlain, description: convertMixed, rules_html: convertHtml } },
  { table: "blog_posts", cols: { title: convertPlain, excerpt: convertPlain, content_html: convertHtml, author_name: convertPlain } },
  { table: "books", extra: "language", filter: (r) => !r.language || /^uz/i.test(r.language), cols: { title: convertPlain, description: convertMixed } },
  { table: "glossary_terms", cols: { term: convertPlain, definition: convertMixed, details_html: convertHtml } },
  { table: "teaching_methods", cols: { title: convertPlain, summary: convertMixed, guide_html: convertHtml, advantages: convertMixed, disadvantages: convertMixed, materials: convertMixed } },
  { table: "lesson_games", extra: "type", filter: (r) => r.type !== "crossword", cols: { title: convertPlain, description: convertMixed, content: (v) => convertJson(v, GAME_SKIP) } },
  { table: "achievements", cols: { title: convertPlain, description: convertPlain } },
  { table: "store_items", cols: { title: convertPlain, description: convertMixed } },
  { table: "about_page", key: "key", cols: { value: convertMixed } },
];

// ---------------------------------------------------------------- qaytarish
if (RESTORE) {
  const backup = JSON.parse(fs.readFileSync(RESTORE, "utf8"));
  let n = 0;
  for (const { table, key, id, old } of backup.rows) {
    const r = await fetchRetry(`${URL_}/rest/v1/${table}?${key}=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(old) });
    if (!r.ok) console.error(table, id, r.status, await r.text()); else n++;
  }
  console.log(`${n} ta qator qaytarildi`);
  process.exit(0);
}

// ---------------------------------------------------------------- asosiy
fs.mkdirSync(OUT, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backup = { created: new Date().toISOString(), rows: [] };
const report = [];
const words = new Map();
let total = 0;

const collectWords = (oldV, newV) => {
  const o = JSON.stringify(oldV) ?? "", n = JSON.stringify(newV) ?? "";
  if (o === n) return;
  for (const w of n.match(/[A-Za-zÀ-ɏʼ'-]*[şçŞÇ][A-Za-zÀ-ɏʼ'-]*/g) || []) words.set(w, (words.get(w) || 0) + 1);
};

for (const plan of PLAN) {
  const key = plan.key || "id";
  const cols = Object.keys(plan.cols);
  const select = [key, ...cols, ...(plan.extra ? [plan.extra] : [])].join(",");
  let rows;
  try { rows = await fetchAll(plan.table, select); }
  catch (e) { report.push(`${plan.table}: O'QILMADI — ${e.message.slice(0, 120)}`); continue; }
  if (plan.filter) rows = rows.filter(plan.filter);

  let changed = 0;
  for (const row of rows) {
    const upd = {}, old = {};
    for (const c of cols) {
      if (row[c] == null) continue;
      const nv = plan.cols[c](row[c], row);
      if (JSON.stringify(nv) !== JSON.stringify(row[c])) { upd[c] = nv; old[c] = row[c]; collectWords(row[c], nv); }
    }
    if (!Object.keys(upd).length) continue;
    changed++;
    backup.rows.push({ table: plan.table, key, id: row[key], old });
    if (APPLY) await patch(plan.table, key, row[key], upd).catch((e) => report.push(`  XATO ${plan.table} ${row[key]}: ${e.message.slice(0, 160)}`));
  }
  total += changed;
  report.push(`${plan.table.padEnd(18)} ${String(rows.length).padStart(5)} qator, o'zgaradi: ${changed}`);
}

const wordList = [...words.entries()].sort((a, b) => b[1] - a[1]);
const englishLike = wordList.filter(([w]) => /w|ck|ph|th|ee|oo|ou|ea|tion|ing\b/i.test(w));
const txt = [
  `${APPLY ? "YOZILDI" : "SINOV (hech narsa yozilmadi)"} — ${new Date().toISOString()}`,
  "", ...report, "", `Jami o'zgaradigan qatorlar: ${total}`,
  "", `Inglizchaga o'xshagan o'girilgan so'zlar (ko'rib chiqing, kerak bo'lsa converter.mjs dagi PROTECTED ga qo'shing): ${englishLike.length}`,
  ...englishLike.map(([w, n]) => `  ${n}\t${w}`),
  "", `Barcha o'girilgan ş/ç li so'zlar: ${wordList.length}`,
  ...wordList.map(([w, n]) => `  ${n}\t${w}`),
].join("\n");

fs.writeFileSync(path.join(OUT, `hisobot-${stamp}.txt`), txt, "utf8");
fs.writeFileSync(path.join(OUT, `zaxira-${stamp}.json`), JSON.stringify(backup), "utf8");
console.log(report.join("\n"));
console.log(`\nJami: ${total} qator ${APPLY ? "yozildi" : "o'zgaradi (sinov)"}`);
console.log(`Hisobot: scripts/alifbo/out/hisobot-${stamp}.txt`);
console.log(`Zaxira:  scripts/alifbo/out/zaxira-${stamp}.json${APPLY ? `  (qaytarish: node scripts/alifbo/db.mjs --restore=scripts/alifbo/out/zaxira-${stamp}.json)` : ""}`);
void PROTECTED;
