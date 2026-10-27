-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: Ma'ruzalar 11–15
--
-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
-- Manba: scripts/kontent/kompyuter-tarmoqlari/m11_15.py
-- Qayta yaratish: py scripts/kontent/kompyuter-tarmoqlari/build.py
--
-- Har mavzuda: dars matni, taqdimot (slides), test va topshiriqlar.
-- Virtual simulyatsiya kodda: src/components/labs/net/registry.tsx
--
-- Avval 78_kompyuter_tarmoqlari_infra.sql ishga tushirilgan bo'lishi
-- kerak. Qayta ishga tushirish xavfsiz: test va topshiriq ID lari
-- doimiy, yozuvlar yangilanadi, talabalar javoblari saqlanadi.
-- ============================================================

DO $mig$
DECLARE
  v_course UUID;
  t UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'kompyuter-tarmoqlari-maruza';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: kompyuter-tarmoqlari-maruza. Avval 78_kompyuter_tarmoqlari_infra.sql ni ishga tushiring.';
  END IF;

  -- ============================================================
  -- 11. 11-ma'ruza: Internet tarmog'i va DNS xizmati
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$11-ma'ruza: Internet tarmog'i va DNS xizmati$kt$, 'kt-m11-internet-dns',
$kt$<h2>Ma'ruza rejasi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Internet va DNS", "subtitle": "Tarmoqlar tarmog'i va nomlar tizimi", "emoji": "🌐"}, {"t": "points", "title": "Internet tuzilishi", "items": [{"e": "🏢", "text": "Avtonom tizimlar (AS), BGP"}, {"e": "📶", "text": "Provayderlar ierarxiyasi"}, {"e": "🔀", "text": "Trafik almashuv nuqtalari (IXP)"}, {"e": "🌊", "text": "Suv osti optik kabellari"}]}, {"t": "code", "title": "DNS ierarxiyasi", "code": ".  (ildiz)\n└── uz          ← TLD\n    └── miracademy   ← ikkinchi daraja\n        └── www      ← xost"}, {"t": "compare", "title": "So'rov turlari", "left": {"label": "Rekursiv", "text": "Kompyuter → lokal DNS: 'yakuniy javob ber'"}, "right": {"label": "Iterativ", "text": "Lokal DNS → ildiz → TLD → avtoritar: 'kimdan so'rash kerak?'"}}, {"t": "table", "title": "Yozuv turlari", "head": ["Tur", "Vazifa"], "rows": [["A / AAAA", "Nom → IPv4 / IPv6"], ["CNAME", "Taxallus"], ["MX", "Pochta serveri"], ["NS", "Zona serverlari"], ["PTR", "IP → nom"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "gmail.com ga xat yuborish uchun server qaysi yozuvni so'raydi?", "options": ["A", "MX", "CNAME", "PTR"], "answer": 1, "explain": "MX — domenning pochta serveri."}, {"t": "idea", "title": "Keshlash va TTL", "text": "Har javob TTL muddatigacha keshlanadi. Shuning uchun DNS yozuvini o'zgartirgach, yangi qiymat hamma joyda darhol emas, TTL tugagach ko'rinadi.", "emoji": "⏳"}, {"t": "code", "title": "Tekshirish", "code": "nslookup miracademy.uz\nnslookup -type=mx gmail.com\nipconfig /flushdns"}, {"t": "quiz", "title": "Tekshiramiz", "question": "192.168.1.0/24 ning teskari zonasi?", "options": ["192.168.1.in-addr.arpa", "1.168.192.in-addr.arpa", "192.168.1.0.in-addr", "0.1.168.192.arpa"], "answer": 1, "explain": "Oktetlar teskari tartibda + in-addr.arpa."}, {"t": "summary", "title": "Xulosa", "items": ["Internet — BGP orqali bog'langan avtonom tizimlar", "DNS — taqsimlangan ierarxik baza", "Rekursiv + iterativ aniqlash, TTL bo'yicha kesh", "A, AAAA, CNAME, MX, NS, PTR"]}]$j$::jsonb,
  11, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('d1b56808-010d-581c-9f29-539ae5a1ffc9', '1412afbf-3b0c-5317-aae2-cef61e810e53', '3088bb7c-a0e7-5590-b1c7-117ebe9d4609', 'f2047820-c8b2-59a5-9292-6d75557bab80', 'af5bbdc9-1521-5159-ab88-b7036d3fca94', '4f639777-fc4c-5513-9f9c-b03fe46467de', 'd79b9969-023f-5d7f-b81b-af5d54e321ee');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('d1b56808-010d-581c-9f29-539ae5a1ffc9', t, $kt$DNS asosan qaysi protokol va portda ishlaydi?$kt$, 'single',
   $j$[{"id": "a", "text": "UDP 53", "is_correct": true}, {"id": "b", "text": "TCP 80", "is_correct": false}, {"id": "c", "text": "TCP 25", "is_correct": false}, {"id": "d", "text": "UDP 67", "is_correct": false}]$j$::jsonb,
   $kt$Zonani ko'chirish va katta javoblar — TCP 53.$kt$, 1, 0),
  ('1412afbf-3b0c-5317-aae2-cef61e810e53', t, $kt$Nom → IPv4 manzilni qaysi yozuv beradi?$kt$, 'single',
   $j$[{"id": "a", "text": "MX", "is_correct": false}, {"id": "b", "text": "AAAA", "is_correct": false}, {"id": "c", "text": "PTR", "is_correct": false}, {"id": "d", "text": "A", "is_correct": true}]$j$::jsonb,
   $kt$AAAA — IPv6, PTR — teskari.$kt$, 1, 1),
  ('3088bb7c-a0e7-5590-b1c7-117ebe9d4609', t, $kt$.uz qanday domen?$kt$, 'single',
   $j$[{"id": "a", "text": "Umumiy TLD (gTLD)", "is_correct": false}, {"id": "b", "text": "Mamlakat TLD (ccTLD)", "is_correct": true}, {"id": "c", "text": "Ikkinchi darajali", "is_correct": false}, {"id": "d", "text": "Ildiz", "is_correct": false}]$j$::jsonb,
   $kt$Mamlakat kodli yuqori darajali domen.$kt$, 1, 2),
  ('f2047820-c8b2-59a5-9292-6d75557bab80', t, $kt$Kompyuter lokal DNS serverga qanday so'rov yuboradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Rekursiv", "is_correct": true}, {"id": "b", "text": "Iterativ", "is_correct": false}, {"id": "c", "text": "Zona ko'chirish", "is_correct": false}, {"id": "d", "text": "Teskari", "is_correct": false}]$j$::jsonb,
   $kt$Kompyuter yakuniy javobni kutadi; lokal server esa boshqalardan iterativ so'raydi.$kt$, 1, 3),
  ('af5bbdc9-1521-5159-ab88-b7036d3fca94', t, $kt$Avtonom tizimlar orasida marshrut almashish protokoli?$kt$, 'single',
   $j$[{"id": "a", "text": "OSPF", "is_correct": false}, {"id": "b", "text": "RIP", "is_correct": false}, {"id": "c", "text": "DNS", "is_correct": false}, {"id": "d", "text": "BGP", "is_correct": true}]$j$::jsonb,
   $kt$BGP — Internetning "yelim" protokoli.$kt$, 1, 4),
  ('4f639777-fc4c-5513-9f9c-b03fe46467de', t, $kt$IP bloklarni Yevropa va Markaziy Osiyoda qaysi registrator taqsimlaydi?$kt$, 'single',
   $j$[{"id": "a", "text": "RIPE NCC", "is_correct": true}, {"id": "b", "text": "LACNIC", "is_correct": false}, {"id": "c", "text": "ARIN", "is_correct": false}, {"id": "d", "text": "APNIC", "is_correct": false}]$j$::jsonb,
   $kt$O'zbekiston RIPE NCC xizmat hududida.$kt$, 1, 5),
  ('d79b9969-023f-5d7f-b81b-af5d54e321ee', t, $kt$Qaysi yozuvlar to'g'ri tavsiflangan?$kt$, 'multiple',
   $j$[{"id": "a", "text": "NS — zona uchun mas'ul serverlar", "is_correct": true}, {"id": "b", "text": "CNAME — taxallus", "is_correct": true}, {"id": "c", "text": "MX — IPv6 manzil", "is_correct": false}, {"id": "d", "text": "PTR — teskari aniqlash", "is_correct": true}]$j$::jsonb,
   $kt$IPv6 — AAAA.$kt$, 2, 6)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('19539133-cd6d-5fe6-b92a-2bcece6fca0b', 'eca4c6c6-e11a-517b-9473-4960d8451cad');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('19539133-cd6d-5fe6-b92a-2bcece6fca0b', t, $kt$Yozuv turini tanlang$kt$, $kt$Har vazifa uchun kerakli DNS yozuv turini tanlang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "misol.uz saytining IPv4 manzili", "type": "choice", "accept": ["A"], "options": ["A", "AAAA", "CNAME", "MX", "PTR", "NS"]}, {"label": "www.misol.uz ni misol.uz ga taxallus qilish", "type": "choice", "accept": ["CNAME"], "options": ["A", "AAAA", "CNAME", "MX", "PTR", "NS"]}, {"label": "misol.uz uchun pochta serveri", "type": "choice", "accept": ["MX"], "options": ["A", "AAAA", "CNAME", "MX", "PTR", "NS"]}, {"label": "192.168.1.10 qaysi nomga tegishli", "type": "choice", "accept": ["PTR"], "options": ["A", "AAAA", "CNAME", "MX", "PTR", "NS"]}]}$j$::jsonb, NULL),
  ('eca4c6c6-e11a-517b-9473-4960d8451cad', t, $kt$Domen nomi$kt$, $kt$To'liq nom: lab3.kafedra.buxdu.uz$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Teskari zona: uchta oktetni teskari tartibda yozing va .in-addr.arpa qo'shing."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Yuqori darajali domen (TLD)", "type": "text", "accept": ["uz", ".uz"]}, {"label": "Ikkinchi darajali domen", "type": "text", "accept": ["buxdu.uz", "buxdu"]}, {"label": "10.20.30.0/24 tarmog'ining teskari zonasi nomi", "type": "text", "accept": ["30.20.10.in-addr.arpa"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 12. 12-ma'ruza: Server operatsion tizimlar va ishchi guruhlar. Domenli tizimlar
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$12-ma'ruza: Server operatsion tizimlar va ishchi guruhlar. Domenli tizimlar$kt$, 'kt-m12-server-ot',
$kt$<h2>Ma'ruza rejasi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Server OT va domenlar", "subtitle": "Ishchi guruhdan Active Directory gacha", "emoji": "🖥️"}, {"t": "points", "title": "Server OT", "items": [{"e": "👥", "text": "Ko'p foydalanuvchi va ulanish"}, {"e": "🧰", "text": "Tarmoq xizmatlari (rollar)"}, {"e": "🛡️", "text": "Markaziy xavfsizlik"}, {"e": "💽", "text": "RAID, klaster, zaxira"}]}, {"t": "table", "title": "Server OT oilalari", "head": ["Oila", "Misol"], "rows": [["Windows Server", "2019, 2022, 2025"], ["Linux", "Ubuntu Server, RHEL, Debian"], ["Unix", "FreeBSD"]]}, {"t": "compare", "title": "O'rnatish turlari", "left": {"label": "Desktop Experience", "text": "Grafik interfeys, o'rganish oson"}, "right": {"label": "Server Core", "text": "Grafikasiz: kam resurs, kam hujum yuzasi"}}, {"t": "compare", "title": "Ishchi guruh va domen", "left": {"label": "Ishchi guruh", "text": "Hisoblar har kompyuterda. 10–20 kompyutergacha"}, "right": {"label": "Domen", "text": "Hisoblar DC da. Bitta login hamma joyda, GPO"}}, {"t": "quiz", "title": "Tekshiramiz", "question": "8 kompyuter va 15 foydalanuvchi, ishchi guruh. Eng yomon holda nechta hisob kerak?", "options": ["15", "120", "23", "8"], "answer": 1, "explain": "8 × 15 = 120. Domenda esa 15 ta."}, {"t": "points", "title": "Active Directory", "items": [{"e": "🏛️", "text": "Domen kontrolleri (DC)"}, {"e": "🔑", "text": "Kerberos autentifikatsiyasi"}, {"e": "📁", "text": "OU — tashkiliy bo'linmalar"}, {"e": "📜", "text": "GPO — guruh siyosatlari"}, {"e": "🌳", "text": "Daraxt va o'rmon"}]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Nega DC ga statik IP beriladi?", "options": ["DHCP uni taqiqlaydi", "Mijozlar uni doim bir manzilda topishi kerak", "Tezroq ishlaydi", "Litsenziya talab qiladi"], "answer": 1, "explain": "DNS, DHCP va DC manzili o'zgarsa, mijozlar ularni yo'qotadi."}, {"t": "summary", "title": "Xulosa", "items": ["Server OT — ko'p foydalanuvchili, xizmatlarga yo'naltirilgan", "Rollar: AD DS, DNS, DHCP, File, IIS", "Ishchi guruh — kichik ofis uchun", "Domen — markazlashgan boshqaruv"]}]$j$::jsonb,
  12, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('2a5dff28-dbf0-5676-8450-5573e95985dc', '7ef2354a-e131-50e7-9316-0e74e3833654', '9b6fdb57-9c8f-5fd0-8831-6836f20b2ad6', '550c74d5-67ed-5132-8a1a-2acb8170b8e4', '751dfd8f-e1d2-582d-8be6-096d85fcf9cc', '344a13b2-78ea-5469-bd8c-8d656575b301');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('2a5dff28-dbf0-5676-8450-5573e95985dc', t, $kt$Ishchi guruhda foydalanuvchi hisoblari qayerda saqlanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Domen kontrollerida", "is_correct": false}, {"id": "b", "text": "Routerda", "is_correct": false}, {"id": "c", "text": "DNS serverda", "is_correct": false}, {"id": "d", "text": "Har bir kompyuterning lokal bazasida", "is_correct": true}]$j$::jsonb,
   $kt$Lokal hisoblar bazasi — SAM.$kt$, 1, 0),
  ('7ef2354a-e131-50e7-9316-0e74e3833654', t, $kt$Active Directory da autentifikatsiya qaysi protokol bilan bajariladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Kerberos", "is_correct": true}, {"id": "b", "text": "FTP", "is_correct": false}, {"id": "c", "text": "HTTP", "is_correct": false}, {"id": "d", "text": "SNMP", "is_correct": false}]$j$::jsonb,
   $kt$Kerberos — chiptalar (ticket) asosidagi autentifikatsiya.$kt$, 1, 1),
  ('9b6fdb57-9c8f-5fd0-8831-6836f20b2ad6', t, $kt$Ko'plab kompyuterga bir vaqtda sozlamani qo'llash vositasi?$kt$, 'single',
   $j$[{"id": "a", "text": "SAM", "is_correct": false}, {"id": "b", "text": "GPO", "is_correct": true}, {"id": "c", "text": "OU", "is_correct": false}, {"id": "d", "text": "DHCP", "is_correct": false}]$j$::jsonb,
   $kt$Group Policy Object.$kt$, 1, 2),
  ('550c74d5-67ed-5132-8a1a-2acb8170b8e4', t, $kt$Grafik interfeyssiz Windows Server o'rnatish turi?$kt$, 'single',
   $j$[{"id": "a", "text": "Datacenter", "is_correct": false}, {"id": "b", "text": "Desktop Experience", "is_correct": false}, {"id": "c", "text": "Server Core", "is_correct": true}, {"id": "d", "text": "Essentials", "is_correct": false}]$j$::jsonb,
   $kt$Server Core — kam resurs va kam hujum yuzasi.$kt$, 1, 3),
  ('751dfd8f-e1d2-582d-8be6-096d85fcf9cc', t, $kt$Domen haqida qaysi gaplar to'g'ri?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Siyosatlar markazdan qo'llanadi", "is_correct": true}, {"id": "b", "text": "Foydalanuvchi bitta login bilan istalgan kompyuterga kiradi", "is_correct": true}, {"id": "c", "text": "Kamida bitta domen kontrolleri kerak", "is_correct": true}, {"id": "d", "text": "Server talab qilinmaydi", "is_correct": false}]$j$::jsonb,
   $kt$Domen DC — ya'ni serversiz bo'lmaydi.$kt$, 2, 4),
  ('344a13b2-78ea-5469-bd8c-8d656575b301', t, $kt$Ishonchlilik uchun domenda nechta DC tavsiya etiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Kamida ikkita", "is_correct": true}, {"id": "b", "text": "Bitta", "is_correct": false}, {"id": "c", "text": "DC kerak emas", "is_correct": false}, {"id": "d", "text": "Har kompyuterda bittadan", "is_correct": false}]$j$::jsonb,
   $kt$Biri ishdan chiqsa, ikkinchisi xizmat qiladi; baza replikatsiya qilinadi.$kt$, 1, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('3b252318-d355-5786-8a72-66ab8ea99b02', '52e838be-e54b-5f99-bd50-b7f0f241192d');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('3b252318-d355-5786-8a72-66ab8ea99b02', t, $kt$Hisoblar soni$kt$, $kt$Ofisda 6 ta kompyuter va 12 ta xodim bor. Har bir xodim istalgan kompyuterda ishlashi kerak.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Ishchi guruh: kompyuterlar × foydalanuvchilar."}, {"order": 2, "text": "Virtual simulyatsiyada aynan shu qiymatlarni qo'yib tekshiring."}]$j$::jsonb, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Ishchi guruhda nechta lokal hisob yaratiladi?", "type": "number", "accept": ["72"]}, {"label": "Domenda nechta foydalanuvchi hisobi yaratiladi?", "type": "number", "accept": ["12"]}, {"label": "Bitta xodim parolini o'zgartirishda ishchi guruhda necha joyda o'zgartirish kerak?", "type": "number", "accept": ["6"]}]}$j$::jsonb, NULL),
  ('52e838be-e54b-5f99-bd50-b7f0f241192d', t, $kt$Modelni tanlang$kt$, $kt$Har bir tashkilot uchun mos modelni tanlang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Oilaviy biznes: 4 ta kompyuter, server yo'q", "type": "choice", "accept": ["Ishchi guruh"], "options": ["Ishchi guruh", "Domen"]}, {"label": "Universitet: 600 ta kompyuter, 8 ta kompyuter sinfi", "type": "choice", "accept": ["Domen"], "options": ["Ishchi guruh", "Domen"]}, {"label": "Bank filiali: qat'iy parol siyosati talab qilinadi", "type": "choice", "accept": ["Domen"], "options": ["Ishchi guruh", "Domen"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 13. 13-ma'ruza: Tarmoq resurslarini boshqarish. Umumiy resurslar. Foydalanuvchilar vakolatlari
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$13-ma'ruza: Tarmoq resurslarini boshqarish. Umumiy resurslar. Foydalanuvchilar vakolatlari$kt$, 'kt-m13-resurslar',
$kt$<h2>Ma'ruza rejasi</h2>
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
<p>Tarmoqdan kirish <b>UNC yo'li</b> orqali: <code>\\SERVER\Hujjatlar</code>. Disk sifatida ulash: <code>net use H: \\SERVER\Hujjatlar</code>. Kompyuterdagi barcha ulashishlar: <code>net share</code>.</p>

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
</ol>$kt$,
  $j$[{"t": "title", "title": "Tarmoq resurslarini boshqarish", "subtitle": "Foydalanuvchilar, ulashish, ruxsatlar", "emoji": "🗂️"}, {"t": "idea", "title": "Eng kam imtiyoz", "text": "Har kimga ishi uchun zarur bo'lgan eng kam huquq. Ruxsatlar foydalanuvchiga emas, guruhga beriladi.", "emoji": "🔐"}, {"t": "compare", "title": "Huquq va ruxsat", "left": {"label": "Huquq", "text": "Tizim amali: tizimga kirish, vaqtni o'zgartirish"}, "right": {"label": "Ruxsat", "text": "Obyektga kirish: papkani o'qish, faylni o'chirish"}}, {"t": "code", "title": "Buyruqlar", "code": "net user ali Parol123! /add\nnet localgroup Talabalar ali /add\nnet share\nnet use H: \\\\SERVER\\Hujjatlar"}, {"t": "table", "title": "Ruxsat turlari", "head": ["Share", "NTFS"], "rows": [["Full Control", "Full control"], ["Change", "Modify"], ["Read", "Read & execute, Read"], ["—", "Write, List folder"]]}, {"t": "points", "title": "Samarali ruxsat", "items": [{"e": "➕", "text": "Guruhlar ruxsatlari yig'iladi"}, {"e": "⛔", "text": "Deny har doim ustun"}, {"e": "🌐", "text": "Tarmoqda: NTFS ∩ Share — eng cheklangani"}, {"e": "💻", "text": "Kompyuterning o'zida — faqat NTFS"}]}, {"t": "quiz", "title": "Tekshiramiz", "question": "NTFS: Modify, Share: Read. Tarmoqdan nima qilish mumkin?", "options": ["O'zgartirish", "Hech narsa", "Faqat o'qish", "To'liq boshqarish"], "answer": 2, "explain": "Tarmoqda ikkalasidan qattiqrog'i — Read."}, {"t": "quiz", "title": "Tekshiramiz", "question": "Ali 'Talabalar' (Modify) va 'Mehmonlar' (Deny Write) guruhida. Yoza oladimi?", "options": ["Yo'q", "Ha", "Faqat tarmoqdan", "Faqat lokal"], "answer": 0, "explain": "Deny har qanday Allow dan ustun."}, {"t": "summary", "title": "Xulosa", "items": ["Guruhlarga ruxsat bering", "Share — faqat tarmoqda, NTFS — hamma joyda", "Samarali = yig'indi − deny, tarmoqda eng cheklangani", "Amaliyot: Share keng, NTFS aniq"]}]$j$::jsonb,
  13, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('82a5d297-0e8a-5bfc-ad45-8ca9228731a7', 'd8b29c3e-ed4e-56a3-98da-e1b10e31d770', '70b14f6a-f9e8-54f1-8ee6-79973b416cb4', '6723a5aa-6089-5565-acbd-d6439d41b22c', '80c46fbb-419b-54a6-a688-3bb749a7af5f', 'f8d1ae5d-5df9-55e9-946c-f63c27362f6f');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('82a5d297-0e8a-5bfc-ad45-8ca9228731a7', t, $kt$Qaysi ruxsatlar kompyuterning o'zida (lokal) ham ishlaydi?$kt$, 'single',
   $j$[{"id": "a", "text": "Share", "is_correct": false}, {"id": "b", "text": "Ikkalasi ham", "is_correct": false}, {"id": "c", "text": "Hech biri", "is_correct": false}, {"id": "d", "text": "NTFS", "is_correct": true}]$j$::jsonb,
   $kt$Share ruxsati faqat tarmoqdan kirishda tekshiriladi.$kt$, 1, 0),
  ('d8b29c3e-ed4e-56a3-98da-e1b10e31d770', t, $kt$Ulashish nomi oxiridagi $ belgisi nimani bildiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Pullik papka", "is_correct": false}, {"id": "b", "text": "Faqat administratorlar uchun", "is_correct": false}, {"id": "c", "text": "Yashirin ulashish", "is_correct": true}, {"id": "d", "text": "Shifrlangan", "is_correct": false}]$j$::jsonb,
   $kt$Papka tarmoq ro'yxatida ko'rinmaydi, lekin nomi ma'lum bo'lsa ochiladi.$kt$, 1, 1),
  ('70b14f6a-f9e8-54f1-8ee6-79973b416cb4', t, $kt$Allow va Deny ziddiyatida qaysi biri g'olib?$kt$, 'single',
   $j$[{"id": "a", "text": "Guruh soni ko'pi", "is_correct": false}, {"id": "b", "text": "Allow", "is_correct": false}, {"id": "c", "text": "Oxirgi berilgani", "is_correct": false}, {"id": "d", "text": "Deny", "is_correct": true}]$j$::jsonb,
   $kt$Aniq taqiq ruxsatdan ustun.$kt$, 1, 2),
  ('6723a5aa-6089-5565-acbd-d6439d41b22c', t, $kt$NTFS — Read, Share — Full Control. Tarmoqdan samarali ruxsat?$kt$, 'single',
   $j$[{"id": "a", "text": "Read", "is_correct": true}, {"id": "b", "text": "Change", "is_correct": false}, {"id": "c", "text": "Hech qanday", "is_correct": false}, {"id": "d", "text": "Full Control", "is_correct": false}]$j$::jsonb,
   $kt$Eng cheklangani — Read.$kt$, 1, 3),
  ('80c46fbb-419b-54a6-a688-3bb749a7af5f', t, $kt$Papkaga tarmoqdan kirish uchun to'g'ri UNC yo'l?$kt$, 'single',
   $j$[{"id": "a", "text": "//SERVER:Hujjatlar", "is_correct": false}, {"id": "b", "text": "http://SERVER/Hujjatlar", "is_correct": false}, {"id": "c", "text": "C:\\SERVER\\Hujjatlar", "is_correct": false}, {"id": "d", "text": "\\\\SERVER\\Hujjatlar", "is_correct": true}]$j$::jsonb,
   $kt$UNC: \\kompyuter\ulashish.$kt$, 1, 4),
  ('f8d1ae5d-5df9-55e9-946c-f63c27362f6f', t, $kt$Qaysi gaplar to'g'ri?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Share ruxsati lokal kirishni cheklaydi", "is_correct": false}, {"id": "b", "text": "Foydalanuvchi guruhlari ruxsatlarining yig'indisini oladi", "is_correct": true}, {"id": "c", "text": "Ruxsatlarni guruhlarga berish tavsiya etiladi", "is_correct": true}, {"id": "d", "text": "NTFS ruxsatlari ichki papkalarga meros bo'lib o'tadi", "is_correct": true}]$j$::jsonb,
   $kt$Share — faqat tarmoqda.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('c68ffd02-7c75-5324-baf4-67aca71abe2b', '9f6a1395-982a-5fd6-9bfc-5989c8b76c17');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('c68ffd02-7c75-5324-baf4-67aca71abe2b', t, $kt$Samarali ruxsatni toping$kt$, $kt$Papka: \\SERVER\Kurs. Foydalanuvchi Vali 'O'qituvchilar' va 'Everyone' guruhlarida.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Tarmoqda — NTFS va Share ning kesishmasi."}, {"order": 2, "text": "Deny Read bo'lsa, o'qib bo'lmaydi; o'qib bo'lmagan faylni o'zgartirib ham bo'lmaydi."}]$j$::jsonb, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "NTFS: O'qituvchilar — Modify; Share: Everyone — Read. Tarmoqdan samarali ruxsat", "type": "choice", "accept": ["Read"], "options": ["Full control", "Modify", "Read", "Hech qanday"]}, {"label": "Xuddi shu holat, lekin Vali serverda lokal ishlaydi", "type": "choice", "accept": ["Modify"], "options": ["Full control", "Modify", "Read", "Hech qanday"]}, {"label": "NTFS: O'qituvchilar — Modify, Everyone — Deny Read; Share: Everyone — Full. Tarmoqdan", "type": "choice", "accept": ["Hech qanday"], "options": ["Full control", "Modify", "Read", "Hech qanday"]}]}$j$::jsonb, NULL),
  ('9f6a1395-982a-5fd6-9bfc-5989c8b76c17', t, $kt$Buyruqlar$kt$, $kt$To'g'ri buyruq yoki yo'lni yozing.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "SERVER1 dagi 'Hisobot' ulashishining UNC yo'li", "type": "text", "accept": ["\\\\SERVER1\\Hisobot"]}, {"label": "Kompyuterdagi barcha ulashishlarni ko'rsatuvchi buyruq", "type": "text", "accept": ["net share"]}, {"label": "Yashirin 'Arxiv' ulashishining nomi", "type": "text", "accept": ["Arxiv$"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 14. 14-ma'ruza: Tarmoqlarda xavfsizlik muammolari. Himoya usullari: Firewall, VPN, IDS
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$14-ma'ruza: Tarmoqlarda xavfsizlik muammolari. Himoya usullari: Firewall, VPN, IDS$kt$, 'kt-m14-xavfsizlik',
$kt$<h2>Ma'ruza rejasi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Tarmoq xavfsizligi", "subtitle": "Tahdidlar va himoya: Firewall, VPN, IDS", "emoji": "🛡️"}, {"t": "points", "title": "CIA uchligi", "items": [{"e": "🔒", "text": "Konfidensiallik — shifrlash"}, {"e": "✅", "text": "Yaxlitlik — xesh, imzo"}, {"e": "⚡", "text": "Mavjudlik — zaxira, DDoS himoyasi"}]}, {"t": "table", "title": "Tahdidlar", "head": ["Tahdid", "Mohiyati"], "rows": [["Ransomware", "Fayllarni shifrlab, pul talab qiladi"], ["Fishing", "Qalbaki xat/sayt"], ["DDoS", "Serverni to'ldirib tashlash"], ["MITM", "Trafikni tutib olish"]]}, {"t": "idea", "title": "Firewall qoidasi", "text": "Qoidalar yuqoridan pastga, BIRINCHI mos kelgani qaror qiladi. Oxirida — sukut siyosati: hammasini taqiqla.", "emoji": "🧱"}, {"t": "quiz", "title": "Tekshiramiz", "question": "1-qoida: Deny any. 2-qoida: Allow TCP 443. HTTPS o'tadimi?", "options": ["Yo'q", "Faqat LAN dan", "Ha", "Sukut siyosatiga bog'liq"], "answer": 0, "explain": "1-qoida hammasiga mos keladi va to'sadi — 2-qoidaga navbat kelmaydi."}, {"t": "compare", "title": "VPN turlari", "left": {"label": "Masofaviy kirish", "text": "Bitta xodim → tashkilot tarmog'i"}, "right": {"label": "Sayt-sayt", "text": "Filial routeri ↔ markaz routeri, doimiy tunnel"}}, {"t": "compare", "title": "IDS va IPS", "left": {"label": "IDS", "text": "Aniqlaydi va ogohlantiradi"}, "right": {"label": "IPS", "text": "Trafik yo'lida turib, to'sadi"}}, {"t": "points", "title": "Qo'shimcha choralar", "items": [{"e": "📱", "text": "MFA"}, {"e": "🔄", "text": "Yangilanishlar"}, {"e": "💾", "text": "Zaxira: 3-2-1"}, {"e": "🧩", "text": "Segmentatsiya (VLAN, DMZ)"}, {"e": "🎓", "text": "Foydalanuvchilarni o'qitish"}]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Oddiy foydalanuvchi IDS tomonidan hujumchi deb topildi. Bu qanday xato?", "options": ["Imzo xatosi", "Soxta salbiy", "Soxta ijobiy", "DoS"], "answer": 2, "explain": "False positive — xavfsiz hodisa hujum deb belgilandi."}, {"t": "summary", "title": "Xulosa", "items": ["CIA — himoyaning uch maqsadi", "Firewall: tartib muhim, default deny", "VPN — shifrlangan tunnel", "IDS ogohlantiradi, IPS to'sadi"]}]$j$::jsonb,
  14, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('dcd3f298-e956-51a9-a83c-c9832a1c509a', '23f9a0d2-dbe1-5410-9aa3-2068f130f87b', 'd79dc460-4e95-5fac-85f9-72fefd42173a', '74258038-5a9c-5688-8839-82a4fbd1b7e6', '7bcb6036-4052-5be5-a214-60ebec88fbd0', '5249f07c-7a09-5151-a82c-c2fe3d1f5b2d', 'fb35e3d7-6fbe-5a05-9b33-de4339195fb1');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('dcd3f298-e956-51a9-a83c-c9832a1c509a', t, $kt$Fayllarni shifrlab, to'lov talab qiladigan zararli dastur?$kt$, 'single',
   $j$[{"id": "a", "text": "Sniffer", "is_correct": false}, {"id": "b", "text": "Chuvalchang", "is_correct": false}, {"id": "c", "text": "Ransomware", "is_correct": true}, {"id": "d", "text": "Troyan", "is_correct": false}]$j$::jsonb,
   $kt$To'lov talab qiluvchi dastur (ransomware).$kt$, 1, 0),
  ('23f9a0d2-dbe1-5410-9aa3-2068f130f87b', t, $kt$Brandmauerda hech qaysi qoida mos kelmasa nima bo'ladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Sukut siyosati qo'llanadi", "is_correct": true}, {"id": "b", "text": "Oxirgi qoida qo'llanadi", "is_correct": false}, {"id": "c", "text": "Xato yuz beradi", "is_correct": false}, {"id": "d", "text": "Paket o'tadi", "is_correct": false}]$j$::jsonb,
   $kt$Xavfsiz sukut siyosati — taqiqlash.$kt$, 1, 1),
  ('d79dc460-4e95-5fac-85f9-72fefd42173a', t, $kt$Ichkaridan boshlangan ulanishning javobini avtomatik o'tkazadigan brandmauer turi?$kt$, 'single',
   $j$[{"id": "a", "text": "Holatni kuzatuvchi (stateful)", "is_correct": true}, {"id": "b", "text": "Proxy", "is_correct": false}, {"id": "c", "text": "Paket filtri", "is_correct": false}, {"id": "d", "text": "IDS", "is_correct": false}]$j$::jsonb,
   $kt$U ulanishlar jadvalini yuritadi.$kt$, 1, 2),
  ('74258038-5a9c-5688-8839-82a4fbd1b7e6', t, $kt$Ommaviy veb-serverni qayerga joylashtirish tavsiya etiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "DMZ ga", "is_correct": true}, {"id": "b", "text": "Foydalanuvchi kompyuteriga", "is_correct": false}, {"id": "c", "text": "Routerning ichiga", "is_correct": false}, {"id": "d", "text": "Ichki tarmoqqa", "is_correct": false}]$j$::jsonb,
   $kt$DMZ — Internet va ichki tarmoq orasidagi alohida segment.$kt$, 1, 3),
  ('7bcb6036-4052-5be5-a214-60ebec88fbd0', t, $kt$Hujumni aniqlab qolmay, uni to'sadigan tizim?$kt$, 'single',
   $j$[{"id": "a", "text": "NAT", "is_correct": false}, {"id": "b", "text": "DNS", "is_correct": false}, {"id": "c", "text": "IDS", "is_correct": false}, {"id": "d", "text": "IPS", "is_correct": true}]$j$::jsonb,
   $kt$Intrusion Prevention System.$kt$, 1, 4),
  ('5249f07c-7a09-5151-a82c-c2fe3d1f5b2d', t, $kt$Qaysi VPN protokollari bugun xavfsiz hisoblanadi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "PPTP", "is_correct": false}, {"id": "b", "text": "OpenVPN", "is_correct": true}, {"id": "c", "text": "WireGuard", "is_correct": true}, {"id": "d", "text": "IPsec (IKEv2)", "is_correct": true}]$j$::jsonb,
   $kt$PPTP eskirgan va buzilgan.$kt$, 2, 5),
  ('fb35e3d7-6fbe-5a05-9b33-de4339195fb1', t, $kt$3-2-1 zaxira qoidasida '1' nimani bildiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "1 ta nusxa", "is_correct": false}, {"id": "b", "text": "1 ta nusxa boshqa joyda saqlanadi", "is_correct": true}, {"id": "c", "text": "1 kunda bir marta", "is_correct": false}, {"id": "d", "text": "1 ta tashuvchi", "is_correct": false}]$j$::jsonb,
   $kt$3 nusxa, 2 xil tashuvchi, 1 tasi boshqa joyda.$kt$, 1, 6)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('30dd845d-a9eb-5ef3-8474-f5b71dc946c6', '9f85597f-9ea6-5d0e-a7f5-528b9ac6e86b');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('30dd845d-a9eb-5ef3-8474-f5b71dc946c6', t, $kt$Tahdid va himoya$kt$, $kt$Har bir tahdid uchun eng mos himoya chorasini tanlang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Kafedagi ochiq Wi-Fi da parolni tutib olish", "type": "choice", "accept": ["VPN"], "options": ["VPN", "Zaxira nusxa", "MFA", "IDS"]}, {"label": "Ransomware fayllarni shifrlab qo'ydi", "type": "choice", "accept": ["Zaxira nusxa"], "options": ["VPN", "Zaxira nusxa", "MFA", "IDS"]}, {"label": "Fishing orqali parol o'g'irlandi", "type": "choice", "accept": ["MFA"], "options": ["VPN", "Zaxira nusxa", "MFA", "IDS"]}, {"label": "Serverga ketma-ket portlarni skanerlash", "type": "choice", "accept": ["IDS"], "options": ["VPN", "Zaxira nusxa", "MFA", "IDS"]}]}$j$::jsonb, NULL),
  ('9f85597f-9ea6-5d0e-a7f5-528b9ac6e86b', t, $kt$Qoidalar tartibi$kt$, $kt$Qoidalar: 1) Allow TCP 80,443 any; 2) Allow TCP 22 LAN; 3) Deny any any. Paket qaysi qoida bo'yicha qaror topadi? Qoida raqamini kiriting.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Har paket uchun 1-qoidadan boshlab mos kelganini qidiring."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Internetdan HTTPS (443)", "type": "number", "accept": ["1"]}, {"label": "LAN dan SSH (22)", "type": "number", "accept": ["2"]}, {"label": "Internetdan SSH (22)", "type": "number", "accept": ["3"]}, {"label": "Internetdan RDP (3389)", "type": "number", "accept": ["3"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 15. 15-ma'ruza: Tarmoq muammolarini aniqlash va bartaraf qilish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$15-ma'ruza: Tarmoq muammolarini aniqlash va bartaraf qilish$kt$, 'kt-m15-diagnostika',
