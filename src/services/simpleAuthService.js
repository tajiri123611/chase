import Cookies from 'js-cookie';
import googleSheetsService from './googleSheetsService';
import { mockAuthenticate, isGoogleSheetsConfigured } from '../utils/debugLogin';

// Simple Authentication Configuration
const AUTH_CONFIG = {
  TOKEN_NAME: 'chase_auth_token',
  EXPIRES_HOURS: 24, // Token expires in 24 hours
  SECRET_SUFFIX: 'chase-banking-2024' // Simple signature suffix
};

class SimpleAuthService {
  constructor() {
    this.currentUser = null;
    this.loginTime = null;
  }

  /**
   * Generate a simple secure token
   * @param {Object} user - User data
   * @returns {string} Secure token
   */
  generateToken(user) {
    const tokenData = {
      userId: user.username,
      username: user.username,
      accountName: user.accountName,
      balance: user.balance,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + AUTH_CONFIG.EXPIRES_HOURS * 60 * 60 * 1000).toISOString()
    };

    // Create a simple signature using base64 encoding
    const tokenString = JSON.stringify(tokenData);
    const encodedToken = btoa(tokenString); // Base64 encode
    const signature = btoa(encodedToken + AUTH_CONFIG.SECRET_SUFFIX); // Simple signature
    
    const secureToken = `${encodedToken}.${signature}`;
    
    console.log('🔐 Secure token generated for user:', user.username);
    return secureToken;
  }

  /**
   * Verify and decode token
   * @param {string} token - Token to verify
   * @returns {Object|null} Decoded token data or null if invalid
   */
  verifyToken(token) {
    try {
      if (!token || !token.includes('.')) {
        console.log('❌ Invalid token format');
        return null;
      }

      const [encodedToken, signature] = token.split('.');
      
      // Verify signature
      const expectedSignature = btoa(encodedToken + AUTH_CONFIG.SECRET_SUFFIX);
      if (signature !== expectedSignature) {
        console.log('❌ Token signature verification failed');
        return null;
      }

      // Decode token data
      const tokenString = atob(encodedToken);
      const tokenData = JSON.parse(tokenString);

      // Check expiration
      const expiresAt = new Date(tokenData.expiresAt);
      const now = new Date();
      
      if (now > expiresAt) {
        console.log('🕐 Token has expired');
        return null;
      }

      console.log('✅ Token verified successfully');
      return tokenData;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return null;
    }
  }

  /**
   * Authenticate user and return secure token
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {boolean} rememberMe - Whether to set persistent cookies
   * @returns {Object} Authentication result with token
   */
  async authenticateUser(username, password, rememberMe = false) {
    try {
      console.log('🔐 Starting authentication for:', username);
      
      let user = null;
      
      // Check if Google Sheets is configured
      if (isGoogleSheetsConfigured()) {
        console.log('📊 Using Google Sheets authentication...');
        user = await googleSheetsService.authenticateUser(username.trim(), password);
      } else {
        console.log('🧪 Using mock authentication...');
        user = mockAuthenticate(username.trim(), password);
      }

      if (!user) {
        console.log('❌ Authentication failed - invalid credentials');
        return {
          success: false,
          error: 'Invalid username or password'
        };
      }

      // Generate secure token
      const token = this.generateToken(user);

      // Store token in cookies
      const cookieOptions = {
        secure: window.location.protocol === 'https:', // Only secure in HTTPS
        sameSite: 'strict',
        expires: rememberMe ? AUTH_CONFIG.EXPIRES_HOURS / 24 : undefined // Convert hours to days
      };

      Cookies.set(AUTH_CONFIG.TOKEN_NAME, token, cookieOptions);

      // Store current user and login time
      this.currentUser = user;
      this.loginTime = new Date();

      console.log('✅ Authentication successful');
      
      return {
        success: true,
        user: user,
        token: token
      };

    } catch (error) {
      console.error('💥 Authentication error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    }
  }

  /**
   * Get current authenticated user from token
   * @returns {Object|null} Current user data or null
   */
  getCurrentUser() {
    // First check if we have user in memory
    if (this.currentUser && this.loginTime) {
      // Check if session is still valid (not expired)
      const sessionAge = Date.now() - this.loginTime.getTime();
      const maxAge = AUTH_CONFIG.EXPIRES_HOURS * 60 * 60 * 1000;
      
      if (sessionAge < maxAge) {
        return this.currentUser;
      }
    }

    // Check for token in cookies
    const token = Cookies.get(AUTH_CONFIG.TOKEN_NAME);
    if (token) {
      const tokenData = this.verifyToken(token);
      if (tokenData) {
        this.currentUser = {
          username: tokenData.username,
          accountName: tokenData.accountName,
          balance: tokenData.balance,
          isAuthenticated: true
        };
        this.loginTime = new Date(tokenData.loginTime);
        return this.currentUser;
      }
    }

    return null;
  }

  /**
   * Check if user is currently authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Get updated user balance from Excel/Google Sheets
   * @returns {string} Updated balance
   */
  async refreshUserBalance() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      let newBalance = '0';
      
      if (isGoogleSheetsConfigured()) {
        newBalance = await googleSheetsService.getUserBalance(currentUser.username);
      } else {
        // Mock balance update
        const mockUsers = [
          { username: 'demo', balance: '5000.00' },
          { username: 'test', balance: '2500.50' },
          { username: 'admin', balance: '10000.00' }
        ];
        const user = mockUsers.find(u => u.username === currentUser.username);
        newBalance = user ? user.balance : '0';
      }

      // Update current user balance
      this.currentUser.balance = newBalance;

      // Generate new token with updated balance
      const newToken = this.generateToken(this.currentUser);
      
      // Update cookie
      Cookies.set(AUTH_CONFIG.TOKEN_NAME, newToken, {
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });

      console.log('💰 User balance refreshed:', newBalance);
      return newBalance;

    } catch (error) {
      console.error('💥 Balance refresh error:', error);
      throw error;
    }
  }

  /**
   * Sign out user and clear tokens
   */
  signOut() {
    console.log('👋 Signing out user');
    
    // Clear cookie
    Cookies.remove(AUTH_CONFIG.TOKEN_NAME);
    
    // Clear memory
    this.currentUser = null;
    this.loginTime = null;
    
    console.log('✅ User signed out successfully');
  }

  /**
   * Get token expiration time
   * @returns {Date|null} Expiration date or null
   */
  getTokenExpiration() {
    const token = Cookies.get(AUTH_CONFIG.TOKEN_NAME);
    if (!token) return null;

    try {
      const tokenData = this.verifyToken(token);
      return tokenData ? new Date(tokenData.expiresAt) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token will expire soon (within 1 hour)
   * @returns {boolean} True if token expires soon
   */
  isTokenExpiringSoon() {
    const expiration = this.getTokenExpiration();
    if (!expiration) return false;

    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    return expiration < oneHourFromNow;
  }

  /**
   * Get session info for display
   * @returns {Object} Session information
   */
  getSessionInfo() {
    const user = this.getCurrentUser();
    const expiration = this.getTokenExpiration();
    
    return {
      isAuthenticated: !!user,
      user: user,
      expiresAt: expiration,
      expiresSoon: this.isTokenExpiringSoon()
    };
  }
}

// Create and export singleton instance
const simpleAuthService = new SimpleAuthService();
export default simpleAuthService;