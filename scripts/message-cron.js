#!/usr/bin/env node

/**
 * Message Processing Cron Job
 * 
 * This script processes scheduled messages and retries failed messages.
 * It should be run periodically (e.g., every minute) via a cron job or scheduler.
 * 
 * Usage:
 * node scripts/message-cron.js
 * 
 * Environment Variables:
 * - CRON_SECRET: Secret key for authentication (optional)
 * - SMTP_HOST: SMTP server host
 * - SMTP_PORT: SMTP server port
 * - SMTP_USER: SMTP username
 * - SMTP_PASS: SMTP password
 * - SMTP_SECURE: Whether to use secure connection (true/false)
 * - DATABASE_URL: Database connection string
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    cronSecret: process.env.CRON_SECRET,
    timeout: 30000, // 30 seconds
};

/**
 * Make HTTP request to the cron endpoint
 */
async function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;

        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'HNU-Message-Cron/1.0',
                ...options.headers,
            },
            timeout: config.timeout,
        };

        // Add authentication if secret is provided
        if (config.cronSecret) {
            requestOptions.headers['Authorization'] = `Bearer ${config.cronSecret}`;
        }

        const req = client.request(requestOptions, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: response,
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data,
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

/**
 * Run the message processing cron job
 */
async function runCronJob() {
    const startTime = new Date();
    console.log(`[${startTime.toISOString()}] Starting message processing cron job...`);

    try {
        // Call the cron endpoint
        const response = await makeRequest(`${config.baseUrl}/api/messages/cron`, {
            method: 'POST',
            body: {
                timestamp: startTime.toISOString(),
                source: 'cron-script',
            },
        });

        if (response.statusCode === 200) {
            const result = response.data;
            console.log(`[${new Date().toISOString()}] Cron job completed successfully:`);
            console.log(`  - Processed: ${result.data?.processed || 0} messages`);
            console.log(`  - Sent: ${result.data?.sent || 0} messages`);
            console.log(`  - Failed: ${result.data?.failed || 0} messages`);

            if (result.data?.errors && result.data.errors.length > 0) {
                console.log(`  - Errors:`);
                result.data.errors.forEach(error => {
                    console.log(`    * ${error}`);
                });
            }
        } else {
            console.error(`[${new Date().toISOString()}] Cron job failed with status ${response.statusCode}:`);
            console.error(`  ${response.data?.error || 'Unknown error'}`);
            process.exit(1);
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Cron job error:`, error.message);
        process.exit(1);
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(`[${endTime.toISOString()}] Cron job finished in ${duration}ms`);
}

/**
 * Check cron job status
 */
async function checkStatus() {
    try {
        const response = await makeRequest(`${config.baseUrl}/api/messages/cron`, {
            method: 'GET',
        });

        if (response.statusCode === 200) {
            const status = response.data;
            console.log(`[${new Date().toISOString()}] Cron job status:`);
            console.log(`  - Scheduled messages: ${status.data?.scheduled || 0}`);
            console.log(`  - Pending messages: ${status.data?.pending || 0}`);
            console.log(`  - Failed messages: ${status.data?.failed || 0}`);
            console.log(`  - Last check: ${status.data?.timestamp || 'Unknown'}`);
        } else {
            console.error(`[${new Date().toISOString()}] Status check failed with status ${response.statusCode}`);
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Status check error:`, error.message);
    }
}

// Main execution
async function main() {
    const command = process.argv[2];

    switch (command) {
        case 'status':
            await checkStatus();
            break;
        case 'run':
        default:
            await runCronJob();
            break;
    }
}

// Handle process signals
process.on('SIGINT', () => {
    console.log('\n[CRON] Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n[CRON] Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

// Run the main function
main().catch((error) => {
    console.error('[CRON] Fatal error:', error);
    process.exit(1);
});
