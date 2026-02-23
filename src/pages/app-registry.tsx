import { useState, useEffect } from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink, 
  Trash2, 
  Pencil, 
  CheckCircle2, 
  AlertCircle, 
  Construction,
  ShieldCheck,
  Globe,
  Settings,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  fetchAppsPaginated,
  createApp as createAppApi,
  deleteApp as deleteAppApi,
  fetchCategoryOptions,
  addAppToCategory,
  type RegisteredApp,
  type CategoryOption,
} from "@/services/api"
import { ALL_ROLES, APP_TYPES, APP_STATUSES, type AppType, type AppStatus } from "@/constants/roles"

export function AppRegistry() {
  const [searchQuery, setSearchQuery] = useState("")
  const [allApps, setAllApps] = useState<RegisteredApp[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const limit = 10
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newApp, setNewApp] = useState<{
    name: string; url: string; status: string; type: string;
    visibility: string; version: string;
    allowedRoles: string[]; categoryId: string;
  }>({
    name: "",
    url: "",
    status: APP_STATUSES.ONLINE,
    type: APP_TYPES.INTERNAL,
    visibility: "All Staff",
    version: "v1.0.0",
    allowedRoles: [...ALL_ROLES],
    categoryId: "",
  })

  useEffect(() => {
    let cancelled = false
    const params: { page: number; limit: number; search?: string } = { page, limit }
    if (searchQuery.trim()) params.search = searchQuery.trim()

    fetchAppsPaginated(params)
      .then((res) => {
        if (!cancelled) {
          setAllApps(res.apps)
          setTotalPages(res.totalPages)
          setTotal(res.total)
        }
      })
      .catch((err) => console.error("Failed to fetch apps:", err))
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [page, refreshKey, searchQuery])

  useEffect(() => {
    fetchCategoryOptions()
      .then((cats) => setCategories(cats))
      .catch((err) => console.error("Failed to fetch categories:", err))
  }, [])

  const filteredApps = allApps

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newApp.name || !newApp.url) return

    try {
      const created = await createAppApi({
        title: newApp.name,
        url: newApp.url,
        status: newApp.status,
        type: newApp.type,
        visibility: newApp.visibility,
        version: newApp.version,
        isInternal: newApp.type === APP_TYPES.INTERNAL,
        allowedRoles: newApp.allowedRoles,
      })

      // Assign to category if selected
      if (newApp.categoryId) {
        try {
          await addAppToCategory(newApp.categoryId, created.id)
        } catch (err) {
          console.error("Failed to add app to category:", err)
        }
      }

      setAllApps([created, ...allApps.slice(0, limit - 1)])
      setTotal((t) => t + 1)
      setRefreshKey((k) => k + 1)
      setIsDialogOpen(false)
      setNewApp({
        name: "",
        url: "",
        status: APP_STATUSES.ONLINE,
        type: APP_TYPES.INTERNAL,
        visibility: "All Staff",
        version: "v1.0.0",
        allowedRoles: [...ALL_ROLES],
        categoryId: "",
      })
    } catch (err) {
      console.error("Failed to register app:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAppApi(id)
      setTotal((t) => t - 1)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      console.error("Failed to delete app:", err)
    }
  }

  const totalApps = total
  const internalApps = allApps.filter(a => a.type === APP_TYPES.INTERNAL).length
  const onlineApps = allApps.filter(a => a.status === APP_STATUSES.ONLINE).length

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">App Registry</h1>
          <p className="text-sm font-medium text-slate-500">Manage centralized application catalog and access URLs.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
             <Filter className="size-4 mr-2" /> Filter
           </Button>
           
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 px-5 rounded-xl bg-slate-950 text-white font-bold shadow-lg shadow-slate-200 transition-all hover:bg-slate-900">
                  <Plus className="size-4 mr-2" /> Register App
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
                <form onSubmit={handleRegister}>
                  <div className="bg-slate-950 px-8 py-6 text-white relative">
                    <DialogTitle className="text-2xl font-bold mb-1">New Application</DialogTitle>
                    <DialogDescription className="text-slate-400 font-medium">
                      Register a new tool or service to the Mediplantex hub.
                    </DialogDescription>
                    <div 
                      onClick={() => setIsDialogOpen(false)}
                      className="absolute right-6 top-6 size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <X className="size-5" />
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-6 bg-white">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">App Name</Label>
                        <Input 
                          id="name" 
                          placeholder="e.g., Marketing Analytics" 
                          required 
                          value={newApp.name}
                          onChange={(e) => setNewApp({...newApp, name: e.target.value})}
                          className="h-12 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus-visible:ring-1 focus-visible:ring-slate-300"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="url" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Access URL</Label>
                        <Input 
                          id="url" 
                          placeholder="https://app.mediplantex.vn" 
                          required 
                          value={newApp.url}
                          onChange={(e) => setNewApp({...newApp, url: e.target.value})}
                          className="h-12 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus-visible:ring-1 focus-visible:ring-slate-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Deployment Type</Label>
                          <Select 
                            value={newApp.type} 
                            onValueChange={(v: AppType) => setNewApp({...newApp, type: v})}
                          >
                            <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-1 focus:ring-slate-300">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200">
                              <SelectItem value={APP_TYPES.INTERNAL} className="font-bold rounded-lg cursor-pointer py-2">Internal Hub</SelectItem>
                              <SelectItem value={APP_TYPES.EXTERNAL} className="font-bold rounded-lg cursor-pointer py-2">External SaaS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Initial Status</Label>
                          <Select 
                            value={newApp.status} 
                            onValueChange={(v: AppStatus) => setNewApp({...newApp, status: v})}
                          >
                            <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-1 focus:ring-slate-300">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200">
                              <SelectItem value={APP_STATUSES.ONLINE} className="font-bold rounded-lg cursor-pointer py-2 text-emerald-600">Online</SelectItem>
                              <SelectItem value={APP_STATUSES.MAINTENANCE} className="font-bold rounded-lg cursor-pointer py-2 text-amber-600">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Allowed Roles multi-select */}
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Allowed Roles</Label>
                        <div className="flex flex-wrap gap-2">
                          {ALL_ROLES.map((role) => {
                            const selected = newApp.allowedRoles.includes(role)
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => {
                                  setNewApp((prev) => ({
                                    ...prev,
                                    allowedRoles: selected
                                      ? prev.allowedRoles.filter((r) => r !== role)
                                      : [...prev.allowedRoles, role],
                                  }))
                                }}
                                className={cn(
                                  "px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                                  selected
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-400"
                                )}
                              >
                                {role}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Category select */}
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Category</Label>
                        <Select
                          value={newApp.categoryId}
                          onValueChange={(v) => setNewApp({ ...newApp, categoryId: v })}
                        >
                          <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-1 focus:ring-slate-300">
                            <SelectValue placeholder="Select a category (optional)" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200">
                            <SelectItem value="none" className="font-bold rounded-lg cursor-pointer py-2 text-slate-400">None</SelectItem>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id} className="font-bold rounded-lg cursor-pointer py-2">
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="p-8 pt-0 bg-white sm:justify-start">
                    <Button type="submit" className="h-12 px-8 rounded-xl bg-slate-950 text-white font-bold w-full shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all">
                      Confirm Registration
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
           </Dialog>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Apps", count: String(totalApps), icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Internal Hub", count: String(internalApps), icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Online Services", count: String(onlineApps), icon: Settings, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-slate-200/60 shadow-none rounded-3xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Section */}
      <Card className="border-slate-200/60 shadow-none rounded-4xl overflow-hidden bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
             <Input 
               placeholder="Search registry..." 
               value={searchQuery}
               onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
               className="h-10 pl-10 bg-slate-50 border-none rounded-xl text-sm font-medium focus-visible:ring-1 focus-visible:ring-slate-300 w-full md:max-w-md shadow-none" 
             />
           </div>
           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-500">
             <span className="text-slate-900">{filteredApps.length}</span> results
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Application</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Version</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Visibility</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Loader2 className="size-6 animate-spin text-slate-400 mx-auto" />
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-400 font-medium">
                    Không tìm thấy ứng dụng nào.
                  </td>
                </tr>
              ) : filteredApps.map((app) => (
                <tr key={app.id} className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className={cn(
                          "size-10 rounded-xl flex items-center justify-center font-bold text-lg border shadow-sm transition-transform group-hover:scale-110",
                          app.type === APP_TYPES.INTERNAL ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-600 border-slate-200"
                        )}>
                           {app.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="text-sm font-bold text-slate-900 truncate tracking-tight">{app.name}</span>
                           <span className="text-[11px] font-medium text-slate-400 truncate flex items-center gap-1">
                             {app.url} <ExternalLink className="size-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </span>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        {app.status === APP_STATUSES.ONLINE && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold ring-1 ring-emerald-100 uppercase tracking-tight">
                            <CheckCircle2 className="size-3" /> Online
                          </div>
                        )}
                        {app.status === APP_STATUSES.OFFLINE && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-bold ring-1 ring-rose-100 uppercase tracking-tight">
                            <AlertCircle className="size-3" /> Offline
                          </div>
                        )}
                        {app.status === APP_STATUSES.MAINTENANCE && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-bold ring-1 ring-amber-100 uppercase tracking-tight">
                            <Construction className="size-3" /> Maintenance
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{app.lastUpdated}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <Badge variant="outline" className="rounded-lg bg-white border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 shadow-none">
                        {app.version}
                     </Badge>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-xs font-bold text-slate-600">{app.visibility}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="size-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 transition-colors">
                           <MoreHorizontal className="size-4" />
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border-slate-200/60">
                        <DropdownMenuLabel className="text-[11px] font-bold text-slate-400 uppercase p-2">App Config</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg font-bold text-sm gap-2 transition-all cursor-pointer">
                          <Pencil className="size-4 text-slate-400" /> Edit Metadata
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg font-bold text-sm gap-2 transition-all cursor-pointer">
                          < Globe className="size-4 text-slate-400" /> Redirect Rules
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(app.id)}
                          className="rounded-lg font-bold text-sm gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="size-4" /> Unregister
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
             Trang <span className="text-slate-900 font-bold">{page}</span> / {totalPages} · Tổng <span className="text-slate-900 font-bold">{total}</span> ứng dụng
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
             {Array.from({ length: totalPages }, (_, i) => i + 1)
               .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
               .reduce<(number | string)[]>((acc, p, idx, arr) => {
                 if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...")
                 acc.push(p)
                 return acc
               }, [])
               .map((p, idx) =>
                 typeof p === "string" ? (
                   <span key={`dots-${idx}`} className="text-xs text-slate-400 px-1">...</span>
                 ) : (
                   <Button
                     key={p}
                     variant="ghost"
                     size="sm"
                     className={cn(
                       "h-8 w-8 text-xs font-bold rounded-lg",
                       p === page
                         ? "text-slate-900 bg-white border border-slate-200 shadow-sm"
                         : "text-slate-400 hover:text-slate-900"
                     )}
                     onClick={() => { if (p !== page) { setLoading(true); setPage(p) } }}
                   >
                     {p}
                   </Button>
                 )
               )}
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
      </Card>
    </div>
  )
}
