-- ============================================================
-- MirAcademy — "Dasturlash asoslari (Laboratoriya)" kursi: 7-12 ishlar
--
--  7. Lug'at va to'plam
--  8. Kortejlar va matritsalar
--  9. Istisnolar va kirish ma'lumotlarini tekshirish
-- 10. Rekursiv algoritmlar
-- 11. Saralash algoritmlarini taqqoslash
-- 12. Sinflar, meros va inkapsulyatsiya
--
-- Har bir laboratoriya ishi: maqsad, nazariy eslatma, ish tartibi,
-- nazorat savollari, 4 ta test va 3 ta amaliy topshiriq (stdin → stdout).
--
-- Sifat nazorati: ish tartibidagi kod namunalarining natijasi
-- CPython'da ishga tushirib yozilgan. "Kod nima chiqaradi" testlari va
-- barcha topshiriq yechimlari ham ishga tushirib tekshirilgan.
-- Vaqt o'lchash namunalari (time, random) natijasiz berilgan — ular
-- har bir kompyuterda turlicha chiqadi.
--
-- 32-migratsiyadan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz.
-- ============================================================

DO $$
DECLARE
  v_course UUID;
  t1 UUID; t2 UUID; t3 UUID; t4 UUID; t5 UUID; t6 UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-laboratoriya';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: dasturlash-asoslari-laboratoriya';
  END IF;

  -- ==========================================================
  -- 7. 7-laboratoriya ishi: Lug'at va to'plam
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '7-laboratoriya ishi: Lug''at va to''plam', 'lab-7-lugat-toplam',
$html$
<h2>Ishning maqsadi</h2>
<p>Lug'at (<code>dict</code>) va to'plam (<code>set</code>) tuzilmalarini yaratish, ular ustida amallar bajarish va ularni ro'yxat bilan taqqoslab, qaysi holatda qaysi tuzilma qulay ekanini aniqlash.</p>

<h3>Nazariy eslatma</h3>
<p><b>Lug'at</b> — "kalit → qiymat" juftliklari. Kalit bo'yicha qidiruv ro'yxatdagidek boshidan yurmaydi, balki deyarli bir zumda bajariladi. Kalit o'zgarmas tur bo'lishi kerak: son, satr, kortej.</p>
<p><b>To'plam</b> — takrorlanmaydigan elementlar majmuasi. Matematikadagi to'plamlar kabi amallarni qo'llab-quvvatlaydi:</p>
<table>
  <tr><th>Amal</th><th>Belgi</th><th>Ma'nosi</th></tr>
  <tr><td>Birlashma</td><td><code>a | b</code></td><td>Ikkalasidagi barcha elementlar</td></tr>
  <tr><td>Kesishma</td><td><code>a &amp; b</code></td><td>Ikkalasida ham bor elementlar</td></tr>
  <tr><td>Ayirma</td><td><code>a - b</code></td><td>a da bor, b da yo'q</td></tr>
  <tr><td>Simmetrik ayirma</td><td><code>a ^ b</code></td><td>Faqat bittasida bor</td></tr>
</table>
<pre><code>a = {1, 2, 3, 4}
b = {3, 4, 5}
print(a | b, a &amp; b, a - b, a ^ b)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>{1, 2, 3, 4, 5} {3, 4} {1, 2} {1, 2, 5}</code></pre>

<h3>Ish tartibi</h3>
<ol>
  <li>Telefon daftarchasini lug'at ko'rinishida yarating, unga yozuv qo'shing, o'zgartiring va o'chiring:
<pre><code>daftar = {"Ali": "901234567", "Vali": "937654321"}
daftar["Sardor"] = "911112233"
daftar["Ali"] = "900000000"
del daftar["Vali"]
for ism, tel in daftar.items():
    print(ism, tel)
print("Vali" in daftar)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Ali 900000000
Sardor 911112233
False</code></pre>
  </li>
  <li>Mavjud bo'lmagan kalitga <code>daftar["Zarina"]</code> bilan murojaat qiling va chiqqan xatoni yozib oling. Keyin xuddi shuni <code>daftar.get("Zarina", "yo'q")</code> bilan qiling.</li>
  <li>Ikki guruh talabalari ro'yxatidan ikkala guruhda ham qatnashganlarni va faqat birinchi guruhdagilarni to'plam amallari bilan toping:
<pre><code>python = {"Ali", "Vali", "Dilnoza", "Sardor"}
web = {"Vali", "Zarina", "Sardor"}
print(sorted(python &amp; web))
print(sorted(python - web))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>['Sardor', 'Vali']
['Ali', 'Dilnoza']</code></pre>
  </li>
  <li>Ro'yxat va to'plamda qidiruv tezligini taqqoslang:
<pre><code>import time
n = 1_000_000
royxat = list(range(n))
toplam = set(royxat)

t = time.perf_counter()
for _ in range(100):
    (n - 1) in royxat
print("ro'yxat:", time.perf_counter() - t)

t = time.perf_counter()
for _ in range(100):
    (n - 1) in toplam
print("to'plam:", time.perf_counter() - t)</code></pre>
  Natijalarni yozib oling va farq necha baravar ekanini hisoblang.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li>Nima uchun ro'yxat lug'at kaliti bo'la olmaydi, kortej esa bo'la oladi?</li>
  <li><code>d[k]</code> va <code>d.get(k)</code> orasidagi farq nimada?</li>
  <li><code>{}</code> qanday tur yaratadi — bo'sh lug'atmi yoki bo'sh to'plammi?</li>
  <li>To'plamda qidiruv nima uchun ro'yxatdagidan tez?</li>
</ol>
$html$,
    7, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t1;

  -- ==========================================================
  -- 8. 8-laboratoriya ishi: Kortejlar va matritsalar
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '8-laboratoriya ishi: Kortejlar va matritsalar', 'lab-8-kortej-matritsa',
$html$
<h2>Ishning maqsadi</h2>
<p>Kortejlarning o'zgarmaslik xususiyatini tekshirish, ichma-ich ro'yxatlar yordamida matritsa yaratish va matritsa ustida asosiy amallarni (yig'indi, transponirlash, ko'paytirish) dasturlash.</p>

<h3>Nazariy eslatma</h3>
<p><b>Kortej</b> — <code>(1, 2, 3)</code> ko'rinishidagi o'zgarmas ketma-ketlik. U yozuvlar, koordinatalar va funksiyadan bir nechta qiymat qaytarish uchun ishlatiladi.</p>
<p><b>Matritsa</b> — n satr va m ustundan iborat jadval. Pythonda u ro'yxatlar ro'yxati sifatida saqlanadi: <code>a[i][j]</code> — i-satr, j-ustundagi element.</p>
<p>Ikki matritsani ko'paytirish: A (n×k) va B (k×m) dan C (n×m) hosil bo'ladi, bu yerda</p>
<pre><code>C[i][j] = A[i][0]*B[0][j] + A[i][1]*B[1][j] + ... + A[i][k-1]*B[k-1][j]</code></pre>

<h3>Ish tartibi</h3>
<ol>
  <li>Kortejni o'zgartirishga urinib ko'ring va xatoni yozib oling:
<pre><code>sana = (2026, 10, 11)
sana[1] = 12</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>TypeError: 'tuple' object does not support item assignment</code></pre>
  </li>
  <li>Funksiyadan bir nechta qiymat qaytaring va ularni ochib oling:
<pre><code>def statistika(sonlar):
    return min(sonlar), max(sonlar), sum(sonlar) / len(sonlar)

kichik, katta, ortacha = statistika([4, 8, 15, 16, 23, 42])
print(kichik, katta, ortacha)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>4 42 18.0</code></pre>
  </li>
  <li>3×3 birlik matritsa yarating (diagonalda 1, qolgan joyda 0):
<pre><code>n = 3
e = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
for satr in e:
    print(*satr)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>1 0 0
0 1 0
0 0 1</code></pre>
  </li>
  <li>Ikki matritsani ko'paytirish funksiyasini yozing va tekshiring:
<pre><code>def kopaytir(A, B):
    n, k, m = len(A), len(B), len(B[0])
    return [[sum(A[i][t] * B[t][j] for t in range(k)) for j in range(m)] for i in range(n)]

