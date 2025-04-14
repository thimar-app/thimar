from rest_framework import serializers

from tasks.serializers import TaskSerializer
from .models import Goal
from .models import SubGoal
import cloudinary
from .utils.supabase_storage import upload_image, delete_image

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
    image = serializers.ImageField(required=False, write_only=True)  # For handling file uploads
    image_url = serializers.URLField(read_only=True)  # For displaying the image
    sub_goals = SubGoalSerializer(many=True, read_only=True)

    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ('id','user','progress', 'created_at', 'updated_at','image_url', 'image_path')

    def create(self, validated_data):
        image_file = validated_data.pop('image', None)
        # Remove this line that's causing the error:
        # user = self.context['request'].user
        
        # Let the view handle adding the user via perform_create
        goal = Goal.objects.create(**validated_data)
        
        if image_file:
            image_url, image_path = upload_image(image_file, goal.user.id)
            if image_url:
                goal.image_url = image_url
                goal.image_path = image_path
                goal.save()
        
        return goal

    def update(self, instance, validated_data):
        image_file = validated_data.pop('image', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Handle image update
        if image_file:
            # Delete old image if exists
            if instance.image_path:
                delete_image(instance.image_path)
            
            # Upload new image
            image_url, image_path = upload_image(image_file, instance.user.id)
            if image_url:
                instance.image_url = image_url
                instance.image_path = image_path
        
        instance.save()
        return instance
