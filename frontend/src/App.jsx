import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Buses from "./components/Buses";

const API_URL = "http://localhost:8000";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [bookings, setBookings] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  const refreshbookings = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${API_URL}/user/bookings/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("User bookings are", res.data);
        setBookings(res.data);
      })
      .catch((err) => console.error("Error fetching bookings", err));
  };

  return (
    <div className="container mx-auto p-4">
      {!isAuthenticated ? (
        <>
          <Register setIsAuthenticated={setIsAuthenticated} />
          <Login setIsAuthenticated={setIsAuthenticated} />
        </>
      ) : (
        <>
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded mb-4">
            Logout
          </button>
          <Buses onBookings={refreshbookings}/>
          <UserBookings onBookings={refreshbookings} bookings={bookings}/>
        </>
      )}
    </div>
  );
}

function UserBookings({onBookings, bookings}) {

  useEffect(() => {
    onBookings();
  }, []);

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded p-4 shadow-md">
              <h3 className="text-lg font-bold">Bus ID: {booking.bus.bus_no}</h3>
              {/* <p>Seat Numbers: {booking.selected_seats.seat_number.join(", ")}</p> */}
              <p>Seat Numbers: {booking.selected_seats.map(seat => seat.seat_number).join(", ")}</p>
              <p>Price: ₹{booking.total_price}</p>
              <p>Journey Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Register({ setIsAuthenticated }) {
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/user/register/`, form);
      alert("User registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input className="border p-2 w-full mb-2" name="username" placeholder="Username" onChange={handleChange} required />
      <input className="border p-2 w-full mb-2" name="email" placeholder="Email" onChange={handleChange} required />
      <input className="border p-2 w-full mb-2" name="phone" placeholder="Phone" onChange={handleChange} required />
      <input type="password" className="border p-2 w-full mb-2" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Register</button>
    </form>
  );
}

function Login({ setIsAuthenticated }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/user/login/`, form);
      localStorage.setItem("token", res.data.access);
      setIsAuthenticated(true);
      alert("Login successful");
      navigate("/buses");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input className="border p-2 w-full mb-2" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="password" className="border p-2 w-full mb-2" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Login</button>
    </form>
  );
}

function BookSeat({ busId, price }) {
  const [seatNumber, setSeatNumber] = useState("");

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");
    if (!seatNumber) return alert("Please enter a seat number");

    try {
      await axios.post(
        `${API_URL}/journeys/`,
        { bus: busId, selected_seats: [seatNumber] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Journey booked successfully!");
    } catch (err) {
      alert("Error booking seat");
    }
  };

  return (
    <div className="mt-2">
      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Seat Number"
        onChange={(e) => setSeatNumber(e.target.value)}
      />
      <button onClick={handleBooking} className="bg-red-500 text-white p-2 rounded w-full mt-2">
        Book Seat - ₹{price}
      </button>
    </div>
  );
}