A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
for satr in kopaytir(A, B):
    print(*satr)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>19 22
43 50</code></pre>
  </li>
  <li>A matritsani birlik matritsaga ko'paytiring va natija A ning o'zi ekanini tekshiring.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li>Kortej ro'yxatdan qaysi jihatlari bilan farq qiladi?</li>
  <li>Nima uchun <code>[[0] * 3] * 3</code> bilan matritsa yaratish xato?</li>
  <li>A (2×3) va B (3×4) ko'paytmasi qanday o'lchamda bo'ladi? B × A ni hisoblash mumkinmi?</li>
</ol>
$html$,
    8, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t2;

  -- ==========================================================
  -- 9. 9-laboratoriya ishi: Istisnolar va kirish ma'lumotlarini tekshirish
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '9-laboratoriya ishi: Istisnolar va kirish ma''lumotlarini tekshirish', 'lab-9-istisnolar',
$html$
<h2>Ishning maqsadi</h2>
<p>Dastur ishini buzadigan vaziyatlarni oldindan ko'ra bilish, ularni <code>try / except / else / finally</code> yordamida qayta ishlash va foydalanuvchi kiritgan ma'lumotni tekshirish ko'nikmasini shakllantirish.</p>

<h3>Nazariy eslatma</h3>
<p>Xatolar ikki xil bo'ladi:</p>
<ul>
  <li><b>Sintaksis xatolari</b> — kod umuman ishga tushmaydi. Ularni faqat kodni tuzatib yo'qotish mumkin</li>
  <li><b>Istisnolar</b> — kod to'g'ri yozilgan, lekin bajarilish paytida muammo chiqdi: noto'g'ri kiritma, nolga bo'lish, yo'q fayl. Ularni <code>try</code> bilan ushlash mumkin</li>
</ul>
<pre><code>try:
    # xato chiqishi mumkin bo'lgan kod
except TurXato as e:
    # shu tur xato chiqqanda
else:
    # xato chiqmaganda
finally:
    # har doim</code></pre>

<h3>Ish tartibi</h3>
<ol>
  <li>Har bir qatorni alohida ishga tushirib, qanday istisno chiqishini jadvalga yozing:
<pre><code>int("salom")
[1, 2, 3][3]
{"a": 1}["b"]
10 / 0
"5" + 5
undefined_name</code></pre>
  </li>
  <li>Barcha holatlarni bitta funksiyada ushlang:
<pre><code>def sinab_kor(ifoda):
    try:
        natija = eval(ifoda)
    except ZeroDivisionError:
        return "nolga bo'lish"
    except (ValueError, TypeError) as e:
        return "noto'g'ri qiymat: " + type(e).__name__
    except (IndexError, KeyError):
        return "bunday element yo'q"
    else:
        return f"natija = {natija}"

for s in ["7 * 6", "10 / 0", "int('x')", "[1][5]", "'5' + 5"]:
    print(f"{s:12} -&gt; {sinab_kor(s)}")</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>7 * 6        -&gt; natija = 42
10 / 0       -&gt; nolga bo'lish
int('x')     -&gt; noto'g'ri qiymat: ValueError
[1][5]       -&gt; bunday element yo'q
'5' + 5      -&gt; noto'g'ri qiymat: TypeError</code></pre>
  </li>
  <li><code>finally</code> qachon bajarilishini tekshiring — <code>return</code> bo'lsa ham:
<pre><code>def f():
    try:
        return "try dan qaytdi"
    finally:
        print("finally baribir ishladi")

print(f())</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>finally baribir ishladi
try dan qaytdi</code></pre>
  </li>
  <li>O'z istisnongizni yarating:
<pre><code>class BallXatosi(Exception):
    pass

def ball_qosh(ball):
    if not 0 &lt;= ball &lt;= 100:
        raise BallXatosi(f"{ball} — ball 0 dan 100 gacha bo'lishi kerak")
    return ball

try:
    ball_qosh(120)
except BallXatosi as e:
    print("Xato:", e)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Xato: 120 — ball 0 dan 100 gacha bo'lishi kerak</code></pre>
  </li>
  <li>Topshiriqlarni bajaring.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li>Sintaksis xatosi va istisno orasidagi farq nimada?</li>
  <li>Bitta <code>except</code> da bir nechta istisno turini qanday ushlash mumkin?</li>
  <li><code>else</code> blokiga yoziladigan kodni nega <code>try</code> ichiga yozmaslik kerak?</li>
  <li>Qachon <code>raise</code> bilan o'zingiz istisno chiqarish kerak?</li>
</ol>
$html$,
    9, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t3;

  -- ==========================================================
  -- 10. 10-laboratoriya ishi: Rekursiv algoritmlar
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '10-laboratoriya ishi: Rekursiv algoritmlar', 'lab-10-rekursiya',
$html$
<h2>Ishning maqsadi</h2>
<p>Rekursiv funksiyalarni yozish, chaqiruvlar sonini o'lchash va rekursiv hamda iterativ (siklli) yechimlarni tezlik bo'yicha taqqoslash.</p>

<h3>Nazariy eslatma</h3>
<p>Rekursiv funksiya ikki qismdan iborat: <b>asosiy holat</b> (javob tayyor, chaqiruv to'xtaydi) va <b>rekursiv qadam</b> (masala kichraytirilib, funksiya o'zini chaqiradi). Har bir chaqiruv xotirada joy egallaydi, shuning uchun Python chuqurlikni cheklaydi:</p>
<pre><code>import sys
print(sys.getrecursionlimit())</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>1000</code></pre>

<h3>Ish tartibi</h3>
<ol>
  <li>Fibonachchi sonlarini rekursiv hisoblang va chaqiruvlar sonini o'lchang:
<pre><code>chaqiruv = 0

def fib(n):
    global chaqiruv
    chaqiruv += 1
    if n &lt; 2:
        return n
    return fib(n - 1) + fib(n - 2)

for n in [10, 20, 25]:
    chaqiruv = 0
    print(n, fib(n), chaqiruv)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>10 55 177
20 6765 21891
25 75025 242785</code></pre>
  n bir birlikka oshganda chaqiruvlar soni taxminan necha baravar oshayotganini hisoblang.</li>
  <li>Xuddi shu funksiyani natijalarni eslab qoladigan qilib qayta yozing:
<pre><code>xotira = {}

def fib(n):
    if n &lt; 2:
        return n
    if n not in xotira:
        xotira[n] = fib(n - 1) + fib(n - 2)
    return xotira[n]

print(fib(90))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>2880067194370816120</code></pre>
  </li>
  <li>Siklli versiyasini yozing va uchala usulni taqqoslang:
<pre><code>def fib_sikl(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib_sikl(90))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>2880067194370816120</code></pre>
  </li>
  <li>Ro'yxatning barcha o'rin almashtirishlarini (permutatsiyalarini) rekursiv chiqaring:
<pre><code>def almashtirishlar(a):
    if len(a) &lt;= 1:
        return [a]
    natija = []
    for i in range(len(a)):
        for qolgan in almashtirishlar(a[:i] + a[i + 1:]):
            natija.append([a[i]] + qolgan)
    return natija

for p in almashtirishlar([1, 2, 3]):
    print(*p)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>1 2 3
1 3 2
2 1 3
2 3 1
3 1 2
3 2 1</code></pre>
  </li>
  <li>Topshiriqlarni bajaring.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li>Oddiy rekursiv Fibonachchi nima uchun sekin ishlaydi?</li>
  <li>Natijalarni eslab qolish (memoizatsiya) qanday ishlaydi?</li>
  <li>n ta elementning nechta o'rin almashtirishi bor?</li>
  <li>Qaysi hollarda rekursiyadan voz kechib, sikl yozgan ma'qul?</li>
</ol>
$html$,
    10, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t4;

  -- ==========================================================
  -- 11. 11-laboratoriya ishi: Saralash algoritmlarini taqqoslash
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '11-laboratoriya ishi: Saralash algoritmlarini taqqoslash', 'lab-11-saralash',
$html$
<h2>Ishning maqsadi</h2>
<p>Pufakchali, qo'shib va birlashtirib (merge) saralash algoritmlarini dasturlash, ularning bajargan solishtirishlar sonini o'lchash va natijalarni o'rnatilgan <code>sorted()</code> bilan taqqoslash.</p>

