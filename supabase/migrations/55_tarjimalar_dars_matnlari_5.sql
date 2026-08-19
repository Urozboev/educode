-- ============================================================
-- EduCode — Dars matnlari tarjimasi: MA'RUZA 9-10
--   topics.content_html -> ru, en, kaa
--
--    9. while-sikli — while, break, continue
--   10. funksiyalar — def, return, parametrlar, docstring
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
--
-- TARJIMA QOIDASI: HTML teglari, Python kalit so'zlari va metod
-- nomlari o'zgarmaydi. Kod izohlari, matn qiymatlari, funksiya va
-- o'zgaruvchi nomlari tarjima qilinadi. HTML entity'lar saqlanadi.
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
BEGIN

  -- ============================================================
  -- 9. while-sikli
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'while-sikli' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Когда мы не знаем, сколько раз повторять</h2>
<p>Цикл <code>for</code> применяется, когда число повторов <b>известно заранее</b>: «выведи 10 чисел», «для каждого элемента списка». Но иногда число повторов заранее неизвестно: «спрашивай, пока пользователь не введёт верный пароль». В таком случае используется <code>while</code>.</p>

<h3>Основная конструкция</h3>
<pre><code>i = 1
while i &lt;= 5:
    print(i)
    i = i + 1</code></pre>
<p>Порядок работы: проверяется условие → если истинно, выполняется блок → условие проверяется снова → ... → когда условие становится ложным, цикл заканчивается.</p>

<h3>Как не попасть в бесконечный цикл</h3>
<pre><code># ОШИБКА! i никогда не меняется
i = 1
while i &lt;= 5:
    print(i)</code></pre>
<p>Эта программа не остановится. <b>Для каждого цикла while ответьте на три вопроса:</b></p>
<ol>
  <li>Получила ли переменная значение до цикла?</li>
  <li>Станет ли условие когда-нибудь ложным?</li>
  <li>Меняется ли внутри цикла величина, влияющая на условие?</li>
</ol>

<h3>Повторный запрос у пользователя</h3>
<pre><code>parol = input()
while parol != "python":
    print("Неверно, попробуйте снова")
    parol = input()
print("Добро пожаловать!")</code></pre>
<p>Это самое типичное применение <code>while</code> — спрашивать, пока не придёт верный ответ.</p>

<h3>Сумма и счётчик</h3>
<pre><code>itogo = 0
chislo = int(input())
while chislo != 0:
    itogo = itogo + chislo
    chislo = int(input())
print(itogo)</code></pre>
<p>Здесь <code>0</code> — <b>признак остановки</b> (sentinel). Как только пользователь введёт 0, цикл завершится и выведется сумма.</p>

<h3>break и continue</h3>
<pre><code>while True:
    komanda = input()
    if komanda == "выход":
        break          # полностью выходит из цикла
    if komanda == "":
        continue       # пропускает остаток и возвращается к началу
    print("Команда:", komanda)</code></pre>
<ul>
  <li><code>break</code> — немедленно завершает цикл</li>
  <li><code>continue</code> — пропускает остаток текущего оборота и переходит к следующему</li>
</ul>
<p><code>while True</code> — намеренно бесконечный цикл. Чтобы выйти из него, нужен <code>break</code>, иначе программа зависнет.</p>

<h3>Практический пример: сумма цифр</h3>
<pre><code>chislo = int(input())
summa = 0
while chislo &gt; 0:
    summa = summa + chislo % 10   # берёт последнюю цифру
    chislo = chislo // 10         # отбрасывает последнюю цифру
print(summa)</code></pre>
<p>Например, для 472: складываются 2 → 7 → 4, результат 13. Этот приём — классический способ работы с цифрами числа.</p>

<h3>while или for?</h3>
<table>
  <tr><th>Ситуация</th><th>Выбор</th></tr>
  <tr><td>Обход списка, текста</td><td>for</td></tr>
  <tr><td>Ровно N повторов</td><td>for + range()</td></tr>
  <tr><td>Пока условие выполняется</td><td>while</td></tr>
  <tr><td>Пока пользователь не остановит</td><td>while</td></tr>
</table>

<h3>Итог</h3>
<ul>
  <li><code>while</code> повторяет, пока условие истинно</li>
  <li>Внутри цикла обязательно должно меняться то, что влияет на условие</li>
  <li><code>break</code> выходит, <code>continue</code> переходит к следующему обороту</li>
  <li>Если число повторов известно, удобнее <code>for</code></li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>When we do not know how many times to repeat</h2>
