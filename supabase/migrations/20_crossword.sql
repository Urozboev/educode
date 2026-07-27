-- ============================================
-- EduCode — Krossvord: dars o'yinlarining 4-turi
--
-- Kontent shakli:
--   { rows, cols, words: [{ answer, clue, row, col, dir, num }] }
-- To'r joylashuvi admin panelda avtomatik hisoblanadi va tayyor holda
-- saqlanadi — o'yin har ochilganda bir xil ko'rinadi.
--
-- 19_lesson_games.sql dan KEYIN ishga tushiring.
-- ============================================

ALTER TABLE lesson_games DROP CONSTRAINT IF EXISTS lesson_games_type_check;
ALTER TABLE lesson_games ADD CONSTRAINT lesson_games_type_check
  CHECK (type IN ('quiz_race','jeopardy','match_pairs','crossword'));
