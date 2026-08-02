from django.db import models
from management.models.misc import Course


class MonthlyPayment(models.Model):
    price = models.IntegerField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=False, related_name='monthly_payment')

class Chegirma(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='chegirma')
    discount_percent = models.PositiveIntegerField(default=0)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()


class Aksiya(models.Model):
    name = models.CharField(max_length=150, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True, related_name="aksiya")
    text = models.TextField()


class PaymentMethods(models.Model):
    name  = models.CharField(max_length=200, help_text="Bank or others")
    card_holder_name = models.CharField(max_length=150)
    card_number = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)


# E'lonlar
class Announcement(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()

# Tadbirlar
class Events(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True)




























