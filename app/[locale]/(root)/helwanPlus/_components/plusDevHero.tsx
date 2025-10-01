import React from 'react';
import { Cover } from '@/components/ui/cover';
import { ContainerTextFlip } from '@/components/ui/container-text-flip';

const plusDevHero = () => {
  // will display a 40% of the high screen a title with description only like meet our helwan plus dev team in a center of the page
  // uses the the contanier text flip component with the words in the description
  // and in the title will display the cover component with the text in the title like helwan pluse <cover>development team</cover>

  return (
    <section
      id='dev-team'
      className='py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black min-h-[40vh] flex items-center'
    >
      <div className='max-w-7xl mx-auto text-center'>
        <div className='space-y-8'>
          {/* Title with Cover Component */}
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-[#354eab] leading-tight'>
            Helwan Plus <Cover>Development Team</Cover>
          </h1>

          {/* Description with ContainerTextFlip */}
          <div className='max-w-4xl mx-auto'>
            <p className='text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4'>
              Meet our talented developers who bring ideas to life with
            </p>
            <ContainerTextFlip
              words={['innovation', 'creativity', 'excellence', 'passion']}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default plusDevHero;
