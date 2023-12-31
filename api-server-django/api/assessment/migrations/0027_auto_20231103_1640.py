# Generated by Django 3.2.13 on 2023-11-03 11:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0026_learningstyles'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='level2bucket',
            name='candidate_motivation',
        ),
        migrations.RemoveField(
            model_name='level2bucket',
            name='candidate_passions',
        ),
        migrations.RemoveField(
            model_name='level2bucket',
            name='tips_to_strengthen',
        ),
        migrations.AddField(
            model_name='bucket',
            name='bucket',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='feature_virtue', to='assessment.virtue'),
        ),
        migrations.AddField(
            model_name='level2bucket',
            name='motivation',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='level2bucket',
            name='pain_motivation',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='level2bucket',
            name='passion_statements',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='level2bucket',
            name='power_motivation',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='level2bucket',
            name='purpose_statements',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='level2bucket',
            name='push_motivation',
            field=models.TextField(blank=True, null=True),
        ),
    ]
