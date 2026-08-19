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
| 40 | `40_paste_belgisi.sql` | Yechimda nusxa ko'chirish belgisi + admin hisoboti |
| 41 | `41_kurs_izohlari.sql` | Kurs baholari va izohlari (yulduzcha + matn) |
| 42 | `42_kontent_tarjimalari.sql` | Baza kontenti uchun tarjima jadvallari + admin paneli |
| 43 | `43_ai_agent.sql` | AI agent ("Ustoz"): obuna, suhbat, xotira, reja, dars keshi, ovoz keshi |
| 44 | `44_ota_ona_link_boshqaruvi.sql` | Ota-ona havolasi boshqaruvi va o'quvchi monitoringi |
| 45 | `45_tarjimalar_kutubxona.sql` | Kutubxona: 48 termin va 10 ta dars metodi tarjimalari (ru, en, kaa) |
| 46 | `46_tarjimalar_kurslar_va_mavzular.sql` | Kurslar va 24 ta mavzu nomlari tarjimalari (ru, en, kaa) |
| 47 | `47_tarjimalar_testlar.sql` | Test savollari, variantlari va tushuntirishlari (ru, en, kaa) |
| 48 | `48_tarjimalar_topshiriqlar.sql` | Mavzu topshiriqlari va maslahatlari tarjimalari (ru, en, kaa) |
| 49 | `49_tarjimalar_masalalar_va_olimpiada.sql` | Musobaqalar va 45 ta masala shartlari tarjimalari (ru, en, kaa) |
| 50 | `50_tarjimalar_oyinlar.sql` | 12 ta dars o'yini kontenti tarjimalari (ru, en, kaa) |
| 51-56 | `51_`...`56_tarjimalar_dars_matnlari_*.sql` | 1-12 ma'ruza mavzularining to'liq HTML dars matnlari (ru, en, kaa) |
| 57-58 | `57_`...`58_tarjimalar_amaliyot_*.sql` | 1-6 amaliy mashg'ulotlarning to'liq HTML dars matnlari (ru, en, kaa) |
| 59-60 | `59_`...`60_tarjimalar_laboratoriya_*.sql` | 1-6 laboratoriya ishlarining to'liq HTML dars matnlari (ru, en, kaa) |
| 61 | `61_tarjimalar_barcha_masalalar.sql` | 51 ta amaliy va olimpiada masalasi to'liq shartlari (ru, en, kaa) |
| 62 | `62_tarjimalar_dars_oyinlari_kontenti.sql` | 12 ta o'yin to'liq kontenti: savollar, juftliklar, krossvord, taxta (ru, en, kaa) |
| 63 | `63_tarjimalar_topshiriqlar_toliq.sql` | Mavzulardagi amaliy topshiriqlar nomlari va shartlari (ru, en, kaa) |
| 64 | `64_tarjimalar_testlar_toliq.sql` | Mavzulardagi test savollari, JSONB variantlari va tushuntirishlari (ru, en, kaa) |

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

**40** — Talaba kod muharririga nusxa qo'ysa, bu **yuborishning o'ziga**
yoziladi: `paste_count`, `pasted_chars`, `paste_ratio`.

Paste aniqlash ilgari ham qisman bor edi, lekin belgi faqat `code_snapshots`
ga tushardi va chegara **40 belgi** edi — ya'ni oson masalalarning bir
qatorlik yechimi (`print(n * n)` — 14 belgi) umuman qayd etilmasdi. Endi
har qanday paste sanaladi.

Admin `/a-integrity` ("Halollik nazorati") sahifasida ro'yxatni ko'radi:
kim, qaysi masala, necha foizi ko'chirilgan, olimpiadaga tegishlimi.
Yechim matnini o'sha yerda ochib ko'rish mumkin. O'qituvchi esa o'z
talabasining sahifasida belgini ko'radi.

