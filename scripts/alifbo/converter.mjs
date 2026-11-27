/**
 * O'zbek lotin yozuvini yangi alifboga o'girish.
 *
 * Qonun: O'RQ-1184 (2026-yil 21-oktabr), 2027-yil 22-apreldan kuchga kiradi.
 *   sh → ş   ch → ç   o' → ö   g' → ğ   tutuq belgisi → ʼ (U+02BC)
 *   ng — o'zgarmaydi (n + g).
 *
 * Qoidalar ketma-ketligi muhim:
 *   1. o'/g' (har xil apostrof shakllari bilan) → ö/ğ
 *   2. sh/ch → ş/ç
 *   3. ikki harf orasida qolgan apostrof → tutuq ʼ
 *
 * Nimaga TEGILMAYDI:
 *   · kod: `...` ichidagi matn, HTML'da <pre>, <code>, <kbd>, <samp>
 *   · HTML teglarining o'zi va atributlari (class="shadow" kabi)
 *   · havolalar, pochta, @foydalanuvchi, #heshteg
 *   · inglizcha atamalar va brendlar (ChatGPT, Chrome, Bash, ...)
 *   · CamelCase so'zlar (PyTorch, GitHub)
 *
 * Funksiya idempotent: allaqachon o'girilgan matnni qayta o'tkazish
 * hech narsani o'zgartirmaydi.
 */

/** Apostrofning barcha uchraydigan shakllari */
const APOS = "'’‘ʻʼ`´";
const TUTUQ = "ʼ";

/** Lotin harfi (yangi harflar bilan birga) — apostrof "ikki harf orasida"mi, tekshirish uchun */
const LETTER = "A-Za-zÀ-ɏ";

/**
 * O'zgartirilmaydigan so'zlar (kichik harfda). Inglizcha texnik atamalar,
 * brendlar va dasturlash so'zlari: ularda sh/ch o'zbekcha tovush emas.
 * Ro'yxat loyihadagi barcha matnlardagi sh/ch li so'zlarni ko'rib chiqib
 * tuzilgan (scripts/alifbo/sozlar.mjs).
 */
export const PROTECTED = new Set([
  // AI va brendlar
  "chatgpt", "chrome", "chromebook", "techcrunch", "shopify", "huggingface",
  "dashboard", "flash", "flashcard", "flashcards", "flash-card", "flash-cardlar",
  "pytorch", "scikit", "chess", "sketch", "photoshop", "chromium", "cache",
  "machine", "search", "research", "approach", "teacher", "coach",
  // dasturlash
  "bash", "shell", "hash", "hashing", "hashmap", "push", "pushed", "fetch",
  "switch", "match", "catch", "branch", "patch", "batch", "chunk", "chunks",
  "shift", "shortcut", "shortcuts", "show", "share", "shared", "sha256",
  "char", "chars", "charat", "check", "checkbox", "checked", "choice", "chr",
  "touch", "each", "shuffle", "sha", "shutil", "split", "mouse", "keyboard",
  "lru_cache", "launch", "rich", "chain", "schema", "schedule", "scheduler",
  "english", "technical", "charset", "watch", "stretch", "finish", "publish",
  "bunny", "deepseek", "anthropic", "shadcn", "mesh", "smash", "crash",
  "fresh", "refresh", "splash", "slash", "backslash", "hashtag", "chart", "charts",
  "c-sharp", "sharp", "csharp", "cherry", "chip", "chips",
  // mahsulot va xizmat nomlari
  "aisha",
  // loyihadagi matnlarni ko'rib chiqishda topilgan inglizcha atamalar
  "challenge", "challenges", "character", "characters", "hashable", "unhashable",
  "manchester", "no-cache", "shifts", "ssh", "tech", "exchanger", "sheet",
  "drop-shadow", "prefers-color-scheme",
  // bazadagi kontentni ko'rib chiqishda topilganlar (2026-11-27): buyruqlar,
  // HTTP sarlavhalari, TCP holatlari, dastur nomlari
  "apache", "established", "hierarchy", "attached", "echo", "flushdns", "netsh",
  "change", "psh", "tashkent", "control", "none",
]);

/** So'z tokeni: harflar, raqamlar, apostroflar, chiziqcha, pastki chiziq */
const TOKEN_RE = new RegExp(`[${LETTER}0-9_${APOS}-]+`, "g");

function isProtectedWord(w) {
  const bare = w.replace(new RegExp(`[${APOS}].*$`), "").toLowerCase();
  if (PROTECTED.has(bare) || PROTECTED.has(w.toLowerCase())) return true;
  // CamelCase / ichida katta harf: ChatGPT, PyTorch, GitHub, iPhone
  if (/[a-z][A-Z]/.test(w)) return true;
  // pastki chiziqli yoki raqamli identifikator: is_published, sha256
  if (/_/.test(w) || /[a-z][0-9]|[0-9][a-z]/i.test(w)) return true;
  // Inglizcha so'z: o'zbekcha so'zda bu birikmalar uchramaydi
  // (should, reach, shallow, checks, sheets, wireshark)
  if (/sh|ch/i.test(w) && /w|ck|ph|th|ee|oo|ou|ea/i.test(w)) return true;
  return false;
}

