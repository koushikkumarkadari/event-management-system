import React, { useEffect, useState } from 'react';
import './Notifications.css';
import { getCurrentUser } from '../../../services/authService';
import UserSidebar from '../../../components/UserSidebar/UserSidebar'; // Add this import

// Dummy notifications data (replace with real data source if available)
const dummyNotifications = [
  {
    id: 1,
    message: "Your booking for Tech Meetup is confirmed.",
    date: "2025-09-01",
    sender: "Event Admin"
  },
  {
    id: 2,
    message: "Startup Pitch event has been rescheduled.",
    date: "2025-08-30",
    sender: "Organizer"
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // In real app, fetch notifications for current user from backend or localStorage
    const user = getCurrentUser();
    if (user) {
      setNotifications(dummyNotifications); // Filter by user if needed
    }
  }, []);

  return (
    <div className="layout">
      <div className="sidebar">
        <UserSidebar />
      </div>
      <div className="notifications-container">
        <h2>User Notifications</h2>
        {notifications.length === 0 ? (
          <div className="no-notifications">No notifications yet.</div>
        ) : (
          <ul className="notifications-list">
            {notifications.map(n => (
              <li key={n.id} className="notification-item">
                <div className="notification-message">{n.message}</div>
                <div className="notification-meta">
                  <span>{n.sender}</span> | <span>{n.date}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;