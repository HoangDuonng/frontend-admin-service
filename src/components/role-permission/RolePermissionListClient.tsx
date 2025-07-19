'use client';

import React, { useState } from 'react';
import { message, Tooltip } from 'antd';
import Loader from '@/components/loader/page';
import { getRoles, getPermissions, updateRole, updatePermission, getRoleById, getPermissionById, deleteRole, deletePermission, createRole, createPermission } from '@/services/rolePermissionService';
import { Role, Permission } from '@/types/role-permission';
import Pagination from '@/components/pagination/Pagination';
import { PlusIcon } from 'lucide-react';
import { FaExclamationCircle } from 'react-icons/fa';

// Import modals
import CreateRoleModal from './modals/CreateRoleModal';
import CreatePermissionModal from './modals/CreatePermissionModal';
import EditRoleModal from './modals/EditRoleModal';
import EditPermissionModal from './modals/EditPermissionModal';
import ViewRoleModal from './modals/ViewRoleModal';
import ViewPermissionModal from './modals/ViewPermissionModal';

// Import utilities
import { validateRoleName, validatePermissionName, validateAction } from './utils/validation';
import { handleEditRole, handleDeleteRole, handleDeletePermission } from './utils/handlers';

const PAGE_SIZE = 10;

export default function RolePermissionListClient() {
    const [loadingRole, setLoadingRole] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [errorRole, setErrorRole] = useState('');
    const [rolePage, setRolePage] = useState(1);

    const [loadingPerm, setLoadingPerm] = useState(true);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [errorPerm, setErrorPerm] = useState('');
    const [permPage, setPermPage] = useState(1);

    const [viewRole, setViewRole] = useState<Role | null>(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [viewPermission, setViewPermission] = useState<Permission | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [editRole, setEditRole] = useState<Role | null>(null);
    const [showEditRoleModal, setShowEditRoleModal] = useState(false);
    const [editPermission, setEditPermission] = useState<Permission | null>(null);
    const [showEditPermissionModal, setShowEditPermissionModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);

    const [deletingRole, setDeletingRole] = useState<Role | null>(null);
    const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null);

    // Modal tạo mới
    const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
    const [showCreatePermissionModal, setShowCreatePermissionModal] = useState(false);
    const [creating, setCreating] = useState(false);

    // Validation real-time
    const [roleNameError, setRoleNameError] = useState('');
    const [permNameError, setPermNameError] = useState('');
    const [actionError, setActionError] = useState('');

    React.useEffect(() => {
        if (!showEditRoleModal) {
            setEditRole(null);
        }
    }, [showEditRoleModal]);

    React.useEffect(() => {
        if (!showEditPermissionModal) {
            setEditPermission(null);
        }
    }, [showEditPermissionModal]);

    React.useEffect(() => {
        if (!showCreateRoleModal) {
            setRoleNameError('');
        }
    }, [showCreateRoleModal]);

    React.useEffect(() => {
        if (!showCreatePermissionModal) {
            setPermNameError('');
            setActionError('');
        }
    }, [showCreatePermissionModal]);

    React.useEffect(() => {
        if (showEditRoleModal || showCreateRoleModal) {
            getPermissions().then(setAllPermissions);
        }
    }, [showEditRoleModal, showCreateRoleModal]);

    React.useEffect(() => {
        setLoadingRole(true);
        getRoles()
            .then(setRoles)
            .catch((err) => setErrorRole(err.message))
            .finally(() => setLoadingRole(false));
    }, []);

    React.useEffect(() => {
        setLoadingPerm(true);
        getPermissions()
            .then((perms) => {
                setPermissions(perms);
                setAllPermissions(perms);
            })
            .catch((err) => setErrorPerm(err.message))
            .finally(() => setLoadingPerm(false));
    }, []);

    const pagedRoles = roles.slice((rolePage - 1) * PAGE_SIZE, rolePage * PAGE_SIZE);
    const pagedPerms = permissions.slice((permPage - 1) * PAGE_SIZE, permPage * PAGE_SIZE);
    const totalRolePages = Math.ceil(roles.length / PAGE_SIZE);
    const totalPermPages = Math.ceil(permissions.length / PAGE_SIZE);

    const handleRoleNameChange = (name: string) => {
        setRoleNameError(validateRoleName(name, roles));
    };

    const handlePermNameChange = (name: string) => {
        setPermNameError(validatePermissionName(name, permissions));
    };

    const handleActionChange = (action: string) => {
        setActionError(validateAction(action));
    };

    const handleCreateRoleSuccess = () => {
        setShowCreateRoleModal(false);
        setLoadingRole(true);
        getRoles().then(setRoles).finally(() => setLoadingRole(false));
    };

    const handleCreatePermissionSuccess = () => {
        setShowCreatePermissionModal(false);
        setLoadingRole(true);
        setLoadingPerm(true);
        Promise.all([
            getRoles().then(setRoles),
            getPermissions().then(setPermissions)
        ]).finally(() => {
            setLoadingRole(false);
            setLoadingPerm(false);
        });
    };

    const handleEditRoleSuccess = () => {
        setShowEditRoleModal(false);
        setEditRole(null);
        setLoadingRole(true);
        getRoles().then(setRoles).finally(() => setLoadingRole(false));
    };

    const handleEditPermissionSuccess = () => {
        setShowEditPermissionModal(false);
        setEditPermission(null);
        setLoadingPerm(true);
        getPermissions().then(setPermissions).finally(() => setLoadingPerm(false));
    };

    const refreshRoleData = () => {
        setLoadingRole(true);
        getRoles().then(setRoles).finally(() => setLoadingRole(false));
    };

    const refreshPermData = () => {
        setLoadingPerm(true);
        getPermissions().then(setPermissions).finally(() => setLoadingPerm(false));
    };

    return (
        <div className="p-8 dark:bg-gray-900 min-h-[60vh]">
            <h1 className="text-3xl font-extrabold mt-6 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow mb-6">
                Danh sách Role & Permission
            </h1>

            {/* Bảng Role */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-700">Danh sách Vai trò (Role)</h2>
                    <button
                        onClick={() => setShowCreateRoleModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
                    >
                        <PlusIcon size={16} /> Thêm vai trò
                    </button>
                </div>
                {loadingRole ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader />
                    </div>
                ) : errorRole ? (
                    <div className="border rounded-xl bg-white shadow p-8 dark:bg-gray-800 text-center text-red-500 font-semibold">
                        {errorRole}
                    </div>
                ) : (
                    <div className="border rounded-xl bg-white shadow p-4 dark:bg-gray-800 overflow-x-auto">
                        <table className="w-full bg-white rounded shadow dark:bg-gray-800 dark:text-gray-300">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                    <th className="p-3 text-center">STT</th>
                                    <th className="p-3 text-center">Name</th>
                                    <th className="p-3 text-center">Display Name</th>
                                    <th className="p-3 text-center">Mô tả</th>
                                    <th className="p-3 text-center">Số quyền</th>
                                    <th className="p-3 text-center">Hệ thống</th>
                                    <th className="p-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800">
                                {pagedRoles.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-2 text-center text-gray-400">Không có dữ liệu</td>
                                    </tr>
                                ) : pagedRoles.map((role, idx) => (
                                    <tr key={role.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                                        <td className="px-4 py-2 text-center">{(rolePage - 1) * PAGE_SIZE + idx + 1}</td>
                                        <td className="px-4 py-2 font-semibold text-center">{role.name || role.displayName}</td>
                                        <td className="px-4 py-2 font-semibold text-center">{role.displayName}</td>
                                        <td className="px-4 py-2 text-center max-w-xs truncate" title={role.description || '-'}>{role.description || '-'}</td>
                                        <td className="px-4 py-2 text-center">{role.permissions?.length || 0}</td>
                                        <td className="px-4 py-2 text-center">{role.isSystem ? 'Có' : 'Không'}</td>
                                        <td className="px-4 py-2 text-center flex gap-2 justify-center items-center">
                                            <button
                                                className="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition"
                                                onClick={() => { setViewRole(role); setShowRoleModal(true); }}
                                            >
                                                Xem
                                            </button>
                                            <Tooltip
                                                title={role.isSystem && role.name !== 'admin' && role.displayName !== 'Admin'
                                                    ? `Bạn không thể sửa vai trò "${role.displayName}"`
                                                    : ""
                                                }
                                                styles={{ body: { backgroundColor: '#e0f2fe', color: '#0c4a6e', border: '1px solid #0284c7' } }}
                                            >
                                                <button
                                                    className={`px-3 py-1 rounded-full border font-semibold text-xs transition ${role.name === 'admin' || role.displayName === 'Admin'
                                                        ? 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
                                                        : role.isSystem
                                                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                            : 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                                        }`}
                                                    onClick={() => handleEditRole(role, setEditRole, setShowEditRoleModal)}
                                                    disabled={role.isSystem && role.name !== 'admin' && role.displayName !== 'Admin'}
                                                >
                                                    Sửa
                                                </button>
                                            </Tooltip>
                                            <Tooltip
                                                title={role.name === 'admin' || role.displayName === 'Admin' || role.isSystem
                                                    ? `Bạn không thể xóa vai trò "${role.displayName}"`
                                                    : ""
                                                }
                                                styles={{ body: { backgroundColor: '#e0f2fe', color: '#0c4a6e', border: '1px solid #0284c7' } }}
                                            >
                                                <button
                                                    className={`px-3 py-1 rounded-full border font-semibold text-xs transition ${role.name === 'admin' || role.displayName === 'Admin' || role.isSystem
                                                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                        : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                                        }`}
                                                    onClick={() => {
                                                        if (role.name === 'admin' || role.displayName === 'Admin' || role.isSystem) return;
                                                        handleDeleteRole(role, deleteRole, refreshRoleData);
                                                    }}
                                                    disabled={role.name === 'admin' || role.displayName === 'Admin' || role.isSystem}
                                                >
                                                    Xoá
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-4">
                            <Pagination
                                page={rolePage}
                                totalPages={totalRolePages}
                                onPageChange={setRolePage}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Bảng Permission */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-700">Danh sách Quyền (Permission)</h2>
                    <button
                        onClick={() => setShowCreatePermissionModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
                    >
                        <PlusIcon size={16} /> Thêm quyền
                    </button>
                </div>
                {loadingPerm ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader />
                    </div>
                ) : errorPerm ? (
                    <div className="border rounded-xl bg-white shadow p-8 dark:bg-gray-800 text-center text-red-500 font-semibold">
                        {errorPerm}
                    </div>
                ) : (
                    <div className="border rounded-xl bg-white shadow p-4 dark:bg-gray-800 overflow-x-auto">
                        <table className="w-full bg-white rounded shadow dark:bg-gray-800 dark:text-gray-300">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                    <th className="p-3 text-center">STT</th>
                                    <th className="p-3 text-center">Name</th>
                                    <th className="p-3 text-center">Display Name</th>
                                    <th className="p-3 text-center">Mô tả</th>
                                    <th className="p-3 text-center">Hành động</th>
                                    <th className="p-3 text-center">Module</th>
                                    <th className="p-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800">
                                {pagedPerms.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-2 text-center text-gray-400">Không có dữ liệu</td>
                                    </tr>
                                ) : pagedPerms.map((perm, idx) => (
                                    <tr key={perm.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                                        <td className="px-4 py-2 text-center">{(permPage - 1) * PAGE_SIZE + idx + 1}</td>
                                        <td className="px-4 py-2 font-semibold text-center">{perm.name || perm.displayName}</td>
                                        <td className="px-4 py-2 font-semibold text-center">{perm.displayName}</td>
                                        <td className="px-4 py-2 text-center max-w-xs truncate" title={perm.description || '-'}>{perm.description || '-'}</td>
                                        <td className="px-4 py-2 text-center">{perm.action}</td>
                                        <td className="px-4 py-2 text-center">{perm.module}</td>
                                        <td className="px-4 py-2 text-center flex gap-2 justify-center items-center">
                                            <button
                                                className="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition"
                                                onClick={() => { setViewPermission(perm); setShowPermissionModal(true); }}
                                            >
                                                Xem
                                            </button>
                                            <button
                                                className="px-3 py-1 rounded-full border border-yellow-200 bg-yellow-50 text-yellow-700 font-semibold text-xs hover:bg-yellow-100 transition"
                                                onClick={async () => {
                                                    const permDetail = await getPermissionById(String(perm.id));
                                                    setEditPermission(permDetail);
                                                    setShowEditPermissionModal(true);
                                                }}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 font-semibold text-xs hover:bg-red-100 transition"
                                                onClick={() => handleDeletePermission(perm, deletePermission, refreshPermData)}
                                            >
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-4">
                            <Pagination
                                page={permPage}
                                totalPages={totalPermPages}
                                onPageChange={setPermPage}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ViewRoleModal
                open={showRoleModal}
                onCancel={() => setShowRoleModal(false)}
                viewRole={viewRole}
            />

            <ViewPermissionModal
                open={showPermissionModal}
                onCancel={() => setShowPermissionModal(false)}
                viewPermission={viewPermission}
            />

            <EditRoleModal
                open={showEditRoleModal}
                onCancel={() => { setShowEditRoleModal(false); setEditRole(null); }}
                onSuccess={handleEditRoleSuccess}
                editRole={editRole}
                allPermissions={allPermissions}
                saving={saving}
            />

            <EditPermissionModal
                open={showEditPermissionModal}
                onCancel={() => { setShowEditPermissionModal(false); setEditPermission(null); }}
                onSuccess={handleEditPermissionSuccess}
                editPermission={editPermission}
                saving={saving}
            />

            <CreateRoleModal
                open={showCreateRoleModal}
                onCancel={() => setShowCreateRoleModal(false)}
                onSuccess={handleCreateRoleSuccess}
                allPermissions={allPermissions}
                roleNameError={roleNameError}
                onRoleNameChange={handleRoleNameChange}
                creating={creating}
            />

            <CreatePermissionModal
                open={showCreatePermissionModal}
                onCancel={() => setShowCreatePermissionModal(false)}
                onSuccess={handleCreatePermissionSuccess}
                permNameError={permNameError}
                actionError={actionError}
                onPermNameChange={handlePermNameChange}
                onActionChange={handleActionChange}
                creating={creating}
            />
        </div>
    );
} 
