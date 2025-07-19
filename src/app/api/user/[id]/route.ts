import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

const USER_API_URL = env.NEXT_PUBLIC_USER_API_URL;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('authorization');
    const body = await req.text();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = token;
    const res = await fetch(`${USER_API_URL}/api/users/${params.id}`, {
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
    const res = await fetch(`${USER_API_URL}/api/users/${params.id}`, {
        method: 'DELETE',
        headers,
    });
    const data = await res.text();
    let json;
    try { json = JSON.parse(data); } catch { json = { raw: data }; }
    return NextResponse.json(json, { status: res.status });
} 
