'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ContactUsContent } from '@/types/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageService } from '@/services/message.service';
import {
  MessageConfig,
  MessageStatus,
  MessageType,
  MessagePriority,
} from '@/types/message';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { io, Socket } from 'socket.io-client';
import { getSocketConfig } from '@/lib/socket-config';

interface ContactUsSectionProps {
  sectionId: string;
  content: ContactUsContent;
}

export function ContactUsSection({
  sectionId,
  content,
}: ContactUsSectionProps) {
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remaining: number;
    resetTime: number | null;
  } | null>(null);

  const getLocalizedText = (text: { ar: string; en: string }) => {
    return locale === 'ar' ? text.ar : text.en;
  };

  // Initialize socket connection
  useEffect(() => {
    const config = getSocketConfig();
    const socketInstance = io(config.url, {
      path: config.path,
      transports: config.transports,
      autoConnect: config.autoConnect,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socketInstance.on('connect_error', error => {
      console.error('Socket connection error:', error);
    });

    socketInstance.on('error', error => {
      console.error('Socket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Handle rate limit information
  const handleRateLimitError = (error: any) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.data?.retryAfter;
      const resetTime = retryAfter ? Date.now() + retryAfter * 1000 : null;

      setRateLimitInfo({
        remaining: 0,
        resetTime,
      });

      setSubmitStatus('error');
      setErrorMessage(
        retryAfter
          ? `${getLocalizedText(content.errorMessage)} Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
          : getLocalizedText(content.errorMessage)
      );
    } else {
      setSubmitStatus('error');
      setErrorMessage(getLocalizedText(content.errorMessage));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Create message config for the contact form
      const messageConfig: MessageConfig = {
        from: formData.email,
        to: content.adminEmail,
        subject: `Contact Form: ${formData.subject}`,
        body: `
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
This message was sent from the contact form on the website.
        `,
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Contact Form Submission
            </h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Subject:</strong> ${formData.subject}</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${formData.message}</p>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 12px; text-align: center;">
              This message was sent from the contact form on the website.
            </p>
          </div>
        `,
        status: MessageStatus.PENDING,
        type: MessageType.EMAIL,
        priority: MessagePriority.NORMAL,
        retryCount: 0,
        maxRetries: 3,
        metadata: {
          source: 'contact_form',
          sectionId: sectionId,
          userAgent:
            typeof window !== 'undefined' ? window.navigator.userAgent : '',
          timestamp: new Date().toISOString(),
        },
      };

      // Create the message using the message service
      await MessageService.createMessage({ messageConfig });

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      handleRateLimitError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            {getLocalizedText(content.title)}
          </h2>
          <p className='text-xl text-gray-600 mb-2'>
            {getLocalizedText(content.subtitle)}
          </p>
          <p className='text-gray-500 max-w-2xl mx-auto'>
            {getLocalizedText(content.description)}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto'>
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Mail className='w-5 h-5' />
                {getLocalizedText(content.formTitle)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label htmlFor='name'>
                    {getLocalizedText(content.nameLabel)}
                  </Label>
                  <Input
                    id='name'
                    name='name'
                    type='text'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='mt-1'
                  />
                </div>

                <div>
                  <Label htmlFor='email'>
                    {getLocalizedText(content.emailLabel)}
                  </Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='mt-1'
                  />
                </div>

                <div>
                  <Label htmlFor='subject'>
                    {getLocalizedText(content.subjectLabel)}
                  </Label>
                  <Input
                    id='subject'
                    name='subject'
                    type='text'
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className='mt-1'
                  />
                </div>

                <div>
                  <Label htmlFor='message'>
                    {getLocalizedText(content.messageLabel)}
                  </Label>
                  <Textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className='mt-1'
                  />
                </div>

                {submitStatus === 'success' && (
                  <Alert className='border-green-200 bg-green-50'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                    <AlertDescription className='text-green-800'>
                      {getLocalizedText(content.successMessage)}
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === 'error' && (
                  <Alert className='border-red-200 bg-red-50'>
                    <AlertCircle className='h-4 w-4 text-red-600' />
                    <AlertDescription className='text-red-800'>
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {rateLimitInfo && (
                  <Alert className='border-yellow-200 bg-yellow-50'>
                    <AlertCircle className='h-4 w-4 text-yellow-600' />
                    <AlertDescription className='text-yellow-800'>
                      {rateLimitInfo.remaining === 0
                        ? `Rate limit exceeded. Please try again ${rateLimitInfo.resetTime ? `in ${Math.ceil((rateLimitInfo.resetTime - Date.now()) / 60000)} minutes` : 'later'}.`
                        : `${rateLimitInfo.remaining} submissions remaining.`}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type='submit'
                  disabled={isSubmitting || rateLimitInfo?.remaining === 0}
                  className='w-full'
                >
                  {isSubmitting ? (
                    <>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                      {locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className='w-4 h-4 mr-2' />
                      {getLocalizedText(content.submitButtonText)}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {content.showContactInfo && content.contactInfo && (
            <Card>
              <CardHeader>
                <CardTitle>{getLocalizedText(content.title)}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {content.contactInfo.phone && (
                  <div className='flex items-start gap-3'>
                    <Phone className='w-5 h-5 text-blue-600 mt-1' />
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-1'>
                        {locale === 'ar' ? 'الهاتف' : 'Phone'}
                      </h3>
                      <p className='text-gray-600'>
                        {getLocalizedText(content.contactInfo.phone)}
                      </p>
                    </div>
                  </div>
                )}

                {content.contactInfo.email && (
                  <div className='flex items-start gap-3'>
                    <Mail className='w-5 h-5 text-blue-600 mt-1' />
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-1'>
                        {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </h3>
                      <p className='text-gray-600'>
                        {getLocalizedText(content.contactInfo.email)}
                      </p>
                    </div>
                  </div>
                )}

                {content.contactInfo.address && (
                  <div className='flex items-start gap-3'>
                    <MapPin className='w-5 h-5 text-blue-600 mt-1' />
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-1'>
                        {locale === 'ar' ? 'العنوان' : 'Address'}
                      </h3>
                      <p className='text-gray-600'>
                        {getLocalizedText(content.contactInfo.address)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
