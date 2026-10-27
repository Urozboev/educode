"""Laboratoriya ishlari 11–14 (KT1406 fan dasturi, III bo'lim)."""

from kt import (T, Q, F, answer_task, report_task, S_title, S_idea, S_points, S_table, S_compare, S_code, S_quiz,
                S_summary)

# ======================================================================
# 11-LABORATORIYA
# ======================================================================
L11 = T(
    "kt-l11-foydalanuvchilar",
    "11-laboratoriya ishi: Windows operatsion tizimida foydalanuvchilar va ularning vakolatlarini boshqarish",
    """
<h2>Ishning maqsadi</h2>
<p>Lokal va domen foydalanuvchilari hamda guruhlarini yaratish, parol siyosatini sozlash va foydalanuvchi huquqlarini cheklash.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>SRV1 (Windows Server) va mijoz VM — 9–10-laboratoriyalardan</li>
  <li>Domen qismi uchun SRV1 da AD DS roli</li>
</ul>

<h2>Ish tartibi</h2>
<h3>1-qism. Lokal foydalanuvchilar (mijoz kompyuterda)</h3>
<ol>
  <li><code>lusrmgr.msc</code> → Users → New User: <code>talaba1</code>, parol, "User must change password at next logon".</li>
  <li>Groups → New Group: <code>Talabalar</code>, a'zo — talaba1.</li>
  <li>Buyruq qatorida (administrator): <code>net user talaba2 Parol2026! /add</code>, <code>net localgroup Talabalar talaba2 /add</code>, <code>net user talaba2</code>.</li>
  <li>PowerShell: <code>New-LocalUser -Name talaba3 -Password (Read-Host -AsSecureString)</code>, <code>Add-LocalGroupMember -Group Talabalar -Member talaba3</code>, <code>Get-LocalGroupMember Talabalar</code>.</li>
  <li>talaba1 sifatida tizimga kiring: dastur o'rnatish yoki tizim vaqtini o'zgartirishga urinib ko'ring — nima bo'ldi?</li>
</ol>
<h3>2-qism. Parol va bloklash siyosati</h3>
<ol>
  <li><code>secpol.msc</code> → Account Policies → Password Policy: minimal uzunlik 10, murakkablik — yoqilgan, maksimal muddat 90 kun.</li>
  <li>Account Lockout Policy: 5 marta noto'g'ri urinishdan keyin 15 daqiqaga bloklash.</li>
  <li>talaba2 ga qisqa parol berishga urinib ko'ring — natija?</li>
</ol>
<h3>3-qism. Foydalanuvchi huquqlari</h3>
<ol>
  <li>secpol.msc → Local Policies → User Rights Assignment → "Shut down the system": Talabalar guruhini olib tashlang.</li>
  <li>talaba1 sifatida kompyuterni o'chirishga urinib ko'ring.</li>
</ol>
<h3>4-qism. Domen (SRV1)</h3>
<ol>
  <li>Add Roles and Features → <b>Active Directory Domain Services</b> → o'rnatgach "Promote this server to a domain controller" → Add a new forest: <code>kafedra.local</code>.</li>
  <li>Qayta yuklangach, <b>Active Directory Users and Computers</b>: OU <code>Talabalar</code> yarating, unda foydalanuvchilar <code>ali.aliyev</code>, <code>vali.valiyev</code> va guruh <code>GR-Talabalar</code>.</li>
  <li>Mijozni domenga qo'shing: DNS = 192.168.10.10 bo'lishi shart; System → Rename this PC (advanced) → Domain: kafedra.local. Qayta yuklang va <code>KAFEDRA\\ali.aliyev</code> sifatida kiring.</li>
  <li>Mijozda <code>whoami</code>, <code>whoami /groups</code>, <code>echo %logonserver%</code>.</li>
</ol>

<h2>Hisobot talablari</h2>
<ul>
  <li>Lokal foydalanuvchilar va guruh a'zolari (lusrmgr yoki <code>Get-LocalGroupMember</code>).</li>
  <li>Parol siyosati oynasi va qisqa parol rad etilgan xabar.</li>
  <li>ADUC dagi OU va foydalanuvchilar; mijozdagi <code>whoami /groups</code>.</li>
</ul>
""",
    [
        S_title("Foydalanuvchilar va vakolatlar", "11-laboratoriya ishi", "👥"),
        S_code("Lokal hisoblar", "net user talaba2 Parol2026! /add\nnet localgroup Talabalar talaba2 /add\nGet-LocalGroupMember Talabalar"),
        S_table("Siyosatlar", ["Sozlama", "Qiymat"], [["Minimal uzunlik", "10"], ["Murakkablik", "yoqilgan"], ["Muddat", "90 kun"], ["Bloklash", "5 urinish → 15 daqiqa"]]),
        S_compare("Lokal va domen", ("Lokal", "lusrmgr.msc, har kompyuterda alohida"), ("Domen", "ADUC, bitta login hamma joyda")),
        S_quiz("Mijoz domenga qo'shilmayapti: 'domain could not be contacted'. Birinchi tekshiruv?", ["Parol", "Mijozning DNS i DC ga ko'rsatilganmi", "IIS", "Brandmauer o'chirilganmi"], 1, "Mijoz DC ni DNS orqali topadi."),
        S_code("Tekshirish", "whoami\nwhoami /groups\necho %logonserver%"),
        S_summary("Hisobot", ["Lokal foydalanuvchi va guruh", "Parol va bloklash siyosati", "Domen: OU, foydalanuvchi, mijoz qo'shildi"]),
    ],
    [
        Q("Lokal foydalanuvchilar konsoli?", ["services.msc", "lusrmgr.msc", "dsa.msc", "devmgmt.msc"], 1, "dsa.msc — Active Directory Users and Computers."),
        Q("Guruhga foydalanuvchi qo'shish buyrug'i?", ["net user X /group", "net localgroup Guruh X /add", "add user", "net group add"], 1, "Domenda — net group."),
        Q("Parol va bloklash siyosati lokal kompyuterda qayerda?", ["secpol.msc", "ncpa.cpl", "regedit", "taskmgr"], 0, "Local Security Policy."),
        Q("Kompyuterni o'chirish huquqi qaysi bo'limda?", ["Password Policy", "User Rights Assignment", "Audit Policy", "IP Security"], 1, "Huquqlar — User Rights Assignment."),
        Q("Domenga qo'shilish uchun mijozda nima to'g'ri bo'lishi shart?", ["Brauzer", "DNS server — DC manzili", "Statik IP", "IIS"], 1, "DC SRV yozuvlari DNS da."),
        Q("Qaysilar xavfsizlikni oshiradi?", ["Parol murakkabligi", "Hisobni bloklash siyosati", "Hamma foydalanuvchini Administrators ga qo'shish", "Eng kam imtiyoz"], [0, 1, 3], "Ortiqcha imtiyoz — xavf."),
    ],
    [
        report_task(
            "11-laboratoriya hisoboti",
            "Lokal va domen foydalanuvchilarini boshqaring.",
            [
                "lusrmgr.msc da talaba1 va Talabalar guruhini yaratdim",
                "net user va PowerShell bilan talaba2, talaba3 ni yaratdim",
                "Parol va bloklash siyosatini sozladim, qisqa parol rad etilishini tekshirdim",
                "Talabalarga kompyuterni o'chirish huquqini cheklab sinab ko'rdim",
                "SRV1 ni kafedra.local domen kontrolleriga ko'tardim",
                "OU, foydalanuvchilar va guruh yaratdim",
                "Mijozni domenga qo'shib, domen foydalanuvchisi bilan kirdim",
            ],
            "Oddiy foydalanuvchi qaysi amallarni bajara olmadi? Domenga qo'shishda qanday muammo bo'ldi? whoami /groups natijasida qaysi guruhlarni ko'rdingiz?",
            min_images=3, max_images=6, min_chars=150,
        ),
        answer_task(
            "Buyruqlar",
            "To'g'ri buyruqni yozing.",
            [
                F("talaba5 lokal foydalanuvchisini 'Qwerty2026!' paroli bilan yaratish", "text", "net user talaba5 Qwerty2026! /add"),
                F("talaba5 ni Talabalar guruhiga qo'shish", "text", "net localgroup Talabalar talaba5 /add"),
                F("Joriy foydalanuvchi a'zo guruhlarini ko'rsatish", "text", "whoami /groups"),
            ],
        ),
    ],
    coin=15, xp=30, minutes=120,
)

