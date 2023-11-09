import os
from django.http import HttpResponse
from api.assessment.models import Bucket

def get_feature_name_by_id(feature_id):
    try:
        bucket = Bucket.objects.get(id=feature_id)
        return bucket.feature
    except Bucket.DoesNotExist:
        return None

def generate_report(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'rb') as file:
            response = HttpResponse(
                file.read(), content_type='application/pdf')
            response["Access-Control-Expose-Headers"] = "Content-Disposition"
            response[
                'Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}'
            return response
    else:
        return HttpResponse("File not found", status=404)