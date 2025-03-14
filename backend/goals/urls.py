
from django.urls import path
from .views import GoalListCreateView, GoalDetailView


urlpatterns = [
    path('', GoalListCreateView.as_view(), name='goal-list-create'),
    path('<uuid:pk>/', GoalDetailView.as_view(), name='goal-detail'),
]

