-- ============================================================
-- MirAcademy вЂ” Ma'ruza kursining kirish mavzulari to'liq kontenti
--
-- "python-intro" va "python-setup" mavzulari eski seed'dan qolgan edi:
-- 2-3 qatorli matn va sinov uchun kiritilgan yozuvlar ("A / az / qwe"
-- kabi test, "asd3ew" shartli topshiriq). Endi ular boshqa mavzular
-- darajasida: to'liq dars matni, 6 tadan test va 3 tadan topshiriq.
--
-- Mavzu nomlari o'zgarmadi вЂ” ularning ru/en/kaa tarjimalari (46-migr.)
-- o'z kuchida qoladi.
--
-- Sifat nazorati: dars matnidagi misollar natijasi va topshiriq
-- yechimlari Python'da ishga tushirib tekshirilgan.
--
-- Qayta ishga tushirish xavfsiz.
-- ============================================================

DO $$
DECLARE
  v_course UUID;
  t1 UUID; t2 UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-maruza';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: dasturlash-asoslari-maruza';
  END IF;

  -- ==========================================================
  -- 1. Python nima va nima uchun o'rganish kerak?
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, 'Python nima va nima uchun o''rganish kerak?', 'python-intro',
$html$
<h2>Dasturlash nima?</h2>
<p>Kompyuter juda tez, lekin o'zi hech narsa "bilmaydi". U faqat aniq va tartibli buyruqlarni bajaradi. <b>Dastur</b> вЂ” kompyuter uchun yozilgan shunday buyruqlar ketma-ketligi, <b>dasturlash</b> esa ularni yozish san'ati.</p>
<p>Oshxona retseptini eslang: "guruchni yuving, sabzini to'g'rang, qozonni qizdiring". Har bir qadam aniq va ma'lum tartibda. Dastur ham xuddi shunday retsept, faqat kompyuter uni <b>so'zma-so'z</b> bajaradi: siz nima yozsangiz, aynan shuni qiladi вЂ” hatto xato bo'lsa ham.</p>

<h2>Dasturlash tili nima uchun kerak?</h2>
<p>Kompyuter protsessori faqat nol va birlardan iborat <b>mashina kodini</b> tushunadi. Odam uchun bunday kod yozish juda qiyin. Dasturlash tili вЂ” odam tushunadigan so'zlar va kompyuter bajaradigan buyruqlar orasidagi ko'prik.</p>
<table>
  <tr><th>Daraja</th><th>Misol</th><th>Kim uchun qulay</th></tr>
  <tr><td>Mashina kodi</td><td><code>10110000 01100001</code></td><td>Protsessor</td></tr>
  <tr><td>Past darajali til (Assembler)</td><td><code>MOV AL, 61h</code></td><td>Tizim dasturchisi</td></tr>
  <tr><td>Yuqori darajali til (Python)</td><td><code>print("Salom")</code></td><td>Har qanday odam</td></tr>
</table>

<h2>Python bilan tanishuv</h2>
<p>Python'ni 1991-yilda niderlandiyalik dasturchi <b>Gvido van Rossum</b> yaratgan. Til nomi ilondan emas, britaniyaliklarning "Monty Python" komediya ko'rsatuvidan olingan. Bugun Python dunyodagi eng mashhur dasturlash tillaridan biri.</p>

<h3>Nima uchun aynan Python?</h3>
<ul>
  <li><b>Sodda sintaksis</b> вЂ” kod oddiy ingliz tiliga yaqin o'qiladi</li>
  <li><b>Kam yoziladi</b> вЂ” boshqa tillarda 5вЂ“10 qator bo'ladigan ish ko'pincha bitta qatorda bajariladi</li>
  <li><b>Bepul va ochiq</b> вЂ” hech qanday litsenziya to'lovi yo'q</li>
  <li><b>Ulkan kutubxonalar</b> вЂ” matematika, grafika, sun'iy intellekt uchun tayyor vositalar</li>
  <li><b>Katta hamjamiyat</b> вЂ” har qanday savolga internetda javob topiladi</li>
