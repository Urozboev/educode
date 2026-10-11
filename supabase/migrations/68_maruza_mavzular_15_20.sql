-- ============================================================
-- MirAcademy — "Dasturlash asoslari (Ma'ruza)" kursi: 6 ta yangi mavzu
--
-- 15. Kortej va ichma-ich tuzilmalar
-- 16. Istisnolarni qayta ishlash (try / except)
-- 17. Fayllar bilan ishlash
-- 18. Rekursiya
-- 19. Saralash va qidiruv algoritmlari
-- 20. Obyektga yo'naltirilgan dasturlash asoslari
--
-- Har bir mavzu: ma'ruza matni, 5 ta test, 3 ta topshiriq.
-- "Python va sun'iy intellekt" mavzusi kurs yakuni bo'lib qolishi uchun
-- 21-o'ringa suriladi.
--
-- Sifat nazorati: dars matnidagi har bir misol natijasi qo'lda emas,
-- CPython'da ishga tushirib yozilgan. "Kod nima chiqaradi?" turidagi
-- testlar ham ishga tushirib tekshirilgan. Barcha topshiriqlarning
-- namunaviy yechimlari o'z testlaridan o'tadi.
--
-- Videodarslar keyin admin panel orqali biriktiriladi.
--
-- 27-30 migratsiyalardan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz: mavzular slug bo'yicha yangilanadi,
-- ularning testlari va topshiriqlari qaytadan yoziladi.
-- ============================================================

DO $$
DECLARE
  v_course UUID;
  t1 UUID; t2 UUID; t3 UUID; t4 UUID; t5 UUID; t6 UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-maruza';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: dasturlash-asoslari-maruza';
  END IF;

  -- ==========================================================
  -- 15. Kortej (tuple) va ichma-ich tuzilmalar
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, 'Kortej (tuple) va ichma-ich tuzilmalar', 'kortej-va-ichma-ich-tuzilmalar',
$html$
<h2>O'zgarmas ro'yxat kerak bo'lganda</h2>
<p>Ro'yxatni dastur istalgan joyda o'zgartirishi mumkin. Ba'zan esa aksincha kerak: ma'lumot <b>bir marta yozilsin va hech kim uni tasodifan buzmasin</b>. Masalan, nuqtaning koordinatalari, hafta kunlari yoki sana. Buning uchun Pythonda <b>kortej</b> (<code>tuple</code>) bor.</p>

<h3>Kortej yaratish</h3>
<pre><code>nuqta = (3, 5)
kunlar = ("Du", "Se", "Ch", "Pa", "Ju")
print(nuqta[0], nuqta[1])
print(len(kunlar), kunlar[-1])
print(type(nuqta))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>3 5
5 Ju
&lt;class 'tuple'&gt;</code></pre>
<p>Kortej oddiy qavs bilan yoziladi. Indeks, kesim (<code>[1:3]</code>), <code>len()</code>, <code>in</code> — ro'yxatdagidek ishlaydi.</p>

<h3>Asosiy farq: o'zgartirib bo'lmaydi</h3>
<pre><code>nuqta = (3, 5)
nuqta[0] = 10</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>TypeError: 'tuple' object does not support item assignment</code></pre>
<p>Bu xato emas, balki <b>himoya</b>: koordinata yoki sana dasturning boshqa qismida tasodifan o'zgarib qolmaydi.</p>

<h3>Bitta elementli kortej</h3>
<pre><code>a = (5)
b = (5,)
print(type(a), type(b))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>&lt;class 'int'&gt; &lt;class 'tuple'&gt;</code></pre>
<p>Qavsning o'zi kortej yaratmaydi — uni <b>vergul</b> yaratadi. Bitta elementli kortejda vergul majburiy.</p>

<h3>Ochish (unpacking)</h3>
<pre><code>ism, yosh, shahar = ("Ali", 19, "Guliston")
print(ism)
print(shahar)

a, b = 1, 2
a, b = b, a
print(a, b)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Ali
Guliston
2 1</code></pre>
<p>Ikki o'zgaruvchini almashtirishning eng qisqa usuli <code>a, b = b, a</code> ham aslida kortej orqali ishlaydi.</p>

<h3>Ro'yxat yoki kortej?</h3>
<table>
  <tr><th></th><th>Ro'yxat <code>[ ]</code></th><th>Kortej <code>( )</code></th></tr>
  <tr><td>O'zgartirish</td><td>Mumkin</td><td>Mumkin emas</td></tr>
  <tr><td>Qachon ishlatiladi</td><td>Elementlar qo'shiladi/o'chiriladi</td><td>Tuzilma qat'iy: koordinata, sana, yozuv</td></tr>
  <tr><td>Lug'at kaliti bo'la oladimi</td><td>Yo'q</td><td>Ha</td></tr>
</table>

<h3>Ichma-ich ro'yxat — jadval</h3>
<p>Ro'yxat ichida ro'yxat saqlash mumkin. Bu jadval yoki <b>matritsa</b>ni ifodalaydi: tashqi ro'yxat — satrlar, ichki ro'yxatlar — ustunlar.</p>
<pre><code>jadval = [
    [1, 2, 3],
    [4, 5, 6],
]
print(jadval[0])
print(jadval[1][2])
print(len(jadval), len(jadval[0]))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[1, 2, 3]
6
2 3</code></pre>
<p><code>jadval[1][2]</code> deganda avval 1-satr olinadi, keyin undagi 2-element.</p>

<h3>Jadvalni aylanib chiqish</h3>
<pre><code>jadval = [[1, 2, 3], [4, 5, 6]]
for satr in jadval:
    for x in satr:
        print(x, end=" ")
    print()</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>1 2 3 
4 5 6 </code></pre>
<p>Ichma-ich sikl: tashqi sikl satrlarni, ichki sikl satrdagi elementlarni aylanadi.</p>

<h3>Ro'yxatlar ichida lug'at</h3>
<p>Haqiqiy dasturlarda ko'pincha "yozuvlar ro'yxati" ishlatiladi — har bir yozuv lug'at:</p>
<pre><code>talabalar = [
    {"ism": "Ali", "ball": 87},
    {"ism": "Vali", "ball": 92},
    {"ism": "Dilnoza", "ball": 78},
]
for t in talabalar:
    print(t["ism"], "-", t["ball"])

eng_yaxshi = max(talabalar, key=lambda t: t["ball"])
print("Eng yuqori:", eng_yaxshi["ism"])</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Ali - 87
Vali - 92
Dilnoza - 78
Eng yuqori: Vali</code></pre>
<p><code>key=lambda t: t["ball"]</code> — "solishtirishda ballga qara" degani. <code>lambda</code> — bir qatorli nomsiz funksiya.</p>

<h3>Keng tarqalgan xato</h3>
<pre><code>xato = [[0] * 3] * 2
xato[0][0] = 9
print(xato)

togri = [[0] * 3 for _ in range(2)]
togri[0][0] = 9
print(togri)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[[9, 0, 0], [9, 0, 0]]
[[9, 0, 0], [0, 0, 0]]</code></pre>
<p><code>[[0]*3]*2</code> bir xil ichki ro'yxatni ikki marta <b>nusxalamaydi</b> — ikkala satr bitta ro'yxatga ishora qiladi. Jadval yaratishda doim ikkinchi usuldan foydalaning.</p>

<h3>Xulosa</h3>
<ul>
  <li>Kortej <code>(1, 2)</code> — o'zgarmas ro'yxat, qat'iy tuzilmalar uchun</li>
  <li>Bitta elementli kortej: <code>(5,)</code></li>
  <li><code>a, b = b, a</code> — almashtirish, <code>x, y = nuqta</code> — ochish</li>
  <li>Jadval — ro'yxatlar ro'yxati, element <code>jadval[satr][ustun]</code></li>
  <li>Jadvalni <code>[[0]*m for _ in range(n)]</code> bilan yarating</li>
</ul>
$html$,
    15, 10, 25, 45, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t1;

  -- ==========================================================
  -- 16. Istisnolarni qayta ishlash: try / except
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, 'Istisnolarni qayta ishlash: try / except', 'istisnolar-try-except',
$html$
<h2>Dastur "yiqilmasligi" kerak</h2>
<p>Foydalanuvchi son o'rniga harf kiritsa, nolga bo'linish yuz bersa yoki fayl topilmasa, Python <b>istisno</b> (exception) chiqaradi va dastur to'xtaydi. Haqiqiy dasturda bu qabul qilinmaydi: bankomat noto'g'ri tugma bosilgani uchun o'chib qolmaydi.</p>
<p><code>try / except</code> — "xato bo'lishi mumkin bo'lgan joyni sinab ko'r, bo'lsa — men aytgandek yo'l tut" degan buyruq.</p>

<h3>Eng oddiy shakl</h3>
<pre><code>try:
    son = int(input())
    print("Kvadrati:", son * son)
except ValueError:
    print("Bu son emas!")</code></pre>
<p class="text-xs"><b>Kirish:</b></p><pre><code>abc</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Bu son emas!</code></pre>
<p><code>try</code> blokidagi qaysidir qator xato bersa, qolgan qatorlar tashlab ketiladi va boshqaruv <code>except</code> ga o'tadi. Xato bo'lmasa, <code>except</code> umuman bajarilmaydi.</p>

<h3>Eng ko'p uchraydigan istisnolar</h3>
<table>
  <tr><th>Istisno</th><th>Qachon chiqadi</th><th>Misol</th></tr>
  <tr><td><code>ValueError</code></td><td>Qiymat noto'g'ri</td><td><code>int("abc")</code></td></tr>
  <tr><td><code>ZeroDivisionError</code></td><td>Nolga bo'lish</td><td><code>5 / 0</code></td></tr>
  <tr><td><code>IndexError</code></td><td>Indeks chegaradan tashqarida</td><td><code>[1, 2][5]</code></td></tr>
  <tr><td><code>KeyError</code></td><td>Lug'atda bunday kalit yo'q</td><td><code>{"a": 1}["b"]</code></td></tr>
  <tr><td><code>TypeError</code></td><td>Tur mos emas</td><td><code>"5" + 3</code></td></tr>
  <tr><td><code>FileNotFoundError</code></td><td>Fayl topilmadi</td><td><code>open("yoq.txt")</code></td></tr>
