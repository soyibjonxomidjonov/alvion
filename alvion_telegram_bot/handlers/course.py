from token import AWAIT

from bot import dp
from aiogram import types

from database import CourseTexts
from database.data_dashboard import get_id
from keyboards.basic import get_inlines
from database.urls import COURSE_URL



@dp.message_handler(text="📚 Kurslar")
async def info_courses(msg: types.Message):
    await msg.answer(text=CourseTexts.TEXT, reply_markup=get_inlines(COURSE_URL, 'course'), parse_mode='HTML', disable_web_page_preview=True)


@dp.callback_query_handler(lambda c: c.data.startswith('course_'))
async def course_inlines(call: types.CallbackQuery):
    await call.answer()
    course_id = call.data.split("_")[1]
    course = get_id(COURSE_URL, course_id)

    answer_text = CourseTexts.COURSE.format(course['name'], course['duration'], course['lesson_per_week'],
                                            course['for_whom'], course['results_course'], course['monthly_payment_base'])

    await call.message.answer(text=answer_text, parse_mode='HTML', disable_web_page_preview=True)







    # await call.message.edit_text(f"Bu bizdagi {course['name']} kursi.\n\n"
    #                          f"Kurs davomiyligi {course['duration']} oyni tashkil etadi.\n"
    #                          f"Haftasiga {course['lesson_per_week']} kun dars bo'ladi.\n"
    #                          f"Kurs {course['for_whom']} uchun.\n"
    #                          f"Kursdan keyingi natija {course['results_course']}.\n"
    #                          f"Kursning oylik to'lo'vi {course['monthly_payment_base']} so'm."
    #                          )



























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