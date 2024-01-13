# Generated by Django 3.2.13 on 2023-12-24 04:20

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('superadmin', '0008_auto_20231216_0038'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='adminlist',
            name='creating_assessee',
        ),
        migrations.RemoveField(
            model_name='adminlist',
            name='rights_given',
        ),
        migrations.RemoveField(
            model_name='adminlist',
            name='total_tools_given',
        ),
        migrations.AddField(
            model_name='adminlist',
            name='created_by',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='adminlist',
            name='date_of_creation',
            field=models.DateField(default=datetime.date(2023, 12, 24)),
        ),
    ]