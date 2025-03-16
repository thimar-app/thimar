from django.urls import path
from .views import PrayerListCreateView, PrayerDetailView
from .views import TaskListCreateView, TaskDetailView

urlpatterns = [
    path('', PrayerListCreateView.as_view(), name='prayer-list-create'),
    path('<uuid:pk>/', PrayerDetailView.as_view(), name='prayer-detail'),
]