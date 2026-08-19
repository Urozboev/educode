-- ============================================================
-- EduCode — Baza kontenti tarjimalari: TOPIDAGI TOPSHIRIQLAR (TOPIC TASKS)
--   Mavzularga biriktirilgan barcha amaliy topshiriqlar -> ru, en, kaa
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
-- ============================================================

DO $$
BEGIN
  -- [Salomlashish]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Приветствие' FROM topic_tasks WHERE title = 'Salomlashish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Вводится одна строка с именем. Выведите на экран приветствие в формате "Salom, [имя]!".
Например: Ali -> Salom, Ali!' FROM topic_tasks WHERE title = 'Salomlashish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Greeting' FROM topic_tasks WHERE title = 'Salomlashish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given a single line input containing a name, print "Salom, [name]!".
Example: Ali -> Salom, Ali!' FROM topic_tasks WHERE title = 'Salomlashish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Sálemlesiw' FROM topic_tasks WHERE title = 'Salomlashish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Bir qatarda atıńız kiritiledi. Ekranǵa "Salom, [at]!" kórinisinde shıǵarıń.
Mısalı: Ali -> Salom, Ali!' FROM topic_tasks WHERE title = 'Salomlashish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Ikki qatorli tanishtiruv]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Представление в две строки' FROM topic_tasks WHERE title = 'Ikki qatorli tanishtiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Вводятся две строки: 1-я — имя, 2-я — профессия. Выведите их в одной строке в формате "[имя] — [профессия]".' FROM topic_tasks WHERE title = 'Ikki qatorli tanishtiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Two-line Introduction' FROM topic_tasks WHERE title = 'Ikki qatorli tanishtiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Two lines are provided: line 1 is a name, line 2 is an occupation. Output them on a single line as "[name] — [occupation]".' FROM topic_tasks WHERE title = 'Ikki qatorli tanishtiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Eki qatarlı tanıstırıw' FROM topic_tasks WHERE title = 'Ikki qatorli tanishtiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Eki qatar kiritiledi: 1-qatar atı, 2-qatar kásibi. Olardı bir qatarda "[at] — [kásip]" kórinisinde shıǵarıń.' FROM topic_tasks WHERE title = 'Ikki qatorli tanishtiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Doira yuzasi va aylanasi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Площадь и длина окружности' FROM topic_tasks WHERE title = 'Doira yuzasi va aylanasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Дан радиус круга r (целое число). Приняв pi = 3.14, выведите в первой строке площадь (pi * r * r), а во второй строке — длину окружности (2 * pi * r), округленные до 2 знаков.' FROM topic_tasks WHERE title = 'Doira yuzasi va aylanasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Circle Area and Circumference' FROM topic_tasks WHERE title = 'Doira yuzasi va aylanasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given integer radius r and pi = 3.14, print the area (pi * r * r) on line 1 and circumference (2 * pi * r) on line 2, rounded to 2 decimal places.' FROM topic_tasks WHERE title = 'Doira yuzasi va aylanasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Dóńgelek maydanı hám sheńber uzınlıǵı' FROM topic_tasks WHERE title = 'Doira yuzasi va aylanasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Dóńgelektiń radiusı r berilgen. pi = 3.14 dep alıp, 1-qatarda maydanın, 2-qatarda sheńber uzınlıǵın 2 qanaǵa shekem shıǵarıń.' FROM topic_tasks WHERE title = 'Doira yuzasi va aylanasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Turlarni aylantirish]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Преобразование типов' FROM topic_tasks WHERE title = 'Turlarni aylantirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Даны два целых числа a и b. Выведите результат деления (a / b) в виде вещественного числа с округлением до 2 знаков.' FROM topic_tasks WHERE title = 'Turlarni aylantirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Type Conversion & Division' FROM topic_tasks WHERE title = 'Turlarni aylantirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given integers a and b, print their division result (a / b) formatted to 2 decimal places.' FROM topic_tasks WHERE title = 'Turlarni aylantirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Túrlerdi ózgertiw' FROM topic_tasks WHERE title = 'Turlarni aylantirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Eki pútin san a hám b berilgen. Olardıń bólinbesin (a / b) 2 qanaǵa shekem bólshik san etip shıǵarıń.' FROM topic_tasks WHERE title = 'Turlarni aylantirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Qiymatlarni almashtirish]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Обмен значений' FROM topic_tasks WHERE title = 'Qiymatlarni almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'В двух строках даны значения a и b. Поменяйте их местами и выведите в одной строке через пробел.' FROM topic_tasks WHERE title = 'Qiymatlarni almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Swap Values' FROM topic_tasks WHERE title = 'Qiymatlarni almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given values a and b on two lines, swap their values and output them on a single line separated by a space.' FROM topic_tasks WHERE title = 'Qiymatlarni almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Mánislerdi almastırıw' FROM topic_tasks WHERE title = 'Qiymatlarni almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Eki qatarda a hám b berilgen. Olardıń ornın almastırıp, bir qatarda bos orın menen shıǵarıń.' FROM topic_tasks WHERE title = 'Qiymatlarni almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Matn tahlili]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Анализ строки' FROM topic_tasks WHERE title = 'Matn tahlili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Дана строка. В 1-й строке выведите ее длину, во 2-й строке — первый и последний символы через пробел.' FROM topic_tasks WHERE title = 'Matn tahlili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'String Analysis' FROM topic_tasks WHERE title = 'Matn tahlili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given a string, print its length on line 1, and its first and last characters separated by space on line 2.' FROM topic_tasks WHERE title = 'Matn tahlili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Tekst analizi' FROM topic_tasks WHERE title = 'Matn tahlili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Bir qatar berilgen. 1-qatarda uzınlıǵın, 2-qatarda birinshi hám aqırǵı belgisin bos orın menen shıǵarıń.' FROM topic_tasks WHERE title = 'Matn tahlili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Eng katta va eng kichik]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Минимум и максимум списка' FROM topic_tasks WHERE title = 'Eng katta va eng kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Дана строка целых чисел через пробел. Выведите максимальное и минимальное числа списка в одной строке через пробел.' FROM topic_tasks WHERE title = 'Eng katta va eng kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Min and Max of List' FROM topic_tasks WHERE title = 'Eng katta va eng kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given space-separated integers, output the maximum and minimum numbers from the list on a single line.' FROM topic_tasks WHERE title = 'Eng katta va eng kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Eń úlken hám eń kishi' FROM topic_tasks WHERE title = 'Eng katta va eng kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Bos orın menen ajıratılǵan pútin sanlar berilgen. Dizimdegi eń úlken hám eń kishi sandı bir qatarda shıǵarıń.' FROM topic_tasks WHERE title = 'Eng katta va eng kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Juft yoki toq]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Четное или нечетное' FROM topic_tasks WHERE title = 'Juft yoki toq'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Дано целое число. Если число четное, выведите "Juft", иначе "Toq".' FROM topic_tasks WHERE title = 'Juft yoki toq'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Even or Odd Check' FROM topic_tasks WHERE title = 'Juft yoki toq'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given an integer, print "Juft" if it is even, and "Toq" if it is odd.' FROM topic_tasks WHERE title = 'Juft yoki toq'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Jup yamasa taq' FROM topic_tasks WHERE title = 'Juft yoki toq'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Bir pútin san berilgen. San jup bolsa "Juft", taq bolsa "Toq" dep shıǵarıń.' FROM topic_tasks WHERE title = 'Juft yoki toq'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Uchburchak mavjudmi?]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Существование треугольника' FROM topic_tasks WHERE title = 'Uchburchak mavjudmi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Даны длины трех отрезков a, b, c. Если из них можно составить треугольник, выведите "Ha", иначе "Yoq".' FROM topic_tasks WHERE title = 'Uchburchak mavjudmi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Triangle Inequality' FROM topic_tasks WHERE title = 'Uchburchak mavjudmi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given three segment lengths a, b, and c, print "Ha" if a triangle can be formed, otherwise "Yoq".' FROM topic_tasks WHERE title = 'Uchburchak mavjudmi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Úshmúyeshlik barma?' FROM topic_tasks WHERE title = 'Uchburchak mavjudmi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Úsh kesindi uzınlıǵı a, b, c berilgen. Olardan úshmúyeshlik jasaw múmkin bolsa "Ha", bolmasa "Yoq" dep shıǵarıń.' FROM topic_tasks WHERE title = 'Uchburchak mavjudmi?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Raqamlar yig'indisi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Сумма цифр числа' FROM topic_tasks WHERE title = 'Raqamlar yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Дано натуральное число. С помощью цикла while вычислите сумму всех его цифр.' FROM topic_tasks WHERE title = 'Raqamlar yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Sum of Digits (While Loop)' FROM topic_tasks WHERE title = 'Raqamlar yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given a positive integer, compute the sum of its digits using a while loop.' FROM topic_tasks WHERE title = 'Raqamlar yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Cifrlar qosındısı' FROM topic_tasks WHERE title = 'Raqamlar yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Oń pútin san berilgen. While cikli járdeminde onıń barlıq cifrları qosındısın esaplań.' FROM topic_tasks WHERE title = 'Raqamlar yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Kvadrat funksiyasi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Функция квадрата' FROM topic_tasks WHERE title = 'Kvadrat funksiyasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Напишите функцию kvadrat(x), которая вычисляет и возвращает квадрат переданного числа.' FROM topic_tasks WHERE title = 'Kvadrat funksiyasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Square Function' FROM topic_tasks WHERE title = 'Kvadrat funksiyasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Write a function kvadrat(x) that returns the square of the given number x.' FROM topic_tasks WHERE title = 'Kvadrat funksiyasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Kvadrat funktsiyası' FROM topic_tasks WHERE title = 'Kvadrat funksiyasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Kiritilgen sanniń kvadratın esaplap qaytarıwshı kvadrat(x) funktsiyasın jazıń.' FROM topic_tasks WHERE title = 'Kvadrat funksiyasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Tub sonni aniqlash]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Проверка на простое число' FROM topic_tasks WHERE title = 'Tub sonni aniqlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Напишите функцию tubmi(n), возвращающую True, если число простое, и False в противном случае.' FROM topic_tasks WHERE title = 'Tub sonni aniqlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Prime Check Function' FROM topic_tasks WHERE title = 'Tub sonni aniqlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Write a function tubmi(n) that returns True if n is prime, and False otherwise.' FROM topic_tasks WHERE title = 'Tub sonni aniqlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Ápiwayı sandı anıqlaw' FROM topic_tasks WHERE title = 'Tub sonni aniqlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'San ápiwayı bolsa True, bolmasa False qaytarıwshı tubmi(n) funktsiyasın jazıń.' FROM topic_tasks WHERE title = 'Tub sonni aniqlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Gipotenuza]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Гипотенуза' FROM topic_tasks WHERE title = 'Gipotenuza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Даны катеты прямоугольного треугольника a и b. С помощью модуля math найдите гипотенузу с округлением до 2 знаков.' FROM topic_tasks WHERE title = 'Gipotenuza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Hypotenuse Calculation' FROM topic_tasks WHERE title = 'Gipotenuza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given legs a and b of a right triangle, compute hypotenuse to 2 decimal places using math module.' FROM topic_tasks WHERE title = 'Gipotenuza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Gipotenuza' FROM topic_tasks WHERE title = 'Gipotenuza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Tuwrı múyeshli úshmúyeshliktiń katetleri a hám b berilgen. Math moduli járdeminde gipotenuzanı 2 qanaǵa shekem esaplań.' FROM topic_tasks WHERE title = 'Gipotenuza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [EKUB va EKUK]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'НОД и НОК' FROM topic_tasks WHERE title = 'EKUB va EKUK'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Даны два целых числа a и b. С помощью модуля math выведите их НОД (gcd) и НОК (lcm) в одной строке через пробел.' FROM topic_tasks WHERE title = 'EKUB va EKUK'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'GCD and LCM' FROM topic_tasks WHERE title = 'EKUB va EKUK'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given two integers a and b, compute and output their GCD and LCM on a single line separated by space.' FROM topic_tasks WHERE title = 'EKUB va EKUK'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'EÚUB hám EÚUK' FROM topic_tasks WHERE title = 'EKUB va EKUK'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Eki pútin san a hám b berilgen. Math moduli járdeminde olardıń EÚUB (gcd) hám EÚUK (lcm) mánislerin bir qatorda shıǵarıń.' FROM topic_tasks WHERE title = 'EKUB va EKUK'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Bashorat aniqligini baholash]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Оценка точности прогноза' FROM topic_tasks WHERE title = 'Bashorat aniqligini baholash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Даны n истинных и предсказанных значений. Рассчитайте процент правильных прогнозов (Accuracy) с точностью до 2 знаков.' FROM topic_tasks WHERE title = 'Bashorat aniqligini baholash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Prediction Accuracy Evaluation' FROM topic_tasks WHERE title = 'Bashorat aniqligini baholash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given n ground-truth and predicted values, calculate the prediction accuracy percentage formatted to 2 decimals.' FROM topic_tasks WHERE title = 'Bashorat aniqligini baholash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Boljaw anıqlıǵın bahalaw' FROM topic_tasks WHERE title = 'Bashorat aniqligini baholash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'n anıq hám boljanǵan mánisler berilgen. Durıs tabılǵan boljawlar procentin 2 qanaǵa shekem esaplań.' FROM topic_tasks WHERE title = 'Bashorat aniqligini baholash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Ikki sonning yig'indisi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Сумма двух чисел' FROM topic_tasks WHERE title = 'Ikki sonning yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'В одной строке вводятся два целых числа через пробел. Выведите их сумму.' FROM topic_tasks WHERE title = 'Ikki sonning yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Sum of Two Integers' FROM topic_tasks WHERE title = 'Ikki sonning yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given two space-separated integers on a single line, output their sum.' FROM topic_tasks WHERE title = 'Ikki sonning yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Eki sanniń qosındısı' FROM topic_tasks WHERE title = 'Ikki sonning yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Bir qatarda bos orın menen ajıratılǵan eki pútin san kiritiledi. Olardıń qosındısın shıǵarıń.' FROM topic_tasks WHERE title = 'Ikki sonning yig''indisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Vizitka]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Визитка' FROM topic_tasks WHERE title = 'Vizitka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Вводятся три строки: имя, профессия, город. Выведите их в одной строке через запятую с пробелом.' FROM topic_tasks WHERE title = 'Vizitka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Business Card' FROM topic_tasks WHERE title = 'Vizitka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Three lines are provided: name, job, and city. Print them on a single line separated by comma and space.' FROM topic_tasks WHERE title = 'Vizitka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Vizitka' FROM topic_tasks WHERE title = 'Vizitka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Úsh qatar kiritiledi: atı, kásibi, qalası. Olardı bir qatarda útir hám bos orın menen ajıratıp shıǵarıń.' FROM topic_tasks WHERE title = 'Vizitka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [To'g'ri to'rtburchak]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Прямоугольник' FROM topic_tasks WHERE title = 'To''g''ri to''rtburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'В двух строках вводятся ширина и высота прямоугольника. Выведите площадь в 1-й строке и периметр во 2-й строке.' FROM topic_tasks WHERE title = 'To''g''ri to''rtburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Rectangle Geometry' FROM topic_tasks WHERE title = 'To''g''ri to''rtburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given width and height on two lines, output area on line 1 and perimeter on line 2.' FROM topic_tasks WHERE title = 'To''g''ri to''rtburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Tuwrı tórtmúyeshlik' FROM topic_tasks WHERE title = 'To''g''ri to''rtburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Eki qatarda tórtmúyeshliktiń eni hám boyı kiritiledi. 1-qatarda maydanın, 2-qatarda perimetrin shıǵarıń.' FROM topic_tasks WHERE title = 'To''g''ri to''rtburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Xavfsiz bo'lish]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Безопасное деление' FROM topic_tasks WHERE title = 'Xavfsiz bo''lish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Даны два целых числа a и b. Выведите результат деления a / b с точностью 2 знака. При делении на ноль выведите "xato".' FROM topic_tasks WHERE title = 'Xavfsiz bo''lish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Safe Division with Try-Except' FROM topic_tasks WHERE title = 'Xavfsiz bo''lish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given integers a and b, print a / b rounded to 2 decimals. If division by zero occurs, output "xato".' FROM topic_tasks WHERE title = 'Xavfsiz bo''lish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Qáwipsiz bóliw' FROM topic_tasks WHERE title = 'Xavfsiz bo''lish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Eki pútin san a hám b berilgen. a / b nátiyjesin 2 qanaǵa shekem shıǵarıń. Nolge bóliw júz berse "xato" dep shıǵarıń.' FROM topic_tasks WHERE title = 'Xavfsiz bo''lish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Kirishni tekshirish]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Валидация ввода' FROM topic_tasks WHERE title = 'Kirishni tekshirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Если введенная строка является целым числом, выведите его квадрат, иначе выведите "son emas".' FROM topic_tasks WHERE title = 'Kirishni tekshirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Input Validation' FROM topic_tasks WHERE title = 'Kirishni tekshirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'If the input string is a valid integer, print its square; otherwise output "son emas".' FROM topic_tasks WHERE title = 'Kirishni tekshirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Kiriwdi tekseriw' FROM topic_tasks WHERE title = 'Kirishni tekshirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Kiritilgen qatar pútin san bolsa onıń kvadratın shıǵarıń, bolmasa "son emas" dep shıǵarıń.' FROM topic_tasks WHERE title = 'Kirishni tekshirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Faktorial]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Факториал' FROM topic_tasks WHERE title = 'Faktorial'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Дано натуральное число n. Вычислите его факториал (n!).' FROM topic_tasks WHERE title = 'Faktorial'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Factorial Calculation' FROM topic_tasks WHERE title = 'Faktorial'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given a natural integer n, compute its factorial (n!).' FROM topic_tasks WHERE title = 'Faktorial'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Faktorial' FROM topic_tasks WHERE title = 'Faktorial'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Natural n sanı berilgen. Onıń faktorialın (n!) esaplań.' FROM topic_tasks WHERE title = 'Faktorial'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Yulduzchali uchburchak]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Треугольник из звездочек' FROM topic_tasks WHERE title = 'Yulduzchali uchburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Выведите прямоугольный треугольник из звездочек (*) высотой n строк.' FROM topic_tasks WHERE title = 'Yulduzchali uchburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Asterisk Triangle' FROM topic_tasks WHERE title = 'Yulduzchali uchburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Print a right-angled triangle pattern of asterisks (*) of height n.' FROM topic_tasks WHERE title = 'Yulduzchali uchburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Juldızshali úshmúyeshlik' FROM topic_tasks WHERE title = 'Yulduzchali uchburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Biyikligi n bolǵan juldızshali (*) tuwrı múyeshli úshmúyeshlikti ekranǵa shıǵarıń.' FROM topic_tasks WHERE title = 'Yulduzchali uchburchak'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Uch sondan eng kattasi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Максимум из трех чисел' FROM topic_tasks WHERE title = 'Uch sondan eng kattasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Найдите наибольшее число среди трех целых чисел, введенных в одной строке.' FROM topic_tasks WHERE title = 'Uch sondan eng kattasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Maximum of Three Numbers' FROM topic_tasks WHERE title = 'Uch sondan eng kattasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Find the maximum value among three space-separated integers.' FROM topic_tasks WHERE title = 'Uch sondan eng kattasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Úsh sannan eń úlkeni' FROM topic_tasks WHERE title = 'Uch sondan eng kattasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Bir qatarda kiritilgen úsh pútin sannan eń úlkenin tabıń.' FROM topic_tasks WHERE title = 'Uch sondan eng kattasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Nuqta qaysi chorakda?]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Координатная четверть' FROM topic_tasks WHERE title = 'Nuqta qaysi chorakda?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Определите, в какой координатной четверти (I, II, III, IV) или на какой оси находится точка (x, y).' FROM topic_tasks WHERE title = 'Nuqta qaysi chorakda?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Coordinate Quadrant' FROM topic_tasks WHERE title = 'Nuqta qaysi chorakda?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Determine which geometric quadrant (I, II, III, IV) or axis the point (x, y) lies on.' FROM topic_tasks WHERE title = 'Nuqta qaysi chorakda?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Noqat qaysı sherekte?' FROM topic_tasks WHERE title = 'Nuqta qaysi chorakda?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Koordinata tegisligindegi (x, y) noqatınıń qaysı sherekte ornalasqanın anıqlań.' FROM topic_tasks WHERE title = 'Nuqta qaysi chorakda?'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Kvadrat tenglama]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Квадратное уравнение' FROM topic_tasks WHERE title = 'Kvadrat tenglama'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Найдите корни квадратного уравнения ax^2 + bx + c = 0 с точностью до 2 знаков.' FROM topic_tasks WHERE title = 'Kvadrat tenglama'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Quadratic Equation Solver' FROM topic_tasks WHERE title = 'Kvadrat tenglama'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Solve the quadratic equation ax^2 + bx + c = 0 and output real roots formatted to 2 decimals.' FROM topic_tasks WHERE title = 'Kvadrat tenglama'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Kvadrat teńleme' FROM topic_tasks WHERE title = 'Kvadrat tenglama'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'ax^2 + bx + c = 0 kvadrat teńlemesiniń kórsetilgen túbirlerin tabıń.' FROM topic_tasks WHERE title = 'Kvadrat tenglama'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Raqamlar soni]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Количество цифр' FROM topic_tasks WHERE title = 'Raqamlar soni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Дано натуральное число. С помощью цикла while найдите количество цифр в нем.' FROM topic_tasks WHERE title = 'Raqamlar soni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Count Digits (While)' FROM topic_tasks WHERE title = 'Raqamlar soni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given a positive integer, find the total count of digits using a while loop.' FROM topic_tasks WHERE title = 'Raqamlar soni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Cifrlar sanı' FROM topic_tasks WHERE title = 'Raqamlar soni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Oń pútin san berilgen. While cikli járdeminde ondaǵı cifrlar sanın tabıń.' FROM topic_tasks WHERE title = 'Raqamlar soni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Fibonachchi sonlari]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Числа Фибоначчи до n' FROM topic_tasks WHERE title = 'Fibonachchi sonlari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Выведите все числа Фибоначчи, не превышающие n, в одной строке через пробел.' FROM topic_tasks WHERE title = 'Fibonachchi sonlari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Fibonacci Sequence up to n' FROM topic_tasks WHERE title = 'Fibonachchi sonlari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Print all Fibonacci numbers less than or equal to n on a single line separated by spaces.' FROM topic_tasks WHERE title = 'Fibonachchi sonlari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'n ge shekemgi Fibonachchi sanları' FROM topic_tasks WHERE title = 'Fibonachchi sonlari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'n ge shekemgi barlıq Fibonachchi sanların bir qatarda bos orın menen shıǵarıń.' FROM topic_tasks WHERE title = 'Fibonachchi sonlari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Vaqtni ajratish]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Разложение времени' FROM topic_tasks WHERE title = 'Vaqtni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Дано общее количество секунд, прошедших с начала суток. Выведите время в формате часы, минуты и секунды.' FROM topic_tasks WHERE title = 'Vaqtni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Time Deconstruction' FROM topic_tasks WHERE title = 'Vaqtni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given elapsed seconds from the start of the day, convert it into hours, minutes, and seconds.' FROM topic_tasks WHERE title = 'Vaqtni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Waqıttı ajıratıw' FROM topic_tasks WHERE title = 'Vaqtni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Kún basınan ótken jámi sekundlar berilgen. Onı saat, minut hám sekundlarǵa ajıratıń.' FROM topic_tasks WHERE title = 'Vaqtni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Ikki nuqta orasidagi masofa]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Расстояние между точками' FROM topic_tasks WHERE title = 'Ikki nuqta orasidagi masofa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Вычислите евклидово расстояние между точками (x1, y1) и (x2, y2) на плоскости с округлением до 2 знаков.' FROM topic_tasks WHERE title = 'Ikki nuqta orasidagi masofa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Euclidean Distance' FROM topic_tasks WHERE title = 'Ikki nuqta orasidagi masofa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Compute Euclidean distance between two points (x1, y1) and (x2, y2) to 2 decimal places.' FROM topic_tasks WHERE title = 'Ikki nuqta orasidagi masofa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Eki noqat arasındagı aralıq' FROM topic_tasks WHERE title = 'Ikki nuqta orasidagi masofa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Tegisliktegi (x1, y1) hám (x2, y2) noqatları arasındagı Evklid aralıǵın 2 qanaǵa shekem esaplań.' FROM topic_tasks WHERE title = 'Ikki nuqta orasidagi masofa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Bosh harflar (initsial)]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Инициалы' FROM topic_tasks WHERE title = 'Bosh harflar (initsial)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Даны имя и фамилия через пробел. Сформируйте и выведите инициалы (например, Aliyev Vali -> A.V.).' FROM topic_tasks WHERE title = 'Bosh harflar (initsial)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Name Initials' FROM topic_tasks WHERE title = 'Bosh harflar (initsial)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Given full name components, extract and print uppercase initials (e.g. Aliyev Vali -> A.V.).' FROM topic_tasks WHERE title = 'Bosh harflar (initsial)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Bas háripler (initsial)' FROM topic_tasks WHERE title = 'Bosh harflar (initsial)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Familiya hám atı berilgen. Olardıń bas háriplerinen initsial jaratıń (mısalı Aliyev Vali -> A.V.).' FROM topic_tasks WHERE title = 'Bosh harflar (initsial)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Juft sonlarni ajratish]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Фильтрация четных чисел' FROM topic_tasks WHERE title = 'Juft sonlarni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Извлеките и выведите только четные числа из переданного списка в исходном порядке.' FROM topic_tasks WHERE title = 'Juft sonlarni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Filter Even Numbers' FROM topic_tasks WHERE title = 'Juft sonlarni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Extract and print only even numbers from the given list, preserving original order.' FROM topic_tasks WHERE title = 'Juft sonlarni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Jup sanlardı ajıratıw' FROM topic_tasks WHERE title = 'Juft sonlarni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Dizimdegi tek jup sanlardı óz tártibinde ajıratıp shıǵarıń.' FROM topic_tasks WHERE title = 'Juft sonlarni ajratish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Ikkinchi eng katta son]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Второй максимум' FROM topic_tasks WHERE title = 'Ikkinchi eng katta son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Найдите второе по величине уникальное число в списке.' FROM topic_tasks WHERE title = 'Ikkinchi eng katta son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Second Largest Element' FROM topic_tasks WHERE title = 'Ikkinchi eng katta son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Find the second largest distinct number in the given list.' FROM topic_tasks WHERE title = 'Ikkinchi eng katta son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Ekinshi eń úlken san' FROM topic_tasks WHERE title = 'Ikkinchi eng katta son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Dizimdegi qaytalanbas ekinshi eń úlken sandı tabıń.' FROM topic_tasks WHERE title = 'Ikkinchi eng katta son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Kabisa yil]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Проверка високосного года' FROM topic_tasks WHERE title = 'Kabisa yil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Проверьте, является ли заданный год високосным, используя разветвляющееся условие.' FROM topic_tasks WHERE title = 'Kabisa yil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Leap Year Conditional' FROM topic_tasks WHERE title = 'Kabisa yil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Check if the given year is a leap year using standard conditional branching rules.' FROM topic_tasks WHERE title = 'Kabisa yil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Kábise jılı tekseriw' FROM topic_tasks WHERE title = 'Kabisa yil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Jıl berilgen. Onıń kábise jılı ekenligin if shárti arqalı tekseriń.' FROM topic_tasks WHERE title = 'Kabisa yil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Uchburchak turi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Тип треугольника' FROM topic_tasks WHERE title = 'Uchburchak turi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Определите вид треугольника по трем сторонам: Teng tomonli (равносторонний), Teng yonli (равнобедренный) или Turli tomonli (разносторонний).' FROM topic_tasks WHERE title = 'Uchburchak turi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Triangle Classification' FROM topic_tasks WHERE title = 'Uchburchak turi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Classify triangle by side lengths: Equilateral (Teng tomonli), Isosceles (Teng yonli), or Scalene (Turli tomonli).' FROM topic_tasks WHERE title = 'Uchburchak turi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Úshmúyeshlik túri' FROM topic_tasks WHERE title = 'Uchburchak turi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Úshmúyeshliktiń úsh tárepi berilgen. Onıń túrin anıqlań: Teń tárepli, Teń qabırǵalı yamasa Hár túrli tárepli.' FROM topic_tasks WHERE title = 'Uchburchak turi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [EKUB (Evklid algoritmi)]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Алгоритм Евклида (НОД)' FROM topic_tasks WHERE title = 'EKUB (Evklid algoritmi)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Вычислите НОД двух чисел с использованием алгоритма Евклида через цикл while.' FROM topic_tasks WHERE title = 'EKUB (Evklid algoritmi)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Euclidean GCD Algorithm' FROM topic_tasks WHERE title = 'EKUB (Evklid algoritmi)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Compute Greatest Common Divisor using Euclid''s algorithm with a while loop.' FROM topic_tasks WHERE title = 'EKUB (Evklid algoritmi)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'EÚUB (Evklid algoritmi)' FROM topic_tasks WHERE title = 'EKUB (Evklid algoritmi)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Eki sanniń EÚUB mánisin Evklid algoritmi (while cikli) járdeminde esaplań.' FROM topic_tasks WHERE title = 'EKUB (Evklid algoritmi)'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Mukammal son]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Совершенное число' FROM topic_tasks WHERE title = 'Mukammal son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Проверьте, является ли число совершенным (сумма всех его собственных делителей равна самому числу).' FROM topic_tasks WHERE title = 'Mukammal son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Perfect Number' FROM topic_tasks WHERE title = 'Mukammal son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Determine whether the given integer is a perfect number (equal to the sum of its proper positive divisors).' FROM topic_tasks WHERE title = 'Mukammal son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Kámil san' FROM topic_tasks WHERE title = 'Mukammal son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Berilgen sanniń ózinen basqa bóliwshileri qosındısı ózine teń ekenligin tekseriń.' FROM topic_tasks WHERE title = 'Mukammal son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [Kollatz ketma-ketligi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'title', 'Последовательность Коллатца' FROM topic_tasks WHERE title = 'Kollatz ketma-ketligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'ru', 'description', 'Для числа n постройте последовательность Коллатца до 1 и выведите количество шагов.' FROM topic_tasks WHERE title = 'Kollatz ketma-ketligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'title', 'Collatz Sequence Generator' FROM topic_tasks WHERE title = 'Kollatz ketma-ketligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'en', 'description', 'Generate the 3n+1 Collatz trajectory starting from n until reaching 1, and output total steps.' FROM topic_tasks WHERE title = 'Kollatz ketma-ketligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'title', 'Kollatz izbe-izligi' FROM topic_tasks WHERE title = 'Kollatz ketma-ketligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topic_tasks', id, 'kaa', 'description', 'Berilgen n sanı ushın Kollatz izbe-izligin 1 ge jetkenshe shıǵarıń hám qádemler sanın kórsetiń.' FROM topic_tasks WHERE title = 'Kollatz ketma-ketligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

END $$;
