'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    BookOpen,
    Calendar,
    GraduationCap,
} from 'lucide-react';
import { ProgramWithRelations } from '@/types/program';

interface ProgramGridViewProps {
    programs: ProgramWithRelations[];
    onEdit: (program: ProgramWithRelations) => void;
    onDelete: (program: ProgramWithRelations) => void;
}

export function ProgramGridView({
    programs,
    onEdit,
    onDelete,
}: ProgramGridViewProps) {
    if (programs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No programs found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                    No programs match your current filters. Try adjusting your search criteria or create a new program.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {programs.map((program) => (
                <Card key={program.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                                    {program.name?.en || program.name?.ar || 'Untitled Program'}
                                </CardTitle>
                                {program.name?.ar && program.name?.en && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {program.name.ar}
                                    </p>
                                )}
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onEdit(program)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete(program)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Description */}
                        {program.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {program.description.en || program.description.ar || 'No description'}
                            </p>
                        )}

                        {/* College Info */}
                        {program.collage && (
                            <div className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">
                                    {(program.collage.name as any)?.en || (program.collage.name as any)?.ar || program.collage.slug}
                                </span>
                            </div>
                        )}

                        {/* Program Config */}
                        {program.config && (
                            <div className="space-y-2">
                                {program.config.degree && (
                                    <Badge variant="secondary" className="text-xs">
                                        <GraduationCap className="h-3 w-3 mr-1" />
                                        {program.config.degree}
                                    </Badge>
                                )}
                                {program.config.duration && (
                                    <Badge variant="outline" className="text-xs">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {program.config.duration}
                                    </Badge>
                                )}
                                {program.config.credits && (
                                    <Badge variant="outline" className="text-xs">
                                        {program.config.credits} credits
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Links */}
                        {program.config?.links && program.config.links.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Links:</p>
                                <div className="space-y-1">
                                    {program.config.links.slice(0, 2).map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline block truncate"
                                        >
                                            {link.title}
                                        </a>
                                    ))}
                                    {program.config.links.length > 2 && (
                                        <p className="text-xs text-muted-foreground">
                                            +{program.config.links.length - 2} more
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Created Date */}
                        <div className="text-xs text-muted-foreground">
                            Created: {new Date(program.createdAt).toLocaleDateString()}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
