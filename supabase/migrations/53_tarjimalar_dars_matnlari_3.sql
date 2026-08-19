-- ============================================================
-- EduCode — Dars matnlari tarjimasi: MA'RUZA 5-6
--   topics.content_html -> ru, en, kaa
--
--   5. matnlar-va-sonlar   — String, f-string, matn metodlari
--   6. royxatlar-va-for    — Ro'yxat, tuple, range, for sikli
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
--
-- TARJIMA QOIDASI: HTML teglari, Python kalit so'zlari va metod
-- nomlari (.upper(), sorted(), range()) o'zgarmaydi. Kod ichidagi
-- izohlar, matn qiymatlari va o'zgaruvchi nomlari tarjima qilinadi.
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
BEGIN

  -- ============================================================
  -- 5. matnlar-va-sonlar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'matnlar-va-sonlar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>String — текстовый тип данных</h2>
<p>Текст пишется в двойных или одинарных кавычках — разницы нет:</p>
<pre><code>a = "Привет"
b = 'Привет'
c = """Текст может быть
и многострочным"""</code></pre>
<p>Если внутри текста нужны кавычки, снаружи поставьте другие:</p>
<pre><code>fraza = "Он сказал 'привет'"
fraza2 = 'Книга называется "Python"'</code></pre>

<h3>Операции над текстом</h3>
<pre><code>a = "Python"
b = "программирование"

print(a + " " + b)   # Python программирование — объединение
print(a * 3)         # PythonPythonPython     — повторение
print(len(a))        # 6                      — длина
print(a[0])          # P                      — первый символ
print(a[-1])         # n                      — последний символ
print(a[0:3])        # Pyt                    — срез</code></pre>
<p>Индекс начинается <b>с 0</b>. Отрицательный индекс считает с конца.</p>

<h3>f-string — самый удобный способ</h3>
<pre><code>imya = "Дильноза"
vozrast = 19

# Старый способ
print("Привет, " + imya + "! Вам " + str(vozrast) + " лет.")

# f-string — удобнее и допускает меньше ошибок
print(f"Привет, {imya}! Вам {vozrast} лет.")</code></pre>
<p>Внутри f-string можно и вычислять:</p>
<pre><code>a, b = 7, 3
print(f"{a} + {b} = {a + b}")
print(f"{a} / {b} = {a / b:.2f}")   # округление до 2 знаков</code></pre>

<h3>Методы строк</h3>
<table>
  <thead><tr><th>Метод</th><th>Назначение</th><th>Пример</th></tr></thead>
  <tbody>
    <tr><td><code>.upper()</code></td><td>В верхний регистр</td><td><code>"привет".upper()</code> → <code>ПРИВЕТ</code></td></tr>
    <tr><td><code>.lower()</code></td><td>В нижний регистр</td><td><code>"ПРИВЕТ".lower()</code> → <code>привет</code></td></tr>
    <tr><td><code>.title()</code></td><td>Каждое слово с заглавной</td><td><code>"али валиев".title()</code> → <code>Али Валиев</code></td></tr>
    <tr><td><code>.capitalize()</code></td><td>Только первая буква</td><td><code>"али валиев".capitalize()</code> → <code>Али валиев</code></td></tr>
    <tr><td><code>.strip()</code></td><td>Убирает пробелы по краям</td><td><code>"  a  ".strip()</code> → <code>a</code></td></tr>
    <tr><td><code>.replace()</code></td><td>Заменяет</td><td><code>"salom".replace("s", "k")</code> → <code>kalom</code></td></tr>
    <tr><td><code>.split()</code></td><td>Разбивает в список</td><td><code>"a b c".split()</code> → <code>['a','b','c']</code></td></tr>
    <tr><td><code>.count()</code></td><td>Считает число вхождений</td><td><code>"salom".count("l")</code> → <code>1</code></td></tr>
  </tbody>
</table>

