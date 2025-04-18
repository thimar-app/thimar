# Generated by Django 4.1.13 on 2025-04-17 10:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("goals", "0011_remove_goal_image_goal_image_path_goal_image_url"),
    ]

    operations = [
        migrations.AlterField(
            model_name="goal",
            name="image_path",
            field=models.CharField(
                blank=True,
                default="https://fagzgyrlxrpvniypexil.supabase.co/storage/v1/object/public/goal-images//defualt_goal_image.png",
                max_length=255,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="goal",
            name="image_url",
            field=models.URLField(
                blank=True,
                default="https://fagzgyrlxrpvniypexil.supabase.co/storage/v1/object/public/goal-images//defualt_goal_image.png",
                null=True,
            ),
        ),
    ]
