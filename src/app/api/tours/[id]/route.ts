import { NextRequest } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = "force-dynamic";

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://localhost:8000';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const contentType = req.headers.get('content-type') || '';
    const body = await req.arrayBuffer();

    // Gọi qua Kong gateway
    const backendRes = await fetch(`${KONG_GATEWAY_URL}/tours/${params.id}`, {
        method: 'PUT',
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    // Gọi qua Kong gateway
    const backendRes = await fetch(`${KONG_GATEWAY_URL}/tours/${params.id}`, {
        method: 'DELETE',
    });
    const resBody = await backendRes.arrayBuffer();
    return new Response(resBody, {
        status: backendRes.status,
        headers: backendRes.headers,
    });
}
