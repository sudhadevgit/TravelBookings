from rest_framework import serializers
from .models import CustomUser, Bus, Seat, Journey
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone']

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'

class JourneySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    bus = BusSerializer(read_only=True)
    selected_seats = SeatSerializer(many=True)

    class Meta:
        model = Journey
        fields = '__all__'
