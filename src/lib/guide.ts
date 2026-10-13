/**
 * Platformadan foydalanish yo'riqnomasi — mazmun.
 *
 * Har bir bo'lim alohida qisqa video bilan birga ko'rsatiladi. Video
 * manzillari kodda emas, `platform_settings` jadvalidagi `guide_videos`
 * kalitida saqlanadi va admin panel → "Yo'riqnoma videolari" sahifasida
 * kiritiladi (/a-guide). Video hali yo'q bo'lim faqat matn bilan chiqadi.
 *
 * Nega bitta uzun video emas, bo'limlar bo'yicha qisqa videolar:
 *   · foydalanuvchi faqat o'ziga kerak savolni ochadi ("coin nima?")
 *   · 1 daqiqalik video oxirigacha ko'riladi, 15 daqiqalik — yo'q
 *   · bitta imkoniyat o'zgarsa, faqat o'sha video qayta yoziladi
 * Bosh sahifada esa 2-3 daqiqalik umumiy tanishtiruv videosi turadi.
 *
 * Matn hozircha o'zbekcha. Boshqa tillarda ham shu matn ko'rinadi —
 * xuddi tarjima qilinmagan dars kontenti kabi.
 */

export type GuideIcon =
  | "login" | "courses" | "tasks" | "coins" | "xp" | "labs" | "games" | "lessonGames" | "contests";

export interface GuideSection {
  id: string;
  icon: GuideIcon;
  title: string;
  lead: string;
  steps: string[];
  tips?: string[];
  /** Ikki ustunli izohli ro'yxat (masalan: coin qanday yig'iladi / nimaga sarflanadi) */
  pairs?: { title: string; rows: [string, string][] }[];
  link?: { href: string; label: string };
}

export interface GuideRole {
  id: "role-student" | "role-teacher" | "role-parent" | "role-admin";
  title: string;
  who: string;
  can: string[];
  start: string;
}

/** Videolar shu kalitlar bo'yicha saqlanadi: bo'lim id'lari, rol id'lari va "overview". */
export const GUIDE_VIDEO_KEYS = [
  "overview",
  "start", "courses", "tasks", "coins", "xp", "labs", "games", "lesson-games", "contests",
  "role-student", "role-teacher", "role-parent", "role-admin",
] as const;
export type GuideVideoKey = (typeof GUIDE_VIDEO_KEYS)[number];
export type GuideVideos = Partial<Record<GuideVideoKey, string>>;

