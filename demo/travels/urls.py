from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import register_user, BusViewSet, JourneyViewSet, user_bookings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'buses', BusViewSet)
router.register(r'journeys', JourneyViewSet)

urlpatterns = [
    path('user/register/', register_user, name='register'),
    path('user/login/', TokenObtainPairView.as_view(), name='login'),
    path('user/bookings/', user_bookings, name='user-bookings'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
