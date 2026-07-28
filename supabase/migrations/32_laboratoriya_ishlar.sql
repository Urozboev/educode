-- ============================================
-- EduCode — "Dasturlash asoslari (Laboratoriya)" kursi
-- Fan dasturidagi 6 ta laboratoriya mashg'uloti
--
-- Har bir laboratoriya ishi: maqsad, nazariy eslatma, ish tartibi,
-- 4 ta test va 3-4 ta amaliy topshiriq (stdin → stdout).
-- Qayta ishga tushirilsa dublikat yaratmaydi.
-- ============================================

DO $$
DECLARE
  v_course UUID;
  l1 UUID; l2 UUID; l3 UUID; l4 UUID; l5 UUID; l6 UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-laboratoriya';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: dasturlash-asoslari-laboratoriya';
  END IF;

  -- ============================================
  -- 1-LABORATORIYA ISHI
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, '1-laboratoriya ishi: Sintaksis, arifmetik amallar, ma''lumot turlari', 'lab-1-sintaksis-turlar',
    $html$
<h2>Ishning maqsadi</h2>
<p>Python muhitida dastur yaratish, arifmetik amallarni qo'llash va ma'lumot turlarini bir-biriga aylantirish ko'nikmasini shakllantirish.</p>

<h3>Nazariy eslatma</h3>
<p>Pythonda uchta asosli sonli tur mavjud: <code>int</code> (butun), <code>float</code> (kasrli), <code>complex</code> (kompleks). Matn <code>str</code>, mantiqiy qiymat <code>bool</code> turida saqlanadi.</p>
<table>
  <tr><th>Amal</th><th>Belgisi</th><th>Misol</th><th>Natija</th></tr>
  <tr><td>Qo'shish</td><td><code>+</code></td><td><code>7 + 2</code></td><td>9</td></tr>
  <tr><td>Ayirish</td><td><code>-</code></td><td><code>7 - 2</code></td><td>5</td></tr>
  <tr><td>Ko'paytirish</td><td><code>*</code></td><td><code>7 * 2</code></td><td>14</td></tr>
  <tr><td>Bo'lish</td><td><code>/</code></td><td><code>7 / 2</code></td><td>3.5</td></tr>
  <tr><td>Butun bo'lish</td><td><code>//</code></td><td><code>7 // 2</code></td><td>3</td></tr>
  <tr><td>Qoldiq</td><td><code>%</code></td><td><code>7 % 2</code></td><td>1</td></tr>
  <tr><td>Daraja</td><td><code>**</code></td><td><code>7 ** 2</code></td><td>49</td></tr>
</table>
<p>Amallar tartibi: daraja → ko'paytirish va bo'lish → qo'shish va ayirish. Qavs tartibni o'zgartiradi.</p>

<h3>Ish tartibi</h3>
<ol>
  <li>Quyidagi kodni yozing va natijani tushuntiring:
    <pre><code>a = 17
