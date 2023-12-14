from django.urls import path, include, re_path
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from . import views 

app_name = 'api.assessment'

urlpatterns = [
    path("api/users/", include(("api.routers", "api"), namespace="api")),
    path("api/assessment/", include(("api.assessment.routers", "api "), namespace="api")),
    path("api/superadmin/", include(("api.superadmin.routers", "api "), namespace="api")),
    # path("jet/",include('jet.urls','jet')),
    path('admin/', admin.site.urls),
    re_path(r'.*',views.index,name='index'),
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
] 
