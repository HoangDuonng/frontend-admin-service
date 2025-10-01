import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://kong:8000/v1/api';

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization');

    // Gọi qua Kong gateway
    const res = await fetch(`${KONG_GATEWAY_URL}/roles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {}),
        },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
