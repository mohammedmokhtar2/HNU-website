'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Send,
  Eye,
  EyeOff,
} from 'lucide-react';

interface EmailConfig {
  host: string;
  port: string;
  secure: string;
  user: string;
  fromEmail: string;
  initialized: boolean;
  hasPassword: boolean;
}

export function EmailConfigSection() {
  const [config, setConfig] = useState<EmailConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/email-config');
      const data = await response.json();

      if (data.success) {
        setConfig(data.data);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch email configuration');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setTesting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/email-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test-connection' }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.connected) {
          setSuccess('Email connection successful!');
        } else {
          setError('Email connection failed. Please check your configuration.');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to test email connection');
    } finally {
      setTesting(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail.trim()) {
      setError('Please enter a test email address');
      return;
    }

    try {
      setSendingTest(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/email-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send-test-email',
          testEmail: testEmail.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Test email sent successfully to ${testEmail}!`);
        setTestEmail('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to send test email');
    } finally {
      setSendingTest(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const getStatusBadge = (isInitialized: boolean, hasPassword: boolean) => {
    if (!hasPassword) {
      return (
        <Badge className='bg-red-100 text-red-800'>
          <XCircle className='w-3 h-3 mr-1' />
          Not Configured
        </Badge>
      );
    }

    if (isInitialized) {
      return (
        <Badge className='bg-green-100 text-green-800'>
          <CheckCircle className='w-3 h-3 mr-1' />
          Active
        </Badge>
      );
    }

    return (
      <Badge className='bg-yellow-100 text-yellow-800'>
        <AlertCircle className='w-3 h-3 mr-1' />
        Inactive
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='w-5 h-5' />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center p-8'>
            <RefreshCw className='w-6 h-6 animate-spin text-blue-600 mr-2' />
            <span className='text-gray-600'>
              Loading email configuration...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='w-5 h-5' />
            Email Configuration
          </CardTitle>
          <div className='flex items-center gap-2'>
            {config && getStatusBadge(config.initialized, config.hasPassword)}
            <Button
              onClick={fetchConfig}
              variant='outline'
              size='sm'
              className='hover:bg-blue-50'
            >
              <RefreshCw className='w-4 h-4 mr-2' />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {error && (
          <Alert className='border-red-200 bg-red-50'>
            <XCircle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-800'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className='border-green-200 bg-green-50'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>
              {success}
            </AlertDescription>
          </Alert>
        )}

        {config && (
          <>
            {/* Configuration Details */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-600'>
                  SMTP Host
                </label>
                <div className='p-3   rounded-lg border'>
                  <span className='text-sm font-mono'>{config.host}</span>
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-600'>
                  Port
                </label>
                <div className='p-3   rounded-lg border'>
                  <span className='text-sm font-mono'>{config.port}</span>
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-600'>
                  Secure Connection
                </label>
                <div className='p-3   rounded-lg border'>
                  <span className='text-sm font-mono'>{config.secure}</span>
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-600'>
                  From Email
                </label>
                <div className='p-3   rounded-lg border'>
                  <span className='text-sm font-mono'>{config.fromEmail}</span>
                </div>
              </div>
            </div>

            {/* Email Account */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-600'>
                Email Account
              </label>
              <div className='p-3   rounded-lg border flex items-center justify-between'>
                <span className='text-sm font-mono'>{config.user}</span>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='text-xs'>
                    {config.hasPassword ? 'Password Set' : 'No Password'}
                  </Badge>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowPassword(!showPassword)}
                    className='p-1 h-auto'
                  >
                    {showPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
