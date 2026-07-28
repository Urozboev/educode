-- ============================================
-- EduCode — "Dasturlash asoslari (Ma'ruza)" kursi
-- Fan dasturi: DAS1208, 2025-2026, Guliston DPI
-- Bu fayl: fan dasturidagi 1-6 mavzular (kursda 3-8 o'rin)
--
-- Mavjud "python-intro" va "python-setup" mavzulari kirish sifatida
-- 1-2 o'rinda qoladi, fan dasturi mavzulari 3-o'rindan boshlanadi.
--
-- Topshiriqlar stdin → stdout tartibida: dastur input() bilan o'qiydi,
-- print() bilan chiqaradi. Tekshiruvchi chiqishni qatorlar oxiridagi
-- bo'shliqlarni tashlab solishtiradi.
--
-- Qayta ishga tushirilsa dublikat yaratmaydi.
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

DO $$
DECLARE
  v_course UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-maruza';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: dasturlash-asoslari-maruza';
  END IF;

  -- ============================================
  -- 3. MAVZU (fan dasturi 1): Python tili sintaksisi va leksik asosi
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course,
    'Python tili sintaksisi va uning leksik asosi',
    'python-sintaksis',
    $html$
<h2>Sintaksis nima?</h2>
<p><b>Sintaksis</b> — dasturlash tilining grammatikasi. U kodni qanday yozish kerakligini belgilaydi. Odam tilida gap tuzilishi qanday qoidalarga bo'ysunsa, dasturda ham har bir belgi o'z o'rnida turishi kerak. Qoida buzilsa, Python dasturni umuman ishga tushirmaydi.</p>

<h3>Birinchi dastur</h3>
<pre><code>print("Assalomu alaykum!")</code></pre>
<p>Bu bir qatorlik dastur ekranga matn chiqaradi. Bu yerda <code>print</code> — funksiya nomi, qavslar ichidagi qism esa unga uzatilayotgan qiymat.</p>

<h3>Leksik asos: dastur nimalardan tuzilgan</h3>
<p>Python kodi to'rt xil elementdan iborat:</p>
<ul>
  <li><b>Kalit so'zlar</b> — tilning o'ziga tegishli so'zlar: <code>if</code>, <code>else</code>, <code>for</code>, <code>while</code>, <code>def</code>, <code>return</code>, <code>import</code>, <code>True</code>, <code>False</code>, <code>None</code>. Ularni o'zgaruvchi nomi sifatida ishlatib bo'lmaydi.</li>
  <li><b>Identifikatorlar</b> — biz o'zimiz beradigan nomlar: o'zgaruvchi, funksiya, sinf nomlari.</li>
  <li><b>Literallar</b> — kodda to'g'ridan-to'g'ri yozilgan qiymatlar: <code>25</code>, <code>3.14</code>, <code>"salom"</code>, <code>True</code>.</li>
  <li><b>Operatorlar va ajratuvchilar</b> — <code>+</code>, <code>-</code>, <code>=</code>, <code>==</code>, qavslar, vergul, ikki nuqta.</li>
</ul>

<h3>Bo'shliq — Pythonning o'ziga xosligi</h3>
<p>Ko'p tillarda kod bloklari figurali qavs bilan ajratiladi. Pythonda esa <b>chekinish (indentation)</b> shu vazifani bajaradi. Chekinish — bu qator boshidagi bo'shliqlar.</p>
<pre><code>if 5 > 3:
    print("Besh uchdan katta")
    print("Bu ham shart ichida")
print("Bu esa shartdan tashqarida")</code></pre>
<p>Odatda chekinish uchun <b>4 ta bo'shliq</b> ishlatiladi. Bir blok ichida chekinish bir xil bo'lishi shart — aks holda <code>IndentationError</code> xatosi chiqadi.</p>

<h3>print() funksiyasi</h3>
<p><code>print()</code> — ma'lumotni ekranga chiqaradigan asosiy funksiya. Unga bir nechta qiymat berish mumkin, ular bo'shliq bilan ajratiladi:</p>
<pre><code>print("Ism:", "Ali", "Yosh:", 19)
# Natija: Ism: Ali Yosh: 19</code></pre>
<p>Ajratuvchini o'zgartirish uchun <code>sep</code>, qator oxirini o'zgartirish uchun <code>end</code> parametri ishlatiladi:</p>
<pre><code>print("a", "b", "c", sep="-")   # a-b-c
print("Birinchi", end=" ")
print("ikkinchi")               # Birinchi ikkinchi</code></pre>

<h3>input() bilan ma'lumot olish</h3>
<pre><code>ism = input("Ismingizni kiriting: ")
print("Salom,", ism)</code></pre>
<p>Muhim: <code>input()</code> <b>doim matn</b> qaytaradi. Son kerak bo'lsa, uni aylantirish shart:</p>
<pre><code>yosh = int(input("Yoshingiz: "))
print("Kelasi yili", yosh + 1, "yoshga to'lasiz")</code></pre>

<h3>Fayl nomi va kengaytmasi</h3>
<p>Python fayllari <code>.py</code> kengaytmasi bilan saqlanadi. Fayl nomiga qo'yiladigan talablar:</p>
<ul>
  <li>faqat kichik harflar, raqamlar va pastki chiziq: <code>birinchi_dastur.py</code></li>
  <li>raqam bilan boshlanmasin: <code>1dastur.py</code> — noto'g'ri</li>
  <li>standart kutubxona nomlari bilan bir xil bo'lmasin: <code>math.py</code>, <code>random.py</code> deb nomlamang — bu chalkashlik keltirib chiqaradi</li>
</ul>

<h3>Xulosa</h3>
<p>Sintaksis — kodni to'g'ri yozish qoidalari. Pythonda chekinish shunchaki chiroyli ko'rinish uchun emas, u dastur mantiqining bir qismi. <code>print()</code> chiqaradi, <code>input()</code> o'qiydi va har doim matn qaytaradi.</p>
    $html$,
    3, 10, 25, 25, true, true)
  ON CONFLICT (course_id, slug) DO UPDATE
    SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
        order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
        is_published = true;

  -- ============================================
  -- 4. MAVZU (fan dasturi 2): Python tilida xatoliklar
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'Python tilida xatoliklar (syntax error)',
    'python-xatoliklar',
    $html$
