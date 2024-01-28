import os
from django.http import HttpResponse
from api.assessment.models import Bucket, Job, UserProfile, ReportType
import os
from django.core.files.temp import NamedTemporaryFile
from zipfile import ZipFile
from itertools import permutations



def get_feature_name_by_id(feature_id):
    try:
        bucket = Bucket.objects.get(id=feature_id)
        return bucket.feature
    except Bucket.DoesNotExist:
        return None


def get_careers_from_dimmensions(dimensions,count = 5):
    dimension_permutations = list(set(permutations(dimensions, len(dimensions))))

    all_top_jobs = []
    for perm in dimension_permutations:
        top_jobs = Job.objects.filter(
            lwdimension_field1__feature=perm[0],
            lwdimension_field2__feature=perm[1],
            lwdimension_field3__feature=perm[2]
        )[:count]

        # Add the top jobs to the list
        all_top_jobs.extend(top_jobs)

    return all_top_jobs[:count]


def get_careers_summary(user_profile,dimensions):
    def match_quality(attribute_array, attribute1, attribute2, attribute3):
        positions = [attribute_array.index(attribute1), attribute_array.index(attribute2), attribute_array.index(attribute3)]

        match_cases = [ 
            ([0, 1, 2], "Excellent Match"),
            ([0, 2, 1], "Excellent Match"),
            ([1, 0, 2], "Good Match"),
            ([1, 2, 0], "Good Match"),
            ([2, 0, 1], "Average Match"),
            ([2, 1, 0], "Average Match")
        ]

        for case_positions, result in match_cases:
            if positions == case_positions:
                return result

        temp = {'power': 0, 'push': 0, 'pain': 0}

        for i in positions:
            if i <= 2:
                temp['power'] += 1
            elif 3 <= i <= 5:
                temp['push'] += 1
            elif 6 <= i <= 8:
                temp['pain'] += 1

        push_count = temp.get('push', 0)
        power_count = temp.get('power', 0)
        pain_count = temp.get('pain', 0)

        if power_count == 2 and push_count == 1:
            return "Good Match"
        elif power_count == 1 and push_count == 2:
            return "Average Match"
        elif power_count == 2 and pain_count == 1:
            return "Average Match"
        elif power_count == 1 and pain_count == 2:
            return "Poor Match"
        elif push_count == 3:
            return "Poor Match"
        elif push_count == 1 and pain_count == 2:
            return "Poor Match"
        elif push_count == 2 and pain_count == 1:
            return "Poor Match"
        elif power_count == 3:
            return "Poor Match"
        elif pain_count == 3:
            return "Poor Match"
        
        elif 0 <= positions[0] <= 2 and 6 <= positions[1] <= 8 and 3 <= positions[2] <= 5:
            return "Average Match"
        elif 0 <= positions[0] <= 2 and 3 <= positions[1] <= 5 and 6 <= positions[2] <= 8:
            return "Good Match"
        elif 3 <= positions[0] <= 5 and 6 <= positions[1] <= 8 and 3 <= positions[2] <= 5:
            return "Average Match"
        elif 3 <= positions[0] <= 5 and 0 <= positions[1] <= 2 and 6 <= positions[2] <= 8:
            return "Good Match"
        elif 6 <= positions[0] <= 8 and 0 <= positions[1] <= 2 and 3 <= positions[2] <= 5:
            return "Average Match"
        elif 6 <= positions[0] <= 8 and 3 <= positions[1] <= 5 and 0 <= positions[2] <= 2:
            return "Average Match"        
        else:
            return "No match"
    
    res = []
    for i in user_profile.job_aspirations.all():
        temp = {}
        temp['career_dimension'] = ", ".join([i.lwdimension_field1.feature, i.lwdimension_field2.feature, i.lwdimension_field3.feature])
        temp['career_name'] = i.title
        temp['match'] = match_quality(dimensions, i.lwdimension_field1.feature, i.lwdimension_field2.feature, i.lwdimension_field3.feature)
        res.append(temp)
    
    return res




def get_virtue_object_by_dimmension_id(dimmension_id):
    try:
        bucket = Bucket.objects.get(id=dimmension_id)
        return bucket.virtue
    except Bucket.DoesNotExist:
        return None

def generate_report_file_path(user_id, report_id):
    from api.assessment.helperfunctions.level1 import process_level1_career_report
    from api.assessment.helperfunctions.level2 import process_level2_career_report
    from api.assessment.helperfunctions.level3 import process_level3_career_report

    user_profile = UserProfile.objects.get(user=user_id)
    report = ReportType.objects.get(id=report_id)
    file_path = ''

    if "Level 1" in report.level and "Career" in report.report_type:
        file_path = user_profile.file_paths.get(str(report_id), None) or process_level1_career_report(user_id, report_id)
        # file_path =  process_level1_career_report(user_id, report_id) ===== for testing locally =====
    elif "Level 2" in report.level and "Career" in report.report_type:
        file_path = user_profile.file_paths.get(str(report_id), None) or process_level2_career_report(user_id, report_id)
        # file_path = process_level2_career_report(user_id, report_id) ===== for testing locally =====
    elif "Level 3" in report.level and "Career" in report.report_type:
        file_path = user_profile.file_paths.get(str(report_id), None) or process_level3_career_report(user_id, report_id)
        # file_path =  process_level3_career_report(user_id, report_id)  ===== for testing locally =====

    return file_path

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
    


def generate_report_zip(user_profile_id):
        user_profile = UserProfile.objects.get(id=user_profile_id)
        file_paths = []
        for report in user_profile.report_paid.all():
            file_path = generate_report_file_path(user_profile.user.id,report.id)
            file_paths.append((file_path,report.combined_field()))

        with NamedTemporaryFile() as temp_file:
            with ZipFile(temp_file, 'w') as zip_file:
                for i,(file_path,file_name) in enumerate(file_paths):
                    file_namee = os.path.basename(file_path)
                    # print(file_namee)
                    zip_file.write(file_path, arcname=file_name+".pdf")
            temp_file.seek(0)

            # Create a response with the zip file
            response = HttpResponse(temp_file.read(), content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename={user_profile.name}.zip'

        os.remove(temp_file.name)

        return response