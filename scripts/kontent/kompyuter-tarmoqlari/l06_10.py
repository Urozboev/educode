"""Laboratoriya ishlari 6–10 (KT1406 fan dasturi, III bo'lim)."""

import ipaddress as ipa

from kt import (T, Q, F, answer_task, report_task, code_task, S_title, S_idea, S_points, S_table, S_compare, S_code,
                S_quiz, S_summary, mask_of)

PT = "Cisco Packet Tracer"

# ======================================================================
# 6-LABORATORIYA
# ======================================================================
LAB_NETS = list(ipa.IPv4Network("192.168.50.0/24").subnets(new_prefix=26))

L06 = T(
    "kt-l06-ip-manzil",
    "6-laboratoriya ishi: IP manzillar. Sinfli manzillar. Maskalar yordamida adreslash va IP manzillardan tejamkor foydalanish",
    f"""
<h2>Ishning maqsadi</h2>
<p>Windows'da IP manzilni qo'lda va avtomatik sozlash, maskaning tarmoq aloqasiga ta'sirini amalda ko'rish va laboratoriya uchun manzillash rejasini tuzish.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>Windows 10/11 (administrator huquqi) yoki virtual mashina</li>
  <li>{PT}</li>
  <li>Mavzu sahifasidagi IP kalkulyator va mini-emulyator</li>
</ul>
<blockquote>Laboratoriya kompyuterida sozlamani o'zgartirishdan oldin joriy qiymatlarni (<code>ipconfig /all</code>) yozib oling va ish oxirida avtomatik (DHCP) rejimga qaytaring.</blockquote>

<h2>Ish tartibi</h2>
<h3>1-qism. Windows'da statik IP</h3>
<ol>
  <li><code>ncpa.cpl</code> → adapter → Properties → Internet Protocol Version 4 (TCP/IPv4).</li>
  <li>"Use the following IP address": o'qituvchi bergan manzil (yoki o'z tarmog'ingizdagi bo'sh manzil), maska, shlyuz, DNS.</li>
  <li><code>ipconfig /all</code> bilan tekshiring: "DHCP Enabled: No".</li>
  <li>Xuddi shuni buyruq qatorida (administrator): <code>netsh interface ipv4 set address name="Ethernet" static 192.168.1.50 255.255.255.0 192.168.1.1</code> va <code>netsh interface ipv4 set dnsservers name="Ethernet" static 8.8.8.8 primary</code>.</li>
  <li>Shlyuz va 8.8.8.8 ga ping qiling.</li>
  <li>Avtomatik rejimga qaytaring: <code>netsh interface ipv4 set address name="Ethernet" dhcp</code> va <code>netsh interface ipv4 set dnsservers name="Ethernet" dhcp</code>.</li>
</ol>
<h3>2-qism. Maskaning ta'siri (Packet Tracer yoki mini-emulyator)</h3>
<ol>
  <li>Bitta kommutatorga 4 ta PC ulang: PC0 192.168.50.10, PC1 192.168.50.20, PC2 192.168.50.100, PC3 192.168.50.130.</li>
  <li>Avval hammaga /24 bering — barcha juftliklar ping qila oladimi?</li>
  <li>Endi hammaga /26 (255.255.255.192) bering. Qaysi juftliklar endi aloqa qila olmaydi? Kalkulyatorda har bir manzilning tarmog'ini toping va tushuntiring.</li>
</ol>
<h3>3-qism. Manzillash rejasi</h3>
<p>192.168.50.0/24 ni kafedraning 4 xonasi uchun teng bo'ling (har birida ≤ 60 kompyuter):</p>
<table>
  <tr><th>Xona</th><th>Tarmoq</th><th>Shlyuz (birinchi xost)</th><th>DHCP diapazoni</th><th>Broadcast</th></tr>
  {"".join(f"<tr><td>{i + 1}</td><td>{n}</td><td>{n.network_address + 1}</td><td>{n.network_address + 10} – {n.broadcast_address - 1}</td><td>{n.broadcast_address}</td></tr>" for i, n in enumerate(LAB_NETS))}
</table>
<p>Har xonada shlyuz — birinchi manzil, 2–9 — server va printerlar uchun statik, qolgani DHCP.</p>

<h2>Hisobot talablari</h2>
<ul>
  <li>Statik IP sozlangan oyna va <code>ipconfig /all</code> skrinshoti.</li>
  <li>/24 va /26 da ping natijalari (qaysi juftlik ishladi, qaysi yo'q).</li>
  <li>Manzillash rejasi jadvali.</li>
</ul>
""",
    [
        S_title("IP manzilni sozlash", "6-laboratoriya ishi", "🏷️"),
        S_code("netsh bilan", "netsh interface ipv4 set address name=\"Ethernet\" static 192.168.1.50 255.255.255.0 192.168.1.1\nnetsh interface ipv4 set address name=\"Ethernet\" dhcp"),
        S_table("/26 da manzillar", ["PC", "IP", "Tarmoq"], [["PC0", "192.168.50.10", "192.168.50.0"], ["PC1", "192.168.50.20", "192.168.50.0"], ["PC2", "192.168.50.100", "192.168.50.64"], ["PC3", "192.168.50.130", "192.168.50.128"]]),
        S_quiz("/26 da PC0 (…50.10) va PC2 (…50.100) ping qila oladimi?", ["Ha", "Yo'q", "Faqat bir tomonga"], 1, "Ular turli quyi tarmoqlarda (.0 va .64) — shlyuz kerak."),
        S_table("Reja: 192.168.50.0/24 → 4 xona", ["Xona", "Tarmoq"], [[str(i + 1), str(n)] for i, n in enumerate(LAB_NETS)]),
        S_idea("Tejamkorlik", "Har xonaga /26 — 62 manzil. Hammaga /24 bersak, 4 ta to'liq tarmoq (1016 manzil) band bo'lardi.", "💡"),
        S_summary("Hisobot", ["Statik IP skrinshoti", "/24 va /26 ping natijalari", "Manzillash rejasi"]),
    ],
    [
        Q("Windows'da TCP/IPv4 sozlamalarini tez ochish buyrug'i?", ["regedit", "ncpa.cpl", "msconfig", "services.msc"], 1, "Network Connections."),
        Q("Statik IP sozlangach ipconfig /all da 'DHCP Enabled' nima ko'rsatadi?", ["Yes", "No", "Static", "Manual"], 1, "Manzil qo'lda berilgan."),
        Q("192.168.50.130/26 qaysi tarmoqqa tegishli?", ["192.168.50.0", "192.168.50.64", "192.168.50.128", "192.168.50.192"], 2, "128–191 bloki."),
        Q("/26 tarmoqda nechta xost?", ["30", "62", "64", "126"], 1, "2⁶ − 2."),
        Q("Ish oxirida adapterni DHCP ga qaytarish buyrug'i?", ["ipconfig /renew", "netsh interface ipv4 set address name=\"Ethernet\" dhcp", "arp -d", "route delete"], 1, "Keyin ipconfig /renew bilan yangi manzil olinadi."),
        Q("Qaysi juftliklar /26 da bir tarmoqda?", ["192.168.50.10 va 192.168.50.20", "192.168.50.70 va 192.168.50.120", "192.168.50.100 va 192.168.50.130", "192.168.50.200 va 192.168.50.250"], [0, 1, 3], ".100 (64–127) va .130 (128–191) turli."),
    ],
    [
        report_task(
            "6-laboratoriya hisoboti",
            "Uchala qismni bajaring.",
            [
                "Joriy sozlamalarni yozib oldim",
                "Statik IP ni grafik interfeysda sozladim",
                "netsh orqali sozlab, ping bilan tekshirdim",
                "Adapterni DHCP rejimiga qaytardim",
                "4 ta PC bilan /24 va /26 ni solishtirdim",
                "192.168.50.0/24 uchun manzillash rejasini tuzdim",
            ],
            "/26 maskada qaysi kompyuterlar o'zaro aloqa qila olmadi va nima uchun? Manzillash rejangiz qancha manzilni tejaydi?",
            min_images=2, max_images=5, min_chars=150,
        ),
        answer_task(
            "Rejani tekshiring",
            "192.168.50.0/24 ni 4 ta teng xonaga bo'lish.",
            [
                F("3-xona tarmog'i", "ip", str(LAB_NETS[2])),
                F("3-xona shlyuzi (birinchi xost)", "ip", str(LAB_NETS[2].network_address + 1)),
                F("4-xona broadcast", "ip", str(LAB_NETS[3].broadcast_address)),
                F("Bitta xonadagi maksimal kompyuterlar soni", "number", 62),
            ],
        ),
    ],
    coin=15, xp=30, minutes=80,
)

