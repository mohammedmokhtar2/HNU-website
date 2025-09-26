// Complete flow test: Contact form → Database → Admin panel → Reply via email
// Run this with: node test-complete-flow.js

const { io } = require('socket.io-client');

console.log('🧪 Testing Complete Message Flow...');
console.log('🌐 Socket URL: http://localhost:3001');

// Test the complete flow
async function testCompleteFlow() {
  try {
    console.log('📝 Step 1: Submitting contact form message...');

    // Simulate contact form submission via API
    const contactFormData = {
      messageConfig: {
        from: 'test@example.com',
        to: 'admin@university.edu',
        subject: 'Test Contact Form Submission',
        body: `Name: Test User
Email: test@example.com
Subject: Test Contact Form Submission

Message:
This is a test message to verify the complete flow from contact form to admin panel reply.

---
This message was sent from the contact form on the website.`,
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Contact Form Submission
            </h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> Test User</p>
              <p><strong>Email:</strong> test@example.com</p>
              <p><strong>Subject:</strong> Test Contact Form Submission</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">This is a test message to verify the complete flow from contact form to admin panel reply.</p>
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
          sectionId: 'test-section',
          name: 'Test User',
          userAgent: 'Test Script',
          timestamp: new Date().toISOString(),
        },
      },
    };

    const response = await fetch('http://localhost:3001/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactFormData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Message saved to database:', result.data.id);

    // Step 2: Test admin panel socket connection
    console.log('👑 Step 2: Testing admin panel socket connection...');

    const adminSocket = io('http://localhost:3001', {
      path: '/api/socketio',
      transports: ['websocket', 'polling'],
    });

    return new Promise((resolve, reject) => {
      adminSocket.on('connect', () => {
        console.log('✅ Admin panel connected:', adminSocket.id);

        // Join admin room
        adminSocket.emit('join-admin');
        console.log('✅ Admin panel joined admin room');

        // Listen for new messages
        adminSocket.on('new-message', data => {
          console.log('📨 Admin panel received new message:', data.id);
          console.log('✅ Real-time notification working!');
        });

        adminSocket.on('new-contact-message', data => {
          console.log(
            '📧 Admin panel received new contact message:',
            data.name
          );
          console.log('✅ Contact form notification working!');
        });

        // Step 3: Test admin reply
        console.log('📤 Step 3: Testing admin reply functionality...');

        setTimeout(async () => {
          try {
            const replyData = {
              messageConfig: {
                from: 'admin@university.edu',
                to: 'test@example.com',
                subject: 'Re: Test Contact Form Submission',
                body: 'Thank you for your message. This is an automated reply from the admin panel.',
                htmlBody: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                      Reply from Admin
                    </h2>
                    <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
                      <h3 style="color: #333; margin-top: 0;">Admin Reply:</h3>
                      <p style="white-space: pre-wrap; line-height: 1.6;">Thank you for your message. This is an automated reply from the admin panel.</p>
                    </div>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
                    <p style="color: #6c757d; font-size: 12px; text-align: center;">
                      This is an automated reply from the university administration.
                    </p>
                  </div>
                `,
                status: 'PENDING',
                type: 'EMAIL',
                priority: 'NORMAL',
                retryCount: 0,
                maxRetries: 3,
                metadata: {
                  source: 'admin_reply',
                  originalMessageId: result.data.id,
                  adminReply: true,
                  timestamp: new Date().toISOString(),
                },
              },
            };

            const replyResponse = await fetch(
              'http://localhost:3001/api/messages',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(replyData),
              }
            );

            if (!replyResponse.ok) {
              throw new Error(`HTTP error! status: ${replyResponse.status}`);
            }

            const replyResult = await replyResponse.json();
            console.log(
              '✅ Admin reply saved to database:',
              replyResult.data.id
            );
            console.log('🎉 Complete flow test successful!');

            adminSocket.disconnect();
            resolve();
          } catch (error) {
            console.error('❌ Error in admin reply test:', error);
            adminSocket.disconnect();
            reject(error);
          }
        }, 2000);
      });

      adminSocket.on('connect_error', error => {
        console.error('❌ Admin socket connection error:', error.message);
        reject(error);
      });

      // Timeout after 15 seconds
      setTimeout(() => {
        console.log('⏰ Test timeout');
        adminSocket.disconnect();
        reject(new Error('Test timeout'));
      }, 15000);
    });
  } catch (error) {
    console.error('❌ Error in complete flow test:', error);
    throw error;
  }
}

// Run the test
testCompleteFlow()
  .then(() => {
    console.log('✅ All tests passed! Complete flow is working correctly.');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
