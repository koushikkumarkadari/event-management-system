import { useEffect, useState } from 'react';
import UserSidebar from '../../../components/UserSidebar/UserSidebar';
import { getCurrentUser } from '../../../services/authService';
import { getBookingsByUser, getEvents, deleteBooking } from '../../../services/dataService';
import { formatDateTime } from '../../../utils/date';
import '../../../App.css'

const MyBookings = () => {
  const [rows, setRows] = useState([]);

  const load = () => {
    const me = getCurrentUser();
    if (!me) return;
    const bookings = getBookingsByUser(me.id);
    const events = getEvents();
    const today = new Date();

    // Future booked events: event date >= today
    const upcoming = bookings
      .filter(b => {
        const event = events.find(e => Number(e.id) === Number(b.eventId));
        return event && new Date(event.date) >= today;
      })
      .map(b => {
        const event = events.find(e => Number(e.id) === Number(b.eventId));
        return { ...b, event };
      });

    setRows(upcoming);
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

  return (
    <div className="layout">
      <div className="sidebar">
        {/* Sidebar only visible on desktop via CSS */}
        <UserSidebar />
      </div>
      <div className="content">
        <h2>My Bookings</h2>
        <table className="table">
          <thead>
            <tr>
              <th>#</th><th>Event</th><th>Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No upcoming bookings.</td></tr>
            )}
            {rows.map((r, i) => (
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
      </div>
    </div>
  );
};

export default MyBookings;
