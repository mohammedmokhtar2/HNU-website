'use client';

import { useUserActionTracking } from '@/hooks/use-user-action-tracking';
import { useState, useEffect } from 'react';

/**
 * Example component demonstrating user action tracking
 */
export function UserActionTrackingExample() {
  const {
    trackPageVisit,
    trackButtonClick,
    trackFormSubmit,
    trackSearch,
    trackCustomAction,
    isLoaded,
    user,
  } = useUserActionTracking();

  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Track page visit when component mounts
  useEffect(() => {
    if (isLoaded) {
      trackPageVisit('User Action Tracking Example');
    }
  }, [isLoaded, trackPageVisit]);

  const handleButtonClick = () => {
    trackButtonClick('example-button', 'Example Button');
    alert('Button clicked! Check the logs.');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackFormSubmit('example-form', formData);
    alert('Form submitted! Check the logs.');
  };

  const handleSearch = () => {
    trackSearch(searchQuery, { category: 'example' });
    alert(`Searching for: ${searchQuery}`);
  };

  const handleCustomAction = () => {
    trackCustomAction('CUSTOM_EXAMPLE_ACTION', {
      customData: 'This is custom tracking data',
      timestamp: new Date().toISOString(),
    });
    alert('Custom action tracked! Check the logs.');
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>User Action Tracking Example</h1>

      <div className='mb-6 p-4 bg-gray-100 rounded'>
        <h2 className='text-lg font-semibold mb-2'>User Status</h2>
        <p>
          {user ? (
            <>
              Logged in as:{' '}
              <strong>{user.emailAddresses[0]?.emailAddress}</strong>
            </>
          ) : (
            <strong>Guest User</strong>
          )}
        </p>
      </div>

      <div className='space-y-6'>
        {/* Button Click Tracking */}
        <div className='p-4 border rounded'>
          <h3 className='text-lg font-semibold mb-2'>Button Click Tracking</h3>
          <button
            onClick={handleButtonClick}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Track Button Click
          </button>
        </div>

        {/* Form Submission Tracking */}
        <div className='p-4 border rounded'>
          <h3 className='text-lg font-semibold mb-2'>
            Form Submission Tracking
          </h3>
          <form onSubmit={handleFormSubmit} className='space-y-2'>
            <input
              type='text'
              placeholder='Name'
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className='w-full p-2 border rounded'
            />
            <input
              type='email'
              placeholder='Email'
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='w-full p-2 border rounded'
            />
            <button
              type='submit'
              className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
            >
              Submit Form
            </button>
          </form>
        </div>

        {/* Search Tracking */}
        <div className='p-4 border rounded'>
          <h3 className='text-lg font-semibold mb-2'>Search Tracking</h3>
          <div className='flex space-x-2'>
            <input
              type='text'
              placeholder='Search query'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='flex-1 p-2 border rounded'
            />
            <button
              onClick={handleSearch}
              className='px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600'
            >
              Search
            </button>
          </div>
        </div>

        {/* Custom Action Tracking */}
        <div className='p-4 border rounded'>
          <h3 className='text-lg font-semibold mb-2'>Custom Action Tracking</h3>
          <button
            onClick={handleCustomAction}
            className='px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600'
          >
            Track Custom Action
          </button>
        </div>

        {/* Instructions */}
        <div className='p-4 bg-yellow-50 border border-yellow-200 rounded'>
          <h3 className='text-lg font-semibold mb-2'>How to View Logs</h3>
          <p className='text-sm text-gray-700'>
            After performing actions above, you can view the logs by:
          </p>
          <ul className='text-sm text-gray-700 mt-2 list-disc list-inside'>
            <li>
              Making a GET request to <code>/api/user-actions/logs</code>
            </li>
            <li>
              Checking your database <code>AuditLog</code> table
            </li>
            <li>Using the admin panel (if implemented)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
