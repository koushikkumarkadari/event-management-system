// import React from "react";
// import "./Bookevent.css";

// function book() {
//     return(
//     <h1>Event page</h1>
// )
// }
// export default book;

import React, { useState } from 'react';
import "./Bookevent.css";
// import axios from 'axios';

const events = [
  { id: 'e1', name: 'Tech Conference 2025' },
  { id: 'e2', name: 'Music Festival' },
  { id: 'e3', name: 'Startup Pitch Night' }
];

const UserDashboard = () => {
  const [message, setMessage] = useState('');
  const [bookedEvents, setBookedEvents] = useState([]);
  const userId = 'user123'; // Replace with actual logged-in user ID

  const bookEvent = async (eventId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/book-event', {
        userId,
        eventId
      });

      setBookedEvents([...bookedEvents, eventId]);
      setMessage(response.data.message || 'Event booked successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Booking failed.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>User Dashboard</h2>
      <h4>Available Events</h4>
      {events.map(event => (
        <div key={event.id} style={{ marginBottom: '10px' }}>
          <span>{event.name}</span>
          <button
            style={{ marginLeft: '10px' }}
            onClick={() => bookEvent(event.id)}
            disabled={bookedEvents.includes(event.id)}
          >
            {bookedEvents.includes(event.id) ? 'Booked' : 'Book'}
          </button>
        </div>
      ))}

      {message && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          <strong>{message}</strong>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
