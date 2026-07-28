-- ============================================
-- EduCode — Olimpiada: 15 ta masala va 3 ta musobaqa
--
-- Fan dasturi darajasiga moslangan uch bosqich:
--   1-bosqich  — 1-6 mavzular (sintaksis, amallar, matn, ro'yxat, for)
--   2-bosqich  — 7-11 mavzular (shartlar, lug'at, while, funksiya, modul)
--   Yakuniy    — barcha mavzular, algoritmik fikrlash
--
-- Masalalar stdin → stdout tartibida: dastur input() bilan o'qiydi,
-- print() bilan chiqaradi. Barcha yechimlar CPython 3 da sinovdan o'tkazilgan.
--
-- Talab: 22_contests.sql qo'llangan bo'lishi kerak.
-- Sanalar namuna sifatida qo'yilgan — admin panelda o'zgartiring.
-- Qayta ishga tushirilsa dublikat yaratmaydi.
-- ============================================

-- ============================================
-- MASALALAR
-- ============================================
INSERT INTO challenges (title, slug, description, category, difficulty, languages, starter_code, test_cases, hidden_test_cases, time_limit_ms, coin_reward, xp_reward, tags, is_published) VALUES

-- ---------- 1-bosqich ----------
('O''rtacha ball', 'oly-ortacha-ball',
 'Guruhdagi talabalar soni va ularning ballari berilgan. O''rtacha ballni 2 xonagacha yaxlitlab chiqaring.

Kirish:
1-qator — talabalar soni n
2-qator — n ta butun son, bo''shliq bilan

Chiqish: o''rtacha ball, 2 xonagacha (masalan 20.00)',
 'math', 'easy', ARRAY['python'],
 '{"python":"n = int(input())\nsonlar = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"3\n10 20 30","expected_output":"20.00","is_hidden":false},
   {"input":"5\n1 2 3 4 5","expected_output":"3.00","is_hidden":false}]'::jsonb,
 '[{"input":"1\n7","expected_output":"7.00","is_hidden":true},
   {"input":"4\n0 0 0 1","expected_output":"0.25","is_hidden":true},
   {"input":"2\n-5 5","expected_output":"0.00","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['ro''yxat','arifmetika'], true),

('Eng uzun so''z', 'oly-eng-uzun-soz',
 'Bir qatorda bo''shliq bilan ajratilgan so''zlar berilgan. Eng uzun so''zni va uning uzunligini toping.

Bir nechta so''z eng uzun bo''lsa, birinchisini chiqaring.

Kirish: bitta qator matn
Chiqish:
1-qator — so''z
2-qator — uning uzunligi',
 'strings', 'easy', ARRAY['python'],
 '{"python":"sozlar = input().split()\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"men python tilini organaman","expected_output":"organaman\n9","is_hidden":false},
   {"input":"bir","expected_output":"bir\n3","is_hidden":false}]'::jsonb,
 '[{"input":"aa bb cc","expected_output":"aa\n2","is_hidden":true},
   {"input":"a bbbb cc dddd","expected_output":"bbbb\n4","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matn'], true),

('Juft raqamlar yig''indisi', 'oly-juft-raqamlar',
 'Manfiy bo''lmagan butun son berilgan. Uning faqat juft raqamlari yig''indisini toping.

Masalan 1234 uchun juft raqamlar 2 va 4, javob 6.

Kirish: bitta butun son
Chiqish: juft raqamlar yig''indisi',
 'math', 'easy', ARRAY['python'],
 '{"python":"n = int(input())\njami = 0\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"1234","expected_output":"6","is_hidden":false},
   {"input":"13579","expected_output":"0","is_hidden":false}]'::jsonb,
 '[{"input":"2468","expected_output":"20","is_hidden":true},
   {"input":"0","expected_output":"0","is_hidden":true},
   {"input":"1000000","expected_output":"0","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['sikl','raqamlar'], true),

('Eng ko''p uchragan harf', 'oly-harf-chastotasi',
 'Bir qator matn berilgan (kichik lotin harflari va bo''shliqlar). Bo''shliqlarni hisobga olmagan holda, eng ko''p uchragan harfni va uning sonini toping.

Bir nechta harf teng ko''p uchrasa, alifboda birinchi kelganini chiqaring.

Kirish: bitta qator matn
Chiqish: harf va uning soni, bo''shliq bilan',
 'strings', 'medium', ARRAY['python'],
 '{"python":"matn = input().replace(\" \", \"\")\nsanoq = {}\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"salom dunyo","expected_output":"o 2","is_hidden":false},
   {"input":"aabbb","expected_output":"b 3","is_hidden":false}]'::jsonb,
 '[{"input":"abc","expected_output":"a 1","is_hidden":true},
   {"input":"python dasturlash tili","expected_output":"t 3","is_hidden":true},
   {"input":"aabb","expected_output":"a 2","is_hidden":true}]'::jsonb,
 2000, 12, 35, ARRAY['lug''at','matn'], true),

('Mediana', 'oly-mediana',
 'n ta butun son berilgan. Ularni o''sish tartibida chiqaring va medianasini toping.

Mediana — tartiblangan qatordagi o''rta element. Elementlar soni juft bo''lsa, o''rtadagi ikkitasining o''rtachasi olinadi.

Kirish:
1-qator — n
2-qator — n ta son

Chiqish:
1-qator — tartiblangan sonlar, bo''shliq bilan
2-qator — mediana, 2 xonagacha',
 'algorithms', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\na = sorted(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"5\n3 1 4 1 5","expected_output":"1 1 3 4 5\n3.00","is_hidden":false},
   {"input":"4\n10 20 30 40","expected_output":"10 20 30 40\n25.00","is_hidden":false}]'::jsonb,
 '[{"input":"1\n7","expected_output":"7\n7.00","is_hidden":true},
   {"input":"2\n-3 3","expected_output":"-3 3\n0.00","is_hidden":true}]'::jsonb,
 2000, 12, 35, ARRAY['saralash','ro''yxat'], true),

-- ---------- 2-bosqich ----------
('Tub bo''luvchilar', 'oly-tub-boluvchilar',
 'Musbat butun son berilgan. Uning barcha turli tub bo''luvchilarini o''sish tartibida chiqaring.

Masalan 360 = 2³ · 3² · 5 bo''lgani uchun javob: 2 3 5.
Tub bo''luvchi bo''lmasa (n = 1) "yoq" deb yozing.

Kirish: bitta musbat butun son
Chiqish: tub bo''luvchilar bo''shliq bilan yoki "yoq"',
 'math', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\nnatija = []\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"12","expected_output":"2 3","is_hidden":false},
   {"input":"97","expected_output":"97","is_hidden":false}]'::jsonb,
 '[{"input":"1","expected_output":"yoq","is_hidden":true},
   {"input":"360","expected_output":"2 3 5","is_hidden":true},
   {"input":"1024","expected_output":"2","is_hidden":true}]'::jsonb,
 3000, 15, 40, ARRAY['tub sonlar','sikl'], true),

