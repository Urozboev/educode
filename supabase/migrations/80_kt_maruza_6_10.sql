-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: Ma'ruzalar 6–10
--
-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
-- Manba: scripts/kontent/kompyuter-tarmoqlari/m06_10.py
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
  -- 6. 6-ma'ruza: Token Ring va boshqa texnologiyalar. 100VG-AnyLAN, FDDI, Wi-Fi
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$6-ma'ruza: Token Ring va boshqa texnologiyalar. 100VG-AnyLAN, FDDI, Wi-Fi$kt$, 'kt-m06-token-ring-wifi',
$kt$<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Markerli kirish usuli va Token Ring</li>
  <li>100VG-AnyLAN</li>
  <li>FDDI</li>
  <li>Wi-Fi (IEEE 802.11) texnologiyalari</li>
  <li>Texnologiyalarni solishtirish</li>
</ol>

<h2>1. Token Ring</h2>
<p><b>Token Ring</b> — IBM tomonidan ishlab chiqilgan va <b>IEEE 802.5</b> sifatida standartlashtirilgan lokal tarmoq texnologiyasi. Tezligi 4 va 16 Mbit/s.</p>
<p>Asosiy g'oya — <b>markerli (token) kirish</b>. Halqa bo'ylab maxsus qisqa kadr — <b>marker</b> aylanib yuradi. Uzatmoqchi bo'lgan stansiya bo'sh markerni ushlab, uni ma'lumot kadriga aylantiradi. Kadr halqa bo'ylab aylanadi, manzil stansiyasi nusxasini olib, "qabul qilindi" belgisini qo'yadi. Kadr yuboruvchiga qaytgach, u kadrni halqadan olib tashlaydi va yangi bo'sh marker chiqaradi.</p>
<ul>
  <li><b>To'qnashuv yo'q</b> — bir vaqtda faqat marker egasi uzatadi.</li>
  <li><b>Kafolatlangan kirish vaqti</b> — har stansiya navbati albatta keladi (markerni ushlab turish vaqti cheklangan). Shuning uchun yuklama yuqori bo'lganda Token Ring CSMA/CD dan barqarorroq ishlagan.</li>
  <li><b>Prioritetlar</b> — muhim ma'lumot uchun ustuvorlik bitlari.</li>
  <li><b>Erta marker chiqarish</b> (16 Mbit/s da) — stansiya kadr qaytishini kutmasdan yangi marker chiqaradi, halqada bir vaqtda bir nechta kadr bo'ladi.</li>
</ul>
<p>Fizik jihatdan stansiyalar <b>MAU</b> (Multistation Access Unit) markaziy qurilmasiga yulduz shaklida ulanadi, mantiqan esa halqa hosil qiladi: MAU signalni portdan portga navbat bilan uzatadi va o'chirilgan stansiyani avtomatik aylanib o'tadi. Signal differensial Manchester kodida uzatiladi.</p>

<h2>2. 100VG-AnyLAN</h2>
<p><b>IEEE 802.12</b> standarti (Hewlett-Packard taklifi). 100 Mbit/s tezlik, 3-kategoriyali (telefon sifatidagi — "Voice Grade") kabelning 4 juftida ishlagan. Kirish usuli — <b>talab bo'yicha ustuvorlik</b> (Demand Priority): markaziy konsentrator portlarni navbat bilan so'raydi, stansiyalar uzatish uchun so'rov yuboradi, konsentrator ruxsat beradi. Ikki ustuvorlik darajasi (oddiy va yuqori — multimedia uchun). Ham Ethernet, ham Token Ring kadrlarini tashiy olgan ("AnyLAN"). Texnik jihatdan yaxshi bo'lsa-da, arzonroq va eski Ethernet bilan mos Fast Ethernet bozorda yutdi.</p>

<h2>3. FDDI</h2>
<p><b>FDDI</b> (Fiber Distributed Data Interface) — ANSI tomonidan standartlashtirilgan (keyin ISO 9314), optik tolada ishlovchi 100 Mbit/s markerli tarmoq. 1990-yillarda kampus va shahar <b>magistral</b> tarmoqlari uchun ishlatilgan.</p>
<ul>
  <li><b>Ikki qarama-qarshi yo'nalishli halqa</b>: asosiy va zaxira. Normal holatda asosiy halqa ishlaydi.</li>
  <li>Bitta joyda kabel uzilsa yoki stansiya ishdan chiqsa, uzilish yonidagi stansiyalar ikki halqani birlashtiradi (<b>wrap</b>) — tarmoq bitta uzunroq halqa sifatida ishlashda davom etadi.</li>
  <li>Halqa uzunligi 100 km gacha, 500 tagacha stansiya.</li>
  <li>Kodlash: 4B/5B + NRZI. Mis kabeldagi varianti — CDDI.</li>
</ul>

<h2>4. Wi-Fi (IEEE 802.11)</h2>
<p>Simsiz lokal tarmoq (WLAN) standartlari oilasi. "Wi-Fi" — Wi-Fi Alliance savdo belgisi.</p>
<table>
  <tr><th>Standart</th><th>Avlod</th><th>Yil</th><th>Diapazon</th><th>Maks. kanal tezligi</th></tr>
  <tr><td>802.11b</td><td>—</td><td>1999</td><td>2,4 GHz</td><td>11 Mbit/s</td></tr>
  <tr><td>802.11a</td><td>—</td><td>1999</td><td>5 GHz</td><td>54 Mbit/s</td></tr>
  <tr><td>802.11g</td><td>—</td><td>2003</td><td>2,4 GHz</td><td>54 Mbit/s</td></tr>
  <tr><td>802.11n</td><td>Wi-Fi 4</td><td>2009</td><td>2,4 / 5 GHz</td><td>600 Mbit/s</td></tr>
  <tr><td>802.11ac</td><td>Wi-Fi 5</td><td>2013</td><td>5 GHz</td><td>~6,9 Gbit/s</td></tr>
  <tr><td>802.11ax</td><td>Wi-Fi 6 / 6E</td><td>2019–2020</td><td>2,4 / 5 / 6 GHz</td><td>~9,6 Gbit/s</td></tr>
  <tr><td>802.11be</td><td>Wi-Fi 7</td><td>2024</td><td>2,4 / 5 / 6 GHz</td><td>~46 Gbit/s</td></tr>
</table>
<p>Jadvaldagi tezliklar — nazariy maksimum; amalda bir necha baravar kam, chunki havo umumiy muhit va xizmat ma'lumoti ko'p.</p>
<h3>Ish rejimlari va tushunchalar</h3>
<ul>
  <li><b>Infratuzilma rejimi</b> — qurilmalar kirish nuqtasi (AP) orqali ulanadi. AP va unga ulangan mijozlar — BSS.</li>
  <li><b>Ad hoc rejimi</b> — qurilmalar bevosita, AP siz (IBSS).</li>
  <li><b>SSID</b> — tarmoq nomi; <b>BSSID</b> — AP radiomodulining MAC manzili.</li>
  <li><b>Kanallar</b>: 2,4 GHz da kanallar orasi 5 MHz, kenglik ~20–22 MHz, shuning uchun qo'shni kanallar bir-birini qoplaydi. Bir-birini qoplamaydigan uchlik — <b>1, 6, 11</b>. 5 GHz da kanallar ko'p va qoplanmaydi.</li>
</ul>
<h3>CSMA/CA</h3>
<p>Radioda stansiya o'zi uzatayotganda boshqa signalni eshitmaydi, shuning uchun to'qnashuvni <i>aniqlab</i> bo'lmaydi — undan <i>qochish</i> kerak (Collision Avoidance):</p>
<ol>
  <li>Kanal DIFS vaqti davomida bo'sh bo'lishini kutish.</li>
  <li>Tasodifiy kutish (backoff) hisoblagichi: kanal bo'sh paytda kamayadi, band bo'lsa to'xtaydi.</li>
  <li>Kadrni uzatish. Qabul qiluvchi SIFS kutib <b>ACK</b> yuboradi; ACK kelmasa — qayta urinish.</li>
  <li>Ixtiyoriy <b>RTS/CTS</b>: "yashirin stansiya" muammosini hal qiladi — AP yuborgan CTS ni uni eshitadigan hamma stansiyalar oladi va belgilangan vaqt jim turadi (NAV).</li>
</ol>
<h3>Xavfsizlik</h3>
<p>WEP (eskirgan, buziladi) → WPA (TKIP) → <b>WPA2</b> (AES-CCMP) → <b>WPA3</b> (SAE). Bugun WPA2 yoki WPA3 va kuchli parol ishlatilishi shart.</p>

<h2>5. Solishtirish</h2>
<table>
  <tr><th>Texnologiya</th><th>Kirish usuli</th><th>Topologiya</th><th>Tezlik</th></tr>
  <tr><td>Ethernet (klassik)</td><td>CSMA/CD</td><td>shina / yulduz</td><td>10 Mbit/s →</td></tr>
  <tr><td>Token Ring</td><td>marker</td><td>fizik yulduz, mantiqiy halqa</td><td>4 / 16 Mbit/s</td></tr>
  <tr><td>100VG-AnyLAN</td><td>talab bo'yicha ustuvorlik</td><td>yulduz</td><td>100 Mbit/s</td></tr>
  <tr><td>FDDI</td><td>marker (vaqtli)</td><td>ikki halqa, optika</td><td>100 Mbit/s</td></tr>
  <tr><td>Wi-Fi</td><td>CSMA/CA</td><td>radio, AP atrofida</td><td>11 Mbit/s → Gbit/s</td></tr>
