'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, X, Image as ImageIcon, Calendar, Settings, FileText, Tag, Loader2, Upload, Check, Building2, GraduationCap } from 'lucide-react';
import { UploadDialog } from '@/components/file-manager/UploadDialog';
import { CloudinaryFile } from '@/types/file';
import { useToast } from '@/hooks/use-toast';
import { useBlogMutations, useCurrentBlog } from '@/contexts/BlogContext';
import { useUser } from '@/contexts/userContext';
import { useUniversity } from '@/contexts/UniversityContext';
import { useCollege } from '@/contexts/CollegeContext';
// import { ImageSelectorModal } from '@/components/file-manager/ImageSelectorModal';
import { QueryClientProviderWrapper } from '@/contexts/QueryClientProvider';
import Image from 'next/image';
import { CollegeCard } from '@/components/ui/college-card';
import { UniversityCard } from '@/components/ui/university-card';
import { ImageCard } from '@/components/ui/image-card';
import { getCollegeName, getUniversityName } from '@/utils/multilingual';
import { University } from '@/types/university';
import { College } from '@/types/college';

interface FormData {
    titleEn: string;
    titleAr: string;
    contentEn: string;
    contentAr: string;
    slug: string;
    images: string[];
    tags: string[];
    newTag: string;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt: string;
    scheduledAt: string;
    order: number;
    universityId: string;
    collageId: string;
}

