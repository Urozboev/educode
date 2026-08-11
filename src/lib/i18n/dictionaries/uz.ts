/**
 * O'zbekcha — asosiy lug'at. Qolgan tillar shu tuzilmani takrorlaydi va
 * TypeScript ularni `Dictionary` turi orqali tekshiradi: yangi kalit
 * qo'shilsa, uchala tilda ham to'ldirmaguncha loyiha kompilyatsiya
 * bo'lmaydi. Shu tarzda tarjima "yarim qolgan" holatga tushmaydi.
 */
export const uz = {
  nav: {
    courses: "Kurslar",
    challenges: "Topshiriqlar",
    playground: "Playground",
    contests: "Olimpiada",
    resources: "Resurslar",
    blog: "Blog",
    about: "Platforma haqida",
    books: "Kitoblar",
    glossary: "Terminlar",
    labs: "Laboratoriya",
    lessonGames: "Dars o'yinlari",
    games: "O'yinlar",
    methods: "Metodlar",
    portfolios: "Portfoliolar",
    hints: {
      books: "Bepul PDF kitoblar",
      glossary: "Lug'at va flash-cardlar",
      labs: "Interaktiv vizualizatorlar",
      lessonGames: "Viktorina, krossvord",
      games: "Arkada mashqlar",
      methods: "O'qituvchiga yo'riqnoma",
      portfolios: "Talabalar ishlari",
    },
    dashboard: "Kabinet",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    logout: "Chiqish",
    language: "Til",
  },

  common: {
    loading: "Yuklanmoqda...",
    save: "Saqlash",
    cancel: "Bekor qilish",
    delete: "O'chirish",
    edit: "Tahrirlash",
    search: "Qidirish",
    back: "Orqaga",
    next: "Keyingi",
    all: "Barchasi",
    empty: "Ma'lumot yo'q",
    error: "Xatolik yuz berdi",
    retry: "Qayta urinish",
    close: "Yopish",
    confirm: "Tasdiqlash",
    coins: "coin",
    xp: "XP",
    minutes: "daqiqa",
    hours: "soat",
  },

  difficulty: {
    beginner: "Boshlang'ich",
    intermediate: "O'rta",
    advanced: "Yuqori",
    easy: "Oson",
    medium: "O'rta",
    hard: "Qiyin",
  },

  auth: {
    loginTitle: "Hisobingizga kiring",
    loginSubtitle: "Kurslar, topshiriqlar va olimpiadalar sizni kutmoqda",
    registerTitle: "Bepul hisob yarating",
    registerSubtitle: "Bir necha daqiqada boshlang — karta kerak emas",
    email: "Elektron pochta",
    password: "Parol",
    fullName: "To'liq ism",
    submitLogin: "Kirish",
    submitRegister: "Ro'yxatdan o'tish",
    noAccount: "Hisobingiz yo'qmi?",
    haveAccount: "Hisobingiz bormi?",
    forgotPassword: "Parolni unutdingizmi?",
    role: "Rolingiz",
    roleStudent: "O'quvchi",
    roleTeacher: "O'qituvchi",
    roleParent: "Ota-ona",
  },

  courses: {
    title: "Kurslar",
    subtitle: "Noldan boshlab amaliyotga qadar — o'z sur'atingizda o'rganing",
    enroll: "Kursga yozilish",
    continue: "Davom ettirish",
    completed: "Tugatilgan",
    topics: "mavzu",
    students: "talaba",
    free: "Bepul",
    toc: "Kurs mundarijasi",
    searchInCourse: "Kurs ichidan qidirish: mavzu nomi yoki matn...",
    searchResults: "ta natija",
    searchEmpty: "bo'yicha hech nima topilmadi",
    notes: "Qaydlarim",
    notesHint: "ta mavzu bo'yicha — takrorlash uchun",
  },

  reviews: {
    title: "Baholar va izohlar",
    count: "ta izoh",
    basedOn: "ta baho asosida",
    rateThis: "Kursni baholang",
    yourRating: "Sizning bahoyingiz",
    editYours: "Bahoyingizni o'zgartiring",
    placeholder: "Kurs haqida fikringiz — nima yoqdi, nima yetishmadi? (ixtiyoriy)",
    submit: "Yuborish",
    update: "Yangilash",
    empty: "Hali izoh yo'q — birinchi bo'ling",
    needEnroll: "Baho qoldirish uchun avval kursga yozilishingiz kerak.",
    completedBadge: "kursni tugatgan",
    hidden: "Izoh matni administrator tomonidan yashirilgan",
    pickStar: "Yulduzchani tanlang",
    thanks: "Rahmat! Izohingiz qo'shildi",
    updated: "Izoh yangilandi",
    labels: {
      1: "Yomon",
      2: "Qoniqarsiz",
      3: "O'rtacha",
      4: "Yaxshi",
      5: "Ajoyib",
    },
  },

  challenges: {
    title: "Topshiriqlar",
    subtitle: "Kod yozib mashq qiling — har bir yechim avtomatik tekshiriladi",
    solved: "yechgan",
    categories: {
      basics: "Asoslar",
      math: "Matematika",
      strings: "Satrlar",
      arrays: "Massivlar",
      algorithms: "Algoritmlar",
    },
  },

  contests: {
    title: "Olimpiadalar",
    subtitle: "Belgilangan vaqtda masalalarni yeching, natijangiz jonli reytingda ko'rinadi.",
    upcoming: "Boshlanmagan",
    running: "Davom etmoqda",
    ended: "Tugagan",
    participants: "ishtirokchi",
    problems: "Masalalar",
    standings: "Reyting",
    rules: "Qoidalar",
    join: "Ishtirok etish",
    registered: "Ro'yxatdasiz",
    solvedCol: "Yechdi",
    pointsCol: "Ball",
    penaltyCol: "Jarima",
    practiceMode: "Mashq rejimi — reytingga kirmaydi",
  },

  footer: {
    tagline: "Dasturlashni o'zbek tilida, amaliyot orqali o'rganing.",
    sections: "Bo'limlar",
    resources: "Resurslar",
    rights: "Barcha huquqlar himoyalangan",
  },

  errors: {
    notFoundTitle: "Sahifa topilmadi",
    notFoundText: "Siz qidirgan sahifa mavjud emas yoki ko'chirilgan.",
    serverTitle: "Serverda xatolik",
    serverText: "Kutilmagan xatolik yuz berdi. Birozdan keyin qayta urinib ko'ring.",
    goHome: "Bosh sahifaga",
  },
} as const;

/**
 * Literal turlarni `string` ga kengaytiradi, lekin kalit tuzilishini
 * saqlaydi. `typeof uz` ni to'g'ridan-to'g'ri ishlatsak, ruscha lug'at
 * "Kurslar" literaliga tenglashtirilishi kerak bo'lib qolardi.
 */
type Widen<T> = T extends string ? string
  : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof uz>;
