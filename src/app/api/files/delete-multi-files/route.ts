import { NextRequest } from 'next/server';
import { env } from '@/env.mjs';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = process.env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://kong:8000/v1/api';

export async function DELETE(req: NextRequest) {
    const body = await req.text();

    // Gọi qua Kong gateway
    const backendRes = await fetch(`${KONG_GATEWAY_URL}/handlefile/files/delete-multi-files`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body,
    });
    const resBody = await backendRes.arrayBuffer();
    return new Response(resBody, {
        status: backendRes.status,
        headers: backendRes.headers,
    });
} 