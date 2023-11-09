from rest_framework import serializers
from api.assessment.models import Quiz, Question, Answer,UserResponse, UserProfile, Job, Level2Option,Level3Question,Trait,Level2Question, Level2Response


class TraitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trait
        fields = '__all__'

class Level3QuestionSerializer(serializers.ModelSerializer):
    associated_traits = TraitSerializer(many=True, source='options')

    class Meta:
        model = Level3Question
        fields = '__all__'

class Level2ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level2Response
        fields = '__all__'


class Level2OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level2Option
        fields = '__all__'

class Level2QuestionSerializer(serializers.ModelSerializer):
    options = Level2OptionSerializer(many=True)

    class Meta:
        model = Level2Question
        fields = '__all__'

class Quiz2Serializer(serializers.ModelSerializer):
    level2questions = Level2QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = '__all__'


        ## # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'answers','negation']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions']

class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResponse
        fields = ['user','quiz', 'question', 'answer', 'rank']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'  # You can specify specific fields if needed




class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class GenderStatusSerializer(serializers.Serializer):
    GENDER_CHOICES = UserProfile.GENDER_CHOICES
    STATUS_CHOICES = UserProfile.STATUS_CHOICES

class CombinedDataSerializer(serializers.Serializer):
    jobs = JobSerializer(many=True)
    gender_status = GenderStatusSerializer()