"""Amaliy mashg'ulotlar 6–10. Barcha manzil javoblari `ipaddress` bilan hisoblanadi."""

import heapq
import ipaddress as ipa

from kt import (T, Q, F, answer_task, code_task, S_title, S_idea, S_points, S_table, S_compare, S_code, S_quiz,
                S_summary, net_of, hosts_count, mask_of, first_host, last_host, to_bin)


def subnets(base: str, new_prefix: int) -> list[ipa.IPv4Network]:
    return list(ipa.IPv4Network(base).subnets(new_prefix=new_prefix))


def prefix_for_hosts(h: int) -> int:
    p = 30
    while 2 ** (32 - p) - 2 < h:
        p -= 1
    return p


def vlsm(base: str, needs: list[tuple[str, int]]):
    """Simulyatordagi algoritm bilan bir xil: kattadan kichikka, blok o'lchamiga tekislash."""
    net = ipa.IPv4Network(base)
    cur = int(net.network_address)
    out = []
    for name, h in sorted(needs, key=lambda x: -x[1]):
        p = prefix_for_hosts(h)
        size = 2 ** (32 - p)
        if cur % size:
            cur = (cur // size + 1) * size
        n = ipa.IPv4Network((cur, p))
        assert n.subnet_of(net), "joy yetmadi"
        out.append((name, h, n))
        cur += size
    return out


# ======================================================================
# 6-AMALIY
# ======================================================================
A06 = T(
    "kt-a06-ethernet-kadr",
    "6-amaliy mashg'ulot: Ethernet kadri va MAC manzillarni tahlil qilish",
    """
<h2>Mashg'ulot maqsadi</h2>
<p>Ethernet kadr sarlavhasini baytlardan o'qish, MAC manzil turini aniqlash va kommutator MAC jadvalini qadamma-qadam to'ldirish.</p>

<h2>1. MAC manzilni tahlil qilish</h2>
<p>Birinchi baytning ikkita kichik biti muhim:</p>
<table>
  <tr><th>Bit</th><th>0</th><th>1</th></tr>
  <tr><td>b0 (I/G)</td><td>yakka (unicast)</td><td>guruh (multicast / broadcast)</td></tr>
  <tr><td>b1 (U/L)</td><td>global (zavod beradi)</td><td>lokal berilgan</td></tr>
</table>
<h3>Namuna</h3>
<pre><code>01-00-5E-00-00-FB   1-bayt 0x01 = 0000 0001  → b0 = 1 → multicast
02-42-AC-11-00-02   1-bayt 0x02 = 0000 0010  → b0 = 0, b1 = 1 → unicast, lokal (Docker konteyneri)
D4-5D-64-A2-19-7C   1-bayt 0xD4 = 1101 0100  → b0 = 0, b1 = 0 → unicast, global; OUI = D4-5D-64</code></pre>

<h2>2. Kadrni baytlardan o'qish</h2>
<pre><code>ff ff ff ff ff ff  d4 5d 64 a2 19 7c  08 06  00 01 08 00 …
└── manzil MAC ──┘ └── manba MAC ──┘ └type┘ └ ma'lumot</code></pre>
<p>Manzil — broadcast, manba — D4-5D-64-A2-19-7C, EtherType 0x0806 — <b>ARP</b>. Agar 08 00 bo'lsa — IPv4, 86 dd — IPv6.</p>

<h2>3. Kommutator MAC jadvali</h2>
<p><i>4 portli kommutator. A — 1-port, B — 2-port, C — 3-port, D — 4-port. Jadval bo'sh.</i></p>
<table>
  <tr><th>Kadr</th><th>Jadvalga yoziladi</th><th>Qaror</th></tr>
  <tr><td>A → C</td><td>A — 1</td><td>C noma'lum → 2, 3, 4-portlarga (flooding)</td></tr>
  <tr><td>C → A</td><td>C — 3</td><td>A ma'lum → faqat 1-port</td></tr>
  <tr><td>B → broadcast</td><td>B — 2</td><td>Broadcast → 1, 3, 4-portlarga</td></tr>
  <tr><td>A → B</td><td>(A allaqachon bor)</td><td>B ma'lum → faqat 2-port</td></tr>
</table>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi paket tahlilchisida 3–4-paketlarni (ARP) tanlang: manba va manzil MAC, EtherType ni yozib oling.</li>
  <li>Pastdagi MAC tahlili blokida unicast/multicast va global/lokal belgilarini tekshiring.</li>
  <li>Filtrga <code>eth.addr == ff:ff:ff:ff:ff:ff</code> yozib, broadcast kadrlarni ajrating.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("Ethernet kadri tahlili", "6-amaliy mashg'ulot", "🔍"),
        S_table("Birinchi bayt bitlari", ["Bit", "0", "1"], [["I/G (b0)", "unicast", "multicast"], ["U/L (b1)", "global", "lokal"]]),
        S_code("Sarlavhani o'qish", "ff ff ff ff ff ff | d4 5d 64 a2 19 7c | 08 06\nmanzil (broadcast) | manba            | ARP"),
        S_table("EtherType", ["Qiymat", "Protokol"], [["0x0800", "IPv4"], ["0x0806", "ARP"], ["0x86DD", "IPv6"]]),
        S_quiz("01-00-5E-7F-00-01 qanday manzil?", ["Unicast", "Multicast", "Broadcast", "Lokal unicast"], 1, "Birinchi bayt 0x01 — I/G bit 1."),
        S_points("Switch qoidasi", [("📝", "Manba MAC → jadval"), ("🎯", "Manzil ma'lum → bitta port"), ("📢", "Noma'lum yoki broadcast → qolgan hamma port")]),
        S_quiz("Bo'sh jadval: A→C, keyin C→A. Ikkinchi kadr nechta portga yuboriladi?", ["1", "2", "3", "4"], 0, "Birinchi kadrda A o'rganilgan — faqat 1-port."),
        S_summary("Xulosa", ["b0 — unicast/multicast, b1 — global/lokal", "EtherType — ichidagi protokol", "Jadval manba MAC dan to'ladi"]),
    ],
    [
        Q("D4-5D-64-A2-19-7C manzilning OUI qismi?", ["D4-5D-64", "A2-19-7C", "D4-5D", "64-A2-19"], 0, "Birinchi 3 bayt."),
        Q("02-42-AC-11-00-02 qanday manzil?", ["Global multicast", "Lokal berilgan unicast", "Broadcast", "Global unicast"], 1, "0x02: b0 = 0 (unicast), b1 = 1 (lokal)."),
        Q("EtherType 0x86DD?", ["IPv4", "ARP", "IPv6", "VLAN"], 2, "IPv6."),
        Q("Kommutator jadvalga qaysi manzilni yozadi?", ["Manzil MAC", "Manba MAC", "Manba IP", "Manzil IP"], 1, "O'rganish manba manzildan."),
        Q("Broadcast kadrni kommutator qayerga yuboradi?", ["Hech qayerga", "Kelgan portdan tashqari hamma portga", "Faqat 1-portga", "Marshrutizatorga"], 1, "Broadcast domeni butun kommutator."),
        Q("Qaysi manzillar guruh (multicast/broadcast) manzili?", ["FF-FF-FF-FF-FF-FF", "01-00-5E-00-00-01", "00-1A-2B-3C-4D-5E", "33-33-00-00-00-01"], [0, 1, 3], "0x33 = 0011 0011 — b0 = 1 (IPv6 multicast)."),
    ],
    [
        answer_task(
            "Sarlavhani o'qing",
            "Kadr boshidagi baytlar: 3c 84 6a 11 0f 20 d4 5d 64 a2 19 7c 08 00",
            [
                F("Manzil MAC (xx-xx-… ko'rinishida)", "text", ["3C-84-6A-11-0F-20", "3c:84:6a:11:0f:20", "3c-84-6a-11-0f-20"]),
                F("Manba MAC ning OUI qismi", "text", ["D4-5D-64", "d4:5d:64"]),
                F("Ichidagi protokol", "choice", "IPv4", options=["IPv4", "ARP", "IPv6"]),
                F("Manzil MAC turi", "choice", "unicast", options=["unicast", "multicast", "broadcast"]),
            ],
            hints=["Birinchi 6 bayt — manzil, keyingi 6 — manba, keyin 2 bayt EtherType."],
        ),
        answer_task(
            "MAC jadvalini to'ldiring",
            "4 portli kommutator, jadval bo'sh. A — 1, B — 2, C — 3, D — 4-portda. Ketma-ket kadrlar: (1) B→D, (2) D→B, (3) A→D, (4) C→A.",
            [
                F("(1) kadr nechta portga yuboriladi?", "number", 3),
                F("(2) kadr nechta portga yuboriladi?", "number", 1),
                F("(3) kadr nechta portga yuboriladi?", "number", 1),
                F("(4) kadrdan keyin jadvalda nechta yozuv bor?", "number", 4),
            ],
            hints=["Har kadrda avval manba yoziladi, keyin manzil qidiriladi.", "(3) da D allaqachon (2) dan ma'lum."],
            difficulty="medium",
        ),
        code_task(
            "MAC manzil turi",
            "MAC manzil kiritiladi (ajratuvchi '-' yoki ':'). Ikki qatorda chiqaring:\n1) OUI — katta harflar, '-' bilan (masalan D4-5D-64);\n2) turi: 'broadcast' (hammasi FF), aks holda 'multicast' yoki 'unicast', bo'sh joy va 'global' yoki 'lokal'.\nMasalan: 02:42:ac:11:00:02 → 02-42-AC va unicast lokal",
            "mac = input().strip()\n# Kodingizni shu yerga yozing\n",
            "mac = input().strip().replace(':', '-').upper()\nb = mac.split('-')\nprint('-'.join(b[:3]))\nif all(x == 'FF' for x in b):\n    print('broadcast')\nelse:\n    f = int(b[0], 16)\n    t = 'multicast' if f & 1 else 'unicast'\n    s = 'lokal' if f & 2 else 'global'\n    print(t + ' ' + s)",
            [("02:42:ac:11:00:02", "02-42-AC\nunicast lokal"), ("D4-5D-64-A2-19-7C", "D4-5D-64\nunicast global"),
             ("ff:ff:ff:ff:ff:ff", "FF-FF-FF\nbroadcast"), ("01-00-5E-00-00-FB", "01-00-5E\nmulticast global"), ("33:33:00:00:00:01", None)],
            hints=["int('d4', 16) — o'n oltilikdan songa.", "f & 1 — I/G bit, f & 2 — U/L bit."],
            difficulty="medium",
        ),
    ],
)

# ======================================================================
# 7-AMALIY
# ======================================================================
E1 = net_of("192.168.37.140/24")
E2 = net_of("10.150.77.9/8")
E3 = net_of("172.25.200.33/16")

A07 = T(
    "kt-a07-ipv4",
    "7-amaliy mashg'ulot: IPv4 manzillar. Ikkilik ko'rinish, sinflar, maska bilan ishlash",
    f"""
<h2>Mashg'ulot maqsadi</h2>
<p>O'nlik va ikkilik ko'rinishlar orasida tez o'tish, manzil sinfi, tarmoq va broadcast manzilini hisoblash.</p>

<h2>1. O'nlikdan ikkilikka</h2>
<p>Oktet bitlarining "og'irliklari": <code>128 64 32 16 8 4 2 1</code>. Sonni katta og'irlikdan boshlab ayiramiz:</p>
<pre><code>140 = 128 + 8 + 4      → 1000 1100
200 = 128 + 64 + 8     → 1100 1000
 37 = 32 + 4 + 1       → 0010 0101</code></pre>
<p>Teskari: <code>1011 0000</code> = 128 + 32 + 16 = 176.</p>

<h2>2. Maska qiymatlari (oktet ichida)</h2>
<table>
  <tr><th>Birlar soni</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
  <tr><td>Oktet</td><td>0</td><td>128</td><td>192</td><td>224</td><td>240</td><td>248</td><td>252</td><td>254</td><td>255</td></tr>
</table>

<h2>3. Tarmoq va broadcast</h2>
<p>Tarmoq = IP AND maska; broadcast — xost bitlarini 1 ga to'ldirish. Standart (sinfli) maskalar uchun bu juda oddiy:</p>
<table>
  <tr><th>Manzil</th><th>Sinf</th><th>Maska</th><th>Tarmoq</th><th>Broadcast</th><th>Xostlar</th></tr>
  <tr><td>192.168.37.140</td><td>C</td><td>{mask_of(24)}</td><td>{E1.network_address}</td><td>{E1.broadcast_address}</td><td>{hosts_count(24)}</td></tr>
  <tr><td>10.150.77.9</td><td>A</td><td>{mask_of(8)}</td><td>{E2.network_address}</td><td>{E2.broadcast_address}</td><td>{hosts_count(8):,}</td></tr>
  <tr><td>172.25.200.33</td><td>B</td><td>{mask_of(16)}</td><td>{E3.network_address}</td><td>{E3.broadcast_address}</td><td>{hosts_count(16):,}</td></tr>
</table>

<h2>4. Ikki kompyuter bir tarmoqdami?</h2>
<p>Ikkalasining manzilini o'z maskasi bilan AND qilamiz — natija bir xil bo'lsa, bir tarmoqda (shlyuzsiz gaplasha oladi).</p>
<pre><code>192.168.1.70/26  → tarmoq {net_of('192.168.1.70/26').network_address}
192.168.1.130/26 → tarmoq {net_of('192.168.1.130/26').network_address}   → turli tarmoqlar!</code></pre>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi kalkulyatorda jadvaldagi har bir manzilni kiriting va ikkilik ko'rinishni o'z hisobingiz bilan solishtiring.</li>
  <li>Prefiksni 24 dan 26 ga o'zgartirib, tarmoq/xost chegarasi qanday siljishini kuzating.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("IPv4 bilan ishlash", "7-amaliy mashg'ulot", "🔢"),
        S_code("Bit og'irliklari", "128 64 32 16 8 4 2 1\n140 = 128 + 8 + 4 → 10001100"),
        S_table("Maska oktetlari", ["Birlar", "Qiymat"], [["1", "128"], ["2", "192"], ["3", "224"], ["4", "240"], ["5", "248"], ["6", "252"], ["7", "254"], ["8", "255"]]),
        S_quiz("11100000 o'nlikda?", ["192", "224", "240", "112"], 1, "128 + 64 + 32 = 224."),
        S_code("Tarmoq = IP AND maska", f"192.168.37.140 AND 255.255.255.0 = {E1.network_address}\nbroadcast = {E1.broadcast_address}"),
        S_idea("Bir tarmoqdami?", "Ikkala manzilni maska bilan AND qiling. Natija teng bo'lsa — bitta tarmoq, aks holda shlyuz kerak.", "🤝"),
        S_quiz("192.168.1.70/26 va 192.168.1.130/26 bir tarmoqdami?", ["Ha", "Yo'q"] + ["Maskaga bog'liq emas"], 1, "Tarmoqlar .64 va .128 — turli."),
        S_summary("Xulosa", ["Og'irliklar: 128…1", "Maska oktetlari: 128, 192, 224, 240, 248, 252, 254, 255", "Tarmoq = AND, broadcast = xost bitlari 1"]),
    ],
    [
        Q("200 ning ikkilik ko'rinishi?", ["11001000", "11000100", "10101000", "11100000"], 0, "128 + 64 + 8 = 200."),
        Q("10101100 ning o'nlik qiymati?", ["162", "172", "170", "182"], 1, "128 + 32 + 8 + 4 = 172."),
        Q("255.255.255.248 maskada nechta bir bor?", ["27", "28", "29", "30"], 2, "24 + 5 = 29."),
        Q("172.25.200.33/16 ning tarmoq manzili?", ["172.25.0.0", "172.25.200.0", "172.0.0.0", "172.25.200.32"], 0, "B sinf, /16 — oxirgi ikki oktet nol."),
        Q("10.150.77.9 qaysi sinfga tegishli?", ["A", "B", "C", "D"], 0, "Birinchi oktet 1–126."),
        Q("Qaysi juftliklar bir tarmoqda?", ["10.1.1.5/8 va 10.200.3.4/8", "192.168.1.10/24 va 192.168.2.10/24", "172.16.5.1/16 va 172.16.99.1/16", "192.168.1.70/26 va 192.168.1.100/26"], [0, 2, 3], "192.168.1.x va 192.168.2.x /24 da turli tarmoqlar."),
    ],
    [
        answer_task(
            "Konvertatsiya",
            "Aylantiring.",
            [
                F("192.168.37.140 ning 4-okteti ikkilikda (8 raqam)", "text", f"{140:08b}"),
                F("11000000.10101000.00001010.00000001 o'nlikda", "ip", "192.168.10.1"),
                F("/28 maskasi o'nlikda", "ip", mask_of(28)),
                F("255.255.252.0 qaysi prefiks? (faqat son)", "number", 22),
            ],
        ),
        answer_task(
            "Tarmoqni hisoblang",
            "Manzil: 172.25.200.33, maska 255.255.255.224.",
            [
                F("Prefiks", "number", 27),
                F("Tarmoq manzili", "ip", str(net_of("172.25.200.33/27").network_address), reject=["172.25.200.0"]),
                F("Broadcast", "ip", str(net_of("172.25.200.33/27").broadcast_address)),
                F("Birinchi xost", "ip", first_host(net_of("172.25.200.33/27"))),
                F("Oxirgi xost", "ip", last_host(net_of("172.25.200.33/27"))),
            ],
            hints=["/27 da blok o'lchami 32: 0, 32, 64… 33 qaysi blokka tushadi?"],
            difficulty="medium",
        ),
        code_task(
            "Tarmoq va broadcast",
            "Bir qatorda IP manzil va prefiks: masalan 192.168.1.130/26. Ikki qatorda tarmoq manzili va broadcast manzilni chiqaring.\n(ipaddress modulidan foydalanmang — bitli amallar bilan yeching.)",
            "s = input().strip()\nip, p = s.split('/')\np = int(p)\n# Kodingizni shu yerga yozing\n",
            "s = input().strip()\nip, p = s.split('/')\np = int(p)\nn = 0\nfor x in ip.split('.'):\n    n = n * 256 + int(x)\nmask = (0xFFFFFFFF << (32 - p)) & 0xFFFFFFFF\nnet = n & mask\nbc = net | (~mask & 0xFFFFFFFF)\nto = lambda v: '.'.join(str((v >> s) & 255) for s in (24, 16, 8, 0))\nprint(to(net))\nprint(to(bc))",
            [("192.168.1.130/26", "192.168.1.128\n192.168.1.191"), ("10.150.77.9/8", "10.0.0.0\n10.255.255.255"),
             ("172.25.200.33/27", f"{net_of('172.25.200.33/27').network_address}\n{net_of('172.25.200.33/27').broadcast_address}"),
             ("172.16.45.200/20", None), ("200.1.1.1/30", None)],
            hints=["Manzilni 32 bitli songa aylantiring: n = n*256 + oktet.", "Maska: (0xFFFFFFFF << (32 − p)) & 0xFFFFFFFF."],
            difficulty="hard",
        ),
    ],
)

