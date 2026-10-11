-- ============================================================
-- MirAcademy — Yangi mustaqil topshiriqlar (20 ta)
--
-- 39-migratsiyadagi 30 ta topshiriqqa qo'shimcha:
--   oson   — 8 ta
--   o'rta  — 8 ta
--   qiyin  — 4 ta
--
-- Mavzular avvalgilarini takrorlamaydi: shart, ro'yxat, to'plam, lug'at,
-- matn bilan ishlash, sanoq sistemasi, Yevklid algoritmi, Kadane
-- algoritmi, dinamik dasturlash, matritsa, tub ko'paytuvchilar.
--
-- Barcha masalalar stdin → stdout tartibida. Har bir masalaning
-- namunaviy yechimi CPython 3 da 81 ta test bo'yicha
-- tekshirilgan — SQL ga faqat tasdiqlangan natijalar yozilgan.
-- Har masalada birinchi 2 ta test ko'rinadi, qolganlari yashirin.
--
-- Mukofotlar 36-migratsiyadagi shkalaga mos:
--   oson 10 coin / 30 XP, o'rta 18 / 55, qiyin 30 / 90.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz —
-- slug bo'yicha yangilanadi, dublikat yaratmaydi.
-- ============================================================

INSERT INTO challenges (
  title, slug, description, category, difficulty, languages,
  starter_code, test_cases, hidden_test_cases,
  time_limit_ms, coin_reward, xp_reward, tags, is_published
) VALUES
('Juftmi yoki toqmi?', 'ch-juft-toq',
 'Bitta butun son berilgan. Agar u juft bo''lsa "Juft", toq bo''lsa "Toq" deb chiqaring.

Kirish: bitta butun son (manfiy ham bo''lishi mumkin)
Chiqish: Juft yoki Toq

Eslatma: 0 — juft son.',
 'basics', 'easy', ARRAY['python'],
 '{"python": "n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "4", "expected_output": "Juft", "is_hidden": false}, {"input": "7", "expected_output": "Toq", "is_hidden": false}]'::jsonb,
 '[{"input": "0", "expected_output": "Juft", "is_hidden": true}, {"input": "-3", "expected_output": "Toq", "is_hidden": true}, {"input": "-8", "expected_output": "Juft", "is_hidden": true}]'::jsonb,
 2000, 10, 30, ARRAY['asoslar', 'shart'], true),

('Uchtadan eng kattasi', 'ch-uchta-eng-katta',
 'Bir qatorda bo''shliq bilan ajratilgan uchta butun son berilgan. Ularning eng kattasini chiqaring.

Kirish: a b c
Chiqish: eng katta son',
 'basics', 'easy', ARRAY['python'],
 '{"python": "a, b, c = map(int, input().split())\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "3 9 5", "expected_output": "9", "is_hidden": false}, {"input": "-4 -9 -1", "expected_output": "-1", "is_hidden": false}]'::jsonb,
 '[{"input": "7 7 7", "expected_output": "7", "is_hidden": true}, {"input": "0 -2 -3", "expected_output": "0", "is_hidden": true}]'::jsonb,
 2000, 10, 30, ARRAY['asoslar', 'shart'], true),

('Ro''yxat yig''indisi', 'ch-royxat-yigindi',
 'Birinchi qatorda n, ikkinchi qatorda n ta butun son berilgan. Ularning yig''indisini chiqaring.

Kirish:
1-qator — n
2-qator — n ta son

Chiqish: yig''indi',
 'arrays', 'easy', ARRAY['python'],
 '{"python": "n = int(input())\na = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "5\n1 2 3 4 5", "expected_output": "15", "is_hidden": false}, {"input": "3\n-1 -2 -3", "expected_output": "-6", "is_hidden": false}]'::jsonb,
 '[{"input": "1\n42", "expected_output": "42", "is_hidden": true}, {"input": "4\n0 0 0 0", "expected_output": "0", "is_hidden": true}]'::jsonb,
 2000, 10, 30, ARRAY['ro''yxat', 'sikl'], true),

