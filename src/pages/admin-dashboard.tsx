import { useState, useEffect } from "react"
import { 
  Activity, 
  Filter, 
  RefreshCw, 
  AppWindow, 
  FolderTree, 
  Settings, 
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchAuditLogs, type AuditLogEntry } from "@/services/api"

const ACTION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  APP_REGISTERED: { label: "Registered", color: "text-emerald-700", bg: "bg-emerald-50 ring-emerald-100" },
  APP_UPDATED: { label: "Updated", color: "text-blue-700", bg: "bg-blue-50 ring-blue-100" },
  APP_UNREGISTERED: { label: "Unregistered", color: "text-rose-700", bg: "bg-rose-50 ring-rose-100" },
  APP_STATUS_CHANGED: { label: "Status Changed", color: "text-amber-700", bg: "bg-amber-50 ring-amber-100" },
  CATEGORY_CREATED: { label: "Created", color: "text-emerald-700", bg: "bg-emerald-50 ring-emerald-100" },
  CATEGORY_UPDATED: { label: "Updated", color: "text-blue-700", bg: "bg-blue-50 ring-blue-100" },
  CATEGORY_DELETED: { label: "Deleted", color: "text-rose-700", bg: "bg-rose-50 ring-rose-100" },
  APP_ADDED_TO_CATEGORY: { label: "App Added", color: "text-indigo-700", bg: "bg-indigo-50 ring-indigo-100" },
  APP_REMOVED_FROM_CATEGORY: { label: "App Removed", color: "text-orange-700", bg: "bg-orange-50 ring-orange-100" },
}

const ENTITY_ICON: Record<string, typeof AppWindow> = {
  App: AppWindow,
  Category: FolderTree,
  System: Settings,
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function timeAgo(dateStr: string) {
  const now = new Date()
  const d = new Date(dateStr)
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Vừa xong"
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays === 1) return "Hôm qua"
  return `${diffDays} ngày trước`
}

export function AdminDashboard() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [entityFilter, setEntityFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const limit = 15

  useEffect(() => {
    let cancelled = false
    const params: Record<string, string | number> = { limit, page }
    if (entityFilter !== "all") params.entity = entityFilter

    fetchAuditLogs(params)
      .then((res) => {
        if (!cancelled) {
          setLogs(res.data)
          setTotalPages(res.totalPages || 1)
          setTotal(res.total || 0)
        }
      })
      .catch((err) => console.error("Failed to fetch audit logs:", err))
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [page, entityFilter, refreshKey])

  const handleRefresh = () => {
    setLoading(true)
    setRefreshKey((k) => k + 1)
  }

  // Group logs by date
  const groupedLogs: Record<string, AuditLogEntry[]> = {}
  logs.forEach((log) => {
    const dateKey = formatDate(log.createdAt)
    if (!groupedLogs[dateKey]) groupedLogs[dateKey] = []
    groupedLogs[dateKey].push(log)
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1 flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl text-white">
              <Activity className="size-5" />
            </div>
            Audit Log
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Theo dõi mọi thay đổi trên hệ thống Gateway Control Hub.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={entityFilter} onValueChange={(v) => { setLoading(true); setEntityFilter(v); setPage(1) }}>
            <SelectTrigger className="h-10 w-40 rounded-xl border-slate-200 font-bold text-sm">
              <Filter className="size-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="font-bold rounded-lg cursor-pointer">Tất cả</SelectItem>
              <SelectItem value="App" className="font-bold rounded-lg cursor-pointer">App</SelectItem>
              <SelectItem value="Category" className="font-bold rounded-lg cursor-pointer">Category</SelectItem>
              <SelectItem value="System" className="font-bold rounded-lg cursor-pointer">System</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600"
            onClick={() => handleRefresh()}
          >
            <RefreshCw className="size-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <span className="text-slate-900">{total}</span> bản ghi
        {entityFilter !== "all" && (
          <Badge variant="outline" className="rounded-lg text-[10px] font-bold px-2 py-0.5">
            {entityFilter}
          </Badge>
        )}
      </div>

      {/* Log Timeline */}
      <Card className="border-slate-200/60 shadow-none rounded-3xl overflow-hidden bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-slate-400" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-400 font-medium">Chưa có bản ghi audit log nào.</p>
          </div>
        ) : (
          <div>
            {Object.entries(groupedLogs).map(([date, dateLogs]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{date}</span>
                </div>

                {dateLogs.map((log) => {
                  const config = ACTION_CONFIG[log.action] || { label: log.action, color: "text-slate-700", bg: "bg-slate-50 ring-slate-100" }
                  const EntityIcon = ENTITY_ICON[log.entity] || Settings

                  return (
                    <div
                      key={log._id}
                      className="group flex items-start gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Timeline dot + icon */}
                      <div className="relative flex flex-col items-center pt-0.5">
                        <div className={cn("p-2 rounded-xl", config.bg, config.color)}>
                          <EntityIcon className="size-4" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-tight ring-1", config.bg, config.color)}>
                            {config.label}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">
                            {log.entity}
                          </span>
                          {log.entityName && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className="text-xs font-bold text-slate-700 truncate max-w-50">
                                {log.entityName}
                              </span>
                            </>
                          )}
                        </div>

                        {log.details && (
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {log.details}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            By: {log.actor}
                          </span>
                          {log.ip && (
                            <>
                              <span className="text-slate-200">·</span>
                              <span className="text-[10px] font-mono text-slate-300">{log.ip}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="text-right shrink-0">
                        <p className="text-xs font-mono font-bold text-slate-900">{formatTime(log.createdAt)}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{timeAgo(log.createdAt)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              Trang {page} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-bold text-slate-600 gap-1"
                disabled={page <= 1}
                onClick={() => { setLoading(true); setPage((p) => Math.max(1, p - 1)) }}
              >
                <ChevronLeft className="size-3" /> Trước
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-bold text-slate-600 gap-1"
                disabled={page >= totalPages}
                onClick={() => { setLoading(true); setPage((p) => p + 1) }}
              >
                Sau <ChevronRight className="size-3" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