</table>

<h3>Bir nechta except</h3>
<pre><code>def bol(a, b):
    try:
        return int(a) / int(b)
    except ValueError:
        return "Son kiriting"
    except ZeroDivisionError:
        return "Nolga bo'lib bo'lmaydi"

print(bol("10", "4"))
print(bol("10", "0"))
print(bol("o'n", "2"))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>2.5
Nolga bo'lib bo'lmaydi
Son kiriting</code></pre>
<p>Har bir xato turiga o'z javobi. Python <code>except</code> larni yuqoridan pastga tekshiradi va birinchi mos kelganini bajaradi.</p>

<h3>Xato matnini olish</h3>
<pre><code>try:
    sonlar = [1, 2, 3]
    print(sonlar[10])
except IndexError as e:
    print("Xato:", e)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Xato: list index out of range</code></pre>

<h3>else va finally</h3>
<pre><code>for kiritma in ["8", "x"]:
    try:
        n = int(kiritma)
    except ValueError:
        print(kiritma, "-&gt; xato")
    else:
        print(kiritma, "-&gt; muvaffaqiyat:", n * 2)
    finally:
        print("  tekshiruv tugadi")</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>8 -&gt; muvaffaqiyat: 16
  tekshiruv tugadi
x -&gt; xato
  tekshiruv tugadi</code></pre>
<ul>
  <li><code>else</code> — xato <b>bo'lmagandagina</b> bajariladi</li>
  <li><code>finally</code> — <b>har doim</b> bajariladi. Faylni yopish, ulanishni uzish kabi "tozalash" ishlari shu yerga yoziladi</li>
</ul>

<h3>To'g'ri son kiritilguncha so'rash</h3>
<p>Amalda eng foydali usul — <code>while</code> bilan birga ishlatish:</p>
<pre><code>while True:
    try:
        yosh = int(input("Yoshingiz: "))
        break
    except ValueError:
        print("Iltimos, son kiriting")
print("Rahmat!")</code></pre>

<h3>O'zingiz istisno chiqarish: raise</h3>
<pre><code>def yosh_tekshir(yosh):
    if yosh &lt; 0:
        raise ValueError("Yosh manfiy bo'lishi mumkin emas")
    return yosh

try:
    yosh_tekshir(-5)
except ValueError as e:
    print(e)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Yosh manfiy bo'lishi mumkin emas</code></pre>
<p><code>raise</code> funksiyaga "bu qiymat bilan ishlay olmayman" deb aytish imkonini beradi. Qanday yo'l tutishni esa chaqirgan kod hal qiladi.</p>

<h3>Yomon odat: hamma narsani yutib yuborish</h3>
<pre><code>try:
    ...
except:          # YOMON — har qanday xatoni, hatto kodingizdagi xatoni ham yashiradi
    pass</code></pre>
<p>Doim <b>aniq</b> istisno turini yozing. Kutilmagan xato yashirilsa, uni topish soatlab vaqt oladi.</p>

<h3>Xulosa</h3>
<ul>
  <li><code>try</code> — xavfli kod, <code>except Tur</code> — xatoga javob</li>
  <li><code>else</code> — xato bo'lmasa, <code>finally</code> — har doim</li>
  <li><code>except Tur as e</code> — xato matnini olish</li>
  <li><code>raise</code> — o'zingiz istisno chiqarish</li>
  <li>Bo'sh <code>except:</code> yozmang — aniq turni ko'rsating</li>
</ul>
$html$,
    16, 10, 25, 45, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t2;

  -- ==========================================================
  -- 17. Fayllar bilan ishlash
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, 'Fayllar bilan ishlash', 'fayllar-bilan-ishlash',
$html$
<h2>Ma'lumot dastur yopilgandan keyin ham saqlansin</h2>
<p>O'zgaruvchilar operativ xotirada yashaydi: dastur tugashi bilan ular yo'qoladi. Talabalar ro'yxati, o'yin rekordi yoki sozlamalar keyingi safar ham kerak bo'lsa, ular <b>faylga</b> yoziladi.</p>

<h3>Faylni ochish rejimlari</h3>
<table>
  <tr><th>Rejim</th><th>Ma'nosi</th><th>Fayl bo'lmasa</th></tr>
  <tr><td><code>"r"</code></td><td>O'qish (sukut bo'yicha)</td><td>FileNotFoundError</td></tr>
  <tr><td><code>"w"</code></td><td>Yozish — eski mazmun <b>o'chiriladi</b></td><td>Yaratiladi</td></tr>
  <tr><td><code>"a"</code></td><td>Oxiriga qo'shish</td><td>Yaratiladi</td></tr>
</table>
<p><code>"w"</code> bilan ehtiyot bo'ling: faylda nima bo'lsa ham, ochilgan zahoti bo'shaydi.</p>

<h3>with — faylni o'zi yopadi</h3>
<pre><code>with open("salom.txt", "w", encoding="utf-8") as f:
    f.write("Birinchi qator\n")
    f.write("Ikkinchi qator\n")</code></pre>
<p><code>with</code> bloki tugashi bilan fayl <b>avtomatik yopiladi</b> — hatto ichida xato yuz bersa ham. Faylni yopmaslik ma'lumot yo'qolishiga olib kelishi mumkin, shuning uchun doim <code>with</code> ishlating.</p>
<p><code>encoding="utf-8"</code> o'zbekcha harflar (<b>o'</b>, <b>g'</b>) va kirill matni to'g'ri saqlanishi uchun kerak.</p>

<h3>O'qishning uch usuli</h3>
<pre><code>with open("salom.txt", encoding="utf-8") as f:
    hammasi = f.read()          # butun fayl bitta satr bo'lib

with open("salom.txt", encoding="utf-8") as f:
    qatorlar = f.readlines()    # qatorlar ro'yxati, har birida \n bor

with open("salom.txt", encoding="utf-8") as f:
    for qator in f:             # qatorma-qator — katta fayllar uchun eng yaxshisi
        print(qator.strip())</code></pre>
<p><code>strip()</code> qator oxiridagi <code>\n</code> belgisini olib tashlaydi, aks holda <code>print</code> bo'sh qator qo'shib yuboradi.</p>

<h3>To'liq misol: ballar faylini qayta ishlash</h3>
<p>Fayl <code>ballar.txt</code> quyidagicha bo'lsin:</p>
<pre><code>Ali 87
Vali 92
Dilnoza 78</code></pre>
<pre><code>ballar = {}
with open("ballar.txt", encoding="utf-8") as f:
    for qator in f:
        ism, ball = qator.split()
        ballar[ism] = int(ball)

ortacha = sum(ballar.values()) / len(ballar)
print(f"O'rtacha: {ortacha:.1f}")

with open("natija.txt", "w", encoding="utf-8") as f:
    for ism, ball in ballar.items():
        holat = "o'tdi" if ball &gt;= ortacha else "past"
        f.write(f"{ism}: {holat}\n")</code></pre>
<p>Bu yerda butun kurs davomida o'rganilgan narsalar bir joyga keldi: sikl, <code>split()</code>, lug'at, f-satr va shart.</p>

<h3>Fayl topilmasa</h3>
<pre><code>try:
    with open("sozlamalar.txt", encoding="utf-8") as f:
        sozlama = f.read()
except FileNotFoundError:
    sozlama = "standart"</code></pre>
<p>Fayl bilan ishlash — <code>try / except</code> eng ko'p kerak bo'ladigan joy.</p>

<h3>CSV — jadval fayllari</h3>
<p>Excel jadvallari ko'pincha <b>CSV</b> (vergul bilan ajratilgan qiymatlar) ko'rinishida saqlanadi. Python'da buning uchun tayyor modul bor:</p>
<pre><code>import csv

with open("talabalar.csv", encoding="utf-8") as f:
    for satr in csv.reader(f):
        print(satr)          # ['Ali', '87'] kabi ro'yxat</code></pre>

<h3>Platformadagi topshiriqlar haqida</h3>
<p>Platformada kodingiz tekshiruv serverida ishlaydi va diskka yozish imkoni yo'q. Shuning uchun bu mavzu topshiriqlarida fayl o'rnida <b>standart kirish</b> (<code>input()</code>) ishlatiladi — qatorma-qator o'qish mantig'i aynan bir xil. Fayl bilan ishlashni kompyuteringizda yoki laboratoriya mashg'ulotida sinab ko'ring.</p>

<h3>Xulosa</h3>
<ul>
  <li><code>with open(nom, rejim, encoding="utf-8") as f:</code> — doim shu shaklda</li>
  <li><code>"r"</code> o'qish, <code>"w"</code> qayta yozish, <code>"a"</code> qo'shish</li>
  <li>Katta faylni <code>for qator in f:</code> bilan o'qing</li>
  <li><code>strip()</code> qator oxiridagi <code>\n</code> ni olib tashlaydi</li>
  <li>Fayl yo'qligini <code>FileNotFoundError</code> bilan ushlang</li>
</ul>
$html$,
    17, 10, 25, 40, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t3;

  -- ==========================================================
  -- 18. Rekursiya
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, 'Rekursiya', 'rekursiya',
$html$
<h2>O'zini chaqiradigan funksiya</h2>
<p><b>Rekursiya</b> — funksiyaning o'z-o'zini chaqirishi. Bu g'alati tuyulishi mumkin, lekin ko'p masalalar tabiatan shunday tuzilgan: katta masala o'ziga o'xshash kichikroq masaladan iborat.</p>
<p>Hayotiy misol: matryoshka. Uni ochsangiz, ichida yana matryoshka. Eng kichigiga yetguningizcha ochaverasiz, eng kichigi esa ochilmaydi.</p>

