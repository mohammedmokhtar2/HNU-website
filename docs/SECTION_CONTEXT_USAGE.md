# Section Context Usage

This document explains how to use the SectionContext for managing sections in the application.

## Overview

The SectionContext provides a centralized way to manage sections with the following features:
- Fetch sections by various criteria (university, college, type)
- Get individual sections by ID
- Caching for improved performance
- Error handling and loading states

## API Endpoints

### Get Section by ID
```
GET /api/sections/[id]
```

### Get Sections with Filters
```
GET /api/sections?universityId=xxx&collegeId=xxx&type=xxx
```

### Update Section
```
PUT /api/sections/[id]
```

### Delete Section
```
DELETE /api/sections/[id]
```

## Context Usage

### Basic Setup

The SectionContext is automatically provided through the main Providers component:

```tsx
import { Providers } from '@/contexts';

function App() {
  return (
    <Providers universityId="university-id" collegeId="college-id">
      <YourComponent />
    </Providers>
  );
}
```

### Using the Context

```tsx
import { useSection } from '@/contexts/SectionContext';

function MyComponent() {
  const {
    sections,           // All sections for the current context
    loading,           // Loading state
    error,             // Error message if any
    refetch,           // Function to refetch sections
    getSectionById,    // Function to get section by ID
    getSectionsByUniversity, // Function to get sections by university
    getSectionsByCollege,    // Function to get sections by college
    getSectionsByType,       // Function to get sections by type
    isInitialLoad      // Whether this is the initial load
  } = useSection();

  // Get a specific section by ID
  const handleGetSection = async (sectionId: string) => {
    const section = await getSectionById(sectionId);
    if (section) {
      console.log('Found section:', section);
    } else {
      console.log('Section not found');
    }
  };

  // Get sections by university
  const handleGetUniversitySections = async (universityId: string) => {
    const sections = await getSectionsByUniversity(universityId);
    console.log('University sections:', sections);
  };

  // Get sections by college
  const handleGetCollegeSections = async (collegeId: string) => {
    const sections = await getSectionsByCollege(collegeId);
    console.log('College sections:', sections);
  };

  // Get sections by type
  const handleGetSectionsByType = async (type: string) => {
    const sections = await getSectionsByType(type);
    console.log('Sections by type:', sections);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Sections ({sections.length})</h2>
      {sections.map(section => (
        <div key={section.id}>
          <h3>{section.type}</h3>
          <p>Order: {section.order}</p>
        </div>
      ))}
    </div>
  );
}
```

## Section Types

The context works with the following section types defined in `types/section.ts`:

- `HERO` - Hero sections
- `ABOUT` - About sections
- `ACTIONS` - Action sections
- `OUR_MISSION` - Mission sections
- `NUMBERS` - Statistics sections
- `STUDENT_UNION` - Student union sections
- `COLLEGES_SECTION` - College showcase sections
- `PROGRAMS_SECTION` - Programs showcase sections
- `EGYPT_STUDENT_GROUP` - Egypt student group sections
- `PRESIDENT` - President sections
- `BLOGS` - Blog sections
- `CUSTOM` - Custom sections

## Caching

The context implements intelligent caching:
- Data is cached for 5 minutes
- Cache is automatically invalidated on refetch
- Different cache keys for different filter combinations

## Error Handling

The context provides comprehensive error handling:
- Network errors are caught and displayed
- 404 errors for missing sections return null
- All errors are logged to console for debugging

## Performance Considerations

- Use `getSectionById` for single section lookups
- Use the main `sections` array for displaying multiple sections
- The context automatically handles loading states and prevents unnecessary re-renders
- Caching reduces API calls and improves performance
