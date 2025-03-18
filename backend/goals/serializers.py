from rest_framework import serializers

from tasks.serializers import TaskSerializer
from .models import Goal
from .models import SubGoal
import cloudinary

#sub-goals/serializers.py

class SubGoalSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)  # Nest tasks here

    class Meta:
        model = SubGoal
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class GoalSerializer(serializers.ModelSerializer):
    progress = serializers.ReadOnlyField()
    # image = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False)  # Allow updates to the image
    # Include the nested sub-goals
    sub_goals = SubGoalSerializer(many=True, read_only=True)

    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ('id','user','progress', 'created_at', 'updated_at')

    def get_image(self, obj):
        if obj.image:
            return obj.image.url  # CloudinaryField provides full URL automatically
        return None  # Return None if no image

