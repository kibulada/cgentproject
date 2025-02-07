import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logocgent.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={logo} alt="CGENT Logo" className="footer-logo-image" />
          <span className="footer-logo-text"></span>
        </div>
        <div className="footer-links">
            
          <Link to="https://cgent.gitbook.io/cgent-docs" target='_blank'>Documentation</Link>
          <Link to="https://cgent.gitbook.io/cgent-docs/developers/register-your-agent" target='_blank'>SDK Reference</Link>
          <Link to="https://x.com/CGentOnWeb3" target='_blank'>Contact</Link>
        </div>
        <div className="social-icons">
          {/* Add your social media icons here */}
        </div>
        <div className="copyright">
          © 2025 CGENT. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 