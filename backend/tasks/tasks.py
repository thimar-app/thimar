from celery import shared_task
from django.contrib.auth import get_user_model
from backend.tasks.utils import update_prayer_times_for_user


@shared_task
def update_prayers_daily():
    User = get_user_model()
    for user in User.objects.all():
        update_prayer_times_for_user(user)
