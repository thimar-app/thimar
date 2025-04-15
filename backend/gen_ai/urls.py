# gen_ai/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    # path('generate-task/', GenerateTaskView.as_view(), name='generate-task'),
    path('new-goal/', GenerateGoalView.as_view(), name='new-goal-mistral'),
    path('new-task/', GenerateTaskView.as_view(), name='new-goal-mistral'),
    path('generate-baraqah/', GenerateBaraqahView.as_view(), name='baraqah-mistral'),

]
