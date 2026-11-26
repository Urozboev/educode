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
    title: "Röyxatdan ötiş va kiriş",
    lead: "Bir daqiqada hisob yarating — Google orqali yoki elektron poçta bilan.",
    steps: [
      "Yuqori öng burçakdagi \"Röyxatdan ötiş\" tugmasini bosing.",
      "\"Google bilan kiriş\" ni tanlang yoki ism, poçta va parolni kiriting.",
      "Rolingizni tanlang: talaba, öqituvçi yoki ota-ona. Öqituvçi arizasini admin tasdiqlaydi.",
      "Poçta bilan röyxatdan ötgan bölsangiz, poçtangizga kelgan havolani bosib tasdiqlang.",
      "Talabalar qisqa daraja testini topşiradi — platforma sizga mos kurslarni tavsiya qiladi. Testni ötkazib yuboriş ham mumkin.",
    ],
    tips: [
      "Parolni unutsangiz — kiriş oynasidagi \"Parolni unutdingizmi?\" havolasi.",
      "Bir hisobga ikki xil usulda (Google va parol) kiriş mumkin, agar poçta bir xil bölsa.",
    ],
    link: { href: "/register", label: "Röyxatdan ötiş" },
  },
  {
    id: "courses",
    icon: "courses",
    title: "Kursni boşlaş va bajariş",
    lead: "Har bir kurs mavzulardan iborat. Mavzu tört bosqiçda ötiladi.",
    steps: [
      "\"Kurslar\" bölimidan kursni tanlang va \"Boşlaş\" tugmasini bosing.",
      "Mavzuni oçing. Video bölsa — oxirigaça köring.",
      "\"Dars matni\" yoki \"Taqdimot\" tabida mavzuni öqing va \"Öqidim\" deb belgilang.",
      "Testni topşiring — ötiş uçun töğri javoblarning kamida 60% kerak. Qayta topşiriş mumkin.",
      "Amaliy topşiriqni bajaring: kodni yozing va \"Tekşiriş\" ni bosing. Platforma uni testlar bilan avtomatik tekşiradi.",
      "Tört bosqiç tugagaç mavzu yopiladi, coin va XP beriladi. Barça mavzular tugasa — sertifikat.",
    ],
    tips: [
      "Mavzu sahifasining yuqorisidagi çiziq qaysi bosqiçlar qolganini körsatadi.",
      "Mavzu içida şaxsiy qaydlar yozib qöyiş mumkin — ular faqat sizga körinadi.",
      "Sertifikatda QR-kod bor: iş beruvçi uni skanerlab haqiqiyligini tekşiradi.",
    ],
    link: { href: "/explore/courses", label: "Kurslarni köriş" },
  },
  {
    id: "tasks",
    icon: "tasks",
    title: "Topşiriqlar, Playground va AI yordamçi",
    lead: "Dasturlaş faqat kod yoziş bilan örganiladi — buning uçun uçta joy bor.",
    steps: [
      "\"Topşiriqlar\" — qiyinligi böyiça saralangan mustaqil masalalar. Har bir yeçilgani coin va XP beradi.",
      "Masalani oçing, şartini öqing, kodni yozing va \"Işga tuşiriş\" bilan sinab köring.",
      "\"Yuboriş\" tugmasi kodni barça testlar, şu jumladan yaşirinlari bilan tekşiradi.",
      "\"Playground\" — erkin muhit: Python, JavaScript va boşqa tillarda istalgan kodni yozib köring.",
      "Qiyin bölsa — \"Maslahat\" yoki \"AI Yordamçi\". U javobni aytmaydi, savollar bilan töğri yölga boşlaydi.",
    ],
    tips: [
      "Platforma kodda köp uçraydigan xatolarni taniydi va tuşuntirib beradi.",
      "Boşqa joydan köçirib qöyilgan kod belgilanadi — özingiz yozing.",
    ],
    link: { href: "/explore/challenges", label: "Topshiriqlar" },
  },
  {
    id: "coins",
    icon: "coins",
    title: "Coin — platforma valyutasi",
    lead: "Coin öqişdagi harakatingiz uçun beriladi va foydali narsalarga sarflanadi.",
    steps: [
      "Coin balansingiz yon panelning yuqorisida, ismingiz ostida körinadi.",
      "\"Natijalarim\" sahifasida har bir coin qaçon va nima uçun berilgani yozilgan.",
      "\"Dökon\" bölimida coinni sovğalarga almaştirasiz — buyurtma admin yoki öqituvçi tasdiqlagaç beriladi.",
    ],
    pairs: [
      {
        title: "Qanday yiğiladi",
        rows: [
          ["Mavzuni tugatiş", "har bir mavzu uçun"],
          ["Mavzu topşiriği", "qiyinligiga qarab"],
          ["Mustaqil masala", "oson 10 · örta 18 · qiyin 30"],
          ["Kursni tugatiş", "katta bonus"],
          ["Dars öyinlari va olimpiada", "natijaga qarab"],
          ["Yutuqlar", "streak, birinçi masala va boşqalar"],
        ],
      },
      {
        title: "Nimaga sarflanadi",
        rows: [
          ["Do'kon", "platforma va öqituvçi sovğalari"],
          ["Pullik kurslar", "coin evaziga oçiladi"],
          ["Maslahatlar", "qiyin masalada qöşimça yordam"],
        ],
      },
    ],
    tips: [
      "Ota-onalar farzandiga coin sovğa qilişi mumkin.",
      "Coin balansini boşqalar körmaydi — reytingda faqat XP körinadi.",
    ],
    link: { href: "/store", label: "Dökon" },
  },
  {
    id: "xp",
    icon: "xp",
    title: "XP, daraja, reyting va yutuqlar",
    lead: "XP — tajriba ballari. Coin sarflanadi, XP esa faqat ösadi va ösişingizni körsatadi.",
    steps: [
      "XP mavzu, topşiriq, masala, test va öyinlar uçun beriladi.",
      "\"Reyting\" sahifasida talabalar XP böyiça saralanadi. Istalgan qatorga bosib, öşa talabaning natijalarini körasiz.",
      "Daraja (Boşlanğiç, Elementar, Örta, Yuqori) röyxatdan ötgandagi daraja testi böyiça belgilanadi.",
      "Streak — neça kun ketma-ket faol bölganingiz. Bir kun ötkazib yuborilsa, noldan boşlanadi.",
      "Yutuqlar har keça avtomatik beriladi: birinçi masala, 3 va 7 kunlik streak, birinçi kurs va boşqalar.",
    ],
    tips: ["Har kuni ozgina bölsa ham maşq qiling — streak va XP şunda tez ösadi."],
    link: { href: "/leaderboard", label: "Reyting" },
  },
  {
    id: "labs",
    icon: "labs",
    title: "Virtual laboratoriyalar",
    lead: "Kod içida nima bölayotganini köz bilan köriş uçun interaktiv tajribalar.",
    steps: [
      "\"Resurslar\" → \"Laboratoriyalar\" bölimini oçing.",
      "Tajribani tanlang: sikl va şartlar, saralaş algoritmlari, ikkilik sanoq yoki kompyuter qurilmasi.",
      "Qiymatlarni özgartiring va natija qanday özgarişini kuzating — qadamba-qadam yurgiziş mumkin.",
      "Laboratoriya kursidagi mavzularning boşida ham şunday vizual tajriba bor.",
    ],
    link: { href: "/explore/labs", label: "Laboratoriyalar" },
  },
  {
    id: "games",
    icon: "games",
    title: "Öyinlar",
    lead: "Bilimni öyin orqali mustahkamlaş: tez fikrlaş, mantiq va dasturlaş tuşunçalari.",
    steps: [
      "\"Öyinlar\" bölimida Binary Bridge, Cyber Flight, Maze Runner va Quiz Battle bor.",
      "Öyinni tanlang — har birining boşida qoidalar qisqa tuşuntiriladi.",
      "Natijalaringiz saqlanadi va coin beriladi. Baʼzi öyinlarda mukofot kuniga bir marta beriladi.",
    ],
    link: { href: "/explore/games", label: "Öyinlar" },
  },
  {
    id: "lesson-games",
    icon: "lessonGames",
    title: "Dars öyinlari",
    lead: "Mavzu böyiça qisqa öyinlar: viktorina, juftlik topiş, savol-javob taxtasi va krossvord.",
    steps: [
      "\"Dars öyinlari\" bölimidan mavzuga mos öyinni tanlang.",
      "Öyinni öynang — har bir öyin natijasi uçun coin va XP beriladi.",
      "Öqituvçi darsda jonli öyin boşlaşi mumkin: ekrandagi kodni kiritib, telefoningizdan qatnaşasiz.",
      "Öqituvçi öz guruhi uçun yangi öyin yaratadi — u sizning röyxatingizda paydo böladi.",
    ],
    link: { href: "/explore/lesson-games", label: "Dars öyinlari" },
  },
  {
    id: "contests",
    icon: "contests",
    title: "Olimpiada",
    lead: "Vaqt bilan çeklangan musobaqa: bir xil masalalar, umumiy reyting.",
    steps: [
      "\"Olimpiada\" bölimida faol va kelgusi musobaqalar körsatiladi.",
      "Iştirok etişni bosing va boşlaniş vaqtini kuting.",
      "Masalalarni istalgan tartibda yeçing. Örin avval yeçilgan masalalar soni bilan, teng bölsa — ball bilan belgilanadi: tezroq va kamroq urinişda yeçilgan masala köproq ball beradi.",
      "Musobaqa tugagaç yakuniy reyting eʼlon qilinadi. Ötgan olimpiadalarni maşq rejimida yeçiş mumkin.",
    ],
    link: { href: "/explore/contests", label: "Olimpiadalar" },
  },
];