</ul>

<h3>Bir xil vazifa вЂ” ikki tilda</h3>
<p>Ekranga "Salom" chiqaruvchi dastur Java tilida:</p>
<pre><code>public class Salom {
    public static void main(String[] args) {
        System.out.println("Salom");
    }
}</code></pre>
<p>Python tilida esa:</p>
<pre><code>print("Salom")</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Salom</code></pre>

<h2>Python qayerda ishlatiladi?</h2>
<table>
  <tr><th>Soha</th><th>Nima qilinadi</th><th>Misollar</th></tr>
  <tr><td>Sun'iy intellekt</td><td>Modellarni o'qitish, matn va tasvirni tanish</td><td>ChatGPT kabi tizimlar, yuzni tanish</td></tr>
  <tr><td>Ma'lumotlar tahlili</td><td>Statistika, grafiklar, hisobotlar</td><td>Bank, sug'urta, ilmiy tadqiqotlar</td></tr>
  <tr><td>Veb-dasturlash</td><td>Saytlarning server qismi</td><td>Instagram (Django), Pinterest</td></tr>
  <tr><td>Avtomatlashtirish</td><td>Takroriy ishlarni dasturga topshirish</td><td>Fayllarni saralash, hisobot yuborish</td></tr>
  <tr><td>Ta'lim va fan</td><td>Hisob-kitob, modellashtirish</td><td>Fizika tajribalari, matematik masalalar</td></tr>
</table>

<h2>Dastur qanday bajariladi?</h2>
<p>Python вЂ” <b>interpretatsiya qilinadigan</b> til. Siz yozgan kodni <b>Python tarjimoni</b> (interpreter) qatorma-qator o'qiydi va darhol bajaradi. Shu sababli natijani tez ko'rasiz va xatoni oson topasiz.</p>
<ol>
  <li>Siz <code>.py</code> faylga kod yozasiz</li>
  <li>Tarjimon kodni yuqoridan pastga qarab o'qiydi</li>
  <li>Har bir buyruq bajariladi, natija ekranga chiqadi</li>
  <li>Biror qatorda xato bo'lsa, tarjimon to'xtaydi va xato haqida xabar beradi</li>
</ol>

<h2>Birinchi dastur</h2>
<pre><code>print("Assalomu alaykum!")
print("Men Python o'rganyapman")
print(2026 - 2008)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Assalomu alaykum!
Men Python o'rganyapman
18</code></pre>
<p>Bu yerda ikkita muhim narsa bor:</p>
<ul>
  <li><code>print()</code> вЂ” qavs ichidagi qiymatni ekranga chiqaradi</li>
  <li>Qo'shtirnoqdagi matn shundayligicha chiqadi, qo'shtirnoqsiz yozilgan ifoda esa <b>hisoblanadi</b></li>
</ul>
<pre><code>print("5 + 3")
print(5 + 3)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>5 + 3
8</code></pre>

<h3>Izohlar</h3>
<p><code>#</code> belgisidan keyingi matnni Python o'qimaydi. Izoh kodni o'qiydigan odam uchun yoziladi:</p>
<pre><code># Bu dastur bir haftadagi soatlarni hisoblaydi
print(7 * 24)  # 7 kun, har birida 24 soat</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>168</code></pre>

<h2>MirAcademy'da qanday o'qiladi?</h2>
<ul>
  <li><b>Dars matni</b> va <b>taqdimot</b> вЂ” nazariyani o'qing, misollarni o'zingiz yozib ko'ring</li>
  <li><b>Test</b> вЂ” tushunganingizni tekshiring</li>
  <li><b>Amaliy topshiriq</b> вЂ” kod yozing, platforma uni avtomatik tekshiradi</li>
  <li><b>Playground</b> вЂ” istalgan kodni erkin sinab ko'rish uchun</li>
