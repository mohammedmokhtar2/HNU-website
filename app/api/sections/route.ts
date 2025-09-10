import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuditLog } from '@/lib/middleware/withAuditLog';

export async function GET() {
    try {
        const sections = await db.section.findMany({
            orderBy: [
                { universityId: 'asc' },
                { collageId: 'asc' },
                { order: 'asc' }
            ],
            include: {
                collage: true,
                University: true,
            },
        });

        return NextResponse.json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sections' },
            { status: 500 }
        );
    }
}

export const POST = withAuditLog(
    async (req: Request) => {
        try {
            const body = await req.json();
            const { type, title, content, mediaUrl, order, collageId, universityId } = body;

            if (!type || !title || !content) {
                return NextResponse.json(
                    { error: 'Type, title, and content are required' },
                    { status: 400 }
                );
            }

            // Validate that section belongs to either university or college
            if (!universityId && !collageId) {
                return NextResponse.json(
                    { error: 'Section must belong to either a university or a college' },
                    { status: 400 }
                );
            }

            const section = await db.section.create({
                data: {
                    type,
                    title,
                    content,
                    mediaUrl,
                    order: order || 0,
                    collageId,
                    universityId,
                },
            });

            return NextResponse.json(section);
        } catch (error) {
            console.error('Error creating section:', error);
            return NextResponse.json(
                { error: 'Failed to create section' },
                { status: 500 }
            );
        }
    },
    {
        action: 'CREATE_SECTION',
        extract: () => {
            return {
                entity: 'Section',
            };
        },
    }
);
