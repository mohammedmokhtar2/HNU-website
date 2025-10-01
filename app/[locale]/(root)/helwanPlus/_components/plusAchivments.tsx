import React from 'react';
import Carousel from '@/components/ui/carousel';

const plusAchivmentsData = [
  {
    title: 'University Website Redesign',
    button: 'View Project',
    src: 'https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Student Portal Development',
    button: 'View Project',
    src: 'https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Mobile App Launch',
    button: 'View Project',
    src: 'https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'E-Learning Platform',
    button: 'View Project',
    src: 'https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const plusAchivments = () => {
  // this acchmivments page will display the  Carousel_examples will display them like the example but without the hocer effect that is in the example

  return (
    <section className='py-20 px-4 bg-gray-900 min-h-[60vh] relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Gradient Orbs */}
        <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#354eab]/20 to-[#ffce00]/20 rounded-full blur-xl animate-pulse'></div>
        <div className='absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-[#ffce00]/20 to-[#354eab]/20 rounded-full blur-lg animate-pulse delay-1000'></div>
        <div className='absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-[#354eab]/15 to-[#ffce00]/15 rounded-full blur-2xl animate-pulse delay-2000'></div>

        {/* Geometric Shapes */}
        <div
          className='absolute top-32 right-1/3 w-16 h-16 border-2 border-[#354eab]/30 rotate-45 animate-spin'
          style={{ animationDuration: '20s' }}
        ></div>
        <div
          className='absolute bottom-32 left-1/3 w-12 h-12 border-2 border-[#ffce00]/30 rotate-12 animate-bounce'
          style={{ animationDuration: '3s' }}
        ></div>

        {/* Subtle Grid Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='w-full h-full'
            style={{
              backgroundImage: `
              linear-gradient(rgba(53, 78, 171, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(53, 78, 171, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-6xl font-bold text-white mb-6 relative'>
            Our Achievements
            <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#354eab] to-[#ffce00] rounded-full'></div>
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Discover the innovative projects and solutions we've built for the
            Helwan community
          </p>
        </div>

        <div className='relative overflow-hidden w-full h-full py-20'>
          <Carousel slides={plusAchivmentsData} startIndex={1} />
        </div>
      </div>
    </section>
  );
};

export default plusAchivments;
