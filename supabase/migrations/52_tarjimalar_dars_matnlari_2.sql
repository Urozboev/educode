-- ============================================================
-- EduCode — Dars matnlari tarjimasi: MA'RUZA 3-4
--   topics.content_html -> ru, en, kaa
--
--   3. arifmetik-amallar        — Arifmetik amallar va izohlar
--   4. ozgaruvchilar-va-turlar  — O'zgaruvchilar va ma'lumot turlari
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
--
-- TARJIMA QOIDASI: HTML teglari, Python kalit so'zlari va standart
-- kutubxona nomlari (math.sqrt, TypeError) o'zgarmaydi. Kod ichidagi
-- izohlar, matn qiymatlari va o'zgaruvchi nomlari tarjima qilinadi.
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
BEGIN

  -- ============================================================
  -- 3. arifmetik-amallar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'arifmetik-amallar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Арифметические операции</h2>
<table>
  <thead><tr><th>Операция</th><th>Знак</th><th>Пример</th><th>Результат</th></tr></thead>
  <tbody>
    <tr><td>Сложение</td><td><code>+</code></td><td><code>7 + 3</code></td><td>10</td></tr>
    <tr><td>Вычитание</td><td><code>-</code></td><td><code>7 - 3</code></td><td>4</td></tr>
    <tr><td>Умножение</td><td><code>*</code></td><td><code>7 * 3</code></td><td>21</td></tr>
    <tr><td>Деление</td><td><code>/</code></td><td><code>7 / 3</code></td><td>2.333…</td></tr>
    <tr><td>Целочисленное деление</td><td><code>//</code></td><td><code>7 // 3</code></td><td>2</td></tr>
    <tr><td>Остаток</td><td><code>%</code></td><td><code>7 % 3</code></td><td>1</td></tr>
    <tr><td>Степень</td><td><code>**</code></td><td><code>7 ** 2</code></td><td>49</td></tr>
  </tbody>
</table>
<p>Внимание: <code>/</code> всегда возвращает <b>вещественное число</b> (float). Результат <code>10 / 2</code> — это <code>5.0</code>, а не <code>5</code>.</p>

<h3>Порядок выполнения операций</h3>
<p>Как и в математике:</p>
<ol>
  <li>Скобки <code>( )</code></li>
  <li>Степень <code>**</code></li>
  <li>Умножение, деление, целочисленное деление, остаток</li>
  <li>Сложение и вычитание</li>
</ol>
<pre><code>print(2 + 3 * 4)        # 14  — сначала умножение
print((2 + 3) * 4)      # 20  — сначала скобки
print(2 ** 3 ** 2)      # 512 — степень справа налево: 2**(3**2)</code></pre>

<h3>Корень и степень</h3>
<p>Отдельного знака корня в Python нет — используется дробная степень:</p>
<pre><code>print(16 ** 0.5)    # 4.0  — квадратный корень
print(27 ** (1/3))  # 3.0  — кубический корень</code></pre>
<p>Либо через модуль <code>math</code>:</p>
<pre><code>import math
print(math.sqrt(16))   # 4.0
print(math.pow(2, 10)) # 1024.0</code></pre>

<h3>Экспонента и логарифм</h3>
<pre><code>import math
print(math.e)          # 2.718281828459045
print(math.exp(1))     # e в первой степени
print(math.log(math.e))    # 1.0   — натуральный логарифм
print(math.log10(1000))    # 3.0   — десятичный логарифм
print(math.log(8, 2))      # 3.0   — логарифм по основанию 2</code></pre>

<h3>Чем полезен остаток от деления</h3>
<p>Операция <code>%</code> применяется для определения чётности и проверки делимости:</p>
<pre><code>chislo = 14
if chislo % 2 == 0:
    print("Чётное число")
else:
    print("Нечётное число")</code></pre>

<h3>Комментарии</h3>
<p>Комментарий — пояснение внутри кода. Python его не читает, он нужен только человеку.</p>
<pre><code># Это однострочный комментарий

x = 5  # комментарий можно писать и в конце строки

"""
Это многострочный комментарий.
Обычно используется для описания функции или модуля.
"""</code></pre>

