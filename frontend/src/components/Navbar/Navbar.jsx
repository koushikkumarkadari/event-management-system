import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserSidebar from '../UserSidebar/UserSidebar';
import './Navbar.css';

const Navbar = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleHamburgerClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">Event Manager</Link>
        </div>
        <div className="navbar-icons">
          <button
            className="icon-btn"
            title="Notifications"
            onClick={() => navigate('/user/notifications')}
          >
            {/* Bell emoji, replace with SVG or image if you want */}
            <span role="img" aria-label="Notifications" style={{ fontSize: '1.5rem' }}>🔔</span>
          </button>
          <button
            className="icon-btn profile-btn"
            title="Profile"
            onClick={() => navigate('/user/profile')}
          >
            {/* Circle user emoji, replace with SVG or image if you want */}
            <span role="img" aria-label="Profile" style={{
              fontSize: '1.5rem',
              borderRadius: '50%',
              background: '#fff',
              color: '#2F4F4F',
              padding: '0.2em'
            }}>👤</span>
          </button>
        </div>
        <button
          className="hamburger"
          onClick={handleHamburgerClick}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
      </nav>
      <div className={`slider-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <UserSidebar />
      </div>
      {sidebarOpen && <div className="overlay" onClick={handleOverlayClick}></div>}
    </>
  );
};

export default Navbar;