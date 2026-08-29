# EduCode — Raqamli intellektual ta'lim platformasi

Dasturlashni interaktiv kurslar, brauzerda ishlaydigan kod muhiti, AI-mentor va
gamifikatsiya orqali o'rgatuvchi veb-platforma. O'zbek, qoraqalpoq, rus va ingliz
tillarida ishlaydi.

Platforma pedagogika fanlari bo'yicha dissertatsiya tadqiqoti doirasida ishlab
chiqilgan: uning markazida **kognitiv avtonomiya** g'oyasi turadi — sun'iy intellekt
o'quvchi o'rniga masalani yechib bermaydi, balki uning mustaqil fikrlashini
o'lchaydi va qo'llab-quvvatlaydi.

**Demo:** [malla.uz](https://malla.uz)

---

## Loyiha ko'lami

| | |
|---|---|
| Kod hajmi | ~59 500 qator TypeScript/TSX |
| Sahifalar | 98 ta route |
| API endpointlar | 25 ta |
| React komponentlar | 72 ta |
| Ma'lumotlar bazasi migratsiyalari | 64 ta SQL fayl |
| Foydalanuvchi rollari | 4 ta (o'quvchi, o'qituvchi, ota-ona, admin) |
| Interfeys tillari | 4 ta (uz, kaa, ru, en) |

---

## Nima uchun bu loyiha

O'zbekistonda dasturlashni o'rganmoqchi bo'lgan maktab o'quvchisi uchta muammoga
duch keladi: kontent asosan rus yoki ingliz tilida; mashq qilish uchun kompyuterga
dastur o'rnatish kerak; va sun'iy intellekt davrida tayyor javob olish shu qadar
oson bo'ldiki, mustaqil fikrlash ko'nikmasi shakllanmay qolmoqda.

EduCode uchalasiga ham javob beradi:

- **Ona tilida ta'lim** — kurslar, topshiriqlar va interfeys o'zbek va qoraqalpoq
  tillarida.
- **Hech narsa o'rnatmasdan** — Python brauzerning o'zida (Pyodide) ishlaydi,
  murakkab masalalar Judge0 orqali serverda bajariladi.
- **AI o'rniga emas, AI bilan** — har bir o'quvchi uchun *AI bog'liqlik indeksi*
  hisoblanadi. O'quvchi mustaqil ishlaganda indeks pasayadi, tayyor javobni
  ko'chirganda ko'tariladi. Ota-ona bu ko'rsatkichni o'z panelida kuzatadi.

---

## Asosiy imkoniyatlar

### O'quvchi uchun
- **Interaktiv kurslar** — matn, video (himoyalangan hosting), taqdimot, test va
  amaliy topshiriq bitta dars oqimida.
- **Kod muhiti** — Monaco Editor, Python/JavaScript, avtomatik test tekshiruvi.
- **Olimpiada** — vaqt cheklovli musobaqalar, ball formulasi va jonli reyting.
- **Gamifikatsiya** — XP, daraja, streak, yutuqlar, coin iqtisodi va do'kon.
- **Dars o'yinlari** — mavzuni mustahkamlash uchun 2D/3D mini-o'yinlar.
- **Portfolio** — `/u/[username]` ochiq sahifasida yechilgan masalalar va
  sertifikatlar.
- **Sertifikat** — PDF generatsiya va `/sertifikat/[raqam]` orqali ochiq tekshiruv.

### AI mentor "Ustoz" (mustaqil pullik modul)
- Darajani aniqlovchi test va shaxsiy o'quv rejasi.
- Savolga tayyor javob bermaydigan, yo'naltiruvchi suhbat rejimi.
- Ovozli tushuntirish.
- Kunlik murojaat limiti va xarajat monitoringi (admin panelida).

### Ota-ona uchun
- Farzandni ulanish kodi yoki email orqali bog'lash (farzand tasdiqlaydi).
- Kurs progressi, testlar, topshiriqlar va refleksiya kundaligi statistikasi.
- **Kognitiv salomatlik paneli** — AI bog'liqlik indeksi va kunlik AI murojaatlari.
- Coin sotib olish (Payme/Click yoki karta o'tkazmasi) va farzandga sovg'a qilish.

### O'qituvchi uchun
- Guruhlar, topshiriq berish va muddat nazorati.
- Talabalar monitoringi va analitika.
- **Jonli dars** (`/t-live`) — realtime sessiya.
- Natijalarni eksport qilish.

### Admin uchun
- Kurslar, mavzular, testlar, topshiriqlar, olimpiadalar CRUD.
- Kontent tarjimalari boshqaruvi (4 til).
- To'lovlar va coin xarid so'rovlarini tasdiqlash.
- **Akademik halollik** (`/a-integrity`) — nusxa ko'chirish signallari.
- AI xarajatlari monitoringi, blog, sertifikatlar, do'kon, foydalanuvchilar.

---

## Arxitektura

```
Brauzer (Next.js 14 App Router, RSC + client komponentlar)
   │
   ├── Middleware ──── til prefiksi (/ru, /en, /kaa) + sessiya + rol marshrutlash
   │
   ├── Server Actions / API Routes
   │       ├── /api/agent/*      AI mentor (Claude)
   │       ├── /api/ai/*         kod feedback, reja tekshiruvi
   │       ├── /api/execute      kod bajarish (Judge0)
   │       ├── /api/payments/*   Payme, Click
   │       └── /api/video/token  Bunny Stream imzolangan havola
   │
   └── Supabase
           ├── PostgreSQL — 64 migratsiya, Row Level Security
           ├── Auth       — email + Google OAuth
           ├── Storage    — avatar, sertifikat, taqdimot
           └── Realtime   — jonly dars, reyting
```

**Xavfsizlik asosi — RLS.** Har bir jadval Row Level Security bilan yopilgan;
middleware faqat marshrutlash uchun. Coin o'tkazmasi, olimpiada balli va rol
o'zgarishi kabi kritik amallar `SECURITY DEFINER` funksiyalar (RPC) ichida,
atomar tarzda bajariladi — mijoz tomonidan to'g'ridan-to'g'ri yozish yo'q.

---

## Texnologiyalar

| Qatlam | Texnologiya |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| UI | Tailwind CSS, shadcn/ui (Radix), Framer Motion |
| Kod editor | Monaco Editor |
| Kod bajarish | Pyodide (brauzerda), Judge0 (serverda) |
| 3D o'yinlar | React Three Fiber, drei |
| Backend | Supabase — PostgreSQL, Auth, Storage, Realtime |
| AI | Claude API (Anthropic), Gemini API |
| Video | Bunny Stream (token autentifikatsiyasi) |
| To'lov | Payme, Click |
| Matn muharriri | TipTap |
| Holat boshqaruvi | Zustand, TanStack Query |
| PDF | @react-pdf/renderer, jsPDF |

---

## Ishga tushirish

### Talablar
- Node.js 18+
- Supabase loyihasi (bepul tarif yetarli)

### 1. Klonlash va o'rnatish

```bash
git clone https://github.com/Urozboev/educode.git
cd educode
npm install
```

### 2. Muhit o'zgaruvchilari

```bash
cp .env.example .env.local
```

`.env.local` ni oching va qiymatlarni to'ldiring. Minimal ishga tushirish uchun
Supabase uchta o'zgaruvchisi yetarli — qolganlari mos modullarni yoqadi
(AI mentor, video, to'lov, Judge0).

### 3. Ma'lumotlar bazasi

`supabase/migrations/` papkasidagi SQL fayllarni **raqam tartibida** Supabase
SQL Editor'da ishga tushiring. Batafsil izoh: [MIGRATSIYALAR.md](MIGRATSIYALAR.md).

So'ng Supabase panelida:
- **Authentication > Providers** — Email yoqilgan, "Confirm email" yoqilgan;
  ixtiyoriy ravishda Google OAuth.
- **Storage** — bucket'lar: `course-thumbnails` (public), `topic-videos` (private),
  `topic-presentations` (private), `certificates` (private), `avatars` (public).

### 4. Ishga tushirish

```bash
npm run dev
```

`http://localhost:3000` ni oching.

### 5. Admin hisobi

`/register` orqali ro'yxatdan o'ting, so'ng Supabase > Table Editor > `profiles`
jadvalida o'z yozuvingizning `role` ustunini `admin` ga o'zgartiring.

---

## Loyiha tuzilishi

```
src/
├── app/
│   ├── (auth)/        kirish, ro'yxatdan o'tish, parolni tiklash
│   ├── (student)/     o'quvchi kabineti — kurslar, olimpiada, o'yinlar, do'kon
│   ├── (teacher)/     o'qituvchi paneli — guruhlar, topshiriqlar, jonli dars
│   ├── (parent)/      ota-ona paneli — farzand monitoringi, coin
│   ├── (admin)/       admin paneli — 23 ta boshqaruv sahifasi
│   ├── explore/       login talab qilmaydigan ommaviy sahifalar (SEO)
│   ├── u/[username]/  ochiq portfolio
│   ├── sertifikat/    sertifikat tekshiruvi
│   └── api/           25 ta API endpoint
├── components/        72 ta React komponent
├── lib/
│   ├── supabase/      server/client/middleware clientlari
│   ├── i18n/          4 tilli lug'atlar va yordamchi funksiyalar
│   └── utils.ts
├── hooks/
├── store/             Zustand
└── types/

supabase/migrations/   64 ta SQL migratsiya — sxema, RLS, RPC, kontent
```

---

## Hujjatlar

| Fayl | Mazmuni |
|---|---|
| [MIGRATSIYALAR.md](MIGRATSIYALAR.md) | Migratsiyalarni qo'llash tartibi |
| [FOYDALANISH-YURIQNOMASI.md](FOYDALANISH-YURIQNOMASI.md) | Foydalanuvchi qo'llanmasi |
| [VIDEO-HOSTING.md](VIDEO-HOSTING.md) | Himoyalangan video sozlash |

---

## Litsenziya

Loyiha dissertatsiya tadqiqoti doirasida yaratilgan. Barcha huquqlar mualliflik
huquqi bilan himoyalangan.

**Muallif:** Mirjalol O'rozboyev