<h3>Каким бывает хороший комментарий</h3>
<p>Плохой комментарий повторяет то, что и так делает код:</p>
<pre><code>x = x + 1  # прибавляем к x единицу   ← бесполезно</code></pre>
<p>Хороший комментарий объясняет, <b>почему</b> это сделано именно так:</p>
<pre><code>x = x + 1  # индекс начинается с 0, а пользователю показываем с 1</code></pre>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>Arithmetic operations</h2>
<table>
  <thead><tr><th>Operation</th><th>Symbol</th><th>Example</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Addition</td><td><code>+</code></td><td><code>7 + 3</code></td><td>10</td></tr>
    <tr><td>Subtraction</td><td><code>-</code></td><td><code>7 - 3</code></td><td>4</td></tr>
    <tr><td>Multiplication</td><td><code>*</code></td><td><code>7 * 3</code></td><td>21</td></tr>
    <tr><td>Division</td><td><code>/</code></td><td><code>7 / 3</code></td><td>2.333…</td></tr>
    <tr><td>Floor division</td><td><code>//</code></td><td><code>7 // 3</code></td><td>2</td></tr>
    <tr><td>Remainder</td><td><code>%</code></td><td><code>7 % 3</code></td><td>1</td></tr>
    <tr><td>Power</td><td><code>**</code></td><td><code>7 ** 2</code></td><td>49</td></tr>
  </tbody>
</table>
<p>Note: <code>/</code> always returns a <b>floating-point number</b> (float). The result of <code>10 / 2</code> is <code>5.0</code>, not <code>5</code>.</p>

<h3>The order operations are carried out in</h3>
<p>Just as in mathematics:</p>
<ol>
  <li>Brackets <code>( )</code></li>
  <li>Power <code>**</code></li>
  <li>Multiplication, division, floor division, remainder</li>
  <li>Addition and subtraction</li>
</ol>
<pre><code>print(2 + 3 * 4)        # 14  — multiplication first
print((2 + 3) * 4)      # 20  — brackets first
print(2 ** 3 ** 2)      # 512 — power groups right to left: 2**(3**2)</code></pre>

<h3>Roots and powers</h3>
<p>Python has no separate root symbol — you use a fractional power instead:</p>
<pre><code>print(16 ** 0.5)    # 4.0  — square root
print(27 ** (1/3))  # 3.0  — cube root</code></pre>
<p>Or through the <code>math</code> module:</p>
<pre><code>import math
print(math.sqrt(16))   # 4.0
print(math.pow(2, 10)) # 1024.0</code></pre>

<h3>Exponentials and logarithms</h3>
<pre><code>import math
print(math.e)          # 2.718281828459045
print(math.exp(1))     # e to the power of 1
print(math.log(math.e))    # 1.0   — natural logarithm
print(math.log10(1000))    # 3.0   — base-10 logarithm
print(math.log(8, 2))      # 3.0   — base-2 logarithm</code></pre>

<h3>What the remainder operation is good for</h3>
<p>The <code>%</code> operation is used to tell odd from even and to check divisibility:</p>
<pre><code>number = 14
if number % 2 == 0:
    print("Even number")
else:
    print("Odd number")</code></pre>

<h3>Comments</h3>
<p>A comment is an explanation inside the code. Python does not read it; it is there for people.</p>
<pre><code># This is a single-line comment

x = 5  # a comment can also go at the end of a line

"""
This is a multi-line comment.
It is normally used to describe a function or a module.
"""</code></pre>

<h3>What a good comment looks like</h3>
<p>A bad comment repeats what the code already says:</p>
<pre><code>x = x + 1  # add one to x   ← useless</code></pre>
<p>A good comment explains <b>why</b> it was done this way:</p>
<pre><code>x = x + 1  # the index starts at 0, but we show it to the user starting at 1</code></pre>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Arifmetikalıq ámeller</h2>
<table>
  <thead><tr><th>Ámel</th><th>Belgi</th><th>Mısal</th><th>Nátiyje</th></tr></thead>
  <tbody>
    <tr><td>Qosıw</td><td><code>+</code></td><td><code>7 + 3</code></td><td>10</td></tr>
    <tr><td>Alıw</td><td><code>-</code></td><td><code>7 - 3</code></td><td>4</td></tr>
    <tr><td>Kóbeytiw</td><td><code>*</code></td><td><code>7 * 3</code></td><td>21</td></tr>
    <tr><td>Bóliw</td><td><code>/</code></td><td><code>7 / 3</code></td><td>2.333…</td></tr>
    <tr><td>Pútin bóliw</td><td><code>//</code></td><td><code>7 // 3</code></td><td>2</td></tr>
    <tr><td>Qaldıq</td><td><code>%</code></td><td><code>7 % 3</code></td><td>1</td></tr>
    <tr><td>Dáreje</td><td><code>**</code></td><td><code>7 ** 2</code></td><td>49</td></tr>
  </tbody>
