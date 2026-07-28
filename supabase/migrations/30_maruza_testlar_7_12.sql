-- ============================================
-- EduCode — Ma'ruza kursi 7-12 mavzular uchun testlar va topshiriqlar
-- 29_maruza_mavzular_7_12.sql dan KEYIN ishga tushiring.
--
-- Topshiriqlar stdin → stdout tartibida ishlaydi.
-- Qayta ishga tushirilsa eskilarini o'chirib qayta yozadi.
-- ============================================

DO $$
DECLARE
  v_course UUID;
  t_shart UUID; t_lugat UUID; t_while UUID;
  t_funk UUID; t_modul UUID; t_si UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-maruza';

  SELECT id INTO t_shart FROM topics WHERE course_id = v_course AND slug = 'shartlar-va-tarmoqlanish';
  SELECT id INTO t_lugat FROM topics WHERE course_id = v_course AND slug = 'lugat-va-toplam';
  SELECT id INTO t_while FROM topics WHERE course_id = v_course AND slug = 'while-sikli';
  SELECT id INTO t_funk  FROM topics WHERE course_id = v_course AND slug = 'funksiyalar';
  SELECT id INTO t_modul FROM topics WHERE course_id = v_course AND slug = 'modullar';
  SELECT id INTO t_si    FROM topics WHERE course_id = v_course AND slug = 'python-va-suniy-intellekt';

  IF t_shart IS NULL THEN
    RAISE EXCEPTION 'Mavzular topilmadi — avval 29_maruza_mavzular_7_12.sql ni ishga tushiring';
  END IF;

  DELETE FROM quizzes WHERE topic_id IN (t_shart, t_lugat, t_while, t_funk, t_modul, t_si);
  DELETE FROM topic_tasks WHERE topic_id IN (t_shart, t_lugat, t_while, t_funk, t_modul, t_si);

  -- ============================================
  -- 7-MAVZU: Shartlar va tarmoqlanish
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_shart, 'Tenglikni tekshirish uchun qaysi operator ishlatiladi?', 'single',
   '[{"id":"a","text":"=","is_correct":false},
     {"id":"b","text":"==","is_correct":true},
     {"id":"c","text":"===","is_correct":false},
     {"id":"d","text":"equals","is_correct":false}]'::jsonb,
   'Bitta teng belgisi qiymat beradi, ikkitasi taqqoslaydi. Pythonda === yo''q.', 1, 0),

  (t_shart, 'Quyidagi kod nima chiqaradi?<br><code>ball = 95<br>if ball &gt;= 60:<br>&nbsp;&nbsp;&nbsp;&nbsp;print("Qoniqarli")<br>elif ball &gt;= 90:<br>&nbsp;&nbsp;&nbsp;&nbsp;print("A''lo")</code>', 'single',
   '[{"id":"a","text":"A''lo","is_correct":false},
     {"id":"b","text":"Qoniqarli","is_correct":true},
     {"id":"c","text":"Ikkalasi ham","is_correct":false},
     {"id":"d","text":"Hech nima","is_correct":false}]'::jsonb,
   'Shartlar yuqoridan pastga tekshiriladi va birinchi rost topilgani bajariladi. Bu yerda shartlar tartibi noto''g''ri qo''yilgan — qat''iyroq shart yuqorida turishi kerak edi.', 1, 1),

  (t_shart, '<code>and</code> operatori qachon <code>True</code> qaytaradi?', 'single',
   '[{"id":"a","text":"Kamida bitta shart rost bo''lsa","is_correct":false},
     {"id":"b","text":"Ikkala shart ham rost bo''lsa","is_correct":true},
     {"id":"c","text":"Ikkala shart ham yolg''on bo''lsa","is_correct":false},
     {"id":"d","text":"Har doim","is_correct":false}]'::jsonb,
   '"Kamida bittasi" holati uchun or ishlatiladi.', 1, 2),

  (t_shart, 'Sonning musbat, manfiy yoki nol ekanini aniqlash uchun eng mos tuzilma qaysi?', 'single',
   '[{"id":"a","text":"Faqat if","is_correct":false},
     {"id":"b","text":"if - else","is_correct":false},
     {"id":"c","text":"if - elif - else","is_correct":true},
     {"id":"d","text":"while","is_correct":false}]'::jsonb,
   'Uchta bir-birini istisno qiluvchi variant bor, shuning uchun if - elif - else eng mos.', 1, 3),

  (t_shart, 'Qaysi ifodalar <code>True</code> qiymat beradi?', 'multiple',
   '[{"id":"a","text":"5 != 3","is_correct":true},
     {"id":"b","text":"10 &lt;= 10","is_correct":true},
     {"id":"c","text":"not (2 &gt; 1)","is_correct":false},
     {"id":"d","text":"3 &gt; 1 and 1 &gt; 0","is_correct":true}]'::jsonb,
   '2 > 1 rost, not uni yolg''onga aylantiradi. Qolgan uchtasi rost.', 2, 4),

  (t_shart, '<code>0 &lt;= x &lt;= 100</code> yozuvi nimani anglatadi?', 'single',
   '[{"id":"a","text":"x 0 va 100 orasida (chegaralar kiradi)","is_correct":true},
     {"id":"b","text":"x 0 yoki 100 ga teng","is_correct":false},
     {"id":"c","text":"Bu xato yozuv","is_correct":false},
     {"id":"d","text":"x 0 dan katta va 100 dan katta","is_correct":false}]'::jsonb,
   'Pythonda zanjirli taqqoslash matematikadagidek ishlaydi. Bu x >= 0 and x <= 100 ning qisqa ko''rinishi.', 1, 5),

  (t_shart, '<code>else</code> bloki qanday hollarda bajariladi?', 'single',
   '[{"id":"a","text":"Har doim","is_correct":false},
     {"id":"b","text":"Yuqoridagi barcha shartlar yolg''on bo''lganda","is_correct":true},
     {"id":"c","text":"Faqat xato yuz berganda","is_correct":false},
     {"id":"d","text":"Birinchi shart rost bo''lganda","is_correct":false}]'::jsonb,
   'else — qolgan barcha holatlarni qamrab oluvchi blok. Uning o''z sharti yo''q.', 1, 6),

  (t_shart, 'Yilning kabisa yilligini tekshirish sharti qaysi?', 'single',
   '[{"id":"a","text":"yil % 4 == 0","is_correct":false},
     {"id":"b","text":"yil % 4 == 0 and (yil % 100 != 0 or yil % 400 == 0)","is_correct":true},
     {"id":"c","text":"yil % 100 == 0","is_correct":false},
     {"id":"d","text":"yil // 4 == 0","is_correct":false}]'::jsonb,
   'Kabisa yili 4 ga bo''linadi, lekin 100 ga bo''linsa 400 ga ham bo''linishi shart. Shuning uchun 1900 kabisa emas, 2000 esa kabisa.', 2, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_shart, 'Juft yoki toq',
   'Bir butun son kiritiladi. Agar u juft bo''lsa <code>juft</code>, toq bo''lsa <code>toq</code> deb chiqaring.',
   'son = int(input())
