export interface Permission {
    id: string | number;
    name?: string;
    displayName: string;
    description?: string;
    action: string;
    module: string;
}

export interface Role {
    id: string | number;
    displayName: string;
    description?: string;
    permissions: Permission[];
    name?: string;
    isSystem?: boolean;
    permissionIds?: (string | number)[];
} 
