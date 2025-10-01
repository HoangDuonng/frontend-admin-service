import { NextRequest } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = "force-dynamic";

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://kong:8000/v1/api';

export async function POST(req: NextRequest) {
    const contentType = req.headers.get('content-type') || '';
    const body = await req.arrayBuffer();

    // Gọi qua Kong gateway
    const backendRes = await fetch(`${KONG_GATEWAY_URL}/tours`, {
        method: 'POST',
        headers: {
            'Content-Type': contentType,
        },
        body,
    });

    const resBody = await backendRes.arrayBuffer();
    return new Response(resBody, {
        status: backendRes.status,
        headers: backendRes.headers,
    });
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tourId = searchParams.get('tourId');
    let backendUrl = '';
    if (tourId) {
        // Gọi qua Kong gateway
        backendUrl = `${KONG_GATEWAY_URL}/tours?tourId=${tourId}`;
    } else {
        // Gọi qua Kong gateway
        backendUrl = `${KONG_GATEWAY_URL}/tours`;
    }
    const backendRes = await fetch(backendUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const resBody = await backendRes.arrayBuffer();
    return new Response(resBody, {
        status: backendRes.status,
        headers: backendRes.headers,
    });
}