<h3>Ikki majburiy qism</h3>
<ol>
  <li><b>Asosiy holat</b> (to'xtash sharti) — javob to'g'ridan-to'g'ri ma'lum, yana chaqirish kerak emas</li>
  <li><b>Rekursiv qadam</b> — masalani kichraytirib, funksiyani qayta chaqirish</li>
</ol>

<h3>Faktorial</h3>
<p>5! = 5 × 4 × 3 × 2 × 1. E'tibor bering: 5! = 5 × 4!, 4! = 4 × 3! va hokazo.</p>
<pre><code>def faktorial(n):
    if n &lt;= 1:                    # asosiy holat
        return 1
    return n * faktorial(n - 1)   # rekursiv qadam

print(faktorial(5))
print(faktorial(1))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>120
1</code></pre>

<h3>Qanday ishlaydi</h3>
<pre><code>faktorial(4)
= 4 * faktorial(3)
= 4 * (3 * faktorial(2))
= 4 * (3 * (2 * faktorial(1)))
= 4 * (3 * (2 * 1))
= 24</code></pre>
<p>Har bir chaqiruv javobni kutib turadi. Asosiy holatga yetgach, javoblar teskari tartibda yig'ilib qaytadi. Python bu kutib turgan chaqiruvlarni <b>chaqiruvlar steki</b>da saqlaydi.</p>

<h3>Asosiy holat bo'lmasa</h3>
<pre><code>def cheksiz(n):
    return cheksiz(n - 1)

cheksiz(5)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>RecursionError: maximum recursion depth exceeded</code></pre>
<p>Python stekni taxminan 1000 chaqiruv bilan cheklaydi. Rekursiya yozganda birinchi savol doim: <b>qachon to'xtaydi?</b></p>

<h3>Raqamlar yig'indisi</h3>
<pre><code>def raqamlar_yigindisi(n):
    if n &lt; 10:
        return n
    return n % 10 + raqamlar_yigindisi(n // 10)

print(raqamlar_yigindisi(2026))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>10</code></pre>
<p><code>n % 10</code> oxirgi raqamni beradi, <code>n // 10</code> esa uni tashlab yuboradi. Bitta raqam qolganda to'xtaymiz.</p>

<h3>Fibonachchi va qimmat takrorlanish</h3>
<pre><code>def fib(n):
    if n &lt; 2:
        return n
    return fib(n - 1) + fib(n - 2)

print([fib(i) for i in range(10)])</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]</code></pre>
<p>Bu kod chiroyli, lekin <b>juda sekin</b>: <code>fib(30)</code> bir xil qiymatlarni million martalab qayta hisoblaydi. Har bir chaqiruv ikki yangi chaqiruv tug'diradi.</p>
<p>Yechim — allaqachon hisoblangan natijalarni eslab qolish:</p>
<pre><code>from functools import lru_cache

@lru_cache
def fib(n):
    if n &lt; 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(80))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>23416728348467685</code></pre>

<h3>Rekursiya yoki sikl?</h3>
<p>Har qanday rekursiyani sikl bilan yozish mumkin va aksincha. Qoida oddiy:</p>
<ul>
  <li>Masala <b>daraxtsimon</b> bo'lsa (papkalar ichida papkalar, ichma-ich ro'yxatlar, labirint) — rekursiya tabiiyroq</li>
  <li>Oddiy hisob (yig'indi, faktorial) uchun sikl tezroq va xavfsizroq</li>
</ul>
<pre><code>def hammasini_yig(royxat):
    s = 0
    for x in royxat:
        if isinstance(x, list):
            s += hammasini_yig(x)   # ichki ro'yxat — o'shaning o'zi
        else:
            s += x
    return s

print(hammasini_yig([1, [2, 3], [4, [5, 6]]]))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>21</code></pre>
<p>Bu masalani sikl bilan yozish ancha qiyin bo'lardi: ichma-ichlik qancha chuqur ekanini oldindan bilmaymiz.</p>

<h3>Xulosa</h3>
<ul>
  <li>Rekursiya = asosiy holat + kichraytirilgan masala uchun o'zini chaqirish</li>
  <li>Asosiy holat yo'q bo'lsa — <code>RecursionError</code></li>
  <li>Takrorlanuvchi hisoblarni <code>@lru_cache</code> bilan tezlashtiring</li>
  <li>Daraxtsimon masalalar uchun rekursiya, oddiy hisob uchun sikl</li>
</ul>
$html$,
    18, 10, 25, 45, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t4;

  -- ==========================================================
  -- 19. Saralash va qidiruv algoritmlari
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, 'Saralash va qidiruv algoritmlari', 'saralash-va-qidiruv',
$html$
<h2>Algoritm — bu retsept</h2>
<p><b>Algoritm</b> — masalani yechish uchun aniq qadamlar ketma-ketligi. Bir masalani turli algoritmlar bilan yechish mumkin, lekin ular <b>tezligi</b> bilan keskin farq qiladi. Ro'yxatda 10 ta element bo'lsa farq sezilmaydi, 10 million bo'lsa — biri bir soniyada, boshqasi bir soatda ishlaydi.</p>

<h3>Chiziqli qidiruv</h3>
<p>Eng oddiy usul: boshidan boshlab har bir elementni tekshirish.</p>
<pre><code>def chiziqli(royxat, nishon):
    for i, x in enumerate(royxat):
        if x == nishon:
            return i
    return -1

sonlar = [7, 3, 9, 1, 5]
print(chiziqli(sonlar, 9))
print(chiziqli(sonlar, 4))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>2
-1</code></pre>
<p>n ta elementda eng yomon holatda n ta tekshiruv kerak. Tartiblanmagan ro'yxat uchun bundan yaxshisi yo'q.</p>

<h3>Ikkilik qidiruv</h3>
<p>Ro'yxat <b>tartiblangan</b> bo'lsa, ancha tezroq usul bor. Lug'atdan so'z qidirishni eslang: kitobni o'rtasidan ochasiz, so'z oldinroqda bo'lsa chap yarmiga o'tasiz, aks holda o'ng yarmiga. Har qadamda qidiruv sohasi <b>ikki baravar</b> qisqaradi.</p>
<pre><code>def ikkilik(royxat, nishon):
    chap, ong = 0, len(royxat) - 1
    qadam = 0
    while chap &lt;= ong:
        qadam += 1
        orta = (chap + ong) // 2
        if royxat[orta] == nishon:
            return orta, qadam
        if royxat[orta] &lt; nishon:
            chap = orta + 1
        else:
            ong = orta - 1
    return -1, qadam

sonlar = list(range(0, 1_000_000, 2))     # 500 000 ta juft son
print(ikkilik(sonlar, 777_778))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>(388889, 19)</code></pre>
<p>500 ming elementdan kerakligini <b>20 tadan kam qadamda</b> topdik. Chiziqli qidiruv uchun 388 ming qadam kerak bo'lardi.</p>

<h3>Pufakchali saralash</h3>
<p>Qo'shni elementlarni solishtirib, noto'g'ri tartibda bo'lsa almashtiramiz. Har bir o'tishda eng katta element "pufakchadek" oxirga suzib chiqadi.</p>
<pre><code>def pufakcha(a):
    a = a[:]                       # asl ro'yxatni buzmaslik uchun nusxa
    n = len(a)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if a[j] &gt; a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

print(pufakcha([5, 2, 9, 1, 7]))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[1, 2, 5, 7, 9]</code></pre>
<p>Tushunish oson, lekin sekin: n ta element uchun taxminan n² ta solishtirish. 10 000 elementda — 50 million.</p>

<h3>Tanlab saralash</h3>
<pre><code>def tanlab(a):
    a = a[:]
    for i in range(len(a)):
        eng_kichik = i
        for j in range(i + 1, len(a)):
            if a[j] &lt; a[eng_kichik]:
                eng_kichik = j
        a[i], a[eng_kichik] = a[eng_kichik], a[i]
    return a

print(tanlab([5, 2, 9, 1, 7]))</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[1, 2, 5, 7, 9]</code></pre>
<p>Har qadamda qolgan qismdan eng kichigini topib, o'z joyiga qo'yamiz.</p>

<h3>Amalda: sorted() va sort()</h3>
<p>Haqiqiy dasturda saralashni o'zingiz yozmaysiz. Python'ning o'rnatilgan saralashi (Timsort) juda tez va ishonchli:</p>
<pre><code>sonlar = [5, 2, 9, 1, 7]
print(sorted(sonlar))                  # yangi ro'yxat
print(sorted(sonlar, reverse=True))    # kamayish tartibida

sozlar = ["olma", "anor", "uzum", "nok"]
print(sorted(sozlar, key=len))         # uzunlik bo'yicha

sonlar.sort()                          # joyida saralaydi, hech narsa qaytarmaydi
print(sonlar)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>[1, 2, 5, 7, 9]
[9, 7, 5, 2, 1]
['nok', 'olma', 'anor', 'uzum']
[1, 2, 5, 7, 9]</code></pre>

<h3>Murakkab kalit bo'yicha saralash</h3>
<pre><code>talabalar = [("Ali", 87), ("Vali", 92), ("Dilnoza", 87), ("Sardor", 75)]

# Ball kamayishi bo'yicha, teng bo'lsa ism bo'yicha
natija = sorted(talabalar, key=lambda t: (-t[1], t[0]))
for ism, ball in natija:
    print(ism, ball)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Vali 92
Ali 87
Dilnoza 87
Sardor 75</code></pre>
<p>Kalit kortej bo'lsa, Python avval birinchi elementni, teng bo'lsa ikkinchisini solishtiradi. <code>-t[1]</code> — kamayish tartibi uchun qisqa usul.</p>

<h3>Tezlikni taqqoslash</h3>
<table>
  <tr><th>Algoritm</th><th>1 000 element</th><th>1 000 000 element</th></tr>
  <tr><td>Chiziqli qidiruv</td><td>~1 000 qadam</td><td>~1 000 000 qadam</td></tr>
  <tr><td>Ikkilik qidiruv</td><td>~10 qadam</td><td>~20 qadam</td></tr>
  <tr><td>Pufakchali saralash</td><td>~500 000</td><td>~500 000 000 000</td></tr>
  <tr><td><code>sorted()</code></td><td>~10 000</td><td>~20 000 000</td></tr>
</table>

<h3>Xulosa</h3>
<ul>
  <li>Tartiblanmagan ro'yxatda — chiziqli qidiruv</li>
  <li>Tartiblangan ro'yxatda — ikkilik qidiruv, har qadamda soha ikki baravar qisqaradi</li>
  <li>Pufakchali va tanlab saralash — o'rganish uchun, amalda <code>sorted()</code></li>
  <li><code>key=</code> — nima bo'yicha saralashni ko'rsatadi, <code>reverse=True</code> — teskari tartib</li>
</ul>
$html$,
    19, 10, 25, 50, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t5;

  -- ==========================================================
  -- 20. Obyektga yo'naltirilgan dasturlash asoslari
  -- ==========================================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course, 'Obyektga yo''naltirilgan dasturlash asoslari', 'oop-asoslari',
$html$
<h2>Ma'lumot va amallarni birlashtirish</h2>
<p>Hozirgacha ma'lumot (o'zgaruvchi, ro'yxat, lug'at) va uni qayta ishlovchi kod (funksiyalar) alohida yashardi. Dastur kattalashgan sari bu chalkashlikka olib keladi: qaysi funksiya qaysi lug'at bilan ishlaydi?</p>
<p><b>Obyektga yo'naltirilgan dasturlash</b> (OYD, inglizcha OOP) ularni bitta "quti"ga joylaydi. Bunday quti <b>obyekt</b> deyiladi, uning andozasi esa <b>sinf</b> (class).</p>
<p>Hayotiy o'xshatish: <b>sinf</b> — uy loyihasi (chizma), <b>obyekt</b> — shu loyiha asosida qurilgan aniq uy. Bitta chizmadan yuzta uy qurish mumkin, har birining rangi va egasi turlicha.</p>

