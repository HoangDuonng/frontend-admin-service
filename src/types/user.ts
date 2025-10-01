export interface User {
    id: string | number;
    username: string;
    email: string;
    fullName?: string;
    phone?: string;
    role?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    roles?: string[];
    isActivated?: boolean;
}

export interface UserListResponse {
    data: User[];
    total: number;
    page: number;
    pageSize: number;
    message?: string;
    success?: boolean;
} 
