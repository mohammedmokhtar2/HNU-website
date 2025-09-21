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
} from 'lucide-react';
import { ProgramWithRelations } from '@/types/program';

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
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">No programs found</h3>
                    <p className="text-muted-foreground">
                        No programs match your current filters.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Program Name</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Degree</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {programs.map((program) => (
                        <TableRow key={program.id} className="hover:bg-muted/50">
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="font-medium">
                                        {program.name?.en || program.name?.ar || 'Untitled Program'}
                                    </div>
                                    {program.name?.ar && program.name?.en && (
                                        <div className="text-sm text-muted-foreground">
                                            {program.name.ar}
                                        </div>
                                    )}
                                    {program.description && (
                                        <div className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                                            {program.description.en || program.description.ar}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                {program.collage ? (
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate max-w-[200px]">
                                            {(program.collage.name as any)?.en || (program.collage.name as any)?.ar || program.collage.slug}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">No college</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {program.config?.degree ? (
                                    <Badge variant="secondary" className="text-xs">
                                        <GraduationCap className="h-3 w-3 mr-1" />
                                        {program.config.degree}
                                    </Badge>
                                ) : (
                                    <span className="text-muted-foreground">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {program.config?.duration ? (
                                    <Badge variant="outline" className="text-xs">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {program.config.duration}
                                    </Badge>
                                ) : (
                                    <span className="text-muted-foreground">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {program.config?.credits ? (
                                    <span className="text-sm">{program.config.credits}</span>
                                ) : (
                                    <span className="text-muted-foreground">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    {new Date(program.createdAt).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {new Date(program.createdAt).toLocaleTimeString()}
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
