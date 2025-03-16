import React, { useState } from 'react'
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

const BookSeat = ({busId, onBookings}) => {
    const [seatNumber, setSeatNumber] = useState("");

    const handleBooking = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Please login first");
        if (!seatNumber) return alert("Please enter a seat number");
    
        try {
          await axios.post(
            `${API_URL}journeys/`,
            { bus: busId, selected_seats: [seatNumber] },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert("Journey booked successfully!");
        } catch (err) {
          alert("Error booking seat");
        }

        await onBookings();
      };

  return (
    <div>
         <div className="mt-2">
      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Seat Number"
        onChange={(e) => setSeatNumber(e.target.value)}
      />
      <button onClick={handleBooking} className="bg-red-500 text-white p-2 rounded w-full mt-2">
        Book Seat 
      </button>
    </div>
      
    </div>
  )
}

export default BookSeat
