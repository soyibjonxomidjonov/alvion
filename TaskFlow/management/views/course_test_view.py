from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework import viewsets
from management.models.course_test import Test, TestResult, Question, Choice
from management.serializers.course_test_serializer import (TestSerializerConfig, TestResultSerializerConfig,
                                                    QuestionSerializerConfig, ChoiceSerializerConfig)

from django_filters import rest_framework as django_filters
from rest_framework import filters

from .user_view import CustomPagination


class TestViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Test.objects.all()
    serializer_class = TestSerializerConfig
    # pagination_class = CustomPagination
    filter_backends = (django_filters.DjangoFilterBackend, filters.SearchFilter)
    search_fields = ['course__id']

class TestResultViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializerConfig
    # pagination_class = CustomPagination
    filter_backends = (django_filters.DjangoFilterBackend, filters.SearchFilter)
    search_fields = ['test_user__id']
    filterset_fields = ['test_user__id', 'test__id']

class QuestionViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializerConfig
    # pagination_class = CustomPagination
    filter_backends = (django_filters.DjangoFilterBackend, filters.SearchFilter)
    search_fields = ['test__id']

class ChoiceViewSet(viewsets.ModelViewSet):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializerConfig
    # pagination_class = CustomPagination
    filter_backends = (django_filters.DjangoFilterBackend, filters.SearchFilter)
    search_fields = ['question__id', 'phone_number']
