import { Tour } from '@/types/tour';
import { env } from '@/env.mjs';

export async function getTours(): Promise<Tour[]> {
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer ? env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001' : '';
    const url = `${baseUrl}/api/tours`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch tours');
    const data = await res.json();
    return data.data || [];
}

export async function getTourDetail(tourId: string): Promise<Tour> {
    const res = await fetch(`/api/tours?tourId=${tourId}`);
    if (!res.ok) throw new Error('Failed to fetch tour detail');
    const data = await res.json();
    return data.data;
}

export async function updateTour(tourId: string, updateData: Partial<Tour>): Promise<Tour> {
    const res = await fetch(`/api/tours/${tourId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error('Failed to update tour');
    const data = await res.json();
    return data.data;
}

export async function uploadTour({
    file,
    title,
    description,
    tags,
    tourId,
    type,
    onProgress,
}: {
    file: File;
    title: string;
    description: string;
    tags: string;
    tourId: string;
    type?: 'main_banner' | 'explore_tour';
    onProgress?: (percent: number) => void;
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('tour', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', tags);
        formData.append('tourId', tourId);
        if (type) formData.append('type', type);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/tours', true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(new Error('Upload thất bại!'));
            }
        };

        xhr.onerror = () => {
            reject(new Error('Lỗi kết nối khi upload!'));
        };

        xhr.send(formData);
    });
}

export async function deleteTour(tourId: string): Promise<void> {
    const res = await fetch(`/api/tours/${tourId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete tour');
}
