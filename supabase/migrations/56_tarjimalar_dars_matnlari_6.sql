-- ============================================================
-- EduCode — Dars matnlari tarjimasi: MA'RUZA 11-12 (oxirgi)
--   topics.content_html -> ru, en, kaa
--
--   11. modullar                 — import, math/random/datetime, pip
--   12. python-va-suniy-intellekt — SI, mashinaviy o'qitish, kutubxonalar
--
-- Shu migratsiya bilan 12 ta ma'ruza matni to'liq tarjima qilindi.
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
--
-- TARJIMA QOIDASI: HTML teglari, Python kalit so'zlari, modul va
-- kutubxona nomlari (math, NumPy, scikit-learn) o'zgarmaydi. Kod
-- izohlari, matn qiymatlari va o'zgaruvchi nomlari tarjima qilinadi.
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
BEGIN

  -- ============================================================
  -- 11. modullar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'modullar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Использование кода, написанного другими</h2>
<p><b>Модуль</b> — файл Python, в котором хранится набор готовых функций и значений. Квадратный корень, случайное число, работа с датами — всё это уже написано. Нам остаётся лишь подключить нужный модуль.</p>

<h3>import — подключение модуля</h3>
<pre><code>import math

print(math.sqrt(16))    # 4.0
print(math.pi)          # 3.141592653589793</code></pre>
<p>После подключения к содержимому модуля обращаются в виде <code>модуль.имя</code>.</p>

<h3>from ... import — взять только нужное</h3>
<pre><code>from math import sqrt, pi

print(sqrt(16))     # имя модуля писать не нужно
print(pi)</code></pre>
<p>Так короче, но есть риск столкновения имён. В больших проектах обычный <code>import</code> безопаснее.</p>

<h3>Псевдоним</h3>
<pre><code>import random as r
print(r.randint(1, 6))</code></pre>
<p>Применяется, чтобы сократить длинные имена модулей.</p>

<h3>math — математические операции</h3>
<pre><code>import math

print(math.sqrt(25))      # 5.0  — квадратный корень
print(math.ceil(4.1))     # 5    — округление вверх
print(math.floor(4.9))    # 4    — округление вниз
print(math.factorial(5))  # 120  — факториал
print(math.pow(2, 10))    # 1024.0
print(math.gcd(12, 18))   # 6    — НОД</code></pre>
<p>Внимание: <code>round()</code> и <code>abs()</code> — встроенные функции Python, для них модуль не нужен.</p>

<h3>random — случайные числа</h3>
<pre><code>import random

print(random.randint(1, 6))              # целое число в диапазоне 1..6
print(random.random())                   # дробь от 0.0 до 1.0
print(random.choice(["яблоко", "гранат"])) # случайный элемент списка

chisla = [1, 2, 3, 4, 5]
random.shuffle(chisla)                   # перемешивает список
print(chisla)</code></pre>
<p>Этот модуль применяется в играх, тестах и симуляциях.</p>

<h3>datetime — дата и время</h3>
<pre><code>from datetime import date, datetime

segodnya = date.today()
print(segodnya)            # 2026-07-28
print(segodnya.year)       # 2026

rozhdenie = date(2005, 3, 15)
raznitsa = segodnya - rozhdenie
print(raznitsa.days)       # число прожитых дней</code></pre>

<h3>Как написать собственный модуль</h3>
<p>Модулем может стать любой файл <code>.py</code>. Создадим, например, файл <code>schet.py</code>:</p>
<pre><code># schet.py
def kvadrat(x):
    return x * x

def kub(x):
    return x ** 3</code></pre>
<p>Теперь в соседнем файле:</p>
<pre><code>import schet

print(schet.kvadrat(4))    # 16
print(schet.kub(3))        # 27</code></pre>
<p>Разделение кода по темам на отдельные файлы — основа порядка в большом проекте.</p>