# ======================================================================
# 8-AMALIY
# ======================================================================
S8 = subnets("192.168.10.0/24", 27)   # 6 ta kerak → 3 bit → /27, 8 ta
S8B = subnets("172.16.0.0/16", 20)    # 14 ta kerak → 4 bit → /20

A08 = T(
    "kt-a08-subnetting",
    "8-amaliy mashg'ulot: Tarmoqni quyi tarmoqlarga bo'lish (subnetting, FLSM)",
    f"""
<h2>Mashg'ulot maqsadi</h2>
<p>Berilgan tarmoqni teng o'lchamli quyi tarmoqlarga bo'lish va har birining chegaralarini aniqlash.</p>

<h2>1. Algoritm</h2>
<ol>
  <li>Kerakli quyi tarmoqlar soni N bo'yicha qarzga olinadigan bitlar sonini toping: <b>2<sup>n</sup> ≥ N</b>.</li>
  <li>Yangi prefiks = eski prefiks + n.</li>
  <li><b>Blok o'lchami</b> = 2<sup>(32 − yangi prefiks)</sup> — quyi tarmoqlar shu qadam bilan boshlanadi.</li>
  <li>Har quyi tarmoq: tarmoq manzili, birinchi xost (+1), oxirgi xost (broadcast − 1), broadcast (keyingi tarmoq − 1).</li>
  <li>Tekshiring: har quyi tarmoqdagi xostlar soni (2<sup>h</sup> − 2) talabga yetadimi?</li>
</ol>

<h2>2. Namuna</h2>
<p><i>192.168.10.0/24 tarmog'ini 6 ta bo'limga bo'ling.</i></p>
<pre><code>2³ = 8 ≥ 6   → n = 3, yangi prefiks /27, maska {mask_of(27)}
blok = 2⁵ = 32, har birida 30 ta xost</code></pre>
<table>
  <tr><th>#</th><th>Tarmoq</th><th>Xostlar</th><th>Broadcast</th></tr>
  {"".join(f"<tr><td>{i + 1}</td><td>{n.network_address}/27</td><td>{first_host(n)} – {last_host(n)}</td><td>{n.broadcast_address}</td></tr>" for i, n in enumerate(S8))}
</table>
<p>6 tasi ishlatiladi, 2 tasi kelajak uchun zaxirada.</p>

<h2>3. Ikkinchi namuna (B sinf)</h2>
<p><i>172.16.0.0/16 ni 14 ta quyi tarmoqqa.</i> 2⁴ = 16 ≥ 14 → /20, maska {mask_of(20)}, blok 3-oktetda 16: 172.16.0.0, 172.16.16.0, 172.16.32.0 … Har birida {hosts_count(20)} ta xost. 5-quyi tarmoq: <b>{S8B[4]}</b>, broadcast {S8B[4].broadcast_address}.</p>

<blockquote>Tez hisob: blok o'lchami = 256 − maskaning "qiziq" okteti. /27 da 256 − 224 = 32; /20 da 3-oktet 256 − 240 = 16.</blockquote>

<h2>Ish tartibi</h2>
<ol>
  <li>Namunani daftarda hisoblang, so'ng simulyatsiyadagi "Teng bo'lish" bo'limida 192.168.10.0/24 va 6 ni kiritib tekshiring.</li>
  <li>Bo'limlar sonini 2, 4, 16, 64 qilib, prefiks va xostlar soni qanday o'zgarishini jadvalga yozing.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("Subnetting (FLSM)", "8-amaliy mashg'ulot", "✂️"),
        S_points("Algoritm", [("1️⃣", "2ⁿ ≥ N — qarzga olinadigan bitlar"), ("2️⃣", "Yangi prefiks = eski + n"), ("3️⃣", "Blok = 2^(32 − prefiks)"), ("4️⃣", "Tarmoqlar blok qadami bilan")]),
        S_code("192.168.10.0/24 → 6 bo'lim", f"n = 3 → /27 ({mask_of(27)})\nblok = 32, xostlar = 30\n" + "\n".join(str(n) for n in S8[:4]) + "\n…"),
        S_idea("Tez hisob", "Blok = 256 − maskaning qiziq okteti. /27 → 256 − 224 = 32.", "⚡"),
        S_quiz("192.168.10.0/24 ni /27 ga bo'lganda 3-quyi tarmoq?", [str(S8[2].network_address), "192.168.10.32", "192.168.10.96", "192.168.10.60"], 0, "0, 32, 64 — uchinchisi .64."),
        S_quiz("10 ta bo'lim kerak, asos /24. Yangi prefiks?", ["/26", "/27", "/28", "/30"], 2, "2⁴ = 16 ≥ 10 → /28."),
        S_summary("Xulosa", ["2ⁿ ≥ kerakli bo'limlar", "Blok o'lchami qadamni beradi", "Broadcast = keyingi tarmoq − 1"]),
    ],
    [
        Q("/24 tarmoqni 4 ta teng qismga bo'lsak, yangi prefiks?", ["/25", "/26", "/27", "/28"], 1, "2² = 4 → /26."),
        Q("/26 quyi tarmoqda nechta xost?", ["30", "62", "64", "126"], 1, "2⁶ − 2 = 62."),
        Q("/27 da blok o'lchami?", ["16", "32", "64", "224"], 1, "2⁵ = 32."),
        Q("192.168.10.64/27 ning broadcast manzili?", ["192.168.10.95", "192.168.10.96", "192.168.10.127", "192.168.10.63"], 0, "64 + 32 − 1 = 95."),
        Q("172.16.0.0/16 ni /20 larga bo'lsak nechta quyi tarmoq?", ["4", "8", "16", "20"], 2, "2⁴ = 16."),
        Q("Qaysilar 192.168.10.0/24 ni /27 ga bo'lishdagi to'g'ri quyi tarmoqlar?", ["192.168.10.32/27", "192.168.10.160/27", "192.168.10.50/27", "192.168.10.224/27"], [0, 1, 3], ".50 — 32 ga karrali emas."),
    ],
    [
        answer_task(
            "Bo'limlarga ajrating",
            "Kollej 192.168.10.0/24 tarmog'ini 6 ta bo'limga teng bo'lmoqchi.",
            [
                F("Yangi prefiks (faqat son)", "number", 27),
                F("Yangi maska", "ip", mask_of(27)),
                F("Har bo'limdagi xostlar soni", "number", 30),
                F("4-bo'lim tarmoq manzili", "ip", str(S8[3].network_address)),
                F("4-bo'lim broadcast manzili", "ip", str(S8[3].broadcast_address)),
            ],
            hints=["Bo'limlar: .0, .32, .64, .96 …"],
            difficulty="medium",
        ),
        answer_task(
            "B sinfni bo'lish",
            "172.16.0.0/16 tarmog'ini kamida 14 ta teng quyi tarmoqqa bo'ling (eng katta mumkin bo'lgan quyi tarmoqlar).",
            [
                F("Yangi prefiks", "number", 20),
                F("Har quyi tarmoqdagi xostlar", "number", hosts_count(20)),
                F("5-quyi tarmoq manzili", "ip", str(S8B[4].network_address)),
                F("5-quyi tarmoqning oxirgi xosti", "ip", last_host(S8B[4])),
            ],
            hints=["Blok 3-oktetda 16: 0, 16, 32, 48, 64 …"],
            difficulty="medium",
        ),
        code_task(
            "Quyi tarmoqlar ro'yxati",
            "Ikki qator: asosiy tarmoq (masalan 192.168.10.0/24) va kerakli quyi tarmoqlar soni N. Eng kichik yetarli n (2ⁿ ≥ N) bilan bo'lib, birinchi N ta quyi tarmoqni 'tarmoq/prefiks' ko'rinishida har birini alohida qatorda chiqaring.",
            "base = input().strip()\nn_kerak = int(input())\n# Kodingizni shu yerga yozing\n",
            "base = input().strip()\nk = int(input())\nip, p = base.split('/')\np = int(p)\nv = 0\nfor x in ip.split('.'):\n    v = v * 256 + int(x)\nb = 0\nwhile 2 ** b < k:\n    b += 1\nnp = p + b\nsize = 2 ** (32 - np)\nfor i in range(k):\n    s = v + i * size\n    print('.'.join(str((s >> t) & 255) for t in (24, 16, 8, 0)) + '/' + str(np))",
            [("192.168.10.0/24\n6", "\n".join(f"{n}" for n in S8[:6])),
             ("172.16.0.0/16\n3", "\n".join(str(n) for n in subnets("172.16.0.0/16", 18)[:3])),
             ("10.0.0.0/8\n2", None), ("192.168.1.0/24\n16", None)],
            hints=["Qarzga olinadigan bitlar: b = 0; while 2**b < N: b += 1.", "i-quyi tarmoq boshi: asos + i × blok."],
            difficulty="hard",
        ),
    ],
)

# ======================================================================
# 9-AMALIY
# ======================================================================
NEEDS = [("Buxgalteriya", 50), ("Kompyuter sinfi", 100), ("Ma'muriyat", 20), ("Server xonasi", 6), ("R1–R2 liniyasi", 2)]
PLAN = vlsm("172.20.10.0/24", NEEDS)
PLAN_D = {name: n for name, h, n in PLAN}
SUMM = list(ipa.collapse_addresses([ipa.IPv4Network(f"192.168.{i}.0/24") for i in range(4)]))[0]

A09 = T(
    "kt-a09-vlsm",
    "9-amaliy mashg'ulot: VLSM va marshrutlarni umumlashtirish (supernetting)",
    """
<h2>Mashg'ulot maqsadi</h2>
<p>Har bo'limga keragicha o'lchamli quyi tarmoq ajratish (VLSM) va bir nechta tarmoqni bitta marshrutga umumlashtirish.</p>

<h2>1. Nega VLSM?</h2>
<p>FLSM da hamma quyi tarmoqlar bir xil: 100 xostli sinf va 2 ta manzil kerak bo'lgan router-router liniyasi bir xil blok oladi — manzillar isrof bo'ladi. <b>VLSM</b> (o'zgaruvchan uzunlikdagi maska) har bo'limga kerakli o'lchamni beradi.</p>

<h2>2. Algoritm</h2>
<ol>
  <li>Talablarni <b>kattadan kichikka</b> saralang.</li>
  <li>Har biri uchun eng kichik mos prefiksni toping: 2<sup>h</sup> − 2 ≥ xostlar.</li>
  <li>Bo'sh joyning boshidan ajrating. Blok o'z o'lchamiga karrali manzildan boshlanishi kerak — kattadan boshlaganda bu o'z-o'zidan bajariladi.</li>
  <li>Keyingi blok oldingi blokning broadcast + 1 dan boshlanadi.</li>
</ol>

<h2>3. Namuna</h2>
<p><i>172.20.10.0/24, talablar: Kompyuter sinfi — 100, Buxgalteriya — 50, Ma'muriyat — 20, Server xonasi — 6, R1–R2 liniyasi — 2.</i></p>
<table>
  <tr><th>Bo'lim</th><th>Kerak</th><th>Prefiks</th><th>Tarmoq</th><th>Xostlar oralig'i</th><th>Broadcast</th></tr>
  ROWS
</table>
<p>Ishlatildi: USED / 256 manzil. Qolgan blok keyingi bo'limlar uchun zaxira.</p>

<h2>4. Umumlashtirish (supernetting)</h2>
<p>Bir nechta qo'shni tarmoqni bitta qisqaroq prefiks bilan e'lon qilish — marshrut jadvalini qisqartiradi. Usul: manzillarning umumiy boshlang'ich bitlarini topish.</p>
<pre><code>192.168.0.0/24 → 192.168.000000 00.0
192.168.1.0/24 → 192.168.000000 01.0
192.168.2.0/24 → 192.168.000000 10.0
192.168.3.0/24 → 192.168.000000 11.0
umumiy: 16 + 6 = 22 bit  → SUMM</code></pre>
<p>Shart: tarmoqlar ketma-ket va soni 2 ning darajasi bo'lishi, birinchisi esa blok o'lchamiga karrali bo'lishi kerak.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Namunani daftarda bajaring, keyin simulyatsiyadagi VLSM bo'limiga talablarni kiritib tekshiring.</li>
  <li>Talablar tartibini o'zgartirib (kichikdan boshlab) qo'lda ajratib ko'ring — bloklar to'qnashuvi qayerda paydo bo'lishini toping.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""".replace("ROWS", "".join(
        f"<tr><td>{name}</td><td>{h}</td><td>/{n.prefixlen}</td><td>{n.network_address}</td><td>{first_host(n)} – {last_host(n)}</td><td>{n.broadcast_address}</td></tr>"
        for name, h, n in PLAN)).replace("USED", str(sum(n.num_addresses for _, _, n in PLAN))).replace("SUMM", str(SUMM)),
    [
        S_title("VLSM va umumlashtirish", "9-amaliy mashg'ulot", "🧩"),
        S_compare("FLSM va VLSM", ("FLSM", "Hamma bloklar bir xil — isrof"), ("VLSM", "Har bo'limga keragicha")),
        S_points("VLSM algoritmi", [("⬇️", "Kattadan kichikka saralash"), ("📏", "2^h − 2 ≥ xostlar"), ("📍", "Bo'sh joy boshidan, karrali manzildan")]),
        S_table("Namuna: 172.20.10.0/24", ["Bo'lim", "Tarmoq"], [[name, str(n)] for name, h, n in PLAN]),
        S_quiz("50 xost uchun eng kichik prefiks?", ["/25", "/26", "/27", "/28"], 1, "2⁶ − 2 = 62 ≥ 50; /27 da 30 — yetmaydi."),
        S_code("Umumlashtirish", "192.168.0.0/24\n192.168.1.0/24\n192.168.2.0/24\n192.168.3.0/24", output=str(SUMM)),
        S_quiz("10.1.4.0/24 – 10.1.7.0/24 ni umumlashtiring", ["10.1.4.0/22", "10.1.0.0/21", "10.1.4.0/23", "10.1.4.0/24"], 0, "4 ta tarmoq, 4 ga karrali boshlanish → /22."),
        S_summary("Xulosa", ["VLSM — manzillarni tejaydi", "Har doim kattadan boshlang", "Supernetting — marshrut jadvalini qisqartiradi"]),
    ],
    [
        Q("VLSM da talablar qanday tartibda ajratiladi?", ["Kichikdan kattaga", "Kattadan kichikka", "Alifbo bo'yicha", "Tasodifiy"], 1, "Shunda bloklar o'z-o'zidan to'g'ri tekislanadi."),
        Q("Router-router nuqta-nuqta liniyasi uchun odatdagi prefiks?", ["/24", "/28", "/30", "/32"], 2, "/30 — 2 ta xost."),
        Q("20 ta xost uchun eng kichik prefiks?", ["/26", "/27", "/28", "/29"], 1, "/27 — 30 xost; /28 — 14, yetmaydi."),
        Q("192.168.0.0/24 va 192.168.1.0/24 ni umumlashtirsak?", ["192.168.0.0/23", "192.168.0.0/22", "192.168.1.0/23", "192.168.0.0/25"], 0, "Ikki tarmoq — 1 bit kam: /23."),
        Q("Umumlashtirishning foydasi?", ["Manzillar soni ko'payadi", "Marshrut jadvali qisqaradi", "Xavfsizlik oshadi", "Broadcast yo'qoladi"], 1, "Bitta yozuv bir nechta tarmoqni qamraydi."),
        Q("Qaysi tarmoqlar to'plamini bitta /22 ga umumlashtirish mumkin?", ["10.0.4.0 – 10.0.7.0 (/24)", "10.0.8.0 – 10.0.11.0 (/24)", "10.0.5.0 – 10.0.8.0 (/24)", "172.16.0.0 – 172.16.3.0 (/24)"], [0, 1, 3], "5–8 to'plami 4 ga karrali boshlanmaydi."),
    ],
    [
        answer_task(
            "VLSM rejasi",
            "172.20.10.0/24 tarmog'i. Talablar: Kompyuter sinfi — 100, Buxgalteriya — 50, Ma'muriyat — 20, Server xonasi — 6, R1–R2 liniyasi — 2 xost. Kattadan kichikka ajrating.",
            [
                F("Kompyuter sinfi tarmog'i (manzil/prefiks)", "ip", str(PLAN_D["Kompyuter sinfi"])),
                F("Buxgalteriya tarmog'i", "ip", str(PLAN_D["Buxgalteriya"])),
                F("Ma'muriyat tarmog'i", "ip", str(PLAN_D["Ma'muriyat"])),
                F("Server xonasi tarmog'i", "ip", str(PLAN_D["Server xonasi"])),
                F("R1–R2 liniyasi tarmog'i", "ip", str(PLAN_D["R1–R2 liniyasi"])),
            ],
            hints=["Masalan: 172.20.10.0/25 ko'rinishida yozing.", "Simulyatsiyadagi VLSM bo'limiga 'Kompyuter sinfi:100, Buxgalteriya:50, …' kiriting."],
            difficulty="hard",
        ),
        answer_task(
            "Umumlashtiring",
            "Marshrutizator quyidagi tarmoqlarni bitta yozuv bilan e'lon qilmoqchi.",
            [
                F("192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24", "ip", str(SUMM)),
                F("172.16.8.0/24 – 172.16.15.0/24 (8 ta)", "ip", str(list(ipa.collapse_addresses([ipa.IPv4Network(f"172.16.{i}.0/24") for i in range(8, 16)]))[0])),
                F("10.10.32.0/20 va 10.10.48.0/20", "ip", str(list(ipa.collapse_addresses([ipa.IPv4Network("10.10.32.0/20"), ipa.IPv4Network("10.10.48.0/20")]))[0])),
            ],
            hints=["Tarmoqlar soni 2^k bo'lsa, prefiks k ga kamayadi."],
            difficulty="medium",
        ),
        code_task(
            "Kerakli prefiks",
            "Bitta son — bo'limdagi xostlar soni (1–16 000 000). Unga yetadigan eng kichik quyi tarmoq prefiksini '/p' ko'rinishida chiqaring (xostlar = 2^(32−p) − 2, p ≤ 30).\nMasalan: 50 → /26",
            "h = int(input())\n# Kodingizni shu yerga yozing\n",
            "h = int(input())\np = 30\nwhile 2 ** (32 - p) - 2 < h:\n    p -= 1\nprint('/' + str(p))",
            [("50", "/26"), ("2", "/30"), ("100", "/25"), ("254", "/24"), ("255", "/23"), ("1000", None)],
            hints=["p = 30 dan boshlab, yetguncha kamaytiring."],
            difficulty="easy",
        ),
    ],
)

