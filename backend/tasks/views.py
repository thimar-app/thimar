from rest_framework import generics, permissions
from .models import Prayer
from .serializers import PrayerSerializer
from .models import Task
from .serializers import TaskSerializer 

class PrayerListCreateView(generics.ListCreateAPIView):
    serializer_class = PrayerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Prayer.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Tie the created prayer to the logged-in user
        serializer.save(user=self.request.user)

class PrayerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PrayerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Prayer.objects.filter(user=self.request.user)

# Taks views

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(sub_goal__goal__user=user)

        sub_goal_id = self.request.query_params.get('sub_goal_id')
        if sub_goal_id:
            queryset = queryset.filter(sub_goal_id=sub_goal_id)

        prayer_id = self.request.query_params.get('prayer_id')
        if prayer_id:
            queryset = queryset.filter(prayer_id=prayer_id)

        return queryset

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(sub_goal__goal__user=self.request.user)