<h3>pip — внешние библиотеки</h3>
<p>Библиотеки, не входящие в поставку Python, устанавливаются через <code>pip</code>:</p>
<pre><code>pip install requests
pip install numpy</code></pre>
<p>Эта команда пишется в терминале (командной строке), а не внутри программы. После установки пользуются обычным <code>import</code>.</p>

<h3>Итог</h3>
<ul>
  <li><code>import модуль</code> подключает модуль целиком, <code>from модуль import имя</code> — его часть</li>
  <li><code>math</code>, <code>random</code>, <code>datetime</code> — самые ходовые из стандартной библиотеки</li>
  <li>Модулем может стать любой файл <code>.py</code></li>
  <li>Внешние библиотеки ставятся через <code>pip install</code></li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>Using code other people wrote</h2>
<p>A <b>module</b> is a Python file holding a collection of ready-made functions and values. Square roots, random numbers, working with dates — all of it has already been written. All that is left for us is to bring in the module we need.</p>

<h3>import — bringing in a module</h3>
<pre><code>import math

print(math.sqrt(16))    # 4.0
print(math.pi)          # 3.141592653589793</code></pre>
<p>Once a module is imported, the things inside it are reached as <code>module.name</code>.</p>

<h3>from ... import — taking only what you need</h3>
<pre><code>from math import sqrt, pi

print(sqrt(16))     # there is no need to write the module name
print(pi)</code></pre>
<p>This is shorter, but it risks a clash of names. In large projects the plain <code>import</code> is safer.</p>

<h3>Giving an alias</h3>
<pre><code>import random as r
print(r.randint(1, 6))</code></pre>
<p>Used to shorten long module names.</p>

<h3>math — mathematical operations</h3>
<pre><code>import math

print(math.sqrt(25))      # 5.0  — square root
print(math.ceil(4.1))     # 5    — rounding up
print(math.floor(4.9))    # 4    — rounding down
print(math.factorial(5))  # 120  — factorial
print(math.pow(2, 10))    # 1024.0
print(math.gcd(12, 18))   # 6    — greatest common divisor</code></pre>
<p>Note: <code>round()</code> and <code>abs()</code> are built into Python — they need no module.</p>

<h3>random — random numbers</h3>
<pre><code>import random

print(random.randint(1, 6))               # a whole number in the range 1..6
print(random.random())                    # a decimal from 0.0 to 1.0
print(random.choice(["apple", "pomegranate"])) # a random element of a list

numbers = [1, 2, 3, 4, 5]
random.shuffle(numbers)                   # shuffles the list
print(numbers)</code></pre>
<p>This module is used in games, tests and simulations.</p>

<h3>datetime — dates and times</h3>
<pre><code>from datetime import date, datetime

today = date.today()
print(today)               # 2026-07-28
print(today.year)          # 2026

born = date(2005, 3, 15)
difference = today - born
print(difference.days)     # the number of days lived</code></pre>

<h3>Writing your own module</h3>
<p>Any <code>.py</code> file can be a module. Let us create a file called <code>calc.py</code>:</p>
<pre><code># calc.py
def square(x):
    return x * x

def cube(x):
    return x ** 3</code></pre>
<p>Now, in another file beside it:</p>
<pre><code>import calc

print(calc.square(4))    # 16
print(calc.cube(3))      # 27</code></pre>
<p>Splitting code into separate files by topic is the foundation of keeping a large project tidy.</p>

<h3>pip — outside libraries</h3>
<p>Libraries that do not come with Python are installed through <code>pip</code>:</p>
<pre><code>pip install requests
pip install numpy</code></pre>
<p>This command is typed in the terminal (the command line), not inside the program. Once installed, it is used with an ordinary <code>import</code>.</p>

<h3>Summary</h3>
<ul>
  <li><code>import module</code> brings in the whole module, <code>from module import name</code> brings in a part of it</li>
  <li><code>math</code>, <code>random</code>, <code>datetime</code> are the most used of the standard library</li>
  <li>Any <code>.py</code> file can be a module</li>
  <li>Outside libraries are installed with <code>pip install</code></li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Basqalar jazǵan kodtı isletiw</h2>
