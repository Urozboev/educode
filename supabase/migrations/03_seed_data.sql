-- ============================================
-- PART 3: BOSHLANG'ICH MA'LUMOTLAR (SEED DATA)
-- Jadvallar va RLS yaratilgandan keyin ishga tushiring
-- ============================================

-- Platforma sozlamalari
INSERT INTO platform_settings (key, value, description) VALUES
('coin_settings', '{"registration_bonus":100,"topic_complete":10,"course_complete":50,"challenge_easy":5,"challenge_medium":10,"challenge_hard":20,"streak_3":15,"streak_7":30,"streak_30":100}', 'Coin tizimi sozlamalari'),
('xp_settings', '{"topic_complete":25,"course_complete":100,"challenge_easy":15,"challenge_medium":30,"challenge_hard":50,"quiz_pass":10}', 'XP tizimi sozlamalari'),
('level_thresholds', '{"beginner":0,"elementary":200,"intermediate":500,"advanced":1000}', 'XP darajalar chegarasi')
ON CONFLICT (key) DO NOTHING;

-- Yutuqlar
INSERT INTO achievements (title, description, icon, color, category, requirement_type, requirement_count, coin_reward, xp_reward) VALUES
('Birinchi qadam', 'Birinchi topshiriqni bajardingiz!', 'footprints', '#6C5CE7', 'learning', 'challenges_solved', 1, 5, 10),
('10 ta topshiriq', '10 ta topshiriqni yechdingiz!', 'target', '#00D2FF', 'challenge', 'challenges_solved', 10, 20, 50),
('50 ta topshiriq', '50 ta topshiriqni yechdingiz!', 'award', '#FFD600', 'challenge', 'challenges_solved', 50, 50, 100),
('Birinchi kurs', 'Birinchi kursni tugatdingiz!', 'book-check', '#00E676', 'learning', 'courses_completed', 1, 20, 50),
('3 kunlik streak', '3 kun ketma-ket faol bo''ldingiz!', 'flame', '#FF5252', 'streak', 'streak_days', 3, 15, 30),
('7 kunlik streak', '7 kun ketma-ket faol bo''ldingiz!', 'flame', '#FF5252', 'streak', 'streak_days', 7, 30, 60),
('30 kunlik streak', '30 kun ketma-ket faol bo''ldingiz!', 'crown', '#FFD600', 'streak', 'streak_days', 30, 100, 200),
('Tez yechuvchi', '5 ta oson topshiriqni yechdingiz', 'zap', '#00D2FF', 'challenge', 'challenges_solved', 5, 10, 25),
('5 ta test', '5 ta testni muvaffaqiyatli topshirdingiz', 'check-circle', '#00E676', 'learning', 'quizzes_passed', 5, 10, 25);

