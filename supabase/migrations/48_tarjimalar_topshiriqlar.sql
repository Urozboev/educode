-- ============================================================
-- EduCode — Baza kontenti tarjimalari: TOPSHIRIQLAR (TOPIC TASKS)
--   Mavzular bo'yicha amaliy topshiriqlar shartlari,
--   yo'riqnomalari va maslahatlari (ru, en, kaa).
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
-- ============================================================

DO $$
DECLARE
  v_topic UUID;
  v_task_id UUID;
BEGIN
  -- ============================================================
  -- 1. SINTAKSIS MAVZUSI TOPSHIRIQLARI
  -- ============================================================
  SELECT id INTO v_topic FROM topics WHERE slug IN ('python-sintaksis', 'python-intro') LIMIT 1;
  IF v_topic IS NOT NULL THEN
    -- Topshiriq 1: Salomlashish (order_index = 0)
    SELECT id INTO v_task_id FROM topic_tasks WHERE topic_id = v_topic AND order_index = 0 LIMIT 1;
    IF v_task_id IS NOT NULL THEN
      -- RU
      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'ru', 'title', 'Приветствие')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'ru', 'description', 'Примите имя пользователя с клавиатуры и выведите на экран "Salom, <имя>!". Не забудьте восклицательный знак.')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value_json)
      VALUES ('topic_tasks', v_task_id, 'ru', 'hints', '[{"order":1,"text":"Используйте input() для чтения имени"},{"order":2,"text":"Используйте f-строку: f\"Salom, {ism}!\""}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      -- EN
      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'en', 'title', 'Greeting Output')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'en', 'description', 'Read a name from input and print "Salom, <name>!" with the exclamation mark.')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value_json)
      VALUES ('topic_tasks', v_task_id, 'en', 'hints', '[{"order":1,"text":"Read using input() and store in a variable"},{"order":2,"text":"Format with f-string: f\"Salom, {ism}!\""}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      -- KAA
      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'kaa', 'title', 'Sálemlesiw')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'kaa', 'description', 'Paydalanıwshıdan at kiritiń hám ekranǵa "Salom, <at>!" kórinisinde shıǵarıń. Ún belgisin umıtpań.')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value_json)
      VALUES ('topic_tasks', v_task_id, 'kaa', 'hints', '[{"order":1,"text":"input() penen oqıń, nátiyjeni ózgeriwshige saqlań"},{"order":2,"text":"f-string qollań: f\"Salom, {ism}!\""}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
    END IF;

    -- Topshiriq 2: Ikki qatorli tanishtiruv (order_index = 1)
    SELECT id INTO v_task_id FROM topic_tasks WHERE topic_id = v_topic AND order_index = 1 LIMIT 1;
    IF v_task_id IS NOT NULL THEN
      -- RU
      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'ru', 'title', 'Двухстрочное представление')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'ru', 'description', 'Вводятся две строки: имя и возраст. Выведите их в формате:\nIsm: Ali\nYosh: 19')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      -- EN
      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'en', 'title', 'Two-line Introduction')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'en', 'description', 'Two lines are given: name and age. Print them formatted as:\nIsm: Ali\nYosh: 19')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      -- KAA
      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'kaa', 'title', 'Eki qatarlı tanıstırıw')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value)
      VALUES ('topic_tasks', v_task_id, 'kaa', 'description', 'Eki qatar kiritiledi: birinshisi at, ekinshisi jas. Olardı tómendegi kóriniste shıǵarıń:\nIsm: Ali\nYosh: 19')
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
    END IF;
  END IF;

END $$;
