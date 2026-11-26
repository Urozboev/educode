-- ============================================================
-- MirAcademy — Funksiyalar bo'yicha mustaqil topshiriqlar (5 ta)
--
-- Yangi toifa: 'functions' (Funksiyalar). Filtr ro'yxatiga ham qo'shilgan.
--   oson  — 2 ta: def/return, standart parametr
--   o'rta — 2 ta: funksiyani qayta ishlatish, rekursiya
--   qiyin — 1 ta: funksiya qiymat sifatida (lug'atdagi funksiyalar)
--
-- Har masalada asosiy dastur (input/print) tayyor beriladi — talaba faqat
-- funksiya tanasini yozadi. Shu sabab test natijasi funksiya to'g'riligini
-- tekshiradi.
--
-- Namunaviy yechimlar CPython 3 da ishga tushirilib, kutilgan natijalar
-- shundan olingan. Birinchi 2 ta test ko'rinadi, qolganlari yashirin.
-- Matnlar yangi alifboda, kod va kutilgan natijalar — eski yozuvda.
--
-- Mukofotlar 36-migratsiyadagi shkala: oson 10/30, o'rta 18/55, qiyin 30/90.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz —
-- slug bo'yicha yangilanadi, dublikat yaratmaydi.
-- ============================================================

INSERT INTO challenges (
  title, slug, description, category, difficulty, languages,
  starter_code, test_cases, hidden_test_cases,
  time_limit_ms, coin_reward, xp_reward, tags, is_published
) VALUES
('Juft sonlarni sanaydigan funksiya', 'ch-fn-juftlar-soni',
 '`juft_mi(n)` funksiyasini yozing: son juft bölsa True, toq bölsa False qaytarsin.

Asosiy dastur tayyor: u röyxatdagi har bir sonni funksiyangizga beradi va juftlar sonini çiqaradi. Siz faqat funksiya tanasini yozasiz.

Kiriş:
1-qator — n
2-qator — n ta butun son

Çiqiş: juft sonlar soni

Eslatma: 0 va manfiy juft sonlar ham juft hisoblanadi.',
 'functions', 'easy', ARRAY['python'],
 '{"python":"def juft_mi(n):\n    # Kodingizni yozing\n    pass\n\n\nn = int(input())\nsonlar = list(map(int, input().split()))\nprint(sum(1 for x in sonlar if juft_mi(x)))\n"}'::jsonb,
 '[{"input":"5\n1 2 3 4 5","expected_output":"2","is_hidden":false},{"input":"4\n-2 -3 0 7","expected_output":"2","is_hidden":false}]'::jsonb,
 '[{"input":"1\n9","expected_output":"0","is_hidden":true},{"input":"6\n2 4 6 8 10 12","expected_output":"6","is_hidden":true},{"input":"3\n-1 -5 -7","expected_output":"0","is_hidden":true},{"input":"1\n0","expected_output":"1","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['funksiya', 'def', 'return'], true),

('Standart qiymatli parametr', 'ch-fn-daraja-standart',
 '`daraja(a, n=2)` funksiyasini yozing: a ning n-darajasini qaytarsin. n berilmasa, kvadrat (n=2) hisoblansin.

Kiriş: bitta qatorda a yoki a va n (böşliq bilan)
Çiqiş: natija

Misollar:
5 → 25 (n berilmagan, kvadrat)
2 10 → 1024

Maslahat: çaqiruvda n ni faqat berilgan bölsa uzating — standart qiymat şundagina işlaydi.',
 'functions', 'easy', ARRAY['python'],
 '{"python":"def daraja(a, n=2):\n    # Kodingizni yozing\n    pass\n\n\nqism = list(map(int, input().split()))\nif len(qism) == 1:\n    print(daraja(qism[0]))\nelse:\n    print(daraja(qism[0], qism[1]))\n"}'::jsonb,
 '[{"input":"5","expected_output":"25","is_hidden":false},{"input":"2 10","expected_output":"1024","is_hidden":false}]'::jsonb,
 '[{"input":"-3","expected_output":"9","is_hidden":true},{"input":"7 0","expected_output":"1","is_hidden":true},{"input":"-2 3","expected_output":"-8","is_hidden":true},{"input":"10 6","expected_output":"1000000","is_hidden":true}]'::jsonb,
 2000, 10, 30, ARRAY['funksiya', 'standart parametr'], true),

('Tub sonlar: funksiyani qayta işlatiş', 'ch-fn-oraliq-tublar',
 'Ikkita funksiya yozing:

1. `tub_mi(n)` — n tub son bölsa True qaytaradi (1 va undan kiçik sonlar tub emas).
2. `tublar(a, b)` — [a; b] oraliğidagi barça tub sonlar röyxatini qaytaradi. Bunda `tub_mi` dan foydalaning.

Asosiy dastur: tub sonlarni böşliq bilan çiqaradi, oraliqda tub son bölmasa 0 çiqaradi.

Kiriş: a b (a ≤ b)
Çiqiş: tub sonlar yoki 0

Maslahat: böluvçilarni faqat √n gaça tekşiriş yetarli.',
 'functions', 'medium', ARRAY['python'],
 '{"python":"def tub_mi(n):\n    # Kodingizni yozing\n    pass\n\n\ndef tublar(a, b):\n    # tub_mi() dan foydalaning\n    pass\n\n\na, b = map(int, input().split())\nnatija = tublar(a, b)\nprint(\" \".join(map(str, natija)) if natija else 0)\n"}'::jsonb,
 '[{"input":"1 20","expected_output":"2 3 5 7 11 13 17 19","is_hidden":false},{"input":"24 28","expected_output":"0","is_hidden":false}]'::jsonb,
 '[{"input":"-5 3","expected_output":"2 3","is_hidden":true},{"input":"97 101","expected_output":"97 101","is_hidden":true},{"input":"1 1","expected_output":"0","is_hidden":true},{"input":"2 2","expected_output":"2","is_hidden":true},{"input":"90 100","expected_output":"97","is_hidden":true},{"input":"1000 1050","expected_output":"1009 1013 1019 1021 1031 1033 1039 1049","is_hidden":true}]'::jsonb,
 2000, 18, 55, ARRAY['funksiya', 'tub son', 'qayta işlatiş'], true),

('Rekursiya: raqamli ildiz', 'ch-fn-raqamli-ildiz',
 'Sonning raqamli ildizi — raqamlari yiğindisini bitta raqam qolgunça qayta-qayta hisoblaş natijasi.

Masalan: 9875 → 9+8+7+5 = 29 → 2+9 = 11 → 1+1 = 2

Ikkita funksiya yozing:
1. `raqamlar_yigindisi(n)` — n raqamlari yiğindisi.
2. `raqamli_ildiz(n)` — REKURSIV funksiya: n bir xonali bölsa özini qaytaradi, aks holda özini raqamlar yiğindisi bilan çaqiradi.

Kiriş: manfiy bölmagan butun son (juda katta bölişi mumkin)
Çiqiş: raqamli ildiz

Eslatma: sikl bilan ham yeçiş mumkin, lekin bu masalaning maqsadi — rekursiyani maşq qiliş.',
 'functions', 'medium', ARRAY['python'],
 '{"python":"def raqamlar_yigindisi(n):\n    # Kodingizni yozing\n    pass\n\n\ndef raqamli_ildiz(n):\n    # Rekursiya: bazaviy holat va o''zini chaqirish\n    pass\n\n\nn = int(input())\nprint(raqamli_ildiz(n))\n"}'::jsonb,
 '[{"input":"9875","expected_output":"2","is_hidden":false},{"input":"0","expected_output":"0","is_hidden":false}]'::jsonb,
 '[{"input":"7","expected_output":"7","is_hidden":true},{"input":"10","expected_output":"1","is_hidden":true},{"input":"999999999999","expected_output":"9","is_hidden":true},{"input":"123456789123456789","expected_output":"9","is_hidden":true},{"input":"38","expected_output":"2","is_hidden":true}]'::jsonb,
 2000, 18, 55, ARRAY['funksiya', 'rekursiya'], true),

('Funksiyalar zanjiri', 'ch-fn-amallar-zanjiri',
 'Pythonʼda funksiya ham qiymat: uni luğatga soliş, özgaruvçiga beriş va boşqa funksiyaga uzatiş mumkin.

Uçta kiçik funksiya yozing:
- `ikki_barobar(x)` → x * 2
- `kvadrat(x)` → x * x
- `bir_qoshish(x)` → x + 1

Söng `zanjir(x, amallar)` funksiyasini yozing: u amallar nomlari röyxatini oladi va har birini x ga ketma-ket qöllaydi. Nomdan funksiyani topiş uçun `AMALLAR` luğatidan foydalaning (if-elif zanjirisiz).

Kiriş:
1-qator — boşlanğiç butun son x
2-qator — amallar nomlari böşliq bilan (böş bölişi mumkin)

Çiqiş: natija

Misol:
3
kvadrat bir_qoshish ikki_barobar
→ 3 → 9 → 10 → 20',
 'functions', 'hard', ARRAY['python'],
 '{"python":"def ikki_barobar(x):\n    pass\n\n\ndef kvadrat(x):\n    pass\n\n\ndef bir_qoshish(x):\n    pass\n\n\nAMALLAR = {\n    \"ikki_barobar\": ikki_barobar,\n    \"kvadrat\": kvadrat,\n    \"bir_qoshish\": bir_qoshish,\n}\n\n\ndef zanjir(x, amallar):\n    # Har bir nom bo''yicha AMALLAR dan funksiyani olib, x ga qo''llang\n    pass\n\n\nx = int(input())\ntry:\n    amallar = input().split()\nexcept EOFError:\n    amallar = []\nprint(zanjir(x, amallar))\n"}'::jsonb,
 '[{"input":"3\nkvadrat bir_qoshish ikki_barobar","expected_output":"20","is_hidden":false},{"input":"5\nbir_qoshish","expected_output":"6","is_hidden":false}]'::jsonb,
 '[{"input":"-4\nkvadrat kvadrat","expected_output":"256","is_hidden":true},{"input":"7\n","expected_output":"7","is_hidden":true},{"input":"0\nbir_qoshish ikki_barobar kvadrat bir_qoshish","expected_output":"5","is_hidden":true},{"input":"2\nkvadrat kvadrat kvadrat kvadrat","expected_output":"65536","is_hidden":true},{"input":"-1\nikki_barobar bir_qoshish kvadrat","expected_output":"1","is_hidden":true}]'::jsonb,
 2000, 30, 90, ARRAY['funksiya', 'yuqori tartibli funksiya', 'luğat'], true)

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
