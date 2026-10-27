"""Amaliy mashg'ulotlar 11–15."""

from kt import (T, Q, F, answer_task, code_task, S_title, S_idea, S_points, S_table, S_compare, S_code, S_quiz,
                S_summary)

# ======================================================================
# 11-AMALIY
# ======================================================================
A11 = T(
    "kt-a11-tcp-udp",
    "11-amaliy mashg'ulot: TCP va UDP. Portlar, tartib raqamlari va oyna",
    """
<h2>Mashg'ulot maqsadi</h2>
<p>TCP ulanishini tahlil qilish, tartib va tasdiq raqamlarini hisoblash, oyna o'lchamidan o'tkazuvchanlikni topish hamda xizmat uchun transport protokolini tanlash.</p>

<h2>1. Ulanish jurnalini o'qish</h2>
<pre><code>1  192.168.1.10:51034 → 93.184.216.34:80   [SYN]      seq=0
2  93.184.216.34:80   → 192.168.1.10:51034 [SYN,ACK]  seq=0 ack=1
3  192.168.1.10:51034 → 93.184.216.34:80   [ACK]      seq=1 ack=1
4  192.168.1.10:51034 → 93.184.216.34:80   [PSH,ACK]  seq=1 ack=1 len=356
5  93.184.216.34:80   → 192.168.1.10:51034 [ACK]      seq=1 ack=357
6  93.184.216.34:80   → 192.168.1.10:51034 [PSH,ACK]  seq=1 ack=357 len=1200
7  192.168.1.10:51034 → 93.184.216.34:80   [ACK]      seq=357 ack=1201</code></pre>
<ul>
  <li>1–3 — uch bosqichli ulanish. Wireshark tartib raqamlarini <b>nisbiy</b> ko'rsatadi (0 dan).</li>
  <li>Mijoz porti 51034 — dinamik; server porti 80 — HTTP.</li>
  <li>4: mijoz 356 bayt (HTTP so'rov) yubordi → 5: server <code>ack = 1 + 356 = 357</code>.</li>
  <li>6: server 1200 bayt yubordi → 7: mijoz <code>ack = 1 + 1200 = 1201</code>.</li>
</ul>

<h2>2. Oyna va o'tkazuvchanlik</h2>
<pre><code>Maksimal o'tkazuvchanlik ≈ oyna / RTT
65 535 B / 0,05 s = 1 310 700 B/s ≈ 10,5 Mbit/s</code></pre>
<p>Kanal 100 Mbit/s bo'lsa ham, oyna kichik va masofa uzoq bo'lsa, TCP undan to'liq foydalana olmaydi. Shuning uchun zamonaviy TCP "oynani kattalashtirish" (window scaling) dan foydalanadi.</p>

<h2>3. Protokol tanlash</h2>
<table>
  <tr><th>Xizmat</th><th>Transport</th><th>Port</th><th>Sabab</th></tr>
  <tr><td>Veb (HTTPS)</td><td>TCP (HTTP/3 da UDP/QUIC)</td><td>443</td><td>Sahifa to'liq kelishi kerak</td></tr>
  <tr><td>DNS so'rovi</td><td>UDP</td><td>53</td><td>Bitta qisqa so'rov-javob</td></tr>
  <tr><td>DHCP</td><td>UDP</td><td>67/68</td><td>Mijozda hali IP yo'q, broadcast</td></tr>
  <tr><td>VoIP, video qo'ng'iroq</td><td>UDP</td><td>turlicha</td><td>Kechikish muhimroq</td></tr>
  <tr><td>SSH</td><td>TCP</td><td>22</td><td>Har bir belgi yetib borishi kerak</td></tr>
  <tr><td>Pochta yuborish</td><td>TCP</td><td>587</td><td>Xat yaxlit bo'lishi kerak</td></tr>
</table>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyada TCP ulanish ssenariysini oxirigacha o'ting va har qadamda seq/ack ni yozib oling.</li>
  <li>Yo'qotish foizini 0, 20, 40% qilib, TCP va UDP natijalarini jadvalga kiriting.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("TCP va UDP amaliyoti", "11-amaliy mashg'ulot", "🔁"),
        S_code("Jurnal", "[SYN]      seq=0\n[SYN,ACK]  seq=0 ack=1\n[ACK]      seq=1 ack=1\n[PSH,ACK]  seq=1 len=356\n[ACK]      ack=357"),
        S_idea("Tasdiq qoidasi", "ack = qabul qilingan oxirgi segmentning seq + len. Ya'ni 'keyingi kutayotgan baytim'.", "✅"),
        S_quiz("seq=357, len=500 segmentga qanday ack keladi?", ["500", "857", "858", "357"], 1, "357 + 500 = 857."),
        S_code("Oyna chegarasi", "65 535 B / 0,05 s ≈ 1,31 MB/s ≈ 10,5 Mbit/s"),
        S_table("Protokol tanlash", ["Xizmat", "Transport"], [["HTTPS", "TCP"], ["DNS", "UDP"], ["DHCP", "UDP"], ["VoIP", "UDP"], ["SSH", "TCP"]]),
        S_quiz("Nega DHCP UDP dan foydalanadi?", ["Tezroq bo'lgani uchun", "Mijozda hali IP yo'q, broadcast kerak", "TCP taqiqlangan", "Port 67 band"], 1, "TCP ulanishi uchun ikki tomonda ham manzil kerak."),
        S_summary("Xulosa", ["ack = seq + len", "Oyna / RTT — TCP tezlik chegarasi", "Ishonchlilik kerak — TCP, kechikish muhim — UDP"]),
    ],
    [
        Q("Jurnalda 2-segment [SYN,ACK] ack=1. Bu nimani bildiradi?", ["1 bayt ma'lumot olindi", "Mijozning SYN i tasdiqlandi", "Xato", "Ulanish yopildi"], 1, "SYN bitta tartib raqamini 'egallaydi'."),
        Q("Mijoz porti 51034 qaysi oraliqda?", ["Taniqli", "Ro'yxatdan o'tgan", "Dinamik", "Noto'g'ri port"], 2, "49152–65535 — dinamik."),
        Q("Oyna 32 000 B, RTT 0,1 s. Maksimal o'tkazuvchanlik?", ["320 000 B/s", "3 200 B/s", "32 000 B/s", "3,2 MB/s"], 0, "32 000 / 0,1."),
        Q("Qaysi xizmat UDP dan foydalanadi?", ["SSH", "SMTP", "DNS so'rovi", "FTP"], 2, "DNS — UDP 53."),
        Q("TCP ulanishini favqulodda uzish bayrog'i?", ["FIN", "RST", "PSH", "URG"], 1, "RST — reset."),
        Q("Qaysi gaplar to'g'ri?", ["SYN tartib raqamidan bitta joy oladi", "UDP da ack raqami yo'q", "TCP oyna kattaligi o'tkazuvchanlikka ta'sir qilmaydi", "ack keyingi kutilayotgan baytni ko'rsatadi"], [0, 1, 3], "Oyna / RTT — tezlik chegarasi."),
    ],
    [
        answer_task(
            "Jurnalni davom ettiring",
            "Ulanish o'rnatildi (nisbiy raqamlar). Mijoz seq=1 dan 400 bayt yubordi, server 2000 bayt javob berdi, keyin mijoz yana 100 bayt yubordi.",
            [
                F("Server mijozning 400 baytini tasdiqlaydigan ack", "number", 401),
                F("Mijozning ikkinchi (100 baytli) segmenti seq raqami", "number", 401),
                F("Mijoz serverning 2000 baytini tasdiqlaydigan ack", "number", 2001),
                F("Server mijozning 100 baytini tasdiqlaydigan ack", "number", 501),
            ],
            difficulty="medium",
        ),
        answer_task(
            "O'tkazuvchanlik",
            "TCP oyna 65 535 bayt. Toshkent–Frankfurt RTT ≈ 80 ms.",
            [
                F("Maksimal o'tkazuvchanlik, B/s (butun son)", "number", round(65535 / 0.08), tol=1, unit="B/s"),
                F("Mbit/s (1 xona)", "number", round(65535 / 0.08 * 8 / 1e6, 1), tol=0.1, unit="Mbit/s"),
                F("100 Mbit/s ga yetish uchun kerakli oyna, bayt", "number", round(100e6 / 8 * 0.08), tol=1, unit="B"),
            ],
            hints=["Kerakli oyna = tezlik (B/s) × RTT."],
            difficulty="medium",
        ),
        code_task(
            "Tasdiq raqamlari",
            "Birinchi qatorda boshlang'ich seq (butun son), ikkinchisida bo'sh joy bilan segment hajmlari. Har segmentdan keyin qabul qiluvchi yuboradigan ack ni alohida qatorda chiqaring.\nMasalan: 1001 va 500 500 300 → 1501, 2001, 2301",
            "seq = int(input())\nhajmlar = list(map(int, input().split()))\n# Kodingizni shu yerga yozing\n",
            "seq = int(input())\nfor h in map(int, input().split()):\n    seq += h\n    print(seq)",
            [("1001\n500 500 300", "1501\n2001\n2301"), ("1\n356", "357"), ("5000\n1460 1460 1460 100", "6460\n7920\n9380\n9480"), ("0\n1 2 3", None)],
            hints=["Har segmentdan keyin seq += hajm."],
            difficulty="easy",
        ),
    ],
)

# ======================================================================
# 12-AMALIY
# ======================================================================
A12 = T(
    "kt-a12-http",
    "12-amaliy mashg'ulot: HTTP so'rov va javoblarini tahlil qilish",
    """
<h2>Mashg'ulot maqsadi</h2>
<p>HTTP xabarlarining tuzilishini o'qish, holat kodlari va sarlavhalar ma'nosini aniqlash, brauzer vositalari bilan so'rovlarni kuzatish.</p>

<h2>1. So'rov tuzilishi</h2>
<pre><code>POST /api/login HTTP/1.1          ← so'rov qatori: usul, yo'l, versiya
Host: lms.misol.uz                 ← sarlavhalar
Content-Type: application/json
Content-Length: 41
Cookie: til=uz
                                   ← bo'sh qator
{"login":"ali","parol":"Qwerty123"} ← tana</code></pre>

<h2>2. Javob tuzilishi</h2>
<pre><code>HTTP/1.1 302 Found                 ← holat qatori
Location: /dashboard
Set-Cookie: session=a8f3…; HttpOnly; Secure; SameSite=Lax
Cache-Control: no-store
Content-Length: 0</code></pre>
<ul>
  <li><b>302</b> — vaqtinchalik yo'naltirish: brauzer <code>Location</code> dagi manzilga o'tadi.</li>
  <li><b>Set-Cookie</b> — sessiya identifikatori; <code>HttpOnly</code> — JavaScript o'qiy olmaydi, <code>Secure</code> — faqat HTTPS da yuboriladi.</li>
  <li><b>Cache-Control: no-store</b> — javob keshlanmasin.</li>
</ul>

<h2>3. Muhim sarlavhalar</h2>
<table>
  <tr><th>Sarlavha</th><th>Vazifasi</th></tr>
  <tr><td>Host</td><td>Qaysi sayt (bitta serverda bir nechta sayt bo'lishi mumkin)</td></tr>
  <tr><td>User-Agent</td><td>Brauzer va OT</td></tr>
  <tr><td>Accept, Accept-Language</td><td>Qanday format va til kutilmoqda</td></tr>
  <tr><td>Content-Type, Content-Length</td><td>Tana formati va hajmi</td></tr>
  <tr><td>Cache-Control, ETag, If-None-Match</td><td>Keshlash: o'zgarmagan bo'lsa 304</td></tr>
  <tr><td>Authorization</td><td>Kirish tokeni</td></tr>
  <tr><td>Location</td><td>Yo'naltirish manzili (3xx)</td></tr>
</table>

<h2>4. Brauzerda kuzatish</h2>
<ol>
  <li>F12 → <b>Network</b> (Tarmoq) yorlig'i → sahifani yangilang.</li>
  <li>Har bir qatorda: usul, holat kodi, turi, hajmi, vaqti.</li>
  <li>Qatorni bosing → <b>Headers</b>: so'rov va javob sarlavhalari.</li>
  <li>Yana yangilang: ba'zi fayllar <b>304</b> yoki "(disk cache)" bilan keladi — kesh ishlayapti.</li>
</ol>
<blockquote>Diqqat: yuqoridagi so'rov tanasida parol ochiq ko'rinadi. HTTPS bu tanani yo'lda shifrlaydi, lekin brauzer vositalarida (o'z kompyuteringizda) baribir ko'rinadi. Shuning uchun begona kompyuterda tizimga kirmang.</blockquote>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi HTTP ssenariysini o'ting va har javobning holat kodini izohlang.</li>
  <li>O'zingiz sevgan saytni F12 → Network bilan oching: nechta so'rov ketdi, eng katta resurs qaysi, qaysilari 304?</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("HTTP tahlili", "12-amaliy mashg'ulot", "🌐"),
        S_code("So'rov", "POST /api/login HTTP/1.1\nHost: lms.misol.uz\nContent-Type: application/json\n\n{\"login\":\"ali\",…}"),
        S_code("Javob", "HTTP/1.1 302 Found\nLocation: /dashboard\nSet-Cookie: session=…; HttpOnly; Secure"),
        S_table("Holat kodlari", ["Kod", "Ma'nosi"], [["200", "OK"], ["201", "Yaratildi"], ["301 / 302", "Doimiy / vaqtinchalik yo'naltirish"], ["304", "O'zgarmagan (kesh)"], ["401 / 403", "Kirish kerak / taqiqlangan"], ["404", "Topilmadi"], ["500 / 503", "Server xatosi / band"]]),
        S_quiz("Qaysi sarlavha bitta serverdagi bir nechta saytni ajratadi?", ["User-Agent", "Host", "Accept", "Cookie"], 1, "Virtual xostlar Host bo'yicha ishlaydi."),
        S_quiz("Tizimga kirmasdan himoyalangan sahifani so'radingiz. Kod?", ["200", "401", "404", "500"], 1, "401 Unauthorized — autentifikatsiya kerak."),
        S_points("Brauzerda kuzatish", [("⌨️", "F12 → Network"), ("🔄", "Sahifani yangilash"), ("📋", "Qatorni bosib Headers"), ("💾", "304 / disk cache — kesh")]),
        S_summary("Xulosa", ["So'rov: qator + sarlavhalar + bo'sh qator + tana", "Javob: holat qatori + sarlavhalar + tana", "Kod sinfi xato kimdaligini aytadi"]),
    ],
    [
        Q("So'rov qatorining tarkibi?", ["Usul, yo'l, versiya", "Holat kodi va matni", "Host va port", "Cookie va tana"], 0, "Masalan: GET /index.html HTTP/1.1."),
        Q("Sarlavhalar va tana nima bilan ajratiladi?", ["Nuqtali vergul", "Bo'sh qator", "Chiziqcha", "Ajratilmaydi"], 1, "Bitta bo'sh qator (CRLF)."),
        Q("Set-Cookie dagi HttpOnly nimani bildiradi?", ["Faqat HTTP da ishlaydi", "JavaScript cookie ni o'qiy olmaydi", "Cookie shifrlanadi", "Cookie 1 soat yashaydi"], 1, "XSS hujumlaridan himoya."),
        Q("503 kodi?", ["Topilmadi", "Server vaqtincha mavjud emas", "Taqiqlangan", "Yo'naltirish"], 1, "Service Unavailable."),
        Q("Fayl o'zgarmagan bo'lsa server qanday javob beradi?", ["200 + fayl", "304, tanasiz", "404", "301"], 1, "Brauzer keshdagisini ishlatadi."),
        Q("Qaysilar so'rov sarlavhalari?", ["Host", "User-Agent", "Location", "Accept-Language"], [0, 1, 3], "Location — javob sarlavhasi."),
    ],
    [
        answer_task(
            "Xabarni tahlil qiling",
            "So'rov: 'GET /kurslar/tarmoq?bob=3 HTTP/1.1'. Javob: 'HTTP/1.1 301 Moved Permanently' va 'Location: https://misol.uz/kurslar/tarmoq?bob=3'.",
            [
                F("So'rov usuli", "text", "GET"),
                F("So'ralgan yo'l (? gacha)", "text", "/kurslar/tarmoq"),
                F("Holat kodi", "number", 301),
                F("Kod sinfi (masalan 2xx)", "text", "3xx"),
                F("Brauzer qaysi sxemaga o'tadi?", "text", "https"),
            ],
        ),
        answer_task(
            "Kodni tanlang",
            "Vaziyatga mos holat kodi.",
            [
                F("Yangi foydalanuvchi muvaffaqiyatli yaratildi", "choice", "201", options=["200", "201", "204", "400"]),
                F("Formada majburiy maydon to'ldirilmagan", "choice", "400", options=["400", "401", "403", "404"]),
                F("Talaba admin sahifasini ochmoqchi (kirgan, lekin ruxsat yo'q)", "choice", "403", options=["400", "401", "403", "404"]),
                F("Server texnik ishlar uchun vaqtincha o'chirilgan", "choice", "503", options=["500", "502", "503", "504"]),
            ],
        ),
        code_task(
            "Holat kodi sinfi",
            "Bitta son — HTTP holat kodi (100–599). Uning sinfini chiqaring: 'ma'lumot' (1xx), 'muvaffaqiyat' (2xx), 'yo''naltirish' (3xx), 'mijoz xatosi' (4xx), 'server xatosi' (5xx).",
            "kod = int(input())\n# Kodingizni shu yerga yozing\n",
            "kod = int(input())\nnomlar = {1: \"ma'lumot\", 2: 'muvaffaqiyat', 3: \"yo'naltirish\", 4: 'mijoz xatosi', 5: 'server xatosi'}\nprint(nomlar[kod // 100])",
            [("404", "mijoz xatosi"), ("200", "muvaffaqiyat"), ("503", "server xatosi"), ("301", "yo'naltirish"), ("101", "ma'lumot")],
            hints=["Yuzliklar raqami: kod // 100."],
            difficulty="easy",
        ),
    ],
)

