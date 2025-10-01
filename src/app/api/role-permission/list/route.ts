import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization');

    // Gọi qua Kong gateway
    const res = await fetch(`${KONG_GATEWAY_URL}/role-permission/list`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {}),
        },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization');
    const body = await req.json();

    // Gọi qua Kong gateway
    const res = await fetch(`${KONG_GATEWAY_URL}/role-permission/list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {}),
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
} 
