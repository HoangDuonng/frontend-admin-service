'use client';

import { useEffect, useState } from "react";
import { getTours, updateTour, deleteTour } from "@/services/tourService";
import Link from "next/link";
import type { Tour } from "@/types/tour";
import Loader from "@/components/loader/page";
import Pagination from "@/components/pagination/Pagination";
import { message } from 'antd';

export default function TourListClient() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(tours.length / pageSize);
    const pagedTours = tours.slice((page - 1) * pageSize, page * pageSize);
    const [editingTour, setEditingTour] = useState<Tour | null>(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', status: 'active', type: 'explore_tour' as 'explore_tour' | 'main_banner' });
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingTour, setDeletingTour] = useState<Tour | null>(null);

    useEffect(() => {
        getTours().then(data => {
            setTours(data);
            setLoading(false);
        });
    }, []);

    const allChecked = selected.length === tours.length && tours.length > 0;
    const isIndeterminate = selected.length > 0 && selected.length < tours.length;

    const handleCheckAll = () => {
        if (allChecked) setSelected([]);
        else setSelected(tours.map((t) => t.tourId));
    };
    const handleCheck = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    async function reloadToursWithRetry(retries = 5, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                setLoading(true);
                const data = await getTours();
                setTours(data);
                setLoading(false);
                return;
            } catch (err) {
                if (i === retries - 1) throw err;
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold mt-6 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow">
                    Danh sách Tour
                </h1>
                <Link href="/tour/manager">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow">
                        + Thêm tour mới
                    </button>
                </Link>
            </div>
            <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-gray-700 max-w-full">
                <table className="min-w-max w-full text-sm rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase text-xs font-bold">
                            <th className="p-3 text-center w-10">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                                    onChange={handleCheckAll}
                                    className="accent-blue-500 w-4 h-4 cursor-pointer"
                                />
                            </th>
                            <th className="p-3 text-center">Tour ID</th>
                            <th className="p-3 text-center">Tên tour</th>
                            <th className="p-3 text-center">Mô tả</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Nơi hiển thị</th>
                            <th className="p-3 text-center">Ngày tạo</th>
                            <th className="p-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center p-4"><Loader /></td></tr>
                        ) : tours.length === 0 ? (
                            <tr><td colSpan={7} className="text-center p-4">Chưa có tour nào</td></tr>
                        ) : (
                            pagedTours.map((tour) => (
                                <tr
                                    key={tour.tourId}
                                    className="border-b last:border-none hover:bg-blue-50 dark:hover:bg-gray-600 transition group"
                                >
                                    <td className="p-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(tour.tourId)}
                                            onChange={() => handleCheck(tour.tourId)}
                                            className="accent-blue-500 w-4 h-4 cursor-pointer"
                                        />
                                    </td>
                                    <td className="p-3 font-mono text-center">{tour.tourId}</td>
                                    <td className="p-3 font-medium text-center">{tour.title}</td>
                                    <td className="p-3 max-w-[300px] truncate text-center">{tour.description}</td>
                                    <td className="p-3 text-center">
                                        {tour.status === 'active' ? (
                                            <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">Active</span>
                                        ) : (
                                            <span className="inline-block px-2 py-1 text-xs rounded bg-gray-200 text-gray-500">Inactive</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-center">
                                        {tour.type === 'main_banner' ? (
                                            <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">Main Banner</span>
                                        ) : (
                                            <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">Explore Tour</span>
                                        )}
                                    </td>
                                    <td className="p-3 font-mono text-center">
                                        {tour.createdAt ? new Date(tour.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            className="px-2 py-1 mr-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors text-xs font-semibold"
                                            onClick={() => {
                                                setEditingTour(tour);
                                                setEditForm({
                                                    title: tour.title,
                                                    description: tour.description,
                                                    status: tour.status || 'active',
                                                    type: tour.type || 'explore_tour',
                                                });
                                            }}
                                        >
                                            Sửa
                                        </button>
                                        <button className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-semibold"
                                            onClick={() => {
                                                setDeletingTour(tour);
                                                setShowDeleteConfirm(true);
                                            }}
                                        >
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-4">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            {/* Modal sửa tour */}
            {editingTour && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl border-2 border-blue-500">
                        <h2 className="text-2xl font-bold mb-6 text-blue-700">Sửa thông tin Tour</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-blue-700">Tour ID</label>
                                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={editingTour.tourId} disabled readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-blue-700">Tên tour</label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={editForm.title}
                                    onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-blue-700">Mô tả</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    value={editForm.description}
                                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-blue-700">Status</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={editForm.status}
                                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-blue-700">Nơi hiển thị</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={editForm.type}
                                    onChange={e => setEditForm(f => ({ ...f, type: e.target.value as 'explore_tour' | 'main_banner' }))}
                                >
                                    <option value="explore_tour">Explore Tour</option>
                                    <option value="main_banner">Main Banner</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-8">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                onClick={() => setEditingTour(null)}
                            >
                                Huỷ
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={async () => {
                                    if (editingTour) {
                                        const hide = message.loading('Đang lưu thay đổi...', 0);
                                        try {
                                            await updateTour(editingTour.tourId, editForm);
                                            message.success('Cập nhật tour thành công!');
                                            setLoading(true);
                                            getTours().then(data => {
                                                setTours(data);
                                                setLoading(false);
                                            });
                                        } catch (err) {
                                            message.error('Có lỗi khi cập nhật tour!');
                                        } finally {
                                            hide();
                                            setShowConfirm(false);
                                            setEditingTour(null);
                                        }
                                    } else {
                                        setShowConfirm(false);
                                        setEditingTour(null);
                                    }
                                }}
                            >
                                Cập nhật tour 360°
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xác nhận xoá */}
            {showDeleteConfirm && deletingTour && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm border-2 border-red-500 text-center">
                        <h3 className="text-xl font-bold mb-4 text-red-700">Xác nhận xoá tour?</h3>
                        <p className="mb-4 text-red-600 font-semibold">
                            Hành động này <span className="underline">không thể hoàn tác</span>!<br />
                            Toàn bộ dữ liệu và source 360° sẽ bị xoá vĩnh viễn.
                        </p>
                        <p className="mb-6">
                            Bạn có chắc muốn xoá tour
                            <span className="font-semibold text-blue-700"> [{deletingTour.tourId}] {deletingTour.title ? `- ${deletingTour.title}` : ''}</span>?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeletingTour(null);
                                }}
                            >
                                Huỷ
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                onClick={async () => {
                                    if (deletingTour) {
                                        const hide = message.loading('Đang xoá tour...', 0);
                                        try {
                                            await deleteTour(deletingTour.tourId);
                                            message.success('Đã xoá tour thành công!');
                                            reloadToursWithRetry();
                                        } catch (err) {
                                            message.error('Có lỗi khi xoá tour!');
                                        } finally {
                                            hide();
                                            setShowDeleteConfirm(false);
                                            setDeletingTour(null);
                                        }
                                    }
                                }}
                            >
                                Xác nhận xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 
