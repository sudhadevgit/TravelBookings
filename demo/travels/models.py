from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=15, unique=True, blank=True, null=True)

    def __str__(self):
        return self.username

class Bus(models.Model):
    name = models.CharField(max_length=100)
    bus_no = models.CharField(max_length=50, unique=True)
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    features = models.TextField()
    start_time = models.TimeField()
    reach_time = models.TimeField()
    seats = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.FloatField(default=0.0)
    image = models.ImageField(upload_to="bus_images/", blank=True, null=True)

    # Why explicit save method()? --Sudha
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Ensure the correct number of seats exist
        current_seat_count = self.seat_set.count()
        if current_seat_count < self.seats:
            for i in range(current_seat_count + 1, self.seats + 1):
                Seat.objects.create(bus=self, seat_number=i)
        elif current_seat_count > self.seats:
            self.seat_set.filter(seat_number__gt=self.seats).delete()

    def __str__(self):
        return self.name

class Seat(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name="seat_set")
    seat_number = models.PositiveIntegerField()
    is_booked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('bus', 'seat_number')

    def __str__(self):
        return f"Seat {self.seat_number} - {self.bus.name}"

class Journey(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="journeys")
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    selected_seats = models.ManyToManyField(Seat, blank=True)
    booking_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username} - {self.bus.name}"
