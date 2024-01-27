from core.celery import app
# from api.superadmin.views.users import generate_zip_file
# import
import zipfile
import tempfile
import os
from api.assessment.helperfunctions.common import generate_report_file_path
from celery import shared_task
import logging
from django.core.mail import send_mail
from django.conf import settings


def generate_zip_file(user_id, report_ids):
    with tempfile.TemporaryDirectory() as temp_dir:
        zip_file_path = os.path.join(temp_dir, 'reports.zip')
        
        with zipfile.ZipFile(zip_file_path, 'w') as zip_file:
            for report_id in report_ids:
                # logging.info(f'Task for user {user_id} started with report_ids: {report_id}')
                file_path = generate_report_file_path(user_id, report_id)
                
                if os.path.exists(file_path):
                    with open(file_path, 'rb') as file:
                        report_data = file.read()
                        file_name = os.path.basename(file_path)
                        zip_file.writestr(f'{report_id}-{file_name}', report_data)
                else:
                    raise FileNotFoundError(f"File not found: {file_path}")

        with open(zip_file_path, 'rb') as zip_file:
            zip_data = zip_file.read()

        return zip_data, 'reports.zip'

@shared_task
def generate_zip_file_async(user_id, report_ids):

    temp = generate_zip_file(user_id, report_ids)

    email_subject = "Checkout Limeneal Report!"
    email_body = f"Requested {len(report_ids)} Reports of User-{user_id} is ready to download"
    send_mail(email_subject, email_body, settings.EMAIL_HOST_USER, [settings.SYSTEM_EMAIL])

    return "Done"