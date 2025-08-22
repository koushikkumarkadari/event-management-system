import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserSidebar from '../UserSidebar/UserSidebar';
import './Navbar.css';

const Navbar = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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