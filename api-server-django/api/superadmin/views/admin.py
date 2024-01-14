from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from api.superadmin.serializers.users import UserSerializer
from api.user.models import User
from rest_framework.permissions import IsAuthenticated
from api.superadmin.tasks import generate_zip_file_async,add
from django.conf import settings
from api.superadmin.views.contants import get_html_path


from api.superadmin.models import LimenealUser,AdminList, ClientAdminList, ClientSubAdminList
from django.core.mail import send_mail
from django.core.mail import EmailMessage
import random
import string

from django.http import HttpResponse, JsonResponse

class CreateAdminView(generics.CreateAPIView):
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
        mutable_data['role'] = 'admin'

        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, random_password, request)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, password, request):
        user = serializer.save()
        email_subject = "Your Login Credentials"
        # email_body = f"Username: {user.username}\nPassword: {password}"
        # email_msg = EmailMessage(email_subject, email_body, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], reply_to=['panuj55@gmail.com'])
        # email_msg.send()

        with open(get_html_path('page.html'), 'r') as file:
            email_body = file.read()
            email_body = email_body.replace('{{username}}', user.email);
            email_body = email_body.replace('{{password}}', password);

            print(user.email,password)
            # send_mail(
            #     subject=email_subject,
            #     message='',  # Since you have HTML content, set message to an empty string
            #     from_email="no-reply@limenealwheel.com",
            #     recipient_list= ['panuj55@gmail.com'],
            #     html_message=email_body,  # Include your HTML content here
            # )

        # send_mail(email_subject, email_body, "no-reply@limenealwheel.com", ['panuj55@gmail.com'])
        # send_mail(email_subject, email_body, 'from@example.com', [user.email])
        LimenealUser.objects.create(user=user, super_admin=request.user, user_type='operator')
        mutable_data = request.data.copy()
        # print(mutable_data)
        admin_list_instance = AdminList.objects.create(
            user=user,
            created_by=request.user,  # Assuming you have access to the request object
            org_client_name=mutable_data['org_client_name'],
            address=mutable_data['address'],
            type_of_business=mutable_data['type_of_business'],
            pan_no=mutable_data['pan_no'],
            gst_no=mutable_data['gst_no'],
            uid=mutable_data['uid'],
            admin_name=mutable_data['admin_name'],
            admin_designation=mutable_data['admin_designation'],
            employment_status=mutable_data['employment_status'],
            admin_contact_details=mutable_data['admin_contact_details'],
            admin_address=mutable_data['admin_address'],
            admin_email_id=mutable_data['admin_email_id'],
            lp1=mutable_data['lp1'],
            lp2=mutable_data['lp2'],
            lp3=mutable_data['lp3'],
            ltb=mutable_data['ltb'],
            ltf=mutable_data['ltf'],
        )


class CreateClientAdminView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def generate_random_password(self):
        # Generate a random password with 8 characters
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for i in range(8))

    def create(self, request, *args, **kwargs):
        instance_admin = LimenealUser.objects.get(user=request.data['admin_id'])
        random_password = self.generate_random_password()
        mutable_data = request.data.copy()
        mutable_data['password'] = random_password
        mutable_data['role'] = 'clientadmin'
        mutable_data['superadmin_id'] = instance_admin.super_admin
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, random_password, request)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, password, request):
        user = serializer.save()
        email_subject = "Your Login Credentials"
        # email_body = f"Username: {user.username}\nPassword: {password}"
        # email_msg = EmailMessage(email_subject, email_body, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], reply_to=['panuj55@gmail.com'])
        # email_msg.send()

        mutable_data = request.data.copy()
        with open(get_html_path('page.html'), 'r') as file:
            email_body = file.read()
            email_body = email_body.replace('{{username}}', user.email);
            email_body = email_body.replace('{{password}}', password);

            print(user.email,password)
            # send_mail(
            #     subject=email_subject,
            #     message='',  # Since you have HTML content, set message to an empty string
            #     from_email="no-reply@limenealwheel.com",
            #     recipient_list= ['panuj55@gmail.com'],
            #     html_message=email_body,  # Include your HTML content here
            # )

                # send_mail(email_subject, email_body, "no-reply@limenealwheel.com", ['panuj55@gmail.com'])
        # send_mail(email_subject, email_body, 'from@example.com', [user.email])
        
        
        
       
        admin_user = User.objects.get(id=mutable_data['admin_id'])
        super_admin_user = LimenealUser.objects.get(user=admin_user)

        LimenealUser.objects.create(user=user,super_admin=super_admin_user.super_admin,admin=admin_user, user_type='operator')
        admin_list_instance = ClientAdminList.objects.create(
            user=user,
            created_by=request.user,  # Assuming you have access to the request object
            org_client_name=mutable_data['org_client_name'],
            address=mutable_data['address'],
            type_of_business=mutable_data['type_of_business'],
            pan_no=mutable_data['pan_no'],
            gst_no=mutable_data['gst_no'],
            uid=mutable_data['uid'],
            admin_name=mutable_data['admin_name'],
            admin_designation=mutable_data['admin_designation'],
            employment_status=mutable_data['employment_status'],
            admin_contact_details=mutable_data['admin_contact_details'],
            admin_address=mutable_data['admin_address'],
            admin_email_id=mutable_data['admin_email_id'],
            lp1=mutable_data['lp1'],
            lp2=mutable_data['lp2'],
            lp3=mutable_data['lp3'],
            ltb=mutable_data['ltb'],
            ltf=mutable_data['ltf'],
        )

