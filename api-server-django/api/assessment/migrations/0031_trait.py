# Generated by Django 3.2.13 on 2023-11-04 05:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0030_auto_20231103_1807'),
    ]

    operations = [
        migrations.CreateModel(
            name='Trait',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
    ]
