# Google Sheets Authentication Setup Guide

This guide will help you set up Google Sheets integration for user authentication and balance management in your Chase banking app.

## 📋 Prerequisites

- A Google account
- Access to Google Cloud Console
- A Google Sheet with user data

## 🔧 Step-by-Step Setup

### 1. Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Set up your sheet with the following structure:

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Username | Password | Balance  | Account Name |
| john123  | pass123  | 5000.00  | John Doe |
| mary456  | mypass   | 2500.50  | Mary Smith |
| admin    | admin123 | 10000.00 | Administrator |

**Important Notes:**
- Row 1 should contain headers
- Username should be unique for each user
- Balance should be a number (no currency symbols)
- Account Name is the display name for the user

### 2. Get Your Google Sheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
3. Copy the `SHEET_ID` part (the long string between `/d/` and `/edit`)

Example: If your URL is:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```
Your Sheet ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### 3. Make Your Sheet Publicly Readable

1. Click the "Share" button in your Google Sheet
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Click "Done"

**Security Note:** This makes your sheet readable by anyone with the link. For production use, consider setting up proper OAuth authentication.

### 4. Get a Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
5. (Recommended) Restrict your API key:
   - Click on your API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Sheets API"
   - Save

### 5. Configure Your Application

1. Open `src/config/googleSheets.js`
2. Replace the placeholder values:

```javascript
export const GOOGLE_SHEETS_CONFIG = {
  // Replace with your actual Google Sheet ID
  SHEET_ID: 'YOUR_ACTUAL_SHEET_ID_HERE',
  
  // Replace with your actual Google API Key
  API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
  
  // Adjust if your data is in different columns/sheet
  RANGE: 'Sheet1!A:D',
  
  BASE_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
};
```

### 6. Test Your Setup

1. Start your React application: `npm start`
2. Go to the login page
3. Try logging in with one of the usernames/passwords from your sheet
4. If successful, you should be redirected to the banking dashboard with the user's balance displayed

## 🔍 Troubleshooting

### Common Issues:

1. **"Google Sheets integration is not configured properly"**
   - Check that you've updated both SHEET_ID and API_KEY in the config file
   - Make sure there are no extra spaces or quotes

2. **"Failed to fetch user data"**
   - Verify your Google Sheet is publicly readable
   - Check that your API key is correct and has Google Sheets API enabled
   - Ensure your sheet ID is correct

3. **"Invalid username or password"**
   - Check that your sheet has the correct structure (Username in column A, Password in column B)
   - Verify the username/password combination exists in your sheet
   - Make sure there are no extra spaces in your sheet data

4. **CORS errors**
   - This shouldn't happen with Google Sheets API, but if it does, make sure you're using the correct API endpoint

### Testing Your Configuration:

You can test if your Google Sheets API is working by visiting this URL in your browser:
```
https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A:D?key=YOUR_API_KEY
```

Replace `YOUR_SHEET_ID` and `YOUR_API_KEY` with your actual values. You should see your sheet data in JSON format.

## 🔒 Security Considerations

### For Development:
- The current setup is fine for development and testing
- Your sheet is publicly readable but not writable

### For Production:
Consider implementing:
- OAuth 2.0 authentication instead of API keys
- Server-side authentication to hide API credentials
- Encrypted password storage (currently passwords are stored in plain text)
- Rate limiting to prevent abuse
- Input validation and sanitization

## 📝 Sample Data Format

Here's a sample of how your Google Sheet should look:

```
| Username | Password | Balance | Account Name    |
|----------|----------|---------|-----------------|
| john123  | pass123  | 5000.00 | John Doe        |
| mary456  | mypass   | 2500.50 | Mary Smith      |
| admin    | admin123 | 10000.00| Administrator   |
| demo     | demo     | 1000.00 | Demo User       |
```

## 🎯 Features

Once set up, your application will support:

- ✅ User authentication against Google Sheets data
- ✅ Balance display from Google Sheets
- ✅ Error handling for invalid credentials
- ✅ Session management (Remember Me functionality)
- ✅ Balance refresh functionality
- ✅ Secure logout
- ✅ Loading states and user feedback

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Google Sheets setup
3. Test the API URL directly in your browser
4. Ensure all configuration values are correct

Happy banking! 🏦