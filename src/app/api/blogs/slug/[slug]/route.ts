import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const baseUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8086';
    const url = `${baseUrl}/api/blogs/slug/${encodeURIComponent(params.slug)}`;
    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status, headers: { 'Cache-Control': 'no-store' } });
} 
