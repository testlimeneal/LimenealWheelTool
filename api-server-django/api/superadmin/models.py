from django.db import models
from api.user.models import User
from django.core.validators import MinValueValidator  # Import MinValueValidator
from django.utils import timezone

# Create your models here.

class LimenealUser(models.Model):
    USER_TYPE_CHOICES = (
        ('operator', 'Operator'),
        ('user', 'User'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='limeneal_user')
    super_admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='super_admin_user',limit_choices_to={'is_superuser': True})
    admin = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,related_name='admin_user',limit_choices_to={'role': 'admin'})
    client_admin = models.ForeignKey(User, on_delete=models.CASCADE, null=True,blank=True,related_name='client_admin_user',limit_choices_to={'role': 'clientadmin'})
    client_subadmin = models.ForeignKey(User, on_delete=models.CASCADE, null=True,blank=True, related_name='client_subadmin_user',limit_choices_to={'role': 'clientsubadmin'})

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES,default='user')

    def __str__(self):
        return f"Limeneal User: {self.user.email} | {self.user.role}"



EMPLOYMENT_STATUS_CHOICES = [
    ('Full-Time Employee', 'Full-Time Employee'),
    ('Part-Time Employee', 'Part-Time Employee'),
    ('Full-Time Contract', 'Full-Time Contract'),
    ('Part-Time Contract', 'Part-Time Contract'),
    ('Temporary', 'Temporary'),
]




class AdminList(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_list')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='created_admin_lists')

    date_of_creation = models.DateField(default=timezone.now().date())  
    org_client_name = models.CharField(max_length=255, default='')
    address = models.TextField(default='')  # Default set to an empty string
    type_of_business = models.CharField(max_length=255, default='')
    pan_no = models.CharField(max_length=20, default='')
    gst_no = models.CharField(max_length=20, default='')
    uid = models.CharField(max_length=20, unique=True, default='')
    admin_name = models.CharField(max_length=255, default='')
    admin_designation = models.CharField(max_length=255, default='')
    employment_status = models.CharField(max_length=20, choices=EMPLOYMENT_STATUS_CHOICES, default='')
    admin_contact_details = models.CharField(max_length=20, default='')
    admin_address = models.TextField(default='')  # Default set to an empty string
    admin_email_id = models.EmailField(default='')
    # rights_given = models.CharField(max_length=50, choices=ACCESS_CHOICES, default='')
    # total_tools_given = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lp1 = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lp2 = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lp3 = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    ltb = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    ltf = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    # creating_assessee = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='created_assessees')
    
    # Assuming you want to use the user's status for the account status
    @property
    def account_status(self):
        return self.user.status

    def __str__(self):
        return f"Registered Email : {self.user.email}"


class ClientAdminList(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='clientadmin_list')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='created_clientadmin_lists')

    date_of_creation = models.DateField(default=timezone.now().date())  
    org_client_name = models.CharField(max_length=255, default='')
    address = models.TextField(default='')  # Default set to an empty string
    type_of_business = models.CharField(max_length=255, default='')
    pan_no = models.CharField(max_length=20, default='')
    gst_no = models.CharField(max_length=20, default='')
    uid = models.CharField(max_length=20, unique=True, default='')
    admin_name = models.CharField(max_length=255, default='')
    admin_designation = models.CharField(max_length=255, default='')
    employment_status = models.CharField(max_length=20, choices=EMPLOYMENT_STATUS_CHOICES, default='')
    admin_contact_details = models.CharField(max_length=20, default='')
    admin_address = models.TextField(default='')  # Default set to an empty string
    admin_email_id = models.EmailField(default='')
    # rights_given = models.CharField(max_length=50, choices=ACCESS_CHOICES, default='')
    # total_tools_given = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lp1 = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lp2 = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lp3 = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    ltb = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    ltf = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    # creating_assessee = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='created_assessees')
    
    # Assuming you want to use the user's status for the account status
    @property
    def account_status(self):
        return self.user.status

    def __str__(self):
        return f"Registered Email : {self.user.email}"



class ClientSubAdminList(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='clientsubadmin_list')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='created_clientsubadmin_lists')

    date_of_creation = models.DateField(default=timezone.now().date())  
    org_client_name = models.CharField(max_length=255, default='')
    address = models.TextField(default='')  # Default set to an empty string
    type_of_business = models.CharField(max_length=255, default='')
    pan_no = models.CharField(max_length=20, default='')
    gst_no = models.CharField(max_length=20, default='')
    uid = models.CharField(max_length=20, unique=True, default='')
    admin_name = models.CharField(max_length=255, default='')
    admin_designation = models.CharField(max_length=255, default='')
    employment_status = models.CharField(max_length=20, choices=EMPLOYMENT_STATUS_CHOICES, default='')
    admin_contact_details = models.CharField(max_length=20, default='')
    admin_address = models.TextField(default='')  # Default set to an empty string
    admin_email_id = models.EmailField(default='')
    # rights_given = models.CharField(max_length=50, choices=ACCESS_CHOICES, default='')
    # total_tools_given = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lp1 = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lp2 = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lp3 = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    ltb = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    ltf = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    # creating_assessee = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='created_assessees')
    
    # Assuming you want to use the user's status for the account status
    @property
    def account_status(self):
        return self.user.status

    def __str__(self):
        return f"Registered Email : {self.user.email}"