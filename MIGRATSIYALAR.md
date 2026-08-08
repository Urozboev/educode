# Migratsiyalarni ishga tushirish

16-23 migratsiyalar bazaga qo'llangan. **24-34 hali qo'llanmagan.**
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
| 25 | `25_certificate_public.sql` | Sertifikatni raqami/QR orqali ommaviy tekshirish |
| 26 | `26_teacher_visibility.sql` | O'qituvchi o'z o'quvchilarining o'yin natijalarini ko'rsin |
| 27 | `27_maruza_mavzular_1_6.sql` | Ma'ruza kursi: fan dasturi 1-6 mavzulari (nazariy kontent) |
| 28 | `28_maruza_testlar_1_6.sql` | 1-6 mavzular uchun 48 test + 13 kod topshirig'i |
| 29 | `29_maruza_mavzular_7_12.sql` | Ma'ruza kursi: fan dasturi 7-12 mavzulari |
| 30 | `30_maruza_testlar_7_12.sql` | 7-12 mavzular uchun 48 test + 16 kod topshirig'i |
| 31 | `31_amaliyot_mashgulotlar.sql` | Amaliyot kursi: 6 mashg'ulot + 30 test + 18 topshiriq |
| 32 | `32_laboratoriya_ishlar.sql` | Laboratoriya kursi: 6 lab ishi + 24 test + 18 topshiriq |
| 33 | `33_dars_oyinlari_kontent.sql` | 12 ta tayyor dars o'yini (4 viktorina, 4 juftlik, 2 jeopardy, 2 krossvord) |
| 34 | `34_olimpiada_masalalar.sql` | 15 ta olimpiada masalasi + 3 bosqichli musobaqa |
| 35 | `35_dokon_va_oqituvchi_sovgalari.sql` | Do'kon jadvallari, o'qituvchi sovg'alari, buyurtma RPC'lari |
| 36 | `36_coin_balansi.sql` | Coin qiymatlari qayta belgilanadi + do'kon narxlari |
| 37 | `37_qaydlar_va_qidiruv.sql` | Mavzu bo'yicha shaxsiy qaydlar + kurs ichida qidiruv |
| 38 | `38_olimpiada_ball_va_reyting.sql` | Olimpiada ball tizimi, reyting tuzatildi, mashq rejimi |
| 39 | `39_topshiriqlar_30ta.sql` | 30 ta mustaqil topshiriq (14 oson / 11 o'rta / 5 qiyin) |

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

**25** — Sertifikat sahifasida QR kod paydo bo'ladi. Telefon kamerasi bilan
skanerlasangiz `/sertifikat/<raqam>` ochiladi — u yerda sertifikat haqiqiyligi
login'siz tasdiqlanadi. Raqamni qo'lda kiritib ham tekshirsa bo'ladi.

**27-32 (fan dasturi kontenti)** — Guliston DPI ning `DAS1208` "Dasturlash asoslari"
fan dasturi asosida tayyorlangan. Uch kursga taqsimlangan:
ma'ruza (12 mavzu), amaliyot (6 mashg'ulot), laboratoriya (6 ish).
Tartib muhim: 27 → 28 → 29 → 30, chunki testlar mavzular yaratilgandan keyin qo'shiladi.

Qo'llagandan keyin `/courses/dasturlash-asoslari-maruza` da 14 ta mavzu
(2 ta kirish + 12 ta fan dasturi mavzusi) ko'rinishi kerak. Har mavzuda
8 ta test va 2-3 ta kod topshirig'i bor.

> **Topshiriqlar stdin → stdout tartibida ishlaydi**: dastur `input()` bilan
> o'qiydi, `print()` bilan chiqaradi. Barcha 65 ta topshiriq yechimi CPython 3
> da 209 ta test bo'yicha sinovdan o'tkazilgan.

