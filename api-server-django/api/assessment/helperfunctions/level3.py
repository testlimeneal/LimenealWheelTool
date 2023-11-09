from api.assessment.models import  Level3Response,Level3Group
from api.assessment.utils.level1 import Generate_level1_Report
from api.assessment.utils.level2 import Generate_level2_Report
from api.assessment.helperfunctions.common import get_feature_name_by_id


def process_level3_career_report(user_id,user_profile):
    responses = Level3Response.objects.filter(user=user_id)
    groups = list(Level3Group.objects.all())
    dimensions = dict()

    for response in responses:
        dimension_id = response.answer.dimension.id
        dimension_dict = dimensions.setdefault(dimension_id, {})
        
        answer_id = response.answer.id
        if answer_id not in dimension_dict:
            dimension_dict[answer_id] = {
                'value': 0,
                'name': response.answer.name,
                'type': response.answer.type
            }
    
        dimension_dict[answer_id]['value'] += response.rank
    
    # print(dimensions)
    # print(dimensions)
    level1_scores = dict(user_profile.level1.items())
    chief_virtues_score = {
        key: level1_scores[key] - level1_scores['bucket'][key]
        for key in level1_scores
        if key not in ['bucket', 'virtue', 'file_path']
    }

    level2_scores = user_profile.level2['value']
    

    total_values = {}
    # print(dimensions)
    for outer_key, inner_dict in dimensions.items():
        total_value = 0
        for inner_key, inner_data in inner_dict.items():
            if 'value' in inner_data:
                total_value += inner_data['value']
        total_values[outer_key] = total_value
    print(total_values)
    for dimension,score in chief_virtues_score.items():
        total_values[int(dimension)] += score
    

    result_dict = {item["id"]: item["value"] for sublist in level2_scores for item in sublist}
    percentage_dict = {key: (value / 94 * 100) for key, value in total_values.items()}

    print(sorted([(get_feature_name_by_id(i),j) for i,j in percentage_dict.items()]))
    # print(result_dict,0000000000000)


    
    print(sorted([(get_feature_name_by_id(i),(result_dict[i]+percentage_dict[i])/2) for i in result_dict.keys()]))
    # print(sorted([f"{j/283*100}-{i}" for i,j in total_values.items()]))
    # print(chief_virtues_score)
    # print(total_values)

    # print(dimensions)   
    # print(level2_scores) 
    # for j in level2_scores[0]:
    #     print(j['id'],j['name'],j['value'])
    #     print(dimensions[j['id']])



    for i,group in enumerate(groups):
        buckets = group.level3_buckets.all()
        temp = set()
        for bucket in buckets:
            temp.add(bucket.id)

        groups[i] = temp

    # print
    # print(dimensions)
    # print(groups)
            # break
    # print(list(groups))
    # print(dimensions,virtues)



    # file_path = Generate_level2_Report(dimmensions_data,nlp_data,bucket_instances)
    
    # level2_data = {"value":dimmensions_data,"file_path" : file_path}
    # user_profile.level2 = level2_data
    # user_profile.save()
    # return file_path