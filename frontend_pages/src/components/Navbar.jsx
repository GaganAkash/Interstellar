import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRocket, FaInfoCircle, FaEnvelope } from 'react-icons/fa';

const Navbar = ({ setIsAuthenticated }) => {
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

  return (
    <nav
     style={{ position: 'absolute', top: 0, left: 0, width: '100%' }} 
    className="bg-teal-800 text-white p-4 flex justify-between items-center border-b-2 border-blue-500">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => {
        if (location.pathname !== '/login' && location.pathname !== '/register') {
          navigate('/home');
        } else {
          navigate('/login');
        }
      }}>
        <FaRocket className="text-2xl" />
        <span className="font-bold text-xl">Interstellar</span>
      </div>
      <div className="flex space-x-6 items-center">
        {location.pathname !== '/about' && (
          <Link to="/about" className="flex items-center space-x-1">
            <FaInfoCircle />
            <span>About</span>
          </Link>
        )}
        {location.pathname !== '/contact' && (
          <Link to="/contact" className="flex items-center space-x-1">
            <FaEnvelope />
            <span>Contact</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
