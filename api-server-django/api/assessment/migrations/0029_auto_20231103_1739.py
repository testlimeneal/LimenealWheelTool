# Generated by Django 3.2.13 on 2023-11-03 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0028_auto_20231103_1641'),
    ]

    operations = [
        migrations.AddField(
            model_name='level2bucket',
            name='pain_virtue',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='level2bucket',
            name='power_virtue',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='level2bucket',
            name='push_virtue',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='level2bucket',
            name='pain_motivation',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='level2bucket',
            name='power_motivation',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='level2bucket',
            name='push_motivation',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
