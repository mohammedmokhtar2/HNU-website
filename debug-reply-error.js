#!/usr/bin/env node

/**
 * Debug script for the messages reply API
 * This script helps identify the cause of 500 errors
 */

const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

async function testEmailConfig() {
  console.log('🔧 Testing Email Configuration...');

  try {
    const response = await axios.get(`${API_BASE}/admin/email-config`);

    if (response.data.success) {
      console.log('✅ Email configuration retrieved successfully');
      console.log('📧 Config:', JSON.stringify(response.data.data, null, 2));

      // Test connection
      console.log('\n🔗 Testing Email Connection...');
      const testResponse = await axios.post(`${API_BASE}/admin/email-config`, {
        action: 'test-connection',
      });

      if (testResponse.data.success) {
        console.log(
          '✅ Email connection test:',
          testResponse.data.data.message
        );
      } else {
        console.log(
          '❌ Email connection test failed:',
          testResponse.data.error
        );
      }

      return response.data.data;
    } else {
      console.log('❌ Email configuration failed:', response.data.error);
      return null;
    }
  } catch (error) {
    console.log(
      '❌ Email configuration error:',
      error.response?.data?.error || error.message
    );
    return null;
  }
}

async function testReplyAPI() {
  console.log('\n🧪 Testing Reply API...');

  // First, get a contact form message
  try {
    const messagesResponse = await axios.get(`${API_BASE}/messages?limit=10`);

    if (!messagesResponse.data.success) {
      console.log('❌ Failed to get messages:', messagesResponse.data.error);
      return;
    }

    // Find a contact form message
    const contactMessage = messagesResponse.data.data.find(
      msg => msg.messageConfig?.metadata?.source === 'contact_form'
    );

    if (!contactMessage) {
      console.log(
        '❌ No contact form messages found. Please submit a contact form first.'
      );
      return;
    }

    console.log('✅ Found contact form message:', contactMessage.id);

    // Test reply
    const replyData = {
      messageId: contactMessage.id,
      subject: 'Re: Test Reply',
      body: 'This is a test reply to debug the 500 error.',
      htmlBody: '<p>This is a test reply to debug the 500 error.</p>',
    };

    console.log('📤 Sending reply...');
    const replyResponse = await axios.post(
      `${API_BASE}/messages/reply`,
      replyData
    );

    if (replyResponse.data.success) {
      console.log('✅ Reply sent successfully');
      console.log('📧 Reply ID:', replyResponse.data.data.replyMessageId);
      console.log('📬 Email Result:', replyResponse.data.data.emailResult);
    } else {
      console.log('❌ Reply failed:', replyResponse.data.error);
      if (replyResponse.data.data?.emailError) {
        console.log('📧 Email Error:', replyResponse.data.data.emailError);
      }
    }
  } catch (error) {
    console.log(
      '❌ Reply API error:',
      error.response?.data?.error || error.message
    );
    if (error.response?.data?.data?.emailError) {
      console.log(
        '📧 Email Error Details:',
        error.response.data.data.emailError
      );
    }
  }
}

async function checkEnvironmentVariables() {
  console.log('\n🔍 Checking Environment Variables...');

  const requiredVars = [
    'NODEMAILER_HOST',
    'NODEMAILER_PORT',
    'NODEMAILER_USER',
    'NODEMAILER_PASS',
    'NODEMAILER_FROM_EMAIL',
  ];

  const missingVars = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n💡 Add these to your .env.local file:');
    missingVars.forEach(varName => {
      console.log(`   ${varName}=your-value-here`);
    });
  } else {
    console.log('✅ All required environment variables are set');
  }

  return missingVars.length === 0;
}

async function runDebug() {
  console.log('🐛 Debugging Messages Reply API 500 Error\n');
  console.log('=' * 50);

  // Check environment variables
  const envOk = await checkEnvironmentVariables();

  // Test email configuration
  const config = await testEmailConfig();

  // Test reply API
  await testReplyAPI();

  console.log('\n' + '=' * 50);
  console.log('🔍 Debug Summary:');

  if (!envOk) {
    console.log('❌ Environment variables are missing');
    console.log('💡 Fix: Add missing environment variables to .env.local');
  } else if (!config?.hasPassword) {
    console.log('❌ Email password is not configured');
    console.log('💡 Fix: Set NODEMAILER_PASS in .env.local');
  } else if (!config?.initialized) {
    console.log('❌ Email service is not initialized');
    console.log('💡 Fix: Check email configuration and restart server');
  } else {
    console.log('✅ Email configuration looks good');
    console.log('💡 Check server logs for detailed error information');
  }

  console.log('\n📋 Common 500 Error Causes:');
  console.log('1. Missing NODEMAILER_USER or NODEMAILER_PASS');
  console.log('2. Invalid email credentials');
  console.log('3. SMTP server connection issues');
  console.log('4. Firewall blocking SMTP ports');
  console.log('5. Gmail App Password not set (if using Gmail)');
  console.log('6. Database connection issues');
}

// Run the debug
if (require.main === module) {
  runDebug().catch(console.error);
}

module.exports = {
  testEmailConfig,
  testReplyAPI,
  checkEnvironmentVariables,
  runDebug,
};
