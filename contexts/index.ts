// Export all providers
export { Providers } from './providers';
export { UniversityProvider, useUniversity } from './UniversityContext';
export { CollegeProvider, useCollege } from './CollegeContext';
export { ProgramProvider, useProgram } from './ProgramContext';
export { SectionProvider, useSection } from './SectionContext';
export {
  BlogProvider,
  useBlog,
  useBlogs,
  useBlogStats,
  useCurrentBlog,
  useBlogMutations,
  useBlogFilters,
} from './BlogContext';
export { MessageProvider, useMessage } from './MessageContext';

// Export axios instance
export { api } from '../lib/axios';

// Export custom hooks

// Export React Query hooks for convenience
export {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';

// Export React Hook Form utilities
export {
  useForm as useReactHookForm,
  useFieldArray,
  useWatch,
  useController,
} from 'react-hook-form';