# ======================================================================
# 7-LABORATORIYA
# ======================================================================
L07 = T(
    "kt-l07-marshrutizator",
    "7-laboratoriya ishi: Marshrutizatorlarni boshqarish",
    f"""
<h2>Ishning maqsadi</h2>
<p>Marshrutizatorning buyruq qatori (CLI) bilan ishlash, interfeyslarni sozlash, statik va dinamik marshrutlash yordamida ikki tarmoqni bog'lash.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>{PT} — marshrutizator 2911 (yoki 1941), kommutator 2960, PC lar</li>
  <li>Mavzu sahifasidagi mini-emulyator ("2 tarmoq + router" va "2 router" namunalari)</li>
</ul>

<h2>CLI rejimlari</h2>
<table>
  <tr><th>Taklif</th><th>Rejim</th><th>Kirish</th></tr>
  <tr><td><code>Router&gt;</code></td><td>Foydalanuvchi</td><td>—</td></tr>
  <tr><td><code>Router#</code></td><td>Privilegiyali</td><td><code>enable</code></td></tr>
  <tr><td><code>Router(config)#</code></td><td>Global sozlash</td><td><code>configure terminal</code></td></tr>
  <tr><td><code>Router(config-if)#</code></td><td>Interfeys</td><td><code>interface g0/0</code></td></tr>
</table>

<h2>Ish tartibi</h2>
<h3>1-qism. Bitta router, ikki LAN</h3>
<p>Sxema: PC0, PC1 — Switch0 — R1 G0/0 (192.168.1.1/24); PC2, PC3 — Switch1 — R1 G0/1 (192.168.2.1/24).</p>
<pre><code>Router&gt; enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# enable secret Kafedra2026
R1(config)# interface g0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface g0/1
R1(config-if)# ip address 192.168.2.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# end
R1# show ip interface brief
R1# show ip route</code></pre>
<p>PC larga IP va <b>shlyuz</b> bering (192.168.1.x → shlyuz 192.168.1.1; 192.168.2.x → 192.168.2.1). PC0 dan PC2 ga ping qiling. Shlyuzni ataylab o'chirib qayta sinang — nima o'zgardi?</p>
<h3>2-qism. Ikki router, statik marshrut</h3>
<p>R1 G0/0 — LAN A 192.168.1.0/24; R1 G0/1 ↔ R2 G0/1 — 10.0.0.0/30 (R1 = .1, R2 = .2); R2 G0/0 — LAN B 192.168.2.0/24.</p>
<pre><code>R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1</code></pre>
<p>Avval faqat R1 da marshrutni yozib ping qiling, keyin R2 da ham. Natijalarni solishtiring.</p>
<h3>3-qism. Dinamik marshrutlash (OSPF)</h3>
<p>Statik marshrutlarni olib tashlang (<code>no ip route …</code>) va OSPF ni yoqing:</p>
<pre><code>R1(config)# router ospf 1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 10.0.0.0 0.0.0.3 area 0
(R2 da 192.168.2.0 va 10.0.0.0 tarmoqlari uchun xuddi shunday)
R1# show ip route        ← "O" belgili yozuv paydo bo'ladi
R1# show ip ospf neighbor</code></pre>
<h3>4-qism. Saqlash</h3>
<p><code>copy running-config startup-config</code> (yoki <code>write memory</code>). Saqlanmasa, qayta yuklanganda sozlamalar yo'qoladi.</p>

<h2>Hisobot talablari</h2>
<ul>
  <li>Sxema, <code>show ip interface brief</code> va <code>show ip route</code> natijalari (statik va OSPF).</li>
  <li>Ping natijalari: bir tomonlama va ikki tomonlama statik marshrut.</li>
</ul>
""",
    [
        S_title("Marshrutizator CLI", "7-laboratoriya ishi", "🛣️"),
        S_table("Rejimlar", ["Taklif", "Rejim"], [["Router>", "Foydalanuvchi"], ["Router#", "Privilegiyali (enable)"], ["(config)#", "Global (conf t)"], ["(config-if)#", "Interfeys"]]),
        S_code("Interfeys", "interface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown"),
        S_code("Statik marshrut", "R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2\nR2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1"),
        S_quiz("Marshrutizator interfeysi sozlandi, lekin 'administratively down'. Nima unutilgan?", ["ip address", "no shutdown", "hostname", "enable"], 1, "Cisco interfeyslari sukut bo'yicha o'chiq."),
        S_code("OSPF", "router ospf 1\n network 192.168.1.0 0.0.0.255 area 0\n network 10.0.0.0 0.0.0.3 area 0", note="Wildcard maska = maskaning teskarisi"),
        S_idea("Saqlashni unutmang", "copy running-config startup-config — aks holda qayta yuklanganda hammasi yo'qoladi.", "💾"),
        S_summary("Hisobot", ["show ip interface brief", "show ip route (S va O)", "Bir va ikki tomonlama ping"]),
    ],
    [
        Q("Privilegiyali rejimga o'tish buyrug'i?", ["configure terminal", "enable", "interface", "login"], 1, "Router> → Router#."),
        Q("Interfeysni yoqish buyrug'i?", ["shutdown", "no shutdown", "enable", "up"], 1, "no shutdown."),
        Q("Interfeyslar holatini qisqacha ko'rsatuvchi buyruq?", ["show ip route", "show ip interface brief", "show version", "show running-config"], 1, "IP, holat, protokol."),
        Q("/30 maskaning OSPF wildcard ko'rinishi?", ["255.255.255.252", "0.0.0.3", "0.0.0.255", "0.0.0.4"], 1, "Maskaning teskarisi."),
        Q("Marshrut jadvalida OSPF yozuvi qaysi harf bilan?", ["S", "C", "O", "R"], 2, "S — statik, C — ulangan, R — RIP."),
        Q("Qaysi buyruqlar sozlamani saqlaydi?", ["copy running-config startup-config", "write memory", "show startup-config", "reload"], [0, 1], "reload — qayta yuklash."),
    ],
    [
        report_task(
            "7-laboratoriya hisoboti",
            "Packet Tracer da to'rt qismni bajaring.",
            [
                "Bitta router bilan ikki LAN ni bog'ladim, PC larga shlyuz berdim",
                "show ip interface brief va show ip route natijalarini oldim",
                "Ikki routerli sxemada faqat R1 da statik marshrut bilan ping qildim",
                "R2 da ham marshrut qo'shib, ping muvaffaqiyatli bo'lganini tekshirdim",
                "Statik marshrutlarni OSPF bilan almashtirdim",
                "Sozlamalarni saqladim",
            ],
            "Statik marshrut faqat bitta routerda yozilganda nima bo'ldi va nega? OSPF yoqilgach marshrut jadvalida qanday o'zgarish ko'rdingiz?",
            min_images=3, max_images=6, min_chars=150,
        ),
        answer_task(
            "Buyruqlar",
            "R1 da G0/1 interfeysiga 10.0.0.1/30 manzil berish va R2 orqali 192.168.2.0/24 ga marshrut.",
            [
                F("10.0.0.1/30 ning maskasi", "ip", mask_of(30)),
                F("Statik marshrut buyrug'i (to'liq)", "text", ["ip route 192.168.2.0 255.255.255.0 10.0.0.2"]),
                F("OSPF da 10.0.0.0/30 uchun wildcard", "ip", "0.0.0.3"),
            ],
            hints=["ip route <tarmoq> <maska> <keyingi sakrash>."],
        ),
    ],
    coin=15, xp=30, minutes=90,
)

