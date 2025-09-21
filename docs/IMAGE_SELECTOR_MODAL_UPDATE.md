# ImageSelectorModal Component Update

## Overview
The `ImageSelectorModal` component has been enhanced to support multiple file types including images, videos, PDFs, text files, and documents. The component now provides a unified interface for selecting and uploading various file formats.

## New Features

### 1. Multi-Format Support
- **Images**: JPG, JPEG, PNG, GIF, WebP, SVG, BMP
- **Videos**: MP4, MOV, AVI, WebM, MKV
- **PDFs**: PDF documents
- **Text Files**: TXT, MD, JSON, XML, CSV, LOG
- **Documents**: DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Other**: Any other file format with generic icon

### 2. Enhanced File Preview
- **Images**: Full image preview with proper aspect ratio
- **Videos**: Video thumbnail with play button overlay
- **PDFs**: PDF icon with file type indicator
- **Text Files**: Text file icon with type indicator
- **Documents**: Document icon with type indicator
- **File Info**: Shows filename and file size for all file types

### 3. Smart File Type Detection
- Automatic file type detection based on file extension and MIME type
- Proper resource type handling for Cloudinary uploads
- File type filtering based on accepted file types

### 4. Improved User Experience
- Visual file type indicators
- File size formatting (Bytes, KB, MB, GB)
- Better loading states and error handling
- Responsive grid layout for file previews

## Usage Examples

### Basic Usage (All File Types)
```tsx
import { ImageSelectorModal } from '@/components/ui/image-selector-modal';

<ImageSelectorModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSelect={(url) => {
    console.log('Selected file:', url);
    setIsOpen(false);
  }}
  currentValue={selectedFileUrl}
/>
```

### Images Only
```tsx
<ImageSelectorModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSelect={handleFileSelect}
  acceptedFileTypes={['image']}
  title="Select Image"
/>
```

### Videos and Images Only
```tsx
<ImageSelectorModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSelect={handleFileSelect}
  acceptedFileTypes={['image', 'video']}
  title="Select Media File"
/>
```

### Documents Only
```tsx
<ImageSelectorModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSelect={handleFileSelect}
  acceptedFileTypes={['pdf', 'document', 'text']}
  title="Select Document"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Callback when modal is closed |
| `onSelect` | `(url: string) => void` | - | Callback when file is selected |
| `currentValue` | `string` | `undefined` | Currently selected file URL |
| `acceptedFileTypes` | `FileType[]` | `['image', 'video', 'pdf', 'text', 'document']` | Allowed file types |
| `title` | `string` | `'Select or Upload File'` | Modal title |

## File Type Definitions

```typescript
type FileType = 'image' | 'video' | 'pdf' | 'text' | 'document' | 'other';
```

## Utility Functions

The component uses utility functions from `@/lib/file-utils.ts`:

- `getFileType(file)`: Determines file type from file object
- `getFileIcon(fileType)`: Returns appropriate icon for file type
- `formatFileSize(bytes)`: Formats file size in human-readable format

## Backward Compatibility

The component maintains full backward compatibility with existing implementations. All existing props work as before, with new optional props providing enhanced functionality.

## Cloudinary Integration

The component automatically handles different resource types for Cloudinary:
- Images: `resource_type: 'image'`
- Videos: `resource_type: 'video'`
- Other files: `resource_type: 'raw'`

## File Upload Process

1. User selects file from existing files or uploads new file
2. File type is automatically detected
3. Appropriate resource type is set for Cloudinary upload
4. File is uploaded with proper tags and folder structure
5. Selected file URL is returned via `onSelect` callback

## Styling

The component uses Tailwind CSS classes and maintains consistent styling with the existing design system. File previews are displayed in a responsive grid layout with hover effects and selection indicators.
