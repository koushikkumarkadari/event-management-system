// src/App.jsx
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Events from './pages/user/Events/Events';
import MyBookings from './pages/user/MyBookings/MyBookings';
import Navbar from './components/Navbar/Navbar';
import ViewEvent from './pages/user/ViewEvent/ViewEvent';
import BookingHistory from './pages/user/Bookinghistory/Bookinghistory';
import { initData } from './services/dataService';
 
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    initData();
  }, []);

  const handleLogin = (newToken, userRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', userRole);
    setToken(newToken);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserEmail');
    setToken(null);
    setRole(null);
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
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        

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
        <Route
          path="/bookinghistory"
          element={
            <Protected allow={['USER']}>
              <BookingHistory />
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
