-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: Amaliy mashg'ulotlar 1–5
--
-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
-- Manba: scripts/kontent/kompyuter-tarmoqlari/a01_05.py
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
  -- 1. 1-amaliy mashg'ulot: Tarmoqlarni tasniflash va o'lchov birliklari bilan ishlash
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$1-amaliy mashg'ulot: Tarmoqlarni tasniflash va o'lchov birliklari bilan ishlash$kt$, 'kt-a01-klassifikatsiya',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>Real vaziyatlardagi tarmoqlarni qamrov va arxitektura bo'yicha tasniflashni, hamda tezlik va hajm birliklarini to'g'ri aylantirishni mashq qilish.</p>

<h2>1. Tasniflash algoritmi</h2>
<ol>
  <li><b>Qamrov</b>: bitta odamning qurilmalari → PAN; xona, bino, kampus → LAN; shahar → MAN; shaharlar, mamlakatlar → WAN.</li>
  <li><b>Arxitektura</b>: xizmatni alohida server beradimi? Ha → mijoz-server; hamma teng → bir rangli.</li>
  <li><b>Muhit</b>: simli, simsiz yoki aralash.</li>
  <li><b>Egalik va kirish</b>: Internet, intranet, ekstranet.</li>
</ol>

<h3>Namuna (keys-stadi)</h3>
<p><i>Maktab: 2 qavatli bino, 3 ta kompyuter sinfi (har birida 15 ta kompyuter), o'qituvchilar xonasi, Wi-Fi, bitta fayl serveri va elektron jurnal saytiga Internet orqali kirish.</i></p>
<table>
  <tr><th>Belgi</th><th>Javob</th><th>Asos</th></tr>
  <tr><td>Qamrov</td><td>LAN</td><td>Bitta bino</td></tr>
  <tr><td>Arxitektura</td><td>Mijoz-server</td><td>Fayl serveri bor</td></tr>
  <tr><td>Muhit</td><td>Aralash</td><td>Kabel + Wi-Fi</td></tr>
  <tr><td>Tashqi aloqa</td><td>WAN (Internet) ga ulangan</td><td>Elektron jurnal tashqi saytda</td></tr>
</table>

<h2>2. O'lchov birliklari</h2>
<table>
  <tr><th>Kattalik</th><th>Birlik</th><th>Eslatma</th></tr>
  <tr><td>Tezlik</td><td>bit/s, Kbit/s, Mbit/s, Gbit/s</td><td>Ko'paytuvchi 1000: 1 Mbit/s = 1 000 000 bit/s</td></tr>
  <tr><td>Hajm</td><td>bayt (B), KB, MB, GB</td><td>1 B = 8 bit; tarmoq hisoblarida 1 MB = 10<sup>6</sup> B</td></tr>
  <tr><td>Hajm (ikkilik)</td><td>KiB, MiB, GiB</td><td>1 KiB = 1024 B, 1 MiB = 1 048 576 B — OT ko'pincha shuni ko'rsatadi</td></tr>
