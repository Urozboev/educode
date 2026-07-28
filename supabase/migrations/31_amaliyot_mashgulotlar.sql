-- ============================================
-- EduCode — "Dasturlash asoslari (Amaliyot)" kursi
-- Fan dasturi III bo'limi: 6 ta amaliy mashg'ulot
--
-- Har bir mashg'ulot: yechilgan namunalar + 3-4 ta topshiriq + 5 ta test
-- Topshiriqlar stdin → stdout tartibida ishlaydi.
-- Qayta ishga tushirilsa dublikat yaratmaydi.
-- ============================================

DO $$
DECLARE
  v_course UUID;
  a1 UUID; a2 UUID; a3 UUID; a4 UUID; a5 UUID; a6 UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-amaliyot';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: dasturlash-asoslari-amaliyot';
  END IF;

  -- ============================================
  -- 1-AMALIY MASHG'ULOT: Python tili sintaksisi
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, '1-amaliy mashg''ulot: Python tili sintaksisi', 'amaliy-1-sintaksis',
    $html$
<h2>Mashg'ulot maqsadi</h2>
<p>Dastur tuzilishini amalda mustahkamlash: <code>input()</code> bilan ma'lumot olish, <code>print()</code> bilan chiqarish, chekinish qoidasiga rioya qilish va turlarni to'g'ri aylantirish.</p>

<h3>Namuna 1. Ma'lumot olish va chiqarish</h3>
<pre><code>ism = input()
yosh = int(input())
print(f"{ism} — {yosh} yoshda")</code></pre>
<p>Bu yerda ikki muhim nuqta bor: <code>input()</code> matn qaytaradi, shuning uchun yosh <code>int()</code> bilan aylantirildi; natija esa f-string orqali birlashtirildi.</p>

<h3>Namuna 2. Bir qatordagi bir nechta qiymat</h3>
<pre><code>a, b = input().split()
print(b, a)</code></pre>
<p><code>split()</code> qatorni bo'shliqlar bo'yicha bo'laklarga ajratadi. Sonlar kerak bo'lsa:</p>
<pre><code>a, b = map(int, input().split())
print(a + b)</code></pre>

<h3>Namuna 3. sep va end bilan chiqarish shaklini boshqarish</h3>
<pre><code>print(2026, 7, 28, sep="-")     # 2026-7-28
print("Yuklanmoqda", end="")
print("...")                     # Yuklanmoqda...</code></pre>

<h3>Namuna 4. Chekinish xatosi</h3>
<pre><code># XATO
if 5 &gt; 3:
print("salom")      # IndentationError

# TO'G'RI
if 5 &gt; 3:
    print("salom")</code></pre>

<h3>Ish tartibi</h3>
<ol>
  <li>Har bir namunani o'zingiz yozib chiqing, ko'chirib qo'ymang</li>
  <li>Namunani ataylab buzib ko'ring va chiqqan xatoni o'qing</li>
  <li>Quyidagi topshiriqlarni bajaring</li>
</ol>
$html$,
    1, 10, 25, 80, true, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO a1;
  IF a1 IS NULL THEN SELECT id INTO a1 FROM topics WHERE course_id = v_course AND slug = 'amaliy-1-sintaksis'; END IF;

  -- ============================================
  -- 2-AMALIY: Xatoliklar bilan ishlash
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '2-amaliy mashg''ulot: Xatoliklarni topish va tuzatish', 'amaliy-2-xatoliklar',
    $html$
<h2>Mashg'ulot maqsadi</h2>
<p>Xato xabarini o'qishni, xato turini aniqlashni va sababini topishni mashq qilish.</p>

<h3>Xato turlari qisqacha</h3>
<table>
  <tr><th>Xato</th><th>Sabab</th></tr>
  <tr><td><code>SyntaxError</code></td><td>Grammatik qoida buzilgan: ikki nuqta, qavs, tirnoq yetishmaydi</td></tr>
  <tr><td><code>IndentationError</code></td><td>Chekinish noto'g'ri</td></tr>
  <tr><td><code>NameError</code></td><td>Nom aniqlanmagan yoki xato yozilgan</td></tr>
  <tr><td><code>TypeError</code></td><td>Turlar mos emas: matn + son</td></tr>
  <tr><td><code>ValueError</code></td><td>Tur to'g'ri, qiymat noto'g'ri: <code>int("abc")</code></td></tr>
  <tr><td><code>ZeroDivisionError</code></td><td>Nolga bo'lish</td></tr>
  <tr><td><code>IndexError</code></td><td>Ro'yxatda yo'q indeks</td></tr>
  <tr><td><code>KeyError</code></td><td>Lug'atda yo'q kalit</td></tr>
</table>

<h3>Namuna 1. Xatoni topish</h3>
<pre><code>son = input()
print(son * 2)</code></pre>
<p>Xato chiqmaydi, lekin <code>5</code> kiritilsa <code>55</code> chiqadi — matn ikki marta takrorlandi. Bu <b>mantiqiy xato</b>. To'g'risi: <code>son = int(input())</code>.</p>

<h3>Namuna 2. Xatoni ushlab qolish</h3>
<pre><code>try:
    son = int(input())
    print(100 / son)
except ValueError:
    print("Son kiriting")
except ZeroDivisionError:
    print("Nolga bo'lib bo'lmaydi")</code></pre>
<p><code>try</code> ichidagi kod xato bersa, dastur to'xtamaydi — mos <code>except</code> bloki ishlaydi.</p>

<h3>Namuna 3. print() bilan tekshirish</h3>
<pre><code>a = int(input())
b = int(input())
print("a =", a, "b =", b)   # tekshiruv uchun
print((a + b) / 2)</code></pre>
<p>Natija kutilganidek chiqmasa, avval kirish qiymatlarini chiqarib ko'ring — xatoning yarmi shu yerda topiladi.</p>
$html$,
    2, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO a2;
  IF a2 IS NULL THEN SELECT id INTO a2 FROM topics WHERE course_id = v_course AND slug = 'amaliy-2-xatoliklar'; END IF;

  -- ============================================
  -- 3-AMALIY: For va while operatorlari
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '3-amaliy mashg''ulot: For va While operatorlari', 'amaliy-3-sikllar',
    $html$
<h2>Mashg'ulot maqsadi</h2>
<p>Ikkala sikl turini amalda taqqoslash va qaysi masalada qaysi biri qulayroq ekanini his qilish.</p>

