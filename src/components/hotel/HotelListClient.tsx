"use client";

import { useEffect, useState } from "react";
import { message, Modal } from "antd";
import Link from "next/link";
import Pagination from "@/components/pagination/Pagination";
import Loader from "@/components/loader/page";
import Image from "next/image";
import { getHotels, deleteHotelImagesBulk } from '@/services/hotelService';
import type { Hotel } from '@/types/hotel';
import { useRouter } from "next/navigation";

// Mock API delete functions (replace with your real API calls)
async function deleteHotelMeta(id: string) {
    const res = await fetch(`/api/hotel/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Xoá metadata thất bại');
    return await res.json();
}

export default function HotelListClient() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<string[]>([]);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean, hotel: Hotel | null }>({ open: false, hotel: null });
    const pageSize = 5;
    const router = useRouter();

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = () => {
        setLoading(true);
        getHotels()
            .then(data => setHotels(data))
            .catch(() => message.error('Không thể tải danh sách khách sạn'))
            .finally(() => setLoading(false));
    };

    const handleDelete = (hotel: Hotel) => {
        setDeleteModal({ open: true, hotel });
    };
    const confirmDelete = async () => {
        if (!deleteModal.hotel) return;
        const { document_id } = deleteModal.hotel;
        setLoading(true);
        try {
            await deleteHotelMeta(document_id);
            message.success('Đã xoá khách sạn thành công!');
            setDeleteModal({ open: false, hotel: null });
            fetchHotels();
        } catch (err: any) {
            message.error(err?.message || 'Có lỗi khi xoá khách sạn!');
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(hotels.length / pageSize);
    const pagedHotels = hotels.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const allChecked = selected.length === pagedHotels.length && pagedHotels.length > 0;
    const isIndeterminate = selected.length > 0 && selected.length < pagedHotels.length;
    const handleCheckAll = () => {
        if (allChecked) setSelected([]);
        else setSelected(pagedHotels.map(h => h.document_id));
    };
    const handleCheck = (document_id: string) => {
        setSelected(prev => prev.includes(document_id) ? prev.filter(x => x !== document_id) : [...prev, document_id]);
    };

    return (
        <div className="p-8">
            <Modal
                open={deleteModal.open}
                onCancel={() => setDeleteModal({ open: false, hotel: null })}
                onOk={confirmDelete}
                okText="Xác nhận xoá"
                cancelText="Huỷ"
                okButtonProps={{ danger: true, style: { background: '#fee2e2', color: '#b91c1c', border: 'none' } }}
                cancelButtonProps={{ style: { background: '#f3f4f6' } }}
                title={<span className="text-red-600 font-bold">Xác nhận xoá khách sạn</span>}
            >
                <div className="text-red-500 font-semibold">Bạn có chắc chắn muốn xoá khách sạn này?</div>
                <div className="mt-2 text-blue-700">Tên: <b>{deleteModal.hotel?.displayName}</b></div>
            </Modal>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold mt-6 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow">
                    Danh sách Khách sạn
                </h1>
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow"
                        onClick={() => router.push("/khach-san/manager")}
                    >
                        + Thêm khách sạn mới
                    </button>
                </div>
            </div>

            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr className="bg-gray-100 text-gray-700">
                        <th className="p-3 text-center">
                            <input
                                type="checkbox"
                                checked={allChecked}
                                ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                                onChange={handleCheckAll}
                                className="accent-blue-500 w-4 h-4 cursor-pointer"
                            />
                        </th>
                        <th className="p-3 text-center">Tên khách sạn</th>
                        <th className="p-3 text-center">Ảnh</th>
                        {/* <th className="p-3 text-center">Địa chỉ</th> */}
                        <th className="p-3 text-center">Sao</th>
                        <th className="p-3 text-center">Đánh giá</th>
                        <th className="p-3 text-center">Giá</th>
                        {/* <th className="p-3 text-center">Tiện ích</th> */}
                        <th className="p-3 text-center">Mô tả</th>
                        <th className="p-3 text-center">Trạng thái</th>
                        <th className="p-3 text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {pagedHotels.map(hotel => (
                        <tr key={hotel.document_id} className="border-b last:border-none">
                            <td className="p-3 text-center">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(hotel.document_id)}
                                    onChange={() => handleCheck(hotel.document_id)}
                                    className="accent-blue-500 w-4 h-4 cursor-pointer"
                                />
                            </td>
                            <td className="p-3 font-semibold text-center">
                                <span title={hotel.displayName} style={{ display: 'inline-block', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                    {hotel.displayName}
                                </span>
                            </td>
                            <td className="p-1 font-mono text-center">
                                <div className="relative w-32 h-24 mx-auto">
                                    <Image
                                        src={hotel.imageUrl}
                                        alt={hotel.displayName}
                                        width={160}
                                        height={112}
                                        className="rounded-lg object-cover w-32 h-24"
                                        priority={pagedHotels.indexOf(hotel) === 0} // Priority for first image (LCP)
                                        loading={pagedHotels.indexOf(hotel) === 0 ? undefined : "lazy"} // Lazy load others
                                        onError={(e) => {
                                            // Fallback khi ảnh lỗi
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/default.webp';
                                        }}
                                    />
                                </div>
                            </td>
                            {/* <td className="p-3 text-center">
                                <span title={hotel.region} style={{ display: 'inline-block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                    {hotel.region}
                                </span>
                            </td> */}
                            <td className="p-3 text-center">{hotel.starRating}</td>
                            <td className="p-3 text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="font-bold text-blue-700">{hotel.userRating}</span>
                                    <span className="text-xs text-gray-500">{hotel.userRatingInfo}</span>
                                    <span className="text-xs text-gray-400">({hotel.numReviews} đánh giá)</span>
                                </div>
                            </td>
                            <td className="p-3 text-center font-semibold text-green-700">{hotel.price ? Number(hotel.price).toLocaleString('vi-VN') + ' ₫' : ''}</td>
                            {/* <td className="p-3 text-center">
                                <ul className="list-disc list-inside text-xs text-left inline-block">
                                    {hotel.hotelFeatures && hotel.hotelFeatures.map((f, idx) => (
                                        <li key={idx}>{f}</li>
                                    ))}
                                </ul>
                            </td> */}
                            <td className="p-3 text-center">
                                <span title={hotel.description} style={{ display: 'inline-block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                    {hotel.description}
                                </span>
                            </td>
                            <td className="p-3 text-center">
                                {hotel.is_active ? (
                                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Active</span>
                                ) : (
                                    <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-500">Inactive</span>
                                )}
                            </td>
                            <td className="p-3 text-center">
                                <button className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded mr-2" onClick={() => router.push(`/khach-san/edit/${hotel.document_id}`)}>Sửa</button>
                                <button className="px-2 py-1 bg-red-100 text-red-700 rounded" onClick={() => handleDelete(hotel)}>Xoá</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end mt-4">
                <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
} 
