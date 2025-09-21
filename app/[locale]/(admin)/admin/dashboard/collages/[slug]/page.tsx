'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CollegeService, ProgramService } from '@/services';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CollegeConfig, CollegeType, Page, Section, Statistic, University, User } from '@/types';
import { Program, ProgramWithRelations, CreateProgramInput, UpdateProgramInput } from '@/types/program';
import { useUser } from '@/contexts/userContext';
import { useAuthStatus } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ImageSelectorModal } from '@/components/ui/image-selector-modal';
import { CollegeSectionManager } from '@/components/admin/CollegeSectionManager';
import { ProgramCreateEditModal } from '@/components/admin/program/ProgramCreateEditModal';
import { ProgramDeleteModal } from '@/components/admin/program/ProgramDeleteModal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Building2,
    Settings,
    Image as ImageIcon,
    FileText,
    FolderOpen,
    Plus,
    Edit,
    Globe,
    Palette,
    Upload,
    Facebook,
    Linkedin,
    Instagram,
    Music,
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    DollarSign,
    BarChart3,
    Trash2,
    Save,
    X,
    Search,
    Filter,
    Eye,
    MoreHorizontal,
    Grid3X3,
    List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CollegeResponse {
    id: string;
    slug: string;
    name: Record<string, any>;
    description?: Record<string, any>;
    config?: CollegeConfig;
    type: CollegeType;
    fees?: Record<string, string>;
    studentsCount?: number;
    programsCount?: number;
    facultyCount?: number;
    establishedYear?: number;
    createdById?: string;
    universityId?: string;
    createdAt: string;
    updatedAt: string;
}

interface CollegeWithRelationsResponse extends CollegeResponse {
    User?: User[];
    sections?: Section[];
    statistics?: Statistic[];
    programs?: any[];
    createdBy?: User;
    University?: University;
    Page?: Page[];
}

interface ConfigItem {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive?: boolean;
}

