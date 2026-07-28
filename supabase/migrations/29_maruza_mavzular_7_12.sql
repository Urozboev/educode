-- ============================================
-- EduCode — "Dasturlash asoslari (Ma'ruza)" kursi
-- Fan dasturi: DAS1208, 2025-2026, Guliston DPI
-- Bu fayl: fan dasturidagi 7-12 mavzular (kursda 9-14 o'rin)
--
-- 27_maruza_mavzular_1_6.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirilsa dublikat yaratmaydi.
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
  -- 9. MAVZU (fan dasturi 7): Shartlar va tarmoqlanish
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'Shartlar va tarmoqlanish',
    'shartlar-va-tarmoqlanish',
    $html$
<h2>Dastur qaror qabul qiladi</h2>
<p>Shu paytgacha yozgan dasturlarimiz qatorma-qator, boshdan oxirigacha bir xil bajarilardi. Lekin haqiqiy masalalarda dastur <b>vaziyatga qarab</b> turlicha ish tutishi kerak: talaba bali 60 dan yuqori bo'lsa "o'tdi", aks holda "o'tmadi". Bunday tanlovni <b>shart operatori</b> amalga oshiradi.</p>

<h3>if — eng oddiy shart</h3>
<pre><code>ball = 75
if ball >= 60:
    print("Fandan o'tdingiz")</code></pre>
<p>Shart rost (<code>True</code>) bo'lsa, chekingan blok bajariladi. Yolg'on (<code>False</code>) bo'lsa, blok butunlay o'tkazib yuboriladi. Ikki nuqta va chekinish majburiy.</p>

<h3>if — else</h3>
<pre><code>ball = 45
if ball >= 60:
    print("O'tdingiz")
else:
    print("Qayta topshirasiz")</code></pre>
<p><code>else</code> bloki shart bajarilmagan barcha holatlarni qamrab oladi. Uning o'z sharti yo'q.</p>

<h3>elif — bir nechta yo'l</h3>
<p>Ikkitadan ortiq variant bo'lsa <code>elif</code> (else if qisqartmasi) ishlatiladi:</p>
<pre><code>ball = int(input())

if ball >= 90:
    print("A'lo")
elif ball >= 70:
    print("Yaxshi")
elif ball >= 60:
    print("Qoniqarli")
else:
    print("Qoniqarsiz")</code></pre>
<p>Muhim: shartlar <b>yuqoridan pastga</b> tekshiriladi va <b>birinchi rost topilgani</b> bajarilgach, qolganlari umuman qaralmaydi. Shuning uchun shartlar tartibi ahamiyatli — agar <code>ball >= 60</code> ni birinchi yozsak, 95 ball ham "Qoniqarli" deb chiqar edi.</p>

<h3>Taqqoslash operatorlari</h3>
<table>
  <tr><th>Operator</th><th>Ma'nosi</th><th>Misol</th></tr>
  <tr><td><code>==</code></td><td>teng</td><td><code>a == 5</code></td></tr>
  <tr><td><code>!=</code></td><td>teng emas</td><td><code>a != 5</code></td></tr>
  <tr><td><code>&gt;</code></td><td>katta</td><td><code>a &gt; 5</code></td></tr>
  <tr><td><code>&lt;</code></td><td>kichik</td><td><code>a &lt; 5</code></td></tr>
  <tr><td><code>&gt;=</code></td><td>katta yoki teng</td><td><code>a &gt;= 5</code></td></tr>
  <tr><td><code>&lt;=</code></td><td>kichik yoki teng</td><td><code>a &lt;= 5</code></td></tr>
</table>
<p>Eng ko'p uchraydigan xato — tenglikni tekshirishda bitta <code>=</code> yozib qo'yish. Bitta teng belgisi <b>qiymat berish</b>, ikkitasi <b>taqqoslash</b> demakdir.</p>

<h3>Mantiqiy operatorlar: and, or, not</h3>
<pre><code>yosh = 20
talaba = True

if yosh >= 18 and talaba:
    print("Chegirmali chipta")

if yosh &lt; 7 or yosh &gt; 60:
    print("Bepul chipta")

if not talaba:
    print("To'liq narx")</code></pre>
<ul>
  <li><code>and</code> — ikkala shart ham rost bo'lishi kerak</li>
  <li><code>or</code> — kamida bittasi rost bo'lsa yetarli</li>
  <li><code>not</code> — natijani teskarisiga o'zgartiradi</li>
</ul>

<h3>Zanjirli taqqoslash</h3>
<p>Pythonda matematikadagidek yozish mumkin:</p>
<pre><code>if 0 &lt;= ball &lt;= 100:
    print("Ball to'g'ri kiritilgan")</code></pre>
<p>Bu <code>ball &gt;= 0 and ball &lt;= 100</code> bilan bir xil, lekin ancha o'qishli.</p>

<h3>Ichma-ich shartlar</h3>
<pre><code>son = int(input())

if son > 0:
    if son % 2 == 0:
        print("Musbat va juft")
    else:
        print("Musbat va toq")
else:
    print("Musbat emas")</code></pre>
<p>Ichki shart tashqi shartga nisbatan yana bir pog'ona chekinadi. Ichma-ich shartlar uch pog'onadan oshib ketsa, kodni <code>and</code> yordamida soddalashtirish yaxshiroq.</p>

<h3>Amalda uchraydigan namuna</h3>
<pre><code>parol = input()

if len(parol) &lt; 8:
    print("Parol juda qisqa")
elif parol.isdigit():
    print("Parol faqat raqamlardan iborat")
else:
    print("Parol qabul qilindi")</code></pre>

<h3>Xulosa</h3>
<ul>
  <li><code>if</code> shartni tekshiradi, <code>elif</code> qo'shimcha variantlar beradi, <code>else</code> qolgan barcha holatni ushlaydi</li>
  <li>Shartdan keyin ikki nuqta, keyingi qatorda chekinish shart</li>
  <li>Taqqoslash uchun <code>==</code>, qiymat berish uchun <code>=</code></li>
  <li><code>and</code>, <code>or</code>, <code>not</code> bir nechta shartni birlashtiradi</li>
</ul>
$html$,
    9, 10, 25, 45, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true;

  -- ============================================
  -- 10. MAVZU (fan dasturi 8): Lug'at va to'plam
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'Lug''at (dict) va to''plam (set)',
    'lugat-va-toplam',
    $html$
<h2>Ro'yxat yetarli bo'lmaganda</h2>
<p>Ro'yxatda elementlar <b>tartib raqami</b> bilan saqlanadi: <code>talabalar[0]</code>, <code>talabalar[1]</code>. Lekin ko'pincha bizga raqam emas, <b>nom</b> bo'yicha murojaat qilish qulayroq: "Ali ning bali nechchi?" Aynan shu vazifani <b>lug'at</b> bajaradi.</p>

<h3>Lug'at (dictionary)</h3>
<p>Lug'at — <b>kalit: qiymat</b> juftliklari to'plami. Figurali qavs ichida yoziladi:</p>
<pre><code>ballar = {"Ali": 85, "Dilnoza": 92, "Bekzod": 74}

print(ballar["Dilnoza"])   # 92</code></pre>
<p>Bu yerda <code>"Ali"</code>, <code>"Dilnoza"</code>, <code>"Bekzod"</code> — kalitlar; <code>85</code>, <code>92</code>, <code>74</code> — qiymatlar.</p>

<h3>Element qo'shish va o'zgartirish</h3>
<pre><code>ballar["Malika"] = 88     # yangi juftlik qo'shildi
ballar["Ali"] = 90        # mavjud qiymat o'zgardi
del ballar["Bekzod"]      # o'chirildi</code></pre>
<p>Diqqat: agar kalit mavjud bo'lsa qiymat almashadi, mavjud bo'lmasa yangisi qo'shiladi. Ikkalasi ham bir xil yoziladi.</p>

<h3>Mavjud bo'lmagan kalit</h3>
<pre><code>print(ballar["Sardor"])       # KeyError!
print(ballar.get("Sardor"))   # None
print(ballar.get("Sardor", 0))# 0</code></pre>
<p><code>get()</code> metodi kalit topilmasa xato bermaydi. Ikkinchi argument — kalit bo'lmaganda qaytariladigan qiymat.</p>
<p>Kalit borligini tekshirish uchun <code>in</code> ishlatiladi:</p>
<pre><code>if "Ali" in ballar:
    print("Ali topildi")</code></pre>

<h3>Lug'at bo'ylab yurish</h3>
<pre><code>for ism in ballar:
    print(ism, ballar[ism])

for ism, ball in ballar.items():
    print(f"{ism}: {ball}")

print(list(ballar.keys()))     # kalitlar ro'yxati
print(list(ballar.values()))   # qiymatlar ro'yxati</code></pre>
<p><code>items()</code> usuli eng qulayi — u har aylanishda kalit va qiymatni birdan beradi.</p>

<h3>Foydali hisob-kitob</h3>
<pre><code>print(len(ballar))          # nechta juftlik bor
print(sum(ballar.values()))  # ballar yig'indisi
print(max(ballar.values()))  # eng yuqori ball</code></pre>

<h3>To'plam (set)</h3>
<p>To'plam — <b>takrorlanmaydigan</b> elementlar guruhi. Tartib saqlanmaydi.</p>
<pre><code>sonlar = {3, 1, 4, 1, 5, 3}
print(sonlar)     # {1, 3, 4, 5} — takrorlar yo'qoldi</code></pre>
<p>Bo'sh to'plam <code>{}</code> emas, <code>set()</code> bilan yaratiladi — chunki <code>{}</code> bo'sh lug'atni bildiradi.</p>

<h3>To'plam amallari</h3>
<pre><code>a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)   # birlashma:  {1, 2, 3, 4, 5, 6}
print(a &amp; b)   # kesishma:   {3, 4}
print(a - b)   # ayirma:     {1, 2}
print(a ^ b)   # simmetrik ayirma: {1, 2, 5, 6}</code></pre>
<p>Bu amallar matematikadagi to'plam amallari bilan aynan bir xil. Shuning uchun set ko'pincha "kim ikkala guruhda ham bor?", "kim faqat birinchisida?" kabi savollarga javob berishda ishlatiladi.</p>

