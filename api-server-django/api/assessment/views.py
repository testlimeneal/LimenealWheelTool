from rest_framework import generics
from api.assessment.models import Quiz,  ReportType,Level3Response,Level2Response,UserResponse,Level3Question, UserProfile, Job
from api.assessment.serializers import QuizSerializer, Quiz2Serializer,Level3QuestionSerializer, Level2ResponseSerializer, UserResponseSerializer, UserProfileSerializer, GenderStatusSerializer, JobSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets

from api.assessment.helperfunctions.common import generate_report
from api.assessment.helperfunctions.level1 import process_level1_career_report
from api.assessment.helperfunctions.level2 import process_level2_career_report
from api.assessment.helperfunctions.level3 import process_level3_career_report



class Level3QuestionList(APIView):
    def get(self, request):
        keyword = self.request.query_params.get('keyword', '3')

        # Retrieve the Level3Question instances filtered by the quiz title
        questions = Level3Question.objects.filter(quiz__title__icontains=keyword)

        # Iterate through the questions and fetch the related Level3Bucket feature
    
                # Find the related Level3Bucket for this option (Trait)
                

        # Manipulate the data to add 'hello' field to associated_traits
        data = []
        for question in questions:
            serialized_question = Level3QuestionSerializer(question).data
            # LOGIC for adding colours to trait
            
            # for trait in serialized_question['associated_traits']:
            #     level3_bucket = Level3Bucket.objects.filter(
            #         Q(fixed_trait2=trait['id']) | Q(variable_trait1=trait['id']) | Q(variable_trait2=trait['id'])
            #     ).first()

            #     if level3_bucket:
            #          trait['colour'] = COLOR_MAPPING[level3_bucket.bucket.feature.lower()]
            #     trait['hello'] = "hello"
            data.append(serialized_question)

        return Response(data, status=status.HTTP_200_OK)
    


class Level2ResponseViewSet(viewsets.ModelViewSet):
    queryset = Level2Response.objects.all()
    serializer_class = Level2ResponseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter responses based on the current user's id
        return Level2Response.objects.filter(user_id=self.request.user.id)


class Quiz2List(generics.ListAPIView):
    queryset = Quiz.objects.filter(title__icontains='2')
    serializer_class = Quiz2Serializer


class QuizListAPIView(APIView):
    def get(self, request):
        quizzes = Quiz.objects.all()
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)