> Ko'rsatkich **ayblov emas** — talaba o'z kodini boshqa muharrirdan
> ko'chirgan bo'lishi mumkin. Shuning uchun belgi faqat yechim egasiga,
> o'qituvchiga va adminga ko'rinadi; ochiq reytingda ko'rsatilmaydi.

**41** — Kurs sahifasining pastida baholar va izohlar bo'limi. 1-5 yulduzcha,
izoh ixtiyoriy. Baho qoldirish faqat **kursga yozilganlarga** ochiq —
`upsert_course_review` ichida tekshiriladi. Bir foydalanuvchi bitta izoh
yozadi va uni tahrirlaydi (`UNIQUE(course_id, user_id)`), aks holda bitta
odam reytingni ko'tarib yuborishi mumkin edi.

`courses.average_rating` ustuni ilgari ham bor edi, lekin hech qachon
to'ldirilmagan. Endi trigger uni har o'zgarishda qayta hisoblaydi.

> Admin nomaqbul izohni **yashiradi**, o'chirmaydi (`is_hidden`): baho
> reytingda qoladi, faqat matn ko'rinmaydi. Shunda o'chirish orqali
> reytingni tozalab yuborish imkoni bo'lmaydi.

**42** — Baza kontentini (mavzular, testlar, topshiriqlar, terminlar,
kitoblar, metodlar, o'yinlar, olimpiadalar) boshqa tillarga o'girish uchun.

Har jadvalga alohida `*_i18n` yaratish o'nta yangi jadval va o'nta RLS
to'plami degani edi. Buning o'rniga **bitta umumiy jadval**:
`content_translations(resource, row_id, locale, field, value | value_json)`.
Yangi jadvalni tarjimaga ochish uchun `translatable_fields` reyestriga
bir necha qator qo'shiladi — migratsiya kerak emas.

Reyestr shunchaki ma'lumotnoma emas: `save_translation` undan tashqari
hech nimani yozdirmaydi va admin interfeysi qaysi tahrirlagichni
ko'rsatishni (matn / HTML / JSON) shundan biladi.

Admin `/a-translations` sahifasida ishlaydi: chapda o'zbekcha asl matn,
o'ngda tarjima — yonma-yon. Har bo'lim uchun tarjima foizi ko'rinadi.

> Tarjima yo'q maydon **o'zbekcha qoladi** — yarim tarjima qilingan kurs
> ham ishlashda davom etadi, bo'sh matn chiqmaydi.

`withTranslations()` **17 ta sahifa/komponentga** ulangan: kurslar ro'yxati
(kabinet + explore), kurs sahifasi (kurs + mundarija), mavzu, test, amaliy
topshiriq, topshiriqlar ro'yxati va masala sahifasi, terminlar, kitoblar,
metodlar, dars o'yinlari (ro'yxat + ijrochi), olimpiadalar (ro'yxat,
sahifa, masala). Til almashganda kontent avtomatik qayta yuklanadi.

Ichki havolalar tilni saqlaydi: `next/link` o'rniga
`@/components/i18n/Link` ishlatiladi (58 ta faylda), server
komponentlarda esa `serverHref()`. Yangi sahifa yozganda shu wrapperni
import qiling — aks holda havola til prefiksini yo'qotadi.

Migratsiyaning oxirida `contest_overview` qayta e'lon qilinadi: unga
`challenge_id` qo'shildi. Funksiya 38-migratsiyada yaratilgan va u
allaqachon qo'llangan, shuning uchun eski fayl tahrirlanmadi — tarjima
esa qator id si bo'yicha izlanadi va idsiz masala nomini o'girib
bo'lmasdi.

**43** — AI agent ("Ustoz") uchun asos. `/agent` sahifasi ochiladi va
suhbat ishlaydi; obunasiz foydalanuvchiga 15 ta bepul xabar beriladi,
undan keyin paywall chiqadi.

