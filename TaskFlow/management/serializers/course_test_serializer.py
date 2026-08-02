from rest_framework import serializers
from management.models.course_test import Test, TestResult, Question, Choice




class TestSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = "__all__"
        read_only_fields = ['id']




class TestResultSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = "__all__"
        read_only_fields = ['id']


class QuestionSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"
        read_only_fields = ['id']


class ChoiceSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = "__all__"
        read_only_fields = ['id', 'created_at']
