# Kodingizni shu yerga yozing',
   'son = int(input())
if son % 2 == 0:
    print("juft")
else:
    print("toq")',
   'python',
   '[{"input":"8","expected_output":"juft","is_hidden":false},
     {"input":"7","expected_output":"toq","is_hidden":false},
     {"input":"0","expected_output":"juft","is_hidden":true},
     {"input":"-3","expected_output":"toq","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Juftlikni qoldiq orqali tekshiring: son % 2"},
     {"order":2,"text":"Qoldiq 0 bo''lsa juft, aks holda toq"}]'::jsonb,
   'easy', 5, 15, 0),

  (t_shart, 'Baho qo''yish',
   'Talabaning bali (0 dan 100 gacha butun son) kiritiladi. Quyidagi shkala bo''yicha bahoni chiqaring:<br>90 va undan yuqori — <code>A''lo</code><br>70-89 — <code>Yaxshi</code><br>60-69 — <code>Qoniqarli</code><br>60 dan past — <code>Qoniqarsiz</code>',
   'ball = int(input())
# Kodingizni shu yerga yozing',
   'ball = int(input())
if ball >= 90:
    print("A''lo")
elif ball >= 70:
    print("Yaxshi")
elif ball >= 60:
    print("Qoniqarli")
else:
    print("Qoniqarsiz")',
   'python',
   '[{"input":"95","expected_output":"A''lo","is_hidden":false},
     {"input":"75","expected_output":"Yaxshi","is_hidden":false},
     {"input":"60","expected_output":"Qoniqarli","is_hidden":false},
     {"input":"42","expected_output":"Qoniqarsiz","is_hidden":true},
     {"input":"90","expected_output":"A''lo","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Eng qat''iy shartni (90) birinchi yozing"},
     {"order":2,"text":"elif ishlatib zanjir tuzing, oxirida else"}]'::jsonb,
   'easy', 5, 15, 1),

  (t_shart, 'Uchburchak mavjudmi?',
   'Uch qatorda uchburchak tomonlari (butun sonlar) kiritiladi. Bunday uchburchak mavjud bo''lsa <code>Ha</code>, aks holda <code>Yoq</code> deb chiqaring.<br>Eslatma: uchburchak mavjud bo''lishi uchun har ikki tomon yig''indisi uchinchisidan katta bo''lishi kerak.',
   'a = int(input())
b = int(input())
c = int(input())
# Kodingizni shu yerga yozing',
   'a = int(input())
b = int(input())
c = int(input())
if a + b > c and a + c > b and b + c > a:
    print("Ha")
else:
    print("Yoq")',
   'python',
   '[{"input":"3\n4\n5","expected_output":"Ha","is_hidden":false},
     {"input":"1\n2\n10","expected_output":"Yoq","is_hidden":false},
     {"input":"2\n2\n4","expected_output":"Yoq","is_hidden":true},
     {"input":"6\n6\n6","expected_output":"Ha","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Uchta shartni birdan tekshirish kerak"},
     {"order":2,"text":"and bilan birlashtiring: a+b>c and a+c>b and b+c>a"}]'::jsonb,
   'medium', 8, 20, 2);

  -- ============================================
  -- 8-MAVZU: Lug'at va to'plam
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_lugat, 'Lug''at qanday qavs bilan yoziladi?', 'single',
   '[{"id":"a","text":"[ ]","is_correct":false},
     {"id":"b","text":"{ }","is_correct":true},
     {"id":"c","text":"( )","is_correct":false},
     {"id":"d","text":"&lt; &gt;","is_correct":false}]'::jsonb,
   'Lug''at va to''plam figurali qavsda yoziladi. Ro''yxat kvadrat, tuple oddiy qavsda.', 1, 0),

  (t_lugat, 'Mavjud bo''lmagan kalitga <code>d["yoq"]</code> orqali murojaat qilinsa nima bo''ladi?', 'single',
   '[{"id":"a","text":"None qaytadi","is_correct":false},
     {"id":"b","text":"KeyError xatosi chiqadi","is_correct":true},
     {"id":"c","text":"Bo''sh matn qaytadi","is_correct":false},
     {"id":"d","text":"Yangi kalit yaratiladi","is_correct":false}]'::jsonb,
   'Xatosiz o''qish uchun get() metodi ishlatiladi: d.get("yoq") None qaytaradi.', 1, 1),

  (t_lugat, '<code>{1, 2, 2, 3, 3, 3}</code> to''plamda nechta element bo''ladi?', 'single',
   '[{"id":"a","text":"6","is_correct":false},
     {"id":"b","text":"3","is_correct":true},
     {"id":"c","text":"1","is_correct":false},
     {"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'To''plam takrorlarni saqlamaydi, faqat {1, 2, 3} qoladi.', 1, 2),

  (t_lugat, 'Bo''sh to''plam qanday yaratiladi?', 'single',
   '[{"id":"a","text":"{}","is_correct":false},
     {"id":"b","text":"set()","is_correct":true},
     {"id":"c","text":"[]","is_correct":false},
     {"id":"d","text":"empty_set()","is_correct":false}]'::jsonb,
   '{} bo''sh LUG''AT yaratadi. Bo''sh to''plam uchun set() yozilishi shart.', 1, 3),

  (t_lugat, 'Lug''atdagi kalit va qiymatlarni birdan olish uchun qaysi metod?', 'single',
   '[{"id":"a","text":"keys()","is_correct":false},
     {"id":"b","text":"values()","is_correct":false},
     {"id":"c","text":"items()","is_correct":true},
     {"id":"d","text":"pairs()","is_correct":false}]'::jsonb,
   'for k, v in d.items(): — eng qulay usul.', 1, 4),

  (t_lugat, '<code>{1,2,3} &amp; {2,3,4}</code> natijasi nima?', 'single',
   '[{"id":"a","text":"{1, 2, 3, 4}","is_correct":false},
     {"id":"b","text":"{2, 3}","is_correct":true},
     {"id":"c","text":"{1, 4}","is_correct":false},
     {"id":"d","text":"{ }","is_correct":false}]'::jsonb,
   '& — kesishma, ya''ni ikkala to''plamda ham bor elementlar.', 1, 5),

  (t_lugat, 'Qaysi holatlarda to''plam (set) eng mos tanlov bo''ladi?', 'multiple',
   '[{"id":"a","text":"Takrorlarni yo''qotish kerak bo''lganda","is_correct":true},
     {"id":"b","text":"Element bor-yo''qligini tez tekshirish kerak bo''lganda","is_correct":true},
     {"id":"c","text":"Elementlar tartibi muhim bo''lganda","is_correct":false},
     {"id":"d","text":"Ikki guruhning umumiy a''zolarini topishda","is_correct":true}]'::jsonb,
   'To''plam tartibni saqlamaydi — tartib kerak bo''lsa ro''yxat ishlatiladi.', 2, 6),

  (t_lugat, 'Lug''atdagi juftliklar sonini qanday bilamiz?', 'single',
   '[{"id":"a","text":"count(d)","is_correct":false},
     {"id":"b","text":"len(d)","is_correct":true},
     {"id":"c","text":"d.size()","is_correct":false},
     {"id":"d","text":"sum(d)","is_correct":false}]'::jsonb,
   'len() ro''yxat, matn, lug''at va to''plam uchun bir xil ishlaydi.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_lugat, 'Takrorlarni yo''qotish',
   'Birinchi qatorda sonlar soni <code>n</code>, keyingi qatorda <code>n</code> ta son bo''shliq bilan kiritiladi. Takrorlarni yo''qotib, sonlarni o''sish tartibida bitta qatorda bo''shliq bilan chiqaring.',
   'n = int(input())
