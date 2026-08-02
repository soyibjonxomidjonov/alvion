from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

from database import get_all, get_id
from database.urls import COURSE_URL


def get_inlines(url, call_name):
    inline_data = [{i['name']: i['id']} for i in get_all(url)]
    inline_markup = InlineKeyboardMarkup()

    for inline in inline_data:
        for key, value in inline.items():
            inline_markup.add(InlineKeyboardButton(text=key, callback_data=f"{call_name}_{value}"))

    return inline_markup


def get_chegirma_inlines(url, call_name):
    inline_data = [{i['course']: i['id']} for i in get_all(url)]
    print(inline_data)

    inline_markup = InlineKeyboardMarkup()
    for inline in inline_data:
        for key, value in inline.items():
            course = get_id(COURSE_URL, key)
            inline_markup.add(InlineKeyboardButton(text=course['name'], callback_data=f"{call_name}_{value}_{course['name']}"))


    return inline_markup