<h2>Xato — dasturchining kundalik hamrohi</h2>
<p>Xato qilish — bu muvaffaqiyatsizlik emas, balki ishning tabiiy qismi. Muhimi, xato xabarini <b>o'qiy bilish</b>. Python xatoni topganda, uning turini va qaysi qatorda ekanini aytadi.</p>

<h3>Xatolarning uch turi</h3>
<ol>
  <li><b>Sintaksis xatosi</b> — kod yozilish qoidasi buzilgan. Dastur umuman ishga tushmaydi.</li>
  <li><b>Bajarilish xatosi</b> — kod to'g'ri yozilgan, lekin ishlash paytida muammo chiqdi (masalan, nolga bo'lish).</li>
  <li><b>Mantiqiy xato</b> — dastur ishlaydi, xato bermaydi, lekin <b>natija noto'g'ri</b>. Eng xavflisi shu.</li>
</ol>

<h3>Sintaksis xatolari</h3>
<pre><code>print("Salom"     # qavs yopilmagan
# SyntaxError: '(' was never closed</code></pre>
<pre><code>if x > 5
    print("katta")
# SyntaxError: expected ':'</code></pre>
<pre><code>if x > 5:
print("katta")
# IndentationError: expected an indented block</code></pre>

<h3>Xato xabarini qanday o'qish kerak</h3>
<pre><code>Traceback (most recent call last):
  File "dastur.py", line 4, in &lt;module&gt;
    natija = 10 / 0
ZeroDivisionError: division by zero</code></pre>
<p>Xabarni <b>pastdan yuqoriga</b> o'qing:</p>
<ul>
  <li>oxirgi qator — xato turi va sababi: nolga bo'lish</li>
  <li>undan yuqorisi — muammoli kod</li>
  <li>yana yuqorisi — fayl nomi va qator raqami</li>
</ul>

<h3>Eng ko'p uchraydigan xatolar</h3>
<table>
  <thead><tr><th>Xato</th><th>Sababi</th><th>Yechim</th></tr></thead>
  <tbody>
    <tr><td><code>NameError</code></td><td>O'zgaruvchi yaratilmagan yoki nomi noto'g'ri yozilgan</td><td>Nomni tekshiring, katta-kichik harfga e'tibor bering</td></tr>
    <tr><td><code>TypeError</code></td><td>Mos kelmaydigan turlar ustida amal: <code>"5" + 5</code></td><td><code>int()</code> yoki <code>str()</code> bilan aylantiring</td></tr>
    <tr><td><code>ValueError</code></td><td><code>int("salom")</code> — aylantirib bo'lmaydi</td><td>Kiritilgan qiymatni tekshiring</td></tr>
    <tr><td><code>IndexError</code></td><td>Ro'yxatda yo'q indeksga murojaat</td><td>Ro'yxat uzunligini tekshiring</td></tr>
    <tr><td><code>ZeroDivisionError</code></td><td>Nolga bo'lish</td><td>Bo'luvchini oldindan tekshiring</td></tr>
  </tbody>
</table>

<h3>Mantiqiy xatoga misol</h3>
<pre><code># O'rtacha qiymat topmoqchimiz
a = 10
b = 20
ortacha = a + b / 2     # NOTO'G'RI: avval b/2 hisoblanadi
print(ortacha)          # 20.0 chiqadi, 15.0 emas

ortacha = (a + b) / 2   # TO'G'RI
print(ortacha)          # 15.0</code></pre>
<p>Bu yerda Python xato bermaydi — u aytilgan ishni bajardi. Xato bizning yozganimizda.</p>

<h3>Xatoni topish usullari</h3>
<ul>
  <li><b>print bilan tekshirish</b> — shubhali joyda o'zgaruvchi qiymatini chiqarib ko'ring</li>
  <li><b>Kichik qismlarga bo'lish</b> — uzun ifodani bir necha qatorga yoying</li>
  <li><b>Xato xabarini to'liq o'qish</b> — ko'pincha javob o'sha yerda yozilgan</li>
</ul>
    $html$,
    4, 10, 25, 25, true)
  ON CONFLICT (course_id, slug) DO UPDATE
    SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
        order_index = EXCLUDED.order_index, is_published = true;

  -- ============================================
  -- 5. MAVZU (fan dasturi 3): Arifmetik amallar va izohlar
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'Arifmetik amallar va izohlar',
    'arifmetik-amallar',
    $html$
<h2>Arifmetik amallar</h2>
<table>
  <thead><tr><th>Amal</th><th>Belgi</th><th>Misol</th><th>Natija</th></tr></thead>
  <tbody>
    <tr><td>Qo'shish</td><td><code>+</code></td><td><code>7 + 3</code></td><td>10</td></tr>
    <tr><td>Ayirish</td><td><code>-</code></td><td><code>7 - 3</code></td><td>4</td></tr>
    <tr><td>Ko'paytirish</td><td><code>*</code></td><td><code>7 * 3</code></td><td>21</td></tr>
    <tr><td>Bo'lish</td><td><code>/</code></td><td><code>7 / 3</code></td><td>2.333…</td></tr>
    <tr><td>Butun bo'lish</td><td><code>//</code></td><td><code>7 // 3</code></td><td>2</td></tr>
    <tr><td>Qoldiq</td><td><code>%</code></td><td><code>7 % 3</code></td><td>1</td></tr>
    <tr><td>Daraja</td><td><code>**</code></td><td><code>7 ** 2</code></td><td>49</td></tr>
  </tbody>
</table>
<p>Diqqat: <code>/</code> har doim <b>haqiqiy son</b> (float) qaytaradi. <code>10 / 2</code> natijasi <code>5.0</code>, <code>5</code> emas.</p>

<h3>Amallar bajarilish tartibi</h3>
<p>Matematikadagi kabi:</p>
<ol>
  <li>Qavslar <code>( )</code></li>
  <li>Daraja <code>**</code></li>
  <li>Ko'paytirish, bo'lish, butun bo'lish, qoldiq</li>
  <li>Qo'shish va ayirish</li>
</ol>
<pre><code>print(2 + 3 * 4)        # 14  — avval ko'paytirish
print((2 + 3) * 4)      # 20  — avval qavs
print(2 ** 3 ** 2)      # 512 — daraja o'ngdan chapga: 2**(3**2)</code></pre>

<h3>Ildiz va daraja</h3>
<p>Pythonda alohida ildiz belgisi yo'q — kasr darajadan foydalaniladi:</p>
<pre><code>print(16 ** 0.5)    # 4.0  — kvadrat ildiz
print(27 ** (1/3))  # 3.0  — kub ildiz</code></pre>
<p>Yoki <code>math</code> modulidan:</p>
<pre><code>import math
print(math.sqrt(16))   # 4.0
print(math.pow(2, 10)) # 1024.0</code></pre>

<h3>Eksponenta va logarifm</h3>
<pre><code>import math
print(math.e)          # 2.718281828459045
print(math.exp(1))     # e ning 1-darajasi
print(math.log(math.e))    # 1.0   — natural logarifm
print(math.log10(1000))    # 3.0   — o'nlik logarifm
print(math.log(8, 2))      # 3.0   — 2 asosli logarifm</code></pre>

<h3>Qoldiq amalining foydasi</h3>
<p><code>%</code> amali juft-toqlikni aniqlashda va bo'linuvchanlikni tekshirishda ishlatiladi:</p>
<pre><code>son = 14
if son % 2 == 0:
    print("Juft son")
else:
    print("Toq son")</code></pre>

<h3>Izohlar</h3>
<p>Izoh — kod ichidagi tushuntirish. Python uni o'qimaydi, u faqat odam uchun.</p>
<pre><code># Bu bir qatorlik izoh

x = 5  # izohni qator oxiriga ham yozish mumkin

"""
Bu bir necha qatorlik izoh.
Odatda funksiya yoki modul tavsifi uchun ishlatiladi.
"""</code></pre>

<h3>Yaxshi izoh qanday bo'ladi</h3>
<p>Yomon izoh kod nima qilayotganini takrorlaydi:</p>
<pre><code>x = x + 1  # x ga bir qo'shamiz   ← foydasiz</code></pre>
<p>Yaxshi izoh <b>nima uchun</b> shunday qilinganini tushuntiradi:</p>
<pre><code>x = x + 1  # indeks 0 dan boshlanadi, foydalanuvchiga 1 dan ko'rsatamiz</code></pre>
    $html$,
    5, 10, 25, 25, true)
  ON CONFLICT (course_id, slug) DO UPDATE
    SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
        order_index = EXCLUDED.order_index, is_published = true;

  -- ============================================
  -- 6. MAVZU (fan dasturi 4): O'zgaruvchilar va ma'lumot turlari
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'O''zgaruvchilar va ma''lumot turlari',
    'ozgaruvchilar-va-turlar',
    $html$
