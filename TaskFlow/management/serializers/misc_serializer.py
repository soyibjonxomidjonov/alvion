from rest_framework import serializers
from management.models.misc import Course, Certificate, RegisterUser, Lesson, LessonInfo, Teacher, BotUser


class CourseSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"
        read_only_fields = ['id', 'created_at']



class RegisterUserSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = RegisterUser
        fields = "__all__"
        read_only_fields = ['id', 'created_at']




class TeacherSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = "__all__"
        read_only_fields = ['id', 'created_at']

class BotUserSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = BotUser
        fields = "__all__"
        read_only_fields = ['id', 'created_at']




class LessonSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = "__all__"
        read_only_fields = ['id']

class LessonInfoSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = LessonInfo
        fields = "__all__"
        read_only_fields = ['id']













class CertificateSerializerConfig(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = "__all__"
        read_only_fields = ['id', 'created_at']




class SendToAllSerializer(serializers.Serializer):
    message = serializers.CharField()


















