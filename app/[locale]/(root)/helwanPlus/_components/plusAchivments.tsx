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
    <section className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-[60vh] relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Gradient Orbs - Responsive sizing */}
        <div className='absolute top-10 sm:top-20 left-4 sm:left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gradient-to-r from-[#354eab]/20 to-[#ffce00]/20 rounded-full blur-xl animate-pulse'></div>
        <div className='absolute top-20 sm:top-40 right-8 sm:right-20 w-12 sm:w-20 lg:w-24 h-12 sm:h-20 lg:h-24 bg-gradient-to-r from-[#ffce00]/20 to-[#354eab]/20 rounded-full blur-lg animate-pulse delay-1000'></div>
        <div className='absolute bottom-10 sm:bottom-20 left-1/4 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-gradient-to-r from-[#354eab]/15 to-[#ffce00]/15 rounded-full blur-2xl animate-pulse delay-2000'></div>

        {/* Geometric Shapes - Hidden on mobile */}
        <div
          className='hidden sm:block absolute top-16 sm:top-32 right-1/3 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-[#354eab]/30 rotate-45 animate-spin'
          style={{ animationDuration: '20s' }}
        ></div>
        <div
          className='hidden sm:block absolute bottom-16 sm:bottom-32 left-1/3 w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 border-2 border-[#ffce00]/30 rotate-12 animate-bounce'
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
              backgroundSize: '30px 30px',
            }}
          ></div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-12 sm:mb-16'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 relative'>
            Our Achievements
            <div className='absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-[#354eab] to-[#ffce00] rounded-full'></div>
          </h2>
          <p className='text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4'>
            Discover the innovative projects and solutions we've built for the
            Helwan community
          </p>
        </div>

        <div className='relative overflow-hidden w-full h-full py-12 sm:py-16 lg:py-20'>
          <Carousel slides={plusAchivmentsData} startIndex={1} />
        </div>
      </div>
    </section>
  );
};

export default plusAchivments;
