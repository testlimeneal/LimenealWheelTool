# Generated by Django 3.2.13 on 2023-10-27 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0013_level2response'),
    ]

    operations = [
        migrations.AddField(
            model_name='level2question',
            name='auditory_option',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='level2question',
            name='kinesthetic_option',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='level2question',
            name='visual_option',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