<h3>Birinchi sinf</h3>
<pre><code>class Talaba:
    def __init__(self, ism, kurs):
        self.ism = ism
        self.kurs = kurs
        self.ballar = []

    def ball_qosh(self, ball):
        self.ballar.append(ball)

    def ortacha(self):
        if not self.ballar:
            return 0
        return sum(self.ballar) / len(self.ballar)

ali = Talaba("Ali", 1)
ali.ball_qosh(85)
ali.ball_qosh(91)
print(ali.ism, ali.kurs)
print(ali.ortacha())</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Ali 1
88.0</code></pre>

<h3>Tarkibiy qismlar</h3>
<ul>
  <li><code>class Talaba:</code> — sinf e'lon qilish. Nom katta harf bilan boshlanadi</li>
  <li><code>__init__</code> — <b>konstruktor</b>: obyekt yaratilganda avtomatik chaqiriladi va boshlang'ich qiymatlarni o'rnatadi</li>
  <li><code>self</code> — "shu obyektning o'zi". Har bir metodning birinchi parametri. <code>self.ism</code> — shu obyektga tegishli o'zgaruvchi (<b>atribut</b>)</li>
  <li><code>ball_qosh</code>, <code>ortacha</code> — <b>metodlar</b>: sinf ichidagi funksiyalar</li>
  <li><code>Talaba("Ali", 1)</code> — yangi obyekt yaratish. <code>self</code> ni o'zimiz bermaymiz, Python uni o'zi qo'yadi</li>
</ul>

<h3>Har bir obyekt mustaqil</h3>
<pre><code>class Hisob:
    def __init__(self, egasi, balans=0):
        self.egasi = egasi
        self.balans = balans

    def toldirish(self, summa):
        self.balans += summa

    def yechish(self, summa):
        if summa &gt; self.balans:
            print(f"{self.egasi}: mablag' yetarli emas")
            return
        self.balans -= summa

a = Hisob("Ali", 100)
b = Hisob("Vali")
a.yechish(30)
b.toldirish(50)
b.yechish(80)
print(a.balans, b.balans)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Vali: mablag' yetarli emas
70 50</code></pre>
<p><code>a</code> va <code>b</code> bitta sinfdan yaratilgan, lekin balanslari alohida. Yana bir muhim narsa: <code>yechish</code> metodi balansni manfiy bo'lishdan <b>himoya qiladi</b>. Ma'lumotni faqat to'g'ri yo'l bilan o'zgartirishga ruxsat berish OYDning asosiy g'oyalaridan biri — <b>inkapsulyatsiya</b>.</p>

<h3>__str__ — obyektni chiroyli chiqarish</h3>
<pre><code>class Nuqta:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"

p = Nuqta(3, 4)
print(p)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>(3, 4)</code></pre>
<p><code>__str__</code> bo'lmasa, <code>print(p)</code> <code>&lt;__main__.Nuqta object at 0x...&gt;</code> kabi tushunarsiz matn chiqarardi.</p>

<h3>Meros — mavjud sinfni kengaytirish</h3>
<pre><code>class Hayvon:
    def __init__(self, nom):
        self.nom = nom

    def tanishtir(self):
        return f"Men {self.nom}, {self.ovoz()} deyman"

    def ovoz(self):
        return "..."

class Mushuk(Hayvon):
    def ovoz(self):
        return "miyov"

class It(Hayvon):
    def ovoz(self):
        return "vov"

for h in [Mushuk("Mosh"), It("Bobik")]:
    print(h.tanishtir())</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>Men Mosh, miyov deyman
Men Bobik, vov deyman</code></pre>
<p><code>class Mushuk(Hayvon)</code> — Mushuk Hayvonning hamma xususiyatlarini <b>meros</b> qilib oladi va faqat farq qiladigan joyini (<code>ovoz</code>) qayta yozadi. <code>tanishtir</code> metodi bir marta yozilgan, lekin har bir hayvon uchun to'g'ri ovozni ishlatadi — bu <b>polimorfizm</b>.</p>

<h3>Siz allaqachon obyektlar bilan ishlagansiz</h3>
<pre><code>s = "salom"
print(type(s))
print(s.upper())

r = [3, 1, 2]
r.append(5)
print(type(r), r)</code></pre>
<p class="text-xs"><b>Natija:</b></p><pre><code>&lt;class 'str'&gt;
SALOM
&lt;class 'list'&gt; [3, 1, 2, 5]</code></pre>
<p>Pythonda hamma narsa obyekt: satr — <code>str</code> sinfining obyekti, <code>upper()</code> — uning metodi. Ro'yxatning <code>append</code> i ham metod. Endi siz bunday sinflarni o'zingiz yarata olasiz.</p>

<h3>Xulosa</h3>
<ul>
  <li><b>Sinf</b> — andoza, <b>obyekt</b> — undan yaratilgan nusxa</li>
  <li><code>__init__</code> boshlang'ich holatni o'rnatadi, <code>self</code> — obyektning o'zi</li>
  <li>Atributlar — obyekt ma'lumotlari, metodlar — uning amallari</li>
  <li><code>__str__</code> — <code>print</code> uchun matn</li>
  <li>Meros: <code>class Bola(Ota):</code> — kodni takrorlamasdan kengaytirish</li>
</ul>
$html$,
    20, 10, 25, 50, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true
  RETURNING id INTO t6;

  -- Mavjud mavzular tartibini moslash
  UPDATE topics SET order_index = 21 WHERE course_id = v_course AND slug = 'python-va-suniy-intellekt';

  -- Qayta ishga tushirilganda dublikat bo'lmasligi uchun
  DELETE FROM quizzes WHERE topic_id IN (t1, t2, t3, t4, t5, t6);
  DELETE FROM topic_tasks WHERE topic_id IN (t1, t2, t3, t4, t5, t6);

  -- Testlar: Kortej (tuple) va ichma-ich tuzilmalar
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t1, 'Quyidagilardan qaysi biri KORTEJ yaratadi?', 'single',
   '[{"id": "a", "text": "(5)", "is_correct": false}, {"id": "b", "text": "(5,)", "is_correct": true}, {"id": "c", "text": "[5]", "is_correct": false}, {"id": "d", "text": "{5}", "is_correct": false}]'::jsonb,
   'Kortejni vergul yaratadi. (5) — shunchaki qavs ichidagi son, {5} — to''plam.', 1, 0),
  (t1, 'Kod nima chiqaradi?

jadval = [[1, 2], [3, 4], [5, 6]]
print(jadval[2][0])', 'single',
   '[{"id": "a", "text": "5", "is_correct": true}, {"id": "b", "text": "2", "is_correct": false}, {"id": "c", "text": "3", "is_correct": false}, {"id": "d", "text": "6", "is_correct": false}]'::jsonb,
   'jadval[2] — uchinchi satr [5, 6], undagi 0-element — 5.', 1, 1),
  (t1, 'nuqta = (3, 5) bo''lsa, nuqta[0] = 7 qanday natija beradi?', 'single',
   '[{"id": "a", "text": "nuqta (7, 5) ga aylanadi", "is_correct": false}, {"id": "b", "text": "TypeError xatosi", "is_correct": true}, {"id": "c", "text": "Yangi kortej yaratiladi", "is_correct": false}, {"id": "d", "text": "Hech narsa o''zgarmaydi, xato ham chiqmaydi", "is_correct": false}]'::jsonb,
   'Kortej o''zgarmas — uning elementiga qiymat berish TypeError chiqaradi.', 1, 2),
  (t1, 'Kod nima chiqaradi?

a, b = 4, 9
a, b = b, a
print(a - b)', 'single',
   '[{"id": "a", "text": "5", "is_correct": true}, {"id": "b", "text": "-5", "is_correct": false}, {"id": "c", "text": "0", "is_correct": false}, {"id": "d", "text": "13", "is_correct": false}]'::jsonb,
   'Almashtirishdan keyin a = 9, b = 4. 9 - 4 = 5.', 1, 3),
  (t1, 'Kod nima chiqaradi?

m = [[0] * 2] * 2
m[0][1] = 7
print(m[1][1])', 'single',
   '[{"id": "a", "text": "7", "is_correct": true}, {"id": "b", "text": "0", "is_correct": false}, {"id": "c", "text": "2", "is_correct": false}, {"id": "d", "text": "IndexError", "is_correct": false}]'::jsonb,
   '[[0]*2]*2 ikkala satrni BITTA ro''yxatga bog''laydi. Birini o''zgartirsangiz, ikkinchisi ham o''zgaradi.', 1, 4);

  -- Topshiriqlar: Kortej (tuple) va ichma-ich tuzilmalar
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t1, 'Nuqtalar orasidagi masofa',
   'Ikki qatorda ikki nuqtaning koordinatalari berilgan: x y. Ular orasidagi masofani 2 xona aniqlikda chiqaring.

