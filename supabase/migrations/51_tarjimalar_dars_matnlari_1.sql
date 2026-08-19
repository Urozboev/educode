-- ============================================================
-- EduCode — Dars matnlari tarjimasi: MA'RUZA 1-2
--   topics.content_html -> ru, en, kaa
--
--   1. python-sintaksis    — Python sintaksisi va leksik asosi
--   2. python-xatoliklar   — Python tilida xatoliklar
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
--
-- TARJIMA QOIDASI: HTML teglari va Python kalit so'zlari o'zgarmaydi.
-- Kod ichidagi IZOHLAR, MATN QIYMATLARI va o'zgaruvchi nomlari esa
-- tarjima qilinadi — aks holda rus yoki ingliz o'quvchisi uchun misol
-- yarim tushunarsiz qolardi.
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
BEGIN

  -- ============================================================
  -- 1. python-sintaksis
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'python-sintaksis' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Что такое синтаксис?</h2>
<p><b>Синтаксис</b> — это грамматика языка программирования. Он определяет, как нужно писать код. Как предложение в человеческом языке подчиняется правилам, так и в программе каждый символ должен стоять на своём месте. Если правило нарушено, Python вообще не запустит программу.</p>

<h3>Первая программа</h3>
<pre><code>print("Здравствуйте!")</code></pre>
<p>Эта программа из одной строки выводит текст на экран. Здесь <code>print</code> — имя функции, а то, что в скобках, — передаваемое ей значение.</p>

<h3>Лексическая основа: из чего состоит программа</h3>
<p>Код на Python состоит из четырёх видов элементов:</p>
<ul>
  <li><b>Ключевые слова</b> — слова, принадлежащие самому языку: <code>if</code>, <code>else</code>, <code>for</code>, <code>while</code>, <code>def</code>, <code>return</code>, <code>import</code>, <code>True</code>, <code>False</code>, <code>None</code>. Их нельзя использовать как имена переменных.</li>
  <li><b>Идентификаторы</b> — имена, которые даём мы сами: переменные, функции, классы.</li>
  <li><b>Литералы</b> — значения, записанные в коде напрямую: <code>25</code>, <code>3.14</code>, <code>"привет"</code>, <code>True</code>.</li>
  <li><b>Операторы и разделители</b> — <code>+</code>, <code>-</code>, <code>=</code>, <code>==</code>, скобки, запятая, двоеточие.</li>
</ul>

<h3>Отступ — особенность Python</h3>
<p>Во многих языках блоки кода выделяются фигурными скобками. В Python эту роль выполняет <b>отступ (indentation)</b>. Отступ — это пробелы в начале строки.</p>
<pre><code>if 5 > 3:
    print("Пять больше трёх")
    print("Это тоже внутри условия")
print("А это уже вне условия")</code></pre>
<p>Обычно для отступа используют <b>4 пробела</b>. Внутри одного блока отступ должен быть одинаковым — иначе возникнет ошибка <code>IndentationError</code>.</p>

<h3>Функция print()</h3>
<p><code>print()</code> — основная функция вывода данных на экран. Ей можно передать несколько значений, они разделяются пробелом:</p>
<pre><code>print("Имя:", "Али", "Возраст:", 19)
# Результат: Имя: Али Возраст: 19</code></pre>
<p>Разделитель меняется параметром <code>sep</code>, а окончание строки — параметром <code>end</code>:</p>
<pre><code>print("a", "b", "c", sep="-")   # a-b-c
print("Первое", end=" ")
print("второе")                 # Первое второе</code></pre>

<h3>Получение данных через input()</h3>
<pre><code>imya = input("Введите ваше имя: ")
print("Здравствуйте,", imya)</code></pre>
<p>Важно: <code>input()</code> <b>всегда</b> возвращает текст. Если нужно число, его обязательно нужно преобразовать:</p>
<pre><code>vozrast = int(input("Ваш возраст: "))
print("В следующем году вам исполнится", vozrast + 1)</code></pre>

<h3>Имя файла и расширение</h3>
<p>Файлы Python сохраняются с расширением <code>.py</code>. Требования к имени файла:</p>
<ul>
  <li>только строчные буквы, цифры и подчёркивание: <code>pervaya_programma.py</code></li>
  <li>не начинать с цифры: <code>1programma.py</code> — неверно</li>
  <li>не совпадать с именами стандартных библиотек: не называйте файл <code>math.py</code> или <code>random.py</code> — это приведёт к путанице</li>
</ul>

<h3>Итог</h3>
<p>Синтаксис — это правила правильной записи кода. В Python отступ нужен не для красоты, он часть логики программы. <code>print()</code> выводит, <code>input()</code> читает и всегда возвращает текст.</p>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>What is syntax?</h2>
<p><b>Syntax</b> is the grammar of a programming language. It sets out how code must be written. Just as a sentence in a human language follows rules, in a program every character has to be in its right place. Break a rule and Python will not run the program at all.</p>

<h3>Your first program</h3>
<pre><code>print("Hello there!")</code></pre>
<p>This one-line program prints text on the screen. Here <code>print</code> is the name of the function, and what sits inside the brackets is the value passed to it.</p>

<h3>The lexical basis: what a program is made of</h3>
<p>Python code is made up of four kinds of element:</p>
<ul>
  <li><b>Keywords</b> — words that belong to the language itself: <code>if</code>, <code>else</code>, <code>for</code>, <code>while</code>, <code>def</code>, <code>return</code>, <code>import</code>, <code>True</code>, <code>False</code>, <code>None</code>. They cannot be used as variable names.</li>
  <li><b>Identifiers</b> — the names we choose ourselves: variables, functions, classes.</li>
  <li><b>Literals</b> — values written directly in the code: <code>25</code>, <code>3.14</code>, <code>"hello"</code>, <code>True</code>.</li>
  <li><b>Operators and separators</b> — <code>+</code>, <code>-</code>, <code>=</code>, <code>==</code>, brackets, commas, colons.</li>
</ul>

<h3>Indentation — what makes Python different</h3>
<p>In many languages blocks of code are marked with curly braces. In Python that job belongs to <b>indentation</b>. Indentation is the whitespace at the start of a line.</p>
<pre><code>if 5 > 3:
    print("Five is greater than three")
    print("This is inside the condition too")
print("And this is outside it")</code></pre>
<p>The usual indent is <b>four spaces</b>. Inside one block the indent must be consistent — otherwise you get an <code>IndentationError</code>.</p>

<h3>The print() function</h3>
<p><code>print()</code> is the main function for putting data on the screen. You can pass it several values and they are separated by a space:</p>
<pre><code>print("Name:", "Ali", "Age:", 19)
# Output: Name: Ali Age: 19</code></pre>
<p>The separator is changed with <code>sep</code>, and the line ending with <code>end</code>:</p>
<pre><code>print("a", "b", "c", sep="-")   # a-b-c
print("First", end=" ")
print("second")                 # First second</code></pre>

<h3>Reading input with input()</h3>
<pre><code>name = input("Enter your name: ")
print("Hello,", name)</code></pre>
<p>Important: <code>input()</code> <b>always</b> returns text. If you need a number, you must convert it:</p>
<pre><code>age = int(input("Your age: "))
print("Next year you will turn", age + 1)</code></pre>

<h3>File names and extensions</h3>
<p>Python files are saved with the <code>.py</code> extension. What a file name should look like:</p>
<ul>
  <li>lowercase letters, digits and underscores only: <code>first_program.py</code></li>
  <li>never start with a digit: <code>1program.py</code> is wrong</li>
  <li>never match a standard library name: do not call a file <code>math.py</code> or <code>random.py</code> — it causes confusion</li>
</ul>

<h3>Summary</h3>
<p>Syntax is the set of rules for writing code correctly. In Python indentation is not there to look tidy — it is part of the program's logic. <code>print()</code> writes out, <code>input()</code> reads in, and it always returns text.</p>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Sintaksis degen ne?</h2>
<p><b>Sintaksis</b> — programmalastırıw tiliniń grammatikası. Ol kodtı qalay jazıw kerekligin belgileydi. Adam tilinde sóylem dúzilisi qanday qaǵıydalarǵa boysınsa, programmada da hár bir belgi óz ornında turıwı kerek. Qaǵıyda buzılsa, Python programmanı ulıwma iske túsirmeydi.</p>

<h3>Birinshi programma</h3>
<pre><code>print("Assalawma áleykum!")</code></pre>
<p>Bul bir qatarlıq programma ekranǵa tekst shıǵaradı. Bul jerde <code>print</code> — funkciya atı, qawsıralar ishindegi bólegi bolsa oǵan beriletuǵın mánis.</p>

<h3>Leksikalıq tiykar: programma neden dúzilgen</h3>
<p>Python kodı tórt túrli elementten ibarat:</p>
<ul>
  <li><b>Gilt sózler</b> — tildiń ózine tiyisli sózler: <code>if</code>, <code>else</code>, <code>for</code>, <code>while</code>, <code>def</code>, <code>return</code>, <code>import</code>, <code>True</code>, <code>False</code>, <code>None</code>. Olardı ózgeriwshi atı sıpatında isletiwge bolmaydı.</li>
  <li><b>Identifikatorlar</b> — biz ózimiz beretuǵın atlar: ózgeriwshi, funkciya, klass atları.</li>
  <li><b>Literallar</b> — kodta tuwrıdan-tuwrı jazılǵan mánisler: <code>25</code>, <code>3.14</code>, <code>"sálem"</code>, <code>True</code>.</li>
  <li><b>Operatorlar hám ajıratıwshılar</b> — <code>+</code>, <code>-</code>, <code>=</code>, <code>==</code>, qawsıralar, úzilis, eki noqat.</li>
</ul>

<h3>Sheginiw — Pythonnıń ózgesheligi</h3>
<p>Kóp tillerde kod blokları figuralı qawsıra menen ajıratıladı. Pythonda bolsa <b>sheginiw (indentation)</b> sol wazıypanı orınlaydı. Sheginiw — bul qatar basındaǵı bosluqlar.</p>
<pre><code>if 5 > 3:
    print("Bes ushten úlken")
    print("Bul da shárt ishinde")
print("Bul bolsa shárttan tısqarıda")</code></pre>
<p>Ádette sheginiw ushın <b>4 bosluq</b> isletiledi. Bir blok ishinde sheginiw bir qıylı bolıwı shárt — bolmasa <code>IndentationError</code> qáteligi shıǵadı.</p>

<h3>print() funkciyası</h3>
<p><code>print()</code> — maǵlıwmattı ekranǵa shıǵaratuǵın tiykarǵı funkciya. Oǵan birneshe mánis beriwge boladı, olar bosluq penen ajıratıladı:</p>
<pre><code>print("Atı:", "Ali", "Jası:", 19)
# Nátiyje: Atı: Ali Jası: 19</code></pre>
<p>Ajıratıwshını ózgertiw ushın <code>sep</code>, qatar aqırın ózgertiw ushın <code>end</code> parametri isletiledi:</p>
<pre><code>print("a", "b", "c", sep="-")   # a-b-c
print("Birinshi", end=" ")
print("ekinshi")                # Birinshi ekinshi</code></pre>

<h3>input() penen maǵlıwmat alıw</h3>
<pre><code>at = input("Atıńızdı kirgiziń: ")
print("Sálem,", at)</code></pre>
<p>Áhmiyetli: <code>input()</code> <b>hámme waqıt tekst</b> qaytaradı. San kerek bolsa, onı aylandırıw shárt:</p>
<pre><code>jas = int(input("Jasıńız: "))
print("Keler jılı", jas + 1, "jasqa tolasız")</code></pre>

