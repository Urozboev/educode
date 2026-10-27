"""
Laboratoriya ishlari 1–5 (KT1406 fan dasturi, III bo'lim).

Har bir ishda asosiy topshiriq — HISOBOT: talaba ishni o'z kompyuterida
(Packet Tracer, Wireshark, Windows) bajaradi, skrinshot va xulosa
yuklaydi, o'qituvchi tekshiradi. Qo'shimcha ravishda natijani
tushunganini tekshiruvchi qisqa javob topshirig'i bor.
"""

from kt import (T, Q, F, answer_task, report_task, S_title, S_idea, S_points, S_table, S_compare, S_code, S_quiz,
                S_summary)

PT = "Cisco Packet Tracer (bepul, netacad.com da ro'yxatdan o'tib yuklab olinadi)"

# ======================================================================
# 1-LABORATORIYA
# ======================================================================
L01 = T(
    "kt-l01-qurilmalar",
    "1-laboratoriya ishi: Tarmoq qurilmalari va ularning vazifalari",
    """
<h2>Ishning maqsadi</h2>
<p>Tarmoq adapteri, takrorlagich, ko'prik, konsentrator, kommutator va marshrutizatorning vazifalarini o'rganish; kompyuter tarmoq adapteri parametrlarini aniqlash.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>Windows 10/11 o'rnatilgan kompyuter</li>
  <li>Laboratoriyadagi kommutator, marshrutizator va kabellar (bo'lsa)</li>
  <li>Mavzu sahifasidagi virtual simulyatsiya</li>
</ul>

<h2>Qisqacha nazariya</h2>
<table>
  <tr><th>Qurilma</th><th>Pog'ona</th><th>Ish tamoyili</th><th>Tashqi belgisi</th></tr>
  <tr><td>Tarmoq adapteri (NIC)</td><td>1–2</td><td>Kompyuterni muhitga ulaydi, MAC manzilga ega</td><td>RJ-45 porti, link/activity chiroqlari</td></tr>
  <tr><td>Takrorlagich (repeater)</td><td>1</td><td>Signalni kuchaytirib uzatadi</td><td>2 port</td></tr>
  <tr><td>Konsentrator (hub)</td><td>1</td><td>Kadrni hamma portga takrorlaydi</td><td>Ko'p port, bitta to'qnashuv domeni</td></tr>
  <tr><td>Ko'prik (bridge)</td><td>2</td><td>Ikki segmentni MAC bo'yicha filtrlaydi</td><td>2 port</td></tr>
  <tr><td>Kommutator (switch)</td><td>2</td><td>MAC jadvali bo'yicha kerakli portga yuboradi</td><td>8–48 port</td></tr>
  <tr><td>Marshrutizator (router)</td><td>3</td><td>Tarmoqlar orasida IP bo'yicha yo'naltiradi</td><td>WAN va LAN portlari</td></tr>
</table>

<h2>Ish tartibi</h2>
<h3>1-qism. Virtual tajriba</h3>
<ol>
  <li>Mavzu sahifasidagi simulyatsiyada <b>Konsentrator</b> rejimini tanlang. A dan C ga kadr yuboring — qaysi kompyuterlar kadrni oldi? Natijani yozing.</li>
  <li><b>Kommutator</b> rejimiga o'ting. A→C, C→A, A→C kadrlarini ketma-ket yuboring va har qadamdan keyin MAC jadvalini yozib oling. Nima uchun birinchi kadr hammaga ketdi?</li>
  <li>Broadcast belgisini qo'yib yuboring — kommutator nima qiladi?</li>
  <li><b>Marshrutizator</b> rejimida A dan C ga (boshqa tarmoq) va A dan B ga (bir tarmoq) yuboring. Broadcast boshqa tarmoqqa o'tadimi?</li>
</ol>
<h3>2-qism. Kompyuteringiz adapteri</h3>
<ol>
  <li>Buyruq qatorini oching (Win + R → <code>cmd</code>).</li>
  <li><code>ipconfig /all</code> ni bajaring. Quyidagilarni yozib oling: adapter nomi (Description), MAC manzil (Physical Address), DHCP yoqilganmi, IPv4 manzil, maska, shlyuz, DNS serverlar.</li>
  <li><code>getmac /v</code> — barcha adapterlar va ularning MAC manzillari.</li>
  <li>"Qurilmalar dispetcheri" (Device Manager) → Network adapters: adapter modeli va drayveri.</li>
  <li>Adapter xususiyatlari → <b>Link speed</b> (Settings → Network → Ethernet/Wi-Fi → Properties): ulanish tezligi qancha?</li>
</ol>
<h3>3-qism. Laboratoriya qurilmalari (agar mavjud bo'lsa)</h3>
<ol>
  <li>Kommutator va marshrutizatorning old panelini ko'rib chiqing: portlar soni va turi, chiroqlar.</li>
  <li>Kompyuter kabelini kommutatorga ulang — port chirog'i qanday o'zgardi?</li>
</ol>

<h2>Hisobot talablari</h2>
<ul>
  <li><code>ipconfig /all</code> natijasining skrinshoti (MAC va IPv4 ko'rinib tursin).</li>
  <li>Simulyatsiyadagi kommutator MAC jadvali to'ldirilgan holatning skrinshoti.</li>
  <li>Xulosa: hub va switch farqi, kompyuteringiz adapteri parametrlari.</li>
</ul>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega bugun hub o'rniga kommutator ishlatiladi?</li>
  <li>MAC manzil qayerda saqlanadi va uni o'zgartirish mumkinmi?</li>
  <li>Marshrutizator broadcast kadrlarni nima qiladi?</li>
</ol>
""",
    [
        S_title("Tarmoq qurilmalari", "1-laboratoriya ishi", "🔌"),
        S_table("Qurilmalar", ["Qurilma", "Pog'ona", "Nimaga qaraydi"], [["Hub", "1", "hech narsa"], ["Switch", "2", "MAC"], ["Router", "3", "IP"]]),
        S_points("Ish rejasi", [("🧪", "Simulyatsiya: hub, switch, router"), ("💻", "ipconfig /all, getmac"), ("🔍", "Qurilmalar dispetcheri"), ("🔌", "Haqiqiy qurilmalar paneli")]),
        S_code("Buyruqlar", "ipconfig /all\ngetmac /v", output="Physical Address. . . : D4-5D-64-A2-19-7C\nDHCP Enabled. . . . . : Yes\nIPv4 Address. . . . . : 192.168.1.10(Preferred)"),
        S_quiz("Kommutatorda birinchi A→C kadri nega hammaga ketadi?", ["Kommutator nosoz", "C ning MAC i jadvalda hali yo'q", "Bu broadcast", "A noto'g'ri ulangan"], 1, "Noma'lum unicast — flooding."),
        S_compare("Hub va switch", ("Hub", "Hamma portga — kanal hammaga band"), ("Switch", "Faqat kerakli portga — parallel uzatish")),
        S_summary("Hisobot", ["ipconfig /all skrinshoti", "MAC jadvali skrinshoti", "Xulosa: hub va switch farqi"]),
    ],
    [
        Q("ipconfig /all dagi 'Physical Address' nima?", ["IP manzil", "MAC manzil", "Shlyuz", "DNS"], 1, "Adapterning fizik (MAC) manzili."),
        Q("Kommutator broadcast kadrni qayerga yuboradi?", ["Hech qayerga", "Hamma portga (kelganidan tashqari)", "Routerga", "Faqat 1-portga"], 1, "Broadcast domeni butun kommutator."),
        Q("Ikki segmentni MAC bo'yicha bog'lovchi 2 portli qurilma?", ["Hub", "Ko'prik", "Router", "Repeater"], 1, "Kommutator — ko'p portli ko'prik."),
        Q("Port chirog'i yonmayapti. Ehtimoliy sabab?", ["DNS xatosi", "Fizik ulanish yo'q", "IP noto'g'ri", "Brandmauer"], 1, "Link chirog'i — 1-pog'ona belgisi."),
        Q("Qaysi buyruq barcha adapterlarning MAC manzilini ko'rsatadi?", ["ping", "getmac", "tracert", "nslookup"], 1, "Yoki ipconfig /all."),
        Q("Qaysi qurilmalar to'qnashuv domenini ajratadi?", ["Hub", "Kommutator", "Marshrutizator", "Takrorlagich"], [1, 2], "Hub va takrorlagich signalni takrorlaydi."),
    ],
    [
        report_task(
            "1-laboratoriya hisoboti",
            "Ish tartibidagi uchala qismni bajaring va natijalarni yuklang.",
            [
                "Simulyatsiyada hub rejimida A→C kadrini yubordim va natijani yozdim",
                "Kommutator rejimida MAC jadvalini to'ldirdim (skrinshot)",
                "Router rejimida broadcast boshqa tarmoqqa o'tmasligini tekshirdim",
                "ipconfig /all ni bajardim (skrinshot)",
                "getmac /v va Qurilmalar dispetcheridan adapter modelini aniqladim",
                "Adapterning ulanish tezligini (Link speed) aniqladim",
            ],
            "Adapteringiz modeli, MAC manzili, IP manzili va ulanish tezligini yozing. Simulyatsiya asosida hub va kommutatorning farqini o'z so'zlaringiz bilan tushuntiring.",
            min_images=2, max_images=4, min_chars=150,
        ),
        answer_task(
            "Natijalarni tekshiring",
            "Simulyatsiyadagi kommutator: jadval bo'sh. A→C, C→A, A→C kadrlari yuborildi (4 portli kommutator).",
            [
                F("Birinchi kadr nechta portga yuborildi?", "number", 3),
                F("Uchinchi kadr nechta portga yuborildi?", "number", 1),
                F("Uchala kadrdan keyin jadvalda nechta yozuv bor?", "number", 2),
            ],
            hints=["Faqat manba MAC lar yoziladi: A va C."],
        ),
    ],
    coin=15, xp=30, minutes=80,
)