<h2>O'zgaruvchi nima?</h2>
<p><b>O'zgaruvchi</b> — qiymat saqlanadigan nomlangan joy. Uni ustiga yorliq yopishtirilgan quti deb tasavvur qiling: quti ichidagi narsani almashtirish mumkin, yorliq esa o'sha nom bo'lib qolaveradi.</p>
<pre><code>yosh = 19
ism = "Dilnoza"
boy = 1.72
talaba = True</code></pre>
<p>Pythonda o'zgaruvchi turini oldindan e'lon qilish shart emas — tur qiymatga qarab o'zi aniqlanadi.</p>

<h3>Nom berish qoidalari</h3>
<ul>
  <li>Faqat harf, raqam va pastki chiziq: <code>talaba_yoshi</code></li>
  <li>Raqam bilan boshlanmaydi: <code>2son</code> — xato, <code>son2</code> — to'g'ri</li>
  <li>Bo'shliq ishlatilmaydi: <code>talaba yoshi</code> — xato</li>
  <li>Katta-kichik harf farqlanadi: <code>Yosh</code> va <code>yosh</code> — ikki xil o'zgaruvchi</li>
  <li>Kalit so'zlar ishlatilmaydi: <code>if</code>, <code>for</code>, <code>class</code>, <code>def</code>, <code>True</code></li>