</table>
<p>Itibar beriń: <code>/</code> hámme waqıt <b>haqıyqıy san</b> (float) qaytaradı. <code>10 / 2</code> nátiyjesi <code>5.0</code>, <code>5</code> emes.</p>

<h3>Ámellerdiń orınlanıw tártibi</h3>
<p>Matematikadaǵıday:</p>
<ol>
  <li>Qawsıralar <code>( )</code></li>
  <li>Dáreje <code>**</code></li>
  <li>Kóbeytiw, bóliw, pútin bóliw, qaldıq</li>
  <li>Qosıw hám alıw</li>
</ol>
<pre><code>print(2 + 3 * 4)        # 14  — aldın kóbeytiw
print((2 + 3) * 4)      # 20  — aldın qawsıra
print(2 ** 3 ** 2)      # 512 — dáreje ońnan shepke: 2**(3**2)</code></pre>

<h3>Túbir hám dáreje</h3>
<p>Pythonda ayrıqsha túbir belgisi joq — bólshek dárejeden paydalanıladı:</p>
<pre><code>print(16 ** 0.5)    # 4.0  — kvadrat túbir
print(27 ** (1/3))  # 3.0  — kub túbir</code></pre>
<p>Yamasa <code>math</code> modulinen:</p>
<pre><code>import math
print(math.sqrt(16))   # 4.0
print(math.pow(2, 10)) # 1024.0</code></pre>

<h3>Eksponenta hám logarifm</h3>
<pre><code>import math
print(math.e)          # 2.718281828459045
print(math.exp(1))     # e niń 1-dárejesi
print(math.log(math.e))    # 1.0   — natural logarifm
print(math.log10(1000))    # 3.0   — onlıq logarifm
print(math.log(8, 2))      # 3.0   — 2 tiykarlı logarifm</code></pre>

<h3>Qaldıq ámeliniń paydası</h3>
<p><code>%</code> ámeli jup-taqlıqtı anıqlawda hám bóliniwshenlikti tekseriwde isletiledi:</p>
<pre><code>san = 14
if san % 2 == 0:
    print("Jup san")
else:
    print("Taq san")</code></pre>

<h3>Túsindirmeler</h3>
<p>Túsindirme — kod ishindegi anıqlama. Python onı oqımaydı, ol tek adam ushın.</p>
<pre><code># Bul bir qatarlıq túsindirme

x = 5  # túsindirmeni qatar aqırına da jazıwǵa boladı

"""
Bul birneshe qatarlıq túsindirme.
Ádette funkciya yamasa modul táriypi ushın isletiledi.
"""</code></pre>

<h3>Jaqsı túsindirme qanday boladı</h3>
<p>Jaman túsindirme kod ne islep atırǵanın qaytalaydı:</p>
<pre><code>x = x + 1  # x qa bir qosamız   ← paydasız</code></pre>
<p>Jaqsı túsindirme <b>ne ushın</b> solay islengenin túsindiredi:</p>
<pre><code>x = x + 1  # indeks 0 den baslanadı, paydalanıwshıǵa 1 den kórsetemiz</code></pre>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- 4. ozgaruvchilar-va-turlar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'ozgaruvchilar-va-turlar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Что такое переменная?</h2>
<p><b>Переменная</b> — именованное место, где хранится значение. Представьте коробку с наклейкой: содержимое коробки можно менять, а наклейка с именем остаётся прежней.</p>
<pre><code>vozrast = 19
imya = "Дильноза"
rost = 1.72
student = True</code></pre>
<p>В Python не нужно заранее объявлять тип переменной — он определяется сам по значению.</p>

<h3>Правила именования</h3>
<ul>
  <li>Только буквы, цифры и подчёркивание: <code>vozrast_studenta</code></li>
  <li>Не начинается с цифры: <code>2chislo</code> — ошибка, <code>chislo2</code> — верно</li>
  <li>Пробелы не используются: <code>vozrast studenta</code> — ошибка</li>
  <li>Регистр имеет значение: <code>Vozrast</code> и <code>vozrast</code> — разные переменные</li>
  <li>Ключевые слова использовать нельзя: <code>if</code>, <code>for</code>, <code>class</code>, <code>def</code>, <code>True</code></li>
</ul>

<h3>Так делать нельзя</h3>
<pre><code>2chislo = 5        # SyntaxError — начинается с цифры
vozrast studenta=5 # SyntaxError — есть пробел
for = 10           # SyntaxError — ключевое слово
chislo-1 = 5       # SyntaxError — дефис понимается как вычитание</code></pre>

<h3>Как выбрать хорошее имя</h3>
<p>Имя должно говорить, что именно хранится:</p>
<pre><code>a = 19          # что это?
vozrast = 19    # понятно

