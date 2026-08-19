-- ============================================================
-- EduCode — Baza kontenti tarjimalari: KUTUBXONA
--   1. 48 ta termin (glossary_terms) -> ru, en, kaa
--   2. 10 ta dars metodi (teaching_methods) -> ru, en, kaa
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
-- ============================================================

DO $$
BEGIN
  -- ============================================================
  -- 1. GLOSSARY TERMS (TERMINLAR) — DASTURLASH (12 ta)
  -- ============================================================

  -- 1.1 O'zgaruvchi (ozgaruvchi)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Переменная' FROM glossary_terms WHERE slug = 'ozgaruvchi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Именованная область памяти для хранения данных. Представьте коробку: мы даем коробке имя и кладем внутрь значение.' FROM glossary_terms WHERE slug = 'ozgaruvchi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Variable' FROM glossary_terms WHERE slug = 'ozgaruvchi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A named storage location for data. Think of it as a labeled box: you give the box a name and put a value inside.' FROM glossary_terms WHERE slug = 'ozgaruvchi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Ózgeriwshi' FROM glossary_terms WHERE slug = 'ozgaruvchi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Maǵlıwmattı saqlap turatuǵın atalǵan orın. Onı qutı dep kóz aldıńızǵa keltiriń: qutıǵa at beremiz hám ishine mánis salamız.' FROM glossary_terms WHERE slug = 'ozgaruvchi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.2 Funksiya (funksiya)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Функция' FROM glossary_terms WHERE slug = 'funksiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Именованный блок кода, выполняющий определенную задачу. Пишется один раз и может вызываться сколько угодно.' FROM glossary_terms WHERE slug = 'funksiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Function' FROM glossary_terms WHERE slug = 'funksiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A named block of reusable code that performs a specific task. You write it once and call it whenever needed.' FROM glossary_terms WHERE slug = 'funksiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Funktsiya' FROM glossary_terms WHERE slug = 'funksiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Belgili bir wazıypanı orınlaytuǵın, at berilgen kod bólegi. Bir márte jazıp, keyin qálegenshe shaqırasıńız.' FROM glossary_terms WHERE slug = 'funksiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.3 Sikl (sikl)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Цикл' FROM glossary_terms WHERE slug = 'sikl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Конструкция, повторяющая определенное действие несколько раз. Избавляет от необходимости писать один и тот же код многократно.' FROM glossary_terms WHERE slug = 'sikl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Loop' FROM glossary_terms WHERE slug = 'sikl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A control structure that repeats a block of code multiple times, saving you from writing repetitive statements.' FROM glossary_terms WHERE slug = 'sikl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Cikl' FROM glossary_terms WHERE slug = 'sikl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Birdey ámeldi bir neshe márte tákirarlaytuǵın konstrukciya. Birdey kodtı qayta-qayta jazıwdan qutqaradı.' FROM glossary_terms WHERE slug = 'sikl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.4 Shart operatori (shart-operatori)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Условный оператор' FROM glossary_terms WHERE slug = 'shart-operatori'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Позволяет программе принимать решения: при выполнении условия выполняется один путь, иначе — другой.' FROM glossary_terms WHERE slug = 'shart-operatori'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Conditional Statement' FROM glossary_terms WHERE slug = 'shart-operatori'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'Directs program flow based on conditions: executes one path if true and another if false.' FROM glossary_terms WHERE slug = 'shart-operatori'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Shárt operatorı' FROM glossary_terms WHERE slug = 'shart-operatori'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Dastúrge tańlaw qıldıradı: shárt orınlansa bir jol, orınlanbasa basqa jol menen baradı.' FROM glossary_terms WHERE slug = 'shart-operatori'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.5 Massiv (massiv)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Массив' FROM glossary_terms WHERE slug = 'massiv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Структура, хранящая несколько значений под одним именем в строгом порядке. Каждый элемент имеет свой индекс.' FROM glossary_terms WHERE slug = 'massiv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Array' FROM glossary_terms WHERE slug = 'massiv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'An ordered data structure that stores multiple values under a single name. Each element has an index number.' FROM glossary_terms WHERE slug = 'massiv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Massiv' FROM glossary_terms WHERE slug = 'massiv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Bir neshe mánisti bir at astında tártip penen saqlaytuǵın struktura. Hár bir elementtiń óz tártip nomeri bar.' FROM glossary_terms WHERE slug = 'massiv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.6 Argument (argument)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Аргумент' FROM glossary_terms WHERE slug = 'argument'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Значение, передаваемое в функцию при её вызове. Функция выполняет операции над этим значением.' FROM glossary_terms WHERE slug = 'argument'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Argument' FROM glossary_terms WHERE slug = 'argument'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A value passed to a function when it is invoked. The function operates using this provided value.' FROM glossary_terms WHERE slug = 'argument'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Argument' FROM glossary_terms WHERE slug = 'argument'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Funktsiyaǵa uzatılatuǵın mánis. Funktsiya sol mánis ústinde jumıs orınlaydı.' FROM glossary_terms WHERE slug = 'argument'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.7 Sintaksis (sintaksis)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Синтаксис' FROM glossary_terms WHERE slug = 'sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Грамматика языка программирования — правила написания исходного кода. При нарушении правил программа не запустится.' FROM glossary_terms WHERE slug = 'sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Syntax' FROM glossary_terms WHERE slug = 'sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'The grammar and set of rules defining how code must be structured and written in a programming language.' FROM glossary_terms WHERE slug = 'sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Sintaksis' FROM glossary_terms WHERE slug = 'sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Dastúrlew tiliniń grammatikası — kodtı qalay jazıw qaǵıydaları. Qaǵıyda buzılsa, dastúr iske túspeydi.' FROM glossary_terms WHERE slug = 'sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.8 Kommentariy (kommentariy)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Комментарий' FROM glossary_terms WHERE slug = 'kommentariy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Поясняющий текст внутри кода. Компьютер игнорирует комментарии — они предназначены исключительно для человека.' FROM glossary_terms WHERE slug = 'kommentariy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Comment' FROM glossary_terms WHERE slug = 'kommentariy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'An explanatory note within code. It is ignored by the compiler or interpreter and written solely for human understanding.' FROM glossary_terms WHERE slug = 'kommentariy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Kommentariy' FROM glossary_terms WHERE slug = 'kommentariy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Kod ishinde berilgen túsindirme. Kompyuter onı oqımaydı, ol tek adamlar túsiniwi ushın jazılǵan.' FROM glossary_terms WHERE slug = 'kommentariy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.9 Xatolik (xatolik)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Ошибка (Баг)' FROM glossary_terms WHERE slug = 'xatolik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Дефект или сбой в программе, приводящий к неверному результату. Поиск и исправление ошибок — основа работы программиста.' FROM glossary_terms WHERE slug = 'xatolik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Bug / Error' FROM glossary_terms WHERE slug = 'xatolik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A flaw, failure, or fault in a software program that causes it to produce incorrect or unexpected results.' FROM glossary_terms WHERE slug = 'xatolik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Qátelik (Bug)' FROM glossary_terms WHERE slug = 'xatolik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Dastúrdiń nadurıs islewini keltirip shıǵaratuǵın kemshilik. Qátelikti tawıp dúzetiw — dastúrlewshiniń kúnlik jumısı.' FROM glossary_terms WHERE slug = 'xatolik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.10 Obyekt (obyekt)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Объект' FROM glossary_terms WHERE slug = 'obyekt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Сущность, объединяющая данные (свойства) и функции для работы с ними (методы). Моделирует предметы реального мира в коде.' FROM glossary_terms WHERE slug = 'obyekt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Object' FROM glossary_terms WHERE slug = 'obyekt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A self-contained entity that combines data (properties) and behavior (methods) representing real-world things in code.' FROM glossary_terms WHERE slug = 'obyekt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Obyekt' FROM glossary_terms WHERE slug = 'obyekt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Maǵlıwmat hám sol maǵlıwmat ústindegi ámellerdi birge saqlaytuǵın struktura. Real dúnyadaǵı zattı kodta sáwlelendiredi.' FROM glossary_terms WHERE slug = 'obyekt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.11 Sinf (sinf)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Класс' FROM glossary_terms WHERE slug = 'sinf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Шаблон или чертёж для создания объектов. Класс — это чертёж дома, а объект — само построенное по нему здание.' FROM glossary_terms WHERE slug = 'sinf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Class' FROM glossary_terms WHERE slug = 'sinf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A blueprint or template for creating objects. A class is like an architectural blueprint, and an object is the built house.' FROM glossary_terms WHERE slug = 'sinf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Klass' FROM glossary_terms WHERE slug = 'sinf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Obyektler jaratıw ushın qálip (andoza). Klass — sızba, obyekt — sol sızba boyınsha qurılǵan imarat.' FROM glossary_terms WHERE slug = 'sinf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.12 Kutubxona (kutubxona)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Библиотека' FROM glossary_terms WHERE slug = 'kutubxona'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Набор готового кода и функций, написанных другими разработчиками, чтобы не изобретать колесо заново.' FROM glossary_terms WHERE slug = 'kutubxona'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Library' FROM glossary_terms WHERE slug = 'kutubxona'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A collection of pre-written code routines and functions that developers can import to avoid reinventing the wheel.' FROM glossary_terms WHERE slug = 'kutubxona'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Kitapxana' FROM glossary_terms WHERE slug = 'kutubxona'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Basqalar jazıp qoyǵan tayar kodlar jıynaǵı. Onı jalǵap, gildirlekti qaytadan oylap tappaysız.' FROM glossary_terms WHERE slug = 'kutubxona'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- ============================================================
  -- 2. GLOSSARY TERMS — FRONTEND (12 ta)
  -- ============================================================

  -- 2.1 HTML
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'HTML' FROM glossary_terms WHERE slug = 'html'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Каркас веб-страницы. Определяет, где на странице будут располагаться заголовки, параграфы, изображения и ссылки.' FROM glossary_terms WHERE slug = 'html'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'HTML' FROM glossary_terms WHERE slug = 'html'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'The skeletal backbone of a webpage. Defines where headings, paragraphs, images, and other elements are placed.' FROM glossary_terms WHERE slug = 'html'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'HTML' FROM glossary_terms WHERE slug = 'html'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Veb-bettiń skeleti. Bette qáyerde baslıq, qáyerde tekst, qáyerde súwret turıwın belgileydi.' FROM glossary_terms WHERE slug = 'html'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.2 CSS
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'CSS' FROM glossary_terms WHERE slug = 'css'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Внешний вид веб-страницы: цвета, шрифты, отступы и расположение. Если HTML — это скелет, то CSS — это одежда.' FROM glossary_terms WHERE slug = 'css'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'CSS' FROM glossary_terms WHERE slug = 'css'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'Defines the presentation and styling of a webpage: colors, fonts, margins, and layouts. If HTML is the skeleton, CSS is the outfit.' FROM glossary_terms WHERE slug = 'css'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'CSS' FROM glossary_terms WHERE slug = 'css'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Veb-bettiń kórinisi: reń, shrift, jaylasıwı hám aralıqlar. HTML — skelet bolsa, CSS — kiyim.' FROM glossary_terms WHERE slug = 'css'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.3 Teg (teg)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Тег' FROM glossary_terms WHERE slug = 'teg'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Элемент HTML внутри угловых скобок. Каждый тег сообщает браузеру тип и назначение элемента.' FROM glossary_terms WHERE slug = 'teg'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Tag' FROM glossary_terms WHERE slug = 'teg'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'An HTML directive enclosed in angle brackets. Each tag instructs the browser on how to treat and render the element.' FROM glossary_terms WHERE slug = 'teg'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Teg' FROM glossary_terms WHERE slug = 'teg'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'HTML''degi múyeshlik qawsırmalar ishinde jazılatuǵın buyrıq. Hár bir teg brauzerge elementtiń túrin bildiredi.' FROM glossary_terms WHERE slug = 'teg'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.4 Selektor (selektor)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Селектор' FROM glossary_terms WHERE slug = 'selektor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Правило в CSS, указывающее браузеру, к каким именно элементам страницы нужно применить стили.' FROM glossary_terms WHERE slug = 'selektor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Selector' FROM glossary_terms WHERE slug = 'selektor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A pattern in CSS used to target and style specific HTML elements on the page.' FROM glossary_terms WHERE slug = 'selektor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Selektor' FROM glossary_terms WHERE slug = 'selektor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'CSS''te qaysı elementke stil beriw kerek ekenin kórsetetuǵın qaǵıyda.' FROM glossary_terms WHERE slug = 'selektor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.5 Brauzer (brauzer)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Браузер' FROM glossary_terms WHERE slug = 'brauzer'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Программа для просмотра веб-страниц. Считывает HTML, CSS и JavaScript и преобразует их в интерактивный экранный интерфейс.' FROM glossary_terms WHERE slug = 'brauzer'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Browser' FROM glossary_terms WHERE slug = 'brauzer'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A software application used to access the internet. It interprets HTML, CSS, and JavaScript to render visual webpages.' FROM glossary_terms WHERE slug = 'brauzer'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Brauzer' FROM glossary_terms WHERE slug = 'brauzer'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Veb-betlerdi ashıp beretuǵın dastúr. HTML, CSS hám JavaScript''ti oqıp, ekranda kórinetuǵın betke aylandıradı.' FROM glossary_terms WHERE slug = 'brauzer'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.6 Domen (domen)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Домен' FROM glossary_terms WHERE slug = 'domen'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Уникальный адрес сайта в сети интернет. Воспринимайте его как домашний адрес веб-ресурса.' FROM glossary_terms WHERE slug = 'domen'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Domain' FROM glossary_terms WHERE slug = 'domen'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'The unique address of a website on the internet, acting like the site''s street address.' FROM glossary_terms WHERE slug = 'domen'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Domen' FROM glossary_terms WHERE slug = 'domen'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Sayttıń internettegi mánzili. Onı sayttıń úy mánzili dep túsiniń.' FROM glossary_terms WHERE slug = 'domen'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.7 DOM (dom)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'DOM (Document Object Model)' FROM glossary_terms WHERE slug = 'dom'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Древовидная структура, которую браузер строит из HTML-кода. JavaScript управляет содержимым страницы именно через это дерево.' FROM glossary_terms WHERE slug = 'dom'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'DOM (Document Object Model)' FROM glossary_terms WHERE slug = 'dom'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A tree-like representation constructed by the browser from HTML. JavaScript dynamically alters page elements through this tree.' FROM glossary_terms WHERE slug = 'dom'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'DOM' FROM glossary_terms WHERE slug = 'dom'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Brauzer HTML''den jasap alatuǵın terek tárizli struktura. JavaScript betti dál usı terek arqalı ózgertedi.' FROM glossary_terms WHERE slug = 'dom'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.8 Responsive dizayn (responsive-dizayn)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Адаптивный дизайн' FROM glossary_terms WHERE slug = 'responsive-dizayn'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Способность веб-страницы плавно подстраиваться под любой размер экрана: от смартфона до широкоформатного монитора.' FROM glossary_terms WHERE slug = 'responsive-dizayn'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Responsive Design' FROM glossary_terms WHERE slug = 'responsive-dizayn'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'An approach allowing web pages to adapt dynamically to various screen sizes and devices seamlessly.' FROM glossary_terms WHERE slug = 'responsive-dizayn'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Iykemli dizayn' FROM glossary_terms WHERE slug = 'responsive-dizayn'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Bettiń ekran ólshemine beyimlesiwi. Bir sayt telefonda da, kompyuterde de qolaylı kórinedi.' FROM glossary_terms WHERE slug = 'responsive-dizayn'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.9 Komponent (komponent)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Компонент' FROM glossary_terms WHERE slug = 'komponent'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Независимый переиспользуемый блок интерфейса: кнопка, карточка, модальное окно или форма.' FROM glossary_terms WHERE slug = 'komponent'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Component' FROM glossary_terms WHERE slug = 'komponent'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'An independent, reusable UI building block (button, card, form) that can be combined with others.' FROM glossary_terms WHERE slug = 'komponent'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Komponent' FROM glossary_terms WHERE slug = 'komponent'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Qayta qollanılatuǵın ǵárezsiz interfeys bólegi: túyme, karta, forma. Bir márte jazıp, hámme jerde qollanasız.' FROM glossary_terms WHERE slug = 'komponent'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.10 Framework (framework)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Фреймворк' FROM glossary_terms WHERE slug = 'framework'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Готовая программная платформа и набор стандартов, ускоряющие разработку приложений.' FROM glossary_terms WHERE slug = 'framework'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Framework' FROM glossary_terms WHERE slug = 'framework'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A foundational software structure providing generic functionality that developers can build upon.' FROM glossary_terms WHERE slug = 'framework'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Freymvork' FROM glossary_terms WHERE slug = 'framework'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Dastúr jazıwdı tezletetuǵın tayar struktura hám qaǵıydalar jıynaǵı.' FROM glossary_terms WHERE slug = 'framework'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.11 API (api)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'API' FROM glossary_terms WHERE slug = 'api'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Программный интерфейс взаимодействия. Как официант в ресторане: передает ваш заказ на кухню и возвращает готовое блюдо.' FROM glossary_terms WHERE slug = 'api'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'API (Application Programming Interface)' FROM glossary_terms WHERE slug = 'api'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'An interface allowing different software programs to communicate, like a waiter delivering orders between table and kitchen.' FROM glossary_terms WHERE slug = 'api'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'API' FROM glossary_terms WHERE slug = 'api'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Eki programma bir-biri menen sóylesetuǵın interfeys. Restorandaǵı ofitsiant sıyaqlı: buyırtpanı asxanaǵa jetkeredi hám juwaptı qaytaradı.' FROM glossary_terms WHERE slug = 'api'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.12 Hosting (hosting)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Хостинг' FROM glossary_terms WHERE slug = 'hosting'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Серверная услуга по хранению файлов сайта и обеспечению круглосуточного доступа к ним через сеть интернет.' FROM glossary_terms WHERE slug = 'hosting'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Hosting' FROM glossary_terms WHERE slug = 'hosting'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A service that stores website files on servers and makes them accessible to users worldwide on the internet.' FROM glossary_terms WHERE slug = 'hosting'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Xosting' FROM glossary_terms WHERE slug = 'hosting'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Sayt faylları saqlanatuǵın hám internetke uzatılatuǵın server xızmeti.' FROM glossary_terms WHERE slug = 'hosting'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- ============================================================
  -- 3. GLOSSARY TERMS — KOMPYUTER SAVODXONLIGI (12 ta)
  -- ============================================================

  -- 3.1 Operatsion tizim (operatsion-tizim)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Операционная система' FROM glossary_terms WHERE slug = 'operatsion-tizim'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Базовый комплекс программ, управляющий аппаратной частью компьютера и обеспечивающий среду для работы других приложений.' FROM glossary_terms WHERE slug = 'operatsion-tizim'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Operating System' FROM glossary_terms WHERE slug = 'operatsion-tizim'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'The foundational software managing computer hardware and providing services for application software.' FROM glossary_terms WHERE slug = 'operatsion-tizim'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Operaciyalıq sistema' FROM glossary_terms WHERE slug = 'operatsion-tizim'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Kompyuterdi basqaratuǵın tiykarǵı dastúr. Barlıq basqa dastúrler onıń ústinde isleydi.' FROM glossary_terms WHERE slug = 'operatsion-tizim'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.2 Fayl (fayl)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Файл' FROM glossary_terms WHERE slug = 'fayl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Именованная область данных на носителе информации: документ, изображение, видео или исполняемая программа.' FROM glossary_terms WHERE slug = 'fayl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'File' FROM glossary_terms WHERE slug = 'fayl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A discrete unit of stored data on a computer storage device, such as a document, photo, video, or program.' FROM glossary_terms WHERE slug = 'fayl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Fayl' FROM glossary_terms WHERE slug = 'fayl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Kompyuterde saqlanatuǵın maǵlıwmat birligi: hújjet, súwret, video yamasa dastúr.' FROM glossary_terms WHERE slug = 'fayl'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.3 Papka (papka)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Папка (Директория)' FROM glossary_terms WHERE slug = 'papka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Контейнер для упорядоченного хранения файлов и вложенных папок.' FROM glossary_terms WHERE slug = 'papka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Folder / Directory' FROM glossary_terms WHERE slug = 'papka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A virtual container used for organizing and grouping computer files and other subfolders.' FROM glossary_terms WHERE slug = 'papka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Papka' FROM glossary_terms WHERE slug = 'papka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Fayllardı tártipke salıp saqlaytuǵın ıdıs. Papka ishinde basqa da papkalar bolıwı múmkin.' FROM glossary_terms WHERE slug = 'papka'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.4 Protsessor (protsessor)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Процессор (ЦП)' FROM glossary_terms WHERE slug = 'protsessor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Центральный мозг компьютера. Выполняет все арифметические и логические вычисления и исполняет команды.' FROM glossary_terms WHERE slug = 'protsessor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Processor (CPU)' FROM glossary_terms WHERE slug = 'protsessor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'The brain of the computer that interprets and executes the fundamental instructions of software.' FROM glossary_terms WHERE slug = 'protsessor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Processor (CPU)' FROM glossary_terms WHERE slug = 'protsessor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Kompyuterdiń miyi. Barlıq esap-kitap hám buyrıqlar usı jerde orınlanadı.' FROM glossary_terms WHERE slug = 'protsessor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.5 Operativ xotira (operativ-xotira)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Оперативная память (ОЗУ / RAM)' FROM glossary_terms WHERE slug = 'operativ-xotira'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Сверхбыстрая память для временного хранения данных запущенных программ. При выключении питания очищается.' FROM glossary_terms WHERE slug = 'operativ-xotira'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'RAM (Random Access Memory)' FROM glossary_terms WHERE slug = 'operativ-xotira'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'High-speed temporary memory holding active data for running programs. Cleared when the power is turned off.' FROM glossary_terms WHERE slug = 'operativ-xotira'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Operativlik yad (RAM)' FROM glossary_terms WHERE slug = 'operativ-xotira'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Kompyuter házir islep turǵan maǵlıwmattı saqlaytuǵın tez yad. Óshirilgende tazalanadı — jumıs stoli sıyaqlı.' FROM glossary_terms WHERE slug = 'operativ-xotira'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.6 Qattiq disk (qattiq-disk)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Жесткий диск / SSD' FROM glossary_terms WHERE slug = 'qattiq-disk'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Энергонезависимый накопитель для долговременного хранения файлов и программ. Данные не пропадают при выключении.' FROM glossary_terms WHERE slug = 'qattiq-disk'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Hard Drive / SSD' FROM glossary_terms WHERE slug = 'qattiq-disk'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'Non-volatile long-term storage hardware where files and programs persist even after power is turned off.' FROM glossary_terms WHERE slug = 'qattiq-disk'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Qattı disk / SSD' FROM glossary_terms WHERE slug = 'qattiq-disk'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Maǵlıwmat uzaq múddetke saqlanatuǵın yad. Óshirilse de joǵalmaydı — shkaf sıyaqlı.' FROM glossary_terms WHERE slug = 'qattiq-disk'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.7 Parol (parol)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Пароль' FROM glossary_terms WHERE slug = 'parol'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Секретная строка символов для защиты учетной записи. Надежный пароль содержит буквы разных регистров, цифры и спецсимволы.' FROM glossary_terms WHERE slug = 'parol'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Password' FROM glossary_terms WHERE slug = 'parol'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A secret string of characters protecting access to an account. Strong passwords include uppercase, lowercase, numbers, and symbols.' FROM glossary_terms WHERE slug = 'parol'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Parol' FROM glossary_terms WHERE slug = 'parol'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Akkaunttı qorǵaytuǵın jasırın gilt. Kúshli parol uzın boladı hám hárip, san, belgilerden ibarat boladı.' FROM glossary_terms WHERE slug = 'parol'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.8 Zaxira nusxa (zaxira-nusxa)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Резервная копия (Бэкап)' FROM glossary_terms WHERE slug = 'zaxira-nusxa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Дубликат важных файлов для восстановления информации в случае сбоя, удаления или повреждения оригинала.' FROM glossary_terms WHERE slug = 'zaxira-nusxa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Backup' FROM glossary_terms WHERE slug = 'zaxira-nusxa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A duplicate copy of important files stored safely to restore data if the original is lost or corrupted.' FROM glossary_terms WHERE slug = 'zaxira-nusxa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Rezerv nusqa (Backup)' FROM glossary_terms WHERE slug = 'zaxira-nusxa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Áhmiyetli fayllardıń ekinshi nusqası. Tiykarǵı nusqa joǵalsa yamasa buzılsa, sonnan tiklenedi.' FROM glossary_terms WHERE slug = 'zaxira-nusxa'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.9 Bulut (bulut)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Облако (Облачное хранилище)' FROM glossary_terms WHERE slug = 'bulut'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Хранение файлов на удаленных интернет-серверах с возможностью доступа к ним с любого устройства в любое время.' FROM glossary_terms WHERE slug = 'bulut'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Cloud Storage' FROM glossary_terms WHERE slug = 'bulut'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'Storing files and services on remote internet servers, enabling seamless access from any internet-connected device.' FROM glossary_terms WHERE slug = 'bulut'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Bult (Cloud)' FROM glossary_terms WHERE slug = 'bulut'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Fayllar óz kompyuterińizde emes, internettegi serverde saqlanıwı. Qálegen qurılmadan kiriw múmkin.' FROM glossary_terms WHERE slug = 'bulut'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.10 Drayver (drayver)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Драйвер' FROM glossary_terms WHERE slug = 'drayver'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Специальная программа, позволяющая операционной системе правильно взаимодействовать с подключенным оборудованием.' FROM glossary_terms WHERE slug = 'drayver'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Driver' FROM glossary_terms WHERE slug = 'drayver'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A software component that enables the operating system and hardware devices to communicate effectively.' FROM glossary_terms WHERE slug = 'drayver'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Drayver' FROM glossary_terms WHERE slug = 'drayver'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Operaciyalıq sistemaǵa qurılma menen qalay islewdi úyretetuǵın arnawlı dastúr.' FROM glossary_terms WHERE slug = 'drayver'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.11 Fishing (fishing)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Фишинг' FROM glossary_terms WHERE slug = 'fishing'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Вид интернет-мошенничества с целью обманным путем выманить пароли или данные банковских карт через поддельные сайты.' FROM glossary_terms WHERE slug = 'fishing'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Phishing' FROM glossary_terms WHERE slug = 'fishing'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A cyber attack in which fraudulent communications deceive people into revealing sensitive passwords or financial credentials.' FROM glossary_terms WHERE slug = 'fishing'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Fishing' FROM glossary_terms WHERE slug = 'fishing'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Paydalanıwshını aljap parol yamasa karta maǵlıwmatların alıwǵa urınıw. Kóbinese jalǵan sayt yamasa xat arqalı boladı.' FROM glossary_terms WHERE slug = 'fishing'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.12 IP-manzil (ip-manzil)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'IP-адрес' FROM glossary_terms WHERE slug = 'ip-manzil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Уникальный числовой идентификатор устройства в компьютерной сети. Пакеты данных доставляются именно по этому адресу.' FROM glossary_terms WHERE slug = 'ip-manzil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'IP Address' FROM glossary_terms WHERE slug = 'ip-manzil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A unique numerical label assigned to each device connected to a computer network that uses IP for communication.' FROM glossary_terms WHERE slug = 'ip-manzil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'IP-mánzil' FROM glossary_terms WHERE slug = 'ip-manzil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Tarmaqtaǵı hár bir qurılmanıń sanlı mánzili. Maǵlıwmat dál usı mánzil boyınsha jetkerip beriledi.' FROM glossary_terms WHERE slug = 'ip-manzil'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- ============================================================
  -- 4. GLOSSARY TERMS — ALGORITMLAR (12 ta)
  -- ============================================================

  -- 4.1 Algoritm (algoritm)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Алгоритм' FROM glossary_terms WHERE slug = 'algoritm'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Точная и однозначная последовательность шагов для решения поставленной задачи. Кулинарный рецепт — это тоже алгоритм.' FROM glossary_terms WHERE slug = 'algoritm'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Algorithm' FROM glossary_terms WHERE slug = 'algoritm'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A well-defined step-by-step procedure or set of rules for solving a specific computational problem.' FROM glossary_terms WHERE slug = 'algoritm'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Algoritm' FROM glossary_terms WHERE slug = 'algoritm'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'M把握sleni sheshiw ushın anıq, tártipli qádemler izbe-izligi. Awqat recepti de algoritm bolıp tabıladı.' FROM glossary_terms WHERE slug = 'algoritm'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.2 Blok-sxema (blok-sxema)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Блок-схема' FROM glossary_terms WHERE slug = 'blok-sxema'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Графическое представление алгоритма. Геометрические фигуры обозначают действия, а стрелки — порядок их выполнения.' FROM glossary_terms WHERE slug = 'blok-sxema'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Flowchart' FROM glossary_terms WHERE slug = 'blok-sxema'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A diagrammatic representation of an algorithm displaying steps as boxes connected by directional arrows.' FROM glossary_terms WHERE slug = 'blok-sxema'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Blok-sxema' FROM glossary_terms WHERE slug = 'blok-sxema'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Algoritmniń sızba kórinisi. Hár bir geometriyalıq forma bir ámeldi, baǵdarlar — qádemler tártibin kórsetedi.' FROM glossary_terms WHERE slug = 'blok-sxema'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.3 Qidiruv (qidiruv)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Поиск' FROM glossary_terms WHERE slug = 'qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Операция нахождения нужного элемента в структуре данных. Простейший способ — последовательный перебор.' FROM glossary_terms WHERE slug = 'qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Search Algorithm' FROM glossary_terms WHERE slug = 'qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'An algorithm that locates a specific item or value within a collection of data.' FROM glossary_terms WHERE slug = 'qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'İzlew' FROM glossary_terms WHERE slug = 'qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Jıynaqlanǵan maǵlıwmatlar arasınan kerekli elementti tabıw ámeli. Eń ápiwayı jolı — birme-bir tekseriw.' FROM glossary_terms WHERE slug = 'qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.4 Saralash (saralash)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Сортировка' FROM glossary_terms WHERE slug = 'saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Упорядочивание элементов массива или коллекции по определенному критерию (по возрастанию или убыванию).' FROM glossary_terms WHERE slug = 'saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Sorting' FROM glossary_terms WHERE slug = 'saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'The process of arranging elements in a collection in a specified order, ascending or descending.' FROM glossary_terms WHERE slug = 'saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Saralaw (Sortlaw)' FROM glossary_terms WHERE slug = 'saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Elementlerdi belgili bir tártipte — ósiw yamasa kemeyiw boyınsha — jaylastırıw.' FROM glossary_terms WHERE slug = 'saralash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.5 Ikkilik qidiruv (ikkilik-qidiruv)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Бинарный поиск' FROM glossary_terms WHERE slug = 'ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Эффективный алгоритм поиска в отсортированном массиве: на каждом шаге отсекает половину оставшихся элементов.' FROM glossary_terms WHERE slug = 'ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Binary Search' FROM glossary_terms WHERE slug = 'ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A fast search algorithm for sorted arrays that repeatedly halves the search interval until the target is found.' FROM glossary_terms WHERE slug = 'ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Ekkilik izlew' FROM glossary_terms WHERE slug = 'ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Saralanǵan dizimde izlewdiń tez usılı: hár qádemde dizimdiń yarımın taslap jiberip izleydi.' FROM glossary_terms WHERE slug = 'ikkilik-qidiruv'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.6 Rekursiya (rekursiya)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Рекурсия' FROM glossary_terms WHERE slug = 'rekursiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Прием, при котором функция вызывает саму себя для решения подзадачи, пока не достигнет базового случая.' FROM glossary_terms WHERE slug = 'rekursiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Recursion' FROM glossary_terms WHERE slug = 'rekursiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A technique where a function calls itself to solve smaller instances of the same problem until a base condition is met.' FROM glossary_terms WHERE slug = 'rekursiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Rekursiya' FROM glossary_terms WHERE slug = 'rekursiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Funktsiyanıń ózin-ózi shaqırıwı. Hár shaqırıwda másele kishireyedi hám tiykarǵı shártke jetkende toqtaydı.' FROM glossary_terms WHERE slug = 'rekursiya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.7 Stek (stek)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Стек' FROM glossary_terms WHERE slug = 'stek'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Структура данных по принципу LIFO (последний зашел — первый вышел), подобно стопке тарелок.' FROM glossary_terms WHERE slug = 'stek'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Stack' FROM glossary_terms WHERE slug = 'stek'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A linear data structure following the LIFO (Last In, First Out) principle, similar to a physical stack of plates.' FROM glossary_terms WHERE slug = 'stek'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Stek' FROM glossary_terms WHERE slug = 'stek'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Aqırǵı kirgen birinshi shıǵatuǵın struktura (LIFO). Ústpe-úst qoyılǵan tabaqlar sıyaqlı.' FROM glossary_terms WHERE slug = 'stek'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.8 Navbat (navbat)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Очередь' FROM glossary_terms WHERE slug = 'navbat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Структура данных по принципу FIFO (первый зашел — первый вышел), аналогично обычной очереди людей.' FROM glossary_terms WHERE slug = 'navbat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Queue' FROM glossary_terms WHERE slug = 'navbat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A linear data structure following the FIFO (First In, First Out) order, resembling a real-world waiting line.' FROM glossary_terms WHERE slug = 'navbat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Gezek' FROM glossary_terms WHERE slug = 'navbat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Birinshi kirgen birinshi shıǵatuǵın struktura (FIFO). Dúkándaǵı gezek sıyaqlı.' FROM glossary_terms WHERE slug = 'navbat'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.9 Daraxt (daraxt)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Дерево (Граф-дерево)' FROM glossary_terms WHERE slug = 'daraxt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Иерархическая структура данных, начинающаяся с корневого узла и ветвящаяся к потомкам. Пример — файловая система папок.' FROM glossary_terms WHERE slug = 'daraxt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Tree' FROM glossary_terms WHERE slug = 'daraxt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A hierarchical tree-structured data model starting from a root node and branching into children, like file folders.' FROM glossary_terms WHERE slug = 'daraxt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Terek (Tree)' FROM glossary_terms WHERE slug = 'daraxt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Tamırdan baslanıp shaqalanatuǵın iyerarxiyalıq struktura. Papkalar sisteması — terekke mısal boladı.' FROM glossary_terms WHERE slug = 'daraxt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.10 Graf (graf)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Граф' FROM glossary_terms WHERE slug = 'graf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Нелинейная структура данных, состоящая из множества вершин (узлов) и соединяющих их ребер. Пример — схема метро или соцсеть.' FROM glossary_terms WHERE slug = 'graf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Graph' FROM glossary_terms WHERE slug = 'graf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A non-linear data structure comprising vertices (nodes) connected by edges. Classic examples include subway networks and social connections.' FROM glossary_terms WHERE slug = 'graf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Graf' FROM glossary_terms WHERE slug = 'graf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Núkteler (túyinler) hám olardı baylanıstırıwshı sızıqlardan ibarat struktura. Metro sxeması — grafqa mısal.' FROM glossary_terms WHERE slug = 'graf'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.11 Murakkablik (murakkablik)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Вычислительная сложность (Big O)' FROM glossary_terms WHERE slug = 'murakkablik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Математическая оценка эффективности алгоритма: показывает, как растут затраты времени или памяти при увеличении объема входных данных.' FROM glossary_terms WHERE slug = 'murakkablik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Big O Notation / Complexity' FROM glossary_terms WHERE slug = 'murakkablik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A mathematical measure expressing how the execution time or memory requirements of an algorithm grow as the input size scales.' FROM glossary_terms WHERE slug = 'murakkablik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Quramalılıq (Big O)' FROM glossary_terms WHERE slug = 'murakkablik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Algoritm maǵlıwmat kólemi artqanda qanshelli ástenlesiwin kórsetetuǵın kórsetkish.' FROM glossary_terms WHERE slug = 'murakkablik'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 4.12 Xesh-jadval (xesh-jadval)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'term', 'Хеш-таблица' FROM glossary_terms WHERE slug = 'xesh-jadval'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'ru', 'definition', 'Структура данных типа «ключ — значение», обеспечивающая поиск, вставку и удаление элементов практически мгновенно.' FROM glossary_terms WHERE slug = 'xesh-jadval'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'term', 'Hash Table' FROM glossary_terms WHERE slug = 'xesh-jadval'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'en', 'definition', 'A key-value data structure mapping keys to values using a hash function, offering nearly instant lookups.' FROM glossary_terms WHERE slug = 'xesh-jadval'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'term', 'Xesh-keste' FROM glossary_terms WHERE slug = 'xesh-jadval'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'glossary_terms', id, 'kaa', 'definition', 'Gilt boyınsha mánisti dárriw tawıp beretuǵın qolaylı maǵlıwmatlar strukturasi.' FROM glossary_terms WHERE slug = 'xesh-jadval'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;


  -- ============================================================
  -- 5. TEACHING METHODS (DARS METODLARI — 10 ta)
  -- ============================================================

  -- 5.1 Aqliy hujum (aqliy-hujum)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'title', 'Мозговой штурм' FROM teaching_methods WHERE slug = 'aqliy-hujum'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'summary', 'Сбор максимального количества идей за короткое время. Оценка откладывается на потом: сначала количество, затем качество.' FROM teaching_methods WHERE slug = 'aqliy-hujum'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'guide_html', '<ol><li><b>Поставьте вопрос.</b> Чёткий и открытый: "Как компьютер сохраняет изображение?"</li><li><b>Огласите правило:</b> ни одна идея не критикуется, принимаются абсолютно все варианты.</li><li><b>Сбор идей (3-5 минут).</b> Фиксируйте всё на доске без пауз.</li><li><b>Группировка.</b> Объедините похожие мысли.</li><li><b>Оценка.</b> Обсудите и выберите наиболее точные идеи вместе.</li></ol><p><i>Совет: напрямую вовлекайте молчаливых учеников: "А как ты думаешь?"</i></p>' FROM teaching_methods WHERE slug = 'aqliy-hujum'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'title', 'Brainstorming' FROM teaching_methods WHERE slug = 'aqliy-hujum'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'summary', 'Gathering as many ideas as possible in a short span. Critical evaluation is deferred: quantity first, quality later.' FROM teaching_methods WHERE slug = 'aqliy-hujum'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'guide_html', '<ol><li><b>Pose the question.</b> Keep it clear and open: "How does a computer store an image?"</li><li><b>State the core rule:</b> no judgment or criticism; every idea is welcome.</li><li><b>Collect ideas (3-5 mins).</b> Write down everything on the board without interruption.</li><li><b>Group.</b> Consolidate similar suggestions together.</li><li><b>Evaluate.</b> Discuss and identify the most solid ideas collaboratively.</li></ol><p><i>Tip: gently invite quiet students: "What do you think about this?"</i></p>' FROM teaching_methods WHERE slug = 'aqliy-hujum'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'title', 'Aqıliy hújim' FROM teaching_methods WHERE slug = 'aqliy-hujum'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'summary', 'Qısqa waqıtta imkanınsha kóp ideya jıynaw. Bahalaw keyinge qaldırıladı — aldın san, keyin sapası.' FROM teaching_methods WHERE slug = 'aqliy-hujum'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'guide_html', '<ol><li><b>Sorawdı qoyıń.</b> Anıq hám ashıq bolsın: "Kompyuter qalay etip súwretti saqlaydı?"</li><li><b>Qaǵıydanı túsindirip qoyıń:</b> hesh kim bahalanbaydı, hár qanday ideya qabıllanadı.</li><li><b>3-5 minut ideya jıynań.</b> Bárshesin doskaǵa jazıń, toqtatpań.</li><li><b>Topparlań.</b> Uqsas pikirlerdi birlestiriń.</li><li><b>Bahalań.</b> Endi birgelikte qaysı ideya durıs ekenin talqılań.</li></ol><p><i>Masláhát: tınısh oqıwshılarǵa "sen qalay oylaysań?" dep tuwrıdan-tuwrı múrájat etiń.</i></p>' FROM teaching_methods WHERE slug = 'aqliy-hujum'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 5.2 Juftlikda dasturlash (juftlikda-dasturlash)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'title', 'Парное программирование' FROM teaching_methods WHERE slug = 'juftlikda-dasturlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'summary', 'Двое учащихся работают за одним компьютером: один пишет код (водитель), второй направляет и отслеживает ошибки (штурман). Роли регулярно меняются.' FROM teaching_methods WHERE slug = 'juftlikda-dasturlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'guide_html', '<ol><li><b>Сформируйте пары.</b> Объединяйте учеников со схожим уровнем, чтобы сильный не вытеснял напарника.</li><li><b>Объясните роли.</b> «Водитель» работает с клавиатурой, «Штурман» направляет ход мысли и выверяет синтаксис.</li><li><b>Запустите таймер.</b> Обязательная смена ролей каждые 7-10 минут.</li><li><b>Курируйте.</b> Если штурман молчит, спросите: «Что вы сейчас делаете?»</li><li><b>Демонстрация.</b> Попросите 2-3 пары показать свое решение всему классу.</li></ol>' FROM teaching_methods WHERE slug = 'juftlikda-dasturlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'title', 'Pair Programming' FROM teaching_methods WHERE slug = 'juftlikda-dasturlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'summary', 'Two students collaborate at a single workstation: the driver writes code while the navigator reviews and guides. Roles swap regularly.' FROM teaching_methods WHERE slug = 'juftlikda-dasturlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'guide_html', '<ol><li><b>Pair up students.</b> Match similar proficiency levels to prevent one dominating the work.</li><li><b>Explain the roles.</b> The Driver types at the keyboard; the Navigator reviews code and plans ahead.</li><li><b>Set a timer.</b> Swap roles every 7-10 minutes without exception.</li><li><b>Monitor.</b> Check in on silent pairs: "What step are you currently working on?"</li><li><b>Review.</b> Have 2-3 pairs showcase and explain their solutions.</li></ol>' FROM teaching_methods WHERE slug = 'juftlikda-dasturlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'title', 'Jup bolıp dastúrlew' FROM teaching_methods WHERE slug = 'juftlikda-dasturlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'summary', 'Eki oqıwshı bir kompyuterde isleydi: biri kod jazadı, ekinshisi baǵdarlaydı hám qátelikti gúzetedi. Roller almasıp turadı.' FROM teaching_methods WHERE slug = 'juftlikda-dasturlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'guide_html', '<ol><li><b>Jup dúziń.</b> Därejesi jaqın oqıwshılardı qosıń — ayırmashılıq úlken bolsa, ázzisi baqlawshıǵa aylanıp qaladı.</li><li><b>Rollerdi túsindiriń.</b> "Aydawshı" klaviatura aldında, "Shturman" ekrandı baqlap baǵıt beredi.</li><li><b>Taymer qoyıń.</b> Hár 7-10 minutta roller almasadı — bul májbúriy.</li><li><b>Gúzetiń.</b> Shturman tınısh qalǵan juplarǵa soraw beriń: "Házir ne qılıp atırsızlar?"</li><li><b>Juwmaqta 2-3 jup sheshimin klassqa kórsetsin.</b></li></ol>' FROM teaching_methods WHERE slug = 'juftlikda-dasturlash'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 5.3 Jonli kod yozish (jonli-kod-yozish)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'title', 'Живое кодирование (Live Coding)' FROM teaching_methods WHERE slug = 'jonli-kod-yozish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'summary', 'Учитель объясняет концепцию, создавая код на экране в реальном времени — допуская ошибки и показывая, как их находить и исправлять.' FROM teaching_methods WHERE slug = 'jonli-kod-yozish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'guide_html', '<ol><li><b>Начните с чистого листа.</b> Не вставляйте готовые куски кода.</li><li><b>Рассуждайте вслух:</b> «Сейчас мне нужна переменная, потому что...»</li><li><b>Допустите ошибку намеренно.</b> Прочтите сообщение об ошибке вместе и исправьте его.</li><li><b>Делайте паузу каждые 5 минут:</b> «Что мы напишем дальше?»</li><li><b>Очистите экран:</b> пусть ученики воспроизведут решение самостоятельно.</li></ol>' FROM teaching_methods WHERE slug = 'jonli-kod-yozish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'title', 'Live Coding' FROM teaching_methods WHERE slug = 'jonli-kod-yozish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'summary', 'The instructor builds code live on screen, demonstrating thought processes, intentional bugs, and debugging strategies in real time.' FROM teaching_methods WHERE slug = 'jonli-kod-yozish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'guide_html', '<ol><li><b>Start from a blank canvas.</b> Avoid pasting pre-written snippets.</li><li><b>Think aloud:</b> "Now we need a variable here because..."</li><li><b>Introduce deliberate bugs.</b> Read the error message together and diagnose it.</li><li><b>Pause every 5 minutes:</b> ask "What line comes next?"</li><li><b>Clear the code:</b> have students implement the logic independently.</li></ol>' FROM teaching_methods WHERE slug = 'jonli-kod-yozish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'title', 'Janlı kod jazıw' FROM teaching_methods WHERE slug = 'jonli-kod-yozish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'summary', 'Oqıtıwshı temani ekranda real waqıtta kod jazıp túsindiredi — qátelikleri menen birge, olardı dúzetip kórsetken halda.' FROM teaching_methods WHERE slug = 'jonli-kod-yozish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'guide_html', '<ol><li><b>Bos fayldan baslań.</b> Tayar kodtı kóshirip qoymań.</li><li><b>Dawıs shıǵarıp oylań:</b> "Endi maǵan ózgeriwshi kerek, sebebi..."</li><li><b>Átteyine qáte etiń.</b> Qáte xabarın birge oqıń hám dúzetiń — bul eń áhmiyetli bólegi.</li><li><b>Hár 5 minutta toqtań</b> hám klastan sorań: "Keyin ne jazamız?"</li><li><b>Aqırında kodtı óshiriń</b> hám oqıwshılar ózleri qaytadan jazsın.</li></ol>' FROM teaching_methods WHERE slug = 'jonli-kod-yozish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 5.4 Klaster (klaster)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'title', 'Кластер (Интеллект-карта)' FROM teaching_methods WHERE slug = 'klaster'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'summary', 'Структурирование знаний вокруг ключевого понятия в виде графической карты ассоциаций и связей.' FROM teaching_methods WHERE slug = 'klaster'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'guide_html', '<ol><li><b>Напишите ключевое понятие в центре</b> и обведите в круг (например, «Цикл»).</li><li><b>Ветки первого уровня:</b> типы, применение, примеры.</li><li><b>Развивайте подветки</b> до истечения времени.</li><li><b>Обмен в парах:</b> добавьте по 2 новые ветки в карту напарника.</li><li><b>Общее обсуждение</b> лучших схем у доски.</li></ol>' FROM teaching_methods WHERE slug = 'klaster'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'title', 'Clustering / Mind Mapping' FROM teaching_methods WHERE slug = 'klaster'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'summary', 'Organizing knowledge by branching out from a core concept into a structured visual mind map.' FROM teaching_methods WHERE slug = 'klaster'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'guide_html', '<ol><li><b>Place the central concept in the middle</b> (e.g. "Loop").</li><li><b>Draw main branches:</b> types, use-cases, and examples.</li><li><b>Branch out further:</b> add detailed sub-nodes rapidly.</li><li><b>Peer exchange:</b> enrich each other''s map with 2 new branches.</li><li><b>Review:</b> assemble a unified master cluster on the board.</li></ol>' FROM teaching_methods WHERE slug = 'klaster'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'title', 'Klaster' FROM teaching_methods WHERE slug = 'klaster'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'summary', 'Oraydaǵı túsinikten shaqalar shıǵarıp, tema boyınsha bilimdi sızba kórinisinde tártipke salıw.' FROM teaching_methods WHERE slug = 'klaster'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'guide_html', '<ol><li><b>Orayǵa tiykarǵı túsinikti jazıń</b> hám dógerekke alıń. Mısalı: "Cikl".</li><li><b>Birinshi dárejeli shaqalar:</b> túrleri, qollanılıwı, mısalları.</li><li><b>Hár shaqadan kishi shaqalar shıǵarıń.</b> Waqıt pitkenshe toqtamań.</li><li><b>Juplıqta almasıń</b> — bir-biriniń klasterine 2 jańa shaqa qossın.</li><li><b>2-3 ewin doskada talqılań.</b></li></ol>' FROM teaching_methods WHERE slug = 'klaster'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 5.5 Insert (insert)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'title', 'Инсерт (Метод пометок)' FROM teaching_methods WHERE slug = 'insert'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'summary', 'Осмысленное чтение с маркировкой текста специальными символами: известное, новое, противоречивое и требующее разъяснения.' FROM teaching_methods WHERE slug = 'insert'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'guide_html', '<p>Система знаков:</p><ul><li><b>✓</b> — уже знал(а)</li><li><b>+</b> — новая информация</li><li><b>−</b> — противоречит моим знаниям</li><li><b>?</b> — непонятно, есть вопрос</li></ul><ol><li>Выпишите обозначения на доске.</li><li>Ученики индивидуально читают и размечают поля.</li><li>Заполнение таблицы по знакам.</li><li>Разбор блока «?» с учителем.</li></ol>' FROM teaching_methods WHERE slug = 'insert'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'title', 'INSERT Method (Interactive Noting)' FROM teaching_methods WHERE slug = 'insert'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'summary', 'Active reading strategy using margin marks to classify information: known, new, contrary, or questioning.' FROM teaching_methods WHERE slug = 'insert'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'guide_html', '<p>Symbol legend:</p><ul><li><b>✓</b> — Already knew this</li><li><b>+</b> — New information</li><li><b>−</b> — Contradicts prior knowledge</li><li><b>?</b> — Confusing / have a question</li></ul><ol><li>Display symbols on the board.</li><li>Students read and annotate margins.</li><li>Fill out summary table columns.</li><li>Address and explain all "?" points together.</li></ol>' FROM teaching_methods WHERE slug = 'insert'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'title', 'Insert (Belgilep oqıw usılı)' FROM teaching_methods WHERE slug = 'insert'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'summary', 'Tekstti belgiler menen oqıw: bilgen, jańa, qarama-qarsı hám túsiniksiz maǵlıwmattı ajıratıp belgilew.' FROM teaching_methods WHERE slug = 'insert'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'guide_html', '<p>Belgiler sisteması:</p><ul><li><b>✓</b> — bunı biler edim</li><li><b>+</b> — bul men ushın jańa</li><li><b>−</b> — bul men bilgenge qarsı</li><li><b>?</b> — bul túsiniksiz, sorawım bar</li></ul><ol><li><b>Belgilerdi doskaǵa jazıp qoyıń.</b></li><li><b>Oqıwshılar tekstti oqıp, shetine belgi qoyadı.</b></li><li><b>Kesteni toltıradı:</b> hár belgi ushın bólek baǵana.</li><li><b>"?" belgilerin jıynań</b> — sabaqtıń dawamı usı sorawlardan qurıladı.</li></ol>' FROM teaching_methods WHERE slug = 'insert'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 5.6 Xatoni top (xatoni-top)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'title', 'Найди ошибку (Find the Bug)' FROM teaching_methods WHERE slug = 'xatoni-top'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'summary', 'Ученикам предлагается код с намеренными дефектами. Задача — обнаружить ошибку, объяснить ее причину и устранить.' FROM teaching_methods WHERE slug = 'xatoni-top'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'guide_html', '<ol><li><b>Подготовьте 3 уровня сложности:</b> синтаксические, логические и комбинированные ошибки.</li><li><b>Работа в группах (5 минут).</b></li><li><b>Каждая группа отвечает:</b> где ошибка, почему возникла и как исправить.</li><li><b>Запустите код</b> и разберите вывод компилятора вместе.</li><li><b>Начисление баллов:</b> нашел +1, объяснил причину +2.</li></ol>' FROM teaching_methods WHERE slug = 'xatoni-top'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'title', 'Find the Bug' FROM teaching_methods WHERE slug = 'xatoni-top'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'summary', 'Students analyze intentionally flawed code snippets to detect syntax and logic bugs, understand their root causes, and refactor them.' FROM teaching_methods WHERE slug = 'xatoni-top'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'guide_html', '<ol><li><b>Prepare tiered snippets:</b> syntax errors, runtime/logic bugs, and combinations.</li><li><b>Distribute to small groups (5 mins).</b></li><li><b>Have groups report:</b> exact line, underlying reason, and clean fix.</li><li><b>Run code live</b> to demonstrate the compiler behavior.</li><li><b>Score:</b> +1 point for finding, +2 points for rationale.</li></ol>' FROM teaching_methods WHERE slug = 'xatoni-top'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'title', 'Qátelikti tap' FROM teaching_methods WHERE slug = 'xatoni-top'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'summary', 'Oqıwshılarǵa átteyine qáte qılınǵan kod beriledi. Wazıypar — qátelikti tabıw, sebebin túsindiriw hám dúzetiw.' FROM teaching_methods WHERE slug = 'xatoni-top'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'guide_html', '<ol><li><b>3 túrli dárejedegi kod tayarlań:</b> sintaksis qáteligi, logikalıq qáte, ekewi birge.</li><li><b>Toparlarǵa tarqatıń.</b> 5 minut waqıt beriń.</li><li><b>Hár topar 3 nárseni aytsın:</b> qáte qáyerde, ne ushın qáte, qalay dúzetiledi.</li><li><b>Kodtı iske túsirip kórsetiń</b> — qáte xabarın birge oqıń.</li><li><b>Ball beriń:</b> tapqanǵa +1, sebebin túsindirgenge +2.</li></ol>' FROM teaching_methods WHERE slug = 'xatoni-top'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 5.7 Venn diagrammasi (venn-diagrammasi)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'title', 'Диаграмма Венна' FROM teaching_methods WHERE slug = 'venn-diagrammasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'summary', 'Сравнение двух понятий с помощью пересекающихся кругов: фиксация различий по краям и общих черт в центре пересечения.' FROM teaching_methods WHERE slug = 'venn-diagrammasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'guide_html', '<ol><li><b>Выберите 2 смежных понятия</b> (например, «Цикл и Рекурсия» или «ОЗУ и SSD»).</li><li><b>Нарисуйте два пересекающихся круга.</b></li><li><b>Заполните:</b> различия по сторонам, сходства в пересечении.</li><li><b>Парная проверка.</b></li><li><b>Итоговое составление на доске.</b></li></ol>' FROM teaching_methods WHERE slug = 'venn-diagrammasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'title', 'Venn Diagram' FROM teaching_methods WHERE slug = 'venn-diagrammasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'summary', 'Comparing two related concepts using overlapping circles: distinct properties placed outside, common traits in the overlap.' FROM teaching_methods WHERE slug = 'venn-diagrammasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'guide_html', '<ol><li><b>Choose two concepts</b> prone to confusion (e.g. "Loop vs Recursion").</li><li><b>Draw two overlapping circles.</b></li><li><b>Record differences on outer flanks</b> and shared features in the intersection.</li><li><b>Peer review.</b></li><li><b>Consolidate findings on the board.</b></li></ol>' FROM teaching_methods WHERE slug = 'venn-diagrammasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'title', 'Venn diagramması' FROM teaching_methods WHERE slug = 'venn-diagrammasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'summary', 'Eki túsinikti kesilisetuǵın dógerekler arqalı salıstırıw: ulıwma hám parqlı táreplerin ajıratıw.' FROM teaching_methods WHERE slug = 'venn-diagrammasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'guide_html', '<ol><li><b>Eki túsinikti tańlań</b> — oqıwshılar shatastıratuǵının. Mısalı: "Cikl hám Rekursiya" yamasa "RAM hám Qattı disk".</li><li><b>Eki kesilisetuǵın dógerek sızıń.</b></li><li><b>Shetlerine parqlardı, ortaǵa ulıwma táreplerin jazıń.</b></li><li><b>Juplıqta tekserip shıǵıń.</b></li><li><b>Doskada ulıwma diagramma jıynań.</b></li></ol>' FROM teaching_methods WHERE slug = 'venn-diagrammasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 5.8 Bumerang (bumerang)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'title', 'Бумеранг (Взаимообучение)' FROM teaching_methods WHERE slug = 'bumerang'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'summary', 'Учащийся осваивает определенный раздел, а затем обучает ему своих одноклассников. Обучая других, он сам глубже постигает тему.' FROM teaching_methods WHERE slug = 'bumerang'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'guide_html', '<ol><li><b>Разделите тему на 4 блока</b> и класс на 4 «экспертные» группы.</li><li><b>Каждая группа изучает свою часть</b> (10 минут).</li><li><b>Перемешайте группы:</b> в новой группе должно быть по одному эксперту от каждого блока.</li><li><b>Эксперты по очереди обучают свою группу</b> (по 4 минуты на каждого).</li><li><b>Проведите экспресс-тест</b> для контроля усвоения.</li></ol>' FROM teaching_methods WHERE slug = 'bumerang'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'title', 'Boomerang (Jigsaw Peer Teaching)' FROM teaching_methods WHERE slug = 'bumerang'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'summary', 'Students master a distinct module in expert groups, then rotate to teach their peers, reinforcing their own mastery in the process.' FROM teaching_methods WHERE slug = 'bumerang'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'guide_html', '<ol><li><b>Divide the topic into 4 parts</b> across 4 expert groups.</li><li><b>Expert study session (10 mins).</b></li><li><b>Shuffle into mixed groups:</b> ensure one expert from each section per table.</li><li><b>Peer teaching:</b> each expert teaches their section (4 mins each).</li><li><b>Short quiz</b> at the end to evaluate collective understanding.</li></ol>' FROM teaching_methods WHERE slug = 'bumerang'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'title', 'Bumerang' FROM teaching_methods WHERE slug = 'bumerang'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'summary', 'Oqıwshı materialdı úyrenedi, keyin onı basqalarǵa úyretedi. Úyretiw arqalı ózi tereńirek bekkemleydi.' FROM teaching_methods WHERE slug = 'bumerang'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'guide_html', '<ol><li><b>Temanı 4 bólekke bóliń</b> hám klastı 4 toparǵa ajıratıń.</li><li><b>Hár topar óz bólegin úyrenedi</b> (10 minut) — bul "ekspert toparı".</li><li><b>Toparlardı qayta aralastırıń:</b> jańa toparda hár bólimnen bir ekspertten bolsın.</li><li><b>Hár ekspert óz bólegin toparǵa úyretedi</b> (hár birine 4 minut).</li><li><b>Juwmaqta pútin tema boyınsha qısqa test ótkeriń.</b></li></ol>' FROM teaching_methods WHERE slug = 'bumerang'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 5.9 Svetofor (svetofor)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'title', 'Светофор (Экспресс-оценка)' FROM teaching_methods WHERE slug = 'svetofor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'summary', 'Ученики сигнализируют о степени понимания с помощью 3 цветов карточек, давая учителю мгновенную обратную связь обо всем классе.' FROM teaching_methods WHERE slug = 'svetofor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'guide_html', '<p>Значения цветов:</p><ul><li><b>Зеленый</b> — всё понятно, идем дальше</li><li><b>Желтый</b> — понял частично, нужен пример</li><li><b>Красный</b> — не понял, объясните заново</li></ul><ol><li>После ключевого блока скомандуйте: «Поднимите карточки».</li><li>Если много красного — повторить объяснение с новым примером.</li><li>Если преобладает желтый — разобрать 2-3 практические задачи.</li><li>Если зеленый — переходить дальше, адресно поддержав поднявших красный.</li></ol>' FROM teaching_methods WHERE slug = 'svetofor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'title', 'Traffic Light Check' FROM teaching_methods WHERE slug = 'svetofor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'summary', 'Real-time formative assessment using color cards to gauge student comprehension at a glance.' FROM teaching_methods WHERE slug = 'svetofor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'guide_html', '<p>Color meanings:</p><ul><li><b>Green</b> — fully understood, ready to move on</li><li><b>Yellow</b> — partially understood, need another example</li><li><b>Red</b> — confused, please explain again</li></ul><ol><li>After presenting a concept, call "Cards up on 3".</li><li>If Red predominates: re-explain with a fresh metaphor.</li><li>If Yellow: work through 2-3 practical exercises.</li><li>If Green: proceed forward while supporting red cards individually.</li></ol>' FROM teaching_methods WHERE slug = 'svetofor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'title', 'Svetofor' FROM teaching_methods WHERE slug = 'svetofor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'summary', 'Oqıwshılar úsh reńli kartochka menen túsiniw dárejesin bildiredi. Oqıtıwshı klastıń jaǵdayın dárriw kóredi.' FROM teaching_methods WHERE slug = 'svetofor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'guide_html', '<p>Reńler mánisi:</p><ul><li><b>Jasıl</b> — túsindim, dawam eteyik</li><li><b>Sarı</b> — qosımsha mısal kerek</li><li><b>Qızıl</b> — túsinbedim, qaytadan túsindiriń</li></ul><ol><li><b>Hár jańa bólimnen keyin toqtań</b> hám "kartochka kóteriń" deń.</li><li><b>Qızıl kóp bolsa</b> — temanı basqa mısal menen qayталаń.</li><li><b>Sarı kóp bolsa</b> — 2-3 ámeliy mısal beriń.</li><li><b>Jasıl kóp bolsa</b> — keyingi basqıshqa ótiń, qızıl kótergenlerge jeke járdem beriń.</li></ol>' FROM teaching_methods WHERE slug = 'svetofor'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 5.10 Blok-sxemadan kodga (blok-sxemadan-kodga)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'title', 'От блок-схемы к коду' FROM teaching_methods WHERE slug = 'blok-sxemadan-kodga'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'summary', 'Сначала составление алгоритма на бумаге в виде схемы, затем трансляция блоков в строки кода. Отделяет логику от синтаксиса.' FROM teaching_methods WHERE slug = 'blok-sxemadan-kodga'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'ru', 'guide_html', '<ol><li><b>Напомните фигуры:</b> овал — старт/конец, прямоугольник — действие, ромб — условие.</li><li><b>Проанализируйте задачу</b> и выделите входные/выходные данные.</li><li><b>Нарисуйте схему на бумаге</b> до прикосновения к компьютеру.</li><li><b>Обмен с соседом</b> для ручной трассировки схемы.</li><li><b>Перенос в код:</b> каждый блок переводится в 1-2 строки программы.</li></ol>' FROM teaching_methods WHERE slug = 'blok-sxemadan-kodga'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'title', 'From Flowchart to Code' FROM teaching_methods WHERE slug = 'blok-sxemadan-kodga'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'summary', 'Drafting algorithmic logic on paper via flowcharts before typing syntax, decoupling problem solving from coding details.' FROM teaching_methods WHERE slug = 'blok-sxemadan-kodga'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'en', 'guide_html', '<ol><li><b>Review symbols:</b> oval (start/end), rectangle (process), diamond (decision).</li><li><b>Deconstruct problem conditions</b> into logical stages.</li><li><b>Draft flowchart on paper</b> before touching the keyboard.</li><li><b>Dry-run with a peer</b> step by step to catch logical gaps.</li><li><b>Implement in code:</b> translate each visual block into programming syntax.</li></ol>' FROM teaching_methods WHERE slug = 'blok-sxemadan-kodga'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'title', 'Blok-sxemadan kodqa' FROM teaching_methods WHERE slug = 'blok-sxemadan-kodga'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'summary', 'Aldın qaǵazda algoritmdi sızba túrinde dúziw, keyin onı kodqa ótkeriw. Pikirlewdi sintaksisten ajıratadı.' FROM teaching_methods WHERE slug = 'blok-sxemadan-kodga'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'teaching_methods', id, 'kaa', 'guide_html', '<ol><li><b>Belgilerdi esletip ótiń:</b> oval — baslanıw/tamamlanıw, tórtmúyeshlik — ámel, romb — shárt.</li><li><b>Máseleni birge oqıń</b> hám shártlerin ajıratıp alıń.</li><li><b>Sxemanı qaǵazda sızıń.</b> Kompyuterge ele tiymeydi.</li><li><b>Qońsı menen almasıń</b> — ol sxema boyınsha qol menen esaplap kórsin.</li><li><b>Endi kodqa ótkeriń.</b> Hár blok — bir-eki qatar kod.</li></ol>' FROM teaching_methods WHERE slug = 'blok-sxemadan-kodga'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

END $$;