</table>
<p>Token Ring, 100VG-AnyLAN va FDDI bugun deyarli ishlatilmaydi — ularning o'rnini kommutatorli Ethernet egalladi. Lekin markerli kirish, kafolatlangan kechikish va ikki halqali zaxira g'oyalari zamonaviy sanoat va provayder tarmoqlarida yashab qolmoqda.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Token Ring da marker qanday aylanadi va kadr halqadan kim tomonidan olib tashlanadi?</li>
  <li>Nega Token Ring yuqori yuklamada CSMA/CD dan barqarorroq?</li>
  <li>FDDI da kabel uzilganda tarmoq qanday ishlashda davom etadi?</li>
  <li>Wi-Fi da nega CSMA/CD emas, CSMA/CA ishlatiladi?</li>
  <li>2,4 GHz diapazonida qaysi kanallarni tanlash tavsiya etiladi va nima uchun?</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Token Ring, FDDI, Wi-Fi", "subtitle": "Ethernetdan tashqari texnologiyalar", "emoji": "💍"}, {"t": "idea", "title": "Marker g'oyasi", "text": "Halqada bitta marker aylanadi. Uni ushlagan stansiyagina uzatadi — to'qnashuv bo'lmaydi.", "emoji": "🎫"}, {"t": "points", "title": "Token Ring", "items": [{"e": "🏢", "text": "IBM, IEEE 802.5"}, {"e": "⚡", "text": "4 / 16 Mbit/s"}, {"e": "⭐", "text": "Fizik yulduz (MAU), mantiqiy halqa"}, {"e": "⏱️", "text": "Kafolatlangan kirish vaqti"}]}, {"t": "points", "title": "FDDI", "items": [{"e": "💡", "text": "Optika, 100 Mbit/s"}, {"e": "🔄", "text": "Ikki qarama-qarshi halqa"}, {"e": "🩹", "text": "Uzilishda halqalar birlashadi (wrap)"}, {"e": "🏙️", "text": "Kampus magistrallari"}]}, {"t": "table", "title": "Wi-Fi avlodlari", "head": ["Standart", "Nomi", "Tezlik"], "rows": [["802.11n", "Wi-Fi 4", "600 Mbit/s"], ["802.11ac", "Wi-Fi 5", "~6,9 Gbit/s"], ["802.11ax", "Wi-Fi 6/6E", "~9,6 Gbit/s"], ["802.11be", "Wi-Fi 7", "~46 Gbit/s"]], "note": "Nazariy maksimum"}, {"t": "compare", "title": "CSMA/CD va CSMA/CA", "left": {"label": "CSMA/CD (Ethernet)", "text": "To'qnashuvni ANIQLAYDI va qayta uzatadi"}, "right": {"label": "CSMA/CA (Wi-Fi)", "text": "To'qnashuvdan QOCHADI: kutish, ACK, RTS/CTS"}}, {"t": "quiz", "title": "Tekshiramiz", "question": "2,4 GHz da bir-birini qoplamaydigan kanallar?", "options": ["1, 7, 13", "1, 6, 11", "1, 2, 3", "6, 7, 8"], "answer": 1, "explain": "Kanallar 5 MHz oraliqda, kengligi ~20 MHz — 5 kanal oralig'i kerak."}, {"t": "quiz", "title": "Tekshiramiz", "question": "Token Ring da kadrni halqadan kim olib tashlaydi?", "options": ["Har bir keyingi stansiya", "Yuboruvchi stansiya", "Manzil stansiyasi", "MAU"], "answer": 1, "explain": "Kadr aylanib yuboruvchiga qaytadi, u yetkazilganini tekshirib olib tashlaydi."}, {"t": "summary", "title": "Xulosa", "items": ["Marker — to'qnashuvsiz va kafolatli kirish", "FDDI — ikki halqa bilan ishonchlilik", "Wi-Fi — CSMA/CA, kanallar 1/6/11, WPA2/WPA3", "Bugun simli LAN = kommutatorli Ethernet"]}]$j$::jsonb,
  6, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('c55b157b-d035-52c5-838d-2b39c91de10d', '02dca41a-f559-5fd3-9cc5-2e17b1c57ff4', 'a92f8109-047d-5417-8d80-d7132ed4426a', '0f26a6dd-5509-5eea-9655-901a664d7b5e', '9f12f267-385b-5df3-823b-cbdbb1b949bc', 'f578dd13-9011-5e1a-a81a-d12e4360462e', '33ef5da7-5dcc-52b2-a0dc-2dc7a3e851fe');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('c55b157b-d035-52c5-838d-2b39c91de10d', t, $kt$Token Ring qaysi IEEE standarti?$kt$, 'single',
   $j$[{"id": "a", "text": "802.3", "is_correct": false}, {"id": "b", "text": "802.11", "is_correct": false}, {"id": "c", "text": "802.12", "is_correct": false}, {"id": "d", "text": "802.5", "is_correct": true}]$j$::jsonb,
   $kt$802.3 — Ethernet, 802.11 — Wi-Fi, 802.12 — 100VG-AnyLAN.$kt$, 1, 0),
  ('02dca41a-f559-5fd3-9cc5-2e17b1c57ff4', t, $kt$Token Ring ning tezliklari qaysilar?$kt$, 'single',
   $j$[{"id": "a", "text": "4 va 16 Mbit/s", "is_correct": true}, {"id": "b", "text": "11 va 54 Mbit/s", "is_correct": false}, {"id": "c", "text": "100 va 1000 Mbit/s", "is_correct": false}, {"id": "d", "text": "10 va 100 Mbit/s", "is_correct": false}]$j$::jsonb,
   $kt$Klassik Token Ring 4 va 16 Mbit/s da ishlagan.$kt$, 1, 1),
  ('a92f8109-047d-5417-8d80-d7132ed4426a', t, $kt$FDDI da bitta kabel uzilsa nima bo'ladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Tarmoq to'liq to'xtaydi", "is_correct": false}, {"id": "b", "text": "Barcha stansiyalar CSMA/CD ga o'tadi", "is_correct": false}, {"id": "c", "text": "Ikki halqa birlashib, bitta halqa sifatida ishlaydi", "is_correct": true}, {"id": "d", "text": "Tezlik 2 baravar oshadi", "is_correct": false}]$j$::jsonb,
   $kt$Uzilish yonidagi stansiyalar halqalarni birlashtiradi (wrap).$kt$, 1, 2),
  ('0f26a6dd-5509-5eea-9655-901a664d7b5e', t, $kt$100VG-AnyLAN qanday kirish usulidan foydalangan?$kt$, 'single',
   $j$[{"id": "a", "text": "CSMA/CA", "is_correct": false}, {"id": "b", "text": "Talab bo'yicha ustuvorlik (Demand Priority)", "is_correct": true}, {"id": "c", "text": "CSMA/CD", "is_correct": false}, {"id": "d", "text": "Marker", "is_correct": false}]$j$::jsonb,
   $kt$Konsentrator stansiyalarning so'rovlarini navbat va ustuvorlik bo'yicha qondiradi.$kt$, 1, 3),
  ('9f12f267-385b-5df3-823b-cbdbb1b949bc', t, $kt$Nega Wi-Fi da to'qnashuvni aniqlash (CD) ishlatilmaydi?$kt$, 'single',
   $j$[{"id": "a", "text": "Stansiya uzatayotganda boshqa signalni eshita olmaydi", "is_correct": true}, {"id": "b", "text": "Wi-Fi da to'qnashuv bo'lmaydi", "is_correct": false}, {"id": "c", "text": "Radio juda tez", "is_correct": false}, {"id": "d", "text": "Standart buni taqiqlaydi", "is_correct": false}]$j$::jsonb,
   $kt$Shuning uchun Wi-Fi to'qnashuvdan qochadi va har kadrni ACK bilan tasdiqlaydi.$kt$, 1, 4),
  ('f578dd13-9011-5e1a-a81a-d12e4360462e', t, $kt$Wi-Fi 6 qaysi standart?$kt$, 'single',
   $j$[{"id": "a", "text": "802.11ax", "is_correct": true}, {"id": "b", "text": "802.11be", "is_correct": false}, {"id": "c", "text": "802.11n", "is_correct": false}, {"id": "d", "text": "802.11ac", "is_correct": false}]$j$::jsonb,
   $kt$Wi-Fi 4 — n, Wi-Fi 5 — ac, Wi-Fi 6 — ax, Wi-Fi 7 — be.$kt$, 1, 5),
  ('33ef5da7-5dcc-52b2-a0dc-2dc7a3e851fe', t, $kt$Hozirgi kunda simsiz tarmoq uchun qaysi himoya turlari tavsiya etiladi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "WEP", "is_correct": false}, {"id": "b", "text": "WPA3 (SAE)", "is_correct": true}, {"id": "c", "text": "WPA2 (AES)", "is_correct": true}, {"id": "d", "text": "WPA (TKIP)", "is_correct": false}]$j$::jsonb,
   $kt$WEP va TKIP eskirgan va zaif.$kt$, 2, 6)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('121a8483-f078-59d5-a2a1-a81a6375977e', '2b441a0e-f914-59da-8123-d5e4ca48522e');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('121a8483-f078-59d5-a2a1-a81a6375977e', t, $kt$Texnologiyalarni solishtiring$kt$, $kt$Ma'ruza materiali asosida qiymatlarni kiriting.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Token Ring ning yuqori tezligi, Mbit/s", "type": "number", "accept": ["16"]}, {"label": "FDDI tezligi, Mbit/s", "type": "number", "accept": ["100"]}, {"label": "FDDI da nechta halqa bor?", "type": "number", "accept": ["2"]}, {"label": "Wi-Fi 5 qaysi IEEE standarti? (masalan: 802.11n)", "type": "text", "accept": ["802.11ac", "ieee 802.11ac"]}]}$j$::jsonb, NULL),
  ('2b441a0e-f914-59da-8123-d5e4ca48522e', t, $kt$Kanal rejasi$kt$, $kt$Bitta qavatda uchta kirish nuqtasi o'rnatilmoqda (2,4 GHz). Ularga qaysi kanallarni berasiz? Kichigidan kattasiga.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Qo'shni kanallar spektri ustma-ust tushmasligi uchun oralig'i kamida 5 bo'lishi kerak."}, {"order": 2, "text": "Virtual simulyatsiyadagi Wi-Fi bo'limida sinab ko'ring."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "AP1 kanali", "type": "number", "accept": ["1"]}, {"label": "AP2 kanali", "type": "number", "accept": ["6"]}, {"label": "AP3 kanali", "type": "number", "accept": ["11"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 7. 7-ma'ruza: TCP/IP protokollar steki. IP protokoli va adreslash usullari
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$7-ma'ruza: TCP/IP protokollar steki. IP protokoli va adreslash usullari$kt$, 'kt-m07-tcp-ip',
$kt$<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Tarmoqlararo ma'lumot almashish tamoyillari</li>
  <li>TCP/IP steki tuzilishi</li>
  <li>IP protokoli va IPv4 paketi</li>
  <li>IPv4 manzillari: sinflar, maska, CIDR</li>
  <li>Maxsus va xususiy manzillar, NAT</li>
  <li>IPv6 haqida qisqacha</li>
</ol>

<h2>1. Tarmoqlararo almashish</h2>
<p>Har bir lokal tarmoq o'z texnologiyasida (Ethernet, Wi-Fi) ishlaydi va o'z manzillash tizimiga (MAC) ega. Turli tarmoqlarni birlashtirish uchun <b>umumiy, texnologiyaga bog'liq bo'lmagan</b> manzillash va yo'naltirish kerak. TCP/IP buni tarmoq pog'onasida — <b>IP manzil</b> va <b>marshrutizatorlar</b> yordamida hal qiladi. Marshrutizator har bir tarmoqqa ulangan interfeysga ega va paketni bir tarmoqdan boshqasiga o'tkazadi. Paket yo'lda bir necha kanal texnologiyasidan o'tishi mumkin, lekin IP manzillar o'zgarmaydi; har bir kanal bo'lagida faqat MAC manzillar yangilanadi.</p>

<h2>2. TCP/IP steki</h2>
<table>
  <tr><th>Pog'ona</th><th>Vazifasi</th><th>Protokollar</th></tr>
  <tr><td>Amaliy</td><td>Foydalanuvchi xizmatlari</td><td>HTTP, DNS, SMTP, FTP, DHCP, SSH</td></tr>
  <tr><td>Transport</td><td>Jarayonlar orasida yetkazish (portlar)</td><td>TCP, UDP</td></tr>
  <tr><td>Internet</td><td>Manzillash va marshrutlash</td><td>IP, ICMP, (ARP)</td></tr>
  <tr><td>Tarmoqqa kirish</td><td>Muayyan muhitda kadr uzatish</td><td>Ethernet, Wi-Fi, PPP</td></tr>
</table>
<p>Steklar standartlari IETF tomonidan <b>RFC</b> (Request for Comments) hujjatlarida e'lon qilinadi: IPv4 — RFC 791, TCP — RFC 793 (yangilangani RFC 9293), UDP — RFC 768.</p>

<h2>3. IP protokoli</h2>
<p>IP — <b>ulanishsiz</b> va <b>kafolatsiz</b> ("best effort") protokol: har paket mustaqil yuboriladi, yetib borishi, tartibi va takrorlanmasligi kafolatlanmaydi — bu vazifa yuqori pog'onaga (TCP) qoldirilgan. IPv4 sarlavhasi kamida 20 bayt:</p>
<table>
  <tr><th>Maydon</th><th>Vazifasi</th></tr>
  <tr><td>Version (4 bit)</td><td>4 — IPv4</td></tr>
  <tr><td>IHL</td><td>Sarlavha uzunligi (32 bitli so'zlarda), odatda 5 = 20 bayt</td></tr>
  <tr><td>DSCP/ToS</td><td>Xizmat sifati (QoS) belgisi</td></tr>
  <tr><td>Total Length</td><td>Paketning umumiy uzunligi, ≤ 65 535 bayt</td></tr>
  <tr><td>Identification, Flags, Fragment Offset</td><td>Fragmentatsiya: paket MTU dan katta bo'lsa bo'laklarga bo'linadi</td></tr>
  <tr><td><b>TTL</b></td><td>Har marshrutizatorda 1 ga kamayadi; 0 bo'lsa paket tashlanadi (halqalardan himoya)</td></tr>
  <tr><td>Protocol</td><td>Ichida nima: 1 — ICMP, 6 — TCP, 17 — UDP</td></tr>
  <tr><td>Header Checksum</td><td>Sarlavha nazorat yig'indisi</td></tr>
  <tr><td>Source / Destination Address</td><td>Manba va manzil IP (32 bitdan)</td></tr>
</table>

<h2>4. IPv4 manzillari</h2>
<p>IPv4 manzil — 32 bitli son, 4 ta 8 bitli oktetga bo'linib, o'nlik sanoqda nuqta bilan yoziladi: <code>192.168.1.10</code> = <code>11000000.10101000.00000001.00001010</code>. Manzil ikki qismdan iborat: <b>tarmoq qismi</b> va <b>xost qismi</b>. Qayerdan bo'linishini <b>maska</b> ko'rsatadi: maskada tarmoq bitlari 1, xost bitlari 0.</p>
<h3>4.1. Sinfli manzillash</h3>
<table>
  <tr><th>Sinf</th><th>Birinchi oktet</th><th>Birinchi bitlar</th><th>Standart maska</th><th>Tarmoqlar / xostlar</th></tr>
  <tr><td>A</td><td>1–126</td><td>0</td><td>255.0.0.0 (/8)</td><td>126 / 16 777 214</td></tr>
  <tr><td>B</td><td>128–191</td><td>10</td><td>255.255.0.0 (/16)</td><td>16 384 / 65 534</td></tr>
  <tr><td>C</td><td>192–223</td><td>110</td><td>255.255.255.0 (/24)</td><td>2 097 152 / 254</td></tr>
  <tr><td>D</td><td>224–239</td><td>1110</td><td>—</td><td>multicast</td></tr>
  <tr><td>E</td><td>240–255</td><td>1111</td><td>—</td><td>zaxira</td></tr>
</table>
<p>Sinfli tizim manzillarni isrof qilardi: 300 ta kompyuterli tashkilotga C sinf (254) yetmaydi, B sinf esa 65 534 xost beradi. Shuning uchun 1993-yilda <b>CIDR</b> (sinfsiz manzillash) joriy qilindi.</p>
<h3>4.2. CIDR va maska</h3>
<p>CIDR da tarmoq qismi uzunligi istalgan bo'lishi mumkin va <b>prefiks</b> bilan yoziladi: <code>/24</code> — birinchi 24 bit tarmoq. Maska: /24 = 255.255.255.0, /26 = 255.255.255.192, /20 = 255.255.240.0.</p>
<ul>
  <li><b>Tarmoq manzili</b> = IP AND maska (xost bitlari hammasi 0).</li>
  <li><b>Broadcast manzil</b> — xost bitlari hammasi 1.</li>
  <li><b>Xostlar soni</b> = 2<sup>(32 − prefiks)</sup> − 2 (tarmoq va broadcast manzillar xostga berilmaydi).</li>
</ul>
<p><b>Misol.</b> <code>172.16.45.200/20</code>: maska 255.255.240.0, uchinchi oktet 45 = 0010 1101, maskada 1111 0000 → 0010 0000 = 32. Tarmoq — <b>172.16.32.0</b>, broadcast — <b>172.16.47.255</b>, xostlar 172.16.32.1 – 172.16.47.254, soni 2<sup>12</sup> − 2 = <b>4094</b>.</p>

<h2>5. Maxsus va xususiy manzillar</h2>
<table>
  <tr><th>Diapazon</th><th>Vazifasi</th></tr>
  <tr><td>10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</td><td><b>Xususiy</b> (RFC 1918) — Internetda marshrutlanmaydi, ichki tarmoqlar uchun</td></tr>
  <tr><td>127.0.0.0/8</td><td>Loopback — kompyuterning o'zi (127.0.0.1)</td></tr>
  <tr><td>169.254.0.0/16</td><td>APIPA — DHCP server topilmaganda avtomatik beriladi</td></tr>
  <tr><td>0.0.0.0</td><td>"Bu tarmoq / noma'lum manzil"; marshrut jadvalida — sukut marshruti</td></tr>
  <tr><td>255.255.255.255</td><td>Cheklangan broadcast — joriy tarmoqdagi hammaga</td></tr>
</table>
<p>Xususiy manzilli kompyuterlar Internetga <b>NAT</b> (Network Address Translation) orqali chiqadi: marshrutizator chiquvchi paketdagi xususiy manzilni o'zining ommaviy manziliga almashtiradi va javobni qaytarishda teskari almashtiradi. Bitta ommaviy IP orqali butun ofis Internetga chiqadi.</p>

<h2>6. IPv6</h2>
<p>IPv4 manzillari (~4,3 mlrd) tugagani sababli <b>IPv6</b> ishlab chiqilgan: 128 bitli manzil, 16 lik sanoqda 8 guruh bo'lib yoziladi: <code>2001:0db8:0000:0000:0000:ff00:0042:8329</code>. Qisqartirish: guruh boshidagi nollar tushirib qoldiriladi, ketma-ket nol guruhlar bir marta <code>::</code> bilan almashtiriladi → <code>2001:db8::ff00:42:8329</code>. IPv6 da broadcast yo'q (multicast ishlatiladi), sarlavha soddalashtirilgan, avtosozlash (SLAAC) mavjud.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega IP "kafolatsiz" protokol deyiladi va bu kamchilikni kim to'ldiradi?</li>
  <li>TTL maydoni nima uchun kerak?</li>
  <li>10.200.30.40 qaysi sinfga tegishli va u xususiymi?</li>
  <li>/27 prefiksli tarmoqda nechta xost bo'ladi?</li>
  <li>NAT nima uchun kerak?</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "TCP/IP va IPv4 manzillash", "subtitle": "Tarmoqlarni bitta Internetga birlashtirish", "emoji": "🌍"}, {"t": "table", "title": "TCP/IP steki", "head": ["Pog'ona", "Protokollar"], "rows": [["Amaliy", "HTTP, DNS, SMTP"], ["Transport", "TCP, UDP"], ["Internet", "IP, ICMP"], ["Tarmoqqa kirish", "Ethernet, Wi-Fi"]]}, {"t": "points", "title": "IP xususiyatlari", "items": [{"e": "📮", "text": "Ulanishsiz — har paket mustaqil"}, {"e": "🤷", "text": "Kafolatsiz (best effort)"}, {"e": "⏳", "text": "TTL — har routerda −1"}, {"e": "🔢", "text": "Protocol: 1 ICMP, 6 TCP, 17 UDP"}]}, {"t": "code", "title": "IP manzil ikkilikda", "code": "192.168.1.10\n11000000.10101000.00000001.00001010", "note": "4 oktet × 8 bit = 32 bit"}, {"t": "table", "title": "Sinflar", "head": ["Sinf", "1-oktet", "Standart maska"], "rows": [["A", "1–126", "/8"], ["B", "128–191", "/16"], ["C", "192–223", "/24"], ["D", "224–239", "multicast"]]}, {"t": "idea", "title": "Uchta formula", "text": "Tarmoq = IP AND maska.  Broadcast = xost bitlari hammasi 1.  Xostlar = 2^(32 − prefiks) − 2.", "emoji": "🧮"}, {"t": "code", "title": "Misol: 172.16.45.200/20", "code": "Maska:      255.255.240.0\nTarmoq:     172.16.32.0\nBroadcast:  172.16.47.255\nXostlar:    172.16.32.1 – 172.16.47.254 (4094 ta)"}, {"t": "quiz", "title": "Tekshiramiz", "question": "/26 tarmoqda nechta xost bo'ladi?", "options": ["64", "62", "30", "126"], "answer": 1, "explain": "2⁶ − 2 = 62."}, {"t": "table", "title": "Maxsus manzillar", "head": ["Diapazon", "Vazifasi"], "rows": [["10/8, 172.16/12, 192.168/16", "Xususiy"], ["127.0.0.1", "Loopback"], ["169.254.x.x", "APIPA — DHCP yo'q"], ["255.255.255.255", "Broadcast"]]}, {"t": "compare", "title": "IPv4 va IPv6", "left": {"label": "IPv4", "text": "32 bit, ~4,3 mlrd manzil, 192.168.1.10"}, "right": {"label": "IPv6", "text": "128 bit, 2001:db8::ff00:42:8329, broadcast yo'q"}}, {"t": "summary", "title": "Xulosa", "items": ["IP — tarmoqlararo manzillash va yo'naltirish", "Maska tarmoq va xost qismini ajratadi", "CIDR sinflar o'rniga istalgan prefiks", "Xususiy manzillar NAT orqali Internetga chiqadi"]}]$j$::jsonb,
  7, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('b8c3a0a6-629f-5bde-9b53-deee32e47f61', '96501caa-9dc2-5c61-80c8-c20cd877d9fc', '209decda-6d02-55cc-8c53-86850e754ca8', '89abe4ae-5ffb-546b-b7a3-13b92e099418', '5d654f7b-1887-5497-a78f-d4821b334e6d', 'a5161ec7-f7c0-59f8-bc42-e623827672a5', 'ec3444dc-e4d2-57ea-883e-74a847bd286a');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('b8c3a0a6-629f-5bde-9b53-deee32e47f61', t, $kt$IPv4 manzil necha bitdan iborat?$kt$, 'single',
   $j$[{"id": "a", "text": "48", "is_correct": false}, {"id": "b", "text": "32", "is_correct": true}, {"id": "c", "text": "128", "is_correct": false}, {"id": "d", "text": "16", "is_correct": false}]$j$::jsonb,
   $kt$4 oktet × 8 bit.$kt$, 1, 0),
  ('96501caa-9dc2-5c61-80c8-c20cd877d9fc', t, $kt$IP sarlavhasidagi Protocol = 6 nimani bildiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "UDP", "is_correct": false}, {"id": "b", "text": "ARP", "is_correct": false}, {"id": "c", "text": "ICMP", "is_correct": false}, {"id": "d", "text": "TCP", "is_correct": true}]$j$::jsonb,
   $kt$1 — ICMP, 6 — TCP, 17 — UDP.$kt$, 1, 1),
  ('209decda-6d02-55cc-8c53-86850e754ca8', t, $kt$TTL qiymati 0 ga yetsa marshrutizator nima qiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Paketni broadcast qiladi", "is_correct": false}, {"id": "b", "text": "Paketni tashlaydi va ICMP Time Exceeded yuboradi", "is_correct": true}, {"id": "c", "text": "TTL ni 64 ga tiklaydi", "is_correct": false}, {"id": "d", "text": "Paketni manzilga yetkazadi", "is_correct": false}]$j$::jsonb,
   $kt$TTL marshrutlash halqalarida paketlar abadiy aylanishining oldini oladi.$kt$, 1, 2),
  ('89abe4ae-5ffb-546b-b7a3-13b92e099418', t, $kt$150.20.30.40 qaysi sinfga tegishli?$kt$, 'single',
   $j$[{"id": "a", "text": "B", "is_correct": true}, {"id": "b", "text": "D", "is_correct": false}, {"id": "c", "text": "C", "is_correct": false}, {"id": "d", "text": "A", "is_correct": false}]$j$::jsonb,
   $kt$Birinchi oktet 128–191 — B sinf.$kt$, 1, 3),
  ('5d654f7b-1887-5497-a78f-d4821b334e6d', t, $kt$Qaysi manzil xususiy (RFC 1918)?$kt$, 'single',
   $j$[{"id": "a", "text": "172.32.1.5", "is_correct": false}, {"id": "b", "text": "193.168.1.1", "is_correct": false}, {"id": "c", "text": "8.8.8.8", "is_correct": false}, {"id": "d", "text": "172.20.1.5", "is_correct": true}]$j$::jsonb,
   $kt$172.16.0.0 – 172.31.255.255 xususiy; 172.32 — yo'q.$kt$, 1, 4),
  ('a5161ec7-f7c0-59f8-bc42-e623827672a5', t, $kt$/27 prefiksning maskasi qaysi?$kt$, 'single',
   $j$[{"id": "a", "text": "255.255.255.0", "is_correct": false}, {"id": "b", "text": "255.255.255.240", "is_correct": false}, {"id": "c", "text": "255.255.255.192", "is_correct": false}, {"id": "d", "text": "255.255.255.224", "is_correct": true}]$j$::jsonb,
   $kt$27 ta bir: oxirgi oktet 11100000 = 224.$kt$, 1, 5),
  ('ec3444dc-e4d2-57ea-883e-74a847bd286a', t, $kt$Kompyuter 169.254.15.3 manzil olgan. Bu nimani bildiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Manzil qo'lda berilgan", "is_correct": false}, {"id": "b", "text": "Internet ishlayapti", "is_correct": false}, {"id": "c", "text": "DHCP serverdan javob kelmagan", "is_correct": true}, {"id": "d", "text": "Bu loopback manzil", "is_correct": false}]$j$::jsonb,
   $kt$APIPA manzili — DHCP topilmaganda kompyuter o'ziga o'zi beradi.$kt$, 1, 6)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('0efd522c-bdd0-5dd1-88d1-85055913a457', '433d544b-392f-5d80-8309-e811eb0e9605', 'ae29bcd0-58fe-562d-bc88-73b3e6a555fe');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('0efd522c-bdd0-5dd1-88d1-85055913a457', t, $kt$Tarmoqni hisoblang$kt$, $kt$Kompyuterning manzili 172.16.45.200/20. Hisoblang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Faqat 3-oktet 'qiziq': 45 ni ikkilikka o'tkazing va maskaning 3-okteti (240) bilan AND qiling."}, {"order": 2, "text": "Broadcast: tarmoq + blok o'lchami − 1. /20 da 3-oktet bo'yicha blok = 16."}]$j$::jsonb, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Maska (o'nlik)", "type": "ip", "accept": ["255.255.240.0"]}, {"label": "Tarmoq manzili", "type": "ip", "accept": ["172.16.32.0"]}, {"label": "Broadcast manzil", "type": "ip", "accept": ["172.16.47.255"]}, {"label": "Xostlar soni", "type": "number", "accept": ["4094"]}]}$j$::jsonb, NULL),
  ('433d544b-392f-5d80-8309-e811eb0e9605', t, $kt$Sinf va turi$kt$, $kt$Har bir manzil uchun sinfni kiriting (A, B, C, D yoki E).$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "10.200.30.40", "type": "choice", "accept": ["A"], "options": ["A", "B", "C", "D", "E"]}, {"label": "191.255.0.1", "type": "choice", "accept": ["B"], "options": ["A", "B", "C", "D", "E"]}, {"label": "223.1.1.1", "type": "choice", "accept": ["C"], "options": ["A", "B", "C", "D", "E"]}, {"label": "224.0.0.5", "type": "choice", "accept": ["D"], "options": ["A", "B", "C", "D", "E"]}]}$j$::jsonb, NULL),
  ('ae29bcd0-58fe-562d-bc88-73b3e6a555fe', t, $kt$IP manzil ikkilikda$kt$, $kt$Bitta qatorda IPv4 manzil kiritiladi. Uni ikkilik ko'rinishda chiqaring: har oktet 8 ta raqam, oktetlar nuqta bilan ajratiladi.
Masalan: 192.168.1.10 → 11000000.10101000.00000001.00001010$kt$,
   NULL,
   $kt$ip = input()
# Kodingizni shu yerga yozing
$kt$, $kt$ip = input().strip()
print('.'.join(format(int(x), '08b') for x in ip.split('.')))$kt$, 'python',
   $j$[{"input": "192.168.1.10", "expected_output": "11000000.10101000.00000001.00001010", "is_hidden": false}, {"input": "10.0.0.1", "expected_output": "00001010.00000000.00000000.00000001", "is_hidden": false}, {"input": "255.255.240.0", "expected_output": "11111111.11111111.11110000.00000000", "is_hidden": true}, {"input": "172.16.45.200", "expected_output": "10101100.00010000.00101101.11001000", "is_hidden": true}, {"input": "0.0.0.0", "expected_output": "00000000.00000000.00000000.00000000", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "input().split('.') — 4 ta matn bo'lak."}, {"order": 2, "text": "format(son, '08b') — 8 xonali ikkilik yozuv."}]$j$::jsonb, 'easy', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 8. 8-ma'ruza: Tarmoq protokollari (ARP, ICMP, DHCP) va marshrutlash protokollari
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$8-ma'ruza: Tarmoq protokollari (ARP, ICMP, DHCP) va marshrutlash protokollari$kt$, 'kt-m08-protokollar-marshrutlash',
$kt$<h2>Ma'ruza rejasi</h2>
<ol>
  <li>ARP — IP manzildan MAC manzilni topish</li>
  <li>ICMP — xizmat xabarlari, ping va tracert</li>
  <li>DHCP — manzillarni avtomatik taqsimlash</li>
  <li>Marshrutlash va marshrut jadvali</li>
  <li>Statik va dinamik marshrutlash</li>
  <li>RIP, OSPF, BGP</li>
</ol>

<h2>1. ARP</h2>
<p>Kompyuter paketni bir segment ichida yuborish uchun manzilning <b>MAC</b>ini bilishi kerak, lekin unga faqat <b>IP</b> ma'lum. <b>ARP</b> (Address Resolution Protocol) bu muammoni hal qiladi:</p>
<ol>
  <li>Kompyuter avval o'z <b>ARP keshidan</b> qidiradi (<code>arp -a</code>).</li>
  <li>Topilmasa, <b>ARP Request</b> yuboradi — <b>broadcast</b> kadr (FF-FF-FF-FF-FF-FF): "192.168.1.20 kimda? 192.168.1.10 ga ayting".</li>
  <li>Segmentdagi hamma so'rovni oladi, lekin faqat shu IP egasi <b>ARP Reply</b> (unicast) bilan javob beradi: "192.168.1.20 — BB-BB-…".</li>
  <li>Javob keshga yoziladi va keyingi paketlar so'rovsiz yuboriladi.</li>
</ol>
<p>Manzil <b>boshqa tarmoqda</b> bo'lsa, kompyuter manzilning emas, <b>shlyuzning</b> MAC manzilini so'raydi — paket avval marshrutizatorga yuboriladi. ARP autentifikatsiyasiz ishlagani sababli hujumchi soxta javoblar bilan trafikni o'ziga burishi mumkin (ARP spoofing).</p>

<h2>2. ICMP</h2>
<p><b>ICMP</b> (Internet Control Message Protocol) — IP ning yordamchi protokoli: xatolar va diagnostika xabarlarini tashiydi.</p>
<table>
  <tr><th>Tur</th><th>Xabar</th><th>Qachon</th></tr>
  <tr><td>8 / 0</td><td>Echo Request / Echo Reply</td><td><code>ping</code> — manzil javob beradimi</td></tr>
  <tr><td>3</td><td>Destination Unreachable</td><td>Tarmoq, xost yoki port yetib bo'lmaydi</td></tr>
  <tr><td>11</td><td>Time Exceeded</td><td>TTL 0 ga yetdi — <code>tracert</code> shundan foydalanadi</td></tr>
  <tr><td>5</td><td>Redirect</td><td>"Bu manzilga boshqa shlyuz orqali boring"</td></tr>
</table>
<p><code>tracert</code> TTL=1, 2, 3… bilan paketlar yuboradi: har bir marshrutizator TTL ni 0 ga tushirganda Time Exceeded qaytaradi va shu bilan o'zini "ko'rsatadi". Natijada yo'ldagi barcha marshrutizatorlar ro'yxati hosil bo'ladi.</p>

<h2>3. DHCP</h2>
<p><b>DHCP</b> (Dynamic Host Configuration Protocol) kompyuterlarga IP manzil, maska, shlyuz va DNS server manzilini avtomatik beradi. UDP ustida ishlaydi: server — 67-port, mijoz — 68-port. Manzil olish to'rt bosqichli (<b>DORA</b>):</p>
<ol>
  <li><b>Discover</b> — mijoz serverni bilmaydi, broadcast yuboradi (manba 0.0.0.0).</li>
  <li><b>Offer</b> — server bo'sh manzil taklif qiladi.</li>
  <li><b>Request</b> — mijoz taklifni so'raydi (broadcast — boshqa serverlar ham bilsin).</li>
  <li><b>Ack</b> — server tasdiqlaydi.</li>
</ol>
<p>Manzil <b>ijaraga</b> (lease) beriladi. Ijaraning 50% ida (T1) mijoz uni o'z serveridan uzaytirishni so'raydi, 87,5% ida (T2) — istalgan serverdan. Doimiy manzil kerak bo'lgan qurilmalarga (printer, server) MAC bo'yicha <b>zaxira</b> (reservation) qilinadi. DHCP broadcast marshrutizatordan o'tmaydi, shuning uchun boshqa tarmoqdagi server uchun <b>DHCP relay</b> sozlanadi.</p>

<h2>4. Marshrutlash</h2>
<p><b>Marshrutlash</b> — paket uchun manzil tarmog'iga yo'l tanlash. Marshrutizator har paketning manzil IP sini o'z <b>marshrut jadvali</b> bilan solishtiradi. Jadval yozuvi:</p>
<table>
  <tr><th>Tarmoq / prefiks</th><th>Keyingi sakrash (next hop)</th><th>Interfeys</th><th>Metrika</th></tr>
  <tr><td>192.168.1.0/24</td><td>— (to'g'ridan-to'g'ri ulangan)</td><td>Gi0/0</td><td>0</td></tr>
  <tr><td>10.1.0.0/16</td><td>172.16.0.2</td><td>Gi0/1</td><td>20</td></tr>
  <tr><td>0.0.0.0/0</td><td>203.0.113.1</td><td>Gi0/2</td><td>1</td></tr>
</table>
<ul>
  <li>Bir nechta yozuv mos kelsa, <b>eng uzun prefiksli</b> (eng aniq) yozuv tanlanadi.</li>
  <li><code>0.0.0.0/0</code> — <b>sukut marshruti</b>: boshqa hech narsa mos kelmasa (odatda provayderga).</li>
  <li>Marshrutizator butun yo'lni emas, faqat <b>keyingi sakrashni</b> biladi.</li>
</ul>

<h2>5. Statik va dinamik marshrutlash</h2>
<ul>
  <li><b>Statik</b> — administrator marshrutlarni qo'lda kiritadi (<code>ip route 10.1.0.0 255.255.0.0 172.16.0.2</code>). Sodda, resurs talab qilmaydi, lekin tarmoq o'zgarsa avtomatik moslashmaydi. Kichik tarmoqlar va sukut marshruti uchun.</li>
  <li><b>Dinamik</b> — marshrutizatorlar marshrutlash protokollari orqali bir-biriga ma'lumot almashadi va jadvalni o'zi tuzadi; kabel uzilsa yangi yo'l topadi (<b>konvergensiya</b>).</li>
</ul>

<h2>6. Marshrutlash protokollari</h2>
<table>
  <tr><th></th><th>RIP</th><th>OSPF</th><th>BGP</th></tr>
  <tr><td>Turi</td><td>Masofa-vektor</td><td>Kanal holati (link-state)</td><td>Yo'l-vektor</td></tr>
  <tr><td>Algoritm</td><td>Bellman-Ford</td><td>Dijkstra (SPF)</td><td>siyosatlar asosida</td></tr>
  <tr><td>Metrika</td><td>sakrashlar soni (max 15)</td><td>narx (cost) = 10<sup>8</sup> / tezlik</td><td>AS yo'li, atributlar</td></tr>
  <tr><td>Qo'llanilishi</td><td>kichik tarmoqlar</td><td>korporativ tarmoqlar (IGP)</td><td>Internet: avtonom tizimlar orasida (EGP)</td></tr>
</table>
<p><b>Masofa-vektor</b>: har marshrutizator qo'shnilariga o'z jadvalini davriy yuboradi (RIP — har 30 s) — "eshitganini aytib beradi". <b>Kanal holati</b>: har marshrutizator butun tarmoq xaritasini yig'adi va Dijkstra algoritmi bilan eng qisqa yo'llarni o'zi hisoblaydi — tezroq konvergensiya va kanal tezligini hisobga oladi.</p>
<p><b>Dijkstra misoli</b> (simulyatsiyadagi graf): R1 dan R6 gacha eng arzon yo'l — <b>R1 → R2 → R3 → R5 → R6</b>, narxi <b>8</b>. RIP metrikasi bo'yicha esa R1 → R6 atigi 3 sakrash, lekin u yo'l OSPF narxi bo'yicha qimmatroq — RIP kanal tezligini bilmaydi.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega ARP so'rovi broadcast, javobi esa unicast?</li>
  <li>tracert qanday qilib yo'ldagi marshrutizatorlarni aniqlaydi?</li>
  <li>DORA bosqichlarini tushuntiring.</li>
  <li>Eng uzun prefiks qoidasini misol bilan tushuntiring.</li>
  <li>RIP va OSPF ning asosiy farqi nimada?</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "ARP, ICMP, DHCP va marshrutlash", "subtitle": "Tarmoqning yordamchi protokollari", "emoji": "🧭"}, {"t": "points", "title": "ARP", "items": [{"e": "❓", "text": "Request — broadcast: 'IP X kimda?'"}, {"e": "🙋", "text": "Reply — unicast: 'X — mening MAC im'"}, {"e": "💾", "text": "Javob keshga yoziladi (arp -a)"}, {"e": "🚪", "text": "Boshqa tarmoq → shlyuzning MAC i so'raladi"}]}, {"t": "table", "title": "ICMP turlari", "head": ["Tur", "Xabar"], "rows": [["8 / 0", "Echo Request / Reply (ping)"], ["3", "Destination Unreachable"], ["11", "Time Exceeded (tracert)"]]}, {"t": "points", "title": "DHCP — DORA", "items": [{"e": "📢", "text": "Discover"}, {"e": "🎁", "text": "Offer"}, {"e": "✋", "text": "Request"}, {"e": "✅", "text": "Ack"}]}, {"t": "quiz", "title": "Tekshiramiz", "question": "DHCP serveri qaysi portda ishlaydi?", "options": ["UDP 53", "TCP 80", "UDP 68", "UDP 67"], "answer": 3, "explain": "Server — 67, mijoz — 68."}, {"t": "idea", "title": "Eng uzun prefiks qoidasi", "text": "10.1.5.77 uchun 10.0.0.0/8, 10.1.0.0/16 va 10.1.5.0/24 mos kelsa — /24 tanlanadi: u eng aniq.", "emoji": "🎯"}, {"t": "compare", "title": "Statik va dinamik", "left": {"label": "Statik", "text": "Qo'lda. Sodda, lekin o'zgarishga moslashmaydi"}, "right": {"label": "Dinamik", "text": "Protokol orqali. Uzilishda o'zi yangi yo'l topadi"}}, {"t": "table", "title": "Protokollar", "head": ["", "RIP", "OSPF"], "rows": [["Turi", "masofa-vektor", "kanal holati"], ["Algoritm", "Bellman-Ford", "Dijkstra"], ["Metrika", "sakrash (≤15)", "narx = 10⁸/tezlik"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Qaysi protokol Internetda avtonom tizimlar orasida ishlaydi?", "options": ["RIP", "ARP", "BGP", "OSPF"], "answer": 2, "explain": "BGP — tashqi marshrutlash protokoli (EGP)."}, {"t": "summary", "title": "Xulosa", "items": ["ARP: IP → MAC", "ICMP: ping, tracert, xato xabarlari", "DHCP: DORA, ijara", "Marshrutizator faqat keyingi sakrashni biladi", "RIP — sakrashlar, OSPF — narx va Dijkstra"]}]$j$::jsonb,
  8, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('f3b541f8-8e21-56d8-b2db-df2839358e49', '42b60731-76f8-5f86-ace7-d84761042069', '7200d194-32e5-5abc-ad53-6b5f04016abf', '783b47d2-54e4-5e2f-8b96-533b6ea85e2e', '67089f6c-df3e-5f1b-9ba9-ceb752af9ff6', '4768de80-9d5d-57bb-b248-203a3932e330', '96e6228f-7cd7-5bef-b4f3-786f51d2c06b');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('f3b541f8-8e21-56d8-b2db-df2839358e49', t, $kt$ARP qanday masalani hal qiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Nomni IP ga aylantiradi", "is_correct": false}, {"id": "b", "text": "IP manzil beradi", "is_correct": false}, {"id": "c", "text": "IP manzil bo'yicha MAC manzilni topadi", "is_correct": true}, {"id": "d", "text": "Marshrut tanlaydi", "is_correct": false}]$j$::jsonb,
   $kt$Nom → IP — DNS, IP berish — DHCP.$kt$, 1, 0),
  ('42b60731-76f8-5f86-ace7-d84761042069', t, $kt$ARP so'rovi qanday yuboriladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Multicast", "is_correct": false}, {"id": "b", "text": "Marshrutizator orqali", "is_correct": false}, {"id": "c", "text": "Unicast", "is_correct": false}, {"id": "d", "text": "Broadcast", "is_correct": true}]$j$::jsonb,
   $kt$Kompyuter manzil MAC ini bilmaydi — hammaga so'raydi.$kt$, 1, 1),
  ('7200d194-32e5-5abc-ad53-6b5f04016abf', t, $kt$ping qaysi protokoldan foydalanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "ARP", "is_correct": false}, {"id": "b", "text": "UDP", "is_correct": false}, {"id": "c", "text": "ICMP", "is_correct": true}, {"id": "d", "text": "TCP", "is_correct": false}]$j$::jsonb,
   $kt$ICMP Echo Request (8) va Echo Reply (0).$kt$, 1, 2),
  ('783b47d2-54e4-5e2f-8b96-533b6ea85e2e', t, $kt$DHCP da manzil olish bosqichlarining to'g'ri tartibi?$kt$, 'single',
   $j$[{"id": "a", "text": "Discover, Request, Offer, Ack", "is_correct": false}, {"id": "b", "text": "Request, Offer, Discover, Ack", "is_correct": false}, {"id": "c", "text": "Offer, Discover, Ack, Request", "is_correct": false}, {"id": "d", "text": "Discover, Offer, Request, Ack", "is_correct": true}]$j$::jsonb,
   $kt$DORA: Discover → Offer → Request → Ack.$kt$, 1, 3),
  ('67089f6c-df3e-5f1b-9ba9-ceb752af9ff6', t, $kt$Marshrut jadvalida 0.0.0.0/0 yozuvi nimani bildiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Sukut marshruti", "is_correct": true}, {"id": "b", "text": "Loopback", "is_correct": false}, {"id": "c", "text": "Xato yozuv", "is_correct": false}, {"id": "d", "text": "Broadcast", "is_correct": false}]$j$::jsonb,
   $kt$Boshqa yozuv mos kelmasa paket shu yo'l bilan ketadi.$kt$, 1, 4),
  ('4768de80-9d5d-57bb-b248-203a3932e330', t, $kt$RIP ning metrikasi qaysi?$kt$, 'single',
   $j$[{"id": "a", "text": "Kechikish", "is_correct": false}, {"id": "b", "text": "Narx (cost)", "is_correct": false}, {"id": "c", "text": "Sakrashlar soni", "is_correct": true}, {"id": "d", "text": "Kanal tezligi", "is_correct": false}]$j$::jsonb,
   $kt$RIP faqat sakrashlarni sanaydi, maksimum 15.$kt$, 1, 5),
  ('96e6228f-7cd7-5bef-b4f3-786f51d2c06b', t, $kt$OSPF haqida qaysi gaplar to'g'ri?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Har 30 s da butun jadvalni yuboradi", "is_correct": false}, {"id": "b", "text": "Kanal holati protokoli", "is_correct": true}, {"id": "c", "text": "Dijkstra algoritmidan foydalanadi", "is_correct": true}, {"id": "d", "text": "Kanal tezligini metrikada hisobga oladi", "is_correct": true}]$j$::jsonb,
   $kt$Davriy butun jadval — RIP xususiyati.$kt$, 2, 6)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('e4728bf2-55a1-5835-9797-859cc1a1e338', '0b644777-ab9f-581a-b804-f98861c5f6ac', '681bbe10-5463-5249-98da-fe1692c9acad');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('e4728bf2-55a1-5835-9797-859cc1a1e338', t, $kt$Dijkstra: eng arzon yo'l$kt$, $kt$Virtual simulyatsiyadagi grafda (Dijkstra bo'limi, OSPF narxlari) R1 dan R6 gacha eng arzon yo'lni toping.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Simulyatsiyada manba R1, manzil R6 ni tanlab, 'Keyingi' bilan qadamma-qadam yuring."}, {"order": 2, "text": "RIP rejimiga o'tib, sakrashlarni sanang."}]$j$::jsonb, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Eng arzon yo'l narxi", "type": "number", "accept": ["8"]}, {"label": "R1 ning R6 uchun keyingi sakrashi (next hop)", "type": "choice", "accept": ["R2"], "options": ["R2", "R3", "R4", "R5"]}, {"label": "RIP (sakrashlar) bo'yicha R1 dan R6 gacha nechta sakrash?", "type": "number", "accept": ["3"]}]}$j$::jsonb, NULL),
  ('0b644777-ab9f-581a-b804-f98861c5f6ac', t, $kt$Marshrut tanlash$kt$, $kt$Marshrut jadvali: 0.0.0.0/0 → ISP; 10.0.0.0/8 → R2; 10.1.0.0/16 → R3; 10.1.5.0/24 → R4. Paket qayerga yuboriladi?$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Mos keladigan yozuvlardan prefiksi eng uzunini tanlang."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Manzil 10.1.5.77", "type": "choice", "accept": ["R4"], "options": ["ISP", "R2", "R3", "R4"]}, {"label": "Manzil 10.1.200.3", "type": "choice", "accept": ["R3"], "options": ["ISP", "R2", "R3", "R4"]}, {"label": "Manzil 10.250.0.1", "type": "choice", "accept": ["R2"], "options": ["ISP", "R2", "R3", "R4"]}, {"label": "Manzil 8.8.8.8", "type": "choice", "accept": ["ISP"], "options": ["ISP", "R2", "R3", "R4"]}]}$j$::jsonb, NULL),
  ('681bbe10-5463-5249-98da-fe1692c9acad', t, $kt$DHCP ijarasi$kt$, $kt$DHCP server manzilni 8 soatga ijaraga berdi.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 2,
   'answer', $j${"fields": [{"label": "Mijoz ijarani necha soatdan keyin uzaytirishni so'raydi (T1)?", "type": "number", "accept": ["4"], "unit": "soat"}, {"label": "T2 necha soatdan keyin? (ijaraning 87,5%)", "type": "number", "accept": ["7"], "unit": "soat"}, {"label": "DHCP mijozi qaysi UDP portdan foydalanadi?", "type": "number", "accept": ["68"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 9. 9-ma'ruza: Transport pog'onasining vazifalari. TCP va UDP protokollari. Soketlar
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$9-ma'ruza: Transport pog'onasining vazifalari. TCP va UDP protokollari. Soketlar$kt$, 'kt-m09-transport',
$kt$<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Transport pog'onasining vazifalari</li>
  <li>Portlar va multipleksatsiya</li>
  <li>TCP: ulanish, ishonchlilik, oqimni boshqarish</li>
  <li>UDP</li>
  <li>Soketlar tushunchasi</li>
</ol>

<h2>1. Vazifalar</h2>
<p>IP paketni <b>kompyuterga</b> yetkazadi, lekin kompyuterda bir vaqtda o'nlab dastur ishlaydi: brauzer, messenjer, pochta. Transport pog'onasi ma'lumotni kerakli <b>jarayonga</b> (dasturga) yetkazadi va qo'shimcha ravishda:</p>
<ul>
  <li>ma'lumotni segmentlarga bo'ladi va qabul qiluvchida qayta yig'adi;</li>
  <li>(TCP da) yetkazilishni kafolatlaydi, tartibni tiklaydi, yo'qolganini qayta yuboradi;</li>
  <li>(TCP da) qabul qiluvchi ulgurmasa yuborishni sekinlashtiradi (<b>oqimni boshqarish</b>) va tarmoq tirbandligiga moslashadi (<b>tirbandlikni boshqarish</b>).</li>
</ul>

<h2>2. Portlar</h2>
<p><b>Port</b> — kompyuterdagi jarayonni bildiruvchi 16 bitli raqam (0–65535).</p>
<table>
  <tr><th>Oraliq</th><th>Nomi</th><th>Misollar</th></tr>
  <tr><td>0–1023</td><td>Taniqli (well-known)</td><td>22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS</td></tr>
  <tr><td>1024–49151</td><td>Ro'yxatdan o'tgan (registered)</td><td>3306 MySQL, 3389 RDP, 5432 PostgreSQL</td></tr>
  <tr><td>49152–65535</td><td>Dinamik (vaqtinchalik)</td><td>Mijoz tomonida OT tasodifan beradi</td></tr>
</table>
<p>Ulanish beshta qiymat bilan bir ma'noli aniqlanadi: <b>protokol, manba IP, manba port, manzil IP, manzil port</b>. Shu tufayli bitta kompyuterdan bitta serverning 443-portiga bir nechta brauzer tabi bir vaqtda ulana oladi — ularning manba portlari har xil.</p>

<h2>3. TCP</h2>
<p><b>TCP</b> (Transmission Control Protocol) — <b>ulanishga yo'naltirilgan</b>, <b>ishonchli</b>, bayt oqimi protokoli. Sarlavhasi kamida 20 bayt: manba va manzil portlari, tartib raqami (sequence), tasdiq raqami (acknowledgment), bayroqlar, oyna o'lchami, nazorat yig'indisi.</p>
<h3>3.1. Uch bosqichli ulanish</h3>
<pre><code>Mijoz                         Server
  | --- SYN, seq=x -----------> |
  | <-- SYN+ACK, seq=y, ack=x+1 |
  | --- ACK, ack=y+1 ---------> |   ulanish o'rnatildi</code></pre>
<p>Har tomon o'zining boshlang'ich tartib raqamini (ISN) aytadi va qarshi tomonnikini tasdiqlaydi. Ulanish yopilishi FIN va ACK almashinuvi bilan bajariladi; favqulodda uzish — RST bayrog'i.</p>
<h3>3.2. Ishonchlilik</h3>
<p>Tartib raqami — segmentdagi birinchi baytning raqami. Tasdiq raqami — "shu raqamgacha hammasini oldim, keyingisini kutyapman". Masalan, seq=1001 va 500 bayt yuborilsa, qabul qiluvchi <b>ack=1501</b> qaytaradi. Tasdiq kelmasa, yuboruvchi taymer tugagach segmentni <b>qayta yuboradi</b>. Qabul qiluvchi tartibsiz kelgan segmentlarni tartiblab, dasturga uzluksiz oqim beradi.</p>
<h3>3.3. Oqim va tirbandlikni boshqarish</h3>
<p><b>Sirpanuvchi oyna</b> (sliding window): yuboruvchi tasdiqni kutmasdan bir nechta segment yuborishi mumkin — oyna o'lchamigacha. Qabul qiluvchi sarlavhadagi <b>Window</b> maydonida qancha joyi borligini aytadi. Oyna kichik bo'lsa, tezlik cheklanadi: maksimal o'tkazuvchanlik ≈ oyna ÷ RTT. Tarmoq tirbandligiga moslashish uchun TCP "sekin start" bilan boshlaydi va yo'qotish sezilganda tezlikni kamaytiradi.</p>
<p>TCP bayroqlari: <b>SYN</b> (ulanish), <b>ACK</b> (tasdiq), <b>FIN</b> (yopish), <b>RST</b> (uzish), <b>PSH</b> (darhol uzat), <b>URG</b> (shoshilinch).</p>

<h2>4. UDP</h2>
<p><b>UDP</b> (User Datagram Protocol) — <b>ulanishsiz</b>, kafolatsiz va juda sodda: sarlavhasi atigi 8 bayt (manba port, manzil port, uzunlik, nazorat yig'indisi). Ulanish o'rnatish, tasdiq, qayta yuborish yo'q — shuning uchun kechikish minimal.</p>
<table>
  <tr><th></th><th>TCP</th><th>UDP</th></tr>
  <tr><td>Ulanish</td><td>bor (3 bosqich)</td><td>yo'q</td></tr>
  <tr><td>Yetkazish kafolati, tartib</td><td>bor</td><td>yo'q</td></tr>
  <tr><td>Sarlavha</td><td>≥ 20 bayt</td><td>8 bayt</td></tr>
  <tr><td>Tezlik / kechikish</td><td>sekinroq</td><td>tez</td></tr>
  <tr><td>Qo'llanilishi</td><td>veb, pochta, fayl, SSH</td><td>DNS, DHCP, VoIP, video, o'yinlar</td></tr>
</table>
<p>Zamonaviy HTTP/3 UDP ustidagi QUIC protokolida ishlaydi — ishonchlilik dastur darajasida, tezroq ulanish bilan.</p>

<h2>5. Soketlar</h2>
<p><b>Soket</b> — dastur va transport pog'onasi o'rtasidagi dasturiy interfeysning (API) oxirgi nuqtasi; uni "IP manzil + port" deb tasavvur qilish mumkin. Berkeley soketlari API si deyarli barcha OT va tillarda bir xil:</p>
<table>
  <tr><th>Server</th><th>Mijoz</th></tr>
  <tr><td><code>socket()</code> — soket yaratish</td><td><code>socket()</code></td></tr>
  <tr><td><code>bind(ip, port)</code> — manzilga bog'lash</td><td>—</td></tr>
  <tr><td><code>listen()</code> — ulanishlarni kutish</td><td>—</td></tr>
  <tr><td><code>accept()</code> — ulanishni qabul qilish (yangi soket)</td><td><code>connect(ip, port)</code></td></tr>
  <tr><td><code>recv() / send()</code></td><td><code>send() / recv()</code></td></tr>
  <tr><td><code>close()</code></td><td><code>close()</code></td></tr>
</table>
<p>TCP soketi — <code>SOCK_STREAM</code>, UDP soketi — <code>SOCK_DGRAM</code>. UDP da <code>listen/accept/connect</code> shart emas: <code>sendto()</code> va <code>recvfrom()</code> ishlatiladi. Laboratoriya ishida Python'da shunday server va mijoz yoziladi.</p>

<h2>Nazorat savollari</h2>
<ol>
  <li>Nega faqat IP manzil yetarli emas va port nimaga kerak?</li>
  <li>Uch bosqichli ulanishni chizib tushuntiring.</li>
  <li>seq=5000 bilan 1200 bayt yuborildi. Tasdiq raqami qanday bo'ladi?</li>
  <li>Qaysi xizmatlar uchun UDP afzal va nima uchun?</li>
  <li>Server soketida <code>accept()</code> nima qaytaradi?</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Transport pog'onasi", "subtitle": "TCP, UDP va soketlar", "emoji": "🚚"}, {"t": "idea", "title": "Port nimaga kerak?", "text": "IP kompyuterga yetkazadi, port — kompyuterdagi aniq dasturga. Ulanish = protokol + 2 IP + 2 port.", "emoji": "🚪"}, {"t": "table", "title": "Port oraliqlari", "head": ["Oraliq", "Turi"], "rows": [["0–1023", "Taniqli (80, 443, 53, 22)"], ["1024–49151", "Ro'yxatdan o'tgan"], ["49152–65535", "Dinamik (mijoz)"]]}, {"t": "code", "title": "Uch bosqichli ulanish", "code": "→ SYN       seq=x\n← SYN+ACK   seq=y, ack=x+1\n→ ACK       ack=y+1", "note": "Shundan keyingina ma'lumot yuboriladi"}, {"t": "quiz", "title": "Tekshiramiz", "question": "seq=1001, 500 bayt yuborildi. Qabul qiluvchi qanday ack qaytaradi?", "options": ["1001", "1500", "500", "1501"], "answer": 3, "explain": "Keyingi kutilayotgan bayt raqami: 1001 + 500 = 1501."}, {"t": "compare", "title": "TCP va UDP", "left": {"label": "TCP", "text": "Ulanish, kafolat, tartib, qayta yuborish. Veb, pochta, fayl"}, "right": {"label": "UDP", "text": "Ulanishsiz, 8 bayt sarlavha, tez. DNS, VoIP, o'yinlar"}}, {"t": "idea", "title": "Oyna va tezlik", "text": "Maksimal o'tkazuvchanlik ≈ oyna ÷ RTT. 64 KB oyna va 100 ms RTT bilan ~5,2 Mbit/s dan oshmaydi.", "emoji": "🪟"}, {"t": "code", "title": "Soket (Python)", "code": "import socket\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.bind(('127.0.0.1', 5000))\ns.listen()\nconn, addr = s.accept()", "note": "Mijoz: s.connect(('127.0.0.1', 5000))"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Qaysi xizmatga UDP mos?", "options": ["Elektron pochta", "Faylni yuklab olish", "Veb-sahifa (HTTP/1.1)", "Video qo'ng'iroq"], "answer": 3, "explain": "Eskirgan video kadrni qayta yuborishdan foyda yo'q — kechikish muhimroq."}, {"t": "summary", "title": "Xulosa", "items": ["Port — jarayon manzili", "TCP: SYN/SYN-ACK/ACK, seq/ack, oyna", "UDP: tez, sodda, kafolatsiz", "Soket API: socket, bind, listen, accept, connect"]}]$j$::jsonb,
  9, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('3b4b0201-2792-5012-a891-80341cfafc3a', '77ef0c07-b19c-52ec-9c53-110a63d94691', 'dfe1efc4-a1c3-5bc8-b7d6-1f1a4fedf4c3', '100f131f-41c9-5e08-b239-a240ab2d1e23', '5e802ef1-0ec1-5a35-90ae-87cdb4f14601', '1bed191f-6a1b-51eb-ae2c-4949e5e9452e', '0ac02e99-de34-5f1b-8b35-ee43fab18327');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('3b4b0201-2792-5012-a891-80341cfafc3a', t, $kt$Port raqami necha bitli?$kt$, 'single',
   $j$[{"id": "a", "text": "16", "is_correct": true}, {"id": "b", "text": "32", "is_correct": false}, {"id": "c", "text": "8", "is_correct": false}, {"id": "d", "text": "48", "is_correct": false}]$j$::jsonb,
   $kt$0–65535 oralig'i — 16 bit.$kt$, 1, 0),
  ('77ef0c07-b19c-52ec-9c53-110a63d94691', t, $kt$HTTPS ning standart porti?$kt$, 'single',
   $j$[{"id": "a", "text": "443", "is_correct": true}, {"id": "b", "text": "80", "is_correct": false}, {"id": "c", "text": "8080", "is_correct": false}, {"id": "d", "text": "22", "is_correct": false}]$j$::jsonb,
   $kt$HTTP — 80, HTTPS — 443.$kt$, 1, 1),
  ('dfe1efc4-a1c3-5bc8-b7d6-1f1a4fedf4c3', t, $kt$TCP ulanishining birinchi segmentida qaysi bayroq bo'ladi?$kt$, 'single',
   $j$[{"id": "a", "text": "ACK", "is_correct": false}, {"id": "b", "text": "SYN", "is_correct": true}, {"id": "c", "text": "RST", "is_correct": false}, {"id": "d", "text": "FIN", "is_correct": false}]$j$::jsonb,
   $kt$SYN — sinxronizatsiya, ulanish so'rovi.$kt$, 1, 2),
  ('100f131f-41c9-5e08-b239-a240ab2d1e23', t, $kt$UDP sarlavhasi necha bayt?$kt$, 'single',
   $j$[{"id": "a", "text": "40", "is_correct": false}, {"id": "b", "text": "20", "is_correct": false}, {"id": "c", "text": "4", "is_correct": false}, {"id": "d", "text": "8", "is_correct": true}]$j$::jsonb,
   $kt$Manba port, manzil port, uzunlik, nazorat yig'indisi — 4 × 2 bayt.$kt$, 1, 3),
  ('5e802ef1-0ec1-5a35-90ae-87cdb4f14601', t, $kt$TCP oqimni boshqarishda qaysi maydondan foydalanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Protocol", "is_correct": false}, {"id": "b", "text": "Window", "is_correct": true}, {"id": "c", "text": "Checksum", "is_correct": false}, {"id": "d", "text": "TTL", "is_correct": false}]$j$::jsonb,
   $kt$Window — qabul qiluvchida qancha bo'sh joy borligi.$kt$, 1, 4),
  ('1bed191f-6a1b-51eb-ae2c-4949e5e9452e', t, $kt$Qaysilar TCP ga xos?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Yo'qolgan segmentni qayta yuborish", "is_correct": true}, {"id": "b", "text": "8 baytli sarlavha", "is_correct": false}, {"id": "c", "text": "Uch bosqichli ulanish", "is_correct": true}, {"id": "d", "text": "Tartibni tiklash", "is_correct": true}]$j$::jsonb,
   $kt$8 baytli sarlavha — UDP.$kt$, 2, 5),
  ('0ac02e99-de34-5f1b-8b35-ee43fab18327', t, $kt$Python'da TCP soket qanday yaratiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "socket(AF_INET, SOCK_DGRAM)", "is_correct": false}, {"id": "b", "text": "socket.tcp()", "is_correct": false}, {"id": "c", "text": "socket(AF_INET, SOCK_STREAM)", "is_correct": true}, {"id": "d", "text": "socket(AF_UNIX, SOCK_RAW)", "is_correct": false}]$j$::jsonb,
   $kt$SOCK_STREAM — TCP, SOCK_DGRAM — UDP.$kt$, 1, 6)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('2fdf679d-89f3-5d86-9a6e-a2791e625f65', '31c94ee0-5a70-51ee-a76a-27962283ac0d', 'e42e1e42-297d-5355-a89f-70de05165ef5');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('2fdf679d-89f3-5d86-9a6e-a2791e625f65', t, $kt$Tartib va tasdiq raqamlari$kt$, $kt$Mijoz ulanishdan keyin seq=1001 dan boshlab ketma-ket uchta segment yuboradi: 500, 500 va 300 bayt.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "ack = seq + segment hajmi."}, {"order": 2, "text": "Ikkinchi segment seq=1501 dan boshlanadi."}]$j$::jsonb, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Birinchi segmentdan keyin server qaytargan ack", "type": "number", "accept": ["1501"]}, {"label": "Uchinchi segmentning seq raqami", "type": "number", "accept": ["2001"]}, {"label": "Barcha segmentlardan keyingi ack", "type": "number", "accept": ["2301"]}]}$j$::jsonb, NULL),
  ('31c94ee0-5a70-51ee-a76a-27962283ac0d', t, $kt$Oyna va o'tkazuvchanlik$kt$, $kt$TCP oyna o'lchami 64 000 bayt, RTT = 100 ms. Maksimal o'tkazuvchanlikni toping (oyna ÷ RTT).$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "64 000 bayt ÷ 0,1 s = ? bayt/s"}, {"order": 2, "text": "Bitga o'tkazing (× 8) va 10⁶ ga bo'ling."}]$j$::jsonb, 'medium', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Bayt/s", "type": "number", "accept": ["640000"], "unit": "B/s"}, {"label": "Mbit/s", "type": "number", "accept": ["5.12"], "tol": 0.01, "unit": "Mbit/s"}]}$j$::jsonb, NULL),
  ('e42e1e42-297d-5355-a89f-70de05165ef5', t, $kt$TCP bayroqlari$kt$, $kt$TCP sarlavhasidagi bayroqlar baytining qiymati (0–63) kiritiladi. Bitlar: FIN=1, SYN=2, RST=4, PSH=8, ACK=16, URG=32.
O'rnatilgan bayroqlar nomlarini shu tartibda (FIN, SYN, RST, PSH, ACK, URG) bo'sh joy bilan chiqaring. Hech biri bo'lmasa — chiziqcha (-).
Masalan: 18 → SYN ACK$kt$,
   NULL,
   $kt$n = int(input())
nomlar = ['FIN', 'SYN', 'RST', 'PSH', 'ACK', 'URG']
# Kodingizni shu yerga yozing
$kt$, $kt$n = int(input())
nomlar = ['FIN', 'SYN', 'RST', 'PSH', 'ACK', 'URG']
r = [nomlar[i] for i in range(6) if n & (1 << i)]
print(' '.join(r) if r else '-')$kt$, 'python',
   $j$[{"input": "18", "expected_output": "SYN ACK", "is_hidden": false}, {"input": "2", "expected_output": "SYN", "is_hidden": false}, {"input": "17", "expected_output": "FIN ACK", "is_hidden": true}, {"input": "24", "expected_output": "PSH ACK", "is_hidden": true}, {"input": "0", "expected_output": "-", "is_hidden": true}, {"input": "4", "expected_output": "RST", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "i-bit o'rnatilganini tekshirish: n & (1 << i)."}, {"order": 2, "text": "Ro'yxat bo'sh bo'lsa '-' chiqaring."}]$j$::jsonb, 'medium', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 10. 10-ma'ruza: Amaliy pog'ona protokollari va xizmatlari. Veb-server, HTTP, FTP, elektron pochta
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$10-ma'ruza: Amaliy pog'ona protokollari va xizmatlari. Veb-server, HTTP, FTP, elektron pochta$kt$, 'kt-m10-amaliy-pogona',
$kt$<h2>Ma'ruza rejasi</h2>
<ol>
  <li>Amaliy pog'ona va mijoz-server modeli</li>
  <li>URL tuzilishi</li>
  <li>HTTP protokoli</li>
  <li>Veb-server xizmati</li>
  <li>FTP</li>
  <li>Elektron pochta: SMTP, POP3, IMAP</li>
  <li>Boshqa amaliy protokollar</li>
</ol>

<h2>1. Amaliy pog'ona</h2>
<p>Amaliy pog'ona protokollari foydalanuvchi dasturlari "gaplashadigan" tilni belgilaydi: so'rov va javob formati, buyruqlar, holat kodlari. Ko'pchiligi <b>mijoz-server</b> modelida ishlaydi: server taniqli portda kutadi, mijoz so'rov yuboradi.</p>

<h2>2. URL</h2>
<pre><code>https://www.miracademy.uz:443/explore/courses?q=tarmoq#natijalar
└─┬─┘   └───────┬───────┘└┬┘└──────┬───────┘└──┬───┘└───┬────┘
sxema         xost      port     yo'l         so'rov   fragment</code></pre>
<p>Port ko'rsatilmasa sxemaning standart porti olinadi (http — 80, https — 443). Fragment serverga yuborilmaydi — brauzer sahifa ichidagi joyga o'tish uchun ishlatadi.</p>

<h2>3. HTTP</h2>
<p><b>HTTP</b> (HyperText Transfer Protocol) — veb-sahifa va resurslarni uzatish protokoli. Matnli, <b>holatsiz</b> (stateless): har so'rov mustaqil; foydalanuvchini "eslab qolish" uchun <b>cookie</b> ishlatiladi.</p>
<h3>So'rov</h3>
<pre><code>GET /explore/courses HTTP/1.1
Host: www.miracademy.uz
User-Agent: Mozilla/5.0
Accept: text/html</code></pre>
<p>Usullar: <b>GET</b> — resursni olish, <b>POST</b> — ma'lumot yuborish (forma), <b>PUT</b> — almashtirish, <b>DELETE</b> — o'chirish, <b>HEAD</b> — faqat sarlavhalar.</p>
<h3>Javob holat kodlari</h3>
<table>
  <tr><th>Sinf</th><th>Ma'nosi</th><th>Misollar</th></tr>
  <tr><td>1xx</td><td>Ma'lumot</td><td>101 Switching Protocols</td></tr>
  <tr><td>2xx</td><td>Muvaffaqiyat</td><td>200 OK, 201 Created, 204 No Content</td></tr>
  <tr><td>3xx</td><td>Yo'naltirish</td><td>301 Moved Permanently, 302 Found, 304 Not Modified</td></tr>
  <tr><td>4xx</td><td>Mijoz xatosi</td><td>400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found</td></tr>
  <tr><td>5xx</td><td>Server xatosi</td><td>500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable</td></tr>
</table>
<h3>Versiyalar va HTTPS</h3>
<ul>
  <li><b>HTTP/1.1</b> — doimiy ulanish (keep-alive), bitta TCP ulanishda ketma-ket so'rovlar.</li>
  <li><b>HTTP/2</b> — bitta ulanishda parallel oqimlar, ikkilik format, sarlavhalarni siqish.</li>
  <li><b>HTTP/3</b> — UDP ustidagi QUIC da.</li>
  <li><b>HTTPS</b> = HTTP + <b>TLS</b> shifrlash, port 443. Sertifikat server haqiqiyligini tasdiqlaydi. Bugun deyarli barcha saytlar HTTPS da.</li>
</ul>

<h2>4. Veb-server xizmati</h2>
<p><b>Veb-server</b> — HTTP so'rovlarini qabul qilib, fayllar (HTML, CSS, rasm) yoki dastur natijasini qaytaradigan dastur: Apache, Nginx, Microsoft IIS. Asosiy tushunchalar:</p>
<ul>
  <li><b>Ildiz papka</b> (document root) — saytning fayllari (IIS da <code>C:\inetpub\wwwroot</code>).</li>
  <li><b>Statik</b> kontent — fayl o'zgarishsiz beriladi; <b>dinamik</b> — har so'rovda dastur (PHP, Python, Node.js, ASP.NET) yaratadi.</li>
  <li><b>Virtual xostlar</b> — bitta serverda bir nechta sayt: <code>Host</code> sarlavhasiga qarab ajratiladi.</li>
  <li><b>Bog'lash</b> (binding) — sayt qaysi IP, port va domen nomida eshitadi.</li>
</ul>

<h2>5. FTP</h2>
<p><b>FTP</b> (File Transfer Protocol) — fayl almashish. Ikki ulanish ishlatadi: <b>boshqaruv</b> (TCP 21) va har fayl uchun alohida <b>ma'lumot</b> ulanishi (faol rejimda serverning 20-portidan, passiv rejimda server ochgan vaqtinchalik portga). Buyruqlar: <code>USER</code>, <code>PASS</code>, <code>LIST</code>, <code>RETR</code> (yuklab olish), <code>STOR</code> (yuklash), <code>QUIT</code>. Oddiy FTP login va parolni <b>ochiq matnda</b> uzatadi, shuning uchun <b>SFTP</b> (SSH ustida, port 22) yoki <b>FTPS</b> (TLS bilan) ishlatish kerak.</p>

<h2>6. Elektron pochta</h2>
<table>
  <tr><th>Protokol</th><th>Vazifasi</th><th>Port</th></tr>
  <tr><td><b>SMTP</b></td><td>Xatni yuborish: mijoz → server (587) va server → server (25)</td><td>25, 587, 465</td></tr>
  <tr><td><b>POP3</b></td><td>Xatni serverdan yuklab olish (odatda serverdan o'chiriladi)</td><td>110, 995 (TLS)</td></tr>
  <tr><td><b>IMAP</b></td><td>Xatlar serverda qoladi, papkalar va holatlar sinxronlanadi</td><td>143, 993 (TLS)</td></tr>
</table>
<p>Xat yo'li: foydalanuvchi dasturi (MUA) → o'z SMTP serveri → DNS dan qabul qiluvchi domenning <b>MX</b> yozuvi → qabul qiluvchi pochta serveri → qabul qiluvchi IMAP/POP3 bilan o'qiydi. Rasm va fayllar xatga <b>MIME</b> formatida biriktiriladi.</p>

<h2>7. Boshqa protokollar</h2>
<table>
  <tr><th>Protokol</th><th>Port</th><th>Vazifasi</th></tr>
  <tr><td>SSH</td><td>22</td><td>Shifrlangan masofaviy terminal</td></tr>
  <tr><td>Telnet</td><td>23</td><td>Masofaviy terminal (shifrlanmagan — eskirgan)</td></tr>
  <tr><td>DNS</td><td>53</td><td>Nomni IP ga aylantirish (keyingi ma'ruza)</td></tr>
  <tr><td>SNMP</td><td>161</td><td>Tarmoq qurilmalarini monitoring qilish</td></tr>
  <tr><td>RDP</td><td>3389</td><td>Windows masofaviy ish stoli</td></tr>
</table>

<h2>Nazorat savollari</h2>
<ol>
  <li>URL qanday qismlardan iborat?</li>
  <li>GET va POST farqi nimada?</li>
  <li>404 va 500 kodlari kimning xatosini bildiradi?</li>
  <li>Nega oddiy FTP xavfsiz emas?</li>
  <li>POP3 va IMAP ning farqini tushuntiring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Amaliy pog'ona", "subtitle": "HTTP, FTP, pochta", "emoji": "📬"}, {"t": "code", "title": "URL tuzilishi", "code": "https://www.miracademy.uz:443/explore/courses?q=tarmoq#natijalar\nsxema   xost              port yo'l             so'rov   fragment"}, {"t": "code", "title": "HTTP so'rovi", "code": "GET /explore/courses HTTP/1.1\nHost: www.miracademy.uz\nAccept: text/html", "output": "HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8"}, {"t": "table", "title": "Holat kodlari", "head": ["Sinf", "Ma'nosi", "Misol"], "rows": [["2xx", "Muvaffaqiyat", "200"], ["3xx", "Yo'naltirish", "301, 304"], ["4xx", "Mijoz xatosi", "403, 404"], ["5xx", "Server xatosi", "500, 503"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Fayl o'zgarmagan, brauzer keshdagisini ishlatsin. Server qanday kod qaytaradi?", "options": ["200", "304", "301", "404"], "answer": 1, "explain": "304 Not Modified — tana yuborilmaydi."}, {"t": "points", "title": "HTTP versiyalari", "items": [{"e": "1️⃣", "text": "HTTP/1.1 — keep-alive"}, {"e": "2️⃣", "text": "HTTP/2 — parallel oqimlar"}, {"e": "3️⃣", "text": "HTTP/3 — QUIC (UDP)"}, {"e": "🔒", "text": "HTTPS = HTTP + TLS, port 443"}]}, {"t": "compare", "title": "FTP", "left": {"label": "Oddiy FTP (21)", "text": "Login va parol ochiq matnda"}, "right": {"label": "SFTP / FTPS", "text": "SSH yoki TLS bilan shifrlangan"}}, {"t": "table", "title": "Pochta protokollari", "head": ["Protokol", "Vazifa", "Port"], "rows": [["SMTP", "Yuborish", "25, 587"], ["POP3", "Yuklab olish", "110, 995"], ["IMAP", "Serverda sinxron", "143, 993"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Xatlar telefon va kompyuterda bir xil ko'rinishi uchun qaysi protokol kerak?", "options": ["FTP", "IMAP", "SMTP", "POP3"], "answer": 1, "explain": "IMAP xatlarni serverda saqlaydi va holatni sinxronlaydi."}, {"t": "summary", "title": "Xulosa", "items": ["HTTP — holatsiz so'rov-javob, kodlar 1xx–5xx", "HTTPS — TLS bilan shifrlangan", "FTP — 2 ulanish, SFTP/FTPS ishlating", "SMTP yuboradi, POP3/IMAP o'qiydi"]}]$j$::jsonb,
  10, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('4212d190-2570-5d69-818d-9daaff5bf66d', 'eb5fbcb7-7e9e-54a3-b8c7-d83242d0951e', '24d5c0f7-568b-5142-867f-29f0b61eef3b', '39e9f418-862d-5abc-8fdc-990f1e37ad7f', 'd3257900-f190-5690-9a93-53d885d2e513', 'cd8276e9-009f-5705-9d8e-7faeadacb991');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('4212d190-2570-5d69-818d-9daaff5bf66d', t, $kt$HTTP ning standart porti?$kt$, 'single',
   $j$[{"id": "a", "text": "80", "is_correct": true}, {"id": "b", "text": "21", "is_correct": false}, {"id": "c", "text": "443", "is_correct": false}, {"id": "d", "text": "25", "is_correct": false}]$j$::jsonb,
   $kt$HTTPS — 443.$kt$, 1, 0),
  ('eb5fbcb7-7e9e-54a3-b8c7-d83242d0951e', t, $kt$Formadagi ma'lumotni serverga yuborish uchun odatda qaysi usul ishlatiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "HEAD", "is_correct": false}, {"id": "b", "text": "GET", "is_correct": false}, {"id": "c", "text": "POST", "is_correct": true}, {"id": "d", "text": "DELETE", "is_correct": false}]$j$::jsonb,
   $kt$POST da ma'lumot so'rov tanasida yuboriladi.$kt$, 1, 1),
  ('24d5c0f7-568b-5142-867f-29f0b61eef3b', t, $kt$403 kodi nimani bildiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Kirish taqiqlangan", "is_correct": true}, {"id": "b", "text": "Sahifa topilmadi", "is_correct": false}, {"id": "c", "text": "Yo'naltirish", "is_correct": false}, {"id": "d", "text": "Server xatosi", "is_correct": false}]$j$::jsonb,
   $kt$403 Forbidden — resurs bor, lekin ruxsat yo'q.$kt$, 1, 2),
  ('39e9f418-862d-5abc-8fdc-990f1e37ad7f', t, $kt$FTP boshqaruv ulanishi qaysi portda?$kt$, 'single',
   $j$[{"id": "a", "text": "21", "is_correct": true}, {"id": "b", "text": "20", "is_correct": false}, {"id": "c", "text": "22", "is_correct": false}, {"id": "d", "text": "23", "is_correct": false}]$j$::jsonb,
   $kt$Ma'lumot ulanishi faol rejimda 20-portdan.$kt$, 1, 3),
  ('d3257900-f190-5690-9a93-53d885d2e513', t, $kt$Xatni yuborish uchun qaysi protokol ishlatiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "SNMP", "is_correct": false}, {"id": "b", "text": "SMTP", "is_correct": true}, {"id": "c", "text": "POP3", "is_correct": false}, {"id": "d", "text": "IMAP", "is_correct": false}]$j$::jsonb,
   $kt$SMTP — Simple Mail Transfer Protocol.$kt$, 1, 4),
  ('cd8276e9-009f-5705-9d8e-7faeadacb991', t, $kt$HTTP haqida qaysi gaplar to'g'ri?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Holatsiz protokol", "is_correct": true}, {"id": "b", "text": "Foydalanuvchini eslash uchun cookie ishlatiladi", "is_correct": true}, {"id": "c", "text": "UDP 53-portda ishlaydi", "is_correct": false}, {"id": "d", "text": "HTTPS da TLS bilan shifrlanadi", "is_correct": true}]$j$::jsonb,
   $kt$UDP 53 — DNS.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('f9f088db-e9f5-5a9e-aa73-0807b2dffb2e', '36d9684d-fb98-52c9-85a1-aa3f94dbd21a');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('f9f088db-e9f5-5a9e-aa73-0807b2dffb2e', t, $kt$URL ni tahlil qiling$kt$, $kt$URL: https://kutubxona.edu.uz:8443/kitoblar/qidiruv?muallif=tanenbaum#natija$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Sxema", "type": "text", "accept": ["https"]}, {"label": "Xost", "type": "text", "accept": ["kutubxona.edu.uz"]}, {"label": "Port", "type": "number", "accept": ["8443"]}, {"label": "Yo'l", "type": "text", "accept": ["/kitoblar/qidiruv"]}, {"label": "Serverga yuborilmaydigan qism (# dan keyin)", "type": "text", "accept": ["natija", "#natija"]}]}$j$::jsonb, NULL),
  ('36d9684d-fb98-52c9-85a1-aa3f94dbd21a', t, $kt$Holat kodlari va portlar$kt$, $kt$Vaziyatga mos qiymatni kiriting.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Sahifa topilmadi — holat kodi", "type": "number", "accept": ["404"]}, {"label": "Sahifa butunlay yangi manzilga ko'chdi — holat kodi", "type": "number", "accept": ["301"]}, {"label": "Serverda dastur xatosi — holat kodi", "type": "number", "accept": ["500"]}, {"label": "Xatni IMAP orqali TLS bilan o'qish porti", "type": "number", "accept": ["993"]}, {"label": "SFTP porti", "type": "number", "accept": ["22"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

END $mig$;
