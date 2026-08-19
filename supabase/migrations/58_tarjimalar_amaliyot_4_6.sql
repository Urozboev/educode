-- ============================================================
-- EduCode — Amaliyot mashg'ulotlari tarjimasi: 4-6
--   topics.content_html -> ru, en, kaa
--
--   amaliy-4-shartlar    — ko'p tarmoqli shartlar, chegaraviy holat
--   amaliy-5-while       — to'xtatuvchi belgi, raqamlar, Fibonachchi
--   amaliy-6-funksiyalar — return, funksiyalar birgalikda
--
-- Shu migratsiya bilan 6 ta amaliyot matni to'liq tarjima qilindi.
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
BEGIN

  -- ============================================================
  -- amaliy-4-shartlar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'amaliy-4-shartlar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель занятия</h2>
<p>Научиться правильно строить задачи с многими ветвями, применять на практике порядок условий и логические операторы.</p>

<h3>Пример 1. Наибольшее из трёх чисел</h3>
<pre><code>a, b, c = map(int, input().split())

if a &gt;= b and a &gt;= c:
    print(a)
elif b &gt;= a and b &gt;= c:
    print(b)
else:
    print(c)</code></pre>
<p>Есть и более короткий путь: <code>print(max(a, b, c))</code>. Но для тренировки в составлении условий полезен первый вариант.</p>

<h3>Пример 2. Определение четверти</h3>
<pre><code>x, y = map(int, input().split())

if x == 0 or y == 0:
    print("На оси")
elif x &gt; 0 and y &gt; 0:
    print("I четверть")
elif x &lt; 0 and y &gt; 0:
    print("II четверть")
elif x &lt; 0 and y &lt; 0:
    print("III четверть")
else:
    print("IV четверть")</code></pre>
<p>Важно: граничный случай (лежит на оси) проверяется <b>первым</b>, иначе он попадёт в другие условия.</p>

<h3>Пример 3. Високосный год</h3>
<pre><code>god = int(input())
if god % 4 == 0 and (god % 100 != 0 or god % 400 == 0):
    print("Високосный")
else:
    print("Не високосный")</code></pre>
<p>Скобки обязательны — без них порядок <code>and</code> и <code>or</code> искажает результат.</p>

<h3>Как избежать ошибок</h3>
<ul>
  <li>Пишите условия в порядке <b>от строгого к мягкому</b></li>
  <li>Используйте <code>==</code>, а не <code>=</code></li>
  <li>Отдельно проверьте граничные значения: 0, наименьшее и наибольшее допустимое</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of this session</h2>
<p>To build many-branched problems correctly, and to apply the order of conditions and the logical operators in practice.</p>

<h3>Example 1. The largest of three numbers</h3>
<pre><code>a, b, c = map(int, input().split())

if a &gt;= b and a &gt;= c:
    print(a)
elif b &gt;= a and b &gt;= c:
    print(b)
else:
    print(c)</code></pre>
<p>There is a shorter way too: <code>print(max(a, b, c))</code>. But the first version is useful for practising how conditions are built.</p>

<h3>Example 2. Working out the quadrant</h3>
<pre><code>x, y = map(int, input().split())

if x == 0 or y == 0:
    print("On an axis")
elif x &gt; 0 and y &gt; 0:
    print("Quadrant I")
elif x &lt; 0 and y &gt; 0:
    print("Quadrant II")
elif x &lt; 0 and y &lt; 0:
    print("Quadrant III")
else:
    print("Quadrant IV")</code></pre>
<p>Important: the boundary case (lying on an axis) is checked <b>first</b>, otherwise it would fall into the other conditions.</p>

<h3>Example 3. Leap years</h3>
<pre><code>year = int(input())
if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
    print("Leap year")
else:
    print("Not a leap year")</code></pre>
<p>The brackets are required — without them the order of <code>and</code> and <code>or</code> spoils the result.</p>

<h3>Avoiding mistakes</h3>
<ul>
  <li>Write the conditions in order <b>from the strictest to the loosest</b></li>
  <li>Use <code>==</code>, not <code>=</code></li>
  <li>Test the boundary values separately: 0, and the smallest and largest allowed value</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Shınıǵıw maqseti</h2>
