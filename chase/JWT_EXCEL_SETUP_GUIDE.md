# JWT Authentication with Excel/Google Sheets Setup Guide

This guide explains how to use JWT (JSON Web Token) authentication with Excel/Google Sheets as your user database for secure login.

## 🔐 **What is JWT Authentication?**

JWT (JSON Web Token) is a secure way to authenticate users that provides:
- **Stateless authentication** - No server-side session storage needed
- **Secure tokens** - Cryptographically signed tokens
- **Automatic expiration** - Tokens expire after a set time
- **Refresh capability** - Tokens can be refreshed without re-login
- **Cookie-based storage** - Secure HTTP-only cookies (in production)

## 🎯 **Current Setup Status**

✅ **JWT Service**: Fully implemented and working  
✅ **Excel/Google Sheets Integration**: Working with JWT  
✅ **Token Management**: Automatic refresh and expiration  
✅ **Secure Storage**: Browser cookies with security flags  
✅ **Mock Data Fallback**: Works without Google Sheets setup  

## 🔧 **How It Works**

### 1. **User Login Process**
```
1. User enters username/password
2. System validates credentials against Excel/Google Sheets
3. If valid, JWT token is generated and signed
4. Token is stored in secure browser cookies
5. User is redirected to banking dashboard
```

### 2. **JWT Token Structure**
Your JWT token contains:
```json
{
  "userId": "demo",
  "username": "demo", 
  "accountName": "Demo User",
  "balance": "5000.00",
  "loginTime": "2024-01-15T10:30:00.000Z",
  "exp": 1705401000,
  "iss": "chase-banking-app",
  "aud": "chase-users"
}
```

### 3. **Security Features**
- **Token Expiration**: 24 hours (configurable)
- **Refresh Tokens**: 7 days (for automatic renewal)
- **Secure Cookies**: HTTP-only, SameSite=strict
- **Automatic Refresh**: Tokens refresh when expiring soon
- **Signature Verification**: Prevents token tampering

## 🧪 **Test JWT Authentication**

### Test Credentials:
- **Username**: `demo` **Password**: `demo` (Balance: $5,000)
- **Username**: `test` **Password**: `test` (Balance: $2,500)  
- **Username**: `admin` **Password**: `admin` (Balance: $10,000)

### Test Locations:
1. **Homepage**: `http://localhost:3000/` - Login form in hero section
2. **Login Page**: `http://localhost:3000/login` - Dedicated login page

### What Happens:
1. **Login**: JWT token is generated and stored in cookies
2. **Dashboard**: Shows user balance from Excel/Google Sheets
3. **Token Refresh**: Automatically refreshes when expiring
4. **Logout**: Clears all tokens and cookies

## 📊 **Excel/Google Sheets Setup**

### Option 1: Google Sheets (Recommended)
1. **Create Google Sheet** with this structure:

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Username | Password | Balance  | Account Name |
| demo     | demo     | 5000.00  | Demo User |
| test     | test     | 2500.50  | Test User |
| admin    | admin    | 10000.00 | Administrator |

2. **Get API Key** from Google Cloud Console
3. **Update Configuration** in `src/config/googleSheets.js`:
```javascript
export const GOOGLE_SHEETS_CONFIG = {
  SHEET_ID: 'your-sheet-id',
  API_KEY: 'your-api-key',
  RANGE: 'Sheet1!A:D'
};
```

### Option 2: Mock Data (For Testing)
If Google Sheets isn't configured, the system automatically uses mock data:
- No setup required
- Works immediately
- Perfect for development and testing

## 🔍 **JWT Features in Action**

### 1. **Login with JWT**
```javascript
// Both homepage and login page use JWT
const authResult = await jwtAuthService.authenticateUser(
  username, 
  password, 
  rememberMe
);

if (authResult.success) {
  // JWT token generated and stored
  // User redirected to dashboard
}
```

### 2. **Automatic Token Validation**
```javascript
// Banking page automatically checks JWT
const currentUser = jwtAuthService.getCurrentUser();
if (currentUser) {
  // User is authenticated with valid token
  // Show banking dashboard
} else {
  // Redirect to login
}
```

### 3. **Balance Refresh with JWT**
```javascript
// Refresh balance updates JWT token with new data
const newBalance = await jwtAuthService.refreshUserBalance();
// New JWT token generated with updated balance
```

