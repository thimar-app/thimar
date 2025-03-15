# tasks/utils.py
from django.utils import timezone
from praytimes import PrayTimes
from .models import Prayer

def update_prayer_times_for_user(user):
    if user.latitude is None or user.longitude is None:
        return  # no location => no calculation
    
    pt = PrayTimes()
    pt.setMethod('MWL')

    now = timezone.now()
    y, m, d = now.year, now.month, now.day

    # e.g. no offset or use user.timezone_offset
    result = pt.getTimes((y, m, d), (user.latitude, user.longitude), 0)

    # Make sure your Prayer model has records for these 7 events
    prayer_map = {
        'Fajr': 'fajr',
        'Sunrise': 'sunrise',
        'Dhuhr': 'dhuhr',
        'Asr': 'asr',
        'Sunset': 'sunset',
        'Maghrib': 'maghrib',
        'Isha': 'isha'
    }

    for display_name, library_key in prayer_map.items():
        time_str = result.get(library_key)
        if not time_str:
            continue

        hour_str, min_str = time_str.split(':')
        hour, minute = int(hour_str), int(min_str)

        prayer_obj, _ = Prayer.objects.get_or_create(
            user=user,
            name=display_name
        )
        prayer_obj.time = f"{hour:02d}:{minute:02d}:00"
        prayer_obj.calculation_method = 'MWL'
        prayer_obj.is_custom = False
        prayer_obj.save()