('Umumiy bo''luvchilar', 'oly-umumiy-boluvchilar',
 'Ikki musbat butun son berilgan. Ularning barcha umumiy bo''luvchilarini o''sish tartibida chiqaring va sonini ayting.

Kirish:
1-qator — a
2-qator — b

Chiqish:
1-qator — umumiy bo''luvchilar, bo''shliq bilan
2-qator — ularning soni',
 'math', 'medium', ARRAY['python'],
 '{"python":"a = int(input())\nb = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"12\n18","expected_output":"1 2 3 6\n4","is_hidden":false},
   {"input":"7\n5","expected_output":"1\n1","is_hidden":false}]'::jsonb,
 '[{"input":"100\n100","expected_output":"1 2 4 5 10 20 25 50 100\n9","is_hidden":true},
   {"input":"8\n4","expected_output":"1 2 4\n3","is_hidden":true}]'::jsonb,
 3000, 12, 35, ARRAY['bo''luvchilar','sikl'], true),

('Raqamli piramida', 'oly-piramida',
 'n berilgan. n qatorli piramida chizing: i-qatorda i ta raqam bo''ladi (1 dan boshlab), oldida (n − i) ta bo''shliq turadi.

n = 3 uchun:
  1
 12
123

Raqam 9 dan oshsa, uning oxirgi raqami yoziladi (10 → 0).

Kirish: bitta butun son n
Chiqish: n qatorli piramida',
 'algorithms', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"3","expected_output":"  1\n 12\n123","is_hidden":false},
   {"input":"1","expected_output":"1","is_hidden":false}]'::jsonb,
 '[{"input":"5","expected_output":"    1\n   12\n  123\n 1234\n12345","is_hidden":true}]'::jsonb,
 2000, 12, 35, ARRAY['sikl','chizma'], true),

