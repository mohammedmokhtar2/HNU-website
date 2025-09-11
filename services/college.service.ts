import { api } from '@/lib/axios';
import { CollegeType } from '@/types/enums';

export class CollegeService {
  static async getColleges() {
    const res = await api.get('/colleges');
    return res.data;
  }

  static async getCollegeById(id: string) {
    const res = await api.get(`/colleges/${id}`);
    return res.data;
  }

  static async getCollegeBySlug(slug: string) {
    const res = await api.get(`/colleges/slug/${slug}`);
    return res.data;
  }

  static async createCollege(data: {
    name: Record<string, string>;
    slug: string;
    type: CollegeType;
    config?: Record<string, any>;
    universityId?: string;
  }) {
    const res = await api.post('/colleges', data);
    return res.data;
  }

  static async updateCollege(
    id: string,
    data: {
      name?: Record<string, string>;
      slug?: string;
      type?: CollegeType;
      config?: Record<string, any>;
      universityId?: string;
    }
  ) {
    const res = await api.patch(`/colleges/${id}`, data);
    return res.data;
  }

  static async deleteCollege(id: string) {
    const res = await api.delete(`/colleges/${id}`);
    return res.data;
  }
}
