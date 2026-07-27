/**
 * Virtual laboratoriyalar reyestri.
 *
 * Laboratoriyalar — bu kontent emas, interaktiv komponentlar. Shuning uchun
 * ular bazada emas, kodda ro'yxatga olinadi: har biri o'z mantiqiga ega va
 * admin panel orqali "tahrirlab" bo'lmaydi.
 *
 * Yangi lab qo'shish uchun uch joy: shu ro'yxat, `components/labs/` dagi
 * komponent va `[slug]/page.tsx` dagi LAB_COMPONENTS xaritasi.
 */

export type LabSlug = "sorting" | "loops" | "hardware" | "binary";

export type LabMeta = {
  slug: LabSlug;
  title: string;
  summary: string;
  /** Nima o'rganiladi — lab sahifasi boshida ko'rsatiladi */
  goals: string[];
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  minutes: number;
};

export const LABS: LabMeta[] = [
  {
    slug: "loops",
    title: "Sikl va shartlar",
    summary:
      "Dastur qatorma-qator qanday bajarilishini kuzating: qaysi qator ishlayapti, o'zgaruvchilar qanday o'zgaryapti va nima uchun sikl to'xtaydi.",
    goals: [
      "for va while sikllari orasidagi farqni ko'rish",
      "Shart tekshirilganda dastur qaysi tarmoqqa ketishini kuzatish",
      "O'zgaruvchi qiymati har qadamda qanday o'zgarishini tushunish",
      "Ichma-ich sikl necha marta ishlashini sanash",
    ],
    category: "programming",
    difficulty: "beginner",
    minutes: 15,
  },
  {
    slug: "sorting",
    title: "Saralash algoritmlari",
    summary:
      "Bubble, Selection va Insertion saralash qanday ishlashini qadamma-qadam kuzating. O'z massivingizni kiriting va solishtirishlar sonini taqqoslang.",
    goals: [
      "Har bir algoritm massivni qanday tartibga solishini ko'rish",
      "Solishtirish va almashtirish sonini taqqoslash",
      "Nima uchun bir algoritm boshqasidan tez ekanini tushunish",
    ],
    category: "algorithms",
    difficulty: "beginner",
    minutes: 15,
  },
  {
    slug: "binary",
    title: "Ikkilik sanoq sistemasi",
    summary:
      "Bitlarni yoqib-o'chirib, o'nlik son qanday hosil bo'lishini ko'ring. Mashq rejimida berilgan sonni ikkilikda yig'ing.",
    goals: [
      "Har bitning o'rin qiymati (1, 2, 4, 8…) nimani anglatishini bilish",
      "Ikkilik sonni o'nlikka aylantirish",
      "O'nlik sonni ikkilikda yig'ish",
      "Nima uchun bitta bayt 0 dan 255 gacha son saqlashini tushunish",
    ],
    category: "computer_literacy",
    difficulty: "beginner",
    minutes: 10,
  },
  {
    slug: "hardware",
    title: "Kompyuter qurilmalarini ulash",
    summary:
      "Monitor, klaviatura, quloqchin va tarmoq kabelini tizim blokidagi to'g'ri portga ulang. Xato qilsangiz, port nima uchun ekani tushuntiriladi.",
    goals: [
      "HDMI, USB, audio, LAN va quvvat portlarini farqlash",
      "Qaysi qurilma qaysi portga ulanishini bilish",
      "Portlar universalligi va cheklovlarini tushunish",
    ],
    category: "computer_literacy",
    difficulty: "beginner",
    minutes: 10,
  },
];

export const getLab = (slug: string) => LABS.find(l => l.slug === slug);
