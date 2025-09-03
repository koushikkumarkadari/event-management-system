import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../../services/authService';
import { getUsers } from '../../../services/dataService';
import defaultProfile from '../../../assets/default-profile.jpg';
import './UserProfile.css';
import UserSidebar from '../../../components/UserSidebar/UserSidebar';

const UserProfile = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const current = getCurrentUser();
    if (current) {
      const users = getUsers();
      const found = users.find(u => u.id === current.id);
      setUser(found);
    }
  }, []);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (!newPassword) {
      setMessage('Password cannot be empty');
      return;
    }
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      setMessage('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="layout">
      <div className="sidebar">
        <UserSidebar />
      </div>
      <div className="profile-card">
        <h2 className="profile-title">User Profile</h2>
        <div className="profile-info">
          <img src={defaultProfile} alt="Profile" className="profile-photo" />
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Phone:</strong> {user.phone || '—'}</div>
          <div><strong>Role:</strong> {user.role}</div>
        </div>
        <form onSubmit={handlePasswordChange} className="profile-form">
          <h4>Change Password</h4>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="profile-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="profile-input"
          />
          <button type="submit" className="profile-btn">
            Update Password
          </button>
          {message && <div className="profile-message">{message}</div>}
        </form>
        <button className="profile-btn" style={{ marginTop: '18px', background: '#d9534f' }} onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;