</ul>

<h3>Mumkin bo'lmagan hollar</h3>
<pre><code>2son = 5        # SyntaxError — raqam bilan boshlangan
talaba yoshi=5  # SyntaxError — bo'shliq bor
for = 10        # SyntaxError — kalit so'z
son-1 = 5       # SyntaxError — chiziqcha ayirish deb tushuniladi</code></pre>

<h3>Yaxshi nom tanlash</h3>
<p>Nom nima saqlanayotganini aytib turishi kerak:</p>
<pre><code>a = 19          # nima bu?
yosh = 19       # aniq

x = 3.14        # tushunarsiz
pi = 3.14       # tushunarli

t = "Ali"       # noaniq
talaba_ismi = "Ali"   # aniq</code></pre>

<h3>Asosiy ma'lumot turlari</h3>
<table>
  <thead><tr><th>Tur</th><th>Nomi</th><th>Misol</th></tr></thead>
  <tbody>
    <tr><td><code>int</code></td><td>Butun son</td><td><code>25</code>, <code>-7</code>, <code>0</code></td></tr>
    <tr><td><code>float</code></td><td>Haqiqiy son</td><td><code>3.14</code>, <code>-0.5</code>, <code>2.0</code></td></tr>
    <tr><td><code>str</code></td><td>Matn (satr)</td><td><code>"salom"</code>, <code>'Python'</code></td></tr>
    <tr><td><code>bool</code></td><td>Mantiqiy</td><td><code>True</code>, <code>False</code></td></tr>
    <tr><td><code>list</code></td><td>Ro'yxat</td><td><code>[1, 2, 3]</code></td></tr>
    <tr><td><code>NoneType</code></td><td>Qiymat yo'q</td><td><code>None</code></td></tr>
  </tbody>
