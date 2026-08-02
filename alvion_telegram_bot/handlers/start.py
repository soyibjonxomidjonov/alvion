from database import create, CONTACT, get_id, get_all
from database.urls import BOT_USER_URL
from keyboards import admin_reply_menu
from main import dp
from aiogram import types
from aiogram.dispatcher import FSMContext
from keyboards.mainmenu import reply_main_menu
from bot import bot
from database.text_shablon import StartTexts
from aiogram.types import WebAppInfo, KeyboardButton, MenuButtonDefault



@dp.message_handler(commands=['start'], state='*')
async def start(msg: types.Message, state: FSMContext):
    await state.finish()

    user = get_all(f"{BOT_USER_URL}?chat_id={msg.from_user.id}")
    print(user, "Bot ishga tushdi!")

    if not user:
        username = msg.from_user.username
        data = {"chat_id": msg.from_user.id, "username": username}
        print(f"{create(BOT_USER_URL, data)} foydalanuvchi yaratildi")

        await bot.set_chat_menu_button(
            chat_id=msg.from_user.id,
            menu_button=MenuButtonDefault()
        )

        await msg.answer(
            text=StartTexts.TEXT.format(msg.from_user.first_name),
            reply_markup=reply_main_menu,
            parse_mode='HTML',
            disable_web_page_preview=True
        )
    else:
        if user[0]['is_admin']:

            await msg.answer(
                text=StartTexts.TEXT.format(msg.from_user.first_name),
                reply_markup=admin_reply_menu,
                parse_mode='HTML',
                disable_web_page_preview=True
            )
        else:

            await msg.answer(
                text=StartTexts.TEXT.format(msg.from_user.first_name),
                reply_markup=reply_main_menu,
                parse_mode='HTML',
                disable_web_page_preview=True
            )




@dp.message_handler(text="Ortga qaytish")
async def back_to(msg: types.Message):
    await msg.answer(text="Asosiy menyu", reply_markup=reply_main_menu)




@dp.message_handler(text="☎️ Bog’lanish")
async def contact_us(msg: types.Message):

    await msg.answer(text=CONTACT.TEXT, parse_mode="HTML", disable_web_page_preview=True)

@dp.message_handler(text="🌐 Ijtimoiy tarmoqlar")
async def messengers(msg: types.Message):
    telegram_url = "https://t.me/username"
    instagram_url = "https://instagram.com/username"
    facebook_url = "https://facebook.com/username"
    youtube_url = "https://youtube.com/@username"
    website_url = "https://example.com"

    text = f"""🌐 <b>Ijtimoiy tarmoqlarimiz</b>

🔹 <a href="{telegram_url}">Telegram kanal</a>
🔹 <a href="{instagram_url}">Instagram sahifa</a>
🔹 <a href="{facebook_url}">Facebook sahifa</a>
🔹 <a href="{youtube_url}">YouTube kanal</a>
🔹 <a href="{website_url}">Rasmiy veb-sayt</a>"""


    await msg.answer(text=text, parse_mode="HTML", disable_web_page_preview=True)
