-- ============================================================
-- EduCode — Dars matnlari tarjimasi: MA'RUZA 7-8
--   topics.content_html -> ru, en, kaa
--
--   7. shartlar-va-tarmoqlanish — if / elif / else, mantiqiy amallar
--   8. lugat-va-toplam          — dict va set
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
--
-- TARJIMA QOIDASI: HTML teglari, Python kalit so'zlari va metod
-- nomlari o'zgarmaydi. Kod izohlari, matn qiymatlari va o'zgaruvchi
-- nomlari tarjima qilinadi. HTML entity'lar (&lt; &gt; &amp;) saqlanadi.
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
BEGIN

  -- ============================================================
  -- 7. shartlar-va-tarmoqlanish
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'shartlar-va-tarmoqlanish' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Программа принимает решение</h2>
<p>Программы, которые мы писали до сих пор, выполнялись строка за строкой, от начала до конца, всегда одинаково. Но в реальных задачах программа должна действовать <b>по обстоятельствам</b>: если балл студента выше 60 — «сдал», иначе — «не сдал». Такой выбор осуществляет <b>условный оператор</b>.</p>

<h3>if — простейшее условие</h3>
<pre><code>ball = 75
if ball >= 60:
    print("Вы сдали предмет")</code></pre>
<p>Если условие истинно (<code>True</code>), выполняется блок с отступом. Если ложно (<code>False</code>), блок пропускается целиком. Двоеточие и отступ обязательны.</p>

<h3>if — else</h3>
<pre><code>ball = 45
if ball >= 60:
    print("Вы сдали")
else:
    print("Будете пересдавать")</code></pre>
<p>Блок <code>else</code> охватывает все случаи, когда условие не выполнилось. Своего условия у него нет.</p>

<h3>elif — несколько путей</h3>
<p>Если вариантов больше двух, используется <code>elif</code> (сокращение от else if):</p>
<pre><code>ball = int(input())

if ball >= 90:
    print("Отлично")
elif ball >= 70:
    print("Хорошо")
elif ball >= 60:
    print("Удовлетворительно")
else:
    print("Неудовлетворительно")</code></pre>
<p>Важно: условия проверяются <b>сверху вниз</b>, и как только выполнилось <b>первое истинное</b>, остальные вообще не рассматриваются. Поэтому порядок условий имеет значение — напиши мы <code>ball >= 60</code> первым, и 95 баллов тоже дали бы «Удовлетворительно».</p>

<h3>Операторы сравнения</h3>
<table>
  <tr><th>Оператор</th><th>Значение</th><th>Пример</th></tr>
  <tr><td><code>==</code></td><td>равно</td><td><code>a == 5</code></td></tr>
  <tr><td><code>!=</code></td><td>не равно</td><td><code>a != 5</code></td></tr>
  <tr><td><code>&gt;</code></td><td>больше</td><td><code>a &gt; 5</code></td></tr>
  <tr><td><code>&lt;</code></td><td>меньше</td><td><code>a &lt; 5</code></td></tr>
  <tr><td><code>&gt;=</code></td><td>больше или равно</td><td><code>a &gt;= 5</code></td></tr>
  <tr><td><code>&lt;=</code></td><td>меньше или равно</td><td><code>a &lt;= 5</code></td></tr>
</table>
<p>Самая частая ошибка — написать одно <code>=</code> при проверке равенства. Один знак равенства означает <b>присваивание</b>, два — <b>сравнение</b>.</p>

<h3>Логические операторы: and, or, not</h3>
<pre><code>vozrast = 20
student = True

if vozrast >= 18 and student:
    print("Билет со скидкой")

if vozrast &lt; 7 or vozrast &gt; 60:
    print("Бесплатный билет")

if not student:
    print("Полная цена")</code></pre>
<ul>
  <li><code>and</code> — истинными должны быть оба условия</li>
  <li><code>or</code> — достаточно хотя бы одного истинного</li>
  <li><code>not</code> — меняет результат на противоположный</li>
</ul>

<h3>Цепочки сравнений</h3>
<p>В Python можно записывать как в математике:</p>
<pre><code>if 0 &lt;= ball &lt;= 100:
    print("Балл введён верно")</code></pre>
<p>Это то же самое, что <code>ball &gt;= 0 and ball &lt;= 100</code>, но заметно читабельнее.</p>

