'use client';

import React, { useState } from 'react';
import { FileManager } from '@/components/file-manager/FileManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  BarChart3,
  Settings,
  Upload,
  HardDrive,
  Trash2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useFileList, useFileDelete } from '@/hooks/use-file-upload';
import {
  useCloudinaryUsage,
  formatBytes,
  formatNumber,
  getUsageStatusColor,
  getUsageStatus,
} from '@/hooks/use-cloudinary-usage';

function StoragePage() {
  const [resourceType, setResourceType] = useState<
    'image' | 'video' | 'raw' | 'auto'
  >('image');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const { files, isLoading, error, listFiles, refreshFiles, totalCount } =
    useFileList();

  const { deleteFile, isDeleting } = useFileDelete();
  const {
    usage,
    isLoading: usageLoading,
    error: usageError,
    refreshUsage,
    lastUpdated,
  } = useCloudinaryUsage();

  // Load files on component mount
  React.useEffect(() => {
    listFiles({
      resource_type: resourceType,
    });
  }, [resourceType, listFiles]);

  // Filter files based on search term
  const filteredFiles = files.filter(
    file =>
      file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.folder &&
        file.folder.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate storage statistics
  const totalSize = files.reduce((sum, file) => sum + file.bytes, 0);
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file type distribution
  const fileTypeStats = files.reduce(
    (stats, file) => {
      const type = file.resource_type;
      stats[type] = (stats[type] || 0) + 1;
      return stats;
    },
    {} as Record<string, number>
  );

  // Get folder distribution
  const folderStats = files.reduce(
    (stats, file) => {
      const folder = file.folder || 'root';
      stats[folder] = (stats[folder] || 0) + 1;
      return stats;
    },
    {} as Record<string, number>
  );

  const handleBulkDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete all selected files? This action cannot be undone.'
      )
    )
      return;

    const deletePromises = filteredFiles.map(file =>
      deleteFile(file.public_id, file.resource_type)
    );

    await Promise.all(deletePromises);
    refreshFiles();
  };

  const handleRefresh = () => {
    refreshFiles({
      resource_type: resourceType,
    });
  };

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold flex items-center gap-2'>
            <HardDrive className='w-8 h-8' />
            File Storage Management
          </h1>
          <p className='text-gray-600 mt-1'>
            Manage your files and storage across the platform
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Credits Used</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {usage
                ? `${formatNumber(usage.credits.used)} / ${formatNumber(usage.credits.limit)}`
                : 'Loading...'}
            </div>
            <p
              className={`text-xs ${usage ? getUsageStatusColor(usage.credits.percentage) : 'text-muted-foreground'}`}
            >
              {usage ? `${usage.credits.percentage}% used` : 'Fetching data...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Storage Used</CardTitle>
            <HardDrive className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {usage ? formatBytes(usage.storage.used) : 'Loading...'}
            </div>
            <p
              className={`text-xs ${usage ? getUsageStatusColor(usage.storage.percentage) : 'text-muted-foreground'}`}
            >
              {usage
                ? `${usage.storage.percentage}% of ${formatBytes(usage.storage.limit)}`
                : 'Fetching data...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Bandwidth Used
            </CardTitle>
            <Upload className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {usage ? formatBytes(usage.bandwidth.used) : 'Loading...'}
            </div>
            <p
              className={`text-xs ${usage ? getUsageStatusColor(usage.bandwidth.percentage) : 'text-muted-foreground'}`}
            >
              {usage
                ? `${usage.bandwidth.percentage}% of ${formatBytes(usage.bandwidth.limit)}`
                : 'Fetching data...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Transformations
            </CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {usage
                ? `${formatNumber(usage.transformations.used)} / ${formatNumber(usage.transformations.limit)}`
                : 'Loading...'}
            </div>
            <p
              className={`text-xs ${usage ? getUsageStatusColor(usage.transformations.percentage) : 'text-muted-foreground'}`}
            >
              {usage
                ? `${usage.transformations.percentage}% used`
                : 'Fetching data...'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue='files' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='files' className='flex items-center gap-2'>
            <FileText className='w-4 h-4' />
            File Manager
          </TabsTrigger>
          <TabsTrigger value='analytics' className='flex items-center gap-2'>
            <BarChart3 className='w-4 h-4' />
            Analytics
          </TabsTrigger>
          <TabsTrigger value='settings' className='flex items-center gap-2'>
            <Settings className='w-4 h-4' />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* File Manager Tab */}
        <TabsContent value='files' className='space-y-4'>
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Search Files
                  </label>
                  <Input
                    placeholder='Search by filename or folder...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    File Type
                  </label>
                  <Select
                    value={resourceType}
                    onValueChange={(value: any) => setResourceType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='image'>Images</SelectItem>
                      <SelectItem value='video'>Videos</SelectItem>
                      <SelectItem value='raw'>Documents</SelectItem>
                      <SelectItem value='auto'>All Types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-end'>
                  <Button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className='w-full'
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                    />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Manager Component */}
          <FileManager
            showUpload={true}
            showDelete={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            resourceType={resourceType}
            onResourceTypeChange={setResourceType}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value='analytics' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* File Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>File Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {Object.entries(fileTypeStats).map(([type, count]) => (
                    <div
                      key={type}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline'>{type}</Badge>
                      </div>
                      <span className='font-medium'>{count} files</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Folder Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Folder Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {Object.entries(folderStats).map(([folder, count]) => (
                    <div
                      key={folder}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-2'>
                        <HardDrive className='w-4 h-4 text-gray-500' />
                        <span className='text-sm'>{folder || 'root'}</span>
                      </div>
                      <span className='font-medium'>{count} files</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cloudinary Usage Overview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>Cloudinary Usage Overview</span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={refreshUsage}
                    disabled={usageLoading}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${usageLoading ? 'animate-spin' : ''}`}
                    />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usageError ? (
                  <div className='text-red-600 text-sm'>{usageError}</div>
                ) : usage ? (
                  <div className='space-y-4'>
                    {/* Credits */}
                    <div>
                      <div className='flex justify-between text-sm mb-1'>
                        <span>Credits</span>
                        <span
                          className={getUsageStatusColor(
                            usage.credits.percentage
                          )}
                        >
                          {formatNumber(usage.credits.used)} /{' '}
                          {formatNumber(usage.credits.limit)}
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            usage.credits.percentage >= 90
                              ? 'bg-red-500'
                              : usage.credits.percentage >= 75
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(usage.credits.percentage, 100)}%`,
                          }}
                        />
                      </div>
                      <div className='text-xs text-gray-500 mt-1'>
                        Status: {getUsageStatus(usage.credits.percentage)} -{' '}
                        {usage.credits.remaining} credits remaining
                      </div>
                    </div>

                    {/* Storage */}
                    <div>
                      <div className='flex justify-between text-sm mb-1'>
                        <span>Storage</span>
                        <span
                          className={getUsageStatusColor(
                            usage.storage.percentage
                          )}
                        >
                          {formatBytes(usage.storage.used)} /{' '}
                          {formatBytes(usage.storage.limit)}
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            usage.storage.percentage >= 90
                              ? 'bg-red-500'
                              : usage.storage.percentage >= 75
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(usage.storage.percentage, 100)}%`,
                          }}
                        />
                      </div>
                      <div className='text-xs text-gray-500 mt-1'>
                        {formatBytes(usage.storage.remaining)} remaining
                      </div>
                    </div>

                    {/* Bandwidth */}
                    <div>
                      <div className='flex justify-between text-sm mb-1'>
                        <span>Bandwidth</span>
                        <span
                          className={getUsageStatusColor(
                            usage.bandwidth.percentage
                          )}
                        >
                          {formatBytes(usage.bandwidth.used)} /{' '}
                          {formatBytes(usage.bandwidth.limit)}
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            usage.bandwidth.percentage >= 90
                              ? 'bg-red-500'
                              : usage.bandwidth.percentage >= 75
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(usage.bandwidth.percentage, 100)}%`,
                          }}
                        />
                      </div>
                      <div className='text-xs text-gray-500 mt-1'>
                        {formatBytes(usage.bandwidth.remaining)} remaining
                      </div>
                    </div>

                    {lastUpdated && (
                      <div className='text-xs text-gray-400 pt-2 border-t'>
                        Last updated: {lastUpdated.toLocaleString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='text-center py-4'>
                    <RefreshCw className='w-6 h-6 animate-spin mx-auto mb-2' />
                    <p className='text-sm text-gray-500'>
                      Loading usage data...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {files.slice(0, 5).map(file => (
                    <div
                      key={file.public_id}
                      className='flex items-center justify-between text-sm'
                    >
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full' />
                        <span className='truncate'>{file.filename}</span>
                      </div>
                      <span className='text-gray-500'>
                        {new Date(file.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value='settings' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Maximum File Size</label>
                <Input value='10 MB' disabled className='bg-gray-50' />
                <p className='text-xs text-gray-500'>
                  Maximum file size allowed for uploads
                </p>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  Allowed File Types
                </label>
                <div className='flex flex-wrap gap-1'>
                  {[
                    'jpg',
                    'jpeg',
                    'png',
                    'gif',
                    'webp',
                    'mp4',
                    'mov',
                    'avi',
                    'pdf',
                    'doc',
                    'docx',
                    'txt',
                  ].map(type => (
                    <Badge key={type} variant='secondary'>
                      {type}
                    </Badge>
                  ))}
                </div>
                <p className='text-xs text-gray-500'>
                  File types currently allowed for upload
                </p>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  Cloudinary Plan & Usage
                </label>
                <div className='space-y-3 text-sm'>
                  {usage ? (
                    <>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <div className='flex justify-between'>
                            <span>Plan Type:</span>
                            <span className='font-semibold'>
                              Free Tier (25 credits/month)
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span>Credits Used:</span>
                            <span
                              className={getUsageStatusColor(
                                usage.credits.percentage
                              )}
                            >
                              {formatNumber(usage.credits.used)} /{' '}
                              {formatNumber(usage.credits.limit)}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span>Storage Used:</span>
                            <span
                              className={getUsageStatusColor(
                                usage.storage.percentage
                              )}
                            >
                              {formatBytes(usage.storage.used)} /{' '}
                              {formatBytes(usage.storage.limit)}
                            </span>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <div className='flex justify-between'>
                            <span>Bandwidth Used:</span>
                            <span
                              className={getUsageStatusColor(
                                usage.bandwidth.percentage
                              )}
                            >
                              {formatBytes(usage.bandwidth.used)} /{' '}
                              {formatBytes(usage.bandwidth.limit)}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span>Transformations:</span>
                            <span
                              className={getUsageStatusColor(
                                usage.transformations.percentage
                              )}
                            >
                              {formatNumber(usage.transformations.used)} /{' '}
                              {formatNumber(usage.transformations.limit)}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span>API Requests:</span>
                            <span
                              className={getUsageStatusColor(
                                usage.requests.percentage
                              )}
                            >
                              {formatNumber(usage.requests.used)} /{' '}
                              {formatNumber(usage.requests.limit)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='pt-2 border-t'>
                        <div className='flex justify-between items-center'>
                          <span>Overall Status:</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              usage.credits.percentage >= 90
                                ? 'bg-red-100 text-red-800'
                                : usage.credits.percentage >= 75
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {getUsageStatus(usage.credits.percentage)}
                          </span>
                        </div>
                        {usage.credits.percentage >= 75 && (
                          <div className='mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800'>
                            ⚠️ You're using {usage.credits.percentage}% of your
                            monthly credits. Consider upgrading your plan if you
                            need more resources.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className='text-center py-4'>
                      <RefreshCw className='w-6 h-6 animate-spin mx-auto mb-2' />
                      <p className='text-sm text-gray-500'>
                        Loading plan information...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  Cloudinary Configuration
                </label>
                <div className='space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span>Cloud Name:</span>
                    <span className='font-mono text-xs bg-gray-100 px-2 py-1 rounded'>
                      {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
                        'Not configured'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>API Key:</span>
                    <span className='font-mono text-xs bg-gray-100 px-2 py-1 rounded'>
                      {process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
                        ? '***'
                        : 'Not configured'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StoragePage;
