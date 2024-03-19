export interface CreateAccessGroup {
    accessGroupId: string
    displayName: string
    description?: string
}

export interface UpdateAccessGroup {
    displayName: string
    description?: string
}