# ======================================================================
# 12-LABORATORIYA
# ======================================================================
L12 = T(
    "kt-l12-umumiy-resurslar",
    "12-laboratoriya ishi: Tarmoqda umumiy resurslarni yaratish va ulardan foydalanish",
    """
<h2>Ishning maqsadi</h2>
<p>Umumiy papkalar yaratish, ulashish va NTFS ruxsatlarini sozlash, samarali ruxsatni tekshirish va tarmoq diskini ulash.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>SRV1 va mijoz VM (11-laboratoriyadagi foydalanuvchilar bilan)</li>
</ul>

<h2>Ish tartibi</h2>
<h3>1-qism. Papkalar va guruhlar</h3>
<ol>
  <li>SRV1 da <code>C:\\Share\\Kurs</code>, <code>C:\\Share\\Hisobot</code>, <code>C:\\Share\\Arxiv</code> papkalarini yarating.</li>
  <li>Guruhlar: <code>GR-Talabalar</code> (talabalar), <code>GR-Oqituvchilar</code> (o'qituvchilar) — 11-laboratoriyadan.</li>
</ol>
<h3>2-qism. Ulashish va ruxsatlar</h3>
<table>
  <tr><th>Papka</th><th>Ulashish nomi</th><th>Share ruxsati</th><th>NTFS ruxsati</th></tr>
  <tr><td>Kurs</td><td>Kurs</td><td>Authenticated Users — Full</td><td>O'qituvchilar — Modify; Talabalar — Read &amp; execute</td></tr>
  <tr><td>Hisobot</td><td>Hisobot</td><td>Authenticated Users — Full</td><td>Talabalar — Modify; O'qituvchilar — Modify</td></tr>
  <tr><td>Arxiv</td><td>Arxiv$ (yashirin)</td><td>Administrators — Full</td><td>Administrators — Full control</td></tr>
</table>
<ol>
  <li>Papka → Properties → Sharing → Advanced Sharing → ulashish nomi va Permissions.</li>
  <li>Security → Edit: NTFS ruxsatlari. Kerak bo'lsa Advanced → Disable inheritance.</li>
  <li>PowerShell muqobili: <code>New-SmbShare -Name Kurs -Path C:\\Share\\Kurs -FullAccess "Authenticated Users"</code>; tekshirish — <code>Get-SmbShare</code>, <code>net share</code>.</li>
</ol>
<h3>3-qism. Mijozdan tekshirish</h3>
<ol>
  <li>Talaba sifatida kiring. Explorer manzil satriga <code>\\\\SRV1</code> — qaysi ulashishlar ko'rinadi? Arxiv ko'rinadimi?</li>
  <li><code>\\\\SRV1\\Kurs</code> da fayl yaratishga urinib ko'ring; <code>\\\\SRV1\\Hisobot</code> da yarating.</li>
  <li>Tarmoq diskini ulang: <code>net use K: \\\\SRV1\\Kurs</code>; <code>net use</code> ro'yxatini ko'ring.</li>
  <li>Serverda papka → Security → Advanced → <b>Effective Access</b>: talaba foydalanuvchisi uchun samarali ruxsatlarni ko'ring.</li>
  <li>Tajriba: Hisobot uchun Share ruxsatini "Everyone — Read" ga o'zgartiring. Talaba tarmoqdan yoza oladimi? Serverda lokal kirsa-chi? Natijani tushuntiring va qayta tiklang.</li>
</ol>

<h2>Hisobot talablari</h2>
<ul>
  <li>Share va NTFS ruxsatlari oynalari (har papka uchun).</li>
  <li>Mijozda <code>\\\\SRV1</code> ro'yxati, ruxsat yo'qligi haqidagi xabar, ulangan disk.</li>
  <li>Effective Access natijasi.</li>
</ul>
""",
    [
        S_title("Umumiy resurslar", "12-laboratoriya ishi", "📂"),
        S_table("Reja", ["Papka", "Talabalar (NTFS)"], [["Kurs", "Read & execute"], ["Hisobot", "Modify"], ["Arxiv$", "kirish yo'q"]]),
        S_code("PowerShell va buyruqlar", "New-SmbShare -Name Kurs -Path C:\\Share\\Kurs -FullAccess \"Authenticated Users\"\nnet share\nnet use K: \\\\SRV1\\Kurs"),
        S_idea("Amaliy qoida", "Share ruxsati keng (Authenticated Users — Full), aniq cheklov NTFS da. Tarmoqda ikkalasidan qattiqrog'i ishlaydi.", "📐"),
        S_quiz("Share: Everyone — Read; NTFS: Talabalar — Modify. Talaba tarmoqdan yoza oladimi?", ["Ha", "Yo'q", "Faqat lokal yoza olmaydi"], 1, "Tarmoqda Read cheklaydi."),
        S_quiz("\\\\SRV1 ro'yxatida Arxiv$ ko'rinadimi?", ["Ha", "Yo'q, lekin to'g'ridan-to'g'ri yo'l bilan ochish mumkin (ruxsat bo'lsa)", "Faqat serverda"], 1, "$ — yashirin ulashish."),
        S_summary("Hisobot", ["Ruxsatlar oynalari", "Mijozdagi sinovlar", "Effective Access"]),
    ],
    [
        Q("Ulashishlar ro'yxatini ko'rsatuvchi buyruq?", ["net use", "net share", "net view /all", "ipconfig"], 1, "Yoki Get-SmbShare."),
        Q("Tarmoq diskini ulash?", ["net share K:", "net use K: \\\\SRV1\\Kurs", "map K", "mount K"], 1, "net use."),
        Q("Samarali ruxsatni ko'rish joyi?", ["Sharing → Permissions", "Security → Advanced → Effective Access", "Event Viewer", "Task Manager"], 1, "Effective Access yorlig'i."),
        Q("NTFS ruxsatlari ichki papkalarga o'tmasligi uchun?", ["Share ruxsatini o'zgartirish", "Disable inheritance", "Papkani yashirish", "Deny Everyone"], 1, "Meros o'chiriladi."),
        Q("Talaba \\\\SRV1\\Kurs ga yoza olmaydi. Bu to'g'rimi?", ["Ha, NTFS da faqat Read & execute", "Yo'q, xato", "Share xato", "DNS xato"], 0, "Rejaga muvofiq."),
        Q("Qaysi amallar xavfsiz amaliyot?", ["Ruxsatni guruhlarga berish", "Everyone ga NTFS Full control berish", "Arxivni yashirin ulashish qilish", "Share keng, NTFS aniq"], [0, 2, 3], "Everyone ga NTFS Full — xavfli."),
    ],
    [
        report_task(
            "12-laboratoriya hisoboti",
            "Uch papkani ulashing va ruxsatlarni mijozdan tekshiring.",
            [
                "Kurs, Hisobot, Arxiv papkalarini yaratdim",
                "Jadval bo'yicha Share va NTFS ruxsatlarini sozladim",
                "Arxiv$ yashirin ulashishini yaratdim",
                "Mijozdan \\\\SRV1 ro'yxatini ko'rdim",
                "Kurs ga yozish rad etilishini, Hisobot ga yozish mumkinligini tekshirdim",
                "net use bilan tarmoq diskini uladim",
                "Share = Read tajribasini o'tkazdim va natijani tushuntirdim",
            ],
            "Share 'Everyone — Read' qilinganda talaba tarmoqdan va serverda lokal ravishda Hisobot papkasiga yoza oldimi? Nima uchun? Effective Access natijasini izohlang.",
            min_images=3, max_images=6, min_chars=150,
        ),
        answer_task(
            "Samarali ruxsat",
            "Talaba GR-Talabalar va Authenticated Users guruhlarida.",
            [
                F("Kurs: tarmoqdan samarali ruxsat", "choice", "Read & execute", options=["Full control", "Modify", "Read & execute", "Kirish yo'q"]),
                F("Hisobot: tarmoqdan samarali ruxsat", "choice", "Modify", options=["Full control", "Modify", "Read & execute", "Kirish yo'q"]),
                F("Arxiv$: tarmoqdan", "choice", "Kirish yo'q", options=["Full control", "Modify", "Read & execute", "Kirish yo'q"]),
                F("Hisobot, Share = Everyone Read bo'lganda, tarmoqdan", "choice", "Read & execute", options=["Full control", "Modify", "Read & execute", "Kirish yo'q"]),
            ],
            hints=["Tarmoqda NTFS va Share kesishmasi; Share 'Read' = o'qish va ishga tushirish."],
            difficulty="medium",
        ),
    ],
    coin=15, xp=30, minutes=90,
)

