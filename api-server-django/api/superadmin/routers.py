from django.urls import path
from rest_framework import routers 
from api.superadmin.views.careers import JobListCreateView, JobDetailView, CareerClusterAndBucketListView,GetDimensionsView
from api.superadmin.views.users import CreateUserView, UserListView, DownloadReportsView, AdminListView,AdminListView, ClientAdminListView, ClientSubAdminListView
from api.superadmin.views.admin import CreateAdminView, CreateClientAdminView, CreateClientSubAdminView
router = routers.SimpleRouter(trailing_slash=False)
# router.register(r'quizzes', QuizViewSet)

urlpatterns = [
    # Job-related URLs
    path('jobs/', JobListCreateView.as_view(), name='job-list-create'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),

    # Career Cluster and Bucket URLs
    path('clusters_and_buckets/', CareerClusterAndBucketListView.as_view(), name='cluster-bucket-list'),

    # User-related URLs
    path('create-user/', CreateUserView.as_view(), name='create-user'),
    path('get-users/', UserListView.as_view(), name='user-list'),

    # Admin-related URLs
    path('create-admin/', CreateAdminView.as_view(), name='create-admin'),
    path('get-admins/', AdminListView.as_view(), name='admin-list'),

    # Client Admin URLs
    path('create-clientadmin/', CreateClientAdminView.as_view(), name='create-clientadmin'),
    path('create-clientsubadmin/', CreateClientSubAdminView.as_view(), name='create-clientsubadmin'),
    path('get-clientadmins/<int:id>/', ClientAdminListView.as_view(), name='client-admin-list'),
    path('get-clientadmins/', ClientAdminListView.as_view(), name='client-admin-list-no-id'),

    
    path('get-clientsubadmins/', ClientSubAdminListView.as_view(), name='client-subadmin-list-no-id'),

    path('get-clientsubadmins/<int:id>/', ClientSubAdminListView.as_view(), name='client-subadmin-list'),
    path('get-clientsubadmins/', ClientSubAdminListView.as_view(), name='client-subadmin-list-no-id'),

    # Other URLs
    path('get-dimensions/', GetDimensionsView.as_view(), name='get-dimensions'),
    path('download_reports/', DownloadReportsView.as_view(), name='download_reports'),
]

