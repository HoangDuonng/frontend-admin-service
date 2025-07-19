import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

const AUTH_API_URL = env.NEXT_PUBLIC_AUTHORIZATION_API_URL;

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization');
    const res = await fetch(`${AUTH_API_URL}/api/roles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {}),
        },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
 