<h3>Takrorlarni yo'qotishning eng qisqa yo'li</h3>
<pre><code>sonlar = [5, 2, 5, 8, 2, 9]
noyob = list(set(sonlar))
print(sorted(noyob))    # [2, 5, 8, 9]</code></pre>
<p><code>set()</code> takrorlarni tashlaydi, <code>list()</code> qayta ro'yxatga aylantiradi, <code>sorted()</code> tartiblaydi.</p>

<h3>Qachon qaysi birini tanlash kerak?</h3>
<table>
  <tr><th>Vazifa</th><th>Tuzilma</th></tr>
  <tr><td>Tartibli ketma-ketlik</td><td>list</td></tr>
  <tr><td>Nom bo'yicha qidirish</td><td>dict</td></tr>
  <tr><td>Takrorlarsiz guruh, a'zolikni tekshirish</td><td>set</td></tr>
  <tr><td>O'zgarmas ketma-ketlik</td><td>tuple</td></tr>
</table>
<p>Yana bir muhim jihat: <code>in</code> tekshiruvi ro'yxatda barcha elementni ko'rib chiqadi, lug'at va to'plamda esa deyarli bir zumda ishlaydi. Ma'lumot ko'p bo'lganda bu katta farq beradi.</p>

<h3>Xulosa</h3>
<ul>
  <li>Lug'at — kalit orqali qiymat saqlaydigan tuzilma, <code>{"kalit": qiymat}</code></li>
  <li><code>get()</code> xatosiz o'qish, <code>items()</code> juftliklar bo'ylab yurish uchun</li>
  <li>To'plam takrorlarni saqlamaydi va to'plam amallarini qo'llab-quvvatlaydi</li>
  <li>Bo'sh to'plam faqat <code>set()</code> bilan yaratiladi</li>