export const GUIDE_SETTINGS_KEY = "guide_videos";

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "start",
    icon: "login",
    title: "Ro'yxatdan o'tish va kirish",
    lead: "Bir daqiqada hisob yarating — Google orqali yoki elektron pochta bilan.",
    steps: [
      "Yuqori o'ng burchakdagi \"Ro'yxatdan o'tish\" tugmasini bosing.",
      "\"Google bilan kirish\" ni tanlang yoki ism, pochta va parolni kiriting.",
      "Rolingizni tanlang: talaba, o'qituvchi yoki ota-ona. O'qituvchi arizasini admin tasdiqlaydi.",
      "Pochta bilan ro'yxatdan o'tgan bo'lsangiz, pochtangizga kelgan havolani bosib tasdiqlang.",
      "Talabalar qisqa daraja testini topshiradi — platforma sizga mos kurslarni tavsiya qiladi. Testni o'tkazib yuborish ham mumkin.",
    ],
    tips: [
      "Parolni unutsangiz — kirish oynasidagi \"Parolni unutdingizmi?\" havolasi.",
      "Bir hisobga ikki xil usulda (Google va parol) kirish mumkin, agar pochta bir xil bo'lsa.",
    ],
    link: { href: "/register", label: "Ro'yxatdan o'tish" },
  },
  {
    id: "courses",
    icon: "courses",
    title: "Kursni boshlash va bajarish",
    lead: "Har bir kurs mavzulardan iborat. Mavzu to'rt bosqichda o'tiladi.",
    steps: [
      "\"Kurslar\" bo'limidan kursni tanlang va \"Boshlash\" tugmasini bosing.",
      "Mavzuni oching. Video bo'lsa — oxirigacha ko'ring.",
      "\"Dars matni\" yoki \"Taqdimot\" tabida mavzuni o'qing va \"O'qidim\" deb belgilang.",
      "Testni topshiring — o'tish uchun to'g'ri javoblarning kamida 60% kerak. Qayta topshirish mumkin.",
      "Amaliy topshiriqni bajaring: kodni yozing va \"Tekshirish\" ni bosing. Platforma uni testlar bilan avtomatik tekshiradi.",
      "To'rt bosqich tugagach mavzu yopiladi, coin va XP beriladi. Barcha mavzular tugasa — sertifikat.",
    ],
    tips: [
      "Mavzu sahifasining yuqorisidagi chiziq qaysi bosqichlar qolganini ko'rsatadi.",
      "Mavzu ichida shaxsiy qaydlar yozib qo'yish mumkin — ular faqat sizga ko'rinadi.",
      "Sertifikatda QR-kod bor: ish beruvchi uni skanerlab haqiqiyligini tekshiradi.",
    ],
    link: { href: "/explore/courses", label: "Kurslarni ko'rish" },
  },
  {
    id: "tasks",
    icon: "tasks",
    title: "Topshiriqlar, Playground va AI yordamchi",
    lead: "Dasturlash faqat kod yozish bilan o'rganiladi — buning uchun uchta joy bor.",
    steps: [
      "\"Topshiriqlar\" — qiyinligi bo'yicha saralangan mustaqil masalalar. Har bir yechilgani coin va XP beradi.",
      "Masalani oching, shartini o'qing, kodni yozing va \"Ishga tushirish\" bilan sinab ko'ring.",
      "\"Yuborish\" tugmasi kodni barcha testlar, shu jumladan yashirinlari bilan tekshiradi.",
      "\"Playground\" — erkin muhit: Python, JavaScript va boshqa tillarda istalgan kodni yozib ko'ring.",
      "Qiyin bo'lsa — \"Maslahat\" yoki \"AI Yordamchi\". U javobni aytmaydi, savollar bilan to'g'ri yo'lga boshlaydi.",
    ],
    tips: [
      "Platforma kodda ko'p uchraydigan xatolarni taniydi va tushuntirib beradi.",
      "Boshqa joydan ko'chirib qo'yilgan kod belgilanadi — o'zingiz yozing.",
    ],
    link: { href: "/explore/challenges", label: "Topshiriqlar" },
  },
  {
    id: "coins",
    icon: "coins",
    title: "Coin — platforma valyutasi",
    lead: "Coin o'qishdagi harakatingiz uchun beriladi va foydali narsalarga sarflanadi.",
    steps: [
      "Coin balansingiz yon panelning yuqorisida, ismingiz ostida ko'rinadi.",
      "\"Natijalarim\" sahifasida har bir coin qachon va nima uchun berilgani yozilgan.",
      "\"Do'kon\" bo'limida coinni sovg'alarga almashtirasiz — buyurtma admin yoki o'qituvchi tasdiqlagach beriladi.",
    ],
    pairs: [
      {
        title: "Qanday yig'iladi",
        rows: [
          ["Mavzuni tugatish", "har bir mavzu uchun"],
          ["Mavzu topshirig'i", "qiyinligiga qarab"],
          ["Mustaqil masala", "oson 10 · o'rta 18 · qiyin 30"],
          ["Kursni tugatish", "katta bonus"],
          ["Dars o'yinlari va olimpiada", "natijaga qarab"],
          ["Yutuqlar", "streak, birinchi masala va boshqalar"],
        ],
      },
      {
        title: "Nimaga sarflanadi",
        rows: [
          ["Do'kon", "platforma va o'qituvchi sovg'alari"],
          ["Pullik kurslar", "coin evaziga ochiladi"],
          ["Maslahatlar", "qiyin masalada qo'shimcha yordam"],
        ],
      },
    ],
    tips: [
      "Ota-onalar farzandiga coin sovg'a qilishi mumkin.",
      "Coin balansini boshqalar ko'rmaydi — reytingda faqat XP ko'rinadi.",
    ],
    link: { href: "/store", label: "Do'kon" },
  },
  {
    id: "xp",
    icon: "xp",
    title: "XP, daraja, reyting va yutuqlar",
    lead: "XP — tajriba ballari. Coin sarflanadi, XP esa faqat o'sadi va o'sishingizni ko'rsatadi.",
    steps: [
      "XP mavzu, topshiriq, masala, test va o'yinlar uchun beriladi.",
      "\"Reyting\" sahifasida talabalar XP bo'yicha saralanadi. Istalgan qatorga bosib, o'sha talabaning natijalarini ko'rasiz.",
      "Daraja (Boshlang'ich, Elementar, O'rta, Yuqori) ro'yxatdan o'tgandagi daraja testi bo'yicha belgilanadi.",
      "Streak — necha kun ketma-ket faol bo'lganingiz. Bir kun o'tkazib yuborilsa, noldan boshlanadi.",
      "Yutuqlar har kecha avtomatik beriladi: birinchi masala, 3 va 7 kunlik streak, birinchi kurs va boshqalar.",
    ],
    tips: ["Har kuni ozgina bo'lsa ham mashq qiling — streak va XP shunda tez o'sadi."],
    link: { href: "/leaderboard", label: "Reyting" },
  },
  {
    id: "labs",
    icon: "labs",
    title: "Virtual laboratoriyalar",
    lead: "Kod ichida nima bo'layotganini ko'z bilan ko'rish uchun interaktiv tajribalar.",
    steps: [
      "\"Resurslar\" → \"Laboratoriyalar\" bo'limini oching.",
      "Tajribani tanlang: sikl va shartlar, saralash algoritmlari, ikkilik sanoq yoki kompyuter qurilmasi.",
      "Qiymatlarni o'zgartiring va natija qanday o'zgarishini kuzating — qadamba-qadam yurgizish mumkin.",
      "Laboratoriya kursidagi mavzularning boshida ham shunday vizual tajriba bor.",
    ],
    link: { href: "/explore/labs", label: "Laboratoriyalar" },
  },
  {
    id: "games",
    icon: "games",
    title: "O'yinlar",
    lead: "Bilimni o'yin orqali mustahkamlash: tez fikrlash, mantiq va dasturlash tushunchalari.",
    steps: [
      "\"O'yinlar\" bo'limida Binary Bridge, Cyber Flight, Maze Runner va Quiz Battle bor.",
      "O'yinni tanlang — har birining boshida qoidalar qisqa tushuntiriladi.",
      "Natijalaringiz saqlanadi va coin beriladi. Ba'zi o'yinlarda mukofot kuniga bir marta beriladi.",
    ],
    link: { href: "/explore/games", label: "O'yinlar" },
  },
  {
    id: "lesson-games",
    icon: "lessonGames",
    title: "Dars o'yinlari",
    lead: "Mavzu bo'yicha qisqa o'yinlar: viktorina, juftlik topish, savol-javob taxtasi va krossvord.",
    steps: [
      "\"Dars o'yinlari\" bo'limidan mavzuga mos o'yinni tanlang.",
      "O'yinni o'ynang — har bir o'yin natijasi uchun coin va XP beriladi.",
      "O'qituvchi darsda jonli o'yin boshlashi mumkin: ekrandagi kodni kiritib, telefoningizdan qatnashasiz.",
      "O'qituvchi o'z guruhi uchun yangi o'yin yaratadi — u sizning ro'yxatingizda paydo bo'ladi.",
    ],
    link: { href: "/explore/lesson-games", label: "Dars o'yinlari" },
  },
  {
    id: "contests",
    icon: "contests",
    title: "Olimpiada",
    lead: "Vaqt bilan cheklangan musobaqa: bir xil masalalar, umumiy reyting.",
    steps: [
      "\"Olimpiada\" bo'limida faol va kelgusi musobaqalar ko'rsatiladi.",
      "Ishtirok etishni bosing va boshlanish vaqtini kuting.",
      "Masalalarni istalgan tartibda yeching. O'rin avval yechilgan masalalar soni bilan, teng bo'lsa — ball bilan belgilanadi: tezroq va kamroq urinishda yechilgan masala ko'proq ball beradi.",
      "Musobaqa tugagach yakuniy reyting e'lon qilinadi. O'tgan olimpiadalarni mashq rejimida yechish mumkin.",
    ],
    link: { href: "/explore/contests", label: "Olimpiadalar" },
  },
];

