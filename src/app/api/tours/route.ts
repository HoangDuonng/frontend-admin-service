import { NextRequest } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = "force-dynamic";

const API_TOUR_URL = env.NEXT_PUBLIC_FILE_API_URL;

export async function POST(req: NextRequest) {
    const contentType = req.headers.get('content-type') || '';
    const body = await req.arrayBuffer();

    const backendRes = await fetch(`${API_TOUR_URL}/api/tours/upload`, {
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
        backendUrl = `${API_TOUR_URL}/api/tours/${tourId}`;
    } else {
        backendUrl = `${API_TOUR_URL}/api/tours`;
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
