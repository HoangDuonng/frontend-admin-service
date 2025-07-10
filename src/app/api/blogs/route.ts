import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8086';
    const url = `${baseUrl}/api/blogs${req.nextUrl.search}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8086';
    const url = `${baseUrl}/api/blogs`;

    try {
        const body = await req.json();
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.error || 'Failed to create blog' }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}