</table>
<h3>Namuna 1</h3>
<p>Provayder "100 Mbit/s" deydi. 1 GB (10<sup>9</sup> B) faylni yuklash vaqti:</p>
<pre><code>1 GB = 8·10⁹ bit
t = 8·10⁹ / 100·10⁶ = 80 s</code></pre>
<p>Amalda ~10% xizmat ma'lumoti (sarlavhalar) va boshqa foydalanuvchilar hisobiga vaqt ko'proq bo'ladi.</p>
<h3>Namuna 2</h3>
<p>Yuklash dasturi "6,25 MB/s" ko'rsatyapti. Bu necha Mbit/s? 6,25 · 8 = <b>50 Mbit/s</b>.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Virtual simulyatsiyada masofani o'zgartirib, tarmoq turi chegaralarini kuzating, so'ng "Tasniflang" bo'limini to'liq bajaring.</li>
  <li>Namunalardagi hisoblarni daftarda takrorlang.</li>
  <li>Test va topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Tasniflash va birliklar", "subtitle": "1-amaliy mashg'ulot", "emoji": "📏"}, {"t": "points", "title": "Tasniflash algoritmi", "items": [{"e": "📍", "text": "Qamrov: PAN, LAN, MAN, WAN"}, {"e": "🖥️", "text": "Arxitektura: server bormi?"}, {"e": "🔌", "text": "Muhit: simli, simsiz"}, {"e": "🔑", "text": "Kirish: Internet, intranet"}]}, {"t": "table", "title": "Keys: maktab tarmog'i", "head": ["Belgi", "Javob"], "rows": [["Qamrov", "LAN"], ["Arxitektura", "Mijoz-server"], ["Muhit", "Aralash"]]}, {"t": "compare", "title": "Bit va bayt", "left": {"label": "Tezlik", "text": "bit/s — Mbit/s, Gbit/s"}, "right": {"label": "Hajm", "text": "bayt — MB, GB (1 B = 8 bit)"}}, {"t": "code", "title": "1 GB ni 100 Mbit/s da yuklash", "code": "hajm = 1·10⁹ B × 8 = 8·10⁹ bit\nvaqt = 8·10⁹ / 10⁸ = 80 s"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Dastur '12,5 MB/s' ko'rsatyapti. Bu necha Mbit/s?", "options": ["125", "1,56", "100", "12,5"], "answer": 2, "explain": "12,5 × 8 = 100 Mbit/s."}, {"t": "idea", "title": "MB va MiB", "text": "1 MB = 1 000 000 B, 1 MiB = 1 048 576 B. Disk '500 GB' deb sotiladi, Windows esa ~465 'GB' (aslida GiB) ko'rsatadi.", "emoji": "💽"}, {"t": "summary", "title": "Xulosa", "items": ["Avval qamrov, keyin arxitektura", "Tezlik — bitda, hajm — baytda", "Vaqt = hajm (bit) ÷ tezlik (bit/s)"]}]$j$::jsonb,
  1, 10, 25, 80, true, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('c1428866-b45b-5254-84de-9d384e22b1c9', '5fc6bb78-ee49-51db-af27-fef0a55a4cf3', 'b48b579b-8a3f-5964-9a3d-db72493e384f', '8e563ee7-d89e-5745-b69f-de35eb6ddb4f', '70d6d30f-215e-55cb-a299-1559d92858c4', '57823ea4-c35d-5ea8-9235-3fb5a2100db1');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('c1428866-b45b-5254-84de-9d384e22b1c9', t, $kt$Kampusdagi 5 ta binoni bog'lovchi universitet tarmog'i qaysi turga yaqin?$kt$, 'single',
   $j$[{"id": "a", "text": "WAN", "is_correct": false}, {"id": "b", "text": "LAN (kampus)", "is_correct": true}, {"id": "c", "text": "PAN", "is_correct": false}, {"id": "d", "text": "Faqat Internet", "is_correct": false}]$j$::jsonb,
   $kt$Bitta tashkilot, bitta hudud — LAN/CAN.$kt$, 1, 0),
  ('5fc6bb78-ee49-51db-af27-fef0a55a4cf3', t, $kt$Uchta noutbuk bir-biriga papka ulashgan, server yo'q. Arxitektura?$kt$, 'single',
   $j$[{"id": "a", "text": "Bir rangli", "is_correct": true}, {"id": "b", "text": "Domen", "is_correct": false}, {"id": "c", "text": "Mijoz-server", "is_correct": false}, {"id": "d", "text": "Daraxt", "is_correct": false}]$j$::jsonb,
   $kt$Hamma teng huquqli.$kt$, 1, 1),
  ('b48b579b-8a3f-5964-9a3d-db72493e384f', t, $kt$1 bayt necha bit?$kt$, 'single',
   $j$[{"id": "a", "text": "8", "is_correct": true}, {"id": "b", "text": "4", "is_correct": false}, {"id": "c", "text": "10", "is_correct": false}, {"id": "d", "text": "16", "is_correct": false}]$j$::jsonb,
   $kt$1 B = 8 bit.$kt$, 1, 2),
  ('8e563ee7-d89e-5745-b69f-de35eb6ddb4f', t, $kt$50 Mbit/s kanal sekundiga necha MB uzatadi?$kt$, 'single',
   $j$[{"id": "a", "text": "400", "is_correct": false}, {"id": "b", "text": "6,25", "is_correct": true}, {"id": "c", "text": "50", "is_correct": false}, {"id": "d", "text": "5", "is_correct": false}]$j$::jsonb,
   $kt$50 ÷ 8 = 6,25.$kt$, 1, 3),
  ('70d6d30f-215e-55cb-a299-1559d92858c4', t, $kt$1 KiB necha baytga teng?$kt$, 'single',
   $j$[{"id": "a", "text": "1000", "is_correct": false}, {"id": "b", "text": "8192", "is_correct": false}, {"id": "c", "text": "1024", "is_correct": true}, {"id": "d", "text": "8", "is_correct": false}]$j$::jsonb,
   $kt$Ikkilik prefiks: 2¹⁰ = 1024.$kt$, 1, 4),
  ('57823ea4-c35d-5ea8-9235-3fb5a2100db1', t, $kt$Tashkilotning faqat xodimlar uchun ichki veb-portali qanday ataladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Intranet", "is_correct": true}, {"id": "b", "text": "Internet", "is_correct": false}, {"id": "c", "text": "PAN", "is_correct": false}, {"id": "d", "text": "Ekstranet", "is_correct": false}]$j$::jsonb,
   $kt$Ekstranet — hamkorlarga ham ochilgan qismi.$kt$, 1, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('32df31c7-4d9e-52cd-90da-88e937413c91', '0ece93a0-de5b-56b8-bfda-b69e02c2ac3e', '0e83f444-b402-5d60-96cc-6edd1dcdfc9c');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('32df31c7-4d9e-52cd-90da-88e937413c91', t, $kt$Keys: kollej tarmog'i$kt$, $kt$Kollej: bitta bino, 4 ta kompyuter sinfi, Active Directory serveri, Wi-Fi; Samarqanddagi filial bilan VPN orqali bog'langan.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Bino ichidagi tarmoq turi", "type": "choice", "accept": ["LAN"], "options": ["PAN", "LAN", "MAN", "WAN"]}, {"label": "Arxitektura", "type": "choice", "accept": ["Mijoz-server"], "options": ["Bir rangli", "Mijoz-server"]}, {"label": "Bino ichidagi uzatish muhiti", "type": "choice", "accept": ["Aralash"], "options": ["Simli", "Simsiz", "Aralash"]}, {"label": "Filial bilan aloqa qaysi tur orqali?", "type": "choice", "accept": ["WAN"], "options": ["PAN", "LAN", "MAN", "WAN"]}]}$j$::jsonb, NULL),
  ('0ece93a0-de5b-56b8-bfda-b69e02c2ac3e', t, $kt$Birliklarni aylantiring$kt$, $kt$1 MB = 10⁶ bayt, 1 GB = 10⁹ bayt deb oling. Sarlavhalarni hisobga olmang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Hajmni bitga o'tkazing (× 8), keyin tezlikka bo'ling."}, {"order": 2, "text": "MB/s → Mbit/s: × 8."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "2 GB filmni 40 Mbit/s kanalda yuklash vaqti", "type": "number", "accept": ["400"], "unit": "s"}, {"label": "Yuklash dasturi 3,5 MB/s ko'rsatyapti. Bu necha Mbit/s?", "type": "number", "accept": ["28"], "unit": "Mbit/s"}, {"label": "700 MB faylni 1 Gbit/s da yuklash vaqti", "type": "number", "accept": ["5.6"], "tol": 0.001, "unit": "s"}]}$j$::jsonb, NULL),
  ('0e83f444-b402-5d60-96cc-6edd1dcdfc9c', t, $kt$Yuklash vaqti kalkulyatori$kt$, $kt$Bir qatorda ikki son: fayl hajmi (MB) va kanal tezligi (Mbit/s). Yuklash vaqtini sekundlarda 2 xona aniqlikda chiqaring (1 MB = 8 Mbit).
Masalan: 100 50 → 16.00$kt$,
   NULL,
   $kt$hajm, tezlik = map(float, input().split())
# Kodingizni shu yerga yozing
$kt$, $kt$hajm, tezlik = map(float, input().split())
print(f'{hajm * 8 / tezlik:.2f}')$kt$, 'python',
   $j$[{"input": "100 50", "expected_output": "16.00", "is_hidden": false}, {"input": "2000 40", "expected_output": "400.00", "is_hidden": false}, {"input": "700 1000", "expected_output": "5.60", "is_hidden": true}, {"input": "1 3", "expected_output": "2.67", "is_hidden": true}, {"input": "0.5 100", "expected_output": "0.04", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "vaqt = hajm × 8 / tezlik."}, {"order": 2, "text": "Formatlash: f'{x:.2f}'."}]$j$::jsonb, 'easy', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 2. 2-amaliy mashg'ulot: Tarmoq topologiyasini loyihalash va hisoblash
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$2-amaliy mashg'ulot: Tarmoq topologiyasini loyihalash va hisoblash$kt$, 'kt-a02-topologiya',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>Topologiya tanlash, kabel va qurilmalar sonini hisoblash hamda nosozlik ta'sirini tahlil qilishni o'rganish.</p>

<h2>1. Asosiy formulalar</h2>
<table>
  <tr><th>Topologiya</th><th>Liniyalar soni (n tugun)</th><th>Bitta liniya uzilsa</th></tr>
  <tr><td>Shina</td><td>1 magistral + n ulanish</td><td>Magistral uzilsa — tarmoq bo'linadi</td></tr>
  <tr><td>Yulduz</td><td>n</td><td>Faqat bitta kompyuter uziladi</td></tr>
  <tr><td>Halqa</td><td>n</td><td>Bitta halqada — aloqa buziladi</td></tr>
  <tr><td>To'liq bog'langan</td><td>n·(n−1)/2</td><td>Boshqa yo'l orqali ishlaydi</td></tr>
</table>

<h2>2. Namuna: ofis loyihasi</h2>
<p><i>Ofisda 50 ta ish o'rni. 24 portli kommutatorlar bor. Kabel kommutatorlar shkafidan ish o'rinlarigacha o'rtacha 18 m, har kabelga 2 m zaxira qo'shiladi.</i></p>
<ol>
  <li><b>Topologiya</b>: daraxt (ierarxik yulduz) — markaziy (yadro) kommutator va undan pastda bo'lim kommutatorlari.</li>
  <li><b>Kirish kommutatorlari</b>: har birida 1 port yuqoriga (uplink) ketadi, demak ish o'rinlari uchun 23 port. 50 / 23 = 2,17 → <b>3 ta</b> kommutator.</li>
  <li><b>Yadro kommutatori</b>: 3 ta uplink + server + router — <b>1 ta</b> yetadi.</li>
  <li><b>Kabel</b>: 50 × (18 + 2) = <b>1000 m</b> ish o'rinlariga. Uplinklar alohida hisoblanadi.</li>
  <li><b>Tekshirish</b>: eng uzun liniya 100 m dan oshmasligi kerak (juft o'ralgan kabel).</li>
</ol>
<blockquote>Zaxira portlar qoldiring: tarmoq doim o'sadi. Amaliyotda kommutator portlarining 70–80% idan ortig'ini band qilmaslik tavsiya etiladi.</blockquote>

<h2>3. Nosozlik tahlili</h2>
<p>Daraxtda yadro kommutatori ishdan chiqsa — bo'limlar bir-birini va serverni ko'rmaydi; bo'lim kommutatori ishdan chiqsa — faqat o'sha bo'lim uziladi. Muhim tugunlar uchun <b>zaxira</b>: ikkita yadro kommutatori va har bo'limdan ikkalasiga uplink (qisman mesh).</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyada har topologiya uchun 6 ta kompyuter bilan bitta kabelni, keyin markaziy qurilmani "uzing" va bog'langan juftliklar sonini yozib oling.</li>
  <li>To'liq bog'langan topologiyada kabellar soni n ga qarab qanday o'sishini kuzating.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Topologiyani loyihalash", "subtitle": "2-amaliy mashg'ulot", "emoji": "📐"}, {"t": "table", "title": "Formulalar", "head": ["Topologiya", "Liniyalar"], "rows": [["Yulduz", "n"], ["Halqa", "n"], ["Mesh", "n·(n−1)/2"]]}, {"t": "code", "title": "50 ish o'rni, 24 portli switch", "code": "har switchda: 24 − 1 uplink = 23 port\n50 / 23 = 2,17 → 3 ta kirish switchi\n+ 1 ta yadro switchi", "note": "Kabel: 50 × (18 + 2) = 1000 m"}, {"t": "quiz", "title": "Tekshiramiz", "question": "7 tugunli mesh uchun nechta liniya?", "options": ["42", "49", "21", "14"], "answer": 2, "explain": "7·6/2 = 21."}, {"t": "compare", "title": "Nosozlik ta'siri (daraxt)", "left": {"label": "Yadro switchi", "text": "Bo'limlar orasidagi aloqa va server yo'qoladi"}, "right": {"label": "Bo'lim switchi", "text": "Faqat o'sha bo'lim uziladi"}}, {"t": "idea", "title": "Zaxira", "text": "Ikki yadro kommutatori va har bo'limdan ikkalasiga uplink — qisman mesh. Bitta qurilma ishdan chiqsa ham tarmoq ishlaydi.", "emoji": "🛟"}, {"t": "summary", "title": "Xulosa", "items": ["Yulduz/daraxt — bugungi standart", "Uplinklarni portlar hisobiga qo'shing", "Kabel ≤ 100 m, zaxira qoldiring"]}]$j$::jsonb,
  2, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('53d227af-5920-5bba-b7a2-95e1b3302832', '1021917c-ea62-5b53-8872-a66332bf3af7', '0d8aab5c-05ac-5d63-9f81-54260421aba5', '8cdd5f18-31ed-512a-bc1c-b082c007f695', '03be866a-ff05-5705-ad32-a648f527b232', '203816a4-a446-580c-bbda-3bf9e2a738c7');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('53d227af-5920-5bba-b7a2-95e1b3302832', t, $kt$Halqa topologiyasida 8 ta tugun uchun nechta liniya?$kt$, 'single',
   $j$[{"id": "a", "text": "8", "is_correct": true}, {"id": "b", "text": "7", "is_correct": false}, {"id": "c", "text": "16", "is_correct": false}, {"id": "d", "text": "28", "is_correct": false}]$j$::jsonb,
   $kt$Halqada liniyalar soni tugunlar soniga teng.$kt$, 1, 0),
  ('1021917c-ea62-5b53-8872-a66332bf3af7', t, $kt$12 tugunli to'liq bog'langan tarmoqda nechta liniya?$kt$, 'single',
   $j$[{"id": "a", "text": "24", "is_correct": false}, {"id": "b", "text": "66", "is_correct": true}, {"id": "c", "text": "132", "is_correct": false}, {"id": "d", "text": "144", "is_correct": false}]$j$::jsonb,
   $kt$12·11/2 = 66.$kt$, 1, 1),
  ('0d8aab5c-05ac-5d63-9f81-54260421aba5', t, $kt$Yulduz topologiyasida bitta ish o'rni kabeli uzilsa?$kt$, 'single',
   $j$[{"id": "a", "text": "Faqat o'sha kompyuter uziladi", "is_correct": true}, {"id": "b", "text": "Butun tarmoq to'xtaydi", "is_correct": false}, {"id": "c", "text": "Tezlik pasayadi", "is_correct": false}, {"id": "d", "text": "Halqa buziladi", "is_correct": false}]$j$::jsonb,
   $kt$Har kompyuterning alohida kabeli bor.$kt$, 1, 2),
  ('8cdd5f18-31ed-512a-bc1c-b082c007f695', t, $kt$24 portli kirish kommutatorida bitta port uplinkka ketsa, nechta ish o'rni ulanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "25", "is_correct": false}, {"id": "b", "text": "22", "is_correct": false}, {"id": "c", "text": "23", "is_correct": true}, {"id": "d", "text": "24", "is_correct": false}]$j$::jsonb,
   $kt$24 − 1 = 23.$kt$, 1, 3),
  ('03be866a-ff05-5705-ad32-a648f527b232', t, $kt$Juft o'ralgan kabel bilan ish o'rnigacha maksimal masofa?$kt$, 'single',
   $j$[{"id": "a", "text": "500 m", "is_correct": false}, {"id": "b", "text": "100 m", "is_correct": true}, {"id": "c", "text": "50 m", "is_correct": false}, {"id": "d", "text": "185 m", "is_correct": false}]$j$::jsonb,
   $kt$Ethernet standarti bo'yicha 100 m.$kt$, 1, 4),
  ('203816a4-a446-580c-bbda-3bf9e2a738c7', t, $kt$Qaysi choralar daraxt topologiyasining ishonchliligini oshiradi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Ikkinchi yadro kommutatori", "is_correct": true}, {"id": "b", "text": "Har bo'limdan ikkita uplink", "is_correct": true}, {"id": "c", "text": "Hub ga almashtirish", "is_correct": false}, {"id": "d", "text": "Kabel uzunligini 150 m ga yetkazish", "is_correct": false}]$j$::jsonb,
   $kt$Zaxira qurilma va zaxira yo'llar.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('cb2e0454-e0c0-5801-a102-6ef93d5cf672', 'e41bef84-6e71-5e61-b8d2-9014a301711b', 'd4c32e2b-8b1d-5628-9afd-55f313db26ed');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('cb2e0454-e0c0-5801-a102-6ef93d5cf672', t, $kt$Ofis loyihasi$kt$, $kt$Ofisda 70 ta ish o'rni. 24 portli kirish kommutatorlari ishlatiladi (har biridan 1 port uplink). O'rtacha kabel 22 m + 3 m zaxira.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "70 / 23 ni yuqoriga yaxlitlang."}, {"order": 2, "text": "Birinchi uchta kommutatorda 69 ta ish o'rni; qolgani to'rtinchisida."}]$j$::jsonb, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Nechta kirish kommutatori kerak?", "type": "number", "accept": ["4"]}, {"label": "Ish o'rinlariga jami kabel uzunligi, m", "type": "number", "accept": ["1750"], "unit": "m"}, {"label": "To'rtinchi kommutatorda nechta port bo'sh qoladi? (uplinkdan tashqari)", "type": "number", "accept": ["1"]}]}$j$::jsonb, NULL),
  ('e41bef84-6e71-5e61-b8d2-9014a301711b', t, $kt$Mesh narxi$kt$, $kt$Provayder 5 ta shahar marshrutizatorini to'liq bog'lamoqchi. Bitta optik liniya 4 mlrd so'm turadi.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Yangi tugun mavjud har bir tugun bilan ulanadi."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Liniyalar soni", "type": "number", "accept": ["10"]}, {"label": "Jami narx, mlrd so'm", "type": "number", "accept": ["40"], "unit": "mlrd"}, {"label": "6-shahar qo'shilsa, qo'shimcha nechta liniya kerak?", "type": "number", "accept": ["5"]}]}$j$::jsonb, NULL),
  ('d4c32e2b-8b1d-5628-9afd-55f313db26ed', t, $kt$Liniyalar kalkulyatori$kt$, $kt$Tugunlar soni n kiritiladi (n ≥ 2). Uch qatorda chiqaring: yulduz (markazdan tashqari n ta kompyuter uchun) liniyalari, halqa liniyalari, to'liq bog'langan liniyalar.
Masalan: 5 → 5, 5, 10$kt$,
   NULL,
   $kt$n = int(input())
# Kodingizni shu yerga yozing
$kt$, $kt$n = int(input())
print(n)
print(n)
print(n * (n - 1) // 2)$kt$, 'python',
   $j$[{"input": "5", "expected_output": "5\n5\n10", "is_hidden": false}, {"input": "2", "expected_output": "2\n2\n1", "is_hidden": false}, {"input": "10", "expected_output": "10\n10\n45", "is_hidden": true}, {"input": "50", "expected_output": "50\n50\n1225", "is_hidden": true}, {"input": "100", "expected_output": "100\n100\n4950", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "Mesh: n·(n−1)/2 — butun bo'lish // ishlating."}]$j$::jsonb, 'easy', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 3. 3-amaliy mashg'ulot: OSI modeli. Inkapsulyatsiya va sarlavhalar yukini hisoblash
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$3-amaliy mashg'ulot: OSI modeli. Inkapsulyatsiya va sarlavhalar yukini hisoblash$kt$, 'kt-a03-osi-inkapsulyatsiya',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>Protokollarni OSI pog'onalariga taqsimlash va inkapsulyatsiya natijasida kadr hajmi hamda uzatish samaradorligini hisoblash.</p>

<h2>1. Sarlavhalar</h2>
<table>
  <tr><th>Pog'ona</th><th>Sarlavha</th><th>Hajmi</th></tr>
  <tr><td>Transport</td><td>TCP / UDP</td><td>20 / 8 bayt</td></tr>
  <tr><td>Tarmoq</td><td>IPv4</td><td>20 bayt</td></tr>
  <tr><td>Kanal</td><td>Ethernet sarlavha + FCS</td><td>14 + 4 = 18 bayt</td></tr>
</table>
<p>Ethernet ma'lumot qismi 46–1500 bayt: 46 dan kam bo'lsa, to'ldiriladi (padding). Demak kadr 64–1518 bayt.</p>

<h2>2. Formulalar</h2>
<pre><code>IP paket   = foydali yuk + L4 sarlavha + 20
Kadr       = max(IP paket, 46) + 18
Samaradorlik = foydali yuk / kadr × 100%</code></pre>

<h3>Namuna 1. Katta TCP segment</h3>
<pre><code>Foydali yuk = 1460 B (TCP)
IP paket    = 1460 + 20 + 20 = 1500 B   (MTU ga teng)
Kadr        = 1500 + 18 = 1518 B
Samaradorlik = 1460 / 1518 = 96.18%</code></pre>

<h3>Namuna 2. Kichik UDP xabar</h3>
<pre><code>Foydali yuk = 10 B (UDP)
IP paket    = 10 + 8 + 20 = 38 B  →  46 gacha to'ldiriladi
Kadr        = 46 + 18 = 64 B
Samaradorlik = 10 / 64 = 15.6%</code></pre>
<p>Xulosa: kichik xabarlarda kanalning katta qismi sarlavhalarga ketadi. Shuning uchun ma'lumotni katta bo'laklarda yuborish samaraliroq, VoIP kabi kichik paketli xizmatlarda esa sarlavhalarni siqish usullari qo'llanadi.</p>

<h2>3. Pog'onaga taqsimlash</h2>
<table>
  <tr><th>Hodisa</th><th>Pog'ona</th></tr>
  <tr><td>Kabel ulagichi qisilmagan</td><td>1 — fizik</td></tr>
  <tr><td>Kadrning FCS i mos kelmadi</td><td>2 — kanal</td></tr>
  <tr><td>Paket TTL tugab tashlandi</td><td>3 — tarmoq</td></tr>
  <tr><td>Port 443 yopiq</td><td>4 — transport</td></tr>
  <tr><td>Sayt sertifikati eskirgan (TLS)</td><td>6 — taqdimot</td></tr>
  <tr><td>Veb-server 404 qaytardi</td><td>7 — amaliy</td></tr>
</table>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyada "Salom!" xabarini 15 qadamda yuborib, har pog'onada qo'shilgan sarlavhani yozib oling.</li>
  <li>"Sarlavhalar qancha joy oladi?" bo'limida foydali yukni 10, 100, 1460 baytga qo'yib, natijani namunalar bilan solishtiring.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Inkapsulyatsiya hisobi", "subtitle": "3-amaliy mashg'ulot", "emoji": "📦"}, {"t": "table", "title": "Sarlavhalar", "head": ["Sarlavha", "Bayt"], "rows": [["TCP", "20"], ["UDP", "8"], ["IPv4", "20"], ["Ethernet + FCS", "18"]]}, {"t": "code", "title": "Formulalar", "code": "IP  = yuk + L4 + 20\nKadr = max(IP, 46) + 18\nSamaradorlik = yuk / kadr"}, {"t": "code", "title": "1460 B TCP", "code": "IP = 1500, kadr = 1518\nsamaradorlik = 96.18%"}, {"t": "code", "title": "10 B UDP", "code": "IP = 38 → 46 (padding), kadr = 64\nsamaradorlik = 15.6%"}, {"t": "quiz", "title": "Tekshiramiz", "question": "100 B foydali yuk TCP orqali. Kadr hajmi?", "options": ["118", "158", "140", "164"], "answer": 1, "explain": "100 + 20 + 20 = 140; 140 + 18 = 158."}, {"t": "quiz", "title": "Tekshiramiz", "question": "'Port 443 yopiq' — qaysi pog'ona muammosi?", "options": ["3", "7", "4", "2"], "answer": 2, "explain": "Portlar — transport pog'onasi."}, {"t": "summary", "title": "Xulosa", "items": ["Har pog'ona o'z sarlavhasini qo'shadi", "Kadr ≥ 64 B — kichik yuk to'ldiriladi", "Katta bo'lakda yuborish samaraliroq"]}]$j$::jsonb,
  3, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('797f135b-179e-52f3-be82-8cc727368244', '70f8bbc8-ea23-5549-850c-93dc1b2227bf', '9f8c3ae3-7931-5fe4-aede-b747318235d5', '57050da1-9eb9-52f7-af31-9ae127cc6869', 'e00b4337-195c-5933-a97f-eaae92c39e30', '2a08265d-a298-56fa-ada1-9ff5e36c2d13');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('797f135b-179e-52f3-be82-8cc727368244', t, $kt$1460 bayt TCP ma'lumot uchun Ethernet kadr hajmi?$kt$, 'single',
   $j$[{"id": "a", "text": "1538", "is_correct": false}, {"id": "b", "text": "1460", "is_correct": false}, {"id": "c", "text": "1500", "is_correct": false}, {"id": "d", "text": "1518", "is_correct": true}]$j$::jsonb,
   $kt$1460 + 20 + 20 + 18 = 1518.$kt$, 1, 0),
  ('70f8bbc8-ea23-5549-850c-93dc1b2227bf', t, $kt$UDP orqali 20 bayt yuborildi. IP paket hajmi?$kt$, 'single',
   $j$[{"id": "a", "text": "40", "is_correct": false}, {"id": "b", "text": "28", "is_correct": false}, {"id": "c", "text": "66", "is_correct": false}, {"id": "d", "text": "48", "is_correct": true}]$j$::jsonb,
   $kt$20 + 8 + 20 = 48 ≥ 46 — to'ldirish shart emas.$kt$, 1, 1),
  ('9f8c3ae3-7931-5fe4-aede-b747318235d5', t, $kt$Ethernet ma'lumot qismi 46 baytdan kam bo'lsa nima qilinadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Kadr tashlanadi", "is_correct": false}, {"id": "b", "text": "Fragmentlanadi", "is_correct": false}, {"id": "c", "text": "UDP ga o'tkaziladi", "is_correct": false}, {"id": "d", "text": "Nollar bilan to'ldiriladi", "is_correct": true}]$j$::jsonb,
   $kt$Padding — kadr 64 baytdan kichik bo'lmasligi uchun.$kt$, 1, 2),
  ('57050da1-9eb9-52f7-af31-9ae127cc6869', t, $kt$'Kadrning FCS i mos kelmadi' — qaysi pog'ona?$kt$, 'single',
   $j$[{"id": "a", "text": "Kanal", "is_correct": true}, {"id": "b", "text": "Fizik", "is_correct": false}, {"id": "c", "text": "Transport", "is_correct": false}, {"id": "d", "text": "Tarmoq", "is_correct": false}]$j$::jsonb,
   $kt$FCS — kanal pog'onasi tekshiruvi.$kt$, 1, 3),
  ('e00b4337-195c-5933-a97f-eaae92c39e30', t, $kt$'Veb-server 404 qaytardi' — qaysi pog'ona?$kt$, 'single',
   $j$[{"id": "a", "text": "Amaliy", "is_correct": true}, {"id": "b", "text": "Transport", "is_correct": false}, {"id": "c", "text": "Seans", "is_correct": false}, {"id": "d", "text": "Taqdimot", "is_correct": false}]$j$::jsonb,
   $kt$HTTP — amaliy pog'ona.$kt$, 1, 4),
  ('2a08265d-a298-56fa-ada1-9ff5e36c2d13', t, $kt$Qaysi hollarda samaradorlik past bo'ladi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "1460 baytli segmentlar", "is_correct": false}, {"id": "b", "text": "UDP o'rniga TCP (kichik yukda)", "is_correct": true}, {"id": "c", "text": "Kichik foydali yuk", "is_correct": true}, {"id": "d", "text": "Ko'p sarlavha qatlamlari (tunnellash)", "is_correct": true}]$j$::jsonb,
   $kt$Katta segmentda samaradorlik ~96%.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('622bd21d-3655-5309-a04a-834e651c66cc', '4bad280c-8244-5cb4-83f2-89d6c4244f1b', '93f98c9f-93f1-530e-b819-349398b9cc45');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('622bd21d-3655-5309-a04a-834e651c66cc', t, $kt$Kadr va samaradorlik$kt$, $kt$Foydali yuk TCP orqali yuboriladi (TCP 20, IP 20, Ethernet 18 bayt).$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "IP = yuk + L4 + 20, kadr = max(IP, 46) + 18."}, {"order": 2, "text": "Padding = 46 − IP paket."}]$j$::jsonb, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Yuk 500 B: kadr hajmi", "type": "number", "accept": ["558"], "unit": "B"}, {"label": "Yuk 500 B: samaradorlik, % (1 xona)", "type": "number", "accept": ["89.6"], "tol": 0.1, "unit": "%"}, {"label": "Yuk 4 B (UDP): kadr hajmi", "type": "number", "accept": ["64"], "unit": "B"}, {"label": "Yuk 4 B (UDP): to'ldirish (padding) necha bayt?", "type": "number", "accept": ["14"], "unit": "B"}]}$j$::jsonb, NULL),
  ('4bad280c-8244-5cb4-83f2-89d6c4244f1b', t, $kt$Pog'onani aniqlang$kt$, $kt$Hodisa OSI ning qaysi pog'onasiga tegishli? Raqam kiriting.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Kommutator MAC jadvali to'lib qoldi", "type": "number", "accept": ["2"]}, {"label": "Marshrutizatorda marshrut topilmadi", "type": "number", "accept": ["3"]}, {"label": "TCP segmenti qayta yuborildi", "type": "number", "accept": ["4"]}, {"label": "Kabelda elektromagnit xalaqit", "type": "number", "accept": ["1"]}]}$j$::jsonb, NULL),
  ('93f98c9f-93f1-530e-b819-349398b9cc45', t, $kt$Kadr kalkulyatori$kt$, $kt$Bir qatorda foydali yuk hajmi (bayt, 1–1460) va protokol (TCP yoki UDP). Ikki qatorda chiqaring: Ethernet kadr hajmi va samaradorlik foizi (1 xona).
Sarlavhalar: TCP 20, UDP 8, IP 20, Ethernet 18. Ma'lumot qismi kamida 46 bayt.
Masalan: 1460 TCP → 1518 va 96.2$kt$,
   NULL,
   $kt$yuk, proto = input().split()
yuk = int(yuk)
# Kodingizni shu yerga yozing
$kt$, $kt$yuk, proto = input().split()
yuk = int(yuk)
l4 = 20 if proto == 'TCP' else 8
ip = max(yuk + l4 + 20, 46)
kadr = ip + 18
print(kadr)
print(f'{yuk / kadr * 100:.1f}')$kt$, 'python',
   $j$[{"input": "1460 TCP", "expected_output": "1518\n96.2", "is_hidden": false}, {"input": "10 UDP", "expected_output": "64\n15.6", "is_hidden": false}, {"input": "100 TCP", "expected_output": "158\n63.3", "is_hidden": true}, {"input": "18 UDP", "expected_output": "64\n28.1", "is_hidden": true}, {"input": "1 TCP", "expected_output": "64\n1.6", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "max(..., 46) — to'ldirishni hisobga oladi."}]$j$::jsonb, 'medium', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 4. 4-amaliy mashg'ulot: Kanal o'tkazuvchanligi va kechikishlarni hisoblash
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$4-amaliy mashg'ulot: Kanal o'tkazuvchanligi va kechikishlarni hisoblash$kt$, 'kt-a04-tezlik-kechikish',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>Uzatish vaqti, tarqalish kechikishi va kanalning nazariy maksimal tezligini (Naykvist, Shennon) hisoblash.</p>

<h2>1. Kechikish tarkibi</h2>
<ul>
  <li><b>Uzatish vaqti</b> (transmission) — barcha bitlarni kanalga "itarish": <code>t<sub>u</sub> = L / R</code> (L — bitlar, R — tezlik).</li>
  <li><b>Tarqalish kechikishi</b> (propagation) — signal yo'lni bosib o'tishi: <code>t<sub>t</sub> = d / v</code>. Mis va optikada v ≈ 2·10<sup>8</sup> m/s, radioda ≈ 3·10<sup>8</sup> m/s.</li>
  <li><b>Navbat</b> va <b>qayta ishlash</b> kechikishlari — marshrutizatorlarda (bu mashg'ulotda hisobga olinmaydi).</li>
</ul>

<h3>Namuna 1</h3>
<pre><code>10 MB fayl, 100 Mbit/s, masofa 1000 km (optika)
t_u = 10·8·10⁶ / 10⁸ = 0,8 s
t_t = 10⁶ m / 2·10⁸ = 0,005 s = 5 ms
Jami ≈ 0,805 s  → asosiy vaqt uzatishga ketgan</code></pre>
<h3>Namuna 2</h3>
<pre><code>100 baytli paket, 1 Gbit/s, Toshkent–Nyu-York ~10 000 km
t_u = 800 / 10⁹ = 0,8 µs
t_t = 10⁷ / 2·10⁸ = 0,05 s = 50 ms  → asosiy vaqt yo'lda</code></pre>
<p>Xulosa: kichik paket va uzoq masofada tezroq kanal deyarli yordam bermaydi — yorug'lik tezligi chegara.</p>

<h2>2. Kanalning nazariy chegarasi</h2>
<ul>
  <li><b>Naykvist</b> (shovqinsiz kanal): <code>C = 2B·log<sub>2</sub>M</code>, B — polosa (Hz), M — signal sathlari soni.</li>
  <li><b>Shennon</b> (shovqinli kanal): <code>C = B·log<sub>2</sub>(1 + S/N)</code>. S/N desibelda berilsa: <code>S/N = 10<sup>dB/10</sup></code>.</li>
</ul>
<h3>Namuna 3</h3>
<pre><code>Telefon kanali: B = 3100 Hz, S/N = 30 dB → 10³ = 1000
C = 3100 · log₂(1001) ≈ 30898 bit/s ≈ 30.9 kbit/s</code></pre>
<p>Shuning uchun oddiy telefon modemlari ~33,6 kbit/s dan oshmagan.</p>
<h3>Namuna 4</h3>
<pre><code>B = 4000 Hz, 4 ta sath (M = 4), shovqinsiz
C = 2 · 4000 · log₂4 = 16000 bit/s</code></pre>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyadagi "Muhit va kechikish" bo'limida tayyor ssenariylarni ishga tushirib, uzatish va tarqalish ulushini solishtiring.</li>
  <li>Namunalarni simulyatsiyada takrorlab, natijalar mosligini tekshiring.</li>
  <li>Topshiriqlarni bajaring.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Tezlik va kechikish", "subtitle": "4-amaliy mashg'ulot", "emoji": "⏱️"}, {"t": "compare", "title": "Ikki kechikish", "left": {"label": "Uzatish: L / R", "text": "Bitlarni kanalga itarish. Tezroq kanal qisqartiradi"}, "right": {"label": "Tarqalish: d / v", "text": "Signal yo'lda. Faqat masofaga bog'liq"}}, {"t": "code", "title": "10 MB, 100 Mbit/s, 1000 km", "code": "t_u = 80·10⁶ / 10⁸ = 0,8 s\nt_t = 10⁶ / 2·10⁸ = 5 ms"}, {"t": "quiz", "title": "Tekshiramiz", "question": "1500 bayt paket, 1 Gbit/s. Uzatish vaqti?", "options": ["12 µs", "120 µs", "1,5 µs", "1,2 ms"], "answer": 0, "explain": "1500·8 = 12 000 bit; 12 000 / 10⁹ = 12 µs."}, {"t": "table", "title": "Formulalar", "head": ["Nomi", "Formula"], "rows": [["Naykvist", "C = 2B·log₂M"], ["Shennon", "C = B·log₂(1 + S/N)"], ["dB → marta", "S/N = 10^(dB/10)"]]}, {"t": "code", "title": "Telefon kanali (Shennon)", "code": "B = 3100 Hz, S/N = 30 dB = 1000\nC = 3100·log₂(1001) ≈ 30898 bit/s"}, {"t": "quiz", "title": "Tekshiramiz", "question": "20 dB necha martaga teng?", "options": ["200", "1000", "100", "20"], "answer": 2, "explain": "10^(20/10) = 100."}, {"t": "summary", "title": "Xulosa", "items": ["Jami ≈ uzatish + tarqalish", "Uzoq masofada tarqalish ustun", "Shennon — shovqinli kanal chegarasi"]}]$j$::jsonb,
  4, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('e3418f92-283d-5c26-bf60-6c94af5d0f8d', '3a70e438-d2ec-5453-8558-1791de8e3eba', '776073d6-2827-5f65-9699-d9f17f08224e', '2c51119d-d036-5bd3-97b6-ff1a96dd5924', '6c5fbd80-18b6-5a5c-b46c-b39dd82056db', '309f9356-d31f-59e8-ae8c-c053e9b8fbd2');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('e3418f92-283d-5c26-bf60-6c94af5d0f8d', t, $kt$Tarqalish kechikishi nimaga bog'liq?$kt$, 'single',
   $j$[{"id": "a", "text": "Masofa va signal tezligiga", "is_correct": true}, {"id": "b", "text": "Paket hajmiga", "is_correct": false}, {"id": "c", "text": "Protokolga", "is_correct": false}, {"id": "d", "text": "Kanal tezligiga", "is_correct": false}]$j$::jsonb,
   $kt$t = d / v.$kt$, 1, 0),
  ('3a70e438-d2ec-5453-8558-1791de8e3eba', t, $kt$Optik tolada signal tezligi taxminan?$kt$, 'single',
   $j$[{"id": "a", "text": "3·10⁵ m/s", "is_correct": false}, {"id": "b", "text": "3·10¹⁰ m/s", "is_correct": false}, {"id": "c", "text": "2·10⁸ m/s", "is_correct": true}, {"id": "d", "text": "340 m/s", "is_correct": false}]$j$::jsonb,
   $kt$Yorug'lik tezligining ~2/3 qismi.$kt$, 1, 1),
  ('776073d6-2827-5f65-9699-d9f17f08224e', t, $kt$Shovqinsiz kanal uchun qaysi formula?$kt$, 'single',
   $j$[{"id": "a", "text": "Shennon", "is_correct": false}, {"id": "b", "text": "Om", "is_correct": false}, {"id": "c", "text": "Dijkstra", "is_correct": false}, {"id": "d", "text": "Naykvist", "is_correct": true}]$j$::jsonb,
   $kt$Shennon — shovqinli kanal.$kt$, 1, 2),
  ('2c51119d-d036-5bd3-97b6-ff1a96dd5924', t, $kt$30 dB signal/shovqin nisbati necha martaga teng?$kt$, 'single',
   $j$[{"id": "a", "text": "30", "is_correct": false}, {"id": "b", "text": "1000", "is_correct": true}, {"id": "c", "text": "300", "is_correct": false}, {"id": "d", "text": "3000", "is_correct": false}]$j$::jsonb,
   $kt$10³ = 1000.$kt$, 1, 3),
  ('6c5fbd80-18b6-5a5c-b46c-b39dd82056db', t, $kt$100 km optik liniyadagi tarqalish kechikishi?$kt$, 'single',
   $j$[{"id": "a", "text": "0,33 ms", "is_correct": false}, {"id": "b", "text": "5 ms", "is_correct": false}, {"id": "c", "text": "0,5 ms", "is_correct": true}, {"id": "d", "text": "50 µs", "is_correct": false}]$j$::jsonb,
   $kt$10⁵ / 2·10⁸ = 0,0005 s.$kt$, 1, 4),
  ('309f9356-d31f-59e8-ae8c-c053e9b8fbd2', t, $kt$Kanal tezligini 10 baravar oshirish qaysi holda jami vaqtni sezilarli kamaytiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Kichik paket, qit'alararo masofa", "is_correct": false}, {"id": "b", "text": "Hech qachon", "is_correct": false}, {"id": "c", "text": "Katta fayl, yaqin masofa", "is_correct": true}, {"id": "d", "text": "Har doim", "is_correct": false}]$j$::jsonb,
   $kt$Bunda vaqtning asosiy qismi — uzatish.$kt$, 1, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('8b105e9e-5f3d-5fc6-9e09-026322a90814', 'e24c1b3f-1ab9-5e87-a86d-ae70cefec68e', 'f8093e70-6c86-5c07-9338-0119fc768941');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('8b105e9e-5f3d-5fc6-9e09-026322a90814', t, $kt$Kechikishlarni hisoblang$kt$, $kt$50 MB fayl 200 Mbit/s kanal orqali 2000 km masofaga (optika, v = 2·10⁸ m/s) yuborilmoqda. 1 MB = 8·10⁶ bit.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "t_u = 400·10⁶ / 2·10⁸."}, {"order": 2, "text": "t_t = 2·10⁶ / 2·10⁸."}]$j$::jsonb, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Uzatish vaqti", "type": "number", "accept": ["2"], "unit": "s"}, {"label": "Tarqalish kechikishi, ms", "type": "number", "accept": ["10"], "unit": "ms"}, {"label": "Jami vaqt, s", "type": "number", "accept": ["2.01"], "tol": 0.0005, "unit": "s"}]}$j$::jsonb, NULL),
  ('e24c1b3f-1ab9-5e87-a86d-ae70cefec68e', t, $kt$Kanal chegarasi$kt$, $kt$Natijani butun songacha yaxlitlang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "log₂8 = 3."}, {"order": 2, "text": "20 dB = 100 marta; log₂(101) ≈ 6,658."}]$j$::jsonb, 'medium', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Naykvist: B = 3000 Hz, M = 8 sath. C, bit/s", "type": "number", "accept": ["18000"], "unit": "bit/s"}, {"label": "Shennon: B = 1 MHz, S/N = 20 dB. C, bit/s", "type": "number", "accept": ["6658211"], "tol": 1, "unit": "bit/s"}]}$j$::jsonb, NULL),
  ('f8093e70-6c86-5c07-9338-0119fc768941', t, $kt$Jami kechikish$kt$, $kt$Bir qatorda to'rt son: fayl hajmi (bayt), kanal tezligi (bit/s), masofa (km), signal tezligi (m/s). Jami kechikishni (uzatish + tarqalish) millisekundlarda 3 xona aniqlikda chiqaring.
Masalan: 1500 1000000000 1000 200000000 → 5.012$kt$,
   NULL,
   $kt$hajm, tezlik, km, v = map(float, input().split())
# Kodingizni shu yerga yozing
$kt$, $kt$hajm, tezlik, km, v = map(float, input().split())
t = hajm * 8 / tezlik + km * 1000 / v
print(f'{t * 1000:.3f}')$kt$, 'python',
   $j$[{"input": "1500 1000000000 1000 200000000", "expected_output": "5.012", "is_hidden": false}, {"input": "10000000 100000000 1000 200000000", "expected_output": "805.000", "is_hidden": false}, {"input": "100 1000000000 10000 200000000", "expected_output": "50.001", "is_hidden": true}, {"input": "64 10000000 0.1 200000000", "expected_output": "0.052", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "Uzatish: hajm × 8 / tezlik (s). Tarqalish: km × 1000 / v (s)."}, {"order": 2, "text": "Natijani 1000 ga ko'paytirib ms ga o'tkazing."}]$j$::jsonb, 'medium', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 5. 5-amaliy mashg'ulot: Signal kodlash va xatolarni aniqlash (juftlik, CRC)
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$5-amaliy mashg'ulot: Signal kodlash va xatolarni aniqlash (juftlik, CRC)$kt$, 'kt-a05-kodlash-xatolar',
$kt$<h2>Mashg'ulot maqsadi</h2>
<p>Bitlarni turli kodlarda chizish, juftlik biti va CRC qoldig'ini qo'lda hisoblash.</p>

<h2>1. Kodlash</h2>
<p>Konventsiya (simulyatsiyadagi bilan bir xil): NRZ-L — 1 yuqori, 0 past; Manchester (IEEE 802.3) — 0: yuqoridan pastga, 1: pastdan yuqoriga (bit o'rtasida); NRZI — 1 da bit boshida o'tish; AMI — 1 navbat bilan + va −.</p>
<h3>Namuna: 1011 ni Manchester kodida</h3>
<pre><code>bit:    1     0     1     1
sath:  ▁▔    ▔▁    ▁▔    ▁▔
        └ har bit o'rtasida o'tish; ikki bir xil bit orasida chegarada ham o'tish</code></pre>
<p>NRZ-L da <code>1011000010</code> ketma-ketligida sath 5 marta o'zgaradi; to'rtta nol ketma-ket kelganda o'zgarish yo'q — qabul qiluvchi soatini yo'qotishi mumkin.</p>

<h2>2. Juftlik biti</h2>
<pre><code>Ma'lumot: 1011001  → 1 lar soni 4 (juft)
Juft (even) usul: juftlik biti 0 → 10110010
Toq (odd) usul:   juftlik biti 1 → 10110011</code></pre>

<h2>3. CRC</h2>
<p>Hosil qiluvchi polinom G daraja r bo'lsa (bitlar soni r+1), ma'lumot oxiriga r ta nol qo'shiladi va modul-2 da (ayirish o'rniga XOR) G ga bo'linadi. Qoldiq — CRC.</p>
<h3>Namuna: ma'lumot 110101, G = 1011 (r = 3)</h3>
<pre><code>110101000
1011   XOR
011001000
 1011   XOR
001111000
  1011   XOR
000100000
   1011   XOR
000001100
     1011   XOR
000000111
Qoldiq = 111
Yuboriladi: 110101111</code></pre>
<p>Qabul qiluvchi butun kodni G ga bo'ladi: qoldiq 0 — xato yo'q; aks holda kadr buzilgan.</p>

<h2>Ish tartibi</h2>
<ol>
  <li>Simulyatsiyada <code>10101010</code> va <code>00000000</code> uchun NRZ-L va Manchester shakllarini solishtiring.</li>
  <li>CRC bo'limida 110101 / 1011 ni kiritib, har XOR qadamini daftaringizdagi hisob bilan solishtiring.</li>
  <li>Qabul qilingan koddagi bitta bitni o'zgartirib, qoldiq nolga teng bo'lmay qolishini kuzating.</li>
</ol>$kt$,
  $j$[{"t": "title", "title": "Kodlash va xatolar", "subtitle": "5-amaliy mashg'ulot", "emoji": "🧮"}, {"t": "table", "title": "Kodlash qoidalari", "head": ["Kod", "1", "0"], "rows": [["NRZ-L", "yuqori", "past"], ["Manchester", "↑ o'rtada", "↓ o'rtada"], ["NRZI", "o'tish", "o'tish yo'q"], ["AMI", "+/− navbat", "nol"]]}, {"t": "code", "title": "Juftlik biti", "code": "1011001 → 1 lar: 4\nEven: +0 → 10110010\nOdd:  +1 → 10110011"}, {"t": "points", "title": "CRC qadamlari", "items": [{"e": "1️⃣", "text": "Oxiriga r ta nol qo'shish"}, {"e": "2️⃣", "text": "G ga modul-2 bo'lish (XOR)"}, {"e": "3️⃣", "text": "Qoldiq — CRC"}, {"e": "4️⃣", "text": "Qabulda qoldiq 0 bo'lishi kerak"}]}, {"t": "code", "title": "110101 / 1011", "code": "110101000 ÷ 1011\nqoldiq = 111\nyuboriladi: 110101111"}, {"t": "quiz", "title": "Tekshiramiz", "question": "0110011 uchun toq (odd) juftlik biti?", "options": ["Bit qo'shilmaydi", "1", "0"], "answer": 1, "explain": "1 lar soni 4 (juft). Umumiy son toq bo'lishi uchun 1 qo'shiladi."}, {"t": "summary", "title": "Xulosa", "items": ["Manchester — har bit o'rtasida o'tish", "Juftlik — 1 ta xatoni aniqlaydi", "CRC — XOR bilan bo'lish qoldig'i"]}]$j$::jsonb,
  5, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('33fc95c3-a8c6-524e-80b0-d1ed92d00aaa', '58bd0697-f2ab-5c4b-825f-3dd338a5d29a', '526fb76f-0863-5022-ab8a-664801a66a67', 'f356b51a-c5e7-5f60-bfb9-587871750fe1', '90057afc-cd28-5a21-a74d-0dc134c0aaaf', '6da53629-c60f-51ef-927d-4d38e36e073b');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('33fc95c3-a8c6-524e-80b0-d1ed92d00aaa', t, $kt$Manchester (IEEE 802.3) da 1 qanday kodlanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Bit o'rtasida yuqoridan pastga", "is_correct": false}, {"id": "b", "text": "Nol sath", "is_correct": false}, {"id": "c", "text": "Bit o'rtasida pastdan yuqoriga", "is_correct": true}, {"id": "d", "text": "Doim yuqori sath", "is_correct": false}]$j$::jsonb,
   $kt$0 — yuqoridan pastga.$kt$, 1, 0),
  ('58bd0697-f2ab-5c4b-825f-3dd338a5d29a', t, $kt$NRZI da sath qachon o'zgaradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Hech qachon", "is_correct": false}, {"id": "b", "text": "Har 1 da", "is_correct": true}, {"id": "c", "text": "Har 0 da", "is_correct": false}, {"id": "d", "text": "Har bit o'rtasida", "is_correct": false}]$j$::jsonb,
   $kt$1 — bit boshida o'tish.$kt$, 1, 1),
  ('526fb76f-0863-5022-ab8a-664801a66a67', t, $kt$Juft juftlik usulida 1110001 ga qanday bit qo'shiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Bit qo'shilmaydi", "is_correct": false}, {"id": "b", "text": "0", "is_correct": true}, {"id": "c", "text": "1", "is_correct": false}]$j$::jsonb,
   $kt$1 lar soni 4 — allaqachon juft, shuning uchun 0 qo'shiladi.$kt$, 1, 2),
  ('f356b51a-c5e7-5f60-bfb9-587871750fe1', t, $kt$CRC hisoblashda bo'lish qaysi amal bilan bajariladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Ko'paytirish", "is_correct": false}, {"id": "b", "text": "AND", "is_correct": false}, {"id": "c", "text": "Oddiy ayirish", "is_correct": false}, {"id": "d", "text": "XOR (modul-2)", "is_correct": true}]$j$::jsonb,
   $kt$Modul-2 arifmetikasida ayirish = XOR.$kt$, 1, 3),
  ('90057afc-cd28-5a21-a74d-0dc134c0aaaf', t, $kt$G = 10011 bo'lsa, ma'lumot oxiriga nechta nol qo'shiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "4", "is_correct": true}, {"id": "b", "text": "8", "is_correct": false}, {"id": "c", "text": "3", "is_correct": false}, {"id": "d", "text": "5", "is_correct": false}]$j$::jsonb,
   $kt$G daraja 4 (5 bit) — 4 ta nol.$kt$, 1, 4),
  ('6da53629-c60f-51ef-927d-4d38e36e073b', t, $kt$Qabul qiluvchida CRC tekshiruvi qoldig'i nol bo'lmasa?$kt$, 'single',
   $j$[{"id": "a", "text": "Kadr to'g'ri", "is_correct": false}, {"id": "b", "text": "Kadr marshrutizatorga yuboriladi", "is_correct": false}, {"id": "c", "text": "Qoldiq qayta hisoblanadi", "is_correct": false}, {"id": "d", "text": "Kadr buzilgan va tashlanadi", "is_correct": true}]$j$::jsonb,
   $kt$Qayta yuborishni yuqori pog'ona (TCP) bajaradi.$kt$, 1, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('d08811a9-ee8f-53cb-8d3d-2efe40f5cb1d', 'ce160e52-3236-53d8-8bed-f7eea36ae97c', '219d9d89-0dfe-505f-9571-d78187ff7382');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('d08811a9-ee8f-53cb-8d3d-2efe40f5cb1d', t, $kt$CRC ni hisoblang$kt$, $kt$Ma'lumot 1101011011, hosil qiluvchi G = 10011.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Virtual simulyatsiyadagi CRC bo'limida qadamlarni ko'rib, o'z hisobingizni tekshiring."}]$j$::jsonb, 'medium', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Ma'lumot oxiriga nechta nol qo'shiladi?", "type": "number", "accept": ["4"]}, {"label": "CRC qoldig'i (4 bit)", "type": "text", "accept": ["1110"]}, {"label": "Yuboriladigan to'liq kod", "type": "text", "accept": ["11010110111110"]}]}$j$::jsonb, NULL),
  ('ce160e52-3236-53d8-8bed-f7eea36ae97c', t, $kt$Juftlik va o'tishlar$kt$, $kt$Ma'lumot: 1100101.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Juft (even) juftlik biti", "type": "choice", "accept": ["0"], "options": ["0", "1"]}, {"label": "Toq (odd) juftlik biti", "type": "choice", "accept": ["1"], "options": ["0", "1"]}, {"label": "NRZI da necha marta sath o'zgaradi? (1 lar soni)", "type": "number", "accept": ["4"]}, {"label": "NRZ-L da qo'shni bitlar orasida necha marta sath o'zgaradi?", "type": "number", "accept": ["4"]}]}$j$::jsonb, NULL),
  ('219d9d89-0dfe-505f-9571-d78187ff7382', t, $kt$CRC kalkulyatori$kt$, $kt$Ikki qator: ma'lumot bitlari va hosil qiluvchi G (ikkalasi ham 0/1 dan iborat, G 1 bilan boshlanadi). CRC qoldig'ini (len(G) − 1 bit) chiqaring.
Masalan: 1101011011 va 10011 → 1110$kt$,
   NULL,
   $kt$data = input().strip()
g = input().strip()
# Kodingizni shu yerga yozing
$kt$, $kt$data = input().strip()
g = input().strip()
r = len(g) - 1
w = [int(c) for c in data + '0' * r]
for i in range(len(w) - len(g) + 1):
    if w[i]:
        for j in range(len(g)):
            w[i + j] ^= int(g[j])
print(''.join(map(str, w[-r:])))$kt$, 'python',
   $j$[{"input": "1101011011\n10011", "expected_output": "1110", "is_hidden": false}, {"input": "110101\n1011", "expected_output": "111", "is_hidden": false}, {"input": "1000\n1011", "expected_output": "101", "is_hidden": true}, {"input": "11111111\n100000111", "expected_output": "11110011", "is_hidden": true}, {"input": "1\n11", "expected_output": "1", "is_hidden": true}]$j$::jsonb, $j$[{"order": 1, "text": "Ro'yxat bilan ishlang: w[i] 1 bo'lsa, G ni shu joydan boshlab XOR qiling."}, {"order": 2, "text": "Oxirgi r ta element — qoldiq."}]$j$::jsonb, 'hard', 5, 15, 2,
   'code', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

END $mig$;
