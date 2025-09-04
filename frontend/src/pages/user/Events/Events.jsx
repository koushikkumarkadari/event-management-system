import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import UserSidebar from '../../../components/UserSidebar/UserSidebar';
import { getEvents, addBooking, getBookingsByUser } from '../../../services/dataService';
import { getCurrentUser } from '../../../services/authService';
import { formatDateTime } from '../../../utils/date';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => {
    const allEvents = getEvents();
    const today = new Date();
    // Filter only future events
    const futureEvents = allEvents.filter(e => new Date(e.date) >= today);
    setEvents(futureEvents);

    const me = getCurrentUser();
    if (me) setMyBookings(getBookingsByUser(me.id));
  };

  useEffect(() => {
    load();
  }, []);

  const registeredIds = new Set(myBookings.map(b => Number(b.eventId)));

  const handleRegister = (eventId) => {
    const me = getCurrentUser();
    if (!me) return;
    const res = addBooking({ userId: me.id, eventId: Number(eventId), status: 'CONFIRMED' });
    if (!res) {
      alert('Already registered for this event.');
    }
    load();
  };

  const filteredEvents = events.filter(e =>
    (e.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="layout">
      <div className="sidebar">
        {/* Sidebar only visible on desktop via CSS */}
        <UserSidebar />
      </div>
      <div className="content">
        <h2>Available Events</h2>
        <input
          type="text"
          placeholder="Search by event title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 16, width: '100%', padding: 8 }}
        />
        <div className="grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {filteredEvents.length === 0 && <div className="text-muted">No events available.</div>}
          {filteredEvents.map(e => (
            <Link key={e.id} to={`/user/events/${e.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>{e.title}</h3>
              <p>{formatDateTime(e.date)} • {e.venue?.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
