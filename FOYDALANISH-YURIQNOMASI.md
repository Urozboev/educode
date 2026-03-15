# EduCode Platform — Foydalanish Yo'riqnomasi

## Mundarija
1. [Platformani ishga tushirish](#1-platformani-ishga-tushirish)
2. [Supabase sozlamalari](#2-supabase-sozlamalari)
3. [Google OAuth sozlash](#3-google-oauth-sozlash)
4. [Admin hisob yaratish](#4-admin-hisob-yaratish)
5. [Rollar va ruxsatlar](#5-rollar-va-ruxsatlar)
6. [Admin panel — Qanday foydalanish](#6-admin-panel)
7. [O'qituvchi panel](#7-oqituvchi-panel)
8. [Talaba panel](#8-talaba-panel)
9. [Ko'p uchraydigan muammolar](#9-kop-uchraydigan-muammolar)

---

## 1. Platformani ishga tushirish

### Talab qilinadigan dasturlar:
- **Node.js** 18+ (https://nodejs.org)
- **npm** yoki **yarn**
- **Git**

### Qadamlar:

```bash
# 1. Loyihani oching
tar -xzf educode-platform.tar.gz
cd educode

# 2. Kutubxonalarni o'rnating
npm install

# 3. Ishga tushiring
npm run dev

# 4. Brauzerni oching
# http://localhost:3000
```

---

## 2. Supabase sozlamalari

### 2.1. Supabase loyiha yaratish
1. https://supabase.com ga kiring va hisob yarating
2. "New Project" bosing
3. Loyiha nomini kiriting: `educode`
4. Ma'lumotlar bazasi parolini kiriting va eslab qoling
5. Region: eng yaqin serverni tanlang (EU yoki Asia)

### 2.2. Ma'lumotlar bazasini sozlash
1. Supabase Dashboard da **SQL Editor** bo'limiga o'ting
2. Quyidagi fayllarni **ketma-ket** ishga tushiring:
   - `01_tables.sql` — jadvallar yaratiladi
   - `02_rls_triggers.sql` — xavfsizlik siyosatlari va triggerlar
   - `03_seed_data.sql` — namuna ma'lumotlar (kurslar, topshiriqlar, testlar)

### 2.3. API kalitlarini olish
1. **Settings → API** bo'limiga o'ting
2. Quyidagilarni `.env.local` fayliga nusxalang:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon (public)` kalit → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` kalit → `SUPABASE_SERVICE_ROLE_KEY`

### 2.4. Email sozlamalari
1. **Authentication → Email Templates** bo'limiga o'ting
2. "Confirm your email" shablonida **Redirect URL** ni sozlang:
   - `{{ .SiteURL }}/api/auth/callback?next=/dashboard`

### 2.5. Storage (Fayl saqlash)
1. **Storage** bo'limiga o'ting
2. Quyidagi bucket'larni yarating:
   - `avatars` — Public (foydalanuvchi rasmlari)
   - `course-thumbnails` — Public (kurs rasmlari)
   - `topic-videos` — Private (video darslar)
   - `topic-presentations` — Private (taqdimotlar)
   - `certificates` — Private (sertifikatlar)

---

## 3. Google OAuth sozlash

### 3.1. Google Cloud Console
1. https://console.cloud.google.com ga kiring
2. Yangi loyiha yarating yoki mavjudini tanlang
3. **APIs & Services → OAuth consent screen** bo'limiga o'ting
4. **External** tanlang va formni to'ldiring:
   - App name: `EduCode`
   - User support email: sizning emailingiz
   - Authorized domains: `supabase.co` qo'shing
5. **Credentials → Create Credentials → OAuth Client ID** bosing:
   - Application type: **Web application**
   - Name: `EduCode`
   - Authorized redirect URIs: 
     ```
     https://SIZNING_SUPABASE_URL.supabase.co/auth/v1/callback
     ```
     (Bu URL ni Supabase Dashboard → Authentication → URL Configuration dan olishingiz mumkin)
6. **Client ID** va **Client Secret** ni nusxalang

### 3.2. Supabase ga qo'shish
1. Supabase Dashboard → **Authentication → Providers**
2. **Google** ni yoqing (Enable)
3. Client ID va Client Secret ni joylashtiring
4. Saqlang

### 3.3. Muhim: Site URL sozlash
1. **Authentication → URL Configuration**
2. **Site URL**: `http://localhost:3000` (development uchun)
3. **Redirect URLs** ga qo'shing:
   ```
   http://localhost:3000/api/auth/callback
   https://malla.uz/api/auth/callback
   ```

---

## 4. Admin hisob yaratish

### Qadam 1: Oddiy foydalanuvchi sifatida ro'yxatdan o'ting
1. `http://localhost:3000/register` sahifasini oching
2. Ismingiz, email va parol kiriting
3. Emailga kelgan tasdiqlash havolasini bosing
4. Dashboard ga yo'naltirilasiz

### Qadam 2: O'zingizni admin qiling
1. Supabase Dashboard → **SQL Editor** ni oching
2. Quyidagi SQL ni ishga tushiring (emailingizni o'zgartiring!):

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'sizning@email.com'
  LIMIT 1
);
```

3. Tekshirish:
```sql
SELECT full_name, role FROM profiles
WHERE role = 'admin';
```

### Qadam 3: Admin panelga kirish
1. Sahifani yangilang (Ctrl+F5)
2. Brauzerda `http://localhost:3000/a-dashboard` ni oching
3. Admin panel ochildi!

**Eslatma:** Admin qilgandan keyin, brauzerda eski session bo'lishi mumkin. 
Agar admin sahifa ochilmasa:
- Chiqish (Logout) qiling
- Qayta kirish (Login) qiling
- Endi `/a-dashboard` ishlaydi

---

## 5. Rollar va ruxsatlar

Platformada 3 ta rol mavjud:

| Rol | Kirish yo'li | Nima qila oladi |
|-----|-------------|-----------------|
| **student** | `/dashboard` | Kurslar, topshiriqlar, o'yinlar, leaderboard |
| **teacher** | `/t-dashboard` | Talabalar monitoring, topshiriq biriktirish, analitika, eksport |
| **admin** | `/a-dashboard` | Barcha student + teacher imkoniyatlari + kurslar/topshiriqlar CRUD, foydalanuvchilar boshqaruvi, tizim sozlamalari |

### Rol o'zgartirish
Supabase SQL Editor da:
```sql
-- Foydalanuvchini teacher qilish
UPDATE profiles SET role = 'teacher'
WHERE id = (SELECT id FROM auth.users WHERE email = 'teacher@email.com');

-- Foydalanuvchini admin qilish
UPDATE profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@email.com');
```

Yoki Admin paneldan: `/a-users` sahifasida rol o'zgartirish mumkin (bu sahifa keyingi yangilanishda to'liq qo'shiladi).

---

## 6. Admin panel

Admin panel orqali platformani to'liq boshqarish mumkin.

### 6.1. Bosh sahifa (`/a-dashboard`)
- Umumiy statistika: foydalanuvchilar soni, kurslar, topshiriqlar
- So'nggi ro'yxatdan o'tganlar ro'yxati

### 6.2. Kurslar boshqaruvi (`/a-courses`)

**Yangi kurs yaratish:**
1. "Yangi kurs" tugmasini bosing
2. Formni to'ldiring:
   - Kurs nomi (majburiy)
   - Kategoriya (python, frontend, va boshqalar)
   - Qiyinlik darajasi
   - Bepul/Pullik (agar pullik bo'lsa, coin narxini kiriting)
   - Coin mukofot (kursni tugatganda beriladigan coin)
3. "Yaratish" bosing
4. Kurs yaratildi, lekin hali **nashr qilinmagan** (qoralama holatda)

**Mavzular qo'shish:**
1. Kurslar jadvalida 📖 ikonini bosing
2. "Yangi mavzu" bosing
3. To'ldiring:
   - Mavzu nomi
   - Ma'ruza matni (HTML formatda)
   - Video URL (YouTube havolasi)
   - Taqdimot URL (PDF yoki Google Slides havolasi)
   - Coin va XP mukofotlar
4. Mavzular tartibini ↑↓ tugmalari bilan o'zgartiring

**Kursni nashr qilish:**
- Kurslar jadvalida 👁 ikonini bosing
- Kurs "Nashr" holatiga o'tadi va talabalarga ko'rinadi

### 6.3. HTML formatida matn yozish

Mavzu matnini HTML formatda yozish kerak. Misol:

```html
<h2>O'zgaruvchilar</h2>
<p>O'zgaruvchi — bu qiymatni saqlaydigan idish.</p>

<h3>Misol:</h3>
<pre><code>ism = "Python"
yosh = 25
print(ism, yosh)</code></pre>

<h3>Ma'lumot turlari:</h3>
<ul>
  <li><strong>str</strong> — matn</li>
  <li><strong>int</strong> — butun son</li>
  <li><strong>float</strong> — kasr son</li>
</ul>
```

---

## 7. O'qituvchi panel

O'qituvchi panelga kirish: foydalanuvchi rolini `teacher` qiling va `/t-dashboard` ga kiring.

**Imkoniyatlar:**
- Talabalar ro'yxatini ko'rish va ularning progressini kuzatish
- Topshiriqlarni guruhlarga biriktirish
- Analitika — guruh bo'yicha o'rtacha ball, eng qiyin mavzular
- Ma'lumotlarni CSV/Excel formatida eksport qilish

---

## 8. Talaba panel

### 8.1. Ro'yxatdan o'tish
1. `/register` sahifasida ro'yxatdan o'ting (email yoki Google)
2. Email tasdiqlang (agar email bilan ro'yxatdan o'tgan bo'lsangiz)
3. Dashboard ga yo'naltirilasiz

### 8.2. Dashboard (`/dashboard`)
- Umumiy statistika: tugatilgan kurslar, yechilgan topshiriqlar, XP, coinlar
- Davom etayotgan kurslar va progress
- Tezkor harakatlar: kurslar, topshiriqlar, o'yinlar, reyting

### 8.3. Kurslar (`/courses`)
1. Kurslar katalogida kerakli kursni tanlang
2. "Bepul boshlash" yoki coin bilan sotib oling
3. Mavzularni ketma-ket o'ting:
   - **Ma'ruza** — matnni o'qing, videoni tomosha qiling
   - **Test** — 5-10 ta savolga javob bering (60%+ o'tish kerak)
   - **Amaliy topshiriq** — kod yozing, testlardan o'tkazing
4. Har bir mavzu tugagach coin va XP olasiz

### 8.4. Topshiriqlar (`/challenges`)
- robocontest.uz kabi mustaqil dasturlash topshiriqlari
- Kategoriya va qiyinlik bo'yicha filtrlash
- Kod muharririda yechimni yozing
- Avtomatik test tekshirish
- AI tahlil — kodingizni Claude tahlil qiladi

### 8.5. Coin tizimi
- Registratsiyada: **100 coin**
- Mavzu tugatganda: **10 coin**
- Kurs tugatganda: **50 coin**
- Topshiriq yechganda: **5-20 coin** (qiyinligiga qarab)
- Coinlar bilan pullik kurslarni ochish mumkin

### 8.6. Kod muharriri
- **Python** — brauzerda to'g'ridan-to'g'ri ishlaydi (Pyodide)
- **JavaScript** — brauzerda ishlaydi (sandbox iframe)
- Kod yozing → "Ishga tushirish" bosing → natijani ko'ring
- "Yuborish" — test case'lar bilan tekshirish va saqlash
- "AI Tahlil" — Claude kodingizni tahlil qiladi

---

## 9. Ko'p uchraydigan muammolar

### Google login 400 xatolik
**Sabab:** Redirect URL noto'g'ri sozlangan.
**Yechim:**
1. Supabase Dashboard → Authentication → URL Configuration
2. **Site URL**: `http://localhost:3000` (yoki productionda `https://malla.uz`)
3. **Redirect URLs** ga qo'shing:
   ```
   http://localhost:3000/api/auth/callback
   ```
4. Google Cloud Console → Credentials → OAuth Client
5. **Authorized redirect URIs** da quyidagi mavjudligini tekshiring:
   ```
   https://SIZNING_PROJECT_REF.supabase.co/auth/v1/callback
   ```

### Email tasdiqlash havolasi ishlamayapti
**Sabab:** Email template da redirect URL noto'g'ri.
**Yechim:**
1. Supabase → Authentication → Email Templates
2. "Confirm your mail" shablonida URL ni tekshiring:
   ```
   {{ .SiteURL }}/api/auth/callback?next=/dashboard
   ```

### Dashboard bo'sh ko'rinmoqda
**Sabab:** Profil hali yaratilmagan (trigger ishlamagan).
**Yechim:**
1. Supabase → Table Editor → profiles jadvalini tekshiring
2. Agar sizning profilingiz yo'q bo'lsa, SQL Editor da:
   ```sql
   INSERT INTO profiles (id, full_name, role)
   SELECT id, COALESCE(raw_user_meta_data->>'full_name', email), 'student'
   FROM auth.users
   WHERE id NOT IN (SELECT id FROM profiles);
   ```

### Admin sahifaga kira olmayapman
**Sabab:** Rol `student` holatida yoki eski cookie saqlanib qolgan.
**Yechim:**
1. Avval SQL bilan rolni `admin` qiling (yuqoridagi 4-bo'limga qarang)
2. Platformadan **chiqish** (Logout)
3. Qayta **kirish** (Login)
4. `/a-dashboard` ni oching

### Pyodide (Python) yuklanmayapti
**Sabab:** Pyodide CDN dan yuklanadi (~10 MB), internet sekin bo'lsa kechikadi.
**Yechim:** Birinchi marta ochilganda 5-10 sekund kutish kerak. Keyin cache dan tez ishlaydi.

### Kurs ko'rinmayapti
**Sabab:** Kurs nashr qilinmagan (is_published = false).
**Yechim:** Admin panelda kursni nashr qiling (👁 ikonini bosing).

---

## Production ga chiqarish (Deploy)

### Vercel bilan deploy
1. Kodni GitHub ga push qiling
2. https://vercel.com da loyihani import qiling
3. Environment variables ni qo'shing:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CLAUDE_API_KEY`
   - `NEXT_PUBLIC_APP_URL=https://malla.uz`
4. Supabase sozlamalarida:
   - Site URL: `https://malla.uz`
   - Redirect URLs: `https://malla.uz/api/auth/callback`
5. Google OAuth da:
   - Authorized redirect URIs ga: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
   - Authorized domains ga: `malla.uz`
