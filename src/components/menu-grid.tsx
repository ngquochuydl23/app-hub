import { Pencil, ExternalLink, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    id: "pharmacy",
    label: "Nhà thuốc",
    labelBg: "bg-green-100",
    labelColor: "text-green-700",
    items: [
      {
        id: "pos",
        title: "POS Nhà thuốc",
        description: "Bán hàng tại quầy & thanh toán",
        url: "https://pos.nhathuoc.vn",
        icon: "💊",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        accentColor: "border-l-green-500",
      },
      {
        id: "pharmacy-mgmt",
        title: "Quản lý nhà thuốc",
        description: "Chuỗi nhà thuốc & chi nhánh",
        url: "https://mgmt.nhathuoc.vn",
        icon: "🏪",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        accentColor: "border-l-emerald-500",
      },
      {
        id: "prescription",
        title: "Đơn thuốc",
        description: "Kê đơn & kiểm tra tương tác",
        url: "https://prescription.nhathuoc.vn",
        icon: "📝",
        iconBg: "bg-teal-100",
        iconColor: "text-teal-600",
        accentColor: "border-l-teal-500",
      },
      {
        id: "pharmacy-report",
        title: "Báo cáo dược",
        description: "Doanh thu & báo cáo GPP",
        url: "https://report.nhathuoc.vn",
        icon: "📊",
        iconBg: "bg-cyan-100",
        iconColor: "text-cyan-600",
        accentColor: "border-l-cyan-500",
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
        description: "Nhập xuất tồn & kiểm kê",
        url: "https://wms.nhathuoc.vn",
        icon: "🏭",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        accentColor: "border-l-amber-500",
      },
      {
        id: "procurement",
        title: "Mua hàng",
        description: "Đặt hàng & nhà cung cấp",
        url: "https://procurement.nhathuoc.vn",
        icon: "🛒",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        accentColor: "border-l-orange-500",
      },
      {
        id: "logistics",
        title: "Vận chuyển",
        description: "Giao nhận & tuyến đường",
        url: "https://logistics.nhathuoc.vn",
        icon: "🚚",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        accentColor: "border-l-yellow-500",
      },
      {
        id: "inventory",
        title: "Kiểm kê tồn kho",
        description: "Cảnh báo hết hạn & lô hàng",
        url: "https://inventory.nhathuoc.vn",
        icon: "📋",
        iconBg: "bg-lime-100",
        iconColor: "text-lime-600",
        accentColor: "border-l-lime-500",
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
        id: "clinic-booking",
        title: "Đặt lịch khám",
        description: "Lịch hẹn & lịch bác sĩ",
        url: "https://booking.phongkham.vn",
        icon: "📅",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        accentColor: "border-l-blue-500",
      },
      {
        id: "emr",
        title: "Bệnh án (EMR)",
        description: "Hồ sơ bệnh án & xét nghiệm",
        url: "https://emr.phongkham.vn",
        icon: "🗂️",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        accentColor: "border-l-indigo-500",
      },
      {
        id: "clinic-mgmt",
        title: "Quản lý phòng khám",
        description: "Bác sĩ, thiết bị & dịch vụ",
        url: "https://mgmt.phongkham.vn",
        icon: "🏥",
        iconBg: "bg-sky-100",
        iconColor: "text-sky-600",
        accentColor: "border-l-sky-500",
      },
      {
        id: "lab",
        title: "Xét nghiệm (LIS)",
        description: "Mẫu xét nghiệm & kết quả",
        url: "https://lab.phongkham.vn",
        icon: "🔬",
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
        accentColor: "border-l-violet-500",
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
        title: "Nhân sự (HRM)",
        description: "Hồ sơ & hợp đồng nhân viên",
        url: "https://hrm.nhathuoc.vn",
        icon: "👤",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        accentColor: "border-l-purple-500",
      },
      {
        id: "payroll",
        title: "Bảng lương",
        description: "Lương, thuế & bảo hiểm",
        url: "https://payroll.nhathuoc.vn",
        icon: "💰",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        accentColor: "border-l-rose-500",
      },
      {
        id: "attendance",
        title: "Chấm công",
        description: "Ca làm, nghỉ phép & tăng ca",
        url: "https://attendance.nhathuoc.vn",
        icon: "⏰",
        iconBg: "bg-pink-100",
        iconColor: "text-pink-600",
        accentColor: "border-l-pink-500",
      },
      {
        id: "recruitment",
        title: "Tuyển dụng",
        description: "Ứng viên & phỏng vấn",
        url: "https://recruitment.nhathuoc.vn",
        icon: "🎯",
        iconBg: "bg-fuchsia-100",
        iconColor: "text-fuchsia-600",
        accentColor: "border-l-fuchsia-500",
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
        title: "ERP",
        description: "Hoạch định tài nguyên DN",
        url: "https://erp.nhathuoc.vn",
        icon: "🔗",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        accentColor: "border-l-slate-500",
      },
      {
        id: "email",
        title: "Email nội bộ",
        description: "Email & liên lạc tập đoàn",
        url: "https://mail.nhathuoc.vn",
        icon: "📧",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-500",
        accentColor: "border-l-blue-400",
      },
      {
        id: "wiki",
        title: "Tri thức (Wiki)",
        description: "Quy trình SOP & đào tạo",
        url: "https://wiki.nhathuoc.vn",
        icon: "📚",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-500",
        accentColor: "border-l-amber-400",
      },
      {
        id: "helpdesk",
        title: "Helpdesk IT",
        description: "Hỗ trợ kỹ thuật & sự cố",
        url: "https://helpdesk.nhathuoc.vn",
        icon: "🎧",
        iconBg: "bg-green-100",
        iconColor: "text-green-500",
        accentColor: "border-l-green-400",
      },
      {
        id: "notifications",
        title: "Trung tâm thông báo",
        description: "Xem tin tức, bảo trì & cảnh báo",
        url: "#",
        icon: "🔔",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-500",
        accentColor: "border-l-rose-400",
      },
    ],
  },
]

interface MenuGridProps {
  groups?: MenuGroup[]
}

export function MenuGrid({ groups = defaultMenuGroups }: MenuGridProps) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.id}>
          <div className="mb-5 flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold tracking-tight shadow-sm ${group.labelBg ?? "bg-muted"} ${group.labelColor ?? "text-foreground"}`}
            >
              {group.label}
            </span>
            <div className="bg-border h-px flex-1 opacity-60" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {group.items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20"
              >
                {/* Invisible Overlay Link for Native Browser Behavior (Right-click "Open in new tab") */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-0 rounded-2xl"
                  aria-label={`Mở ${item.title}`}
                />

                {/* Top row: icon + edit */}
                <div className="mb-3 flex items-start justify-between relative z-10 pointer-events-none">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl text-lg pointer-events-auto ${item.iconBg ?? "bg-muted"} ${item.iconColor ?? "text-foreground"}`}
                  >
                    {item.icon ?? item.title.charAt(0)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log("Edit:", item.id)
                    }}
                    className="text-muted-foreground/30 hover:text-muted-foreground rounded-full p-1 transition-colors pointer-events-auto"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>

                {/* Title & description */}
                <div className="flex-1 relative z-10 pointer-events-none">
                  <h3 className="mb-1.5 text-base font-bold tracking-tight leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Info button */}
                <div className="mt-4 flex items-center justify-between relative z-10 pointer-events-none">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="size-3" />
                    TRUY CẬP
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log("Info:", item.id)
                        }}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-full border border-slate-200 transition-colors pointer-events-auto"
                      >
                        <Info className="size-4" />
                        <span className="sr-only">Xem chi tiết</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Xem thông tin chi tiết</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
