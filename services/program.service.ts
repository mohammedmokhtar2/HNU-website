import { api } from '@/lib/axios';
import {
  Program,
  CreateProgramInput,
  UpdateProgramInput,
  ProgramQueryParams,
  PaginatedProgramResponse,
  ProgramStats,
} from '@/types/program';

export class ProgramService {
  // Get all programs with optional filtering
  static async getPrograms(
    params?: ProgramQueryParams
  ): Promise<PaginatedProgramResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.collageId) searchParams.append('collageId', params.collageId);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderBy) searchParams.append('orderBy', params.orderBy);
    if (params?.orderDirection)
      searchParams.append('orderDirection', params.orderDirection);

    const response = await api.get(`/programs?${searchParams.toString()}`);
    return response.data;
  }

  // Get programs by college
  static async getProgramsByCollege(
    collageId: string,
    params?: Omit<ProgramQueryParams, 'collageId'>
  ): Promise<PaginatedProgramResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderBy) searchParams.append('orderBy', params.orderBy);
    if (params?.orderDirection)
      searchParams.append('orderDirection', params.orderDirection);

    const response = await api.get(
      `/programs/college/${collageId}?${searchParams.toString()}`
    );
    return response.data;
  }

  // Get a single program by ID
  static async getProgramById(id: string): Promise<Program> {
    const response = await api.get(`/programs/${id}`);
    return response.data;
  }

  // Create a new program
  static async createProgram(data: CreateProgramInput): Promise<Program> {
    const response = await api.post('/programs', data);
    return response.data;
  }

  // Update a program
  static async updateProgram(
    id: string,
    data: UpdateProgramInput
  ): Promise<Program> {
    const response = await api.put(`/programs/${id}`, data);
    return response.data;
  }

  // Delete a program
  static async deleteProgram(id: string): Promise<void> {
    await api.delete(`/programs/${id}`);
  }

  // Get program statistics
  static async getProgramStats(collageId?: string): Promise<ProgramStats> {
    const searchParams = new URLSearchParams();
    if (collageId) searchParams.append('collageId', collageId);

    const response = await api.get(
      `/programs/stats?${searchParams.toString()}`
    );
    return response.data;
  }
}
