from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


phone_regex = RegexValidator(
    regex=r'^\+998\d{9}$',
    message="Format: '+998xxxxxxxxx'"
)



class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, email, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('Telefon raqam kiritilishi shart')
        if not email:
            raise ValueError('Email kiritilishi shart')

        email = self.normalize_email(email)
        user = self.model(phone_number=phone_number, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, email, password=None, **extra_fields):  # email bu yerga ham qo'shildi
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        extra_fields.setdefault('role', 'admin')
        return self.create_user(phone_number, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):

    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        MANAGER = 'manager', 'Menejer'


    phone_number = models.CharField(max_length=15, unique=True, validators=[phone_regex])
    email = models.EmailField(max_length=255, unique=True)

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, blank=True)

    role = models.CharField(max_length=50, choices=Role.choices, default=Role.MANAGER)

    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()


    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['email', 'first_name']


    def __str__(self):
        return f"{self.first_name} ({self.phone_number})"


    class Meta:
        verbose_name = 'Foydalanuvchi'
        verbose_name_plural = 'Foydalanuvchilar'
        ordering = ['-date_joined']
