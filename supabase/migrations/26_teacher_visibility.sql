-- ============================================
-- EduCode — O'qituvchi o'z o'quvchilarining o'yin natijalarini ko'rsin
--
-- `game_results` siyosati o'qituvchiga faqat O'ZI YARATGAN o'yin
-- natijalarini ochardi. Natijada o'quvchi hamkasbining o'yinini o'ynasa,
-- uning natijasi o'qituvchi panelida ko'rinmasdi.
--
-- Endi o'qituvchi o'ziga biriktirilgan o'quvchilarning barcha o'yin
-- natijalarini ko'radi. Bu `submissions` va `quiz_results` da allaqachon
-- mavjud yondashuvdan tor: u yerda har qanday o'qituvchi hamma narsani
-- ko'ra oladi, bu yerda esa faqat o'z o'quvchisini.
--
-- 24_classroom_and_live.sql dan KEYIN ishga tushiring.
-- ============================================

DROP POLICY IF EXISTS "game_results_read" ON game_results;
CREATE POLICY "game_results_read" ON game_results FOR SELECT USING (
  -- O'zining natijasi
  user_id = auth.uid()
  -- O'yin muallifi (o'z o'yinining statistikasi)
  OR EXISTS (
    SELECT 1 FROM lesson_games g
     WHERE g.id = game_results.game_id AND g.author_id = auth.uid()
  )
  -- O'quvchisi biriktirilgan o'qituvchi
  OR EXISTS (
    SELECT 1 FROM teacher_students ts
     WHERE ts.student_id = game_results.user_id AND ts.teacher_id = auth.uid()
  )
  -- Ota-ona (08-migratsiyadagi yordamchi funksiya)
  OR is_parent_of(game_results.user_id)
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
