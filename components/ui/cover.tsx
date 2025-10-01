'use client';
import React, { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { SparklesCore } from '@/components/ui/sparkles';

export const Cover = ({
  children,
  className,
  variant = 'default',
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'helwan' | 'gradient';
}) => {
  const [hovered, setHovered] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [beamPositions, setBeamPositions] = useState<number[]>([]);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current?.clientWidth ?? 0);

      const height = ref.current?.clientHeight ?? 0;
      const numberOfBeams = Math.floor(height / 8); // Reduced spacing for more beams
      const positions = Array.from(
        { length: numberOfBeams },
        (_, i) => (i + 1) * (height / (numberOfBeams + 1))
      );
      setBeamPositions(positions);
    }
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'helwan':
        return 'relative hover:bg-[#354eab] group/cover inline-block dark:bg-[#354eab]/20 bg-[#354eab]/10 px-3 py-2 transition-all duration-300 rounded-lg border border-[#354eab]/30 hover:border-[#354eab] hover:shadow-lg hover:shadow-[#354eab]/20';
      case 'gradient':
        return 'relative hover:bg-gradient-to-r hover:from-[#354eab] hover:to-[#ffce00] group/cover inline-block bg-gradient-to-r from-[#354eab]/10 to-[#ffce00]/10 px-3 py-2 transition-all duration-300 rounded-lg border border-[#354eab]/20 hover:border-[#ffce00]/50 hover:shadow-lg hover:shadow-[#354eab]/20';
      default:
        return 'relative hover:bg-neutral-900 group/cover inline-block dark:bg-neutral-900 bg-neutral-100 px-2 py-2 transition duration-200 rounded-sm';
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
      className={getVariantStyles()}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: 0.2,
              },
            }}
            className='h-full w-full overflow-hidden absolute inset-0'
          >
            <motion.div
              animate={{
                translateX: ['-50%', '0%'],
              }}
              transition={{
                translateX: {
                  duration: 10,
                  ease: 'linear',
                  repeat: Infinity,
                },
              }}
              className='w-[200%] h-full flex'
            >
              <SparklesCore
                background='transparent'
                minSize={0.4}
                maxSize={1}
                particleDensity={variant === 'helwan' ? 600 : 500}
                className='w-full h-full'
                particleColor={variant === 'helwan' ? '#ffce00' : '#FFFFFF'}
              />
              <SparklesCore
                background='transparent'
                minSize={0.4}
                maxSize={1}
                particleDensity={variant === 'helwan' ? 600 : 500}
                className='w-full h-full'
                particleColor={variant === 'helwan' ? '#354eab' : '#FFFFFF'}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {beamPositions.map((position, index) => (
        <Beam
          key={index}
          hovered={hovered}
          duration={Math.random() * 2 + 1}
          delay={Math.random() * 2 + 1}
          width={containerWidth}
          variant={variant}
          style={{
            top: `${position}px`,
          }}
        />
      ))}
      <motion.span
        key={String(hovered)}
        animate={{
          scale: hovered ? 0.8 : 1,
          x: hovered ? [0, -30, 30, -30, 30, 0] : 0,
          y: hovered ? [0, 30, -30, 30, -30, 0] : 0,
        }}
        exit={{
          filter: 'none',
          scale: 1,
          x: 0,
          y: 0,
        }}
        transition={{
          duration: 0.2,
          x: {
            duration: 0.2,
            repeat: Infinity,
            repeatType: 'loop',
          },
          y: {
            duration: 0.2,
            repeat: Infinity,
            repeatType: 'loop',
          },
          scale: {
            duration: 0.2,
          },
          filter: {
            duration: 0.2,
          },
        }}
        className={cn(
          'dark:text-white inline-block text-neutral-900 relative z-20 group-hover/cover:text-white transition duration-200',
          className
        )}
      >
        {children}
      </motion.span>
      <CircleIcon
        className='absolute -right-[2px] -top-[2px]'
        variant={variant}
      />
      <CircleIcon
        className='absolute -bottom-[2px] -right-[2px]'
        delay={0.4}
        variant={variant}
      />
      <CircleIcon
        className='absolute -left-[2px] -top-[2px]'
        delay={0.8}
        variant={variant}
      />
      <CircleIcon
        className='absolute -bottom-[2px] -left-[2px]'
        delay={1.6}
        variant={variant}
      />
    </div>
  );
};

export const Beam = ({
  className,
  delay,
  duration,
  hovered,
  width = 600,
  variant = 'default',
  ...svgProps
}: {
  className?: string;
  delay?: number;
  duration?: number;
  hovered?: boolean;
  width?: number;
  variant?: 'default' | 'helwan' | 'gradient';
} & React.ComponentProps<typeof motion.svg>) => {
  const id = useId();

  const getGradientColors = () => {
    switch (variant) {
      case 'helwan':
        return {
          start: '#ffce00',
          middle: '#354eab',
          end: '#ffce00',
        };
      case 'gradient':
        return {
          start: '#354eab',
          middle: '#ffce00',
          end: '#354eab',
        };
      default:
        return {
          start: '#2EB9DF',
          middle: '#3b82f6',
          end: '#3b82f6',
        };
    }
  };

  const colors = getGradientColors();

  return (
    <motion.svg
      width={width ?? '600'}
      height='1'
      viewBox={`0 0 ${width ?? '600'} 1`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('absolute inset-x-0 w-full', className)}
      {...svgProps}
    >
      <motion.path
        d={`M0 0.5H${width ?? '600'}`}
        stroke={`url(#svgGradient-${id})`}
      />

      <defs>
        <motion.linearGradient
          id={`svgGradient-${id}`}
          key={String(hovered)}
          gradientUnits='userSpaceOnUse'
          initial={{
            x1: '0%',
            x2: hovered ? '-10%' : '-5%',
            y1: 0,
            y2: 0,
          }}
          animate={{
            x1: '110%',
            x2: hovered ? '100%' : '105%',
            y1: 0,
            y2: 0,
          }}
          transition={{
            duration: hovered ? 0.5 : (duration ?? 2),
            ease: 'linear',
            repeat: Infinity,
            delay: hovered ? Math.random() * (1 - 0.2) + 0.2 : 0,
            repeatDelay: hovered ? Math.random() * (2 - 1) + 1 : (delay ?? 1),
          }}
        >
          <stop stopColor={colors.start} stopOpacity='0' />
          <stop stopColor={colors.middle} />
          <stop offset='1' stopColor={colors.end} stopOpacity='0' />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};

export const CircleIcon = ({
  className,
  delay,
  variant = 'default',
}: {
  className?: string;
  delay?: number;
  variant?: 'default' | 'helwan' | 'gradient';
}) => {
  const getCircleStyles = () => {
    switch (variant) {
      case 'helwan':
        return 'pointer-events-none animate-pulse group-hover/cover:hidden group-hover/cover:opacity-100 group h-2 w-2 rounded-full bg-[#354eab] opacity-30 group-hover/cover:bg-[#ffce00] group-hover/cover:opacity-100';
      case 'gradient':
        return 'pointer-events-none animate-pulse group-hover/cover:hidden group-hover/cover:opacity-100 group h-2 w-2 rounded-full bg-[#354eab] opacity-30 group-hover/cover:bg-[#ffce00] group-hover/cover:opacity-100';
      default:
        return 'pointer-events-none animate-pulse group-hover/cover:hidden group-hover/cover:opacity-100 group h-2 w-2 rounded-full bg-neutral-600 dark:bg-white opacity-20 group-hover/cover:bg-white';
    }
  };

  return <div className={cn(getCircleStyles(), className)}></div>;
};