-- Namuna kurslar
INSERT INTO courses (title, slug, description, category, difficulty, is_free, coin_reward, estimated_hours, total_topics, is_published, order_index) VALUES
('Python dasturlash asoslari', 'python-basics', 'Python dasturlash tilini noldan o''rganing. O''zgaruvchilar, shartlar, sikllar, funksiyalar va boshqalar.', 'python', 'beginner', true, 50, 40, 24, true, 1),
('JavaScript asoslari', 'javascript-basics', 'Veb dasturlashning asosi — JavaScript tilini o''rganing.', 'programming', 'beginner', true, 50, 35, 20, true, 2),
('Frontend (HTML, CSS, React)', 'frontend-course', 'Zamonaviy veb-saytlar yaratishni o''rganing. HTML, CSS va React.', 'frontend', 'intermediate', false, 100, 60, 32, true, 3),
('Kompyuter savodxonligi', 'computer-literacy', 'Kompyuter bilan ishlash asoslari. Office dasturlari, Internet, xavfsizlik.', 'computer_literacy', 'beginner', true, 30, 20, 15, true, 4),
('Prompt Engineering', 'prompt-engineering', 'AI bilan samarali ishlash san''ati. ChatGPT, Claude va boshqa AI vositalar.', 'prompt_engineering', 'intermediate', false, 40, 15, 12, true, 5),
('Algoritmlar va ma''lumotlar tuzilmasi', 'algorithms-ds', 'Dasturlash musobaqalari uchun algoritmlar va ma''lumotlar tuzilmalari.', 'algorithms', 'advanced', false, 150, 80, 28, true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Python kursi uchun namuna mavzular
INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes)
SELECT c.id, t.title, t.slug, t.content, t.idx, 10, 25, t.minutes
FROM courses c,
(VALUES
  ('Python nima va nima uchun o''rganish kerak?', 'python-intro', '<h2>Python haqida</h2><p>Python — bu sodda va kuchli dasturlash tili. Uni o''rganish oson, lekin imkoniyatlari cheksiz.</p><h3>Python qayerda ishlatiladi?</h3><ul><li>Veb dasturlash (Django, Flask)</li><li>Sun''iy intellekt va Machine Learning</li><li>Ma''lumotlar tahlili (Data Science)</li><li>Avtomatlashtirish</li><li>O''yin yaratish</li></ul><p>Keling, birinchi Python dasturimizni yozamiz!</p>', 1, 15),
  ('Python o''rnatish va muhitni sozlash', 'python-setup', '<h2>Python o''rnatish</h2><p>Python ni rasmiy saytdan yuklab oling: python.org</p><h3>Qadamlar:</h3><ol><li>python.org saytiga kiring</li><li>Downloads bo''limidan oxirgi versiyani yuklab oling</li><li>O''rnatish jarayonida "Add to PATH" ni tanlang</li></ol>', 2, 20),
  ('O''zgaruvchilar va ma''lumot turlari', 'variables', '<h2>O''zgaruvchilar</h2><p>O''zgaruvchi — bu qiymatni saqlaydigan idish. Python da o''zgaruvchi yaratish juda oson:</p><pre><code>ism = "Mirjalol"\nyosh = 25\npi = 3.14\ntalaba = True</code></pre><h3>Asosiy ma''lumot turlari:</h3><ul><li><strong>str</strong> — matn (string)</li><li><strong>int</strong> — butun son</li><li><strong>float</strong> — kasr son</li><li><strong>bool</strong> — True yoki False</li></ul>', 3, 25),
  ('Amallar va ifodalar', 'operators', '<h2>Amallar</h2><p>Python da matematik va mantiqiy amallarni bajarish mumkin.</p><h3>Matematik amallar:</h3><pre><code>a = 10\nb = 3\nprint(a + b)  # 13\nprint(a - b)  # 7\nprint(a * b)  # 30\nprint(a / b)  # 3.333\nprint(a // b) # 3\nprint(a % b)  # 1\nprint(a ** b) # 1000</code></pre>', 4, 20),
  ('Shartli operatorlar (if/elif/else)', 'conditions', '<h2>Shartli operatorlar</h2><p>Dastur oqimini boshqarish uchun shartli operatorlardan foydalanamiz.</p><pre><code>yosh = 18\n\nif yosh >= 18:\n    print("Siz voyaga yetgansiz")\nelif yosh >= 14:\n    print("Siz o''smir")\nelse:\n    print("Siz bola")</code></pre>', 5, 30),
  ('Sikllar (for va while)', 'loops', '<h2>Sikllar</h2><p>Bir xil amalni bir necha marta takrorlash uchun sikllardan foydalanamiz.</p><h3>for sikli:</h3><pre><code>for i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\nmevalar = ["olma", "banan", "uzum"]\nfor meva in mevalar:\n    print(meva)</code></pre><h3>while sikli:</h3><pre><code>son = 0\nwhile son < 5:\n    print(son)\n    son += 1</code></pre>', 6, 35),
  ('Funksiyalar', 'functions', '<h2>Funksiyalar</h2><p>Funksiya — bu qayta ishlatiladigan kod bloki.</p><pre><code>def salomlash(ism):\n    return f"Salom, {ism}!"\n\nnatija = salomlash("Mirjalol")\nprint(natija)  # Salom, Mirjalol!</code></pre>', 7, 30),
  ('Ro''yxatlar (Lists)', 'lists', '<h2>Ro''yxatlar</h2><p>Ro''yxat — bu bir nechta qiymatlarni saqlash uchun ishlatiladigan ma''lumot turi.</p><pre><code>sonlar = [1, 2, 3, 4, 5]\nsonlar.append(6)\nprint(sonlar[0])  # 1\nprint(len(sonlar))  # 6</code></pre>', 8, 30)
) AS t(title, slug, content, idx, minutes)
WHERE c.slug = 'python-basics'
ON CONFLICT DO NOTHING;

