from django.urls import path, include, re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


from drf_yasg.generators import OpenAPISchemaGenerator
from rest_framework import permissions

# from rest_framework.routers import DefaultRouter
from management.router import router

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from management.views.message_view import SendMessageViewSet


class JWTSchemaGenerator(OpenAPISchemaGenerator):

    def get_security_definitions(self):
        security_definitions = super().get_security_definitions()
        security_definitions['Bearer'] = {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
        return security_definitions


schema_view = get_schema_view(
    openapi.Info(
        title="Employes Manegment",
        default_version='v2',
        description='API documentation for Employes Manegment ',
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="employes@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    generator_class=JWTSchemaGenerator,
)


urlpatterns = [
    path('v1/', include(router.urls)),

    #  agar pustoy path() ga kirsa pastagi swaggerga kirib ketadi
    path('', schema_view.with_ui('swagger', cache_timeout=0), name="schema-swagger-ui"),
    path('v1/send_message/', SendMessageViewSet.as_view({"post": 'send_messages_bot'}), name='send_messages_bot'),

    # Urllarga Djoserni qo'shish uchun pastagi kodlar
    path('v1/auth/', include('djoser.urls')),
    path('v1/auth/token/', TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('v1/auth/token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('v1/auth/token/verify/', TokenVerifyView.as_view(), name="token_verify"),



    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name="schema-json"),
    # ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ shu


    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name="schema-redoc"),

]