export const GUIDE_ROLES: GuideRole[] = [
  {
    id: "role-student",
    title: "Talaba",
    who: "Dasturlashni o'rganayotgan har bir kishi.",
    can: [
      "Kurslarni o'qish, test va topshiriqlarni bajarish",
      "Mustaqil masalalar, olimpiada va o'yinlarda qatnashish",
      "Coin yig'ish va do'konda sarflash",
      "O'qituvchi bergan kod bilan guruhga qo'shilish",
      "Sertifikat olish va ochiq portfolio yaratish",
      "AI yordamchi va \"Ustoz\" agentidan foydalanish",
    ],
    start: "Ro'yxatdan o'tishda \"Talaba\" rolini tanlang va daraja testini topshiring.",
  },
  {
    id: "role-teacher",
    title: "O'qituvchi",
    who: "Guruh bilan ishlaydigan pedagog.",
    can: [
      "Guruh yaratish va talabalarga qo'shilish kodini berish",
      "Talabalarning progressi, test va topshiriq natijalarini kuzatish",
      "Topshiriq berish va natijalarni CSV faylga yuklab olish (Excel'da ochiladi)",
      "Dars o'yinlari yaratish va darsda jonli o'yin o'tkazish",
      "O'z talabalari uchun do'konga sovg'a qo'yish",
      "Metodik qo'llanmalar, kitoblar va lug'atdan foydalanish",
    ],
    start: "Ro'yxatdan o'tishda \"O'qituvchi\" rolini tanlang va ariza to'ldiring — admin tasdiqlagach kabinet ochiladi.",
  },
  {
    id: "role-parent",
    title: "Ota-ona",
    who: "Farzandining o'qishini kuzatmoqchi bo'lgan ota-ona.",
    can: [
      "Farzandining hisobini uning pochtasi orqali bog'lash (farzand so'rovni tasdiqlaydi)",
      "Kurslardagi progress, natijalar va faollikni ko'rish",
      "Coin sotib olish (Payme, Click) va farzandiga sovg'a qilish",
    ],
    start: "Ro'yxatdan o'tishda \"Ota-ona\" rolini tanlang, so'ng farzandingiz platformada ro'yxatdan o'tgan pochtani kiriting — u o'z kabinetida so'rovni tasdiqlaydi.",
  },
  {
    id: "role-admin",
    title: "Administrator",
    who: "Platformani boshqaruvchi xodim.",
    can: [
      "Kurslar, mavzular, testlar va topshiriqlarni yaratish",
      "Foydalanuvchilar, rollar va o'qituvchi arizalarini boshqarish",
      "Olimpiada, blog, kutubxona va do'konni yuritish",
      "Coin sotuvi, to'lovlar va tarjimalarni boshqarish",
      "Statistika va hisobotlarni ko'rish",
    ],
    start: "Admin rolini faqat boshqa administrator beradi.",
  },
];

/**
 * Video manzilini joylash uchun shaklga keltiradi.
 * YouTube, Bunny Stream va to'g'ridan-to'g'ri .mp4 havolalar qo'llanadi.
 */
export function toEmbed(url: string | undefined | null): { kind: "iframe" | "video"; src: string } | null {
  if (!url) return null;
  const u = url.trim();
  if (!/^https?:\/\//i.test(u)) return null;

  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i);
  if (yt) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` };

  if (/iframe\.mediadelivery\.net\/(embed|play)\//i.test(u)) {
    return { kind: "iframe", src: u.replace("/play/", "/embed/") };
  }
  if (/\.(mp4|webm)(\?|$)/i.test(u)) return { kind: "video", src: u };

  return { kind: "iframe", src: u };
}
