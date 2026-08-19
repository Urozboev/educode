-- ============================================================
-- EduCode — Amaliyot mashg'ulotlari tarjimasi: 1-3
--   topics.content_html -> ru, en, kaa
--
--   amaliy-1-sintaksis  — input/print, split, sep/end, chekinish
--   amaliy-2-xatoliklar — xato turlari, try/except, tekshirish
--   amaliy-3-sikllar    — range, yig'indi/ko'paytma, ichma-ich sikl
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
BEGIN

  -- ============================================================
  -- amaliy-1-sintaksis
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'amaliy-1-sintaksis' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель занятия</h2>
<p>Закрепить на практике устройство программы: получение данных через <code>input()</code>, вывод через <code>print()</code>, соблюдение правила отступов и правильное преобразование типов.</p>

<h3>Пример 1. Получение и вывод данных</h3>
<pre><code>imya = input()
vozrast = int(input())
print(f"{imya} — {vozrast} лет")</code></pre>
<p>Здесь два важных момента: <code>input()</code> возвращает текст, поэтому возраст преобразован через <code>int()</code>; а результат собран через f-string.</p>

<h3>Пример 2. Несколько значений в одной строке</h3>
<pre><code>a, b = input().split()
print(b, a)</code></pre>
<p><code>split()</code> разбивает строку на части по пробелам. Если нужны числа:</p>
<pre><code>a, b = map(int, input().split())
print(a + b)</code></pre>

<h3>Пример 3. Управление видом вывода через sep и end</h3>
<pre><code>print(2026, 7, 28, sep="-")     # 2026-7-28
print("Загрузка", end="")
print("...")                     # Загрузка...</code></pre>

<h3>Пример 4. Ошибка отступа</h3>
<pre><code># ОШИБКА
if 5 &gt; 3:
print("привет")     # IndentationError

# ВЕРНО
if 5 &gt; 3:
    print("привет")</code></pre>

<h3>Порядок работы</h3>
<ol>
  <li>Каждый пример напишите сами, не копируйте</li>
  <li>Намеренно сломайте пример и прочитайте выданную ошибку</li>
  <li>Выполните задания ниже</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of this session</h2>
<p>To settle the shape of a program in practice: taking data in with <code>input()</code>, putting it out with <code>print()</code>, keeping to the indentation rule, and converting types correctly.</p>

<h3>Example 1. Taking data in and putting it out</h3>
<pre><code>name = input()
age = int(input())
print(f"{name} — {age} years old")</code></pre>
<p>There are two important points here: <code>input()</code> returns text, so the age was converted with <code>int()</code>; and the result was put together with an f-string.</p>

<h3>Example 2. Several values on one line</h3>
<pre><code>a, b = input().split()
print(b, a)</code></pre>
<p><code>split()</code> breaks the line into pieces at the spaces. If you need numbers:</p>
<pre><code>a, b = map(int, input().split())
print(a + b)</code></pre>

<h3>Example 3. Shaping the output with sep and end</h3>
<pre><code>print(2026, 7, 28, sep="-")     # 2026-7-28
print("Loading", end="")
print("...")                     # Loading...</code></pre>

<h3>Example 4. An indentation error</h3>
<pre><code># WRONG
if 5 &gt; 3:
print("hello")      # IndentationError

# RIGHT
if 5 &gt; 3:
    print("hello")</code></pre>

<h3>How to work</h3>
<ol>
  <li>Type every example out yourself, do not copy it</li>
  <li>Break the example on purpose and read the error it gives</li>
  <li>Do the tasks below</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Shınıǵıw maqseti</h2>
<p>Programma dúzilisin ámelde bekkemlew: <code>input()</code> penen maǵlıwmat alıw, <code>print()</code> penen shıǵarıw, sheginiw qaǵıydasına ámel etiw hám túrlerdi durıs aylandırıw.</p>

<h3>Úlgi 1. Maǵlıwmat alıw hám shıǵarıw</h3>
<pre><code>at = input()
jas = int(input())
print(f"{at} — {jas} jasta")</code></pre>
<p>Bul jerde eki áhmiyetli noqat bar: <code>input()</code> tekst qaytaradı, sonlıqtan jas <code>int()</code> penen aylandırıldı; nátiyje bolsa f-string arqalı biriktirildi.</p>

