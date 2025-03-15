from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from tasks.models import Prayer

User = get_user_model()

@receiver(post_save, sender=User)
def create_default_prayers(sender, instance, created, **kwargs):
    if created:
        # Add sunrise and sunset to the default list
        default_prayers = [
            'Fajr', 
            'Sunrise', 
            'Dhuhr', 
            'Asr', 
            'Sunset', 
            'Maghrib', 
            'Isha'
        ]
        for prayer_name in default_prayers:
            Prayer.objects.create(
                user=instance,
                name=prayer_name,
                time="00:00:00",  # placeholder, updated later by praytimes or user
                calculation_method="auto",
                is_custom=False
            )
