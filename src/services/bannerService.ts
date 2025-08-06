import { Banner, CreateBannerRequest, UpdateBannerRequest, BannerResponse } from '@/types/banner';

export async function getBanners(): Promise<Banner[]> {
    try {
        const res = await fetch('/api/banners');
        if (!res.ok) throw new Error('Failed to fetch banners');
        const data: BannerResponse = await res.json();
        return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
}

export async function getBannerById(id: string): Promise<Banner | null> {
    try {
        const res = await fetch(`/api/banners/${id}`);
        if (!res.ok) throw new Error('Failed to fetch banner');
        const data: BannerResponse = await res.json();
        return data.data as Banner;
    } catch (error) {
        console.error('Error fetching banner:', error);
        return null;
    }
}

export async function createBanner(bannerData: CreateBannerRequest): Promise<Banner | null> {
    try {
        const res = await fetch('/api/banners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bannerData),
        });

        if (!res.ok) throw new Error('Failed to create banner');
        const data: BannerResponse = await res.json();
        return data.data as Banner;
    } catch (error) {
        console.error('Error creating banner:', error);
        return null;
    }
}

export async function updateBanner(bannerData: UpdateBannerRequest): Promise<Banner | null> {
    try {
        const res = await fetch(`/api/banners/${bannerData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bannerData),
        });

        if (!res.ok) throw new Error('Failed to update banner');
        const data: BannerResponse = await res.json();
        return data.data as Banner;
    } catch (error) {
        console.error('Error updating banner:', error);
        return null;
    }
}

export async function deleteBanner(id: string): Promise<boolean> {
    try {
        const res = await fetch(`/api/banners/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete banner');
        return true;
    } catch (error) {
        console.error('Error deleting banner:', error);
        return false;
    }
}

export async function uploadBannerImage(file: File): Promise<string | null> {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/files/banners', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload image');
        const data = await res.json();
        return data.url || null;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}

export async function uploadBannerFile(file: File, entityId: 'images' | 'videos', position: string = 'main'): Promise<string | null> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('context', 'banner');
        formData.append('entityId', entityId);
        formData.append('type', 'banner');
        formData.append('position', position);

        const res = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to upload file');
        const data = await res.json();
        if (data?.success && data?.data?.url) {
            // Chèn thêm 'content' vào url
            const url = data.data.url.replace('/api/files/', '/api/files/content/');
            return url;
        }
        return null;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}



export async function getAllRawBanners(): Promise<Banner[]> {
    try {
        const res = await fetch('/api/banners/all-raw');
        if (!res.ok) throw new Error('Failed to fetch all raw banners');
        const data: BannerResponse = await res.json();
        return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
        console.error('Error fetching all raw banners:', error);
        return [];
    }
} 