-- Python mavzulari uchun namuna testlar
DO $$
DECLARE
  v_topic_id UUID;
BEGIN
  SELECT id INTO v_topic_id FROM topics WHERE slug = 'variables' LIMIT 1;
  IF v_topic_id IS NOT NULL THEN
    INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
    (v_topic_id, 'Python da o''zgaruvchi yaratish uchun qaysi kalit so''z ishlatiladi?', 'single',
     '[{"id":"a","text":"var","is_correct":false},{"id":"b","text":"let","is_correct":false},{"id":"c","text":"Kalit so''z kerak emas","is_correct":true},{"id":"d","text":"define","is_correct":false}]',
     'Python da o''zgaruvchi yaratish uchun maxsus kalit so''z kerak emas. Shunchaki ism = qiymat yoziladi.', 1, 1),
    (v_topic_id, 'x = 10 ifodada x ning turi nima?', 'single',
     '[{"id":"a","text":"str","is_correct":false},{"id":"b","text":"int","is_correct":true},{"id":"c","text":"float","is_correct":false},{"id":"d","text":"bool","is_correct":false}]',
     '10 butun son bo''lgani uchun x ning turi int (integer) bo''ladi.', 1, 2),
    (v_topic_id, 'Quyidagilardan qaysilari to''g''ri o''zgaruvchi nomi? (bir nechtasini tanlang)', 'multiple',
     '[{"id":"a","text":"my_name","is_correct":true},{"id":"b","text":"2name","is_correct":false},{"id":"c","text":"_count","is_correct":true},{"id":"d","text":"for","is_correct":false}]',
     'O''zgaruvchi nomi raqam bilan boshlanmaydi va Python kalit so''zlari (for, if, while...) ishlatilmaydi.', 1, 3),
    (v_topic_id, 'type(3.14) ifoda natijasi nima?', 'single',
     '[{"id":"a","text":"<class ''int''>","is_correct":false},{"id":"b","text":"<class ''float''>","is_correct":true},{"id":"c","text":"<class ''str''>","is_correct":false},{"id":"d","text":"<class ''decimal''>","is_correct":false}]',
     '3.14 kasr son bo''lgani uchun uning turi float.', 1, 4),
    (v_topic_id, 'ism = "Python" — bu yerda "Python" qaysi turga mansub?', 'single',
     '[{"id":"a","text":"int","is_correct":false},{"id":"b","text":"bool","is_correct":false},{"id":"c","text":"str","is_correct":true},{"id":"d","text":"list","is_correct":false}]',
     'Qo''shtirnoq ichidagi qiymat — str (string, matn) turi.', 1, 5);
  END IF;
END $$;

-- Namuna topshiriqlar (challenges)
INSERT INTO challenges (title, slug, description, category, difficulty, languages, starter_code, test_cases, hidden_test_cases, coin_reward, xp_reward) VALUES
('Ikki sonni qo''shish', 'sum-two-numbers', 'Ikkita son berilgan. Ularning yig''indisini qaytaring.', 'math', 'easy',
 ARRAY['python','javascript'],
 '{"python":"def solve(a, b):\n    # Kodingizni yozing\n    pass","javascript":"function solve(a, b) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"5 3","expected_output":"8","is_hidden":false},{"input":"10 20","expected_output":"30","is_hidden":false},{"input":"-5 5","expected_output":"0","is_hidden":false}]',
 '[{"input":"1000000 999999","expected_output":"1999999","is_hidden":true},{"input":"0 0","expected_output":"0","is_hidden":true}]',
 5, 15),

('Juft yoki toq', 'even-or-odd', 'Berilgan sonning juft yoki toqligini aniqlang. Juft bo''lsa "Juft", toq bo''lsa "Toq" qaytaring.', 'math', 'easy',
 ARRAY['python','javascript'],
 '{"python":"def solve(n):\n    # Kodingizni yozing\n    pass","javascript":"function solve(n) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"4","expected_output":"Juft","is_hidden":false},{"input":"7","expected_output":"Toq","is_hidden":false},{"input":"0","expected_output":"Juft","is_hidden":false}]',
 '[{"input":"999999","expected_output":"Toq","is_hidden":true},{"input":"-2","expected_output":"Juft","is_hidden":true}]',
 5, 15),

