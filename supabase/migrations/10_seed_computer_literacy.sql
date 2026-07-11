-- ============================================
-- EduCode — "Kompyuter savodxonligi" kursi seed
-- 15 bo'lim, 141 dars (docx rejasidan avtomatik)
-- Idempotent: bo'limlar allaqachon bo'lsa qayta yozmaydi.
-- Video GUID'lar keyin admin panelda kiritiladi.
-- ============================================

DO $$
DECLARE
  v_course UUID;
  v_sec UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'kompyuter-savodxonligi';
  IF v_course IS NULL THEN
    INSERT INTO courses (title, slug, description, long_description, category, difficulty, is_free, price_coins, is_published, estimated_hours, order_index)
    VALUES ('Kompyuter savodxonligi', 'kompyuter-savodxonligi',
      'Noldan boshlab kompyuter va internetdan professional foydalanishni o''rgatuvchi to''liq kurs.',
      'Windows, Microsoft Office, Google xizmatlari, internet xavfsizligi, AI vositalar va amaliy loyihalar — 15 bo''lim, 141 video dars.',
      'computer_literacy', 'beginner', false, 500, true, 31, 1)
    RETURNING id INTO v_course;
    RAISE NOTICE 'Kurs yaratildi: %', v_course;
  END IF;

  IF (SELECT COUNT(*) FROM course_sections WHERE course_id = v_course) > 0 THEN
    RAISE NOTICE 'Bo''limlar allaqachon mavjud — seed o''tkazib yuborildi';
    RETURN;
  END IF;

  -- 1-BO'LIM: Kompyuter bilan tanishuv
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Kompyuter bilan tanishuv', 1, 150) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Kompyuter nima? Kompyuter turlari (stol, noutbuk, planshet, smartfon)', '1-1', 1, 10, true, 10, 25, 'bunny'),
    (v_course, v_sec, 'Kompyuterning asosiy qismlari: monitor, klaviatura, sichqoncha, tizim bloki', '1-2', 2, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Kompyuterni yoqish, o''chirish va qayta ishga tushirish', '1-3', 3, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Operatsion tizim nima? Windows interfeysiga kirish', '1-4', 4, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ish stoli (Desktop): papkalar, yorliqlar, vazifalar paneli (Taskbar)', '1-5', 5, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Fayl va papkalar bilan ishlash: yaratish, nomini o''zgartirish, ko''chirish, o''chirish', '1-6', 6, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Fayl kengaytmalari va turlari (.docx, .pdf, .jpg, .mp4, .exe va boshqalar)', '1-7', 7, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Fayl qidirish va tartiblash usullari', '1-8', 8, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Klaviatura bilan ishlash: tugmalar va ularning vazifalari', '1-9', 9, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Sichqoncha bilan ishlash: chap, o''ng tugma, ikki marta bosish, siljitish', '1-10', 10, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Tezkor tugmalar (Keyboard Shortcuts): Ctrl+C, Ctrl+V, Alt+Tab va boshqalar', '1-11', 11, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Kompyuterni sozlash: ekran, ovoz, til va vaqt sozlamalari', '1-12', 12, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Dasturlarni o''rnatish va o''chirish', '1-13', 13, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'USB flesh-disk bilan ishlash: ulash, fayllarni ko''chirish, xavfsiz chiqarish', '1-14', 14, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Kompyuterdagi xotira turlari: HDD, SSD, RAM haqida tushuncha', '1-15', 15, 10, false, 10, 25, 'bunny');

  -- 2-BO'LIM: Internet bilan ishlash
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Internet bilan ishlash', 2, 225) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Internet nima? Internet qanday ishlaydi?', '2-1', 16, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Brauzer nima? Chrome, Edge, Firefox brauzerlari bilan tanishuv', '2-2', 17, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Veb-sayt manzili (URL) tuzilishi va navigatsiya', '2-3', 18, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Google qidiruv tizimidan samarali foydalanish', '2-4', 19, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Kengaytirilgan qidiruv operatorlari va filtrlari', '2-5', 20, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Elektron pochta (Email): Gmail akkount yaratish', '2-6', 21, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Elektron pochta: xat yozish, javob berish, fayl biriktirish', '2-7', 22, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Email xavfsizligi: spam, phishing xatlarni aniqlash', '2-8', 23, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ijtimoiy tarmoqlar bilan tanishuv: Telegram, Instagram, Facebook', '2-9', 24, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Telegram: kanal, guruh yaratish va boshqarish', '2-10', 25, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'YouTube: video qidirish, kanal obuna, pleylist yaratish', '2-11', 26, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Google Maps bilan ishlash: joy qidirish, marshrut tuzish', '2-12', 27, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Internetdan fayl yuklab olish va xavfsizlik qoidalari', '2-13', 28, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Bulutli xotira: Google Drive bilan tanishuv', '2-14', 29, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Google Drive: fayl yuklash, ulashish va hamkorlikda ishlash', '2-15', 30, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Onlayn tarjimonlar: Google Translate va boshqalar', '2-16', 31, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'QR-kod nima? QR-kod skanerlash va yaratish', '2-17', 32, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Wi-Fi va mobil internet: ulanish va sozlash', '2-18', 33, 13, false, 10, 25, 'bunny');

  -- 3-BO'LIM: Microsoft Word
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Microsoft Word', 3, 195) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Microsoft Word interfeysi: menyu, lenta, asboblar paneli', '3-1', 34, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Yangi hujjat yaratish va saqlash (Save, Save As)', '3-2', 35, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Matn kiritish, tahrirlash va formatlash (shrift, o''lcham, rang)', '3-3', 36, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Paragraf formatlash: tekislash, satr oralig''i, chekinish', '3-4', 37, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ro''yxatlar yaratish: raqamli va belgili (numbered & bulleted)', '3-5', 38, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Jadval yaratish va tahrirlash', '3-6', 39, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Jadvalda hisoblash va tartiblash', '3-7', 40, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Rasm, shakl va SmartArt qo''shish', '3-8', 41, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Sahifa sozlamalari: o''lcham, yo''nalish, chegaralar', '3-9', 42, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Kolontitul (Header/Footer) va sahifa raqamlash', '3-10', 43, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Mundarija (Table of Contents) avtomatik yaratish', '3-11', 44, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Imlo tekshirish va Topish/Almashtirish (Find & Replace)', '3-12', 45, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Hujjatni chop etishga tayyorlash va PDF formatda saqlash', '3-13', 46, 15, false, 10, 25, 'bunny');

  -- 4-BO'LIM: Google Docs
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Google Docs', 4, 60) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Google Docs interfeysi va imkoniyatlari', '4-1', 47, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Hujjat yaratish, formatlash va onlayn saqlash', '4-2', 48, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Hamkorlikda ishlash: ulashish, izoh qoldirish, taklif rejimi', '4-3', 49, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Shablonlardan foydalanish', '4-4', 50, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Google Docs qo''shimcha vositalari (Add-ons)', '4-5', 51, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Google Docs vs Microsoft Word: farqlari va qo''llash', '4-6', 52, 10, false, 10, 25, 'bunny');

  -- 5-BO'LIM: Microsoft Excel
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Microsoft Excel', 5, 150) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Microsoft Excel interfeysi: katak, satr, ustun, varaq', '5-1', 53, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ma''lumot kiritish va formatlash', '5-2', 54, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Formulalar asoslari: SUM, AVERAGE, MIN, MAX, COUNT', '5-3', 55, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Mantiqiy funksiyalar: IF, AND, OR', '5-4', 56, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'VLOOKUP va HLOOKUP funksiyalari', '5-5', 57, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ma''lumotlarni tartiblash va filtrlash', '5-6', 58, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Diagramma va grafiklar yaratish', '5-7', 59, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Shartli formatlash (Conditional Formatting)', '5-8', 60, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ma''lumotlarni himoyalash va varaqni qulflash', '5-9', 61, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Chop etishga tayyorlash va sahifa sozlamalari', '5-10', 62, 15, false, 10, 25, 'bunny');

  -- 6-BO'LIM: Google Sheets
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Google Sheets', 6, 120) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Google Sheets interfeysi va asosiy imkoniyatlari', '6-1', 63, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Formulalar va funksiyalar (Google Sheets spetsifik)', '6-2', 64, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ma''lumotni import/eksport qilish (CSV, Excel)', '6-3', 65, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Diagrammalar yaratish va sozlash', '6-4', 66, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Hamkorlikda ishlash va ulashish', '6-5', 67, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Google Sheets qo''shimcha funksiyalari: IMPORTDATA, QUERY', '6-6', 68, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Google Forms bilan integratsiya', '6-7', 69, 17, false, 10, 25, 'bunny');

  -- 7-BO'LIM: Taqdimot tayyorlash
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Taqdimot tayyorlash', 7, 120) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Microsoft PowerPoint interfeysi va asosiy tushunchalar', '7-1', 70, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Slayd yaratish va dizayn tanlash', '7-2', 71, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Matn, rasm va multimedia qo''shish', '7-3', 72, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Animatsiya va o''tish effektlari (Transitions & Animations)', '7-4', 73, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Slayd master (Slide Master) bilan ishlash', '7-5', 74, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Google Slides bilan ishlash', '7-6', 75, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Canva yordamida taqdimot yaratish', '7-7', 76, 15, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Samarali taqdimot qilish bo''yicha maslahatlar', '7-8', 77, 15, false, 10, 25, 'bunny');

  -- 8-BO'LIM: PDF va elektron hujjatlar bilan ishlash
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'PDF va elektron hujjatlar bilan ishlash', 8, 90) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'PDF format haqida tushuncha va afzalliklari', '8-1', 78, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'PDF faylni o''qish va ko''rish dasturlari', '8-2', 79, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'PDF yaratish: Word, Excel, va boshqa dasturlardan eksport', '8-3', 80, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'PDF-ni tahrirlash: matn, rasm o''zgartirish', '8-4', 81, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'PDF fayllarni birlashtirish va bo''lish', '8-5', 82, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'PDF faylga elektron imzo qo''yish', '8-6', 83, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'PDF formalarni to''ldirish', '8-7', 84, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'EPUB va elektron kitob formatlari bilan tanishuv', '8-8', 85, 11, false, 10, 25, 'bunny');

  -- 9-BO'LIM: Hujjatlar bilan ishlash (amaliy)
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Hujjatlar bilan ishlash (amaliy)', 9, 75) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Rasmiy xat (ariza, tavsiyanoma) yozish namunalari', '9-1', 86, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Rezyume (CV) yaratish: Word va onlayn servislar orqali', '9-2', 87, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Hisobot va referat tayyorlash qoidalari', '9-3', 88, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ilmiy maqola va kurs ishi formatlash', '9-4', 89, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Shartnoma va hujjat shablonlarini tayyorlash', '9-5', 90, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Hujjatlarni raqamli arxivlash va tashkil qilish', '9-6', 91, 13, false, 10, 25, 'bunny');

  -- 10-BO'LIM: Grafik va media bilan ishlash
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Grafik va media bilan ishlash', 10, 150) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Rasm formatlari haqida tushuncha: JPG, PNG, SVG, GIF', '10-1', 92, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Rasmlarni tahrirlash: o''lchamini o''zgartirish, kesish (crop)', '10-2', 93, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Canva bilan ishlash: dizayn, banner, post yaratish', '10-3', 94, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ekran tasviri (Screenshot) olish usullari', '10-4', 95, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ekranni yozib olish (Screen Recording): OBS Studio', '10-5', 96, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Audio fayllar bilan ishlash: format, konvertatsiya', '10-6', 97, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Video tahrirlash asoslari: CapCut yoki Clipchamp', '10-7', 98, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Video formatlari va sifat (720p, 1080p, 4K) haqida', '10-8', 99, 17, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Onlayn rasm va video tahrirlash vositalari', '10-9', 100, 17, false, 10, 25, 'bunny');

  -- 11-BO'LIM: Xavfsizlik va raqamli gigiena
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Xavfsizlik va raqamli gigiena', 11, 105) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Kiberxavfsizlik asoslari: nima uchun muhim?', '11-1', 101, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Kuchli parol yaratish va parol menejerlari', '11-2', 102, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Ikki bosqichli autentifikatsiya (2FA)', '11-3', 103, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Viruslar va zararli dasturlardan himoyalanish', '11-4', 104, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Antivirus dasturlari va Windows Defender', '11-5', 105, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Shaxsiy ma''lumotlarni himoya qilish (Privacy)', '11-6', 106, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Internetda firibgarlikni aniqlash va oldini olish', '11-7', 107, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Bolalar uchun internet xavfsizligi', '11-8', 108, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Kompyuterda ergonomika: to''g''ri o''tirish va ko''z salomatligi', '11-9', 109, 11, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Raqamli detoks: ekran vaqtini boshqarish', '11-10', 110, 11, false, 10, 25, 'bunny');

  -- 12-BO'LIM: Sun'iy intellekt (AI) dan foydalanish
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Sun''iy intellekt (AI) dan foydalanish', 12, 135) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Sun''iy intellekt nima? AI asoslari va tarixi', '12-1', 111, 14, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'ChatGPT va Claude bilan tanishuv va ishlash', '12-2', 112, 14, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'AI yordamida matn yozish va tahrirlash', '12-3', 113, 14, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'AI bilan rasm yaratish: DALL-E, Midjourney asoslari', '12-4', 114, 14, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'AI yordamida tarjima va til o''rganish', '12-5', 115, 14, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'AI vositalar: Gamma, Perplexity, NotebookLM', '12-6', 116, 14, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'AI bilan video va audio yaratish', '12-7', 117, 14, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'AI dan ta''limda foydalanish: o''quvchi va o''qituvchi uchun', '12-8', 118, 14, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'AI etikasi va cheklovlari haqida', '12-9', 119, 14, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Prompt engineering: AI-ga samarali so''rov yozish san''ati', '12-10', 120, 14, false, 10, 25, 'bunny');

  -- 13-BO'LIM: Bulutli texnologiyalar va hamkorlik vositalari
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Bulutli texnologiyalar va hamkorlik vositalari', 13, 105) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Bulutli texnologiyalar nima? Asosiy tushunchalar', '13-1', 121, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Google Workspace: Drive, Docs, Sheets, Slides ekotizimi', '13-2', 122, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Microsoft 365: OneDrive, Word Online, Teams', '13-3', 123, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Fayl almashish va sinxronlash: Google Drive, Dropbox', '13-4', 124, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Onlayn uchrashuvlar: Zoom, Google Meet asoslari', '13-5', 125, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Zoom/Google Meet: ekran ulashish, yozib olish', '13-6', 126, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Trello va Notion bilan loyiha boshqarish', '13-7', 127, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Google Calendar bilan vaqtni boshqarish', '13-8', 128, 13, false, 10, 25, 'bunny');

  -- 14-BO'LIM: Mobil qurilmalar bilan samarali ishlash
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Mobil qurilmalar bilan samarali ishlash', 14, 60) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Smartfon sozlamalari: umumiy, xavfsizlik, ilovalar', '14-1', 129, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Foydali mobil ilovalar: ofis, skanerlash, eslatma', '14-2', 130, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Smartfondan hujjat skanerlash (CamScanner, Google Lens)', '14-3', 131, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Smartfon va kompyuter o''rtasida fayl almashish', '14-4', 132, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Mobil brauzerdan samarali foydalanish', '14-5', 133, 10, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Telegram bot va mini-ilovalardan foydalanish', '14-6', 134, 10, false, 10, 25, 'bunny');

  -- 15-BO'LIM: Amaliy mini-loyihalar
  INSERT INTO course_sections (course_id, title, order_index, estimated_minutes)
  VALUES (v_course, 'Amaliy mini-loyihalar', 15, 90) RETURNING id INTO v_sec;
  INSERT INTO topics (course_id, section_id, title, slug, order_index, estimated_minutes, is_free_preview, coin_reward, xp_reward, video_provider) VALUES
    (v_course, v_sec, 'Loyiha: O''z rezyumengizni yarating (Word + PDF)', '15-1', 135, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Loyiha: Oila byudjetini Excel/Google Sheets da tuzing', '15-2', 136, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Loyiha: Shaxsiy portfolio taqdimotini tayyorlang', '15-3', 137, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Loyiha: Kichik biznes uchun Canva dizayn yarating', '15-4', 138, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Loyiha: Google Forms orqali so''rovnoma yarating', '15-5', 139, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Loyiha: AI yordamida blog post yozing', '15-6', 140, 13, false, 10, 25, 'bunny'),
    (v_course, v_sec, 'Yakuniy attestatsiya: barcha ko''nikmalar bo''yicha test', '15-7', 141, 13, false, 10, 25, 'bunny');

  UPDATE courses SET total_topics = 141 WHERE id = v_course;
  RAISE NOTICE 'Seed tugadi: 15 bo''lim, 141 dars';
END $$;
