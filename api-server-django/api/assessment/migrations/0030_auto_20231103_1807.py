# Generated by Django 3.2.13 on 2023-11-03 12:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0029_auto_20231103_1739'),
    ]

    operations = [
        migrations.AddField(
            model_name='level2bucket',
            name='colour',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='level2bucket',
            name='emotion',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