export const GUIDE_ROLES: GuideRole[] = [
  {
    id: "role-student",
    title: "Talaba",
    who: "Dasturlaşni örganayotgan har bir kişi.",
    can: [
      "Kurslarni öqiş, test va topşiriqlarni bajariş",
      "Mustaqil masalalar, olimpiada va öyinlarda qatnaşiş",
      "Coin yiğiş va dökonda sarflaş",
      "Öqituvçi bergan kod bilan guruhga qöşiliş",
      "Sertifikat oliş va oçiq portfolio yaratiş",
      "AI yordamçi va \"Ustoz\" agentidan foydalaniş",
    ],
    start: "Röyxatdan ötişda \"Talaba\" rolini tanlang va daraja testini topşiring.",
  },
  {
    id: "role-teacher",
    title: "Öqituvçi",
    who: "Guruh bilan işlaydigan pedagog.",
    can: [
      "Guruh yaratiş va talabalarga qöşiliş kodini beriş",
      "Talabalarning progressi, test va topşiriq natijalarini kuzatiş",
      "Topşiriq beriş va natijalarni CSV faylga yuklab oliş (Excelʼda oçiladi)",
      "Dars öyinlari yaratiş va darsda jonli öyin ötkaziş",
      "Öz talabalari uçun dökonga sovğa qöyiş",
      "Metodik qöllanmalar, kitoblar va luğatdan foydalaniş",
    ],
    start: "Röyxatdan ötişda \"Öqituvçi\" rolini tanlang va ariza töldiring — admin tasdiqlagaç kabinet oçiladi.",
  },
  {
    id: "role-parent",
    title: "Ota-ona",
    who: "Farzandining öqişini kuzatmoqçi bölgan ota-ona.",
    can: [
      "Farzandining hisobini uning poçtasi orqali boğlaş (farzand sörovni tasdiqlaydi)",
      "Kurslardagi progress, natijalar va faollikni köriş",
      "Coin sotib oliş (Payme, Click) va farzandiga sovğa qiliş",
    ],
    start: "Röyxatdan ötişda \"Ota-ona\" rolini tanlang, söng farzandingiz platformada röyxatdan ötgan poçtani kiriting — u öz kabinetida sörovni tasdiqlaydi.",
  },
  {
    id: "role-admin",
    title: "Administrator",
    who: "Platformani boşqaruvçi xodim.",
    can: [
      "Kurslar, mavzular, testlar va topşiriqlarni yaratiş",
      "Foydalanuvçilar, rollar va öqituvçi arizalarini boşqariş",
      "Olimpiada, blog, kutubxona va dökonni yuritiş",
      "Coin sotuvi, tölovlar va tarjimalarni boşqariş",
      "Statistika va hisobotlarni köriş",
    ],
    start: "Admin rolini faqat boşqa administrator beradi.",
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
