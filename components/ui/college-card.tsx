import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Building2,
  Users,
  GraduationCap,
  Calendar,
  MapPin,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { College } from '@/types/college';
import {
  getCollegeName,
  getCollegeDescription,
  getCollegeImage,
} from '@/utils/multilingual';

interface CollegeCardProps {
  college: College;
  locale?: string;
  onSelect?: (college: College) => void;
  onEdit?: (college: College) => void;
  onDelete?: (college: College) => void;
  showActions?: boolean;
  isSelected?: boolean;
  showCheckbox?: boolean;
  className?: string;
}

export function CollegeCard({
  college,
  locale = 'en',
  onSelect,
  onEdit,
  onDelete,
  showActions = false,
  isSelected = false,
  showCheckbox = false,
  className = '',
}: CollegeCardProps) {
  const collegeName = getCollegeName(college, locale);
  const collegeDescription = getCollegeDescription(college, locale);
  const collegeImage = getCollegeImage(college);

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'ring-2 ring-primary bg-primary/5 shadow-lg scale-105'
          : 'hover:scale-105 hover:shadow-lg'
      } ${className}`}
      onClick={() => onSelect?.(college)}
    >
      <div className='relative'>
        <div className='aspect-[4/3] w-full overflow-hidden rounded-t-lg'>
          <Image
            src={collegeImage}
            alt={collegeName}
            width={400}
            height={300}
            className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-300'
          />
        </div>

        {/* Overlay with gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

        {/* Type badge */}
        <div className='absolute top-3 right-3'>
          <Badge
            variant='secondary'
            className='bg-white/95 text-black font-medium shadow-md'
          >
            {college.type}
          </Badge>
        </div>

        {/* Checkbox if enabled */}
        {showCheckbox && (
          <div className='absolute top-3 left-3'>
            <Checkbox
              checked={isSelected}
              onChange={() => onSelect?.(college)}
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
          {collegeName}
        </CardTitle>
        {collegeDescription && (
          <p className='text-sm text-muted-foreground line-clamp-3 leading-relaxed'>
            {collegeDescription}
          </p>
        )}
      </CardHeader>

      <CardContent className='pt-0'>
        <div className='grid grid-cols-2 gap-3 mb-4'>
          {college.studentsCount && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg'>
              <Users className='h-4 w-4 text-primary' />
              <span className='font-medium'>
                {college.studentsCount.toLocaleString()}
              </span>
              <span className='text-xs'>students</span>
            </div>
          )}
          {college.programsCount && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg'>
              <GraduationCap className='h-4 w-4 text-primary' />
              <span className='font-medium'>{college.programsCount}</span>
              <span className='text-xs'>programs</span>
            </div>
          )}
          {college.facultyCount && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg'>
              <Building2 className='h-4 w-4 text-primary' />
              <span className='font-medium'>{college.facultyCount}</span>
              <span className='text-xs'>faculty</span>
            </div>
          )}
          {college.establishedYear && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg'>
              <Calendar className='h-4 w-4 text-primary' />
              <span className='font-medium'>
                Est. {college.establishedYear}
              </span>
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
                  onSelect(college);
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
                  onEdit(college);
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
                  onDelete(college);
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

export default CollegeCard;