# ======================================================================
# 2-LABORATORIYA
# ======================================================================
L02 = T(
    "kt-l02-emulyator",
    "2-laboratoriya ishi: Tarmoq emulyatorlari va ulardan foydalanish (Cisco Packet Tracer)",
    f"""
<h2>Ishning maqsadi</h2>
<p>Tarmoq emulyatori bilan tanishish, oddiy lokal tarmoqni yig'ish, IP manzillarni sozlash va ulanishni tekshirish.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>{PT}</li>
  <li>Muqobil: GNS3, EVE-NG (real qurilma obrazlari bilan, murakkabroq)</li>
  <li>Mavzu sahifasidagi mini-emulyator (brauzerda)</li>
</ul>

<h2>Qisqacha nazariya</h2>
<p><b>Tarmoq emulyatori</b> — real qurilmalarsiz tarmoqni loyihalash va sinash dasturi. Packet Tracer Cisco qurilmalarining soddalashtirilgan modelini beradi: kompyuter, kommutator, marshrutizator, server, simsiz qurilmalar. Ikki rejim: <b>Realtime</b> (hammasi darhol) va <b>Simulation</b> (paketlar qadamma-qadam, har bir pog'ona tarkibi ko'rinadi).</p>

<h2>Ish tartibi</h2>
<h3>1-qism. Brauzerdagi mini-emulyator (tayyorgarlik)</h3>
<ol>
  <li>Simulyatsiyada "Namuna: bitta LAN" ni oching — 3 ta PC va kommutator.</li>
  <li>Har PC ni bosib, IP bering: 192.168.1.10, .11, .12; maska 255.255.255.0.</li>
  <li>PC0 dan 192.168.1.12 ga ping yuboring. Natija va paket yo'lini yozing.</li>
  <li>PC2 maskasini 255.255.255.128 ga, IP ni 192.168.1.200 ga o'zgartirib, yana ping qiling. Nima o'zgardi va nima uchun?</li>
</ol>
<h3>2-qism. Packet Tracer</h3>
<ol>
  <li>Packet Tracer ni ishga tushiring. Pastki paneldan <b>Switches → 2960</b> ni ish maydoniga qo'ying.</li>
  <li><b>End Devices → PC</b> dan 4 ta kompyuter qo'ying (PC0–PC3).</li>
  <li><b>Connections</b> (chaqmoq belgisi) → <b>Copper Straight-Through</b>: har PC ning FastEthernet0 portini kommutatorning Fa0/1…Fa0/4 portlariga ulang. Port chiroqlari yashil bo'lguncha kuting.</li>
  <li>PC0 ni bosing → <b>Desktop → IP Configuration</b> → Static: IP 192.168.10.1, maska 255.255.255.0. Qolganlariga .2, .3, .4.</li>
  <li>PC0 → <b>Desktop → Command Prompt</b>: <code>ping 192.168.10.4</code>. Birinchi so'rov "Request timed out" bo'lishi mumkin — nima uchun? (ARP)</li>
  <li><b>Simulation</b> rejimiga o'ting (o'ng pastda). Event List Filters da faqat ICMP va ARP ni qoldiring. PC0 dan PC3 ga qayta ping qiling va <b>Play</b> bosing: ARP so'rovi qayerga ketdi, javob qayerdan keldi?</li>
  <li>Biror paketni bosib, <b>OSI Model</b> yorlig'ida pog'onalarni ko'ring. Skrinshot oling.</li>
  <li>Kommutator CLI da: <code>enable</code>, <code>show mac address-table</code>. Jadvalda nechta yozuv bor?</li>
  <li>Faylni <code>lab2_familiya.pkt</code> nomi bilan saqlang.</li>
</ol>

<h2>Hisobot talablari</h2>
<ul>
  <li>Packet Tracer dagi sxema skrinshoti (IP manzillar yorliq sifatida yozilgan bo'lsa yaxshi).</li>
  <li>Muvaffaqiyatli ping natijasi skrinshoti.</li>
  <li>Simulation rejimidagi ARP yoki ICMP paketning OSI Model oynasi.</li>
  <li><code>show mac address-table</code> natijasi.</li>
</ul>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega birinchi ping so'rovi ba'zan javobsiz qoladi?</li>
  <li>Realtime va Simulation rejimlarining farqi nimada?</li>
  <li>Straight-through va crossover kabel qachon ishlatiladi?</li>
</ol>
""",
    [
        S_title("Tarmoq emulyatori", "2-laboratoriya ishi", "🖧"),
        S_points("Emulyatorlar", [("🟦", "Cisco Packet Tracer — o'quv, bepul"), ("🟩", "GNS3, EVE-NG — real obrazlar"), ("🌐", "Brauzerdagi mini-emulyator")]),
        S_points("Packet Tracer: qadamlar", [("1️⃣", "Switch 2960 + 4 ta PC"), ("2️⃣", "Copper Straight-Through kabel"), ("3️⃣", "Desktop → IP Configuration"), ("4️⃣", "Command Prompt → ping"), ("5️⃣", "Simulation rejimi")]),
        S_code("Tekshirish", "C:\\>ping 192.168.10.4\nC:\\>arp -a\nSwitch>enable\nSwitch#show mac address-table"),
        S_quiz("Birinchi ping so'rovi 'Request timed out' bo'ldi, keyingilari muvaffaqiyatli. Sabab?", ["Kabel nosoz", "ARP manzilni aniqlayotgan edi", "DNS", "Brandmauer"], 1, "Birinchi paket ARP javobini kutib qoladi."),
        S_compare("Rejimlar", ("Realtime", "Hammasi darhol, haqiqiy vaqtda"), ("Simulation", "Paketlar qadamma-qadam, pog'onalar ko'rinadi")),
        S_summary("Hisobot", ["Sxema skrinshoti", "Ping natijasi", "OSI Model oynasi", "MAC jadvali"]),
    ],
    [
        Q("Packet Tracer da kompyuterni kommutatorga qaysi kabel bilan ulanadi?", ["Crossover", "Straight-Through", "Console", "Serial"], 1, "Turli turdagi qurilmalar — to'g'ri kabel."),
        Q("Paketni pog'onama-pog'ona ko'rish uchun qaysi rejim?", ["Realtime", "Simulation", "Logical", "Physical"], 1, "Simulation + Event List."),
        Q("Kommutatorning MAC jadvalini ko'rish buyrug'i?", ["show ip route", "show mac address-table", "show running-config", "ipconfig"], 1, "Privilegiyali rejimda."),
        Q("Kompyuterga IP qayerda beriladi (Packet Tracer)?", ["Config → Global", "Desktop → IP Configuration", "Physical", "Attributes"], 1, "Yoki Config → FastEthernet0."),
        Q("PC0 (192.168.1.10/24) va PC2 (192.168.1.200/25) ping qila oladimi?", ["Ha", "Yo'q — maskalar va tarmoq qismlari mos emas", "Faqat bir tomonga", "Faqat broadcast"], 1, "PC2 o'zini 192.168.1.128/25 tarmog'ida deb hisoblaydi."),
        Q("Qaysilar tarmoq emulyatorlari?", ["Cisco Packet Tracer", "GNS3", "Microsoft Word", "EVE-NG"], [0, 1, 3], "Word — matn muharriri."),
    ],
    [
        report_task(
            "2-laboratoriya hisoboti",
            "Packet Tracer da 4 kompyuterli LAN ni yig'ing, sozlang va tekshiring.",
            [
                "Brauzerdagi mini-emulyatorda 3 ta PC ga IP berib, ping qildim",
                "Packet Tracer da 2960 kommutator va 4 ta PC qo'ydim va uladim",
                "Kompyuterlarga 192.168.10.1–4/24 manzillarini berdim",
                "PC0 dan PC3 ga muvaffaqiyatli ping qildim",
                "Simulation rejimida ARP va ICMP paketlarini kuzatdim",
                "show mac address-table natijasini oldim",
                "Faylni lab2_familiya.pkt sifatida saqladim",
            ],
            "Birinchi ping nega javobsiz qolishi mumkinligini, Simulation rejimida ARP so'rovi va javobi qanday harakatlanganini va MAC jadvalida nima ko'rganingizni yozing.",
            min_images=3, max_images=5, min_chars=150,
        ),
        answer_task(
            "Mini-emulyator natijalari",
            "Brauzerdagi mini-emulyatorda tajriba qiling.",
            [
                F("PC0 (192.168.1.10/24) → PC2 (192.168.1.200/25): ping o'tadimi?", "choice", "Yo'q", options=["Ha", "Yo'q"]),
                F("PC2 ning /25 maskasida tarmoq manzili", "ip", "192.168.1.128"),
                F("Ikkalasini /24 qilsak, ping o'tadimi?", "choice", "Ha", options=["Ha", "Yo'q"]),
            ],
            hints=["Javob yo'li ham kerak: PC2 javobni o'z tarmog'ida deb hisoblamaydi."],
        ),
    ],
    coin=15, xp=30, minutes=80,
)