<p>The <code>for</code> loop is used when the number of repetitions is <b>known in advance</b>: "print 10 numbers", "for each element of the list". But sometimes that number is not known beforehand: "keep asking until the user enters the right password". In such a case <code>while</code> is used.</p>

<h3>The basic structure</h3>
<pre><code>i = 1
while i &lt;= 5:
    print(i)
    i = i + 1</code></pre>
<p>How it works: the condition is tested → if it is true the block runs → the condition is tested again → ... → when the condition becomes false the loop ends.</p>

<h3>Not falling into an endless loop</h3>
<pre><code># WRONG! i never changes
i = 1
while i &lt;= 5:
    print(i)</code></pre>
<p>This program will not stop. <b>For every while loop, answer three questions:</b></p>
<ol>
  <li>Did the variable get a value before the loop?</li>
  <li>Will the condition ever become false?</li>
  <li>Does something inside the loop change what the condition depends on?</li>
</ol>

<h3>Asking the user again</h3>
<pre><code>password = input()
while password != "python":
    print("Wrong, try again")
    password = input()
print("Welcome!")</code></pre>
<p>This is the most typical use of <code>while</code> — asking until the right answer arrives.</p>

<h3>A total and a counter</h3>
<pre><code>total = 0
number = int(input())
while number != 0:
    total = total + number
    number = int(input())
print(total)</code></pre>
<p>Here <code>0</code> is the <b>stopping marker</b> (a sentinel). When the user enters 0 the loop ends and the total is printed.</p>

<h3>break and continue</h3>
<pre><code>while True:
    command = input()
    if command == "quit":
        break          # leaves the loop entirely
    if command == "":
        continue       # skips the rest and goes back to the top
    print("Command:", command)</code></pre>
<ul>
  <li><code>break</code> — ends the loop at once</li>
  <li><code>continue</code> — skips the rest of the current turn and moves to the next</li>
</ul>
<p><code>while True</code> is a deliberately endless loop. A <code>break</code> is required to get out of it, otherwise the program freezes.</p>

<h3>A practical example: the sum of the digits</h3>
<pre><code>number = int(input())
total = 0
while number &gt; 0:
    total = total + number % 10   # takes the last digit
    number = number // 10         # drops the last digit
print(total)</code></pre>
<p>For 472, say: 2 → 7 → 4 are added, giving 13. This technique is the classic way of working with the digits of a number.</p>

<h3>while or for?</h3>
<table>
  <tr><th>Situation</th><th>Choice</th></tr>
  <tr><td>Walking through a list or text</td><td>for</td></tr>
  <tr><td>Repeating exactly N times</td><td>for + range()</td></tr>
  <tr><td>Until a condition is met</td><td>while</td></tr>
  <tr><td>Until the user stops it</td><td>while</td></tr>
</table>

<h3>Summary</h3>
<ul>
  <li><code>while</code> repeats for as long as the condition is true</li>
  <li>Something inside the loop must change what the condition depends on</li>
  <li><code>break</code> gets out, <code>continue</code> moves to the next turn</li>
  <li>When the number of repetitions is known, <code>for</code> is handier</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Neshe ret qaytalawdı bilmegenimizde</h2>
<p><code>for</code> cikli qaytalaw sanı <b>aldınnan belgili</b> bolǵanda isletiledi: "10 sandı shıǵar", "dizimniń hár bir elementi ushın". Biraq geyde qaytalaw sanı aldınnan belgisiz: "paydalanıwshı durıs parol kirgizgenshe soraber". Bunday jaǵdayda <code>while</code> isletiledi.</p>

<h3>Tiykarǵı dúzilis</h3>
<pre><code>i = 1
while i &lt;= 5:
    print(i)
    i = i + 1</code></pre>
<p>Jumıs tártibi: shárt tekseriledi → shın bolsa blok orınlanadı → qayta shárt tekseriledi → ... → shárt jalǵan bolǵanda cikl juwmaqlanadı.</p>

<h3>Sheksiz ciklge túsip qalmaw</h3>
<pre><code># QÁTE! i hesh qashan ózgermeydi
i = 1
while i &lt;= 5:
    print(i)</code></pre>
<p>Bul programma toqtamaydı. <b>Hár bir while cikli ushın úsh sorawǵa juwap beriń:</b></p>
<ol>
  <li>Cikldan aldın ózgeriwshi mánis aldı ma?</li>
  <li>Shárt qashan da bolsa jalǵan bola ma?</li>
  <li>Cikl ishinde shártke tásir etetuǵın mánis ózgere me?</li>