<h3>Nazariy eslatma</h3>
<p>Algoritm tezligi odatda <b>kirish hajmi n ga nisbatan</b> baholanadi:</p>
<table>
  <tr><th>Algoritm</th><th>Solishtirishlar (taxminan)</th><th>n = 1000 da</th></tr>
  <tr><td>Pufakchali</td><td>n² / 2</td><td>~500 000</td></tr>
  <tr><td>Qo'shib saralash</td><td>n² / 4 (o'rtacha)</td><td>~250 000</td></tr>
  <tr><td>Birlashtirib saralash</td><td>n · log₂n</td><td>~10 000</td></tr>
</table>
<p><b>Birlashtirib saralash</b> "bo'l va hukmronlik qil" g'oyasiga asoslanadi: ro'yxat ikkiga bo'linadi, har bir yarmi rekursiv saralanadi, keyin ikki tartiblangan yarim bitta tartiblangan ro'yxatga birlashtiriladi.</p>

<h3>Ish tartibi</h3>
<ol>
  <li>Solishtirishlarni sanaydigan pufakchali saralashni yozing:
<pre><code>def pufakcha(a):
    a = a[:]
    sanoq = 0
    for i in range(len(a) - 1):
        for j in range(len(a) - 1 - i):
            sanoq += 1
            if a[j] &gt; a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a, sanoq

print(pufakcha([5, 3, 8, 1, 9, 2]))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>([1, 2, 3, 5, 8, 9], 15)</code></pre>
  </li>
  <li>Birlashtirib saralashni yozing:
<pre><code>def birlashtir(chap, ong):
    natija = []
    i = j = 0
    while i &lt; len(chap) and j &lt; len(ong):
        if chap[i] &lt;= ong[j]:
            natija.append(chap[i]); i += 1
        else:
            natija.append(ong[j]); j += 1
    return natija + chap[i:] + ong[j:]

def merge_sort(a):
    if len(a) &lt;= 1:
        return a
    orta = len(a) // 2
    return birlashtir(merge_sort(a[:orta]), merge_sort(a[orta:]))

print(merge_sort([5, 3, 8, 1, 9, 2, 7]))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[1, 2, 3, 5, 7, 8, 9]</code></pre>
  </li>
  <li>1000, 2000 va 4000 ta tasodifiy son uchun ikkala algoritmning ishlash vaqtini o'lchang:
<pre><code>import random, time
for n in [1000, 2000, 4000]:
    a = [random.randint(1, 10**6) for _ in range(n)]
    t = time.perf_counter(); pufakcha(a); t1 = time.perf_counter() - t
    t = time.perf_counter(); merge_sort(a); t2 = time.perf_counter() - t
    print(n, round(t1, 3), round(t2, 4))</code></pre>
  n ikki baravar oshganda har bir algoritm vaqti necha baravar oshganini jadvalga yozing.</li>
  <li>Algoritmlaringiz natijasini <code>sorted()</code> bilan solishtirib, to'g'riligini tekshiring.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li>n ikki baravar oshganda pufakchali saralash vaqti nima uchun to'rt baravar oshadi?</li>
  <li>Birlashtirib saralashda asosiy holat qanday?</li>
  <li>"Barqaror saralash" nima va u qachon muhim?</li>
</ol>
$html$,
    11, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t5;

  -- ==========================================================
  -- 12. 12-laboratoriya ishi: Sinflar, meros va inkapsulyatsiya
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '12-laboratoriya ishi: Sinflar, meros va inkapsulyatsiya', 'lab-12-sinflar',
$html$
<h2>Ishning maqsadi</h2>
<p>Sinflar yordamida kichik axborot tizimini loyihalash: atributlar va metodlarni aniqlash, ma'lumotni noto'g'ri o'zgartirishdan himoyalash va meros orqali kodni qayta ishlatish.</p>

<h3>Nazariy eslatma</h3>
<p>Obyektga yo'naltirilgan dasturlashning uchta asosiy tamoyili:</p>
<ul>
  <li><b>Inkapsulyatsiya</b> — ma'lumot va uni o'zgartiruvchi metodlar bitta sinfda. Atributlarni bevosita emas, metodlar orqali o'zgartirish. Pythonda "ichki" atribut nomi pastki chiziq bilan boshlanadi: <code>self._balans</code></li>
  <li><b>Meros</b> — yangi sinf mavjud sinfning xususiyatlarini oladi: <code>class Talaba(Shaxs)</code></li>
  <li><b>Polimorfizm</b> — har xil sinflarning bir xil nomli metodlari o'zicha ishlaydi va ularni bir xil usulda chaqirish mumkin</li>
</ul>
<p><code>@property</code> atributni o'qish uchun ochib, yozishni metod orqali nazorat qilish imkonini beradi.</p>

<h3>Ish tartibi</h3>
<ol>
  <li>Ichki atribut va <code>@property</code> bilan ishlang:
<pre><code>class Termometr:
    def __init__(self):
        self._c = 0

    @property
    def selsiy(self):
        return self._c

    @selsiy.setter
    def selsiy(self, qiymat):
        if qiymat &lt; -273.15:
            raise ValueError("Absolyut noldan past bo'lishi mumkin emas")
        self._c = qiymat

    @property
    def farengeyt(self):
        return self._c * 9 / 5 + 32

t = Termometr()
t.selsiy = 25
print(t.selsiy, t.farengeyt)
try:
    t.selsiy = -300
except ValueError as e:
    print(e)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>25 77.0
Absolyut noldan past bo'lishi mumkin emas</code></pre>
  </li>
  <li>Meros zanjirini quring:
<pre><code>class Shaxs:
    def __init__(self, ism, yosh):
        self.ism = ism
        self.yosh = yosh

    def tanishtir(self):
        return f"{self.ism}, {self.yosh} yosh"

class Talaba(Shaxs):
    def __init__(self, ism, yosh, guruh):
        super().__init__(ism, yosh)
        self.guruh = guruh

    def tanishtir(self):
        return super().tanishtir() + f", {self.guruh}-guruh talabasi"

class Oqituvchi(Shaxs):
    def __init__(self, ism, yosh, fan):
        super().__init__(ism, yosh)
        self.fan = fan

    def tanishtir(self):
        return super().tanishtir() + f", {self.fan} o'qituvchisi"

for odam in [Talaba("Ali", 19, "DI-21"), Oqituvchi("Karimov", 45, "Dasturlash")]:
    print(odam.tanishtir())
print(isinstance(odam, Shaxs))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Ali, 19 yosh, DI-21-guruh talabasi
Karimov, 45 yosh, Dasturlash o'qituvchisi
True</code></pre>
  </li>
  <li>Obyektlarni solishtirish va saralash uchun <code>__lt__</code> metodini qo'shing:
<pre><code>class Kasr:
    def __init__(self, s, m):
        self.s, self.m = s, m

    def __lt__(self, boshqa):
        return self.s * boshqa.m &lt; boshqa.s * self.m

    def __str__(self):
        return f"{self.s}/{self.m}"

kasrlar = [Kasr(1, 2), Kasr(1, 3), Kasr(3, 4), Kasr(2, 5)]
print(*sorted(kasrlar))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>1/3 2/5 1/2 3/4</code></pre>
  </li>
  <li>Sinflar diagrammasini (qaysi sinf qaysidan meros oladi, qanday atribut va metodlari bor) daftaringizga chizing.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>

<h3>Nazorat savollari</h3>
<ol>
  <li>Inkapsulyatsiyaning maqsadi nima? Misol keltiring.</li>
  <li><code>super()</code> nima uchun kerak?</li>
  <li><code>isinstance(obyekt, Sinf)</code> bola sinf obyekti uchun nima qaytaradi?</li>
  <li>Qaysi metod yordamida obyektlarni <code>sorted()</code> bilan saralash mumkin bo'ladi?</li>
