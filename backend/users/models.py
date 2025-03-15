from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Your custom user fields here
    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='custom_user_set',  # Change this to a unique name
        blank=True
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  # Change this to a unique name
        blank=True
    )
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)