Masofa = √((x2 − x1)² + (y2 − y1)²)',
   'x1, y1 = map(int, input().split())
x2, y2 = map(int, input().split())
# Kodingizni yozing',
   'x1, y1 = map(int, input().split())
x2, y2 = map(int, input().split())
d = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
print(f"{d:.2f}")',
   'python',
   '[{"input": "0 0\n3 4", "expected_output": "5.00", "is_hidden": false}, {"input": "1 1\n1 1", "expected_output": "0.00", "is_hidden": false}, {"input": "-2 3\n4 -5", "expected_output": "10.00", "is_hidden": true}, {"input": "0 0\n1 1", "expected_output": "1.41", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "** 0.5 — kvadrat ildiz"}, {"order": 2, "text": "f\"{d:.2f}\" — 2 xona aniqlik"}]'::jsonb,
   'easy', 5, 15, 0),
  (t1, 'Jadval satrlari yig''indisi',
   'Birinchi qatorda n va m. Keyingi n qatorda m tadan son — jadval. Har bir satrning yig''indisini alohida qatorda chiqaring.',
   'n, m = map(int, input().split())
# Kodingizni yozing',
   'n, m = map(int, input().split())
for _ in range(n):
    satr = list(map(int, input().split()))
    print(sum(satr))',
   'python',
   '[{"input": "2 3\n1 2 3\n4 5 6", "expected_output": "6\n15", "is_hidden": false}, {"input": "1 1\n7", "expected_output": "7", "is_hidden": false}, {"input": "3 2\n-1 1\n0 0\n5 5", "expected_output": "0\n0\n10", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Har satrni alohida o''qing"}, {"order": 2, "text": "sum() satr yig''indisini beradi"}]'::jsonb,
   'easy', 5, 15, 1),
  (t1, 'Diagonal yig''indisi',
   'Birinchi qatorda n. Keyingi n qatorda n tadan son — kvadrat jadval. Bosh diagonal (chap yuqoridan o''ng pastga) elementlari yig''indisini chiqaring.',
   'n = int(input())
jadval = [list(map(int, input().split())) for _ in range(n)]
# Kodingizni yozing',
   'n = int(input())
jadval = [list(map(int, input().split())) for _ in range(n)]
print(sum(jadval[i][i] for i in range(n)))',
   'python',
   '[{"input": "3\n1 2 3\n4 5 6\n7 8 9", "expected_output": "15", "is_hidden": false}, {"input": "1\n42", "expected_output": "42", "is_hidden": false}, {"input": "2\n-1 5\n5 -1", "expected_output": "-2", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Bosh diagonalda satr va ustun raqami teng: jadval[i][i]"}, {"order": 2, "text": "i ni 0 dan n-1 gacha aylantiring"}]'::jsonb,
   'medium', 8, 20, 2);

  -- Testlar: Istisnolarni qayta ishlash: try / except
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t2, 'int("12a") qaysi istisnoni chiqaradi?', 'single',
   '[{"id": "a", "text": "ValueError", "is_correct": true}, {"id": "b", "text": "TypeError", "is_correct": false}, {"id": "c", "text": "SyntaxError", "is_correct": false}, {"id": "d", "text": "IndexError", "is_correct": false}]'::jsonb,
   'Tur to''g''ri (matn), lekin qiymat songa aylanmaydi — bu ValueError.', 1, 0),
  (t2, 'Kod nima chiqaradi?

try:
    print(10 / 0)
except ZeroDivisionError:
    print("nol")
finally:
    print("tamom")', 'single',
   '[{"id": "a", "text": "nol\ntamom", "is_correct": true}, {"id": "b", "text": "nol", "is_correct": false}, {"id": "c", "text": "tamom", "is_correct": false}, {"id": "d", "text": "ZeroDivisionError", "is_correct": false}]'::jsonb,
   'Nolga bo''lishda except ishlaydi, finally esa har doim bajariladi.', 1, 1),
  (t2, 'else bloki qachon bajariladi?', 'single',
   '[{"id": "a", "text": "try blokida xato bo''lmaganda", "is_correct": true}, {"id": "b", "text": "Har doim", "is_correct": false}, {"id": "c", "text": "Xato bo''lganda", "is_correct": false}, {"id": "d", "text": "finally dan oldin, faqat xato bo''lganda", "is_correct": false}]'::jsonb,
   'else — ''hammasi yaxshi o''tdi'' holati uchun. Har doim bajariladigani — finally.', 1, 2),
  (t2, 'Kod nima chiqaradi?

d = {"a": 1}
try:
    print(d["b"])
except KeyError:
    print("yo''q")
else:
    print("bor")', 'single',
   '[{"id": "a", "text": "yo''q", "is_correct": true}, {"id": "b", "text": "bor", "is_correct": false}, {"id": "c", "text": "None", "is_correct": false}, {"id": "d", "text": "yo''q\nbor", "is_correct": false}]'::jsonb,
   'Lug''atda ''b'' kaliti yo''q — KeyError, else bajarilmaydi.', 1, 3),
  (t2, 'Nima uchun bo''sh except: (turini ko''rsatmasdan) yozish yomon odat hisoblanadi?', 'single',
   '[{"id": "a", "text": "U kodingizdagi kutilmagan xatolarni ham yashiradi", "is_correct": true}, {"id": "b", "text": "Python uni qabul qilmaydi — SyntaxError", "is_correct": false}, {"id": "c", "text": "Dastur sekinlashadi", "is_correct": false}, {"id": "d", "text": "finally bilan birga ishlamaydi", "is_correct": false}]'::jsonb,
   'Bo''sh except har qanday xatoni yutib yuboradi, hatto o''zgaruvchi nomidagi xatoni ham. Natijada muammoni topish juda qiyinlashadi.', 1, 4);

  -- Topshiriqlar: Istisnolarni qayta ishlash: try / except
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t2, 'Xavfsiz bo''lish',
   'Ikki qatorda ikki butun son a va b berilgan. a / b ni 2 xona aniqlikda chiqaring.

Agar b = 0 bo''lsa, "Nolga bo''lib bo''lmaydi" deb chiqaring. Masalani try / except bilan yeching.',
   'a = int(input())
b = int(input())
# Kodingizni yozing',
   'a = int(input())
b = int(input())
try:
    print(f"{a / b:.2f}")
