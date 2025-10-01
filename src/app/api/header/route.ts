import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
    const search = req.nextUrl.search;

    // Gọi qua Kong gateway
    const res = await fetch(`${KONG_GATEWAY_URL}/header${search}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
    const search = req.nextUrl.search;
    const body = await req.text();

    // Gọi qua Kong gateway
    const res = await fetch(`${KONG_GATEWAY_URL}/header${search}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