# ======================================================================
# 13-LABORATORIYA
# ======================================================================
L13 = T(
    "kt-l13-brandmauer-vpn",
    "13-laboratoriya ishi: Windows operatsion tizimida brandmauerni sozlash. VPN xizmatidan foydalanish",
    """
<h2>Ishning maqsadi</h2>
<p>Windows Defender Firewall da kiruvchi va chiquvchi qoidalar yaratish, ularni tekshirish hamda Windows'da VPN ulanishini sozlash.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>SRV1 va mijoz VM; SRV1 da IIS (10-laboratoriya)</li>
  <li>VPN qismi uchun SRV1 da Remote Access roli</li>
</ul>

<h2>Ish tartibi</h2>
<h3>1-qism. Joriy holat</h3>
<ol>
  <li><code>wf.msc</code> — Windows Defender Firewall with Advanced Security. Uch profil: Domain, Private, Public — qaysi biri faol?</li>
  <li><code>netsh advfirewall show allprofiles</code>, PowerShell: <code>Get-NetFirewallProfile | Format-Table Name, Enabled, DefaultInboundAction</code>.</li>
</ol>
<h3>2-qism. Ping ga ruxsat va taqiq</h3>
<ol>
  <li>Mijozdan SRV1 ga <code>ping 192.168.10.10</code> — javob bormi? (Sukut bo'yicha ICMP Echo ko'pincha bloklangan.)</li>
  <li>SRV1 da: Inbound Rules → New Rule → Custom → Protocol ICMPv4 → Echo Request → Allow → nomi "KT ping ruxsat". Yoki: <code>New-NetFirewallRule -DisplayName "KT ping ruxsat" -Protocol ICMPv4 -IcmpType 8 -Action Allow</code>.</li>
  <li>Yana ping qiling. Keyin qoidani o'chirib (Disable) qayta sinang.</li>
</ol>
<h3>3-qism. Portni yopish</h3>
<ol>
  <li>Mijozdan: <code>Test-NetConnection 192.168.10.10 -Port 80</code> — TcpTestSucceeded: True.</li>
  <li>SRV1 da TCP 80 uchun Block qoidasi: <code>New-NetFirewallRule -DisplayName "KT HTTP blok" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Block</code>.</li>
  <li>Mijozdan yana tekshiring va brauzerda sahifani oching. Block qoidasi Allow qoidasidan ustunligini tushuntiring.</li>
  <li>Qoidani o'chiring: <code>Remove-NetFirewallRule -DisplayName "KT HTTP blok"</code>.</li>
</ol>
<h3>4-qism. Chiquvchi qoida</h3>
<p>Mijozda Outbound Rules → Program qoidasi bilan biror brauzerga (masalan, Edge) Internetga chiqishni taqiqlang va tekshiring, keyin olib tashlang.</p>
<h3>5-qism. VPN</h3>
<ol>
  <li>SRV1: Add Roles → <b>Remote Access</b> → DirectAccess and VPN (RAS). Keyin "Open the Getting Started Wizard" → Deploy VPN only → Routing and Remote Access → Configure → Custom → VPN access.</li>
  <li>Laboratoriya muhitida sertifikatsiz ishlashi uchun: RRAS xususiyatlari → Security → "Allow custom IPsec policy for L2TP/IKEv2", umumiy kalit (pre-shared key) kiriting. IPv4 → Static address pool: 192.168.10.220 – 192.168.10.230.</li>
  <li>Foydalanuvchiga ruxsat: ADUC → foydalanuvchi → Dial-in → Allow access.</li>
  <li>Mijoz: Settings → Network → VPN → Add: server 192.168.10.10, tur "L2TP/IPsec with pre-shared key", kalit, login/parol. Ulaning.</li>
  <li><code>ipconfig</code> — yangi PPP adapteri va pool dan olingan manzilni toping. <code>Get-VpnConnection</code>.</li>
</ol>
<blockquote>Haqiqiy tashkilotda VPN sertifikat asosidagi IKEv2 yoki SSTP bilan, MFA bilan sozlanadi. PPTP dan foydalanmang — u buzilgan.</blockquote>

<h2>Hisobot talablari</h2>
<ul>
  <li>Ping ruxsat qoidasi va ping natijasi (qoida yoqiq/o'chiq).</li>
  <li><code>Test-NetConnection</code> natijalari (Block qoidasidan oldin va keyin).</li>
  <li>VPN ulangan holat va <code>ipconfig</code> dagi PPP adapter.</li>
</ul>
""",
    [
        S_title("Brandmauer va VPN", "13-laboratoriya ishi", "🧱"),
        S_points("Windows Defender Firewall", [("🏢", "Domain profil"), ("🏠", "Private profil"), ("☕", "Public profil"), ("↘️", "Inbound / ↗️ Outbound qoidalar")]),
        S_code("PowerShell", "New-NetFirewallRule -DisplayName \"KT ping ruxsat\" -Protocol ICMPv4 -IcmpType 8 -Action Allow\nTest-NetConnection 192.168.10.10 -Port 80"),
        S_quiz("Bir port uchun Allow va Block qoidalari bor. Natija?", ["Allow ishlaydi", "Block ishlaydi", "Oxirgisi ishlaydi", "Ikkalasi bekor"], 1, "Windows Firewall da Block qoidasi ustun."),
        S_points("VPN (laboratoriya)", [("🛠️", "Remote Access → RRAS"), ("🔑", "L2TP/IPsec, umumiy kalit"), ("📍", "Manzillar pool i"), ("✅", "Dial-in: Allow access")]),
        S_idea("Haqiqiy hayotda", "Sertifikatli IKEv2 yoki SSTP + MFA. PPTP — ishlatmang.", "🔐"),
        S_summary("Hisobot", ["Ping qoidasi va natijasi", "Test-NetConnection oldin/keyin", "VPN ulanishi va PPP adapter"]),
    ],
    [
        Q("Kengaytirilgan brandmauer konsoli?", ["firewall.cpl", "wf.msc", "secpol.msc", "gpedit.msc"], 1, "Windows Defender Firewall with Advanced Security."),
        Q("ICMP Echo Request turi?", ["0", "3", "8", "11"], 2, "8 — so'rov, 0 — javob."),
        Q("Portga ulanish mumkinligini tekshiruvchi PowerShell buyrug'i?", ["Test-Connection", "Test-NetConnection -Port", "Get-NetIPAddress", "Ping-Port"], 1, "TcpTestSucceeded qiymati."),
        Q("Windows Firewall da ziddiyatli Allow va Block qoidalaridan qaysi biri g'olib?", ["Allow", "Block", "Birinchi yaratilgan", "Profilga bog'liq"], 1, "Aniq taqiq ustun."),
        Q("Laboratoriyada sertifikatsiz VPN uchun qaysi tur ishlatildi?", ["PPTP", "L2TP/IPsec umumiy kalit bilan", "SSTP", "OpenVPN"], 1, "PPTP xavfsiz emas."),
        Q("VPN ulangach mijozda nimalar paydo bo'ladi?", ["Yangi PPP adapter", "Pool dan IP manzil", "Yangi MAC manzil kartada", "VPN serverga marshrut"], [0, 1, 3], "Fizik karta o'zgarmaydi."),
    ],
    [
        report_task(
            "13-laboratoriya hisoboti",
            "Brandmauer qoidalarini yarating va VPN ni sozlang.",
            [
                "Faol profil va sukut sozlamalarini aniqladim",
                "ICMP ping ruxsat qoidasini yaratib, yoqiq/o'chiq holatda tekshirdim",
                "TCP 80 ni bloklab, Test-NetConnection bilan tekshirdim",
                "Chiquvchi (outbound) qoida yaratib sinadim",
                "SRV1 da Remote Access (VPN) ni sozladim",
                "Mijozda VPN ulanishini yaratib, uladim",
                "ipconfig da PPP adapter va manzilni topdim",
            ],
            "Qaysi qoida ping ni, qaysi biri veb-sahifani ta'sirladi? VPN ulangach mijoz qanday manzil oldi? Laboratoriyadagi VPN sozlamasi real tashkilot uchun nima uchun yetarli emas?",
            min_images=3, max_images=6, min_chars=150,
        ),
        answer_task(
            "Qoidalar",
            "To'g'ri qiymatni kiriting.",
            [
                F("ICMP Echo Request turi raqami", "number", 8),
                F("HTTP blok qoidasi uchun -LocalPort qiymati", "number", 80),
                F("VPN manzillar pool idagi manzillar soni (192.168.10.220 – .230)", "number", 11),
                F("Windows profili: kafedra domeniga ulangan kompyuter", "choice", "Domain", options=["Domain", "Private", "Public"]),
            ],
        ),
    ],
    coin=15, xp=30, minutes=120,
)