('Eng ko''p uchragan so''z', 'oly-soz-chastotasi',
 'Bir qatorda bo''shliq bilan ajratilgan so''zlar berilgan. Eng ko''p uchragan so''zni va uning sonini toping.

Bir nechta so''z teng ko''p uchrasa, alifboda birinchi kelganini chiqaring.

Kirish: bitta qator matn
Chiqish: so''z va uning soni, bo''shliq bilan',
 'strings', 'medium', ARRAY['python'],
 '{"python":"sozlar = input().split()\nsanoq = {}\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"olma anor olma uzum olma","expected_output":"olma 3","is_hidden":false},
   {"input":"bir ikki","expected_output":"bir 1","is_hidden":false}]'::jsonb,
 '[{"input":"a b b a c","expected_output":"a 2","is_hidden":true}]'::jsonb,
 2000, 12, 35, ARRAY['lug''at','matn'], true),

('Eng uzun Kollatz zanjiri', 'oly-kollatz-eng-uzun',
 'Kollatz qoidasi: son juft bo''lsa 2 ga bo''linadi, toq bo''lsa 3 ga ko''paytirilib 1 qo''shiladi. Jarayon 1 ga yetganda tugaydi.

1 dan n gacha sonlar ichida eng uzun zanjir beradigan sonni va zanjir uzunligini (qadamlar sonini) toping. Bir nechta son teng uzunlik bersa, kichigini chiqaring.

Kirish: bitta butun son n (1 ≤ n ≤ 10000)
Chiqish: son va qadamlar soni, bo''shliq bilan',
 'algorithms', 'hard', ARRAY['python'],
 '{"python":"n = int(input())\nbest_son, best_uz = 1, 0\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"10","expected_output":"9 19","is_hidden":false},
   {"input":"1","expected_output":"1 0","is_hidden":false}]'::jsonb,
 '[{"input":"20","expected_output":"18 20","is_hidden":true},
   {"input":"100","expected_output":"97 118","is_hidden":true}]'::jsonb,
 5000, 20, 50, ARRAY['while','optimallashtirish'], true),

-- ---------- Yakuniy bosqich ----------
('Ikkilik sanoq sistemasi', 'oly-ikkilik',
 'Manfiy bo''lmagan butun son berilgan. Uni ikkilik sanoq sistemasida yozing.

Tayyor bin() funksiyasidan foydalanmang — sonni 2 ga bo''lish orqali yeching.

Kirish: bitta butun son
Chiqish: uning ikkilik ko''rinishi (bosh nollarsiz)',
 'math', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"10","expected_output":"1010","is_hidden":false},
   {"input":"0","expected_output":"0","is_hidden":false}]'::jsonb,
 '[{"input":"1","expected_output":"1","is_hidden":true},
   {"input":"255","expected_output":"11111111","is_hidden":true},
   {"input":"1024","expected_output":"10000000000","is_hidden":true}]'::jsonb,
 2000, 15, 40, ARRAY['sanoq sistemasi','while'], true),