x = 3.14        # непонятно
pi = 3.14       # ясно

t = "Али"       # расплывчато
imya_studenta = "Али"   # точно</code></pre>

<h3>Основные типы данных</h3>
<table>
  <thead><tr><th>Тип</th><th>Название</th><th>Пример</th></tr></thead>
  <tbody>
    <tr><td><code>int</code></td><td>Целое число</td><td><code>25</code>, <code>-7</code>, <code>0</code></td></tr>
    <tr><td><code>float</code></td><td>Вещественное число</td><td><code>3.14</code>, <code>-0.5</code>, <code>2.0</code></td></tr>
    <tr><td><code>str</code></td><td>Текст (строка)</td><td><code>"привет"</code>, <code>'Python'</code></td></tr>
    <tr><td><code>bool</code></td><td>Логический</td><td><code>True</code>, <code>False</code></td></tr>
    <tr><td><code>list</code></td><td>Список</td><td><code>[1, 2, 3]</code></td></tr>
    <tr><td><code>NoneType</code></td><td>Значения нет</td><td><code>None</code></td></tr>
  </tbody>
</table>

<h3>Как узнать и изменить тип</h3>
<pre><code>x = 25
print(type(x))          # &lt;class 'int'&gt;

# Преобразование
chislo = int("42")      # из текста в целое число
tekst = str(42)         # из числа в текст
drob = float("3.14")    # из текста в вещественное число
tseloe = int(3.99)      # 3 — дробная часть отбрасывается, а не округляется!</code></pre>

<h3>Частая ошибка</h3>
<pre><code>vozrast = input("Ваш возраст: ")   # это ТЕКСТ
print(vozrast + 1)                 # TypeError!

vozrast = int(input("Ваш возраст: "))  # верно
print(vozrast + 1)</code></pre>

<h3>Несколько переменных сразу</h3>
<pre><code>a, b, c = 1, 2, 3
x = y = z = 0

# Обмен значениями
a, b = b, a</code></pre>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>What is a variable?</h2>
<p>A <b>variable</b> is a named place where a value is kept. Picture a box with a label stuck on it: you can swap what is inside the box, but the label keeps the same name.</p>
<pre><code>age = 19
name = "Dilnoza"
height = 1.72
student = True</code></pre>
<p>In Python you do not declare a variable's type in advance — the type is worked out from the value.</p>

<h3>Naming rules</h3>
<ul>
  <li>Letters, digits and underscores only: <code>student_age</code></li>
  <li>Cannot start with a digit: <code>2number</code> is wrong, <code>number2</code> is right</li>
  <li>No spaces: <code>student age</code> is wrong</li>
  <li>Case matters: <code>Age</code> and <code>age</code> are two different variables</li>
  <li>Keywords cannot be used: <code>if</code>, <code>for</code>, <code>class</code>, <code>def</code>, <code>True</code></li>
</ul>

<h3>Things you cannot do</h3>
<pre><code>2number = 5      # SyntaxError — starts with a digit
student age=5    # SyntaxError — contains a space
for = 10         # SyntaxError — a keyword
number-1 = 5     # SyntaxError — the hyphen is read as subtraction</code></pre>

<h3>Choosing a good name</h3>
<p>The name should say what is being stored:</p>
<pre><code>a = 19          # what is this?
age = 19        # clear

x = 3.14        # obscure
pi = 3.14       # obvious

t = "Ali"       # vague
student_name = "Ali"   # precise</code></pre>

<h3>The main data types</h3>
<table>
  <thead><tr><th>Type</th><th>Name</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>int</code></td><td>Whole number</td><td><code>25</code>, <code>-7</code>, <code>0</code></td></tr>
    <tr><td><code>float</code></td><td>Floating-point number</td><td><code>3.14</code>, <code>-0.5</code>, <code>2.0</code></td></tr>
    <tr><td><code>str</code></td><td>Text (string)</td><td><code>"hello"</code>, <code>'Python'</code></td></tr>
    <tr><td><code>bool</code></td><td>Boolean</td><td><code>True</code>, <code>False</code></td></tr>
    <tr><td><code>list</code></td><td>List</td><td><code>[1, 2, 3]</code></td></tr>
    <tr><td><code>NoneType</code></td><td>No value</td><td><code>None</code></td></tr>
  </tbody>
</table>

<h3>Checking and changing the type</h3>
<pre><code>x = 25
print(type(x))          # &lt;class 'int'&gt;

