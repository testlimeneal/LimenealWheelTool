# Generated by Django 3.2.13 on 2024-01-26 18:49

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('superadmin', '0013_auto_20240122_1330'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adminlist',
            name='date_of_creation',
            field=models.DateField(default=datetime.date(2024, 1, 26)),
        ),
        migrations.AlterField(
            model_name='clientadminlist',
            name='date_of_creation',
            field=models.DateField(default=datetime.date(2024, 1, 26)),
        ),
        migrations.AlterField(
            model_name='clientsubadminlist',
            name='date_of_creation',
            field=models.DateField(default=datetime.date(2024, 1, 26)),
        ),
    ]
