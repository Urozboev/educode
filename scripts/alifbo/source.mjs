/**
 * Manba koddagi o'zbekcha matnlarni yangi alifboga o'girish.
 *
 *   node scripts/alifbo/source.mjs --scan    # nima o'zgarishini ko'rsatadi
 *   node scripts/alifbo/source.mjs --apply   # fayllarga yozadi
 *
 * TypeScript sintaksis daraxti orqali ishlaydi — oddiy qidir-almashtir
 * emas. Shuning uchun o'zgaruvchi nomlari, izohlar, CSS klasslari, URL,
 * Supabase ustun/jadval nomlari va kod namunalari tegilmaydi.
 *
 * Qaysi matn o'giriladi:
 *   · o'zbekcha lug'at (dictionaries/uz.ts) — barcha satrlar
 *   · JSX ichidagi matn (<p>Salom</p>), <code>/<pre> ichidagisidan tashqari
 *   · matn atributlari: title, placeholder, aria-label, alt, label
 *   · toast/confirm/alert chaqiruvlaridagi xabarlar
 *   · tabiiy tilga o'xshagan boshqa satrlar (bo'shliq + o'zbekcha belgi),
 *     agar ular kod, klass yoki identifikatorga o'xshamasa
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { convertPlain } from "./converter.mjs";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../..");
const SRC = path.join(ROOT, "src");
const APPLY = process.argv.includes("--apply");

// Boshqa tillarning lug'atlari va kontent tarjimalari tegilmaydi
const SKIP_FILES = [
  /dictionaries[\\/](ru|en|kaa)\.ts$/,
];
const DICT_UZ = /dictionaries[\\/]uz\.ts$/;

// --exclude=a,b,c — vaqtincha tegilmaydigan fayllar (masalan, boshqa ish
// davom etayotgan fayllar). Skript idempotent: keyin qayta ishga tushirsa bo'ladi.
const EXCLUDE = (process.argv.find((a) => a.startsWith("--exclude=")) || "")
  .replace("--exclude=", "").split(",").filter(Boolean)
  .map((p) => path.resolve(ROOT, p).toLowerCase());

const UZ_MARK = /[OoGg]['’‘ʻ`]|sh|ch|Sh|Ch|SH|CH|[A-Za-z]['’‘ʻ`][A-Za-z]/;
const CODE_LIKE = /\b(print|input|def|return|import|range|len|int|str|float|lambda|for|while)\s*\(|=>|===|!==|\bconst\b|\bfunction\b|^\s*[#/.]|\\n|<\/?[a-z][^>]*>/;
const IDENT_LIKE = /^[\w\-/.:#@%,()[\]=?&+*!~|^$ ]*$/; // klass, yo'l, identifikator ro'yxati
const TEXT_ATTRS = new Set(["title", "placeholder", "aria-label", "alt", "label", "description", "subtitle"]);
const NON_TEXT_ATTRS = new Set(["className", "class", "href", "src", "id", "key", "type", "rel", "target", "name", "value", "style", "role", "lang", "htmlFor", "pattern", "accept", "autoComplete", "dir", "method", "action"]);
const SKIP_CALLEES = new Set(["cn", "clsx", "twMerge", "require", "fetch", "querySelector", "querySelectorAll", "getElementById", "from", "eq", "neq", "select", "order", "rpc", "in", "ilike", "like", "is", "match", "contains", "upsert", "insert", "update", "delete", "storage", "getItem", "setItem", "removeItem", "addEventListener", "removeEventListener", "push", "replace", "redirect", "startsWith", "endsWith", "includes", "split", "join", "test", "RegExp", "Date", "log", "warn", "error", "info", "debug", "createElement", "setAttribute", "getAttribute", "searchParams", "get", "set", "has", "Intl", "toLocaleString", "toLocaleDateString", "format", "dynamic", "useQuery", "cached", "unstable_cache", "revalidateTag", "revalidatePath", "headers", "cookies", "NextResponse", "json"]);
const MSG_CALLEES = new Set(["toast", "success", "error", "warning", "message", "confirm", "alert", "prompt"]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!["node_modules", ".next"].includes(e.name)) walk(p, out); }
    else if (/\.(tsx?|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

function calleeName(call) {
  const ex = call.expression;
  if (ts.isIdentifier(ex)) return ex.text;
  if (ts.isPropertyAccessExpression(ex)) return ex.name.text;
  return "";
}

function insideJsxTag(node, names) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isJsxElement(p)) {
      const n = p.openingElement.tagName.getText();
      if (names.has(n)) return true;
    }
  }
  return false;
}
const CODE_TAGS = new Set(["code", "pre", "kbd", "samp"]);

/**
 * Boshqa tilga tegishli qiymat: { uz: "...", en: "...", kaa: "..." }.
 * Qoraqalpoq tilining o'z imlosi bor — unga o'zbek alifbosi qoidasi
 * qo'llanmaydi. Inglizcha qiymatlarda sh/ch — ingliz tovushi.
 */
