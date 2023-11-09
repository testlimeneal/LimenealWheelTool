from django.urls import path
from rest_framework import routers
from api.assessment.views import QuizDetailAPIView,Quiz2List, QuizListAPIView,CheckUserRegistration,Level2ResponseAPIView,Level3ResponseAPIView,Level3QuestionList, UserResponseBulkCreateAPIView, UserQuizzesAPIView, DownloadReportView, CombinedDataView, UserProfileViewSet

router = routers.SimpleRouter(trailing_slash=False)
# router.register(r'quizzes', QuizViewSet)

urlpatterns = [
    # Your other URL patterns

    # Include the router's URL patterns
    # *router.urls,

    # Add your custom URL pattern for quiz details
    path('quizzes/', QuizListAPIView.as_view(), name='quiz-list'),
    path('quiz/<int:id>', QuizDetailAPIView.as_view(), name='quiz-detail'),
    path('userresponses/', UserResponseBulkCreateAPIView.as_view(),
         name='user-response-bulk-create'),
    path('completed', UserQuizzesAPIView.as_view(), name='user-quizzes'),
    path('report/download', DownloadReportView.as_view(), name='user-report'),
    path('form/data', CombinedDataView.as_view(), name='form-data'),
    path('user-profiles/'   , UserProfileViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-profile-list'),
    path('quiz2', Quiz2List.as_view(), name='quiz-list'),
    path('level3', Level3QuestionList.as_view(), name='question-list'),

    # path('quiz3', Quiz3List.as_view(), name='quiz-list'),
    path('level2response', Level2ResponseAPIView.as_view(), name='level2response-api'),
    path('level3response', Level3ResponseAPIView.as_view(), name='level2respons3-api'),

    # path('check-registration/', CheckUserRegistration.as_view(), name='check-user-registration'),




]
