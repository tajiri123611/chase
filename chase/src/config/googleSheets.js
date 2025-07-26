// Google Sheets Configuration
// Follow these steps to set up your Google Sheets integration:

/*
API KEY SETUP INSTRUCTIONS:

1. Create a Google Sheet with the following structure:
   Column A: Username
   Column B: Password  
   Column C: Balance
   Column D: Account Name/Full Name

   Example:
   | Username | Password | Balance | Account Name |
   |----------|----------|---------|--------------|
   | john123  | pass123  | 5000.00 | John Doe     |
   | mary456  | mypass   | 2500.50 | Mary Smith   |

2. Get your Google Sheet ID:
   - Open your Google Sheet
   - Copy the ID from the URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   
3. Get a Google API Key:
   - Go to Google Cloud Console (https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Sheets API
   - Create credentials (API Key)
   - Restrict the API key to Google Sheets API for security

4. Make your sheet publicly readable:
   - Click "Share" in your Google Sheet
   - Change access to "Anyone with the link can view"
   - Or set up proper authentication for private sheets

5. Update the configuration below:
*/

export const GOOGLE_SHEETS_CONFIG = {
  // Replace with your actual Google Sheet ID
  SHEET_ID: '1Oeyo9uHJXH8SXDMyLMGfmEtv2Gv0b8KX31ZOYhBFkBQ',

  // Replace with your actual Google API Key (should start with AIzaSy...)
  API_KEY: 'AIzaSyAaqpkfKlML6nUVP7G1zo8FfO_RruORVUI',

  // Sheet range (adjust if your data is in different columns/sheet)
  RANGE: 'Sheet1!A:D',

  // Base URL for Google Sheets API
  BASE_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
};

// Validation function to check if API key configuration is set up
export const validateConfig = () => {
  const errors = [];

  if (!GOOGLE_SHEETS_CONFIG.SHEET_ID || GOOGLE_SHEETS_CONFIG.SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
    errors.push('Google Sheet ID is not configured');
  }

  if (!GOOGLE_SHEETS_CONFIG.API_KEY || GOOGLE_SHEETS_CONFIG.API_KEY === 'YOUR_ACTUAL_API_KEY_HERE') {
    errors.push('Google API Key is not configured');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to update configuration at runtime
export const updateConfig = (sheetId, apiKey, range = 'Sheet1!A:D') => {
  GOOGLE_SHEETS_CONFIG.SHEET_ID = sheetId;
  GOOGLE_SHEETS_CONFIG.API_KEY = apiKey;
  GOOGLE_SHEETS_CONFIG.RANGE = range;
};