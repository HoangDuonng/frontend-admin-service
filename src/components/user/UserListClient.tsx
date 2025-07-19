'use client';

import React, { useEffect, useState } from 'react';
import { getUsers, getUserRole, updateUser, deleteUser } from '@/services/userService';
import { User } from '@/types/user';
import { message } from 'antd';
import Pagination from '@/components/pagination/Pagination';
import { PlusIcon, CircleAlert } from 'lucide-react';
import Link from 'next/link';
import { Modal, Tooltip } from 'antd';
import UserFormClient from '@/components/user/UserFormClient';
import Loader from '@/components/loader/page';

const PAGE_SIZE = 10;

function formatDate(dateStr?: string) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const UserListClient = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState<(string | number)[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [viewUser, setViewUser] = useState<User | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError('');
        getUsers(page, PAGE_SIZE, filter)
            .then(async (res) => {
                let users = Array.isArray(res.data) ? res.data : [];
                const usersWithRoles = await Promise.all(users.map(async (user) => {
                    try {
                        const roles = await getUserRole(user.id);
                        return { ...user, roles };
                    } catch {
                        return { ...user, roles: [] };
                    }
                }));
                setUsers(usersWithRoles);
                setTotal(res.total || 0);
                if (res.message) {
                    if (res.success) {
                        message.success('Lấy dữ liệu người dùng thành công');
                    } else {
                        message.error('Lấy dữ liệu người dùng thất bại');
                    }
                }
                setSelected([]);
                setSelectAll(false);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [page, filter]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    const handleSelectAll = () => {
        if (allChecked) {
            setSelected(selected.filter(id => !pagedUsers.some(u => u.id === id)));
        } else {
            setSelected([...selected, ...pagedUsers.map(u => u.id).filter(id => !selected.includes(id))]);
        }
    };

    const handleSelect = (id: string | number) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const pagedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const allChecked = pagedUsers.length > 0 && pagedUsers.every(u => selected.includes(u.id));
    const isIndeterminate = selected.some(id => pagedUsers.some(u => u.id === id)) && !allChecked;

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        const hide = message.loading('Đang xoá người dùng...', 0);
        try {
            await deleteUser(userToDelete.id);
            hide();
            message.success('Xoá người dùng thành công!');
            setShowConfirm(false);
            setUserToDelete(null);
            setLoading(true);
            getUsers(page, PAGE_SIZE, filter)
                .then(async (res) => {
                    let users = Array.isArray(res.data) ? res.data : [];
                    const usersWithRoles = await Promise.all(users.map(async (user) => {
                        try {
                            const roles = await getUserRole(user.id);
                            return { ...user, roles };
                        } catch {
                            return { ...user, roles: [] };
                        }
                    }));
                    setUsers(usersWithRoles);
                    setTotal(res.total || 0);
                    setSelected([]);
                    setSelectAll(false);
                })
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        } catch (err: any) {
            hide();
            message.error(err?.message || 'Xoá người dùng thất bại!');
        }
    };

    return (
        <>
            <div className="p-8 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-extrabold mt-6 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow">
                        Danh sách Người dùng
                    </h1>
                    <Link href="/user/create" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" /> Thêm người dùng
                    </Link>
                </div>
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tên, email..."
                        className="border rounded px-2 py-1"
                        value={filter}
                        onChange={e => { setPage(1); setFilter(e.target.value); }}
                    />
                </div>
                <div className="border rounded-xl bg-white shadow overflow-x-auto dark:bg-gray-800">
                    {loading ? (
                        <div className="p-4 flex justify-center items-center">
                            <Loader />
                        </div>
                    ) : error ? (
                        <div className="p-4 text-red-500">{error}</div>
                    ) : (
                        <table className="w-full bg-white rounded shadow dark:bg-gray-800 dark:text-gray-300">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                    <th className="p-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={allChecked}
                                            ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                                            onChange={handleSelectAll}
                                            className="accent-blue-500 w-4 h-4 cursor-pointer"
                                        />
                                    </th>
                                    <th className="p-3 text-center">STT</th>
                                    <th className="p-3 text-center">Tên đăng nhập</th>
                                    <th className="p-3 text-center">Email</th>
                                    <th className="p-3 text-center">Họ tên</th>
                                    <th className="p-3 text-center">Số điện thoại</th>
                                    <th className="p-3 text-center">Vai trò</th>
                                    <th className="p-3 text-center">Trạng thái</th>
                                    <th className="p-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!Array.isArray(pagedUsers) || pagedUsers.length === 0) ? (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-2 text-center">Không có dữ liệu</td>
                                    </tr>
                                ) : pagedUsers.map((user, idx) => {
                                    let roleDisplay = '...';
                                    let hasAdministratorRole = false;
                                    let administratorRoleName = '';

                                    if (Array.isArray(user.roles)) {
                                        if (user.roles.length > 0 && typeof user.roles[0] === 'object' && user.roles[0] !== null) {
                                            roleDisplay = user.roles
                                                .map(r => (typeof r === 'object' && r !== null ? ((r as any).displayName || (r as any).name || '') : ''))
                                                .filter(Boolean)
                                                .join(', ');

                                            // Kiểm tra có role Administrator không
                                            hasAdministratorRole = user.roles.some((r: any) =>
                                                (typeof r === 'object' && r !== null && r.displayName && r.displayName.toLowerCase().includes('administrator')) ||
                                                (typeof r === 'object' && r !== null && r.name && r.name.toLowerCase().includes('administrator'))
                                            );

                                            if (hasAdministratorRole) {
                                                const adminRole = user.roles.find((r: any) =>
                                                    (typeof r === 'object' && r !== null && r.displayName && r.displayName.toLowerCase().includes('administrator')) ||
                                                    (typeof r === 'object' && r !== null && r.name && r.name.toLowerCase().includes('administrator'))
                                                );
                                                administratorRoleName = (adminRole as any)?.displayName || (adminRole as any)?.name || 'Administrator';
                                            }
                                        } else if (user.roles.length > 0 && typeof user.roles[0] === 'string') {
                                            roleDisplay = user.roles.join(', ');
                                            hasAdministratorRole = user.roles.some((r: string) =>
                                                r.toLowerCase().includes('administrator')
                                            );
                                            if (hasAdministratorRole) {
                                                administratorRoleName = user.roles.find((r: string) =>
                                                    r.toLowerCase().includes('administrator')
                                                ) || 'Administrator';
                                            }
                                        }
                                    }
                                    return (
                                        <tr key={user.id} className="border-b last:border-none hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                                            <td className="p-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(user.id)}
                                                    onChange={() => handleSelect(user.id)}
                                                    className="accent-blue-500 w-4 h-4 cursor-pointer"
                                                />
                                            </td>
                                            <td className="p-3 text-center">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                                            <td className="p-3 font-semibold text-center">
                                                <span title={user.username} style={{ display: 'inline-block', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                                    {user.username}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">{user.email}</td>
                                            <td className="p-3 text-center">{user.fullName || '-'}</td>
                                            <td className="p-3 text-center">{user.phone || '-'}</td>
                                            <td className="p-3 text-center">
                                                {roleDisplay === '...'
                                                    ? roleDisplay
                                                    : roleDisplay.split(', ').map((role, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-block bg-blue-50 text-blue-700 rounded px-2 py-1 text-xs font-semibold mr-1 mb-1 border border-blue-100"
                                                        >
                                                            {role}
                                                        </span>
                                                    ))}
                                            </td>
                                            <td className="p-3 text-center">
                                                {user.isActivated ? (
                                                    <span className="inline-block bg-green-100 text-green-700 rounded px-2 py-1 text-xs font-semibold border border-green-200">Đã kích hoạt</span>
                                                ) : (
                                                    <span className="inline-block bg-gray-200 text-gray-500 rounded px-2 py-1 text-xs font-semibold border border-gray-300">Chưa kích hoạt</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex gap-2 items-center justify-center h-full">
                                                    <button
                                                        className="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition"
                                                        onClick={() => {
                                                            setViewUser(user);
                                                            setShowViewModal(true);
                                                        }}
                                                    >
                                                        Xem
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 rounded-full border border-yellow-200 bg-yellow-50 text-yellow-700 font-semibold text-xs hover:bg-yellow-100 transition"
                                                        onClick={() => {
                                                            if (hasAdministratorRole) {
                                                                Modal.confirm({
                                                                    title: <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Cảnh báo</span>,
                                                                    content: <div style={{ fontSize: '16px', lineHeight: '1.5' }}>Bạn đang sửa người dùng có vai trò <span className="font-bold text-blue-500">{administratorRoleName}</span>. <br /> Hãy thật <span style={{ color: 'red', fontWeight: 'bold' }}>cẩn thận</span> khi thay đổi thông tin của người dùng này.</div>,
                                                                    okText: 'Tiếp tục',
                                                                    cancelText: 'Hủy',
                                                                    width: 500,
                                                                    onOk: () => {
                                                                        setEditUser(user);
                                                                        setShowEditModal(true);
                                                                    },
                                                                    onCancel: () => {
                                                                        // User cancelled
                                                                    }
                                                                });
                                                            } else {
                                                                setEditUser(user);
                                                                setShowEditModal(true);
                                                            }
                                                        }}
                                                    >
                                                        Sửa
                                                    </button>
                                                    {hasAdministratorRole ? (
                                                        <Tooltip
                                                            title={`Bạn không thể xóa người dùng có vai trò: ${administratorRoleName}`}
                                                            placement="top"
                                                            overlayInnerStyle={{
                                                                backgroundColor: '#e0f2fe',
                                                                color: '#0c4a6e',
                                                                border: '1px solid #0284c7',
                                                                fontSize: '14px',
                                                                padding: '8px 12px',
                                                                borderRadius: '6px'
                                                            }}
                                                        >
                                                            <button
                                                                className="px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-400 font-semibold text-xs cursor-not-allowed opacity-50"
                                                                disabled
                                                            >
                                                                Xóa
                                                            </button>
                                                        </Tooltip>
                                                    ) : (
                                                        <button
                                                            className="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 font-semibold text-xs hover:bg-red-100 transition"
                                                            onClick={() => {
                                                                setUserToDelete(user);
                                                                setShowConfirm(true);
                                                            }}
                                                        >
                                                            Xóa
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            </div>
            <Modal
                open={showViewModal}
                onCancel={() => setShowViewModal(false)}
                footer={null}
                title={<span className="text-blue-700 font-bold text-2xl">Thông tin người dùng</span>}
                width={1000}
                styles={{ body: { fontSize: '1.5rem', padding: 36 } }}
                destroyOnHidden
            >
                {viewUser && (
                    <div className="space-y-6" style={{ fontSize: '1.5rem' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="font-semibold">Tên đăng nhập:</div>
                                <div>{viewUser.username}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Email:</div>
                                <div>{viewUser.email}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Họ tên:</div>
                                <div>{viewUser.fullName || '-'}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Số điện thoại:</div>
                                <div>{viewUser.phone || '-'}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Trạng thái:</div>
                                <div>{viewUser.isActivated ? (
                                    <span className="inline-block bg-green-100 text-green-700 rounded px-3 py-2 text-base font-semibold border border-green-200">Đã kích hoạt</span>
                                ) : (
                                    <span className="inline-block bg-gray-200 text-gray-500 rounded px-3 py-2 text-base font-semibold border border-gray-300">Chưa kích hoạt</span>
                                )}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Ngày tạo:</div>
                                <div>{formatDate((viewUser as any).createdAt)}</div>
                            </div>
                            <div>
                                <div className="font-semibold">Cập nhật lần cuối:</div>
                                <div>{formatDate((viewUser as any).updatedAt)}</div>
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold mb-2">Vai trò & quyền:</div>
                            {Array.isArray(viewUser.roles) && viewUser.roles.length > 0 ? (
                                viewUser.roles.map((role: any, idx: number) => (
                                    <div key={idx} className="mb-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="inline-block bg-blue-50 text-blue-700 rounded px-3 py-2 text-base font-semibold border border-blue-100">{role.displayName || role.name}</span>
                                            <span className="text-base text-gray-500">{role.description}</span>
                                        </div>
                                        {Array.isArray(role.permissions) && role.permissions.length > 0 && (
                                            <table className="w-full text-base border mt-2">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="p-3 border">Tên quyền</th>
                                                        <th className="p-3 border">Mô tả</th>
                                                        <th className="p-3 border">Hành động</th>
                                                        <th className="p-3 border">Module</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {role.permissions.map((perm: any, pidx: number) => (
                                                        <tr key={pidx}>
                                                            <td className="p-3 border">{perm.displayName}</td>
                                                            <td className="p-3 border">{perm.description}</td>
                                                            <td className="p-3 border">{perm.action}</td>
                                                            <td className="p-3 border">{perm.module}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-base">Không có vai trò</div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
            <Modal
                open={showEditModal}
                onCancel={() => setShowEditModal(false)}
                footer={null}
                width={900}
                styles={{ body: { fontSize: '1.5rem', padding: 36 } }}
                destroyOnHidden
            >
                {editUser && (
                    <UserFormClient
                        mode="edit"
                        initialData={editUser}
                        onSubmit={async (data) => {
                            try {
                                console.log('Data being sent to update user:', data);
                                console.log('Roles being sent:', data.roles);
                                await updateUser(editUser.id, data);
                                message.success('Cập nhật người dùng thành công!');
                                setShowEditModal(false);
                                // Reload lại danh sách user
                                setLoading(true);
                                getUsers(page, PAGE_SIZE, filter)
                                    .then(async (res) => {
                                        let users = Array.isArray(res.data) ? res.data : [];
                                        const usersWithRoles = await Promise.all(users.map(async (user) => {
                                            try {
                                                const roles = await getUserRole(user.id);
                                                return { ...user, roles };
                                            } catch {
                                                return { ...user, roles: [] };
                                            }
                                        }));
                                        setUsers(usersWithRoles);
                                        setTotal(res.total || 0);
                                        setSelected([]);
                                        setSelectAll(false);
                                    })
                                    .catch((err) => setError(err.message))
                                    .finally(() => setLoading(false));
                            } catch (err: any) {
                                message.error(err?.message || 'Cập nhật người dùng thất bại!');
                            }
                        }}
                    />
                )}
            </Modal>
            <Modal
                open={showConfirm}
                onCancel={() => { setShowConfirm(false); setUserToDelete(null); }}
                footer={null}
                title={<span className="text-red-700 font-bold text-lg flex items-center gap-2"><CircleAlert className="text-xl" /> Xác nhận xoá người dùng</span>}
                width={400}
                styles={{ body: { padding: 32 } }}
                destroyOnHidden
            >
                <div className="flex flex-col items-center text-center">
                    <div className="text-red-600 font-semibold mb-2 text-lg">Bạn có chắc chắn muốn xoá người dùng này?</div>
                    <div className="mb-4 text-gray-700 text-base">
                        {userToDelete?.fullName || userToDelete?.username} <span className="text-gray-400">- [ID - {userToDelete?.id}]</span>
                    </div>
                    <div className="flex justify-center gap-2 mt-6">
                        <button
                            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
                            onClick={() => { setShowConfirm(false); setUserToDelete(null); }}
                        >
                            Huỷ
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                            onClick={handleDeleteUser}
                        >
                            Xác nhận xoá
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default UserListClient; 
