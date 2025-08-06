import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';


const baseUrl = env.NEXT_PUBLIC_CMS_API_URL;
export const dynamic = "force-dynamic";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const url = `${baseUrl}/api/blogs/${encodeURIComponent(params.id)}`;
    const body = await req.json();
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const url = `${baseUrl}/api/blogs/${encodeURIComponent(params.id)}`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    let data = {};
    let status = res.status;

    if (res.status === 204) {
        data = { success: true };
        status = 200;
    } else {
        try {
            const text = await res.text();
            data = text ? JSON.parse(text) : {};
        } catch {
            data = {};
        }
    }

    return NextResponse.json(data, { status });
} 
