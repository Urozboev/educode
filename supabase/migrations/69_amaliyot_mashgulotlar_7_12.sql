-- ============================================================
-- MirAcademy — "Dasturlash asoslari (Amaliyot)" kursi: 7-12 mashg'ulotlar
--
--  7. Ro'yxat va lug'at bilan ishlash
--  8. Matnlarga ishlov berish
--  9. Ichma-ich ro'yxatlar va matritsalar
-- 10. Rekursiya
-- 11. Saralash va qidiruv
-- 12. Sinflar va obyektlar
--
-- Har bir mashg'ulot: yechilgan namunalar, 5 ta test, 3-4 ta topshiriq.
-- Topshiriqlar stdin → stdout tartibida.
--
-- Sifat nazorati: namunalar natijasi CPython'da ishga tushirib
-- yozilgan, "kod nima chiqaradi" testlari va barcha topshiriq
-- yechimlari ham ishga tushirib tekshirilgan.
--
-- 31-migratsiyadan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz.
-- ============================================================

DO $$
DECLARE
  v_course UUID;
  t1 UUID; t2 UUID; t3 UUID; t4 UUID; t5 UUID; t6 UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-amaliyot';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: dasturlash-asoslari-amaliyot';
  END IF;

  -- ==========================================================
  -- 7. 7-amaliy mashg'ulot: Ro'yxat va lug'at bilan ishlash
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '7-amaliy mashg''ulot: Ro''yxat va lug''at bilan ishlash', 'amaliy-7-royxat-lugat',
$html$
<h2>Mashg'ulot maqsadi</h2>
<p>Ro'yxat va lug'atni birga ishlatib, real ma'lumotlarni qayta ishlashni mashq qilish: sanash, guruhlash, eng kattasini topish va natijani tartib bilan chiqarish.</p>

<h3>Namuna 1. Elementlarni sanash</h3>
<pre><code>mevalar = input().split()
sanoq = {}
for m in mevalar:
    sanoq[m] = sanoq.get(m, 0) + 1
for m, n in sanoq.items():
    print(m, n)</code></pre>
<p class="text-xs"><b>Kirish:</b></p><pre><code>olma nok olma uzum nok olma</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>olma 3
nok 2
uzum 1</code></pre>
<p><code>sanoq.get(m, 0)</code> — kalit bo'lmasa 0 qaytaradi. Bu <code>if m in sanoq</code> tekshiruvini yozmaslik imkonini beradi.</p>

<h3>Namuna 2. Guruhlash</h3>
<pre><code>sozlar = ["olma", "anor", "nok", "ayva", "uzum", "nash"]
guruh = {}
for s in sozlar:
    harf = s[0]
    guruh.setdefault(harf, []).append(s)
for harf in sorted(guruh):
    print(harf, guruh[harf])</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>a ['anor', 'ayva']
n ['nok', 'nash']
o ['olma']
u ['uzum']</code></pre>
<p><code>setdefault(kalit, [])</code> kalit bo'lmasa bo'sh ro'yxat yaratib qo'yadi va uni qaytaradi — keyin unga darhol <code>append</code> qilish mumkin.</p>

<h3>Namuna 3. Lug'atni qiymat bo'yicha saralash</h3>
<pre><code>ballar = {"Ali": 87, "Vali": 92, "Dilnoza": 78}
for ism, ball in sorted(ballar.items(), key=lambda x: x[1], reverse=True):
    print(f"{ism:10}{ball}")</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Vali      92
Ali       87
Dilnoza   78</code></pre>
<p><code>items()</code> juftliklar beradi, <code>key=lambda x: x[1]</code> — ikkinchi element (ball) bo'yicha saralash. <code>{ism:10}</code> ismni 10 belgilik maydonga joylaydi — jadval tekis chiqadi.</p>

<h3>Namuna 4. Ro'yxat generatorlari</h3>
<pre><code>sonlar = [4, -2, 7, 0, -5, 9]
musbat = [x for x in sonlar if x &gt; 0]
kvadratlar = [x * x for x in musbat]
print(musbat)
print(kvadratlar)
print({x: x * x for x in range(1, 5)})</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[4, 7, 9]
[16, 49, 81]
{1: 1, 2: 4, 3: 9, 4: 16}</code></pre>
<p>Ro'yxat (va lug'at) generatori — <code>for</code> + <code>append</code> ning qisqa yozilishi.</p>

<h3>Ish tartibi</h3>
<ol>
  <li>Har bir namunani o'zingiz yozib chiqing, ko'chirib qo'ymang</li>
  <li>Kirish qiymatlarini o'zgartirib, natija qanday o'zgarishini kuzating</li>
  <li>Testlarni yeching, keyin topshiriqlarni bajaring</li>
</ol>
$html$,
    7, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t1;

  -- ==========================================================
  -- 8. 8-amaliy mashg'ulot: Matnlarga ishlov berish
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '8-amaliy mashg''ulot: Matnlarga ishlov berish', 'amaliy-8-matnlar',
$html$
<h2>Mashg'ulot maqsadi</h2>
<p>Satr metodlari yordamida matnni tozalash, bo'laklash, almashtirish va formatlashni mashq qilish. Bu ko'nikmalar foydalanuvchi kiritgan ma'lumotni tekshirish, hisobot tayyorlash va matnli fayllarni qayta ishlashda har kuni kerak bo'ladi.</p>

<h3>Eng kerakli metodlar</h3>
<table>
  <tr><th>Metod</th><th>Vazifasi</th></tr>
  <tr><td><code>strip()</code></td><td>Chetlardagi bo'shliqlarni olib tashlaydi</td></tr>
  <tr><td><code>lower()</code>, <code>upper()</code>, <code>title()</code></td><td>Harf registrini o'zgartiradi</td></tr>
  <tr><td><code>split(ajratgich)</code></td><td>Satrni ro'yxatga bo'ladi</td></tr>
  <tr><td><code>"ajratgich".join(royxat)</code></td><td>Ro'yxatni satrga birlashtiradi</td></tr>
  <tr><td><code>replace(eski, yangi)</code></td><td>Almashtiradi</td></tr>
  <tr><td><code>find(qism)</code></td><td>Qism indeksini topadi, topilmasa -1</td></tr>
  <tr><td><code>startswith()</code>, <code>endswith()</code></td><td>Boshi/oxirini tekshiradi</td></tr>
  <tr><td><code>isdigit()</code>, <code>isalpha()</code></td><td>Faqat raqammi / faqat harfmi</td></tr>
</table>
<p>Muhim: satr <b>o'zgarmas</b>. Metodlar asl satrni o'zgartirmaydi, yangi satr qaytaradi.</p>

<h3>Namuna 1. Ismni tozalash</h3>
<pre><code>ism = input()
toza = " ".join(ism.split()).title()
print(f"[{toza}]")</code></pre>
<p class="text-xs"><b>Kirish:</b></p><pre><code>   aLI    valiyev  </code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[Ali Valiyev]</code></pre>
<p><code>split()</code> argumentsiz chaqirilsa, ketma-ket bo'shliqlarni bitta deb hisoblaydi. Keyin <code>join</code> so'zlarni bittadan bo'shliq bilan qayta yig'adi.</p>

<h3>Namuna 2. Sana formatini o'zgartirish</h3>
<pre><code>sana = input()             # 2026-10-11
yil, oy, kun = sana.split("-")
print(f"{kun}.{oy}.{yil}")</code></pre>
<p class="text-xs"><b>Kirish:</b></p><pre><code>2026-10-11</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>11.10.2026</code></pre>

<h3>Namuna 3. Telefon raqamini tekshirish</h3>
<pre><code>for tel in ["+998901234567", "+99890123", "998901234567", "+998 90 123"]:
    raqam = tel[1:]
    togri = tel.startswith("+998") and raqam.isdigit() and len(raqam) == 12
    print(tel, "-&gt;", "to'g'ri" if togri else "xato")</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>+998901234567 -&gt; to'g'ri
+99890123 -&gt; xato
998901234567 -&gt; xato
+998 90 123 -&gt; xato</code></pre>

