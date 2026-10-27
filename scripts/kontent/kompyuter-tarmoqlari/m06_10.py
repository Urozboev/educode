"""Ma'ruzalar 6–10 (KT1406 fan dasturi, II bo'lim)."""

import heapq

from kt import (T, Q, F, answer_task, code_task, S_title, S_idea, S_points, S_table, S_compare, S_code, S_quiz,
                S_summary, net_of, hosts_count, mask_of, first_host, last_host)

# ----------------------------------------------------------------------
# Simulyatordagi (RoutingSim) graf — javoblar shu yerda hisoblanadi
# ----------------------------------------------------------------------
GRAPH = [("R1", "R2", 2), ("R1", "R3", 5), ("R2", "R3", 1), ("R2", "R4", 4),
         ("R3", "R5", 3), ("R4", "R5", 1), ("R4", "R6", 6), ("R5", "R6", 2)]


def dijkstra(src: str, hop: bool = False):
    adj: dict[str, list[tuple[str, int]]] = {}
    for a, b, c in GRAPH:
        w = 1 if hop else c
        adj.setdefault(a, []).append((b, w))
        adj.setdefault(b, []).append((a, w))
    dist = {n: float("inf") for n in adj}
    prev: dict[str, str | None] = {n: None for n in adj}
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v], prev[v] = d + w, u
                heapq.heappush(pq, (d + w, v))
    return dist, prev


def path(prev, dst):
    p = []
    while dst:
        p.append(dst)
        dst = prev[dst]
    return list(reversed(p))


_D, _P = dijkstra("R1")
SPF_R6 = int(_D["R6"])                       # 8
SPF_PATH = " → ".join(path(_P, "R6"))        # R1 → R2 → R3 → R5 → R6
SPF_NEXT = path(_P, "R6")[1]                 # R2
_DH, _ = dijkstra("R1", hop=True)
HOPS_R6 = int(_DH["R6"])                     # 3

# ----------------------------------------------------------------------
# IP misollar
# ----------------------------------------------------------------------
N7 = net_of("172.16.45.200/20")

