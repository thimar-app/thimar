from rest_framework import generics, permissions
from .models import Prayer
from .serializers import PrayerSerializer

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
