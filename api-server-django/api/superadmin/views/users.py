# views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from api.superadmin.serializers.users import UserSerializer
from api.user.models import User
from rest_framework.permissions import IsAuthenticated

from api.superadmin.models import LimenealUser
from django.core.mail import send_mail
import random
import string
import zipfile
import tempfile
import os
from django.http import HttpResponse
from api.assessment.helperfunctions.common import generate_report_file_path
from api.assessment.models import UserProfile,UserResponse,Level2Response,Level3Response, ReportType
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def generate_random_password(self):
        # Generate a random password with 8 characters
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for i in range(8))

    def create(self, request, *args, **kwargs):
        # Generate a random password
        random_password = self.generate_random_password()

        # Create a mutable copy of the QueryDict
        mutable_data = request.data.copy()

        # Set the password in the mutable copy
        mutable_data['password'] = random_password

        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, random_password, request)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, password, request):
        # Call the save method of the serializer to create the User object
        user = serializer.save()

        # Email the login credentials (For console logging purposes in this example)
        email_subject = "Your Login Credentials"
        email_body = f"Username: {user.username}\nPassword: {password}"

        # Assuming you have an email field in your User model
        send_mail(email_subject, email_body, 'from@example.com', [user.email])

        # Add the user to LimenealUser model with super_admin as request.user
        LimenealUser.objects.create(user=user, super_admin=request.user, user_type='user')



class UserListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get_user_status(self,user):
        status = 'Not Filled up the Form'
        level = []
        if UserProfile.objects.filter(user=user).exists():
            status =  'Profile Form Filled'
            
        
        if UserResponse.objects.filter(user=user).exists():
            status =  'Level1 Test Given'
            level = ['Level 1']

        if Level2Response.objects.filter(user=user).exists():
            status = 'Level2 Test Given'
            level = ['Level 1','Level 2']
        if Level3Response.objects.filter(user=user).exists():
            status = 'Given all three tests'
            level = ['Level 1','Level 2','Level 3']
        return status, level
    
    def list(self, request, *args, **kwargs):
        user = self.request.user
        queryset = LimenealUser.objects.filter(
            user_type='user',
            super_admin=user,
            admin__isnull=True,
            client_admin__isnull=True,
            client_subadmin__isnull=True
        )
        data = []

        for obj in queryset:
            status, level = self.get_user_status(obj.user)
            allowed_reports = ReportType.objects.filter(level__in=level).values()
            if len(allowed_reports) > 0:
                curr_user = UserProfile.objects.get(user=obj.user)
                for i in allowed_reports:
                    file_path = curr_user.file_paths.get(str(i['id']), None)
                    is_report_paid = curr_user.report_paid.filter(id=str(i['id'])).exists()
                    if is_report_paid:
                        i['payment'] = "Done"
                    else:
                        i['payment'] = "Pending"
                
                    if file_path is not None:
                        i['status'] = 'Ready to Download'
                    else:
                        i['status'] = 'Not Processed'
            
            data.append({
                'id':obj.user.id,
                'user': obj.user.email,
                'username': obj.user.username,
                'date': obj.user.date,
                'status': status,
                'allowed_reports': allowed_reports,
            })

        return Response(data)
    


class DownloadReportsView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        user_id = data.get('user_id',None)
        reports = data.get('data',[])
        report_ids = [i['id'] for i in reports]
        zip_data, zip_file_name = generate_zip_file(user_id, report_ids)
        
        response = HttpResponse(zip_data, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{zip_file_name}"'
        return response

def generate_zip_file(user_id, report_ids):
    with tempfile.TemporaryDirectory() as temp_dir:
        zip_file_path = os.path.join(temp_dir, 'reports.zip')
        
        with zipfile.ZipFile(zip_file_path, 'w') as zip_file:
            for report_id in report_ids:
                file_path = generate_report_file_path(user_id, report_id)
                
                if os.path.exists(file_path):
                    with open(file_path, 'rb') as file:
                        report_data = file.read()
                        file_name = os.path.basename(file_path)
                        zip_file.writestr(f'{report_id}/{file_name}', report_data)
                else:
                    raise FileNotFoundError(f"File not found: {file_path}")

        with open(zip_file_path, 'rb') as zip_file:
            zip_data = zip_file.read()

        return zip_data, 'reports.zip'