<h3>Вложенные условия</h3>
<pre><code>chislo = int(input())

if chislo > 0:
    if chislo % 2 == 0:
        print("Положительное и чётное")
    else:
        print("Положительное и нечётное")
else:
    print("Не положительное")</code></pre>
<p>Внутреннее условие отступает ещё на одну ступень относительно внешнего. Если вложенность выходит за три уровня, код лучше упростить с помощью <code>and</code>.</p>

<h3>Пример из практики</h3>
<pre><code>parol = input()

if len(parol) &lt; 8:
    print("Пароль слишком короткий")
elif parol.isdigit():
    print("Пароль состоит только из цифр")
else:
    print("Пароль принят")</code></pre>

<h3>Итог</h3>
<ul>
  <li><code>if</code> проверяет условие, <code>elif</code> даёт дополнительные варианты, <code>else</code> ловит все остальные случаи</li>
  <li>После условия — двоеточие, на следующей строке обязателен отступ</li>
  <li>Для сравнения <code>==</code>, для присваивания <code>=</code></li>
  <li><code>and</code>, <code>or</code>, <code>not</code> объединяют несколько условий</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The program makes a decision</h2>
<p>The programs we have written so far ran line by line, from top to bottom, always the same way. But in real problems a program has to act <b>according to the situation</b>: if a student's score is above 60 then "passed", otherwise "failed". A <b>conditional statement</b> makes that choice.</p>

<h3>if — the simplest condition</h3>
<pre><code>score = 75
if score >= 60:
    print("You passed the subject")</code></pre>
<p>If the condition is true (<code>True</code>), the indented block runs. If it is false (<code>False</code>), the block is skipped entirely. The colon and the indentation are compulsory.</p>

<h3>if — else</h3>
<pre><code>score = 45
if score >= 60:
    print("You passed")
else:
    print("You will resit")</code></pre>
<p>The <code>else</code> block covers every case where the condition was not met. It has no condition of its own.</p>

<h3>elif — several paths</h3>
<p>When there are more than two options, <code>elif</code> (short for else if) is used:</p>
<pre><code>score = int(input())

if score >= 90:
    print("Excellent")
elif score >= 70:
    print("Good")
elif score >= 60:
    print("Satisfactory")
else:
    print("Unsatisfactory")</code></pre>
<p>Important: the conditions are checked <b>from top to bottom</b>, and once the <b>first true one</b> has run, the rest are not looked at at all. That is why the order matters — had we put <code>score >= 60</code> first, a score of 95 would also come out as "Satisfactory".</p>

<h3>Comparison operators</h3>
<table>
  <tr><th>Operator</th><th>Meaning</th><th>Example</th></tr>
  <tr><td><code>==</code></td><td>equal to</td><td><code>a == 5</code></td></tr>
  <tr><td><code>!=</code></td><td>not equal to</td><td><code>a != 5</code></td></tr>
  <tr><td><code>&gt;</code></td><td>greater than</td><td><code>a &gt; 5</code></td></tr>
  <tr><td><code>&lt;</code></td><td>less than</td><td><code>a &lt; 5</code></td></tr>
  <tr><td><code>&gt;=</code></td><td>greater than or equal to</td><td><code>a &gt;= 5</code></td></tr>
  <tr><td><code>&lt;=</code></td><td>less than or equal to</td><td><code>a &lt;= 5</code></td></tr>
</table>
<p>The commonest mistake is writing a single <code>=</code> when testing equality. One equals sign means <b>assignment</b>, two mean <b>comparison</b>.</p>

<h3>Logical operators: and, or, not</h3>
<pre><code>age = 20
student = True

if age >= 18 and student:
    print("Discounted ticket")

if age &lt; 7 or age &gt; 60:
    print("Free ticket")

if not student:
    print("Full price")</code></pre>
<ul>
  <li><code>and</code> — both conditions have to be true</li>
  <li><code>or</code> — at least one true condition is enough</li>
  <li><code>not</code> — turns the result into its opposite</li>
</ul>

<h3>Chained comparisons</h3>
<p>In Python you can write it just as in mathematics:</p>
<pre><code>if 0 &lt;= score &lt;= 100:
    print("The score was entered correctly")</code></pre>