</ul>
<blockquote>Dasturlashni o'qib emas, yozib o'rganiladi. Har bir misolni ko'chirmasdan, o'zingiz terib chiqing.</blockquote>

<h2>Xulosa</h2>
<ul>
  <li>Dastur вЂ” kompyuter uchun aniq buyruqlar ketma-ketligi</li>
  <li>Python вЂ” sodda, bepul va juda keng tarqalgan yuqori darajali til</li>
  <li>U sun'iy intellekt, ma'lumotlar tahlili, veb va avtomatlashtirishda ishlatiladi</li>
  <li>Tarjimon kodni qatorma-qator bajaradi</li>
  <li><code>print()</code> ekranga chiqaradi, <code>#</code> вЂ” izoh</li>
</ul>
$html$,
    1, 10, 25, 30, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t1;

  -- ==========================================================
  -- 2. Python o'rnatish va muhitni sozlash
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, 'Python o''rnatish va muhitni sozlash', 'python-setup',
$html$
<h2>Ish muhiti nima?</h2>
<p>Duradgor ishni boshlashdan oldin arra, randa va chizg'ichni tayyorlaydi. Dasturchining ham asboblari bor:</p>
<ul>
  <li><b>Python tarjimoni</b> вЂ” kodni o'qib bajaradigan dastur</li>
  <li><b>Kod muharriri</b> вЂ” kod yoziladigan joy: xatolarni ko'rsatadi, kodga rang beradi</li>
  <li><b>Terminal</b> вЂ” dasturni ishga tushirish va natijani ko'rish oynasi</li>
</ul>

<h2>Uchta yo'l вЂ” o'zingizga qulayini tanlang</h2>
<table>
  <tr><th>Usul</th><th>Nima kerak</th><th>Kimga mos</th></tr>
  <tr><td>MirAcademy Playground</td><td>Faqat brauzer</td><td>Darhol boshlash uchun, hech narsa o'rnatmasdan</td></tr>
  <tr><td>Kompyuterga o'rnatish</td><td>Python + VS Code</td><td>Jiddiy loyihalar, fayllar bilan ishlash</td></tr>
  <tr><td>Telefonda</td><td>Pydroid 3 (Android)</td><td>Yo'lda mashq qilish</td></tr>
</table>
<p>Bu kursdagi barcha topshiriqlarni Playground'da va dars sahifasida bajarish mumkin. Lekin kompyuterga o'rnatish вЂ” har bir dasturchi uchun zarur ko'nikma.</p>

<h2>Windows'da o'rnatish</h2>
<ol>
  <li><b>python.org</b> saytiga kiring va <b>Downloads</b> bo'limidan eng so'nggi versiyani yuklab oling</li>
  <li>Yuklangan faylni ishga tushiring</li>
  <li>Birinchi oynaning pastidagi <b>Add python.exe to PATH</b> belgisini albatta qo'ying</li>
  <li><b>Install Now</b> tugmasini bosing va o'rnatish tugashini kuting</li>
</ol>
<blockquote><b>PATH nima uchun kerak?</b> PATH вЂ” tizim dasturlarni qidiradigan papkalar ro'yxati. Python unga qo'shilmasa, terminal <code>python</code> buyrug'ini tanimaydi.</blockquote>

