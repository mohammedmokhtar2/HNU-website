'use client';

import React, { useState, useEffect, useId } from 'react';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ContainerTextFlipProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Additional CSS classes to apply to the text */
  textClassName?: string;
  /** Duration of the transition animation in milliseconds */
  animationDuration?: number;
  /** Theme variant for styling */
  variant?: 'default' | 'helwan' | 'gradient' | 'minimal';
}

export function ContainerTextFlip({
  words = ['better', 'modern', 'beautiful', 'awesome'],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
  variant = 'default',
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [width, setWidth] = useState(100);
  const textRef = React.useRef(null);

  const updateWidthForWord = () => {
    if (textRef.current) {
      // Add some padding to the text width (30px on each side)
      // @ts-expect-error - scrollWidth is not in the type definition but exists on DOM elements
      const textWidth = textRef.current.scrollWidth + 30;
      setWidth(textWidth);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'helwan':
        return [
          'relative inline-block rounded-xl pt-3 pb-4 text-center text-3xl font-bold text-white md:text-6xl',
          'bg-gradient-to-br from-[#354eab] via-[#354eab]/90 to-[#354eab]/80',
          'shadow-[0_8px_32px_rgba(53,78,171,0.3)] border border-[#354eab]/20',
          'backdrop-blur-sm hover:shadow-[0_12px_40px_rgba(53,78,171,0.4)] transition-all duration-300',
        ].join(' ');
      case 'gradient':
        return [
          'relative inline-block rounded-xl pt-3 pb-4 text-center text-3xl font-bold text-white md:text-6xl',
          'bg-gradient-to-br from-[#354eab] via-[#ffce00] to-[#354eab]',
          'shadow-[0_8px_32px_rgba(53,78,171,0.3)] border border-[#ffce00]/30',
          'backdrop-blur-sm hover:shadow-[0_12px_40px_rgba(255,206,0,0.4)] transition-all duration-300',
        ].join(' ');
      case 'minimal':
        return [
          'relative inline-block rounded-lg pt-2 pb-3 text-center text-2xl font-semibold text-[#354eab] md:text-5xl',
          'bg-transparent border-2 border-[#354eab]/30',
          'hover:border-[#354eab] hover:bg-[#354eab]/5 transition-all duration-300',
        ].join(' ');
      default:
        return [
          'relative inline-block rounded-lg pt-2 pb-3 text-center text-4xl font-bold text-black md:text-7xl dark:text-white',
          '[background:linear-gradient(to_bottom,#f3f4f6,#e5e7eb)]',
          'shadow-[inset_0_-1px_#d1d5db,inset_0_0_0_1px_#d1d5db,_0_4px_8px_#d1d5db]',
          'dark:[background:linear-gradient(to_bottom,#374151,#1f2937)]',
          'dark:shadow-[inset_0_-1px_#10171e,inset_0_0_0_1px_hsla(205,89%,46%,.24),_0_4px_8px_#00000052]',
        ].join(' ');
    }
  };

  useEffect(() => {
    // Update width whenever the word changes
    updateWidthForWord();
  }, [currentWordIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex(prevIndex => (prevIndex + 1) % words.length);
      // Width will be updated in the effect that depends on currentWordIndex
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <motion.p
      layout
      layoutId={`words-here-${id}`}
      animate={{ width }}
      transition={{ duration: animationDuration / 2000 }}
      className={cn(getVariantStyles(), className)}
      key={words[currentWordIndex]}
    >
      <motion.div
        transition={{
          duration: animationDuration / 1000,
          ease: 'easeInOut',
        }}
        className={cn('inline-block', textClassName)}
        ref={textRef}
        layoutId={`word-div-${words[currentWordIndex]}-${id}`}
      >
        <motion.div className='inline-block'>
          {words[currentWordIndex].split('').map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                filter: 'blur(10px)',
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
              }}
              transition={{
                delay: index * 0.02,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.p>
  );
}