</ul>
$html$,
    10, 10, 25, 45, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true;

  -- ============================================
  -- 11. MAVZU (fan dasturi 9): While sikli
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'While sikli',
    'while-sikli',
    $html$
<h2>Necha marta takrorlashni bilmaganimizda</h2>
<p><code>for</code> sikli takrorlar soni <b>oldindan ma'lum</b> bo'lganda ishlatiladi: "10 ta sonni chiqar", "ro'yxatning har bir elementi uchun". Lekin ba'zan takrorlar soni oldindan noma'lum: "foydalanuvchi to'g'ri parol kiritmaguncha so'rayver". Bunday holatda <code>while</code> ishlatiladi.</p>

<h3>Asosiy tuzilish</h3>
<pre><code>i = 1
while i &lt;= 5:
    print(i)
    i = i + 1</code></pre>
<p>Ish tartibi: shart tekshiriladi → rost bo'lsa blok bajariladi → yana shart tekshiriladi → ... → shart yolg'on bo'lganda sikl tugaydi.</p>

<h3>Cheksiz siklga tushib qolmaslik</h3>
<pre><code># XATO! i hech qachon o'zgarmaydi
i = 1
while i &lt;= 5:
    print(i)</code></pre>
<p>Bu dastur to'xtamaydi. <b>Har bir while sikli uchun uchta savolga javob bering:</b></p>
<ol>
  <li>Sikldan oldin o'zgaruvchi qiymat oldimi?</li>
  <li>Shart qachondir yolg'on bo'ladimi?</li>
  <li>Sikl ichida shartga ta'sir qiladigan qiymat o'zgaradimi?</li>
