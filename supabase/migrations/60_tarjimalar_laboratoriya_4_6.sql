-- ============================================================
-- EduCode — Laboratoriya ishlari tarjimasi: 4-6
--   topics.content_html -> ru, en, kaa
--
--   lab-4-shartlar    — tarmoqlanish, chegaraviy holatlar, sinov
--   lab-5-while       — cheksiz sikldan saqlanish, Evklid algoritmi
--   lab-6-funksiyalar — modulli yondashuv, lokal o'zgaruvchi
--
-- Shu migratsiya bilan BARCHA 24 ta dars matni (12 ma'ruza +
-- 6 amaliyot + 6 laboratoriya) 4 tilda tayyor bo'ladi.
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
BEGIN

  -- ============================================================
  -- lab-4-shartlar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'lab-4-shartlar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель работы</h2>
<p>Составлять разветвляющиеся алгоритмы, верно определять порядок условий и испытывать граничные случаи.</p>

<h3>Теоретическая справка</h3>
<pre><code>if uslovie1:
    # 1-я ветвь
elif uslovie2:
    # 2-я ветвь
else:
    # остальные случаи</code></pre>
<p>Условия проверяются сверху вниз: первое истинное выполняется, остальные пропускаются.</p>
<p>Приоритет логических операций: <code>not</code> → <code>and</code> → <code>or</code>. Смешивая их, ставьте скобки.</p>

<h3>Подбор данных для испытания</h3>
<p>Испытывая разветвляющуюся программу, обязательно проверьте следующее:</p>
<ul>
  <li>Хотя бы одно значение, попадающее в каждую ветвь</li>
  <li>Граничные значения: если условие <code>x &gt;= 60</code>, то 59, 60, 61</li>
  <li>Ноль, отрицательное число, случай равенства</li>
</ul>

<h3>Ход работы</h3>
<ol>
  <li>Напишите программу, выставляющую оценку по баллу, и испытайте её на значениях 59, 60, 69, 70, 89, 90.</li>
  <li>Намеренно переверните порядок условий и понаблюдайте, как испортится результат.</li>
  <li>Проверьте влияние скобок:
    <pre><code>x = 2000
print(x % 4 == 0 and x % 100 != 0 or x % 400 == 0)
print(x % 4 == 0 and (x % 100 != 0 or x % 400 == 0))</code></pre>
    <p>Попробуйте также для 1900.</p>
  </li>
  <li>Выполните задания и для каждого составьте таблицу испытаний.</li>
</ol>

<h3>Контрольные вопросы</h3>
<ol>
  <li>Почему граничный случай проверяется первым?</li>
  <li>Что изменится, если вместо <code>elif</code> написать подряд идущие <code>if</code>?</li>
  <li>Какие значения в Python считаются ложными?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of the work</h2>
<p>To build branching algorithms, set the order of the conditions correctly and test the boundary cases.</p>

<h3>Theory in brief</h3>
<pre><code>if condition1:
    # branch 1
elif condition2:
    # branch 2
else:
    # the remaining cases</code></pre>
<p>The conditions are checked from top to bottom: the first true one runs and the rest are skipped.</p>
<p>The precedence of the logical operations: <code>not</code> → <code>and</code> → <code>or</code>. When mixing them, add brackets.</p>

<h3>Choosing the test data</h3>
<p>When testing a branching program, be sure to check the following:</p>
<ul>
  <li>At least one value falling into each branch</li>
  <li>The boundary values: if the condition is <code>x &gt;= 60</code>, then 59, 60, 61</li>
  <li>Zero, a negative number, the case of equality</li>
</ul>

<h3>Procedure</h3>
<ol>
  <li>Write a program that assigns a grade from a score, and test it on the values 59, 60, 69, 70, 89, 90.</li>
  <li>Reverse the order of the conditions on purpose and watch how the result is spoiled.</li>
  <li>Check the effect of the brackets:
    <pre><code>x = 2000
print(x % 4 == 0 and x % 100 != 0 or x % 400 == 0)
print(x % 4 == 0 and (x % 100 != 0 or x % 400 == 0))</code></pre>
    <p>Try it for 1900 as well.</p>
  </li>
  <li>Do the tasks and draw up a test table for each of them.</li>
</ol>

<h3>Questions to check yourself</h3>
<ol>
  <li>Why is the boundary case checked first?</li>
  <li>What changes if consecutive <code>if</code> statements are written instead of <code>elif</code>?</li>
  <li>Which values count as false in Python?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Jumıstıń maqseti</h2>
<p>Tarmaqlanıwshı algoritmlerdi dúziw, shártler tártibin durıs belgilew hám shegaralıq jaǵdaylardı sınaw.</p>

<h3>Teoriyalıq eskertpe</h3>
<pre><code>if shárt1:
    # 1-tarmaq