except ZeroDivisionError:
    print("Nolga bo''lib bo''lmaydi")',
   'python',
   '[{"input": "10\n4", "expected_output": "2.50", "is_hidden": false}, {"input": "7\n0", "expected_output": "Nolga bo''lib bo''lmaydi", "is_hidden": false}, {"input": "-9\n3", "expected_output": "-3.00", "is_hidden": true}, {"input": "0\n5", "expected_output": "0.00", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "a / b ni try ichiga qo''ying"}, {"order": 2, "text": "except ZeroDivisionError:"}]'::jsonb,
   'easy', 5, 15, 0),
  (t2, 'Faqat sonlarni yig''ish',
   'Bitta qatorda bo''shliq bilan ajratilgan qiymatlar berilgan. Ularning ba''zilari butun son, ba''zilari emas.

Butun songa aylanadigan qiymatlarning yig''indisini chiqaring, qolganlarini e''tiborsiz qoldiring.

Misol: 5 abc 3 7x -2 → 6',
   'qiymatlar = input().split()
# Kodingizni yozing',
   'qiymatlar = input().split()
s = 0
for q in qiymatlar:
    try:
        s += int(q)
    except ValueError:
        pass
print(s)',
   'python',
   '[{"input": "5 abc 3 7x -2", "expected_output": "6", "is_hidden": false}, {"input": "a b c", "expected_output": "0", "is_hidden": false}, {"input": "10 20 30", "expected_output": "60", "is_hidden": true}, {"input": "1.5 2 x3 -4", "expected_output": "-2", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Har bir qiymatni alohida int() ga aylantirib ko''ring"}, {"order": 2, "text": "Aylanmasa — except ValueError ichida pass"}]'::jsonb,
   'medium', 8, 20, 1),
  (t2, 'Xavfsiz indeks',
   'Birinchi qatorda bo''shliq bilan ajratilgan so''zlar. Ikkinchi qatorda indeks — butun son yoki noto''g''ri qiymat.

Shu indeksdagi so''zni chiqaring. Agar indeks son bo''lmasa, "Son emas" deb, chegaradan tashqarida bo''lsa "Bunday indeks yo''q" deb chiqaring. Manfiy indekslar Python qoidasi bo''yicha ishlaydi.',
   'sozlar = input().split()
k = input()
# Kodingizni yozing',
   'sozlar = input().split()
k = input()
try:
    print(sozlar[int(k)])
except ValueError:
    print("Son emas")
except IndexError:
    print("Bunday indeks yo''q")',
   'python',
   '[{"input": "olma nok uzum\n1", "expected_output": "nok", "is_hidden": false}, {"input": "olma nok uzum\n5", "expected_output": "Bunday indeks yo''q", "is_hidden": false}, {"input": "olma nok uzum\nikki", "expected_output": "Son emas", "is_hidden": true}, {"input": "olma nok uzum\n-1", "expected_output": "uzum", "is_hidden": true}, {"input": "bir\n-2", "expected_output": "Bunday indeks yo''q", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Ikki xil xato bor: ValueError va IndexError"}, {"order": 2, "text": "Har biriga alohida except yozing"}]'::jsonb,
   'medium', 8, 20, 2);

  -- Testlar: Fayllar bilan ishlash
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t3, 'Qaysi rejim faylning eski mazmunini O''CHIRIB, yangidan yozadi?', 'single',
   '[{"id": "a", "text": "\"w\"", "is_correct": true}, {"id": "b", "text": "\"a\"", "is_correct": false}, {"id": "c", "text": "\"r\"", "is_correct": false}, {"id": "d", "text": "\"r+\"", "is_correct": false}]'::jsonb,
   '"w" ochilgan zahoti faylni bo''shatadi. Oxiriga qo''shish uchun "a" ishlatiladi.', 1, 0),
  (t3, 'with open(...) as f: ishlatishning asosiy afzalligi nima?', 'single',
   '[{"id": "a", "text": "Blok tugashi bilan fayl avtomatik yopiladi, hatto xato bo''lsa ham", "is_correct": true}, {"id": "b", "text": "Fayl tezroq o''qiladi", "is_correct": false}, {"id": "c", "text": "Fayl mavjud bo''lmasa xato chiqmaydi", "is_correct": false}, {"id": "d", "text": "encoding ko''rsatish shart bo''lmaydi", "is_correct": false}]'::jsonb,
   'with — resursni kafolatli yopish mexanizmi. Fayl yo''qligi esa baribir FileNotFoundError beradi.', 1, 1),
  (t3, 'Mavjud bo''lmagan faylni "r" rejimida ochsangiz nima bo''ladi?', 'single',
   '[{"id": "a", "text": "FileNotFoundError chiqadi", "is_correct": true}, {"id": "b", "text": "Bo''sh fayl yaratiladi", "is_correct": false}, {"id": "c", "text": "None qaytadi", "is_correct": false}, {"id": "d", "text": "Bo''sh satr qaytadi", "is_correct": false}]'::jsonb,
   'O''qish rejimi faylni yaratmaydi. Yaratish faqat "w" va "a" rejimlarida bo''ladi.', 1, 2),
  (t3, 'Kod nima chiqaradi?

qator = "Ali 87\n"
print(len(qator), len(qator.strip()))', 'single',
   '[{"id": "a", "text": "7 6", "is_correct": true}, {"id": "b", "text": "6 6", "is_correct": false}, {"id": "c", "text": "7 7", "is_correct": false}, {"id": "d", "text": "6 5", "is_correct": false}]'::jsonb,
   '\n — bitta belgi. strip() uni olib tashlaydi: 7 → 6.', 1, 3),
  (t3, 'Nima uchun encoding="utf-8" ko''rsatish tavsiya etiladi?', 'single',
   '[{"id": "a", "text": "O''zbekcha va kirill harflari har qanday kompyuterda to''g''ri o''qilishi uchun", "is_correct": true}, {"id": "b", "text": "Fayl hajmi kichrayishi uchun", "is_correct": false}, {"id": "c", "text": "Faylni faqat Python o''qiy olishi uchun", "is_correct": false}, {"id": "d", "text": "Usiz fayl ochilmaydi", "is_correct": false}]'::jsonb,
   'Kodlash ko''rsatilmasa, Windows o''z standart kodlashini ishlatadi va o'''', g'''' yoki kirill harflari buzilishi mumkin.', 1, 4);

  -- Topshiriqlar: Fayllar bilan ishlash
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t3, 'Qatorlarni raqamlash',
   'Birinchi qatorda n. Keyingi n qatorda matn — bu "fayl" mazmuni. Har bir qatorni raqami bilan chiqaring:

1: birinchi qator matni
2: ikkinchi qator matni',
   'n = int(input())
# Kodingizni yozing',
   'n = int(input())
for i in range(1, n + 1):
    qator = input()
    print(f"{i}: {qator}")',
   'python',
   '[{"input": "2\nSalom\nDunyo", "expected_output": "1: Salom\n2: Dunyo", "is_hidden": false}, {"input": "1\nYakka qator", "expected_output": "1: Yakka qator", "is_hidden": false}, {"input": "3\na\nb\nc", "expected_output": "1: a\n2: b\n3: c", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "range(1, n + 1) raqamlarni 1 dan boshlaydi"}, {"order": 2, "text": "f\"{i}: {qator}\""}]'::jsonb,
   'easy', 5, 15, 0),
  (t3, 'Ballar jadvali',
   'Birinchi qatorda n. Keyingi n qatorda "ism ball" — xuddi ballar.txt faylidagidek.

Eng yuqori ball olgan talabaning ismini va o''rtacha ballni (1 xona aniqlikda) ikki qatorda chiqaring. Eng yuqori ball bir nechta bo''lsa, birinchi uchraganini oling.',
   'n = int(input())
# Kodingizni yozing',
   'n = int(input())
ballar = {}
for _ in range(n):
    ism, ball = input().split()
    ballar[ism] = int(ball)
eng = max(ballar, key=ballar.get)
print(eng)
print(f"{sum(ballar.values()) / n:.1f}")',
   'python',
   '[{"input": "3\nAli 87\nVali 92\nDilnoza 78", "expected_output": "Vali\n85.7", "is_hidden": false}, {"input": "1\nSardor 100", "expected_output": "Sardor\n100.0", "is_hidden": false}, {"input": "4\nA 50\nB 70\nC 70\nD 10", "expected_output": "B\n50.0", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Har qatorni split() bilan ism va ballga ajrating"}, {"order": 2, "text": "max(lugat, key=lugat.get) eng katta qiymatli kalitni beradi"}]'::jsonb,
   'medium', 8, 20, 1),
  (t3, 'So''zlar statistikasi',
   'Birinchi qatorda n. Keyingi n qatorda matn. Butun matndagi:
1) qatorlar sonini,
2) so''zlar sonini,
3) belgilar sonini (bo''shliqlar bilan, qator oxiri belgisisiz)
uch qatorda chiqaring. Bu — Linux''dagi wc dasturining soddalashtirilgan nusxasi.',
   'n = int(input())
# Kodingizni yozing',
   'n = int(input())
sozlar = 0
belgilar = 0
for _ in range(n):
    q = input()
    sozlar += len(q.split())
    belgilar += len(q)
print(n)
print(sozlar)
print(belgilar)',
   'python',
   '[{"input": "2\nSalom dunyo\nPython zo''r", "expected_output": "2\n4\n22", "is_hidden": false}, {"input": "1\nbir", "expected_output": "1\n1\n3", "is_hidden": false}, {"input": "3\na b c\n\nd", "expected_output": "3\n4\n6", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Har qatorda so''zlarni split() bilan sanang"}, {"order": 2, "text": "len(qator) — belgilar soni"}]'::jsonb,
   'medium', 8, 20, 2);

  -- Testlar: Rekursiya
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t4, 'Rekursiv funksiyada asosiy holat (to''xtash sharti) nima uchun kerak?', 'single',
   '[{"id": "a", "text": "Usiz funksiya o''zini cheksiz chaqiradi va RecursionError beradi", "is_correct": true}, {"id": "b", "text": "Funksiya tezroq ishlashi uchun", "is_correct": false}, {"id": "c", "text": "return ishlatish uchun", "is_correct": false}, {"id": "d", "text": "Python sintaksisi shuni talab qiladi", "is_correct": false}]'::jsonb,
   'Asosiy holat rekursiyani to''xtatadi. U bo''lmasa stek to''lib, RecursionError chiqadi.', 1, 0),
  (t4, 'Kod nima chiqaradi?

def f(n):
    if n == 0:
        return 0
    return n + f(n - 1)

print(f(4))', 'single',
   '[{"id": "a", "text": "10", "is_correct": true}, {"id": "b", "text": "4", "is_correct": false}, {"id": "c", "text": "24", "is_correct": false}, {"id": "d", "text": "0", "is_correct": false}]'::jsonb,
   'f(4) = 4 + 3 + 2 + 1 + 0 = 10.', 1, 1),
  (t4, 'Kod nima chiqaradi?

def f(s):
    if len(s) <= 1:
        return s
    return f(s[1:]) + s[0]

print(f("abc"))', 'single',
   '[{"id": "a", "text": "cba", "is_correct": true}, {"id": "b", "text": "abc", "is_correct": false}, {"id": "c", "text": "bca", "is_correct": false}, {"id": "d", "text": "a", "is_correct": false}]'::jsonb,
   'Har qadamda birinchi harf oxirga o''tadi — natijada satr teskari bo''ladi.', 1, 2),
  (t4, 'Oddiy rekursiv fib(n) = fib(n-1) + fib(n-2) nima uchun katta n da juda sekin?', 'single',
   '[{"id": "a", "text": "Bir xil qiymatlar ko''p marta qayta hisoblanadi", "is_correct": true}, {"id": "b", "text": "Python rekursiyani qo''llab-quvvatlamaydi", "is_correct": false}, {"id": "c", "text": "Sonlar juda katta bo''lib ketadi", "is_correct": false}, {"id": "d", "text": "return ikki marta ishlatilgan", "is_correct": false}]'::jsonb,
   'fib(30) ichida fib(2) yuz minglab marta hisoblanadi. @lru_cache natijalarni eslab qolib, buni bartaraf qiladi.', 1, 3),
  (t4, 'Qaysi masala uchun rekursiya eng tabiiy tanlov?', 'single',
   '[{"id": "a", "text": "Ichma-ich papkalardagi barcha fayllarni sanash", "is_correct": true}, {"id": "b", "text": "1 dan 100 gacha sonlar yig''indisi", "is_correct": false}, {"id": "c", "text": "Ro''yxatdagi eng katta sonni topish", "is_correct": false}, {"id": "d", "text": "Matnni katta harfga o''tkazish", "is_correct": false}]'::jsonb,
   'Papkalar daraxtsimon: papka ichida papka bo''lishi mumkin va chuqurlik oldindan noma''lum. Qolganlari oddiy sikl bilan yechiladi.', 1, 4);

  -- Topshiriqlar: Rekursiya
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t4, 'Rekursiv daraja',
   'Ikki butun son a va n berilgan (n ≥ 0). a ning n-darajasini REKURSIYA yordamida hisoblang.

