// src/App.jsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Events from './pages/user/Events/Events';
import MyBookings from './pages/user/MyBookings/MyBookings';
import Navbar from './components/Navbar/Navbar';
import ViewEvent from './pages/user/ViewEvent/ViewEvent';
//import BookingHistory from './pages/user/Bookinghistory/Bookinghistory';
import UserProfile from './pages/user/UserProfile/UserProfile';
import Notifications from './pages/user/Notifications/Notifications';
//import Bookevent from './pages/user/Bookevent/Bookevent';

import { login, logout } from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = (email, password) => {
    const result = login(email, password);
    if (result) {
      setToken(result.token);
      setRole(result.role);
      setUser(result.user);
      return result;
    }
    return null;
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const Protected = ({ children, allow }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (allow && !allow.includes(role)) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <div className="container mt-4 mb-5">
      <Navbar role={role} />
      <Routes>
        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/user/dashboard" replace />
              : <Login onLogin={handleLogin} />
          }
        />

        {/* User routes */}
        <Route path="/user/events/:id" element={<ViewEvent />} />
        <Route
          path="/user/dashboard"
          element={
            <Protected allow={['USER']}>
              <UserDashboard onLogout={handleLogout} />
            </Protected>
          }
        />
        <Route
          path="/events"
          element={
            <Protected allow={['USER']}>
              <Events />
            </Protected>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <Protected allow={['USER']}>
              <MyBookings />
            </Protected>
          }
        />
        {/*<Route
          path="/bookinghistory"
          element={
            <Protected allow={['USER']}>
              <BookingHistory />
            </Protected>
          }
        />
        <Route
          path="/bookevent"
          element={
            <Protected allow={['USER']}>
              <Bookevent />
            </Protected>
          }
        />*/}
        <Route
          path="/user/profile"
          element={
            <Protected allow={['USER']}>
              <UserProfile onLogout={handleLogout} />
            </Protected>
          }
        />
        <Route
          path="/user/notifications"
          element={
            <Protected allow={['USER']}>
              <Notifications />
            </Protected>
          }
        />
        
          
        
        
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
