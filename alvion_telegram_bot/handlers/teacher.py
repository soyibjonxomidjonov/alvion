from database.urls import TEACHER_URL, CERTIFICATE_URL
from keyboards import get_inlines
from main import dp
from database import get_all, get_id, Teacher, COURSE_URL

from aiogram import types


@dp.message_handler(text="👨‍🏫 O’qituvchilar")
async def teachers(msg: types.Message):
    await msg.answer(text="Bizdagi o'qituvchilar", reply_markup=get_inlines(TEACHER_URL, 'teacher'))



@dp.callback_query_handler(lambda c: c.data.startswith('teacher_'))
async def teacher_inline(call: types.CallbackQuery):
    teacher_id = call.data.split("_")[1]
    teacher = get_id(f"{TEACHER_URL}", teacher_id)
    response = get_all(CERTIFICATE_URL+f"?search={teacher_id}")

    course = get_id(COURSE_URL, teacher['course_id'])

    cert = '\n🏆 Sertifikatlari\n'
    for certificate in response:
        print(certificate)
        if certificate['teacher_id'] == int(teacher_id):
            cert += certificate['certificate_subject'] + "dan " + f"{certificate['certificate_level']}\n"

    answer_text = Teacher.TEXT.format(teacher['name'], teacher['specialization'], course['name'], teacher['experience'], cert)
    await call.message.edit_text(text=answer_text, parse_mode='HTML', disable_web_page_preview=True)
    #
    # await call.message.edit_text(
    #     f"{teacher['name']}\n\n"
    #     f"{teacher['specialization']}\n"
    #     f"{teacher['experience']}\n"
    #     f"{cert}"
    #                          )

