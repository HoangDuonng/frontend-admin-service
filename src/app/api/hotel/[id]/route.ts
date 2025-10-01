import { NextRequest } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://kong:8000/v1/api';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // Gọi qua Kong gateway
    const backendRes = await fetch(`${KONG_GATEWAY_URL}/hotel/${params.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const resBody = await backendRes.arrayBuffer();
    return new Response(resBody, {
        status: backendRes.status,
        headers: backendRes.headers,
    });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();

    // Gọi qua Kong gateway
    const backendRes = await fetch(`${KONG_GATEWAY_URL}/hotel/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const resBody = await backendRes.arrayBuffer();
    return new Response(resBody, {
        status: backendRes.status,
        headers: backendRes.headers,
    });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    // Gọi qua Kong gateway
    const backendRes = await fetch(`${KONG_GATEWAY_URL}/hotel/${params.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    const resBody = await backendRes.arrayBuffer();
    return new Response(resBody, {
        status: backendRes.status,
        headers: backendRes.headers,
    });
}


