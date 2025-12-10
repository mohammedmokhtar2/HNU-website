import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Eye } from 'lucide-react';
import Image from 'next/image';

interface ImageCardProps {
  imageUrl: string;
  alt?: string;
  onRemove?: (imageUrl: string) => void;
  onView?: (imageUrl: string) => void;
  className?: string;
}

export function ImageCard({
  imageUrl,
  alt = 'Image',
  onRemove,
  onView,
  className = '',
}: ImageCardProps) {
  return (
    <Card
      className={`group relative overflow-hidden hover:shadow-lg transition-all duration-200 ${className}`}
    >
      <div className='aspect-square w-full overflow-hidden'>
        <Image
          src={imageUrl}
          alt={alt}
          width={200}
          height={200}
          className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-200'
        />
      </div>

      {/* Overlay with actions */}
      <div className='absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center'>
        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2'>
          {onView && (
            <Button
              size='sm'
              variant='secondary'
              onClick={() => onView(imageUrl)}
              className='bg-white/90 text-black hover:bg-white'
            >
              <Eye className='h-4 w-4' />
            </Button>
          )}
          {onRemove && (
            <Button
              size='sm'
              variant='destructive'
              onClick={() => onRemove(imageUrl)}
              className='bg-red-500/90 text-white hover:bg-red-600'
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ImageCard;
