# Generated by Django 5.0.1 on 2024-03-06 00:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0004_team_logo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='type',
            field=models.CharField(choices=[('groups', 'Groups'), ('quarters', 'Quarters'), ('semifinals', 'Semifinals'), ('final', 'Final')], max_length=16),
        ),
    ]
