from aiogram import executor
from middlewares.log import LoggingMiddleware


from bot import dp
dp.middleware.setup(LoggingMiddleware())
import handlers

if __name__ == "__main__":
    executor.start_polling(dispatcher=dp, skip_updates=True)




