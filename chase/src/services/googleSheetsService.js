import axios from 'axios';
import { GOOGLE_SHEETS_CONFIG } from '../config/googleSheets';

class GoogleSheetsService {
  constructor() {
    this.baseURL = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values`;
  }

  /**
   * Fetch user data from Google Sheets
   * Expected sheet structure:
   * Column A: Username
   * Column B: Password
   * Column C: Balance
   * Column D: Account Name/Full Name
   */
  async fetchUserData() {
    try {
      const url = `${this.baseURL}/${GOOGLE_SHEETS_CONFIG.RANGE}`;
      console.log('Fetching data from URL:', url);
      console.log('Using API Key:', GOOGLE_SHEETS_CONFIG.API_KEY ? 'API Key is set' : 'API Key is missing');
      console.log('Sheet ID:', GOOGLE_SHEETS_CONFIG.SHEET_ID);
      
      const response = await axios.get(url, {
        params: {
          key: GOOGLE_SHEETS_CONFIG.API_KEY,
        },
      });

      console.log('Google Sheets API Response:', response.data);

      if (response.data && response.data.values) {
        // Skip header row and convert to user objects
        const users = response.data.values.slice(1).map(row => ({
          username: row[0] || '',
          password: row[1] || '',
          balance: row[2] || '0',
          accountName: row[3] || '',
        }));
        
        console.log('Parsed users:', users);
        return users;
      }
      
      console.log('No data found in response');
      return [];
    } catch (error) {
      console.error('Error fetching user data from Google Sheets:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error('Failed to fetch user data. Please try again later.');
    }
  }

  /**
   * Authenticate user credentials
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Object|null} User data if authenticated, null if not
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
   * @param {string} username - User's username
   * @returns {string} User's balance
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
}

// Create and export a singleton instance
const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;

// Export configuration for easy setup
export const setupGoogleSheets = (sheetId, apiKey, range = 'Sheet1!A:D') => {
  GOOGLE_SHEETS_CONFIG.SHEET_ID = sheetId;
  GOOGLE_SHEETS_CONFIG.API_KEY = apiKey;
  GOOGLE_SHEETS_CONFIG.RANGE = range;
};