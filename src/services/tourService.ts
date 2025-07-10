import { Tour } from '@/types/tour';

export async function getTours(): Promise<Tour[]> {
    const res = await fetch('/api/tours');
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

export async function uploadTour({
    file,
    title,
    description,
    tags,
    tourId,
    onProgress,
}: {
    file: File;
    title: string;
    description: string;
    tags: string;
    tourId: string;
    onProgress?: (percent: number) => void;
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('tour', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', tags);
        formData.append('tourId', tourId);

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
