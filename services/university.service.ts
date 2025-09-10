import { api } from '@/lib/axios';

export class UniversityService {
    static async getUniversities() {
        const res = await api.get('/university');
        return res.data;
    }

    static async getUniversityById(id: string) {
        const res = await api.get(`/university/${id}`);
        return res.data;
    }

    static async getUniversityBySlug(slug: string) {
        const res = await api.get(`/university/slug/${slug}`);
        return res.data;
    }

    static async createUniversity(data: {
        name: Record<string, string>;
        slug: string;
        config?: Record<string, any>;
    }) {
        const res = await api.post('/university', data);
        return res.data;
    }

    static async updateUniversity(
        id: string,
        data: {
            name?: Record<string, string>;
            slug?: string;
            config?: Record<string, any>;
        }
    ) {
        const res = await api.patch(`/university/${id}`, data);
        return res.data;
    }

    static async deleteUniversity(id: string) {
        const res = await api.delete(`/university/${id}`);
        return res.data;
    }
}
