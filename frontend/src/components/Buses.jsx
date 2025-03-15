import React, { useEffect, useState } from "react";
import axios from "axios";
import BookSeat from "./BookSeat";


const API_URL = "http://127.0.0.1:8000/";

function Buses() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log('Token is :', token);
    axios.get(`${API_URL}/buses/`)
      .then((res) => setBuses(res.data))
      .catch((err) => console.error("Error fetching buses:", err));
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center mb-6">Available Buses</h2>

      {buses.length === 0 ? (
        <p className="text-center text-gray-600">No buses available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <div key={bus.id} className="border rounded-lg p-4 shadow-md bg-white">
              <h3 className="text-xl font-semibold">{bus.name} ({bus.bus_no})</h3>
              <p className="text-gray-600">From: <strong>{bus.origin}</strong> → To: <strong>{bus.destination}</strong></p>
              <p className="text-gray-700 font-bold">Price: ₹{bus.price}</p>
              <p className="text-gray-700">Seats Available: {bus.seats}</p>
              <p className="text-gray-600">Start: {bus.start_time} | Reach: {bus.reach_time}</p>
              <p className="text-gray-700">Rating: ⭐ {bus.rating}</p>
              <p className="text-gray-600">
                Features: {Array.isArray(bus.features) ? bus.features.join(", ") : String(bus.features)}
              </p>
              {bus.image && (
                <img
                  src={bus.image}
                  alt={bus.name}
                  className="w-full h-40 object-cover rounded mt-2"
                />
              )}
              {/* ✅ Add BookSeat component */}
              <BookSeat busId={bus.id} price={bus.price} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Buses;
