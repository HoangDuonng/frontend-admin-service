import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://kong:8000/v1/api';

export async function POST(req: NextRequest) {
    try {
        // Gọi qua Kong gateway
        const url = `${KONG_GATEWAY_URL}/handlefile/files/banners`;
        const headers = new Headers(req.headers);
        headers.delete('host');

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: req.body,
            duplex: 'half',
        } as any);

        const contentType = res.headers.get('content-type');
        const data = contentType?.includes('application/json') ? await res.json() : await res.text();

        return new NextResponse(
            contentType?.includes('application/json') ? JSON.stringify(data) : data,
            {
                status: res.status,
                headers: { 'content-type': contentType || '' },
            }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to upload banner image' },
            { status: 500 }
        );
    }
} 
