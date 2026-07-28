-- ============================================
-- EduCode — Ma'ruza kursi 1-6 mavzular uchun testlar va topshiriqlar
-- 27_maruza_mavzular_1_6.sql dan KEYIN ishga tushiring.
--
-- Topshiriqlar stdin → stdout: dastur input() bilan o'qiydi,
-- print() bilan chiqaradi.
--
-- Qayta ishga tushirilsa avvalgi test/topshiriqlar o'chirilib,
-- qaytadan yoziladi (dublikat bo'lmaydi).
-- ============================================

DO $$
DECLARE
  v_course UUID;
  t_sintaksis UUID; t_xato UUID; t_arifm UUID;
  t_ozgar UUID; t_matn UUID; t_royxat UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-maruza';

  SELECT id INTO t_sintaksis FROM topics WHERE course_id = v_course AND slug = 'python-sintaksis';
  SELECT id INTO t_xato      FROM topics WHERE course_id = v_course AND slug = 'python-xatoliklar';
  SELECT id INTO t_arifm     FROM topics WHERE course_id = v_course AND slug = 'arifmetik-amallar';
  SELECT id INTO t_ozgar     FROM topics WHERE course_id = v_course AND slug = 'ozgaruvchilar-va-turlar';
  SELECT id INTO t_matn      FROM topics WHERE course_id = v_course AND slug = 'matnlar-va-sonlar';
  SELECT id INTO t_royxat    FROM topics WHERE course_id = v_course AND slug = 'royxatlar-va-for';

  IF t_sintaksis IS NULL THEN
    RAISE EXCEPTION 'Mavzular topilmadi — avval 27_maruza_mavzular_1_6.sql ni ishga tushiring';
  END IF;

  -- Qayta yozish uchun eskilarini tozalaymiz
  DELETE FROM quizzes WHERE topic_id IN (t_sintaksis, t_xato, t_arifm, t_ozgar, t_matn, t_royxat);
  DELETE FROM topic_tasks WHERE topic_id IN (t_sintaksis, t_xato, t_arifm, t_ozgar, t_matn, t_royxat);

  -- ============================================
  -- 1-MAVZU TESTLARI: Sintaksis
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_sintaksis, 'Pythonda kod bloklari nima orqali ajratiladi?', 'single',
   '[{"id":"a","text":"Figurali qavslar { }","is_correct":false},
     {"id":"b","text":"Chekinish (bo''shliqlar)","is_correct":true},
     {"id":"c","text":"Nuqtali vergul ;","is_correct":false},
     {"id":"d","text":"begin va end so''zlari","is_correct":false}]'::jsonb,
   'Pythonning o''ziga xos xususiyati — blok chegarasi chekinish bilan belgilanadi. Odatda 4 ta bo''shliq ishlatiladi.', 1, 0),

  (t_sintaksis, 'input() funksiyasi qanday turdagi qiymat qaytaradi?', 'single',
   '[{"id":"a","text":"Har doim matn (str)","is_correct":true},
     {"id":"b","text":"Kiritilgan qiymatga qarab son yoki matn","is_correct":false},
     {"id":"c","text":"Har doim butun son (int)","is_correct":false},
     {"id":"d","text":"Mantiqiy qiymat (bool)","is_correct":false}]'::jsonb,
   'input() har doim matn qaytaradi. Son kerak bo''lsa int() yoki float() bilan aylantirish shart.', 1, 1),

  (t_sintaksis, 'Quyidagi kod nima chiqaradi?<br><code>print("a", "b", sep="-")</code>', 'single',
   '[{"id":"a","text":"a b","is_correct":false},
     {"id":"b","text":"a-b","is_correct":true},
     {"id":"c","text":"a - b","is_correct":false},
     {"id":"d","text":"ab","is_correct":false}]'::jsonb,
   'sep parametri qiymatlar orasidagi ajratuvchini belgilaydi. Sukut bo''yicha u bo''shliq.', 1, 2),

  (t_sintaksis, 'Qaysi fayl nomlari Python uchun to''g''ri?', 'multiple',
   '[{"id":"a","text":"birinchi_dastur.py","is_correct":true},
     {"id":"b","text":"1dastur.py","is_correct":false},
     {"id":"c","text":"hisob2.py","is_correct":true},
     {"id":"d","text":"mening dasturim.py","is_correct":false}]'::jsonb,
   'Fayl nomi raqam bilan boshlanmasligi va bo''shliq bo''lmasligi kerak.', 2, 3),

  (t_sintaksis, 'Quyidagilardan qaysi biri Python kalit so''zi EMAS?', 'single',
   '[{"id":"a","text":"if","is_correct":false},
     {"id":"b","text":"for","is_correct":false},
     {"id":"c","text":"print","is_correct":true},
     {"id":"d","text":"return","is_correct":false}]'::jsonb,
   'print — kalit so''z emas, balki o''rnatilgan funksiya. Shuning uchun uni o''zgaruvchi nomi sifatida ishlatish texnik jihatdan mumkin, lekin tavsiya etilmaydi.', 1, 4),

  (t_sintaksis, 'Bu kod nima chiqaradi?<br><code>print("5" + "3")</code>', 'single',
   '[{"id":"a","text":"8","is_correct":false},
     {"id":"b","text":"53","is_correct":true},
     {"id":"c","text":"Xato beradi","is_correct":false},
     {"id":"d","text":"5 3","is_correct":false}]'::jsonb,
   'Ikkalasi ham matn, shuning uchun + amali ularni birlashtiradi. Sonlar qo''shilishi uchun tirnoqsiz yozilishi kerak edi.', 1, 5),

  (t_sintaksis, 'end parametri nima uchun ishlatiladi?', 'single',
   '[{"id":"a","text":"Dasturni tugatish uchun","is_correct":false},
     {"id":"b","text":"print() dan keyin nima chiqishini belgilash uchun","is_correct":true},
     {"id":"c","text":"Faylni yopish uchun","is_correct":false},
     {"id":"d","text":"Siklni to''xtatish uchun","is_correct":false}]'::jsonb,
   'Sukut bo''yicha print() oxirida yangi qatorga o''tadi. end=" " berilsa, o''rniga bo''shliq qo''yiladi.', 1, 6),

  (t_sintaksis, 'Chekinish noto''g''ri bo''lsa qanday xato chiqadi?', 'single',
   '[{"id":"a","text":"NameError","is_correct":false},
     {"id":"b","text":"TypeError","is_correct":false},
     {"id":"c","text":"IndentationError","is_correct":true},
     {"id":"d","text":"ValueError","is_correct":false}]'::jsonb,
   'IndentationError — chekinish bilan bog''liq xato. U SyntaxError ning bir turi.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_sintaksis, 'Salomlashish',
   'Foydalanuvchidan ism kiriting va ekranga "Salom, <ism>!" ko''rinishida chiqaring. Undov belgisini unutmang.',
   'ism = input()