const OTHER_LOCALES = new Set(["en", "ru", "kaa"]);
function underOtherLocale(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isPropertyAssignment(p)) {
      const k = p.name.getText().replace(/["']/g, "");
      if (OTHER_LOCALES.has(k)) return true;
      if (k === "uz") return false;
    }
  }
  return false;
}
const CSS_LIKE = /@media|prefers-|drop-shadow|\b\d+px\b|rgba?\(|hsla?\(|var\(--|cubic-bezier|!important/;

/** Satr literalini o'girish kerakmi? */
function shouldConvertLiteral(node, isDict) {
  const text = node.text;
  if (!UZ_MARK.test(text)) return false;
  if (isDict) return true;
  if (underOtherLocale(node)) return false;
  if (CSS_LIKE.test(text)) return false;

  const parent = node.parent;
  // import "x"; export ... from "x"
  if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent) || ts.isExternalModuleReference(parent)) return false;
  // obyekt kaliti: { "sh": 1 }
  if (ts.isPropertyAssignment(parent) && parent.name === node) return false;
  // type literal: "a" | "b"
  if (ts.isLiteralTypeNode(parent)) return false;
  // switch case / taqqoslash qiymatlari — kod mantig'i
  if (ts.isCaseClause(parent)) return false;
  if (ts.isBinaryExpression(parent) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken].includes(parent.operatorToken.kind)) return false;
  if (ts.isElementAccessExpression(parent)) return false;

  // JSX atribut
  let attr = parent;
  if (ts.isJsxExpression(attr)) attr = attr.parent;
  if (ts.isJsxAttribute(attr)) {
    const name = attr.name.getText();
    if (NON_TEXT_ATTRS.has(name)) return false;
    if (TEXT_ATTRS.has(name)) return true;
  }
  if (insideJsxTag(node, CODE_TAGS)) return false;

  // chaqiruv argumenti
  if (ts.isCallExpression(parent) || ts.isNewExpression(parent)) {
    const name = ts.isCallExpression(parent) ? calleeName(parent) : parent.expression.getText();
    if (SKIP_CALLEES.has(name)) return false;
    if (MSG_CALLEES.has(name)) return true;
  }

  if (CODE_LIKE.test(text)) return false;
  if (IDENT_LIKE.test(text) && !/\s/.test(text.trim())) return false;
  if (!/\s/.test(text.trim())) {
    // bitta so'z: faqat aniq matn joylarida (obyektdagi label/title/text kabi)
    if (ts.isPropertyAssignment(parent)) {
      const k = parent.name.getText().replace(/["']/g, "");
      return /^(label|title|text|desc|description|hint|message|placeholder|lead|name|subtitle|heading|cta|tooltip|caption)$/i.test(k);
    }
    return false;
  }
  // klasslar ro'yxatiga o'xshaydi: "flex items-center shadow"
  if (/^[a-z0-9:/\-[\].%#() ]+$/.test(text) && /\b(flex|grid|text-|bg-|border|rounded|px-|py-|w-|h-|shadow|items-|justify-)/.test(text)) return false;
  return true;
}

const changes = [];
let filesChanged = 0;

for (const file of walk(SRC)) {
  if (SKIP_FILES.some((r) => r.test(file))) continue;
  if (EXCLUDE.some((e) => file.toLowerCase() === e || file.toLowerCase().startsWith(e + path.sep))) continue;
  const isDict = DICT_UZ.test(file);
  const src = fs.readFileSync(file, "utf8");
  if (!UZ_MARK.test(src)) continue;
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edits = []; // [start, end, newText]

  const visit = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (shouldConvertLiteral(node, isDict)) {
        const conv = convertPlain(node.text);
        if (conv !== node.text) {
          // Asl tirnoq turini saqlaymiz; ichki tarkibni almashtiramiz
          const raw = node.getText(sf);
          const q = raw[0];
          const inner = raw.slice(1, -1);
          const newInner = convertPlain(inner);
          if (newInner !== inner) edits.push([node.getStart(sf) + 1, node.getEnd() - 1, newInner, node.text, conv]);
        }
      }
    } else if (ts.isTemplateExpression(node)) {
      // `Salom ${ism}, xush kelibsiz` — statik bo'laklar
      const parts = [node.head, ...node.templateSpans.map((s) => s.literal)];
      const whole = parts.map((p) => p.text).join(" ");
      let ok = isDict;
      if (!ok && UZ_MARK.test(whole) && /\s/.test(whole.trim()) && !CODE_LIKE.test(whole) && !CSS_LIKE.test(whole) && !underOtherLocale(node)) {
        let attr = node.parent;
        if (ts.isJsxExpression(attr)) attr = attr.parent;
        const badAttr = ts.isJsxAttribute(attr) && NON_TEXT_ATTRS.has(attr.name.getText());
        const badCall = ts.isCallExpression(node.parent) && SKIP_CALLEES.has(calleeName(node.parent));
        const classy = /\b(flex|grid|text-|bg-|border|rounded|px-|py-|shadow)/.test(whole);
        ok = !badAttr && !badCall && !classy && !insideJsxTag(node, CODE_TAGS);
      }
      if (ok) {
        for (const p of parts) {
          const raw = p.getText(sf);
          // head: `...${   middle: }...${   tail: }...`
          const startOff = raw.startsWith("`") || raw.startsWith("}") ? 1 : 0;
          const endOff = raw.endsWith("${") ? 2 : raw.endsWith("`") ? 1 : 0;
          const inner = raw.slice(startOff, raw.length - endOff);
          const conv = convertPlain(inner);
          if (conv !== inner) edits.push([p.getStart(sf) + startOff, p.getEnd() - endOff, conv, inner, conv]);
        }
      }
    } else if (ts.isJsxText(node)) {
      // JSX'da apostrof ko'pincha &apos; deb yoziladi (react/no-unescaped-entities).
      // Avval oddiy apostrofga aylantiramiz, o'giramiz, qolgan apostroflarni
      // (tirnoq vazifasidagilarni) yana &apos; qilamiz — aks holda lint yiqiladi.
      const decoded = node.text.replace(/&apos;|&#39;|&rsquo;|&lsquo;/g, "'");
      if (!insideJsxTag(node, CODE_TAGS) && UZ_MARK.test(decoded) && !underOtherLocale(node)) {
        const conv = convertPlain(decoded).replace(/'/g, "&apos;");
        if (conv !== node.text) edits.push([node.getStart(sf, false), node.getEnd(), conv, node.text, conv, true]);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  if (!edits.length) continue;
  // JsxText ning getStart'i bo'shliqlarni tashlaydi — to'liq diapazonni ishlatamiz
  let out = src;
  edits.sort((a, b) => b[0] - a[0]);
  for (const e of edits) {
    let [s, en, txt] = e;
    if (e[5]) { s = en - e[3].length; }
    out = out.slice(0, s) + txt + out.slice(en);
    changes.push({ file: path.relative(ROOT, file), from: e[3].trim().slice(0, 90), to: e[4].trim().slice(0, 90) });
  }
  filesChanged++;
  if (APPLY) fs.writeFileSync(file, out, "utf8");
}

if (process.argv.includes("--list")) {
  for (const c of changes) console.log(`${c.file}\n   - ${c.from}\n   + ${c.to}`);
}
const perFile = {};
for (const c of changes) perFile[c.file] = (perFile[c.file] || 0) + 1;
console.log(Object.entries(perFile).sort((a, b) => b[1] - a[1]).map(([f, n]) => `${String(n).padStart(5)}  ${f}`).join("\n"));
console.log(`\n${changes.length} ta matn, ${filesChanged} ta fayl${APPLY ? " — YOZILDI" : " (sinov, hech narsa yozilmadi)"}`);
