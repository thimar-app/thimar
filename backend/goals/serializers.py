from rest_framework import serializers
from .models import Goal
from .models import SubGoal

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ('id','user', 'created_at', 'updated_at')



#sub-goals/serializers.py

class SubGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubGoal
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