</ol>
$html$,
    12, 10, 25, 90, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t6;

  -- Qayta ishga tushirilganda dublikat bo'lmasligi uchun
  DELETE FROM quizzes WHERE topic_id IN (t1, t2, t3, t4, t5, t6);
  DELETE FROM topic_tasks WHERE topic_id IN (t1, t2, t3, t4, t5, t6);

  -- Testlar: 7-laboratoriya ishi: Lug'at va to'plam
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t1, 'Kod nima chiqaradi?

print(type({}).__name__)', 'single',
   '[{"id": "a", "text": "dict", "is_correct": true}, {"id": "b", "text": "set", "is_correct": false}, {"id": "c", "text": "list", "is_correct": false}, {"id": "d", "text": "tuple", "is_correct": false}]'::jsonb,
   'Bo''sh jingalak qavslar bo''sh LUG''AT yaratadi. Bo''sh to''plam faqat set() bilan yaratiladi.', 1, 0),
  (t1, 'Kod nima chiqaradi?

a = {1, 2, 3}
b = {2, 3, 4}
print(len(a ^ b))', 'single',
   '[{"id": "a", "text": "2", "is_correct": true}, {"id": "b", "text": "4", "is_correct": false}, {"id": "c", "text": "1", "is_correct": false}, {"id": "d", "text": "3", "is_correct": false}]'::jsonb,
   'Simmetrik ayirma — faqat bittasida bor elementlar: {1, 4}.', 1, 1),
  (t1, 'Qaysi biri lug''at kaliti bo''la OLMAYDI?', 'single',
   '[{"id": "a", "text": "[1, 2]", "is_correct": true}, {"id": "b", "text": "(1, 2)", "is_correct": false}, {"id": "c", "text": "\"ism\"", "is_correct": false}, {"id": "d", "text": "42", "is_correct": false}]'::jsonb,
   'Kalit o''zgarmas (hashlanadigan) bo''lishi kerak. Ro''yxat o''zgaruvchan.', 1, 2),
  (t1, 'Kod nima chiqaradi?

d = {"a": 1, "b": 2}
d["a"] = 5
print(len(d), d["a"])', 'single',
   '[{"id": "a", "text": "2 5", "is_correct": true}, {"id": "b", "text": "3 5", "is_correct": false}, {"id": "c", "text": "2 1", "is_correct": false}, {"id": "d", "text": "3 1", "is_correct": false}]'::jsonb,
   'Mavjud kalitga qiymat berish yangi juftlik qo''shmaydi, eski qiymatni almashtiradi.', 1, 3);

  -- Topshiriqlar: 7-laboratoriya ishi: Lug'at va to'plam
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t1, 'Umumiy elementlar',
   'Ikki qatorda ikki ro''yxat (bo''shliq bilan ajratilgan butun sonlar) berilgan. Ikkalasida ham uchraydigan sonlarni takrorlarsiz, o''sish tartibida chiqaring. Bunday sonlar bo''lmasa "Yo''q" deb chiqaring.',
   'a = list(map(int, input().split()))
b = list(map(int, input().split()))
# Kodingizni yozing',
   'a = list(map(int, input().split()))
b = list(map(int, input().split()))
u = sorted(set(a) & set(b))
print(*u if u else ["Yo''q"])',
   'python',
   '[{"input": "1 2 3 4 4\n3 4 5", "expected_output": "3 4", "is_hidden": false}, {"input": "1 2\n3 4", "expected_output": "Yo''q", "is_hidden": false}, {"input": "5 5 5\n5", "expected_output": "5", "is_hidden": true}, {"input": "-1 0 1\n1 0 -1", "expected_output": "-1 0 1", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "set() takrorlarni olib tashlaydi"}, {"order": 2, "text": "& — kesishma, sorted() — tartib"}]'::jsonb,
   'easy', 5, 15, 0),
  (t1, 'Telefon daftarchasi',
   'Birinchi qatorda n. Keyingi n qatorda "ism raqam". Undan keyin m, va m ta qatorda qidirilayotgan ism.

Har bir qidiruv uchun raqamni chiqaring, topilmasa "Topilmadi". Bir ism ikki marta kiritilsa, oxirgi raqam saqlanadi.',
   'n = int(input())
# Kodingizni yozing',
   'n = int(input())
d = {}
for _ in range(n):
    ism, tel = input().split()
    d[ism] = tel
m = int(input())
for _ in range(m):
    print(d.get(input(), "Topilmadi"))',
   'python',
   '[{"input": "2\nAli 901\nVali 902\n3\nVali\nZarina\nAli", "expected_output": "902\nTopilmadi\n901", "is_hidden": false}, {"input": "2\nAli 1\nAli 2\n1\nAli", "expected_output": "2", "is_hidden": false}, {"input": "1\nX 7\n1\nx", "expected_output": "Topilmadi", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "d[ism] = tel — oxirgi qiymat avvalgisini almashtiradi"}, {"order": 2, "text": "d.get(ism, \"Topilmadi\")"}]'::jsonb,
   'easy', 5, 15, 1),
  (t1, 'Anagramma guruhlari',
   'Bitta qatorda bo''shliq bilan ajratilgan so''zlar. Bir xil harflardan tuzilgan so''zlarni bitta guruhga yig''ing.

Har bir guruhni bitta qatorda, so''zlarni alifbo tartibida chiqaring. Guruhlarning o''zi esa guruhdagi alifbo bo''yicha birinchi so''z tartibida chiqsin.',
   'sozlar = input().split()
# Kodingizni yozing',
   'sozlar = input().split()
g = {}
for s in sozlar:
    g.setdefault("".join(sorted(s)), []).append(s)
guruhlar = sorted(sorted(v) for v in g.values())
for v in guruhlar:
    print(*v)',
   'python',
   '[{"input": "olma mola nok kon lamo", "expected_output": "kon nok\nlamo mola olma", "is_hidden": false}, {"input": "abc", "expected_output": "abc", "is_hidden": false}, {"input": "ab ba cd dc ab", "expected_output": "ab ab ba\ncd dc", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Anagrammalarning harflarini saralasangiz bir xil kalit chiqadi: \"\".join(sorted(s))"}, {"order": 2, "text": "Lug''atda kalit → so''zlar ro''yxati saqlang"}]'::jsonb,
   'hard', 12, 30, 2);

  -- Testlar: 8-laboratoriya ishi: Kortejlar va matritsalar
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t2, 'Kod nima chiqaradi?

t = (1, 2, 3)
print(t + (4,))', 'single',
   '[{"id": "a", "text": "(1, 2, 3, 4)", "is_correct": true}, {"id": "b", "text": "TypeError", "is_correct": false}, {"id": "c", "text": "(1, 2, 3, (4,))", "is_correct": false}, {"id": "d", "text": "[1, 2, 3, 4]", "is_correct": false}]'::jsonb,
   'Kortejni o''zgartirib bo''lmaydi, lekin ikki kortejni qo''shib YANGI kortej hosil qilish mumkin.', 1, 0),
  (t2, 'A matritsa 2×3, B matritsa 3×4 o''lchamda. A × B qanday o''lchamda bo''ladi?', 'single',
   '[{"id": "a", "text": "2×4", "is_correct": true}, {"id": "b", "text": "3×3", "is_correct": false}, {"id": "c", "text": "2×3", "is_correct": false}, {"id": "d", "text": "Ko''paytirib bo''lmaydi", "is_correct": false}]'::jsonb,
   'Natija satrlar sonini A dan, ustunlar sonini B dan oladi. A ning ustunlari soni B ning satrlari soniga teng bo''lishi shart (3 = 3).', 1, 1),
  (t2, 'Kod nima chiqaradi?

a = [[1, 2], [3, 4]]
print(a[1][0] * a[0][1])', 'single',
   '[{"id": "a", "text": "6", "is_correct": true}, {"id": "b", "text": "4", "is_correct": false}, {"id": "c", "text": "3", "is_correct": false}, {"id": "d", "text": "8", "is_correct": false}]'::jsonb,
   'a[1][0] = 3, a[0][1] = 2.', 1, 2),
  (t2, 'Kod nima chiqaradi?

x, *y = (1, 2, 3)
print(y)', 'single',
   '[{"id": "a", "text": "[2, 3]", "is_correct": true}, {"id": "b", "text": "(2, 3)", "is_correct": false}, {"id": "c", "text": "2", "is_correct": false}, {"id": "d", "text": "ValueError", "is_correct": false}]'::jsonb,
   'Yulduzcha qolgan elementlarni yig''adi va doim RO''YXAT hosil qiladi.', 1, 3);

  -- Topshiriqlar: 8-laboratoriya ishi: Kortejlar va matritsalar
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t2, 'Matritsalar yig''indisi',
   'Birinchi qatorda n va m. Keyingi n qatorda A matritsa, undan keyingi n qatorda B matritsa (har birida m tadan son). A + B ni chiqaring.',
   'n, m = map(int, input().split())