</ol>

<h3>Paydalanıwshıdan qayta soraw</h3>
<pre><code>parol = input()
while parol != "python":
    print("Nadurıs, qayta urınıń")
    parol = input()
print("Xosh kelipsiz!")</code></pre>
<p>Bul <code>while</code> niń eń tipik isletiliwi — durıs juwap kelgenshe soraw.</p>

<h3>Jıyındı hám esaplaǵısh</h3>
<pre><code>jámi = 0
san = int(input())
while san != 0:
    jámi = jámi + san
    san = int(input())
print(jámi)</code></pre>
<p>Bul jerde <code>0</code> — <b>toqtatıwshı belgi</b> (sentinel). Paydalanıwshı 0 kirgizgende cikl juwmaqlanadı hám jıyındı shıǵadı.</p>

<h3>break hám continue</h3>
<pre><code>while True:
    buyrıq = input()
    if buyrıq == "shıǵıw":
        break          # cikldan pútkilley shıǵadı
    if buyrıq == "":
        continue       # qalǵan bólegin taslap, basına qaytadı
    print("Buyrıq:", buyrıq)</code></pre>
<ul>
  <li><code>break</code> — cikldi derhal juwmaqlaydı</li>
  <li><code>continue</code> — házirgi aylanıstıń qalǵanın taslap, keyingisine ótedi</li>
</ul>
<p><code>while True</code> — atayı sheksiz cikl. Odan shıǵıw ushın <code>break</code> shárt, bolmasa programma qatıp qaladı.</p>

<h3>Ámeliy mısal: sanlar jıyındısı</h3>
<pre><code>san = int(input())
jıyındı = 0
while san &gt; 0:
    jıyındı = jıyındı + san % 10   # aqırǵı sannı aladı
    san = san // 10                # aqırǵı sandı taslaydı
print(jıyındı)</code></pre>
<p>Mısalı 472 ushın: 2 → 7 → 4 qosıladı, nátiyje 13. Bul usıl — sannıń raqamları menen islewdiń klassikalıq jolı.</p>

<h3>while hám for: qaysısı?</h3>
<table>
  <tr><th>Jaǵday</th><th>Saylaw</th></tr>
  <tr><td>Dizim, tekst boylap júriw</td><td>for</td></tr>
  <tr><td>Anıq N ret qaytalaw</td><td>for + range()</td></tr>
  <tr><td>Shárt orınlanǵansha</td><td>while</td></tr>
  <tr><td>Paydalanıwshı toqtatqansha</td><td>while</td></tr>
</table>

<h3>Juwmaq</h3>
<ul>
  <li><code>while</code> shárt shın bolǵan sayın qaytalaydı</li>
  <li>Cikl ishinde shártke tásir etetuǵın ózgeris bolıwı shárt</li>
  <li><code>break</code> shıǵadı, <code>continue</code> keyingi aylanısqa ótedi</li>
  <li>Qaytalaw sanı belgili bolsa <code>for</code> qolaylıraq</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- 10. funksiyalar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'funksiyalar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    -- RU ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Не повторять код</h2>
<p>Чем больше растёт программа, тем чаще в ней встречаются одинаковые куски кода. Копировать их каждый раз — значит создать две проблемы: файл разрастается, а при обнаружении ошибки исправлять её приходится <b>во всех копиях</b>. <b>Функция</b> — это именованный кусок кода, который вызывается тогда, когда нужен.</p>

<h3>Создание функции</h3>
<pre><code>def privetstvie():
    print("Здравствуйте!")

privetstvie()
privetstvie()</code></pre>
<p><code>def</code> — ключевое слово объявления функции. За ним идут имя, скобки и двоеточие. Тело функции пишется с отступом.</p>
<p>Важно: строка <code>def</code> только <b>создаёт</b> функцию, но не выполняет её. Чтобы код заработал, функцию нужно <b>вызвать</b>: <code>privetstvie()</code>.</p>

<h3>Параметр и аргумент</h3>
<pre><code>def privetstvie(imya):
    print(f"Привет, {imya}!")

privetstvie("Али")
privetstvie("Дильноза")</code></pre>
<p><code>imya</code> — <b>параметр</b> (имя в объявлении функции). <code>"Али"</code> — <b>аргумент</b> (настоящее значение, переданное при вызове).</p>