<p><b>Modul</b> — tayın funkciya hám mánisler toplamı saqlanatuǵın Python faylı. Kvadrat túbir, kezdeysoq san, sáne menen islew — bulardıń barlıǵı áldeqashan jazılǵan. Bizge tek kerekli moduldi jalǵaw qaladı.</p>

<h3>import — moduldi jalǵaw</h3>
<pre><code>import math

print(math.sqrt(16))    # 4.0
print(math.pi)          # 3.141592653589793</code></pre>
<p>Modul jalǵanǵannan keyin, onıń ishindegi nárselerge <code>modul.at</code> kórinisinde múrájat etiledi.</p>

<h3>from ... import — tek kereklisin alıw</h3>
<pre><code>from math import sqrt, pi

print(sqrt(16))     # modul atın jazıw shárt emes
print(pi)</code></pre>
<p>Bul qısqaraq, biraq atlar soqlıǵısıw qáwipi bar. Úlken joybarlarda ápiwayı <code>import</code> qáwipsizirek.</p>

<h3>Laqap at beriw</h3>
<pre><code>import random as r
print(r.randint(1, 6))</code></pre>
<p>Uzın modul atların qısqartıw ushın isletiledi.</p>

<h3>math — matematikalıq ámeller</h3>
<pre><code>import math

print(math.sqrt(25))      # 5.0  — kvadrat túbir
print(math.ceil(4.1))     # 5    — joqarıǵa dógerekletiw
print(math.floor(4.9))    # 4    — tómenge dógerekletiw
print(math.factorial(5))  # 120  — faktorial
print(math.pow(2, 10))    # 1024.0
print(math.gcd(12, 18))   # 6    — EÚOB</code></pre>
<p>Itibar beriń: <code>round()</code> hám <code>abs()</code> — Pythonnıń ornatılǵan funkciyaları, olar ushın modul kerek emes.</p>

<h3>random — kezdeysoq sanlar</h3>
<pre><code>import random

print(random.randint(1, 6))            # 1..6 aralıǵında pútin san
print(random.random())                 # 0.0 den 1.0 ge shekem bólshek
print(random.choice(["alma", "anar"])) # dizimnen kezdeysoq element

sanlar = [1, 2, 3, 4, 5]
random.shuffle(sanlar)                 # dizimdi aralastıradı
print(sanlar)</code></pre>
<p>Bul modul oyınlarda, testlerde hám simulyaciyalarda isletiledi.</p>

<h3>datetime — sáne hám waqıt</h3>
<pre><code>from datetime import date, datetime

búgin = date.today()
print(búgin)               # 2026-07-28
print(búgin.year)          # 2026

tuwılǵan = date(2005, 3, 15)
parq = búgin - tuwılǵan
print(parq.days)           # jasaǵan kúnler sanı</code></pre>

<h3>Óz modulińizdi jazıw</h3>
<p>Qálegen <code>.py</code> fayl modul bola aladı. Mısalı <code>esap.py</code> faylın jarataylıq:</p>
<pre><code># esap.py
def kvadrat(x):
    return x * x

def kub(x):
    return x ** 3</code></pre>
<p>Endi janındaǵı basqa faylda:</p>
<pre><code>import esap

print(esap.kvadrat(4))    # 16
print(esap.kub(3))        # 27</code></pre>
<p>Úlken joybarda kodtı tema boyınsha ayrım fayllarǵa ajıratıw — tártipli islewdiń tiykarı.</p>

<h3>pip — sırtqı kitapxanalar</h3>
<p>Python menen birge kelmeytuǵın kitapxanalar <code>pip</code> arqalı ornatıladı:</p>
<pre><code>pip install requests
pip install numpy</code></pre>
<p>Bul buyrıq terminalda (buyrıqlar qatarında) jazıladı, programma ishinde emes. Ornatılǵannan keyin ápiwayı <code>import</code> penen isletiledi.</p>