</ol>

<h3>Foydalanuvchidan qayta so'rash</h3>
<pre><code>parol = input()
while parol != "python":
    print("Noto'g'ri, qayta urining")
    parol = input()
print("Xush kelibsiz!")</code></pre>
<p>Bu <code>while</code> ning eng tipik ishlatilishi — to'g'ri javob kelmaguncha so'rash.</p>

<h3>Yig'indi va hisoblagich</h3>
<pre><code>jami = 0
son = int(input())
while son != 0:
    jami = jami + son
    son = int(input())
print(jami)</code></pre>
<p>Bu yerda <code>0</code> — <b>to'xtatuvchi belgi</b> (sentinel). Foydalanuvchi 0 kiritganda sikl tugaydi va yig'indi chiqadi.</p>

<h3>break va continue</h3>
<pre><code>while True:
    buyruq = input()
    if buyruq == "chiqish":
        break          # sikldan butunlay chiqadi
    if buyruq == "":
        continue       # qolgan qismini o'tkazib, boshiga qaytadi
    print("Buyruq:", buyruq)</code></pre>
<ul>
  <li><code>break</code> — siklni darhol tugatadi</li>
  <li><code>continue</code> — joriy aylanishning qolganini o'tkazib, keyingisiga o'tadi</li>
</ul>
<p><code>while True</code> — ataylab cheksiz sikl. Undan chiqish uchun <code>break</code> shart, aks holda dastur qotib qoladi.</p>

<h3>Amaliy misol: raqamlar yig'indisi</h3>
<pre><code>son = int(input())
yigindi = 0
while son &gt; 0:
    yigindi = yigindi + son % 10   # oxirgi raqamni oladi
    son = son // 10                # oxirgi raqamni tashlaydi
print(yigindi)</code></pre>
<p>Masalan 472 uchun: 2 → 7 → 4 qo'shiladi, natija 13. Bu usul — sonning raqamlari bilan ishlashning klassik yo'li.</p>

<h3>while va for: qaysi biri?</h3>
<table>
  <tr><th>Vaziyat</th><th>Tanlov</th></tr>
  <tr><td>Ro'yxat, matn bo'ylab yurish</td><td>for</td></tr>
  <tr><td>Aniq N marta takrorlash</td><td>for + range()</td></tr>
  <tr><td>Shart bajarilguncha</td><td>while</td></tr>
  <tr><td>Foydalanuvchi to'xtatguncha</td><td>while</td></tr>
</table>

<h3>Xulosa</h3>
<ul>
  <li><code>while</code> shart rost bo'lgani sari takrorlaydi</li>
  <li>Sikl ichida shartga ta'sir qiladigan o'zgarish bo'lishi shart</li>
  <li><code>break</code> chiqadi, <code>continue</code> keyingi aylanishga o'tadi</li>
  <li>Takrorlar soni ma'lum bo'lsa <code>for</code> qulayroq</li>
