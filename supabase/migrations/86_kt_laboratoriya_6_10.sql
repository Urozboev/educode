-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: Laboratoriya ishlari 6–10
--
-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
-- Manba: scripts/kontent/kompyuter-tarmoqlari/l06_10.py
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
  SELECT id INTO v_course FROM courses WHERE slug = 'kompyuter-tarmoqlari-laboratoriya';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: kompyuter-tarmoqlari-laboratoriya. Avval 78_kompyuter_tarmoqlari_infra.sql ni ishga tushiring.';
  END IF;

  -- ============================================================
  -- 6. 6-laboratoriya ishi: IP manzillar. Sinfli manzillar. Maskalar yordamida adreslash va IP manzillardan tejamkor foydalanish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$6-laboratoriya ishi: IP manzillar. Sinfli manzillar. Maskalar yordamida adreslash va IP manzillardan tejamkor foydalanish$kt$, 'kt-l06-ip-manzil',
$kt$<h2>Ishning maqsadi</h2>
<p>Windows'da IP manzilni qo'lda va avtomatik sozlash, maskaning tarmoq aloqasiga ta'sirini amalda ko'rish va laboratoriya uchun manzillash rejasini tuzish.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>Windows 10/11 (administrator huquqi) yoki virtual mashina</li>
  <li>Cisco Packet Tracer</li>
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
  <tr><td>1</td><td>192.168.50.0/26</td><td>192.168.50.1</td><td>192.168.50.10 – 192.168.50.62</td><td>192.168.50.63</td></tr><tr><td>2</td><td>192.168.50.64/26</td><td>192.168.50.65</td><td>192.168.50.74 – 192.168.50.126</td><td>192.168.50.127</td></tr><tr><td>3</td><td>192.168.50.128/26</td><td>192.168.50.129</td><td>192.168.50.138 – 192.168.50.190</td><td>192.168.50.191</td></tr><tr><td>4</td><td>192.168.50.192/26</td><td>192.168.50.193</td><td>192.168.50.202 – 192.168.50.254</td><td>192.168.50.255</td></tr>
</table>
<p>Har xonada shlyuz — birinchi manzil, 2–9 — server va printerlar uchun statik, qolgani DHCP.</p>

