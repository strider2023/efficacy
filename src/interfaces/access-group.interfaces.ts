export interface CreateRole {
    roleId: string
    displayName: string
    description?: string
    adminAccess?: boolean
    portalAccess?: boolean
    appAccess?: boolean
}

export interface UpdateRole {
    displayName?: string
    description?: string
    adminAccess?: boolean
    portalAccess?: boolean
    appAccess?: boolean
}