Agent **mustaqil modul**: uning jadvallari `courses`/`topics`/`lessons`
ga majburiy bog'lanmaydi. Bog'lanish faqat `agent_modules.suggested_course_id`
(nullable) orqali — agent kerak bo'lsa mavjud kursga havola beradi,
lekin usiz ham to'liq ishlaydi. Shu sababli agentni o'chirib qo'yish
platformaning qolgan qismiga ta'sir qilmaydi.

Migratsiya `agent-audio` storage bucket'ini ham yaratadi — TTS natijalari
shu yerda saqlanadi.

**Kerakli `.env.local` o'zgaruvchilari:**

| O'zgaruvchi | Nima uchun |
|---|---|
| `GEMINI_API_KEY` | Agent "miyasi" (allaqachon bor) |
| `AGENT_MODEL` | Ixtiyoriy. Sukut: `gemini-flash-latest` |
| `AGENT_PLANNER_MODEL` | Ixtiyoriy. Reja va kirish testi uchun alohida model |
| `SUPABASE_SERVICE_ROLE_KEY` | Ovoz keshini yozish (allaqachon bor) |
| `AISHA_API_KEY` | **O'zbekcha ovoz.** Kalitsiz agent brauzer sintezidan foydalanadi |
| `AISHA_TTS_MODEL` / `AISHA_TTS_MOOD` | Ixtiyoriy. Sukut: `Gulnoza` / `Neutral` |
| `AGENT_TTS_PROVIDER` | Ixtiyoriy: `aisha` \| `gemini` \| `browser` — avtomatik tanlovni bekor qiladi |
| `AGENT_COST_INPUT_PER_M` | Tannarx hisobi: 1M kirish tokeni narxi (USD). Sukut: 0.3 |
| `AGENT_COST_OUTPUT_PER_M` | 1M chiqish tokeni narxi. Sukut: 2.5 |
| `AGENT_COST_TTS_PER_1K` | 1000 belgi TTS narxi. Sukut: 0.015 |
| `USD_UZS_RATE` | Daromadni USD ga o'girish kursi. Sukut: 12800 |

> **Gemini o'zbekcha GAPIRMAYDI.** Gemini TTS 84 tilni qo'llaydi, o'zbek
> tili ular ro'yxatida yo'q (Google Cloud TTS da ham `uz-UZ` yo'q).
> Shuning uchun matn Gemini'dan, o'zbekcha ovoz esa Aisha'dan olinadi.
> Rus va ingliz tillari uchun Gemini TTS ishlatiladi.

Sozlanishni tekshirish: `GET /api/agent/voice` qaysi til uchun qaysi
provayder tanlanganini qaytaradi.

**Planner** (`/agent/reja`): yo'nalish tanlash → 8 savolli kirish testi →
reja. Test **majburiy emas** — uni majburiy qilsak, odam birinchi
qadamdayoq to'xtaydi; tashlab ketganga "noldan" darajasi beriladi.

Har savolda "Bilmayman" varianti bor: 4 ta variantdan tavakkaliga
tanlagan odam 25% to'g'ri javob to'plab, o'zi uchun juda qiyin
darajaga tushib qolmasin.

Test javoblari (`correct` maydoni) mijozga **hech qachon yuborilmaydi** —
ular `agent_assessments.payload` da serverda qoladi.

Modullardagi `topic_key` (masalan `css.basics.selectors`) — dars
keshining kaliti. `normalizeTopicKey()` uni majburan bir ko'rinishga
soladi: aks holda bir mavzu ikki xil kalit olib, kesh ishlamay qolardi.

**Dars va kesh** (`/agent/dars/<moduleId>`): modul bosilganda dars
matni `agent_lessons` dan olinadi, bo'lmasa generatsiya qilinib
o'sha yerga yoziladi.

Kesh kaliti: `topic_key|level|lang|prompt_version`. Dars kontenti
foydalanuvchiga bog'liq emas — promptga ism, maqsad va xotira
**qo'shilmaydi**. Shu tufayli bitta dars matni hamma o'quvchiga
xizmat qiladi: 1000 talaba uchun keshsiz 1000 marta to'lardik.
Shaxsiylashtirish suhbatda bo'ladi, darsda emas.

`prompt_version` kalit ichida turadi: promptni yaxshilab versiyani
ko'tarsangiz, eski darslar avtomatik chetlab o'tiladi — keshni qo'lda
tozalash kerak emas.

Dars HTML'i modeldan keladi va sahifaga `dangerouslySetInnerHTML`
bilan qo'yiladi, shuning uchun `sanitizeLessonHtml()` uni oq ro'yxat
bo'yicha tozalaydi (script, iframe, `on*` atributlari, barcha
atributlar olib tashlanadi). Mavzu nomi foydalanuvchidan kelgani
uchun bu nazariy emas, real yo'l.

