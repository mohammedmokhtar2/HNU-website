'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Building2,
  GraduationCap,
  Calendar,
  Image as ImageIcon,
  Video,
  FileText,
} from 'lucide-react';
import { ProgramWithRelations } from '@/types/program';
import Image from 'next/image';

interface ProgramTableProps {
  programs: ProgramWithRelations[];
  onEdit: (program: ProgramWithRelations) => void;
  onDelete: (program: ProgramWithRelations) => void;
}

export function ProgramTable({
  programs,
  onEdit,
  onDelete,
}: ProgramTableProps) {
  if (programs.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold mb-2'>No programs found</h3>
          <p className='text-muted-foreground'>
            No programs match your current filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow className='hover:bg-gray-200/10'>
            <TableHead className='text-white'>Program Name</TableHead>
            <TableHead className='text-white'>College</TableHead>
            <TableHead className='text-white'>Degree</TableHead>
            <TableHead className='text-white'>Duration</TableHead>
            <TableHead className='text-white'>Credits</TableHead>
            <TableHead className='text-white'>Files</TableHead>
            <TableHead className='text-white'>Created</TableHead>
            <TableHead className='text-white w-[50px]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map(program => (
            <TableRow key={program.id} className='hover:bg-gray-200/10'>
              <TableCell>
                <div className='space-y-1'>
                  <div className='font-medium text-white'>
                    {program.name?.en || program.name?.ar || 'Untitled Program'}
                  </div>
                  {program.name?.ar && program.name?.en && (
                    <div className='text-sm text-gray-400'>
                      {program.name.ar}
                    </div>
                  )}
                  {program.description && (
                    <div className='text-sm text-gray-400 line-clamp-2 max-w-xs'>
                      {program.description.en || program.description.ar}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* College */}
              <TableCell className='text-white'>
                {program.collage ? (
                  <div className='flex items-center gap-2'>
                    <Building2 className='h-4 w-4 text-white' />
                    <span className='truncate max-w-[200px]'>
                      {(program.collage.name as any)?.en ||
                        (program.collage.name as any)?.ar ||
                        program.collage.slug}
                    </span>
                  </div>
                ) : (
                  <span className='text-gray-400'>No college</span>
                )}
              </TableCell>

              {/* Degree */}
              <TableCell>
                {program.config?.degree ? (
                  <Badge className='text-xs text-white bg-gray-600 hover:bg-gray-700'>
                    <GraduationCap className='h-3 w-3 mr-1' />
                    {program.config.degree}
                  </Badge>
                ) : (
                  <span className='text-gray-400'>-</span>
                )}
              </TableCell>

              {/* Duration */}
              <TableCell>
                {program.config?.duration ? (
                  <Badge className='text-xs text-white bg-gray-600 hover:bg-gray-700'>
                    <Calendar className='h-3 w-3 mr-1' />
                    {program.config.duration}
                  </Badge>
                ) : (
                  <span className='text-gray-400'>-</span>
                )}
              </TableCell>

              {/* Credits */}
              <TableCell className='text-white'>
                {program.config?.credits ? (
                  <span className='text-sm'>{program.config.credits}</span>
                ) : (
                  <span className='text-gray-400'>-</span>
                )}
              </TableCell>

              {/* Files */}
              <TableCell className='text-white'>
                {program.config?.images?.length ||
                program.config?.videos?.length ||
                program.config?.pdfs?.length ? (
                  <div className='flex flex-wrap gap-1'>
                    {program.config?.images?.length && (
                      <Badge className='text-xs text-white bg-gray-600 hover:bg-gray-700 flex items-center gap-1'>
                        <ImageIcon className='h-3 w-3' />
                        {program.config.images.length}
                      </Badge>
                    )}
                    {program.config?.videos?.length && (
                      <Badge className='text-xs text-white bg-gray-600 hover:bg-gray-700 flex items-center gap-1'>
                        <Video className='h-3 w-3' />
                        {program.config.videos.length}
                      </Badge>
                    )}
                    {program.config?.pdfs?.length && (
                      <Badge className='text-xs text-white bg-gray-600 hover:bg-gray-700 flex items-center gap-1'>
                        <FileText className='h-3 w-3' />
                        {program.config.pdfs.length}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className='text-gray-400'>-</span>
                )}
              </TableCell>

              {/* Created Date */}
              <TableCell className='text-white'>
                <div className='text-sm'>
                  {new Date(program.createdAt).toLocaleDateString()}
                </div>
                <div className='text-xs text-gray-400'>
                  {new Date(program.createdAt).toLocaleTimeString()}
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='hover:bg-gray-500/10'
                    >
                      <MoreHorizontal className='h-4 w-4 text-white' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onEdit(program)}>
                      <Edit className='h-4 w-4 mr-2' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(program)}
                      className='text-destructive'
                    >
                      <Trash2 className='h-4 w-4 mr-2' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