# Kodingizni shu yerga yozing',
   'ism = input()
print(f"Salom, {ism}!")',
   'python',
   '[{"input":"Ali","expected_output":"Salom, Ali!","is_hidden":false},
     {"input":"Dilnoza","expected_output":"Salom, Dilnoza!","is_hidden":false},
     {"input":"Bekzod","expected_output":"Salom, Bekzod!","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"input() bilan o''qing, natijani o''zgaruvchiga saqlang"},
     {"order":2,"text":"f-string ishlating: f\"Salom, {ism}!\""}]'::jsonb,
   'easy', 5, 15, 0),

  (t_sintaksis, 'Ikki qatorli tanishtiruv',
   'Ikki qator kiritiladi: birinchisi ism, ikkinchisi yosh. Ularni quyidagi ko''rinishda chiqaring:<br><code>Ism: Ali</code><br><code>Yosh: 19</code>',
   'ism = input()
yosh = input()
# Kodingizni shu yerga yozing',
   'ism = input()
yosh = input()
print(f"Ism: {ism}")
print(f"Yosh: {yosh}")',
   'python',
   '[{"input":"Ali\n19","expected_output":"Ism: Ali\nYosh: 19","is_hidden":false},
     {"input":"Dilnoza\n20","expected_output":"Ism: Dilnoza\nYosh: 20","is_hidden":false}]'::jsonb,
   '[{"order":1,"text":"Har bir qator uchun alohida input() chaqiring"},
     {"order":2,"text":"Ikkita print() ishlating"}]'::jsonb,
   'easy', 5, 15, 1);

  -- ============================================
  -- 2-MAVZU TESTLARI: Xatoliklar
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_xato, 'Dastur ishlaydi, xato bermaydi, lekin natija noto''g''ri. Bu qanday xato?', 'single',
   '[{"id":"a","text":"Sintaksis xatosi","is_correct":false},
     {"id":"b","text":"Mantiqiy xato","is_correct":true},
     {"id":"c","text":"Bajarilish xatosi","is_correct":false},
     {"id":"d","text":"Bu xato emas","is_correct":false}]'::jsonb,
   'Mantiqiy xato eng xavflisi: Python hech narsa demaydi, chunki u aytilgan ishni bajardi. Xato bizning yozganimizda.', 1, 0),

  (t_xato, '<code>int("salom")</code> qanday xato beradi?', 'single',
   '[{"id":"a","text":"TypeError","is_correct":false},
     {"id":"b","text":"NameError","is_correct":false},
     {"id":"c","text":"ValueError","is_correct":true},
     {"id":"d","text":"SyntaxError","is_correct":false}]'::jsonb,
   'Tur to''g''ri (matn berilishi mumkin), lekin qiymat noto''g''ri — "salom" ni songa aylantirib bo''lmaydi. Shuning uchun ValueError.', 1, 1),

  (t_xato, 'Xato xabarini qaysi tartibda o''qish qulay?', 'single',
   '[{"id":"a","text":"Yuqoridan pastga","is_correct":false},
     {"id":"b","text":"Pastdan yuqoriga","is_correct":true},
     {"id":"c","text":"Faqat birinchi qatorni","is_correct":false},
     {"id":"d","text":"Tartibi ahamiyatsiz","is_correct":false}]'::jsonb,
   'Oxirgi qatorda xato turi va sababi yoziladi — eng muhim ma''lumot shu yerda. Yuqoriga qarab kelib chiqishni kuzatish mumkin.', 1, 2),

  (t_xato, 'Quyidagi kodda qanday xato bor?<br><code>if x > 5<br>&nbsp;&nbsp;&nbsp;&nbsp;print("katta")</code>', 'single',
   '[{"id":"a","text":"Ikki nuqta qo''yilmagan","is_correct":true},
     {"id":"b","text":"Chekinish noto''g''ri","is_correct":false},
     {"id":"c","text":"x aniqlanmagan","is_correct":false},
     {"id":"d","text":"Xato yo''q","is_correct":false}]'::jsonb,
   'if shartidan keyin ikki nuqta shart: if x > 5:', 1, 3),

  (t_xato, 'Qaysi holatlarda NameError chiqadi?', 'multiple',
   '[{"id":"a","text":"O''zgaruvchi yaratilmasdan ishlatilsa","is_correct":true},
     {"id":"b","text":"O''zgaruvchi nomi noto''g''ri yozilsa","is_correct":true},
     {"id":"c","text":"Nolga bo''linsa","is_correct":false},
     {"id":"d","text":"Ro''yxatda yo''q indeksga murojaat qilinsa","is_correct":false}]'::jsonb,
   'NameError — Python bunday nomni topa olmadi. Nolga bo''lish ZeroDivisionError, noto''g''ri indeks IndexError beradi.', 2, 4),

  (t_xato, '<code>"5" + 5</code> ifodasi qanday xato beradi?', 'single',
   '[{"id":"a","text":"ValueError","is_correct":false},
     {"id":"b","text":"TypeError","is_correct":true},
     {"id":"c","text":"SyntaxError","is_correct":false},
     {"id":"d","text":"Xato bermaydi, 10 chiqadi","is_correct":false}]'::jsonb,
   'Matn va sonni qo''shib bo''lmaydi — turlari mos emas. Bu TypeError.', 1, 5),

  (t_xato, 'O''rtacha qiymatni topish uchun qaysi yozuv to''g''ri?', 'single',
   '[{"id":"a","text":"a + b / 2","is_correct":false},
     {"id":"b","text":"(a + b) / 2","is_correct":true},
     {"id":"c","text":"a + b // 2","is_correct":false},
     {"id":"d","text":"a / 2 + b","is_correct":false}]'::jsonb,
   'Qavssiz yozilsa avval b/2 hisoblanadi — bu mantiqiy xato. Qavs amallar tartibini to''g''rilaydi.', 1, 6),

  (t_xato, 'Xatoni topishning eng oddiy usuli qaysi?', 'single',
   '[{"id":"a","text":"Kodni qaytadan yozish","is_correct":false},
     {"id":"b","text":"Shubhali joyda print() bilan qiymatni tekshirish","is_correct":true},
     {"id":"c","text":"Boshqa dasturlash tiliga o''tish","is_correct":false},
     {"id":"d","text":"Xatoni e''tiborsiz qoldirish","is_correct":false}]'::jsonb,
   'print() bilan tekshirish — eng sodda va samarali usul. U o''zgaruvchi qiymati kutilganidek ekanini darhol ko''rsatadi.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_xato, 'Xatoni tuzating: o''rtacha qiymat',
   'Quyidagi kod ikki sonning o''rtachasini topishi kerak, lekin mantiqiy xato bor. Uni toping va tuzating.<br>Ikki qator kiritiladi — har birida bitta son.',
   'a = int(input())
