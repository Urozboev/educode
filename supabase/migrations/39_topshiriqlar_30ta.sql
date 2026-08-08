-- ============================================
-- EduCode — Mustaqil topshiriqlar to'plami (30 ta)
--
-- "Topshiriqlar" bo'limi uchun uch darajali mashq masalalari:
--   oson   — 14 ta (shu jumladan bir qatorlik eng sodda masalalar)
--   o'rta  — 11 ta
--   qiyin  — 5 ta
--
-- Ular olimpiada masalalaridan farqli — hech qanday musobaqaga
-- bog'lanmagan, istalgan vaqtda yechiladi.
--
-- Barcha masalalar stdin → stdout tartibida ishlaydi: dastur input()
-- bilan o'qiydi, print() bilan chiqaradi. Har bir yechim CPython 3 da
-- 112 ta test bo'yicha sinovdan o'tkazilgan.
--
-- Mukofotlar 36-migratsiyadagi shkalaga mos:
--   oson 10 coin / 30 XP, o'rta 18 / 55, qiyin 30 / 90.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz —
-- slug bo'yicha yangilanadi, dublikat yaratmaydi.
-- ============================================

INSERT INTO challenges (
  title, slug, description, category, difficulty, languages,
  starter_code, test_cases, hidden_test_cases,
  time_limit_ms, coin_reward, xp_reward, tags, is_published
) VALUES
('Salom, dunyo!', 'ch-salom-dunyo',
 'Ekranga aynan quyidagi matnni chiqaring:

Salom, dunyo!

Kirish: yo''q
Chiqish: bitta qator matn',
 'basics', 'easy', ARRAY['python'],
 '{"python":"# Kodingizni yozing"}'::jsonb,
 '[{"input":"","expected_output":"Salom, dunyo!","is_hidden":false}]'::jsonb,
 '[]'::jsonb,
 2000, 10, 30, ARRAY['asoslar', 'print'], true),

('Ikki sonning ko''paytmasi', 'ch-ikki-son-kopaytma',
 'Ikki qatorda ikkita butun son berilgan. Ularning ko''paytmasini chiqaring.

Kirish:
1-qator — a
2-qator — b

Chiqish: a × b',
 'math', 'easy', ARRAY['python'],
 '{"python":"a = int(input())\nb = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"3\n4","expected_output":"12","is_hidden":false},{"input":"-5\n2","expected_output":"-10","is_hidden":false}]'::jsonb,
 '[{"input":"0\n99","expected_output":"0","is_hidden":true},{"input":"7\n7","expected_output":"49","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Sonning kvadrati', 'ch-kvadrat',
 'Bitta butun son berilgan. Uning kvadratini chiqaring.

Kirish: bitta son
Chiqish: son × son',
 'math', 'easy', ARRAY['python'],
 '{"python":"n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"5","expected_output":"25","is_hidden":false},{"input":"-3","expected_output":"9","is_hidden":false}]'::jsonb,
 '[{"input":"0","expected_output":"0","is_hidden":true},{"input":"12","expected_output":"144","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Uch sonning yig''indisi', 'ch-uch-son-yigindi',
 'Bir qatorda bo''shliq bilan ajratilgan uchta butun son berilgan. Ularning yig''indisini chiqaring.

Kirish: a b c
Chiqish: yig''indi',
 'math', 'easy', ARRAY['python'],
 '{"python":"a, b, c = map(int, input().split())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"1 2 3","expected_output":"6","is_hidden":false},{"input":"10 -5 5","expected_output":"10","is_hidden":false}]'::jsonb,
 '[{"input":"0 0 0","expected_output":"0","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Ishorani almashtirish', 'ch-ishorani-almashtirish',
 'Bitta butun son berilgan. Uning ishorasini teskarisiga o''zgartirib chiqaring: musbat bo''lsa manfiy, manfiy bo''lsa musbat.

Nol uchun javob 0.',
 'math', 'easy', ARRAY['python'],
 '{"python":"n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"7","expected_output":"-7","is_hidden":false},{"input":"-4","expected_output":"4","is_hidden":false}]'::jsonb,
 '[{"input":"0","expected_output":"0","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Oxirgi raqam', 'ch-oxirgi-raqam',
 'Manfiy bo''lmagan butun son berilgan. Uning oxirgi raqamini chiqaring.

Masalan 472 uchun javob 2.',
 'math', 'easy', ARRAY['python'],
 '{"python":"n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"472","expected_output":"2","is_hidden":false},{"input":"9","expected_output":"9","is_hidden":false}]'::jsonb,
 '[{"input":"100","expected_output":"0","is_hidden":true},{"input":"12345","expected_output":"5","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Yoshni hisoblash', 'ch-yosh-hisobi',
 'Ikki qatorda joriy yil va tug''ilgan yil berilgan. Necha yoshda ekanini chiqaring.

Kirish:
1-qator — joriy yil
2-qator — tug''ilgan yil',
 'math', 'easy', ARRAY['python'],
 '{"python":"joriy = int(input())\ntugilgan = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"2026\n2005","expected_output":"21","is_hidden":false},{"input":"2026\n2026","expected_output":"0","is_hidden":false}]'::jsonb,
 '[{"input":"2030\n1999","expected_output":"31","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Soniyani daqiqaga aylantirish', 'ch-soniya-daqiqa',
 'Butun son — soniyalar berilgan. Necha to''liq daqiqa va necha soniya qolganini chiqaring.

Kirish: soniyalar soni
Chiqish: bitta qatorda "daqiqa soniya" (bo''shliq bilan)

Masalan 135 uchun: 2 15',
 'math', 'easy', ARRAY['python'],
 '{"python":"s = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"135","expected_output":"2 15","is_hidden":false},{"input":"60","expected_output":"1 0","is_hidden":false}]'::jsonb,
 '[{"input":"59","expected_output":"0 59","is_hidden":true},{"input":"3600","expected_output":"60 0","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Bosh harflarga o''tkazish', 'ch-katta-harf',
 'Bir qator matn berilgan. Uni butunlay bosh harflarga o''tkazib chiqaring.

Masalan: python → PYTHON',
 'strings', 'easy', ARRAY['python'],
 '{"python":"s = input()\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"python","expected_output":"PYTHON","is_hidden":false},{"input":"salom dunyo","expected_output":"SALOM DUNYO","is_hidden":false}]'::jsonb,
 '[{"input":"ABC","expected_output":"ABC","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matn'], true),