<h3>Juwmaq</h3>
<ul>
  <li><code>import modul</code> — pútkil moduldi, <code>from modul import at</code> — onıń bir bólegin jalǵaydı</li>
  <li><code>math</code>, <code>random</code>, <code>datetime</code> — standart kitapxananıń eń kóp isletiletuǵınları</li>
  <li>Qálegen <code>.py</code> fayl modul bola aladı</li>
  <li>Sırtqı kitapxanalar <code>pip install</code> penen ornatıladı</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- 12. python-va-suniy-intellekt
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'python-va-suniy-intellekt' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Почему именно Python?</h2>
<p>Большая часть проектов в области искусственного интеллекта (ИИ) пишется на Python. Причины таковы:</p>
<ul>
  <li><b>Простой синтаксис</b> — исследователь занимается задачей, а не правилами языка</li>
  <li><b>Мощные библиотеки</b> — NumPy, pandas, scikit-learn, TensorFlow, PyTorch</li>
  <li><b>Большое сообщество</b> — почти на любой вопрос уже есть готовый ответ</li>
  <li><b>Быстрая проверка</b> — идею можно испытать в несколько строк</li>
</ul>

<h3>Что такое искусственный интеллект?</h3>
<p>ИИ — область, в которой компьютер учат выполнять задачи, требующие человеческого разума: распознать изображение, понять текст, сделать прогноз. Самое распространённое её направление — <b>машинное обучение (machine learning)</b>.</p>
<p>В традиционном программировании мы пишем <b>правила</b>, а компьютер даёт ответ. В машинном обучении мы даём <b>примеры</b>, а правило компьютер находит сам.</p>
<table>
  <tr><th>Традиционная программа</th><th>Машинное обучение</th></tr>
  <tr><td>Правило + данные → ответ</td><td>Данные + ответ → правило</td></tr>
  <tr><td>Логику пишет программист</td><td>Модель учится на примерах</td></tr>
</table>

<h3>Основные понятия</h3>
<ul>
  <li><b>Датасет (набор данных)</b> — примеры, на которых учится модель</li>
  <li><b>Признак (feature)</b> — входные данные: площадь дома, число комнат</li>
  <li><b>Метка (label)</b> — ответ, который надо предсказать: цена дома</li>
  <li><b>Модель</b> — структура, хранящая выученную зависимость</li>
  <li><b>Train / test</b> — разделение данных на обучающую и проверочную части</li>
</ul>

<h3>Направления</h3>
<ul>
  <li><b>Обучение с учителем</b> — правильные ответы известны (прогноз цены, выявление спама)</li>
  <li><b>Обучение без учителя</b> — ответы неизвестны, модель сама находит группы (сегментация клиентов)</li>
  <li><b>Обучение с подкреплением</b> — модель учится на опыте (игры, робототехника)</li>
</ul>

<h3>Основные библиотеки</h3>
<table>
  <tr><th>Библиотека</th><th>Назначение</th></tr>
  <tr><td><code>NumPy</code></td><td>Быстрая работа с числовыми массивами и матрицами</td></tr>
  <tr><td><code>pandas</code></td><td>Анализ данных в табличном виде</td></tr>
  <tr><td><code>matplotlib</code></td><td>Построение графиков и диаграмм</td></tr>
  <tr><td><code>scikit-learn</code></td><td>Классические алгоритмы машинного обучения</td></tr>
  <tr><td><code>TensorFlow</code>, <code>PyTorch</code></td><td>Нейронные сети</td></tr>
</table>

<h3>Простой пример: линейный прогноз</h3>
<pre><code>from sklearn.linear_model import LinearRegression

# Площадь дома (кв. м) и цена (млн сумов)
X = [[40], [60], [80], [100]]
y = [200, 300, 400, 500]

model = LinearRegression()
model.fit(X, y)                  # обучение

print(model.predict([[70]]))     # прогноз цены дома в 70 кв. м</code></pre>
<p>Как видите, построение модели состоит из трёх шагов: подготовить данные → обучить через <code>fit()</code> → предсказать через <code>predict()</code>.</p>

