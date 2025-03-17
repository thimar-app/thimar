from rest_framework import serializers
from .models import Goal
from .models import SubGoal
import cloudinary

class GoalSerializer(serializers.ModelSerializer):
    progress = serializers.ReadOnlyField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ('id','user','progress', 'created_at', 'updated_at')

    def get_image(self, obj):
        if obj.image:
            return obj.image.url  # CloudinaryField provides full URL automatically
        return None  # Return None if no image



#sub-goals/serializers.py

class SubGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubGoal
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
