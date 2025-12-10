import { api } from '@/lib/axios';
import {
  CreatePageSectionInput,
  UpdatePageSectionInput,
} from '@/types/pageSections';

export class PageSectionService {
  static async getPageSections() {
    const res = await api.get('/page-sections');
    return res.data;
  }

  static async getPageSectionsByPage(pageId: string) {
    const res = await api.get(`/page-sections?pageId=${pageId}`);
    return res.data;
  }

  static async getPageSectionById(id: string) {
    const res = await api.get(`/page-sections/${id}`);
    return res.data;
  }

  static async createPageSection(data: CreatePageSectionInput) {
    const res = await api.post('/page-sections', data);
    return res.data;
  }

  static async updatePageSection(id: string, data: UpdatePageSectionInput) {
    const res = await api.patch(`/page-sections/${id}`, data);
    return res.data;
  }

  static async deletePageSection(id: string) {
    const res = await api.delete(`/page-sections/${id}`);
    return res.data;
  }

  static async reorderPageSections(sections: { id: string; order: number }[]) {
    const res = await api.patch('/page-sections/reorder', { sections });
    return res.data;
  }
}