<p>This is the same as <code>score &gt;= 0 and score &lt;= 100</code>, but far more readable.</p>

<h3>Nested conditions</h3>
<pre><code>number = int(input())

if number > 0:
    if number % 2 == 0:
        print("Positive and even")
    else:
        print("Positive and odd")
else:
    print("Not positive")</code></pre>
<p>The inner condition is indented one more step than the outer one. If the nesting goes beyond three levels, it is better to simplify the code with <code>and</code>.</p>

<h3>An example from practice</h3>
<pre><code>password = input()

if len(password) &lt; 8:
    print("The password is too short")
elif password.isdigit():
    print("The password contains only digits")
else:
    print("Password accepted")</code></pre>

<h3>Summary</h3>
<ul>
  <li><code>if</code> tests a condition, <code>elif</code> adds further options, <code>else</code> catches every remaining case</li>
  <li>A colon after the condition, and indentation on the next line, are required</li>
  <li><code>==</code> for comparison, <code>=</code> for assignment</li>
  <li><code>and</code>, <code>or</code>, <code>not</code> combine several conditions</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Programma qarar qabıl etedi</h2>
<p>Usı waqıtqa shekem jazǵan programmalarımız qatarma-qatar, bastan aqırına shekem bir qıylı orınlanatuǵın edi. Biraq haqıyqıy máselelerde programma <b>jaǵdayǵa qarap</b> túrlishe is tutıwı kerek: student balı 60 tan joqarı bolsa "ótti", bolmasa "ótpedi". Bunday saylawdı <b>shárt operatorı</b> ámelge asıradı.</p>

<h3>if — eń ápiwayı shárt</h3>
<pre><code>ball = 75
if ball >= 60:
    print("Pánnen óttińiz")</code></pre>
<p>Shárt shın (<code>True</code>) bolsa, shegingen blok orınlanadı. Jalǵan (<code>False</code>) bolsa, blok pútkilley taslap ketiledi. Eki noqat hám sheginiw shárt.</p>

<h3>if — else</h3>
<pre><code>ball = 45
if ball >= 60:
    print("Óttińiz")
else:
    print("Qayta tapsırasız")</code></pre>
<p><code>else</code> bloki shárt orınlanbaǵan barlıq jaǵdaylardı qamtıydı. Onıń óz shárti joq.</p>

<h3>elif — birneshe jol</h3>
<p>Ekiden artıq variant bolsa <code>elif</code> (else if qısqartpası) isletiledi:</p>
<pre><code>ball = int(input())

if ball >= 90:
    print("Álla")
elif ball >= 70:
    print("Jaqsı")
elif ball >= 60:
    print("Qanaatlanarlı")
else:
    print("Qanaatlanarsız")</code></pre>
<p>Áhmiyetli: shártler <b>joqarıdan tómenge</b> tekseriledi hám <b>birinshi shın tabılǵanı</b> orınlanǵannan keyin, qalǵanları pútkilley qaralmaydı. Sonlıqtan shártler tártibi áhmiyetli — eger <code>ball >= 60</code> tı birinshi jazsaq, 95 ball ta "Qanaatlanarlı" bolıp shıǵar edi.</p>

<h3>Salıstırıw operatorları</h3>
<table>
  <tr><th>Operator</th><th>Mánisi</th><th>Mısal</th></tr>
  <tr><td><code>==</code></td><td>teń</td><td><code>a == 5</code></td></tr>
  <tr><td><code>!=</code></td><td>teń emes</td><td><code>a != 5</code></td></tr>
  <tr><td><code>&gt;</code></td><td>úlken</td><td><code>a &gt; 5</code></td></tr>
  <tr><td><code>&lt;</code></td><td>kishi</td><td><code>a &lt; 5</code></td></tr>
  <tr><td><code>&gt;=</code></td><td>úlken yamasa teń</td><td><code>a &gt;= 5</code></td></tr>
  <tr><td><code>&lt;=</code></td><td>kishi yamasa teń</td><td><code>a &lt;= 5</code></td></tr>
</table>
<p>Eń kóp ushırasatuǵın qátelik — teńlikti tekseriwde bir <code>=</code> jazıp qoyıw. Bir teńlik belgisi <b>mánis beriw</b>, ekewi <b>salıstırıw</b> degeni.</p>

