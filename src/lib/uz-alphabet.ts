/**
 * Yangi o'zbek alifbosi (O'RQ-1184, 2027-yil 22-apreldan) bilan ishlash
 * uchun ishlash vaqtidagi yordamchilar.
 *
 * Kontentning o'zi yangi alifboga scripts/alifbo/ dagi skriptlar bilan
 * o'girilgan. Bu yerda faqat ikki ehtiyoj qoladi:
 *
 *   · toOldUz — nutq sintezi (TTS) eski yozuvni yaxshiroq o'qiydi:
 *     ş, ç kabi harflarni ba'zi ovoz modellari tanimaydi
 *   · searchVariants — foydalanuvchi oddiy klaviaturada "o'zgaruvchi"
 *     deb yozadi, kontent esa endi "özgaruvçi". Qidiruv ikkala shaklda
 *     bajariladi
 */

const APOS = "['’‘ʻʼ`´]";
const LETTER = "A-Za-zÀ-ɏ";

/** Yangi alifbodagi matnni eski lotin yozuviga qaytaradi (yo'qotishsiz). */
export function toOldUz(text: string): string {
  return text
    .replace(/Ö/g, "O‘").replace(/ö/g, "o‘")
    .replace(/Ğ/g, "G‘").replace(/ğ/g, "g‘")
    .replace(/Ş/g, "Sh").replace(/ş/g, "sh")
    .replace(/Ç/g, "Ch").replace(/ç/g, "ch")
    .replace(/ʼ/g, "’");
}

/**
 * Qisqa so'rovni yangi alifboga o'giradi. To'liq konvertordan
 * (scripts/alifbo/converter.mjs) soddaroq: inglizcha so'zlar ro'yxati
 * yo'q, chunki qidiruv asl shaklda ham bajariladi.
 */
function toNewUzLoose(q: string): string {
  return q
    .replace(new RegExp(`([Oo])${APOS}(?=[${LETTER}])`, "g"), (_, c: string) => (c === "O" ? "Ö" : "ö"))
    .replace(new RegExp(`([Gg])${APOS}`, "g"), (_, c: string) => (c === "G" ? "Ğ" : "ğ"))
    .replace(/SH|Sh/g, "Ş").replace(/sh/g, "ş")
    .replace(/CH|Ch/g, "Ç").replace(/ch/g, "ç")
    .replace(new RegExp(`(?<=[${LETTER}])${APOS}(?=[${LETTER}])`, "g"), "ʼ");
}

/**
 * Taqqoslash uchun bitta ko'rinish: kichik harf, yangi harflar eski
 * shaklga, barcha apostrof turlari bitta. "Özgaruvçi", "o'zgaruvchi" va
 * "oʻzgaruvchi" bir xil natija beradi.
 */
export function foldUz(text: string): string {
  return text
    .toLowerCase()
    .replace(/ş/g, "sh").replace(/ç/g, "ch").replace(/ğ/g, "g'").replace(/ö/g, "o'")
    .replace(/[’‘ʻʼ`´]/g, "'");
}

/** Brauzerdagi filtrlar uchun: matnda so'rov bormi (yozuv turidan qat'i nazar). */
export function uzIncludes(text: string | null | undefined, query: string): boolean {
  if (!text) return false;
  return foldUz(text).includes(foldUz(query));
}

/** Qidiruv uchun so'rov shakllari: asl va yangi alifbodagi (farq qilsa). */
export function searchVariants(query: string): string[] {
  const q = query.trim();
  if (!q) return [];
  const fresh = toNewUzLoose(q);
  const old = toOldUz(q);
  return Array.from(new Set([q, fresh, old]));
}
