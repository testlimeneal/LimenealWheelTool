from django.contrib import admin
from api.superadmin.models import LimenealUser, AdminList, ClientAdminList, ClientSubAdminList
# Register your models here.
admin.site.register(LimenealUser)
admin.site.register(AdminList)
admin.site.register(ClientAdminList)
admin.site.register(ClientSubAdminList)