<h3>Mantıqlıq operatorlar: and, or, not</h3>
<pre><code>jas = 20
student = True

if jas >= 18 and student:
    print("Jeńillikli bilet")

if jas &lt; 7 or jas &gt; 60:
    print("Tegin bilet")

if not student:
    print("Tolıq baha")</code></pre>
<ul>
  <li><code>and</code> — eki shárt te shın bolıwı kerek</li>
  <li><code>or</code> — keminde birewi shın bolsa jeterli</li>
  <li><code>not</code> — nátiyjeni keri ózgertedi</li>
</ul>

<h3>Shınjırlı salıstırıw</h3>
<p>Pythonda matematikadaǵıday jazıwǵa boladı:</p>
<pre><code>if 0 &lt;= ball &lt;= 100:
    print("Ball durıs kirgizilgen")</code></pre>
<p>Bul <code>ball &gt;= 0 and ball &lt;= 100</code> menen bir qıylı, biraq ádewir oqıwlı.</p>

<h3>Ishpe-ish shártler</h3>
<pre><code>san = int(input())

if san > 0:
    if san % 2 == 0:
        print("Oń hám jup")
    else:
        print("Oń hám taq")
else:
    print("Oń emes")</code></pre>
<p>Ishki shárt sırtqı shártke salıstırǵanda taǵı bir basqısh shegindi. Ishpe-ish shártler úsh basqıshtan asıp ketse, kodtı <code>and</code> járdeminde ápiwayılastırıw jaqsıraq.</p>

<h3>Ámelde ushırasatuǵın úlgi</h3>
<pre><code>parol = input()

if len(parol) &lt; 8:
    print("Parol júdá qısqa")
elif parol.isdigit():
    print("Parol tek sanlardan ibarat")
else:
    print("Parol qabıl etildi")</code></pre>

<h3>Juwmaq</h3>
<ul>
  <li><code>if</code> shártti tekseredi, <code>elif</code> qosımsha variantlar beredi, <code>else</code> qalǵan barlıq jaǵdaydı uslaydı</li>
  <li>Shárttan keyin eki noqat, keyingi qatarda sheginiw shárt</li>
  <li>Salıstırıw ushın <code>==</code>, mánis beriw ushın <code>=</code></li>
  <li><code>and</code>, <code>or</code>, <code>not</code> birneshe shártti biriktiredi</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- 8. lugat-va-toplam
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'lugat-va-toplam' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Когда списка недостаточно</h2>
<p>В списке элементы хранятся по <b>порядковому номеру</b>: <code>studenty[0]</code>, <code>studenty[1]</code>. Но чаще нам удобнее обращаться не по номеру, а по <b>имени</b>: «сколько баллов у Али?» Именно эту задачу решает <b>словарь</b>.</p>

<h3>Словарь (dictionary)</h3>
<p>Словарь — набор пар <b>ключ: значение</b>. Записывается в фигурных скобках:</p>
<pre><code>bally = {"Али": 85, "Дильноза": 92, "Бекзод": 74}

print(bally["Дильноза"])   # 92</code></pre>
<p>Здесь <code>"Али"</code>, <code>"Дильноза"</code>, <code>"Бекзод"</code> — ключи; <code>85</code>, <code>92</code>, <code>74</code> — значения.</p>

<h3>Добавление и изменение элемента</h3>
<pre><code>bally["Малика"] = 88     # добавлена новая пара
bally["Али"] = 90        # существующее значение изменено
del bally["Бекзод"]      # удалено</code></pre>
<p>Внимание: если ключ существует, значение заменяется; если нет — добавляется новый. Пишутся оба одинаково.</p>

<h3>Несуществующий ключ</h3>
<pre><code>print(bally["Сардор"])       # KeyError!
print(bally.get("Сардор"))   # None
print(bally.get("Сардор", 0))# 0</code></pre>
<p>Метод <code>get()</code> не выдаёт ошибку, если ключ не найден. Второй аргумент — значение, возвращаемое при отсутствии ключа.</p>
<p>Чтобы проверить наличие ключа, используется <code>in</code>:</p>
<pre><code>if "Али" in bally:
    print("Али найден")</code></pre>

<h3>Обход словаря</h3>
<pre><code>for imya in bally:
    print(imya, bally[imya])

for imya, ball in bally.items():
    print(f"{imya}: {ball}")