** operatori va pow() ishlatmang: aⁿ = a × aⁿ⁻¹, a⁰ = 1.',
   'def daraja(a, n):
    # Kodingizni yozing
    pass

a, n = map(int, input().split())
print(daraja(a, n))',
   'def daraja(a, n):
    if n == 0:
        return 1
    return a * daraja(a, n - 1)

a, n = map(int, input().split())
print(daraja(a, n))',
   'python',
   '[{"input": "2 10", "expected_output": "1024", "is_hidden": false}, {"input": "5 0", "expected_output": "1", "is_hidden": false}, {"input": "-3 3", "expected_output": "-27", "is_hidden": true}, {"input": "7 1", "expected_output": "7", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Asosiy holat: n == 0 bo''lsa 1 qaytaring"}, {"order": 2, "text": "Rekursiv qadam: a * daraja(a, n - 1)"}]'::jsonb,
   'easy', 5, 15, 0),
  (t4, 'Raqamlar yig''indisi (rekursiv)',
   'Manfiy bo''lmagan butun son berilgan. Uning raqamlari yig''indisini rekursiya yordamida toping.

Misol: 2026 → 2 + 0 + 2 + 6 = 10',
   'def yigindi(n):
    # Kodingizni yozing
    pass

print(yigindi(int(input())))',
   'def yigindi(n):
    if n < 10:
        return n
    return n % 10 + yigindi(n // 10)

print(yigindi(int(input())))',
   'python',
   '[{"input": "2026", "expected_output": "10", "is_hidden": false}, {"input": "7", "expected_output": "7", "is_hidden": false}, {"input": "0", "expected_output": "0", "is_hidden": true}, {"input": "99999", "expected_output": "45", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "n % 10 — oxirgi raqam, n // 10 — qolgan qismi"}, {"order": 2, "text": "Bitta raqam qolganda (n < 10) to''xtang"}]'::jsonb,
   'easy', 5, 15, 1),
  (t4, 'Palindromni rekursiv tekshirish',
   'Bitta so''z berilgan. Agar u palindrom bo''lsa (teskarisiga o''qilganda ham bir xil) "HA", aks holda "YO''Q" chiqaring.

Rekursiv g''oya: birinchi va oxirgi harf teng bo''lsa, o''rtadagi qism ham palindrom bo''lishi kerak.',
   'def palindrom(s):
    # Kodingizni yozing
    pass

print("HA" if palindrom(input()) else "YO''Q")',
   'def palindrom(s):
    if len(s) <= 1:
        return True
    if s[0] != s[-1]:
        return False
    return palindrom(s[1:-1])

print("HA" if palindrom(input()) else "YO''Q")',
   'python',
   '[{"input": "kiyik", "expected_output": "HA", "is_hidden": false}, {"input": "python", "expected_output": "YO''Q", "is_hidden": false}, {"input": "a", "expected_output": "HA", "is_hidden": true}, {"input": "abba", "expected_output": "HA", "is_hidden": true}, {"input": "abca", "expected_output": "YO''Q", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Uzunligi 0 yoki 1 bo''lsa — palindrom"}, {"order": 2, "text": "s[1:-1] birinchi va oxirgi harfsiz qism"}]'::jsonb,
   'medium', 8, 20, 2);

  -- Testlar: Saralash va qidiruv algoritmlari
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t5, 'Ikkilik qidiruvni qo''llash uchun qaysi shart majburiy?', 'single',
   '[{"id": "a", "text": "Ro''yxat tartiblangan bo''lishi kerak", "is_correct": true}, {"id": "b", "text": "Ro''yxatda takrorlar bo''lmasligi kerak", "is_correct": false}, {"id": "c", "text": "Elementlar faqat butun son bo''lishi kerak", "is_correct": false}, {"id": "d", "text": "Ro''yxat uzunligi juft bo''lishi kerak", "is_correct": false}]'::jsonb,
   'Ikkilik qidiruv o''rtadagi element bilan solishtirib, qaysi yarmini tashlashni hal qiladi. Bu faqat tartiblangan ro''yxatda to''g''ri ishlaydi.', 1, 0),
  (t5, '1 000 000 elementli tartiblangan ro''yxatda ikkilik qidiruv eng ko''pi bilan taxminan nechta qadam qiladi?', 'single',
   '[{"id": "a", "text": "20", "is_correct": true}, {"id": "b", "text": "1 000", "is_correct": false}, {"id": "c", "text": "500 000", "is_correct": false}, {"id": "d", "text": "1 000 000", "is_correct": false}]'::jsonb,
   'Har qadamda soha ikki baravar qisqaradi: 2²⁰ ≈ 1 000 000, demak taxminan 20 qadam.', 1, 1),
  (t5, 'Kod nima chiqaradi?

a = [3, 1, 2]
b = a.sort()
print(b)', 'single',
   '[{"id": "a", "text": "None", "is_correct": true}, {"id": "b", "text": "[1, 2, 3]", "is_correct": false}, {"id": "c", "text": "[3, 1, 2]", "is_correct": false}, {"id": "d", "text": "TypeError", "is_correct": false}]'::jsonb,
   'sort() ro''yxatni joyida saralaydi va hech narsa qaytarmaydi (None). Yangi ro''yxat kerak bo''lsa — sorted().', 1, 2),
  (t5, 'Kod nima chiqaradi?

sozlar = ["nok", "anor", "uzum", "o"]
print(sorted(sozlar, key=len)[0])', 'single',
   '[{"id": "a", "text": "o", "is_correct": true}, {"id": "b", "text": "anor", "is_correct": false}, {"id": "c", "text": "nok", "is_correct": false}, {"id": "d", "text": "uzum", "is_correct": false}]'::jsonb,
   'key=len — uzunlik bo''yicha. Eng qisqasi ''o'' (1 harf).', 1, 3),
  (t5, 'Pufakchali saralashning har bir to''liq o''tishidan keyin nima kafolatlanadi?', 'single',
   '[{"id": "a", "text": "Saralanmagan qismdagi eng katta element oxiriga joylashadi", "is_correct": true}, {"id": "b", "text": "Eng kichik element boshiga joylashadi", "is_correct": false}, {"id": "c", "text": "Ro''yxat to''liq saralanadi", "is_correct": false}, {"id": "d", "text": "Ro''yxat ikkiga bo''linadi", "is_correct": false}]'::jsonb,
   'Qo''shni elementlar almashtirilgani uchun eng katta element har o''tishda oxirga ''suzib'' chiqadi.', 1, 4);

  -- Topshiriqlar: Saralash va qidiruv algoritmlari
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t5, 'Ikkilik qidiruv',
   'Birinchi qatorda n, ikkinchi qatorda o''sish tartibida n ta turli butun son, uchinchi qatorda qidirilayotgan son.

Sonning indeksini (0 dan boshlab) ikkilik qidiruv bilan toping. Topilmasa -1 chiqaring. index() va in operatorini ishlatmang.',
   'n = int(input())
a = list(map(int, input().split()))
x = int(input())
# Kodingizni yozing',
   'n = int(input())
a = list(map(int, input().split()))
x = int(input())
chap, ong = 0, n - 1
javob = -1
while chap <= ong:
    orta = (chap + ong) // 2
    if a[orta] == x:
        javob = orta
        break
    if a[orta] < x:
        chap = orta + 1
    else:
        ong = orta - 1
