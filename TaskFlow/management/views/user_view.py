from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from management.serializers import UserSerializerConfig
from rest_framework import viewsets



User = get_user_model()

class CustomPagination(PageNumberPagination):
    page_size = 5


class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializerConfig
    pagination_class = CustomPagination

    def get_permissions(self):
        return []
