
from django.db import models
from api.user.models import User
from django.conf import settings
from django.core.exceptions import ValidationError

class Quiz(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return f"ID:{str(self.id)} | {self.title}  "

class Virtue(models.Model):
    virtue = models.CharField(max_length=100)
    text = models.CharField(max_length=200,null=True,blank=True)

    level3_power = models.CharField(max_length=300,null=True,blank=True,default='meaning_power')
    level3_push = models.CharField(max_length=300,null=True,blank=True,default='meaning_push')
    level3_pain = models.CharField(max_length=300,null=True,blank=True,default='meaning_pain')

    def __str__(self):
        return f"Virtue for {self.virtue} | {self.id}"


    
class Bucket(models.Model):
    feature = models.CharField(max_length=100)
    virtue = models.OneToOneField(Virtue, on_delete=models.CASCADE, related_name='feature_virtue',null=True,blank=True)
    inclinations = models.TextField(null=True, blank=True)
    purpose_statement = models.TextField(null=True, blank=True)
    thrive_environment = models.TextField(null=True, blank=True)
    career_inclination_statement = models.TextField(null=True, blank=True)
    careers = models.CharField(max_length=200, null=True, blank=True)
    quote = models.CharField(null=True,blank=True,max_length=400)

    def __str__(self):
        return f"Bucket for {self.feature} | {self.id}"

    def clean(self):
        super().clean()
        if self.careers:
            careers_list = [career.strip() for career in self.careers.split(',')]
            self.careers = ', '.join(careers_list)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)



class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    negation = models.BooleanField(default=False)
    text = models.CharField(max_length=200)

    def __str__(self):
        return self.text



class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    bucket = models.ForeignKey(Bucket, on_delete=models.CASCADE)
    virtue = models.ForeignKey(Virtue, on_delete=models.CASCADE,null=True, blank=True)
    text = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.text} | {self.question}" 

class UserResponse(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    rank = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Response for {self.quiz.title}"

    class Meta:
        unique_together = ['user', 'quiz', 'question','answer']  # Ensures a user can't submit multiple responses to the same question in a quiz.

class CareerCluster(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Job(models.Model):
    title = models.CharField(max_length=255)
    career_cluster = models.ForeignKey(CareerCluster, on_delete=models.CASCADE,null=True,blank=True)
    lwdimension_field1 = models.ForeignKey(Bucket, on_delete=models.SET_NULL, null=True, blank=True,related_name='lwdimension_field1_jobs')
    lwdimension_field2 = models.ForeignKey(Bucket, on_delete=models.SET_NULL, null=True, blank=True,related_name='lwdimension_field2_jobs')
    lwdimension_field3 = models.ForeignKey(Bucket, on_delete=models.SET_NULL, null=True, blank=True,related_name='lwdimension_field3_jobs')


    # company = models.CharField(max_length=255)

    def __str__(self):
        return self.title





class ReportType(models.Model):
    LEVEL_CHOICES = (
        ('Level 1', 'Report Level 1'),
        ('Level 2', 'Report Level 2'),
        ('Level 3', 'Report Level 3'),
        ('Level 4', 'Report Level 4'),
    )

    TYPE_CHOICES = (
        ('Career', 'Career'),
        ('Leadership', 'Leadership'),
        ('Career + Leadership', 'Career + Leadership'),
        ('Talent', 'Talent'),
        ('Full',"Full")

    )

    level = models.CharField(max_length=8, choices=LEVEL_CHOICES)
    report_type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    def combined_field(self):
        # Combine level and report_type into a single string
        return f"{self.level} - {self.report_type}"

    def __str__(self):
        return self.combined_field()


class LearningStyle(models.Model):
    name = models.CharField(max_length=200)
    statement = models.TextField(null=True, blank=True)
    learnings = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name}"


class Level2Option(models.Model):
    text = models.CharField(max_length=200)
    bucket = models.ForeignKey(Bucket, on_delete=models.CASCADE)

    def __str__(self):
        return f"Option: {self.text} | Feature: {self.bucket.feature}"


class Level2Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='level2questions')
    negation = models.BooleanField(default=False)
    text = models.CharField(max_length=200)
    options = models.ManyToManyField(Level2Option,null=True,blank=True)
    visual_option = models.CharField(max_length=200,null=True,blank=True)
    auditory_option = models.CharField(max_length=200,null=True,blank=True)
    kinesthetic_option = models.CharField(max_length=200,null=True,blank=True)

    def __str__(self):
        return self.text
    
    
