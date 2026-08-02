# ALVION Telegram Bot — Yangilangan Shablonlar

Suhbat tarixingizni tahlil qildim va botning **hozirgi** oqimini (start → kurslar → jadval → narxlar → chegirma/aksiya → to'lov → o'qituvchilar → bog'lanish → ro'yxatdan o'tish → yangiliklar → daraja testi) aniqladim. Har bir ekran uchun quruq matn o'rniga chiroyli, emoji va `HTML` formatlashli shablon tayyorladim.

⚠️ **Diqqat:** Kurs kartochkasida narx joyida `None so'm` chiqib qolayotganini ko'rdim — bu bazada narx (`price`) maydoni bo'sh saqlanayotganini bildiradi. Kodni tekshiring, aks holda yangi shablon ham `None so'm` chiqarib beradi.

Barchasi `parse_mode: "HTML"` uchun. `{ }` — dinamik o'zgaruvchilar.

---

## 1️⃣ /start — Xush kelibsiz

**Eski:** `Botga hush kelibsiz`

```html
👋 <b>Assalomu alaykum, {name}!</b>

<b>ALVION</b> ta'lim markazi botiga xush kelibsiz! 🎓

Bu yerda siz:
📚 Kurslarimiz bilan tanishasiz
📅 Dars jadvalini ko'rasiz
💰 Narx va chegirmalarni bilib olasiz
👤 Ro'yxatdan o'tasiz

Quyidagi menyudan kerakli bo'limni tanlang 👇
```

---

## 2️⃣ 📚 Kurslar — ro'yxat

**Eski:** `Biz ushbu kurslarni taqdim etamiz`

```html
📚 <b>ALVION kurslari</b>

Sizga mos darajani tanlang — har biri haqida batafsil ma'lumot beramiz 👇
```
*(tugmalar: Beginner / Pre-Intermediate / Intermediate / Upper-Intermediate / Advanced — o'zgarishsiz qoladi)*

---

## 3️⃣ Kurs tafsilotlari (dinamik kartochka)

**Eski:** `Bu bizdagi Beginner kursi. Kurs davomiyligi 2 oyni tashkil etadi. Haftasiga 4 kun dars bo'ladi. Kurs Beginner uchun. Kursdan keyingi natija Elementary. Kursning oylik to'lo'vi None so'm.`

```html
🎓 <b>{course_name}</b> kursi

⏳ Davomiyligi: <b>{duration}</b>
📆 Haftasiga: <b>{days_per_week} kun</b> dars
🎯 Kirish darajasi: <b>{level_from}</b>
🏁 Kursdan keyingi natija: <b>{level_to}</b>
💰 Oylik to'lov: <b>{price} so'm</b>

Ro'yxatdan o'tish uchun 👤 <b>Ro'yxatdan o'tish</b> tugmasini bosing!
```

---

## 4️⃣ 📅 Dars jadvali

**Eski:** `Bizdagi darslar` → `Hozirda 5 ta bo'sh joylar bor. Kurs boshlanish sanasi 2026-07-26`

```html
📅 <b>Dars jadvali</b>

Quyidagi vaqtlardan birini tanlang 👇
```

Vaqt tanlangandan keyin (guruh kartochkasi):

```html
🗓 <b>{course_name}</b> guruhi

🕐 Dars vaqti: <b>{time_slot}</b>
🪑 Bo'sh joylar: <b>{available_seats} ta</b>
📆 Boshlanish sanasi: <b>{start_date}</b>

Joylar tez to'lib qolmoqda — hoziroq ro'yxatdan o'ting! 🚀
```

---

## 5️⃣ 💰 Narxlar

**Eski:** `Ma'lumot olish uchun tanlang`

```html
💰 <b>Narxlar</b>

Qaysi ma'lumot kerak? 👇
• 💵 Oylik to'lov
• 🎁 Chegirmalar
• 🔥 Aksiyalar
```

---

## 6️⃣ Chegirmalar

**Eski:** `Bizdagi chegirmalar` → `Hozirda Beginner kursida 25% chegirma bor. Chegirma boshlanish sanasi 2026-07-26 Chegirma tugash sanasi 2026-09-26`

```html
🎁 <b>Faol chegirmalar</b>

🏷 <b>{course_name}</b> kursida <b>{discount_percent}%</b> chegirma!

📅 Boshlanish: {start_date}
⏰ Tugash: <b>{end_date}</b>

Imkoniyatni boy bermang! ⏳
```

---

## 7️⃣ Aksiyalar (referral)

**Eski:** `Bizdagi aksiyalar` → `Bizda 1 ga 3% nomli aksiyada devom etmoqda. Bizda hozirda 10 ta do'stini taklif qilgan odam uchun har qanday kursga 30% chegirma mavjud`

```html
🔥 <b>«{promo_name}» aksiyasi</b>

👥 <b>{friends_count}</b> ta do'stingizni taklif qiling va istalgan kursga <b>{discount_percent}%</b> chegirmaga ega bo'ling! 🎉

Do'stlaringizni taklif qilishni hoziroq boshlang 🚀
```

---

## 8️⃣ 💳 To'lov usullari

**Eski:** `To'lov turlari` → `Band nomi Ipak yo'li banki Karta egasi Foydalanuvchi nomi Karta raqam 5614456799343211`

```html
💳 <b>To'lov usulini tanlang</b>

Quyidagi banklardan birini tanlab, karta ma'lumotlarini olasiz 👇
```

Karta tanlanganda:

```html
🏦 <b>{bank_name}</b>

👤 Karta egasi: <b>{card_holder}</b>
💳 Karta raqami: <code>{card_number}</code>

To'lovni amalga oshirib, chek rasmini yuboring 🧾
```

---

## 9️⃣ 👨‍🏫 O'qituvchilar

**Eski:** `Jamshid Narzullayev Backned developer 2 yillik beginner bo'yicha dars beradi ingliz tilidan b2 Mavjud sertifikatlar`

```html
👨‍🏫 <b>{teacher_name}</b>

💼 Kasbi: {profession}
📚 Dars beradi: <b>{course_level}</b>
⏳ Tajribasi: <b>{experience}</b> yil
🗣 Til darajasi: <b>{language_level}</b>
🏆 Sertifikatlar: {certificates}

Bizning tajribali ustozlarimiz bilan ishonchli natijaga erishing! 💪
```

---

## 🔟 ☎️ Bog'lanish

Bu ekran allaqachon yaxshi formatlangan — faqat ozroq siqiqlashtiramiz:

```html
📞 <b>Bog'lanish</b>

📱 Telefon: <b>+998 90 123 45 67</b>
💬 Telegram: @username
📍 Manzil: Toshkent sh., Chilonzor tumani, 5-mavze
🗺 <a href="https://maps.google.com">Xaritada ko'rish</a>
⏰ Ish vaqti: Dush – Shanba (09:00 – 18:00)

Savolingiz bo'lsa, bemalol qo'ng'iroq qiling! 😊
```

---

## 1️⃣1️⃣ 🌐 Ijtimoiy tarmoqlar

```html
🌐 <b>Ijtimoiy tarmoqlarimiz</b>

🔹 <a href="{telegram_url}">Telegram kanal</a>
🔹 <a href="{instagram_url}">Instagram</a>
🔹 <a href="{facebook_url}">Facebook</a>
🔹 <a href="{youtube_url}">YouTube</a>
🔹 <a href="{website_url}">Rasmiy veb-sayt</a>

Bizni kuzatib boring — yangiliklarni birinchi bo'lib biling! 🔔
```

---

## 1️⃣2️⃣ 👤 Ro'yxatdan o'tish (qadam-baqadam)

| Qadam | Eski matn | Yangi shablon |
|---|---|---|
| 1 | `Ism familyangizni kiriting` | `✍️ <b>Ism va familyangizni</b> kiriting:` |
| 2 | `Telefon raqamingizni yuboring` | `📱 <b>Telefon raqamingizni</b> yuboring (masalan: +998 90 123 45 67):` |
| 3 | `yoshingizni kiriting` | `🎂 <b>Yoshingizni</b> kiriting:` |
| 4 | `Yashash manzilingizni yuboring` | `📍 <b>Yashash manzilingizni</b> yuboring:` |
| 5 | `Ingilis tilini bilish darajangizni yuboring` | `🗣 <b>Ingliz tili darajangizni</b> tanlang:` |
| 6 | `Qaysi vaqt qulayligini yuboring` | `🕐 <b>Qulay dars vaqtini</b> tanlang:` |
| 7 | `Qo'shimcha xabaringizni yuboring` | `💬 Qo'shimcha <b>xabaringiz</b> bo'lsa yozing (bo'lmasa "yo'q" deb yozing):` |

**Muvaffaqiyatli yakunlanganda:**

```html
🎉 <b>Tabriklaymiz, {name}!</b>

Siz ALVION ta'lim markaziga muvaffaqiyatli ro'yxatdan o'tdingiz! ✅

Tez orada operatorlarimiz siz bilan bog'lanadi 📞
```

**Agar avval ro'yxatdan o'tgan bo'lsa:**

```html
ℹ️ <b>Siz allaqachon ro'yxatdan o'tgansiz</b>

Hurmatli {name}, sizning ma'lumotlaringiz bizda mavjud. Savollaringiz bo'lsa ☎️ <b>Bog'lanish</b> bo'limi orqali murojaat qiling.
```

---

## 1️⃣3️⃣ 📢 Yangiliklar bo'limi

```html
📢 <b>Yangiliklar</b>

Qaysi bo'limni ko'rmoqchisiz? 👇
• 📰 E'lonlar
• 👥 Yangi guruhlar
• 🎪 Tadbirlar
```

**E'lonlar:**
```html
📰 <b>So'nggi e'lonlar</b>

📌 {announcement_text}

🗓 {date}
```

**Yangi guruhlar:**
```html
👥 <b>Yangi ochilgan guruhlar</b>

🆕 <b>{course_name}</b> — {schedule}
🪑 Bo'sh joylar: {available_seats} ta

Hoziroq joy band qiling! 🚀
```

**Tadbirlar (yutuqlar hikoyasi):**
```html
🎪 <b>So'nggi tadbirlar va yutuqlar</b>

🏆 {achievement_text}

Bizning bitiruvchilarimiz kabi siz ham muvaffaqiyatga erishing! 💫
```

---

## 1️⃣4️⃣ 🎯 Darajani aniqlash testi

```html
🎯 <b>Darajangizni aniqlang!</b>

Qisqa test orqali ingliz tilini bilish darajangizni bilib oling. Qaysi kurs bo'yicha test topshirmoqchisiz? 👇
```

**Test mavjud bo'lsa:**
```html
📝 <b>{course_name}</b> darajasi uchun test

❓ Savollar soni: <b>{question_count}</b>

Tayyor bo'lsangiz, boshlang! ⏱
```

**Test mavjud bo'lmasa:**
```html
😔 Kechirasiz, <b>{course_name}</b> kursi uchun hozircha test mavjud emas.

Tez orada qo'shamiz — kuzatib boring! 🔔
```

**Test yakunlanganda:**
```html
✅ <b>Test yakunlandi!</b>

🎯 Natijangiz: <b>{score}/{total}</b>
📊 Darajangiz: <b>{level}</b>

Ushbu darajaga mos kursimizga yozilishni xohlaysizmi? 👇
```

---

## 1️⃣5️⃣ Umumiy tugmalar

```html
🏠 <b>Asosiy menyu</b>

Nima bilan yordam bera olaman? 👇
```

---

# 📋 Xulosa — nima o'zgardi

| Bo'lim | Muammo edi | Endi |
|---|---|---|
| Barcha xabarlar | Formatsiz, quruq matn | `<b>`, emoji, aniq struktura |
| Kurs kartochkasi | `None so'm` (bug) | Placeholder — narxni bazadan to'g'irlash kerak |
| Ro'yxatdan o'tish | Har bir savol alohida, sovuq | Emoji + izoh bilan yumshoq savollar |
| CTA (harakatga chaqiruv) | Yo'q edi | Har bir ekranda "hoziroq...", "kuzatib boring" kabi CTA qo'shildi |

Xohlasangiz, bularni oldingi xabarimdagi **database jadvaliga** (`template_key`, `language_code`, `content`) solib, botga ulanadigan tayyor SQL seed fayl ham tayyorlab beraman — kerakmi?