sonlar = list(map(int, input().split()))
# Kodingizni shu yerga yozing',
   'n = int(input())
sonlar = list(map(int, input().split()))
noyob = sorted(set(sonlar))
print(*noyob)',
   'python',
   '[{"input":"6\n5 2 5 8 2 9","expected_output":"2 5 8 9","is_hidden":false},
     {"input":"4\n1 1 1 1","expected_output":"1","is_hidden":false},
     {"input":"5\n3 1 4 1 5","expected_output":"1 3 4 5","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"set() takrorlarni yo''qotadi"},
     {"order":2,"text":"sorted() tartiblaydi, print(*royxat) bo''shliq bilan chiqaradi"}]'::jsonb,
   'medium', 8, 20, 0),

  (t_lugat, 'Harflar sanog''i',
   'Bir qator matn kiritiladi (bo''shliqsiz, kichik harflar). Har bir harf necha marta uchraganini alifbo tartibida chiqaring.<br>Har qator <code>harf sanoq</code> ko''rinishida bo''lsin.',
   'matn = input()
sanoq = {}
# Kodingizni shu yerga yozing',
   'matn = input()
sanoq = {}
for harf in matn:
    sanoq[harf] = sanoq.get(harf, 0) + 1
for harf in sorted(sanoq):
    print(harf, sanoq[harf])',
   'python',
   '[{"input":"salom","expected_output":"a 1\nl 1\nm 1\no 1\ns 1","is_hidden":false},
     {"input":"aabbc","expected_output":"a 2\nb 2\nc 1","is_hidden":false},
     {"input":"python","expected_output":"h 1\nn 1\no 1\np 1\nt 1\ny 1","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"sanoq.get(harf, 0) + 1 — kalit bo''lmasa 0 dan boshlaydi"},
     {"order":2,"text":"sorted(sanoq) kalitlarni alifbo tartibida beradi"}]'::jsonb,
   'medium', 8, 20, 1),

  (t_lugat, 'Ikki guruhning umumiy a''zolari',
   'To''rt qator kiritiladi: 1-guruh a''zolari soni, ularning ismlari bo''shliq bilan, 2-guruh a''zolari soni, ularning ismlari.<br>Ikkala guruhda ham bor ismlarni alifbo tartibida bitta qatorda chiqaring. Umumiy a''zo bo''lmasa <code>yoq</code> deb yozing.',
   'n = int(input())
a = set(input().split())
m = int(input())
b = set(input().split())
# Kodingizni shu yerga yozing',
   'n = int(input())
a = set(input().split())
m = int(input())
b = set(input().split())
umumiy = sorted(a & b)
if umumiy:
    print(*umumiy)
else:
    print("yoq")',
   'python',
   '[{"input":"3\nali vali sardor\n3\nvali sardor malika","expected_output":"sardor vali","is_hidden":false},
     {"input":"2\nali vali\n2\nbek malika","expected_output":"yoq","is_hidden":false},
     {"input":"2\na b\n2\nb a","expected_output":"a b","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Kesishma uchun & operatoridan foydalaning"},
     {"order":2,"text":"Bo''sh ro''yxat if da False beradi"}]'::jsonb,
   'medium', 8, 20, 2);

  -- ============================================
  -- 9-MAVZU: While sikli
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_while, '<code>while</code> sikli qachon to''xtaydi?', 'single',
   '[{"id":"a","text":"Belgilangan marta takrorlangach","is_correct":false},
     {"id":"b","text":"Shart yolg''on bo''lganda","is_correct":true},
     {"id":"c","text":"Hech qachon","is_correct":false},
     {"id":"d","text":"10 marta aylangach","is_correct":false}]'::jsonb,
   'while har aylanishdan oldin shartni tekshiradi. Shart False bo''lishi bilan sikl tugaydi.', 1, 0),

  (t_while, 'Nima uchun bu sikl cheksiz?<br><code>i = 1<br>while i &lt;= 5:<br>&nbsp;&nbsp;&nbsp;&nbsp;print(i)</code>', 'single',
   '[{"id":"a","text":"Shart noto''g''ri yozilgan","is_correct":false},
     {"id":"b","text":"i ning qiymati sikl ichida o''zgarmaydi","is_correct":true},
     {"id":"c","text":"print() siklni to''xtatadi","is_correct":false},
     {"id":"d","text":"i boshlang''ich qiymat olmagan","is_correct":false}]'::jsonb,
   'i har doim 1 bo''lib qoladi, shuning uchun shart hech qachon yolg''on bo''lmaydi. i += 1 yozilishi kerak edi.', 1, 1),

  (t_while, '<code>break</code> nima qiladi?', 'single',
   '[{"id":"a","text":"Siklni butunlay tugatadi","is_correct":true},
     {"id":"b","text":"Keyingi aylanishga o''tadi","is_correct":false},
     {"id":"c","text":"Dasturni to''xtatadi","is_correct":false},
     {"id":"d","text":"Shartni teskarisiga o''zgartiradi","is_correct":false}]'::jsonb,
   'break sikldan chiqadi, dastur esa sikldan keyingi qatordan davom etadi.', 1, 2),

  (t_while, '<code>continue</code> nima qiladi?', 'single',
   '[{"id":"a","text":"Siklni tugatadi","is_correct":false},
     {"id":"b","text":"Joriy aylanishning qolganini o''tkazib, keyingisiga o''tadi","is_correct":true},
     {"id":"c","text":"Siklni boshidan qayta boshlaydi","is_correct":false},
     {"id":"d","text":"Hech nima qilmaydi","is_correct":false}]'::jsonb,
   'continue faqat joriy aylanishning qolgan qismini o''tkazib yuboradi, sikl davom etadi.', 1, 3),

  (t_while, 'Bu kod nechta son chiqaradi?<br><code>i = 0<br>while i &lt; 3:<br>&nbsp;&nbsp;&nbsp;&nbsp;print(i)<br>&nbsp;&nbsp;&nbsp;&nbsp;i += 1</code>', 'single',
   '[{"id":"a","text":"2 ta","is_correct":false},
     {"id":"b","text":"3 ta","is_correct":true},
     {"id":"c","text":"4 ta","is_correct":false},
     {"id":"d","text":"Cheksiz","is_correct":false}]'::jsonb,
   '0, 1, 2 chiqadi. i=3 bo''lganda shart yolg''on bo''ladi.', 1, 4),

  (t_while, '<code>son % 10</code> va <code>son // 10</code> juftligi nima uchun ishlatiladi?', 'single',
   '[{"id":"a","text":"Sonni ikkiga bo''lish uchun","is_correct":false},
     {"id":"b","text":"Sonning raqamlarini birma-bir ajratib olish uchun","is_correct":true},
     {"id":"c","text":"Sonni matnga aylantirish uchun","is_correct":false},
     {"id":"d","text":"Sonni yaxlitlash uchun","is_correct":false}]'::jsonb,
   '% 10 oxirgi raqamni beradi, // 10 uni tashlaydi. Sikl ichida takrorlansa barcha raqamlar olinadi.', 2, 5),

  (t_while, 'Qaysi holatlarda <code>while</code> <code>for</code> dan afzalroq?', 'multiple',
   '[{"id":"a","text":"Foydalanuvchi to''g''ri javob bermaguncha so''rashda","is_correct":true},
     {"id":"b","text":"Ro''yxatning har bir elementini ko''rib chiqishda","is_correct":false},
     {"id":"c","text":"Takrorlar soni oldindan noma''lum bo''lganda","is_correct":true},
     {"id":"d","text":"Aniq 10 marta takrorlashda","is_correct":false}]'::jsonb,
   'Takrorlar soni ma''lum bo''lsa for + range() qulayroq va xavfsizroq.', 2, 6),

  (t_while, '<code>while True:</code> qanday holatda xavfsiz?', 'single',
   '[{"id":"a","text":"Hech qachon xavfsiz emas","is_correct":false},
     {"id":"b","text":"Ichida break bo''lsa","is_correct":true},
     {"id":"c","text":"Ichida print() bo''lsa","is_correct":false},
     {"id":"d","text":"Har doim xavfsiz","is_correct":false}]'::jsonb,
   'while True ataylab cheksiz sikl. Undan chiqishning yagona yo''li — break yoki return.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_while, 'Nolgacha yig''indi',
   'Har qatorda bittadan butun son kiritiladi. <code>0</code> kiritilgunga qadar sonlarni qo''shib boring va yig''indini chiqaring. <code>0</code> yig''indiga kirmaydi.',
   'jami = 0
