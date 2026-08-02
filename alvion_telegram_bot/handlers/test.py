from bot import dp
from aiogram import types

from database import get_all, get_id, create, BOT_USER_URL, REGISTER_USER_URL
from keyboards import get_choices_inline
from keyboards.basic import get_inlines
from database.urls import COURSE_URL, TESTS_URL, QUESTION_URL, CHOICES_URL, TEST_RESULT_URL


@dp.message_handler(text="🎯 Darajani aniqlash testi")
async def test(msg: types.Message):
    await msg.answer(text="Darajani aniqlash testi", reply_markup=get_inlines(COURSE_URL, 'test_course'))



@dp.callback_query_handler(lambda c: c.data.startswith('test_course_'))
async def test_inline(call: types.CallbackQuery):
    await call.answer()
    course = get_id(COURSE_URL, call.data.split("_")[2])
    tests = get_all(f"{TESTS_URL}?search={course['id']}")

    if tests:
        await call.message.reply(
            f"{course['name']} kursi uchun testlar to'plami\n\n", reply_markup=get_choices_inline(call_name=f"start_test_{tests[0]['id']}"))
    else:
        await call.message.reply(text="Kechirasiz bu kurs uchun  testlar mavjud emas")

@dp.callback_query_handler(lambda c: c.data.startswith('start_test_'))
async def start_test_inline(call: types.CallbackQuery):
    await call.answer()
    test_id = call.data.split("_")[2]
    questions = get_all(f"{QUESTION_URL}?search={test_id}")
    question_id = questions[0]['id']

    inline_question_choice = get_choices_inline('test', question_id, url=CHOICES_URL)

    await call.message.reply(text=questions[0]['text'], reply_markup=inline_question_choice)



@dp.callback_query_handler(lambda c: c.data.startswith('question_test_'))
async def choice_test_inline(call: types.CallbackQuery):
    await call.answer()

    users = get_all(REGISTER_USER_URL+f"?search={call.from_user.id}")

    if users:

        choice_id = call.data.split("_")[2]
        question_id = call.data.split("_")[3]

        choice = get_id(CHOICES_URL, choice_id)
        question = get_id(QUESTION_URL, question_id)

        questions = get_all(f"{QUESTION_URL}?search={question['test']}")



        print(call.from_user.id)
        print(users)


        index = questions.index(question)
        data = {
            "is_passed":choice['is_correct'],
            'test_user': users[0]['id'],
            'test': question['test'],
            'test_question':question['id']
        }

        print(f"\n{data}\n")

        create(TEST_RESULT_URL, data)

        if questions[index] != questions[-1]:
            inline_question_choice = get_choices_inline('test', questions[index+1]['id'], url=CHOICES_URL)

            await call.message.edit_text(text=questions[index+1]['text'], reply_markup=inline_question_choice)

        elif questions[index] == questions[-1]:
            await call.answer()
            await call.message.delete()
            await call.message.answer(text="Testlar tugatildi")

    else:
        await call.message.edit_text(text="Iltimos oldin ro'yhatdan o'ting so'ngra testlarni ishlab ko'rishinigiz mumkun!")
