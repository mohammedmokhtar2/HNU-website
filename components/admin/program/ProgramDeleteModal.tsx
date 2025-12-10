'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Trash2,
  Building2,
  Image as ImageIcon,
  Video,
  FileText,
} from 'lucide-react';
import { ProgramWithRelations } from '@/types/program';
import { ProgramService } from '@/services/program.service';
import { useToast } from '@/hooks/use-toast';

interface ProgramDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
  program: ProgramWithRelations | null;
}

export function ProgramDeleteModal({
  open,
  onOpenChange,
  onDeleted,
  program,
}: ProgramDeleteModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!program) return;

    try {
      setLoading(true);
      await ProgramService.deleteProgram(program.id);

      toast({
        title: 'Success',
        description: 'Program deleted successfully',
      });

      onDeleted();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to delete program',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!program) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <AlertTriangle className='h-5 w-5' />
            Delete Program
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex items-center gap-2 p-3 bg-muted rounded-lg'>
            <AlertTriangle className='h-4 w-4 text-destructive' />
            <p className='text-sm font-medium'>
              Are you sure you want to delete this program?
            </p>
          </div>

          <div className='space-y-3'>
            <div>
              <h4 className='font-medium text-sm mb-1'>Program Details:</h4>
              <div className='space-y-2'>
                <div>
                  <p className='font-medium'>
                    {program.name?.en || program.name?.ar || 'Untitled Program'}
                  </p>
                  {program.name?.ar && program.name?.en && (
                    <p className='text-sm text-muted-foreground'>
                      {program.name.ar}
                    </p>
                  )}
                </div>

                {program.collage && (
                  <div className='flex items-center gap-2 text-sm'>
                    <Building2 className='h-4 w-4 text-muted-foreground' />
                    <span>
                      {(program.collage.name as any)?.en ||
                        (program.collage.name as any)?.ar ||
                        program.collage.slug}
                    </span>
                  </div>
                )}

                {program.config?.degree && (
                  <Badge variant='secondary' className='text-xs'>
                    {program.config.degree}
                  </Badge>
                )}

                {/* File Information */}
                {(program.config?.images?.length ||
                  program.config?.videos?.length ||
                  program.config?.pdfs?.length) && (
                  <div className='space-y-2'>
                    <p className='text-xs font-medium text-muted-foreground'>
                      Attached Files:
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {program.config?.images?.length && (
                        <Badge
                          variant='outline'
                          className='text-xs flex items-center gap-1'
                        >
                          <ImageIcon className='h-3 w-3' />
                          {program.config.images.length} image
                          {program.config.images.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      {program.config?.videos?.length && (
                        <Badge
                          variant='outline'
                          className='text-xs flex items-center gap-1'
                        >
                          <Video className='h-3 w-3' />
                          {program.config.videos.length} video
                          {program.config.videos.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      {program.config?.pdfs?.length && (
                        <Badge
                          variant='outline'
                          className='text-xs flex items-center gap-1'
                        >
                          <FileText className='h-3 w-3' />
                          {program.config.pdfs.length} PDF
                          {program.config.pdfs.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
              <p className='text-sm text-destructive font-medium'>
                ⚠️ This action cannot be undone. The program will be permanently
                deleted.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={loading}
            className='gap-2'
          >
            <Trash2 className='h-4 w-4' />
            {loading ? 'Deleting...' : 'Delete Program'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