elif shárt2:
    # 2-tarmaq
else:
    # qalǵan jaǵdaylar</code></pre>
<p>Shártler joqarıdan tómenge tekseriledi, birinshi shın tabılǵanı orınlanıp, qalǵanları taslap ketiledi.</p>
<p>Mantıqlıq ámeller ústinligi: <code>not</code> → <code>and</code> → <code>or</code>. Aralastırǵanda qawsıra qoyıń.</p>

<h3>Sınaw maǵlıwmatların saylaw</h3>
<p>Tarmaqlanıwshı programmanı sınawda tómendegilerdi sózsiz tekseriń:</p>
<ul>
  <li>Hár bir tarmaqqa túsetuǵın keminde bir mánis</li>
  <li>Shegaralıq mánisler: shárt <code>x &gt;= 60</code> bolsa — 59, 60, 61</li>
  <li>Nol, teris san, teńlik jaǵdayı</li>
</ul>

<h3>Jumıs tártibi</h3>
<ol>
  <li>Ball boyınsha baha qoyatuǵın programmanı jazıń hám 59, 60, 69, 70, 89, 90 mánislerinde sınań.</li>
  <li>Shártler tártibin atayı keri qılıp, nátiyjeniń qalay buzılatuǵının baqlań.</li>
  <li>Qawsıra tásirin tekseriń:
    <pre><code>x = 2000
print(x % 4 == 0 and x % 100 != 0 or x % 400 == 0)
print(x % 4 == 0 and (x % 100 != 0 or x % 400 == 0))</code></pre>
    <p>1900 ushın da sınap kóriń.</p>
  </li>
  <li>Tapsırmalardı orınlań hám hár biri ushın sınaw kestesin dúziń.</li>
</ol>

<h3>Baqlaw sorawları</h3>
<ol>
  <li>Ne ushın shegaralıq jaǵday birinshi tekseriledi?</li>
  <li><code>elif</code> ornına izbe-iz <code>if</code> jazılsa ne ózgeredi?</li>
  <li>Pythonda qaysı mánisler jalǵan esaplanadı?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- lab-5-while
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'lab-5-while' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель работы</h2>
<p>Составлять алгоритмы, в которых число повторов заранее неизвестно, и освоить способы уберечься от бесконечного цикла.</p>

<h3>Теоретическая справка</h3>
<pre><code>nachalnoe_znachenie
while uslovie:
    telo
    izmenenie, vliyayushchee na uslovie</code></pre>
<p>Все три части обязательны. Забыли третью — получили бесконечный цикл.</p>
<p><code>break</code> выходит из цикла, <code>continue</code> пропускает остаток текущего оборота.</p>

<h3>Образец работы с цифрами числа</h3>
<pre><code>chislo = 4729
while chislo &gt; 0:
    tsifra = chislo % 10    # последняя цифра
    chislo //= 10           # отбросить последнюю цифру
    print(tsifra, end=" ")  # 9 2 7 4</code></pre>
<p>Этот приём повторяется в задачах на сумму цифр, разворот числа, подсчёт количества цифр.</p>

<h3>Ход работы</h3>
<ol>
  <li>Выведите числа от 1 до 10 через <code>for</code> и через <code>while</code>, сравните оба варианта кода.</li>
  <li>Намеренно напишите бесконечный цикл, остановите его и объясните причину.</li>
  <li>Напишите программу, которая читает числа до признака остановки и выводит их сумму и среднее.</li>
  <li>Испытайте алгоритм Евклида:
    <pre><code>a, b = 48, 18
while b != 0:
    a, b = b, a % b
print(a)      # НОД = 6</code></pre>
  </li>
  <li>Выполните задания.</li>
</ol>

<h3>Контрольные вопросы</h3>
<ol>
  <li>В каких случаях <code>while</code> предпочтительнее <code>for</code>?</li>
  <li>В чём разница между <code>break</code> и <code>continue</code>?</li>
  <li>Почему алгоритм Евклида останавливается?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of the work</h2>
<p>To build algorithms where the number of repetitions is not known in advance, and to master the ways of keeping clear of an endless loop.</p>

<h3>Theory in brief</h3>
<pre><code>starting_value
while condition:
    body
    a change that affects the condition</code></pre>
<p>All three parts are required. Leave out the third and you have an endless loop.</p>
<p><code>break</code> leaves the loop, <code>continue</code> skips the rest of the current turn.</p>

<h3>A model for working with the digits of a number</h3>
<pre><code>number = 4729
while number &gt; 0:
    digit = number % 10     # the last digit
    number //= 10           # drop the last digit
    print(digit, end=" ")   # 9 2 7 4</code></pre>
<p>This pattern comes up again in problems on the sum of the digits, reversing a number and counting how many digits there are.</p>

