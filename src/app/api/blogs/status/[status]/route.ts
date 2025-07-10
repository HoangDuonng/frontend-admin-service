import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    { params }: { params: { status: string } }
) {
    const baseUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8086';
    const url = `${baseUrl}/api/blogs/status/${encodeURIComponent(params.status)}`;
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch blogs by status' }, { status: 500 });
    }
} 
