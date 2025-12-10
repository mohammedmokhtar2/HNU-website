import { api } from '@/lib/axios';
import { CreatePageInput, UpdatePageInput } from '@/types/page';

export class PageService {
  static async getPages() {
    const res = await api.get('/pages');
    return res.data;
  }

  static async getPagesByUniversity(universityId: string) {
    const res = await api.get(`/pages?universityId=${universityId}`);
    return res.data;
  }

  static async getPagesByCollege(collegeId: string) {
    const res = await api.get(`/pages?collegeId=${collegeId}`);
    return res.data;
  }

  static async getPageById(id: string) {
    const res = await api.get(`/pages/${id}`);
    return res.data;
  }

  static async createPage(data: CreatePageInput) {
    const res = await api.post('/pages', data);
    return res.data;
  }

  static async updatePage(id: string, data: UpdatePageInput) {
    const res = await api.patch(`/pages/${id}`, data);
    return res.data;
  }

  static async deletePage(id: string) {
    const res = await api.delete(`/pages/${id}`);
    return res.data;
  }

  static async reorderPages(pages: { id: string; order: number }[]) {
    const res = await api.patch('/pages/reorder', { pages });
    return res.data;
  }
}
