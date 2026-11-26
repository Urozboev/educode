/**
 * Talabaning SI mentoriga yozgan har bir xabarini kodlash:
 * fikrlashni vositaga TOPSHIRISH (CO) yoki FAOL o'rganish (AL).
 *
 * Z.Wang va S.Liu (AIED 2026) ning ALLEF sxemasi g'oyasiga tayangan,
 * lekin o'zbek tilidagi (lotin va kirill) hamda rus tilidagi xabarlar
 * uchun qayta tuzilgan qoidaviy tasnifchi. Qoidaviy bo'lgani sababli
 * natija takrorlanadi va ekspert kodlashi bilan solishtirib (Koen kappasi,
 * /a-cognitive sahifasi) tekshiriladi. Versiya o'zgarsa CLASSIFIER_VERSION
 * oshiriladi — eski va yangi kodlar aralashib ketmasin.
 */

export const CLASSIFIER_VERSION = "uz_rules_v1";

export type EngagementCode = "CO1" | "CO2" | "CO3" | "CO4" | "AL1" | "AL2" | "AL3" | "AL4" | "N";
export type EngagementKind = "CO" | "AL" | "N";

export const ENGAGEMENT_CODES: { code: EngagementCode; kind: EngagementKind; label: string; example: string }[] = [
  { code: "CO1", kind: "CO", label: "Tayyor yechim so'rash", example: "Shu masalaning kodini yozib bering" },
  { code: "CO2", kind: "CO", label: "Topshiriqni ko'chirib berish", example: "(topshiriq sharti o'z fikrisiz joylashtiriladi)" },
  { code: "CO3", kind: "CO", label: "Xatoni tuzatib berishni so'rash", example: "Ishlamayapti, to'g'irlab bering" },
  { code: "CO4", kind: "CO", label: "Passiv davom ettirish", example: "Keyin-chi? / davom et / tushunmadim" },
  { code: "AL1", kind: "AL", label: "Tushuncha savoli", example: "Nega bu yerda while emas for ishlatiladi?" },
  { code: "AL2", kind: "AL", label: "O'z gipotezasini aytish", example: "Menimcha, sikl bir marta ortiqcha aylanyapti" },
  { code: "AL3", kind: "AL", label: "O'z yechimini tushuntirish", example: "Men avval ro'yxatni saraladim, keyin…" },
  { code: "AL4", kind: "AL", label: "Tekshirish va umumlashtirish", example: "To'g'ri tushundimmi? Boshqa usul bormi?" },
  { code: "N", kind: "N", label: "Boshqa / neytral", example: "Salom, rahmat" },
];

export const kindOf = (code: EngagementCode): EngagementKind =>
  ENGAGEMENT_CODES.find((c) => c.code === code)?.kind ?? "N";

// ---------- Matnni bir xil ko'rinishga keltirish ----------
const CYR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z", и: "i", й: "y", к: "k",
  л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "x", ц: "ts",
  ч: "ch", ш: "sh", щ: "sh", ъ: "'", ы: "i", ь: "", э: "e", ю: "yu", я: "ya", ў: "o'", қ: "q", ғ: "g'", ҳ: "h",
};

