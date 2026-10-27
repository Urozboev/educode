"""
Amaliy mashg'ulotlar 1–5.

Fan dasturida amaliy mashg'ulot mavzulari berilmagan — ular ma'ruzalarni
hisob-kitob va tahlil bilan mustahkamlaydigan qilib tuzildi (laboratoriya
ishlari esa qurilma va dasturlarni sozlashga qaratilgan).
"""

import math

from kt import (T, Q, F, answer_task, code_task, S_title, S_idea, S_points, S_table, S_compare, S_code, S_quiz,
                S_summary)


def nice(x: float, nd: int = 3) -> str:
    s = f"{x:.{nd}f}".rstrip("0").rstrip(".")
    return s


# ======================================================================
# 1-AMALIY
# ======================================================================
A01 = T(
    "kt-a01-klassifikatsiya",
    "1-amaliy mashg'ulot: Tarmoqlarni tasniflash va o'lchov birliklari bilan ishlash",
    """
<h2>Mashg'ulot maqsadi</h2>
<p>Real vaziyatlardagi tarmoqlarni qamrov va arxitektura bo'yicha tasniflashni, hamda tezlik va hajm birliklarini to'g'ri aylantirishni mashq qilish.</p>

<h2>1. Tasniflash algoritmi</h2>
<ol>
  <li><b>Qamrov</b>: bitta odamning qurilmalari → PAN; xona, bino, kampus → LAN; shahar → MAN; shaharlar, mamlakatlar → WAN.</li>
  <li><b>Arxitektura</b>: xizmatni alohida server beradimi? Ha → mijoz-server; hamma teng → bir rangli.</li>
  <li><b>Muhit</b>: simli, simsiz yoki aralash.</li>
  <li><b>Egalik va kirish</b>: Internet, intranet, ekstranet.</li>
</ol>

<h3>Namuna (keys-stadi)</h3>
<p><i>Maktab: 2 qavatli bino, 3 ta kompyuter sinfi (har birida 15 ta kompyuter), o'qituvchilar xonasi, Wi-Fi, bitta fayl serveri va elektron jurnal saytiga Internet orqali kirish.</i></p>
<table>
  <tr><th>Belgi</th><th>Javob</th><th>Asos</th></tr>
  <tr><td>Qamrov</td><td>LAN</td><td>Bitta bino</td></tr>
  <tr><td>Arxitektura</td><td>Mijoz-server</td><td>Fayl serveri bor</td></tr>
  <tr><td>Muhit</td><td>Aralash</td><td>Kabel + Wi-Fi</td></tr>
  <tr><td>Tashqi aloqa</td><td>WAN (Internet) ga ulangan</td><td>Elektron jurnal tashqi saytda</td></tr>
</table>

<h2>2. O'lchov birliklari</h2>
<table>
  <tr><th>Kattalik</th><th>Birlik</th><th>Eslatma</th></tr>
  <tr><td>Tezlik</td><td>bit/s, Kbit/s, Mbit/s, Gbit/s</td><td>Ko'paytuvchi 1000: 1 Mbit/s = 1 000 000 bit/s</td></tr>
  <tr><td>Hajm</td><td>bayt (B), KB, MB, GB</td><td>1 B = 8 bit; tarmoq hisoblarida 1 MB = 10<sup>6</sup> B</td></tr>
  <tr><td>Hajm (ikkilik)</td><td>KiB, MiB, GiB</td><td>1 KiB = 1024 B, 1 MiB = 1 048 576 B — OT ko'pincha shuni ko'rsatadi</td></tr>
</table>
<h3>Namuna 1</h3>
<p>Provayder "100 Mbit/s" deydi. 1 GB (10<sup>9</sup> B) faylni yuklash vaqti:</p>
<pre><code>1 GB = 8·10⁹ bit
t = 8·10⁹ / 100·10⁶ = 80 s</code></pre>
<p>Amalda ~10% xizmat ma'lumoti (sarlavhalar) va boshqa foydalanuvchilar hisobiga vaqt ko'proq bo'ladi.</p>
<h3>Namuna 2</h3>
<p>Yuklash dasturi "6,25 MB/s" ko'rsatyapti. Bu necha Mbit/s? 6,25 · 8 = <b>50 Mbit/s</b>.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Virtual simulyatsiyada masofani o'zgartirib, tarmoq turi chegaralarini kuzating, so'ng "Tasniflang" bo'limini to'liq bajaring.</li>
  <li>Namunalardagi hisoblarni daftarda takrorlang.</li>
  <li>Test va topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("Tasniflash va birliklar", "1-amaliy mashg'ulot", "📏"),
        S_points("Tasniflash algoritmi", [("📍", "Qamrov: PAN, LAN, MAN, WAN"), ("🖥️", "Arxitektura: server bormi?"), ("🔌", "Muhit: simli, simsiz"), ("🔑", "Kirish: Internet, intranet")]),
        S_table("Keys: maktab tarmog'i", ["Belgi", "Javob"], [["Qamrov", "LAN"], ["Arxitektura", "Mijoz-server"], ["Muhit", "Aralash"]]),
        S_compare("Bit va bayt", ("Tezlik", "bit/s — Mbit/s, Gbit/s"), ("Hajm", "bayt — MB, GB (1 B = 8 bit)")),
        S_code("1 GB ni 100 Mbit/s da yuklash", "hajm = 1·10⁹ B × 8 = 8·10⁹ bit\nvaqt = 8·10⁹ / 10⁸ = 80 s"),
        S_quiz("Dastur '12,5 MB/s' ko'rsatyapti. Bu necha Mbit/s?", ["12,5", "100", "1,56", "125"], 1, "12,5 × 8 = 100 Mbit/s."),
        S_idea("MB va MiB", "1 MB = 1 000 000 B, 1 MiB = 1 048 576 B. Disk '500 GB' deb sotiladi, Windows esa ~465 'GB' (aslida GiB) ko'rsatadi.", "💽"),
        S_summary("Xulosa", ["Avval qamrov, keyin arxitektura", "Tezlik — bitda, hajm — baytda", "Vaqt = hajm (bit) ÷ tezlik (bit/s)"]),
    ],
    [
        Q("Kampusdagi 5 ta binoni bog'lovchi universitet tarmog'i qaysi turga yaqin?", ["PAN", "LAN (kampus)", "WAN", "Faqat Internet"], 1, "Bitta tashkilot, bitta hudud — LAN/CAN."),
        Q("Uchta noutbuk bir-biriga papka ulashgan, server yo'q. Arxitektura?", ["Mijoz-server", "Bir rangli", "Daraxt", "Domen"], 1, "Hamma teng huquqli."),
        Q("1 bayt necha bit?", ["4", "8", "10", "16"], 1, "1 B = 8 bit."),
        Q("50 Mbit/s kanal sekundiga necha MB uzatadi?", ["50", "6,25", "400", "5"], 1, "50 ÷ 8 = 6,25."),
        Q("1 KiB necha baytga teng?", ["1000", "1024", "8", "8192"], 1, "Ikkilik prefiks: 2¹⁰ = 1024."),
        Q("Tashkilotning faqat xodimlar uchun ichki veb-portali qanday ataladi?", ["Internet", "Intranet", "Ekstranet", "PAN"], 1, "Ekstranet — hamkorlarga ham ochilgan qismi."),
    ],
    [
        answer_task(
            "Keys: kollej tarmog'i",
            "Kollej: bitta bino, 4 ta kompyuter sinfi, Active Directory serveri, Wi-Fi; Samarqanddagi filial bilan VPN orqali bog'langan.",
            [
                F("Bino ichidagi tarmoq turi", "choice", "LAN", options=["PAN", "LAN", "MAN", "WAN"]),
                F("Arxitektura", "choice", "Mijoz-server", options=["Bir rangli", "Mijoz-server"]),
                F("Bino ichidagi uzatish muhiti", "choice", "Aralash", options=["Simli", "Simsiz", "Aralash"]),
                F("Filial bilan aloqa qaysi tur orqali?", "choice", "WAN", options=["PAN", "LAN", "MAN", "WAN"]),
            ],
        ),
        answer_task(
            "Birliklarni aylantiring",
            "1 MB = 10⁶ bayt, 1 GB = 10⁹ bayt deb oling. Sarlavhalarni hisobga olmang.",
            [
                F("2 GB filmni 40 Mbit/s kanalda yuklash vaqti", "number", 400, unit="s", reject=["50"]),
                F("Yuklash dasturi 3,5 MB/s ko'rsatyapti. Bu necha Mbit/s?", "number", 28, unit="Mbit/s"),
                F("700 MB faylni 1 Gbit/s da yuklash vaqti", "number", 5.6, tol=0.001, unit="s"),
            ],
            hints=["Hajmni bitga o'tkazing (× 8), keyin tezlikka bo'ling.", "MB/s → Mbit/s: × 8."],
        ),
        code_task(
            "Yuklash vaqti kalkulyatori",
            "Bir qatorda ikki son: fayl hajmi (MB) va kanal tezligi (Mbit/s). Yuklash vaqtini sekundlarda 2 xona aniqlikda chiqaring (1 MB = 8 Mbit).\nMasalan: 100 50 → 16.00",
            "hajm, tezlik = map(float, input().split())\n# Kodingizni shu yerga yozing\n",
            "hajm, tezlik = map(float, input().split())\nprint(f'{hajm * 8 / tezlik:.2f}')",
            [("100 50", "16.00"), ("2000 40", "400.00"), ("700 1000", "5.60"), ("1 3", "2.67"), ("0.5 100", "0.04")],
            hints=["vaqt = hajm × 8 / tezlik.", "Formatlash: f'{x:.2f}'."],
            difficulty="easy",
        ),
    ],
)

# ======================================================================
# 2-AMALIY
# ======================================================================
A02 = T(
    "kt-a02-topologiya",
    "2-amaliy mashg'ulot: Tarmoq topologiyasini loyihalash va hisoblash",
    """
<h2>Mashg'ulot maqsadi</h2>
<p>Topologiya tanlash, kabel va qurilmalar sonini hisoblash hamda nosozlik ta'sirini tahlil qilishni o'rganish.</p>

<h2>1. Asosiy formulalar</h2>
<table>
  <tr><th>Topologiya</th><th>Liniyalar soni (n tugun)</th><th>Bitta liniya uzilsa</th></tr>
  <tr><td>Shina</td><td>1 magistral + n ulanish</td><td>Magistral uzilsa — tarmoq bo'linadi</td></tr>
  <tr><td>Yulduz</td><td>n</td><td>Faqat bitta kompyuter uziladi</td></tr>
  <tr><td>Halqa</td><td>n</td><td>Bitta halqada — aloqa buziladi</td></tr>
  <tr><td>To'liq bog'langan</td><td>n·(n−1)/2</td><td>Boshqa yo'l orqali ishlaydi</td></tr>
</table>

<h2>2. Namuna: ofis loyihasi</h2>
<p><i>Ofisda 50 ta ish o'rni. 24 portli kommutatorlar bor. Kabel kommutatorlar shkafidan ish o'rinlarigacha o'rtacha 18 m, har kabelga 2 m zaxira qo'shiladi.</i></p>
<ol>
  <li><b>Topologiya</b>: daraxt (ierarxik yulduz) — markaziy (yadro) kommutator va undan pastda bo'lim kommutatorlari.</li>
  <li><b>Kirish kommutatorlari</b>: har birida 1 port yuqoriga (uplink) ketadi, demak ish o'rinlari uchun 23 port. 50 / 23 = 2,17 → <b>3 ta</b> kommutator.</li>
  <li><b>Yadro kommutatori</b>: 3 ta uplink + server + router — <b>1 ta</b> yetadi.</li>
  <li><b>Kabel</b>: 50 × (18 + 2) = <b>1000 m</b> ish o'rinlariga. Uplinklar alohida hisoblanadi.</li>
  <li><b>Tekshirish</b>: eng uzun liniya 100 m dan oshmasligi kerak (juft o'ralgan kabel).</li>
</ol>
<blockquote>Zaxira portlar qoldiring: tarmoq doim o'sadi. Amaliyotda kommutator portlarining 70–80% idan ortig'ini band qilmaslik tavsiya etiladi.</blockquote>

<h2>3. Nosozlik tahlili</h2>
<p>Daraxtda yadro kommutatori ishdan chiqsa — bo'limlar bir-birini va serverni ko'rmaydi; bo'lim kommutatori ishdan chiqsa — faqat o'sha bo'lim uziladi. Muhim tugunlar uchun <b>zaxira</b>: ikkita yadro kommutatori va har bo'limdan ikkalasiga uplink (qisman mesh).</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyada har topologiya uchun 6 ta kompyuter bilan bitta kabelni, keyin markaziy qurilmani "uzing" va bog'langan juftliklar sonini yozib oling.</li>
  <li>To'liq bog'langan topologiyada kabellar soni n ga qarab qanday o'sishini kuzating.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("Topologiyani loyihalash", "2-amaliy mashg'ulot", "📐"),
        S_table("Formulalar", ["Topologiya", "Liniyalar"], [["Yulduz", "n"], ["Halqa", "n"], ["Mesh", "n·(n−1)/2"]]),
        S_code("50 ish o'rni, 24 portli switch", "har switchda: 24 − 1 uplink = 23 port\n50 / 23 = 2,17 → 3 ta kirish switchi\n+ 1 ta yadro switchi", note="Kabel: 50 × (18 + 2) = 1000 m"),
        S_quiz("7 tugunli mesh uchun nechta liniya?", ["14", "21", "42", "49"], 1, "7·6/2 = 21."),
        S_compare("Nosozlik ta'siri (daraxt)", ("Yadro switchi", "Bo'limlar orasidagi aloqa va server yo'qoladi"), ("Bo'lim switchi", "Faqat o'sha bo'lim uziladi")),
        S_idea("Zaxira", "Ikki yadro kommutatori va har bo'limdan ikkalasiga uplink — qisman mesh. Bitta qurilma ishdan chiqsa ham tarmoq ishlaydi.", "🛟"),
        S_summary("Xulosa", ["Yulduz/daraxt — bugungi standart", "Uplinklarni portlar hisobiga qo'shing", "Kabel ≤ 100 m, zaxira qoldiring"]),
    ],
    [
        Q("Halqa topologiyasida 8 ta tugun uchun nechta liniya?", ["7", "8", "16", "28"], 1, "Halqada liniyalar soni tugunlar soniga teng."),
        Q("12 tugunli to'liq bog'langan tarmoqda nechta liniya?", ["24", "66", "132", "144"], 1, "12·11/2 = 66."),
        Q("Yulduz topologiyasida bitta ish o'rni kabeli uzilsa?", ["Butun tarmoq to'xtaydi", "Faqat o'sha kompyuter uziladi", "Halqa buziladi", "Tezlik pasayadi"], 1, "Har kompyuterning alohida kabeli bor."),
        Q("24 portli kirish kommutatorida bitta port uplinkka ketsa, nechta ish o'rni ulanadi?", ["22", "23", "24", "25"], 1, "24 − 1 = 23."),
        Q("Juft o'ralgan kabel bilan ish o'rnigacha maksimal masofa?", ["50 m", "100 m", "185 m", "500 m"], 1, "Ethernet standarti bo'yicha 100 m."),
        Q("Qaysi choralar daraxt topologiyasining ishonchliligini oshiradi?", ["Ikkinchi yadro kommutatori", "Har bo'limdan ikkita uplink", "Hub ga almashtirish", "Kabel uzunligini 150 m ga yetkazish"], [0, 1], "Zaxira qurilma va zaxira yo'llar."),
    ],
    [
        answer_task(
            "Ofis loyihasi",
            "Ofisda 70 ta ish o'rni. 24 portli kirish kommutatorlari ishlatiladi (har biridan 1 port uplink). O'rtacha kabel 22 m + 3 m zaxira.",
            [
                F("Nechta kirish kommutatori kerak?", "number", 4, reject=["3"]),
                F("Ish o'rinlariga jami kabel uzunligi, m", "number", 1750, unit="m"),
                F("To'rtinchi kommutatorda nechta port bo'sh qoladi? (uplinkdan tashqari)", "number", 1),
            ],
            hints=["70 / 23 ni yuqoriga yaxlitlang.", "Birinchi uchta kommutatorda 69 ta ish o'rni; qolgani to'rtinchisida."],
            difficulty="medium",
        ),
        answer_task(
            "Mesh narxi",
            "Provayder 5 ta shahar marshrutizatorini to'liq bog'lamoqchi. Bitta optik liniya 4 mlrd so'm turadi.",
            [
                F("Liniyalar soni", "number", 10),
                F("Jami narx, mlrd so'm", "number", 40, unit="mlrd"),
                F("6-shahar qo'shilsa, qo'shimcha nechta liniya kerak?", "number", 5),
            ],
            hints=["Yangi tugun mavjud har bir tugun bilan ulanadi."],
        ),
        code_task(
            "Liniyalar kalkulyatori",
            "Tugunlar soni n kiritiladi (n ≥ 2). Uch qatorda chiqaring: yulduz (markazdan tashqari n ta kompyuter uchun) liniyalari, halqa liniyalari, to'liq bog'langan liniyalar.\nMasalan: 5 → 5, 5, 10",
            "n = int(input())\n# Kodingizni shu yerga yozing\n",
            "n = int(input())\nprint(n)\nprint(n)\nprint(n * (n - 1) // 2)",
            [("5", "5\n5\n10"), ("2", "2\n2\n1"), ("10", "10\n10\n45"), ("50", None), ("100", None)],
            hints=["Mesh: n·(n−1)/2 — butun bo'lish // ishlating."],
            difficulty="easy",
        ),
    ],
)