</table>

<h3>Turni aniqlash va o'zgartirish</h3>
<pre><code>x = 25
print(type(x))          # &lt;class 'int'&gt;

# Aylantirish
son = int("42")         # matndan butun songa
matn = str(42)          # sondan matnga
kasr = float("3.14")    # matndan haqiqiy songa
butun = int(3.99)       # 3 — kasr qismi tashlanadi, yaxlitlanmaydi!</code></pre>

<h3>Ko'p uchraydigan xato</h3>
<pre><code>yosh = input("Yoshingiz: ")   # bu MATN
print(yosh + 1)               # TypeError!

yosh = int(input("Yoshingiz: "))  # to'g'ri
print(yosh + 1)</code></pre>

<h3>Bir vaqtda bir nechta o'zgaruvchi</h3>
<pre><code>a, b, c = 1, 2, 3
x = y = z = 0

# Qiymatlarni almashtirish
a, b = b, a</code></pre>
    $html$,
    6, 10, 25, 25, true)
  ON CONFLICT (course_id, slug) DO UPDATE
    SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
        order_index = EXCLUDED.order_index, is_published = true;

  -- ============================================
  -- 7. MAVZU (fan dasturi 5): Matnlar va sonlar bilan ishlash
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'Matnlar va sonlar bilan ishlash',
    'matnlar-va-sonlar',
    $html$
<h2>String — matn ma'lumot turi</h2>
<p>Matn qo'shtirnoq yoki bittalik tirnoq ichida yoziladi — farqi yo'q:</p>
<pre><code>a = "Salom"
b = 'Salom'
c = """Bir necha qatorli
matn ham bo'lishi mumkin"""</code></pre>
<p>Matn ichida tirnoq kerak bo'lsa, tashqarisiga boshqasini qo'ying:</p>
<pre><code>gap = "U 'salom' dedi"
gap2 = 'Kitob "Python" deb ataladi'</code></pre>

<h3>Matnlar ustida amallar</h3>
<pre><code>a = "Python"
b = "dasturlash"

print(a + " " + b)   # Python dasturlash  — birlashtirish
print(a * 3)         # PythonPythonPython — takrorlash
print(len(a))        # 6                  — uzunlik
print(a[0])          # P                  — birinchi belgi
print(a[-1])         # n                  — oxirgi belgi
print(a[0:3])        # Pyt                — kesish</code></pre>
<p>Indeks <b>0 dan</b> boshlanadi. Manfiy indeks oxiridan sanaydi.</p>

<h3>f-string — eng qulay usul</h3>
<pre><code>ism = "Dilnoza"
yosh = 19

# Eski usul
print("Salom, " + ism + "! Siz " + str(yosh) + " yoshdasiz.")

# f-string — qulayroq va xatoga kamroq yo'l qo'yadi
print(f"Salom, {ism}! Siz {yosh} yoshdasiz.")</code></pre>
<p>f-string ichida hisoblash ham mumkin:</p>
<pre><code>a, b = 7, 3
print(f"{a} + {b} = {a + b}")
print(f"{a} / {b} = {a / b:.2f}")   # 2 xonagacha yaxlitlash</code></pre>

