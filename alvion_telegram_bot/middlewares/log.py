import logging
from aiogram import types
from aiogram.dispatcher.middlewares import BaseMiddleware
from aiogram.dispatcher.handler import CancelHandler



class LoggingMiddleware(BaseMiddleware):
    async def on_pre_process_message(self, msg: types.Message, data: dict, *args, **kwargs):
        print("Middleware working")
        content = msg.text or msg.caption or f"[{msg.content_type}]"
        logging.info(f"User {msg.from_user.id} sent: {content}")

    async def on_post_process_message(self, msg: types.Message, data: dict, *args, **kwargs):
        print("Middleware working")
        logging.info(f"Message from {msg.from_user.id}  processed successfully")