# Kodingizni shu yerga yozing',
   'jami = 0
son = int(input())
while son != 0:
    jami += son
    son = int(input())
print(jami)',
   'python',
   '[{"input":"5\n10\n15\n0","expected_output":"30","is_hidden":false},
     {"input":"0","expected_output":"0","is_hidden":false},
     {"input":"-3\n3\n0","expected_output":"0","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Birinchi sonni sikldan OLDIN o''qing"},
     {"order":2,"text":"Sikl ichida qo''shing va keyingi sonni o''qing"}]'::jsonb,
   'medium', 8, 20, 0),

  (t_while, 'Raqamlar yig''indisi',
   'Bir musbat butun son kiritiladi. Uning raqamlari yig''indisini chiqaring.<br>Masalan <code>472</code> uchun javob <code>13</code> (4+7+2).',
   'son = int(input())
yigindi = 0
# Kodingizni shu yerga yozing',
   'son = int(input())
yigindi = 0
while son > 0:
    yigindi += son % 10
    son //= 10
print(yigindi)',
   'python',
   '[{"input":"472","expected_output":"13","is_hidden":false},
     {"input":"9","expected_output":"9","is_hidden":false},
     {"input":"1000","expected_output":"1","is_hidden":true},
     {"input":"99999","expected_output":"45","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"son % 10 oxirgi raqamni beradi"},
     {"order":2,"text":"son //= 10 oxirgi raqamni tashlaydi, sikl son 0 bo''lguncha davom etadi"}]'::jsonb,
   'medium', 8, 20, 1),

  (t_while, 'Sonni teskari o''girish',
   'Bir musbat butun son kiritiladi. Uning raqamlarini teskari tartibda joylashtirib, hosil bo''lgan sonni chiqaring.<br>Masalan <code>1234</code> → <code>4321</code>.',
   'son = int(input())
teskari = 0
# Kodingizni shu yerga yozing',
   'son = int(input())
teskari = 0
while son > 0:
    teskari = teskari * 10 + son % 10
    son //= 10
print(teskari)',
   'python',
   '[{"input":"1234","expected_output":"4321","is_hidden":false},
     {"input":"7","expected_output":"7","is_hidden":false},
     {"input":"1200","expected_output":"21","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Har qadamda natijani 10 ga ko''paytirib, yangi raqamni qo''shing"},
     {"order":2,"text":"teskari = teskari * 10 + son % 10"}]'::jsonb,
   'hard', 12, 30, 2);

  -- ============================================
  -- 10-MAVZU: Funksiyalar
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_funk, 'Funksiya qaysi kalit so''z bilan e''lon qilinadi?', 'single',
   '[{"id":"a","text":"function","is_correct":false},
     {"id":"b","text":"def","is_correct":true},
     {"id":"c","text":"func","is_correct":false},
     {"id":"d","text":"define","is_correct":false}]'::jsonb,
   'def — define so''zining qisqartmasi.', 1, 0),

  (t_funk, '<code>return</code> va <code>print()</code> farqi nimada?', 'single',
   '[{"id":"a","text":"Farqi yo''q","is_correct":false},
     {"id":"b","text":"return qiymat qaytaradi, print() ekranga chiqaradi","is_correct":true},
     {"id":"c","text":"return faqat sonlar uchun","is_correct":false},
     {"id":"d","text":"print() tezroq ishlaydi","is_correct":false}]'::jsonb,
   'return natijani keyingi hisoblarda ishlatish imkonini beradi, print() esa faqat ko''rsatadi.', 1, 1),

  (t_funk, 'Quyidagi kod nima chiqaradi?<br><code>def f(x):<br>&nbsp;&nbsp;&nbsp;&nbsp;return x * 2<br>&nbsp;&nbsp;&nbsp;&nbsp;print("salom")<br><br>print(f(3))</code>', 'single',
   '[{"id":"a","text":"6 va salom","is_correct":false},
     {"id":"b","text":"6","is_correct":true},
     {"id":"c","text":"salom","is_correct":false},
     {"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'return bajarilishi bilan funksiya tugaydi — undan keyingi qatorlar hech qachon ishlamaydi.', 1, 2),

  (t_funk, 'Funksiya ichida yaratilgan o''zgaruvchi tashqarida ishlaydimi?', 'single',
   '[{"id":"a","text":"Ha, har doim","is_correct":false},
     {"id":"b","text":"Yo''q, u lokal","is_correct":true},
     {"id":"c","text":"Faqat sonlar uchun ishlaydi","is_correct":false},
     {"id":"d","text":"Funksiya nomiga bog''liq","is_correct":false}]'::jsonb,
   'Lokal o''zgaruvchi funksiya tugashi bilan yo''qoladi. Bu funksiyalarni bir-biridan mustaqil qiladi.', 1, 3),

  (t_funk, 'Parametr va argument farqi nimada?', 'single',
   '[{"id":"a","text":"Parametr — e''londagi nom, argument — chaqirishdagi qiymat","is_correct":true},
     {"id":"b","text":"Argument — e''londagi nom, parametr — chaqirishdagi qiymat","is_correct":false},
     {"id":"c","text":"Ular bir xil narsa","is_correct":false},
     {"id":"d","text":"Parametr faqat sonlar bo''ladi","is_correct":false}]'::jsonb,
   'def kvadrat(x) — bu yerda x parametr. kvadrat(5) — bu yerda 5 argument.', 1, 4),

  (t_funk, '<code>def f(a, b=10)</code> uchun <code>f(3)</code> chaqiruvi qanday ishlaydi?', 'single',
   '[{"id":"a","text":"Xato beradi","is_correct":false},
     {"id":"b","text":"a=3, b=10 bo''ladi","is_correct":true},
     {"id":"c","text":"a=3, b=None bo''ladi","is_correct":false},
     {"id":"d","text":"a=10, b=3 bo''ladi","is_correct":false}]'::jsonb,
   'b uchun sukut qiymat berilgan, shuning uchun uni tashlab ketish mumkin.', 1, 5),

  (t_funk, 'Yaxshi funksiyaning belgilari qaysilar?', 'multiple',
   '[{"id":"a","text":"Bitta aniq vazifani bajaradi","is_correct":true},
     {"id":"b","text":"Nomi vazifasini aytib turadi","is_correct":true},
     {"id":"c","text":"Iloji boricha uzun bo''ladi","is_correct":false},
     {"id":"d","text":"Natijani return bilan qaytaradi","is_correct":true}]'::jsonb,
   'Funksiya qancha qisqa va bir vazifaga qaratilgan bo''lsa, shuncha oson tushuniladi va sinovdan o''tkaziladi.', 2, 6),

  (t_funk, '<code>return max(a), min(a)</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"Faqat max qiymatni","is_correct":false},
     {"id":"b","text":"Ikki qiymatli tuple","is_correct":true},
     {"id":"c","text":"Ro''yxat","is_correct":false},
     {"id":"d","text":"Xato beradi","is_correct":false}]'::jsonb,
   'Vergul bilan ajratilgan qiymatlar tuple hosil qiladi. Uni k, m = f(a) ko''rinishida ajratib olish mumkin.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_funk, 'Kvadrat funksiyasi',
   'Sonning kvadratini qaytaruvchi <code>kvadrat</code> funksiyasini yozing. Keyin bitta son kiritib, uning kvadratini chiqaring.',
   'def kvadrat(x):
    # Kodingizni shu yerga yozing
    pass

