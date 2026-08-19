-- ============================================================
-- EduCode — Baza kontenti tarjimalari: BARCHA MASALALAR (CHALLENGES)
--   51 ta amaliy va olimpiada masalasi to'liq 4 tilda (ru, en, kaa).
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
-- ============================================================

DO $$
BEGIN
  -- [sum-two-numbers]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Сумма двух чисел' FROM challenges WHERE slug = 'sum-two-numbers'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Даны два числа. Верните их сумму.' FROM challenges WHERE slug = 'sum-two-numbers'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Sum of Two Numbers' FROM challenges WHERE slug = 'sum-two-numbers'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given two numbers, return their sum.' FROM challenges WHERE slug = 'sum-two-numbers'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Eki sanniń qosındısı' FROM challenges WHERE slug = 'sum-two-numbers'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Eki san berilgen. Olardıń qosındısın qaytarıń.' FROM challenges WHERE slug = 'sum-two-numbers'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [even-or-odd]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Четное или нечетное' FROM challenges WHERE slug = 'even-or-odd'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Определите четность переданного числа. Верните "Juft", если число четное, и "Toq", если нечетное.' FROM challenges WHERE slug = 'even-or-odd'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Even or Odd' FROM challenges WHERE slug = 'even-or-odd'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Determine whether the given integer is even or odd. Return "Juft" for even numbers and "Toq" for odd numbers.' FROM challenges WHERE slug = 'even-or-odd'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Jup yamasa taq' FROM challenges WHERE slug = 'even-or-odd'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen sanniń jup yamasa taqlıǵın anıqlań. Jup bolsa "Juft", taq bolsa "Toq" qaytarıń.' FROM challenges WHERE slug = 'even-or-odd'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [max-element]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Максимальный элемент' FROM challenges WHERE slug = 'max-element'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Найдите максимальный элемент в переданном списке.' FROM challenges WHERE slug = 'max-element'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Maximum Element' FROM challenges WHERE slug = 'max-element'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Find the maximum element in the given list.' FROM challenges WHERE slug = 'max-element'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Eń úlken element' FROM challenges WHERE slug = 'max-element'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen dizimnen eń úlken elementti tabıń.' FROM challenges WHERE slug = 'max-element'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [palindrome-check]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Проверка на палиндром' FROM challenges WHERE slug = 'palindrome-check'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Проверьте, является ли строка палиндромом (читается одинаково в обоих направлениях). Верните "Ha" или "Yo''q".' FROM challenges WHERE slug = 'palindrome-check'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Palindrome Check' FROM challenges WHERE slug = 'palindrome-check'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Check if the given word is a palindrome (reads the same backwards and forwards). Return "Ha" or "Yo''q".' FROM challenges WHERE slug = 'palindrome-check'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Palindrom tekseriw' FROM challenges WHERE slug = 'palindrome-check'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen sózdiń palindrom ekenligin tekseriń. "Ha" yamasa "Yo''q" qaytarıń.' FROM challenges WHERE slug = 'palindrome-check'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [fibonacci]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Числа Фибоначчи' FROM challenges WHERE slug = 'fibonacci'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Верните n-е число Фибоначчи. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).' FROM challenges WHERE slug = 'fibonacci'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Fibonacci Sequence' FROM challenges WHERE slug = 'fibonacci'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Return the n-th Fibonacci number where F(0)=0, F(1)=1, and F(n)=F(n-1)+F(n-2).' FROM challenges WHERE slug = 'fibonacci'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Fibonachchi izbe-izligi' FROM challenges WHERE slug = 'fibonacci'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'n-shi Fibonachchi sanın qaytarıń. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).' FROM challenges WHERE slug = 'fibonacci'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [reverse-string]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Разворот строки' FROM challenges WHERE slug = 'reverse-string'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Разверните переданную строку задом наперед, не используя встроенные функции разворота.' FROM challenges WHERE slug = 'reverse-string'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Reverse String' FROM challenges WHERE slug = 'reverse-string'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Reverse the given string without relying on built-in reversal functions.' FROM challenges WHERE slug = 'reverse-string'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Tekstti keri awdarıw' FROM challenges WHERE slug = 'reverse-string'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen qatardı keri awdarıń. Tayın reverse funktsiyasın qollanbań.' FROM challenges WHERE slug = 'reverse-string'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-ortacha-ball]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Средний балл' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дано количество студентов в группе и их баллы. Выведите средний балл с округлением до 2 знаков после запятой.

Ввод:
1-я строка: n (количество студентов)
2-я строка: n целых чисел через пробел

Вывод: средний балл (например, 20.00)' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Average Score' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given the number of students and their scores, calculate and output the average score rounded to 2 decimal places.

Input:
Line 1: student count n
Line 2: n space-separated integers

