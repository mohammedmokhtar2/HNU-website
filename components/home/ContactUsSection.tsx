import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function ContactUsSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });

        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }, 1500);
    }
  };

  return (
    <section
      className='bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 px-4'
      id='contactUs'
    >
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-[#023e8a] mb-6 relative inline-block'>
            Contact Us
            {/* <span className="absolute bottom-0 left-0 w-full h-1 bg-[#023e8a] opacity-30 rounded-full"></span> */}
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Have questions or want to work together? Fill out the form below and
            we'll get back to you as soon as possible.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
          {/* Contact Information */}
          <div className='space-y-8'>
            <div className='bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-50'>
              <h3 className='text-2xl font-bold text-[#023e8a] mb-8 flex items-center'>
                <span className='w-2 h-8 bg-[#023e8a]  mr-4'></span>
                Get in Touch
              </h3>

              <div className='space-y-6'>
                <div className='flex items-start space-x-5 group'>
                  <div className='bg-[#023e8a]/10 p-4 rounded-xl group-hover:bg-[#023e8a]/20 transition-colors duration-300 flex-shrink-0'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-[#023e8a]'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                  <div className='pt-1'>
                    <h4 className='text-lg font-semibold text-gray-800 mb-1'>
                      Email
                    </h4>
                    <p className='text-gray-600 hover:text-[#023e8a] transition-colors duration-300'>
                      contact@company.com
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-5 group'>
                  <div className='bg-[#023e8a]/10 p-4 rounded-xl group-hover:bg-[#023e8a]/20 transition-colors duration-300 flex-shrink-0'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-[#023e8a]'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                      />
                    </svg>
                  </div>
                  <div className='pt-1'>
                    <h4 className='text-lg font-semibold text-gray-800 mb-1'>
                      Phone
                    </h4>
                    <p className='text-gray-600 hover:text-[#023e8a] transition-colors duration-300'>
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-5 group'>
                  <div className='bg-[#023e8a]/10 p-4 rounded-xl group-hover:bg-[#023e8a]/20 transition-colors duration-300 flex-shrink-0'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-[#023e8a]'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                  </div>
                  <div className='pt-1'>
                    <h4 className='text-lg font-semibold text-gray-800 mb-1'>
                      Address
                    </h4>
                    <p className='text-gray-600 hover:text-[#023e8a] transition-colors duration-300'>
                      123 Business Street
                      <br />
                      City, State 12345
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className='bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-50'>
              <h3 className='text-xl font-bold text-[#023e8a] mb-8 flex items-center'>
                <span className='w-2 h-6 bg-[#023e8a]  mr-4'></span>
                Follow Us
              </h3>
              <div className='flex space-x-4'>
                <a
                  href='https://youtube.com'
                  className='bg-[#023e8a]/10 hover:bg-[#023e8a] text-[#023e8a] hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
                  </svg>
                </a>

                <a
                  href='#'
                  className='bg-[#023e8a]/10 hover:bg-[#023e8a] text-[#023e8a] hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' />
                  </svg>
                </a>
                <a
                  href='#'
                  className='bg-[#023e8a]/10 hover:bg-[#023e8a] text-[#023e8a] hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                  </svg>
                </a>
                <a
                  href='#'
                  className='bg-[#023e8a]/10 hover:bg-[#023e8a] text-[#023e8a] hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z' />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300   flex flex-col'>
            <div className='flex-1 flex flex-col'>
              {isSubmitted ? (
                <div className='flex items-center justify-center flex-1'>
                  <div className='text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100  mb-6 mx-auto'>
                      <svg
                        className='w-8 h-8 text-green-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                    <h3 className='text-2xl font-bold text-[#023e8a] mb-4'>
                      Message Sent!
                    </h3>
                    <p className='text-gray-600 text-lg'>
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className='text-2xl font-bold text-[#023e8a] mb-8 flex items-center'>
                    <span className='w-2 h-8 bg-[#023e8a]  mr-4'></span>
                    Send us a Message
                  </h3>

                  <form
                    onSubmit={handleSubmit}
                    className='space-y-6 flex-1 flex flex-col'
                  >
                    <div className='space-y-2 flex-1'>
                      <label
                        htmlFor='name'
                        className='block text-sm font-semibold text-gray-700 uppercase tracking-wide'
                      >
                        Name
                      </label>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-[#023e8a]/20 focus:border-[#023e8a] transition-all duration-300 ${
                          errors.name
                            ? 'border-red-500'
                            : 'border-gray-200 hover:border-[#023e8a]/30'
                        }`}
                        placeholder='Your full name'
                      />
                      {errors.name && (
                        <p className='mt-1 text-sm text-red-500 font-medium'>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2 flex-1'>
                      <label
                        htmlFor='email'
                        className='block text-sm font-semibold text-gray-700 uppercase tracking-wide'
                      >
                        Email
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-[#023e8a]/20 focus:border-[#023e8a] transition-all duration-300 ${
                          errors.email
                            ? 'border-red-500'
                            : 'border-gray-200 hover:border-[#023e8a]/30'
                        }`}
                        placeholder='your.email@example.com'
                      />
                      {errors.email && (
                        <p className='mt-1 text-sm text-red-500 font-medium'>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2 flex-1'>
                      <label
                        htmlFor='subject'
                        className='block text-sm font-semibold text-gray-700 uppercase tracking-wide'
                      >
                        Subject
                      </label>
                      <input
                        type='text'
                        id='subject'
                        name='subject'
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-[#023e8a]/20 focus:border-[#023e8a] transition-all duration-300 ${
                          errors.subject
                            ? 'border-red-500'
                            : 'border-gray-200 hover:border-[#023e8a]/30'
                        }`}
                        placeholder='How can we help you?'
                      />
                      {errors.subject && (
                        <p className='mt-1 text-sm text-red-500 font-medium'>
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2 flex-1'>
                      <label
                        htmlFor='message'
                        className='block text-sm font-semibold text-gray-700 uppercase tracking-wide'
                      >
                        Message
                      </label>
                      <textarea
                        id='message'
                        name='message'
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-[#023e8a]/20 focus:border-[#023e8a] transition-all duration-300 resize-none ${
                          errors.message
                            ? 'border-red-500'
                            : 'border-gray-200 hover:border-[#023e8a]/30'
                        }`}
                        placeholder='Tell us about your project or question...'
                      />
                      {errors.message && (
                        <p className='mt-1 text-sm text-red-500 font-medium'>
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='mt-4 bg-[#023e8a] hover:bg-[#023e8a]/90 disabled:bg-[#023e8a]/70 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl'
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className=' -ml-1 mr-3 h-5 w-5 text-white inline-block'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUsSection;
