import React from 'react';
import { Link } from 'react-router-dom';

const CreditCards = () => {
  return (
    <div className="credit-cards-page">
      <section className="hero" style={{background: 'linear-gradient(135deg, var(--chase-blue) 0%, var(--chase-dark-blue) 100%)', color: 'white', padding: '80px 0'}}>
        <div className="container">
          <h1 style={{fontSize: '3rem', marginBottom: '20px'}}>Chase Credit Cards</h1>
          <p style={{fontSize: '1.2rem', marginBottom: '30px'}}>Find the perfect card for your lifestyle</p>
          <Link to="/signup" className="btn btn-white">Compare Cards</Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <h2 className="text-center mb-40">Popular Credit Cards</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px'}}>
            <div style={{background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{color: 'var(--chase-dark-gray)', marginBottom: '15px'}}>Chase Sapphire Preferred®</h3>
              <p style={{color: 'var(--chase-blue)', fontWeight: '600', fontSize: '1.2rem'}}>60,000 bonus points</p>
              <p style={{marginBottom: '20px'}}>2X points on travel and dining. $95 annual fee.</p>
              <Link to="/signup" className="btn btn-primary">Apply Now</Link>
            </div>
            
            <div style={{background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{color: 'var(--chase-dark-gray)', marginBottom: '15px'}}>Chase Freedom Unlimited®</h3>
              <p style={{color: 'var(--chase-blue)', fontWeight: '600', fontSize: '1.2rem'}}>$200 cash back</p>
              <p style={{marginBottom: '20px'}}>1.5% cash back on all purchases. No annual fee.</p>
              <Link to="/signup" className="btn btn-primary">Apply Now</Link>
            </div>
            
            <div style={{background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{color: 'var(--chase-dark-gray)', marginBottom: '15px'}}>Chase Sapphire Reserve®</h3>
              <p style={{color: 'var(--chase-blue)', fontWeight: '600', fontSize: '1.2rem'}}>75,000 bonus points</p>
              <p style={{marginBottom: '20px'}}>Premium travel benefits. $550 annual fee.</p>
              <Link to="/signup" className="btn btn-primary">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreditCards;