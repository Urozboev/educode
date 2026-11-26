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
    title: "Sikl va şartlar",
    summary:
      "Dastur qatorma-qator qanday bajarilişini kuzating: qaysi qator işlayapti, özgaruvçilar qanday özgaryapti va nima uçun sikl töxtaydi.",
    goals: [
      "for va while sikllari orasidagi farqni köriş",
      "Şart tekşirilganda dastur qaysi tarmoqqa ketişini kuzatiş",
      "Özgaruvçi qiymati har qadamda qanday özgarişini tuşuniş",
      "Içma-iç sikl neça marta işlaşini sanaş",
    ],
    category: "programming",
    difficulty: "beginner",
    minutes: 15,
  },
  {
    slug: "sorting",
    title: "Saralaş algoritmlari",
    summary:
      "Bubble, Selection va Insertion saralaş qanday işlaşini qadamma-qadam kuzating. Öz massivingizni kiriting va soliştirişlar sonini taqqoslang.",
    goals: [
      "Har bir algoritm massivni qanday tartibga solişini köriş",
      "Soliştiriş va almaştiriş sonini taqqoslaş",
      "Nima uçun bir algoritm boşqasidan tez ekanini tuşuniş",
    ],
    category: "algorithms",
    difficulty: "beginner",
    minutes: 15,
  },
  {
    slug: "binary",
    title: "Ikkilik sanoq sistemasi",
    summary:
      "Bitlarni yoqib-öçirib, önlik son qanday hosil bölişini köring. Maşq rejimida berilgan sonni ikkilikda yiğing.",
    goals: [
      "Har bitning örin qiymati (1, 2, 4, 8…) nimani anglatişini biliş",
      "Ikkilik sonni önlikka aylantiriş",
      "Önlik sonni ikkilikda yiğiş",
      "Nima uçun bitta bayt 0 dan 255 gaça son saqlaşini tuşuniş",
    ],
    category: "computer_literacy",
    difficulty: "beginner",
    minutes: 10,
  },
  {
    slug: "hardware",
    title: "Kompyuter qurilmalarini ulaş",
    summary:
      "Monitor, klaviatura, quloqçin va tarmoq kabelini tizim blokidagi töğri portga ulang. Xato qilsangiz, port nima uçun ekani tuşuntiriladi.",
    goals: [
      "HDMI, USB, audio, LAN va quvvat portlarini farqlaş",
      "Qaysi qurilma qaysi portga ulanişini biliş",
      "Portlar universalligi va çeklovlarini tuşuniş",
    ],
    category: "computer_literacy",
    difficulty: "beginner",
    minutes: 10,
  },
];

export const getLab = (slug: string) => LABS.find(l => l.slug === slug);
