import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Database, 
  ShieldCheck, 
  Users, 
  Settings, 
  ChevronRight, 
  Bell, 
  Search, 
  Plus,
  LifeBuoy,
  LogOut,
  User,
  PanelLeft,
  PieChart,
  Grid
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "SYSTEM-ADMIN" | "MANAGER" | "STAFF"
  onRoleChange: (role: "SYSTEM-ADMIN" | "MANAGER" | "STAFF") => void
}

export function DashboardLayout({ children, onRoleChange }: DashboardLayoutProps) {
  const location = useLocation()

  const platformNav = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/gateway-control" },
    { label: "App Registry", icon: Database, path: "/gateway-control/registry" },
    { label: "Security & RBAC", icon: ShieldCheck, path: "/gateway-control/rbac" },
    { label: "Analytics", icon: PieChart, path: "/gateway-control/analytics" },
  ]

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 selection:bg-slate-900 selection:text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-slate-200 bg-white shrink-0 relative transition-all">
        {/* Workspace Brand */}
        <div className="p-4">
          <div className="w-full flex items-center gap-2.5 rounded-xl bg-white transition-all text-left">
            <div className="size-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
              <Grid className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-900 truncate leading-tight tracking-tight">Mediplantex Inc.</p>
              <p className="text-[11px] font-medium text-slate-400 truncate tracking-tight">Enterprise Dashboard</p>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pt-2 space-y-6">
          {/* Platform */}
          <div className="space-y-1">
             <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Platform</p>
             {platformNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[13px] font-bold transition-all group",
                    location.pathname === item.path 
                      ? "bg-slate-950 text-white shadow-lg shadow-slate-200" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  )}
                >
                  <item.icon className={cn("size-[18px] transition-colors", location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                  {item.label}
                  {location.pathname === item.path && <ChevronRight className="size-3.5 ml-auto opacity-50" />}
                </Link>
             ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="px-3 py-4 space-y-1 mt-auto">
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[13px] font-bold text-slate-600 hover:bg-slate-100 transition-all">
            <LifeBuoy className="size-[18px] text-slate-400" />
            Support
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[13px] font-bold text-slate-600 hover:bg-slate-100 transition-all">
            <Settings className="size-[18px] text-slate-400" />
            Settings
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200/60 bg-slate-50/20">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-all text-left group cursor-pointer focus:outline-none">
                  <Avatar className="size-9 rounded-lg border border-slate-200 shadow-sm ring-2 ring-white">
                    <AvatarFallback className="bg-slate-900 text-white text-[10px] font-bold rounded-lg uppercase">AD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-900 truncate tracking-tight">Admin User</p>
                    <p className="text-[11px] font-medium text-slate-400 truncate">admin@mediplantex.vn</p>
                  </div>
                  <ChevronRight className="size-4 text-slate-400 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[228px] p-2 rounded-2xl shadow-2xl border-slate-200/60" align="end" side="top" sideOffset={12}>
                <DropdownMenuLabel className="px-2 py-2">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold truncate">Admin User</span>
                      <span className="text-[11px] font-medium text-slate-400">Management Account</span>
                   </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuItem className="rounded-xl flex items-center gap-3 py-2.5 transition-all cursor-pointer">
                  <User className="size-4 text-slate-400" />
                  <span className="font-bold text-sm">My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl flex items-center gap-3 py-2.5 transition-all cursor-pointer" onClick={() => onRoleChange("STAFF")}>
                  <Users className="size-4 text-slate-400" />
                  <span className="font-bold text-sm">Switch Hub</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuItem className="rounded-xl flex items-center gap-3 py-2.5 transition-all text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer">
                  <LogOut className="size-4" />
                  <span className="font-bold text-sm">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative border-l border-slate-200 lg:border-l-0">
        {/* Top Header */}
        <header className="h-[64px] border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                <PanelLeft className="size-5" />
             </Button>
             <nav className="hidden sm:flex items-center gap-2">
                <Link to="/" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">GC Hub</Link>
                <ChevronRight className="size-3 text-slate-300" />
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Management Console</span>
             </nav>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Search Bar */}
             <div className="relative group hidden md:block">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <Input 
                   placeholder="Search anything..." 
                   className="w-[280px] h-10 bg-slate-100/50 border-none rounded-xl pl-10 text-[13px] font-bold focus-visible:ring-1 focus-visible:ring-slate-300 transition-all shadow-none"
                />
             </div>

             <Button variant="ghost" size="icon" className="size-10 rounded-xl relative hover:bg-slate-100 transition-all shrink-0">
                <Bell className="size-5 text-slate-500" />
                <span className="absolute top-2.5 right-2.5 size-2 bg-rose-500 rounded-full ring-2 ring-white shadow-sm shadow-rose-200" />
             </Button>

             <Button className="h-10 px-5 gap-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-[13px] font-bold text-white shadow-lg shadow-slate-200 transition-all active:scale-[0.98] shrink-0">
                <Plus className="size-4" /> New Action
             </Button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/20">
           <div className="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-10">
              {children}
           </div>
        </div>
      </div>
    </div>
  )
}
