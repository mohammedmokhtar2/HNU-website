import { api } from '@/lib/axios';
import { SectionType } from '@/types/enums';
import { CreateSectionInput, UpdateSectionInput } from '@/types/section';

export class SectionService {
  static async getSections() {
    const res = await api.get('/sections');
    return res.data;
  }

  static async getSectionsByUniversity(universityId: string) {
    const res = await api.get(`/sections/university/${universityId}`);
    return res.data;
  }

  static async getSectionsByCollege(collegeId: string) {
    const res = await api.get(`/sections/college/${collegeId}`);
    return res.data;
  }

  static async getSectionById(id: string) {
    const res = await api.get(`/sections/${id}`);
    return res.data;
  }

  static async createSection(data: CreateSectionInput) {
    const res = await api.post('/sections', data);
    return res.data;
  }

  static async updateSection(id: string, data: UpdateSectionInput) {
    const res = await api.patch(`/sections/${id}`, data);
    return res.data;
  }

  static async deleteSection(id: string) {
    const res = await api.delete(`/sections/${id}`);
    return res.data;
  }

  static async reorderSections(sections: { id: string; order: number }[]) {
    const res = await api.patch('/sections/reorder', { sections });
    return res.data;
  }
}