<h3>Разница между title() и capitalize()</h3>
<pre><code>imya = "али валиев кодирович"
print(imya.title())        # Али Валиев Кодирович
print(imya.capitalize())   # Али валиев кодирович</code></pre>

<h3>Важно: текст не меняется</h3>
<p>Методы не изменяют текст, они <b>возвращают новый</b>:</p>
<pre><code>a = "привет"
a.upper()
print(a)          # привет — не изменился!

a = a.upper()
print(a)          # ПРИВЕТ — вот теперь изменился</code></pre>

<h3>Достоинства и недостатки методов</h3>
<ul>
  <li><b>Достоинство:</b> код получается коротким и читаемым, ошибок меньше, всё уже готово и проверено.</li>
  <li><b>Недостаток:</b> каждый метод создаёт новый текст — при работе с очень большими текстами расходуется память. Длинные цепочки методов труднее читать.</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>String — the text data type</h2>
<p>Text is written in double or single quotes — it makes no difference:</p>
<pre><code>a = "Hello"
b = 'Hello'
c = """Text can also span
several lines"""</code></pre>
<p>If you need quotes inside the text, use the other kind on the outside:</p>
<pre><code>phrase = "He said 'hello'"
phrase2 = 'The book is called "Python"'</code></pre>

<h3>Operations on text</h3>
<pre><code>a = "Python"
b = "programming"

print(a + " " + b)   # Python programming  — joining
print(a * 3)         # PythonPythonPython  — repeating
print(len(a))        # 6                   — length
print(a[0])          # P                   — first character
print(a[-1])         # n                   — last character
print(a[0:3])        # Pyt                 — slice</code></pre>
<p>Indexing starts <b>at 0</b>. A negative index counts from the end.</p>

<h3>f-string — the handiest way</h3>
<pre><code>name = "Dilnoza"
age = 19

# The old way
print("Hello, " + name + "! You are " + str(age) + " years old.")

# f-string — handier and easier to get right
print(f"Hello, {name}! You are {age} years old.")</code></pre>
<p>You can calculate inside an f-string too:</p>
<pre><code>a, b = 7, 3
print(f"{a} + {b} = {a + b}")
print(f"{a} / {b} = {a / b:.2f}")   # rounded to 2 decimal places</code></pre>

<h3>String methods</h3>
<table>
  <thead><tr><th>Method</th><th>What it does</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>.upper()</code></td><td>To upper case</td><td><code>"hello".upper()</code> → <code>HELLO</code></td></tr>
    <tr><td><code>.lower()</code></td><td>To lower case</td><td><code>"HELLO".lower()</code> → <code>hello</code></td></tr>
    <tr><td><code>.title()</code></td><td>Each word capitalised</td><td><code>"ali valiyev".title()</code> → <code>Ali Valiyev</code></td></tr>
    <tr><td><code>.capitalize()</code></td><td>Only the first letter</td><td><code>"ali valiyev".capitalize()</code> → <code>Ali valiyev</code></td></tr>
    <tr><td><code>.strip()</code></td><td>Removes surrounding spaces</td><td><code>"  a  ".strip()</code> → <code>a</code></td></tr>
    <tr><td><code>.replace()</code></td><td>Replaces</td><td><code>"salom".replace("s", "k")</code> → <code>kalom</code></td></tr>
    <tr><td><code>.split()</code></td><td>Splits into a list</td><td><code>"a b c".split()</code> → <code>['a','b','c']</code></td></tr>
    <tr><td><code>.count()</code></td><td>Counts occurrences</td><td><code>"salom".count("l")</code> → <code>1</code></td></tr>
  </tbody>
</table>

<h3>The difference between title() and capitalize()</h3>
<pre><code>name = "ali valiyev qodirovich"
print(name.title())        # Ali Valiyev Qodirovich
print(name.capitalize())   # Ali valiyev qodirovich</code></pre>

