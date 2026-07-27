-- ============================================
-- EduCode — Kutubxona bloki uchun boshlang'ich kontent
--   48 ta termin (4 soha × 12) + 10 ta dars metodi
-- 16_library.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirilsa dublikat yaratmaydi (slug bo'yicha ON CONFLICT).
-- ============================================

-- ============================================
-- TERMINLAR — DASTURLASH
-- ============================================
INSERT INTO glossary_terms (term, slug, term_en, definition, example, category, difficulty, is_published) VALUES
('O''zgaruvchi', 'ozgaruvchi', 'Variable',
 'Ma''lumotni saqlab turadigan nomlangan joy. Uni quti deb tasavvur qiling: qutiga nom beramiz va ichiga qiymat solamiz.',
 'yosh = 15', 'programming', 'beginner', true),

('Funksiya', 'funksiya', 'Function',
 'Ma''lum bir vazifani bajaradigan, nom berilgan kod bo''lagi. Bir marta yozib, keyin istagancha chaqirasiz.',
 'def salom():
    print("Assalomu alaykum")', 'programming', 'beginner', true),

('Sikl', 'sikl', 'Loop',
 'Bir xil amalni bir necha marta takrorlaydigan konstruksiya. Bir xil kodni qayta-qayta yozishdan qutqaradi.',
 'for i in range(5):
    print(i)', 'programming', 'beginner', true),

('Shart operatori', 'shart-operatori', 'Conditional',
 'Dasturga tanlov qildiradi: shart bajarilsa bir yo''l, bajarilmasa boshqa yo''l bilan boradi.',
 'if yosh >= 18:
    print("Kattasiz")
else:
    print("Kichiksiz")', 'programming', 'beginner', true),

('Massiv', 'massiv', 'Array',
 'Bir nechta qiymatni bitta nom ostida tartib bilan saqlaydigan tuzilma. Har bir elementning o''z tartib raqami bor.',
 'sonlar = [10, 20, 30]', 'programming', 'beginner', true),

('Argument', 'argument', 'Argument',
 'Funksiyaga uzatiladigan qiymat. Funksiya shu qiymat ustida ish bajaradi.',
 'salomlash("Ali")  # "Ali" — argument', 'programming', 'beginner', true),

('Sintaksis', 'sintaksis', 'Syntax',
 'Dasturlash tilining grammatikasi — kodni qanday yozish qoidalari. Qoida buzilsa, dastur ishga tushmaydi.',
 NULL, 'programming', 'beginner', true),

('Kommentariy', 'kommentariy', 'Comment',
 'Kod ichidagi izoh. Kompyuter uni o''qimaydi, u faqat odam uchun yozilgan.',
 '# Bu qator foydalanuvchi yoshini tekshiradi', 'programming', 'beginner', true),

('Xatolik', 'xatolik', 'Bug',
 'Dasturning noto''g''ri ishlashiga olib keladigan kamchilik. Xatolikni topib tuzatish — dasturchining kundalik ishi.',
 NULL, 'programming', 'beginner', true),

('Obyekt', 'obyekt', 'Object',
 'Ma''lumot va shu ma''lumot ustidagi amallarni birga saqlaydigan tuzilma. Real dunyodagi narsani kodda ifodalaydi.',
 'mashina = {"rang": "qora", "tezlik": 120}', 'programming', 'intermediate', true),

('Sinf', 'sinf', 'Class',
 'Obyektlar yaratish uchun andoza. Sinf — chizma, obyekt — shu chizma bo''yicha qurilgan bino.',
 'class Talaba:
    def __init__(self, ism):
        self.ism = ism', 'programming', 'intermediate', true),

('Kutubxona', 'kutubxona', 'Library',
 'Boshqalar yozib qo''ygan tayyor kod to''plami. Uni ulab, g''ildirakni qaytadan ixtiro qilmaysiz.',
 'import math', 'programming', 'intermediate', true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- TERMINLAR — FRONTEND
-- ============================================
INSERT INTO glossary_terms (term, slug, term_en, definition, example, category, difficulty, is_published) VALUES
('HTML', 'html', 'HyperText Markup Language',
 'Veb-sahifaning skeleti. Sahifada qayerda sarlavha, qayerda matn, qayerda rasm turishini belgilaydi.',
 '<h1>Salom</h1>', 'frontend', 'beginner', true),

('CSS', 'css', 'Cascading Style Sheets',
 'Veb-sahifaning ko''rinishi: rang, shrift, joylashuv va oraliqlar. HTML — skelet bo''lsa, CSS — kiyim.',
 'h1 { color: blue; }', 'frontend', 'beginner', true),

('Teg', 'teg', 'Tag',
 'HTML''dagi burchak qavslar ichidagi buyruq. Har bir teg brauzerga elementning turini aytadi.',
 '<p>Bu — paragraf</p>', 'frontend', 'beginner', true),

('Selektor', 'selektor', 'Selector',
 'CSS''da qaysi elementni bo''yash kerakligini ko''rsatadigan qoida.',
 '.karta { border: 1px solid; }', 'frontend', 'beginner', true),

('Brauzer', 'brauzer', 'Browser',
 'Veb-sahifalarni ochib beradigan dastur. HTML, CSS va JavaScript''ni o''qib, ekranda ko''rinadigan sahifaga aylantiradi.',
 NULL, 'frontend', 'beginner', true),

('Domen', 'domen', 'Domain',
 'Saytning internetdagi manzili. Uni saytning uy manzili deb tushuning.',
 'educode.uz', 'frontend', 'beginner', true),

('DOM', 'dom', 'Document Object Model',
 'Brauzer HTML''dan yasab oladigan daraxtsimon tuzilma. JavaScript sahifani aynan shu daraxt orqali o''zgartiradi.',
 'document.querySelector("h1")', 'frontend', 'intermediate', true),

('Responsive dizayn', 'responsive-dizayn', 'Responsive design',
 'Sahifaning ekran o''lchamiga moslashishi. Bitta sayt telefonda ham, kompyuterda ham qulay ko''rinadi.',
 '@media (max-width: 640px) { ... }', 'frontend', 'intermediate', true),

('Komponent', 'komponent', 'Component',
 'Qayta ishlatiladigan mustaqil interfeys bo''lagi: tugma, karta, forma. Bir marta yozib, hamma joyda ishlatasiz.',
 NULL, 'frontend', 'intermediate', true),

('Framework', 'framework', 'Framework',
 'Dastur yozishni tezlashtiradigan tayyor tuzilma va qoidalar to''plami.',
 'React, Vue, Next.js', 'frontend', 'intermediate', true),

('API', 'api', 'Application Programming Interface',
 'Ikki dastur bir-biri bilan gaplashadigan interfeys. Restoran ofitsianti kabi: buyurtmani oshxonaga yetkazadi va javobni qaytaradi.',
 NULL, 'frontend', 'intermediate', true),

('Hosting', 'hosting', 'Hosting',
 'Sayt fayllari saqlanadigan va internetga uzatiladigan server xizmati.',
 NULL, 'frontend', 'intermediate', true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- TERMINLAR — KOMPYUTER SAVODXONLIGI
-- ============================================
INSERT INTO glossary_terms (term, slug, term_en, definition, example, category, difficulty, is_published) VALUES
('Operatsion tizim', 'operatsion-tizim', 'Operating System',
 'Kompyuterni boshqaradigan asosiy dastur. Barcha boshqa dasturlar uning ustida ishlaydi.',
 'Windows, macOS, Linux', 'computer_literacy', 'beginner', true),

('Fayl', 'fayl', 'File',
 'Kompyuterda saqlanadigan ma''lumot birligi: hujjat, rasm, video yoki dastur.',
 'hisobot.docx', 'computer_literacy', 'beginner', true),

('Papka', 'papka', 'Folder',
 'Fayllarni tartibga solib saqlaydigan idish. Papka ichida boshqa papkalar ham bo''lishi mumkin.',
 NULL, 'computer_literacy', 'beginner', true),

('Protsessor', 'protsessor', 'CPU',
 'Kompyuterning miyasi. Barcha hisob-kitob va buyruqlar shu yerda bajariladi.',
 NULL, 'computer_literacy', 'beginner', true),

('Operativ xotira', 'operativ-xotira', 'RAM',
 'Kompyuter hozir ishlayotgan ma''lumotni saqlaydigan tez xotira. O''chirilganda tozalanadi — ish stoli kabi.',
 NULL, 'computer_literacy', 'beginner', true),

('Qattiq disk', 'qattiq-disk', 'Hard Drive / SSD',
 'Ma''lumot uzoq muddat saqlanadigan xotira. O''chirilsa ham yo''qolmaydi — shkaf kabi.',
 NULL, 'computer_literacy', 'beginner', true),

('Parol', 'parol', 'Password',
 'Akkauntni himoyalaydigan maxfiy kalit. Kuchli parol uzun bo''ladi va harf, raqam, belgidan iborat.',
 NULL, 'computer_literacy', 'beginner', true),

('Zaxira nusxa', 'zaxira-nusxa', 'Backup',
 'Muhim fayllarning ikkinchi nusxasi. Asosiy nusxa yo''qolsa yoki buzilsa, shundan tiklanadi.',
 NULL, 'computer_literacy', 'beginner', true),

('Bulut', 'bulut', 'Cloud',
 'Fayllar o''z kompyuteringizda emas, internetdagi serverda saqlanishi. Istalgan qurilmadan kirish mumkin.',
 'Google Drive, OneDrive', 'computer_literacy', 'beginner', true),

('Drayver', 'drayver', 'Driver',
 'Operatsion tizimga qurilma bilan qanday ishlashni o''rgatadigan dastur.',
 NULL, 'computer_literacy', 'intermediate', true),

('Fishing', 'fishing', 'Phishing',
 'Foydalanuvchini aldab parol yoki karta ma''lumotini olishga urinish. Ko''pincha soxta sayt yoki xat orqali.',
 NULL, 'computer_literacy', 'intermediate', true),

('IP-manzil', 'ip-manzil', 'IP address',
 'Tarmoqdagi har bir qurilmaning raqamli manzili. Ma''lumot aynan shu manzil bo''yicha yetkaziladi.',
 '192.168.1.1', 'computer_literacy', 'intermediate', true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- TERMINLAR — ALGORITMLAR
-- ============================================
INSERT INTO glossary_terms (term, slug, term_en, definition, example, category, difficulty, is_published) VALUES
('Algoritm', 'algoritm', 'Algorithm',
 'Masalani yechish uchun aniq, tartibli qadamlar ketma-ketligi. Osh retsepti ham algoritm.',
 NULL, 'algorithms', 'beginner', true),

('Blok-sxema', 'blok-sxema', 'Flowchart',
 'Algoritmning chizma ko''rinishi. Har bir shakl bir amalni, strelkalar — qadamlar tartibini bildiradi.',
 NULL, 'algorithms', 'beginner', true),

('Qidiruv', 'qidiruv', 'Search',
 'To''plam ichidan kerakli elementni topish amali. Eng sodda usul — birma-bir tekshirish.',
 NULL, 'algorithms', 'beginner', true),

('Saralash', 'saralash', 'Sorting',
 'Elementlarni ma''lum tartibda — o''sish yoki kamayish bo''yicha — joylashtirish.',
 '[5, 2, 9] → [2, 5, 9]', 'algorithms', 'beginner', true),

('Ikkilik qidiruv', 'ikkilik-qidiruv', 'Binary search',
 'Saralangan ro''yxatda qidirishning tez usuli: har qadamda ro''yxatning yarmini tashlab yuboradi.',
 NULL, 'algorithms', 'intermediate', true),

('Rekursiya', 'rekursiya', 'Recursion',
 'Funksiyaning o''zini o''zi chaqirishi. Har chaqiruvda masala kichrayadi va oxirida to''xtaydi.',
 'def faktorial(n):
    if n <= 1: return 1
    return n * faktorial(n - 1)', 'algorithms', 'intermediate', true),

('Stek', 'stek', 'Stack',
 'Oxirgi kirgan birinchi chiqadigan tuzilma. Ustma-ust taxlangan likopchalar kabi.',
 NULL, 'algorithms', 'intermediate', true),

('Navbat', 'navbat', 'Queue',
 'Birinchi kirgan birinchi chiqadigan tuzilma. Do''kondagi navbat kabi.',
 NULL, 'algorithms', 'intermediate', true),

('Daraxt', 'daraxt', 'Tree',
 'Ildizdan boshlanib shoxlanadigan tuzilma. Papkalar tuzilishi — daraxtga misol.',
 NULL, 'algorithms', 'intermediate', true),

('Graf', 'graf', 'Graph',
 'Nuqtalar (tugunlar) va ularni bog''lovchi chiziqlardan iborat tuzilma. Metro sxemasi — graf.',
 NULL, 'algorithms', 'advanced', true),

('Murakkablik', 'murakkablik', 'Big O notation',
 'Algoritm ma''lumot hajmi oshganda qanchalik sekinlashishini ko''rsatadigan o''lchov.',
 'O(n), O(log n), O(n²)', 'algorithms', 'advanced', true),

('Xesh-jadval', 'xesh-jadval', 'Hash table',
 'Kalit bo''yicha qiymatni deyarli bir zumda topib beradigan tuzilma.',
 NULL, 'algorithms', 'advanced', true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- DARS METODLARI
-- ============================================
INSERT INTO teaching_methods
  (title, slug, summary, stage, group_size, duration_minutes, advantages, disadvantages, materials, guide_html, order_index, is_published)
VALUES

('Aqliy hujum', 'aqliy-hujum',
 'Qisqa vaqtda imkon qadar ko''p g''oya to''plash. Baholash keyinga qoldiriladi — avval miqdor, keyin sifat.',
 'warmup', 'class', 10,
 ARRAY['Barcha o''quvchi jalb qilinadi, kuchsizlar ham gapiradi','Tayyorgarlik deyarli talab qilmaydi','Mavzuga qiziqish uyg''otadi','O''quvchilarning boshlang''ich bilimini ko''rsatadi'],
 ARRAY['Katta sinfda boshqarish qiyin, shovqin ko''payadi','Faol o''quvchilar gapni olib qochishi mumkin','G''oyalar sayoz bo''lib qolishi mumkin'],
 ARRAY['Doska va marker','Stikerlar'],
 '<ol><li><b>Savolni qo''ying.</b> Aniq va ochiq bo''lsin: "Kompyuter qanday qilib rasmni saqlaydi?"</li><li><b>Qoidani aytib qo''ying:</b> hech kim baholanmaydi, har qanday g''oya qabul qilinadi.</li><li><b>3-5 daqiqa g''oya to''plang.</b> Hammasini doskaga yozing, to''xtatmang.</li><li><b>Guruhlang.</b> O''xshash g''oyalarni birlashtiring.</li><li><b>Baholang.</b> Endi birgalikda qaysi g''oya to''g''ri ekanini muhokama qiling.</li></ol><p><i>Maslahat: jim o''quvchilarga "sen nima deb o''ylaysan?" deb to''g''ridan-to''g''ri murojaat qiling.</i></p>',
 1, true),

('Juftlikda dasturlash', 'juftlikda-dasturlash',
 'Ikki o''quvchi bitta kompyuterda ishlaydi: biri kod yozadi, ikkinchisi yo''naltiradi va xatoni kuzatadi. Rollar almashib turadi.',
 'practice', 'small', 25,
 ARRAY['Xatolar darhol topiladi','Kuchsiz o''quvchi kuchlisidan o''rganadi','Kodni ovoz chiqarib tushuntirish tushunishni chuqurlashtiradi','Kompyuter yetishmasa ham dars o''tadi'],
 ARRAY['Juftlik noto''g''ri tanlansa, biri passiv qolib ketadi','Kuchli o''quvchi zerikishi mumkin','Rollarni almashtirishni nazorat qilish kerak'],
 ARRAY['Har juftlikka bitta kompyuter','Topshiriq matni'],
 '<ol><li><b>Juftlik tuzing.</b> Darajasi yaqin o''quvchilarni qo''shing — farq juda katta bo''lsa, kuchsizi kuzatuvchiga aylanadi.</li><li><b>Rollarni tushuntiring.</b> "Haydovchi" klaviatura oldida, "Shturman" ekranni kuzatib yo''naltiradi.</li><li><b>Taymer qo''ying.</b> Har 7-10 daqiqada rollar almashadi — bu majburiy.</li><li><b>Kuzating.</b> Shturman jim qolgan juftliklarga savol bering: "Hozir nima qilyapsizlar?"</li><li><b>Yakunda 2-3 juftlik yechimini sinfga ko''rsatsin.</b></li></ol>',
 2, true),

('Jonli kod yozish', 'jonli-kod-yozish',
 'O''qituvchi mavzuni ekranda real vaqtda kod yozib tushuntiradi — xatolar bilan birga, ularni tuzatib ko''rsatgan holda.',
 'explain', 'class', 20,
 ARRAY['O''quvchi fikrlash jarayonini ko''radi, faqat tayyor natijani emas','Xatoni tuzatish madaniyati shakllanadi','Slaydga qaraganda ancha jonli','Savol darhol beriladi va darhol sinab ko''riladi'],
 ARRAY['O''qituvchidan tayyorgarlik va tezlikni ushlashni talab qiladi','Tez yozilsa, orqada qolganlar uzilib qoladi','Proyektor yoki katta ekran shart'],
 ARRAY['Proyektor yoki katta ekran','Kod muharriri (Playground)','Shrift kattaligi kamida 18px'],
 '<ol><li><b>Bo''sh fayldan boshlang.</b> Tayyor kodni ko''chirib qo''ymang.</li><li><b>Ovoz chiqarib o''ylang:</b> "Endi menga o''zgaruvchi kerak, chunki..."</li><li><b>Ataylab xato qiling.</b> Xato xabarini birga o''qing va tuzating — bu eng qimmatli qism.</li><li><b>Har 5 daqiqada to''xtang</b> va sinfdan so''rang: "Keyin nima yozamiz?"</li><li><b>Oxirida kodni o''chiring</b> va o''quvchilar o''zi qaytadan yozsin.</li></ol>',
 3, true),

('Klaster', 'klaster',
 'Markazdagi tushunchadan shoxlar chiqarib, mavzu bo''yicha bilimlarni chizma ko''rinishida tartibga solish.',
 'reflect', 'any', 15,
 ARRAY['Tushunchalar orasidagi bog''liqlik ko''rinadi','Vizual xotiraga yaxshi o''tiradi','Dars boshida ham, oxirida ham ishlatiladi','Baholash uchun qulay material qoldiradi'],
 ARRAY['Chizma tartibsiz bo''lib ketishi mumkin','Vaqt talab qiladi','Yozishni yoqtirmaydigan o''quvchilar qarshilik qiladi'],
 ARRAY['A4 varaq yoki daftar','Rangli qalamlar'],
 '<ol><li><b>Markazga asosiy tushunchani yozing</b> va aylanaga oling. Masalan: "Sikl".</li><li><b>Birinchi darajali shoxlar:</b> turlari, ishlatilishi, misollari.</li><li><b>Har shoxdan mayda shoxlar chiqaring.</b> Vaqt tugaguncha to''xtamang.</li><li><b>Juftlikda almashing</b> — bir-birining klasteriga 2 ta yangi shox qo''shsin.</li><li><b>2-3 tasini doskada muhokama qiling.</b></li></ol>',
 4, true),

('Insert', 'insert',
 'Matnni belgilar bilan o''qish: bilgan, yangi, qarama-qarshi va tushunarsiz ma''lumotni ajratib belgilash.',
 'explain', 'any', 20,
 ARRAY['O''quvchi matnni passiv emas, faol o''qiydi','Tushunmagan joyi aniq ko''rinadi','O''qituvchi qaysi joyni qayta tushuntirish kerakligini biladi'],
 ARRAY['Sekin o''qiydigan o''quvchilar ulgurmaydi','Matn sifatli tanlanmasa, samara bermaydi','Birinchi marta uzoq tushuntirish kerak'],
 ARRAY['Bosma matn (1-2 bet)','Qalam'],
 '<p>Belgilar tizimi:</p><ul><li><b>✓</b> — buni bilardim</li><li><b>+</b> — bu men uchun yangi</li><li><b>−</b> — bu men bilganimga zid</li><li><b>?</b> — bu tushunarsiz, savolim bor</li></ul><ol><li><b>Belgilarni doskaga yozib qo''ying.</b></li><li><b>O''quvchilar matnni o''qib, chetiga belgi qo''yadi.</b></li><li><b>Jadval to''ldiradi:</b> har belgi uchun alohida ustun.</li><li><b>"?" belgilarini yig''ing</b> — dars davomi shu savollardan quriladi.</li></ol>',
 5, true),

('Xatoni top', 'xatoni-top',
 'O''quvchilarga ataylab xato qilingan kod beriladi. Vazifa — xatoni topish, sababini tushuntirish va tuzatish.',
 'assess', 'small', 15,
 ARRAY['Xato xabarini o''qishni o''rgatadi','Kodni diqqat bilan o''qish ko''nikmasini beradi','O''yin sifatida qabul qilinadi, qiziqarli','Tez tekshiriladi'],
 ARRAY['Juda qiyin xato qo''yilsa, o''quvchi taslim bo''ladi','Faqat xato qidirish ijodkorlikni rivojlantirmaydi','Har dars uchun alohida material tayyorlash kerak'],
 ARRAY['Xatoli kod nusxalari','Kompyuter yoki bosma varaq'],
 '<ol><li><b>3 xil darajadagi kod tayyorlang:</b> sintaksis xatosi, mantiqiy xato, ikkalasi birga.</li><li><b>Guruhlarga tarqating.</b> 5 daqiqa vaqt bering.</li><li><b>Har guruh 3 narsani aytsin:</b> xato qayerda, nima uchun xato, qanday tuzatiladi.</li><li><b>Kodni ishga tushirib ko''rsating</b> — xato xabarini birga o''qing.</li><li><b>Ball bering:</b> topgan +1, sababini tushuntirgan +2.</li></ol><p><i>Maslahat: mantiqiy xato (dastur ishlaydi, lekin natija noto''g''ri) eng foydali turi.</i></p>',
 6, true),

('Venn diagrammasi', 'venn-diagrammasi',
 'Ikki tushunchani kesishuvchi aylanalar orqali solishtirish: umumiy va farqli jihatlarni ajratish.',
 'practice', 'any', 12,
 ARRAY['Chalkashadigan tushunchalarni aniq ajratadi','Solishtirish ko''nikmasini rivojlantiradi','Chizmasi oddiy, tez bajariladi'],
 ARRAY['Faqat ikki-uch tushuncha uchun qulay','Yuzaki to''ldirilsa, foyda bermaydi'],
 ARRAY['Daftar yoki doska'],
 '<ol><li><b>Ikki tushunchani tanlang</b> — o''quvchilar chalkashtiradiganini. Masalan: "Sikl va Rekursiya" yoki "RAM va Qattiq disk".</li><li><b>Ikki kesishuvchi aylana chizing.</b></li><li><b>Chetlarga farqlarni, o''rtaga umumiy jihatlarni yozing.</b></li><li><b>Juftlikda tekshirib chiqing.</b></li><li><b>Doskada umumiy diagramma yig''ing.</b></li></ol>',
 7, true),

('Bumerang', 'bumerang',
 'O''quvchi materialni o''rganadi, keyin uni boshqalarga o''rgatadi. O''rgatish orqali o''zi mustahkamlaydi.',
 'practice', 'class', 35,
 ARRAY['O''rgatgan o''quvchi materialni eng chuqur o''zlashtiradi','Bir darsda ko''p mavzu qamrab olinadi','Mas''uliyat hissi shakllanadi','O''quvchilar bir-birini tili bilan tushuntiradi'],
 ARRAY['Bir o''quvchi noto''g''ri tushunsa, xato tarqaladi','Ko''p vaqt oladi','Guruhlarni tashkil qilish tayyorgarlik talab qiladi','Sust o''quvchi guruhni orqaga tortadi'],
 ARRAY['Har guruh uchun alohida material','Taymer'],
 '<ol><li><b>Mavzuni 4 qismga bo''ling</b> va sinfni 4 guruhga ajrating.</li><li><b>Har guruh o''z qismini o''rganadi</b> (10 daqiqa) — bu "ekspert guruhi".</li><li><b>Guruhlarni qayta aralashtiring:</b> yangi guruhda har qismdan bittadan ekspert bo''lsin.</li><li><b>Har ekspert o''z qismini guruhga o''rgatadi</b> (har biriga 4 daqiqa).</li><li><b>Yakunda butun mavzu bo''yicha qisqa test o''tkazing</b> — bu tushuntirish sifatini nazorat qiladi.</li></ol>',
 8, true),

('Svetofor', 'svetofor',
 'O''quvchilar uch rangli kartochka bilan tushunish darajasini bildiradi. O''qituvchi sinfning holatini bir qarashda ko''radi.',
 'assess', 'class', 5,
 ARRAY['Bir necha soniyada butun sinf holati ko''rinadi','Uyaladigan o''quvchi ham "tushunmadim" deya oladi','Hech qanday texnika kerak emas','Dars davomida bir necha marta ishlatiladi'],
 ARRAY['Ba''zi o''quvchilar boshqalarga qarab rang ko''taradi','Faqat umumiy tasavvur beradi, sababini ko''rsatmaydi'],
 ARRAY['Har o''quvchiga yashil, sariq, qizil kartochka'],
 '<p>Ranglar ma''nosi:</p><ul><li><b>Yashil</b> — tushundim, davom etaylik</li><li><b>Sariq</b> — qisman tushundim, misol kerak</li><li><b>Qizil</b> — tushunmadim, qaytadan tushuntiring</li></ul><ol><li><b>Har yangi bo''limdan keyin to''xtang</b> va "kartochka ko''taring" deng.</li><li><b>Qizil ko''p bo''lsa</b> — mavzuni boshqa misol bilan qaytaring.</li><li><b>Sariq ko''p bo''lsa</b> — 2-3 ta amaliy misol bering.</li><li><b>Yashil ko''p bo''lsa</b> — keyingi bosqichga o''ting, lekin qizil ko''targanlar bilan alohida ishlang.</li></ol><p><i>Maslahat: bir vaqtning o''zida "3, 2, 1 — ko''tardik" deb sanang, shunda bir-biriga qarab olmaydi.</i></p>',
 9, true),

('Blok-sxemadan kodga', 'blok-sxemadan-kodga',
 'Avval qog''ozda algoritmni chizma ko''rinishida tuzish, keyin uni kodga o''tkazish. Fikrlashni sintaksisdan ajratadi.',
 'practice', 'any', 25,
 ARRAY['O''quvchi sintaksisdan qo''rqmasdan mantiqqa e''tibor qaratadi','Kompyuter yetishmaganda ham dars o''tadi','Xato mantiqda ekani darhol ko''rinadi','Algoritmik fikrlashni mustahkamlaydi'],
 ARRAY['Chizishga vaqt ketadi','Murakkab masalada sxema chalkashib ketadi','O''quvchilar "tezroq kod yozaylik" deb qarshilik qiladi'],
 ARRAY['A4 varaq','Blok-sxema belgilar jadvali','Kompyuter (ikkinchi bosqich uchun)'],
 '<ol><li><b>Belgilarni eslating:</b> oval — boshlanish/tugash, to''rtburchak — amal, romb — shart.</li><li><b>Masalani birga o''qing</b> va shartlarni ajratib oling.</li><li><b>Sxemani qog''ozda chizing.</b> Kompyuterga hali tegmaydi.</li><li><b>Qo''shni bilan almashing</b> — u sxema bo''yicha "qo''lda" ishlab ko''rsin, xato topilsa tuzating.</li><li><b>Endi kodga o''tkazing.</b> Har blok — bir-ikki qator kod.</li></ol><p><i>Maslahat: 4-qadamni tashlab ketmang — aynan shu yerda mantiqiy xatolar topiladi.</i></p>',
 10, true)
ON CONFLICT (slug) DO NOTHING;
