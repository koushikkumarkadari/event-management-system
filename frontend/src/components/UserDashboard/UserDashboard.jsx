import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserSidebar from '../UserSidebar/UserSidebar';
import './UserDashboard.css';
import { getCurrentUser } from '../../services/authService';
import { getBookingsByUser, getEvents } from '../../services/dataService';
import { formatDateTime } from '../../utils/date';


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
      <div className="sidebar">
        {/* Sidebar only visible on desktop via CSS */}
        <UserSidebar />
      </div>
      <div className="content">
        <div className="header">
          <h1>User Dashboard</h1>
          <button className="btn btn-danger" onClick={onLogout}>Logout</button>
        </div>
        <div className="upcoming-list">
          <h3>Upcoming Events</h3>
          <ul>
            {upcoming.length === 0 && <li>No upcoming events</li>}
            {upcoming.map(e => (
              <li key={e.id}>
                <Link to={`/user/events/${e.id}`} className="event-link">
                  {e.title} — {formatDateTime(e.date)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
