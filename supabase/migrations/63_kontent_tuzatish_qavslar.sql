-- ============================================================
-- MirAcademy — Kontent tuzatishi: kabisa yil va qavslar
--
-- MUAMMO
-- "amaliy-4-shartlar" darsida shunday yozilgan edi:
--   "Qavs shart — usiz and va or tartibi natijani buzadi."
--
-- Bu aynan shu formula uchun NOTO'G'RI. Qavssiz variant
--   yil % 4 == 0 and yil % 100 != 0 or yil % 400 == 0
-- ham xuddi shu natijani beradi, chunki `A and B or C` va
-- `A and (B or C)` faqat "A yolg'on, C rost" holatida farq qiladi.
-- 400 ga bo'linadigan son esa har doim 4 ga ham bo'linadi, ya'ni bu
-- holat kabisa yil formulasida umuman yuzaga kelmaydi.
--
-- Matn to'g'ri tushuntirishga almashtirildi: qavs natijani emas,
-- KODNI O'QISHNI osonlashtiradi; farq qiladigan holat esa
-- laboratoriya sahifasidagi rostlik jadvalida ko'rsatilgan.
--
-- Qayta ishga tushirish xavfsiz: matn allaqachon almashgan bo'lsa,
-- replace() hech narsa o'zgartirmaydi.
-- ============================================================

-- O'zbekcha (asl matn — topics.content_html)
UPDATE topics
SET content_html = replace(
  content_html,
  '<p>Qavs shart — usiz <code>and</code> va <code>or</code> tartibi natijani buzadi.</p>',
  '<p>Bu yerda qavs natijani o''zgartirmaydi — qavssiz variant ham xuddi shu javobni beradi, chunki 400 ga bo''linadigan son 4 ga ham bo''linadi. Lekin qavsni yozish kerak: u <code>and</code> va <code>or</code> aralashganda niyatni aniq ko''rsatadi va kodni o''qishni osonlashtiradi.</p>'
)
WHERE slug = 'amaliy-4-shartlar';

-- Tarjimalar (content_translations)
UPDATE content_translations ct
SET value = replace(
  value,
  '<p>Скобки обязательны — без них порядок <code>and</code> и <code>or</code> искажает результат.</p>',
  '<p>Здесь скобки не меняют результат — вариант без них даёт тот же ответ, ведь число, делящееся на 400, делится и на 4. Но писать их стоит: когда <code>and</code> и <code>or</code> смешаны, скобки делают намерение однозначным и код читается легче.</p>'
)
FROM topics t
WHERE ct.resource = 'topics' AND ct.row_id = t.id
  AND t.slug = 'amaliy-4-shartlar' AND ct.locale = 'ru' AND ct.field = 'content_html';

UPDATE content_translations ct
SET value = replace(
  value,
  '<p>The brackets are required — without them the order of <code>and</code> and <code>or</code> spoils the result.</p>',
  '<p>Here the brackets do not change the result — the version without them gives the same answer, since any number divisible by 400 is also divisible by 4. They are still worth writing: when <code>and</code> and <code>or</code> are mixed, brackets make the intent unambiguous and the code easier to read.</p>'
)
FROM topics t
WHERE ct.resource = 'topics' AND ct.row_id = t.id
  AND t.slug = 'amaliy-4-shartlar' AND ct.locale = 'en' AND ct.field = 'content_html';

UPDATE content_translations ct
SET value = replace(
  value,
  '<p>Qawsıra shárt — onsız <code>and</code> hám <code>or</code> tártibi nátiyjeni buzadı.</p>',
  '<p>Bul jerde qawsıra nátiyjeni ózgertpeydi — qawsırasız variant ta dál sol juwaptı beredi, sebebi 400 ge bólinetuǵın san 4 ke de bólinedi. Biraq onı jazıw kerek: <code>and</code> hám <code>or</code> aralasqanda qawsıra niyetti anıq kórsetedi hám kodtı oqıwdı jeńillestiredi.</p>'
)
FROM topics t
WHERE ct.resource = 'topics' AND ct.row_id = t.id
  AND t.slug = 'amaliy-4-shartlar' AND ct.locale = 'kaa' AND ct.field = 'content_html';