<h3>Namuna 4. Matndan sonlarni ajratib olish</h3>
<pre><code>matn = "Sinfda 28 o'quvchi, ulardan 15 qiz va 13 o'g'il"
sonlar = [int(s) for s in matn.split() if s.isdigit()]
print(sonlar, sum(sonlar[1:]) == sonlar[0])</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[28, 15, 13] True</code></pre>

<h3>Ish tartibi</h3>
<ol>
  <li>Har bir namunani o'zingiz yozib chiqing, ko'chirib qo'ymang</li>
  <li>Kirish qiymatlarini o'zgartirib, natija qanday o'zgarishini kuzating</li>
  <li>Testlarni yeching, keyin topshiriqlarni bajaring</li>
</ol>
$html$,
    8, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t2;

  -- ==========================================================
  -- 9. 9-amaliy mashg'ulot: Ichma-ich ro'yxatlar va matritsalar
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '9-amaliy mashg''ulot: Ichma-ich ro''yxatlar va matritsalar', 'amaliy-9-matritsa',
$html$
<h2>Mashg'ulot maqsadi</h2>
<p>Ikki o'lchovli ro'yxatlarni (matritsalarni) kiritish, chiqarish va ular ustida amallar bajarishni mashq qilish. Jadvallar, o'yin maydonlari (shaxmat, tic-tac-toe), rasmlar — hammasi aslida matritsa.</p>

<h3>Namuna 1. Matritsani kiritish va chiqarish</h3>
<pre><code>n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
for satr in a:
    print(*satr)
print("Jami:", sum(sum(satr) for satr in a))</code></pre>
<p class="text-xs"><b>Kirish:</b></p><pre><code>2 3
1 2 3
4 5 6</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>1 2 3
4 5 6
Jami: 21</code></pre>

<h3>Namuna 2. Ustunlar yig'indisi</h3>
<pre><code>a = [[1, 2, 3], [4, 5, 6]]
n, m = len(a), len(a[0])
for j in range(m):
    print(sum(a[i][j] for i in range(n)), end=" ")
print()</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>5 7 9 </code></pre>
<p>Satr bo'yicha yurish oson (<code>for satr in a</code>), ustun bo'yicha esa indeks kerak: <code>a[i][j]</code>, bu yerda <code>j</code> o'zgarmas, <code>i</code> esa yuradi.</p>

<h3>Namuna 3. Bo'sh maydon yaratish</h3>
<pre><code>n = 3
maydon = [["." for _ in range(n)] for _ in range(n)]
maydon[1][1] = "X"
maydon[0][2] = "O"
for satr in maydon:
    print(" ".join(satr))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>. . O
. X .
. . .</code></pre>
<p>Eslatma: <code>[["."] * n] * n</code> yozmang — barcha satrlar bitta ro'yxatga bog'lanib qoladi.</p>

<h3>Namuna 4. Qo'shnilarni tekshirish</h3>
<pre><code>a = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
i, j = 0, 1
qoshnilar = []
for di, dj in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
    ni, nj = i + di, j + dj
    if 0 &lt;= ni &lt; 3 and 0 &lt;= nj &lt; 3:
        qoshnilar.append(a[ni][nj])
print(qoshnilar)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[5, 1, 3]</code></pre>
<p>Chegaradan chiqmaslik tekshiruvi (<code>0 &lt;= ni &lt; n</code>) — matritsa masalalaridagi eng ko'p unutiladigan qism.</p>

<h3>Ish tartibi</h3>
<ol>
  <li>Har bir namunani o'zingiz yozib chiqing, ko'chirib qo'ymang</li>
  <li>Kirish qiymatlarini o'zgartirib, natija qanday o'zgarishini kuzating</li>
  <li>Testlarni yeching, keyin topshiriqlarni bajaring</li>
</ol>
$html$,
    9, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t3;

  -- ==========================================================
  -- 10. 10-amaliy mashg'ulot: Rekursiya
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '10-amaliy mashg''ulot: Rekursiya', 'amaliy-10-rekursiya',
$html$
<h2>Mashg'ulot maqsadi</h2>
<p>Rekursiv funksiyalarni yozish, asosiy holatni to'g'ri tanlash va chaqiruvlar ketma-ketligini qog'ozda kuzatishni mashq qilish.</p>

<h3>Rekursiya yozish rejasi</h3>
<ol>
  <li><b>Eng kichik holat</b> qanday va uning javobi nima? (asosiy holat)</li>
  <li>Masalani qanday qilib <b>bir qadam kichraytirish</b> mumkin?</li>
  <li>Kichikroq masala javobi ma'lum bo'lsa, katta masala javobini qanday yig'amiz?</li>
</ol>

<h3>Namuna 1. Ro'yxat yig'indisi</h3>
<pre><code>def yigindi(a):
    if not a:                 # bo'sh ro'yxat
        return 0
    return a[0] + yigindi(a[1:])

print(yigindi([3, 5, 2, 10]))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>20</code></pre>
<p>G'oya: ro'yxat yig'indisi = birinchi element + qolgan qism yig'indisi.</p>

<h3>Namuna 2. Chaqiruvlarni kuzatish</h3>
<pre><code>def sanoq(n, chuqurlik=0):
    print("  " * chuqurlik + f"sanoq({n})")
    if n == 0:
        return
    sanoq(n - 1, chuqurlik + 1)
    print("  " * chuqurlik + f"{n} tugadi")

sanoq(3)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>sanoq(3)
  sanoq(2)
    sanoq(1)
      sanoq(0)
    1 tugadi
  2 tugadi
3 tugadi</code></pre>
<p>E'tibor bering: "tugadi" xabarlari <b>teskari</b> tartibda chiqdi. Ichki chaqiruv tugamaguncha tashqisi davom etmaydi.</p>

<h3>Namuna 3. EKUB — Yevklid algoritmi</h3>
<pre><code>def ekub(a, b):
    if b == 0:
        return a
    return ekub(b, a % b)

print(ekub(48, 18), ekub(17, 5))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>6 1</code></pre>

<h3>Namuna 4. Barcha kombinatsiyalar</h3>
<pre><code>def ikkilik_satrlar(n, prefiks=""):
    if n == 0:
        print(prefiks)
        return
    ikkilik_satrlar(n - 1, prefiks + "0")
    ikkilik_satrlar(n - 1, prefiks + "1")

ikkilik_satrlar(3)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>000
001
010
011
100
101
110
111</code></pre>
<p>Har bir chaqiruv ikki tarmoqqa ajraladi. Bunday "hamma variantlarni sinab ko'rish" masalalarini rekursiyasiz yozish ancha qiyin.</p>

<h3>Ish tartibi</h3>
<ol>
  <li>Har bir namunani o'zingiz yozib chiqing, ko'chirib qo'ymang</li>
  <li>Kirish qiymatlarini o'zgartirib, natija qanday o'zgarishini kuzating</li>
  <li>Testlarni yeching, keyin topshiriqlarni bajaring</li>
</ol>
$html$,
    10, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t4;

  -- ==========================================================
  -- 11. 11-amaliy mashg'ulot: Saralash va qidiruv
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '11-amaliy mashg''ulot: Saralash va qidiruv', 'amaliy-11-algoritmlar',
$html$
<h2>Mashg'ulot maqsadi</h2>
<p>Qidiruv va saralash algoritmlarini qo'lda yozish, ularni o'rnatilgan <code>sorted()</code> bilan taqqoslash va har xil kalitlar bo'yicha saralashni mashq qilish.</p>

<h3>Namuna 1. Qadamlarni sanab taqqoslash</h3>
<pre><code>sonlar = list(range(1, 1001))
nishon = 997

qadam = 0
for x in sonlar:
    qadam += 1
    if x == nishon:
        break
print("Chiziqli:", qadam, "qadam")

chap, ong, qadam = 0, len(sonlar) - 1, 0
while chap &lt;= ong:
    qadam += 1
    orta = (chap + ong) // 2
    if sonlar[orta] == nishon:
        break
    if sonlar[orta] &lt; nishon:
        chap = orta + 1
    else:
        ong = orta - 1
