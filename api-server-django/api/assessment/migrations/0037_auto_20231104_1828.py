# Generated by Django 3.2.13 on 2023-11-04 12:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0036_auto_20231104_1821'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trait',
            name='dimmension',
        ),
        migrations.AddField(
            model_name='trait',
            name='dimension',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='level3_trait_bucket', to='assessment.bucket'),
        ),
    ]