b = int(input())
ortacha = a + b / 2
print(ortacha)',
   'a = int(input())
b = int(input())
ortacha = (a + b) / 2
print(ortacha)',
   'python',
   '[{"input":"10\n20","expected_output":"15.0","is_hidden":false},
     {"input":"4\n6","expected_output":"5.0","is_hidden":false},
     {"input":"7\n7","expected_output":"7.0","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Amallar tartibini eslang: bo''lish qo''shishdan oldin bajariladi"},
     {"order":2,"text":"Qavs qo''ying: (a + b) / 2"}]'::jsonb,
   'easy', 5, 15, 0),

  (t_xato, 'Nolga bo''lishdan himoya',
   'Ikki son kiritiladi. Birinchisini ikkinchisiga bo''lgan natijani chiqaring. Agar ikkinchi son 0 bo''lsa, <code>Nolga bo''lib bo''lmaydi</code> deb yozing.',
   'a = int(input())
b = int(input())
# Kodingizni shu yerga yozing',
   'a = int(input())
b = int(input())
if b == 0:
    print("Nolga bo''lib bo''lmaydi")
else:
    print(a / b)',
   'python',
   '[{"input":"10\n2","expected_output":"5.0","is_hidden":false},
     {"input":"7\n0","expected_output":"Nolga bo''lib bo''lmaydi","is_hidden":false},
     {"input":"9\n3","expected_output":"3.0","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Bo''lishdan OLDIN b ning qiymatini tekshiring"},
     {"order":2,"text":"if b == 0: ... else: ..."}]'::jsonb,
   'easy', 5, 15, 1);

  -- ============================================
  -- 3-MAVZU TESTLARI: Arifmetik amallar
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_arifm, '<code>7 // 2</code> natijasi nima?', 'single',
   '[{"id":"a","text":"3.5","is_correct":false},
     {"id":"b","text":"3","is_correct":true},
     {"id":"c","text":"4","is_correct":false},
     {"id":"d","text":"1","is_correct":false}]'::jsonb,
   '// — butun bo''lish. Kasr qismi tashlanadi, yaxlitlanmaydi.', 1, 0),

  (t_arifm, '<code>7 % 3</code> natijasi nima?', 'single',
   '[{"id":"a","text":"2","is_correct":false},
     {"id":"b","text":"1","is_correct":true},
     {"id":"c","text":"2.33","is_correct":false},
     {"id":"d","text":"0","is_correct":false}]'::jsonb,
   '% — qoldiq. 7 ni 3 ga bo''lganda butun qism 2, qoldiq 1.', 1, 1),

  (t_arifm, '<code>10 / 2</code> natijasi qanday turda bo''ladi?', 'single',
   '[{"id":"a","text":"int — 5","is_correct":false},
     {"id":"b","text":"float — 5.0","is_correct":true},
     {"id":"c","text":"str — \"5\"","is_correct":false},
     {"id":"d","text":"bool","is_correct":false}]'::jsonb,
   '/ amali har doim float qaytaradi, hatto qoldiqsiz bo''linsa ham.', 1, 2),

  (t_arifm, '<code>2 + 3 * 4</code> natijasi nima?', 'single',
   '[{"id":"a","text":"20","is_correct":false},
     {"id":"b","text":"14","is_correct":true},
     {"id":"c","text":"24","is_correct":false},
     {"id":"d","text":"9","is_correct":false}]'::jsonb,
   'Ko''paytirish qo''shishdan oldin bajariladi: 3*4=12, keyin 2+12=14.', 1, 3),

  (t_arifm, 'Kvadrat ildizni qanday hisoblash mumkin?', 'multiple',
   '[{"id":"a","text":"16 ** 0.5","is_correct":true},
     {"id":"b","text":"math.sqrt(16)","is_correct":true},
     {"id":"c","text":"16 // 2","is_correct":false},
     {"id":"d","text":"sqrt(16)","is_correct":false}]'::jsonb,
   'Kasr daraja yoki math.sqrt() ishlatiladi. sqrt() ni to''g''ridan-to''g''ri chaqirib bo''lmaydi — math moduli kerak.', 2, 4),

  (t_arifm, 'Sonning juftligini qanday tekshiramiz?', 'single',
   '[{"id":"a","text":"son / 2 == 0","is_correct":false},
     {"id":"b","text":"son % 2 == 0","is_correct":true},
     {"id":"c","text":"son // 2 == 0","is_correct":false},
     {"id":"d","text":"son ** 2 == 0","is_correct":false}]'::jsonb,
   'Juft son 2 ga qoldiqsiz bo''linadi, ya''ni qoldiq 0 bo''ladi.', 1, 5),

  (t_arifm, 'Izoh haqida qaysi fikr to''g''ri?', 'single',
   '[{"id":"a","text":"Izoh dastur tezligini oshiradi","is_correct":false},
     {"id":"b","text":"Python izohni o''qimaydi, u faqat odam uchun","is_correct":true},
     {"id":"c","text":"Izohsiz dastur ishlamaydi","is_correct":false},
     {"id":"d","text":"Izoh faqat fayl boshida yoziladi","is_correct":false}]'::jsonb,
   'Izoh kompilyatsiyaga ta''sir qilmaydi. U kodni keyin o''qiydigan odam uchun yoziladi.', 1, 6),

  (t_arifm, '<code>2 ** 3 ** 2</code> natijasi nima?', 'single',
   '[{"id":"a","text":"64","is_correct":false},
     {"id":"b","text":"512","is_correct":true},
     {"id":"c","text":"36","is_correct":false},
     {"id":"d","text":"12","is_correct":false}]'::jsonb,
   'Daraja o''ngdan chapga hisoblanadi: 2**(3**2) = 2**9 = 512.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_arifm, 'To''rtta amal',
   'Ikki butun son kiritiladi. Ularning yig''indisi, ayirmasi, ko''paytmasi va bo''linmasini har birini alohida qatorda chiqaring.',
   'a = int(input())