# ======================================================================
# 3-LABORATORIYA
# ======================================================================
L03 = T(
    "kt-l03-kodlash",
    "3-laboratoriya ishi: Berilganlarni kodlash usullari",
    """
<h2>Ishning maqsadi</h2>
<p>Fizik va mantiqiy kodlash usullarini amalda solishtirish, signal shakllarini qurish va kodlashning sinxronizatsiya hamda chastota polosasiga ta'sirini baholash.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>Mavzu sahifasidagi virtual simulyatsiya ("Signal kodlash" bo'limi)</li>
  <li>Katakli daftar yoki Excel / Google Sheets (grafik chizish uchun)</li>
</ul>

<h2>Ish tartibi</h2>
<ol>
  <li>Variant bo'yicha 12 bitli ketma-ketlikni oling: talabalar ro'yxatidagi tartib raqamingizni (N) ikkilik ko'rinishda 8 bitga yozing va oxiriga <code>0110</code> qo'shing. Masalan, N = 13 → <code>00001101</code> + <code>0110</code> = <code>000011010110</code>.</li>
  <li>Daftarda (yoki Excel da) ketma-ketlik uchun <b>NRZ-L, NRZI, Manchester, AMI</b> signal shakllarini chizing. Konventsiya: NRZ-L — 1 yuqori; NRZI — 1 da o'tish; Manchester — 0 ↓, 1 ↑ bit o'rtasida; AMI — 1 navbat bilan + / −.</li>
  <li>Simulyatsiyaga ketma-ketlikni kiriting va har bir kodda chizmangizni tekshiring. Farq bo'lsa — sababini toping.</li>
  <li>Har kod uchun jadval to'ldiring: sath o'zgarishlari soni, eng uzun o'zgarishsiz qism (bitlarda), o'z-o'zini sinxronlaydimi.</li>
  <li><code>00000000</code> va <code>11111111</code> ketma-ketliklarini NRZ-L, NRZI va Manchester da solishtiring. Qaysi kod ikkala holatda ham sinxronizatsiyani saqlaydi?</li>
  <li><b>4B/5B</b> rejimida o'z ketma-ketligingizning 5 bitli kodlarini yozing va ortiqchalikni hisoblang.</li>
</ol>

<h2>Natijalar jadvali (namuna)</h2>
<table>
  <tr><th>Kod</th><th>O'tishlar soni</th><th>Eng uzun tekis qism</th><th>Sinxronlash</th></tr>
  <tr><td>NRZ-L</td><td>…</td><td>…</td><td>yo'q</td></tr>
  <tr><td>NRZI</td><td>= 1 lar soni</td><td>…</td><td>faqat 1 larda</td></tr>
  <tr><td>Manchester</td><td>≥ bitlar soni</td><td>1 bit</td><td>ha</td></tr>
  <tr><td>AMI</td><td>…</td><td>…</td><td>uzun 0 larda yo'q</td></tr>
</table>

<h2>Hisobot talablari</h2>
<ul>
  <li>Qo'lda (yoki Excel da) chizilgan to'rt signal shakli — rasm.</li>
  <li>Simulyatsiyadagi Manchester va 4B/5B natijasi skrinshoti.</li>
  <li>To'ldirilgan natijalar jadvali va xulosa.</li>
</ul>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega 10 Mbit/s Ethernet Manchester ni, 100 Mbit/s esa MLT-3 + 4B/5B ni tanlagan?</li>
  <li>AMI da xatoni qanday aniqlash mumkin?</li>
  <li>4B/5B ning foydali tezlikka nisbati qanday?</li>
</ol>
""",
    [
        S_title("Kodlash usullari", "3-laboratoriya ishi", "〰️"),
        S_code("Variant", "N = 13 → 00001101\n+ 0110 → 000011010110"),
        S_table("Konventsiya", ["Kod", "Qoida"], [["NRZ-L", "1 — yuqori"], ["NRZI", "1 — o'tish"], ["Manchester", "0 ↓, 1 ↑ o'rtada"], ["AMI", "1 — +/− navbat"]]),
        S_quiz("00000000 ketma-ketligida qaysi kod sinxronizatsiyani saqlaydi?", ["NRZ-L", "NRZI", "Manchester", "AMI"], 2, "Har bit o'rtasida o'tish bor."),
        S_idea("Narx", "Manchester o'z-o'zini sinxronlaydi, lekin 2 baravar keng polosa talab qiladi. 4B/5B esa 25% ortiqcha bit bilan muammoni hal qiladi.", "⚖️"),
        S_summary("Hisobot", ["4 ta signal shakli (qo'lda)", "Simulyatsiya skrinshoti", "Natijalar jadvali"]),
    ],
    [
        Q("NRZI da 1011 uchun nechta o'tish bor?", ["1", "2", "3", "4"], 2, "1 lar soni — 3."),
        Q("Manchester da 8 bit uchun kamida nechta o'tish?", ["4", "8", "16", "0"], 1, "Har bit o'rtasida bittadan."),
        Q("AMI da 1 lar qanday kodlanadi?", ["Doim +", "Navbat bilan + va −", "Nol sath", "Ikki o'tish"], 1, "Bipolyar kod."),
        Q("4B/5B da 4 bayt (32 bit) uchun nechta bit uzatiladi?", ["32", "36", "40", "64"], 2, "32 × 5/4 = 40."),
        Q("Uzun 1 lar ketma-ketligida NRZ-L ning muammosi?", ["Shovqin", "Sath o'zgarmaydi — sinxronizatsiya yo'qoladi", "Tezlik oshadi", "Hech qanday"], 1, "Qabul qiluvchi bit chegaralarini yo'qotadi."),
        Q("Qaysi kodlar uzun nollar ketma-ketligida sinxronizatsiyani yo'qotadi?", ["NRZ-L", "NRZI", "Manchester", "AMI"], [0, 1, 3], "Manchester har bitda o'tish qiladi."),
    ],
    [
        report_task(
            "3-laboratoriya hisoboti",
            "O'z variantingiz uchun signal shakllarini chizing va simulyatsiya bilan tekshiring.",
            [
                "Variant ketma-ketligini hosil qildim (N + 0110)",
                "NRZ-L, NRZI, Manchester va AMI shakllarini qo'lda chizdim",
                "Har birini simulyatsiyada tekshirdim",
                "Natijalar jadvalini to'ldirdim",
                "00000000 va 11111111 da kodlarni solishtirdim",
                "4B/5B kodlarini yozdim va ortiqchalikni hisobladim",
            ],
            "Variant raqamingiz va ketma-ketlikni yozing. Qaysi kod sinxronizatsiya uchun eng yaxshi va qaysi biri polosani tejaydi — natijalaringiz asosida asoslang.",
            min_images=2, max_images=5, min_chars=150,
        ),
        answer_task(
            "Tekshiruv",
            "Ketma-ketlik: 101100111000.",
            [
                F("NRZI dagi o'tishlar soni", "number", "101100111000".count("1")),
                F("NRZ-L da qo'shni bitlar orasidagi o'tishlar", "number", sum(1 for a, b in zip("101100111000", "101100111000"[1:]) if a != b)),
                F("4B/5B dan keyin bitlar soni", "number", 15),
            ],
        ),
    ],
    coin=15, xp=30, minutes=80,
)

