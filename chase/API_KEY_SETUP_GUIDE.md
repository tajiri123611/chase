# Google Sheets API Key Setup Guide

This is the simplified guide to get your Google Sheets integration working with an API key.

## 🎯 **Current Status**

✅ **Sheet ID**: Already configured (`1Oeyo9uHJXH8SXDMyLMGfmEtv2Gv0b8KX31ZOYhBFkBQ`)  
⚠️ **API Key**: Needs to be configured  
⚠️ **Sheet Access**: Needs to be made public  

## 🔧 **Quick Setup (5 minutes)**

### Step 1: Get Your Google API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing):
   - Click "Select a project" → "New Project"
   - Name it "Chase Banking App" (or anything you like)
   - Click "Create"

3. **Enable Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (it looks like: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

5. **Restrict the API Key** (recommended):
   - Click on your API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Sheets API"
   - Click "Save"

### Step 2: Make Your Google Sheet Public

1. **Open your Google Sheet**: https://docs.google.com/spreadsheets/d/1Oeyo9uHJXH8SXDMyLMGfmEtv2Gv0b8KX31ZOYhBFkBQ/edit
2. **Click "Share"** (top right)
3. **Change access**:
   - Click "Change to anyone with the link"
   - Set permission to "Viewer"
   - Click "Done"

### Step 3: Set Up Your Sheet Data

Make sure your Google Sheet has this exact structure:

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Username | Password | Balance  | Account Name |
| demo     | demo     | 5000.00  | Demo User |
| test     | test     | 2500.50  | Test User |
| admin    | admin    | 10000.00 | Administrator |

**Important**: 
- Row 1 must be headers
- No extra spaces in the data
- Balance should be numbers only (no $ signs)

### Step 4: Update Your Configuration

1. **Open** `src/config/googleSheets.js`
2. **Replace** `'YOUR_ACTUAL_API_KEY_HERE'` with your actual API key:

```javascript
export const GOOGLE_SHEETS_CONFIG = {
  SHEET_ID: '1Oeyo9uHJXH8SXDMyLMGfmEtv2Gv0b8KX31ZOYhBFkBQ',
  
  // Replace this with your actual API key
  API_KEY: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  
  RANGE: 'Sheet1!A:D',
  BASE_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
};
```

## 🧪 **Test Your Setup**

### Method 1: Test in Browser
Visit this URL in your browser (replace `YOUR_API_KEY` with your actual key):

```
https://sheets.googleapis.com/v4/spreadsheets/1Oeyo9uHJXH8SXDMyLMGfmEtv2Gv0b8KX31ZOYhBFkBQ/values/Sheet1!A:D?key=YOUR_API_KEY
```

You should see your sheet data in JSON format.

### Method 2: Test in Your App
1. **Start your app**: `npm start`
2. **Go to login page**: `http://localhost:3000/login`
3. **Click "Test Google Sheets Connection"** button
4. **Check browser console** (F12) for results

### Method 3: Try Login
Once the API key is configured, try logging in with:
- Username: `demo`
- Password: `demo`

## 🔍 **Troubleshooting**

### "API key not valid"
- Make sure you copied the entire API key
- Check that Google Sheets API is enabled
- Verify the API key restrictions allow Google Sheets API

### "The caller does not have permission"
- Make sure your Google Sheet is shared as "Anyone with the link can view"
- Check that you're using the correct Sheet ID

### "Requested entity was not found"
- Verify your Sheet ID is correct
- Make sure the sheet exists and is accessible

### "Mock authentication working but not Google Sheets"
- This means your API key setup needs to be completed
- Follow the steps above to get your API key

## 🎯 **Quick Test Right Now**

Even without the API key, you can test the login flow:

1. **Go to**: `http://localhost:3000/login`
2. **Login with**: `demo` / `demo`
3. **You should see**: Banking dashboard with $5,000 balance (mock data)

Once you add the API key, the same login will fetch real data from your Google Sheet!

## 📊 **Expected Results**

After setup, when you login with `demo/demo`:
- **Mock mode** (no API key): Shows $5,000 balance
- **Google Sheets mode** (with API key): Shows balance from your sheet

## 🚀 **Next Steps**

1. **Get your API key** from Google Cloud Console
2. **Make your sheet public**
3. **Update the configuration** with your API key
4. **Test the login** - it should work with real Google Sheets data!

The app will automatically switch from mock data to real Google Sheets data once you add the API key.