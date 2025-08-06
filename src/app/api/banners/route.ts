import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

const BACKEND_URL = env.NEXT_PUBLIC_CMS_API_URL;

export async function GET(req: NextRequest) {
    try {
        const search = req.nextUrl.search;
        const res = await fetch(`${BACKEND_URL}/api/layouts${search}`, {
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
        const res = await fetch(`${BACKEND_URL}/api/layouts`, {
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
