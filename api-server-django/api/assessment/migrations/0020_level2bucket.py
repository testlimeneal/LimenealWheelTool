# Generated by Django 3.2.13 on 2023-10-29 19:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0019_auto_20231028_2011'),
    ]

    operations = [
        migrations.CreateModel(
            name='Level2Bucket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('candidate_passions', models.TextField(blank=True, null=True)),
                ('candidate_motivation', models.TextField(blank=True, null=True)),
                ('tips_to_strengthen', models.TextField(blank=True, null=True)),
                ('bucket', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='level2_bucket', to='assessment.bucket')),
            ],
        ),
    ]