<h3>Úlgi 2. Bir qatardaǵı birneshe mánis</h3>
<pre><code>a, b = input().split()
print(b, a)</code></pre>
<p><code>split()</code> qatardı bosluqlar boyınsha bóleklerge ajıratadı. Sanlar kerek bolsa:</p>
<pre><code>a, b = map(int, input().split())
print(a + b)</code></pre>

<h3>Úlgi 3. sep hám end penen shıǵarıw formasın basqarıw</h3>
<pre><code>print(2026, 7, 28, sep="-")     # 2026-7-28
print("Júklenbekte", end="")
print("...")                     # Júklenbekte...</code></pre>

<h3>Úlgi 4. Sheginiw qátesi</h3>
<pre><code># QÁTE
if 5 &gt; 3:
print("sálem")      # IndentationError

# DURÍS
if 5 &gt; 3:
    print("sálem")</code></pre>

<h3>Jumıs tártibi</h3>
<ol>
  <li>Hár bir úlgini ózińiz jazıp shıǵıń, kóshirip qoymań</li>
  <li>Úlgini atayı buzıp kóriń hám shıqqan qátelikti oqıń</li>
  <li>Tómendegi tapsırmalardı orınlań</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- amaliy-2-xatoliklar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'amaliy-2-xatoliklar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель занятия</h2>
<p>Потренироваться читать сообщение об ошибке, определять её тип и находить причину.</p>

<h3>Типы ошибок вкратце</h3>
<table>
  <tr><th>Ошибка</th><th>Причина</th></tr>
  <tr><td><code>SyntaxError</code></td><td>Нарушено грамматическое правило: не хватает двоеточия, скобки, кавычки</td></tr>
  <tr><td><code>IndentationError</code></td><td>Неверный отступ</td></tr>
  <tr><td><code>NameError</code></td><td>Имя не определено или написано с ошибкой</td></tr>
  <tr><td><code>TypeError</code></td><td>Типы не совпадают: текст + число</td></tr>
  <tr><td><code>ValueError</code></td><td>Тип верный, значение неверное: <code>int("abc")</code></td></tr>
  <tr><td><code>ZeroDivisionError</code></td><td>Деление на ноль</td></tr>
  <tr><td><code>IndexError</code></td><td>Индекса нет в списке</td></tr>
  <tr><td><code>KeyError</code></td><td>Ключа нет в словаре</td></tr>
</table>

<h3>Пример 1. Найти ошибку</h3>
<pre><code>chislo = input()
print(chislo * 2)</code></pre>
<p>Ошибки не будет, но при вводе <code>5</code> выйдет <code>55</code> — текст повторился дважды. Это <b>логическая ошибка</b>. Правильно: <code>chislo = int(input())</code>.</p>

<h3>Пример 2. Перехват ошибки</h3>
<pre><code>try:
    chislo = int(input())
    print(100 / chislo)
except ValueError:
    print("Введите число")
except ZeroDivisionError:
    print("На ноль делить нельзя")</code></pre>
<p>Если код внутри <code>try</code> даёт ошибку, программа не останавливается — срабатывает подходящий блок <code>except</code>.</p>

<h3>Пример 3. Проверка через print()</h3>
<pre><code>a = int(input())
b = int(input())
print("a =", a, "b =", b)   # для проверки
print((a + b) / 2)</code></pre>
<p>Если результат вышел не таким, как ожидалось, сначала выведите входные значения — половина ошибок находится именно здесь.</p>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of this session</h2>
<p>To practise reading an error message, working out its type and finding its cause.</p>

<h3>The error types in brief</h3>
<table>
  <tr><th>Error</th><th>Cause</th></tr>
  <tr><td><code>SyntaxError</code></td><td>A grammar rule was broken: a colon, bracket or quote is missing</td></tr>
  <tr><td><code>IndentationError</code></td><td>The indentation is wrong</td></tr>
  <tr><td><code>NameError</code></td><td>The name is undefined or misspelt</td></tr>
  <tr><td><code>TypeError</code></td><td>The types do not match: text + number</td></tr>
  <tr><td><code>ValueError</code></td><td>The type is right, the value is wrong: <code>int("abc")</code></td></tr>
  <tr><td><code>ZeroDivisionError</code></td><td>Division by zero</td></tr>
  <tr><td><code>IndexError</code></td><td>The index is not in the list</td></tr>
  <tr><td><code>KeyError</code></td><td>The key is not in the dictionary</td></tr>
