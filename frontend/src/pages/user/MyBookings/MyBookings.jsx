import { useEffect, useState } from 'react';
import UserSidebar from '../../../components/UserSidebar/UserSidebar';
import { getCurrentUser } from '../../../services/authService';
import { getBookingsByUser, getEvents, deleteBooking } from '../../../services/dataService';
import { formatDateTime } from '../../../utils/date';
import './MyBookings.css';

const MyBookings = () => {
  const [upcomingRows, setUpcomingRows] = useState([]);
  const [pastRows, setPastRows] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => {
    const me = getCurrentUser();
    if (!me) return;
    const bookings = getBookingsByUser(me.id);
    const events = getEvents();
    const today = new Date();

    // Upcoming events: event date >= today
    const upcoming = bookings
      .filter(b => {
        const event = events.find(e => Number(e.id) === Number(b.eventId));
        return event && new Date(event.date) >= today;
      })
      .map(b => {
        const event = events.find(e => Number(e.id) === Number(b.eventId));
        return { ...b, event };
      });

    // Past attended events: event date < today and status CONFIRMED
    const past = bookings
      .filter(b => {
        const event = events.find(e => Number(e.id) === Number(b.eventId));
        return event && new Date(event.date) < today && b.status === 'CONFIRMED';
      })
      .map(b => {
        const event = events.find(e => Number(e.id) === Number(b.eventId));
        return { ...b, event };
      });

    setUpcomingRows(upcoming);
    setPastRows(past);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = (id) => {
    if (confirm('Cancel this booking?')) {
      deleteBooking(id);
      load();
    }
  };

  const filteredUpcoming = upcomingRows.filter(r =>
    (r.event?.title || '').toLowerCase().includes(search.toLowerCase())
  );
  const filteredPast = pastRows.filter(r =>
    (r.event?.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="layout">
      <div className="sidebar">
        <UserSidebar />
      </div>
      <div className="content">
        <h2>My Bookings</h2>
        <input
          type="text"
          placeholder="Search by event title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 16, width: '100%', padding: 8 }}
        />

        <h3>Upcoming Registered Events</h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th><th>Event</th><th>Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUpcoming.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No upcoming bookings.</td></tr>
            )}
            {filteredUpcoming.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.event?.title || '—'}</td>
                <td>{r.event ? formatDateTime(r.event.date) : '—'}</td>
                <td>{r.status}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleCancel(r.id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ marginTop: '2rem' }}>Past Attended Events</h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th><th>Event</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPast.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No past attended events.</td></tr>
            )}
            {filteredPast.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.event?.title || '—'}</td>
                <td>{r.event ? formatDateTime(r.event.date) : '—'}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;
