# Google Sheets OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Chase banking app to access Google Sheets data.

## 🎯 **Current Configuration Status**

✅ **OAuth Client ID**: Already configured  
✅ **Sheet ID**: Already configured  
⚠️ **OAuth Consent Screen**: Needs to be set up  
⚠️ **Sheet Permissions**: Needs to be configured  

## 📋 **Your Current Settings**

- **Sheet ID**: `1Oeyo9uHJXH8SXDMyLMGfmEtv2Gv0b8KX31ZOYhBFkBQ`
- **Client ID**: `624178062932-9u5issmcd57072624qkaf21d32cfseo2.apps.googleusercontent.com`

## 🔧 **Setup Steps**

### 1. Configure OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **"APIs & Services" > "OAuth consent screen"**
4. Choose **"External"** (unless you have a Google Workspace account)
5. Fill in the required information:
   - **App name**: "Chase Banking App" (or your preferred name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
6. Click **"Save and Continue"**
7. On the **Scopes** page, click **"Add or Remove Scopes"**
8. Add this scope: `https://www.googleapis.com/auth/spreadsheets.readonly`
9. Click **"Save and Continue"**
10. On **Test users**, add your email address
11. Click **"Save and Continue"**

### 2. Configure Your Google Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1Oeyo9uHJXH8SXDMyLMGfmEtv2Gv0b8KX31ZOYhBFkBQ/edit
2. Set up your sheet with this structure:

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Username | Password | Balance  | Account Name |
| demo     | demo     | 5000.00  | Demo User |
| test     | test     | 2500.50  | Test User |
| admin    | admin    | 10000.00 | Administrator |

3. **Important**: The sheet doesn't need to be publicly shared for OAuth (unlike API key method)

### 3. Enable Google Sheets API

1. In Google Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google Sheets API"**
3. Click on it and press **"Enable"**

### 4. Configure Authorized Origins

1. Go to **"APIs & Services" > "Credentials"**
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized JavaScript origins"**, add:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
4. Under **"Authorized redirect URIs"**, add:
   - `http://localhost:3000`
5. Click **"Save"**

## 🧪 **Test Your Setup**

1. Start your React app: `npm start`
2. Go to the login page: `http://localhost:3000/login`
3. Try logging in with these test credentials:
   - **Username**: `demo` **Password**: `demo`
   - **Username**: `test` **Password**: `test`
   - **Username**: `admin` **Password**: `admin`

### What Should Happen:

1. **First time**: You'll see a Google OAuth popup asking for permission
2. **Grant permission** to access your Google Sheets
3. **Login should succeed** and redirect to the banking dashboard
4. **Balance should display** from your Google Sheet

## 🔍 **Troubleshooting**

### Common Issues:

1. **"OAuth consent screen not configured"**
   - Complete the OAuth consent screen setup above
   - Make sure to add your email as a test user

2. **"Unauthorized JavaScript origin"**
   - Add `http://localhost:3000` to authorized origins
   - Wait a few minutes for changes to take effect

3. **"Access blocked: This app's request is invalid"**
   - Check that Google Sheets API is enabled
   - Verify your OAuth consent screen is properly configured

4. **"Permission denied"**
   - Make sure you're logged into Google with the same account that owns the sheet
   - Check that your email is added as a test user in OAuth consent screen

5. **"Sheet not found"**
   - Verify the Sheet ID in the URL matches your configuration
   - Make sure you have access to the sheet with your Google account

## 🎯 **Testing Steps**

### Step 1: Test Mock Authentication (Should Work Now)
```
Username: demo
Password: demo
```
This should work immediately and show you the banking dashboard.

### Step 2: Test OAuth Authentication
After completing the OAuth setup above, the same credentials should work but will:
1. Show a Google OAuth popup (first time)
2. Request permission to access your sheets
3. Fetch real data from your Google Sheet

## 📊 **Expected Sheet Data Format**

Make sure your Google Sheet looks exactly like this:

```
Row 1: Username | Password | Balance | Account Name
Row 2: demo     | demo     | 5000.00 | Demo User
Row 3: test     | test     | 2500.50 | Test User
Row 4: admin    | admin    | 10000.00| Administrator
```

## 🔒 **Security Notes**

- OAuth is more secure than API keys
- Users must grant permission to access their sheets
- Access tokens are temporary and can be revoked
- No need to make sheets publicly readable

## 📞 **Quick Test**

Right now, try logging in with `demo/demo` - this should work with mock data and show you the banking dashboard. Once you complete the OAuth setup, the same login will fetch real data from your Google Sheet.

## 🚀 **Next Steps**

1. Complete the OAuth consent screen setup
2. Test with mock data first (`demo/demo`)
3. Complete OAuth setup for real Google Sheets data
4. Add more users to your sheet as needed

The app is ready to use! The OAuth integration will seamlessly switch from mock data to real Google Sheets data once you complete the setup.