from aiogram.types import KeyboardButton, ReplyKeyboardMarkup, InlineKeyboardMarkup, InlineKeyboardButton

from database import get_all, get_id

prices_k = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Oylik to'lo'v"),
         KeyboardButton(text="Chegirmalar")],

        [KeyboardButton(text="Aksiyalar"),
         KeyboardButton(text="To'lo'v usullari")],

        [KeyboardButton(text="Ortga qaytish")]

    ],
    resize_keyboard=True
)



news_k = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="E'lonlar"),
         KeyboardButton(text="Aksiyalar")],

        [KeyboardButton(text="Yangi guruhlar"),
         KeyboardButton(text="Tadbirlar")],
        [KeyboardButton(text="Ortga qaytish")]
    ],
    resize_keyboard=True
)



def get_choices_inline(call_name, question_id=None, url=None):
    if not question_id:
        start_test_inline = InlineKeyboardMarkup().add(InlineKeyboardButton(text="Testni boshlash", callback_data=call_name))
        return start_test_inline
    inline_data = [{i['text']: i['id']} for i in  get_all(f"{url}?search={question_id}")]
    inline_markup = InlineKeyboardMarkup()


    for inline in inline_data:
        for key, value in inline.items():
            inline_markup.add(InlineKeyboardButton(text=key, callback_data=f"question_{call_name}_{value}_{question_id}"))

    return inline_markup