print(javob)',
   'python',
   '[{"input": "5\n1 3 5 7 9\n7", "expected_output": "3", "is_hidden": false}, {"input": "5\n1 3 5 7 9\n4", "expected_output": "-1", "is_hidden": false}, {"input": "1\n10\n10", "expected_output": "0", "is_hidden": true}, {"input": "6\n-5 -2 0 3 8 10\n-5", "expected_output": "0", "is_hidden": true}, {"input": "6\n-5 -2 0 3 8 10\n10", "expected_output": "5", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "chap = 0, ong = n - 1 dan boshlang"}, {"order": 2, "text": "O''rtadagi son kichik bo''lsa chap = orta + 1, katta bo''lsa ong = orta - 1"}]'::jsonb,
   'medium', 8, 20, 0),
  (t5, 'Pufakchali saralash',
   'Birinchi qatorda n, ikkinchi qatorda n ta butun son. Ularni pufakchali saralash algoritmini O''ZINGIZ yozib, o''sish tartibida chiqaring.

sort() va sorted() ishlatmang.',
   'n = int(input())
a = list(map(int, input().split()))
# Kodingizni yozing
print(*a)',
   'n = int(input())
a = list(map(int, input().split()))
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
print(*a)',
   'python',
   '[{"input": "5\n5 2 9 1 7", "expected_output": "1 2 5 7 9", "is_hidden": false}, {"input": "1\n4", "expected_output": "4", "is_hidden": false}, {"input": "4\n3 3 1 1", "expected_output": "1 1 3 3", "is_hidden": true}, {"input": "5\n-1 -5 0 10 -3", "expected_output": "-5 -3 -1 0 10", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Ikki ichma-ich sikl kerak"}, {"order": 2, "text": "a[j] > a[j + 1] bo''lsa almashtiring: a[j], a[j+1] = a[j+1], a[j]"}]'::jsonb,
   'medium', 8, 20, 1),
  (t5, 'Reyting jadvali',
   'Birinchi qatorda n. Keyingi n qatorda "ism ball". Talabalarni ball kamayishi bo''yicha, ballar teng bo''lsa — ism bo''yicha alifbo tartibida chiqaring.

Har bir qatorda: o''rin. ism ball',
   'n = int(input())
# Kodingizni yozing',
   'n = int(input())
t = []
for _ in range(n):
    ism, ball = input().split()
    t.append((ism, int(ball)))
t.sort(key=lambda x: (-x[1], x[0]))
for i, (ism, ball) in enumerate(t, 1):
    print(f"{i}. {ism} {ball}")',
   'python',
   '[{"input": "4\nAli 87\nVali 92\nDilnoza 87\nSardor 75", "expected_output": "1. Vali 92\n2. Ali 87\n3. Dilnoza 87\n4. Sardor 75", "is_hidden": false}, {"input": "1\nZarina 100", "expected_output": "1. Zarina 100", "is_hidden": false}, {"input": "3\nc 5\nb 5\na 5", "expected_output": "1. a 5\n2. b 5\n3. c 5", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Kalit sifatida kortej ishlating: (-ball, ism)"}, {"order": 2, "text": "enumerate(royxat, 1) raqamlashni 1 dan boshlaydi"}]'::jsonb,
   'hard', 12, 30, 2);

  -- Testlar: Obyektga yo'naltirilgan dasturlash asoslari
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t6, '__init__ metodi qachon chaqiriladi?', 'single',
   '[{"id": "a", "text": "Sinfdan yangi obyekt yaratilganda avtomatik", "is_correct": true}, {"id": "b", "text": "Faqat dasturchi uni qo''lda chaqirganda", "is_correct": false}, {"id": "c", "text": "Obyekt o''chirilganda", "is_correct": false}, {"id": "d", "text": "print() bilan chiqarilganda", "is_correct": false}]'::jsonb,
   '__init__ — konstruktor. Talaba("Ali", 1) yozilgan zahoti Python uni o''zi chaqiradi.', 1, 0),
  (t6, 'Metodlardagi self parametri nimani bildiradi?', 'single',
   '[{"id": "a", "text": "Metod chaqirilgan obyektning o''zini", "is_correct": true}, {"id": "b", "text": "Sinfning nomini", "is_correct": false}, {"id": "c", "text": "Global o''zgaruvchini", "is_correct": false}, {"id": "d", "text": "Ota sinfni", "is_correct": false}]'::jsonb,
   'a.yechish(30) chaqirilganda self = a bo''ladi. Shuning uchun self.balans aynan a ning balansi.', 1, 1),
  (t6, 'Kod nima chiqaradi?

class Sanoq:
    def __init__(self):
        self.n = 0
    def bos(self):
        self.n += 1

a = Sanoq()
b = Sanoq()
a.bos(); a.bos(); b.bos()
print(a.n, b.n)', 'single',
   '[{"id": "a", "text": "2 1", "is_correct": true}, {"id": "b", "text": "3 3", "is_correct": false}, {"id": "c", "text": "1 1", "is_correct": false}, {"id": "d", "text": "2 2", "is_correct": false}]'::jsonb,
   'Har bir obyektning o''z n atributi bor: a ikki marta, b bir marta bosildi.', 1, 2),
  (t6, 'Kod nima chiqaradi?

class A:
    def nom(self):
        return "A"
    def salom(self):
        return "Men " + self.nom()

class B(A):
    def nom(self):
        return "B"

print(B().salom())', 'single',
   '[{"id": "a", "text": "Men B", "is_correct": true}, {"id": "b", "text": "Men A", "is_correct": false}, {"id": "c", "text": "AttributeError", "is_correct": false}, {"id": "d", "text": "Men AB", "is_correct": false}]'::jsonb,
   'B salom() ni A dan meros oladi, lekin self.nom() B ning o''z versiyasini chaqiradi — polimorfizm.', 1, 3),
  (t6, 'print(obyekt) chaqirilganda qaysi metod chiqariladigan matnni belgilaydi?', 'single',
   '[{"id": "a", "text": "__str__", "is_correct": true}, {"id": "b", "text": "__init__", "is_correct": false}, {"id": "c", "text": "__print__", "is_correct": false}, {"id": "d", "text": "__text__", "is_correct": false}]'::jsonb,
   '__str__ obyektning foydalanuvchi uchun matnli ko''rinishini qaytaradi.', 1, 4);

  -- Topshiriqlar: Obyektga yo'naltirilgan dasturlash asoslari
  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t6, 'To''rtburchak sinfi',
   'To''rtburchak sinfini yarating: konstruktor eni va bo''yini oladi, yuza() va perimetr() metodlari bor.

Kirishda eni va bo''yi beriladi. Yuza va perimetrni ikki qatorda chiqaring.',
   'class Tortburchak:
    # Kodingizni yozing
    pass

a, b = map(int, input().split())
t = Tortburchak(a, b)
print(t.yuza())
print(t.perimetr())',
   'class Tortburchak:
    def __init__(self, en, boy):
        self.en = en
        self.boy = boy

    def yuza(self):
        return self.en * self.boy

    def perimetr(self):
        return 2 * (self.en + self.boy)

a, b = map(int, input().split())
t = Tortburchak(a, b)
print(t.yuza())
print(t.perimetr())',
   'python',
   '[{"input": "3 4", "expected_output": "12\n14", "is_hidden": false}, {"input": "5 5", "expected_output": "25\n20", "is_hidden": false}, {"input": "1 10", "expected_output": "10\n22", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "__init__ ichida self.en va self.boy ni saqlang"}, {"order": 2, "text": "Metodlar self orqali ularga murojaat qiladi"}]'::jsonb,
   'easy', 5, 15, 0),
  (t6, 'Bank hisobi',
   'Hisob sinfini yarating. Boshlang''ich balans 0. Kirishda birinchi qatorda n, keyingi n qatorda amallar:

+ summa — hisobni to''ldirish
- summa — pul yechish. Mablag'' yetmasa, amal bajarilmaydi va "Rad etildi" chiqariladi

Oxirida yakuniy balansni chiqaring.',
   'class Hisob:
    # Kodingizni yozing
    pass

n = int(input())
h = Hisob()
for _ in range(n):
    amal, summa = input().split()
    # ...',
   'class Hisob:
    def __init__(self):
        self.balans = 0

    def toldirish(self, s):
        self.balans += s

    def yechish(self, s):
        if s > self.balans:
            print("Rad etildi")
            return
        self.balans -= s

n = int(input())
h = Hisob()
for _ in range(n):
    amal, summa = input().split()
    if amal == "+":
        h.toldirish(int(summa))
    else:
        h.yechish(int(summa))
print(h.balans)',
   'python',
   '[{"input": "3\n+ 100\n- 30\n- 100", "expected_output": "Rad etildi\n70", "is_hidden": false}, {"input": "2\n+ 50\n+ 25", "expected_output": "75", "is_hidden": false}, {"input": "1\n- 10", "expected_output": "Rad etildi\n0", "is_hidden": true}, {"input": "4\n+ 10\n- 10\n- 1\n+ 5", "expected_output": "Rad etildi\n5", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "Tekshiruvni yechish() metodining o''ziga joylang"}, {"order": 2, "text": "Har qatorni amal va summaga ajrating"}]'::jsonb,
   'medium', 8, 20, 1),
  (t6, 'Shakllar va meros',
   'Shakl ota sinfini va undan meros oluvchi Doira hamda Kvadrat sinflarini yarating. Har birida yuza() metodi bo''lsin. Doira yuzasi uchun π = 3.14 deb oling.

Kirishda n, keyingi n qatorda shakl: "doira r" yoki "kvadrat a". Har bir shakl yuzasini 2 xona aniqlikda, oxirida jami yuzani chiqaring.',
   'class Shakl:
    def yuza(self):
        return 0

# Doira va Kvadrat sinflarini yozing

n = int(input())',
   'class Shakl:
    def yuza(self):
        return 0

class Doira(Shakl):
    def __init__(self, r):
        self.r = r
    def yuza(self):
        return 3.14 * self.r ** 2

class Kvadrat(Shakl):
    def __init__(self, a):
        self.a = a
    def yuza(self):
        return self.a ** 2

n = int(input())
shakllar = []
for _ in range(n):
    tur, olcham = input().split()
    olcham = float(olcham)
    shakllar.append(Doira(olcham) if tur == "doira" else Kvadrat(olcham))
for s in shakllar:
    print(f"{s.yuza():.2f}")
print(f"{sum(s.yuza() for s in shakllar):.2f}")',
   'python',
   '[{"input": "2\ndoira 1\nkvadrat 2", "expected_output": "3.14\n4.00\n7.14", "is_hidden": false}, {"input": "1\nkvadrat 3", "expected_output": "9.00\n9.00", "is_hidden": false}, {"input": "3\ndoira 2\ndoira 0\nkvadrat 1", "expected_output": "12.56\n0.00\n1.00\n13.56", "is_hidden": true}]'::jsonb,
   '[{"order": 1, "text": "class Doira(Shakl): — meros"}, {"order": 2, "text": "Har bir sinf yuza() ni o''zicha qayta yozadi"}]'::jsonb,
   'hard', 12, 30, 2);

END $$;
