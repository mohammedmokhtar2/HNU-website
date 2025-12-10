'use client';

import React from 'react';
import { BlogWithRelations } from '@/types/blog';
import { BlogCard } from './BlogCard';
import { Card, CardContent } from '@/components/ui/card';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

interface BlogGridViewProps {
  blogs: BlogWithRelations[];
  loading: boolean;
  error: string | null;
  onEdit: (blog: BlogWithRelations) => void;
  onDelete: (blog: BlogWithRelations) => void;
  onToggleFeatured: (blog: BlogWithRelations) => void;
  onTogglePublished: (blog: BlogWithRelations) => void;
  onReorder: (blogIds: string[]) => void;
}

export function BlogGridView({
  blogs,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
  onReorder,
}: BlogGridViewProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(blogs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedIds = items.map(blog => blog.id);
    onReorder(reorderedIds);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center h-32'>
            <div className='text-muted-foreground'>Loading blogs...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center h-32'>
            <div className='text-destructive'>Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (blogs.length === 0) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col items-center justify-center h-32 space-y-2'>
            <div className='text-muted-foreground'>No blogs found</div>
            <div className='text-sm text-muted-foreground'>
              Create your first blog to get started
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId='blogs' direction='vertical'>
        {provided => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          >
            {blogs.map((blog, index) => (
              <Draggable key={blog.id} draggableId={blog.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className='h-full'
                  >
                    <BlogCard
                      blog={blog}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleFeatured={onToggleFeatured}
                      onTogglePublished={onTogglePublished}
                      isDragging={snapshot.isDragging}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
