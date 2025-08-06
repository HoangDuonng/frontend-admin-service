export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
        fullName: string;
        avatar?: string;
        role?: string;
    };
}

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatar?: string;
    role?: string;
    roles?: string[];
    userRole?: string;
    roleName?: string;
    authorities?: string[];
} 