<h3>O'rnatilganini tekshirish</h3>
<p>Terminalni oching (Windows'da <b>Win + R</b>, keyin <code>cmd</code>) va yozing:</p>
<pre><code>python --version</code></pre>
<p>Javobda <code>Python 3.x.x</code> ko'rinsa вЂ” hammasi tayyor. Agar "is not recognized" degan xabar chiqsa, PATH belgisi qo'yilmagan: o'rnatuvchini qayta ishga tushiring va <b>Modify</b> orqali tuzating.</p>

<h3>macOS va Linux</h3>
<p>Ko'pchilik Linux tizimlarida Python allaqachon o'rnatilgan. Terminalda <code>python3 --version</code> buyrug'i bilan tekshiring. macOS'da python.org dan yuklab olingan o'rnatuvchidan foydalaning.</p>

<h2>Kod muharriri: VS Code</h2>
<ol>
  <li><b>code.visualstudio.com</b> dan VS Code'ni yuklab o'rnating</li>
  <li>Chap paneldagi <b>Extensions</b> bo'limidan <b>Python</b> kengaytmasini o'rnating</li>
  <li>Yangi papka oching va unda <code>salom.py</code> faylini yarating</li>
  <li>Kodni yozing va yuqori o'ng burchakdagi в–¶ tugmasi bilan ishga tushiring</li>
</ol>

<h2>Ikki xil ishlash rejimi</h2>
<h3>1. Interaktiv rejim</h3>
<p>Terminalda <code>python</code> deb yozsangiz, <code>&gt;&gt;&gt;</code> belgisi paydo bo'ladi. Endi har bir qator darhol bajariladi вЂ” tez sinab ko'rish uchun qulay:</p>
<pre><code>&gt;&gt;&gt; 2 + 3
5
&gt;&gt;&gt; "salom".upper()
'SALOM'
&gt;&gt;&gt; exit()</code></pre>

<h3>2. Fayl rejimi</h3>
<p>Kod <code>.py</code> kengaytmali faylga yoziladi va bir butun dastur sifatida ishga tushiriladi:</p>
<pre><code>python salom.py</code></pre>
<p>Haqiqiy dasturlar doim faylda yoziladi вЂ” ularni saqlash, tahrirlash va boshqalarga berish mumkin.</p>

<h2>Birinchi faylni ishga tushiramiz</h2>
<p><code>salom.py</code> fayliga quyidagi kodni yozing:</p>
<pre><code>ism = input("Ismingiz: ")
print("Xush kelibsiz,", ism)
print("Python ishlayapti!")</code></pre>
<p class="text-xs"><b>Kirish:</b></p><pre><code>Zarina</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Ismingiz: Xush kelibsiz, Zarina
Python ishlayapti!</code></pre>
<p><code>input()</code> foydalanuvchi kiritishini kutadi. Qavs ichidagi matn вЂ” so'rov sifatida ko'rsatiladi.</p>

<h2>Eng ko'p uchraydigan muammolar</h2>
<table>
  <tr><th>Muammo</th><th>Sababi</th><th>Yechimi</th></tr>
  <tr><td><code>'python' is not recognized</code></td><td>PATH belgilanmagan</td><td>O'rnatuvchida <b>Modify</b> в†’ PATH ni yoqing</td></tr>
  <tr><td>Microsoft Store ochiladi</td><td>Windows'ning soxta "python" yorlig'i</td><td>Sozlamalar в†’ App execution aliases в†’ Python'ni o'chiring</td></tr>
  <tr><td>O'zbekcha harflar buziladi</td><td>Fayl kodlashi noto'g'ri</td><td>Faylni <b>UTF-8</b> kodlashda saqlang</td></tr>
  <tr><td>Fayl topilmadi</td><td>Terminal boshqa papkada</td><td><code>cd papka_nomi</code> bilan fayl turgan papkaga o'ting</td></tr>
</table>

<h2>Xulosa</h2>
<ul>
  <li>Ish muhiti: tarjimon + muharrir + terminal</li>
  <li>Windows'da o'rnatishda <b>Add to PATH</b> belgisini unutmang</li>
  <li><code>python --version</code> вЂ” o'rnatilganini tekshirish</li>
  <li>Interaktiv rejim вЂ” tez sinash, fayl rejimi вЂ” haqiqiy dasturlar</li>
  <li>Boshlash uchun o'rnatish shart emas вЂ” MirAcademy Playground yetarli</li>
</ul>
$html$,
    2, 10, 25, 30, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t2;

  -- Qayta ishga tushirilganda dublikat bo'lmasligi uchun
  DELETE FROM quizzes WHERE topic_id IN (t1, t2);
  DELETE FROM topic_tasks WHERE topic_id IN (t1, t2);

  -- Testlar: Python nima va nima uchun o'rganish kerak?
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t1, 'Dastur nima?', 'single',
   '[{"id": "a", "text": "Kompyuter bajaradigan aniq buyruqlar ketma-ketligi", "is_correct": true}, {"id": "b", "text": "Kompyuterning ehtiyot qismi", "is_correct": false}, {"id": "c", "text": "Internet sahifasi", "is_correct": false}, {"id": "d", "text": "Matn muharriri", "is_correct": false}]'::jsonb,
   'Dastur вЂ” kompyuter uchun yozilgan retsept: aniq va tartibli buyruqlar.', 1, 0),
  (t1, 'Python dasturlash tilini kim yaratgan?', 'single',
   '[{"id": "a", "text": "Gvido van Rossum", "is_correct": true}, {"id": "b", "text": "Bill Geyts", "is_correct": false}, {"id": "c", "text": "Linus Torvalds", "is_correct": false}, {"id": "d", "text": "Mark Sukerberg", "is_correct": false}]'::jsonb,
   'Python''ni 1991-yilda Gvido van Rossum yaratgan.', 1, 1),
  (t1, 'Kod nima chiqaradi?

print("7 * 3")', 'single',
   '[{"id": "a", "text": "7 * 3", "is_correct": true}, {"id": "b", "text": "21", "is_correct": false}, {"id": "c", "text": "73", "is_correct": false}, {"id": "d", "text": "Xato", "is_correct": false}]'::jsonb,
   'Qo''shtirnoq ichidagi hamma narsa oddiy matn вЂ” Python uni hisoblamaydi.', 1, 2),
  (t1, 'Kod nima chiqaradi?

print(7 * 3)', 'single',
   '[{"id": "a", "text": "21", "is_correct": true}, {"id": "b", "text": "7 * 3", "is_correct": false}, {"id": "c", "text": "73", "is_correct": false}, {"id": "d", "text": "10", "is_correct": false}]'::jsonb,
   'Qo''shtirnoqsiz ifoda hisoblanadi: 7 Г— 3 = 21.', 1, 3),
  (t1, 'Python kodi qanday bajariladi?', 'single',
   '[{"id": "a", "text": "Tarjimon uni qatorma-qator o''qib bajaradi", "is_correct": true}, {"id": "b", "text": "Avval butunlay mashina kodiga aylantiriladi, keyin bajariladi", "is_correct": false}, {"id": "c", "text": "Faqat internet orqali bajariladi", "is_correct": false}, {"id": "d", "text": "Teskari tartibda вЂ” pastdan yuqoriga", "is_correct": false}]'::jsonb,
   'Python вЂ” interpretatsiya qilinadigan til: tarjimon kodni yuqoridan pastga qatorma-qator bajaradi.', 1, 4),
  (t1, 'Python''da izoh qaysi belgi bilan boshlanadi?', 'single',
   '[{"id": "a", "text": "#", "is_correct": true}, {"id": "b", "text": "//", "is_correct": false}, {"id": "c", "text": "--", "is_correct": false}, {"id": "d", "text": "/*", "is_correct": false}]'::jsonb,
   '# dan keyingi matn izoh hisoblanadi. // va /* boshqa tillarda ishlatiladi.', 1, 5);

  -- Topshiriqlar: Python nima va nima uchun o'rganish kerak?
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t1, 'Birinchi dastur',
   'Ekranga aynan quyidagi matnni chiqaring:

