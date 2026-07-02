# EduCode — Video hosting tanlovi va sozlash yo'riqnomasi

> Kontekst: "Kompyuter savodxonligi" kursi — 141 dars, ~30.5 soat video.
> Talab: pullik kurs, video yuklab olib bo'lmasligi kerak, O'zbekiston auditoriyasi uchun tez.

## Taqqoslash

| Mezon | **Bunny Stream** ⭐ | Cloudflare Stream | Mux | YouTube (unlisted) | Supabase Storage |
|---|---|---|---|---|---|
| Saqlash narxi | $0.005/GB/oy (~$0.15/oy 30GB uchun) | $5 / 1000 daqiqa (~$9/oy) | $0.003/daqiqa (~$5.5/oy) | Bepul | $0.021/GB/oy |
| Uzatish (delivery) | $0.005/GB (arzon zona) | $1 / 1000 daqiqa ko'rish | $0.00096/daqiqa | Bepul | $0.09/GB — QIMMAT |
| Token himoya (signed URL) | ✅ bor | ✅ bor (signed token) | ✅ bor | ❌ yo'q | 🟡 signed URL bor, lekin MP4 to'g'ridan-to'g'ri yuklab olinadi |
| HLS streaming (yuklab olishga qarshi) | ✅ | ✅ | ✅ | ✅ | ❌ (oddiy MP4) |
| DRM (Enterprise himoya) | ✅ ($ qo'shimcha) | ❌ | ✅ (qimmat) | ❌ | ❌ |
| CDN O'zbekistonga yaqin PoP | ✅ (Frankfurt, Istanbul, Moscow) | ✅ | 🟡 | ✅ | 🟡 |
| Player'ni brendlash | ✅ | ✅ | ✅ | ❌ (YouTube logo) | — |
| Taxminiy oylik xarajat (1000 talaba, 30GB video, ~500GB traffic) | **~$3-5/oy** | ~$40-60/oy | ~$50-80/oy | $0 | ~$45/oy |

## 🏆 Tavsiya: Bunny Stream

**Nega:**
1. **Eng arzon**: 30 soat video (~30GB, 720p) saqlash $0.15/oy. 500GB oylik traffic ~$2.5/oy. Jami **$3-5/oy**.
2. **Token Authentication**: embed URL har safar server tomonidan imzolanadi va 4 soatdan keyin ishlamay qoladi. URL'ni nusxalab boshqaga berish foydasiz.
3. **HLS**: video kichik segmentlarga bo'lib uzatiladi — brauzerdan "Save video as" ishlamaydi.
4. **MP4 Fallback o'chirish mumkin** — to'g'ridan-to'g'ri fayl URL umuman mavjud bo'lmaydi.
5. CDN Istanbul/Frankfurt PoP — O'zbekistonga past ping.

**Sozlash (15 daqiqa):**
1. [bunny.net](https://bunny.net) da akkaunt oching → **Stream** → yangi Video Library yarating
2. Library Settings → **Security**:
   - ✅ Token Authentication — **yoqing** (bu asosiy himoya!)
   - ✅ Allowed Referrers: `malla.uz`, `*.malla.uz` (boshqa saytga embed qilib bo'lmaydi)
   - ✅ Block direct URL file access — yoqing
   - ❌ MP4 Fallback — o'chiring (faqat HLS qoladi)
3. **API** bo'limidan oling:
   - Library ID → `.env.local`: `BUNNY_STREAM_LIBRARY_ID=xxxxx`
   - Token Authentication Key → `.env.local`: `BUNNY_STREAM_TOKEN_KEY=xxxxx`
4. Video yuklash: Bunny dashboard drag-drop yoki API orqali. Har video **GUID** oladi.
5. Admin panelda topic tahrirlashda: Provider = "Bunny Stream", Video GUID'ni kiriting.

**Himoya arxitekturasi (tizimda tayyor):**
```
Talaba video ochadi
  → /api/video/token (topic_id bilan)
  → Server RLS orqali tekshiradi: enrollment bormi / kurs bepulmi / free preview'mi
  → Ruxsat bo'lsa: SHA256(token_key + video_id + expires) imzolangan URL (4 soat)
  → iframe player + foydalanuvchi email watermark (20s da joy almashadi)
```

**Nima himoyalanadi / nima yo'q:**
- ✅ URL ulashish (token muddati tugaydi, referrer blok)
- ✅ "Save video as" (HLS, MP4 yo'q)
- ✅ Boshqa saytga embed (referrer check)
- ✅ Yuklab olish extension'lari ko'pchiligi ishlamaydi
- 🟡 Ekran yozib olish (screen recording) — hech qanday texnologiya 100% to'sa olmaydi.
  Bizning javob: **harakatlanuvchi email watermark** — tarqatilgan yozuvdan kim tarqatganini aniqlash mumkin.
  100% himoya kerak bo'lsa keyinroq Bunny DRM ($99+/oy) yoki VdoCipher ko'rib chiqiladi — hozircha shart emas.

## Muqobil ssenariylar

- **Bepul boshlash**: dastlab YouTube unlisted bilan yuklang (video_provider=youtube). Kurs sotila boshlagach Bunny'ga ko'chiring — admin panelda provider'ni o'zgartirish kifoya.
- **Keyin o'sish**: 10K+ talaba bo'lsa Cloudflare Stream (Enterprise SLA) yoki Bunny DRM.

## Xarajat prognozi (Bunny)

| Talabalar | Video hajmi | Oylik traffic | Oylik xarajat |
|---|---|---|---|
| 100 | 30GB | ~50GB | ~$0.5 |
| 1 000 | 30GB | ~500GB | ~$3 |
| 10 000 | 60GB (2 kurs) | ~5TB | ~$26 |