/** Bitta so'zni o'giradi (himoyalanmagan bo'lsa) */
function convertWord(w) {
  if (isProtectedWord(w)) return w;
  // Chiziqchali so'z — har bir qism alohida: "Cache-Control", "pre-shared"
  // inglizcha qoladi, "Veb-dasturlash" esa o'giriladi
  if (/[^-]-[^-]/.test(w)) return w.split("-").map((p) => (p ? convertWord(p) : p)).join("-");
  let s = w;
  // 1. o' / g'
  //    o' faqat ortidan harf kelsa: o'zbekchada so'z oxirida o' deyarli yo'q,
  //    lekin "'JetBrains Mono'" kabi yopuvchi tirnoq ko'p uchraydi.
  //    g' so'z oxirida ham bo'ladi: tog', bog', yog'.
  s = s.replace(new RegExp(`([Oo])[${APOS}](?=[${LETTER}${APOS}])`, "g"), (_, c) => (c === "O" ? "Ö" : "ö"));
  s = s.replace(new RegExp(`([Gg])[${APOS}]`, "g"), (_, c) => (c === "G" ? "Ğ" : "ğ"));
  // 2. sh / ch (katta-kichik harf variantlari)
  s = s.replace(/SH/g, "Ş").replace(/Sh/g, "Ş").replace(/sh/g, "ş");
  s = s.replace(/CH/g, "Ç").replace(/Ch/g, "Ç").replace(/ch/g, "ç");
  // 3. ikki harf orasidagi qolgan apostrof — tutuq
  s = s.replace(new RegExp(`(?<=[${LETTER}])[${APOS}](?=[${LETTER}])`, "g"), TUTUQ);
  return s;
}

/**
 * Oddiy matn. Himoyalanadigan bo'laklar: `kod`, havolalar, pochta,
 * @nom, #teg, fayl nomlari (salom.py).
 */
const PLAIN_SKIP_RE = new RegExp([
  "`[^`\\n]*`",                       // `kod`
  "\\{[^{}\\n]*\\}",                  // {nom} — lug'atdagi o'rin belgilari
  "&#?[a-zA-Z0-9]+;",                 // &shy; &nbsp; &#39; — HTML belgilari
  "https?:\\/\\/\\S+", "www\\.\\S+",  // havolalar
  "[\\w.+-]+@[\\w-]+\\.[\\w.]+",      // pochta
  "[@#][\\w.]+",                      // @nom, #teg
  "\\b[\\w-]+\\.(?:py|js|ts|tsx|html|css|json|sh|txt|csv|md|exe)\\b", // fayl nomlari
].map((x) => `(?:${x})`).join("|"), "g");

/**
 * Qoraqalpoq yozuvining o'ziga xos harflari — o'zbekchada yo'q. Bunday
 * matnga tegilmaydi: qoraqalpoq tilining o'z imlosi bor.
 */
const KAA_LETTERS = /[ıǵńáóúÁÓÚǴŃ]/;

export function convertPlain(text) {
  if (!text || typeof text !== "string") return text;
  if (KAA_LETTERS.test(text)) return text;
  let out = "";
  let last = 0;
  for (const m of text.matchAll(PLAIN_SKIP_RE)) {
    out += text.slice(last, m.index).replace(TOKEN_RE, convertWord);
    out += m[0];
    last = m.index + m[0].length;
  }
  out += text.slice(last).replace(TOKEN_RE, convertWord);
  return out;
}

/**
 * HTML. Faqat teglar orasidagi matn o'giriladi; teglarning o'zi
 * (atributlar bilan) va kod bloklari ichidagi hamma narsa o'zgarmaydi.
 */
const SKIP_TAGS = new Set(["pre", "code", "kbd", "samp", "script", "style"]);

export function convertHtml(html) {
  if (!html || typeof html !== "string") return html;
  const parts = html.split(/(<[^>]+>)/g);
  const stack = [];
  return parts
    .map((p) => {
      if (p.startsWith("<") && p.endsWith(">")) {
        const m = p.match(/^<\s*(\/)?\s*([a-zA-Z0-9]+)/);
        if (m) {
          const tag = m[2].toLowerCase();
          if (SKIP_TAGS.has(tag)) {
            if (m[1]) {
              const i = stack.lastIndexOf(tag);
              if (i >= 0) stack.splice(i, 1);
            } else if (!/\/\s*>$/.test(p)) {
              stack.push(tag);
            }
          }
        }
        return p;
      }
      return stack.length ? p : convertPlain(p);
    })
    .join("");
}

/**
 * Teskari o'girish — TTS (nutq sintezi) kabi eski yozuvni kutadigan
 * xizmatlar uchun. Yo'qotishsiz: har bir yangi harf bitta eski shaklga mos.
 */
export function toOld(text) {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/Ö/g, "O‘").replace(/ö/g, "o‘")
    .replace(/Ğ/g, "G‘").replace(/ğ/g, "g‘")
    .replace(/Ş/g, "Sh").replace(/ş/g, "sh")
    .replace(/Ç/g, "Ch").replace(/ç/g, "ch")
    .replace(/ʼ/g, "’");
}

/** Qidiruv so'rovi: foydalanuvchi eski yozuvda yozadi — yangisiga o'giramiz */
export const convertQuery = convertPlain;
