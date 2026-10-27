-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: Ma'ruzalar 1–5
--
-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
-- Manba: scripts/kontent/kompyuter-tarmoqlari/m01_05.py
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
  -- 1. 1-ma'ruza: Kirish. Hisoblash tarmoqlarining rivojlanish tarixi va klassifikatsiyasi
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$1-ma'ruza: Kirish. Hisoblash tarmoqlarining rivojlanish tarixi va klassifikatsiyasi$kt$, 'kt-m01-kirish',
$kt$<h2>Ma'ruza rejasi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Kompyuter tarmoqlariga kirish", "subtitle": "Tarix va klassifikatsiya", "emoji": "🌐"}, {"t": "idea", "title": "Tarmoq nima?", "text": "Aloqa kanallari orqali bog'langan va resurslarni birgalikda ishlatadigan avtonom kompyuterlar va qurilmalar majmui.", "emoji": "🔗"}, {"t": "points", "title": "Tarmoq nimaga kerak?", "items": [{"e": "🖨️", "text": "Resurslarni birgalikda ishlatish"}, {"e": "💬", "text": "Ma'lumot almashish"}, {"e": "🛠️", "text": "Markazlashgan boshqaruv"}, {"e": "🛡️", "text": "Ishonchlilik"}, {"e": "💰", "text": "Tejamkorlik"}]}, {"t": "table", "title": "Muhim sanalar", "head": ["Yil", "Voqea"], "rows": [["1969", "ARPANET — 4 tugun"], ["1971", "Elektron pochta, @"], ["1973", "Ethernet"], ["1974", "TCP/IP g'oyasi"], ["1983", "ARPANET TCP/IP ga o'tdi"], ["1989–91", "World Wide Web"], ["1997", "Wi-Fi (802.11)"]]}, {"t": "compare", "title": "Kommutatsiya usullari", "left": {"label": "Kanallar kommutatsiyasi", "text": "Suhbat davomida kanal to'liq band. Telefon tarmog'i."}, "right": {"label": "Paketlar kommutatsiyasi", "text": "Xabar paketlarga bo'linadi, kanal hammaga xizmat qiladi. Internet."}}, {"t": "table", "title": "Qamrov bo'yicha", "head": ["Turi", "Qamrov", "Misol"], "rows": [["PAN", "~10 m", "Telefon + quloqchin"], ["LAN", "bino, kampus", "Kompyuter sinfi"], ["MAN", "shahar", "Bank filiallari"], ["WAN", "mamlakat, dunyo", "Internet"]]}, {"t": "compare", "title": "Arxitektura", "left": {"label": "Bir rangli (peer-to-peer)", "text": "Hamma teng. Arzon, sodda, lekin kichik tarmoq uchun."}, "right": {"label": "Mijoz-server", "text": "Xizmatni server beradi. Markaziy boshqaruv va xavfsizlik."}}, {"t": "quiz", "title": "Tekshiramiz", "question": "Kompyuter sinfidagi 25 ta kompyuter va fayl serveri — qaysi tur?", "options": ["WAN, bir rangli", "MAN, bir rangli", "LAN, mijoz-server", "PAN, mijoz-server"], "answer": 2, "explain": "Bitta xona — LAN; xizmatni ajratilgan server beradi — mijoz-server."}, {"t": "idea", "title": "Bit va bayt", "text": "Tezlik bit/s da, fayl hajmi baytda. 1 bayt = 8 bit, shuning uchun 100 Mbit/s kanal sekundiga 12,5 MB uzatadi.", "emoji": "📏"}, {"t": "summary", "title": "Xulosa", "items": ["Tarmoq — avtonom qurilmalarning resurs almashuvchi majmui", "Paketli kommutatsiya — Internetning asosi", "PAN → LAN → MAN → WAN", "Bir rangli va mijoz-server arxitekturalari"]}]$j$::jsonb,
  1, 10, 25, 80, true, true)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('79dc3011-f35c-5b7c-b851-d61817c516c8', '3a84d9b2-9f9e-54d4-aaa1-a8b1fd60e65f', '89ac8b32-0fac-5606-afe2-defe016da16d', '393852e7-44c2-5cd5-9913-6d1a48e34e7d', 'ac310543-3955-58b3-8630-b12946e4f578', '019adf81-1c2c-5d2f-b860-010b8a3dd760', 'bb1135be-46b4-5158-93b2-1ce5328644dd');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('79dc3011-f35c-5b7c-b851-d61817c516c8', t, $kt$Birinchi paketli kommutatsiyali tarmoq ARPANET qachon ishga tushgan?$kt$, 'single',
   $j$[{"id": "a", "text": "1991", "is_correct": false}, {"id": "b", "text": "1969", "is_correct": true}, {"id": "c", "text": "1957", "is_correct": false}, {"id": "d", "text": "1983", "is_correct": false}]$j$::jsonb,
   $kt$1969-yilda ARPANET ning birinchi 4 tuguni ulangan.$kt$, 1, 0),
  ('3a84d9b2-9f9e-54d4-aaa1-a8b1fd60e65f', t, $kt$Paketli kommutatsiyaning asosiy g'oyasi qaysi?$kt$, 'single',
   $j$[{"id": "a", "text": "Har bir kompyuterga alohida kabel tortiladi", "is_correct": false}, {"id": "b", "text": "Xabar bo'laklarga bo'linib, har bo'lak mustaqil uzatiladi", "is_correct": true}, {"id": "c", "text": "Ma'lumot faqat bitta yo'l bilan uzatiladi", "is_correct": false}, {"id": "d", "text": "Suhbat davomida kanal to'liq band qilinadi", "is_correct": false}]$j$::jsonb,
   $kt$Paketlar mustaqil yo'naltiriladi, kanal esa ko'p foydalanuvchiga navbat bilan xizmat qiladi.$kt$, 1, 1),
  ('89ac8b32-0fac-5606-afe2-defe016da16d', t, $kt$Nega 1983-yil 1-yanvar Internetning tug'ilgan kuni deb ataladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Shu kuni World Wide Web paydo bo'lgan", "is_correct": false}, {"id": "b", "text": "Shu kuni birinchi elektron xat yuborilgan", "is_correct": false}, {"id": "c", "text": "Shu kuni Ethernet ixtiro qilingan", "is_correct": false}, {"id": "d", "text": "Shu kuni ARPANET to'liq TCP/IP ga o'tgan", "is_correct": true}]$j$::jsonb,
   $kt$TCP/IP — turli tarmoqlarni bitta "tarmoqlar tarmog'i"ga birlashtirgan protokollar to'plami.$kt$, 1, 2),
  ('393852e7-44c2-5cd5-9913-6d1a48e34e7d', t, $kt$Shahar hududini qamrab oluvchi tarmoq qanday ataladi?$kt$, 'single',
   $j$[{"id": "a", "text": "LAN", "is_correct": false}, {"id": "b", "text": "MAN", "is_correct": true}, {"id": "c", "text": "PAN", "is_correct": false}, {"id": "d", "text": "WAN", "is_correct": false}]$j$::jsonb,
   $kt$MAN — Metropolitan Area Network, shahar tarmog'i.$kt$, 1, 3),
  ('ac310543-3955-58b3-8630-b12946e4f578', t, $kt$Mijoz-server arxitekturasining afzalliklari qaysilar?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Server va administrator talab qilinmaydi", "is_correct": false}, {"id": "b", "text": "Foydalanuvchi hisoblari bir joyda saqlanadi", "is_correct": true}, {"id": "c", "text": "Yuqori xavfsizlik", "is_correct": true}, {"id": "d", "text": "Markazlashgan boshqaruv", "is_correct": true}]$j$::jsonb,
   $kt$Mijoz-server tarmog'i boshqaruv va xavfsizlik beradi, lekin server va uni boshqaradigan mutaxassis kerak.$kt$, 2, 4),
  ('019adf81-1c2c-5d2f-b860-010b8a3dd760', t, $kt$Qaysilar ORALIQ (tarmoq) qurilmalariga kiradi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Kommutator (switch)", "is_correct": true}, {"id": "b", "text": "Tarmoq printeri", "is_correct": false}, {"id": "c", "text": "Marshrutizator (router)", "is_correct": true}, {"id": "d", "text": "Noutbuk", "is_correct": false}]$j$::jsonb,
   $kt$Printer va noutbuk — oxirgi qurilmalar (xostlar); kommutator va marshrutizator ma'lumotni yo'naltiradi.$kt$, 2, 5),
  ('bb1135be-46b4-5158-93b2-1ce5328644dd', t, $kt$100 Mbit/s kanal orqali 1 sekundda taxminan qancha ma'lumot uzatiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "1,25 MB", "is_correct": false}, {"id": "b", "text": "800 MB", "is_correct": false}, {"id": "c", "text": "100 MB", "is_correct": false}, {"id": "d", "text": "12,5 MB", "is_correct": true}]$j$::jsonb,
   $kt$100 Mbit ÷ 8 = 12,5 MB (bayt).$kt$, 1, 6)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('488e32e4-20b0-576e-a04f-02e1b22cbac9', '8f370e35-3101-5b69-8709-a0b8f9590587', '0315e944-11bd-5cab-85c1-b20d6701e23e');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('488e32e4-20b0-576e-a04f-02e1b22cbac9', t, $kt$Tarix sanalari$kt$, $kt$Ma'ruzadagi jadval asosida yillarni kiriting.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Jadvaldagi 'Ahamiyati' ustuniga ham qarang: 'tug'ilgan kun' deb ataladigan voqea qaysi?"}]$j$::jsonb, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "ARPANET ning birinchi tugunlari ulangan yil", "type": "number", "accept": ["1969"]}, {"label": "ARPANET to'liq TCP/IP ga o'tgan yil", "type": "number", "accept": ["1983"]}, {"label": "T. Berners-Li Web g'oyasini taklif qilgan yil", "type": "number", "accept": ["1989"]}]}$j$::jsonb, NULL),
  ('8f370e35-3101-5b69-8709-a0b8f9590587', t, $kt$Tarmoqni tasniflang$kt$, $kt$Har bir vaziyat uchun tarmoq turini tanlang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Qamrovga qarang: bitta bino — LAN, bitta shahar — MAN, shaharlar orasi — WAN."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Universitet binosidagi 120 ta kompyuter", "type": "choice", "accept": ["LAN"], "options": ["PAN", "LAN", "MAN", "WAN"]}, {"label": "Telefon va simsiz quloqchin", "type": "choice", "accept": ["PAN"], "options": ["PAN", "LAN", "MAN", "WAN"]}, {"label": "Toshkent bo'ylab joylashgan bank filiallari tarmog'i", "type": "choice", "accept": ["MAN"], "options": ["PAN", "LAN", "MAN", "WAN"]}, {"label": "Toshkent va Buxoro ofislari orasidagi korporativ tarmoq", "type": "choice", "accept": ["WAN"], "options": ["PAN", "LAN", "MAN", "WAN"]}]}$j$::jsonb, NULL),
  ('0315e944-11bd-5cab-85c1-b20d6701e23e', t, $kt$Bit va bayt$kt$, $kt$Kanal tezligi 100 Mbit/s. Hisoblang (1 bayt = 8 bit, 1 MB = 1 000 000 bayt deb oling).$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Avval bitni baytga o'tkazing: 100 ÷ 8."}, {"order": 2, "text": "500 MB ÷ 12,5 MB/s = ?"}]$j$::jsonb, 'easy', 5, 15, 2,
   'answer', $j${"fields": [{"label": "1 sekundda necha MB uzatiladi?", "type": "number", "accept": ["12.5"], "unit": "MB"}, {"label": "500 MB lik fayl necha sekundda uzatiladi?", "type": "number", "accept": ["40"], "unit": "s"}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 2. 2-ma'ruza: Tarmoq qurishning asosiy tamoyillari. Topologiyalar, arxitektura va tarmoq qurilmalari
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$2-ma'ruza: Tarmoq qurishning asosiy tamoyillari. Topologiyalar, arxitektura va tarmoq qurilmalari$kt$, 'kt-m02-tamoyillar',
$kt$<h2>Ma'ruza rejasi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Tarmoq qurish tamoyillari", "subtitle": "Topologiyalar va qurilmalar", "emoji": "🧩"}, {"t": "points", "title": "Har tarmoq hal qiladigan masalalar", "items": [{"e": "🔌", "text": "Ulanish — qaysi muhit?"}, {"e": "🏷️", "text": "Manzillash — kimga?"}, {"e": "🚦", "text": "Muhitga kirish — kim gapiradi?"}, {"e": "🧭", "text": "Marshrutlash — qaysi yo'l?"}, {"e": "📜", "text": "Standartlar — umumiy til"}]}, {"t": "compare", "title": "Topologiya turlari", "left": {"label": "Fizik", "text": "Kabel va qurilmalar haqiqatda qanday ulangan"}, "right": {"label": "Mantiqiy", "text": "Ma'lumot qanday yo'l bilan yuradi"}}, {"t": "table", "title": "Asosiy topologiyalar", "head": ["Turi", "Afzalligi", "Kamchiligi"], "rows": [["Shina", "Arzon", "Kabel uzilsa — hammasi to'xtaydi"], ["Yulduz", "Nosozlikni topish oson", "Markaz — yagona nosozlik nuqtasi"], ["Halqa", "To'qnashuv yo'q", "Bitta bo'g'in uzilsa halqa buziladi"], ["Mesh", "Eng ishonchli", "Kabel juda ko'p"], ["Daraxt", "Kengaytirish oson", "Yuqori tugun — butun shoxcha"]]}, {"t": "idea", "title": "To'liq bog'langan tarmoq formulasi", "text": "L = n·(n−1)/2. 5 tugun → 10 liniya, 10 tugun → 45 liniya, 50 tugun → 1225 liniya.", "emoji": "🕸️"}, {"t": "quiz", "title": "Tekshiramiz", "question": "8 tugunli to'liq bog'langan tarmoqda nechta liniya bor?", "options": ["16", "28", "64", "56"], "answer": 1, "explain": "8·7/2 = 28."}, {"t": "table", "title": "Qurilmalar va pog'onalar", "head": ["Qurilma", "Pog'ona", "Nimaga qaraydi"], "rows": [["Hub, repeater", "1", "Hech narsaga — takrorlaydi"], ["Switch, bridge", "2", "MAC manzil"], ["Router", "3", "IP manzil"]]}, {"t": "compare", "title": "Hub va switch", "left": {"label": "Hub", "text": "Kadrni hamma portga takrorlaydi. Bitta to'qnashuv domeni."}, "right": {"label": "Switch", "text": "MAC jadvali bo'yicha faqat kerakli portga. Har port — alohida domen."}}, {"t": "quiz", "title": "Tekshiramiz", "question": "Qaysi qurilma turli IP tarmoqlarni bog'laydi?", "options": ["Hub", "Switch", "Router", "Repeater"], "answer": 2, "explain": "Marshrutizator 3-pog'onada ishlaydi va tarmoqlararo paketlarni yo'naltiradi."}, {"t": "summary", "title": "Xulosa", "items": ["Topologiya — narx va ishonchlilik o'rtasidagi tanlov", "Bugun ko'pincha yulduz va daraxt", "Hub → switch → router: 1 → 2 → 3 pog'ona"]}]$j$::jsonb,
  2, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('46c439e5-c356-5cd6-a22c-11e5cbfd52c1', '4e6230a9-898c-503e-99ea-b638403d94e8', '653d10dc-3056-5431-a088-3e3c533be073', 'ec284299-4e04-59fb-b4ab-4a1ab7f4b8f7', '7f60623e-a25a-5361-9622-c8169f4effa8', 'ab134d64-bb22-559d-aea9-2b6918b3a76b');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('46c439e5-c356-5cd6-a22c-11e5cbfd52c1', t, $kt$Qaysi topologiyada bitta kabel uzilishi butun tarmoqni ishdan chiqaradi?$kt$, 'single',
   $j$[{"id": "a", "text": "Yulduz", "is_correct": false}, {"id": "b", "text": "Shina", "is_correct": true}, {"id": "c", "text": "To'liq bog'langan", "is_correct": false}, {"id": "d", "text": "Daraxt", "is_correct": false}]$j$::jsonb,
   $kt$Shinada barcha kompyuterlar bitta magistral kabelni bo'lishadi.$kt$, 1, 0),
  ('4e6230a9-898c-503e-99ea-b638403d94e8', t, $kt$Yulduz topologiyasining eng zaif nuqtasi qaysi?$kt$, 'single',
   $j$[{"id": "a", "text": "Har bir kompyuter kabeli", "is_correct": false}, {"id": "b", "text": "Markaziy qurilma", "is_correct": true}, {"id": "c", "text": "Kabel uzunligi", "is_correct": false}, {"id": "d", "text": "Terminatorlar", "is_correct": false}]$j$::jsonb,
   $kt$Markaziy kommutator ishdan chiqsa, butun tarmoq to'xtaydi.$kt$, 1, 1),
  ('653d10dc-3056-5431-a088-3e3c533be073', t, $kt$10 tugunli to'liq bog'langan tarmoqda nechta aloqa liniyasi bor?$kt$, 'single',
   $j$[{"id": "a", "text": "100", "is_correct": false}, {"id": "b", "text": "90", "is_correct": false}, {"id": "c", "text": "45", "is_correct": true}, {"id": "d", "text": "20", "is_correct": false}]$j$::jsonb,
   $kt$L = 10·9/2 = 45.$kt$, 1, 2),
  ('ec284299-4e04-59fb-b4ab-4a1ab7f4b8f7', t, $kt$Kommutator kadrni qaysi ma'lumotga qarab yo'naltiradi?$kt$, 'single',
   $j$[{"id": "a", "text": "MAC manzil", "is_correct": true}, {"id": "b", "text": "Domen nomi", "is_correct": false}, {"id": "c", "text": "Port raqami", "is_correct": false}, {"id": "d", "text": "IP manzil", "is_correct": false}]$j$::jsonb,
   $kt$Kommutator 2-pog'ona qurilmasi — MAC manzillar jadvalidan foydalanadi.$kt$, 1, 3),
  ('7f60623e-a25a-5361-9622-c8169f4effa8', t, $kt$Hub ga ulangan tarmoqning fizik va mantiqiy topologiyasi qanday?$kt$, 'single',
   $j$[{"id": "a", "text": "Ikkalasi ham to'liq bog'langan", "is_correct": false}, {"id": "b", "text": "Ikkalasi ham halqa", "is_correct": false}, {"id": "c", "text": "Fizik — yulduz, mantiqiy — shina", "is_correct": true}, {"id": "d", "text": "Fizik — shina, mantiqiy — yulduz", "is_correct": false}]$j$::jsonb,
   $kt$Kabellar markazga yig'ilgan (yulduz), lekin hub signalni hammaga takrorlagani uchun mantiqan umumiy shina kabi ishlaydi.$kt$, 1, 4),
  ('ab134d64-bb22-559d-aea9-2b6918b3a76b', t, $kt$Qaysi qurilmalar OSI ning 1-pog'onasida ishlaydi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Marshrutizator", "is_correct": false}, {"id": "b", "text": "Konsentrator (hub)", "is_correct": true}, {"id": "c", "text": "Takrorlagich", "is_correct": true}, {"id": "d", "text": "Kommutator", "is_correct": false}]$j$::jsonb,
   $kt$Takrorlagich va hub signal bilan ishlaydi, manzillarni tushunmaydi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('65fdd115-5e84-55aa-be61-865ff1139cf5', '29ad5493-b1a7-57e4-a134-8c3eb2152ee9');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('65fdd115-5e84-55aa-be61-865ff1139cf5', t, $kt$Mesh tarmoq narxi$kt$, $kt$Kompaniyaning 6 ta filiali to'liq bog'langan (mesh) topologiyada ulanmoqchi. Har bir liniyaning oylik narxi 1 200 000 so'm.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "L = n·(n−1)/2, n = 6."}, {"order": 2, "text": "Yulduzda markazdan qolgan har bir filialga bittadan liniya."}]$j$::jsonb, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Nechta aloqa liniyasi kerak?", "type": "number", "accept": ["15"]}, {"label": "Barcha liniyalarning oylik narxi (so'm)", "type": "number", "accept": ["18000000"], "unit": "so'm"}, {"label": "Agar yulduz topologiyasi tanlansa (markaz — 1-filial), nechta liniya kerak?", "type": "number", "accept": ["5"]}]}$j$::jsonb, NULL),
  ('29ad5493-b1a7-57e4-a134-8c3eb2152ee9', t, $kt$Qurilmani tanlang$kt$, $kt$Har bir vazifa uchun mos qurilmani tanlang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Kabel 100 m dan uzun — signalni kuchaytirish kerak", "type": "choice", "accept": ["Takrorlagich"], "options": ["Takrorlagich", "Kommutator", "Marshrutizator", "Kirish nuqtasi"]}, {"label": "Bino ichidagi 24 ta kompyuterni bitta LAN ga ulash", "type": "choice", "accept": ["Kommutator"], "options": ["Takrorlagich", "Kommutator", "Marshrutizator", "Kirish nuqtasi"]}, {"label": "Ofis tarmog'ini provayder orqali Internetga ulash", "type": "choice", "accept": ["Marshrutizator"], "options": ["Takrorlagich", "Kommutator", "Marshrutizator", "Kirish nuqtasi"]}, {"label": "Noutbuk va telefonlarni simsiz ulash", "type": "choice", "accept": ["Kirish nuqtasi"], "options": ["Takrorlagich", "Kommutator", "Marshrutizator", "Kirish nuqtasi"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 3. 3-ma'ruza: ISO/OSI modeli. Ochiq tizimlarning o'zaro aloqasi. Protokol, interfeys, standart
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$3-ma'ruza: ISO/OSI modeli. Ochiq tizimlarning o'zaro aloqasi. Protokol, interfeys, standart$kt$, 'kt-m03-osi',
$kt$<h2>Ma'ruza rejasi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "ISO/OSI modeli", "subtitle": "Yetti pog'ona va inkapsulyatsiya", "emoji": "🧱"}, {"t": "compare", "title": "Protokol va interfeys", "left": {"label": "Protokol", "text": "Turli tizimlardagi BIR XIL pog'onalar o'rtasidagi qoidalar"}, "right": {"label": "Interfeys", "text": "Bitta tizimdagi QO'SHNI pog'onalar o'rtasidagi qoidalar"}}, {"t": "table", "title": "OSI pog'onalari", "head": ["№", "Pog'ona", "PDU", "Misol"], "rows": [["7", "Amaliy", "Ma'lumot", "HTTP, DNS"], ["6", "Taqdimot", "Ma'lumot", "TLS, UTF-8"], ["5", "Seans", "Ma'lumot", "RPC"], ["4", "Transport", "Segment", "TCP, UDP"], ["3", "Tarmoq", "Paket", "IP, router"], ["2", "Kanal", "Kadr", "Ethernet, switch"], ["1", "Fizik", "Bit", "kabel, hub"]]}, {"t": "code", "title": "Inkapsulyatsiya", "code": "Ma'lumot\n[TCP | Ma'lumot]\n[IP | TCP | Ma'lumot]\n[Eth | IP | TCP | Ma'lumot | FCS]\n0110100101110…", "note": "Har pog'ona o'z sarlavhasini qo'shadi, qabul qiluvchida esa olib tashlaydi."}, {"t": "quiz", "title": "Tekshiramiz", "question": "Paketni qaysi pog'ona yo'naltiradi?", "options": ["Amaliy", "Kanal", "Tarmoq", "Transport"], "answer": 2, "explain": "3-pog'ona — tarmoq: IP manzil va marshrutlash."}, {"t": "quiz", "title": "Tekshiramiz", "question": "Transport pog'onasining PDU si qanday ataladi?", "options": ["Bit", "Paket", "Kadr", "Segment"], "answer": 3, "explain": "TCP da — segment, UDP da — datagramma."}, {"t": "table", "title": "OSI va TCP/IP", "head": ["OSI", "TCP/IP"], "rows": [["7, 6, 5", "Amaliy"], ["4", "Transport"], ["3", "Internet"], ["2, 1", "Tarmoqqa kirish"]]}, {"t": "idea", "title": "Nega model kerak?", "text": "Nosozlikni pog'onama-pog'ona qidirish mumkin: avval kabel (1), keyin manzil (3), keyin port (4), keyin dastur (7).", "emoji": "🔎"}, {"t": "summary", "title": "Xulosa", "items": ["7 pog'ona, har biri o'z vazifasi", "Yuborish — inkapsulyatsiya, qabul — dekapsulyatsiya", "Amalda TCP/IP ning 4 pog'onasi"]}]$j$::jsonb,
  3, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('b9ef7274-a7fb-5dbb-b0e6-b509dc81f169', 'eccd7d62-8e83-5c33-9d2b-85802f7506c3', '98634743-df0f-539b-97a8-5c8b09658681', 'be2a7698-506a-5ada-8706-b5f1a81b636a', 'ca5a6ce2-d1cf-5a9a-9559-7d2ea475ad96', 'c3e1cef4-88fa-5d8e-b687-7efc1f7cdf97', 'e88a49e2-3260-5bf2-a701-911e626134d0');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('b9ef7274-a7fb-5dbb-b0e6-b509dc81f169', t, $kt$OSI modelini qaysi tashkilot qabul qilgan?$kt$, 'single',
   $j$[{"id": "a", "text": "IEEE", "is_correct": false}, {"id": "b", "text": "IETF", "is_correct": false}, {"id": "c", "text": "ISO", "is_correct": true}, {"id": "d", "text": "W3C", "is_correct": false}]$j$::jsonb,
   $kt$OSI — ISO 7498 standarti (1984).$kt$, 1, 0),
  ('eccd7d62-8e83-5c33-9d2b-85802f7506c3', t, $kt$Turli tizimlardagi bir xil pog'onalar o'rtasidagi qoidalar to'plami nima deyiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Topologiya", "is_correct": false}, {"id": "b", "text": "Interfeys", "is_correct": false}, {"id": "c", "text": "Inkapsulyatsiya", "is_correct": false}, {"id": "d", "text": "Protokol", "is_correct": true}]$j$::jsonb,
   $kt$Interfeys esa bitta tizim ichidagi qo'shni pog'onalar orasida.$kt$, 1, 1),
  ('98634743-df0f-539b-97a8-5c8b09658681', t, $kt$Qaysi pog'ona shifrlash, siqish va kodlash bilan shug'ullanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "Transport", "is_correct": false}, {"id": "b", "text": "Seans", "is_correct": false}, {"id": "c", "text": "Kanal", "is_correct": false}, {"id": "d", "text": "Taqdimot", "is_correct": true}]$j$::jsonb,
   $kt$6-pog'ona — taqdimot: ma'lumot ko'rinishi.$kt$, 1, 2),
  ('be2a7698-506a-5ada-8706-b5f1a81b636a', t, $kt$Kanal pog'onasining ma'lumot birligi (PDU) qaysi?$kt$, 'single',
   $j$[{"id": "a", "text": "Bit", "is_correct": false}, {"id": "b", "text": "Kadr", "is_correct": true}, {"id": "c", "text": "Segment", "is_correct": false}, {"id": "d", "text": "Paket", "is_correct": false}]$j$::jsonb,
   $kt$Kanal pog'onasida kadr (frame), tarmoqda — paket.$kt$, 1, 3),
  ('ca5a6ce2-d1cf-5a9a-9559-7d2ea475ad96', t, $kt$Ethernet kadrining oxiriga qo'shiladigan FCS maydoni nima uchun?$kt$, 'single',
   $j$[{"id": "a", "text": "Manzilni ko'rsatish", "is_correct": false}, {"id": "b", "text": "Shifrlash", "is_correct": false}, {"id": "c", "text": "Xatoni aniqlash", "is_correct": true}, {"id": "d", "text": "Port raqami", "is_correct": false}]$j$::jsonb,
   $kt$FCS — Frame Check Sequence, CRC asosida kadr buzilganini aniqlaydi.$kt$, 1, 4),
  ('c3e1cef4-88fa-5d8e-b687-7efc1f7cdf97', t, $kt$TCP/IP modelining qaysi pog'onasi OSI ning 5, 6, 7-pog'onalariga mos keladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Tarmoqqa kirish", "is_correct": false}, {"id": "b", "text": "Internet", "is_correct": false}, {"id": "c", "text": "Transport", "is_correct": false}, {"id": "d", "text": "Amaliy", "is_correct": true}]$j$::jsonb,
   $kt$TCP/IP da seans va taqdimot vazifalari amaliy pog'onada bajariladi.$kt$, 1, 5),
  ('e88a49e2-3260-5bf2-a701-911e626134d0', t, $kt$Qaysi juftliklar to'g'ri?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Marshrutizator — 3-pog'ona", "is_correct": true}, {"id": "b", "text": "TCP — 4-pog'ona", "is_correct": true}, {"id": "c", "text": "Hub — 3-pog'ona", "is_correct": false}, {"id": "d", "text": "Kommutator — 2-pog'ona", "is_correct": true}]$j$::jsonb,
   $kt$Hub — 1-pog'ona qurilmasi.$kt$, 2, 6)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('25fdd350-9e5b-573a-8b98-84156ad353c5', '019d5fa6-5c6f-565a-a313-2599e5a64fc0');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('25fdd350-9e5b-573a-8b98-84156ad353c5', t, $kt$Pog'onani aniqlang$kt$, $kt$Har bir protokol yoki qurilma OSI ning qaysi pog'onasiga tegishli? Raqamini kiriting (1–7).$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Pastdan sanang: 1 — fizik, 2 — kanal, 3 — tarmoq, 4 — transport."}]$j$::jsonb, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "HTTP", "type": "number", "accept": ["7"]}, {"label": "TCP", "type": "number", "accept": ["4"]}, {"label": "IP", "type": "number", "accept": ["3"]}, {"label": "Kommutator (switch)", "type": "number", "accept": ["2"]}, {"label": "Optik kabel", "type": "number", "accept": ["1"]}, {"label": "TLS shifrlash", "type": "number", "accept": ["6"]}]}$j$::jsonb, NULL),
  ('019d5fa6-5c6f-565a-a313-2599e5a64fc0', t, $kt$PDU nomlari$kt$, $kt$Ma'lumot birligining nomini yozing.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "2-pog'onada", "type": "text", "accept": ["kadr", "frame"]}, {"label": "3-pog'onada", "type": "text", "accept": ["paket", "packet"]}, {"label": "4-pog'onada (TCP)", "type": "text", "accept": ["segment"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 4. 4-ma'ruza: Berilganlarni uzatish usullari. Fizik muhitlar. Kodlash va uzatish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$4-ma'ruza: Berilganlarni uzatish usullari. Fizik muhitlar. Kodlash va uzatish$kt$, 'kt-m04-uzatish',
$kt$<h2>Ma'ruza rejasi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Ma'lumot uzatish", "subtitle": "Muhitlar, kodlash, xatolar", "emoji": "📡"}, {"t": "points", "title": "Kanal tavsiflari", "items": [{"e": "⚡", "text": "O'tkazuvchanlik, bit/s"}, {"e": "📶", "text": "Chastota polosasi, Hz"}, {"e": "📉", "text": "Susayish, dB"}, {"e": "🛡️", "text": "Shovqinga bardoshlilik"}]}, {"t": "table", "title": "Uzatish muhitlari", "head": ["Muhit", "Tezlik", "Masofa"], "rows": [["Cat5e/Cat6a", "1/10 Gbit/s", "100 m"], ["Optika (ko'p modali)", "10 Gbit/s", "300–400 m"], ["Optika (bir modali)", "10–100 Gbit/s", "o'nlab km"], ["Wi-Fi", "yuzlab Mbit/s", "~30 m bino ichida"]]}, {"t": "points", "title": "Uzatish rejimlari", "items": [{"e": "➡️", "text": "Simpleks — bir tomonga"}, {"e": "↔️", "text": "Yarim dupleks — navbat bilan"}, {"e": "⇄", "text": "To'liq dupleks — bir vaqtda"}]}, {"t": "idea", "title": "Shennon formulasi", "text": "C = B·log₂(1 + S/N). Tezlikni oshirish uchun yo kanal polosasini kengaytirish, yo shovqinni kamaytirish kerak.", "emoji": "📐"}, {"t": "table", "title": "Kodlash usullari", "head": ["Usul", "Qoida"], "rows": [["NRZ-L", "1 — yuqori, 0 — past"], ["Manchester", "0 — ↓, 1 — ↑ bit o'rtasida"], ["AMI", "1 — navbat bilan + va −"], ["MLT-3", "1 — keyingi sath (Fast Ethernet)"]]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Qaysi kod har bit o'rtasida albatta o'tish qiladi?", "options": ["Manchester", "AMI", "NRZ-L", "NRZI"], "answer": 0, "explain": "Manchester o'z-o'zini sinxronlaydi — shuning uchun 10 Mbit/s Ethernet ishlatgan."}, {"t": "compare", "title": "Xatolarni aniqlash", "left": {"label": "Juftlik biti", "text": "Bitta xato aniqlanadi, ikkitasi — yo'q"}, "right": {"label": "CRC", "text": "Ko'p bitli va paket xatolari. Ethernet FCS — CRC-32"}}, {"t": "quiz", "title": "Tekshiramiz", "question": "Ethernet kadridagi FCS qaysi usulga asoslangan?", "options": ["Shifrlash", "Nazorat yig'indisi", "CRC", "Juftlik biti"], "answer": 2, "explain": "FCS — 32 bitli CRC."}, {"t": "summary", "title": "Xulosa", "items": ["Bino ichida mis va Wi-Fi, uzoqda — optika", "Kodlash: sinxronizatsiya va polosa murosasi", "CRC — kadr xatosini aniqlashning asosiy usuli"]}]$j$::jsonb,
  4, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('b8e29e51-6eea-5482-b683-aaedd63f3f4f', 'e2f56bfa-0dd4-5962-8d8e-1589ae00eba8', '9e189291-398a-507a-bd19-28f6f451401e', 'b5c9b4a8-33fb-5f74-9b42-6cec5f1965e8', '6ce804db-f549-519b-8291-f86d773ec477', '38bf93f2-6b9d-5dac-b6cf-a41434b2ccc0');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('b8e29e51-6eea-5482-b683-aaedd63f3f4f', t, $kt$Juft o'ralgan kabelda simlar nima uchun o'raladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Mustahkamlik uchun", "is_correct": false}, {"id": "b", "text": "Kabelni ingichka qilish uchun", "is_correct": false}, {"id": "c", "text": "Elektromagnit xalaqitni kamaytirish uchun", "is_correct": true}, {"id": "d", "text": "Tezlikni 2 baravar oshirish uchun", "is_correct": false}]$j$::jsonb,
   $kt$O'rash qo'shni juftlar va tashqi manbalardan tushadigan xalaqitni kamaytiradi.$kt$, 1, 0),
  ('e2f56bfa-0dd4-5962-8d8e-1589ae00eba8', t, $kt$Cat5e kabelining standart segment uzunligi qancha?$kt$, 'single',
   $j$[{"id": "a", "text": "185 m", "is_correct": false}, {"id": "b", "text": "10 m", "is_correct": false}, {"id": "c", "text": "2 km", "is_correct": false}, {"id": "d", "text": "100 m", "is_correct": true}]$j$::jsonb,
   $kt$Juft o'ralgan kabelli Ethernet uchun segment — 100 m.$kt$, 1, 1),
  ('9e189291-398a-507a-bd19-28f6f451401e', t, $kt$Qaysi muhit elektromagnit xalaqitlarga mutlaqo befarq?$kt$, 'single',
   $j$[{"id": "a", "text": "Radio", "is_correct": false}, {"id": "b", "text": "Koaksial", "is_correct": false}, {"id": "c", "text": "Optik tola", "is_correct": true}, {"id": "d", "text": "UTP", "is_correct": false}]$j$::jsonb,
   $kt$Optik tolada yorug'lik uzatiladi, elektr signali yo'q.$kt$, 1, 2),
  ('b5c9b4a8-33fb-5f74-9b42-6cec5f1965e8', t, $kt$Kommutatorli Ethernetda ikki tomon bir vaqtda uzata oladi. Bu qaysi rejim?$kt$, 'single',
   $j$[{"id": "a", "text": "Parallel", "is_correct": false}, {"id": "b", "text": "To'liq dupleks", "is_correct": true}, {"id": "c", "text": "Simpleks", "is_correct": false}, {"id": "d", "text": "Yarim dupleks", "is_correct": false}]$j$::jsonb,
   $kt$To'liq dupleksda uzatish va qabul alohida juftlarda bir vaqtda ketadi.$kt$, 1, 3),
  ('6ce804db-f549-519b-8291-f86d773ec477', t, $kt$4B/5B mantiqiy kodlashning ortiqchaligi qancha?$kt$, 'single',
   $j$[{"id": "a", "text": "5%", "is_correct": false}, {"id": "b", "text": "50%", "is_correct": false}, {"id": "c", "text": "25%", "is_correct": true}, {"id": "d", "text": "20%", "is_correct": false}]$j$::jsonb,
   $kt$Har 4 bitga 5 bit uzatiladi: 5/4 = 1,25.$kt$, 1, 4),
  ('38bf93f2-6b9d-5dac-b6cf-a41434b2ccc0', t, $kt$Manchester kodi uchun qaysi gaplar to'g'ri?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Signal o'z-o'zini sinxronlaydi", "is_correct": true}, {"id": "b", "text": "NRZ ga qaraganda tor polosa talab qiladi", "is_correct": false}, {"id": "c", "text": "10 Mbit/s Ethernetda ishlatilgan", "is_correct": true}, {"id": "d", "text": "Har bit o'rtasida o'tish bor", "is_correct": true}]$j$::jsonb,
   $kt$O'tishlar ko'pligi sababli Manchester NRZ ga qaraganda ikki baravar keng polosa talab qiladi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('ee83ffc9-7620-54a4-945d-c7a5a8e7e916', 'e912eeeb-efdd-57ff-9a4b-c2b4bdb72309', '627f470c-19d0-589f-8337-fd3f06befd4c');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('ee83ffc9-7620-54a4-945d-c7a5a8e7e916', t, $kt$Uzatish vaqti$kt$, $kt$100 MB fayl 1 Gbit/s kanal orqali uzatilmoqda (1 MB = 8·10⁶ bit). Sarlavhalarni hisobga olmang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Vaqt = hajm (bit) ÷ tezlik (bit/s) = 800·10⁶ ÷ 10⁹."}]$j$::jsonb, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Uzatish vaqti", "type": "number", "accept": ["0.8"], "tol": 0.001, "unit": "s"}, {"label": "Agar kanal 100 Mbit/s bo'lsa", "type": "number", "accept": ["8"], "unit": "s"}]}$j$::jsonb, NULL),
  ('e912eeeb-efdd-57ff-9a4b-c2b4bdb72309', t, $kt$Kodlashni aniqlang$kt$, $kt$Quyidagi tavsiflar qaysi kodlash usuliga tegishli?$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Har bit o'rtasida o'tish; 0 — yuqoridan pastga", "type": "choice", "accept": ["Manchester"], "options": ["NRZ-L", "Manchester", "AMI", "MLT-3"]}, {"label": "1 lar navbatma-navbat + va − bilan, 0 — nol sath", "type": "choice", "accept": ["AMI"], "options": ["NRZ-L", "Manchester", "AMI", "MLT-3"]}, {"label": "Fast Ethernet (100BASE-TX) da ishlatiladi", "type": "choice", "accept": ["MLT-3"], "options": ["NRZ-L", "Manchester", "AMI", "MLT-3"]}]}$j$::jsonb, NULL),
  ('627f470c-19d0-589f-8337-fd3f06befd4c', t, $kt$Juftlik biti$kt$, $kt$Juft (even) juftlik usuli ishlatiladi. Ma'lumot oxiriga qo'shiladigan juftlik bitini toping.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "1 lar sonini sanang. Juft bo'lsa — 0, toq bo'lsa — 1 qo'shiladi."}]$j$::jsonb, 'easy', 5, 15, 2,
   'answer', $j${"fields": [{"label": "1011001", "type": "choice", "accept": ["0"], "options": ["0", "1"]}, {"label": "1110000", "type": "choice", "accept": ["1"], "options": ["0", "1"]}, {"label": "0000000", "type": "choice", "accept": ["0"], "options": ["0", "1"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 5. 5-ma'ruza: Ethernet texnologiyalari. Tarmoq tugunlarini adreslash. MAC manzil
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$5-ma'ruza: Ethernet texnologiyalari. Tarmoq tugunlarini adreslash. MAC manzil$kt$, 'kt-m05-ethernet',
$kt$<h2>Ma'ruza rejasi</h2>
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
</ol>$kt$,
  $j$[{"t": "title", "title": "Ethernet", "subtitle": "MAC manzil, kadr va CSMA/CD", "emoji": "🔌"}, {"t": "table", "title": "Ethernet avlodlari", "head": ["Standart", "Tezlik", "Muhit"], "rows": [["10BASE-T", "10 Mbit/s", "juft o'ralgan"], ["100BASE-TX", "100 Mbit/s", "Cat5"], ["1000BASE-T", "1 Gbit/s", "Cat5e"], ["10GBASE-T", "10 Gbit/s", "Cat6a"]]}, {"t": "idea", "title": "MAC manzil", "text": "48 bit = 6 bayt. Birinchi 3 bayt — ishlab chiqaruvchi kodi (OUI), qolgani — seriya raqami. FF-FF-FF-FF-FF-FF — hammaga.", "emoji": "🏷️"}, {"t": "table", "title": "Ethernet II kadri", "head": ["Maydon", "Bayt"], "rows": [["Manzil MAC", "6"], ["Manba MAC", "6"], ["EtherType", "2"], ["Ma'lumot", "46–1500"], ["FCS (CRC-32)", "4"]], "note": "Kadr: 64–1518 bayt"}, {"t": "quiz", "title": "Tekshiramiz", "question": "EtherType 0x0806 nimani bildiradi?", "options": ["ARP", "IPv6", "VLAN", "IPv4"], "answer": 0, "explain": "0x0800 — IPv4, 0x0806 — ARP, 0x86DD — IPv6."}, {"t": "points", "title": "CSMA/CD", "items": [{"e": "👂", "text": "Eshit — kanal bo'shmi?"}, {"e": "📤", "text": "Bo'sh bo'lsa uzat"}, {"e": "💥", "text": "To'qnashuvni sez → JAM"}, {"e": "🎲", "text": "Tasodifiy kutib qayta urin"}]}, {"t": "points", "title": "Kommutator algoritmi", "items": [{"e": "📝", "text": "Manba MAC → jadvalga (o'rganish)"}, {"e": "🎯", "text": "Manzil MAC jadvalda → bitta port"}, {"e": "📢", "text": "Jadvalda yo'q → hamma portga"}, {"e": "⏳", "text": "300 s ishlatilmasa — o'chirish"}]}, {"t": "quiz", "title": "Tekshiramiz", "question": "Kommutator jadvalida manzil MAC topilmadi. U nima qiladi?", "options": ["Xato xabarini qaytaradi", "Kadrni marshrutizatorga yuboradi", "Kadrni tashlab yuboradi", "Kadrni hamma portga yuboradi"], "answer": 3, "explain": "Noma'lum unicast flooding qilinadi; javob kelganda kommutator manzilni o'rganib oladi."}, {"t": "compare", "title": "Domenlar", "left": {"label": "To'qnashuv domeni", "text": "Kommutatorda har port alohida"}, "right": {"label": "Broadcast domeni", "text": "Kommutatorning barcha portlari bitta; uni router ajratadi"}}, {"t": "summary", "title": "Xulosa", "items": ["MAC — 48 bitli fizik manzil", "Kadr 64–1518 bayt, FCS bilan", "CSMA/CD — umumiy muhitda", "Switch MAC jadvalini o'zi o'rganadi"]}]$j$::jsonb,
  5, 10, 25, 80, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('6141bb9e-8e8e-56db-a322-d8591155469f', 'd1afb70a-a6cd-58a8-a000-8265928dc5fa', 'f53e3930-4dec-5c46-a5b2-39bb9db89865', 'd438d758-ee15-5b37-a0d9-e1e4b1c302ab', '1cef7858-cef2-5b80-abd2-2bb228fadc34', '64373ac7-d075-517d-80d2-4b11faddaea8', '2d7ef404-18d0-5a54-818e-2e8b2271741d');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('6141bb9e-8e8e-56db-a322-d8591155469f', t, $kt$MAC manzil necha bitdan iborat?$kt$, 'single',
   $j$[{"id": "a", "text": "32", "is_correct": false}, {"id": "b", "text": "128", "is_correct": false}, {"id": "c", "text": "64", "is_correct": false}, {"id": "d", "text": "48", "is_correct": true}]$j$::jsonb,
   $kt$6 bayt × 8 = 48 bit.$kt$, 1, 0),
  ('d1afb70a-a6cd-58a8-a000-8265928dc5fa', t, $kt$MAC manzilning birinchi 3 bayti nima deyiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Seriya raqami", "is_correct": false}, {"id": "b", "text": "OUI — ishlab chiqaruvchi kodi", "is_correct": true}, {"id": "c", "text": "Tarmoq manzili", "is_correct": false}, {"id": "d", "text": "Port raqami", "is_correct": false}]$j$::jsonb,
   $kt$OUI ni IEEE ishlab chiqaruvchiga beradi.$kt$, 1, 1),
  ('f53e3930-4dec-5c46-a5b2-39bb9db89865', t, $kt$Ethernet kadrining minimal hajmi (preambulasiz) qancha?$kt$, 'single',
   $j$[{"id": "a", "text": "64 bayt", "is_correct": true}, {"id": "b", "text": "46 bayt", "is_correct": false}, {"id": "c", "text": "1500 bayt", "is_correct": false}, {"id": "d", "text": "512 bayt", "is_correct": false}]$j$::jsonb,
   $kt$64 bayt = 512 bit — to'qnashuvni aniqlash uchun zarur minimal vaqt.$kt$, 1, 2),
  ('d438d758-ee15-5b37-a0d9-e1e4b1c302ab', t, $kt$CSMA/CD da to'qnashuv aniqlangach stansiya birinchi navbatda nima qiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Darhol qayta uzatadi", "is_correct": false}, {"id": "b", "text": "Marshrutizatorga xabar beradi", "is_correct": false}, {"id": "c", "text": "JAM signal yuboradi", "is_correct": true}, {"id": "d", "text": "Kadrni tashlaydi", "is_correct": false}]$j$::jsonb,
   $kt$JAM barcha stansiyalarga to'qnashuv bo'lganini bildiradi, keyin tasodifiy kutish boshlanadi.$kt$, 1, 3),
  ('1cef7858-cef2-5b80-abd2-2bb228fadc34', t, $kt$3-to'qnashuvdan keyin k qaysi oraliqda tanlanadi?$kt$, 'single',
   $j$[{"id": "a", "text": "0–7", "is_correct": true}, {"id": "b", "text": "0–1", "is_correct": false}, {"id": "c", "text": "0–15", "is_correct": false}, {"id": "d", "text": "0–3", "is_correct": false}]$j$::jsonb,
   $kt$2³ − 1 = 7.$kt$, 1, 4),
  ('64373ac7-d075-517d-80d2-4b11faddaea8', t, $kt$Broadcast MAC manzil qaysi?$kt$, 'single',
   $j$[{"id": "a", "text": "01-00-5E-00-00-01", "is_correct": false}, {"id": "b", "text": "AA-AA-AA-AA-AA-AA", "is_correct": false}, {"id": "c", "text": "FF-FF-FF-FF-FF-FF", "is_correct": true}, {"id": "d", "text": "00-00-00-00-00-00", "is_correct": false}]$j$::jsonb,
   $kt$Barcha bitlar 1 — segmentdagi hamma qurilmaga.$kt$, 1, 5),
  ('2d7ef404-18d0-5a54-818e-2e8b2271741d', t, $kt$Kommutator haqida qaysi gaplar to'g'ri?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Manba MAC ni jadvalga yozadi", "is_correct": true}, {"id": "b", "text": "Har port alohida broadcast domeni", "is_correct": false}, {"id": "c", "text": "Noma'lum manzilni hamma portga yuboradi", "is_correct": true}, {"id": "d", "text": "Broadcast ni hamma portga yuboradi", "is_correct": true}]$j$::jsonb,
   $kt$Kommutator broadcast domenini ajratmaydi — buni router yoki VLAN qiladi.$kt$, 2, 6)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('1e73797d-91e7-56e9-8d8c-bbeba268a265', 'baf5fd34-7847-55a0-a2f6-f9499a497514');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('1e73797d-91e7-56e9-8d8c-bbeba268a265', t, $kt$Kadr hajmi$kt$, $kt$Ethernet II kadrida foydali yuk (IP paket) 300 bayt. Preambulani hisobga olmang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Kadr = 14 + ma'lumot + 4."}, {"order": 2, "text": "Ma'lumot 46 baytdan kam bo'lsa, 46 gacha to'ldiriladi."}]$j$::jsonb, 'easy', 5, 15, 0,
   'answer', $j${"fields": [{"label": "Sarlavha (MAC + MAC + EtherType), bayt", "type": "number", "accept": ["14"]}, {"label": "Kadrning umumiy hajmi (FCS bilan), bayt", "type": "number", "accept": ["318"]}, {"label": "Foydali yuk 20 bayt bo'lsa, kadr hajmi (to'ldirish bilan)", "type": "number", "accept": ["64"]}]}$j$::jsonb, NULL),
  ('baf5fd34-7847-55a0-a2f6-f9499a497514', t, $kt$Ikkilik eksponensial kutish$kt$, $kt$10 Mbit/s Ethernet. Bitta slot = 51,2 µs.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "k ∈ [0; 2ⁿ − 1]."}, {"order": 2, "text": "Kutish = k × 51,2 µs."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "2-to'qnashuvdan keyin k ning eng katta qiymati", "type": "number", "accept": ["3"]}, {"label": "O'shanda eng uzoq kutish vaqti, µs", "type": "number", "accept": ["153.6"], "tol": 0.01, "unit": "µs"}, {"label": "Necha urinishdan keyin kadr tashlab yuboriladi?", "type": "number", "accept": ["16"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

END $mig$;