# ======================================================================
# 6-MA'RUZA
# ======================================================================
M06 = T(
    "kt-m06-token-ring-wifi",
    "6-ma'ruza: Token Ring va boshqa texnologiyalar. 100VG-AnyLAN, FDDI, Wi-Fi",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Markerli kirish usuli va Token Ring</li>
  <li>100VG-AnyLAN</li>
  <li>FDDI</li>
  <li>Wi-Fi (IEEE 802.11) texnologiyalari</li>
  <li>Texnologiyalarni solishtirish</li>
</ol>

<h2>1. Token Ring</h2>
<p><b>Token Ring</b> — IBM tomonidan ishlab chiqilgan va <b>IEEE 802.5</b> sifatida standartlashtirilgan lokal tarmoq texnologiyasi. Tezligi 4 va 16 Mbit/s.</p>
<p>Asosiy g'oya — <b>markerli (token) kirish</b>. Halqa bo'ylab maxsus qisqa kadr — <b>marker</b> aylanib yuradi. Uzatmoqchi bo'lgan stansiya bo'sh markerni ushlab, uni ma'lumot kadriga aylantiradi. Kadr halqa bo'ylab aylanadi, manzil stansiyasi nusxasini olib, "qabul qilindi" belgisini qo'yadi. Kadr yuboruvchiga qaytgach, u kadrni halqadan olib tashlaydi va yangi bo'sh marker chiqaradi.</p>
<ul>
  <li><b>To'qnashuv yo'q</b> — bir vaqtda faqat marker egasi uzatadi.</li>
  <li><b>Kafolatlangan kirish vaqti</b> — har stansiya navbati albatta keladi (markerni ushlab turish vaqti cheklangan). Shuning uchun yuklama yuqori bo'lganda Token Ring CSMA/CD dan barqarorroq ishlagan.</li>
  <li><b>Prioritetlar</b> — muhim ma'lumot uchun ustuvorlik bitlari.</li>
  <li><b>Erta marker chiqarish</b> (16 Mbit/s da) — stansiya kadr qaytishini kutmasdan yangi marker chiqaradi, halqada bir vaqtda bir nechta kadr bo'ladi.</li>
</ul>
<p>Fizik jihatdan stansiyalar <b>MAU</b> (Multistation Access Unit) markaziy qurilmasiga yulduz shaklida ulanadi, mantiqan esa halqa hosil qiladi: MAU signalni portdan portga navbat bilan uzatadi va o'chirilgan stansiyani avtomatik aylanib o'tadi. Signal differensial Manchester kodida uzatiladi.</p>

<h2>2. 100VG-AnyLAN</h2>
<p><b>IEEE 802.12</b> standarti (Hewlett-Packard taklifi). 100 Mbit/s tezlik, 3-kategoriyali (telefon sifatidagi — "Voice Grade") kabelning 4 juftida ishlagan. Kirish usuli — <b>talab bo'yicha ustuvorlik</b> (Demand Priority): markaziy konsentrator portlarni navbat bilan so'raydi, stansiyalar uzatish uchun so'rov yuboradi, konsentrator ruxsat beradi. Ikki ustuvorlik darajasi (oddiy va yuqori — multimedia uchun). Ham Ethernet, ham Token Ring kadrlarini tashiy olgan ("AnyLAN"). Texnik jihatdan yaxshi bo'lsa-da, arzonroq va eski Ethernet bilan mos Fast Ethernet bozorda yutdi.</p>

<h2>3. FDDI</h2>
<p><b>FDDI</b> (Fiber Distributed Data Interface) — ANSI tomonidan standartlashtirilgan (keyin ISO 9314), optik tolada ishlovchi 100 Mbit/s markerli tarmoq. 1990-yillarda kampus va shahar <b>magistral</b> tarmoqlari uchun ishlatilgan.</p>
<ul>
  <li><b>Ikki qarama-qarshi yo'nalishli halqa</b>: asosiy va zaxira. Normal holatda asosiy halqa ishlaydi.</li>
  <li>Bitta joyda kabel uzilsa yoki stansiya ishdan chiqsa, uzilish yonidagi stansiyalar ikki halqani birlashtiradi (<b>wrap</b>) — tarmoq bitta uzunroq halqa sifatida ishlashda davom etadi.</li>
  <li>Halqa uzunligi 100 km gacha, 500 tagacha stansiya.</li>
  <li>Kodlash: 4B/5B + NRZI. Mis kabeldagi varianti — CDDI.</li>
</ul>

<h2>4. Wi-Fi (IEEE 802.11)</h2>
<p>Simsiz lokal tarmoq (WLAN) standartlari oilasi. "Wi-Fi" — Wi-Fi Alliance savdo belgisi.</p>
<table>
  <tr><th>Standart</th><th>Avlod</th><th>Yil</th><th>Diapazon</th><th>Maks. kanal tezligi</th></tr>
  <tr><td>802.11b</td><td>—</td><td>1999</td><td>2,4 GHz</td><td>11 Mbit/s</td></tr>
  <tr><td>802.11a</td><td>—</td><td>1999</td><td>5 GHz</td><td>54 Mbit/s</td></tr>
  <tr><td>802.11g</td><td>—</td><td>2003</td><td>2,4 GHz</td><td>54 Mbit/s</td></tr>
  <tr><td>802.11n</td><td>Wi-Fi 4</td><td>2009</td><td>2,4 / 5 GHz</td><td>600 Mbit/s</td></tr>
  <tr><td>802.11ac</td><td>Wi-Fi 5</td><td>2013</td><td>5 GHz</td><td>~6,9 Gbit/s</td></tr>
  <tr><td>802.11ax</td><td>Wi-Fi 6 / 6E</td><td>2019–2020</td><td>2,4 / 5 / 6 GHz</td><td>~9,6 Gbit/s</td></tr>
  <tr><td>802.11be</td><td>Wi-Fi 7</td><td>2024</td><td>2,4 / 5 / 6 GHz</td><td>~46 Gbit/s</td></tr>
</table>
<p>Jadvaldagi tezliklar — nazariy maksimum; amalda bir necha baravar kam, chunki havo umumiy muhit va xizmat ma'lumoti ko'p.</p>
<h3>Ish rejimlari va tushunchalar</h3>
<ul>
  <li><b>Infratuzilma rejimi</b> — qurilmalar kirish nuqtasi (AP) orqali ulanadi. AP va unga ulangan mijozlar — BSS.</li>
  <li><b>Ad hoc rejimi</b> — qurilmalar bevosita, AP siz (IBSS).</li>
  <li><b>SSID</b> — tarmoq nomi; <b>BSSID</b> — AP radiomodulining MAC manzili.</li>
  <li><b>Kanallar</b>: 2,4 GHz da kanallar orasi 5 MHz, kenglik ~20–22 MHz, shuning uchun qo'shni kanallar bir-birini qoplaydi. Bir-birini qoplamaydigan uchlik — <b>1, 6, 11</b>. 5 GHz da kanallar ko'p va qoplanmaydi.</li>
</ul>
<h3>CSMA/CA</h3>
<p>Radioda stansiya o'zi uzatayotganda boshqa signalni eshitmaydi, shuning uchun to'qnashuvni <i>aniqlab</i> bo'lmaydi — undan <i>qochish</i> kerak (Collision Avoidance):</p>
<ol>
  <li>Kanal DIFS vaqti davomida bo'sh bo'lishini kutish.</li>
  <li>Tasodifiy kutish (backoff) hisoblagichi: kanal bo'sh paytda kamayadi, band bo'lsa to'xtaydi.</li>
  <li>Kadrni uzatish. Qabul qiluvchi SIFS kutib <b>ACK</b> yuboradi; ACK kelmasa — qayta urinish.</li>
  <li>Ixtiyoriy <b>RTS/CTS</b>: "yashirin stansiya" muammosini hal qiladi — AP yuborgan CTS ni uni eshitadigan hamma stansiyalar oladi va belgilangan vaqt jim turadi (NAV).</li>
</ol>
<h3>Xavfsizlik</h3>
<p>WEP (eskirgan, buziladi) → WPA (TKIP) → <b>WPA2</b> (AES-CCMP) → <b>WPA3</b> (SAE). Bugun WPA2 yoki WPA3 va kuchli parol ishlatilishi shart.</p>

<h2>5. Solishtirish</h2>
<table>
  <tr><th>Texnologiya</th><th>Kirish usuli</th><th>Topologiya</th><th>Tezlik</th></tr>
  <tr><td>Ethernet (klassik)</td><td>CSMA/CD</td><td>shina / yulduz</td><td>10 Mbit/s →</td></tr>
  <tr><td>Token Ring</td><td>marker</td><td>fizik yulduz, mantiqiy halqa</td><td>4 / 16 Mbit/s</td></tr>
  <tr><td>100VG-AnyLAN</td><td>talab bo'yicha ustuvorlik</td><td>yulduz</td><td>100 Mbit/s</td></tr>
  <tr><td>FDDI</td><td>marker (vaqtli)</td><td>ikki halqa, optika</td><td>100 Mbit/s</td></tr>
  <tr><td>Wi-Fi</td><td>CSMA/CA</td><td>radio, AP atrofida</td><td>11 Mbit/s → Gbit/s</td></tr>
</table>
<p>Token Ring, 100VG-AnyLAN va FDDI bugun deyarli ishlatilmaydi — ularning o'rnini kommutatorli Ethernet egalladi. Lekin markerli kirish, kafolatlangan kechikish va ikki halqali zaxira g'oyalari zamonaviy sanoat va provayder tarmoqlarida yashab qolmoqda.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Token Ring da marker qanday aylanadi va kadr halqadan kim tomonidan olib tashlanadi?</li>
  <li>Nega Token Ring yuqori yuklamada CSMA/CD dan barqarorroq?</li>
  <li>FDDI da kabel uzilganda tarmoq qanday ishlashda davom etadi?</li>
  <li>Wi-Fi da nega CSMA/CD emas, CSMA/CA ishlatiladi?</li>
  <li>2,4 GHz diapazonida qaysi kanallarni tanlash tavsiya etiladi va nima uchun?</li>
</ol>
""",
    [
        S_title("Token Ring, FDDI, Wi-Fi", "Ethernetdan tashqari texnologiyalar", "💍"),
        S_idea("Marker g'oyasi", "Halqada bitta marker aylanadi. Uni ushlagan stansiyagina uzatadi — to'qnashuv bo'lmaydi.", "🎫"),
        S_points("Token Ring", [("🏢", "IBM, IEEE 802.5"), ("⚡", "4 / 16 Mbit/s"), ("⭐", "Fizik yulduz (MAU), mantiqiy halqa"), ("⏱️", "Kafolatlangan kirish vaqti")]),
        S_points("FDDI", [("💡", "Optika, 100 Mbit/s"), ("🔄", "Ikki qarama-qarshi halqa"), ("🩹", "Uzilishda halqalar birlashadi (wrap)"), ("🏙️", "Kampus magistrallari")]),
        S_table("Wi-Fi avlodlari", ["Standart", "Nomi", "Tezlik"], [
            ["802.11n", "Wi-Fi 4", "600 Mbit/s"], ["802.11ac", "Wi-Fi 5", "~6,9 Gbit/s"],
            ["802.11ax", "Wi-Fi 6/6E", "~9,6 Gbit/s"], ["802.11be", "Wi-Fi 7", "~46 Gbit/s"],
        ], note="Nazariy maksimum"),
        S_compare("CSMA/CD va CSMA/CA", ("CSMA/CD (Ethernet)", "To'qnashuvni ANIQLAYDI va qayta uzatadi"), ("CSMA/CA (Wi-Fi)", "To'qnashuvdan QOCHADI: kutish, ACK, RTS/CTS")),
        S_quiz("2,4 GHz da bir-birini qoplamaydigan kanallar?", ["1, 2, 3", "1, 6, 11", "1, 7, 13", "6, 7, 8"], 1, "Kanallar 5 MHz oraliqda, kengligi ~20 MHz — 5 kanal oralig'i kerak."),
        S_quiz("Token Ring da kadrni halqadan kim olib tashlaydi?", ["Manzil stansiyasi", "Yuboruvchi stansiya", "MAU", "Har bir keyingi stansiya"], 1, "Kadr aylanib yuboruvchiga qaytadi, u yetkazilganini tekshirib olib tashlaydi."),
        S_summary("Xulosa", ["Marker — to'qnashuvsiz va kafolatli kirish", "FDDI — ikki halqa bilan ishonchlilik", "Wi-Fi — CSMA/CA, kanallar 1/6/11, WPA2/WPA3", "Bugun simli LAN = kommutatorli Ethernet"]),
    ],
    [
        Q("Token Ring qaysi IEEE standarti?", ["802.3", "802.5", "802.11", "802.12"], 1, "802.3 — Ethernet, 802.11 — Wi-Fi, 802.12 — 100VG-AnyLAN."),
        Q("Token Ring ning tezliklari qaysilar?", ["4 va 16 Mbit/s", "10 va 100 Mbit/s", "11 va 54 Mbit/s", "100 va 1000 Mbit/s"], 0, "Klassik Token Ring 4 va 16 Mbit/s da ishlagan."),
        Q("FDDI da bitta kabel uzilsa nima bo'ladi?", ["Tarmoq to'liq to'xtaydi", "Ikki halqa birlashib, bitta halqa sifatida ishlaydi", "Barcha stansiyalar CSMA/CD ga o'tadi", "Tezlik 2 baravar oshadi"], 1, "Uzilish yonidagi stansiyalar halqalarni birlashtiradi (wrap)."),
        Q("100VG-AnyLAN qanday kirish usulidan foydalangan?", ["CSMA/CD", "Marker", "Talab bo'yicha ustuvorlik (Demand Priority)", "CSMA/CA"], 2, "Konsentrator stansiyalarning so'rovlarini navbat va ustuvorlik bo'yicha qondiradi."),
        Q("Nega Wi-Fi da to'qnashuvni aniqlash (CD) ishlatilmaydi?", ["Radio juda tez", "Stansiya uzatayotganda boshqa signalni eshita olmaydi", "Wi-Fi da to'qnashuv bo'lmaydi", "Standart buni taqiqlaydi"], 1, "Shuning uchun Wi-Fi to'qnashuvdan qochadi va har kadrni ACK bilan tasdiqlaydi."),
        Q("Wi-Fi 6 qaysi standart?", ["802.11n", "802.11ac", "802.11ax", "802.11be"], 2, "Wi-Fi 4 — n, Wi-Fi 5 — ac, Wi-Fi 6 — ax, Wi-Fi 7 — be."),
        Q("Hozirgi kunda simsiz tarmoq uchun qaysi himoya turlari tavsiya etiladi?", ["WEP", "WPA (TKIP)", "WPA2 (AES)", "WPA3 (SAE)"], [2, 3], "WEP va TKIP eskirgan va zaif."),
    ],
    [
        answer_task(
            "Texnologiyalarni solishtiring",
            "Ma'ruza materiali asosida qiymatlarni kiriting.",
            [
                F("Token Ring ning yuqori tezligi, Mbit/s", "number", 16),
                F("FDDI tezligi, Mbit/s", "number", 100),
                F("FDDI da nechta halqa bor?", "number", 2),
                F("Wi-Fi 5 qaysi IEEE standarti? (masalan: 802.11n)", "text", ["802.11ac", "ieee 802.11ac"]),
            ],
        ),
        answer_task(
            "Kanal rejasi",
            "Bitta qavatda uchta kirish nuqtasi o'rnatilmoqda (2,4 GHz). Ularga qaysi kanallarni berasiz? Kichigidan kattasiga.",
            [
                F("AP1 kanali", "number", 1),
                F("AP2 kanali", "number", 6),
                F("AP3 kanali", "number", 11),
            ],
            hints=["Qo'shni kanallar spektri ustma-ust tushmasligi uchun oralig'i kamida 5 bo'lishi kerak.", "Virtual simulyatsiyadagi Wi-Fi bo'limida sinab ko'ring."],
        ),
    ],
)

# ======================================================================
# 7-MA'RUZA
# ======================================================================
M07 = T(
    "kt-m07-tcp-ip",
    "7-ma'ruza: TCP/IP protokollar steki. IP protokoli va adreslash usullari",
    f"""
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Tarmoqlararo ma'lumot almashish tamoyillari</li>
  <li>TCP/IP steki tuzilishi</li>
  <li>IP protokoli va IPv4 paketi</li>
  <li>IPv4 manzillari: sinflar, maska, CIDR</li>
  <li>Maxsus va xususiy manzillar, NAT</li>
  <li>IPv6 haqida qisqacha</li>
</ol>

<h2>1. Tarmoqlararo almashish</h2>
<p>Har bir lokal tarmoq o'z texnologiyasida (Ethernet, Wi-Fi) ishlaydi va o'z manzillash tizimiga (MAC) ega. Turli tarmoqlarni birlashtirish uchun <b>umumiy, texnologiyaga bog'liq bo'lmagan</b> manzillash va yo'naltirish kerak. TCP/IP buni tarmoq pog'onasida — <b>IP manzil</b> va <b>marshrutizatorlar</b> yordamida hal qiladi. Marshrutizator har bir tarmoqqa ulangan interfeysga ega va paketni bir tarmoqdan boshqasiga o'tkazadi. Paket yo'lda bir necha kanal texnologiyasidan o'tishi mumkin, lekin IP manzillar o'zgarmaydi; har bir kanal bo'lagida faqat MAC manzillar yangilanadi.</p>

<h2>2. TCP/IP steki</h2>
<table>
  <tr><th>Pog'ona</th><th>Vazifasi</th><th>Protokollar</th></tr>
  <tr><td>Amaliy</td><td>Foydalanuvchi xizmatlari</td><td>HTTP, DNS, SMTP, FTP, DHCP, SSH</td></tr>
  <tr><td>Transport</td><td>Jarayonlar orasida yetkazish (portlar)</td><td>TCP, UDP</td></tr>
  <tr><td>Internet</td><td>Manzillash va marshrutlash</td><td>IP, ICMP, (ARP)</td></tr>
  <tr><td>Tarmoqqa kirish</td><td>Muayyan muhitda kadr uzatish</td><td>Ethernet, Wi-Fi, PPP</td></tr>
</table>
<p>Steklar standartlari IETF tomonidan <b>RFC</b> (Request for Comments) hujjatlarida e'lon qilinadi: IPv4 — RFC 791, TCP — RFC 793 (yangilangani RFC 9293), UDP — RFC 768.</p>

<h2>3. IP protokoli</h2>
<p>IP — <b>ulanishsiz</b> va <b>kafolatsiz</b> ("best effort") protokol: har paket mustaqil yuboriladi, yetib borishi, tartibi va takrorlanmasligi kafolatlanmaydi — bu vazifa yuqori pog'onaga (TCP) qoldirilgan. IPv4 sarlavhasi kamida 20 bayt:</p>
<table>
  <tr><th>Maydon</th><th>Vazifasi</th></tr>
  <tr><td>Version (4 bit)</td><td>4 — IPv4</td></tr>
  <tr><td>IHL</td><td>Sarlavha uzunligi (32 bitli so'zlarda), odatda 5 = 20 bayt</td></tr>
  <tr><td>DSCP/ToS</td><td>Xizmat sifati (QoS) belgisi</td></tr>
  <tr><td>Total Length</td><td>Paketning umumiy uzunligi, ≤ 65 535 bayt</td></tr>
  <tr><td>Identification, Flags, Fragment Offset</td><td>Fragmentatsiya: paket MTU dan katta bo'lsa bo'laklarga bo'linadi</td></tr>
  <tr><td><b>TTL</b></td><td>Har marshrutizatorda 1 ga kamayadi; 0 bo'lsa paket tashlanadi (halqalardan himoya)</td></tr>
  <tr><td>Protocol</td><td>Ichida nima: 1 — ICMP, 6 — TCP, 17 — UDP</td></tr>
  <tr><td>Header Checksum</td><td>Sarlavha nazorat yig'indisi</td></tr>
  <tr><td>Source / Destination Address</td><td>Manba va manzil IP (32 bitdan)</td></tr>
</table>

<h2>4. IPv4 manzillari</h2>
<p>IPv4 manzil — 32 bitli son, 4 ta 8 bitli oktetga bo'linib, o'nlik sanoqda nuqta bilan yoziladi: <code>192.168.1.10</code> = <code>11000000.10101000.00000001.00001010</code>. Manzil ikki qismdan iborat: <b>tarmoq qismi</b> va <b>xost qismi</b>. Qayerdan bo'linishini <b>maska</b> ko'rsatadi: maskada tarmoq bitlari 1, xost bitlari 0.</p>
<h3>4.1. Sinfli manzillash</h3>
<table>
  <tr><th>Sinf</th><th>Birinchi oktet</th><th>Birinchi bitlar</th><th>Standart maska</th><th>Tarmoqlar / xostlar</th></tr>
  <tr><td>A</td><td>1–126</td><td>0</td><td>255.0.0.0 (/8)</td><td>126 / 16 777 214</td></tr>
  <tr><td>B</td><td>128–191</td><td>10</td><td>255.255.0.0 (/16)</td><td>16 384 / 65 534</td></tr>
  <tr><td>C</td><td>192–223</td><td>110</td><td>255.255.255.0 (/24)</td><td>2 097 152 / 254</td></tr>
  <tr><td>D</td><td>224–239</td><td>1110</td><td>—</td><td>multicast</td></tr>
  <tr><td>E</td><td>240–255</td><td>1111</td><td>—</td><td>zaxira</td></tr>
</table>
<p>Sinfli tizim manzillarni isrof qilardi: 300 ta kompyuterli tashkilotga C sinf (254) yetmaydi, B sinf esa 65 534 xost beradi. Shuning uchun 1993-yilda <b>CIDR</b> (sinfsiz manzillash) joriy qilindi.</p>
<h3>4.2. CIDR va maska</h3>
<p>CIDR da tarmoq qismi uzunligi istalgan bo'lishi mumkin va <b>prefiks</b> bilan yoziladi: <code>/24</code> — birinchi 24 bit tarmoq. Maska: /24 = 255.255.255.0, /26 = 255.255.255.192, /20 = 255.255.240.0.</p>
<ul>
  <li><b>Tarmoq manzili</b> = IP AND maska (xost bitlari hammasi 0).</li>
  <li><b>Broadcast manzil</b> — xost bitlari hammasi 1.</li>
  <li><b>Xostlar soni</b> = 2<sup>(32 − prefiks)</sup> − 2 (tarmoq va broadcast manzillar xostga berilmaydi).</li>
</ul>
<p><b>Misol.</b> <code>172.16.45.200/20</code>: maska {mask_of(20)}, uchinchi oktet 45 = 0010 1101, maskada 1111 0000 → 0010 0000 = 32. Tarmoq — <b>{N7.network_address}</b>, broadcast — <b>{N7.broadcast_address}</b>, xostlar {first_host(N7)} – {last_host(N7)}, soni 2<sup>12</sup> − 2 = <b>{hosts_count(20)}</b>.</p>

<h2>5. Maxsus va xususiy manzillar</h2>
<table>
  <tr><th>Diapazon</th><th>Vazifasi</th></tr>
  <tr><td>10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</td><td><b>Xususiy</b> (RFC 1918) — Internetda marshrutlanmaydi, ichki tarmoqlar uchun</td></tr>
  <tr><td>127.0.0.0/8</td><td>Loopback — kompyuterning o'zi (127.0.0.1)</td></tr>
  <tr><td>169.254.0.0/16</td><td>APIPA — DHCP server topilmaganda avtomatik beriladi</td></tr>
  <tr><td>0.0.0.0</td><td>"Bu tarmoq / noma'lum manzil"; marshrut jadvalida — sukut marshruti</td></tr>
  <tr><td>255.255.255.255</td><td>Cheklangan broadcast — joriy tarmoqdagi hammaga</td></tr>
</table>
<p>Xususiy manzilli kompyuterlar Internetga <b>NAT</b> (Network Address Translation) orqali chiqadi: marshrutizator chiquvchi paketdagi xususiy manzilni o'zining ommaviy manziliga almashtiradi va javobni qaytarishda teskari almashtiradi. Bitta ommaviy IP orqali butun ofis Internetga chiqadi.</p>

<h2>6. IPv6</h2>
<p>IPv4 manzillari (~4,3 mlrd) tugagani sababli <b>IPv6</b> ishlab chiqilgan: 128 bitli manzil, 16 lik sanoqda 8 guruh bo'lib yoziladi: <code>2001:0db8:0000:0000:0000:ff00:0042:8329</code>. Qisqartirish: guruh boshidagi nollar tushirib qoldiriladi, ketma-ket nol guruhlar bir marta <code>::</code> bilan almashtiriladi → <code>2001:db8::ff00:42:8329</code>. IPv6 da broadcast yo'q (multicast ishlatiladi), sarlavha soddalashtirilgan, avtosozlash (SLAAC) mavjud.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega IP "kafolatsiz" protokol deyiladi va bu kamchilikni kim to'ldiradi?</li>
  <li>TTL maydoni nima uchun kerak?</li>
  <li>10.200.30.40 qaysi sinfga tegishli va u xususiymi?</li>
  <li>/27 prefiksli tarmoqda nechta xost bo'ladi?</li>
  <li>NAT nima uchun kerak?</li>
</ol>
""",
    [
        S_title("TCP/IP va IPv4 manzillash", "Tarmoqlarni bitta Internetga birlashtirish", "🌍"),
        S_table("TCP/IP steki", ["Pog'ona", "Protokollar"], [["Amaliy", "HTTP, DNS, SMTP"], ["Transport", "TCP, UDP"], ["Internet", "IP, ICMP"], ["Tarmoqqa kirish", "Ethernet, Wi-Fi"]]),
        S_points("IP xususiyatlari", [("📮", "Ulanishsiz — har paket mustaqil"), ("🤷", "Kafolatsiz (best effort)"), ("⏳", "TTL — har routerda −1"), ("🔢", "Protocol: 1 ICMP, 6 TCP, 17 UDP")]),
        S_code("IP manzil ikkilikda", "192.168.1.10\n11000000.10101000.00000001.00001010", note="4 oktet × 8 bit = 32 bit"),
        S_table("Sinflar", ["Sinf", "1-oktet", "Standart maska"], [["A", "1–126", "/8"], ["B", "128–191", "/16"], ["C", "192–223", "/24"], ["D", "224–239", "multicast"]]),
        S_idea("Uchta formula", "Tarmoq = IP AND maska.  Broadcast = xost bitlari hammasi 1.  Xostlar = 2^(32 − prefiks) − 2.", "🧮"),
        S_code("Misol: 172.16.45.200/20", f"Maska:      {mask_of(20)}\nTarmoq:     {N7.network_address}\nBroadcast:  {N7.broadcast_address}\nXostlar:    {first_host(N7)} – {last_host(N7)} ({hosts_count(20)} ta)"),
        S_quiz("/26 tarmoqda nechta xost bo'ladi?", ["64", "62", "30", "126"], 1, "2⁶ − 2 = 62."),
        S_table("Maxsus manzillar", ["Diapazon", "Vazifasi"], [["10/8, 172.16/12, 192.168/16", "Xususiy"], ["127.0.0.1", "Loopback"], ["169.254.x.x", "APIPA — DHCP yo'q"], ["255.255.255.255", "Broadcast"]]),
        S_compare("IPv4 va IPv6", ("IPv4", "32 bit, ~4,3 mlrd manzil, 192.168.1.10"), ("IPv6", "128 bit, 2001:db8::ff00:42:8329, broadcast yo'q")),
        S_summary("Xulosa", ["IP — tarmoqlararo manzillash va yo'naltirish", "Maska tarmoq va xost qismini ajratadi", "CIDR sinflar o'rniga istalgan prefiks", "Xususiy manzillar NAT orqali Internetga chiqadi"]),
    ],
    [
        Q("IPv4 manzil necha bitdan iborat?", ["16", "32", "48", "128"], 1, "4 oktet × 8 bit."),
        Q("IP sarlavhasidagi Protocol = 6 nimani bildiradi?", ["ICMP", "TCP", "UDP", "ARP"], 1, "1 — ICMP, 6 — TCP, 17 — UDP."),
        Q("TTL qiymati 0 ga yetsa marshrutizator nima qiladi?", ["Paketni manzilga yetkazadi", "Paketni tashlaydi va ICMP Time Exceeded yuboradi", "TTL ni 64 ga tiklaydi", "Paketni broadcast qiladi"], 1, "TTL marshrutlash halqalarida paketlar abadiy aylanishining oldini oladi."),
        Q("150.20.30.40 qaysi sinfga tegishli?", ["A", "B", "C", "D"], 1, "Birinchi oktet 128–191 — B sinf."),
        Q("Qaysi manzil xususiy (RFC 1918)?", ["8.8.8.8", "172.20.1.5", "172.32.1.5", "193.168.1.1"], 1, "172.16.0.0 – 172.31.255.255 xususiy; 172.32 — yo'q."),
        Q("/27 prefiksning maskasi qaysi?", ["255.255.255.192", "255.255.255.224", "255.255.255.240", "255.255.255.0"], 1, "27 ta bir: oxirgi oktet 11100000 = 224."),
        Q("Kompyuter 169.254.15.3 manzil olgan. Bu nimani bildiradi?", ["Internet ishlayapti", "DHCP serverdan javob kelmagan", "Manzil qo'lda berilgan", "Bu loopback manzil"], 1, "APIPA manzili — DHCP topilmaganda kompyuter o'ziga o'zi beradi."),
    ],
    [
        answer_task(
            "Tarmoqni hisoblang",
            "Kompyuterning manzili 172.16.45.200/20. Hisoblang.",
            [
                F("Maska (o'nlik)", "ip", mask_of(20), reject=["255.255.255.0"]),
                F("Tarmoq manzili", "ip", str(N7.network_address), reject=["172.16.45.0", "172.16.0.0"]),
                F("Broadcast manzil", "ip", str(N7.broadcast_address)),
                F("Xostlar soni", "number", hosts_count(20), reject=["4096"]),
            ],
            hints=["Faqat 3-oktet 'qiziq': 45 ni ikkilikka o'tkazing va maskaning 3-okteti (240) bilan AND qiling.", "Broadcast: tarmoq + blok o'lchami − 1. /20 da 3-oktet bo'yicha blok = 16."],
            difficulty="medium",
        ),
        answer_task(
            "Sinf va turi",
            "Har bir manzil uchun sinfni kiriting (A, B, C, D yoki E).",
            [
                F("10.200.30.40", "choice", "A", options=["A", "B", "C", "D", "E"]),
                F("191.255.0.1", "choice", "B", options=["A", "B", "C", "D", "E"]),
                F("223.1.1.1", "choice", "C", options=["A", "B", "C", "D", "E"]),
                F("224.0.0.5", "choice", "D", options=["A", "B", "C", "D", "E"]),
            ],
        ),
        code_task(
            "IP manzil ikkilikda",
            "Bitta qatorda IPv4 manzil kiritiladi. Uni ikkilik ko'rinishda chiqaring: har oktet 8 ta raqam, oktetlar nuqta bilan ajratiladi.\nMasalan: 192.168.1.10 → 11000000.10101000.00000001.00001010",
            "ip = input()\n# Kodingizni shu yerga yozing\n",
            "ip = input().strip()\nprint('.'.join(format(int(x), '08b') for x in ip.split('.')))",
            [("192.168.1.10", "11000000.10101000.00000001.00001010"), ("10.0.0.1", "00001010.00000000.00000000.00000001"),
             ("255.255.240.0", "11111111.11111111.11110000.00000000"), ("172.16.45.200", None), ("0.0.0.0", None)],
            hints=["input().split('.') — 4 ta matn bo'lak.", "format(son, '08b') — 8 xonali ikkilik yozuv."],
            difficulty="easy",
        ),
    ],
)

# ======================================================================
# 8-MA'RUZA
# ======================================================================
M08 = T(
    "kt-m08-protokollar-marshrutlash",
    "8-ma'ruza: Tarmoq protokollari (ARP, ICMP, DHCP) va marshrutlash protokollari",
    f"""
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>ARP — IP manzildan MAC manzilni topish</li>
  <li>ICMP — xizmat xabarlari, ping va tracert</li>
  <li>DHCP — manzillarni avtomatik taqsimlash</li>
  <li>Marshrutlash va marshrut jadvali</li>
  <li>Statik va dinamik marshrutlash</li>
  <li>RIP, OSPF, BGP</li>
</ol>

<h2>1. ARP</h2>
<p>Kompyuter paketni bir segment ichida yuborish uchun manzilning <b>MAC</b>ini bilishi kerak, lekin unga faqat <b>IP</b> ma'lum. <b>ARP</b> (Address Resolution Protocol) bu muammoni hal qiladi:</p>
<ol>
  <li>Kompyuter avval o'z <b>ARP keshidan</b> qidiradi (<code>arp -a</code>).</li>
  <li>Topilmasa, <b>ARP Request</b> yuboradi — <b>broadcast</b> kadr (FF-FF-FF-FF-FF-FF): "192.168.1.20 kimda? 192.168.1.10 ga ayting".</li>
  <li>Segmentdagi hamma so'rovni oladi, lekin faqat shu IP egasi <b>ARP Reply</b> (unicast) bilan javob beradi: "192.168.1.20 — BB-BB-…".</li>
  <li>Javob keshga yoziladi va keyingi paketlar so'rovsiz yuboriladi.</li>
</ol>
<p>Manzil <b>boshqa tarmoqda</b> bo'lsa, kompyuter manzilning emas, <b>shlyuzning</b> MAC manzilini so'raydi — paket avval marshrutizatorga yuboriladi. ARP autentifikatsiyasiz ishlagani sababli hujumchi soxta javoblar bilan trafikni o'ziga burishi mumkin (ARP spoofing).</p>

<h2>2. ICMP</h2>
<p><b>ICMP</b> (Internet Control Message Protocol) — IP ning yordamchi protokoli: xatolar va diagnostika xabarlarini tashiydi.</p>
<table>
  <tr><th>Tur</th><th>Xabar</th><th>Qachon</th></tr>
  <tr><td>8 / 0</td><td>Echo Request / Echo Reply</td><td><code>ping</code> — manzil javob beradimi</td></tr>
  <tr><td>3</td><td>Destination Unreachable</td><td>Tarmoq, xost yoki port yetib bo'lmaydi</td></tr>
  <tr><td>11</td><td>Time Exceeded</td><td>TTL 0 ga yetdi — <code>tracert</code> shundan foydalanadi</td></tr>
  <tr><td>5</td><td>Redirect</td><td>"Bu manzilga boshqa shlyuz orqali boring"</td></tr>
</table>
<p><code>tracert</code> TTL=1, 2, 3… bilan paketlar yuboradi: har bir marshrutizator TTL ni 0 ga tushirganda Time Exceeded qaytaradi va shu bilan o'zini "ko'rsatadi". Natijada yo'ldagi barcha marshrutizatorlar ro'yxati hosil bo'ladi.</p>

<h2>3. DHCP</h2>
<p><b>DHCP</b> (Dynamic Host Configuration Protocol) kompyuterlarga IP manzil, maska, shlyuz va DNS server manzilini avtomatik beradi. UDP ustida ishlaydi: server — 67-port, mijoz — 68-port. Manzil olish to'rt bosqichli (<b>DORA</b>):</p>
<ol>
  <li><b>Discover</b> — mijoz serverni bilmaydi, broadcast yuboradi (manba 0.0.0.0).</li>
  <li><b>Offer</b> — server bo'sh manzil taklif qiladi.</li>
  <li><b>Request</b> — mijoz taklifni so'raydi (broadcast — boshqa serverlar ham bilsin).</li>
  <li><b>Ack</b> — server tasdiqlaydi.</li>
</ol>
<p>Manzil <b>ijaraga</b> (lease) beriladi. Ijaraning 50% ida (T1) mijoz uni o'z serveridan uzaytirishni so'raydi, 87,5% ida (T2) — istalgan serverdan. Doimiy manzil kerak bo'lgan qurilmalarga (printer, server) MAC bo'yicha <b>zaxira</b> (reservation) qilinadi. DHCP broadcast marshrutizatordan o'tmaydi, shuning uchun boshqa tarmoqdagi server uchun <b>DHCP relay</b> sozlanadi.</p>

<h2>4. Marshrutlash</h2>
<p><b>Marshrutlash</b> — paket uchun manzil tarmog'iga yo'l tanlash. Marshrutizator har paketning manzil IP sini o'z <b>marshrut jadvali</b> bilan solishtiradi. Jadval yozuvi:</p>
<table>
  <tr><th>Tarmoq / prefiks</th><th>Keyingi sakrash (next hop)</th><th>Interfeys</th><th>Metrika</th></tr>
  <tr><td>192.168.1.0/24</td><td>— (to'g'ridan-to'g'ri ulangan)</td><td>Gi0/0</td><td>0</td></tr>
  <tr><td>10.1.0.0/16</td><td>172.16.0.2</td><td>Gi0/1</td><td>20</td></tr>
  <tr><td>0.0.0.0/0</td><td>203.0.113.1</td><td>Gi0/2</td><td>1</td></tr>
</table>
<ul>
  <li>Bir nechta yozuv mos kelsa, <b>eng uzun prefiksli</b> (eng aniq) yozuv tanlanadi.</li>
  <li><code>0.0.0.0/0</code> — <b>sukut marshruti</b>: boshqa hech narsa mos kelmasa (odatda provayderga).</li>
  <li>Marshrutizator butun yo'lni emas, faqat <b>keyingi sakrashni</b> biladi.</li>
</ul>

<h2>5. Statik va dinamik marshrutlash</h2>
<ul>
  <li><b>Statik</b> — administrator marshrutlarni qo'lda kiritadi (<code>ip route 10.1.0.0 255.255.0.0 172.16.0.2</code>). Sodda, resurs talab qilmaydi, lekin tarmoq o'zgarsa avtomatik moslashmaydi. Kichik tarmoqlar va sukut marshruti uchun.</li>
  <li><b>Dinamik</b> — marshrutizatorlar marshrutlash protokollari orqali bir-biriga ma'lumot almashadi va jadvalni o'zi tuzadi; kabel uzilsa yangi yo'l topadi (<b>konvergensiya</b>).</li>
</ul>

<h2>6. Marshrutlash protokollari</h2>
<table>
  <tr><th></th><th>RIP</th><th>OSPF</th><th>BGP</th></tr>
  <tr><td>Turi</td><td>Masofa-vektor</td><td>Kanal holati (link-state)</td><td>Yo'l-vektor</td></tr>
  <tr><td>Algoritm</td><td>Bellman-Ford</td><td>Dijkstra (SPF)</td><td>siyosatlar asosida</td></tr>
  <tr><td>Metrika</td><td>sakrashlar soni (max 15)</td><td>narx (cost) = 10<sup>8</sup> / tezlik</td><td>AS yo'li, atributlar</td></tr>
  <tr><td>Qo'llanilishi</td><td>kichik tarmoqlar</td><td>korporativ tarmoqlar (IGP)</td><td>Internet: avtonom tizimlar orasida (EGP)</td></tr>
</table>
<p><b>Masofa-vektor</b>: har marshrutizator qo'shnilariga o'z jadvalini davriy yuboradi (RIP — har 30 s) — "eshitganini aytib beradi". <b>Kanal holati</b>: har marshrutizator butun tarmoq xaritasini yig'adi va Dijkstra algoritmi bilan eng qisqa yo'llarni o'zi hisoblaydi — tezroq konvergensiya va kanal tezligini hisobga oladi.</p>
<p><b>Dijkstra misoli</b> (simulyatsiyadagi graf): R1 dan R6 gacha eng arzon yo'l — <b>{SPF_PATH}</b>, narxi <b>{SPF_R6}</b>. RIP metrikasi bo'yicha esa R1 → R6 atigi {HOPS_R6} sakrash, lekin u yo'l OSPF narxi bo'yicha qimmatroq — RIP kanal tezligini bilmaydi.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega ARP so'rovi broadcast, javobi esa unicast?</li>
  <li>tracert qanday qilib yo'ldagi marshrutizatorlarni aniqlaydi?</li>
  <li>DORA bosqichlarini tushuntiring.</li>
  <li>Eng uzun prefiks qoidasini misol bilan tushuntiring.</li>
  <li>RIP va OSPF ning asosiy farqi nimada?</li>
</ol>
""",
    [
        S_title("ARP, ICMP, DHCP va marshrutlash", "Tarmoqning yordamchi protokollari", "🧭"),
        S_points("ARP", [("❓", "Request — broadcast: 'IP X kimda?'"), ("🙋", "Reply — unicast: 'X — mening MAC im'"), ("💾", "Javob keshga yoziladi (arp -a)"), ("🚪", "Boshqa tarmoq → shlyuzning MAC i so'raladi")]),
        S_table("ICMP turlari", ["Tur", "Xabar"], [["8 / 0", "Echo Request / Reply (ping)"], ["3", "Destination Unreachable"], ["11", "Time Exceeded (tracert)"]]),
        S_points("DHCP — DORA", [("📢", "Discover"), ("🎁", "Offer"), ("✋", "Request"), ("✅", "Ack")]),
        S_quiz("DHCP serveri qaysi portda ishlaydi?", ["UDP 53", "UDP 67", "TCP 80", "UDP 68"], 1, "Server — 67, mijoz — 68."),
        S_idea("Eng uzun prefiks qoidasi", "10.1.5.77 uchun 10.0.0.0/8, 10.1.0.0/16 va 10.1.5.0/24 mos kelsa — /24 tanlanadi: u eng aniq.", "🎯"),
        S_compare("Statik va dinamik", ("Statik", "Qo'lda. Sodda, lekin o'zgarishga moslashmaydi"), ("Dinamik", "Protokol orqali. Uzilishda o'zi yangi yo'l topadi")),
        S_table("Protokollar", ["", "RIP", "OSPF"], [["Turi", "masofa-vektor", "kanal holati"], ["Algoritm", "Bellman-Ford", "Dijkstra"], ["Metrika", "sakrash (≤15)", "narx = 10⁸/tezlik"]]),
        S_quiz("Qaysi protokol Internetda avtonom tizimlar orasida ishlaydi?", ["RIP", "OSPF", "BGP", "ARP"], 2, "BGP — tashqi marshrutlash protokoli (EGP)."),
        S_summary("Xulosa", ["ARP: IP → MAC", "ICMP: ping, tracert, xato xabarlari", "DHCP: DORA, ijara", "Marshrutizator faqat keyingi sakrashni biladi", "RIP — sakrashlar, OSPF — narx va Dijkstra"]),
    ],
    [
        Q("ARP qanday masalani hal qiladi?", ["Nomni IP ga aylantiradi", "IP manzil bo'yicha MAC manzilni topadi", "IP manzil beradi", "Marshrut tanlaydi"], 1, "Nom → IP — DNS, IP berish — DHCP."),
        Q("ARP so'rovi qanday yuboriladi?", ["Unicast", "Broadcast", "Multicast", "Marshrutizator orqali"], 1, "Kompyuter manzil MAC ini bilmaydi — hammaga so'raydi."),
        Q("ping qaysi protokoldan foydalanadi?", ["TCP", "UDP", "ICMP", "ARP"], 2, "ICMP Echo Request (8) va Echo Reply (0)."),
        Q("DHCP da manzil olish bosqichlarining to'g'ri tartibi?", ["Request, Offer, Discover, Ack", "Discover, Offer, Request, Ack", "Discover, Request, Offer, Ack", "Offer, Discover, Ack, Request"], 1, "DORA: Discover → Offer → Request → Ack."),
        Q("Marshrut jadvalida 0.0.0.0/0 yozuvi nimani bildiradi?", ["Loopback", "Sukut marshruti", "Broadcast", "Xato yozuv"], 1, "Boshqa yozuv mos kelmasa paket shu yo'l bilan ketadi."),
        Q("RIP ning metrikasi qaysi?", ["Kanal tezligi", "Sakrashlar soni", "Kechikish", "Narx (cost)"], 1, "RIP faqat sakrashlarni sanaydi, maksimum 15."),
        Q("OSPF haqida qaysi gaplar to'g'ri?", ["Kanal holati protokoli", "Dijkstra algoritmidan foydalanadi", "Har 30 s da butun jadvalni yuboradi", "Kanal tezligini metrikada hisobga oladi"], [0, 1, 3], "Davriy butun jadval — RIP xususiyati."),
    ],
    [
        answer_task(
            "Dijkstra: eng arzon yo'l",
            "Virtual simulyatsiyadagi grafda (Dijkstra bo'limi, OSPF narxlari) R1 dan R6 gacha eng arzon yo'lni toping.",
            [
                F("Eng arzon yo'l narxi", "number", SPF_R6, reject=["12"]),
                F("R1 ning R6 uchun keyingi sakrashi (next hop)", "choice", SPF_NEXT, options=["R2", "R3", "R4", "R5"]),
                F("RIP (sakrashlar) bo'yicha R1 dan R6 gacha nechta sakrash?", "number", HOPS_R6),
            ],
            hints=["Simulyatsiyada manba R1, manzil R6 ni tanlab, 'Keyingi' bilan qadamma-qadam yuring.", "RIP rejimiga o'tib, sakrashlarni sanang."],
            difficulty="medium",
        ),
        answer_task(
            "Marshrut tanlash",
            "Marshrut jadvali: 0.0.0.0/0 → ISP; 10.0.0.0/8 → R2; 10.1.0.0/16 → R3; 10.1.5.0/24 → R4. Paket qayerga yuboriladi?",
            [
                F("Manzil 10.1.5.77", "choice", "R4", options=["ISP", "R2", "R3", "R4"]),
                F("Manzil 10.1.200.3", "choice", "R3", options=["ISP", "R2", "R3", "R4"]),
                F("Manzil 10.250.0.1", "choice", "R2", options=["ISP", "R2", "R3", "R4"]),
                F("Manzil 8.8.8.8", "choice", "ISP", options=["ISP", "R2", "R3", "R4"]),
            ],
            hints=["Mos keladigan yozuvlardan prefiksi eng uzunini tanlang."],
        ),
        answer_task(
            "DHCP ijarasi",
            "DHCP server manzilni 8 soatga ijaraga berdi.",
            [
                F("Mijoz ijarani necha soatdan keyin uzaytirishni so'raydi (T1)?", "number", 4, unit="soat"),
                F("T2 necha soatdan keyin? (ijaraning 87,5%)", "number", 7, unit="soat"),
                F("DHCP mijozi qaysi UDP portdan foydalanadi?", "number", 68),
            ],
        ),
    ],
)

# ======================================================================
# 9-MA'RUZA
# ======================================================================
M09 = T(
    "kt-m09-transport",
    "9-ma'ruza: Transport pog'onasining vazifalari. TCP va UDP protokollari. Soketlar",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Transport pog'onasining vazifalari</li>
  <li>Portlar va multipleksatsiya</li>
  <li>TCP: ulanish, ishonchlilik, oqimni boshqarish</li>
  <li>UDP</li>
  <li>Soketlar tushunchasi</li>
</ol>

<h2>1. Vazifalar</h2>
<p>IP paketni <b>kompyuterga</b> yetkazadi, lekin kompyuterda bir vaqtda o'nlab dastur ishlaydi: brauzer, messenjer, pochta. Transport pog'onasi ma'lumotni kerakli <b>jarayonga</b> (dasturga) yetkazadi va qo'shimcha ravishda:</p>
<ul>
  <li>ma'lumotni segmentlarga bo'ladi va qabul qiluvchida qayta yig'adi;</li>
  <li>(TCP da) yetkazilishni kafolatlaydi, tartibni tiklaydi, yo'qolganini qayta yuboradi;</li>
  <li>(TCP da) qabul qiluvchi ulgurmasa yuborishni sekinlashtiradi (<b>oqimni boshqarish</b>) va tarmoq tirbandligiga moslashadi (<b>tirbandlikni boshqarish</b>).</li>
</ul>

<h2>2. Portlar</h2>
<p><b>Port</b> — kompyuterdagi jarayonni bildiruvchi 16 bitli raqam (0–65535).</p>
<table>
  <tr><th>Oraliq</th><th>Nomi</th><th>Misollar</th></tr>
  <tr><td>0–1023</td><td>Taniqli (well-known)</td><td>22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS</td></tr>
  <tr><td>1024–49151</td><td>Ro'yxatdan o'tgan (registered)</td><td>3306 MySQL, 3389 RDP, 5432 PostgreSQL</td></tr>
  <tr><td>49152–65535</td><td>Dinamik (vaqtinchalik)</td><td>Mijoz tomonida OT tasodifan beradi</td></tr>
</table>
<p>Ulanish beshta qiymat bilan bir ma'noli aniqlanadi: <b>protokol, manba IP, manba port, manzil IP, manzil port</b>. Shu tufayli bitta kompyuterdan bitta serverning 443-portiga bir nechta brauzer tabi bir vaqtda ulana oladi — ularning manba portlari har xil.</p>

<h2>3. TCP</h2>
<p><b>TCP</b> (Transmission Control Protocol) — <b>ulanishga yo'naltirilgan</b>, <b>ishonchli</b>, bayt oqimi protokoli. Sarlavhasi kamida 20 bayt: manba va manzil portlari, tartib raqami (sequence), tasdiq raqami (acknowledgment), bayroqlar, oyna o'lchami, nazorat yig'indisi.</p>
<h3>3.1. Uch bosqichli ulanish</h3>
<pre><code>Mijoz                         Server
  | --- SYN, seq=x -----------> |
  | <-- SYN+ACK, seq=y, ack=x+1 |
  | --- ACK, ack=y+1 ---------> |   ulanish o'rnatildi</code></pre>
<p>Har tomon o'zining boshlang'ich tartib raqamini (ISN) aytadi va qarshi tomonnikini tasdiqlaydi. Ulanish yopilishi FIN va ACK almashinuvi bilan bajariladi; favqulodda uzish — RST bayrog'i.</p>
<h3>3.2. Ishonchlilik</h3>
<p>Tartib raqami — segmentdagi birinchi baytning raqami. Tasdiq raqami — "shu raqamgacha hammasini oldim, keyingisini kutyapman". Masalan, seq=1001 va 500 bayt yuborilsa, qabul qiluvchi <b>ack=1501</b> qaytaradi. Tasdiq kelmasa, yuboruvchi taymer tugagach segmentni <b>qayta yuboradi</b>. Qabul qiluvchi tartibsiz kelgan segmentlarni tartiblab, dasturga uzluksiz oqim beradi.</p>
<h3>3.3. Oqim va tirbandlikni boshqarish</h3>
<p><b>Sirpanuvchi oyna</b> (sliding window): yuboruvchi tasdiqni kutmasdan bir nechta segment yuborishi mumkin — oyna o'lchamigacha. Qabul qiluvchi sarlavhadagi <b>Window</b> maydonida qancha joyi borligini aytadi. Oyna kichik bo'lsa, tezlik cheklanadi: maksimal o'tkazuvchanlik ≈ oyna ÷ RTT. Tarmoq tirbandligiga moslashish uchun TCP "sekin start" bilan boshlaydi va yo'qotish sezilganda tezlikni kamaytiradi.</p>
<p>TCP bayroqlari: <b>SYN</b> (ulanish), <b>ACK</b> (tasdiq), <b>FIN</b> (yopish), <b>RST</b> (uzish), <b>PSH</b> (darhol uzat), <b>URG</b> (shoshilinch).</p>

<h2>4. UDP</h2>
<p><b>UDP</b> (User Datagram Protocol) — <b>ulanishsiz</b>, kafolatsiz va juda sodda: sarlavhasi atigi 8 bayt (manba port, manzil port, uzunlik, nazorat yig'indisi). Ulanish o'rnatish, tasdiq, qayta yuborish yo'q — shuning uchun kechikish minimal.</p>
<table>
  <tr><th></th><th>TCP</th><th>UDP</th></tr>
  <tr><td>Ulanish</td><td>bor (3 bosqich)</td><td>yo'q</td></tr>
  <tr><td>Yetkazish kafolati, tartib</td><td>bor</td><td>yo'q</td></tr>
  <tr><td>Sarlavha</td><td>≥ 20 bayt</td><td>8 bayt</td></tr>
  <tr><td>Tezlik / kechikish</td><td>sekinroq</td><td>tez</td></tr>
  <tr><td>Qo'llanilishi</td><td>veb, pochta, fayl, SSH</td><td>DNS, DHCP, VoIP, video, o'yinlar</td></tr>
</table>
<p>Zamonaviy HTTP/3 UDP ustidagi QUIC protokolida ishlaydi — ishonchlilik dastur darajasida, tezroq ulanish bilan.</p>

<h2>5. Soketlar</h2>
<p><b>Soket</b> — dastur va transport pog'onasi o'rtasidagi dasturiy interfeysning (API) oxirgi nuqtasi; uni "IP manzil + port" deb tasavvur qilish mumkin. Berkeley soketlari API si deyarli barcha OT va tillarda bir xil:</p>
<table>
  <tr><th>Server</th><th>Mijoz</th></tr>
  <tr><td><code>socket()</code> — soket yaratish</td><td><code>socket()</code></td></tr>
  <tr><td><code>bind(ip, port)</code> — manzilga bog'lash</td><td>—</td></tr>
  <tr><td><code>listen()</code> — ulanishlarni kutish</td><td>—</td></tr>
  <tr><td><code>accept()</code> — ulanishni qabul qilish (yangi soket)</td><td><code>connect(ip, port)</code></td></tr>
  <tr><td><code>recv() / send()</code></td><td><code>send() / recv()</code></td></tr>
  <tr><td><code>close()</code></td><td><code>close()</code></td></tr>
</table>
<p>TCP soketi — <code>SOCK_STREAM</code>, UDP soketi — <code>SOCK_DGRAM</code>. UDP da <code>listen/accept/connect</code> shart emas: <code>sendto()</code> va <code>recvfrom()</code> ishlatiladi. Laboratoriya ishida Python'da shunday server va mijoz yoziladi.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega faqat IP manzil yetarli emas va port nimaga kerak?</li>
  <li>Uch bosqichli ulanishni chizib tushuntiring.</li>
  <li>seq=5000 bilan 1200 bayt yuborildi. Tasdiq raqami qanday bo'ladi?</li>
  <li>Qaysi xizmatlar uchun UDP afzal va nima uchun?</li>
  <li>Server soketida <code>accept()</code> nima qaytaradi?</li>
</ol>
""",
    [
        S_title("Transport pog'onasi", "TCP, UDP va soketlar", "🚚"),
        S_idea("Port nimaga kerak?", "IP kompyuterga yetkazadi, port — kompyuterdagi aniq dasturga. Ulanish = protokol + 2 IP + 2 port.", "🚪"),
        S_table("Port oraliqlari", ["Oraliq", "Turi"], [["0–1023", "Taniqli (80, 443, 53, 22)"], ["1024–49151", "Ro'yxatdan o'tgan"], ["49152–65535", "Dinamik (mijoz)"]]),
        S_code("Uch bosqichli ulanish", "→ SYN       seq=x\n← SYN+ACK   seq=y, ack=x+1\n→ ACK       ack=y+1", note="Shundan keyingina ma'lumot yuboriladi"),
        S_quiz("seq=1001, 500 bayt yuborildi. Qabul qiluvchi qanday ack qaytaradi?", ["1001", "1500", "1501", "500"], 2, "Keyingi kutilayotgan bayt raqami: 1001 + 500 = 1501."),
        S_compare("TCP va UDP", ("TCP", "Ulanish, kafolat, tartib, qayta yuborish. Veb, pochta, fayl"), ("UDP", "Ulanishsiz, 8 bayt sarlavha, tez. DNS, VoIP, o'yinlar")),
        S_idea("Oyna va tezlik", "Maksimal o'tkazuvchanlik ≈ oyna ÷ RTT. 64 KB oyna va 100 ms RTT bilan ~5,2 Mbit/s dan oshmaydi.", "🪟"),
        S_code("Soket (Python)", "import socket\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.bind(('127.0.0.1', 5000))\ns.listen()\nconn, addr = s.accept()", note="Mijoz: s.connect(('127.0.0.1', 5000))"),
        S_quiz("Qaysi xizmatga UDP mos?", ["Faylni yuklab olish", "Video qo'ng'iroq", "Elektron pochta", "Veb-sahifa (HTTP/1.1)"], 1, "Eskirgan video kadrni qayta yuborishdan foyda yo'q — kechikish muhimroq."),
        S_summary("Xulosa", ["Port — jarayon manzili", "TCP: SYN/SYN-ACK/ACK, seq/ack, oyna", "UDP: tez, sodda, kafolatsiz", "Soket API: socket, bind, listen, accept, connect"]),
    ],
    [
        Q("Port raqami necha bitli?", ["8", "16", "32", "48"], 1, "0–65535 oralig'i — 16 bit."),
        Q("HTTPS ning standart porti?", ["80", "443", "8080", "22"], 1, "HTTP — 80, HTTPS — 443."),
        Q("TCP ulanishining birinchi segmentida qaysi bayroq bo'ladi?", ["ACK", "FIN", "SYN", "RST"], 2, "SYN — sinxronizatsiya, ulanish so'rovi."),
        Q("UDP sarlavhasi necha bayt?", ["4", "8", "20", "40"], 1, "Manba port, manzil port, uzunlik, nazorat yig'indisi — 4 × 2 bayt."),
        Q("TCP oqimni boshqarishda qaysi maydondan foydalanadi?", ["TTL", "Window", "Checksum", "Protocol"], 1, "Window — qabul qiluvchida qancha bo'sh joy borligi."),
        Q("Qaysilar TCP ga xos?", ["Uch bosqichli ulanish", "Yo'qolgan segmentni qayta yuborish", "8 baytli sarlavha", "Tartibni tiklash"], [0, 1, 3], "8 baytli sarlavha — UDP."),
        Q("Python'da TCP soket qanday yaratiladi?", ["socket(AF_INET, SOCK_DGRAM)", "socket(AF_INET, SOCK_STREAM)", "socket(AF_UNIX, SOCK_RAW)", "socket.tcp()"], 1, "SOCK_STREAM — TCP, SOCK_DGRAM — UDP."),
    ],
    [
        answer_task(
            "Tartib va tasdiq raqamlari",
            "Mijoz ulanishdan keyin seq=1001 dan boshlab ketma-ket uchta segment yuboradi: 500, 500 va 300 bayt.",
            [
                F("Birinchi segmentdan keyin server qaytargan ack", "number", 1501),
                F("Uchinchi segmentning seq raqami", "number", 2001),
                F("Barcha segmentlardan keyingi ack", "number", 2301),
            ],
            hints=["ack = seq + segment hajmi.", "Ikkinchi segment seq=1501 dan boshlanadi."],
            difficulty="medium",
        ),
        answer_task(
            "Oyna va o'tkazuvchanlik",
            "TCP oyna o'lchami 64 000 bayt, RTT = 100 ms. Maksimal o'tkazuvchanlikni toping (oyna ÷ RTT).",
            [
                F("Bayt/s", "number", 640000, unit="B/s"),
                F("Mbit/s", "number", 5.12, tol=0.01, unit="Mbit/s"),
            ],
            hints=["64 000 bayt ÷ 0,1 s = ? bayt/s", "Bitga o'tkazing (× 8) va 10⁶ ga bo'ling."],
            difficulty="medium",
        ),
        code_task(
            "TCP bayroqlari",
            "TCP sarlavhasidagi bayroqlar baytining qiymati (0–63) kiritiladi. Bitlar: FIN=1, SYN=2, RST=4, PSH=8, ACK=16, URG=32.\nO'rnatilgan bayroqlar nomlarini shu tartibda (FIN, SYN, RST, PSH, ACK, URG) bo'sh joy bilan chiqaring. Hech biri bo'lmasa — chiziqcha (-).\nMasalan: 18 → SYN ACK",
            "n = int(input())\nnomlar = ['FIN', 'SYN', 'RST', 'PSH', 'ACK', 'URG']\n# Kodingizni shu yerga yozing\n",
            "n = int(input())\nnomlar = ['FIN', 'SYN', 'RST', 'PSH', 'ACK', 'URG']\nr = [nomlar[i] for i in range(6) if n & (1 << i)]\nprint(' '.join(r) if r else '-')",
            [("18", "SYN ACK"), ("2", "SYN"), ("17", "FIN ACK"), ("24", "PSH ACK"), ("0", "-"), ("4", "RST")],
            hints=["i-bit o'rnatilganini tekshirish: n & (1 << i).", "Ro'yxat bo'sh bo'lsa '-' chiqaring."],
            difficulty="medium",
        ),
    ],
)

# ======================================================================
# 10-MA'RUZA
# ======================================================================
M10 = T(
    "kt-m10-amaliy-pogona",
    "10-ma'ruza: Amaliy pog'ona protokollari va xizmatlari. Veb-server, HTTP, FTP, elektron pochta",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Amaliy pog'ona va mijoz-server modeli</li>
  <li>URL tuzilishi</li>
  <li>HTTP protokoli</li>
  <li>Veb-server xizmati</li>
  <li>FTP</li>
  <li>Elektron pochta: SMTP, POP3, IMAP</li>
  <li>Boshqa amaliy protokollar</li>
</ol>

<h2>1. Amaliy pog'ona</h2>
<p>Amaliy pog'ona protokollari foydalanuvchi dasturlari "gaplashadigan" tilni belgilaydi: so'rov va javob formati, buyruqlar, holat kodlari. Ko'pchiligi <b>mijoz-server</b> modelida ishlaydi: server taniqli portda kutadi, mijoz so'rov yuboradi.</p>

<h2>2. URL</h2>
<pre><code>https://www.miracademy.uz:443/explore/courses?q=tarmoq#natijalar
└─┬─┘   └───────┬───────┘└┬┘└──────┬───────┘└──┬───┘└───┬────┘
sxema         xost      port     yo'l         so'rov   fragment</code></pre>
<p>Port ko'rsatilmasa sxemaning standart porti olinadi (http — 80, https — 443). Fragment serverga yuborilmaydi — brauzer sahifa ichidagi joyga o'tish uchun ishlatadi.</p>

<h2>3. HTTP</h2>
<p><b>HTTP</b> (HyperText Transfer Protocol) — veb-sahifa va resurslarni uzatish protokoli. Matnli, <b>holatsiz</b> (stateless): har so'rov mustaqil; foydalanuvchini "eslab qolish" uchun <b>cookie</b> ishlatiladi.</p>
<h3>So'rov</h3>
<pre><code>GET /explore/courses HTTP/1.1
Host: www.miracademy.uz
User-Agent: Mozilla/5.0
Accept: text/html</code></pre>
<p>Usullar: <b>GET</b> — resursni olish, <b>POST</b> — ma'lumot yuborish (forma), <b>PUT</b> — almashtirish, <b>DELETE</b> — o'chirish, <b>HEAD</b> — faqat sarlavhalar.</p>
<h3>Javob holat kodlari</h3>
<table>
  <tr><th>Sinf</th><th>Ma'nosi</th><th>Misollar</th></tr>
  <tr><td>1xx</td><td>Ma'lumot</td><td>101 Switching Protocols</td></tr>
  <tr><td>2xx</td><td>Muvaffaqiyat</td><td>200 OK, 201 Created, 204 No Content</td></tr>
  <tr><td>3xx</td><td>Yo'naltirish</td><td>301 Moved Permanently, 302 Found, 304 Not Modified</td></tr>
  <tr><td>4xx</td><td>Mijoz xatosi</td><td>400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found</td></tr>
  <tr><td>5xx</td><td>Server xatosi</td><td>500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable</td></tr>
</table>
<h3>Versiyalar va HTTPS</h3>
<ul>
  <li><b>HTTP/1.1</b> — doimiy ulanish (keep-alive), bitta TCP ulanishda ketma-ket so'rovlar.</li>
  <li><b>HTTP/2</b> — bitta ulanishda parallel oqimlar, ikkilik format, sarlavhalarni siqish.</li>
  <li><b>HTTP/3</b> — UDP ustidagi QUIC da.</li>
  <li><b>HTTPS</b> = HTTP + <b>TLS</b> shifrlash, port 443. Sertifikat server haqiqiyligini tasdiqlaydi. Bugun deyarli barcha saytlar HTTPS da.</li>
</ul>

<h2>4. Veb-server xizmati</h2>
<p><b>Veb-server</b> — HTTP so'rovlarini qabul qilib, fayllar (HTML, CSS, rasm) yoki dastur natijasini qaytaradigan dastur: Apache, Nginx, Microsoft IIS. Asosiy tushunchalar:</p>
<ul>
  <li><b>Ildiz papka</b> (document root) — saytning fayllari (IIS da <code>C:\\inetpub\\wwwroot</code>).</li>
  <li><b>Statik</b> kontent — fayl o'zgarishsiz beriladi; <b>dinamik</b> — har so'rovda dastur (PHP, Python, Node.js, ASP.NET) yaratadi.</li>
  <li><b>Virtual xostlar</b> — bitta serverda bir nechta sayt: <code>Host</code> sarlavhasiga qarab ajratiladi.</li>
  <li><b>Bog'lash</b> (binding) — sayt qaysi IP, port va domen nomida eshitadi.</li>
</ul>

<h2>5. FTP</h2>
<p><b>FTP</b> (File Transfer Protocol) — fayl almashish. Ikki ulanish ishlatadi: <b>boshqaruv</b> (TCP 21) va har fayl uchun alohida <b>ma'lumot</b> ulanishi (faol rejimda serverning 20-portidan, passiv rejimda server ochgan vaqtinchalik portga). Buyruqlar: <code>USER</code>, <code>PASS</code>, <code>LIST</code>, <code>RETR</code> (yuklab olish), <code>STOR</code> (yuklash), <code>QUIT</code>. Oddiy FTP login va parolni <b>ochiq matnda</b> uzatadi, shuning uchun <b>SFTP</b> (SSH ustida, port 22) yoki <b>FTPS</b> (TLS bilan) ishlatish kerak.</p>

<h2>6. Elektron pochta</h2>
<table>
  <tr><th>Protokol</th><th>Vazifasi</th><th>Port</th></tr>
  <tr><td><b>SMTP</b></td><td>Xatni yuborish: mijoz → server (587) va server → server (25)</td><td>25, 587, 465</td></tr>
  <tr><td><b>POP3</b></td><td>Xatni serverdan yuklab olish (odatda serverdan o'chiriladi)</td><td>110, 995 (TLS)</td></tr>
  <tr><td><b>IMAP</b></td><td>Xatlar serverda qoladi, papkalar va holatlar sinxronlanadi</td><td>143, 993 (TLS)</td></tr>
</table>
<p>Xat yo'li: foydalanuvchi dasturi (MUA) → o'z SMTP serveri → DNS dan qabul qiluvchi domenning <b>MX</b> yozuvi → qabul qiluvchi pochta serveri → qabul qiluvchi IMAP/POP3 bilan o'qiydi. Rasm va fayllar xatga <b>MIME</b> formatida biriktiriladi.</p>

<h2>7. Boshqa protokollar</h2>
<table>
  <tr><th>Protokol</th><th>Port</th><th>Vazifasi</th></tr>
  <tr><td>SSH</td><td>22</td><td>Shifrlangan masofaviy terminal</td></tr>
  <tr><td>Telnet</td><td>23</td><td>Masofaviy terminal (shifrlanmagan — eskirgan)</td></tr>
  <tr><td>DNS</td><td>53</td><td>Nomni IP ga aylantirish (keyingi ma'ruza)</td></tr>
  <tr><td>SNMP</td><td>161</td><td>Tarmoq qurilmalarini monitoring qilish</td></tr>
  <tr><td>RDP</td><td>3389</td><td>Windows masofaviy ish stoli</td></tr>
</table>

<h2>Nazorat savollari</h2>
<ol>
  <li>URL qanday qismlardan iborat?</li>
  <li>GET va POST farqi nimada?</li>
  <li>404 va 500 kodlari kimning xatosini bildiradi?</li>
  <li>Nega oddiy FTP xavfsiz emas?</li>
  <li>POP3 va IMAP ning farqini tushuntiring.</li>
</ol>
""",
    [
        S_title("Amaliy pog'ona", "HTTP, FTP, pochta", "📬"),
        S_code("URL tuzilishi", "https://www.miracademy.uz:443/explore/courses?q=tarmoq#natijalar\nsxema   xost              port yo'l             so'rov   fragment"),
        S_code("HTTP so'rovi", "GET /explore/courses HTTP/1.1\nHost: www.miracademy.uz\nAccept: text/html", output="HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8"),
        S_table("Holat kodlari", ["Sinf", "Ma'nosi", "Misol"], [["2xx", "Muvaffaqiyat", "200"], ["3xx", "Yo'naltirish", "301, 304"], ["4xx", "Mijoz xatosi", "403, 404"], ["5xx", "Server xatosi", "500, 503"]]),
        S_quiz("Fayl o'zgarmagan, brauzer keshdagisini ishlatsin. Server qanday kod qaytaradi?", ["200", "301", "304", "404"], 2, "304 Not Modified — tana yuborilmaydi."),
        S_points("HTTP versiyalari", [("1️⃣", "HTTP/1.1 — keep-alive"), ("2️⃣", "HTTP/2 — parallel oqimlar"), ("3️⃣", "HTTP/3 — QUIC (UDP)"), ("🔒", "HTTPS = HTTP + TLS, port 443")]),
        S_compare("FTP", ("Oddiy FTP (21)", "Login va parol ochiq matnda"), ("SFTP / FTPS", "SSH yoki TLS bilan shifrlangan")),
        S_table("Pochta protokollari", ["Protokol", "Vazifa", "Port"], [["SMTP", "Yuborish", "25, 587"], ["POP3", "Yuklab olish", "110, 995"], ["IMAP", "Serverda sinxron", "143, 993"]]),
        S_quiz("Xatlar telefon va kompyuterda bir xil ko'rinishi uchun qaysi protokol kerak?", ["SMTP", "POP3", "IMAP", "FTP"], 2, "IMAP xatlarni serverda saqlaydi va holatni sinxronlaydi."),
        S_summary("Xulosa", ["HTTP — holatsiz so'rov-javob, kodlar 1xx–5xx", "HTTPS — TLS bilan shifrlangan", "FTP — 2 ulanish, SFTP/FTPS ishlating", "SMTP yuboradi, POP3/IMAP o'qiydi"]),
    ],
    [
        Q("HTTP ning standart porti?", ["21", "25", "80", "443"], 2, "HTTPS — 443."),
        Q("Formadagi ma'lumotni serverga yuborish uchun odatda qaysi usul ishlatiladi?", ["GET", "POST", "HEAD", "DELETE"], 1, "POST da ma'lumot so'rov tanasida yuboriladi."),
        Q("403 kodi nimani bildiradi?", ["Sahifa topilmadi", "Kirish taqiqlangan", "Server xatosi", "Yo'naltirish"], 1, "403 Forbidden — resurs bor, lekin ruxsat yo'q."),
        Q("FTP boshqaruv ulanishi qaysi portda?", ["20", "21", "22", "23"], 1, "Ma'lumot ulanishi faol rejimda 20-portdan."),
        Q("Xatni yuborish uchun qaysi protokol ishlatiladi?", ["IMAP", "POP3", "SMTP", "SNMP"], 2, "SMTP — Simple Mail Transfer Protocol."),
        Q("HTTP haqida qaysi gaplar to'g'ri?", ["Holatsiz protokol", "Foydalanuvchini eslash uchun cookie ishlatiladi", "UDP 53-portda ishlaydi", "HTTPS da TLS bilan shifrlanadi"], [0, 1, 3], "UDP 53 — DNS."),
    ],
    [
        answer_task(
            "URL ni tahlil qiling",
            "URL: https://kutubxona.edu.uz:8443/kitoblar/qidiruv?muallif=tanenbaum#natija",
            [
                F("Sxema", "text", "https"),
                F("Xost", "text", "kutubxona.edu.uz"),
                F("Port", "number", 8443),
                F("Yo'l", "text", "/kitoblar/qidiruv"),
                F("Serverga yuborilmaydigan qism (# dan keyin)", "text", ["natija", "#natija"]),
            ],
        ),
        answer_task(
            "Holat kodlari va portlar",
            "Vaziyatga mos qiymatni kiriting.",
            [
                F("Sahifa topilmadi — holat kodi", "number", 404),
                F("Sahifa butunlay yangi manzilga ko'chdi — holat kodi", "number", 301),
                F("Serverda dastur xatosi — holat kodi", "number", 500),
                F("Xatni IMAP orqali TLS bilan o'qish porti", "number", 993),
                F("SFTP porti", "number", 22),
            ],
        ),
    ],
)

TOPICS = [M06, M07, M08, M09, M10]
