import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const res = await fetch(`${env.NEXT_PUBLIC_CMS_API_URL}/api/layouts/banners/all-raw`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error fetching all banners', data: [] }, { status: 500 });
    }
} 
