from api.assessment.models import  UserProfile, Level2Response, Level2Bucket, LearningStyle
from api.assessment.utils.level1 import Generate_level1_Report
from api.assessment.utils.level2 import Generate_level2_Report


def process_level2_career_report(user_id):
    responses = Level2Response.objects.filter(user=user_id)
    user_profile = UserProfile.objects.get(user=user_id)

    dimmensions = [response for response in responses if response.nlp is None]
    nlp = [response for response in responses if response.nlp is not None]

    dimmensions_count = {}
    nlp_count = {}

    for i in nlp:
        nlp_count[i.nlp] = nlp_count.get(i.nlp, 0) + 1
    bucket_names = {}

    for response in dimmensions:
        option_bucket = response.answer.bucket if response.answer.bucket else None
        option_rank = response.rank if response.rank else None

        if response.question.negation:

            dimmensions_count[option_bucket.id] = dimmensions_count.get(
                option_bucket.id, 0) + 10  - option_rank
            bucket_names[option_bucket.id] = option_bucket.feature
        else:
           
            dimmensions_count[option_bucket.id] = dimmensions_count.get(
                option_bucket.id, 0) + option_rank
            bucket_names[option_bucket.feature] = dimmensions_count[option_bucket.id]

    sorted_level2 = sorted(dimmensions_count.items(),
                           key=lambda x: x[1], reverse=True)
    filtered_dict = {}

    for key, value in user_profile.level1.items():
        if key not in ['bucket','virtue','file_path']:
            filtered_dict[key] = value
    

    sorted_level1 = sorted(
        filtered_dict.items(), key=lambda x: x[1], reverse=True)

    bucket_details = Level2Bucket.objects.all()

    bucket_instances = {}
    
    for level2_bucket in bucket_details:
        bucket_id = level2_bucket.bucket_id
        feature = level2_bucket.bucket.feature
        virtue = level2_bucket.bucket.virtue.virtue
        
        bucket_instance_data = {
        'feature': feature,
        'value': dimmensions_count[bucket_id],
        'virtue': virtue
        }

        for key, value in level2_bucket.__dict__.items():
            if key not in ('id', 'bucket_id', 'bucket', 'feature','_state'):
                bucket_instance_data[key] = value

        bucket_instances[bucket_id] = bucket_instance_data

    
    passion_ids = [{"id":i,"value":j*100/81,"name":bucket_names[i]} for i, j in sorted_level2]

    purpose_ids = [{"id":int(i),"value":j*100/72,"name":bucket_names[int(i)]} for i, j in sorted_level1]

    
    res = []
    for i in range(3):
        if purpose_ids[0]['id'] != passion_ids[0]['id']:
            if purpose_ids[0]['id'] == passion_ids[1]['id'] and purpose_ids[1]['id'] == passion_ids[0]['id']: #interchanges
                if (purpose_ids[2]['value'] >= passion_ids[2]['value']):
                    res.append([purpose_ids[0],passion_ids[0],purpose_ids[2]])
                else:
                    res.append([purpose_ids[0],passion_ids[0],passion_ids[2]])
            elif purpose_ids[1]['id'] in [purpose_ids[0]['id'],passion_ids[0]['id']] and passion_ids[1]['id'] not in [purpose_ids[0]['id'],passion_ids[0]['id']]:
                    res.append([purpose_ids[0],passion_ids[0],passion_ids[1]])
            elif purpose_ids[1]['id'] not in [purpose_ids[0]['id'],passion_ids[0]['id']] and passion_ids[1]['id'] in [purpose_ids[0]['id'],passion_ids[0]['id']]:
                    res.append([purpose_ids[0],passion_ids[0],purpose_ids[1]])
            else:
                if (purpose_ids[1]['value'] >= passion_ids[1]['value']):
                    res.append([purpose_ids[0],passion_ids[0],purpose_ids[1]])
                else:
                    res.append([purpose_ids[0],passion_ids[0],passion_ids[1]])
        
        elif purpose_ids[0]['id'] == passion_ids[0]['id']:
            if passion_ids[1]['id'] == purpose_ids[1]['id']:
                if (purpose_ids[2]['value'] >= passion_ids[2]['value']):
                    res.append([purpose_ids[0],passion_ids[1],purpose_ids[2]])
                else:
                    res.append([purpose_ids[0],passion_ids[1],passion_ids[2]])
            else:
                res.append([purpose_ids[0],passion_ids[1],purpose_ids[1]])
                

        res_ids = {item['id'] for item in res[i]}
        passion_ids = [item for item in passion_ids if item['id'] not in res_ids]
        purpose_ids = [item for item in purpose_ids if item['id'] not in res_ids]

    styles = LearningStyle.objects.all()
    result_dict = {item['name']: item for item in styles.values()}

    user_learning_styles = sorted(nlp_count.items(), key=lambda item: item[1], reverse=True)

    nlp_data = []
    first_element, second_element = user_learning_styles[0], user_learning_styles[1]
    if first_element[1] == second_element[1] and first_element[0] in ['visual','auditory'] and second_element[0] in ['visual','auditory']:
        nlp_data = [result_dict['visual/auditory'],result_dict['auditory']]
        nlp_data[0]['statement'] = result_dict['visual']['statement']
    else:
        nlp_data = [result_dict[first_element[0]],result_dict[second_element[0]]]
    
    # print(bucket_instances)

    job_info = []

    for job in user_profile.job_aspirations.all():
        job_info.append({
            'job_name': job.title,
            'career_cluster': job.career_cluster.name if job.career_cluster else None,
            'lwdimension_field1': job.lwdimension_field1.feature if job.lwdimension_field1 else None,
            'lwdimension_field2': job.lwdimension_field2.feature if job.lwdimension_field2 else None,
            'lwdimension_field3': job.lwdimension_field3.feature if job.lwdimension_field3 else None
        })

    dimmensions_data = [sorted(i, key=lambda x: x['value'],reverse=True) for i in res]
    file_path = Generate_level2_Report(dimmensions_data,nlp_data,bucket_instances,job_info)
    
    level2_data = {"value":dimmensions_data,"file_path" : file_path}
    user_profile.level2 = level2_data
    user_profile.save()
    return file_path