</table>

<h3>Example 1. Find the mistake</h3>
<pre><code>number = input()
print(number * 2)</code></pre>
<p>No error appears, but entering <code>5</code> gives <code>55</code> — the text was repeated twice. This is a <b>logical error</b>. The right version: <code>number = int(input())</code>.</p>

<h3>Example 2. Catching an error</h3>
<pre><code>try:
    number = int(input())
    print(100 / number)
except ValueError:
    print("Enter a number")
except ZeroDivisionError:
    print("You cannot divide by zero")</code></pre>
<p>If the code inside <code>try</code> raises an error, the program does not stop — the matching <code>except</code> block runs.</p>

<h3>Example 3. Checking with print()</h3>
<pre><code>a = int(input())
b = int(input())
print("a =", a, "b =", b)   # for checking
print((a + b) / 2)</code></pre>
<p>If the result is not what you expected, print the input values first — half of all mistakes are found right there.</p>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Shınıǵıw maqseti</h2>
<p>Qátelik xabarın oqıwdı, qátelik túrin anıqlawdı hám sebebin tabıwdı shınıǵıw.</p>

<h3>Qátelik túrleri qısqasha</h3>
<table>
  <tr><th>Qátelik</th><th>Sebebi</th></tr>
  <tr><td><code>SyntaxError</code></td><td>Grammatikalıq qaǵıyda buzılǵan: eki noqat, qawsıra, tırnaq jetispeydi</td></tr>
  <tr><td><code>IndentationError</code></td><td>Sheginiw nadurıs</td></tr>
  <tr><td><code>NameError</code></td><td>At anıqlanbaǵan yamasa qáte jazılǵan</td></tr>
  <tr><td><code>TypeError</code></td><td>Túrler sáykes emes: tekst + san</td></tr>
  <tr><td><code>ValueError</code></td><td>Túr durıs, mánis nadurıs: <code>int("abc")</code></td></tr>
  <tr><td><code>ZeroDivisionError</code></td><td>Nolge bóliw</td></tr>
  <tr><td><code>IndexError</code></td><td>Dizimde joq indeks</td></tr>
  <tr><td><code>KeyError</code></td><td>Sózlikte joq gilt</td></tr>
</table>

<h3>Úlgi 1. Qátelikti tabıw</h3>
<pre><code>san = input()
print(san * 2)</code></pre>
<p>Qátelik shıqpaydı, biraq <code>5</code> kirgizilse <code>55</code> shıǵadı — tekst eki ret qaytalandı. Bul <b>mantıqlıq qátelik</b>. Durısı: <code>san = int(input())</code>.</p>

<h3>Úlgi 2. Qátelikti uslap qalıw</h3>
<pre><code>try:
    san = int(input())
    print(100 / san)
except ValueError:
    print("San kirgiziń")
except ZeroDivisionError:
    print("Nolge bólip bolmaydı")</code></pre>
<p><code>try</code> ishindegi kod qátelik berse, programma toqtamaydı — sáykes <code>except</code> bloki isleydi.</p>

<h3>Úlgi 3. print() penen tekseriw</h3>
<pre><code>a = int(input())
b = int(input())
print("a =", a, "b =", b)   # tekseriw ushın
print((a + b) / 2)</code></pre>
<p>Nátiyje kútilgenindey shıqpasa, aldın kiris mánislerin shıǵarıp kóriń — qáteliktiń yarımı sol jerde tabıladı.</p>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- amaliy-3-sikllar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'amaliy-3-sikllar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель занятия</h2>
<p>Сравнить оба вида циклов на практике и почувствовать, в какой задаче какой из них удобнее.</p>

<h3>Пример 1. Три вида range()</h3>
<pre><code>for i in range(5):        # 0 1 2 3 4
    print(i, end=" ")
print()

for i in range(1, 6):     # 1 2 3 4 5
    print(i, end=" ")
print()

for i in range(10, 0, -2):# 10 8 6 4 2
    print(i, end=" ")</code></pre>
<p>Третий аргумент — шаг. Отрицательный шаг даёт обратный отсчёт.</p>

<h3>Пример 2. Сумма и произведение</h3>
<pre><code>itogo = 0
for i in range(1, 101):
    itogo += i
