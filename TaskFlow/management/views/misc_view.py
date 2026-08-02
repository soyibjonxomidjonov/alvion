from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters import rest_framework as django_filters
from rest_framework import filters

from rest_framework import viewsets
from management.models.misc import Course, Teacher, Lesson, LessonInfo, Certificate, RegisterUser, BotUser
from management.serializers.misc_serializer import (CourseSerializerConfig, TeacherSerializerConfig,
                                                    LessonSerializerConfig, LessonInfoSerializerConfig, CertificateSerializerConfig,
                                                    RegisterUserSerializerConfig)

from .user_view import CustomPagination
from ..serializers import BotUserSerializerConfig


class CourseViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Course.objects.all()
    serializer_class = CourseSerializerConfig
    # pagination_class = CustomPagination



class TeacherViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializerConfig
    # pagination_class = CustomPagination
    filter_backends = (django_filters.DjangoFilterBackend, filters.SearchFilter)
    search_fields = ['lesson_id__id']
    filterset_fields = ['course_id_id']


class LessonViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializerConfig
    # pagination_class = CustomPagination




class LessonInfoViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = LessonInfo.objects.all()
    serializer_class = LessonInfoSerializerConfig
    filter_backends = (django_filters.DjangoFilterBackend, filters.SearchFilter)
    search_fields = ['lesson_id__id']

class BotUserViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = BotUser.objects.all()
    serializer_class = BotUserSerializerConfig
    filter_backends = (django_filters.DjangoFilterBackend, filters.SearchFilter)
    search_fields = ['chat_id']
    filterset_fields = ['chat_id']






class CertificateViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializerConfig
    # pagination_class = CustomPagination
    filter_backends = (django_filters.DjangoFilterBackend, filters.SearchFilter)
    search_fields = ['teacher_id__id']


class RegisterUserViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = RegisterUser.objects.all()
    serializer_class = RegisterUserSerializerConfig
    # pagination_class = CustomPagination
    filter_backends = (django_filters.DjangoFilterBackend, filters.SearchFilter)
    search_fields = ['chat_id']
    filterset_fields = ['id']