# ======================================================================
# 14-LABORATORIYA
# ======================================================================
L14 = T(
    "kt-l14-nosozliklar",
    "14-laboratoriya ishi: Tarmoq nosozliklarini aniqlash. Operatsion tizim utilitalaridan foydalanish",
    """
<h2>Ishning maqsadi</h2>
<p>Windows tarmoq utilitalari bilan tizimli diagnostika qilish: ulanish, manzillash, marshrut, DNS, portlar va MTU ni tekshirish.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>Windows kompyuter (administrator), Internet</li>
  <li>Mavzu sahifasidagi diagnostika terminali (5 ta ssenariy)</li>
</ul>

<h2>Ish tartibi</h2>
<h3>1-qism. Virtual terminal</h3>
<p>Beshta holatning har birini buyruqlar bilan mustaqil tashxislang. Har holat uchun: shikoyat, bajarilgan buyruqlar, hal qiluvchi belgi, tashxis va yechim — jadvalga yozing.</p>
<h3>2-qism. Utilitalar bilan ishlash (o'z kompyuteringizda)</h3>
<table>
  <tr><th>Buyruq</th><th>Topshiriq</th></tr>
  <tr><td><code>ipconfig /all</code></td><td>Adapter, MAC, IP, shlyuz, DNS, DHCP va ijara vaqtini yozing</td></tr>
  <tr><td><code>ping -n 20 8.8.8.8</code></td><td>Yo'qotish va o'rtacha vaqtni yozing</td></tr>
  <tr><td><code>ping -f -l 1472 8.8.8.8</code></td><td>Fragmentatsiyasiz eng katta paketni toping (1472, 1473 …)</td></tr>
  <tr><td><code>tracert -d google.com</code></td><td>Sakrashlar soni, provayderingiz tarmog'i qaysi sakrashlarda</td></tr>
  <tr><td><code>pathping google.com</code></td><td>Qaysi sakrashda yo'qotish bor</td></tr>
  <tr><td><code>nslookup miracademy.uz</code> va <code>nslookup miracademy.uz 1.1.1.1</code></td><td>Javoblarni solishtiring</td></tr>
  <tr><td><code>arp -a</code></td><td>Shlyuzning MAC manzilini toping</td></tr>
  <tr><td><code>netstat -ano</code> + <code>tasklist /fi "pid eq …"</code></td><td>443-portga ulangan jarayonni aniqlang</td></tr>
  <tr><td><code>route print</code></td><td>Sukut marshruti (0.0.0.0) va uning shlyuzi</td></tr>
  <tr><td><code>Test-NetConnection google.com -Port 443</code></td><td>TcpTestSucceeded va RemoteAddress</td></tr>
  <tr><td><code>Get-NetAdapter</code></td><td>Adapter holati va LinkSpeed</td></tr>
</table>
<h3>3-qism. Nosozlikni yaratish va topish (juftlikda)</h3>
<p>Sherigingiz VM da (yoki o'qituvchi ruxsati bilan laboratoriya kompyuterida) bitta nosozlik yaratadi: noto'g'ri shlyuz, noto'g'ri DNS, adapterni o'chirish, noto'g'ri maska yoki brandmauerda ping ni bloklash. Siz faqat buyruqlar yordamida sababni topasiz. Keyin rollar almashtiriladi. Ish oxirida barcha sozlamalar tiklanadi.</p>
<blockquote>MTU hisobi: ping -l dagi qiymat ICMP ma'lumoti. Unga ICMP sarlavhasi (8 B) va IP sarlavhasi (20 B) qo'shiladi: 1472 + 28 = 1500 — Ethernet MTU.</blockquote>

<h2>Hisobot talablari</h2>
<ul>
  <li>Virtual terminaldagi 5 holat bo'yicha jadval.</li>
  <li>2-qismdagi buyruqlar natijalari (kamida 6 ta skrinshot yoki natijalar matni).</li>
  <li>3-qismdagi nosozlik va uni topish jarayoni.</li>
</ul>
""",
    [
        S_title("Diagnostika utilitalari", "14-laboratoriya ishi", "🧰"),
        S_table("Utilitalar", ["Buyruq", "Nima beradi"], [["ipconfig /all", "Manzillar, DHCP, DNS"], ["ping -n 20", "Yo'qotish, kechikish"], ["tracert / pathping", "Yo'l va yo'qotish joyi"], ["nslookup", "DNS"], ["netstat -ano", "Ulanishlar va PID"], ["Test-NetConnection", "Port ochiqmi"]]),
        S_code("MTU ni topish", "ping -f -l 1472 8.8.8.8   → javob bor\nping -f -l 1473 8.8.8.8   → Packet needs to be fragmented", note="1472 + 8 (ICMP) + 20 (IP) = 1500"),
        S_quiz("ping -f -l 1464 o'tadi, 1465 o'tmaydi. MTU?", ["1464", "1492", "1500", "1472"], 1, "1464 + 28 = 1492 (masalan, PPPoE)."),
        S_code("Jarayonni topish", "netstat -ano | findstr :443\ntasklist /fi \"pid eq 4120\""),
        S_idea("Juftlikdagi o'yin", "Sherigingiz nosozlik yaratadi — siz faqat buyruqlar bilan topasiz. Keyin almashing va oxirida hammasini tiklang.", "🎯"),
        S_summary("Hisobot", ["5 holat jadvali", "Utilitalar natijalari", "Juftlikdagi nosozlik tahlili"]),
    ],
    [
        Q("Qaysi sakrashda paket yo'qolayotganini statistik ko'rsatuvchi buyruq?", ["tracert", "pathping", "arp", "nslookup"], 1, "pathping har sakrash uchun yo'qotishni hisoblaydi."),
        Q("ping -f nima qiladi?", ["Tez yuboradi", "Fragmentatsiyani taqiqlaydi (DF bayrog'i)", "Faylga yozadi", "Cheksiz yuboradi"], 1, "MTU ni aniqlash uchun."),
        Q("1472 baytli ping o'tdi, 1473 — yo'q. MTU?", ["1472", "1473", "1500", "1501"], 2, "1472 + 28 = 1500."),
        Q("Ulanish qaysi jarayonga tegishli ekanini qanday aniqlash mumkin?", ["ipconfig /all", "netstat -ano va tasklist", "arp -a", "route print"], 1, "PID orqali."),
        Q("Sukut marshrutini ko'rsatuvchi buyruq?", ["route print", "nslookup", "getmac", "hostname"], 0, "0.0.0.0 yozuvi."),
        Q("Qaysilar DNS muammosini tekshirishga yordam beradi?", ["nslookup miracademy.uz", "nslookup miracademy.uz 1.1.1.1", "ipconfig /flushdns", "arp -a"], [0, 1, 2], "arp — 2-pog'ona."),
    ],
    [
        report_task(
            "14-laboratoriya hisoboti",
            "Uch qismni bajaring va natijalarni hujjatlashtiring.",
            [
                "Virtual terminaldagi 5 holatni tashxisladim va jadvalga yozdim",
                "ipconfig /all, ping -n 20 natijalarini oldim",
                "ping -f -l bilan MTU ni aniqladim",
                "tracert va pathping bilan yo'lni tahlil qildim",
                "netstat -ano va tasklist bilan 443-portdagi jarayonni topdim",
                "Test-NetConnection va Get-NetAdapter natijalarini oldim",
                "Juftlikda nosozlik yaratib, topdim va sozlamalarni tikladim",
            ],
            "Tarmog'ingiz MTU qiymati, ping yo'qotishi va o'rtacha kechikishi qancha? Juftlikdagi nosozlikni qaysi buyruq bilan va qanday belgi orqali topdingiz?",
            min_images=4, max_images=6, min_chars=200,
        ),
        answer_task(
            "Hisob-kitob",
            "Natijalarni hisoblang.",
            [
                F("ping -f -l 1472 o'tdi, 1473 o'tmadi. MTU", "number", 1500),
                F("ping -f -l 1452 o'tdi, 1453 o'tmadi. MTU", "number", 1480),
                F("ping -n 20: 17 ta javob. Yo'qotish, %", "number", 15, unit="%"),
            ],
            hints=["MTU = qiymat + 28.", "(20 − 17) / 20."],
        ),
    ],
    coin=15, xp=30, minutes=120,
)

TOPICS = [L11, L12, L13, L14]
