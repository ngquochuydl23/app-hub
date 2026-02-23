import api from "@/lib/axios";
import type { MenuItem, MenuGroup } from "@/components/menu-grid";
import type { Role, AppType, AppStatus } from "@/constants/roles";

// ── Types matching BE response ──
interface ApiApp {
  _id: string;
  title: string;
  description?: string;
  url: string;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  accentColor?: string;
  status: AppStatus;
  allowedRoles: Role[];
  branches?: string[];
  version?: string;
  isInternal: boolean;
  type: AppType;
  versionHistory?: { version: string; date: string; author: string; changes: string }[];
  visibility?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiCategory {
  _id: string;
  label: string;
  labelBg?: string;
  labelColor?: string;
  items: ApiApp[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

// ── Mappers ──
function mapAppToMenuItem(app: ApiApp): MenuItem {
  return {
    id: app._id,
    title: app.title,
    description: app.description,
    url: app.url,
    icon: app.icon,
    iconBg: app.iconBg,
    iconColor: app.iconColor,
    accentColor: app.accentColor,
    status: app.status,
    allowedRoles: app.allowedRoles,
    branches: app.branches,
    version: app.version,
    isInternal: app.isInternal,
    versionHistory: app.versionHistory,
  };
}

function mapCategoryToMenuGroup(cat: ApiCategory): MenuGroup {
  return {
    id: cat._id,
    label: cat.label,
    labelBg: cat.labelBg,
    labelColor: cat.labelColor,
    items: cat.items.map(mapAppToMenuItem),
  };
}

// ── RegisteredApp type for App Registry page ──
export interface RegisteredApp {
  id: string;
  name: string;
  url: string;
  status: AppStatus;
  lastUpdated: string;
  version: string;
  visibility: string;
  type: AppType;
}

function mapAppToRegisteredApp(app: ApiApp): RegisteredApp {
  const updatedAt = new Date(app.updatedAt);
  const now = new Date();
  const diffMs = now.getTime() - updatedAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let lastUpdated: string;
  if (diffMins < 1) lastUpdated = "Just now";
  else if (diffMins < 60) lastUpdated = `${diffMins}m ago`;
  else if (diffHours < 24) lastUpdated = `${diffHours}h ago`;
  else if (diffDays === 1) lastUpdated = "Yesterday";
  else lastUpdated = `${diffDays}d ago`;

  return {
    id: app._id,
    name: app.title,
    url: app.url,
    status: app.status,
    lastUpdated,
    version: app.version || "v1.0.0",
    visibility: app.visibility || "All Staff",
    type: app.type,
  };
}

// ── Category API ──
export async function fetchCategories(): Promise<MenuGroup[]> {
  const { data } = await api.get<ApiResponse<ApiCategory[]>>("/categories");
  return data.data.map(mapCategoryToMenuGroup);
}

// ── App API ──
export interface PaginatedApps {
  apps: RegisteredApp[];
  total: number;
  page: number;
  totalPages: number;
}

export async function fetchApps(params?: {
  status?: string;
  role?: string;
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<RegisteredApp[]> {
  const { data } = await api.get<ApiResponse<ApiApp[]>>("/apps", { params });
  return data.data.map(mapAppToRegisteredApp);
}

export async function fetchAppsPaginated(params: {
  page: number;
  limit: number;
  status?: string;
  role?: string;
  search?: string;
  type?: string;
}): Promise<PaginatedApps> {
  const { data } = await api.get<ApiResponse<ApiApp[]> & { total: number; page: number; totalPages: number }>("/apps", { params });
  return {
    apps: data.data.map(mapAppToRegisteredApp),
    total: data.total ?? 0,
    page: data.page ?? 1,
    totalPages: data.totalPages ?? 1,
  };
}

export async function createApp(appData: {
  title: string;
  url: string;
  status?: string;
  type?: string;
  visibility?: string;
  version?: string;
  isInternal?: boolean;
  allowedRoles?: string[];
}): Promise<RegisteredApp> {
  const { data } = await api.post<ApiResponse<ApiApp>>("/apps", appData);
  return mapAppToRegisteredApp(data.data);
}

export async function deleteApp(id: string): Promise<void> {
  await api.delete(`/apps/${id}`);
}

export async function updateApp(
  id: string,
  appData: Partial<ApiApp>
): Promise<RegisteredApp> {
  const { data } = await api.put<ApiResponse<ApiApp>>(`/apps/${id}`, appData);
  return mapAppToRegisteredApp(data.data);
}

export async function updateAppStatus(
  id: string,
  status: AppStatus
): Promise<RegisteredApp> {
  const { data } = await api.patch<ApiResponse<ApiApp>>(`/apps/${id}/status`, { status });
  return mapAppToRegisteredApp(data.data);
}

// ── Category management API ──
export interface CategoryOption {
  id: string;
  label: string;
}

export interface CategoryDetail {
  id: string;
  label: string;
  labelBg?: string;
  labelColor?: string;
  apps: { id: string; title: string; url: string; status: string; type: string }[];
  createdAt: string;
  updatedAt: string;
}

function mapCategoryDetail(cat: ApiCategory): CategoryDetail {
  return {
    id: cat._id,
    label: cat.label,
    labelBg: cat.labelBg,
    labelColor: cat.labelColor,
    apps: cat.items.map((a) => ({
      id: a._id,
      title: a.title,
      url: a.url,
      status: a.status,
      type: a.type,
    })),
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
  };
}

export async function fetchCategoryOptions(): Promise<CategoryOption[]> {
  const { data } = await api.get<ApiResponse<ApiCategory[]>>("/categories");
  return data.data.map((c) => ({ id: c._id, label: c.label }));
}

export async function fetchCategoryDetails(): Promise<CategoryDetail[]> {
  const { data } = await api.get<ApiResponse<ApiCategory[]>>("/categories");
  return data.data.map(mapCategoryDetail);
}

export async function createCategory(catData: {
  label: string;
  labelBg?: string;
  labelColor?: string;
}): Promise<CategoryDetail> {
  const { data } = await api.post<ApiResponse<ApiCategory>>("/categories", catData);
  return mapCategoryDetail(data.data);
}

export async function updateCategory(
  id: string,
  catData: { label?: string; labelBg?: string; labelColor?: string }
): Promise<CategoryDetail> {
  const { data } = await api.put<ApiResponse<ApiCategory>>(`/categories/${id}`, catData);
  return mapCategoryDetail(data.data);
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}

export async function addAppToCategory(categoryId: string, appId: string): Promise<void> {
  await api.post(`/categories/${categoryId}/apps`, { appId });
}

export async function removeAppFromCategory(categoryId: string, appId: string): Promise<void> {
  await api.delete(`/categories/${categoryId}/apps`, { data: { appId } });
}

// ── Audit Log API ──
export interface AuditLogEntry {
  _id: string;
  action: string;
  entity: "App" | "Category" | "System";
  entityId?: string;
  entityName?: string;
  actor: string;
  details?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  createdAt: string;
}

interface AuditLogListResponse {
  success: boolean;
  data: AuditLogEntry[];
  count: number;
  total?: number;
  page?: number;
  totalPages?: number;
}

export async function fetchAuditLogs(params?: {
  entity?: string;
  action?: string;
  actor?: string;
  limit?: number;
  page?: number;
}): Promise<AuditLogListResponse> {
  const { data } = await api.get<AuditLogListResponse>("/audit-logs", { params });
  return data;
}

export async function fetchLatestAuditLogs(limit = 5): Promise<AuditLogEntry[]> {
  const { data } = await api.get<ApiResponse<AuditLogEntry[]>>("/audit-logs/latest", {
    params: { limit },
  });
  return data.data;
}