<p>Kóp tarmaqlı máselelerdi durıs dúziw, shártler tártibin hám mantıqlıq operatorlardı ámelde qollaw.</p>

<h3>Úlgi 1. Úsh sannan eń úlkeni</h3>
<pre><code>a, b, c = map(int, input().split())

if a &gt;= b and a &gt;= c:
    print(a)
elif b &gt;= a and b &gt;= c:
    print(b)
else:
    print(c)</code></pre>
<p>Qısqaraq jol da bar: <code>print(max(a, b, c))</code>. Biraq shárt dúziwdi shınıǵıw ushın birinshi variant paydalı.</p>

<h3>Úlgi 2. Sherekti anıqlaw</h3>
<pre><code>x, y = map(int, input().split())

if x == 0 or y == 0:
    print("Kósherde")
elif x &gt; 0 and y &gt; 0:
    print("I sherek")
elif x &lt; 0 and y &gt; 0:
    print("II sherek")
elif x &lt; 0 and y &lt; 0:
    print("III sherek")
else:
    print("IV sherek")</code></pre>
<p>Áhmiyetli: shegaralıq jaǵday (kósherde jatıw) <b>birinshi</b> tekseriledi, bolmasa ol basqa shártlerge túsip ketedi.</p>

<h3>Úlgi 3. Kábisa jıl</h3>
<pre><code>jıl = int(input())
if jıl % 4 == 0 and (jıl % 100 != 0 or jıl % 400 == 0):
    print("Kábisa")
else:
    print("Kábisa emes")</code></pre>
<p>Qawsıra shárt — onsız <code>and</code> hám <code>or</code> tártibi nátiyjeni buzadı.</p>

<h3>Qáteliklerden saqlanıw</h3>
<ul>
  <li>Shártlerdi <b>qatańnan jumsaqqa</b> tártipte jazıń</li>
  <li><code>=</code> emes, <code>==</code> isletiń</li>
  <li>Shegaralıq mánislerdi ayrıqsha sınap kóriń: 0, eń kishi hám eń úlken ruqsat etilgen mánis</li>
</ul>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- amaliy-5-while
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'amaliy-5-while' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель занятия</h2>
<p>Решать задачи, в которых число повторов заранее неизвестно: признак остановки, счётчик, работа с цифрами.</p>

<h3>Пример 1. Чтение до признака остановки</h3>
<pre><code>kolichestvo = 0
chislo = int(input())
while chislo != -1:
    kolichestvo += 1
    chislo = int(input())
print(kolichestvo)</code></pre>
<p>Здесь <code>-1</code> — признак остановки. В подсчёт он не входит.</p>

<h3>Пример 2. Работа с цифрами</h3>
<pre><code>chislo = int(input())
kolichestvo = 0
while chislo &gt; 0:
    chislo //= 10
    kolichestvo += 1
print(kolichestvo)   # количество цифр</code></pre>
<p>На каждом шаге число уменьшается в 10 раз. Для 472: 472 → 47 → 4 → 0, то есть 3 цифры.</p>

<h3>Пример 3. Числа Фибоначчи</h3>
<pre><code>n = int(input())
a, b = 0, 1
while a &lt;= n:
    print(a, end=" ")
    a, b = b, a + b</code></pre>
<p><code>a, b = b, a + b</code> — оба значения обновляются <b>одновременно</b>. Если написать их порознь, результат испортится.</p>

<h3>Пример 4. Выход через break</h3>
<pre><code>while True:
    chislo = int(input())
    if chislo &lt; 0:
        break
    print(chislo * chislo)</code></pre>

<h3>Как уберечься от бесконечного цикла</h3>
<ol>
  <li>Меняется ли внутри цикла переменная, участвующая в условии?</li>
  <li><b>Приближает</b> ли это изменение условие ко лжи?</li>
  <li>Есть ли внутри <code>while True</code> путь к <code>break</code>?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of this session</h2>
<p>To solve problems where the number of repetitions is not known in advance: stopping markers, counters and working with digits.</p>

<h3>Example 1. Reading up to a stopping marker</h3>
<pre><code>count = 0
number = int(input())
while number != -1:
    count += 1
    number = int(input())
print(count)</code></pre>
<p>Here <code>-1</code> is the stopping marker. It is not included in the count.</p>