print(itogo)          # 5050

proizvedenie = 1
for i in range(1, 6):
    proizvedenie *= i
print(proizvedenie)   # 120 (5!)</code></pre>
<p>Внимание: сумма начинается с <code>0</code>, а произведение — с <code>1</code>.</p>

<h3>Пример 3. Одна задача — два решения</h3>
<pre><code># через for
for i in range(1, 6):
    print(i)

# через while
i = 1
while i &lt;= 5:
    print(i)
    i += 1</code></pre>
<p>Поскольку число повторов известно, здесь удобнее <code>for</code> — в <code>while</code> счётчиком приходится управлять вручную, а забыть об этом значит получить бесконечный цикл.</p>

<h3>Пример 4. Вложенный цикл</h3>
<pre><code>for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}x{j}={i*j}", end="  ")
    print()</code></pre>
<p>За один оборот внешнего цикла внутренний прокручивается целиком.</p>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of this session</h2>
<p>To compare both kinds of loop in practice and get a feel for which one suits which problem.</p>

<h3>Example 1. The three forms of range()</h3>
<pre><code>for i in range(5):        # 0 1 2 3 4
    print(i, end=" ")
print()

for i in range(1, 6):     # 1 2 3 4 5
    print(i, end=" ")
print()

for i in range(10, 0, -2):# 10 8 6 4 2
    print(i, end=" ")</code></pre>
<p>The third argument is the step. A negative step counts backwards.</p>

<h3>Example 2. A total and a product</h3>
<pre><code>total = 0
for i in range(1, 101):
    total += i
print(total)          # 5050

product = 1
for i in range(1, 6):
    product *= i
print(product)        # 120 (5!)</code></pre>
<p>Note: a total starts from <code>0</code>, a product from <code>1</code>.</p>

<h3>Example 3. One problem — two solutions</h3>
<pre><code># with for
for i in range(1, 6):
    print(i)

# with while
i = 1
while i &lt;= 5:
    print(i)
    i += 1</code></pre>
<p>Because the number of repetitions is known, <code>for</code> is handier here — with <code>while</code> the counter has to be managed by hand, and forgetting it leads to an endless loop.</p>

<h3>Example 4. A nested loop</h3>
<pre><code>for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}x{j}={i*j}", end="  ")
    print()</code></pre>
<p>For one turn of the outer loop, the inner loop runs all the way through.</p>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Shınıǵıw maqseti</h2>
<p>Eki cikl túrin ámelde salıstırıw hám qaysı máselede qaysısı qolaylıraq ekenin sezip alıw.</p>

<h3>Úlgi 1. range() diń úsh kórinisi</h3>
<pre><code>for i in range(5):        # 0 1 2 3 4
    print(i, end=" ")
print()

for i in range(1, 6):     # 1 2 3 4 5
    print(i, end=" ")
print()

for i in range(10, 0, -2):# 10 8 6 4 2
    print(i, end=" ")</code></pre>
<p>Úshinshi argument — qádem. Teris qádem keri sanawdı beredi.</p>

<h3>Úlgi 2. Jıyındı hám kóbeytpe</h3>
<pre><code>jámi = 0
for i in range(1, 101):
    jámi += i
print(jámi)          # 5050

kóbeytpe = 1
for i in range(1, 6):
    kóbeytpe *= i
print(kóbeytpe)      # 120 (5!)</code></pre>
<p>Itibar beriń: jıyındı <code>0</code> den, kóbeytpe bolsa <code>1</code> den baslanadı.</p>

<h3>Úlgi 3. Bir qıylı másele — eki sheshim</h3>
<pre><code># for menen
for i in range(1, 6):
    print(i)

# while menen
i = 1
while i &lt;= 5:
    print(i)
    i += 1</code></pre>
<p>Qaytalaw sanı belgili bolǵanlıqtan bul jerde <code>for</code> qolaylıraq — <code>while</code> de esaplaǵıshtı qol menen basqarıw kerek hám onı umıtıw sheksiz ciklge alıp keledi.</p>

<h3>Úlgi 4. Ishpe-ish cikl</h3>
<pre><code>for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}x{j}={i*j}", end="  ")
    print()</code></pre>
<p>Sırtqı cikl bir ret aylanǵanda, ishki cikl tolıq aylanıp shıǵadı.</p>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

END $$;