</ul>
$html$,
    11, 10, 25, 45, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true;

  -- ============================================
  -- 12. MAVZU (fan dasturi 10): Funksiyalar
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'Funksiyalar bilan ishlash',
    'funksiyalar',
    $html$
<h2>Kodni takrorlamaslik</h2>
<p>Dastur o'sgan sari bir xil kod bo'laklari qayta-qayta uchraydi. Ularni har safar nusxalash ikki muammo tug'diradi: fayl uzayadi va xato topilganda uni <b>hamma nusxada</b> tuzatish kerak bo'ladi. <b>Funksiya</b> — kodning nom berilgan, kerak bo'lganda chaqiriladigan bo'lagi.</p>

<h3>Funksiya yaratish</h3>
<pre><code>def salomlash():
    print("Assalomu alaykum!")

salomlash()
salomlash()</code></pre>
<p><code>def</code> — funksiya e'lon qilish kalit so'zi. Undan keyin nom, qavslar va ikki nuqta keladi. Funksiya tanasi chekinadi.</p>
<p>Muhim: <code>def</code> qatori funksiyani faqat <b>yaratadi</b>, ishlatmaydi. Kod bajarilishi uchun uni <b>chaqirish</b> kerak: <code>salomlash()</code>.</p>

<h3>Parametr va argument</h3>
<pre><code>def salomlash(ism):
    print(f"Salom, {ism}!")

