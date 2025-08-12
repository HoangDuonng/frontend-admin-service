import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
    const search = req.nextUrl.search;
    const token = req.headers.get('authorization');

    try {
        const res = await fetch(`${KONG_GATEWAY_URL}/user/list${search}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': token } : {}),
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Error fetching data from Kong:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
