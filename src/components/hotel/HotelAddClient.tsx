"use client";

import HotelForm from '@/components/hotel/HotelForm';
import { addHotel, uploadHotelImages, uploadMultipleHotelImages } from '@/services/hotelService';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HotelFormState } from '@/types/hotel';

export default function HotelAddClient() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const initialValues: HotelFormState = {
        displayName: "",
        region: "",
        starRating: "",
        userRating: "",
        numReviews: "",
        userRatingInfo: "",
        price: "",
        hotelFeatures: "",
        slug: "",
        is_active: true,
        latitude: "",
        longitude: "",
        satisfactionInfo: "",
        description: "",
    };

    const handleSubmit = async (form: any, avatarFile: File | null, galleryFiles: File[]) => {
        // Validate từng trường bắt buộc
        const missingFields = [];
        if (!form.displayName) missingFields.push('Tên khách sạn');
        if (!form.region) missingFields.push('Địa chỉ');
        if (!form.price) missingFields.push('Giá');
        if (!avatarFile) missingFields.push('Ảnh đại diện');
        if (!galleryFiles || galleryFiles.length < 1) missingFields.push('Tối thiểu 1 ảnh chi tiết');
        if (galleryFiles && galleryFiles.length > 20) missingFields.push('Tối đa 20 ảnh chi tiết');
        if (missingFields.length > 0) {
            message.error(`Vui lòng nhập: ${missingFields.join(', ')}`);
            return;
        }
        const hide = message.loading('Đang lưu khách sạn...', 0);
        setLoading(true);
        try {
            function toSlug(str: string) {
                return str
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9 ]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
            const slug = toSlug(form.displayName || '');

            // Upload avatar (1 ảnh)
            const avatarForm = new FormData();
            avatarForm.append('file', avatarFile!);
            avatarForm.append('context', 'images-hotels');
            avatarForm.append('entityId', slug);
            avatarForm.append('type', 'thumb');
            avatarForm.append('position', 'hotel');
            const avatarRes = await uploadHotelImages(avatarForm);
            const avatarUrl = avatarRes.url || avatarRes.data?.url || avatarRes.data?.[0]?.url;
            if (!avatarUrl) throw new Error('Không lấy được url ảnh đại diện');

            // Upload gallery (nhiều ảnh, field files)
            const galleryForm = new FormData();
            galleryFiles.forEach(f => galleryForm.append('files', f));
            galleryForm.append('context', 'images-hotels');
            galleryForm.append('entityId', slug);
            galleryForm.append('type', 'gallery');
            galleryForm.append('position', 'hotel');
            const galleryRes = await uploadMultipleHotelImages(galleryForm);
            const galleryUrls = galleryRes.urls || galleryRes.data?.map((item: any) => item.url) || galleryRes.data || [];
            if (!galleryUrls.length) throw new Error('Không lấy được url ảnh chi tiết');

            // Chuẩn bị metadata
            const hotelData = {
                ...form,
                slug,
                region: form.region,
                userRatingInfo: form.userRatingInfo || form.satisfactionInfo || "Tốt",
                imageUrl: avatarUrl,
                imageUrls: galleryUrls,
                hotelFeatures: form.hotelFeatures.split(',').map((f: string) => f.trim()).filter(Boolean),
                description: form.description || "",
            };
            await addHotel(hotelData);
            hide();
            message.success('Thêm khách sạn thành công!');
            router.push('/khach-san');
        } catch (err: any) {
            hide();
            message.error(err?.message || 'Có lỗi khi thêm khách sạn!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-extrabold mb-2 mt-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow">
                Thêm khách sạn mới
            </h1>
            <HotelForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={loading}
                isEdit={false}
            />
        </div>
    );
} 