son = int(input())
print(kvadrat(son))',
   'def kvadrat(x):
    return x * x

son = int(input())
print(kvadrat(son))',
   'python',
   '[{"input":"5","expected_output":"25","is_hidden":false},
     {"input":"-3","expected_output":"9","is_hidden":false},
     {"input":"0","expected_output":"0","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"pass o''rniga return yozing"},
     {"order":2,"text":"return x * x yoki return x ** 2"}]'::jsonb,
   'easy', 5, 15, 0),

  (t_funk, 'O''rtacha qiymat funksiyasi',
   'Ro''yxatdagi sonlarning o''rtachasini qaytaruvchi <code>ortacha</code> funksiyasini yozing.<br>Birinchi qatorda sonlar soni, ikkinchi qatorda sonlar bo''shliq bilan kiritiladi. Natijani 2 xonagacha yaxlitlab chiqaring.',
   'def ortacha(sonlar):
    # Kodingizni shu yerga yozing
    pass

n = int(input())
sonlar = list(map(int, input().split()))
print(f"{ortacha(sonlar):.2f}")',
   'def ortacha(sonlar):
    return sum(sonlar) / len(sonlar)

n = int(input())
sonlar = list(map(int, input().split()))
print(f"{ortacha(sonlar):.2f}")',
   'python',
   '[{"input":"4\n10 20 30 40","expected_output":"25.00","is_hidden":false},
     {"input":"3\n1 2 4","expected_output":"2.33","is_hidden":false},
     {"input":"1\n7","expected_output":"7.00","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"O''rtacha = yig''indi / elementlar soni"},
     {"order":2,"text":"sum(sonlar) / len(sonlar)"}]'::jsonb,
   'medium', 8, 20, 1),

  (t_funk, 'Tub sonni aniqlash',
   'Berilgan sonning tub ekanini aniqlaydigan <code>tubmi</code> funksiyasini yozing. U <code>True</code> yoki <code>False</code> qaytarsin.<br>Bitta son kiritiladi; tub bo''lsa <code>tub</code>, aks holda <code>tub emas</code> deb chiqaring.<br>Eslatma: 1 tub son emas.',
   'def tubmi(n):
    # Kodingizni shu yerga yozing
    pass

son = int(input())
if tubmi(son):
    print("tub")
else:
    print("tub emas")',
   'def tubmi(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True

son = int(input())
if tubmi(son):
    print("tub")
else:
    print("tub emas")',
   'python',
   '[{"input":"7","expected_output":"tub","is_hidden":false},
     {"input":"12","expected_output":"tub emas","is_hidden":false},
     {"input":"1","expected_output":"tub emas","is_hidden":true},
     {"input":"97","expected_output":"tub","is_hidden":true},
     {"input":"2","expected_output":"tub","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"2 dan kichik sonlar tub emas"},
     {"order":2,"text":"Bo''luvchini faqat ildizgacha tekshirish yetarli: while i * i <= n"}]'::jsonb,
   'hard', 12, 30, 2);

  -- ============================================
  -- 11-MAVZU: Modullar
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_modul, 'Modulni ulash uchun qaysi kalit so''z ishlatiladi?', 'single',
   '[{"id":"a","text":"include","is_correct":false},
     {"id":"b","text":"import","is_correct":true},
     {"id":"c","text":"using","is_correct":false},
     {"id":"d","text":"require","is_correct":false}]'::jsonb,
   'Pythonda modul import kalit so''zi bilan ulanadi.', 1, 0),

  (t_modul, '<code>import math</code> dan keyin kvadrat ildiz qanday hisoblanadi?', 'single',
   '[{"id":"a","text":"sqrt(16)","is_correct":false},
     {"id":"b","text":"math.sqrt(16)","is_correct":true},
     {"id":"c","text":"math(sqrt(16))","is_correct":false},
     {"id":"d","text":"16.sqrt()","is_correct":false}]'::jsonb,
   'Oddiy import da funksiyaga modul.funksiya ko''rinishida murojaat qilinadi.', 1, 1),

  (t_modul, '<code>random.randint(1, 6)</code> qanday qiymatlar qaytarishi mumkin?', 'single',
   '[{"id":"a","text":"1 dan 5 gacha","is_correct":false},
     {"id":"b","text":"1 dan 6 gacha (ikkalasi ham kiradi)","is_correct":true},
     {"id":"c","text":"0 dan 6 gacha","is_correct":false},
     {"id":"d","text":"2 dan 6 gacha","is_correct":false}]'::jsonb,
   'range() dan farqli o''laroq randint() da oxirgi son ham kiradi.', 1, 2),

  (t_modul, '<code>math.floor(4.9)</code> nima qaytaradi?', 'single',
   '[{"id":"a","text":"5","is_correct":false},
     {"id":"b","text":"4","is_correct":true},
     {"id":"c","text":"4.9","is_correct":false},
     {"id":"d","text":"4.0","is_correct":false}]'::jsonb,
   'floor() pastga yaxlitlaydi, ceil() yuqoriga. round() esa eng yaqiniga.', 1, 3),

  (t_modul, 'Qaysi funksiyalar uchun modul ulash SHART EMAS?', 'multiple',
   '[{"id":"a","text":"len()","is_correct":true},
     {"id":"b","text":"abs()","is_correct":true},
     {"id":"c","text":"sqrt()","is_correct":false},
     {"id":"d","text":"round()","is_correct":true}]'::jsonb,
   'len(), abs(), round(), sum(), max(), min() — o''rnatilgan funksiyalar. sqrt() esa math modulida.', 2, 4),

  (t_modul, '<code>from math import sqrt</code> yozilsa qanday chaqiriladi?', 'single',
   '[{"id":"a","text":"math.sqrt(9)","is_correct":false},
     {"id":"b","text":"sqrt(9)","is_correct":true},
     {"id":"c","text":"from.sqrt(9)","is_correct":false},
     {"id":"d","text":"import.sqrt(9)","is_correct":false}]'::jsonb,
   'from ... import bilan olingan nom to''g''ridan-to''g''ri ishlatiladi.', 1, 5),

  (t_modul, 'Tashqi kutubxona qanday o''rnatiladi?', 'single',
   '[{"id":"a","text":"Dastur ichida import install yozib","is_correct":false},
     {"id":"b","text":"Terminalda pip install nomi buyrug''i bilan","is_correct":true},
     {"id":"c","text":"Faylni qo''lda nusxalab","is_correct":false},
     {"id":"d","text":"Python o''zi avtomatik o''rnatadi","is_correct":false}]'::jsonb,
   'pip — Python paketlar menejeri. Buyruq terminalda beriladi, dastur kodida emas.', 1, 6),

  (t_modul, 'O''zingiz yozgan <code>hisob.py</code> faylini modul sifatida ishlatish mumkinmi?', 'single',
   '[{"id":"a","text":"Ha, import hisob orqali","is_correct":true},
     {"id":"b","text":"Yo''q, faqat standart modullar ishlatiladi","is_correct":false},
     {"id":"c","text":"Faqat pip ga yuklangandan keyin","is_correct":false},
     {"id":"d","text":"Faqat fayl nomi module.py bo''lsa","is_correct":false}]'::jsonb,
   'Har qanday .py fayl modul bo''la oladi. Kodni fayllarga ajratish katta loyihalarda muhim.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_modul, 'Gipotenuza',
   'To''g''ri burchakli uchburchakning ikki kateti (butun sonlar) ikki qatorda kiritiladi. Gipotenuza uzunligini 2 xonagacha yaxlitlab chiqaring. <code>math</code> modulidan foydalaning.',
   'import math
