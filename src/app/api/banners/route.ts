import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
    try {
        const search = req.nextUrl.search;

        // Gọi qua Kong gateway
        const res = await fetch(`${KONG_GATEWAY_URL}/banners${search}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch banners' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Gọi qua Kong gateway
        const res = await fetch(`${KONG_GATEWAY_URL}/banners`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create banner' },
            { status: 500 }
        );
    }
} 