b = 5
print(a + b, a - b, a * b)
print(a / b, a // b, a % b, a ** 2)</code></pre>
  </li>
  <li><code>type()</code> yordamida har bir natijaning turini aniqlang. <code>a / b</code> nima uchun <code>float</code> ekanini yozing.</li>
  <li>Turlarni aylantirishni sinang:
    <pre><code>print(int("42") + 8)
print(float("3.5") * 2)
print(str(2026) + "-yil")
print(int(9.99))</code></pre>
  </li>
  <li><code>int("3.5")</code> ni ishga tushiring va chiqqan xatoni yozib oling.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li><code>/</code> va <code>//</code> orasidagi farq nimada?</li>
  <li><code>2 ** 3 ** 2</code> nima uchun 512 ga teng?</li>
  <li><code>int()</code> yaxlitlaydimi yoki kesadimi?</li>
</ol>
$html$,
    1, 10, 25, 90, true, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO l1;

  -- ============================================
  -- 2-LABORATORIYA ISHI
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '2-laboratoriya ishi: Matnlar va sonlar bilan ishlash', 'lab-2-matnlar',
    $html$
<h2>Ishning maqsadi</h2>
<p>Matn (<code>str</code>) turini o'rganish: indekslash, kesish, metodlar va formatlash.</p>

<h3>Nazariy eslatma</h3>
<p>Matn — <b>o'zgarmas</b> ketma-ketlik. Har qanday metod matnning o'zini o'zgartirmaydi, balki <b>yangi</b> matn qaytaradi.</p>
<pre><code>s = "Python"
print(s[0], s[-1], s[1:4])   # P n yth
print(len(s))                # 6</code></pre>
<p>Kesish shakli: <code>s[boshlanish:tugash:qadam]</code>. Boshlanish kiradi, tugash kirmaydi.</p>
<table>
  <tr><th>Metod</th><th>Vazifasi</th></tr>
  <tr><td><code>upper()</code>, <code>lower()</code></td><td>Bosh/kichik harfga o'tkazish</td></tr>
  <tr><td><code>title()</code>, <code>capitalize()</code></td><td>Har so'z / faqat birinchi so'z bosh harf</td></tr>
  <tr><td><code>strip()</code></td><td>Chetdagi bo'shliqlarni olib tashlash</td></tr>
  <tr><td><code>replace(a, b)</code></td><td>Almashtirish</td></tr>
  <tr><td><code>split()</code>, <code>join()</code></td><td>Bo'laklarga ajratish / birlashtirish</td></tr>
  <tr><td><code>count(x)</code>, <code>find(x)</code></td><td>Sanash / o'rnini topish</td></tr>
</table>

<h3>Ish tartibi</h3>
<ol>
  <li>Matn ustida indekslash va kesishni sinang:
    <pre><code>s = "Dasturlash"
print(s[0], s[-1])
print(s[:6], s[6:], s[::-1])</code></pre>
  </li>
  <li>Metodlar natijasini kuzating:
    <pre><code>ism = "  ali valiyev  "
print(ism.strip().title())
print(ism.count("a"))</code></pre>
  </li>
  <li>Quyidagi kod nima uchun <code>salom</code> chiqarishini tushuntiring:
    <pre><code>a = "salom"
a.upper()
print(a)</code></pre>
  </li>
  <li>f-string formatlashni sinang:
    <pre><code>narx = 12345.6789
print(f"{narx:.2f}")
print(f"{narx:10.1f}")</code></pre>
  </li>
  <li>Topshiriqlarni bajaring.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li>Nima uchun <code>s[0] = "X"</code> xato beradi?</li>
  <li><code>title()</code> va <code>capitalize()</code> farqi nimada?</li>
  <li><code>s[::-1]</code> qanday ishlaydi?</li>
</ol>
$html$,
    2, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO l2;

  -- ============================================
  -- 3-LABORATORIYA ISHI
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '3-laboratoriya ishi: Ro''yxatlar va For sikli', 'lab-3-royxatlar-for',
    $html$
<h2>Ishning maqsadi</h2>
<p>Ro'yxat tuzilmasi bilan ishlash va <code>for</code> sikli yordamida ma'lumotlarni qayta ishlash ko'nikmasini shakllantirish.</p>

<h3>Nazariy eslatma</h3>
<pre><code>sonlar = [4, 8, 15, 16, 23, 42]

print(sonlar[0], sonlar[-1])   # 4 42
print(sonlar[1:4])             # [8, 15, 16]
print(len(sonlar))             # 6
print(sum(sonlar), max(sonlar), min(sonlar))</code></pre>
<table>
  <tr><th>Metod</th><th>Vazifasi</th></tr>
  <tr><td><code>append(x)</code></td><td>Oxiriga qo'shadi</td></tr>
  <tr><td><code>insert(i, x)</code></td><td>i-o'ringa qo'yadi</td></tr>
  <tr><td><code>remove(x)</code></td><td>Birinchi uchragan x ni o'chiradi</td></tr>
  <tr><td><code>pop(i)</code></td><td>i-elementni olib, qaytaradi</td></tr>
  <tr><td><code>sort()</code></td><td>Ro'yxatning o'zini tartiblaydi</td></tr>
  <tr><td><code>reverse()</code></td><td>Tartibni teskarisiga o'giradi</td></tr>
  <tr><td><code>index(x)</code>, <code>count(x)</code></td><td>O'rnini topadi / sanaydi</td></tr>
</table>
<p><b>Muhim:</b> <code>b = a</code> nusxa olmaydi — ikkala nom bitta ro'yxatga ishora qiladi. Nusxa uchun <code>a.copy()</code> yoki <code>a[:]</code> ishlatiladi.</p>

<h3>Ish tartibi</h3>
<ol>
  <li>Ro'yxat yarating va metodlarni birma-bir sinab, har qadamdan keyin ro'yxatni chiqaring.</li>
  <li>Nusxa muammosini tekshiring:
    <pre><code>a = [1, 2, 3]
b = a
b.append(4)
print(a)          # [1, 2, 3, 4] — nega?

c = a.copy()
c.append(5)
print(a)          # o'zgarmaydi</code></pre>
  </li>
  <li><code>for</code> ning uch ko'rinishini taqqoslang:
    <pre><code>for x in sonlar:              print(x, end=" ")
for i in range(len(sonlar)):  print(sonlar[i], end=" ")
for i, x in enumerate(sonlar):print(i, x)</code></pre>
  </li>
  <li><code>sort()</code> va <code>sorted()</code> farqini amalda ko'ring.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li><code>append()</code> va <code>insert()</code> farqi nimada?</li>
  <li>Nega <code>b = a</code> dan keyin <code>a</code> ham o'zgaradi?</li>
  <li><code>range(len(a))</code> qachon kerak bo'ladi?</li>
</ol>
$html$,
    3, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO l3;

  -- ============================================
  -- 4-LABORATORIYA ISHI
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '4-laboratoriya ishi: Shartlar va tarmoqlanish', 'lab-4-shartlar',
    $html$
<h2>Ishning maqsadi</h2>
<p>Tarmoqlanuvchi algoritmlarni tuzish, shartlar tartibini to'g'ri belgilash va chegaraviy holatlarni sinash.</p>

<h3>Nazariy eslatma</h3>
<pre><code>if shart1:
    # 1-tarmoq
elif shart2:
    # 2-tarmoq
else:
    # qolgan holatlar</code></pre>
<p>Shartlar yuqoridan pastga tekshiriladi, birinchi rost topilgani bajarilib, qolganlari o'tkazib yuboriladi.</p>
<p>Mantiqiy amallar ustuvorligi: <code>not</code> → <code>and</code> → <code>or</code>. Aralashtirganda qavs qo'ying.</p>

<h3>Sinov ma'lumotlarini tanlash</h3>
<p>Tarmoqlanuvchi dasturni sinashda quyidagilarni albatta tekshiring:</p>
<ul>
  <li>Har bir tarmoqqa tushadigan kamida bitta qiymat</li>
  <li>Chegaraviy qiymatlar: shart <code>x &gt;= 60</code> bo'lsa — 59, 60, 61</li>
  <li>Nol, manfiy son, tenglik holati</li>
</ul>

<h3>Ish tartibi</h3>
<ol>
  <li>Ball bo'yicha baho qo'yuvchi dasturni yozing va 59, 60, 69, 70, 89, 90 qiymatlarida sinang.</li>
  <li>Shartlar tartibini ataylab teskari qilib, natija qanday buzilishini kuzating.</li>
  <li>Qavs ta'sirini tekshiring:
    <pre><code>x = 2000
print(x % 4 == 0 and x % 100 != 0 or x % 400 == 0)
print(x % 4 == 0 and (x % 100 != 0 or x % 400 == 0))</code></pre>
    <p>1900 uchun ham sinab ko'ring.</p>
  </li>
  <li>Topshiriqlarni bajaring va har biri uchun sinov jadvalini tuzing.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li>Nima uchun chegaraviy holat birinchi tekshiriladi?</li>
  <li><code>elif</code> o'rniga ketma-ket <code>if</code> yozilsa nima o'zgaradi?</li>
  <li>Pythonda qaysi qiymatlar yolg'on hisoblanadi?</li>
</ol>
$html$,
    4, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO l4;

  -- ============================================
  -- 5-LABORATORIYA ISHI
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '5-laboratoriya ishi: While sikli', 'lab-5-while',
    $html$
<h2>Ishning maqsadi</h2>
<p>Takrorlar soni oldindan noma'lum bo'lgan algoritmlarni tuzish, cheksiz sikldan saqlanish usullarini o'zlashtirish.</p>

<h3>Nazariy eslatma</h3>
<pre><code>boshlangich_qiymat
while shart:
    tana
    shartga ta'sir qiluvchi o'zgarish</code></pre>
<p>Uchta qism ham bo'lishi shart. Uchinchisi unutilsa — cheksiz sikl.</p>
<p><code>break</code> sikldan chiqadi, <code>continue</code> joriy aylanishning qolganini o'tkazib yuboradi.</p>

<h3>Sonning raqamlari bilan ishlash namunasi</h3>
<pre><code>son = 4729
while son &gt; 0:
    raqam = son % 10     # oxirgi raqam
    son //= 10           # oxirgi raqamni tashlash
    print(raqam, end=" ")   # 9 2 7 4</code></pre>
<p>Bu naqsh raqamlar yig'indisi, sonni teskari o'girish, raqamlar sonini topish kabi masalalarda takrorlanadi.</p>

<h3>Ish tartibi</h3>
<ol>
  <li>1 dan 10 gacha sonlarni <code>for</code> va <code>while</code> bilan chiqaring, ikkala kodni taqqoslang.</li>
  <li>Ataylab cheksiz sikl yozing, uni to'xtating va sababini tushuntiring.</li>
  <li>To'xtatuvchi belgigacha sonlarni o'qib, ularning yig'indisi va o'rtachasini chiqaruvchi dastur yozing.</li>
  <li>Evklid algoritmini sinang:
    <pre><code>a, b = 48, 18
while b != 0:
    a, b = b, a % b
print(a)      # EKUB = 6</code></pre>
  </li>
  <li>Topshiriqlarni bajaring.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li>Qanday hollarda <code>while</code> <code>for</code> dan afzal?</li>
  <li><code>break</code> va <code>continue</code> farqi nimada?</li>
  <li>Evklid algoritmi nima uchun to'xtaydi?</li>
</ol>
$html$,
    5, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO l5;

  -- ============================================
  -- 6-LABORATORIYA ISHI
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '6-laboratoriya ishi: Funksiyalar', 'lab-6-funksiyalar',
    $html$
<h2>Ishning maqsadi</h2>
<p>Masalani funksiyalarga ajratib yechish, parametr va qaytariladigan qiymat bilan ishlash ko'nikmasini shakllantirish.</p>

<h3>Nazariy eslatma</h3>
<pre><code>def nom(parametr1, parametr2=sukut_qiymat):
    """Nima qilishi haqida qisqacha."""
    ...
    return natija</code></pre>
<ul>
  <li><code>def</code> qatori funksiyani faqat yaratadi — ishga tushirish uchun chaqirish kerak</li>
  <li><code>return</code> bajarilishi bilan funksiya tugaydi</li>
  <li><code>return</code> yozilmasa funksiya <code>None</code> qaytaradi</li>
  <li>Funksiya ichidagi o'zgaruvchilar lokal — tashqarida mavjud emas</li>
</ul>

<h3>Modulli yondashuv namunasi</h3>
<pre><code>def oqish():
    n = int(input())
    return list(map(int, input().split()))

def juftlarni_ajrat(sonlar):
    return [x for x in sonlar if x % 2 == 0]

def chiqar(sonlar):
    print(*sonlar)

chiqar(juftlarni_ajrat(oqish()))</code></pre>
<p>Har bir funksiya bitta vazifani bajaradi: o'qish, qayta ishlash, chiqarish. Bunday tuzilma xatoni topishni ancha osonlashtiradi.</p>

<h3>Ish tartibi</h3>
<ol>
  <li>Bir nechta oddiy funksiya yozing: <code>kvadrat</code>, <code>kub</code>, <code>toqmi</code>.</li>
  <li>Lokal o'zgaruvchi tashqarida ko'rinmasligini amalda tekshiring va chiqqan xatoni yozib oling.</li>
  <li>Sukut qiymatli va nomli argumentlarni sinang.</li>
  <li><code>return</code> dan keyingi kod bajarilmasligini tekshiring.</li>
  <li>Topshiriqlarni bajaring — har birida kamida ikkita funksiya bo'lsin.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li><code>print()</code> va <code>return</code> ni qachon ishlatish kerak?</li>
  <li>Parametr va argument farqi nimada?</li>
  <li>Nima uchun funksiya 20 qatordan oshmasligi tavsiya etiladi?</li>
</ol>
$html$,
    6, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO l6;

  -- ============================================
  -- TESTLAR VA TOPSHIRIQLAR
  -- ============================================
  DELETE FROM quizzes WHERE topic_id IN (l1, l2, l3, l4, l5, l6);
  DELETE FROM topic_tasks WHERE topic_id IN (l1, l2, l3, l4, l5, l6);

  -- 1-lab
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (l1, '17 % 5 va 17 // 5 natijalari qanday?', 'single',
   '[{"id":"a","text":"2 va 3","is_correct":true},{"id":"b","text":"3 va 2","is_correct":false},
     {"id":"c","text":"3.4 va 3","is_correct":false},{"id":"d","text":"2 va 3.4","is_correct":false}]'::jsonb,
   '17 = 5*3 + 2, ya''ni butun qism 3, qoldiq 2.', 1, 0),
  (l1, 'int("3.5") nima bo''ladi?', 'single',
   '[{"id":"a","text":"3","is_correct":false},{"id":"b","text":"4","is_correct":false},
     {"id":"c","text":"ValueError","is_correct":true},{"id":"d","text":"3.5","is_correct":false}]'::jsonb,
   'int() nuqtali matnni qabul qilmaydi. Avval float(), keyin int() qilish kerak.', 2, 1),
  (l1, 'type(10 / 2) nima qaytaradi?', 'single',
   '[{"id":"a","text":"int","is_correct":false},{"id":"b","text":"float","is_correct":true},
     {"id":"c","text":"str","is_correct":false},{"id":"d","text":"bool","is_correct":false}]'::jsonb,
   '/ amali har doim float qaytaradi. Butun natija kerak bo''lsa // ishlatiladi.', 1, 2),
  (l1, 'Qaysi ifodalar 8 ga teng?', 'multiple',
   '[{"id":"a","text":"2 ** 3","is_correct":true},{"id":"b","text":"17 // 3","is_correct":false},
     {"id":"c","text":"16 // 2","is_correct":true},{"id":"d","text":"64 ** 0.5","is_correct":true}]'::jsonb,
   '17 // 3 = 5, shuning uchun u to''g''ri javob emas. 64 ** 0.5 esa 8.0 (float) beradi — qiymati 8 ga teng.', 2, 3);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (l1, 'Vaqtni ajratish',
   'Bir butun son — soniyalar soni kiritiladi. Uni soat, daqiqa va soniyaga ajratib, soat:daqiqa:soniya ko''rinishida chiqaring (raqamlar oldida nol qo''yilmasin).
Masalan 3725 → 1:2:5',
   'jami = int(input())
# Kodingizni shu yerga yozing',
   'jami = int(input())
soat = jami // 3600
daqiqa = jami % 3600 // 60
soniya = jami % 60
print(f"{soat}:{daqiqa}:{soniya}")', 'python',
   '[{"input":"3725","expected_output":"1:2:5","is_hidden":false},
     {"input":"60","expected_output":"0:1:0","is_hidden":false},
     {"input":"7384","expected_output":"2:3:4","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"1 soat = 3600 soniya"},{"order":2,"text":"// va % ni ketma-ket qo''llang"}]'::jsonb,
   'medium', 8, 20, 0),
  (l1, 'Turlarni tekshirish',
   'Uch qator kiritiladi. Har birini quyidagicha baholang va alohida qatorda chiqaring:
butun son bo''lsa int, kasrli son bo''lsa float, aks holda str.',
   'for _ in range(3):
    q = input()
    # Kodingizni shu yerga yozing',
   'for _ in range(3):
    q = input()
    try:
        int(q)
        print("int")
    except ValueError:
        try:
            float(q)
            print("float")
        except ValueError:
            print("str")', 'python',
   '[{"input":"42\n3.14\nsalom","expected_output":"int\nfloat\nstr","is_hidden":false},
     {"input":"-7\n0.0\nabc123","expected_output":"int\nfloat\nstr","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Avval int() ni sinang, xato bersa float() ni"},
     {"order":2,"text":"try/except ni ichma-ich joylashtiring"}]'::jsonb,
   'medium', 8, 20, 1),
  (l1, 'Ikki nuqta orasidagi masofa',
   'To''rt qatorda ikki nuqtaning koordinatalari kiritiladi: x1, y1, x2, y2 (butun sonlar).
Ular orasidagi masofani 2 xonagacha yaxlitlab chiqaring.',
   'x1 = int(input())
y1 = int(input())
x2 = int(input())
y2 = int(input())
# Kodingizni shu yerga yozing',
   'x1 = int(input())
y1 = int(input())
x2 = int(input())
y2 = int(input())
print(f"{((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5:.2f}")', 'python',
   '[{"input":"0\n0\n3\n4","expected_output":"5.00","is_hidden":false},
     {"input":"1\n1\n1\n1","expected_output":"0.00","is_hidden":false},
     {"input":"-2\n-3\n1\n1","expected_output":"5.00","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Masofa = ildiz((x2-x1)² + (y2-y1)²)"},
     {"order":2,"text":"Ildiz uchun ** 0.5 yoki math.sqrt()"}]'::jsonb,
   'easy', 5, 15, 2);

  -- 2-lab
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (l2, 'Nima uchun s[0] = "X" xato beradi?', 'single',
   '[{"id":"a","text":"Matn o''zgarmas (immutable)","is_correct":true},
     {"id":"b","text":"Indeks 1 dan boshlanadi","is_correct":false},
     {"id":"c","text":"Faqat butun sonlar o''zgartiriladi","is_correct":false},
     {"id":"d","text":"X katta harf bo''lgani uchun","is_correct":false}]'::jsonb,
   'Matnni o''zgartirish uchun yangi matn yasaladi, masalan s = "X" + s[1:].', 1, 0),
  (l2, '"  Ali  ".strip() nima qaytaradi?', 'single',
   '[{"id":"a","text":"\"Ali\"","is_correct":true},{"id":"b","text":"\"  Ali  \"","is_correct":false},
     {"id":"c","text":"\"Ali  \"","is_correct":false},{"id":"d","text":"\"ali\"","is_correct":false}]'::jsonb,
   'strip() faqat chetdagi bo''shliqlarni olib tashlaydi, ichidagilarga tegmaydi.', 1, 1),
  (l2, '"a-b-c".split("-") nima qaytaradi?', 'single',
   '[{"id":"a","text":"\"abc\"","is_correct":false},{"id":"b","text":"[''a'', ''b'', ''c'']","is_correct":true},
     {"id":"c","text":"[''a-b-c'']","is_correct":false},{"id":"d","text":"3","is_correct":false}]'::jsonb,
   'Argument sifatida berilgan belgi ajratuvchi bo''lib xizmat qiladi.', 1, 2),
  (l2, 'Qaysi ifodalar "Python" dan "tho" ni ajratib oladi?', 'multiple',
   '[{"id":"a","text":"s[2:5]","is_correct":true},{"id":"b","text":"s[-4:-1]","is_correct":true},
     {"id":"c","text":"s[2:4]","is_correct":false},{"id":"d","text":"s[3:6]","is_correct":false}]'::jsonb,
   'P-0, y-1, t-2, h-3, o-4, n-5. "tho" indekslari 2, 3, 4 — ya''ni [2:5] yoki oxiridan [-4:-1].', 2, 3);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (l2, 'Bosh harflar (initsial)',
   'Bir qatorda to''liq ism kiritiladi (bir nechta so''z, bo''shliq bilan). Har bir so''zning bosh harfini olib, nuqta bilan ajratib chiqaring.
Masalan ali valiyev → A.V.',
   'toliq = input()
# Kodingizni shu yerga yozing',
   'toliq = input()
natija = ""
for soz in toliq.split():
    natija += soz[0].upper() + "."
print(natija)', 'python',
   '[{"input":"ali valiyev","expected_output":"A.V.","is_hidden":false},
     {"input":"dilnoza karimova qizi","expected_output":"D.K.Q.","is_hidden":false},
     {"input":"bekzod","expected_output":"B.","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"split() so''zlarga ajratadi"},
     {"order":2,"text":"Har so''zning [0] indeksini upper() qiling"}]'::jsonb,
   'medium', 8, 20, 0),
  (l2, 'Unli harflar sanog''i',
   'Bir qator matn kiritiladi (kichik lotin harflari va bo''shliqlar). Undagi unli harflar (a e i o u) sonini chiqaring.',
   'matn = input()
# Kodingizni shu yerga yozing',
   'matn = input()
soni = 0
for harf in matn:
    if harf in "aeiou":
        soni += 1
print(soni)', 'python',
   '[{"input":"salom dunyo","expected_output":"4","is_hidden":false},
     {"input":"python","expected_output":"1","is_hidden":false},
     {"input":"xyz","expected_output":"0","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Har bir harf bo''ylab yuring"},
     {"order":2,"text":"harf in \"aeiou\" tekshiruvi qulay"}]'::jsonb,
   'easy', 5, 15, 1),
  (l2, 'So''zlarni teskari tartibda',
   'Bir qatorda bir nechta so''z bo''shliq bilan kiritiladi. So''zlarni teskari tartibda, bitta bo''shliq bilan ajratib chiqaring.
Masalan men python o''rganaman → o''rganaman python men',
   'matn = input()
# Kodingizni shu yerga yozing',
   'matn = input()
sozlar = matn.split()
print(" ".join(sozlar[::-1]))', 'python',
   '[{"input":"men python o''rganaman","expected_output":"o''rganaman python men","is_hidden":false},
     {"input":"bir","expected_output":"bir","is_hidden":false},
     {"input":"a b c d","expected_output":"d c b a","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"split() bilan ro''yxatga aylantiring"},
     {"order":2,"text":"[::-1] teskari o''giradi, join() birlashtiradi"}]'::jsonb,
   'medium', 8, 20, 2);

  -- 3-lab
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (l3, 'a = [1,2,3], b = a, b.append(4). a nimaga teng?', 'single',
   '[{"id":"a","text":"[1, 2, 3]","is_correct":false},{"id":"b","text":"[1, 2, 3, 4]","is_correct":true},
     {"id":"c","text":"[4]","is_correct":false},{"id":"d","text":"Xato","is_correct":false}]'::jsonb,
   'b = a nusxa olmaydi. Nusxa uchun a.copy() yoki a[:] kerak.', 2, 0),
  (l3, 'sorted(a) va a.sort() farqi nimada?', 'single',
   '[{"id":"a","text":"sorted() yangi ro''yxat qaytaradi, sort() asl ro''yxatni o''zgartiradi","is_correct":true},
     {"id":"b","text":"Farqi yo''q","is_correct":false},
     {"id":"c","text":"sort() faqat sonlar uchun","is_correct":false},
     {"id":"d","text":"sorted() teskari tartiblaydi","is_correct":false}]'::jsonb,
   'a.sort() None qaytaradi — b = a.sort() yozish tipik xato.', 1, 1),
  (l3, 'enumerate() nima beradi?', 'single',
   '[{"id":"a","text":"Faqat elementlarni","is_correct":false},
     {"id":"b","text":"Indeks va elementni birgalikda","is_correct":true},
     {"id":"c","text":"Elementlar sonini","is_correct":false},
     {"id":"d","text":"Ro''yxatni tartiblaydi","is_correct":false}]'::jsonb,
   'for i, x in enumerate(a): — indeks ham kerak bo''lganda eng qulay usul.', 1, 2),
  (l3, 'Qaysi amallar ro''yxatning o''zini o''zgartiradi?', 'multiple',
   '[{"id":"a","text":"append()","is_correct":true},{"id":"b","text":"sort()","is_correct":true},
     {"id":"c","text":"sorted()","is_correct":false},{"id":"d","text":"reverse()","is_correct":true}]'::jsonb,
   'sorted() va [::-1] yangi ro''yxat yasaydi, qolganlari asl ro''yxatni o''zgartiradi.', 2, 3);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (l3, 'Juft sonlarni ajratish',
   'Birinchi qatorda sonlar soni, ikkinchisida sonlar bo''shliq bilan kiritiladi. Faqat juft sonlarni asl tartibida bitta qatorda chiqaring. Juft son bo''lmasa yoq deb yozing.',
   'n = int(input())
sonlar = list(map(int, input().split()))
# Kodingizni shu yerga yozing',
   'n = int(input())
sonlar = list(map(int, input().split()))
juftlar = []
for s in sonlar:
    if s % 2 == 0:
        juftlar.append(s)
if juftlar:
    print(*juftlar)
else:
    print("yoq")', 'python',
   '[{"input":"6\n1 2 3 4 5 6","expected_output":"2 4 6","is_hidden":false},
     {"input":"3\n1 3 5","expected_output":"yoq","is_hidden":false},
     {"input":"4\n0 -2 7 -4","expected_output":"0 -2 -4","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Yangi ro''yxatga faqat juftlarni to''plang"},
     {"order":2,"text":"print(*royxat) bo''shliq bilan chiqaradi"}]'::jsonb,
   'easy', 5, 15, 0),
  (l3, 'Ikkinchi eng katta son',
   'Birinchi qatorda sonlar soni (kamida 2 ta), ikkinchisida sonlar bo''shliq bilan kiritiladi. Ikkinchi eng katta turli qiymatni chiqaring. Agar barcha sonlar bir xil bo''lsa yoq deb yozing.',
   'n = int(input())
sonlar = list(map(int, input().split()))
# Kodingizni shu yerga yozing',
   'n = int(input())
sonlar = list(map(int, input().split()))
noyob = sorted(set(sonlar), reverse=True)
if len(noyob) >= 2:
    print(noyob[1])
else:
    print("yoq")', 'python',
   '[{"input":"5\n3 9 1 9 7","expected_output":"7","is_hidden":false},
     {"input":"3\n5 5 5","expected_output":"yoq","is_hidden":false},
     {"input":"4\n-1 -5 -3 -1","expected_output":"-3","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"set() takrorlarni tashlaydi"},
     {"order":2,"text":"sorted(..., reverse=True) kamayish tartibida beradi"}]'::jsonb,
   'medium', 8, 20, 1),
  (l3, 'Ro''yxatni aylantirish',
   'Birinchi qatorda sonlar soni n, ikkinchisida sonlar, uchinchisida siljish qadami k kiritiladi.
Ro''yxat elementlarini k pozitsiya o''ngga siljitib chiqaring. Oxiriga chiqib ketganlar boshiga qaytadi.
Masalan 1 2 3 4 5, k=2 → 4 5 1 2 3',
   'n = int(input())
sonlar = list(map(int, input().split()))
k = int(input())
# Kodingizni shu yerga yozing',
   'n = int(input())
sonlar = list(map(int, input().split()))
k = int(input()) % n
print(*(sonlar[-k:] + sonlar[:-k] if k else sonlar))', 'python',
   '[{"input":"5\n1 2 3 4 5\n2","expected_output":"4 5 1 2 3","is_hidden":false},
     {"input":"3\n1 2 3\n3","expected_output":"1 2 3","is_hidden":false},
     {"input":"4\n1 2 3 4\n5","expected_output":"4 1 2 3","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"k n dan katta bo''lishi mumkin — avval k % n qiling"},
     {"order":2,"text":"Kesish bilan yeching: sonlar[-k:] + sonlar[:-k]"},
     {"order":3,"text":"k = 0 holatini alohida qarang, aks holda [:-0] bo''sh chiqadi"}]'::jsonb,
   'hard', 12, 30, 2);

  -- 4-lab
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (l4, 'Pythonda qaysi qiymatlar yolg''on hisoblanadi?', 'multiple',
   '[{"id":"a","text":"0","is_correct":true},{"id":"b","text":"bo''sh ro''yxat []","is_correct":true},
     {"id":"c","text":"bo''sh matn \"\"","is_correct":true},{"id":"d","text":"-1","is_correct":false}]'::jsonb,
   '0, bo''sh ketma-ketliklar va None yolg''on. Noldan farqli har qanday son — rost.', 2, 0),
  (l4, 'elif o''rniga ketma-ket if yozilsa nima o''zgaradi?', 'single',
   '[{"id":"a","text":"Hech nima","is_correct":false},
     {"id":"b","text":"Barcha shartlar tekshiriladi va bir nechtasi bajarilishi mumkin","is_correct":true},
     {"id":"c","text":"Xato beradi","is_correct":false},
     {"id":"d","text":"Faqat oxirgisi bajariladi","is_correct":false}]'::jsonb,
   'elif zanjirida faqat bittasi bajariladi. Alohida if lar esa mustaqil tekshiriladi.', 2, 1),
  (l4, 'if x = 5: qanday xato beradi?', 'single',
   '[{"id":"a","text":"NameError","is_correct":false},{"id":"b","text":"SyntaxError","is_correct":true},
     {"id":"c","text":"TypeError","is_correct":false},{"id":"d","text":"Xato bermaydi","is_correct":false}]'::jsonb,
   'Shart ichida qiymat berish taqiqlangan — bu sintaksis xatosi. == yozilishi kerak.', 1, 2),
  (l4, 'not (a > 5) nimaga teng?', 'single',
   '[{"id":"a","text":"a < 5","is_correct":false},{"id":"b","text":"a <= 5","is_correct":true},
     {"id":"c","text":"a >= 5","is_correct":false},{"id":"d","text":"a != 5","is_correct":false}]'::jsonb,
   '"5 dan katta emas" degani "5 dan kichik yoki teng" demakdir — tenglik holatini unutmang.', 2, 3);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (l4, 'Kabisa yil',
   'Bir butun son — yil kiritiladi. Kabisa yil bo''lsa Kabisa, aks holda Kabisa emas deb chiqaring.
Qoida: 4 ga bo''linadi, lekin 100 ga bo''linsa 400 ga ham bo''linishi shart.',
   'yil = int(input())
# Kodingizni shu yerga yozing',
   'yil = int(input())
if yil % 4 == 0 and (yil % 100 != 0 or yil % 400 == 0):
    print("Kabisa")
else:
    print("Kabisa emas")', 'python',
   '[{"input":"2024","expected_output":"Kabisa","is_hidden":false},
     {"input":"1900","expected_output":"Kabisa emas","is_hidden":false},
     {"input":"2000","expected_output":"Kabisa","is_hidden":true},
     {"input":"2025","expected_output":"Kabisa emas","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Qavs qo''ying — and or dan oldin bajariladi"}]'::jsonb,
   'medium', 8, 20, 0),
  (l4, 'Chipta narxi',
   'Ikki qator kiritiladi: yo''lovchi yoshi (butun son) va ha/yoq — talaba ekani.
Narxni hisoblang va chiqaring:
7 yoshgacha — 0
60 yoshdan katta — 0
talaba — 5000
qolganlar — 10000
Shartlar yuqoridagi tartibda tekshiriladi.',
   'yosh = int(input())
talaba = input()
# Kodingizni shu yerga yozing',
   'yosh = int(input())
talaba = input()
if yosh < 7:
    print(0)
elif yosh > 60:
    print(0)
elif talaba == "ha":
    print(5000)
else:
    print(10000)', 'python',
   '[{"input":"5\nyoq","expected_output":"0","is_hidden":false},
     {"input":"20\nha","expected_output":"5000","is_hidden":false},
     {"input":"35\nyoq","expected_output":"10000","is_hidden":false},
     {"input":"65\nha","expected_output":"0","is_hidden":true},
     {"input":"7\nyoq","expected_output":"10000","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Shartlarni topshiriqdagi tartibda yozing"},
     {"order":2,"text":"7 yosh bepul emas — shart qat''iy kichik"}]'::jsonb,
   'medium', 8, 20, 1),
  (l4, 'Uchburchak turi',
   'Uch qatorda uchburchak tomonlari (butun sonlar) kiritiladi. Javob:
uchburchak mavjud bo''lmasa — Mavjud emas
uchala tomon teng — Teng tomonli
ikki tomon teng — Teng yonli
aks holda — Turli tomonli',
   'a = int(input())
b = int(input())
c = int(input())
# Kodingizni shu yerga yozing',
   'a = int(input())
b = int(input())
c = int(input())
if a + b <= c or a + c <= b or b + c <= a:
    print("Mavjud emas")
elif a == b == c:
    print("Teng tomonli")
elif a == b or b == c or a == c:
    print("Teng yonli")
else:
    print("Turli tomonli")', 'python',
   '[{"input":"3\n3\n3","expected_output":"Teng tomonli","is_hidden":false},
     {"input":"5\n5\n8","expected_output":"Teng yonli","is_hidden":false},
     {"input":"3\n4\n5","expected_output":"Turli tomonli","is_hidden":false},
     {"input":"1\n2\n10","expected_output":"Mavjud emas","is_hidden":true},
     {"input":"2\n2\n4","expected_output":"Mavjud emas","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Avval mavjudlikni tekshiring"},
     {"order":2,"text":"a == b == c zanjirli taqqoslash sifatida ishlaydi"}]'::jsonb,
   'hard', 12, 30, 2);

  -- 5-lab
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (l5, 'Evklid algoritmi (a, b = b, a % b) nima uchun to''xtaydi?', 'single',
   '[{"id":"a","text":"Qoldiq har qadamda kichrayadi va nihoyat 0 bo''ladi","is_correct":true},
     {"id":"b","text":"a har doim kamayadi","is_correct":false},
     {"id":"c","text":"Python 100 qadamdan keyin to''xtatadi","is_correct":false},
     {"id":"d","text":"To''xtamaydi","is_correct":false}]'::jsonb,
   'a % b har doim b dan kichik, shuning uchun ketma-ketlik kamayadi va nolga yetadi.', 2, 0),
  (l5, 'Bu sikl nechta son chiqaradi?
n = 8
while n > 1:
    n //= 2
    print(n)', 'single',
   '[{"id":"a","text":"2","is_correct":false},{"id":"b","text":"3","is_correct":true},
     {"id":"c","text":"4","is_correct":false},{"id":"d","text":"8","is_correct":false}]'::jsonb,
   '4, 2, 1 — uchta. Keyin shart yolg''on bo''ladi.', 1, 1),
  (l5, 'continue siklni to''xtatadimi?', 'single',
   '[{"id":"a","text":"Ha, to''xtatadi","is_correct":false},
     {"id":"b","text":"Yo''q, faqat joriy aylanishni tugatadi","is_correct":true},
     {"id":"c","text":"Faqat while da to''xtatadi","is_correct":false},
     {"id":"d","text":"Dasturni to''xtatadi","is_correct":false}]'::jsonb,
   'Siklni to''xtatish uchun break kerak.', 1, 2),
  (l5, 'Cheksiz siklning sabablari qaysilar?', 'multiple',
   '[{"id":"a","text":"Hisoblagich oshirilmagan","is_correct":true},
     {"id":"b","text":"while True ichida break yo''q","is_correct":true},
     {"id":"c","text":"Shart hech qachon yolg''on bo''lmaydi","is_correct":true},
     {"id":"d","text":"Sikl ichida print() bor","is_correct":false}]'::jsonb,
   'print() siklga ta''sir qilmaydi — u faqat chiqarish vositasi.', 2, 3);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (l5, 'EKUB (Evklid algoritmi)',
   'Ikki musbat butun son ikki qatorda kiritiladi. Ularning eng katta umumiy bo''luvchisini while sikli bilan toping. math.gcd() ishlatilmasin.',
   'a = int(input())
b = int(input())
# Kodingizni shu yerga yozing',
   'a = int(input())
b = int(input())
while b != 0:
    a, b = b, a % b
print(a)', 'python',
   '[{"input":"48\n18","expected_output":"6","is_hidden":false},
     {"input":"7\n5","expected_output":"1","is_hidden":false},
     {"input":"100\n25","expected_output":"25","is_hidden":true},
     {"input":"12\n12","expected_output":"12","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"b nolga aylanguncha takrorlang"},
     {"order":2,"text":"a, b = b, a % b — bir qatorda almashtiring"}]'::jsonb,
   'medium', 8, 20, 0),
  (l5, 'Mukammal son',
   'Bir musbat butun son kiritiladi. Uning barcha xos bo''luvchilari (o''zidan tashqari) yig''indisi songa teng bo''lsa Mukammal, aks holda Mukammal emas deb chiqaring.
Masalan 6 = 1 + 2 + 3 — mukammal son.',
   'n = int(input())
# Kodingizni shu yerga yozing',
   'n = int(input())
yigindi = 0
i = 1
while i < n:
    if n % i == 0:
        yigindi += i
    i += 1
if yigindi == n:
    print("Mukammal")
else:
    print("Mukammal emas")', 'python',
   '[{"input":"6","expected_output":"Mukammal","is_hidden":false},
     {"input":"28","expected_output":"Mukammal","is_hidden":false},
     {"input":"12","expected_output":"Mukammal emas","is_hidden":true},
     {"input":"1","expected_output":"Mukammal emas","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"1 dan n-1 gacha bo''luvchilarni qidiring"},
     {"order":2,"text":"n % i == 0 bo''lsa i ni yig''indiga qo''shing"}]'::jsonb,
   'medium', 8, 20, 1),
  (l5, 'Kollatz ketma-ketligi',
   'Bir musbat butun son kiritiladi. Quyidagi qoidani 1 ga yetguncha qo''llang va nechta qadam ketganini chiqaring:
son juft bo''lsa — 2 ga bo''ling;
toq bo''lsa — 3 ga ko''paytirib, 1 qo''shing.
Boshlang''ich son 1 bo''lsa javob 0.',
   'n = int(input())
qadam = 0
# Kodingizni shu yerga yozing',
   'n = int(input())
qadam = 0
while n != 1:
    if n % 2 == 0:
        n //= 2
    else:
        n = 3 * n + 1
    qadam += 1
print(qadam)', 'python',
   '[{"input":"6","expected_output":"8","is_hidden":false},
     {"input":"1","expected_output":"0","is_hidden":false},
     {"input":"7","expected_output":"16","is_hidden":true},
     {"input":"27","expected_output":"111","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Sikl sharti: n != 1"},
     {"order":2,"text":"Har aylanishda qadam hisoblagichini oshiring"}]'::jsonb,
   'hard', 12, 30, 2);

  -- 6-lab
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (l6, 'b = a.sort() dan keyin b nimaga teng?', 'single',
   '[{"id":"a","text":"Tartiblangan ro''yxat","is_correct":false},{"id":"b","text":"None","is_correct":true},
     {"id":"c","text":"Asl ro''yxat","is_correct":false},{"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'sort() joyida tartiblaydi va None qaytaradi. Yangi ro''yxat kerak bo''lsa sorted() ishlatiladi.', 2, 0),
  (l6, 'Funksiya ichida yaratilgan o''zgaruvchi qachon yo''qoladi?', 'single',
   '[{"id":"a","text":"Dastur tugaganda","is_correct":false},
     {"id":"b","text":"Funksiya bajarilib bo''lgach","is_correct":true},
     {"id":"c","text":"Hech qachon","is_correct":false},
     {"id":"d","text":"return chaqirilmasa","is_correct":false}]'::jsonb,
   'Lokal o''zgaruvchi funksiya tugashi bilan xotiradan chiqadi.', 1, 1),
  (l6, 'def f(): return nima qaytaradi?', 'single',
   '[{"id":"a","text":"0","is_correct":false},{"id":"b","text":"None","is_correct":true},
     {"id":"c","text":"Bo''sh matn","is_correct":false},{"id":"d","text":"Xato","is_correct":false}]'::jsonb,
   'Qiymatsiz return — funksiyadan chiqish, natija None bo''ladi.', 1, 2),
  (l6, 'Masalani funksiyalarga bo''lish nima uchun foydali?', 'multiple',
   '[{"id":"a","text":"Har bir qismni alohida sinash mumkin","is_correct":true},
     {"id":"b","text":"Kod takrorlanmaydi","is_correct":true},
     {"id":"c","text":"Xotira sarfi doim kamayadi","is_correct":false},
     {"id":"d","text":"Xatoni topish osonlashadi","is_correct":true}]'::jsonb,
   'Funksiya chaqiruvi kichik qo''shimcha xarajat talab qiladi — asosiy foyda tartib va sinovda.', 2, 3);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (l6, 'Tub sonlar ro''yxati',
   'tubmi(n) funksiyasini yozing. Birinchi qatorda n kiritiladi; 2 dan n gacha bo''lgan barcha tub sonlarni bitta qatorda bo''shliq bilan chiqaring.
Tub son bo''lmasa yoq deb yozing.',
   'def tubmi(n):
    # Kodingizni shu yerga yozing
    pass

n = int(input())
natija = [str(x) for x in range(2, n + 1) if tubmi(x)]
print(" ".join(natija) if natija else "yoq")',
   'def tubmi(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True

n = int(input())
natija = [str(x) for x in range(2, n + 1) if tubmi(x)]
print(" ".join(natija) if natija else "yoq")', 'python',
   '[{"input":"10","expected_output":"2 3 5 7","is_hidden":false},
     {"input":"1","expected_output":"yoq","is_hidden":false},
     {"input":"20","expected_output":"2 3 5 7 11 13 17 19","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"2 dan kichik sonlar tub emas"},
     {"order":2,"text":"Bo''luvchini ildizgacha tekshirish yetarli: while i * i <= n"}]'::jsonb,
   'medium', 8, 20, 0),
  (l6, 'Raqamlar yig''indisi funksiyasi',
   'raqamlar_yigindisi(n) funksiyasini yozing — u sonning raqamlari yig''indisini qaytarsin.
Birinchi qatorda sonlar soni, ikkinchisida sonlar bo''shliq bilan kiritiladi. Har bir son uchun raqamlar yig''indisini bitta qatorda bo''shliq bilan chiqaring.',
   'def raqamlar_yigindisi(n):
    # Kodingizni shu yerga yozing
    pass

k = int(input())
sonlar = list(map(int, input().split()))
print(*[raqamlar_yigindisi(s) for s in sonlar])',
   'def raqamlar_yigindisi(n):
    jami = 0
    while n > 0:
        jami += n % 10
        n //= 10
    return jami

k = int(input())
sonlar = list(map(int, input().split()))
print(*[raqamlar_yigindisi(s) for s in sonlar])', 'python',
   '[{"input":"3\n472 19 5","expected_output":"13 10 5","is_hidden":false},
     {"input":"2\n100 999","expected_output":"1 27","is_hidden":false},
     {"input":"1\n1","expected_output":"1","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"% 10 oxirgi raqamni, // 10 qolganini beradi"},
     {"order":2,"text":"Natijani return qiling, print qilmang"}]'::jsonb,
   'medium', 8, 20, 1),
  (l6, 'Matn statistikasi',
   'Uchta funksiya yozing: sozlar_soni(m), eng_uzun_soz(m), harflar_soni(m) (bo''shliqsiz belgilar soni).
Bir qator matn kiritiladi. Uch qatorda mos natijalarni chiqaring.
Bir nechta so''z eng uzun bo''lsa, birinchisini chiqaring.',
   'def sozlar_soni(m):
    pass

def eng_uzun_soz(m):
    pass

def harflar_soni(m):
    pass

matn = input()
print(sozlar_soni(matn))
print(eng_uzun_soz(matn))
print(harflar_soni(matn))',
   'def sozlar_soni(m):
    return len(m.split())

def eng_uzun_soz(m):
    return max(m.split(), key=len)

def harflar_soni(m):
    return len(m.replace(" ", ""))

matn = input()
print(sozlar_soni(matn))
print(eng_uzun_soz(matn))
print(harflar_soni(matn))', 'python',
   '[{"input":"men python tilini organaman","expected_output":"4\norganaman\n24","is_hidden":false},
     {"input":"salom","expected_output":"1\nsalom\n5","is_hidden":false},
     {"input":"a bb ccc","expected_output":"3\nccc\n6","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"split() so''zlar ro''yxatini beradi"},
     {"order":2,"text":"max(royxat, key=len) eng uzun elementni qaytaradi"},
     {"order":3,"text":"replace(\" \", \"\") bo''shliqlarni olib tashlaydi"}]'::jsonb,
   'medium', 8, 20, 2);

END $$;