# Kodingizni yozing',
   'n, m = map(int, input().split())
A = [list(map(int, input().split())) for _ in range(n)]
B = [list(map(int, input().split())) for _ in range(n)]
for i in range(n):
    print(*[A[i][j] + B[i][j] for j in range(m)])',
   'python',
   '[{"input": "2 2\n1 2\n3 4\n5 6\n7 8", "expected_output": "6 8\n10 12", "is_hidden": false}, {"input": "1 3\n1 1 1\n-1 0 1", "expected_output": "0 1 2", "is_hidden": false}, {"input": "1 1\n0\n0", "expected_output": "0", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Ikkala matritsani alohida o''qing"}, {"order": 2, "text": "Mos elementlarni qo''shing: A[i][j] + B[i][j]"}]'::jsonb,
   'easy', 5, 15, 0),
  (t2, 'Matritsalar ko''paytmasi',
   'Birinchi qatorda n, k, m. Keyingi n qatorda A (n×k), undan keyingi k qatorda B (k×m). A × B ni chiqaring.',
   'n, k, m = map(int, input().split())
# Kodingizni yozing',
   'n, k, m = map(int, input().split())
A = [list(map(int, input().split())) for _ in range(n)]
B = [list(map(int, input().split())) for _ in range(k)]
for i in range(n):
    print(*[sum(A[i][t] * B[t][j] for t in range(k)) for j in range(m)])',
   'python',
   '[{"input": "2 2 2\n1 2\n3 4\n5 6\n7 8", "expected_output": "19 22\n43 50", "is_hidden": false}, {"input": "1 3 1\n1 2 3\n4\n5\n6", "expected_output": "32", "is_hidden": false}, {"input": "2 1 2\n1\n2\n3 4", "expected_output": "3 4\n6 8", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "C[i][j] = A[i][t] * B[t][j] larning t bo''yicha yig''indisi"}, {"order": 2, "text": "Uchta ichma-ich sikl yoki sum() bilan ikkita"}]'::jsonb,
   'hard', 12, 30, 1),
  (t2, 'Eng yaqin nuqta',
   'Birinchi qatorda n. Keyingi n qatorda nuqtalar koordinatalari "x y". Koordinata boshiga (0, 0) eng yaqin nuqtani chiqaring. Masofalar teng bo''lsa, kirishda birinchi kelganini oling.

Nuqtalarni kortejlar ro''yxatida saqlang.',
   'n = int(input())
# Kodingizni yozing',
   'n = int(input())
nuqtalar = [tuple(map(int, input().split())) for _ in range(n)]
eng = min(nuqtalar, key=lambda p: p[0] ** 2 + p[1] ** 2)
print(*eng)',
   'python',
   '[{"input": "3\n3 4\n-1 1\n5 0", "expected_output": "-1 1", "is_hidden": false}, {"input": "1\n7 7", "expected_output": "7 7", "is_hidden": false}, {"input": "2\n1 0\n0 1", "expected_output": "1 0", "is_hidden": true}, {"input": "3\n-2 -2\n2 1\n0 3", "expected_output": "2 1", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Ildiz chiqarish shart emas — kvadratlar yig''indisini solishtirish yetarli"}, {"order": 2, "text": "min(..., key=...) teng bo''lsa birinchisini qaytaradi"}]'::jsonb,
   'medium', 8, 20, 2);

  -- Testlar: 9-laboratoriya ishi: Istisnolar va kirish ma'lumotlarini tekshirish
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t3, 'Kod nima chiqaradi?

try:
    x = [1, 2][2]
except (IndexError, KeyError):
    print("A")
except Exception:
    print("B")', 'single',
   '[{"id": "a", "text": "A", "is_correct": true}, {"id": "b", "text": "B", "is_correct": false}, {"id": "c", "text": "A\nB", "is_correct": false}, {"id": "d", "text": "IndexError", "is_correct": false}]'::jsonb,
   'IndexError birinchi except dagi kortejda bor — u bajariladi, keyingilari tekshirilmaydi.', 1, 0),
  (t3, 'Kod nima chiqaradi?

def f():
    try:
        return 1
    finally:
        print("F", end=" ")

print(f())', 'single',
   '[{"id": "a", "text": "F 1", "is_correct": true}, {"id": "b", "text": "1", "is_correct": false}, {"id": "c", "text": "1 F", "is_correct": false}, {"id": "d", "text": "F", "is_correct": false}]'::jsonb,
   'finally return dan oldin bajariladi, keyin funksiya 1 ni qaytaradi va u chiqariladi.', 1, 1),
  (t3, '"5" + 5 qaysi istisnoni chiqaradi?', 'single',
   '[{"id": "a", "text": "TypeError", "is_correct": true}, {"id": "b", "text": "ValueError", "is_correct": false}, {"id": "c", "text": "SyntaxError", "is_correct": false}, {"id": "d", "text": "NameError", "is_correct": false}]'::jsonb,
   'Satr va sonni qo''shib bo''lmaydi — turlar mos emas.', 1, 2),
  (t3, 'O''zingizning istisno sinfingizni yaratishning to''g''ri usuli qaysi?', 'single',
   '[{"id": "a", "text": "class MeningXatom(Exception): pass", "is_correct": true}, {"id": "b", "text": "def MeningXatom(): raise", "is_correct": false}, {"id": "c", "text": "exception MeningXatom", "is_correct": false}, {"id": "d", "text": "MeningXatom = Error()", "is_correct": false}]'::jsonb,
   'Yangi istisno — Exception sinfidan meros oluvchi oddiy sinf.', 1, 3);

  -- Topshiriqlar: 9-laboratoriya ishi: Istisnolar va kirish ma'lumotlarini tekshirish
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t3, 'Kalkulyator',
   'Bitta qatorda ifoda: "a amal b", bu yerda amal +, -, *, / dan biri.

Natijani chiqaring (bo''lishda 2 xona aniqlikda, boshqalarida butun son). Xatolar uchun:
- son emas → "Son kiriting"
- nolga bo''lish → "Nolga bo''lib bo''lmaydi"
- noma''lum amal → "Noma''lum amal"',
   'a, amal, b = input().split()
# Kodingizni yozing',
   'a, amal, b = input().split()
try:
    a, b = int(a), int(b)
    if amal == "+":
        print(a + b)
    elif amal == "-":
        print(a - b)
    elif amal == "*":
        print(a * b)
    elif amal == "/":
        print(f"{a / b:.2f}")
    else:
        print("Noma''lum amal")
except ValueError:
    print("Son kiriting")
