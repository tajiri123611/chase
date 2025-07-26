// Test utility to debug Google Sheets connection
import { GOOGLE_SHEETS_CONFIG } from '../config/googleSheets';

export const testGoogleSheetsConnection = async () => {
  const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
  
  console.log('🔍 Testing Google Sheets connection...');
  console.log('📋 Configuration:');
  console.log('  - Sheet ID:', GOOGLE_SHEETS_CONFIG.SHEET_ID);
  console.log('  - API Key:', GOOGLE_SHEETS_CONFIG.API_KEY ? `${GOOGLE_SHEETS_CONFIG.API_KEY.substring(0, 10)}...` : 'NOT SET');
  console.log('  - Range:', GOOGLE_SHEETS_CONFIG.RANGE);
  console.log('🌐 Test URL:', testUrl);
  
  try {
    console.log('📡 Making request to Google Sheets API...');
    const response = await fetch(testUrl);
    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Connection successful!');
      if (data.values) {
        console.log('📋 Sheet data found:');
        data.values.forEach((row, index) => {
          console.log(`  Row ${index + 1}:`, row);
        });
      } else {
        console.log('⚠️ No data found in sheet');
      }
      return { success: true, data };
    } else {
      console.log('❌ Connection failed:', data.error);
      if (data.error?.code === 403) {
        console.log('💡 Possible solutions:');
        console.log('  1. Make sure Google Sheets API is enabled');
        console.log('  2. Check if your sheet is publicly readable');
        console.log('  3. Verify your API key is correct');
      }
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error: error.message };
  }
};

// You can call this function in the browser console to test your connection
window.testGoogleSheets = testGoogleSheetsConnection;