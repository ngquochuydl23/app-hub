import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pencil, ExternalLink, Info, Clock, CheckCircle2, ArrowRight } from "lucide-react"
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
  status?: "online" | "offline" | "maintenance"
  /** Roles that can see this app */
  allowedRoles?: ("SYSTEM-ADMIN" | "MANAGER" | "STAFF")[]
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

const defaultMenuGroups: MenuGroup[] = [
  {
    id: "admin-tools",
    label: "Hệ thống quản trị (Admin Control)",
    labelBg: "bg-fuchsia-100",
    labelColor: "text-fuchsia-700",
    items: [
      {
        id: "registry",
        title: "App Registry",
        description: "Quản lý mục lục & URLs ứng dụng trung tâm cho toàn bộ tập đoàn.",
        url: "/gateway-control/registry",
        icon: "🔐",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        status: "online",
        allowedRoles: ["SYSTEM-ADMIN", "MANAGER"],
        version: "v2.5.1",
        isInternal: true,
        versionHistory: [
          { version: "v2.5.1", date: "2024-05-20", author: "admin_root", changes: "Cập nhật logic phân phối URL theo vùng miền" },
          { version: "v2.4.9", date: "2024-05-15", author: "dev_team", changes: "Vá lỗi bảo mật CSRF trong console" },
        ],
      },
      {
        id: "permissions",
        title: "Role & RBAC",
        description: "Định nghĩa vai trò, gán quyền và quản lý vòng đời người dùng.",
        url: "/gateway-control/rbac",
        icon: "👥",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        status: "online",
        allowedRoles: ["SYSTEM-ADMIN", "MANAGER"],
        version: "v1.2.0",
        isInternal: true,
        versionHistory: [
          { version: "v1.2.0", date: "2024-02-10", author: "security_lead", changes: "Tích hợp EntraID v2" },
        ],
      },
      {
        id: "monitoring",
        title: "System Health",
        description: "Theo dõi tình trạng máy chủ, logs lỗi và hiệu năng thời gian thực.",
        url: "/gateway-control",
        icon: "📊",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        status: "maintenance",
        allowedRoles: ["SYSTEM-ADMIN", "MANAGER"],
        version: "v4.0.0-rc1",
        isInternal: true,
      },
    ],
  },
  {
    id: "pharmacy",
    label: "Nhà thuốc",
    labelBg: "bg-green-100",
    labelColor: "text-green-700",
    items: [
      {
        id: "pos",
        title: "POS Nhà thuốc",
        description: "Giao diện bán lẻ nhanh, tích hợp thanh toán QR và quản lý ca trực.",
        url: "https://pos.nhathuoc.vn",
        icon: "💊",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        status: "online",
        allowedRoles: ["STAFF", "MANAGER", "SYSTEM-ADMIN"],
        version: "v5.8.0",
      },
      {
        id: "pharmacy-mgmt",
        title: "Quản lý chuỗi",
        description: "Điều phối tồn kho giữa các chi nhánh, báo cáo doanh thu tổng hợp.",
        url: "https://mgmt.nhathuoc.vn",
        icon: "🏪",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        status: "online",
        allowedRoles: ["MANAGER", "SYSTEM-ADMIN"],
        version: "v3.2.1",
      },
    ],
  },
  {
    id: "warehouse",
    label: "Kho vận",
    labelBg: "bg-amber-100",
    labelColor: "text-amber-700",
    items: [
      {
        id: "wms",
        title: "Quản lý kho (WMS)",
        description: "Hệ thống quản lý nhập xuất, vị trí kho và tối ưu hóa lấy hàng.",
        url: "https://wms.nhathuoc.vn",
        icon: "🏭",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        status: "online",
        allowedRoles: ["STAFF", "MANAGER", "SYSTEM-ADMIN"],
        version: "v2.10.4",
        versionHistory: [
          { version: "v2.10.4", date: "2024-05-18", author: "wms_prod", changes: "Tối ưu hóa thuật toán FIFO cho kho mát" },
        ],
      },
    ],
  },
  {
    id: "clinic",
    label: "Phòng khám",
    labelBg: "bg-blue-100",
    labelColor: "text-blue-700",
    items: [
      {
        id: "emr",
        title: "Bệnh án điện tử",
        description: "Quản lý hồ sơ bệnh nhân, kết quả xét nghiệm và lịch sử khám bệnh.",
        url: "https://emr.phongkham.vn",
        icon: "🗂️",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        status: "online",
        allowedRoles: ["STAFF", "MANAGER", "SYSTEM-ADMIN"],
        version: "v1.4.0",
      },
    ],
  },
  {
    id: "hr",
    label: "Nhân sự",
    labelBg: "bg-purple-100",
    labelColor: "text-purple-700",
    items: [
      {
        id: "hrm",
        title: "Cổng nhân sự",
        description: "Xem bảng công, đăng ký nghỉ phép và cập nhật thông tin cá nhân.",
        url: "https://hrm.nhathuoc.vn",
        icon: "👤",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        status: "online",
        allowedRoles: ["STAFF", "MANAGER", "SYSTEM-ADMIN"],
        version: "v4.2.0",
      },
    ],
  },
  {
    id: "general",
    label: "Hệ thống chung",
    labelBg: "bg-slate-100",
    labelColor: "text-slate-700",
    items: [
      {
        id: "erp",
        title: "Hệ thống ERP",
        description: "Quản trị nguồn lực doanh nghiệp tích hợp kế toán và cung ứng.",
        url: "https://erp.nhathuoc.vn",
        icon: "🔗",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        status: "online",
        allowedRoles: ["STAFF", "MANAGER", "SYSTEM-ADMIN"],
        version: "v2024.Q1",
      },
      {
        id: "notifications",
        title: "Notification Hub",
        description: "Trung tâm quản lý thông báo, email và tin nhắn hệ thống tập trung.",
        url: "#",
        icon: "🔔",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-500",
        status: "online",
        allowedRoles: ["STAFF", "MANAGER", "SYSTEM-ADMIN"],
        version: "v2.0.1",
        isInternal: true,
      },
    ],
  },
]