<h3>Example 2. Working with digits</h3>
<pre><code>number = int(input())
count = 0
while number &gt; 0:
    number //= 10
    count += 1
print(count)         # the number of digits</code></pre>
<p>At each step the number gets ten times smaller. For 472: 472 → 47 → 4 → 0, that is, 3 digits.</p>

<h3>Example 3. The Fibonacci numbers</h3>
<pre><code>n = int(input())
a, b = 0, 1
while a &lt;= n:
    print(a, end=" ")
    a, b = b, a + b</code></pre>
<p><code>a, b = b, a + b</code> — both values are updated <b>at the same time</b>. Written separately, the result is spoiled.</p>

<h3>Example 4. Leaving with break</h3>
<pre><code>while True:
    number = int(input())
    if number &lt; 0:
        break
    print(number * number)</code></pre>

<h3>How to keep clear of an endless loop</h3>
<ol>
  <li>Does the variable in the condition change inside the loop?</li>
  <li>Does that change <b>bring</b> the condition closer to being false?</li>
  <li>Inside a <code>while True</code>, is there a path to a <code>break</code>?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Shınıǵıw maqseti</h2>
<p>Qaytalaw sanı aldınnan belgisiz bolǵan máselelerdi sheshiw: toqtatıwshı belgi, esaplaǵısh, sanlar menen islew.</p>

<h3>Úlgi 1. Toqtatıwshı belgige shekem oqıw</h3>
<pre><code>sanı = 0
san = int(input())
while san != -1:
    sanı += 1
    san = int(input())
print(sanı)</code></pre>
<p>Bul jerde <code>-1</code> — toqtatıwshı belgi. Ol esapqa kirmeydi.</p>

<h3>Úlgi 2. Sanlar menen islew</h3>
<pre><code>san = int(input())
sanı = 0
while san &gt; 0:
    san //= 10
    sanı += 1
print(sanı)          # raqamlar sanı</code></pre>
<p>Hár qádemde san 10 ret kishireyedi. 472 ushın: 472 → 47 → 4 → 0, yaǵnıy 3 raqam.</p>

<h3>Úlgi 3. Fibonachchi sanları</h3>
<pre><code>n = int(input())
a, b = 0, 1
while a &lt;= n:
    print(a, end=" ")
    a, b = b, a + b</code></pre>
<p><code>a, b = b, a + b</code> — eki mánis te <b>bir waqıtta</b> jańalanadı. Ayrıqsha jazılsa nátiyje buzıladı.</p>

<h3>Úlgi 4. break penen shıǵıw</h3>
<pre><code>while True:
    san = int(input())
    if san &lt; 0:
        break
    print(san * san)</code></pre>

<h3>Sheksiz cikldan qalay saqlanıw kerek</h3>
<ol>
  <li>Shártte qatnasatuǵın ózgeriwshi cikl ishinde ózgerip atır ma?</li>
  <li>Ózgeris shártti jalǵanǵa <b>jaqınlastırıp atır ma</b>?</li>
  <li><code>while True</code> ishinde <code>break</code> ke jol bar ma?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- amaliy-6-funksiyalar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'amaliy-6-funksiyalar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель занятия</h2>
<p>Научиться решать задачу, разбивая её на самостоятельные функции, и правильно пользоваться <code>return</code>.</p>

<h3>Пример 1. Функция — код многоразового пользования</h3>
<pre><code>def nechetnoe(n):
    return n % 2 == 1

for chislo in [3, 8, 11]:
    if nechetnoe(chislo):
        print(chislo, "нечётное")</code></pre>
<p>Результат сравнения уже и есть <code>True</code> или <code>False</code>, поэтому писать <code>if ... return True else return False</code> излишне.</p>

<h3>Пример 2. Несколько функций вместе</h3>
<pre><code>def kvadrat(x):
    return x * x

def summa_kvadratov(chisla):
    itogo = 0
    for s in chisla:
        itogo += kvadrat(s)
    return itogo

print(summa_kvadratov([1, 2, 3]))   # 14</code></pre>
<p>Функция может вызывать другую функцию — именно так большая задача делится на небольшие части.</p>

<h3>Пример 3. Значение по умолчанию и именованный аргумент</h3>
<pre><code>def privetstvie(imya, privet="Привет"):
    return f"{privet}, {imya}!"