except ZeroDivisionError:
    print("Nolga bo''lib bo''lmaydi")',
   'python',
   '[{"input": "7 + 5", "expected_output": "12", "is_hidden": false}, {"input": "7 / 2", "expected_output": "3.50", "is_hidden": false}, {"input": "7 / 0", "expected_output": "Nolga bo''lib bo''lmaydi", "is_hidden": true}, {"input": "x * 2", "expected_output": "Son kiriting", "is_hidden": true}, {"input": "3 % 2", "expected_output": "Noma''lum amal", "is_hidden": true}, {"input": "-4 * 5", "expected_output": "-20", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Butun hisobni try ichiga joylang"}, {"order": 2, "text": "Har bir xato turiga alohida except"}]'::jsonb,
   'medium', 8, 20, 0),
  (t3, 'To''g''ri kiritmalarni sanash',
   'Birinchi qatorda n. Keyingi n qatorda yosh qiymatlari kiritiladi. To''g''ri yosh — 1 dan 120 gacha butun son.

Oxirida ikki son chiqaring: to''g''ri kiritmalar soni va ularning o''rtachasi (1 xona aniqlikda). To''g''ri kiritma bo''lmasa, ikkinchi son o''rniga "-" chiqaring.',
   'n = int(input())
# Kodingizni yozing',
   'n = int(input())
yoshlar = []
for _ in range(n):
    try:
        y = int(input())
    except ValueError:
        continue
    if 1 <= y <= 120:
        yoshlar.append(y)
if yoshlar:
    print(len(yoshlar), f"{sum(yoshlar) / len(yoshlar):.1f}")
else:
    print(0, "-")',
   'python',
   '[{"input": "5\n18\nabc\n25\n200\n-3", "expected_output": "2 21.5", "is_hidden": false}, {"input": "2\nx\ny", "expected_output": "0 -", "is_hidden": false}, {"input": "3\n1\n120\n60", "expected_output": "3 60.3", "is_hidden": true}, {"input": "1\n19.5", "expected_output": "0 -", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "int() xato bersa continue bilan keyingisiga o''ting"}, {"order": 2, "text": "Chegarani alohida if bilan tekshiring"}]'::jsonb,
   'medium', 8, 20, 1),
  (t3, 'O''z istisnoingiz',
   'ManfiyXato nomli istisno sinfini yarating. ildiz(x) funksiyasi x manfiy bo''lsa ManfiyXato chiqarsin, aks holda √x ni qaytarsin.

Kirishda n, keyingi n qatorda sonlar. Har biri uchun ildizni 3 xona aniqlikda yoki "Manfiy son: x" deb chiqaring.',
   'class ManfiyXato(Exception):
    pass

def ildiz(x):
    # Kodingizni yozing
    pass',
   'class ManfiyXato(Exception):
    pass

def ildiz(x):
    if x < 0:
        raise ManfiyXato(x)
    return x ** 0.5

n = int(input())
for _ in range(n):
    x = float(input())
    try:
        print(f"{ildiz(x):.3f}")
    except ManfiyXato:
        print(f"Manfiy son: {x:g}")',
   'python',
   '[{"input": "3\n16\n-4\n2", "expected_output": "4.000\nManfiy son: -4\n1.414", "is_hidden": false}, {"input": "1\n0", "expected_output": "0.000", "is_hidden": false}, {"input": "2\n-0.5\n9", "expected_output": "Manfiy son: -0.5\n3.000", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "raise ManfiyXato(x) — istisno chiqarish"}, {"order": 2, "text": "Chaqiruvni try / except ManfiyXato bilan o''rang"}]'::jsonb,
   'medium', 8, 20, 2);

  -- Testlar: 10-laboratoriya ishi: Rekursiv algoritmlar
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t4, 'Kod nima chiqaradi?

def f(n):
    if n <= 1:
        return n
    return f(n - 1) + f(n - 2)

print(f(7))', 'single',
   '[{"id": "a", "text": "13", "is_correct": true}, {"id": "b", "text": "8", "is_correct": false}, {"id": "c", "text": "21", "is_correct": false}, {"id": "d", "text": "7", "is_correct": false}]'::jsonb,
   'Bu Fibonachchi: 0, 1, 1, 2, 3, 5, 8, 13 — 7-o''rinda 13.', 1, 0),
  (t4, '4 ta turli elementning nechta o''rin almashtirishi (permutatsiyasi) bor?', 'single',
   '[{"id": "a", "text": "24", "is_correct": true}, {"id": "b", "text": "16", "is_correct": false}, {"id": "c", "text": "12", "is_correct": false}, {"id": "d", "text": "8", "is_correct": false}]'::jsonb,
   '4! = 4 × 3 × 2 × 1 = 24.', 1, 1),
  (t4, 'Memoizatsiya (natijalarni eslab qolish) rekursiv Fibonachchini nima uchun tezlashtiradi?', 'single',
   '[{"id": "a", "text": "Har bir fib(k) faqat bir marta hisoblanadi", "is_correct": true}, {"id": "b", "text": "Rekursiya chuqurligi kamayadi", "is_correct": false}, {"id": "c", "text": "Python kodni kompilyatsiya qiladi", "is_correct": false}, {"id": "d", "text": "Sonlar kichikroq bo''ladi", "is_correct": false}]'::jsonb,
   'Hisoblangan qiymat lug''atda saqlanadi va qayta so''ralganda tayyor javob qaytariladi.', 1, 2),
  (t4, 'Kod nima chiqaradi?

def f(s):
    if not s:
        return 0
    return (s[0] == "a") + f(s[1:])

print(f("banana"))', 'single',
   '[{"id": "a", "text": "3", "is_correct": true}, {"id": "b", "text": "2", "is_correct": false}, {"id": "c", "text": "6", "is_correct": false}, {"id": "d", "text": "0", "is_correct": false}]'::jsonb,
   'Funksiya ''a'' harflarini sanaydi. True qo''shilganda 1 ga teng.', 1, 3);

  -- Topshiriqlar: 10-laboratoriya ishi: Rekursiv algoritmlar
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t4, 'Kombinatsiyalar soni',
   'Ikki son n va k berilgan (0 ≤ k ≤ n ≤ 30). n ta elementdan k tasini tanlash usullari sonini C(n, k) rekursiv formula bilan hisoblang:

C(n, 0) = C(n, n) = 1
C(n, k) = C(n−1, k−1) + C(n−1, k)

Tezlik uchun natijalarni eslab qoling.',
   'def C(n, k):
    # Kodingizni yozing
    pass

n, k = map(int, input().split())
print(C(n, k))',
   'xotira = {}

def C(n, k):
    if k == 0 or k == n:
        return 1
    if (n, k) not in xotira:
        xotira[(n, k)] = C(n - 1, k - 1) + C(n - 1, k)
    return xotira[(n, k)]

