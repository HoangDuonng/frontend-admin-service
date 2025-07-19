"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { message } from 'antd';
import HotelForm from '@/components/hotel/HotelForm';
import { getHotelById, updateHotel, uploadHotelImages, uploadMultipleHotelImages } from '@/services/hotelService';
import type { Hotel, HotelFormState } from '@/types/hotel';
import Loader from '@/components/loader/page';

export default function HotelEditClient() {
    const router = useRouter();
    const params = useParams();
    const documentId = params?.id as string;
    const [initialValues, setInitialValues] = useState<HotelFormState | null>(null);
    const [originalData, setOriginalData] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!documentId) return;
        getHotelById(documentId)
            .then((data: Hotel) => {
                setOriginalData(data);
                const formData: HotelFormState = {
                    displayName: data.displayName || "",
                    region: data.region || "",
                    starRating: data.starRating || "",
                    userRating: data.userRating || "",
                    numReviews: data.numReviews || "",
                    userRatingInfo: data.userRatingInfo || "",
                    price: data.price || "",
                    hotelFeatures: Array.isArray(data.hotelFeatures) ? data.hotelFeatures.join(', ') : "",
                    slug: data.slug || "",
                    is_active: data.is_active || false,
                    latitude: data.latitude || "",
                    longitude: data.longitude || "",
                    satisfactionInfo: data.userRatingInfo || "",
                    description: data.description || "",
                };
                setInitialValues(formData);
            })
            .catch(() => message.error('Không thể tải thông tin khách sạn'));
    }, [documentId]);

    const handleSubmit = async (form: any, avatarFile: File | null, galleryFiles: File[]) => {
        const hide = message.loading('Đang lưu thay đổi...', 0);
        setLoading(true);
        try {
            // Always generate slug from displayName
            function toSlug(str: string) {
                return str
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[ -\u036f]/g, '')
                    .replace(/[^a-z0-9 ]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
            const slug = toSlug(form.displayName || '');

            let imageUrl = originalData?.imageUrl || "";
            let imageUrls = originalData?.imageUrls || [];
            if (avatarFile) {
                const avatarForm = new FormData();
                avatarForm.append('file', avatarFile);
                avatarForm.append('context', 'images');
                avatarForm.append('entityId', slug);
                avatarForm.append('type', 'thumb');
                avatarForm.append('position', 'hotel');
                const avatarRes = await uploadHotelImages(avatarForm);
                imageUrl = avatarRes.url || avatarRes.data?.url || avatarRes.data?.[0]?.url;
            }
            if (galleryFiles.length > 0) {
                const galleryForm = new FormData();
                galleryFiles.slice(0, 20).forEach(f => galleryForm.append('files', f));
                galleryForm.append('context', 'images');
                galleryForm.append('entityId', slug);
                galleryForm.append('type', 'gallery');
                galleryForm.append('position', 'hotel');
                const galleryRes = await uploadMultipleHotelImages(galleryForm);
                const newGalleryUrls = galleryRes.urls || galleryRes.data?.map((item: any) => item.url) || galleryRes.data || [];
                // Kết hợp ảnh cũ với ảnh mới (tối đa 20 ảnh)
                const remainingSlots = 20 - newGalleryUrls.length;
                const existingUrls = originalData?.imageUrls?.slice(0, remainingSlots) || [];
                imageUrls = [...existingUrls, ...newGalleryUrls];
            }
            const hotelData = {
                ...form,
                slug,
                imageUrl,
                imageUrls,
                hotelFeatures: form.hotelFeatures.split(',').map((f: string) => f.trim()).filter(Boolean),
                description: form.description || "",
            };
            await updateHotel(documentId, hotelData);
            hide();
            message.success('Cập nhật khách sạn thành công!');
            router.push('/cms/khach-san');
        } catch (err: any) {
            hide();
            message.error(err?.message || 'Có lỗi khi cập nhật khách sạn!');
        } finally {
            setLoading(false);
        }
    };

    if (!initialValues || !originalData) return <Loader />;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-extrabold mb-2 mt-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow">
                Cập nhật thông tin khách sạn
            </h1>
            <HotelForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={loading}
                isEdit={true}
                existingAvatarUrl={originalData.imageUrl}
                existingGalleryUrls={originalData.imageUrls}
            />
        </div>
    );
} 
