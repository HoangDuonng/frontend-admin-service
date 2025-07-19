import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

const AUTH_API_URL = env.NEXT_PUBLIC_AUTHORIZATION_API_URL;

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization');
    const res = await fetch(`${AUTH_API_URL}/api/permissions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {}),
        },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization');
    const body = await req.json();

    const res = await fetch(`${AUTH_API_URL}/api/permissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {}),
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
} 
