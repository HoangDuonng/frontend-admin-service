import { Hotel } from '@/types/hotel';
import { env } from '@/env.mjs';

export async function getHotels(): Promise<Hotel[]> {
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer ? env.NEXT_PUBLIC_BASE_URL : '';
    const url = `${baseUrl}/api/hotel`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch hotels');
    const data = await res.json();

    const mappedData = (data.data || []).map((item: any) => ({
        _id: item._id,
        document_id: item.document_id,
        displayName: item.displayName || '',
        region: item.region || '',
        starRating: item.starRating || '',
        userRating: item.userRating || '',
        numReviews: item.numReviews || '',
        userRatingInfo: item.userRatingInfo || '',
        latitude: item.latitude || '',
        longitude: item.longitude || '',
        price: item.price || '',
        imageUrl: item.imageUrl || '',
        imageUrls: item.imageUrls || [],
        hotelFeatures: item.hotelFeatures || [],
        slug: item.slug || '',
        is_active: item.is_active || false,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        description: item.description || '',
    }));

    return mappedData;
}

export async function addHotel(hotelData: any) {
    const res = await fetch('/api/hotel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hotelData),
    });
    if (!res.ok) throw new Error('Failed to add hotel');
    return await res.json();
}

export async function uploadHotelImages(formData: FormData) {
    const fileApiUrl = '/api/files/upload';
    const res = await fetch(fileApiUrl, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload image');
    return await res.json();
}

export async function uploadMultipleHotelImages(formData: FormData) {
    const fileApiUrl = '/api/files/upload-multiple';
    const res = await fetch(fileApiUrl, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload images');
    return await res.json();
}

export async function getHotelById(id: string): Promise<Hotel> {
    const res = await fetch(`/api/hotel/${id}`);
    if (!res.ok) throw new Error('Failed to fetch hotel');
    const data = await res.json();

    // Map the response to match our Hotel type
    return {
        _id: data.data._id,
        document_id: data.data.document_id,
        displayName: data.data.displayName || '',
        region: data.data.region || '',
        starRating: data.data.starRating || '',
        userRating: data.data.userRating || '',
        numReviews: data.data.numReviews || '',
        userRatingInfo: data.data.userRatingInfo || '',
        latitude: data.data.latitude || '',
        longitude: data.data.longitude || '',
        price: data.data.price || '',
        imageUrl: data.data.imageUrl || '',
        imageUrls: data.data.imageUrls || [],
        hotelFeatures: data.data.hotelFeatures || [],
        slug: data.data.slug || '',
        is_active: data.data.is_active || false,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
        description: data.data.description || '',
    };
}

export async function updateHotel(id: string, data: any) {
    const res = await fetch(`/api/hotel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update hotel');
    return await res.json();
}

export async function deleteHotelImagesBulk(urls: string[]) {
    const res = await fetch('/api/files/delete-multi-files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
    });
    if (!res.ok) throw new Error('Xoá ảnh khách sạn thất bại');
    return await res.json();
} 