# ======================================================================
# 13-AMALIY
# ======================================================================
A13 = T(
    "kt-a13-dns",
    "13-amaliy mashg'ulot: DNS. Zona yozuvlari va nomni aniqlash jarayoni",
    """
<h2>Mashg'ulot maqsadi</h2>
<p>Zona faylini o'qish, nomni aniqlash zanjirini tuzish, teskari zonalar va keshlash vaqtini hisoblash.</p>

<h2>1. Zona fayli</h2>
<pre><code>$TTL 3600
misol.uz.      IN SOA   ns1.misol.uz. admin.misol.uz. (2026101401 7200 1800 1209600 3600)
misol.uz.      IN NS    ns1.misol.uz.
misol.uz.      IN NS    ns2.misol.uz.
misol.uz.      IN A     185.74.5.10
www            IN CNAME misol.uz.
lms            IN A     185.74.5.20
misol.uz.      IN MX 10 mail.misol.uz.
misol.uz.      IN MX 20 mail2.misol.uz.
mail           IN A     185.74.5.30
misol.uz.      IN TXT   "v=spf1 mx -all"</code></pre>
<ul>
  <li><code>www.misol.uz</code> → CNAME → <code>misol.uz</code> → A → 185.74.5.10.</li>
  <li>Pochta avval <b>MX 10</b> ga (kichik raqam — yuqori ustuvorlik), u ishlamasa MX 20 ga yuboriladi.</li>
  <li>SOA dagi seriya raqami (2026101401) zona o'zgarganda oshiriladi — ikkinchi server (ns2) yangilanish kerakligini shundan biladi.</li>
  <li><code>$TTL 3600</code> — yozuvlar 1 soat keshlanadi.</li>
</ul>

<h2>2. Aniqlash zanjiri</h2>
<p>Kompyuter → lokal resolver (rekursiv) → ildiz → .uz → misol.uz avtoritar serveri → javob → resolver keshlaydi → kompyuter. Kesh bo'sh bo'lsa, lokal server 3 ta iterativ so'rov yuboradi.</p>

<h2>3. Teskari zonalar</h2>
<p>IP manzil bo'yicha nom topish uchun PTR yozuvi. Nomi oktetlarni teskari yozib hosil qilinadi:</p>
<pre><code>185.74.5.10  →  10.5.74.185.in-addr.arpa.  PTR  misol.uz.
Zona (/24):      5.74.185.in-addr.arpa</code></pre>

<h2>4. TTL va o'zgarish</h2>
<p>Admin 10:00 da <code>lms</code> manzilini o'zgartirdi, TTL = 3600 s. Kimdir 09:59 da so'rov yuborgan bo'lsa, uning resolveri eski javobni <b>10:59</b> gacha beradi. Ko'chishdan oldin TTL ni vaqtincha kamaytirish (masalan, 300 s) tavsiya etiladi.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi DNS ssenariysini o'ting va har so'rov kimdan kimga ketganini yozing.</li>
  <li>O'z kompyuteringizda: <code>nslookup miracademy.uz</code>, <code>nslookup -type=mx gmail.com</code>, <code>nslookup -type=ns uz</code>. Natijalarni hisobotga kiriting.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("DNS amaliyoti", "13-amaliy mashg'ulot", "📖"),
        S_code("Zona parchasi", "misol.uz.  IN A      185.74.5.10\nwww        IN CNAME  misol.uz.\nmisol.uz.  IN MX 10  mail.misol.uz.\nmail       IN A      185.74.5.30"),
        S_quiz("www.misol.uz qaysi IP ga aylanadi?", ["185.74.5.10", "185.74.5.20", "185.74.5.30", "Javob yo'q"], 0, "CNAME → misol.uz → A."),
        S_idea("MX ustuvorligi", "Kichik raqam — yuqori ustuvorlik. MX 10 ishlamasa, MX 20 ga yuboriladi.", "📮"),
        S_code("Teskari nom", "185.74.5.10 → 10.5.74.185.in-addr.arpa"),
        S_quiz("TTL 1800 s, yozuv 14:00 da o'zgardi. 13:55 da keshlangan eski javob qachongacha beriladi?", ["14:00", "14:25", "14:30", "15:00"], 1, "13:55 + 30 daqiqa = 14:25."),
        S_summary("Xulosa", ["CNAME → A zanjiri", "MX: kichik raqam — birinchi", "PTR: oktetlar teskari + in-addr.arpa", "TTL — eski javob shuncha yashaydi"]),
    ],
    [
        Q("Zonadagi SOA seriya raqami nima uchun?", ["Xavfsizlik", "Zona o'zgarganini ikkinchi serverga bildirish", "Pochta ustuvorligi", "TTL"], 1, "Seriya oshsa, ikkilamchi server zonani ko'chiradi."),
        Q("MX 10 va MX 20 bo'lsa, pochta avval qayerga?", ["MX 20", "MX 10", "Tasodifiy", "Ikkalasiga"], 1, "Kichik qiymat — yuqori ustuvorlik."),
        Q("172.16.5.20 ning PTR nomi?", ["20.5.16.172.in-addr.arpa", "172.16.5.20.in-addr.arpa", "5.16.172.in-addr.arpa", "20.5.16.172.arpa"], 0, "Oktetlar teskari tartibda."),
        Q("Kesh bo'sh. Lokal resolver misol.uz uchun nechta iterativ so'rov yuboradi?", ["1", "2", "3", "5"], 2, "Ildiz, .uz, avtoritar."),
        Q("Server ko'chishidan oldin TTL ni nima qilish tavsiya etiladi?", ["Oshirish", "Vaqtincha kamaytirish", "0 qilish", "O'chirish"], 1, "Shunda o'zgarish tezroq tarqaladi."),
        Q("Qaysi buyruqlar to'g'ri?", ["nslookup -type=mx gmail.com", "nslookup -type=ns uz", "ipconfig /displaydns", "ping -type=a misol.uz"], [0, 1, 2], "ping da -type yo'q."),
    ],
    [
        answer_task(
            "Zona faylini o'qing",
            "Mashg'ulot matnidagi misol.uz zona faylidan foydalaning.",
            [
                F("lms.misol.uz ning IP manzili", "ip", "185.74.5.20"),
                F("www.misol.uz qaysi yozuv turi?", "choice", "CNAME", options=["A", "CNAME", "MX", "NS"]),
                F("Asosiy pochta serveri nomi", "text", ["mail.misol.uz", "mail.misol.uz."]),
                F("Zona uchun nechta NS server ko'rsatilgan?", "number", 2),
                F("Yozuvlar necha soniya keshlanadi?", "number", 3600),
            ],
        ),
        answer_task(
            "Teskari zona va TTL",
            "Hisoblang.",
            [
                F("10.20.30.40 ning PTR yozuvi nomi", "text", ["40.30.20.10.in-addr.arpa", "40.30.20.10.in-addr.arpa."]),
                F("192.168.5.0/24 teskari zonasi", "text", ["5.168.192.in-addr.arpa", "5.168.192.in-addr.arpa."]),
                F("TTL 7200 s. Yozuv 12:00 da keshlandi. Eski qiymat qachongacha (SS:DD)?", "text", "14:00"),
            ],
        ),
        code_task(
            "PTR nomi",
            "IPv4 manzil kiritiladi. Uning PTR yozuvi nomini chiqaring (oxirida nuqtasiz).\nMasalan: 185.74.5.10 → 10.5.74.185.in-addr.arpa",
            "ip = input().strip()\n# Kodingizni shu yerga yozing\n",
            "ip = input().strip()\nprint('.'.join(reversed(ip.split('.'))) + '.in-addr.arpa')",
            [("185.74.5.10", "10.5.74.185.in-addr.arpa"), ("192.168.1.1", "1.1.168.192.in-addr.arpa"), ("8.8.4.4", "4.4.8.8.in-addr.arpa"), ("10.20.30.40", None)],
            hints=["split('.') → reversed → '.'.join."],
            difficulty="easy",
        ),
    ],
)

# ======================================================================
# 14-AMALIY
# ======================================================================
A14 = T(
    "kt-a14-firewall",
    "14-amaliy mashg'ulot: Brandmauer qoidalarini tuzish. DMZ va VPN",
    """
<h2>Mashg'ulot maqsadi</h2>
<p>Xavfsizlik siyosatini brandmauer qoidalariga aylantirish, qoidalar tartibini tekshirish va VPN qo'shimcha yukini hisoblash.</p>

<h2>1. Siyosatdan qoidaga</h2>
<p><i>Talab: veb-server (10.0.0.5) Internetga 80 va 443 orqali ochiq; SSH faqat administrator kompyuteridan (192.168.1.50); ichki tarmoqdan (192.168.1.0/24) DNS so'rovlari tashqariga; qolgan hammasi taqiqlangan.</i></p>
<table>
  <tr><th>#</th><th>Amal</th><th>Protokol</th><th>Manba</th><th>Manzil</th><th>Port</th></tr>
  <tr><td>1</td><td>Allow</td><td>TCP</td><td>192.168.1.50</td><td>10.0.0.5</td><td>22</td></tr>
  <tr><td>2</td><td>Allow</td><td>TCP</td><td>any</td><td>10.0.0.5</td><td>80, 443</td></tr>
  <tr><td>3</td><td>Allow</td><td>UDP</td><td>192.168.1.0/24</td><td>any</td><td>53</td></tr>
  <tr><td>4</td><td>Deny</td><td>any</td><td>any</td><td>any</td><td>any</td></tr>
</table>
<p>Qoidalarni tuzish tamoyillari:</p>
<ul>
  <li><b>Aniqdan umumiyga</b>: tor qoidalar yuqorida, keng qoidalar pastda.</li>
  <li><b>Sukut — taqiq</b>: oxirida "Deny any" yoki shunday sukut siyosati.</li>
  <li><b>Eng kam ruxsat</b>: "any" ni faqat zarur joyda ishlating.</li>
  <li><b>Holatni kuzatish</b>: zamonaviy brandmauer javob paketlarini avtomatik o'tkazadi — ular uchun alohida qoida kerak emas.</li>
</ul>

<h2>2. Tipik xato</h2>
<pre><code>1  Deny  any any any
2  Allow TCP any 10.0.0.5 443</code></pre>
<p>2-qoida hech qachon ishlamaydi — 1-qoida hammasini oldin to'sadi ("soyada qolgan qoida").</p>

<h2>3. DMZ</h2>
<p>Uch zonali sxema: <b>Internet — DMZ — ichki tarmoq</b>. Internetdan faqat DMZ dagi serverlarning kerakli portlariga ruxsat; DMZ dan ichki tarmoqqa — faqat zarur ulanishlar (masalan, veb-serverdan ma'lumotlar bazasiga 5432-port). Veb-server buzilsa ham, hujumchi ichki tarmoqqa erkin kira olmaydi.</p>

<h2>4. VPN qo'shimcha yuki</h2>
<p>IPsec ESP tunnel rejimida har paketga yangi IP sarlavha (20 B), ESP sarlavha va to'ldirish, autentifikatsiya maydoni qo'shiladi — taxminan 50–60 bayt. Shuning uchun tunnel ichida MTU kichrayadi: 1500 − 60 = <b>1440</b> baytgacha. MTU noto'g'ri bo'lsa, katta paketlar fragmentlanadi yoki yo'qoladi — "VPN ulangan, lekin ba'zi saytlar ochilmaydi" holatining sababi ko'pincha shu.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi "Veb-serverni himoyalang" vazifasini 8 ta paketning hammasi to'g'ri ishlanguncha bajaring. Yakuniy qoidalar jadvalini hisobotga yozing.</li>
  <li>VPN bo'limida shifrlangan va shifrlanmagan paketni solishtiring.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("Brandmauer qoidalari", "14-amaliy mashg'ulot", "🧱"),
        S_points("Tamoyillar", [("🎯", "Aniqdan umumiyga"), ("⛔", "Sukut — taqiq"), ("🔑", "Eng kam ruxsat"), ("🔁", "Stateful — javoblar avtomatik")]),
        S_table("Namuna qoidalar", ["#", "Amal", "Nima"], [["1", "Allow", "SSH faqat admin PC dan"], ["2", "Allow", "80, 443 hammaga"], ["3", "Allow", "DNS LAN dan"], ["4", "Deny", "qolgani"]]),
        S_quiz("1: Deny any; 2: Allow TCP 443. HTTPS paketi?", ["O'tadi", "To'siladi", "2-qoida bo'yicha o'tadi", "Sukutga bog'liq"], 1, "Birinchi mos qoida — Deny."),
        S_code("DMZ sxemasi", "Internet ──► [FW] ──► DMZ (veb, pochta)\n                │\n                └──► Ichki tarmoq (faqat zarur ulanishlar)"),
        S_idea("VPN va MTU", "Tunnel har paketga ~50–60 B qo'shadi. Ichki MTU ≈ 1440 B — aks holda katta paketlar yo'qoladi.", "📦"),
        S_summary("Xulosa", ["Qoidalar tartibi — natijani belgilaydi", "DMZ — ommaviy serverlarni ajratadi", "VPN MTU ni kamaytiradi"]),
    ],
    [
        Q("Brandmauerda qoidalar qaysi tartibda joylashtiriladi?", ["Umumiydan aniqga", "Aniqdan umumiyga", "Alifbo bo'yicha", "Tartib muhim emas"], 1, "Aks holda keng qoida torlarini 'soyada' qoldiradi."),
        Q("Holatni kuzatuvchi brandmauerda javob paketlari uchun qoida kerakmi?", ["Ha, har biriga", "Yo'q, avtomatik o'tkaziladi", "Faqat UDP uchun", "Faqat ICMP uchun"], 1, "Ulanishlar jadvali bo'yicha."),
        Q("DMZ ning maqsadi?", ["Internetni tezlashtirish", "Ommaviy serverlarni ichki tarmoqdan ajratish", "Wi-Fi ni himoyalash", "DNS ni almashtirish"], 1, "Buzilgan server ichki tarmoqqa yo'l bermaydi."),
        Q("IPsec tunnelida MTU taxminan qanchaga kamayadi?", ["5–10 B", "50–60 B", "500 B", "Kamaymaydi"], 1, "Yangi IP sarlavha, ESP va autentifikatsiya maydoni."),
        Q("'Allow TCP any any 22' qoidasining xavfi?", ["Hech qanday", "SSH butun Internetga ochiq", "DNS ishlamaydi", "Veb yopiladi"], 1, "SSH faqat ishonchli manbalardan ochilishi kerak."),
        Q("Qaysi qoidalar 'eng kam ruxsat' tamoyiliga mos?", ["Allow TCP 192.168.1.50 → 10.0.0.5:22", "Allow any any any", "Allow TCP any → 10.0.0.5:443", "Allow UDP 192.168.1.0/24 → any:53"], [0, 2, 3], "'Allow any any any' — hammasini ochadi."),
    ],
    [
        answer_task(
            "Qoidalarni tekshiring",
            "Qoidalar: 1) Allow TCP 192.168.1.50 → 10.0.0.5 port 22; 2) Allow TCP any → 10.0.0.5 port 80,443; 3) Allow UDP 192.168.1.0/24 → any port 53; 4) Deny any. Har paket qaysi qoida raqami bo'yicha qaror topadi?",
            [
                F("8.8.8.8 → 10.0.0.5 TCP 443", "number", 2),
                F("192.168.1.50 → 10.0.0.5 TCP 22", "number", 1),
                F("192.168.1.70 → 10.0.0.5 TCP 22", "number", 4),
                F("192.168.1.70 → 8.8.8.8 UDP 53", "number", 3),
                F("8.8.8.8 → 10.0.0.5 TCP 3389", "number", 4),
            ],
            difficulty="medium",
        ),
        answer_task(
            "VPN va MTU",
            "Fizik MTU 1500 bayt. VPN tunneli har paketga 56 bayt qo'shadi. TCP va IP sarlavhalari 20 baytdan.",
            [
                F("Tunnel ichidagi MTU", "number", 1444, unit="B"),
                F("Tunnel ichida bitta TCP segmentdagi maksimal ma'lumot (MSS)", "number", 1404, unit="B"),
            ],
            hints=["MSS = MTU − IP − TCP."],
        ),
        code_task(
            "Brandmauer simulyatori",
            "Birinchi qatorda N — qoidalar soni. Keyingi N qatorda: 'amal protokol port' (amal: allow/deny, protokol: tcp/udp/any, port: son yoki any). Keyin M — paketlar soni va M qatorda 'protokol port'.\nHar paket uchun birinchi mos qoida amalini chiqaring; hech biri mos kelmasa — deny.",
            "n = int(input())\n# Kodingizni shu yerga yozing\n",
            "n = int(input())\nrules = [input().split() for _ in range(n)]\nm = int(input())\nfor _ in range(m):\n    pr, port = input().split()\n    res = 'deny'\n    for a, rp, rport in rules:\n        if rp in ('any', pr) and rport in ('any', port):\n            res = a\n            break\n    print(res)",
            [("2\nallow tcp 443\ndeny any any\n2\ntcp 443\ntcp 22", "allow\ndeny"),
             ("2\ndeny any any\nallow tcp 443\n1\ntcp 443", "deny"),
             ("1\nallow udp 53\n3\nudp 53\ntcp 53\nudp 67", "allow\ndeny\ndeny"),
             ("3\nallow tcp 80\nallow tcp 443\nallow udp any\n3\nudp 5000\ntcp 8080\ntcp 80", None)],
            hints=["Har paket uchun qoidalarni tartib bilan tekshirib, birinchi moslikda to'xtang (break)."],
            difficulty="medium",
        ),
    ],
)