<h3>Important: the text does not change</h3>
<p>Methods do not modify the text, they <b>return a new one</b>:</p>
<pre><code>a = "hello"
a.upper()
print(a)          # hello — unchanged!

a = a.upper()
print(a)          # HELLO — now it has changed</code></pre>

<h3>What methods are good and bad at</h3>
<ul>
  <li><b>Good:</b> the code stays short and readable, fewer mistakes creep in, and the work is already written and tested.</li>
  <li><b>Bad:</b> every method creates a new string — with very large texts that costs memory. Long chains of methods are harder to read.</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>String — tekst maǵlıwmat túri</h2>
<p>Tekst qos tırnaq yamasa bir tırnaq ishine jazıladı — parqı joq:</p>
<pre><code>a = "Sálem"
b = 'Sálem'
c = """Birneshe qatarlıq
tekst te bolıwı múmkin"""</code></pre>
<p>Tekst ishinde tırnaq kerek bolsa, sırtına basqasın qoyıń:</p>
<pre><code>gáp = "Ol 'sálem' dedi"
gáp2 = 'Kitap "Python" dep ataladı'</code></pre>

<h3>Tekst ústinde ámeller</h3>
<pre><code>a = "Python"
b = "programmalastırıw"

print(a + " " + b)   # Python programmalastırıw — biriktiriw
print(a * 3)         # PythonPythonPython       — qaytalaw
print(len(a))        # 6                        — uzınlıq
print(a[0])          # P                        — birinshi belgi
print(a[-1])         # n                        — aqırǵı belgi
print(a[0:3])        # Pyt                      — kesiw</code></pre>
<p>Indeks <b>0 den</b> baslanadı. Teris indeks aqırınan sanaydı.</p>

<h3>f-string — eń qolaylı usıl</h3>
<pre><code>at = "Dilnoza"
jas = 19

# Eski usıl
print("Sálem, " + at + "! Siz " + str(jas) + " jastasız.")

# f-string — qolaylıraq hám azıraq qátege jol qoyadı
print(f"Sálem, {at}! Siz {jas} jastasız.")</code></pre>
<p>f-string ishinde esaplaw da múmkin:</p>
<pre><code>a, b = 7, 3
print(f"{a} + {b} = {a + b}")
print(f"{a} / {b} = {a / b:.2f}")   # 2 orınǵa shekem dógerekletiw</code></pre>

<h3>Tekst metodları</h3>
<table>
  <thead><tr><th>Metod</th><th>Wazıypası</th><th>Mısal</th></tr></thead>
  <tbody>
    <tr><td><code>.upper()</code></td><td>Bas háripke</td><td><code>"sálem".upper()</code> → <code>SÁLEM</code></td></tr>
    <tr><td><code>.lower()</code></td><td>Kishi háripke</td><td><code>"SÁLEM".lower()</code> → <code>sálem</code></td></tr>
    <tr><td><code>.title()</code></td><td>Hár sóz bas hárip penen</td><td><code>"ali valiyev".title()</code> → <code>Ali Valiyev</code></td></tr>
    <tr><td><code>.capitalize()</code></td><td>Tek birinshi hárip</td><td><code>"ali valiyev".capitalize()</code> → <code>Ali valiyev</code></td></tr>
    <tr><td><code>.strip()</code></td><td>Shetteki bosluqlardı alıp taslaydı</td><td><code>"  a  ".strip()</code> → <code>a</code></td></tr>
    <tr><td><code>.replace()</code></td><td>Almastıradı</td><td><code>"salom".replace("s", "k")</code> → <code>kalom</code></td></tr>
    <tr><td><code>.split()</code></td><td>Dizimge ajıratadı</td><td><code>"a b c".split()</code> → <code>['a','b','c']</code></td></tr>
    <tr><td><code>.count()</code></td><td>Neshe ret ushırasqanın sanaydı</td><td><code>"salom".count("l")</code> → <code>1</code></td></tr>
  </tbody>