# ======================================================================
# 8-LABORATORIYA
# ======================================================================
SERVER_PY = """import socket

HOST, PORT = "127.0.0.1", 5000

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind((HOST, PORT))
    srv.listen()
    print(f"Server {HOST}:{PORT} da kutmoqda...")
    conn, addr = srv.accept()
    with conn:
        print("Ulandi:", addr)
        while True:
            data = conn.recv(1024)
            if not data:          # mijoz ulanishni yopdi
                break
            matn = data.decode("utf-8")
            print("Keldi:", matn)
            conn.sendall(matn.upper().encode("utf-8"))"""

CLIENT_PY = """import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(("127.0.0.1", 5000))
    while True:
        xabar = input("> ")
        if xabar == "exit":
            break
        s.sendall(xabar.encode("utf-8"))
        print("Javob:", s.recv(1024).decode("utf-8"))"""

L08 = T(
    "kt-l08-soketlar",
    "8-laboratoriya ishi: Soketlar yordamida tarmoq dasturini yaratish",
    f"""
<h2>Ishning maqsadi</h2>
<p>Python'da TCP va UDP soketlari orqali mijoz-server dasturini yozish, ulanish holatlarini kuzatish va oddiy amaliy protokol ishlab chiqish.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>Python 3.10+ (python.org), istalgan muharrir (VS Code, IDLE)</li>
  <li>Ikkita buyruq qatori oynasi</li>
  <li>Ixtiyoriy: Wireshark (Npcap loopback adapteri bilan)</li>
</ul>
<blockquote>Platformadagi kod muharriri brauzerda ishlaydi va haqiqiy tarmoq ulanishi ocha olmaydi. Shuning uchun server va mijoz o'z kompyuteringizda ishga tushiriladi; platformadagi kod topshirig'ida esa server ichidagi buyruqlarni qayta ishlash mantig'i yoziladi.</blockquote>

<h2>Ish tartibi</h2>
<h3>1-qism. TCP echo-server</h3>
<p><code>server.py</code>:</p>
<pre><code>{SERVER_PY.replace("<", "&lt;").replace(">", "&gt;")}</code></pre>
<p><code>client.py</code>:</p>
<pre><code>{CLIENT_PY.replace("<", "&lt;").replace(">", "&gt;")}</code></pre>
<ol>
  <li>Birinchi oynada <code>python server.py</code>, ikkinchisida <code>python client.py</code>.</li>
  <li>Bir nechta xabar yuboring — server katta harf bilan qaytaradi.</li>
  <li>Uchinchi oynada <code>netstat -an | findstr 5000</code>: LISTENING va ESTABLISHED qatorlarini toping. Mijoz qaysi portdan ulangan?</li>
  <li>Mijozni <code>exit</code> bilan yoping — serverda <code>recv()</code> nima qaytardi?</li>
  <li>Server ishlamayotganda mijozni ishga tushiring — qanday xato chiqadi? (<code>ConnectionRefusedError</code>)</li>
</ol>
<h3>2-qism. UDP</h3>
<p>Serverni <code>SOCK_DGRAM</code> ga o'zgartiring: <code>listen/accept</code> o'rniga <code>data, addr = srv.recvfrom(1024)</code> va <code>srv.sendto(javob, addr)</code>. Mijozda <code>connect</code> shart emas: <code>s.sendto(..., ("127.0.0.1", 5000))</code>. Server o'chiq bo'lganda UDP mijoz qanday harakat qiladi?</p>
<h3>3-qism. O'z protokolingiz</h3>
<p>Serverni kengaytiring: u buyruqlarni tushunsin — <code>UPPER matn</code>, <code>SUM a b</code>, <code>REVERSE matn</code>, noma'lum buyruqqa <code>ERROR</code>. Mantiqni avval platformadagi kod topshirig'ida yozib sinab ko'ring, keyin serverga ko'chiring.</p>
<h3>4-qism (ixtiyoriy). Wireshark</h3>
<p>"Adapter for loopback traffic capture" interfeysida <code>tcp.port == 5000</code> filtri bilan SYN, SYN-ACK, ACK va ma'lumot segmentlarini ko'ring.</p>

<h2>Hisobot talablari</h2>
<ul>
  <li>Server va mijoz ishlayotgan ikki oyna skrinshoti.</li>
  <li><code>netstat</code> natijasi.</li>
  <li>3-qismdagi kengaytirilgan server ishlayotgani skrinshoti.</li>
</ul>
""",
    [
        S_title("Soketlar bilan dastur", "8-laboratoriya ishi", "🔌"),
        S_table("TCP soket chaqiruvlari", ["Server", "Mijoz"], [["socket()", "socket()"], ["bind()", "—"], ["listen()", "—"], ["accept()", "connect()"], ["recv()/sendall()", "sendall()/recv()"], ["close()", "close()"]]),
        S_code("Server yadrosi", "srv.bind((\"127.0.0.1\", 5000))\nsrv.listen()\nconn, addr = srv.accept()\ndata = conn.recv(1024)\nconn.sendall(data.upper())"),
        S_quiz("Mijoz ulanishni yopdi. Serverda recv() nima qaytaradi?", ["None", "b'' (bo'sh bayt)", "Xato", "-1"], 1, "Bo'sh bayt — ulanish yopildi belgisi."),
        S_compare("TCP va UDP soket", ("SOCK_STREAM", "listen, accept, connect; ishonchli oqim"), ("SOCK_DGRAM", "sendto, recvfrom; ulanishsiz")),
        S_code("netstat", "netstat -an | findstr 5000", output="TCP  127.0.0.1:5000   0.0.0.0:0          LISTENING\nTCP  127.0.0.1:5000   127.0.0.1:51544    ESTABLISHED"),
        S_summary("Hisobot", ["Server va mijoz skrinshoti", "netstat natijasi", "Kengaytirilgan protokol"]),
    ],
    [
        Q("Serverda ulanishlarni kutishni boshlovchi chaqiruv?", ["connect()", "listen()", "send()", "recv()"], 1, "Keyin accept() mijozni kutadi."),
        Q("accept() nima qaytaradi?", ["Port raqami", "Yangi soket va mijoz manzili", "Faqat True", "Xabar"], 1, "conn, addr."),
        Q("Server o'chiq paytda TCP mijoz connect() qilsa?", ["Kutib turadi", "ConnectionRefusedError", "Xabar yo'qoladi", "Avtomatik UDP ga o'tadi"], 1, "Port yopiq — RST qaytadi."),
        Q("Matnni soket orqali yuborishdan oldin nima qilinadi?", ["int() ga aylantirish", "encode() — baytlarga", "split()", "Hech narsa"], 1, "Soket baytlar bilan ishlaydi."),
        Q("UDP serverda qabul qilish chaqiruvi?", ["accept()", "recvfrom()", "listen()", "connect()"], 1, "Jo'natuvchi manzili bilan birga qaytaradi."),
        Q("netstat da server porti qanday holatlarda ko'rinadi?", ["LISTENING", "ESTABLISHED", "SYN_FLOOD", "CLOSE_WAIT"], [0, 1, 3], "SYN_FLOOD holat emas."),
    ],
    [
        report_task(
            "8-laboratoriya hisoboti",
            "TCP va UDP mijoz-server dasturlarini o'z kompyuteringizda ishga tushiring.",
            [
                "server.py va client.py ni yozdim va ishga tushirdim",
                "Bir nechta xabar almashdim",
                "netstat bilan LISTENING va ESTABLISHED holatlarini topdim",
                "Mijoz yopilganda va server o'chiq bo'lganda nima bo'lishini tekshirdim",
                "UDP variantini yozdim",
                "Serverga UPPER / SUM / REVERSE buyruqlarini qo'shdim",
            ],
            "Mijoz qaysi portdan ulandi? TCP va UDP variantlarining xulq-atvoridagi farqni (ayniqsa server o'chiq bo'lganda) yozing.",
            min_images=2, max_images=5, min_chars=150,
        ),
        code_task(
            "Server buyruqlari",
            "Server mantiqini yozing. Birinchi qatorda N, keyingi N qatorda buyruqlar:\nUPPER matn → matnni katta harflarda\nSUM a b → ikki butun son yig'indisi\nREVERSE matn → matn teskari\nboshqa har qanday → ERROR\nHar buyruqqa javobni alohida qatorda chiqaring.",
            "n = int(input())\nfor _ in range(n):\n    qator = input()\n    # Kodingizni shu yerga yozing\n",
            "n = int(input())\nfor _ in range(n):\n    qator = input()\n    cmd, _, rest = qator.partition(' ')\n    if cmd == 'UPPER':\n        print(rest.upper())\n    elif cmd == 'SUM':\n        a, b = rest.split()\n        print(int(a) + int(b))\n    elif cmd == 'REVERSE':\n        print(rest[::-1])\n    else:\n        print('ERROR')",
            [("3\nUPPER salom dunyo\nSUM 2 40\nREVERSE tarmoq", "SALOM DUNYO\n42\nqomrat"), ("2\nPING\nSUM -5 5", "ERROR\n0"),
             ("1\nREVERSE abc", "cba"), ("2\nUPPER x\nHELLO world", None)],
            hints=["qator.partition(' ') — birinchi bo'shliqdan ikkiga bo'ladi.", "rest[::-1] — teskari."],
            difficulty="medium",
        ),
    ],
    coin=15, xp=30, minutes=90,
)

