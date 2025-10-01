import { NextRequest, NextResponse } from 'next/server';

// Sử dụng Kong gateway thay vì gọi trực tiếp backend
const KONG_GATEWAY_URL = process.env.NEXT_PUBLIC_KONG_GATEWAY_URL || 'http://localhost:8000';

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
    const slugPath = params.slug.join('/');
    // Gọi qua Kong gateway
    const url = `${KONG_GATEWAY_URL}/files/${slugPath}`;
    const res = await fetch(url, { method: 'GET' });
    const contentType = res.headers.get('content-type');
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
        status: res.status,
        headers: { 'content-type': contentType || '' },
    });
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string[] } }) {
    const slugPath = params.slug.join('/');
    // Gọi qua Kong gateway
    const url = `${KONG_GATEWAY_URL}/files/${slugPath}`;
    const res = await fetch(url, { method: 'DELETE' });
    const contentType = res.headers.get('content-type');
    const data = contentType?.includes('application/json') ? await res.json() : await res.text();
    return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
    const slugPath = params.slug.join('/');
    // Gọi qua Kong gateway
    const url = `${KONG_GATEWAY_URL}/files/${slugPath}`;
    const headers = new Headers(req.headers);
    headers.delete('host');
    const res = await fetch(url, {
        method: 'POST',
        headers,
        body: req.body,
        duplex: 'half',
    } as any);
    const contentType = res.headers.get('content-type');
    const data = contentType?.includes('application/json') ? await res.json() : await res.text();
    return new NextResponse(
        contentType?.includes('application/json') ? JSON.stringify(data) : data,
        {
            status: res.status,
            headers: { 'content-type': contentType || '' },
        }
    );
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string[] } }) {
    const slugPath = params.slug.join('/');
    // Gọi qua Kong gateway
    const url = `${KONG_GATEWAY_URL}/files/${slugPath}`;
    const headers = new Headers(req.headers);
    headers.delete('host');
    const res = await fetch(url, {
        method: 'PUT',
        headers,
        body: req.body,
        duplex: 'half',
    } as any);
    const contentType = res.headers.get('content-type');
    const data = contentType?.includes('application/json') ? await res.json() : await res.text();
    return new NextResponse(
        contentType?.includes('application/json') ? JSON.stringify(data) : data,
        {
            status: res.status,
            headers: { 'content-type': contentType || '' },
        }
    );
}