('Anagramma', 'oly-anagramma',
 'Ikki qatorda ikkita matn berilgan. Ular anagramma bo''lsa "Ha", aks holda "Yoq" deb yozing.

Anagramma — bir xil harflardan tuzilgan, faqat tartibi farq qiladigan so''zlar. Bo''shliqlar hisobga olinmaydi, katta-kichik harf farqlanmaydi.

Kirish:
1-qator — birinchi matn
2-qator — ikkinchi matn

Chiqish: Ha yoki Yoq',
 'strings', 'medium', ARRAY['python'],
 '{"python":"a = input().replace(\" \", \"\").lower()\nb = input().replace(\" \", \"\").lower()\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"olma\nmalo","expected_output":"Ha","is_hidden":false},
   {"input":"salom\nsalim","expected_output":"Yoq","is_hidden":false}]'::jsonb,
 '[{"input":"salom\nmaslo","expected_output":"Ha","is_hidden":true},
   {"input":"abc\ncba","expected_output":"Ha","is_hidden":true},
   {"input":"aab\nabb","expected_output":"Yoq","is_hidden":true}]'::jsonb,
 2000, 15, 40, ARRAY['matn','saralash'], true),

('Matritsa diagonallari', 'oly-matritsa-diagonal',
 'n × n o''lchamli butun sonlar matritsasi berilgan. Bosh diagonal yig''indisini, yon diagonal yig''indisini va ular orasidagi farqning absolyut qiymatini toping.

Kirish:
1-qator — n
Keyingi n qator — har birida n ta son, bo''shliq bilan

Chiqish:
1-qator — bosh diagonal yig''indisi
2-qator — yon diagonal yig''indisi
3-qator — farqning absolyut qiymati',
 'algorithms', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\nm = [list(map(int, input().split())) for _ in range(n)]\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"3\n1 2 3\n4 5 6\n7 8 9","expected_output":"15\n15\n0","is_hidden":false},
   {"input":"2\n1 2\n3 4","expected_output":"5\n5\n0","is_hidden":false}]'::jsonb,
 '[{"input":"3\n1 0 0\n0 1 0\n0 0 1","expected_output":"3\n1\n2","is_hidden":true}]'::jsonb,
 3000, 15, 40, ARRAY['matritsa','ro''yxat'], true),

('Eng katta yig''indili qism', 'oly-eng-katta-yigindi',
 'n ta butun son berilgan (manfiy sonlar ham bo''lishi mumkin). Ketma-ket turgan elementlardan iborat qism ichida eng katta yig''indini toping. Qism bo''sh bo''la olmaydi.

Masalan 1 −2 3 4 −1 uchun eng yaxshi qism 3 4, yig''indisi 7.

Kirish:
1-qator — n
2-qator — n ta son

Chiqish: eng katta yig''indi',
 'algorithms', 'hard', ARRAY['python'],
 '{"python":"n = int(input())\na = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"5\n1 -2 3 4 -1","expected_output":"7","is_hidden":false},
   {"input":"3\n-5 -2 -9","expected_output":"-2","is_hidden":false}]'::jsonb,
 '[{"input":"1\n7","expected_output":"7","is_hidden":true},
   {"input":"6\n-2 1 -3 4 -1 2","expected_output":"5","is_hidden":true},
   {"input":"4\n1 2 3 4","expected_output":"10","is_hidden":true}]'::jsonb,
 3000, 25, 60, ARRAY['dinamik dasturlash','ro''yxat'], true),