function CollegeConfigPage() {
    const params = useParams();
    const { slug } = params as { slug: string };
    const { canViewCollage } = useAuthStatus();
    const locale = useLocale();
    const { success, error: showError } = useToast();
    const queryClient = useQueryClient();

    // State management
    const [activeConfig, setActiveConfig] = useState('basic');
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState('');
    const [saving, setSaving] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [config, setConfig] = useState<CollegeConfig>({
        logoUrl: '',
        socialMedia: {},
    });

    // Programs state
    const [programs, setPrograms] = useState<ProgramWithRelations[]>([]);
    const [programsLoading, setProgramsLoading] = useState(false);
    const [programsError, setProgramsError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'updatedAt'>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [showStats, setShowStats] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<ProgramWithRelations | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch college data
    const { data: college, isLoading, isError } = useQuery({
        queryKey: ['college', slug],
        queryFn: () => CollegeService.getCollegeBySlug(slug),
    });

    const collegeData = college as unknown as CollegeWithRelationsResponse;

    // Update college mutation
    const updateCollegeMutation = useMutation({
        mutationFn: (data: any) =>
            CollegeService.updateCollege(collegeData?.id || '', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['college', slug] });
            success('College updated successfully!');
            setHasUnsavedChanges(false);
        },
        onError: (error) => {
            showError('Failed to update college. Please try again.');
            console.error('Error updating college:', error);
        },
    });

    // Initialize config when college data loads
    useEffect(() => {
        if (collegeData?.config) {
            setConfig(collegeData.config as CollegeConfig);
        }
    }, [collegeData]);

    // Fetch programs for this college
    const fetchPrograms = useCallback(async () => {
        if (!collegeData?.id) return;

        try {
            setProgramsLoading(true);
            setProgramsError(null);
            const response = await ProgramService.getProgramsByCollege(collegeData.id, {
                page: 1,
                limit: 100,
                orderBy: sortBy,
                orderDirection: sortDirection,
            });
            setPrograms(response.data);
        } catch (error) {
            setProgramsError(error instanceof Error ? error.message : 'Failed to fetch programs');
            console.error('Error fetching programs:', error);
        } finally {
            setProgramsLoading(false);
        }
    }, [collegeData?.id, sortBy, sortDirection]);

    // Fetch programs when college data is available
    useEffect(() => {
        if (collegeData?.id) {
            fetchPrograms();
        }
    }, [fetchPrograms, collegeData?.id]);

    // Authorization check
    if (!canViewCollage(collegeData?.id || '', slug)) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-400">You are not authorized to view this college</div>
            </div>
        );
    }

    const handleEdit = (field: string) => {
        setEditingField(field);
        if (field === 'name') {
            setEditingValue(
                locale === 'ar' ? collegeData?.name?.ar || '' : collegeData?.name?.en || ''
            );
        } else if (field === 'slug') {
            setEditingValue(collegeData?.slug || '');
        } else if (field === 'description') {
            setEditingValue(
                locale === 'ar' ? collegeData?.description?.ar || '' : collegeData?.description?.en || ''
            );
        }
    };

    const handleSave = async (field: string) => {
        if (!collegeData || !editingValue.trim()) {
            setEditingField(null);
            return;
        }

        try {
            setSaving(true);
            const updateData: any = {};

            if (field === 'name') {
                updateData.name = {
                    ...collegeData.name,
                    [locale]: editingValue.trim(),
                };
            } else if (field === 'slug') {
                updateData.slug = editingValue.trim();
            } else if (field === 'description') {
                updateData.description = {
                    ...collegeData.description,
                    [locale]: editingValue.trim(),
                };
            }

            await updateCollegeMutation.mutateAsync(updateData);
            setEditingField(null);
            setEditingValue('');
        } catch (error) {
            console.error('Error updating college:', error);
        } finally {
            setSaving(false);
        }
    };

    const updateConfig = (newConfig: CollegeConfig) => {
        setConfig(newConfig);
        setHasUnsavedChanges(true);
    };

    const saveAllChanges = async () => {
        if (!collegeData) return;

        try {
            setSaving(true);
            await updateCollegeMutation.mutateAsync({
                config: config,
            });
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setSaving(false);
        }
    };

    const resetChanges = () => {
        if (collegeData && collegeData.config) {
            setConfig(collegeData.config as CollegeConfig);
            setHasUnsavedChanges(false);
        }
    };

    const handleLogoSelect = (logoUrl: string) => {
        const newConfig = { ...config, logoUrl };
        updateConfig(newConfig);
    };

    const handleSocialMediaUpdate = (platform: string, value: string) => {
        const newConfig = {
            ...config,
            socialMedia: {
                ...(config.socialMedia || {}),
                [platform]: value,
            },
        };
        updateConfig(newConfig);
    };

    const handleTypeChange = (type: CollegeType) => {
        updateCollegeMutation.mutate({ type });
    };

    const handleFeesUpdate = (currency: string, value: string) => {
        const newFees = {
            ...(collegeData?.fees || {}),
            [currency]: value,
        };
        updateCollegeMutation.mutate({ fees: newFees });
    };

    const handleStatisticsUpdate = (field: string, value: number) => {
        const updateData: any = {};
        updateData[field] = value;
        updateCollegeMutation.mutate(updateData);
    };

    // Program management handlers
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
        fetchPrograms();
    };

    const handleProgramDeleted = () => {
        handleModalClose();
        fetchPrograms();
    };

    // Filter and sort programs
    const filteredPrograms = programs.filter((program) => {
        const matchesSearch = searchTerm === '' ||
            (program.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.name?.ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.description?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.description?.ar?.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearch;
    });

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

    const configItems: ConfigItem[] = [
        {
            id: 'basic',
            title: 'Basic Information',
            description: 'College name, slug, description, and type',
            icon: Building2,
            isActive: activeConfig === 'basic',
        },
        {
            id: 'config',
            title: 'Configuration',
            description: 'Logo, social media, and visual settings',
            icon: Settings,
            isActive: activeConfig === 'config',
        },
        {
            id: 'fees',
            title: 'Fees & Statistics',
            description: 'Tuition fees and college statistics',
            icon: DollarSign,
            isActive: activeConfig === 'fees',
        },
        {
            id: 'sections',
            title: 'Sections Management',
            description: 'Manage college sections and content',
            icon: FileText,
            isActive: activeConfig === 'sections',
        },
        {
            id: 'programs',
            title: 'Programs Management',
            description: 'Manage academic programs',
            icon: GraduationCap,
            isActive: activeConfig === 'programs',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-400">Loading college data...</div>
            </div>
        );
    }

    if (isError || !collegeData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-400">Error loading college data</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header with Logo and College Name */}
            <div className="border-b border-gray-700 py-4">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="flex items-center justify-center">
                        {config.logoUrl ? (
                            <Image
                                src={config.logoUrl}
                                alt="College Logo"
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                        ) : (
                            <Building2 className="h-6 w-6" />
                        )}
                    </div>

                    {/* College Name - Editable */}
                    <div>
                        <h1
                            className="text-2xl font-bold text-white cursor-pointer hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                            onDoubleClick={() => handleEdit('name')}
                        >
                            {editingField === 'name' ? (
                                <input
                                    type="text"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={() => handleSave('name')}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave('name')}
                                    className="text-2xl font-bold text-white bg-transparent border-none outline-none"
                                    autoFocus
                                    disabled={saving}
                                    aria-label="Edit college name"
                                />
                            ) : (
                                <span className={saving ? 'opacity-50' : ''}>
                                    {locale === 'ar' ? collegeData?.name?.ar : collegeData?.name?.en}
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-gray-300">
                            College Configuration Dashboard
                        </p>
                    </div>

                    {/* Slug Badge - Editable */}
                    <div className="ml-auto flex items-center gap-4">
                        <Badge
                            variant="outline"
                            className="border-gray-600 text-gray-300 cursor-pointer hover:bg-gray-700 px-2 py-1"
                            onDoubleClick={() => handleEdit('slug')}
                        >
                            <Globe className="h-3 w-3 mr-1" />
                            {editingField === 'slug' ? (
                                <input
                                    type="text"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={() => handleSave('slug')}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave('slug')}
                                    className="bg-transparent border-none outline-none text-sm text-white"
                                    autoFocus
                                    disabled={saving}
                                    aria-label="Edit college slug"
                                />
                            ) : (
                                <span className={saving ? 'opacity-50' : ''}>
                                    {collegeData?.slug}
                                </span>
                            )}
                        </Badge>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {hasUnsavedChanges && (
                                <Button
                                    onClick={resetChanges}
                                    variant="outline"
                                    disabled={saving}
                                    className="text-gray-300 hover:text-gray-100 border-gray-600"
                                >
                                    Reset
                                </Button>
                            )}
                            <Button
                                onClick={saveAllChanges}
                                disabled={!hasUnsavedChanges || saving}
                                className={cn(
                                    'transition-all duration-200',
                                    hasUnsavedChanges
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                )}
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Settings className="h-4 w-4 mr-2" />
                                        {hasUnsavedChanges ? 'Save All Changes' : 'No Changes'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content with Tabs */}
            <div className="p-6">
                <Tabs
                    value={activeConfig}
                    onValueChange={setActiveConfig}
                    className="w-full"
                >
                    {/* Tab Navigation */}
                    <TabsList className="grid w-full bg-transparent! grid-cols-5 mb-6">
                        {configItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <TabsTrigger
                                    key={item.id}
                                    value={item.id}
                                    className="flex items-center gap-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden sm:inline">{item.title}</span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {/* Tab Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Configuration Content */}
                        <div className="space-y-6">
                            <Card
                                className={cn(
                                    'bg-gray-800 border-gray-700 transition-all duration-200',
                                    hasUnsavedChanges ? 'border-blue-500 shadow-md' : ''
                                )}
                            >
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        {configItems.find((item) => item.id === activeConfig)?.title}
                                        {hasUnsavedChanges && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Basic Information Tab */}
                                    <TabsContent value="basic" className="mt-0">
                                        <div className="space-y-6">
                                            {/* College Type */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-200">
                                                    College Type
                                                </Label>
                                                <Select
                                                    value={collegeData?.type}
                                                    onValueChange={handleTypeChange}
                                                >
                                                    <SelectTrigger className="mt-1 bg-gray-800 text-white border-gray-600">
                                                        <SelectValue placeholder="Select college type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="TECHNICAL">Technical</SelectItem>
                                                        <SelectItem value="MEDICAL">Medical</SelectItem>
                                                        <SelectItem value="ARTS">Arts</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Description - Editable */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-200">
                                                    Description ({locale === 'ar' ? 'Arabic' : 'English'})
                                                </Label>
                                                <div
                                                    className="mt-2 p-3 border border-gray-600 rounded bg-gray-700 text-white cursor-pointer hover:bg-gray-600 transition-colors"
                                                    onDoubleClick={() => handleEdit('description')}
                                                >
                                                    {editingField === 'description' ? (
                                                        <Textarea
                                                            value={editingValue}
                                                            onChange={(e) => setEditingValue(e.target.value)}
                                                            onBlur={() => handleSave('description')}
                                                            onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSave('description')}
                                                            className="bg-transparent border-none outline-none text-white resize-none"
                                                            autoFocus
                                                            disabled={saving}
                                                            rows={4}
                                                            aria-label="Edit college description"
                                                        />
                                                    ) : (
                                                        <span className={saving ? 'opacity-50' : ''}>
                                                            {locale === 'ar' ? collegeData?.description?.ar || 'No description' : collegeData?.description?.en || 'No description'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Basic Information Display */}
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-200">
                                                        College Name (English)
                                                    </Label>
                                                    <div className="p-3 border border-gray-600 rounded bg-gray-700 text-white mt-1">
                                                        {collegeData?.name?.en}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-200">
                                                        College Name (Arabic)
                                                    </Label>
                                                    <div className="p-3 border border-gray-600 rounded bg-gray-700 text-white mt-1">
                                                        {collegeData?.name?.ar}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-200">
                                                        Slug
                                                    </Label>
                                                    <div className="p-3 border border-gray-600 rounded bg-gray-700 text-white mt-1">
                                                        {collegeData?.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Configuration Tab */}
                                    <TabsContent value="config" className="mt-0">
                                        <div className="space-y-6">
                                            {/* Logo Section */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-200">
                                                    College Logo
                                                </Label>
                                                <div className="mt-2 flex items-center gap-4">
                                                    {config.logoUrl ? (
                                                        <div className="relative group">
                                                            <div
                                                                className="relative w-20 h-20 cursor-pointer hover:opacity-80 transition-opacity border border-gray-600 rounded-lg overflow-hidden"
                                                                onClick={() => setShowImageModal(true)}
                                                            >
                                                                <Image
                                                                    src={config.logoUrl}
                                                                    alt="College Logo"
                                                                    width={80}
                                                                    height={80}
                                                                    className="object-contain"
                                                                />
                                                                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                                                                    <Edit className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600 z-10"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleLogoSelect('');
                                                                }}
                                                            >
                                                                ×
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-900 transition-colors"
                                                            onClick={() => setShowImageModal(true)}
                                                        >
                                                            <ImageIcon
                                                                className="h-8 w-8 text-gray-500"
                                                                aria-hidden="true"
                                                            />
                                                        </div>
                                                    )}
                                                    <Button
                                                        onClick={() => setShowImageModal(true)}
                                                        variant="outline"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        {config.logoUrl ? 'Change Logo' : 'Select Logo'}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Social Media */}
                                            <div className="space-y-4">
                                                <Label className="text-sm font-medium text-gray-200">
                                                    Social Media Links
                                                </Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Facebook */}
                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                                            <Facebook className="h-4 w-4 text-blue-600" />
                                                            Facebook
                                                        </Label>
                                                        <Input
                                                            value={config.socialMedia?.facebook || ''}
                                                            onChange={(e) =>
                                                                handleSocialMediaUpdate('facebook', e.target.value)
                                                            }
                                                            placeholder="https://facebook.com/yourpage"
                                                            className="mt-1 bg-gray-800 text-white border-gray-600"
                                                        />
                                                    </div>

                                                    {/* LinkedIn */}
                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                                            <Linkedin className="h-4 w-4 text-blue-700" />
                                                            LinkedIn
                                                        </Label>
                                                        <Input
                                                            value={config.socialMedia?.linkedin || ''}
                                                            onChange={(e) =>
                                                                handleSocialMediaUpdate('linkedin', e.target.value)
                                                            }
                                                            placeholder="https://linkedin.com/company/yourcompany"
                                                            className="mt-1 bg-gray-800 text-white border-gray-600"
                                                        />
                                                    </div>

                                                    {/* Instagram */}
                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                                            <Instagram className="h-4 w-4 text-pink-600" />
                                                            Instagram
                                                        </Label>
                                                        <Input
                                                            value={config.socialMedia?.instagram || ''}
                                                            onChange={(e) =>
                                                                handleSocialMediaUpdate('instagram', e.target.value)
                                                            }
                                                            placeholder="https://instagram.com/yourpage"
                                                            className="mt-1 bg-gray-800 text-white border-gray-600"
                                                        />
                                                    </div>

                                                    {/* TikTok */}
                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                                            <Music className="h-4 w-4 text-black" />
                                                            TikTok
                                                        </Label>
                                                        <Input
                                                            value={config.socialMedia?.tiktok || ''}
                                                            onChange={(e) =>
                                                                handleSocialMediaUpdate('tiktok', e.target.value)
                                                            }
                                                            placeholder="https://tiktok.com/@yourpage"
                                                            className="mt-1 bg-gray-800 text-white border-gray-600"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Fees & Statistics Tab */}
                                    <TabsContent value="fees" className="mt-0">
                                        <div className="space-y-6">
                                            {/* Fees Section */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-200 mb-4 block">
                                                    Tuition Fees
                                                </Label>
                                                <div className="space-y-3">
                                                    {Object.entries(collegeData?.fees || {}).map(([currency, amount]) => (
                                                        <div key={currency} className="flex gap-2">
                                                            <Input
                                                                value={currency}
                                                                onChange={(e) => {
                                                                    const newFees = { ...(collegeData?.fees || {}) };
                                                                    delete newFees[currency];
                                                                    newFees[e.target.value] = amount;
                                                                    updateCollegeMutation.mutate({ fees: newFees });
                                                                }}
                                                                placeholder="Currency (e.g., USD, EGP)"
                                                                className="flex-1 bg-gray-800 text-white border-gray-600"
                                                            />
                                                            <Input
                                                                value={amount}
                                                                onChange={(e) => handleFeesUpdate(currency, e.target.value)}
                                                                placeholder="Amount"
                                                                className="flex-2 bg-gray-800 text-white border-gray-600"
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const newFees = { ...(collegeData?.fees || {}) };
                                                                    delete newFees[currency];
                                                                    updateCollegeMutation.mutate({ fees: newFees });
                                                                }}
                                                                className="text-red-500"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newFees = {
                                                                ...(collegeData?.fees || {}),
                                                                'USD': '',
                                                            };
                                                            updateCollegeMutation.mutate({ fees: newFees });
                                                        }}
                                                        className="w-full bg-gray-800 text-white border-gray-600"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Fee
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Statistics Section */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-200 mb-4 block">
                                                    College Statistics
                                                </Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-blue-600" />
                                                            Students Count
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            value={collegeData?.studentsCount || ''}
                                                            onChange={(e) => handleStatisticsUpdate('studentsCount', parseInt(e.target.value) || 0)}
                                                            placeholder="Number of students"
                                                            className="mt-1 bg-gray-800 text-white border-gray-600"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                                            <GraduationCap className="h-4 w-4 text-green-600" />
                                                            Programs Count
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            value={collegeData?.programsCount || ''}
                                                            onChange={(e) => handleStatisticsUpdate('programsCount', parseInt(e.target.value) || 0)}
                                                            placeholder="Number of programs"
                                                            className="mt-1 bg-gray-800 text-white border-gray-600"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4 text-purple-600" />
                                                            Faculty Count
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            value={collegeData?.facultyCount || ''}
                                                            onChange={(e) => handleStatisticsUpdate('facultyCount', parseInt(e.target.value) || 0)}
                                                            placeholder="Number of faculty"
                                                            className="mt-1 bg-gray-800 text-white border-gray-600"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-orange-600" />
                                                            Established Year
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            value={collegeData?.establishedYear || ''}
                                                            onChange={(e) => handleStatisticsUpdate('establishedYear', parseInt(e.target.value) || 0)}
                                                            placeholder="Year established"
                                                            className="mt-1 bg-gray-800 text-white border-gray-600"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Sections Management Tab */}
                                    <TabsContent value="sections" className="mt-0">
                                        {collegeData ? (
                                            <CollegeSectionManager
                                                collegeId={collegeData.id}
                                                onSectionsChange={(sections) => {
                                                    console.log('College sections updated:', sections);
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-gray-400">No college data available</div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Programs Management Tab */}
                                    <TabsContent value="programs" className="mt-0">
                                        <div className="space-y-6">
                                            {/* Programs Header */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">Academic Programs</h3>
                                                    <p className="text-sm text-gray-400">
                                                        Manage programs for {collegeData?.name?.en || collegeData?.name?.ar}
                                                    </p>
                                                </div>
                                                <Button onClick={handleCreateProgram} className="gap-2">
                                                    <Plus className="h-4 w-4" />
                                                    Add Program
                                                </Button>
                                            </div>

                                            {/* Programs Stats Toggle */}
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    variant={showStats ? "default" : "outline"}
                                                    onClick={() => setShowStats(!showStats)}
                                                    className="gap-2"
                                                >
                                                    <BarChart3 className="h-4 w-4" />
                                                    {showStats ? 'Hide' : 'Show'} Statistics
                                                </Button>
                                            </div>

                                            {/* Programs Statistics */}
                                            {showStats && (
                                                <Card className="bg-gray-800 border-gray-700">
                                                    <CardHeader>
                                                        <CardTitle className="text-white">Program Statistics</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="text-center">
                                                                <div className="text-2xl font-bold text-blue-400">{programs.length}</div>
                                                                <div className="text-sm text-gray-400">Total Programs</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="text-2xl font-bold text-green-400">{filteredPrograms.length}</div>
                                                                <div className="text-sm text-gray-400">Filtered Results</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="text-2xl font-bold text-purple-400">
                                                                    {programs.filter(p => p.config?.degree).length}
                                                                </div>
                                                                <div className="text-sm text-gray-400">With Degree Info</div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {/* Programs Filters */}
                                            <Card className="bg-gray-800 border-gray-700">
                                                <CardHeader>
                                                    <CardTitle className="text-white flex items-center gap-2">
                                                        <Filter className="h-5 w-5" />
                                                        Filters & Search
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {/* Search */}
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                            <Input
                                                                placeholder="Search programs..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                className="pl-10 bg-gray-700 text-white border-gray-600"
                                                            />
                                                        </div>

                                                        {/* Sort By */}
                                                        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                                                            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                                                                <SelectValue placeholder="Sort by" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="createdAt">Created Date</SelectItem>
                                                                <SelectItem value="updatedAt">Updated Date</SelectItem>
                                                                <SelectItem value="name">Name</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        {/* Sort Direction */}
                                                        <Select value={sortDirection} onValueChange={(value: any) => setSortDirection(value)}>
                                                            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                                                                <SelectValue placeholder="Sort direction" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="desc">Descending</SelectItem>
                                                                <SelectItem value="asc">Ascending</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* View Mode Toggle */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-400">
                                                                {programsLoading ? (
                                                                    <span className="flex items-center gap-2">
                                                                        <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500"></div>
                                                                        Loading...
                                                                    </span>
                                                                ) : (
                                                                    `${filteredPrograms.length} program${filteredPrograms.length !== 1 ? 's' : ''} found`
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                                                size="sm"
                                                                onClick={() => setViewMode('grid')}
                                                            >
                                                                <Grid3X3 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant={viewMode === 'table' ? 'default' : 'outline'}
                                                                size="sm"
                                                                onClick={() => setViewMode('table')}
                                                            >
                                                                <List className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Programs Display */}
                                            <Card className="bg-gray-800 border-gray-700">
                                                <CardContent className="p-0">
                                                    {programsLoading ? (
                                                        <div className="flex items-center justify-center h-64">
                                                            <div className="text-center">
                                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                                                <p className="text-gray-400">Loading programs...</p>
                                                            </div>
                                                        </div>
                                                    ) : programsError ? (
                                                        <div className="flex items-center justify-center h-64">
                                                            <div className="text-center">
                                                                <p className="text-red-400 mb-4">Error loading programs: {programsError}</p>
                                                                <Button onClick={fetchPrograms} variant="outline">
                                                                    Try Again
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : sortedPrograms.length === 0 ? (
                                                        <div className="flex items-center justify-center h-64">
                                                            <div className="text-center">
                                                                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                                <p className="text-gray-400 mb-4">No programs found</p>
                                                                <Button onClick={handleCreateProgram} className="gap-2">
                                                                    <Plus className="h-4 w-4" />
                                                                    Add First Program
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : viewMode === 'grid' ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                                            {sortedPrograms.map((program) => (
                                                                <Card key={program.id} className="bg-gray-700 border-gray-600 hover:border-blue-500 transition-colors">
                                                                    <CardHeader className="pb-3">
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-1">
                                                                                <CardTitle className="text-white text-lg line-clamp-2">
                                                                                    {locale === 'ar' ? program.name?.ar : program.name?.en}
                                                                                </CardTitle>
                                                                                <p className="text-sm text-gray-400 mt-1">
                                                                                    {program.config?.degree && (
                                                                                        <Badge variant="outline" className="text-xs">
                                                                                            {program.config.degree}
                                                                                        </Badge>
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem onClick={() => handleEditProgram(program)}>
                                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                                        Edit
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        onClick={() => handleDeleteProgram(program)}
                                                                                        className="text-red-400"
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                                        Delete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                    </CardHeader>
                                                                    <CardContent className="pt-0">
                                                                        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                                                                            {locale === 'ar' ? program.description?.ar : program.description?.en || 'No description available'}
                                                                        </p>
                                                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                                                            <span>
                                                                                {program.config?.duration && (
                                                                                    <span className="flex items-center gap-1">
                                                                                        <Calendar className="h-3 w-3" />
                                                                                        {program.config.duration}
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                            <span>
                                                                                {program.config?.credits && (
                                                                                    <span className="flex items-center gap-1">
                                                                                        <BookOpen className="h-3 w-3" />
                                                                                        {program.config.credits} credits
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead className="bg-gray-700">
                                                                    <tr>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                                            Name
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                                            Degree
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                                            Duration
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                                            Credits
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                                            Created
                                                                        </th>
                                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                                            Actions
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-600">
                                                                    {sortedPrograms.map((program) => (
                                                                        <tr key={program.id} className="hover:bg-gray-700">
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div>
                                                                                    <div className="text-sm font-medium text-white">
                                                                                        {locale === 'ar' ? program.name?.ar : program.name?.en}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-400 line-clamp-2">
                                                                                        {locale === 'ar' ? program.description?.ar : program.description?.en}
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                {program.config?.degree ? (
                                                                                    <Badge variant="outline">{program.config.degree}</Badge>
                                                                                ) : (
                                                                                    <span className="text-gray-400">-</span>
                                                                                )}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                                                {program.config?.duration || '-'}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                                                {program.config?.credits || '-'}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                                                {new Date(program.createdAt).toLocaleDateString()}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                                <div className="flex items-center justify-end gap-2">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => handleEditProgram(program)}
                                                                                    >
                                                                                        <Edit className="h-4 w-4" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => handleDeleteProgram(program)}
                                                                                        className="text-red-400 hover:text-red-300"
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4" />
                                                                                    </Button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Management Section */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-blue-600" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-300">
                                            Quick access to college management features
                                        </p>
                                        <div className="grid grid-cols-1 gap-3">
                                            <Button
                                                variant="outline"
                                                className="justify-start"
                                                onClick={() => setActiveConfig('sections')}
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                Manage Sections
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="justify-start"
                                                onClick={() => setActiveConfig('programs')}
                                            >
                                                <GraduationCap className="h-4 w-4 mr-2" />
                                                Manage Programs
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="justify-start"
                                                onClick={() => setActiveConfig('config')}
                                            >
                                                <Settings className="h-4 w-4 mr-2" />
                                                Manage Configuration
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="justify-start"
                                                onClick={() => setActiveConfig('fees')}
                                            >
                                                <DollarSign className="h-4 w-4 mr-2" />
                                                Manage Fees & Statistics
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* College Info */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-green-600" />
                                        College Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-200">
                                                College ID
                                            </Label>
                                            <div className="p-2 bg-gray-700 rounded text-sm font-mono text-white">
                                                {collegeData?.id}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-200">
                                                Type
                                            </Label>
                                            <div className="p-2 bg-gray-700 rounded text-sm text-white">
                                                {collegeData?.type}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-200">
                                                Created
                                            </Label>
                                            <div className="p-2 bg-gray-700 rounded text-sm text-white">
                                                {collegeData?.createdAt ? new Date(collegeData.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-200">
                                                Last Updated
                                            </Label>
                                            <div className="p-2 bg-gray-700 rounded text-sm text-white">
                                                {collegeData?.updatedAt ? new Date(collegeData.updatedAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </Tabs>
            </div>

            {/* Image Selector Modal */}
            <ImageSelectorModal
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                onSelect={handleLogoSelect}
                currentValue={config.logoUrl}
            />

            {/* Program Modals */}
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

export default CollegeConfigPage;
