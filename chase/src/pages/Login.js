import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import simpleAuthService from '../services/simpleAuthService';
import { testGoogleSheetsConnection } from '../utils/testGoogleSheets';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  
  const [loginState, setLoginState] = useState({
    isLoading: false,
    error: null,
    showPassword: false
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (loginState.error) {
      setLoginState(prev => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔐 JWT Login attempt started');
    console.log('📝 Form data:', { 
      username: formData.username, 
      hasPassword: !!formData.password,
      rememberMe: formData.rememberMe 
    });
    
    setLoginState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use simple authentication service
      const authResult = await simpleAuthService.authenticateUser(
        formData.username.trim(),
        formData.password,
        formData.rememberMe
      );

      console.log('🔐 JWT Authentication result:', authResult);

      if (authResult.success) {
        console.log('✅ JWT Authentication successful');
        console.log('🎫 JWT Token generated');
        console.log('👤 User data:', authResult.user);
        
        console.log('🚀 Navigating to banking page...');
        // Redirect to banking dashboard
        navigate('/banking', { 
          state: { 
            user: authResult.user,
            message: `Welcome back, ${authResult.user.accountName || authResult.user.username}!`,
            isJWTAuth: true // Flag to indicate JWT authentication
          }
        });
      } else {
        console.log('❌ JWT Authentication failed:', authResult.error);
        setLoginState(prev => ({
          ...prev,
          error: authResult.error || 'Invalid username or password. Try: demo/demo, test/test, or admin/admin'
        }));
      }
    } catch (error) {
      console.error('💥 JWT Login error:', error);
      setLoginState(prev => ({
        ...prev,
        error: error.message || 'Login failed. Please try again later.'
      }));
    } finally {
      console.log('🏁 JWT Login process completed');
      setLoginState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const togglePasswordVisibility = () => {
    setLoginState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <h1>Sign in to Chase</h1>
            <p>Access your accounts securely</p>
          </div>

          {loginState.error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {loginState.error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loginState.isLoading}
                placeholder="Enter your username or email"
                className={loginState.error ? 'error' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={loginState.showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loginState.isLoading}
                  placeholder="Enter your password"
                  className={loginState.error ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loginState.isLoading}
                >
                  {loginState.showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={loginState.isLoading}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot username or password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={loginState.isLoading}
            >
              {loginState.isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <div className="alternative-login">
            <button className="btn btn-secondary biometric-btn">
              <span className="biometric-icon">👆</span>
              Sign in with Touch ID
            </button>
          </div>

          {/* Debug Test Button - Remove in production */}
          <div className="debug-section" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '6px' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Debug Tools:</p>
            <button 
              type="button" 
              onClick={testGoogleSheetsConnection}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              Test Google Sheets Connection
            </button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Check browser console for results
            </p>
          </div>

          <div className="login-footer">
            <p>New to Chase? <Link to="/signup">Create an account</Link></p>
            <div className="security-info">
              <p>🔒 Your information is protected with bank-level security</p>
            </div>
          </div>
        </div>

        <div className="login-sidebar">
          <div className="sidebar-content">
            <h3>Why choose Chase?</h3>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">🏦</span>
                <div>
                  <strong>Nationwide presence</strong>
                  <p>4,700+ branches and 16,000+ ATMs</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">📱</span>
                <div>
                  <strong>Award-winning mobile app</strong>
                  <p>Bank anywhere, anytime</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">🛡️</span>
                <div>
                  <strong>Advanced security</strong>
                  <p>24/7 fraud monitoring</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">💳</span>
                <div>
                  <strong>Reward programs</strong>
                  <p>Earn points and cash back</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;