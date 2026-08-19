-- ============================================================
-- EduCode — Laboratoriya ishlari tarjimasi: 1-3
--   topics.content_html -> ru, en, kaa
--
--   lab-1-sintaksis-turlar — sonli turlar, arifmetika, aylantirish
--   lab-2-matnlar          — str: indekslash, kesish, metodlar, f-string
--   lab-3-royxatlar-for    — list metodlari, nusxa muammosi, for
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
BEGIN

  -- ============================================================
  -- lab-1-sintaksis-turlar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'lab-1-sintaksis-turlar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель работы</h2>
<p>Сформировать навык создания программы в среде Python, применения арифметических операций и преобразования типов данных друг в друга.</p>

<h3>Теоретическая справка</h3>
<p>В Python есть три основных числовых типа: <code>int</code> (целый), <code>float</code> (дробный), <code>complex</code> (комплексный). Текст хранится в типе <code>str</code>, логическое значение — в <code>bool</code>.</p>
<table>
  <tr><th>Операция</th><th>Знак</th><th>Пример</th><th>Результат</th></tr>
  <tr><td>Сложение</td><td><code>+</code></td><td><code>7 + 2</code></td><td>9</td></tr>
  <tr><td>Вычитание</td><td><code>-</code></td><td><code>7 - 2</code></td><td>5</td></tr>
  <tr><td>Умножение</td><td><code>*</code></td><td><code>7 * 2</code></td><td>14</td></tr>
  <tr><td>Деление</td><td><code>/</code></td><td><code>7 / 2</code></td><td>3.5</td></tr>
  <tr><td>Целочисленное деление</td><td><code>//</code></td><td><code>7 // 2</code></td><td>3</td></tr>
  <tr><td>Остаток</td><td><code>%</code></td><td><code>7 % 2</code></td><td>1</td></tr>
  <tr><td>Степень</td><td><code>**</code></td><td><code>7 ** 2</code></td><td>49</td></tr>
</table>
<p>Порядок операций: степень → умножение и деление → сложение и вычитание. Скобки меняют порядок.</p>

<h3>Ход работы</h3>
<ol>
  <li>Напишите следующий код и объясните результат:
    <pre><code>a = 17
