# Migratsiyalarni ishga tushirish

Yangi modullar uchun 8 ta migratsiya tayyor, lekin **hali bazaga qo'llanmagan**.
Ularni Supabase SQL Editor'da **shu tartibda** ishga tushiring — keyingisi
oldingisiga tayanadi.

| № | Fayl | Nima qo'shadi |
|---|------|---------------|
| 16 | `16_library.sql` | `books`, `glossary_terms`, `teaching_methods` jadvallari + 2 ta storage bucket |
| 17 | `17_library_seed.sql` | 48 ta termin va 10 ta dars metodi (tayyor kontent) |
| 18 | `18_teacher_applications.sql` | O'qituvchi arizalari + tasdiqlash funksiyalari |
| 19 | `19_lesson_games.sql` | `lesson_games`, `game_results` + coin/XP funksiyasi |
| 20 | `20_crossword.sql` | O'yin turlariga `crossword` qo'shadi |
| 21 | `21_portfolio.sql` | Portfolio maydonlari, `portfolio_projects` |
| 22 | `22_contests.sql` | Olimpiada: `contests`, masalalar, ishtirokchilar, reyting |
| 23 | `23_portfolio_progress.sql` | Portfolioga progress qo'shadi (21 dan keyin) |
| 24 | `24_classroom_and_live.sql` | Guruh kodlari, o'yinlar barcha o'qituvchilarga, jonli sessiya (Kahoot) |

## Har biridan keyin nima tekshirish kerak

**16 + 17** — Admin panelda *Kitoblar*, *Terminlar*, *Metodlar* bo'limlari ochiladi.
`/explore/glossary` da 48 ta termin ko'rinishi kerak, `/explore/methods` da 10 ta metod.
Kitob yuklab ko'ring: 50 MB gacha PDF, undan kattasi uchun tashqi havola maydoni bor.

**18** — `/register` da uchinchi rol paydo bo'ladi. O'qituvchi sifatida ro'yxatdan o'ting,
`/teacher-apply` da ariza to'ldiring, keyin admin sifatida `/a-teachers` da tasdiqlang.
Tasdiqlangach `/t-dashboard` ochilishi kerak (rol o'zgargani uchun qayta kirish talab qilinishi mumkin).

**19 + 20** — `/a-games` da to'rt turdagi o'yin yarating. Krossvordda so'zlarni
kiritib **"To'rni yaratish"** tugmasini bosishni unutmang — usiz saqlanmaydi.
Nashr qilgach `/play/<slug>` da o'ynab ko'ring.

**21 + 23** — `/portfolio` da foydalanuvchi nomi kiriting va portfolioni **oching**
(sukut bo'yicha yopiq). Keyin `/u/<username>` havolasini boshqa brauzerda yoki
inkognito rejimida oching — login talab qilinmasligi kerak.

**22** — `/a-contests` da olimpiada yarating, mavjud topshiriqlardan masala tanlang.
Boshlanish vaqti kelgach masalalar ochiladi. Reyting `submissions` jadvalidan
hisoblanadi, ya'ni ishtirokchi oddiy `/challenges/<slug>` sahifasida yechadi.

**24** — O'qituvchi `/t-groups` da guruh yaratadi, kod chiqadi. O'quvchi `/join`
sahifasida kodni kiritib qo'shiladi. Jonli o'yin uchun: `/t-lesson-games` da
tezlik viktorinasi yonidagi **"Jonli"** tugmasini bosing → PIN chiqadi →
o'quvchilar telefonidan `/live` ga kirib PIN kiritadi → "Boshlash".

> Jonli o'yin uchun Supabase'da **Realtime** yoqilgan bo'lishi kerak
> (Database → Replication). Yoqilmasa ham ishlaydi, lekin ekran har 4
> soniyada yangilanadi — bir oz kechikish bilan.

## Muhim eslatmalar

- Migratsiyalar qayta ishga tushirilsa ham xavfsiz: `IF NOT EXISTS`,
  `ON CONFLICT DO NOTHING` va `DROP POLICY IF EXISTS` ishlatilgan.
- `17_library_seed.sql` dublikat yaratmaydi — slug bo'yicha tekshiradi.
- Storage bucket'lar (`books`, `book-covers`) 16-migratsiyada yaratiladi.
  Supabase loyihasida Storage yoqilganiga ishonch hosil qiling.
- Migratsiya qo'llanmaguncha tegishli sahifalar bo'sh holatni ko'rsatadi —
  bu xato emas, kutilgan xatti-harakat.