('Sonni teskari o''qish', 'ch-son-teskari',
 'Butun son berilgan. Uning raqamlarini teskari tartibda yozib chiqaring. Ishora saqlanadi, boshidagi nollar tashlab yuboriladi.

Misollar:
123 → 321
-450 → -54
1000 → 1',
 'math', 'easy', ARRAY['python'],
 '{"python": "n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "123", "expected_output": "321", "is_hidden": false}, {"input": "-450", "expected_output": "-54", "is_hidden": false}]'::jsonb,
 '[{"input": "7", "expected_output": "7", "is_hidden": true}, {"input": "1000", "expected_output": "1", "is_hidden": true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'matn'], true),

('So''zlar soni', 'ch-sozlar-soni',
 'Bitta qator matn berilgan. Undagi so''zlar sonini chiqaring.

So''zlar bir yoki bir nechta bo''shliq bilan ajratilgan. Qator boshida va oxirida ham bo''shliq bo''lishi mumkin.

Kirish: matn
Chiqish: so''zlar soni',
 'strings', 'easy', ARRAY['python'],
 '{"python": "s = input()\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "salom dunyo", "expected_output": "2", "is_hidden": false}, {"input": "bir  ikki   uch", "expected_output": "3", "is_hidden": false}]'::jsonb,
 '[{"input": "yakka", "expected_output": "1", "is_hidden": true}, {"input": "   ko''p    bo''shliq   bor   ", "expected_output": "3", "is_hidden": true}]'::jsonb,
 2000, 10, 30, ARRAY['matn', 'split'], true),

('Oraliqdagi juft sonlar', 'ch-oraliq-juftlar',
 'Ikki butun son a va b berilgan (a ≤ b). [a; b] oralig''idagi barcha juft sonlarning yig''indisini chiqaring. Chegaralar ham hisobga kiradi.

Kirish: a b
Chiqish: yig''indi',
 'math', 'easy', ARRAY['python'],
 '{"python": "a, b = map(int, input().split())\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "1 10", "expected_output": "30", "is_hidden": false}, {"input": "2 2", "expected_output": "2", "is_hidden": false}]'::jsonb,
 '[{"input": "3 3", "expected_output": "0", "is_hidden": true}, {"input": "-4 4", "expected_output": "0", "is_hidden": true}]'::jsonb,
 2000, 10, 30, ARRAY['sikl', 'range'], true),

('Eng kichik va eng katta', 'ch-min-max',
 'Birinchi qatorda n, ikkinchi qatorda n ta butun son berilgan. Eng kichik va eng katta sonni bitta qatorda bo''shliq bilan chiqaring.

Kirish:
1-qator — n
2-qator — n ta son

Chiqish: min max',
 'arrays', 'easy', ARRAY['python'],
 '{"python": "n = int(input())\na = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "5\n4 1 9 2 7", "expected_output": "1 9", "is_hidden": false}, {"input": "1\n5", "expected_output": "5 5", "is_hidden": false}]'::jsonb,
 '[{"input": "3\n-3 -1 -2", "expected_output": "-3 -1", "is_hidden": true}]'::jsonb,
 2000, 10, 30, ARRAY['ro''yxat'], true),

('Harfni sanash', 'ch-harf-sanash',
 'Ikki qator berilgan: matn va bitta harf. Harf matnda necha marta uchrashini chiqaring.

Katta va kichik harflar farqlanadi: "S" va "s" — har xil harflar.

Kirish:
1-qator — matn
2-qator — harf

Chiqish: son',
 'strings', 'easy', ARRAY['python'],
 '{"python": "s = input()\nh = input()\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "dasturlash\na", "expected_output": "2", "is_hidden": false}, {"input": "python\nz", "expected_output": "0", "is_hidden": false}]'::jsonb,
 '[{"input": "aaaa\na", "expected_output": "4", "is_hidden": true}, {"input": "Salom\ns", "expected_output": "0", "is_hidden": true}]'::jsonb,
 2000, 10, 30, ARRAY['matn'], true),

('Faktorial', 'ch-faktorial',
 'Butun son n berilgan (0 ≤ n ≤ 20). n! ni chiqaring.

n! = 1 × 2 × 3 × … × n, va 0! = 1.

Kirish: n
Chiqish: n!',
 'math', 'medium', ARRAY['python'],
 '{"python": "n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "5", "expected_output": "120", "is_hidden": false}, {"input": "0", "expected_output": "1", "is_hidden": false}]'::jsonb,
 '[{"input": "1", "expected_output": "1", "is_hidden": true}, {"input": "10", "expected_output": "3628800", "is_hidden": true}, {"input": "20", "expected_output": "2432902008176640000", "is_hidden": true}]'::jsonb,
 3000, 18, 55, ARRAY['sikl', 'matematika'], true),

('EKUB', 'ch-ekub',
 'Ikki musbat butun son berilgan. Ularning eng katta umumiy bo''luvchisini (EKUB) chiqaring.

Maslahat: Yevklid algoritmi — katta sonni kichigiga bo''lgandagi qoldiq bilan almashtirib boring, qoldiq 0 bo''lguncha.

Kirish: a b
Chiqish: EKUB(a, b)',
 'math', 'medium', ARRAY['python'],
 '{"python": "a, b = map(int, input().split())\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "12 18", "expected_output": "6", "is_hidden": false}, {"input": "7 13", "expected_output": "1", "is_hidden": false}]'::jsonb,
 '[{"input": "100 10", "expected_output": "10", "is_hidden": true}, {"input": "270 192", "expected_output": "6", "is_hidden": true}]'::jsonb,
 3000, 18, 55, ARRAY['algoritm', 'while'], true),

('Anagramma', 'ch-anagramma',
 'Ikki so''z berilgan. Agar ular bir xil harflardan (bir xil miqdorda) tuzilgan bo''lsa "HA", aks holda "YO''Q" deb chiqaring.

Misol: "olma" va "mola" — anagramma.

Kirish:
1-qator — birinchi so''z
2-qator — ikkinchi so''z

Chiqish: HA yoki YO''Q',
 'strings', 'medium', ARRAY['python'],
 '{"python": "a = input()\nb = input()\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "olma\nmola", "expected_output": "HA", "is_hidden": false}, {"input": "salom\nmalos", "expected_output": "HA", "is_hidden": false}]'::jsonb,
 '[{"input": "kitob\nkitoblar", "expected_output": "YO''Q", "is_hidden": true}, {"input": "abc\nabd", "expected_output": "YO''Q", "is_hidden": true}]'::jsonb,
 3000, 18, 55, ARRAY['matn', 'saralash'], true),

('Turli qiymatlar soni', 'ch-takrorlanmas',
 'Birinchi qatorda n, ikkinchi qatorda n ta son berilgan. Ro''yxatda nechta TURLI qiymat borligini chiqaring.

Misol: 1 2 2 3 3 → 3 ta turli qiymat (1, 2, 3).

Maslahat: to''plam (set) takrorlarni o''zi olib tashlaydi.',
 'arrays', 'medium', ARRAY['python'],
 '{"python": "n = int(input())\na = input().split()\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "5\n1 2 2 3 3", "expected_output": "3", "is_hidden": false}, {"input": "4\n7 7 7 7", "expected_output": "1", "is_hidden": false}]'::jsonb,
 '[{"input": "3\n1 2 3", "expected_output": "3", "is_hidden": true}]'::jsonb,
 3000, 18, 55, ARRAY['to''plam', 'set'], true),

('Ikkinchi eng katta', 'ch-ikkinchi-katta',
 'Birinchi qatorda n, ikkinchi qatorda n ta butun son berilgan. Ikkinchi eng katta QIYMATni chiqaring.

Takroriy qiymatlar bitta deb hisoblanadi: 9 9 7 uchun javob 7. Agar barcha sonlar bir xil bo''lsa, "YO''Q" deb chiqaring.',
 'arrays', 'medium', ARRAY['python'],
 '{"python": "n = int(input())\na = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "5\n4 1 9 2 7", "expected_output": "7", "is_hidden": false}, {"input": "4\n5 5 5 5", "expected_output": "YO''Q", "is_hidden": false}]'::jsonb,
 '[{"input": "3\n-1 -5 -3", "expected_output": "-3", "is_hidden": true}, {"input": "2\n10 10", "expected_output": "YO''Q", "is_hidden": true}]'::jsonb,
 3000, 18, 55, ARRAY['ro''yxat', 'saralash'], true),

('Eng ko''p uchragan so''z', 'ch-soz-chastotasi',
 'Bitta qatorda bo''shliq bilan ajratilgan so''zlar berilgan. Eng ko''p uchragan so''zni va uning sonini chiqaring.

Agar bir nechta so''z teng marta uchrasa, matnda BIRINCHI uchraganini chiqaring.

Kirish: so''zlar
Chiqish: so''z soni',
 'strings', 'medium', ARRAY['python'],
 '{"python": "s = input().split()\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "olma nok olma uzum olma", "expected_output": "olma 3", "is_hidden": false}, {"input": "bir ikki ikki", "expected_output": "ikki 2", "is_hidden": false}]'::jsonb,
 '[{"input": "yakka", "expected_output": "yakka 1", "is_hidden": true}]'::jsonb,
 3000, 18, 55, ARRAY['lug''at', 'matn'], true),

('Ikkilik sanoq sistemasi', 'ch-ikkilik-sanoq',
 'Manfiy bo''lmagan butun son berilgan. Uni ikkilik sanoq sistemasida yozib chiqaring.

bin() funksiyasidan foydalanmasdan, 2 ga bo''lish orqali yeching.

Misol: 10 → 1010',
 'math', 'medium', ARRAY['python'],
 '{"python": "n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "10", "expected_output": "1010", "is_hidden": false}, {"input": "0", "expected_output": "0", "is_hidden": false}]'::jsonb,
 '[{"input": "1", "expected_output": "1", "is_hidden": true}, {"input": "255", "expected_output": "11111111", "is_hidden": true}, {"input": "64", "expected_output": "1000000", "is_hidden": true}]'::jsonb,
 3000, 18, 55, ARRAY['while', 'sanoq sistemasi'], true),

('Matnni siqish', 'ch-matn-siqish',
 'Kichik lotin harflaridan iborat matn berilgan. Ketma-ket kelgan bir xil harflarni "harf + soni" ko''rinishida siqing.

Misollar:
aaabb → a3b2
abc → a1b1c1
aabbaa → a2b2a2  (oxirgi aa — alohida guruh)',
 'strings', 'medium', ARRAY['python'],
 '{"python": "s = input()\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "aaabb", "expected_output": "a3b2", "is_hidden": false}, {"input": "abc", "expected_output": "a1b1c1", "is_hidden": false}]'::jsonb,
 '[{"input": "zzzzzzz", "expected_output": "z7", "is_hidden": true}, {"input": "aabbaa", "expected_output": "a2b2a2", "is_hidden": true}]'::jsonb,
 3000, 18, 55, ARRAY['matn', 'while'], true),

('Eng katta ketma-ket yig''indi', 'ch-eng-katta-yigindi',
 'Birinchi qatorda n, ikkinchi qatorda n ta butun son berilgan. Ketma-ket joylashgan elementlardan iborat qism (kamida bitta element) yig''indisining eng kattasini chiqaring.

Misol: 1 -2 3 4 -1 → 7 (3 + 4)

Barcha sonlar manfiy bo''lsa, javob — eng katta element.

Maslahat: har qadamda "shu yerda tugaydigan eng yaxshi yig''indi"ni saqlab boring.',
 'algorithms', 'hard', ARRAY['python'],
 '{"python": "n = int(input())\na = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "5\n1 -2 3 4 -1", "expected_output": "7", "is_hidden": false}, {"input": "4\n-5 -2 -9 -1", "expected_output": "-1", "is_hidden": false}]'::jsonb,
 '[{"input": "3\n2 3 4", "expected_output": "9", "is_hidden": true}, {"input": "6\n-2 1 -3 4 -1 2", "expected_output": "5", "is_hidden": true}]'::jsonb,
 5000, 30, 90, ARRAY['algoritm', 'dinamik dasturlash'], true),

('Zinapoyaga chiqish', 'ch-pogona',
 'Zinapoyada n ta pog''ona bor. Bir qadamda 1 yoki 2 pog''onaga chiqish mumkin. Eng tepaga necha xil usulda chiqish mumkinligini chiqaring.

Misol: n = 3 → 3 usul (1+1+1, 1+2, 2+1)

Kirish: n (1 ≤ n ≤ 80)
Chiqish: usullar soni',
 'algorithms', 'hard', ARRAY['python'],
 '{"python": "n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "1", "expected_output": "1", "is_hidden": false}, {"input": "2", "expected_output": "2", "is_hidden": false}]'::jsonb,
 '[{"input": "3", "expected_output": "3", "is_hidden": true}, {"input": "5", "expected_output": "8", "is_hidden": true}, {"input": "10", "expected_output": "89", "is_hidden": true}]'::jsonb,
 5000, 30, 90, ARRAY['algoritm', 'dinamik dasturlash'], true),

('Matritsani transponirlash', 'ch-matritsa-transpoze',
 'Birinchi qatorda n va m, keyingi n qatorda m tadan butun son — matritsa berilgan. Uni transponirlang: satrlar ustunga, ustunlar satrga aylansin.

Natijani m qatorda, har birida n ta son bo''shliq bilan chiqaring.',
 'arrays', 'hard', ARRAY['python'],
 '{"python": "n, m = map(int, input().split())\na = [list(map(int, input().split())) for _ in range(n)]\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "2 3\n1 2 3\n4 5 6", "expected_output": "1 4\n2 5\n3 6", "is_hidden": false}, {"input": "1 1\n9", "expected_output": "9", "is_hidden": false}]'::jsonb,
 '[{"input": "3 2\n1 2\n3 4\n5 6", "expected_output": "1 3 5\n2 4 6", "is_hidden": true}]'::jsonb,
 5000, 30, 90, ARRAY['matritsa', 'ichma-ich sikl'], true),

('Tub ko''paytuvchilarga ajratish', 'ch-tub-kopaytuvchilar',
 'Butun son n berilgan (2 ≤ n ≤ 10⁹). Uni tub ko''paytuvchilarga ajrating va ularni o''sish tartibida bo''shliq bilan chiqaring.

Misol: 12 → 2 2 3

Maslahat: bo''luvchini faqat √n gacha tekshirish yetarli.',
 'math', 'hard', ARRAY['python'],
 '{"python": "n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input": "12", "expected_output": "2 2 3", "is_hidden": false}, {"input": "97", "expected_output": "97", "is_hidden": false}]'::jsonb,
 '[{"input": "100", "expected_output": "2 2 5 5", "is_hidden": true}, {"input": "2", "expected_output": "2", "is_hidden": true}, {"input": "360", "expected_output": "2 2 2 3 3 5", "is_hidden": true}]'::jsonb,
 5000, 30, 90, ARRAY['algoritm', 'tub son'], true)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases,
  time_limit_ms = EXCLUDED.time_limit_ms,
  coin_reward = EXCLUDED.coin_reward,
  xp_reward = EXCLUDED.xp_reward,
  tags = EXCLUDED.tags,
  is_published = true,
  updated_at = now();
