from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Bus, Seat, Journey

User = get_user_model()  # If using a custom user model

# Register models in Django Admin
admin.site.register(User)
admin.site.register(Bus)
admin.site.register(Seat)
admin.site.register(Journey)