print(list(bally.keys()))     # список ключей
print(list(bally.values()))   # список значений</code></pre>
<p>Способ через <code>items()</code> самый удобный — он на каждом обороте выдаёт ключ и значение сразу.</p>

<h3>Полезные подсчёты</h3>
<pre><code>print(len(bally))          # сколько пар
print(sum(bally.values()))  # сумма баллов
print(max(bally.values()))  # самый высокий балл</code></pre>

<h3>Множество (set)</h3>
<p>Множество — группа <b>неповторяющихся</b> элементов. Порядок не сохраняется.</p>
<pre><code>chisla = {3, 1, 4, 1, 5, 3}
print(chisla)     # {1, 3, 4, 5} — повторы исчезли</code></pre>
<p>Пустое множество создаётся не через <code>{}</code>, а через <code>set()</code> — потому что <code>{}</code> означает пустой словарь.</p>

<h3>Операции над множествами</h3>
<pre><code>a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)   # объединение: {1, 2, 3, 4, 5, 6}
print(a &amp; b)   # пересечение: {3, 4}
print(a - b)   # разность:    {1, 2}
print(a ^ b)   # симметрическая разность: {1, 2, 5, 6}</code></pre>
<p>Эти операции в точности совпадают с операциями над множествами в математике. Поэтому set часто применяют, отвечая на вопросы вида «кто есть в обеих группах?», «кто только в первой?».</p>

<h3>Самый короткий способ убрать повторы</h3>
<pre><code>chisla = [5, 2, 5, 8, 2, 9]
unikalnye = list(set(chisla))
print(sorted(unikalnye))    # [2, 5, 8, 9]</code></pre>
<p><code>set()</code> отбрасывает повторы, <code>list()</code> снова превращает в список, <code>sorted()</code> сортирует.</p>

<h3>Когда что выбирать?</h3>
<table>
  <tr><th>Задача</th><th>Структура</th></tr>
  <tr><td>Упорядоченная последовательность</td><td>list</td></tr>
  <tr><td>Поиск по имени</td><td>dict</td></tr>
  <tr><td>Группа без повторов, проверка принадлежности</td><td>set</td></tr>
  <tr><td>Неизменяемая последовательность</td><td>tuple</td></tr>
</table>
<p>Ещё один важный момент: проверка <code>in</code> в списке перебирает все элементы, а в словаре и множестве работает практически мгновенно. При больших объёмах данных это даёт огромную разницу.</p>

<h3>Итог</h3>
<ul>
  <li>Словарь — структура, хранящая значение по ключу, <code>{"ключ": значение}</code></li>
  <li><code>get()</code> для чтения без ошибки, <code>items()</code> для обхода пар</li>
  <li>Множество не хранит повторы и поддерживает операции над множествами</li>
  <li>Пустое множество создаётся только через <code>set()</code></li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>When a list is not enough</h2>
<p>In a list, elements are stored by their <b>position number</b>: <code>students[0]</code>, <code>students[1]</code>. But it is often handier to reach them by <b>name</b> rather than by number: "what is Ali's score?" That is exactly the job a <b>dictionary</b> does.</p>

<h3>Dictionaries</h3>
<p>A dictionary is a collection of <b>key: value</b> pairs. It is written with curly brackets:</p>
<pre><code>scores = {"Ali": 85, "Dilnoza": 92, "Bekzod": 74}

print(scores["Dilnoza"])   # 92</code></pre>
<p>Here <code>"Ali"</code>, <code>"Dilnoza"</code>, <code>"Bekzod"</code> are the keys; <code>85</code>, <code>92</code>, <code>74</code> are the values.</p>

<h3>Adding and changing an element</h3>
<pre><code>scores["Malika"] = 88     # a new pair has been added
scores["Ali"] = 90        # an existing value has changed
del scores["Bekzod"]      # deleted</code></pre>
<p>Note: if the key already exists the value is replaced; if it does not, a new one is added. Both are written the same way.</p>

<h3>A key that does not exist</h3>
<pre><code>print(scores["Sardor"])       # KeyError!
print(scores.get("Sardor"))   # None
print(scores.get("Sardor", 0))# 0</code></pre>
<p>The <code>get()</code> method does not raise an error when the key is missing. The second argument is the value returned when there is no such key.</p>
<p>To check whether a key is present, <code>in</code> is used:</p>
<pre><code>if "Ali" in scores:
    print("Ali was found")</code></pre>