<h2>Hisobot talablari</h2>
<ul>
  <li>Statik IP sozlangan oyna va <code>ipconfig /all</code> skrinshoti.</li>
  <li>/24 va /26 da ping natijalari (qaysi juftlik ishladi, qaysi yo'q).</li>
  <li>Manzillash rejasi jadvali.</li>
</ul>$kt$,
  $j$[{"t": "title", "title": "IP manzilni sozlash", "subtitle": "6-laboratoriya ishi", "emoji": "🏷️"}, {"t": "code", "title": "netsh bilan", "code": "netsh interface ipv4 set address name=\"Ethernet\" static 192.168.1.50 255.255.255.0 192.168.1.1\nnetsh interface ipv4 set address name=\"Ethernet\" dhcp"}, {"t": "table", "title": "/26 da manzillar", "head": ["PC", "IP", "Tarmoq"], "rows": [["PC0", "192.168.50.10", "192.168.50.0"], ["PC1", "192.168.50.20", "192.168.50.0"], ["PC2", "192.168.50.100", "192.168.50.64"], ["PC3", "192.168.50.130", "192.168.50.128"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "/26 da PC0 (…50.10) va PC2 (…50.100) ping qila oladimi?", "options": ["Faqat bir tomonga", "Yo'q", "Ha"], "answer": 1, "explain": "Ular turli quyi tarmoqlarda (.0 va .64) — shlyuz kerak."}, {"t": "table", "title": "Reja: 192.168.50.0/24 → 4 xona", "head": ["Xona", "Tarmoq"], "rows": [["1", "192.168.50.0/26"], ["2", "192.168.50.64/26"], ["3", "192.168.50.128/26"], ["4", "192.168.50.192/26"]]}, {"t": "idea", "title": "Tejamkorlik", "text": "Har xonaga /26 — 62 manzil. Hammaga /24 bersak, 4 ta to'liq tarmoq (1016 manzil) band bo'lardi.", "emoji": "💡"}, {"t": "summary", "title": "Hisobot", "items": ["Statik IP skrinshoti", "/24 va /26 ping natijalari", "Manzillash rejasi"]}]$j$::jsonb,
  6, 15, 30, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('4eddd9a8-d11b-5396-a568-09d96e45a6d0', 'd727dabc-f9ac-5d28-a935-76209cdd85dc', '948580f4-5ea8-5808-b954-4d54c1a0b412', '946ae7ac-6b9c-5c8c-8164-db59cc021b2b', '235e5176-ccf5-55af-b916-5c0555ccf3a7', 'a21ee234-c584-56ed-9ab6-05831034c201');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('4eddd9a8-d11b-5396-a568-09d96e45a6d0', t, $kt$Windows'da TCP/IPv4 sozlamalarini tez ochish buyrug'i?$kt$, 'single',
   $j$[{"id": "a", "text": "regedit", "is_correct": false}, {"id": "b", "text": "services.msc", "is_correct": false}, {"id": "c", "text": "msconfig", "is_correct": false}, {"id": "d", "text": "ncpa.cpl", "is_correct": true}]$j$::jsonb,
   $kt$Network Connections.$kt$, 1, 0),
  ('d727dabc-f9ac-5d28-a935-76209cdd85dc', t, $kt$Statik IP sozlangach ipconfig /all da 'DHCP Enabled' nima ko'rsatadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Yes", "is_correct": false}, {"id": "b", "text": "Manual", "is_correct": false}, {"id": "c", "text": "Static", "is_correct": false}, {"id": "d", "text": "No", "is_correct": true}]$j$::jsonb,
   $kt$Manzil qo'lda berilgan.$kt$, 1, 1),
  ('948580f4-5ea8-5808-b954-4d54c1a0b412', t, $kt$192.168.50.130/26 qaysi tarmoqqa tegishli?$kt$, 'single',
   $j$[{"id": "a", "text": "192.168.50.0", "is_correct": false}, {"id": "b", "text": "192.168.50.128", "is_correct": true}, {"id": "c", "text": "192.168.50.192", "is_correct": false}, {"id": "d", "text": "192.168.50.64", "is_correct": false}]$j$::jsonb,
   $kt$128–191 bloki.$kt$, 1, 2),
  ('946ae7ac-6b9c-5c8c-8164-db59cc021b2b', t, $kt$/26 tarmoqda nechta xost?$kt$, 'single',
   $j$[{"id": "a", "text": "30", "is_correct": false}, {"id": "b", "text": "126", "is_correct": false}, {"id": "c", "text": "64", "is_correct": false}, {"id": "d", "text": "62", "is_correct": true}]$j$::jsonb,
   $kt$2⁶ − 2.$kt$, 1, 3),
  ('235e5176-ccf5-55af-b916-5c0555ccf3a7', t, $kt$Ish oxirida adapterni DHCP ga qaytarish buyrug'i?$kt$, 'single',
   $j$[{"id": "a", "text": "netsh interface ipv4 set address name=\"Ethernet\" dhcp", "is_correct": true}, {"id": "b", "text": "route delete", "is_correct": false}, {"id": "c", "text": "ipconfig /renew", "is_correct": false}, {"id": "d", "text": "arp -d", "is_correct": false}]$j$::jsonb,
   $kt$Keyin ipconfig /renew bilan yangi manzil olinadi.$kt$, 1, 4),
  ('a21ee234-c584-56ed-9ab6-05831034c201', t, $kt$Qaysi juftliklar /26 da bir tarmoqda?$kt$, 'multiple',
   $j$[{"id": "a", "text": "192.168.50.100 va 192.168.50.130", "is_correct": false}, {"id": "b", "text": "192.168.50.10 va 192.168.50.20", "is_correct": true}, {"id": "c", "text": "192.168.50.200 va 192.168.50.250", "is_correct": true}, {"id": "d", "text": "192.168.50.70 va 192.168.50.120", "is_correct": true}]$j$::jsonb,
   $kt$.100 (64–127) va .130 (128–191) turli.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('915e375c-a745-5ba2-8754-4bfd940c261b', 'd6782110-0d0e-5879-bde3-33773ed3c5d8');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('915e375c-a745-5ba2-8754-4bfd940c261b', t, $kt$6-laboratoriya hisoboti$kt$, $kt$Uchala qismni bajaring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["Joriy sozlamalarni yozib oldim", "Statik IP ni grafik interfeysda sozladim", "netsh orqali sozlab, ping bilan tekshirdim", "Adapterni DHCP rejimiga qaytardim", "4 ta PC bilan /24 va /26 ni solishtirdim", "192.168.50.0/24 uchun manzillash rejasini tuzdim"], "prompt": "/26 maskada qaysi kompyuterlar o'zaro aloqa qila olmadi va nima uchun? Manzillash rejangiz qancha manzilni tejaydi?", "min_images": 2, "max_images": 5, "min_chars": 150}$j$::jsonb),
  ('d6782110-0d0e-5879-bde3-33773ed3c5d8', t, $kt$Rejani tekshiring$kt$, $kt$192.168.50.0/24 ni 4 ta teng xonaga bo'lish.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "3-xona tarmog'i", "type": "ip", "accept": ["192.168.50.128/26"]}, {"label": "3-xona shlyuzi (birinchi xost)", "type": "ip", "accept": ["192.168.50.129"]}, {"label": "4-xona broadcast", "type": "ip", "accept": ["192.168.50.255"]}, {"label": "Bitta xonadagi maksimal kompyuterlar soni", "type": "number", "accept": ["62"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 7. 7-laboratoriya ishi: Marshrutizatorlarni boshqarish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$7-laboratoriya ishi: Marshrutizatorlarni boshqarish$kt$, 'kt-l07-marshrutizator',
$kt$<h2>Ishning maqsadi</h2>
<p>Marshrutizatorning buyruq qatori (CLI) bilan ishlash, interfeyslarni sozlash, statik va dinamik marshrutlash yordamida ikki tarmoqni bog'lash.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>Cisco Packet Tracer — marshrutizator 2911 (yoki 1941), kommutator 2960, PC lar</li>
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
</ul>$kt$,
  $j$[{"t": "title", "title": "Marshrutizator CLI", "subtitle": "7-laboratoriya ishi", "emoji": "🛣️"}, {"t": "table", "title": "Rejimlar", "head": ["Taklif", "Rejim"], "rows": [["Router>", "Foydalanuvchi"], ["Router#", "Privilegiyali (enable)"], ["(config)#", "Global (conf t)"], ["(config-if)#", "Interfeys"]]}, {"t": "code", "title": "Interfeys", "code": "interface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown"}, {"t": "code", "title": "Statik marshrut", "code": "R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2\nR2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Marshrutizator interfeysi sozlandi, lekin 'administratively down'. Nima unutilgan?", "options": ["enable", "hostname", "no shutdown", "ip address"], "answer": 2, "explain": "Cisco interfeyslari sukut bo'yicha o'chiq."}, {"t": "code", "title": "OSPF", "code": "router ospf 1\n network 192.168.1.0 0.0.0.255 area 0\n network 10.0.0.0 0.0.0.3 area 0", "note": "Wildcard maska = maskaning teskarisi"}, {"t": "idea", "title": "Saqlashni unutmang", "text": "copy running-config startup-config — aks holda qayta yuklanganda hammasi yo'qoladi.", "emoji": "💾"}, {"t": "summary", "title": "Hisobot", "items": ["show ip interface brief", "show ip route (S va O)", "Bir va ikki tomonlama ping"]}]$j$::jsonb,
  7, 15, 30, 90, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('78d4e279-7025-5ca1-a5d4-7fa26a9dbeb3', '09973e6f-95e8-5393-b04b-45519b967021', '1027c433-803f-5ee2-8ea0-e257a911743f', 'b74867da-224e-54de-bc72-4ec2c165facb', '06eb87df-7f78-57b1-b52d-79c1d021bfb8', '416fbd79-9c9c-5d86-87d2-dddf4c1f893d');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('78d4e279-7025-5ca1-a5d4-7fa26a9dbeb3', t, $kt$Privilegiyali rejimga o'tish buyrug'i?$kt$, 'single',
   $j$[{"id": "a", "text": "configure terminal", "is_correct": false}, {"id": "b", "text": "enable", "is_correct": true}, {"id": "c", "text": "login", "is_correct": false}, {"id": "d", "text": "interface", "is_correct": false}]$j$::jsonb,
   $kt$Router> → Router#.$kt$, 1, 0),
  ('09973e6f-95e8-5393-b04b-45519b967021', t, $kt$Interfeysni yoqish buyrug'i?$kt$, 'single',
   $j$[{"id": "a", "text": "shutdown", "is_correct": false}, {"id": "b", "text": "enable", "is_correct": false}, {"id": "c", "text": "no shutdown", "is_correct": true}, {"id": "d", "text": "up", "is_correct": false}]$j$::jsonb,
   $kt$no shutdown.$kt$, 1, 1),
  ('1027c433-803f-5ee2-8ea0-e257a911743f', t, $kt$Interfeyslar holatini qisqacha ko'rsatuvchi buyruq?$kt$, 'single',
   $j$[{"id": "a", "text": "show version", "is_correct": false}, {"id": "b", "text": "show running-config", "is_correct": false}, {"id": "c", "text": "show ip route", "is_correct": false}, {"id": "d", "text": "show ip interface brief", "is_correct": true}]$j$::jsonb,
   $kt$IP, holat, protokol.$kt$, 1, 2),
  ('b74867da-224e-54de-bc72-4ec2c165facb', t, $kt$/30 maskaning OSPF wildcard ko'rinishi?$kt$, 'single',
   $j$[{"id": "a", "text": "0.0.0.255", "is_correct": false}, {"id": "b", "text": "0.0.0.3", "is_correct": true}, {"id": "c", "text": "0.0.0.4", "is_correct": false}, {"id": "d", "text": "255.255.255.252", "is_correct": false}]$j$::jsonb,
   $kt$Maskaning teskarisi.$kt$, 1, 3),
  ('06eb87df-7f78-57b1-b52d-79c1d021bfb8', t, $kt$Marshrut jadvalida OSPF yozuvi qaysi harf bilan?$kt$, 'single',
   $j$[{"id": "a", "text": "R", "is_correct": false}, {"id": "b", "text": "O", "is_correct": true}, {"id": "c", "text": "S", "is_correct": false}, {"id": "d", "text": "C", "is_correct": false}]$j$::jsonb,
   $kt$S — statik, C — ulangan, R — RIP.$kt$, 1, 4),
  ('416fbd79-9c9c-5d86-87d2-dddf4c1f893d', t, $kt$Qaysi buyruqlar sozlamani saqlaydi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "write memory", "is_correct": true}, {"id": "b", "text": "show startup-config", "is_correct": false}, {"id": "c", "text": "reload", "is_correct": false}, {"id": "d", "text": "copy running-config startup-config", "is_correct": true}]$j$::jsonb,
   $kt$reload — qayta yuklash.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('b8dff63e-3c8e-5290-91f0-b45ae8da3a73', '9b6a2fee-877a-53a4-90b7-4900e773d403');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('b8dff63e-3c8e-5290-91f0-b45ae8da3a73', t, $kt$7-laboratoriya hisoboti$kt$, $kt$Packet Tracer da to'rt qismni bajaring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["Bitta router bilan ikki LAN ni bog'ladim, PC larga shlyuz berdim", "show ip interface brief va show ip route natijalarini oldim", "Ikki routerli sxemada faqat R1 da statik marshrut bilan ping qildim", "R2 da ham marshrut qo'shib, ping muvaffaqiyatli bo'lganini tekshirdim", "Statik marshrutlarni OSPF bilan almashtirdim", "Sozlamalarni saqladim"], "prompt": "Statik marshrut faqat bitta routerda yozilganda nima bo'ldi va nega? OSPF yoqilgach marshrut jadvalida qanday o'zgarish ko'rdingiz?", "min_images": 3, "max_images": 6, "min_chars": 150}$j$::jsonb),
  ('9b6a2fee-877a-53a4-90b7-4900e773d403', t, $kt$Buyruqlar$kt$, $kt$R1 da G0/1 interfeysiga 10.0.0.1/30 manzil berish va R2 orqali 192.168.2.0/24 ga marshrut.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "ip route <tarmoq> <maska> <keyingi sakrash>."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "10.0.0.1/30 ning maskasi", "type": "ip", "accept": ["255.255.255.252"]}, {"label": "Statik marshrut buyrug'i (to'liq)", "type": "text", "accept": ["ip route 192.168.2.0 255.255.255.0 10.0.0.2"]}, {"label": "OSPF da 10.0.0.0/30 uchun wildcard", "type": "ip", "accept": ["0.0.0.3"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 8. 8-laboratoriya ishi: Soketlar yordamida tarmoq dasturini yaratish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$8-laboratoriya ishi: Soketlar yordamida tarmoq dasturini yaratish$kt$, 'kt-l08-soketlar',
$kt$<h2>Ishning maqsadi</h2>
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
<pre><code>import socket

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
            conn.sendall(matn.upper().encode("utf-8"))</code></pre>
<p><code>client.py</code>:</p>
<pre><code>import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(("127.0.0.1", 5000))
    while True:
        xabar = input("&gt; ")
        if xabar == "exit":
            break
        s.sendall(xabar.encode("utf-8"))
        print("Javob:", s.recv(1024).decode("utf-8"))</code></pre>
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
</ul>$kt$,
  $j$[{"t": "title", "title": "Soketlar bilan dastur", "subtitle": "8-laboratoriya ishi", "emoji": "🔌"}, {"t": "table", "title": "TCP soket chaqiruvlari", "head": ["Server", "Mijoz"], "rows": [["socket()", "socket()"], ["bind()", "—"], ["listen()", "—"], ["accept()", "connect()"], ["recv()/sendall()", "sendall()/recv()"], ["close()", "close()"]]}, {"t": "code", "title": "Server yadrosi", "code": "srv.bind((\"127.0.0.1\", 5000))\nsrv.listen()\nconn, addr = srv.accept()\ndata = conn.recv(1024)\nconn.sendall(data.upper())"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Mijoz ulanishni yopdi. Serverda recv() nima qaytaradi?", "options": ["Xato", "-1", "b'' (bo'sh bayt)", "None"], "answer": 2, "explain": "Bo'sh bayt — ulanish yopildi belgisi."}, {"t": "compare", "title": "TCP va UDP soket", "left": {"label": "SOCK_STREAM", "text": "listen, accept, connect; ishonchli oqim"}, "right": {"label": "SOCK_DGRAM", "text": "sendto, recvfrom; ulanishsiz"}}, {"t": "code", "title": "netstat", "code": "netstat -an | findstr 5000", "output": "TCP  127.0.0.1:5000   0.0.0.0:0          LISTENING\nTCP  127.0.0.1:5000   127.0.0.1:51544    ESTABLISHED"}, {"t": "summary", "title": "Hisobot", "items": ["Server va mijoz skrinshoti", "netstat natijasi", "Kengaytirilgan protokol"]}]$j$::jsonb,
  8, 15, 30, 90, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('3658d2b1-e858-5f83-8834-6cdd182a7cd0', '9d3ce73a-c926-5978-8188-56ff5d16cd58', '9f600aa1-8427-572a-85b6-79718fc9f572', '8dcf79af-7c4c-58e6-bdaa-438f69228239', '0cb7018e-82d7-50c2-a607-caa10783b2e9', '72ccab26-cdd9-511a-898d-eb65623ab0f9');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('3658d2b1-e858-5f83-8834-6cdd182a7cd0', t, $kt$Serverda ulanishlarni kutishni boshlovchi chaqiruv?$kt$, 'single',
   $j$[{"id": "a", "text": "send()", "is_correct": false}, {"id": "b", "text": "listen()", "is_correct": true}, {"id": "c", "text": "connect()", "is_correct": false}, {"id": "d", "text": "recv()", "is_correct": false}]$j$::jsonb,
   $kt$Keyin accept() mijozni kutadi.$kt$, 1, 0),
  ('9d3ce73a-c926-5978-8188-56ff5d16cd58', t, $kt$accept() nima qaytaradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Faqat True", "is_correct": false}, {"id": "b", "text": "Port raqami", "is_correct": false}, {"id": "c", "text": "Xabar", "is_correct": false}, {"id": "d", "text": "Yangi soket va mijoz manzili", "is_correct": true}]$j$::jsonb,
   $kt$conn, addr.$kt$, 1, 1),
  ('9f600aa1-8427-572a-85b6-79718fc9f572', t, $kt$Server o'chiq paytda TCP mijoz connect() qilsa?$kt$, 'single',
   $j$[{"id": "a", "text": "Xabar yo'qoladi", "is_correct": false}, {"id": "b", "text": "ConnectionRefusedError", "is_correct": true}, {"id": "c", "text": "Avtomatik UDP ga o'tadi", "is_correct": false}, {"id": "d", "text": "Kutib turadi", "is_correct": false}]$j$::jsonb,
   $kt$Port yopiq — RST qaytadi.$kt$, 1, 2),
  ('8dcf79af-7c4c-58e6-bdaa-438f69228239', t, $kt$Matnni soket orqali yuborishdan oldin nima qilinadi?$kt$, 'single',
   $j$[{"id": "a", "text": "split()", "is_correct": false}, {"id": "b", "text": "int() ga aylantirish", "is_correct": false}, {"id": "c", "text": "encode() — baytlarga", "is_correct": true}, {"id": "d", "text": "Hech narsa", "is_correct": false}]$j$::jsonb,
   $kt$Soket baytlar bilan ishlaydi.$kt$, 1, 3),
  ('0cb7018e-82d7-50c2-a607-caa10783b2e9', t, $kt$UDP serverda qabul qilish chaqiruvi?$kt$, 'single',
   $j$[{"id": "a", "text": "recvfrom()", "is_correct": true}, {"id": "b", "text": "connect()", "is_correct": false}, {"id": "c", "text": "listen()", "is_correct": false}, {"id": "d", "text": "accept()", "is_correct": false}]$j$::jsonb,
   $kt$Jo'natuvchi manzili bilan birga qaytaradi.$kt$, 1, 4),
  ('72ccab26-cdd9-511a-898d-eb65623ab0f9', t, $kt$netstat da server porti qanday holatlarda ko'rinadi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "LISTENING", "is_correct": true}, {"id": "b", "text": "CLOSE_WAIT", "is_correct": true}, {"id": "c", "text": "ESTABLISHED", "is_correct": true}, {"id": "d", "text": "SYN_FLOOD", "is_correct": false}]$j$::jsonb,
   $kt$SYN_FLOOD holat emas.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('b0226035-f111-5a19-9d85-a576947e1fd3', '101274e6-00b0-51be-b49a-98439a268ee4');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('b0226035-f111-5a19-9d85-a576947e1fd3', t, $kt$8-laboratoriya hisoboti$kt$, $kt$TCP va UDP mijoz-server dasturlarini o'z kompyuteringizda ishga tushiring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["server.py va client.py ni yozdim va ishga tushirdim", "Bir nechta xabar almashdim", "netstat bilan LISTENING va ESTABLISHED holatlarini topdim", "Mijoz yopilganda va server o'chiq bo'lganda nima bo'lishini tekshirdim", "UDP variantini yozdim", "Serverga UPPER / SUM / REVERSE buyruqlarini qo'shdim"], "prompt": "Mijoz qaysi portdan ulandi? TCP va UDP variantlarining xulq-atvoridagi farqni (ayniqsa server o'chiq bo'lganda) yozing.", "min_images": 2, "max_images": 5, "min_chars": 150}$j$::jsonb),
  ('101274e6-00b0-51be-b49a-98439a268ee4', t, $kt$Server buyruqlari$kt$, $kt$Server mantiqini yozing. Birinchi qatorda N, keyingi N qatorda buyruqlar:
UPPER matn → matnni katta harflarda
SUM a b → ikki butun son yig'indisi
REVERSE matn → matn teskari
boshqa har qanday → ERROR
Har buyruqqa javobni alohida qatorda chiqaring.$kt$,
   NULL,
   $kt$n = int(input())
for _ in range(n):
    qator = input()
    # Kodingizni shu yerga yozing
$kt$, $kt$n = int(input())
for _ in range(n):
    qator = input()
    cmd, _, rest = qator.partition(' ')
    if cmd == 'UPPER':
        print(rest.upper())
    elif cmd == 'SUM':
        a, b = rest.split()
        print(int(a) + int(b))
    elif cmd == 'REVERSE':
        print(rest[::-1])
    else:
        print('ERROR')$kt$, 'python',
   $j$[{"input": "3\nUPPER salom dunyo\nSUM 2 40\nREVERSE tarmoq", "expected_output": "SALOM DUNYO\n42\nqomrat", "is_hidden": false}, {"input": "2\nPING\nSUM -5 5", "expected_output": "ERROR\n0", "is_hidden": false}, {"input": "1\nREVERSE abc", "expected_output": "cba", "is_hidden": true}, {"input": "2\nUPPER x\nHELLO world", "expected_output": "X\nERROR", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "qator.partition(' ') — birinchi bo'shliqdan ikkiga bo'ladi."}, {"order": 2, "text": "rest[::-1] — teskari."}]$j$::jsonb, 'medium', 5, 15, 1,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 9. 9-laboratoriya ishi: Windows Server operatsion tizimini o'rnatish va boshlang'ich sozlash
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$9-laboratoriya ishi: Windows Server operatsion tizimini o'rnatish va boshlang'ich sozlash$kt$, 'kt-l09-windows-server',
$kt$<h2>Ishning maqsadi</h2>
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
</ul>$kt$,
  $j$[{"t": "title", "title": "Windows Server o'rnatish", "subtitle": "9-laboratoriya ishi", "emoji": "🪟"}, {"t": "table", "title": "VM sozlamalari", "head": ["Parametr", "Qiymat"], "rows": [["RAM", "4 GB"], ["CPU", "2 yadro"], ["Disk", "50 GB"], ["Tarmoq", "Internal Network"]]}, {"t": "points", "title": "O'rnatishdan keyin", "items": [{"e": "🏷️", "text": "Nom: SRV1"}, {"e": "📍", "text": "Statik IP 192.168.10.10/24"}, {"e": "🕔", "text": "Vaqt mintaqasi UTC+5"}, {"e": "🖥️", "text": "Remote Desktop yoqish"}]}, {"t": "code", "title": "PowerShell", "code": "hostname\nGet-NetIPConfiguration\nRename-Computer -NewName SRV1 -Restart"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Desktop Experience uchun minimal RAM?", "options": ["8 GB", "512 MB", "2 GB", "1 GB"], "answer": 2, "explain": "Server Core — 512 MB."}, {"t": "compare", "title": "Interfeys", "left": {"label": "Desktop Experience", "text": "Server Manager, grafik"}, "right": {"label": "Server Core", "text": "sconfig, PowerShell"}}, {"t": "summary", "title": "Hisobot", "items": ["VM sozlamalari", "Local Server oynasi", "Get-NetIPConfiguration"]}]$j$::jsonb,
  9, 15, 30, 120, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('521f9e32-62bf-5998-ae96-c7d3950203af', 'b5e75f35-a646-5129-9a89-5096d5b8c065', '893999d9-8a4c-575d-b33f-afa0a179bd6a', '4b782830-a26e-520e-bb31-8dceeefcf71f', 'dd9e2b8b-1536-5703-bef9-f009b159a7a2', '2c8260d5-1a63-5042-a85b-862d9f1ef022');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('521f9e32-62bf-5998-ae96-c7d3950203af', t, $kt$Windows Server sinov versiyasi necha kun ishlaydi?$kt$, 'single',
   $j$[{"id": "a", "text": "30", "is_correct": false}, {"id": "b", "text": "90", "is_correct": false}, {"id": "c", "text": "365", "is_correct": false}, {"id": "d", "text": "180", "is_correct": true}]$j$::jsonb,
   $kt$Evaluation — 180 kun.$kt$, 1, 0),
  ('b5e75f35-a646-5129-9a89-5096d5b8c065', t, $kt$Server Core da boshlang'ich sozlash menyusi?$kt$, 'single',
   $j$[{"id": "a", "text": "ncpa.cpl", "is_correct": false}, {"id": "b", "text": "msconfig", "is_correct": false}, {"id": "c", "text": "gpedit", "is_correct": false}, {"id": "d", "text": "sconfig", "is_correct": true}]$j$::jsonb,
   $kt$Server Configuration Tool.$kt$, 1, 1),
  ('893999d9-8a4c-575d-b33f-afa0a179bd6a', t, $kt$Server uchun IP qanday bo'lishi kerak?$kt$, 'single',
   $j$[{"id": "a", "text": "DHCP dan", "is_correct": false}, {"id": "b", "text": "APIPA", "is_correct": false}, {"id": "c", "text": "Statik", "is_correct": true}, {"id": "d", "text": "Farqi yo'q", "is_correct": false}]$j$::jsonb,
   $kt$Mijozlar uni doimiy manzilda topishi kerak.$kt$, 1, 2),
  ('4b782830-a26e-520e-bb31-8dceeefcf71f', t, $kt$VM larni tashqi tarmoqsiz o'zaro bog'lash uchun VirtualBox tarmoq rejimi?$kt$, 'single',
   $j$[{"id": "a", "text": "Bridged", "is_correct": false}, {"id": "b", "text": "NAT", "is_correct": false}, {"id": "c", "text": "Internal Network", "is_correct": true}, {"id": "d", "text": "Not attached", "is_correct": false}]$j$::jsonb,
   $kt$Faqat VM lar orasida.$kt$, 1, 3),
  ('dd9e2b8b-1536-5703-bef9-f009b159a7a2', t, $kt$Kompyuter nomini PowerShell da o'zgartirish?$kt$, 'single',
   $j$[{"id": "a", "text": "hostname -s", "is_correct": false}, {"id": "b", "text": "Set-Hostname", "is_correct": false}, {"id": "c", "text": "netsh name", "is_correct": false}, {"id": "d", "text": "Rename-Computer", "is_correct": true}]$j$::jsonb,
   $kt$Rename-Computer -NewName SRV1 -Restart.$kt$, 1, 4),
  ('2c8260d5-1a63-5042-a85b-862d9f1ef022', t, $kt$Qaysilar boshlang'ich sozlashga kiradi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Statik IP", "is_correct": true}, {"id": "b", "text": "Domen kontrolleriga ko'tarish", "is_correct": false}, {"id": "c", "text": "Vaqt mintaqasi", "is_correct": true}, {"id": "d", "text": "Kompyuter nomi", "is_correct": true}]$j$::jsonb,
   $kt$DC ga ko'tarish — keyingi bosqich (rol o'rnatish).$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('e9bf525b-6a67-5edd-8556-b46f84956c32', 'bfc724b3-1f57-5d7d-bd12-d67fa133b078');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('e9bf525b-6a67-5edd-8556-b46f84956c32', t, $kt$9-laboratoriya hisoboti$kt$, $kt$Windows Server ni virtual mashinada o'rnating va sozlang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["Virtual mashinani yaratdim (4 GB RAM, 2 CPU, 50 GB)", "Windows Server 2022 Desktop Experience ni o'rnatdim", "Kompyuter nomini SRV1 ga o'zgartirdim", "Statik IP 192.168.10.10/24 berdim", "Vaqt mintaqasini sozladim va Remote Desktop ni yoqdim", "PowerShell da Get-NetIPConfiguration bilan tekshirdim"], "prompt": "O'rnatish qancha vaqt oldi, qanday muammolarga duch keldingiz va qanday hal qildingiz? Nega serverga statik IP berildi?", "min_images": 2, "max_images": 5, "min_chars": 120}$j$::jsonb),
  ('bfc724b3-1f57-5d7d-bd12-d67fa133b078', t, $kt$Sozlamalar$kt$, $kt$Laboratoriya ishidagi qiymatlar.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Serverning IP manzili", "type": "ip", "accept": ["192.168.10.10"]}, {"label": "Maska", "type": "ip", "accept": ["255.255.255.0"]}, {"label": "Desktop Experience uchun minimal RAM, GB", "type": "number", "accept": ["2"]}, {"label": "Server Core boshlang'ich sozlash buyrug'i", "type": "text", "accept": ["sconfig"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 10. 10-laboratoriya ishi: Windows Server operatsion tizimida tarmoq xizmatlarini o'rnatish va sozlash (DHCP, DNS, IIS)
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$10-laboratoriya ishi: Windows Server operatsion tizimida tarmoq xizmatlarini o'rnatish va sozlash (DHCP, DNS, IIS)$kt$, 'kt-l10-server-xizmatlari',
$kt$<h2>Ishning maqsadi</h2>
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
  <li>Serverda <code>C:\inetpub\wwwroot\index.html</code> ni o'zgartiring: "Kafedra serveri — Familiya Ism".</li>
  <li>Mijoz brauzerida <code>http://www.kafedra.local</code> ni oching.</li>
  <li>IIS Manager → Default Web Site → Bindings: port va xost nomini ko'rib chiqing.</li>
</ol>

<h2>Hisobot talablari</h2>
<ul>
  <li>DHCP scope va Address Leases oynasi; mijozdagi <code>ipconfig /all</code>.</li>
  <li>DNS zona yozuvlari va mijozdagi <code>nslookup</code> natijalari.</li>
  <li>Mijoz brauzerida ochilgan sahifa.</li>
</ul>$kt$,
  $j$[{"t": "title", "title": "DHCP, DNS va IIS", "subtitle": "10-laboratoriya ishi", "emoji": "🛠️"}, {"t": "code", "title": "Rollar", "code": "Install-WindowsFeature DHCP, DNS, Web-Server -IncludeManagementTools"}, {"t": "table", "title": "DHCP scope", "head": ["Parametr", "Qiymat"], "rows": [["Diapazon", "192.168.10.100 – .200"], ["Istisno", ".100 – .109"], ["003 Router", "192.168.10.1"], ["006 DNS", "192.168.10.10"], ["Ijara", "8 soat"]]}, {"t": "table", "title": "DNS yozuvlari", "head": ["Nom", "Tur", "Qiymat"], "rows": [["srv1", "A", "192.168.10.10"], ["www", "CNAME", "srv1.kafedra.local"], ["printer", "A", "192.168.10.105"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Scope 100–200, istisno 100–109. Mijozlarga nechta manzil berilishi mumkin?", "options": ["101", "90", "100", "91"], "answer": 3, "explain": "101 − 10 = 91."}, {"t": "code", "title": "Mijozda tekshirish", "code": "ipconfig /release\nipconfig /renew\nnslookup www.kafedra.local\nnslookup 192.168.10.10"}, {"t": "summary", "title": "Hisobot", "items": ["DHCP: scope va leases", "DNS: zona va nslookup", "IIS: sahifa mijozda ochildi"]}]$j$::jsonb,
  10, 15, 30, 120, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('b280b13a-92d7-5bec-b63b-2dcc033bc1e4', '61b01055-2343-51fc-b600-661a3612aa30', '6cee7ad4-88e4-5f13-92f1-1d9e0db0d2ef', 'd387c490-430c-5236-9b44-0a9c6aaa7418', '8e994e04-d009-57d2-9f0f-cd78a27d6b9c', 'a48651fe-4567-5543-86bd-bdc45b6088af');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('b280b13a-92d7-5bec-b63b-2dcc033bc1e4', t, $kt$DHCP da shlyuz qaysi variant raqami bilan beriladi?$kt$, 'single',
   $j$[{"id": "a", "text": "006", "is_correct": false}, {"id": "b", "text": "015", "is_correct": false}, {"id": "c", "text": "003", "is_correct": true}, {"id": "d", "text": "044", "is_correct": false}]$j$::jsonb,
   $kt$006 — DNS, 015 — domen nomi.$kt$, 1, 0),
  ('61b01055-2343-51fc-b600-661a3612aa30', t, $kt$Ma'lum MAC ga doimiy manzil berish?$kt$, 'single',
   $j$[{"id": "a", "text": "Reservation", "is_correct": true}, {"id": "b", "text": "Lease", "is_correct": false}, {"id": "c", "text": "Scope", "is_correct": false}, {"id": "d", "text": "Exclusion", "is_correct": false}]$j$::jsonb,
   $kt$Zaxira (bron).$kt$, 1, 1),
  ('6cee7ad4-88e4-5f13-92f1-1d9e0db0d2ef', t, $kt$www → srv1 qanday yozuv?$kt$, 'single',
   $j$[{"id": "a", "text": "PTR", "is_correct": false}, {"id": "b", "text": "A", "is_correct": false}, {"id": "c", "text": "MX", "is_correct": false}, {"id": "d", "text": "CNAME", "is_correct": true}]$j$::jsonb,
   $kt$Taxallus.$kt$, 1, 2),
  ('d387c490-430c-5236-9b44-0a9c6aaa7418', t, $kt$192.168.10.0/24 uchun teskari zona nomi?$kt$, 'single',
   $j$[{"id": "a", "text": "10.168.192.in-addr.arpa", "is_correct": true}, {"id": "b", "text": "in-addr.192.168.10", "is_correct": false}, {"id": "c", "text": "10.168.192.arpa", "is_correct": false}, {"id": "d", "text": "192.168.10.in-addr.arpa", "is_correct": false}]$j$::jsonb,
   $kt$Oktetlar teskari.$kt$, 1, 3),
  ('8e994e04-d009-57d2-9f0f-cd78a27d6b9c', t, $kt$IIS sukut sayt papkasi?$kt$, 'single',
   $j$[{"id": "a", "text": "C:\\www", "is_correct": false}, {"id": "b", "text": "C:\\inetpub\\wwwroot", "is_correct": true}, {"id": "c", "text": "C:\\IIS\\site", "is_correct": false}, {"id": "d", "text": "C:\\Windows\\Web", "is_correct": false}]$j$::jsonb,
   $kt$Default Web Site.$kt$, 1, 4),
  ('a48651fe-4567-5543-86bd-bdc45b6088af', t, $kt$Mijoz DHCP dan manzil ololmayapti. Nimalarni tekshirish kerak?$kt$, 'multiple',
   $j$[{"id": "a", "text": "IIS ishlayaptimi", "is_correct": false}, {"id": "b", "text": "Mijoz va server bir tarmoqdami (Internal Network)", "is_correct": true}, {"id": "c", "text": "Scope faollashtirilganmi", "is_correct": true}, {"id": "d", "text": "Domen bo'lsa — server avtorizatsiyalanganmi", "is_correct": true}]$j$::jsonb,
   $kt$IIS DHCP ga ta'sir qilmaydi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('d32c8f96-1be1-5e77-be70-53a3713dea5d', 'd51c839d-804c-57d8-9be6-b507568f656f');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('d32c8f96-1be1-5e77-be70-53a3713dea5d', t, $kt$10-laboratoriya hisoboti$kt$, $kt$Uch xizmatni o'rnating, sozlang va mijozdan tekshiring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["DHCP, DNS va IIS rollarini o'rnatdim", "DHCP scope, istisno, variantlar va ijara muddatini sozladim", "Mijoz manzil olganini ipconfig /all bilan tekshirdim", "Mijoz uchun zaxira (reservation) qildim", "kafedra.local zonasi va A, CNAME, PTR yozuvlarini yaratdim", "Mijozda nslookup bilan tekshirdim", "IIS sahifasini o'zgartirib, mijoz brauzerida ochdim"], "prompt": "Mijoz qanday manzil oldi va qaysi DHCP serverdan? nslookup natijalarini izohlang. Qaysi bosqichda muammo bo'ldi va qanday hal qildingiz?", "min_images": 3, "max_images": 6, "min_chars": 150}$j$::jsonb),
  ('d51c839d-804c-57d8-9be6-b507568f656f', t, $kt$DHCP hisobi$kt$, $kt$Scope: 192.168.10.100 – 192.168.10.200, istisno 192.168.10.100 – 192.168.10.109, ijara 8 soat.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "200 − 100 + 1."}, {"order": 2, "text": "T1 = ijaraning yarmi."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Diapazondagi manzillar soni", "type": "number", "accept": ["101"]}, {"label": "Mijozlarga beriladigan manzillar soni", "type": "number", "accept": ["91"]}, {"label": "Birinchi beriladigan manzil", "type": "ip", "accept": ["192.168.10.110"]}, {"label": "Mijoz necha soatdan keyin ijarani uzaytirishni so'raydi?", "type": "number", "accept": ["4"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

END $mig$;
