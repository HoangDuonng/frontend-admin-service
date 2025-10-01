import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = "force-dynamic";

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
    // Gọi qua Kong gateway
    const url = `${KONG_GATEWAY_URL}/blogs${req.nextUrl.search}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // Gọi qua Kong gateway
    const url = `${KONG_GATEWAY_URL}/blogs`;

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
