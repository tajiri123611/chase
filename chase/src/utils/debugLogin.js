// Debug utility to test login without Google Sheets
export const mockUserData = [
  {
    username: 'demo',
    password: 'demo',
    balance: '5000.00',
    accountName: 'Demo User'
  },
  {
    username: 'test',
    password: 'test',
    balance: '2500.50',
    accountName: 'Test User'
  },
  {
    username: 'admin',
    password: 'admin',
    balance: '10000.00',
    accountName: 'Administrator'
  }
];

export const mockAuthenticate = (username, password) => {
  const user = mockUserData.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && 
    u.password === password
  );

  if (user) {
    return {
      username: user.username,
      balance: user.balance,
      accountName: user.accountName,
      isAuthenticated: true,
    };
  }

  return null;
};

// Function to check if Google Sheets API is properly configured
export const isGoogleSheetsConfigured = () => {
  const { GOOGLE_SHEETS_CONFIG } = require('../config/googleSheets');
  
  return (
    GOOGLE_SHEETS_CONFIG.API_KEY && 
    GOOGLE_SHEETS_CONFIG.API_KEY !== 'YOUR_ACTUAL_API_KEY_HERE' &&
    GOOGLE_SHEETS_CONFIG.SHEET_ID &&
    GOOGLE_SHEETS_CONFIG.SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID_HERE'
  );
};