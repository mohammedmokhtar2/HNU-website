'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UniversityService } from '@/services/university.service';
import { University, UniversityConfig } from '@/types/university';
import { ImageSelectorModal } from '@/components/ui/image-selector-modal';
import { MenuBuilder } from '@/components/ui/menu-builder';
import { SectionManager } from '@/components/admin/SectionManager';
import {
  Building2,
  Settings,
  Image as ImageIcon,
  Menu,
  Share2,
  FileText,
  FolderOpen,
  Plus,
  Edit,
  Globe,
  Palette,
  Layout,
  Upload,
  Facebook,
  Linkedin,
  Instagram,
  Music,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ConfigItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

function UniversityConfigPage() {
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeConfig, setActiveConfig] = useState('basic');
  const [showSectionSelector, setShowSectionSelector] = useState(false);
  const [selectedSectionType, setSelectedSectionType] = useState<
    'existing' | 'new'
  >('new');
  const [selectedExistingSection, setSelectedExistingSection] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [showQuickLinkForm, setShowQuickLinkForm] = useState(false);
  const [newQuickLinkGroup, setNewQuickLinkGroup] = useState({
    title: { en: '', ar: '' },
    items: [
      {
        title: { en: '', ar: '' },
        href: '',
        style: 'button' as 'button' | 'link',
      },
    ],
  });
  const [showQuickActionForm, setShowQuickActionForm] = useState(false);
  const [newQuickActionGroup, setNewQuickActionGroup] = useState({
    title: { en: '', ar: '' },
    items: [{ title: { en: '', ar: '' }, href: '' }],
  });
  const [saving, setSaving] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [config, setConfig] = useState<UniversityConfig>({
    logo: '',
    socialMedia: {},
    menuBuilder: {
      menuItems: [],
    },
    footer: {
      quickLinks: [],
      dynamicSections: [],
    },
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const locale = useLocale();
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadUniversity();
  }, []);

  const loadUniversity = async () => {
    try {
      setLoading(true);
      const universities = await UniversityService.getUniversities();
      if (universities && universities.length > 0) {
        const uni = universities[0];
        setUniversity(uni);
        if (uni.config) {
          const loadedConfig = uni.config as UniversityConfig;

          // Migrate old footer structure to new dynamic sections
          const baseDynamicSections =
            loadedConfig.footer?.dynamicSections || [];
          const dynamicSections = [...baseDynamicSections];

          // If old structure exists, migrate it
          if (loadedConfig.footer?.quickActions?.length) {
            if (loadedConfig.footer.quickActions?.length) {
              dynamicSections.push({
                id: 'legacy_quick_actions',
                title: { en: 'Quick Actions', ar: 'روابط سريعة' },
                type: 'customSection',
                items: loadedConfig.footer.quickActions.map(action => ({
                  title:
                    typeof action.title === 'string'
                      ? { en: action.title, ar: action.title }
                      : action.title,
                  href: action.href,
                })),
              });
            }
          }
          setConfig({
            logo: loadedConfig.logo || '',
            socialMedia: loadedConfig.socialMedia || {},
            menuBuilder: loadedConfig.menuBuilder || {
              menuItems: [],
            },
            footer: {
              quickLinks: loadedConfig.footer?.quickLinks || [],
              dynamicSections: dynamicSections,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error loading university:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
    if (field === 'name') {
      setEditingValue(
        locale === 'ar' ? university?.name.ar || '' : university?.name.en || ''
      );
    } else if (field === 'slug') {
      setEditingValue(university?.slug || '');
    }
  };

  const handleSave = async (field: string) => {
    if (!university || !editingValue.trim()) {
      setEditingField(null);
      return;
    }

    try {
      setSaving(true);

      const updateData: any = {};

      if (field === 'name') {
        updateData.name = {
          ...university.name,
          [locale]: editingValue.trim(),
        };
      } else if (field === 'slug') {
        updateData.slug = editingValue.trim();
      }

      const updatedUniversity = await UniversityService.updateUniversity(
        university.id,
        updateData
      );
      setUniversity(updatedUniversity);
      setEditingField(null);
      setEditingValue('');
    } catch (error) {
      console.error('Error updating university:', error);
      // You might want to show a toast notification here
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (newConfig: UniversityConfig) => {
    setConfig(newConfig);
    setHasUnsavedChanges(true);
  };

  const saveAllChanges = async () => {
    if (!university) return;

    try {
      setSaving(true);
      const updatedUniversity = await UniversityService.updateUniversity(
        university.id,
        {
          config: config,
        }
      );
      setUniversity(updatedUniversity);
      setHasUnsavedChanges(false);
      success('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      showError('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetChanges = () => {
    if (university && university.config) {
      const loadedConfig = university.config as UniversityConfig;
      setConfig({
        logo: loadedConfig.logo || '',
        socialMedia: loadedConfig.socialMedia || {},
        menuBuilder: loadedConfig.menuBuilder || {
          menuItems: [],
        },
        footer: loadedConfig.footer || {
          quickLinks: [],
          dynamicSections: [],
        },
      });
      setHasUnsavedChanges(false);
    }
  };

  const handleLogoSelect = (logoUrl: string) => {
    const newConfig = { ...config, logo: logoUrl };
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

  const handleMenuUpdate = (menuItems: any[]) => {
    const newConfig = {
      ...config,
      menuBuilder: {
        ...config.menuBuilder,
        menuItems: menuItems,
      },
    };
    updateConfig(newConfig);
  };

  const handleFooterUpdate = (footerConfig: any) => {
    const newConfig = {
      ...config,
      footer: footerConfig,
    };
    updateConfig(newConfig);
  };

  const addDynamicSection = (type: 'customSection' | 'quickLinks') => {
    if (type === 'customSection') {
      setShowSectionSelector(true);
      return;
    }

    // Create quick links section directly
    const newSection = {
      id: `section_${Date.now()}`,
      title: {
        en: 'Quick Links Section',
        ar: 'قسم الروابط السريعة',
      },
      type: 'quickLinks' as const,
      items: [],
    };

    const currentFooter = config.footer || {
      quickLinks: [],
      dynamicSections: [],
    };
    const newFooter = {
      ...currentFooter,
      dynamicSections: [...(currentFooter.dynamicSections || []), newSection],
    };

    handleFooterUpdate(newFooter);
  };

  const handleSectionSelection = () => {
    if (selectedSectionType === 'new') {
      // Create new custom section
      const newSection = {
        id: `section_${Date.now()}`,
        title: {
          en: 'New Custom Section',
          ar: 'قسم مخصص جديد',
        },
        type: 'customSection' as const, // Default to customSection
        items: [],
      };

      const currentFooter = config.footer || {
        quickLinks: [],
        dynamicSections: [],
      };
      const newFooter = {
        ...currentFooter,
        dynamicSections: [...(currentFooter.dynamicSections || []), newSection],
      };

      handleFooterUpdate(newFooter);
    } else if (selectedExistingSection) {
      // Duplicate existing section
      const existingSection = config.footer?.dynamicSections?.find(
        s => s.id === selectedExistingSection
      );
      if (existingSection) {
        const duplicatedSection = {
          ...existingSection,
          id: `section_${Date.now()}`,
          title:
            typeof existingSection.title === 'object'
              ? {
                  en: `${existingSection.title.en || ''} (Copy)`,
                  ar: `${existingSection.title.ar || ''} (نسخة)`,
                }
              : `${existingSection.title} (Copy)`,
        };

        const currentFooter = config.footer || {
          quickLinks: [],
          dynamicSections: [],
        };
        const newFooter = {
          ...currentFooter,
          dynamicSections: [
            ...(currentFooter.dynamicSections || []),
            duplicatedSection,
          ],
        };

        handleFooterUpdate(newFooter);
      }
    }

    // Reset modal state
    setShowSectionSelector(false);
    setSelectedSectionType('new');
    setSelectedExistingSection('');
  };

  const updateDynamicSection = (sectionId: string, updatedSection: any) => {
    const currentFooter = config.footer || {
      quickLinks: [],
      dynamicSections: [],
    };

    // Check if the user selected to copy from an existing section
    if (updatedSection.type && updatedSection.type.startsWith('copy:')) {
      const sourceId = updatedSection.type.replace('copy:', '');
      const sourceSection = currentFooter.dynamicSections?.find(
        s => s.id === sourceId
      );

      if (sourceSection) {
        // Copy items from source section
        updatedSection = {
          ...updatedSection,
          type: sourceSection.type, // Keep the original type
          items: [...sourceSection.items], // Deep copy the items
        };
      }
    }

    const newFooter = {
      ...currentFooter,
      dynamicSections: (currentFooter.dynamicSections || []).map(section =>
        section.id === sectionId ? updatedSection : section
      ),
    };

    handleFooterUpdate(newFooter);
  };

  const deleteDynamicSection = (sectionId: string) => {
    const currentFooter = config.footer || {
      quickLinks: [],
      dynamicSections: [],
    };
    const newFooter = {
      ...currentFooter,
      dynamicSections: (currentFooter.dynamicSections || []).filter(
        section => section.id !== sectionId
      ),
    };

    handleFooterUpdate(newFooter);
  };

  const addItemToSection = (
    sectionId: string,
    type: 'customSection' | 'quickLinks' | 'quickActions'
  ) => {
    const newItem = {
      title: {
        en: 'New Item',
        ar: 'عنصر جديد',
      },
      href: '#',
    };

    const currentFooter = config.footer || {
      quickLinks: [],
      dynamicSections: [],
    };
    const newFooter = {
      ...currentFooter,
      dynamicSections: (currentFooter.dynamicSections || []).map(section =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newItem] }
          : section
      ),
    };

    handleFooterUpdate(newFooter);
  };

  const updateSectionItem = (
    sectionId: string,
    itemIndex: number,
    updatedItem: any
  ) => {
    const currentFooter = config.footer || {
      quickLinks: [],
      dynamicSections: [],
    };
    const newFooter = {
      ...currentFooter,
      dynamicSections: (currentFooter.dynamicSections || []).map(section =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item, index) =>
                index === itemIndex ? updatedItem : item
              ),
            }
          : section
      ),
    };

    handleFooterUpdate(newFooter);
  };

  const deleteSectionItem = (sectionId: string, itemIndex: number) => {
    const currentFooter = config.footer || {
      quickLinks: [],
      dynamicSections: [],
    };
    const newFooter = {
      ...currentFooter,
      dynamicSections: (currentFooter.dynamicSections || []).map(section =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((_, index) => index !== itemIndex),
            }
          : section
      ),
    };

    handleFooterUpdate(newFooter);
  };

  const handleSectionsChange = useCallback((sections: any[]) => {
    // Handle sections change if needed
    console.log('Sections updated:', sections);
  }, []);

  const configItems: ConfigItem[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'University name, slug, and basic details',
      icon: Building2,
      isActive: activeConfig === 'basic',
    },
    {
      id: 'sections',
      title: 'Sections Management',
      description: 'Manage university sections and content',
      icon: FileText,
      isActive: activeConfig === 'sections',
    },
    {
      id: 'pages',
      title: 'Pages Management',
      description: 'Manage university pages and content',
      icon: FolderOpen,
      isActive: activeConfig === 'pages',
    },
    {
      id: 'menu',
      title: 'Menu Builder',
      description: 'Build and customize navigation menu',
      icon: Menu,
      isActive: activeConfig === 'menu',
    },
    {
      id: 'social',
      title: 'Social Media',
      description: 'Social media links and integration',
      icon: Share2,
      isActive: activeConfig === 'social',
    },
    // add footer configuration tab
    {
      id: 'footer',
      title: 'Footer Configuration',
      description: 'Manage footer links and content',
      icon: Palette,
      isActive: activeConfig === 'footer',
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-gray-300'>
          Loading university configuration...
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-red-400'>No university found</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header with Logo and University Name */}
      <div className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center gap-4'>
          {/* Logo */}
          <div className='flex items-center justify-center '>
            {config.logo ? (
              <Image
                src={config.logo}
                alt='University Logo'
                width={80}
                height={80}
                className='object-contain'
              />
            ) : (
              <Building2 className='h-6 w-6' />
            )}
          </div>

          {/* University Name - Editable */}
          <div>
            <h1
              className='text-2xl font-bold text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors'
              onDoubleClick={() => handleEdit('name')}
            >
              {editingField === 'name' ? (
                <input
                  type='text'
                  value={editingValue}
                  onChange={e => setEditingValue(e.target.value)}
                  onBlur={() => handleSave('name')}
                  onKeyDown={e => e.key === 'Enter' && handleSave('name')}
                  className='text-2xl font-bold text-gray-900 bg-transparent border-none outline-none'
                  autoFocus
                  disabled={saving}
                  aria-label='Edit university name'
                />
              ) : (
                <span className={saving ? 'opacity-50' : ''}>
                  {locale === 'ar' ? university.name.ar : university.name.en}
                </span>
              )}
            </h1>
            <p className='text-sm text-gray-500'>
              University Configuration Dashboard
            </p>
          </div>

          {/* Slug Badge - Editable */}
          <div className='ml-auto flex items-center gap-4'>
            <Badge
              variant='outline'
              className='border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-100 px-2 py-1'
              onDoubleClick={() => handleEdit('slug')}
            >
              <Globe className='h-3 w-3 mr-1' />
              {editingField === 'slug' ? (
                <input
                  type='text'
                  value={editingValue}
                  onChange={e => setEditingValue(e.target.value)}
                  onBlur={() => handleSave('slug')}
                  onKeyDown={e => e.key === 'Enter' && handleSave('slug')}
                  className='bg-transparent border-none outline-none text-sm'
                  autoFocus
                  disabled={saving}
                  aria-label='Edit university slug'
                />
              ) : (
                <span className={saving ? 'opacity-50' : ''}>
                  {university.slug}
                </span>
              )}
            </Badge>

            {/* Action Buttons */}
            <div className='flex gap-2'>
              {hasUnsavedChanges && (
                <Button
                  onClick={resetChanges}
                  variant='outline'
                  disabled={saving}
                  className='text-gray-600 hover:text-gray-800'
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
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                )}
              >
                {saving ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Settings className='h-4 w-4 mr-2' />
                    {hasUnsavedChanges ? 'Save All Changes' : 'No Changes'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className='p-6'>
        <Tabs
          value={activeConfig}
          onValueChange={setActiveConfig}
          className='w-full'
        >
          {/* Tab Navigation */}
          <TabsList className='grid w-full grid-cols-6 mb-6'>
            {configItems.map(item => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className='flex items-center gap-2'
                >
                  <Icon className='h-4 w-4' />
                  <span className='hidden sm:inline'>{item.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Configuration Content */}
            <div className='space-y-6'>
              <Card
                className={cn(
                  'bg-white border-gray-200 transition-all duration-200',
                  hasUnsavedChanges ? 'border-blue-300 shadow-md' : ''
                )}
              >
                <CardHeader>
                  <CardTitle className='text-gray-900 flex items-center gap-2'>
                    {configItems.find(item => item.id === activeConfig)?.title}
                    {hasUnsavedChanges && (
                      <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TabsContent value='basic' className='mt-0'>
                    <div className='space-y-6'>
                      {/* Logo Section */}
                      <div>
                        <Label className='text-sm font-medium text-gray-700'>
                          University Logo
                        </Label>
                        <div className='mt-2 flex items-center gap-4'>
                          {config.logo ? (
                            <div className='relative group'>
                              <div
                                className='relative w-20 h-20 cursor-pointer hover:opacity-80 transition-opacity border rounded-lg overflow-hidden'
                                onClick={() => setShowImageModal(true)}
                              >
                                <Image
                                  src={config.logo}
                                  alt='University Logo'
                                  width={80}
                                  height={80}
                                  className='object-contain'
                                />
                                <div className='absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center'>
                                  <Edit className='h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity' />
                                </div>
                              </div>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600 z-10'
                                onClick={e => {
                                  e.stopPropagation();
                                  handleLogoSelect('');
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          ) : (
                            <div
                              className='w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors'
                              onClick={() => setShowImageModal(true)}
                            >
                              <ImageIcon
                                className='h-8 w-8 text-gray-400'
                                aria-hidden='true'
                              />
                            </div>
                          )}
                          <Button
                            onClick={() => setShowImageModal(true)}
                            variant='outline'
                            className='flex items-center gap-2'
                          >
                            <Upload className='h-4 w-4' />
                            {config.logo ? 'Change Logo' : 'Select Logo'}
                          </Button>
                        </div>
                      </div>

                      {/* Basic Information */}
                      <div className='space-y-4'>
                        <div>
                          <Label className='text-sm font-medium text-gray-700'>
                            University Name (English)
                          </Label>
                          <div className='p-3 border border-gray-300 rounded bg-gray-50 text-gray-900 mt-1'>
                            {university.name.en}
                          </div>
                        </div>
                        <div>
                          <Label className='text-sm font-medium text-gray-700'>
                            University Name (Arabic)
                          </Label>
                          <div className='p-3 border border-gray-300 rounded bg-gray-50 text-gray-900 mt-1'>
                            {university.name.ar}
                          </div>
                        </div>
                        <div>
                          <Label className='text-sm font-medium text-gray-700'>
                            Slug
                          </Label>
                          <div className='p-3 border border-gray-300 rounded bg-gray-50 text-gray-900 mt-1'>
                            {university.slug}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value='sections' className='mt-0'>
                    <SectionManager
                      universityId={university.id}
                      onSectionsChange={handleSectionsChange}
                    />
                  </TabsContent>

                  <TabsContent value='pages' className='mt-0'>
                    <div className='space-y-6'>
                      <div className='text-center py-8'>
                        <FolderOpen className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                        <div className='text-gray-500 mb-4'>
                          Pages management will be available here
                        </div>
                        <p className='text-sm text-gray-400 mb-6'>
                          Manage university pages like About, Contact, Programs,
                          etc.
                        </p>
                        <Button className='bg-blue-600 hover:bg-blue-700'>
                          <Plus className='h-4 w-4 mr-2' />
                          Coming Soon
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value='menu' className='mt-0'>
                    <MenuBuilder
                      value={(config.menuBuilder?.menuItems || []).map(
                        (item: any, index: number) => ({
                          id: item.id || `item-${index}`,
                          title: item.title || '',
                          href: item.href || '',
                          submenu:
                            item.submenu?.map((sub: any, subIndex: number) => ({
                              id: sub.id || `sub-${index}-${subIndex}`,
                              title: sub.title || '',
                              href: sub.href || '',
                            })) || [],
                        })
                      )}
                      onChange={handleMenuUpdate}
                    />
                  </TabsContent>

                  <TabsContent value='social' className='mt-0'>
                    <div className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Facebook */}
                        <div>
                          <Label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                            <Facebook className='h-4 w-4 text-blue-600' />
                            Facebook
                          </Label>
                          <Input
                            value={config.socialMedia?.facebook || ''}
                            onChange={e =>
                              handleSocialMediaUpdate(
                                'facebook',
                                e.target.value
                              )
                            }
                            placeholder='https://facebook.com/yourpage'
                            className='mt-1'
                          />
                        </div>

                        {/* LinkedIn */}
                        <div>
                          <Label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                            <Linkedin className='h-4 w-4 text-blue-700' />
                            LinkedIn
                          </Label>
                          <Input
                            value={config.socialMedia?.linkedin || ''}
                            onChange={e =>
                              handleSocialMediaUpdate(
                                'linkedin',
                                e.target.value
                              )
                            }
                            placeholder='https://linkedin.com/company/yourcompany'
                            className='mt-1'
                          />
                        </div>

                        {/* Instagram */}
                        <div>
                          <Label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                            <Instagram className='h-4 w-4 text-pink-600' />
                            Instagram
                          </Label>
                          <Input
                            value={config.socialMedia?.instagram || ''}
                            onChange={e =>
                              handleSocialMediaUpdate(
                                'instagram',
                                e.target.value
                              )
                            }
                            placeholder='https://instagram.com/yourpage'
                            className='mt-1'
                          />
                        </div>

                        {/* TikTok */}
                        <div>
                          <Label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                            <Music className='h-4 w-4 text-black' />
                            TikTok
                          </Label>
                          <Input
                            value={config.socialMedia?.tiktok || ''}
                            onChange={e =>
                              handleSocialMediaUpdate('tiktok', e.target.value)
                            }
                            placeholder='https://tiktok.com/@yourpage'
                            className='mt-1'
                          />
                        </div>
                      </div>

                      {/* Additional Social Media */}
                      <div>
                        <Label className='text-sm font-medium text-gray-700'>
                          Additional Social Media
                        </Label>
                        <div className='mt-2 space-y-2'>
                          {Object.entries(config.socialMedia || {})
                            .filter(
                              ([key]) =>
                                ![
                                  'facebook',
                                  'linkedin',
                                  'instagram',
                                  'tiktok',
                                ].includes(key)
                            )
                            .map(([platform, url]) => (
                              <div key={platform} className='flex gap-2'>
                                <Input
                                  value={platform}
                                  onChange={e => {
                                    const newSocialMedia = {
                                      ...(config.socialMedia || {}),
                                    };
                                    delete newSocialMedia[platform];
                                    newSocialMedia[e.target.value] = url;
                                    updateConfig({
                                      ...config,
                                      socialMedia: newSocialMedia,
                                    });
                                  }}
                                  placeholder='Platform name'
                                  className='flex-1'
                                />
                                <Input
                                  value={url}
                                  onChange={e =>
                                    handleSocialMediaUpdate(
                                      platform,
                                      e.target.value
                                    )
                                  }
                                  placeholder='URL'
                                  className='flex-2'
                                />
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => {
                                    const newSocialMedia = {
                                      ...(config.socialMedia || {}),
                                    };
                                    delete newSocialMedia[platform];
                                    updateConfig({
                                      ...config,
                                      socialMedia: newSocialMedia,
                                    });
                                  }}
                                  className='text-red-500'
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const platform = prompt('Enter platform name:');
                              if (platform) {
                                handleSocialMediaUpdate(platform, '');
                              }
                            }}
                            className='w-full'
                          >
                            <Plus className='h-4 w-4 mr-2' />
                            Add Platform
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value='footer' className='mt-0'>
                    <div className='space-y-6'>
                      {/* Quick Links Section */}
                      <div>
                        <Label className='text-sm font-medium text-gray-700'>
                          Quick Links
                        </Label>
                        <div className='mt-2 space-y-2'>
                          {(config.footer?.quickLinks || []).map(
                            (link, index) => (
                              <div
                                key={index}
                                className='border rounded-lg p-3 space-y-2'
                              >
                                <div className='space-y-2'>
                                  <Label className='text-xs text-gray-500'>
                                    Link Title
                                  </Label>
                                  <div className='grid grid-cols-2 gap-2'>
                                    <div>
                                      <Label className='text-xs text-gray-400'>
                                        English
                                      </Label>
                                      <Input
                                        value={
                                          typeof link.title === 'object'
                                            ? link.title.en || ''
                                            : link.title || ''
                                        }
                                        onChange={e => {
                                          const updatedLinks = [
                                            ...(config.footer?.quickLinks ||
                                              []),
                                          ];
                                          updatedLinks[index] = {
                                            ...updatedLinks[index],
                                            title: {
                                              en: e.target.value,
                                              ar:
                                                typeof link.title === 'object'
                                                  ? link.title.ar || ''
                                                  : '',
                                            },
                                          };
                                          handleFooterUpdate({
                                            ...config.footer,
                                            quickLinks: updatedLinks,
                                          });
                                        }}
                                        placeholder='Title (English)'
                                      />
                                    </div>
                                    <div>
                                      <Label className='text-xs text-gray-400'>
                                        Arabic
                                      </Label>
                                      <Input
                                        value={
                                          typeof link.title === 'object'
                                            ? link.title.ar || ''
                                            : ''
                                        }
                                        onChange={e => {
                                          const updatedLinks = [
                                            ...(config.footer?.quickLinks ||
                                              []),
                                          ];
                                          updatedLinks[index] = {
                                            ...updatedLinks[index],
                                            title: {
                                              en:
                                                typeof link.title === 'object'
                                                  ? link.title.en || ''
                                                  : link.title || '',
                                              ar: e.target.value,
                                            },
                                          };
                                          handleFooterUpdate({
                                            ...config.footer,
                                            quickLinks: updatedLinks,
                                          });
                                        }}
                                        placeholder='Title (Arabic)'
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Label className='text-xs text-gray-500'>
                                    URL
                                  </Label>
                                  <div className='flex gap-2'>
                                    <Input
                                      value={link.href}
                                      onChange={e => {
                                        const updatedLinks = [
                                          ...(config.footer?.quickLinks || []),
                                        ];
                                        updatedLinks[index] = {
                                          ...updatedLinks[index],
                                          href: e.target.value,
                                        };
                                        handleFooterUpdate({
                                          ...config.footer,
                                          quickLinks: updatedLinks,
                                        });
                                      }}
                                      placeholder='Link URL'
                                      className='flex-1'
                                    />
                                    <select
                                      value={link.style || 'button'}
                                      onChange={e => {
                                        const updatedLinks = [
                                          ...(config.footer?.quickLinks || []),
                                        ];
                                        updatedLinks[index] = {
                                          ...updatedLinks[index],
                                          style: e.target.value as
                                            | 'button'
                                            | 'link',
                                        };
                                        handleFooterUpdate({
                                          ...config.footer,
                                          quickLinks: updatedLinks,
                                        });
                                      }}
                                      className='px-2 py-1 border border-gray-300 rounded text-sm'
                                      aria-label='Link Style'
                                    >
                                      <option value='button'>Button</option>
                                      <option value='link'>Link</option>
                                    </select>
                                    <Button
                                      variant='ghost'
                                      size='sm'
                                      onClick={() => {
                                        const updatedLinks = (
                                          config.footer?.quickLinks || []
                                        ).filter((_, i) => i !== index);
                                        handleFooterUpdate({
                                          ...config.footer,
                                          quickLinks: updatedLinks,
                                        });
                                      }}
                                      className='text-red-500'
                                    >
                                      ×
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          )}

                          {/* Add Quick Link Form - Inline */}
                          {showQuickLinkForm ? (
                            <div className='border border-blue-300 rounded-lg p-4 bg-blue-50 space-y-4'>
                              <div className='flex justify-between items-center'>
                                <h4 className='text-sm font-medium text-blue-900'>
                                  Add New Quick Link Group
                                </h4>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => {
                                    setShowQuickLinkForm(false);
                                    setNewQuickLinkGroup({
                                      title: { en: '', ar: '' },
                                      items: [
                                        {
                                          title: { en: '', ar: '' },
                                          href: '',
                                          style: 'button' as 'button' | 'link',
                                        },
                                      ],
                                    });
                                  }}
                                  className='text-gray-500 hover:text-gray-700'
                                >
                                  ×
                                </Button>
                              </div>

                              {/* Group Title */}

                              {/* Items */}
                              <div className='space-y-3'>
                                <Label className='text-xs text-gray-600'>
                                  Links in this Group
                                </Label>
                                {newQuickLinkGroup.items.map(
                                  (item, itemIndex) => (
                                    <div
                                      key={itemIndex}
                                      className='border border-gray-200 rounded-md p-3 bg-white space-y-2'
                                    >
                                      <div className='flex justify-between items-center'>
                                        <Label className='text-xs text-gray-500'>
                                          Link #{itemIndex + 1}
                                        </Label>
                                        {newQuickLinkGroup.items.length > 1 && (
                                          <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => {
                                              setNewQuickLinkGroup(prev => ({
                                                ...prev,
                                                items: prev.items.filter(
                                                  (_, index) =>
                                                    index !== itemIndex
                                                ),
                                              }));
                                            }}
                                            className='text-red-500 hover:text-red-700 h-6 w-6 p-0'
                                          >
                                            ×
                                          </Button>
                                        )}
                                      </div>

                                      {/* Link Title */}
                                      <div className='grid grid-cols-2 gap-2'>
                                        <Input
                                          value={item.title.en}
                                          onChange={e => {
                                            setNewQuickLinkGroup(prev => ({
                                              ...prev,
                                              items: prev.items.map(
                                                (itm, idx) =>
                                                  idx === itemIndex
                                                    ? {
                                                        ...itm,
                                                        title: {
                                                          ...itm.title,
                                                          en: e.target.value,
                                                        },
                                                      }
                                                    : itm
                                              ),
                                            }));
                                          }}
                                          placeholder='Link Title (English)'
                                          className='text-sm'
                                        />
                                        <Input
                                          value={item.title.ar}
                                          onChange={e => {
                                            setNewQuickLinkGroup(prev => ({
                                              ...prev,
                                              items: prev.items.map(
                                                (itm, idx) =>
                                                  idx === itemIndex
                                                    ? {
                                                        ...itm,
                                                        title: {
                                                          ...itm.title,
                                                          ar: e.target.value,
                                                        },
                                                      }
                                                    : itm
                                              ),
                                            }));
                                          }}
                                          placeholder='Link Title (Arabic)'
                                          className='text-sm'
                                        />
                                      </div>

                                      {/* URL and Style */}
                                      <div className='flex gap-2'>
                                        <Input
                                          value={item.href}
                                          onChange={e => {
                                            setNewQuickLinkGroup(prev => ({
                                              ...prev,
                                              items: prev.items.map(
                                                (itm, idx) =>
                                                  idx === itemIndex
                                                    ? {
                                                        ...itm,
                                                        href: e.target.value,
                                                      }
                                                    : itm
                                              ),
                                            }));
                                          }}
                                          placeholder='Link URL'
                                          className='flex-1 text-sm'
                                        />
                                        <select
                                          value={item.style}
                                          onChange={e => {
                                            setNewQuickLinkGroup(prev => ({
                                              ...prev,
                                              items: prev.items.map(
                                                (itm, idx) =>
                                                  idx === itemIndex
                                                    ? {
                                                        ...itm,
                                                        style: e.target
                                                          .value as
                                                          | 'button'
                                                          | 'link',
                                                      }
                                                    : itm
                                              ),
                                            }));
                                          }}
                                          className='px-2 py-1 border border-gray-300 rounded text-sm'
                                          aria-label='Link Style'
                                        >
                                          <option value='button'>Button</option>
                                          <option value='link'>Link</option>
                                        </select>
                                      </div>
                                    </div>
                                  )
                                )}

                                {/* Add New Item Button */}
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => {
                                    setNewQuickLinkGroup(prev => ({
                                      ...prev,
                                      items: [
                                        ...prev.items,
                                        {
                                          title: { en: '', ar: '' },
                                          href: '',
                                          style: 'button' as 'button' | 'link',
                                        },
                                      ],
                                    }));
                                  }}
                                  className='w-full border-dashed'
                                >
                                  <Plus className='h-3 w-3 mr-1' />
                                  Add Another Link
                                </Button>
                              </div>

                              {/* Action Buttons */}
                              <div className='flex gap-2 pt-2'>
                                <Button
                                  size='sm'
                                  onClick={() => {
                                    // Add all items as separate quick links
                                    const newLinks =
                                      newQuickLinkGroup.items.filter(
                                        item =>
                                          item.title.en.trim() ||
                                          item.title.ar.trim()
                                      );

                                    if (newLinks.length > 0) {
                                      handleFooterUpdate({
                                        ...config.footer,
                                        quickLinks: [
                                          ...(config.footer?.quickLinks || []),
                                          ...newLinks,
                                        ],
                                      });
                                      setShowQuickLinkForm(false);
                                      setNewQuickLinkGroup({
                                        title: { en: '', ar: '' },
                                        items: [
                                          {
                                            title: { en: '', ar: '' },
                                            href: '',
                                            style: 'button' as
                                              | 'button'
                                              | 'link',
                                          },
                                        ],
                                      });
                                    }
                                  }}
                                  disabled={
                                    !newQuickLinkGroup.items.some(
                                      item =>
                                        item.title.en.trim() ||
                                        item.title.ar.trim()
                                    )
                                  }
                                  className='flex-1'
                                >
                                  Add Links
                                </Button>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => {
                                    setShowQuickLinkForm(false);
                                    setNewQuickLinkGroup({
                                      title: { en: '', ar: '' },
                                      items: [
                                        {
                                          title: { en: '', ar: '' },
                                          href: '',
                                          style: 'button' as 'button' | 'link',
                                        },
                                      ],
                                    });
                                  }}
                                  className='flex-1'
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => setShowQuickLinkForm(true)}
                              className='w-full'
                            >
                              <Plus className='h-4 w-4 mr-2' />
                              Add Quick Link
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions Section */}
                      <div>
                        <Label className='text-sm font-medium text-gray-700'>
                          Quick Actions
                        </Label>
                        <div className='mt-2 space-y-2'>
                          {(config.footer?.quickActions || []).map(
                            (action, index) => (
                              <div
                                key={index}
                                className='border rounded-lg p-3 space-y-2'
                              >
                                <div className='space-y-2'>
                                  <Label className='text-xs text-gray-500'>
                                    Action Title
                                  </Label>
                                  <div className='grid grid-cols-2 gap-2'>
                                    <div>
                                      <Label className='text-xs text-gray-400'>
                                        English
                                      </Label>
                                      <Input
                                        value={
                                          typeof action.title === 'object'
                                            ? action.title.en || ''
                                            : action.title || ''
                                        }
                                        onChange={e => {
                                          const updatedActions = [
                                            ...(config.footer?.quickActions ||
                                              []),
                                          ];
                                          updatedActions[index] = {
                                            ...updatedActions[index],
                                            title: {
                                              en: e.target.value,
                                              ar:
                                                typeof action.title === 'object'
                                                  ? action.title.ar || ''
                                                  : '',
                                            },
                                          };
                                          handleFooterUpdate({
                                            ...config.footer,
                                            quickActions: updatedActions,
                                          });
                                        }}
                                        placeholder='Title (English)'
                                      />
                                    </div>
                                    <div>
                                      <Label className='text-xs text-gray-400'>
                                        Arabic
                                      </Label>
                                      <Input
                                        value={
                                          typeof action.title === 'object'
                                            ? action.title.ar || ''
                                            : ''
                                        }
                                        onChange={e => {
                                          const updatedActions = [
                                            ...(config.footer?.quickActions ||
                                              []),
                                          ];
                                          updatedActions[index] = {
                                            ...updatedActions[index],
                                            title: {
                                              en:
                                                typeof action.title === 'object'
                                                  ? action.title.en || ''
                                                  : action.title || '',
                                              ar: e.target.value,
                                            },
                                          };
                                          handleFooterUpdate({
                                            ...config.footer,
                                            quickActions: updatedActions,
                                          });
                                        }}
                                        placeholder='Title (Arabic)'
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Label className='text-xs text-gray-500'>
                                    URL
                                  </Label>
                                  <Input
                                    value={action.href}
                                    onChange={e => {
                                      const updatedActions = [
                                        ...(config.footer?.quickActions || []),
                                      ];
                                      updatedActions[index] = {
                                        ...updatedActions[index],
                                        href: e.target.value,
                                      };
                                      handleFooterUpdate({
                                        ...config.footer,
                                        quickActions: updatedActions,
                                      });
                                    }}
                                    placeholder='Action URL'
                                    className='flex-1'
                                  />
                                </div>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => {
                                    const updatedActions = (
                                      config.footer?.quickActions || []
                                    ).filter((_, i) => i !== index);
                                    handleFooterUpdate({
                                      ...config.footer,
                                      quickActions: updatedActions,
                                    });
                                  }}
                                  className='text-red-500'
                                >
                                  ×
                                </Button>
                              </div>
                            )
                          )}

                          {/* Add Quick Action Form - Inline */}
                          {showQuickActionForm ? (
                            <div className='border border-blue-300 rounded-lg p-4 bg-blue-50 space-y-4'>
                              <div className='flex justify-between items-center'>
                                <h4 className='text-sm font-medium text-blue-900'>
                                  Add New Quick Action Group
                                </h4>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => {
                                    setShowQuickActionForm(false);
                                    setNewQuickActionGroup({
                                      title: { en: '', ar: '' },
                                      items: [
                                        { title: { en: '', ar: '' }, href: '' },
                                      ],
                                    });
                                  }}
                                  className='text-gray-500 hover:text-gray-700'
                                >
                                  ×
                                </Button>
                              </div>

                              {/* Items */}
                              <div className='space-y-3'>
                                <Label className='text-xs text-gray-600'>
                                  Actions in this Group
                                </Label>
                                {newQuickActionGroup.items.map(
                                  (item, itemIndex) => (
                                    <div
                                      key={itemIndex}
                                      className='border border-gray-200 rounded-md p-3 bg-white space-y-2'
                                    >
                                      <div className='flex justify-between items-center'>
                                        <Label className='text-xs text-gray-500'>
                                          Action #{itemIndex + 1}
                                        </Label>
                                        {newQuickActionGroup.items.length >
                                          1 && (
                                          <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => {
                                              setNewQuickActionGroup(prev => ({
                                                ...prev,
                                                items: prev.items.filter(
                                                  (_, index) =>
                                                    index !== itemIndex
                                                ),
                                              }));
                                            }}
                                            className='text-red-500 hover:text-red-700 h-6 w-6 p-0'
                                          >
                                            ×
                                          </Button>
                                        )}
                                      </div>

                                      {/* Action Title */}
                                      <div className='grid grid-cols-2 gap-2'>
                                        <Input
                                          value={item.title.en}
                                          onChange={e => {
                                            setNewQuickActionGroup(prev => ({
                                              ...prev,
                                              items: prev.items.map(
                                                (itm, idx) =>
                                                  idx === itemIndex
                                                    ? {
                                                        ...itm,
                                                        title: {
                                                          ...itm.title,
                                                          en: e.target.value,
                                                        },
                                                      }
                                                    : itm
                                              ),
                                            }));
                                          }}
                                          placeholder='Action Title (English)'
                                          className='text-sm'
                                        />
                                        <Input
                                          value={item.title.ar}
                                          onChange={e => {
                                            setNewQuickActionGroup(prev => ({
                                              ...prev,
                                              items: prev.items.map(
                                                (itm, idx) =>
                                                  idx === itemIndex
                                                    ? {
                                                        ...itm,
                                                        title: {
                                                          ...itm.title,
                                                          ar: e.target.value,
                                                        },
                                                      }
                                                    : itm
                                              ),
                                            }));
                                          }}
                                          placeholder='Action Title (Arabic)'
                                          className='text-sm'
                                        />
                                      </div>

                                      {/* URL */}
                                      <div>
                                        <Input
                                          value={item.href}
                                          onChange={e => {
                                            setNewQuickActionGroup(prev => ({
                                              ...prev,
                                              items: prev.items.map(
                                                (itm, idx) =>
                                                  idx === itemIndex
                                                    ? {
                                                        ...itm,
                                                        href: e.target.value,
                                                      }
                                                    : itm
                                              ),
                                            }));
                                          }}
                                          placeholder='Action URL'
                                          className='text-sm'
                                        />
                                      </div>
                                    </div>
                                  )
                                )}

                                {/* Add New Item Button */}
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => {
                                    setNewQuickActionGroup(prev => ({
                                      ...prev,
                                      items: [
                                        ...prev.items,
                                        { title: { en: '', ar: '' }, href: '' },
                                      ],
                                    }));
                                  }}
                                  className='w-full border-dashed'
                                >
                                  <Plus className='h-3 w-3 mr-1' />
                                  Add Another Action
                                </Button>
                              </div>

                              {/* Action Buttons */}
                              <div className='flex gap-2 pt-2'>
                                <Button
                                  size='sm'
                                  onClick={() => {
                                    // Add all items as separate quick actions
                                    const newActions =
                                      newQuickActionGroup.items.filter(
                                        item =>
                                          item.title.en.trim() ||
                                          item.title.ar.trim()
                                      );

                                    if (newActions.length > 0) {
                                      handleFooterUpdate({
                                        ...config.footer,
                                        quickActions: [
                                          ...(config.footer?.quickActions ||
                                            []),
                                          ...newActions,
                                        ],
                                      });
                                      setShowQuickActionForm(false);
                                      setNewQuickActionGroup({
                                        title: { en: '', ar: '' },
                                        items: [
                                          {
                                            title: { en: '', ar: '' },
                                            href: '',
                                          },
                                        ],
                                      });
                                    }
                                  }}
                                  disabled={
                                    !newQuickActionGroup.items.some(
                                      item =>
                                        item.title.en.trim() ||
                                        item.title.ar.trim()
                                    )
                                  }
                                  className='flex-1'
                                >
                                  Add Actions
                                </Button>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => {
                                    setShowQuickActionForm(false);
                                    setNewQuickActionGroup({
                                      title: { en: '', ar: '' },
                                      items: [
                                        { title: { en: '', ar: '' }, href: '' },
                                      ],
                                    });
                                  }}
                                  className='flex-1'
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => setShowQuickActionForm(true)}
                              className='w-full'
                            >
                              <Plus className='h-4 w-4 mr-2' />
                              Add Quick Action
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Dynamic Sections */}
                      <div>
                        <Label className='text-sm font-medium text-gray-700'>
                          Dynamic Footer Sections
                        </Label>
                        <div className='mt-2 space-y-4'>
                          {(config.footer?.dynamicSections || []).map(
                            (section, sectionIndex) => (
                              <div
                                key={section.id || sectionIndex}
                                className='border rounded-lg p-4 space-y-3'
                              >
                                <div className='flex justify-between items-center'>
                                  <div className='space-y-2 flex-1'>
                                    <Label className='text-sm font-medium text-gray-700'>
                                      Section Title
                                    </Label>
                                    <div className='grid grid-cols-2 gap-2'>
                                      <div>
                                        <Label className='text-xs text-gray-500'>
                                          English
                                        </Label>
                                        <Input
                                          value={
                                            typeof section.title === 'object'
                                              ? section.title.en || ''
                                              : section.title || ''
                                          }
                                          onChange={e => {
                                            const updatedSection = {
                                              ...section,
                                              title: {
                                                en: e.target.value,
                                                ar:
                                                  typeof section.title ===
                                                  'object'
                                                    ? section.title.ar || ''
                                                    : '',
                                              },
                                            };
                                            updateDynamicSection(
                                              section.id,
                                              updatedSection
                                            );
                                          }}
                                          placeholder='Section Title (English)'
                                        />
                                      </div>
                                      <div>
                                        <Label className='text-xs text-gray-500'>
                                          Arabic
                                        </Label>
                                        <Input
                                          value={
                                            typeof section.title === 'object'
                                              ? section.title.ar || ''
                                              : ''
                                          }
                                          onChange={e => {
                                            const updatedSection = {
                                              ...section,
                                              title: {
                                                en:
                                                  typeof section.title ===
                                                  'object'
                                                    ? section.title.en || ''
                                                    : section.title || '',
                                                ar: e.target.value,
                                              },
                                            };
                                            updateDynamicSection(
                                              section.id,
                                              updatedSection
                                            );
                                          }}
                                          placeholder='Section Title (Arabic)'
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label className='text-xs text-gray-500'>
                                        Section Type
                                      </Label>
                                      <select
                                        value={section.type}
                                        onChange={e => {
                                          const updatedSection = {
                                            ...section,
                                            type: e.target.value as
                                              | 'customSection'
                                              | 'quickLinks',
                                          };
                                          updateDynamicSection(
                                            section.id,
                                            updatedSection
                                          );
                                        }}
                                        aria-label='Section Type'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
                                      >
                                        <option value='customSection'>
                                          Custom Section
                                        </option>
                                        <option value='quickLinks'>
                                          Quick Links Style
                                        </option>
                                        {/* Existing sections as templates */}
                                        <optgroup label='Copy from existing sections'>
                                          {(
                                            config.footer?.dynamicSections || []
                                          )
                                            .filter(
                                              existingSection =>
                                                existingSection.id !==
                                                section.id
                                            )
                                            .map(existingSection => (
                                              <option
                                                key={`copy-${existingSection.id}`}
                                                value={`copy:${existingSection.id}`}
                                              >
                                                Copy from:{' '}
                                                {typeof existingSection.title ===
                                                'object'
                                                  ? existingSection.title.en ||
                                                    existingSection.title.ar
                                                  : existingSection.title}
                                              </option>
                                            ))}
                                        </optgroup>
                                      </select>
                                    </div>
                                  </div>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                      deleteDynamicSection(section.id)
                                    }
                                    className='text-red-500 ml-2'
                                  >
                                    ×
                                  </Button>
                                </div>

                                {/* Section Items */}
                                <div className='space-y-2'>
                                  {section.items.map((item, itemIndex) => (
                                    <div
                                      key={itemIndex}
                                      className='border-l-2 border-gray-200 pl-3 space-y-2'
                                    >
                                      <div className='space-y-2'>
                                        <Label className='text-xs text-gray-500'>
                                          Item Title
                                        </Label>
                                        <div className='grid grid-cols-2 gap-2'>
                                          <div>
                                            <Label className='text-xs text-gray-400'>
                                              English
                                            </Label>
                                            <Input
                                              value={
                                                typeof item.title === 'object'
                                                  ? item.title.en || ''
                                                  : item.title || ''
                                              }
                                              onChange={e => {
                                                const updatedItem = {
                                                  ...item,
                                                  title: {
                                                    en: e.target.value,
                                                    ar:
                                                      typeof item.title ===
                                                      'object'
                                                        ? item.title.ar || ''
                                                        : '',
                                                  },
                                                };
                                                updateSectionItem(
                                                  section.id,
                                                  itemIndex,
                                                  updatedItem
                                                );
                                              }}
                                              placeholder='Title (English)'
                                            />
                                          </div>
                                          <div>
                                            <Label className='text-xs text-gray-400'>
                                              Arabic
                                            </Label>
                                            <Input
                                              value={
                                                typeof item.title === 'object'
                                                  ? item.title.ar || ''
                                                  : ''
                                              }
                                              onChange={e => {
                                                const updatedItem = {
                                                  ...item,
                                                  title: {
                                                    en:
                                                      typeof item.title ===
                                                      'object'
                                                        ? item.title.en || ''
                                                        : item.title || '',
                                                    ar: e.target.value,
                                                  },
                                                };
                                                updateSectionItem(
                                                  section.id,
                                                  itemIndex,
                                                  updatedItem
                                                );
                                              }}
                                              placeholder='Title (Arabic)'
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <Label className='text-xs text-gray-500'>
                                            URL
                                          </Label>
                                          <Input
                                            value={item.href || ''}
                                            onChange={e => {
                                              const updatedItem = {
                                                ...item,
                                                href: e.target.value,
                                              };
                                              updateSectionItem(
                                                section.id,
                                                itemIndex,
                                                updatedItem
                                              );
                                            }}
                                            placeholder='URL'
                                          />
                                        </div>
                                      </div>
                                      <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() =>
                                          deleteSectionItem(
                                            section.id,
                                            itemIndex
                                          )
                                        }
                                        className='text-red-500 text-xs'
                                      >
                                        Remove Item
                                      </Button>
                                    </div>
                                  ))}

                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                      addItemToSection(section.id, section.type)
                                    }
                                    className='w-full'
                                  >
                                    <Plus className='h-4 w-4 mr-2' />
                                    Add Item to{' '}
                                    {typeof section.title === 'object'
                                      ? section.title.en || section.title.ar
                                      : section.title}
                                  </Button>
                                </div>
                              </div>
                            )
                          )}

                          <div className=''>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => addDynamicSection('customSection')}
                              className='w-full'
                            >
                              <Plus className='h-4 w-4 mr-2' />
                              Add Custom Section
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value='layout' className='mt-0'>
                    <div className='text-center py-8'>
                      <Layout
                        className='h-12 w-12 text-gray-400 mx-auto mb-4'
                        aria-hidden='true'
                      />
                      <div className='text-gray-500 mb-4'>
                        Layout settings configuration will be available here
                      </div>
                      <Button disabled className='bg-gray-300 text-gray-500'>
                        Coming Soon
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </div>

            {/* Management Section */}
            <div className='space-y-6'>
              {/* Quick Actions */}
              <Card className='bg-white border-gray-200'>
                <CardHeader>
                  <CardTitle className='text-gray-900 flex items-center gap-2'>
                    <Settings className='h-5 w-5 text-blue-600' />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <p className='text-sm text-gray-600'>
                      Quick access to university management features
                    </p>
                    <div className='grid grid-cols-1 gap-3'>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => setActiveConfig('sections')}
                      >
                        <FileText className='h-4 w-4 mr-2' />
                        Manage Sections
                      </Button>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => setActiveConfig('pages')}
                      >
                        <FolderOpen className='h-4 w-4 mr-2' />
                        Manage Pages
                      </Button>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => setActiveConfig('menu')}
                      >
                        <Menu className='h-4 w-4 mr-2' />
                        Manage Menu
                      </Button>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => setActiveConfig('social')}
                      >
                        <Share2 className='h-4 w-4 mr-2' />
                        Manage Social Media
                      </Button>
                      <Button
                        variant='outline'
                        className='justify-start'
                        onClick={() => setActiveConfig('footer')}
                      >
                        <Palette className='h-4 w-4 mr-2' />
                        Manage Footer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* University Info */}
              <Card className='bg-white border-gray-200'>
                <CardHeader>
                  <CardTitle className='text-gray-900 flex items-center gap-2'>
                    <Building2 className='h-5 w-5 text-green-600' />
                    University Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div>
                      <Label className='text-sm font-medium text-gray-700'>
                        University ID
                      </Label>
                      <div className='p-2 bg-gray-50 rounded text-sm font-mono'>
                        {university.id}
                      </div>
                    </div>
                    <div>
                      <Label className='text-sm font-medium text-gray-700'>
                        Created
                      </Label>
                      <div className='p-2 bg-gray-50 rounded text-sm'>
                        {new Date(university.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label className='text-sm font-medium text-gray-700'>
                        Last Updated
                      </Label>
                      <div className='p-2 bg-gray-50 rounded text-sm'>
                        {new Date(university.updatedAt).toLocaleDateString()}
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
        currentValue={config.logo}
      />

      {/* Section Selector Modal */}
      {showSectionSelector && (
        <div className='fixed inset-0 bg-transparent flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border-2 border-gray-200'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Add Custom Section
            </h3>

            <div className='space-y-4'>
              {/* Section Type Selection */}
              <div>
                <Label className='text-sm font-medium text-gray-700'>
                  Section Type
                </Label>
                <div className='mt-2 space-y-2'>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='sectionType'
                      value='new'
                      checked={selectedSectionType === 'new'}
                      onChange={e =>
                        setSelectedSectionType(
                          e.target.value as 'new' | 'existing'
                        )
                      }
                      className='mr-2'
                      aria-label='Create new section'
                    />
                    Create New Section
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='sectionType'
                      value='existing'
                      checked={selectedSectionType === 'existing'}
                      onChange={e =>
                        setSelectedSectionType(
                          e.target.value as 'new' | 'existing'
                        )
                      }
                      className='mr-2'
                      aria-label='Copy existing section'
                    />
                    Copy Existing Section
                  </label>
                </div>
              </div>

              {/* Existing Section Selection */}
              {selectedSectionType === 'existing' && (
                <div>
                  <Label className='text-sm font-medium text-gray-700'>
                    Select Section to Copy
                  </Label>
                  <select
                    value={selectedExistingSection}
                    onChange={e => setSelectedExistingSection(e.target.value)}
                    className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md'
                    aria-label='Select section to copy'
                  >
                    <option value=''>Select a section...</option>
                    {(config.footer?.dynamicSections || []).map(section => (
                      <option key={section.id} value={section.id}>
                        {typeof section.title === 'object'
                          ? section.title.en || section.title.ar
                          : section.title}{' '}
                        ({section.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className='flex justify-end space-x-3 mt-6'>
              <Button
                variant='outline'
                onClick={() => {
                  setShowSectionSelector(false);
                  setSelectedSectionType('new');
                  setSelectedExistingSection('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSectionSelection}
                disabled={
                  selectedSectionType === 'existing' && !selectedExistingSection
                }
              >
                Add Section
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UniversityConfigPage;
