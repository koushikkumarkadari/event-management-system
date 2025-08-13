import { useEffect, useState } from 'react';
import UserSidebar from '../UserSidebar/UserSidebar';
import { getCurrentUser } from '../../services/authService';
import { getBookingsByUser, getEvents } from '../../services/dataService';
import { formatDateTime } from '../../utils/date';
import './UserDashboard.css';

const UserDashboard = ({ onLogout }) => {
  const [registered, setRegistered] = useState([]);

  useEffect(() => {
    const me = getCurrentUser();
    if (!me) return;
    const bookings = getBookingsByUser(me.id);
    const events = getEvents();
    const joined = bookings.map(b => {
      const event = events.find(e => e.id === b.eventId);
      return event || null;
    }).filter(Boolean);
    setRegistered(joined);
  }, []);

  const upcoming = registered.filter(e => new Date(e.date) > new Date());

  return (
    <div className="layout">
      <UserSidebar />
      <div className="content">
        <div className="header">
          <h1>User Dashboard</h1>
          <button className="btn btn-danger" onClick={onLogout}>Logout</button>
        </div>
        <div className="event-list">
          <h3>My Registered Events</h3>
          <ul>
            {registered.length === 0 && <li>No registered events</li>}
            {registered.map(e => (
              <li key={e.id}>
                {e.title} — {formatDateTime(e.date)}
              </li>
            ))}
          </ul>
        </div>
        <div className="upcoming-list">
          <h3>Upcoming Events</h3>
          <ul>
            {upcoming.length === 0 && <li>No upcoming events</li>}
            {upcoming.map(e => (
              <li key={e.id}>
                {e.title} — {formatDateTime(e.date)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
