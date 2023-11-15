from api.assessment.models import  Level3Response,Level3Group
from api.assessment.utils.level1 import Generate_level1_Report
from api.assessment.utils.level2 import Generate_level2_Report
from api.assessment.utils.level3 import Generate_level3_Report
from api.assessment.helperfunctions.common import get_feature_name_by_id,get_virtue_object_by_dimmension_id


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
                'type': response.answer.type,
                'statements_dict' : {
                    'level3_power': response.answer.level3_power,
                    'level3_push': response.answer.level3_push,
                    'level3_pain': response.answer.level3_pain
                }
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
    for dimension,score in chief_virtues_score.items():
        total_values[int(dimension)] += score
    
    
    result_dict = {item["id"]: item["value"] for sublist in level2_scores for item in sublist}
    percentage_dict = {key: (value / 94 * 100) for key, value in total_values.items()}

    result_list = []

    sorted_keys = sorted(result_dict.keys(), key=lambda key: (result_dict[key] + percentage_dict[key]) / 2,reverse=True)


    for i,key in enumerate(sorted_keys):
        feature_name = get_feature_name_by_id(key)
        average_value = (result_dict[key] + percentage_dict[key]) / 2

        if 0 <= i <= 2:
            attribute_name = 'level3_power'
        elif 3 <= i <= 5:
            attribute_name = 'level3_push'
        elif 6 <= i <= 8:
            attribute_name = 'level3_pain' 

        
        virtue = get_virtue_object_by_dimmension_id(key)
        virtue_info = (virtue.virtue, chief_virtues_score[str(key)]*100/36,getattr(virtue, attribute_name))

        traits_info =  sorted(
                    [( v['name'],v['value']*100/26,v['statements_dict'][attribute_name]) for k, v in dimensions[key].items()],
                    key=lambda x: x[1], 
                    reverse=True  
                )
        result_list.append(
            (
              feature_name,average_value,virtue_info,traits_info
            )
        )

    result_tuple = sorted(result_list, key=lambda x: x[1], reverse=True)
    file_path = Generate_level3_Report(user_profile,result_tuple)

    return file_path

    print(result_tuple[0])
    # print(sorted([(get_feature_name_by_id(i),(result_dict[i]+percentage_dict[i])/2,dimensions[i]) for i in result_dict.keys()],key=lambda x: x[1],reverse=True)[0])  
    
    # print(result_dict)
    # print(sorted([f"{j/283*100}-{i}" for i,j in total_values.items()]))
    # print(chief_virtues_score)
    # print(total_values)

    # print(dimensions)   
    # print(level2_scores) 
    # for j in level2_scores[0]:
    #     print(j['id'],j['name'],j['value'])
    #     print(dimensions[j['id']])



    # for i,group in enumerate(groups):
    #     buckets = group.level3_buckets.all()
    #     temp = set()
    #     for bucket in buckets:
    #         temp.add(bucket.id)

    #     groups[i] = temp

    # print(groups)
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