from rest_framework import serializers
from .models import Prayer

class PrayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prayer
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
