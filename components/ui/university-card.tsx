import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, MapPin, Star, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { University } from '@/types/university';
import { getUniversityName } from '@/utils/multilingual';

interface UniversityCardProps {
  university: University;
  locale?: string;
  onSelect?: (university: University) => void;
  onEdit?: (university: University) => void;
  onDelete?: (university: University) => void;
  showActions?: boolean;
  isSelected?: boolean;
  showCheckbox?: boolean;
  className?: string;
}

export function UniversityCard({
  university,
  locale = 'en',
  onSelect,
  onEdit,
  onDelete,
  showActions = false,
  isSelected = false,
  showCheckbox = false,
  className = '',
}: UniversityCardProps) {
  const universityName = getUniversityName(university, locale);
  const universityImage =
    university.config?.logo || '/images/Placehold/university-placeholder.png';

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'ring-2 ring-primary bg-primary/5 shadow-lg scale-105'
          : 'hover:scale-105 hover:shadow-lg'
      } ${className}`}
      onClick={() => onSelect?.(university)}
    >
      <div className='relative'>
        <div className='aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 to-primary/5'>
          <Image
            src={universityImage}
            alt={universityName}
            width={400}
            height={300}
            className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-300'
          />
        </div>

        {/* Overlay with gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

        {/* University badge */}
        <div className='absolute top-3 right-3'>
          <Badge
            variant='secondary'
            className='bg-white/95 text-black font-medium shadow-md'
          >
            University
          </Badge>
        </div>

        {/* Checkbox if enabled */}
        {showCheckbox && (
          <div className='absolute top-3 left-3'>
            <Checkbox
              checked={isSelected}
              onChange={() => onSelect?.(university)}
              className='bg-white/90 border-white'
            />
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className='absolute top-3 left-3'>
            <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
              <Star className='h-4 w-4 text-white fill-white' />
            </div>
          </div>
        )}
      </div>

      <CardHeader className='pb-3'>
        <CardTitle className='text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors'>
          {universityName}
        </CardTitle>
        <p className='text-sm text-muted-foreground'>
          Higher Education Institution
        </p>
      </CardHeader>

      <CardContent className='pt-0'>
        <div className='grid grid-cols-2 gap-3 mb-4'>
          {university.colleges && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg'>
              <GraduationCap className='h-4 w-4 text-primary' />
              <span className='font-medium'>{university.colleges.length}</span>
              <span className='text-xs'>colleges</span>
            </div>
          )}
          {university.sections && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg'>
              <Building2 className='h-4 w-4 text-primary' />
              <span className='font-medium'>{university.sections.length}</span>
              <span className='text-xs'>sections</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className='flex gap-2'>
            {onSelect && (
              <Button
                size='sm'
                onClick={e => {
                  e.stopPropagation();
                  onSelect(university);
                }}
                className='flex-1'
                variant={isSelected ? 'default' : 'outline'}
              >
                {isSelected ? 'Selected' : 'Select'}
              </Button>
            )}
            {onEdit && (
              <Button
                size='sm'
                variant='outline'
                onClick={e => {
                  e.stopPropagation();
                  onEdit(university);
                }}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                size='sm'
                variant='destructive'
                onClick={e => {
                  e.stopPropagation();
                  onDelete(university);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UniversityCard;
