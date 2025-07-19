import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

const AUTH_API_URL = env.NEXT_PUBLIC_AUTHORIZATION_API_URL;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('authorization');
    const body = await req.text();
    const res = await fetch(`${AUTH_API_URL}/api/roles/${params.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {}),
        },
        body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('authorization');
    try {
        const res = await fetch(`${AUTH_API_URL}/api/roles/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': token } : {}),
            },
        });
        const text = await res.text();
        if (!text) {
            console.error('Empty response from backend');
            return NextResponse.json({ error: 'Empty response from backend' }, { status: 500 });
        }
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Invalid JSON from backend:', text);
            return NextResponse.json({ error: 'Invalid JSON from backend', raw: text }, { status: 500 });
        }
        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error('Error fetching role by ID:', e);
        return NextResponse.json({ error: 'Internal server error', detail: String(e) }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('authorization');
    const res = await fetch(`${AUTH_API_URL}/api/roles/${params.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {}),
        },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
} 
