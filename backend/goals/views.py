from rest_framework import generics, permissions
from .models import Goal
from .serializers import GoalSerializer
from .models import SubGoal
from .serializers import SubGoalSerializer

class GoalListCreateView(generics.ListCreateAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)




# sub-goals/views.py

class SubGoalListCreateView(generics.ListCreateAPIView):
    serializer_class = SubGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SubGoal.objects.filter(goal__user=self.request.user)  # Filtre par l'utilisateur du goal

class SubGoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SubGoal.objects.filter(goal__user=self.request.user)  