</table>

<h3>title() hám capitalize() parqı</h3>
<pre><code>at = "ali valiyev qodirovich"
print(at.title())        # Ali Valiyev Qodirovich
print(at.capitalize())   # Ali valiyev qodirovich</code></pre>

<h3>Áhmiyetli: tekst ózgermeydi</h3>
<p>Metodlar tekstti ózgertpeydi, <b>jańa tekst qaytaradı</b>:</p>
<pre><code>a = "sálem"
a.upper()
print(a)          # sálem — ózgermedi!

a = a.upper()
print(a)          # SÁLEM — endi ózgerdi</code></pre>

<h3>Metodlardıń artıqmashılıǵı hám kemshiligi</h3>
<ul>
  <li><b>Artıqmashılıǵı:</b> kod qısqa hám oqıwlı boladı, azıraq qátege jol qoyıladı, tayın hám sınnan ótken.</li>
  <li><b>Kemshiligi:</b> hár bir metod jańa tekst jaratadı — júdá úlken teksler menen islegende yad sarplanadı. Kóp metodtı izbe-iz jalǵaw kodtı oqıwdı qıyınlastıradı.</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- 6. royxatlar-va-for
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'royxatlar-va-for' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Список (list)</h2>
<p>Список — структура, хранящая несколько значений под одним именем. Записывается в квадратных скобках:</p>
<pre><code>chisla = [10, 20, 30, 40, 50]
imena = ["Али", "Вали", "Гули"]
smeshannyy = [1, "привет", 3.14, True]   # типы могут быть разными</code></pre>

<h3>Обращение к элементу</h3>
<pre><code>chisla = [10, 20, 30, 40, 50]
print(chisla[0])    # 10  — первый
print(chisla[-1])   # 50  — последний
print(len(chisla))  # 5   — длина

chisla[1] = 99      # изменение
print(chisla)       # [10, 99, 30, 40, 50]</code></pre>

<h3>Методы списка</h3>
<pre><code>a = [3, 1, 2]
a.append(4)        # добавить в конец      → [3, 1, 2, 4]
a.insert(0, 0)     # на указанную позицию  → [0, 3, 1, 2, 4]
a.remove(3)        # удалить по значению   → [0, 1, 2, 4]
posledniy = a.pop() # убирает последний и возвращает его
a.sort()           # сортировка (меняет сам список)
a.reverse()        # перевернуть
print(a.count(1))  # сколько раз встречается</code></pre>
<p>Чтобы сохранить исходный список и получить отсортированную копию, используют <code>sorted()</code>:</p>
<pre><code>a = [3, 1, 2]
b = sorted(a)
print(a, b)   # [3, 1, 2] [1, 2, 3]</code></pre>

<h3>Срезы (slicing)</h3>
<pre><code>a = [0, 1, 2, 3, 4, 5]
print(a[1:4])    # [1, 2, 3]   — с 1-го по 4-й (4-й не входит)
print(a[:3])     # [0, 1, 2]   — с начала
print(a[3:])     # [3, 4, 5]   — до конца
print(a[::2])    # [0, 2, 4]   — через один
print(a[::-1])   # [5, 4, 3, 2, 1, 0] — в обратном порядке</code></pre>

<h3>Копирование — важная ловушка</h3>
<pre><code>a = [1, 2, 3]
b = a           # ЭТО НЕ КОПИЯ! b и a указывают на один список
b.append(4)
print(a)        # [1, 2, 3, 4] — a тоже изменился

c = a[:]        # настоящая копия
# или c = a.copy()</code></pre>

<h3>Tuple — неизменяемый список</h3>
<pre><code>nedelya = ("Понедельник", "Вторник", "Среда")
print(nedelya[0])     # Понедельник
nedelya[0] = "Воскресенье"   # TypeError — изменить нельзя</code></pre>
<p>Когда нужен tuple? Когда значения не должны меняться: дни недели, координаты, настройки. Он работает быстрее списка и защищает от случайного изменения.</p>

