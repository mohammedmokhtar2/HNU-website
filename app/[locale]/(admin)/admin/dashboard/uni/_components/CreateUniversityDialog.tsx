'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { UniversityService } from '@/services/university.service';

const universitySchema = z.object({
  name: z.object({
    en: z
      .string()
      .min(1, 'English name is required')
      .max(100, 'Name must be less than 100 characters'),
    ar: z
      .string()
      .min(1, 'Arabic name is required')
      .max(100, 'Name must be less than 100 characters'),
  }),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
});

type UniversityFormData = z.infer<typeof universitySchema>;

interface CreateUniversityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateUniversityDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateUniversityDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const form = useForm<UniversityFormData>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      name: {
        en: '',
        ar: '',
      },
      slug: '',
    },
  });

  const handleSubmit = async (data: UniversityFormData) => {
    try {
      setIsSubmitting(true);

      await UniversityService.createUniversity({
        name: data.name,
        slug: data.slug,
        config: {
          logo: '',
          socialMedia: {},
          menuBuilder: {
            menuItems: [],
          },
        },
      });

      success('University created successfully');

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to create university');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-center'>
            Create New University
          </DialogTitle>
          <DialogDescription className='text-center'>
            Fill in the details to create a new university
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* University Name - English */}
              <FormField
                control={form.control}
                name='name.en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University Name (English)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., Helwan National University'
                        {...field}
                        onChange={e => {
                          field.onChange(e.target.value);
                          // Auto-generate slug from English name
                          if (e.target.value) {
                            const slug = generateSlug(e.target.value);
                            form.setValue('slug', slug);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* University Name - Arabic */}
              <FormField
                control={form.control}
                name='name.ar'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University Name (Arabic)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., جامعة حلوان الأهلية'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* URL Slug */}
            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., helwan-national-university'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className='text-sm text-gray-500'>
                    This will be used in the URL. Auto-generated from English
                    name.
                  </p>
                </FormItem>
              )}
            />

            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                Create University
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
