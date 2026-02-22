import { useState } from "react"
import { Globe, LogOut, User, Bell, Info, AlertTriangle, Clock } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface HeaderProps {
  userName?: string
  avatarUrl?: string
  onViewProfile?: () => void
  onLogout?: () => void
  onLanguageChange?: (lang: string) => void
}

const notifications = [
  {
    id: "1",
    title: "Bảo trì hệ thống (Maintenance)",
    description: "Hệ thống ERP sẽ được bảo trì vào lúc 22:00 tối nay.",
    time: "10 phút trước",
    type: "maintenance",
    icon: <Clock className="size-4 text-amber-600" />,
    bg: "bg-amber-50",
  },
  {
    id: "2",
    title: "Thông báo Downtime",
    description: "Máy chủ Warehouse có thể bị gián đoạn truy cập trong 5-10 phút.",
    time: "1 giờ trước",
    type: "downtime",
    icon: <AlertTriangle className="size-4 text-rose-600" />,
    bg: "bg-rose-50",
  },
  {
    id: "3",
    title: "Cập nhật chính sách HRM",
    description: "Đã có quy định mới về việc đăng ký nghỉ phép năm 2026.",
    time: "2 giờ trước",
    type: "info",
    icon: <Info className="size-4 text-blue-600" />,
    bg: "bg-blue-50",
  },
]

const languages = [
  { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
  { value: "ko", label: "한국어", flag: "🇰🇷" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function Header({
  userName = "Người dùng",
  avatarUrl,
  onViewProfile,
  onLogout,
  onLanguageChange,
}: HeaderProps) {
  const [language, setLanguage] = useState("vi")

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    onLanguageChange?.(value)
  }

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg font-bold">
            M
          </div>
          <span className="text-lg font-bold tracking-tight">Mediplantex</span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 transition-colors focus:outline-none">
                <Bell className="size-5 text-slate-600" />
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-white ring-1 ring-rose-500/20 shadow-sm">
                  3
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 shadow-xl border-slate-200">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50">
                <h3 className="text-sm font-bold tracking-tight text-slate-900">Thông báo mới</h3>
                <button className="text-[10px] font-bold text-primary uppercase hover:underline">Đã xem tất cả</button>
              </div>
              <Separator />
              <div className="max-h-[380px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="group flex gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0"
                    >
                      <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${n.bg}`}>
                        {n.icon}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                            {n.title}
                          </span>
                          <span className="text-[10px] whitespace-nowrap text-slate-400 font-medium">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {n.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-slate-400">
                    <Bell className="mx-auto size-12 opacity-5" />
                    <p className="mt-2 text-sm italic">Không có thông báo mới</p>
                  </div>
                )}
              </div>
              <Separator />
              <button className="w-full py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all rounded-b-lg">
                Xem tất cả thông báo
              </button>
            </PopoverContent>
          </Popover>

          {/* Language Select */}
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-9 w-auto gap-1.5 border-none shadow-none">
              <Globe className="text-muted-foreground size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <span className="mr-1">{lang.flag}</span>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Avatar + Popover Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                <Avatar className="cursor-pointer transition-opacity hover:opacity-80">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-0">
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar size="sm">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-medium">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-tight">
                    {userName}
                  </span>
                </div>
              </div>
              <Separator />
              {/* Menu items */}
              <div className="p-1">
                <button
                  onClick={onViewProfile}
                  className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors"
                >
                  <User className="size-4" />
                  Xem hồ sơ
                </button>
                <button
                  onClick={onLogout}
                  className="hover:bg-destructive/10 text-destructive flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors"
                >
                  <LogOut className="size-4" />
                  Đăng xuất
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