class Level2Response(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(Level2Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Level2Option, on_delete=models.CASCADE,null=True,blank=True)
    rank = models.IntegerField(null=True,blank=True)
    nlp = models.CharField(null=True,blank=True,max_length=100)

    def __str__(self):
        return f"{self.user.username}'s Response for {self.quiz.title}"

    class Meta:
        unique_together = ['user', 'quiz', 'question','answer'] 


class Level2Bucket(models.Model):
    bucket = models.OneToOneField(Bucket, on_delete=models.CASCADE, related_name='level2_bucket')
    purpose_statements = models.TextField(null=True, blank=True)
    passion_statements = models.TextField(null=True, blank=True)
    
    emotion = models.CharField(null=True,blank=True,max_length=100)
    colour = models.CharField(null=True,blank=True,max_length=100)


    motivation = models.CharField(null=True,blank=True,max_length=300)
    power_motivation = models.CharField(null=True,blank=True,max_length=500)
    push_motivation = models.CharField(null=True,blank=True,max_length=500)
    pain_motivation = models.CharField(null=True,blank=True,max_length=500)

    power_virtue = models.CharField(null=True,blank=True,max_length=500)
    push_virtue = models.CharField(null=True,blank=True,max_length=500)
    pain_virtue = models.CharField(null=True,blank=True,max_length=500)




    # candidate_passions = models.TextField(null=True, blank=True)
    # candidate_motivation = models.TextField(null=True, blank=True)
    # tips_to_strengthen = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Level2Bucket for {self.bucket.feature} | {self.id}"



class UserProfile(models.Model):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )

    STATUS_CHOICES = (
        ('Married', 'Married'),
        ('Single', 'Single'),
        ('Widow', 'Widow'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,  
        on_delete=models.CASCADE,
        related_name='profile',
    )
    name = models.CharField(max_length=255)
    dob = models.DateField()
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
    status = models.CharField(max_length=7, choices=STATUS_CHOICES)
    mobile_no = models.CharField(max_length=15)
    # email_id = models.EmailField()
    address = models.TextField()
    job_aspirations = models.ManyToManyField(Job, related_name='aspirants')
    report_paid = models.ManyToManyField(ReportType, related_name='report_paid',null=True,blank=True)
    goals = models.CharField(max_length=255)

    level1 = models.JSONField(null=True, blank=True)
    level2 = models.JSONField(null=True, blank=True)
    level3 = models.JSONField(null=True, blank=True)


    def __str__(self):
        return self.name







# class Trait(models.Model):
#     name = models.CharField(max_length=100)


#     def __str__(self):
#         return f"{self.name}"


class DecisionMaking(models.Model):
    name = models.CharField(max_length=100)
    

    def __str__(self):
        return f"{self.name}"


class Trait(models.Model):
    TYPE_CHOICES = [
        ('fixed', 'Fixed'),
        ('variable', 'Variable'),
    ]

    name = models.CharField(max_length=100)
    dimension = models.ForeignKey(Bucket, on_delete=models.CASCADE, related_name='level3_trait_bucket', null=True, blank=True)

    type = models.CharField(max_length=10, choices=TYPE_CHOICES,default='variable')    

    level3_power = models.CharField(max_length=300,null=True,blank=True,default='meaning_power')
    level3_push = models.CharField(max_length=300,null=True,blank=True,default='meaning_push')
    level3_pain = models.CharField(max_length=300,null=True,blank=True,default='meaning_pain')

    def __str__(self):
        return f"{self.name}"

# class Virtue(models.Model):
#     virtue = models.CharField(max_length=100)
#     text = models.CharField(max_length=200,null=True,blank=True)


#     def __str__(self):
#         return f"Virtue for {self.virtue} | {self.id}"


    # class Level3Group(models.Model):
        
class Level3Bucket(models.Model):
    bucket = models.OneToOneField(Bucket, on_delete=models.CASCADE, related_name='level3_bucket',null=True,blank=True)
    decision_making = models.ForeignKey(DecisionMaking, on_delete=models.CASCADE, related_name='level3decision_group',null=True,blank=True)

    def __str__(self):
        return f"Bucket {self.bucket.feature}"


# fixed_trait2 = models.OneToOneField(Trait, on_delete=models.CASCADE, related_name='level3_fixedtrait1',null=True,blank=True)
# variable_trait1 = models.OneToOneField(Trait, on_delete=models.CASCADE, related_name='level3_variabletrait1',null=True,blank=True)
# variable_trait2 = models.OneToOneField(Trait, on_delete=models.CASCADE, related_name='level3_variabletrait2',null=True,blank=True)


def __str__(self):
    return f"{self.bucket.feature}"



class Level3Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='level3questions')
    negation = models.BooleanField(default=False)
    text = models.CharField(max_length=200)
    options = models.ManyToManyField(Trait,null=True,blank=True)



class Level3Response(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(Level3Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Trait, on_delete=models.CASCADE,null=True,blank=True)
    rank = models.IntegerField(null=True,blank=True)
    # nlp = models.CharField(null=True,blank=True,max_length=100)

    def __str__(self):
        return f"{self.user.username}'s Response for {self.quiz.title}"

    class Meta:
        unique_together = ['user', 'quiz', 'question','answer'] 


class Level3Group(models.Model):
    name = models.CharField(max_length=255)  # Add a name field to Level3Group
    level3_buckets = models.ManyToManyField(Level3Bucket, related_name='level3_groups')