b = 5
print(a + b, a - b, a * b)
print(a / b, a // b, a % b, a ** 2)</code></pre>
  </li>
  <li>С помощью <code>type()</code> определите тип каждого результата. Напишите, почему <code>a / b</code> имеет тип <code>float</code>.</li>
  <li>Испытайте преобразование типов:
    <pre><code>print(int("42") + 8)
print(float("3.5") * 2)
print(str(2026) + " год")
print(int(9.99))</code></pre>
  </li>
  <li>Запустите <code>int("3.5")</code> и запишите выданную ошибку.</li>
  <li>Выполните задания.</li>
</ol>

<h3>Контрольные вопросы</h3>
<ol>
  <li>В чём разница между <code>/</code> и <code>//</code>?</li>
  <li>Почему <code>2 ** 3 ** 2</code> равно 512?</li>
  <li><code>int()</code> округляет или отсекает?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of the work</h2>
<p>To build the skill of creating a program in the Python environment, applying arithmetic operations and converting data types into one another.</p>

<h3>Theory in brief</h3>
<p>Python has three main numeric types: <code>int</code> (whole), <code>float</code> (decimal), <code>complex</code>. Text is held in the <code>str</code> type, and a logical value in <code>bool</code>.</p>
<table>
  <tr><th>Operation</th><th>Symbol</th><th>Example</th><th>Result</th></tr>
  <tr><td>Addition</td><td><code>+</code></td><td><code>7 + 2</code></td><td>9</td></tr>
  <tr><td>Subtraction</td><td><code>-</code></td><td><code>7 - 2</code></td><td>5</td></tr>
  <tr><td>Multiplication</td><td><code>*</code></td><td><code>7 * 2</code></td><td>14</td></tr>
  <tr><td>Division</td><td><code>/</code></td><td><code>7 / 2</code></td><td>3.5</td></tr>
  <tr><td>Floor division</td><td><code>//</code></td><td><code>7 // 2</code></td><td>3</td></tr>
  <tr><td>Remainder</td><td><code>%</code></td><td><code>7 % 2</code></td><td>1</td></tr>
  <tr><td>Power</td><td><code>**</code></td><td><code>7 ** 2</code></td><td>49</td></tr>
</table>
<p>The order of operations: power → multiplication and division → addition and subtraction. Brackets change the order.</p>

<h3>Procedure</h3>
<ol>
  <li>Write the following code and explain the result:
    <pre><code>a = 17
b = 5
print(a + b, a - b, a * b)
print(a / b, a // b, a % b, a ** 2)</code></pre>
  </li>
  <li>Use <code>type()</code> to find the type of each result. Write down why <code>a / b</code> is a <code>float</code>.</li>
  <li>Try converting types:
    <pre><code>print(int("42") + 8)
print(float("3.5") * 2)
print(str(2026) + " year")
print(int(9.99))</code></pre>
  </li>
  <li>Run <code>int("3.5")</code> and write down the error it gives.</li>
  <li>Do the tasks.</li>
</ol>

<h3>Questions to check yourself</h3>
<ol>
  <li>What is the difference between <code>/</code> and <code>//</code>?</li>
  <li>Why does <code>2 ** 3 ** 2</code> come to 512?</li>
  <li>Does <code>int()</code> round or cut off?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Jumıstıń maqseti</h2>
<p>Python ortalıǵında programma jaratıw, arifmetikalıq ámellerdi qollaw hám maǵlıwmat túrlerin bir-birine aylandırıw kónlikpesin qáliplestiriw.</p>

<h3>Teoriyalıq eskertpe</h3>
<p>Pythonda úsh tiykarǵı sanlı túr bar: <code>int</code> (pútin), <code>float</code> (bólshekli), <code>complex</code> (kompleks). Tekst <code>str</code>, mantıqlıq mánis <code>bool</code> túrinde saqlanadı.</p>
<table>
  <tr><th>Ámel</th><th>Belgisi</th><th>Mısal</th><th>Nátiyje</th></tr>
  <tr><td>Qosıw</td><td><code>+</code></td><td><code>7 + 2</code></td><td>9</td></tr>
  <tr><td>Alıw</td><td><code>-</code></td><td><code>7 - 2</code></td><td>5</td></tr>
  <tr><td>Kóbeytiw</td><td><code>*</code></td><td><code>7 * 2</code></td><td>14</td></tr>
  <tr><td>Bóliw</td><td><code>/</code></td><td><code>7 / 2</code></td><td>3.5</td></tr>
  <tr><td>Pútin bóliw</td><td><code>//</code></td><td><code>7 // 2</code></td><td>3</td></tr>
  <tr><td>Qaldıq</td><td><code>%</code></td><td><code>7 % 2</code></td><td>1</td></tr>
  <tr><td>Dáreje</td><td><code>**</code></td><td><code>7 ** 2</code></td><td>49</td></tr>
</table>
<p>Ámeller tártibi: dáreje → kóbeytiw hám bóliw → qosıw hám alıw. Qawsıra tártipti ózgertedi.</p>

<h3>Jumıs tártibi</h3>
<ol>
  <li>Tómendegi kodtı jazıń hám nátiyjeni túsindiriń:
    <pre><code>a = 17
b = 5
print(a + b, a - b, a * b)
print(a / b, a // b, a % b, a ** 2)</code></pre>
  </li>
  <li><code>type()</code> járdeminde hár bir nátiyjeniń túrin anıqlań. <code>a / b</code> ne ushın <code>float</code> ekenin jazıń.</li>
  <li>Túrlerdi aylandırıwdı sınań:
    <pre><code>print(int("42") + 8)
print(float("3.5") * 2)
print(str(2026) + "-jıl")
print(int(9.99))</code></pre>
  </li>
  <li><code>int("3.5")</code> ti iske túsiriń hám shıqqan qátelikti jazıp alıń.</li>
  <li>Tapsırmalardı orınlań.</li>
</ol>

<h3>Baqlaw sorawları</h3>
<ol>
  <li><code>/</code> hám <code>//</code> arasındaǵı parq nede?</li>
  <li><code>2 ** 3 ** 2</code> ne ushın 512 ge teń?</li>
  <li><code>int()</code> dógerekleteme yamasa kese me?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- lab-2-matnlar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'lab-2-matnlar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель работы</h2>
<p>Изучить тип текста (<code>str</code>): индексирование, срезы, методы и форматирование.</p>

<h3>Теоретическая справка</h3>
<p>Текст — <b>неизменяемая</b> последовательность. Ни один метод не меняет сам текст, он возвращает <b>новый</b>.</p>
<pre><code>s = "Python"
print(s[0], s[-1], s[1:4])   # P n yth
print(len(s))                # 6</code></pre>
<p>Форма среза: <code>s[начало:конец:шаг]</code>. Начало входит, конец не входит.</p>
<table>
  <tr><th>Метод</th><th>Назначение</th></tr>
  <tr><td><code>upper()</code>, <code>lower()</code></td><td>Перевод в верхний/нижний регистр</td></tr>
  <tr><td><code>title()</code>, <code>capitalize()</code></td><td>Каждое слово / только первое слово с заглавной</td></tr>
  <tr><td><code>strip()</code></td><td>Удаление пробелов по краям</td></tr>
  <tr><td><code>replace(a, b)</code></td><td>Замена</td></tr>
  <tr><td><code>split()</code>, <code>join()</code></td><td>Разбиение на части / объединение</td></tr>
  <tr><td><code>count(x)</code>, <code>find(x)</code></td><td>Подсчёт / поиск позиции</td></tr>
</table>

<h3>Ход работы</h3>
<ol>
  <li>Испытайте индексирование и срезы на тексте:
    <pre><code>s = "Программирование"
print(s[0], s[-1])
print(s[:6], s[6:], s[::-1])</code></pre>
  </li>
  <li>Проследите за результатами методов:
    <pre><code>imya = "  али валиев  "
print(imya.strip().title())
print(imya.count("а"))</code></pre>
  </li>
  <li>Объясните, почему следующий код выводит <code>привет</code>:
    <pre><code>a = "привет"
a.upper()
print(a)</code></pre>
  </li>
  <li>Испытайте форматирование через f-string:
    <pre><code>tsena = 12345.6789
print(f"{tsena:.2f}")
print(f"{tsena:10.1f}")</code></pre>
  </li>
  <li>Выполните задания.</li>
</ol>

<h3>Контрольные вопросы</h3>
<ol>
  <li>Почему <code>s[0] = "X"</code> выдаёт ошибку?</li>
  <li>В чём разница между <code>title()</code> и <code>capitalize()</code>?</li>
  <li>Как работает <code>s[::-1]</code>?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of the work</h2>
<p>To study the text type (<code>str</code>): indexing, slicing, methods and formatting.</p>

<h3>Theory in brief</h3>
<p>Text is an <b>unchangeable</b> sequence. No method alters the text itself; it returns a <b>new</b> one.</p>
<pre><code>s = "Python"
print(s[0], s[-1], s[1:4])   # P n yth
print(len(s))                # 6</code></pre>
<p>The form of a slice: <code>s[start:stop:step]</code>. The start is included, the stop is not.</p>
<table>
  <tr><th>Method</th><th>What it does</th></tr>
  <tr><td><code>upper()</code>, <code>lower()</code></td><td>Change to upper/lower case</td></tr>
  <tr><td><code>title()</code>, <code>capitalize()</code></td><td>Every word / only the first word capitalised</td></tr>
  <tr><td><code>strip()</code></td><td>Remove the spaces at the edges</td></tr>
  <tr><td><code>replace(a, b)</code></td><td>Replace</td></tr>
  <tr><td><code>split()</code>, <code>join()</code></td><td>Break into pieces / join together</td></tr>
  <tr><td><code>count(x)</code>, <code>find(x)</code></td><td>Count / find the position</td></tr>
</table>

<h3>Procedure</h3>
<ol>
  <li>Try indexing and slicing on a text:
    <pre><code>s = "Programming"
print(s[0], s[-1])
print(s[:6], s[6:], s[::-1])</code></pre>
  </li>
  <li>Watch what the methods return:
    <pre><code>name = "  ali valiyev  "
print(name.strip().title())
print(name.count("a"))</code></pre>
  </li>
  <li>Explain why the following code prints <code>hello</code>:
    <pre><code>a = "hello"
a.upper()
print(a)</code></pre>
  </li>
  <li>Try f-string formatting:
    <pre><code>price = 12345.6789
print(f"{price:.2f}")
print(f"{price:10.1f}")</code></pre>
  </li>
  <li>Do the tasks.</li>
</ol>

<h3>Questions to check yourself</h3>
<ol>
  <li>Why does <code>s[0] = "X"</code> give an error?</li>
  <li>What is the difference between <code>title()</code> and <code>capitalize()</code>?</li>
  <li>How does <code>s[::-1]</code> work?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Jumıstıń maqseti</h2>
<p>Tekst (<code>str</code>) túrin úyreniw: indekslew, kesiw, metodlar hám formatlaw.</p>

<h3>Teoriyalıq eskertpe</h3>
<p>Tekst — <b>ózgermeytuǵın</b> izbe-izlik. Hesh bir metod tekstiń ózin ózgertpeydi, bálki <b>jańa</b> tekst qaytaradı.</p>
<pre><code>s = "Python"
print(s[0], s[-1], s[1:4])   # P n yth
print(len(s))                # 6</code></pre>
<p>Kesiw formasi: <code>s[baslanıw:juwmaqlanıw:qádem]</code>. Baslanıw kiredi, juwmaqlanıw kirmeydi.</p>
<table>
  <tr><th>Metod</th><th>Wazıypası</th></tr>
  <tr><td><code>upper()</code>, <code>lower()</code></td><td>Bas/kishi háripke ótkeriw</td></tr>
  <tr><td><code>title()</code>, <code>capitalize()</code></td><td>Hár sóz / tek birinshi sóz bas hárip</td></tr>
  <tr><td><code>strip()</code></td><td>Shetteki bosluqlardı alıp taslaw</td></tr>
  <tr><td><code>replace(a, b)</code></td><td>Almastırıw</td></tr>
  <tr><td><code>split()</code>, <code>join()</code></td><td>Bóleklerge ajıratıw / biriktiriw</td></tr>
  <tr><td><code>count(x)</code>, <code>find(x)</code></td><td>Sanaw / ornın tabıw</td></tr>
</table>

<h3>Jumıs tártibi</h3>
<ol>
  <li>Tekst ústinde indekslew hám kesiwdi sınań:
    <pre><code>s = "Programmalastırıw"
print(s[0], s[-1])
print(s[:6], s[6:], s[::-1])</code></pre>
  </li>
  <li>Metodlar nátiyjesin baqlań:
    <pre><code>at = "  ali valiyev  "
print(at.strip().title())
print(at.count("a"))</code></pre>
  </li>
  <li>Tómendegi kod ne ushın <code>sálem</code> shıǵaratuǵının túsindiriń:
    <pre><code>a = "sálem"
a.upper()
print(a)</code></pre>
  </li>
  <li>f-string formatlawdı sınań:
    <pre><code>baha = 12345.6789
print(f"{baha:.2f}")
print(f"{baha:10.1f}")</code></pre>
  </li>
  <li>Tapsırmalardı orınlań.</li>
</ol>

<h3>Baqlaw sorawları</h3>
<ol>
  <li>Ne ushın <code>s[0] = "X"</code> qátelik beredi?</li>
  <li><code>title()</code> hám <code>capitalize()</code> parqı nede?</li>
  <li><code>s[::-1]</code> qalay isleydi?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- lab-3-royxatlar-for
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'lab-3-royxatlar-for' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель работы</h2>
<p>Сформировать навык работы со структурой списка и обработки данных с помощью цикла <code>for</code>.</p>

<h3>Теоретическая справка</h3>
<pre><code>chisla = [4, 8, 15, 16, 23, 42]

print(chisla[0], chisla[-1])   # 4 42
print(chisla[1:4])             # [8, 15, 16]
print(len(chisla))             # 6
print(sum(chisla), max(chisla), min(chisla))</code></pre>
<table>
  <tr><th>Метод</th><th>Назначение</th></tr>
  <tr><td><code>append(x)</code></td><td>Добавляет в конец</td></tr>
  <tr><td><code>insert(i, x)</code></td><td>Ставит на i-ю позицию</td></tr>
  <tr><td><code>remove(x)</code></td><td>Удаляет первое встреченное x</td></tr>
  <tr><td><code>pop(i)</code></td><td>Забирает i-й элемент и возвращает его</td></tr>
  <tr><td><code>sort()</code></td><td>Сортирует сам список</td></tr>
  <tr><td><code>reverse()</code></td><td>Переворачивает порядок</td></tr>
  <tr><td><code>index(x)</code>, <code>count(x)</code></td><td>Находит позицию / считает</td></tr>
</table>
<p><b>Важно:</b> <code>b = a</code> не создаёт копию — оба имени указывают на один список. Для копии применяется <code>a.copy()</code> или <code>a[:]</code>.</p>

<h3>Ход работы</h3>
<ol>
  <li>Создайте список и испытайте методы по одному, выводя список после каждого шага.</li>
  <li>Проверьте проблему копирования:
    <pre><code>a = [1, 2, 3]
b = a
b.append(4)
print(a)          # [1, 2, 3, 4] — почему?

c = a.copy()
c.append(5)
print(a)          # не меняется</code></pre>
  </li>
  <li>Сравните три вида <code>for</code>:
    <pre><code>for x in chisla:              print(x, end=" ")
for i in range(len(chisla)):  print(chisla[i], end=" ")
for i, x in enumerate(chisla):print(i, x)</code></pre>
  </li>
  <li>Посмотрите на практике разницу между <code>sort()</code> и <code>sorted()</code>.</li>
  <li>Выполните задания.</li>
</ol>

<h3>Контрольные вопросы</h3>
<ol>
  <li>В чём разница между <code>append()</code> и <code>insert()</code>?</li>
  <li>Почему после <code>b = a</code> меняется и <code>a</code>?</li>
  <li>Когда бывает нужен <code>range(len(a))</code>?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of the work</h2>
<p>To build the skill of working with the list structure and processing data with the <code>for</code> loop.</p>

<h3>Theory in brief</h3>
<pre><code>numbers = [4, 8, 15, 16, 23, 42]

print(numbers[0], numbers[-1])   # 4 42
print(numbers[1:4])              # [8, 15, 16]
print(len(numbers))              # 6
print(sum(numbers), max(numbers), min(numbers))</code></pre>
<table>
  <tr><th>Method</th><th>What it does</th></tr>
  <tr><td><code>append(x)</code></td><td>Adds to the end</td></tr>
  <tr><td><code>insert(i, x)</code></td><td>Puts it at position i</td></tr>
  <tr><td><code>remove(x)</code></td><td>Deletes the first x it meets</td></tr>
  <tr><td><code>pop(i)</code></td><td>Takes element i out and returns it</td></tr>
  <tr><td><code>sort()</code></td><td>Sorts the list itself</td></tr>
  <tr><td><code>reverse()</code></td><td>Turns the order round</td></tr>
  <tr><td><code>index(x)</code>, <code>count(x)</code></td><td>Finds the position / counts</td></tr>
</table>
<p><b>Important:</b> <code>b = a</code> does not make a copy — both names point at the same list. For a copy, use <code>a.copy()</code> or <code>a[:]</code>.</p>

<h3>Procedure</h3>
<ol>
  <li>Create a list and try the methods one by one, printing the list after every step.</li>
  <li>Check the copying problem:
    <pre><code>a = [1, 2, 3]
b = a
b.append(4)
print(a)          # [1, 2, 3, 4] — why?

c = a.copy()
c.append(5)
print(a)          # unchanged</code></pre>
  </li>
  <li>Compare the three forms of <code>for</code>:
    <pre><code>for x in numbers:              print(x, end=" ")
for i in range(len(numbers)):  print(numbers[i], end=" ")
for i, x in enumerate(numbers):print(i, x)</code></pre>
  </li>
  <li>See the difference between <code>sort()</code> and <code>sorted()</code> in practice.</li>
  <li>Do the tasks.</li>
</ol>

<h3>Questions to check yourself</h3>
<ol>
  <li>What is the difference between <code>append()</code> and <code>insert()</code>?</li>
  <li>Why does <code>a</code> change too after <code>b = a</code>?</li>
  <li>When is <code>range(len(a))</code> needed?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Jumıstıń maqseti</h2>
<p>Dizim dúzilisi menen islew hám <code>for</code> cikli járdeminde maǵlıwmatlardı qayta islew kónlikpesin qáliplestiriw.</p>

<h3>Teoriyalıq eskertpe</h3>
<pre><code>sanlar = [4, 8, 15, 16, 23, 42]

print(sanlar[0], sanlar[-1])   # 4 42
print(sanlar[1:4])             # [8, 15, 16]
print(len(sanlar))             # 6
print(sum(sanlar), max(sanlar), min(sanlar))</code></pre>
<table>
  <tr><th>Metod</th><th>Wazıypası</th></tr>
  <tr><td><code>append(x)</code></td><td>Aqırına qosadı</td></tr>
  <tr><td><code>insert(i, x)</code></td><td>i-orınǵa qoyadı</td></tr>
  <tr><td><code>remove(x)</code></td><td>Birinshi ushırasqan x tı óshiredi</td></tr>
  <tr><td><code>pop(i)</code></td><td>i-elementti alıp, qaytaradı</td></tr>
  <tr><td><code>sort()</code></td><td>Dizimniń ózin tártipleydi</td></tr>
  <tr><td><code>reverse()</code></td><td>Tártipti keri buradı</td></tr>
  <tr><td><code>index(x)</code>, <code>count(x)</code></td><td>Ornın tabadı / sanaydı</td></tr>
</table>
<p><b>Áhmiyetli:</b> <code>b = a</code> nusqa almaydı — eki at ta bir dizimge kórsetedi. Nusqa ushın <code>a.copy()</code> yamasa <code>a[:]</code> isletiledi.</p>

<h3>Jumıs tártibi</h3>
<ol>
  <li>Dizim jaratıń hám metodlardı birme-bir sınap, hár qádemnen keyin dizimdi shıǵarıń.</li>
  <li>Nusqa máselesin tekseriń:
    <pre><code>a = [1, 2, 3]
b = a
b.append(4)
print(a)          # [1, 2, 3, 4] — nege?

c = a.copy()
c.append(5)
print(a)          # ózgermeydi</code></pre>
  </li>
  <li><code>for</code> nıń úsh kórinisin salıstırıń:
    <pre><code>for x in sanlar:              print(x, end=" ")
for i in range(len(sanlar)):  print(sanlar[i], end=" ")
for i, x in enumerate(sanlar):print(i, x)</code></pre>
  </li>
  <li><code>sort()</code> hám <code>sorted()</code> parqın ámelde kóriń.</li>
  <li>Tapsırmalardı orınlań.</li>
</ol>

<h3>Baqlaw sorawları</h3>
<ol>
  <li><code>append()</code> hám <code>insert()</code> parqı nede?</li>
  <li>Nege <code>b = a</code> dan keyin <code>a</code> da ózgeredi?</li>
  <li><code>range(len(a))</code> qashan kerek boladı?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

END $$;
