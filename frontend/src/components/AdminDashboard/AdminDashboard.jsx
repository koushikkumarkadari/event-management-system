import { useEffect, useState } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import { getUsers, getEvents, getBookings } from '../../services/dataService';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({ users: 0, organizers: 0, events: 0, bookings: 0 });
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  useEffect(() => {
    const users = getUsers();
    const organizers = users.filter(u => u.role === 'ORGANIZER').length;
    setStats({
      users: users.length,
      organizers,
      events: getEvents().length,
      bookings: getBookings().length
    });
  }, []);

  return (
    <div className="layout">
      <div className="sidebar">
        {/* Pass role so AdminSidebar can filter links */}
        <AdminSidebar role={role} />
      </div>
      <div className="content">
        <div className="header">
          <h1>{role === 'ORGANIZER' ? 'Organizer Dashboard' : 'Admin Dashboard'}</h1>
          <button className="btn btn-danger" onClick={onLogout}>Logout</button>
        </div>
        <p className="text-muted">
          {role === 'ORGANIZER'
            ? 'Select an option from the sidebar to manage events and bookings.'
            : 'Select an option from the sidebar to manage the system.'}
        </p>
        <div className="stats-grid">
          {/* Only show Users stat to ADMIN */}
          {role === 'ADMIN' && (
            <div className="stat-card"><h2>{stats.users}</h2><div>Users</div></div>
          )}
          <div className="stat-card"><h2>{stats.organizers}</h2><div>Organizers</div></div>
          <div className="stat-card"><h2>{stats.events}</h2><div>Events</div></div>
          <div className="stat-card"><h2>{stats.bookings}</h2><div>Bookings</div></div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
