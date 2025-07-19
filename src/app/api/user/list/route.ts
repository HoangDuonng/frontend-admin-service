import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

const USER_API_URL = env.NEXT_PUBLIC_USER_API_URL;

export async function GET(req: NextRequest) {
    const search = req.nextUrl.search;
    const token = req.headers.get('authorization');
    const res = await fetch(`${USER_API_URL}/api/users/active${search}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {}),
        },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
} 
