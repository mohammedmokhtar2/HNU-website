import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
    params: {
        slug: string;
    };
}

export async function GET(req: Request, { params }: Params) {
    try {
        const { slug } = params;

        const university = await db.university.findUnique({
            where: { slug },
            include: {
                sections: {
                    orderBy: {
                        order: 'asc',
                    },
                },
                colleges: true,
            },
        });

        if (!university) {
            return NextResponse.json(
                { error: 'University not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(university);
    } catch (error) {
        console.error('Error fetching university by slug:', error);
        return NextResponse.json(
            { error: 'Failed to fetch university' },
            { status: 500 }
        );
    }
}
