-- ============================================================
-- EduCode — Baza kontenti tarjimalari: KURSLAR VA MAVZULAR
--   1. Asosiy kurslar (courses) -> ru, en, kaa
--   2. Mavzular (topics - ma'ruza, amaliyot, laboratoriya, kirish) -> ru, en, kaa
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
-- ============================================================

DO $$
BEGIN
  -- ============================================================
  -- 1. KURSLAR (COURSES)
  -- ============================================================

  -- 1.1 Python dasturlash asoslari (python-basics)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'title', 'Основы программирования на Python' FROM courses WHERE slug = 'python-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'description', 'Изучите язык Python с нуля: переменные, условия, циклы, функции, списки и практические проекты.' FROM courses WHERE slug = 'python-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'title', 'Python Programming Fundamentals' FROM courses WHERE slug = 'python-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'description', 'Master Python from scratch: variables, conditionals, loops, functions, lists, and real-world projects.' FROM courses WHERE slug = 'python-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'title', 'Python dastúrlew tiykarları' FROM courses WHERE slug = 'python-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'description', 'Python dastúrlew tilin nolden úyreniń: ózgeriwshiler, shártler, cikller, funktsiyalar hám ámeliy proektler.' FROM courses WHERE slug = 'python-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.2 JavaScript asoslari (javascript-basics)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'title', 'Основы JavaScript' FROM courses WHERE slug = 'javascript-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'description', 'Основа веб-разработки: изучайте интерактивность веб-страниц, работу с DOM и современный JavaScript.' FROM courses WHERE slug = 'javascript-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'title', 'JavaScript Fundamentals' FROM courses WHERE slug = 'javascript-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'description', 'The engine of the modern web: learn dynamic interactions, DOM manipulation, and modern JavaScript syntax.' FROM courses WHERE slug = 'javascript-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'title', 'JavaScript tiykarları' FROM courses WHERE slug = 'javascript-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'description', 'Veb-dastúrlewdiń tiykarı bolǵan JavaScript tilin, DOM menen islesiwdi hám interaktivlikti úyreniń.' FROM courses WHERE slug = 'javascript-basics'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.3 Frontend (frontend-course)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'title', 'Frontend-разработка (HTML, CSS, React)' FROM courses WHERE slug = 'frontend-course'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'description', 'Создавайте современные отзывчивые веб-интерфейсы с помощью HTML5, CSS3, Tailwind и React.' FROM courses WHERE slug = 'frontend-course'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'title', 'Frontend Development (HTML, CSS, React)' FROM courses WHERE slug = 'frontend-course'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'description', 'Build modern, responsive, high-performance user interfaces with HTML5, modern CSS, and React.' FROM courses WHERE slug = 'frontend-course'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'title', 'Frontend dastúrlew (HTML, CSS, React)' FROM courses WHERE slug = 'frontend-course'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'description', 'Zamanagóy veb-saytlar jaratıwdı úyreniń. HTML5, CSS3, stil beriw hám React texnologiyaları.' FROM courses WHERE slug = 'frontend-course'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.4 Kompyuter savodxonligi (computer-literacy)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'title', 'Компьютерная грамотность и цифровая безопасность' FROM courses WHERE slug = 'computer-literacy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'description', 'Основы эффективной работы с ПК, офисными программами, облачными сервисами и кибербезопасностью.' FROM courses WHERE slug = 'computer-literacy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'title', 'Computer Literacy & Digital Skills' FROM courses WHERE slug = 'computer-literacy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'description', 'Master essential computing skills: operating systems, office suites, cloud workflows, and cybersecurity essentials.' FROM courses WHERE slug = 'computer-literacy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'title', 'Kompyuter sawatxanlıǵı hám cifrlı qáwipsizlik' FROM courses WHERE slug = 'computer-literacy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'description', 'Kompyuter menen islesiw tiykarları: Office dastúrleri, internet, bult xızmetleri hám cifrlı qáwipsizlik.' FROM courses WHERE slug = 'computer-literacy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.5 Prompt Engineering (prompt-engineering)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'title', 'Промпт-инжиниринг и ИИ' FROM courses WHERE slug = 'prompt-engineering'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'description', 'Искусство эффективного взаимодействия с нейросетями: ChatGPT, Claude, структурирование промптов и автоматизация.' FROM courses WHERE slug = 'prompt-engineering'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'title', 'Prompt Engineering & AI' FROM courses WHERE slug = 'prompt-engineering'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'description', 'Master communication with advanced AI models: prompt architecture, ChatGPT, Claude, and workflow automation.' FROM courses WHERE slug = 'prompt-engineering'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'title', 'Prompt Engineering hám Jasalma intellekt' FROM courses WHERE slug = 'prompt-engineering'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'description', 'Jasalma intellekt penen nátiyjeli islesiw kónlikpeleri: ChatGPT, Claude, promptlar strukturası hám avtomatlastırıw.' FROM courses WHERE slug = 'prompt-engineering'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.6 Algoritmlar (algorithms-ds)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'title', 'Алгоритмы и структуры данных' FROM courses WHERE slug = 'algorithms-ds'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'description', 'Глубокое изучение алгоритмов поиска, сортировки, графов, динамического программирования и олимпиадных задач.' FROM courses WHERE slug = 'algorithms-ds'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'title', 'Algorithms & Data Structures' FROM courses WHERE slug = 'algorithms-ds'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'description', 'In-depth mastery of search, sorting, graphs, dynamic programming, and competitive programming challenges.' FROM courses WHERE slug = 'algorithms-ds'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'title', 'Algoritmler hám maǵlıwmatlar dúzilisi' FROM courses WHERE slug = 'algorithms-ds'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'description', 'Dastúrlew olimpiadaları hám texnikalıq intervyuler ushın algoritmler, graflar hám maǵlıwmatlar strukturaları.' FROM courses WHERE slug = 'algorithms-ds'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.7 Dasturlash asoslari (Ma'ruza)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'title', 'Основы программирования (Лекции)' FROM courses WHERE slug = 'dasturlash-asoslari-maruza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'description', 'Теоретический курс по учебной программе DAS1208: от синтаксиса и типов данных до функций и модулей.' FROM courses WHERE slug = 'dasturlash-asoslari-maruza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'title', 'Fundamentals of Programming (Lectures)' FROM courses WHERE slug = 'dasturlash-asoslari-maruza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'description', 'Theoretical foundations aligned with curriculum DAS1208: core syntax, data types, control flow, functions, and modules.' FROM courses WHERE slug = 'dasturlash-asoslari-maruza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'title', 'Dastúrlew tiykarları (Lekciya)' FROM courses WHERE slug = 'dasturlash-asoslari-maruza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'description', 'DAS1208 pán baǵdarlaması boyınsha teoriyalıq kurs: sintaksis, maǵlıwmat túrleri, shártler, funktsiyalar hám moduller.' FROM courses WHERE slug = 'dasturlash-asoslari-maruza'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.8 Dasturlash asoslari (Amaliyot)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'title', 'Основы программирования (Практика)' FROM courses WHERE slug = 'dasturlash-asoslari-amaliyot'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'description', 'Практические задания, алгоритмические задачи и интерактивные тесты для закрепления тем лекций.' FROM courses WHERE slug = 'dasturlash-asoslari-amaliyot'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'title', 'Fundamentals of Programming (Practice)' FROM courses WHERE slug = 'dasturlash-asoslari-amaliyot'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'description', 'Practical coding challenges, algorithm workshops, and interactive quizzes reinforcing lecture materials.' FROM courses WHERE slug = 'dasturlash-asoslari-amaliyot'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'title', 'Dastúrlew tiykarları (Ámeliyat)' FROM courses WHERE slug = 'dasturlash-asoslari-amaliyot'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'description', 'Lekciya temaların bekkemlew ushın ámeliy shınıǵıwlar, algoritmik máseleler hám interaktiv testler.' FROM courses WHERE slug = 'dasturlash-asoslari-amaliyot'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.9 Dasturlash asoslari (Laboratoriya)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'title', 'Основы программирования (Лабораторные работы)' FROM courses WHERE slug = 'dasturlash-asoslari-laboratoriya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'ru', 'description', 'Комплексные лабораторные работы: обработка матриц, файлов, структур данных и создание модульных проектов.' FROM courses WHERE slug = 'dasturlash-asoslari-laboratoriya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'title', 'Fundamentals of Programming (Lab Works)' FROM courses WHERE slug = 'dasturlash-asoslari-laboratoriya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'en', 'description', 'Hands-on laboratory projects: matrix transformations, file IO databases, data structure engineering, and modular design.' FROM courses WHERE slug = 'dasturlash-asoslari-laboratoriya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'title', 'Dastúrlew tiykarları (Laboratoriya jumısları)' FROM courses WHERE slug = 'dasturlash-asoslari-laboratoriya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'courses', id, 'kaa', 'description', 'Quramalı laboratoriya jumısları: matriclar, fayllar menen islesiw, maǵlıwmatlar bazası hám modulli proektler.' FROM courses WHERE slug = 'dasturlash-asoslari-laboratoriya'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;


  -- ============================================================
  -- 2. MAVZULAR (TOPICS)
  --
  -- Slug va nomlar 27, 29, 31, 32-migratsiyalardan olindi — ya'ni
  -- bazada haqiqatan mavjud mavzular. Fan dasturidagi ro'yxat bilan
  -- ADASHTIRMANG: ular boshqa va slug'lari mos kelmaydi.
  -- ============================================================
  -- python-intro  (Python nima va nima uchun o‘rganish kerak?)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Что такое Python и зачем его изучать?' FROM topics WHERE slug = 'python-intro'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'What is Python and why learn it?' FROM topics WHERE slug = 'python-intro'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Python degen ne hám onı nege úyreniw kerek?' FROM topics WHERE slug = 'python-intro'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- python-setup  (Python o‘rnatish va muhitni sozlash)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Установка Python и настройка среды' FROM topics WHERE slug = 'python-setup'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Installing Python and setting up the environment' FROM topics WHERE slug = 'python-setup'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Python ornatıw hám ortalıqtı sazlaw' FROM topics WHERE slug = 'python-setup'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- python-sintaksis  (Python tili sintaksisi va uning leksik asosi)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Синтаксис языка Python и его лексическая основа' FROM topics WHERE slug = 'python-sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Python syntax and its lexical basis' FROM topics WHERE slug = 'python-sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Python tiliniń sintaksisi hám onıń leksikalıq tiykarı' FROM topics WHERE slug = 'python-sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- python-xatoliklar  (Python tilida xatoliklar (syntax error))
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Ошибки в Python (syntax error)' FROM topics WHERE slug = 'python-xatoliklar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Errors in Python (syntax errors)' FROM topics WHERE slug = 'python-xatoliklar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Python tilinde qátelikler (syntax error)' FROM topics WHERE slug = 'python-xatoliklar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- arifmetik-amallar  (Arifmetik amallar va izohlar)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Арифметические операции и комментарии' FROM topics WHERE slug = 'arifmetik-amallar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Arithmetic operations and comments' FROM topics WHERE slug = 'arifmetik-amallar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Arifmetikalıq ámeller hám túsindirmeler' FROM topics WHERE slug = 'arifmetik-amallar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- ozgaruvchilar-va-turlar  (O‘zgaruvchilar va ma’lumot turlari)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Переменные и типы данных' FROM topics WHERE slug = 'ozgaruvchilar-va-turlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Variables and data types' FROM topics WHERE slug = 'ozgaruvchilar-va-turlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Ózgeriwshiler hám maǵlıwmat túrleri' FROM topics WHERE slug = 'ozgaruvchilar-va-turlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- matnlar-va-sonlar  (Matnlar va sonlar bilan ishlash)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Работа с текстом и числами' FROM topics WHERE slug = 'matnlar-va-sonlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Working with text and numbers' FROM topics WHERE slug = 'matnlar-va-sonlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Tekst hám sanlar menen islew' FROM topics WHERE slug = 'matnlar-va-sonlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- royxatlar-va-for  (Ro‘yxatlar, o‘zgarmas ro‘yxatlar va for sikli)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Списки, кортежи и цикл for' FROM topics WHERE slug = 'royxatlar-va-for'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Lists, tuples and the for loop' FROM topics WHERE slug = 'royxatlar-va-for'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Dizimler, ózgermeytuǵın dizimler hám for sikli' FROM topics WHERE slug = 'royxatlar-va-for'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- shartlar-va-tarmoqlanish  (Shartlar va tarmoqlanish)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Условия и ветвление' FROM topics WHERE slug = 'shartlar-va-tarmoqlanish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Conditions and branching' FROM topics WHERE slug = 'shartlar-va-tarmoqlanish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Shártler hám tarmaqlanıw' FROM topics WHERE slug = 'shartlar-va-tarmoqlanish'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- lugat-va-toplam  (Lug‘at (dict) va to‘plam (set))
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Словарь (dict) и множество (set)' FROM topics WHERE slug = 'lugat-va-toplam'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Dictionaries (dict) and sets (set)' FROM topics WHERE slug = 'lugat-va-toplam'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Sózlik (dict) hám toplam (set)' FROM topics WHERE slug = 'lugat-va-toplam'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- while-sikli  (While sikli)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Цикл while' FROM topics WHERE slug = 'while-sikli'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'The while loop' FROM topics WHERE slug = 'while-sikli'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'While sikli' FROM topics WHERE slug = 'while-sikli'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- funksiyalar  (Funksiyalar bilan ishlash)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Работа с функциями' FROM topics WHERE slug = 'funksiyalar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Working with functions' FROM topics WHERE slug = 'funksiyalar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Funkciyalar menen islew' FROM topics WHERE slug = 'funksiyalar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- modullar  (Modullar bilan ishlash)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Работа с модулями' FROM topics WHERE slug = 'modullar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Working with modules' FROM topics WHERE slug = 'modullar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Modulller menen islew' FROM topics WHERE slug = 'modullar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- python-va-suniy-intellekt  (Python va sun’iy intellekt)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Python и искусственный интеллект' FROM topics WHERE slug = 'python-va-suniy-intellekt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Python and artificial intelligence' FROM topics WHERE slug = 'python-va-suniy-intellekt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', 'Python hám jasalma intellekt' FROM topics WHERE slug = 'python-va-suniy-intellekt'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- amaliy-1-sintaksis  (1-amaliy mashg‘ulot: Python tili sintaksisi)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Практическое занятие 1: Синтаксис языка Python' FROM topics WHERE slug = 'amaliy-1-sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Practical 1: Python syntax' FROM topics WHERE slug = 'amaliy-1-sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '1-ámeliy shınıǵıw: Python tiliniń sintaksisi' FROM topics WHERE slug = 'amaliy-1-sintaksis'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- amaliy-2-xatoliklar  (2-amaliy mashg‘ulot: Xatoliklarni topish va tuzatish)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Практическое занятие 2: Поиск и исправление ошибок' FROM topics WHERE slug = 'amaliy-2-xatoliklar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Practical 2: Finding and fixing errors' FROM topics WHERE slug = 'amaliy-2-xatoliklar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '2-ámeliy shınıǵıw: Qateliklerdi tabıw hám dúzetiw' FROM topics WHERE slug = 'amaliy-2-xatoliklar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- amaliy-3-sikllar  (3-amaliy mashg‘ulot: For va While operatorlari)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Практическое занятие 3: Операторы for и while' FROM topics WHERE slug = 'amaliy-3-sikllar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Practical 3: The for and while statements' FROM topics WHERE slug = 'amaliy-3-sikllar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '3-ámeliy shınıǵıw: For hám While operatorları' FROM topics WHERE slug = 'amaliy-3-sikllar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- amaliy-4-shartlar  (4-amaliy mashg‘ulot: Shartlar va tarmoqlanish)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Практическое занятие 4: Условия и ветвление' FROM topics WHERE slug = 'amaliy-4-shartlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Practical 4: Conditions and branching' FROM topics WHERE slug = 'amaliy-4-shartlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '4-ámeliy shınıǵıw: Shártler hám tarmaqlanıw' FROM topics WHERE slug = 'amaliy-4-shartlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- amaliy-5-while  (5-amaliy mashg‘ulot: While sikliga doir misollar)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Практическое занятие 5: Примеры на цикл while' FROM topics WHERE slug = 'amaliy-5-while'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Practical 5: Exercises on the while loop' FROM topics WHERE slug = 'amaliy-5-while'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '5-ámeliy shınıǵıw: While siklina tiyisli mısallar' FROM topics WHERE slug = 'amaliy-5-while'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- amaliy-6-funksiyalar  (6-amaliy mashg‘ulot: Funksiyalarni e’lon qilish va aniqlash)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Практическое занятие 6: Объявление и определение функций' FROM topics WHERE slug = 'amaliy-6-funksiyalar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Practical 6: Declaring and defining functions' FROM topics WHERE slug = 'amaliy-6-funksiyalar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '6-ámeliy shınıǵıw: Funkciyalardı járiyalaw hám anıqlaw' FROM topics WHERE slug = 'amaliy-6-funksiyalar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- lab-1-sintaksis-turlar  (1-laboratoriya ishi: Sintaksis, arifmetik amallar, ma’lumot turlari)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Лабораторная работа 1: Синтаксис, арифметика, типы данных' FROM topics WHERE slug = 'lab-1-sintaksis-turlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Lab 1: Syntax, arithmetic and data types' FROM topics WHERE slug = 'lab-1-sintaksis-turlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '1-laboratoriya jumısı: Sintaksis, arifmetika, maǵlıwmat túrleri' FROM topics WHERE slug = 'lab-1-sintaksis-turlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- lab-2-matnlar  (2-laboratoriya ishi: Matnlar va sonlar bilan ishlash)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Лабораторная работа 2: Работа с текстом и числами' FROM topics WHERE slug = 'lab-2-matnlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Lab 2: Working with text and numbers' FROM topics WHERE slug = 'lab-2-matnlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '2-laboratoriya jumısı: Tekst hám sanlar menen islew' FROM topics WHERE slug = 'lab-2-matnlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- lab-3-royxatlar-for  (3-laboratoriya ishi: Ro‘yxatlar va For sikli)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Лабораторная работа 3: Списки и цикл for' FROM topics WHERE slug = 'lab-3-royxatlar-for'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Lab 3: Lists and the for loop' FROM topics WHERE slug = 'lab-3-royxatlar-for'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '3-laboratoriya jumısı: Dizimler hám For sikli' FROM topics WHERE slug = 'lab-3-royxatlar-for'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- lab-4-shartlar  (4-laboratoriya ishi: Shartlar va tarmoqlanish)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Лабораторная работа 4: Условия и ветвление' FROM topics WHERE slug = 'lab-4-shartlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Lab 4: Conditions and branching' FROM topics WHERE slug = 'lab-4-shartlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '4-laboratoriya jumısı: Shártler hám tarmaqlanıw' FROM topics WHERE slug = 'lab-4-shartlar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- lab-5-while  (5-laboratoriya ishi: While sikli)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Лабораторная работа 5: Цикл while' FROM topics WHERE slug = 'lab-5-while'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Lab 5: The while loop' FROM topics WHERE slug = 'lab-5-while'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '5-laboratoriya jumısı: While sikli' FROM topics WHERE slug = 'lab-5-while'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- lab-6-funksiyalar  (6-laboratoriya ishi: Funksiyalar)
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'ru', 'title', 'Лабораторная работа 6: Функции' FROM topics WHERE slug = 'lab-6-funksiyalar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'en', 'title', 'Lab 6: Functions' FROM topics WHERE slug = 'lab-6-funksiyalar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'topics', id, 'kaa', 'title', '6-laboratoriya jumısı: Funkciyalar' FROM topics WHERE slug = 'lab-6-funksiyalar'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

END $$;
