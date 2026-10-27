-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: Laboratoriya ishlari 1–5
--
-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
-- Manba: scripts/kontent/kompyuter-tarmoqlari/l01_05.py
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
  -- 1. 1-laboratoriya ishi: Tarmoq qurilmalari va ularning vazifalari
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$1-laboratoriya ishi: Tarmoq qurilmalari va ularning vazifalari$kt$, 'kt-l01-qurilmalar',
$kt$<h2>Ishning maqsadi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Tarmoq qurilmalari", "subtitle": "1-laboratoriya ishi", "emoji": "🔌"}, {"t": "table", "title": "Qurilmalar", "head": ["Qurilma", "Pog'ona", "Nimaga qaraydi"], "rows": [["Hub", "1", "hech narsa"], ["Switch", "2", "MAC"], ["Router", "3", "IP"]]}, {"t": "points", "title": "Ish rejasi", "items": [{"e": "🧪", "text": "Simulyatsiya: hub, switch, router"}, {"e": "💻", "text": "ipconfig /all, getmac"}, {"e": "🔍", "text": "Qurilmalar dispetcheri"}, {"e": "🔌", "text": "Haqiqiy qurilmalar paneli"}]}, {"t": "code", "title": "Buyruqlar", "code": "ipconfig /all\ngetmac /v", "output": "Physical Address. . . : D4-5D-64-A2-19-7C\nDHCP Enabled. . . . . : Yes\nIPv4 Address. . . . . : 192.168.1.10(Preferred)"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Kommutatorda birinchi A→C kadri nega hammaga ketadi?", "options": ["C ning MAC i jadvalda hali yo'q", "Kommutator nosoz", "A noto'g'ri ulangan", "Bu broadcast"], "answer": 0, "explain": "Noma'lum unicast — flooding."}, {"t": "compare", "title": "Hub va switch", "left": {"label": "Hub", "text": "Hamma portga — kanal hammaga band"}, "right": {"label": "Switch", "text": "Faqat kerakli portga — parallel uzatish"}}, {"t": "summary", "title": "Hisobot", "items": ["ipconfig /all skrinshoti", "MAC jadvali skrinshoti", "Xulosa: hub va switch farqi"]}]$j$::jsonb,
  1, 15, 30, 80, true, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('380a9f65-0b13-5a0c-8fa8-f51f6332df4e', '126116ac-e53b-53e5-803e-48f8e06a4fb8', 'a1b84932-a5fe-5f3e-8f5e-57be486a52f4', '1db89a35-b70b-54fc-9018-0be4ac2d0ee5', 'cf31300a-142e-57a0-b0bb-04266eb228a4', '4d94f5fe-14ff-5e22-ba68-d392720de552');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('380a9f65-0b13-5a0c-8fa8-f51f6332df4e', t, $kt$ipconfig /all dagi 'Physical Address' nima?$kt$, 'single',
   $j$[{"id": "a", "text": "Shlyuz", "is_correct": false}, {"id": "b", "text": "DNS", "is_correct": false}, {"id": "c", "text": "MAC manzil", "is_correct": true}, {"id": "d", "text": "IP manzil", "is_correct": false}]$j$::jsonb,
   $kt$Adapterning fizik (MAC) manzili.$kt$, 1, 0),
  ('126116ac-e53b-53e5-803e-48f8e06a4fb8', t, $kt$Kommutator broadcast kadrni qayerga yuboradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Faqat 1-portga", "is_correct": false}, {"id": "b", "text": "Hamma portga (kelganidan tashqari)", "is_correct": true}, {"id": "c", "text": "Routerga", "is_correct": false}, {"id": "d", "text": "Hech qayerga", "is_correct": false}]$j$::jsonb,
   $kt$Broadcast domeni butun kommutator.$kt$, 1, 1),
  ('a1b84932-a5fe-5f3e-8f5e-57be486a52f4', t, $kt$Ikki segmentni MAC bo'yicha bog'lovchi 2 portli qurilma?$kt$, 'single',
   $j$[{"id": "a", "text": "Router", "is_correct": false}, {"id": "b", "text": "Ko'prik", "is_correct": true}, {"id": "c", "text": "Repeater", "is_correct": false}, {"id": "d", "text": "Hub", "is_correct": false}]$j$::jsonb,
   $kt$Kommutator — ko'p portli ko'prik.$kt$, 1, 2),
  ('1db89a35-b70b-54fc-9018-0be4ac2d0ee5', t, $kt$Port chirog'i yonmayapti. Ehtimoliy sabab?$kt$, 'single',
   $j$[{"id": "a", "text": "Fizik ulanish yo'q", "is_correct": true}, {"id": "b", "text": "DNS xatosi", "is_correct": false}, {"id": "c", "text": "Brandmauer", "is_correct": false}, {"id": "d", "text": "IP noto'g'ri", "is_correct": false}]$j$::jsonb,
   $kt$Link chirog'i — 1-pog'ona belgisi.$kt$, 1, 3),
  ('cf31300a-142e-57a0-b0bb-04266eb228a4', t, $kt$Qaysi buyruq barcha adapterlarning MAC manzilini ko'rsatadi?$kt$, 'single',
   $j$[{"id": "a", "text": "tracert", "is_correct": false}, {"id": "b", "text": "nslookup", "is_correct": false}, {"id": "c", "text": "getmac", "is_correct": true}, {"id": "d", "text": "ping", "is_correct": false}]$j$::jsonb,
   $kt$Yoki ipconfig /all.$kt$, 1, 4),
  ('4d94f5fe-14ff-5e22-ba68-d392720de552', t, $kt$Qaysi qurilmalar to'qnashuv domenini ajratadi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Hub", "is_correct": false}, {"id": "b", "text": "Takrorlagich", "is_correct": false}, {"id": "c", "text": "Marshrutizator", "is_correct": true}, {"id": "d", "text": "Kommutator", "is_correct": true}]$j$::jsonb,
   $kt$Hub va takrorlagich signalni takrorlaydi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('4ec7b2f8-fe3f-5101-80cd-05e143bfb38a', '90862800-883a-5d4c-95c3-83692321bbbd');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('4ec7b2f8-fe3f-5101-80cd-05e143bfb38a', t, $kt$1-laboratoriya hisoboti$kt$, $kt$Ish tartibidagi uchala qismni bajaring va natijalarni yuklang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["Simulyatsiyada hub rejimida A→C kadrini yubordim va natijani yozdim", "Kommutator rejimida MAC jadvalini to'ldirdim (skrinshot)", "Router rejimida broadcast boshqa tarmoqqa o'tmasligini tekshirdim", "ipconfig /all ni bajardim (skrinshot)", "getmac /v va Qurilmalar dispetcheridan adapter modelini aniqladim", "Adapterning ulanish tezligini (Link speed) aniqladim"], "prompt": "Adapteringiz modeli, MAC manzili, IP manzili va ulanish tezligini yozing. Simulyatsiya asosida hub va kommutatorning farqini o'z so'zlaringiz bilan tushuntiring.", "min_images": 2, "max_images": 4, "min_chars": 150}$j$::jsonb),
  ('90862800-883a-5d4c-95c3-83692321bbbd', t, $kt$Natijalarni tekshiring$kt$, $kt$Simulyatsiyadagi kommutator: jadval bo'sh. A→C, C→A, A→C kadrlari yuborildi (4 portli kommutator).$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Faqat manba MAC lar yoziladi: A va C."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Birinchi kadr nechta portga yuborildi?", "type": "number", "accept": ["3"]}, {"label": "Uchinchi kadr nechta portga yuborildi?", "type": "number", "accept": ["1"]}, {"label": "Uchala kadrdan keyin jadvalda nechta yozuv bor?", "type": "number", "accept": ["2"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 2. 2-laboratoriya ishi: Tarmoq emulyatorlari va ulardan foydalanish (Cisco Packet Tracer)
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$2-laboratoriya ishi: Tarmoq emulyatorlari va ulardan foydalanish (Cisco Packet Tracer)$kt$, 'kt-l02-emulyator',
$kt$<h2>Ishning maqsadi</h2>
<p>Tarmoq emulyatori bilan tanishish, oddiy lokal tarmoqni yig'ish, IP manzillarni sozlash va ulanishni tekshirish.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>Cisco Packet Tracer (bepul, netacad.com da ro'yxatdan o'tib yuklab olinadi)</li>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Tarmoq emulyatori", "subtitle": "2-laboratoriya ishi", "emoji": "🖧"}, {"t": "points", "title": "Emulyatorlar", "items": [{"e": "🟦", "text": "Cisco Packet Tracer — o'quv, bepul"}, {"e": "🟩", "text": "GNS3, EVE-NG — real obrazlar"}, {"e": "🌐", "text": "Brauzerdagi mini-emulyator"}]}, {"t": "points", "title": "Packet Tracer: qadamlar", "items": [{"e": "1️⃣", "text": "Switch 2960 + 4 ta PC"}, {"e": "2️⃣", "text": "Copper Straight-Through kabel"}, {"e": "3️⃣", "text": "Desktop → IP Configuration"}, {"e": "4️⃣", "text": "Command Prompt → ping"}, {"e": "5️⃣", "text": "Simulation rejimi"}]}, {"t": "code", "title": "Tekshirish", "code": "C:\\>ping 192.168.10.4\nC:\\>arp -a\nSwitch>enable\nSwitch#show mac address-table"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Birinchi ping so'rovi 'Request timed out' bo'ldi, keyingilari muvaffaqiyatli. Sabab?", "options": ["ARP manzilni aniqlayotgan edi", "DNS", "Kabel nosoz", "Brandmauer"], "answer": 0, "explain": "Birinchi paket ARP javobini kutib qoladi."}, {"t": "compare", "title": "Rejimlar", "left": {"label": "Realtime", "text": "Hammasi darhol, haqiqiy vaqtda"}, "right": {"label": "Simulation", "text": "Paketlar qadamma-qadam, pog'onalar ko'rinadi"}}, {"t": "summary", "title": "Hisobot", "items": ["Sxema skrinshoti", "Ping natijasi", "OSI Model oynasi", "MAC jadvali"]}]$j$::jsonb,
  2, 15, 30, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('b07ce58f-de8f-53f8-a5be-1a922a02ca98', '0b31b935-71ce-5e09-b671-4fb7c28cbc84', '28c80092-c50d-5a3f-94b7-de3f7cdf75c7', '2b61efd0-002d-54fe-83a3-aff7339fc640', '69a86e25-d277-55c3-b036-3002f80e58eb', '6e5a63ef-3bfd-59d7-83d3-4eb57e97d16b');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('b07ce58f-de8f-53f8-a5be-1a922a02ca98', t, $kt$Packet Tracer da kompyuterni kommutatorga qaysi kabel bilan ulanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Crossover", "is_correct": false}, {"id": "b", "text": "Straight-Through", "is_correct": true}, {"id": "c", "text": "Console", "is_correct": false}, {"id": "d", "text": "Serial", "is_correct": false}]$j$::jsonb,
   $kt$Turli turdagi qurilmalar — to'g'ri kabel.$kt$, 1, 0),
  ('0b31b935-71ce-5e09-b671-4fb7c28cbc84', t, $kt$Paketni pog'onama-pog'ona ko'rish uchun qaysi rejim?$kt$, 'single',
   $j$[{"id": "a", "text": "Realtime", "is_correct": false}, {"id": "b", "text": "Physical", "is_correct": false}, {"id": "c", "text": "Logical", "is_correct": false}, {"id": "d", "text": "Simulation", "is_correct": true}]$j$::jsonb,
   $kt$Simulation + Event List.$kt$, 1, 1),
  ('28c80092-c50d-5a3f-94b7-de3f7cdf75c7', t, $kt$Kommutatorning MAC jadvalini ko'rish buyrug'i?$kt$, 'single',
   $j$[{"id": "a", "text": "ipconfig", "is_correct": false}, {"id": "b", "text": "show running-config", "is_correct": false}, {"id": "c", "text": "show mac address-table", "is_correct": true}, {"id": "d", "text": "show ip route", "is_correct": false}]$j$::jsonb,
   $kt$Privilegiyali rejimda.$kt$, 1, 2),
  ('2b61efd0-002d-54fe-83a3-aff7339fc640', t, $kt$Kompyuterga IP qayerda beriladi (Packet Tracer)?$kt$, 'single',
   $j$[{"id": "a", "text": "Desktop → IP Configuration", "is_correct": true}, {"id": "b", "text": "Config → Global", "is_correct": false}, {"id": "c", "text": "Physical", "is_correct": false}, {"id": "d", "text": "Attributes", "is_correct": false}]$j$::jsonb,
   $kt$Yoki Config → FastEthernet0.$kt$, 1, 3),
  ('69a86e25-d277-55c3-b036-3002f80e58eb', t, $kt$PC0 (192.168.1.10/24) va PC2 (192.168.1.200/25) ping qila oladimi?$kt$, 'single',
   $j$[{"id": "a", "text": "Faqat broadcast", "is_correct": false}, {"id": "b", "text": "Ha", "is_correct": false}, {"id": "c", "text": "Yo'q — maskalar va tarmoq qismlari mos emas", "is_correct": true}, {"id": "d", "text": "Faqat bir tomonga", "is_correct": false}]$j$::jsonb,
   $kt$PC2 o'zini 192.168.1.128/25 tarmog'ida deb hisoblaydi.$kt$, 1, 4),
  ('6e5a63ef-3bfd-59d7-83d3-4eb57e97d16b', t, $kt$Qaysilar tarmoq emulyatorlari?$kt$, 'multiple',
   $j$[{"id": "a", "text": "GNS3", "is_correct": true}, {"id": "b", "text": "Microsoft Word", "is_correct": false}, {"id": "c", "text": "Cisco Packet Tracer", "is_correct": true}, {"id": "d", "text": "EVE-NG", "is_correct": true}]$j$::jsonb,
   $kt$Word — matn muharriri.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('ba74ec26-83a0-5933-a355-7ca3c5968f78', '8527871d-2baf-51f9-aad4-c1a25041d9d3');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('ba74ec26-83a0-5933-a355-7ca3c5968f78', t, $kt$2-laboratoriya hisoboti$kt$, $kt$Packet Tracer da 4 kompyuterli LAN ni yig'ing, sozlang va tekshiring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["Brauzerdagi mini-emulyatorda 3 ta PC ga IP berib, ping qildim", "Packet Tracer da 2960 kommutator va 4 ta PC qo'ydim va uladim", "Kompyuterlarga 192.168.10.1–4/24 manzillarini berdim", "PC0 dan PC3 ga muvaffaqiyatli ping qildim", "Simulation rejimida ARP va ICMP paketlarini kuzatdim", "show mac address-table natijasini oldim", "Faylni lab2_familiya.pkt sifatida saqladim"], "prompt": "Birinchi ping nega javobsiz qolishi mumkinligini, Simulation rejimida ARP so'rovi va javobi qanday harakatlanganini va MAC jadvalida nima ko'rganingizni yozing.", "min_images": 3, "max_images": 5, "min_chars": 150}$j$::jsonb),
  ('8527871d-2baf-51f9-aad4-c1a25041d9d3', t, $kt$Mini-emulyator natijalari$kt$, $kt$Brauzerdagi mini-emulyatorda tajriba qiling.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Javob yo'li ham kerak: PC2 javobni o'z tarmog'ida deb hisoblamaydi."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "PC0 (192.168.1.10/24) → PC2 (192.168.1.200/25): ping o'tadimi?", "type": "choice", "accept": ["Yo'q"], "options": ["Ha", "Yo'q"]}, {"label": "PC2 ning /25 maskasida tarmoq manzili", "type": "ip", "accept": ["192.168.1.128"]}, {"label": "Ikkalasini /24 qilsak, ping o'tadimi?", "type": "choice", "accept": ["Ha"], "options": ["Ha", "Yo'q"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 3. 3-laboratoriya ishi: Berilganlarni kodlash usullari
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$3-laboratoriya ishi: Berilganlarni kodlash usullari$kt$, 'kt-l03-kodlash',
$kt$<h2>Ishning maqsadi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Kodlash usullari", "subtitle": "3-laboratoriya ishi", "emoji": "〰️"}, {"t": "code", "title": "Variant", "code": "N = 13 → 00001101\n+ 0110 → 000011010110"}, {"t": "table", "title": "Konventsiya", "head": ["Kod", "Qoida"], "rows": [["NRZ-L", "1 — yuqori"], ["NRZI", "1 — o'tish"], ["Manchester", "0 ↓, 1 ↑ o'rtada"], ["AMI", "1 — +/− navbat"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "00000000 ketma-ketligida qaysi kod sinxronizatsiyani saqlaydi?", "options": ["NRZI", "AMI", "Manchester", "NRZ-L"], "answer": 2, "explain": "Har bit o'rtasida o'tish bor."}, {"t": "idea", "title": "Narx", "text": "Manchester o'z-o'zini sinxronlaydi, lekin 2 baravar keng polosa talab qiladi. 4B/5B esa 25% ortiqcha bit bilan muammoni hal qiladi.", "emoji": "⚖️"}, {"t": "summary", "title": "Hisobot", "items": ["4 ta signal shakli (qo'lda)", "Simulyatsiya skrinshoti", "Natijalar jadvali"]}]$j$::jsonb,
  3, 15, 30, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('b9e1ee66-c61a-52b0-96dc-378c1e03b60f', '8ebe6ecd-f16c-5ae6-84df-849230089be0', 'bd3ea613-4598-5cc2-bdbf-4fcc3037a08e', '69a6115d-5640-5b8b-ba1c-a845364f0064', '63bab60d-9f13-5fbb-80a2-a43a22da79d8', '402baf6b-4817-5bab-9092-373ea7a5c0aa');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('b9e1ee66-c61a-52b0-96dc-378c1e03b60f', t, $kt$NRZI da 1011 uchun nechta o'tish bor?$kt$, 'single',
   $j$[{"id": "a", "text": "2", "is_correct": false}, {"id": "b", "text": "4", "is_correct": false}, {"id": "c", "text": "1", "is_correct": false}, {"id": "d", "text": "3", "is_correct": true}]$j$::jsonb,
   $kt$1 lar soni — 3.$kt$, 1, 0),
  ('8ebe6ecd-f16c-5ae6-84df-849230089be0', t, $kt$Manchester da 8 bit uchun kamida nechta o'tish?$kt$, 'single',
   $j$[{"id": "a", "text": "0", "is_correct": false}, {"id": "b", "text": "16", "is_correct": false}, {"id": "c", "text": "8", "is_correct": true}, {"id": "d", "text": "4", "is_correct": false}]$j$::jsonb,
   $kt$Har bit o'rtasida bittadan.$kt$, 1, 1),
  ('bd3ea613-4598-5cc2-bdbf-4fcc3037a08e', t, $kt$AMI da 1 lar qanday kodlanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Ikki o'tish", "is_correct": false}, {"id": "b", "text": "Nol sath", "is_correct": false}, {"id": "c", "text": "Doim +", "is_correct": false}, {"id": "d", "text": "Navbat bilan + va −", "is_correct": true}]$j$::jsonb,
   $kt$Bipolyar kod.$kt$, 1, 2),
  ('69a6115d-5640-5b8b-ba1c-a845364f0064', t, $kt$4B/5B da 4 bayt (32 bit) uchun nechta bit uzatiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "32", "is_correct": false}, {"id": "b", "text": "40", "is_correct": true}, {"id": "c", "text": "64", "is_correct": false}, {"id": "d", "text": "36", "is_correct": false}]$j$::jsonb,
   $kt$32 × 5/4 = 40.$kt$, 1, 3),
  ('63bab60d-9f13-5fbb-80a2-a43a22da79d8', t, $kt$Uzun 1 lar ketma-ketligida NRZ-L ning muammosi?$kt$, 'single',
   $j$[{"id": "a", "text": "Tezlik oshadi", "is_correct": false}, {"id": "b", "text": "Hech qanday", "is_correct": false}, {"id": "c", "text": "Shovqin", "is_correct": false}, {"id": "d", "text": "Sath o'zgarmaydi — sinxronizatsiya yo'qoladi", "is_correct": true}]$j$::jsonb,
   $kt$Qabul qiluvchi bit chegaralarini yo'qotadi.$kt$, 1, 4),
  ('402baf6b-4817-5bab-9092-373ea7a5c0aa', t, $kt$Qaysi kodlar uzun nollar ketma-ketligida sinxronizatsiyani yo'qotadi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "NRZ-L", "is_correct": true}, {"id": "b", "text": "AMI", "is_correct": true}, {"id": "c", "text": "Manchester", "is_correct": false}, {"id": "d", "text": "NRZI", "is_correct": true}]$j$::jsonb,
   $kt$Manchester har bitda o'tish qiladi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('ee0151d0-a1ce-533c-96ae-8156276dd6b7', 'f88e0ddc-fdda-538e-b2e9-e88504dbf70c');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('ee0151d0-a1ce-533c-96ae-8156276dd6b7', t, $kt$3-laboratoriya hisoboti$kt$, $kt$O'z variantingiz uchun signal shakllarini chizing va simulyatsiya bilan tekshiring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["Variant ketma-ketligini hosil qildim (N + 0110)", "NRZ-L, NRZI, Manchester va AMI shakllarini qo'lda chizdim", "Har birini simulyatsiyada tekshirdim", "Natijalar jadvalini to'ldirdim", "00000000 va 11111111 da kodlarni solishtirdim", "4B/5B kodlarini yozdim va ortiqchalikni hisobladim"], "prompt": "Variant raqamingiz va ketma-ketlikni yozing. Qaysi kod sinxronizatsiya uchun eng yaxshi va qaysi biri polosani tejaydi — natijalaringiz asosida asoslang.", "min_images": 2, "max_images": 5, "min_chars": 150}$j$::jsonb),
  ('f88e0ddc-fdda-538e-b2e9-e88504dbf70c', t, $kt$Tekshiruv$kt$, $kt$Ketma-ketlik: 101100111000.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "NRZI dagi o'tishlar soni", "type": "number", "accept": ["6"]}, {"label": "NRZ-L da qo'shni bitlar orasidagi o'tishlar", "type": "number", "accept": ["5"]}, {"label": "4B/5B dan keyin bitlar soni", "type": "number", "accept": ["15"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 4. 4-laboratoriya ishi: Ethernet va Fast Ethernet. Tarmoq snifferi (Wireshark) yordamida paketlarni tahlil qilish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$4-laboratoriya ishi: Ethernet va Fast Ethernet. Tarmoq snifferi (Wireshark) yordamida paketlarni tahlil qilish$kt$, 'kt-l04-wireshark',
$kt$<h2>Ishning maqsadi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Wireshark bilan tahlil", "subtitle": "4-laboratoriya ishi", "emoji": "🦈"}, {"t": "table", "title": "Displey filtrlari", "head": ["Filtr", "Nima"], "rows": [["arp", "ARP"], ["dns", "DNS"], ["tcp.flags.syn == 1", "Ulanish boshlari"], ["ip.addr == 8.8.8.8", "Shu manzil bilan"], ["http", "Ochiq HTTP"], ["tls", "Shifrlangan"]]}, {"t": "points", "title": "Ish rejasi", "items": [{"e": "▶️", "text": "Interfeysni tanlab ushlash"}, {"e": "🧹", "text": "flushdns, arp -d *"}, {"e": "📡", "text": "ping va saytlarni ochish"}, {"e": "⏹️", "text": "To'xtatib, saqlash"}, {"e": "🔎", "text": "Filtrlar bilan tahlil"}]}, {"t": "quiz", "title": "Tekshiramiz", "question": "HTTPS da sniffer nimani ko'radi?", "options": ["Server nomi (SNI) va IP lar", "Sahifa matni", "Hech narsa", "Login va parol"], "answer": 0, "explain": "Mazmun shifrlangan, ulanish ma'lumotlari ko'rinadi."}, {"t": "idea", "title": "Odob qoidasi", "text": "Faqat o'z kompyuteringiz yoki ruxsat berilgan tarmoqda ushlang.", "emoji": "⚖️"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Kommutatorli tarmoqda boshqa kompyuter trafigini nega ko'rmaysiz?", "options": ["Trafik shifrlangan", "IP boshqa", "Kommutator kadrni faqat kerakli portga yuboradi", "Wireshark taqiqlaydi"], "answer": 2, "explain": "Faqat o'zingizga, broadcast va multicast kadrlar keladi."}, {"t": "summary", "title": "Hisobot", "items": ["ARP, DNS, TCP, HTTP skrinshotlari", "HTTP va TLS farqi", "Protocol Hierarchy"]}]$j$::jsonb,
  4, 15, 30, 90, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('d6bab804-1bcf-53d6-bd8a-a6319d195f23', 'b0c8ab81-dbd8-5a49-80f6-4a2ccf698c63', '96ca6e7e-b8af-5a8f-b09c-ab1ef1a5f9c3', '47b2f2c1-a5f8-5a9c-b927-45318ad5d693', 'c4a73ce0-fc32-5675-aa47-1acdc9783883', '955c3995-e10f-52b6-85e4-381c086a3702');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('d6bab804-1bcf-53d6-bd8a-a6319d195f23', t, $kt$Wireshark Windows'da paket ushlash uchun qaysi drayverdan foydalanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "NDIS Lite", "is_correct": false}, {"id": "b", "text": "DirectX", "is_correct": false}, {"id": "c", "text": "Npcap", "is_correct": true}, {"id": "d", "text": "WinPE", "is_correct": false}]$j$::jsonb,
   $kt$O'rnatishda Npcap ham o'rnatiladi.$kt$, 1, 0),
  ('b0c8ab81-dbd8-5a49-80f6-4a2ccf698c63', t, $kt$Faqat DNS paketlarini ko'rsatuvchi filtr?$kt$, 'single',
   $j$[{"id": "a", "text": "port dns", "is_correct": false}, {"id": "b", "text": "show dns", "is_correct": false}, {"id": "c", "text": "dns", "is_correct": true}, {"id": "d", "text": "udp.dns", "is_correct": false}]$j$::jsonb,
   $kt$Displey filtri: dns.$kt$, 1, 1),
  ('96ca6e7e-b8af-5a8f-b09c-ab1ef1a5f9c3', t, $kt$ARP kadrining EtherType qiymati?$kt$, 'single',
   $j$[{"id": "a", "text": "0x86DD", "is_correct": false}, {"id": "b", "text": "0x8100", "is_correct": false}, {"id": "c", "text": "0x0806", "is_correct": true}, {"id": "d", "text": "0x0800", "is_correct": false}]$j$::jsonb,
   $kt$0x0806.$kt$, 1, 2),
  ('47b2f2c1-a5f8-5a9c-b927-45318ad5d693', t, $kt$TLS Client Hello da ochiq ketadigan maydon?$kt$, 'single',
   $j$[{"id": "a", "text": "SNI (sayt nomi)", "is_correct": true}, {"id": "b", "text": "Parol", "is_correct": false}, {"id": "c", "text": "HTML", "is_correct": false}, {"id": "d", "text": "Cookie", "is_correct": false}]$j$::jsonb,
   $kt$Server Name Indication.$kt$, 1, 3),
  ('c4a73ce0-fc32-5675-aa47-1acdc9783883', t, $kt$TCP ulanish boshlanishini topish filtri?$kt$, 'single',
   $j$[{"id": "a", "text": "syn", "is_correct": false}, {"id": "b", "text": "tcp.fin", "is_correct": false}, {"id": "c", "text": "tcp.port == 0", "is_correct": false}, {"id": "d", "text": "tcp.flags.syn == 1", "is_correct": true}]$j$::jsonb,
   $kt$SYN bayrog'i o'rnatilgan segmentlar.$kt$, 1, 4),
  ('955c3995-e10f-52b6-85e4-381c086a3702', t, $kt$Qaysi trafik Wireshark da ochiq matnda ko'rinadi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "HTTP", "is_correct": true}, {"id": "b", "text": "Telnet", "is_correct": true}, {"id": "c", "text": "HTTPS mazmuni", "is_correct": false}, {"id": "d", "text": "DNS (oddiy)", "is_correct": true}]$j$::jsonb,
   $kt$HTTPS mazmuni shifrlangan.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('533c6616-fe43-5610-a7eb-7506cc5466b5', 'c399b680-198c-504f-abb6-4afd8a9be574');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('533c6616-fe43-5610-a7eb-7506cc5466b5', t, $kt$4-laboratoriya hisoboti$kt$, $kt$O'z kompyuteringizda trafikni ushlang va tahlil qiling.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["Simulyatsiyada filtrlarni mashq qildim", "Wireshark da trafikni ushladim va .pcapng faylini saqladim", "ARP so'rov va javobini topdim (skrinshot)", "DNS so'rov va javobini topdim (skrinshot)", "TCP uch bosqichli ulanishni topdim (skrinshot)", "HTTP GET va 200 OK ni ko'rdim (skrinshot)", "TLS Client Hello dagi SNI ni aniqladim", "Protocol Hierarchy statistikasini oldim"], "prompt": "Shlyuzingizning MAC manzili, DNS server manzili va miracademy.uz IP manzilini yozing. HTTP va HTTPS paketlarida nimani ko'rdingiz va nimani ko'ra olmadingiz?", "min_images": 4, "max_images": 6, "min_chars": 200}$j$::jsonb),
  ('c399b680-198c-504f-abb6-4afd8a9be574', t, $kt$Simulyatsiyadagi ushlash$kt$, $kt$Mavzu sahifasidagi paket tahlilchisidan foydalaning.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Filtrlar: arp, dns, icmp, http."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Shlyuzning MAC manzili", "type": "text", "accept": ["3c:84:6a:11:0f:20", "3C-84-6A-11-0F-20", "3c-84-6a-11-0f-20"]}, {"label": "miracademy.uz qaysi IP ga aylangan?", "type": "ip", "accept": ["76.76.21.21"]}, {"label": "ping 8.8.8.8 javobidagi TTL", "type": "number", "accept": ["117"]}, {"label": "HTTP GET so'rovidagi Host sarlavhasi", "type": "text", "accept": ["example.com"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 5. 5-laboratoriya ishi: Simsiz axborot uzatish texnologiyalari. Wi-Fi tarmog'ini sozlash
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$5-laboratoriya ishi: Simsiz axborot uzatish texnologiyalari. Wi-Fi tarmog'ini sozlash$kt$, 'kt-l05-wifi',
$kt$<h2>Ishning maqsadi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Wi-Fi ni sozlash", "subtitle": "5-laboratoriya ishi", "emoji": "📶"}, {"t": "code", "title": "Holatni ko'rish", "code": "netsh wlan show interfaces\nnetsh wlan show networks mode=bssid", "output": "SSID       : KT-Lab\nRadio type : 802.11ax\nChannel    : 6\nSignal     : 87%"}, {"t": "points", "title": "Xavfsiz sozlamalar", "items": [{"e": "🔑", "text": "Admin parolini o'zgartirish"}, {"e": "🔒", "text": "WPA2-AES yoki WPA3"}, {"e": "📏", "text": "Parol ≥ 12 belgi"}, {"e": "📡", "text": "Kanal 1 / 6 / 11"}, {"e": "🚫", "text": "WPS o'chiq"}, {"e": "👥", "text": "Mehmon tarmog'i"}]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Qo'shni routerlar 1 va 6-kanalda. Siz qaysini tanlaysiz?", "options": ["3", "6", "11", "1"], "answer": 2, "explain": "Bir-birini qoplamaydigan va bo'sh kanal."}, {"t": "idea", "title": "SSID yashirish", "text": "Himoya emas: tarmoq nomi ulanish so'rovlarida baribir ochiq ketadi. Ishonchli himoya — WPA2/WPA3 va kuchli parol.", "emoji": "🙈"}, {"t": "summary", "title": "Hisobot", "items": ["netsh natijalari (oldin/keyin)", "Router sozlamalari", "Kanal tahlili"]}]$j$::jsonb,
  5, 15, 30, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('6e19d011-0867-5a50-84d5-f9230dd6472b', '4b5d366a-2e56-5bed-9921-b420c27ed964', 'c4675168-5c9e-5f50-bb8b-d44eba5a7ac1', 'bad616fe-4688-57ad-a2f9-c32e2ab76f3d', 'd8f81079-93d1-5cf2-8c2e-7726056c25f2', '3445487c-e2d2-5448-bf9b-03d35c36c1fd');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('6e19d011-0867-5a50-84d5-f9230dd6472b', t, $kt$Ulangan Wi-Fi tarmoq kanalini qaysi buyruq ko'rsatadi?$kt$, 'single',
   $j$[{"id": "a", "text": "ipconfig", "is_correct": false}, {"id": "b", "text": "netsh wlan show interfaces", "is_correct": true}, {"id": "c", "text": "tracert", "is_correct": false}, {"id": "d", "text": "arp -a", "is_correct": false}]$j$::jsonb,
   $kt$Kanal, signal, radio turi.$kt$, 1, 0),
  ('4b5d366a-2e56-5bed-9921-b420c27ed964', t, $kt$Eng ishonchli shifrlash?$kt$, 'single',
   $j$[{"id": "a", "text": "WPA-TKIP", "is_correct": false}, {"id": "b", "text": "WPA3", "is_correct": true}, {"id": "c", "text": "WEP", "is_correct": false}, {"id": "d", "text": "WPA2-AES", "is_correct": false}]$j$::jsonb,
   $kt$WPA3 SAE — parolni oflayn tanlashdan himoya.$kt$, 1, 1),
  ('c4675168-5c9e-5f50-bb8b-d44eba5a7ac1', t, $kt$WPS ni nega o'chirish kerak?$kt$, 'single',
   $j$[{"id": "a", "text": "Kanalni band qiladi", "is_correct": false}, {"id": "b", "text": "PIN orqali tez buzilishi mumkin", "is_correct": true}, {"id": "c", "text": "Tezlikni pasaytiradi", "is_correct": false}, {"id": "d", "text": "Kerak emas", "is_correct": false}]$j$::jsonb,
   $kt$8 xonali PIN ikki qismda tekshiriladi va tanlab topiladi.$kt$, 1, 2),
  ('bad616fe-4688-57ad-a2f9-c32e2ab76f3d', t, $kt$BSSID nima?$kt$, 'single',
   $j$[{"id": "a", "text": "Parol", "is_correct": false}, {"id": "b", "text": "Kanal raqami", "is_correct": false}, {"id": "c", "text": "Tarmoq nomi", "is_correct": false}, {"id": "d", "text": "Kirish nuqtasi radiomodulining MAC manzili", "is_correct": true}]$j$::jsonb,
   $kt$SSID — nom, BSSID — AP MAC.$kt$, 1, 3),
  ('d8f81079-93d1-5cf2-8c2e-7726056c25f2', t, $kt$Packet Tracer da noutbukka Wi-Fi modul o'rnatishdan oldin nima qilinadi?$kt$, 'single',
   $j$[{"id": "a", "text": "IP beriladi", "is_correct": false}, {"id": "b", "text": "Qurilma quvvati o'chiriladi", "is_correct": true}, {"id": "c", "text": "Router o'chiriladi", "is_correct": false}, {"id": "d", "text": "SSID yoziladi", "is_correct": false}]$j$::jsonb,
   $kt$Modul faqat o'chiq qurilmaga o'rnatiladi.$kt$, 1, 4),
  ('3445487c-e2d2-5448-bf9b-03d35c36c1fd', t, $kt$Qaysilar simsiz tarmoq xavfsizligini oshiradi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Kuchli parol", "is_correct": true}, {"id": "b", "text": "WPS ni yoqish", "is_correct": false}, {"id": "c", "text": "WPA3", "is_correct": true}, {"id": "d", "text": "Mehmon tarmog'ini ajratish", "is_correct": true}]$j$::jsonb,
   $kt$WPS xavfli.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('f7fb5d8a-efba-5f4e-a5bc-2cebbed246d4', '220b090c-7950-5b34-b9cb-e1e6bfe7fb6b');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('f7fb5d8a-efba-5f4e-a5bc-2cebbed246d4', t, $kt$5-laboratoriya hisoboti$kt$, $kt$Simsiz routerni sozlang (real yoki Packet Tracer) va natijani hujjatlashtiring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["netsh wlan show interfaces bilan joriy holatni yozib oldim", "Atrofdagi tarmoqlar va kanallarni aniqladim", "Admin parolini o'zgartirdim", "SSID va WPA2/WPA3 shifrlashni sozladim", "Bo'sh kanalni (1/6/11) tanladim", "WPS ni o'chirdim", "Qayta ulanib, natijani tekshirdim", "Simulyatsiyada kanal rejasi va xavfsizlik bahosini oshirdim"], "prompt": "Qaysi kanalni tanladingiz va nima uchun (atrofdagi tarmoqlar asosida)? Qaysi xavfsizlik sozlamalarini qo'lladingiz? Skrinshotlarda parollar ko'rinmasin.", "min_images": 2, "max_images": 5, "min_chars": 150}$j$::jsonb),
  ('220b090c-7950-5b34-b9cb-e1e6bfe7fb6b', t, $kt$Kanal tanlash$kt$, $kt$Analizator ko'rsatdi: 1-kanalda 5 ta tarmoq, 6-kanalda 2 ta, 11-kanalda 4 ta, 3-kanalda 1 ta.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Kanal n spektri n−4 … n+4 kanallarni qoplaydi (taxminan)."}, {"order": 2, "text": "3-kanal tanlanmaydi — u 1 va 6 ikkalasiga ham xalaqit beradi."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Qaysi kanalni tanlaysiz?", "type": "choice", "accept": ["6"], "options": ["1", "3", "6", "11"]}, {"label": "3-kanaldagi tarmoq qaysi kanallar bilan qoplanadi? Eng kichigi", "type": "number", "accept": ["1"]}, {"label": "…va eng kattasi", "type": "number", "accept": ["7"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

END $mig$;
