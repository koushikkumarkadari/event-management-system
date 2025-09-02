import { useNavigate } from 'react-router-dom';
import './UserSidebar.css';

const UserSidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <button onClick={() => navigate('/user/dashboard')}>Dashboard</button>
      <button onClick={() => navigate('/events')}>View Events</button>
      <button onClick={() => navigate('/my-bookings')}>My Bookings</button>
      <button onClick={() => navigate('/bookinghistory')}>History</button>
      <button onClick={() => navigate('/user/profile')}>My Profile</button>
      <button onClick={() => navigate('/user/notifications')}>Notifications</button>
    </div>
  );
};

export default UserSidebar;
