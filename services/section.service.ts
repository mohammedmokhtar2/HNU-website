import { api } from '@/lib/axios';
import { SectionType } from '@/types/enums';

export class SectionService {
  static async getSections() {
    const res = await api.get('/sections');
    return res.data;
  }

  static async getSectionById(id: string) {
    const res = await api.get(`/sections/${id}`);
    return res.data;
  }

  static async createSection(data: {
    type: SectionType;
    title: Record<string, string>;
    content: Record<string, any>;
    mediaUrl?: string;
    order: number;
    collageId?: string;
    universityId?: string;
  }) {
    const res = await api.post('/sections', data);
    return res.data;
  }

  static async updateSection(
    id: string,
    data: {
      type?: SectionType;
      title?: Record<string, string>;
      content?: Record<string, any>;
      mediaUrl?: string;
      order?: number;
      collageId?: string;
      universityId?: string;
    }
  ) {
    const res = await api.patch(`/sections/${id}`, data);
    return res.data;
  }

  static async deleteSection(id: string) {
    const res = await api.delete(`/sections/${id}`);
    return res.data;
  }
}