function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { updateBlog } = useBlogMutations();
    const { user } = useUser();
    const { universities } = useUniversity();
    const { colleges } = useCollege();
    const { currentBlog, getBlogById } = useCurrentBlog();

    const [formData, setFormData] = useState<FormData>({
        titleEn: '',
        titleAr: '',
        contentEn: '',
        contentAr: '',
        slug: '',
        images: [],
        tags: [],
        newTag: '',
        isPublished: false,
        isFeatured: false,
        publishedAt: '',
        scheduledAt: '',
        order: 0,
        universityId: 'none',
        collageId: 'none',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [showUniversities, setShowUniversities] = useState(false);
    const [showColleges, setShowColleges] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
    const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);

    // Fetch blog data when component mounts
    useEffect(() => {
        const fetchBlog = async () => {
            if (params.blogId) {
                try {
                    const blog = await getBlogById(params.blogId as string);
                    if (blog) {
                        const title = typeof blog.title === 'object' ? blog.title : {};
                        const content = typeof blog.content === 'object' ? blog.content : {};

                        setFormData({
                            titleEn: (title as any).en || '',
                            titleAr: (title as any).ar || '',
                            contentEn: (content as any).en || '',
                            contentAr: (content as any).ar || '',
                            slug: blog.slug,
                            images: blog.image || [],
                            tags: blog.tags || [],
                            newTag: '',
                            isPublished: blog.isPublished,
                            isFeatured: blog.isFeatured,
                            publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0, 16) : '',
                            scheduledAt: blog.scheduledAt ? new Date(blog.scheduledAt).toISOString().slice(0, 16) : '',
                            order: blog.order,
                            universityId: blog.universityId || 'none',
                            collageId: blog.collageId || 'none',
                        });

                        // Set selected university and college if they exist
                        if (blog.universityId) {
                            const university = universities.find(u => u.id === blog.universityId);
                            if (university) setSelectedUniversity(university);
                        }
                        if (blog.collageId) {
                            const college = colleges.find(c => c.id === blog.collageId);
                            if (college) setSelectedCollege(college);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching blog:', error);
                    toast({
                        title: 'Error',
                        description: 'Failed to load blog data',
                        variant: 'destructive',
                    });
                }
            }
        };

        fetchBlog();
    }, [params.blogId, getBlogById, universities, colleges, toast]);

    const handleAddTag = () => {
        if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, prev.newTag.trim()],
                newTag: '',
            }));
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove),
        }));
    };


    const handleRemoveImage = (imageUrl: string) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== imageUrl),
        }));
    };

    const handleUniversitySelect = (university: University) => {
        setSelectedUniversity(university);
        setFormData(prev => ({
            ...prev,
            universityId: university.id,
        }));
    };

    const handleCollegeSelect = (college: College) => {
        setSelectedCollege(college);
        setFormData(prev => ({
            ...prev,
            collageId: college.id,
        }));
    };

    const handleImageSelect = (file: CloudinaryFile) => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, file.secure_url],
        }));
        toast({
            title: 'Success',
            description: 'Image added successfully',
        });
    };

    const handleSubmit = async () => {
        if (!formData.titleEn.trim() || !formData.contentEn.trim()) {
            toast({
                title: 'Error',
                description: 'Title and content in English are required',
                variant: 'destructive',
            });
            return;
        }

        if (!currentBlog) {
            toast({
                title: 'Error',
                description: 'Blog not found',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const blogData = {
                title: {
                    en: formData.titleEn,
                    ar: formData.titleAr,
                },
                content: {
                    en: formData.contentEn,
                    ar: formData.contentAr,
                },
                slug: formData.slug,
                image: formData.images,
                tags: formData.tags,
                isPublished: formData.isPublished,
                isFeatured: formData.isFeatured,
                publishedAt: formData.publishedAt ? new Date(formData.publishedAt) : null,
                scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt) : null,
                order: formData.order,
                universityId: formData.universityId && formData.universityId !== 'none' ? formData.universityId : null,
                collageId: formData.collageId && formData.collageId !== 'none' ? formData.collageId : null,
                createdById: user?.id,
            };

            await updateBlog(currentBlog.id, blogData as any);
            toast({
                title: 'Success',
                description: 'Blog updated successfully',
            });
            router.push('/admin/blogs');
        } catch (error) {
            console.error('Error updating blog:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update blog',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentBlog) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    // Show loading state while fetching blog data
    if (!formData.titleEn && !formData.titleAr) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold">Edit Blog</h1>
            </div>

            <div className="space-y-6">
                {/* Content Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Blog Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="titleEn">Title (English) *</Label>
                                    <Input
                                        id="titleEn"
                                        value={formData.titleEn}
                                        onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                                        placeholder="Enter blog title in English"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="contentEn">Content (English) *</Label>
                                    <Textarea
                                        id="contentEn"
                                        value={formData.contentEn}
                                        onChange={(e) => setFormData(prev => ({ ...prev, contentEn: e.target.value }))}
                                        placeholder="Enter blog content in English"
                                        rows={10}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="titleAr">Title (Arabic)</Label>
                                    <Input
                                        id="titleAr"
                                        value={formData.titleAr}
                                        onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                                        placeholder="Enter blog title in Arabic"
                                        dir="rtl"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="contentAr">Content (Arabic)</Label>
                                    <Textarea
                                        id="contentAr"
                                        value={formData.contentAr}
                                        onChange={(e) => setFormData(prev => ({ ...prev, contentAr: e.target.value }))}
                                        placeholder="Enter blog content in Arabic"
                                        rows={10}
                                        dir="rtl"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Media Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Blog Images
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <UploadDialog
                                    onUploadSuccess={handleImageSelect}
                                    defaultFolder="blogs"
                                    trigger={
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex items-center gap-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            Add Images
                                        </Button>
                                    }
                                />
                                <span className="text-sm text-muted-foreground">
                                    {formData.images.length} image(s) selected
                                </span>
                            </div>
                            {formData.images.length > 0 && (
                                <Button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, images: [] }))}
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Clear All
                                </Button>
                            )}
                        </div>

                        {formData.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {formData.images.map((imageUrl, index) => (
                                    <ImageCard
                                        key={index}
                                        imageUrl={imageUrl}
                                        alt={`Blog image ${index + 1}`}
                                        onRemove={handleRemoveImage}
                                        onView={(url) => window.open(url, '_blank')}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground">No images selected</p>
                                <p className="text-sm text-muted-foreground/75">Click "Add Images" to get started</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Settings Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Blog Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="blog-slug"
                            />
                        </div>

                        {/* Selection Options */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="show-universities"
                                        checked={showUniversities}
                                        onCheckedChange={(checked) => {
                                            setShowUniversities(checked as boolean);
                                            if (!checked) {
                                                setSelectedUniversity(null);
                                                setFormData(prev => ({ ...prev, universityId: 'none' }));
                                            }
                                        }}
                                    />
                                    <Label htmlFor="show-universities" className="text-sm font-medium">
                                        Universities
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="show-colleges"
                                        checked={showColleges}
                                        onCheckedChange={(checked) => {
                                            setShowColleges(checked as boolean);
                                            if (!checked) {
                                                setSelectedCollege(null);
                                                setFormData(prev => ({ ...prev, collageId: 'none' }));
                                            }
                                        }}
                                    />
                                    <Label htmlFor="show-colleges" className="text-sm font-medium">
                                        Colleges
                                    </Label>
                                </div>
                            </div>

                            {/* Selected Items Display */}
                            {(selectedUniversity || selectedCollege) && (
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="text-sm font-medium mb-2">Selected:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUniversity && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <Building2 className="h-3 w-3" />
                                                {getUniversityName(selectedUniversity)}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                    onClick={() => {
                                                        setSelectedUniversity(null);
                                                        setFormData(prev => ({ ...prev, universityId: 'none' }));
                                                    }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        )}
                                        {selectedCollege && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <GraduationCap className="h-3 w-3" />
                                                {getCollegeName(selectedCollege)}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                    onClick={() => {
                                                        setSelectedCollege(null);
                                                        setFormData(prev => ({ ...prev, collageId: 'none' }));
                                                    }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* University Cards */}
                            {showUniversities && (
                                <div>
                                    <Label className="text-sm font-medium">Available Universities</Label>
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                                        {universities.map((university) => (
                                            <UniversityCard
                                                key={university.id}
                                                university={university}
                                                onSelect={handleUniversitySelect}
                                                isSelected={selectedUniversity?.id === university.id}
                                                showCheckbox={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* College Cards */}
                            {showColleges && (
                                <div>
                                    <Label className="text-sm font-medium">Available Colleges</Label>
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                                        {colleges.map((college) => (
                                            <CollegeCard
                                                key={college.id}
                                                college={college}
                                                onSelect={handleCollegeSelect}
                                                isSelected={selectedCollege?.id === college.id}
                                                showCheckbox={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Tags</Label>
                            <div className="mt-2 space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a tag"
                                        value={formData.newTag}
                                        onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={handleAddTag}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                <Tag className="h-3 w-3" />
                                                {tag}
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                    onClick={() => handleRemoveTag(tag)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="order">Display Order</Label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Publishing Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Publishing Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="isPublished">Published</Label>
                                <p className="text-sm text-muted-foreground">
                                    Make this blog visible to the public
                                </p>
                            </div>
                            <Switch
                                id="isPublished"
                                checked={formData.isPublished}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="isFeatured">Featured</Label>
                                <p className="text-sm text-muted-foreground">
                                    Highlight this blog as featured content
                                </p>
                            </div>
                            <Switch
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="publishedAt">Publish Date</Label>
                                <Input
                                    id="publishedAt"
                                    type="datetime-local"
                                    value={formData.publishedAt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="scheduledAt">Schedule Date</Label>
                                <Input
                                    id="scheduledAt"
                                    type="datetime-local"
                                    value={formData.scheduledAt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Updating...' : 'Update Blog'}
                </Button>
            </div>

            {/* ImageSelectorModal would go here */}
        </div>
    );
}

// Wrap the component with necessary providers
export default function EditBlogPageWithProviders() {
    return (
        <QueryClientProviderWrapper>
            <EditBlogPage />
        </QueryClientProviderWrapper>
    );
}