
from bot import dp
from aiogram import types

from database import get_all, get_id, Prices
from keyboards import get_chegirma_inlines
from keyboards.basic import get_inlines
from database.urls import COURSE_URL, CHEGIRMALAR_URL, AKSIYALAR_URL, PAYMENT_METHODS_URL
from keyboards.misc import prices_k



@dp.message_handler(text="💰 Narxlar")
async def info_prices(msg: types.Message):
    await msg.answer(text=Prices.TEXT, reply_markup=prices_k, parse_mode='HTML', disable_web_page_preview=True)


@dp.message_handler(text="Oylik to'lo'v")
async def monthly_payment(msg: types.Message):
    await msg.answer(text="Ma'lumot olish uchun tanlang", reply_markup=get_inlines(COURSE_URL, 'course'))


@dp.message_handler(text="Chegirmalar")
async def chegirmalar(msg: types.Message):
    await msg.answer(text="Bizdagi chegirmalar", reply_markup=get_chegirma_inlines(CHEGIRMALAR_URL, 'chegirma'))



@dp.callback_query_handler(lambda c: c.data.startswith('chegirma_'))
async def chegirma_inline(call: types.CallbackQuery):
    chegirma, chegirma_id, course_name = call.data.split("_")
    chegirma = get_id(f"{CHEGIRMALAR_URL}", chegirma_id)
    start_date = chegirma['start_time'].split("T")[0]
    end_date = chegirma['end_time'].split("T")[0]


    answer_text = Prices.CHEGIRMA_TEXT.format(course_name, chegirma['discount_percent'], start_date, end_date)
    await call.message.edit_text(text=answer_text, parse_mode='HTML', disable_web_page_preview=True)



    # await call.message.edit_text(f"{course_name} kursida {chegirma['discount_percent']}%  chegirma bor.\n\n"
    #                          f"Chegirma boshlanish sanasi {start_date}\n"
    #                          f"Chegirma tugash sanasi {end_date}\n"
    #                          )

















@dp.message_handler(text="Aksiyalar")
async def aksiyalar(msg: types.Message):
    await msg.answer(text="Bizdagi aksiyalar", reply_markup=get_inlines(AKSIYALAR_URL, 'aksiya'))

@dp.callback_query_handler(lambda c: c.data.startswith('aksiya_'))
async def chegirma_inline(call: types.CallbackQuery):
    aksiya_id = call.data.split("_")[1]
    aksiya = get_id(f"{AKSIYALAR_URL}", aksiya_id)

    answer_text = Prices.AKSIYA_TEXT.format(aksiya['name'], aksiya['text'])

    await call.message.reply(text=answer_text, parse_mode='HTML', disable_web_page_preview=True)




    # await call.message.reply(f"Bizda {aksiya['name']} nomli aksiyada devom etmoqda.\n\n"
    #                          f"{aksiya['text']}\n"
    #                          )





@dp.message_handler(text="To'lo'v usullari")
async def payment_methods(msg: types.Message):
    await msg.answer(text=Prices.PAYMENT_METHODS, reply_markup=get_inlines(PAYMENT_METHODS_URL, "payment"), parse_mode='HTML', disable_web_page_preview=True)




@dp.callback_query_handler(lambda c: c.data.startswith('payment_'))
async def payment_inline(call: types.CallbackQuery):
    payment_id = call.data.split("_")[1]
    payment = get_id(f"{PAYMENT_METHODS_URL}", payment_id)


    await call.message.reply(text=Prices.PAYMENT_TEXT.format(payment['name'], payment['card_holder_name'], payment['card_number']), parse_mode='HTML', disable_web_page_preview=True)

    # await call.message.reply(f"Bank nomi {payment['name']}\n\n"
    #                          f"Karta egasi {payment['card_holder_name']}\n"
    #                          f"Karta raqam {payment['card_number']}"
    #                          )

