<h3>Namuna 1. range() ning uch ko'rinishi</h3>
<pre><code>for i in range(5):        # 0 1 2 3 4
    print(i, end=" ")
print()

for i in range(1, 6):     # 1 2 3 4 5
    print(i, end=" ")
print()

for i in range(10, 0, -2):# 10 8 6 4 2
    print(i, end=" ")</code></pre>
<p>Uchinchi argument — qadam. Manfiy qadam teskari sanashni beradi.</p>

<h3>Namuna 2. Yig'indi va ko'paytma</h3>
<pre><code>jami = 0
for i in range(1, 101):
    jami += i
print(jami)          # 5050

kopaytma = 1
for i in range(1, 6):
    kopaytma *= i
print(kopaytma)      # 120 (5!)</code></pre>
<p>Diqqat: yig'indi <code>0</code> dan, ko'paytma esa <code>1</code> dan boshlanadi.</p>

<h3>Namuna 3. Bir xil masala — ikki yechim</h3>
<pre><code># for bilan
for i in range(1, 6):
    print(i)

# while bilan
i = 1
while i &lt;= 5:
    print(i)
    i += 1</code></pre>
<p>Takrorlar soni ma'lum bo'lgani uchun bu yerda <code>for</code> qulayroq — <code>while</code> da hisoblagichni qo'lda boshqarish kerak va uni unutish cheksiz siklga olib keladi.</p>

<h3>Namuna 4. Ichma-ich sikl</h3>
<pre><code>for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}x{j}={i*j}", end="  ")
    print()</code></pre>
<p>Tashqi sikl bir marta aylanganda, ichki sikl to'liq aylanib chiqadi.</p>
$html$,
    3, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO a3;
  IF a3 IS NULL THEN SELECT id INTO a3 FROM topics WHERE course_id = v_course AND slug = 'amaliy-3-sikllar'; END IF;

  -- ============================================
  -- 4-AMALIY: Shartlar va tarmoqlanish
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '4-amaliy mashg''ulot: Shartlar va tarmoqlanish', 'amaliy-4-shartlar',
    $html$
<h2>Mashg'ulot maqsadi</h2>
<p>Ko'p tarmoqli masalalarni to'g'ri tuzish, shartlar tartibini va mantiqiy operatorlarni amalda qo'llash.</p>

<h3>Namuna 1. Uch sondan eng kattasi</h3>
<pre><code>a, b, c = map(int, input().split())

if a &gt;= b and a &gt;= c:
    print(a)
elif b &gt;= a and b &gt;= c:
    print(b)
else:
    print(c)</code></pre>
<p>Qisqaroq yo'l ham bor: <code>print(max(a, b, c))</code>. Lekin shart tuzishni mashq qilish uchun birinchi variant foydali.</p>

<h3>Namuna 2. Chorakni aniqlash</h3>
<pre><code>x, y = map(int, input().split())

if x == 0 or y == 0:
    print("O'qda")
elif x &gt; 0 and y &gt; 0:
    print("I chorak")
elif x &lt; 0 and y &gt; 0:
    print("II chorak")
elif x &lt; 0 and y &lt; 0:
    print("III chorak")
else:
    print("IV chorak")</code></pre>
