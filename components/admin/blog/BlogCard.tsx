'use client';

import React from 'react';
import { BlogWithRelations } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Star,
    Eye,
    EyeOff,
    ExternalLink,
    Calendar,
    User,
    Building,
    GripVertical
} from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { getMultilingualText } from '@/utils/multilingual';

interface BlogCardProps {
    blog: BlogWithRelations;
    onEdit: (blog: BlogWithRelations) => void;
    onDelete: (blog: BlogWithRelations) => void;
    onToggleFeatured: (blog: BlogWithRelations) => void;
    onTogglePublished: (blog: BlogWithRelations) => void;
    isDragging?: boolean;
    dragHandleProps?: any;
}

export function BlogCard({
    blog,
    onEdit,
    onDelete,
    onToggleFeatured,
    onTogglePublished,
    isDragging = false,
    dragHandleProps,
}: BlogCardProps) {
    const getBlogTitle = (blog: BlogWithRelations): string => {
        if (typeof blog.title === 'object' && blog.title !== null) {
            return (blog.title as any).en || (blog.title as any).ar || 'Untitled';
        }
        return 'Untitled';
    };

    const getBlogExcerpt = (blog: BlogWithRelations): string => {
        if (typeof blog.content === 'object' && blog.content !== null) {
            const content = (blog.content as any).en || (blog.content as any).ar || '';
            return content.length > 150 ? content.substring(0, 150) + '...' : content;
        }
        return '';
    };

    const getBlogImage = (blog: BlogWithRelations) => {
        return blog.image && blog.image.length > 0 ? blog.image[0] : null;
    };

    const getAssociatedEntity = (blog: BlogWithRelations) => {
        if (blog.University) {
            return {
                type: 'university',
                name: getMultilingualText(blog.University.name as Record<string, any>, 'en', 'Unknown University')
            };
        }
        if (blog.collage) {
            return {
                type: 'college',
                name: getMultilingualText(blog.collage.name as Record<string, any>, 'en', 'Unknown College')
            };
        }
        return null;
    };

    const associatedEntity = getAssociatedEntity(blog);
    const blogImage = getBlogImage(blog);

    return (
        <Card
            className={`group hover:shadow-lg transition-all duration-300 ${isDragging ? 'opacity-50 scale-95' : ''
                } ${blog.isFeatured ? 'ring-2 ring-yellow-400 bg-yellow-50/50' : ''
                } ${!blog.isPublished ? 'bg-gray-50/50 border-gray-200' : ''
                }`}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {getBlogTitle(blog)}
                        </CardTitle>
                        {associatedEntity && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <Building className="h-3 w-3" />
                                <span className="truncate">{associatedEntity.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Drag Handle */}
                    {dragHandleProps && (
                        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-1">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Blog Image */}
                {blogImage ? (
                    <div className="aspect-video w-full relative overflow-hidden rounded-lg">
                        <Image
                            src={blogImage}
                            alt={getBlogTitle(blog)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                ) : (
                    <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">No Image</span>
                    </div>
                )}

                {/* Blog Content */}
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {getBlogExcerpt(blog)}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {blog.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{blog.tags.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                            </div>
                            {blog.createdBy && (
                                <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {blog.createdBy.name || blog.createdBy.email}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2">
                        {blog.isFeatured && (
                            <Badge variant="default" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                            </Badge>
                        )}
                        <Badge
                            variant={blog.isPublished ? "default" : "secondary"}
                            className="text-xs"
                        >
                            {blog.isPublished ? (
                                <>
                                    <Eye className="h-3 w-3 mr-1" />
                                    Published
                                </>
                            ) : (
                                <>
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Draft
                                </>
                            )}
                        </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                        {/* Fast Action Buttons */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant={blog.isFeatured ? "default" : "outline"}
                                size="sm"
                                onClick={() => onToggleFeatured(blog)}
                                className="h-8 px-2"
                                title={blog.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                            >
                                <Star className={`h-3 w-3 ${blog.isFeatured ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                                variant={blog.isPublished ? "default" : "outline"}
                                size="sm"
                                onClick={() => onTogglePublished(blog)}
                                className="h-8 px-2"
                                title={blog.isPublished ? 'Unpublish' : 'Publish'}
                            >
                                {blog.isPublished ? (
                                    <Eye className="h-3 w-3" />
                                ) : (
                                    <EyeOff className="h-3 w-3" />
                                )}
                            </Button>
                        </div>

                        {/* More Actions */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="ml-auto">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit(blog)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(blog)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