# ======================================================================
# 9-LABORATORIYA
# ======================================================================
L09 = T(
    "kt-l09-windows-server",
    "9-laboratoriya ishi: Windows Server operatsion tizimini o'rnatish va boshlang'ich sozlash",
    """
<h2>Ishning maqsadi</h2>
<p>Virtual mashinada Windows Server ni o'rnatish va uni tarmoqda ishlashga tayyorlash: nom, statik IP, vaqt mintaqasi, masofaviy boshqaruv.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>Virtualizatsiya: Oracle VirtualBox (bepul) yoki Hyper-V (Windows 10/11 Pro)</li>
  <li>Windows Server 2022 (yoki 2025) <b>Evaluation</b> ISO — Microsoft Evaluation Center dan bepul, 180 kun</li>
  <li>Kompyuterda kamida 8 GB RAM va 40 GB bo'sh disk tavsiya etiladi</li>
</ul>

<h2>Minimal talablar (Windows Server 2022)</h2>
<table>
  <tr><th>Resurs</th><th>Minimal</th><th>VM uchun tavsiya</th></tr>
  <tr><td>Protsessor</td><td>1,4 GHz, 64-bit</td><td>2 yadro</td></tr>
  <tr><td>RAM</td><td>512 MB (Server Core), 2 GB (Desktop Experience)</td><td>4 GB</td></tr>
  <tr><td>Disk</td><td>32 GB</td><td>40–60 GB</td></tr>
</table>

<h2>Ish tartibi</h2>
<h3>1-qism. Virtual mashina</h3>
<ol>
  <li>VirtualBox → New: nomi <code>SRV1</code>, ISO ni tanlang, tur Windows 2022 (64-bit), RAM 4096 MB, 2 CPU, disk 50 GB.</li>
  <li>Tarmoq adapteri: <b>Internal Network</b> (nomi <code>kafedra</code>) — keyingi ishlarda mijoz VM shu tarmoqqa ulanadi. Internet kerak bo'lsa, ikkinchi adapterni NAT qilib qo'shing.</li>
</ol>
<h3>2-qism. O'rnatish</h3>
<ol>
  <li>Til va klaviaturani tanlang → Install now.</li>
  <li>Nashr: <b>Windows Server 2022 Standard Evaluation (Desktop Experience)</b>.</li>
  <li>Custom: Install Windows only → diskni tanlang.</li>
  <li>Administrator paroli: murakkab (masalan, harflar, raqamlar, belgi, ≥ 8 belgi).</li>
</ol>
<h3>3-qism. Boshlang'ich sozlash</h3>
<ol>
  <li><b>Server Manager → Local Server</b> oynasida holatni ko'ring.</li>
  <li>Kompyuter nomi: <code>SRV1</code> (Computer name → Change), qayta yuklash.</li>
  <li>Statik IP (Internal adapter): 192.168.10.10/24, shlyuz 192.168.10.1, DNS 127.0.0.1 (keyingi ishda shu serverda DNS bo'ladi).</li>
  <li>Vaqt mintaqasi: (UTC+05:00) Tashkent.</li>
  <li><b>Remote Desktop</b> ni yoqing.</li>
  <li>PowerShell da tekshiring: <code>Get-ComputerInfo -Property CsName, OsName</code>, <code>Get-NetIPConfiguration</code>, <code>hostname</code>.</li>
  <li>Xuddi shu sozlamalarni Server Core da qilish uchun <code>sconfig</code> menyusi ishlatiladi — u bilan tanishib chiqing (ixtiyoriy).</li>
</ol>

<h2>Hisobot talablari</h2>
<ul>
  <li>VM sozlamalari oynasi.</li>
  <li>Server Manager → Local Server (nom, IP, vaqt mintaqasi, Remote Desktop ko'rinib tursin).</li>
  <li><code>Get-NetIPConfiguration</code> natijasi.</li>
</ul>
""",
    [
        S_title("Windows Server o'rnatish", "9-laboratoriya ishi", "🪟"),
        S_table("VM sozlamalari", ["Parametr", "Qiymat"], [["RAM", "4 GB"], ["CPU", "2 yadro"], ["Disk", "50 GB"], ["Tarmoq", "Internal Network"]]),
        S_points("O'rnatishdan keyin", [("🏷️", "Nom: SRV1"), ("📍", "Statik IP 192.168.10.10/24"), ("🕔", "Vaqt mintaqasi UTC+5"), ("🖥️", "Remote Desktop yoqish")]),
        S_code("PowerShell", "hostname\nGet-NetIPConfiguration\nRename-Computer -NewName SRV1 -Restart"),
        S_quiz("Desktop Experience uchun minimal RAM?", ["512 MB", "1 GB", "2 GB", "8 GB"], 2, "Server Core — 512 MB."),
        S_compare("Interfeys", ("Desktop Experience", "Server Manager, grafik"), ("Server Core", "sconfig, PowerShell")),
        S_summary("Hisobot", ["VM sozlamalari", "Local Server oynasi", "Get-NetIPConfiguration"]),
    ],
    [
        Q("Windows Server sinov versiyasi necha kun ishlaydi?", ["30", "90", "180", "365"], 2, "Evaluation — 180 kun."),
        Q("Server Core da boshlang'ich sozlash menyusi?", ["msconfig", "sconfig", "ncpa.cpl", "gpedit"], 1, "Server Configuration Tool."),
        Q("Server uchun IP qanday bo'lishi kerak?", ["DHCP dan", "Statik", "APIPA", "Farqi yo'q"], 1, "Mijozlar uni doimiy manzilda topishi kerak."),
        Q("VM larni tashqi tarmoqsiz o'zaro bog'lash uchun VirtualBox tarmoq rejimi?", ["NAT", "Internal Network", "Bridged", "Not attached"], 1, "Faqat VM lar orasida."),
        Q("Kompyuter nomini PowerShell da o'zgartirish?", ["Set-Hostname", "Rename-Computer", "netsh name", "hostname -s"], 1, "Rename-Computer -NewName SRV1 -Restart."),
        Q("Qaysilar boshlang'ich sozlashga kiradi?", ["Kompyuter nomi", "Statik IP", "Vaqt mintaqasi", "Domen kontrolleriga ko'tarish"], [0, 1, 2], "DC ga ko'tarish — keyingi bosqich (rol o'rnatish)."),
    ],
    [
        report_task(
            "9-laboratoriya hisoboti",
            "Windows Server ni virtual mashinada o'rnating va sozlang.",
            [
                "Virtual mashinani yaratdim (4 GB RAM, 2 CPU, 50 GB)",
                "Windows Server 2022 Desktop Experience ni o'rnatdim",
                "Kompyuter nomini SRV1 ga o'zgartirdim",
                "Statik IP 192.168.10.10/24 berdim",
                "Vaqt mintaqasini sozladim va Remote Desktop ni yoqdim",
                "PowerShell da Get-NetIPConfiguration bilan tekshirdim",
            ],
            "O'rnatish qancha vaqt oldi, qanday muammolarga duch keldingiz va qanday hal qildingiz? Nega serverga statik IP berildi?",
            min_images=2, max_images=5, min_chars=120,
        ),
        answer_task(
            "Sozlamalar",
            "Laboratoriya ishidagi qiymatlar.",
            [
                F("Serverning IP manzili", "ip", "192.168.10.10"),
                F("Maska", "ip", "255.255.255.0"),
                F("Desktop Experience uchun minimal RAM, GB", "number", 2),
                F("Server Core boshlang'ich sozlash buyrug'i", "text", "sconfig"),
            ],
        ),
    ],
    coin=15, xp=30, minutes=120,
)

