import os
from django.http import HttpResponse
from api.assessment.models import Bucket, Job

def get_feature_name_by_id(feature_id):
    try:
        bucket = Bucket.objects.get(id=feature_id)
        return bucket.feature
    except Bucket.DoesNotExist:
        return None


def get_careers_from_dimmensions(dimmensions,count = 5):
    top_jobs = Job.objects.filter(
        lwdimension_field1__feature=dimmensions[0],
        lwdimension_field2__feature=dimmensions[1],
        lwdimension_field3__feature=dimmensions[2]
    )[0:count]

    return top_jobs
        



def get_virtue_object_by_dimmension_id(dimmension_id):
    try:
        bucket = Bucket.objects.get(id=dimmension_id)
        return bucket.virtue
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