print("Ikkilik:", qadam, "qadam")</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Chiziqli: 997 qadam
Ikkilik: 8 qadam</code></pre>

<h3>Namuna 2. Qo'shib saralash (insertion sort)</h3>
<pre><code>def qoshib_saralash(a):
    a = a[:]
    for i in range(1, len(a)):
        x = a[i]
        j = i - 1
        while j &gt;= 0 and a[j] &gt; x:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = x
    return a

print(qoshib_saralash([5, 2, 9, 1, 7, 3]))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[1, 2, 3, 5, 7, 9]</code></pre>
<p>Karta o'yinchisi qo'lidagi kartalarni shunday tartiblaydi: har yangi kartani o'z joyiga qo'yadi. Deyarli tartiblangan ro'yxatda bu usul juda tez.</p>

<h3>Namuna 3. Bir nechta kalit bo'yicha saralash</h3>
<pre><code>mahsulotlar = [("non", 4000), ("sut", 12000), ("tuz", 4000), ("guruch", 25000)]
for nom, narx in sorted(mahsulotlar, key=lambda m: (m[1], m[0])):
    print(f"{nom:8}{narx:&gt;7}")</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>non        4000
tuz        4000
sut       12000
guruch    25000</code></pre>

<h3>Namuna 4. Tartiblangan ro'yxatga joy topish</h3>
<pre><code>import bisect
ballar = [55, 60, 71, 80, 92]
yangi = 75
joy = bisect.bisect_left(ballar, yangi)
ballar.insert(joy, yangi)
print(joy, ballar)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>3 [55, 60, 71, 75, 80, 92]</code></pre>
<p><code>bisect</code> moduli ikkilik qidiruvning tayyor ko'rinishi: tartiblangan ro'yxatga element qo'shganda tartib buzilmaydi.</p>

<h3>Ish tartibi</h3>
<ol>
  <li>Har bir namunani o'zingiz yozib chiqing, ko'chirib qo'ymang</li>
  <li>Kirish qiymatlarini o'zgartirib, natija qanday o'zgarishini kuzating</li>
  <li>Testlarni yeching, keyin topshiriqlarni bajaring</li>
</ol>
$html$,
    11, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t5;

  -- ==========================================================
  -- 12. 12-amaliy mashg'ulot: Sinflar va obyektlar
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, '12-amaliy mashg''ulot: Sinflar va obyektlar', 'amaliy-12-sinflar',
$html$
<h2>Mashg'ulot maqsadi</h2>
<p>Sinf yaratish, konstruktor va metodlar yozish, obyektlar ro'yxati bilan ishlash va merosdan foydalanishni mashq qilish.</p>

<h3>Namuna 1. Kitob sinfi</h3>
<pre><code>class Kitob:
    def __init__(self, nom, muallif, sahifa):
        self.nom = nom
        self.muallif = muallif
        self.sahifa = sahifa
        self.oqilgan = 0

    def oqi(self, n):
        self.oqilgan = min(self.sahifa, self.oqilgan + n)

    def foiz(self):
        return round(self.oqilgan / self.sahifa * 100)

    def __str__(self):
        return f"{self.nom} ({self.muallif}) — {self.foiz()}%"

k = Kitob("O'tkan kunlar", "Abdulla Qodiriy", 400)
k.oqi(150)
k.oqi(70)
print(k)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>O'tkan kunlar (Abdulla Qodiriy) — 55%</code></pre>

<h3>Namuna 2. Obyektlar ro'yxati</h3>
<pre><code>class Talaba:
    def __init__(self, ism, ball):
        self.ism = ism
        self.ball = ball

guruh = [Talaba("Ali", 87), Talaba("Vali", 92), Talaba("Dilnoza", 78)]
guruh.sort(key=lambda t: t.ball, reverse=True)
for t in guruh:
    print(t.ism, t.ball)
print("O'rtacha:", sum(t.ball for t in guruh) / len(guruh))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Vali 92
Ali 87
Dilnoza 78
O'rtacha: 85.66666666666667</code></pre>

<h3>Namuna 3. Meros va super()</h3>
<pre><code>class Xodim:
    def __init__(self, ism, maosh):
        self.ism = ism
        self.maosh = maosh

    def oylik(self):
        return self.maosh

class Rahbar(Xodim):
    def __init__(self, ism, maosh, bonus):
        super().__init__(ism, maosh)
        self.bonus = bonus

    def oylik(self):
        return super().oylik() + self.bonus

for x in [Xodim("Ali", 5_000_000), Rahbar("Vali", 8_000_000, 2_000_000)]:
    print(x.ism, x.oylik())</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Ali 5000000
Vali 10000000</code></pre>
<p><code>super().__init__(...)</code> — ota sinf konstruktorini chaqirish. Shunda <code>ism</code> va <code>maosh</code> ni qayta yozmaymiz.</p>

<h3>Namuna 4. Sinf atributi</h3>
<pre><code>class Talaba:
    soni = 0                     # barcha obyektlar uchun umumiy

    def __init__(self, ism):
        self.ism = ism
        Talaba.soni += 1

Talaba("Ali"); Talaba("Vali"); Talaba("Sardor")
print(Talaba.soni)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>3</code></pre>

<h3>Ish tartibi</h3>
<ol>
  <li>Har bir namunani o'zingiz yozib chiqing, ko'chirib qo'ymang</li>
  <li>Kirish qiymatlarini o'zgartirib, natija qanday o'zgarishini kuzating</li>
  <li>Testlarni yeching, keyin topshiriqlarni bajaring</li>
</ol>
$html$,
    12, 10, 25, 80, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t6;

  -- Qayta ishga tushirilganda dublikat bo'lmasligi uchun
  DELETE FROM quizzes WHERE topic_id IN (t1, t2, t3, t4, t5, t6);
  DELETE FROM topic_tasks WHERE topic_id IN (t1, t2, t3, t4, t5, t6);

  -- Testlar: 7-amaliy mashg'ulot: Ro'yxat va lug'at bilan ishlash
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t1, 'Kod nima chiqaradi?

d = {}
for h in "banan":
    d[h] = d.get(h, 0) + 1
