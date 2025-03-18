from rest_framework import serializers
from .models import Prayer
from .models import Task

class PrayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prayer
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'