<h3>Где ИИ применяется сегодня?</h3>
<ul>
  <li>Голосовые помощники и системы перевода</li>
  <li>Раннее выявление болезней в медицине по анализу снимков</li>
  <li>Обнаружение мошенничества в банковских операциях</li>
  <li>Упражнения, подстраивающиеся под студента, в образовании</li>
  <li>Большие языковые модели — написание текста, вопросы и ответы, генерация кода</li>
</ul>

<h3>Ответственность при работе с ИИ</h3>
<p>Модель не может быть лучше данных, на которых она училась. Если данные односторонни, результат тоже окажется несправедливым. Поэтому необходимо всегда проверять выводы ИИ, знать источник данных и уважать конфиденциальность личной информации.</p>

<h3>Следующий шаг</h3>
<p>Прежде чем браться за ИИ, нужно уверенно владеть следующим: переменные, списки и словари, циклы, функции, работа с файлами. После этого NumPy и pandas — самый удобный первый шаг в сторону ИИ.</p>

<h3>Итог</h3>
<ul>
  <li>Python лидирует в области ИИ благодаря простоте и библиотекам</li>
  <li>В машинном обучении правило модель находит из примеров сама</li>
  <li>NumPy, pandas, scikit-learn — тройка, которую изучают первой</li>
  <li>Результат любой модели — предположение, требующее проверки, а не приговор</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>Why Python in particular?</h2>
<p>Most projects in artificial intelligence (AI) are written in Python. The reasons are these:</p>
<ul>
  <li><b>Simple syntax</b> — the researcher deals with the problem, not with the rules of the language</li>
  <li><b>Powerful libraries</b> — NumPy, pandas, scikit-learn, TensorFlow, PyTorch</li>
  <li><b>A large community</b> — there is a ready answer to almost any question</li>
  <li><b>Quick testing</b> — an idea can be tried out in a few lines</li>
</ul>

<h3>What is artificial intelligence?</h3>
<p>AI is the field of teaching a computer to carry out tasks that call for human intelligence: recognising a picture, understanding a text, making a prediction. Its most widespread branch is <b>machine learning</b>.</p>
<p>In traditional programming we write the <b>rules</b> and the computer gives the answer. In machine learning we give the <b>examples</b> and the computer finds the rule itself.</p>
<table>
  <tr><th>A traditional program</th><th>Machine learning</th></tr>
  <tr><td>Rule + data → answer</td><td>Data + answer → rule</td></tr>
  <tr><td>The programmer writes the logic</td><td>The model learns from examples</td></tr>
</table>

<h3>The main ideas</h3>
<ul>
  <li><b>Dataset</b> — the examples the model learns from</li>
  <li><b>Feature</b> — the input data: the area of a house, the number of rooms</li>
  <li><b>Label</b> — the answer that has to be predicted: the price of the house</li>
  <li><b>Model</b> — the structure that holds the relationship that was learned</li>
  <li><b>Train / test</b> — splitting the data into a training part and a checking part</li>
</ul>

<h3>Branches</h3>
<ul>
  <li><b>Supervised learning</b> — the right answers are known (price prediction, spam detection)</li>
  <li><b>Unsupervised learning</b> — the answers are unknown and the model finds the groups itself (customer segmentation)</li>
  <li><b>Reinforcement learning</b> — the model learns through experience (games, robotics)</li>
</ul>

<h3>The main libraries</h3>
<table>
  <tr><th>Library</th><th>What it is for</th></tr>
  <tr><td><code>NumPy</code></td><td>Working quickly with numerical arrays and matrices</td></tr>
  <tr><td><code>pandas</code></td><td>Analysing data held in tables</td></tr>
  <tr><td><code>matplotlib</code></td><td>Drawing graphs and charts</td></tr>
  <tr><td><code>scikit-learn</code></td><td>The classical machine-learning algorithms</td></tr>
  <tr><td><code>TensorFlow</code>, <code>PyTorch</code></td><td>Neural networks</td></tr>
