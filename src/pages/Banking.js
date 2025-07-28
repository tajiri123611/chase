import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import simpleAuthService from '../services/simpleAuthService';

const Banking = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check JWT authentication
    const checkJWTAuth = async () => {
      console.log('🔐 Checking JWT authentication...');
      
      // First check if user data was passed via navigation state (from login)
      if (location.state?.user && location.state?.isJWTAuth) {
        console.log('✅ User data from navigation state (JWT)');
        setUser(location.state.user);
        setBalance(location.state.user.balance || '0.00');
        setIsLoading(false);
        return;
      }

      // Check simple authentication service
      const currentUser = simpleAuthService.getCurrentUser();
      if (currentUser) {
        console.log('✅ Simple authentication valid');
        console.log('👤 Current user:', currentUser);
        
        setUser(currentUser);
        setBalance(currentUser.balance || '0.00');
        setIsLoading(false);
        
        // Check if token is expiring soon
        if (simpleAuthService.isTokenExpiringSoon()) {
          console.log('⏰ Token expiring soon');
          // Note: Simple auth doesn't have automatic refresh, user will need to re-login
        }
        
        return;
      }

      // Fallback: Check old localStorage/sessionStorage for backward compatibility
      const storedUser = localStorage.getItem('chaseUser');
      const sessionUser = sessionStorage.getItem('chaseUser');
      
      if (storedUser || sessionUser) {
        console.log('⚠️ Found old session data, redirecting to login for JWT upgrade');
        localStorage.removeItem('chaseUser');
        sessionStorage.removeItem('chaseUser');
      }

      // No valid authentication found, redirect to login
      console.log('❌ No valid JWT authentication, redirecting to login');
      navigate('/login');
    };

    checkJWTAuth();
  }, [location.state, navigate]);

  const refreshBalance = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('💰 Refreshing balance with simple auth...');
      const newBalance = await simpleAuthService.refreshUserBalance();
      setBalance(newBalance);
      
      // Update user state with new balance
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      
      console.log('✅ Balance refreshed successfully:', newBalance);
    } catch (error) {
      setError('Failed to refresh balance');
      console.error('❌ Balance refresh error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('👋 Logging out with simple auth...');
    simpleAuthService.signOut();
    navigate('/');
  };

  const formatBalance = (amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="banking-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner-large"></div>
            <p>Loading your account...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="banking-page">
      <div className="container">
        {/* Welcome Message */}
        {location.state?.message && (
          <div className="welcome-message">
            <span className="welcome-icon">👋</span>
            {location.state.message}
          </div>
        )}

        {/* Account Header */}
        <div className="account-header">
          <div className="account-info">
            <h1>Welcome, {user.accountName || user.username}</h1>
            <p className="account-subtitle">Your Chase Banking Dashboard</p>
            {/* Auth Status Indicator */}
            <div className="auth-status" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '8px',
              fontSize: '12px',
              color: '#666'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: simpleAuthService.isAuthenticated() ? '#4CAF50' : '#f44336'
              }}></span>
              <span>
                {simpleAuthService.isAuthenticated() ? 'Secure Session Active' : 'Session Expired'}
              </span>
              {simpleAuthService.getTokenExpiration() && (
                <span style={{ marginLeft: '10px' }}>
                  Expires: {simpleAuthService.getTokenExpiration().toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="account-actions">
            <button onClick={refreshBalance} className="btn btn-secondary" disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh Balance'}
            </button>
            <button onClick={handleLogout} className="btn btn-outline">
              Sign Out
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button onClick={() => setError(null)} className="error-close">×</button>
          </div>
        )}

        {/* Account Balance Card */}
        <div className="balance-card">
          <div className="balance-header">
            <h2>Chase Total Checking®</h2>
            <span className="account-number">Account ending in ••••4758</span>
          </div>
          <div className="balance-amount">
            <span className="balance-label">Available Balance</span>
            <span className="balance-value">{formatBalance(balance)}</span>
          </div>
          <div className="balance-actions">
            <button className="btn btn-primary">Transfer Money</button>
            <button className="btn btn-secondary">Pay Bills</button>
            <button className="btn btn-secondary">View Statements</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-item">
              <div className="action-icon">💳</div>
              <h3>Mobile Deposit</h3>
              <p>Deposit checks using your phone</p>
              <button className="btn btn-outline">Get Started</button>
            </div>
            <div className="action-item">
              <div className="action-icon">🔄</div>
              <h3>Transfer Funds</h3>
              <p>Move money between accounts</p>
              <button className="btn btn-outline">Transfer</button>
            </div>
            <div className="action-item">
              <div className="action-icon">📄</div>
              <h3>Account Statements</h3>
              <p>View and download statements</p>
              <button className="btn btn-outline">View Statements</button>
            </div>
            <div className="action-item">
              <div className="action-icon">🔔</div>
              <h3>Account Alerts</h3>
              <p>Set up notifications and preferences</p>
              <button className="btn btn-outline">Manage Alerts</button>
            </div>
          </div>
        </div>

        {/* Banking Services */}
        <div className="banking-services">
          <h2>Banking Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Checking Accounts</h3>
              <p>Manage your everyday banking with our checking account options.</p>
              <ul>
                <li>Chase Total Checking®</li>
                <li>Chase Premier Plus Checking℠</li>
                <li>Chase Sapphire℠ Checking</li>
              </ul>
              <Link to="/signup" className="btn btn-primary">Open Account</Link>
            </div>
            
            <div className="service-card">
              <h3>Savings Accounts</h3>
              <p>Grow your money with our competitive savings rates.</p>
              <ul>
                <li>Chase Savings℠</li>
                <li>Chase Premier Savings℠</li>
                <li>Certificates of Deposit</li>
              </ul>
              <Link to="/signup" className="btn btn-primary">Start Saving</Link>
            </div>
            
            <div className="service-card">
              <h3>Online & Mobile Banking</h3>
              <p>Bank anytime, anywhere with our digital tools.</p>
              <ul>
                <li>Mobile check deposit</li>
                <li>Bill pay and transfers</li>
                <li>Account alerts</li>
              </ul>
              <button className="btn btn-primary">Explore Features</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .banking-page {
          min-height: calc(100vh - 140px);
          background-color: #f8f8f8;
          padding: 20px 0;
        }

        .loading-container {
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner-large {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(17, 122, 202, 0.3);
          border-radius: 50%;
          border-top-color: #117ACA;
          animation: spin 1s ease-in-out infinite;
          margin: 0 auto 20px;
        }

        .welcome-message {
          background: linear-gradient(135deg, #117ACA, #0F5F8C);
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .welcome-icon {
          font-size: 20px;
        }

        .account-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .account-info h1 {
          color: #333;
          margin-bottom: 5px;
        }

        .account-subtitle {
          color: #666;
          margin: 0;
        }

        .account-actions {
          display: flex;
          gap: 10px;
        }

        .balance-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .balance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .balance-header h2 {
          color: #333;
          margin: 0;
        }

        .account-number {
          color: #666;
          font-size: 14px;
        }

        .balance-amount {
          text-align: center;
          margin-bottom: 30px;
        }

        .balance-label {
          display: block;
          color: #666;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .balance-value {
          display: block;
          font-size: 3rem;
          font-weight: 300;
          color: #117ACA;
        }

        .balance-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .quick-actions, .banking-services {
          margin-bottom: 40px;
        }

        .quick-actions h2, .banking-services h2 {
          color: #333;
          margin-bottom: 20px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .action-item {
          background: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
        }

        .action-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .action-item h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .action-item p {
          color: #666;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .service-card {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .service-card h3 {
          color: #333;
          margin-bottom: 15px;
        }

        .service-card p {
          color: #666;
          margin-bottom: 20px;
        }

        .service-card ul {
          list-style: none;
          padding: 0;
          margin-bottom: 25px;
        }

        .service-card li {
          color: #666;
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }

        .service-card li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #117ACA;
          font-weight: bold;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          text-align: center;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background-color: #117ACA;
          color: white;
        }

        .btn-primary:hover {
          background-color: #0F5F8C;
        }

        .btn-secondary {
          background-color: #f8f8f8;
          color: #333;
          border: 1px solid #ddd;
        }

        .btn-secondary:hover {
          background-color: #e8e8e8;
        }

        .btn-outline {
          background-color: transparent;
          color: #117ACA;
          border: 2px solid #117ACA;
        }

        .btn-outline:hover {
          background-color: #117ACA;
          color: white;
        }

        .error-message {
          background-color: #fee;
          border: 1px solid #fcc;
          border-radius: 6px;
          padding: 12px 15px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #c33;
          font-size: 14px;
          position: relative;
        }

        .error-close {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #c33;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .account-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .balance-value {
            font-size: 2.5rem;
          }

          .balance-actions {
            flex-direction: column;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Banking;