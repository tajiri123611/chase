import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="header-tabs">
              <button className="tab-btn active">Personal</button>
              <button className="tab-btn">Business</button>
              <button className="tab-btn">Commercial</button>
            </div>
            <div className="header-links">
              <Link to="/schedule">Schedule a meeting</Link>
              <Link to="/customer-service">Customer service</Link>
              <Link to="/espanol">Español</Link>
              <button className="search-btn">🔍</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <div className="chase-logo">
                <span className="chase-text">CHASE</span>
                <div className="chase-symbol">◊</div>
              </div>
            </Link>
            
            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <Link to="/banking" className="nav-link">Checking</Link>
              <Link to="/savings" className="nav-link">Savings & CDs</Link>
              <Link to="/credit-cards" className="nav-link">Credit cards</Link>
              <Link to="/mortgages" className="nav-link">Home loans</Link>
              <Link to="/auto" className="nav-link">Auto</Link>
              <Link to="/investing" className="nav-link">Investing by J.P. Morgan</Link>
              <Link to="/education" className="nav-link">Education & goals</Link>
              <Link to="/travel" className="nav-link">Travel</Link>
            </nav>
            
            <div className="header-actions">
              <button 
                className="menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;