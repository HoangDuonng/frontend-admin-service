import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://kong:8000/v1/api';

export async function GET(req: NextRequest) {
    try {
        const res = await fetch(`${KONG_GATEWAY_URL}/cms/layouts/banners/active`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error fetching active banners', data: [] }, { status: 500 });
    }
} 