<h3>Procedure</h3>
<ol>
  <li>Print the numbers from 1 to 10 with <code>for</code> and with <code>while</code>, and compare the two pieces of code.</li>
  <li>Write an endless loop on purpose, stop it and explain the cause.</li>
  <li>Write a program that reads numbers up to a stopping marker and prints their total and their average.</li>
  <li>Try Euclid's algorithm:
    <pre><code>a, b = 48, 18
while b != 0:
    a, b = b, a % b
print(a)      # the greatest common divisor = 6</code></pre>
  </li>
  <li>Do the tasks.</li>
</ol>

<h3>Questions to check yourself</h3>
<ol>
  <li>In which cases is <code>while</code> preferable to <code>for</code>?</li>
  <li>What is the difference between <code>break</code> and <code>continue</code>?</li>
  <li>Why does Euclid's algorithm come to a stop?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Jumıstıń maqseti</h2>
<p>Qaytalaw sanı aldınnan belgisiz bolǵan algoritmlerdi dúziw, sheksiz cikldan saqlanıw usılların ózlestiriw.</p>

<h3>Teoriyalıq eskertpe</h3>
<pre><code>baslanǵısh_mánis
while shárt:
    dene
    shártke tásir etiwshi ózgeris</code></pre>
<p>Úsh bólim de bolıwı shárt. Úshinshisi umıtılsa — sheksiz cikl.</p>
<p><code>break</code> cikldan shıǵadı, <code>continue</code> házirgi aylanıstıń qalǵanın taslap jiberedi.</p>

<h3>Sannıń raqamları menen islew úlgisi</h3>
<pre><code>san = 4729
while san &gt; 0:
    raqam = san % 10      # aqırǵı raqam
    san //= 10            # aqırǵı raqamdı taslaw
    print(raqam, end=" ") # 9 2 7 4</code></pre>
<p>Bul úlgi raqamlar jıyındısı, sandı keri buraw, raqamlar sanın tabıw sıyaqlı máselelerde qaytalanadı.</p>

<h3>Jumıs tártibi</h3>
<ol>
  <li>1 den 10 ǵa shekem sanlardı <code>for</code> hám <code>while</code> penen shıǵarıń, eki kodtı salıstırıń.</li>
  <li>Atayı sheksiz cikl jazıń, onı toqtatıń hám sebebin túsindiriń.</li>
  <li>Toqtatıwshı belgige shekem sanlardı oqıp, olardıń jıyındısı hám ortashasın shıǵaratuǵın programma jazıń.</li>
  <li>Evklid algoritmin sınań:
    <pre><code>a, b = 48, 18
while b != 0:
    a, b = b, a % b
print(a)      # EÚOB = 6</code></pre>
  </li>
  <li>Tapsırmalardı orınlań.</li>
</ol>

<h3>Baqlaw sorawları</h3>
<ol>
  <li>Qanday jaǵdaylarda <code>while</code> <code>for</code> dan artıqlaw?</li>
  <li><code>break</code> hám <code>continue</code> parqı nede?</li>
  <li>Evklid algoritmi ne ushın toqtaydı?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

  -- ============================================================
  -- lab-6-funksiyalar
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug = 'lab-6-funksiyalar' LIMIT 1;
  IF v_topic IS NOT NULL THEN

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'ru', 'content_html', $html$
<h2>Цель работы</h2>
<p>Сформировать навык решения задачи разбиением на функции и работы с параметрами и возвращаемым значением.</p>

<h3>Теоретическая справка</h3>
<pre><code>def imya(parametr1, parametr2=znachenie_po_umolchaniyu):
    """Кратко о том, что она делает."""
    ...
    return rezultat</code></pre>
<ul>
  <li>Строка <code>def</code> только создаёт функцию — чтобы запустить её, нужен вызов</li>
  <li>Как только выполняется <code>return</code>, функция завершается</li>
  <li>Без <code>return</code> функция возвращает <code>None</code></li>
  <li>Переменные внутри функции локальны — снаружи их нет</li>
</ul>

<h3>Образец модульного подхода</h3>
<pre><code>def prochitat():
    n = int(input())
    return list(map(int, input().split()))

def otobrat_chetnye(chisla):
    return [x for x in chisla if x % 2 == 0]

def vyvesti(chisla):
    print(*chisla)

vyvesti(otobrat_chetnye(prochitat()))</code></pre>
<p>Каждая функция выполняет одну задачу: чтение, обработка, вывод. Такое устройство заметно облегчает поиск ошибки.</p>

<h3>Ход работы</h3>
<ol>
  <li>Напишите несколько простых функций: <code>kvadrat</code>, <code>kub</code>, <code>nechetnoe</code>.</li>
  <li>Проверьте на практике, что локальная переменная снаружи не видна, и запишите выданную ошибку.</li>
  <li>Испытайте значения по умолчанию и именованные аргументы.</li>
  <li>Убедитесь, что код после <code>return</code> не выполняется.</li>
  <li>Выполните задания — в каждом должно быть не менее двух функций.</li>
