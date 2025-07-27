import * as jose from 'jose';
import Cookies from 'js-cookie';
import googleSheetsService from './googleSheetsService';
import { mockAuthenticate, isGoogleSheetsConfigured } from '../utils/debugLogin';

// JWT Configuration
const JWT_CONFIG = {
  // In production, this should be an environment variable
  SECRET_KEY: new TextEncoder().encode('chase-banking-app-secret-key-2024-browser-compatible'),
  EXPIRES_IN: '24h', // Token expires in 24 hours
  COOKIE_NAME: 'chase_auth_token',
  REFRESH_COOKIE_NAME: 'chase_refresh_token',
  ALGORITHM: 'HS256'
};

class JWTAuthService {
  constructor() {
    this.currentUser = null;
    this.token = null;
  }

  /**
   * Generate JWT token for authenticated user
   * @param {Object} user - User data
   * @returns {Promise<string>} JWT token
   */
  async generateToken(user) {
    const payload = {
      userId: user.username,
      username: user.username,
      accountName: user.accountName,
      balance: user.balance,
      loginTime: new Date().toISOString(),
      iss: 'chase-banking-app',
      aud: 'chase-users'
    };

    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: JWT_CONFIG.ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_CONFIG.SECRET_KEY);

    console.log('🔐 JWT token generated for user:', user.username);
    return token;
  }

  /**
   * Generate refresh token (longer expiry)
   * @param {Object} user - User data
   * @returns {Promise<string>} Refresh token
   */
  async generateRefreshToken(user) {
    const payload = {
      userId: user.username,
      type: 'refresh',
      iss: 'chase-banking-app',
      aud: 'chase-users'
    };

    const refreshToken = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: JWT_CONFIG.ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_CONFIG.SECRET_KEY);

    return refreshToken;
  }

  /**
   * Verify and decode JWT token
   * @param {string} token - JWT token to verify
   * @returns {Promise<Object|null>} Decoded token payload or null if invalid
   */
  async verifyToken(token) {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_CONFIG.SECRET_KEY, {
        issuer: 'chase-banking-app',
        audience: 'chase-users'
      });

      console.log('✅ JWT token verified successfully');
      return payload;
    } catch (error) {
      console.error('❌ JWT token verification failed:', error.message);
      
      if (error.code === 'ERR_JWT_EXPIRED') {
        console.log('🕐 Token has expired');
      } else if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        console.log('🔒 Invalid token signature');
      }
      
      return null;
    }
  }

  /**
   * Authenticate user and return JWT token
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {boolean} rememberMe - Whether to set persistent cookies
   * @returns {Object} Authentication result with token
   */
  async authenticateUser(username, password, rememberMe = false) {
    try {
      console.log('🔐 Starting JWT authentication for:', username);
      
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

      // Generate JWT tokens
      const accessToken = await this.generateToken(user);
      const refreshToken = await this.generateRefreshToken(user);

      // Store tokens in cookies
      const cookieOptions = {
        secure: window.location.protocol === 'https:', // Only secure in HTTPS
        sameSite: 'strict',
        expires: rememberMe ? 7 : undefined // 7 days if remember me, session cookie otherwise
      };

      Cookies.set(JWT_CONFIG.COOKIE_NAME, accessToken, cookieOptions);
      Cookies.set(JWT_CONFIG.REFRESH_COOKIE_NAME, refreshToken, {
        ...cookieOptions,
        expires: 7 // Refresh token always expires in 7 days
      });

      // Store current user and token
      this.currentUser = user;
      this.token = accessToken;

      console.log('✅ JWT authentication successful');
      
      return {
        success: true,
        user: user,
        token: accessToken,
        refreshToken: refreshToken
      };

    } catch (error) {
      console.error('💥 JWT authentication error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    }
  }

  /**
   * Get current authenticated user from token
   * @returns {Promise<Object|null>} Current user data or null
   */
  async getCurrentUser() {
    // First check if we have user in memory
    if (this.currentUser && this.token) {
      const decoded = await this.verifyToken(this.token);
      if (decoded) {
        return this.currentUser;
      }
    }

    // Check for token in cookies
    const token = Cookies.get(JWT_CONFIG.COOKIE_NAME);
    if (token) {
      const decoded = await this.verifyToken(token);
      if (decoded) {
        this.token = token;
        this.currentUser = {
          username: decoded.username,
          accountName: decoded.accountName,
          balance: decoded.balance,
          isAuthenticated: true
        };
        return this.currentUser;
      }
    }

    return null;
  }

  /**
   * Check if user is currently authenticated
   * @returns {Promise<boolean>} True if authenticated
   */
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  /**
   * Refresh access token using refresh token
   * @returns {Object} Refresh result
   */
  async refreshAccessToken() {
    try {
      const refreshToken = Cookies.get(JWT_CONFIG.REFRESH_COOKIE_NAME);
      
      if (!refreshToken) {
        console.log('❌ No refresh token found');
        return { success: false, error: 'No refresh token' };
      }

      const decoded = await this.verifyToken(refreshToken);
      if (!decoded || decoded.type !== 'refresh') {
        console.log('❌ Invalid refresh token');
        return { success: false, error: 'Invalid refresh token' };
      }

      // Get fresh user data
      let user = null;
      if (isGoogleSheetsConfigured()) {
        // In a real app, you'd store user data securely and fetch it by ID
        // For now, we'll use the username from the token
        const users = await googleSheetsService.fetchUserData();
        user = users.find(u => u.username === decoded.userId);
      } else {
        // Mock user data
        const mockUsers = [
          { username: 'demo', balance: '5000.00', accountName: 'Demo User' },
          { username: 'test', balance: '2500.50', accountName: 'Test User' },
          { username: 'admin', balance: '10000.00', accountName: 'Administrator' }
        ];
        user = mockUsers.find(u => u.username === decoded.userId);
      }

      if (!user) {
        console.log('❌ User not found during refresh');
        return { success: false, error: 'User not found' };
      }

      // Generate new access token
      const newAccessToken = await this.generateToken(user);
      
      // Update cookie
      Cookies.set(JWT_CONFIG.COOKIE_NAME, newAccessToken, {
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });

      this.token = newAccessToken;
      this.currentUser = user;

      console.log('✅ Access token refreshed successfully');
      
      return {
        success: true,
        token: newAccessToken,
        user: user
      };

    } catch (error) {
      console.error('💥 Token refresh error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get updated user balance from Excel/Google Sheets
   * @returns {string} Updated balance
   */
  async refreshUserBalance() {
    try {
      const currentUser = await this.getCurrentUser();
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
      const newToken = await this.generateToken(this.currentUser);
      
      // Update cookie
      Cookies.set(JWT_CONFIG.COOKIE_NAME, newToken, {
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });

      this.token = newToken;

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
    
    // Clear cookies
    Cookies.remove(JWT_CONFIG.COOKIE_NAME);
    Cookies.remove(JWT_CONFIG.REFRESH_COOKIE_NAME);
    
    // Clear memory
    this.currentUser = null;
    this.token = null;
    
    console.log('✅ User signed out successfully');
  }

  /**
   * Get token expiration time
   * @returns {Promise<Date|null>} Expiration date or null
   */
  async getTokenExpiration() {
    const token = this.token || Cookies.get(JWT_CONFIG.COOKIE_NAME);
    if (!token) return null;

    try {
      const decoded = await this.verifyToken(token);
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token will expire soon (within 5 minutes)
   * @returns {Promise<boolean>} True if token expires soon
   */
  async isTokenExpiringSoon() {
    const expiration = await this.getTokenExpiration();
    if (!expiration) return false;

    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expiration < fiveMinutesFromNow;
  }
}

// Create and export singleton instance
const jwtAuthService = new JWTAuthService();
export default jwtAuthService;