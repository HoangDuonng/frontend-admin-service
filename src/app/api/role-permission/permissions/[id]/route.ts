import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://kong:8000/v1/api';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('authorization');
    const body = await req.text();

    // Gọi qua Kong gateway
    const res = await fetch(`${KONG_GATEWAY_URL}/role-permission/permissions/${params.id}`, {
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
        // Gọi qua Kong gateway
        const res = await fetch(`${KONG_GATEWAY_URL}/role-permission/permissions/${params.id}`, {
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
        console.error('Error fetching permission by ID:', e);
        return NextResponse.json({ error: 'Internal server error', detail: String(e) }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('authorization');
    try {
        // Gọi qua Kong gateway
        const res = await fetch(`${KONG_GATEWAY_URL}/role-permission/permissions/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': token } : {}),
            },
        });

        // Kiểm tra nếu response thành công (2xx) nhưng có thể không có body
        if (res.ok) {
            // Thử parse JSON, nếu không được thì trả về success message
            try {
                const data = await res.json();
                return NextResponse.json(data, { status: res.status });
            } catch (e) {
                // Nếu không parse được JSON, trả về success message
                return NextResponse.json({ message: 'Permission deleted successfully' }, { status: 200 });
            }
        } else {
            // Nếu có lỗi, thử parse error message
            try {
                const data = await res.json();
                return NextResponse.json(data, { status: res.status });
            } catch (e) {
                return NextResponse.json({ message: 'Failed to delete permission' }, { status: res.status });
            }
        }
    } catch (e) {
        console.error('Error deleting permission:', e);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