<h3>Matn metodlari</h3>
<table>
  <thead><tr><th>Metod</th><th>Vazifasi</th><th>Misol</th></tr></thead>
  <tbody>
    <tr><td><code>.upper()</code></td><td>Bosh harfga</td><td><code>"salom".upper()</code> → <code>SALOM</code></td></tr>
    <tr><td><code>.lower()</code></td><td>Kichik harfga</td><td><code>"SALOM".lower()</code> → <code>salom</code></td></tr>
    <tr><td><code>.title()</code></td><td>Har so'z bosh harf bilan</td><td><code>"ali valiyev".title()</code> → <code>Ali Valiyev</code></td></tr>
    <tr><td><code>.capitalize()</code></td><td>Faqat birinchi harf</td><td><code>"ali valiyev".capitalize()</code> → <code>Ali valiyev</code></td></tr>
    <tr><td><code>.strip()</code></td><td>Chetdagi bo'shliqlarni olib tashlaydi</td><td><code>"  a  ".strip()</code> → <code>a</code></td></tr>
    <tr><td><code>.replace()</code></td><td>Almashtiradi</td><td><code>"salom".replace("s", "k")</code> → <code>kalom</code></td></tr>
    <tr><td><code>.split()</code></td><td>Ro'yxatga ajratadi</td><td><code>"a b c".split()</code> → <code>['a','b','c']</code></td></tr>
    <tr><td><code>.count()</code></td><td>Nechta marta uchraganini sanaydi</td><td><code>"salom".count("l")</code> → <code>1</code></td></tr>
  </tbody>
</table>

<h3>title() va capitalize() farqi</h3>
<pre><code>ism = "ali valiyev qodirovich"
print(ism.title())        # Ali Valiyev Qodirovich
print(ism.capitalize())   # Ali valiyev qodirovich</code></pre>

<h3>Muhim: matn o'zgarmaydi</h3>
<p>Metodlar matnni o'zgartirmaydi, <b>yangi matn qaytaradi</b>:</p>
<pre><code>a = "salom"
a.upper()
print(a)          # salom — o'zgarmadi!

a = a.upper()
print(a)          # SALOM — endi o'zgardi</code></pre>

<h3>Metodlarning afzalligi va kamchiligi</h3>
<ul>
  <li><b>Afzalligi:</b> kod qisqa va o'qishli bo'ladi, xatoga kam yo'l qo'yiladi, tayyor va sinovdan o'tgan.</li>
  <li><b>Kamchiligi:</b> har bir metod yangi matn yaratadi — juda katta matnlar bilan ishlaganda xotira sarflanadi. Ko'p metodni ketma-ket ulash kodni o'qishni qiyinlashtiradi.</li>
</ul>
    $html$,
    7, 10, 25, 30, true)
  ON CONFLICT (course_id, slug) DO UPDATE
    SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
        order_index = EXCLUDED.order_index, is_published = true;

  -- ============================================
  -- 8. MAVZU (fan dasturi 6): Ro'yxatlar, tuples va For sikli
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'Ro''yxatlar, o''zgarmas ro''yxatlar va for sikli',
    'royxatlar-va-for',
    $html$
<h2>Ro'yxat (list)</h2>
<p>Ro'yxat — bir nechta qiymatni bitta nom ostida saqlaydigan tuzilma. Kvadrat qavs bilan yoziladi:</p>
<pre><code>sonlar = [10, 20, 30, 40, 50]
ismlar = ["Ali", "Vali", "Guli"]
aralash = [1, "salom", 3.14, True]   # turlari har xil bo'lishi mumkin</code></pre>

<h3>Elementga murojaat</h3>
<pre><code>sonlar = [10, 20, 30, 40, 50]
print(sonlar[0])    # 10  — birinchi
print(sonlar[-1])   # 50  — oxirgi
print(len(sonlar))  # 5   — uzunlik

sonlar[1] = 99      # o'zgartirish
print(sonlar)       # [10, 99, 30, 40, 50]</code></pre>

<h3>Ro'yxat metodlari</h3>
<pre><code>a = [3, 1, 2]
a.append(4)       # oxiriga qo'shish  → [3, 1, 2, 4]
a.insert(0, 0)    # ko'rsatilgan o'ringa → [0, 3, 1, 2, 4]
a.remove(3)       # qiymat bo'yicha o'chirish → [0, 1, 2, 4]
oxirgi = a.pop()  # oxirgisini olib tashlaydi va qaytaradi
a.sort()          # tartiblash (o'zini o'zgartiradi)
a.reverse()       # teskari qilish
print(a.count(1)) # nechta marta uchraydi</code></pre>
<p>Asl ro'yxatni saqlab qolib tartiblangan nusxa olish uchun <code>sorted()</code> ishlatiladi:</p>
<pre><code>a = [3, 1, 2]
b = sorted(a)
print(a, b)   # [3, 1, 2] [1, 2, 3]</code></pre>