# ======================================================================
# 3-AMALIY
# ======================================================================
def frame(payload: int, l4: int) -> tuple[int, int, float]:
    data = payload + l4 + 20
    data = max(data, 46)
    fr = data + 18
    return fr, data, payload / fr * 100


F1460 = frame(1460, 20)   # (1518, 1500, 96.18)
F10 = frame(10, 8)        # (64, 46, 15.6)
F100 = frame(100, 20)

A03 = T(
    "kt-a03-osi-inkapsulyatsiya",
    "3-amaliy mashg'ulot: OSI modeli. Inkapsulyatsiya va sarlavhalar yukini hisoblash",
    f"""
<h2>Mashg'ulot maqsadi</h2>
<p>Protokollarni OSI pog'onalariga taqsimlash va inkapsulyatsiya natijasida kadr hajmi hamda uzatish samaradorligini hisoblash.</p>

<h2>1. Sarlavhalar</h2>
<table>
  <tr><th>Pog'ona</th><th>Sarlavha</th><th>Hajmi</th></tr>
  <tr><td>Transport</td><td>TCP / UDP</td><td>20 / 8 bayt</td></tr>
  <tr><td>Tarmoq</td><td>IPv4</td><td>20 bayt</td></tr>
  <tr><td>Kanal</td><td>Ethernet sarlavha + FCS</td><td>14 + 4 = 18 bayt</td></tr>
</table>
<p>Ethernet ma'lumot qismi 46–1500 bayt: 46 dan kam bo'lsa, to'ldiriladi (padding). Demak kadr 64–1518 bayt.</p>

<h2>2. Formulalar</h2>
<pre><code>IP paket   = foydali yuk + L4 sarlavha + 20
Kadr       = max(IP paket, 46) + 18
Samaradorlik = foydali yuk / kadr × 100%</code></pre>

<h3>Namuna 1. Katta TCP segment</h3>
<pre><code>Foydali yuk = 1460 B (TCP)
IP paket    = 1460 + 20 + 20 = {F1460[1]} B   (MTU ga teng)
Kadr        = {F1460[1]} + 18 = {F1460[0]} B
Samaradorlik = 1460 / {F1460[0]} = {F1460[2]:.2f}%</code></pre>

<h3>Namuna 2. Kichik UDP xabar</h3>
<pre><code>Foydali yuk = 10 B (UDP)
IP paket    = 10 + 8 + 20 = 38 B  →  46 gacha to'ldiriladi
Kadr        = 46 + 18 = {F10[0]} B
Samaradorlik = 10 / {F10[0]} = {F10[2]:.1f}%</code></pre>
<p>Xulosa: kichik xabarlarda kanalning katta qismi sarlavhalarga ketadi. Shuning uchun ma'lumotni katta bo'laklarda yuborish samaraliroq, VoIP kabi kichik paketli xizmatlarda esa sarlavhalarni siqish usullari qo'llanadi.</p>

<h2>3. Pog'onaga taqsimlash</h2>
<table>
  <tr><th>Hodisa</th><th>Pog'ona</th></tr>
  <tr><td>Kabel ulagichi qisilmagan</td><td>1 — fizik</td></tr>
  <tr><td>Kadrning FCS i mos kelmadi</td><td>2 — kanal</td></tr>
  <tr><td>Paket TTL tugab tashlandi</td><td>3 — tarmoq</td></tr>
  <tr><td>Port 443 yopiq</td><td>4 — transport</td></tr>
  <tr><td>Sayt sertifikati eskirgan (TLS)</td><td>6 — taqdimot</td></tr>
  <tr><td>Veb-server 404 qaytardi</td><td>7 — amaliy</td></tr>
</table>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyada "Salom!" xabarini 15 qadamda yuborib, har pog'onada qo'shilgan sarlavhani yozib oling.</li>
  <li>"Sarlavhalar qancha joy oladi?" bo'limida foydali yukni 10, 100, 1460 baytga qo'yib, natijani namunalar bilan solishtiring.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("Inkapsulyatsiya hisobi", "3-amaliy mashg'ulot", "📦"),
        S_table("Sarlavhalar", ["Sarlavha", "Bayt"], [["TCP", "20"], ["UDP", "8"], ["IPv4", "20"], ["Ethernet + FCS", "18"]]),
        S_code("Formulalar", "IP  = yuk + L4 + 20\nKadr = max(IP, 46) + 18\nSamaradorlik = yuk / kadr"),
        S_code("1460 B TCP", f"IP = {F1460[1]}, kadr = {F1460[0]}\nsamaradorlik = {F1460[2]:.2f}%"),
        S_code("10 B UDP", f"IP = 38 → 46 (padding), kadr = {F10[0]}\nsamaradorlik = {F10[2]:.1f}%"),
        S_quiz("100 B foydali yuk TCP orqali. Kadr hajmi?", [str(F100[0]), "140", "118", "164"], 0, f"100 + 20 + 20 = 140; 140 + 18 = {F100[0]}."),
        S_quiz("'Port 443 yopiq' — qaysi pog'ona muammosi?", ["2", "3", "4", "7"], 2, "Portlar — transport pog'onasi."),
        S_summary("Xulosa", ["Har pog'ona o'z sarlavhasini qo'shadi", "Kadr ≥ 64 B — kichik yuk to'ldiriladi", "Katta bo'lakda yuborish samaraliroq"]),
    ],
    [
        Q("1460 bayt TCP ma'lumot uchun Ethernet kadr hajmi?", ["1460", "1500", "1518", "1538"], 2, "1460 + 20 + 20 + 18 = 1518."),
        Q("UDP orqali 20 bayt yuborildi. IP paket hajmi?", ["28", "40", "48", "66"], 2, "20 + 8 + 20 = 48 ≥ 46 — to'ldirish shart emas."),
        Q("Ethernet ma'lumot qismi 46 baytdan kam bo'lsa nima qilinadi?", ["Kadr tashlanadi", "Nollar bilan to'ldiriladi", "Fragmentlanadi", "UDP ga o'tkaziladi"], 1, "Padding — kadr 64 baytdan kichik bo'lmasligi uchun."),
        Q("'Kadrning FCS i mos kelmadi' — qaysi pog'ona?", ["Fizik", "Kanal", "Tarmoq", "Transport"], 1, "FCS — kanal pog'onasi tekshiruvi."),
        Q("'Veb-server 404 qaytardi' — qaysi pog'ona?", ["Transport", "Seans", "Taqdimot", "Amaliy"], 3, "HTTP — amaliy pog'ona."),
        Q("Qaysi hollarda samaradorlik past bo'ladi?", ["Kichik foydali yuk", "UDP o'rniga TCP (kichik yukda)", "1460 baytli segmentlar", "Ko'p sarlavha qatlamlari (tunnellash)"], [0, 1, 3], "Katta segmentda samaradorlik ~96%."),
    ],
    [
        answer_task(
            "Kadr va samaradorlik",
            "Foydali yuk TCP orqali yuboriladi (TCP 20, IP 20, Ethernet 18 bayt).",
            [
                F("Yuk 500 B: kadr hajmi", "number", frame(500, 20)[0], unit="B"),
                F("Yuk 500 B: samaradorlik, % (1 xona)", "number", round(frame(500, 20)[2], 1), tol=0.1, unit="%"),
                F("Yuk 4 B (UDP): kadr hajmi", "number", frame(4, 8)[0], unit="B"),
                F("Yuk 4 B (UDP): to'ldirish (padding) necha bayt?", "number", 46 - (4 + 8 + 20), unit="B"),
            ],
            hints=["IP = yuk + L4 + 20, kadr = max(IP, 46) + 18.", "Padding = 46 − IP paket."],
            difficulty="medium",
        ),
        answer_task(
            "Pog'onani aniqlang",
            "Hodisa OSI ning qaysi pog'onasiga tegishli? Raqam kiriting.",
            [
                F("Kommutator MAC jadvali to'lib qoldi", "number", 2),
                F("Marshrutizatorda marshrut topilmadi", "number", 3),
                F("TCP segmenti qayta yuborildi", "number", 4),
                F("Kabelda elektromagnit xalaqit", "number", 1),
            ],
        ),
        code_task(
            "Kadr kalkulyatori",
            "Bir qatorda foydali yuk hajmi (bayt, 1–1460) va protokol (TCP yoki UDP). Ikki qatorda chiqaring: Ethernet kadr hajmi va samaradorlik foizi (1 xona).\nSarlavhalar: TCP 20, UDP 8, IP 20, Ethernet 18. Ma'lumot qismi kamida 46 bayt.\nMasalan: 1460 TCP → 1518 va 96.2",
            "yuk, proto = input().split()\nyuk = int(yuk)\n# Kodingizni shu yerga yozing\n",
            "yuk, proto = input().split()\nyuk = int(yuk)\nl4 = 20 if proto == 'TCP' else 8\nip = max(yuk + l4 + 20, 46)\nkadr = ip + 18\nprint(kadr)\nprint(f'{yuk / kadr * 100:.1f}')",
            [("1460 TCP", "1518\n96.2"), ("10 UDP", "64\n15.6"), ("100 TCP", "158\n63.3"), ("18 UDP", None), ("1 TCP", None)],
            hints=["max(..., 46) — to'ldirishni hisobga oladi."],
            difficulty="medium",
        ),
    ],
)

# ======================================================================
# 4-AMALIY
# ======================================================================
SH_C = 3100 * math.log2(1 + 1000)        # ~30898
NY_C = 2 * 4000 * math.log2(4)           # 16000

A04 = T(
    "kt-a04-tezlik-kechikish",
    "4-amaliy mashg'ulot: Kanal o'tkazuvchanligi va kechikishlarni hisoblash",
    f"""
<h2>Mashg'ulot maqsadi</h2>
<p>Uzatish vaqti, tarqalish kechikishi va kanalning nazariy maksimal tezligini (Naykvist, Shennon) hisoblash.</p>

<h2>1. Kechikish tarkibi</h2>
<ul>
  <li><b>Uzatish vaqti</b> (transmission) — barcha bitlarni kanalga "itarish": <code>t<sub>u</sub> = L / R</code> (L — bitlar, R — tezlik).</li>
  <li><b>Tarqalish kechikishi</b> (propagation) — signal yo'lni bosib o'tishi: <code>t<sub>t</sub> = d / v</code>. Mis va optikada v ≈ 2·10<sup>8</sup> m/s, radioda ≈ 3·10<sup>8</sup> m/s.</li>
  <li><b>Navbat</b> va <b>qayta ishlash</b> kechikishlari — marshrutizatorlarda (bu mashg'ulotda hisobga olinmaydi).</li>
</ul>

<h3>Namuna 1</h3>
<pre><code>10 MB fayl, 100 Mbit/s, masofa 1000 km (optika)
t_u = 10·8·10⁶ / 10⁸ = 0,8 s
t_t = 10⁶ m / 2·10⁸ = 0,005 s = 5 ms
Jami ≈ 0,805 s  → asosiy vaqt uzatishga ketgan</code></pre>
<h3>Namuna 2</h3>
<pre><code>100 baytli paket, 1 Gbit/s, Toshkent–Nyu-York ~10 000 km
t_u = 800 / 10⁹ = 0,8 µs
t_t = 10⁷ / 2·10⁸ = 0,05 s = 50 ms  → asosiy vaqt yo'lda</code></pre>
<p>Xulosa: kichik paket va uzoq masofada tezroq kanal deyarli yordam bermaydi — yorug'lik tezligi chegara.</p>

<h2>2. Kanalning nazariy chegarasi</h2>
<ul>
  <li><b>Naykvist</b> (shovqinsiz kanal): <code>C = 2B·log<sub>2</sub>M</code>, B — polosa (Hz), M — signal sathlari soni.</li>
  <li><b>Shennon</b> (shovqinli kanal): <code>C = B·log<sub>2</sub>(1 + S/N)</code>. S/N desibelda berilsa: <code>S/N = 10<sup>dB/10</sup></code>.</li>
</ul>
<h3>Namuna 3</h3>
<pre><code>Telefon kanali: B = 3100 Hz, S/N = 30 dB → 10³ = 1000
C = 3100 · log₂(1001) ≈ {SH_C:.0f} bit/s ≈ {SH_C/1000:.1f} kbit/s</code></pre>
<p>Shuning uchun oddiy telefon modemlari ~33,6 kbit/s dan oshmagan.</p>
<h3>Namuna 4</h3>
<pre><code>B = 4000 Hz, 4 ta sath (M = 4), shovqinsiz
C = 2 · 4000 · log₂4 = {NY_C:.0f} bit/s</code></pre>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi "Muhit va kechikish" bo'limida tayyor ssenariylarni ishga tushirib, uzatish va tarqalish ulushini solishtiring.</li>
  <li>Namunalarni simulyatsiyada takrorlab, natijalar mosligini tekshiring.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("Tezlik va kechikish", "4-amaliy mashg'ulot", "⏱️"),
        S_compare("Ikki kechikish", ("Uzatish: L / R", "Bitlarni kanalga itarish. Tezroq kanal qisqartiradi"), ("Tarqalish: d / v", "Signal yo'lda. Faqat masofaga bog'liq")),
        S_code("10 MB, 100 Mbit/s, 1000 km", "t_u = 80·10⁶ / 10⁸ = 0,8 s\nt_t = 10⁶ / 2·10⁸ = 5 ms"),
        S_quiz("1500 bayt paket, 1 Gbit/s. Uzatish vaqti?", ["1,5 µs", "12 µs", "120 µs", "1,2 ms"], 1, "1500·8 = 12 000 bit; 12 000 / 10⁹ = 12 µs."),
        S_table("Formulalar", ["Nomi", "Formula"], [["Naykvist", "C = 2B·log₂M"], ["Shennon", "C = B·log₂(1 + S/N)"], ["dB → marta", "S/N = 10^(dB/10)"]]),
        S_code("Telefon kanali (Shennon)", f"B = 3100 Hz, S/N = 30 dB = 1000\nC = 3100·log₂(1001) ≈ {SH_C:.0f} bit/s"),
        S_quiz("20 dB necha martaga teng?", ["20", "100", "200", "1000"], 1, "10^(20/10) = 100."),
        S_summary("Xulosa", ["Jami ≈ uzatish + tarqalish", "Uzoq masofada tarqalish ustun", "Shennon — shovqinli kanal chegarasi"]),
    ],
    [
        Q("Tarqalish kechikishi nimaga bog'liq?", ["Kanal tezligiga", "Masofa va signal tezligiga", "Paket hajmiga", "Protokolga"], 1, "t = d / v."),
        Q("Optik tolada signal tezligi taxminan?", ["3·10⁵ m/s", "2·10⁸ m/s", "3·10¹⁰ m/s", "340 m/s"], 1, "Yorug'lik tezligining ~2/3 qismi."),
        Q("Shovqinsiz kanal uchun qaysi formula?", ["Shennon", "Naykvist", "Om", "Dijkstra"], 1, "Shennon — shovqinli kanal."),
        Q("30 dB signal/shovqin nisbati necha martaga teng?", ["30", "300", "1000", "3000"], 2, "10³ = 1000."),
        Q("100 km optik liniyadagi tarqalish kechikishi?", ["0,5 ms", "5 ms", "50 µs", "0,33 ms"], 0, "10⁵ / 2·10⁸ = 0,0005 s."),
        Q("Kanal tezligini 10 baravar oshirish qaysi holda jami vaqtni sezilarli kamaytiradi?", ["Katta fayl, yaqin masofa", "Kichik paket, qit'alararo masofa", "Har doim", "Hech qachon"], 0, "Bunda vaqtning asosiy qismi — uzatish."),
    ],
    [
        answer_task(
            "Kechikishlarni hisoblang",
            "50 MB fayl 200 Mbit/s kanal orqali 2000 km masofaga (optika, v = 2·10⁸ m/s) yuborilmoqda. 1 MB = 8·10⁶ bit.",
            [
                F("Uzatish vaqti", "number", 2, unit="s"),
                F("Tarqalish kechikishi, ms", "number", 10, unit="ms"),
                F("Jami vaqt, s", "number", 2.01, tol=0.0005, unit="s"),
            ],
            hints=["t_u = 400·10⁶ / 2·10⁸.", "t_t = 2·10⁶ / 2·10⁸."],
        ),
        answer_task(
            "Kanal chegarasi",
            "Natijani butun songacha yaxlitlang.",
            [
                F("Naykvist: B = 3000 Hz, M = 8 sath. C, bit/s", "number", round(2 * 3000 * 3), unit="bit/s"),
                F("Shennon: B = 1 MHz, S/N = 20 dB. C, bit/s", "number", round(1e6 * math.log2(101)), tol=1, unit="bit/s"),
            ],
            hints=["log₂8 = 3.", "20 dB = 100 marta; log₂(101) ≈ 6,658."],
            difficulty="medium",
        ),
        code_task(
            "Jami kechikish",
            "Bir qatorda to'rt son: fayl hajmi (bayt), kanal tezligi (bit/s), masofa (km), signal tezligi (m/s). Jami kechikishni (uzatish + tarqalish) millisekundlarda 3 xona aniqlikda chiqaring.\nMasalan: 1500 1000000000 1000 200000000 → 5.012",
            "hajm, tezlik, km, v = map(float, input().split())\n# Kodingizni shu yerga yozing\n",
            "hajm, tezlik, km, v = map(float, input().split())\nt = hajm * 8 / tezlik + km * 1000 / v\nprint(f'{t * 1000:.3f}')",
            [("1500 1000000000 1000 200000000", "5.012"), ("10000000 100000000 1000 200000000", "805.000"),
             ("100 1000000000 10000 200000000", "50.001"), ("64 10000000 0.1 200000000", None)],
            hints=["Uzatish: hajm × 8 / tezlik (s). Tarqalish: km × 1000 / v (s).", "Natijani 1000 ga ko'paytirib ms ga o'tkazing."],
            difficulty="medium",
        ),
    ],
)