<h3>return — возврат результата</h3>
<pre><code>def kvadrat(x):
    return x * x

rezultat = kvadrat(5)
print(rezultat)        # 25
print(kvadrat(3) + kvadrat(4))  # 25</code></pre>
<p>Не путайте <code>print()</code> и <code>return</code>:</p>
<ul>
  <li><code>print()</code> — выводит на экран, результат нельзя использовать в других вычислениях</li>
  <li><code>return</code> — <b>возвращает</b> значение, его можно сохранить в переменную или подставить в другое выражение</li>
</ul>
<p>Как только выполняется <code>return</code>, функция немедленно завершается — строки после него не работают.</p>

<h3>Несколько параметров</h3>
<pre><code>def summa(a, b):
    return a + b

def ploshchad_treugolnika(osnovanie, vysota):
    return osnovanie * vysota / 2

print(summa(3, 7))                       # 10
print(ploshchad_treugolnika(6, 4))       # 12.0</code></pre>
<p>Порядок аргументов важен: первый аргумент попадает в первый параметр.</p>

<h3>Значения по умолчанию</h3>
<pre><code>def privetstvie(imya, privet="Привет"):
    print(f"{privet}, {imya}!")

privetstvie("Али")                     # Привет, Али!
privetstvie("Али", "Доброе утро")      # Доброе утро, Али!</code></pre>
<p>Параметры со значением по умолчанию должны стоять в конце списка.</p>

<h3>Именованные аргументы</h3>
<pre><code>def svedeniya(imya, vozrast, gorod):
    print(f"{imya}, {vozrast} лет, {gorod}")

svedeniya(vozrast=20, gorod="Гулистан", imya="Али")</code></pre>
<p>Когда аргументы передаются по имени, порядок перестаёт иметь значение, а код читается легче.</p>

<h3>Возврат нескольких значений</h3>
<pre><code>def maks_i_min(chisla):
    return max(chisla), min(chisla)

bolshee, menshee = maks_i_min([4, 9, 1, 7])
print(bolshee, menshee)     # 9 1</code></pre>
<p>На самом деле функция возвращает один tuple, а мы раскладываем его на две переменные.</p>

<h3>Локальные и глобальные переменные</h3>
<pre><code>def vychislit():
    x = 10        # локальная — живёт только внутри функции
    print(x)

vychislit()
print(x)          # NameError!</code></pre>
<p>Переменная, созданная внутри функции, снаружи не существует. Это хорошее свойство: функции не вмешиваются в работу друг друга.</p>

<h3>Строка документации (docstring)</h3>
<pre><code>def kvadrat(x):
    """Возвращает квадрат числа."""
    return x * x

print(kvadrat.__doc__)</code></pre>
<p>Текст в тройных кавычках в начале функции объясняет, что она делает. Это простая, но ценная привычка профессионального написания кода.</p>

<h3>Какой бывает хорошая функция?</h3>
<ul>
  <li>Выполняет одну чёткую задачу</li>
  <li>Имя говорит об этой задаче: <code>vychislit_srednee</code>, <code>nechetnoe_li</code></li>
  <li>Нужные данные получает через параметры, результат отдаёт через <code>return</code></li>
  <li>Обычно не длиннее 20 строк</li>
</ul>

<h3>Итог</h3>
<ul>
  <li><code>def imya(параметры):</code> создаёт функцию, <code>imya()</code> вызывает её</li>
  <li><code>return</code> возвращает значение и завершает функцию</li>
  <li>Переменные внутри функции локальны</li>
  <li>Увидели повторяющийся код — его пора вынести в функцию</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- EN ---------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>Not repeating code</h2>
<p>The bigger a program grows, the more often the same pieces of code turn up in it. Copying them every time creates two problems: the file gets longer, and when a mistake is found it has to be fixed <b>in every copy</b>. A <b>function</b> is a named piece of code that is called whenever it is needed.</p>

<h3>Creating a function</h3>
<pre><code>def greet():
    print("Hello there!")

greet()
greet()</code></pre>
<p><code>def</code> is the keyword that declares a function. After it come the name, the brackets and a colon. The body of the function is indented.</p>
<p>Important: the <code>def</code> line only <b>creates</b> the function, it does not run it. For the code to work you have to <b>call</b> it: <code>greet()</code>.</p>

<h3>Parameter and argument</h3>
<pre><code>def greet(name):
    print(f"Hello, {name}!")