b = int(input())
# Kodingizni shu yerga yozing',
   'a = int(input())
b = int(input())
print(a + b)
print(a - b)
print(a * b)
print(a / b)',
   'python',
   '[{"input":"10\n5","expected_output":"15\n5\n50\n2.0","is_hidden":false},
     {"input":"7\n2","expected_output":"9\n5\n14\n3.5","is_hidden":false},
     {"input":"20\n4","expected_output":"24\n16\n80\n5.0","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Har bir amal uchun alohida print() yozing"},
     {"order":2,"text":"Bo''lishda / ishlating — natija kasrli chiqadi"}]'::jsonb,
   'easy', 5, 15, 0),

  (t_arifm, 'Doira yuzasi va aylanasi',
   'Doira radiusi (butun son) kiritiladi. Uning yuzasi va aylana uzunligini 2 xonagacha yaxlitlab chiqaring. π uchun <code>math.pi</code> ishlating.<br>Birinchi qatorda yuza, ikkinchisida aylana uzunligi.',
   'import math
r = int(input())
# Kodingizni shu yerga yozing',
   'import math
r = int(input())
print(f"{math.pi * r ** 2:.2f}")
print(f"{2 * math.pi * r:.2f}")',
   'python',
   '[{"input":"5","expected_output":"78.54\n31.42","is_hidden":false},
     {"input":"1","expected_output":"3.14\n6.28","is_hidden":false},
     {"input":"10","expected_output":"314.16\n62.83","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Yuza = π·r², aylana = 2·π·r"},
     {"order":2,"text":"Yaxlitlash uchun f-string ichida :.2f yozing"}]'::jsonb,
   'medium', 8, 20, 1);

  -- ============================================
  -- 4-MAVZU TESTLARI: O'zgaruvchilar va turlar
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_ozgar, 'Qaysi o''zgaruvchi nomi to''g''ri?', 'single',
   '[{"id":"a","text":"2son","is_correct":false},
     {"id":"b","text":"talaba yoshi","is_correct":false},
     {"id":"c","text":"talaba_yoshi","is_correct":true},
     {"id":"d","text":"for","is_correct":false}]'::jsonb,
   'Nom raqam bilan boshlanmasligi, bo''shliq bo''lmasligi va kalit so''z bo''lmasligi kerak.', 1, 0),

  (t_ozgar, '<code>Yosh</code> va <code>yosh</code> — bu bitta o''zgaruvchimi?', 'single',
   '[{"id":"a","text":"Ha, bitta","is_correct":false},
     {"id":"b","text":"Yo''q, ikki xil o''zgaruvchi","is_correct":true},
     {"id":"c","text":"Faqat sonlar uchun farqlanadi","is_correct":false},
     {"id":"d","text":"Python versiyasiga bog''liq","is_correct":false}]'::jsonb,
   'Python katta-kichik harfni farqlaydi (case-sensitive).', 1, 1),

  (t_ozgar, '<code>int(3.99)</code> natijasi nima?', 'single',
   '[{"id":"a","text":"4","is_correct":false},
     {"id":"b","text":"3","is_correct":true},
     {"id":"c","text":"3.99","is_correct":false},
     {"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'int() yaxlitlamaydi, kasr qismini shunchaki tashlab yuboradi.', 1, 2),

  (t_ozgar, '<code>type(3.14)</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"int","is_correct":false},
     {"id":"b","text":"float","is_correct":true},
     {"id":"c","text":"str","is_correct":false},
     {"id":"d","text":"double","is_correct":false}]'::jsonb,
   'Kasrli son Pythonda float turiga tegishli. Pythonda double degan tur yo''q.', 1, 3),

  (t_ozgar, 'Qaysi turlar Pythonda mavjud?', 'multiple',
   '[{"id":"a","text":"int","is_correct":true},
     {"id":"b","text":"bool","is_correct":true},
     {"id":"c","text":"char","is_correct":false},
     {"id":"d","text":"str","is_correct":true}]'::jsonb,
   'Pythonda alohida char turi yo''q — bitta belgi ham str hisoblanadi.', 2, 4),

  (t_ozgar, '<code>a, b = b, a</code> nima qiladi?', 'single',
   '[{"id":"a","text":"Ikkalasini nolga tenglaydi","is_correct":false},
     {"id":"b","text":"Qiymatlarni almashtiradi","is_correct":true},
     {"id":"c","text":"Xato beradi","is_correct":false},
     {"id":"d","text":"a ni b ga tenglaydi","is_correct":false}]'::jsonb,
   'Bu Pythondagi qulay usul — vaqtinchalik o''zgaruvchisiz qiymatlarni almashtiradi.', 1, 5),

  (t_ozgar, 'Nima uchun <code>yosh = input()</code> dan keyin <code>yosh + 1</code> xato beradi?', 'single',
   '[{"id":"a","text":"input() matn qaytaradi, matnga son qo''shib bo''lmaydi","is_correct":true},
     {"id":"b","text":"yosh nomi noto''g''ri","is_correct":false},
     {"id":"c","text":"1 soni juda kichik","is_correct":false},
     {"id":"d","text":"input() da qavs yo''q","is_correct":false}]'::jsonb,
   'int(input()) yozish kerak edi. Bu eng ko''p uchraydigan boshlang''ich xato.', 1, 6),

  (t_ozgar, 'Yaxshi o''zgaruvchi nomi qanday bo''ladi?', 'single',
   '[{"id":"a","text":"Imkon qadar qisqa: a, b, c","is_correct":false},
     {"id":"b","text":"Nima saqlanayotganini aytib turadigan","is_correct":true},
     {"id":"c","text":"Har doim inglizcha","is_correct":false},
     {"id":"d","text":"Kamida 20 ta belgidan iborat","is_correct":false}]'::jsonb,
   'Nom kodni o''qiyotgan odamga nima saqlanayotganini tushuntirishi kerak: yosh, talaba_ismi, jami_ball.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_ozgar, 'Turlarni aylantirish',
   'Bir qatorda butun son, ikkinchi qatorda kasrli son kiritiladi. Ularning yig''indisini butun songa aylantirib chiqaring (kasr qismi tashlansin).',
   'a = int(input())
