from .base import *


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql', #bu postgres ulanish
        'NAME': os.environ.get("DATABASE_NAME"),# database nomi
        'USER': os.environ.get('DATABASE_USER'), #user nomi
        'PASSWORD': os.environ.get('USER_PASSWORD'), #user paroli
        'HOST': os.environ.get("DATABASE_HOST", 'postgres'), #bu yerda host beriladi
        'PORT': os.environ.get('PORT'), #va port yoziladi va tayyor
    }
}