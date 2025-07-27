import { GOOGLE_SHEETS_CONFIG } from '../config/googleSheets';

class GoogleSheetsOAuthService {
  constructor() {
    this.gapi = null;
    this.tokenClient = null;
    this.isInitialized = false;
    this.accessToken = null;
  }

  /**
   * Initialize Google API and OAuth
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load Google Identity Services
      await this.loadGoogleIdentityServices();
      
      // Load Google API
      await this.loadGoogleAPI();
      
      // Initialize Google API client
      await new Promise((resolve, reject) => {
        window.gapi.load('client', {
          callback: resolve,
          onerror: reject
        });
      });

      await window.gapi.client.init({
        discoveryDocs: [GOOGLE_SHEETS_CONFIG.DISCOVERY_DOC],
      });

      // Initialize OAuth token client
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_SHEETS_CONFIG.CLIENT_ID,
        scope: GOOGLE_SHEETS_CONFIG.SCOPES.join(' '),
        callback: (response) => {
          if (response.error) {
            console.error('OAuth error:', response.error);
            return;
          }
          this.accessToken = response.access_token;
          console.log('OAuth token received successfully');
        },
      });

      this.isInitialized = true;
      console.log('Google Sheets OAuth service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Sheets OAuth service:', error);
      throw error;
    }
  }

  /**
   * Load Google Identity Services script
   */
  loadGoogleIdentityServices() {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Load Google API script
   */
  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Request OAuth token
   */
  async requestAccessToken() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      try {
        // Set up callback for token response
        this.tokenClient.callback = (response) => {
          if (response.error) {
            reject(new Error(response.error));
            return;
          }
          this.accessToken = response.access_token;
          window.gapi.client.setToken({ access_token: this.accessToken });
          resolve(this.accessToken);
        };

        // Request token
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.accessToken && window.gapi?.client?.getToken();
  }

  /**
   * Fetch user data from Google Sheets
   */
  async fetchUserData() {
    try {
      if (!this.isAuthenticated()) {
        await this.requestAccessToken();
      }

      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.SHEET_ID,
        range: GOOGLE_SHEETS_CONFIG.RANGE,
      });

      if (response.result && response.result.values) {
        // Skip header row and convert to user objects
        const users = response.result.values.slice(1).map(row => ({
          username: row[0] || '',
          password: row[1] || '',
          balance: row[2] || '0',
          accountName: row[3] || '',
        }));
        
        console.log('Fetched users from Google Sheets:', users);
        return users;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching user data from Google Sheets:', error);
      
      // If it's an auth error, clear the token and try again
      if (error.status === 401 || error.status === 403) {
        this.accessToken = null;
        window.gapi.client.setToken(null);
        throw new Error('Authentication failed. Please try logging in again.');
      }
      
      throw new Error('Failed to fetch user data. Please try again later.');
    }
  }

  /**
   * Authenticate user credentials
   */
  async authenticateUser(username, password) {
    try {
      const users = await this.fetchUserData();
      
      // Find user with matching credentials
      const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === password
      );

      if (user) {
        // Return user data without password for security
        return {
          username: user.username,
          balance: user.balance,
          accountName: user.accountName,
          isAuthenticated: true,
        };
      }

      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  /**
   * Get user balance by username
   */
  async getUserBalance(username) {
    try {
      const users = await this.fetchUserData();
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      return user ? user.balance : '0';
    } catch (error) {
      console.error('Error fetching user balance:', error);
      throw error;
    }
  }

  /**
   * Sign out and revoke access token
   */
  signOut() {
    if (this.accessToken) {
      window.google.accounts.oauth2.revoke(this.accessToken);
      this.accessToken = null;
      window.gapi.client.setToken(null);
      console.log('User signed out successfully');
    }
  }
}

// Create and export a singleton instance
const googleSheetsOAuthService = new GoogleSheetsOAuthService();
export default googleSheetsOAuthService;