"use client"

import React, { useEffect, useState } from "react";
import { fetchFooterLayout, updateFooterLayout } from "../../services/footerService";
import { FooterLayout } from "../../types/footer";
import { FaGripLines, FaPlus, FaMinus } from "react-icons/fa";
import { Tooltip, message } from "antd";

function slugify(str: string) {
    return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const FooterConfigClient = () => {
    const [footer, setFooter] = useState<FooterLayout | null>(null);
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState("");
    const [socials, setSocials] = useState<{ type: string; url: string }[]>([]);
    const [quickLinks, setQuickLinks] = useState<{ label: string; url: string }[]>([]);
    const [draggedSocialIdx, setDraggedSocialIdx] = useState<number | null>(null);
    const [draggedQuickLinkIdx, setDraggedQuickLinkIdx] = useState<number | null>(null);
    const [newsletter, setNewsletter] = useState({
        title: "",
        description: "",
        placeholder: "",
        buttonLabel: ""
    });
    const [copyright, setCopyright] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetchFooterLayout("vi").then((data) => {
            setFooter(data);
            setDescription(data?.description || "");
            setSocials(data?.socials || []);
            setQuickLinks(data?.quickLinks || []);
            setNewsletter(data?.newsletter || { title: "", description: "", placeholder: "", buttonLabel: "" });
            setCopyright(data?.copyright || "");
            setLoading(false);
        });
    }, []);

    // Handler cho socials
    const handleSocialChange = (idx: number, field: string, value: string) => {
        setSocials(prev => {
            const arr = [...prev];
            arr[idx] = { ...arr[idx], [field]: value };
            return arr;
        });
    };
    const handleAddSocial = (idx: number) => {
        const arr = [...socials];
        arr.splice(idx + 1, 0, { type: "", url: "" });
        setSocials(arr);
    };
    const handleRemoveSocial = (idx: number) => {
        if (socials.length === 1) return;
        setSocials(socials.filter((_, i) => i !== idx));
    };
    // Kéo thả socials
    const handleDragStartSocial = (idx: number) => setDraggedSocialIdx(idx);
    const handleDragOverSocial = (idx: number) => {
        if (draggedSocialIdx === null || draggedSocialIdx === idx) return;
        const arr = [...socials];
        const draggedItem = arr[draggedSocialIdx];
        arr.splice(draggedSocialIdx, 1);
        arr.splice(idx, 0, draggedItem);
        setSocials(arr);
        setDraggedSocialIdx(idx);
    };
    const handleDragEndSocial = () => setDraggedSocialIdx(null);

    // Handler cho quickLinks
    const handleQuickLinkChange = (idx: number, field: string, value: string) => {
        setQuickLinks(prev => {
            const arr = [...prev];
            if (field === "label") {
                const oldLabel = arr[idx].label;
                const autoSlugOld = "/" + slugify(oldLabel || "");
                if (arr[idx].url === autoSlugOld || !arr[idx].url) {
                    arr[idx] = {
                        ...arr[idx],
                        label: value,
                        url: "/" + slugify(value)
                    };
                } else {
                    arr[idx] = {
                        ...arr[idx],
                        label: value
                    };
                }
            } else {
                arr[idx] = {
                    ...arr[idx],
                    [field]: value
                };
            }
            return arr;
        });
    };
    const handleAddQuickLink = (idx: number) => {
        const arr = [...quickLinks];
        arr.splice(idx + 1, 0, { label: "", url: "" });
        setQuickLinks(arr);
    };
    const handleRemoveQuickLink = (idx: number) => {
        if (quickLinks.length === 1) return;
        setQuickLinks(quickLinks.filter((_, i) => i !== idx));
    };
    // Kéo thả quickLinks
    const handleDragStartQuickLink = (idx: number) => setDraggedQuickLinkIdx(idx);
    const handleDragOverQuickLink = (idx: number) => {
        if (draggedQuickLinkIdx === null || draggedQuickLinkIdx === idx) return;
        const arr = [...quickLinks];
        const draggedItem = arr[draggedQuickLinkIdx];
        arr.splice(draggedQuickLinkIdx, 1);
        arr.splice(idx, 0, draggedItem);
        setQuickLinks(arr);
        setDraggedQuickLinkIdx(idx);
    };
    const handleDragEndQuickLink = () => setDraggedQuickLinkIdx(null);

    // Handler lưu cấu hình
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };
    const handleConfirmSave = async () => {
        setShowConfirm(false);
        // Gọi API updateFooterLayout
        const payload = {
            logo: footer?.logo,
            description,
            socials,
            quickLinks,
            newsletter,
            copyright,
        };
        try {
            await updateFooterLayout("vi", payload);
            message.success("Cấu hình footer đã được lưu thành công");
        } catch (err) {
            message.error("Có lỗi xảy ra khi lưu cấu hình footer");
        }
    };

    return (
        <div className="border rounded-lg p-8 bg-white shadow-sm max-w-4xl mx-auto relative">
            {/* Mô tả */}
            <div className="mb-8">
                <label className="block font-semibold mb-2 text-lg text-blue-300">Mô tả</label>
                <textarea
                    className="border border-blue-300 rounded px-2 py-2 bg-blue-50 text-blue-700 w-full"
                    rows={3}
                    placeholder="Nhập mô tả footer..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>
            {/* Mạng xã hội */}
            <div className="mb-8">
                <label className="block font-semibold mb-2 text-lg text-blue-300">Mạng xã hội</label>
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-10 w-10" />
                    <div className="flex-1 flex flex-col justify-center">
                        <span className="text-xs text-blue-300 mb-1">Loại</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <span className="text-xs text-blue-300 mb-1">URL</span>
                    </div>
                    <div className="flex gap-1 w-20 justify-center">
                        <span className="text-xs text-blue-300 mb-1">Thao tác</span>
                    </div>
                </div>
                {socials.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                        <Tooltip title="Kéo để sắp xếp" placement="top" color="#93c5fd">
                            <div
                                className="h-10 w-10 flex items-center justify-center cursor-grab hover:text-blue-500 select-none"
                                style={{ userSelect: 'none' }}
                                draggable
                                onDragStart={() => handleDragStartSocial(idx)}
                                onDragOver={e => { e.preventDefault(); handleDragOverSocial(idx); }}
                                onDragEnd={handleDragEndSocial}
                            >
                                <FaGripLines className="w-4 h-4 text-blue-400" />
                            </div>
                        </Tooltip>
                        <div className="flex-1 flex flex-col justify-center">
                            <input
                                type="text"
                                className="border border-blue-300 rounded px-2 py-1 bg-blue-50 text-blue-700 h-10"
                                placeholder="Loại (facebook,...)"
                                value={item.type ?? ""}
                                onChange={e => handleSocialChange(idx, "type", e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <input
                                type="text"
                                className="border border-blue-300 rounded px-2 py-1 bg-blue-50 text-blue-700 h-10"
                                placeholder="URL"
                                value={item.url ?? ""}
                                onChange={e => handleSocialChange(idx, "url", e.target.value)}
                            />
                        </div>
                        <div className="flex gap-1 w-20 justify-center">
                            <Tooltip title="Thêm mạng xã hội" placement="top" color="#93c5fd">
                                <button
                                    className="rounded h-10 w-10 flex items-center justify-center bg-blue-100 hover:bg-blue-400 transition p-0 group"
                                    type="button"
                                    onClick={() => handleAddSocial(idx)}
                                >
                                    <FaPlus className="w-4 h-4 text-blue-400 group-hover:text-white" />
                                </button>
                            </Tooltip>
                            {socials.length > 1 && (
                                <Tooltip title="Xóa mạng xã hội" placement="top" color="#93c5fd">
                                    <button
                                        className="rounded h-10 w-10 flex items-center justify-center bg-red-100 hover:bg-red-400 transition p-0 group"
                                        type="button"
                                        onClick={() => handleRemoveSocial(idx)}
                                    >
                                        <FaMinus className="w-4 h-4 text-red-400 group-hover:text-white" />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* Liên kết nhanh */}
            <div className="mb-8">
                <label className="block font-semibold mb-2 text-lg text-blue-300">Liên kết nhanh</label>
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-10 w-10" />
                    <div className="flex-1 flex flex-col justify-center">
                        <span className="text-xs text-blue-300 mb-1">Tên liên kết</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <span className="text-xs text-blue-300 mb-1">URL</span>
                    </div>
                    <div className="flex gap-1 w-20 justify-center">
                        <span className="text-xs text-blue-300 mb-1">Thao tác</span>
                    </div>
                </div>
                {quickLinks.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                        <Tooltip title="Kéo để sắp xếp" placement="top" color="#93c5fd">
                            <div
                                className="h-10 w-10 flex items-center justify-center cursor-grab hover:text-blue-500 select-none"
                                style={{ userSelect: 'none' }}
                                draggable
                                onDragStart={() => handleDragStartQuickLink(idx)}
                                onDragOver={e => { e.preventDefault(); handleDragOverQuickLink(idx); }}
                                onDragEnd={handleDragEndQuickLink}
                            >
                                <FaGripLines className="w-4 h-4 text-blue-400" />
                            </div>
                        </Tooltip>
                        <div className="flex-1 flex flex-col justify-center">
                            <input
                                type="text"
                                className="border border-blue-300 rounded px-2 py-1 bg-blue-50 text-blue-700 h-10"
                                placeholder="Tên liên kết"
                                value={item.label ?? ""}
                                onChange={e => handleQuickLinkChange(idx, "label", e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <input
                                type="text"
                                className="border border-blue-300 rounded px-2 py-1 bg-blue-50 text-blue-700 h-10"
                                placeholder="URL"
                                value={item.url ?? ""}
                                onChange={e => handleQuickLinkChange(idx, "url", e.target.value)}
                            />
                        </div>
                        <div className="flex gap-1 w-20 justify-center">
                            <Tooltip title="Thêm liên kết" placement="top" color="#93c5fd">
                                <button
                                    className="rounded h-10 w-10 flex items-center justify-center bg-blue-100 hover:bg-blue-400 transition p-0 group"
                                    type="button"
                                    onClick={() => handleAddQuickLink(idx)}
                                >
                                    <FaPlus className="w-4 h-4 text-blue-400 group-hover:text-white" />
                                </button>
                            </Tooltip>
                            {quickLinks.length > 1 && (
                                <Tooltip title="Xóa liên kết" placement="top" color="#93c5fd">
                                    <button
                                        className="rounded h-10 w-10 flex items-center justify-center bg-red-100 hover:bg-red-400 transition p-0 group"
                                        type="button"
                                        onClick={() => handleRemoveQuickLink(idx)}
                                    >
                                        <FaMinus className="w-4 h-4 text-red-400 group-hover:text-white" />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* Đăng ký nhận tin */}
            <div className="mb-8">
                <label className="block font-semibold mb-2 text-lg text-blue-300">Đăng ký nhận tin</label>
                <input
                    className="border border-blue-300 rounded px-2 py-2 bg-blue-50 text-blue-700 w-full mb-2"
                    placeholder="Tiêu đề"
                    value={newsletter.title}
                    onChange={e => setNewsletter(n => ({ ...n, title: e.target.value }))}
                />
                <textarea
                    className="border border-blue-300 rounded px-2 py-2 bg-blue-50 text-blue-700 w-full mb-2"
                    rows={2}
                    placeholder="Mô tả"
                    value={newsletter.description}
                    onChange={e => setNewsletter(n => ({ ...n, description: e.target.value }))}
                />
                <input
                    className="border border-blue-300 rounded px-2 py-2 bg-blue-50 text-blue-700 w-full mb-2"
                    placeholder="Placeholder email"
                    value={newsletter.placeholder}
                    onChange={e => setNewsletter(n => ({ ...n, placeholder: e.target.value }))}
                />
                <input
                    className="border border-blue-300 rounded px-2 py-2 bg-blue-50 text-blue-700 w-full"
                    placeholder="Nhãn nút đăng ký"
                    value={newsletter.buttonLabel}
                    onChange={e => setNewsletter(n => ({ ...n, buttonLabel: e.target.value }))}
                />
            </div>
            {/* Copyright */}
            <div className="mb-8">
                <label className="block font-semibold mb-2 text-lg text-blue-300">Copyright</label>
                <input
                    className="border border-blue-300 rounded px-2 py-2 bg-blue-50 text-blue-700 w-full"
                    placeholder="© Hoang Duong. All rights reserved."
                    value={copyright}
                    onChange={e => setCopyright(e.target.value)}
                />
            </div>
            <button
                className="rounded px-4 py-2 w-full text-lg font-semibold bg-blue-800 hover:bg-blue-900 text-white"
                onClick={handleSave}
            >
                Lưu cấu hình
            </button>

            {/* Overlay xác nhận */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center border border-gray-300">
                        <div className="text-xl font-bold mb-4 text-blue-800">Xác nhận lưu cấu hình</div>
                        <div className="mb-6 text-blue-700">Bạn có chắc muốn lưu cấu hình footer?</div>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 rounded font-semibold bg-blue-800 hover:bg-blue-900 text-white"
                                onClick={handleConfirmSave}
                            >
                                Xác nhận
                            </button>
                            <button
                                className="px-4 py-2 rounded font-semibold border border-blue-300 text-blue-800 bg-blue-50 hover:bg-blue-100"
                                onClick={() => setShowConfirm(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FooterConfigClient; 