**33** — `/explore/lesson-games` da 12 ta o'yin paydo bo'ladi va ular barcha
o'qituvchilarga ko'rinadi (`author_id` NULL — tizim kontenti). Viktorinalarni
jonli rejimda ham ochish mumkin. Krossvord to'ri oldindan hisoblangan, shuning
uchun admin panelda qayta yaratish shart emas.

**34** — Uch bosqichli olimpiada: 1-bosqich (15-sentabr), 2-bosqich (20-oktabr),
yakuniy (15-dekabr). Sanalar **namuna** — `/a-contests` da o'zingizga moslang.
Masalalar musobaqa boshlanmaguncha yopiq turadi, lekin ular `/explore/challenges`
da mustaqil mashq sifatida ham ochiq.

**35** — `store_items` va `store_orders` ilgari faqat Supabase panelida qo'lda
yaratilgan edi, migratsiyada yo'q edi. Endi ular rasmiylashtirildi va kengaytirildi.

O'qituvchi `/t-store` da sovg'a qo'shadi — u avtomatik `my_students` auditoriyasi
bilan yoziladi, ya'ni faqat uning guruhlariga qo'shilgan o'quvchilar ko'radi
(RLS `teacher_students` orqali tekshiradi). Admin `/a-store` da platforma
sovg'asini qo'shadi, u hammaga ko'rinadi.

Buyurtma berish va holat o'zgartirish **faqat RPC orqali** ishlaydi
(`place_store_order`, `update_store_order`, `cancel_my_store_order`) —
`store_orders` ga to'g'ridan-to'g'ri yozish RLS bilan yopilgan. Sabab: coin
yechish, zaxira kamaytirish va buyurtma yozuvi bitta tranzaksiyada bo'lishi
kerak. Rad etilganda yoki bekor qilinganda coin **avtomatik qaytariladi**.

Shaxsiy ma'lumot (ism, telefon, manzil) faqat uch tomonga ko'rinadi:
buyurtmachi, sovg'a egasi va admin. Boshqa o'qituvchi ko'ra olmaydi.

**36** — Coin iqtisodi qayta balanslandi. Eng muhimi: `QuizBattle3D` har o'yinda
15 coingacha berardi va **hech qanday cheklov yo'q edi** — o'yinni qayta-qayta
o'ynab bir semestrlik coinni bir necha daqiqada yig'ish mumkin edi. Endi mukofot
`award_quiz_battle` RPC'sida hisoblanadi va kuniga bir marta beriladi.

> Bu migratsiya mavjud `coin_reward` qiymatlarining **hammasini** qayta yozadi.
> Agar biror mavzu yoki topshiriqqa qo'lda maxsus qiymat qo'ygan bo'lsangiz,
> u ham almashadi. Mavjud foydalanuvchilar balansi tegilmaydi.

