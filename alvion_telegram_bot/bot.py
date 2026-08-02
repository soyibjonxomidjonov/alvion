import logging
import os
from aiogram import Bot, Dispatcher
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from dotenv import load_dotenv


load_dotenv()

BOT_TOKEN = os.environ.get("BOT_TOKEN")

logging.basicConfig(level=logging.INFO)

storage = MemoryStorage()
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot=bot, storage=storage)