('Matn uzunligi', 'ch-matn-uzunligi',
 'Bir qator matn berilgan. Undagi belgilar sonini chiqaring (bo''shliqlar ham hisoblanadi).',
 'strings', 'easy', ARRAY['python'],
 '{"python":"s = input()\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"python","expected_output":"6","is_hidden":false},{"input":"salom dunyo","expected_output":"11","is_hidden":false}]'::jsonb,
 '[{"input":"a","expected_output":"1","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matn'], true),

('Uchburchak yuzasi', 'ch-uchburchak-yuzasi',
 'Ikki qatorda uchburchakning asosi va balandligi (butun sonlar) berilgan. Yuzasini 1 xonagacha yaxlitlab chiqaring.

Yuza = asos × balandlik / 2',
 'math', 'easy', ARRAY['python'],
 '{"python":"a = int(input())\nh = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"6\n4","expected_output":"12.0","is_hidden":false},{"input":"5\n3","expected_output":"7.5","is_hidden":false}]'::jsonb,
 '[{"input":"1\n1","expected_output":"0.5","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Selsiydan Farengeytga', 'ch-fahrenheit',
 'Butun son — Selsiy shkalasidagi harorat berilgan. Uni Farengeytga aylantirib, 1 xonagacha yaxlitlab chiqaring.

F = C × 9 / 5 + 32',
 'math', 'easy', ARRAY['python'],
 '{"python":"c = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"0","expected_output":"32.0","is_hidden":false},{"input":"100","expected_output":"212.0","is_hidden":false}]'::jsonb,
 '[{"input":"-40","expected_output":"-40.0","is_hidden":true},{"input":"37","expected_output":"98.6","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Chegirmadan keyingi narx', 'ch-narx-chegirma',
 'Ikki qatorda mahsulot narxi va chegirma foizi (butun sonlar) berilgan. Chegirmadan keyingi narxni 2 xonagacha yaxlitlab chiqaring.',
 'math', 'easy', ARRAY['python'],
 '{"python":"narx = int(input())\nfoiz = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"100\n20","expected_output":"80.00","is_hidden":false},{"input":"50000\n15","expected_output":"42500.00","is_hidden":false}]'::jsonb,
 '[{"input":"999\n0","expected_output":"999.00","is_hidden":true},{"input":"200\n100","expected_output":"0.00","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Kub hajmi va sirti', 'ch-kub-hajmi',
 'Kub qirrasining uzunligi (butun son) berilgan. Ikki qatorda hajmini va to''liq sirt yuzasini chiqaring.

Hajm = a³, sirt = 6a²',
 'math', 'easy', ARRAY['python'],
 '{"python":"a = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"3","expected_output":"27\n54","is_hidden":false},{"input":"1","expected_output":"1\n6","is_hidden":false}]'::jsonb,
 '[{"input":"10","expected_output":"1000\n600","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['matematika', 'arifmetika'], true),

('Uch sondan eng kichigi', 'ch-uch-sondan-kichik',
 'Bir qatorda bo''shliq bilan ajratilgan uchta butun son berilgan. Eng kichigini chiqaring.

Tayyor min() funksiyasidan foydalanmang — shartlar orqali yeching.',
 'algorithms', 'medium', ARRAY['python'],
 '{"python":"a, b, c = map(int, input().split())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"3 9 5","expected_output":"3","is_hidden":false},{"input":"10 2 7","expected_output":"2","is_hidden":false}]'::jsonb,
 '[{"input":"4 4 4","expected_output":"4","is_hidden":true},{"input":"-5 -2 -9","expected_output":"-9","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['algoritm'], true),

('Tub sonmi?', 'ch-tub-son',
 'Butun son berilgan. Agar u tub bo''lsa "tub", aks holda "tub emas" deb chiqaring.

Eslatma: 1 va undan kichik sonlar tub emas.',
 'math', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"7","expected_output":"tub","is_hidden":false},{"input":"12","expected_output":"tub emas","is_hidden":false}]'::jsonb,
 '[{"input":"1","expected_output":"tub emas","is_hidden":true},{"input":"2","expected_output":"tub","is_hidden":true},{"input":"97","expected_output":"tub","is_hidden":true},{"input":"1000003","expected_output":"tub","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['matematika', 'arifmetika'], true),

('Raqamlar ko''paytmasi', 'ch-raqamlar-kopaytmasi',
 'Musbat butun son berilgan. Uning raqamlari ko''paytmasini chiqaring.

Masalan 234 uchun: 2 × 3 × 4 = 24',
 'math', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"234","expected_output":"24","is_hidden":false},{"input":"9","expected_output":"9","is_hidden":false}]'::jsonb,
 '[{"input":"105","expected_output":"0","is_hidden":true},{"input":"1111","expected_output":"1","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['matematika', 'arifmetika'], true),

