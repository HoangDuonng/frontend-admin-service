import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

const AUTH_API_URL = env.NEXT_PUBLIC_AUTHORIZATION_API_URL;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('authorization');
    const res = await fetch(`${AUTH_API_URL}/api/roles/user/${params.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {}),
        },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
} 
