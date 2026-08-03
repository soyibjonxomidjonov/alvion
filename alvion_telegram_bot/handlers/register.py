import logging

from aiogram import types
from aiogram.dispatcher import FSMContext

from bot import dp, bot
from database import create, get_all
from database.urls import REGISTER_USER_URL
from keyboards.contact import contact_button
from states.login import LoginState



@dp.message_handler(text="📝 Ro’yxatdan o’tish")
async def register(msg: types.Message):
    register_users = get_all(f"{REGISTER_USER_URL}?search={msg.from_user.id}")
    if register_users:
        await msg.answer(f"""ℹ️ <b>Siz allaqachon ro'yxatdan o'tgansiz</b>

Hurmatli {msg.from_user.first_name}, sizning ma'lumotlaringiz bizda mavjud. Savollaringiz bo'lsa ☎️ <b>Bog'lanish</b> bo'limi orqali murojaat qiling.
""", parse_mode='HTML', disable_web_page_preview=True)

    else:
        await msg.answer(text="✍️ <b>Ism va familyangizni</b> kiriting:", parse_mode='HTML', disable_web_page_preview=True)
        await LoginState.full_name.set()


@dp.message_handler(state=LoginState.full_name)
async def get_full_name(msg: types.Message, state: FSMContext):
    fullname = msg.text

    await state.update_data(fullname=fullname)
    await msg.reply(f"📱 <b>Telefon raqamingizni</b> yuboring (masalan: +998 90 123 45 67):", reply_markup=contact_button, parse_mode='HTML', disable_web_page_preview=True)
    await LoginState.phone_number.set()



@dp.message_handler(state=LoginState.phone_number, content_types=types.ContentTypes.CONTACT)
async def get_phone_number(msg: types.Message, state: FSMContext):
    print("Kontakt olishga urinmoqda")
    phone_number = msg.contact.phone_number
    await msg.answer(f"🎂 <b>Yoshingizni</b> kiriting:", parse_mode='HTML', disable_web_page_preview=True)
    await state.update_data(phone_number=phone_number)
    await LoginState.age.set()


@dp.message_handler(state=LoginState.phone_number, content_types=types.ContentTypes.TEXT)
async def get_phone_number_text(msg: types.Message):
    await msg.reply(text="Telefon raqamingizni yuboring")
    await LoginState.phone_number.set()



@dp.message_handler(state=LoginState.age)
async def get_age(msg: types.Message, state: FSMContext):
    age = msg.text
    await state.update_data(age=age)
    await msg.reply(text="📍 <b>Yashash manzilingizni</b> yuboring:", parse_mode='HTML', disable_web_page_preview=True)
    await LoginState.address.set()


@dp.message_handler(state=LoginState.address)
async def get_address(msg: types.Message, state: FSMContext):
    address = msg.text
    await state.update_data(address=address)
    await msg.reply(text="🗣 <b>Ingliz tili darajangizni</b> tanlang:", parse_mode='HTML', disable_web_page_preview=True)
    await LoginState.english_level.set()


@dp.message_handler(state=LoginState.english_level)
async def get_english_level(msg: types.Message, state: FSMContext):
    english_level = msg.text
    await state.update_data(english_level=english_level)
    await msg.reply(text="🕐 <b>Qulay dars vaqtini</b> tanlang:", parse_mode='HTML', disable_web_page_preview=True)
    await LoginState.time_convenience.set()



@dp.message_handler(state=LoginState.time_convenience)
async def get_time_convenience(msg: types.Message, state: FSMContext):
    time_convenience = msg.text
    await state.update_data(time_convenience=time_convenience)
    await msg.reply(text="""💬 Qo'shimcha <b>xabaringiz</b> bo'lsa yozing (bo'lmasa "yo'q" deb yozing):""", parse_mode='HTML', disable_web_page_preview=True)
    await LoginState.comment.set()


@dp.message_handler(state=LoginState.comment)
async def get_comment(msg: types.Message, state: FSMContext):
    comment = msg.text
    await state.update_data(comment=comment)
    data = await state.get_data()

    create_data = {
        "full_name": data['fullname'],
        "phone_number": data['phone_number'],
        "age": data['age'],
        "address": data['address'],
        "english_level": data['english_level'],
        "convenient_time": data['time_convenience'],
        "comment": data['comment'],
        "chat_id": msg.from_user.id
    }

    response = create(REGISTER_USER_URL, create_data)
    await bot.send_message(chat_id=7421875223, text=create_data)
    if response == "OK":
        await msg.reply(text=f"""🎉 <b>Tabriklaymiz, {msg.from_user.first_name}!</b>

Siz ALVION ta'lim markaziga muvaffaqiyatli ro'yxatdan o'tdingiz!✅

Tez orada operatorlarimiz siz bilan bog'lanadi 📞""", parse_mode='HTML', disable_web_page_preview=True)
        await state.finish()
    else:
        logging.error(f"Ro'yxatdan o'tishda xatolik: {response}")
        await msg.reply(
            text="❌ Ro'yxatdan o'tishda xatolik yuz berdi. Iltimos, /start bosib qaytadan urinib ko'ring.",
            parse_mode='HTML'
        )