a = int(input())
b = int(input())
# Kodingizni shu yerga yozing',
   'import math
a = int(input())
b = int(input())
print(f"{math.sqrt(a * a + b * b):.2f}")',
   'python',
   '[{"input":"3\n4","expected_output":"5.00","is_hidden":false},
     {"input":"5\n12","expected_output":"13.00","is_hidden":false},
     {"input":"1\n1","expected_output":"1.41","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Pifagor teoremasi: c = ildiz(a² + b²)"},
     {"order":2,"text":"math.sqrt() va f-string ichida :.2f ishlating"}]'::jsonb,
   'easy', 5, 15, 0),

  (t_modul, 'EKUB va EKUK',
   'Ikki butun son kiritiladi. Birinchi qatorda ularning eng katta umumiy bo''luvchisini (EKUB), ikkinchisida eng kichik umumiy karralisini (EKUK) chiqaring.<br><code>math.gcd()</code> dan foydalanish mumkin.',
   'import math
a = int(input())
b = int(input())
# Kodingizni shu yerga yozing',
   'import math
a = int(input())
b = int(input())
ekub = math.gcd(a, b)
print(ekub)
print(a * b // ekub)',
   'python',
   '[{"input":"12\n18","expected_output":"6\n36","is_hidden":false},
     {"input":"7\n5","expected_output":"1\n35","is_hidden":false},
     {"input":"100\n25","expected_output":"25\n100","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"EKUB uchun math.gcd(a, b)"},
     {"order":2,"text":"EKUK = a * b // EKUB"}]'::jsonb,
   'medium', 8, 20, 1);

  -- ============================================
  -- 12-MAVZU: Python va sun'iy intellekt
  -- ============================================
  INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
  (t_si, 'Mashinaviy o''qitishning an''anaviy dasturlashdan asosiy farqi nimada?', 'single',
   '[{"id":"a","text":"Model qoidani misollardan o''zi topadi","is_correct":true},
     {"id":"b","text":"Dasturchi barcha qoidalarni qo''lda yozadi","is_correct":false},
     {"id":"c","text":"Faqat Python emas, boshqa tilda yoziladi","is_correct":false},
     {"id":"d","text":"Ma''lumot kerak emas","is_correct":false}]'::jsonb,
   'An''anaviy dasturda: qoida + ma''lumot → javob. Mashinaviy o''qitishda: ma''lumot + javob → qoida.', 1, 0),

  (t_si, 'Nima uchun sun''iy intellektda ko''pincha Python tanlanadi?', 'multiple',
   '[{"id":"a","text":"Sintaksisi sodda, g''oyani tez sinash mumkin","is_correct":true},
     {"id":"b","text":"Kuchli kutubxonalar mavjud","is_correct":true},
     {"id":"c","text":"Eng tez ishlaydigan til","is_correct":false},
     {"id":"d","text":"Katta hamjamiyat va tayyor yechimlar","is_correct":true}]'::jsonb,
   'Python eng tez til emas — og''ir hisoblar C tilida yozilgan kutubxonalarga topshiriladi.', 2, 1),

  (t_si, 'Ma''lumotlar to''plamidagi "label" (nishon) nima?', 'single',
   '[{"id":"a","text":"Kirish belgisi","is_correct":false},
     {"id":"b","text":"Model bashorat qilishi kerak bo''lgan javob","is_correct":true},
     {"id":"c","text":"Ma''lumot fayli nomi","is_correct":false},
     {"id":"d","text":"Modelning nomi","is_correct":false}]'::jsonb,
   'Uy narxini bashorat qilishda maydon va xonalar soni — belgilar (features), narx — nishon (label).', 1, 2),

  (t_si, 'Jadval ko''rinishidagi ma''lumotni tahlil qilish uchun qaysi kutubxona ishlatiladi?', 'single',
   '[{"id":"a","text":"pandas","is_correct":true},
     {"id":"b","text":"random","is_correct":false},
     {"id":"c","text":"datetime","is_correct":false},
     {"id":"d","text":"turtle","is_correct":false}]'::jsonb,
   'pandas — jadvallar (DataFrame) bilan ishlash uchun asosiy kutubxona.', 1, 3),

  (t_si, 'Modelni o''qitish uchun qaysi metod chaqiriladi?', 'single',
   '[{"id":"a","text":"predict()","is_correct":false},
     {"id":"b","text":"fit()","is_correct":true},
     {"id":"c","text":"train_model()","is_correct":false},
     {"id":"d","text":"learn()","is_correct":false}]'::jsonb,
   'scikit-learn da fit() o''qitadi, predict() bashorat qiladi.', 1, 4),

  (t_si, 'To''g''ri javoblar oldindan ma''lum bo''lgan o''qitish turi qanday ataladi?', 'single',
   '[{"id":"a","text":"Nazorat ostida o''qitish","is_correct":true},
     {"id":"b","text":"Nazoratsiz o''qitish","is_correct":false},
     {"id":"c","text":"Mustahkamlab o''qitish","is_correct":false},
     {"id":"d","text":"Chuqur o''qitish","is_correct":false}]'::jsonb,
   'Nazorat ostida o''qitishda har bir misol uchun to''g''ri javob beriladi. Spam aniqlash — tipik misol.', 1, 5),

  (t_si, 'Ma''lumotni train va test qismlariga nima uchun ajratamiz?', 'single',
   '[{"id":"a","text":"Xotirani tejash uchun","is_correct":false},
     {"id":"b","text":"Model ko''rmagan ma''lumotda qanchalik ishlashini tekshirish uchun","is_correct":true},
     {"id":"c","text":"O''qitishni tezlashtirish uchun","is_correct":false},
     {"id":"d","text":"Bu majburiy emas","is_correct":false}]'::jsonb,
   'Model o''zi o''rgangan ma''lumotda yaxshi natija berishi tabiiy. Haqiqiy sifat faqat yangi ma''lumotda ko''rinadi.', 2, 6),

  (t_si, 'Sun''iy intellekt natijalariga qanday yondashish to''g''ri?', 'single',
   '[{"id":"a","text":"Har doim to''g''ri deb qabul qilish","is_correct":false},
     {"id":"b","text":"Tekshirilishi kerak bo''lgan taxmin sifatida qarash","is_correct":true},
     {"id":"c","text":"Butunlay e''tiborsiz qoldirish","is_correct":false},
     {"id":"d","text":"Faqat sonli natijalarga ishonish","is_correct":false}]'::jsonb,
   'Model o''zi o''rgangan ma''lumotdan yaxshiroq bo''la olmaydi. Ma''lumot bir tomonlama bo''lsa, natija ham adolatsiz chiqadi.', 1, 7);

  INSERT INTO topic_tasks (topic_id, title, description, starter_code, solution_code, language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index) VALUES
  (t_si, 'Oddiy bashorat: chiziqli bog''liqlik',
   'Model o''rgangan bog''liqlik: <code>narx = 5 * maydon</code> (mln so''m).<br>Bir qatorda uy maydoni (butun son) kiritiladi. Bashorat qilingan narxni chiqaring.<br>Bu — eng sodda ko''rinishdagi bashorat funksiyasi.',
   'def bashorat(maydon):
    # Kodingizni shu yerga yozing
    pass

m = int(input())
print(bashorat(m))',
   'def bashorat(maydon):
    return 5 * maydon

m = int(input())
print(bashorat(m))',
   'python',
   '[{"input":"40","expected_output":"200","is_hidden":false},
     {"input":"70","expected_output":"350","is_hidden":false},
     {"input":"100","expected_output":"500","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Funksiya maydonni 5 ga ko''paytirib qaytarsin"},
     {"order":2,"text":"return 5 * maydon"}]'::jsonb,
   'easy', 5, 15, 0),

  (t_si, 'Bashorat aniqligini baholash',
   'Model bashoratlari va haqiqiy qiymatlar berilgan. Modelning o''rtacha absolyut xatosini (MAE) hisoblang.<br>1-qator: qiymatlar soni <code>n</code><br>2-qator: <code>n</code> ta bashorat qilingan qiymat<br>3-qator: <code>n</code> ta haqiqiy qiymat<br>Natijani 2 xonagacha yaxlitlab chiqaring.',
   'n = int(input())
bashorat = list(map(int, input().split()))
haqiqiy = list(map(int, input().split()))
# Kodingizni shu yerga yozing',
   'n = int(input())
bashorat = list(map(int, input().split()))
haqiqiy = list(map(int, input().split()))
xato = 0
for i in range(n):
    xato += abs(bashorat[i] - haqiqiy[i])
print(f"{xato / n:.2f}")',
   'python',
   '[{"input":"3\n200 300 400\n210 290 400","expected_output":"6.67","is_hidden":false},
     {"input":"2\n10 20\n10 20","expected_output":"0.00","is_hidden":false},
     {"input":"4\n1 2 3 4\n2 4 6 8","expected_output":"2.50","is_hidden":true}]'::jsonb,
   '[{"order":1,"text":"Har juftlik uchun farqning absolyut qiymatini oling: abs()"},
     {"order":2,"text":"Yig''indini n ga bo''ling"}]'::jsonb,
   'medium', 8, 20, 1);

END $$;
