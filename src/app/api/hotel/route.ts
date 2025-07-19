import { NextRequest } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

const API_HOTEL_URL = env.NEXT_PUBLIC_HOTEL_API_URL;

export async function GET(req: NextRequest) {
    const backendRes = await fetch(`${API_HOTEL_URL}/api/hotels`, {
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

export async function POST(req: NextRequest) {
    const body = await req.json();
    const backendRes = await fetch(`${API_HOTEL_URL}/api/hotels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const resBody = await backendRes.arrayBuffer();
    return new Response(resBody, {
        status: backendRes.status,
        headers: backendRes.headers,
    });
}


