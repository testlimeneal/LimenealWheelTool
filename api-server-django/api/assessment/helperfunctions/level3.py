from api.assessment.models import  Level3Response,Level3Group,UserProfile
from api.assessment.utils.level3 import Generate_level3_Report
from api.assessment.helperfunctions.common import get_feature_name_by_id,get_virtue_object_by_dimmension_id
from api.assessment.helperfunctions.level2 import process_level2_scores

def process_level3_scores(user_id):
    responses = Level3Response.objects.filter(user=user_id)
    user_profile = UserProfile.objects.get(user=user_id)
    if not user_profile.level2:
        user_profile = process_level2_scores(user_id)[-1]
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
    
    level1_scores = dict(user_profile.level1.items())
    chief_virtues_score = {
        key: level1_scores[key] - level1_scores['bucket'][key]
        for key in level1_scores
        if key not in ['bucket', 'virtue', 'file_path']
    }

    level2_scores = user_profile.level2['value']
    

    total_values = {}
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
        print(chief_virtues_score)
        virtue_info = (virtue.virtue, chief_virtues_score[key]*100/36,getattr(virtue, attribute_name))

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

    return user_profile,result_tuple

def process_level3_career_report(user_id,report_id):

    user_profile,result_tuple = process_level3_scores(user_id)
    
    file_path = Generate_level3_Report(user_profile,result_tuple)
    user_profile.file_paths[report_id] = file_path
    user_profile.save()

    return file_path