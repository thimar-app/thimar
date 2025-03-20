
from django.urls import path
from .views import (
    GoalListCreateView, GoalDetailView,GenerateGoalView,
    SubGoalListCreateView, SubGoalDetailView
)


urlpatterns = [
    # Routes pour Goals
    path('', GoalListCreateView.as_view(), name='goal-list-create'),
    path('<uuid:pk>/', GoalDetailView.as_view(), name='goal-detail'),
    path('generate-goal/', GenerateGoalView.as_view(), name='goal-generate'),

    # Routes pour SubGoals
    path('sub-goals/', SubGoalListCreateView.as_view(), name='subgoal-list-create'),
    path('sub-goals/<uuid:pk>/', SubGoalDetailView.as_view(), name='subgoal-detail'),
]

