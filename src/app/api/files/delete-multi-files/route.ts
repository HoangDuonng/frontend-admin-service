import { NextRequest } from 'next/server';
import { env } from '@/env.mjs';

const FILE_SERVICE_URL = process.env.NEXT_PUBLIC_FILE_API_URL;

export async function DELETE(req: NextRequest) {
    const body = await req.text();
    const backendRes = await fetch(FILE_SERVICE_URL + '/api/files/bulk/images/hotels', {
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