# ======================================================================
# 15-AMALIY
# ======================================================================
A15 = T(
    "kt-a15-diagnostika",
    "15-amaliy mashg'ulot: Diagnostika keys-stadilari. Buyruqlar natijasini tahlil qilish",
    """
<h2>Mashg'ulot maqsadi</h2>
<p>Haqiqiy buyruq chiqishlariga qarab nosozlik sababini aniqlash va ping statistikasini hisoblash.</p>

<h2>Keys 1</h2>
<pre><code>C:\\&gt; ipconfig
Ethernet adapter Ethernet:
   Autoconfiguration IPv4 Address. . : 169.254.112.7
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . :</code></pre>
<p><b>Tahlil:</b> APIPA manzil, shlyuz yo'q → DHCP serverdan javob kelmagan. <b>Tekshirish:</b> router/DHCP server ishlayaptimi, kabel to'g'ri portdami. <b>Yechim:</b> DHCP ni tiklash, <code>ipconfig /renew</code>.</p>

<h2>Keys 2</h2>
<pre><code>C:\\&gt; ping 192.168.1.1        → Reply from 192.168.1.1: bytes=32 time&lt;1ms TTL=64
C:\\&gt; ping 8.8.8.8            → Reply from 8.8.8.8: bytes=32 time=28ms TTL=117
C:\\&gt; ping misol.uz           → Ping request could not find host misol.uz.</code></pre>
<p><b>Tahlil:</b> shlyuz va Internet IP bo'yicha ishlaydi, nom aniqlanmaydi → <b>DNS</b>. <b>Tekshirish:</b> <code>ipconfig /all</code> dagi DNS Servers, <code>nslookup misol.uz 8.8.8.8</code>.</p>

<h2>Keys 3</h2>
<pre><code>C:\\&gt; tracert 185.74.5.10
  1    &lt;1 ms   &lt;1 ms   &lt;1 ms  192.168.1.1
  2     4 ms    5 ms    4 ms  10.10.0.1
  3    12 ms   11 ms   12 ms  213.230.64.1
  4     *       *       *     Request timed out.
  5     *       *       *     Request timed out.</code></pre>
<p><b>Tahlil:</b> provayder tarmog'idan (3-sakrash) keyin javob yo'q — muammo bizning tarmoqdan tashqarida yoki manzil ICMP ni bloklaydi. Boshqa saytlar ochilsa, mahalliy nosozlik yo'q.</p>

<h2>Keys 4. Ping statistikasi</h2>
<pre><code>Reply from 8.8.8.8: bytes=32 time=31ms TTL=117
Request timed out.
Reply from 8.8.8.8: bytes=32 time=45ms TTL=117
Reply from 8.8.8.8: bytes=32 time=29ms TTL=117</code></pre>
<p>Yuborildi 4, olindi 3, yo'qotish 1/4 = <b>25%</b>; vaqt: min 29, max 45, o'rtacha (31 + 45 + 29) / 3 = <b>35 ms</b>. Doimiy 1–5% dan ortiq yo'qotish — kanal sifati yomon (Wi-Fi xalaqiti, kabel nosozligi, tirbandlik).</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi terminalda beshta holatning har birini mustaqil tashxislang; har birida qaysi buyruq hal qiluvchi bo'lganini yozing.</li>
  <li>O'z kompyuteringizda <code>ping -n 20 8.8.8.8</code> bajaring va statistikani hisobotga kiriting.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("Diagnostika keyslari", "15-amaliy mashg'ulot", "🩺"),
        S_table("Belgi → sabab", ["Chiqish", "Sabab"], [["169.254.x.x, shlyuz bo'sh", "DHCP"], ["IP ping bor, nom yo'q", "DNS"], ["tracert provayderdan keyin *", "tashqi muammo"], ["Media disconnected", "kabel"]]),
        S_code("Keys 2", "ping 192.168.1.1  → Reply\nping 8.8.8.8      → Reply\nping misol.uz     → could not find host"),
        S_quiz("Keys 2 dagi sabab?", ["Kabel", "Shlyuz", "DNS", "DHCP"], 2, "IP bo'yicha aloqa bor, nom aniqlanmayapti."),
        S_code("Ping statistikasi", "31 ms, timeout, 45 ms, 29 ms\nyo'qotish = 1/4 = 25%\no'rtacha = (31 + 45 + 29) / 3 = 35 ms"),
        S_quiz("10 ta so'rovdan 8 tasiga javob. Yo'qotish?", ["8%", "20%", "80%", "2%"], 1, "2 / 10 = 20%."),
        S_summary("Xulosa", ["Har keysda: tahlil → tekshirish → yechim", "IP va nom bo'yicha pingni solishtiring", "Yo'qotish va o'rtacha vaqtni hisoblang"]),
    ],
    [
        Q("Keys 1 da birinchi navbatda nimani tekshirasiz?", ["DNS", "DHCP server/router", "Veb-sayt", "Brandmauer"], 1, "APIPA — DHCP javob bermagan."),
        Q("tracert da 3-sakrashdan keyin faqat '*'. Eng to'g'ri xulosa?", ["Kompyuter kabeli uzilgan", "Muammo tashqarida yoki ICMP bloklangan", "DNS ishlamayapti", "Shlyuz noto'g'ri"], 1, "Birinchi uch sakrash ishlayapti."),
        Q("Ping: 31, timeout, 45, 29 ms. O'rtacha vaqt?", ["26 ms", "35 ms", "31 ms", "45 ms"], 1, "Faqat javob kelganlar bo'yicha: 105 / 3."),
        Q("Doimiy 10% yo'qotish nimani bildiradi?", ["Normal holat", "Kanal sifati yomon", "DNS xatosi", "Brandmauer qoidasi"], 1, "Odatda 1% dan kam bo'ladi."),
        Q("DNS ni boshqa server orqali tekshirish buyrug'i?", ["ping misol.uz 8.8.8.8", "nslookup misol.uz 8.8.8.8", "tracert -d misol.uz", "ipconfig /dns"], 1, "nslookup ning ikkinchi argumenti — DNS server."),
        Q("Qaysi chiqishlar mahalliy (bizning tomondagi) nosozlikni bildiradi?", ["Media disconnected", "169.254.x.x manzil", "tracert 4-sakrashdan keyin *", "Destination host unreachable (o'z IP dan)"], [0, 1, 3], "4-sakrashdan keyingi * — tashqarida."),
    ],
    [
        answer_task(
            "Ping statistikasi",
            "ping natijasi: time=12ms, time=15ms, Request timed out, time=11ms, time=22ms, Request timed out.",
            [
                F("Yuborildi", "number", 6),
                F("Olindi", "number", 4),
                F("Yo'qotish, % (butun son)", "number", 33, tol=0.5, unit="%"),
                F("O'rtacha vaqt, ms", "number", 15, unit="ms"),
                F("Maksimal vaqt, ms", "number", 22, unit="ms"),
            ],
            hints=["O'rtacha faqat javob kelganlar bo'yicha: (12 + 15 + 11 + 22) / 4."],
        ),
        answer_task(
            "Keyslar",
            "Har keys uchun sababni tanlang.",
            [
                F("ipconfig: 169.254.5.9, shlyuz bo'sh", "choice", "DHCP", options=["Kabel", "DHCP", "Shlyuz", "DNS", "Tashqi"]),
                F("ping 8.8.8.8 ishlaydi, ping misol.uz — could not find host", "choice", "DNS", options=["Kabel", "DHCP", "Shlyuz", "DNS", "Tashqi"]),
                F("ping 192.168.1.20 ishlaydi; ping 8.8.8.8: Reply from 192.168.1.10: Destination host unreachable", "choice", "Shlyuz", options=["Kabel", "DHCP", "Shlyuz", "DNS", "Tashqi"]),
                F("tracert: 1–3 sakrash javob beradi, keyin faqat *; boshqa saytlar ochiladi", "choice", "Tashqi", options=["Kabel", "DHCP", "Shlyuz", "DNS", "Tashqi"]),
            ],
        ),
        code_task(
            "Ping statistikasi kalkulyatori",
            "Bir qatorda bo'sh joy bilan javob vaqtlari (ms) — javob kelmagani '-' bilan belgilangan. Chiqaring:\n1-qator: yo'qotish foizi (butun son, yaxlitlangan) va % belgisi;\n2-qator: min max o'rtacha (o'rtacha butun songacha yaxlitlanadi). Hech javob bo'lmasa 2-qatorda '-' chiqaring.\nMasalan: 31 - 45 29 → 25% va 29 45 35",
            "qiymatlar = input().split()\n# Kodingizni shu yerga yozing\n",
            "q = input().split()\nt = [int(x) for x in q if x != '-']\nprint(str(round((len(q) - len(t)) * 100 / len(q))) + '%')\nif t:\n    print(min(t), max(t), round(sum(t) / len(t)))\nelse:\n    print('-')",
            [("31 - 45 29", "25%\n29 45 35"), ("12 15 - 11 22 -", "33%\n11 22 15"), ("- - - -", "100%\n-"), ("10 10 10 10", "0%\n10 10 10"), ("5 - 7", None)],
            hints=["Javoblar: '-' bo'lmagan elementlar.", "round() — yaxlitlash."],
            difficulty="medium",
        ),
    ],
)

TOPICS = [A11, A12, A13, A14, A15]