<h3>Walking through a dictionary</h3>
<pre><code>for name in scores:
    print(name, scores[name])

for name, score in scores.items():
    print(f"{name}: {score}")

print(list(scores.keys()))     # the list of keys
print(list(scores.values()))   # the list of values</code></pre>
<p>The <code>items()</code> way is the handiest — it hands you the key and the value together on every turn.</p>

<h3>Useful calculations</h3>
<pre><code>print(len(scores))          # how many pairs there are
print(sum(scores.values()))  # the total of the scores
print(max(scores.values()))  # the highest score</code></pre>

<h3>Sets</h3>
<p>A set is a group of <b>non-repeating</b> elements. The order is not kept.</p>
<pre><code>numbers = {3, 1, 4, 1, 5, 3}
print(numbers)     # {1, 3, 4, 5} — the repeats are gone</code></pre>
<p>An empty set is created with <code>set()</code>, not <code>{}</code> — because <code>{}</code> means an empty dictionary.</p>

<h3>Set operations</h3>
<pre><code>a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)   # union:        {1, 2, 3, 4, 5, 6}
print(a &amp; b)   # intersection: {3, 4}
print(a - b)   # difference:   {1, 2}
print(a ^ b)   # symmetric difference: {1, 2, 5, 6}</code></pre>
<p>These operations match the set operations of mathematics exactly. That is why sets are often used to answer questions like "who is in both groups?" or "who is only in the first one?".</p>

<h3>The shortest way to remove repeats</h3>
<pre><code>numbers = [5, 2, 5, 8, 2, 9]
unique = list(set(numbers))
print(sorted(unique))    # [2, 5, 8, 9]</code></pre>
<p><code>set()</code> throws the repeats away, <code>list()</code> turns it back into a list, and <code>sorted()</code> puts it in order.</p>

<h3>Which one to choose when</h3>
<table>
  <tr><th>Task</th><th>Structure</th></tr>
  <tr><td>An ordered sequence</td><td>list</td></tr>
  <tr><td>Looking things up by name</td><td>dict</td></tr>
  <tr><td>A group without repeats, membership testing</td><td>set</td></tr>
  <tr><td>An unchangeable sequence</td><td>tuple</td></tr>
</table>
<p>One more important point: an <code>in</code> test looks through every element of a list, whereas in a dictionary or a set it works almost instantly. With a lot of data that makes an enormous difference.</p>

<h3>Summary</h3>
<ul>
  <li>A dictionary is a structure that stores a value under a key, <code>{"key": value}</code></li>
  <li><code>get()</code> for reading without an error, <code>items()</code> for walking through the pairs</li>
  <li>A set keeps no repeats and supports the set operations</li>
  <li>An empty set can only be created with <code>set()</code></li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Dizim jeterli bolmaǵanda</h2>
<p>Dizimde elementler <b>tártip nomeri</b> menen saqlanadı: <code>studentler[0]</code>, <code>studentler[1]</code>. Biraq kóbinese bizge nomer emes, <b>at</b> boyınsha múrájat etiw qolaylıraq: "Ali diń balı qansha?" Dál usı wazıypanı <b>sózlik</b> orınlaydı.</p>

<h3>Sózlik (dictionary)</h3>
<p>Sózlik — <b>gilt: mánis</b> juplıqları toplamı. Figuralı qawsıra ishine jazıladı:</p>
<pre><code>ballar = {"Ali": 85, "Dilnoza": 92, "Bekzod": 74}

print(ballar["Dilnoza"])   # 92</code></pre>
<p>Bul jerde <code>"Ali"</code>, <code>"Dilnoza"</code>, <code>"Bekzod"</code> — giltler; <code>85</code>, <code>92</code>, <code>74</code> — mánisler.</p>

<h3>Element qosıw hám ózgertiw</h3>
<pre><code>ballar["Malika"] = 88     # jańa juplıq qosıldı
ballar["Ali"] = 90        # bar mánis ózgerdi
del ballar["Bekzod"]      # óshirildi</code></pre>
<p>Itibar beriń: eger gilt bar bolsa mánis almasadı, bolmasa jańası qosıladı. Ekewi de bir qıylı jazıladı.</p>

