import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://kong:8000/v1/api';

export async function GET(req: NextRequest) {
    try {
        // Gọi qua Kong gateway
        const res = await fetch(`${KONG_GATEWAY_URL}/cms/layouts/banners/all-raw`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error fetching all banners', data: [] }, { status: 500 });
    }
} 
