import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRocket, FaHome, FaUpload, FaDownload, FaInfoCircle, FaEnvelope, FaList, FaSignOutAlt } from 'react-icons/fa';


const NavbarWithFileActivity = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      alert('Logout failed');
    }
  };

  // Pages where navbar is shown: home, upload, download, contact, about
  // We want to add File Activity nav item only on home, upload, download pages

  const showFileActivity = ['/home', '/upload', '/download'].includes(location.pathname);

  // Show Home link on about and contact pages as well
  const showHomeOnAboutContact = ['/about', '/contact'].includes(location.pathname);

  // Also show Home link on /file-activity page
  const showHomeOnFileActivity = location.pathname === '/file-activity';

  // Determine if user is authenticated by checking if setIsAuthenticated is true
  // Since setIsAuthenticated is a setter function, we need to pass isAuthenticated as prop instead
  // For now, we will check if user is authenticated by calling a function or state (not available here)
  // So we will add a click handler on the logo and text to navigate accordingly

  const handleLogoClick = () => {
    // Here we assume user is authenticated if setIsAuthenticated is true (not accurate)
    // Ideally, pass isAuthenticated as prop to this component
    // For now, navigate to /home if authenticated, else /login
    // We can check if current path is not /login or /register as a proxy for authentication
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav
      style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
      className="bg-teal-800 text-white p-4 flex justify-between items-center border-b-4 border-blue-500"
    >
      <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
        <FaRocket className="text-2xl" />
        <span className="font-bold text-xl">Interstellar</span>
      </div>
      <div className="flex space-x-6 items-center">
        {location.pathname !== '/home' && (
          <Link to="/home" className="flex items-center space-x-1">
            <FaHome />
            <span>Home</span>
          </Link>
        )}
        {location.pathname !== '/upload' && (
          <Link to="/upload" className="flex items-center space-x-1">
            <FaUpload />
            <span>Upload</span>
          </Link>
        )}
        {location.pathname !== '/download' && (
          <Link to="/download" className="flex items-center space-x-1">
            <FaDownload />
            <span>Download</span>
          </Link>
        )}
        {showFileActivity && location.pathname !== '/file-activity' && (
          <Link to="/file-activity" className="flex items-center space-x-1">
            <FaList />
            <span>File Activity</span>
          </Link>
        )}
        {location.pathname !== '/contact' && (
          <Link to="/contact" className="flex items-center space-x-1">
            <FaEnvelope />
            <span>Contact</span>
          </Link>
        )}
        {location.pathname !== '/about' && (
          <Link to="/about" className="flex items-center space-x-1">
            <FaInfoCircle />
            <span>About</span>
          </Link>
        )}
        {showHomeOnAboutContact && (
          <Link to="/home" className="flex items-center space-x-1">
            <FaHome />
            <span>Home</span>
          </Link>
        )}
        {showHomeOnFileActivity && (
          <Link to="/home" className="flex items-center space-x-1">
            <FaHome />
            <span>Home</span>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="ml-4 flex items-center space-x-1 cursor-pointer hover:underline"
          title="Logout"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default NavbarWithFileActivity;
