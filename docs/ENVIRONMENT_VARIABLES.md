# Environment Variables for Message System

## Required Environment Variables

Add these variables to your `.env.local` file:

### Database Configuration
```env
DATABASE_URL="postgresql://username:password@localhost:5432/hnu_website"
```

### SMTP Configuration (Required for Email Messages)
```env
# SMTP Server Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
```

### Optional Configuration
```env
# Cron Job Security (Optional - for production)
CRON_SECRET=your-secret-key-for-cron-authentication
```

## SMTP Provider Examples

### Gmail Configuration
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not regular password
SMTP_SECURE=false
```

**Note for Gmail**: You need to:
1. Enable 2-factor authentication
2. Generate an "App Password" 
3. Use the app password instead of your regular password

### Outlook/Hotmail Configuration
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_SECURE=false
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587  # or 465 for SSL
SMTP_USER=your-username
SMTP_PASS=your-password
SMTP_SECURE=false  # true for port 465, false for port 587
```

## Testing Your Configuration

After setting up the environment variables, you can test the email configuration:

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test the SMTP connection** by creating a test message in the admin panel at `/admin/system/messages`

3. **Check the cron job status**:
   ```bash
   npm run cron:messages:status
   ```

## Security Notes

- **Never commit your `.env.local` file** to version control
- **Use App Passwords** for Gmail instead of your regular password
- **Set a strong CRON_SECRET** in production to secure your cron endpoints
- **Use environment-specific SMTP credentials** for different environments

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check your SMTP credentials
   - For Gmail, ensure you're using an App Password
   - Verify 2FA is enabled for Gmail

2. **"Connection timeout"**
   - Check your SMTP_HOST and SMTP_PORT
   - Verify firewall settings
   - Try different ports (587, 465, 25)

3. **"Messages not sending"**
   - Check the message status in the admin panel
   - Review server logs for errors
   - Verify SMTP configuration

### Debug Mode

Enable debug logging by adding:
```env
DEBUG=messages:*
```

This will show detailed logs for message processing and SMTP operations.
