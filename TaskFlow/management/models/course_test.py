from django.db import models

from management.models.misc import RegisterUser, Course


class Test(models.Model):
    name = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()


class Choice(models.Model):
    question = models.ForeignKey(Question, models.CASCADE, related_name="choices")
    text = models.TextField()
    is_correct = models.BooleanField(default=False)


class TestResult(models.Model):
    test_user = models.ForeignKey(RegisterUser, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    test_question = models.ForeignKey(Question, on_delete=models.CASCADE)
    is_passed = models.BooleanField(default=False)



