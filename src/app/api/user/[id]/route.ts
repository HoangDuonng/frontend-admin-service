import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://localhost:8000';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('authorization');
    const body = await req.text();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = token;

    // Gọi qua Kong gateway
    const res = await fetch(`${KONG_GATEWAY_URL}/user/${params.id}`, {
        method: 'PUT',
        headers,
        body,
    });
    const data = await res.text();
    let json;
    try { json = JSON.parse(data); } catch { json = { raw: data }; }
    return NextResponse.json(json, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('authorization');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = token;

    // Gọi qua Kong gateway
    const res = await fetch(`${KONG_GATEWAY_URL}/user/${params.id}`, {
        method: 'DELETE',
        headers,
    });
    const data = await res.text();
    let json;
    try { json = JSON.parse(data); } catch { json = { raw: data }; }
    return NextResponse.json(json, { status: res.status });
} 
