# Generated by Django 4.1.13 on 2025-04-13 02:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="clerk_id",
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
