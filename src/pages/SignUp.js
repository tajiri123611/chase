import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Account Information
    username: '',
    password: '',
    confirmPassword: '',
    
    // Preferences
    accountType: 'checking',
    paperlessStatements: true,
    marketingEmails: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Account creation:', formData);
  };

  const renderStep1 = () => (
    <div className="step-content">
      <h2>Personal Information</h2>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="(555) 123-4567"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ssn">Social Security Number *</label>
          <input
            type="password"
            id="ssn"
            name="ssn"
            value={formData.ssn}
            onChange={handleChange}
            required
            placeholder="XXX-XX-XXXX"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h2>Address Information</h2>
      <div className="form-group">
        <label htmlFor="address">Street Address *</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State *</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
            {/* Add more states as needed */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code *</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            placeholder="12345"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="accountType">Account Type *</label>
        <select
          id="accountType"
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          required
        >
          <option value="checking">Chase Total Checking</option>
          <option value="savings">Chase Savings</option>
          <option value="premier">Chase Premier Plus Checking</option>
          <option value="private">Chase Private Client</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <h2>Account Setup</h2>
      <div className="form-group">
        <label htmlFor="username">Username *</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Choose a unique username"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Create a strong password"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirm your password"
        />
      </div>
      
      <div className="preferences">
        <h3>Preferences</h3>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="paperlessStatements"
            checked={formData.paperlessStatements}
            onChange={handleChange}
          />
          <span className="checkmark"></span>
          Receive paperless statements
        </label>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="marketingEmails"
            checked={formData.marketingEmails}
            onChange={handleChange}
          />
          <span className="checkmark"></span>
          Receive marketing emails and offers
        </label>
      </div>
    </div>
  );

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>Open Your Chase Account</h1>
          <div className="progress-bar">
            <div className="progress-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
            </div>
            <div className="progress-labels">
              <span>Personal Info</span>
              <span>Address</span>
              <span>Account Setup</span>
            </div>
          </div>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" className="btn btn-secondary" onClick={handlePrev}>
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                Create Account
              </button>
            )}
          </div>
        </form>

        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
          <div className="legal-text">
            <p>By creating an account, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;