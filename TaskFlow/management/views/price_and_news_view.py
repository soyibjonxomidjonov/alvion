from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework import viewsets
from management.models.price_and_news import MonthlyPayment, Chegirma, Aksiya, PaymentMethods, Announcement, Events
from management.serializers.price_and_news_serializer import (MonthlyPaymentSerializerConfig, ChegirmaSerializerConfig,
                                                    PaymentMethodsSerializerConfig, AksiyaSerializerConfig,
                                                              AnnouncementSerializerConfig, EventsSerializerConfig)

from .user_view import CustomPagination


class MonthlyPaymentViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = MonthlyPayment.objects.all()
    serializer_class = MonthlyPaymentSerializerConfig
    # pagination_class = CustomPagination


class ChegirmaViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Chegirma.objects.all()
    serializer_class = ChegirmaSerializerConfig
    # pagination_class = CustomPagination


class AksiyaViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Aksiya.objects.all()
    serializer_class = AksiyaSerializerConfig
    # pagination_class = CustomPagination


class PaymentMethodsViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = PaymentMethods.objects.all()
    serializer_class = PaymentMethodsSerializerConfig
    # pagination_class = CustomPagination



class AnnouncementViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializerConfig
    # pagination_class = CustomPagination


class EventsViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Events.objects.all()
    serializer_class = EventsSerializerConfig
    # pagination_class = CustomPagination