# ======================================================================
# 10-AMALIY
# ======================================================================
G10 = [("A", "B", 4), ("A", "C", 2), ("B", "C", 1), ("B", "D", 5), ("C", "D", 8), ("C", "E", 10), ("D", "E", 2), ("D", "F", 6), ("E", "F", 2)]


def dij(edges, src):
    adj = {}
    for a, b, c in edges:
        adj.setdefault(a, []).append((b, c))
        adj.setdefault(b, []).append((a, c))
    dist = {n: float("inf") for n in adj}
    prev = {n: None for n in adj}
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


def pth(prev, t):
    out = []
    while t:
        out.append(t)
        t = prev[t]
    return out[::-1]


D10, P10 = dij(G10, "A")
PATH_F = pth(P10, "F")

A10 = T(
    "kt-a10-marshrutlash",
    "10-amaliy mashg'ulot: Marshrut jadvallarini tuzish. Dijkstra algoritmi",
    f"""
<h2>Mashg'ulot maqsadi</h2>
<p>Dijkstra algoritmini qo'lda bajarish, marshrut jadvalini tuzish va eng uzun prefiks qoidasini qo'llash.</p>

<h2>1. Dijkstra algoritmi</h2>
<ol>
  <li>Manbaga masofa 0, qolganlarga ∞. Hamma tugun "tekshirilmagan".</li>
  <li>Tekshirilmaganlardan masofasi eng kichigini tanlang (u).</li>
  <li>u ning har bir qo'shnisi v uchun: <code>d(u) + w(u,v) &lt; d(v)</code> bo'lsa, d(v) ni yangilang va "oldingi" = u deb yozing.</li>
  <li>u ni tekshirilgan deb belgilang. Hamma tugun tekshirilguncha 2-qadamga qayting.</li>
</ol>

<h2>2. Namuna</h2>
<p>Graf (qirralar va narxlar): {", ".join(f"{a}–{b}: {c}" for a, b, c in G10)}. Manba — A.</p>
<table>
  <tr><th>Tugun</th><th>Masofa</th><th>Oldingi</th><th>Keyingi sakrash (A dan)</th></tr>
  {"".join(f"<tr><td>{n}</td><td>{int(D10[n])}</td><td>{P10[n] or '—'}</td><td>{pth(P10, n)[1] if n != 'A' else '—'}</td></tr>" for n in sorted(D10))}
</table>
<p>A dan F gacha eng arzon yo'l: <b>{" → ".join(PATH_F)}</b>, narxi <b>{int(D10["F"])}</b>. A ning marshrut jadvali uchun faqat "keyingi sakrash" ustuni kerak.</p>

<h2>3. Statik marshrutlar</h2>
<p>Ikki marshrutizator: R1 (LAN 192.168.1.0/24, R2 bilan 10.0.0.0/30 orqali, R1 = 10.0.0.1) va R2 (LAN 192.168.2.0/24, 10.0.0.2). Har biriga qarama-qarshi LAN uchun statik marshrut kerak:</p>
<pre><code>R1: ip route 192.168.2.0 255.255.255.0 10.0.0.2
R2: ip route 192.168.1.0 255.255.255.0 10.0.0.1</code></pre>
<p>Faqat bir tomonga yozilsa, paket boradi, lekin javob qaytmaydi.</p>

<h2>4. Eng uzun prefiks</h2>
<table>
  <tr><th>Yozuv</th><th>Keyingi sakrash</th></tr>
  <tr><td>0.0.0.0/0</td><td>ISP</td></tr>
  <tr><td>172.16.0.0/12</td><td>R2</td></tr>
  <tr><td>172.16.32.0/20</td><td>R3</td></tr>
  <tr><td>172.16.40.0/24</td><td>R4</td></tr>
</table>
<p>172.16.40.9 → uchala yozuv mos keladi, eng aniq /24 → <b>R4</b>. 172.16.33.1 → /12 va /20 mos → <b>R3</b>. 172.20.1.1 → faqat /12 → <b>R2</b>. 8.8.8.8 → <b>ISP</b>.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Namunadagi Dijkstra jadvalini daftarda qadamma-qadam bajaring.</li>
  <li>Simulyatsiyada (boshqa graf) R1 dan har bir tugungacha yo'lni toping, so'ng bitta kabelni uzib, jadval qanday o'zgarishini yozing.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>
""",
    [
        S_title("Marshrut jadvallari", "10-amaliy mashg'ulot", "🗺️"),
        S_points("Dijkstra", [("0️⃣", "Manba 0, qolgan ∞"), ("🔍", "Eng yaqin tekshirilmaganni tanla"), ("🔁", "Qo'shnilar masofasini yangila"), ("✅", "Tekshirilgan deb belgila")]),
        S_table("A dan masofalar", ["Tugun", "Masofa", "Keyingi sakrash"], [[n, str(int(D10[n])), pth(P10, n)[1] if n != "A" else "—"] for n in sorted(D10)]),
        S_quiz("A → F eng arzon yo'l narxi?", [str(int(D10["F"]) + d) for d in (0, 4, -3, 2)], 0, f"{' → '.join(PATH_F)}."),
        S_code("Statik marshrutlar", "R1: ip route 192.168.2.0 255.255.255.0 10.0.0.2\nR2: ip route 192.168.1.0 255.255.255.0 10.0.0.1", note="Ikkala yo'nalish ham kerak!"),
        S_quiz("172.16.33.1 qaysi yozuv bo'yicha ketadi? (/12 → R2, /20 172.16.32.0 → R3, /24 172.16.40.0 → R4)", ["R2", "R3", "R4", "ISP"], 1, "172.16.32.0/20 diapazoni 32–47; /24 esa mos emas."),
        S_summary("Xulosa", ["Dijkstra — eng yaqindan kengayish", "Jadvalda faqat keyingi sakrash", "Statik marshrut ikki tomonga", "Eng uzun prefiks g'olib"]),
    ],
    [
        Q("Dijkstra har qadamda qaysi tugunni tanlaydi?", ["Eng uzoqdagi", "Masofasi eng kichik tekshirilmagan", "Alifbo bo'yicha birinchi", "Tasodifiy"], 1, "Shuning uchun tekshirilgan tugun masofasi yakuniy."),
        Q(f"Namunada A dan D gacha masofa?", [str(int(D10["D"])), "9", "5", "10"], 0, f"Yo'l: {' → '.join(pth(P10, 'D'))}."),
        Q("Statik marshrut faqat R1 da yozildi. Ping natijasi?", ["Muvaffaqiyatli", "So'rov yetadi, javob qaytmaydi", "So'rov yetmaydi", "TTL tugaydi"], 1, "R2 javobni 192.168.1.0 ga yuborishni bilmaydi."),
        Q("172.16.40.9 qaysi yozuv bo'yicha?", ["/0 ISP", "/12 R2", "/20 R3", "/24 R4"], 3, "Eng uzun mos prefiks."),
        Q("Marshrutizator jadvalida nima saqlanadi?", ["Butun yo'l", "Keyingi sakrash va interfeys", "Har bir xostning MAC i", "DNS nomlar"], 1, "Har router faqat navbatdagi qadamni biladi."),
        Q("Qaysi manzillar 172.16.32.0/20 ga tegishli?", ["172.16.32.1", "172.16.47.255", "172.16.48.1", "172.16.40.9"], [0, 1, 3], "/20: 172.16.32.0 – 172.16.47.255."),
    ],
    [
        answer_task(
            "Dijkstra jadvali",
            f"Graf: {', '.join(f'{a}–{b}: {c}' for a, b, c in G10)}. Manba — A.",
            [
                F("A dan E gacha masofa", "number", int(D10["E"])),
                F("A dan F gacha masofa", "number", int(D10["F"])),
                F("A ning F uchun keyingi sakrashi", "choice", PATH_F[1], options=["B", "C", "D", "E"]),
                F("A dan F gacha yo'ldagi tugunlar soni (A va F bilan)", "number", len(PATH_F)),
            ],
            hints=["Avval C (2), keyin B (2 + 1 = 3) tekshiriladi."],
            difficulty="medium",
        ),
        answer_task(
            "Statik marshrut",
            "R1: LAN 192.168.1.0/24, R2 tomondagi interfeys 10.0.0.1/30. R2: LAN 192.168.2.0/24, interfeys 10.0.0.2/30.",
            [
                F("R1 dagi marshrut: manzil tarmoq", "ip", "192.168.2.0"),
                F("R1 dagi marshrut: keyingi sakrash", "ip", "10.0.0.2"),
                F("R2 dagi marshrut: keyingi sakrash", "ip", "10.0.0.1"),
                F("10.0.0.0/30 da nechta xost manzili bor?", "number", 2),
            ],
            hints=["Simulyatsiyadagi '2 router' namunasida aynan shu sxema bor — marshrutlarni kiritib ping qiling."],
        ),
        code_task(
            "Eng uzun prefiks",
            "Birinchi qatorda N — yozuvlar soni. Keyingi N qatorda: 'tarmoq/prefiks keyingi_sakrash'. Oxirgi qatorda manzil IP. Mos keladigan eng uzun prefiksli yozuvning keyingi sakrashini chiqaring; hech biri mos kelmasa — 'yo''q'.",
            "n = int(input())\n# Kodingizni shu yerga yozing\n",
            "def num(s):\n    v = 0\n    for x in s.split('.'):\n        v = v * 256 + int(x)\n    return v\n\nn = int(input())\nrows = []\nfor _ in range(n):\n    net, hop = input().split()\n    a, p = net.split('/')\n    rows.append((num(a), int(p), hop))\nip = num(input().strip())\nbest = None\nfor a, p, hop in rows:\n    m = (0xFFFFFFFF << (32 - p)) & 0xFFFFFFFF if p else 0\n    if ip & m == a & m and (best is None or p > best[0]):\n        best = (p, hop)\nprint(best[1] if best else \"yo'q\")",
            [("4\n0.0.0.0/0 ISP\n172.16.0.0/12 R2\n172.16.32.0/20 R3\n172.16.40.0/24 R4\n172.16.40.9", "R4"),
             ("4\n0.0.0.0/0 ISP\n172.16.0.0/12 R2\n172.16.32.0/20 R3\n172.16.40.0/24 R4\n172.16.33.1", "R3"),
             ("3\n172.16.0.0/12 R2\n172.16.32.0/20 R3\n172.16.40.0/24 R4\n8.8.8.8", "yo'q"),
             ("4\n0.0.0.0/0 ISP\n172.16.0.0/12 R2\n172.16.32.0/20 R3\n172.16.40.0/24 R4\n172.20.1.1", None)],
            hints=["/0 maska — 0: har qanday manzil mos keladi.", "Mos keladiganlar ichidan prefiksi kattasini saqlang."],
            difficulty="hard",
        ),
    ],
)

TOPICS = [A06, A07, A08, A09, A10]
