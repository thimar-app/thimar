from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.views import APIView
from django.conf import settings
from rest_framework import generics, permissions
from rest_framework.pagination import PageNumberPagination
from django.db.models import Prefetch
from .models import Goal
from .serializers import GoalSerializer
from .models import SubGoal
from .serializers import SubGoalSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class GoalPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 100

class GoalListCreateView(generics.ListCreateAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # To handle file uploads
    pagination_class = GoalPagination

    def get_queryset(self):
        # Optimize query with select_related and prefetch_related
        return Goal.objects.filter(user=self.request.user).select_related('user').prefetch_related(
            Prefetch('sub_goals', queryset=SubGoal.objects.prefetch_related('tasks'))
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # To handle file uploads
    
    def get_queryset(self):
        # Optimize query with select_related and prefetch_related
        return Goal.objects.filter(user=self.request.user).select_related('user').prefetch_related(
            Prefetch('sub_goals', queryset=SubGoal.objects.prefetch_related('tasks'))
        )

# sub-goals/views.py

class SubGoalPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class SubGoalListCreateView(generics.ListCreateAPIView):
    serializer_class = SubGoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = SubGoalPagination

    def get_queryset(self):
        # Optimize query with select_related and prefetch_related
        return SubGoal.objects.filter(goal__user=self.request.user).select_related('goal').prefetch_related('tasks').order_by('created_at')

class SubGoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Optimize query with select_related and prefetch_related
        return SubGoal.objects.filter(goal__user=self.request.user).select_related('goal').prefetch_related('tasks')  