<h3>Kesish (slicing)</h3>
<pre><code>a = [0, 1, 2, 3, 4, 5]
print(a[1:4])    # [1, 2, 3]   — 1-dan 4-gacha (4 kirmaydi)
print(a[:3])     # [0, 1, 2]   — boshidan
print(a[3:])     # [3, 4, 5]   — oxirigacha
print(a[::2])    # [0, 2, 4]   — bittalab tashlab
print(a[::-1])   # [5, 4, 3, 2, 1, 0] — teskari</code></pre>

<h3>Nusxa olish — muhim tuzoq</h3>
<pre><code>a = [1, 2, 3]
b = a           # NUSXA EMAS! b va a bitta ro'yxatga ishora qiladi
b.append(4)
print(a)        # [1, 2, 3, 4] — a ham o'zgardi

c = a[:]        # haqiqiy nusxa
# yoki c = a.copy()</code></pre>

<h3>Tuple — o'zgarmas ro'yxat</h3>
<pre><code>hafta = ("Dushanba", "Seshanba", "Chorshanba")
print(hafta[0])     # Dushanba
hafta[0] = "Yakshanba"   # TypeError — o'zgartirib bo'lmaydi</code></pre>
<p>Tuple qachon kerak? Qiymatlar o'zgarmasligi kerak bo'lganda: hafta kunlari, koordinatalar, sozlamalar. U ro'yxatdan tezroq ishlaydi va tasodifan o'zgartirib qo'yishdan himoya qiladi.</p>

<h3>range() funksiyasi</h3>
<pre><code>list(range(5))        # [0, 1, 2, 3, 4]
list(range(2, 6))     # [2, 3, 4, 5]
list(range(0, 10, 2)) # [0, 2, 4, 6, 8]
list(range(5, 0, -1)) # [5, 4, 3, 2, 1]</code></pre>

<h3>for sikli</h3>
<p>Sikl — takrorlanuvchi amallarni bajaradigan konstruksiya. <code>for</code> ro'yxat yoki <code>range</code> bo'ylab yuradi:</p>
<pre><code>for meva in ["olma", "anor", "uzum"]:
    print(meva)

for i in range(1, 6):
    print(i, "ning kvadrati:", i ** 2)</code></pre>

<h3>for qanday ishlaydi</h3>
<ol>
  <li>Ro'yxatdan navbatdagi element olinadi va o'zgaruvchiga yoziladi</li>
  <li>Sikl ichidagi kod bajariladi</li>
  <li>Element qolmaguncha 1-2 qadam takrorlanadi</li>
</ol>

<h3>Sonli ro'yxatlar ustida amallar</h3>
<pre><code>sonlar = [4, 8, 15, 16, 23, 42]
print(sum(sonlar))    # 108 — yig'indi
print(min(sonlar))    # 4
print(max(sonlar))    # 42
print(sum(sonlar) / len(sonlar))   # o'rtacha</code></pre>

<h3>for va input() birga</h3>
<pre><code>n = int(input("Nechta son kiritasiz? "))
sonlar = []
for i in range(n):
    son = int(input())
    sonlar.append(son)
print("Yig'indi:", sum(sonlar))</code></pre>

<h3>Ko'p uchraydigan xatolar</h3>
<ul>
  <li><code>a[len(a)]</code> — <code>IndexError</code>. Oxirgi indeks <code>len(a) - 1</code>.</li>
  <li>Sikl ichida ro'yxatdan element o'chirish — elementlar siljib, ba'zilari tashlab ketiladi.</li>
  <li>Ikki nuqtani unutish: <code>for i in range(5)</code> — <code>SyntaxError</code>.</li>
</ul>
    $html$,
    8, 10, 30, 35, true)
  ON CONFLICT (course_id, slug) DO UPDATE
    SET title = EXCLUDED.title, content_html = EXCLUDED.content_html,
        order_index = EXCLUDED.order_index, is_published = true;

END $$;