n, k = map(int, input().split())
print(C(n, k))',
   'python',
   '[{"input": "5 2", "expected_output": "10", "is_hidden": false}, {"input": "4 0", "expected_output": "1", "is_hidden": false}, {"input": "6 6", "expected_output": "1", "is_hidden": true}, {"input": "30 15", "expected_output": "155117520", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Kalit sifatida (n, k) kortejini ishlating"}, {"order": 2, "text": "Eslab qolmasangiz 30 15 juda sekin hisoblanadi"}]'::jsonb,
   'medium', 8, 20, 0),
  (t4, 'Barcha qism to''plamlar',
   'Bitta qatorda bo''shliq bilan ajratilgan turli harflar. Ularning barcha qism to''plamlarini rekursiv usulda toping.

Har bir qism to''plamni harflari kirish tartibida, bitta qatorda (bo''shliqsiz) chiqaring. Bo''sh to''plam uchun "-" chiqaring. Qatorlar tartibi: avval birinchi harfni olmagan, keyin olgan variantlar (rekursiv daraxt bo''yicha).',
   'harflar = input().split()
# Kodingizni yozing',
   'harflar = input().split()

def qism(i, tanlangan):
    if i == len(harflar):
        print("".join(tanlangan) or "-")
        return
    qism(i + 1, tanlangan)
    qism(i + 1, tanlangan + [harflar[i]])

qism(0, [])',
   'python',
   '[{"input": "a b", "expected_output": "-\nb\na\nab", "is_hidden": false}, {"input": "x", "expected_output": "-\nx", "is_hidden": false}, {"input": "a b c", "expected_output": "-\nc\nb\nbc\na\nac\nab\nabc", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Har bir harf uchun ikki tanlov: olish yoki olmaslik"}, {"order": 2, "text": "Avval olmaydigan tarmoqni chaqiring"}]'::jsonb,
   'hard', 12, 30, 1),
  (t4, 'Ichma-ich ro''yxat chuqurligi',
   'Bitta qatorda Python ro''yxati yozilgan, masalan [1, [2, [3]], 4]. Uning eng katta ichma-ichlik chuqurligini rekursiv toping. Oddiy ro''yxatning chuqurligi 1, bo''sh ro''yxatniki ham 1.

Kirishni o''qish uchun: import ast; a = ast.literal_eval(input())',
   'import ast
a = ast.literal_eval(input())

def chuqurlik(x):
    # Kodingizni yozing
    pass

print(chuqurlik(a))',
   'import ast
a = ast.literal_eval(input())

def chuqurlik(x):
    if not isinstance(x, list):
        return 0
    return 1 + max([chuqurlik(y) for y in x] + [0])

print(chuqurlik(a))',
   'python',
   '[{"input": "[1, [2, [3]], 4]", "expected_output": "3", "is_hidden": false}, {"input": "[]", "expected_output": "1", "is_hidden": false}, {"input": "[1, 2, 3]", "expected_output": "1", "is_hidden": true}, {"input": "[[[[]]]]", "expected_output": "4", "is_hidden": true}, {"input": "[[1], [2, [3, [4]]]]", "expected_output": "4", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Ro''yxat bo''lmagan element chuqurligi 0"}, {"order": 2, "text": "Ro''yxat chuqurligi = 1 + elementlar chuqurligining eng kattasi"}]'::jsonb,
   'medium', 8, 20, 2);

  -- Testlar: 11-laboratoriya ishi: Saralash algoritmlarini taqqoslash
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t5, 'n ikki baravar oshganda pufakchali saralash vaqti taxminan qanday o''zgaradi?', 'single',
   '[{"id": "a", "text": "4 baravar oshadi", "is_correct": true}, {"id": "b", "text": "2 baravar oshadi", "is_correct": false}, {"id": "c", "text": "O''zgarmaydi", "is_correct": false}, {"id": "d", "text": "8 baravar oshadi", "is_correct": false}]'::jsonb,
   'Solishtirishlar soni n² ga proporsional: (2n)² = 4n².', 1, 0),
  (t5, 'Kod nima chiqaradi?

def b(x, y):
    r, i, j = [], 0, 0
    while i < len(x) and j < len(y):
        if x[i] <= y[j]:
            r.append(x[i]); i += 1
        else:
            r.append(y[j]); j += 1
    return r + x[i:] + y[j:]

print(b([1, 4, 9], [2, 3, 10]))', 'single',
   '[{"id": "a", "text": "[1, 2, 3, 4, 9, 10]", "is_correct": true}, {"id": "b", "text": "[1, 4, 9, 2, 3, 10]", "is_correct": false}, {"id": "c", "text": "[1, 2, 3, 4, 9]", "is_correct": false}, {"id": "d", "text": "[10, 9, 4, 3, 2, 1]", "is_correct": false}]'::jsonb,
   'Ikki tartiblangan ro''yxat bitta tartiblangan ro''yxatga birlashtiriladi. Qolgan elementlar oxiriga qo''shiladi.', 1, 1),
  (t5, '6 elementli ro''yxatni pufakchali saralash (har o''tishda oxirgi joylashganini tekshirmasdan) nechta solishtirish qiladi?', 'single',
   '[{"id": "a", "text": "15", "is_correct": true}, {"id": "b", "text": "36", "is_correct": false}, {"id": "c", "text": "6", "is_correct": false}, {"id": "d", "text": "30", "is_correct": false}]'::jsonb,
   '5 + 4 + 3 + 2 + 1 = 15 = 6·5/2.', 1, 2),
  (t5, 'Birlashtirib saralash (merge sort) qaysi g''oyaga asoslanadi?', 'single',
   '[{"id": "a", "text": "Bo''l va hukmronlik qil: ikkiga bo''lib, alohida saralab, birlashtirish", "is_correct": true}, {"id": "b", "text": "Qo''shni elementlarni almashtirish", "is_correct": false}, {"id": "c", "text": "Har qadamda eng kichigini topish", "is_correct": false}, {"id": "d", "text": "Tasodifiy aralashtirish", "is_correct": false}]'::jsonb,
   'Ro''yxat rekursiv ravishda yarimlarga bo''linadi, keyin tartiblangan yarimlar birlashtiriladi.', 1, 3);

  -- Topshiriqlar: 11-laboratoriya ishi: Saralash algoritmlarini taqqoslash
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t5, 'Birlashtirib saralash',
   'Birinchi qatorda n, ikkinchi qatorda n ta son. Birlashtirib saralash (merge sort) algoritmini o''zingiz yozib, sonlarni o''sish tartibida chiqaring. sort() va sorted() ishlatmang.',
   'def merge_sort(a):
    # Kodingizni yozing
    pass

n = int(input())
print(*merge_sort(list(map(int, input().split()))))',
   'def merge_sort(a):
    if len(a) <= 1:
        return a
    o = len(a) // 2
    x, y = merge_sort(a[:o]), merge_sort(a[o:])
    r, i, j = [], 0, 0
    while i < len(x) and j < len(y):
        if x[i] <= y[j]:
            r.append(x[i]); i += 1
        else:
            r.append(y[j]); j += 1
    return r + x[i:] + y[j:]

n = int(input())
print(*merge_sort(list(map(int, input().split()))))',
   'python',
   '[{"input": "7\n5 3 8 1 9 2 7", "expected_output": "1 2 3 5 7 8 9", "is_hidden": false}, {"input": "1\n4", "expected_output": "4", "is_hidden": false}, {"input": "5\n2 2 1 1 3", "expected_output": "1 1 2 2 3", "is_hidden": true}, {"input": "4\n-3 10 -7 0", "expected_output": "-7 -3 0 10", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Asosiy holat: 0 yoki 1 element"}, {"order": 2, "text": "Ikki tartiblangan yarimni ikkita ko''rsatkich (i, j) bilan birlashtiring"}]'::jsonb,
   'hard', 12, 30, 0),
  (t5, 'Almashtirishlar soni',
   'Birinchi qatorda n, ikkinchi qatorda n ta son. Pufakchali saralash ro''yxatni tartiblash uchun nechta ALMASHTIRISH (swap) bajarishini hisoblang.',
   'n = int(input())
a = list(map(int, input().split()))
# Kodingizni yozing',
   'n = int(input())
a = list(map(int, input().split()))
soni = 0
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            soni += 1
print(soni)',
   'python',
   '[{"input": "4\n4 3 2 1", "expected_output": "6", "is_hidden": false}, {"input": "3\n1 2 3", "expected_output": "0", "is_hidden": false}, {"input": "5\n2 1 3 5 4", "expected_output": "2", "is_hidden": true}, {"input": "1\n9", "expected_output": "0", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Sanoqni faqat almashtirish bajarilganda oshiring"}, {"order": 2, "text": "Teskari tartiblangan n elementda n(n-1)/2 almashtirish bo''ladi"}]'::jsonb,
   'easy', 5, 15, 1),
  (t5, 'Ikki tartiblangan ro''yxatni birlashtirish',
   'To''rt qator: n, o''sish tartibidagi n ta son, m, o''sish tartibidagi m ta son. Ikkala ro''yxatni bitta o''sish tartibidagi ro''yxatga birlashtiring.

sorted() ishlatmang — ikki ko''rsatkich usulidan foydalaning (n, m ≥ 1).',
   'n = int(input())
a = list(map(int, input().split()))
m = int(input())
b = list(map(int, input().split()))
# Kodingizni yozing',
   'n = int(input())
a = list(map(int, input().split()))
m = int(input())
b = list(map(int, input().split()))
r, i, j = [], 0, 0
while i < n and j < m:
    if a[i] <= b[j]:
        r.append(a[i]); i += 1
    else:
        r.append(b[j]); j += 1
r += a[i:] + b[j:]
print(*r)',
   'python',
   '[{"input": "3\n1 4 9\n3\n2 3 10", "expected_output": "1 2 3 4 9 10", "is_hidden": false}, {"input": "2\n1 2\n1\n0", "expected_output": "0 1 2", "is_hidden": false}, {"input": "1\n5\n4\n1 2 3 4", "expected_output": "1 2 3 4 5", "is_hidden": true}, {"input": "2\n3 3\n2\n3 3", "expected_output": "3 3 3 3", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "i va j — har bir ro''yxatdagi joriy o''rin"}, {"order": 2, "text": "Sikl tugagach qolgan elementlarni oxiriga qo''shing"}]'::jsonb,
   'medium', 8, 20, 2);

  -- Testlar: 12-laboratoriya ishi: Sinflar, meros va inkapsulyatsiya
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t6, 'Kod nima chiqaradi?

class A: pass
class B(A): pass