Output: average score formatted to 2 decimals (e.g. 20.00)' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Ortasha ball' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Topardaǵı studentler sanı hám olardıń balları berilgen. Ortasha ballnı 2 qanaǵa shekem dóńgeletip shıǵarıń.

Kiriw:
1-qatar: studentler sanı n
2-qatar: n pútin san bos orın menen

Shıǵıw: ortasha ball (mısalı 20.00)' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-eng-uzun-soz]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Самое длинное слово' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дана строка слов, разделенных пробелом. Найдите самое длинное слово и выведите его вместе с длиной.

Если самых длинных слов несколько, выведите первое.

Ввод: одна строка текста
Вывод:
1-я строка: слово
2-я строка: его длина' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Longest Word' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given a space-separated string of words, find the longest word and its length.

If there is a tie for the longest word, print the first one.

Input: a single line of text
Output:
Line 1: the word
Line 2: its length' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Eń uzın sóz' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Bir qatarda bos orın menen ajıratılǵan sózler berilgen. Eń uzın sózdi hám onıń uzınlıǵın tabıń.

Bir neshe sóz teń uzınlıqta bolsa, birinshisin shıǵarıń.

Kiriw: bir qatar tekst
Shıǵıw:
1-qatar: sóz
2-qatar: onıń uzınlıǵı' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-juft-raqamlar]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Сумма четных цифр' FROM challenges WHERE slug = 'oly-juft-raqamlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дано неотрицательное целое число. Найдите сумму только его четных цифр.

Ввод: одно целое число
Вывод: сумма четных цифр' FROM challenges WHERE slug = 'oly-juft-raqamlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Sum of Even Digits' FROM challenges WHERE slug = 'oly-juft-raqamlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given a non-negative integer, compute the sum of all its even digits.

Input: a single integer
Output: sum of even digits' FROM challenges WHERE slug = 'oly-juft-raqamlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Jup cifrlar qosındısı' FROM challenges WHERE slug = 'oly-juft-raqamlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Keri emes pútin san berilgen. Onıń tek jup cifrlarınıń qosındısın tabıń.

Kiriw: bir pútin san
Shıǵıw: jup cifrlar qosındısı' FROM challenges WHERE slug = 'oly-juft-raqamlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-harf-chastotasi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Самая частая буква' FROM challenges WHERE slug = 'oly-harf-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дана строка текста. Не учитывая пробелы, найдите наиболее часто встречающуюся букву и количество ее вхождений.

При равенстве частот выведите первую по алфавиту.

Ввод: строка текста
Вывод: буква и ее количество через пробел' FROM challenges WHERE slug = 'oly-harf-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Most Frequent Letter' FROM challenges WHERE slug = 'oly-harf-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given a string of text, find the most frequent letter (ignoring spaces) and its occurrence count.

In case of a tie, output the alphabetically smallest letter.

Input: a line of text
Output: letter and count separated by a space' FROM challenges WHERE slug = 'oly-harf-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Eń kóp ushırasqan hárip' FROM challenges WHERE slug = 'oly-harf-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Bir qatar tekst berilgen. Bos orınlardı esapqa almaǵan halda, eń kóp ushırasqan háripti hám onıń sanın tabıń.

Kiriw: bir qatar tekst
Shıǵıw: hárip hám onıń sanı bos orın menen' FROM challenges WHERE slug = 'oly-harf-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-mediana]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Медиана' FROM challenges WHERE slug = 'oly-mediana'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дано n целых чисел. Отсортируйте их по возрастанию и найдите медиану.

Ввод:
1-я строка: n
2-я строка: n чисел через пробел

Вывод:
1-я строка: отсортированные числа
2-я строка: медиана (округленная до 2 знаков)' FROM challenges WHERE slug = 'oly-mediana'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Median' FROM challenges WHERE slug = 'oly-mediana'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given n integers, sort them in ascending order and determine their median value.

Input:
Line 1: integer n
Line 2: n space-separated integers

Output:
Line 1: sorted integers
Line 2: median rounded to 2 decimal places' FROM challenges WHERE slug = 'oly-mediana'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Mediana' FROM challenges WHERE slug = 'oly-mediana'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'n pútin san berilgen. Olardı ósiw tártibinde shıǵarıń hám medianasın tabıń.

Kiriw:
1-qatar: n
2-qatar: n san bos orın menen

Shıǵıw:
1-qatar: tártiplengen sanlar
2-qatar: mediana 2 qanaǵa shekem' FROM challenges WHERE slug = 'oly-mediana'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-tub-kopaytuvchilar]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Простые множители' FROM challenges WHERE slug = 'oly-tub-kopaytuvchilar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дано целое число n > 1. Разложите его на простые множители и выведите их в порядке возрастания.

Ввод: целое число n
Вывод: простые множители через пробел' FROM challenges WHERE slug = 'oly-tub-kopaytuvchilar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Prime Factors' FROM challenges WHERE slug = 'oly-tub-kopaytuvchilar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given an integer n > 1, factorize it into prime numbers and output them in ascending order.

