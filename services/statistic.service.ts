import { api } from '@/lib/axios';

export class StatisticService {
    static async getStatistics() {
        const res = await api.get('/statistics');
        return res.data;
    }

    static async getStatisticById(id: string) {
        const res = await api.get(`/statistics/${id}`);
        return res.data;
    }

    static async createStatistic(data: {
        label: Record<string, string>;
        collageId?: string;
    }) {
        const res = await api.post('/statistics', data);
        return res.data;
    }

    static async updateStatistic(
        id: string,
        data: {
            label?: Record<string, string>;
            collageId?: string;
        }
    ) {
        const res = await api.patch(`/statistics/${id}`, data);
        return res.data;
    }

    static async deleteStatistic(id: string) {
        const res = await api.delete(`/statistics/${id}`);
        return res.data;
    }
}
