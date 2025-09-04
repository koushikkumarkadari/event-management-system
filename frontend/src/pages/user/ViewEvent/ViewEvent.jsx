import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserSidebar from '../../../components/UserSidebar/UserSidebar';
import { getEvents, addBooking, getBookingsByUser } from '../../../services/dataService';
import { getCurrentUser } from '../../../services/authService';
import { formatDateTime } from '../../../utils/date';
import './ViewEvent.css';

const ViewEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const all = getEvents();
    const found = all.find(e => Number(e.id) === Number(id));
    if (!found) {   
      alert('Event not found');
      navigate('/user/events');
    } else {
      setEvent(found);
    }

    const me = getCurrentUser();
    if (me) {
      const bookings = getBookingsByUser(me.id);
      setRegistered(bookings.some(b => Number(b.eventId) === Number(id)));
    }
  }, [id, navigate]);

  const handleRegister = () => {
    const me = getCurrentUser();
    if (!me) return;
    const res = addBooking({ userId: me.id, eventId: Number(id), status: 'CONFIRMED' });
    if (!res) {
      alert('Already registered for this event.');
    } else {
      setRegistered(true);
    }
  };
  
  if (!event) return null;
  console.log(event.imageUrl);
  return (
    <div className="layout">
      <div className="sidebar">
        {/* Sidebar only visible on desktop via CSS */}
        <UserSidebar />
      </div>
      <div className="view-event">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="event-title">{event.title}</h2>
        <p className="event-meta">
          <strong>Date:</strong> {formatDateTime(event.date)}<br />
          <strong>Venue:</strong> {event.venue?.name}<br />
          <strong>Organizer:</strong> {event.organizer}<br />
          <strong>Contact:</strong> <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>
        </p>
        <p className="event-description">{event.description}</p>
        {event.tags?.length > 0 && (
          <div className="event-tags">
            {event.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        {event.imageUrl && (
          <img src={event.imageUrl} alt={event.title} className="event-image" />
        )}
        <div style={{ marginTop: '1rem' }}>
          <button
            className="btn btn-primary"
            disabled={registered}
            onClick={handleRegister}
          >
            {registered ? 'Registered' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
