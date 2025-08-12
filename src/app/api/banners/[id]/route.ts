import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://localhost:8000';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Gọi qua Kong gateway
        const res = await fetch(`${KONG_GATEWAY_URL}/banners/${encodeURIComponent(params.id)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch banner' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();

        // Gọi qua Kong gateway
        const res = await fetch(`${KONG_GATEWAY_URL}/banners/${encodeURIComponent(params.id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update banner' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Gọi qua Kong gateway
        const res = await fetch(`${KONG_GATEWAY_URL}/banners/${encodeURIComponent(params.id)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        let data = {};
        let status = res.status;

        if (res.status === 204) {
            data = { success: true };
            status = 200;
        } else {
            try {
                const text = await res.text();
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }
        }

        return NextResponse.json(data, { status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete banner' },
            { status: 500 }
        );
    }
} 
