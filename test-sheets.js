// Test script for Google Sheets integration
require('dotenv').config({ path: '.env.local' });
const { GoogleSheetsService } = require('./lib/services/sheets.service.ts');

async function testGoogleSheets() {
  console.log('🧪 Testing Google Sheets integration...\n');

  const sheetsService = new (require('./lib/services/sheets.service.ts').GoogleSheetsService)();

  // Test data
  const testData = {
    name: 'Test User from Script',
    email: 'test-script@example.com',
    phone: '0123456789',
    city: 'Paris',
    houseType: 'maison',
    message: 'Test message from Node script',
  };

  try {
    console.log('📊 Testing Google Sheets access...');
    const hasAccess = await sheetsService.verifyAccess();
    console.log(`Access: ${hasAccess ? '✅ Connected' : '❌ Failed'}\n`);

    if (!hasAccess) {
      console.error('❌ Cannot access Google Sheets. Check your credentials and sheet ID.');
      process.exit(1);
    }

    console.log('📝 Adding test data to sheet...');
    await sheetsService.addLead(testData);
    console.log('✅ Test data added successfully!\n');

    console.log('🎉 All tests passed!');
    console.log('\nCheck your Google Sheet for the new row:');
    console.log(`https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/edit`);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

testGoogleSheets();
