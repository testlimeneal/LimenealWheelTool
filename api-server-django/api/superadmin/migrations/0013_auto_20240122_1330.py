# Generated by Django 3.2.13 on 2024-01-22 08:00

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('superadmin', '0012_auto_20240107_0157'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adminlist',
            name='date_of_creation',
            field=models.DateField(default=datetime.date(2024, 1, 22)),
        ),
        migrations.AlterField(
            model_name='clientadminlist',
            name='date_of_creation',
            field=models.DateField(default=datetime.date(2024, 1, 22)),
        ),
        migrations.AlterField(
            model_name='clientsubadminlist',
            name='date_of_creation',
            field=models.DateField(default=datetime.date(2024, 1, 22)),
        ),
    ]
