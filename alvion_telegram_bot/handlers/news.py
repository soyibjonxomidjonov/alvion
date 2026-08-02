from bot import dp
from aiogram import types

from database import get_all, get_id
from keyboards import news_k
from keyboards.basic import get_inlines
from database.urls import LESSON_URL, LESSONINFO_URL, COURSE_URL, ELONLAR_URL, EVENTS_URL


@dp.message_handler(text="📢 Yangiliklar")
async def news(msg: types.Message):
    await msg.answer(text="""📢 <b>Yangiliklar</b>

Qaysi bo'limni ko'rmoqchisiz? 👇
• 📰 E'lonlar
• 👥 Yangi guruhlar
• 🎪 Tadbirlar""", reply_markup=news_k, parse_mode='HTML', disable_web_page_preview=True)


@dp.message_handler(text="Yangi guruhlar")
async def new_gruop(msg: types.Message):
    await msg.answer(text="Bizdagi mavjud guruhlar", reply_markup=get_inlines(COURSE_URL, 'course'))




@dp.message_handler(text="E'lonlar")
async def elonlar(msg: types.Message):
    await msg.answer(text="Oxirgi e'lonlar", reply_markup=get_inlines(ELONLAR_URL, 'elon'))



@dp.callback_query_handler(lambda c: c.data.startswith('elon_'))
async def elon_inline(call: types.CallbackQuery):
    elon_id = call.data.split("_")[1]
    elon = get_id(f"{ELONLAR_URL}", elon_id)

    text = """📰 <b>So'nggi e'lonlar</b>

📌 {}

🗓 {}"""
    await call.message.edit_text(text.format(elon['name'], elon['description']), parse_mode='HTML', disable_web_page_preview=True)






@dp.message_handler(text="Tadbirlar")
async def events(msg: types.Message):
    await msg.answer(text="Oxirgi tadbirlar", reply_markup=get_inlines(EVENTS_URL, 'event'))



@dp.callback_query_handler(lambda c: c.data.startswith('event_'))
async def event_inline(call: types.CallbackQuery):
    event_id = call.data.split("_")[1]
    event = get_id(f"{EVENTS_URL}", event_id)

    await call.message.edit_text(f"{event['name']}\n\n"
                             f"{event['description']}"
                             )













@dp.callback_query_handler(lambda c: c.data.startswith('lesson_'))
async def lesson_inline(call: types.CallbackQuery):
    lesson_id = call.data.split("_")[1]
    lesson_info = get_all(f"{LESSONINFO_URL}?search={lesson_id}")
    date = lesson_info[0]['start_time'].split("T")[0]


    await call.message.reply(f"Hozirda {lesson_info[0]['empty_spaces']} ta bo'sh joylar bor.\n\n"
                             f"Kurs boshlanish sanasi {date}")



