class QuizDetailAPIView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    lookup_field = 'id'  # Specify the lookup field for the quiz ID

    def get(self, request, *args, **kwargs):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return Response({"message": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if the user has a registered profile
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({"message": "User is not registered"}, status=status.HTTP_403_FORBIDDEN)


        level_reached = 0

        user_response = UserResponse.objects.filter(user=request.user)
        if user_response.exists():
            level_reached = 1

        level2_response = Level2Response.objects.filter(user=request.user)
        if level2_response.exists():
            level_reached = 2

        level3_response = Level3Response.objects.filter(user=request.user)
        if level3_response.exists():
            level_reached = 3

        if level_reached == 0:
            return super().get(request, *args, **kwargs)
        else:
            return Response({"level_reached":level_reached})


class UserResponseBulkCreateAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user  # Get the user from the JWT token
        responses = request.data  # JSON array of responses
        response_data = []
        for response in responses:
            response["user"] = user.id
            serializer = UserResponseSerializer(data=response)
            if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(response_data, status=status.HTTP_201_CREATED)


class Level2ResponseAPIView(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            responses = Level2Response.objects.filter(user=request.user)

            dimmensions = responses.filter(nlp__isnull=True)
            nlp = responses.filter(nlp__isnull=False)

            dimmensions_count = {}
            nlp_count = {}

            for response in dimmensions:
                # option_bucket = response.answer if response.answer else None
                option_bucket = response.answer.bucket if response.answer.bucket else None
                option_rank = response.rank if response.rank else None

                if response.question.negation:
                    dimmensions_count[option_bucket.feature] = dimmensions_count.get(
                        option_bucket.feature, 0) + 28 - option_rank
                else:
                    dimmensions_count[option_bucket.feature] = dimmensions_count.get(
                        option_bucket.feature, 0) + option_rank
           

            

            for i in nlp:
                nlp_count[i.nlp] = nlp_count.get(i.nlp, 0) + 1
            # print(nlp_count)
            print(dimmensions_count)

            serializer = Level2ResponseSerializer(responses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Level2Response.DoesNotExist:
            return Response("User responses not found", status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        data = request.data
        try:
            # Loop through the data and create Level2Response instances
            for response_data in data:
                Level2Response.objects.create(
                    user=request.user,  # Assuming you have user authentication
                    quiz_id=response_data['quiz'],
                    question_id=response_data['question'],
                    answer_id=response_data.get('answer', None),
                    rank=response_data.get('rank', 0),
                    nlp=response_data.get('nlp', None)
                )
            return Response("Responses successfully created", status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class UserQuizzesAPIView(APIView):
    # serializer_class = UserProfileSerializer

    def get_queryset(self):
        
        # print(self.request.user.id)
        return 

    def get(self, request, *args, **kwargs):
        user_id = self.request.user.id
        user_profile = UserProfile.objects.get(user=user_id)

        reports = []
        for report in user_profile.report_paid.all():
            reports.append({"id":report.id,"level":report.level,"type":report.level+" "+report.report_type})
        

        # print(reports)

        # print(user_profile.report_paid.all())
        # manipulated_data = []
        # count = []
        # for response in queryset:
        #     if response.quiz_id not in count:

        #         count.append(response.quiz_id)

        # data = []
        # for i in count:
        #     x = [[i.title, i.description] for i in Quiz.objects.filter(id=i)]

        #     data.append({"id": i, "title": x[0][0], "description": x[0][1]})
        return Response(reports)


class CombinedDataView(APIView):
    def get(self, request, format=None):
        jobs = Job.objects.all()
        gender_status = GenderStatusSerializer()

        data = {
            'jobs': JobSerializer(jobs, many=True).data,
            'gender_status': gender_status.data,
        }

        return Response(data)


class DownloadReportView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        user_id = request.user.id
        report_id = data['id']
        
        report = ReportType.objects.get(id=report_id)

        user_profile = UserProfile.objects.get(user=user_id)

        file_path = ''
        if "Level 1" in report.level and "Career" in report.report_type:
            if user_profile.level1:
                file_path = user_profile.level1['file_path']
                
            else:
                file_path = process_level1_career_report(user_id, 1)
            
        if "Level 2" in report.level and "Career" in report.report_type:
            file_path = process_level2_career_report(user_id)
        
        if "Level 3" in report.level and "Career" in report.report_type:
            file_path = process_level3_career_report(user_id,user_profile)

            return Response(0)
            
            
        return generate_report(file_path)
    
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def create(self, request, *args, **kwargs):
        # Take the user ID from the authenticated user
        user_id = request.user.id

        # Add the user ID to the request data
        request.data['user'] = user_id

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CheckUserRegistration(APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated:
            try:
                user_profile = UserProfile.objects.get(user=request.user)
                serializer = UserProfileSerializer(user_profile)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except UserProfile.DoesNotExist:
                return Response({"message": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)




class Level3ResponseAPIView(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            responses = Level3Response.objects.filter(user=request.user)
            
            dimensions = {}
            for response in responses:
                print(response.rank)
                dimensions[response.answer.dimension.id] = dimensions.get(response.answer.dimension.id, {})
                dimensions[response.answer.dimension.id][response.answer.name] = dimensions.get(response.answer.dimension.id, {}).get(response.answer.name, 0) + response.rank
            

            

            # print([i/234*100 for i in dict.values()])
            print(dimensions)
            print("HEllo")


            # print(list(responses)[0].answer.name)

            # dimmensions = responses.filter(nlp__isnull=True)
            # nlp = responses.filter(nlp__isnull=False)

            # dimmensions_count = {}
            # nlp_count = {}

            # for response in dimmensions:
            #     # option_bucket = response.answer if response.answer else None
            #     option_bucket = response.answer.bucket if response.answer.bucket else None
            #     option_rank = response.rank if response.rank else None

            #     if response.question.negation:
            #         dimmensions_count[option_bucket.feature] = dimmensions_count.get(
            #             option_bucket.feature, 0) + 28 - option_rank
            #     else:
            #         dimmensions_count[option_bucket.feature] = dimmensions_count.get(
            #             option_bucket.feature, 0) + option_rank
           

            

            # for i in nlp:
            #     nlp_count[i.nlp] = nlp_count.get(i.nlp, 0) + 1
            # # print(nlp_count)
            # print(dimmensions_count)

            serializer = Level2ResponseSerializer(responses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Level2Response.DoesNotExist:
            return Response("User responses not found", status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        data = request.data
        try:
            # Loop through the data and create Level2Response instances
            for response_data in data:
                Level3Response.objects.create(
                    user=request.user,  # Assuming you have user authentication
                    quiz_id=response_data['quiz'],
                    question_id=response_data['question'],
                    answer_id=response_data.get('answer', None),
                    rank=response_data.get('rank', 0)
                )
            return Response("Responses successfully created", status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