interface MenuGridProps {
  groups?: MenuGroup[]
  userRole?: "SYSTEM-ADMIN" | "MANAGER" | "STAFF"
  searchQuery?: string
}

export function MenuGrid({ groups = defaultMenuGroups, userRole = "STAFF", searchQuery = "" }: MenuGridProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const navigate = useNavigate()

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
      {filteredGroups.map((group) => (
        <section key={group.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-6 flex items-center gap-4">
            <span
              className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold tracking-tight shadow-sm border ${group.labelBg ?? "bg-muted"} ${group.labelColor ?? "text-foreground"}`}
            >
              {group.label}
            </span>
            <div className="bg-slate-200 h-px flex-1 opacity-50" />

            {userRole === "SYSTEM-ADMIN" && (
              <button className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-wider">
                Configure Group
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {group.items.map((item) => {
              const isActive = item.status !== "offline";
              
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
                    {item.status === "maintenance" && (
                      <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200 uppercase">
                        <div className="size-1 rounded-full bg-amber-500 animate-pulse" />
                        Maint
                      </div>
                    )}
                    {item.status === "offline" && (
                      <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 border border-slate-200 uppercase">
                        Offline
                      </div>
                    )}
                    {isActive && item.status === "online" && item.version && item.isInternal && (
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
                      {userRole === "SYSTEM-ADMIN" && (
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
                    selectedItem?.status === "online" ? "bg-emerald-100 text-emerald-700" :
                    selectedItem?.status === "maintenance" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
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

          {userRole === "SYSTEM-ADMIN" && selectedItem?.versionHistory ? (
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
              disabled={selectedItem?.status === "maintenance"}
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