<h3>Функция range()</h3>
<pre><code>list(range(5))        # [0, 1, 2, 3, 4]
list(range(2, 6))     # [2, 3, 4, 5]
list(range(0, 10, 2)) # [0, 2, 4, 6, 8]
list(range(5, 0, -1)) # [5, 4, 3, 2, 1]</code></pre>

<h3>Цикл for</h3>
<p>Цикл — конструкция, выполняющая повторяющиеся действия. <code>for</code> проходит по списку или по <code>range</code>:</p>
<pre><code>for frukt in ["яблоко", "гранат", "виноград"]:
    print(frukt)

for i in range(1, 6):
    print("квадрат числа", i, ":", i ** 2)</code></pre>

<h3>Как работает for</h3>
<ol>
  <li>Из списка берётся очередной элемент и записывается в переменную</li>
  <li>Выполняется код внутри цикла</li>
  <li>Шаги 1-2 повторяются, пока элементы не закончатся</li>
</ol>

<h3>Операции над числовыми списками</h3>
<pre><code>chisla = [4, 8, 15, 16, 23, 42]
print(sum(chisla))    # 108 — сумма
print(min(chisla))    # 4
print(max(chisla))    # 42
print(sum(chisla) / len(chisla))   # среднее</code></pre>

<h3>for вместе с input()</h3>
<pre><code>n = int(input("Сколько чисел введёте? "))
chisla = []
for i in range(n):
    chislo = int(input())
    chisla.append(chislo)
print("Сумма:", sum(chisla))</code></pre>

<h3>Частые ошибки</h3>
<ul>
  <li><code>a[len(a)]</code> — <code>IndexError</code>. Последний индекс — <code>len(a) - 1</code>.</li>
  <li>Удаление элементов из списка внутри цикла — элементы сдвигаются, и часть из них пропускается.</li>
  <li>Забытое двоеточие: <code>for i in range(5)</code> — <code>SyntaxError</code>.</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>Lists</h2>
<p>A list is a structure that holds several values under one name. It is written with square brackets:</p>
<pre><code>numbers = [10, 20, 30, 40, 50]
names = ["Ali", "Vali", "Guli"]
mixed = [1, "hello", 3.14, True]   # the types may differ</code></pre>

<h3>Reaching an element</h3>
<pre><code>numbers = [10, 20, 30, 40, 50]
print(numbers[0])    # 10  — the first
print(numbers[-1])   # 50  — the last
print(len(numbers))  # 5   — the length

numbers[1] = 99      # changing it
print(numbers)       # [10, 99, 30, 40, 50]</code></pre>

<h3>List methods</h3>
<pre><code>a = [3, 1, 2]
a.append(4)      # add to the end        → [3, 1, 2, 4]
a.insert(0, 0)   # at the given position → [0, 3, 1, 2, 4]
a.remove(3)      # delete by value       → [0, 1, 2, 4]
last = a.pop()   # removes the last one and returns it
a.sort()         # sorting (changes the list itself)
a.reverse()      # reverse it
print(a.count(1)) # how many times it appears</code></pre>
<p>To keep the original list and get a sorted copy, use <code>sorted()</code>:</p>
<pre><code>a = [3, 1, 2]
b = sorted(a)
print(a, b)   # [3, 1, 2] [1, 2, 3]</code></pre>

<h3>Slicing</h3>
<pre><code>a = [0, 1, 2, 3, 4, 5]
print(a[1:4])    # [1, 2, 3]   — from 1 up to 4 (4 not included)
print(a[:3])     # [0, 1, 2]   — from the start
print(a[3:])     # [3, 4, 5]   — to the end
print(a[::2])    # [0, 2, 4]   — every second one
print(a[::-1])   # [5, 4, 3, 2, 1, 0] — reversed</code></pre>

