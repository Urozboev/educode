import { Caveat } from "next/font/google";

/**
 * Qo'lda yozilgan izohlar uchun shrift — faqat bosh sahifada.
 *
 * `preload: false`: shrift fayli boshqa sahifalarda oldindan yuklanmaydi,
 * faqat shu klass ishlatilgan joyda brauzer uni so'raydi. Bitta qalinlik —
 * hajmi kichik bo'lsin.
 *
 * `latin-ext` — yangi o'zbek alifbosidagi ş, ç, ğ, ö harflari uchun.
 */
export const handFont = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["600"],
  display: "swap",
  preload: false,
  variable: "--font-hand",
});
