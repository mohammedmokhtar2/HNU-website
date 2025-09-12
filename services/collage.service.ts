import { api } from '@/lib/axios';
import type { College } from '@/types/college';

export class CollegeService {
  // Get all colleges
  static async getColleges(params?: {
    type?: string;
    createdById?: string;
    assignedToUserId?: string;
  }) {
    const res = await api.get<College[]>('/colleges', { params });
    return res.data;
  }

  // Get a single college by ID
  static async getCollege(id: string) {
    const res = await api.get<College>(`/colleges/${id}`);
    return res.data;
  }

  // Get a college by slug
  static async getCollegeBySlug(slug: string) {
    const res = await api.get<College>(`/colleges/slug/${slug}`);
    return res.data;
  }

  // Create a new college
  static async createCollege(data: Partial<College>) {
    const res = await api.post<College>(`/colleges/create`, data);
    return res.data;
  }

  // Update a college
  static async updateCollege(id: string, data: Partial<College>) {
    console.log('Data', data);
    const res = await api.put<College>(`/colleges/${id}/update`, data);
    return res.data;
  }

  // Delete a college
  static async deleteCollege(id: string) {
    const res = await api.delete<{ success: boolean }>(
      `/colleges/${id}/delete`
    );
    return res.data;
  }
}