print(d["n"])', 'single',
   '[{"id": "a", "text": "2", "is_correct": true}, {"id": "b", "text": "1", "is_correct": false}, {"id": "c", "text": "3", "is_correct": false}, {"id": "d", "text": "KeyError", "is_correct": false}]'::jsonb,
   '''banan'' da n harfi ikki marta uchraydi.', 1, 0),
  (t1, 'd = {"a": 1} bo''lsa, d.get("b", 0) nima qaytaradi?', 'single',
   '[{"id": "a", "text": "0", "is_correct": true}, {"id": "b", "text": "None", "is_correct": false}, {"id": "c", "text": "KeyError", "is_correct": false}, {"id": "d", "text": "1", "is_correct": false}]'::jsonb,
   'get() kalit bo''lmasa ikkinchi argumentni qaytaradi va xato chiqarmaydi.', 1, 1),
  (t1, 'Kod nima chiqaradi?

print([x * 2 for x in range(5) if x % 2 == 1])', 'single',
   '[{"id": "a", "text": "[2, 6]", "is_correct": true}, {"id": "b", "text": "[0, 4, 8]", "is_correct": false}, {"id": "c", "text": "[1, 3]", "is_correct": false}, {"id": "d", "text": "[2, 4, 6, 8]", "is_correct": false}]'::jsonb,
   'Toq x lar: 1 va 3. Ikkiga ko''paytirilsa: 2 va 6.', 1, 2),
  (t1, 'Lug''atni qiymat bo''yicha kamayish tartibida saralashning to''g''ri usuli qaysi?', 'single',
   '[{"id": "a", "text": "sorted(d.items(), key=lambda x: x[1], reverse=True)", "is_correct": true}, {"id": "b", "text": "sorted(d, reverse=True)", "is_correct": false}, {"id": "c", "text": "d.sort(key=values)", "is_correct": false}, {"id": "d", "text": "sorted(d.values()).reverse()", "is_correct": false}]'::jsonb,
   'items() kalit-qiymat juftliklarini beradi, x[1] — qiymat. sorted(d) faqat kalitlarni saralaydi.', 1, 3),
  (t1, 'Kod nima chiqaradi?

g = {}
g.setdefault("a", []).append(1)
g.setdefault("a", []).append(2)
print(g)', 'single',
   '[{"id": "a", "text": "{''a'': [1, 2]}", "is_correct": true}, {"id": "b", "text": "{''a'': [2]}", "is_correct": false}, {"id": "c", "text": "{''a'': [1]}", "is_correct": false}, {"id": "d", "text": "{''a'': [[1], [2]]}", "is_correct": false}]'::jsonb,
   'Ikkinchi chaqiriqda kalit allaqachon bor — setdefault mavjud ro''yxatni qaytaradi va 2 unga qo''shiladi.', 1, 4);

  -- Topshiriqlar: 7-amaliy mashg'ulot: Ro'yxat va lug'at bilan ishlash
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t1, 'Harflar chastotasi',
   'Bitta so''z berilgan (kichik lotin harflari). Har bir harf necha marta uchrashini alifbo tartibida "harf: soni" ko''rinishida chiqaring.',
   's = input()
# Kodingizni yozing',
   's = input()
d = {}
for h in s:
    d[h] = d.get(h, 0) + 1
for h in sorted(d):
    print(f"{h}: {d[h]}")',
   'python',
   '[{"input": "banan", "expected_output": "a: 2\nb: 1\nn: 2", "is_hidden": false}, {"input": "a", "expected_output": "a: 1", "is_hidden": false}, {"input": "zzzab", "expected_output": "a: 1\nb: 1\nz: 3", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "d.get(h, 0) + 1 bilan sanang"}, {"order": 2, "text": "sorted(d) kalitlarni alifbo tartibida beradi"}]'::jsonb,
   'easy', 5, 15, 0),
  (t1, 'Fanlar bo''yicha o''rtacha',
   'Birinchi qatorda n. Keyingi n qatorda "fan ball". Har bir fan bo''yicha o''rtacha ballni 1 xona aniqlikda chiqaring. Fanlar kirishda birinchi uchragan tartibda chiqsin.',
   'n = int(input())
# Kodingizni yozing',
   'n = int(input())
ballar = {}
for _ in range(n):
    fan, ball = input().split()
    ballar.setdefault(fan, []).append(int(ball))
for fan, b in ballar.items():
    print(f"{fan} {sum(b) / len(b):.1f}")',
   'python',
   '[{"input": "5\nmatematika 80\nfizika 70\nmatematika 90\nfizika 75\ninformatika 100", "expected_output": "matematika 85.0\nfizika 72.5\ninformatika 100.0", "is_hidden": false}, {"input": "1\ntarix 64", "expected_output": "tarix 64.0", "is_hidden": false}, {"input": "3\nb 1\na 2\nb 2", "expected_output": "b 1.5\na 2.0", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Har bir fan uchun ballar ro''yxatini saqlang: setdefault(fan, []).append(ball)"}, {"order": 2, "text": "Lug''at qo''shilish tartibini saqlaydi"}]'::jsonb,
   'medium', 8, 20, 1),
  (t1, 'Top-3 so''z',
   'Bitta qatorda bo''shliq bilan ajratilgan so''zlar berilgan. Eng ko''p uchragan 3 ta so''zni "so''z soni" ko''rinishida chiqaring.

Tartib: soni kamayishi bo''yicha, teng bo''lsa — alifbo tartibida. Turli so''zlar 3 tadan kam bo''lsa, borini chiqaring.',
   'sozlar = input().split()
# Kodingizni yozing',
   'sozlar = input().split()
d = {}
for s in sozlar:
    d[s] = d.get(s, 0) + 1
for s, n in sorted(d.items(), key=lambda x: (-x[1], x[0]))[:3]:
    print(s, n)',
   'python',
   '[{"input": "olma nok olma uzum nok olma anor", "expected_output": "olma 3\nnok 2\nanor 1", "is_hidden": false}, {"input": "a b", "expected_output": "a 1\nb 1", "is_hidden": false}, {"input": "x y z x y x w w w", "expected_output": "w 3\nx 3\ny 2", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Avval sanang, keyin saralang"}, {"order": 2, "text": "key=lambda x: (-x[1], x[0]) — soni kamayishi, keyin alifbo"}]'::jsonb,
   'hard', 12, 30, 2);

  -- Testlar: 8-amaliy mashg'ulot: Matnlarga ishlov berish
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t2, 'Kod nima chiqaradi?

s = "salom"
s.upper()
print(s)', 'single',
   '[{"id": "a", "text": "salom", "is_correct": true}, {"id": "b", "text": "SALOM", "is_correct": false}, {"id": "c", "text": "Salom", "is_correct": false}, {"id": "d", "text": "None", "is_correct": false}]'::jsonb,
   'Satr o''zgarmas: upper() yangi satr qaytaradi, lekin u hech qayerga saqlanmadi.', 1, 0),
  (t2, 'Kod nima chiqaradi?

print("-".join(["2026", "10", "11"]))', 'single',
   '[{"id": "a", "text": "2026-10-11", "is_correct": true}, {"id": "b", "text": "[''2026'', ''10'', ''11'']", "is_correct": false}, {"id": "c", "text": "-2026-10-11-", "is_correct": false}, {"id": "d", "text": "20261011", "is_correct": false}]'::jsonb,
   'join ajratgichni elementlar ORASIGA qo''yadi.', 1, 1),
  (t2, 'Kod nima chiqaradi?

print("dasturlash".find("x"))', 'single',
   '[{"id": "a", "text": "-1", "is_correct": true}, {"id": "b", "text": "0", "is_correct": false}, {"id": "c", "text": "None", "is_correct": false}, {"id": "d", "text": "ValueError", "is_correct": false}]'::jsonb,
   'find() topilmasa -1 qaytaradi. index() esa xuddi shunday holatda ValueError chiqaradi.', 1, 2),
  (t2, 'Kod nima chiqaradi?

print(len("  a  b  ".split()))', 'single',
   '[{"id": "a", "text": "2", "is_correct": true}, {"id": "b", "text": "6", "is_correct": false}, {"id": "c", "text": "5", "is_correct": false}, {"id": "d", "text": "8", "is_correct": false}]'::jsonb,
   'Argumentsiz split() ketma-ket bo''shliqlarni bitta deb hisoblaydi va chetlardagilarini tashlaydi: [''a'', ''b''].', 1, 3),
  (t2, 'Kod nima chiqaradi?

print("12a".isdigit(), "123".isdigit())', 'single',
   '[{"id": "a", "text": "False True", "is_correct": true}, {"id": "b", "text": "True True", "is_correct": false}, {"id": "c", "text": "False False", "is_correct": false}, {"id": "d", "text": "True False", "is_correct": false}]'::jsonb,
   'isdigit() barcha belgilar raqam bo''lsagina True qaytaradi.', 1, 4);

  -- Topshiriqlar: 8-amaliy mashg'ulot: Matnlarga ishlov berish
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t2, 'Bosh harflar',
   'To''liq ism berilgan (familiya ism otasining ismi). Initsiallarni nuqta bilan chiqaring.

Misol: valiyev ali karimovich → V.A.K.',
   'fio = input()
# Kodingizni yozing',
   'fio = input()
print("".join(s[0].upper() + "." for s in fio.split()))',
   'python',
   '[{"input": "valiyev ali karimovich", "expected_output": "V.A.K.", "is_hidden": false}, {"input": "Ali", "expected_output": "A.", "is_hidden": false}, {"input": "  sobirova   dilnoza  ", "expected_output": "S.D.", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "split() ortiqcha bo''shliqlarni o''zi hal qiladi"}, {"order": 2, "text": "Har so''zning s[0].upper() + \".\""}]'::jsonb,
   'easy', 5, 15, 0),
  (t2, 'Login tekshiruvi',
   'Login berilgan. Agar u quyidagi shartlarning hammasiga mos kelsa "Mos", aks holda "Mos emas" chiqaring:
1) uzunligi 4 dan 16 gacha (chegaralar kiradi),
2) harf bilan boshlanadi,
3) faqat lotin harflari, raqamlar va pastki chiziq (_) dan iborat.',
   'login = input()
# Kodingizni yozing',
   'login = input()
ruxsat = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"
mos = (4 <= len(login) <= 16
       and login[:1].isalpha() and login[:1].isascii()
       and all(h in ruxsat for h in login))
print("Mos" if mos else "Mos emas")',
   'python',
   '[{"input": "ali_2026", "expected_output": "Mos", "is_hidden": false}, {"input": "2ali", "expected_output": "Mos emas", "is_hidden": false}, {"input": "abc", "expected_output": "Mos emas", "is_hidden": true}, {"input": "ali-vali", "expected_output": "Mos emas", "is_hidden": true}, {"input": "A123456789012345", "expected_output": "Mos", "is_hidden": true}, {"input": "Ali_Valiyev_2026x", "expected_output": "Mos emas", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Shartlarni and bilan birlashtiring"}, {"order": 2, "text": "all(h in ruxsat for h in login) — har bir belgi ruxsat etilganmi"}]'::jsonb,
   'medium', 8, 20, 1),
  (t2, 'So''zlarni teskari tartibda',
   'Gap berilgan. So''zlar tartibini teskari qilib chiqaring, lekin har bir so''zning o''zi o''zgarmasin. Ortiqcha bo''shliqlar olib tashlansin.

Misol: men   python o''rganaman → o''rganaman python men',
   'gap = input()
# Kodingizni yozing',
   'gap = input()
print(" ".join(gap.split()[::-1]))',
   'python',
   '[{"input": "men python o''rganaman", "expected_output": "o''rganaman python men", "is_hidden": false}, {"input": "yakka", "expected_output": "yakka", "is_hidden": false}, {"input": "  a   b  c ", "expected_output": "c b a", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "split() → ro''yxat"}, {"order": 2, "text": "[::-1] teskari, \" \".join() yana satr"}]'::jsonb,
   'easy', 5, 15, 2),
  (t2, 'Shifr: Sezar usuli',
   'Birinchi qatorda kichik lotin harflari va bo''shliqlardan iborat matn, ikkinchi qatorda k. Har bir harfni alifbo bo''yicha k o''ringa suring (z dan keyin yana a keladi). Bo''shliqlar o''zgarmaydi.

Misol: abc xyz, k = 2 → cde zab',
   'matn = input()
k = int(input())
# Kodingizni yozing',
   'matn = input()
k = int(input())
natija = ""
for h in matn:
    if h == " ":
        natija += h
    else:
        natija += chr((ord(h) - ord("a") + k) % 26 + ord("a"))
print(natija)',
   'python',
   '[{"input": "abc xyz\n2", "expected_output": "cde zab", "is_hidden": false}, {"input": "salom\n0", "expected_output": "salom", "is_hidden": false}, {"input": "z\n1", "expected_output": "a", "is_hidden": true}, {"input": "hello world\n29", "expected_output": "khoor zruog", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "ord() harf kodini, chr() koddan harfni beradi"}, {"order": 2, "text": "(ord(h) - ord(\"a\") + k) % 26 — alifbo bo''yicha aylanish"}]'::jsonb,
   'hard', 12, 30, 3);

  -- Testlar: 9-amaliy mashg'ulot: Ichma-ich ro'yxatlar va matritsalar
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t3, 'Kod nima chiqaradi?

a = [[1, 2], [3, 4], [5, 6]]
print(len(a), len(a[0]))', 'single',
   '[{"id": "a", "text": "3 2", "is_correct": true}, {"id": "b", "text": "2 3", "is_correct": false}, {"id": "c", "text": "6 2", "is_correct": false}, {"id": "d", "text": "3 3", "is_correct": false}]'::jsonb,
   'len(a) — satrlar soni (3), len(a[0]) — birinchi satrdagi elementlar, ya''ni ustunlar soni (2).', 1, 0),
  (t3, 'Kod nima chiqaradi?

a = [[1, 2, 3], [4, 5, 6]]
print(sum(a[i][1] for i in range(2)))', 'single',
   '[{"id": "a", "text": "7", "is_correct": true}, {"id": "b", "text": "6", "is_correct": false}, {"id": "c", "text": "15", "is_correct": false}, {"id": "d", "text": "5", "is_correct": false}]'::jsonb,
   'Har bir satrdan 1-ustun olinadi: 2 + 5 = 7.', 1, 1),
  (t3, '3×3 matritsada a[i][j] elementi qachon bosh diagonalda turadi?', 'single',
   '[{"id": "a", "text": "i == j bo''lganda", "is_correct": true}, {"id": "b", "text": "i + j == 2 bo''lganda", "is_correct": false}, {"id": "c", "text": "i > j bo''lganda", "is_correct": false}, {"id": "d", "text": "j == 0 bo''lganda", "is_correct": false}]'::jsonb,
   'Bosh diagonal: a[0][0], a[1][1], a[2][2]. i + j == n - 1 esa yordamchi diagonal.', 1, 2),
  (t3, 'Kod nima chiqaradi?

a = [[0] * 2 for _ in range(2)]
a[0][0] = 5
print(a[1][0])', 'single',
   '[{"id": "a", "text": "0", "is_correct": true}, {"id": "b", "text": "5", "is_correct": false}, {"id": "c", "text": "IndexError", "is_correct": false}, {"id": "d", "text": "None", "is_correct": false}]'::jsonb,
   'Generator har satr uchun alohida ro''yxat yaratadi — a[0] ni o''zgartirish a[1] ga ta''sir qilmaydi.', 1, 3),
  (t3, 'Kod nima chiqaradi?

a = [[1, 2], [3, 4]]
print([list(u) for u in zip(*a)])', 'single',
   '[{"id": "a", "text": "[[1, 3], [2, 4]]", "is_correct": true}, {"id": "b", "text": "[[1, 2], [3, 4]]", "is_correct": false}, {"id": "c", "text": "[[4, 3], [2, 1]]", "is_correct": false}, {"id": "d", "text": "[1, 2, 3, 4]", "is_correct": false}]'::jsonb,
   'zip(*a) ustunlarni birlashtiradi — bu matritsani transponirlashning qisqa usuli.', 1, 4);

  -- Topshiriqlar: 9-amaliy mashg'ulot: Ichma-ich ro'yxatlar va matritsalar
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t3, 'Eng katta element va uning joyi',
   'Birinchi qatorda n va m, keyingi n qatorda m tadan son. Eng katta elementni va uning satr hamda ustun raqamini (0 dan boshlab) chiqaring. Bir nechta bo''lsa — birinchi uchraganini (satr bo''yicha yuqoridan, keyin chapdan).',
   'n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
# Kodingizni yozing',
   'n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]
bi, bj = 0, 0
for i in range(n):
    for j in range(m):
        if a[i][j] > a[bi][bj]:
            bi, bj = i, j
print(a[bi][bj], bi, bj)',
   'python',
   '[{"input": "2 3\n1 9 3\n4 5 9", "expected_output": "9 0 1", "is_hidden": false}, {"input": "1 1\n-7", "expected_output": "-7 0 0", "is_hidden": false}, {"input": "3 2\n-1 -2\n-3 0\n0 -5", "expected_output": "0 1 1", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Eng kattasining indekslarini saqlang"}, {"order": 2, "text": "Qat''iy > ishlating — teng bo''lsa birinchisi qoladi"}]'::jsonb,
   'easy', 5, 15, 0),
  (t3, 'Tic-tac-toe g''olibi',
   '3 qatorda tic-tac-toe maydoni: har birida 3 ta belgi (X, O yoki .). G''olibni aniqlang: X, O yoki hech kim yutmagan bo''lsa "Durang".

Kirishda bir vaqtda ikkala o''yinchi yutgan holat bo''lmaydi.',
   'm = [input() for _ in range(3)]
# Kodingizni yozing',
   'm = [input() for _ in range(3)]
chiziqlar = []
chiziqlar += m
chiziqlar += ["".join(m[i][j] for i in range(3)) for j in range(3)]
chiziqlar.append(m[0][0] + m[1][1] + m[2][2])
chiziqlar.append(m[0][2] + m[1][1] + m[2][0])
golib = "Durang"
for c in chiziqlar:
    if c == "XXX":
        golib = "X"
    elif c == "OOO":
        golib = "O"
print(golib)',
   'python',
   '[{"input": "XXX\nOO.\n...", "expected_output": "X", "is_hidden": false}, {"input": "XO.\nXO.\n.O.", "expected_output": "O", "is_hidden": false}, {"input": "XOX\nXOO\nOXX", "expected_output": "Durang", "is_hidden": true}, {"input": "O.X\n.X.\nXO.", "expected_output": "X", "is_hidden": true}, {"input": "...\n...\n...", "expected_output": "Durang", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "8 ta chiziq bor: 3 satr, 3 ustun, 2 diagonal"}, {"order": 2, "text": "Har chiziqni satrga aylantirib \"XXX\" yoki \"OOO\" bilan solishtiring"}]'::jsonb,
   'medium', 8, 20, 1),
  (t3, 'Matritsani 90° burish',
   'Birinchi qatorda n, keyingi n qatorda n tadan son — kvadrat matritsa. Uni soat strelkasi bo''yicha 90° burib chiqaring.',
   'n = int(input())
a = [input().split() for _ in range(n)]
# Kodingizni yozing',
   'n = int(input())
a = [input().split() for _ in range(n)]
for j in range(n):
    print(" ".join(a[i][j] for i in range(n - 1, -1, -1)))',
   'python',
   '[{"input": "3\n1 2 3\n4 5 6\n7 8 9", "expected_output": "7 4 1\n8 5 2\n9 6 3", "is_hidden": false}, {"input": "1\n5", "expected_output": "5", "is_hidden": false}, {"input": "2\n1 2\n3 4", "expected_output": "3 1\n4 2", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Natijaning j-satri — asl matritsaning j-ustuni, pastdan yuqoriga o''qilgan"}, {"order": 2, "text": "range(n - 1, -1, -1) — teskari tartib"}]'::jsonb,
   'hard', 12, 30, 2);

  -- Testlar: 10-amaliy mashg'ulot: Rekursiya
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t4, 'Kod nima chiqaradi?

def f(n):
    if n < 10:
        return 1
    return 1 + f(n // 10)

print(f(12345))', 'single',
   '[{"id": "a", "text": "5", "is_correct": true}, {"id": "b", "text": "4", "is_correct": false}, {"id": "c", "text": "15", "is_correct": false}, {"id": "d", "text": "1", "is_correct": false}]'::jsonb,
   'Funksiya raqamlar sonini hisoblaydi: har qadamda bitta raqam tashlanadi.', 1, 0),
  (t4, 'Kod nima chiqaradi?

def f(n):
    if n == 0:
        return
    f(n - 1)
    print(n, end=" ")

f(3)', 'single',
   '[{"id": "a", "text": "1 2 3", "is_correct": true}, {"id": "b", "text": "3 2 1", "is_correct": false}, {"id": "c", "text": "0 1 2 3", "is_correct": false}, {"id": "d", "text": "3", "is_correct": false}]'::jsonb,
   'print rekursiv chaqiruvdan KEYIN turibdi — eng ichki chaqiruv birinchi chiqaradi.', 1, 1),
  (t4, 'ekub(48, 18) chaqirilganda keyingi chaqiruv qaysi bo''ladi?

def ekub(a, b):
    if b == 0:
        return a
    return ekub(b, a % b)', 'single',
   '[{"id": "a", "text": "ekub(18, 12)", "is_correct": true}, {"id": "b", "text": "ekub(18, 30)", "is_correct": false}, {"id": "c", "text": "ekub(12, 18)", "is_correct": false}, {"id": "d", "text": "ekub(48, 12)", "is_correct": false}]'::jsonb,
   '48 % 18 = 12, demak ekub(18, 12).', 1, 2),
  (t4, '2 ta belgidan iborat barcha ikkilik satrlar (00, 01, 10, 11) nechta? n ta belgi uchun-chi?', 'single',
   '[{"id": "a", "text": "4 ta, umumiy holda 2ⁿ ta", "is_correct": true}, {"id": "b", "text": "4 ta, umumiy holda 2n ta", "is_correct": false}, {"id": "c", "text": "2 ta, umumiy holda n ta", "is_correct": false}, {"id": "d", "text": "4 ta, umumiy holda n² ta", "is_correct": false}]'::jsonb,
   'Har bir belgi uchun 2 tanlov bor: 2 × 2 × … × 2 = 2ⁿ.', 1, 3),
  (t4, 'Rekursiv funksiyada asosiy holat yozilmasa nima bo''ladi?', 'single',
   '[{"id": "a", "text": "RecursionError — chaqiruvlar soni chegaradan oshadi", "is_correct": true}, {"id": "b", "text": "Funksiya None qaytaradi", "is_correct": false}, {"id": "c", "text": "SyntaxError", "is_correct": false}, {"id": "d", "text": "Funksiya bir marta ishlab to''xtaydi", "is_correct": false}]'::jsonb,
   'Python chaqiruvlar chuqurligini cheklaydi (odatda 1000). Undan oshganda RecursionError chiqadi.', 1, 4);

  -- Topshiriqlar: 10-amaliy mashg'ulot: Rekursiya
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t4, 'Ro''yxatdagi eng katta (rekursiv)',
   'Birinchi qatorda n, ikkinchi qatorda n ta son. Eng katta sonni rekursiv funksiya yordamida toping. max() ishlatmang.',
   'def eng_katta(a):
    # Kodingizni yozing
    pass

n = int(input())
print(eng_katta(list(map(int, input().split()))))',
   'def eng_katta(a):
    if len(a) == 1:
        return a[0]
    qolgani = eng_katta(a[1:])
    return a[0] if a[0] > qolgani else qolgani

n = int(input())
print(eng_katta(list(map(int, input().split()))))',
   'python',
   '[{"input": "5\n3 9 2 7 4", "expected_output": "9", "is_hidden": false}, {"input": "1\n-5", "expected_output": "-5", "is_hidden": false}, {"input": "4\n-1 -8 -3 -2", "expected_output": "-1", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Asosiy holat: bitta element qolsa — o''shaning o''zi"}, {"order": 2, "text": "Birinchi elementni qolgan qismning eng kattasi bilan solishtiring"}]'::jsonb,
   'easy', 5, 15, 0),
  (t4, 'Ikkilik sanoqqa o''tkazish (rekursiv)',
   'Manfiy bo''lmagan butun son berilgan. Uni ikkilik sanoq sistemasiga rekursiv funksiya yordamida o''tkazing. bin() ishlatmang.',
   'def ikkilik(n):
    # Kodingizni yozing
    pass

print(ikkilik(int(input())))',
   'def ikkilik(n):
    if n < 2:
        return str(n)
    return ikkilik(n // 2) + str(n % 2)

print(ikkilik(int(input())))',
   'python',
   '[{"input": "10", "expected_output": "1010", "is_hidden": false}, {"input": "0", "expected_output": "0", "is_hidden": false}, {"input": "1", "expected_output": "1", "is_hidden": true}, {"input": "255", "expected_output": "11111111", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Oxirgi raqam — n % 2, qolgani — n // 2 ning ikkilik yozuvi"}, {"order": 2, "text": "n < 2 bo''lsa, javob str(n)"}]'::jsonb,
   'medium', 8, 20, 1),
  (t4, 'Hanoy minorasi',
   'Hanoy minorasida n ta disk A ustundan C ustunga ko''chirilishi kerak (B — yordamchi). Katta diskni kichigining ustiga qo''yib bo''lmaydi.

Barcha yurishlarni "A -> C" ko''rinishida tartib bilan, oxirida yurishlar sonini chiqaring.',
   'def hanoy(n, dan, ga, orqali):
    # Kodingizni yozing
    pass

n = int(input())',
   'yurishlar = 0

def hanoy(n, dan, ga, orqali):
    global yurishlar
    if n == 0:
        return
    hanoy(n - 1, dan, orqali, ga)
    print(dan, "->", ga)
    yurishlar += 1
    hanoy(n - 1, orqali, ga, dan)

n = int(input())
hanoy(n, "A", "C", "B")
print(yurishlar)',
   'python',
   '[{"input": "1", "expected_output": "A -> C\n1", "is_hidden": false}, {"input": "2", "expected_output": "A -> B\nA -> C\nB -> C\n3", "is_hidden": false}, {"input": "3", "expected_output": "A -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C\n7", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "n-1 diskni yordamchi ustunga, eng kattasini maqsadga, keyin n-1 diskni uning ustiga"}, {"order": 2, "text": "Yurishlar soni 2ⁿ − 1 bo''lishi kerak"}]'::jsonb,
   'hard', 12, 30, 2);

  -- Testlar: 11-amaliy mashg'ulot: Saralash va qidiruv
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t5, '1 dan 1000 gacha tartiblangan ro''yxatda 997 ni chiziqli qidiruv nechta qadamda topadi?', 'single',
   '[{"id": "a", "text": "997", "is_correct": true}, {"id": "b", "text": "10", "is_correct": false}, {"id": "c", "text": "3", "is_correct": false}, {"id": "d", "text": "1000", "is_correct": false}]'::jsonb,
   'Chiziqli qidiruv boshidan yuradi: 997-element 997-qadamda topiladi.', 1, 0),
  (t5, 'Kod nima chiqaradi?

print(sorted(["b", "A", "a", "B"]))', 'single',
   '[{"id": "a", "text": "[''A'', ''B'', ''a'', ''b'']", "is_correct": true}, {"id": "b", "text": "[''a'', ''A'', ''b'', ''B'']", "is_correct": false}, {"id": "c", "text": "[''A'', ''a'', ''B'', ''b'']", "is_correct": false}, {"id": "d", "text": "[''a'', ''b'', ''A'', ''B'']", "is_correct": false}]'::jsonb,
   'Satrlar belgi kodlari bo''yicha solishtiriladi: katta harflar kodi kichik harflarnikidan kichik.', 1, 1),
  (t5, 'Kod nima chiqaradi?

print(sorted(["b", "A", "a", "B"], key=str.lower))', 'single',
   '[{"id": "a", "text": "[''A'', ''a'', ''b'', ''B'']", "is_correct": true}, {"id": "b", "text": "[''A'', ''B'', ''a'', ''b'']", "is_correct": false}, {"id": "c", "text": "[''a'', ''A'', ''B'', ''b'']", "is_correct": false}, {"id": "d", "text": "[''a'', ''b'', ''A'', ''B'']", "is_correct": false}]'::jsonb,
   'key=str.lower registrni hisobga olmaydi. Teng kalitlar asl tartibini saqlaydi (barqaror saralash): ''A'' ''a'' dan oldin, ''b'' ''B'' dan oldin edi.', 1, 2),
  (t5, 'Qo''shib saralash (insertion sort) qachon ayniqsa tez ishlaydi?', 'single',
   '[{"id": "a", "text": "Ro''yxat deyarli tartiblangan bo''lganda", "is_correct": true}, {"id": "b", "text": "Ro''yxat teskari tartibda bo''lganda", "is_correct": false}, {"id": "c", "text": "Barcha elementlar har xil bo''lganda", "is_correct": false}, {"id": "d", "text": "Ro''yxat juda katta bo''lganda", "is_correct": false}]'::jsonb,
   'Deyarli tartiblangan ro''yxatda har bir element o''z joyidan uzoqqa surilmaydi, ichki sikl deyarli ishlamaydi.', 1, 3),
  (t5, 'Kod nima chiqaradi?

import bisect
print(bisect.bisect_left([10, 20, 30], 25))', 'single',
   '[{"id": "a", "text": "2", "is_correct": true}, {"id": "b", "text": "1", "is_correct": false}, {"id": "c", "text": "3", "is_correct": false}, {"id": "d", "text": "25", "is_correct": false}]'::jsonb,
   '25 ni tartibni buzmasdan 20 va 30 orasiga, ya''ni 2-indeksga qo''yish kerak.', 1, 4);

  -- Topshiriqlar: 11-amaliy mashg'ulot: Saralash va qidiruv
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t5, 'Tanlab saralash',
   'Birinchi qatorda n, ikkinchi qatorda n ta son. Tanlab saralash (selection sort) algoritmini o''zingiz yozib, sonlarni KAMAYISH tartibida chiqaring. sort() va sorted() ishlatmang.',
   'n = int(input())
a = list(map(int, input().split()))
# Kodingizni yozing
print(*a)',
   'n = int(input())
a = list(map(int, input().split()))
for i in range(n):
    k = i
    for j in range(i + 1, n):
        if a[j] > a[k]:
            k = j
    a[i], a[k] = a[k], a[i]
print(*a)',
   'python',
   '[{"input": "5\n5 2 9 1 7", "expected_output": "9 7 5 2 1", "is_hidden": false}, {"input": "1\n3", "expected_output": "3", "is_hidden": false}, {"input": "4\n-1 4 -1 4", "expected_output": "4 4 -1 -1", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Har qadamda qolgan qismdan eng KATTAsini toping"}, {"order": 2, "text": "Uni i-o''ringa almashtiring"}]'::jsonb,
   'medium', 8, 20, 0),
  (t5, 'Birinchi va oxirgi uchrash',
   'Birinchi qatorda n, ikkinchi qatorda o''sish tartibida n ta son (takrorlar bo''lishi mumkin), uchinchi qatorda x. x ning birinchi va oxirgi uchragan indekslarini chiqaring. Bo''lmasa "-1 -1".',
   'n = int(input())
a = list(map(int, input().split()))
x = int(input())
# Kodingizni yozing',
   'import bisect
n = int(input())
a = list(map(int, input().split()))
x = int(input())
l = bisect.bisect_left(a, x)
r = bisect.bisect_right(a, x) - 1
if l < n and a[l] == x:
    print(l, r)
else:
    print(-1, -1)',
   'python',
   '[{"input": "7\n1 2 2 2 3 5 5\n2", "expected_output": "1 3", "is_hidden": false}, {"input": "7\n1 2 2 2 3 5 5\n4", "expected_output": "-1 -1", "is_hidden": false}, {"input": "3\n7 7 7\n7", "expected_output": "0 2", "is_hidden": true}, {"input": "4\n1 2 3 4\n4", "expected_output": "3 3", "is_hidden": true}, {"input": "4\n1 2 3 4\n9", "expected_output": "-1 -1", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "bisect_left — birinchi joy, bisect_right — oxirgisidan keyingi joy"}, {"order": 2, "text": "Topilganini a[l] == x bilan tekshiring"}]'::jsonb,
   'medium', 8, 20, 1),
  (t5, 'Mahsulotlarni saralash',
   'Birinchi qatorda n. Keyingi n qatorda "nomi narxi soni". Mahsulotlarni umumiy qiymati (narx × soni) kamayishi bo''yicha, teng bo''lsa nomi bo''yicha alifbo tartibida chiqaring: "nomi qiymati".',
   'n = int(input())
# Kodingizni yozing',
   'n = int(input())
m = []
for _ in range(n):
    nom, narx, soni = input().split()
    m.append((nom, int(narx) * int(soni)))
for nom, q in sorted(m, key=lambda x: (-x[1], x[0])):
    print(nom, q)',
   'python',
   '[{"input": "3\nnon 4000 5\nsut 12000 1\nguruch 25000 2", "expected_output": "guruch 50000\nnon 20000\nsut 12000", "is_hidden": false}, {"input": "2\nb 10 1\na 5 2", "expected_output": "a 10\nb 10", "is_hidden": false}, {"input": "1\nolma 7000 3", "expected_output": "olma 21000", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Avval har mahsulot qiymatini hisoblang"}, {"order": 2, "text": "key=lambda x: (-x[1], x[0])"}]'::jsonb,
   'easy', 5, 15, 2);

  -- Testlar: 12-amaliy mashg'ulot: Sinflar va obyektlar
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t6, 'Kod nima chiqaradi?

class A:
    def __init__(self, x):
        self.x = x * 2

print(A(5).x)', 'single',
   '[{"id": "a", "text": "10", "is_correct": true}, {"id": "b", "text": "5", "is_correct": false}, {"id": "c", "text": "None", "is_correct": false}, {"id": "d", "text": "AttributeError", "is_correct": false}]'::jsonb,
   'Konstruktor x ni ikkiga ko''paytirib saqlaydi.', 1, 0),
  (t6, 'super().__init__(...) nima qiladi?', 'single',
   '[{"id": "a", "text": "Ota sinf konstruktorini chaqiradi", "is_correct": true}, {"id": "b", "text": "Yangi obyekt yaratadi", "is_correct": false}, {"id": "c", "text": "Sinfni o''chiradi", "is_correct": false}, {"id": "d", "text": "Bola sinf konstruktorini qayta chaqiradi", "is_correct": false}]'::jsonb,
   'Bola sinf o''z konstruktorida ota sinfning boshlang''ich sozlashlaridan foydalanish uchun super() ishlatadi.', 1, 1),
  (t6, 'Kod nima chiqaradi?

class S:
    n = 0
    def __init__(self):
        S.n += 1

a = S(); b = S(); c = S()
print(a.n)', 'single',
   '[{"id": "a", "text": "3", "is_correct": true}, {"id": "b", "text": "1", "is_correct": false}, {"id": "c", "text": "0", "is_correct": false}, {"id": "d", "text": "AttributeError", "is_correct": false}]'::jsonb,
   'n — sinf atributi, barcha obyektlar uchun umumiy. Uch marta oshirildi.', 1, 2),
  (t6, 'Kod nima chiqaradi?

class A:
    def f(self):
        return 1

class B(A):
    def f(self):
        return super().f() + 10

print(B().f())', 'single',
   '[{"id": "a", "text": "11", "is_correct": true}, {"id": "b", "text": "10", "is_correct": false}, {"id": "c", "text": "1", "is_correct": false}, {"id": "d", "text": "RecursionError", "is_correct": false}]'::jsonb,
   'B.f ota sinfning f natijasini (1) olib, 10 qo''shadi.', 1, 3),
  (t6, 'Obyektlar ro''yxatini ball atributi bo''yicha saralashning to''g''ri usuli qaysi?', 'single',
   '[{"id": "a", "text": "guruh.sort(key=lambda t: t.ball)", "is_correct": true}, {"id": "b", "text": "guruh.sort(t.ball)", "is_correct": false}, {"id": "c", "text": "sorted(guruh.ball)", "is_correct": false}, {"id": "d", "text": "guruh.sort(key=ball)", "is_correct": false}]'::jsonb,
   'key funksiyasi har bir obyektdan solishtirish qiymatini oladi.', 1, 4);

  -- Topshiriqlar: 12-amaliy mashg'ulot: Sinflar va obyektlar
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t6, 'Vaqt sinfi',
   'Vaqt sinfini yarating: konstruktor soat va daqiqani oladi, qosh(daqiqa) metodi vaqtni oldinga suradi (24 soatdan oshsa yana 00 dan boshlanadi), __str__ esa "SS:DD" ko''rinishini qaytaradi.

Kirish: birinchi qatorda "soat daqiqa", ikkinchi qatorda qo''shiladigan daqiqalar.',
   'class Vaqt:
    # Kodingizni yozing
    pass

s, d = map(int, input().split())
v = Vaqt(s, d)
v.qosh(int(input()))
print(v)',
   'class Vaqt:
    def __init__(self, soat, daqiqa):
        self.jami = (soat * 60 + daqiqa) % 1440

    def qosh(self, d):
        self.jami = (self.jami + d) % 1440

    def __str__(self):
        return f"{self.jami // 60:02}:{self.jami % 60:02}"

s, d = map(int, input().split())
v = Vaqt(s, d)
v.qosh(int(input()))
print(v)',
   'python',
   '[{"input": "10 30\n45", "expected_output": "11:15", "is_hidden": false}, {"input": "23 50\n20", "expected_output": "00:10", "is_hidden": false}, {"input": "0 0\n0", "expected_output": "00:00", "is_hidden": true}, {"input": "12 0\n1440", "expected_output": "12:00", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Vaqtni bitta son — kun boshidan beri o''tgan daqiqalar sifatida saqlash qulay"}, {"order": 2, "text": "% 1440 — 24 soatdan oshganini qirqadi, :02 — ikki xonali"}]'::jsonb,
   'medium', 8, 20, 0),
  (t6, 'Kutubxona',
   'Kitob sinfini yarating (nom, berilganmi). Birinchi qatorda kitoblar nomlari bo''shliq bilan. Ikkinchi qatorda n, keyingi n qatorda amallar:

ber nom — kitobni berish (berilgan bo''lsa "Band" chiqaring)
qaytar nom — kitobni qaytarish

Oxirida javondagi (berilmagan) kitoblarni kirish tartibida chiqaring, bo''lmasa "Bo''sh".',
   'class Kitob:
    # Kodingizni yozing
    pass

kitoblar = {}',
   'class Kitob:
    def __init__(self, nom):
        self.nom = nom
        self.berilgan = False

kitoblar = {nom: Kitob(nom) for nom in input().split()}
n = int(input())
for _ in range(n):
    amal, nom = input().split()
    k = kitoblar[nom]
    if amal == "ber":
        if k.berilgan:
            print("Band")
        else:
            k.berilgan = True
    else:
        k.berilgan = False
javonda = [k.nom for k in kitoblar.values() if not k.berilgan]
print(" ".join(javonda) if javonda else "Bo''sh")',
   'python',
   '[{"input": "Alpomish Kecha Navoiy\n3\nber Kecha\nber Kecha\nber Navoiy", "expected_output": "Band\nAlpomish", "is_hidden": false}, {"input": "A B\n2\nber A\nqaytar A", "expected_output": "A B", "is_hidden": false}, {"input": "X\n1\nber X", "expected_output": "Bo''sh", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Kitoblarni nom bo''yicha lug''atda saqlang"}, {"order": 2, "text": "Har bir Kitob obyektida berilgan holati bo''lsin"}]'::jsonb,
   'medium', 8, 20, 1),
  (t6, 'Hayvonot bog''i',
   'Hayvon ota sinfi va undan meros oluvchi Sher, Fil, Toti sinflarini yarating. Har birida kunlik ovqat miqdorini (kg) qaytaruvchi ovqat() metodi bo''lsin: Sher — vazn × 0.05, Fil — vazn × 0.04, Toti — 0.1 (vaznga bog''liq emas).

Kirishda n, keyingi n qatorda "tur vazn". Har bir hayvon uchun ovqatni 2 xona aniqlikda, oxirida jamini chiqaring.',
   'class Hayvon:
    def __init__(self, vazn):
        self.vazn = vazn

# Sher, Fil, Toti',
   'class Hayvon:
    def __init__(self, vazn):
        self.vazn = vazn
    def ovqat(self):
        return 0

class Sher(Hayvon):
    def ovqat(self):
        return self.vazn * 0.05

class Fil(Hayvon):
    def ovqat(self):
        return self.vazn * 0.04

class Toti(Hayvon):
    def ovqat(self):
        return 0.1

turlar = {"sher": Sher, "fil": Fil, "toti": Toti}
n = int(input())
hayvonlar = []
for _ in range(n):
    tur, vazn = input().split()
    hayvonlar.append(turlar[tur](float(vazn)))
for h in hayvonlar:
    print(f"{h.ovqat():.2f}")
print(f"{sum(h.ovqat() for h in hayvonlar):.2f}")',
   'python',
   '[{"input": "3\nsher 200\nfil 5000\ntoti 1", "expected_output": "10.00\n200.00\n0.10\n210.10", "is_hidden": false}, {"input": "1\ntoti 2", "expected_output": "0.10\n0.10", "is_hidden": false}, {"input": "2\nsher 150\nsher 190", "expected_output": "7.50\n9.50\n17.00", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Sinflarni lug''atga joylash qulay: {\"sher\": Sher, ...}"}, {"order": 2, "text": "Har bir bola sinf faqat ovqat() ni qayta yozadi"}]'::jsonb,
   'hard', 12, 30, 2);

END $$;