print(privetstvie("Али"))
print(privetstvie("Али", privet="Добрый день"))</code></pre>

<h3>Пример 4. Возврат двух значений</h3>
<pre><code>def delenie_ostatok(a, b):
    return a // b, a % b

tseloe, ostatok = delenie_ostatok(17, 5)
print(tseloe, ostatok)      # 3 2</code></pre>

<h3>Контрольные вопросы</h3>
<ol>
  <li>Запускает ли сама строка <code>def</code> код?</li>
  <li>Что возвращает функция без <code>return</code>?</li>
  <li>Можно ли обратиться снаружи к переменной внутри функции?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of this session</h2>
<p>To learn to solve a problem by splitting it into independent functions, and to use <code>return</code> correctly.</p>

<h3>Example 1. A function is reusable code</h3>
<pre><code>def is_odd(n):
    return n % 2 == 1

for number in [3, 8, 11]:
    if is_odd(number):
        print(number, "is odd")</code></pre>
<p>The result of a comparison is already <code>True</code> or <code>False</code>, so writing <code>if ... return True else return False</code> is unnecessary.</p>

<h3>Example 2. Several functions working together</h3>
<pre><code>def square(x):
    return x * x

def sum_of_squares(numbers):
    total = 0
    for s in numbers:
        total += square(s)
    return total

print(sum_of_squares([1, 2, 3]))   # 14</code></pre>
<p>A function may call another function — that is exactly how a large problem gets split into small parts.</p>

<h3>Example 3. Default values and named arguments</h3>
<pre><code>def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Ali"))
print(greet("Ali", greeting="Good afternoon"))</code></pre>

<h3>Example 4. Returning two values</h3>
<pre><code>def divide_remainder(a, b):
    return a // b, a % b

whole, remainder = divide_remainder(17, 5)
print(whole, remainder)      # 3 2</code></pre>

<h3>Questions to check yourself</h3>
<ol>
  <li>Does the <code>def</code> line by itself run the code?</li>
  <li>What does a function without a <code>return</code> hand back?</li>
  <li>Can a variable inside a function be reached from outside?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Shınıǵıw maqseti</h2>
<p>Máseleni ǵárezsiz funkciyalarǵa bólip sheshiwdi úyreniw, <code>return</code> di durıs isletiw.</p>

<h3>Úlgi 1. Funkciya — qayta isletiletuǵın kod</h3>
<pre><code>def taq_pa(n):
    return n % 2 == 1

for san in [3, 8, 11]:
    if taq_pa(san):
        print(san, "taq")</code></pre>
<p>Salıstırıw nátiyjesi áldeqashan <code>True</code> yamasa <code>False</code>, sonlıqtan <code>if ... return True else return False</code> jazıw artıqsha.</p>

<h3>Úlgi 2. Birneshe funkciya birgelikte</h3>
<pre><code>def kvadrat(x):
    return x * x

def kvadratlar_jıyındısı(sanlar):
    jámi = 0
    for s in sanlar:
        jámi += kvadrat(s)
    return jámi

print(kvadratlar_jıyındısı([1, 2, 3]))   # 14</code></pre>
<p>Funkciya basqa funkciyanı shaqırıwı múmkin — úlken másele usılayınsha kishi bólimlerge bólinedi.</p>

<h3>Úlgi 3. Sukut mánis hám atlı argument</h3>
<pre><code>def sálemlesiw(at, sálem="Sálem"):
    return f"{sálem}, {at}!"

print(sálemlesiw("Ali"))
print(sálemlesiw("Ali", sálem="Qayırlı kún"))</code></pre>

<h3>Úlgi 4. Eki mánis qaytarıw</h3>
<pre><code>def ból_qaldıq(a, b):
    return a // b, a % b

pútin, qaldıq = ból_qaldıq(17, 5)
print(pútin, qaldıq)      # 3 2</code></pre>

<h3>Baqlaw sorawları</h3>
<ol>
  <li><code>def</code> qatarınıń ózi kodtı iske túsire me?</li>
  <li><code>return</code> siz funkciya ne qaytaradı?</li>
  <li>Funkciya ishindegi ózgeriwshige sırttan múrájat etiwge bola ma?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

END $$;
