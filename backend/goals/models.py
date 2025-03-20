import uuid
from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField

class Goal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="goals"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    # image = models.ImageField(upload_to="goals/images/", blank=True, null=True)
    image = CloudinaryField('image', blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    @property
    def progress(self):
        total_tasks = sum(subgoal.tasks.count() for subgoal in self.sub_goals.all())
        if total_tasks == 0:
            return 0
        finished_tasks = sum(subgoal.tasks.filter(status=True).count() for subgoal in self.sub_goals.all())
        return (finished_tasks / total_tasks) * 100


# moels.py/ SubGoal

class SubGoal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name="sub_goals")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
