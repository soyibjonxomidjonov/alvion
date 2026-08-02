from rest_framework.routers import DefaultRouter
from management.views.misc_view import CourseViewSet, TeacherViewSet, CertificateViewSet, LessonViewSet, \
    LessonInfoViewSet, RegisterUserViewSet, BotUserViewSet

from management.views.course_test_view import  TestViewSet, TestResultViewSet, QuestionViewSet, ChoiceViewSet


from management.views.price_and_news_view import (EventsViewSet, AksiyaViewSet, ChegirmaViewSet,
MonthlyPaymentViewSet, PaymentMethodsViewSet, AnnouncementViewSet)


router = DefaultRouter()

router.register('bot_users', BotUserViewSet, basename="bot users")

router.register('courses', CourseViewSet, basename='courses')
router.register('teachers', TeacherViewSet, basename='teachers')
router.register('certificates', CertificateViewSet, basename='certificates')
router.register('lessons', LessonViewSet, basename='lessons')
router.register('lessoninfo', LessonInfoViewSet, basename='lessoninfo')
router.register('registeruser', RegisterUserViewSet, basename='registeruser')



router.register('tests', TestViewSet, basename='tests')
router.register('test_result', TestResultViewSet, basename='test_result')
router.register('test_question', QuestionViewSet, basename='test_question')
router.register('test_choice', ChoiceViewSet, basename='test_choice')



router.register('events', EventsViewSet, basename='events')
router.register('aksiyalar', AksiyaViewSet, basename='aksiyalar')
router.register('chegirmalar', ChegirmaViewSet, basename='chegirmalar')
router.register('oylik_tolov', MonthlyPaymentViewSet, basename='oylik_tolov')
router.register('tolov_turlari', PaymentMethodsViewSet, basename='tolov_turlari')
router.register('elonlar', AnnouncementViewSet, basename='elonlar')