('Eng katta element', 'max-element', 'Berilgan ro''yxatdan eng katta elementni toping.', 'arrays', 'easy',
 ARRAY['python','javascript'],
 '{"python":"def solve(arr):\n    # Kodingizni yozing\n    pass","javascript":"function solve(arr) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"[1, 5, 3, 9, 2]","expected_output":"9","is_hidden":false},{"input":"[-1, -5, -3]","expected_output":"-1","is_hidden":false}]',
 '[{"input":"[100]","expected_output":"100","is_hidden":true}]',
 5, 15),

('Palindrom tekshirish', 'palindrome-check', 'Berilgan so''z palindrom (teskari o''qilganda ham bir xil) ekanligini tekshiring. "Ha" yoki "Yo''q" qaytaring.', 'strings', 'medium',
 ARRAY['python','javascript'],
 '{"python":"def solve(s):\n    # Kodingizni yozing\n    pass","javascript":"function solve(s) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"madam","expected_output":"Ha","is_hidden":false},{"input":"salom","expected_output":"Yo''q","is_hidden":false},{"input":"aba","expected_output":"Ha","is_hidden":false}]',
 '[{"input":"a","expected_output":"Ha","is_hidden":true},{"input":"abcba","expected_output":"Ha","is_hidden":true}]',
 10, 30),

('Fibonacci ketma-ketligi', 'fibonacci', 'n-chi Fibonacci sonini qaytaring. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).', 'algorithms', 'medium',
 ARRAY['python','javascript'],
 '{"python":"def solve(n):\n    # Kodingizni yozing\n    pass","javascript":"function solve(n) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"0","expected_output":"0","is_hidden":false},{"input":"1","expected_output":"1","is_hidden":false},{"input":"10","expected_output":"55","is_hidden":false}]',
 '[{"input":"20","expected_output":"6765","is_hidden":true},{"input":"30","expected_output":"832040","is_hidden":true}]',
 10, 30),

('Satrni teskari aylantirish', 'reverse-string', 'Berilgan satrni teskari aylantiring. Built-in reverse funksiyadan foydalanmang.', 'strings', 'easy',
 ARRAY['python','javascript'],
 '{"python":"def solve(s):\n    # Kodingizni yozing\n    pass","javascript":"function solve(s) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"salom","expected_output":"molas","is_hidden":false},{"input":"python","expected_output":"nohtyp","is_hidden":false}]',
 '[{"input":"a","expected_output":"a","is_hidden":true},{"input":"","expected_output":"","is_hidden":true}]',
 5, 15)
ON CONFLICT (slug) DO NOTHING;

-- Namuna daraja aniqlash testlari
INSERT INTO placement_tests (question, category, difficulty, options, correct_option, order_index) VALUES
('Kompyuter nima?', 'logic', 'beginner',
 '[{"id":"a","text":"Faqat o''yin o''ynash uchun qurilma"},{"id":"b","text":"Ma''lumotlarni qayta ishlovchi elektron qurilma"},{"id":"c","text":"Faqat internet uchun qurilma"},{"id":"d","text":"Televizorning bir turi"}]',
 'b', 1),
('Dasturlash tili nima vazifa bajaradi?', 'basic_programming', 'beginner',
 '[{"id":"a","text":"Kompyuterni tuzatadi"},{"id":"b","text":"Kompyuterga buyruqlar berish uchun ishlatiladi"},{"id":"c","text":"Internet tezligini oshiradi"},{"id":"d","text":"Ekranni chiroyli qiladi"}]',
 'b', 2),
('x = 5; y = 3; print(x + y) — natija nima?', 'basic_programming', 'elementary',
 '[{"id":"a","text":"53"},{"id":"b","text":"8"},{"id":"c","text":"x + y"},{"id":"d","text":"Xatolik"}]',
 'b', 3),
('for sikli nima uchun ishlatiladi?', 'basic_programming', 'elementary',
 '[{"id":"a","text":"Shart tekshirish uchun"},{"id":"b","text":"Funksiya yaratish uchun"},{"id":"c","text":"Amalni takrorlash uchun"},{"id":"d","text":"O''zgaruvchi yaratish uchun"}]',
 'c', 4),
('O(n log n) murakkablik qaysi algoritmga xos?', 'algorithms', 'advanced',
 '[{"id":"a","text":"Bubble Sort"},{"id":"b","text":"Merge Sort"},{"id":"c","text":"Linear Search"},{"id":"d","text":"Fibonacci"}]',
 'b', 5);