$kt$<h2>Ma'ruza rejasi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Nosozliklarni bartaraf qilish", "subtitle": "Tizimli yondashuv va vositalar", "emoji": "🔧"}, {"t": "points", "title": "Metodologiya", "items": [{"e": "1️⃣", "text": "Muammoni aniqlash"}, {"e": "2️⃣", "text": "Faraz"}, {"e": "3️⃣", "text": "Tekshirish"}, {"e": "4️⃣", "text": "Reja"}, {"e": "5️⃣", "text": "Qo'llash"}, {"e": "6️⃣", "text": "Natijani tekshirish"}, {"e": "7️⃣", "text": "Hujjatlashtirish"}]}, {"t": "compare", "title": "Yondashuvlar", "left": {"label": "Pastdan yuqoriga", "text": "Kabel → IP → shlyuz → port → dastur"}, "right": {"label": "Bo'lib tekshirish", "text": "ping 8.8.8.8 dan boshlab, yuqori yoki pastni tanlash"}}, {"t": "code", "title": "Asosiy buyruqlar", "code": "ipconfig /all\nping 192.168.1.1\nping 8.8.8.8\nping google.com\nnslookup google.com\ntracert google.com"}, {"t": "table", "title": "Belgi → sabab", "head": ["Belgi", "Sabab"], "rows": [["Media disconnected", "Kabel"], ["169.254.x.x", "DHCP yo'q"], ["Tashqi unreachable", "Shlyuz"], ["IP ishlaydi, nom yo'q", "DNS"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "ipconfig: 169.254.37.112. Birinchi navbatda nimani tekshirasiz?", "options": ["Veb-saytni", "Brandmauerni", "DNS serverni", "DHCP server/routerni"], "answer": 3, "explain": "APIPA — DHCP dan javob kelmagan."}, {"t": "quiz", "title": "Tekshiramiz", "question": "ping 8.8.8.8 — javob bor, ping google.com — 'could not find host'. Sabab?", "options": ["Maska", "DNS", "Kabel", "Shlyuz"], "answer": 1, "explain": "IP bo'yicha aloqa bor, nom aniqlanmayapti."}, {"t": "idea", "title": "'Destination host unreachable' tuzog'i", "text": "Windows bunday javoblarni 'Received' deb sanaydi — yo'qotish 0% ko'rinadi. Javob qaysi manzildan kelganiga qarang.", "emoji": "⚠️"}, {"t": "summary", "title": "Xulosa", "items": ["Tizimli ishlang: 7 bosqich", "Pastdan yuqoriga — OSI bo'yicha", "ipconfig, ping, tracert, nslookup — asosiy to'rtlik", "Har yechimni hujjatlashtiring"]}]$j$::jsonb,
  15, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('7272aae5-acbc-5157-80c6-f481a2e4a20d', '3eb9cded-6083-5344-b518-e0c666a7daf4', 'fb3c6821-8992-5f32-8cfd-30ab112d88bf', '9ffd9e28-f34e-5c3e-a8ed-fc262bfb9625', '4770da01-1155-513f-ab6d-329078fd7739', '4a68889a-b07a-502a-bde3-edeb10f83493');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('7272aae5-acbc-5157-80c6-f481a2e4a20d', t, $kt$Nosozlikni bartaraf qilishning oxirgi bosqichi?$kt$, 'single',
   $j$[{"id": "a", "text": "Faraz tuzish", "is_correct": false}, {"id": "b", "text": "Yechimni qo'llash", "is_correct": false}, {"id": "c", "text": "Hujjatlashtirish", "is_correct": true}, {"id": "d", "text": "Natijani tekshirish", "is_correct": false}]$j$::jsonb,
   $kt$Keyingi safar shu muammo tezroq hal bo'ladi.$kt$, 1, 0),
  ('3eb9cded-6083-5344-b518-e0c666a7daf4', t, $kt$ipconfig 'Media disconnected' ko'rsatdi. Muammo qaysi pog'onada?$kt$, 'single',
   $j$[{"id": "a", "text": "Amaliy", "is_correct": false}, {"id": "b", "text": "Transport", "is_correct": false}, {"id": "c", "text": "Fizik", "is_correct": true}, {"id": "d", "text": "Tarmoq", "is_correct": false}]$j$::jsonb,
   $kt$Kabel yoki adapter — 1-pog'ona.$kt$, 1, 1),
  ('fb3c6821-8992-5f32-8cfd-30ab112d88bf', t, $kt$DNS ishlayotganini qaysi buyruq bevosita tekshiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "netstat", "is_correct": false}, {"id": "b", "text": "nslookup", "is_correct": true}, {"id": "c", "text": "route print", "is_correct": false}, {"id": "d", "text": "arp -a", "is_correct": false}]$j$::jsonb,
   $kt$nslookup DNS serverga so'rov yuboradi.$kt$, 1, 2),
  ('9ffd9e28-f34e-5c3e-a8ed-fc262bfb9625', t, $kt$Paket qaysi marshrutizatorda to'xtayotganini qaysi buyruq ko'rsatadi?$kt$, 'single',
   $j$[{"id": "a", "text": "ping", "is_correct": false}, {"id": "b", "text": "tracert", "is_correct": true}, {"id": "c", "text": "getmac", "is_correct": false}, {"id": "d", "text": "ipconfig", "is_correct": false}]$j$::jsonb,
   $kt$tracert TTL ni oshirib, har sakrashni ko'rsatadi.$kt$, 1, 3),
  ('4770da01-1155-513f-ab6d-329078fd7739', t, $kt$DNS keshini qaysi buyruq tozalaydi?$kt$, 'single',
   $j$[{"id": "a", "text": "ipconfig /renew", "is_correct": false}, {"id": "b", "text": "ipconfig /flushdns", "is_correct": true}, {"id": "c", "text": "ipconfig /release", "is_correct": false}, {"id": "d", "text": "arp -d", "is_correct": false}]$j$::jsonb,
   $kt$/flushdns.$kt$, 1, 4),
  ('4a68889a-b07a-502a-bde3-edeb10f83493', t, $kt$Lokal printerga ping o'tadi, Internetdagi manzillarga 'Destination host unreachable'. Ehtimoliy sabablar?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Shlyuz noto'g'ri", "is_correct": true}, {"id": "b", "text": "Router ishlamayapti", "is_correct": true}, {"id": "c", "text": "Kabel uzilgan", "is_correct": false}, {"id": "d", "text": "Shlyuz ko'rsatilmagan", "is_correct": true}]$j$::jsonb,
   $kt$Kabel uzilgan bo'lsa, lokal ping ham o'tmas edi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('7ce4ee46-042f-5508-9fe8-14a7ce26f4b2', '4a11c0fe-488a-5290-8199-9f3bb24a30fd');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('7ce4ee46-042f-5508-9fe8-14a7ce26f4b2', t, $kt$Tashxis qo'ying$kt$, $kt$Buyruqlar natijasiga qarab sababni tanlang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Virtual simulyatsiyadagi terminalda har bir holatni o'zingiz takrorlang."}]$j$::jsonb, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "ipconfig: Media disconnected", "type": "choice", "accept": ["Kabel"], "options": ["Kabel", "DHCP", "Shlyuz", "DNS"]}, {"label": "IPv4: 169.254.80.11, shlyuz bo'sh", "type": "choice", "accept": ["DHCP"], "options": ["Kabel", "DHCP", "Shlyuz", "DNS"]}, {"label": "ping 192.168.1.20 — javob bor; ping 8.8.8.8 — Destination host unreachable", "type": "choice", "accept": ["Shlyuz"], "options": ["Kabel", "DHCP", "Shlyuz", "DNS"]}, {"label": "ping 8.8.8.8 — javob bor; nslookup — DNS request timed out", "type": "choice", "accept": ["DNS"], "options": ["Kabel", "DHCP", "Shlyuz", "DNS"]}]}$j$::jsonb, NULL),
  ('4a11c0fe-488a-5290-8199-9f3bb24a30fd', t, $kt$Metodologiya tartibi$kt$, $kt$Bosqich tartib raqamini kiriting (1–7).$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Farazni tekshirish", "type": "number", "accept": ["3"]}, {"label": "Hujjatlashtirish", "type": "number", "accept": ["7"]}, {"label": "Muammoni aniqlash", "type": "number", "accept": ["1"]}, {"label": "Natijani tekshirish", "type": "number", "accept": ["6"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

END $mig$;