# ======================================================================
# 10-LABORATORIYA
# ======================================================================
L10 = T(
    "kt-l10-server-xizmatlari",
    "10-laboratoriya ishi: Windows Server operatsion tizimida tarmoq xizmatlarini o'rnatish va sozlash (DHCP, DNS, IIS)",
    """
<h2>Ishning maqsadi</h2>
<p>SRV1 serverida DHCP, DNS va IIS rollarini o'rnatish, sozlash va mijoz kompyuterdan tekshirish.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>9-laboratoriyada sozlangan SRV1 (192.168.10.10)</li>
  <li>Mijoz VM (Windows 10/11 yoki boshqa), adapteri shu Internal Network da, IP — avtomatik</li>
</ul>

<h2>Ish tartibi</h2>
<h3>1-qism. Rollarni o'rnatish</h3>
<ol>
  <li>Server Manager → Manage → <b>Add Roles and Features</b> → Role-based → SRV1.</li>
  <li><b>DHCP Server</b>, <b>DNS Server</b>, <b>Web Server (IIS)</b> ni belgilang → Install.</li>
  <li>PowerShell muqobili: <code>Install-WindowsFeature DHCP, DNS, Web-Server -IncludeManagementTools</code>.</li>
</ol>
<h3>2-qism. DHCP</h3>
<ol>
  <li>Tools → DHCP → IPv4 → <b>New Scope</b>: nomi "Kafedra", diapazon 192.168.10.100 – 192.168.10.200, maska /24.</li>
  <li>Istisno (exclusion): 192.168.10.100 – 192.168.10.109 (printerlar uchun).</li>
  <li>Ijara muddati: 8 soat.</li>
  <li>Variantlar: 003 Router = 192.168.10.1, 006 DNS = 192.168.10.10, 015 Domain name = kafedra.local.</li>
  <li>Scope ni faollashtiring (Activate). Domen bo'lsa — serverni avtorizatsiya qilish (Authorize).</li>
  <li>Mijozda: <code>ipconfig /release</code>, <code>ipconfig /renew</code>, <code>ipconfig /all</code> — manzil va DHCP Server qiymatini tekshiring. Serverda Address Leases bo'limida mijozni toping.</li>
  <li><b>Zaxira</b> (reservation): mijoz MAC manzili uchun 192.168.10.150 ni bron qiling, mijozda manzilni yangilang.</li>
</ol>
<h3>3-qism. DNS</h3>
<ol>
  <li>Tools → DNS → Forward Lookup Zones → <b>New Zone</b>: Primary, nomi <code>kafedra.local</code>.</li>
  <li>Yozuvlar: <code>srv1</code> A 192.168.10.10; <code>www</code> CNAME srv1.kafedra.local; <code>printer</code> A 192.168.10.105.</li>
  <li>Reverse Lookup Zones → New Zone → <code>10.168.192.in-addr.arpa</code>; srv1 uchun PTR yozuvi.</li>
  <li>Mijozda: <code>nslookup srv1.kafedra.local</code>, <code>nslookup www.kafedra.local</code>, <code>nslookup 192.168.10.10</code>.</li>
</ol>
<h3>4-qism. IIS</h3>
<ol>
  <li>Serverda <code>C:\\inetpub\\wwwroot\\index.html</code> ni o'zgartiring: "Kafedra serveri — Familiya Ism".</li>
  <li>Mijoz brauzerida <code>http://www.kafedra.local</code> ni oching.</li>
  <li>IIS Manager → Default Web Site → Bindings: port va xost nomini ko'rib chiqing.</li>
</ol>

<h2>Hisobot talablari</h2>
<ul>
  <li>DHCP scope va Address Leases oynasi; mijozdagi <code>ipconfig /all</code>.</li>
  <li>DNS zona yozuvlari va mijozdagi <code>nslookup</code> natijalari.</li>
  <li>Mijoz brauzerida ochilgan sahifa.</li>
</ul>
""",
    [
        S_title("DHCP, DNS va IIS", "10-laboratoriya ishi", "🛠️"),
        S_code("Rollar", "Install-WindowsFeature DHCP, DNS, Web-Server -IncludeManagementTools"),
        S_table("DHCP scope", ["Parametr", "Qiymat"], [["Diapazon", "192.168.10.100 – .200"], ["Istisno", ".100 – .109"], ["003 Router", "192.168.10.1"], ["006 DNS", "192.168.10.10"], ["Ijara", "8 soat"]]),
        S_table("DNS yozuvlari", ["Nom", "Tur", "Qiymat"], [["srv1", "A", "192.168.10.10"], ["www", "CNAME", "srv1.kafedra.local"], ["printer", "A", "192.168.10.105"]]),
        S_quiz("Scope 100–200, istisno 100–109. Mijozlarga nechta manzil berilishi mumkin?", ["101", "91", "100", "90"], 1, "101 − 10 = 91."),
        S_code("Mijozda tekshirish", "ipconfig /release\nipconfig /renew\nnslookup www.kafedra.local\nnslookup 192.168.10.10"),
        S_summary("Hisobot", ["DHCP: scope va leases", "DNS: zona va nslookup", "IIS: sahifa mijozda ochildi"]),
    ],
    [
        Q("DHCP da shlyuz qaysi variant raqami bilan beriladi?", ["003", "006", "015", "044"], 0, "006 — DNS, 015 — domen nomi."),
        Q("Ma'lum MAC ga doimiy manzil berish?", ["Exclusion", "Reservation", "Scope", "Lease"], 1, "Zaxira (bron)."),
        Q("www → srv1 qanday yozuv?", ["A", "CNAME", "PTR", "MX"], 1, "Taxallus."),
        Q("192.168.10.0/24 uchun teskari zona nomi?", ["192.168.10.in-addr.arpa", "10.168.192.in-addr.arpa", "10.168.192.arpa", "in-addr.192.168.10"], 1, "Oktetlar teskari."),
        Q("IIS sukut sayt papkasi?", ["C:\\Windows\\Web", "C:\\inetpub\\wwwroot", "C:\\IIS\\site", "C:\\www"], 1, "Default Web Site."),
        Q("Mijoz DHCP dan manzil ololmayapti. Nimalarni tekshirish kerak?", ["Scope faollashtirilganmi", "Mijoz va server bir tarmoqdami (Internal Network)", "IIS ishlayaptimi", "Domen bo'lsa — server avtorizatsiyalanganmi"], [0, 1, 3], "IIS DHCP ga ta'sir qilmaydi."),
    ],
    [
        report_task(
            "10-laboratoriya hisoboti",
            "Uch xizmatni o'rnating, sozlang va mijozdan tekshiring.",
            [
                "DHCP, DNS va IIS rollarini o'rnatdim",
                "DHCP scope, istisno, variantlar va ijara muddatini sozladim",
                "Mijoz manzil olganini ipconfig /all bilan tekshirdim",
                "Mijoz uchun zaxira (reservation) qildim",
                "kafedra.local zonasi va A, CNAME, PTR yozuvlarini yaratdim",
                "Mijozda nslookup bilan tekshirdim",
                "IIS sahifasini o'zgartirib, mijoz brauzerida ochdim",
            ],
            "Mijoz qanday manzil oldi va qaysi DHCP serverdan? nslookup natijalarini izohlang. Qaysi bosqichda muammo bo'ldi va qanday hal qildingiz?",
            min_images=3, max_images=6, min_chars=150,
        ),
        answer_task(
            "DHCP hisobi",
            "Scope: 192.168.10.100 – 192.168.10.200, istisno 192.168.10.100 – 192.168.10.109, ijara 8 soat.",
            [
                F("Diapazondagi manzillar soni", "number", 101),
                F("Mijozlarga beriladigan manzillar soni", "number", 91),
                F("Birinchi beriladigan manzil", "ip", "192.168.10.110"),
                F("Mijoz necha soatdan keyin ijarani uzaytirishni so'raydi?", "number", 4),
            ],
            hints=["200 − 100 + 1.", "T1 = ijaraning yarmi."],
        ),
    ],
    coin=15, xp=30, minutes=120,
)

TOPICS = [L06, L07, L08, L09, L10]
