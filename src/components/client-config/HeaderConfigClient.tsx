"use client";

import React, { useState, useEffect } from "react";
import { fetchHeaderLayout, updateHeaderLayout } from "../../services/headerService";
import { HeaderLayout } from "../../types/header";
import { FaGripLines, FaPlus, FaMinus, FaUpload } from "react-icons/fa";
import { Tooltip, message } from "antd";
import { getFileUrl } from "../../services/fileService";


const defaultConfig = {
    logoUrl: "",
    menu: [{ label: "", url: "" }],
};

function slugify(str: string) {
    return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const HeaderConfigClient = () => {
    const [config, setConfig] = useState(defaultConfig);
    const [logoPreview, setLogoPreview] = useState<string>("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
    const [logoMeta, setLogoMeta] = useState<any>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    useEffect(() => {
        fetchHeaderLayout("vi").then((data) => {
            if (data) {
                setLogoMeta(data.logo);
                setLogoPreview(data.logo.src);
                setConfig({
                    logoUrl: data.logo.src,
                    menu: data.navigation.map(item => ({
                        label: item.title,
                        url: item.href
                    }))
                });
            }
            setLoading(false);
        });
    }, []);

    // Xử lý upload file logo
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setLogoPreview(ev.target?.result as string);
                setConfig({ ...config, logoUrl: "" });
            };
            reader.readAsDataURL(file);
        }
    };

    // Xử lý nhập URL logo
    const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({ ...config, logoUrl: e.target.value });
        setLogoPreview(e.target.value);
    };

    const handleDragStart = (idx: number) => {
        setDraggedIdx(idx);
    };

    const handleDragOver = (idx: number) => {
        if (draggedIdx === null || draggedIdx === idx) return;
        const newMenu = [...config.menu];
        const draggedItem = newMenu[draggedIdx];
        newMenu.splice(draggedIdx, 1);
        newMenu.splice(idx, 0, draggedItem);
        setConfig({ ...config, menu: newMenu });
        setDraggedIdx(idx);
    };

    const handleDragEnd = () => {
        setDraggedIdx(null);
    };

    const handleMenuChange = (idx: number, field: string, value: string) => {
        setConfig(prev => {
            const newMenu = [...prev.menu];
            if (field === "label") {
                const oldLabel = newMenu[idx].label;
                const autoSlugOld = "/" + slugify(oldLabel || "");
                if (newMenu[idx].url === autoSlugOld || !newMenu[idx].url) {
                    newMenu[idx] = {
                        ...newMenu[idx],
                        label: value,
                        url: "/" + slugify(value)
                    };
                } else {
                    newMenu[idx] = {
                        ...newMenu[idx],
                        label: value
                    };
                }
            } else {
                newMenu[idx] = {
                    ...newMenu[idx],
                    [field]: value
                };
            }
            return { ...prev, menu: newMenu };
        });
    };

    const handleAddMenu = (idx: number) => {
        const newMenu = [...config.menu];
        newMenu.splice(idx + 1, 0, { label: "", url: "" });
        setConfig({ ...config, menu: newMenu });
    };

    const handleRemoveMenu = (idx: number) => {
        if (config.menu.length === 1) return;
        const newMenu = config.menu.filter((_, i) => i !== idx);
        setConfig({ ...config, menu: newMenu });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmSave = async () => {
        setShowConfirm(false);
        const hide = message.loading({
            content: "Đang lưu cấu hình...",
            duration: 0,
            style: { top: 80 },
        });

        try {
            let logoMeta = { src: config.logoUrl };
            if (logoFile) {
                // 1. Upload file mới
                const formData = new FormData();
                formData.append("file", logoFile);
                formData.append("context", "images");
                formData.append("entityId", "layout-client");
                formData.append("type", "logo");
                formData.append("position", "main");
                const res = await fetch("/api/files/upload", {
                    method: "POST",
                    body: formData,
                });
                const result = await res.json();
                logoMeta = result.data; 

                // 2. Gửi metadata sang CMS-service để update logo
                await fetch("/api/header/logo", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ logo: logoMeta }),
                });

            }
            // 3. Gọi API cập nhật header
            const payload = {
                logo: logoMeta,
                navigation: config.menu.map(item => ({
                    title: item.label,
                    href: item.url
                }))
            };
            await updateHeaderLayout("vi", payload);
            if (logoFile) {
                setLogoMeta(logoMeta);
                setLogoFile(null);
            }
            hide();
            message.success({
                content: "Đã lưu cấu hình thành công!",
                style: { top: 80 },
            });
        } catch (err) {
            hide();
            message.error({
                content: "Có lỗi khi lưu cấu hình!",
                style: { top: 80 },
            });
        }
    };

    const logoUrl = logoPreview && logoPreview.length > 0
        ? logoPreview
        : logoMeta?.url || "";

    return (
        <div className="border rounded-lg p-8 bg-white shadow-sm max-w-4xl mx-auto relative">
            {/* Logo */}
            <div className="mb-8">
                <label className="block font-semibold mb-2 text-lg text-blue-300">
                    Logo
                </label>
                <div className="grid grid-cols-2 gap-4 mb-1">
                    <span className="text-xs text-blue-300 mb-1 text-center">Tải lên hình ảnh</span>
                    <span className="text-xs text-blue-300 mb-1 text-center">Nhập URL ảnh</span>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center">
                    {/* Nút upload hình chữ nhật */}
                    <label className="flex items-center justify-center border border-blue-300 rounded px-2 py-2 bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition w-full h-12">
                        <FaUpload className="text-blue-400 w-6 h-6 mr-2" />
                        <span className="text-blue-400 font-medium">Chọn ảnh</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                        />
                    </label>
                    {/* Input URL */}
                    <input
                        type="text"
                        className="border border-blue-300 rounded px-2 py-2 bg-blue-50 text-blue-700 w-full h-12"
                        placeholder="URL logo"
                        value={config.logoUrl ?? ""}
                        onChange={handleLogoUrlChange}
                    />
                </div>
                {/* Preview logo to hơn */}
                <div className="mt-4 flex flex-col items-center">
                    <span className="text-blue-300 font-medium mb-1">Preview</span>
                    <div
                        className="rounded-lg border shadow bg-white flex items-center justify-center"
                        style={{
                            borderColor: "#93c5fd",
                            borderWidth: 2,
                            width: 180,
                            height: 180,
                            background: "#fff",
                        }}
                    >
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Logo preview"
                                className="h-36 w-auto object-contain"
                                style={{ maxHeight: 150, maxWidth: 160 }}
                            />
                        ) : (
                            <span className="text-blue-200 text-sm">Chưa có logo</span>
                        )}
                    </div>
                </div>
            </div>
            {/* Menu */}
            <div className="mb-6">
                <label className="block font-semibold mb-2 text-lg text-blue-300">
                    Menu
                </label>
                {/* Header cho các cột */}
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-10 w-10" />
                    <div className="flex-1 flex flex-col justify-center">
                        <span className="text-xs text-blue-300 mb-1">Tên menu</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <span className="text-xs text-blue-300 mb-1">Đường dẫn</span>
                    </div>
                    <div className="flex gap-1 w-20 justify-center">
                        <span className="text-xs text-blue-300 mb-1">Thao tác</span>
                    </div>
                </div>
                {config.menu.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-2 mb-2"
                    >
                        {/* Icon kéo thả */}
                        <Tooltip title="Kéo để sắp xếp" placement="top" color="#93c5fd">
                            <div
                                className="h-10 w-10 flex items-center justify-center cursor-grab hover:text-blue-500 select-none"
                                style={{ userSelect: 'none' }}
                                draggable
                                onDragStart={() => handleDragStart(idx)}
                                onDragOver={e => { e.preventDefault(); handleDragOver(idx); }}
                                onDragEnd={handleDragEnd}
                            >
                                <FaGripLines className="w-4 h-4 text-blue-400" />
                            </div>
                        </Tooltip>
                        <div className="flex-1 flex flex-col justify-center">
                            <input
                                type="text"
                                className="border border-blue-300 rounded px-2 py-1 bg-blue-50 text-blue-700 h-10"
                                placeholder="Tên menu"
                                value={item.label ?? ""}
                                onChange={e => handleMenuChange(idx, "label", e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <input
                                type="text"
                                className="border border-blue-300 rounded px-2 py-1 bg-blue-50 text-blue-700 h-10"
                                placeholder="Đường dẫn"
                                value={item.url ?? ""}
                                onChange={e => handleMenuChange(idx, "url", e.target.value)}
                            />
                        </div>
                        <div className="flex gap-1 w-20 justify-center">
                            <Tooltip title="Thêm menu" placement="top" color="#93c5fd">
                                <button
                                    className="rounded h-10 w-10 flex items-center justify-center bg-blue-100 hover:bg-blue-400 transition p-0 group"
                                    type="button"
                                    onClick={() => handleAddMenu(idx)}
                                >
                                    <FaPlus className="w-4 h-4 text-blue-400 group-hover:text-white" />
                                </button>
                            </Tooltip>
                            {config.menu.length > 1 && (
                                <Tooltip title="Xóa menu" placement="top" color="#93c5fd">
                                    <button
                                        className="rounded h-10 w-10 flex items-center justify-center bg-red-100 hover:bg-red-400 transition p-0 group"
                                        type="button"
                                        onClick={() => handleRemoveMenu(idx)}
                                    >
                                        <FaMinus className="w-4 h-4 text-red-400 group-hover:text-white" />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* Lưu cấu hình */}
            <button
                className="rounded px-4 py-2 w-full text-lg font-semibold bg-blue-300 hover:bg-blue-400 text-white"
                onClick={handleSave}
            >
                Lưu cấu hình
            </button>

            {/* Overlay xác nhận */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center border border-blue-300">
                        <div className="text-xl font-bold mb-4 text-blue-400">Xác nhận lưu cấu hình</div>
                        <div className="mb-6 text-gray-700">Bạn có chắc muốn lưu cấu hình header?</div>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 rounded font-semibold bg-blue-300 hover:bg-blue-400 text-white"
                                onClick={handleConfirmSave}
                            >
                                Xác nhận
                            </button>
                            <button
                                className="px-4 py-2 rounded font-semibold border border-blue-300 text-blue-400 bg-blue-50 hover:bg-blue-100"
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

export default HeaderConfigClient; 
