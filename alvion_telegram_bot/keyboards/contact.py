from aiogram.types import KeyboardButton, ReplyKeyboardMarkup


contact_button = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Raqamni jo'natish", request_contact=True)]
    ],
    resize_keyboard=True
)