class CreateClientSubAdminView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def generate_random_password(self):
        # Generate a random password with 8 characters
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for i in range(8))

    def create(self, request, *args, **kwargs):
        instance_admin = LimenealUser.objects.get(user=request.data['admin_id'])
        random_password = self.generate_random_password()
        mutable_data = request.data.copy()
        mutable_data['password'] = random_password
        mutable_data['role'] = 'clientsubadmin'
        mutable_data['superadmin_id'] = instance_admin.super_admin
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, random_password, request)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, password, request):
        user = serializer.save()
        email_subject = "Your Login Credentials"
        # email_body = f"Username: {user.username}\nPassword: {password}"
        # email_msg = EmailMessage(email_subject, email_body, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], reply_to=['panuj55@gmail.com'])
        # email_msg.send()

        mutable_data = request.data.copy()
        with open(get_html_path('page.html'), 'r') as file:
            email_body = file.read()
            email_body = email_body.replace('{{username}}', user.email);
            email_body = email_body.replace('{{password}}', password);

            print(user.email,password)
            # send_mail(
            #     subject=email_subject,
            #     message='',  # Since you have HTML content, set message to an empty string
            #     from_email="no-reply@limenealwheel.com",
            #     recipient_list= ['panuj55@gmail.com'],
            #     html_message=email_body,  # Include your HTML content here
            # )

                # send_mail(email_subject, email_body, "no-reply@limenealwheel.com", ['panuj55@gmail.com'])
        # send_mail(email_subject, email_body, 'from@example.com', [user.email])
        
        
        
       
        admin_user = User.objects.get(id=mutable_data['admin_id'])
        super_admin_user = LimenealUser.objects.get(user=admin_user)

        LimenealUser.objects.create(user=user,super_admin=super_admin_user.super_admin,admin=super_admin_user.admin,client_admin=admin_user, user_type='operator')
        admin_list_instance = ClientSubAdminList.objects.create(
            user=user,
            created_by=request.user,  # Assuming you have access to the request object
            org_client_name=mutable_data['org_client_name'],
            address=mutable_data['address'],
            type_of_business=mutable_data['type_of_business'],
            pan_no=mutable_data['pan_no'],
            gst_no=mutable_data['gst_no'],
            uid=mutable_data['uid'],
            admin_name=mutable_data['admin_name'],
            admin_designation=mutable_data['admin_designation'],
            employment_status=mutable_data['employment_status'],
            admin_contact_details=mutable_data['admin_contact_details'],
            admin_address=mutable_data['admin_address'],
            admin_email_id=mutable_data['admin_email_id'],
            lp1=mutable_data['lp1'],
            lp2=mutable_data['lp2'],
            lp3=mutable_data['lp3'],
            ltb=mutable_data['ltb'],
            ltf=mutable_data['ltf'],
        )


