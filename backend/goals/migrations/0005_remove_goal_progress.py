# Generated by Django 4.1.13 on 2025-03-16 11:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("goals", "0004_subgoal"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="goal",
            name="progress",
        ),
    ]
