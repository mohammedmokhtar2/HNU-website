#!/usr/bin/env node

/**
 * Test script for the complete contact form to admin reply flow
 * This script tests:
 * 1. Contact form submission
 * 2. Admin viewing the message
 * 3. Admin replying to the message
 * 4. Email delivery
 */

const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Test data
const testContactFormData = {
  messageConfig: {
    from: 'test@example.com',
    to: 'admin@hnu.edu',
    subject: 'Test Contact Form Submission',
    body: `Hello HNU Team,

I am writing to inquire about the admission process for the Computer Science program. I would like to know:

1. What are the admission requirements?
2. When is the application deadline?
3. What documents do I need to submit?

I am very interested in joining your university and would appreciate any information you can provide.

Best regards,
John Doe
test@example.com`,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Contact Form Submission
        </h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> test@example.com</p>
          <p><strong>Subject:</strong> Test Contact Form Submission</p>
        </div>
        <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">Hello HNU Team,

I am writing to inquire about the admission process for the Computer Science program. I would like to know:

1. What are the admission requirements?
2. When is the application deadline?
3. What documents do I need to submit?

I am very interested in joining your university and would appreciate any information you can provide.

Best regards,
John Doe
test@example.com</p>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
        <p style="color: #6c757d; font-size: 12px; text-align: center;">
          This message was sent from the contact form on the website.
        </p>
      </div>
    `,
    status: 'PENDING',
    type: 'EMAIL',
    priority: 'NORMAL',
    retryCount: 0,
    maxRetries: 3,
    metadata: {
      source: 'contact_form',
      sectionId: 'contact-us-section',
      userAgent: 'Mozilla/5.0 (Test Browser)',
      timestamp: new Date().toISOString(),
    },
  },
};

const testReplyData = {
  subject: 'Re: Test Contact Form Submission',
  body: `Dear John Doe,

Thank you for your interest in HNU's Computer Science program. I'm pleased to provide you with the information you requested:

1. Admission Requirements:
   - High school diploma or equivalent
   - Minimum GPA of 3.0
   - SAT/ACT scores (optional but recommended)
   - English proficiency test (for international students)

2. Application Deadline:
   - Fall semester: March 1st
   - Spring semester: October 1st

3. Required Documents:
   - Completed application form
   - Official transcripts
   - Personal statement
   - Two letters of recommendation
   - Application fee

For more detailed information, please visit our website or contact our admissions office directly.

Best regards,
Admissions Team
HNU Official Website`,
  htmlBody: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
        <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold;">HNU</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Reply from HNU Official Website</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Thank you for contacting us. Here is our response to your inquiry.</p>
      </div>
      
      <div style="padding: 30px;">
        <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 4px 4px 0;">
          <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Our Response:</h3>
          <div style="white-space: pre-wrap; line-height: 1.6; color: #555;">Dear John Doe,

Thank you for your interest in HNU's Computer Science program. I'm pleased to provide you with the information you requested:

1. Admission Requirements:
   - High school diploma or equivalent
   - Minimum GPA of 3.0
   - SAT/ACT scores (optional but recommended)
   - English proficiency test (for international students)

2. Application Deadline:
   - Fall semester: March 1st
   - Spring semester: October 1st

3. Required Documents:
   - Completed application form
   - Official transcripts
   - Personal statement
   - Two letters of recommendation
   - Application fee

For more detailed information, please visit our website or contact our admissions office directly.

Best regards,
Admissions Team
HNU Official Website</div>
        </div>
        
        <div style="background-color: #f1f3f4; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin: 20px 0; font-size: 12px; color: #666;">
          <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">Your Original Message:</h4>
          <p style="margin: 5px 0;"><strong>Subject:</strong> Test Contact Form Submission</p>
          <p style="margin: 5px 0;"><strong>From:</strong> test@example.com</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p style="margin: 5px 0;"><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; margin-top: 5px;">Hello HNU Team,

I am writing to inquire about the admission process for the Computer Science program. I would like to know:

1. What are the admission requirements?
2. When is the application deadline?
3. What documents do I need to submit?

I am very interested in joining your university and would appreciate any information you can provide.

Best regards,
John Doe
test@example.com</div>
        </div>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
        <p style="margin: 5px 0;"><strong>HNU Official Website</strong></p>
        <p style="margin: 5px 0;">This is an automated response. Please do not reply to this email.</p>
        <p style="margin: 5px 0;">For further assistance, please visit our website or contact us directly.</p>
      </div>
    </div>
  `,
};

async function testContactFormSubmission() {
  console.log('🧪 Testing Contact Form Submission...');

  try {
    const response = await axios.post(
      `${API_BASE}/messages`,
      testContactFormData
    );

    if (response.data.success) {
      console.log('✅ Contact form submission successful');
      console.log('📧 Message ID:', response.data.data.id);
      return response.data.data.id;
    } else {
      console.log('❌ Contact form submission failed:', response.data.error);
      return null;
    }
  } catch (error) {
    console.log(
      '❌ Contact form submission error:',
      error.response?.data?.error || error.message
    );
    return null;
  }
}

async function testGetMessages() {
  console.log('\n🧪 Testing Message Retrieval...');

  try {
    const response = await axios.get(`${API_BASE}/messages?limit=10`);

    if (response.data.success) {
      console.log('✅ Messages retrieved successfully');
      console.log('📊 Total messages:', response.data.pagination.total);
      console.log('📋 Messages found:', response.data.data.length);

      // Find our test message
      const testMessage = response.data.data.find(
        msg =>
          msg.messageConfig?.metadata?.source === 'contact_form' &&
          msg.messageConfig?.subject === 'Test Contact Form Submission'
      );

      if (testMessage) {
        console.log('✅ Test message found:', testMessage.id);
        return testMessage.id;
      } else {
        console.log('❌ Test message not found');
        return null;
      }
    } else {
      console.log('❌ Message retrieval failed:', response.data.error);
      return null;
    }
  } catch (error) {
    console.log(
      '❌ Message retrieval error:',
      error.response?.data?.error || error.message
    );
    return null;
  }
}

async function testSendReply(messageId) {
  console.log('\n🧪 Testing Admin Reply...');

  try {
    const response = await axios.post(`${API_BASE}/messages/reply`, {
      messageId,
      ...testReplyData,
    });

    if (response.data.success) {
      console.log('✅ Reply sent successfully');
      console.log('📧 Reply Message ID:', response.data.data.replyMessageId);
      console.log('📬 Email Result:', response.data.data.emailResult);
      return response.data.data.replyMessageId;
    } else {
      console.log('❌ Reply failed:', response.data.error);
      return null;
    }
  } catch (error) {
    console.log(
      '❌ Reply error:',
      error.response?.data?.error || error.message
    );
    return null;
  }
}

async function testGetReplyHistory(messageId) {
  console.log('\n🧪 Testing Reply History...');

  try {
    const response = await axios.get(
      `${API_BASE}/messages/reply?messageId=${messageId}`
    );

    if (response.data.success) {
      console.log('✅ Reply history retrieved successfully');
      console.log('📋 Replies found:', response.data.data.length);

      if (response.data.data.length > 0) {
        console.log('✅ Reply history contains replies');
        return true;
      } else {
        console.log('❌ No replies found in history');
        return false;
      }
    } else {
      console.log('❌ Reply history retrieval failed:', response.data.error);
      return false;
    }
  } catch (error) {
    console.log(
      '❌ Reply history error:',
      error.response?.data?.error || error.message
    );
    return false;
  }
}

async function testMessageStats() {
  console.log('\n🧪 Testing Message Statistics...');

  try {
    const response = await axios.get(`${API_BASE}/messages/stats`);

    if (response.data.success) {
      console.log('✅ Message statistics retrieved successfully');
      console.log('📊 Stats:', response.data.data);
      return true;
    } else {
      console.log('❌ Message statistics failed:', response.data.error);
      return false;
    }
  } catch (error) {
    console.log(
      '❌ Message statistics error:',
      error.response?.data?.error || error.message
    );
    return false;
  }
}

async function runCompleteTest() {
  console.log('🚀 Starting Complete Contact Form to Admin Reply Flow Test\n');
  console.log('=' * 60);

  // Step 1: Submit contact form
  const messageId = await testContactFormSubmission();
  if (!messageId) {
    console.log('\n❌ Test failed at contact form submission');
    return;
  }

  // Wait a moment for processing
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Step 2: Retrieve messages
  const retrievedMessageId = await testGetMessages();
  if (!retrievedMessageId) {
    console.log('\n❌ Test failed at message retrieval');
    return;
  }

  // Step 3: Send reply
  const replyMessageId = await testSendReply(retrievedMessageId);
  if (!replyMessageId) {
    console.log('\n❌ Test failed at reply sending');
    return;
  }

  // Step 4: Check reply history
  const replyHistorySuccess = await testGetReplyHistory(retrievedMessageId);
  if (!replyHistorySuccess) {
    console.log('\n❌ Test failed at reply history');
    return;
  }

  // Step 5: Check message stats
  const statsSuccess = await testMessageStats();
  if (!statsSuccess) {
    console.log('\n❌ Test failed at message statistics');
    return;
  }

  console.log('\n' + '=' * 60);
  console.log('🎉 All tests passed! Complete flow is working correctly.');
  console.log('\n📋 Test Summary:');
  console.log('✅ Contact form submission');
  console.log('✅ Message retrieval');
  console.log('✅ Admin reply sending');
  console.log('✅ Reply history tracking');
  console.log('✅ Message statistics');
  console.log('\n🔗 Flow: Contact Form → Admin Panel → Reply → Email Delivery');
}

// Run the test
if (require.main === module) {
  runCompleteTest().catch(console.error);
}

module.exports = {
  testContactFormSubmission,
  testGetMessages,
  testSendReply,
  testGetReplyHistory,
  testMessageStats,
  runCompleteTest,
};