Input: integer n
Output: space-separated prime factors' FROM challenges WHERE slug = 'oly-tub-kopaytuvchilar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Ápiwayı kóbeytiwshiler' FROM challenges WHERE slug = 'oly-tub-kopaytuvchilar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', '1 den úlken pútin san berilgen. Onı ápiwayı kóbeytiwshilerge ajıratıń hám ósiw tártibinde shıǵarıń.

Kiriw: bir pútin san n
Shıǵıw: ápiwayı kóbeytiwshiler bos orın menen' FROM challenges WHERE slug = 'oly-tub-kopaytuvchilar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-noyob-sozlar]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Уникальные слова' FROM challenges WHERE slug = 'oly-noyob-sozlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дана строка текста. Выведите все уникальные (без повторений) слова в алфавитном порядке.

Ввод: строка текста
Вывод: уникальные слова в алфавитном порядке' FROM challenges WHERE slug = 'oly-noyob-sozlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Unique Words' FROM challenges WHERE slug = 'oly-noyob-sozlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given a string of text, extract all distinct words and output them in alphabetical order.

Input: a line of text
Output: unique words in alphabetical order' FROM challenges WHERE slug = 'oly-noyob-sozlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Qaytalanbas sózler' FROM challenges WHERE slug = 'oly-noyob-sozlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Bir qatar tekst berilgen. Ondaǵı qaytalanbas (unikal) sózlerdi álipbe tártibinde shıǵarıń.

