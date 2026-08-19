-- ============================================================
-- EduCode — Baza kontenti tarjimalari: TESTLAR VA SAVOLLAR (QUIZZES)
--   Test savollari, variantlar (JSONB) va izohlar -> ru, en, kaa
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
-- ============================================================

DO $$
BEGIN
  -- [Pythonda kod bloklari nima orqali ajrati...]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'question', 'Как в Python выделяются блоки кода?' FROM quizzes WHERE question = 'Pythonda kod bloklari nima orqali ajratiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'ru', 'options', '[{"id":"a","text":"Отступами","is_correct":true},{"id":"b","text":"Фигурными скобками","is_correct":false},{"id":"c","text":"Точкой с запятой","is_correct":false},{"id":"d","text":"Ключевыми словами begin/end","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'Pythonda kod bloklari nima orqali ajratiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'explanation', 'В Python вместо фигурных скобок используются отступы (indentation).' FROM quizzes WHERE question = 'Pythonda kod bloklari nima orqali ajratiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'question', 'How are code blocks designated in Python?' FROM quizzes WHERE question = 'Pythonda kod bloklari nima orqali ajratiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'en', 'options', '[{"id":"a","text":"Indentation","is_correct":true},{"id":"b","text":"Curly braces","is_correct":false},{"id":"c","text":"Semicolons","is_correct":false},{"id":"d","text":"Keywords begin/end","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'Pythonda kod bloklari nima orqali ajratiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'explanation', 'Python uses indentation instead of curly braces to define blocks of code.' FROM quizzes WHERE question = 'Pythonda kod bloklari nima orqali ajratiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'question', 'Pythonda kod blokları ne arqalı ajıratıladı?' FROM quizzes WHERE question = 'Pythonda kod bloklari nima orqali ajratiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'kaa', 'options', '[{"id":"a","text":"Sheginiw arqalı","is_correct":true},{"id":"b","text":"Figuralı qawıslar menen","is_correct":false},{"id":"c","text":"Útirli noqat penen","is_correct":false},{"id":"d","text":"begin/end sózleri menen","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'Pythonda kod bloklari nima orqali ajratiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'explanation', 'Pythonda figuralı qawıslar ornına sheginiw (indentation) isletiledi.' FROM quizzes WHERE question = 'Pythonda kod bloklari nima orqali ajratiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [input() funksiyasi qanday turdagi qiymat...]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'question', 'Какой тип данных всегда возвращает функция input()?' FROM quizzes WHERE question = 'input() funksiyasi qanday turdagi qiymat qaytaradi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'ru', 'options', '[{"id":"a","text":"int","is_correct":false},{"id":"b","text":"str","is_correct":true},{"id":"c","text":"float","is_correct":false},{"id":"d","text":"bool","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'input() funksiyasi qanday turdagi qiymat qaytaradi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'explanation', 'Функция input() всегда возвращает строку (str). Для чисел требуется int() или float().' FROM quizzes WHERE question = 'input() funksiyasi qanday turdagi qiymat qaytaradi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'question', 'What data type is returned by the input() function?' FROM quizzes WHERE question = 'input() funksiyasi qanday turdagi qiymat qaytaradi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'en', 'options', '[{"id":"a","text":"int","is_correct":false},{"id":"b","text":"str","is_correct":true},{"id":"c","text":"float","is_correct":false},{"id":"d","text":"bool","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'input() funksiyasi qanday turdagi qiymat qaytaradi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'explanation', 'input() always returns a string (str). Use int() or float() for numerical conversions.' FROM quizzes WHERE question = 'input() funksiyasi qanday turdagi qiymat qaytaradi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'question', 'input() funktsiyası qanday túrdegi mánis qaytaradı?' FROM quizzes WHERE question = 'input() funksiyasi qanday turdagi qiymat qaytaradi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'kaa', 'options', '[{"id":"a","text":"int","is_correct":false},{"id":"b","text":"str","is_correct":true},{"id":"c","text":"float","is_correct":false},{"id":"d","text":"bool","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'input() funksiyasi qanday turdagi qiymat qaytaradi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'explanation', 'input() hárdayım tekst (str) qaytaradı. Onı int() yamasa float() penen ózgertiw kerek.' FROM quizzes WHERE question = 'input() funksiyasi qanday turdagi qiymat qaytaradi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [7 // 2 natijasi nima?...]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'question', 'Чему равен результат выражения 7 // 2?' FROM quizzes WHERE question = '7 // 2 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'ru', 'options', '[{"id":"a","text":"3.5","is_correct":false},{"id":"b","text":"3","is_correct":true},{"id":"c","text":"4","is_correct":false},{"id":"d","text":"1","is_correct":false}]'::jsonb FROM quizzes WHERE question = '7 // 2 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'explanation', 'Оператор // выполняет целочисленное деление: 7 делить на 2 дает 3.' FROM quizzes WHERE question = '7 // 2 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'question', 'What is the evaluation of 7 // 2 in Python?' FROM quizzes WHERE question = '7 // 2 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'en', 'options', '[{"id":"a","text":"3.5","is_correct":false},{"id":"b","text":"3","is_correct":true},{"id":"c","text":"4","is_correct":false},{"id":"d","text":"1","is_correct":false}]'::jsonb FROM quizzes WHERE question = '7 // 2 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'explanation', 'The // operator performs floor division: 7 divided by 2 is 3.' FROM quizzes WHERE question = '7 // 2 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'question', '7 // 2 nátiyjesi nege teń?' FROM quizzes WHERE question = '7 // 2 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'kaa', 'options', '[{"id":"a","text":"3.5","is_correct":false},{"id":"b","text":"3","is_correct":true},{"id":"c","text":"4","is_correct":false},{"id":"d","text":"1","is_correct":false}]'::jsonb FROM quizzes WHERE question = '7 // 2 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'explanation', '// operatorı pútin bólimin aladı: 7 ni 2 ge bólsek 3 boladı.' FROM quizzes WHERE question = '7 // 2 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [7 % 3 natijasi nima?...]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'question', 'Чему равен результат выражения 7 % 3?' FROM quizzes WHERE question = '7 % 3 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'ru', 'options', '[{"id":"a","text":"2","is_correct":false},{"id":"b","text":"1","is_correct":true},{"id":"c","text":"2.33","is_correct":false},{"id":"d","text":"0","is_correct":false}]'::jsonb FROM quizzes WHERE question = '7 % 3 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'explanation', 'Оператор % возвращает остаток от деления: 7 % 3 дает 1.' FROM quizzes WHERE question = '7 % 3 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'question', 'What is the result of 7 % 3?' FROM quizzes WHERE question = '7 % 3 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'en', 'options', '[{"id":"a","text":"2","is_correct":false},{"id":"b","text":"1","is_correct":true},{"id":"c","text":"2.33","is_correct":false},{"id":"d","text":"0","is_correct":false}]'::jsonb FROM quizzes WHERE question = '7 % 3 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'explanation', 'The % operator computes the remainder: 7 divided by 3 leaves remainder 1.' FROM quizzes WHERE question = '7 % 3 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'question', '7 % 3 nátiyjesi nege teń?' FROM quizzes WHERE question = '7 % 3 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'kaa', 'options', '[{"id":"a","text":"2","is_correct":false},{"id":"b","text":"1","is_correct":true},{"id":"c","text":"2.33","is_correct":false},{"id":"d","text":"0","is_correct":false}]'::jsonb FROM quizzes WHERE question = '7 % 3 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'explanation', '% operatorı qaldıqtı tabadı: 7 ni 3 ke bólsek qaldıq 1 boladı.' FROM quizzes WHERE question = '7 % 3 natijasi nima?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Tenglikni tekshirish uchun qaysi operato...]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'question', 'Какой оператор используется для проверки равенства в Python?' FROM quizzes WHERE question = 'Tenglikni tekshirish uchun qaysi operator ishlatiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'ru', 'options', '[{"id":"a","text":"=","is_correct":false},{"id":"b","text":"==","is_correct":true},{"id":"c","text":"===","is_correct":false},{"id":"d","text":"equals","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'Tenglikni tekshirish uchun qaysi operator ishlatiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'explanation', 'Оператор = присваивает значение, а == проверяет равенство.' FROM quizzes WHERE question = 'Tenglikni tekshirish uchun qaysi operator ishlatiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'question', 'Which operator is used to test equality in Python?' FROM quizzes WHERE question = 'Tenglikni tekshirish uchun qaysi operator ishlatiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'en', 'options', '[{"id":"a","text":"=","is_correct":false},{"id":"b","text":"==","is_correct":true},{"id":"c","text":"===","is_correct":false},{"id":"d","text":"equals","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'Tenglikni tekshirish uchun qaysi operator ishlatiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'explanation', 'The = operator is assignment, whereas == compares equality.' FROM quizzes WHERE question = 'Tenglikni tekshirish uchun qaysi operator ishlatiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'question', 'Teńlikti tekseriw ushın qaysı operator qollanıladı?' FROM quizzes WHERE question = 'Tenglikni tekshirish uchun qaysi operator ishlatiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'kaa', 'options', '[{"id":"a","text":"=","is_correct":false},{"id":"b","text":"==","is_correct":true},{"id":"c","text":"===","is_correct":false},{"id":"d","text":"equals","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'Tenglikni tekshirish uchun qaysi operator ishlatiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'explanation', '= mánis beriw, == bolsa teńlikti tekseriw operatorı.' FROM quizzes WHERE question = 'Tenglikni tekshirish uchun qaysi operator ishlatiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [break nima qiladi?...]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'question', 'Какое действие выполняет инструкция break?' FROM quizzes WHERE question = 'break nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'ru', 'options', '[{"id":"a","text":"Прерывает цикл","is_correct":true},{"id":"b","text":"Пропускает итерацию","is_correct":false},{"id":"c","text":"Завершает программу","is_correct":false},{"id":"d","text":"Перезапускает цикл","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'break nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'explanation', 'Инструкция break немедленно прерывает выполнение текущего цикла.' FROM quizzes WHERE question = 'break nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'question', 'What does the break statement do in a loop?' FROM quizzes WHERE question = 'break nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'en', 'options', '[{"id":"a","text":"Terminates the loop","is_correct":true},{"id":"b","text":"Skips iteration","is_correct":false},{"id":"c","text":"Exits program","is_correct":false},{"id":"d","text":"Restarts loop","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'break nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'explanation', 'The break statement terminates the enclosing loop immediately.' FROM quizzes WHERE question = 'break nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'question', 'break operatorı ne isleydi?' FROM quizzes WHERE question = 'break nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'kaa', 'options', '[{"id":"a","text":"Cikldi toqtatadı","is_correct":true},{"id":"b","text":"Keyingi qádemge ótedi","is_correct":false},{"id":"c","text":"Dastúrdi jabıw","is_correct":false},{"id":"d","text":"Cikldi qayta baslaydı","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'break nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'explanation', 'break cikldiń orınlanıwın tezde toqtatadı hám cikldan shıǵaradı.' FROM quizzes WHERE question = 'break nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [continue nima qiladi?...]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'question', 'Какое действие выполняет инструкция continue?' FROM quizzes WHERE question = 'continue nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'ru', 'options', '[{"id":"a","text":"Переходит к следующей итерации","is_correct":true},{"id":"b","text":"Останавливает цикл","is_correct":false},{"id":"c","text":"Возвращает значение","is_correct":false},{"id":"d","text":"Вызывает ошибку","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'continue nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'explanation', 'Инструкция continue пропускает оставшуюся часть текущей итерации и переходит к следующей.' FROM quizzes WHERE question = 'continue nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'question', 'What is the role of the continue statement?' FROM quizzes WHERE question = 'continue nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'en', 'options', '[{"id":"a","text":"Jumps to next iteration","is_correct":true},{"id":"b","text":"Breaks loop","is_correct":false},{"id":"c","text":"Returns value","is_correct":false},{"id":"d","text":"Raises error","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'continue nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'explanation', 'continue skips the rest of the current iteration and jumps to the next cycle step.' FROM quizzes WHERE question = 'continue nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'question', 'continue operatorı ne isleydi?' FROM quizzes WHERE question = 'continue nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'kaa', 'options', '[{"id":"a","text":"Kelesi qádemge ótedi","is_correct":true},{"id":"b","text":"Cikldi toqtatadı","is_correct":false},{"id":"c","text":"Mánis qaytaradı","is_correct":false},{"id":"d","text":"Qátelik keltirip shıǵaradı","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'continue nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'explanation', 'continue házirgi qádemdi qaldırıp ketip, cikldiń kelesi qádemine ótedi.' FROM quizzes WHERE question = 'continue nima qiladi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [return va print() farqi nimada?...]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'question', 'В чем главное отличие return от print()?' FROM quizzes WHERE question = 'return va print() farqi nimada?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'ru', 'options', '[{"id":"a","text":"return возвращает значение, print() только отображает","is_correct":true},{"id":"b","text":"Разницы нет","is_correct":false},{"id":"c","text":"print() быстрее","is_correct":false},{"id":"d","text":"return только для чисел","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'return va print() farqi nimada?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'ru', 'explanation', 'print() просто выводит текст в консоль, а return возвращает значение для дальнейшей работы в коде.' FROM quizzes WHERE question = 'return va print() farqi nimada?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'question', 'What is the key difference between return and print()?' FROM quizzes WHERE question = 'return va print() farqi nimada?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'en', 'options', '[{"id":"a","text":"return passes value back, print() displays on screen","is_correct":true},{"id":"b","text":"No difference","is_correct":false},{"id":"c","text":"print() is faster","is_correct":false},{"id":"d","text":"return works only with numbers","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'return va print() farqi nimada?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'en', 'explanation', 'print() outputs text to standard output, while return yields a value for the caller.' FROM quizzes WHERE question = 'return va print() farqi nimada?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'question', 'return hám print() arasındaǵı parıq nede?' FROM quizzes WHERE question = 'return va print() farqi nimada?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value_json)
  SELECT 'quizzes', id, 'kaa', 'options', '[{"id":"a","text":"return mánis qaytaradı, print() tek ekranǵa kórsetedi","is_correct":true},{"id":"b","text":"Parqı joq","is_correct":false},{"id":"c","text":"print() tezirek","is_correct":false},{"id":"d","text":"return tek sanlar ushın","is_correct":false}]'::jsonb FROM quizzes WHERE question = 'return va print() farqi nimada?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'quizzes', id, 'kaa', 'explanation', 'print() tek ekranǵa shıǵaradı, return bolsa mánisti kodta paydalanıw ushın qaytaradı.' FROM quizzes WHERE question = 'return va print() farqi nimada?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

END $$;
