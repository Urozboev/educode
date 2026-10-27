"""Ma'ruzalar 11–15 (KT1406 fan dasturi, II bo'lim)."""

from kt import (T, Q, F, answer_task, S_title, S_idea, S_points, S_table, S_compare, S_code, S_quiz, S_summary)

# ======================================================================
# 11-MA'RUZA
# ======================================================================
M11 = T(
    "kt-m11-internet-dns",
    "11-ma'ruza: Internet tarmog'i va DNS xizmati",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Internet tuzilishi: provayderlar, avtonom tizimlar, almashuv nuqtalari</li>
  <li>Internetni boshqaruvchi tashkilotlar</li>
  <li>Internetga ulanish texnologiyalari</li>
  <li>DNS: domenlar ierarxiyasi</li>
  <li>Nomni aniqlash jarayoni</li>
  <li>DNS yozuvlari va keshlash</li>
</ol>

<h2>1. Internet tuzilishi</h2>
<p><b>Internet</b> — TCP/IP asosida o'zaro ulangan minglab mustaqil tarmoqlarning global tarmog'i ("tarmoqlar tarmog'i"). Har bir yirik tarmoq — <b>avtonom tizim</b> (AS): o'z marshrutlash siyosatiga ega va noyob AS raqamiga ega (masalan, provayder yoki yirik kompaniya). Avtonom tizimlar bir-biri bilan BGP protokoli orqali marshrut almashadi.</p>
<ul>
  <li><b>Provayderlar (ISP)</b> ierarxiyasi: 1-darajali (global magistral egalari, bir-biri bilan bepul almashadi), 2-darajali (mintaqaviy), 3-darajali (oxirgi foydalanuvchiga xizmat ko'rsatuvchi).</li>
  <li><b>Trafik almashuv nuqtalari (IXP)</b> — provayderlar trafikni bevosita almashadigan joylar: mahalliy trafik chet elga chiqmay, tezroq va arzonroq yetkaziladi.</li>
  <li><b>Magistral kanallar</b> — qit'alar orasidagi suv osti optik kabellari va quruqlikdagi optik liniyalar. Xalqaro trafikning asosiy qismi suv osti kabellari orqali o'tadi.</li>
</ul>

<h2>2. Tashkilotlar</h2>
<table>
  <tr><th>Tashkilot</th><th>Vazifasi</th></tr>
  <tr><td>ICANN / IANA</td><td>IP manzillar, AS raqamlari va ildiz DNS zonasini global muvofiqlashtirish</td></tr>
  <tr><td>RIR (RIPE NCC, ARIN, APNIC, LACNIC, AFRINIC)</td><td>Mintaqaviy registratorlar: IP bloklarni taqsimlaydi. O'zbekiston RIPE NCC hududida</td></tr>
  <tr><td>IETF</td><td>Internet protokollari standartlari (RFC)</td></tr>
  <tr><td>W3C</td><td>Veb standartlari (HTML, CSS)</td></tr>
  <tr><td>IEEE</td><td>Lokal tarmoq standartlari (802.3, 802.11)</td></tr>
</table>

<h2>3. Ulanish texnologiyalari</h2>
<ul>
  <li><b>xDSL (ADSL)</b> — telefon liniyasi orqali; asimmetrik: yuklab olish tezroq.</li>
  <li><b>FTTH / GPON</b> — optik tola uygacha; yuzlab Mbit/s va undan yuqori.</li>
  <li><b>Kabel (DOCSIS)</b> — kabel televideniyesi tarmog'i orqali.</li>
  <li><b>Mobil (4G LTE, 5G)</b> — radio orqali, harakatda.</li>
  <li><b>Sun'iy yo'ldosh</b> — chekka hududlar uchun; past orbitali tizimlar kechikishni kamaytirdi.</li>
</ul>

<h2>4. DNS</h2>
<p>Odamlar nomlarni (<code>miracademy.uz</code>), kompyuterlar esa IP manzillarni ishlatadi. <b>DNS</b> (Domain Name System) — nomlarni IP manzillarga aylantiruvchi taqsimlangan ierarxik ma'lumotlar bazasi. Bitta markaziy server emas: har bir zona uchun o'z serverlari mas'ul.</p>
<h3>Ierarxiya</h3>
<pre><code>                 . (ildiz)
        ┌────────┼─────────┐
       com       uz        org            ← yuqori darajali domenlar (TLD)
                 │
            miracademy                    ← ikkinchi daraja
                 │
                www                       ← quyi domen (xost)</code></pre>
<ul>
  <li><b>TLD</b> turlari: umumiy (gTLD: .com, .org, .net, .edu) va mamlakat (ccTLD: .uz, .ru, .de).</li>
  <li><b>FQDN</b> — to'liq nom, oxirida ildiz nuqtasi bilan: <code>www.miracademy.uz.</code></li>
  <li><b>Zona</b> — bitta tashkilot boshqaradigan nomlar maydoni qismi; zona yozuvlari <b>avtoritar</b> (authoritative) serverda saqlanadi.</li>
  <li><b>Ildiz serverlari</b> — 13 ta nomli guruh (a.root-servers.net … m.root-servers.net), har biri dunyo bo'ylab yuzlab nusxalarda (anycast).</li>
</ul>

<h2>5. Nomni aniqlash</h2>
<ol>
  <li>Kompyuter avval o'z <b>keshini</b> va <code>hosts</code> faylini tekshiradi.</li>
  <li>Topilmasa, sozlamalardagi DNS serverga (odatda provayder yoki router) <b>rekursiv</b> so'rov yuboradi: "menga yakuniy javobni ber".</li>
  <li>Rekursiv server keshida bo'lmasa, <b>iterativ</b> so'raydi: ildiz → ".uz serverlariga boring" → .uz TLD → "ns1.miracademy.uz ga boring" → avtoritar server → <b>A yozuvi</b>.</li>
  <li>Javob har bosqichda <b>TTL</b> muddatigacha keshlanadi. Keyingi so'rov darhol javob oladi.</li>
</ol>
<p>DNS asosan <b>UDP 53</b> portida ishlaydi; katta javoblar va zonani ko'chirish (serverlar orasida) — <b>TCP 53</b>.</p>

<h2>6. Yozuv turlari</h2>
<table>
  <tr><th>Tur</th><th>Vazifasi</th><th>Misol</th></tr>
  <tr><td><b>A</b></td><td>Nom → IPv4</td><td>miracademy.uz → 76.76.21.21</td></tr>
  <tr><td><b>AAAA</b></td><td>Nom → IPv6</td><td>→ 2001:db8::1</td></tr>
  <tr><td><b>CNAME</b></td><td>Taxallus — boshqa nomga ishora</td><td>www → miracademy.uz</td></tr>
  <tr><td><b>MX</b></td><td>Domenning pochta serveri (ustuvorlik bilan)</td><td>MX 10 mail.misol.uz</td></tr>
  <tr><td><b>NS</b></td><td>Zona uchun mas'ul DNS serverlar</td><td>ns1.misol.uz</td></tr>
  <tr><td><b>PTR</b></td><td>Teskari: IP → nom</td><td>10.1.168.192.in-addr.arpa → pc10.misol.uz</td></tr>
  <tr><td><b>TXT</b></td><td>Ixtiyoriy matn: SPF, domen egaligini tasdiqlash</td><td>"v=spf1 …"</td></tr>
  <tr><td><b>SOA</b></td><td>Zona haqida asosiy ma'lumot: asosiy server, seriya raqami, taymerlar</td><td>—</td></tr>
</table>
<p><b>Teskari zona</b> nomi IP oktetlarini teskari tartibda yozib, <code>in-addr.arpa</code> qo'shib hosil qilinadi: 192.168.1.0/24 tarmog'i uchun — <code>1.168.192.in-addr.arpa</code>.</p>
<p>Tekshirish buyruqlari: <code>nslookup miracademy.uz</code>, <code>nslookup -type=mx gmail.com</code>, <code>ipconfig /displaydns</code> (kesh), <code>ipconfig /flushdns</code> (keshni tozalash).</p>
<blockquote>DNS soxtalashtirish (spoofing) hujumida hujumchi keshga soxta javob joylab, foydalanuvchini qalbaki saytga yo'naltiradi. Himoya — DNSSEC (yozuvlarning raqamli imzosi) va ishonchli DNS serverlardan foydalanish.</blockquote>

<h2>Nazorat savollari</h2>
<ol>
  <li>Avtonom tizim nima va ular qanday protokol bilan bog'lanadi?</li>
  <li>Rekursiv va iterativ so'rov farqi nimada?</li>
  <li>A, CNAME va MX yozuvlarining vazifasini ayting.</li>
  <li>10.20.30.0/24 tarmog'ining teskari zonasi qanday nomlanadi?</li>
  <li>TTL qiymatini juda katta qilib qo'yishning kamchiligi nimada?</li>
</ol>
""",
    [
        S_title("Internet va DNS", "Tarmoqlar tarmog'i va nomlar tizimi", "🌐"),
        S_points("Internet tuzilishi", [("🏢", "Avtonom tizimlar (AS), BGP"), ("📶", "Provayderlar ierarxiyasi"), ("🔀", "Trafik almashuv nuqtalari (IXP)"), ("🌊", "Suv osti optik kabellari")]),
        S_code("DNS ierarxiyasi", ".  (ildiz)\n└── uz          ← TLD\n    └── miracademy   ← ikkinchi daraja\n        └── www      ← xost"),
        S_compare("So'rov turlari", ("Rekursiv", "Kompyuter → lokal DNS: 'yakuniy javob ber'"), ("Iterativ", "Lokal DNS → ildiz → TLD → avtoritar: 'kimdan so'rash kerak?'")),
        S_table("Yozuv turlari", ["Tur", "Vazifa"], [["A / AAAA", "Nom → IPv4 / IPv6"], ["CNAME", "Taxallus"], ["MX", "Pochta serveri"], ["NS", "Zona serverlari"], ["PTR", "IP → nom"]]),
        S_quiz("gmail.com ga xat yuborish uchun server qaysi yozuvni so'raydi?", ["A", "MX", "PTR", "CNAME"], 1, "MX — domenning pochta serveri."),
        S_idea("Keshlash va TTL", "Har javob TTL muddatigacha keshlanadi. Shuning uchun DNS yozuvini o'zgartirgach, yangi qiymat hamma joyda darhol emas, TTL tugagach ko'rinadi.", "⏳"),
        S_code("Tekshirish", "nslookup miracademy.uz\nnslookup -type=mx gmail.com\nipconfig /flushdns"),
        S_quiz("192.168.1.0/24 ning teskari zonasi?", ["192.168.1.in-addr.arpa", "1.168.192.in-addr.arpa", "0.1.168.192.arpa", "192.168.1.0.in-addr"], 1, "Oktetlar teskari tartibda + in-addr.arpa."),
        S_summary("Xulosa", ["Internet — BGP orqali bog'langan avtonom tizimlar", "DNS — taqsimlangan ierarxik baza", "Rekursiv + iterativ aniqlash, TTL bo'yicha kesh", "A, AAAA, CNAME, MX, NS, PTR"]),
    ],
    [
        Q("DNS asosan qaysi protokol va portda ishlaydi?", ["TCP 80", "UDP 53", "UDP 67", "TCP 25"], 1, "Zonani ko'chirish va katta javoblar — TCP 53."),
        Q("Nom → IPv4 manzilni qaysi yozuv beradi?", ["AAAA", "A", "PTR", "MX"], 1, "AAAA — IPv6, PTR — teskari."),
        Q(".uz qanday domen?", ["Umumiy TLD (gTLD)", "Mamlakat TLD (ccTLD)", "Ikkinchi darajali", "Ildiz"], 1, "Mamlakat kodli yuqori darajali domen."),
        Q("Kompyuter lokal DNS serverga qanday so'rov yuboradi?", ["Iterativ", "Rekursiv", "Teskari", "Zona ko'chirish"], 1, "Kompyuter yakuniy javobni kutadi; lokal server esa boshqalardan iterativ so'raydi."),
        Q("Avtonom tizimlar orasida marshrut almashish protokoli?", ["OSPF", "RIP", "BGP", "DNS"], 2, "BGP — Internetning \"yelim\" protokoli."),
        Q("IP bloklarni Yevropa va Markaziy Osiyoda qaysi registrator taqsimlaydi?", ["ARIN", "APNIC", "RIPE NCC", "LACNIC"], 2, "O'zbekiston RIPE NCC xizmat hududida."),
        Q("Qaysi yozuvlar to'g'ri tavsiflangan?", ["CNAME — taxallus", "NS — zona uchun mas'ul serverlar", "MX — IPv6 manzil", "PTR — teskari aniqlash"], [0, 1, 3], "IPv6 — AAAA."),
    ],
    [
        answer_task(
            "Yozuv turini tanlang",
            "Har vazifa uchun kerakli DNS yozuv turini tanlang.",
            [
                F("misol.uz saytining IPv4 manzili", "choice", "A", options=["A", "AAAA", "CNAME", "MX", "PTR", "NS"]),
                F("www.misol.uz ni misol.uz ga taxallus qilish", "choice", "CNAME", options=["A", "AAAA", "CNAME", "MX", "PTR", "NS"]),
                F("misol.uz uchun pochta serveri", "choice", "MX", options=["A", "AAAA", "CNAME", "MX", "PTR", "NS"]),
                F("192.168.1.10 qaysi nomga tegishli", "choice", "PTR", options=["A", "AAAA", "CNAME", "MX", "PTR", "NS"]),
            ],
        ),
        answer_task(
            "Domen nomi",
            "To'liq nom: lab3.kafedra.buxdu.uz",
            [
                F("Yuqori darajali domen (TLD)", "text", ["uz", ".uz"]),
                F("Ikkinchi darajali domen", "text", ["buxdu.uz", "buxdu"]),
                F("10.20.30.0/24 tarmog'ining teskari zonasi nomi", "text", "30.20.10.in-addr.arpa"),
            ],
            hints=["Teskari zona: uchta oktetni teskari tartibda yozing va .in-addr.arpa qo'shing."],
        ),
    ],
)

# ======================================================================
# 12-MA'RUZA
# ======================================================================
M12 = T(
    "kt-m12-server-ot",
    "12-ma'ruza: Server operatsion tizimlar va ishchi guruhlar. Domenli tizimlar",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Server operatsion tizimning vazifalari</li>
  <li>Server OT turlari</li>
  <li>Server rollari</li>
  <li>Ishchi guruh (workgroup)</li>
  <li>Domen va Active Directory</li>
</ol>

<h2>1. Server OT vazifalari</h2>
<p><b>Server operatsion tizim</b> — tarmoqdagi ko'plab foydalanuvchilarga bir vaqtda xizmat ko'rsatishga mo'ljallangan OT. Oddiy (ish stoli) OT dan farqi:</p>
<ul>
  <li>ko'p foydalanuvchili rejim va ko'plab bir vaqtdagi ulanishlar;</li>
  <li>tarmoq xizmatlari: fayl, chop etish, DNS, DHCP, veb, pochta, ma'lumotlar bazasi;</li>
  <li>markazlashgan foydalanuvchilar va xavfsizlik boshqaruvi;</li>
  <li>ishonchlilik: RAID disklar, klasterlash, zaxira nusxa, uzoq uzluksiz ishlash;</li>
  <li>masofadan boshqarish: PowerShell, SSH, veb-konsollar;</li>
  <li>virtualizatsiya (Hyper-V, KVM) va konteynerlar.</li>
</ul>

<h2>2. Server OT turlari</h2>
<table>
  <tr><th>Oila</th><th>Misollar</th><th>Xususiyati</th></tr>
  <tr><td>Windows Server</td><td>2016, 2019, 2022, 2025</td><td>Active Directory, grafik boshqaruv (Server Manager), korporativ muhitda keng tarqalgan</td></tr>
  <tr><td>Linux</td><td>Ubuntu Server, Debian, RHEL, Rocky Linux</td><td>Bepul yoki arzon, veb va bulut serverlarining asosiy qismi</td></tr>
  <tr><td>Unix</td><td>FreeBSD</td><td>Barqarorlik, tarmoq xizmatlari</td></tr>
</table>
<p>Windows Server nashrlari: <b>Standard</b> (kichik va o'rta tashkilot), <b>Datacenter</b> (ko'p virtual mashina), <b>Essentials</b> (kichik biznes). O'rnatish turlari: <b>Desktop Experience</b> (grafik interfeys bilan) va <b>Server Core</b> (grafik interfeyssiz — kam resurs, kam hujum yuzasi, buyruq qatori orqali boshqariladi).</p>

<h2>3. Server rollari</h2>
<p>Windows Server'da xizmatlar <b>rollar</b> sifatida o'rnatiladi (Server Manager → Add Roles and Features):</p>
<ul>
  <li><b>AD DS</b> — domen xizmatlari (katalog);</li>
  <li><b>DNS Server</b>, <b>DHCP Server</b>;</li>
  <li><b>File and Storage Services</b> — fayl serveri;</li>
  <li><b>Web Server (IIS)</b>;</li>
  <li><b>Print and Document Services</b>;</li>
  <li><b>Remote Access</b> — VPN va marshrutlash;</li>
  <li><b>Hyper-V</b> — virtualizatsiya.</li>
</ul>
<p>DNS, DHCP va domen kontrolleri uchun serverga <b>statik IP</b> beriladi — mijozlar uni doim bir manzilda topishi kerak.</p>

<h2>4. Ishchi guruh</h2>
<p><b>Ishchi guruh</b> (workgroup) — bir rangli tarmoq: kompyuterlar teng huquqli, markaziy server yo'q. Har bir kompyuterda o'zining <b>lokal hisoblar bazasi</b> (SAM) bor. Foydalanuvchi boshqa kompyuterdagi resursga kirishi uchun o'sha kompyuterda ham hisobi bo'lishi kerak.</p>
<ul>
  <li><b>Afzallik:</b> server shart emas, sozlash oson, arzon.</li>
  <li><b>Kamchilik:</b> N kompyuter va M foydalanuvchi bo'lsa, eng yomon holda N·M hisob yaratiladi; parol har kompyuterda alohida o'zgartiriladi; xavfsizlik siyosatini markazdan qo'llab bo'lmaydi. Odatda 10–20 kompyutergacha tavsiya etiladi.</li>
</ul>

<h2>5. Domen va Active Directory</h2>
<p><b>Domen</b> — umumiy hisoblar bazasi va xavfsizlik siyosatiga ega kompyuterlar va foydalanuvchilarning mantiqiy guruhi. Bazani <b>domen kontrolleri</b> (DC) saqlaydi. Windows'da bu <b>Active Directory Domain Services</b>.</p>
<ul>
  <li>Foydalanuvchi bitta login va parol bilan domendagi istalgan kompyuterga kiradi; autentifikatsiyani DC <b>Kerberos</b> orqali bajaradi.</li>
  <li><b>Obyektlar</b>: foydalanuvchilar, guruhlar, kompyuterlar, printerlar.</li>
  <li><b>OU</b> (tashkiliy bo'linma) — obyektlarni papkalarga ajratish (masalan, "Kafedra", "Talabalar") va boshqaruvni topshirish.</li>
  <li><b>GPO</b> (guruh siyosati) — minglab kompyuterga bir vaqtda sozlama qo'llash: parol talablari, dastur o'rnatish, ish stoli cheklovlari.</li>
  <li><b>Daraxt va o'rmon</b> — bir nechta domen ierarxiyasi; o'rmon — AD ning eng yuqori chegarasi.</li>
  <li>Ishonchlilik uchun kamida <b>ikkita DC</b> o'rnatiladi — ular bazani o'zaro replikatsiya qiladi.</li>
  <li>AD DNS ga tayanadi: mijozlar DC ni DNS dagi maxsus (SRV) yozuvlar orqali topadi, shuning uchun AD bilan birga DNS ham o'rnatiladi.</li>
</ul>
<table>
  <tr><th></th><th>Ishchi guruh</th><th>Domen</th></tr>
  <tr><td>Hisoblar</td><td>Har kompyuterda alohida</td><td>Markazda (DC)</td></tr>
  <tr><td>Server</td><td>Shart emas</td><td>Kamida bitta DC</td></tr>
  <tr><td>Siyosatlar</td><td>Har kompyuterda qo'lda</td><td>GPO orqali markazdan</td></tr>
  <tr><td>Hajm</td><td>Kichik ofis</td><td>Har qanday, minglab kompyuter</td></tr>
</table>

<h2>Nazorat savollari</h2>
<ol>
  <li>Server OT ish stoli OT sidan nimasi bilan farq qiladi?</li>
  <li>Server Core ning afzalliklari qanday?</li>
  <li>Ishchi guruhning qanday hollarda kamchiligi sezila boshlaydi?</li>
  <li>Domen kontrolleri qanday vazifani bajaradi?</li>
  <li>Nega AD bilan birga DNS ham o'rnatiladi?</li>
</ol>
""",
    [
        S_title("Server OT va domenlar", "Ishchi guruhdan Active Directory gacha", "🖥️"),
        S_points("Server OT", [("👥", "Ko'p foydalanuvchi va ulanish"), ("🧰", "Tarmoq xizmatlari (rollar)"), ("🛡️", "Markaziy xavfsizlik"), ("💽", "RAID, klaster, zaxira")]),
        S_table("Server OT oilalari", ["Oila", "Misol"], [["Windows Server", "2019, 2022, 2025"], ["Linux", "Ubuntu Server, RHEL, Debian"], ["Unix", "FreeBSD"]]),
        S_compare("O'rnatish turlari", ("Desktop Experience", "Grafik interfeys, o'rganish oson"), ("Server Core", "Grafikasiz: kam resurs, kam hujum yuzasi")),
        S_compare("Ishchi guruh va domen", ("Ishchi guruh", "Hisoblar har kompyuterda. 10–20 kompyutergacha"), ("Domen", "Hisoblar DC da. Bitta login hamma joyda, GPO")),
        S_quiz("8 kompyuter va 15 foydalanuvchi, ishchi guruh. Eng yomon holda nechta hisob kerak?", ["15", "23", "120", "8"], 2, "8 × 15 = 120. Domenda esa 15 ta."),
        S_points("Active Directory", [("🏛️", "Domen kontrolleri (DC)"), ("🔑", "Kerberos autentifikatsiyasi"), ("📁", "OU — tashkiliy bo'linmalar"), ("📜", "GPO — guruh siyosatlari"), ("🌳", "Daraxt va o'rmon")]),
        S_quiz("Nega DC ga statik IP beriladi?", ["Tezroq ishlaydi", "Mijozlar uni doim bir manzilda topishi kerak", "Litsenziya talab qiladi", "DHCP uni taqiqlaydi"], 1, "DNS, DHCP va DC manzili o'zgarsa, mijozlar ularni yo'qotadi."),
        S_summary("Xulosa", ["Server OT — ko'p foydalanuvchili, xizmatlarga yo'naltirilgan", "Rollar: AD DS, DNS, DHCP, File, IIS", "Ishchi guruh — kichik ofis uchun", "Domen — markazlashgan boshqaruv"]),
    ],
    [
        Q("Ishchi guruhda foydalanuvchi hisoblari qayerda saqlanadi?", ["Domen kontrollerida", "Har bir kompyuterning lokal bazasida", "DNS serverda", "Routerda"], 1, "Lokal hisoblar bazasi — SAM."),
        Q("Active Directory da autentifikatsiya qaysi protokol bilan bajariladi?", ["HTTP", "Kerberos", "FTP", "SNMP"], 1, "Kerberos — chiptalar (ticket) asosidagi autentifikatsiya."),
        Q("Ko'plab kompyuterga bir vaqtda sozlamani qo'llash vositasi?", ["OU", "GPO", "SAM", "DHCP"], 1, "Group Policy Object."),
        Q("Grafik interfeyssiz Windows Server o'rnatish turi?", ["Desktop Experience", "Server Core", "Essentials", "Datacenter"], 1, "Server Core — kam resurs va kam hujum yuzasi."),
        Q("Domen haqida qaysi gaplar to'g'ri?", ["Kamida bitta domen kontrolleri kerak", "Foydalanuvchi bitta login bilan istalgan kompyuterga kiradi", "Server talab qilinmaydi", "Siyosatlar markazdan qo'llanadi"], [0, 1, 3], "Domen DC — ya'ni serversiz bo'lmaydi."),
        Q("Ishonchlilik uchun domenda nechta DC tavsiya etiladi?", ["Bitta", "Kamida ikkita", "Har kompyuterda bittadan", "DC kerak emas"], 1, "Biri ishdan chiqsa, ikkinchisi xizmat qiladi; baza replikatsiya qilinadi."),
    ],
    [
        answer_task(
            "Hisoblar soni",
            "Ofisda 6 ta kompyuter va 12 ta xodim bor. Har bir xodim istalgan kompyuterda ishlashi kerak.",
            [
                F("Ishchi guruhda nechta lokal hisob yaratiladi?", "number", 72),
                F("Domenda nechta foydalanuvchi hisobi yaratiladi?", "number", 12),
                F("Bitta xodim parolini o'zgartirishda ishchi guruhda necha joyda o'zgartirish kerak?", "number", 6),
            ],
            hints=["Ishchi guruh: kompyuterlar × foydalanuvchilar.", "Virtual simulyatsiyada aynan shu qiymatlarni qo'yib tekshiring."],
        ),
        answer_task(
            "Modelni tanlang",
            "Har bir tashkilot uchun mos modelni tanlang.",
            [
                F("Oilaviy biznes: 4 ta kompyuter, server yo'q", "choice", "Ishchi guruh", options=["Ishchi guruh", "Domen"]),
                F("Universitet: 600 ta kompyuter, 8 ta kompyuter sinfi", "choice", "Domen", options=["Ishchi guruh", "Domen"]),
                F("Bank filiali: qat'iy parol siyosati talab qilinadi", "choice", "Domen", options=["Ishchi guruh", "Domen"]),
            ],
        ),
    ],
)

# ======================================================================
# 13-MA'RUZA
# ======================================================================
M13 = T(
    "kt-m13-resurslar",
    "13-ma'ruza: Tarmoq resurslarini boshqarish. Umumiy resurslar. Foydalanuvchilar vakolatlari",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Tarmoq ma'muriyatining vazifalari</li>
  <li>Foydalanuvchilar va guruhlar</li>
  <li>Huquqlar va ruxsatlar</li>
  <li>Umumiy papkalar yaratish</li>
  <li>Ulashish va NTFS ruxsatlari, samarali ruxsat</li>
</ol>

<h2>1. Tarmoq ma'muriyati</h2>
<p>Tarmoq administratorining odatiy vazifalari:</p>
<ul>
  <li>foydalanuvchi hisoblari va guruhlarni yaratish, o'zgartirish, bloklash;</li>
  <li>umumiy resurslar (papkalar, printerlar) yaratish va ularga kirishni boshqarish;</li>
  <li>disk kvotalari, zaxira nusxa olish va tiklash;</li>
  <li>tarmoq va serverlar holatini monitoring qilish, jurnallarni (Event Viewer) tahlil qilish;</li>
  <li>yangilanishlarni o'rnatish, xavfsizlik siyosatlarini qo'llash.</li>
</ul>
<p>Asosiy tamoyil — <b>eng kam imtiyoz</b> (least privilege): har bir foydalanuvchiga ishi uchun zarur bo'lgan eng kam huquq beriladi.</p>

<h2>2. Foydalanuvchilar va guruhlar</h2>
<ul>
  <li><b>Lokal hisoblar</b> — bitta kompyuterda (lusrmgr.msc, "Local Users and Groups").</li>
  <li><b>Domen hisoblari</b> — Active Directory da ("Active Directory Users and Computers").</li>
  <li>O'rnatilgan hisoblar: <b>Administrator</b> (to'liq huquq), <b>Guest</b> (odatda o'chirilgan).</li>
  <li>O'rnatilgan guruhlar: <b>Administrators</b>, <b>Users</b>, <b>Remote Desktop Users</b>; domenda <b>Domain Admins</b>, <b>Domain Users</b>.</li>
</ul>
<p>Ruxsatlarni alohida foydalanuvchilarga emas, <b>guruhlarga</b> berish kerak: xodim boshqa bo'limga o'tsa, uni bir guruhdan chiqarib boshqasiga qo'shish kifoya. Buyruq qatorida: <code>net user ali Parol123! /add</code>, <code>net localgroup Talabalar ali /add</code>.</p>

<h2>3. Huquq va ruxsat</h2>
<ul>
  <li><b>Huquq</b> (user right) — tizim darajasidagi amalni bajarish imkoniyati: tizimga lokal kirish, vaqtni o'zgartirish, kompyuterni o'chirish.</li>
  <li><b>Ruxsat</b> (permission) — muayyan obyektga (papka, fayl, printer) kirish imkoniyati: o'qish, yozish, o'chirish.</li>
</ul>

<h2>4. Umumiy papka yaratish</h2>
<ol>
  <li>Papka xususiyatlari → <b>Sharing</b> → <b>Advanced Sharing</b> → "Share this folder".</li>
  <li><b>Ulashish nomi</b>ni kiritish. Nom oxirida <code>$</code> bo'lsa, papka tarmoqda ko'rinmaydi (yashirin ulashish: <code>Hisobot$</code>).</li>
  <li><b>Permissions</b> tugmasi — ulashish ruxsatlarini berish.</li>
  <li><b>Security</b> yorlig'ida NTFS ruxsatlarini sozlash.</li>
</ol>
<p>Tarmoqdan kirish <b>UNC yo'li</b> orqali: <code>\\\\SERVER\\Hujjatlar</code>. Disk sifatida ulash: <code>net use H: \\\\SERVER\\Hujjatlar</code>. Kompyuterdagi barcha ulashishlar: <code>net share</code>.</p>

<h2>5. Ruxsatlar</h2>
<h3>5.1. Ulashish (Share) ruxsatlari</h3>
<p>Faqat <b>tarmoq orqali</b> kirishda ishlaydi: <b>Full Control</b>, <b>Change</b> (o'qish + yozish + o'chirish), <b>Read</b>.</p>
<h3>5.2. NTFS ruxsatlari</h3>
<p>Ham tarmoqda, ham <b>kompyuterning o'zida</b> ishlaydi:</p>
<table>
  <tr><th>Ruxsat</th><th>Nimaga imkon beradi</th></tr>
  <tr><td>Full control</td><td>Hammasi, shu jumladan ruxsatlarni o'zgartirish va egalikni olish</td></tr>
  <tr><td>Modify</td><td>O'qish, yozish, ishga tushirish, o'chirish</td></tr>
  <tr><td>Read &amp; execute</td><td>O'qish va dasturlarni ishga tushirish</td></tr>
  <tr><td>List folder contents</td><td>Papka ichini ko'rish</td></tr>
  <tr><td>Read</td><td>Fayllarni o'qish</td></tr>
  <tr><td>Write</td><td>Yangi fayl yaratish va yozish</td></tr>
</table>
<p>Ruxsatlar <b>meros</b> bo'lib o'tadi: papkaga berilgan ruxsat ichidagi fayl va papkalarga ham tarqaladi (agar meros o'chirilmagan bo'lsa).</p>
<h3>5.3. Samarali ruxsat qoidalari</h3>
<ol>
  <li><b>Yig'indi:</b> foydalanuvchi o'ziga va a'zo bo'lgan barcha guruhlariga berilgan ruxsatlarning birlashmasini oladi.</li>
  <li><b>Taqiq ustun:</b> aniq Deny har qanday Allow dan kuchli.</li>
  <li><b>Tarmoqda — eng cheklangani:</b> tarmoq orqali kirishda NTFS va Share ruxsatlaridan qaysi biri qattiqroq bo'lsa, o'sha amal qiladi.</li>
</ol>
<p><b>Misol.</b> Ali "Talabalar" guruhida. NTFS: Talabalar — Modify. Share: Everyone — Read. Ali tarmoqdan faqat <b>o'qiy oladi</b> (eng cheklangani — Read). Serverga bevosita kirsa — <b>o'zgartira oladi</b> (faqat NTFS). Shuning uchun amaliyotda Share ruxsati keng qilinadi (Everyone yoki Authenticated Users — Full Control yoki Change), aniq cheklovlar esa NTFS da beriladi.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega ruxsatlar guruhlarga beriladi?</li>
  <li>Huquq va ruxsat farqini misol bilan tushuntiring.</li>
  <li>Yashirin ulashish qanday yaratiladi?</li>
  <li>NTFS va Share ruxsatlari qanday birlashadi?</li>
  <li>"Taqiq ustun" qoidasi qachon kerak bo'ladi?</li>
</ol>
""",
    [
        S_title("Tarmoq resurslarini boshqarish", "Foydalanuvchilar, ulashish, ruxsatlar", "🗂️"),
        S_idea("Eng kam imtiyoz", "Har kimga ishi uchun zarur bo'lgan eng kam huquq. Ruxsatlar foydalanuvchiga emas, guruhga beriladi.", "🔐"),
        S_compare("Huquq va ruxsat", ("Huquq", "Tizim amali: tizimga kirish, vaqtni o'zgartirish"), ("Ruxsat", "Obyektga kirish: papkani o'qish, faylni o'chirish")),
        S_code("Buyruqlar", "net user ali Parol123! /add\nnet localgroup Talabalar ali /add\nnet share\nnet use H: \\\\SERVER\\Hujjatlar"),
        S_table("Ruxsat turlari", ["Share", "NTFS"], [["Full Control", "Full control"], ["Change", "Modify"], ["Read", "Read & execute, Read"], ["—", "Write, List folder"]]),
        S_points("Samarali ruxsat", [("➕", "Guruhlar ruxsatlari yig'iladi"), ("⛔", "Deny har doim ustun"), ("🌐", "Tarmoqda: NTFS ∩ Share — eng cheklangani"), ("💻", "Kompyuterning o'zida — faqat NTFS")]),
        S_quiz("NTFS: Modify, Share: Read. Tarmoqdan nima qilish mumkin?", ["To'liq boshqarish", "O'zgartirish", "Faqat o'qish", "Hech narsa"], 2, "Tarmoqda ikkalasidan qattiqrog'i — Read."),
        S_quiz("Ali 'Talabalar' (Modify) va 'Mehmonlar' (Deny Write) guruhida. Yoza oladimi?", ["Ha", "Yo'q", "Faqat tarmoqdan", "Faqat lokal"], 1, "Deny har qanday Allow dan ustun."),
        S_summary("Xulosa", ["Guruhlarga ruxsat bering", "Share — faqat tarmoqda, NTFS — hamma joyda", "Samarali = yig'indi − deny, tarmoqda eng cheklangani", "Amaliyot: Share keng, NTFS aniq"]),
    ],
    [
        Q("Qaysi ruxsatlar kompyuterning o'zida (lokal) ham ishlaydi?", ["Share", "NTFS", "Ikkalasi ham", "Hech biri"], 1, "Share ruxsati faqat tarmoqdan kirishda tekshiriladi."),
        Q("Ulashish nomi oxiridagi $ belgisi nimani bildiradi?", ["Pullik papka", "Yashirin ulashish", "Faqat administratorlar uchun", "Shifrlangan"], 1, "Papka tarmoq ro'yxatida ko'rinmaydi, lekin nomi ma'lum bo'lsa ochiladi."),
        Q("Allow va Deny ziddiyatida qaysi biri g'olib?", ["Allow", "Deny", "Oxirgi berilgani", "Guruh soni ko'pi"], 1, "Aniq taqiq ruxsatdan ustun."),
        Q("NTFS — Read, Share — Full Control. Tarmoqdan samarali ruxsat?", ["Full Control", "Change", "Read", "Hech qanday"], 2, "Eng cheklangani — Read."),
        Q("Papkaga tarmoqdan kirish uchun to'g'ri UNC yo'l?", ["C:\\SERVER\\Hujjatlar", "\\\\SERVER\\Hujjatlar", "//SERVER:Hujjatlar", "http://SERVER/Hujjatlar"], 1, "UNC: \\\\kompyuter\\ulashish."),
        Q("Qaysi gaplar to'g'ri?", ["Ruxsatlarni guruhlarga berish tavsiya etiladi", "NTFS ruxsatlari ichki papkalarga meros bo'lib o'tadi", "Share ruxsati lokal kirishni cheklaydi", "Foydalanuvchi guruhlari ruxsatlarining yig'indisini oladi"], [0, 1, 3], "Share — faqat tarmoqda."),
    ],
    [
        answer_task(
            "Samarali ruxsatni toping",
            "Papka: \\\\SERVER\\Kurs. Foydalanuvchi Vali 'O'qituvchilar' va 'Everyone' guruhlarida.",
            [
                F("NTFS: O'qituvchilar — Modify; Share: Everyone — Read. Tarmoqdan samarali ruxsat", "choice", "Read", options=["Full control", "Modify", "Read", "Hech qanday"]),
                F("Xuddi shu holat, lekin Vali serverda lokal ishlaydi", "choice", "Modify", options=["Full control", "Modify", "Read", "Hech qanday"]),
                F("NTFS: O'qituvchilar — Modify, Everyone — Deny Read; Share: Everyone — Full. Tarmoqdan", "choice", "Hech qanday", options=["Full control", "Modify", "Read", "Hech qanday"]),
            ],
            hints=["Tarmoqda — NTFS va Share ning kesishmasi.", "Deny Read bo'lsa, o'qib bo'lmaydi; o'qib bo'lmagan faylni o'zgartirib ham bo'lmaydi."],
            difficulty="medium",
        ),
        answer_task(
            "Buyruqlar",
            "To'g'ri buyruq yoki yo'lni yozing.",
            [
                F("SERVER1 dagi 'Hisobot' ulashishining UNC yo'li", "text", "\\\\SERVER1\\Hisobot"),
                F("Kompyuterdagi barcha ulashishlarni ko'rsatuvchi buyruq", "text", "net share"),
                F("Yashirin 'Arxiv' ulashishining nomi", "text", "Arxiv$"),
            ],
        ),
    ],
)

# ======================================================================
# 14-MA'RUZA
# ======================================================================
M14 = T(
    "kt-m14-xavfsizlik",
    "14-ma'ruza: Tarmoqlarda xavfsizlik muammolari. Himoya usullari: Firewall, VPN, IDS",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Axborot xavfsizligining asosiy maqsadlari</li>
  <li>Tarmoq tahdidlari</li>
  <li>Brandmauer (Firewall)</li>
  <li>VPN</li>
  <li>IDS va IPS</li>
  <li>Boshqa himoya choralari</li>
</ol>

<h2>1. CIA uchligi</h2>
<ul>
  <li><b>Konfidensiallik</b> (Confidentiality) — ma'lumotni faqat ruxsat etilganlar ko'radi. Vositasi: shifrlash, kirish nazorati.</li>
  <li><b>Yaxlitlik</b> (Integrity) — ma'lumot ruxsatsiz o'zgartirilmaydi. Vositasi: xesh, raqamli imzo.</li>
  <li><b>Mavjudlik</b> (Availability) — kerakli paytda foydalanish mumkin. Vositasi: zaxira, DDoS himoyasi.</li>
</ul>

<h2>2. Tahdidlar</h2>
<table>
  <tr><th>Tahdid</th><th>Mohiyati</th></tr>
  <tr><td>Zararli dasturlar</td><td>Virus (faylga yuqadi), chuvalchang (tarmoq orqali o'zi tarqaladi), troyan (foydali dastur niqobida), to'lov talab qiluvchi (ransomware — fayllarni shifrlaydi)</td></tr>
  <tr><td>Fishing</td><td>Qalbaki xat yoki sayt orqali login, parol, karta ma'lumotini olish</td></tr>
  <tr><td>DoS / DDoS</td><td>Serverni so'rovlar bilan to'ldirib, xizmatni ishdan chiqarish (DDoS — ko'plab qurilmadan)</td></tr>
  <tr><td>O'rtadagi odam (MITM)</td><td>Trafikni tutib olish yoki o'zgartirish: ARP spoofing, soxta Wi-Fi nuqtasi</td></tr>
  <tr><td>Sniffing</td><td>Shifrlanmagan trafikni tinglash</td></tr>
  <tr><td>Parol tanlash (brute force)</td><td>Ko'plab parollarni avtomatik sinash</td></tr>
  <tr><td>Portlarni skanerlash</td><td>Ochiq xizmatlar va zaifliklarni qidirish — hujumdan oldingi razvedka</td></tr>
  <tr><td>Ijtimoiy muhandislik</td><td>Odamni aldab ma'lumot yoki kirish olish</td></tr>
</table>

<h2>3. Brandmauer (Firewall)</h2>
<p><b>Brandmauer</b> — tarmoqlar (yoki kompyuter va tarmoq) orasidagi trafikni qoidalar asosida o'tkazuvchi yoki to'suvchi vosita. Turlari:</p>
<ul>
  <li><b>Paket filtri</b> — har paketni sarlavhasi bo'yicha tekshiradi: manba/manzil IP, protokol, port.</li>
  <li><b>Holatni kuzatuvchi</b> (stateful) — ulanishlar jadvalini yuritadi: ichkaridan boshlangan ulanishning javobini avtomatik o'tkazadi.</li>
  <li><b>Amaliy pog'ona shlyuzi (proxy)</b> — protokol mazmunini tekshiradi (masalan, HTTP so'rovlarini).</li>
  <li><b>NGFW</b> (yangi avlod) — ilovalarni tanish, IPS, foydalanuvchi bo'yicha qoidalar.</li>
</ul>
<p>Qoidalar <b>yuqoridan pastga</b> tekshiriladi va <b>birinchi mos</b> qoida qaror qiladi; hech biri mos kelmasa — <b>sukut siyosati</b>. Xavfsiz yondashuv: "ruxsat berilmagan hamma narsa taqiqlangan" (default deny). Ommaviy serverlar alohida segmentga — <b>DMZ</b> ga joylashtiriladi: Internetdan faqat DMZ ga, DMZ dan ichki tarmoqqa esa minimal kirish.</p>
<p>Windows'da: <b>Windows Defender Firewall</b> — kiruvchi (inbound) va chiquvchi (outbound) qoidalar, profillar (Domain, Private, Public).</p>

<h2>4. VPN</h2>
<p><b>VPN</b> (Virtual Private Network) — ommaviy tarmoq (Internet) orqali <b>shifrlangan tunnel</b> yaratib, masofadagi tarmoqlar yoki foydalanuvchini xususiy tarmoqqa xavfsiz ulash. Asl paket shifrlanadi va yangi sarlavha bilan o'raladi (<b>tunnellash</b>) — yo'lda tinglovchi faqat tunnel uchlarini ko'radi.</p>
<ul>
  <li><b>Masofaviy kirish VPN</b> — xodim uyidan tashkilot tarmog'iga mijoz dastur orqali ulanadi.</li>
  <li><b>Sayt-sayt VPN</b> — ikki filial marshrutizatorlari orasida doimiy tunnel.</li>
  <li>Protokollar: <b>IPsec</b> (IKEv2), <b>SSL/TLS VPN</b> (OpenVPN, SSTP), <b>WireGuard</b>. PPTP eskirgan va xavfsiz emas.</li>
</ul>

<h2>5. IDS va IPS</h2>
<ul>
  <li><b>IDS</b> (Intrusion Detection System) — trafik yoki jurnallarni tahlil qilib, hujumni <b>aniqlaydi va ogohlantiradi</b>.</li>
  <li><b>IPS</b> (Intrusion Prevention System) — trafik yo'lida turadi va hujumni <b>to'sadi</b>.</li>
  <li>Aniqlash usullari: <b>imzo</b> (ma'lum hujum naqshlari bazasi) va <b>anomaliya</b> (odatiy xulqdan chetga chiqish).</li>
  <li>Joylashuvi: tarmoq (NIDS) va xost (HIDS).</li>
  <li>Xatolar: <b>soxta ijobiy</b> (false positive — oddiy trafik hujum deb topiladi) va <b>soxta salbiy</b> (false negative — hujum o'tkazib yuboriladi). Chegaralarni sozlash shular orasidagi muvozanat.</li>
</ul>

<h2>6. Boshqa choralar</h2>
<ul>
  <li><b>Ko'p faktorli autentifikatsiya</b> (MFA) — paroldan tashqari telefon kodi yoki kalit.</li>
  <li><b>Shifrlash</b>: HTTPS (TLS), SSH, WPA3; ochiq protokollardan (Telnet, FTP, HTTP) voz kechish.</li>
  <li><b>Yangilanishlar</b> — OT va dasturlardagi zaifliklarni yopish.</li>
  <li><b>Zaxira nusxa: 3-2-1 qoidasi</b> — 3 ta nusxa, 2 xil tashuvchida, 1 tasi boshqa joyda.</li>
  <li><b>Segmentatsiya</b> — VLAN va alohida tarmoqlar: bir qism buzilsa, boshqasi himoyalangan.</li>
  <li><b>Foydalanuvchilarni o'qitish</b> — fishing va ijtimoiy muhandislikka qarshi eng samarali chora.</li>
</ul>

<h2>Nazorat savollari</h2>
<ol>
  <li>CIA uchligini misollar bilan tushuntiring.</li>
  <li>Nega brandmauer qoidalarining tartibi muhim?</li>
  <li>Holatni kuzatuvchi brandmauer paket filtridan nimasi bilan ustun?</li>
  <li>VPN tunnellash qanday ishlaydi?</li>
  <li>IDS va IPS farqi nimada?</li>
</ol>
""",
    [
        S_title("Tarmoq xavfsizligi", "Tahdidlar va himoya: Firewall, VPN, IDS", "🛡️"),
        S_points("CIA uchligi", [("🔒", "Konfidensiallik — shifrlash"), ("✅", "Yaxlitlik — xesh, imzo"), ("⚡", "Mavjudlik — zaxira, DDoS himoyasi")]),
        S_table("Tahdidlar", ["Tahdid", "Mohiyati"], [["Ransomware", "Fayllarni shifrlab, pul talab qiladi"], ["Fishing", "Qalbaki xat/sayt"], ["DDoS", "Serverni to'ldirib tashlash"], ["MITM", "Trafikni tutib olish"]]),
        S_idea("Firewall qoidasi", "Qoidalar yuqoridan pastga, BIRINCHI mos kelgani qaror qiladi. Oxirida — sukut siyosati: hammasini taqiqla.", "🧱"),
        S_quiz("1-qoida: Deny any. 2-qoida: Allow TCP 443. HTTPS o'tadimi?", ["Ha", "Yo'q", "Faqat LAN dan", "Sukut siyosatiga bog'liq"], 1, "1-qoida hammasiga mos keladi va to'sadi — 2-qoidaga navbat kelmaydi."),
        S_compare("VPN turlari", ("Masofaviy kirish", "Bitta xodim → tashkilot tarmog'i"), ("Sayt-sayt", "Filial routeri ↔ markaz routeri, doimiy tunnel")),
        S_compare("IDS va IPS", ("IDS", "Aniqlaydi va ogohlantiradi"), ("IPS", "Trafik yo'lida turib, to'sadi")),
        S_points("Qo'shimcha choralar", [("📱", "MFA"), ("🔄", "Yangilanishlar"), ("💾", "Zaxira: 3-2-1"), ("🧩", "Segmentatsiya (VLAN, DMZ)"), ("🎓", "Foydalanuvchilarni o'qitish")]),
        S_quiz("Oddiy foydalanuvchi IDS tomonidan hujumchi deb topildi. Bu qanday xato?", ["Soxta salbiy", "Soxta ijobiy", "Imzo xatosi", "DoS"], 1, "False positive — xavfsiz hodisa hujum deb belgilandi."),
        S_summary("Xulosa", ["CIA — himoyaning uch maqsadi", "Firewall: tartib muhim, default deny", "VPN — shifrlangan tunnel", "IDS ogohlantiradi, IPS to'sadi"]),
    ],
    [
        Q("Fayllarni shifrlab, to'lov talab qiladigan zararli dastur?", ["Chuvalchang", "Troyan", "Ransomware", "Sniffer"], 2, "To'lov talab qiluvchi dastur (ransomware)."),
        Q("Brandmauerda hech qaysi qoida mos kelmasa nima bo'ladi?", ["Paket o'tadi", "Sukut siyosati qo'llanadi", "Xato yuz beradi", "Oxirgi qoida qo'llanadi"], 1, "Xavfsiz sukut siyosati — taqiqlash."),
        Q("Ichkaridan boshlangan ulanishning javobini avtomatik o'tkazadigan brandmauer turi?", ["Paket filtri", "Holatni kuzatuvchi (stateful)", "Proxy", "IDS"], 1, "U ulanishlar jadvalini yuritadi."),
        Q("Ommaviy veb-serverni qayerga joylashtirish tavsiya etiladi?", ["Ichki tarmoqqa", "DMZ ga", "Foydalanuvchi kompyuteriga", "Routerning ichiga"], 1, "DMZ — Internet va ichki tarmoq orasidagi alohida segment."),
        Q("Hujumni aniqlab qolmay, uni to'sadigan tizim?", ["IDS", "IPS", "DNS", "NAT"], 1, "Intrusion Prevention System."),
        Q("Qaysi VPN protokollari bugun xavfsiz hisoblanadi?", ["IPsec (IKEv2)", "WireGuard", "PPTP", "OpenVPN"], [0, 1, 3], "PPTP eskirgan va buzilgan."),
        Q("3-2-1 zaxira qoidasida '1' nimani bildiradi?", ["1 ta nusxa", "1 ta nusxa boshqa joyda saqlanadi", "1 kunda bir marta", "1 ta tashuvchi"], 1, "3 nusxa, 2 xil tashuvchi, 1 tasi boshqa joyda."),
    ],
    [
        answer_task(
            "Tahdid va himoya",
            "Har bir tahdid uchun eng mos himoya chorasini tanlang.",
            [
                F("Kafedagi ochiq Wi-Fi da parolni tutib olish", "choice", "VPN", options=["VPN", "Zaxira nusxa", "MFA", "IDS"]),
                F("Ransomware fayllarni shifrlab qo'ydi", "choice", "Zaxira nusxa", options=["VPN", "Zaxira nusxa", "MFA", "IDS"]),
                F("Fishing orqali parol o'g'irlandi", "choice", "MFA", options=["VPN", "Zaxira nusxa", "MFA", "IDS"]),
                F("Serverga ketma-ket portlarni skanerlash", "choice", "IDS", options=["VPN", "Zaxira nusxa", "MFA", "IDS"]),
            ],
        ),
        answer_task(
            "Qoidalar tartibi",
            "Qoidalar: 1) Allow TCP 80,443 any; 2) Allow TCP 22 LAN; 3) Deny any any. Paket qaysi qoida bo'yicha qaror topadi? Qoida raqamini kiriting.",
            [
                F("Internetdan HTTPS (443)", "number", 1),
                F("LAN dan SSH (22)", "number", 2),
                F("Internetdan SSH (22)", "number", 3),
                F("Internetdan RDP (3389)", "number", 3),
            ],
            hints=["Har paket uchun 1-qoidadan boshlab mos kelganini qidiring."],
        ),
    ],
)

# ======================================================================
# 15-MA'RUZA
# ======================================================================
M15 = T(
    "kt-m15-diagnostika",
    "15-ma'ruza: Tarmoq muammolarini aniqlash va bartaraf qilish",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Nosozlikni bartaraf qilish metodologiyasi</li>
  <li>Yondashuvlar: pastdan yuqoriga, yuqoridan pastga, bo'lib tekshirish</li>
  <li>Diagnostika vositalari</li>
  <li>Tipik nosozliklar va belgilari</li>
</ol>

<h2>1. Metodologiya</h2>
<p>Tajribali administrator "taxminan" emas, <b>tizimli</b> ishlaydi:</p>
<ol>
  <li><b>Muammoni aniqlash</b> — foydalanuvchidan so'rash: nima ishlamayapti, qachondan, nima o'zgargan? Belgilarni yig'ish.</li>
  <li><b>Ehtimoliy sabab haqida faraz</b> tuzish — eng oddiy sabablardan boshlab.</li>
  <li><b>Farazni tekshirish</b> — buyruqlar va vositalar bilan.</li>
  <li><b>Harakat rejasini</b> tuzish va boshqalarga ta'sirini baholash.</li>
  <li><b>Yechimni qo'llash</b>.</li>
  <li><b>Natijani tekshirish</b> — muammo haqiqatan hal bo'ldimi, yangisi paydo bo'lmadimi.</li>
  <li><b>Hujjatlashtirish</b> — sabab va yechimni yozib qo'yish.</li>
</ol>

<h2>2. Yondashuvlar</h2>
<ul>
  <li><b>Pastdan yuqoriga</b> (OSI bo'yicha): kabel va chiroqlar (1) → adapter va kommutator (2) → IP sozlamalari va shlyuz (3) → port va brandmauer (4) → dastur va DNS (7). Fizik muammolar ko'p bo'lgani uchun eng ishonchli usul.</li>
  <li><b>Yuqoridan pastga</b> — dasturdan boshlab: agar muammo bitta dasturga tegishli bo'lsa tez.</li>
  <li><b>Bo'lib tekshirish</b> (divide and conquer) — o'rtadan boshlash: <code>ping 8.8.8.8</code> o'tsa, pastki pog'onalar ishlayapti, muammo yuqorida.</li>
  <li><b>Yo'l bo'ylab</b> — <code>tracert</code> bilan paket qayerda to'xtashini topish.</li>
  <li><b>Solishtirish</b> — ishlayotgan kompyuter sozlamalari bilan farqni topish.</li>
</ul>

<h2>3. Vositalar</h2>
<table>
  <tr><th>Buyruq</th><th>Vazifasi</th></tr>
  <tr><td><code>ipconfig</code>, <code>ipconfig /all</code></td><td>IP, maska, shlyuz, DNS, MAC, DHCP holati</td></tr>
  <tr><td><code>ipconfig /release</code>, <code>/renew</code></td><td>DHCP manzilini qaytarish va qayta olish</td></tr>
  <tr><td><code>ipconfig /flushdns</code></td><td>DNS keshini tozalash</td></tr>
  <tr><td><code>ping</code></td><td>Manzil javob beradimi, kechikish, yo'qotish</td></tr>
  <tr><td><code>tracert</code>, <code>pathping</code></td><td>Yo'ldagi marshrutizatorlar va qayerda to'xtashi</td></tr>
  <tr><td><code>nslookup</code></td><td>DNS ishlayaptimi, nom qaysi IP ga aylanadi</td></tr>
  <tr><td><code>arp -a</code></td><td>ARP keshi: shlyuzning MAC manzili bormi</td></tr>
  <tr><td><code>netstat -ano</code></td><td>Ochiq portlar va ulanishlar, jarayon raqami</td></tr>
  <tr><td><code>route print</code></td><td>Kompyuterning marshrut jadvali</td></tr>
  <tr><td><code>Test-NetConnection server -Port 443</code></td><td>PowerShell: portga ulanish mumkinmi</td></tr>
</table>
<p>Apparat vositalar: kabel testeri, port chiroqlari (link/activity), Wi-Fi analizatori. Dasturiy: Wireshark (paketlarni tahlil qilish).</p>

<h2>4. Tipik nosozliklar</h2>
<table>
  <tr><th>Belgi</th><th>Ehtimoliy sabab</th><th>Yechim</th></tr>
  <tr><td><code>ipconfig</code>: "Media disconnected"</td><td>Kabel uzilgan, adapter o'chirilgan, port nosoz</td><td>Kabel va chiroqlarni tekshirish, adapterni yoqish</td></tr>
  <tr><td>IP manzil 169.254.x.x</td><td>DHCP serverdan javob yo'q (APIPA)</td><td>DHCP server/routerni tekshirish, <code>ipconfig /renew</code></td></tr>
  <tr><td>Lokal ping o'tadi, tashqi — "Destination host unreachable"</td><td>Shlyuz noto'g'ri yoki yo'q</td><td>To'g'ri shlyuzni ko'rsatish</td></tr>
  <tr><td><code>ping 8.8.8.8</code> o'tadi, <code>ping google.com</code> — "could not find host"</td><td>DNS ishlamayapti yoki noto'g'ri</td><td>DNS server manzilini to'g'rilash, <code>/flushdns</code></td></tr>
  <tr><td>"IP address conflict" ogohlantirishi</td><td>Ikki qurilmada bir xil IP</td><td>Statik manzillarni DHCP diapazonidan tashqariga chiqarish</td></tr>
  <tr><td>Ba'zi lokal manzillarga yetib bo'lmaydi</td><td>Maska noto'g'ri</td><td>Maskani tarmoqqa moslash</td></tr>
  <tr><td>Bitta sayt ochilmaydi, qolgani ishlaydi</td><td>Masofaviy server yoki yo'l muammosi</td><td><code>tracert</code> bilan tekshirish, kutish</td></tr>
  <tr><td>Port ulanmaydi, ping o'tadi</td><td>Brandmauer yoki xizmat ishlamayapti</td><td><code>Test-NetConnection</code>, brandmauer qoidalari</td></tr>
  <tr><td>Wi-Fi tez-tez uziladi</td><td>Kanal xalaqiti, signal kuchsiz</td><td>Kanalni almashtirish (1/6/11), AP joyini o'zgartirish</td></tr>
</table>
<blockquote>Eslatma: Windows'da <code>ping</code> "Reply from 192.168.1.10: Destination host unreachable" chiqarsa, statistikada bu javoblar "Received" deb sanaladi va yo'qotish 0% ko'rinadi. Raqamlarga emas, javob matniga qarang — javob manzil xostdan emas, sizning kompyuteringizdan kelgan.</blockquote>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nosozlikni bartaraf qilishning yetti bosqichini sanang.</li>
  <li>Nega pastdan yuqoriga yondashuv ko'p hollarda samarali?</li>
  <li>APIPA manzil nimani bildiradi?</li>
  <li>IP bo'yicha ping o'tadi, nom bo'yicha — yo'q. Sabab nima?</li>
  <li>Natijani hujjatlashtirish nega kerak?</li>
</ol>
""",
    [
        S_title("Nosozliklarni bartaraf qilish", "Tizimli yondashuv va vositalar", "🔧"),
        S_points("Metodologiya", [("1️⃣", "Muammoni aniqlash"), ("2️⃣", "Faraz"), ("3️⃣", "Tekshirish"), ("4️⃣", "Reja"), ("5️⃣", "Qo'llash"), ("6️⃣", "Natijani tekshirish"), ("7️⃣", "Hujjatlashtirish")]),
        S_compare("Yondashuvlar", ("Pastdan yuqoriga", "Kabel → IP → shlyuz → port → dastur"), ("Bo'lib tekshirish", "ping 8.8.8.8 dan boshlab, yuqori yoki pastni tanlash")),
        S_code("Asosiy buyruqlar", "ipconfig /all\nping 192.168.1.1\nping 8.8.8.8\nping google.com\nnslookup google.com\ntracert google.com"),
        S_table("Belgi → sabab", ["Belgi", "Sabab"], [["Media disconnected", "Kabel"], ["169.254.x.x", "DHCP yo'q"], ["Tashqi unreachable", "Shlyuz"], ["IP ishlaydi, nom yo'q", "DNS"]]),
        S_quiz("ipconfig: 169.254.37.112. Birinchi navbatda nimani tekshirasiz?", ["DNS serverni", "DHCP server/routerni", "Brandmauerni", "Veb-saytni"], 1, "APIPA — DHCP dan javob kelmagan."),
        S_quiz("ping 8.8.8.8 — javob bor, ping google.com — 'could not find host'. Sabab?", ["Kabel", "Shlyuz", "DNS", "Maska"], 2, "IP bo'yicha aloqa bor, nom aniqlanmayapti."),
        S_idea("'Destination host unreachable' tuzog'i", "Windows bunday javoblarni 'Received' deb sanaydi — yo'qotish 0% ko'rinadi. Javob qaysi manzildan kelganiga qarang.", "⚠️"),
        S_summary("Xulosa", ["Tizimli ishlang: 7 bosqich", "Pastdan yuqoriga — OSI bo'yicha", "ipconfig, ping, tracert, nslookup — asosiy to'rtlik", "Har yechimni hujjatlashtiring"]),
    ],
    [
        Q("Nosozlikni bartaraf qilishning oxirgi bosqichi?", ["Yechimni qo'llash", "Natijani tekshirish", "Hujjatlashtirish", "Faraz tuzish"], 2, "Keyingi safar shu muammo tezroq hal bo'ladi."),
        Q("ipconfig 'Media disconnected' ko'rsatdi. Muammo qaysi pog'onada?", ["Fizik", "Tarmoq", "Transport", "Amaliy"], 0, "Kabel yoki adapter — 1-pog'ona."),
        Q("DNS ishlayotganini qaysi buyruq bevosita tekshiradi?", ["arp -a", "nslookup", "route print", "netstat"], 1, "nslookup DNS serverga so'rov yuboradi."),
        Q("Paket qaysi marshrutizatorda to'xtayotganini qaysi buyruq ko'rsatadi?", ["ping", "tracert", "ipconfig", "getmac"], 1, "tracert TTL ni oshirib, har sakrashni ko'rsatadi."),
        Q("DNS keshini qaysi buyruq tozalaydi?", ["ipconfig /release", "ipconfig /renew", "ipconfig /flushdns", "arp -d"], 2, "/flushdns."),
        Q("Lokal printerga ping o'tadi, Internetdagi manzillarga 'Destination host unreachable'. Ehtimoliy sabablar?", ["Shlyuz noto'g'ri", "Shlyuz ko'rsatilmagan", "Kabel uzilgan", "Router ishlamayapti"], [0, 1, 3], "Kabel uzilgan bo'lsa, lokal ping ham o'tmas edi."),
    ],
    [
        answer_task(
            "Tashxis qo'ying",
            "Buyruqlar natijasiga qarab sababni tanlang.",
            [
                F("ipconfig: Media disconnected", "choice", "Kabel", options=["Kabel", "DHCP", "Shlyuz", "DNS"]),
                F("IPv4: 169.254.80.11, shlyuz bo'sh", "choice", "DHCP", options=["Kabel", "DHCP", "Shlyuz", "DNS"]),
                F("ping 192.168.1.20 — javob bor; ping 8.8.8.8 — Destination host unreachable", "choice", "Shlyuz", options=["Kabel", "DHCP", "Shlyuz", "DNS"]),
                F("ping 8.8.8.8 — javob bor; nslookup — DNS request timed out", "choice", "DNS", options=["Kabel", "DHCP", "Shlyuz", "DNS"]),
            ],
            hints=["Virtual simulyatsiyadagi terminalda har bir holatni o'zingiz takrorlang."],
        ),
        answer_task(
            "Metodologiya tartibi",
            "Bosqich tartib raqamini kiriting (1–7).",
            [
                F("Farazni tekshirish", "number", 3),
                F("Hujjatlashtirish", "number", 7),
                F("Muammoni aniqlash", "number", 1),
                F("Natijani tekshirish", "number", 6),
            ],
        ),
    ],
)

TOPICS = [M11, M12, M13, M14, M15]
