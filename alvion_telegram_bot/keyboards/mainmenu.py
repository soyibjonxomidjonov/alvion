from aiogram.types import KeyboardButton, ReplyKeyboardMarkup, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

from database.urls import ADMIN_WEBSITE_URL
reply_main_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="📚 Kurslar"),
        KeyboardButton(text="📝 Ro’yxatdan o’tish")],

        [KeyboardButton(text="🎯 Darajani aniqlash testi"),
         KeyboardButton(text="📅 Dars jadvali")],

        [KeyboardButton(text="💰 Narxlar"),
        KeyboardButton(text="👨‍🏫 O’qituvchilar")],

        [KeyboardButton(text="📢 Yangiliklar"),
         KeyboardButton(text="☎️ Bog’lanish")],

        [
            KeyboardButton(text="🌐 Ijtimoiy tarmoqlar"),
         ]
    ],
    resize_keyboard=True
)


reply_courses_inline_keyboard = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text="Beginner", callback_data="beginner"),
            InlineKeyboardButton(text="Elementary", callback_data="elementary")
        ],

        [
            InlineKeyboardButton(text="Pre-Intermediate", callback_data="pre_intermediate"),
            InlineKeyboardButton(text="Upper-Intermediate", callback_data="upper_intermediate")
        ],

        [
            InlineKeyboardButton(text="Advanced", callback_data="advanced"),
        ],

    ]
)








admin_reply_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="📚 Kurslar"),
        KeyboardButton(text="📝 Ro’yxatdan o’tish")],

        [KeyboardButton(text="🎯 Darajani aniqlash testi"),
         KeyboardButton(text="📅 Dars jadvali")],

        [KeyboardButton(text="💰 Narxlar"),
        KeyboardButton(text="👨‍🏫 O’qituvchilar")],

        [KeyboardButton(text="📢 Yangiliklar"),
         KeyboardButton(text="☎️ Bog’lanish")],

        [
            KeyboardButton(text="🌐 Ijtimoiy tarmoqlar"),
            KeyboardButton(text="🌐 Admin panelni ochish", web_app=WebAppInfo(url=ADMIN_WEBSITE_URL))
        ],
    ],
    resize_keyboard=True
)









