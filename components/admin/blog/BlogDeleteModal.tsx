'use client';

import React from 'react';
import { BlogWithRelations } from '@/types/blog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface BlogDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    blog: BlogWithRelations | null;
    onConfirm: () => void;
}

export function BlogDeleteModal({
    isOpen,
    onClose,
    blog,
    onConfirm,
}: BlogDeleteModalProps) {
    if (!blog) return null;

    const getBlogTitle = (blog: BlogWithRelations): string => {
        if (typeof blog.title === 'object' && blog.title !== null) {
            return (blog.title as any).en || (blog.title as any).ar || 'Untitled';
        }
        return 'Untitled';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Blog
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this blog? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium text-sm mb-2">Blog Details:</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                            <div><strong>Title:</strong> {getBlogTitle(blog)}</div>
                            <div><strong>Slug:</strong> {blog.slug}</div>
                            <div><strong>Status:</strong> {blog.isPublished ? 'Published' : 'Draft'}</div>
                            {blog.isFeatured && (
                                <div><strong>Featured:</strong> Yes</div>
                            )}
                            {blog.University && (
                                <div><strong>University:</strong> {String(blog.University.name)}</div>
                            )}
                            {blog.collage && (
                                <div><strong>College:</strong> {String(blog.collage.name)}</div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Blog
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
