# EduCode Platform — Raqamli Intellektual Ta'lim Platformasi

Dasturlash tillarini interaktiv kurslar, AI yordamchi va gamifikatsiya orqali o'rgatuvchi platforma.

## Texnologiyalar

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui + Framer Motion
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Kod editor:** Monaco Editor + Pyodide (Python brauzerda)
- **AI:** Claude API (Anthropic)
- **Kod bajarish:** Brauzerda (Pyodide/iframe) + Judge0 (ixtiyoriy)

## O'rnatish

### 1. Repozitoriyani klonlash

```bash
git clone <repo-url>
cd educode
```

### 2. Dependencylarni o'rnatish

```bash
npm install
```

### 3. Environment o'zgaruvchilarini sozlash

`.env.local` fayli allaqachon yaratilgan. Quyidagi qiymatlarni tekshiring:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLAUDE_API_KEY=your_claude_api_key
NEXT_PUBLIC_APP_URL=https://malla.uz
```

### 4. Supabase ma'lumotlar bazasini sozlash

1. [Supabase Dashboard](https://supabase.com/dashboard) ga kiring
2. Loyihangizni oching
3. **SQL Editor** ga o'ting
4. `supabase/migrations/001_full_schema.sql` faylining barcha mazmunini nusxalab, SQL Editor da ishga tushiring
5. **Authentication > Providers** da:
   - Email provider yoqilganligini tekshiring
   - "Confirm email" yoqing
   - Google OAuth qo'shing (Google Cloud Console dan Client ID/Secret oling)
6. **Storage** da quyidagi bucket'larni yarating:
   - `course-thumbnails` (Public)
   - `topic-videos` (Private)
   - `topic-presentations` (Private)
   - `certificates` (Private)
   - `avatars` (Public)

### 5. Ishga tushirish

```bash
npm run dev
```

Brauzerda `http://localhost:3000` ni oching.

### 6. Admin foydalanuvchi yaratish

1. `/register` sahifasida ro'yxatdan o'ting
2. Supabase Dashboard > Table Editor > profiles jadvalida
3. O'z foydalanuvchingizning `role` ustunini `admin` ga o'zgartiring

## Loyiha tuzilishi

```
src/
├── app/                    # Next.js sahifalar
│   ├── (auth)/            # Auth sahifalari
│   ├── (student)/         # Talaba paneli
│   ├── (teacher)/         # O'qituvchi paneli
│   ├── (admin)/           # Admin paneli
│   └── api/               # API Routes
├── components/            # React komponentlar
│   ├── ui/                # shadcn/ui
│   ├── layout/            # Navbar, Sidebar
│   ├── editor/            # Code Editor
│   ├── quiz/              # Test komponentlari
│   └── gamification/      # Coin, XP, Achievement
├── lib/                   # Utility kutubxonalar
│   ├── supabase/          # Supabase clientlar
│   ├── claude/            # Claude API
│   └── utils.ts           # Yordamchi funksiyalar
├── hooks/                 # Custom React hooks
├── store/                 # Zustand stores
└── types/                 # TypeScript types
```

## Asosiy xususiyatlar

- ✅ 3 ta rol: Student, Teacher, Admin
- ✅ Kurslar tizimi (CRUD, tekin/pullik)
- ✅ Brauzerda kod yozish va ishga tushirish (Python, JavaScript)
- ✅ Avtomatik test tekshirish
- ✅ AI feedback (Claude API)
- ✅ Coin tizimi + Gamifikatsiya
- ✅ Sertifikat generatsiya
- ✅ Reyting jadvali
- ✅ Dark/Light mode
- ✅ Responsive dizayn
- ✅ Google OAuth + Email auth

## Keyingi qadamlar (qo'lda qo'shish kerak)

Quyidagi sahifalar va komponentlarning skeleti yaratilgan, lekin to'liq kodni yozish kerak:

1. **Mavzu sahifasi** (`/courses/[slug]/topics/[topicSlug]`) — matn, video, taqdimot
2. **Test sahifasi** (`/courses/[slug]/topics/[topicSlug]/quiz`)
3. **Amaliy topshiriq** (`/courses/[slug]/topics/[topicSlug]/task`) — CodeEditor bilan
4. **Challenges sahifasi** (`/challenges`) — ro'yxat + filtrlash
5. **Challenge detail** (`/challenges/[slug]`) — CodeEditor bilan
6. **Natijalarim** (`/my-results`) — statistikalar
7. **Sertifikatlar** (`/my-results/certificates`)
8. **Admin panel** — kurslar/topshiriqlar CRUD
9. **O'qituvchi panel** — talabalar monitoring
10. **O'yinlar** — Code Battle, Bug Fix, Code Puzzle

## Litsenziya

Bu loyiha dissertatsiya tadqiqoti doirasida yaratilgan.
