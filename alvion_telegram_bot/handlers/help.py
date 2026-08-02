from main import dp
from aiogram import types




@dp.message_handler(commands=["help"])
async def help(msg: types.Message):
    await msg.answer("Qanday yordam kerak")
    print("Ishladi")



