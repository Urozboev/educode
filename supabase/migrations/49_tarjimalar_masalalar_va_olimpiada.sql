-- ============================================================
-- EduCode — Baza kontenti tarjimalari: MASALALAR VA OLIMPIADALAR
--   1. Musobaqalar (contests) -> ru, en, kaa
--   2. Olimpiada masalalari (15 ta challenges) -> ru, en, kaa
--   3. Mustaqil amaliy masalalar (30 ta challenges) -> ru, en, kaa
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
-- ============================================================

DO $$
BEGIN
  -- ============================================================
  -- 1. MUSOBAQALAR (CONTESTS)
  -- ============================================================

  -- 1.1 1-bosqich olimpiadasi
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'ru', 'title', 'Основы программирования: Олимпиада 1-го этапа' FROM contests WHERE slug = 'dasturlash-asoslari-1-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'ru', 'description', 'Вводный этап по темам 1-6 учебной программы. Базовый синтаксис, арифметика, работа со строками и списками.' FROM contests WHERE slug = 'dasturlash-asoslari-1-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'ru', 'rules_html', '<h3>Правила</h3><ul><li>Длительность соревнования — 3 часа, количество задач — 5.</li><li>Каждая задача принимает ввод через <b>stdin</b> и выводит результат в <b>stdout</b>.</li><li>Решение засчитывается при прохождении всех тестов.</li><li>Рейтинг: по количеству решенных задач, затем по штрафному времени.</li><li>За каждую неверную попытку начисляется <b>20 минут</b> штрафа (при условии последующей сдачи).</li><li>Использование сторонней помощи и плагиат строго запрещены.</li></ul>' FROM contests WHERE slug = 'dasturlash-asoslari-1-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'en', 'title', 'Programming Fundamentals: Stage 1 Olympiad' FROM contests WHERE slug = 'dasturlash-asoslari-1-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'en', 'description', 'Introductory contest covering curriculum topics 1-6. Syntax, arithmetic, strings, and list processing.' FROM contests WHERE slug = 'dasturlash-asoslari-1-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'en', 'rules_html', '<h3>Contest Rules</h3><ul><li>Duration: 3 hours, 5 problems.</li><li>Standard I/O: input via <b>stdin</b>, output to <b>stdout</b>.</li><li>Binary scoring: full points on all tests passed, no partial scoring.</li><li>Standings: solved problem count first, then penalty time.</li><li>Incorrect submission penalty: <b>20 minutes</b> added only for solved tasks.</li><li>Plagiarism and unauthorized external assistance are strictly prohibited.</li></ul>' FROM contests WHERE slug = 'dasturlash-asoslari-1-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'kaa', 'title', 'Dastúrlew tiykarları: 1-basqısh olimpiadası' FROM contests WHERE slug = 'dasturlash-asoslari-1-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'kaa', 'description', 'Pán baǵdarlamasınıń 1-6 temaları boyınsha kirisiw basqıshı. Sintaksis, arifmetikalıq ámeller, tekst hám dizimler menen islesiw.' FROM contests WHERE slug = 'dasturlash-asoslari-1-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'kaa', 'rules_html', '<h3>Qaǵıydalar</h3><ul><li>Jarıs dawamlılıǵı — 3 saat, máseleler sanı — 5.</li><li>Hár bir másele <b>stdin</b> arqalı maǵlıwmat aladı hám <b>stdout</b> qa nátiyje shıǵaradı.</li><li>Sheshim barlıq testlerden ótse qabıl etiledi.</li><li>Reyting: aldın sheshilgen máseleler sanı, soń járiypa waqtı esapqa alınadı.</li><li>Hár bir nadurıs urınıs ushın <b>20 minut</b> járiypa qosıladı.</li><li>Kóshiriw hám sırtqı járdem qadaǵan etiledi.</li></ul>' FROM contests WHERE slug = 'dasturlash-asoslari-1-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.2 2-bosqich olimpiadasi
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'ru', 'title', 'Основы программирования: Олимпиада 2-го этапа' FROM contests WHERE slug = 'dasturlash-asoslari-2-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'ru', 'description', 'Второй этап по темам 7-11. Условия, словари, множества, циклы while, пользовательские функции и модули.' FROM contests WHERE slug = 'dasturlash-asoslari-2-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'en', 'title', 'Programming Fundamentals: Stage 2 Olympiad' FROM contests WHERE slug = 'dasturlash-asoslari-2-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'en', 'description', 'Intermediate contest on curriculum topics 7-11: branching, dictionaries, sets, while loops, functions, and modules.' FROM contests WHERE slug = 'dasturlash-asoslari-2-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'kaa', 'title', 'Dastúrlew tiykarları: 2-basqısh olimpiadası' FROM contests WHERE slug = 'dasturlash-asoslari-2-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'kaa', 'description', 'Pán baǵdarlamasınıń 7-11 temaları boyınsha orta basqısh. Shártler, sózlikler, kóplikler, while cikli, funktsiyalar hám moduller.' FROM contests WHERE slug = 'dasturlash-asoslari-2-bosqich'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.3 Yakuniy olimpiada
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'ru', 'title', 'Основы программирования: Финальная олимпиада' FROM contests WHERE slug = 'dasturlash-asoslari-yakuniy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'ru', 'description', 'Итоговая олимпиада семестра. Охватывает все темы курса, требует глубокого алгоритмического мышления и оптимизации.' FROM contests WHERE slug = 'dasturlash-asoslari-yakuniy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'en', 'title', 'Programming Fundamentals: Final Grand Olympiad' FROM contests WHERE slug = 'dasturlash-asoslari-yakuniy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'en', 'description', 'Final comprehensive programming championship covering all course themes and complex algorithmic challenges.' FROM contests WHERE slug = 'dasturlash-asoslari-yakuniy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'kaa', 'title', 'Dastúrlew tiykarları: juwmaqlawshı olimpiada' FROM contests WHERE slug = 'dasturlash-asoslari-yakuniy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'contests', id, 'kaa', 'description', 'Semestr juwmaǵındaǵı olimpiada. Barlıq temalar qamrap alınadı, algoritmik pikirlew hám optimallastırıw talap etiledi.' FROM contests WHERE slug = 'dasturlash-asoslari-yakuniy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;


  -- ============================================================
  -- 2. OLIMPIADA MASALALARI (CHALLENGES)
  -- ============================================================

  -- 2.1 oly-ortacha-ball
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Средний балл' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дано количество студентов в группе и их баллы. Выведите средний балл с округлением до 2 знаков после запятой.\n\nВвод:\n1-я строка: n (количество)\n2-я строка: n целых чисел через пробел\n\nВывод: средний балл (например, 20.00)' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Average Score' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given the number of students and their test scores, calculate and output the average score rounded to 2 decimal places.\n\nInput:\nLine 1: integer n\nLine 2: n space-separated integers\n\nOutput: formatted average (e.g. 20.00)' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Ortasha ball' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Topardaǵı studentler sanı hám olardıń balları berilgen. Ortasha ballnı 2 qanaǵa shekem dóńgeletip shıǵarıń.\n\nKiriw:\n1-qatar: studentler sanı n\n2-qatar: n pútin san bos orın menen\n\nShıǵıw: ortasha ball (mısalı 20.00)' FROM challenges WHERE slug = 'oly-ortacha-ball'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.2 oly-eng-uzun-soz
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Самое длинное слово' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Дана строка слов, разделенных пробелом. Найдите самое длинное слово и выведите его вместе с длиной.\n\nЕсли самых длинных слов несколько, выведите первое.\n\nВвод: строка текста\nВывод:\n1-я строка: слово\n2-я строка: его длина' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Longest Word' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Given a space-separated sentence, find the longest word and its length.\n\nIf multiple words tie for maximum length, return the first one.\n\nInput: a line of text\nOutput:\nLine 1: the word\nLine 2: its length' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Eń uzın sóz' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Bir qatarda bos orın menen ajıratılǵan sózler berilgen. Eń uzın sózdi hám onıń uzınlıǵın tabıń.\n\nBir neshe sóz teń uzınlıqta bolsa, birinshisin shıǵarıń.\n\nKiriw: bir qatar tekst\nShıǵıw:\n1-qatar: sóz\n2-qatar: onıń uzınlıǵı' FROM challenges WHERE slug = 'oly-eng-uzun-soz'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.3 oly-juft-raqamlar
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Сумма четных цифр' FROM challenges WHERE slug = 'oly-juft-raqamlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Sum of Even Digits' FROM challenges WHERE slug = 'oly-juft-raqamlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Jup cifrlar qosındısı' FROM challenges WHERE slug = 'oly-juft-raqamlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;


  -- ============================================================
  -- 3. MUSTAQIL AMALIY TOPSHIRIQLAR (30 TA CHALLENGES)
  -- ============================================================

  -- 3.1 ch-salom-dunyo
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Привет, мир!' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'Выведите на экран в точности следующий текст:\n\nSalom, dunyo!\n\nВвод: нет\nВывод: одна строка' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Hello, World!' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Print the following exact text to the console:\n\nSalom, dunyo!\n\nInput: None\nOutput: single line' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Sálem, dúnya!' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Ekranǵa dál mınaday tekstti shıǵarıń:\n\nSalom, dunyo!\n\nKiriw: joq\nShıǵıw: bir qatar tekst' FROM challenges WHERE slug = 'ch-salom-dunyo'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.2 ch-ikki-son-kopaytma
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Произведение двух чисел' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'description', 'В двух строках даны два целых числа. Выведите их произведение.\n\nВвод:\n1-я строка: a\n2-я строка: b\n\nВывод: a × b' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Product of Two Numbers' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'description', 'Two integers are provided on two separate lines. Compute and print their product.\n\nInput:\nLine 1: a\nLine 2: b\n\nOutput: a × b' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Eki sanniń kóbeymesi' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'description', 'Eki qatarda eki pútin san berilgen. Olardıń kóbeymesin shıǵarıń.\n\nKiriw:\n1-qatar: a\n2-qatar: b\n\nShıǵıw: a × b' FROM challenges WHERE slug = 'ch-ikki-son-kopaytma'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.3 ch-kvadrat
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'ru', 'title', 'Квадрат числа' FROM challenges WHERE slug = 'ch-kvadrat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'en', 'title', 'Square of a Number' FROM challenges WHERE slug = 'ch-kvadrat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'challenges', id, 'kaa', 'title', 'Sanniń kvadratı' FROM challenges WHERE slug = 'ch-kvadrat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

END $$;