('Palindrom son', 'ch-palindrom-son',
 'Musbat butun son berilgan. Agar u teskari o''qilganda ham bir xil bo''lsa "Ha", aks holda "Yoq" deb chiqaring.

Masalan 12321 — palindrom, 1234 — yo''q.',
 'math', 'medium', ARRAY['python'],
 '{"python":"n = input().strip()\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"12321","expected_output":"Ha","is_hidden":false},{"input":"1234","expected_output":"Yoq","is_hidden":false}]'::jsonb,
 '[{"input":"7","expected_output":"Ha","is_hidden":true},{"input":"1221","expected_output":"Ha","is_hidden":true},{"input":"10","expected_output":"Yoq","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['matematika', 'arifmetika'], true),

('n-chi Fibonachchi soni', 'ch-fibonachchi-n',
 'Butun son n berilgan (0 ≤ n ≤ 90). n-chi Fibonachchi sonini chiqaring.

F(0) = 0, F(1) = 1, F(k) = F(k−1) + F(k−2)',
 'algorithms', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"0","expected_output":"0","is_hidden":false},{"input":"1","expected_output":"1","is_hidden":false}]'::jsonb,
 '[{"input":"10","expected_output":"55","is_hidden":true},{"input":"20","expected_output":"6765","is_hidden":true},{"input":"50","expected_output":"12586269025","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['algoritm'], true),

('Sonlar o''rtachasi', 'ch-massiv-ortacha',
 'Birinchi qatorda n, ikkinchisida n ta butun son bo''shliq bilan berilgan. Ularning o''rtachasini 2 xonagacha yaxlitlab chiqaring.',
 'algorithms', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\na = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"3\n10 20 30","expected_output":"20.00","is_hidden":false},{"input":"4\n1 2 3 4","expected_output":"2.50","is_hidden":false}]'::jsonb,
 '[{"input":"1\n7","expected_output":"7.00","is_hidden":true},{"input":"2\n-5 5","expected_output":"0.00","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['algoritm'], true),

