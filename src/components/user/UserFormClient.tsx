'use client';

import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import Loader from '@/components/loader/page';
import { getAllRoles } from '@/services/userService';
import { UploadCloud } from 'lucide-react';

interface UserFormClientProps {
    mode: 'add' | 'edit';
    initialData?: any;
    onSubmit: (data: any) => Promise<void> | void;
}

const defaultState = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    fullName: '',
    gender: '',
    avatar: '',
    cover: '',
    dob: '',
    phone: '',
    address: '',
    isActivated: true,
    roles: [] as string[],
};

export default function UserFormClient({ mode, initialData, onSubmit }: UserFormClientProps) {
    const [form, setForm] = useState<typeof defaultState>(defaultState);
    const [loading, setLoading] = useState(false);
    const [rolesOptions, setRolesOptions] = useState<{ displayName: string; value: string }[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [coverPreview, setCoverPreview] = useState<string>('');

    // Kiểm tra xem người dùng có role Administrator không
    const hasAdministratorRole = React.useMemo(() => {
        if (!initialData || !initialData.roles) return false;
        return initialData.roles.some((r: any) =>
            (typeof r === 'object' && r !== null && r.displayName && r.displayName.toLowerCase().includes('administrator')) ||
            (typeof r === 'object' && r !== null && r.name && r.name.toLowerCase().includes('administrator')) ||
            (typeof r === 'string' && r.toLowerCase().includes('administrator'))
        );
    }, [initialData]);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setForm({
                ...defaultState,
                ...Object.fromEntries(Object.entries(initialData).map(([k, v]) => [k, v ?? ''])),
                roles: Array.isArray(initialData.roles)
                    ? initialData.roles.map((r: any) => typeof r === 'string' ? r : r.id?.toString() || r.name || '')
                    : [],
            });
            setAvatarPreview(initialData.avatar || '');
            setCoverPreview(initialData.cover || '');
        }
    }, [mode, initialData]);

    useEffect(() => {
        getAllRoles().then((roles) => {
            setRolesOptions(roles);
            setRolesLoading(false);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleRoleCheckbox = (role: string) => {
        setForm(prev => {
            const roles = prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role];
            return { ...prev, roles };
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAvatarFile(file);
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setForm(prev => ({ ...prev, avatar: '' }));
        } else {
            setAvatarPreview('');
        }
    };
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCoverFile(file);
        if (file) {
            setCoverPreview(URL.createObjectURL(file));
            setForm(prev => ({ ...prev, cover: '' }));
        } else {
            setCoverPreview('');
        }
    };

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.username.trim()) {
            message.error('Tên đăng nhập là bắt buộc!');
            return;
        }
        if (!form.email.trim()) {
            message.error('Email là bắt buộc!');
            return;
        }
        if (!validateEmail(form.email)) {
            message.error('Email không đúng định dạng!');
            return;
        }
        if (!form.roles.length) {
            message.error('Bạn phải chọn ít nhất một vai trò!');
            return;
        }
        if (form.phone && !validatePhone(form.phone)) {
            message.error('Số điện thoại phải là 10 chữ số!');
            return;
        }
        setLoading(true);
        const hide = message.loading(mode === 'add' ? 'Đang lưu...' : 'Đang cập nhật...', 0);
        try {
            await onSubmit(form);
            hide();
            message.success(mode === 'add' ? 'Tạo người dùng thành công!' : 'Cập nhật người dùng thành công!');
        } catch (err: any) {
            hide();
            message.error(err?.message || 'Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-8 mt-12">
            <h1 className="text-3xl font-extrabold mt-6 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow">
                {mode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* Avatar + Cover upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-1">Avatar</label>
                        <button
                            type="button"
                            onClick={() => mode === 'add' && document.getElementById('avatar-upload')?.click()}
                            className={`flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded shadow border border-blue-200 mb-2 ${mode === 'edit' ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
                            disabled={mode === 'edit'}
                        >
                            <UploadCloud className="w-5 h-5" /> Tải ảnh lên
                        </button>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                            disabled={mode === 'edit'}
                        />
                        <div className="w-32 h-32 border rounded flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
                            {avatarPreview || form.avatar ? (
                                <img src={avatarPreview || form.avatar} alt="avatar preview" className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-gray-400 text-xs">Chưa có ảnh</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Ảnh cover</label>
                        <button
                            type="button"
                            onClick={() => mode === 'add' && document.getElementById('cover-upload')?.click()}
                            className={`flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded shadow border border-blue-200 mb-2 ${mode === 'edit' ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
                            disabled={mode === 'edit'}
                        >
                            <UploadCloud className="w-5 h-5" /> Tải ảnh lên
                        </button>
                        <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            className="hidden"
                            disabled={mode === 'edit'}
                        />
                        <div className="w-full h-32 border rounded flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
                            {coverPreview || form.cover ? (
                                <img src={coverPreview || form.cover} alt="cover preview" className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-gray-400 text-xs">Chưa có ảnh</span>
                            )}
                        </div>
                    </div>
                </div>
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block font-semibold mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                        <input name="username" value={form.username || ''} onChange={handleChange} className={`w-full border rounded px-3 py-2 ${mode === 'edit' ? 'opacity-60 cursor-not-allowed' : ''}`} readOnly={mode === 'edit'} disabled={mode === 'edit'} />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Họ</label>
                        <input name="first_name" value={form.first_name || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Tên</label>
                        <input name="last_name" value={form.last_name || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Email <span className="text-red-500">*</span></label>
                        <input name="email" value={form.email || ''} onChange={handleChange} className={`w-full border rounded px-3 py-2 ${mode === 'edit' ? 'opacity-60 cursor-not-allowed' : ''}`} type="email" readOnly={mode === 'edit'} disabled={mode === 'edit'} />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Họ tên đầy đủ</label>
                        <input name="fullName" value={form.fullName || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Số điện thoại</label>
                        <input name="phone" value={form.phone || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Giới tính</label>
                        <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-3 py-2">
                            <option value="">Chọn</option>
                            <option value="1">Nam</option>
                            <option value="2">Nữ</option>
                            <option value="3">Khác</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Ngày sinh</label>
                        <input name="dob" value={form.dob || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" type="date" />
                    </div>
                </div>
                <div>
                    <label className="block font-semibold mb-1">Địa chỉ</label>
                    <input name="address" value={form.address || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                {/* Vai trò + Trạng thái cùng hàng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <label className="block font-semibold mb-1">Vai trò <span className="text-red-500">*</span></label>
                        {rolesLoading ? (
                            <div className="text-blue-500 text-sm">Đang tải vai trò...</div>
                        ) : rolesOptions.length === 0 ? (
                            <div className="bg-red-100 text-red-700 border border-red-300 rounded px-3 py-2 text-sm font-semibold">
                                Không thể tải danh sách vai trò, vui lòng thử lại sau.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 mt-2">
                                {rolesOptions.map(opt => {
                                    // Kiểm tra xem role này có phải Administrator không
                                    const isAdministratorRole = opt.displayName.toLowerCase().includes('administrator') || opt.value.toLowerCase().includes('administrator');
                                    // Làm mờ checkbox Administrator nếu đang edit và user có role Administrator
                                    const shouldDisableAdminRole = mode === 'edit' && hasAdministratorRole && isAdministratorRole;

                                    return (
                                        <label key={opt.value} className={`flex items-center gap-2 ${shouldDisableAdminRole ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                            <input
                                                type="checkbox"
                                                checked={form.roles.includes(opt.value)}
                                                onChange={() => handleRoleCheckbox(opt.value)}
                                                className="accent-blue-500 w-5 h-5"
                                                disabled={mode === 'edit' && initialData && initialData.roles && initialData.roles.some((r: any) => r.isSystem) || shouldDisableAdminRole}
                                            />
                                            <span className={`text-sm font-medium ${shouldDisableAdminRole ? 'text-gray-400' : ''}`}>
                                                {opt.displayName}
                                                {shouldDisableAdminRole && <span className="text-xs text-gray-500 ml-1">(Không thể thay đổi)</span>}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 mt-6 md:mt-0">
                        <label className="block font-semibold mb-1">Trạng thái</label>
                        <div className={`flex items-center gap-2 ${mode === 'edit' && hasAdministratorRole ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input
                                name="isActivated"
                                type="checkbox"
                                checked={form.isActivated}
                                onChange={handleChange}
                                className="w-5 h-5 align-middle"
                                disabled={mode === 'edit' && hasAdministratorRole}
                            />
                            <span className={`text-sm ${mode === 'edit' && hasAdministratorRole ? 'text-gray-400' : ''}`}>
                                {form.isActivated ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                                {mode === 'edit' && hasAdministratorRole && <span className="text-xs text-gray-500 ml-1">(Không thể thay đổi)</span>}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Nút submit */}
                <div className="flex justify-end gap-2">
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold flex items-center gap-2">
                        {mode === 'add' ? 'Tạo mới' : 'Cập nhật'}
                    </button>
                </div>
            </form>
        </div>
    );
} 
