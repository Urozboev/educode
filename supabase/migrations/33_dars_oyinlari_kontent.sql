-- ============================================
-- EduCode — "Dasturlash asoslari" fani uchun dars o'yinlari
--
-- 12 ta tayyor o'yin, fan dasturi mavzulariga bog'langan:
--   4 ta quiz_race   — Kahoot uslubidagi tezlik viktorinasi (jonli rejimda ham ishlaydi)
--   4 ta match_pairs — juftliklarni moslashtirish
--   2 ta jeopardy    — kategoriya x ball taxtasi
--   2 ta crossword   — krossvord (to'r oldindan hisoblangan)
--
-- Talab: 19_lesson_games.sql va 20_crossword.sql qo'llangan bo'lishi kerak,
-- shuningdek 27 va 29-migratsiyalardagi mavzular mavjud bo'lsin.
--
-- author_id NULL qoldirilgan — bu tizim tayyorlagan o'yinlar, ular barcha
-- o'qituvchilarga ko'rinadi (is_published = true).
-- Qayta ishga tushirilsa dublikat yaratmaydi.
-- ============================================

DO $$
DECLARE
  v_course UUID;
  t_sintaksis UUID; t_xato UUID; t_arifm UUID; t_ozgar UUID; t_matn UUID;
  t_royxat UUID; t_shart UUID; t_lugat UUID; t_while UUID; t_funk UUID;
  t_modul UUID; t_si UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-maruza';
  IF v_course IS NULL THEN
    RAISE EXCEPTION 'Kurs topilmadi: dasturlash-asoslari-maruza';
  END IF;

  SELECT id INTO t_sintaksis FROM topics WHERE course_id = v_course AND slug = 'python-sintaksis';
  SELECT id INTO t_xato      FROM topics WHERE course_id = v_course AND slug = 'python-xatoliklar';
  SELECT id INTO t_arifm     FROM topics WHERE course_id = v_course AND slug = 'arifmetik-amallar';
  SELECT id INTO t_ozgar     FROM topics WHERE course_id = v_course AND slug = 'ozgaruvchilar-va-turlar';
  SELECT id INTO t_matn      FROM topics WHERE course_id = v_course AND slug = 'matnlar-va-sonlar';
  SELECT id INTO t_royxat    FROM topics WHERE course_id = v_course AND slug = 'royxatlar-va-for';
  SELECT id INTO t_shart     FROM topics WHERE course_id = v_course AND slug = 'shartlar-va-tarmoqlanish';
  SELECT id INTO t_lugat     FROM topics WHERE course_id = v_course AND slug = 'lugat-va-toplam';
  SELECT id INTO t_while     FROM topics WHERE course_id = v_course AND slug = 'while-sikli';
  SELECT id INTO t_funk      FROM topics WHERE course_id = v_course AND slug = 'funksiyalar';
  SELECT id INTO t_modul     FROM topics WHERE course_id = v_course AND slug = 'modullar';
  SELECT id INTO t_si        FROM topics WHERE course_id = v_course AND slug = 'python-va-suniy-intellekt';

  IF t_sintaksis IS NULL OR t_funk IS NULL THEN
    RAISE EXCEPTION 'Mavzular topilmadi — avval 27 va 29-migratsiyalarni ishga tushiring';
  END IF;

  -- ============================================
  -- 1. QUIZ_RACE — Sintaksis poygasi
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Sintaksis poygasi', 'sintaksis-poygasi',
    'Python sintaksisi bo''yicha 8 savollik tezlik viktorinasi. 1-mavzuni mustahkamlash uchun.',
    'quiz_race',
    '{"questions":[
      {"text":"Pythonda kod bloklari nima orqali ajratiladi?","seconds":20,"options":[
        {"text":"Chekinish","correct":true},{"text":"Figurali qavs","correct":false},
        {"text":"Nuqtali vergul","correct":false},{"text":"begin va end","correct":false}]},
      {"text":"input() qanday turdagi qiymat qaytaradi?","seconds":20,"options":[
        {"text":"Matn (str)","correct":true},{"text":"Butun son (int)","correct":false},
        {"text":"Kasrli son (float)","correct":false},{"text":"Mantiqiy qiymat","correct":false}]},
      {"text":"print(\"5\" + \"3\") nima chiqaradi?","seconds":20,"options":[
        {"text":"53","correct":true},{"text":"8","correct":false},
        {"text":"5 3","correct":false},{"text":"Xato","correct":false}]},
      {"text":"print(\"a\",\"b\",sep=\"-\") nima chiqaradi?","seconds":20,"options":[
        {"text":"a-b","correct":true},{"text":"a b","correct":false},
        {"text":"ab","correct":false},{"text":"a - b","correct":false}]},
      {"text":"Chekinish uchun necha bo''shliq tavsiya etiladi?","seconds":15,"options":[
        {"text":"4","correct":true},{"text":"1","correct":false},
        {"text":"2","correct":false},{"text":"8","correct":false}]},
      {"text":"Qaysi fayl nomi to''g''ri?","seconds":20,"options":[
        {"text":"birinchi_dastur.py","correct":true},{"text":"1dastur.py","correct":false},
        {"text":"mening dasturim.py","correct":false},{"text":"dastur.txt","correct":false}]},
      {"text":"end parametri nima uchun kerak?","seconds":20,"options":[
        {"text":"print() dan keyin nima chiqishini belgilaydi","correct":true},
        {"text":"Dasturni tugatadi","correct":false},
        {"text":"Siklni to''xtatadi","correct":false},
        {"text":"Faylni yopadi","correct":false}]},
      {"text":"Chekinish noto''g''ri bo''lsa qanday xato chiqadi?","seconds":20,"options":[
        {"text":"IndentationError","correct":true},{"text":"NameError","correct":false},
        {"text":"TypeError","correct":false},{"text":"ValueError","correct":false}]}
    ]}'::jsonb,
    'programming', 'beginner', v_course, t_sintaksis, 5, 15, 1, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 2. QUIZ_RACE — Ro'yxatlar va sikllar poygasi
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Ro''yxatlar va sikllar poygasi', 'royxatlar-sikllar-poygasi',
    'Ro''yxat, tuple, range() va for sikli bo''yicha tezlik viktorinasi.',
    'quiz_race',
    '{"questions":[
      {"text":"list(range(2, 6)) nima qaytaradi?","seconds":25,"options":[
        {"text":"[2, 3, 4, 5]","correct":true},{"text":"[2, 3, 4, 5, 6]","correct":false},
        {"text":"[3, 4, 5]","correct":false},{"text":"[2, 6]","correct":false}]},
      {"text":"Ro''yxat oxiriga element qo''shuvchi metod qaysi?","seconds":20,"options":[
        {"text":"append()","correct":true},{"text":"add()","correct":false},
        {"text":"push()","correct":false},{"text":"insert()","correct":false}]},
      {"text":"Tuple va list farqi nimada?","seconds":25,"options":[
        {"text":"Tuple o''zgartirib bo''lmaydi","correct":true},
        {"text":"Tuple faqat sonlar saqlaydi","correct":false},
        {"text":"Tuple uzunligi cheklangan","correct":false},
        {"text":"Farqi yo''q","correct":false}]},
      {"text":"[0,1,2,3,4][1:4] nima qaytaradi?","seconds":25,"options":[
        {"text":"[1, 2, 3]","correct":true},{"text":"[1, 2, 3, 4]","correct":false},
        {"text":"[0, 1, 2, 3]","correct":false},{"text":"[2, 3]","correct":false}]},
      {"text":"[1,2,3][::-1] nima qaytaradi?","seconds":20,"options":[
        {"text":"[3, 2, 1]","correct":true},{"text":"[1, 2, 3]","correct":false},
        {"text":"[-1, -2, -3]","correct":false},{"text":"Xato","correct":false}]},
      {"text":"range(10, 0, -2) nechta son beradi?","seconds":25,"options":[
        {"text":"5","correct":true},{"text":"4","correct":false},
        {"text":"6","correct":false},{"text":"0","correct":false}]},
      {"text":"sort() va sorted() farqi nimada?","seconds":30,"options":[
        {"text":"sort() asl ro''yxatni o''zgartiradi, sorted() yangisini qaytaradi","correct":true},
        {"text":"Farqi yo''q","correct":false},
        {"text":"sorted() faqat sonlar uchun","correct":false},
        {"text":"sort() tezroq","correct":false}]},
      {"text":"b = a dan keyin b.append(4) qilinsa a o''zgaradimi?","seconds":25,"options":[
        {"text":"Ha, ikkalasi bitta ro''yxatga ishora qiladi","correct":true},
        {"text":"Yo''q, b nusxa","correct":false},
        {"text":"Faqat sonlar uchun o''zgaradi","correct":false},
        {"text":"Xato beradi","correct":false}]}
    ]}'::jsonb,
    'programming', 'beginner', v_course, t_royxat, 5, 15, 2, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 3. QUIZ_RACE — Shartlar va sikllar
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Shartlar poygasi', 'shartlar-poygasi',
    'Shart operatorlari, taqqoslash va mantiqiy amallar bo''yicha viktorina.',
    'quiz_race',
    '{"questions":[
      {"text":"Tenglikni tekshirish uchun qaysi operator?","seconds":15,"options":[
        {"text":"==","correct":true},{"text":"=","correct":false},
        {"text":"===","correct":false},{"text":"equals","correct":false}]},
      {"text":"and operatori qachon True qaytaradi?","seconds":20,"options":[
        {"text":"Ikkala shart ham rost bo''lsa","correct":true},
        {"text":"Kamida bittasi rost bo''lsa","correct":false},
        {"text":"Ikkalasi yolg''on bo''lsa","correct":false},
        {"text":"Har doim","correct":false}]},
      {"text":"0 <= x <= 100 nimani anglatadi?","seconds":25,"options":[
        {"text":"x 0 va 100 orasida, chegaralar kiradi","correct":true},
        {"text":"x 0 yoki 100 ga teng","correct":false},
        {"text":"Bu xato yozuv","correct":false},
        {"text":"x ikkalasidan katta","correct":false}]},
      {"text":"not (a > 5) nimaga teng?","seconds":25,"options":[
        {"text":"a <= 5","correct":true},{"text":"a < 5","correct":false},
        {"text":"a >= 5","correct":false},{"text":"a != 5","correct":false}]},
      {"text":"Pythonda qaysi qiymat yolg''on hisoblanadi?","seconds":20,"options":[
        {"text":"0","correct":true},{"text":"-1","correct":false},
        {"text":"1","correct":false},{"text":"\"0\"","correct":false}]},
      {"text":"elif o''rniga ketma-ket if yozilsa nima o''zgaradi?","seconds":30,"options":[
        {"text":"Barcha shartlar tekshiriladi, bir nechtasi bajarilishi mumkin","correct":true},
        {"text":"Hech nima","correct":false},
        {"text":"Xato beradi","correct":false},
        {"text":"Faqat oxirgisi bajariladi","correct":false}]},
      {"text":"if x = 5: qanday xato beradi?","seconds":20,"options":[
        {"text":"SyntaxError","correct":true},{"text":"NameError","correct":false},
        {"text":"TypeError","correct":false},{"text":"Xato bermaydi","correct":false}]},
      {"text":"Chegaraviy holat (masalan nol) qachon tekshiriladi?","seconds":20,"options":[
        {"text":"Eng boshida","correct":true},{"text":"Eng oxirida","correct":false},
        {"text":"O''rtada","correct":false},{"text":"Tekshirilmaydi","correct":false}]}
    ]}'::jsonb,
    'programming', 'beginner', v_course, t_shart, 5, 15, 3, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 4. QUIZ_RACE — Sun'iy intellekt
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Python va sun''iy intellekt viktorinasi', 'si-viktorina',
    'Mashinaviy o''qitish tushunchalari va Python kutubxonalari bo''yicha yakuniy viktorina.',
    'quiz_race',
    '{"questions":[
      {"text":"Mashinaviy o''qitishning an''anaviy dasturlashdan farqi nimada?","seconds":30,"options":[
        {"text":"Model qoidani misollardan o''zi topadi","correct":true},
        {"text":"Dasturchi barcha qoidalarni qo''lda yozadi","correct":false},
        {"text":"Ma''lumot kerak emas","correct":false},
        {"text":"Faqat C++ da yoziladi","correct":false}]},
      {"text":"Jadval ko''rinishidagi ma''lumotni tahlil qiluvchi kutubxona qaysi?","seconds":20,"options":[
        {"text":"pandas","correct":true},{"text":"random","correct":false},
        {"text":"datetime","correct":false},{"text":"turtle","correct":false}]},
      {"text":"Modelni o''qitish uchun qaysi metod chaqiriladi?","seconds":20,"options":[
        {"text":"fit()","correct":true},{"text":"predict()","correct":false},
        {"text":"learn()","correct":false},{"text":"train_model()","correct":false}]},
      {"text":"Label (nishon) nima?","seconds":25,"options":[
        {"text":"Model bashorat qilishi kerak bo''lgan javob","correct":true},
        {"text":"Kirish belgisi","correct":false},
        {"text":"Fayl nomi","correct":false},
        {"text":"Model nomi","correct":false}]},
      {"text":"Sonli massivlar bilan tez ishlash uchun qaysi kutubxona?","seconds":20,"options":[
        {"text":"NumPy","correct":true},{"text":"matplotlib","correct":false},
        {"text":"math","correct":false},{"text":"json","correct":false}]},
      {"text":"To''g''ri javoblar ma''lum bo''lgan o''qitish turi qanday ataladi?","seconds":25,"options":[
        {"text":"Nazorat ostida o''qitish","correct":true},
        {"text":"Nazoratsiz o''qitish","correct":false},
        {"text":"Mustahkamlab o''qitish","correct":false},
        {"text":"Chuqur o''qitish","correct":false}]},
      {"text":"Ma''lumot nima uchun train va test qismlarga ajratiladi?","seconds":30,"options":[
        {"text":"Model ko''rmagan ma''lumotdagi sifatini o''lchash uchun","correct":true},
        {"text":"Xotirani tejash uchun","correct":false},
        {"text":"O''qitishni tezlashtirish uchun","correct":false},
        {"text":"Bu majburiy emas","correct":false}]},
      {"text":"Model natijasiga qanday yondashish to''g''ri?","seconds":25,"options":[
        {"text":"Tekshirilishi kerak bo''lgan taxmin sifatida","correct":true},
        {"text":"Har doim to''g''ri deb qabul qilish","correct":false},
        {"text":"Butunlay e''tiborsiz qoldirish","correct":false},
        {"text":"Faqat sonli natijalarga ishonish","correct":false}]}
    ]}'::jsonb,
    'programming', 'intermediate', v_course, t_si, 5, 15, 4, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 5. MATCH_PAIRS — Xatolar va sabablari
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Xatolar va sabablari', 'xatolar-va-sabablari',
    'Har bir xato turini uni keltirib chiqaradigan holat bilan moslashtiring.',
    'match_pairs',
    '{"pairs":[
      {"left":"SyntaxError","right":"if x > 5 — ikki nuqta qo''yilmagan"},
      {"left":"IndentationError","right":"Blok ichidagi qator chekinmagan"},
      {"left":"NameError","right":"Yaratilmagan o''zgaruvchiga murojaat"},
      {"left":"TypeError","right":"\"5\" + 5 — matn va son qo''shilgan"},
      {"left":"ValueError","right":"int(\"salom\") — qiymat songa aylanmaydi"},
      {"left":"ZeroDivisionError","right":"10 / 0"},
      {"left":"IndexError","right":"[1,2,3][5] — ro''yxatda yo''q indeks"},
      {"left":"KeyError","right":"Lug''atda mavjud bo''lmagan kalit"}
    ]}'::jsonb,
    'programming', 'beginner', v_course, t_xato, 5, 15, 5, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 6. MATCH_PAIRS — Arifmetik amallar
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Amallar va natijalari', 'amallar-va-natijalari',
    'Arifmetik ifodani uning natijasi bilan moslashtiring.',
    'match_pairs',
    '{"pairs":[
      {"left":"7 + 2","right":"9"},
      {"left":"7 / 2","right":"3.5"},
      {"left":"7 // 2","right":"3"},
      {"left":"7 % 2","right":"1"},
      {"left":"7 ** 2","right":"49"},
      {"left":"2 ** 3 ** 2","right":"512"},
      {"left":"2 + 3 * 4","right":"14"},
      {"left":"16 ** 0.5","right":"4.0"}
    ]}'::jsonb,
    'programming', 'beginner', v_course, t_arifm, 5, 15, 6, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 7. MATCH_PAIRS — Matn metodlari
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Matn metodlari', 'matn-metodlari',
    'Matn metodini uning vazifasi bilan moslashtiring.',
    'match_pairs',
    '{"pairs":[
      {"left":"upper()","right":"Barcha harflarni bosh harfga o''tkazadi"},
      {"left":"title()","right":"Har so''zning birinchi harfini bosh harf qiladi"},
      {"left":"strip()","right":"Chetdagi bo''shliqlarni olib tashlaydi"},
      {"left":"split()","right":"Matnni bo''laklarga ajratib ro''yxat qaytaradi"},
      {"left":"join()","right":"Ro''yxat elementlarini bitta matnga birlashtiradi"},
      {"left":"replace()","right":"Belgilangan qismni boshqasiga almashtiradi"},
      {"left":"count()","right":"Belgi yoki so''z necha marta uchraganini sanaydi"},
      {"left":"len()","right":"Belgilar sonini qaytaradi"}
    ]}'::jsonb,
    'programming', 'beginner', v_course, t_matn, 5, 15, 7, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 8. MATCH_PAIRS — Modullar va funksiyalari
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Modullar va funksiyalari', 'modullar-va-funksiyalari',
    'Har bir funksiyani u tegishli bo''lgan modul yoki vazifa bilan moslashtiring.',
    'match_pairs',
    '{"pairs":[
      {"left":"math.sqrt(25)","right":"5.0 — kvadrat ildiz"},
      {"left":"math.ceil(4.1)","right":"5 — yuqoriga yaxlitlash"},
      {"left":"math.floor(4.9)","right":"4 — pastga yaxlitlash"},
      {"left":"math.gcd(12, 18)","right":"6 — eng katta umumiy bo''luvchi"},
      {"left":"random.randint(1, 6)","right":"1 dan 6 gacha tasodifiy butun son"},
      {"left":"random.shuffle(a)","right":"Ro''yxatni aralashtiradi"},
      {"left":"date.today()","right":"Bugungi sanani qaytaradi"},
      {"left":"pip install","right":"Tashqi kutubxonani o''rnatadi"}
    ]}'::jsonb,
    'programming', 'intermediate', v_course, t_modul, 5, 15, 8, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 9. JEOPARDY — Dasturlash asoslari
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Dasturlash asoslari: taxta o''yini', 'dasturlash-asoslari-jeopardy',
    'To''rt kategoriya, har birida 5 ta savol. Guruhlarga bo''linib o''ynash uchun.',
    'jeopardy',
    '{"categories":[
      {"name":"Sintaksis","cells":[
        {"value":100,"question":"Ekranga matn chiqaradigan funksiya","answer":"print()"},
        {"value":200,"question":"Foydalanuvchidan ma''lumot oladigan funksiya","answer":"input()"},
        {"value":300,"question":"Pythonda blok chegarasini belgilaydigan narsa","answer":"Chekinish (indentation)"},
        {"value":400,"question":"print() da ajratuvchini o''zgartiradigan parametr","answer":"sep"},
        {"value":500,"question":"Izoh yozish uchun ishlatiladigan belgi","answer":"# (panjara)"}]},
      {"name":"Ma''lumot turlari","cells":[
        {"value":100,"question":"Butun sonlar turining nomi","answer":"int"},
        {"value":200,"question":"3.14 qaysi turga tegishli","answer":"float"},
        {"value":300,"question":"True va False qaysi turga tegishli","answer":"bool"},
        {"value":400,"question":"O''zgaruvchi turini aniqlaydigan funksiya","answer":"type()"},
        {"value":500,"question":"int(3.99) natijasi","answer":"3 — kasr qismi tashlanadi"}]},
      {"name":"Sikllar","cells":[
        {"value":100,"question":"Ro''yxat bo''ylab yurish uchun ishlatiladigan sikl","answer":"for"},
        {"value":200,"question":"Takrorlar soni noma''lum bo''lganda ishlatiladigan sikl","answer":"while"},
        {"value":300,"question":"Siklni darhol to''xtatadigan operator","answer":"break"},
        {"value":400,"question":"range(1, 5) nechta son beradi","answer":"4 ta: 1, 2, 3, 4"},
        {"value":500,"question":"Joriy aylanishni o''tkazib yuboradigan operator","answer":"continue"}]},
      {"name":"Funksiyalar","cells":[
        {"value":100,"question":"Funksiya e''lon qilinadigan kalit so''z","answer":"def"},
        {"value":200,"question":"Funksiyadan qiymat qaytaradigan kalit so''z","answer":"return"},
        {"value":300,"question":"return yozilmagan funksiya nima qaytaradi","answer":"None"},
        {"value":400,"question":"Funksiya ichida yaratilgan o''zgaruvchi qanday ataladi","answer":"Lokal o''zgaruvchi"},
        {"value":500,"question":"def f(a, b=10) da b qanday parametr","answer":"Sukut qiymatli parametr"}]}
    ]}'::jsonb,
    'programming', 'beginner', v_course, NULL, 8, 25, 9, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 10. JEOPARDY — Ma'lumot tuzilmalari
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Ma''lumot tuzilmalari taxtasi', 'malumot-tuzilmalari-jeopardy',
    'Ro''yxat, tuple, lug''at va to''plam bo''yicha uch kategoriyali taxta o''yini.',
    'jeopardy',
    '{"categories":[
      {"name":"Ro''yxat","cells":[
        {"value":100,"question":"Ro''yxat qanday qavsda yoziladi","answer":"Kvadrat qavs [ ]"},
        {"value":200,"question":"Oxiriga element qo''shadigan metod","answer":"append()"},
        {"value":300,"question":"a[1:4] nechta element beradi","answer":"3 ta — 1, 2, 3-indekslar"},
        {"value":400,"question":"a[::-1] nima qiladi","answer":"Ro''yxatni teskari qaytaradi"},
        {"value":500,"question":"b = a nusxa oladimi","answer":"Yo''q — ikkalasi bitta ro''yxatga ishora qiladi"}]},
      {"name":"Lug''at","cells":[
        {"value":100,"question":"Lug''at qanday qavsda yoziladi","answer":"Figurali qavs { }"},
        {"value":200,"question":"Mavjud bo''lmagan kalitga murojaat qanday xato beradi","answer":"KeyError"},
        {"value":300,"question":"Xatosiz o''qish uchun ishlatiladigan metod","answer":"get()"},
        {"value":400,"question":"Kalit va qiymatni birdan beradigan metod","answer":"items()"},
        {"value":500,"question":"Lug''atdagi juftliklar soni qanday bilinadi","answer":"len() bilan"}]},
      {"name":"To''plam","cells":[
        {"value":100,"question":"To''plamning asosiy xususiyati","answer":"Takrorlarni saqlamaydi"},
        {"value":200,"question":"Bo''sh to''plam qanday yaratiladi","answer":"set() bilan — { } lug''at yaratadi"},
        {"value":300,"question":"a & b amali nima beradi","answer":"Kesishma — ikkalasida ham bor elementlar"},
        {"value":400,"question":"a | b amali nima beradi","answer":"Birlashma"},
        {"value":500,"question":"Ro''yxatdagi takrorlarni yo''qotishning eng qisqa yo''li","answer":"list(set(royxat))"}]}
    ]}'::jsonb,
    'programming', 'intermediate', v_course, t_lugat, 8, 25, 10, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 11. CROSSWORD — Python atamalari
  -- To'r src/lib/crossword.ts algoritmi bilan oldindan hisoblangan
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Python atamalari krossvordi', 'python-atamalari-krossvord',
    'Dasturlash asoslarining 10 ta asosiy atamasi. Kirish mavzularini takrorlash uchun.',
    'crossword',
    '{"rows":13,"cols":15,"words":[{"answer":"LUGAT","clue":"Kalit va qiymat juftliklaridan iborat tuzilma","row":0,"col":2,"dir":"down","num":1},{"answer":"ROYXAT","clue":"Kvadrat qavsda yoziladigan tartibli elementlar to''plami","row":1,"col":0,"dir":"down","num":2},{"answer":"FUNKSIYA","clue":"Nom berilgan, kerak bo''lganda chaqiriladigan kod bo''lagi","row":1,"col":5,"dir":"down","num":3},{"answer":"SINTAKSIS","clue":"Dasturlash tilining grammatikasi, kod yozish qoidalari","row":1,"col":9,"dir":"down","num":4},{"answer":"SIKL","clue":"Amallarni takrorlash tuzilmasi","row":1,"col":9,"dir":"across","num":4},{"answer":"OZGARUVCHI","clue":"Qiymat saqlanadigan nomlangan joy","row":2,"col":0,"dir":"across","num":5},{"answer":"CHEKINISH","clue":"Blok chegarasini belgilaydigan bo''shliqlar","row":2,"col":7,"dir":"down","num":6},{"answer":"QOLDIQ","clue":"Foiz (%) amali beradigan natija","row":5,"col":11,"dir":"down","num":7},{"answer":"INDEKS","clue":"Element tartib raqami, 0 dan boshlanadi","row":8,"col":9,"dir":"across","num":8},{"answer":"KALIT","clue":"Lug''atda qiymatga murojaat qilish uchun ishlatiladigan nom","row":8,"col":13,"dir":"down","num":9}]}'::jsonb,
    'programming', 'beginner', v_course, t_ozgar, 8, 25, 11, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

  -- ============================================
  -- 12. CROSSWORD — Sikllar va funksiyalar
  -- ============================================
  INSERT INTO lesson_games (title, slug, description, type, content, category, difficulty, course_id, topic_id, coin_reward, xp_reward, order_index, is_published)
  VALUES ('Sikllar va funksiyalar krossvordi', 'sikllar-funksiyalar-krossvord',
    'Sikl operatorlari va funksiya tushunchalari bo''yicha 10 ta so''zli krossvord.',
    'crossword',
    '{"rows":12,"cols":13,"words":[{"answer":"CONTINUE","clue":"Joriy aylanishni o''tkazib, keyingisiga o''tadi","row":0,"col":10,"dir":"down","num":1},{"answer":"TUPLE","clue":"O''zgarmas ro''yxat","row":1,"col":1,"dir":"down","num":2},{"answer":"PARAMETR","clue":"Funksiya e''lonidagi nom","row":1,"col":4,"dir":"down","num":3},{"answer":"ARGUMENT","clue":"Funksiyani chaqirishda beriladigan haqiqiy qiymat","row":2,"col":4,"dir":"across","num":4},{"answer":"GLOBAL","clue":"Funksiya tashqarisida yaratilgan o''zgaruvchi turi","row":4,"col":0,"dir":"across","num":5},{"answer":"WHILE","clue":"Shart rost bo''lgani sari takrorlaydigan sikl","row":4,"col":8,"dir":"across","num":6},{"answer":"BREAK","clue":"Siklni darhol to''xtatadi","row":6,"col":2,"dir":"across","num":7},{"answer":"DARAJA","clue":"Ikki yulduzcha (**) bilan belgilanadigan amal","row":6,"col":8,"dir":"down","num":8},{"answer":"RETURN","clue":"Funksiyadan qiymat qaytaruvchi kalit so''z","row":8,"col":4,"dir":"across","num":9},{"answer":"RANGE","clue":"Sonlar ketma-ketligini hosil qiluvchi funksiya","row":11,"col":7,"dir":"across","num":10}]}'::jsonb,
    'programming', 'intermediate', v_course, t_funk, 8, 25, 12, true)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content,
    course_id = EXCLUDED.course_id, topic_id = EXCLUDED.topic_id,
    order_index = EXCLUDED.order_index, is_published = true, updated_at = now();

END $$;