# ======================================================================
# 5-AMALIY
# ======================================================================
def crc_rem(data: str, gen: str) -> str:
    r = len(gen) - 1
    w = [int(c) for c in data + "0" * r]
    g = [int(c) for c in gen]
    for i in range(len(w) - len(g) + 1):
        if w[i]:
            for j in range(len(g)):
                w[i + j] ^= g[j]
    return "".join(map(str, w[-r:]))


def transitions_nrzl(bits: str) -> int:
    return sum(1 for a, b in zip(bits, bits[1:]) if a != b)


def crc_steps(data: str, gen: str) -> str:
    """Bo'lish qadamlari matni — har XOR dan keyingi ishchi qator."""
    r = len(gen) - 1
    w = [int(c) for c in data + "0" * r]
    g = [int(c) for c in gen]
    lines = ["".join(map(str, w))]
    for i in range(len(w) - len(g) + 1):
        if w[i]:
            lines.append(" " * i + gen + "   XOR")
            for j in range(len(g)):
                w[i + j] ^= g[j]
            lines.append("".join(map(str, w)))
    return "\n".join(lines)


CRC1 = crc_rem("1101011011", "10011")
CRC2 = crc_rem("110101", "1011")
CRC_STEPS = crc_steps("110101", "1011")

A05 = T(
    "kt-a05-kodlash-xatolar",
    "5-amaliy mashg'ulot: Signal kodlash va xatolarni aniqlash (juftlik, CRC)",
    f"""
<h2>Mashg'ulot maqsadi</h2>
<p>Bitlarni turli kodlarda chizish, juftlik biti va CRC qoldig'ini qo'lda hisoblash.</p>

<h2>1. Kodlash</h2>
<p>Konventsiya (simulyatsiyadagi bilan bir xil): NRZ-L — 1 yuqori, 0 past; Manchester (IEEE 802.3) — 0: yuqoridan pastga, 1: pastdan yuqoriga (bit o'rtasida); NRZI — 1 da bit boshida o'tish; AMI — 1 navbat bilan + va −.</p>
<h3>Namuna: 1011 ni Manchester kodida</h3>
<pre><code>bit:    1     0     1     1
sath:  ▁▔    ▔▁    ▁▔    ▁▔
        └ har bit o'rtasida o'tish; ikki bir xil bit orasida chegarada ham o'tish</code></pre>
<p>NRZ-L da <code>1011000010</code> ketma-ketligida sath {transitions_nrzl("1011000010")} marta o'zgaradi; to'rtta nol ketma-ket kelganda o'zgarish yo'q — qabul qiluvchi soatini yo'qotishi mumkin.</p>

<h2>2. Juftlik biti</h2>
<pre><code>Ma'lumot: 1011001  → 1 lar soni 4 (juft)
Juft (even) usul: juftlik biti 0 → 10110010
Toq (odd) usul:   juftlik biti 1 → 10110011</code></pre>

<h2>3. CRC</h2>
<p>Hosil qiluvchi polinom G daraja r bo'lsa (bitlar soni r+1), ma'lumot oxiriga r ta nol qo'shiladi va modul-2 da (ayirish o'rniga XOR) G ga bo'linadi. Qoldiq — CRC.</p>
<h3>Namuna: ma'lumot 110101, G = 1011 (r = 3)</h3>
<pre><code>{CRC_STEPS}
Qoldiq = {CRC2}
Yuboriladi: 110101{CRC2}</code></pre>
<p>Qabul qiluvchi butun kodni G ga bo'ladi: qoldiq 0 — xato yo'q; aks holda kadr buzilgan.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyada <code>10101010</code> va <code>00000000</code> uchun NRZ-L va Manchester shakllarini solishtiring.</li>
  <li>CRC bo'limida 110101 / 1011 ni kiritib, har XOR qadamini daftaringizdagi hisob bilan solishtiring.</li>
  <li>Qabul qilingan koddagi bitta bitni o'zgartirib, qoldiq nolga teng bo'lmay qolishini kuzating.</li>
</ol>
""",
    [
        S_title("Kodlash va xatolar", "5-amaliy mashg'ulot", "🧮"),
        S_table("Kodlash qoidalari", ["Kod", "1", "0"], [["NRZ-L", "yuqori", "past"], ["Manchester", "↑ o'rtada", "↓ o'rtada"], ["NRZI", "o'tish", "o'tish yo'q"], ["AMI", "+/− navbat", "nol"]]),
        S_code("Juftlik biti", "1011001 → 1 lar: 4\nEven: +0 → 10110010\nOdd:  +1 → 10110011"),
        S_points("CRC qadamlari", [("1️⃣", "Oxiriga r ta nol qo'shish"), ("2️⃣", "G ga modul-2 bo'lish (XOR)"), ("3️⃣", "Qoldiq — CRC"), ("4️⃣", "Qabulda qoldiq 0 bo'lishi kerak")]),
        S_code("110101 / 1011", f"110101000 ÷ 1011\nqoldiq = {CRC2}\nyuboriladi: 110101{CRC2}"),
        S_quiz("0110011 uchun toq (odd) juftlik biti?", ["0", "1", "Bit qo'shilmaydi"], 1, "1 lar soni 4 (juft). Umumiy son toq bo'lishi uchun 1 qo'shiladi."),
        S_summary("Xulosa", ["Manchester — har bit o'rtasida o'tish", "Juftlik — 1 ta xatoni aniqlaydi", "CRC — XOR bilan bo'lish qoldig'i"]),
    ],
    [
        Q("Manchester (IEEE 802.3) da 1 qanday kodlanadi?", ["Bit o'rtasida pastdan yuqoriga", "Bit o'rtasida yuqoridan pastga", "Doim yuqori sath", "Nol sath"], 0, "0 — yuqoridan pastga."),
        Q("NRZI da sath qachon o'zgaradi?", ["Har 0 da", "Har 1 da", "Har bit o'rtasida", "Hech qachon"], 1, "1 — bit boshida o'tish."),
        Q("Juft juftlik usulida 1110001 ga qanday bit qo'shiladi?", ["0", "1", "Bit qo'shilmaydi"], 0, "1 lar soni 4 — allaqachon juft, shuning uchun 0 qo'shiladi."),
        Q("CRC hisoblashda bo'lish qaysi amal bilan bajariladi?", ["Oddiy ayirish", "XOR (modul-2)", "Ko'paytirish", "AND"], 1, "Modul-2 arifmetikasida ayirish = XOR."),
        Q("G = 10011 bo'lsa, ma'lumot oxiriga nechta nol qo'shiladi?", ["3", "4", "5", "8"], 1, "G daraja 4 (5 bit) — 4 ta nol."),
        Q("Qabul qiluvchida CRC tekshiruvi qoldig'i nol bo'lmasa?", ["Kadr to'g'ri", "Kadr buzilgan va tashlanadi", "Qoldiq qayta hisoblanadi", "Kadr marshrutizatorga yuboriladi"], 1, "Qayta yuborishni yuqori pog'ona (TCP) bajaradi."),
    ],
    [
        answer_task(
            "CRC ni hisoblang",
            "Ma'lumot 1101011011, hosil qiluvchi G = 10011.",
            [
                F("Ma'lumot oxiriga nechta nol qo'shiladi?", "number", 4),
                F("CRC qoldig'i (4 bit)", "text", CRC1),
                F("Yuboriladigan to'liq kod", "text", "1101011011" + CRC1),
            ],
            hints=["Virtual simulyatsiyadagi CRC bo'limida qadamlarni ko'rib, o'z hisobingizni tekshiring."],
            difficulty="medium",
        ),
        answer_task(
            "Juftlik va o'tishlar",
            "Ma'lumot: 1100101.",
            [
                F("Juft (even) juftlik biti", "choice", "0", options=["0", "1"]),
                F("Toq (odd) juftlik biti", "choice", "1", options=["0", "1"]),
                F("NRZI da necha marta sath o'zgaradi? (1 lar soni)", "number", 4),
                F("NRZ-L da qo'shni bitlar orasida necha marta sath o'zgaradi?", "number", transitions_nrzl("1100101")),
            ],
        ),
        code_task(
            "CRC kalkulyatori",
            "Ikki qator: ma'lumot bitlari va hosil qiluvchi G (ikkalasi ham 0/1 dan iborat, G 1 bilan boshlanadi). CRC qoldig'ini (len(G) − 1 bit) chiqaring.\nMasalan: 1101011011 va 10011 → " + CRC1,
            "data = input().strip()\ng = input().strip()\n# Kodingizni shu yerga yozing\n",
            "data = input().strip()\ng = input().strip()\nr = len(g) - 1\nw = [int(c) for c in data + '0' * r]\nfor i in range(len(w) - len(g) + 1):\n    if w[i]:\n        for j in range(len(g)):\n            w[i + j] ^= int(g[j])\nprint(''.join(map(str, w[-r:])))",
            [("1101011011\n10011", CRC1), ("110101\n1011", CRC2), ("1000\n1011", crc_rem("1000", "1011")),
             ("11111111\n100000111", None), ("1\n11", None)],
            hints=["Ro'yxat bilan ishlang: w[i] 1 bo'lsa, G ni shu joydan boshlab XOR qiling.", "Oxirgi r ta element — qoldiq."],
            difficulty="hard",
        ),
    ],
)

TOPICS = [A01, A02, A03, A04, A05]