Salom, MirAcademy!',
   '# Kodingizni yozing',
   'print("Salom, MirAcademy!")',
   'python',
   '[{"input": "", "expected_output": "Salom, MirAcademy!", "is_hidden": false}, {"input": "", "expected_output": "Salom, MirAcademy!", "is_hidden": true}, {"input": "", "expected_output": "Salom, MirAcademy!", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "print() ichida matnni qo''shtirnoqqa oling"}, {"order": 2, "text": "Vergul va undov belgisini unutmang"}]'::jsonb,
   'easy', 5, 15, 0),
  (t1, 'Salomlashuv',
   'Kirishda foydalanuvchining ismi beriladi. "Salom, <ism>!" ko''rinishida chiqaring.

Misol: Ali в†’ Salom, Ali!',
   'ism = input()
# Kodingizni yozing',
   'ism = input()
print(f"Salom, {ism}!")',
   'python',
   '[{"input": "Ali", "expected_output": "Salom, Ali!", "is_hidden": false}, {"input": "Dilnoza", "expected_output": "Salom, Dilnoza!", "is_hidden": false}, {"input": "Sardor", "expected_output": "Salom, Sardor!", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "input() yozilgan matnni qaytaradi"}, {"order": 2, "text": "f\"Salom, {ism}!\" вЂ” f-satr"}]'::jsonb,
   'easy', 5, 15, 1),
  (t1, 'Yoshni hisoblash',
   'Kirishda tug''ilgan yil beriladi. 2026-yil oxiriga kelib odam necha yoshda bo''lishini chiqaring.',
   'yil = int(input())
# Kodingizni yozing',
   'yil = int(input())
print(2026 - yil)',
   'python',
   '[{"input": "2005", "expected_output": "21", "is_hidden": false}, {"input": "2010", "expected_output": "16", "is_hidden": false}, {"input": "1990", "expected_output": "36", "is_hidden": true}, {"input": "2026", "expected_output": "0", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "input() matn qaytaradi вЂ” int() bilan songa aylantiring"}, {"order": 2, "text": "2026 - yil"}]'::jsonb,
   'easy', 5, 15, 2);

  -- Testlar: Python o'rnatish va muhitni sozlash
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t2, 'Windows''da Python o''rnatishda qaysi belgini qo''yish eng muhim?', 'single',
   '[{"id": "a", "text": "Add python.exe to PATH", "is_correct": true}, {"id": "b", "text": "Install for all users", "is_correct": false}, {"id": "c", "text": "Disable path length limit", "is_correct": false}, {"id": "d", "text": "Use admin privileges", "is_correct": false}]'::jsonb,
   'PATH bo''lmasa, terminal python buyrug''ini tanimaydi.', 1, 0),
  (t2, 'Python o''rnatilganini terminalda qaysi buyruq bilan tekshirish mumkin?', 'single',
   '[{"id": "a", "text": "python --version", "is_correct": true}, {"id": "b", "text": "python install", "is_correct": false}, {"id": "c", "text": "print(python)", "is_correct": false}, {"id": "d", "text": "check python", "is_correct": false}]'::jsonb,
   'python --version o''rnatilgan versiyani ko''rsatadi. Linux va macOS''da odatda python3 --version.', 1, 1),
  (t2, 'Python fayllari qaysi kengaytma bilan saqlanadi?', 'single',
   '[{"id": "a", "text": ".py", "is_correct": true}, {"id": "b", "text": ".python", "is_correct": false}, {"id": "c", "text": ".txt", "is_correct": false}, {"id": "d", "text": ".exe", "is_correct": false}]'::jsonb,
   'Python dasturlari .py kengaytmali fayllarda saqlanadi.', 1, 2),
  (t2, 'Terminalda >>> belgisi nimani bildiradi?', 'single',
   '[{"id": "a", "text": "Python interaktiv rejimda, buyruq kutmoqda", "is_correct": true}, {"id": "b", "text": "Dasturda xato bor", "is_correct": false}, {"id": "c", "text": "Fayl saqlanmoqda", "is_correct": false}, {"id": "d", "text": "Internet ulanishi kutilmoqda", "is_correct": false}]'::jsonb,
   '>>> вЂ” interaktiv rejim belgisi: har bir yozilgan qator darhol bajariladi.', 1, 3),
  (t2, 'Terminal "''python'' is not recognized" deb javob bersa, eng ehtimoliy sabab nima?', 'single',
   '[{"id": "a", "text": "Python PATH ga qo''shilmagan", "is_correct": true}, {"id": "b", "text": "Kodda sintaksis xatosi bor", "is_correct": false}, {"id": "c", "text": "Kompyuterda internet yo''q", "is_correct": false}, {"id": "d", "text": "Fayl nomi noto''g''ri", "is_correct": false}]'::jsonb,
   'Tizim python buyrug''ini PATH dagi papkalardan qidiradi. U yerda bo''lmasa, buyruq tanilmaydi.', 1, 4),
  (t2, 'Qaysi holatda interaktiv rejimdan ko''ra .py fayl afzal?', 'single',
   '[{"id": "a", "text": "Dasturni saqlab, keyin qayta ishga tushirish kerak bo''lganda", "is_correct": true}, {"id": "b", "text": "2 + 2 ni tez hisoblash uchun", "is_correct": false}, {"id": "c", "text": "Bitta funksiyani sinab ko''rish uchun", "is_correct": false}, {"id": "d", "text": "Hech qachon вЂ” ular bir xil", "is_correct": false}]'::jsonb,
   'Interaktiv rejimdagi kod saqlanmaydi. Haqiqiy dastur faylda yoziladi.', 1, 5);

  -- Topshiriqlar: Python o'rnatish va muhitni sozlash
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t2, 'Muhit tayyor',
   'Ekranga ikki qator chiqaring:

Python o''rnatildi!
Dasturlashni boshlaymiz',
   '# Kodingizni yozing',
   'print("Python o''rnatildi!")
print("Dasturlashni boshlaymiz")',
   'python',
   '[{"input": "", "expected_output": "Python o''rnatildi!\nDasturlashni boshlaymiz", "is_hidden": false}, {"input": "", "expected_output": "Python o''rnatildi!\nDasturlashni boshlaymiz", "is_hidden": true}, {"input": "", "expected_output": "Python o''rnatildi!\nDasturlashni boshlaymiz", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Har bir print() alohida qatorga chiqaradi"}, {"order": 2, "text": "Matnda apostrof bo''lsa, uni qo''shtirnoq (\") ichiga oling"}]'::jsonb,
   'easy', 5, 15, 0),
  (t2, 'Kalkulyatorni sinash',
   'Ikki qatorda ikkita butun son beriladi. Ularning yig''indisi, ayirmasi va ko''paytmasini uch qatorda chiqaring.',
   'a = int(input())
b = int(input())
# Kodingizni yozing',
   'a = int(input())
b = int(input())
print(a + b)
print(a - b)
print(a * b)',
   'python',
   '[{"input": "7\n3", "expected_output": "10\n4\n21", "is_hidden": false}, {"input": "-2\n5", "expected_output": "3\n-7\n-10", "is_hidden": false}, {"input": "0\n0", "expected_output": "0\n0\n0", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Har bir natija uchun alohida print()"}, {"order": 2, "text": "a - b va b - a farq qiladi"}]'::jsonb,
   'easy', 5, 15, 1),
  (t2, 'Uch marta salom',
   'Kirishda bitta so''z beriladi. Uni bitta qatorda, orasida bo''shliq bilan uch marta chiqaring.

Misol: salom в†’ salom salom salom',
   'soz = input()
# Kodingizni yozing',
   'soz = input()
print(soz, soz, soz)',
   'python',
   '[{"input": "salom", "expected_output": "salom salom salom", "is_hidden": false}, {"input": "Python", "expected_output": "Python Python Python", "is_hidden": false}, {"input": "a", "expected_output": "a a a", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "print() ga bir nechta qiymat vergul bilan berilsa, orasiga bo''shliq qo''yadi"}, {"order": 2, "text": "print(soz, soz, soz)"}]'::jsonb,
   'easy', 5, 15, 2);

END $$;
