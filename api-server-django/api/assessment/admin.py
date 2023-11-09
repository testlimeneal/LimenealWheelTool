from django.contrib import admin
from django.urls.resolvers import URLPattern
# from api.assessment.models import Quiz,Question,Option,UserResponse
from api.assessment.models import Quiz, Question, Bucket,DecisionMaking, Answer,Trait,Level3Group, Level3Bucket,Level3Response,Level3Question,UserResponse,LearningStyle,Virtue,Job,UserProfile,ReportType, CareerCluster,Level2Response,Level2Bucket,Level2Option,Level2Question
from django.shortcuts import render
from django.urls import path

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(DecisionMaking)
admin.site.register(Bucket)
admin.site.register(UserResponse)
admin.site.register(Virtue)
admin.site.register(Level3Group)
# admin.site.register(Job)
admin.site.register(UserProfile)
admin.site.register(CareerCluster)
admin.site.register(Level2Question)
admin.site.register(Level2Option)
admin.site.register(Level2Response)
admin.site.register(Level2Bucket)
admin.site.register(ReportType)
admin.site.register(LearningStyle)
admin.site.register(Trait)
admin.site.register(Level3Bucket)
admin.site.register(Level3Question)
admin.site.register(Level3Response)


class JobAdmin(admin.ModelAdmin):

    def get_urls(self):
        urls = super().get_urls()
        new_urls = [path('upload-jobs/',self.import_jobs)]
        return new_urls + urls

    def import_jobs(self, request):
        if request.method == "POST":
            print("yes")
        return render(request, 'admin/jobs_upload.html')


admin.site.register(Job, JobAdmin)

class AnswerAdmin(admin.ModelAdmin):

    list_display = ('bucket', 'text','question')
    list_filter=("question",)

    search_fields=('bucket__feature','text')


admin.site.register(Answer, AnswerAdmin)
