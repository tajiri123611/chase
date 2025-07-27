import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import simpleAuthService from '../services/simpleAuthService';
import './Home.css';

const Home = () => {
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
    
    console.log('🔐 Homepage JWT Login attempt started');
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

      console.log('🔐 Homepage JWT Authentication result:', authResult);

      if (authResult.success) {
        console.log('✅ Homepage JWT Authentication successful');
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
        console.log('❌ Homepage JWT Authentication failed:', authResult.error);
        setLoginState(prev => ({
          ...prev,
          error: authResult.error || 'Try: demo/demo, test/test, or admin/admin'
        }));
      }
    } catch (error) {
      console.error('💥 Homepage JWT Login error:', error);
      setLoginState(prev => ({
        ...prev,
        error: error.message || 'Login failed. Please try again.'
      }));
    } finally {
      setLoginState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const togglePasswordVisibility = () => {
    setLoginState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };
  return (
    <div className="home">
      {/* Hero Section with Login */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-text">
              <h1>Enjoy</h1>
              <h1 className="hero-amount">$400</h1>
              <div className="hero-subtitle">
                <h2>New Chase</h2>
                <h2>checking customers</h2>
              </div>
              <p>Open a Chase Total Checking® account with qualifying activities.</p>
              <button className="btn btn-green">Open an account</button>
            </div>
          </div>
          <div className="hero-right">
            <div className="login-card">
              <h3>Welcome</h3>
              
              {loginState.error && (
                <div className="error-message" style={{
                  backgroundColor: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '6px',
                  padding: '12px 15px',
                  marginBottom: '15px',
                  color: '#c33',
                  fontSize: '14px'
                }}>
                  <span>⚠️</span> {loginState.error}
                </div>
              )}
              
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loginState.isLoading}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <div className="password-field">
                    <input 
                      type={loginState.showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loginState.isLoading}
                      placeholder="Enter your password"
                      required
                    />
                    <button 
                      type="button" 
                      className="show-password"
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
                    Remember me
                  </label>
                  <Link to="/forgot" className="forgot-link">Use token ></Link>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-signin"
                  disabled={loginState.isLoading}
                >
                  {loginState.isLoading ? (
                    <>
                      <span style={{
                        display: 'inline-block',
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        borderTopColor: 'white',
                        animation: 'spin 1s ease-in-out infinite',
                        marginRight: '8px'
                      }}></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
                <div className="login-links">
                  <Link to="/forgot">Forgot username/password?</Link>
                  <Link to="/signup">Not Enrolled? Sign Up Now ></Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Center Section */}
      <section className="knowledge-center">
        <div className="container">
          <div className="knowledge-content">
            <div className="knowledge-image">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop" alt="Business consultation" />
            </div>
            <div className="knowledge-text">
              <h2>Explore the Knowledge Center</h2>
              <p>Find articles, videos and more to help you start, manage or grow your business.</p>
              <button className="btn btn-green">Continue</button>
            </div>
          </div>
        </div>
      </section>

      {/* Auto Finance Section */}
      <section className="auto-finance">
        <div className="container">
          <div className="auto-content">
            <div className="auto-text">
              <h2>Finance your next ride with Chase Auto</h2>
              <p>Apply online in just minutes and secure your monthly payment, rate and financing terms for 30 days.</p>
              <button className="btn btn-green">Apply now</button>
            </div>
            <div className="auto-image">
              <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop" alt="Family in kitchen" />
            </div>
          </div>
        </div>
      </section>

      {/* Choose What's Right Section */}
      <section className="choose-section">
        <div className="container">
          <h2 className="section-title">Choose what's right for you</h2>
          <div className="choose-nav">
            <button className="choose-nav-btn active">
              <div className="nav-icon">💼</div>
              Business
            </button>
            <button className="choose-nav-btn">
              <div className="nav-icon">💳</div>
              Credit cards
            </button>
            <button className="choose-nav-btn">
              <div className="nav-icon">🏦</div>
              Checking
            </button>
            <button className="choose-nav-btn">
              <div className="nav-icon">✈️</div>
              Travel
            </button>
            <button className="choose-nav-btn">
              <div className="nav-icon">💰</div>
              Savings
            </button>
          </div>
          <div className="choose-cards">
            <div className="choose-card sapphire-card">
              <div className="card-header">
                <h3>Chase Sapphire Reserve®</h3>
                <div className="card-icon">💳</div>
              </div>
              <div className="card-content">
                <h4>100,000 points + $500 Chase Travel℠ credit</h4>
                <p>Our best offer ever. Plus, get more than $2,700 in annual value with the most rewarding card.</p>
                <button className="btn btn-blue">See details</button>
              </div>
            </div>
            <div className="choose-card jp-morgan-card">
              <div className="card-header">
                <h3>J.P. Morgan</h3>
                <div className="card-icon">👥</div>
              </div>
              <div className="card-content">
                <h4>Don't go it alone</h4>
                <p>Partner with a J.P. Morgan Private Client Advisor, dedicated to helping you reach your individual investment goals.</p>
                <button className="btn btn-blue">Continue</button>
              </div>
            </div>
            <div className="choose-card secure-banking-card">
              <div className="card-header">
                <h3>Chase Secure Banking℠</h3>
                <div className="card-icon">💳</div>
              </div>
              <div className="card-content">
                <h4>Enjoy $100 on us</h4>
                <p>For new Chase checking customers when you open a Chase Secure Banking account with qualifying transactions.</p>
                <button className="btn btn-blue">Open an account</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="help-section">
        <div className="container">
          <div className="help-content">
            <div className="social-links">
              <span>Follow us:</span>
              <div className="social-icons">
                <a href="https://facebook.com/chase" target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>
                <a href="https://instagram.com/chase" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>
                <a href="https://twitter.com/chase" target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦</a>
                <a href="https://youtube.com/chase" target="_blank" rel="noopener noreferrer" aria-label="YouTube">📺</a>
                <a href="https://linkedin.com/company/chase" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">💼</a>
                <a href="https://pinterest.com/chase" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">📌</a>
              </div>
            </div>
            <p className="help-text">We're here to help you manage your money today and tomorrow</p>
            <div className="help-categories">
              <div className="help-category">
                <div className="help-icon">🏦</div>
                <h4>Checking Accounts</h4>
                <p>Choose the checking account that works best for you. See our Chase Total Checking® offer for new customers. Make purchases with your debit card, and bank from almost anywhere by phone, tablet or computer and more than 15,000 ATMs and more than 4,700 branches.</p>
              </div>
              <div className="help-category">
                <div className="help-icon">💰</div>
                <h4>Savings Accounts & CDs</h4>
                <p>It's never too early to begin saving. Open a savings account or open a Certificate of Deposit (see interest rates) and start saving your money.</p>
              </div>
              <div className="help-category">
                <div className="help-icon">💳</div>
                <h4>Credit Cards</h4>
                <p>Chase credit cards can help you buy the things you need. Many of our cards offer rewards that can be redeemed for cash back or travel-related perks. With so many options, it can be easy to find a card that matches your lifestyle. Plus, with Credit Journey you can get a free credit score!</p>
              </div>
              <div className="help-category">
                <div className="help-icon">🏠</div>
                <h4>Mortgages</h4>
                <p>Apply for a mortgage or refinance your mortgage with Chase. View today's mortgage rates or calculate what you can afford with our mortgage calculator. Visit our homebuying tips and more.</p>
              </div>
              <div className="help-category">
                <div className="help-icon">🚗</div>
                <h4>Auto</h4>
                <p>Chase Auto is here to help you get the right car. Apply for auto financing for a new or used car with Chase. Use the payment calculator to estimate monthly payments. Check out the Chase Auto Education Center to get car guidance from a trusted source.</p>
              </div>
              <div className="help-category">
                <div className="help-icon">🏢</div>
                <h4>Chase for Business</h4>
                <p>With Chase for Business you'll receive guidance from a team of business professionals who specialize in helping improve cash flow, providing credit solutions, and on managing payroll. Choose from business checking, business credit cards, merchant services or visit our business resource center.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Services */}
      <section className="bottom-services">
        <div className="container">
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">📊</div>
              <h4>Investing by J.P. Morgan</h4>
              <p>Partner with a global leader</p>
            </div>
            <div className="service-item">
              <div className="service-icon">👤</div>
              <h4>Chase Private Client</h4>
              <p>Get more from a personalized relationship with a dedicated banker to help you manage your everyday banking needs and a J.P. Morgan Private Client Advisor who will help develop a personalized investment strategy to meet your evolving needs.</p>
            </div>
            <div className="service-item">
              <div className="service-icon">ℹ️</div>
              <h4>About Chase</h4>
              <p>Chase serves millions of people with a broad range of products. Chase online lets you manage your Chase accounts, view statements, monitor activity, pay bills or transfer funds securely from one central place.</p>
            </div>
            <div className="service-item">
              <div className="service-icon">🎯</div>
              <h4>Sports & Entertainment</h4>
              <p>Chase gives you access to unique sports, entertainment and culinary events through Chase Experiences and our exclusive partnerships such as the US Open, Madison Square Garden and Chase Center.</p>
            </div>
            <div className="service-item">
              <div className="service-icon">🔒</div>
              <h4>Chase Security Center</h4>
              <p>Our suite of security features can help you bank safely and securely. Get security alerts, use Touch ID, set up account alerts and more.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;