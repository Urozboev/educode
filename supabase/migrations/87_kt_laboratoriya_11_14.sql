-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: Laboratoriya ishlari 11–14
--
-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
-- Manba: scripts/kontent/kompyuter-tarmoqlari/l11_14.py
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
  -- 11. 11-laboratoriya ishi: Windows operatsion tizimida foydalanuvchilar va ularning vakolatlarini boshqarish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$11-laboratoriya ishi: Windows operatsion tizimida foydalanuvchilar va ularning vakolatlarini boshqarish$kt$, 'kt-l11-foydalanuvchilar',
$kt$<h2>Ishning maqsadi</h2>
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
  <li>Mijozni domenga qo'shing: DNS = 192.168.10.10 bo'lishi shart; System → Rename this PC (advanced) → Domain: kafedra.local. Qayta yuklang va <code>KAFEDRA\ali.aliyev</code> sifatida kiring.</li>
  <li>Mijozda <code>whoami</code>, <code>whoami /groups</code>, <code>echo %logonserver%</code>.</li>
</ol>

<h2>Hisobot talablari</h2>
<ul>
  <li>Lokal foydalanuvchilar va guruh a'zolari (lusrmgr yoki <code>Get-LocalGroupMember</code>).</li>
  <li>Parol siyosati oynasi va qisqa parol rad etilgan xabar.</li>
  <li>ADUC dagi OU va foydalanuvchilar; mijozdagi <code>whoami /groups</code>.</li>
