from bot import dp
from aiogram import types

from database import get_all, LessonTable, get_id
from keyboards.basic import get_inlines
from database.urls import LESSON_URL, LESSONINFO_URL




@dp.message_handler(text="📅 Dars jadvali")
async def info_courses(msg: types.Message):
    await msg.answer(text=LessonTable.TEXT, reply_markup=get_inlines(LESSON_URL, 'lesson'), parse_mode='HTML', disable_web_page_preview=True)


@dp.callback_query_handler(lambda c: c.data.startswith('lesson_'))
async def lesson_inline(call: types.CallbackQuery):
    lesson_id = call.data.split("_")[1]
    lesson = get_id(LESSON_URL, lesson_id)
    lesson_info = get_all(f"{LESSONINFO_URL}?search={lesson_id}")
    date = lesson_info[0]['start_time'].split("T")[0]

    answer_text = LessonTable.LESSON_INFO_TEXT.format(lesson['name'], lesson_info[0]['empty_spaces'], date)


    await call.message.answer(text=answer_text, parse_mode='HTML', disable_web_page_preview=True)






    # await call.message.edit_text(f"Hozirda {lesson_info[0]['empty_spaces']} ta bo'sh joylar bor.\n\n"
    #                          f"Kurs boshlanish sanasi {date}")




























#
#
# @dp.callback_query_handler(lambda c: c.data == 'elementary')
# async def elementary_inline(call: types.CallbackQuery):
#     await call.message.reply("Bizdagi bu elementary kursi")
#
#
#
# @dp.callback_query_handler(lambda c: c.data == 'pre_intermediate')
# async def pre_intermediate_inline(call: types.CallbackQuery):
#     await call.message.reply("Bizdagi bu pre_intermediate kursi")
#
#
# @dp.callback_query_handler(lambda c: c.data == 'upper_intermediate')
# async def upper_intermediate_inline(call: types.CallbackQuery):
#     await call.message.reply("Bizdagi bu upper_intermediate kursi")
#
#
#
# @dp.callback_query_handler(lambda c: c.data == 'advanced')
# async def advanced_inline(call: types.CallbackQuery):
#     await call.message.reply("Bizdagi bu advanced kursi")