greet("Ali")
greet("Dilnoza")</code></pre>
<p><code>name</code> is the <b>parameter</b> (the name in the function declaration). <code>"Ali"</code> is the <b>argument</b> (the actual value given at the call).</p>

<h3>return — handing back a result</h3>
<pre><code>def square(x):
    return x * x

result = square(5)
print(result)          # 25
print(square(3) + square(4))  # 25</code></pre>
<p>Do not mix up <code>print()</code> and <code>return</code>:</p>
<ul>
  <li><code>print()</code> — puts something on the screen; the result cannot be used in another calculation</li>
  <li><code>return</code> — <b>hands back</b> a value, which you can store in a variable or drop into another expression</li>
</ul>
<p>As soon as <code>return</code> runs, the function ends immediately — the lines after it never execute.</p>

<h3>Several parameters</h3>
<pre><code>def total(a, b):
    return a + b

def triangle_area(base, height):
    return base * height / 2

print(total(3, 7))              # 10
print(triangle_area(6, 4))      # 12.0</code></pre>
<p>The order of the arguments matters: the first argument goes into the first parameter.</p>

<h3>Default values</h3>
<pre><code>def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Ali")                     # Hello, Ali!
greet("Ali", "Good morning")     # Good morning, Ali!</code></pre>
<p>Parameters with a default value have to come at the end of the list.</p>

<h3>Named arguments</h3>
<pre><code>def details(name, age, city):
    print(f"{name}, {age} years old, {city}")

details(age=20, city="Guliston", name="Ali")</code></pre>
<p>When arguments are passed by name the order stops mattering, and the code reads more easily.</p>

<h3>Returning several values</h3>
<pre><code>def largest_smallest(numbers):
    return max(numbers), min(numbers)

largest, smallest = largest_smallest([4, 9, 1, 7])
print(largest, smallest)     # 9 1</code></pre>
<p>The function actually returns a single tuple, and we unpack it into two variables.</p>

<h3>Local and global variables</h3>
<pre><code>def calculate():
    x = 10        # local — it lives only inside the function
    print(x)

calculate()
print(x)          # NameError!</code></pre>
<p>A variable created inside a function does not exist outside it. This is a good property: functions do not interfere with each other's work.</p>

<h3>The documentation string (docstring)</h3>
<pre><code>def square(x):
    """Returns the square of a number."""
    return x * x

print(square.__doc__)</code></pre>
<p>The triple-quoted text at the start of a function explains what it does. This is a simple but valuable habit of professional coding.</p>

<h3>What makes a good function?</h3>
<ul>
  <li>It does one clear job</li>
  <li>Its name says what that job is: <code>calculate_average</code>, <code>is_odd</code></li>
  <li>It takes the data it needs through parameters and gives the result back with <code>return</code></li>
  <li>It is usually no longer than 20 lines</li>
</ul>

<h3>Summary</h3>
<ul>
  <li><code>def name(parameters):</code> creates a function, <code>name()</code> calls it</li>
  <li><code>return</code> hands back a value and ends the function</li>
  <li>Variables inside a function are local</li>
  <li>If you see repeating code — it wants to be pulled out into a function</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    -- KAA --------------------------------------------------------
    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Kodtı qaytalamaw</h2>
<p>Programma ósken sayın bir qıylı kod bólekleri qayta-qayta ushırasadı. Olardı hár sapar nusqalaw eki máseleni tuwdıradı: fayl uzayadı hám qátelik tabılǵanda onı <b>hámme nusqada</b> dúzetiw kerek boladı. <b>Funkciya</b> — kodtıń at berilgen, kerek bolǵanda shaqırılatuǵın bólegi.</p>

<h3>Funkciya jaratıw</h3>
<pre><code>def sálemlesiw():
    print("Ássalawma áleykum!")

sálemlesiw()
sálemlesiw()</code></pre>
<p><code>def</code> — funkciya járiyalaw gilt sózi. Odan keyin at, qawsıralar hám eki noqat keledi. Funkciya denesi shegindiriledi.</p>
<p>Áhmiyetli: <code>def</code> qatarı funkciyanı tek <b>jaratadı</b>, isletpeydi. Kod orınlanıwı ushın onı <b>shaqırıw</b> kerek: <code>sálemlesiw()</code>.</p>

<h3>Parametr hám argument</h3>
<pre><code>def sálemlesiw(at):
    print(f"Sálem, {at}!")

sálemlesiw("Ali")
sálemlesiw("Dilnoza")</code></pre>
<p><code>at</code> — <b>parametr</b> (funkciya járiyalawındaǵı at). <code>"Ali"</code> — <b>argument</b> (shaqırıwda berilgen haqıyqıy mánis).</p>

