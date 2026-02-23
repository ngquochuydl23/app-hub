import { useState, useEffect } from "react"
import { APP_TYPES, APP_STATUSES } from "@/constants/roles"
import {
  Plus,
  Search,
  FolderTree,
  MoreHorizontal,
  Trash2,
  Pencil,
  X,
  Loader2,
  AppWindow,
  Palette,
  XCircle,
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
  DropdownMenuLabel,
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
  fetchCategoryDetails,
  createCategory as createCategoryApi,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
  removeAppFromCategory as removeAppFromCategoryApi,
  addAppToCategory as addAppToCategoryApi,
  fetchApps,
  type CategoryDetail,
  type RegisteredApp,
} from "@/services/api"

const COLOR_PRESETS = [
  { label: "Xanh dương", bg: "bg-blue-100", color: "text-blue-800", bgValue: "bg-blue-100", colorValue: "text-blue-800" },
  { label: "Xanh lá", bg: "bg-emerald-100", color: "text-emerald-800", bgValue: "bg-emerald-100", colorValue: "text-emerald-800" },
  { label: "Tím", bg: "bg-purple-100", color: "text-purple-800", bgValue: "bg-purple-100", colorValue: "text-purple-800" },
  { label: "Hồng", bg: "bg-pink-100", color: "text-pink-800", bgValue: "bg-pink-100", colorValue: "text-pink-800" },
  { label: "Cam", bg: "bg-orange-100", color: "text-orange-800", bgValue: "bg-orange-100", colorValue: "text-orange-800" },
  { label: "Vàng", bg: "bg-yellow-100", color: "text-yellow-800", bgValue: "bg-yellow-100", colorValue: "text-yellow-800" },
  { label: "Slate", bg: "bg-slate-100", color: "text-slate-800", bgValue: "bg-slate-100", colorValue: "text-slate-800" },
  { label: "Đỏ", bg: "bg-rose-100", color: "text-rose-800", bgValue: "bg-rose-100", colorValue: "text-rose-800" },
]