('Fibonachchi qoldiq bilan', 'oly-fibonachchi-mod',
 'n-Fibonachchi sonini 1000000007 ga bo''lgandagi qoldiqni toping.

Ketma-ketlik: F(0) = 0, F(1) = 1, F(k) = F(k−1) + F(k−2).

Kirish: bitta butun son n (0 ≤ n ≤ 100000)
Chiqish: F(n) mod 1000000007',
 'math', 'hard', ARRAY['python'],
 '{"python":"n = int(input())\nMOD = 1000000007\na, b = 0, 1\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"10","expected_output":"55","is_hidden":false},
   {"input":"1","expected_output":"1","is_hidden":false}]'::jsonb,
 '[{"input":"0","expected_output":"0","is_hidden":true},
   {"input":"50","expected_output":"586268941","is_hidden":true},
   {"input":"100","expected_output":"687995182","is_hidden":true}]'::jsonb,
 5000, 25, 60, ARRAY['fibonachchi','modul arifmetikasi'], true)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty, starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases, hidden_test_cases = EXCLUDED.hidden_test_cases,
  time_limit_ms = EXCLUDED.time_limit_ms, coin_reward = EXCLUDED.coin_reward,
  xp_reward = EXCLUDED.xp_reward, tags = EXCLUDED.tags,
  is_published = true, updated_at = now();

-- ============================================
-- MUSOBAQALAR
-- ============================================
DO $$
DECLARE
  c1 UUID; c2 UUID; c3 UUID;