# ======================================================================
# 4-LABORATORIYA
# ======================================================================
L04 = T(
    "kt-l04-wireshark",
    "4-laboratoriya ishi: Ethernet va Fast Ethernet. Tarmoq snifferi (Wireshark) yordamida paketlarni tahlil qilish",
    """
<h2>Ishning maqsadi</h2>
<p>Wireshark yordamida trafikni ushlash, displey filtrlaridan foydalanish va Ethernet, ARP, IP, TCP, DNS, HTTP paketlarining tuzilishini tahlil qilish.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li><b>Wireshark</b> (wireshark.org, bepul). Windows'da o'rnatishda Npcap ni ham o'rnating.</li>
  <li>Internetga ulangan kompyuter</li>
  <li>Mavzu sahifasidagi paket tahlilchisi simulyatsiyasi (o'rnatishdan oldin mashq uchun)</li>
</ul>
<blockquote>Muhim: trafikni faqat o'z kompyuteringizda yoki ruxsat berilgan tarmoqda ushlang. Boshqalarning trafikini ruxsatsiz tinglash qonunga zid.</blockquote>

<h2>Ish tartibi</h2>
<h3>1-qism. Simulyatsiyada mashq</h3>
<ol>
  <li>Filtrlarni sinab ko'ring: <code>arp</code>, <code>dns</code>, <code>tcp.flags.syn == 1</code>, <code>ip.addr == 8.8.8.8 &amp;&amp; icmp</code>, <code>!tcp</code>.</li>
  <li>HTTP GET paketini (12-paket) tanlab, pog'onalar daraxtini o'qing.</li>
</ol>
<h3>2-qism. Wireshark da ushlash</h3>
<ol>
  <li>Wireshark ni oching, faol interfeysni (Ethernet yoki Wi-Fi — grafigi "tirik" bo'lgan) tanlang va ushlashni boshlang.</li>
  <li>Buyruq qatorida: <code>ipconfig /flushdns</code>, <code>arp -d *</code> (administrator sifatida), keyin <code>ping miracademy.uz</code>.</li>
  <li>Brauzerda <code>http://example.com</code> (HTTP!) va <code>https://miracademy.uz</code> ni oching.</li>
  <li>Ushlashni to'xtating (qizil kvadrat). Faylni <code>lab4_familiya.pcapng</code> sifatida saqlang.</li>
</ol>
<h3>3-qism. Tahlil</h3>
<ol>
  <li><code>arp</code> filtri: shlyuzga ARP so'rovi va javobini toping. So'rovning manzil MAC i nima? Javobdagi shlyuz MAC i?</li>
  <li><code>dns</code> filtri: miracademy.uz uchun so'rov va javob. Qaysi DNS serverga ketdi? Javobda qaysi IP keldi?</li>
  <li><code>icmp</code> filtri: Echo request va reply. TTL qiymatlarini yozing.</li>
  <li><code>tcp.flags.syn == 1</code>: example.com bilan uch bosqichli ulanishni toping. Portlar va seq/ack?</li>
  <li><code>http</code> filtri: GET so'rovi va 200 OK javobi. Javob tanasida HTML ochiq ko'rinadimi?</li>
  <li><code>tls</code> filtri: miracademy.uz uchun Client Hello. SNI maydonida nima yozilgan? Keyingi paketlar mazmunini o'qiy olasizmi?</li>
  <li>Istalgan Ethernet kadrni tanlab: manba/manzil MAC, EtherType, kadr uzunligi.</li>
  <li>Statistics → Protocol Hierarchy: qaysi protokol eng ko'p trafik oldi?</li>
</ol>

<h2>Hisobot talablari</h2>
<ul>
  <li>ARP so'rov/javob, DNS javob, TCP qo'l berishish va HTTP GET paketlarining skrinshotlari (pog'onalar daraxti ochilgan).</li>
  <li>HTTP va HTTPS (TLS) farqi bo'yicha xulosa.</li>
  <li>Protocol Hierarchy skrinshoti.</li>
</ul>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega ARP paketida IP sarlavha yo'q?</li>
  <li>HTTPS trafikida sniffer nimani ko'ra oladi va nimani ko'ra olmaydi?</li>
  <li>Kommutatorli tarmoqda nega boshqa kompyuterlarning trafikini odatda ko'rmaysiz?</li>
</ol>
""",
    [
        S_title("Wireshark bilan tahlil", "4-laboratoriya ishi", "🦈"),
        S_table("Displey filtrlari", ["Filtr", "Nima"], [["arp", "ARP"], ["dns", "DNS"], ["tcp.flags.syn == 1", "Ulanish boshlari"], ["ip.addr == 8.8.8.8", "Shu manzil bilan"], ["http", "Ochiq HTTP"], ["tls", "Shifrlangan"]]),
        S_points("Ish rejasi", [("▶️", "Interfeysni tanlab ushlash"), ("🧹", "flushdns, arp -d *"), ("📡", "ping va saytlarni ochish"), ("⏹️", "To'xtatib, saqlash"), ("🔎", "Filtrlar bilan tahlil")]),
        S_quiz("HTTPS da sniffer nimani ko'radi?", ["Login va parol", "Sahifa matni", "Server nomi (SNI) va IP lar", "Hech narsa"], 2, "Mazmun shifrlangan, ulanish ma'lumotlari ko'rinadi."),
        S_idea("Odob qoidasi", "Faqat o'z kompyuteringiz yoki ruxsat berilgan tarmoqda ushlang.", "⚖️"),
        S_quiz("Kommutatorli tarmoqda boshqa kompyuter trafigini nega ko'rmaysiz?", ["Wireshark taqiqlaydi", "Kommutator kadrni faqat kerakli portga yuboradi", "Trafik shifrlangan", "IP boshqa"], 1, "Faqat o'zingizga, broadcast va multicast kadrlar keladi."),
        S_summary("Hisobot", ["ARP, DNS, TCP, HTTP skrinshotlari", "HTTP va TLS farqi", "Protocol Hierarchy"]),
    ],
    [
        Q("Wireshark Windows'da paket ushlash uchun qaysi drayverdan foydalanadi?", ["Npcap", "DirectX", "NDIS Lite", "WinPE"], 0, "O'rnatishda Npcap ham o'rnatiladi."),
        Q("Faqat DNS paketlarini ko'rsatuvchi filtr?", ["port dns", "dns", "udp.dns", "show dns"], 1, "Displey filtri: dns."),
        Q("ARP kadrining EtherType qiymati?", ["0x0800", "0x0806", "0x86DD", "0x8100"], 1, "0x0806."),
        Q("TLS Client Hello da ochiq ketadigan maydon?", ["Parol", "SNI (sayt nomi)", "Cookie", "HTML"], 1, "Server Name Indication."),
        Q("TCP ulanish boshlanishini topish filtri?", ["tcp.flags.syn == 1", "tcp.fin", "syn", "tcp.port == 0"], 0, "SYN bayrog'i o'rnatilgan segmentlar."),
        Q("Qaysi trafik Wireshark da ochiq matnda ko'rinadi?", ["HTTP", "DNS (oddiy)", "HTTPS mazmuni", "Telnet"], [0, 1, 3], "HTTPS mazmuni shifrlangan."),
    ],
    [
        report_task(
            "4-laboratoriya hisoboti",
            "O'z kompyuteringizda trafikni ushlang va tahlil qiling.",
            [
                "Simulyatsiyada filtrlarni mashq qildim",
                "Wireshark da trafikni ushladim va .pcapng faylini saqladim",
                "ARP so'rov va javobini topdim (skrinshot)",
                "DNS so'rov va javobini topdim (skrinshot)",
                "TCP uch bosqichli ulanishni topdim (skrinshot)",
                "HTTP GET va 200 OK ni ko'rdim (skrinshot)",
                "TLS Client Hello dagi SNI ni aniqladim",
                "Protocol Hierarchy statistikasini oldim",
            ],
            "Shlyuzingizning MAC manzili, DNS server manzili va miracademy.uz IP manzilini yozing. HTTP va HTTPS paketlarida nimani ko'rdingiz va nimani ko'ra olmadingiz?",
            min_images=4, max_images=6, min_chars=200,
        ),
        answer_task(
            "Simulyatsiyadagi ushlash",
            "Mavzu sahifasidagi paket tahlilchisidan foydalaning.",
            [
                F("Shlyuzning MAC manzili", "text", ["3c:84:6a:11:0f:20", "3C-84-6A-11-0F-20", "3c-84-6a-11-0f-20"]),
                F("miracademy.uz qaysi IP ga aylangan?", "ip", "76.76.21.21"),
                F("ping 8.8.8.8 javobidagi TTL", "number", 117),
                F("HTTP GET so'rovidagi Host sarlavhasi", "text", "example.com"),
            ],
            hints=["Filtrlar: arp, dns, icmp, http."],
        ),
    ],
    coin=15, xp=30, minutes=90,
)

