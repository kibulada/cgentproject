import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logocgent.png';

// Custom X Logo component
const XLogo = () => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    className="x-logo"
  >
    <path 
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      fill="currentColor"
    />
  </svg>
);

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logo} alt="CGENT Logo" className="logo-image" />
          <span className="logo-text"></span>
        </Link>
        
        <nav className="nav-menu">
          <div className="nav-background">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/superswarm" 
              className={`nav-link ${location.pathname === '/superswarm' ? 'active' : ''}`}
            >
              SuperSwarm
            </Link>
            <a 
              href="https://cgent.gitbook.io/cgent-docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link"
            >
              Docs
            </a>
          </div>
        </nav>

        <a href="https://x.com/CGentOnWeb3" target="_blank" rel="noopener noreferrer" className="social-link">
          <XLogo />
        </a>
      </div>
    </header>
  );
};

export default Header; 