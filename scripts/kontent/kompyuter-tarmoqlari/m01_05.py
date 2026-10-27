"""Ma'ruzalar 1–5 (KT1406 fan dasturi, II bo'lim)."""

from kt import (T, Q, F, answer_task, S_title, S_idea, S_points, S_table, S_compare, S_code, S_quiz, S_summary)

# ======================================================================
# 1-MA'RUZA
# ======================================================================
M01 = T(
    "kt-m01-kirish",
    "1-ma'ruza: Kirish. Hisoblash tarmoqlarining rivojlanish tarixi va klassifikatsiyasi",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Kompyuter tarmog'i tushunchasi va vazifalari</li>
  <li>Hisoblash tarmoqlarining rivojlanish tarixi</li>
  <li>Tarmoq tarkibiy qismlari</li>
  <li>Kompyuter tarmoqlarining klassifikatsiyasi</li>
  <li>Tarmoqning asosiy ko'rsatkichlari</li>
</ol>

<h2>1. Kompyuter tarmog'i nima?</h2>
<p><b>Kompyuter tarmog'i</b> — aloqa kanallari orqali o'zaro bog'langan va ma'lumot hamda resurslarni birgalikda ishlatadigan avtonom kompyuterlar va boshqa qurilmalar majmui. "Avtonom" so'zi muhim: tarmoqdagi har bir kompyuter tarmoqsiz ham ishlay oladi, tarmoq esa ularga yangi imkoniyat beradi.</p>
<p>Tarmoq quyidagi vazifalarni hal qiladi:</p>
<ul>
  <li><b>Resurslarni birgalikda ishlatish</b> — bitta printer, fayl serveri yoki internet kanali ko'p foydalanuvchiga xizmat qiladi.</li>
  <li><b>Ma'lumot almashish</b> — elektron pochta, messenjerlar, umumiy hujjatlar, videoaloqa.</li>
  <li><b>Markazlashgan boshqaruv</b> — foydalanuvchi hisoblari, dasturlarni yangilash va zaxira nusxa bir joydan boshqariladi.</li>
  <li><b>Ishonchlilik</b> — ma'lumot bir necha joyda saqlanadi, bitta qurilma ishdan chiqsa ish to'xtamaydi.</li>
  <li><b>Tejamkorlik</b> — har bir kompyuterga alohida printer yoki modem sotib olish shart emas.</li>
</ul>

<h2>2. Rivojlanish tarixi</h2>
<p>Tarmoqlar birdaniga paydo bo'lmagan — har bir bosqich oldingi bosqich muammosini hal qilgan.</p>
<table>
  <tr><th>Yil</th><th>Voqea</th><th>Ahamiyati</th></tr>
  <tr><td>1950–1960-y.</td><td>Meynfreym va terminallar, vaqtni taqsimlash tizimlari</td><td>Bitta qimmat kompyuterdan ko'p foydalanuvchi navbat bilan foydalanadi</td></tr>
  <tr><td>1961–1965</td><td>L. Kleinrok, P. Beran, D. Devis — paketli kommutatsiya g'oyasi</td><td>Ma'lumot kichik bo'laklarga (paketlarga) bo'linib, mustaqil uzatiladi</td></tr>
  <tr><td>1969</td><td>ARPANET — 4 tugun: UCLA, SRI, UCSB, Yuta universiteti</td><td>Birinchi paketli kommutatsiyali tarmoq</td></tr>
  <tr><td>1971</td><td>R. Tomlinson — tarmoq orqali elektron pochta, <code>@</code> belgisi</td><td>Tarmoqning birinchi "ommabop" xizmati</td></tr>
  <tr><td>1973</td><td>R. Metkalf (Xerox PARC) — Ethernet</td><td>Lokal tarmoqlarning asosiy texnologiyasi</td></tr>
  <tr><td>1974</td><td>V. Serf va R. Kan — TCP/IP g'oyasi</td><td>Turli tarmoqlarni bir-biriga ulash tamoyili</td></tr>
  <tr><td>1983, 1-yanvar</td><td>ARPANET to'liq TCP/IP ga o'tdi</td><td>Ko'pincha Internetning "tug'ilgan kuni" deb ataladi</td></tr>
  <tr><td>1984</td><td>DNS; ISO tomonidan OSI modeli standarti</td><td>Nomlar tizimi va tarmoqlarni tavsiflash uchun yagona model</td></tr>
  <tr><td>1989–1991</td><td>T. Berners-Li (CERN) — World Wide Web: HTTP, HTML, URL</td><td>Internet keng ommaga ochildi</td></tr>
  <tr><td>1997</td><td>IEEE 802.11 — birinchi Wi-Fi standarti</td><td>Simsiz lokal tarmoqlar</td></tr>
  <tr><td>2000–2020-y.</td><td>Keng polosali va mobil internet (3G, 4G, 5G), bulutli xizmatlar, IPv6, narsalar interneti (IoT)</td><td>Tarmoq kundalik hayotning infratuzilmasiga aylandi</td></tr>
</table>
<p>O'zbekistonda internet 1990-yillarning o'rtalaridan rivojlana boshlagan: 1995-yilda <code>.uz</code> milliy domeni ro'yxatdan o'tgan. Bugun mamlakat bo'ylab optik tolali magistrallar, mobil aloqa va davlat xizmatlarining onlayn portallari ishlaydi.</p>

<blockquote><b>Paketli kommutatsiya</b> — tarmoqlar tarixidagi eng muhim g'oya. Telefon tarmog'ida suhbat davomida kanal to'liq band bo'ladi (kanallar kommutatsiyasi). Kompyuter tarmog'ida esa xabar paketlarga bo'linadi, har paket o'z yo'li bilan boradi, kanal esa paketlar orasida boshqalarga ham xizmat qiladi. Shu tufayli tarmoq tejamkor va bitta yo'l uzilsa ham ishlaydi.</blockquote>

<h2>3. Tarmoq tarkibiy qismlari</h2>
<ul>
  <li><b>Oxirgi qurilmalar (xostlar)</b> — foydalanuvchi bevosita ishlaydigan qurilmalar: kompyuter, noutbuk, telefon, server, tarmoq printeri, IP-kamera.</li>
  <li><b>Oraliq (tarmoq) qurilmalar</b> — ma'lumotni yo'naltiradi: kommutator (switch), marshrutizator (router), simsiz kirish nuqtasi, brandmauer.</li>
  <li><b>Uzatish muhiti</b> — signal tarqaladigan yo'l: mis kabel, optik tola, radioto'lqin.</li>
  <li><b>Dasturiy ta'minot</b> — protokollar (aloqa qoidalari), tarmoq operatsion tizimlari, tarmoq xizmatlari.</li>
</ul>

<h2>4. Klassifikatsiya</h2>
<h3>4.1. Hududiy qamrov bo'yicha</h3>
<table>
  <tr><th>Turi</th><th>Qamrov</th><th>Texnologiyalar</th><th>Misol</th></tr>
  <tr><td><b>PAN</b> (Personal Area Network)</td><td>~10 m</td><td>Bluetooth, USB, NFC</td><td>Telefon, quloqchin, aqlli soat</td></tr>
  <tr><td><b>LAN</b> (Local Area Network)</td><td>xona, bino, kampus</td><td>Ethernet, Wi-Fi</td><td>Kompyuter sinfi, ofis</td></tr>
  <tr><td><b>MAN</b> (Metropolitan Area Network)</td><td>shahar</td><td>optik halqalar, Metro Ethernet</td><td>Shahar bo'ylab bank filiallari</td></tr>
  <tr><td><b>WAN</b> (Wide Area Network)</td><td>mamlakat, qit'a, dunyo</td><td>optik magistrallar, MPLS, sun'iy yo'ldosh</td><td>Internet, viloyatlararo korporativ tarmoq</td></tr>
</table>
<p>Chegaralar qat'iy emas: universitet kampusi tarmog'i (CAN) LAN va MAN oralig'ida turadi. Asosiy farq — kim egalik qiladi (bitta tashkilotmi yoki provayderlarmi) va qanday texnologiya ishlatiladi.</p>

<h3>4.2. Boshqaruv arxitekturasi bo'yicha</h3>
<ul>
  <li><b>Bir rangli (peer-to-peer)</b> — barcha kompyuterlar teng huquqli, har biri ham mijoz, ham server. Kichik ofis va uy uchun qulay, lekin 10–20 kompyuterdan oshsa boshqarish qiyinlashadi.</li>
  <li><b>Mijoz-server</b> — xizmatlarni maxsus ajratilgan server beradi (fayl, pochta, ma'lumotlar bazasi). Markaziy boshqaruv, yuqori xavfsizlik, lekin server qimmat va uni boshqarish uchun administrator kerak.</li>
</ul>

<h3>4.3. Boshqa belgilar bo'yicha</h3>
<ul>
  <li><b>Uzatish muhiti:</b> simli (mis, optik) va simsiz (radio, infraqizil).</li>
  <li><b>Kommutatsiya usuli:</b> kanallar kommutatsiyasi (an'anaviy telefon), paketlar kommutatsiyasi (Internet), xabarlar kommutatsiyasi (eski telegraf, elektron pochta tamoyili).</li>
  <li><b>Kirish huquqi:</b> Internet (ochiq), intranet (tashkilot ichki tarmog'i), ekstranet (intranetning hamkorlarga ochilgan qismi).</li>
  <li><b>Topologiya:</b> shina, yulduz, halqa, to'liq bog'langan, daraxt — keyingi ma'ruzada.</li>
</ul>

<h2>5. Tarmoqning asosiy ko'rsatkichlari</h2>
<ul>
  <li><b>O'tkazuvchanlik qobiliyati</b> — vaqt birligida uzatiladigan ma'lumot hajmi, bit/s da o'lchanadi: 1 Kbit/s = 1000 bit/s, 1 Mbit/s = 10<sup>6</sup> bit/s, 1 Gbit/s = 10<sup>9</sup> bit/s. E'tibor bering: tezlik <b>bit</b>da, fayl hajmi esa ko'pincha <b>bayt</b>da (1 bayt = 8 bit). 100 Mbit/s kanal sekundiga 12,5 MB uzatadi.</li>
  <li><b>Kechikish</b> — paket manbadan manzilgacha yetib borishi uchun ketgan vaqt (ms).</li>
  <li><b>Ishonchlilik</b> — tarmoqning nosozliksiz ishlash qobiliyati, zaxira yo'llar mavjudligi.</li>
  <li><b>Kengaytirilish (masshtablanish)</b> — tarmoqqa yangi qurilma va foydalanuvchilarni qo'shish osonligi.</li>
  <li><b>Xavfsizlik</b> — ma'lumotni ruxsatsiz kirishdan himoyalash.</li>
</ul>

<h2>Xulosa</h2>
<p>Kompyuter tarmoqlari meynfreym terminallaridan boshlab ARPANET, Ethernet, TCP/IP va Web orqali bugungi global Internetgacha rivojlandi. Tarmoqlarni qamrov (PAN, LAN, MAN, WAN), arxitektura (bir rangli, mijoz-server), muhit va kommutatsiya usuli bo'yicha tasniflash mumkin.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Kompyuter tarmog'i deb nimaga aytiladi? Uning asosiy vazifalarini sanang.</li>
  <li>Paketli kommutatsiya kanallar kommutatsiyasidan nimasi bilan farq qiladi?</li>
  <li>Nega 1983-yil 1-yanvar Internetning tug'ilgan kuni deb ataladi?</li>
  <li>LAN va WAN ni qamrov, egalik va texnologiya bo'yicha solishtiring.</li>
  <li>Qanday hollarda bir rangli tarmoq, qanday hollarda mijoz-server tarmog'i tanlanadi?</li>
</ol>
""",
    [
        S_title("Kompyuter tarmoqlariga kirish", "Tarix va klassifikatsiya", "🌐"),
        S_idea("Tarmoq nima?", "Aloqa kanallari orqali bog'langan va resurslarni birgalikda ishlatadigan avtonom kompyuterlar va qurilmalar majmui.", "🔗"),
        S_points("Tarmoq nimaga kerak?", [("🖨️", "Resurslarni birgalikda ishlatish"), ("💬", "Ma'lumot almashish"), ("🛠️", "Markazlashgan boshqaruv"), ("🛡️", "Ishonchlilik"), ("💰", "Tejamkorlik")]),
        S_table("Muhim sanalar", ["Yil", "Voqea"], [
            ["1969", "ARPANET — 4 tugun"], ["1971", "Elektron pochta, @"], ["1973", "Ethernet"],
            ["1974", "TCP/IP g'oyasi"], ["1983", "ARPANET TCP/IP ga o'tdi"], ["1989–91", "World Wide Web"], ["1997", "Wi-Fi (802.11)"],
        ]),
        S_compare("Kommutatsiya usullari", ("Kanallar kommutatsiyasi", "Suhbat davomida kanal to'liq band. Telefon tarmog'i."), ("Paketlar kommutatsiyasi", "Xabar paketlarga bo'linadi, kanal hammaga xizmat qiladi. Internet.")),
        S_table("Qamrov bo'yicha", ["Turi", "Qamrov", "Misol"], [
            ["PAN", "~10 m", "Telefon + quloqchin"], ["LAN", "bino, kampus", "Kompyuter sinfi"],
            ["MAN", "shahar", "Bank filiallari"], ["WAN", "mamlakat, dunyo", "Internet"],
        ]),
        S_compare("Arxitektura", ("Bir rangli (peer-to-peer)", "Hamma teng. Arzon, sodda, lekin kichik tarmoq uchun."), ("Mijoz-server", "Xizmatni server beradi. Markaziy boshqaruv va xavfsizlik.")),
        S_quiz("Kompyuter sinfidagi 25 ta kompyuter va fayl serveri — qaysi tur?", ["LAN, mijoz-server", "MAN, bir rangli", "PAN, mijoz-server", "WAN, bir rangli"], 0, "Bitta xona — LAN; xizmatni ajratilgan server beradi — mijoz-server."),
        S_idea("Bit va bayt", "Tezlik bit/s da, fayl hajmi baytda. 1 bayt = 8 bit, shuning uchun 100 Mbit/s kanal sekundiga 12,5 MB uzatadi.", "📏"),
        S_summary("Xulosa", ["Tarmoq — avtonom qurilmalarning resurs almashuvchi majmui", "Paketli kommutatsiya — Internetning asosi", "PAN → LAN → MAN → WAN", "Bir rangli va mijoz-server arxitekturalari"]),
    ],
    [
        Q("Birinchi paketli kommutatsiyali tarmoq ARPANET qachon ishga tushgan?", ["1957", "1969", "1983", "1991"], 1, "1969-yilda ARPANET ning birinchi 4 tuguni ulangan."),
        Q("Paketli kommutatsiyaning asosiy g'oyasi qaysi?", [
            "Suhbat davomida kanal to'liq band qilinadi",
            "Xabar bo'laklarga bo'linib, har bo'lak mustaqil uzatiladi",
            "Ma'lumot faqat bitta yo'l bilan uzatiladi",
            "Har bir kompyuterga alohida kabel tortiladi",
        ], 1, "Paketlar mustaqil yo'naltiriladi, kanal esa ko'p foydalanuvchiga navbat bilan xizmat qiladi."),
        Q("Nega 1983-yil 1-yanvar Internetning tug'ilgan kuni deb ataladi?", [
            "Shu kuni World Wide Web paydo bo'lgan",
            "Shu kuni ARPANET to'liq TCP/IP ga o'tgan",
            "Shu kuni birinchi elektron xat yuborilgan",
            "Shu kuni Ethernet ixtiro qilingan",
        ], 1, "TCP/IP — turli tarmoqlarni bitta \"tarmoqlar tarmog'i\"ga birlashtirgan protokollar to'plami."),
        Q("Shahar hududini qamrab oluvchi tarmoq qanday ataladi?", ["PAN", "LAN", "MAN", "WAN"], 2, "MAN — Metropolitan Area Network, shahar tarmog'i."),
        Q("Mijoz-server arxitekturasining afzalliklari qaysilar?", [
            "Markazlashgan boshqaruv",
            "Yuqori xavfsizlik",
            "Server va administrator talab qilinmaydi",
            "Foydalanuvchi hisoblari bir joyda saqlanadi",
        ], [0, 1, 3], "Mijoz-server tarmog'i boshqaruv va xavfsizlik beradi, lekin server va uni boshqaradigan mutaxassis kerak."),
        Q("Qaysilar ORALIQ (tarmoq) qurilmalariga kiradi?", ["Kommutator (switch)", "Marshrutizator (router)", "Tarmoq printeri", "Noutbuk"], [0, 1], "Printer va noutbuk — oxirgi qurilmalar (xostlar); kommutator va marshrutizator ma'lumotni yo'naltiradi."),
        Q("100 Mbit/s kanal orqali 1 sekundda taxminan qancha ma'lumot uzatiladi?", ["100 MB", "12,5 MB", "800 MB", "1,25 MB"], 1, "100 Mbit ÷ 8 = 12,5 MB (bayt)."),
    ],
    [
        answer_task(
            "Tarix sanalari",
            "Ma'ruzadagi jadval asosida yillarni kiriting.",
            [
                F("ARPANET ning birinchi tugunlari ulangan yil", "number", 1969),
                F("ARPANET to'liq TCP/IP ga o'tgan yil", "number", 1983),
                F("T. Berners-Li Web g'oyasini taklif qilgan yil", "number", 1989),
            ],
            hints=["Jadvaldagi 'Ahamiyati' ustuniga ham qarang: 'tug'ilgan kun' deb ataladigan voqea qaysi?"],
        ),
        answer_task(
            "Tarmoqni tasniflang",
            "Har bir vaziyat uchun tarmoq turini tanlang.",
            [
                F("Universitet binosidagi 120 ta kompyuter", "choice", "LAN", options=["PAN", "LAN", "MAN", "WAN"]),
                F("Telefon va simsiz quloqchin", "choice", "PAN", options=["PAN", "LAN", "MAN", "WAN"]),
                F("Toshkent bo'ylab joylashgan bank filiallari tarmog'i", "choice", "MAN", options=["PAN", "LAN", "MAN", "WAN"]),
                F("Toshkent va Buxoro ofislari orasidagi korporativ tarmoq", "choice", "WAN", options=["PAN", "LAN", "MAN", "WAN"]),
            ],
            hints=["Qamrovga qarang: bitta bino — LAN, bitta shahar — MAN, shaharlar orasi — WAN."],
        ),
        answer_task(
            "Bit va bayt",
            "Kanal tezligi 100 Mbit/s. Hisoblang (1 bayt = 8 bit, 1 MB = 1 000 000 bayt deb oling).",
            [
                F("1 sekundda necha MB uzatiladi?", "number", 12.5, unit="MB", reject=["100", "800"]),
                F("500 MB lik fayl necha sekundda uzatiladi?", "number", 40, unit="s", reject=["5"]),
            ],
            hints=["Avval bitni baytga o'tkazing: 100 ÷ 8.", "500 MB ÷ 12,5 MB/s = ?"],
        ),
    ],
    minutes=80,
)

# ======================================================================
# 2-MA'RUZA
# ======================================================================
M02 = T(
    "kt-m02-tamoyillar",
    "2-ma'ruza: Tarmoq qurishning asosiy tamoyillari. Topologiyalar, arxitektura va tarmoq qurilmalari",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Tarmoq qurishning asosiy tamoyillari</li>
  <li>Fizik va mantiqiy topologiya</li>
  <li>Asosiy topologiyalar: shina, yulduz, halqa, to'liq bog'langan, daraxt</li>
  <li>Tarmoq arxitekturasi tushunchasi</li>
  <li>Tarmoq qurilmalari</li>
</ol>

<h2>1. Tarmoq qurish tamoyillari</h2>
<p>Har qanday tarmoq loyihasi bir xil savollarga javob berishi kerak:</p>
<ul>
  <li><b>Ulanish:</b> kompyuterlar qanday muhit (kabel, radio) orqali ulanadi?</li>
  <li><b>Manzillash:</b> ma'lumot kimga yuborilganini qanday aniqlaymiz?</li>
  <li><b>Muhitga kirish:</b> bir nechta kompyuter umumiy kanalni qanday bo'lishadi?</li>
  <li><b>Kommutatsiya va marshrutlash:</b> ma'lumot qaysi yo'l bilan boradi?</li>
  <li><b>Standartlashtirish:</b> turli ishlab chiqaruvchilarning qurilmalari bir-biri bilan ishlashi uchun umumiy qoidalar (protokollar) kerak.</li>
</ul>
<p>Bu vazifalar <b>pog'onalarga</b> ajratiladi: har pog'ona o'z masalasini hal qiladi va qo'shni pog'onalar bilan aniq interfeys orqali bog'lanadi. Bu g'oya 3-ma'ruzadagi OSI modelining asosi.</p>

<h2>2. Topologiya</h2>
<p><b>Topologiya</b> — tarmoq tugunlari va ularni bog'lovchi aloqa liniyalarining joylashish sxemasi.</p>
<ul>
  <li><b>Fizik topologiya</b> — kabellar va qurilmalar haqiqatda qanday ulangan.</li>
  <li><b>Mantiqiy topologiya</b> — signal yoki ma'lumot qanday yo'l bilan harakatlanadi. Masalan, hub ga ulangan tarmoq fizik jihatdan yulduz, mantiqan esa shina kabi ishlaydi: kadr hammaga yetib boradi.</li>
</ul>

<h2>3. Asosiy topologiyalar</h2>
<table>
  <tr><th>Topologiya</th><th>Tuzilishi</th><th>Afzalligi</th><th>Kamchiligi</th></tr>
  <tr><td><b>Shina (bus)</b></td><td>Barcha kompyuterlar bitta umumiy kabelga ulanadi, kabel uchlarida terminatorlar</td><td>Kabel kam, arzon</td><td>Kabel bir joyda uzilsa butun tarmoq ishdan chiqadi; to'qnashuvlar ko'p; nosozlikni topish qiyin</td></tr>
  <tr><td><b>Yulduz (star)</b></td><td>Har kompyuter alohida kabel bilan markaziy qurilmaga (kommutatorga) ulanadi</td><td>Bitta kabel uzilsa faqat bitta kompyuter uziladi; kengaytirish va nosozlikni topish oson</td><td>Markaziy qurilma — yagona nosozlik nuqtasi; kabel ko'proq</td></tr>
  <tr><td><b>Halqa (ring)</b></td><td>Har kompyuter ikki qo'shnisiga ulanadi, yopiq aylana hosil bo'ladi</td><td>Navbat bilan uzatish (marker) — to'qnashuv yo'q, yuklama ostida barqaror</td><td>Bitta bo'g'in uzilsa halqa buziladi (ikki halqali FDDI bundan himoyalanadi)</td></tr>
  <tr><td><b>To'liq bog'langan (mesh)</b></td><td>Har tugun har biri bilan bevosita ulangan</td><td>Eng ishonchli: bir nechta zaxira yo'l</td><td>Kabellar soni n·(n−1)/2 — juda qimmat</td></tr>
  <tr><td><b>Daraxt (tree)</b></td><td>Yulduzlarning ierarxiyasi: markaziy kommutatordan bo'lim kommutatorlariga</td><td>Katta tarmoqni bo'limlarga ajratish oson</td><td>Yuqori darajadagi qurilma ishdan chiqsa butun shoxcha uziladi</td></tr>
</table>
<p>Amalda ko'pincha <b>aralash (gibrid)</b> topologiya ishlatiladi: bino ichida yulduz/daraxt, binolar orasida halqa yoki qisman bog'langan magistral.</p>

<blockquote>To'liq bog'langan topologiyada n tugun uchun kerakli aloqa liniyalari soni: <b>L = n·(n−1)/2</b>. 5 tugun uchun 10 ta, 10 tugun uchun 45 ta, 50 tugun uchun 1225 ta liniya kerak. Shuning uchun to'liq mesh faqat kam sonli muhim tugunlar (masalan, provayder magistral marshrutizatorlari) uchun qo'llaniladi.</blockquote>

<h2>4. Tarmoq arxitekturasi</h2>
<p><b>Tarmoq arxitekturasi</b> — tarmoqning tuzilishi, pog'onalari, protokollari va ular orasidagi interfeyslarni tavsiflovchi tamoyillar majmui. Arxitektura "nima qanday bog'lanadi" degan savolga javob beradi: qaysi pog'onada qaysi vazifa bajariladi, qaysi standart ishlatiladi. Masalan, Ethernet + TCP/IP arxitekturasi bugungi lokal tarmoqlarning deyarli barchasida ishlatiladi.</p>

<h2>5. Tarmoq qurilmalari</h2>
<table>
  <tr><th>Qurilma</th><th>OSI pog'onasi</th><th>Vazifasi</th></tr>
  <tr><td><b>Tarmoq adapteri (NIC)</b></td><td>1–2</td><td>Kompyuterni muhitga ulaydi; noyob MAC manzilga ega; bitlarni signalga aylantiradi</td></tr>
  <tr><td><b>Takrorlagich (repeater)</b></td><td>1</td><td>Susaygan signalni kuchaytirib, masofani uzaytiradi</td></tr>
  <tr><td><b>Konsentrator (hub)</b></td><td>1</td><td>Ko'p portli takrorlagich: kelgan signalni BARCHA portlarga takrorlaydi</td></tr>
  <tr><td><b>Ko'prik (bridge)</b></td><td>2</td><td>Ikki segmentni bog'laydi, MAC manzilga qarab kadrni o'tkazadi yoki o'tkazmaydi</td></tr>
  <tr><td><b>Kommutator (switch)</b></td><td>2</td><td>Ko'p portli ko'prik: MAC jadvalini o'rganadi va kadrni faqat kerakli portga yuboradi</td></tr>
  <tr><td><b>Marshrutizator (router)</b></td><td>3</td><td>Turli tarmoqlarni bog'laydi, IP manzil va marshrut jadvali bo'yicha yo'l tanlaydi</td></tr>
  <tr><td><b>Shlyuz (gateway)</b></td><td>3–7</td><td>Turli protokollardagi tarmoqlarni bog'laydi; kundalik nutqda — tarmoqdan chiqish nuqtasi (marshrutizator)</td></tr>
  <tr><td><b>Simsiz kirish nuqtasi (AP)</b></td><td>1–2</td><td>Simsiz qurilmalarni simli tarmoqqa ulaydi</td></tr>
</table>
<p>Hub ning muammosi: u kadrni hamma portga takrorlagani uchun barcha kompyuterlar bitta <b>to'qnashuv domeni</b>da bo'ladi — bir vaqtda faqat bittasi uzata oladi. Kommutator har portni alohida to'qnashuv domeniga aylantiradi, shuning uchun hub lar bugun deyarli ishlatilmaydi.</p>

<h2>Xulosa</h2>
<p>Tarmoq qurish ulanish, manzillash, muhitga kirish va marshrutlash vazifalarini hal qilishdan iborat. Topologiya tanlovi narx, ishonchlilik va kengaytirish imkoniyatini belgilaydi; bugun eng keng tarqalgani — yulduz va daraxt. Qurilmalar qaysi pog'onada ishlashiga qarab farqlanadi: hub signalni takrorlaydi, switch MAC bo'yicha, router IP bo'yicha ishlaydi.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Fizik va mantiqiy topologiya farqini misol bilan tushuntiring.</li>
  <li>Nega bugun shina topologiyasi deyarli ishlatilmaydi?</li>
  <li>12 tugunli to'liq bog'langan tarmoq uchun nechta liniya kerak?</li>
  <li>Hub va kommutatorning kadrni uzatishdagi farqi nimada?</li>
  <li>Marshrutizator qachon kerak bo'ladi?</li>
</ol>
""",
    [
        S_title("Tarmoq qurish tamoyillari", "Topologiyalar va qurilmalar", "🧩"),
        S_points("Har tarmoq hal qiladigan masalalar", [("🔌", "Ulanish — qaysi muhit?"), ("🏷️", "Manzillash — kimga?"), ("🚦", "Muhitga kirish — kim gapiradi?"), ("🧭", "Marshrutlash — qaysi yo'l?"), ("📜", "Standartlar — umumiy til")]),
        S_compare("Topologiya turlari", ("Fizik", "Kabel va qurilmalar haqiqatda qanday ulangan"), ("Mantiqiy", "Ma'lumot qanday yo'l bilan yuradi")),
        S_table("Asosiy topologiyalar", ["Turi", "Afzalligi", "Kamchiligi"], [
            ["Shina", "Arzon", "Kabel uzilsa — hammasi to'xtaydi"],
            ["Yulduz", "Nosozlikni topish oson", "Markaz — yagona nosozlik nuqtasi"],
            ["Halqa", "To'qnashuv yo'q", "Bitta bo'g'in uzilsa halqa buziladi"],
            ["Mesh", "Eng ishonchli", "Kabel juda ko'p"],
            ["Daraxt", "Kengaytirish oson", "Yuqori tugun — butun shoxcha"],
        ]),
        S_idea("To'liq bog'langan tarmoq formulasi", "L = n·(n−1)/2. 5 tugun → 10 liniya, 10 tugun → 45 liniya, 50 tugun → 1225 liniya.", "🕸️"),
        S_quiz("8 tugunli to'liq bog'langan tarmoqda nechta liniya bor?", ["16", "28", "56", "64"], 1, "8·7/2 = 28."),
        S_table("Qurilmalar va pog'onalar", ["Qurilma", "Pog'ona", "Nimaga qaraydi"], [
            ["Hub, repeater", "1", "Hech narsaga — takrorlaydi"],
            ["Switch, bridge", "2", "MAC manzil"],
            ["Router", "3", "IP manzil"],
        ]),
        S_compare("Hub va switch", ("Hub", "Kadrni hamma portga takrorlaydi. Bitta to'qnashuv domeni."), ("Switch", "MAC jadvali bo'yicha faqat kerakli portga. Har port — alohida domen.")),
        S_quiz("Qaysi qurilma turli IP tarmoqlarni bog'laydi?", ["Hub", "Switch", "Router", "Repeater"], 2, "Marshrutizator 3-pog'onada ishlaydi va tarmoqlararo paketlarni yo'naltiradi."),
        S_summary("Xulosa", ["Topologiya — narx va ishonchlilik o'rtasidagi tanlov", "Bugun ko'pincha yulduz va daraxt", "Hub → switch → router: 1 → 2 → 3 pog'ona"]),
    ],
    [
        Q("Qaysi topologiyada bitta kabel uzilishi butun tarmoqni ishdan chiqaradi?", ["Yulduz", "Shina", "To'liq bog'langan", "Daraxt"], 1, "Shinada barcha kompyuterlar bitta magistral kabelni bo'lishadi."),
        Q("Yulduz topologiyasining eng zaif nuqtasi qaysi?", ["Har bir kompyuter kabeli", "Markaziy qurilma", "Terminatorlar", "Kabel uzunligi"], 1, "Markaziy kommutator ishdan chiqsa, butun tarmoq to'xtaydi."),
        Q("10 tugunli to'liq bog'langan tarmoqda nechta aloqa liniyasi bor?", ["20", "45", "90", "100"], 1, "L = 10·9/2 = 45."),
        Q("Kommutator kadrni qaysi ma'lumotga qarab yo'naltiradi?", ["IP manzil", "MAC manzil", "Port raqami", "Domen nomi"], 1, "Kommutator 2-pog'ona qurilmasi — MAC manzillar jadvalidan foydalanadi."),
        Q("Hub ga ulangan tarmoqning fizik va mantiqiy topologiyasi qanday?", [
            "Fizik — yulduz, mantiqiy — shina",
            "Fizik — shina, mantiqiy — yulduz",
            "Ikkalasi ham halqa",
            "Ikkalasi ham to'liq bog'langan",
        ], 0, "Kabellar markazga yig'ilgan (yulduz), lekin hub signalni hammaga takrorlagani uchun mantiqan umumiy shina kabi ishlaydi."),
        Q("Qaysi qurilmalar OSI ning 1-pog'onasida ishlaydi?", ["Takrorlagich", "Konsentrator (hub)", "Kommutator", "Marshrutizator"], [0, 1], "Takrorlagich va hub signal bilan ishlaydi, manzillarni tushunmaydi."),
    ],
    [
        answer_task(
            "Mesh tarmoq narxi",
            "Kompaniyaning 6 ta filiali to'liq bog'langan (mesh) topologiyada ulanmoqchi. Har bir liniyaning oylik narxi 1 200 000 so'm.",
            [
                F("Nechta aloqa liniyasi kerak?", "number", 15, reject=["30", "36"]),
                F("Barcha liniyalarning oylik narxi (so'm)", "number", 18000000, unit="so'm"),
                F("Agar yulduz topologiyasi tanlansa (markaz — 1-filial), nechta liniya kerak?", "number", 5),
            ],
            hints=["L = n·(n−1)/2, n = 6.", "Yulduzda markazdan qolgan har bir filialga bittadan liniya."],
        ),
        answer_task(
            "Qurilmani tanlang",
            "Har bir vazifa uchun mos qurilmani tanlang.",
            [
                F("Kabel 100 m dan uzun — signalni kuchaytirish kerak", "choice", "Takrorlagich", options=["Takrorlagich", "Kommutator", "Marshrutizator", "Kirish nuqtasi"]),
                F("Bino ichidagi 24 ta kompyuterni bitta LAN ga ulash", "choice", "Kommutator", options=["Takrorlagich", "Kommutator", "Marshrutizator", "Kirish nuqtasi"]),
                F("Ofis tarmog'ini provayder orqali Internetga ulash", "choice", "Marshrutizator", options=["Takrorlagich", "Kommutator", "Marshrutizator", "Kirish nuqtasi"]),
                F("Noutbuk va telefonlarni simsiz ulash", "choice", "Kirish nuqtasi", options=["Takrorlagich", "Kommutator", "Marshrutizator", "Kirish nuqtasi"]),
            ],
        ),
    ],
)

# ======================================================================
# 3-MA'RUZA
# ======================================================================
M03 = T(
    "kt-m03-osi",
    "3-ma'ruza: ISO/OSI modeli. Ochiq tizimlarning o'zaro aloqasi. Protokol, interfeys, standart",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Ochiq tizimlar va standartlashtirish zarurati</li>
  <li>Protokol, interfeys, standart tushunchalari</li>
  <li>OSI modelining yetti pog'onasi</li>
  <li>Inkapsulyatsiya va dekapsulyatsiya</li>
  <li>OSI va TCP/IP modellari</li>
</ol>

<h2>1. Ochiq tizimlar</h2>
<p>1970-yillarda har bir ishlab chiqaruvchi (IBM, DEC va boshqalar) o'z tarmoq texnologiyasini yaratgan va ular bir-biri bilan ishlay olmagan. <b>Ochiq tizim</b> — ochiq (hammaga ma'lum) standartlarga muvofiq qurilgan va shu standartlarni qo'llaydigan boshqa tizimlar bilan o'zaro ishlay oladigan tizim. Bunday o'zaro aloqani tavsiflash uchun Xalqaro standartlashtirish tashkiloti (ISO) 1984-yilda <b>OSI</b> (Open Systems Interconnection — ochiq tizimlarning o'zaro aloqasi) etalon modelini qabul qildi (ISO 7498).</p>

<h2>2. Asosiy tushunchalar</h2>
<ul>
  <li><b>Protokol</b> — turli tizimlardagi BIR XIL pog'onalar o'zaro ma'lumot almashish qoidalari: xabar formati, tartibi, xatoga javob. Masalan, ikki kompyuterning transport pog'onalari TCP protokoli bo'yicha "gaplashadi".</li>
  <li><b>Interfeys</b> — BITTA tizim ichidagi QO'SHNI pog'onalar o'rtasidagi o'zaro aloqa qoidalari: yuqori pog'ona pastkisiga qanday xizmat so'rovi beradi.</li>
  <li><b>Protokollar steki</b> — birgalikda ishlaydigan, pog'onalarga taqsimlangan protokollar to'plami (masalan, TCP/IP steki).</li>
  <li><b>Standart</b> — vakolatli tashkilot (ISO, IEEE, IETF, ITU-T) tomonidan tasdiqlangan va hamma uchun majburiy yoki tavsiyaviy hujjat. Masalan, IEEE 802.3 — Ethernet, IEEE 802.11 — Wi-Fi, IETF RFC 791 — IPv4.</li>
</ul>

<h2>3. OSI modelining pog'onalari</h2>
<table>
  <tr><th>№</th><th>Pog'ona</th><th>PDU</th><th>Vazifasi</th><th>Protokol va qurilma misollari</th></tr>
  <tr><td>7</td><td><b>Amaliy</b> (Application)</td><td>Ma'lumot</td><td>Dasturlarga tarmoq xizmatlarini beradi</td><td>HTTP, FTP, SMTP, DNS</td></tr>
  <tr><td>6</td><td><b>Taqdimot</b> (Presentation)</td><td>Ma'lumot</td><td>Ma'lumot formati: kodlash, siqish, shifrlash</td><td>UTF-8, JPEG, TLS</td></tr>
  <tr><td>5</td><td><b>Seans</b> (Session)</td><td>Ma'lumot</td><td>Muloqot seansini o'rnatish, boshqarish, tugatish</td><td>NetBIOS, RPC</td></tr>
  <tr><td>4</td><td><b>Transport</b> (Transport)</td><td>Segment</td><td>Jarayonlar orasida yetkazish, portlar, ishonchlilik, oqimni boshqarish</td><td>TCP, UDP</td></tr>
  <tr><td>3</td><td><b>Tarmoq</b> (Network)</td><td>Paket</td><td>Mantiqiy manzillash va marshrutlash</td><td>IP, ICMP; marshrutizator</td></tr>
  <tr><td>2</td><td><b>Kanal</b> (Data Link)</td><td>Kadr</td><td>Bir segment ichida yetkazish, fizik (MAC) manzil, xatoni aniqlash</td><td>Ethernet, Wi-Fi, PPP; kommutator</td></tr>
  <tr><td>1</td><td><b>Fizik</b> (Physical)</td><td>Bit</td><td>Bitlarni signalga aylantirish, raz'yomlar, kabellar</td><td>RJ-45, optik tola, radio; hub, takrorlagich</td></tr>
</table>
<p>Pog'onalarni eslab qolish uchun inglizcha jumla: <i>"All People Seem To Need Data Processing"</i> (7 dan 1 gacha).</p>

<h2>4. Inkapsulyatsiya</h2>
<p>Ma'lumot yuborilganda yuqoridan pastga tushadi. Har bir pog'ona yuqoridan kelgan ma'lumotni "o'raydi" — oldiga o'z <b>sarlavhasi</b>ni (header) qo'shadi, kanal pog'onasi esa oxiriga <b>tekshiruv qismi</b>ni (FCS) ham qo'shadi. Bu jarayon <b>inkapsulyatsiya</b> deyiladi:</p>
<pre><code>Ma'lumot
[TCP sarlavha | Ma'lumot]                         ← segment
[IP sarlavha | TCP | Ma'lumot]                    ← paket
[Ethernet | IP | TCP | Ma'lumot | FCS]            ← kadr
0110100101110…                                    ← bitlar</code></pre>
<p>Qabul qiluvchida teskari jarayon — <b>dekapsulyatsiya</b>: har pog'ona o'z sarlavhasini o'qiydi, kerakli qarorni qabul qiladi (masalan, "bu kadr menga keldimi?"), sarlavhani olib tashlaydi va qolganini yuqoriga uzatadi. Har pog'ona faqat o'z sarlavhasi bilan ishlaydi — qo'shni tizimning shu pog'onasi bilan "gaplashayotgandek".</p>

<h2>5. OSI va TCP/IP</h2>
<table>
  <tr><th>OSI</th><th>TCP/IP</th><th>Protokollar</th></tr>
  <tr><td>7, 6, 5 — Amaliy, Taqdimot, Seans</td><td>Amaliy</td><td>HTTP, DNS, SMTP, FTP, DHCP</td></tr>
  <tr><td>4 — Transport</td><td>Transport</td><td>TCP, UDP</td></tr>
  <tr><td>3 — Tarmoq</td><td>Internet (tarmoqlararo)</td><td>IP, ICMP, ARP*</td></tr>
  <tr><td>2, 1 — Kanal, Fizik</td><td>Tarmoqqa kirish</td><td>Ethernet, Wi-Fi</td></tr>
</table>
<p>OSI — <b>nazariy etalon</b>: u tarmoqni tushuntirish, o'qitish va nosozliklarni pog'onama-pog'ona qidirish uchun qulay. Amalda Internet <b>TCP/IP</b> steki ustida ishlaydi. Ko'pincha ularni aralashtirib gapiriladi: "kommutator — 2-pog'ona qurilmasi", "marshrutizator — 3-pog'ona".</p>
<p><small>* ARP IP manzilni MAC manzilga bog'laydi, shuning uchun uni ko'pincha 2 va 3-pog'onalar orasida deb hisoblashadi.</small></p>

<h2>Xulosa</h2>
<p>OSI modeli tarmoq vazifalarini yetti pog'onaga ajratadi. Protokol — teng pog'onalar o'rtasidagi qoidalar, interfeys — qo'shni pog'onalar o'rtasidagi qoidalar. Yuborishda inkapsulyatsiya, qabul qilishda dekapsulyatsiya bajariladi. Amaliyotda to'rt pog'onali TCP/IP modeli ishlatiladi.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Protokol va interfeys tushunchalarining farqi nimada?</li>
  <li>Har bir OSI pog'onasining PDU nomini ayting.</li>
  <li>Inkapsulyatsiya jarayonida qaysi pog'onalar sarlavha qo'shadi?</li>
  <li>Nega OSI modeli amalda TCP/IP dek keng tarqalmagan?</li>
  <li>Kommutator va marshrutizator qaysi pog'onalarda ishlaydi?</li>
</ol>
""",
    [
        S_title("ISO/OSI modeli", "Yetti pog'ona va inkapsulyatsiya", "🧱"),
        S_compare("Protokol va interfeys", ("Protokol", "Turli tizimlardagi BIR XIL pog'onalar o'rtasidagi qoidalar"), ("Interfeys", "Bitta tizimdagi QO'SHNI pog'onalar o'rtasidagi qoidalar")),
        S_table("OSI pog'onalari", ["№", "Pog'ona", "PDU", "Misol"], [
            ["7", "Amaliy", "Ma'lumot", "HTTP, DNS"], ["6", "Taqdimot", "Ma'lumot", "TLS, UTF-8"],
            ["5", "Seans", "Ma'lumot", "RPC"], ["4", "Transport", "Segment", "TCP, UDP"],
            ["3", "Tarmoq", "Paket", "IP, router"], ["2", "Kanal", "Kadr", "Ethernet, switch"], ["1", "Fizik", "Bit", "kabel, hub"],
        ]),
        S_code("Inkapsulyatsiya", "Ma'lumot\n[TCP | Ma'lumot]\n[IP | TCP | Ma'lumot]\n[Eth | IP | TCP | Ma'lumot | FCS]\n0110100101110…", note="Har pog'ona o'z sarlavhasini qo'shadi, qabul qiluvchida esa olib tashlaydi."),
        S_quiz("Paketni qaysi pog'ona yo'naltiradi?", ["Kanal", "Tarmoq", "Transport", "Amaliy"], 1, "3-pog'ona — tarmoq: IP manzil va marshrutlash."),
        S_quiz("Transport pog'onasining PDU si qanday ataladi?", ["Kadr", "Paket", "Segment", "Bit"], 2, "TCP da — segment, UDP da — datagramma."),
        S_table("OSI va TCP/IP", ["OSI", "TCP/IP"], [["7, 6, 5", "Amaliy"], ["4", "Transport"], ["3", "Internet"], ["2, 1", "Tarmoqqa kirish"]]),
        S_idea("Nega model kerak?", "Nosozlikni pog'onama-pog'ona qidirish mumkin: avval kabel (1), keyin manzil (3), keyin port (4), keyin dastur (7).", "🔎"),
        S_summary("Xulosa", ["7 pog'ona, har biri o'z vazifasi", "Yuborish — inkapsulyatsiya, qabul — dekapsulyatsiya", "Amalda TCP/IP ning 4 pog'onasi"]),
    ],
    [
        Q("OSI modelini qaysi tashkilot qabul qilgan?", ["IEEE", "ISO", "IETF", "W3C"], 1, "OSI — ISO 7498 standarti (1984)."),
        Q("Turli tizimlardagi bir xil pog'onalar o'rtasidagi qoidalar to'plami nima deyiladi?", ["Interfeys", "Protokol", "Topologiya", "Inkapsulyatsiya"], 1, "Interfeys esa bitta tizim ichidagi qo'shni pog'onalar orasida."),
        Q("Qaysi pog'ona shifrlash, siqish va kodlash bilan shug'ullanadi?", ["Seans", "Taqdimot", "Transport", "Kanal"], 1, "6-pog'ona — taqdimot: ma'lumot ko'rinishi."),
        Q("Kanal pog'onasining ma'lumot birligi (PDU) qaysi?", ["Bit", "Kadr", "Paket", "Segment"], 1, "Kanal pog'onasida kadr (frame), tarmoqda — paket."),
        Q("Ethernet kadrining oxiriga qo'shiladigan FCS maydoni nima uchun?", ["Manzilni ko'rsatish", "Xatoni aniqlash", "Shifrlash", "Port raqami"], 1, "FCS — Frame Check Sequence, CRC asosida kadr buzilganini aniqlaydi."),
        Q("TCP/IP modelining qaysi pog'onasi OSI ning 5, 6, 7-pog'onalariga mos keladi?", ["Transport", "Internet", "Amaliy", "Tarmoqqa kirish"], 2, "TCP/IP da seans va taqdimot vazifalari amaliy pog'onada bajariladi."),
        Q("Qaysi juftliklar to'g'ri?", ["Kommutator — 2-pog'ona", "Marshrutizator — 3-pog'ona", "Hub — 3-pog'ona", "TCP — 4-pog'ona"], [0, 1, 3], "Hub — 1-pog'ona qurilmasi."),
    ],
    [
        answer_task(
            "Pog'onani aniqlang",
            "Har bir protokol yoki qurilma OSI ning qaysi pog'onasiga tegishli? Raqamini kiriting (1–7).",
            [
                F("HTTP", "number", 7), F("TCP", "number", 4), F("IP", "number", 3),
                F("Kommutator (switch)", "number", 2), F("Optik kabel", "number", 1), F("TLS shifrlash", "number", 6),
            ],
            hints=["Pastdan sanang: 1 — fizik, 2 — kanal, 3 — tarmoq, 4 — transport."],
        ),
        answer_task(
            "PDU nomlari",
            "Ma'lumot birligining nomini yozing.",
            [
                F("2-pog'onada", "text", ["kadr", "frame"]),
                F("3-pog'onada", "text", ["paket", "packet"]),
                F("4-pog'onada (TCP)", "text", ["segment"]),
            ],
        ),
    ],
)

# ======================================================================
# 4-MA'RUZA
# ======================================================================
M04 = T(
    "kt-m04-uzatish",
    "4-ma'ruza: Berilganlarni uzatish usullari. Fizik muhitlar. Kodlash va uzatish",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Aloqa kanali va uning tavsiflari</li>
  <li>Uzatish muhitlari: mis kabel, optik tola, simsiz</li>
  <li>Uzatish rejimlari</li>
  <li>Analog va raqamli signallar, modulyatsiya</li>
  <li>Raqamli kodlash usullari</li>
  <li>Xatolarni aniqlash</li>
</ol>

<h2>1. Aloqa kanali</h2>
<p><b>Aloqa kanali</b> — signalni manbadan qabul qiluvchiga uzatuvchi texnik vositalar va muhit majmui. Asosiy tavsiflari:</p>
<ul>
  <li><b>O'tkazuvchanlik qobiliyati</b> (bit/s) — kanal orqali sekundiga uzatiladigan bitlar soni.</li>
  <li><b>Chastota polosasi</b> (Hz) — kanal buzilishsiz o'tkazadigan chastotalar oralig'i. Shennon formulasi kanalning nazariy maksimal tezligini bog'laydi: <b>C = B·log<sub>2</sub>(1 + S/N)</b>, bunda B — polosa, S/N — signal/shovqin nisbati.</li>
  <li><b>Susayish</b> — signal masofa bo'ylab kuchsizlanishi (dB). Shuning uchun har bir muhitda segment uzunligi cheklangan.</li>
  <li><b>Shovqinga bardoshlilik</b> — tashqi elektromagnit xalaqitlarga chidamlilik.</li>
</ul>

<h2>2. Uzatish muhitlari</h2>
<h3>2.1. Juft o'ralgan kabel (twisted pair)</h3>
<p>Bir-biriga o'ralgan 4 juft mis sim. O'rash elektromagnit xalaqitlarni kamaytiradi. Turlari: <b>UTP</b> (ekransiz) va <b>STP/FTP</b> (ekranlangan). Raz'yom — <b>RJ-45</b>. Kategoriyalari:</p>
<table>
  <tr><th>Kategoriya</th><th>Tezlik</th><th>Segment uzunligi</th></tr>
  <tr><td>Cat5e</td><td>1 Gbit/s</td><td>100 m</td></tr>
  <tr><td>Cat6</td><td>1 Gbit/s; 10 Gbit/s</td><td>100 m; 10G da ~55 m gacha</td></tr>
  <tr><td>Cat6a</td><td>10 Gbit/s</td><td>100 m</td></tr>
</table>
<p>Kabelni RJ-45 ga ulash tartibi T568A va T568B standartlarida belgilangan. Bir uchi T568A, ikkinchisi T568B bo'lsa — "krossover" kabel (eski qurilmalarni bevosita ulash uchun), ikkala uchi bir xil — "to'g'ri" kabel. Zamonaviy portlar (Auto-MDI/X) ikkalasini ham o'zi taniydi.</p>

<h3>2.2. Koaksial kabel</h3>
<p>Markaziy o'tkazgich, izolyatsiya, to'r ekran va qobiqdan iborat. Ilk Ethernet (10BASE5, 10BASE2) koaksialda ishlagan. Bugun asosan kabel televideniyesi va kabel internetida ishlatiladi.</p>

<h3>2.3. Optik tola</h3>
<p>Ma'lumot yorug'lik impulslari bilan shisha tola orqali uzatiladi. Elektromagnit xalaqitlarga mutlaqo befarq, susayish juda kam, tezlik va masofa eng yuqori.</p>
<ul>
  <li><b>Ko'p modali</b> (multimode) — yo'g'onroq o'zak (50/62,5 µm), arzon manba (LED/VCSEL), bino ichida yuzlab metrgacha.</li>
  <li><b>Bir modali</b> (single-mode) — ingichka o'zak (~9 µm), lazer, o'nlab-yuzlab kilometrgacha. Provayder magistrallari shunday.</li>
</ul>

<h3>2.4. Simsiz muhit</h3>
<p>Radioto'lqinlar (Wi-Fi 2,4/5/6 GHz, mobil aloqa, Bluetooth), mikroto'lqinli radioreleli liniyalar, sun'iy yo'ldosh aloqasi, infraqizil. Afzalligi — harakatchanlik va kabel yo'qligi; kamchiligi — xalaqit, to'siqlar, umumiy muhit va xavfsizlik masalalari.</p>

<h2>3. Uzatish rejimlari</h2>
<ul>
  <li><b>Simpleks</b> — faqat bir yo'nalishda (radio eshittirish).</li>
  <li><b>Yarim dupleks</b> — ikki yo'nalishda, lekin navbat bilan (ratsiya, hub li Ethernet).</li>
  <li><b>To'liq dupleks</b> — ikki yo'nalishda bir vaqtda (telefon, kommutatorli Ethernet).</li>
</ul>
<p>Shuningdek <b>ketma-ket</b> (bitlar birin-ketin, bitta liniya) va <b>parallel</b> (bir nechta bit bir vaqtda, ko'p liniya) uzatish; <b>sinxron</b> va <b>asinxron</b> uzatish farqlanadi.</p>

<h2>4. Analog va raqamli signallar</h2>
<p>Raqamli ma'lumotni analog kanal (masalan, telefon liniyasi yoki radio) orqali uzatish uchun <b>modulyatsiya</b> qilinadi — tashuvchi sinusoidaning parametri o'zgartiriladi: amplituda (AM/ASK), chastota (FM/FSK) yoki faza (PM/PSK). Zamonaviy Wi-Fi va 4G amplituda va fazani birga o'zgartiruvchi QAM dan foydalanadi. Modem — MOdulyator-DEModulyator.</p>

<h2>5. Raqamli kodlash</h2>
<p>Kabel orqali raqamli signal uzatishda bitlar kuchlanish sathlariga aylantiriladi. Usul tanlashda ikki talab bor: qabul qiluvchi <b>sinxronizatsiyani</b> yo'qotmasligi (uzun 0 yoki 1 ketma-ketligida ham) va signal <b>chastotasi</b> imkon qadar past bo'lishi.</p>
<table>
  <tr><th>Usul</th><th>Qoida</th><th>Qayerda</th></tr>
  <tr><td>NRZ-L</td><td>1 — yuqori sath, 0 — past sath</td><td>Eng sodda; uzun ketma-ketlikda sinxronizatsiya yo'qoladi</td></tr>
  <tr><td>NRZI</td><td>1 — bit boshida sath o'zgaradi, 0 — o'zgarmaydi</td><td>4B/5B bilan birga (100BASE-FX)</td></tr>
  <tr><td>Manchester</td><td>Har bit o'rtasida o'tish: 0 — yuqoridan pastga, 1 — pastdan yuqoriga (IEEE 802.3)</td><td>10 Mbit/s Ethernet; o'z-o'zini sinxronlaydi</td></tr>
  <tr><td>Differensial Manchester</td><td>O'rtada doim o'tish; 0 — bit boshida ham o'tish, 1 — o'tish yo'q</td><td>Token Ring</td></tr>
  <tr><td>AMI (bipolyar)</td><td>0 — nol sath, 1 — navbatma-navbat + va −</td><td>ISDN, T1</td></tr>
  <tr><td>MLT-3</td><td>1 — keyingi sathga (0, +, 0, −), 0 — o'zgarmaydi</td><td>100BASE-TX (Fast Ethernet)</td></tr>
</table>
<p><b>Mantiqiy kodlash</b> (4B/5B, 8B/10B, 64B/66B) — bitlar guruhini ortiqcha bitli kod bilan almashtirish: kodlarda uzun nollar ketma-ketligi bo'lmaydi, qo'shimcha xizmat belgilari paydo bo'ladi. 4B/5B da ortiqchalik 25%: 100 Mbit/s foydali ma'lumot uchun liniyada 125 Mbod uzatiladi.</p>

<h2>6. Xatolarni aniqlash</h2>
<ul>
  <li><b>Juftlik biti (parity)</b> — 1 lar sonini juft yoki toq qiladi. Bitta bit xatosini aniqlaydi, ikkitasini sezmaydi.</li>
  <li><b>Nazorat yig'indisi (checksum)</b> — IP, TCP, UDP sarlavhalarida.</li>
  <li><b>CRC</b> (siklik ortiqcha kod) — ma'lumot ikkilik polinom sifatida hosil qiluvchi polinomga bo'linadi, qoldiq kadrga qo'shiladi. Ethernet FCS — 32 bitli CRC. Ko'p bitli va paket xatolarini juda yuqori ehtimollik bilan aniqlaydi.</li>
</ul>
<p>Xato aniqlanganda kadr tashlab yuboriladi; qayta yuborishni yuqori pog'ona (masalan, TCP) bajaradi.</p>

<h2>Xulosa</h2>
<p>Fizik muhit tanlovi tezlik, masofa va narxni belgilaydi: bino ichida juft o'ralgan kabel va Wi-Fi, uzoq masofada optik tola. Bitlar kodlash usuli orqali signalga aylanadi; sinxronizatsiya va polosa kengligi o'rtasida murosaga erishiladi. Xatolar parity, checksum va CRC bilan aniqlanadi.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega juft o'ralgan kabel o'ralgan bo'ladi?</li>
  <li>Bir modali va ko'p modali optik tola farqi nimada?</li>
  <li>Yarim dupleks va to'liq dupleks rejimga misol keltiring.</li>
  <li>Manchester kodining NRZ dan afzalligi va kamchiligi qanday?</li>
  <li>CRC juftlik bitidan nimasi bilan ustun?</li>
</ol>
""",
    [
        S_title("Ma'lumot uzatish", "Muhitlar, kodlash, xatolar", "📡"),
        S_points("Kanal tavsiflari", [("⚡", "O'tkazuvchanlik, bit/s"), ("📶", "Chastota polosasi, Hz"), ("📉", "Susayish, dB"), ("🛡️", "Shovqinga bardoshlilik")]),
        S_table("Uzatish muhitlari", ["Muhit", "Tezlik", "Masofa"], [
            ["Cat5e/Cat6a", "1/10 Gbit/s", "100 m"], ["Optika (ko'p modali)", "10 Gbit/s", "300–400 m"],
            ["Optika (bir modali)", "10–100 Gbit/s", "o'nlab km"], ["Wi-Fi", "yuzlab Mbit/s", "~30 m bino ichida"],
        ]),
        S_points("Uzatish rejimlari", [("➡️", "Simpleks — bir tomonga"), ("↔️", "Yarim dupleks — navbat bilan"), ("⇄", "To'liq dupleks — bir vaqtda")]),
        S_idea("Shennon formulasi", "C = B·log₂(1 + S/N). Tezlikni oshirish uchun yo kanal polosasini kengaytirish, yo shovqinni kamaytirish kerak.", "📐"),
        S_table("Kodlash usullari", ["Usul", "Qoida"], [
            ["NRZ-L", "1 — yuqori, 0 — past"], ["Manchester", "0 — ↓, 1 — ↑ bit o'rtasida"],
            ["AMI", "1 — navbat bilan + va −"], ["MLT-3", "1 — keyingi sath (Fast Ethernet)"],
        ]),
        S_quiz("Qaysi kod har bit o'rtasida albatta o'tish qiladi?", ["NRZ-L", "NRZI", "Manchester", "AMI"], 2, "Manchester o'z-o'zini sinxronlaydi — shuning uchun 10 Mbit/s Ethernet ishlatgan."),
        S_compare("Xatolarni aniqlash", ("Juftlik biti", "Bitta xato aniqlanadi, ikkitasi — yo'q"), ("CRC", "Ko'p bitli va paket xatolari. Ethernet FCS — CRC-32")),
        S_quiz("Ethernet kadridagi FCS qaysi usulga asoslangan?", ["Juftlik biti", "CRC", "Shifrlash", "Nazorat yig'indisi"], 1, "FCS — 32 bitli CRC."),
        S_summary("Xulosa", ["Bino ichida mis va Wi-Fi, uzoqda — optika", "Kodlash: sinxronizatsiya va polosa murosasi", "CRC — kadr xatosini aniqlashning asosiy usuli"]),
    ],
    [
        Q("Juft o'ralgan kabelda simlar nima uchun o'raladi?", ["Mustahkamlik uchun", "Elektromagnit xalaqitni kamaytirish uchun", "Tezlikni 2 baravar oshirish uchun", "Kabelni ingichka qilish uchun"], 1, "O'rash qo'shni juftlar va tashqi manbalardan tushadigan xalaqitni kamaytiradi."),
        Q("Cat5e kabelining standart segment uzunligi qancha?", ["10 m", "100 m", "185 m", "2 km"], 1, "Juft o'ralgan kabelli Ethernet uchun segment — 100 m."),
        Q("Qaysi muhit elektromagnit xalaqitlarga mutlaqo befarq?", ["UTP", "Koaksial", "Optik tola", "Radio"], 2, "Optik tolada yorug'lik uzatiladi, elektr signali yo'q."),
        Q("Kommutatorli Ethernetda ikki tomon bir vaqtda uzata oladi. Bu qaysi rejim?", ["Simpleks", "Yarim dupleks", "To'liq dupleks", "Parallel"], 2, "To'liq dupleksda uzatish va qabul alohida juftlarda bir vaqtda ketadi."),
        Q("4B/5B mantiqiy kodlashning ortiqchaligi qancha?", ["5%", "20%", "25%", "50%"], 2, "Har 4 bitga 5 bit uzatiladi: 5/4 = 1,25."),
        Q("Manchester kodi uchun qaysi gaplar to'g'ri?", ["Har bit o'rtasida o'tish bor", "Signal o'z-o'zini sinxronlaydi", "NRZ ga qaraganda tor polosa talab qiladi", "10 Mbit/s Ethernetda ishlatilgan"], [0, 1, 3], "O'tishlar ko'pligi sababli Manchester NRZ ga qaraganda ikki baravar keng polosa talab qiladi."),
    ],
    [
        answer_task(
            "Uzatish vaqti",
            "100 MB fayl 1 Gbit/s kanal orqali uzatilmoqda (1 MB = 8·10⁶ bit). Sarlavhalarni hisobga olmang.",
            [
                F("Uzatish vaqti", "number", 0.8, unit="s", tol=0.001),
                F("Agar kanal 100 Mbit/s bo'lsa", "number", 8, unit="s"),
            ],
            hints=["Vaqt = hajm (bit) ÷ tezlik (bit/s) = 800·10⁶ ÷ 10⁹."],
        ),
        answer_task(
            "Kodlashni aniqlang",
            "Quyidagi tavsiflar qaysi kodlash usuliga tegishli?",
            [
                F("Har bit o'rtasida o'tish; 0 — yuqoridan pastga", "choice", "Manchester", options=["NRZ-L", "Manchester", "AMI", "MLT-3"]),
                F("1 lar navbatma-navbat + va − bilan, 0 — nol sath", "choice", "AMI", options=["NRZ-L", "Manchester", "AMI", "MLT-3"]),
                F("Fast Ethernet (100BASE-TX) da ishlatiladi", "choice", "MLT-3", options=["NRZ-L", "Manchester", "AMI", "MLT-3"]),
            ],
        ),
        answer_task(
            "Juftlik biti",
            "Juft (even) juftlik usuli ishlatiladi. Ma'lumot oxiriga qo'shiladigan juftlik bitini toping.",
            [
                F("1011001", "choice", "0", options=["0", "1"]),
                F("1110000", "choice", "1", options=["0", "1"]),
                F("0000000", "choice", "0", options=["0", "1"]),
            ],
            hints=["1 lar sonini sanang. Juft bo'lsa — 0, toq bo'lsa — 1 qo'shiladi."],
        ),
    ],
)

# ======================================================================
# 5-MA'RUZA
# ======================================================================
M05 = T(
    "kt-m05-ethernet",
    "5-ma'ruza: Ethernet texnologiyalari. Tarmoq tugunlarini adreslash. MAC manzil",
    """
<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Ethernet tarixi va standartlari</li>
  <li>MAC manzil tushunchasi</li>
  <li>Ethernet kadri tuzilishi</li>
  <li>CSMA/CD muhitga kirish usuli</li>
  <li>Kommutator va MAC jadvali</li>
</ol>

<h2>1. Ethernet</h2>
<p><b>Ethernet</b> — lokal tarmoqlarning eng keng tarqalgan texnologiyasi. 1973-yilda Xerox PARC da R. Metkalf tomonidan yaratilgan, 1980-yilda DIX (DEC, Intel, Xerox) standarti, 1983-yilda <b>IEEE 802.3</b> standarti qabul qilingan. Ethernet OSI ning 1 va 2-pog'onalarini qamraydi.</p>
<table>
  <tr><th>Standart</th><th>Nomi</th><th>Tezlik</th><th>Muhit</th></tr>
  <tr><td>10BASE5 / 10BASE2</td><td>"Qalin" / "ingichka" Ethernet</td><td>10 Mbit/s</td><td>koaksial, shina</td></tr>
  <tr><td>10BASE-T</td><td>Ethernet</td><td>10 Mbit/s</td><td>juft o'ralgan, yulduz</td></tr>
  <tr><td>100BASE-TX</td><td>Fast Ethernet</td><td>100 Mbit/s</td><td>Cat5, 2 juft</td></tr>
  <tr><td>1000BASE-T</td><td>Gigabit Ethernet</td><td>1 Gbit/s</td><td>Cat5e, 4 juft</td></tr>
  <tr><td>10GBASE-T, 10GBASE-SR/LR</td><td>10 Gigabit Ethernet</td><td>10 Gbit/s</td><td>Cat6a, optika</td></tr>
  <tr><td>40G, 100G, 400G</td><td>—</td><td>40–400 Gbit/s</td><td>optika (ma'lumot markazlari)</td></tr>
</table>
<p>Nomlash qoidasi: <code>10BASE-T</code> — 10 Mbit/s, BASE — raqamli (baseband) uzatish, T — twisted pair.</p>

<h2>2. MAC manzil</h2>
<p><b>MAC manzil</b> (Media Access Control) — tarmoq adapterining 48 bitli (6 baytli) fizik manzili. U ishlab chiqarishda adapterga yoziladi va kanal pog'onasida kadr kimga mo'ljallanganini aniqlaydi. Yozilishi: <code>D4-5D-64-A2-19-7C</code> (Windows) yoki <code>d4:5d:64:a2:19:7c</code> (Linux).</p>
<ul>
  <li>Birinchi 3 bayt — <b>OUI</b> (Organizationally Unique Identifier): IEEE tomonidan ishlab chiqaruvchiga berilgan kod.</li>
  <li>Oxirgi 3 bayt — ishlab chiqaruvchi beradigan seriya raqami.</li>
  <li>Birinchi baytning eng kichik biti (I/G): 0 — yakka manzil (unicast), 1 — guruh manzili (multicast).</li>
  <li>Birinchi baytning ikkinchi biti (U/L): 0 — zavod (global), 1 — lokal berilgan manzil.</li>
  <li><b>Broadcast</b> manzil — <code>FF-FF-FF-FF-FF-FF</code>: kadr segmentdagi barcha qurilmalarga.</li>
</ul>
<p>MAC manzil soni: 2<sup>48</sup> ≈ 281 trillion. Windows'da ko'rish: <code>ipconfig /all</code> yoki <code>getmac</code>.</p>

<h2>3. Ethernet II kadri</h2>
<table>
  <tr><th>Maydon</th><th>Hajmi</th><th>Vazifasi</th></tr>
  <tr><td>Preambula + SFD</td><td>7 + 1 bayt</td><td>Qabul qiluvchini sinxronlash va kadr boshini belgilash</td></tr>
  <tr><td>Manzil MAC</td><td>6 bayt</td><td>Kimga</td></tr>
  <tr><td>Manba MAC</td><td>6 bayt</td><td>Kimdan</td></tr>
  <tr><td>EtherType</td><td>2 bayt</td><td>Ichida qaysi protokol: 0x0800 — IPv4, 0x0806 — ARP, 0x86DD — IPv6</td></tr>
  <tr><td>Ma'lumot</td><td>46–1500 bayt</td><td>Foydali yuk (masalan, IP paket). 46 dan kam bo'lsa to'ldiriladi</td></tr>
  <tr><td>FCS</td><td>4 bayt</td><td>CRC-32 — xatoni aniqlash</td></tr>
</table>
<p>Kadr o'lchami (preambulasiz): <b>kamida 64 bayt</b>, ko'pi bilan <b>1518 bayt</b> (14 sarlavha + 1500 + 4 FCS). Maksimal foydali yuk 1500 bayt <b>MTU</b> deb ataladi.</p>

<h2>4. CSMA/CD</h2>
<p>Klassik Ethernetda barcha stansiyalar umumiy muhitni (shina yoki hub) bo'lishgan. Kim qachon uzatishini <b>CSMA/CD</b> (Carrier Sense Multiple Access with Collision Detection) belgilaydi:</p>
<ol>
  <li><b>Eshit</b> (Carrier Sense): kanal bandmi? Band bo'lsa — kut.</li>
  <li>Bo'sh bo'lsa — uzat.</li>
  <li>Uzatish davomida <b>to'qnashuvni kuzat</b> (Collision Detection).</li>
  <li>To'qnashuv bo'lsa — uzatishni to'xtat, 32 bitli <b>jam</b> signal yubor.</li>
  <li><b>Ikkilik eksponensial kutish</b>: n-to'qnashuvdan keyin 0 dan 2<sup>min(n,10)</sup>−1 gacha tasodifiy k tanlanadi, k × 512 bit vaqti kutiladi (10 Mbit/s da 51,2 µs). 16 urinishdan keyin kadr tashlanadi.</li>
</ol>
<p>Minimal kadr 64 bayt (512 bit) bo'lishining sababi: kadr uzatilib bo'lgunicha to'qnashuv signali eng uzoq stansiyadan qaytib kelishga ulgurishi kerak. Zamonaviy to'liq dupleks kommutatorli tarmoqda to'qnashuv bo'lmaydi va CSMA/CD amalda ishlamaydi.</p>

<h2>5. Kommutator qanday ishlaydi</h2>
<p>Kommutator har bir portda kelgan kadrning <b>manba MAC</b> manzilini o'qib, MAC jadvaliga yozadi (<i>o'rganish</i>). Keyin manzil MAC ni jadvaldan qidiradi:</p>
<ul>
  <li>topilsa — kadr faqat shu portga yuboriladi (<i>filtrlash va uzatish</i>);</li>
  <li>topilmasa yoki broadcast bo'lsa — kadr kelgan portdan tashqari barcha portlarga yuboriladi (<i>flooding</i>);</li>
  <li>yozuvlar ma'lum vaqt (odatda 300 s) ishlatilmasa o'chiriladi (<i>eskirish</i>).</li>
</ul>
<p>Har bir port — alohida to'qnashuv domeni, lekin barcha portlar bitta <b>broadcast domeni</b>da. Broadcast domenini faqat marshrutizator (yoki VLAN) ajratadi.</p>

<h2>Xulosa</h2>
<p>Ethernet 10 Mbit/s koaksialdan 400 Gbit/s optikagacha rivojlandi, lekin kadr tuzilishi va MAC manzillash saqlanib qoldi. MAC — 48 bitli fizik manzil; kadr 64–1518 bayt; xatolar FCS bilan aniqlanadi. Umumiy muhitda CSMA/CD ishlagan, bugun kommutator MAC jadvali yordamida kadrlarni to'g'ri portga yo'naltiradi.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>MAC manzil necha bitdan iborat va qanday qismlarga bo'linadi?</li>
  <li>EtherType maydoni nimani bildiradi?</li>
  <li>Nega Ethernet kadri 64 baytdan kichik bo'lmasligi kerak?</li>
  <li>Kommutator noma'lum manzilli kadrni nima qiladi?</li>
  <li>To'qnashuv domeni va broadcast domeni farqi nimada?</li>
</ol>
""",
    [
        S_title("Ethernet", "MAC manzil, kadr va CSMA/CD", "🔌"),
        S_table("Ethernet avlodlari", ["Standart", "Tezlik", "Muhit"], [
            ["10BASE-T", "10 Mbit/s", "juft o'ralgan"], ["100BASE-TX", "100 Mbit/s", "Cat5"],
            ["1000BASE-T", "1 Gbit/s", "Cat5e"], ["10GBASE-T", "10 Gbit/s", "Cat6a"],
        ]),
        S_idea("MAC manzil", "48 bit = 6 bayt. Birinchi 3 bayt — ishlab chiqaruvchi kodi (OUI), qolgani — seriya raqami. FF-FF-FF-FF-FF-FF — hammaga.", "🏷️"),
        S_table("Ethernet II kadri", ["Maydon", "Bayt"], [["Manzil MAC", "6"], ["Manba MAC", "6"], ["EtherType", "2"], ["Ma'lumot", "46–1500"], ["FCS (CRC-32)", "4"]], note="Kadr: 64–1518 bayt"),
        S_quiz("EtherType 0x0806 nimani bildiradi?", ["IPv4", "ARP", "IPv6", "VLAN"], 1, "0x0800 — IPv4, 0x0806 — ARP, 0x86DD — IPv6."),
        S_points("CSMA/CD", [("👂", "Eshit — kanal bo'shmi?"), ("📤", "Bo'sh bo'lsa uzat"), ("💥", "To'qnashuvni sez → JAM"), ("🎲", "Tasodifiy kutib qayta urin")]),
        S_points("Kommutator algoritmi", [("📝", "Manba MAC → jadvalga (o'rganish)"), ("🎯", "Manzil MAC jadvalda → bitta port"), ("📢", "Jadvalda yo'q → hamma portga"), ("⏳", "300 s ishlatilmasa — o'chirish")]),
        S_quiz("Kommutator jadvalida manzil MAC topilmadi. U nima qiladi?", ["Kadrni tashlab yuboradi", "Kadrni hamma portga yuboradi", "Kadrni marshrutizatorga yuboradi", "Xato xabarini qaytaradi"], 1, "Noma'lum unicast flooding qilinadi; javob kelganda kommutator manzilni o'rganib oladi."),
        S_compare("Domenlar", ("To'qnashuv domeni", "Kommutatorda har port alohida"), ("Broadcast domeni", "Kommutatorning barcha portlari bitta; uni router ajratadi")),
        S_summary("Xulosa", ["MAC — 48 bitli fizik manzil", "Kadr 64–1518 bayt, FCS bilan", "CSMA/CD — umumiy muhitda", "Switch MAC jadvalini o'zi o'rganadi"]),
    ],
    [
        Q("MAC manzil necha bitdan iborat?", ["32", "48", "64", "128"], 1, "6 bayt × 8 = 48 bit."),
        Q("MAC manzilning birinchi 3 bayti nima deyiladi?", ["Port raqami", "OUI — ishlab chiqaruvchi kodi", "Tarmoq manzili", "Seriya raqami"], 1, "OUI ni IEEE ishlab chiqaruvchiga beradi."),
        Q("Ethernet kadrining minimal hajmi (preambulasiz) qancha?", ["46 bayt", "64 bayt", "512 bayt", "1500 bayt"], 1, "64 bayt = 512 bit — to'qnashuvni aniqlash uchun zarur minimal vaqt."),
        Q("CSMA/CD da to'qnashuv aniqlangach stansiya birinchi navbatda nima qiladi?", ["Darhol qayta uzatadi", "JAM signal yuboradi", "Kadrni tashlaydi", "Marshrutizatorga xabar beradi"], 1, "JAM barcha stansiyalarga to'qnashuv bo'lganini bildiradi, keyin tasodifiy kutish boshlanadi."),
        Q("3-to'qnashuvdan keyin k qaysi oraliqda tanlanadi?", ["0–1", "0–3", "0–7", "0–15"], 2, "2³ − 1 = 7."),
        Q("Broadcast MAC manzil qaysi?", ["00-00-00-00-00-00", "FF-FF-FF-FF-FF-FF", "01-00-5E-00-00-01", "AA-AA-AA-AA-AA-AA"], 1, "Barcha bitlar 1 — segmentdagi hamma qurilmaga."),
        Q("Kommutator haqida qaysi gaplar to'g'ri?", ["Manba MAC ni jadvalga yozadi", "Broadcast ni hamma portga yuboradi", "Har port alohida broadcast domeni", "Noma'lum manzilni hamma portga yuboradi"], [0, 1, 3], "Kommutator broadcast domenini ajratmaydi — buni router yoki VLAN qiladi."),
    ],
    [
        answer_task(
            "Kadr hajmi",
            "Ethernet II kadrida foydali yuk (IP paket) 300 bayt. Preambulani hisobga olmang.",
            [
                F("Sarlavha (MAC + MAC + EtherType), bayt", "number", 14),
                F("Kadrning umumiy hajmi (FCS bilan), bayt", "number", 318),
                F("Foydali yuk 20 bayt bo'lsa, kadr hajmi (to'ldirish bilan)", "number", 64, reject=["38"]),
            ],
            hints=["Kadr = 14 + ma'lumot + 4.", "Ma'lumot 46 baytdan kam bo'lsa, 46 gacha to'ldiriladi."],
        ),
        answer_task(
            "Ikkilik eksponensial kutish",
            "10 Mbit/s Ethernet. Bitta slot = 51,2 µs.",
            [
                F("2-to'qnashuvdan keyin k ning eng katta qiymati", "number", 3),
                F("O'shanda eng uzoq kutish vaqti, µs", "number", 153.6, tol=0.01, unit="µs"),
                F("Necha urinishdan keyin kadr tashlab yuboriladi?", "number", 16),
            ],
            hints=["k ∈ [0; 2ⁿ − 1].", "Kutish = k × 51,2 µs."],
        ),
    ],
)

TOPICS = [M01, M02, M03, M04, M05]