<h3>return — nátiyje qaytarıw</h3>
<pre><code>def kvadrat(x):
    return x * x

nátiyje = kvadrat(5)
print(nátiyje)          # 25
print(kvadrat(3) + kvadrat(4))  # 25</code></pre>
<p><code>print()</code> hám <code>return</code> di shatastırmań:</p>
<ul>
  <li><code>print()</code> — ekranǵa shıǵaradı, nátiyjeni basqa esapta isletiwge bolmaydı</li>
  <li><code>return</code> — mánisti <b>qaytaradı</b>, onı ózgeriwshige saqlaw yamasa basqa ańlatpada isletiw múmkin</li>
</ul>
<p><code>return</code> orınlanıwı menen funkciya derhal juwmaqlanadı — odan keyingi qatarlar islemeydi.</p>

<h3>Birneshe parametr</h3>
<pre><code>def jıyındı(a, b):
    return a + b

def úshmúyeshlik_maydanı(tiykar, biyiklik):
    return tiykar * biyiklik / 2

print(jıyındı(3, 7))                    # 10
print(úshmúyeshlik_maydanı(6, 4))       # 12.0</code></pre>
<p>Argumentler tártibi áhmiyetli: birinshi argument birinshi parametrge túsedi.</p>

<h3>Sukut boyınsha mánisler</h3>
<pre><code>def sálemlesiw(at, sálem="Sálem"):
    print(f"{sálem}, {at}!")

sálemlesiw("Ali")                     # Sálem, Ali!
sálemlesiw("Ali", "Qayırlı tań")      # Qayırlı tań, Ali!</code></pre>
<p>Sukut mánisli parametrler dizim aqırında turıwı kerek.</p>

<h3>Atlı argumentler</h3>
<pre><code>def maǵlıwmat(at, jas, qala):
    print(f"{at}, {jas} jas, {qala}")

maǵlıwmat(jas=20, qala="Gúlistan", at="Ali")</code></pre>
<p>At penen berilgende tártip áhmiyetsiz boladı hám kod oqıwlıraq kórinedi.</p>

<h3>Birneshe mánis qaytarıw</h3>
<pre><code>def eń_úlken_kishi(sanlar):
    return max(sanlar), min(sanlar)

úlken, kishi = eń_úlken_kishi([4, 9, 1, 7])
print(úlken, kishi)     # 9 1</code></pre>
<p>Ámelde funkciya bir tuple qaytaradı, biz onı eki ózgeriwshige ajıratıp alamız.</p>

<h3>Lokal hám global ózgeriwshi</h3>
<pre><code>def esapla():
    x = 10        # lokal — tek funkciya ishinde jasaydı
    print(x)

esapla()
print(x)          # NameError!</code></pre>
<p>Funkciya ishinde jaratılǵan ózgeriwshi sırtta joq. Bul jaqsı qásiyet: funkciyalar bir-biriniń jumısına aralaspaydı.</p>

<h3>Hújjetlew qatarı (docstring)</h3>
<pre><code>def kvadrat(x):
    """Sannıń kvadratın qaytaradı."""
    return x * x

print(kvadrat.__doc__)</code></pre>
<p>Funkciya basındaǵı úsh tırnaqlı tekst onıń ne isleytuǵının túsindiredi. Bul — professional kod jazıwdıń ápiwayı, biraq qımbatlı ádeti.</p>

<h3>Jaqsı funkciya qanday boladı?</h3>
<ul>
  <li>Bir anıq wazıypanı orınlaydı</li>
  <li>Atı sol wazıypanı aytıp turadı: <code>ortasha_esapla</code>, <code>taq_pa</code></li>
  <li>Kerekli maǵlıwmattı parametr arqalı aladı, nátiyjeni <code>return</code> penen beredi</li>
  <li>Ádette 20 qatardan aspaydı</li>
</ul>

<h3>Juwmaq</h3>
<ul>
  <li><code>def at(parametrler):</code> funkciyanı jaratadı, <code>at()</code> onı shaqıradı</li>
  <li><code>return</code> mánis qaytaradı hám funkciyanı juwmaqlaydı</li>
  <li>Funkciya ishindegi ózgeriwshiler lokal</li>
  <li>Qaytalanıp atırǵan kodtı kórseńiz — ol funkciyaǵa shıǵarılıwı kerek</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

END $$;
