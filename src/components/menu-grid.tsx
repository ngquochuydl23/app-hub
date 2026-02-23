import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Pencil, ExternalLink, Info, Clock, CheckCircle2, ArrowRight, Loader2 } from "lucide-react"
import { fetchCategories } from "@/services/api"
import { type Role, type AppStatus, ROLES, APP_STATUSES } from "@/constants/roles"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export interface VersionEntry {
  version: string
  date: string
  author: string
  changes: string
}

export interface MenuItem {
  id: string
  title: string
  description?: string
  url: string
  icon?: string
  /** Tailwind bg color class for the icon badge */
  iconBg?: string
  /** Tailwind text color class for the icon */
  iconColor?: string
  /** Tailwind color for left accent border */
  accentColor?: string
  /** App Status */
  status?: AppStatus
  /** Roles that can see this app */
  allowedRoles?: Role[]
  /** Branch specific visibility */
  branches?: string[]
  /** App Version */
  version?: string
  /** Whether the app is developed/managed internally */
  isInternal?: boolean
  /** For System Admins only */
  versionHistory?: VersionEntry[]
}

export interface MenuGroup {
  id: string
  label: string
  /** Tailwind badge color for group label */
  labelBg?: string
  labelColor?: string
  items: MenuItem[]
}

interface MenuGridProps {
  userRole?: Role
  searchQuery?: string
}