b = float(input())
# Kodingizni shu yerga yozing',
   'a = int(input())
b = float(input())
print(int(a + b))',
   'python',
   '[{"input":"5\n3.7","expected_output":"8","is_hidden":false},
     {"input":"10\n0.9","expected_output":"10","is_hidden":false},
     {"input":"2\n2.5","expected_output":"4","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Avval qo''shing, keyin int() bilan aylantiring"},
     {"order":2,"text":"int() yaxlitlamaydi, kasr qismini tashlaydi"}]'::jsonb,
   'easy', 5, 15, 0),

  (t_ozgar, 'Qiymatlarni almashtirish',
   'Ikki qator kiritiladi. Ularning qiymatlarini almashtirib, bitta qatorda bo''shliq bilan ajratib chiqaring.<br>Masalan <code>5</code> va <code>9</code> kiritilsa, <code>9 5</code> chiqishi kerak.',
   'a = input()
b = input()
# Kodingizni shu yerga yozing',
   'a = input()
b = input()
a, b = b, a
print(a, b)',
   'python',
   '[{"input":"5\n9","expected_output":"9 5","is_hidden":false},
     {"input":"olma\nanor","expected_output":"anor olma","is_hidden":false}]'::jsonb,
   '[{"order":1,"text":"a, b = b, a yozuvidan foydalaning"},
     {"order":2,"text":"print(a, b) qiymatlarni bo''shliq bilan chiqaradi"}]'::jsonb,
   'easy', 5, 15, 1);

  -- ============================================
  -- 5-MAVZU TESTLARI: Matnlar va sonlar
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_matn, '<code>"Python"[0]</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"P","is_correct":true},
     {"id":"b","text":"y","is_correct":false},
     {"id":"c","text":"n","is_correct":false},
     {"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'Indeks 0 dan boshlanadi, shuning uchun [0] birinchi belgini beradi.', 1, 0),

  (t_matn, '<code>"Python"[-1]</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"P","is_correct":false},
     {"id":"b","text":"n","is_correct":true},
     {"id":"c","text":"o","is_correct":false},
     {"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'Manfiy indeks oxiridan sanaydi: -1 oxirgi belgi.', 1, 1),

  (t_matn, '<code>"ali valiyev".title()</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"Ali valiyev","is_correct":false},
     {"id":"b","text":"Ali Valiyev","is_correct":true},
     {"id":"c","text":"ALI VALIYEV","is_correct":false},
     {"id":"d","text":"ali valiyev","is_correct":false}]'::jsonb,
   'title() har bir so''zning birinchi harfini bosh harfga aylantiradi. capitalize() esa faqat birinchisini.', 1, 2),

  (t_matn, 'Quyidagi kod nima chiqaradi?<br><code>a = "salom"<br>a.upper()<br>print(a)</code>', 'single',
   '[{"id":"a","text":"SALOM","is_correct":false},
     {"id":"b","text":"salom","is_correct":true},
     {"id":"c","text":"Salom","is_correct":false},
     {"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'Matn o''zgarmas. Metod yangi matn qaytaradi, lekin natija saqlanmagani uchun a o''zgarmadi. a = a.upper() yozilishi kerak edi.', 1, 3),

  (t_matn, 'f-string ning afzalligi nimada?', 'multiple',
   '[{"id":"a","text":"Kod qisqaroq va o''qishli bo''ladi","is_correct":true},
     {"id":"b","text":"str() bilan aylantirish shart emas","is_correct":true},
     {"id":"c","text":"Dastur tezroq ishlaydi","is_correct":false},
     {"id":"d","text":"Ichida hisoblash yozish mumkin","is_correct":true}]'::jsonb,
   'f-string qulaylik beradi va xatoga kamroq yo''l qo''yadi. Tezlik farqi sezilarli emas.', 2, 4),

  (t_matn, '<code>"a b c".split()</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"\"abc\"","is_correct":false},
     {"id":"b","text":"[''a'', ''b'', ''c'']","is_correct":true},
     {"id":"c","text":"(''a'', ''b'', ''c'')","is_correct":false},
     {"id":"d","text":"3","is_correct":false}]'::jsonb,
   'split() matnni bo''laklarga ajratib, ro''yxat qaytaradi. Sukut bo''yicha bo''shliq bo''yicha ajratadi.', 1, 5),

  (t_matn, '<code>len("Python")</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"5","is_correct":false},
     {"id":"b","text":"6","is_correct":true},
     {"id":"c","text":"7","is_correct":false},
     {"id":"d","text":"P","is_correct":false}]'::jsonb,
   'len() belgilar sonini qaytaradi. "Python" da 6 ta harf bor.', 1, 6),

  (t_matn, '<code>f"{3.14159:.2f}"</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"3.14","is_correct":true},
     {"id":"b","text":"3.1416","is_correct":false},
     {"id":"c","text":"3","is_correct":false},
     {"id":"d","text":"3.14159","is_correct":false}]'::jsonb,
   ':.2f — ikki xonagacha yaxlitlash. Bu son chiqarishda eng ko''p ishlatiladigan format.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_matn, 'Ism-familiyani chiroyli ko''rinishga keltirish',
   'Bir qatorda ism va familiya kichik harflarda kiritiladi. Ularni har so''z bosh harf bilan boshlanadigan qilib chiqaring.<br>Masalan <code>ali valiyev</code> → <code>Ali Valiyev</code>',
   'matn = input()
# Kodingizni shu yerga yozing',
   'matn = input()
print(matn.title())',
   'python',
   '[{"input":"ali valiyev","expected_output":"Ali Valiyev","is_hidden":false},
     {"input":"dilnoza karimova","expected_output":"Dilnoza Karimova","is_hidden":false},
     {"input":"bekzod","expected_output":"Bekzod","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"title() metodi har so''zni bosh harf bilan boshlaydi"},
     {"order":2,"text":"Natijani chiqarishni unutmang"}]'::jsonb,
   'easy', 5, 15, 0),

  (t_matn, 'Matn tahlili',
   'Bir qator matn kiritiladi. Quyidagilarni har birini alohida qatorda chiqaring:<br>1) uzunligi<br>2) bosh harflardagi ko''rinishi<br>3) teskari o''qilishi',
   'matn = input()
# Kodingizni shu yerga yozing',
   'matn = input()
print(len(matn))
print(matn.upper())
print(matn[::-1])',
   'python',
   '[{"input":"python","expected_output":"6\nPYTHON\nnohtyp","is_hidden":false},
     {"input":"salom","expected_output":"5\nSALOM\nmolas","is_hidden":false},
     {"input":"abc","expected_output":"3\nABC\ncba","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"len(), upper() metodlaridan foydalaning"},
     {"order":2,"text":"Teskari qilish uchun kesish: matn[::-1]"}]'::jsonb,
   'medium', 8, 20, 1);

  -- ============================================
  -- 6-MAVZU TESTLARI: Ro'yxatlar va for
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_royxat, '<code>list(range(2, 6))</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"[2, 3, 4, 5, 6]","is_correct":false},
     {"id":"b","text":"[2, 3, 4, 5]","is_correct":true},
     {"id":"c","text":"[3, 4, 5]","is_correct":false},
     {"id":"d","text":"[2, 6]","is_correct":false}]'::jsonb,
   'range() da oxirgi son KIRMAYDI. 2 dan boshlanadi, 6 gacha (6 siz).', 1, 0),

  (t_royxat, 'Ro''yxat oxiriga element qo''shish uchun qaysi metod?', 'single',
   '[{"id":"a","text":"add()","is_correct":false},
     {"id":"b","text":"append()","is_correct":true},
     {"id":"c","text":"insert()","is_correct":false},
     {"id":"d","text":"push()","is_correct":false}]'::jsonb,
   'append() oxiriga qo''shadi. insert() belgilangan o''ringa qo''yadi. add() to''plamlar uchun.', 1, 1),

  (t_royxat, 'Tuple va list farqi nimada?', 'single',
   '[{"id":"a","text":"Tuple o''zgartirib bo''lmaydi","is_correct":true},
     {"id":"b","text":"Tuple faqat sonlar saqlaydi","is_correct":false},
     {"id":"c","text":"Tuple uzunligi cheklangan","is_correct":false},
     {"id":"d","text":"Farqi yo''q","is_correct":false}]'::jsonb,
   'Tuple — o''zgarmas. Yaratilgandan keyin element qo''shib yoki o''zgartirib bo''lmaydi.', 1, 2),

  (t_royxat, '<code>a = [1,2,3]</code> va <code>b = a</code> dan keyin <code>b.append(4)</code> bajarilsa, <code>a</code> nimaga teng?', 'single',
   '[{"id":"a","text":"[1, 2, 3]","is_correct":false},
     {"id":"b","text":"[1, 2, 3, 4]","is_correct":true},
     {"id":"c","text":"[4]","is_correct":false},
     {"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'b = a nusxa OLMAYDI — ikkala nom bitta ro''yxatga ishora qiladi. Nusxa uchun a[:] yoki a.copy() kerak.', 1, 3),

  (t_royxat, '<code>[0,1,2,3,4][1:4]</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"[1, 2, 3]","is_correct":true},
     {"id":"b","text":"[1, 2, 3, 4]","is_correct":false},
     {"id":"c","text":"[0, 1, 2, 3]","is_correct":false},
     {"id":"d","text":"[2, 3]","is_correct":false}]'::jsonb,
   'Kesishda boshlanish kiradi, tugash kirmaydi: 1, 2, 3 indekslar.', 1, 4),

  (t_royxat, 'Sonli ro''yxat uchun qaysi funksiyalar ishlaydi?', 'multiple',
   '[{"id":"a","text":"sum()","is_correct":true},
     {"id":"b","text":"max()","is_correct":true},
     {"id":"c","text":"min()","is_correct":true},
     {"id":"d","text":"average()","is_correct":false}]'::jsonb,
   'Pythonda tayyor average() yo''q — o''rtachani sum()/len() bilan hisoblanadi.', 2, 5),

  (t_royxat, '<code>[1,2,3][::-1]</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"[1, 2, 3]","is_correct":false},
     {"id":"b","text":"[3, 2, 1]","is_correct":true},
     {"id":"c","text":"[-1, -2, -3]","is_correct":false},
     {"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'Qadam -1 bo''lgan kesish ro''yxatni teskari qaytaradi.', 1, 6),

  (t_royxat, '<code>sort()</code> va <code>sorted()</code> farqi nimada?', 'single',
   '[{"id":"a","text":"Farqi yo''q","is_correct":false},
     {"id":"b","text":"sort() ro''yxatning o''zini o''zgartiradi, sorted() yangi ro''yxat qaytaradi","is_correct":true},
     {"id":"c","text":"sorted() faqat sonlar uchun","is_correct":false},
     {"id":"d","text":"sort() tezroq ishlaydi","is_correct":false}]'::jsonb,
   'Asl ro''yxat kerak bo''lsa sorted() ishlating — u nusxani tartiblab qaytaradi.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_royxat, 'Sonlar yig''indisi',
   'Birinchi qatorda sonlar soni <code>n</code>, keyingi <code>n</code> qatorda sonlar kiritiladi. Ularning yig''indisini chiqaring.',
   'n = int(input())
sonlar = []
# Kodingizni shu yerga yozing',
   'n = int(input())
sonlar = []
for i in range(n):
    sonlar.append(int(input()))
print(sum(sonlar))',
   'python',
   '[{"input":"3\n10\n20\n30","expected_output":"60","is_hidden":false},
     {"input":"4\n1\n2\n3\n4","expected_output":"10","is_hidden":false},
     {"input":"1\n99","expected_output":"99","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"for i in range(n) bilan n marta o''qing"},
     {"order":2,"text":"append() bilan ro''yxatga qo''shing, oxirida sum() ishlating"}]'::jsonb,
   'easy', 5, 15, 0),

  (t_royxat, 'Ko''paytirish jadvali',
   'Bir son <code>n</code> kiritiladi. Uning 1 dan 10 gacha ko''paytirish jadvalini chiqaring.<br>Har qator <code>n x i = natija</code> ko''rinishida bo''lsin.',
   'n = int(input())
# Kodingizni shu yerga yozing',
   'n = int(input())
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")',
   'python',
   '[{"input":"3","expected_output":"3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30","is_hidden":false},
     {"input":"5","expected_output":"5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"for i in range(1, 11) — 1 dan 10 gacha"},
     {"order":2,"text":"f-string ishlating: f\"{n} x {i} = {n * i}\""}]'::jsonb,
   'medium', 8, 20, 1),

  (t_royxat, 'Eng katta va eng kichik',
   'Birinchi qatorda <code>n</code>, keyin <code>n</code> ta son kiritiladi. Birinchi qatorda eng kattasini, ikkinchisida eng kichigini chiqaring.',
   'n = int(input())
sonlar = []
# Kodingizni shu yerga yozing',
   'n = int(input())
sonlar = []
for i in range(n):
    sonlar.append(int(input()))
print(max(sonlar))
print(min(sonlar))',
   'python',
   '[{"input":"5\n3\n9\n1\n7\n5","expected_output":"9\n1","is_hidden":false},
     {"input":"3\n-5\n0\n5","expected_output":"5\n-5","is_hidden":false},
     {"input":"2\n100\n100","expected_output":"100\n100","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Barcha sonlarni ro''yxatga to''plang"},
     {"order":2,"text":"max() va min() funksiyalari tayyor javob beradi"}]'::jsonb,
   'medium', 8, 20, 2);

END $$;