</ul>$kt$,
  $j$[{"t": "title", "title": "Foydalanuvchilar va vakolatlar", "subtitle": "11-laboratoriya ishi", "emoji": "👥"}, {"t": "code", "title": "Lokal hisoblar", "code": "net user talaba2 Parol2026! /add\nnet localgroup Talabalar talaba2 /add\nGet-LocalGroupMember Talabalar"}, {"t": "table", "title": "Siyosatlar", "head": ["Sozlama", "Qiymat"], "rows": [["Minimal uzunlik", "10"], ["Murakkablik", "yoqilgan"], ["Muddat", "90 kun"], ["Bloklash", "5 urinish → 15 daqiqa"]]}, {"t": "compare", "title": "Lokal va domen", "left": {"label": "Lokal", "text": "lusrmgr.msc, har kompyuterda alohida"}, "right": {"label": "Domen", "text": "ADUC, bitta login hamma joyda"}}, {"t": "quiz", "title": "Tekshiramiz", "question": "Mijoz domenga qo'shilmayapti: 'domain could not be contacted'. Birinchi tekshiruv?", "options": ["Brandmauer o'chirilganmi", "Parol", "IIS", "Mijozning DNS i DC ga ko'rsatilganmi"], "answer": 3, "explain": "Mijoz DC ni DNS orqali topadi."}, {"t": "code", "title": "Tekshirish", "code": "whoami\nwhoami /groups\necho %logonserver%"}, {"t": "summary", "title": "Hisobot", "items": ["Lokal foydalanuvchi va guruh", "Parol va bloklash siyosati", "Domen: OU, foydalanuvchi, mijoz qo'shildi"]}]$j$::jsonb,
  11, 15, 30, 120, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('4b2eacf6-a2c1-526b-a4bb-8e3bd29e8b24', '25933c51-bfc2-5a27-96f7-0a733c0ddbc1', '9e243b16-d174-56cb-9788-017b55e5a507', '1f3e2592-f6bc-5860-9fc8-1c91db79773d', 'deff14c8-9fe3-5d5d-b5f0-e1049f1f6ad7', '9f7b73e6-6a71-52be-b299-19e9fde7d228');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('4b2eacf6-a2c1-526b-a4bb-8e3bd29e8b24', t, $kt$Lokal foydalanuvchilar konsoli?$kt$, 'single',
   $j$[{"id": "a", "text": "devmgmt.msc", "is_correct": false}, {"id": "b", "text": "dsa.msc", "is_correct": false}, {"id": "c", "text": "services.msc", "is_correct": false}, {"id": "d", "text": "lusrmgr.msc", "is_correct": true}]$j$::jsonb,
   $kt$dsa.msc — Active Directory Users and Computers.$kt$, 1, 0),
  ('25933c51-bfc2-5a27-96f7-0a733c0ddbc1', t, $kt$Guruhga foydalanuvchi qo'shish buyrug'i?$kt$, 'single',
   $j$[{"id": "a", "text": "net localgroup Guruh X /add", "is_correct": true}, {"id": "b", "text": "add user", "is_correct": false}, {"id": "c", "text": "net user X /group", "is_correct": false}, {"id": "d", "text": "net group add", "is_correct": false}]$j$::jsonb,
   $kt$Domenda — net group.$kt$, 1, 1),
  ('9e243b16-d174-56cb-9788-017b55e5a507', t, $kt$Parol va bloklash siyosati lokal kompyuterda qayerda?$kt$, 'single',
   $j$[{"id": "a", "text": "ncpa.cpl", "is_correct": false}, {"id": "b", "text": "regedit", "is_correct": false}, {"id": "c", "text": "secpol.msc", "is_correct": true}, {"id": "d", "text": "taskmgr", "is_correct": false}]$j$::jsonb,
   $kt$Local Security Policy.$kt$, 1, 2),
  ('1f3e2592-f6bc-5860-9fc8-1c91db79773d', t, $kt$Kompyuterni o'chirish huquqi qaysi bo'limda?$kt$, 'single',
   $j$[{"id": "a", "text": "Password Policy", "is_correct": false}, {"id": "b", "text": "Audit Policy", "is_correct": false}, {"id": "c", "text": "IP Security", "is_correct": false}, {"id": "d", "text": "User Rights Assignment", "is_correct": true}]$j$::jsonb,
   $kt$Huquqlar — User Rights Assignment.$kt$, 1, 3),
  ('deff14c8-9fe3-5d5d-b5f0-e1049f1f6ad7', t, $kt$Domenga qo'shilish uchun mijozda nima to'g'ri bo'lishi shart?$kt$, 'single',
   $j$[{"id": "a", "text": "Brauzer", "is_correct": false}, {"id": "b", "text": "IIS", "is_correct": false}, {"id": "c", "text": "DNS server — DC manzili", "is_correct": true}, {"id": "d", "text": "Statik IP", "is_correct": false}]$j$::jsonb,
   $kt$DC SRV yozuvlari DNS da.$kt$, 1, 4),
  ('9f7b73e6-6a71-52be-b299-19e9fde7d228', t, $kt$Qaysilar xavfsizlikni oshiradi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Hisobni bloklash siyosati", "is_correct": true}, {"id": "b", "text": "Hamma foydalanuvchini Administrators ga qo'shish", "is_correct": false}, {"id": "c", "text": "Parol murakkabligi", "is_correct": true}, {"id": "d", "text": "Eng kam imtiyoz", "is_correct": true}]$j$::jsonb,
   $kt$Ortiqcha imtiyoz — xavf.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('ff1a94c2-794a-52c2-86ca-55f88394a48f', '7fd0e462-a474-5288-9029-90dcdaf17a8b');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('ff1a94c2-794a-52c2-86ca-55f88394a48f', t, $kt$11-laboratoriya hisoboti$kt$, $kt$Lokal va domen foydalanuvchilarini boshqaring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["lusrmgr.msc da talaba1 va Talabalar guruhini yaratdim", "net user va PowerShell bilan talaba2, talaba3 ni yaratdim", "Parol va bloklash siyosatini sozladim, qisqa parol rad etilishini tekshirdim", "Talabalarga kompyuterni o'chirish huquqini cheklab sinab ko'rdim", "SRV1 ni kafedra.local domen kontrolleriga ko'tardim", "OU, foydalanuvchilar va guruh yaratdim", "Mijozni domenga qo'shib, domen foydalanuvchisi bilan kirdim"], "prompt": "Oddiy foydalanuvchi qaysi amallarni bajara olmadi? Domenga qo'shishda qanday muammo bo'ldi? whoami /groups natijasida qaysi guruhlarni ko'rdingiz?", "min_images": 3, "max_images": 6, "min_chars": 150}$j$::jsonb),
  ('7fd0e462-a474-5288-9029-90dcdaf17a8b', t, $kt$Buyruqlar$kt$, $kt$To'g'ri buyruqni yozing.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "talaba5 lokal foydalanuvchisini 'Qwerty2026!' paroli bilan yaratish", "type": "text", "accept": ["net user talaba5 Qwerty2026! /add"]}, {"label": "talaba5 ni Talabalar guruhiga qo'shish", "type": "text", "accept": ["net localgroup Talabalar talaba5 /add"]}, {"label": "Joriy foydalanuvchi a'zo guruhlarini ko'rsatish", "type": "text", "accept": ["whoami /groups"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 12. 12-laboratoriya ishi: Tarmoqda umumiy resurslarni yaratish va ulardan foydalanish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$12-laboratoriya ishi: Tarmoqda umumiy resurslarni yaratish va ulardan foydalanish$kt$, 'kt-l12-umumiy-resurslar',
$kt$<h2>Ishning maqsadi</h2>
<p>Umumiy papkalar yaratish, ulashish va NTFS ruxsatlarini sozlash, samarali ruxsatni tekshirish va tarmoq diskini ulash.</p>

<h2>Kerakli vositalar</h2>
<ul>
  <li>SRV1 va mijoz VM (11-laboratoriyadagi foydalanuvchilar bilan)</li>
</ul>

<h2>Ish tartibi</h2>
<h3>1-qism. Papkalar va guruhlar</h3>
<ol>
  <li>SRV1 da <code>C:\Share\Kurs</code>, <code>C:\Share\Hisobot</code>, <code>C:\Share\Arxiv</code> papkalarini yarating.</li>
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
  <li>PowerShell muqobili: <code>New-SmbShare -Name Kurs -Path C:\Share\Kurs -FullAccess "Authenticated Users"</code>; tekshirish — <code>Get-SmbShare</code>, <code>net share</code>.</li>
</ol>
<h3>3-qism. Mijozdan tekshirish</h3>
<ol>
  <li>Talaba sifatida kiring. Explorer manzil satriga <code>\\SRV1</code> — qaysi ulashishlar ko'rinadi? Arxiv ko'rinadimi?</li>
  <li><code>\\SRV1\Kurs</code> da fayl yaratishga urinib ko'ring; <code>\\SRV1\Hisobot</code> da yarating.</li>
  <li>Tarmoq diskini ulang: <code>net use K: \\SRV1\Kurs</code>; <code>net use</code> ro'yxatini ko'ring.</li>
  <li>Serverda papka → Security → Advanced → <b>Effective Access</b>: talaba foydalanuvchisi uchun samarali ruxsatlarni ko'ring.</li>
  <li>Tajriba: Hisobot uchun Share ruxsatini "Everyone — Read" ga o'zgartiring. Talaba tarmoqdan yoza oladimi? Serverda lokal kirsa-chi? Natijani tushuntiring va qayta tiklang.</li>
</ol>

<h2>Hisobot talablari</h2>
<ul>
  <li>Share va NTFS ruxsatlari oynalari (har papka uchun).</li>
  <li>Mijozda <code>\\SRV1</code> ro'yxati, ruxsat yo'qligi haqidagi xabar, ulangan disk.</li>
  <li>Effective Access natijasi.</li>
</ul>$kt$,
  $j$[{"t": "title", "title": "Umumiy resurslar", "subtitle": "12-laboratoriya ishi", "emoji": "📂"}, {"t": "table", "title": "Reja", "head": ["Papka", "Talabalar (NTFS)"], "rows": [["Kurs", "Read & execute"], ["Hisobot", "Modify"], ["Arxiv$", "kirish yo'q"]]}, {"t": "code", "title": "PowerShell va buyruqlar", "code": "New-SmbShare -Name Kurs -Path C:\\Share\\Kurs -FullAccess \"Authenticated Users\"\nnet share\nnet use K: \\\\SRV1\\Kurs"}, {"t": "idea", "title": "Amaliy qoida", "text": "Share ruxsati keng (Authenticated Users — Full), aniq cheklov NTFS da. Tarmoqda ikkalasidan qattiqrog'i ishlaydi.", "emoji": "📐"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Share: Everyone — Read; NTFS: Talabalar — Modify. Talaba tarmoqdan yoza oladimi?", "options": ["Ha", "Faqat lokal yoza olmaydi", "Yo'q"], "answer": 2, "explain": "Tarmoqda Read cheklaydi."}, {"t": "quiz", "title": "Tekshiramiz", "question": "\\\\SRV1 ro'yxatida Arxiv$ ko'rinadimi?", "options": ["Yo'q, lekin to'g'ridan-to'g'ri yo'l bilan ochish mumkin (ruxsat bo'lsa)", "Ha", "Faqat serverda"], "answer": 0, "explain": "$ — yashirin ulashish."}, {"t": "summary", "title": "Hisobot", "items": ["Ruxsatlar oynalari", "Mijozdagi sinovlar", "Effective Access"]}]$j$::jsonb,
  12, 15, 30, 90, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('579c4a33-4e53-5877-9ad4-ed36471aada2', 'b0336662-ada4-5532-b776-9f490cd820bf', '149862cd-ea80-50d0-85e4-96ba74f19a2f', '3d894b83-c11e-57e8-a4f6-446e33ab2f14', '90169af4-644a-5e3f-a3d8-303201e5d4c6', 'a5265c2c-3c13-54a7-8061-de6720bf6028');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('579c4a33-4e53-5877-9ad4-ed36471aada2', t, $kt$Ulashishlar ro'yxatini ko'rsatuvchi buyruq?$kt$, 'single',
   $j$[{"id": "a", "text": "ipconfig", "is_correct": false}, {"id": "b", "text": "net use", "is_correct": false}, {"id": "c", "text": "net view /all", "is_correct": false}, {"id": "d", "text": "net share", "is_correct": true}]$j$::jsonb,
   $kt$Yoki Get-SmbShare.$kt$, 1, 0),
  ('b0336662-ada4-5532-b776-9f490cd820bf', t, $kt$Tarmoq diskini ulash?$kt$, 'single',
   $j$[{"id": "a", "text": "map K", "is_correct": false}, {"id": "b", "text": "mount K", "is_correct": false}, {"id": "c", "text": "net use K: \\\\SRV1\\Kurs", "is_correct": true}, {"id": "d", "text": "net share K:", "is_correct": false}]$j$::jsonb,
   $kt$net use.$kt$, 1, 1),
  ('149862cd-ea80-50d0-85e4-96ba74f19a2f', t, $kt$Samarali ruxsatni ko'rish joyi?$kt$, 'single',
   $j$[{"id": "a", "text": "Security → Advanced → Effective Access", "is_correct": true}, {"id": "b", "text": "Event Viewer", "is_correct": false}, {"id": "c", "text": "Task Manager", "is_correct": false}, {"id": "d", "text": "Sharing → Permissions", "is_correct": false}]$j$::jsonb,
   $kt$Effective Access yorlig'i.$kt$, 1, 2),
  ('3d894b83-c11e-57e8-a4f6-446e33ab2f14', t, $kt$NTFS ruxsatlari ichki papkalarga o'tmasligi uchun?$kt$, 'single',
   $j$[{"id": "a", "text": "Deny Everyone", "is_correct": false}, {"id": "b", "text": "Share ruxsatini o'zgartirish", "is_correct": false}, {"id": "c", "text": "Disable inheritance", "is_correct": true}, {"id": "d", "text": "Papkani yashirish", "is_correct": false}]$j$::jsonb,
   $kt$Meros o'chiriladi.$kt$, 1, 3),
  ('90169af4-644a-5e3f-a3d8-303201e5d4c6', t, $kt$Talaba \\SRV1\Kurs ga yoza olmaydi. Bu to'g'rimi?$kt$, 'single',
   $j$[{"id": "a", "text": "DNS xato", "is_correct": false}, {"id": "b", "text": "Share xato", "is_correct": false}, {"id": "c", "text": "Yo'q, xato", "is_correct": false}, {"id": "d", "text": "Ha, NTFS da faqat Read & execute", "is_correct": true}]$j$::jsonb,
   $kt$Rejaga muvofiq.$kt$, 1, 4),
  ('a5265c2c-3c13-54a7-8061-de6720bf6028', t, $kt$Qaysi amallar xavfsiz amaliyot?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Ruxsatni guruhlarga berish", "is_correct": true}, {"id": "b", "text": "Everyone ga NTFS Full control berish", "is_correct": false}, {"id": "c", "text": "Share keng, NTFS aniq", "is_correct": true}, {"id": "d", "text": "Arxivni yashirin ulashish qilish", "is_correct": true}]$j$::jsonb,
   $kt$Everyone ga NTFS Full — xavfli.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('4de71bf8-1ad6-5abb-bf19-f9df5710df72', 'ba40d43f-ce96-58bd-a186-ef316a31a556');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('4de71bf8-1ad6-5abb-bf19-f9df5710df72', t, $kt$12-laboratoriya hisoboti$kt$, $kt$Uch papkani ulashing va ruxsatlarni mijozdan tekshiring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["Kurs, Hisobot, Arxiv papkalarini yaratdim", "Jadval bo'yicha Share va NTFS ruxsatlarini sozladim", "Arxiv$ yashirin ulashishini yaratdim", "Mijozdan \\\\SRV1 ro'yxatini ko'rdim", "Kurs ga yozish rad etilishini, Hisobot ga yozish mumkinligini tekshirdim", "net use bilan tarmoq diskini uladim", "Share = Read tajribasini o'tkazdim va natijani tushuntirdim"], "prompt": "Share 'Everyone — Read' qilinganda talaba tarmoqdan va serverda lokal ravishda Hisobot papkasiga yoza oldimi? Nima uchun? Effective Access natijasini izohlang.", "min_images": 3, "max_images": 6, "min_chars": 150}$j$::jsonb),
  ('ba40d43f-ce96-58bd-a186-ef316a31a556', t, $kt$Samarali ruxsat$kt$, $kt$Talaba GR-Talabalar va Authenticated Users guruhlarida.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "Tarmoqda NTFS va Share kesishmasi; Share 'Read' = o'qish va ishga tushirish."}]$j$::jsonb, 'medium', 5, 15, 1,
   'answer', $j${"fields": [{"label": "Kurs: tarmoqdan samarali ruxsat", "type": "choice", "accept": ["Read & execute"], "options": ["Full control", "Modify", "Read & execute", "Kirish yo'q"]}, {"label": "Hisobot: tarmoqdan samarali ruxsat", "type": "choice", "accept": ["Modify"], "options": ["Full control", "Modify", "Read & execute", "Kirish yo'q"]}, {"label": "Arxiv$: tarmoqdan", "type": "choice", "accept": ["Kirish yo'q"], "options": ["Full control", "Modify", "Read & execute", "Kirish yo'q"]}, {"label": "Hisobot, Share = Everyone Read bo'lganda, tarmoqdan", "type": "choice", "accept": ["Read & execute"], "options": ["Full control", "Modify", "Read & execute", "Kirish yo'q"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 13. 13-laboratoriya ishi: Windows operatsion tizimida brandmauerni sozlash. VPN xizmatidan foydalanish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$13-laboratoriya ishi: Windows operatsion tizimida brandmauerni sozlash. VPN xizmatidan foydalanish$kt$, 'kt-l13-brandmauer-vpn',
$kt$<h2>Ishning maqsadi</h2>
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
</ul>$kt$,
  $j$[{"t": "title", "title": "Brandmauer va VPN", "subtitle": "13-laboratoriya ishi", "emoji": "🧱"}, {"t": "points", "title": "Windows Defender Firewall", "items": [{"e": "🏢", "text": "Domain profil"}, {"e": "🏠", "text": "Private profil"}, {"e": "☕", "text": "Public profil"}, {"e": "↘️", "text": "Inbound / ↗️ Outbound qoidalar"}]}, {"t": "code", "title": "PowerShell", "code": "New-NetFirewallRule -DisplayName \"KT ping ruxsat\" -Protocol ICMPv4 -IcmpType 8 -Action Allow\nTest-NetConnection 192.168.10.10 -Port 80"}, {"t": "quiz", "title": "Tekshiramiz", "question": "Bir port uchun Allow va Block qoidalari bor. Natija?", "options": ["Allow ishlaydi", "Block ishlaydi", "Oxirgisi ishlaydi", "Ikkalasi bekor"], "answer": 1, "explain": "Windows Firewall da Block qoidasi ustun."}, {"t": "points", "title": "VPN (laboratoriya)", "items": [{"e": "🛠️", "text": "Remote Access → RRAS"}, {"e": "🔑", "text": "L2TP/IPsec, umumiy kalit"}, {"e": "📍", "text": "Manzillar pool i"}, {"e": "✅", "text": "Dial-in: Allow access"}]}, {"t": "idea", "title": "Haqiqiy hayotda", "text": "Sertifikatli IKEv2 yoki SSTP + MFA. PPTP — ishlatmang.", "emoji": "🔐"}, {"t": "summary", "title": "Hisobot", "items": ["Ping qoidasi va natijasi", "Test-NetConnection oldin/keyin", "VPN ulanishi va PPP adapter"]}]$j$::jsonb,
  13, 15, 30, 120, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('cbecc10c-55c2-5f72-a933-22d267d6f472', '8108f516-9087-503d-a2ab-27838a135ef1', '9bdab092-dd77-5482-8e80-3315ae8f903a', '2fa7bea7-8343-5ee0-9869-a02c21df30ae', '5bc011ba-a3b3-5f32-abe0-5e221372aafb', '1f5de373-3245-52f5-b73a-bcb311945e7b');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('cbecc10c-55c2-5f72-a933-22d267d6f472', t, $kt$Kengaytirilgan brandmauer konsoli?$kt$, 'single',
   $j$[{"id": "a", "text": "wf.msc", "is_correct": true}, {"id": "b", "text": "gpedit.msc", "is_correct": false}, {"id": "c", "text": "secpol.msc", "is_correct": false}, {"id": "d", "text": "firewall.cpl", "is_correct": false}]$j$::jsonb,
   $kt$Windows Defender Firewall with Advanced Security.$kt$, 1, 0),
  ('8108f516-9087-503d-a2ab-27838a135ef1', t, $kt$ICMP Echo Request turi?$kt$, 'single',
   $j$[{"id": "a", "text": "11", "is_correct": false}, {"id": "b", "text": "8", "is_correct": true}, {"id": "c", "text": "0", "is_correct": false}, {"id": "d", "text": "3", "is_correct": false}]$j$::jsonb,
   $kt$8 — so'rov, 0 — javob.$kt$, 1, 1),
  ('9bdab092-dd77-5482-8e80-3315ae8f903a', t, $kt$Portga ulanish mumkinligini tekshiruvchi PowerShell buyrug'i?$kt$, 'single',
   $j$[{"id": "a", "text": "Get-NetIPAddress", "is_correct": false}, {"id": "b", "text": "Ping-Port", "is_correct": false}, {"id": "c", "text": "Test-Connection", "is_correct": false}, {"id": "d", "text": "Test-NetConnection -Port", "is_correct": true}]$j$::jsonb,
   $kt$TcpTestSucceeded qiymati.$kt$, 1, 2),
  ('2fa7bea7-8343-5ee0-9869-a02c21df30ae', t, $kt$Windows Firewall da ziddiyatli Allow va Block qoidalaridan qaysi biri g'olib?$kt$, 'single',
   $j$[{"id": "a", "text": "Allow", "is_correct": false}, {"id": "b", "text": "Birinchi yaratilgan", "is_correct": false}, {"id": "c", "text": "Profilga bog'liq", "is_correct": false}, {"id": "d", "text": "Block", "is_correct": true}]$j$::jsonb,
   $kt$Aniq taqiq ustun.$kt$, 1, 3),
  ('5bc011ba-a3b3-5f32-abe0-5e221372aafb', t, $kt$Laboratoriyada sertifikatsiz VPN uchun qaysi tur ishlatildi?$kt$, 'single',
   $j$[{"id": "a", "text": "PPTP", "is_correct": false}, {"id": "b", "text": "SSTP", "is_correct": false}, {"id": "c", "text": "L2TP/IPsec umumiy kalit bilan", "is_correct": true}, {"id": "d", "text": "OpenVPN", "is_correct": false}]$j$::jsonb,
   $kt$PPTP xavfsiz emas.$kt$, 1, 4),
  ('1f5de373-3245-52f5-b73a-bcb311945e7b', t, $kt$VPN ulangach mijozda nimalar paydo bo'ladi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "Pool dan IP manzil", "is_correct": true}, {"id": "b", "text": "Yangi PPP adapter", "is_correct": true}, {"id": "c", "text": "VPN serverga marshrut", "is_correct": true}, {"id": "d", "text": "Yangi MAC manzil kartada", "is_correct": false}]$j$::jsonb,
   $kt$Fizik karta o'zgarmaydi.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('05c153a3-b10f-5c7b-9c61-0bac7226b19c', '4f0fb6cf-06ac-5d56-97bb-ebd20621a1a9');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('05c153a3-b10f-5c7b-9c61-0bac7226b19c', t, $kt$13-laboratoriya hisoboti$kt$, $kt$Brandmauer qoidalarini yarating va VPN ni sozlang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["Faol profil va sukut sozlamalarini aniqladim", "ICMP ping ruxsat qoidasini yaratib, yoqiq/o'chiq holatda tekshirdim", "TCP 80 ni bloklab, Test-NetConnection bilan tekshirdim", "Chiquvchi (outbound) qoida yaratib sinadim", "SRV1 da Remote Access (VPN) ni sozladim", "Mijozda VPN ulanishini yaratib, uladim", "ipconfig da PPP adapter va manzilni topdim"], "prompt": "Qaysi qoida ping ni, qaysi biri veb-sahifani ta'sirladi? VPN ulangach mijoz qanday manzil oldi? Laboratoriyadagi VPN sozlamasi real tashkilot uchun nima uchun yetarli emas?", "min_images": 3, "max_images": 6, "min_chars": 150}$j$::jsonb),
  ('4f0fb6cf-06ac-5d56-97bb-ebd20621a1a9', t, $kt$Qoidalar$kt$, $kt$To'g'ri qiymatni kiriting.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "ICMP Echo Request turi raqami", "type": "number", "accept": ["8"]}, {"label": "HTTP blok qoidasi uchun -LocalPort qiymati", "type": "number", "accept": ["80"]}, {"label": "VPN manzillar pool idagi manzillar soni (192.168.10.220 – .230)", "type": "number", "accept": ["11"]}, {"label": "Windows profili: kafedra domeniga ulangan kompyuter", "type": "choice", "accept": ["Domain"], "options": ["Domain", "Private", "Public"]}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

  -- ============================================================
  -- 14. 14-laboratoriya ishi: Tarmoq nosozliklarini aniqlash. Operatsion tizim utilitalaridan foydalanish
  -- ============================================================

  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward, estimated_minutes, is_published, is_free_preview)
  VALUES (v_course, $kt$14-laboratoriya ishi: Tarmoq nosozliklarini aniqlash. Operatsion tizim utilitalaridan foydalanish$kt$, 'kt-l14-nosozliklar',
$kt$<h2>Ishning maqsadi</h2>
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
</ul>$kt$,
  $j$[{"t": "title", "title": "Diagnostika utilitalari", "subtitle": "14-laboratoriya ishi", "emoji": "🧰"}, {"t": "table", "title": "Utilitalar", "head": ["Buyruq", "Nima beradi"], "rows": [["ipconfig /all", "Manzillar, DHCP, DNS"], ["ping -n 20", "Yo'qotish, kechikish"], ["tracert / pathping", "Yo'l va yo'qotish joyi"], ["nslookup", "DNS"], ["netstat -ano", "Ulanishlar va PID"], ["Test-NetConnection", "Port ochiqmi"]]}, {"t": "code", "title": "MTU ni topish", "code": "ping -f -l 1472 8.8.8.8   → javob bor\nping -f -l 1473 8.8.8.8   → Packet needs to be fragmented", "note": "1472 + 8 (ICMP) + 20 (IP) = 1500"}, {"t": "quiz", "title": "Tekshiramiz", "question": "ping -f -l 1464 o'tadi, 1465 o'tmaydi. MTU?", "options": ["1500", "1492", "1472", "1464"], "answer": 1, "explain": "1464 + 28 = 1492 (masalan, PPPoE)."}, {"t": "code", "title": "Jarayonni topish", "code": "netstat -ano | findstr :443\ntasklist /fi \"pid eq 4120\""}, {"t": "idea", "title": "Juftlikdagi o'yin", "text": "Sherigingiz nosozlik yaratadi — siz faqat buyruqlar bilan topasiz. Keyin almashing va oxirida hammasini tiklang.", "emoji": "🎯"}, {"t": "summary", "title": "Hisobot", "items": ["5 holat jadvali", "Utilitalar natijalari", "Juftlikdagi nosozlik tahlili"]}]$j$::jsonb,
  14, 15, 30, 120, true, false)
  ON CONFLICT (course_id, slug) DO UPDATE SET
    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,
    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,
    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,
    is_published = true, is_free_preview = EXCLUDED.is_free_preview
  RETURNING id INTO t;

  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ('50ed1473-0125-5a1e-a53f-6a3e99616a70', 'e6cedb85-72e4-54a1-9f35-e61464396f4b', '97dfa223-e7d6-5610-9ce1-2178596bf12f', '41f68352-382c-5523-8e77-50fdc2b2e53b', '92742785-20b2-5567-9161-26661c3520b9', '9aa0da1e-3231-5a22-9af4-0bd068d441f0');

  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES
  ('50ed1473-0125-5a1e-a53f-6a3e99616a70', t, $kt$Qaysi sakrashda paket yo'qolayotganini statistik ko'rsatuvchi buyruq?$kt$, 'single',
   $j$[{"id": "a", "text": "nslookup", "is_correct": false}, {"id": "b", "text": "arp", "is_correct": false}, {"id": "c", "text": "tracert", "is_correct": false}, {"id": "d", "text": "pathping", "is_correct": true}]$j$::jsonb,
   $kt$pathping har sakrash uchun yo'qotishni hisoblaydi.$kt$, 1, 0),
  ('e6cedb85-72e4-54a1-9f35-e61464396f4b', t, $kt$ping -f nima qiladi?$kt$, 'single',
   $j$[{"id": "a", "text": "Fragmentatsiyani taqiqlaydi (DF bayrog'i)", "is_correct": true}, {"id": "b", "text": "Cheksiz yuboradi", "is_correct": false}, {"id": "c", "text": "Faylga yozadi", "is_correct": false}, {"id": "d", "text": "Tez yuboradi", "is_correct": false}]$j$::jsonb,
   $kt$MTU ni aniqlash uchun.$kt$, 1, 1),
  ('97dfa223-e7d6-5610-9ce1-2178596bf12f', t, $kt$1472 baytli ping o'tdi, 1473 — yo'q. MTU?$kt$, 'single',
   $j$[{"id": "a", "text": "1500", "is_correct": true}, {"id": "b", "text": "1472", "is_correct": false}, {"id": "c", "text": "1473", "is_correct": false}, {"id": "d", "text": "1501", "is_correct": false}]$j$::jsonb,
   $kt$1472 + 28 = 1500.$kt$, 1, 2),
  ('41f68352-382c-5523-8e77-50fdc2b2e53b', t, $kt$Ulanish qaysi jarayonga tegishli ekanini qanday aniqlash mumkin?$kt$, 'single',
   $j$[{"id": "a", "text": "ipconfig /all", "is_correct": false}, {"id": "b", "text": "netstat -ano va tasklist", "is_correct": true}, {"id": "c", "text": "route print", "is_correct": false}, {"id": "d", "text": "arp -a", "is_correct": false}]$j$::jsonb,
   $kt$PID orqali.$kt$, 1, 3),
  ('92742785-20b2-5567-9161-26661c3520b9', t, $kt$Sukut marshrutini ko'rsatuvchi buyruq?$kt$, 'single',
   $j$[{"id": "a", "text": "getmac", "is_correct": false}, {"id": "b", "text": "hostname", "is_correct": false}, {"id": "c", "text": "nslookup", "is_correct": false}, {"id": "d", "text": "route print", "is_correct": true}]$j$::jsonb,
   $kt$0.0.0.0 yozuvi.$kt$, 1, 4),
  ('9aa0da1e-3231-5a22-9af4-0bd068d441f0', t, $kt$Qaysilar DNS muammosini tekshirishga yordam beradi?$kt$, 'multiple',
   $j$[{"id": "a", "text": "arp -a", "is_correct": false}, {"id": "b", "text": "nslookup miracademy.uz 1.1.1.1", "is_correct": true}, {"id": "c", "text": "ipconfig /flushdns", "is_correct": true}, {"id": "d", "text": "nslookup miracademy.uz", "is_correct": true}]$j$::jsonb,
   $kt$arp — 2-pog'ona.$kt$, 2, 5)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,
    question_type = EXCLUDED.question_type, options = EXCLUDED.options,
    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;

  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ('4c1055a6-765b-5ec8-bd84-e203d09b8195', '248a8feb-545e-52f6-acdc-9e76ffeb592d');

  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec, report_spec) VALUES
  ('4c1055a6-765b-5ec8-bd84-e203d09b8195', t, $kt$14-laboratoriya hisoboti$kt$, $kt$Uch qismni bajaring va natijalarni hujjatlashtiring.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, NULL, 'medium', 5, 15, 0,
   'report', NULL, $j${"steps": ["Virtual terminaldagi 5 holatni tashxisladim va jadvalga yozdim", "ipconfig /all, ping -n 20 natijalarini oldim", "ping -f -l bilan MTU ni aniqladim", "tracert va pathping bilan yo'lni tahlil qildim", "netstat -ano va tasklist bilan 443-portdagi jarayonni topdim", "Test-NetConnection va Get-NetAdapter natijalarini oldim", "Juftlikda nosozlik yaratib, topdim va sozlamalarni tikladim"], "prompt": "Tarmog'ingiz MTU qiymati, ping yo'qotishi va o'rtacha kechikishi qancha? Juftlikdagi nosozlikni qaysi buyruq bilan va qanday belgi orqali topdingiz?", "min_images": 4, "max_images": 6, "min_chars": 200}$j$::jsonb),
  ('248a8feb-545e-52f6-acdc-9e76ffeb592d', t, $kt$Hisob-kitob$kt$, $kt$Natijalarni hisoblang.$kt$,
   NULL,
   $kt$$kt$, NULL, 'text',
   $j$[]$j$::jsonb, $j$[{"order": 1, "text": "MTU = qiymat + 28."}, {"order": 2, "text": "(20 − 17) / 20."}]$j$::jsonb, 'easy', 5, 15, 1,
   'answer', $j${"fields": [{"label": "ping -f -l 1472 o'tdi, 1473 o'tmadi. MTU", "type": "number", "accept": ["1500"]}, {"label": "ping -f -l 1452 o'tdi, 1453 o'tmadi. MTU", "type": "number", "accept": ["1480"]}, {"label": "ping -n 20: 17 ta javob. Yo'qotish, %", "type": "number", "accept": ["15"], "unit": "%"}]}$j$::jsonb, NULL)
  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,
    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,
    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,
    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,
    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,
    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;

END $mig$;