</ol>

<h3>Контрольные вопросы</h3>
<ol>
  <li>Когда следует применять <code>print()</code>, а когда <code>return</code>?</li>
  <li>В чём разница между параметром и аргументом?</li>
  <li>Почему рекомендуется, чтобы функция не превышала 20 строк?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'en', 'content_html', $html$
<h2>The aim of the work</h2>
<p>To build the skill of solving a problem by splitting it into functions, and of working with parameters and returned values.</p>

<h3>Theory in brief</h3>
<pre><code>def name(parameter1, parameter2=default_value):
    """A short note on what it does."""
    ...
    return result</code></pre>
<ul>
  <li>The <code>def</code> line only creates the function — a call is needed to run it</li>
  <li>As soon as <code>return</code> runs, the function ends</li>
  <li>Without a <code>return</code>, a function hands back <code>None</code></li>
  <li>Variables inside a function are local — outside it they do not exist</li>
</ul>

<h3>A model of the modular approach</h3>
<pre><code>def read_input():
    n = int(input())
    return list(map(int, input().split()))

def pick_even(numbers):
    return [x for x in numbers if x % 2 == 0]

def show(numbers):
    print(*numbers)

show(pick_even(read_input()))</code></pre>
<p>Each function does one job: reading, processing, printing. A structure like this makes finding a mistake far easier.</p>

<h3>Procedure</h3>
<ol>
  <li>Write several simple functions: <code>square</code>, <code>cube</code>, <code>is_odd</code>.</li>
  <li>Check in practice that a local variable is not visible outside, and write down the error you get.</li>
  <li>Try default values and named arguments.</li>
  <li>Check that code after a <code>return</code> does not run.</li>
  <li>Do the tasks — each of them should contain at least two functions.</li>
</ol>

<h3>Questions to check yourself</h3>
<ol>
  <li>When should <code>print()</code> be used, and when <code>return</code>?</li>
  <li>What is the difference between a parameter and an argument?</li>
  <li>Why is it advised that a function should not run past 20 lines?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

    INSERT INTO content_translations (resource, row_id, locale, field, value)
    VALUES ('topics', v_topic, 'kaa', 'content_html', $html$
<h2>Jumıstıń maqseti</h2>
<p>Máseleni funkciyalarǵa ajıratıp sheshiw, parametr hám qaytarılatuǵın mánis penen islew kónlikpesin qáliplestiriw.</p>

<h3>Teoriyalıq eskertpe</h3>
<pre><code>def at(parametr1, parametr2=sukut_mánis):
    """Ne isleytuǵını haqqında qısqasha."""
    ...
    return nátiyje</code></pre>
<ul>
  <li><code>def</code> qatarı funkciyanı tek jaratadı — iske túsiriw ushın shaqırıw kerek</li>
  <li><code>return</code> orınlanıwı menen funkciya juwmaqlanadı</li>
  <li><code>return</code> jazılmasa funkciya <code>None</code> qaytaradı</li>
  <li>Funkciya ishindegi ózgeriwshiler lokal — sırtta joq</li>
</ul>

<h3>Modulli jantasıw úlgisi</h3>
<pre><code>def oqıw():
    n = int(input())
    return list(map(int, input().split()))

def juplardı_ajırat(sanlar):
    return [x for x in sanlar if x % 2 == 0]

def shıǵar(sanlar):
    print(*sanlar)

shıǵar(juplardı_ajırat(oqıw()))</code></pre>
<p>Hár bir funkciya bir wazıypanı orınlaydı: oqıw, qayta islew, shıǵarıw. Bunday dúzilis qátelikti tabıwdı ádewir jeńillestiredi.</p>

<h3>Jumıs tártibi</h3>
<ol>
  <li>Birneshe ápiwayı funkciya jazıń: <code>kvadrat</code>, <code>kub</code>, <code>taq_pa</code>.</li>
  <li>Lokal ózgeriwshi sırtta kórinbeytuǵının ámelde tekseriń hám shıqqan qátelikti jazıp alıń.</li>
  <li>Sukut mánisli hám atlı argumentlerdi sınań.</li>
  <li><code>return</code> nan keyingi kod orınlanbaytuǵının tekseriń.</li>
  <li>Tapsırmalardı orınlań — hár birinde keminde eki funkciya bolsın.</li>
</ol>

<h3>Baqlaw sorawları</h3>
<ol>
  <li><code>print()</code> hám <code>return</code> di qashan isletiw kerek?</li>
  <li>Parametr hám argument parqı nede?</li>
  <li>Ne ushın funkciya 20 qatardan aspawı usınıs etiledi?</li>
</ol>
$html$)
    ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  END IF;

END $$;