<h3>Bolmaǵan gilt</h3>
<pre><code>print(ballar["Sardor"])       # KeyError!
print(ballar.get("Sardor"))   # None
print(ballar.get("Sardor", 0))# 0</code></pre>
<p><code>get()</code> metodı gilt tabılmasa qátelik bermeydi. Ekinshi argument — gilt bolmaǵanda qaytarılatuǵın mánis.</p>
<p>Gilttiń barlıǵın tekseriw ushın <code>in</code> isletiledi:</p>
<pre><code>if "Ali" in ballar:
    print("Ali tabıldı")</code></pre>

<h3>Sózlik boylap júriw</h3>
<pre><code>for at in ballar:
    print(at, ballar[at])

for at, ball in ballar.items():
    print(f"{at}: {ball}")

print(list(ballar.keys()))     # giltler dizimi
print(list(ballar.values()))   # mánisler dizimi</code></pre>
<p><code>items()</code> usılı eń qolaylısı — ol hár aylanısta gilt hám mánisti birden beredi.</p>

<h3>Paydalı esap-kitap</h3>
<pre><code>print(len(ballar))          # neshe juplıq bar
print(sum(ballar.values()))  # ballar jıyındısı
print(max(ballar.values()))  # eń joqarı ball</code></pre>

<h3>Toplam (set)</h3>
<p>Toplam — <b>qaytalanbaytuǵın</b> elementler toparı. Tártip saqlanbaydı.</p>
<pre><code>sanlar = {3, 1, 4, 1, 5, 3}
print(sanlar)     # {1, 3, 4, 5} — qaytalanıwlar joǵaldı</code></pre>
<p>Bos toplam <code>{}</code> penen emes, <code>set()</code> penen jaratıladı — sebebi <code>{}</code> bos sózlikti bildiredi.</p>

<h3>Toplam ámelleri</h3>
<pre><code>a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)   # birlespe:  {1, 2, 3, 4, 5, 6}
print(a &amp; b)   # kesilispe: {3, 4}
print(a - b)   # ayırma:    {1, 2}
print(a ^ b)   # simmetriyalı ayırma: {1, 2, 5, 6}</code></pre>
<p>Bul ámeller matematikadaǵı toplam ámelleri menen dál bir qıylı. Sonlıqtan set kóbinese "kim eki toparda da bar?", "kim tek birinshisinde?" sıyaqlı sorawlarǵa juwap beriwde isletiledi.</p>

<h3>Qaytalanıwlardı joq etiwdiń eń qısqa jolı</h3>
<pre><code>sanlar = [5, 2, 5, 8, 2, 9]
óziniń = list(set(sanlar))
print(sorted(óziniń))    # [2, 5, 8, 9]</code></pre>
<p><code>set()</code> qaytalanıwlardı taslaydı, <code>list()</code> qayta dizimge aylandıradı, <code>sorted()</code> tártipleydi.</p>

<h3>Qashan qaysısın saylaw kerek?</h3>
<table>
  <tr><th>Wazıypa</th><th>Dúzilis</th></tr>
  <tr><td>Tártipli izbe-izlik</td><td>list</td></tr>
  <tr><td>At boyınsha izlew</td><td>dict</td></tr>
  <tr><td>Qaytalanıwsız topar, aǵzalıqtı tekseriw</td><td>set</td></tr>
  <tr><td>Ózgermeytuǵın izbe-izlik</td><td>tuple</td></tr>
</table>
<p>Taǵı bir áhmiyetli jaǵday: <code>in</code> tekseriwi dizimde barlıq elementti kórip shıǵadı, sózlik hám toplamda bolsa derlik bir sátte isleydi. Maǵlıwmat kóp bolǵanda bul úlken parq beredi.</p>

<h3>Juwmaq</h3>
<ul>
  <li>Sózlik — gilt arqalı mánis saqlaytuǵın dúzilis, <code>{"gilt": mánis}</code></li>
  <li><code>get()</code> qátesiz oqıw, <code>items()</code> juplıqlar boylap júriw ushın</li>
  <li>Toplam qaytalanıwlardı saqlamaydı hám toplam ámellerin qollap-quwatlaydı</li>
  <li>Bos toplam tek <code>set()</code> penen jaratıladı</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

END $$;