salomlash("Ali")
salomlash("Dilnoza")</code></pre>
<p><code>ism</code> — <b>parametr</b> (funksiya e'lonidagi nom). <code>"Ali"</code> — <b>argument</b> (chaqirishda berilgan haqiqiy qiymat).</p>

<h3>return — natija qaytarish</h3>
<pre><code>def kvadrat(x):
    return x * x

natija = kvadrat(5)
print(natija)          # 25
print(kvadrat(3) + kvadrat(4))  # 25</code></pre>
<p><code>print()</code> va <code>return</code> ni chalkashtirmang:</p>
<ul>
  <li><code>print()</code> — ekranga chiqaradi, natijani boshqa hisobda ishlatib bo'lmaydi</li>
  <li><code>return</code> — qiymatni <b>qaytaradi</b>, uni o'zgaruvchiga saqlash yoki boshqa ifodada ishlatish mumkin</li>
</ul>
<p><code>return</code> bajarilishi bilan funksiya darhol tugaydi — undan keyingi qatorlar ishlamaydi.</p>

<h3>Bir nechta parametr</h3>
<pre><code>def yigindi(a, b):
    return a + b

def uchburchak_yuzasi(asos, balandlik):
    return asos * balandlik / 2

print(yigindi(3, 7))                 # 10
print(uchburchak_yuzasi(6, 4))       # 12.0</code></pre>
<p>Argumentlar tartibi muhim: birinchi argument birinchi parametrga tushadi.</p>

<h3>Sukut bo'yicha qiymatlar</h3>
<pre><code>def salomlash(ism, salom="Salom"):
    print(f"{salom}, {ism}!")

salomlash("Ali")                     # Salom, Ali!
salomlash("Ali", "Xayrli tong")      # Xayrli tong, Ali!</code></pre>
<p>Sukut qiymatli parametrlar ro'yxat oxirida turishi kerak.</p>

<h3>Nomli argumentlar</h3>
<pre><code>def malumot(ism, yosh, shahar):
    print(f"{ism}, {yosh} yosh, {shahar}")

malumot(yosh=20, shahar="Guliston", ism="Ali")</code></pre>
<p>Nom bilan berilganda tartib ahamiyatsiz bo'ladi va kod o'qishliroq ko'rinadi.</p>

<h3>Bir nechta qiymat qaytarish</h3>
<pre><code>def eng_katta_kichik(sonlar):
    return max(sonlar), min(sonlar)

katta, kichik = eng_katta_kichik([4, 9, 1, 7])
print(katta, kichik)     # 9 1</code></pre>
<p>Aslida funksiya bitta tuple qaytaradi, biz uni ikki o'zgaruvchiga ajratib olamiz.</p>

<h3>Lokal va global o'zgaruvchi</h3>
<pre><code>def hisobla():
    x = 10        # lokal — faqat funksiya ichida yashaydi
    print(x)

hisobla()
print(x)          # NameError!</code></pre>
<p>Funksiya ichida yaratilgan o'zgaruvchi tashqarida mavjud emas. Bu yaxshi xususiyat: funksiyalar bir-birining ishiga aralashmaydi.</p>

<h3>Hujjatlash satri (docstring)</h3>
<pre><code>def kvadrat(x):
    """Sonning kvadratini qaytaradi."""
    return x * x

print(kvadrat.__doc__)</code></pre>
<p>Funksiya boshidagi uch tirnoqli matn uning nima qilishini tushuntiradi. Bu — professional kod yozishning oddiy, lekin qimmatli odati.</p>

<h3>Yaxshi funksiya qanday bo'ladi?</h3>
<ul>
  <li>Bitta aniq vazifani bajaradi</li>
  <li>Nomi shu vazifani aytib turadi: <code>ortacha_hisobla</code>, <code>toqmi</code></li>
  <li>Kerakli ma'lumotni parametr orqali oladi, natijani <code>return</code> bilan beradi</li>
  <li>Odatda 20 qatordan oshmaydi</li>
</ul>

<h3>Xulosa</h3>
<ul>
  <li><code>def nom(parametrlar):</code> funksiyani yaratadi, <code>nom()</code> uni chaqiradi</li>
  <li><code>return</code> qiymat qaytaradi va funksiyani tugatadi</li>
  <li>Funksiya ichidagi o'zgaruvchilar lokal</li>
  <li>Takrorlanayotgan kodni ko'rsangiz — u funksiyaga chiqarilishi kerak</li>
</ul>
$html$,
    12, 10, 25, 50, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true;

  -- ============================================
  -- 13. MAVZU (fan dasturi 11): Modullar
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'Modullar bilan ishlash',
    'modullar',
    $html$
<h2>Boshqalar yozgan kodni ishlatish</h2>
<p><b>Modul</b> — tayyor funksiya va qiymatlar to'plami saqlanadigan Python fayli. Kvadrat ildiz, tasodifiy son, sana bilan ishlash — bularning barchasi allaqachon yozilgan. Bizga faqat kerakli modulni ulash qoladi.</p>

<h3>import — modulni ulash</h3>
<pre><code>import math

print(math.sqrt(16))    # 4.0
print(math.pi)          # 3.141592653589793</code></pre>
<p>Modul ulangach, uning ichidagi narsalarga <code>modul.nom</code> ko'rinishida murojaat qilinadi.</p>

<h3>from ... import — faqat keraklisini olish</h3>
<pre><code>from math import sqrt, pi

print(sqrt(16))     # modul nomini yozish shart emas
print(pi)</code></pre>
<p>Bu qisqaroq, lekin nomlar to'qnashuvi xavfi bor. Katta loyihalarda oddiy <code>import</code> xavfsizroq.</p>

<h3>Taxallus berish</h3>
<pre><code>import random as r
print(r.randint(1, 6))</code></pre>
<p>Uzun modul nomlarini qisqartirish uchun ishlatiladi.</p>

<h3>math — matematik amallar</h3>
<pre><code>import math

print(math.sqrt(25))      # 5.0  — kvadrat ildiz
print(math.ceil(4.1))     # 5    — yuqoriga yaxlitlash
print(math.floor(4.9))    # 4    — pastga yaxlitlash
print(math.factorial(5))  # 120  — faktorial
print(math.pow(2, 10))    # 1024.0
print(math.gcd(12, 18))   # 6    — EKUB</code></pre>
<p>Diqqat: <code>round()</code> va <code>abs()</code> Pythonning o'rnatilgan funksiyalari — ular uchun modul kerak emas.</p>

<h3>random — tasodifiy sonlar</h3>
<pre><code>import random

print(random.randint(1, 6))            # 1..6 oralig'ida butun son
print(random.random())                 # 0.0 dan 1.0 gacha kasr
print(random.choice(["olma", "anor"])) # ro'yxatdan tasodifiy element

sonlar = [1, 2, 3, 4, 5]
random.shuffle(sonlar)                 # ro'yxatni aralashtiradi
print(sonlar)</code></pre>
<p>Bu modul o'yinlar, testlar va simulyatsiyalarda ishlatiladi.</p>

<h3>datetime — sana va vaqt</h3>
<pre><code>from datetime import date, datetime

bugun = date.today()
print(bugun)               # 2026-07-28
print(bugun.year)          # 2026

tugilgan = date(2005, 3, 15)
farq = bugun - tugilgan
print(farq.days)           # yashagan kunlar soni</code></pre>

<h3>O'z modulingizni yozish</h3>
<p>Har qanday <code>.py</code> fayl modul bo'la oladi. Masalan <code>hisob.py</code> faylini yarataylik:</p>
<pre><code># hisob.py
def kvadrat(x):
    return x * x

def kub(x):
    return x ** 3</code></pre>
<p>Endi yonidagi boshqa faylda:</p>
<pre><code>import hisob

print(hisob.kvadrat(4))    # 16
print(hisob.kub(3))        # 27</code></pre>
<p>Katta loyihada kodni mavzu bo'yicha alohida fayllarga ajratish — tartibli ishlashning asosi.</p>

<h3>pip — tashqi kutubxonalar</h3>
<p>Python bilan birga kelmaydigan kutubxonalar <code>pip</code> orqali o'rnatiladi:</p>
<pre><code>pip install requests
pip install numpy</code></pre>
<p>Bu buyruq terminal (buyruqlar qatori) da yoziladi, dastur ichida emas. O'rnatilgandan keyin oddiy <code>import</code> bilan ishlatiladi.</p>

<h3>Xulosa</h3>
<ul>
  <li><code>import modul</code> — butun modulni, <code>from modul import nom</code> — bir qismini ulaydi</li>
  <li><code>math</code>, <code>random</code>, <code>datetime</code> — standart kutubxonaning eng ko'p ishlatiladiganlari</li>
  <li>Har qanday <code>.py</code> fayl modul bo'la oladi</li>
  <li>Tashqi kutubxonalar <code>pip install</code> bilan o'rnatiladi</li>
</ul>
$html$,
    13, 10, 25, 45, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true;

  -- ============================================
  -- 14. MAVZU (fan dasturi 12): Python va sun'iy intellekt
  -- ============================================
  INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes, is_published)
  VALUES (v_course,
    'Python va sun''iy intellekt',
    'python-va-suniy-intellekt',
    $html$
<h2>Nega aynan Python?</h2>
<p>Sun'iy intellekt (SI) sohasidagi loyihalarning katta qismi Pythonda yoziladi. Buning sabablari:</p>
<ul>
  <li><b>Sodda sintaksis</b> — tadqiqotchi tilning qoidalari bilan emas, masala bilan shug'ullanadi</li>
  <li><b>Kuchli kutubxonalar</b> — NumPy, pandas, scikit-learn, TensorFlow, PyTorch</li>
  <li><b>Katta hamjamiyat</b> — deyarli har qanday savolga tayyor javob bor</li>
  <li><b>Tez sinov</b> — g'oyani bir necha qatorda tekshirib ko'rish mumkin</li>
</ul>

<h3>Sun'iy intellekt nima?</h3>
<p>SI — kompyuterga odam aqli talab qiladigan vazifalarni bajarishni o'rgatish sohasi: rasmni tanish, matnni tushunish, bashorat qilish. Uning eng keng tarqalgan yo'nalishi — <b>mashinaviy o'qitish (machine learning)</b>.</p>
<p>An'anaviy dasturlashda biz <b>qoidalarni</b> yozamiz va kompyuter javob beradi. Mashinaviy o'qitishda esa biz <b>misollarni</b> beramiz, kompyuter qoidani o'zi topadi.</p>
<table>
  <tr><th>An'anaviy dastur</th><th>Mashinaviy o'qitish</th></tr>
  <tr><td>Qoida + ma'lumot → javob</td><td>Ma'lumot + javob → qoida</td></tr>
  <tr><td>Dasturchi mantiqni yozadi</td><td>Model misollardan o'rganadi</td></tr>
</table>

<h3>Asosiy tushunchalar</h3>
<ul>
  <li><b>Dataset (ma'lumotlar to'plami)</b> — model o'rganadigan misollar</li>
  <li><b>Belgi (feature)</b> — kirish ma'lumoti: uy maydoni, xonalar soni</li>
  <li><b>Nishon (label)</b> — bashorat qilinishi kerak bo'lgan javob: uy narxi</li>
  <li><b>Model</b> — o'rganilgan bog'liqlikni saqlaydigan tuzilma</li>
  <li><b>Train / test</b> — ma'lumotni o'qitish va tekshirish qismlariga ajratish</li>
</ul>

<h3>Yo'nalishlar</h3>
<ul>
  <li><b>Nazorat ostida o'qitish</b> — to'g'ri javoblar ma'lum (narx bashorati, spam aniqlash)</li>
  <li><b>Nazoratsiz o'qitish</b> — javoblar noma'lum, model guruhlarni o'zi topadi (mijozlarni segmentlash)</li>
  <li><b>Mustahkamlab o'qitish</b> — model tajriba orqali o'rganadi (o'yin, robototexnika)</li>
</ul>

<h3>Asosiy kutubxonalar</h3>
<table>
  <tr><th>Kutubxona</th><th>Vazifasi</th></tr>
  <tr><td><code>NumPy</code></td><td>Sonli massivlar va matritsalar bilan tez ishlash</td></tr>
  <tr><td><code>pandas</code></td><td>Jadval ko'rinishidagi ma'lumotlarni tahlil qilish</td></tr>
  <tr><td><code>matplotlib</code></td><td>Grafik va diagrammalar chizish</td></tr>
  <tr><td><code>scikit-learn</code></td><td>Klassik mashinaviy o'qitish algoritmlari</td></tr>
  <tr><td><code>TensorFlow</code>, <code>PyTorch</code></td><td>Neyron tarmoqlar</td></tr>
</table>

<h3>Oddiy misol: chiziqli bashorat</h3>
<pre><code>from sklearn.linear_model import LinearRegression

# Uy maydoni (kv.m) va narxi (mln so'm)
X = [[40], [60], [80], [100]]
y = [200, 300, 400, 500]

model = LinearRegression()
model.fit(X, y)                  # o'rganish

print(model.predict([[70]]))     # 70 kv.m uy narxi bashorati</code></pre>
<p>Ko'rib turganingizdek, model qurish uch qadamdan iborat: ma'lumot tayyorlash → <code>fit()</code> bilan o'qitish → <code>predict()</code> bilan bashorat qilish.</p>

<h3>Bugungi kunda SI qayerda ishlatiladi?</h3>
<ul>
  <li>Ovozli yordamchilar va tarjima tizimlari</li>
  <li>Tibbiyotda rasm tahlili orqali kasallikni erta aniqlash</li>
  <li>Bank operatsiyalarida firibgarlikni aniqlash</li>
  <li>Ta'limda talabaga moslashadigan mashqlar</li>
  <li>Katta til modellari — matn yozish, savol-javob, kod yaratish</li>
</ul>

<h3>SI bilan ishlashda mas'uliyat</h3>
<p>Model o'zi o'rgangan ma'lumotdan yaxshiroq bo'la olmaydi. Ma'lumot bir tomonlama bo'lsa, natija ham adolatsiz chiqadi. Shuning uchun SI natijalarini har doim tekshirish, ma'lumot manbasini bilish va shaxsiy ma'lumotlar maxfiyligini hurmat qilish zarur.</p>

<h3>Keyingi qadam</h3>
<p>SI ni o'rganishga kirishishdan oldin quyidagilar mustahkam bo'lishi kerak: o'zgaruvchilar, ro'yxatlar va lug'atlar, sikllar, funksiyalar, fayl bilan ishlash. Shundan keyin NumPy va pandas — SI sari eng qulay birinchi qadam.</p>

<h3>Xulosa</h3>
<ul>
  <li>Python SI sohasida soddaligi va kutubxonalari tufayli yetakchi</li>
  <li>Mashinaviy o'qitishda qoidani model misollardan o'zi topadi</li>
  <li>NumPy, pandas, scikit-learn — birinchi o'rganiladigan uchlik</li>
  <li>Har qanday model natijasi tekshirilishi kerak bo'lgan taxmin, hukm emas</li>
</ul>
$html$,
    14, 10, 25, 40, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = true;

END $$;
