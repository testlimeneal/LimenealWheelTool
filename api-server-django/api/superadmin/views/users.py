# views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from api.superadmin.serializers.users import UserSerializer
from api.user.models import User
from rest_framework.permissions import IsAuthenticated
from api.superadmin.tasks import generate_zip_file_async
from api.superadmin.views.contants import get_html_path
from api.superadmin.helperfunctions.scores import generate_excel_report
from api.superadmin.models import LimenealUser, AdminList, ClientAdminList, ClientSubAdminList
from django.core.mail import send_mail
import random
import string
import os
from django.http import HttpResponse, JsonResponse, FileResponse
from django.conf import settings


from api.assessment.models import UserProfile,UserResponse,Level2Response,Level3Response, ReportType
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def generate_random_password(self):
        # Generate a random password with 8 characters
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for i in range(8))

    def create(self, request, *args, **kwargs):
        random_password = self.generate_random_password()
        mutable_data = request.data.copy()
        mutable_data['password'] = random_password
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, random_password, request,mutable_data)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, password, request,mutable_data):
        user = serializer.save()
        email_subject = "Your Login Credentials"
        type = mutable_data['type']
        with open(get_html_path('page.html'), 'r') as file:
            email_body = file.read()
            email_body = email_body.replace('{{username}}', user.email);
            email_body = email_body.replace('{{password}}', password);

            send_mail(
                subject=email_subject,
                message='',  # Since you have HTML content, set message to an empty string
                from_email="no-reply@limenealwheel.com",
                recipient_list= [settings.SYSTEM_EMAIL],
                html_message=email_body,  # Include your HTML content here
            )
        if(type=='superadmin'):
            LimenealUser.objects.create(user=user, super_admin=request.user, user_type='user')
        elif(type=='admin'):
            admin_instance = User.objects.get(id=mutable_data['admin_id'])
            admin_user = LimenealUser.objects.get(user=admin_instance)
            LimenealUser.objects.create(user=user, super_admin=admin_user.super_admin,admin=admin_instance, user_type='user')
        elif(type=='clientadmin'):
            admin_instance = User.objects.get(id=mutable_data['admin_id'])
            admin_user = LimenealUser.objects.get(user=admin_instance)
            LimenealUser.objects.create(user=user, super_admin=admin_user.super_admin,admin=admin_user.admin,client_admin=admin_instance, user_type='user')
        elif(type=='clientsubadmin'):
            admin_instance = User.objects.get(id=mutable_data['admin_id'])
            admin_user = LimenealUser.objects.get(user=admin_instance)
            LimenealUser.objects.create(user=user, super_admin=admin_user.super_admin,admin=admin_user.admin,client_admin=admin_user.client_admin,client_subadmin=admin_instance, user_type='user')

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



class AdminListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user = self.request.user

        
        queryset = LimenealUser.objects.filter(
            user_type='operator',
            super_admin=user,
            admin__isnull=True,
            client_admin__isnull=True,
            client_subadmin__isnull=True
        )

        admin_lists = AdminList.objects.filter(user__in=queryset.values_list('user', flat=True))
        result_array = []

        for admin_list in admin_lists:
            result_array.append({
                'user_email': admin_list.user.email,
                'user_username': admin_list.user.username,
                'org_client_name': admin_list.org_client_name,
                'address': admin_list.address,
                'type_of_business': admin_list.type_of_business,
                'pan_no': admin_list.pan_no,
                'gst_no': admin_list.gst_no,
                'uid': admin_list.uid,
                'admin_name': admin_list.admin_name,
                'admin_designation': admin_list.admin_designation,
                'employment_status': admin_list.employment_status,
                'admin_contact_details': admin_list.admin_contact_details,
                'admin_address': admin_list.admin_address,
                'admin_email_id': admin_list.admin_email_id,
                'lp1': admin_list.lp1,
                'lp2': admin_list.lp2,
                'lp3': admin_list.lp3,
                'ltb': admin_list.ltb,
                'ltf': admin_list.ltf,
                'user_id' : admin_list.user.id
                # 'account_status': admin_list.account_status,
            })
        # print(result_array)
        data = []
        
        return JsonResponse({"data" : result_array})


class ClientAdminListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user = self.request.user
        user_id = self.kwargs.get('id')
        
        if user_id:
            curr_admin = User.objects.get(id=user_id)
            queryset = LimenealUser.objects.filter(
                user_type='operator',
                super_admin__isnull=False,
                admin=curr_admin,
                client_admin__isnull=True,
                client_subadmin__isnull=True
            )
        else:
            queryset = LimenealUser.objects.filter(
            user_type='operator',
            super_admin__isnull=False,
            client_admin__isnull=True,
            client_subadmin__isnull=True
            )

            if user.role == 'superadmin':
                queryset = queryset.filter(admin__isnull=False)
            else:
                queryset = queryset.filter(admin=user)

        admin_lists = ClientAdminList.objects.filter(user__in=queryset.values_list('user', flat=True))
        result_array = []

        for admin_list in admin_lists:
            result_array.append({
                'user_email': admin_list.user.email,
                'user_username': admin_list.user.username,
                'org_client_name': admin_list.org_client_name,
                'address': admin_list.address,
                'type_of_business': admin_list.type_of_business,
                'pan_no': admin_list.pan_no,
                'gst_no': admin_list.gst_no,
                'uid': admin_list.uid,
                'admin_name': admin_list.admin_name,
                'admin_designation': admin_list.admin_designation,
                'employment_status': admin_list.employment_status,
                'admin_contact_details': admin_list.admin_contact_details,
                'admin_address': admin_list.admin_address,
                'admin_email_id': admin_list.admin_email_id,
                'lp1': admin_list.lp1,
                'lp2': admin_list.lp2,
                'lp3': admin_list.lp3,
                'ltb': admin_list.ltb,
                'ltf': admin_list.ltf,
                'user_id' : admin_list.user.id
                # 'account_status': admin_list.account_status,
            })
        # print(result_array)
        data = []
        
        return JsonResponse({"data" : result_array})

class ClientSubAdminListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user = self.request.user
        user_id = self.kwargs.get('id')
        
        if user_id:
            curr_clientadmin = User.objects.get(id=user_id)
            queryset = LimenealUser.objects.filter(
                user_type='operator',
                super_admin__isnull=False,
                admin__isnull=False,
                client_admin=curr_clientadmin,
                client_subadmin__isnull=True
            )
        else:
            queryset = LimenealUser.objects.filter(
            user_type='operator',
            super_admin__isnull=False,
            admin__isnull=False,
            client_subadmin__isnull=True
            )

            if user.role == 'superadmin':
                queryset = queryset.filter(client_admin__isnull=False)
            else:
                queryset = queryset.filter(client_admin=user)

        admin_lists = ClientSubAdminList.objects.filter(user__in=queryset.values_list('user', flat=True))
        result_array = []

        for admin_list in admin_lists:
            result_array.append({
                'user_email': admin_list.user.email,
                'user_username': admin_list.user.username,
                'org_client_name': admin_list.org_client_name,
                'address': admin_list.address,
                'type_of_business': admin_list.type_of_business,
                'pan_no': admin_list.pan_no,
                'gst_no': admin_list.gst_no,
                'uid': admin_list.uid,
                'admin_name': admin_list.admin_name,
                'admin_designation': admin_list.admin_designation,
                'employment_status': admin_list.employment_status,
                'admin_contact_details': admin_list.admin_contact_details,
                'admin_address': admin_list.admin_address,
                'admin_email_id': admin_list.admin_email_id,
                'lp1': admin_list.lp1,
                'lp2': admin_list.lp2,
                'lp3': admin_list.lp3,
                'ltb': admin_list.ltb,
                'ltf': admin_list.ltf,
                'user_id' : admin_list.user.id
                # 'account_status': admin_list.account_status,
            })
        # print(result_array)
        data = []
        
        return JsonResponse({"data" : result_array})


from ..tasks import generate_zip_file
class DownloadReportsView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        user_id = data.get('user_id', None)
        reports = data.get('data', [])
        report_ids = [i['id'] for i in reports]
        processed = data.get('processed',False)
        if not processed:
            task = generate_zip_file_async.delay(user_id, report_ids)
            return JsonResponse({"msg":f'Check Email for Requested {len(report_ids)} Reports of User-{user_id} '})

        zip_data, zip_file_name = generate_zip_file(user_id, report_ids)

        response = HttpResponse(zip_data, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{zip_file_name}"'
        return response



class DownloadLimenealScoresView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        user_id = data.get('user_id', None)

        
        file_path = generate_excel_report(user_id)
        print(file_path)
        if os.path.exists(file_path):
            # Read the file content
            with open(file_path, 'rb') as file:
                file_content = file.read()
            from io import BytesIO

            # Create a BytesIO object from the content
            file_stream = BytesIO(file_content)

            # Create a response with the file content
            response = FileResponse(file_stream)
            # Set the content type for the response
            response['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            # Set the content disposition to trigger a download box
            response['Content-Disposition'] = f'attachment; filename={os.path.basename(file_path)}'
            response['file-name'] = f'Anuj'

            # Delete the file after sending the response
            os.remove(file_path)

            return response
        else:
            # Handle the case where the file does not exist
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)