print(isinstance(B(), A), isinstance(A(), B))', 'single',
   '[{"id": "a", "text": "True False", "is_correct": true}, {"id": "b", "text": "True True", "is_correct": false}, {"id": "c", "text": "False True", "is_correct": false}, {"id": "d", "text": "False False", "is_correct": false}]'::jsonb,
   'Bola sinf obyekti ota sinfning ham obyekti hisoblanadi, lekin aksincha emas.', 1, 0),
  (t6, '@property nima uchun ishlatiladi?', 'single',
   '[{"id": "a", "text": "Metodni atribut kabi o''qish va yozishni nazorat qilish uchun", "is_correct": true}, {"id": "b", "text": "Sinfni o''zgarmas qilish uchun", "is_correct": false}, {"id": "c", "text": "Statik metod yaratish uchun", "is_correct": false}, {"id": "d", "text": "Merosni taqiqlash uchun", "is_correct": false}]'::jsonb,
   't.selsiy = 25 ko''rinishda yozilsa ham, aslida setter metod chaqiriladi va qiymat tekshiriladi.', 1, 1),
  (t6, 'Obyektlar ro''yxatini sorted() bilan saralash uchun sinfda qaysi metod bo''lishi yetarli?', 'single',
   '[{"id": "a", "text": "__lt__", "is_correct": true}, {"id": "b", "text": "__str__", "is_correct": false}, {"id": "c", "text": "__init__", "is_correct": false}, {"id": "d", "text": "__len__", "is_correct": false}]'::jsonb,
   'sorted() elementlarni < operatori bilan solishtiradi, u esa __lt__ ni chaqiradi.', 1, 2),
  (t6, 'Kod nima chiqaradi?

class A:
    def __init__(self):
        self.x = 1

class B(A):
    def __init__(self):
        self.y = 2

b = B()
print(hasattr(b, "x"), hasattr(b, "y"))', 'single',
   '[{"id": "a", "text": "False True", "is_correct": true}, {"id": "b", "text": "True True", "is_correct": false}, {"id": "c", "text": "True False", "is_correct": false}, {"id": "d", "text": "False False", "is_correct": false}]'::jsonb,
   'B ning konstruktori super().__init__() ni chaqirmagan — shuning uchun x atributi yaratilmagan.', 1, 3);

  -- Topshiriqlar: 12-laboratoriya ishi: Sinflar, meros va inkapsulyatsiya
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t6, 'Kasrlar sinfi',
   'Kasr sinfini yarating: surat va maxraj, kasr har doim qisqartirilgan holda saqlansin (maxraj musbat), __add__ metodi ikki kasrni qo''shsin, __str__ "s/m" ko''rinishini qaytarsin (maxraj 1 bo''lsa faqat surat).

Kirishda ikki qatorda ikki kasr "s m" ko''rinishida. Ularning yig''indisini chiqaring.',
   'from math import gcd

class Kasr:
    # Kodingizni yozing
    pass

a = Kasr(*map(int, input().split()))
b = Kasr(*map(int, input().split()))
print(a + b)',
   'from math import gcd

class Kasr:
    def __init__(self, s, m):
        if m < 0:
            s, m = -s, -m
        g = gcd(s, m)
        self.s, self.m = s // g, m // g

    def __add__(self, b):
        return Kasr(self.s * b.m + b.s * self.m, self.m * b.m)

    def __str__(self):
        return str(self.s) if self.m == 1 else f"{self.s}/{self.m}"

a = Kasr(*map(int, input().split()))
b = Kasr(*map(int, input().split()))
print(a + b)',
   'python',
   '[{"input": "1 2\n1 3", "expected_output": "5/6", "is_hidden": false}, {"input": "1 2\n1 2", "expected_output": "1", "is_hidden": false}, {"input": "1 -4\n3 4", "expected_output": "1/2", "is_hidden": true}, {"input": "2 6\n-1 3", "expected_output": "0", "is_hidden": true}, {"input": "7 10\n2 5", "expected_output": "11/10", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "gcd() — EKUB, surat va maxrajni unga bo''ling"}, {"order": 2, "text": "a / b + c / d = (a·d + c·b) / (b·d)"}]'::jsonb,
   'medium', 8, 20, 0),
  (t6, 'Himoyalangan balans',
   'Hamyon sinfini yarating: balans ichki atributda saqlansin, faqat metodlar orqali o''zgarsin. balans o''qish uchun @property bo''lsin.

Kirishda n, keyingi n qatorda amallar: "kirim summa" yoki "chiqim summa". Summa musbat bo''lmasa "Noto''g''ri summa", chiqim balansdan oshsa "Yetarli emas" chiqarilsin va amal bajarilmasin. Oxirida balansni chiqaring.',
   'class Hamyon:
    # Kodingizni yozing
    pass',
   'class Hamyon:
    def __init__(self):
        self._b = 0

    @property
    def balans(self):
        return self._b

    def kirim(self, s):
        if s <= 0:
            print("Noto''g''ri summa")
            return
        self._b += s

    def chiqim(self, s):
        if s <= 0:
            print("Noto''g''ri summa")
            return
        if s > self._b:
            print("Yetarli emas")
            return
        self._b -= s

h = Hamyon()
for _ in range(int(input())):
    amal, s = input().split()
    getattr(h, amal)(int(s))
print(h.balans)',
   'python',
   '[{"input": "4\nkirim 100\nchiqim 30\nchiqim 100\nkirim -5", "expected_output": "Yetarli emas\nNoto''g''ri summa\n70", "is_hidden": false}, {"input": "1\nkirim 0", "expected_output": "Noto''g''ri summa\n0", "is_hidden": false}, {"input": "2\nkirim 50\nchiqim 50", "expected_output": "0", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Ichki atributni self._b deb nomlang"}, {"order": 2, "text": "Tekshiruvlarni metodlarning o''ziga joylang"}]'::jsonb,
   'medium', 8, 20, 1),
  (t6, 'Xodimlar ish haqi',
   'Xodim ota sinfi va undan meros oluvchi Soatbay (soat × stavka) hamda Oylik (belgilangan oylik + bonus) sinflarini yarating. Har birida maosh() metodi bo''lsin.

Kirishda n, keyingi n qatorda: "soatbay ism soat stavka" yoki "oylik ism oylik bonus". Xodimlarni maoshi kamayishi bo''yicha (teng bo''lsa ism bo''yicha) "ism maosh" ko''rinishida, oxirida jami fondni chiqaring.',
   'class Xodim:
    def __init__(self, ism):
        self.ism = ism
    def maosh(self):
        return 0

# Soatbay va Oylik sinflari',
   'class Xodim:
    def __init__(self, ism):
        self.ism = ism
    def maosh(self):
        return 0

class Soatbay(Xodim):
    def __init__(self, ism, soat, stavka):
        super().__init__(ism)
        self.soat, self.stavka = soat, stavka
    def maosh(self):
        return self.soat * self.stavka

class Oylik(Xodim):
    def __init__(self, ism, oylik, bonus):
        super().__init__(ism)
        self.oylik, self.bonus = oylik, bonus
    def maosh(self):
        return self.oylik + self.bonus

turlar = {"soatbay": Soatbay, "oylik": Oylik}
xodimlar = []
for _ in range(int(input())):
    tur, ism, a, b = input().split()
    xodimlar.append(turlar[tur](ism, int(a), int(b)))
for x in sorted(xodimlar, key=lambda x: (-x.maosh(), x.ism)):
    print(x.ism, x.maosh())
print(sum(x.maosh() for x in xodimlar))',
   'python',
   '[{"input": "3\nsoatbay Ali 160 30000\noylik Vali 5000000 500000\nsoatbay Sardor 100 50000", "expected_output": "Vali 5500000\nSardor 5000000\nAli 4800000\n15300000", "is_hidden": false}, {"input": "1\noylik Zarina 3000000 0", "expected_output": "Zarina 3000000\n3000000", "is_hidden": false}, {"input": "2\nsoatbay B 10 10\nsoatbay A 20 5", "expected_output": "A 100\nB 100\n200", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Ikkala bola sinf super().__init__(ism) ni chaqiradi"}, {"order": 2, "text": "Saralash kaliti: (-x.maosh(), x.ism)"}]'::jsonb,
   'hard', 12, 30, 2);

END $$;
