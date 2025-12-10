import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <div className='relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-6'>
            <Skeleton className='h-16 w-3/4' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-5/6' />
            <Skeleton className='h-6 w-4/5' />
            <div className='flex gap-4 mt-8'>
              <Skeleton className='h-12 w-32' />
              <Skeleton className='h-12 w-32' />
            </div>
          </div>
          <div className='relative'>
            <Skeleton className='h-96 w-full rounded-lg' />
          </div>
        </div>
      </div>
    </div>
  );
}

// About Section Skeleton
export function AboutSkeleton() {
  return (
    <div className='py-20 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <Skeleton className='h-12 w-64 mx-auto mb-4' />
          <Skeleton className='h-6 w-96 mx-auto' />
        </div>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-4'>
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-5/6' />
            <Skeleton className='h-6 w-4/5' />
            <Skeleton className='h-6 w-3/4' />
          </div>
          <Skeleton className='h-80 w-full rounded-lg' />
        </div>
      </div>
    </div>
  );
}

// Generic Section Skeleton
export function SectionSkeleton() {
  return (
    <div className='py-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <Skeleton className='h-10 w-48 mx-auto mb-4' />
          <Skeleton className='h-5 w-80 mx-auto' />
        </div>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='space-y-4'>
              <Skeleton className='h-48 w-full rounded-lg' />
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Page Loading Skeleton
export function PageSkeleton() {
  return (
    <div className='min-h-screen'>
      <HeroSkeleton />
      <AboutSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}

export { Skeleton };