('Unli va undosh harflar', 'ch-vokal-undosh',
 'Bir qator matn berilgan (kichik lotin harflari va bo''shliqlar). Ikki qatorda unli harflar sonini (a e i o u) va undosh harflar sonini chiqaring. Bo''shliqlar hisobga olinmaydi.',
 'strings', 'medium', ARRAY['python'],
 '{"python":"s = input()\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"salom dunyo","expected_output":"4\n6","is_hidden":false},{"input":"python","expected_output":"1\n5","is_hidden":false}]'::jsonb,
 '[{"input":"aeiou","expected_output":"5\n0","is_hidden":true},{"input":"xyz","expected_output":"0\n3","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['matn'], true),

('Kamayish tartibida saralash', 'ch-sonlar-saralash',
 'Birinchi qatorda n, ikkinchisida n ta butun son berilgan. Ularni kamayish tartibida bitta qatorda bo''shliq bilan chiqaring.',
 'algorithms', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\na = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"5\n3 1 4 1 5","expected_output":"5 4 3 1 1","is_hidden":false},{"input":"3\n-1 -5 0","expected_output":"0 -1 -5","is_hidden":false}]'::jsonb,
 '[{"input":"1\n42","expected_output":"42","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['algoritm'], true),

('Ikki ro''yxat farqi', 'ch-ikki-royxat-farqi',
 'To''rt qator berilgan: 1-ro''yxat uzunligi, uning elementlari, 2-ro''yxat uzunligi, uning elementlari (butun sonlar).

Birinchi ro''yxatda bor, ikkinchisida yo''q sonlarni takrorlarsiz, o''sish tartibida chiqaring. Bunday son bo''lmasa "yoq" deb yozing.',
 'algorithms', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\na = list(map(int, input().split()))\nm = int(input())\nb = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"5\n1 2 3 4 5\n3\n2 4 6","expected_output":"1 3 5","is_hidden":false},{"input":"3\n1 2 3\n3\n1 2 3","expected_output":"yoq","is_hidden":false}]'::jsonb,
 '[{"input":"4\n5 5 7 7\n1\n5","expected_output":"7","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['algoritm'], true),

('Har bir so''zni teskari o''girish', 'ch-soz-teskari',
 'Bir qatorda bo''shliq bilan ajratilgan so''zlar berilgan. Har bir so''zni teskari o''girib, so''zlar tartibini saqlagan holda chiqaring.

Masalan: men python → nem nohtyp',
 'strings', 'medium', ARRAY['python'],
 '{"python":"s = input()\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"men python","expected_output":"nem nohtyp","is_hidden":false},{"input":"salom","expected_output":"molas","is_hidden":false}]'::jsonb,
 '[{"input":"a bb ccc","expected_output":"a bb ccc","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['matn'], true),

('Ballar statistikasi', 'ch-ballar-statistikasi',
 'Birinchi qatorda talabalar soni n, ikkinchisida n ta ball berilgan.

Uch qatorda chiqaring:
1) eng yuqori ball
2) eng past ball
3) o''rtacha ball (2 xonagacha)',
 'algorithms', 'medium', ARRAY['python'],
 '{"python":"n = int(input())\nb = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"5\n90 75 60 100 85","expected_output":"100\n60\n82.00","is_hidden":false},{"input":"1\n50","expected_output":"50\n50\n50.00","is_hidden":false}]'::jsonb,
 '[{"input":"3\n70 70 70","expected_output":"70\n70\n70.00","is_hidden":true}]'::jsonb,
 3000, 18, 55, ARRAY['algoritm'], true),

('Eng uzun o''suvchi bo''lak', 'ch-eng-uzun-osish',
 'Birinchi qatorda n, ikkinchisida n ta butun son berilgan.

Ketma-ket turgan va qat''iy o''sib boradigan eng uzun bo''lakning uzunligini chiqaring.

Masalan 1 2 5 3 4 6 7 uchun javob 4 (3 4 6 7).',
 'algorithms', 'hard', ARRAY['python'],
 '{"python":"n = int(input())\na = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"7\n1 2 5 3 4 6 7","expected_output":"4","is_hidden":false},{"input":"5\n5 4 3 2 1","expected_output":"1","is_hidden":false}]'::jsonb,
 '[{"input":"1\n9","expected_output":"1","is_hidden":true},{"input":"6\n1 2 3 4 5 6","expected_output":"6","is_hidden":true},{"input":"4\n2 2 2 2","expected_output":"1","is_hidden":true}]'::jsonb,
 5000, 30, 90, ARRAY['algoritm'], true),

