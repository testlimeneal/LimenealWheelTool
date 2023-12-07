from django.contrib import admin,messages
from api.assessment.models import Question, Bucket,DecisionMaking, Answer,Trait,Level3Group, Level3Bucket,Level3Question,UserResponse,LearningStyle,Virtue,Job,UserProfile,ReportType, CareerCluster,Level2Bucket,Level2Option,Level2Question
from django.shortcuts import render
from django.urls import path
from api.assessment.helperfunctions.common import generate_report_zip
from django.shortcuts import redirect


# admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(DecisionMaking)
admin.site.register(Bucket)
# admin.site.register(UserResponse)
admin.site.register(Virtue)
admin.site.register(Level3Group)
admin.site.register(Job)


class UserProfileReportAdmin(admin.ModelAdmin):

    fields = ['user', 'name', 'dob', 'gender', 'marital_status', 'primary_mobile_no', 'secondary_mobile_no',
              'residential_address', 'current_address', 'professional_status', 'school_name', 'school_grade',
              'school_division', 'school_board', 'college_name', 'university_name', 'specialization', 'qualification',
              'hobbies', 'interested_sports', 'job_aspirations', 'report_paid', 'goals']
    readonly_fields = ['user']

    change_form_template = 'admin/change_forms.html'
    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        if "_download_report" in request.POST:
           try:
              return generate_report_zip(object_id)

           except:
              messages.error(request, 'Failed to generate the report. User has not completed Tests')
              return redirect('admin:assessment_userprofile_change', object_id)

              
        return super().change_view(request, object_id, form_url, extra_context)

admin.site.register(UserProfile, UserProfileReportAdmin)

admin.site.register(CareerCluster)
admin.site.register(Level2Question)
admin.site.register(Level2Option)
admin.site.register(Level2Bucket)
admin.site.register(ReportType)
admin.site.register(LearningStyle)
admin.site.register(Trait)
admin.site.register(Level3Bucket)
admin.site.register(Level3Question)


class AnswerAdmin(admin.ModelAdmin):

    list_display = ('bucket', 'text','question')
    list_filter=("question",)

    search_fields=('bucket__feature','text')


admin.site.register(Answer, AnswerAdmin)