/** Kichik harf, kirill → lotin, apostrof variantlari → ' , ortiqcha bo'shliqlar olib tashlanadi */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-яёўқғҳ]/g, (ch) => CYR[ch] ?? ch)
    // Yangi alifbo (O'RQ-1184): qoidalar eski lotinda yozilgan — talaba
    // qaysi yozuvda yozmasin, bir xil ko'rinishga keladi
    .replace(/ş/g, "sh").replace(/ç/g, "ch").replace(/ğ/g, "g'").replace(/ö/g, "o'")
    .replace(/[‘’ʻʼ`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Xabarda kod bormi (blok yoki bir necha kod qatori) */
export function hasCode(raw: string): boolean {
  if (/```/.test(raw)) return true;
  const lines = raw.split("\n").filter((l) => /^\s*(def |for |while |if |print\(|import |return |[a-z_]\w*\s*=[^=]|elif |else:|class )/i.test(l));
  return lines.length >= 2;
}

// ---------- Qoidalar ----------
// So'z o'zagi + qo'shimchalar: "yoz", "yozib", "yozing", "yozvor"…
const RX = {
  // CO1: tayyor yechim/kod so'rash
  solution: [
    /(kod|kodi|kodini|dastur|dasturi|dasturini|yechim|yechimi|yechimini|javob|javobi|javobini|programma|reshenie|kod)\w*\s.{0,25}?\b(yoz|yech|ber|qil|tashla|ko'rsat|chiqar|tuz|ayt)\w*/,
    /\b(yozib|yechib|qilib|ishlab|tuzib|chiqarib)\s?(ber|bering|bera|beri|yubor|tashla|ko'rsat|qo'y)/,
    /\b(to'liq|tayyor|butun|hamma)\s(kod|yechim|javob|dastur)/,
    /\b(napishi|reshi|day|dai|skin\w*)\s.{0,20}(kod|reshen|otvet|programm)/,
    /\b(write|give|solve|send)\b.{0,20}\b(code|solution|answer|program)/,
  ],
  // CO3: xatoni tuzatib berishni so'rash
  fix: [
    /(xato|xatoni|xatolik|ishlamay|ishlamadi|error|oshibk|ne rabota)\w*.{0,40}(tuzat|to'g'irla|to'g'rila|to'g'rla|tog'irla|ispravi|fix)/,
    /(tuzatib|to'g'irlab|to'g'rilab|to'g'rlab|ispravi)\s?(ber|bering|qo'y|yubor)?/,
  ],
  // CO4: passiv davom ettirish (qisqa xabar)
  passive: /^(keyin|keyinchi|keyin-chi|davom|davom et|davom eting|yana|ok|okey|xo'p|ha|boshqa|tushunmadim|tushunmadim\.|nima|\?+|dalshe|eshe|next|continue)[\s!?.)]*$/,
  // AL2: o'z gipotezasi
  hypothesis: /\b(menimcha|mening fikrimcha|o'ylaymanki|o'ylayman|deb o'ylad|balki|ehtimol|shekilli|chamasi|sababi|chunki|mne kajetsya|dumayu|navernoe|i think|maybe because)\b/,
  // AL3: o'z yechimini tushuntirish (birinchi shaxs + harakat)
  ownWork: [
    /\bmen\b.{0,40}\b(yozdim|qildim|ishlatdim|urindim|urinib|sinadim|sinab ko'rdim|tekshirdim|qo'shdim|o'zgartirdim|o'ylab topdim|hisobladim)/,
    /\b(mening kodim|kodimda|yechimimda|algoritmim|avval .{1,40} keyin)\b/,
    /\b(ya napisal|ya sdelal|ya probov|moy kod|i wrote|i tried|my code)\b/,
  ],
  // AL4: tekshirish va umumlashtirish
  verify: /\b(to'g'rimi|to'g'ri tushundimmi|to'g'ri qildimmi|tekshirib|boshqa (usul|yo'l)|yaxshiroq|samaraliroq|qisqaroq|agar .{1,40} (bo'lsa|qilsam) nima|umuman olganda|xulosa qilsak|pravilno li|drugoy sposob|is it correct|better way)/,
  // AL1: tushuncha savoli
  concept: /\b(nega|nima uchun|nimaga|qanday ishlaydi|qanday qilib|farqi|nima degani|nimani anglatadi|qachon ishlatiladi|ma'nosi|qanaqa|pochemu|zachem|kak rabotaet|chem otlichaetsya|why|how does|what is the difference)\b|\b(nima|nimadir|chto takoe)\s*\?/,
  explain: /(tushuntir|izohla|izoh ber|ob'yasn|obyasn|explain)/,
  // CO2: topshiriq sharti belgilari
  taskText: /\b(dastur tuzing|dastur yozing|funksiya yozing|berilgan|kiritiladi|chiqaring|toping|hisoblang|kirish:|chiqish:|input|output|topshiriq|masala)\b/,
};

const any = (list: RegExp[], s: string) => list.some((r) => r.test(s));

/**
 * Xabarni bitta kodga ajratadi. Ustuvorlik:
 * o'z fikri (AL3, AL2) bo'lsa — yordam so'rasa ham faol o'rganish hisoblanadi;
 * so'ng to'g'ridan-to'g'ri topshirish (CO1, CO2, CO3), so'ng tekshirish (AL4),
 * tushuncha savoli (AL1) va passiv davom (CO4).
 */
export function classifyMessage(raw: string): { code: EngagementCode; kind: EngagementKind } {
  const s = normalize(raw);
  if (!s) return { code: "N", kind: "N" };
  const code = ((): EngagementCode => {
    if (any(RX.ownWork, s)) return "AL3";
    if (RX.hypothesis.test(s)) return "AL2";
    // "Kodni tushuntirib bering" — tushunishni so'rash, yechimni emas
    if (RX.explain.test(s) && !/\b(yozib|yechib|qilib|tuzib)\s?ber/.test(s)) return "AL1";
    // Uzun shart matni, savol yoki o'z fikri yo'q — topshiriqni ko'chirib berish
    if (s.length > 160 && RX.taskText.test(s) && !RX.concept.test(s) && !/\?/.test(s)) return "CO2";
    if (any(RX.solution, s)) return "CO1";
    if (any(RX.fix, s)) return "CO3";
    // Faqat kod joylab, hech narsa yozmagan — tuzatishni kutish
    if (hasCode(raw) && raw.replace(/```[\s\S]*?```/g, "").trim().length < 15) return "CO3";
    if (RX.verify.test(s)) return "AL4";
    if (RX.concept.test(s)) return "AL1";
    if (RX.passive.test(s)) return "CO4";
    return "N";
  })();
  return { code, kind: kindOf(code) };
}

/** Ko'mak darajasi (89-migratsiya, ai_support_state) */
export interface SupportState {
  level: 0 | 1 | 2 | 3;
  base_level?: number;
  recovered?: number;
  index?: number | null;
  weighted?: number;
  autonomous?: number;
  events?: number;
  interpretable?: boolean;
  zone?: "healthy" | "moderate" | "high" | "very_high" | null;
  staff?: boolean;
  parts?: Record<string, number>;
}

export const SUPPORT_LEVELS = [
  {
    name: "To'liq ko'mak",
    short: "Barcha maslahatlar va SI izohi ochiq.",
    rule: "",
    maxHint: 4,
  },
  {
    name: "Yo'naltiruvchi ko'mak",
    short: "SI faqat yo'naltiruvchi savollar beradi. Kod parchasi (4-maslahat) o'z yechimingizni bir marta yuborgandan keyin ochiladi.",
    rule: "Talabaning SIga bog'liqligi o'rtacha. Faqat yo'naltiruvchi savol ber, kod yozma, javobni talabaning o'zi topsin.",
    maxHint: 4,
  },
  {
    name: "Ishora bosqichi",
    short: "Faqat 1–2-darajali maslahatlar ochiq. SI izohi o'z urinishingizdan keyin beriladi.",
    rule: "Talabaning SIga bog'liqligi yuqori. Javobing 2–3 jumladan oshmasin: faqat qisqa ishora va bitta savol. Kod ham, aniq qadamlar ham berma.",
    maxHint: 2,
  },
  {
    name: "Mustaqil sinov",
    short: "Topshiriqlar bo'yicha SI izohi vaqtincha yopiq, faqat 1-maslahat ochiq. Bitta topshiriqni maslahatsiz yeching — ko'mak darhol qaytadi.",
    rule: "Talaba hozir mustaqil sinov bosqichida. Topshiriqqa oid kod, yechim yo'li yoki xato joyini aytma. Faqat umumiy tushunchani (sintaksis, atama ma'nosi) qisqa tushuntirishing mumkin va talabani o'zi urinib ko'rishga undash kerak.",
    maxHint: 1,
  },
] as const;

/** Mentorga qo'shimcha ko'rsatma: talaba tayyor yechim so'raganda */
export const OFFLOAD_NUDGE =
  "Talaba hozir tayyor yechim yoki tuzatishni so'radi. Yechim berma. Avval undan o'z fikrini so'ra: nimani sinab ko'rdi, qayerda to'xtadi, xato qayerda deb o'ylaydi. Bitta aniq savol bilan yakunla.";
