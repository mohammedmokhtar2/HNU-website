'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgram } from '@/contexts/ProgramContext';
import { useCollege } from '@/contexts/CollegeContext';
import { useUser } from '@/contexts/userContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Filter, BarChart3, Grid3X3, List } from 'lucide-react';
import { ProgramWithRelations } from '@/types/program';
import { ProgramTable } from './ProgramTable';
import { ProgramGridView } from './ProgramGridView';
import { ProgramDeleteModal } from './ProgramDeleteModal';
import { ProgramStats } from './ProgramStats';
import { ProgramCreateEditModal } from './ProgramCreateEditModal';

interface ProgramManagementPageProps {
  universityId?: string;
  collegeId?: string;
}

export function ProgramManagementPage({
  universityId,
  collegeId,
}: ProgramManagementPageProps) {
  const router = useRouter();
  const { user } = useUser();
  const { programs, loading, error, refetch } = useProgram();
  const { colleges } = useCollege();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'updatedAt'>(
    'createdAt'
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showStats, setShowStats] = useState(false);
  const [selectedProgram, setSelectedProgram] =
    useState<ProgramWithRelations | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter programs based on search and college selection
  const filteredPrograms = programs.filter(program => {
    const matchesSearch =
      searchTerm === '' ||
      program.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.name?.ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description?.en
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      program.description?.ar?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCollege =
      selectedCollege === 'all' || program.collageId === selectedCollege;

    return matchesSearch && matchesCollege;
  });

  // Sort programs
  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name?.en || a.name?.ar || '';
        bValue = b.name?.en || b.name?.ar || '';
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleCreateProgram = () => {
    setSelectedProgram(null);
    setShowCreateModal(true);
  };

  const handleEditProgram = (program: ProgramWithRelations) => {
    setSelectedProgram(program);
    setShowEditModal(true);
  };

  const handleDeleteProgram = (program: ProgramWithRelations) => {
    setSelectedProgram(program);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedProgram(null);
  };

  const handleProgramSaved = () => {
    handleModalClose();
    refetch();
  };

  const handleProgramDeleted = () => {
    handleModalClose();
    refetch();
  };

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <p className='text-destructive mb-4'>
            Error loading programs: {error}
          </p>
          <Button onClick={refetch} variant='outline'>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Programs Management
          </h1>
          <p className='text-muted-foreground'>
            Manage academic programs across all colleges
          </p>
        </div>
        <Button onClick={handleCreateProgram} className='gap-2'>
          <Plus className='h-4 w-4' />
          Add Program
        </Button>
      </div>

      {/* Stats Toggle */}
      <div className='flex items-center gap-4'>
        <Button
          variant={showStats ? 'default' : 'outline'}
          onClick={() => setShowStats(!showStats)}
          className='gap-2'
        >
          <BarChart3 className='h-4 w-4' />
          {showStats ? 'Hide' : 'Show'} Statistics
        </Button>
      </div>

      {/* Statistics */}
      {showStats && <ProgramStats />}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search programs...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            {/* College Filter */}
            <Select value={selectedCollege} onValueChange={setSelectedCollege}>
              <SelectTrigger>
                <SelectValue placeholder='Filter by college' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Colleges</SelectItem>
                {colleges.map(college => (
                  <SelectItem key={college.id} value={college.id}>
                    {college.name?.en || college.name?.ar || college.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='createdAt'>Created Date</SelectItem>
                <SelectItem value='updatedAt'>Updated Date</SelectItem>
                <SelectItem value='name'>Name</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Direction */}
            <Select
              value={sortDirection}
              onValueChange={(value: any) => setSortDirection(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Sort direction' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='desc'>Descending</SelectItem>
                <SelectItem value='asc'>Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                {loading ? (
                  <span className='flex items-center gap-2'>
                    <div className='animate-spin rounded-full h-3 w-3 border-b border-primary'></div>
                    Loading...
                  </span>
                ) : (
                  `${filteredPrograms.length} program${filteredPrograms.length !== 1 ? 's' : ''} found`
                )}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setViewMode('table')}
              >
                <List className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Programs Display */}
      <Card>
        <CardContent className='p-0'>
          {loading ? (
            <div className='flex items-center justify-center h-64'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
                <p className='text-muted-foreground'>Loading programs...</p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <ProgramGridView
              programs={sortedPrograms}
              onEdit={handleEditProgram}
              onDelete={handleDeleteProgram}
            />
          ) : (
            <ProgramTable
              programs={sortedPrograms}
              onEdit={handleEditProgram}
              onDelete={handleDeleteProgram}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ProgramCreateEditModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSaved={handleProgramSaved}
        program={null}
      />

      <ProgramCreateEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSaved={handleProgramSaved}
        program={selectedProgram}
      />

      <ProgramDeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onDeleted={handleProgramDeleted}
        program={selectedProgram}
      />
    </div>
  );
}