</table>

<h3>A simple example: a linear prediction</h3>
<pre><code>from sklearn.linear_model import LinearRegression

# House area (sq. m) and price (millions of soum)
X = [[40], [60], [80], [100]]
y = [200, 300, 400, 500]

model = LinearRegression()
model.fit(X, y)                  # learning

print(model.predict([[70]]))     # the predicted price of a 70 sq. m house</code></pre>
<p>As you can see, building a model takes three steps: prepare the data → train it with <code>fit()</code> → predict with <code>predict()</code>.</p>

<h3>Where is AI used today?</h3>
<ul>
  <li>Voice assistants and translation systems</li>
  <li>Spotting illness early in medicine through image analysis</li>
  <li>Detecting fraud in banking transactions</li>
  <li>Exercises in education that adapt to the student</li>
  <li>Large language models — writing text, answering questions, generating code</li>
</ul>

<h3>Responsibility in working with AI</h3>
<p>A model cannot be better than the data it learned from. If the data is one-sided, the result comes out unfair as well. That is why the outputs of AI must always be checked, the source of the data must be known, and the privacy of personal information must be respected.</p>

<h3>The next step</h3>
<p>Before taking up AI, the following should be solid: variables, lists and dictionaries, loops, functions, working with files. After that, NumPy and pandas are the handiest first step towards AI.</p>

<h3>Summary</h3>
<ul>
  <li>Python leads the AI field thanks to its simplicity and its libraries</li>
  <li>In machine learning the model finds the rule from examples itself</li>
  <li>NumPy, pandas and scikit-learn are the three learned first</li>
  <li>The output of any model is a guess that has to be checked, not a verdict</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Nege dál Python?</h2>
<p>Jasalma intellekt (JI) tarawındaǵı joybarlardıń úlken bólegi Pythonda jazıladı. Bunıń sebepleri:</p>
<ul>
  <li><b>Ápiwayı sintaksis</b> — izertlewshi til qaǵıydaları menen emes, másele menen shuǵıllanadı</li>
  <li><b>Kúshli kitapxanalar</b> — NumPy, pandas, scikit-learn, TensorFlow, PyTorch</li>
  <li><b>Úlken jámiyetshilik</b> — derlik qálegen sorawǵa tayın juwap bar</li>
  <li><b>Tez sınaw</b> — oydı birneshe qatarda tekserip kóriwge boladı</li>
</ul>

<h3>Jasalma intellekt degen ne?</h3>
<p>JI — kompyuterge adam aqlı talap etetuǵın wazıypalardı orınlawdı úyretiw tarawı: súwretti tanıw, tekstti túsiniw, boljaw. Onıń eń keń tarqalǵan baǵdarı — <b>mashinalıq oqıtıw (machine learning)</b>.</p>
<p>Dástúriy programmalastırıwda biz <b>qaǵıydalardı</b> jazamız hám kompyuter juwap beredi. Mashinalıq oqıtıwda bolsa biz <b>mısallardı</b> beremiz, kompyuter qaǵıydanı ózi tabadı.</p>
<table>
  <tr><th>Dástúriy programma</th><th>Mashinalıq oqıtıw</th></tr>
  <tr><td>Qaǵıyda + maǵlıwmat → juwap</td><td>Maǵlıwmat + juwap → qaǵıyda</td></tr>
  <tr><td>Programmashı mantıqtı jazadı</td><td>Model mısallardan úyrenedi</td></tr>
</table>

<h3>Tiykarǵı túsinikler</h3>
<ul>
  <li><b>Dataset (maǵlıwmatlar toplamı)</b> — model úyrenetuǵın mısallar</li>
  <li><b>Belgi (feature)</b> — kiris maǵlıwmatı: úy maydanı, bólmeler sanı</li>
  <li><b>Nıshan (label)</b> — boljaw kerek bolǵan juwap: úy bahası</li>
  <li><b>Model</b> — úyrenilgen baylanıstı saqlaytuǵın dúzilis</li>
  <li><b>Train / test</b> — maǵlıwmattı oqıtıw hám tekseriw bólimlerine ajıratıw</li>