export function CategoryManager() {
  const [categories, setCategories] = useState<CategoryDetail[]>([])
  const [allApps, setAllApps] = useState<RegisteredApp[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Create dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newCat, setNewCat] = useState({ label: "", colorPreset: 0 })

  // Edit dialog
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editCat, setEditCat] = useState<{ id: string; label: string; colorPreset: number } | null>(null)

  // Add app dialog
  const [isAddAppOpen, setIsAddAppOpen] = useState(false)
  const [addAppTarget, setAddAppTarget] = useState<CategoryDetail | null>(null)
  const [selectedAppId, setSelectedAppId] = useState("")

  // Refresh key
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    Promise.all([fetchCategoryDetails(), fetchApps()])
      .then(([cats, apps]) => {
        if (!cancelled) {
          setCategories(cats)
          setAllApps(apps)
        }
      })
      .catch((err) => console.error("Failed to fetch data:", err))
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [refreshKey])

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCat.label.trim()) return

    const preset = COLOR_PRESETS[newCat.colorPreset]
    try {
      const created = await createCategoryApi({
        label: newCat.label.trim(),
        labelBg: preset.bgValue,
        labelColor: preset.colorValue,
      })
      setCategories([...categories, created])
      setIsCreateOpen(false)
      setNewCat({ label: "", colorPreset: 0 })
    } catch (err) {
      console.error("Failed to create category:", err)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCat || !editCat.label.trim()) return

    const preset = COLOR_PRESETS[editCat.colorPreset]
    try {
      const updated = await updateCategoryApi(editCat.id, {
        label: editCat.label.trim(),
        labelBg: preset.bgValue,
        labelColor: preset.colorValue,
      })
      setCategories(categories.map((c) => (c.id === updated.id ? updated : c)))
      setIsEditOpen(false)
      setEditCat(null)
    } catch (err) {
      console.error("Failed to update category:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCategoryApi(id)
      setCategories(categories.filter((c) => c.id !== id))
    } catch (err) {
      console.error("Failed to delete category:", err)
    }
  }

  const handleRemoveApp = async (categoryId: string, appId: string) => {
    try {
      await removeAppFromCategoryApi(categoryId, appId)
      setCategories(categories.map((c) => {
        if (c.id === categoryId) {
          return { ...c, apps: c.apps.filter((a) => a.id !== appId) }
        }
        return c
      }))
    } catch (err) {
      console.error("Failed to remove app:", err)
    }
  }

  const handleAddApp = async () => {
    if (!addAppTarget || !selectedAppId) return
    try {
      await addAppToCategoryApi(addAppTarget.id, selectedAppId)
      setRefreshKey((k) => k + 1)
      setIsAddAppOpen(false)
      setAddAppTarget(null)
      setSelectedAppId("")
    } catch (err) {
      console.error("Failed to add app:", err)
    }
  }

  const openEditDialog = (cat: CategoryDetail) => {
    const presetIdx = COLOR_PRESETS.findIndex((p) => p.bgValue === cat.labelBg)
    setEditCat({ id: cat.id, label: cat.label, colorPreset: presetIdx >= 0 ? presetIdx : 0 })
    setIsEditOpen(true)
  }

  const openAddAppDialog = (cat: CategoryDetail) => {
    setAddAppTarget(cat)
    setSelectedAppId("")
    setIsAddAppOpen(true)
  }

  const totalApps = categories.reduce((sum, c) => sum + c.apps.length, 0)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Category Manager</h1>
          <p className="text-sm font-medium text-slate-500">Organize applications into navigable groups.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 px-5 rounded-xl bg-slate-950 text-white font-bold shadow-lg shadow-slate-200 transition-all hover:bg-slate-900">
              <Plus className="size-4 mr-2" /> New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-110 p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
            <form onSubmit={handleCreate}>
              <div className="bg-slate-950 px-8 py-6 text-white relative">
                <DialogTitle className="text-2xl font-bold mb-1">New Category</DialogTitle>
                <DialogDescription className="text-slate-400 font-medium">
                  Create a new application group for the hub.
                </DialogDescription>
                <div
                  onClick={() => setIsCreateOpen(false)}
                  className="absolute right-6 top-6 size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </div>
              </div>
              <div className="p-8 space-y-5 bg-white">
                <div className="grid gap-2">
                  <Label htmlFor="cat-label" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Category Name</Label>
                  <Input
                    id="cat-label"
                    placeholder="e.g., Nhân sự & Hành chính"
                    required
                    value={newCat.label}
                    onChange={(e) => setNewCat({ ...newCat, label: e.target.value })}
                    className="h-12 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus-visible:ring-1 focus-visible:ring-slate-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Label Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewCat({ ...newCat, colorPreset: idx })}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2",
                          preset.bg, preset.color,
                          newCat.colorPreset === idx ? "border-slate-900 ring-2 ring-slate-200" : "border-transparent"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter className="p-8 pt-0 bg-white sm:justify-start">
                <Button type="submit" className="h-12 px-8 rounded-xl bg-slate-950 text-white font-bold w-full shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all">
                  Create Category
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Categories", count: String(categories.length), icon: FolderTree, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Total Apps Assigned", count: String(totalApps), icon: AppWindow, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Color Themes", count: String(COLOR_PRESETS.length), icon: Palette, color: "text-pink-600", bg: "bg-pink-50" },
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

      {/* Search */}
      <Card className="border-slate-200/60 shadow-none rounded-4xl overflow-hidden bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 bg-slate-50 border-none rounded-xl text-sm font-medium focus-visible:ring-1 focus-visible:ring-slate-300 w-full md:max-w-md shadow-none"
            />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-500">
            <span className="text-slate-900">{filteredCategories.length}</span> results
          </div>
        </div>

        {/* Category Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-slate-400" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-400 font-medium">Không tìm thấy category nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredCategories.map((cat) => (
              <div key={cat.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl", cat.labelBg || "bg-slate-100")}>
                      <FolderTree className={cn("size-5", cat.labelColor || "text-slate-600")} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{cat.label}</h3>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        {cat.apps.length} app{cat.apps.length !== 1 && "s"} · Updated {new Date(cat.updatedAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <Badge className={cn("ml-2 rounded-lg text-[10px] font-bold px-2 py-0.5 shadow-none", cat.labelBg || "bg-slate-100", cat.labelColor || "text-slate-700")}>
                      {cat.label}
                    </Badge>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 transition-colors">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border-slate-200/60">
                      <DropdownMenuLabel className="text-[11px] font-bold text-slate-400 uppercase p-2">Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => openAddAppDialog(cat)}
                        className="rounded-lg font-bold text-sm gap-2 transition-all cursor-pointer"
                      >
                        <Plus className="size-4 text-slate-400" /> Add App
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openEditDialog(cat)}
                        className="rounded-lg font-bold text-sm gap-2 transition-all cursor-pointer"
                      >
                        <Pencil className="size-4 text-slate-400" /> Edit Category
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuItem
                        onClick={() => handleDelete(cat.id)}
                        className="rounded-lg font-bold text-sm gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="size-4" /> Delete Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* App List */}
                {cat.apps.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cat.apps.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center gap-2 pl-3 pr-1 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm group/app hover:border-slate-300 transition-all"
                      >
                        <div className={cn(
                          "size-6 rounded-lg flex items-center justify-center text-[10px] font-bold",
                          app.type === APP_TYPES.INTERNAL ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-600"
                        )}>
                          {app.title.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{app.title}</span>
                        <div className={cn(
                          "size-1.5 rounded-full",
                          app.status === APP_STATUSES.ONLINE ? "bg-emerald-500" : app.status === APP_STATUSES.MAINTENANCE ? "bg-amber-500" : "bg-rose-500"
                        )} />
                        <button
                          onClick={() => handleRemoveApp(cat.id, app.id)}
                          className="size-6 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover/app:opacity-100"
                          title="Remove from category"
                        >
                          <XCircle className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium italic">No apps assigned yet.</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest italic">Mediplantex Gateway Control Hub</p>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-110 p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
          <form onSubmit={handleEdit}>
            <div className="bg-slate-950 px-8 py-6 text-white relative">
              <DialogTitle className="text-2xl font-bold mb-1">Edit Category</DialogTitle>
              <DialogDescription className="text-slate-400 font-medium">
                Update category name and color.
              </DialogDescription>
              <div
                onClick={() => setIsEditOpen(false)}
                className="absolute right-6 top-6 size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </div>
            </div>
            <div className="p-8 space-y-5 bg-white">
              <div className="grid gap-2">
                <Label htmlFor="edit-label" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Category Name</Label>
                <Input
                  id="edit-label"
                  placeholder="Category label"
                  required
                  value={editCat?.label || ""}
                  onChange={(e) => setEditCat(editCat ? { ...editCat, label: e.target.value } : null)}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus-visible:ring-1 focus-visible:ring-slate-300"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Label Color</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditCat(editCat ? { ...editCat, colorPreset: idx } : null)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2",
                        preset.bg, preset.color,
                        editCat?.colorPreset === idx ? "border-slate-900 ring-2 ring-slate-200" : "border-transparent"
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 pt-0 bg-white sm:justify-start">
              <Button type="submit" className="h-12 px-8 rounded-xl bg-slate-950 text-white font-bold w-full shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add App to Category Dialog */}
      <Dialog open={isAddAppOpen} onOpenChange={setIsAddAppOpen}>
        <DialogContent className="sm:max-w-110 p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
          <div className="bg-slate-950 px-8 py-6 text-white relative">
            <DialogTitle className="text-2xl font-bold mb-1">Add App</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Assign an app to "{addAppTarget?.label}".
            </DialogDescription>
            <div
              onClick={() => setIsAddAppOpen(false)}
              className="absolute right-6 top-6 size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </div>
          </div>
          <div className="p-8 space-y-5 bg-white">
            <div className="grid gap-2">
              <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Select Application</Label>
              <Select value={selectedAppId} onValueChange={setSelectedAppId}>
                <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-1 focus:ring-slate-300">
                  <SelectValue placeholder="Choose an app..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 max-h-60">
                  {allApps
                    .filter((app) => !addAppTarget?.apps.some((a) => a.id === app.id))
                    .map((app) => (
                      <SelectItem key={app.id} value={app.id} className="font-bold rounded-lg cursor-pointer py-2">
                        {app.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="p-8 pt-0 bg-white sm:justify-start">
            <Button
              type="button"
              onClick={handleAddApp}
              disabled={!selectedAppId}
              className="h-12 px-8 rounded-xl bg-slate-950 text-white font-bold w-full shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all disabled:opacity-40"
            >
              Assign to Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