Keshdan kelgan dars uchun token hisobga **qo'shilmaydi** — aks holda
tannarx hisoboti haqiqatdan ancha yuqori ko'rinardi.

**Test va Tracker:** dars o'qilgach test beriladi (5 savol, keshlanadi).
Natijaga qarab agent uch yo'ldan birini tanlaydi:

| Ball | Nima bo'ladi |
|---|---|
| 70+ | Modul tugadi, keyingisi ochiladi |
| 40-69 | Modul ochiq qoladi — darsni qayta o'qib, testni qayta topshirish |
| 40 dan past | Rejaga **qo'shimcha amaliyot moduli qo'shiladi** |

Uchinchi holat — reja o'zgarmas ro'yxat emasligining amaldagi
ko'rinishi. Yangi modul `agent_insert_remedial_module()` RPC orqali
qo'shiladi: `UNIQUE (track_id, order_index)` tufayli keyingi
modullarning raqami bittalab, teskari tartibda suriladi (bitta
UPDATE bilan qilinsa, oraliq holatda cheklov buziladi).

Modul holati dars o'qilganda emas, **test natijasida** o'zgaradi —
aks holda darsni ochib yopgan o'quvchida mavzu "o'zlashtirilgan"
bo'lib qolardi.

> **Xavfsizlik:** test savollari to'g'ri javoblari bilan
> `agent_quizzes` da saqlanadi. Bu jadvalda RLS yoqilgan, lekin
> birorta ham policy yo'q — ya'ni faqat service role o'qiy oladi.
> `agent_assessments` (shaxsiy, egasiga o'qishga ochiq) da faqat
> `quiz_id` turadi. Savollarni javoblari bilan o'sha yerga
> yozganimizda, foydalanuvchi o'z qatorini Supabase klienti orqali
> o'qib, javoblarni testdan oldin ko'ra olardi. Kirish testi ham
> shu tartibda saqlanadi.

**Amaliy kod topshiriqlari:** dars sahifasidagi "Amaliy topshiriq"
tugmasi. Topshiriq keshlanadi (`agent_tasks`), yechim Judge0'da
(ishlamasa Piston) ishga tushirilib, 5 ta test bilan tekshiriladi.

Keshga faqat **o'z namunaviy yechimidan o'tgan** topshiriq yoziladi.
Model ba'zan o'zi tuzgan testga mos kelmaydigan yechim yozadi yoki
`expected_output` da ortiqcha bo'shliq qoldiradi — bunday topshiriq
keshga tushsa, o'quvchi to'g'ri kod yozsa ham "test o'tmadi" degan
javob oladi va sababini hech qachon topa olmaydi.

Kod topshirig'i **Tracker'ga tegmaydi**: natija `agent_mastery` ga
tushadi, lekin rejani o'zgartirmaydi. Modul holatini test (quiz) hal
qiladi. Ikkalasi ham rejani o'zgartirsa, bitta modul uchun ikki marta
"keyingisini och" yoki ikkita qo'shimcha modul paydo bo'lardi.

Testni qayta-qayta topshirish mumkin (testdan farqli o'laroq) —
kod yozishda urinib ko'rish jarayonning bir qismi.

> Judge0 ijrochisi `/api/playground/execute` route ichidan
> `@/lib/execute` ga ko'chirildi — endi playground ham, agent ham
> bitta ijrochidan foydalanadi. Playground'ning tashqi shartnomasi
> o'zgarmadi.

**Obuna to'lovi:** `/agent/obuna` — tarif (Pro / Pro+) va muddat
(1 / 3 / 12 oy, 10% va 20% chegirma bilan) tanlanadi, Payme yoki
Click orqali to'lanadi.

Summani **server hisoblaydi** (`subscriptionAmount()`) — mijozdan
kelgan qiymat ishlatilmaydi, aks holda 1 so'mga obuna sotib olish
mumkin bo'lardi. `/api/agent/subscribe` obunani **yoqmaydi**: u faqat
`pending` yozuv yaratib, to'lov havolasini qaytaradi. Obuna webhook
to'lovni tasdiqlagach `activate_agent_subscription()` orqali yoqiladi
— aks holda "to'lov sahifasini ochdim" degan narsa obuna berardi.

Muddati tugamagan obunani uzaytirsangiz qolgan kunlar yonmaydi: yangi
muddat eski tugash sanasidan boshlanadi.

> **Payme/Click webhook'lari o'zgardi.** Ilgari ular faqat
> `coin_purchase_requests` jadvaliga qarardi. Payme'da bitta kassaga
> bitta endpoint URL beriladi — obuna uchun alohida endpoint alohida
> kassa ochishni talab qilardi. Shuning uchun webhook endi buyurtmani
> `@/lib/payments/order` orqali ikkala jadvaldan qidiradi (ikkalasi
> ham UUID kalitli, to'qnashuv yo'q) va turiga qarab kerakli RPC'ni
> chaqiradi: `credit_coins_for_purchase` yoki
> `activate_agent_subscription`. Coin xaridi oqimi o'zgarmadi.

**Tannarx dashboard'i:** admin panelda `/a-agent`. Bitta savolga
javob beradi — obuna puli LLM va TTS xarajatini qoplayaptimi.
Asosiy raqam marja, qolgani uni tushuntiradi: kunlik xarajat
grafigi, kesh tejami, eng ko'p xarajat qilgan 20 foydalanuvchi.

Narxlar **env orqali sozlanadi** (yuqoridagi jadval): provayder
tarifi o'zgarganda kodga tegish shart emas. Standart qiymatlar
taxminiy — aniq raqamni provayder kabinetidan olib yozing, aks
holda marja noto'g'ri ko'rinadi.

Hisobot `/api/admin/agent-costs` orqali yig'iladi, to'g'ridan-to'g'ri
Supabase'dan emas: `agent_quizzes` va `agent_tasks` server-only
jadvallar, ularni mijozdan o'qib bo'lmaydi.

**Menyu:** agent kabinet yon panelida "Ustoz" nomi bilan turadi,
admin panelda esa "Agent tannarxi"
(`/chat` — "AI Yordamchi" dan alohida: u topshiriq ustida yordam
beradi, bu esa noldan o'rgatadigan o'qituvchi).

## Muhim eslatmalar

- Migratsiyalar qayta ishga tushirilsa ham xavfsiz: `IF NOT EXISTS`,
  `ON CONFLICT DO NOTHING` va `DROP POLICY IF EXISTS` ishlatilgan.
- `17_library_seed.sql` dublikat yaratmaydi — slug bo'yicha tekshiradi.
- Storage bucket'lar (`books`, `book-covers`) 16-migratsiyada yaratiladi.
  Supabase loyihasida Storage yoqilganiga ishonch hosil qiling.
- Migratsiya qo'llanmaguncha tegishli sahifalar bo'sh holatni ko'rsatadi —
  bu xato emas, kutilgan xatti-harakat.
