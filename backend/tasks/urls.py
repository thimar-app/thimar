from django.urls import path
from .views import TaskListCreateView, TaskDetailView


urlpatterns = [
    path('', TaskListCreateView.as_view(), name='task-list-create'),
    path('<uuid:pk>/', TaskDetailView.as_view(), name='task-detail'),
]