# ======================================================================
# 5-LABORATORIYA
# ======================================================================
L05 = T(
    "kt-l05-wifi",
    "5-laboratoriya ishi: Simsiz axborot uzatish texnologiyalari. Wi-Fi tarmog'ini sozlash",
    """
<h2>Ishning maqsadi</h2>
<p>Simsiz marshrutizatorni sozlash (SSID, shifrlash, kanal), simsiz tarmoq holatini tahlil qilish va xavfsizlik talablarini qo'llash.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>Wi-Fi marshrutizator (laboratoriya yoki uydagi) yoki Packet Tracer dagi <b>WRT300N</b> / Home Router</li>
  <li>Wi-Fi adapterli noutbuk yoki smartfon</li>
  <li>Smartfon uchun Wi-Fi analizator ilovasi (masalan, "WiFiAnalyzer" — ixtiyoriy)</li>
</ul>
<blockquote>Uydagi routerni sozlayotgan bo'lsangiz, o'zgartirishdan oldin joriy sozlamalarni yozib oling yoki zaxira nusxasini oling.</blockquote>

<h2>Ish tartibi</h2>
<h3>1-qism. Joriy holat</h3>
<ol>
  <li>Buyruq qatorida: <code>netsh wlan show interfaces</code> — SSID, BSSID, kanal, radio turi (802.11ac/ax), signal (%), tezlik.</li>
  <li><code>netsh wlan show networks mode=bssid</code> — atrofdagi tarmoqlar va ularning kanallari. Ro'yxatni yozib oling.</li>
  <li>Analizator ilovasi bo'lsa, 2,4 GHz kanal grafigini skrinshot qiling.</li>
</ol>
<h3>2-qism. Routerni sozlash</h3>
<ol>
  <li>Routerning boshqaruv sahifasini oching (odatda <code>http://192.168.0.1</code> yoki <code>192.168.1.1</code>; manzil — <code>ipconfig</code> dagi shlyuz).</li>
  <li><b>Admin parolini</b> o'zgartiring (standart admin/admin qoldirilmasin).</li>
  <li>SSID: <code>KT-Lab-Familiya</code>.</li>
  <li>Shifrlash: <b>WPA2-PSK (AES)</b> yoki <b>WPA3</b>; kamida 12 belgili kuchli parol.</li>
  <li>2,4 GHz kanal: 1-qismdagi ma'lumot asosida eng bo'sh kanalni <b>1, 6 yoki 11</b> dan tanlang.</li>
  <li><b>WPS</b> ni o'chiring.</li>
  <li>Imkon bo'lsa, mehmonlar tarmog'ini (Guest) alohida yoqing.</li>
  <li>Sozlamalarni saqlang, qurilmani yangi SSID ga ulang va <code>netsh wlan show interfaces</code> ni qayta bajaring.</li>
</ol>
<h3>3-qism (Packet Tracer varianti)</h3>
<ol>
  <li>Wireless Router (WRT300N) va 2 ta noutbuk qo'ying; noutbuklarda Ethernet modulini o'chirib, <b>WPC300N</b> simsiz modulini o'rnating (Physical yorlig'i, quvvat o'chiq holatda).</li>
  <li>Router → GUI → Wireless: SSID, WPA2 Personal, AES, parol.</li>
  <li>Noutbuk → Desktop → PC Wireless → Connect: tarmoqni topib ulaning. Ikki noutbuk orasida ping qiling.</li>
</ol>
<h3>4-qism. Simulyatsiya</h3>
<p>Mavzu simulyatsiyasida uch kirish nuqtasi uchun kanallarni taqsimlang va xavfsizlik bahosini 80% dan oshiring. CSMA/CA da RTS/CTS siz va RTS/CTS bilan ssenariylarni solishtiring.</p>

<h2>Hisobot talablari</h2>
<ul>
  <li><code>netsh wlan show interfaces</code> natijasi (sozlashdan oldin va keyin).</li>
  <li>Router xavfsizlik sozlamalari sahifasi (parolni yashiring!).</li>
  <li>Atrofdagi tarmoqlar ro'yxati yoki kanal grafigi.</li>
</ul>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega 2,4 GHz da faqat 1, 6, 11 kanallar tavsiya etiladi?</li>
  <li>SSID ni yashirish nega himoya emas?</li>
  <li>WPS nima uchun xavfli?</li>
</ol>
""",
    [
        S_title("Wi-Fi ni sozlash", "5-laboratoriya ishi", "📶"),
        S_code("Holatni ko'rish", "netsh wlan show interfaces\nnetsh wlan show networks mode=bssid", output="SSID       : KT-Lab\nRadio type : 802.11ax\nChannel    : 6\nSignal     : 87%"),
        S_points("Xavfsiz sozlamalar", [("🔑", "Admin parolini o'zgartirish"), ("🔒", "WPA2-AES yoki WPA3"), ("📏", "Parol ≥ 12 belgi"), ("📡", "Kanal 1 / 6 / 11"), ("🚫", "WPS o'chiq"), ("👥", "Mehmon tarmog'i")]),
        S_quiz("Qo'shni routerlar 1 va 6-kanalda. Siz qaysini tanlaysiz?", ["3", "6", "11", "1"], 2, "Bir-birini qoplamaydigan va bo'sh kanal."),
        S_idea("SSID yashirish", "Himoya emas: tarmoq nomi ulanish so'rovlarida baribir ochiq ketadi. Ishonchli himoya — WPA2/WPA3 va kuchli parol.", "🙈"),
        S_summary("Hisobot", ["netsh natijalari (oldin/keyin)", "Router sozlamalari", "Kanal tahlili"]),
    ],
    [
        Q("Ulangan Wi-Fi tarmoq kanalini qaysi buyruq ko'rsatadi?", ["ipconfig", "netsh wlan show interfaces", "arp -a", "tracert"], 1, "Kanal, signal, radio turi."),
        Q("Eng ishonchli shifrlash?", ["WEP", "WPA-TKIP", "WPA2-AES", "WPA3"], 3, "WPA3 SAE — parolni oflayn tanlashdan himoya."),
        Q("WPS ni nega o'chirish kerak?", ["Tezlikni pasaytiradi", "PIN orqali tez buzilishi mumkin", "Kanalni band qiladi", "Kerak emas"], 1, "8 xonali PIN ikki qismda tekshiriladi va tanlab topiladi."),
        Q("BSSID nima?", ["Tarmoq nomi", "Kirish nuqtasi radiomodulining MAC manzili", "Parol", "Kanal raqami"], 1, "SSID — nom, BSSID — AP MAC."),
        Q("Packet Tracer da noutbukka Wi-Fi modul o'rnatishdan oldin nima qilinadi?", ["IP beriladi", "Qurilma quvvati o'chiriladi", "Router o'chiriladi", "SSID yoziladi"], 1, "Modul faqat o'chiq qurilmaga o'rnatiladi."),
        Q("Qaysilar simsiz tarmoq xavfsizligini oshiradi?", ["WPA3", "Kuchli parol", "WPS ni yoqish", "Mehmon tarmog'ini ajratish"], [0, 1, 3], "WPS xavfli."),
    ],
    [
        report_task(
            "5-laboratoriya hisoboti",
            "Simsiz routerni sozlang (real yoki Packet Tracer) va natijani hujjatlashtiring.",
            [
                "netsh wlan show interfaces bilan joriy holatni yozib oldim",
                "Atrofdagi tarmoqlar va kanallarni aniqladim",
                "Admin parolini o'zgartirdim",
                "SSID va WPA2/WPA3 shifrlashni sozladim",
                "Bo'sh kanalni (1/6/11) tanladim",
                "WPS ni o'chirdim",
                "Qayta ulanib, natijani tekshirdim",
                "Simulyatsiyada kanal rejasi va xavfsizlik bahosini oshirdim",
            ],
            "Qaysi kanalni tanladingiz va nima uchun (atrofdagi tarmoqlar asosida)? Qaysi xavfsizlik sozlamalarini qo'lladingiz? Skrinshotlarda parollar ko'rinmasin.",
            min_images=2, max_images=5, min_chars=150,
        ),
        answer_task(
            "Kanal tanlash",
            "Analizator ko'rsatdi: 1-kanalda 5 ta tarmoq, 6-kanalda 2 ta, 11-kanalda 4 ta, 3-kanalda 1 ta.",
            [
                F("Qaysi kanalni tanlaysiz?", "choice", "6", options=["1", "3", "6", "11"]),
                F("3-kanaldagi tarmoq qaysi kanallar bilan qoplanadi? Eng kichigi", "number", 1),
                F("…va eng kattasi", "number", 7),
            ],
            hints=["Kanal n spektri n−4 … n+4 kanallarni qoplaydi (taxminan).", "3-kanal tanlanmaydi — u 1 va 6 ikkalasiga ham xalaqit beradi."],
        ),
    ],
    coin=15, xp=30, minutes=80,
)

TOPICS = [L01, L02, L03, L04, L05]
