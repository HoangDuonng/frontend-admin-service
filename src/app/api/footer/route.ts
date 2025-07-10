import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8086';

export async function GET(req: NextRequest) {
    const search = req.nextUrl.search;
    const res = await fetch(`${BACKEND_URL}/api/footer${search}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
    const search = req.nextUrl.search;
    const body = await req.text();
    const res = await fetch(`${BACKEND_URL}/api/footer${search}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
