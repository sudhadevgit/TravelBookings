from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status, viewsets
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import Bus,Seat, Journey
from .serializers import UserSerializer, BusSerializer, JourneySerializer
from rest_framework.permissions import IsAuthenticated

from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, permission_classes

User = get_user_model()

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    phone = request.data.get('phone')
    password = request.data.get('password')

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, phone=phone, password=password)
    token = RefreshToken.for_user(user)

    return Response({
        'user': UserSerializer(user).data,
        'access': str(token.access_token),
        'refresh': str(token)
    }, status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_bookings(request):
    user = request.user
    bookings = Journey.objects.filter(user=user)
    serializer = JourneySerializer(bookings, many=True)
    return Response(serializer.data)

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    # search
    filter_backends= [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ["name", "bus_no", "origin", "destination"]
    ordering_fields = ["name", "bus_no", "price", "rating", "start_time"]
    ordering = ["price"] 
       # Filtering fields
    filterset_fields = ["origin", "destination", "price", "features"]


class JourneyViewSet(viewsets.ModelViewSet):
    queryset = Journey.objects.all()
    serializer_class = JourneySerializer
    
    def create(self, request, *args, **kwargs):
        user = request.user
        bus_id = request.data.get('bus')
        seat_ids = request.data.get('selected_seats')
        seat_ids = [int(seat_id) for seat_id in seat_ids]

        bus = Bus.objects.get(id=bus_id)
        seats = Seat.objects.filter(seat_number__in=seat_ids, bus=bus, is_booked=False)

        print('seats fetched are :', seats)

        if seats.count() != len(seat_ids):
            return Response({"error": "Some seats are already booked"}, status=status.HTTP_400_BAD_REQUEST)

        # Mark seats as booked
        # seats.update(is_booked=True)

        # Create journey record
        journey, created = Journey.objects.get_or_create(user=user, bus=bus)

        # Set selected seats and save
        journey.selected_seats.add(*seats)
        journey.total_price += seats.count() * bus.price
        journey.save()

        # Mark seats as booked
        seats.update(is_booked=True)

        return Response(JourneySerializer(journey).data, status=status.HTTP_201_CREATED)
