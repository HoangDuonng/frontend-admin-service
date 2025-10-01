import { Role, Permission } from '@/types/role-permission';

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJjbGllbnQiXSwic3ViIjoidGVzdHVzZXIxNSIsImlhdCI6MTc1MjgyMzA5OSwiZXhwIjoxNzUyOTA5NDk5fQ.EdjkVexdMTFf59KgaOhktNl_lbwnCwgWyA3lavXlbmQ';

export async function getRoles(): Promise<Role[]> {
    const res = await fetch('/api/role-permission/list', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Không thể tải danh sách vai trò');
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
}

export async function getPermissions(): Promise<Permission[]> {
    const res = await fetch('/api/role-permission/permissions', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Không thể tải danh sách quyền');
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
}

export async function updateRole(id: string, data: Partial<Role>) {
    const res = await fetch(`/api/role-permission/list/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Không thể cập nhật vai trò');
        (error as any).status = res.status;
        throw error;
    }
    return await res.json();
}

export async function updatePermission(id: string, data: Partial<Permission>) {
    const res = await fetch(`/api/role-permission/permissions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Không thể cập nhật quyền');
        (error as any).status = res.status;
        throw error;
    }
    return await res.json();
}

export async function getRoleById(id: string): Promise<Role> {
    const res = await fetch(`/api/role-permission/list/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Không thể tải chi tiết vai trò');
    const data = await res.json();
    return data.data || data;
}

export async function getPermissionById(id: string): Promise<Permission> {
    const res = await fetch(`/api/role-permission/permissions/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Không thể tải chi tiết quyền');
    const data = await res.json();
    return data.data || data;
}

export async function deleteRole(id: string) {
    const res = await fetch(`/api/role-permission/list/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    // Nếu response thành công (2xx), coi như xoá thành công
    if (res.ok) {
        try {
            const data = await res.json();
            return data;
        } catch (e) {
            // Nếu không parse được JSON, trả về success object
            return { message: 'Role deleted successfully' };
        }
    } else {
        // Nếu có lỗi, parse error message
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Không thể xoá vai trò');
        (error as any).status = res.status;
        throw error;
    }
}

export async function deletePermission(id: string) {
    const res = await fetch(`/api/role-permission/permissions/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    // Nếu response thành công (2xx), coi như xoá thành công
    if (res.ok) {
        try {
            const data = await res.json();
            return data;
        } catch (e) {
            // Nếu không parse được JSON, trả về success object
            return { message: 'Permission deleted successfully' };
        }
    } else {
        // Nếu có lỗi, parse error message
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Không thể xoá quyền');
        (error as any).status = res.status;
        throw error;
    }
}

export async function createRole(data: Partial<Role>) {
    const res = await fetch('/api/role-permission/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Không thể tạo vai trò');
        (error as any).status = res.status;
        throw error;
    }
    return await res.json();
}

export async function createPermission(data: Partial<Permission>) {
    const res = await fetch('/api/role-permission/permissions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Không thể tạo quyền');
        (error as any).status = res.status;
        throw error;
    }
    return await res.json();
} 
