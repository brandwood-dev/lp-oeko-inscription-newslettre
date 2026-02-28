// Test script to verify all integrations are working
require('dotenv').config({ path: '.env.local' });

async function testIntegrations() {
  console.log('🧪 Testing All Integrations...\n');
  console.log('=' .repeat(60));

  // Test 1: Environment Variables
  console.log('\n📋 1. CHECKING ENVIRONMENT VARIABLES\n');

  const requiredEnvVars = {
    'BREVO_API_KEY': process.env.BREVO_API_KEY,
    'BREVO_LIST_ID': process.env.BREVO_LIST_ID,
    'BREVO_SMTP_HOST': process.env.BREVO_SMTP_HOST,
    'BREVO_SMTP_PORT': process.env.BREVO_SMTP_PORT,
    'BREVO_SMTP_USER': process.env.BREVO_SMTP_USER,
    'BREVO_SMTP_PASSWORD': process.env.BREVO_SMTP_PASSWORD,
    'EMAIL_TO': process.env.EMAIL_TO,
    'GOOGLE_SHEET_ID': process.env.GOOGLE_SHEET_ID,
    'GOOGLE_SERVICE_ACCOUNT_CREDENTIALS': process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS ? 'SET' : undefined,
  };

  let envVarsOk = true;
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (value) {
      console.log(`✅ ${key}: ${key.includes('PASSWORD') || key.includes('KEY') || key.includes('CREDENTIALS') ? '***' : value}`);
    } else {
      console.log(`❌ ${key}: NOT SET`);
      envVarsOk = false;
    }
  }

  if (!envVarsOk) {
    console.log('\n❌ Some environment variables are missing!');
    process.exit(1);
  }

  // Test 2: Google Sheets
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 2. TESTING GOOGLE SHEETS\n');

  try {
    const { google } = require('googleapis');
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || '{}');
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('Testing access to spreadsheet...');
    const metadata = await sheets.spreadsheets.get({ spreadsheetId });
    console.log(`✅ Connected to: "${metadata.data.properties.title}"`);
    console.log(`   Sheet ID: ${spreadsheetId}`);
    console.log(`   Service Account: ${credentials.client_email}`);

    // Add test row
    const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    const values = [[
      timestamp,
      'Test Script',
      'test-script@example.com',
      '0601020304',
      'Test City',
      'Maison individuelle',
      'Test message from integration test script'
    ]];

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:G',
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    console.log(`✅ Test row added: ${result.data.updates.updatedRange}`);
  } catch (error) {
    console.log(`❌ Google Sheets error: ${error.message}`);
    process.exit(1);
  }

  // Test 3: Brevo API
  console.log('\n' + '='.repeat(60));
  console.log('\n📧 3. TESTING BREVO API\n');

  try {
    const { ContactsApi, CreateContact } = require('@getbrevo/brevo');
    const apiInstance = new ContactsApi();
    apiInstance.setApiKey(0, process.env.BREVO_API_KEY);

    // Test API connection
    console.log('Testing Brevo API connection...');
    const listId = Number(process.env.BREVO_LIST_ID);
    const list = await apiInstance.getList(listId);
    console.log(`✅ Connected to Brevo list: "${list.body.name}"`);
    console.log(`   List ID: ${listId}`);
    console.log(`   Total contacts: ${list.body.totalSubscribers}`);

    // Try to create a test contact
    console.log('\nAdding test contact...');
    const testContact = new CreateContact();
    testContact.email = `test-${Date.now()}@example.com`;
    testContact.attributes = {
      FIRSTNAME: 'Test',
      LASTNAME: 'Script',
      SMS: '+33601020304',
    };

    // Try with custom attributes
    try {
      testContact.attributes.VILLE = 'Paris';
      testContact.attributes.TYPE_BIEN = 'Maison individuelle';
      testContact.attributes.MESSAGE = 'Test message';
      testContact.attributes.SOURCE = 'Integration Test';
    } catch (e) {
      console.log('⚠️  Custom attributes not available');
    }

    testContact.listIds = [listId];
    testContact.updateEnabled = true;

    try {
      await apiInstance.createContact(testContact);
      console.log('✅ Test contact created with all attributes');
    } catch (error) {
      if (error.response?.body?.code === 'duplicate_parameter') {
        console.log('✅ Contact already exists (duplicate)');
      } else if (error.response?.body?.message?.includes('attribute')) {
        console.log('⚠️  Custom attributes not configured in Brevo');
        console.log('   Create these attributes: VILLE, TYPE_BIEN, MESSAGE, SOURCE');

        // Try without custom attributes
        const simpleContact = new CreateContact();
        simpleContact.email = testContact.email;
        simpleContact.attributes = {
          FIRSTNAME: 'Test',
          LASTNAME: 'Script',
          SMS: '+33601020304',
        };
        simpleContact.listIds = [listId];
        simpleContact.updateEnabled = true;

        await apiInstance.createContact(simpleContact);
        console.log('✅ Test contact created with standard attributes only');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.log(`❌ Brevo error: ${error.message}`);
    if (error.response?.body) {
      console.log('   Details:', error.response.body);
    }
    process.exit(1);
  }

  // Test 4: Email (SMTP)
  console.log('\n' + '='.repeat(60));
  console.log('\n📨 4. TESTING EMAIL (SMTP)\n');

  try {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST,
      port: Number(process.env.BREVO_SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD,
      },
    });

    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    console.log(`   Host: ${process.env.BREVO_SMTP_HOST}:${process.env.BREVO_SMTP_PORT}`);
    console.log(`   User: ${process.env.BREVO_SMTP_USER}`);

    console.log('\n⏭️  Skipping actual email send (to avoid spam)');
    console.log('   Email would be sent to:', process.env.EMAIL_TO);
  } catch (error) {
    console.log(`❌ Email error: ${error.message}`);
    process.exit(1);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 ALL TESTS PASSED!\n');
  console.log('✅ Environment variables configured');
  console.log('✅ Google Sheets integration working');
  console.log('✅ Brevo CRM integration working');
  console.log('✅ Email (SMTP) connection working');
  console.log('\n✨ You are ready to deploy to production!\n');
  console.log('=' .repeat(60));
}

testIntegrations().catch((error) => {
  console.error('\n💥 Test failed:', error);
  process.exit(1);
});