**37** — Mavzu sahifasining pastida "Mening qaydlarim" paneli chiqadi. Qayd
avtomatik saqlanadi (yozish to'xtagach 1.2 soniyada) va uni **faqat egasi**
ko'radi — o'qituvchi ham, admin ham emas. Kurs sahifasida esa "Qaydlarim"
bloki barcha qaydlarni bir ro'yxatda beradi (qayd bo'lmasa ko'rinmaydi).

Qidiruv 6 va undan ko'p darsli kurslarda paydo bo'ladi. U `topics_toc`
ko'rinishidan emas, `search_course_topics` RPC'sidan foydalanadi — sabab:
`topics_toc` RLS'ni chetlab o'tadi, shuning uchun unda `content_html` YO'Q.
RPC avval ruxsatni tekshiradi: kontent bo'yicha qidiruv faqat bepul kurs
yoki yozilgan foydalanuvchi uchun, sarlavhalar esa hammaga ochiq.

> Migratsiya qo'llanmaguncha qidiruv "hech nima topilmadi" deb turadi va
> qaydlar paneli bo'sh ko'rinadi — bu xato emas, RPC va jadval hali yo'q.

**38** — Olimpiadadagi to'rtta muammo tuzatildi.

Reyting **bo'sh ko'rinardi**, chunki `contest_standings` ishtirokchilarni faqat
`contest_participants` jadvalidan olardi: masalani yechgan, lekin "Ro'yxatdan
o'tish" bosmagan odam umuman hisobga kirmasdi. Endi ro'yxatdan o'tganlar
**va** musobaqa vaqtida yechim yuborganlar birga olinadi, masalani ochgan
odam esa avtomatik ro'yxatga tushadi (`join_contest`).

Masalaga bosilganda endi `/explore/contests/<slug>/<harf>` ochiladi —
yuqorida taymer, A–E harflari va reytingga havola turadi. Ilgari
`/challenges/<slug>` ga o'tib ketardi va olimpiadaga qaytish yo'li qolmasdi.

Ball: `contest_problems.points` (oson 100 / o'rta 200 / qiyin 300), yechish
vaqti va noto'g'ri urinishlar uchun kamayadi. Tartib — yechilgan masalalar
soni → ball → jarima vaqti.

Masalalar musobaqa **tugagandan keyin** mashq uchun ochiladi; bunday yechimlar
reytingga kirmaydi (`phase = 'practice'`).

Kabinetdagi o'quvchi uchun olimpiada `/contests` da ochiladi (yon menyuda
"Olimpiada"), mehmon uchun `/explore/contests` da. Ikkalasi bir xil
komponentlardan foydalanadi, farqi faqat `basePath` propida.

> **38 ni QAYTA ishga tushiring.** `my_status` da xato bor edi: agregat
> so'rov mos qator topilmasa ham bitta qator qaytaradi, shuning uchun barcha
> masalalar "urinilgan" bo'lib ko'rinardi — hatto tizimga kirmagan mehmonga
> ham. Fayl to'liq idempotent, qayta ishga tushirish xavfsiz.

> Alohida "Ishtirokchilar" tabi qo'shilmadi: reyting jadvalining o'zi
> ishtirokchilar ro'yxati — masala yechmaganlar 0 bilan pastda turadi.

**39** — "Topshiriqlar" bo'limiga 30 ta mustaqil mashq masalasi. Ular
olimpiadaga bog'lanmagan, istalgan vaqtda yechiladi.

Taqsimot ataylab osonga og'ishtirilgan — boshlovchi birinchi kunidan
yecha oladigan masalalar bo'lishi kerak:

| Daraja | Soni | Mukofot | Namuna |
|---|---|---|---|
| Oson | 14 | 10 coin / 30 XP | "Salom, dunyo!", sonning kvadrati, oxirgi raqam |
| O'rta | 11 | 18 / 55 | Tub son, palindrom, Fibonachchi, saralash |
| Qiyin | 5 | 30 / 90 | Qavslar balansi, ikkilik qidiruv, chastota saralash |

Barcha 30 ta yechim CPython 3 da 112 test bo'yicha sinovdan o'tkazilgan,
so'ng SQL faylidan qayta o'qib yana bir marta tekshirilgan.

Yangi `basics` ("Asoslar") turkumi qo'shildi — filtrlar va turkum nomlari
`lib/utils.ts` hamda ikkala topshiriqlar sahifasida yangilandi.

## Muhim eslatmalar

- Migratsiyalar qayta ishga tushirilsa ham xavfsiz: `IF NOT EXISTS`,
  `ON CONFLICT DO NOTHING` va `DROP POLICY IF EXISTS` ishlatilgan.
- `17_library_seed.sql` dublikat yaratmaydi — slug bo'yicha tekshiradi.
- Storage bucket'lar (`books`, `book-covers`) 16-migratsiyada yaratiladi.
  Supabase loyihasida Storage yoqilganiga ishonch hosil qiling.
- Migratsiya qo'llanmaguncha tegishli sahifalar bo'sh holatni ko'rsatadi —
  bu xato emas, kutilgan xatti-harakat.