Kiriw: bir qatar tekst
Shıǵıw: álipbe tártibindegi qaytalanbas sózler' FROM challenges WHERE slug = 'oly-noyob-sozlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-piramida]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Числовая пирамида' FROM challenges WHERE slug = 'oly-piramida'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дано натуральное число n. Постройте симметричную числовую пирамиду высотой n строк.' FROM challenges WHERE slug = 'oly-piramida'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Number Pyramid' FROM challenges WHERE slug = 'oly-piramida'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given a positive integer n, print a symmetric numeric pyramid of height n.' FROM challenges WHERE slug = 'oly-piramida'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Sanlı piramida' FROM challenges WHERE slug = 'oly-piramida'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Oń pútin san n berilgen. Biyikligi n bolǵan simmetriyalı sanlı piramidanı shıǵarıń.' FROM challenges WHERE slug = 'oly-piramida'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-kollatz-eng-uzun]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Самая длинная цепочка Коллатца' FROM challenges WHERE slug = 'oly-kollatz-eng-uzun'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Среди чисел от 1 до n найдите число, порождающее самую длинную последовательность Коллатца (3x+1), и число шагов.' FROM challenges WHERE slug = 'oly-kollatz-eng-uzun'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Longest Collatz Sequence' FROM challenges WHERE slug = 'oly-kollatz-eng-uzun'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Find the starting number under n that produces the longest Collatz (3x+1) sequence, along with its step count.' FROM challenges WHERE slug = 'oly-kollatz-eng-uzun'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Eń uzın Kollatz shınjırı' FROM challenges WHERE slug = 'oly-kollatz-eng-uzun'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', '1 den n ge shekem bolǵan sanlar arasınan eń uzın Kollatz izbe-izligin jaratıwshı sandı hám qádemler sanın tabıń.' FROM challenges WHERE slug = 'oly-kollatz-eng-uzun'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-qavslar]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Правильная скобочная последовательность' FROM challenges WHERE slug = 'oly-qavslar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дана строка, состоящая из скобок () [] {}. Проверьте ее корректность (баланс скобок).' FROM challenges WHERE slug = 'oly-qavslar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Valid Parentheses' FROM challenges WHERE slug = 'oly-qavslar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given a string containing only brackets () [] {}, determine if the bracket sequence is valid and balanced.' FROM challenges WHERE slug = 'oly-qavslar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Qawıslar durıslıǵı' FROM challenges WHERE slug = 'oly-qavslar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Tek () [] {} qawıslarınan ibarat qatar berilgen. Qawıslardıń durıs ornalasqanlıǵın tekseriń.' FROM challenges WHERE slug = 'oly-qavslar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-ikkilik]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Двоичная система счисления' FROM challenges WHERE slug = 'oly-ikkilik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Переведите десятичное число в двоичную систему счисления и подсчитайте количество единиц в записи.' FROM challenges WHERE slug = 'oly-ikkilik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Binary Conversion & Bit Count' FROM challenges WHERE slug = 'oly-ikkilik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Convert a decimal integer to its binary representation and count the total number of set bits (ones).' FROM challenges WHERE slug = 'oly-ikkilik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Ekilik sanaq sisteması' FROM challenges WHERE slug = 'oly-ikkilik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Onlıq sanaq sistemasındaǵı sandı ekilik sanaq sistemasına ótkeriń hám ondaǵı birler sanın sanań.' FROM challenges WHERE slug = 'oly-ikkilik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-anagramma]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Анаграммы' FROM challenges WHERE slug = 'oly-anagramma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Даны две строки. Проверьте, являются ли они анаграммами (состоят ли из одного набора символов).' FROM challenges WHERE slug = 'oly-anagramma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Anagram Verification' FROM challenges WHERE slug = 'oly-anagramma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given two strings, determine whether they are anagrams of each other (contain identical character frequencies).' FROM challenges WHERE slug = 'oly-anagramma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Anagramma' FROM challenges WHERE slug = 'oly-anagramma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Eki qatar berilgen. Olardıń bir-birine anagramma ekenligin tekseriń.' FROM challenges WHERE slug = 'oly-anagramma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-matritsa-diagonal]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Диагонали матрицы' FROM challenges WHERE slug = 'oly-matritsa-diagonal'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дана квадратная матрица n x n. Вычислите суммы элементов главной и побочной диагоналей.' FROM challenges WHERE slug = 'oly-matritsa-diagonal'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Matrix Diagonals' FROM challenges WHERE slug = 'oly-matritsa-diagonal'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given an n x n square matrix, calculate the sum of elements on both the main and secondary diagonals.' FROM challenges WHERE slug = 'oly-matritsa-diagonal'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Matrica diagonalları' FROM challenges WHERE slug = 'oly-matritsa-diagonal'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'n x n kvadrat matrica berilgen. Tiykarǵı hám qosımsha diagonalları qosındısın esaplań.' FROM challenges WHERE slug = 'oly-matritsa-diagonal'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-fibonachchi-mod]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Числа Фибоначчи по модулю' FROM challenges WHERE slug = 'oly-fibonachchi-mod'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Для большого числа n найдите остаток от деления n-го числа Фибоначчи на модуль m (период Пизано).' FROM challenges WHERE slug = 'oly-fibonachchi-mod'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Fibonacci Modulo m' FROM challenges WHERE slug = 'oly-fibonachchi-mod'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Compute the n-th Fibonacci number modulo m for large n using the Pisano period optimization.' FROM challenges WHERE slug = 'oly-fibonachchi-mod'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Fibonachchi qaldıq penen' FROM challenges WHERE slug = 'oly-fibonachchi-mod'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Úlken n sanı ushın n-shi Fibonachchi sanınıń berilgen m moduly boyınsha qaldıǵın tabıń.' FROM challenges WHERE slug = 'oly-fibonachchi-mod'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [oly-eng-kop-takrorlangan]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Наиболее частый элемент' FROM challenges WHERE slug = 'oly-eng-kop-takrorlangan'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Найдите наиболее часто встречающийся элемент в массиве. При равенстве верните наименьший из них.' FROM challenges WHERE slug = 'oly-eng-kop-takrorlangan'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Most Frequent Element' FROM challenges WHERE slug = 'oly-eng-kop-takrorlangan'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Find the most frequently occurring element in an array. If there is a tie, return the smallest value.' FROM challenges WHERE slug = 'oly-eng-kop-takrorlangan'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Eń kóp tákirarlanǵan san' FROM challenges WHERE slug = 'oly-eng-kop-takrorlangan'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Massivte eń kóp ushırasqan elementti tabıń. Teń bolsa, eń kishisin qaytarıń.' FROM challenges WHERE slug = 'oly-eng-kop-takrorlangan'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-salom-dunyo]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Привет, мир!' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Выведите на экран точный текст: "Salom, dunyo!".' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Hello, World!' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Print the exact string "Salom, dunyo!" to the console.' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Sálem, dúnya!' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Ekranǵa "Salom, dunyo!" tekstin shıǵarıń.' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-ikki-son-kopaytma]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Произведение двух чисел' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Даны два целых числа. Выведите их произведение.' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Product of Two Numbers' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given two integers, compute and output their product.' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Eki sanniń kóbeymesi' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Eki pútin san berilgen. Olardıń kóbeymesin shıǵarıń.' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-kvadrat]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Квадрат числа' FROM challenges WHERE slug = 'ch-kvadrat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Выведите квадрат переданного числа.' FROM challenges WHERE slug = 'ch-kvadrat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Square of a Number' FROM challenges WHERE slug = 'ch-kvadrat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Output the square of the given number.' FROM challenges WHERE slug = 'ch-kvadrat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Sanniń kvadratı' FROM challenges WHERE slug = 'ch-kvadrat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen sanniń kvadratın shıǵarıń.' FROM challenges WHERE slug = 'ch-kvadrat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-ishorani-almashtirish]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Смена знака числа' FROM challenges WHERE slug = 'ch-ishorani-almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Измените знак переданного числа на противоположный (положительное на отрицательное и наоборот).' FROM challenges WHERE slug = 'ch-ishorani-almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Invert Number Sign' FROM challenges WHERE slug = 'ch-ishorani-almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Invert the sign of the given number (positive to negative, negative to positive).' FROM challenges WHERE slug = 'ch-ishorani-almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Belgini almastırıw' FROM challenges WHERE slug = 'ch-ishorani-almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen sanniń belgisini keri ózgertiń (oń sandı teris, teris sandı oń etiń).' FROM challenges WHERE slug = 'ch-ishorani-almashtirish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-oxirgi-raqam]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Последняя цифра' FROM challenges WHERE slug = 'ch-oxirgi-raqam'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Найдите последнюю цифру положительного целого числа.' FROM challenges WHERE slug = 'ch-oxirgi-raqam'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Last Digit' FROM challenges WHERE slug = 'ch-oxirgi-raqam'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Extract and output the last digit of a positive integer.' FROM challenges WHERE slug = 'ch-oxirgi-raqam'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Aqırǵı cifr' FROM challenges WHERE slug = 'ch-oxirgi-raqam'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Oń pútin sanniń aqırǵı cifrın tabıń.' FROM challenges WHERE slug = 'ch-oxirgi-raqam'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-yosh-hisobi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Расчет возраста' FROM challenges WHERE slug = 'ch-yosh-hisobi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дан год рождения. Рассчитайте возраст пользователя относительно текущего 2026 года.' FROM challenges WHERE slug = 'ch-yosh-hisobi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Age Calculation' FROM challenges WHERE slug = 'ch-yosh-hisobi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given the birth year, compute age assuming the current year is 2026.' FROM challenges WHERE slug = 'ch-yosh-hisobi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Jastı esaplaw' FROM challenges WHERE slug = 'ch-yosh-hisobi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Tuwılǵan jılı berilgen. Házirgi 2026-jılǵa salıstırǵanda jastı esaplań.' FROM challenges WHERE slug = 'ch-yosh-hisobi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-soniya-daqiqa]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Перевод секунд в минуты' FROM challenges WHERE slug = 'ch-soniya-daqiqa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Переведите время в секундах в формат полных минут и оставшихся секунд.' FROM challenges WHERE slug = 'ch-soniya-daqiqa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Seconds to Minutes' FROM challenges WHERE slug = 'ch-soniya-daqiqa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Convert total seconds into full minutes and remaining seconds.' FROM challenges WHERE slug = 'ch-soniya-daqiqa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Sekundtı minutqa aylandırıw' FROM challenges WHERE slug = 'ch-soniya-daqiqa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Sekundta berilgen waqıttı tolıq minutlar hám qalǵan sekundlarǵa ajıratıń.' FROM challenges WHERE slug = 'ch-soniya-daqiqa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-matn-uzunligi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Длина строки' FROM challenges WHERE slug = 'ch-matn-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Выведите количество символов во введенной строке.' FROM challenges WHERE slug = 'ch-matn-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'String Length' FROM challenges WHERE slug = 'ch-matn-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Output the total number of characters in the input string.' FROM challenges WHERE slug = 'ch-matn-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Tekst uzınlıǵı' FROM challenges WHERE slug = 'ch-matn-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Kiritilgen qatardaǵı belgiler sanın shıǵarıń.' FROM challenges WHERE slug = 'ch-matn-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-uchburchak-yuzasi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Площадь треугольника' FROM challenges WHERE slug = 'ch-uchburchak-yuzasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Вычислите площадь треугольника по основанию a и высоте h (S = (a * h) / 2).' FROM challenges WHERE slug = 'ch-uchburchak-yuzasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Area of Triangle' FROM challenges WHERE slug = 'ch-uchburchak-yuzasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Compute triangle area given base a and height h (S = (a * h) / 2).' FROM challenges WHERE slug = 'ch-uchburchak-yuzasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Úshmúyeshlik maydanı' FROM challenges WHERE slug = 'ch-uchburchak-yuzasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Tiykarı a hám biyikligi h berilgen úshmúyeshlik maydanın esaplań.' FROM challenges WHERE slug = 'ch-uchburchak-yuzasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-fahrenheit]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Цельсий в Фаренгейт' FROM challenges WHERE slug = 'ch-fahrenheit'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Переведите температуру из градусов Цельсия в Фаренгейты: F = C * 1.8 + 32.' FROM challenges WHERE slug = 'ch-fahrenheit'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Celsius to Fahrenheit' FROM challenges WHERE slug = 'ch-fahrenheit'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Convert temperature from Celsius to Fahrenheit: F = C * 1.8 + 32.' FROM challenges WHERE slug = 'ch-fahrenheit'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Celsiydan Farengeytke' FROM challenges WHERE slug = 'ch-fahrenheit'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Temperaturanı Celsiy shkalasınan Farengeytke aylandırıń: F = C * 1.8 + 32.' FROM challenges WHERE slug = 'ch-fahrenheit'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-narx-chegirma]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Цена со скидкой' FROM challenges WHERE slug = 'ch-narx-chegirma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дана исходная цена товара и процент скидки. Рассчитайте итоговую стоимость.' FROM challenges WHERE slug = 'ch-narx-chegirma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Discounted Price' FROM challenges WHERE slug = 'ch-narx-chegirma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given the original price and discount percentage, calculate the final payable price.' FROM challenges WHERE slug = 'ch-narx-chegirma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Shegirilmeli baha' FROM challenges WHERE slug = 'ch-narx-chegirma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Ónim bahasın hám shegirim procentin esapqa alıp juwmaqlawshı bahanı tabıń.' FROM challenges WHERE slug = 'ch-narx-chegirma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-kub-hajmi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Объем и площадь куба' FROM challenges WHERE slug = 'ch-kub-hajmi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Для куба с ребром a вычислите объем (V = a^3) и полную площадь поверхности (S = 6 * a^2).' FROM challenges WHERE slug = 'ch-kub-hajmi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Cube Volume & Surface' FROM challenges WHERE slug = 'ch-kub-hajmi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'For a cube with side length a, calculate volume (V = a^3) and surface area (S = 6 * a^2).' FROM challenges WHERE slug = 'ch-kub-hajmi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Kub kólemi hám maydanı' FROM challenges WHERE slug = 'ch-kub-hajmi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Qabırǵası a bolǵan kubtıń kólemin hám tolıq maydanın esaplań.' FROM challenges WHERE slug = 'ch-kub-hajmi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-uch-sondan-kichik]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Минимум из трех чисел' FROM challenges WHERE slug = 'ch-uch-sondan-kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Определите наименьшее число среди трех введенных чисел.' FROM challenges WHERE slug = 'ch-uch-sondan-kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Minimum of Three Numbers' FROM challenges WHERE slug = 'ch-uch-sondan-kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Determine the smallest integer among three given inputs.' FROM challenges WHERE slug = 'ch-uch-sondan-kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Úsh sannan eń kishisi' FROM challenges WHERE slug = 'ch-uch-sondan-kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen úsh sannan eń kishisin anıqlań.' FROM challenges WHERE slug = 'ch-uch-sondan-kichik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-kabisa-yili]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Високосный год' FROM challenges WHERE slug = 'ch-kabisa-yili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Определите, является ли указанный год високосным. Выведите "Kabisa" или "Oddiy".' FROM challenges WHERE slug = 'ch-kabisa-yili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Leap Year Check' FROM challenges WHERE slug = 'ch-kabisa-yili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Determine if the given year is a leap year. Output "Kabisa" or "Oddiy".' FROM challenges WHERE slug = 'ch-kabisa-yili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Kábise jılı' FROM challenges WHERE slug = 'ch-kabisa-yili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen jıldıń kábise jılı ekenligin tekseriń. "Kabisa" yamasa "Oddiy" dep shıǵarıń.' FROM challenges WHERE slug = 'ch-kabisa-yili'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-hafta-kuni]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'День недели' FROM challenges WHERE slug = 'ch-hafta-kuni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'По номеру дня от 1 до 7 выведите название дня недели на узбекском языке.' FROM challenges WHERE slug = 'ch-hafta-kuni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Day of the Week' FROM challenges WHERE slug = 'ch-hafta-kuni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given an integer from 1 to 7, print the corresponding day name.' FROM challenges WHERE slug = 'ch-hafta-kuni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Hápte kúni' FROM challenges WHERE slug = 'ch-hafta-kuni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', '1 den 7 ge shekemgi sanǵa sáykes hápte kúniniń atın shıǵarıń.' FROM challenges WHERE slug = 'ch-hafta-kuni'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-parol-uzunligi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Проверка длины пароля' FROM challenges WHERE slug = 'ch-parol-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Если пароль содержит 8 и более символов, выведите "Yaroqli", иначе "Qisqa".' FROM challenges WHERE slug = 'ch-parol-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Password Length Validation' FROM challenges WHERE slug = 'ch-parol-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Output "Yaroqli" if password has 8+ characters, otherwise "Qisqa".' FROM challenges WHERE slug = 'ch-parol-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Parol uzınlıǵın tekseriw' FROM challenges WHERE slug = 'ch-parol-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Parol 8 yamasa odan kóp belgiden ibarat bolsa "Yaroqli", bolmasa "Qisqa" dep shıǵarıń.' FROM challenges WHERE slug = 'ch-parol-uzunligi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-juft-toq-belgi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Знак и четность числа' FROM challenges WHERE slug = 'ch-juft-toq-belgi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Определите, является ли число положительным/отрицательным и четным/нечетным.' FROM challenges WHERE slug = 'ch-juft-toq-belgi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Sign and Parity' FROM challenges WHERE slug = 'ch-juft-toq-belgi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Determine both sign (positive/negative) and parity (even/odd) of the given integer.' FROM challenges WHERE slug = 'ch-juft-toq-belgi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Sanniń belgisi hám juplıǵı' FROM challenges WHERE slug = 'ch-juft-toq-belgi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Sanniń oń/teris hám jup/taqlıǵın anıqlań.' FROM challenges WHERE slug = 'ch-juft-toq-belgi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-yigindi-1dan-ngacha]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Сумма чисел от 1 до n' FROM challenges WHERE slug = 'ch-yigindi-1dan-ngacha'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Вычислите сумму всех натуральных чисел от 1 до n включительно.' FROM challenges WHERE slug = 'ch-yigindi-1dan-ngacha'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Sum from 1 to n' FROM challenges WHERE slug = 'ch-yigindi-1dan-ngacha'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Compute the sum of all natural integers from 1 up to n.' FROM challenges WHERE slug = 'ch-yigindi-1dan-ngacha'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', '1 den n ge shekemgi qosındı' FROM challenges WHERE slug = 'ch-yigindi-1dan-ngacha'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', '1 den n ge shekem bolǵan barlıq natural sanlar qosındısın esaplań.' FROM challenges WHERE slug = 'ch-yigindi-1dan-ngacha'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-raqamlar-yigindisi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Сумма цифр' FROM challenges WHERE slug = 'ch-raqamlar-yigindisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Найдите сумму всех цифр переданного целого числа.' FROM challenges WHERE slug = 'ch-raqamlar-yigindisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Sum of Digits' FROM challenges WHERE slug = 'ch-raqamlar-yigindisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Calculate the sum of all digits in the given integer.' FROM challenges WHERE slug = 'ch-raqamlar-yigindisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Cifrlar qosındısı' FROM challenges WHERE slug = 'ch-raqamlar-yigindisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen pútin sanniń barlıq cifrları qosındısın tabıń.' FROM challenges WHERE slug = 'ch-raqamlar-yigindisi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-teskari-son]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Число задом наперед' FROM challenges WHERE slug = 'ch-teskari-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Запишите цифры переданного числа в обратном порядке (например, 123 -> 321).' FROM challenges WHERE slug = 'ch-teskari-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Reverse Number Digits' FROM challenges WHERE slug = 'ch-teskari-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Reverse the order of digits of the given integer (e.g. 123 -> 321).' FROM challenges WHERE slug = 'ch-teskari-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Sandı keri jazıw' FROM challenges WHERE slug = 'ch-teskari-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen sanniń cifrların keri tártipte jazıń (mısalı 123 -> 321).' FROM challenges WHERE slug = 'ch-teskari-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-tub-son]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Простое число?' FROM challenges WHERE slug = 'ch-tub-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Проверьте, является ли число простым. Выведите "Tub" или "Tub emas".' FROM challenges WHERE slug = 'ch-tub-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Prime Number Test' FROM challenges WHERE slug = 'ch-tub-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Determine if the given number is prime. Output "Tub" or "Tub emas".' FROM challenges WHERE slug = 'ch-tub-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Ápiwayı sanba?' FROM challenges WHERE slug = 'ch-tub-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen sanniń ápiwayı san ekenligin tekseriń. "Tub" yamasa "Tub emas" dep shıǵarıń.' FROM challenges WHERE slug = 'ch-tub-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-palindrom-son]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Числовой палиндром' FROM challenges WHERE slug = 'ch-palindrom-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Проверьте, читается ли число одинаково слева направо и справа налево.' FROM challenges WHERE slug = 'ch-palindrom-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Numeric Palindrome' FROM challenges WHERE slug = 'ch-palindrom-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Check if the integer is a numeric palindrome (identical in forward and backward reads).' FROM challenges WHERE slug = 'ch-palindrom-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Palindrom san' FROM challenges WHERE slug = 'ch-palindrom-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Sanniń ońnan da, shepten de birdey oqılıwın tekseriń.' FROM challenges WHERE slug = 'ch-palindrom-son'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-fibonachchi-n]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'n-е число Фибоначчи' FROM challenges WHERE slug = 'ch-fibonachchi-n'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Вычислите n-е число Фибоначчи с использованием цикла.' FROM challenges WHERE slug = 'ch-fibonachchi-n'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'n-th Fibonacci (Iterative)' FROM challenges WHERE slug = 'ch-fibonachchi-n'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Compute the n-th Fibonacci number using an iterative loop.' FROM challenges WHERE slug = 'ch-fibonachchi-n'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'n-shi Fibonachchi sanı' FROM challenges WHERE slug = 'ch-fibonachchi-n'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'n-shi Fibonachchi sanın cikl járdeminde esaplań.' FROM challenges WHERE slug = 'ch-fibonachchi-n'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-vokal-undosh]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Гласные и согласные' FROM challenges WHERE slug = 'ch-vokal-undosh'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Подсчитайте раздельно количество гласных и согласных букв в строке.' FROM challenges WHERE slug = 'ch-vokal-undosh'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Vowels and Consonants' FROM challenges WHERE slug = 'ch-vokal-undosh'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Count vowels and consonants separately within the given text.' FROM challenges WHERE slug = 'ch-vokal-undosh'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Dawıslı hám dawıssız háripler' FROM challenges WHERE slug = 'ch-vokal-undosh'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Teksttegi dawıslı hám dawıssız háripler sanın bólek-bólek sanań.' FROM challenges WHERE slug = 'ch-vokal-undosh'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-royxat-ortachasi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Среднее арифметическое списка' FROM challenges WHERE slug = 'ch-royxat-ortachasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Найдите среднее арифметическое элементов списка чисел.' FROM challenges WHERE slug = 'ch-royxat-ortachasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'List Arithmetic Mean' FROM challenges WHERE slug = 'ch-royxat-ortachasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Compute the arithmetic mean of numbers in the list.' FROM challenges WHERE slug = 'ch-royxat-ortachasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Dizimniń ortashası' FROM challenges WHERE slug = 'ch-royxat-ortachasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Sanlar diziminiń orta arifmetikalıq mánisin tabıń.' FROM challenges WHERE slug = 'ch-royxat-ortachasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-sonlar-saralash]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Сортировка по убыванию' FROM challenges WHERE slug = 'ch-sonlar-saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Отсортируйте список чисел по убыванию (от большего к меньшему).' FROM challenges WHERE slug = 'ch-sonlar-saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Sort Descending' FROM challenges WHERE slug = 'ch-sonlar-saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Sort the given numeric sequence in descending order (highest to lowest).' FROM challenges WHERE slug = 'ch-sonlar-saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Kemeyiw tártibinde saralaw' FROM challenges WHERE slug = 'ch-sonlar-saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Berilgen sanlar dizimin kemeyiw tártibinde saralań.' FROM challenges WHERE slug = 'ch-sonlar-saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-ballar-statistikasi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Статистика баллов' FROM challenges WHERE slug = 'ch-ballar-statistikasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'По списку экзаменационных баллов найдите максимальный, минимальный и средний результат.' FROM challenges WHERE slug = 'ch-ballar-statistikasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Score Statistics' FROM challenges WHERE slug = 'ch-ballar-statistikasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'From the exam scores list, determine max, min, and average score values.' FROM challenges WHERE slug = 'ch-ballar-statistikasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Ballar statistikası' FROM challenges WHERE slug = 'ch-ballar-statistikasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Imtixan balları diziminen eń joqarı, eń tómen hám ortasha nátiyjeni tabıń.' FROM challenges WHERE slug = 'ch-ballar-statistikasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-sozlar-chastotasi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Частота слов' FROM challenges WHERE slug = 'ch-sozlar-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Подсчитайте частоту каждого слова в тексте с использованием словаря (dict).' FROM challenges WHERE slug = 'ch-sozlar-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Word Frequency Dictionary' FROM challenges WHERE slug = 'ch-sozlar-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Count occurrences of every word in the text using a dictionary/hash map.' FROM challenges WHERE slug = 'ch-sozlar-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Sózler jiyiligi' FROM challenges WHERE slug = 'ch-sozlar-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Tekstte hár bir sóz neshe márte ushırasqanın sózlik (dict) járdeminde sanań.' FROM challenges WHERE slug = 'ch-sozlar-chastotasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-qavslar-balansi]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Баланс круглых скобок' FROM challenges WHERE slug = 'ch-qavslar-balansi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Проверьте правильность расстановки и закрытия круглых скобок ''('' и '')'' в строке.' FROM challenges WHERE slug = 'ch-qavslar-balansi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Round Brackets Balance' FROM challenges WHERE slug = 'ch-qavslar-balansi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Verify if round parentheses ''('' and '')'' are properly structured and balanced.' FROM challenges WHERE slug = 'ch-qavslar-balansi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Dóńgelek qawıslar balansı' FROM challenges WHERE slug = 'ch-qavslar-balansi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Qatardaǵı dóńgelek qawıslardıń ''('' hám '')'' durıs jabılǵanlıǵın tekseriń.' FROM challenges WHERE slug = 'ch-qavslar-balansi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- [ch-ikkilik-qidiruv]
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Бинарный поиск' FROM challenges WHERE slug = 'ch-ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Найдите индекс заданного элемента в отсортированном массиве методом бинарного поиска.' FROM challenges WHERE slug = 'ch-ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Binary Search' FROM challenges WHERE slug = 'ch-ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Find the index of the target value in a sorted array using binary search.' FROM challenges WHERE slug = 'ch-ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Ekilik izlew (Binary search)' FROM challenges WHERE slug = 'ch-ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Tártiplengen massivte berilgen sanniń indeksin ekilik izlew arqalı tabıń.' FROM challenges WHERE slug = 'ch-ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

END $$;
