import { NextRequest } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = "force-dynamic";
const API_TOUR_URL = env.NEXT_PUBLIC_FILE_API_URL;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const contentType = req.headers.get('content-type') || '';
    const body = await req.arrayBuffer();
    const backendRes = await fetch(`${API_TOUR_URL}/api/tours/${params.id}`, {
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
    const backendRes = await fetch(`${API_TOUR_URL}/api/tours/${params.id}`, {
        method: 'DELETE',
    });
    const resBody = await backendRes.arrayBuffer();
    return new Response(resBody, {
        status: backendRes.status,
        headers: backendRes.headers,
    });
}
