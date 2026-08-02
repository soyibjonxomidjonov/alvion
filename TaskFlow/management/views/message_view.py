import os
import asyncio

import httpx
import requests
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status

from management.models import BotUser
from management.serializers import SendToAllSerializer
from rest_framework.response import Response


class SendMessageViewSet(viewsets.ViewSet):

    @swagger_auto_schema(request_body=SendToAllSerializer)
    def send_messages_bot(self, request):
        serializer = SendToAllSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.validated_data['message']
        chat_ids = list(BotUser.objects.values_list('chat_id', flat=True))
        token = os.environ.get("BOT_TOKEN")

        asyncio.run(self._send_messages(message, token, chat_ids))


        return Response({'message': 'The message has been delivered to everyone.'}, status=status.HTTP_200_OK)












    async def _send_single_message(self, client, chat_id, message, token):
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message
        }
        try:
            response = await client.post(url, json=payload)
            return response.status_code
        except Exception as e:
            print(f"xatoli {chat_id}: {e}")
            return None

    async def _send_messages(self,message, token, chat_ids):
        async with httpx.AsyncClient() as client:
            tasks = [
                self._send_single_message(client, chat_id, message, token)
                for chat_id in chat_ids
            ]

            await asyncio.gather(*tasks)