</ul>

<h3>Baǵdarlar</h3>
<ul>
  <li><b>Baqlaw astında oqıtıw</b> — durıs juwaplar belgili (baha boljawı, spam anıqlaw)</li>
  <li><b>Baqlawsız oqıtıw</b> — juwaplar belgisiz, model toparlardı ózi tabadı (klientlerdi segmentlew)</li>
  <li><b>Bekkemlep oqıtıw</b> — model tájiriybe arqalı úyrenedi (oyın, robototexnika)</li>
</ul>

<h3>Tiykarǵı kitapxanalar</h3>
<table>
  <tr><th>Kitapxana</th><th>Wazıypası</th></tr>
  <tr><td><code>NumPy</code></td><td>Sanlı massivler hám matricalar menen tez islew</td></tr>
  <tr><td><code>pandas</code></td><td>Keste kórinisindegi maǵlıwmatlardı analiz etiw</td></tr>
  <tr><td><code>matplotlib</code></td><td>Grafik hám diagrammalar sızıw</td></tr>
  <tr><td><code>scikit-learn</code></td><td>Klassikalıq mashinalıq oqıtıw algoritmleri</td></tr>
  <tr><td><code>TensorFlow</code>, <code>PyTorch</code></td><td>Neyron tarmaqlar</td></tr>
</table>

<h3>Ápiwayı mısal: sızıqlı boljaw</h3>
<pre><code>from sklearn.linear_model import LinearRegression

# Úy maydanı (kv.m) hám bahası (mln sum)
X = [[40], [60], [80], [100]]
y = [200, 300, 400, 500]

model = LinearRegression()
model.fit(X, y)                  # úyreniw

print(model.predict([[70]]))     # 70 kv.m úy bahası boljawı</code></pre>
<p>Kórip turǵanıńızday, model qurıw úsh qádemnen ibarat: maǵlıwmat tayarlaw → <code>fit()</code> penen oqıtıw → <code>predict()</code> penen boljaw.</p>

<h3>Búgingi kúnde JI qay jerde isletiledi?</h3>
<ul>
  <li>Dawıslı járdemshiler hám awdarma sistemaları</li>
  <li>Medicinada súwret analizi arqalı kesellikti erte anıqlaw</li>
  <li>Bank operaciyalarında aldawshılıqtı anıqlaw</li>
  <li>Bilimlendiriwde studentke beyimlesetuǵın shınıǵıwlar</li>
  <li>Úlken til modelleri — tekst jazıw, soraw-juwap, kod jaratıw</li>
</ul>

<h3>JI menen islewde juwapkershilik</h3>
<p>Model ózi úyrengen maǵlıwmattan jaqsıraq bola almaydı. Maǵlıwmat bir tárepleme bolsa, nátiyje de ádalatsız shıǵadı. Sonlıqtan JI nátiyjelerin hámme waqıt tekseriw, maǵlıwmat derekligin biliw hám jeke maǵlıwmatlar sırlılıǵın húrmetlew kerek.</p>

<h3>Keyingi qádem</h3>
<p>JI di úyreniwge kirisiwden aldın tómendegiler bekkem bolıwı kerek: ózgeriwshiler, dizimler hám sózlikler, cikller, funkciyalar, fayl menen islew. Odan keyin NumPy hám pandas — JI qaray eń qolaylı birinshi qádem.</p>

<h3>Juwmaq</h3>
<ul>
  <li>Python JI tarawında ápiwayılıǵı hám kitapxanaları arqasında jetekshi</li>
  <li>Mashinalıq oqıtıwda qaǵıydanı model mısallardan ózi tabadı</li>
  <li>NumPy, pandas, scikit-learn — birinshi úyreniletuǵın úshlik</li>
  <li>Qálegen model nátiyjesi tekseriliwi kerek bolǵan boljaw, húkim emes</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

END $$;
