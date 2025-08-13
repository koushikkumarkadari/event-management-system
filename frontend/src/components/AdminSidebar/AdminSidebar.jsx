import { useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = ({ role }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <button onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
      <button onClick={() => navigate('/admin/events')}>View Events</button>
      <button onClick={() => navigate('/admin/create-event')}>Create Event</button>
      
      {/* Only show Manage Users link to ADMIN */}
      {role === 'ADMIN' && (
        <button onClick={() => navigate('/admin/users')}>Manage Users</button>
      )}

      <button onClick={() => navigate('/admin/bookings')}>View Bookings</button>
    </div>
  );
};

export default AdminSidebar;