<h3>Copying — an important trap</h3>
<pre><code>a = [1, 2, 3]
b = a           # NOT A COPY! b and a point at the same list
b.append(4)
print(a)        # [1, 2, 3, 4] — a changed too

c = a[:]        # a real copy
# or c = a.copy()</code></pre>

<h3>Tuple — the unchangeable list</h3>
<pre><code>week = ("Monday", "Tuesday", "Wednesday")
print(week[0])     # Monday
week[0] = "Sunday"   # TypeError — it cannot be changed</code></pre>
<p>When do you need a tuple? When the values must not change: days of the week, coordinates, settings. It works faster than a list and protects against changing something by accident.</p>

<h3>The range() function</h3>
<pre><code>list(range(5))        # [0, 1, 2, 3, 4]
list(range(2, 6))     # [2, 3, 4, 5]
list(range(0, 10, 2)) # [0, 2, 4, 6, 8]
list(range(5, 0, -1)) # [5, 4, 3, 2, 1]</code></pre>

<h3>The for loop</h3>
<p>A loop is a construct that carries out repeated actions. <code>for</code> walks along a list or a <code>range</code>:</p>
<pre><code>for fruit in ["apple", "pomegranate", "grape"]:
    print(fruit)

for i in range(1, 6):
    print("the square of", i, "is:", i ** 2)</code></pre>

<h3>How for works</h3>
<ol>
  <li>The next element is taken from the list and written into the variable</li>
  <li>The code inside the loop is carried out</li>
  <li>Steps 1-2 repeat until no elements are left</li>
</ol>

<h3>Operations on lists of numbers</h3>
<pre><code>numbers = [4, 8, 15, 16, 23, 42]
print(sum(numbers))    # 108 — the total
print(min(numbers))    # 4
print(max(numbers))    # 42
print(sum(numbers) / len(numbers))   # the average</code></pre>

<h3>for together with input()</h3>
<pre><code>n = int(input("How many numbers will you enter? "))
numbers = []
for i in range(n):
    number = int(input())
    numbers.append(number)
print("Total:", sum(numbers))</code></pre>

<h3>Common mistakes</h3>
<ul>
  <li><code>a[len(a)]</code> — <code>IndexError</code>. The last index is <code>len(a) - 1</code>.</li>
  <li>Deleting elements from a list inside a loop — the elements shift and some get skipped.</li>
  <li>Forgetting the colon: <code>for i in range(5)</code> — <code>SyntaxError</code>.</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Dizim (list)</h2>
<p>Dizim — birneshe mánisti bir at astında saqlaytuǵın dúzilis. Kvadrat qawsıra menen jazıladı:</p>
<pre><code>sanlar = [10, 20, 30, 40, 50]
atlar = ["Ali", "Vali", "Guli"]
aralas = [1, "sálem", 3.14, True]   # túrleri hár qıylı bolıwı múmkin</code></pre>

<h3>Elementke múrájat</h3>
<pre><code>sanlar = [10, 20, 30, 40, 50]
print(sanlar[0])    # 10  — birinshi
print(sanlar[-1])   # 50  — aqırǵı
print(len(sanlar))  # 5   — uzınlıq

sanlar[1] = 99      # ózgertiw
print(sanlar)       # [10, 99, 30, 40, 50]</code></pre>

<h3>Dizim metodları</h3>
<pre><code>a = [3, 1, 2]
a.append(4)       # aqırına qosıw        → [3, 1, 2, 4]
a.insert(0, 0)    # kórsetilgen orınǵa   → [0, 3, 1, 2, 4]
a.remove(3)       # mánis boyınsha óshiriw → [0, 1, 2, 4]
aqırǵı = a.pop()  # aqırǵısın alıp taslaydı hám qaytaradı
a.sort()          # tártiplew (ózin ózgertedi)
a.reverse()       # keri qılıw
print(a.count(1)) # neshe ret ushırasadı</code></pre>
<p>Deslepki dizimdi saqlap qalıp tártiplengen nusqa alıw ushın <code>sorted()</code> isletiledi:</p>
<pre><code>a = [3, 1, 2]
b = sorted(a)
print(a, b)   # [3, 1, 2] [1, 2, 3]</code></pre>