<p>Muhim: chegaraviy holat (o'qda yotish) <b>birinchi</b> tekshiriladi, aks holda u boshqa shartlarga tushib ketadi.</p>

<h3>Namuna 3. Kabisa yil</h3>
<pre><code>yil = int(input())
if yil % 4 == 0 and (yil % 100 != 0 or yil % 400 == 0):
    print("Kabisa")
else:
    print("Kabisa emas")</code></pre>
<p>Qavs shart — usiz <code>and</code> va <code>or</code> tartibi natijani buzadi.</p>

<h3>Xatolardan saqlanish</h3>
<ul>
  <li>Shartlarni <b>qat'iydan yumshoqqa</b> tartibda yozing</li>
  <li><code>=</code> emas, <code>==</code> ishlating</li>
  <li>Chegaraviy qiymatlarni alohida sinab ko'ring: 0, eng kichik va eng katta ruxsat etilgan qiymat</li>
</ul>
$html$,
    4, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO a4;
  IF a4 IS NULL THEN SELECT id INTO a4 FROM topics WHERE course_id = v_course AND slug = 'amaliy-4-shartlar'; END IF;

  -- ============================================
  -- 5-AMALIY: While sikliga doir misollar
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '5-amaliy mashg''ulot: While sikliga doir misollar', 'amaliy-5-while',
    $html$
<h2>Mashg'ulot maqsadi</h2>
<p>Takrorlar soni oldindan noma'lum bo'lgan masalalarni yechish: to'xtatuvchi belgi, hisoblagich, raqamlar bilan ishlash.</p>

<h3>Namuna 1. To'xtatuvchi belgigacha o'qish</h3>
<pre><code>soni = 0
son = int(input())
while son != -1:
    soni += 1
    son = int(input())
print(soni)</code></pre>
<p>Bu yerda <code>-1</code> — to'xtatuvchi belgi. U hisobga kirmaydi.</p>

<h3>Namuna 2. Raqamlar bilan ishlash</h3>
<pre><code>son = int(input())
soni = 0
while son &gt; 0:
    son //= 10
    soni += 1
print(soni)          # raqamlar soni</code></pre>
<p>Har qadamda son 10 marta kichrayadi. 472 uchun: 472 → 47 → 4 → 0, ya'ni 3 ta raqam.</p>

<h3>Namuna 3. Fibonachchi sonlari</h3>
<pre><code>n = int(input())
a, b = 0, 1
while a &lt;= n:
    print(a, end=" ")
    a, b = b, a + b</code></pre>
<p><code>a, b = b, a + b</code> — ikkala qiymat <b>bir vaqtda</b> yangilanadi. Alohida yozilsa natija buziladi.</p>

<h3>Namuna 4. break bilan chiqish</h3>
<pre><code>while True:
    son = int(input())
    if son &lt; 0:
        break
    print(son * son)</code></pre>

<h3>Cheksiz sikldan qanday saqlanish kerak</h3>
<ol>
  <li>Shartda qatnashadigan o'zgaruvchi sikl ichida o'zgaryaptimi?</li>
  <li>O'zgarish shartni yolg'onga <b>yaqinlashtiryaptimi</b>?</li>
  <li><code>while True</code> ichida <code>break</code> ga yo'l bormi?</li>
</ol>
$html$,
    5, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO a5;
  IF a5 IS NULL THEN SELECT id INTO a5 FROM topics WHERE course_id = v_course AND slug = 'amaliy-5-while'; END IF;

  -- ============================================
  -- 6-AMALIY: Funksiyalarni e'lon qilish va aniqlash
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '6-amaliy mashg''ulot: Funksiyalarni e''lon qilish va aniqlash', 'amaliy-6-funksiyalar',
    $html$
<h2>Mashg'ulot maqsadi</h2>
<p>Masalani mustaqil funksiyalarga bo'lib yechishni o'rganish, <code>return</code> ni to'g'ri ishlatish.</p>

<h3>Namuna 1. Funksiya — qayta ishlatiladigan kod</h3>
<pre><code>def toqmi(n):
    return n % 2 == 1

for son in [3, 8, 11]:
    if toqmi(son):
        print(son, "toq")</code></pre>
<p>Taqqoslash natijasi allaqachon <code>True</code> yoki <code>False</code>, shuning uchun <code>if ... return True else return False</code> yozish ortiqcha.</p>

<h3>Namuna 2. Bir nechta funksiya birgalikda</h3>
<pre><code>def kvadrat(x):
    return x * x

def yigindi_kvadratlar(sonlar):
    jami = 0
    for s in sonlar:
        jami += kvadrat(s)
    return jami

print(yigindi_kvadratlar([1, 2, 3]))   # 14</code></pre>
<p>Funksiya boshqa funksiyani chaqirishi mumkin — katta masalani shu tarzda kichik qismlarga bo'linadi.</p>

<h3>Namuna 3. Sukut qiymat va nomli argument</h3>
<pre><code>def salomlash(ism, salom="Salom"):
    return f"{salom}, {ism}!"

print(salomlash("Ali"))
print(salomlash("Ali", salom="Xayrli kun"))</code></pre>

<h3>Namuna 4. Ikki qiymat qaytarish</h3>
<pre><code>def bol_qoldiq(a, b):
    return a // b, a % b

butun, qoldiq = bol_qoldiq(17, 5)
print(butun, qoldiq)      # 3 2</code></pre>

<h3>Nazorat savollari</h3>
<ol>
  <li><code>def</code> qatorining o'zi kodni ishga tushiradimi?</li>
  <li><code>return</code> siz funksiya nima qaytaradi?</li>
  <li>Funksiya ichidagi o'zgaruvchiga tashqaridan murojaat qilib bo'ladimi?</li>
</ol>
$html$,
    6, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, is_published = true
  RETURNING id INTO a6;
  IF a6 IS NULL THEN SELECT id INTO a6 FROM topics WHERE course_id = v_course AND slug = 'amaliy-6-funksiyalar'; END IF;

  -- ============================================
  -- TESTLAR VA TOPSHIRIQLAR
  -- ============================================
  DELETE FROM quizzes WHERE topic_id IN (a1, a2, a3, a4, a5, a6);
  DELETE FROM topic_tasks WHERE topic_id IN (a1, a2, a3, a4, a5, a6);

  -- 1-amaliy
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (a1, '<code>a, b = input().split()</code> dan keyin <code>a</code> qanday turda bo''ladi?', 'single',
   '[{"id":"a","text":"int","is_correct":false},{"id":"b","text":"str","is_correct":true},
     {"id":"c","text":"list","is_correct":false},{"id":"d","text":"float","is_correct":false}]'::jsonb,
   'split() matn bo''laklarini qaytaradi. Son kerak bo''lsa map(int, ...) ishlatiladi.', 1, 0),
  (a1, 'Bir qatordagi ikki sonni o''qishning to''g''ri yo''li qaysi?', 'single',
   '[{"id":"a","text":"a, b = map(int, input().split())","is_correct":true},
     {"id":"b","text":"a, b = int(input())","is_correct":false},
     {"id":"c","text":"a, b = input()","is_correct":false},
     {"id":"d","text":"a = b = int(input())","is_correct":false}]'::jsonb,
   'map(int, ...) har bir bo''lakni songa aylantiradi.', 1, 1),
  (a1, '<code>print("a", "b", sep="")</code> nima chiqaradi?', 'single',
   '[{"id":"a","text":"a b","is_correct":false},{"id":"b","text":"ab","is_correct":true},
     {"id":"c","text":"a,b","is_correct":false},{"id":"d","text":"Xato","is_correct":false}]'::jsonb,
   'Bo''sh ajratuvchi — qiymatlar yopishib chiqadi.', 1, 2),
  (a1, 'Chekinish uchun necha bo''shliq tavsiya etiladi?', 'single',
   '[{"id":"a","text":"1","is_correct":false},{"id":"b","text":"2","is_correct":false},
     {"id":"c","text":"4","is_correct":true},{"id":"d","text":"8","is_correct":false}]'::jsonb,
   'PEP 8 uslub qo''llanmasi 4 ta bo''shliqni tavsiya qiladi.', 1, 3),
  (a1, 'Qaysi kodlar xatosiz ishlaydi?', 'multiple',
   '[{"id":"a","text":"print(3 + 4)","is_correct":true},
     {"id":"b","text":"print(\"3\" + 4)","is_correct":false},
     {"id":"c","text":"print(\"3\" + \"4\")","is_correct":true},
     {"id":"d","text":"print(int(\"3\") + 4)","is_correct":true}]'::jsonb,
   'Matn bilan sonni to''g''ridan-to''g''ri qo''shib bo''lmaydi — TypeError chiqadi.', 2, 4);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (a1, 'Ikki sonning yig''indisi',
   'Bir qatorda bo''shliq bilan ajratilgan ikki butun son kiritiladi. Ularning yig''indisini chiqaring.',
   'a, b = map(int, input().split())
# Kodingizni shu yerga yozing',
   'a, b = map(int, input().split())
print(a + b)', 'python',
   '[{"input":"3 5","expected_output":"8","is_hidden":false},
     {"input":"-2 10","expected_output":"8","is_hidden":false},
     {"input":"0 0","expected_output":"0","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"map(int, input().split()) ikkala sonni birdan o''qiydi"}]'::jsonb,
   'easy', 5, 15, 0),
  (a1, 'Vizitka',
   'Uch qator kiritiladi: ism, kasb, shahar. Ularni bitta qatorda vergul va bo''shliq bilan ajratib chiqaring.<br>Masalan: <code>Ali, dasturchi, Guliston</code>',
   'ism = input()
kasb = input()
shahar = input()
# Kodingizni shu yerga yozing',
   'ism = input()
kasb = input()
shahar = input()
print(ism, kasb, shahar, sep=", ")', 'python',
   '[{"input":"Ali\ndasturchi\nGuliston","expected_output":"Ali, dasturchi, Guliston","is_hidden":false},
     {"input":"Dilnoza\no''qituvchi\nSirdaryo","expected_output":"Dilnoza, o''qituvchi, Sirdaryo","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"sep parametridan foydalaning: sep=\", \""}]'::jsonb,
   'easy', 5, 15, 1),
  (a1, 'To''g''ri to''rtburchak',
   'Ikki qatorda to''rtburchakning eni va bo''yi (butun sonlar) kiritiladi. Birinchi qatorda yuzasini, ikkinchisida perimetrini chiqaring.',
   'en = int(input())
boy = int(input())
# Kodingizni shu yerga yozing',
   'en = int(input())
boy = int(input())
print(en * boy)
print(2 * (en + boy))', 'python',
   '[{"input":"3\n4","expected_output":"12\n14","is_hidden":false},
     {"input":"5\n5","expected_output":"25\n20","is_hidden":false},
     {"input":"1\n10","expected_output":"10\n22","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Yuza = en * bo''y"},{"order":2,"text":"Perimetr = 2 * (en + bo''y)"}]'::jsonb,
   'easy', 5, 15, 2);

  -- 2-amaliy
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (a2, '<code>int("12a")</code> qanday xato beradi?', 'single',
   '[{"id":"a","text":"TypeError","is_correct":false},{"id":"b","text":"ValueError","is_correct":true},
     {"id":"c","text":"SyntaxError","is_correct":false},{"id":"d","text":"NameError","is_correct":false}]'::jsonb,
   'Argument turi to''g''ri (matn), lekin qiymatni songa aylantirib bo''lmaydi.', 1, 0),
  (a2, '<code>try</code> bloki nima uchun kerak?', 'single',
   '[{"id":"a","text":"Kodni tezlashtirish uchun","is_correct":false},
     {"id":"b","text":"Xato yuz berganda dastur to''xtab qolmasligi uchun","is_correct":true},
     {"id":"c","text":"Xatolarni butunlay yo''qotish uchun","is_correct":false},
     {"id":"d","text":"Sikl tuzish uchun","is_correct":false}]'::jsonb,
   'try/except xatoni ushlab qoladi va nima qilishni belgilash imkonini beradi.', 1, 1),
  (a2, 'Ro''yxatda mavjud bo''lmagan indeksga murojaat qanday xato beradi?', 'single',
   '[{"id":"a","text":"KeyError","is_correct":false},{"id":"b","text":"IndexError","is_correct":true},
     {"id":"c","text":"ValueError","is_correct":false},{"id":"d","text":"TypeError","is_correct":false}]'::jsonb,
   'IndexError — ro''yxat/matn uchun, KeyError — lug''at uchun.', 1, 2),
  (a2, 'Mantiqiy xatoni qanday aniqlaymiz?', 'single',
   '[{"id":"a","text":"Python xato xabari beradi","is_correct":false},
     {"id":"b","text":"Natijani qo''lda hisoblangan javob bilan solishtirib","is_correct":true},
     {"id":"c","text":"Dastur ishga tushmaydi","is_correct":false},
     {"id":"d","text":"Kod rangi o''zgaradi","is_correct":false}]'::jsonb,
   'Mantiqiy xatoda Python hech narsa demaydi — faqat sinov ma''lumotlari uni ochib beradi.', 1, 3),
  (a2, 'Qaysi qatorlar SyntaxError beradi?', 'multiple',
   '[{"id":"a","text":"if x &gt; 5","is_correct":true},
     {"id":"b","text":"print(\"salom\"","is_correct":true},
     {"id":"c","text":"x = 5","is_correct":false},
     {"id":"d","text":"for i in range(3)","is_correct":true}]'::jsonb,
   'Yetishmayotgan ikki nuqta va yopilmagan qavs — sintaksis xatolari.', 2, 4);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (a2, 'Xavfsiz bo''lish',
   'Ikki qatorda son kiritiladi. Birinchisini ikkinchisiga bo''ling va 2 xonagacha yaxlitlab chiqaring. Bo''luvchi 0 bo''lsa <code>xato</code> deb yozing.',
   'a = int(input())
b = int(input())
# Kodingizni shu yerga yozing',
   'a = int(input())
b = int(input())
try:
    print(f"{a / b:.2f}")
except ZeroDivisionError:
    print("xato")', 'python',
   '[{"input":"10\n4","expected_output":"2.50","is_hidden":false},
     {"input":"5\n0","expected_output":"xato","is_hidden":false},
     {"input":"7\n7","expected_output":"1.00","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"try/except ZeroDivisionError yoki oddiy if b == 0 tekshiruvi"}]'::jsonb,
   'easy', 5, 15, 0),
  (a2, 'Xatoni tuzating: kvadratlar yig''indisi',
   'Quyidagi kod 1 dan n gacha sonlar kvadratlari yig''indisini hisoblashi kerak, lekin ikkita xato bor. Toping va tuzating.',
   'n = int(input())
jami = 0
for i in range(n):
    jami = i * i
print(jami)',
   'n = int(input())
jami = 0
for i in range(1, n + 1):
    jami += i * i
print(jami)', 'python',
   '[{"input":"3","expected_output":"14","is_hidden":false},
     {"input":"1","expected_output":"1","is_hidden":false},
     {"input":"5","expected_output":"55","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"range(n) 0 dan n-1 gacha beradi — bizga 1 dan n gacha kerak"},
     {"order":2,"text":"jami = ... o''rniga jami += ... yozilishi kerak"}]'::jsonb,
   'medium', 8, 20, 1),
  (a2, 'Kirishni tekshirish',
   'Bir qator kiritiladi. Agar u butun son bo''lsa, uning kvadratini chiqaring. Aks holda <code>son emas</code> deb yozing.<br>Manfiy sonlar ham son hisoblanadi.',
   'qator = input()
# Kodingizni shu yerga yozing',
   'qator = input()
try:
    son = int(qator)
    print(son * son)
except ValueError:
    print("son emas")', 'python',
   '[{"input":"7","expected_output":"49","is_hidden":false},
     {"input":"salom","expected_output":"son emas","is_hidden":false},
     {"input":"-4","expected_output":"16","is_hidden":true},
     {"input":"3.5","expected_output":"son emas","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"isdigit() manfiy sonlarni tanimaydi — try/except ishlating"}]'::jsonb,
   'medium', 8, 20, 2);

  -- 3-amaliy
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (a3, '<code>range(10, 0, -2)</code> nechta son beradi?', 'single',
   '[{"id":"a","text":"4","is_correct":false},{"id":"b","text":"5","is_correct":true},
     {"id":"c","text":"6","is_correct":false},{"id":"d","text":"0","is_correct":false}]'::jsonb,
   '10, 8, 6, 4, 2 — 5 ta. 0 kirmaydi.', 1, 0),
  (a3, 'Ko''paytma hisoblaganda boshlang''ich qiymat qanday bo''lishi kerak?', 'single',
   '[{"id":"a","text":"0","is_correct":false},{"id":"b","text":"1","is_correct":true},
     {"id":"c","text":"Birinchi element","is_correct":false},{"id":"d","text":"Ahamiyatsiz","is_correct":false}]'::jsonb,
   '0 dan boshlansa natija har doim 0 chiqadi. Ko''paytma uchun neytral element — 1.', 1, 1),
  (a3, 'Ichma-ich siklda tashqi sikl 3, ichki sikl 4 marta aylansa, ichki blok necha marta bajariladi?', 'single',
   '[{"id":"a","text":"7","is_correct":false},{"id":"b","text":"12","is_correct":true},
     {"id":"c","text":"4","is_correct":false},{"id":"d","text":"3","is_correct":false}]'::jsonb,
   '3 x 4 = 12. Tashqi siklning har aylanishida ichki sikl to''liq aylanadi.', 1, 2),
  (a3, 'Qaysi holatda <code>for</code> emas, <code>while</code> tanlanadi?', 'single',
   '[{"id":"a","text":"Ro''yxat elementlarini ko''rib chiqishda","is_correct":false},
     {"id":"b","text":"Foydalanuvchi to''xtatuvchi belgi kiritguncha o''qishda","is_correct":true},
     {"id":"c","text":"Aniq 100 marta takrorlashda","is_correct":false},
     {"id":"d","text":"Matn belgilarini ko''rib chiqishda","is_correct":false}]'::jsonb,
   'Takrorlar soni oldindan noma''lum bo''lgan holat — while uchun.', 1, 3),
  (a3, '<code>for i in range(3): print(i, end=" ")</code> nima chiqaradi?', 'single',
   '[{"id":"a","text":"0 1 2","is_correct":true},{"id":"b","text":"1 2 3","is_correct":false},
     {"id":"c","text":"0 1 2 3","is_correct":false},{"id":"d","text":"3","is_correct":false}]'::jsonb,
   'range(3) 0 dan boshlanadi va 3 ni o''z ichiga olmaydi.', 1, 4);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (a3, 'Faktorial',
   'Bir butun son <code>n</code> (1 dan 15 gacha) kiritiladi. Uning faktorialini (<code>n!</code>) chiqaring.',
   'n = int(input())
natija = 1
# Kodingizni shu yerga yozing',
   'n = int(input())
natija = 1
for i in range(1, n + 1):
    natija *= i
print(natija)', 'python',
   '[{"input":"5","expected_output":"120","is_hidden":false},
     {"input":"1","expected_output":"1","is_hidden":false},
     {"input":"10","expected_output":"3628800","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"natija 1 dan boshlanadi"},{"order":2,"text":"for i in range(1, n+1): natija *= i"}]'::jsonb,
   'easy', 5, 15, 0),
  (a3, 'Yulduzchali uchburchak',
   'Bir butun son <code>n</code> kiritiladi. <code>n</code> qatorli yulduzcha uchburchagini chizing: 1-qatorda 1 ta, 2-qatorda 2 ta yulduzcha va hokazo.',
   'n = int(input())
# Kodingizni shu yerga yozing',
   'n = int(input())
for i in range(1, n + 1):
    print("*" * i)', 'python',
   '[{"input":"3","expected_output":"*\n**\n***","is_hidden":false},
     {"input":"1","expected_output":"*","is_hidden":false},
     {"input":"5","expected_output":"*\n**\n***\n****\n*****","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Matnni ko''paytirish mumkin: \"*\" * 3 → ***"}]'::jsonb,
   'medium', 8, 20, 1),
  (a3, 'Ko''paytirish jadvali (to''liq)',
   '1 dan 5 gacha ko''paytirish jadvalini chiqaring. Har qatorda 5 ta natija bo''lib, ular ikki bo''shliq bilan ajratilsin va qator oxirida ortiqcha bo''shliq qolmasin.<br>Format: <code>1x1=1  1x2=2  ...</code>',
   '# Kodingizni shu yerga yozing',
   'for i in range(1, 6):
    qator = []
    for j in range(1, 6):
        qator.append(f"{i}x{j}={i*j}")
    print("  ".join(qator))', 'python',
   '[{"input":"","expected_output":"1x1=1  1x2=2  1x3=3  1x4=4  1x5=5\n2x1=2  2x2=4  2x3=6  2x4=8  2x5=10\n3x1=3  3x2=6  3x3=9  3x4=12  3x5=15\n4x1=4  4x2=8  4x3=12  4x4=16  4x5=20\n5x1=5  5x2=10  5x3=15  5x4=20  5x5=25","is_hidden":false}]'::jsonb,
   '[{"order":1,"text":"Ichki siklda natijalarni ro''yxatga to''plang"},
     {"order":2,"text":"\"  \".join(qator) ortiqcha bo''shliqsiz birlashtiradi"}]'::jsonb,
   'hard', 12, 30, 2);

  -- 4-amaliy
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (a4, 'Chegaraviy holatni (masalan nol) qachon tekshirish kerak?', 'single',
   '[{"id":"a","text":"Eng oxirida","is_correct":false},{"id":"b","text":"Eng boshida","is_correct":true},
     {"id":"c","text":"Tekshirish shart emas","is_correct":false},{"id":"d","text":"O''rtada","is_correct":false}]'::jsonb,
   'Aks holda chegaraviy qiymat boshqa shartlarga tushib ketadi va noto''g''ri javob beradi.', 1, 0),
  (a4, '<code>x % 4 == 0 and x % 100 != 0 or x % 400 == 0</code> nima uchun xavfli?', 'single',
   '[{"id":"a","text":"Juda uzun","is_correct":false},
     {"id":"b","text":"Qavssiz and va or aralashib, mantiq buziladi","is_correct":true},
     {"id":"c","text":"Xato beradi","is_correct":false},
     {"id":"d","text":"Sekin ishlaydi","is_correct":false}]'::jsonb,
   'and or dan oldin bajariladi. To''g''ri yozuv: x % 4 == 0 and (x % 100 != 0 or x % 400 == 0).', 2, 1),
  (a4, 'Uch sondan eng kattasini topishning eng qisqa yo''li qaysi?', 'single',
   '[{"id":"a","text":"max(a, b, c)","is_correct":true},
     {"id":"b","text":"Uchta if-elif","is_correct":false},
     {"id":"c","text":"sorted(a, b, c)","is_correct":false},
     {"id":"d","text":"sum(a, b, c)","is_correct":false}]'::jsonb,
   'max() bir nechta argument qabul qiladi. sorted() esa ro''yxat kutadi.', 1, 2),
  (a4, 'Matnlarni <code>&lt;</code> bilan taqqoslasa nima solishtiriladi?', 'single',
   '[{"id":"a","text":"Uzunligi","is_correct":false},
     {"id":"b","text":"Alifbo tartibi (belgilar kodi)","is_correct":true},
     {"id":"c","text":"Xato beradi","is_correct":false},
     {"id":"d","text":"So''zlar soni","is_correct":false}]'::jsonb,
   'Matnlar belgi-ma-belgi taqqoslanadi. Katta harflar kichiklaridan oldin keladi.', 1, 3),
  (a4, 'Qaysi shartlar <code>x = 0</code> uchun rost?', 'multiple',
   '[{"id":"a","text":"x &gt;= 0","is_correct":true},{"id":"b","text":"not x","is_correct":true},
     {"id":"c","text":"x &gt; 0","is_correct":false},{"id":"d","text":"x &lt;= 0","is_correct":true}]'::jsonb,
   'Pythonda 0 yolg''on hisoblanadi, shuning uchun not 0 → True.', 2, 4);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (a4, 'Uch sondan eng kattasi',
   'Bir qatorda bo''shliq bilan ajratilgan uch butun son kiritiladi. Eng kattasini chiqaring. <code>max()</code> ishlatmasdan, shartlar orqali yeching.',
   'a, b, c = map(int, input().split())
# Kodingizni shu yerga yozing',
   'a, b, c = map(int, input().split())
if a >= b and a >= c:
    print(a)
elif b >= a and b >= c:
    print(b)
else:
    print(c)', 'python',
   '[{"input":"3 9 5","expected_output":"9","is_hidden":false},
     {"input":"10 2 7","expected_output":"10","is_hidden":false},
     {"input":"4 4 4","expected_output":"4","is_hidden":true},
     {"input":"-5 -2 -9","expected_output":"-2","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Har bir sonni qolgan ikkalasi bilan solishtiring"},
     {"order":2,"text":"Tenglik holati uchun >= ishlating"}]'::jsonb,
   'medium', 8, 20, 0),
  (a4, 'Nuqta qaysi chorakda?',
   'Bir qatorda nuqtaning <code>x</code> va <code>y</code> koordinatalari (butun sonlar) kiritiladi. Javob: <code>I chorak</code>, <code>II chorak</code>, <code>III chorak</code>, <code>IV chorak</code> yoki <code>O''qda</code>.',
   'x, y = map(int, input().split())
# Kodingizni shu yerga yozing',
   'x, y = map(int, input().split())
if x == 0 or y == 0:
    print("O''qda")
elif x > 0 and y > 0:
    print("I chorak")
elif x < 0 and y > 0:
    print("II chorak")
elif x < 0 and y < 0:
    print("III chorak")
else:
    print("IV chorak")', 'python',
   '[{"input":"3 4","expected_output":"I chorak","is_hidden":false},
     {"input":"-2 5","expected_output":"II chorak","is_hidden":false},
     {"input":"0 7","expected_output":"O''qda","is_hidden":false},
     {"input":"-1 -1","expected_output":"III chorak","is_hidden":true},
     {"input":"6 -3","expected_output":"IV chorak","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Avval o''qda yotish holatini tekshiring"},
     {"order":2,"text":"Keyin ishoralar kombinatsiyasini ko''rib chiqing"}]'::jsonb,
   'medium', 8, 20, 1),
  (a4, 'Kvadrat tenglama',
   'Uch qatorda <code>a</code>, <code>b</code>, <code>c</code> koeffitsiyentlari (butun sonlar, <code>a</code> noldan farqli) kiritiladi.<br>Diskriminantga qarab chiqaring:<br>D &gt; 0 → ikkita ildiz, o''sish tartibida, har biri alohida qatorda, 2 xonagacha<br>D = 0 → bitta ildiz, 2 xonagacha<br>D &lt; 0 → <code>Ildiz yoq</code>',
   'import math
a = int(input())
b = int(input())
c = int(input())
# Kodingizni shu yerga yozing',
   'import math
a = int(input())
b = int(input())
c = int(input())
d = b * b - 4 * a * c
if d > 0:
    x1 = (-b - math.sqrt(d)) / (2 * a)
    x2 = (-b + math.sqrt(d)) / (2 * a)
    print(f"{min(x1, x2):.2f}")
    print(f"{max(x1, x2):.2f}")
elif d == 0:
    print(f"{-b / (2 * a):.2f}")
else:
    print("Ildiz yoq")', 'python',
   '[{"input":"1\n-3\n2","expected_output":"1.00\n2.00","is_hidden":false},
     {"input":"1\n2\n1","expected_output":"-1.00","is_hidden":false},
     {"input":"1\n0\n5","expected_output":"Ildiz yoq","is_hidden":false},
     {"input":"2\n-7\n3","expected_output":"0.50\n3.00","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"D = b² - 4ac"},
     {"order":2,"text":"a manfiy bo''lsa ildizlar tartibi almashadi — min() va max() ishlating"}]'::jsonb,
   'hard', 12, 30, 2);

  -- 5-amaliy
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (a5, '<code>a, b = b, a + b</code> nima uchun bir qatorda yoziladi?', 'single',
   '[{"id":"a","text":"Qisqaroq bo''lsin deb","is_correct":false},
     {"id":"b","text":"Ikkala qiymat eski qiymatlar asosida bir vaqtda yangilanishi uchun","is_correct":true},
     {"id":"c","text":"Python shuni talab qiladi","is_correct":false},
     {"id":"d","text":"Tezroq ishlashi uchun","is_correct":false}]'::jsonb,
   'Alohida yozilsa a yangilangandan keyin b eski a ni topa olmaydi.', 2, 0),
  (a5, 'To''xtatuvchi belgi (sentinel) nima?', 'single',
   '[{"id":"a","text":"Siklni to''xtatish uchun kelishilgan maxsus qiymat","is_correct":true},
     {"id":"b","text":"Xato turi","is_correct":false},
     {"id":"c","text":"Funksiya nomi","is_correct":false},
     {"id":"d","text":"Kalit so''z","is_correct":false}]'::jsonb,
   'Masalan 0 yoki -1: foydalanuvchi shu qiymatni kiritganda sikl tugaydi.', 1, 1),
  (a5, '<code>son //= 10</code> nima qiladi?', 'single',
   '[{"id":"a","text":"Sonni 10 ga ko''paytiradi","is_correct":false},
     {"id":"b","text":"Oxirgi raqamni tashlaydi","is_correct":true},
     {"id":"c","text":"Oxirgi raqamni beradi","is_correct":false},
     {"id":"d","text":"Sonni matnga aylantiradi","is_correct":false}]'::jsonb,
   'Butun bo''lish 10 ga — oxirgi raqam yo''qoladi. Oxirgi raqamni olish uchun % 10.', 1, 2),
  (a5, 'Cheksiz sikldan qanday saqlanish mumkin?', 'multiple',
   '[{"id":"a","text":"Sikl ichida shartga ta''sir qiluvchi qiymatni o''zgartirish","is_correct":true},
     {"id":"b","text":"while True ichida break qo''yish","is_correct":true},
     {"id":"c","text":"Faqat for ishlatish","is_correct":false},
     {"id":"d","text":"Shart qachondir yolg''on bo''lishini tekshirish","is_correct":true}]'::jsonb,
   'for ham noto''g''ri ishlatilsa muammo tug''dirishi mumkin, lekin cheksiz sikl asosan while da uchraydi.', 2, 3),
  (a5, 'Bu kod nechta son chiqaradi?<br><code>n = 100<br>while n &gt; 1:<br>&nbsp;&nbsp;&nbsp;&nbsp;n //= 2<br>&nbsp;&nbsp;&nbsp;&nbsp;print(n)</code>', 'single',
   '[{"id":"a","text":"5","is_correct":false},{"id":"b","text":"6","is_correct":true},
     {"id":"c","text":"7","is_correct":false},{"id":"d","text":"100","is_correct":false}]'::jsonb,
   '50, 25, 12, 6, 3, 1 — 6 ta. Keyin n = 1 bo''lib shart yolg''on bo''ladi.', 2, 4);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (a5, 'Raqamlar soni',
   'Bir musbat butun son kiritiladi. Undagi raqamlar sonini chiqaring. <code>len(str(n))</code> ishlatmasdan, <code>while</code> bilan yeching.',
   'son = int(input())
soni = 0
# Kodingizni shu yerga yozing',
   'son = int(input())
soni = 0
while son > 0:
    son //= 10
    soni += 1
print(soni)', 'python',
   '[{"input":"472","expected_output":"3","is_hidden":false},
     {"input":"7","expected_output":"1","is_hidden":false},
     {"input":"1000000","expected_output":"7","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Har qadamda son //= 10 qiling va hisoblagichni oshiring"}]'::jsonb,
   'easy', 5, 15, 0),
  (a5, 'Fibonachchi sonlari',
   'Bir butun son <code>n</code> kiritiladi. Fibonachchi sonlarining <code>n</code> dan oshmaydiganlarini bitta qatorda bo''shliq bilan chiqaring.<br>Ketma-ketlik 0 dan boshlanadi: <code>0 1 1 2 3 5 8 ...</code>',
   'n = int(input())
a, b = 0, 1
# Kodingizni shu yerga yozing',
   'n = int(input())
a, b = 0, 1
natija = []
while a <= n:
    natija.append(str(a))
    a, b = b, a + b
print(" ".join(natija))', 'python',
   '[{"input":"10","expected_output":"0 1 1 2 3 5 8","is_hidden":false},
     {"input":"1","expected_output":"0 1 1","is_hidden":false},
     {"input":"0","expected_output":"0","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"a, b = b, a + b bilan keyingi songa o''ting"},
     {"order":2,"text":"Natijalarni ro''yxatga to''plab, \" \".join() bilan chiqaring"}]'::jsonb,
   'medium', 8, 20, 1),
  (a5, 'Musbat sonlar sanog''i',
   'Har qatorda bittadan butun son kiritiladi. <code>0</code> kiritilganda o''qish to''xtaydi.<br>Birinchi qatorda musbat sonlar sonini, ikkinchisida manfiy sonlar sonini chiqaring.',
   'musbat = 0
manfiy = 0
# Kodingizni shu yerga yozing',
   'musbat = 0
manfiy = 0
son = int(input())
while son != 0:
    if son > 0:
        musbat += 1
    else:
        manfiy += 1
    son = int(input())
print(musbat)
print(manfiy)', 'python',
   '[{"input":"5\n-3\n8\n-1\n0","expected_output":"2\n2","is_hidden":false},
     {"input":"0","expected_output":"0\n0","is_hidden":false},
     {"input":"1\n2\n3\n0","expected_output":"3\n0","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Sikl ichida shartni tekshirib, mos hisoblagichni oshiring"}]'::jsonb,
   'medium', 8, 20, 2);

  -- 6-amaliy
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (a6, '<code>return</code> yozilmagan funksiya nima qaytaradi?', 'single',
   '[{"id":"a","text":"0","is_correct":false},{"id":"b","text":"None","is_correct":true},
     {"id":"c","text":"Bo''sh matn","is_correct":false},{"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'Har qanday funksiya qandaydir qiymat qaytaradi — return bo''lmasa bu None bo''ladi.', 1, 0),
  (a6, '<code>return n % 2 == 1</code> yozuvi nima uchun afzal?', 'single',
   '[{"id":"a","text":"Taqqoslash natijasi allaqachon True yoki False","is_correct":true},
     {"id":"b","text":"Tezroq ishlaydi","is_correct":false},
     {"id":"c","text":"if ishlatib bo''lmaydi","is_correct":false},
     {"id":"d","text":"Xotira tejaydi","is_correct":false}]'::jsonb,
   'if ... return True else return False yozish ortiqcha — taqqoslashning o''zi mantiqiy qiymat.', 1, 1),
  (a6, 'Funksiya boshqa funksiyani chaqira oladimi?', 'single',
   '[{"id":"a","text":"Ha","is_correct":true},{"id":"b","text":"Yo''q","is_correct":false},
     {"id":"c","text":"Faqat bitta marta","is_correct":false},{"id":"d","text":"Faqat modul ichida","is_correct":false}]'::jsonb,
   'Bu funksiyalarning asosiy kuchi — katta masalani kichik bo''laklarga bo''lish imkonini beradi.', 1, 2),
  (a6, '<code>def f(a, b=2, c=3)</code> uchun <code>f(1, c=9)</code> chaqiruvida <code>b</code> nechaga teng?', 'single',
   '[{"id":"a","text":"9","is_correct":false},{"id":"b","text":"2","is_correct":true},
     {"id":"c","text":"1","is_correct":false},{"id":"d","text":"None","is_correct":false}]'::jsonb,
   'b berilmagani uchun sukut qiymati — 2 qoladi.', 1, 3),
  (a6, 'Funksiyalarga bo''lishning foydalari qaysilar?', 'multiple',
   '[{"id":"a","text":"Kod takrorlanmaydi","is_correct":true},
     {"id":"b","text":"Xatoni bitta joyda tuzatish yetarli","is_correct":true},
     {"id":"c","text":"Har bir qismni alohida sinash mumkin","is_correct":true},
     {"id":"d","text":"Dastur har doim tezroq ishlaydi","is_correct":false}]'::jsonb,
   'Funksiya chaqiruvi kichik qo''shimcha xarajat beradi — asosiy foyda tezlikda emas, tartibda.', 2, 4);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (a6, 'Bo''linma va qoldiq',
   '<code>bol_qoldiq(a, b)</code> funksiyasini yozing — u butun bo''linma va qoldiqni qaytarsin.<br>Ikki qatorda son kiritiladi; natijani bitta qatorda bo''shliq bilan chiqaring.',
   'def bol_qoldiq(a, b):
    # Kodingizni shu yerga yozing
    pass

a = int(input())
b = int(input())
x, y = bol_qoldiq(a, b)
print(x, y)',
   'def bol_qoldiq(a, b):
    return a // b, a % b

a = int(input())
b = int(input())
x, y = bol_qoldiq(a, b)
print(x, y)', 'python',
   '[{"input":"17\n5","expected_output":"3 2","is_hidden":false},
     {"input":"10\n2","expected_output":"5 0","is_hidden":false},
     {"input":"7\n10","expected_output":"0 7","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Vergul bilan ikki qiymat qaytaring: return a // b, a % b"}]'::jsonb,
   'easy', 5, 15, 0),
  (a6, 'Palindrom tekshirgich',
   '<code>palindrommi(matn)</code> funksiyasini yozing — matn teskari o''qilganda ham bir xil bo''lsa <code>True</code> qaytarsin.<br>Bir qator matn kiritiladi; javob <code>Ha</code> yoki <code>Yoq</code>.',
   'def palindrommi(matn):
    # Kodingizni shu yerga yozing
    pass

s = input()
if palindrommi(s):
    print("Ha")
else:
    print("Yoq")',
   'def palindrommi(matn):
    return matn == matn[::-1]

s = input()
if palindrommi(s):
    print("Ha")
else:
    print("Yoq")', 'python',
   '[{"input":"kapak","expected_output":"Ha","is_hidden":false},
     {"input":"salom","expected_output":"Yoq","is_hidden":false},
     {"input":"a","expected_output":"Ha","is_hidden":true},
     {"input":"abba","expected_output":"Ha","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"matn[::-1] matnni teskari o''giradi"},
     {"order":2,"text":"Taqqoslash natijasini to''g''ridan-to''g''ri return qiling"}]'::jsonb,
   'medium', 8, 20, 1),
  (a6, 'Statistika funksiyalari',
   'Uchta funksiya yozing: <code>eng_katta(sonlar)</code>, <code>eng_kichik(sonlar)</code>, <code>ortacha(sonlar)</code>.<br>Birinchi qatorda sonlar soni, ikkinchisida sonlar bo''shliq bilan kiritiladi.<br>Chiqish: 1-qatorda eng katta, 2-qatorda eng kichik, 3-qatorda o''rtacha (2 xonagacha).',
   'def eng_katta(sonlar):
    pass

def eng_kichik(sonlar):
    pass

def ortacha(sonlar):
    pass

n = int(input())
s = list(map(int, input().split()))
print(eng_katta(s))
print(eng_kichik(s))
print(f"{ortacha(s):.2f}")',
   'def eng_katta(sonlar):
    return max(sonlar)

def eng_kichik(sonlar):
    return min(sonlar)

def ortacha(sonlar):
    return sum(sonlar) / len(sonlar)

n = int(input())
s = list(map(int, input().split()))
print(eng_katta(s))
print(eng_kichik(s))
print(f"{ortacha(s):.2f}")', 'python',
   '[{"input":"5\n4 8 1 9 3","expected_output":"9\n1\n5.00","is_hidden":false},
     {"input":"3\n2 2 2","expected_output":"2\n2\n2.00","is_hidden":false},
     {"input":"4\n-1 -5 3 7","expected_output":"7\n-5\n1.00","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Har bir funksiya bitta ish bajaradi"},
     {"order":2,"text":"max(), min(), sum()/len() dan foydalaning"}]'::jsonb,
   'medium', 8, 20, 2);

END $$;