### 4. **Automatic Token Refresh**
```javascript
// System automatically refreshes expiring tokens
if (jwtAuthService.isTokenExpiringSoon()) {
  const refreshResult = await jwtAuthService.refreshAccessToken();
  // New token generated without user intervention
}
```

## 🛡️ **Security Benefits**

### vs. Basic Authentication:
- ❌ **Basic**: Passwords stored in localStorage/sessionStorage
- ✅ **JWT**: Secure signed tokens in HTTP-only cookies

### vs. Session-based Auth:
- ❌ **Sessions**: Server must store session data
- ✅ **JWT**: Stateless, no server-side storage needed

### JWT Security Features:
- 🔐 **Cryptographic Signing**: Prevents token tampering
- ⏰ **Automatic Expiration**: Tokens expire after 24 hours
- 🔄 **Refresh Capability**: Seamless token renewal
- 🍪 **Secure Cookies**: HTTP-only, SameSite protection
- 🚫 **No Password Storage**: Passwords never stored in browser

## 📱 **User Experience**

### Seamless Authentication:
1. **Login Once**: JWT handles the rest
2. **Stay Logged In**: Tokens refresh automatically
3. **Secure Logout**: All tokens cleared instantly
4. **Cross-Tab Support**: Login persists across browser tabs

### Error Handling:
- **Invalid Credentials**: Clear error messages
- **Expired Tokens**: Automatic refresh or redirect to login
- **Network Issues**: Graceful fallback and retry

## 🔧 **Configuration Options**

In `src/services/jwtAuthService.js`:

```javascript
const JWT_CONFIG = {
  SECRET_KEY: 'your-secret-key',        // Change in production
  EXPIRES_IN: '24h',                    // Token expiry time
  COOKIE_NAME: 'chase_auth_token',      // Cookie name
  REFRESH_COOKIE_NAME: 'chase_refresh_token'
};
```

## 🚀 **Production Considerations**

### Security Enhancements:
1. **Environment Variables**: Store JWT secret in env vars
2. **HTTPS Only**: Enable secure cookies in production
3. **Rate Limiting**: Prevent brute force attacks
4. **Password Hashing**: Hash passwords in Excel/database
5. **Token Blacklisting**: Implement token revocation

### Performance Optimizations:
1. **Token Caching**: Cache decoded tokens in memory
2. **Background Refresh**: Refresh tokens in background
3. **Lazy Loading**: Load user data on demand

## 🧪 **Testing Your Setup**

### 1. **Test Login Flow**
```bash
# Start your app
npm start

# Go to homepage
http://localhost:3000/

# Login with: demo/demo
# Should redirect to banking dashboard
```

### 2. **Test JWT Features**
- **Token Generation**: Check browser cookies after login
- **Auto Refresh**: Wait near token expiry (24 hours)
- **Balance Refresh**: Click "Refresh Balance" button
- **Logout**: Click "Sign Out" - cookies should be cleared

### 3. **Debug JWT Tokens**
Open browser console and check:
```javascript
// Check current user
console.log(jwtAuthService.getCurrentUser());

// Check token expiration
console.log(jwtAuthService.getTokenExpiration());

// Check if token expires soon
console.log(jwtAuthService.isTokenExpiringSoon());
```

## 📞 **Troubleshooting**

### Common Issues:

1. **"JWT token verification failed"**
   - Check if JWT secret key is consistent
   - Verify token hasn't been manually modified

2. **"User not authenticated"**
   - Check if cookies are enabled in browser
   - Verify token hasn't expired

3. **"Failed to refresh balance"**
   - Check Google Sheets API configuration
   - Verify user exists in sheet

4. **Login works but dashboard doesn't**
   - Check browser console for JWT errors
   - Verify navigation state is passed correctly

## 🎯 **Next Steps**

1. **Test with Mock Data**: Use demo/demo to test JWT flow
2. **Set up Google Sheets**: Add real user data
3. **Customize JWT Settings**: Adjust expiration times
4. **Add More Users**: Expand your Excel/Google Sheets
5. **Deploy Securely**: Use environment variables in production

Your JWT authentication system is now fully functional and secure! 🔐