<h3>Fayl atı hám keńeytpesi</h3>
<p>Python fayları <code>.py</code> keńeytpesi menen saqlanadı. Fayl atına qoyılatuǵın talaplar:</p>
<ul>
  <li>tek kishi hárip, san hám astıńǵı sızıq: <code>birinshi_programma.py</code></li>
  <li>san menen baslanbasın: <code>1programma.py</code> — qáte</li>
  <li>standart kitapxana atları menen bir qıylı bolmasın: <code>math.py</code>, <code>random.py</code> dep atamań — bul shatasıw keltirip shıǵaradı</li>
</ul>

<h3>Juwmaq</h3>
<p>Sintaksis — kodtı durıs jazıw qaǵıydaları. Pythonda sheginiw jáy ǵana shıraylı kórinis ushın emes, ol programma mantıqınıń bir bólegi. <code>print()</code> shıǵaradı, <code>input()</code> oqıydı hám hámme waqıt tekst qaytaradı.</p>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- 2. python-xatoliklar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'python-xatoliklar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Ошибка — повседневный спутник программиста</h2>
<p>Ошибиться — это не провал, а естественная часть работы. Важно уметь <b>читать</b> сообщение об ошибке. Найдя ошибку, Python сообщает её тип и строку, в которой она произошла.</p>

<h3>Три вида ошибок</h3>
<ol>
  <li><b>Синтаксическая ошибка</b> — нарушено правило записи кода. Программа вообще не запускается.</li>
  <li><b>Ошибка выполнения</b> — код записан верно, но во время работы возникла проблема (например, деление на ноль).</li>
  <li><b>Логическая ошибка</b> — программа работает и не выдаёт ошибок, но <b>результат неверный</b>. Это самый опасный случай.</li>
</ol>

