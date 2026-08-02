from rest_framework import serializers
from management.models.price_and_news import (Events, MonthlyPayment, Aksiya,
                                              Chegirma, PaymentMethods, Announcement
                                              )





class EventsSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = "__all__"
        read_only_fields = ['id']




class MonthlyPaymentSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = MonthlyPayment
        fields = "__all__"
        read_only_fields = ['id']


class AksiyaSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Aksiya
        fields = "__all__"
        read_only_fields = ['id']


class ChegirmaSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Chegirma
        fields = "__all__"
        read_only_fields = ['id']



class PaymentMethodsSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethods
        fields = "__all__"
        read_only_fields = ['id']


class AnnouncementSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = "__all__"
        read_only_fields = ['id']









