import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

export async function GET() {
    try {
        const colleges = await db.college.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                sections: true,
                statistics: true,
                University: true,
            },
        });

        return NextResponse.json(colleges);
    } catch (error) {
        console.error('Error fetching colleges:', error);
        return NextResponse.json(
            { error: 'Failed to fetch colleges' },
            { status: 500 }
        );
    }
}

export const POST = withAuditLog(
    async (req: Request) => {
        try {
            const body = await req.json();
            const { name, slug, type, config, universityId } = body;

            if (!name || !slug || !type) {
                return NextResponse.json(
                    { error: 'Name, slug, and type are required' },
                    { status: 400 }
                );
            }

            const exists = await db.college.findUnique({
                where: { slug },
            });

            if (exists) {
                return NextResponse.json(
                    { error: 'College with this slug already exists' },
                    { status: 400 }
                );
            }

            const college = await db.college.create({
                data: {
                    name,
                    slug,
                    type,
                    config: config || {},
                    universityId: universityId || null,
                },
            });

            return NextResponse.json(college);
        } catch (error) {
            console.error('Error creating college:', error);
            return NextResponse.json(
                { error: 'Failed to create college' },
                { status: 500 }
            );
        }
    },
    {
        action: 'CREATE_COLLEGE',
        extract: () => {
            return {
                entity: 'College',
            };
        },
    }
);
