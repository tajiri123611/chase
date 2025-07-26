import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-legal">
            <p>&copy; 2024 JPMorgan Chase & Co. All rights reserved.</p>
            <div className="legal-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms of Use</Link>
              <Link to="/accessibility">Accessibility</Link>
              <Link to="/security">Security</Link>
              <Link to="/site-map">Site Map</Link>
              <Link to="/about">About Chase</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;