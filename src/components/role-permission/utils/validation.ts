export const validateRoleName = (name: string, existingRoles: any[]) => {
    if (!name) {
        return '';
    }
    const existingRole = existingRoles.find(role => role.name === name);
    if (existingRole) {
        return 'Tên vai trò này đã tồn tại';
    }
    return '';
};

export const validatePermissionName = (name: string, existingPermissions: any[]) => {
    if (!name) {
        return '';
    }
    const existingPermission = existingPermissions.find(perm => perm.name === name);
    if (existingPermission) {
        return 'Tên quyền này đã tồn tại';
    }
    return '';
};

export const validateAction = (action: string) => {
    if (!action) return '';
    const actionRegex = /^[a-z0-9_]+$/;
    if (!actionRegex.test(action)) {
        return 'Action chỉ được chứa chữ thường, số và dấu gạch dưới';
    }
    return '';
};

export const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}; 
