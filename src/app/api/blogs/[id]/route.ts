import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://kong:8000/v1/api';

export const dynamic = "force-dynamic";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    // Gọi qua Kong gateway
    const url = `${KONG_GATEWAY_URL}/blogs/${encodeURIComponent(params.id)}`;
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
    // Gọi qua Kong gateway
    const url = `${KONG_GATEWAY_URL}/blogs/${encodeURIComponent(params.id)}`;
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