('Qavslar balansi', 'ch-qavslar-balansi',
 'Bir qatorda faqat ( va ) belgilaridan iborat matn berilgan.

Qavslar to''g''ri joylashgan bo''lsa "Ha", aks holda "Yoq" deb chiqaring.

To''g''ri joylashgan degani: har bir ochilgan qavs yopiladi va yopuvchi qavs o''zidan oldin ochilganisiz kelmaydi.',
 'algorithms', 'hard', ARRAY['python'],
 '{"python":"s = input().strip()\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"(())","expected_output":"Ha","is_hidden":false},{"input":"()()","expected_output":"Ha","is_hidden":false}]'::jsonb,
 '[{"input":"(()","expected_output":"Yoq","is_hidden":true},{"input":")(","expected_output":"Yoq","is_hidden":true},{"input":"((()))","expected_output":"Ha","is_hidden":true}]'::jsonb,
 5000, 30, 90, ARRAY['algoritm'], true),

('Chastota bo''yicha saralash', 'ch-chastota-saralash',
 'Birinchi qatorda n, ikkinchisida n ta butun son berilgan.

Sonlarni takrorlanish soniga qarab kamayish tartibida chiqaring. Chastotasi teng bo''lsa, kichik son oldin kelsin. Har son bir marta yoziladi.

Masalan 1 1 2 2 2 3 uchun: 2 1 3',
 'algorithms', 'hard', ARRAY['python'],
 '{"python":"n = int(input())\na = list(map(int, input().split()))\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"6\n1 1 2 2 2 3","expected_output":"2 1 3","is_hidden":false},{"input":"4\n5 5 7 7","expected_output":"5 7","is_hidden":false}]'::jsonb,
 '[{"input":"3\n9 9 9","expected_output":"9","is_hidden":true},{"input":"5\n4 3 2 1 1","expected_output":"1 2 3 4","is_hidden":true}]'::jsonb,
 5000, 30, 90, ARRAY['algoritm'], true),

('Ikkilik qidiruv', 'ch-ikkilik-qidiruv',
 'Uch qator berilgan: n, o''sish tartibida saralangan n ta butun son, va qidirilayotgan son x.

x ro''yxatda bo''lsa uning indeksini (0 dan boshlab) chiqaring, bo''lmasa −1.

Ro''yxat saralangani uchun ikkilik qidiruvdan foydalaning.',
 'algorithms', 'hard', ARRAY['python'],
 '{"python":"n = int(input())\na = list(map(int, input().split()))\nx = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"5\n1 3 5 7 9\n7","expected_output":"3","is_hidden":false},{"input":"5\n1 3 5 7 9\n4","expected_output":"-1","is_hidden":false}]'::jsonb,
 '[{"input":"1\n42\n42","expected_output":"0","is_hidden":true},{"input":"6\n-5 -2 0 3 8 10\n-5","expected_output":"0","is_hidden":true}]'::jsonb,
 5000, 30, 90, ARRAY['algoritm'], true),

('Berilgan yig''indili juftliklar', 'ch-juftlik-yigindi',
 'Uch qator berilgan: n, n ta butun son, va nishon son s.

Yig''indisi s ga teng bo''lgan juftliklar sonini chiqaring. Bir element ikki marta ishlatilmaydi, juftliklar tartibi ahamiyatsiz (i < j).

Masalan 1 2 3 4 va s = 5 uchun javob 2 — (1,4) va (2,3).',
 'algorithms', 'hard', ARRAY['python'],
 '{"python":"n = int(input())\na = list(map(int, input().split()))\ns = int(input())\n# Kodingizni yozing"}'::jsonb,
 '[{"input":"4\n1 2 3 4\n5","expected_output":"2","is_hidden":false},{"input":"5\n1 1 1 1 1\n2","expected_output":"10","is_hidden":false}]'::jsonb,
 '[{"input":"3\n1 2 3\n10","expected_output":"0","is_hidden":true},{"input":"4\n0 0 5 5\n5","expected_output":"4","is_hidden":true}]'::jsonb,
 5000, 30, 90, ARRAY['algoritm'], true)

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