<h3>Синтаксические ошибки</h3>
<pre><code>print("Привет"     # скобка не закрыта
# SyntaxError: '(' was never closed</code></pre>
<pre><code>if x > 5
    print("больше")
# SyntaxError: expected ':'</code></pre>
<pre><code>if x > 5:
print("больше")
# IndentationError: expected an indented block</code></pre>

<h3>Как читать сообщение об ошибке</h3>
<pre><code>Traceback (most recent call last):
  File "programma.py", line 4, in &lt;module&gt;
    rezultat = 10 / 0
ZeroDivisionError: division by zero</code></pre>
<p>Читайте сообщение <b>снизу вверх</b>:</p>
<ul>
  <li>последняя строка — тип ошибки и причина: деление на ноль</li>
  <li>строка выше — проблемный код</li>
  <li>ещё выше — имя файла и номер строки</li>
</ul>

<h3>Самые частые ошибки</h3>
<table>
  <thead><tr><th>Ошибка</th><th>Причина</th><th>Решение</th></tr></thead>
  <tbody>
    <tr><td><code>NameError</code></td><td>Переменная не создана или её имя написано неверно</td><td>Проверьте имя, обратите внимание на регистр букв</td></tr>
    <tr><td><code>TypeError</code></td><td>Операция над несовместимыми типами: <code>"5" + 5</code></td><td>Преобразуйте через <code>int()</code> или <code>str()</code></td></tr>
    <tr><td><code>ValueError</code></td><td><code>int("привет")</code> — преобразовать невозможно</td><td>Проверьте введённое значение</td></tr>
    <tr><td><code>IndexError</code></td><td>Обращение к индексу, которого нет в списке</td><td>Проверьте длину списка</td></tr>
    <tr><td><code>ZeroDivisionError</code></td><td>Деление на ноль</td><td>Проверяйте делитель заранее</td></tr>
  </tbody>
</table>

<h3>Пример логической ошибки</h3>
<pre><code># Хотим найти среднее значение
a = 10
b = 20
srednee = a + b / 2     # НЕВЕРНО: сначала вычисляется b/2
print(srednee)          # выведет 20.0, а не 15.0

srednee = (a + b) / 2   # ВЕРНО
print(srednee)          # 15.0</code></pre>
<p>Здесь Python не выдаёт ошибку — он сделал ровно то, что ему сказали. Ошибка в том, что написали мы.</p>

<h3>Способы найти ошибку</h3>
<ul>
  <li><b>Проверка через print</b> — выведите значение переменной в подозрительном месте</li>
  <li><b>Разбиение на части</b> — растяните длинное выражение на несколько строк</li>
  <li><b>Полное чтение сообщения об ошибке</b> — чаще всего ответ написан прямо там</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>Errors — a programmer's daily companion</h2>
<p>Making a mistake is not a failure; it is a natural part of the work. What matters is being able to <b>read</b> the error message. When Python finds an error it tells you its type and the line it happened on.</p>

<h3>Three kinds of error</h3>
<ol>
  <li><b>Syntax error</b> — a rule of writing code has been broken. The program does not run at all.</li>
  <li><b>Runtime error</b> — the code is written correctly, but something went wrong while it was running (dividing by zero, for example).</li>
  <li><b>Logic error</b> — the program runs and reports nothing, but <b>the result is wrong</b>. This is the most dangerous kind.</li>
</ol>

<h3>Syntax errors</h3>
<pre><code>print("Hello"     # the bracket was never closed
# SyntaxError: '(' was never closed</code></pre>
<pre><code>if x > 5
    print("bigger")
# SyntaxError: expected ':'</code></pre>
<pre><code>if x > 5:
print("bigger")
# IndentationError: expected an indented block</code></pre>

<h3>How to read an error message</h3>
<pre><code>Traceback (most recent call last):
  File "program.py", line 4, in &lt;module&gt;
    result = 10 / 0
ZeroDivisionError: division by zero</code></pre>
<p>Read the message <b>from the bottom up</b>:</p>
<ul>
  <li>the last line — the error type and its cause: division by zero</li>
  <li>the line above it — the offending code</li>
  <li>above that — the file name and line number</li>
</ul>

<h3>The most common errors</h3>
<table>
  <thead><tr><th>Error</th><th>Cause</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td><code>NameError</code></td><td>The variable was never created, or its name is misspelled</td><td>Check the name, and mind upper and lower case</td></tr>
    <tr><td><code>TypeError</code></td><td>An operation on incompatible types: <code>"5" + 5</code></td><td>Convert with <code>int()</code> or <code>str()</code></td></tr>
    <tr><td><code>ValueError</code></td><td><code>int("hello")</code> — cannot be converted</td><td>Check the value that was entered</td></tr>
    <tr><td><code>IndexError</code></td><td>Reaching for an index the list does not have</td><td>Check the length of the list</td></tr>
    <tr><td><code>ZeroDivisionError</code></td><td>Division by zero</td><td>Check the divisor beforehand</td></tr>
  </tbody>
</table>

<h3>An example of a logic error</h3>
<pre><code># We want to find the average
a = 10
b = 20
average = a + b / 2     # WRONG: b/2 is calculated first
print(average)          # prints 20.0, not 15.0

average = (a + b) / 2   # RIGHT
print(average)          # 15.0</code></pre>
<p>Python raises no error here — it did exactly what it was told. The mistake is in what we wrote.</p>

<h3>Ways to track an error down</h3>
<ul>
  <li><b>Check with print</b> — print the value of a variable at the suspicious spot</li>
  <li><b>Break it into pieces</b> — spread a long expression over several lines</li>
  <li><b>Read the whole error message</b> — the answer is usually written right there</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Qátelik — programmistiń kúndelik joldası</h2>
<p>Qátelik jiberiw — bul sátsizlik emes, al jumıstıń tábiyiy bólegi. Áhmiyetlisi, qátelik xabarın <b>oqıy alıw</b>. Python qátelikti tapqanda, onıń túrin hám qaysı qatarda ekenin aytadı.</p>

<h3>Qateliklerdiń úsh túri</h3>
<ol>
  <li><b>Sintaksis qáteligi</b> — kod jazılıw qaǵıydası buzılǵan. Programma ulıwma iske túspeydi.</li>
  <li><b>Orınlanıw qáteligi</b> — kod durıs jazılǵan, biraq islew waqtında mashqala shıqtı (mısalı, nolge bóliw).</li>
  <li><b>Mantıqlıq qátelik</b> — programma isleydi, qátelik bermeydi, biraq <b>nátiyje qáte</b>. Eń qáwiplisi usı.</li>
</ol>

<h3>Sintaksis qatelikleri</h3>
<pre><code>print("Sálem"     # qawsıra jabılmaǵan
# SyntaxError: '(' was never closed</code></pre>
<pre><code>if x > 5
    print("úlken")
# SyntaxError: expected ':'</code></pre>
<pre><code>if x > 5:
print("úlken")
# IndentationError: expected an indented block</code></pre>

<h3>Qátelik xabarın qalay oqıw kerek</h3>
<pre><code>Traceback (most recent call last):
  File "programma.py", line 4, in &lt;module&gt;
    natiyje = 10 / 0
ZeroDivisionError: division by zero</code></pre>
<p>Xabardı <b>tómennen joqarıǵa</b> oqıń:</p>
<ul>
  <li>aqırǵı qatar — qátelik túri hám sebebi: nolge bóliw</li>
  <li>odan joqarısı — mashqalalı kod</li>
  <li>taǵı joqarısı — fayl atı hám qatar nomeri</li>
</ul>

<h3>Eń kóp ushırasatuǵın qatelikler</h3>
<table>
  <thead><tr><th>Qátelik</th><th>Sebebi</th><th>Sheshimi</th></tr></thead>
  <tbody>
    <tr><td><code>NameError</code></td><td>Ózgeriwshi jaratılmaǵan yamasa atı qáte jazılǵan</td><td>Attı tekseriń, úlken-kishi háripke itibar beriń</td></tr>
    <tr><td><code>TypeError</code></td><td>Sáykes kelmeytuǵın túrler ústinde ámel: <code>"5" + 5</code></td><td><code>int()</code> yamasa <code>str()</code> penen aylandırıń</td></tr>
    <tr><td><code>ValueError</code></td><td><code>int("sálem")</code> — aylandırıp bolmaydı</td><td>Kirgizilgen mánisti tekseriń</td></tr>
    <tr><td><code>IndexError</code></td><td>Dizimde joq indekske múrájat</td><td>Dizim uzınlıǵın tekseriń</td></tr>
    <tr><td><code>ZeroDivisionError</code></td><td>Nolge bóliw</td><td>Bóliwshini aldınnan tekseriń</td></tr>
  </tbody>
</table>

<h3>Mantıqlıq qátelikke mısal</h3>
<pre><code># Ortasha mánisti tappaqshımız
a = 10
b = 20
ortasha = a + b / 2     # QÁTE: aldın b/2 esaplanadı
print(ortasha)          # 20.0 shıǵadı, 15.0 emes

ortasha = (a + b) / 2   # DURÍS
print(ortasha)          # 15.0</code></pre>
<p>Bul jerde Python qátelik bermeydi — ol aytılǵan isti orınladı. Qátelik bizdiń jazǵanımızda.</p>

<h3>Qátelikti tabıw usılları</h3>
<ul>
  <li><b>print penen tekseriw</b> — gúmanlı jerde ózgeriwshi mánisin shıǵarıp kóriń</li>
  <li><b>Kishi bóleklerge bóliw</b> — uzın ańlatpanı birneshe qatarǵa jayıń</li>
  <li><b>Qátelik xabarın tolıq oqıw</b> — kóbinese juwap sol jerde jazılǵan</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

END $$;
