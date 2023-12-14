from django.urls import path
from rest_framework import routers 
from api.superadmin.views.careers import JobListCreateView, JobDetailView, CareerClusterAndBucketListView
from api.superadmin.views.users import CreateUserView, UserListView, DownloadReportsView
router = routers.SimpleRouter(trailing_slash=False)
# router.register(r'quizzes', QuizViewSet)

urlpatterns = [
    path('jobs/', JobListCreateView.as_view(), name='job-list-create'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('clusters_and_buckets/', CareerClusterAndBucketListView.as_view(), name='cluster-bucket-list'),
    path('create-user/', CreateUserView.as_view(), name='create-user'),
    path('get-users/', UserListView.as_view(), name='user-list'),
    path('download_reports/', DownloadReportsView.as_view(), name='download_reports'),
]