export function MenuGrid({ userRole = ROLES.STAFF, searchQuery = "" }: MenuGridProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [groups, setGroups] = useState<MenuGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchCategories()
      .then((data) => setGroups(data))
      .catch((err) => {
        console.error("Failed to fetch categories:", err)
        setError("Không thể tải danh mục ứng dụng.")
      })
      .finally(() => setLoading(false))
  }, [])

  // Simple filtering based on role and search query
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const matchesRole = !item.allowedRoles || item.allowedRoles.includes(userRole);
        const matchesSearch = !searchQuery || 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
      }),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="flex flex-col gap-10">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-slate-400" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-rose-500 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && filteredGroups.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-400 font-medium">Không tìm thấy ứng dụng nào.</p>
        </div>
      )}

      {filteredGroups.map((group) => (
        <section key={group.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-6 flex items-center gap-4">
            <span
              className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold tracking-tight shadow-sm border ${group.labelBg ?? "bg-muted"} ${group.labelColor ?? "text-foreground"}`}
            >
              {group.label}
            </span>
            <div className="bg-slate-200 h-px flex-1 opacity-50" />

            {userRole === ROLES.SYSTEM_ADMIN && (
              <button className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-wider">
                Configure Group
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {group.items.map((item) => {
              const isActive = item.status !== APP_STATUSES.OFFLINE;
              
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isActive && item.url !== "#") {
                      if (item.url.startsWith("/")) {
                        navigate(item.url);
                      } else {
                        window.open(item.url, "_blank");
                      }
                    }
                  }}
                  className={`group relative flex flex-col rounded-3xl border bg-white p-5 shadow-sm transition-all ${
                    isActive && item.url !== "#" ? "cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary/30" : "cursor-default"
                  } ${
                    !isActive ? "opacity-60 grayscale" : ""
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    {item.status === APP_STATUSES.MAINTENANCE && (
                      <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200 uppercase">
                        <div className="size-1 rounded-full bg-amber-500 animate-pulse" />
                        Maint
                      </div>
                    )}
                    {item.status === APP_STATUSES.OFFLINE && (
                      <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 border border-slate-200 uppercase">
                        Offline
                      </div>
                    )}
                    {isActive && item.status === APP_STATUSES.ONLINE && item.version && item.isInternal && (
                      <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-100 uppercase">
                        {item.version}
                      </div>
                    )}
                  </div>

                  {/* Top row: icon + actions */}
                  <div className="mb-4 flex items-start justify-between relative z-10 pointer-events-none">
                    <div
                      className={`flex size-12 items-center justify-center rounded-2xl text-2xl shadow-sm border border-white/50 pointer-events-auto transition-transform group-hover:scale-110 ${item.iconBg ?? "bg-muted"} ${item.iconColor ?? "text-foreground"}`}
                    >
                      {item.icon ?? item.title.charAt(0)}
                    </div>

                    <div className="flex items-center gap-1 pointer-events-auto">
                      {userRole === ROLES.SYSTEM_ADMIN && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Edit:", item.id)
                          }}
                          className="text-slate-300 hover:text-primary hover:bg-primary/5 rounded-full p-2 transition-all"
                        >
                          <Pencil className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & description */}
                  <div className="flex-1 relative z-10 pointer-events-none">
                    <h3 className="mb-2 text-[17px] font-bold tracking-tight leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-slate-500 line-clamp-2 text-[13px] leading-relaxed font-medium">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-5 flex items-center justify-between relative z-10 pointer-events-none">
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold text-primary transition-all ${
                      (!isActive || item.url === "#") ? "hidden" : "opacity-0 group-hover:opacity-100 -translate-x-2.5 group-hover:translate-x-0"
                    }`}>
                      TRUY CẬP <ArrowRight className="size-3" />
                    </div>

                    <div className="flex items-center gap-2 pointer-events-auto">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setSelectedItem(item);
                              }}
                              className="text-slate-400 hover:text-primary hover:bg-slate-50 inline-flex size-9 items-center justify-center rounded-2xl border border-slate-100 transition-all shadow-xs"
                            >
                              <Info className="size-5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Xem thông tin chi tiết</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className={`size-16 flex items-center justify-center rounded-2xl text-3xl shadow-sm border ${selectedItem?.iconBg ?? "bg-slate-100"} ${selectedItem?.iconColor ?? "text-slate-600"}`}>
                {selectedItem?.icon ?? selectedItem?.title.charAt(0)}
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-bold">{selectedItem?.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    selectedItem?.status === APP_STATUSES.ONLINE ? "bg-emerald-100 text-emerald-700" :
                    selectedItem?.status === APP_STATUSES.MAINTENANCE ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {selectedItem?.status}
                  </span>
                  {selectedItem?.version && selectedItem?.isInternal && (
                    <span className="text-xs font-bold text-slate-400">Phiên bản: {selectedItem.version}</span>
                  )}
                </div>
              </div>
            </div>
            <DialogDescription className="text-slate-600 text-base leading-relaxed">
              {selectedItem?.description || "Không có mô tả chi tiết cho ứng dụng này."}
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-2" />

          {userRole === ROLES.SYSTEM_ADMIN && selectedItem?.versionHistory ? (
            <div className="space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900 uppercase tracking-wider">
                <Clock className="size-4 text-primary" /> Lịch sử phiên bản
              </h4>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden text-sm">
                {selectedItem.versionHistory.map((v, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b last:border-0 hover:bg-slate-100/50 transition-all">
                    <div className="flex gap-3">
                      <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{v.version}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{v.date}</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-0.5">{v.changes}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-[10px] font-bold text-slate-400 uppercase tracking-tighter sm:text-right">
                      By: {v.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="space-y-4">
               <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100">
                  <Info className="size-5 shrink-0" />
                  <p className="text-xs font-medium">Bạn đang sử dụng phiên bản ổn định nhất của ứng dụng này ({selectedItem?.version || "Latest"}).</p>
               </div>
               
               <div className="grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-500 uppercase">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="mb-1 text-[9px] opacity-60">Ngày cập nhật</p>
                    <p className="text-slate-900">22 Tháng 02, 2024</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="mb-1 text-[9px] opacity-60">Môi trường</p>
                    <p className="text-slate-900">PRODUCTION</p>
                  </div>
               </div>
             </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setSelectedItem(null)}
              className="flex-1 px-6 py-3 rounded-2xl border font-bold text-sm hover:bg-slate-50 transition-all"
            >
              Hủy
            </button>
            <button 
              disabled={selectedItem?.status === APP_STATUSES.MAINTENANCE}
              onClick={() => {
                if (selectedItem?.url) {
                  if (selectedItem.url.startsWith("/")) {
                    navigate(selectedItem.url);
                  } else {
                    window.open(selectedItem.url, "_blank");
                  }
                  setSelectedItem(null);
                }
              }}
              className={`flex-1 px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedItem?.status === "maintenance" 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border" 
                  : "bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20"
              }`}
            >
              <ExternalLink className="size-4" /> {selectedItem?.status === "maintenance" ? "ĐANG BẢO TRÌ" : "TRUY CẬP ỨNG DỤNG"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
