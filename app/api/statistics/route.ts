import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

export async function GET() {
    try {
        const statistics = await db.statistic.findMany({
            include: {
                collage: true,
            },
        });

        return NextResponse.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}

export const POST = withAuditLog(
    async (req: Request) => {
        try {
            const body = await req.json();
            const { label, collageId } = body;

            if (!label) {
                return NextResponse.json(
                    { error: 'Label is required' },
                    { status: 400 }
                );
            }

            const statistic = await db.statistic.create({
                data: {
                    label,
                    collageId,
                },
            });

            return NextResponse.json(statistic);
        } catch (error) {
            console.error('Error creating statistic:', error);
            return NextResponse.json(
                { error: 'Failed to create statistic' },
                { status: 500 }
            );
        }
    },
    {
        action: 'CREATE_STATISTIC',
        extract: () => {
            return {
                entity: 'Statistic',
            };
        },
    }
);
