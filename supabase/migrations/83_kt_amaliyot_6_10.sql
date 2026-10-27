-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: Amaliy mashg'ulotlar 6–10
--
-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
-- Manba: scripts/kontent/kompyuter-tarmoqlari/a06_10.py
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
  SELECT id INTO v_course FROM courses WHERE slug = 'kompyuter-tarmoqlari-amaliyot';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: kompyuter-tarmoqlari-amaliyot. Avval 78_kompyuter_tarmoqlari_infra.sql ni ishga tushiring.';
  END IF;

  -- ============================================================
  -- 6. 6-amaliy mashg'ulot: Ethernet kadri va MAC manzillarni tahlil qilish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$6-amaliy mashg'ulot: Ethernet kadri va MAC manzillarni tahlil qilish$kt$, 'kt-a06-ethernet-kadr',
$kt$<h2>Mashg'ulot maqsadi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Ethernet kadri tahlili", "subtitle": "6-amaliy mashg'ulot", "emoji": "🔍"}, {"t": "table", "title": "Birinchi bayt bitlari", "head": ["Bit", "0", "1"], "rows": [["I/G (b0)", "unicast", "multicast"], ["U/L (b1)", "global", "lokal"]]}, {"t": "code", "title": "Sarlavhani o'qish", "code": "ff ff ff ff ff ff | d4 5d 64 a2 19 7c | 08 06\nmanzil (broadcast) | manba            | ARP"}, {"t": "table", "title": "EtherType", "head": ["Qiymat", "Protokol"], "rows": [["0x0800", "IPv4"], ["0x0806", "ARP"], ["0x86DD", "IPv6"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "01-00-5E-7F-00-01 qanday manzil?", "options": ["Unicast", "Multicast", "Broadcast", "Lokal unicast"], "answer": 1, "explain": "Birinchi bayt 0x01 — I/G bit 1."}, {"t": "points", "title": "Switch qoidasi", "items": [{"e": "📝", "text": "Manba MAC → jadval"}, {"e": "🎯", "text": "Manzil ma'lum → bitta port"}, {"e": "📢", "text": "Noma'lum yoki broadcast → qolgan hamma port"}]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Bo'sh jadval: A→C, keyin C→A. Ikkinchi kadr nechta portga yuboriladi?", "options": ["2", "3", "1", "4"], "answer": 2, "explain": "Birinchi kadrda A o'rganilgan — faqat 1-port."}, {"t": "summary", "title": "Xulosa", "items": ["b0 — unicast/multicast, b1 — global/lokal", "EtherType — ichidagi protokol", "Jadval manba MAC dan to'ladi"]}]$j$::jsonb,
  6, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('db9958ec-a243-5095-a1b8-82e0d907f199', '511aa725-fe07-5d75-9cf9-cf8859b9ccd2', 'bb6a4fef-00cd-5d48-a6b0-0d7564df2fcf', '55572890-648a-59f3-8e1a-edfcce1fb53a', '0d5d2685-9b17-5391-8ca6-90448d1845cc', 'd6602d28-a5f5-5cc1-b552-4d8df356031f');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('db9958ec-a243-5095-a1b8-82e0d907f199', t, $kt$D4-5D-64-A2-19-7C manzilning OUI qismi?$kt$, 'single',
   $j$[{"id": "a", "text": "D4-5D-64", "is_correct": true}, {"id": "b", "text": "A2-19-7C", "is_correct": false}, {"id": "c", "text": "64-A2-19", "is_correct": false}, {"id": "d", "text": "D4-5D", "is_correct": false}]$j$::jsonb,
   $kt$Birinchi 3 bayt.$kt$, 1, 0),
  ('511aa725-fe07-5d75-9cf9-cf8859b9ccd2', t, $kt$02-42-AC-11-00-02 qanday manzil?$kt$, 'single',
   $j$[{"id": "a", "text": "Global unicast", "is_correct": false}, {"id": "b", "text": "Global multicast", "is_correct": false}, {"id": "c", "text": "Broadcast", "is_correct": false}, {"id": "d", "text": "Lokal berilgan unicast", "is_correct": true}]$j$::jsonb,
   $kt$0x02: b0 = 0 (unicast), b1 = 1 (lokal).$kt$, 1, 1),
  ('bb6a4fef-00cd-5d48-a6b0-0d7564df2fcf', t, $kt$EtherType 0x86DD?$kt$, 'single',
   $j$[{"id": "a", "text": "ARP", "is_correct": false}, {"id": "b", "text": "IPv6", "is_correct": true}, {"id": "c", "text": "VLAN", "is_correct": false}, {"id": "d", "text": "IPv4", "is_correct": false}]$j$::jsonb,
   $kt$IPv6.$kt$, 1, 2),
  ('55572890-648a-59f3-8e1a-edfcce1fb53a', t, $kt$Kommutator jadvalga qaysi manzilni yozadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Manzil MAC", "is_correct": false}, {"id": "b", "text": "Manba IP", "is_correct": false}, {"id": "c", "text": "Manba MAC", "is_correct": true}, {"id": "d", "text": "Manzil IP", "is_correct": false}]$j$::jsonb,
   $kt$O'rganish manba manzildan.$kt$, 1, 3),
  ('0d5d2685-9b17-5391-8ca6-90448d1845cc', t, $kt$Broadcast kadrni kommutator qayerga yuboradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Faqat 1-portga", "is_correct": false}, {"id": "b", "text": "Marshrutizatorga", "is_correct": false}, {"id": "c", "text": "Kelgan portdan tashqari hamma portga", "is_correct": true}, {"id": "d", "text": "Hech qayerga", "is_correct": false}]$j$::jsonb,
   $kt$Broadcast domeni butun kommutator.$kt$, 1, 4),
  ('d6602d28-a5f5-5cc1-b552-4d8df356031f', t, $kt$Qaysi manzillar guruh (multicast/broadcast) manzili?$kt$, 'multiple',
   $j$[{"id": "a", "text": "01-00-5E-00-00-01", "is_correct": true}, {"id": "b", "text": "33-33-00-00-00-01", "is_correct": true}, {"id": "c", "text": "00-1A-2B-3C-4D-5E", "is_correct": false}, {"id": "d", "text": "FF-FF-FF-FF-FF-FF", "is_correct": true}]$j$::jsonb,
   $kt$0x33 = 0011 0011 — b0 = 1 (IPv6 multicast).$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('69747127-bb70-50d0-a322-2cfc734d30ec', '18a84cc4-4d18-583f-bb40-cd3f1e5bc66e', '36de8ae0-0dc6-58b0-8954-6bfa89ab9428');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('69747127-bb70-50d0-a322-2cfc734d30ec', t, $kt$Sarlavhani o'qing$kt$, $kt$Kadr boshidagi baytlar: 3c 84 6a 11 0f 20 d4 5d 64 a2 19 7c 08 00$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Birinchi 6 bayt — manzil, keyingi 6 — manba, keyin 2 bayt EtherType."}]$j$::jsonb, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Manzil MAC (xx-xx-… ko'rinishida)", "type": "text", "accept": ["3C-84-6A-11-0F-20", "3c:84:6a:11:0f:20", "3c-84-6a-11-0f-20"]}, {"label": "Manba MAC ning OUI qismi", "type": "text", "accept": ["D4-5D-64", "d4:5d:64"]}, {"label": "Ichidagi protokol", "type": "choice", "accept": ["IPv4"], "options": ["IPv4", "ARP", "IPv6"]}, {"label": "Manzil MAC turi", "type": "choice", "accept": ["unicast"], "options": ["unicast", "multicast", "broadcast"]}]}$j$::jsonb, NULL),
  ('18a84cc4-4d18-583f-bb40-cd3f1e5bc66e', t, $kt$MAC jadvalini to'ldiring$kt$, $kt$4 portli kommutator, jadval bo'sh. A — 1, B — 2, C — 3, D — 4-portda. Ketma-ket kadrlar: (1) B→D, (2) D→B, (3) A→D, (4) C→A.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Har kadrda avval manba yoziladi, keyin manzil qidiriladi."}, {"order": 2, "text": "(3) da D allaqachon (2) dan ma'lum."}]$j$::jsonb, 'medium', 5, 15, 1,
   'answer', $j${"fields": [{"label": "(1) kadr nechta portga yuboriladi?", "type": "number", "accept": ["3"]}, {"label": "(2) kadr nechta portga yuboriladi?", "type": "number", "accept": ["1"]}, {"label": "(3) kadr nechta portga yuboriladi?", "type": "number", "accept": ["1"]}, {"label": "(4) kadrdan keyin jadvalda nechta yozuv bor?", "type": "number", "accept": ["4"]}]}$j$::jsonb, NULL),
  ('36de8ae0-0dc6-58b0-8954-6bfa89ab9428', t, $kt$MAC manzil turi$kt$, $kt$MAC manzil kiritiladi (ajratuvchi '-' yoki ':'). Ikki qatorda chiqaring:
1) OUI — katta harflar, '-' bilan (masalan D4-5D-64);
2) turi: 'broadcast' (hammasi FF), aks holda 'multicast' yoki 'unicast', bo'sh joy va 'global' yoki 'lokal'.
Masalan: 02:42:ac:11:00:02 → 02-42-AC va unicast lokal$kt$,
   NULL,
   $kt$mac = input().strip()
# Kodingizni shu yerga yozing
$kt$, $kt$mac = input().strip().replace(':', '-').upper()
b = mac.split('-')
print('-'.join(b[:3]))
if all(x == 'FF' for x in b):
    print('broadcast')
else:
    f = int(b[0], 16)
    t = 'multicast' if f & 1 else 'unicast'
    s = 'lokal' if f & 2 else 'global'
    print(t + ' ' + s)$kt$, 'python',
   $j$[{"input": "02:42:ac:11:00:02", "expected_output": "02-42-AC\nunicast lokal", "is_hidden": false}, {"input": "D4-5D-64-A2-19-7C", "expected_output": "D4-5D-64\nunicast global", "is_hidden": false}, {"input": "ff:ff:ff:ff:ff:ff", "expected_output": "FF-FF-FF\nbroadcast", "is_hidden": true}, {"input": "01-00-5E-00-00-FB", "expected_output": "01-00-5E\nmulticast global", "is_hidden": true}, {"input": "33:33:00:00:00:01", "expected_output": "33-33-00\nmulticast lokal", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "int('d4', 16) — o'n oltilikdan songa."}, {"order": 2, "text": "f & 1 — I/G bit, f & 2 — U/L bit."}]$j$::jsonb, 'medium', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 7. 7-amaliy mashg'ulot: IPv4 manzillar. Ikkilik ko'rinish, sinflar, maska bilan ishlash
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$7-amaliy mashg'ulot: IPv4 manzillar. Ikkilik ko'rinish, sinflar, maska bilan ishlash$kt$, 'kt-a07-ipv4',
$kt$<h2>Mashg'ulot maqsadi</h2>
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
  <tr><td>192.168.37.140</td><td>C</td><td>255.255.255.0</td><td>192.168.37.0</td><td>192.168.37.255</td><td>254</td></tr>
  <tr><td>10.150.77.9</td><td>A</td><td>255.0.0.0</td><td>10.0.0.0</td><td>10.255.255.255</td><td>16,777,214</td></tr>
  <tr><td>172.25.200.33</td><td>B</td><td>255.255.0.0</td><td>172.25.0.0</td><td>172.25.255.255</td><td>65,534</td></tr>
</table>

<h2>4. Ikki kompyuter bir tarmoqdami?</h2>
<p>Ikkalasining manzilini o'z maskasi bilan AND qilamiz — natija bir xil bo'lsa, bir tarmoqda (shlyuzsiz gaplasha oladi).</p>
<pre><code>192.168.1.70/26  → tarmoq 192.168.1.64
192.168.1.130/26 → tarmoq 192.168.1.128   → turli tarmoqlar!</code></pre>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi kalkulyatorda jadvaldagi har bir manzilni kiriting va ikkilik ko'rinishni o'z hisobingiz bilan solishtiring.</li>
  <li>Prefiksni 24 dan 26 ga o'zgartirib, tarmoq/xost chegarasi qanday siljishini kuzating.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "IPv4 bilan ishlash", "subtitle": "7-amaliy mashg'ulot", "emoji": "🔢"}, {"t": "code", "title": "Bit og'irliklari", "code": "128 64 32 16 8 4 2 1\n140 = 128 + 8 + 4 → 10001100"}, {"t": "table", "title": "Maska oktetlari", "head": ["Birlar", "Qiymat"], "rows": [["1", "128"], ["2", "192"], ["3", "224"], ["4", "240"], ["5", "248"], ["6", "252"], ["7", "254"], ["8", "255"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "11100000 o'nlikda?", "options": ["192", "112", "224", "240"], "answer": 2, "explain": "128 + 64 + 32 = 224."}, {"t": "code", "title": "Tarmoq = IP AND maska", "code": "192.168.37.140 AND 255.255.255.0 = 192.168.37.0\nbroadcast = 192.168.37.255"}, {"t": "idea", "title": "Bir tarmoqdami?", "text": "Ikkala manzilni maska bilan AND qiling. Natija teng bo'lsa — bitta tarmoq, aks holda shlyuz kerak.", "emoji": "🤝"}, {"t": "quiz", "title": "Tekshiramiz", "question": "192.168.1.70/26 va 192.168.1.130/26 bir tarmoqdami?", "options": ["Ha", "Yo'q", "Maskaga bog'liq emas"], "answer": 1, "explain": "Tarmoqlar .64 va .128 — turli."}, {"t": "summary", "title": "Xulosa", "items": ["Og'irliklar: 128…1", "Maska oktetlari: 128, 192, 224, 240, 248, 252, 254, 255", "Tarmoq = AND, broadcast = xost bitlari 1"]}]$j$::jsonb,
  7, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('f0ea4282-f107-5ac4-a9ed-aca48616e4b7', 'f218e472-5e96-5e6e-885c-61ff1c906c98', '37ffce82-0cc4-525e-9868-1ae10716b123', 'a53a906c-1a29-5f54-aeae-36e7ce138707', 'f6146e87-b071-5f06-8c02-edec5cdba220', '5b9b9c9e-4140-5e93-8c19-6ff96e356b67');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('f0ea4282-f107-5ac4-a9ed-aca48616e4b7', t, $kt$200 ning ikkilik ko'rinishi?$kt$, 'single',
   $j$[{"id": "a", "text": "11001000", "is_correct": true}, {"id": "b", "text": "11000100", "is_correct": false}, {"id": "c", "text": "10101000", "is_correct": false}, {"id": "d", "text": "11100000", "is_correct": false}]$j$::jsonb,
   $kt$128 + 64 + 8 = 200.$kt$, 1, 0),
  ('f218e472-5e96-5e6e-885c-61ff1c906c98', t, $kt$10101100 ning o'nlik qiymati?$kt$, 'single',
   $j$[{"id": "a", "text": "170", "is_correct": false}, {"id": "b", "text": "172", "is_correct": true}, {"id": "c", "text": "162", "is_correct": false}, {"id": "d", "text": "182", "is_correct": false}]$j$::jsonb,
   $kt$128 + 32 + 8 + 4 = 172.$kt$, 1, 1),
  ('37ffce82-0cc4-525e-9868-1ae10716b123', t, $kt$255.255.255.248 maskada nechta bir bor?$kt$, 'single',
   $j$[{"id": "a", "text": "29", "is_correct": true}, {"id": "b", "text": "30", "is_correct": false}, {"id": "c", "text": "27", "is_correct": false}, {"id": "d", "text": "28", "is_correct": false}]$j$::jsonb,
   $kt$24 + 5 = 29.$kt$, 1, 2),
  ('a53a906c-1a29-5f54-aeae-36e7ce138707', t, $kt$172.25.200.33/16 ning tarmoq manzili?$kt$, 'single',
   $j$[{"id": "a", "text": "172.25.200.32", "is_correct": false}, {"id": "b", "text": "172.25.0.0", "is_correct": true}, {"id": "c", "text": "172.0.0.0", "is_correct": false}, {"id": "d", "text": "172.25.200.0", "is_correct": false}]$j$::jsonb,
   $kt$B sinf, /16 — oxirgi ikki oktet nol.$kt$, 1, 3),
  ('f6146e87-b071-5f06-8c02-edec5cdba220', t, $kt$10.150.77.9 qaysi sinfga tegishli?$kt$, 'single',
   $j$[{"id": "a", "text": "B", "is_correct": false}, {"id": "b", "text": "A", "is_correct": true}, {"id": "c", "text": "C", "is_correct": false}, {"id": "d", "text": "D", "is_correct": false}]$j$::jsonb,
   $kt$Birinchi oktet 1–126.$kt$, 1, 4),
  ('5b9b9c9e-4140-5e93-8c19-6ff96e356b67', t, $kt$Qaysi juftliklar bir tarmoqda?$kt$, 'multiple',
   $j$[{"id": "a", "text": "10.1.1.5/8 va 10.200.3.4/8", "is_correct": true}, {"id": "b", "text": "172.16.5.1/16 va 172.16.99.1/16", "is_correct": true}, {"id": "c", "text": "192.168.1.70/26 va 192.168.1.100/26", "is_correct": true}, {"id": "d", "text": "192.168.1.10/24 va 192.168.2.10/24", "is_correct": false}]$j$::jsonb,
   $kt$192.168.1.x va 192.168.2.x /24 da turli tarmoqlar.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('340cc20e-5479-5640-aac7-a4e38b2e12c1', 'bfedc2fd-a1eb-5100-8ea4-2926a0584016', '7333d194-15e3-5c3a-864c-aebe77393037');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('340cc20e-5479-5640-aac7-a4e38b2e12c1', t, $kt$Konvertatsiya$kt$, $kt$Aylantiring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "192.168.37.140 ning 4-okteti ikkilikda (8 raqam)", "type": "text", "accept": ["10001100"]}, {"label": "11000000.10101000.00001010.00000001 o'nlikda", "type": "ip", "accept": ["192.168.10.1"]}, {"label": "/28 maskasi o'nlikda", "type": "ip", "accept": ["255.255.255.240"]}, {"label": "255.255.252.0 qaysi prefiks? (faqat son)", "type": "number", "accept": ["22"]}]}$j$::jsonb, NULL),
  ('bfedc2fd-a1eb-5100-8ea4-2926a0584016', t, $kt$Tarmoqni hisoblang$kt$, $kt$Manzil: 172.25.200.33, maska 255.255.255.224.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "/27 da blok o'lchami 32: 0, 32, 64… 33 qaysi blokka tushadi?"}]$j$::jsonb, 'medium', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Prefiks", "type": "number", "accept": ["27"]}, {"label": "Tarmoq manzili", "type": "ip", "accept": ["172.25.200.32"]}, {"label": "Broadcast", "type": "ip", "accept": ["172.25.200.63"]}, {"label": "Birinchi xost", "type": "ip", "accept": ["172.25.200.33"]}, {"label": "Oxirgi xost", "type": "ip", "accept": ["172.25.200.62"]}]}$j$::jsonb, NULL),
  ('7333d194-15e3-5c3a-864c-aebe77393037', t, $kt$Tarmoq va broadcast$kt$, $kt$Bir qatorda IP manzil va prefiks: masalan 192.168.1.130/26. Ikki qatorda tarmoq manzili va broadcast manzilni chiqaring.
(ipaddress modulidan foydalanmang — bitli amallar bilan yeching.)$kt$,
   NULL,
   $kt$s = input().strip()
ip, p = s.split('/')
p = int(p)
# Kodingizni shu yerga yozing
$kt$, $kt$s = input().strip()
ip, p = s.split('/')
p = int(p)
n = 0
for x in ip.split('.'):
    n = n * 256 + int(x)
mask = (0xFFFFFFFF << (32 - p)) & 0xFFFFFFFF
net = n & mask
bc = net | (~mask & 0xFFFFFFFF)
to = lambda v: '.'.join(str((v >> s) & 255) for s in (24, 16, 8, 0))
print(to(net))
print(to(bc))$kt$, 'python',
   $j$[{"input": "192.168.1.130/26", "expected_output": "192.168.1.128\n192.168.1.191", "is_hidden": false}, {"input": "10.150.77.9/8", "expected_output": "10.0.0.0\n10.255.255.255", "is_hidden": false}, {"input": "172.25.200.33/27", "expected_output": "172.25.200.32\n172.25.200.63", "is_hidden": true}, {"input": "172.16.45.200/20", "expected_output": "172.16.32.0\n172.16.47.255", "is_hidden": true}, {"input": "200.1.1.1/30", "expected_output": "200.1.1.0\n200.1.1.3", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "Manzilni 32 bitli songa aylantiring: n = n*256 + oktet."}, {"order": 2, "text": "Maska: (0xFFFFFFFF << (32 − p)) & 0xFFFFFFFF."}]$j$::jsonb, 'hard', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 8. 8-amaliy mashg'ulot: Tarmoqni quyi tarmoqlarga bo'lish (subnetting, FLSM)
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$8-amaliy mashg'ulot: Tarmoqni quyi tarmoqlarga bo'lish (subnetting, FLSM)$kt$, 'kt-a08-subnetting',
$kt$<h2>Mashg'ulot maqsadi</h2>
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
<pre><code>2³ = 8 ≥ 6   → n = 3, yangi prefiks /27, maska 255.255.255.224
blok = 2⁵ = 32, har birida 30 ta xost</code></pre>
<table>
  <tr><th>#</th><th>Tarmoq</th><th>Xostlar</th><th>Broadcast</th></tr>
  <tr><td>1</td><td>192.168.10.0/27</td><td>192.168.10.1 – 192.168.10.30</td><td>192.168.10.31</td></tr><tr><td>2</td><td>192.168.10.32/27</td><td>192.168.10.33 – 192.168.10.62</td><td>192.168.10.63</td></tr><tr><td>3</td><td>192.168.10.64/27</td><td>192.168.10.65 – 192.168.10.94</td><td>192.168.10.95</td></tr><tr><td>4</td><td>192.168.10.96/27</td><td>192.168.10.97 – 192.168.10.126</td><td>192.168.10.127</td></tr><tr><td>5</td><td>192.168.10.128/27</td><td>192.168.10.129 – 192.168.10.158</td><td>192.168.10.159</td></tr><tr><td>6</td><td>192.168.10.160/27</td><td>192.168.10.161 – 192.168.10.190</td><td>192.168.10.191</td></tr><tr><td>7</td><td>192.168.10.192/27</td><td>192.168.10.193 – 192.168.10.222</td><td>192.168.10.223</td></tr><tr><td>8</td><td>192.168.10.224/27</td><td>192.168.10.225 – 192.168.10.254</td><td>192.168.10.255</td></tr>
</table>
<p>6 tasi ishlatiladi, 2 tasi kelajak uchun zaxirada.</p>

<h2>3. Ikkinchi namuna (B sinf)</h2>
<p><i>172.16.0.0/16 ni 14 ta quyi tarmoqqa.</i> 2⁴ = 16 ≥ 14 → /20, maska 255.255.240.0, blok 3-oktetda 16: 172.16.0.0, 172.16.16.0, 172.16.32.0 … Har birida 4094 ta xost. 5-quyi tarmoq: <b>172.16.64.0/20</b>, broadcast 172.16.79.255.</p>

<blockquote>Tez hisob: blok o'lchami = 256 − maskaning "qiziq" okteti. /27 da 256 − 224 = 32; /20 da 3-oktet 256 − 240 = 16.</blockquote>

<h2>Ish tartibi</h2>
<ol>
  <li>Namunani daftarda hisoblang, so'ng simulyatsiyadagi "Teng bo'lish" bo'limida 192.168.10.0/24 va 6 ni kiritib tekshiring.</li>
  <li>Bo'limlar sonini 2, 4, 16, 64 qilib, prefiks va xostlar soni qanday o'zgarishini jadvalga yozing.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Subnetting (FLSM)", "subtitle": "8-amaliy mashg'ulot", "emoji": "✂️"}, {"t": "points", "title": "Algoritm", "items": [{"e": "1️⃣", "text": "2ⁿ ≥ N — qarzga olinadigan bitlar"}, {"e": "2️⃣", "text": "Yangi prefiks = eski + n"}, {"e": "3️⃣", "text": "Blok = 2^(32 − prefiks)"}, {"e": "4️⃣", "text": "Tarmoqlar blok qadami bilan"}]}, {"t": "code", "title": "192.168.10.0/24 → 6 bo'lim", "code": "n = 3 → /27 (255.255.255.224)\nblok = 32, xostlar = 30\n192.168.10.0/27\n192.168.10.32/27\n192.168.10.64/27\n192.168.10.96/27\n…"}, {"t": "idea", "title": "Tez hisob", "text": "Blok = 256 − maskaning qiziq okteti. /27 → 256 − 224 = 32.", "emoji": "⚡"}, {"t": "quiz", "title": "Tekshiramiz", "question": "192.168.10.0/24 ni /27 ga bo'lganda 3-quyi tarmoq?", "options": ["192.168.10.60", "192.168.10.32", "192.168.10.64", "192.168.10.96"], "answer": 2, "explain": "0, 32, 64 — uchinchisi .64."}, {"t": "quiz", "title": "Tekshiramiz", "question": "10 ta bo'lim kerak, asos /24. Yangi prefiks?", "options": ["/26", "/30", "/28", "/27"], "answer": 2, "explain": "2⁴ = 16 ≥ 10 → /28."}, {"t": "summary", "title": "Xulosa", "items": ["2ⁿ ≥ kerakli bo'limlar", "Blok o'lchami qadamni beradi", "Broadcast = keyingi tarmoq − 1"]}]$j$::jsonb,
  8, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('06d8bb34-2519-5a99-b747-64fcff02e86e', 'bbd3fc0b-fa5e-5c9b-8b7a-6f77c45de083', 'e605d540-cbd0-53ba-89c4-6a994bc398e5', '24c5c5f2-8e85-5b53-bacb-8ad3650d3ef0', '182c79b7-d1d0-5c3b-be4f-f91beb501696', 'eaa164d0-c26e-5a40-856c-36e87b91e40a');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('06d8bb34-2519-5a99-b747-64fcff02e86e', t, $kt$/24 tarmoqni 4 ta teng qismga bo'lsak, yangi prefiks?$kt$, 'single',
   $j$[{"id": "a", "text": "/27", "is_correct": false}, {"id": "b", "text": "/28", "is_correct": false}, {"id": "c", "text": "/26", "is_correct": true}, {"id": "d", "text": "/25", "is_correct": false}]$j$::jsonb,
   $kt$2² = 4 → /26.$kt$, 1, 0),
  ('bbd3fc0b-fa5e-5c9b-8b7a-6f77c45de083', t, $kt$/26 quyi tarmoqda nechta xost?$kt$, 'single',
   $j$[{"id": "a", "text": "62", "is_correct": true}, {"id": "b", "text": "64", "is_correct": false}, {"id": "c", "text": "30", "is_correct": false}, {"id": "d", "text": "126", "is_correct": false}]$j$::jsonb,
   $kt$2⁶ − 2 = 62.$kt$, 1, 1),
  ('e605d540-cbd0-53ba-89c4-6a994bc398e5', t, $kt$/27 da blok o'lchami?$kt$, 'single',
   $j$[{"id": "a", "text": "32", "is_correct": true}, {"id": "b", "text": "224", "is_correct": false}, {"id": "c", "text": "64", "is_correct": false}, {"id": "d", "text": "16", "is_correct": false}]$j$::jsonb,
   $kt$2⁵ = 32.$kt$, 1, 2),
  ('24c5c5f2-8e85-5b53-bacb-8ad3650d3ef0', t, $kt$192.168.10.64/27 ning broadcast manzili?$kt$, 'single',
   $j$[{"id": "a", "text": "192.168.10.63", "is_correct": false}, {"id": "b", "text": "192.168.10.127", "is_correct": false}, {"id": "c", "text": "192.168.10.95", "is_correct": true}, {"id": "d", "text": "192.168.10.96", "is_correct": false}]$j$::jsonb,
   $kt$64 + 32 − 1 = 95.$kt$, 1, 3),
  ('182c79b7-d1d0-5c3b-be4f-f91beb501696', t, $kt$172.16.0.0/16 ni /20 larga bo'lsak nechta quyi tarmoq?$kt$, 'single',
   $j$[{"id": "a", "text": "4", "is_correct": false}, {"id": "b", "text": "16", "is_correct": true}, {"id": "c", "text": "20", "is_correct": false}, {"id": "d", "text": "8", "is_correct": false}]$j$::jsonb,
   $kt$2⁴ = 16.$kt$, 1, 4),
  ('eaa164d0-c26e-5a40-856c-36e87b91e40a', t, $kt$Qaysilar 192.168.10.0/24 ni /27 ga bo'lishdagi to'g'ri quyi tarmoqlar?$kt$, 'multiple',
   $j$[{"id": "a", "text": "192.168.10.50/27", "is_correct": false}, {"id": "b", "text": "192.168.10.224/27", "is_correct": true}, {"id": "c", "text": "192.168.10.160/27", "is_correct": true}, {"id": "d", "text": "192.168.10.32/27", "is_correct": true}]$j$::jsonb,
   $kt$.50 — 32 ga karrali emas.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('30a523ae-9b68-5f92-9fc9-6bc6a8fca6fa', 'ecd1629d-6148-5d5f-9640-4646b2bdffcc', '581bfaad-419f-5695-9e9d-ddc1b5c414aa');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('30a523ae-9b68-5f92-9fc9-6bc6a8fca6fa', t, $kt$Bo'limlarga ajrating$kt$, $kt$Kollej 192.168.10.0/24 tarmog'ini 6 ta bo'limga teng bo'lmoqchi.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Bo'limlar: .0, .32, .64, .96 …"}]$j$::jsonb, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Yangi prefiks (faqat son)", "type": "number", "accept": ["27"]}, {"label": "Yangi maska", "type": "ip", "accept": ["255.255.255.224"]}, {"label": "Har bo'limdagi xostlar soni", "type": "number", "accept": ["30"]}, {"label": "4-bo'lim tarmoq manzili", "type": "ip", "accept": ["192.168.10.96"]}, {"label": "4-bo'lim broadcast manzili", "type": "ip", "accept": ["192.168.10.127"]}]}$j$::jsonb, NULL),
  ('ecd1629d-6148-5d5f-9640-4646b2bdffcc', t, $kt$B sinfni bo'lish$kt$, $kt$172.16.0.0/16 tarmog'ini kamida 14 ta teng quyi tarmoqqa bo'ling (eng katta mumkin bo'lgan quyi tarmoqlar).$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Blok 3-oktetda 16: 0, 16, 32, 48, 64 …"}]$j$::jsonb, 'medium', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Yangi prefiks", "type": "number", "accept": ["20"]}, {"label": "Har quyi tarmoqdagi xostlar", "type": "number", "accept": ["4094"]}, {"label": "5-quyi tarmoq manzili", "type": "ip", "accept": ["172.16.64.0"]}, {"label": "5-quyi tarmoqning oxirgi xosti", "type": "ip", "accept": ["172.16.79.254"]}]}$j$::jsonb, NULL),
  ('581bfaad-419f-5695-9e9d-ddc1b5c414aa', t, $kt$Quyi tarmoqlar ro'yxati$kt$, $kt$Ikki qator: asosiy tarmoq (masalan 192.168.10.0/24) va kerakli quyi tarmoqlar soni N. Eng kichik yetarli n (2ⁿ ≥ N) bilan bo'lib, birinchi N ta quyi tarmoqni 'tarmoq/prefiks' ko'rinishida har birini alohida qatorda chiqaring.$kt$,
   NULL,
   $kt$base = input().strip()
n_kerak = int(input())
# Kodingizni shu yerga yozing
$kt$, $kt$base = input().strip()
k = int(input())
ip, p = base.split('/')
p = int(p)
v = 0
for x in ip.split('.'):
    v = v * 256 + int(x)
b = 0
while 2 ** b < k:
    b += 1
np = p + b
size = 2 ** (32 - np)
for i in range(k):
    s = v + i * size
    print('.'.join(str((s >> t) & 255) for t in (24, 16, 8, 0)) + '/' + str(np))$kt$, 'python',
   $j$[{"input": "192.168.10.0/24\n6", "expected_output": "192.168.10.0/27\n192.168.10.32/27\n192.168.10.64/27\n192.168.10.96/27\n192.168.10.128/27\n192.168.10.160/27", "is_hidden": false}, {"input": "172.16.0.0/16\n3", "expected_output": "172.16.0.0/18\n172.16.64.0/18\n172.16.128.0/18", "is_hidden": false}, {"input": "10.0.0.0/8\n2", "expected_output": "10.0.0.0/9\n10.128.0.0/9", "is_hidden": true}, {"input": "192.168.1.0/24\n16", "expected_output": "192.168.1.0/28\n192.168.1.16/28\n192.168.1.32/28\n192.168.1.48/28\n192.168.1.64/28\n192.168.1.80/28\n192.168.1.96/28\n192.168.1.112/28\n192.168.1.128/28\n192.168.1.144/28\n192.168.1.160/28\n192.168.1.176/28\n192.168.1.192/28\n192.168.1.208/28\n192.168.1.224/28\n192.168.1.240/28", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "Qarzga olinadigan bitlar: b = 0; while 2**b < N: b += 1."}, {"order": 2, "text": "i-quyi tarmoq boshi: asos + i × blok."}]$j$::jsonb, 'hard', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 9. 9-amaliy mashg'ulot: VLSM va marshrutlarni umumlashtirish (supernetting)
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$9-amaliy mashg'ulot: VLSM va marshrutlarni umumlashtirish (supernetting)$kt$, 'kt-a09-vlsm',
$kt$<h2>Mashg'ulot maqsadi</h2>
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
  <tr><td>Kompyuter sinfi</td><td>100</td><td>/25</td><td>172.20.10.0</td><td>172.20.10.1 – 172.20.10.126</td><td>172.20.10.127</td></tr><tr><td>Buxgalteriya</td><td>50</td><td>/26</td><td>172.20.10.128</td><td>172.20.10.129 – 172.20.10.190</td><td>172.20.10.191</td></tr><tr><td>Ma'muriyat</td><td>20</td><td>/27</td><td>172.20.10.192</td><td>172.20.10.193 – 172.20.10.222</td><td>172.20.10.223</td></tr><tr><td>Server xonasi</td><td>6</td><td>/29</td><td>172.20.10.224</td><td>172.20.10.225 – 172.20.10.230</td><td>172.20.10.231</td></tr><tr><td>R1–R2 liniyasi</td><td>2</td><td>/30</td><td>172.20.10.232</td><td>172.20.10.233 – 172.20.10.234</td><td>172.20.10.235</td></tr>
</table>
<p>Ishlatildi: 236 / 256 manzil. Qolgan blok keyingi bo'limlar uchun zaxira.</p>

<h2>4. Umumlashtirish (supernetting)</h2>
<p>Bir nechta qo'shni tarmoqni bitta qisqaroq prefiks bilan e'lon qilish — marshrut jadvalini qisqartiradi. Usul: manzillarning umumiy boshlang'ich bitlarini topish.</p>
<pre><code>192.168.0.0/24 → 192.168.000000 00.0
192.168.1.0/24 → 192.168.000000 01.0
192.168.2.0/24 → 192.168.000000 10.0
192.168.3.0/24 → 192.168.000000 11.0
umumiy: 16 + 6 = 22 bit  → 192.168.0.0/22</code></pre>
<p>Shart: tarmoqlar ketma-ket va soni 2 ning darajasi bo'lishi, birinchisi esa blok o'lchamiga karrali bo'lishi kerak.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Namunani daftarda bajaring, keyin simulyatsiyadagi VLSM bo'limiga talablarni kiritib tekshiring.</li>
  <li>Talablar tartibini o'zgartirib (kichikdan boshlab) qo'lda ajratib ko'ring — bloklar to'qnashuvi qayerda paydo bo'lishini toping.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "VLSM va umumlashtirish", "subtitle": "9-amaliy mashg'ulot", "emoji": "🧩"}, {"t": "compare", "title": "FLSM va VLSM", "left": {"label": "FLSM", "text": "Hamma bloklar bir xil — isrof"}, "right": {"label": "VLSM", "text": "Har bo'limga keragicha"}}, {"t": "points", "title": "VLSM algoritmi", "items": [{"e": "⬇️", "text": "Kattadan kichikka saralash"}, {"e": "📏", "text": "2^h − 2 ≥ xostlar"}, {"e": "📍", "text": "Bo'sh joy boshidan, karrali manzildan"}]}, {"t": "table", "title": "Namuna: 172.20.10.0/24", "head": ["Bo'lim", "Tarmoq"], "rows": [["Kompyuter sinfi", "172.20.10.0/25"], ["Buxgalteriya", "172.20.10.128/26"], ["Ma'muriyat", "172.20.10.192/27"], ["Server xonasi", "172.20.10.224/29"], ["R1–R2 liniyasi", "172.20.10.232/30"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "50 xost uchun eng kichik prefiks?", "options": ["/26", "/27", "/25", "/28"], "answer": 0, "explain": "2⁶ − 2 = 62 ≥ 50; /27 da 30 — yetmaydi."}, {"t": "code", "title": "Umumlashtirish", "code": "192.168.0.0/24\n192.168.1.0/24\n192.168.2.0/24\n192.168.3.0/24", "output": "192.168.0.0/22"}, {"t": "quiz", "title": "Tekshiramiz", "question": "10.1.4.0/24 – 10.1.7.0/24 ni umumlashtiring", "options": ["10.1.4.0/24", "10.1.4.0/23", "10.1.0.0/21", "10.1.4.0/22"], "answer": 3, "explain": "4 ta tarmoq, 4 ga karrali boshlanish → /22."}, {"t": "summary", "title": "Xulosa", "items": ["VLSM — manzillarni tejaydi", "Har doim kattadan boshlang", "Supernetting — marshrut jadvalini qisqartiradi"]}]$j$::jsonb,
  9, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('6108c8c2-5585-5762-906b-7df9e9228e32', '19a77496-2d24-5dc5-9f90-f0aa95b7471e', '4b3bc0bc-8b7e-5913-a490-fdfcd862cf52', 'b0c316d2-5cb8-5c73-af2f-7e6c38b1d5f8', '32323402-46c3-54a2-bbf6-7e14a422e64b', '9647667b-35af-5394-b7f0-d89509366553');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('6108c8c2-5585-5762-906b-7df9e9228e32', t, $kt$VLSM da talablar qanday tartibda ajratiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Tasodifiy", "is_correct": false}, {"id": "b", "text": "Alifbo bo'yicha", "is_correct": false}, {"id": "c", "text": "Kichikdan kattaga", "is_correct": false}, {"id": "d", "text": "Kattadan kichikka", "is_correct": true}]$j$::jsonb,
   $kt$Shunda bloklar o'z-o'zidan to'g'ri tekislanadi.$kt$, 1, 0),
  ('19a77496-2d24-5dc5-9f90-f0aa95b7471e', t, $kt$Router-router nuqta-nuqta liniyasi uchun odatdagi prefiks?$kt$, 'single',
   $j$[{"id": "a", "text": "/28", "is_correct": false}, {"id": "b", "text": "/30", "is_correct": true}, {"id": "c", "text": "/32", "is_correct": false}, {"id": "d", "text": "/24", "is_correct": false}]$j$::jsonb,
   $kt$/30 — 2 ta xost.$kt$, 1, 1),
  ('4b3bc0bc-8b7e-5913-a490-fdfcd862cf52', t, $kt$20 ta xost uchun eng kichik prefiks?$kt$, 'single',
   $j$[{"id": "a", "text": "/27", "is_correct": true}, {"id": "b", "text": "/28", "is_correct": false}, {"id": "c", "text": "/29", "is_correct": false}, {"id": "d", "text": "/26", "is_correct": false}]$j$::jsonb,
   $kt$/27 — 30 xost; /28 — 14, yetmaydi.$kt$, 1, 2),
  ('b0c316d2-5cb8-5c73-af2f-7e6c38b1d5f8', t, $kt$192.168.0.0/24 va 192.168.1.0/24 ni umumlashtirsak?$kt$, 'single',
   $j$[{"id": "a", "text": "192.168.1.0/23", "is_correct": false}, {"id": "b", "text": "192.168.0.0/23", "is_correct": true}, {"id": "c", "text": "192.168.0.0/25", "is_correct": false}, {"id": "d", "text": "192.168.0.0/22", "is_correct": false}]$j$::jsonb,
   $kt$Ikki tarmoq — 1 bit kam: /23.$kt$, 1, 3),
  ('32323402-46c3-54a2-bbf6-7e14a422e64b', t, $kt$Umumlashtirishning foydasi?$kt$, 'single',
   $j$[{"id": "a", "text": "Marshrut jadvali qisqaradi", "is_correct": true}, {"id": "b", "text": "Broadcast yo'qoladi", "is_correct": false}, {"id": "c", "text": "Manzillar soni ko'payadi", "is_correct": false}, {"id": "d", "text": "Xavfsizlik oshadi", "is_correct": false}]$j$::jsonb,
   $kt$Bitta yozuv bir nechta tarmoqni qamraydi.$kt$, 1, 4),
  ('9647667b-35af-5394-b7f0-d89509366553', t, $kt$Qaysi tarmoqlar to'plamini bitta /22 ga umumlashtirish mumkin?$kt$, 'multiple',
   $j$[{"id": "a", "text": "10.0.8.0 – 10.0.11.0 (/24)", "is_correct": true}, {"id": "b", "text": "10.0.4.0 – 10.0.7.0 (/24)", "is_correct": true}, {"id": "c", "text": "172.16.0.0 – 172.16.3.0 (/24)", "is_correct": true}, {"id": "d", "text": "10.0.5.0 – 10.0.8.0 (/24)", "is_correct": false}]$j$::jsonb,
   $kt$5–8 to'plami 4 ga karrali boshlanmaydi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('1aab5f96-57bb-5195-83b4-ee8829b98db3', 'd9687659-f4d3-53d6-a986-1143fac0adad', 'ed383f79-c1d0-5b6b-9f6a-8b7f9323bf37');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('1aab5f96-57bb-5195-83b4-ee8829b98db3', t, $kt$VLSM rejasi$kt$, $kt$172.20.10.0/24 tarmog'i. Talablar: Kompyuter sinfi — 100, Buxgalteriya — 50, Ma'muriyat — 20, Server xonasi — 6, R1–R2 liniyasi — 2 xost. Kattadan kichikka ajrating.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Masalan: 172.20.10.0/25 ko'rinishida yozing."}, {"order": 2, "text": "Simulyatsiyadagi VLSM bo'limiga 'Kompyuter sinfi:100, Buxgalteriya:50, …' kiriting."}]$j$::jsonb, 'hard', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Kompyuter sinfi tarmog'i (manzil/prefiks)", "type": "ip", "accept": ["172.20.10.0/25"]}, {"label": "Buxgalteriya tarmog'i", "type": "ip", "accept": ["172.20.10.128/26"]}, {"label": "Ma'muriyat tarmog'i", "type": "ip", "accept": ["172.20.10.192/27"]}, {"label": "Server xonasi tarmog'i", "type": "ip", "accept": ["172.20.10.224/29"]}, {"label": "R1–R2 liniyasi tarmog'i", "type": "ip", "accept": ["172.20.10.232/30"]}]}$j$::jsonb, NULL),
  ('d9687659-f4d3-53d6-a986-1143fac0adad', t, $kt$Umumlashtiring$kt$, $kt$Marshrutizator quyidagi tarmoqlarni bitta yozuv bilan e'lon qilmoqchi.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Tarmoqlar soni 2^k bo'lsa, prefiks k ga kamayadi."}]$j$::jsonb, 'medium', 5, 15, 1,
   'answer', $j${"fields": [{"label": "192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24", "type": "ip", "accept": ["192.168.0.0/22"]}, {"label": "172.16.8.0/24 – 172.16.15.0/24 (8 ta)", "type": "ip", "accept": ["172.16.8.0/21"]}, {"label": "10.10.32.0/20 va 10.10.48.0/20", "type": "ip", "accept": ["10.10.32.0/19"]}]}$j$::jsonb, NULL),
  ('ed383f79-c1d0-5b6b-9f6a-8b7f9323bf37', t, $kt$Kerakli prefiks$kt$, $kt$Bitta son — bo'limdagi xostlar soni (1–16 000 000). Unga yetadigan eng kichik quyi tarmoq prefiksini '/p' ko'rinishida chiqaring (xostlar = 2^(32−p) − 2, p ≤ 30).
Masalan: 50 → /26$kt$,
   NULL,
   $kt$h = int(input())
# Kodingizni shu yerga yozing
$kt$, $kt$h = int(input())
p = 30
while 2 ** (32 - p) - 2 < h:
    p -= 1
print('/' + str(p))$kt$, 'python',
   $j$[{"input": "50", "expected_output": "/26", "is_hidden": false}, {"input": "2", "expected_output": "/30", "is_hidden": false}, {"input": "100", "expected_output": "/25", "is_hidden": true}, {"input": "254", "expected_output": "/24", "is_hidden": true}, {"input": "255", "expected_output": "/23", "is_hidden": true}, {"input": "1000", "expected_output": "/22", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "p = 30 dan boshlab, yetguncha kamaytiring."}]$j$::jsonb, 'easy', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 10. 10-amaliy mashg'ulot: Marshrut jadvallarini tuzish. Dijkstra algoritmi
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$10-amaliy mashg'ulot: Marshrut jadvallarini tuzish. Dijkstra algoritmi$kt$, 'kt-a10-marshrutlash',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>Dijkstra algoritmini qo'lda bajarish, marshrut jadvalini tuzish va eng uzun prefiks qoidasini qo'llash.</p>

<h2>1. Dijkstra algoritmi</h2>
<ol>
  <li>Manbaga masofa 0, qolganlarga ∞. Hamma tugun "tekshirilmagan".</li>
  <li>Tekshirilmaganlardan masofasi eng kichigini tanlang (u).</li>
  <li>u ning har bir qo'shnisi v uchun: <code>d(u) + w(u,v) &lt; d(v)</code> bo'lsa, d(v) ni yangilang va "oldingi" = u deb yozing.</li>
  <li>u ni tekshirilgan deb belgilang. Hamma tugun tekshirilguncha 2-qadamga qayting.</li>
</ol>

<h2>2. Namuna</h2>
<p>Graf (qirralar va narxlar): A–B: 4, A–C: 2, B–C: 1, B–D: 5, C–D: 8, C–E: 10, D–E: 2, D–F: 6, E–F: 2. Manba — A.</p>
<table>
  <tr><th>Tugun</th><th>Masofa</th><th>Oldingi</th><th>Keyingi sakrash (A dan)</th></tr>
  <tr><td>A</td><td>0</td><td>—</td><td>—</td></tr><tr><td>B</td><td>3</td><td>C</td><td>C</td></tr><tr><td>C</td><td>2</td><td>A</td><td>C</td></tr><tr><td>D</td><td>8</td><td>B</td><td>C</td></tr><tr><td>E</td><td>10</td><td>D</td><td>C</td></tr><tr><td>F</td><td>12</td><td>E</td><td>C</td></tr>
</table>
<p>A dan F gacha eng arzon yo'l: <b>A → C → B → D → E → F</b>, narxi <b>12</b>. A ning marshrut jadvali uchun faqat "keyingi sakrash" ustuni kerak.</p>

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
</ol>$kt$,
  $j$[{"t": "title", "title": "Marshrut jadvallari", "subtitle": "10-amaliy mashg'ulot", "emoji": "🗺️"}, {"t": "points", "title": "Dijkstra", "items": [{"e": "0️⃣", "text": "Manba 0, qolgan ∞"}, {"e": "🔍", "text": "Eng yaqin tekshirilmaganni tanla"}, {"e": "🔁", "text": "Qo'shnilar masofasini yangila"}, {"e": "✅", "text": "Tekshirilgan deb belgila"}]}, {"t": "table", "title": "A dan masofalar", "head": ["Tugun", "Masofa", "Keyingi sakrash"], "rows": [["A", "0", "—"], ["B", "3", "C"], ["C", "2", "C"], ["D", "8", "C"], ["E", "10", "C"], ["F", "12", "C"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "A → F eng arzon yo'l narxi?", "options": ["14", "12", "16", "9"], "answer": 1, "explain": "A → C → B → D → E → F."}, {"t": "code", "title": "Statik marshrutlar", "code": "R1: ip route 192.168.2.0 255.255.255.0 10.0.0.2\nR2: ip route 192.168.1.0 255.255.255.0 10.0.0.1", "note": "Ikkala yo'nalish ham kerak!"}, {"t": "quiz", "title": "Tekshiramiz", "question": "172.16.33.1 qaysi yozuv bo'yicha ketadi? (/12 → R2, /20 172.16.32.0 → R3, /24 172.16.40.0 → R4)", "options": ["ISP", "R4", "R3", "R2"], "answer": 2, "explain": "172.16.32.0/20 diapazoni 32–47; /24 esa mos emas."}, {"t": "summary", "title": "Xulosa", "items": ["Dijkstra — eng yaqindan kengayish", "Jadvalda faqat keyingi sakrash", "Statik marshrut ikki tomonga", "Eng uzun prefiks g'olib"]}]$j$::jsonb,
  10, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('95a59de4-10e0-5b4c-af79-af1671be18e5', 'b762dcbf-08df-554e-9702-3f2dffcf8b93', '43d5cc7d-c050-50a9-a242-49d71cc4bd47', 'e71312a6-db95-56e9-89ec-a1cf91b4846e', '47d11aad-2563-5299-9439-968616c85bd6', 'c97a309a-f44c-539e-adb2-d1cba8a268b0');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('95a59de4-10e0-5b4c-af79-af1671be18e5', t, $kt$Dijkstra har qadamda qaysi tugunni tanlaydi?$kt$, 'single',
   $j$[{"id": "a", "text": "Masofasi eng kichik tekshirilmagan", "is_correct": true}, {"id": "b", "text": "Tasodifiy", "is_correct": false}, {"id": "c", "text": "Alifbo bo'yicha birinchi", "is_correct": false}, {"id": "d", "text": "Eng uzoqdagi", "is_correct": false}]$j$::jsonb,
   $kt$Shuning uchun tekshirilgan tugun masofasi yakuniy.$kt$, 1, 0),
  ('b762dcbf-08df-554e-9702-3f2dffcf8b93', t, $kt$Namunada A dan D gacha masofa?$kt$, 'single',
   $j$[{"id": "a", "text": "10", "is_correct": false}, {"id": "b", "text": "9", "is_correct": false}, {"id": "c", "text": "8", "is_correct": true}, {"id": "d", "text": "5", "is_correct": false}]$j$::jsonb,
   $kt$Yo'l: A → C → B → D.$kt$, 1, 1),
  ('43d5cc7d-c050-50a9-a242-49d71cc4bd47', t, $kt$Statik marshrut faqat R1 da yozildi. Ping natijasi?$kt$, 'single',
   $j$[{"id": "a", "text": "Muvaffaqiyatli", "is_correct": false}, {"id": "b", "text": "So'rov yetadi, javob qaytmaydi", "is_correct": true}, {"id": "c", "text": "TTL tugaydi", "is_correct": false}, {"id": "d", "text": "So'rov yetmaydi", "is_correct": false}]$j$::jsonb,
   $kt$R2 javobni 192.168.1.0 ga yuborishni bilmaydi.$kt$, 1, 2),
  ('e71312a6-db95-56e9-89ec-a1cf91b4846e', t, $kt$172.16.40.9 qaysi yozuv bo'yicha?$kt$, 'single',
   $j$[{"id": "a", "text": "/12 R2", "is_correct": false}, {"id": "b", "text": "/0 ISP", "is_correct": false}, {"id": "c", "text": "/20 R3", "is_correct": false}, {"id": "d", "text": "/24 R4", "is_correct": true}]$j$::jsonb,
   $kt$Eng uzun mos prefiks.$kt$, 1, 3),
  ('47d11aad-2563-5299-9439-968616c85bd6', t, $kt$Marshrutizator jadvalida nima saqlanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "DNS nomlar", "is_correct": false}, {"id": "b", "text": "Butun yo'l", "is_correct": false}, {"id": "c", "text": "Har bir xostning MAC i", "is_correct": false}, {"id": "d", "text": "Keyingi sakrash va interfeys", "is_correct": true}]$j$::jsonb,
   $kt$Har router faqat navbatdagi qadamni biladi.$kt$, 1, 4),
  ('c97a309a-f44c-539e-adb2-d1cba8a268b0', t, $kt$Qaysi manzillar 172.16.32.0/20 ga tegishli?$kt$, 'multiple',
   $j$[{"id": "a", "text": "172.16.40.9", "is_correct": true}, {"id": "b", "text": "172.16.47.255", "is_correct": true}, {"id": "c", "text": "172.16.48.1", "is_correct": false}, {"id": "d", "text": "172.16.32.1", "is_correct": true}]$j$::jsonb,
   $kt$/20: 172.16.32.0 – 172.16.47.255.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('1da8189e-5b64-5ac1-b5e9-87d4da99ee72', '157ccf31-ed1e-5a3a-bbac-835fb50a12e6', '9915684e-fd43-50b5-b495-081cba2a2ba4');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('1da8189e-5b64-5ac1-b5e9-87d4da99ee72', t, $kt$Dijkstra jadvali$kt$, $kt$Graf: A–B: 4, A–C: 2, B–C: 1, B–D: 5, C–D: 8, C–E: 10, D–E: 2, D–F: 6, E–F: 2. Manba — A.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Avval C (2), keyin B (2 + 1 = 3) tekshiriladi."}]$j$::jsonb, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "A dan E gacha masofa", "type": "number", "accept": ["10"]}, {"label": "A dan F gacha masofa", "type": "number", "accept": ["12"]}, {"label": "A ning F uchun keyingi sakrashi", "type": "choice", "accept": ["C"], "options": ["B", "C", "D", "E"]}, {"label": "A dan F gacha yo'ldagi tugunlar soni (A va F bilan)", "type": "number", "accept": ["6"]}]}$j$::jsonb, NULL),
  ('157ccf31-ed1e-5a3a-bbac-835fb50a12e6', t, $kt$Statik marshrut$kt$, $kt$R1: LAN 192.168.1.0/24, R2 tomondagi interfeys 10.0.0.1/30. R2: LAN 192.168.2.0/24, interfeys 10.0.0.2/30.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Simulyatsiyadagi '2 router' namunasida aynan shu sxema bor — marshrutlarni kiritib ping qiling."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "R1 dagi marshrut: manzil tarmoq", "type": "ip", "accept": ["192.168.2.0"]}, {"label": "R1 dagi marshrut: keyingi sakrash", "type": "ip", "accept": ["10.0.0.2"]}, {"label": "R2 dagi marshrut: keyingi sakrash", "type": "ip", "accept": ["10.0.0.1"]}, {"label": "10.0.0.0/30 da nechta xost manzili bor?", "type": "number", "accept": ["2"]}]}$j$::jsonb, NULL),
  ('9915684e-fd43-50b5-b495-081cba2a2ba4', t, $kt$Eng uzun prefiks$kt$, $kt$Birinchi qatorda N — yozuvlar soni. Keyingi N qatorda: 'tarmoq/prefiks keyingi_sakrash'. Oxirgi qatorda manzil IP. Mos keladigan eng uzun prefiksli yozuvning keyingi sakrashini chiqaring; hech biri mos kelmasa — 'yo''q'.$kt$,
   NULL,
   $kt$n = int(input())
# Kodingizni shu yerga yozing
$kt$, $kt$def num(s):
    v = 0
    for x in s.split('.'):
        v = v * 256 + int(x)
    return v

n = int(input())
rows = []
for _ in range(n):
    net, hop = input().split()
    a, p = net.split('/')
    rows.append((num(a), int(p), hop))
ip = num(input().strip())
best = None
for a, p, hop in rows:
    m = (0xFFFFFFFF << (32 - p)) & 0xFFFFFFFF if p else 0
    if ip & m == a & m and (best is None or p > best[0]):
        best = (p, hop)
print(best[1] if best else "yo'q")$kt$, 'python',
   $j$[{"input": "4\n0.0.0.0/0 ISP\n172.16.0.0/12 R2\n172.16.32.0/20 R3\n172.16.40.0/24 R4\n172.16.40.9", "expected_output": "R4", "is_hidden": false}, {"input": "4\n0.0.0.0/0 ISP\n172.16.0.0/12 R2\n172.16.32.0/20 R3\n172.16.40.0/24 R4\n172.16.33.1", "expected_output": "R3", "is_hidden": false}, {"input": "3\n172.16.0.0/12 R2\n172.16.32.0/20 R3\n172.16.40.0/24 R4\n8.8.8.8", "expected_output": "yo'q", "is_hidden": true}, {"input": "4\n0.0.0.0/0 ISP\n172.16.0.0/12 R2\n172.16.32.0/20 R3\n172.16.40.0/24 R4\n172.20.1.1", "expected_output": "R2", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "/0 maska — 0: har qanday manzil mos keladi."}, {"order": 2, "text": "Mos keladiganlar ichidan prefiksi kattasini saqlang."}]$j$::jsonb, 'hard', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

END $mig$;
