export const ROLES = {
  STAFF: "STAFF",
  MANAGER: "MANAGER",
  SYSTEM_ADMIN: "SYSTEM-ADMIN",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ALL_ROLES: Role[] = [ROLES.STAFF, ROLES.MANAGER, ROLES.SYSTEM_ADMIN]

export const APP_TYPES = {
  INTERNAL: "internal",
  EXTERNAL: "external",
} as const

export type AppType = (typeof APP_TYPES)[keyof typeof APP_TYPES]

export const APP_STATUSES = {
  ONLINE: "online",
  OFFLINE: "offline",
  MAINTENANCE: "maintenance",
} as const

export type AppStatus = (typeof APP_STATUSES)[keyof typeof APP_STATUSES]
