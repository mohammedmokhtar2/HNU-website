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
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [config, setConfig] = useState<UniversityConfig>({
    logo: '',
    socialMedia: {},
    menuBuilder: {
      menuItems: [],
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
          setConfig({
            logo: loadedConfig.logo || '',
            socialMedia: loadedConfig.socialMedia || {},
            menuBuilder: loadedConfig.menuBuilder || {
              menuItems: [],
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
          <TabsList className='grid w-full grid-cols-8 mb-6'>
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
    </div>
  );
}

export default UniversityConfigPage;
