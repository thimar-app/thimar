import uuid
from django.db import models
from django.conf import settings

class Prayer(models.Model):
    """
    Stores a user's prayer configuration (one record for each prayer name).
    5 records per user: Fajr, Sunrise, Dhuhr, Asr, Sunset, Maghrib, Isha.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='prayers'
    )
    name = models.CharField(max_length=50)  # e.g., "Fajr", "Dhuhr", ...
    time = models.TimeField()               # Current time for this prayer
    calculation_method = models.CharField(max_length=100, blank=True, null=True)
    is_custom = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.time}) for {self.user}"