<h3>Kesiw (slicing)</h3>
<pre><code>a = [0, 1, 2, 3, 4, 5]
print(a[1:4])    # [1, 2, 3]   — 1-den 4-ke shekem (4 kirmeydi)
print(a[:3])     # [0, 1, 2]   — basınan
print(a[3:])     # [3, 4, 5]   — aqırına shekem
print(a[::2])    # [0, 2, 4]   — birewden taslap
print(a[::-1])   # [5, 4, 3, 2, 1, 0] — keri</code></pre>

<h3>Nusqa alıw — áhmiyetli qaqpan</h3>
<pre><code>a = [1, 2, 3]
b = a           # NUSQA EMES! b hám a bir dizimge kórsetedi
b.append(4)
print(a)        # [1, 2, 3, 4] — a da ózgerdi

c = a[:]        # haqıyqıy nusqa
# yamasa c = a.copy()</code></pre>

<h3>Tuple — ózgermeytuǵın dizim</h3>
<pre><code>hápte = ("Dúyshembi", "Siyshembi", "Sárshembi")
print(hápte[0])     # Dúyshembi
hápte[0] = "Ekshembi"   # TypeError — ózgertiwge bolmaydı</code></pre>
<p>Tuple qashan kerek? Mánisler ózgermewi kerek bolǵanda: hápte kúnleri, koordinatalar, sazlawlar. Ol dizimnen tezirek isleydi hám kezdeysoq ózgertip qoyıwdan qorǵaydı.</p>

<h3>range() funkciyası</h3>
<pre><code>list(range(5))        # [0, 1, 2, 3, 4]
list(range(2, 6))     # [2, 3, 4, 5]
list(range(0, 10, 2)) # [0, 2, 4, 6, 8]
list(range(5, 0, -1)) # [5, 4, 3, 2, 1]</code></pre>

<h3>for cikli</h3>
<p>Cikl — qaytalanatuǵın ámellerdi orınlaytuǵın konstrukciya. <code>for</code> dizim yamasa <code>range</code> boylap júredi:</p>
<pre><code>for miywe in ["alma", "anar", "júzim"]:
    print(miywe)

for i in range(1, 6):
    print(i, "niń kvadratı:", i ** 2)</code></pre>

<h3>for qalay isleydi</h3>
<ol>
  <li>Dizimnen gezektegi element alınadı hám ózgeriwshige jazıladı</li>
  <li>Cikl ishindegi kod orınlanadı</li>
  <li>Element qalmaǵansha 1-2 qádem qaytalanadı</li>
</ol>

<h3>Sanlı dizimler ústinde ámeller</h3>
<pre><code>sanlar = [4, 8, 15, 16, 23, 42]
print(sum(sanlar))    # 108 — jıyındı
print(min(sanlar))    # 4
print(max(sanlar))    # 42
print(sum(sanlar) / len(sanlar))   # ortasha</code></pre>

<h3>for hám input() birge</h3>
<pre><code>n = int(input("Neshe san kirgizesiz? "))
sanlar = []
for i in range(n):
    san = int(input())
    sanlar.append(san)
print("Jıyındı:", sum(sanlar))</code></pre>

<h3>Kóp ushırasatuǵın qátelikler</h3>
<ul>
  <li><code>a[len(a)]</code> — <code>IndexError</code>. Aqırǵı indeks <code>len(a) - 1</code>.</li>
  <li>Cikl ishinde dizimnen element óshiriw — elementler jıljıp, ayırımları taslap ketiledi.</li>
  <li>Eki noqattı umıtıw: <code>for i in range(5)</code> — <code>SyntaxError</code>.</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

END $$;
