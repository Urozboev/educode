-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: Amaliy mashg'ulotlar 11–15
--
-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
-- Manba: scripts/kontent/kompyuter-tarmoqlari/a11_15.py
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
  -- 11. 11-amaliy mashg'ulot: TCP va UDP. Portlar, tartib raqamlari va oyna
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$11-amaliy mashg'ulot: TCP va UDP. Portlar, tartib raqamlari va oyna$kt$, 'kt-a11-tcp-udp',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>TCP ulanishini tahlil qilish, tartib va tasdiq raqamlarini hisoblash, oyna o'lchamidan o'tkazuvchanlikni topish hamda xizmat uchun transport protokolini tanlash.</p>

<h2>1. Ulanish jurnalini o'qish</h2>
<pre><code>1  192.168.1.10:51034 → 93.184.216.34:80   [SYN]      seq=0
2  93.184.216.34:80   → 192.168.1.10:51034 [SYN,ACK]  seq=0 ack=1
3  192.168.1.10:51034 → 93.184.216.34:80   [ACK]      seq=1 ack=1
4  192.168.1.10:51034 → 93.184.216.34:80   [PSH,ACK]  seq=1 ack=1 len=356
5  93.184.216.34:80   → 192.168.1.10:51034 [ACK]      seq=1 ack=357
6  93.184.216.34:80   → 192.168.1.10:51034 [PSH,ACK]  seq=1 ack=357 len=1200
7  192.168.1.10:51034 → 93.184.216.34:80   [ACK]      seq=357 ack=1201</code></pre>
<ul>
  <li>1–3 — uch bosqichli ulanish. Wireshark tartib raqamlarini <b>nisbiy</b> ko'rsatadi (0 dan).</li>
  <li>Mijoz porti 51034 — dinamik; server porti 80 — HTTP.</li>
  <li>4: mijoz 356 bayt (HTTP so'rov) yubordi → 5: server <code>ack = 1 + 356 = 357</code>.</li>
  <li>6: server 1200 bayt yubordi → 7: mijoz <code>ack = 1 + 1200 = 1201</code>.</li>
</ul>

<h2>2. Oyna va o'tkazuvchanlik</h2>
<pre><code>Maksimal o'tkazuvchanlik ≈ oyna / RTT
65 535 B / 0,05 s = 1 310 700 B/s ≈ 10,5 Mbit/s</code></pre>
<p>Kanal 100 Mbit/s bo'lsa ham, oyna kichik va masofa uzoq bo'lsa, TCP undan to'liq foydalana olmaydi. Shuning uchun zamonaviy TCP "oynani kattalashtirish" (window scaling) dan foydalanadi.</p>

<h2>3. Protokol tanlash</h2>
<table>
  <tr><th>Xizmat</th><th>Transport</th><th>Port</th><th>Sabab</th></tr>
  <tr><td>Veb (HTTPS)</td><td>TCP (HTTP/3 da UDP/QUIC)</td><td>443</td><td>Sahifa to'liq kelishi kerak</td></tr>
  <tr><td>DNS so'rovi</td><td>UDP</td><td>53</td><td>Bitta qisqa so'rov-javob</td></tr>
  <tr><td>DHCP</td><td>UDP</td><td>67/68</td><td>Mijozda hali IP yo'q, broadcast</td></tr>
  <tr><td>VoIP, video qo'ng'iroq</td><td>UDP</td><td>turlicha</td><td>Kechikish muhimroq</td></tr>
  <tr><td>SSH</td><td>TCP</td><td>22</td><td>Har bir belgi yetib borishi kerak</td></tr>
  <tr><td>Pochta yuborish</td><td>TCP</td><td>587</td><td>Xat yaxlit bo'lishi kerak</td></tr>
</table>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyada TCP ulanish ssenariysini oxirigacha o'ting va har qadamda seq/ack ni yozib oling.</li>
  <li>Yo'qotish foizini 0, 20, 40% qilib, TCP va UDP natijalarini jadvalga kiriting.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "TCP va UDP amaliyoti", "subtitle": "11-amaliy mashg'ulot", "emoji": "🔁"}, {"t": "code", "title": "Jurnal", "code": "[SYN]      seq=0\n[SYN,ACK]  seq=0 ack=1\n[ACK]      seq=1 ack=1\n[PSH,ACK]  seq=1 len=356\n[ACK]      ack=357"}, {"t": "idea", "title": "Tasdiq qoidasi", "text": "ack = qabul qilingan oxirgi segmentning seq + len. Ya'ni 'keyingi kutayotgan baytim'.", "emoji": "✅"}, {"t": "quiz", "title": "Tekshiramiz", "question": "seq=357, len=500 segmentga qanday ack keladi?", "options": ["857", "500", "357", "858"], "answer": 0, "explain": "357 + 500 = 857."}, {"t": "code", "title": "Oyna chegarasi", "code": "65 535 B / 0,05 s ≈ 1,31 MB/s ≈ 10,5 Mbit/s"}, {"t": "table", "title": "Protokol tanlash", "head": ["Xizmat", "Transport"], "rows": [["HTTPS", "TCP"], ["DNS", "UDP"], ["DHCP", "UDP"], ["VoIP", "UDP"], ["SSH", "TCP"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Nega DHCP UDP dan foydalanadi?", "options": ["Port 67 band", "Tezroq bo'lgani uchun", "TCP taqiqlangan", "Mijozda hali IP yo'q, broadcast kerak"], "answer": 3, "explain": "TCP ulanishi uchun ikki tomonda ham manzil kerak."}, {"t": "summary", "title": "Xulosa", "items": ["ack = seq + len", "Oyna / RTT — TCP tezlik chegarasi", "Ishonchlilik kerak — TCP, kechikish muhim — UDP"]}]$j$::jsonb,
  11, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('f7b4a40e-1ac8-59d4-8581-3587ad614ad9', '768aba1d-295e-5563-85fd-1b1cc39f6d37', '8c4c6c34-60f5-5847-8842-c98163b48834', '7a098623-f44a-58a3-9635-c0ba6a807cba', 'e78b38a4-e49c-59c0-a65d-ce2fbd53bad8', 'f6720a23-d885-54ee-bf9e-5bf6c8bfac0d');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('f7b4a40e-1ac8-59d4-8581-3587ad614ad9', t, $kt$Jurnalda 2-segment [SYN,ACK] ack=1. Bu nimani bildiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Xato", "is_correct": false}, {"id": "b", "text": "Mijozning SYN i tasdiqlandi", "is_correct": true}, {"id": "c", "text": "Ulanish yopildi", "is_correct": false}, {"id": "d", "text": "1 bayt ma'lumot olindi", "is_correct": false}]$j$::jsonb,
   $kt$SYN bitta tartib raqamini 'egallaydi'.$kt$, 1, 0),
  ('768aba1d-295e-5563-85fd-1b1cc39f6d37', t, $kt$Mijoz porti 51034 qaysi oraliqda?$kt$, 'single',
   $j$[{"id": "a", "text": "Noto'g'ri port", "is_correct": false}, {"id": "b", "text": "Taniqli", "is_correct": false}, {"id": "c", "text": "Ro'yxatdan o'tgan", "is_correct": false}, {"id": "d", "text": "Dinamik", "is_correct": true}]$j$::jsonb,
   $kt$49152–65535 — dinamik.$kt$, 1, 1),
  ('8c4c6c34-60f5-5847-8842-c98163b48834', t, $kt$Oyna 32 000 B, RTT 0,1 s. Maksimal o'tkazuvchanlik?$kt$, 'single',
   $j$[{"id": "a", "text": "32 000 B/s", "is_correct": false}, {"id": "b", "text": "3 200 B/s", "is_correct": false}, {"id": "c", "text": "320 000 B/s", "is_correct": true}, {"id": "d", "text": "3,2 MB/s", "is_correct": false}]$j$::jsonb,
   $kt$32 000 / 0,1.$kt$, 1, 2),
  ('7a098623-f44a-58a3-9635-c0ba6a807cba', t, $kt$Qaysi xizmat UDP dan foydalanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "SMTP", "is_correct": false}, {"id": "b", "text": "DNS so'rovi", "is_correct": true}, {"id": "c", "text": "SSH", "is_correct": false}, {"id": "d", "text": "FTP", "is_correct": false}]$j$::jsonb,
   $kt$DNS — UDP 53.$kt$, 1, 3),
  ('e78b38a4-e49c-59c0-a65d-ce2fbd53bad8', t, $kt$TCP ulanishini favqulodda uzish bayrog'i?$kt$, 'single',
   $j$[{"id": "a", "text": "URG", "is_correct": false}, {"id": "b", "text": "RST", "is_correct": true}, {"id": "c", "text": "FIN", "is_correct": false}, {"id": "d", "text": "PSH", "is_correct": false}]$j$::jsonb,
   $kt$RST — reset.$kt$, 1, 4),
  ('f6720a23-d885-54ee-bf9e-5bf6c8bfac0d', t, $kt$Qaysi gaplar to'g'ri?$kt$, 'multiple',
   $j$[{"id": "a", "text": "TCP oyna kattaligi o'tkazuvchanlikka ta'sir qilmaydi", "is_correct": false}, {"id": "b", "text": "ack keyingi kutilayotgan baytni ko'rsatadi", "is_correct": true}, {"id": "c", "text": "UDP da ack raqami yo'q", "is_correct": true}, {"id": "d", "text": "SYN tartib raqamidan bitta joy oladi", "is_correct": true}]$j$::jsonb,
   $kt$Oyna / RTT — tezlik chegarasi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('28f2e5e4-fe80-5ec5-9eaa-0dba97e4aec5', '14385eba-5db8-51d9-a0d7-98e3d4ebf44e', '40bc61aa-138e-5181-80b8-0c7bb74c994e');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('28f2e5e4-fe80-5ec5-9eaa-0dba97e4aec5', t, $kt$Jurnalni davom ettiring$kt$, $kt$Ulanish o'rnatildi (nisbiy raqamlar). Mijoz seq=1 dan 400 bayt yubordi, server 2000 bayt javob berdi, keyin mijoz yana 100 bayt yubordi.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Server mijozning 400 baytini tasdiqlaydigan ack", "type": "number", "accept": ["401"]}, {"label": "Mijozning ikkinchi (100 baytli) segmenti seq raqami", "type": "number", "accept": ["401"]}, {"label": "Mijoz serverning 2000 baytini tasdiqlaydigan ack", "type": "number", "accept": ["2001"]}, {"label": "Server mijozning 100 baytini tasdiqlaydigan ack", "type": "number", "accept": ["501"]}]}$j$::jsonb, NULL),
  ('14385eba-5db8-51d9-a0d7-98e3d4ebf44e', t, $kt$O'tkazuvchanlik$kt$, $kt$TCP oyna 65 535 bayt. Toshkent–Frankfurt RTT ≈ 80 ms.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Kerakli oyna = tezlik (B/s) × RTT."}]$j$::jsonb, 'medium', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Maksimal o'tkazuvchanlik, B/s (butun son)", "type": "number", "accept": ["819188"], "tol": 1, "unit": "B/s"}, {"label": "Mbit/s (1 xona)", "type": "number", "accept": ["6.6"], "tol": 0.1, "unit": "Mbit/s"}, {"label": "100 Mbit/s ga yetish uchun kerakli oyna, bayt", "type": "number", "accept": ["1000000"], "tol": 1, "unit": "B"}]}$j$::jsonb, NULL),
  ('40bc61aa-138e-5181-80b8-0c7bb74c994e', t, $kt$Tasdiq raqamlari$kt$, $kt$Birinchi qatorda boshlang'ich seq (butun son), ikkinchisida bo'sh joy bilan segment hajmlari. Har segmentdan keyin qabul qiluvchi yuboradigan ack ni alohida qatorda chiqaring.
Masalan: 1001 va 500 500 300 → 1501, 2001, 2301$kt$,
   NULL,
   $kt$seq = int(input())
hajmlar = list(map(int, input().split()))
# Kodingizni shu yerga yozing
$kt$, $kt$seq = int(input())
for h in map(int, input().split()):
    seq += h
    print(seq)$kt$, 'python',
   $j$[{"input": "1001\n500 500 300", "expected_output": "1501\n2001\n2301", "is_hidden": false}, {"input": "1\n356", "expected_output": "357", "is_hidden": false}, {"input": "5000\n1460 1460 1460 100", "expected_output": "6460\n7920\n9380\n9480", "is_hidden": true}, {"input": "0\n1 2 3", "expected_output": "1\n3\n6", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "Har segmentdan keyin seq += hajm."}]$j$::jsonb, 'easy', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 12. 12-amaliy mashg'ulot: HTTP so'rov va javoblarini tahlil qilish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$12-amaliy mashg'ulot: HTTP so'rov va javoblarini tahlil qilish$kt$, 'kt-a12-http',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>HTTP xabarlarining tuzilishini o'qish, holat kodlari va sarlavhalar ma'nosini aniqlash, brauzer vositalari bilan so'rovlarni kuzatish.</p>

<h2>1. So'rov tuzilishi</h2>
<pre><code>POST /api/login HTTP/1.1          ← so'rov qatori: usul, yo'l, versiya
Host: lms.misol.uz                 ← sarlavhalar
Content-Type: application/json
Content-Length: 41
Cookie: til=uz
                                   ← bo'sh qator
{"login":"ali","parol":"Qwerty123"} ← tana</code></pre>

<h2>2. Javob tuzilishi</h2>
<pre><code>HTTP/1.1 302 Found                 ← holat qatori
Location: /dashboard
Set-Cookie: session=a8f3…; HttpOnly; Secure; SameSite=Lax
Cache-Control: no-store
Content-Length: 0</code></pre>
<ul>
  <li><b>302</b> — vaqtinchalik yo'naltirish: brauzer <code>Location</code> dagi manzilga o'tadi.</li>
  <li><b>Set-Cookie</b> — sessiya identifikatori; <code>HttpOnly</code> — JavaScript o'qiy olmaydi, <code>Secure</code> — faqat HTTPS da yuboriladi.</li>
  <li><b>Cache-Control: no-store</b> — javob keshlanmasin.</li>
</ul>

<h2>3. Muhim sarlavhalar</h2>
<table>
  <tr><th>Sarlavha</th><th>Vazifasi</th></tr>
  <tr><td>Host</td><td>Qaysi sayt (bitta serverda bir nechta sayt bo'lishi mumkin)</td></tr>
  <tr><td>User-Agent</td><td>Brauzer va OT</td></tr>
  <tr><td>Accept, Accept-Language</td><td>Qanday format va til kutilmoqda</td></tr>
  <tr><td>Content-Type, Content-Length</td><td>Tana formati va hajmi</td></tr>
  <tr><td>Cache-Control, ETag, If-None-Match</td><td>Keshlash: o'zgarmagan bo'lsa 304</td></tr>
  <tr><td>Authorization</td><td>Kirish tokeni</td></tr>
  <tr><td>Location</td><td>Yo'naltirish manzili (3xx)</td></tr>
</table>

<h2>4. Brauzerda kuzatish</h2>
<ol>
  <li>F12 → <b>Network</b> (Tarmoq) yorlig'i → sahifani yangilang.</li>
  <li>Har bir qatorda: usul, holat kodi, turi, hajmi, vaqti.</li>
  <li>Qatorni bosing → <b>Headers</b>: so'rov va javob sarlavhalari.</li>
  <li>Yana yangilang: ba'zi fayllar <b>304</b> yoki "(disk cache)" bilan keladi — kesh ishlayapti.</li>
</ol>
<blockquote>Diqqat: yuqoridagi so'rov tanasida parol ochiq ko'rinadi. HTTPS bu tanani yo'lda shifrlaydi, lekin brauzer vositalarida (o'z kompyuteringizda) baribir ko'rinadi. Shuning uchun begona kompyuterda tizimga kirmang.</blockquote>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi HTTP ssenariysini o'ting va har javobning holat kodini izohlang.</li>
  <li>O'zingiz sevgan saytni F12 → Network bilan oching: nechta so'rov ketdi, eng katta resurs qaysi, qaysilari 304?</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "HTTP tahlili", "subtitle": "12-amaliy mashg'ulot", "emoji": "🌐"}, {"t": "code", "title": "So'rov", "code": "POST /api/login HTTP/1.1\nHost: lms.misol.uz\nContent-Type: application/json\n\n{\"login\":\"ali\",…}"}, {"t": "code", "title": "Javob", "code": "HTTP/1.1 302 Found\nLocation: /dashboard\nSet-Cookie: session=…; HttpOnly; Secure"}, {"t": "table", "title": "Holat kodlari", "head": ["Kod", "Ma'nosi"], "rows": [["200", "OK"], ["201", "Yaratildi"], ["301 / 302", "Doimiy / vaqtinchalik yo'naltirish"], ["304", "O'zgarmagan (kesh)"], ["401 / 403", "Kirish kerak / taqiqlangan"], ["404", "Topilmadi"], ["500 / 503", "Server xatosi / band"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Qaysi sarlavha bitta serverdagi bir nechta saytni ajratadi?", "options": ["User-Agent", "Host", "Accept", "Cookie"], "answer": 1, "explain": "Virtual xostlar Host bo'yicha ishlaydi."}, {"t": "quiz", "title": "Tekshiramiz", "question": "Tizimga kirmasdan himoyalangan sahifani so'radingiz. Kod?", "options": ["500", "401", "200", "404"], "answer": 1, "explain": "401 Unauthorized — autentifikatsiya kerak."}, {"t": "points", "title": "Brauzerda kuzatish", "items": [{"e": "⌨️", "text": "F12 → Network"}, {"e": "🔄", "text": "Sahifani yangilash"}, {"e": "📋", "text": "Qatorni bosib Headers"}, {"e": "💾", "text": "304 / disk cache — kesh"}]}, {"t": "summary", "title": "Xulosa", "items": ["So'rov: qator + sarlavhalar + bo'sh qator + tana", "Javob: holat qatori + sarlavhalar + tana", "Kod sinfi xato kimdaligini aytadi"]}]$j$::jsonb,
  12, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('5bedd3a1-704a-5673-b5c0-84dd3833583e', 'fe3d4f0f-6fd4-5f70-abe6-44b988757d93', '10363e50-24ba-56a8-bde8-74166ffde316', '7e8e91cd-d200-5644-a739-9d0dae7d025b', '29fac52b-0a1e-55f1-b5c0-f9fa45777c24', '728b0120-36b8-5bc9-86fb-0fa9f2c8c448');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('5bedd3a1-704a-5673-b5c0-84dd3833583e', t, $kt$So'rov qatorining tarkibi?$kt$, 'single',
   $j$[{"id": "a", "text": "Cookie va tana", "is_correct": false}, {"id": "b", "text": "Holat kodi va matni", "is_correct": false}, {"id": "c", "text": "Host va port", "is_correct": false}, {"id": "d", "text": "Usul, yo'l, versiya", "is_correct": true}]$j$::jsonb,
   $kt$Masalan: GET /index.html HTTP/1.1.$kt$, 1, 0),
  ('fe3d4f0f-6fd4-5f70-abe6-44b988757d93', t, $kt$Sarlavhalar va tana nima bilan ajratiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Nuqtali vergul", "is_correct": false}, {"id": "b", "text": "Bo'sh qator", "is_correct": true}, {"id": "c", "text": "Ajratilmaydi", "is_correct": false}, {"id": "d", "text": "Chiziqcha", "is_correct": false}]$j$::jsonb,
   $kt$Bitta bo'sh qator (CRLF).$kt$, 1, 1),
  ('10363e50-24ba-56a8-bde8-74166ffde316', t, $kt$Set-Cookie dagi HttpOnly nimani bildiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "JavaScript cookie ni o'qiy olmaydi", "is_correct": true}, {"id": "b", "text": "Cookie shifrlanadi", "is_correct": false}, {"id": "c", "text": "Cookie 1 soat yashaydi", "is_correct": false}, {"id": "d", "text": "Faqat HTTP da ishlaydi", "is_correct": false}]$j$::jsonb,
   $kt$XSS hujumlaridan himoya.$kt$, 1, 2),
  ('7e8e91cd-d200-5644-a739-9d0dae7d025b', t, $kt$503 kodi?$kt$, 'single',
   $j$[{"id": "a", "text": "Yo'naltirish", "is_correct": false}, {"id": "b", "text": "Topilmadi", "is_correct": false}, {"id": "c", "text": "Taqiqlangan", "is_correct": false}, {"id": "d", "text": "Server vaqtincha mavjud emas", "is_correct": true}]$j$::jsonb,
   $kt$Service Unavailable.$kt$, 1, 3),
  ('29fac52b-0a1e-55f1-b5c0-f9fa45777c24', t, $kt$Fayl o'zgarmagan bo'lsa server qanday javob beradi?$kt$, 'single',
   $j$[{"id": "a", "text": "404", "is_correct": false}, {"id": "b", "text": "301", "is_correct": false}, {"id": "c", "text": "200 + fayl", "is_correct": false}, {"id": "d", "text": "304, tanasiz", "is_correct": true}]$j$::jsonb,
   $kt$Brauzer keshdagisini ishlatadi.$kt$, 1, 4),
  ('728b0120-36b8-5bc9-86fb-0fa9f2c8c448', t, $kt$Qaysilar so'rov sarlavhalari?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Accept-Language", "is_correct": true}, {"id": "b", "text": "Location", "is_correct": false}, {"id": "c", "text": "Host", "is_correct": true}, {"id": "d", "text": "User-Agent", "is_correct": true}]$j$::jsonb,
   $kt$Location — javob sarlavhasi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('4f018311-e581-5207-88c3-c0d260bb05cc', '6e25d805-daa1-5159-8c3e-1f1c3df2b6b6', '745f6e88-079c-51aa-8ad6-ddd2b35345b0');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('4f018311-e581-5207-88c3-c0d260bb05cc', t, $kt$Xabarni tahlil qiling$kt$, $kt$So'rov: 'GET /kurslar/tarmoq?bob=3 HTTP/1.1'. Javob: 'HTTP/1.1 301 Moved Permanently' va 'Location: https://misol.uz/kurslar/tarmoq?bob=3'.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "So'rov usuli", "type": "text", "accept": ["GET"]}, {"label": "So'ralgan yo'l (? gacha)", "type": "text", "accept": ["/kurslar/tarmoq"]}, {"label": "Holat kodi", "type": "number", "accept": ["301"]}, {"label": "Kod sinfi (masalan 2xx)", "type": "text", "accept": ["3xx"]}, {"label": "Brauzer qaysi sxemaga o'tadi?", "type": "text", "accept": ["https"]}]}$j$::jsonb, NULL),
  ('6e25d805-daa1-5159-8c3e-1f1c3df2b6b6', t, $kt$Kodni tanlang$kt$, $kt$Vaziyatga mos holat kodi.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Yangi foydalanuvchi muvaffaqiyatli yaratildi", "type": "choice", "accept": ["201"], "options": ["200", "201", "204", "400"]}, {"label": "Formada majburiy maydon to'ldirilmagan", "type": "choice", "accept": ["400"], "options": ["400", "401", "403", "404"]}, {"label": "Talaba admin sahifasini ochmoqchi (kirgan, lekin ruxsat yo'q)", "type": "choice", "accept": ["403"], "options": ["400", "401", "403", "404"]}, {"label": "Server texnik ishlar uchun vaqtincha o'chirilgan", "type": "choice", "accept": ["503"], "options": ["500", "502", "503", "504"]}]}$j$::jsonb, NULL),
  ('745f6e88-079c-51aa-8ad6-ddd2b35345b0', t, $kt$Holat kodi sinfi$kt$, $kt$Bitta son — HTTP holat kodi (100–599). Uning sinfini chiqaring: 'ma'lumot' (1xx), 'muvaffaqiyat' (2xx), 'yo''naltirish' (3xx), 'mijoz xatosi' (4xx), 'server xatosi' (5xx).$kt$,
   NULL,
   $kt$kod = int(input())
# Kodingizni shu yerga yozing
$kt$, $kt$kod = int(input())
nomlar = {1: "ma'lumot", 2: 'muvaffaqiyat', 3: "yo'naltirish", 4: 'mijoz xatosi', 5: 'server xatosi'}
print(nomlar[kod // 100])$kt$, 'python',
   $j$[{"input": "404", "expected_output": "mijoz xatosi", "is_hidden": false}, {"input": "200", "expected_output": "muvaffaqiyat", "is_hidden": false}, {"input": "503", "expected_output": "server xatosi", "is_hidden": true}, {"input": "301", "expected_output": "yo'naltirish", "is_hidden": true}, {"input": "101", "expected_output": "ma'lumot", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "Yuzliklar raqami: kod // 100."}]$j$::jsonb, 'easy', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 13. 13-amaliy mashg'ulot: DNS. Zona yozuvlari va nomni aniqlash jarayoni
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$13-amaliy mashg'ulot: DNS. Zona yozuvlari va nomni aniqlash jarayoni$kt$, 'kt-a13-dns',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>Zona faylini o'qish, nomni aniqlash zanjirini tuzish, teskari zonalar va keshlash vaqtini hisoblash.</p>

<h2>1. Zona fayli</h2>
<pre><code>$TTL 3600
misol.uz.      IN SOA   ns1.misol.uz. admin.misol.uz. (2026101401 7200 1800 1209600 3600)
misol.uz.      IN NS    ns1.misol.uz.
misol.uz.      IN NS    ns2.misol.uz.
misol.uz.      IN A     185.74.5.10
www            IN CNAME misol.uz.
lms            IN A     185.74.5.20
misol.uz.      IN MX 10 mail.misol.uz.
misol.uz.      IN MX 20 mail2.misol.uz.
mail           IN A     185.74.5.30
misol.uz.      IN TXT   "v=spf1 mx -all"</code></pre>
<ul>
  <li><code>www.misol.uz</code> → CNAME → <code>misol.uz</code> → A → 185.74.5.10.</li>
  <li>Pochta avval <b>MX 10</b> ga (kichik raqam — yuqori ustuvorlik), u ishlamasa MX 20 ga yuboriladi.</li>
  <li>SOA dagi seriya raqami (2026101401) zona o'zgarganda oshiriladi — ikkinchi server (ns2) yangilanish kerakligini shundan biladi.</li>
  <li><code>$TTL 3600</code> — yozuvlar 1 soat keshlanadi.</li>
</ul>

<h2>2. Aniqlash zanjiri</h2>
<p>Kompyuter → lokal resolver (rekursiv) → ildiz → .uz → misol.uz avtoritar serveri → javob → resolver keshlaydi → kompyuter. Kesh bo'sh bo'lsa, lokal server 3 ta iterativ so'rov yuboradi.</p>

<h2>3. Teskari zonalar</h2>
<p>IP manzil bo'yicha nom topish uchun PTR yozuvi. Nomi oktetlarni teskari yozib hosil qilinadi:</p>
<pre><code>185.74.5.10  →  10.5.74.185.in-addr.arpa.  PTR  misol.uz.
Zona (/24):      5.74.185.in-addr.arpa</code></pre>

<h2>4. TTL va o'zgarish</h2>
<p>Admin 10:00 da <code>lms</code> manzilini o'zgartirdi, TTL = 3600 s. Kimdir 09:59 da so'rov yuborgan bo'lsa, uning resolveri eski javobni <b>10:59</b> gacha beradi. Ko'chishdan oldin TTL ni vaqtincha kamaytirish (masalan, 300 s) tavsiya etiladi.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi DNS ssenariysini o'ting va har so'rov kimdan kimga ketganini yozing.</li>
  <li>O'z kompyuteringizda: <code>nslookup miracademy.uz</code>, <code>nslookup -type=mx gmail.com</code>, <code>nslookup -type=ns uz</code>. Natijalarni hisobotga kiriting.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "DNS amaliyoti", "subtitle": "13-amaliy mashg'ulot", "emoji": "📖"}, {"t": "code", "title": "Zona parchasi", "code": "misol.uz.  IN A      185.74.5.10\nwww        IN CNAME  misol.uz.\nmisol.uz.  IN MX 10  mail.misol.uz.\nmail       IN A      185.74.5.30"}, {"t": "quiz", "title": "Tekshiramiz", "question": "www.misol.uz qaysi IP ga aylanadi?", "options": ["185.74.5.10", "185.74.5.30", "Javob yo'q", "185.74.5.20"], "answer": 0, "explain": "CNAME → misol.uz → A."}, {"t": "idea", "title": "MX ustuvorligi", "text": "Kichik raqam — yuqori ustuvorlik. MX 10 ishlamasa, MX 20 ga yuboriladi.", "emoji": "📮"}, {"t": "code", "title": "Teskari nom", "code": "185.74.5.10 → 10.5.74.185.in-addr.arpa"}, {"t": "quiz", "title": "Tekshiramiz", "question": "TTL 1800 s, yozuv 14:00 da o'zgardi. 13:55 da keshlangan eski javob qachongacha beriladi?", "options": ["14:25", "14:30", "15:00", "14:00"], "answer": 0, "explain": "13:55 + 30 daqiqa = 14:25."}, {"t": "summary", "title": "Xulosa", "items": ["CNAME → A zanjiri", "MX: kichik raqam — birinchi", "PTR: oktetlar teskari + in-addr.arpa", "TTL — eski javob shuncha yashaydi"]}]$j$::jsonb,
  13, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('d9c4756c-702c-53df-a558-36e92acc2a91', '100be12d-6a4e-50a6-af7f-a211be4b9604', 'd4cec15f-18f0-5d43-8788-48ccf7042b16', 'b675648f-b2ca-59c4-929f-78d5fcc53973', '3e6d9d9a-98ed-54e8-a5b0-e6197c27a87c', 'bfea1d16-0ea6-5966-a955-76e52f21aeea');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('d9c4756c-702c-53df-a558-36e92acc2a91', t, $kt$Zonadagi SOA seriya raqami nima uchun?$kt$, 'single',
   $j$[{"id": "a", "text": "TTL", "is_correct": false}, {"id": "b", "text": "Xavfsizlik", "is_correct": false}, {"id": "c", "text": "Pochta ustuvorligi", "is_correct": false}, {"id": "d", "text": "Zona o'zgarganini ikkinchi serverga bildirish", "is_correct": true}]$j$::jsonb,
   $kt$Seriya oshsa, ikkilamchi server zonani ko'chiradi.$kt$, 1, 0),
  ('100be12d-6a4e-50a6-af7f-a211be4b9604', t, $kt$MX 10 va MX 20 bo'lsa, pochta avval qayerga?$kt$, 'single',
   $j$[{"id": "a", "text": "MX 20", "is_correct": false}, {"id": "b", "text": "Ikkalasiga", "is_correct": false}, {"id": "c", "text": "MX 10", "is_correct": true}, {"id": "d", "text": "Tasodifiy", "is_correct": false}]$j$::jsonb,
   $kt$Kichik qiymat — yuqori ustuvorlik.$kt$, 1, 1),
  ('d4cec15f-18f0-5d43-8788-48ccf7042b16', t, $kt$172.16.5.20 ning PTR nomi?$kt$, 'single',
   $j$[{"id": "a", "text": "20.5.16.172.arpa", "is_correct": false}, {"id": "b", "text": "20.5.16.172.in-addr.arpa", "is_correct": true}, {"id": "c", "text": "5.16.172.in-addr.arpa", "is_correct": false}, {"id": "d", "text": "172.16.5.20.in-addr.arpa", "is_correct": false}]$j$::jsonb,
   $kt$Oktetlar teskari tartibda.$kt$, 1, 2),
  ('b675648f-b2ca-59c4-929f-78d5fcc53973', t, $kt$Kesh bo'sh. Lokal resolver misol.uz uchun nechta iterativ so'rov yuboradi?$kt$, 'single',
   $j$[{"id": "a", "text": "1", "is_correct": false}, {"id": "b", "text": "2", "is_correct": false}, {"id": "c", "text": "3", "is_correct": true}, {"id": "d", "text": "5", "is_correct": false}]$j$::jsonb,
   $kt$Ildiz, .uz, avtoritar.$kt$, 1, 3),
  ('3e6d9d9a-98ed-54e8-a5b0-e6197c27a87c', t, $kt$Server ko'chishidan oldin TTL ni nima qilish tavsiya etiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Vaqtincha kamaytirish", "is_correct": true}, {"id": "b", "text": "O'chirish", "is_correct": false}, {"id": "c", "text": "Oshirish", "is_correct": false}, {"id": "d", "text": "0 qilish", "is_correct": false}]$j$::jsonb,
   $kt$Shunda o'zgarish tezroq tarqaladi.$kt$, 1, 4),
  ('bfea1d16-0ea6-5966-a955-76e52f21aeea', t, $kt$Qaysi buyruqlar to'g'ri?$kt$, 'multiple',
   $j$[{"id": "a", "text": "nslookup -type=mx gmail.com", "is_correct": true}, {"id": "b", "text": "ipconfig /displaydns", "is_correct": true}, {"id": "c", "text": "nslookup -type=ns uz", "is_correct": true}, {"id": "d", "text": "ping -type=a misol.uz", "is_correct": false}]$j$::jsonb,
   $kt$ping da -type yo'q.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('29eb7990-4f87-59b4-be78-206a68202471', '6676e7da-151d-51d2-98fb-86d0a82a8179', 'bbd92b18-a9b4-5d2b-bc26-1ff9a925cc63');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('29eb7990-4f87-59b4-be78-206a68202471', t, $kt$Zona faylini o'qing$kt$, $kt$Mashg'ulot matnidagi misol.uz zona faylidan foydalaning.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "lms.misol.uz ning IP manzili", "type": "ip", "accept": ["185.74.5.20"]}, {"label": "www.misol.uz qaysi yozuv turi?", "type": "choice", "accept": ["CNAME"], "options": ["A", "CNAME", "MX", "NS"]}, {"label": "Asosiy pochta serveri nomi", "type": "text", "accept": ["mail.misol.uz", "mail.misol.uz."]}, {"label": "Zona uchun nechta NS server ko'rsatilgan?", "type": "number", "accept": ["2"]}, {"label": "Yozuvlar necha soniya keshlanadi?", "type": "number", "accept": ["3600"]}]}$j$::jsonb, NULL),
  ('6676e7da-151d-51d2-98fb-86d0a82a8179', t, $kt$Teskari zona va TTL$kt$, $kt$Hisoblang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "10.20.30.40 ning PTR yozuvi nomi", "type": "text", "accept": ["40.30.20.10.in-addr.arpa", "40.30.20.10.in-addr.arpa."]}, {"label": "192.168.5.0/24 teskari zonasi", "type": "text", "accept": ["5.168.192.in-addr.arpa", "5.168.192.in-addr.arpa."]}, {"label": "TTL 7200 s. Yozuv 12:00 da keshlandi. Eski qiymat qachongacha (SS:DD)?", "type": "text", "accept": ["14:00"]}]}$j$::jsonb, NULL),
  ('bbd92b18-a9b4-5d2b-bc26-1ff9a925cc63', t, $kt$PTR nomi$kt$, $kt$IPv4 manzil kiritiladi. Uning PTR yozuvi nomini chiqaring (oxirida nuqtasiz).
Masalan: 185.74.5.10 → 10.5.74.185.in-addr.arpa$kt$,
   NULL,
   $kt$ip = input().strip()
# Kodingizni shu yerga yozing
$kt$, $kt$ip = input().strip()
print('.'.join(reversed(ip.split('.'))) + '.in-addr.arpa')$kt$, 'python',
   $j$[{"input": "185.74.5.10", "expected_output": "10.5.74.185.in-addr.arpa", "is_hidden": false}, {"input": "192.168.1.1", "expected_output": "1.1.168.192.in-addr.arpa", "is_hidden": false}, {"input": "8.8.4.4", "expected_output": "4.4.8.8.in-addr.arpa", "is_hidden": true}, {"input": "10.20.30.40", "expected_output": "40.30.20.10.in-addr.arpa", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "split('.') → reversed → '.'.join."}]$j$::jsonb, 'easy', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 14. 14-amaliy mashg'ulot: Brandmauer qoidalarini tuzish. DMZ va VPN
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$14-amaliy mashg'ulot: Brandmauer qoidalarini tuzish. DMZ va VPN$kt$, 'kt-a14-firewall',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>Xavfsizlik siyosatini brandmauer qoidalariga aylantirish, qoidalar tartibini tekshirish va VPN qo'shimcha yukini hisoblash.</p>

<h2>1. Siyosatdan qoidaga</h2>
<p><i>Talab: veb-server (10.0.0.5) Internetga 80 va 443 orqali ochiq; SSH faqat administrator kompyuteridan (192.168.1.50); ichki tarmoqdan (192.168.1.0/24) DNS so'rovlari tashqariga; qolgan hammasi taqiqlangan.</i></p>
<table>
  <tr><th>#</th><th>Amal</th><th>Protokol</th><th>Manba</th><th>Manzil</th><th>Port</th></tr>
  <tr><td>1</td><td>Allow</td><td>TCP</td><td>192.168.1.50</td><td>10.0.0.5</td><td>22</td></tr>
  <tr><td>2</td><td>Allow</td><td>TCP</td><td>any</td><td>10.0.0.5</td><td>80, 443</td></tr>
  <tr><td>3</td><td>Allow</td><td>UDP</td><td>192.168.1.0/24</td><td>any</td><td>53</td></tr>
  <tr><td>4</td><td>Deny</td><td>any</td><td>any</td><td>any</td><td>any</td></tr>
</table>
<p>Qoidalarni tuzish tamoyillari:</p>
<ul>
  <li><b>Aniqdan umumiyga</b>: tor qoidalar yuqorida, keng qoidalar pastda.</li>
  <li><b>Sukut — taqiq</b>: oxirida "Deny any" yoki shunday sukut siyosati.</li>
  <li><b>Eng kam ruxsat</b>: "any" ni faqat zarur joyda ishlating.</li>
  <li><b>Holatni kuzatish</b>: zamonaviy brandmauer javob paketlarini avtomatik o'tkazadi — ular uchun alohida qoida kerak emas.</li>
</ul>

<h2>2. Tipik xato</h2>
<pre><code>1  Deny  any any any
2  Allow TCP any 10.0.0.5 443</code></pre>
<p>2-qoida hech qachon ishlamaydi — 1-qoida hammasini oldin to'sadi ("soyada qolgan qoida").</p>

<h2>3. DMZ</h2>
<p>Uch zonali sxema: <b>Internet — DMZ — ichki tarmoq</b>. Internetdan faqat DMZ dagi serverlarning kerakli portlariga ruxsat; DMZ dan ichki tarmoqqa — faqat zarur ulanishlar (masalan, veb-serverdan ma'lumotlar bazasiga 5432-port). Veb-server buzilsa ham, hujumchi ichki tarmoqqa erkin kira olmaydi.</p>

<h2>4. VPN qo'shimcha yuki</h2>
<p>IPsec ESP tunnel rejimida har paketga yangi IP sarlavha (20 B), ESP sarlavha va to'ldirish, autentifikatsiya maydoni qo'shiladi — taxminan 50–60 bayt. Shuning uchun tunnel ichida MTU kichrayadi: 1500 − 60 = <b>1440</b> baytgacha. MTU noto'g'ri bo'lsa, katta paketlar fragmentlanadi yoki yo'qoladi — "VPN ulangan, lekin ba'zi saytlar ochilmaydi" holatining sababi ko'pincha shu.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi "Veb-serverni himoyalang" vazifasini 8 ta paketning hammasi to'g'ri ishlanguncha bajaring. Yakuniy qoidalar jadvalini hisobotga yozing.</li>
  <li>VPN bo'limida shifrlangan va shifrlanmagan paketni solishtiring.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Brandmauer qoidalari", "subtitle": "14-amaliy mashg'ulot", "emoji": "🧱"}, {"t": "points", "title": "Tamoyillar", "items": [{"e": "🎯", "text": "Aniqdan umumiyga"}, {"e": "⛔", "text": "Sukut — taqiq"}, {"e": "🔑", "text": "Eng kam ruxsat"}, {"e": "🔁", "text": "Stateful — javoblar avtomatik"}]}, {"t": "table", "title": "Namuna qoidalar", "head": ["#", "Amal", "Nima"], "rows": [["1", "Allow", "SSH faqat admin PC dan"], ["2", "Allow", "80, 443 hammaga"], ["3", "Allow", "DNS LAN dan"], ["4", "Deny", "qolgani"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "1: Deny any; 2: Allow TCP 443. HTTPS paketi?", "options": ["Sukutga bog'liq", "2-qoida bo'yicha o'tadi", "O'tadi", "To'siladi"], "answer": 3, "explain": "Birinchi mos qoida — Deny."}, {"t": "code", "title": "DMZ sxemasi", "code": "Internet ──► [FW] ──► DMZ (veb, pochta)\n                │\n                └──► Ichki tarmoq (faqat zarur ulanishlar)"}, {"t": "idea", "title": "VPN va MTU", "text": "Tunnel har paketga ~50–60 B qo'shadi. Ichki MTU ≈ 1440 B — aks holda katta paketlar yo'qoladi.", "emoji": "📦"}, {"t": "summary", "title": "Xulosa", "items": ["Qoidalar tartibi — natijani belgilaydi", "DMZ — ommaviy serverlarni ajratadi", "VPN MTU ni kamaytiradi"]}]$j$::jsonb,
  14, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('e47ce42f-273a-5ac5-9132-f65d849144a1', 'c54f41fe-df02-57f4-bb27-d8258143430f', 'b81001d2-f2ad-51ec-9698-2037ee1fd8d0', '85b00d48-a4e9-566a-8814-82dcffd0bb1e', '5f6d9847-3258-545f-87db-5e4f211ec6f8', '29e981c5-79ec-56ac-a3a4-3036f656583a');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('e47ce42f-273a-5ac5-9132-f65d849144a1', t, $kt$Brandmauerda qoidalar qaysi tartibda joylashtiriladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Tartib muhim emas", "is_correct": false}, {"id": "b", "text": "Alifbo bo'yicha", "is_correct": false}, {"id": "c", "text": "Umumiydan aniqga", "is_correct": false}, {"id": "d", "text": "Aniqdan umumiyga", "is_correct": true}]$j$::jsonb,
   $kt$Aks holda keng qoida torlarini 'soyada' qoldiradi.$kt$, 1, 0),
  ('c54f41fe-df02-57f4-bb27-d8258143430f', t, $kt$Holatni kuzatuvchi brandmauerda javob paketlari uchun qoida kerakmi?$kt$, 'single',
   $j$[{"id": "a", "text": "Ha, har biriga", "is_correct": false}, {"id": "b", "text": "Faqat ICMP uchun", "is_correct": false}, {"id": "c", "text": "Faqat UDP uchun", "is_correct": false}, {"id": "d", "text": "Yo'q, avtomatik o'tkaziladi", "is_correct": true}]$j$::jsonb,
   $kt$Ulanishlar jadvali bo'yicha.$kt$, 1, 1),
  ('b81001d2-f2ad-51ec-9698-2037ee1fd8d0', t, $kt$DMZ ning maqsadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Ommaviy serverlarni ichki tarmoqdan ajratish", "is_correct": true}, {"id": "b", "text": "Internetni tezlashtirish", "is_correct": false}, {"id": "c", "text": "DNS ni almashtirish", "is_correct": false}, {"id": "d", "text": "Wi-Fi ni himoyalash", "is_correct": false}]$j$::jsonb,
   $kt$Buzilgan server ichki tarmoqqa yo'l bermaydi.$kt$, 1, 2),
  ('85b00d48-a4e9-566a-8814-82dcffd0bb1e', t, $kt$IPsec tunnelida MTU taxminan qanchaga kamayadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Kamaymaydi", "is_correct": false}, {"id": "b", "text": "500 B", "is_correct": false}, {"id": "c", "text": "50–60 B", "is_correct": true}, {"id": "d", "text": "5–10 B", "is_correct": false}]$j$::jsonb,
   $kt$Yangi IP sarlavha, ESP va autentifikatsiya maydoni.$kt$, 1, 3),
  ('5f6d9847-3258-545f-87db-5e4f211ec6f8', t, $kt$'Allow TCP any any 22' qoidasining xavfi?$kt$, 'single',
   $j$[{"id": "a", "text": "DNS ishlamaydi", "is_correct": false}, {"id": "b", "text": "Veb yopiladi", "is_correct": false}, {"id": "c", "text": "Hech qanday", "is_correct": false}, {"id": "d", "text": "SSH butun Internetga ochiq", "is_correct": true}]$j$::jsonb,
   $kt$SSH faqat ishonchli manbalardan ochilishi kerak.$kt$, 1, 4),
  ('29e981c5-79ec-56ac-a3a4-3036f656583a', t, $kt$Qaysi qoidalar 'eng kam ruxsat' tamoyiliga mos?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Allow TCP any → 10.0.0.5:443", "is_correct": true}, {"id": "b", "text": "Allow TCP 192.168.1.50 → 10.0.0.5:22", "is_correct": true}, {"id": "c", "text": "Allow any any any", "is_correct": false}, {"id": "d", "text": "Allow UDP 192.168.1.0/24 → any:53", "is_correct": true}]$j$::jsonb,
   $kt$'Allow any any any' — hammasini ochadi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('ecd3d338-8bc0-5e75-b3c1-dbff25b7a532', '52186642-a115-5df6-bd82-089e042398ba', '7084fcb4-03e7-552a-9a82-9d6ec9fc72c8');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('ecd3d338-8bc0-5e75-b3c1-dbff25b7a532', t, $kt$Qoidalarni tekshiring$kt$, $kt$Qoidalar: 1) Allow TCP 192.168.1.50 → 10.0.0.5 port 22; 2) Allow TCP any → 10.0.0.5 port 80,443; 3) Allow UDP 192.168.1.0/24 → any port 53; 4) Deny any. Har paket qaysi qoida raqami bo'yicha qaror topadi?$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "8.8.8.8 → 10.0.0.5 TCP 443", "type": "number", "accept": ["2"]}, {"label": "192.168.1.50 → 10.0.0.5 TCP 22", "type": "number", "accept": ["1"]}, {"label": "192.168.1.70 → 10.0.0.5 TCP 22", "type": "number", "accept": ["4"]}, {"label": "192.168.1.70 → 8.8.8.8 UDP 53", "type": "number", "accept": ["3"]}, {"label": "8.8.8.8 → 10.0.0.5 TCP 3389", "type": "number", "accept": ["4"]}]}$j$::jsonb, NULL),
  ('52186642-a115-5df6-bd82-089e042398ba', t, $kt$VPN va MTU$kt$, $kt$Fizik MTU 1500 bayt. VPN tunneli har paketga 56 bayt qo'shadi. TCP va IP sarlavhalari 20 baytdan.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "MSS = MTU − IP − TCP."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Tunnel ichidagi MTU", "type": "number", "accept": ["1444"], "unit": "B"}, {"label": "Tunnel ichida bitta TCP segmentdagi maksimal ma'lumot (MSS)", "type": "number", "accept": ["1404"], "unit": "B"}]}$j$::jsonb, NULL),
  ('7084fcb4-03e7-552a-9a82-9d6ec9fc72c8', t, $kt$Brandmauer simulyatori$kt$, $kt$Birinchi qatorda N — qoidalar soni. Keyingi N qatorda: 'amal protokol port' (amal: allow/deny, protokol: tcp/udp/any, port: son yoki any). Keyin M — paketlar soni va M qatorda 'protokol port'.
Har paket uchun birinchi mos qoida amalini chiqaring; hech biri mos kelmasa — deny.$kt$,
   NULL,
   $kt$n = int(input())
# Kodingizni shu yerga yozing
$kt$, $kt$n = int(input())
rules = [input().split() for _ in range(n)]
m = int(input())
for _ in range(m):
    pr, port = input().split()
    res = 'deny'
    for a, rp, rport in rules:
        if rp in ('any', pr) and rport in ('any', port):
            res = a
            break
    print(res)$kt$, 'python',
   $j$[{"input": "2\nallow tcp 443\ndeny any any\n2\ntcp 443\ntcp 22", "expected_output": "allow\ndeny", "is_hidden": false}, {"input": "2\ndeny any any\nallow tcp 443\n1\ntcp 443", "expected_output": "deny", "is_hidden": false}, {"input": "1\nallow udp 53\n3\nudp 53\ntcp 53\nudp 67", "expected_output": "allow\ndeny\ndeny", "is_hidden": true}, {"input": "3\nallow tcp 80\nallow tcp 443\nallow udp any\n3\nudp 5000\ntcp 8080\ntcp 80", "expected_output": "allow\ndeny\nallow", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "Har paket uchun qoidalarni tartib bilan tekshirib, birinchi moslikda to'xtang (break)."}]$j$::jsonb, 'medium', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 15. 15-amaliy mashg'ulot: Diagnostika keys-stadilari. Buyruqlar natijasini tahlil qilish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$15-amaliy mashg'ulot: Diagnostika keys-stadilari. Buyruqlar natijasini tahlil qilish$kt$, 'kt-a15-diagnostika',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>Haqiqiy buyruq chiqishlariga qarab nosozlik sababini aniqlash va ping statistikasini hisoblash.</p>

<h2>Keys 1</h2>
<pre><code>C:\&gt; ipconfig
Ethernet adapter Ethernet:
   Autoconfiguration IPv4 Address. . : 169.254.112.7
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . :</code></pre>
<p><b>Tahlil:</b> APIPA manzil, shlyuz yo'q → DHCP serverdan javob kelmagan. <b>Tekshirish:</b> router/DHCP server ishlayaptimi, kabel to'g'ri portdami. <b>Yechim:</b> DHCP ni tiklash, <code>ipconfig /renew</code>.</p>

<h2>Keys 2</h2>
<pre><code>C:\&gt; ping 192.168.1.1        → Reply from 192.168.1.1: bytes=32 time&lt;1ms TTL=64
C:\&gt; ping 8.8.8.8            → Reply from 8.8.8.8: bytes=32 time=28ms TTL=117
C:\&gt; ping misol.uz           → Ping request could not find host misol.uz.</code></pre>
<p><b>Tahlil:</b> shlyuz va Internet IP bo'yicha ishlaydi, nom aniqlanmaydi → <b>DNS</b>. <b>Tekshirish:</b> <code>ipconfig /all</code> dagi DNS Servers, <code>nslookup misol.uz 8.8.8.8</code>.</p>

<h2>Keys 3</h2>
<pre><code>C:\&gt; tracert 185.74.5.10
  1    &lt;1 ms   &lt;1 ms   &lt;1 ms  192.168.1.1
  2     4 ms    5 ms    4 ms  10.10.0.1
  3    12 ms   11 ms   12 ms  213.230.64.1
  4     *       *       *     Request timed out.
  5     *       *       *     Request timed out.</code></pre>
<p><b>Tahlil:</b> provayder tarmog'idan (3-sakrash) keyin javob yo'q — muammo bizning tarmoqdan tashqarida yoki manzil ICMP ni bloklaydi. Boshqa saytlar ochilsa, mahalliy nosozlik yo'q.</p>

<h2>Keys 4. Ping statistikasi</h2>
<pre><code>Reply from 8.8.8.8: bytes=32 time=31ms TTL=117
Request timed out.
Reply from 8.8.8.8: bytes=32 time=45ms TTL=117
Reply from 8.8.8.8: bytes=32 time=29ms TTL=117</code></pre>
<p>Yuborildi 4, olindi 3, yo'qotish 1/4 = <b>25%</b>; vaqt: min 29, max 45, o'rtacha (31 + 45 + 29) / 3 = <b>35 ms</b>. Doimiy 1–5% dan ortiq yo'qotish — kanal sifati yomon (Wi-Fi xalaqiti, kabel nosozligi, tirbandlik).</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi terminalda beshta holatning har birini mustaqil tashxislang; har birida qaysi buyruq hal qiluvchi bo'lganini yozing.</li>
  <li>O'z kompyuteringizda <code>ping -n 20 8.8.8.8</code> bajaring va statistikani hisobotga kiriting.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Diagnostika keyslari", "subtitle": "15-amaliy mashg'ulot", "emoji": "🩺"}, {"t": "table", "title": "Belgi → sabab", "head": ["Chiqish", "Sabab"], "rows": [["169.254.x.x, shlyuz bo'sh", "DHCP"], ["IP ping bor, nom yo'q", "DNS"], ["tracert provayderdan keyin *", "tashqi muammo"], ["Media disconnected", "kabel"]]}, {"t": "code", "title": "Keys 2", "code": "ping 192.168.1.1  → Reply\nping 8.8.8.8      → Reply\nping misol.uz     → could not find host"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Keys 2 dagi sabab?", "options": ["Shlyuz", "DNS", "DHCP", "Kabel"], "answer": 1, "explain": "IP bo'yicha aloqa bor, nom aniqlanmayapti."}, {"t": "code", "title": "Ping statistikasi", "code": "31 ms, timeout, 45 ms, 29 ms\nyo'qotish = 1/4 = 25%\no'rtacha = (31 + 45 + 29) / 3 = 35 ms"}, {"t": "quiz", "title": "Tekshiramiz", "question": "10 ta so'rovdan 8 tasiga javob. Yo'qotish?", "options": ["2%", "8%", "20%", "80%"], "answer": 2, "explain": "2 / 10 = 20%."}, {"t": "summary", "title": "Xulosa", "items": ["Har keysda: tahlil → tekshirish → yechim", "IP va nom bo'yicha pingni solishtiring", "Yo'qotish va o'rtacha vaqtni hisoblang"]}]$j$::jsonb,
  15, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('0bdc716b-b9ba-59a4-a6e3-cfafb7b711f6', 'badd7088-5f0c-5053-9086-dbdb67c9cbc4', 'ee30a2cc-49da-5da8-8fff-4920eeaad80d', '0a425118-5b05-5c7b-80f3-36d06dbed081', 'b074dba5-3425-5e83-b9ce-2d8ff7145108', 'cbaa998d-6ed4-5720-80e1-e49bf05bb675');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('0bdc716b-b9ba-59a4-a6e3-cfafb7b711f6', t, $kt$Keys 1 da birinchi navbatda nimani tekshirasiz?$kt$, 'single',
   $j$[{"id": "a", "text": "DHCP server/router", "is_correct": true}, {"id": "b", "text": "DNS", "is_correct": false}, {"id": "c", "text": "Veb-sayt", "is_correct": false}, {"id": "d", "text": "Brandmauer", "is_correct": false}]$j$::jsonb,
   $kt$APIPA — DHCP javob bermagan.$kt$, 1, 0),
  ('badd7088-5f0c-5053-9086-dbdb67c9cbc4', t, $kt$tracert da 3-sakrashdan keyin faqat '*'. Eng to'g'ri xulosa?$kt$, 'single',
   $j$[{"id": "a", "text": "DNS ishlamayapti", "is_correct": false}, {"id": "b", "text": "Muammo tashqarida yoki ICMP bloklangan", "is_correct": true}, {"id": "c", "text": "Shlyuz noto'g'ri", "is_correct": false}, {"id": "d", "text": "Kompyuter kabeli uzilgan", "is_correct": false}]$j$::jsonb,
   $kt$Birinchi uch sakrash ishlayapti.$kt$, 1, 1),
  ('ee30a2cc-49da-5da8-8fff-4920eeaad80d', t, $kt$Ping: 31, timeout, 45, 29 ms. O'rtacha vaqt?$kt$, 'single',
   $j$[{"id": "a", "text": "26 ms", "is_correct": false}, {"id": "b", "text": "45 ms", "is_correct": false}, {"id": "c", "text": "35 ms", "is_correct": true}, {"id": "d", "text": "31 ms", "is_correct": false}]$j$::jsonb,
   $kt$Faqat javob kelganlar bo'yicha: 105 / 3.$kt$, 1, 2),
  ('0a425118-5b05-5c7b-80f3-36d06dbed081', t, $kt$Doimiy 10% yo'qotish nimani bildiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Kanal sifati yomon", "is_correct": true}, {"id": "b", "text": "Normal holat", "is_correct": false}, {"id": "c", "text": "Brandmauer qoidasi", "is_correct": false}, {"id": "d", "text": "DNS xatosi", "is_correct": false}]$j$::jsonb,
   $kt$Odatda 1% dan kam bo'ladi.$kt$, 1, 3),
  ('b074dba5-3425-5e83-b9ce-2d8ff7145108', t, $kt$DNS ni boshqa server orqali tekshirish buyrug'i?$kt$, 'single',
   $j$[{"id": "a", "text": "ipconfig /dns", "is_correct": false}, {"id": "b", "text": "tracert -d misol.uz", "is_correct": false}, {"id": "c", "text": "nslookup misol.uz 8.8.8.8", "is_correct": true}, {"id": "d", "text": "ping misol.uz 8.8.8.8", "is_correct": false}]$j$::jsonb,
   $kt$nslookup ning ikkinchi argumenti — DNS server.$kt$, 1, 4),
  ('cbaa998d-6ed4-5720-80e1-e49bf05bb675', t, $kt$Qaysi chiqishlar mahalliy (bizning tomondagi) nosozlikni bildiradi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Media disconnected", "is_correct": true}, {"id": "b", "text": "Destination host unreachable (o'z IP dan)", "is_correct": true}, {"id": "c", "text": "169.254.x.x manzil", "is_correct": true}, {"id": "d", "text": "tracert 4-sakrashdan keyin *", "is_correct": false}]$j$::jsonb,
   $kt$4-sakrashdan keyingi * — tashqarida.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('4e11bf2a-83b4-5f8d-9065-6f36daf4a240', 'df05073f-c79c-519e-bd3b-2f5ad4af4f76', '068a1c3c-5ee4-5ba2-b250-550b5258aabc');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('4e11bf2a-83b4-5f8d-9065-6f36daf4a240', t, $kt$Ping statistikasi$kt$, $kt$ping natijasi: time=12ms, time=15ms, Request timed out, time=11ms, time=22ms, Request timed out.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "O'rtacha faqat javob kelganlar bo'yicha: (12 + 15 + 11 + 22) / 4."}]$j$::jsonb, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Yuborildi", "type": "number", "accept": ["6"]}, {"label": "Olindi", "type": "number", "accept": ["4"]}, {"label": "Yo'qotish, % (butun son)", "type": "number", "accept": ["33"], "tol": 0.5, "unit": "%"}, {"label": "O'rtacha vaqt, ms", "type": "number", "accept": ["15"], "unit": "ms"}, {"label": "Maksimal vaqt, ms", "type": "number", "accept": ["22"], "unit": "ms"}]}$j$::jsonb, NULL),
  ('df05073f-c79c-519e-bd3b-2f5ad4af4f76', t, $kt$Keyslar$kt$, $kt$Har keys uchun sababni tanlang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "ipconfig: 169.254.5.9, shlyuz bo'sh", "type": "choice", "accept": ["DHCP"], "options": ["Kabel", "DHCP", "Shlyuz", "DNS", "Tashqi"]}, {"label": "ping 8.8.8.8 ishlaydi, ping misol.uz — could not find host", "type": "choice", "accept": ["DNS"], "options": ["Kabel", "DHCP", "Shlyuz", "DNS", "Tashqi"]}, {"label": "ping 192.168.1.20 ishlaydi; ping 8.8.8.8: Reply from 192.168.1.10: Destination host unreachable", "type": "choice", "accept": ["Shlyuz"], "options": ["Kabel", "DHCP", "Shlyuz", "DNS", "Tashqi"]}, {"label": "tracert: 1–3 sakrash javob beradi, keyin faqat *; boshqa saytlar ochiladi", "type": "choice", "accept": ["Tashqi"], "options": ["Kabel", "DHCP", "Shlyuz", "DNS", "Tashqi"]}]}$j$::jsonb, NULL),
  ('068a1c3c-5ee4-5ba2-b250-550b5258aabc', t, $kt$Ping statistikasi kalkulyatori$kt$, $kt$Bir qatorda bo'sh joy bilan javob vaqtlari (ms) — javob kelmagani '-' bilan belgilangan. Chiqaring:
1-qator: yo'qotish foizi (butun son, yaxlitlangan) va % belgisi;
2-qator: min max o'rtacha (o'rtacha butun songacha yaxlitlanadi). Hech javob bo'lmasa 2-qatorda '-' chiqaring.
Masalan: 31 - 45 29 → 25% va 29 45 35$kt$,
   NULL,
   $kt$qiymatlar = input().split()
# Kodingizni shu yerga yozing
$kt$, $kt$q = input().split()
t = [int(x) for x in q if x != '-']
print(str(round((len(q) - len(t)) * 100 / len(q))) + '%')
if t:
    print(min(t), max(t), round(sum(t) / len(t)))
else:
    print('-')$kt$, 'python',
   $j$[{"input": "31 - 45 29", "expected_output": "25%\n29 45 35", "is_hidden": false}, {"input": "12 15 - 11 22 -", "expected_output": "33%\n11 22 15", "is_hidden": false}, {"input": "- - - -", "expected_output": "100%\n-", "is_hidden": true}, {"input": "10 10 10 10", "expected_output": "0%\n10 10 10", "is_hidden": true}, {"input": "5 - 7", "expected_output": "33%\n5 7 6", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "Javoblar: '-' bo'lmagan elementlar."}, {"order": 2, "text": "round() — yaxlitlash."}]$j$::jsonb, 'medium', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

END $mig$;