BEGIN
  -- 1-bosqich
  INSERT INTO contests (title, slug, description, rules_html, starts_at, ends_at, penalty_minutes, freeze_minutes, is_published)
  VALUES ('Dasturlash asoslari: 1-bosqich olimpiadasi', 'dasturlash-asoslari-1-bosqich',
    'Fan dasturining 1-6 mavzulari bo''yicha kirish bosqichi. Sintaksis, arifmetik amallar, matn va ro''yxatlar bilan ishlash.',
    $html$
<h3>Qoidalar</h3>
<ul>
  <li>Musobaqa davomiyligi — 3 soat, masalalar soni — 5 ta.</li>
  <li>Har bir masala <b>stdin</b> orqali ma'lumot oladi va <b>stdout</b> ga natija chiqaradi.</li>
  <li>Yechim barcha testlardan o'tsa qabul qilinadi (qisman ball berilmaydi).</li>
  <li>Reyting: avval yechilgan masalalar soni, keyin jarima vaqti hisobga olinadi.</li>
  <li>Har bir noto'g'ri urinish uchun <b>20 daqiqa</b> jarima qo'shiladi — faqat masala keyinchalik yechilgan bo'lsa.</li>
  <li>Tashqi yordam va tayyor yechimlarni ko'chirish taqiqlanadi.</li>
</ul>
<h3>Tavsiya</h3>
<p>Masalalarni murakkabligi bo'yicha ko'rib chiqing — eng oson ko'ringanidan boshlash jarima vaqtini kamaytiradi. Yechimni yuborishdan oldin namunadagi testlarni albatta tekshiring.</p>
$html$,
    '2026-09-15 10:00:00+05', '2026-09-15 13:00:00+05', 20, 30, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, rules_html = EXCLUDED.rules_html,
    starts_at = EXCLUDED.starts_at, ends_at = EXCLUDED.ends_at, is_published = true
  RETURNING id INTO c1;

  -- 2-bosqich
  INSERT INTO contests (title, slug, description, rules_html, starts_at, ends_at, penalty_minutes, freeze_minutes, is_published)
  VALUES ('Dasturlash asoslari: 2-bosqich olimpiadasi', 'dasturlash-asoslari-2-bosqich',
    'Fan dasturining 7-11 mavzulari bo''yicha o''rta bosqich. Shartlar, lug''at va to''plam, while sikli, funksiyalar va modullar.',
    $html$
<h3>Qoidalar</h3>
<ul>
  <li>Musobaqa davomiyligi — 3 soat, masalalar soni — 5 ta.</li>
  <li>Kirish va chiqish formati har bir masalada aniq ko'rsatilgan — undan chetga chiqmang.</li>
  <li>Yechim vaqt chegarasidan oshib ketsa, hisobga olinmaydi. Samarali algoritm tanlang.</li>
  <li>Reyting ICPC uslubida: yechilgan masalalar soni (ko'p bo'lgani yuqori), so'ng jarima vaqti (kam bo'lgani yuqori).</li>
  <li>Oxirgi 30 daqiqada reyting muzlatiladi.</li>
</ul>
<h3>Tavsiya</h3>
<p>Chegaraviy holatlarni unutmang: bo'sh kirish, bitta element, manfiy sonlar, tenglik holati. Ko'p yechimlar aynan shu joyda yiqiladi.</p>
$html$,
    '2026-10-20 10:00:00+05', '2026-10-20 13:00:00+05', 20, 30, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, rules_html = EXCLUDED.rules_html,
    starts_at = EXCLUDED.starts_at, ends_at = EXCLUDED.ends_at, is_published = true
  RETURNING id INTO c2;

  -- Yakuniy
  INSERT INTO contests (title, slug, description, rules_html, starts_at, ends_at, penalty_minutes, freeze_minutes, is_published)
  VALUES ('Dasturlash asoslari: yakuniy olimpiada', 'dasturlash-asoslari-yakuniy',
    'Semestr yakunidagi olimpiada. Barcha mavzular qamrab olinadi, algoritmik fikrlash talab qilinadi.',
    $html$
<h3>Qoidalar</h3>
<ul>
  <li>Musobaqa davomiyligi — 4 soat, masalalar soni — 5 ta.</li>
  <li>Masalalar murakkablik bo'yicha o'sib boradi: A eng oson, E eng qiyin.</li>
  <li>Yechim barcha ochiq va yashirin testlardan o'tishi shart.</li>
  <li>Har bir noto'g'ri urinish uchun 20 daqiqa jarima.</li>
  <li>Oxirgi 60 daqiqada reyting muzlatiladi — yakuniy o'rinlar musobaqa tugagach e'lon qilinadi.</li>
</ul>
<h3>Baholash</h3>
<p>G'oliblar yechilgan masalalar soniga ko'ra aniqlanadi. Teng natijada kamroq jarima vaqti to'plagan ishtirokchi yuqori o'rinni egallaydi.</p>
$html$,
    '2026-12-15 10:00:00+05', '2026-12-15 14:00:00+05', 20, 60, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, rules_html = EXCLUDED.rules_html,
    starts_at = EXCLUDED.starts_at, ends_at = EXCLUDED.ends_at, is_published = true
  RETURNING id INTO c3;

  -- ============================================
  -- MASALALARNI MUSOBAQALARGA BIRIKTIRISH
  -- ============================================
  DELETE FROM contest_problems WHERE contest_id IN (c1, c2, c3);

  INSERT INTO contest_problems (contest_id, challenge_id, letter, order_index)
  SELECT c1, ch.id, x.letter, x.ord
    FROM (VALUES
      ('oly-ortacha-ball', 'A', 0),
      ('oly-eng-uzun-soz', 'B', 1),
      ('oly-juft-raqamlar', 'C', 2),
      ('oly-harf-chastotasi', 'D', 3),
      ('oly-mediana', 'E', 4)
    ) AS x(slug, letter, ord)
    JOIN challenges ch ON ch.slug = x.slug;

  INSERT INTO contest_problems (contest_id, challenge_id, letter, order_index)
  SELECT c2, ch.id, x.letter, x.ord
    FROM (VALUES
      ('oly-umumiy-boluvchilar', 'A', 0),
      ('oly-tub-boluvchilar', 'B', 1),
      ('oly-soz-chastotasi', 'C', 2),
      ('oly-piramida', 'D', 3),
      ('oly-kollatz-eng-uzun', 'E', 4)
    ) AS x(slug, letter, ord)
    JOIN challenges ch ON ch.slug = x.slug;

  INSERT INTO contest_problems (contest_id, challenge_id, letter, order_index)
  SELECT c3, ch.id, x.letter, x.ord
    FROM (VALUES
      ('oly-ikkilik', 'A', 0),
      ('oly-anagramma', 'B', 1),
      ('oly-matritsa-diagonal', 'C', 2),
      ('oly-eng-katta-yigindi', 'D', 3),
      ('oly-fibonachchi-mod', 'E', 4)
    ) AS x(slug, letter, ord)
    JOIN challenges ch ON ch.slug = x.slug;

END $$;
