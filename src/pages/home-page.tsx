import { useState, useEffect, useRef } from 'react'
import { MenuGrid } from '@/components/menu-grid'
import { Search, CalendarDays, Activity, ShieldCheck, AlertCircle, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from "@/components/ui/card"

interface HomePageProps {
  userRole?: "SYSTEM-ADMIN" | "MANAGER" | "STAFF"
}

export function HomePage({ userRole = "STAFF" }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const currentDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  // Keyboard shortcut CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                  userRole === "SYSTEM-ADMIN" ? "bg-rose-50 text-rose-600 border-rose-100" :
                  userRole === "MANAGER" ? "bg-blue-50 text-blue-600 border-blue-100" :
                  "bg-slate-50 text-slate-600 border-slate-100"
                }`}>
                  {userRole} Mode
                </span>
                <div className="h-1 w-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1.5 text-slate-500">
                  <CalendarDays className="size-3.5" />
                  <span className="text-xs font-bold uppercase tracking-tight">{currentDate}</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Chào buổi sáng, <span className="text-primary italic">Mediplantex-ers!</span> 👋
              </h1>
              <p className="text-slate-500 text-sm font-medium max-w-lg">
                Hệ thống cổng thông tin tập trung và điều hành quản trị doanh nghiệp Mediplantex.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <Input
                ref={searchInputRef}
                placeholder="Tìm kiếm ứng dụng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-slate-50/50 border-slate-200 focus:bg-white transition-all shadow-sm rounded-2xl text-base"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-slate-100 uppercase"
                >
                  Xóa
                </button>
              ) : (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-1 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-400">
                  <span className="text-[12px]">⌘</span> K
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Role-Specific Control Center / Monitoring */}
        {userRole === "SYSTEM-ADMIN" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "System Health", value: "99.9%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Active Nodes", value: "12/12", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Pending Security Audit", value: "2", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "API Rate Margin", value: "84%", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((stat, i) => (
              <Card key={i} className="border-slate-100 shadow-sm rounded-2xl">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* Audit Log Snackbar (Admin Only) */}
        {userRole === "SYSTEM-ADMIN" && (
          <div className="mb-8 flex items-center gap-4 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl animate-in fade-in zoom-in slide-in-from-top-4 duration-700">
            <div className="p-2 bg-white/10 rounded-xl">
              <Clock className="size-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold tracking-wider text-white/50 uppercase">Active Audit Log</p>
              <p className="text-xs font-medium italic text-white/90">User "admin_root" updated Redirect URL for WMS_PROD_01</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 text-xs">
              14:22:01
            </div>
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {userRole === "SYSTEM-ADMIN" ? "Gateway Control Center" : 
               userRole === "MANAGER" ? "Departmental Dashboard" : "Danh mục Ứng dụng"}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {userRole === "SYSTEM-ADMIN" ? "Quản trị nền tảng và điều hướng ứng dụng toàn tập đoàn." : 
               "Theo dõi hoạt động và truy cập các công cụ điều hành."}
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <MenuGrid userRole={userRole} searchQuery={searchQuery} />
        </div>

        {/* Staff-only Help Section */}
        {userRole === "STAFF" && (
          <div className="mt-16 bg-slate-50 rounded-3xl p-8 border border-slate-200/60 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity className="size-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Bạn cần thêm quyền truy cập?</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md font-medium">
                Nếu bạn không tìm thấy ứng dụng cần thiết cho công việc, vui lòng gửi yêu cầu đến Quản lý trực tiếp của bạn.
              </p>
              <button className="bg-white border-2 border-slate-200 text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:border-primary hover:text-primary transition-all">
                Gửi yêu cầu truy cập mới
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
