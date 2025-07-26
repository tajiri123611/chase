import React from 'react';
import { Link } from 'react-router-dom';

const Mortgages = () => {
  return (
    <div className="mortgages-page">
      <section className="hero" style={{background: 'linear-gradient(135deg, var(--chase-blue) 0%, var(--chase-dark-blue) 100%)', color: 'white', padding: '80px 0'}}>
        <div className="container">
          <h1 style={{fontSize: '3rem', marginBottom: '20px'}}>Chase Home Lending</h1>
          <p style={{fontSize: '1.2rem', marginBottom: '30px'}}>Your home financing journey starts here</p>
          <Link to="/signup" className="btn btn-white">Get Started</Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <h2 className="text-center mb-40">Home Lending Options</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px'}}>
            <div style={{background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{color: 'var(--chase-dark-gray)', marginBottom: '15px'}}>Buy a Home</h3>
              <p style={{marginBottom: '20px'}}>Get pre-qualified and find your dream home with competitive rates.</p>
              <Link to="/signup" className="btn btn-primary">Get Pre-qualified</Link>
            </div>
            
            <div style={{background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{color: 'var(--chase-dark-gray)', marginBottom: '15px'}}>Refinance</h3>
              <p style={{marginBottom: '20px'}}>Lower your monthly payment or get cash from your home's equity.</p>
              <Link to="/signup" className="btn btn-primary">Check Rates</Link>
            </div>
            
            <div style={{background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{color: 'var(--chase-dark-gray)', marginBottom: '15px'}}>Home Equity</h3>
              <p style={{marginBottom: '20px'}}>Access your home's equity with a HELOC or home equity loan.</p>
              <Link to="/signup" className="btn btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mortgages;