# Converting
number = int("42")      # from text to a whole number
text = str(42)          # from a number to text
decimal = float("3.14") # from text to a floating-point number
whole = int(3.99)       # 3 — the fraction is dropped, not rounded!</code></pre>

<h3>A common mistake</h3>
<pre><code>age = input("Your age: ")   # this is TEXT
print(age + 1)              # TypeError!

age = int(input("Your age: "))  # correct
print(age + 1)</code></pre>

<h3>Several variables at once</h3>
<pre><code>a, b, c = 1, 2, 3
x = y = z = 0

# Swapping values
a, b = b, a</code></pre>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Ózgeriwshi degen ne?</h2>
<p><b>Ózgeriwshi</b> — mánis saqlanatuǵın atalǵan orın. Onı ústine jarlıq jabıstırılǵan qutı dep kóz aldıńızǵa keltiriń: qutı ishindegi nárseni almastırıwǵa boladı, jarlıq bolsa sol at bolıp qala beredi.</p>
<pre><code>jas = 19
at = "Dilnoza"
boy = 1.72
student = True</code></pre>
<p>Pythonda ózgeriwshi túrin aldınnan járiyalaw shárt emes — túr mániske qarap ózi anıqlanadı.</p>

<h3>At beriw qaǵıydaları</h3>
<ul>
  <li>Tek hárip, san hám astıńǵı sızıq: <code>student_jası</code></li>
  <li>San menen baslanbaydı: <code>2san</code> — qáte, <code>san2</code> — durıs</li>
  <li>Bosluq isletilmeydi: <code>student jası</code> — qáte</li>
  <li>Úlken-kishi hárip parqlanadı: <code>Jas</code> hám <code>jas</code> — eki túrli ózgeriwshi</li>
  <li>Gilt sózler isletilmeydi: <code>if</code>, <code>for</code>, <code>class</code>, <code>def</code>, <code>True</code></li>
</ul>

<h3>Bolmaytuǵın jaǵdaylar</h3>
<pre><code>2san = 5        # SyntaxError — san menen baslanǵan
student jası=5  # SyntaxError — bosluq bar
for = 10        # SyntaxError — gilt sóz
san-1 = 5       # SyntaxError — sızıqsha alıw dep túsiniledi</code></pre>

<h3>Jaqsı at saylaw</h3>
<p>At ne saqlanıp atırǵanın aytıp turıwı kerek:</p>
<pre><code>a = 19          # bul ne?
jas = 19        # anıq

x = 3.14        # túsiniksiz
pi = 3.14       # túsinikli

t = "Ali"       # anıq emes
student_atı = "Ali"   # anıq</code></pre>

<h3>Tiykarǵı maǵlıwmat túrleri</h3>
<table>
  <thead><tr><th>Túr</th><th>Atı</th><th>Mısal</th></tr></thead>
  <tbody>
    <tr><td><code>int</code></td><td>Pútin san</td><td><code>25</code>, <code>-7</code>, <code>0</code></td></tr>
    <tr><td><code>float</code></td><td>Haqıyqıy san</td><td><code>3.14</code>, <code>-0.5</code>, <code>2.0</code></td></tr>
    <tr><td><code>str</code></td><td>Tekst (qatar)</td><td><code>"sálem"</code>, <code>'Python'</code></td></tr>
    <tr><td><code>bool</code></td><td>Mantıqlıq</td><td><code>True</code>, <code>False</code></td></tr>
    <tr><td><code>list</code></td><td>Dizim</td><td><code>[1, 2, 3]</code></td></tr>
    <tr><td><code>NoneType</code></td><td>Mánis joq</td><td><code>None</code></td></tr>
  </tbody>
</table>

<h3>Túrdi anıqlaw hám ózgertiw</h3>
<pre><code>x = 25
print(type(x))          # &lt;class 'int'&gt;

# Aylandırıw
san = int("42")         # teksttan pútin sanǵa
tekst = str(42)         # sannan tekstke
bólshek = float("3.14") # teksttan haqıyqıy sanǵa
pútin = int(3.99)       # 3 — bólshek bólegi taslanadı, dógerekletilmeydi!</code></pre>

<h3>Kóp ushırasatuǵın qátelik</h3>
<pre><code>jas = input("Jasıńız: ")   # bul TEKST
print(jas + 1)             # TypeError!

jas = int(input("Jasıńız: "))  # durıs
print(jas + 1)</code></pre>

<h3>Bir waqıtta birneshe ózgeriwshi</h3>
<pre><code>a, b, c = 1, 2, 3
x = y = z = 0

# Mánislerdi almastırıw
a, b = b, a</code></pre>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

END $$;
