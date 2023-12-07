from api.assessment.models import UserResponse, Bucket, Virtue, UserProfile, Answer, Question

from api.assessment.utils.level1 import Generate_level1_Report


def process_level1_scores(user_id,quiz_id=1):
    queryset = UserResponse.objects.filter(
        user=user_id).filter(quiz=quiz_id)
    temp = list(Bucket.objects.all().values())
    temp2 = list(Virtue.objects.all().values())

    user_profile = UserProfile.objects.get(user_id=user_id)
    # print(user_profile)
    # return
    job_aspirations = user_profile.job_aspirations.all()

    job_info = []

    for job in job_aspirations:
        job_info.append({
            'job_name': job.title,
            'career_cluster': job.career_cluster.name if job.career_cluster else None,
            'lwdimension_field1': job.lwdimension_field1.feature if job.lwdimension_field1 else None,
            'lwdimension_field2': job.lwdimension_field2.feature if job.lwdimension_field2 else None,
            'lwdimension_field3': job.lwdimension_field3.feature if job.lwdimension_field3 else None
        })

    Bucket_dict = {}
    Virtue_dict = {}
    for i in temp:
        Bucket_dict[i['id']] = i['feature']

    for i in temp2:
        Virtue_dict[i['id']] = i

    inclinations = {}
    for i in temp:
        inclinations[i["id"]] = i

    temp1 = list(queryset.values())

    ans_ids = []
    for i in temp1:
        if i['answer_id'] not in ans_ids:
            ans_ids.append(i['answer_id'])

    answer_bucket_id = {i['id']: i["bucket_id"] for i in list(
        Answer.objects.filter(id__in=ans_ids).exclude(virtue_id__isnull=False).values())}
    answer_virtue_id = {i['id']: i["virtue_id"] for i in list(
        Answer.objects.filter(id__in=ans_ids).exclude(virtue_id__isnull=True).values())}

    virtue_bucket = {i['virtue_id']: i["bucket_id"] for i in list(
        Answer.objects.filter(id__in=ans_ids).exclude(virtue_id__isnull=True).values())}

    count = {"bucket": {}, "virtue": {}}

    addition = {}
    for j in list(queryset.values()):
        answer_id = j["answer_id"]
        question_id = j["question_id"]
        answer_bucket = answer_bucket_id.get(answer_id)
        answer_virtue = answer_virtue_id.get(answer_id)
        if answer_virtue is None:
            if answer_bucket is not None:
                count["bucket"][answer_bucket] = count["bucket"].get(
                    answer_bucket, 0) + j["rank"]

        else:
            if answer_virtue is not None:
                count["virtue"][answer_virtue] = count["virtue"].get(
                    answer_virtue, 0) + j["rank"]

    for i in count['bucket'].keys():
        addition[i] = count['bucket'][i]
        count[i] = addition[i]
    for i in count['virtue'].keys():
        addition[virtue_bucket[i]] = count['virtue'][virtue_bucket[i]
                                                     ] + addition[virtue_bucket[i]]
        count[virtue_bucket[i]] = addition[virtue_bucket[i]]
    top_three = sorted(addition.items(),
                       key=lambda x: x[1], reverse=True)[:3]
    f = []
    v = []
    res = []
    for key, value in top_three:
        f.append(Bucket_dict[key])
        v.append(value)
        res.append(inclinations[key])

    res_v = {}
    for i in count['virtue'].keys():
        res_v[i] = Virtue_dict[i]
        res_v[i]['rank'] = count['virtue'][i]

    sorted_virtues = sorted(list(res_v.values()),
                            key=lambda x: x['rank'], reverse=True)
    
    user_profile.level1 = count
    user_profile.save()
    return f, v, res, sorted_virtues, job_info,user_profile

def process_level1_career_report(user_id, report_id,quiz_id=1):


    f, v, res, sorted_virtues, job_info,user_profile = process_level1_scores(user_id)
    
    file_path = Generate_level1_Report(
        f, v, res, sorted_virtues, job_info,user_profile, 'Career')

    user_profile.file_paths[report_id] = file_path
    user_profile.save()

    return file_path
