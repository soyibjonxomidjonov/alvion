from django.core.validators import RegexValidator
from django.db import models

phone_regex = RegexValidator(
    regex=r'^\+998\d{9}$',
    message="Format: '+998xxxxxxxxx'"
)

class Course(models.Model):
    # nomi
    name = models.CharField(max_length=200, null=False, blank=False)
    # davomiyligi
    duration = models.PositiveIntegerField()
    # Haftadagi darslar soni
    lesson_per_week = models.PositiveSmallIntegerField(default=3)
    # Kimlar uchun ekanligi
    for_whom = models.TextField()
    # Kurs yakunida erishiladigan natijalar
    results_course = models.TextField()

    monthly_payment_base = models.IntegerField(null=True)

    created_at = models.DateTimeField(auto_now_add=True)


class RegisterUser(models.Model):
    full_name = models.CharField(max_length=250, null=False, blank=False)
    phone_number = models.CharField(max_length=15, validators=[phone_regex])
    age = models.IntegerField()
    address = models.CharField(max_length=200)
    english_level = models.CharField(max_length=150)
    # qulay vaqt
    convenient_time = models.TextField()
    comment = models.TextField()
    chat_id = models.BigIntegerField(null=True, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)





class Lesson(models.Model):
    name = models.CharField(max_length=150)

class LessonInfo(models.Model):
    lesson_id = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    empty_spaces = models.PositiveIntegerField()





class Teacher(models.Model):
    name = models.CharField(max_length=150, null=False)
    experience = models.CharField(max_length=300, null=True)
    # Mutaxassisligi
    specialization = models.TextField()
#      Qaysi guruhlarga dars berishi
#     teaching_groups = TextField()

    course_id = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Certificate(models.Model):
    certificate_subject = models.CharField(max_length=50)
    certificate_level = models.CharField(max_length=20)

    teacher_id = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='certificates')

    created_at = models.DateTimeField(auto_now_add=True)





class BotUser(models.Model):
    chat_id = models.BigIntegerField(unique=True)
    username = models.CharField(max_length=100, null=True)
    is_admin = models.BooleanField(default=False)



















