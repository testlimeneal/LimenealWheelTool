from django.db import models
from api.user.models import User
# Create your models here.

class LimenealUser(models.Model):
    USER_TYPE_CHOICES = (
        ('operator', 'Operator'),
        ('user', 'User'),
    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='limeneal_user')
    super_admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='super_admin_user',limit_choices_to={'is_superuser': True})
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,related_name='admin_user',limit_choices_to={'role': 'admin'})
    client_admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,blank=True,related_name='client_admin_user',limit_choices_to={'role': 'clientadmin'})
    client_subadmin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,blank=True, related_name='client_subadmin_user',limit_choices_to={'role': 'clientsubadmin'})

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES,default='user')

    def __str__(self):
        return f"Limeneal User: {self.user.email}"