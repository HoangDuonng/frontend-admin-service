import { UserListResponse } from '@/types/user';
import { LoginRequest, LoginResponse } from '@/types/auth';
import { env } from '@/env.mjs';

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJjbGllbnQiXSwic3ViIjoidGVzdHVzZXIxNSIsImlhdCI6MTc1MjkyMTU0NywiZXhwIjoxNzUzMDA3OTQ3fQ.P7R7mij96mbQ6MYBuj4Epsj5ljuOe8-Qs9rOylvgp-I';

export async function login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }

        return data.data;
    } catch (error) {
        throw error;
    }
}

export async function getUsers(page = 1, pageSize = 10, filter = ''): Promise<UserListResponse> {
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (filter) params.append('filter', filter);
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer ? env.NEXT_PUBLIC_BASE_URL : '';
    const url = `${baseUrl}/api/user/list?${params.toString()}`;
    const res = await fetch(url, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
}

export async function getUserRole(userId: string | number): Promise<string[]> {
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const res = await fetch(`/api/roles/user/${userId}`, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Giả sử API trả về { roles: string[] } hoặc mảng trực tiếp
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.roles)) return data.roles;
    return [];
}

export async function getAllRoles(): Promise<{ displayName: string; value: string }[]> {

    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const res = await fetch('/api/roles', {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Giả sử API trả về mảng object có displayName, id hoặc name
    return Array.isArray(data)
        ? data.map((r: any) => ({ displayName: r.displayName || r.name || '', value: r.id?.toString() || r.name || '' }))
        : [];
}

export async function updateUser(id: string | number, data: any): Promise<any> {

    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    console.log('Sending request to update user:', {
        url: `/api/user/${id}`,
        method: 'PUT',
        data: data,
        roles: data.roles
    });

    const res = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(data),
    });


    if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error('Cập nhật người dùng thất bại');
    }

    const result = await res.json();
    return result;
}

export async function deleteUser(id: string | number): Promise<any> {

    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const res = await fetch(`/api/user/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });
    if (!res.ok) throw new Error('Xoá người dùng thất bại');
    return await res.json();
}


